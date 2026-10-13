import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock3, ExternalLink, Phone } from "lucide-react";
import { MeetingEmbed } from "@/components/landing/meeting-embed";
import { BookingLeadTracker } from "@/components/landing/booking-lead-tracker";
import { SITE } from "@/lib/site";
import { meetingUrls, type BookingSearchParams } from "@/lib/meeting-url";
import { CampaignHeader, CampaignFooter } from "../campaign-chrome";
import styles from "../campaign.module.css";

export const metadata: Metadata = {
  title: { absolute: "Book a Free AI Workflow Audit | XoomAI" },
  description: "Find the first role for your managed AI workforce. Book a free, 45-minute AI Workflow Audit with XoomAI.",
  alternates: { canonical: "/takeaweekoff/book" },
  robots: { index: false, follow: true },
};

export default async function CampaignBookingPage({ searchParams }: { searchParams: Promise<BookingSearchParams> }) {
  const scheduler = meetingUrls(await searchParams);

  return (
    <div className={styles.campaign}>
      <CampaignHeader booking />
      <BookingLeadTracker contentName="Free AI Workflow Audit" />
      <section className={`${styles.container} ${styles.bookingGrid}`}>
        <div className={styles.bookingCopy}>
          <p className={styles.eyebrow}>YOUR FIRST STEP TO MORE TIME BACK</p>
          <h1>Book a Free<br /><span>AI Workflow Audit.</span></h1>
          <p>Let’s find the work you can hand over. Pick a time to talk through your biggest bottleneck with a XoomAI specialist.</p>
          <div className={styles.bookingBadge}><Clock3 size={18} aria-hidden="true" /> Free · 45 minutes · No obligation</div>
          <p>Best suited to established Australian businesses with 5+ staff and repeatable work across multiple systems. The audit is free; XoomAI’s fully managed service is a paid engagement scoped to your business.</p>
          <ul className={styles.bookingChecklist}>
            <li><Check size={19} aria-hidden="true" /> Explore the work taking up your team’s time.</li>
            <li><Check size={19} aria-hidden="true" /> Discuss a suitable first XoomAgent™ role.</li>
            <li><Check size={19} aria-hidden="true" /> Understand the systems, scope and next steps.</li>
          </ul>
          <p className={styles.bookingHelp}>Prefer to speak to us?<br /><a href={SITE.phoneHref}><Phone size={16} aria-hidden="true" /> {SITE.phone}</a></p>
          <Link href="/takeaweekoff#results" className={styles.textLink}>Explore the client outcomes</Link>
        </div>
        <div className={styles.schedulerPanel}>
          <h2>Choose a time that suits you.</h2>
          <p className={styles.schedulerIntro}>Check the scheduler’s timezone before confirming.</p>
          <MeetingEmbed src={scheduler.embed} />
          <p className={styles.schedulerIntro}>After booking, check your inbox and accept the calendar invitation. Bring one repeatable workflow you want to improve and the systems your team uses.</p>
          <p className={styles.schedulerFallback}>Calendar not loading? <a href={scheduler.fallback} target="_blank" rel="noopener noreferrer">Open the booking calendar <ExternalLink size={14} aria-hidden="true" /></a></p>
        </div>
      </section>
      <CampaignFooter />
    </div>
  );
}
