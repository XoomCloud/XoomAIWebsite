/**
 * Meta Conversions API (server-side events).
 *
 * Complements the browser Pixel: the Pixel misses conversions blocked by ad
 * blockers / ITP. Configured server events provide a second reporting path.
 * Both must send the SAME
 * `event_id` for a booking, so Meta collapses the pair instead of double-counting.
 *
 * Server-only — never import from a client component. Requires
 * META_CAPI_ACCESS_TOKEN (a secret; do NOT prefix with NEXT_PUBLIC_).
 */

import crypto from "node:crypto";
import { META_PIXEL_ID } from "./meta";

const GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

/** Meta requires user identifiers lower-cased + trimmed before hashing. */
function hashNormalised(value: string | undefined | null): string | undefined {
  const v = String(value ?? "").trim().toLowerCase();
  return v ? sha256(v) : undefined;
}

/** Phone numbers: digits only (keep country code), then hash. */
function hashPhone(value: string | undefined | null): string | undefined {
  const digits = String(value ?? "").replace(/\D+/g, "");
  return digits ? sha256(digits) : undefined;
}

export type CapiLeadInput = {
  /** Must match the browser Pixel event id for this booking. */
  eventId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  /** Epoch milliseconds. Defaults to now. */
  eventTimeMs?: number;
  eventSourceUrl?: string;
  contentName?: string;
  value?: number;
  currency?: string;
};

export type CapiResult =
  | { sent: true; status: number; eventId: string }
  | { sent: false; reason: "not_configured" | "no_identifiers" | "invalid_event_time" | "request_failed"; status?: number; detail?: string };

/**
 * Send a single `Lead` event to the Conversions API.
 * Returns a result so the webhook can distinguish retryable delivery failures.
 */
export async function sendLeadToMetaCapi(input: CapiLeadInput): Promise<CapiResult> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID || META_PIXEL_ID;

  if (!accessToken || !pixelId) return { sent: false, reason: "not_configured" };
  const now = Date.now();
  const eventTimeMs = input.eventTimeMs ?? now;
  if (!Number.isFinite(eventTimeMs) || eventTimeMs > now || eventTimeMs < now - 7 * 24 * 60 * 60 * 1000) {
    return { sent: false, reason: "invalid_event_time" };
  }

  const em = hashNormalised(input.email);
  const ph = hashPhone(input.phone);
  const fn = hashNormalised(input.firstName);
  const ln = hashNormalised(input.lastName);

  // Without at least one identifier Meta cannot attribute the event.
  if (!em && !ph) return { sent: false, reason: "no_identifiers" };

  const userData: Record<string, string[]> = {};
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(eventTimeMs / 1000),
        event_id: input.eventId,
        action_source: "website",
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: userData,
        custom_data: {
          content_name: input.contentName ?? "AI Strategy Session",
          content_category: "Booking",
          ...(input.value !== undefined ? { value: input.value, currency: input.currency ?? "AUD" } : {}),
        },
      },
    ],
  };

  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!res.ok) {
      return { sent: false, reason: "request_failed", status: res.status };
    }
    const receipt = await res.json() as { events_received?: number };
    if (receipt.events_received !== 1) return { sent: false, reason: "request_failed", status: res.status };
    return { sent: true, status: res.status, eventId: input.eventId };
  } catch {
    return {
      sent: false,
      reason: "request_failed",
    };
  }
}
