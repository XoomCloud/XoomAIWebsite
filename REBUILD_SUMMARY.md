# XoomAI Website Rebuild — Summary

A complete, ground-up rebuild of **xoomai.com.au** as a premium, conversion-focused marketing site,
repositioning **XoomAgent™** as the hero product: _your managed AI workforce for Australian business._

The previous site was a mix of static HTML pages and a separate React SPA (`/XA/`) for XoomAgent, with
inconsistent design, generic AI-consulting language, weak/duplicated CTAs, and a copy error
("Empower Your Team with With AI Skills"). This rebuild consolidates everything into one consistent,
fast, SEO-strong Next.js application.

---

## 1. What was ingested from the live site

- Positioning, services, nine industries, NAP and trust signals
- Confirmed **XoomAgent™ pricing: from $2,399/month** (real-estate page)
- Chatbot pricing: from **$8,000–$25,000+**
- The **XOOM AI OS** architecture (Management Control Plane → Agent Runtime → Memory / Knowledge /
  Tools / Schedulers / Connectors → Integrations) and the **8 department pillars** (Orchestrator,
  Customer Success, Growth, Finance, Automation, HR & People, Media Hub, Data & Analytics) — provided by
  the client and rebuilt as a responsive, on-brand HTML architecture diagram (no heavy image).

---

## 2. Pages built (25 routes)

| Page | Route | Notes |
|---|---|---|
| Home | `/` | New hero, capabilities, SMB section, industry selector, How-it-works, services, trust, FAQ |
| XoomAgent™ | `/xoomagent` | Highest-converting product page: agent-vs-chatbot, XOOM AI OS architecture, department tabs, deployment, pricing |
| AI Strategy | `/ai-strategy` | Readiness assessment & roadmap |
| AI Automation | `/ai-automation` | Workflow automation |
| AI Analytics | `/ai-analytics` | Predictive analytics & reporting |
| AI Training | `/ai-training` | **Fixed:** "Empower Your Team With Practical AI Skills" |
| Claude Integration | `/claude-integration` | Consolidated from `/claude-ai-integration` + `/claude-ai-consulting` |
| AI Chatbot Development | `/ai-chatbot-development` | Pricing from $8,000 |
| AI Readiness Quiz | `/ai-readiness` | Interactive 10-question lead magnet with score + email gate |
| Industries hub | `/industries` | Directory of all nine |
| 9 Industry pages | `/industries/[slug]` | Unique copy per vertical (legal, financial, logistics, healthcare, real-estate, construction, hospitality, retail, professional-services) |
| Contact | `/contact` | **New** — booking CTA, NAP, validated contact form |
| 404 | `not-found` | Branded |

**Redirects** (in `next.config.ts`): all legacy `*-industry.html` → `/industries/*`, `/industries.html`,
`/claude-ai-integration` + `/claude-ai-consulting` → `/claude-integration`, `/ai-readiness.html`.

---

## 3. Key files

**Design system & config**
- `src/app/globals.css` — Tailwind v4 theme, dark premium AI tokens, utilities, animations
- `src/app/layout.tsx` — fonts, global metadata, header/footer, Org + ProfessionalService schema, analytics
- `src/lib/site.ts` — NAP, nav, booking link, trust points · `src/lib/analytics.ts` — GA4/GTM events · `src/lib/utils.ts`

**UI primitives** — `src/components/ui/`: button, card, badge, accordion, tabs, input
**Reusable sections** — `src/components/sections/`: hero, inner-hero, section, feature-grid, card-grid,
process-timeline, stats-band, pain-solution, integrations, trust-section, pricing-card, cta-block,
checklist, testimonial, **architecture** (XOOM AI OS), faq
**SEO** — `src/components/seo/`: json-ld (Org, ProfessionalService, Product, FAQPage, BreadcrumbList,
Service), breadcrumbs
**Templates** — `src/components/templates/`: service-page, industry-page
**Content** — `src/content/`: services.ts, industries.ts, types.ts
**Lead capture** — `src/components/quiz/readiness-quiz.tsx`, `src/components/contact/contact-form.tsx`
**Technical SEO** — `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`, `src/app/icon.svg`

