import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { CardGrid, type LinkCard } from "@/components/sections/card-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { StatsBand } from "@/components/sections/stats-band";
import { TrustSection } from "@/components/sections/trust-section";
import { TestimonialCard } from "@/components/sections/testimonial";
import { Integrations } from "@/components/sections/integrations";
import { ImageFeature } from "@/components/sections/image-feature";
import { FAQ } from "@/components/sections/faq";
import { CTABlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/motion/reveal";
import { CTAButton } from "@/components/cta-button";
import { Badge } from "@/components/ui/badge";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { JsonLd, productSchema } from "@/components/seo/json-ld";
import { TRUST_POINTS } from "@/lib/site";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: { absolute: "AI Automation Australia | Deploy Your First AI Employee | XoomAI" },
  description:
    "XoomAgent™ helps Australian businesses automate email, documents, customer enquiries, CRM updates, lead follow-up and internal workflows — a fully managed AI workforce by XoomAI.",
  alternates: { canonical: "/" },
};

const capabilities = [
  { icon: "Inbox" as const, title: "Email & Inbox Triage", description: "Reads, sorts, drafts and routes incoming email so the right message reaches the right person in minutes." },
  { icon: "UserCheck" as const, title: "Lead Qualification", description: "Engages and qualifies new leads instantly, then pushes them into your CRM ready for your team." },
  { icon: "Headphones" as const, title: "Customer Support 24/7", description: "Answers enquiries day and night across web, email and chat, escalating anything that needs a human." },
  { icon: "FileText" as const, title: "Document Processing", description: "Extracts, classifies and routes data from invoices, contracts, forms and PDFs — with review where it matters." },
  { icon: "Database" as const, title: "CRM Updates", description: "Keeps contacts, deals, notes and statuses accurate automatically as work happens." },
  { icon: "Workflow" as const, title: "Workflow Automation", description: "Connects your systems so a trigger in one tool updates the others — no manual hand-offs." },
  { icon: "BarChart3" as const, title: "Reporting", description: "Compiles and sends scheduled reports automatically, so you always have a current picture." },
  { icon: "BookOpen" as const, title: "Internal Knowledge Assistant", description: "Answers staff questions from your documents, SOPs and policies — accurately and on brand." },
];

const processSteps = [
  { title: "Audit", description: "We map your workflows and find the highest-impact automation opportunities in a free AI Workflow Audit." },
  { title: "Build", description: "We configure XoomAgent™ for your business — workflows, knowledge and guardrails." },
  { title: "Integrate", description: "We connect it securely to your inboxes, CRM, documents and line-of-business systems." },
  { title: "Train", description: "We tune the agent on your processes and bring your team up to speed." },
  { title: "Optimise", description: "We monitor, measure and continuously improve performance as part of the managed service." },
];

const homeStats = [
  { value: "24/7", label: "Always-on AI workforce" },
  { value: "$2,399", label: "From, per month", note: "Less than a part-time hire" },
  { value: "9", label: "Industries served" },
  { value: "100%", label: "Australian owned", note: "Backed by XoomCloud" },
];

const homeFaqs = [
  { q: "What exactly is XoomAgent™?", a: "XoomAgent™ is a fully managed AI employee for your business — an agent runtime connected to your inboxes, documents, CRM and internal tools. It automates real work like triaging email, qualifying leads, processing documents and updating systems, and it's fully managed by XoomAI." },
  { q: "Is this just a chatbot?", a: "No. A chatbot only chats. XoomAgent™ takes action — it reads and routes email, updates your CRM, processes documents and runs multi-step workflows across your systems, with permissioned access and full audit trails." },
  { q: "Will AI replace my staff?", a: "No. It removes the repetitive admin your team dislikes so they can focus on customers, judgement and growth. Most clients redeploy time, not headcount." },
  { q: "How is our data kept secure?", a: "XoomAgent™ runs on dedicated, isolated infrastructure — not shared multi-tenant AI. Your data is never used to train AI models, access is permissioned and least-privilege, and every action is logged. XoomAI is a brand of XoomCloud, an Australian managed IT and security provider." },
  { q: "How do we get started?", a: "Book a free AI Workflow Audit. In 30 minutes we'll map where AI can save your team time and show you exactly what XoomAgent™ can automate — no obligation." },
  { q: "How much does it cost?", a: "Managed XoomAgent™ deployments start from $2,399/month — less than a part-time admin — with scope confirmed in your free audit. Standalone builds like custom chatbots are quoted per project." },
];

const industryCards: LinkCard[] = industries.map((i) => ({
  title: i.nav,
  description: i.cardSummary,
  href: `/industries/${i.slug}`,
  icon: i.icon,
}));

const serviceCards: LinkCard[] = services.map((s) => ({
  title: s.nav,
  description: s.outcome,
  href: `/${s.slug}`,
  icon: s.deliverables[0]?.icon ?? "Sparkles",
}));

