import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { transformWithEsbuild } from 'vite';
const { code } = await transformWithEsbuild(await readFile('src/analytics/analytics.ts', 'utf8'), 'analytics.ts', { loader: 'ts', format: 'cjs' });
function setup() {
  const scripts = [], cookies = [], storage = new Map();
  let reloads = 0;
  const document = { head: { appendChild: script => scripts.push(script) }, createElement: () => ({}), getElementById: () => ({ remove() {} }) };
  Object.defineProperty(document, 'cookie', { get: () => '_ga=123; _ga_9QF4VMGV2Y=456; other=keep', set: value => cookies.push(value) });
  const window = { location: { origin: 'https://annafilippi.studio', hostname: 'annafilippi.studio', reload: () => reloads++ } };
  const localStorage = { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) };
  const context = { module: { exports: {} }, window, document, localStorage };
  vm.runInNewContext(code, context);
  return { api: context.module.exports, window, scripts, cookies, storage, reloads: () => reloads };
}
test('unknown and rejected consent never inject a tag or queue Google commands', () => {
  const s = setup();
  s.api.trackPage('/', 'Home');
  s.api.saveConsent('denied');
  s.api.trackPage('/kontakt', 'Contact');
  assert.equal(s.scripts.length, 0);
  assert.equal(s.window.dataLayer, undefined);
  assert.equal(s.api.readConsent(), 'denied');
});
test('consent initializes once, deduplicates renders and tracks back navigation', () => {
  const s = setup();
  s.api.saveConsent('granted');
  for (const path of ['/', '/', '/kontakt', '/kontakt', '/']) s.api.trackPage(path, 'Title');
  assert.equal(s.scripts.length, 1);
  const commands = s.window.dataLayer.map(args => Array.from(args));
  assert.equal(commands.filter(args => args[0] === 'config').length, 1);
  assert.equal(commands.filter(args => args[0] === 'event').length, 3);
  assert.equal(commands[0][2].analytics_storage, 'denied');
  assert.equal(commands[1][2].analytics_storage, 'granted');
  assert.equal(commands[1][2].ad_storage, 'denied');
  assert.equal(commands.find(args => args[0] === 'config')[2].send_page_view, false);
});
test('withdrawal disables tracking, clears only GA cookies and reloads', () => {
  const s = setup();
  s.api.saveConsent('granted'); s.api.trackPage('/', 'Home');
  s.api.saveConsent('denied'); s.api.trackPage('/kontakt', 'Contact');
  assert.equal(s.window['ga-disable-G-9QF4VMGV2Y'], true);
  assert.equal(s.window.dataLayer.length, 0);
  assert.equal(s.reloads(), 1);
  assert.ok(s.cookies.some(value => value.startsWith('_ga=')));
  assert.ok(s.cookies.every(value => !value.startsWith('other=')));
  assert.equal(s.api.readConsent(), 'denied');
});
test('invalid, future and expired consent fail closed', () => {
  const s = setup();
  for (const value of ['broken', 'null', JSON.stringify({ version: 1, choice: 'granted', at: 1 }), JSON.stringify({ version: 1, choice: 'granted', at: Date.now() + 100000 })]) {
    s.storage.set(s.api.CONSENT_KEY, value);
    assert.equal(s.api.readConsent(), null);
  }
});