---

## 4. Copy & positioning improvements

- Hero rewritten to the commercial offer: **"Deploy Your First AI Employee Without Hiring Another Staff Member."**
- Generic "AI strategy and integration" reframed as **supporting** the XoomAgent™ outcome.
- Tangible outcomes everywhere: reduce admin, automate inboxes, qualify leads, process documents,
  update CRMs, manage workflows, support customers 24/7.
- Consistent, strong CTAs sitewide: **Book a Free AI Workflow Audit**, **See What XoomAgent Automates**,
  **Take the AI Readiness Quiz**.
- Trust signals added throughout: Australian owned, XoomCloud MSP backing, dedicated infrastructure,
  no model training on client data, Australian data sovereignty, audit trails.
- Australian English throughout. Stats framed as indicative examples, not unsupported guarantees.

---

## 5. SEO checklist ✅

- [x] Unique, keyword-targeted **title** + **meta description** on every page
- [x] Exactly **one `<h1>`** per page (verified across all 25 routes)
- [x] Logical H1 → H2 → H3 hierarchy via shared `SectionHeading`
- [x] **Canonical** URL on every page
- [x] **OpenGraph + Twitter** meta (dynamic OG image via `opengraph-image.tsx`)
- [x] **JSON-LD**: Organization, ProfessionalService (LocalBusiness), **Product** (XoomAgent, $2,399 offer),
      **FAQPage**, **BreadcrumbList**, **Service** (per service & industry)
- [x] **sitemap.xml** (20 indexable URLs) + **robots.txt** (auto-generated)
- [x] **Breadcrumb** navigation on inner pages (UI + schema)
- [x] Internal links between services ⇄ industries ⇄ XoomAgent ⇄ quiz ⇄ contact
- [x] Industry-specific keywords (AI for law firms / financial advisers / construction / real estate, etc.)
- [x] Legacy URL **301/308 redirects** preserve link equity
- [x] Semantic HTML, descriptive `aria` labels, image/icon `alt`/`aria-hidden`
- [x] Mobile-first responsive; AVIF/WebP image formats configured
- [x] Fast: static generation (SSG) for all content pages, tree-shaken icons, `next/font`

---

## 6. Conversion checklist ✅

- [x] Every key page follows: **pain → solution → use cases → integrations → security → pricing/start → proof → FAQ → CTA**
- [x] Consistent primary CTA (**Book a Free AI Workflow Audit**) + secondary CTA on every page
- [x] **Trackable CTAs** — all emit `dataLayer` events (`trackEvent`) for GA4/GTM
- [x] Lead magnets: **AI Readiness Quiz** (interactive, scored, email-gated), **Workflow Audit**, **30-min consult**
- [x] Booking links wired to the live Outlook booking system
- [x] Trust/security section (XoomCloud, dedicated infra, no training on data, audit trails)
- [x] Transparent pricing (XoomAgent from $2,399/mo + Custom Managed Workforce)
- [x] Social proof / testimonial blocks
- [x] Sticky, conversion-oriented header CTA + footer CTA strip
- [x] Contact form (RHF + Zod validation) with success state, analytics-ready

---

## 7. Notes & next steps

- **Stack note:** `create-next-app` installed Next **16** (current latest App Router) rather than 15 —
  fully compatible and recommended.
- **Analytics:** set `NEXT_PUBLIC_GA_ID` or `NEXT_PUBLIC_GTM_ID` to go live; events already fire.
- **Contact form** captures all fields and emails them to **support@xoomcloud.com.au** via the
  `/api/contact` route (Resend). Set `RESEND_API_KEY` (and optionally `CONTACT_TO` / `CONTACT_FROM`) —
  see `.env.example`. Includes server-side Zod validation, a honeypot, `replyTo` set to the submitter,
  and graceful error handling.
- **Testimonials/stats** use indicative examples — replace with verified client results as they're approved.
- Consider adding a lightweight **blog/MDX** (the old site had 3 posts) for ongoing SEO.
