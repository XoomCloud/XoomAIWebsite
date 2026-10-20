"use client";

import Script from "next/script";

/** Direct GA4 install authorized for XOO-323. The measurement ID is public. */
export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA_ID || "G-T3NZH8T5H7";
  return (
    <>
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config','${ga}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
        strategy="afterInteractive"
      />
    </>
  );
}
