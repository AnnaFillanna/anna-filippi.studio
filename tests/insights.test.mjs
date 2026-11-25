import test from 'node:test';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const origin = 'https://annafilippi.studio';
const fixture = {
  slug: 'testartikel',
  title: 'Testartikel <Überblick>',
  description: 'Eine Beschreibung für den isolierten Test.',
  metaTitle: 'Individueller Testtitel',
  metaDescription: 'Individuelle Testbeschreibung',
  category: 'SEO & AEO',
  image: { src: '/images/about-anna-red.jpg', alt: 'Testbild', width: 993, height: 1600 },
  author: 'Anna Filippi',
  publishedAt: '2025-01-15',
  updatedAt: '2025-02-20',
  readingMinutes: 4,
  question: 'Was ist die Antwort?',
  answer: 'Eine geprüfte Antwort.',
  sections: [{ id: 'vergleich', title: 'Vergleich', blocks: [
    { type: 'paragraph', text: 'Ein Absatz.' },
    { type: 'subheading', text: 'Ein Unterthema' },
    { type: 'example', title: 'Ein Beispiel', text: 'Eine praktische Anwendung.' },
    { type: 'table', caption: 'Eine Tabelle', headers: ['A', 'B'], rows: [['Eins', 'Zwei']] },
  ] }],
  faq: [{ question: 'Eine Frage?', answer: 'Eine Antwort.' }],
  sources: [{ label: 'Quelle', url: 'https://example.org/quelle' }],
  links: [{ label: 'Leistungen', href: '/#leistungen' }],
  cta: { label: 'Kontakt aufnehmen', href: '/kontakt' },
  relatedSlugs: ['zweiter-test', 'nicht-veroeffentlicht'],
};

