# Meta conversion tracking (Pixel + Conversions API)

How a booking becomes exactly one Meta `Lead` — counted once, even though it's
reported twice (once from the browser, once from our server).

## The rule

`Lead` fires **only when a booking is completed and confirmed**. Never on page
load, never on a button click. `PageView` is unaffected.

## The two reporting paths

| Path | Trigger | File |
|---|---|---|
| **Browser Pixel** | HubSpot scheduler posts `meetingBookSucceeded` | `src/components/landing/booking-lead-tracker.tsx` |
| **Conversions API** (server) | HubSpot webhook hits our endpoint | `src/app/api/hubspot/meeting-booked/route.ts` |

The browser path is blocked for a meaningful share of users (ad blockers, Safari
ITP). The server path always lands. Running both recovers those conversions.

## Why they don't double-count

Both paths derive the **same `event_id`** for a booking, and Meta deduplicates
events that share an `event_id` + event name.

The id comes from `bookingLeadEventId()` in `src/lib/booking-lead.ts`:

- **Primary key: attendee email + start time.** These are the two fields both the
  browser message and the webhook reliably contain.
- Values are normalised first, because the two sources format them differently:
  - email → trimmed + lower-cased
  - start time → **epoch milliseconds** (an ISO string from the browser and an
    epoch number from the webhook must reduce to the same value)
  - keys are matched shape-agnostically, so `hs_meeting_start_time`, `startTime`
    and `dateTime` all resolve to the same field
- Hashed with two FNV-1a passes → `lead_<16 hex chars>`. Deterministic and
  contains **no PII**.

> Changing the derivation on one side without the other silently breaks
> deduplication and double-counts every booking. Keep it in `booking-lead.ts`.

## Environment variables

`.env*` is gitignored — set these in Vercel → Project → Settings → Environment Variables.

| Variable | Required | Purpose |
|---|---|---|
| `META_CAPI_ACCESS_TOKEN` | yes (for CAPI) | Conversions API token. **Secret — never prefix with `NEXT_PUBLIC_`.** |
| `META_PIXEL_ID` | optional | Defaults to `NEXT_PUBLIC_META_PIXEL_ID`. |
| `HUBSPOT_WEBHOOK_SECRET` | one of these | Shared secret for HubSpot *workflow* webhooks. |
| `HUBSPOT_CLIENT_SECRET` | one of these | Private-app secret; validates HubSpot's `X-HubSpot-Signature-v3`. |
| `META_TEST_EVENT_CODE` | optional | Routes events to Meta's **Test Events** tool instead of live reporting. |

**Auth is fail-closed:** with neither secret set, the endpoint returns `503` and
sends nothing. This stops anyone injecting fake conversions.

## Setup

1. **Meta token** — Events Manager → your Pixel → Settings → Conversions API →
   *Generate access token*. Store as `META_CAPI_ACCESS_TOKEN`.
2. **Secret** — invent a strong random string, store as `HUBSPOT_WEBHOOK_SECRET`.
3. **HubSpot workflow** — create a workflow triggered on *Meeting booked*, add a
   **Send webhook** action:
   - Method: `POST`
   - URL: `https://xoomai.com.au/api/hubspot/meeting-booked`
   - Add either the header `x-webhook-secret: <your secret>`, or append
     `?secret=<your secret>` to the URL if headers aren't available.
   - Include the attendee **email** and the meeting **start time** in the payload —
     without an email the event is skipped (it can't be attributed).
4. **Verify** — set `META_TEST_EVENT_CODE`, book a test meeting, and confirm in
   Events Manager → Test Events that you see **one** `Lead` with matching
   `event_id` from both Browser and Server. Remove the code when done.

## Responses

| Status | Meaning |
|---|---|
| `200` | Accepted. Body lists each booking's `eventId` and whether it was `sent`. |
| `400` | Body wasn't valid JSON. |
| `401` | Missing/incorrect secret (or bad signature). |
| `503` | No webhook secret configured — endpoint disabled. |

`200` is returned even if the Meta call fails, so HubSpot doesn't retry forever;
failures are logged with a `[meta-capi]` prefix.
