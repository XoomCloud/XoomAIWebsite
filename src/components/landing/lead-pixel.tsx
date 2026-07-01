"use client";

import * as React from "react";
import { trackLead } from "@/lib/meta";

/**
 * Fires the Meta Pixel Lead event exactly once, in the browser, on /book.
 * The pixel loads via next/script (afterInteractive) and may not be ready when
 * this mounts. MetaPixel dispatches a "metaPixelReady" event right after
 * fbq('init'); we fire on that (or immediately if fbq is already present).
 * Renders nothing — no styling or layout impact.
 */
export function LeadPixel() {
  const fired = React.useRef(false);

  React.useEffect(() => {
    function fireLead() {
      if (fired.current) return; // only ever fire once
      fired.current = true;
      trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
      window.removeEventListener("metaPixelReady", fireLead); // stop listening after firing
    }

    if (typeof window.fbq === "function") {
      // Pixel already initialised — fire now.
      fireLead();
    } else {
      // Wait for MetaPixel to signal readiness.
      window.addEventListener("metaPixelReady", fireLead);
    }

    return () => window.removeEventListener("metaPixelReady", fireLead);
  }, []);

  return null;
}
