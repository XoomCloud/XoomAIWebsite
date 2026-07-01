"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID } from "@/lib/meta";

/**
 * Meta Pixel — Meta's recommended base install via next/script.
 * The base snippet fires PageView on first load; the effect below re-fires
 * PageView on client-side (App Router) route changes. Set NEXT_PUBLIC_META_PIXEL_ID
 * to override the default ID. Use trackLead()/trackMeta() (src/lib/meta) for events.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const initialised = React.useRef(false);

  React.useEffect(() => {
    if (!META_PIXEL_ID) return;
    // The base snippet already fires the first PageView — skip the initial run.
    if (!initialised.current) {
      initialised.current = true;
      return;
    }
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');window.dispatchEvent(new Event('metaPixelReady'));fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
