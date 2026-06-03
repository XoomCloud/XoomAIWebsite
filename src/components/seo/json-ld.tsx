import { SITE } from "@/lib/site";

/** Renders a JSON-LD <script> block. Server component — safe in <head> or body. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, generated server-side from our own data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: `${SITE.url}/images/xoomai-logo-dark.png`,
    email: SITE.email,
    telephone: SITE.phone,
    parentOrganization: { "@type": "Organization", name: SITE.parent },
    areaServed: SITE.areaServed.map((a) => ({ "@type": "Place", name: a })),
    sameAs: [SITE.social.linkedin],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "sales",
      email: SITE.email,
      areaServed: "AU",
      availableLanguage: "English",
    },
  };
}

export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#localbusiness`,
    name: SITE.name,
    image: `${SITE.url}/opengraph-image`,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "$$",
    address: { "@type": "PostalAddress", addressCountry: "AU", addressRegion: "QLD" },
    areaServed: SITE.areaServed,
    knowsAbout: [
      "AI automation",
      "AI agents",
      "AI workflow automation",
      "Claude AI integration",
      "AI chatbots",
      "Business process automation",
    ],
  };
}

export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: SITE.product,
    description:
      "XoomAgent™ is a fully managed AI employee for Australian businesses — an agent runtime connected to your inboxes, documents, CRM and internal tools, deployed on dedicated infrastructure and managed by XoomAI.",
    brand: { "@type": "Brand", name: SITE.name },
    category: "AI Workforce Automation Platform",
    offers: {
      "@type": "Offer",
      price: "2399",
      priceCurrency: SITE.xoomAgentPriceCurrency,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "2399",
        priceCurrency: SITE.xoomAgentPriceCurrency,
        unitText: "MONTH",
      },
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/xoomagent`,
    },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.href}`,
    })),
  };
}

export function serviceSchema(opts: {
  name: string;
  description: string;
  href: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SITE.areaServed,
    url: `${SITE.url}${opts.href}`,
  };
}
