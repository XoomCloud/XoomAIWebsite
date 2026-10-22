(function (w) {
  'use strict';
  if (w.__xoomHubSpotFormTrackingInstalled) return;
  w.__xoomHubSpotFormTrackingInstalled = true;
  var formId = 'd5bbb02f-27ce-4869-8428-3f9268bfe5d5';
  var sourcePath = '/youraiemployee';
  var key = 'xoomai:hubspot-form-conversions:v2';
  var state = { sentMeta: [], sentGa: [], pending: [] };
  var sources = Object.create(null);
  var identities = Object.create(null);
  var uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  var sourceUrl = 'https://xoomai.com.au' + sourcePath;
  var fields = { id: '0-1/xoom_tracking_uuid', token: '0-1/xoom_tracking_token', source: '0-1/xoom_tracking_source_url' };
  // Capture only this navigation. Never recover campaign values from prior visits.
  var attribution = captureAttribution();
  function captureAttribution() {
    var result = {
      xoomai_utm_medium: '', xoomai_campaign_name: '', xoomai_campaign_id: '',
      xoomai_utm_term_adset_id: '', xoomai_utm_content_ad_id: '',
      xoomai_meta_fbc: '', xoomai_campaign_source: ''
    };
    try {
      var params = new URLSearchParams(w.location.search || '');
      function value(name) { var all = params.getAll(name); return all.length === 1 ? all[0] : ''; }
      var source = value('utm_source').toLowerCase();
      var medium = value('utm_medium');
      var meta = ['facebook', 'instagram', 'fb', 'ig'].includes(source)
        && ['paid', 'cpc', 'paid_social'].includes(medium.toLowerCase());
      result.xoomai_utm_medium = medium;
      // Campaign names are supplied by Marketing's ID-to-name table, never a URL.
      result.xoomai_utm_term_adset_id = value('utm_term');
      result.xoomai_utm_content_ad_id = value('utm_content');
      result.xoomai_campaign_source = value('gclid') || (source === 'google' && medium.toLowerCase() === 'cpc')
        ? 'google_paid' : meta ? 'meta_paid' : '';
      // Marketing's canonical Meta ID is utm_id, with numeric utm_campaign fallback.
      var campaign = params.has('utm_id') ? value('utm_id') : value('utm_campaign');
      if (result.xoomai_campaign_source === 'meta_paid' && /^[0-9]+$/.test(campaign)) result.xoomai_campaign_id = campaign;
      var landedAt = w.performance && Number.isFinite(w.performance.timeOrigin) ? Math.floor(w.performance.timeOrigin) : Date.now();
      var click = value('fbclid');
      var cookies = ((w.document && w.document.cookie) || '').split(';').map(function (part) { return part.trim(); })
        .filter(function (part) { return part.startsWith('_fbc='); });
      var cookie = cookies.length === 1 ? cookies[0].slice(5) : '';
      var match = /^fb\.1\.([0-9]+)\.([^\s;]+)$/.exec(cookie);
      // A cookie from an earlier navigation is not evidence of this visit.
      if (match && Number(match[1]) >= landedAt && Number(match[1]) <= Date.now() && (!click || match[2] === click)) {
        result.xoomai_meta_fbc = cookie;
      } else if (click && !/[\s;]/.test(click)) {
        result.xoomai_meta_fbc = 'fb.1.' + landedAt + '.' + click;
      }
    } catch { /* Missing current-visit evidence leaves attribution blank. */ }
    return result;
  }
  async function prepareAttribution(form, current) {
    var complete = true;
    try {
      for (var name of Object.keys(attribution)) {
        var field = '0-1/' + name;
        if (!current.some(function (item) { return item.name === field; })) { complete = false; continue; }
        // Explicit blanks clear provider prefills; no historical attribution is used.
        form.setFieldValue(field, [attribution[name]]);
        if (scalar(await form.getFieldValue(field)) !== attribution[name]) complete = false;
      }
    } catch { complete = false; }
    if (!complete) attributionUnavailable();
  }
  function attributionUnavailable() {
    if (typeof w.CustomEvent === 'function' && typeof w.dispatchEvent === 'function') {
      w.dispatchEvent(new w.CustomEvent('xoomFormAttributionUnavailable', { detail: { formId: formId, source_page_path: sourcePath } }));
    }
  }
  async function checkAttribution(form) {
    try {
      for (var name of Object.keys(attribution)) {
        if (scalar(await form.getFieldValue('0-1/' + name)) !== attribution[name]) { attributionUnavailable(); return; }
      }
    } catch { attributionUnavailable(); }
  }
  var allowGaHere = false;
  try {
    var saved = JSON.parse(w.sessionStorage.getItem(key));
    if (saved && Array.isArray(saved.sentMeta) && Array.isArray(saved.sentGa) && Array.isArray(saved.pending)) state = saved;
  } catch { /* In-memory duplicate protection remains available. */ }
  function save() {
    state.sentMeta = state.sentMeta.slice(-50);
    state.sentGa = state.sentGa.slice(-50);
    state.pending = state.pending.slice(-50);
    try { w.sessionStorage.setItem(key, JSON.stringify(state)); } catch { /* Storage may be disabled. */ }
  }
  function flush() {
    state.pending = state.pending.filter(function (entry) {
      if (!entry || typeof entry.id !== 'string' || !entry.id.startsWith('hs_form_') || !uuid.test(entry.id.slice(8)) || entry.path !== sourcePath || !Number.isFinite(entry.at) || Date.now() - entry.at > 86400000 || entry.at > Date.now()) return false;
      var params = { form_id: formId, source_page_path: entry.path, conversion_type: 'hubspot_form_submission' };
      if (w.__xoomGaReady && (w.location.pathname !== sourcePath || allowGaHere) && !state.sentGa.includes(entry.id)) {
        w.dataLayer = w.dataLayer || [];
        w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
        w.gtag('event', 'generate_lead', Object.assign({ send_to: 'G-T3NZH8T5H7', event_id: entry.id, transport_type: 'beacon' }, params));
        state.sentGa.push(entry.id);
      }
      if (typeof w.fbq === 'function' && !state.sentMeta.includes(entry.id)) {
        w.fbq('trackSingle', '1643300670067276', 'Lead', params, { eventID: entry.id });
        state.sentMeta.push(entry.id);
      }
      return !state.sentMeta.includes(entry.id) || !state.sentGa.includes(entry.id);
    });
    save();
  }
  function scalar(value) { return Array.isArray(value) && value.length === 1 ? value[0] : value; }
  // Operational delivery has no dependency on either conversion provider.
  function installFailureConsumer(browserEvent, reportEvent, reportKey) {
  var reportBudget = { at: 0, count: 0 };
  try {
    var previous = JSON.parse(w.sessionStorage.getItem(reportKey));
    if (previous && Number.isFinite(previous.at) && previous.at <= Date.now() && previous.at >= 0
      && Number.isInteger(previous.count) && previous.count >= 0 && previous.count <= 3) reportBudget = previous;
  } catch { /* Per-page limits still apply without storage. */ }
  w.addEventListener(browserEvent, function (event) {
    if (!event.detail || event.detail.formId !== formId || event.detail.source_page_path !== sourcePath) return;
    if (reportBudget.count >= 3 || (reportBudget.count && Date.now() - reportBudget.at < 300000)) return;
    reportBudget = { at: Date.now(), count: reportBudget.count + 1 };
    try { w.sessionStorage.setItem(reportKey, JSON.stringify(reportBudget)); } catch { /* No identifiers are persisted. */ }
    try {
      var delivery = w.fetch('/api/telemetry/form-identity', {
        method: 'POST', credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: reportEvent, form: 'enquiry', source: sourcePath })
      });
      if (delivery && typeof delivery.catch === 'function') delivery.catch(function () { /* No unbounded telemetry retries. */ });
    } catch { /* Telemetry failure must not break the enquiry form. */ }
  });
  }
  installFailureConsumer('xoomFormIdentityUnavailable', 'identity_unavailable', 'xoomai:identity-failure-reports:v1');
  installFailureConsumer('xoomFormAttributionUnavailable', 'attribution_unavailable', 'xoomai:attribution-failure-reports:v1');
  function unavailable() {
    if (typeof w.CustomEvent === 'function' && typeof w.dispatchEvent === 'function') {
      w.dispatchEvent(new w.CustomEvent('xoomFormIdentityUnavailable', { detail: { formId: formId, source_page_path: sourcePath } }));
    }
  }
  function scheduleRefresh(entry, delay) {
    if (entry.timer && typeof w.clearTimeout === 'function') w.clearTimeout(entry.timer);
    entry.timer = w.setTimeout(function () { refresh(entry); }, delay);
  }
  async function refresh(entry) {
    if (entry.inFlight || entry.submitted) return;
    entry.inFlight = true;
    try {
      var request = { method: 'POST', credentials: 'same-origin', cache: 'no-store' };
      if (entry.token) { request.headers = { 'Content-Type': 'application/json' }; request.body = JSON.stringify({ token: entry.token }); }
      var response = await w.fetch('/api/hubspot/identity/issue', request);
      if (entry.submitted) return;
      if (!response.ok) throw new Error('Identity renewal unavailable');
      var issued = await response.json();
      if (entry.submitted) return;
      if (!issued.ok || typeof issued.eventUuid !== 'string' || !uuid.test(issued.eventUuid) || typeof issued.token !== 'string'
        || (entry.id && issued.eventUuid !== entry.id) || issued.formId !== formId || issued.sourceUrl !== sourceUrl
        || !Number.isFinite(issued.expiresAt) || issued.expiresAt <= Date.now()
        || !Number.isFinite(issued.validUntil) || issued.validUntil <= Date.now()
        || (entry.validUntil && issued.validUntil !== entry.validUntil)) throw new Error('Invalid identity renewal');
      // Preserve the identity even if field writes fail; a retry must renew it,
      // never silently substitute another UUID for this form instance.
      entry.id = issued.eventUuid; entry.token = issued.token;
      entry.form.setFieldValue(fields.id, [entry.id]);
      entry.form.setFieldValue(fields.token, [entry.token]);
      entry.form.setFieldValue(fields.source, [sourceUrl]);
      if (scalar(await entry.form.getFieldValue(fields.id)) !== entry.id || scalar(await entry.form.getFieldValue(fields.token)) !== entry.token
        || scalar(await entry.form.getFieldValue(fields.source)) !== sourceUrl) throw new Error('Identity fields unavailable');
      entry.expiresAt = issued.expiresAt; entry.validUntil = issued.validUntil; entry.ready = true;
      if (entry.submitted) return;
      scheduleRefresh(entry, Math.max(1000, entry.expiresAt - Date.now() - 120000));
    } catch {
      if (!entry.submitted) { unavailable(); scheduleRefresh(entry, 5000); }
    } finally { entry.inFlight = false; }
  }
  w.addEventListener('hs-form-event:on-ready', async function (event) {
    if (!event.detail || event.detail.formId !== formId || w.location.pathname !== sourcePath) return;
    var instance = event.detail.instanceId;
    if (typeof instance !== 'string' || identities[instance]) return;
    sources[instance] = sourcePath;
    var entry = identities[instance] = { ready: false };
    try {
      var form = w.HubSpotFormsV4 && w.HubSpotFormsV4.getFormFromEvent(event);
      if (!form || form.getFormId() !== formId || typeof form.setFieldValue !== 'function') return;
      var current = await form.getFormFieldValues();
      await prepareAttribution(form, current);
      if (!Object.keys(fields).every(function (k) { return current.some(function (f) { return f.name === fields[k]; }); })) { unavailable(); return; }
      entry.form = form; await refresh(entry);
    } catch { unavailable(); }
  });
  function refreshDue() {
    Object.keys(identities).forEach(function (key) {
      var entry = identities[key];
      if (entry.form && !entry.submitted && (!entry.ready || entry.expiresAt - Date.now() <= 120000)) refresh(entry);
    });
  }
  w.addEventListener('focus', refreshDue);
  if (w.document) w.document.addEventListener('visibilitychange', refreshDue);
  w.addEventListener('hs-form-event:on-submission:success', async function (event) {
    if (!event.detail || event.detail.formId !== formId) return;
    var path = sources[event.detail.instanceId] || w.location.pathname;
    if (path !== sourcePath) return;
    try {
      var form = w.HubSpotFormsV4 && w.HubSpotFormsV4.getFormFromEvent(event);
      if (!form || form.getFormId() !== formId) return;
      var identity = identities[event.detail.instanceId];
      if (!identity || !identity.ready || typeof identity.id !== 'string' || !uuid.test(identity.id) || identity.validUntil <= Date.now()) { unavailable(); return; }
      if (identity.checking || identity.submitted) return;
      identity.checking = true;
      // Freeze renewal before asynchronous read-back, including duplicate callbacks.
      identity.submitted = true;
      if (identity.timer && typeof w.clearTimeout === 'function') w.clearTimeout(identity.timer);
      var expectedId = identity.id, expectedToken = identity.token;
      var actual;
      try { actual = await Promise.all([form.getFieldValue(fields.id), form.getFieldValue(fields.token), form.getFieldValue(fields.source)]); }
      catch { unavailable(); return; }
      if (scalar(actual[0]) !== expectedId || scalar(actual[1]) !== expectedToken || scalar(actual[2]) !== sourceUrl) { unavailable(); return; }
      // Attribution mismatch is reported independently of a valid confirmed Lead.
      await checkAttribution(form);
      var id = 'hs_form_' + expectedId;
      if (state.sentMeta.includes(id) || state.pending.some(function (entry) { return entry.id === id; })) return;
      state.pending.push({ id: id, path: path, at: Date.now() });
      save();
      flush();
      w.setTimeout(function () { allowGaHere = true; flush(); }, 1000);
    } catch { /* Provider analytics failures do not imply identity failure. */ }
  });
  w.addEventListener('metaPixelReady', flush);
  w.addEventListener('ga4Ready', flush);
  flush();
})(window);
