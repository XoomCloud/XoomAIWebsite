import assert from "node:assert/strict";
import crypto from "node:crypto";
import { afterEach, beforeEach, test } from "node:test";
import { POST } from "../src/app/api/hubspot/meeting-booked/route";
import { bookingEventId, isHubSpotOrigin, isBookingConfirmed } from "../src/lib/booking-lead";
import { META_PIXEL_ID, trackMetaCustom } from "../src/lib/meta";

const envKeys = ["HUBSPOT_WEBHOOK_SECRET", "HUBSPOT_CLIENT_SECRET", "META_CAPI_ACCESS_TOKEN", "META_PIXEL_ID", "META_TEST_EVENT_CODE"];
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
const endpoint = "https://xoomai.com.au/api/hubspot/meeting-booked";
const appointment = "2026-12-01T02:00:00Z";
const booking = { email: " Test@Example.com ", hs_meeting_start_time: appointment, event_source_url: "https://xoomai.com.au/takeaweekoff/book?email=private#fragment" };
type MetaBody = { data: { event_time: number; event_name: string; event_id: string; event_source_url: string; custom_data: { content_name: string; value?: number }; user_data: { em: string[] } }[] };
let requests: { url: string; body: MetaBody; headers: Headers }[] = [];

beforeEach(() => {
  envKeys.forEach((key) => delete process.env[key]);
  process.env.HUBSPOT_WEBHOOK_SECRET = "test-only-secret";
  process.env.META_CAPI_ACCESS_TOKEN = "test-only-token";
  requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), body: JSON.parse(String(init?.body)), headers: new Headers(init?.headers) });
    return Response.json({ events_received: 1 });
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  Reflect.deleteProperty(globalThis, "window");
});

function request(body: unknown = booking, secret = "test-only-secret") {
  return new Request(endpoint, { method: "POST", headers: { "x-webhook-secret": secret }, body: JSON.stringify(body) });
}

test("confirmed booking sends hashed Lead with receipt time, canonical campaign URL and shared Pixel id", async () => {
  const before = Math.floor(Date.now() / 1000);
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.equal(requests.length, 1);
  const { url, body, headers } = requests[0];
  const event = body.data[0];
  assert.ok(event.event_time >= before && event.event_time <= Math.floor(Date.now() / 1000));
  assert.notEqual(event.event_time, Date.parse(appointment) / 1000);
  assert.equal(event.event_name, "Lead");
  assert.equal(event.event_source_url, "https://xoomai.com.au/takeaweekoff/book");
  assert.equal(event.custom_data.content_name, "Free AI Workflow Audit");
  assert.equal(event.custom_data.value, undefined);
  assert.deepEqual(event.user_data.em, [crypto.createHash("sha256").update("test@example.com").digest("hex")]);
  assert.ok(url.endsWith(`/${META_PIXEL_ID}/events`));
  assert.ok(!url.includes("test-only-token"));
  assert.equal(headers.get("authorization"), "Bearer test-only-token");
});

test("browser ISO identity and webhook epoch identity produce the same id across retries", async () => {
  const browserId = bookingEventId({ email: "test@example.com", startTime: appointment });
  const payload = { ...booking, hs_meeting_start_time: Date.parse(appointment) };
  await POST(request(payload));
  await POST(request(payload));
  assert.deepEqual(requests.map((r) => r.body.data[0].event_id), [browserId, browserId]);
});

test("explicit booking creation time is preserved on delayed delivery", async () => {
  const created = Date.now() - 60_000;
  assert.equal((await POST(request({ ...booking, booking_created_at: new Date(created).toISOString() }))).status, 200);
  assert.equal(requests[0].body.data[0].event_time, Math.floor(created / 1000));
});

test("future, stale and invalid conversion timestamps cannot reach Meta", async () => {
  for (const created of [Date.now() + 86400000, Date.now() - 8 * 86400000, "invalid"]) {
    assert.equal((await POST(request({ ...booking, booking_created_at: created }))).status, 422);
  }
  assert.equal(requests.length, 0);
});

