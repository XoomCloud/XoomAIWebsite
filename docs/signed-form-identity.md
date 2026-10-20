# XOO-323 signed form identity, draft for review

This draft replaces browser provider-UUID tracking with a company-issued UUID for both browser and server. It does not send Meta from either endpoint, provision infrastructure, alter HubSpot configuration or deploy. Base: production commit 5ac528ca89dc937621b09967f3f88485ab8be2a5. PR 31's direct-CAPI handler is not part of this change.

## Trust boundary

`POST /api/hubspot/identity/issue` creates an HMAC claim for the fixed form and canonical landing URL. The signed identity has a fixed seven-day form-session validity window anchored to its original creation time. Its 15-minute refresh deadline is advisory; renewal never extends that hard validity window. It contains a random event UUID and a separate random nonce, with no email. It accepts browser requests only from the two company HTTPS origins. Origin checking limits browser cross-origin use; it is not proof of a submission.

The browser uses the supported HubSpot form instance API on ready to populate dedicated hidden fields, then checks their values. It renews the signed token two minutes before expiry and on focus/visibility return, preserving the same event UUID and nonce. Transient renewal failures retry after five seconds without substituting another identity. A suspended tab can renew an expired lease for the same identity within the seven-day form-session bound. It records the company UUID only after `hs-form-event:on-submission:success`. It never substitutes a provider UUID when preparation fails. Browser duplicate callbacks and destination reloads retain the same ID. The v2 session queue does not replay pending provider-ID events from the old scheme.

`POST /api/hubspot/identity/verify` requires a separate Make-only Bearer credential. A public browser token is insufficient to redeem a nonce. Systems must call this endpoint only using fields from an authenticated HubSpot submission, not a public browser callback. It validates the HMAC, UUID version and variant, exact form and source, timestamps, identity match and email presence. The signed identity must have been valid at the authenticated HubSpot submission timestamp, within its fixed seven-day form session. The earlier token captured by HubSpot remains acceptable when submission races asynchronous renewal, including after its advisory 15-minute deadline. Delivery and retries are bounded to seven days after the authenticated submission timestamp. The token does not independently prove submission or email ownership; authenticated HubSpot delivery plus the restricted verifier credential establish the submission boundary.

A shared Redis-compatible REST service atomically binds each nonce to a SHA-256 digest of the event ID, form, exact source, normalized authenticated submission timestamp and normalized email. `SET key hash NX EX ttl` creates the binding. On an existing key, `GET` must match the digest before verification returns the same normalized identity. Different emails, timestamps or identities cannot reuse it. No email is stored in Redis, only its composite binding digest. Retention covers the seven-day Meta event-age window plus a small cleanup margin and is never extended by retries.

There is no process-memory fallback. Configure a persistent non-evicting database with namespace access limited to `xoomai:hubspot:binding:*`, allowing GET and conditional SET with expiry. Storage errors fail closed. Store loss or early eviction invalidates reuse protection, so production must not enable delivery without this control. Verification is idempotent for the same authenticated submission; it no longer irreversibly consumes the nonce before Meta delivery.

## Required owner-managed configuration

All values are server-only Vercel configuration supplied through approved company grants, never workspace files or public build variables:

- `HUBSPOT_IDENTITY_SIGNING_KEY`: at least 32 random bytes, retained only by the website.
- `HUBSPOT_IDENTITY_VERIFIER_KEY`: a different secret with at least 32 random bytes, shared only with the trusted Make HTTP module.
- `HUBSPOT_IDENTITY_REDIS_URL` and `HUBSPOT_IDENTITY_REDIS_TOKEN`: HTTPS REST endpoint and least-privilege credential for an approved persistent nonce store.

The REST adapter is compatible with the documented Upstash command-in-body format. No database/account was created or selected by this draft. Systems must provide an approved storage connection or review an alternative persistent atomic adapter before deployment. Do not use a disposable test database or unauthorised operator credentials.

## HubSpot schema, Systems ownership

Add and verify these contact text properties on the exact form as hidden fields, without returning-visitor prefills:

| Form field API name | Purpose |
| --- | --- |
| `0-1/xoom_tracking_uuid` | Company-issued canonical UUID |
| `0-1/xoom_tracking_token` | Signed short-lived token |
| `0-1/xoom_tracking_source_url` | Exact canonical landing URL |

