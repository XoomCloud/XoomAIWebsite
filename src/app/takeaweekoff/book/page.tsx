import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock3, ExternalLink, Phone } from "lucide-react";
import { MeetingEmbed } from "@/components/landing/meeting-embed";
import { BookingLeadTracker } from "@/components/landing/booking-lead-tracker";
import { SITE } from "@/lib/site";
import { CampaignHeader, CampaignFooter } from "../campaign-chrome";
import styles from "../campaign.module.css";

export const metadata: Metadata = {
  title: { absolute: "Book a Free AI Workflow Audit | XoomAI" },
  description: "Find the first role for your managed AI workforce. Book a free, 45-minute AI Workflow Audit with XoomAI.",
  alternates: { canonical: "/takeaweekoff/book" },
  robots: { index: false, follow: true },
};

export default async function CampaignBookingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const scheduler = new URL("https://meetings.hubspot.com/vlad-nielsen");
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params[key];
    if (typeof value === "string") scheduler.searchParams.set(key, value);
  }
  const fallbackUrl = scheduler.toString();
  scheduler.searchParams.set("embed", "true");

  return (
    <div className={styles.campaign}>
      <CampaignHeader booking />
      <BookingLeadTracker contentName="Free AI Workflow Audit" />
      <section className={`${styles.container} ${styles.bookingGrid}`}>
        <div className={styles.bookingCopy}>
          <p className={styles.eyebrow}>YOUR FIRST STEP TO MORE TIME BACK</p>
          <h1>Book a Free<br /><span>AI Workflow Audit.</span></h1>
          <p>Let’s find the work you can hand over. Pick a time to talk through your biggest bottleneck with an XoomAI specialist.</p>
          <div className={styles.bookingBadge}><Clock3 size={18} aria-hidden="true" /> Free · 45 minutes · No obligation</div>
          <ul className={styles.bookingChecklist}>
            <li><Check size={19} aria-hidden="true" /> Explore the work taking up your team’s time.</li>
            <li><Check size={19} aria-hidden="true" /> Discuss a suitable first AI Employee role.</li>
            <li><Check size={19} aria-hidden="true" /> Understand the systems, scope and next steps.</li>
          </ul>
          <p className={styles.bookingHelp}>Prefer to speak to us?<br /><a href={SITE.phoneHref}><Phone size={16} aria-hidden="true" /> {SITE.phone}</a></p>
          <Link href="/takeaweekoff#results" className={styles.textLink}>Explore the client outcomes</Link>
        </div>
        <div className={styles.schedulerPanel}>
          <h2>Choose a time that suits you.</h2>
          <p className={styles.schedulerIntro}>Check the scheduler’s timezone before confirming.</p>
          <MeetingEmbed src={scheduler.toString()} />
          <p className={styles.schedulerFallback}>Calendar not loading? <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">Open the booking calendar <ExternalLink size={14} aria-hidden="true" /></a></p>
        </div>
      </section>
      <CampaignFooter />
    </div>
  );
}
