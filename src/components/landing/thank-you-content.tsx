"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarClock, Mail, Phone, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site";

const MEETING_URL = process.env.NEXT_PUBLIC_HUBSPOT_MEETING_URL;

const STEPS = [
  { icon: Mail, title: "Check your inbox", body: "We've noted your details. Look out for a confirmation email from our team." },
  { icon: CalendarClock, title: "Pick a time", body: "Book your free strategy session below — choose whatever suits you best." },
  { icon: Phone, title: "We'll call prepared", body: "We'll come ready with ideas specific to your business and industry." },
];

export function ThankYouContent() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  return (
    <div className="on-dark relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#06070b]" aria-hidden />
      <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden />

      <div className="container-xa relative py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/" className="inline-flex" aria-label="XoomAI">
            <Image src="/images/xoomai-logo-white.png" alt="XoomAI" width={991} height={285} className="mx-auto h-9 w-auto" priority />
          </Link>

          <motion.div
            initial={animate ? { scale: 0.6, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
            className="mx-auto mt-10 grid size-20 place-items-center rounded-full bg-gradient-to-br from-[#6d3bf5] to-[#0891b2] shadow-[0_0_50px_-8px_rgba(34,211,238,0.6)]"
          >
            <motion.svg viewBox="0 0 24 24" className="size-9 text-white" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
              <motion.path
                d="M20 6 9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animate ? { pathLength: 0 } : false}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.div>

          <motion.h1
            initial={animate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            You&apos;re in. Let&apos;s book your{" "}
            <span className="text-gradient">strategy session.</span>
          </motion.h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            Thanks — we&apos;ve received your details. Pick a time that works and we&apos;ll map out your first
            AI employee together.
          </p>
        </div>

        {/* Next steps */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={animate ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="rounded-2xl border border-border bg-white/[0.03] p-5 text-center backdrop-blur-sm"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-inset ring-primary/25">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-3 font-display text-base font-semibold text-foreground">{s.title}</h2>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Scheduler */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="ring-gradient rounded-3xl">
            <div className="overflow-hidden rounded-3xl border border-border bg-white/[0.02] p-4 md:p-6">
              {MEETING_URL ? (
                <>
                  <div className="meetings-iframe-container min-h-[560px]" data-src={`${MEETING_URL}?embed=true`} />
                  <Script src="https://static.hsappstatic.net/MeetingsEmbedCode/static-1/js/MeetingsEmbedCode.js" strategy="afterInteractive" />
                </>
              ) : (
                <div className="grid place-items-center py-12 text-center">
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-inset ring-primary/25">
                    <CalendarClock className="size-7" aria-hidden />
                  </span>
                  <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Book your session now</h2>
                  <p className="mt-2 max-w-md text-sm text-muted">Choose a time that suits you — 30 minutes, no obligation.</p>
                  <a
                    href={SITE.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] px-7 py-3.5 text-base font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Choose a time <ArrowUpRight className="size-4" />
                  </a>
                  <p className="mt-5 text-sm text-muted">
                    or call us on{" "}
                    <a href={SITE.phoneHref} className="font-semibold text-primary hover:underline">{SITE.phone}</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
