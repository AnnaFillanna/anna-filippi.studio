import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

async function load(source) {
  const { code } = await transformWithEsbuild(source, 'config.ts', { loader: 'ts', format: 'cjs' });
  const context = { module: { exports: {} }, URL };
  vm.runInNewContext(code, context);
  return context.module.exports;
}

test('Google review link stays hidden unless a safe Google URL is configured', async () => {
  const { reviews, googleReviewHref } = await load(await readFile('src/config/reviews.ts', 'utf8'));
  assert.equal(reviews.googleReviewUrl, '');
  for (const url of ['', 'invalid', 'javascript:alert(1)', 'https://example.com/review', 'https://google.com.evil.test/review', 'https://user:pass@g.page/test/review', 'http://g.page/test/review', 'https://www.google.com/']) {
    assert.equal(googleReviewHref(url), null);
  }
  // Synthetic test-only URL, never configured or rendered on the website.
  assert.equal(googleReviewHref('https://g.page/r/test-only/review'), 'https://g.page/r/test-only/review');
});
