import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { extractBookingIdentity, bookingLeadEventId } from "@/lib/booking-lead";
import { sendLeadToMetaCapi } from "@/lib/meta-capi";
import { SITE } from "@/lib/site";

/**
 * HubSpot webhook → Meta Conversions API.
 *
 * Fires a server-side `Lead` when a meeting is booked, using the SAME event id
 * the browser Pixel derives for that booking, so Meta deduplicates the pair.
 * This recovers conversions the browser Pixel loses to ad blockers / ITP.
 *
 * Auth is FAIL-CLOSED: without a configured secret the endpoint rejects every
 * request, so nobody can inject fake conversions.
 *
 * Configure ONE of:
 *  - HUBSPOT_WEBHOOK_SECRET  (workflow webhooks: send as `x-webhook-secret`
 *    header or `?secret=` query param)
 *  - HUBSPOT_CLIENT_SECRET   (private-app webhooks: validates HubSpot's
 *    `X-HubSpot-Signature-v3`)
 * Plus META_CAPI_ACCESS_TOKEN (+ META_PIXEL_ID or NEXT_PUBLIC_META_PIXEL_ID).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIGNATURE_AGE_MS = 5 * 60 * 1000;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/** HubSpot signature v3: base64(hmac-sha256(secret, method + uri + body + timestamp)). */
function hasValidHubSpotSignature(request: Request, rawBody: string, clientSecret: string): boolean {
  const signature = request.headers.get("x-hubspot-signature-v3");
  const timestamp = request.headers.get("x-hubspot-request-timestamp");
  if (!signature || !timestamp) return false;

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age > MAX_SIGNATURE_AGE_MS || age < -MAX_SIGNATURE_AGE_MS) return false;

  const expected = crypto
    .createHmac("sha256", clientSecret)
    .update(`POST${request.url}${rawBody}${timestamp}`, "utf8")
    .digest("base64");

  return safeEqual(signature, expected);
}

function isAuthorised(request: Request, rawBody: string): boolean {
  const sharedSecret = process.env.HUBSPOT_WEBHOOK_SECRET;
  if (sharedSecret) {
    const headerSecret = request.headers.get("x-webhook-secret") ?? "";
    const querySecret = new URL(request.url).searchParams.get("secret") ?? "";
    if (safeEqual(headerSecret, sharedSecret) || safeEqual(querySecret, sharedSecret)) return true;
  }

  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET;
  if (clientSecret && hasValidHubSpotSignature(request, rawBody, clientSecret)) return true;

  return false;
}

/** HubSpot sends either a single object (workflow) or an array (app webhooks). */
function toBookings(parsed: unknown): unknown[] {
  if (Array.isArray(parsed)) return parsed;
  return [parsed];
}

export async function POST(request: Request) {
  const configured = Boolean(process.env.HUBSPOT_WEBHOOK_SECRET || process.env.HUBSPOT_CLIENT_SECRET);
  if (!configured) {
    console.error("[meta-capi] webhook secret not configured — rejecting request");
    return NextResponse.json({ ok: false, error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!isAuthorised(request, rawBody)) {
    return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const results: { eventId: string; sent: boolean; reason?: string }[] = [];

  for (const booking of toBookings(parsed)) {
    const identity = extractBookingIdentity(booking);
    const eventId = bookingLeadEventId(identity);

    // Without an email the event can't be attributed — skip rather than send noise.
    if (!identity.email) {
      results.push({ eventId, sent: false, reason: "no_identifiers" });
      continue;
    }

    const result = await sendLeadToMetaCapi({
      eventId,
      email: identity.email,
      eventTimeMs: identity.startTime ? Number(identity.startTime) : Date.now(),
      eventSourceUrl: `${SITE.url}/book`,
    });

    if (!result.sent) {
      console.error("[meta-capi] Lead not sent:", result.reason, result.detail ?? "");
    }
    results.push({ eventId, sent: result.sent, ...(result.sent ? {} : { reason: result.reason }) });
  }

  // Always 200 once authorised, so HubSpot doesn't retry on a tracking-side issue.
  return NextResponse.json({ ok: true, results });
}
