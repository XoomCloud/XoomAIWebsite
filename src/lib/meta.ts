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

export function trackMeta(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

/** Fire the standard Lead event after a successful form submission. */
export function trackLead(params?: Record<string, unknown>) {
  trackMeta("Lead", params);
}

export function trackViewContent(params?: Record<string, unknown>) {
  trackMeta("ViewContent", params);
}
