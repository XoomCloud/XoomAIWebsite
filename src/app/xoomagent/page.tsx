import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InnerHero } from "@/components/sections/inner-hero";
import { RoleHub } from "@/components/sections/role-hub";
import Image from "next/image";
import { Section, SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { Integrations } from "@/components/sections/integrations";
import { TrustSection } from "@/components/sections/trust-section";
import { TestimonialCard } from "@/components/sections/testimonial";
import { FAQ } from "@/components/sections/faq";
import { CTABlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/motion/reveal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Icon, type IconName } from "@/components/icon";
import { JsonLd, productSchema } from "@/components/seo/json-ld";
import { Bot, ArrowRight, Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "XoomAgent™ — Your Managed AI Employees for Australian Business",
  description:
    "XoomAgent™ is a fully managed AI workforce that runs 24/7 — purpose-built AI Employees connected to your inboxes, documents, CRM and tools. Dedicated infrastructure, no training on your data.",
  alternates: { canonical: "/xoomagent" },
  openGraph: {
    title: "XoomAgent™ — Your Managed AI Employees, Running 24/7",
    description:
      "Not just a chatbot — purpose-built AI Employees connected to your business tools, fully managed by XoomAI on dedicated Australian infrastructure.",
    url: "/xoomagent",
  },
};

const roleCategories: { value: string; label: string; icon: IconName; roles: string[] }[] = [
  { value: "core", label: "Core", icon: "Briefcase", roles: ["Sales Representative", "Customer Service Representative", "Executive Assistant", "Accounts Receivable Officer", "Accounts Payable Officer", "Recruitment Coordinator", "Marketing Coordinator", "Client Success Manager", "Operations Coordinator", "Office Administrator", "HR Coordinator", "IT Service Desk Agent", "Estimator / Quoting Officer", "Procurement Officer", "Compliance Coordinator"] },
  { value: "legal", label: "Legal", icon: "Gavel", roles: ["Legal Intake Officer", "Paralegal", "Matter Coordinator", "Conveyancing Assistant", "Legal Compliance Officer"] },
  { value: "financial", label: "Financial Services", icon: "Banknote", roles: ["Client Review Officer", "Fact-Find & Onboarding Officer", "Financial Administration Officer", "Advice Preparation Assistant", "Financial Compliance Officer"] },
  { value: "logistics", label: "Logistics & Transport", icon: "Truck", roles: ["Dispatch Coordinator", "Shipment Tracking Officer", "Carrier Coordinator", "POD & Freight Administration Officer", "Fleet Compliance Coordinator"] },
  { value: "healthcare", label: "Healthcare", icon: "HeartPulse", roles: ["Patient Services Coordinator", "Patient Intake Officer", "Recall Coordinator", "Referral Coordinator", "Practice Administration Officer"] },
  { value: "realestate", label: "Real Estate", icon: "Home", roles: ["Buyer Agent Assistant", "Vendor Prospecting Agent", "Property Management Assistant", "Leasing Coordinator", "Listing Coordinator"] },
  { value: "construction", label: "Construction", icon: "HardHat", roles: ["Estimating Coordinator", "Project Administrator", "Site Administration Officer", "Subcontractor Coordinator", "Construction Compliance Coordinator"] },
  { value: "hospitality", label: "Hospitality", icon: "UtensilsCrossed", roles: ["Reservations Coordinator", "Guest Services Agent", "Events & Functions Coordinator", "Reputation Manager", "Venue Operations Coordinator"] },
  { value: "retail", label: "Retail & E-commerce", icon: "ShoppingCart", roles: ["Shopping Assistant", "Order Support Officer", "Returns & Exchanges Officer", "Inventory Coordinator", "E-commerce Merchandising Coordinator"] },
  { value: "professional", label: "Professional Services", icon: "Users", roles: ["Proposal Manager", "Client Onboarding Manager", "Project Coordinator", "Consultant Assistant", "Resource & Utilisation Coordinator"] },
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
  { q: "How much does it cost?", a: "Pricing is tailored to the AI Employees you choose and the workflows involved. After a free AI Workflow Audit we'll recommend the right roles for your business and give you a clear, fully-managed quote — with no lock-in." },
  { q: "How do we get started and how long does it take?", a: "Start with a free 30-minute AI Workflow Audit. From there, an initial deployment is typically configured and integrated within a few weeks, beginning with your highest-impact workflows." },
];

export default function XoomAgentPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "XoomAgent™", href: "/xoomagent" }]} />

      <InnerHero
        eyebrow="XoomAgent™ · Managed AI Employees"
        title="Your Managed AI Employees, Running 24/7"
        subtitle="XoomAgent™ isn't another chatbot. It's a managed AI workforce — purpose-built AI Employees connected to your inboxes, documents, CRM and tools — that execute real work across your business, around the clock, fully managed by XoomAI."
        primaryLabel="Book a Free AI Workflow Audit"
        secondaryLabel="Take the AI Readiness Quiz"
        secondaryHref="/ai-readiness"
        aside={<RoleHub />}
        stats={[
          { value: "24/7", label: "Always working" },
          { value: "60", label: "Purpose-built roles" },
          { value: "Dedicated", label: "Isolated infrastructure" },
          { value: "No training", label: "On your data" },
        ]}
      />

      {/* Not just a chatbot */}
      <Section>
        <SectionHeading
          eyebrow="Agent, Not Chatbot"
          title="The difference between chatting and getting work done"
          subtitle="A chatbot answers questions. AI Employees complete tasks across your systems — and that's the whole point of XoomAgent™."
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

      {/* AI Employees by role */}
      <Section>
        <SectionHeading
          eyebrow="Build Your AI Workforce"
          title="The right AI Employees for the work that matters"
          subtitle="Choose from 60 purpose-built AI Employees across 10 categories. Each comes with a defined position description, example workflows and secure system connections — and works 24/7 inside your business."
        />
        <Reveal className="mt-12 flex justify-center">
          <Tabs defaultValue="core" className="w-full max-w-4xl">
            <div className="flex justify-center">
              <TabsList>
                {roleCategories.map((c) => (
                  <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            {roleCategories.map((c) => (
              <TabsContent key={c.value} value={c.value}>
                <div className="card-surface rounded-2xl p-7 md:p-9">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold">{c.label} AI Employees</h3>
                      <p className="text-sm text-muted">{c.roles.length} purpose-built {c.roles.length === 1 ? "role" : "roles"}</p>
                    </div>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-2.5">
                    {c.roles.map((r) => (
                      <li key={r} className="flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-sm text-foreground">
                        <ArrowRight className="size-3.5 shrink-0 text-primary" aria-hidden /> {r}
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
        subtitle="Book a free AI Workflow Audit. We'll map your highest-impact workflows and recommend the right AI Employees for your business — no obligation."
      />

      <JsonLd data={productSchema()} />
    </>
  );
}
