import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { extractBookingIdentity, bookingLeadEventId } from "@/lib/booking-lead";
import { sendLeadToMetaCapi } from "@/lib/meta-capi";
import { bookingConversionMetadata } from "@/lib/booking-conversion";

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

  // HubSpot v3 specifies decoding only this subset of URI escape sequences.
  const uri = request.url.replace(/%(3A|2F|3F|40|21|24|27|28|29|2A|2C|3B)/gi, (encoded) => decodeURIComponent(encoded));
  const expected = crypto
    .createHmac("sha256", clientSecret)
    .update(`POST${uri}${rawBody}${timestamp}`, "utf8")
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
  const receivedAt = Date.now();
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

  const bookings = toBookings(parsed);
  if (!bookings.length || bookings.some((booking) => !booking || typeof booking !== "object" || Array.isArray(booking))) {
    return NextResponse.json({ ok: false, error: "Expected booking object(s)." }, { status: 400 });
  }
  const results: { eventId: string; sent: boolean; reason?: string }[] = [];

  for (const booking of bookings) {
    const identity = extractBookingIdentity(booking);
    const eventId = bookingLeadEventId(identity);

    // Require the shared identity so webhook retries and browser events deduplicate.
    if (!identity.email || !identity.startTime) {
      results.push({ eventId, sent: false, reason: "incomplete_booking_identity" });
      continue;
    }

    const result = await sendLeadToMetaCapi({
      eventId,
      email: identity.email,
      ...bookingConversionMetadata(booking, receivedAt),
    });

    if (!result.sent) {
      console.error("[meta-capi] Lead not sent:", result.reason, result.status ?? "");
    }
    results.push({ eventId, sent: result.sent, ...(result.sent ? {} : { reason: result.reason }) });
  }

  // Successful events keep the same id on retries, so partial batches can be retried safely.
  const retryable = results.some((result) => result.reason === "not_configured" || result.reason === "request_failed");
  const ok = results.every((result) => result.sent);
  return NextResponse.json({ ok, results }, { status: retryable ? 503 : ok ? 200 : 422 });
}
