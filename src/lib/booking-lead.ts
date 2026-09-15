/**
 * Pure helpers for detecting a *confirmed* HubSpot meeting booking from the
 * scheduler's cross-origin postMessage, and deriving a stable Meta event id.
 * Kept separate from the React component so the gating logic is unit-testable.
 */

import { stableEventId } from "./meta";

/** Only trust messages that genuinely come from the booking provider. */
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

/** Shallow-recursive lookup so we don't depend on HubSpot's exact payload shape. */
function findValue(
  source: unknown,
  match: (key: string, value: unknown) => boolean,
  depth = 0,
): string | undefined {
  if (!source || typeof source !== "object" || depth > 6) return undefined;
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    if (match(key, value)) return String(value);
    const nested = findValue(value, match, depth + 1);
    if (nested !== undefined) return nested;
  }
  return undefined;
}

/**
 * Derive a deterministic id for this specific booking so the browser Pixel event
 * and any server-side Conversions API event for the same booking deduplicate.
 * Prefers an explicit booking id; falls back to attendee email + start time.
 */
export function bookingEventId(payload: unknown): string {
  const bookingId = findValue(
    payload,
    (k, v) =>
      (typeof v === "string" || typeof v === "number") &&
      /^(bookingid|meetingid|eventid|confirmationid)$/i.test(k) &&
      String(v).length > 0,
  );
  if (bookingId) return stableEventId("lead", [bookingId]);

  const email = findValue(
    payload,
    (k, v) => typeof v === "string" && /email/i.test(k) && v.includes("@"),
  );
  const startTime = findValue(
    payload,
    (k, v) =>
      (typeof v === "string" || typeof v === "number") &&
      /^(start|starttime|startsat|datetime|when)$/i.test(k),
  );
  return stableEventId("lead", [email, startTime]);
}
