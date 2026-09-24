import { normaliseStartTime } from "./booking-lead";
import { SITE } from "./site";

/** Explicit webhook metadata: never confuse the appointment time with conversion time. */
export function bookingConversionMetadata(payload: unknown, receivedAt: number) {
  const data = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
  const created = data.booking_created_at;
  const eventTimeMs = created === undefined
    ? receivedAt
    : Number(normaliseStartTime(typeof created === "string" || typeof created === "number" ? created : null) ?? NaN);
  let path = "/book";
  // Only approved first-party booking pages. Drop query parameters and fragments.
  if (typeof data.event_source_url === "string") {
    try {
      const source = new URL(data.event_source_url);
      if (source.origin === new URL(SITE.url).origin && ["/book", "/takeaweekoff/book"].includes(source.pathname)) {
        path = source.pathname;
      }
    } catch { /* keep the existing booking route */ }
  }
  return {
    eventTimeMs,
    eventSourceUrl: `${SITE.url}${path}`,
    contentName: path === "/takeaweekoff/book" ? "Free AI Workflow Audit" : "AI Strategy Session",
  };
}
