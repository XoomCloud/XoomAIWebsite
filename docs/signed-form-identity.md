# XOO-323 signed form identity, draft for review

This draft replaces browser provider-UUID tracking with a company-issued UUID for both browser and server. It does not send Meta from either endpoint, provision infrastructure, alter HubSpot configuration or deploy. Base: production commit 5ac528ca89dc937621b09967f3f88485ab8be2a5. PR 31's direct-CAPI handler is not part of this change.

## Trust boundary

`POST /api/hubspot/identity/issue` creates a 15-minute HMAC claim for the fixed form and canonical landing URL. It contains a random event UUID and a separate random nonce, with no email. It accepts browser requests only from the two company HTTPS origins. Origin checking limits browser cross-origin use; it is not proof of a submission.

The browser uses the supported HubSpot form instance API on ready to populate dedicated hidden fields, then checks their values. It records the company UUID only after `hs-form-event:on-submission:success`. It never substitutes a provider UUID when preparation fails. Browser duplicate callbacks and destination reloads retain the same ID. The v2 session queue does not replay pending provider-ID events from the old scheme.

`POST /api/hubspot/identity/verify` requires a separate Make-only Bearer credential. A public browser token is insufficient to redeem a nonce. Systems must call this endpoint only using fields from an authenticated HubSpot submission, not a public browser callback. It validates the HMAC, UUID version and variant, exact form and source, timestamps, expiry, identity match and email presence. The token does not independently prove submission or email ownership; authenticated HubSpot delivery plus the restricted verifier credential establish the submission boundary.

Nonce consumption uses a shared Redis-compatible REST service with atomic `SET key value NX EX ttl`. There is no process-memory fallback. Missing configuration or store failure prevents verification. Configure a durable, non-evicting production database with write ACL limited to the `xoomai:hubspot:used:*` prefix and expiry commands. Store loss or early eviction invalidates the one-time guarantee; do not enable production without this control.

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

The browser uses string arrays for hidden field values, as specified by the HubSpot instance API, and reads them back before marking the identity ready. No hidden fields have been added by this draft. Until the schema and issue service are available, this draft emits no form conversion, while the enquiry itself remains usable. Publishing before setup would suppress current form tracking. Long form sessions beyond 15 minutes also fail closed; decide the desired expiry/refresh behaviour before rollout.

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

Nonce reuse returns 422, including a retry after successful verification. Invalid data also returns 422, auth failure 401, oversized input 413 and dependency failures 503. This is an at-most-once verification gate, not an exactly-once delivery/outbox protocol. A failure between verification and Meta can lose that delivery. Do not blindly retry or reset consumed nonces; retain execution evidence and review recovery. Production reliability or automated retries require a separately reviewed durable outbox design.

## Review and rollback

Tests cover tamper, expiration, bad UUID version/variant, form/source/identity mismatch, submission-time mismatch, unauthenticated redemption, concurrent nonce reuse, Redis failures, browser preparation failures, duplicate callbacks, readiness, redirects and legacy-queue isolation. Tests use synthetic credentials and mocked providers only.

Before publication, Systems must supply the storage/secret grants and hidden form schema, review expiry and at-most-once recovery, and finish the Make verifier mapping. Then inspect a newly authorized real authenticated submission bundle and identical browser/server IDs, followed by individual Meta processed and deduplication evidence. Earlier test authorizations are consumed; this implementation does not authorize another test.

Rollback before activation: retain production commit 5ac528c, keep Make inactive, and do not provision secrets. If eventually deployed, disable Make first and revert the website listener/endpoints together to the reviewed previous commit. Do not remove nonce records during the token lifetime. No Paperclip service restart is involved.

Sources: [HubSpot global form events and instance methods](https://developers.hubspot.com/docs/api-reference/latest/marketing/forms/global-form-events), [Upstash REST commands](https://upstash.com/docs/redis/features/restapi). Local Next.js route-handler and environment-variable guides were read for Next 16.2.7.
