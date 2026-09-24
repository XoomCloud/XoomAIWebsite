/**
 * Meta (Facebook) Pixel helpers. Safe to call before the pixel loads or when
 * unconfigured — every call no-ops gracefully.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1643300670067276";

/** Options passed as fbq's 4th argument (used for browser/CAPI deduplication). */
export type MetaEventOptions = { eventID?: string };

/** Wait for our base snippet; fbq then queues until Meta's library is loaded. */
export function whenMetaReady(run: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (typeof window.fbq === "function") {
    run();
    return () => {};
  }
  const handler = () => {
    if (typeof window.fbq !== "function") return;
    window.removeEventListener("metaPixelReady", handler);
    run();
  };
  window.addEventListener("metaPixelReady", handler);
  return () => window.removeEventListener("metaPixelReady", handler);
}

/** CTA intent is a custom event, never a completed Lead. */
export function trackMetaCustom(event: string, params?: Record<string, unknown>) {
  whenMetaReady(() => window.fbq?.("trackCustom", event, params));
}

export function trackMeta(
  event: string,
  params?: Record<string, unknown>,
  options?: MetaEventOptions,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (options?.eventID) {
    window.fbq("track", event, params, { eventID: options.eventID });
  } else {
    window.fbq("track", event, params);
  }
}

/**
 * Fire the standard Lead event. Only call this once a conversion is actually
 * confirmed (e.g. a completed booking) — never on page load or button click.
 */
export function trackLead(params?: Record<string, unknown>, options?: MetaEventOptions) {
  trackMeta("Lead", params, options);
}

export function trackViewContent(params?: Record<string, unknown>, options?: MetaEventOptions) {
  trackMeta("ViewContent", params, options);
}

/**
 * Deterministic, PII-free event id for Pixel ↔ Conversions API deduplication.
 *
 * Builds a key from `parts` (lower-cased, "|"-joined) and hashes it with two
 * FNV-1a passes → 16 hex chars. The same inputs always produce the same id, so
 * a server-side CAPI event (e.g. from a HubSpot webhook) can reproduce it with
 * the same algorithm and Meta will dedupe the pair.
 *
 * Falls back to a random id when no stable parts are available — the event still
 * fires, it just can't be matched to a server-side copy.
 */
export function stableEventId(prefix: string, parts: (string | number | null | undefined)[]): string {
  const key = parts
    .filter((p) => p !== null && p !== undefined && String(p).trim() !== "")
    .map((p) => String(p).trim().toLowerCase())
    .join("|");

  if (!key) return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

  const fnv1a = (seed: number) => {
    let hash = seed >>> 0;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  };

  return `${prefix}_${fnv1a(2166136261)}${fnv1a(3735928559)}`;
}
