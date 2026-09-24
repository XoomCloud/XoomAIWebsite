# Take a Week Off campaign

Routes: `/takeaweekoff` and `/takeaweekoff/book`.

The campaign is isolated through CSS Modules and the existing `ChromeGate`. It keeps the original XoomAI logo and brand colours, with the approved Poppins/Montserrat typography system: Poppins headings and metrics, Montserrat body text and controls. Fonts are self-hosted with `next/font` in the campaign layout, covering both campaign routes. The landing page is statically rendered; the booking page forwards allowlisted UTM parameters to the existing HubSpot meeting calendar. Audit links record `cta_book_audit` in dataLayer and `AuditBookingClick` in Meta with campaign and placement. The `BookingLeadTracker` handles confirmed bookings as `Lead` with content name `Free AI Workflow Audit`; CTA clicks never fire Lead. See `docs/meta-conversions-api.md` for required server setup and test instructions.

The financial adviser and NDIS outcomes were supplied by the client. Keep the SOA result scoped to preparation and the NDIS uplift scoped to billable time. Construction is explicitly a workflow example with no invented numerical outcome.

Client names supplied for the proof section: Pure Private Wealth (financial advice), Stirling Supports (NDIS, 20 support workers), and Elite Structures (construction workflow example). Retain the outcomes disclaimer. The main CTA includes the established Australian business / 5+ staff qualification. Campaign copy uses XoomAgent™ and managed AI workforce consistently.

## Artwork

Source campaign: `24092026 Take A Week Off/slide-01.png` and `slide-07.png`, supplied by the client.

- `public/images/take-a-week-off/hero.webp`: text-free adaptation of slide 01.
- `public/images/take-a-week-off/time-back.webp`: text-free adaptation of slide 07.
- `public/images/take-a-week-off/campaign.webp`: optimised original slide 01 for page sharing.

The two text-free adaptations were made using the built-in image-generation tool, then encoded as WebP. Original supplied files were left intact. Generated masters are retained in the task's generated-images directory.

### Hero prompt

Edit target: the supplied XoomAI campaign slide. Create a clean, text-free standalone website hero artwork from this exact image. Preserve the same cheerful sunglasses-wearing man walking to the RIGHT with his tropical travel bag, straw hat, cream linen shirt, navy trousers, white shoes, and the office clutter and purple/cyan cables pulling back on his torso. Keep the striking cutout studio photography / 3D composite look and white seamless studio backdrop. Remove ALL advertising headline, subheading, XoomAI logo, swipe label and arrow. Office object labels can be absent too. Recompose the entire scene within a tall 4:5 image so the full man including head and both shoes plus entire travel bag are visible, with tangled office clutter behind him on the left. Keep a little white space around the silhouette. No other people, no new logos, no new text, no UI. This will sit in the right half of a white website hero with live text separately on its left.

### Closing prompt

Edit this exact campaign artwork into one clean standalone website illustration. Preserve the same man reclining in a cyan deckchair, sunglasses, navy polo shirt with purple trims, tropical drink, cyan and purple travel bag, and the futuristic navy/purple/cyan automated conveyors with documents and laptops behind him. Remove the entire right hand advertising column, ALL text, logos and slide numbers. Recompose in a 4:5 portrait frame with the complete scene centred and the full relaxed man, chair and bag visible, on an almost white seamless studio background. Same realistic human mixed with polished 3D machinery style, soft studio light, elegant white negative space at the perimeter. No new people, no logos, no typography, no buttons or UI. Intended for closing section of the XoomAI Take A Week Off landing page.

## Verification

Run `npm run build` and `npx eslint src/app/takeaweekoff src/components/layout/chrome-gate.tsx`.

Browser verification should cover desktop and mobile rendering, narrow widths and enlarged text, FAQ keyboard controls, sticky CTA behaviour, image loading, allowlisted campaign parameters arriving in the booking page and scheduler, and the calendar's available dates. Do not make a real test booking or send synthetic conversions to the live Pixel. Actual booking confirmation and server-side CAPI delivery require a controlled production test.

Tracking verification on 24 September 2026: all 12 offline tests passed; production build and targeted ESLint passed. With `fbq` replaced by a local recorder, a hero CTA produced one `AuditBookingClick`, followed by the booking page's `PageView`; UTM values and `fbclid` survived navigation. Duplicate synthetic scheduler confirmations produced one Lead with the campaign audit name. Untrusted origins, a different message source, and unsuccessful bookings produced no Lead. No real booking or Meta conversion was submitted. Production webhook credentials remain a setup dependency, documented in `meta-conversions-api.md`.
