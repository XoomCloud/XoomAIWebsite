import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InnerHero } from "@/components/sections/inner-hero";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { Integrations } from "@/components/sections/integrations";
import { TrustSection } from "@/components/sections/trust-section";
import { PricingCard } from "@/components/sections/pricing-card";
import { TestimonialCard } from "@/components/sections/testimonial";
import { FAQ } from "@/components/sections/faq";
import { CTABlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/motion/reveal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon, type IconName } from "@/components/icon";
import { JsonLd, productSchema } from "@/components/seo/json-ld";
import { Bot, ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "XoomAgent™ — Your Managed AI Employee for Australian Business",
  description:
    "XoomAgent™ is a fully managed AI employee that runs 24/7 — an agent runtime connected to your inboxes, documents, CRM and tools. Dedicated infrastructure, no training on your data. From $2,399/month.",
  alternates: { canonical: "/xoomagent" },
  openGraph: {
    title: "XoomAgent™ — Your Managed AI Employee, Running 24/7",
    description:
      "Not just a chatbot — an agent runtime connected to your business tools, fully managed by XoomAI on dedicated Australian infrastructure.",
    url: "/xoomagent",
  },
};

const departments: { value: string; label: string; codename: string; icon: IconName; tasks: string[] }[] = [
  { value: "management", label: "Management", codename: "Orchestrator", icon: "Briefcase", tasks: ["Routes tasks and prioritises work across the business", "Manages executive email and calendar", "Produces daily briefings and status summaries", "Coordinates the other agents and your team"] },
  { value: "sales", label: "Sales & Growth", codename: "ORBIT", icon: "TrendingUp", tasks: ["Qualifies and follows up leads in minutes", "Drafts proposals and tailored outreach", "Researches accounts and market signals", "Keeps your pipeline and CRM up to date"] },
  { value: "service", label: "Customer Service", codename: "PULSE", icon: "Headphones", tasks: ["Answers customer enquiries 24/7 across channels", "Triages and routes support tickets", "Monitors satisfaction and flags at-risk accounts", "Escalates complex cases to your team with context"] },
  { value: "finance", label: "Finance", codename: "VAULT", icon: "Banknote", tasks: ["Processes invoices and extracts data", "Prepares bookkeeping and reconciliations for review", "Tracks cash flow and surfaces exceptions", "Assembles compliance documentation"] },
  { value: "operations", label: "Operations & Admin", codename: "CRANK", icon: "Workflow", tasks: ["Automates multi-step workflows across systems", "Integrates your ERP, CRM and line-of-business tools", "Removes copy-paste and data-entry work", "Coordinates approvals and routing"] },
  { value: "hr", label: "HR & People", codename: "TRIBE", icon: "Users", tasks: ["Screens applicants and schedules interviews", "Runs consistent onboarding workflows", "Handles leave requests and routine queries", "Maintains people records and compliance"] },
  { value: "marketing", label: "Media Hub", codename: "LUMEN", icon: "Sparkles", tasks: ["Drafts on-brand content and campaigns", "Schedules and coordinates social posts", "Repurposes content across channels", "Reports on campaign performance"] },
  { value: "data", label: "Data & Analytics", codename: "QUARTZ", icon: "BarChart3", tasks: ["Builds and updates dashboards", "Monitors KPIs and targets in real time", "Detects anomalies before they cost you", "Generates plain-English reports on demand"] },
];

const capabilities = [
  { icon: "Inbox" as const, title: "Inbox & Email", description: "Reads, drafts, sorts and routes email so nothing slips and responses go out in minutes." },
  { icon: "FileText" as const, title: "Documents", description: "Extracts and classifies data from invoices, contracts and forms, with human review where it matters." },
  { icon: "UserCheck" as const, title: "Leads", description: "Engages, qualifies and follows up leads, pushing them into your CRM ready to close." },
  { icon: "Database" as const, title: "CRM & Systems", description: "Updates records and acts across your systems with permissioned, least-privilege access." },
  { icon: "Workflow" as const, title: "Workflows", description: "Runs multi-step processes across tools, with schedulers and triggers — not just chat." },
  { icon: "BookOpen" as const, title: "Knowledge", description: "Answers from your documents and SOPs via vector memory and a knowledge graph." },
];

