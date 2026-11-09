(function (w, d) {
  'use strict';
  if (w.__xoomBookingTrackingInstalled) return;
  w.__xoomBookingTrackingInstalled = true;
  var pixelId = '1643300670067276';
  var pending = [];
  function sendMeta(payload, eventId) {
    w.fbq('trackSingleCustom', pixelId, 'BookingStarted', payload, { eventID: eventId });
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
    var eventId = 'booking_started_' + w.crypto.randomUUID();
    var payload = { source_page_path: w.location.pathname };
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'booking_started', {
        send_to: 'G-T3NZH8T5H7',
        source_page_path: payload.source_page_path,
        link_url: url.origin + url.pathname,
        event_id: eventId,
        transport_type: 'beacon'
      });
    }
    if (typeof w.fbq === 'function') sendMeta(payload, eventId);
    else pending.push({ payload: payload, eventId: eventId });
  }
  d.addEventListener('click', track, true);
  d.addEventListener('auxclick', track, true);
})(window, document);
