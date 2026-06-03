# XoomAI Website

Premium, conversion-focused marketing site for **XoomAI** — an Australian AI automation and AI agent consultancy selling **XoomAgent™**, a fully managed AI employee / AI workforce platform for Australian SMBs.

## Stack

- **Framework:** Next.js 16 (App Router) · React 19
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens)
- **UI:** shadcn-style primitives on Radix UI (button, card, accordion, tabs, badge, inputs)
- **Animation:** Framer Motion (subtle reveals, hover, hero + scroll transitions)
- **Icons:** Lucide React (curated, tree-shaken icon registry)
- **Forms:** React Hook Form + Zod
- **SEO:** Native Next.js Metadata API + per-page JSON-LD components
- **Fonts:** Sora (display) + Inter (body) via `next/font`
- **Analytics-ready:** GA4 / GTM dataLayer event layer (`src/lib/analytics.ts`)
- **Deploy-ready:** Vercel or Cloudflare Pages

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
```

## Architecture

Content is **data-driven** so service and industry pages stay consistent and DRY:

- `src/content/services.ts` — six service definitions (copy, SEO, pains, deliverables, FAQs)
- `src/content/industries.ts` — nine unique industry definitions
- `src/components/templates/` — shared Service & Industry page templates
- `src/components/sections/` — reusable marketing blocks (hero, feature grid, FAQ, pricing, process timeline, trust, architecture, etc.)
- `src/components/seo/` — JSON-LD schema helpers + breadcrumbs
- `src/lib/site.ts` — single source of truth for NAP, navigation, booking link, trust points

## Routes

`/` · `/xoomagent` · `/ai-strategy` · `/ai-automation` · `/ai-analytics` · `/ai-training` ·
`/claude-integration` · `/ai-chatbot-development` · `/ai-readiness` · `/industries` ·
`/industries/[legal|financial|logistics|healthcare|real-estate|construction|hospitality|retail|professional-services]` ·
`/contact`

Legacy `.html` and old Claude URLs are 301/308-redirected in `next.config.ts`.

## Analytics

Set `NEXT_PUBLIC_GA_ID` or `NEXT_PUBLIC_GTM_ID` to activate analytics. All CTAs and the quiz/contact
forms emit `dataLayer` events via `trackEvent()` — no code changes needed to wire conversions.

See `REBUILD_SUMMARY.md` for the full changelog, SEO checklist and conversion checklist.
