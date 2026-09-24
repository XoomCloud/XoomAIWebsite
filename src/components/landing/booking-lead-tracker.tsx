"use client";

import * as React from "react";
import { trackLead, whenMetaReady } from "@/lib/meta";
import { isHubSpotOrigin, isBookingConfirmed, bookingEventId } from "@/lib/booking-lead";

/**
 * Fires the Meta `Lead` event ONLY after a HubSpot meeting is successfully
 * booked and confirmed — never on page load and never on a button click.
 *
 * The scheduler is a cross-origin iframe (meetings.hubspot.com), but HubSpot's
 * embed posts a `window.postMessage` on success, which is the provider's
 * supported completion signal. We verify the message origin, then fire once.
 *
 * Deduplication: the event id is derived deterministically from the booking
 * itself (booking id, or attendee email + start time) via `stableEventId`, so a
 * server-side Conversions API event built from the same booking (e.g. a HubSpot
 * webhook) produces an identical id and Meta collapses the pair. A localStorage
 * record also prevents a re-fire if the confirmation is re-rendered or reloaded.
 *
 * Renders nothing.
 */

const STORAGE_KEY = "xoomai:lead_event_ids";
const MAX_REMEMBERED = 50;

function alreadyFired(id: string): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.includes(id);
  } catch {
    return false;
  }
}

function rememberFired(id: string): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? (parsed as string[]) : [];
    list.push(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-MAX_REMEMBERED)));
  } catch {
    /* storage unavailable (private mode) — the in-memory guard still applies */
  }
}

export function BookingLeadTracker({ contentName = "AI Strategy Session" }: { contentName?: string }) {
  React.useEffect(() => {
    const firedThisSession = new Set<string>();
    const cancelPending: (() => void)[] = [];

    function onMessage(event: MessageEvent) {
      if (!isHubSpotOrigin(event.origin)) return;
      const fromScheduler = Array.from(document.querySelectorAll<HTMLIFrameElement>("iframe"))
        .some((frame) => frame.contentWindow === event.source && isHubSpotOrigin(frame.src));
      if (!fromScheduler) return;
      if (!isBookingConfirmed(event.data)) return;

      const data = event.data as Record<string, unknown>;
      const payload = data.meetingsPayload ?? data;
      const eventId = bookingEventId(payload);

      // Guard before firing so duplicate messages can't race through.
      if (firedThisSession.has(eventId) || alreadyFired(eventId)) return;
      firedThisSession.add(eventId);
      cancelPending.push(whenMetaReady(() => {
        trackLead(
          {
            content_name: contentName,
            content_category: "Booking",
          },
          { eventID: eventId },
        );
        rememberFired(eventId);
      }));
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      cancelPending.forEach((cancel) => cancel());
    };
  }, [contentName]);

  return null;
}