const deployment = [
  { title: "Dedicated gateway", description: "Your own isolated XoomAgent™ gateway on dedicated infrastructure — not shared multi-tenant AI." },
  { title: "Configured workflows", description: "We configure the agent's tasks, tools, knowledge and guardrails around your business." },
  { title: "Secure integration", description: "Connected to your inboxes, CRM, documents and systems via MCP servers and connectors." },
  { title: "Human-in-the-loop", description: "Review checkpoints and permissioned access keep you in control of sensitive actions." },
  { title: "Ongoing optimisation", description: "We monitor, measure and continuously improve the agent as part of the managed service." },
];

const faqs = [
  { q: "Is XoomAgent™ just a chatbot?", a: "No. A chatbot only chats. XoomAgent™ is an agent runtime — it takes action across your systems: triaging email, qualifying leads, processing documents, updating your CRM and running multi-step workflows on schedules, with permissioned access and full audit trails." },
  { q: "How is it different from using ChatGPT or Claude directly?", a: "Consumer AI tools don't know your business, can't securely access your systems and don't run on a schedule. XoomAgent™ is configured for your workflows, connected to your tools through secure connectors and MCP servers, runs 24/7, and is fully managed and monitored by XoomAI." },
  { q: "What does it integrate with?", a: "Microsoft 365, Google Workspace, HubSpot, Salesforce and other CRMs, SharePoint, calendars, inboxes, websites and almost anything with an API. It connects through MCP servers and connectors, and works with platforms including OpenAI, Anthropic, Google, Microsoft and AWS." },
  { q: "Is our data used to train AI models?", a: "Never. XoomAgent™ runs on dedicated, isolated infrastructure. Your data is never used to train AI models, access is permissioned and least-privilege, and every action is logged for audit." },
  { q: "How much does it cost?", a: "Managed XoomAgent™ deployments start from $2,399/month — less than a part-time admin. Final scope and pricing are confirmed after a free AI Workflow Audit. Larger, multi-department rollouts are quoted as custom managed packages." },
  { q: "How do we get started and how long does it take?", a: "Start with a free 30-minute AI Workflow Audit. From there, an initial deployment is typically configured and integrated within a few weeks, beginning with your highest-impact workflows." },
];

