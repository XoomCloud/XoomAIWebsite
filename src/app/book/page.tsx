import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { MeetingEmbed } from "@/components/landing/meeting-embed";
import { LeadPixel } from "@/components/landing/lead-pixel";
import { SITE } from "@/lib/site";
import { CalendarClock, ShieldCheck, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "Book Your AI Strategy Session | XoomAI" },
  description:
    "Book your free 30-minute AI Strategy Session with XoomAI. Pick a time that suits you and we'll map out your first AI employee — no obligation.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <div className="on-dark relative min-h-screen">
      {/* Fire the Meta Lead event once on load, then show the scheduler below. */}
      <LeadPixel />
      <div className="fixed inset-0 -z-10 bg-[#06070b]" aria-hidden />
      <LandingNav />

      <section className="relative pb-16 pt-28 md:pt-32">
        <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-80" aria-hidden />
        <div className="container-xa relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary">
              <Clock className="size-3.5" aria-hidden /> Free · 30 minutes · No obligation
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] text-foreground md:text-5xl">
              Book your <span className="text-gradient">AI strategy session</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
              Pick a time that suits you and we&apos;ll map out exactly where an AI employee saves your
              business the most time and money.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <div className="ring-gradient rounded-3xl">
              <div className="overflow-hidden rounded-3xl border border-border bg-white/[0.02] p-4 backdrop-blur-sm md:p-6">
                <MeetingEmbed />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" aria-hidden /> Australian owned · security-led</span>
            <span className="flex items-center gap-1.5"><CalendarClock className="size-4 text-primary" aria-hidden /> Speak to a real specialist</span>
            <span>
              Prefer to call?{" "}
              <a href={SITE.phoneHref} className="font-semibold text-primary hover:underline">{SITE.phone}</a>
            </span>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container-xa flex flex-col items-center justify-between gap-3 text-xs text-muted-2 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName}. XoomAgent™ is a trademark of {SITE.parent}.</p>
          <p>Australian owned · ABN {SITE.abn} · {SITE.phone}</p>
        </div>
      </footer>
    </div>
  );
}
