"use client";

import * as React from "react";
import { trackLead } from "@/lib/meta";

/**
 * Fires the Meta Pixel Lead event exactly once, in the browser, on /book.
 * The pixel loads via next/script (afterInteractive), so it may not be ready
 * when this mounts — poll every 50ms (up to 5s) for window.fbq, then fire once.
 * Renders nothing — no styling or layout impact.
 */
export function LeadPixel() {
  const fired = React.useRef(false);

  React.useEffect(() => {
    // TEMPORARY debug (remove after testing)
    console.log("LeadPixel mounted");

    const POLL_MS = 50;
    const MAX_MS = 5000;
    let elapsed = 0;

    const interval = setInterval(() => {
      // Already fired — stop polling.
      if (fired.current) {
        clearInterval(interval);
        return;
      }

      // Pixel is ready: fire once, stop polling, never fire again.
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        fired.current = true;
        clearInterval(interval);
        console.log("fbq type:", typeof window.fbq);
        trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
        console.log("Lead event dispatched");
        return;
      }

      // Give up after 5 seconds.
      elapsed += POLL_MS;
      if (elapsed >= MAX_MS) {
        clearInterval(interval);
        console.log("LeadPixel: fbq unavailable after 5s — Lead not fired");
      }
    }, POLL_MS);

    return () => clearInterval(interval);
  }, []);

  return null;
}
