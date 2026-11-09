import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const booking = readFileSync(new URL('../public/booking-click-tracking.js', import.meta.url), 'utf8');
const talent = readFileSync(new URL('../public/xoomtalent/tracking.js', import.meta.url), 'utf8');
function browser({ ready = true, gaReady = true } = {}) {
  const handlers = {}, listeners = {}, meta = [], ga = [], registrations = [], scripts = [], timers = [], navigations = [];
  let sequence = 0;
  const window = {
    location: { href: 'https://xoomai.com.au/contact?email=private#anchor', pathname: '/contact', assign: u => navigations.push(u) },
    crypto: { randomUUID: () => String(++sequence) },
    addEventListener: (name, fn) => { listeners[name] = fn; },
    dispatchEvent: e => listeners[e.type]?.(e),
    setTimeout: fn => timers.push(fn),
  };
  if (gaReady) window.gtag = (...args) => ga.push(args);
  if (ready) window.fbq = (...args) => meta.push(args);
  const document = { addEventListener: (name, fn, capture) => { handlers[name] = fn; registrations.push({ name, capture }); }, createElement: () => ({}), head: { appendChild: e => scripts.push(e) } };
  const ctx = vm.createContext({ window, document, URL, Event });
  function click({ url = 'https://outlook.office.com/bookwithme/user/test', target = '_blank', type = 'click', button = 0, ...rest } = {}) {
    const anchor = { href: url, target, hasAttribute: () => false };
    const e = { type, button, target: { closest: () => anchor }, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...rest };
    handlers[type](e);
    return e;
  }
  return { window, meta, ga, registrations, handlers, scripts, timers, navigations, ctx, click };
}
test('booking click sends only the specified custom events with a shared ID and no URL secrets', () => {
  const b = browser(); vm.runInContext(booking, b.ctx);
  b.click({ url: 'https://outlook.office.com/bookwithme/user/test?email=private#secret' });
  assert.deepEqual(JSON.parse(JSON.stringify(b.ga)), [['event', 'booking_started', {
    send_to: 'G-T3NZH8T5H7', source_page_path: '/contact',
    link_url: 'https://outlook.office.com/bookwithme/user/test',
    event_id: 'booking_started_1', transport_type: 'beacon'
  }]]);
  assert.deepEqual(JSON.parse(JSON.stringify(b.meta)), [[
    'trackSingleCustom', '1643300670067276', 'BookingStarted',
    { source_page_path: '/contact' }, { eventID: 'booking_started_1' }
  ]]);
  assert.ok(!/generate_lead|Lead|Schedule|booking_click_proxy/.test(booking));
  assert.ok(!/private|secret/.test(JSON.stringify([b.ga, b.meta])));
  assert.deepEqual(b.registrations, [{ name: 'click', capture: true }, { name: 'auxclick', capture: true }]);
});
test('script re-execution does not install a second listener', () => {
  const b = browser(); vm.runInContext(booking, b.ctx); vm.runInContext(booking, b.ctx); b.click(); assert.equal(b.meta.length, 1);
});
test('nested click and later SPA route use current path, independent clicks get distinct ids', () => {
  const b = browser(); vm.runInContext(booking, b.ctx); b.click(); b.window.location.pathname = '/ai-strategy'; b.click();
  assert.equal(b.meta[1][3].source_page_path, '/ai-strategy'); assert.notEqual(b.meta[0][4].eventID, b.meta[1][4].eventID);
});
test('rejects other hosts, lookalike hosts, HTTP and unrelated Outlook paths', () => {
  const b = browser(); vm.runInContext(booking, b.ctx);
  for (const url of ['https://evil.example/bookwithme/test', 'https://outlook.office.com.evil.example/bookwithme/test', 'http://outlook.office.com/bookwithme/test', 'https://outlook.office.com/mail/test']) b.click({ url });
  assert.equal(b.meta.length, 0); assert.equal(b.ga.length, 0);
});
test('early Meta event waits for readiness and drains once', () => {
  const b = browser({ ready: false }); vm.runInContext(booking, b.ctx); b.click();
  b.window.fbq = (...args) => b.meta.push(args);
  b.window.dispatchEvent(new Event('metaPixelReady')); b.window.dispatchEvent(new Event('metaPixelReady')); assert.equal(b.meta.length, 1);
  assert.equal(b.meta[0][4].eventID, b.ga[0][2].event_id);
  assert.equal(b.meta[0][2], 'BookingStarted');
});
test('all click types preserve native navigation without timers or redirect callbacks', () => {
  const b = browser(); vm.runInContext(booking, b.ctx);
  for (const options of [{ target: '' }, {}, { target: '', ctrlKey: true },
    { target: '', metaKey: true }, { shiftKey: true }, { altKey: true }, { type: 'auxclick', button: 1 }]) {
    b.click({ ...options, preventDefault() { assert.fail('navigation must not be prevented'); } });
  }
  assert.equal(b.ga.length, 7); assert.equal(b.meta.length, 7);
  assert.equal(b.timers.length, 0); assert.equal(b.navigations.length, 0);
  assert.ok(!/preventDefault|setTimeout|event_callback|event_timeout|location.assign/.test(booking));
});
test('middle click is tracked once and other button combinations are ignored', () => {
  const b = browser(); vm.runInContext(booking, b.ctx);
  b.click({ type: 'auxclick', button: 1 });
  for (const options of [{ type: 'auxclick', button: 0 }, { type: 'auxclick', button: 2 }, { button: 1 }, { button: 2 }]) b.click(options);
  assert.equal(b.meta.length, 1); assert.equal(b.ga.length, 1);
});
test('pages without analytics send nothing and do not acquire analytics globals', () => {
  const b = browser({ ready: false, gaReady: false }); vm.runInContext(booking, b.ctx); b.click();
  b.window.dispatchEvent(new Event('metaPixelReady'));
  assert.equal(b.meta.length, 0); assert.equal(b.ga.length, 0);
  assert.equal(b.window.gtag, undefined); assert.equal(b.window.fbq, undefined);
  assert.equal(b.window.dataLayer, undefined); assert.equal(b.scripts.length, 0);
});
test('each existing destination works without the other', () => {
  const gaOnly = browser({ ready: false }); vm.runInContext(booking, gaOnly.ctx); gaOnly.click();
  assert.equal(gaOnly.ga.length, 1); assert.equal(gaOnly.meta.length, 0);
  const metaOnly = browser({ gaReady: false }); vm.runInContext(booking, metaOnly.ctx); metaOnly.click();
  assert.equal(metaOnly.meta.length, 1); assert.equal(metaOnly.ga.length, 0);
  assert.equal(metaOnly.window.gtag, undefined);
});
test('non-anchor targets and invalid URLs are ignored', () => {
  const b = browser(); vm.runInContext(booking, b.ctx);
  b.handlers.click({ type: 'click', button: 0, target: null });
  b.handlers.click({ type: 'click', button: 0, target: { closest: () => null } });
  b.click({ url: 'https://[' });
  assert.equal(b.ga.length, 0); assert.equal(b.meta.length, 0);
});
test('static page bootstraps one live pixel PageView and direct GA4', () => {
  const b = browser({ ready: false, gaReady: false }); vm.runInContext(talent, b.ctx); vm.runInContext(talent, b.ctx);
  assert.equal(b.window.fbq.queue.length, 2); assert.equal(b.window.fbq.queue[0][1], '1643300670067276'); assert.equal(b.window.fbq.queue[1][2], 'PageView'); assert.equal(b.scripts.length, 2);
});
test('static page loads direct GA4 exactly once', () => {
  const b = browser({ ready: false, gaReady: false }); b.window.XOOM_TRACKING_CONFIG = { gaId: 'G-T3NZH8T5H7' };
  vm.runInContext(talent, b.ctx); vm.runInContext(talent, b.ctx);
  assert.equal(b.scripts.filter(s => s.src.includes('googletagmanager')).length, 1); assert.equal(b.window.dataLayer.filter(args => args[0] === 'config').length, 1); assert.equal(b.window.dataLayer[1][1], 'G-T3NZH8T5H7');
});
