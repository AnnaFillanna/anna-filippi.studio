import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

async function loadRoutes(window) {
  const data = await transformWithEsbuild(await readFile('src/data/insights.ts', 'utf8'), 'insights.ts', { loader: 'ts', format: 'cjs' });
  const dataContext = { module: { exports: {} } };
  vm.runInNewContext(data.code, dataContext);
  const routes = await transformWithEsbuild(await readFile('src/routes.ts', 'utf8'), 'routes.ts', { loader: 'ts', format: 'cjs' });
  const context = { module: { exports: {} }, window, require: () => dataContext.module.exports };
  vm.runInNewContext(routes.code, context);
  return context.module.exports;
}

const origin = 'https://annafilippi.studio';
const examples = [
  ['/kontakt', 'Erzähl mir von deiner Idee.', 'Projektanfrage'],
  ['/impressum', 'Impressum', 'Rechtstext wird geladen'],
  ['/datenschutz', 'Datenschutzerklärung', 'Rechtstext wird geladen'],
  ['/dana-tattoo-studio', 'Kunst auf der Haut.', 'Dana Tattoo Studio'],
  ['/softwareentwicklung', 'Softwareentwicklung', 'FilliCat'],
  ['/', 'Deine Vision. Meine Kreativität.', 'Meine Leistungen'],
  ['/ueber-mich', 'Über mich', 'Hallo, ich bin Anna.'],
  ['/projekte', 'Ideen, die', 'Dana Tattoo Studio'],
  ['/fotografie', 'Details, die bleiben.', 'Perlen &amp; Seide'],
  ['/insights', 'Wissen &amp; Insights', 'Digitale Lösungen verstehen.'],
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
  for (const hash of ['#projekte', '#fotografie', '#kontakt', '#ueber-mich', '#leistungen', '#inhalt']) {
    const calls = [];
    const routes = await loadRoutes({ location: { pathname: '/', hash, search: '?ref=old' }, history: { state: null, replaceState: (...args) => calls.push(args) } });
    routes.migrateLegacyLink();
    if (hash === '#projekte' || hash === '#fotografie' || hash === '#ueber-mich') assert.equal(calls[0][2], `/${hash.slice(1)}?ref=old`);
    else assert.equal(calls.length, 0, `Anchor must be retained: ${hash}`);
  }
});

test('sitemap and Vercel rules cover all portfolio pages', async () => {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const sourceSitemap = await readFile('public/sitemap.xml', 'utf8');
  for (const [, url] of sourceSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  const routes = await loadRoutes();
  assert.equal((sitemap.match(/<loc>/g) || []).length, Object.keys(routes.pages).length);
  for (const [path] of examples) assert.ok(sitemap.includes(`<loc>${origin}${path}</loc>`));
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.trailingSlash, false);
  const fixedRules = config.rewrites.filter(rule => !rule.source.includes(':'));
  assert.equal(fixedRules.length, examples.length - 1);
  for (const rule of fixedRules) await access(`dist${rule.destination}`);
  assert.ok(config.rewrites.some(rule => rule.source === '/insights/:slug' && rule.destination === '/insights/:slug/index.html'));
  assert.ok(!config.rewrites.some(rule => rule.source.includes('(.*)')));
});

test('home presents six services and introduces the personal collaboration approach', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  for (const id of ['start', 'leistungen', 'kontakt']) assert.ok(html.includes(`id="${id}"`));
  for (const title of ['Websites &amp; Webdesign', 'Webentwicklung &amp; E-Commerce', 'KI &amp; Automatisierung', 'SEO &amp; Website-Betreuung', 'Produktfotografie', 'Beratung &amp; Website-Check']) {
    assert.ok(html.includes(title), `Missing service: ${title}`);
  }
  assert.ok(!html.includes('id="ueber-mich"'));
  assert.ok(!html.includes('04 / KONTAKT'));
  assert.ok(!/<span[^>]*>0[1-6] —<\/span>/.test(html));
  assert.ok(html.includes('Meine Leistungen'));
  assert.ok(html.includes('Bei komplexen KI-Lösungen klären wir Umfang und technische Machbarkeit gemeinsam.'));
  assert.equal((html.match(/class="[^"]*serviceArea[^"]*"/g) ?? []).length, 6);
  assert.ok(html.includes('Möglichkeiten entdecken'));
  assert.ok(html.includes('Meine Fotografien entdecken'));
  assert.ok(html.includes('Warum mit mir arbeiten?'));
  assert.match(html, /<h2[^>]*id="services-title"[^>]*>Meine Leistungen<\/h2>/);
  for (const benefit of ['Deine Idee steht im Mittelpunkt', 'Transparente Zusammenarbeit', 'Direkter Kontakt']) assert.ok(html.includes(benefit));
  assert.ok(html.includes('Mit Kreativität, Technologie und einem Blick fürs Detail entwickle ich digitale Lösungen für dein Business.'));
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer);
  assert.ok(!footer.includes('Cookies'));
  assert.ok(html.includes('Online-Terminbuchung'));
  for (const label of ['Impressum', 'Datenschutz']) assert.ok(html.includes(label));
});

