"use client";

import Script from "next/script";

const DEFAULT_SRC = "https://meetings.hubspot.com/vlad-nielsen?embed=true";

/**
 * HubSpot meetings scheduler. The embed script auto-renders any
 * `.meetings-iframe-container`. min-height avoids layout shift before it loads.
 */
export function MeetingEmbed({ src = DEFAULT_SRC }: { src?: string }) {
  return (
    <>
      <div className="meetings-iframe-container min-h-[680px]" data-src={src} />
      <Script
        src="https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js"
        strategy="afterInteractive"
      />
    </>
  );
}
