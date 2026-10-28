import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/hero";
import { StickyCta } from "@/components/landing/sticky-cta";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { HubspotForm } from "@/components/landing/hubspot-form";
import { HeyGenVideo } from "@/components/landing/heygen-video";
import { SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FAQ } from "@/components/sections/faq";
import { Reveal } from "@/components/motion/reveal";
import { IconBadge } from "@/components/icon-badge";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { Clock, Zap, Brain, Check } from "lucide-react";

const URL = "/youraiemployee";

export const metadata: Metadata = {
  title: { absolute: "Hire Your AI Employees | XoomAI" },
  description:
    "We build, connect and run AI employees across your sales, admin and finance, inside Microsoft 365, HubSpot and Xero. Book a free AI Strategy Session with XoomAI.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Hire Your AI Employees | XoomAI",
    description:
      "Done-for-you AI employees across sales, admin and finance, live in weeks. Book a free AI Strategy Session.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Your AI Employees | XoomAI",
    description: "Done-for-you AI employees across sales, admin and finance, live in weeks.",
  },
};

const benefits = [
  { icon: Clock, title: "Works 24/7", body: "Answers enquiries, replies to email and completes tasks around the clock, including evenings, weekends and public holidays included." },
  { icon: Zap, title: "Never Sleeps", body: "No sick days, no leave, no drop in output. Your AI employees show up every single day and never lets a task fall through the cracks." },
  { icon: Brain, title: "Always Learning", body: "Trained on your business, they get sharper over time, learning your processes, tone and systems more with every task." },
];

const steps = [
  { icon: "Search" as const, title: "Discover", body: "We map your workflows in a free strategy session and find the highest-impact work to automate first." },
  { icon: "Rocket" as const, title: "Deploy", body: "We configure and connect your AI employees to your inbox, CRM and tools, fully managed by XoomAI." },
  { icon: "Workflow" as const, title: "Automate", body: "They start handling real work: enquiries, follow-ups, documents, data entry and reporting." },
  { icon: "TrendingUp" as const, title: "Scale", body: "Add more skills and departments as you grow, until you have an entire AI workforce." },
];

const capabilities = [
  { icon: "TrendingUp" as const, title: "Sales", description: "Qualifies leads in minutes, follows up relentlessly and keeps your CRM up to date." },
  { icon: "Headphones" as const, title: "Support", description: "Answers customer questions 24/7 across email, chat and phone, escalating what matters." },
  { icon: "ClipboardList" as const, title: "Admin", description: "Handles data entry, scheduling and the repetitive tasks that eat your team's week." },
  { icon: "Sparkles" as const, title: "Marketing", description: "Drafts on-brand content, schedules campaigns and reports on what's working." },
  { icon: "Banknote" as const, title: "Finance", description: "Processes invoices, prepares reconciliations and flags exceptions for review." },
  { icon: "Workflow" as const, title: "Operations", description: "Connects your systems and runs multi-step workflows without manual hand-offs." },
  { icon: "Users" as const, title: "HR", description: "Screens applicants, runs onboarding and answers routine people questions." },
  { icon: "BarChart3" as const, title: "Reporting", description: "Compiles dashboards and plain-English reports automatically, on schedule." },
];

const integrations = [
  "Microsoft 365", "Teams", "SharePoint", "HubSpot", "Xero", "QuickBooks",
  "Salesforce", "Google Workspace", "Outlook", "Dynamics",
];

