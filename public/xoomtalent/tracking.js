(function (w, d) {
  'use strict';
  if (w.__xoomTalentTrackingInstalled) return;
  w.__xoomTalentTrackingInstalled = true;
  if (!w.fbq) {
    var n = w.fbq = function () {
      if (n.callMethod) n.callMethod.apply(n, arguments);
      else n.queue.push(arguments);
    };
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    var pixel = d.createElement('script');
    pixel.async = true;
    pixel.src = 'https://connect.facebook.net/en_US/fbevents.js';
    d.head.appendChild(pixel);
  }
  w.fbq('init', '1643300670067276');
  w.fbq('trackSingle', '1643300670067276', 'PageView');
  w.dispatchEvent(new Event('metaPixelReady'));
  var ga = (w.XOOM_TRACKING_CONFIG || {}).gaId || 'G-T3NZH8T5H7';
  if (!/^G-[A-Z0-9]+$/.test(ga)) return;
  w.dataLayer = w.dataLayer || [];
  w.gtag = w.gtag || function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', ga);
  var script = d.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga);
  d.head.appendChild(script);
})(window, document);
