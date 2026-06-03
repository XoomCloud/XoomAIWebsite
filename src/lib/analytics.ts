/**
 * Analytics-ready event layer. Pushes events to the GTM/GA4 dataLayer when present.
 * Safe to call before any analytics tool is installed (no-ops gracefully).
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(event: string, payload: TrackPayload = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
}

/** Standardised conversion events for CTAs. */
export const ConversionEvents = {
  bookAudit: "cta_book_audit",
  bookConsult: "cta_book_consult",
  startQuiz: "quiz_start",
  completeQuiz: "quiz_complete",
  submitContact: "contact_submit",
  viewXoomAgent: "cta_view_xoomagent",
} as const;
