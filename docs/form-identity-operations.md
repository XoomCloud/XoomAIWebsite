# XOO-427 operational consumer and returning visitors

This is an undeployed review candidate. Current main 9fb6772489fc2661133901b6b13c34f13b02bf10 is retained, including Fieldy. The unchanged signed identity prerequisite is taken from reviewed PR32 head 5a862dafd9bcefe59fa94ea78bbacd9f2708a02c as a local patch, with no branch merge or publication. The separate corrective commit adds only this consumer, tests and documentation. Extra campaign mappings, booking attribution and expenses are excluded.

## Wire contract and data boundary

The browser consumes `xoomFormIdentityUnavailable` itself. It sends `POST /api/telemetry/form-identity`, independent of GA4, Meta, Make and the identity signing/storage configuration. The exact JSON is:

```json
{"event":"identity_unavailable","form":"enquiry","source":"/youraiemployee"}
```

`enquiry` is a fixed alias for the single form d5bbb02f-27ce-4869-8428-3f9268bfe5d5. No form UUID or visitor UUID is transmitted or logged by telemetry. All three values and the exact key set are validated; extra properties are rejected, not echoed. Body reads are bounded to 256 bytes even without an honest Content-Length. Query strings, non-JSON content and origins other than the two canonical company HTTPS origins are rejected. Responses have no-store. No request values or error objects go into application logs.

Browser requests omit cookies/credentials and referrers, use keepalive, and carry no email, token, visitor ID, full URL or headers from the original request. A sessionStorage budget contains only a timestamp and count, with at most one report per five minutes and three per tab session, shared across reloads. If storage is blocked the limit applies per page load. Report transport is best effort, with no telemetry retry loop. Browsers can block the first-party endpoint too; no claim of guaranteed delivery is made.

Server logs are capped at twelve accepted reports per UTC minute per warm function instance, plus at most one health log per minute per instance. Concurrent reads recheck the limit after validation. This intentionally does not keep IPs, cookies or visitor identifiers, so it is not a global per-visitor or distributed abuse limiter. Cold starts and multiple instances reset or multiply the cap. Origin is not authentication; fabricated reports are possible. Systems should evaluate existing Vercel firewall controls before release if a deployment-wide abuse bound is required; this patch configures none. Counts are accepted, sampled operational reports, never exact failed submissions or conversions.

## Stable log query and five-minute monitor proposal

Application log lines are JSON with this exact contract:

```json
{"marker":"XOOM_FORM_IDENTITY_OPS_V1","event":"form_identity_status","form":"enquiry","source":"/youraiemployee","time":"2026-10-22T00:00:00.000Z","service_status":"identity_unavailable","failure_count":1}
```

The independent `GET /api/telemetry/form-identity` probe returns service `form_identity_telemetry`, status `ready`, version `1` with no-store. It emits the same marker with `service_status=consumer_ready` and `failure_count=0`. This establishes consumer availability only. It does not attest signing, storage, Make, analytics or successful browser delivery.

In the existing Vercel project Runtime Logs, select Production, deployed candidate revision, route `/api/telemetry/form-identity`, and search text `XOOM_FORM_IDENTITY_OPS_V1`. Parse the application JSON and require exact marker, event, form and source before counting. Do not use platform RequestId or raw request details as report data. For each closed five-minute UTC interval, sum `failure_count` for `identity_unavailable` records and retain the earliest/latest application `time`. Alert on any count greater than zero, separately report missing health or non-200 probe results. A quiet failure interval is not proof of identity health.

Systems owns wiring the existing scheduled metadata monitor after review. Suggested polling every five minutes: perform the non-converting GET probe, read logs for the previous ten minutes, retain a UTC high-water mark and finalize only closed five-minute intervals. Overlap is for delayed logs; do not recount finalized windows. Preserve identical lines as distinct reports, since reports have no unique IDs. Page through all results and flag truncation, access errors, expired windows and monitor gaps as incomplete coverage. Do not silently turn a retrieval failure into zero failures. Keep only interval counts, first/last failure times, consumer probe status and coverage status in the monitor output. Link restricted Vercel evidence rather than copying request details.