test('veröffentlichte Artikel werden mit vollständigem Inhalt und SEO statisch erzeugt', async () => {
  const root = await mkdtemp(join(tmpdir(), 'anna-insights-test-'));
  try {
    await cp('src', join(root, 'src'), { recursive: true });
    await mkdir(join(root, 'scripts'));
    await cp('scripts/build.mjs', join(root, 'scripts/build.mjs'));
    for (const file of ['index.html', 'package.json', 'vite.config.ts', 'tsconfig.json']) await cp(file, join(root, file));
    await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    await symlink(resolve('public'), join(root, 'public'), 'dir');
    const dataPath = join(root, 'src/data/insights.ts');
    const source = await readFile(dataPath, 'utf8');
    const second = { ...fixture, slug: 'zweiter-test', title: 'Zweiter Test', relatedSlugs: [] };
    const updated = source.replace('export const publishedInsights: InsightArticle[] = [', `export const publishedInsights: InsightArticle[] = [${JSON.stringify(fixture)},${JSON.stringify(second)},`);
    assert.notEqual(updated, source);
    await writeFile(dataPath, updated);
    await execFileAsync(process.execPath, ['scripts/build.mjs'], { cwd: root, timeout: 120000, maxBuffer: 1024 * 1024 });
    const html = await readFile(join(root, 'dist/insights/testartikel/index.html'), 'utf8');
    assert.match(html, /<title>Individueller Testtitel<\/title>/);
    assert.match(html, /name="description" content="Individuelle Testbeschreibung"/);
    assert.ok(html.includes(`rel="canonical" href="${origin}/insights/testartikel"`));
    assert.ok(html.includes('property="og:type" content="article"'));
    assert.ok(html.includes(`property="og:image" content="${origin}/images/about-anna-red.jpg"`));
    for (const text of ['Eine geprüfte Antwort.', 'Inhaltsverzeichnis', 'Ein Unterthema', 'Ein Beispiel', 'Eine Tabelle', 'Eine Frage?', 'Quelle', 'Kontakt aufnehmen', 'Zweiter Test']) assert.ok(html.includes(text), text);
    assert.match(html, /<details><summary>Inhaltsverzeichnis/);
    for (const id of ['kurze-antwort', 'vergleich', 'faq', 'quellen']) assert.ok(html.includes(`href="#${id}"`), id);
    assert.ok(html.indexOf('Von <!-- -->Anna Filippi') > html.indexOf('Verwandte Artikel'));
    assert.ok(!html.includes('/insights/nicht-veroeffentlicht'));
    const raw = html.match(/<script id="insight-structured-data" type="application\/ld\+json">([^<]+)<\/script>/)?.[1];
    assert.ok(raw);
    assert.ok(raw.includes('\\u003c'));
    const graph = JSON.parse(raw)['@graph'];
    assert.equal(graph[0]['@type'], 'Article');
    assert.equal(graph[0].author.name, 'Anna Filippi');
    assert.equal(graph[0].datePublished, '2025-01-15');
    assert.equal(graph[0].dateModified, '2025-02-20');
    assert.equal(graph[1]['@type'], 'BreadcrumbList');
    assert.equal(graph[1].itemListElement[2].item, `${origin}/insights/testartikel`);
    const sitemap = await readFile(join(root, 'dist/sitemap.xml'), 'utf8');
    assert.ok(sitemap.includes(`${origin}/insights/testartikel`));
    assert.ok(sitemap.includes(`${origin}/insights/zweiter-test`));
    assert.ok(!sitemap.includes('nicht-veroeffentlicht'));
    await assert.rejects(readFile(join(root, 'dist/insights/nicht-veroeffentlicht/index.html')), { code: 'ENOENT' });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('der freigegebene Artikel erscheint mit Inhalt und Bild in Übersicht und Sitemap', async () => {
  const html = await readFile('dist/insights/index.html', 'utf8');
  const article = await readFile('dist/insights/was-kostet-eine-professionelle-website/index.html', 'utf8');
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.ok(html.includes('Was kostet eine professionelle Website für kleine Unternehmen?'));
  assert.ok(sitemap.includes(`${origin}/insights/was-kostet-eine-professionelle-website`));
  assert.ok(article.includes('Arbeitsplatz mit Laptop, Kamera und Grafiktablett'));
  assert.ok(article.includes('<li>Individuelles Webdesign</li>'));
  assert.ok(article.includes('Wird eine individuell entwickelte Website bei Google besser gefunden?'));
  assert.ok(article.includes('href="#abschluss"'));
  assert.ok(article.includes('Jetzt unverbindlich Kontakt aufnehmen'));
});

test('der zweite Artikel enthält den Vergleich und ist mit dem ersten Artikel verknüpft', async () => {
  const slug = 'webdesign-agentur-oder-freelancer';
  const overview = await readFile('dist/insights/index.html', 'utf8');
  const first = await readFile('dist/insights/was-kostet-eine-professionelle-website/index.html', 'utf8');
  const article = await readFile(`dist/insights/${slug}/index.html`, 'utf8');
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  assert.ok(overview.includes('Webdesign-Agentur oder Freelancer'));
  assert.ok(sitemap.includes(`${origin}/insights/${slug}`));
  assert.ok(article.includes('Arbeitsplatz mit Laptop und Entwurfsplänen an einer Wand'));
  assert.ok(article.includes('aria-label="Agentur und Freelancer im Vergleich" tabindex="0"'));
  assert.ok(article.includes('<th scope="col">Freelancer</th>'));
  assert.ok(article.includes('<td>Abhängig von Spezialisierung und Kapazität</td>'));
  assert.ok(article.includes('<li>Transparente Angebote</li>'));
  assert.ok(article.includes('Was ist für kleine Unternehmen sinnvoller?'));
  assert.ok(article.includes('Lass uns gemeinsam über dein digitales Projekt sprechen.'));
  assert.ok(article.includes('>Kontakt aufnehmen</a>'));
  assert.ok(first.includes(`/insights/${slug}`));
  assert.ok(article.includes('/insights/was-kostet-eine-professionelle-website'));
});
