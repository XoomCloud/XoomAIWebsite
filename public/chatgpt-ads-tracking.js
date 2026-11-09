(function (w) {
  'use strict';
  // OpenAI (ChatGPT Ads) Measurement Pixel and lead attribution for /chatgpt (XOO-4487).
  // page_viewed on /chatgpt; lead_created only on a confirmed booking on /book after a /chatgpt submission.
  // Event names and data shapes: https://developers.openai.com/ads/supported-events
  if (w.__xoomChatgptTrackingInstalled) return;
  w.__xoomChatgptTrackingInstalled = true;
  var pixelId = 'QQn7hfys7mFiM6shQXYX7K';
  var formId = 'd5bbb02f-27ce-4869-8428-3f9268bfe5d5';
  var sourcePath = '/chatgpt';
  var bookingPath = '/book';
  // Set on a confirmed /chatgpt form submission; read on /book so the pixel lead only
  // fires for a booked Strategy Session from ChatGPT ad traffic (no lead on form submit).
  var markerKey = 'xoomai:chatgpt_ads_booking_pending';
  var markerTtlMs = 24 * 60 * 60 * 1000;
  var path = w.location.pathname.replace(/\/+$/, '') || '/';
  function readMarker() {
    try {
      var at = Number(w.localStorage.getItem(markerKey));
      if (at && Date.now() - at < markerTtlMs) return true;
      w.localStorage.removeItem(markerKey);
    } catch { /* storage unavailable */ }
    return false;
  }
  if (path === bookingPath) {
    if (!readMarker()) return;
  } else if (path !== sourcePath) {
    return;
  }
  // OpenAI's documented install snippet: queue stub plus async SDK in <head>.
  if (!w.oaiq) {
    var q = function () { q.q.push(arguments); };
    q.q = [];
    w.oaiq = q;
    var d = w.document, js = d.createElement('script');
    js.async = true;
    js.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
    (d.head || d.documentElement).appendChild(js);
  }
  var params;
  try { params = new URLSearchParams(w.location.search || ''); } catch { params = new URLSearchParams(''); }
  // Production runs with debug off; append ?oaiq_debug=1 to see SDK logs in the console.
  w.oaiq('init', { pixelId: pixelId, debug: params.get('oaiq_debug') === '1' });
  if (path === bookingPath) {
    installBookingLead();
    return;
  }
  w.oaiq('measure', 'page_viewed', {
    type: 'contents',
    contents: [{ id: 'chatgpt', name: 'ChatGPT Ads landing page', content_type: 'page' }]
  });
  function value(name) { var all = params.getAll(name); return all.length === 1 ? all[0] : ''; }
  // xoomai_campaign_source has no ChatGPT option yet, so this dedicated page records "other"
  // plus a fixed Marketing campaign name. utm_medium is copied verbatim.
  var attribution = {
    xoomai_campaign_source: 'other',
    xoomai_campaign_name: 'ChatGPT Ads',
    xoomai_utm_medium: value('utm_medium')
  };
  w.addEventListener('hs-form-event:on-ready', function (event) {
    if (!event.detail || event.detail.formId !== formId) return;
    try {
      var form = w.HubSpotFormsV4 && w.HubSpotFormsV4.getFormFromEvent(event);
      if (!form || typeof form.setFieldValue !== 'function') return;
      Object.keys(attribution).forEach(function (name) { form.setFieldValue('0-1/' + name, [attribution[name]]); });
    } catch { /* Attribution failure must not break the enquiry form. */ }
  });
  var sent = Object.create(null);
  w.addEventListener('hs-form-event:on-submission:success', function (event) {
    if (!event.detail || event.detail.formId !== formId) return;
    var instance = typeof event.detail.instanceId === 'string' ? event.detail.instanceId : 'form';
    if (sent[instance]) return;
    sent[instance] = true;
    // No OpenAI pixel event here: the lead is a confirmed booking on /book.
    try { w.localStorage.setItem(markerKey, String(Date.now())); } catch { /* storage unavailable */ }
    try {
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'generate_lead', {
          send_to: 'G-T3NZH8T5H7', event_id: 'hs_form_chatgpt_' + instance + '_' + Date.now(), transport_type: 'beacon',
          form_id: formId, source_page_path: sourcePath, conversion_type: 'hubspot_form_submission'
        });
      }
    } catch { /* GA4 failure is non-fatal. */ }
  });

  function isHubSpotOrigin(origin) {
    try {
      var url = new URL(origin);
      return url.protocol === 'https:' && /(^|\.)hubspot\.com$/i.test(url.hostname);
    } catch { return false; }
  }
  // Same completion signal as src/lib/booking-lead.ts isBookingConfirmed.
  function isBookingConfirmed(data) {
    if (!data || typeof data !== 'object') return false;
    return data.meetingBookSucceeded === true || data.eventName === 'meetingBookSucceeded' || data.event === 'meetingBookSucceeded';
  }
  function installBookingLead() {
    var fired = false;
    w.addEventListener('message', function (event) {
      if (fired || !isHubSpotOrigin(event.origin) || !isBookingConfirmed(event.data)) return;
      var frames = w.document.querySelectorAll('iframe');
      var fromScheduler = false;
      for (var i = 0; i < frames.length; i++) {
        if (frames[i].contentWindow === event.source && isHubSpotOrigin(frames[i].src)) { fromScheduler = true; break; }
      }
      if (!fromScheduler || !readMarker()) return;
      fired = true;
      try { w.localStorage.removeItem(markerKey); } catch { /* storage unavailable */ }
      var eventId = 'hs_booking_chatgpt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
      try { w.oaiq('measure', 'lead_created', { type: 'customer_action' }, { event_id: eventId }); } catch { /* Pixel failure is non-fatal. */ }
    });
  }
})(window);