export default function HomePage() {
  return (
    <>
      <Hero
        badge="Your managed AI workforce for Australian business"
        title="Deploy Your First AI Employee Without Hiring Another"
        highlight="Staff Member"
        subtitle="XoomAgent™ helps Australian businesses automate emails, documents, customer enquiries, CRM updates, lead follow-up and internal workflows — fully managed by XoomAI."
        primary={{ label: "Book a Free AI Workflow Audit", booking: true }}
        secondary={{ label: "See What XoomAgent Automates", href: "/xoomagent" }}
        panel={{
          label: "XoomAgent™",
          items: [
            { icon: "Inbox", text: "Triaged 14 new enquiries", status: "Done" },
            { icon: "UserCheck", text: "Qualified 3 leads → CRM", status: "Done" },
            { icon: "FileText", text: "Processed 8 invoices", status: "Done" },
            { icon: "CalendarClock", text: "Booked 2 consultations", status: "Done" },
          ],
        }}
      />

      <Section className="pt-4 md:pt-6">
        <StatsBand stats={homeStats} caption="Figures shown are indicative examples of typical XoomAgent™ deployments, not guarantees." />
      </Section>

      <Section id="capabilities">
        <SectionHeading
          eyebrow="What XoomAgent™ Can Do"
          title="One AI employee. Eight jobs handled."
          subtitle="XoomAgent™ takes the repetitive work off your team's plate and runs it 24/7 — securely connected to the tools you already use."
        />
        <div className="mt-12">
          <FeatureGrid features={capabilities} columns={4} />
        </div>
      </Section>

      {/* Built for Australian SMBs */}
      <Section className="pt-0">
        <div className="ring-gradient relative overflow-hidden rounded-3xl">
          <div className="relative grid gap-10 bg-gradient-to-br from-surface-2 to-surface p-8 md:grid-cols-2 md:p-12">
            <div className="glow-radial pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <Reveal className="relative">
              <Badge variant="solid">Built for Australian SMBs</Badge>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                Enterprise-grade AI, sized and priced for small business
              </h2>
              <p className="mt-4 text-muted">
                You don&apos;t need an in-house data team or an enterprise budget. XoomAI delivers a fully
                managed AI workforce on dedicated infrastructure — built and run by an Australian managed IT
                and security provider, XoomCloud.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <CTAButton booking size="lg" eventLabel="smb_book_audit">
                  Book a Free AI Workflow Audit
                </CTAButton>
                <CTAButton href="/ai-readiness" variant="outline" size="lg" eventLabel="smb_quiz">
                  Take the AI Readiness Quiz
                </CTAButton>
              </div>
            </Reveal>
            <Reveal delay={1} className="relative">
              <ul className="grid gap-3">
                {TRUST_POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-3 rounded-xl border border-border bg-background/40 p-4">
                    <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                    <span className="text-sm font-medium text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Industry selector */}
      <Section id="industries" className="pt-0">
        <SectionHeading
          eyebrow="By Industry"
          title="AI built for the way your industry works"
          subtitle="XoomAgent™ is configured around the workflows, systems and compliance needs of your sector."
        />
        <div className="mt-12">
          <CardGrid cards={industryCards} columns={3} />
        </div>
        <div className="mt-8 text-center">
          <Link href="/industries" className="text-sm font-medium text-primary hover:underline">
            View all industries →
          </Link>
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How It Works"
          title="From audit to optimised AI workforce in five steps"
          subtitle="A clear, managed path from your first workflow audit to a continuously improving AI employee."
        />
        <div className="mt-14">
          <ProcessTimeline steps={processSteps} />
        </div>
      </Section>

      {/* Services */}
      <Section id="services" className="pt-0">
        <SectionHeading
          eyebrow="Services"
          title="Strategy and integration that support the outcome"
          subtitle="Every service exists to get XoomAgent™ delivering value in your business faster and more securely."
        />
        <div className="mt-12">
          <CardGrid cards={serviceCards} columns={3} />
        </div>
      </Section>

      {/* Human band — real people behind the AI */}
      <Section>
        <ImageFeature
          image="/images/people/team-collab.jpg"
          alt="The XoomAI team collaborating on an AI workforce deployment for an Australian business"
          eyebrow="Real People, Real Support"
          title="AI deployed and managed by an Australian team"
          body="XoomAgent™ is the technology — but behind it is a real Australian team from XoomCloud who scope, build, secure and continuously improve your AI workforce. You're never handed a tool and left to figure it out."
          points={[
            "Australian-based, security-led specialists",
            "Hands-on setup, integration and tuning",
            "Ongoing monitoring & optimisation",
            "A real person to call on 1300 040 225",
          ]}
          cta={{ label: "Book a Free AI Workflow Audit", booking: true }}
        />
      </Section>

      <TrustSection />

      <Section className="pt-0">
        <Integrations
          items={[
            "Microsoft 365", "Google Workspace", "HubSpot", "Salesforce", "SharePoint", "Outlook & Gmail",
            "Xero / MYOB", "Calendars", "Websites", "Make.com", "Zapier", "REST APIs",
          ]}
        />
      </Section>

      <Section className="pt-0">
        <TestimonialCard
          quote="XoomAgent™ now responds to every enquiry within minutes, day or night. It's like adding a tireless team member who never drops the ball."
          name="James M."
          role="Principal, Gold Coast Real Estate Agency"
        />
      </Section>

      <FAQ items={homeFaqs} title="Your questions, answered" />

      <CTABlock
        title="Ready to deploy your first AI employee?"
        subtitle="Book a free AI Workflow Audit. In 30 minutes we'll map exactly where XoomAgent™ can save your team time — no obligation."
      />

      <JsonLd data={productSchema()} />
    </>
  );
}
