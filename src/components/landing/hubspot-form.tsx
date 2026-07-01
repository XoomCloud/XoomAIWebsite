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

  React.useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; eventName?: string } | undefined;
      if (data?.type === "hsFormCallback" && data.eventName === "onFormSubmitted") {
        trackLead({ content_name: "AI Strategy Session", value: 1, currency: "AUD" });
        router.push("/thank-you");
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <div className="rounded-2xl border border-border bg-white/[0.03] p-6 backdrop-blur-sm md:p-8">
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
