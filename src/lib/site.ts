/**
 * Central site configuration: NAP, booking links, navigation and trust signals.
 * Single source of truth for layout, SEO and schema.
 */

export const SITE = {
  name: "XoomAI",
  legalName: "XoomCloud Pty Ltd",
  brand: "XoomAI",
  product: "XoomAgent™",
  tagline: "Your managed AI workforce for Australian business.",
  description:
    "XoomAI deploys XoomAgent™ — a fully managed AI employee for Australian SMBs that automates email, documents, customer enquiries, CRM updates and internal workflows, 24/7.",
  url: "https://xoomai.com.au",
  locale: "en_AU",
  // NAP
  phone: "1300 040 225",
  phoneHref: "tel:1300040225",
  email: "ai@xoomcloud.com.au",
  emailHref: "mailto:ai@xoomcloud.com.au",
  abn: "37 680 921 162",
  parent: "XoomCloud Pty Ltd",
  areaServed: ["Brisbane", "Gold Coast", "Queensland", "Australia"],
  region: "AU",
  // Conversion links
  bookingUrl:
    "https://outlook.office.com/bookwithme/user/2a9004d9695d44c8aefc7bf4ad7cda66@xoomcloud.com.au/meetingtype/zWfv__a03U-L3mz4vdp4Cg2?anonymous&ep=mlink",
  quizPath: "/ai-readiness",
  // Pricing
  xoomAgentFromPrice: "$2,399",
  xoomAgentPriceCurrency: "AUD",
  social: {
    linkedin: "https://www.linkedin.com/company/xoomcloud",
  },
  founded: "2024",
} as const;

export const CTA = {
  audit: "Book a Free AI Workflow Audit",
  automate: "See What XoomAgent Automates",
  quiz: "Take the AI Readiness Quiz",
  consult: "Book a 30-Minute Consultation",
  demo: "Book a Demo",
} as const;

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const SERVICES_NAV: NavChild[] = [
  { label: "AI Strategy", href: "/ai-strategy", description: "AI readiness assessment & roadmap" },
  { label: "AI Automation", href: "/ai-automation", description: "Automate manual, repetitive work" },
  { label: "AI Analytics", href: "/ai-analytics", description: "Predictive insights & reporting" },
  { label: "AI Training", href: "/ai-training", description: "Upskill your team with practical AI" },
  { label: "Claude Integration", href: "/claude-integration", description: "Enterprise Claude AI builds" },
  { label: "AI Chatbot Development", href: "/ai-chatbot-development", description: "Custom chatbots & assistants" },
];

export const INDUSTRIES_NAV: NavChild[] = [
  { label: "Legal", href: "/industries/legal" },
  { label: "Financial Services", href: "/industries/financial" },
  { label: "Logistics & Transport", href: "/industries/logistics" },
  { label: "Healthcare", href: "/industries/healthcare" },
  { label: "Real Estate", href: "/industries/real-estate" },
  { label: "Construction", href: "/industries/construction" },
  { label: "Hospitality", href: "/industries/hospitality" },
  { label: "Retail", href: "/industries/retail" },
  { label: "Professional Services", href: "/industries/professional-services" },
];

export const MAIN_NAV: NavItem[] = [
  { label: "XoomAgent™", href: "/xoomagent" },
  { label: "Services", href: "/#services", children: SERVICES_NAV },
  { label: "Industries", href: "/industries", children: INDUSTRIES_NAV },
  { label: "AI Readiness Quiz", href: "/ai-readiness" },
  { label: "Contact", href: "/contact" },
];

export const TRUST_POINTS = [
  "Australian owned & operated",
  "Backed by XoomCloud managed IT & security",
  "Dedicated infrastructure — not shared multi-tenant AI",
  "No model training on your data",
  "Australian data sovereignty & Privacy Act focus",
  "Full audit trails & permissioned access",
] as const;