This implementation has no telemetry database or indefinite storage. Vercel captures stdout in runtime logs independent of function lifetime, bounded by the account plan. The official [runtime log limits](https://vercel.com/docs/logs/runtime), checked 22 October 2026, specify Hobby one hour, Pro one day, Enterprise three days, and Observability Plus thirty days. The actual company plan and effective retention must be verified by Systems before release. Use one hour as the conservative maximum recovery lookback until verified. A five-minute monitor cannot recover data already expired or truncated. No drain, paid retention feature or new recurring schedule is installed here. Proposal: retain sanitized interval summaries for thirty days only if Systems approves and implements that policy. Application raw logs inherit Vercel retention; the patch cannot shorten provider-managed metadata retention.

Vercel independently records invocation metadata, potentially including request path/query and headers. The application never writes those values, and the browser uses a clean path and no referrer. The route rejects queries, but application code cannot prevent the platform from recording a malicious request's URL before invocation. Systems must inspect platform metadata access/redaction settings; do not describe this patch as a guarantee against provider-managed request metadata collection.

## Returning-visitor safeguards

Ready preparation overwrites all three hidden fields and reads them back against the newly issued identity. On provider-confirmed success, renewal is frozen, duplicate callbacks are excluded, and all three fields are read again against the prepared UUID, signed token and canonical source. Changed or unreadable fields fail closed with operational telemetry and no conversion queue insertion. A held renewal cannot rewrite fields after success starts. Existing original-token validity during the seven-day supported form session is retained.

Tests seed stale values before ready, replace each field after ready, fail success-time reads and hold duplicate success/renewal races. These are deterministic local safeguards, not proof of a published HubSpot prefill setting. Systems continues read-only published render inspection. No owner form edit is requested without an actual unsafe setting. Fail-closed browser tracking cannot undo a provider submission or prove which values HubSpot captured; the confidential Make verifier must still reject stale/mismatched signed identities. Make configuration is unchanged and no execution occurs here.

## Review and release gates

1. Systems reviews the exact candidate revision and corrective diff, confirms current main is still compatible, finishes read-only form setting inspection, confirms binding-store durability/non-eviction and verifier credential agreement without exposing values, and accepts the log query/limits. Existing confidential Make processing remains unchanged.
2. Systems wires and verifies the five-minute metadata monitor under its existing authority. Live consumer output, effective Vercel retention, pagination/truncation handling and alerts require deployment-specific evidence. Local log tests are not production proof.
3. Obtain fresh formal release approval naming the exact reviewed candidate, current main, resulting release revision, Vercel project and bounded deployment/readiness actions. No remote push is performed here because it could trigger a preview deployment. The shared local Git bundle and patches are the review transport.
4. Any live form submission, Make run, conversion or replay needs its own matching, unconsumed authorization. Prior approvals do not cover the new candidate. Recurring relay activation remains gated by processed receipt, deduplication, recovery and monitor evidence. This task authorizes none of those actions.

Rollback proposal for approval: disable the relay first if later activated, revert only the reviewed release changes while preserving Fieldy and subsequent main work, and retain nonce bindings through their required validity window. No Paperclip service change is involved.

## Local verification

`npm ci --ignore-scripts` completed from the committed lockfile. `npm run test:tracking` passes 71/71 synthetic local tests, including seven new telemetry tests and seven new browser safeguards. Targeted ESLint passes with zero warnings or errors and `git diff --check` passes. `npm run build` completes the Next.js production build with both identity routes, the telemetry route and `/fieldy` present. Initial build attempts using shared dependency symlinks were rejected by Turbopack; verification succeeded after installing isolated dependencies. No shared dependency tree was edited.

Success-time read-back is asynchronous. Local tests cover navigation during held renewal and duplicate callbacks, but cannot establish real provider redirect timing. Release validation must verify that the published provider leaves the form instance readable through success-time read-back; failure remains closed. There is no new production receipt, prefill-policy, telemetry persistence or monitor delivery proof from these local tests.