The browser uses string arrays for hidden field values, as specified by the HubSpot instance API, and reads them back before marking the identity ready. No hidden fields have been added by this draft. Until the schema and issue service are available, this draft emits no form conversion, while the enquiry itself remains usable. Publishing before setup would suppress current form tracking. Renewal keeps normal long sessions tracked beyond the original 15 minutes. A prepared identity still tracks a successful submission if renewal is pending or temporarily unavailable within the fixed supported session. Success is stored before immediate navigation and does not depend on renewal completion. A completed renewal cannot modify form fields after success. If initial identity preparation is unavailable, or a tab stays open beyond the fixed seven-day session, tracking fails closed and emits the non-personal xoomFormIdentityUnavailable browser event. Systems must connect that signal to approved operational monitoring before rollout. The website does not claim a successful conversion in this exceptional failure path.

The dedicated source field avoids relying on the legacy trigger's observed incorrect `pageUrl`. Systems must map `fields.xoom_tracking_source_url` into `sourceUrl`, require it equals the signed claim and /youraiemployee, and use the verifier's normalized source as the eventual event URL. A 36-character hidden value alone is not trusted proof.

## Make request and result

After authenticated confirmed submission, send:

```json
{
  "token": "<fields.xoom_tracking_token>",
  "eventUuid": "<fields.xoom_tracking_uuid>",
  "formId": "d5bbb02f-27ce-4869-8428-3f9268bfe5d5",
  "sourceUrl": "<fields.xoom_tracking_source_url>",
  "submittedAt": "<authenticated HubSpot submission ISO time>",
  "email": "<authenticated HubSpot submission email>"
}
```

Use the Make-only Bearer credential in its approved secret connection. Treat any non-200 response as a stop, never as success. A 200 response contains only `verified`, `eventUuid`, `eventId`, `formId`, `sourceUrl` and normalized `submittedAt`, without token, signature, nonce, email or signing key. Send Meta only when `verified === true`, using those normalized fields and the authenticated submission email. Keep scenario 6710735 inactive and on demand while configuring this route.

An identical authenticated retry returns 200 with the same normalized identity, even after the original token lease expires. The fixed form-session window and the separate post-submission retry window are explicit limits, not claims of indefinite validity. The verifier does not mark an event as delivered, so a Make/Meta failure after verification can retry without losing its identity. Mismatched reuse returns 422. Invalid data also returns 422, auth failure 401, oversized input 413 and dependency failures 503. Make must preserve event ID and original timestamp on every retry, never regenerate them, and retain the native Meta processing receipt before considering delivery complete. This provides retry-safe verification and at-least-once delivery eligibility, not proof of exactly-once Meta receipt. The deployment review must define bounded Make retries and failure escalation; no retry or schedule is activated by this code.

## Review and rollback

Run `npm ci --ignore-scripts`, then `npm run test:tracking`. The committed exact tsx dependency and lockfile make TypeScript imports reproducible. Tests cover tamper, expiration, bad UUID version/variant, form/source/identity mismatch, submission-time mismatch, unauthenticated redemption, idempotent concurrent verification, downstream-failure retries after lease expiry, mismatched nonce reuse, Redis failures, long form sessions, suspended-tab renewal, transient renewal failures, a deterministically held renewal that races success and redirect, verification of the original token captured before renewal, browser preparation failures, duplicate callbacks, readiness, redirects and legacy-queue isolation. Tests use synthetic credentials and mocked providers only.

Before publication, Systems must supply the storage/secret grants and hidden form schema, review the seven-day supported form-session policy, expiry monitoring and bounded retries, and finish the Make verifier mapping. Then inspect a newly authorized real authenticated submission bundle and identical browser/server IDs, followed by individual Meta processed and deduplication evidence. Earlier test authorizations are consumed; this implementation does not authorize another test.

Rollback before activation: retain production commit 5ac528c, keep Make inactive, and do not provision secrets. If eventually deployed, disable Make first and revert the website listener/endpoints together to the reviewed previous commit. Do not remove nonce records during the token lifetime. No Paperclip service restart is involved.

Sources: [HubSpot global form events and instance methods](https://developers.hubspot.com/docs/api-reference/latest/marketing/forms/global-form-events), [Upstash REST commands](https://upstash.com/docs/redis/features/restapi). Local Next.js route-handler and environment-variable guides were read for Next 16.2.7.
