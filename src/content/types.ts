import type { IconName } from "@/components/icon";
import type { Feature } from "@/components/sections/feature-grid";
import type { FaqItem } from "@/components/sections/faq";

export type ServiceContent = {
  slug: string;
  nav: string;
  eyebrow: string;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  /** Hero */
  h1: string;
  heroSubtitle: string;
  outcome: string;
  heroStats?: { value: string; label: string }[];
  /** Pain */
  painTitle: string;
  painIntro: string;
  pains: string[];
  /** Deliverables */
  deliverTitle: string;
  deliverIntro: string;
  deliverables: Feature[];
  /** Use cases */
  useCasesTitle: string;
  useCases: string[];
  /** Integrations */
  integrations?: string[];
  /** Why XoomAI */
  whyPoints: { icon: IconName; title: string; description: string }[];
  /** Pricing line */
  pricingNote?: string;
  faqs: FaqItem[];
  related: string[];
};

export type IndustryContent = {
  slug: string;
  nav: string;
  icon: IconName;
  /** SEO */
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  cardSummary: string;
  /** Hero */
  h1: string;
  heroSubtitle: string;
  heroStats: { value: string; label: string }[];
  /** Pain points (top 4) */
  pains: { title: string; body: string }[];
  /** AI automations (5-8) */
  automations: Feature[];
  /** Example workflows */
  workflows: { title: string; steps: string[] }[];
  /** Recommended XoomAgent modules */
  modules: string[];
  /** Compliance/security notes */
  compliance: string[];
  /** Integrations */
  integrations: string[];
  faqs: FaqItem[];
};
