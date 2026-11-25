import test from 'node:test';
import assert from 'node:assert/strict';
import { deliverContact, replaceStateScript, reserveScript, mailGateScript, controlKey } from '../server/contact-delivery.js';
const env = { RATE_LIMIT_SECRET: 'x'.repeat(32), RESEND_API_KEY: 'test-only' };
const data = { name: 'Example', email: 'test@example.org', project: 'Etwas anderes', budget: '', message: 'Test message only.' };
const payload = { from: 'from@example.org', to: ['to@example.org'], reply_to: data.email, text: data.message };
function fixture() {
  const records = new Map(), calls = [];
  const f = { enabled: 'true', gateError: false, records, calls, time: 100000, emailOk: true, emailId: 'receipt', failMail: false, failPhase: '', blockMail: null };
  f.redis = async args => {
    if (args[1] === reserveScript) {
      assert.deepEqual(args.slice(2, 4), ['2', controlKey]);
      if (f.enabled !== 'true') return -1;
      if (records.has(args[4])) return 0;
      records.set(args[4], args[5]); return 1;
    }
    if (args[1] === mailGateScript) {
      assert.deepEqual(args.slice(2), ['1', controlKey]);
      if (f.gateError) throw Error('private redis failure');
      return f.enabled === 'true' ? 1 : 0;
    }
    if (args[0] === 'GET') return records.get(args[1]) ?? null;
    assert.equal(args[1], replaceStateScript);
    if (JSON.parse(args[5]).phase === f.failPhase) throw Error('Redis secret error');
    if (records.get(args[3]) !== args[4]) return 0;
    records.set(args[3], args[5]); return 1;
  };
  f.fetchImpl = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails', 'No database or other service may be contacted');
    calls.push({ url, options });
    assert.equal(options.redirect, 'error');
    if (f.blockMail) await f.blockMail;
    if (f.failMail) throw Error('private email timeout');
    return { ok: f.emailOk, json: async () => ({ id: f.emailId }) };
  };
  f.run = overrides => deliverContact({ env, data, payload, id: 'test-request', redis: f.redis, fetchImpl: f.fetchImpl, now: () => f.time, ...overrides });
  return f;
}
test('only Resend is called; completed retries never send again', async () => {
  const f = fixture();
  assert.equal((await f.run()).code, 200);
  assert.equal((await f.run()).code, 200);
  assert.equal(f.calls.length, 1);
  const stored = [...f.records.values()].join('');
  for (const value of [data.email, data.message, env.RESEND_API_KEY]) assert.ok(!stored.includes(value));
});
test('same ID with modified payload or destination is rejected', async () => {
  const f = fixture(); await f.run();
  assert.equal((await f.run({ data: { ...data, name: 'Changed' } })).code, 409);
  assert.equal((await f.run({ payload: { ...payload, to: ['other@example.org'] } })).code, 409);
  assert.equal(f.calls.length, 1);
});
test('concurrent submissions use the same Resend idempotency key', async () => {
  const f = fixture(); let release;
  f.blockMail = new Promise(resolve => { release = resolve; });
  const first = f.run(), second = f.run();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[0].options.headers['Idempotency-Key'], f.calls[1].options.headers['Idempotency-Key']);
  release();
  assert.equal((await first).code, 200); assert.equal((await second).code, 200);
});
test('Redis outage before reservation prevents all delivery', async () => {
  const f = fixture();
  assert.equal((await f.run({ redis: async () => { throw Error('outage'); } })).code, 503);
  assert.equal(f.calls.length, 0);
});
test('rejection, missing receipt and timeout retry with stable provider key', async () => {
  for (const fault of ['rejected', 'receipt', 'timeout']) {
    const f = fixture(); f.emailOk = fault !== 'rejected'; f.emailId = fault === 'receipt' ? undefined : 'receipt'; f.failMail = fault === 'timeout';
    const result = await f.run(); assert.notEqual(result.code, 200); assert.ok(!JSON.stringify(result).includes('private'));
    f.emailOk = true; f.emailId = 'receipt'; f.failMail = false;
    assert.equal((await f.run()).code, 200);
    assert.equal(f.calls[0].options.headers['Idempotency-Key'], f.calls[1].options.headers['Idempotency-Key']);
  }
});
test('mail replay stops before provider idempotency expires', async () => {
  const f = fixture(); f.failMail = true; await f.run();
  f.time += 23 * 60 * 60 * 1000; f.failMail = false;
  assert.equal((await f.run()).code, 503); assert.equal(f.calls.length, 1);
});
test('failed completion persistence never reports success; retry retains key', async () => {
  const f = fixture(); f.failPhase = 'done';
  assert.equal((await f.run()).code, 503);
  f.failPhase = ''; assert.equal((await f.run()).code, 200);
  assert.equal(f.calls.length, 2);
  assert.equal(f.calls[0].options.headers['Idempotency-Key'], f.calls[1].options.headers['Idempotency-Key']);
});
test('lost reservation acknowledgement is recoverable without a database', async () => {
  const f = fixture(); const redis = f.redis;
  assert.equal((await f.run({ redis: async args => {
    const result = await redis(args);
    if (args[1] === reserveScript) throw Error('response lost');
    return result;
  } })).code, 503);
  assert.equal(f.calls.length, 0);
  assert.equal((await f.run()).code, 200);
  assert.equal(f.calls.length, 1);
});
test('legacy and corrupt states never cause a blind replay or expose data', async () => {
  for (const legacy of ['private-corrupt-state', JSON.stringify({ fingerprint: 'legacy-bound-to-database', phase: 'done' })]) {
    const f = fixture(); await f.run();
    const key = [...f.records.keys()][0]; f.records.set(key, legacy);
    const r = await f.run(); assert.notEqual(r.code, 200);
    assert.ok(!JSON.stringify(r).includes(legacy)); assert.equal(f.calls.length, 1);
    assert.equal(f.records.get(key), legacy);
  }
});
test('pending clock is retained, including retries after an unavailable mail gate', async () => {
  const f = fixture(); f.gateError = true;
  await f.run(); const started = JSON.parse([...f.records.values()][0]).mailStartedAt;
  assert.equal(f.calls.length, 0);
  f.time += 60 * 60 * 1000; f.gateError = false; f.failMail = true;
  await f.run();
  assert.equal(JSON.parse([...f.records.values()][0]).mailStartedAt, started);
});
test('only exact true permits reservation; disabled states never send', async () => {
  for (const value of [undefined, null, '', 'false', 'TRUE', '1', ' true', 'true ', true]) {
    const f = fixture(); f.enabled = value;
    assert.equal((await f.run()).code, 503); assert.equal(f.records.size, 0); assert.equal(f.calls.length, 0);
  }
});
test('switch is checked again after reservation and before mail', async () => {
  const f = fixture(); const redis = f.redis;
  assert.equal((await f.run({ redis: async args => {
    const value = await redis(args); if (args[1] === reserveScript) f.enabled = 'false'; return value;
  } })).code, 503);
  assert.equal(f.calls.length, 0);
  f.enabled = 'true'; assert.equal((await f.run()).code, 200);
});
test('disabled switch blocks completed and pending retries', async () => {
  for (const failed of [false, true]) {
    const f = fixture(); f.failMail = failed; await f.run();
    const count = f.calls.length; f.enabled = 'false';
    assert.equal((await f.run()).code, 503); assert.equal(f.calls.length, count);
  }
});
