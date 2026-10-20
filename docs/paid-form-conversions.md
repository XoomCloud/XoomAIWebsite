# Paid landing form conversions

The paid landing page /youraiemployee uses HubSpot form d5bbb02f-27ce-4869-8428-3f9268bfe5d5 in portal 48826660.

The root layout loads public/hubspot-form-tracking.js before the embedded form. The listener uses HubSpot's documented hs-form-event:on-submission:success event and getConversionId() API. It accepts the configured form on /youraiemployee only. Page loads, button clicks and failed validation do not emit Lead.

A confirmed submission sends Meta Lead to Pixel 1643300670067276 and GA4 generate_lead to G-T3NZH8T5H7. Both carry form_id, source_page_path=/youraiemployee, conversion_type=hubspot_form_submission and the same event identity. No form field values are included in these event parameters.

The event identity is hs_form_ followed by HubSpot's submission conversion UUID. Session storage and an in-memory guard prevent repeated success messages, re-renders and reloads from sending the same event twice. Confirmed events waiting for Pixel initialization can resume after the booking-page redirect. Storage is bounded and pending entries expire after 24 hours.

HubSpot's native Conversion Events feature was unavailable for this form when this implementation was introduced. If another browser or server transport is enabled later, it must use the same event name and event ID for deduplication, or replace this transport. Do not independently emit another Lead for this form.

Completed meetings use the separate standard Meta Schedule event in both the browser booking tracker and authenticated meeting webhook. Their shared booking identity is unchanged. This separates form-submission Lead from meeting quality; the ad set and budget are unchanged by this implementation. Existing Outlook click proxies retain their booking_click_proxy parameter and are a different measurement path.

Provider reference: https://developers.hubspot.com/docs/api-reference/latest/marketing/forms/global-form-events
