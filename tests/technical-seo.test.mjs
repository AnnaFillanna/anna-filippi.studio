import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const origin = 'https://annafilippi.studio';
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const paths = urls.map(url => new URL(url).pathname);
const htmlByPath = new Map(await Promise.all(paths.map(async path => [path, await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8')])));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));

test('every indexable page has unique metadata, semantic landmarks and a canonical URL', () => {
  assert.equal(new Set(urls).size, urls.length);
  const titles = new Set(), descriptions = new Set();
  for (const [path, html] of htmlByPath) {
    assert.match(html, /<html lang="de">/);
    assert.equal((html.match(/<main\b/g) || []).length, 1, path);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1, path);
    assert.ok(html.includes(`rel="canonical" href="${origin}${path}"`), path);
    assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*(noindex|nofollow)/i.test(html), path);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && !titles.has(title), path); titles.add(title);
    assert.ok(description && !descriptions.has(description), path); descriptions.add(description);
    let level = 0;
    for (const [, next] of html.matchAll(/<h([1-6])\b/g)) {
      assert.ok(Number(next) <= level + 1, `${path}: skipped heading level`);
      level = Number(next);
    }
  }
});

test('all internal HTML links and fragment targets resolve and all public pages are reachable from home', async () => {
  const edges = new Map();
  for (const [path, html] of htmlByPath) {
    const links = [];
    for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const url = new URL(href.replaceAll('&amp;', '&'), origin + path);
      if (url.origin !== origin) continue;
      const target = htmlByPath.get(url.pathname);
      if (target) {
        links.push(url.pathname);
        if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${path}: ${href}`);
      } else {
        assert.ok(!url.pathname.startsWith('/api/'), `API must not be a navigation target: ${href}`);
        await access(`dist${decodeURIComponent(url.pathname)}`);
      }
    }
    edges.set(path, links);
  }
  const visited = new Set(), pending = ['/'];
  while (pending.length) {
    const path = pending.pop();
    if (visited.has(path)) continue;
    visited.add(path); pending.push(...edges.get(path));
  }
  assert.deepEqual([...visited].sort(), [...paths].sort());
});

test('HTML aliases redirect directly to their canonical pages without matching clean rewrite sources', () => {
  for (const path of paths) {
    const alias = path === '/' ? '/index.html' : `${path}/index.html`;
    const rule = config.redirects.find(rule => rule.source === alias);
    assert.ok(rule, alias);
    assert.equal(rule.permanent, true);
    assert.equal(rule.destination, origin + path);
    assert.ok(!config.redirects.some(rule => !rule.has && rule.source === path), path);
  }
  const host = config.redirects.find(rule => rule.has?.some(condition => condition.type === 'host'));
  assert.deepEqual(host.has, [{ type: 'host', value: 'www.annafilippi.studio' }]);
  assert.equal(host.source, '/:path*');
  assert.equal(host.destination, `${origin}/:path*`);
  assert.equal(host.permanent, true);
  assert.equal(config.trailingSlash, false);
  // No global SPA fallback: an unknown route must continue to the host's 404 handling.
  assert.ok(config.rewrites.every(rule => rule.source !== '/:path*' && rule.source !== '/(.*)'));
});

test('crawler policy is unchanged and no-script navigation has real links and a visible fallback', async () => {
  const robots = await readFile('public/robots.txt', 'utf8');
  assert.equal(robots.trim(), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`);
  assert.equal(await readFile('public/sitemap.xml', 'utf8'), sitemap);
  for (const [path, html] of htmlByPath) {
    assert.match(html, /<nav[^>]*id="hauptnavigation"[^>]*aria-label="Hauptnavigation"/);
    assert.match(html, /<noscript><style>[^<]*#hauptnavigation\{display:flex!important;position:static!important/);
    assert.match(html, /<noscript><style>[^<]*\[data-menu-toggle\]\{display:none!important\}/);
    for (const target of ['/softwareentwicklung', '/projekte', '/fotografie', '/ueber-mich', '/insights', '/kontakt']) {
      assert.ok(html.includes(`href="${target}"`), `${path}: ${target}`);
    }
  }
});
