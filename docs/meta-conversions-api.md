# Meta conversion tracking (Pixel + Conversions API)

Booking tracking fires the browser Pixel after a confirmed HubSpot booking.
Meta also operates a hosted web Conversions API connection for this dataset.
The repository contains an optional custom webhook path; its presence does not
mean it is configured in production.

## Verified account state — 13 October 2026

- Active dataset: **XoomLanding / 1643300670067276**.
- Events Manager shows **Meta-hosted web Conversions API connected**, opted in
  on 30 June 2026. Automatic website matching is on; automatic events are off.
- The custom `/api/hubspot/meeting-booked` endpoint returns 503 because its
  production secrets are not configured. This does **not** mean all CAPI is off.
- The CRM Conversions API setup remains incomplete. A booking signal does not
  establish attendance, qualification or a won sale.
- Lead source charts showed browser and Meta-hosted copies. These are receipt
  counts, not proven unique leads; the deduplication panel was still processing.
  Verify matching IDs before adding another server reporting path.
- Both `/book` and `/takeaweekoff/book` forward the six allowlisted UTM fields
  to the same Vlad Nielsen calendar, including their fallback links. Other query
  parameters are not forwarded. The calendar duration is **45 minutes**.
- The campaign ad editor had empty URL campaign tags at audit time. Website
  forwarding cannot reconstruct missing ad IDs. Add campaign/ad attribution in
  Ads Manager separately, without publishing unrelated saved drafts.

The configuration guidance below applies to the optional custom webhook. Do not
enable it alongside Meta-hosted reporting without checking end-to-end event IDs
and deduplication. No new CAPI token or CRM data sharing was enabled in this audit.

## The rule

`Lead` fires **only when a booking is completed and confirmed**. Never on page
load, never on a button click. `PageView` is unaffected. Campaign CTA clicks send
the separate custom event `AuditBookingClick` with campaign, placement and
destination (no email, phone or URL query). Use confirmed `Lead` for conversion
optimisation, not the CTA click event.

## Repository reporting paths

| Path | Trigger | File |
|---|---|---|
| **Browser Pixel** | HubSpot scheduler posts `meetingBookSucceeded` | `src/components/landing/booking-lead-tracker.tsx` |
| **Conversions API** (server) | HubSpot webhook hits our endpoint | `src/app/api/hubspot/meeting-booked/route.ts` |

The browser path is blocked for a meaningful share of users (ad blockers, Safari
ITP). A configured server path provides another reporting channel; credentials,
HubSpot workflow delivery and Meta acceptance must all work.

## Deduplication contract for the optional custom webhook

The repository's browser and webhook implementations derive the **same
`event_id`** when they receive the same booking identity. This is a code contract,
not proof of live deduplication or of the IDs used by Meta-hosted reporting.

The id comes from `bookingLeadEventId()` in `src/lib/booking-lead.ts`:

- **Primary key: attendee email + start time.** These are the two fields both the
  browser message and webhook must provide. The webhook rejects incomplete
  identities. Check these fields against a real scheduler confirmation.
- Values are normalised first, because the two sources format them differently:
  - email → trimmed + lower-cased
  - start time → **epoch milliseconds** (an ISO string from the browser and an
    epoch number from the webhook must reduce to the same value)
  - keys are matched shape-agnostically, so `hs_meeting_start_time`, `startTime`
    and `dateTime` all resolve to the same field
- Hashed with two FNV-1a passes → `lead_<16 hex chars>`. Deterministic and
  contains no raw email or appointment time (it is a pseudonymous identifier).

> Changing the derivation on one side without the other silently breaks
> deduplication and double-counts every booking. Keep it in `booking-lead.ts`.

## Environment variables

