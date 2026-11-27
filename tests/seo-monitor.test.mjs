import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('SEO-Monitor erkennt kritische Fehler und trennt Warnungen', () => {
  const result = spawnSync('python3', ['tests/seo_monitor_test.py'], {
    encoding: 'utf8',
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  assert.equal(result.status, 0, result.error?.message || result.stderr || result.stdout);
});
