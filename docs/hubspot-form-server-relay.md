# Confirmed HubSpot form server relay

This change provides an authenticated server delivery endpoint for /youraiemployee form conversions. It is not an automatic integration until a trusted submission producer and production credentials have been configured.

## Endpoint contract

POST /api/hubspot/form-submitted with JSON and the x-webhook-secret header. The header must match HUBSPOT_FORM_WEBHOOK_SECRET. Store this secret only in approved server-side credential configuration. The endpoint rejects all requests while unconfigured, and browser code must never receive the secret.

The trusted producer must verify a successful submission of form d5bbb02f-27ce-4869-8428-3f9268bfe5d5 in HubSpot portal 48826660. It then supplies these fields:

- formId: the exact form UUID above
- submissionId: the actual HubSpot conversion UUID
- submittedAt: the actual submission time as an ISO timestamp, within the last seven days
- email: the submitted contact email

Do not connect this endpoint to button clicks, arbitrary browser requests, page loads or contact creation without verifying the target form submission. The endpoint trusts its authenticated producer to establish that business fact.

The server sends a Lead to the configured Meta Pixel using META_CAPI_ACCESS_TOKEN and the existing pixel configuration. The identifier is hs_form_ followed by the normalized submission UUID, matching the browser. Event time is preserved on retries, contact email is hashed before sending to Meta, and source URL is fixed to https://xoomai.com.au/youraiemployee. Completed meetings continue to use Schedule.

A successful HTTP response contains ok=true, events_received=1, the eventId and Meta's traceId when returned. An upstream HTTP 200 with zero accepted events is a failure. Transient configuration/network/API failures return 503 for retry with the same identity. Meta event-name and event-ID deduplication reconciles repeated deliveries and the browser copy.

## Deployment prerequisites

Management must provision a service-scoped server delivery grant through the approved Connections process, arrange the corresponding server configuration in Vercel, and configure a trusted HubSpot submission producer or managed relay. The currently installed employee MCP connection can deliver a diagnostic event, but that does not configure the website's runtime. Do not extract an employee token or copy operator credentials to the site.

Required production configuration: HUBSPOT_FORM_WEBHOOK_SECRET and META_CAPI_ACCESS_TOKEN, restricted to the server. The exact producer, entitlement and credential binding must be verified before enabling automatic traffic. Existing meeting webhook configuration does not prove the form producer is connected.

## Acceptance

Verify unauthenticated requests fail. Deliver one real confirmed submission through the trusted producer, preserve its browser/server event ID, and retain the JSON receipt and Meta trace ID. Verify the same event in Meta Events Manager Test Events and inspect deduplication. A browser tracking-pixel HTTP 200 or an unchanged Overview aggregate alone is not an individual processed-event receipt. Do not create another QA form entry before this path is configured. Ads and budgets do not need changes for this setup.