export default function XoomAgentPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "XoomAgent™", href: "/xoomagent" }]} />

      <InnerHero
        eyebrow="XoomAgent™ · Managed AI Employee"
        title="Your Managed AI Employee, Running 24/7"
        subtitle="XoomAgent™ isn't another chatbot. It's a managed agent runtime — connected to your inboxes, documents, CRM and tools — that executes real work across your business, around the clock, fully managed by XoomAI."
        primaryLabel="Book a Free AI Workflow Audit"
        secondaryLabel="Take the AI Readiness Quiz"
        secondaryHref="/ai-readiness"
        stats={[
          { value: "24/7", label: "Always working" },
          { value: "From $2,399", label: "Per month" },
          { value: "Dedicated", label: "Isolated infrastructure" },
          { value: "No training", label: "On your data" },
        ]}
      />

      {/* Not just a chatbot */}
      <Section>
        <SectionHeading
          eyebrow="Agent, Not Chatbot"
          title="The difference between chatting and getting work done"
          subtitle="A chatbot answers questions. An AI employee completes tasks across your systems — and that's the whole point of XoomAgent™."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal className="card-surface rounded-2xl p-7">
            <h3 className="font-display text-lg font-semibold text-muted">A typical chatbot</h3>
            <ul className="mt-4 space-y-3">
              {["Only chats — can't take action", "No access to your real systems", "Forgets context between sessions", "Rigid, scripted responses", "Runs only when someone types"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-muted">
                  <X className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1} className="ring-gradient rounded-2xl">
            <div className="card-surface h-full rounded-2xl p-7">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Bot className="size-4" aria-hidden />
                </span>
                XoomAgent™
              </h3>
              <ul className="mt-4 space-y-3">
                {["Executes real tasks across your tools", "Securely connected to email, CRM & docs", "Persistent memory and knowledge", "Reasoned, context-aware decisions", "Runs 24/7 on schedules and triggers"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Architecture — the real XOOM AI OS diagram */}
      <Section className="on-dark">
        <SectionHeading
          eyebrow="The XOOM AI OS"
          title="An enterprise agent platform under the hood"
          subtitle="XoomAgent™ runs on the XOOM AI OS — a control plane that manages, secures and orchestrates autonomous agents connected to your memory, knowledge, tools and systems."
        />
        <Reveal className="mx-auto mt-12 max-w-5xl">
          <div className="ring-gradient rounded-3xl">
            <div className="card-surface overflow-hidden rounded-3xl p-2 md:p-3">
              <Image
                src="/images/xoom-ai-os-architecture.jpg"
                alt="XOOM AI OS high-level architecture: a management control plane (swarm and agent management, task planning, communication and orchestration, memory and knowledge, security and governance, monitoring) above the Xoom Agent Runtime, connected to memory, knowledge, tools, schedulers and connectors, plus clients and integrations, and working with leading AI, cloud and data platforms."
                width={1536}
                height={1024}
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="h-auto w-full rounded-2xl"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            The XOOM AI OS — the control plane behind every XoomAgent™ deployment. Each agent runs in an
            isolated gateway with permissioned access and full audit trails.
          </p>
        </Reveal>
      </Section>

      {/* Department pillars */}
      <Section>
        <SectionHeading
          eyebrow="By Department"
          title="One platform. A specialist agent for every department."
          subtitle="Deploy a single AI employee or a coordinated workforce — each agent tuned to the work of a specific department."
        />
        <Reveal className="mt-12 flex justify-center">
          <Tabs defaultValue="management" className="w-full max-w-4xl">
            <div className="flex justify-center">
              <TabsList>
                {departments.map((d) => (
                  <TabsTrigger key={d.value} value={d.value}>{d.label}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            {departments.map((d) => (
              <TabsContent key={d.value} value={d.value}>
                <div className="card-surface rounded-2xl p-7 md:p-9">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon name={d.icon} className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{d.label}</h3>
                      <p className="text-sm text-muted">XoomAgent™ pillar: <span className="text-primary">{d.codename}</span></p>
                    </div>
                  </div>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {d.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-2.5 rounded-xl border border-border bg-background/40 p-4 text-sm text-foreground">
                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </Section>

      {/* Capabilities */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Capabilities" title="What XoomAgent™ handles every day" />
        <div className="mt-12">
          <FeatureGrid features={capabilities} columns={3} />
        </div>
      </Section>

      {/* Integrations */}
      <Section className="pt-0">
        <Integrations
          title="Connected to your business tools"
          items={["Microsoft 365", "Google Workspace", "HubSpot", "Salesforce", "Other CRMs", "SharePoint", "Outlook & Gmail", "Calendars", "Websites", "MCP Servers", "REST APIs", "Webhooks"]}
        />
      </Section>

      <TrustSection />

      {/* Deployment model */}
      <Section>
        <SectionHeading
          eyebrow="Deployment Model"
          title="A dedicated, managed deployment — not a DIY tool"
          subtitle="We stand up your gateway, configure the workflows, integrate securely and keep optimising. You get outcomes, not a project to maintain."
        />
        <div className="mt-14">
          <ProcessTimeline steps={deployment} />
        </div>
      </Section>

      {/* Pricing */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Pricing"
          title="Transparent, managed pricing"
          subtitle="Start with one department and scale into a coordinated AI workforce. Every plan is fully managed by XoomAI."
        />
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <PricingCard
            name="XoomAgent™ Managed"
            price="$2,399"
            period="/month"
            blurb="A dedicated AI employee for your highest-impact department."
            highlight
            note="Final scope confirmed after a free AI Workflow Audit · 30-day satisfaction guarantee"
            features={[
              "Dedicated, isolated gateway",
              "One department / workflow set configured",
              "Secure integration with your core systems",
              "Memory, knowledge & connectors included",
              "Monitoring, audit trails & optimisation",
              "Australian-based managed support",
            ]}
            ctaLabel="Book a Free AI Workflow Audit"
          />
          <PricingCard
            name="Custom Managed Workforce"
            price="Custom"
            period=""
            blurb="A coordinated, multi-department AI workforce for larger rollouts."
            note="Tailored managed packages — scoped to your business"
            features={[
              "Multiple coordinated department agents",
              "Advanced integrations & MCP servers",
              "Custom workflows and guardrails",
              "Enhanced governance & reporting",
              "Dedicated onboarding & roadmap",
              "Priority Australian-based support",
            ]}
            ctaLabel="Book a Consultation"
          />
        </div>
      </Section>

      <Section className="pt-0">
        <TestimonialCard
          quote="It genuinely feels like we hired someone — except this team member works nights, weekends and never forgets a follow-up."
          name="James M."
          role="Principal, Gold Coast Real Estate Agency"
        />
      </Section>

      <FAQ items={faqs} title="XoomAgent™ questions, answered" />

      <CTABlock
        title="See exactly what XoomAgent™ can automate for you"
        subtitle="Book a free AI Workflow Audit. We'll map your highest-impact workflows and show you what your AI employee would handle — no obligation."
      />

      <JsonLd data={productSchema()} />
    </>
  );
}