`.env*` is gitignored — set these in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Purpose |
|---|---|---|
| `META_CAPI_ACCESS_TOKEN` | yes (for CAPI) | Conversions API token. **Secret — never prefix with `NEXT_PUBLIC_`.** |
| `META_PIXEL_ID` | optional | Defaults to the browser's `NEXT_PUBLIC_META_PIXEL_ID`, then `1643300670067276`. Keep both channels on the same Pixel. |
| `HUBSPOT_WEBHOOK_SECRET` | one of these | Shared secret for HubSpot *workflow* webhooks. |
| `HUBSPOT_CLIENT_SECRET` | one of these | Private-app secret; validates HubSpot's `X-HubSpot-Signature-v3`. |
| `META_TEST_EVENT_CODE` | optional | Adds Meta's test event code to server requests for end-to-end verification. Remove after testing. |

**Auth is fail-closed:** with neither secret set, the endpoint returns `503` and
sends nothing. This stops anyone injecting fake conversions.

## Setup

1. **Meta token** — Events Manager → your Pixel → Settings → Conversions API →
   *Generate access token*. Store as `META_CAPI_ACCESS_TOKEN`.
2. **Secret** — invent a strong random string, store as `HUBSPOT_WEBHOOK_SECRET`.
3. **HubSpot workflow** — configure a workflow/webhook for newly confirmed
   meeting bookings (not contact updates, page views or cancellations):
   - Method: `POST`
   - URL: `https://xoomai.com.au/api/hubspot/meeting-booked`
   - Add either the header `x-webhook-secret: <your secret>`, or append
     `?secret=<your secret>` to the URL if headers aren't available.
   - Include the attendee **email** and the meeting **start time** in the payload.
     Include `booking_created_at` with the actual booking creation timestamp;
     if absent, webhook receipt time is used. The appointment start is only used
     for event identity, never as Meta's conversion timestamp.
   - For campaign bookings include `event_source_url` set to
     `https://xoomai.com.au/takeaweekoff/book`. Source must reflect the originating
     booking page; do not label every general-site booking as campaign traffic.
     Only the two first-party booking paths are accepted; queries are stripped.
   - Enable/verify failed-delivery retries. Repeated deliveries keep the same ID.
4. **Verify** — set `META_TEST_EVENT_CODE`, book a test meeting, and confirm in
   Events Manager → Test Events that you see **one** `Lead` with matching
   `event_id` from both Browser and Server. Also check PageView, AuditBookingClick,
   and that a cancelled booking produces no Lead. Remove the code when done.

Example campaign webhook payload (map the actual meeting properties; do not send
these placeholder values):

```json
{
  "email": "<attendee email>",
  "hs_meeting_start_time": "<appointment ISO time or epoch milliseconds>",
  "booking_created_at": "<actual booking creation ISO time or epoch milliseconds>",
  "event_source_url": "https://xoomai.com.au/takeaweekoff/book"
}
```

Store secrets only in Vercel/HubSpot, never in source control or public browser
variables. Configure the intended deployment environment and redeploy after
changes. A protected Vercel preview also needs authenticated webhook access;
the public production endpoint is the normal delivery destination.

## Responses

| Status | Meaning |
|---|---|
| `200` | Meta accepted every event (`events_received: 1` per request). This does not prove attribution. |
| `400` | Invalid JSON or booking object shape. |
| `401` | Missing/incorrect secret (or bad signature). |
| `422` | Incomplete booking identity or invalid/future/over-seven-day-old conversion time. |
| `503` | Missing configuration or Meta delivery failure; retry with the same booking identity. |

Failures are logged with a `[meta-capi]` prefix, without payloads or tokens.
Successful events in a partially failed batch retain their IDs on retry.

## Current setup status (24 September 2026)

The production endpoint returned `503 Webhook not configured` during a safe,
unauthenticated configuration check. Its HubSpot authentication secret is missing.
The CAPI token and HubSpot workflow could not be verified with the connected tools.
Code changes alone do not enable server tracking: complete the setup above before
the campaign's end-to-end test. Browser Pixel ID `1643300670067276` was observed in
the campaign preview; receipt and attribution in Events Manager remain unverified.

## Offline verification

Run `npx --yes tsx --test tests/meta-tracking.test.ts`. All outbound Meta requests
are mocked. Tests cover timestamps, auth, hashing, source URLs, matching event IDs,
retry responses, incomplete identities, and queued custom CTA events.
