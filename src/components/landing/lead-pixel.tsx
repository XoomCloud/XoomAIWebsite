"use client";

import * as React from "react";
import { trackLead } from "@/lib/meta";

/**
 * Fires the Meta Pixel Lead event exactly once, on load, in the browser only.
 * Rendered on /book (reached after a successful HubSpot form submission).
 * Renders nothing — no styling or layout impact.
 */
export function LeadPixel() {
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (fired.current) return; // guard against double-invocation (e.g. React strict mode)
    fired.current = true;
    // TEMPORARY debug (remove after testing)
    console.log("LeadPixel mounted");
    console.log("fbq type:", typeof window.fbq);
    trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
    console.log("Lead event dispatched");
  }, []);

  return null;
}