const faqs = [
  { q: "What exactly are AI employees?", a: "They're a fully managed AI system that performs real work inside your business: answering enquiries, replying to email, processing documents, updating your CRM and running workflows. Unlike a chatbot, they take action across your tools, 24/7." },
  { q: "Will they replace my staff?", a: "No. They remove the repetitive, low-value work your team dislikes so they can focus on customers, growth and the work that needs a human. Most businesses redeploy time, not people." },
  { q: "How long until they're working?", a: "After your free strategy session, an initial deployment is typically live within a few weeks, starting with your highest-impact workflow so you see value fast." },
  { q: "Which systems do they connect to?", a: "Microsoft 365, Google Workspace, Teams, SharePoint, HubSpot, Salesforce, Xero, QuickBooks, Dynamics, Outlook and most tools with an API." },
  { q: "Is my business data secure?", a: "Yes. It runs on dedicated, isolated infrastructure with permissioned access and full audit trails, and your data is never used to train AI models. XoomAI is backed by XoomCloud, an Australian managed IT and security provider." },
  { q: "Do I need technical staff to run it?", a: "No. XoomAI builds, hosts, monitors and continuously improves your AI employees. You get the outcomes without needing developers in-house." },
  { q: "How much does it cost?", a: "It's designed to cost far less than a part-time hire, with pricing confirmed after your free strategy session once we understand the workflows you want automated." },
  { q: "What size business is this for?", a: "It's built for Australian businesses with roughly 10 to 100 staff across professional services, trades, construction, accounting, legal, healthcare, manufacturing and retail." },
  { q: "What happens in the free strategy session?", a: "In a 45-minute call we map where AI employees would save you the most time and money, and outline a practical, secure plan. No obligation." },
  { q: "Is XoomAI Australian?", a: "Yes. Australian owned and operated, with Australian data handling and a Privacy Act first approach, backed by XoomCloud's managed IT and security expertise." },
];

