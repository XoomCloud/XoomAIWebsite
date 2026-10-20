import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const booking = readFileSync(new URL('../public/booking-click-tracking.js', import.meta.url), 'utf8');
const talent = readFileSync(new URL('../public/xoomtalent/tracking.js', import.meta.url), 'utf8');
function browser({ ready = true } = {}) {
  const handlers = {}, listeners = {}, meta = [], scripts = [], timers = [], navigations = [];
  let sequence = 0;
  const window = {
    location: { href: 'https://xoomai.com.au/contact?email=private#anchor', pathname: '/contact', assign: u => navigations.push(u) },
    crypto: { randomUUID: () => String(++sequence) },
    addEventListener: (name, fn) => { listeners[name] = fn; },
    dispatchEvent: e => listeners[e.type]?.(e),
    setTimeout: fn => timers.push(fn),
  };
  if (ready) window.fbq = (...args) => meta.push(args);
  const document = { addEventListener: (name, fn) => { handlers[name] = fn; }, createElement: () => ({}), head: { appendChild: e => scripts.push(e) } };
  const ctx = vm.createContext({ window, document, URL, Event });
  function click({ url = 'https://outlook.office.com/bookwithme/user/test', target = '_blank', type = 'click', button = 0, ...rest } = {}) {
    const anchor = { href: url, target, hasAttribute: () => false };
    const e = { type, button, target: { closest: () => anchor }, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...rest };
    handlers[type](e);
    return e;
  }
  return { window, meta, scripts, timers, navigations, ctx, click };
}
test('one click emits one Meta Lead and one GA4 event with path and matching event ID', () => {
  const b = browser(); vm.runInContext(booking, b.ctx); b.click();
  assert.equal(b.meta.length, 1); assert.equal(b.window.dataLayer.length, 1);
  assert.equal(b.meta[0][0], 'trackSingle'); assert.equal(b.meta[0][1], '1643300670067276'); assert.equal(b.meta[0][2], 'Lead');
  assert.equal(b.window.dataLayer[0][0], 'event'); assert.equal(b.window.dataLayer[0][1], 'generate_lead'); assert.equal(b.window.dataLayer[0][2].send_to, 'G-T3NZH8T5H7');
  assert.equal(b.meta[0][3].source_page_path, '/contact');
  assert.equal(b.meta[0][3].conversion_type, 'booking_click_proxy');
  assert.equal(b.meta[0][4].eventID, b.window.dataLayer[0][2].event_id);
  assert.ok(!JSON.stringify(b.window.dataLayer).includes('private'));
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
  assert.equal(b.meta.length, 0); assert.equal(b.window.dataLayer, undefined);
});
test('early Meta event waits for readiness and drains once', () => {
  const b = browser({ ready: false }); vm.runInContext(booking, b.ctx); b.click();
  b.window.fbq = (...args) => b.meta.push(args);
  b.window.dispatchEvent(new Event('metaPixelReady')); b.window.dispatchEvent(new Event('metaPixelReady')); assert.equal(b.meta.length, 1);
});
test('same-tab navigation waits for dispatch and timeout or callback navigates once', () => {
  const b = browser(); vm.runInContext(booking, b.ctx); const e = b.click({ target: '' });
  assert.equal(e.defaultPrevented, true); assert.equal(b.navigations.length, 0);
  b.window.dataLayer[0][2].event_callback(); b.timers[0](); assert.equal(b.navigations.length, 1);
});
test('new-tab and modifier clicks preserve native navigation', () => {
  const b = browser(); vm.runInContext(booking, b.ctx);
  assert.equal(b.click().defaultPrevented, false); assert.equal(b.click({ target: '', ctrlKey: true }).defaultPrevented, false); assert.equal(b.timers.length, 0);
});
test('middle click is tracked once and right click is ignored', () => {
  const b = browser(); vm.runInContext(booking, b.ctx); b.click({ type: 'auxclick', button: 1 }); b.click({ type: 'auxclick', button: 2 }); assert.equal(b.meta.length, 1);
});
test('static page bootstraps one live pixel PageView and direct GA4', () => {
  const b = browser({ ready: false }); vm.runInContext(talent, b.ctx); vm.runInContext(talent, b.ctx);
  assert.equal(b.window.fbq.queue.length, 2); assert.equal(b.window.fbq.queue[0][1], '1643300670067276'); assert.equal(b.window.fbq.queue[1][2], 'PageView'); assert.equal(b.scripts.length, 2);
});
test('static page loads direct GA4 exactly once', () => {
  const b = browser({ ready: false }); b.window.XOOM_TRACKING_CONFIG = { gaId: 'G-T3NZH8T5H7' };
  vm.runInContext(talent, b.ctx); vm.runInContext(talent, b.ctx);
  assert.equal(b.scripts.filter(s => s.src.includes('googletagmanager')).length, 1); assert.equal(b.window.dataLayer.filter(args => args[0] === 'config').length, 1); assert.equal(b.window.dataLayer[1][1], 'G-T3NZH8T5H7');
});
