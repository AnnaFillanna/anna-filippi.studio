import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverContact, storageConfig, replaceStateScript } from '../server/contact-delivery.js';
const env = { SUPABASE_SECRET_KEY: 'sb_secret_testOnly', VITE_SUPABASE_URL: 'https://test.supabase.co', RATE_LIMIT_SECRET: 'x'.repeat(32), RESEND_API_KEY: 'test-only' };
const data = { name: 'Example', email: 'test@example.org', project: 'Etwas anderes', budget: '', message: 'Test message only.' };
const payload = { from: 'from@example.org', to: ['to@example.org'], text: data.message };
function fixture() {
  const records = new Map(), calls = [];
  const f = { records, calls, time: 100000, dbStatus: 201, emailOk: true, emailId: 'receipt', failDb: false, failMail: false, failPhase: '', blockDb: null };
  f.redis = async args => {
    if (args[0] === 'SET') {
      assert.deepEqual(args.slice(3), ['NX']); // permanent deduplication tombstone
      if (records.has(args[1])) return null;
      records.set(args[1], args[2]); return 'OK';
    }
    if (args[0] === 'GET') return records.get(args[1]) ?? null;
    assert.equal(args[1], replaceStateScript);
    if (JSON.parse(args[5]).phase === f.failPhase) throw Error('Redis secret error');
    if (records.get(args[3]) !== args[4]) return 0;
    records.set(args[3], args[5]); return 1;
  };
  f.fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (url.includes('/rest/v1/')) {
      assert.equal(options.headers.Prefer, 'return=minimal');
      assert.equal(options.headers.apikey, env.SUPABASE_SECRET_KEY);
      assert.equal(options.headers.Authorization, undefined);
      assert.equal(options.redirect, 'error');
      assert.deepEqual(JSON.parse(options.body), data);
      if (f.blockDb) await f.blockDb;
      if (f.failDb) throw Error('private infrastructure details');
      return { status: f.dbStatus };
    }
    if (f.failMail) throw Error('email timeout');
    return { ok: f.emailOk, json: async () => ({ id: f.emailId }) };
  };
  f.run = overrides => deliverContact({ env, data, payload, config: storageConfig(env), id: 'test-request', redis: f.redis, fetchImpl: f.fetchImpl, now: () => f.time, ...overrides });
  return f;
}
test('storage precedes mail; completed retry never sends or inserts again', async () => {
  const f = fixture();
  assert.equal((await f.run()).code, 200);
  assert.equal((await f.run()).code, 200);
  assert.equal(f.calls.length, 2);
  assert.ok(f.calls[0].url.includes('/rest/v1/'));
  assert.equal(f.calls[1].url, 'https://api.resend.com/emails');
  const stored = [...f.records.values()].join('');
  for (const value of [data.email, data.message, env.SUPABASE_SECRET_KEY, env.RESEND_API_KEY]) assert.ok(!stored.includes(value));
});
test('same request ID with modified payload or destination is rejected', async () => {
  const f = fixture(); await f.run();
  assert.equal((await f.run({ data: { ...data, name: 'Changed' } })).code, 409);
  assert.equal((await f.run({ payload: { ...payload, to: ['other@example.org'] } })).code, 409);
  assert.equal(f.calls.length, 2);
});
test('concurrent submissions reserve only one database insert', async () => {
  const f = fixture(); let release;
  f.blockDb = new Promise(resolve => { release = resolve; });
  const first = f.run();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal((await f.run()).code, 503);
  release(); assert.equal((await first).code, 200);
  assert.equal(f.calls.length, 2);
});
test('storage errors and timeouts never trigger mail or a blind insert retry', async () => {
  for (const fault of [403, 500, 'timeout']) {
    const f = fixture(); f.dbStatus = fault; f.failDb = fault === 'timeout';
    const r = await f.run(); assert.equal(r.code, 503);
    f.failDb = false; f.dbStatus = 201;
    assert.equal((await f.run()).code, 503);
    assert.equal(f.calls.length, 1);
    assert.ok(!JSON.stringify(r).includes('private infrastructure'));
  }
});
test('Redis outage before reservation prevents all delivery', async () => {
  const f = fixture();
  assert.equal((await f.run({ redis: async () => { throw Error('outage'); } })).code, 503);
  assert.equal(f.calls.length, 0);
});
test('lost storage acknowledgement in Redis blocks reinsertion', async () => {
  const f = fixture(); f.failPhase = 'stored';
  assert.equal((await f.run()).code, 503);
  f.failPhase = '';
  assert.equal((await f.run()).code, 503);
  assert.equal(f.calls.length, 1);
});
test('mail rejection, missing receipt and timeout can retry mail only with stable idempotency key', async () => {
  for (const fault of ['rejected', 'receipt', 'timeout']) {
    const f = fixture(); f.emailOk = fault !== 'rejected'; f.emailId = fault === 'receipt' ? undefined : 'receipt'; f.failMail = fault === 'timeout';
    assert.notEqual((await f.run()).code, 200);
    f.emailOk = true; f.emailId = 'receipt'; f.failMail = false;
    assert.equal((await f.run()).code, 200);
    assert.equal(f.calls.filter(c => c.url.includes('/rest/v1/')).length, 1);
    assert.equal(f.calls[1].options.headers['Idempotency-Key'], f.calls[2].options.headers['Idempotency-Key']);
  }
});
test('mail replay stops before provider idempotency expires', async () => {
  const f = fixture(); f.failMail = true; await f.run();
  f.time += 23 * 60 * 60 * 1000; f.failMail = false;
  assert.equal((await f.run()).code, 503); assert.equal(f.calls.length, 2);
});
test('failed done persistence never reports success; mail retry retains key', async () => {
  const f = fixture(); f.failPhase = 'done';
  assert.equal((await f.run()).code, 503);
  f.failPhase = ''; assert.equal((await f.run()).code, 200);
  assert.equal(f.calls.length, 3);
  assert.equal(f.calls[1].options.headers['Idempotency-Key'], f.calls[2].options.headers['Idempotency-Key']);
});
test('server configuration rejects public keys and unsafe URLs', () => {
  for (const key of ['', 'sb_publishable_test', 'eyJserviceRole']) assert.throws(() => storageConfig({ ...env, SUPABASE_SECRET_KEY: key }));
  for (const url of ['http://example.org', 'https://user:pass@example.org', 'https://example.org/path', 'https://example.org/?secret=x']) assert.throws(() => storageConfig({ ...env, SUPABASE_URL: url }));
});

test('lost reservation acknowledgement cannot cause a second INSERT', async () => {
  const f = fixture(); const redis = f.redis;
  assert.equal((await f.run({ redis: async args => {
    const result = await redis(args);
    if (args[0] === 'SET') throw Error('response lost');
    return result;
  } })).code, 503);
  assert.equal((await f.run()).code, 503);
  assert.equal(f.calls.length, 0);
});
test('corrupt persisted state fails closed without leaking its contents', async () => {
  const f = fixture(); await f.run();
  const key = [...f.records.keys()][0];
  f.records.set(key, 'private-corrupt-state');
  const r = await f.run();
  assert.equal(r.code, 503);
  assert.ok(!JSON.stringify(r).includes('private-corrupt-state'));
  assert.equal(f.calls.length, 2);
});
test('pending mail clock is retained and is not extended by retries', async () => {
  const f = fixture(); f.failMail = true;
  await f.run(); const started = JSON.parse([...f.records.values()][0]).mailStartedAt;
  f.time += 60 * 60 * 1000;
  await f.run();
  assert.equal(JSON.parse([...f.records.values()][0]).mailStartedAt, started);
  assert.equal(f.calls.filter(c => c.url.includes('/rest/v1/')).length, 1);
});
