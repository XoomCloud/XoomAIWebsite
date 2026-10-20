(function (w, d) {
  'use strict';
  if (w.__xoomBookingTrackingInstalled) return;
  w.__xoomBookingTrackingInstalled = true;
  var pixelId = '1643300670067276';
  var pending = [];
  function sendMeta(payload, eventId) {
    w.fbq('trackSingle', pixelId, 'Lead', payload, { eventID: eventId });
  }
  w.addEventListener('metaPixelReady', function () {
    if (typeof w.fbq !== 'function') return;
    pending.splice(0).forEach(function (entry) { sendMeta(entry.payload, entry.eventId); });
  });
  function track(e) {
    if ((e.type === 'click' && e.button !== 0) || (e.type === 'auxclick' && e.button !== 1)) return;
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var url;
    try { url = new URL(a.href, w.location.href); } catch (_) { return; }
    if (url.protocol !== 'https:' || url.hostname !== 'outlook.office.com' || !url.pathname.startsWith('/bookwithme/')) return;
    var eventId = 'booking_click_' + w.crypto.randomUUID();
    var payload = { source_page_path: w.location.pathname, conversion_type: 'booking_click_proxy' };
    var sameTab = e.type === 'click' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && (!a.target || a.target === '_self') && !a.hasAttribute('download') && !e.defaultPrevented;
    var navigated = false;
    function navigate() {
      if (navigated) return;
      navigated = true;
      w.location.assign(a.href);
    }
    if (sameTab) {
      e.preventDefault();
      w.setTimeout(navigate, 350);
    }
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
    w.gtag('event', 'generate_lead', {
      send_to: 'G-T3NZH8T5H7',
      source_page_path: payload.source_page_path,
      conversion_type: payload.conversion_type,
      event_id: eventId,
      event_callback: sameTab ? navigate : function () {},
      event_timeout: 300,
      transport_type: 'beacon'
    });
    if (typeof w.fbq === 'function') sendMeta(payload, eventId);
    else pending.push({ payload: payload, eventId: eventId });
  }
  d.addEventListener('click', track, true);
  d.addEventListener('auxclick', track, true);
})(window, document);
