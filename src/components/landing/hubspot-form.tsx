"use client";

import Script from "next/script";

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "48826660";
const FORM_ID = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || "d5bbb02f-27ce-4869-8428-3f9268bfe5d5";
const REGION = process.env.NEXT_PUBLIC_HUBSPOT_REGION || "na1";

/**
 * HubSpot confirms submissions through its global form events. The root
 * hubspot-form-tracking.js listener sends one Lead for a confirmed submission
 * on /youraiemployee. Completed meetings are reported separately as Schedule.
 */
export function HubspotForm() {
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
