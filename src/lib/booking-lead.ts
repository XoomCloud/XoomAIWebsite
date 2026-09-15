/**
 * Shared booking → Meta Lead helpers.
 *
 * Used by BOTH the browser (HubSpot scheduler postMessage) and the server
 * (HubSpot webhook → Conversions API). Both sides must derive the *same*
 * `event_id` for the same booking so Meta deduplicates the pair — which is why
 * the extraction and normalisation live here rather than in either caller.
 */

import { stableEventId } from "./meta";

/* ── Browser-only guards ─────────────────────────────────────────────────── */

/** Only trust postMessages that genuinely come from the booking provider. */
export function isHubSpotOrigin(origin: string): boolean {
  try {
    return /(^|\.)hubspot\.com$/i.test(new URL(origin).hostname);
  } catch {
    return false;
  }
}

/**
 * HubSpot's meetings embed signals a completed+confirmed booking with
 * `meetingBookSucceeded`. Anything else (page loads, step changes, failures)
 * must NOT be treated as a conversion.
 */
export function isBookingConfirmed(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  if (d.meetingBookSucceeded === true) return true;
  return d.eventName === "meetingBookSucceeded" || d.event === "meetingBookSucceeded";
}

/* ── Identity extraction (payload-shape agnostic) ────────────────────────── */

export type BookingIdentity = {
  email?: string;
  /** Normalised to epoch milliseconds as a string. */
  startTime?: string;
  bookingId?: string;
};

/** Shallow-recursive lookup so we don't depend on an exact payload shape. */
function findValue(
  source: unknown,
  match: (key: string, value: unknown) => boolean,
  depth = 0,
): string | undefined {
  if (!source || typeof source !== "object" || depth > 8) return undefined;
  const entries = Array.isArray(source)
    ? source.map((v, i) => [String(i), v] as const)
    : Object.entries(source as Record<string, unknown>);
  for (const [key, value] of entries) {
    if (match(key, value)) return String(value);
    const nested = findValue(value, match, depth + 1);
    if (nested !== undefined) return nested;
  }
  return undefined;
}

/** `hs_meeting_start_time` → `hsmeetingstarttime`, so key styles don't matter. */
function normaliseKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Search by an ordered list of key suffixes rather than first-match, so the
 * result does not depend on object traversal order. This is what keeps the
 * browser and the webhook resolving the *same* field for a booking.
 */
function findByKeyPriority(
  payload: unknown,
  suffixes: string[],
  valueOk: (value: unknown) => boolean,
): string | undefined {
  for (const suffix of suffixes) {
    const found = findValue(
      payload,
      (key, value) => valueOk(value) && normaliseKey(key).endsWith(suffix),
    );
    if (found !== undefined && String(found).trim() !== "") return found;
  }
  return undefined;
}

/** Lower-cased, trimmed email. */
export function normaliseEmail(value: string | undefined | null): string | undefined {
  const email = String(value ?? "").trim().toLowerCase();
  return email.includes("@") ? email : undefined;
}

/**
 * Normalise a start time to epoch milliseconds.
 * Critical for dedup: HubSpot hands the browser an ISO string and the webhook an
 * epoch number for the same booking — both must reduce to the same key.
 */
export function normaliseStartTime(value: string | number | undefined | null): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const raw = String(value).trim();
  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    // < 1e12 is almost certainly epoch seconds, not milliseconds
    return String(n < 1e12 ? n * 1000 : n);
  }
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? undefined : String(parsed);
}

const EMAIL_KEYS = ["email", "emailaddress"];
// Start-time keys, most specific first (covers `hs_meeting_start_time`, `startTime`, `dateTime`).
const START_KEYS = ["starttime", "startdate", "startsat", "start", "datetime", "when", "timestamp"];
const BOOKING_ID_KEYS = ["bookingid", "meetingid", "eventid", "confirmationid", "engagementid"];

/** Pull the attendee email, start time and booking id out of any payload shape. */
export function extractBookingIdentity(payload: unknown): BookingIdentity {
  const isText = (v: unknown) => typeof v === "string" || typeof v === "number";
  const email = normaliseEmail(
    findByKeyPriority(payload, EMAIL_KEYS, (v) => typeof v === "string" && v.includes("@")),
  );
  const startTime = normaliseStartTime(findByKeyPriority(payload, START_KEYS, isText));
  const bookingId = findByKeyPriority(payload, BOOKING_ID_KEYS, isText);
  return { email, startTime, bookingId };
}

/**
 * Canonical Meta `event_id` for a booking.
 *
 * PRIMARY key is attendee email + start time, because those are the two fields
 * both the browser postMessage and the HubSpot webhook reliably contain — that
 * shared key is what makes Pixel ↔ Conversions API deduplication work.
 * A booking id is only used when email/start time are unavailable.
 */
export function bookingLeadEventId(identity: BookingIdentity): string {
  if (identity.email && identity.startTime) {
    return stableEventId("lead", [identity.email, identity.startTime]);
  }
  if (identity.bookingId) return stableEventId("lead", [identity.bookingId]);
  return stableEventId("lead", [identity.email, identity.startTime]);
}

/** Convenience: extract + derive in one step (used by browser and server alike). */
export function bookingEventId(payload: unknown): string {
  return bookingLeadEventId(extractBookingIdentity(payload));
}
