import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InnerHero } from "@/components/sections/inner-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { FeatureGrid } from "@/components/sections/feature-grid";
import { Checklist } from "@/components/sections/checklist";
import { Integrations } from "@/components/sections/integrations";
import { FAQ } from "@/components/sections/faq";
import { CTABlock } from "@/components/sections/cta-block";
import { Reveal } from "@/components/motion/reveal";
import { Icon } from "@/components/icon";
import { JsonLd, serviceSchema } from "@/components/seo/json-ld";
import { getService } from "@/content/services";
import { AlertTriangle } from "lucide-react";

export function serviceMetadata(slug: string): Metadata {
  const s = getService(slug);
  if (!s) return {};
  return {
    title: { absolute: s.metaTitle },
    description: s.metaDescription,
    keywords: [s.keyword],
    alternates: { canonical: `/${s.slug}` },
    openGraph: { title: s.metaTitle, description: s.metaDescription, url: `/${s.slug}` },
  };
}

export function ServicePage({ slug }: { slug: string }) {
  const s = getService(slug);
  if (!s) return null;

  return (
    <>
      <Breadcrumbs items={[{ name: s.nav, href: `/${s.slug}` }]} />

      <InnerHero
        eyebrow={s.eyebrow}
        title={s.h1}
        subtitle={s.heroSubtitle}
        stats={s.heroStats}
      />

      {/* Pain */}
      <Section>
        <SectionHeading eyebrow="The Problem" title={s.painTitle} subtitle={s.painIntro} />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
          {s.pains.map((p, i) => (
            <Reveal key={p} delay={i} className="card-surface flex items-start gap-3 rounded-2xl p-5">
              <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
              <span className="text-sm text-muted">{p}</span>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Deliverables */}
      <Section className="pt-0">
        <SectionHeading eyebrow="What We Deliver" title={s.deliverTitle} subtitle={s.deliverIntro} />
        <div className="mt-12">
          <FeatureGrid features={s.deliverables} columns={3} />
        </div>
      </Section>

      {/* Use cases */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Use Cases" title={s.useCasesTitle} />
        <div className="mx-auto mt-10 max-w-4xl">
          <Checklist items={s.useCases} columns={2} />
        </div>
      </Section>

      {/* Integrations */}
      {s.integrations && (
        <Section className="pt-0">
          <Integrations items={s.integrations} />
        </Section>
      )}

      {/* Why XoomAI */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Why XoomAI" title="A managed outcome, backed by an Australian MSP" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {s.whyPoints.map((w, i) => (
            <Reveal key={w.title} delay={i} className="card-surface rounded-2xl p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-inset ring-accent/20">
                <Icon name={w.icon} className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.description}</p>
            </Reveal>
          ))}
        </div>
        {s.pricingNote && (
          <Reveal className="card-surface mx-auto mt-8 max-w-3xl rounded-2xl border-primary/20 p-6 text-center">
            <p className="text-sm text-muted">{s.pricingNote}</p>
          </Reveal>
        )}
      </Section>

      <FAQ items={s.faqs} />

      {/* Related */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Keep Exploring" title="Related services & next steps" />
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          <Link href="/xoomagent" className="rounded-full border border-primary/40 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
            XoomAgent™ →
          </Link>
          {s.related.map((r) => {
            const rs = getService(r);
            if (!rs) return null;
            return (
              <Link key={r} href={`/${rs.slug}`} className="rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm text-muted hover:border-primary/40 hover:text-foreground">
                {rs.nav}
              </Link>
            );
          })}
        </div>
      </Section>

      <CTABlock />

      <JsonLd
        data={serviceSchema({
          name: s.metaTitle,
          description: s.metaDescription,
          href: `/${s.slug}`,
          serviceType: s.keyword,
        })}
      />
    </>
  );
}
