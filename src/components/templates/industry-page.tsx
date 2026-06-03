import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InnerHero } from "@/components/sections/inner-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Integrations } from "@/components/sections/integrations";
import { ImageFeature } from "@/components/sections/image-feature";
import { FAQ } from "@/components/sections/faq";
import { CTABlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { JsonLd, serviceSchema } from "@/components/seo/json-ld";
import { getIndustry, industries } from "@/content/industries";

const IMAGE_POOL = [
  "/images/people/team-collab.jpg",
  "/images/people/office-meeting.jpg",
  "/images/people/working-laptop.jpg",
  "/images/people/professional-woman.jpg",
  "/images/people/advisor.jpg",
  "/images/people/business-handshake.jpg",
];
import { ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";

export function IndustryPage({ slug }: { slug: string }) {
  const ind = getIndustry(slug);
  if (!ind) return null;
  const image = IMAGE_POOL[Math.max(0, industries.findIndex((x) => x.slug === slug)) % IMAGE_POOL.length];

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Industries", href: "/industries" },
          { name: ind.nav, href: `/industries/${ind.slug}` },
        ]}
      />

      <InnerHero
        eyebrow={`XoomAgent™ for ${ind.nav}`}
        title={ind.h1}
        subtitle={ind.heroSubtitle}
        stats={ind.heroStats}
      />

      {/* Pain points */}
      <Section>
        <SectionHeading eyebrow="Sound Familiar?" title="The pressures stacking up in your business" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {ind.pains.map((p, i) => (
            <Reveal key={p.title} delay={i} className="card-surface rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-warning/10 text-warning ring-1 ring-inset ring-warning/20">
                  <AlertTriangle className="size-4" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Automations */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="AI Automations"
          title={`How XoomAgent™ works in ${ind.nav.toLowerCase().startsWith("real") ? "real estate" : ind.nav.toLowerCase()}`}
          subtitle="The automations that remove the most time and risk from your week."
        />
        <div className="mt-12">
          <FeatureGrid features={ind.automations} columns={3} />
        </div>
      </Section>

      {/* Workflows */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Example Workflows" title="What an automated workflow looks like" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {ind.workflows.map((wf, i) => (
            <Reveal key={wf.title} delay={i} className="card-surface rounded-2xl p-7">
              <h3 className="font-display text-lg font-semibold text-primary">{wf.title}</h3>
              <ol className="mt-5 space-y-3">
                {wf.steps.map((step, idx) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-inset ring-primary/20">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-muted">{step}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Modules + Compliance */}
      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal className="card-surface rounded-3xl p-8">
            <Badge variant="solid">Recommended Modules</Badge>
            <h3 className="mt-4 font-display text-xl font-semibold">Your XoomAgent™ starting build</h3>
            <p className="mt-2 text-sm text-muted">The modules we typically deploy first for {ind.nav.toLowerCase()} businesses.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {ind.modules.map((m) => (
                <span key={m} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary">
                  {m}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={1} className="card-surface rounded-3xl p-8">
            <Badge>Compliance & Security</Badge>
            <h3 className="mt-4 font-display text-xl font-semibold">Built for {ind.nav.toLowerCase()} data</h3>
            <ul className="mt-6 space-y-3">
              {ind.compliance.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-muted">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden /> {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Human band */}
      <Section className="pt-0">
        <ImageFeature
          image={image}
          alt={`An Australian ${ind.nav.toLowerCase()} team working alongside their XoomAgent™ AI employee`}
          reverse
          eyebrow="Managed by Real People"
          title={`A real Australian team behind your ${ind.nav.toLowerCase()} AI`}
          body={`We don't hand you software and walk away. XoomAI's Australian, security-led team scopes, builds and manages XoomAgent™ around the way your ${ind.nav.toLowerCase()} business actually runs — and keeps improving it.`}
          points={["Sector-aware setup & integration", "Privacy-first, audited data handling", "Ongoing tuning & optimisation", "Australian-based support"]}
          cta={{ label: "Book a Free AI Workflow Audit", booking: true }}
        />
      </Section>

      {/* Integrations */}
      <Section className="pt-0">
        <Integrations items={ind.integrations} title={`Integrates with your ${ind.nav.toLowerCase()} systems`} />
      </Section>

      <FAQ items={ind.faqs} title={`${ind.nav} AI — your questions answered`} />

      {/* Cross-links */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Keep Exploring" title="More on XoomAgent™ & services" />
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          <Link href="/xoomagent" className="rounded-full border border-primary/40 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
            XoomAgent™ <ArrowRight className="ml-1 inline size-3.5" />
          </Link>
          <Link href="/ai-automation" className="rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm text-muted hover:border-primary/40 hover:text-foreground">
            AI Automation
          </Link>
          <Link href="/ai-chatbot-development" className="rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm text-muted hover:border-primary/40 hover:text-foreground">
            AI Chatbot Development
          </Link>
          <Link href="/industries" className="rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm text-muted hover:border-primary/40 hover:text-foreground">
            All Industries
          </Link>
        </div>
      </Section>

      <CTABlock
        title={`Ready to put an AI employee to work in your ${ind.nav.toLowerCase()} business?`}
        subtitle="Book a free AI Workflow Audit. We'll map exactly where XoomAgent™ saves your team time — no obligation."
      />

      <JsonLd
        data={serviceSchema({
          name: ind.metaTitle,
          description: ind.metaDescription,
          href: `/industries/${ind.slug}`,
          serviceType: ind.keyword,
        })}
      />
    </>
  );
}
