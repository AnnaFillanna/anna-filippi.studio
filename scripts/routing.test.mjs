import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

const origin = 'https://annafilippi.studio';
const examples = [
  ['/impressum', 'Impressum', 'Rechtstext wird geladen'],
  ['/datenschutz', 'Datenschutzerklärung', 'Rechtstext wird geladen'],
  ['/dana-tattoo-studio', 'Kunst auf der Haut.', 'Dana Tattoo Studio'],
  ['/softwareentwicklung', 'Programmieren', 'FilliCat'],
  ['/', 'ANNA FILIPPI', 'Meine Leistungen'],
  ['/ueber-mich', 'Über mich', 'Hallo, ich bin Anna.'],
  ['/projekte', 'Meine Arbeiten.', 'Dana Tattoo Studio'],
  ['/fotografie', 'Große Wirkung.', 'Perlen &amp; Seide'],
];
for (const [path, heading, content] of examples) {
  test(`${path}: prerendered content, metadata and internal links`, async () => {
    const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8');
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(heading));
    assert.ok(html.includes(content));
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${origin}${path}"`));
    assert.ok(html.includes('<noscript><style>'));
    assert.ok(!/content="noindex/.test(html));
    assert.ok(!/href="#(?:projekte|fotografie)"/.test(html));
    assert.ok(html.includes('href="/projekte"'));
    assert.ok(html.includes('href="/fotografie"'));
    assert.ok(html.includes('href="/ueber-mich"'));
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(html.includes(`id="${id}"`), `Missing local anchor: ${id}`);
    }
    for (const [, src] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
      await access(`dist${src}`);
    }
    JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  });
}

test('legacy hashes migrate with query strings intact', async () => {
  const source = await readFile('src/routes.ts', 'utf8');
  const { code } = await transformWithEsbuild(source, 'routes.ts', { loader: 'ts', format: 'cjs' });
  for (const hash of ['#projekte', '#fotografie', '#kontakt', '#ueber-mich', '#leistungen', '#inhalt']) {
    const calls = [];
    const context = { module: { exports: {} }, window: { location: { pathname: '/', hash, search: '?ref=old' }, history: { state: null, replaceState: (...args) => calls.push(args) } } };
    vm.runInNewContext(code, context);
    context.module.exports.migrateLegacyLink();
    if (hash === '#projekte' || hash === '#fotografie' || hash === '#ueber-mich') assert.equal(calls[0][2], `/${hash.slice(1)}?ref=old`);
    else assert.equal(calls.length, 0, `Anchor must be retained: ${hash}`);
  }
});

test('sitemap and Vercel rules cover all portfolio pages', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const sourceSitemap = await readFile('public/sitemap.xml', 'utf8');
  assert.equal(sitemap, sourceSitemap);
  assert.equal((sitemap.match(/<loc>/g) || []).length, 8);
  for (const [path] of examples) assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`));
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.trailingSlash, false);
  assert.equal(config.rewrites.length, 7);
  for (const rule of config.rewrites) await access(`dist${rule.destination}`);
  assert.ok(!config.rewrites.some(rule => rule.source.includes('(.*)')));
});

test('home shows six unnumbered services while the profile stays on its own page', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  for (const id of ['start', 'leistungen', 'kontakt']) assert.ok(html.includes(`id="${id}"`));
  for (const title of ['Webdesign &amp; Webentwicklung', 'Software &amp; Web-Apps', 'KI-Integration &amp; Automatisierung', 'Shopify, WordPress &amp; CMS', 'SEO &amp; Website-Betreuung', 'Produkt- &amp; Schmuckfotografie']) {
    assert.ok(html.includes(title), `Missing service: ${title}`);
  }
  assert.ok(!html.includes('id="ueber-mich"'));
  assert.ok(!html.includes('04 / KONTAKT'));
  assert.ok(!/<span[^>]*>0[1-6] —<\/span>/.test(html));
  assert.ok(html.includes('Meine Leistungen'));
  assert.match(html, /<h2[^>]*id="services-title"[^>]*><span>Digitale Ideen\.<\/span>.*?<em>Individuelle Lösungen\.<\/em><\/h2>/s);
  assert.ok(html.includes('mailto:annafilippi@web.de'));
  for (const label of ['Impressum', 'Datenschutz', 'Cookies']) assert.ok(html.includes(label));
});

test('about page includes the requested personal text and original portrait', async () => {
  const html = await readFile('dist/ueber-mich/index.html', 'utf8');
  assert.ok(html.includes('Was als Hobby begann'));
  assert.ok(html.includes('künstlichen Intelligenz'));
  assert.ok(html.includes('/images/about-anna-red.jpg'));
  assert.ok(html.includes('width="993" height="1600"'));
  assert.ok(html.includes('href="/#start"'));
  assert.ok(!html.includes('ausgebildete Berufsfotografin'));
  assert.ok(!html.includes('MEHR ALS')); // Keep the old profile on home, without duplicating it here.
});

test('software page contains only the software project, without the general portfolio introduction', async () => {
  const html = await readFile('dist/softwareentwicklung/index.html', 'utf8');
  assert.ok(!html.includes('Ideen werden digital.'));
  assert.ok(!html.includes('Meine Arbeiten.'));
  assert.ok(!html.includes('Dana Tattoo Studio'));
  assert.ok(!html.includes('RUJOLY'));
  assert.ok(!html.includes('Eine Idee. <em>Auf allen Geräten.'));
  assert.equal((html.match(/Startseite von FilliCat/g) || []).length, 1);
});

 test('footer links point to the implemented legal pages', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  assert.ok(html.includes('href="/impressum"'));
  assert.ok(html.includes('href="/datenschutz"'));
 });

test('SEO metadata stays consistent across prerendered pages and client routes', async () => {
  const source = await readFile('src/routes.ts', 'utf8');
  const { code } = await transformWithEsbuild(source, 'routes.ts', { loader: 'ts', format: 'cjs' });
  const context = { module: { exports: {} } };
  vm.runInNewContext(code, context);
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const titles = new Set();
  for (const [path, meta] of Object.entries(context.module.exports.pages)) {
    const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8');
    assert.ok(html.includes(`<title>${escape(meta.title)}</title>`));
    assert.ok(html.includes(`<meta name="description" content="${escape(meta.description)}"`));
    assert.ok(html.includes(`<meta property="og:title" content="${escape(meta.title)}"`));
    assert.ok(html.includes(`<meta property="og:description" content="${escape(meta.description)}"`));
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes('href="/favicon.svg"'));
    assert.ok(!html.includes('.vercel.app'));
    assert.ok(!titles.has(meta.title));
    titles.add(meta.title);
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    const person = data['@graph'].find(item => item['@type'] === 'Person');
    assert.equal(person.homeLocation.name, 'Andernach, Deutschland');
  }
  await access('dist/favicon.svg');
  const home = await readFile('dist/index.html', 'utf8');
  assert.ok(!home.includes('id="region-title"'));
  assert.equal((home.match(/id="pricing-title"/g) || []).length, 1);
  assert.ok(home.indexOf('id="pricing-title"') < home.indexOf('id="services-title"'));
  assert.ok(home.includes('deutschlandweit'));
  const robots = await readFile('dist/robots.txt', 'utf8');
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(!/Disallow:\s*\//i.test(robots));
});
