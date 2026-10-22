import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

async function load(source) {
  const { code } = await transformWithEsbuild(source, 'config.ts', { loader: 'ts', format: 'cjs' });
  const context = { module: { exports: {} }, URL };
  vm.runInNewContext(code, context);
  return context.module.exports;
}

test('gallery includes each selected upload once and excludes the five removed motifs', async () => {
  const source = await readFile('src/components/Gallery/Gallery.tsx', 'utf8');
  const config = source.slice(source.indexOf('const additionalPhotoSources'), source.indexOf('type Category'));
  const { collections, dimensions, photoSource } = await load(config + '\nexport { collections, dimensions, photoSource };');
  const ids = new Set();
  const paths = new Set();
  for (const collection of Object.values(collections)) {
    for (const photo of collection.photos) {
      assert.ok(!ids.has(photo.id), `Duplicate ID ${photo.id}`);
      ids.add(photo.id);
      const path = photoSource(photo.id);
      assert.ok(!paths.has(path), `Duplicate image ${path}`);
      paths.add(path);
      await access(`public${path}`);
      assert.ok(photo.title.trim() && photo.alt.trim());
      assert.ok(dimensions[photo.id].width > 0 && dimensions[photo.id].height > 0);
    }
  }
  const files = await readdir('public/images/portfolio');
  const unused = files.filter(file => !paths.has(`/images/portfolio/${file}`));
  assert.deepEqual(unused.sort(), [
    'anna-filippi-8.jpg',
    'A6705381_11b96729-6ce3-4849-bb21-ecea410df535.png',
    'hzgthg (1).png',
    '237_7377b7bf-af9f-4896-a897-13ca93a6ef8b.png',
    'white (1).png',
    'fgrtd (1).png',
  ].sort());
  for (const id of [24, 25, 26, 34, 42]) assert.ok(!ids.has(id));
  assert.equal(ids.size, 37);
  assert.ok(paths.has('/images/portfolio/anna-filippi-8-chain.webp'));
});

test('Google review link stays hidden unless a safe Google URL is configured', async () => {
  const { reviews, googleReviewHref } = await load(await readFile('src/config/reviews.ts', 'utf8'));
  assert.equal(reviews.googleReviewUrl, '');
  for (const url of ['', 'invalid', 'javascript:alert(1)', 'https://example.com/review', 'https://google.com.evil.test/review', 'https://user:pass@g.page/test/review', 'http://g.page/test/review', 'https://www.google.com/']) {
    assert.equal(googleReviewHref(url), null);
  }
  // Synthetic test-only URL, never configured or rendered on the website.
  assert.equal(googleReviewHref('https://g.page/r/test-only/review'), 'https://g.page/r/test-only/review');
});