test('about page includes the requested personal text and original portrait', async () => {
  const html = await readFile('dist/ueber-mich/index.html', 'utf8');
  assert.ok(html.replace(/<[^>]*>/g, '').includes('Ich komme aus Andernach und entwickle Webseiten für Selbstständige sowie kleine und mittlere Unternehmen.'));
  assert.ok(html.includes('<strong>Gestaltung und Technik</strong>'));
  assert.ok(html.includes('<strong>Weiterbildung zur Full-Stack-Entwicklerin</strong>'));
  assert.ok(html.includes('Mein Weg zur Webentwicklung'));
  assert.ok(html.includes('Weiterbildung zur Full-Stack-Entwicklerin'));
  assert.ok(html.includes('künstliche Intelligenz'));
  assert.ok(html.includes('So arbeite ich'));
  assert.ok(html.includes('<h2>Weiterbildung</h2>'));
  for (const term of ['Webentwicklung', 'digitales Marketing', 'Suchmaschinenoptimierung', 'E-Commerce']) assert.ok(html.includes(`<strong>${term}</strong>`));
  assert.ok(html.includes('Aktuell absolviere ich eine Weiterbildung zur Full-Stack-Entwicklerin.'));
  assert.ok(!html.includes('Meine abgeschlossenen Zertifizierungen'));
  assert.ok(html.includes('Lass uns über deine Idee sprechen.'));
  assert.ok(html.includes('/images/about-anna-red.jpg'));
  assert.ok(html.includes('width="993" height="1600"'));
  assert.ok(html.includes('href="/#start"'));
  assert.ok(!html.includes('ausgebildete Berufsfotografin'));
  assert.match(html, /<a\b[^>]*href="\/kontakt"[^>]*>Kontakt aufnehmen<\/a>/);
});

test('about page presents the professional focus areas as accessible text', async () => {
  const html = await readFile('dist/ueber-mich/index.html', 'utf8');
  const portrait = html.indexOf('alt="Anna Filippi in einem roten Kleid vor einer hellen Wand"');
  const heading = html.indexOf('Meine fachlichen Schwerpunkte');
  assert.ok(portrait >= 0 && heading > portrait);
  const map = html.slice(html.lastIndexOf('<section', heading), html.indexOf('</section>', heading));
  for (const text of ['Fachliche Ausrichtung und Weiterentwicklungsbereiche', 'Full-Stack Webentwicklung', 'Technical SEO', 'AEO &amp; GEO', 'Analytics', 'Automation', 'E-Commerce', 'KI-Integration']) assert.ok(map.includes(text), text);
  assert.match(map, /<svg[^>]*aria-hidden="true"[^>]*>/);
  assert.equal((map.match(/<line\b/g) ?? []).length, 6);
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
  const routes = await loadRoutes();
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const titles = new Set();
  for (const [path, meta] of Object.entries(routes.pages)) {
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
    const structuredData = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/g)];
    assert.equal(structuredData.length, path.startsWith('/insights/') ? 2 : 1, `${path}: JSON-LD blocks`);
    assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
    const data = JSON.parse(structuredData[0][1]);
    assert.equal(data['@context'], 'https://schema.org');
    const websites = data['@graph'].filter(item => item['@type'] === 'WebSite');
    assert.equal(websites.length, 1);
    assert.equal(websites[0].name, 'ANNA FILIPPI Studio');
    assert.equal(websites[0].alternateName, undefined);
    assert.equal(websites[0].sameAs, undefined);
    assert.equal(websites[0].url, `${origin}/`);
    const person = data['@graph'].find(item => item['@type'] === 'Person');
    assert.equal(person.name, 'Anna Filippi');
    assert.equal(person.alternateName, undefined);
    assert.equal(person.sameAs, undefined);
    assert.equal(websites[0].publisher['@id'], person['@id']);
    assert.equal(person.homeLocation.name, 'Andernach, Deutschland');
  }
  await access('dist/favicon.svg');
  const home = await readFile('dist/index.html', 'utf8');
  assert.ok(!home.includes('id="region-title"'));
  assert.equal((home.match(/id="pricing-title"/g) || []).length, 1);
  assert.ok(home.indexOf('id="services-title"') < home.indexOf('id="pricing-title"'));
  assert.ok(home.includes('deutschlandweit'));
  const robots = await readFile('dist/robots.txt', 'utf8');
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(!/Disallow:\s*\//i.test(robots));
});


test('contact form is exclusive to the contact route and navigation stays consistent', async () => {
  for (const [path] of examples) {
    const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8');
    const contactForms = (html.match(/<form\b[\s\S]*?<\/form>/g) || []).filter(form => form.includes('name="message"'));
    assert.equal(contactForms.length, path === '/kontakt' ? 1 : 0, path);
    assert.ok(html.includes('href="/kontakt"'), path);
    assert.ok(!html.includes('Jetzt anfragen'), path);
  }
  const contact = await readFile('dist/kontakt/index.html', 'utf8');
  assert.ok(contact.includes('name="website"')); // Existing honeypot remains present.
  assert.ok(contact.includes('name="message"'));
  const home = await readFile('dist/index.html', 'utf8');
  assert.ok(!home.includes('Software<br/>entwicklung'));
});
