import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

const source = await readFile('src/lib/supabase/client.ts', 'utf8');
const { code } = await transformWithEsbuild(source, 'client.ts', {
  loader: 'ts', format: 'cjs', define: { 'import.meta.env': 'testEnv' },
});
const valid = { VITE_SUPABASE_URL: 'https://project.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_testOnly' };
function setup(env) {
  const calls = [];
  const context = { module: { exports: {} }, URL, testEnv: env, require: () => ({ createClient: (...args) => { calls.push(args); return {}; } }) };
  vm.runInNewContext(code, context);
  return { getSupabase: context.module.exports.getSupabase, calls };
}
test('client initialization is lazy, singleton and does not enable persistent auth', () => {
  const { getSupabase, calls } = setup(valid);
  assert.equal(calls.length, 0);
  assert.equal(getSupabase(), getSupabase());
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], valid.VITE_SUPABASE_URL);
  assert.equal(calls[0][1], valid.VITE_SUPABASE_PUBLISHABLE_KEY);
  for (const setting of ['persistSession', 'autoRefreshToken', 'detectSessionInUrl']) assert.equal(calls[0][2].auth[setting], false);
});
test('missing config, unsafe URLs and non-publishable keys fail without exposing values', () => {
  for (const env of [{}, ...['http://project.supabase.co', 'https://user:password@project.supabase.co', 'https://project.supabase.co/path', 'not-a-url'].map(url => ({ ...valid, VITE_SUPABASE_URL: url })), ...['sb_secret_doNotExpose', 'eyJserviceRoleTest', ''].map(key => ({ ...valid, VITE_SUPABASE_PUBLISHABLE_KEY: key }))]) {
    const { getSupabase, calls } = setup(env);
    assert.throws(getSupabase, error => {
      for (const value of Object.values(env)) if (value) assert.ok(!error.message.includes(value));
      return true;
    });
    assert.equal(calls.length, 0);
  }
});
