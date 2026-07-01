"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { trackLead } from "@/lib/meta";

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "48826660";
const FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || "d5bbb02f-27ce-4869-8428-3f9268bfe5d5";
const REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION || "na1";

/**
 * HubSpot embedded form. The embed script auto-renders any `.hs-form-frame`.
 * On successful submit we fire the Meta Lead event and route to /thank-you.
 */
export function HubspotForm() {
  const router = useRouter();
  const leadFired = React.useRef(false);

  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; eventName?: string; id?: string } | undefined;
      // HubSpot Forms API callback. `onFormSubmitted` fires ONLY after HubSpot
      // confirms a successful submission — not on submit attempts or validation errors.
      if (data?.type !== "hsFormCallback" || data.eventName !== "onFormSubmitted") return;
      // Match this form only (ignore other embeds on the page).
      if (data.id && data.id !== FORM_ID) return;
      // Fire the Meta Lead event exactly once per successful submission…
      if (leadFired.current) return;
      leadFired.current = true;
      trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
      // …then redirect to the HubSpot meeting page.
      router.push("/thank-you");
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.7)] md:p-8">
      <div
        className="hs-form-frame min-h-64"
        data-region={REGION}
        data-form-id={FORM_ID}
        data-portal-id={PORTAL_ID}
      />
      <Script src={`https://js.hsforms.net/forms/embed/${PORTAL_ID}.js`} strategy="afterInteractive" />
    </div>
  );
}
