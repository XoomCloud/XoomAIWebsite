(function (w) {
  'use strict';
  if (w.__xoomHubSpotFormTrackingInstalled) return;
  w.__xoomHubSpotFormTrackingInstalled = true;
  var formId = 'd5bbb02f-27ce-4869-8428-3f9268bfe5d5';
  var sourcePath = '/youraiemployee';
  var key = 'xoomai:hubspot-form-conversions:v1';
  var state = { sentMeta: [], sentGa: [], pending: [] };
  var sources = {};
  var allowGaHere = false;
  try {
    var saved = JSON.parse(w.sessionStorage.getItem(key));
    if (saved && Array.isArray(saved.sentMeta) && Array.isArray(saved.sentGa) && Array.isArray(saved.pending)) state = saved;
  } catch (_) { /* In-memory duplicate protection remains available. */ }
  function save() {
    state.sentMeta = state.sentMeta.slice(-50);
    state.sentGa = state.sentGa.slice(-50);
    state.pending = state.pending.slice(-50);
    try { w.sessionStorage.setItem(key, JSON.stringify(state)); } catch (_) { /* Storage may be disabled. */ }
  }
  function flush() {
    state.pending = state.pending.filter(function (entry) {
      if (!entry || !/^hs_form_[0-9a-f-]{36}$/i.test(entry.id) || entry.path !== sourcePath || !Number.isFinite(entry.at) || Date.now() - entry.at > 86400000 || entry.at > Date.now()) return false;
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
  w.addEventListener('hs-form-event:on-ready', function (event) {
    if (event.detail && event.detail.formId === formId && w.location.pathname === sourcePath) sources[event.detail.instanceId] = sourcePath;
  });
  w.addEventListener('hs-form-event:on-submission:success', function (event) {
    if (!event.detail || event.detail.formId !== formId) return;
    var path = sources[event.detail.instanceId] || w.location.pathname;
    if (path !== sourcePath) return;
    try {
      var form = w.HubSpotFormsV4 && w.HubSpotFormsV4.getFormFromEvent(event);
      if (!form || form.getFormId() !== formId) return;
      var conversionId = form.getConversionId();
      if (typeof conversionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conversionId)) return;
      var id = 'hs_form_' + conversionId.toLowerCase();
      if (state.sentMeta.includes(id) || state.pending.some(function (entry) { return entry.id === id; })) return;
      state.pending.push({ id: id, path: path, at: Date.now() });
      save();
      flush();
      w.setTimeout(function () { allowGaHere = true; flush(); }, 1000);
    } catch (_) { /* Only a confirmed provider conversion can produce a Lead. */ }
  });
  w.addEventListener('metaPixelReady', flush);
  w.addEventListener('ga4Ready', flush);
  flush();
})(window);
