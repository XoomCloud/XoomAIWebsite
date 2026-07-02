import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InnerHero } from "@/components/sections/inner-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { CardGrid, type LinkCard } from "@/components/sections/card-grid";
import { TrustSection } from "@/components/sections/trust-section";
import { CTABlock } from "@/components/sections/cta-block";
import { industries } from "@/content/industries";
import { Icon } from "@/components/icon";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "AI Solutions by Industry | XoomAgent™ for Australian Business | XoomAI",
  description:
    "AI automation built for your sector. Explore XoomAgent™ solutions for legal, financial, logistics, healthcare, real estate, construction, hospitality, retail and professional services in Australia.",
  alternates: { canonical: "/industries" },
};

const cards: LinkCard[] = industries.map((i) => ({
  title: i.nav,
  description: i.cardSummary,
  href: `/industries/${i.slug}`,
  icon: i.icon,
  meta: "View solution →",
}));

export default function IndustriesPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Industries", href: "/industries" }]} />

      <InnerHero
        eyebrow="AI by Industry"
        title="AI Solutions Built for the Way Your Industry Works"
        subtitle="XoomAgent™ is configured around the workflows, systems and compliance needs of your sector — so your AI employee understands your business from day one."
        primaryLabel="Book a Free AI Workflow Audit"
        secondaryLabel="See XoomAgent™"
        secondaryHref="/xoomagent"
      />

      <Section>
        <SectionHeading
          eyebrow="Nine Industries"
          title="Find the AI playbook for your sector"
          subtitle="Each solution is unique — built around the real automations, integrations and compliance needs of that industry."
        />
        <div className="mt-12">
          <CardGrid cards={cards} columns={3} />
        </div>
      </Section>

      <Section className="pt-0">
        <SectionHeading
          eyebrow="Examples & Workflows"
          title="The practical work XoomAgent™ can take off your team"
          subtitle="Every industry has different pressure points. These are the common starting workflows we map during your free AI Workflow Audit."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {industries.map((industry, index) => {
            const primaryAutomation = industry.automations[0];
            const secondaryAutomation = industry.automations[1];
            const workflow = industry.workflows[0];

            return (
              <Reveal
                key={industry.slug}
                delay={index % 3}
                className="card-surface flex h-full flex-col rounded-2xl p-6"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/25">
                    <Icon name={industry.icon} className="size-5" />
                  </span>
                  <div>
                    <Badge variant="outline">{industry.nav}</Badge>
                    <h3 className="mt-3 font-display text-xl font-semibold">{industry.h1}</h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted">{industry.cardSummary}</p>

                <div className="mt-6 space-y-3">
                  {[primaryAutomation, secondaryAutomation].filter(Boolean).map((automation) => (
                    <div key={automation.title} className="rounded-xl border border-border/70 bg-surface/40 p-4">
                      <div className="flex items-start gap-3">
                        <Icon name={automation.icon} className="mt-0.5 size-4 shrink-0 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{automation.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-muted">{automation.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex-1 rounded-xl bg-surface-2/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Example workflow</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{workflow.title}</p>
                  <ol className="mt-3 space-y-2">
                    {workflow.steps.slice(0, 4).map((step, stepIndex) => (
                      <li key={step} className="flex items-start gap-2 text-xs leading-relaxed text-muted">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-3xl bg-foreground p-8 text-background md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Workflow Patterns</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
                Built around repeatable work, not generic chat
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-background/70">
                XoomAgent™ is scoped around the handoffs, documents, approvals and system updates that already happen inside your business.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Lead, enquiry and booking capture",
                "Document intake, extraction and review",
                "Email, phone and after-hours triage",
                "CRM, job system and practice system updates",
                "Customer, patient, tenant or client follow-up",
                "Compliance reminders and audit trails",
                "Reporting, status updates and review packs",
                "Human approval for sensitive decisions",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-background/15 bg-background/5 p-4 text-sm text-background/80">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <TrustSection />

      <CTABlock />
    </>
  );
}