export default function YourAiEmployeePage() {
  return (
    <div className="on-dark relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#06070b]" aria-hidden />
      <LandingNav />
      <LandingHero />

      {/* Trusted by */}
      <section className="border-y border-border/60 py-10">
        <div className="container-xa">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-2">
            Trusted by Australian business owners across trades, professional services & more
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["OEMX Diesel", "Stirling Supports", "Avanti Book Keepers", "Acquira Wealth Partners", "Informed Design", "Elite Structures"].map((l) => (
              <span key={l} className="font-display text-sm font-semibold tracking-wide text-muted">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Client result: verified facts only (HubSpot deal + Fireflies notes, see XOO-1040 evidence) */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading
            eyebrow="Client results"
            title="Real Australian businesses, real work automated"
            subtitle="What was slowing a client down, and what their AI employees now handle."
          />
          <article className="mx-auto mt-12 grid max-w-5xl gap-8 rounded-3xl border border-border bg-white/[0.03] p-7 shadow-[0_0_60px_-30px_rgba(34,211,238,0.5)] md:grid-cols-[1fr_1fr] md:p-10">
            <div>
              <p className="font-display text-2xl font-semibold text-foreground">OEMX Diesel</p>
              <p className="mt-1 text-sm text-muted">Diesel and fabrication · live since mid 2026</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">The problem</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Admin overhead, time tracking and workflow coordination were eating the team&apos;s week, with little
                real-time view of the numbers.
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">What we automated</p>
              <ul className="mt-2 space-y-2">
                {[
                  "Weekly timesheet checks and payroll summaries, ready for Xero",
                  "Supplier bills checked, matched to purchase orders and drafted in Xero for approval",
                  "AI employees working across finance, operations and reporting",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-r from-[#6d3bf5]/15 to-[#0891b2]/15 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">The result</p>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug text-foreground md:text-3xl">
                The automated payroll summary matched the manual one exactly and caught 3 human errors.
              </p>
            </div>
          </article>
          <div className="mt-10 text-center">
            <a
              href="#book"
              className="inline-flex h-13 items-center justify-center rounded-full bg-gradient-to-r from-[#6d3bf5] to-[#0891b2] px-8 py-3.5 text-base font-semibold text-white shadow-[0_12px_34px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Book my free session
            </a>
            <p className="mt-3 text-sm text-muted">A free strategy call. We map where AI employees save you the most time.</p>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-14 md:py-20">
        <div className="container-xa">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 text-center">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Watch
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold text-foreground md:text-3xl">
                See your AI employees in action
              </h2>
            </div>
            <HeyGenVideo src="https://app.heygen.com/embeds/623a4bff1b1d4d3d9e031a35fa81cf51" poster="https://dynamic.heygen.ai/aws_pacific/avatar_tmp/59ef09acf8284df287d5bcd2b861a1f4/v8SSJ5vUZ8jHvoHTlx9oJYWz9kxZbMF3z/623a4bff1b1d4d3d9e031a35fa81cf51.jpeg" title="XoomAI: meet your AI employees" />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="Why AI employees" title="Always on. Always working. Always improving." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title} delay={i}>
                  <div className="h-full rounded-2xl border border-border bg-white/[0.03] p-7 backdrop-blur-sm">
                    <span className="grid size-12 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-inset ring-primary/25">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="How it works" title="From first call to working AI employees" subtitle="A clear, managed path. We do the heavy lifting." />
          <div className="relative mt-14 grid gap-6 md:grid-cols-4">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent md:block" aria-hidden />
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i} className="relative">
                <div className="relative z-10 grid size-14 place-items-center rounded-2xl border border-border bg-[#0d1018] font-display text-lg font-bold text-primary ring-1 ring-inset ring-primary/25">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <IconBadge name={s.icon} index={i} size="sm" />
                  <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ROI calculator */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="ROI Calculator" title="See what you're losing to repetitive work" subtitle="Move the sliders to estimate what AI employees could save you each year." />
          <div className="mx-auto mt-12 max-w-4xl">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* What it can do */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="Capabilities" title="What can your AI employees do?" subtitle="One team. Every department covered." />
          <div className="mt-12">
            <FeatureGrid features={capabilities} columns={4} />
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="Integrations" title="Works inside the tools you already use" />
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
            {integrations.map((name, i) => (
              <Reveal key={name} delay={i % 5}>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-foreground shadow-[0_0_30px_-14px_rgba(34,211,238,0.6)] backdrop-blur-sm transition-colors hover:border-primary/40">
                  <span className="size-1.5 rounded-full bg-primary" /> {name}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} eyebrow="FAQ" title="Everything you're wondering" />

      {/* Final CTA + form */}
      <section id="book" className="scroll-mt-20 py-16 md:py-24">
        <div className="container-xa">
          <div className="ring-gradient rounded-3xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-white/[0.02] p-6 md:p-12">
              <div className="glow-radial pointer-events-none absolute inset-x-0 top-0 h-56" aria-hidden />
              <div className="relative grid gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                    Ready to Hire Your <span className="text-gradient">AI Employees?</span>
                  </h2>
                  <p className="mt-4 text-lg text-muted">
                    Book your free strategy session in two quick steps: tell us a little about your business,
                    then pick a time in our calendar. We&apos;ll map exactly where AI employees save you the
                    most time and money, with no obligation.
                  </p>
                  <ol className="mt-6 space-y-2 text-sm text-foreground">
                    <li className="flex items-center gap-2.5">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">1</span>
                      Your details (about a minute)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">2</span>
                      Choose a time that suits you
                    </li>
                  </ol>
                  <ul className="mt-6 space-y-3">
                    {[
                      "A tailored plan for your business",
                      "Live ROI and quick-win opportunities",
                      "Australian owned · security-led · no lock-in",
                      "Speak to a real specialist, not a bot",
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-muted">
                    Prefer to call?{" "}
                    <a href={SITE.phoneHref} className="font-semibold text-primary hover:underline">{SITE.phone}</a>
                  </p>
                </div>
                <div>
                  <HubspotForm />
                  <p className="mt-4 text-xs leading-relaxed text-muted-2">
                    We collect your details to arrange your strategy session and follow up about it. See our{" "}
                    <Link href="/privacy" className="text-primary underline-offset-2 hover:underline">Privacy Policy</Link>{" "}
                    for how we handle your information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* minimal footer */}
      <footer className="border-t border-border py-8">
        <div className="container-xa flex flex-col items-center justify-between gap-3 text-xs text-muted-2 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName}. XoomAgent™ is a trademark of {SITE.parent}.</p>
          <p>
            Australian owned · ABN {SITE.abn} · {SITE.phone} ·{" "}
            <Link href="/privacy" className="underline-offset-2 hover:text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </footer>

      <StickyCta />

      <JsonLd data={serviceSchema({ name: "AI Strategy Session", description: "Free AI Strategy Session to plan your AI employees.", href: URL, serviceType: "AI employees for business" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Hire Your AI Employees", href: URL }])} />
    </div>
  );
}
