import type { Metadata } from "next";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/hero";
import { StickyCta } from "@/components/landing/sticky-cta";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { Testimonials } from "@/components/landing/testimonials";
import { HubspotForm } from "@/components/landing/hubspot-form";
import { SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { FAQ } from "@/components/sections/faq";
import { Reveal } from "@/components/motion/reveal";
import { IconBadge } from "@/components/icon-badge";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/seo/json-ld";
import { SITE } from "@/lib/site";
import { Clock, Zap, Brain, Check } from "lucide-react";

const URL = "/youraiemployee";

export const metadata: Metadata = {
  title: { absolute: "Hire Your First AI Employee | XoomAI" },
  description:
    "An AI employee that works 24/7, never sleeps and automates the repetitive work holding your Australian business back. Book a free AI Strategy Session with XoomAI.",
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: "Hire Your First AI Employee | XoomAI",
    description:
      "An AI employee that works 24/7 and automates the repetitive work holding your business back. Book a free AI Strategy Session.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Your First AI Employee | XoomAI",
    description: "An AI employee that works 24/7 and automates the work holding your business back.",
  },
};

const benefits = [
  { icon: Clock, title: "Works 24/7", body: "Answers enquiries, replies to email and completes tasks around the clock — evenings, weekends and public holidays included." },
  { icon: Zap, title: "Never Sleeps", body: "No sick days, no leave, no drop in output. Your AI employee shows up every single day and never lets a task fall through the cracks." },
  { icon: Brain, title: "Always Learning", body: "Trained on your business, it gets sharper over time — understanding your processes, tone and systems more with every task." },
];

const steps = [
  { icon: "Search" as const, title: "Discover", body: "We map your workflows in a free strategy session and find the highest-impact work to automate first." },
  { icon: "Rocket" as const, title: "Deploy", body: "We configure and connect your AI employee to your inbox, CRM and tools — fully managed by XoomAI." },
  { icon: "Workflow" as const, title: "Automate", body: "It starts handling real work: enquiries, follow-ups, documents, data entry and reporting." },
  { icon: "TrendingUp" as const, title: "Scale", body: "Add more skills and departments as you grow — one AI employee becomes an entire AI workforce." },
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
  { q: "What exactly is an AI employee?", a: "It's a fully managed AI system that performs real work inside your business — answering enquiries, replying to email, processing documents, updating your CRM and running workflows. Unlike a chatbot, it takes action across your tools, 24/7." },
  { q: "Will it replace my staff?", a: "No. It removes the repetitive, low-value work your team dislikes so they can focus on customers, growth and the work that needs a human. Most businesses redeploy time, not people." },
  { q: "How long until it's working?", a: "After your free strategy session, an initial deployment is typically live within a few weeks — starting with your highest-impact workflow so you see value fast." },
  { q: "Which systems does it connect to?", a: "Microsoft 365, Google Workspace, Teams, SharePoint, HubSpot, Salesforce, Xero, QuickBooks, Dynamics, Outlook and most tools with an API." },
  { q: "Is my business data secure?", a: "Yes. It runs on dedicated, isolated infrastructure with permissioned access and full audit trails, and your data is never used to train AI models. XoomAI is backed by XoomCloud, an Australian managed IT and security provider." },
  { q: "Do I need technical staff to run it?", a: "No. XoomAI builds, hosts, monitors and continuously improves your AI employee. You get the outcomes without needing developers in-house." },
  { q: "How much does it cost?", a: "It's designed to cost far less than a part-time hire, with pricing confirmed after your free strategy session once we understand the workflows you want automated." },
  { q: "What size business is this for?", a: "It's built for Australian businesses with roughly 10–100 staff across professional services, trades, construction, accounting, legal, healthcare, manufacturing and retail." },
  { q: "What happens in the free strategy session?", a: "In about 30 minutes we map where an AI employee would save you the most time and money, and outline a practical, secure plan. No obligation." },
  { q: "Is XoomAI Australian?", a: "Yes — Australian owned and operated, with Australian data handling and a Privacy Act–first approach, backed by XoomCloud's managed IT and security expertise." },
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

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="Why an AI employee" title="Always on. Always working. Always improving." />
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
          <SectionHeading eyebrow="How it works" title="From first call to a working AI employee" subtitle="A clear, managed path — we do the heavy lifting." />
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
          <SectionHeading eyebrow="ROI Calculator" title="See what you're losing to repetitive work" subtitle="Move the sliders to estimate what an AI employee could save you each year." />
          <div className="mx-auto mt-12 max-w-4xl">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* What it can do */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="Capabilities" title="What can your AI employee do?" subtitle="One hire. Every department covered." />
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

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container-xa">
          <SectionHeading eyebrow="What owners say" title="Real outcomes, real businesses" />
          <div className="mt-12">
            <Testimonials />
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
                    Ready to Hire Your First <span className="text-gradient">AI Employee?</span>
                  </h2>
                  <p className="mt-4 text-lg text-muted">
                    Book your free strategy session today. In 30 minutes we&apos;ll map exactly where an AI
                    employee saves you the most time and money — no obligation.
                  </p>
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
          <p>Australian owned · ABN {SITE.abn} · {SITE.phone}</p>
        </div>
      </footer>

      <StickyCta />

      <JsonLd data={serviceSchema({ name: "AI Strategy Session", description: "Free AI Strategy Session to plan your first AI employee.", href: URL, serviceType: "AI employee for business" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Hire Your First AI Employee", href: URL }])} />
    </div>
  );
}
