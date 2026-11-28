import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(await readFile('src/data/image-variants.json', 'utf8'));

test('responsive derivatives exist, retain source association and never upscale', async () => {
  for (const [source, image] of Object.entries(manifest)) {
    const original = await readFile(`public${source}`);
    assert.equal(original.length, image.originalBytes);
    const hash = createHash('sha256').update(original).digest('hex').slice(0, 12);
    let previousWidth = 0;
    for (const variant of image.variants) {
      assert.ok(variant.width > previousWidth && variant.width <= image.width, source);
      previousWidth = variant.width;
      assert.ok(Math.abs(variant.height - image.height * variant.width / image.width) <= 0.5, source);
      const file = await readFile(`public${variant.src}`);
      assert.equal(file.length, variant.bytes, variant.src);
      if (variant.src !== source) {
        assert.ok(variant.src.includes(hash), `Wrong original: ${source}`);
        assert.equal(file.toString('ascii', 0, 4), 'RIFF');
        assert.equal(file.toString('ascii', 8, 12), 'WEBP');
      }
    }
  }
});

test('all prerendered images have valid responsive paths, intrinsic dimensions and alt attributes', async () => {
  for (const route of ['', 'projekte', 'softwareentwicklung', 'dana-tattoo-studio', 'ueber-mich', 'kontakt', 'impressum', 'datenschutz']) {
    const html = await readFile(`dist/${route ? `${route}/` : ''}index.html`, 'utf8');
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag, /\balt="[^"]*"/);
      assert.match(tag, /\bwidth="[1-9][0-9]*"/);
      assert.match(tag, /\bheight="[1-9][0-9]*"/);
      assert.match(tag, /\bsizes="[^"]+"/);
      const srcSet = tag.match(/\bsrcSet="([^"]+)"/i)?.[1];
      assert.ok(srcSet, tag);
      for (const candidate of srcSet.split(', ')) {
        const [url, width] = candidate.split(' ');
        assert.match(width, /^[1-9][0-9]*w$/);
        assert.ok((await stat(`dist${decodeURI(url)}`)).isFile());
      }
      if (/fetchPriority="high"/i.test(tag)) assert.ok(!tag.includes('loading="lazy"'));
    }
  }
});
