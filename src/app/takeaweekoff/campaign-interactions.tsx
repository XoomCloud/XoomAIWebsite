"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackEvent, ConversionEvents } from "@/lib/analytics";
import { trackMetaCustom } from "@/lib/meta";
import { CTA } from "@/lib/site";
import styles from "./campaign.module.css";

const BOOKING_PATH = "/takeaweekoff/book";
const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

export function AuditLink({ placement, className = "" }: { placement: string; className?: string }) {
  const router = useRouter();
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const destination = new URL(BOOKING_PATH, window.location.origin);
    const incoming = new URLSearchParams(window.location.search);
    for (const key of CAMPAIGN_KEYS) {
      const value = incoming.get(key);
      if (value) destination.searchParams.set(key, value);
    }
    event.currentTarget.href = `${destination.pathname}${destination.search}`;
    trackEvent(ConversionEvents.bookAudit, {
      campaign: "take-a-week-off",
      placement,
      destination: destination.pathname,
    });
    trackMetaCustom("AuditBookingClick", {
      campaign: "take-a-week-off",
      placement,
      destination: destination.pathname,
    });
    // Keep the pixel's queue alive during normal same-tab navigation.
    if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
      event.preventDefault();
      router.push(`${destination.pathname}${destination.search}`);
    }
  }

  return (
    <a href={BOOKING_PATH} className={`${styles.button} ${className}`} onClick={onClick} data-audit-cta={placement}>
      <span>{CTA.audit}</span><ArrowUpRight size={19} aria-hidden="true" />
    </a>
  );
}

export function CampaignEnhancements() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const hero = document.getElementById("campaign-hero");
    const closing = document.getElementById("audit");
    let heroPassed = false;
    let closingVisible = false;
    const stickyObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        if (entry.target === closing) closingVisible = entry.isIntersecting;
      }
      setShowSticky(heroPassed && !closingVisible);
    });
    if (hero) stickyObserver.observe(hero);
    if (closing) stickyObserver.observe(closing);

    return () => stickyObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panels = document.querySelectorAll<HTMLElement>("[data-campaign-reveal]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });
    panels.forEach((panel) => {
      // The document is readable without JavaScript; only offscreen panels animate.
      if (panel.getBoundingClientRect().top > window.innerHeight) {
        panel.classList.add(styles.revealReady);
        observer.observe(panel);
      }
    });
    return () => {
      observer.disconnect();
      panels.forEach((panel) => panel.classList.remove(styles.revealReady));
    };
  }, []);

  return showSticky ? (
    <aside className={styles.mobileCta} aria-label="Book your free audit">
      <AuditLink placement="mobile-sticky" />
    </aside>
  ) : null;
}
