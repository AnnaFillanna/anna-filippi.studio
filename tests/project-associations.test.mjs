import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const expected = [
  { name: 'Dana Tattoo Studio', prefix: 'dana', extension: 'png', href: 'https://tattoodana.de', detail: '/dana-tattoo-studio', text: 'Für das Dana Tattoo Studio in Andernach habe ich eine Website mit Einblicken in Tattoo- und Piercingarbeiten sowie direktem WhatsApp-Kontakt umgesetzt.', feature: true, demo: false },
  { name: 'Mamma Mia – Pizza mit Amore', prefix: 'mamma-mia', extension: 'jpg', href: 'https://annafillanna.github.io/Pizzeria-Mama-Mia/#/login', text: 'Pizza-Konfigurator', feature: true, demo: true },
  { name: 'KAVRO — Barber Studio', prefix: 'kavro', extension: 'png', mobile: 'jpg', href: 'https://annafillanna.github.io/kavro-barber-shop/', text: 'interaktive Terminauswahl', feature: true, demo: true },
  { name: 'VELORA — Beauty House Köln', prefix: 'velora', extension: 'jpg', mobile: 'png', href: 'https://annafillanna.github.io/velora-beauty/', text: 'Das Konzept für ein fiktives Beauty-Studio', feature: true, demo: true },
  { name: 'FilliCat', prefix: 'fillicat', extension: 'png', href: 'https://fillicat.com', detail: '/softwareentwicklung', text: 'Mit FilliCat kannst du Programmieren', feature: true, demo: false },
];

for (const project of expected) {
  test(`${project.name}: card keeps its own text, previews, links and demo status`, async () => {
    const html = await readFile('dist/projekte/index.html', 'utf8');
    const cards = (html.match(/<article\b[\s\S]*?<\/article>/g) || []).filter(card => !/^<article[^>]*aria-hidden="true"/.test(card));
    assert.equal(cards.length, expected.length);
    const card = cards.find(card => card.includes(`>${project.name}</h2>`));
    assert.ok(card, `Missing card for ${project.name}`);
    assert.ok(card.includes(project.text));
    assert.ok(card.includes(`href="${project.href}"`));
    assert.ok(card.includes(`href="${project.detail || project.href}"`));
    for (const [device, extension] of [['desktop', project.extension], ['mobile', project.mobile || project.extension]]) {
      const path = `/images/projects/${project.prefix}-${device}.${extension}`;
      assert.ok(card.includes(`src="${path}"`));
      await access(`public${path}`);
    }
    assert.equal(/Demo/i.test(card), project.demo);
    assert.equal(/<span[^>]*>In Entwicklung<\/span>/.test(card), project.prefix === 'fillicat');
    if (project.prefix === 'fillicat') {
      assert.ok(!/Veröffentlicht|Fertiggestellt|Abgeschlossen/i.test(card));
      assert.ok(!/aggregateRating|ratingValue|role="(?:radio|slider)"|[★☆]/i.test(card));
    }
    for (const other of expected.filter(other => other !== project)) {
      assert.ok(!card.includes(other.name), `Mixed name: ${other.name}`);
      assert.ok(!card.includes(`/images/projects/${other.prefix}-`), `Mixed images: ${other.prefix}`);
    }
  });
}

test('homepage carousel keeps all five featured projects with their own images, destinations and development status', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const track = html.match(/<ul[^>]*id="featured-project-track"[\s\S]*?<\/section>/)?.[0];
  assert.ok(track);
  const cards = (track.match(/<li\b[^>]*>\s*<article\b[\s\S]*?<\/article>\s*<\/li>/g) || []).filter(card => !/^<li[^>]*aria-hidden="true"/.test(card));
  assert.equal(cards.length, expected.filter(project => project.feature).length);
  for (const project of expected.filter(project => project.feature)) {
    const card = cards.find(card => card.includes(`>${project.name}</h3>`));
    assert.ok(card);
    assert.ok(card.includes(`href="${project.detail || project.href}"`));
    assert.ok(card.includes(`/images/projects/${project.prefix}-desktop.${project.extension}`));
    assert.equal(card.includes('Demoprojekt'), project.demo);
    assert.equal(/<span[^>]*>In Entwicklung<\/span>/.test(card), project.prefix === 'fillicat');
    if (project.prefix === 'fillicat') {
      assert.ok(!/Veröffentlicht|Fertiggestellt|Abgeschlossen/i.test(card));
      assert.ok(!/aggregateRating|ratingValue|role="(?:radio|slider)"|[★☆]/i.test(card));
    }
  }
});

for (const project of expected.filter(project => project.detail)) {
  test(`${project.detail}: detail content belongs exclusively to ${project.name}`, async () => {
    const html = await readFile(`dist${project.detail}/index.html`, 'utf8');
    const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
    assert.ok(main?.includes(`>${project.name}</h2>`));
    assert.ok(main.includes(`href="${project.href}"`));
    assert.ok(main.includes(`/images/projects/${project.prefix}-desktop.${project.extension}`));
    assert.ok(main.includes(`/images/projects/${project.prefix}-mobile.${project.extension}`));
    assert.ok(main.includes(project.prefix === 'fillicat' ? 'automatische Code-Tests' : 'geschützte Medienverwaltung'));
    assert.equal(/<span[^>]*>In Entwicklung<\/span>/.test(main), project.prefix === 'fillicat');
    if (project.prefix === 'fillicat') {
      assert.ok(!/aggregateRating|ratingValue|role="(?:radio|slider)"|[★☆]/i.test(main));
    }
    for (const other of expected.filter(other => other !== project)) {
      assert.ok(!main.includes(other.name));
      assert.ok(!main.includes(`/images/projects/${other.prefix}-`));
    }
  });
}
