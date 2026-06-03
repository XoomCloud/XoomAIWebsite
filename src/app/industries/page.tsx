import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InnerHero } from "@/components/sections/inner-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { CardGrid, type LinkCard } from "@/components/sections/card-grid";
import { TrustSection } from "@/components/sections/trust-section";
import { CTABlock } from "@/components/sections/cta-block";
import { industries } from "@/content/industries";

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

      <TrustSection />

      <CTABlock />
    </>
  );
}