test("missing and invalid webhook authentication fail closed", async () => {
  assert.equal((await POST(request(booking, "wrong"))).status, 401);
  delete process.env.HUBSPOT_WEBHOOK_SECRET;
  assert.equal((await POST(request())).status, 503);
  assert.equal(requests.length, 0);
});

test("missing CAPI token remains retryable and does not send", async () => {
  delete process.env.META_CAPI_ACCESS_TOKEN;
  assert.equal((await POST(request())).status, 503);
  assert.equal(requests.length, 0);
});

test("HTTP errors, missing Meta receipts and network errors remain retryable", async () => {
  for (const mode of ["http", "receipt", "network"]) {
    globalThis.fetch = async () => {
      if (mode === "network") throw new Error("offline");
      return Response.json({ events_received: 0 }, { status: mode === "http" ? 500 : 200 });
    };
    assert.equal((await POST(request())).status, 503);
  }
});

test("malformed and incomplete booking payloads do not create leads", async () => {
  for (const payload of [null, [], [null], "text"]) assert.equal((await POST(request(payload))).status, 400);
  for (const payload of [{ email: "test@example.com" }, { hs_meeting_start_time: appointment }, { email: "test@example.com", timestamp: Date.now() }]) {
    assert.equal((await POST(request(payload))).status, 422);
  }
  assert.equal(requests.length, 0);
});

test("unapproved source URLs do not send query data or third-party URLs", async () => {
  await POST(request({ ...booking, event_source_url: "https://attacker.example/book?email=private" }));
  assert.equal(requests[0].body.data[0].event_source_url, "https://xoomai.com.au/book");
});

test("HubSpot v3 signatures use the specified URI decoding and reject replays", async () => {
  delete process.env.HUBSPOT_WEBHOOK_SECRET;
  process.env.HUBSPOT_CLIENT_SECRET = "test-client-secret";
  const url = `${endpoint}?path=%2Ftakeaweekoff&space=%20`;
  const body = JSON.stringify(booking);
  for (const stale of [false, true]) {
    const timestamp = String(Date.now() - (stale ? 600000 : 0));
    const signature = crypto.createHmac("sha256", "test-client-secret").update(`POST${endpoint}?path=/takeaweekoff&space=%20${body}${timestamp}`).digest("base64");
    const response = await POST(new Request(url, { method: "POST", body, headers: { "x-hubspot-request-timestamp": timestamp, "x-hubspot-signature-v3": signature } }));
    assert.equal(response.status, stale ? 401 : 200);
  }
  assert.equal(requests.length, 1);
});

test("CTA intent queues until Pixel ready and never fires Lead", () => {
  const fakeWindow = Object.assign(new EventTarget(), { fbq: undefined as undefined | ((...args: unknown[]) => void) });
  Object.defineProperty(globalThis, "window", { value: fakeWindow, configurable: true });
  const calls: unknown[][] = [];
  trackMetaCustom("AuditBookingClick", { placement: "hero", campaign: "take-a-week-off" });
  assert.equal(calls.length, 0);
  fakeWindow.fbq = (...args) => calls.push(args);
  fakeWindow.dispatchEvent(new Event("metaPixelReady"));
  fakeWindow.dispatchEvent(new Event("metaPixelReady"));
  assert.deepEqual(calls, [["trackCustom", "AuditBookingClick", { placement: "hero", campaign: "take-a-week-off" }]]);
});

test("only trusted HTTPS HubSpot origins and booking confirmation signals qualify", () => {
  assert.equal(isHubSpotOrigin("https://meetings.hubspot.com"), true);
  for (const origin of ["http://meetings.hubspot.com", "https://hubspot.com.attacker.com", "null"]) assert.equal(isHubSpotOrigin(origin), false);
  assert.equal(isBookingConfirmed({ meetingBookSucceeded: true }), true);
  assert.equal(isBookingConfirmed({ meetingBookSucceeded: false }), false);
  assert.equal(isBookingConfirmed({ event: "loaded" }), false);
});
