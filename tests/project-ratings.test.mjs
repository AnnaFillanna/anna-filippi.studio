import test from 'node:test';
import assert from 'node:assert/strict';
import { createRatingsHandler, ratedProjects, rateScript, voteScript } from '../api/project-ratings.js';

const env = { PROJECT_RATINGS_ENABLED: 'true', UPSTASH_REDIS_REST_URL: 'https://ratings.example', UPSTASH_REDIS_REST_TOKEN: 'test-token', RATE_LIMIT_SECRET: 'test-secret-not-for-production-12345678', VERCEL: '1' };
const headers = { origin: 'https://annafilippi.studio', 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1' };
function storage() {
  const projects = new Map(), rates = new Map(), calls = [];
  return { projects, rates, calls, fetchImpl: async (url, options) => {
    calls.push({ url, options });
    const [command, script, keys, key, voter, stars] = JSON.parse(options.body);
    assert.equal(command, 'EVAL'); assert.equal(keys, '1');
    let result;
    if (script === rateScript) { result = (rates.get(key) || 0) + 1; rates.set(key, result); }
    else {
      assert.equal(script, voteScript);
      const data = projects.get(key) ?? { count: 0, sum: 0, votes: new Map() };
      let previous = data.votes.get(voter) ?? 0, created = 0;
      if (Number(stars) && !previous) { previous = Number(stars); data.count++; data.sum += previous; data.votes.set(voter, previous); created = 1; }
      projects.set(key, data); result = [data.count, data.sum, previous, created];
    }
    return { ok: true, json: async () => ({ result }) };
  } };
}
async function request(handler, { method = 'POST', body = { project: 'dana', stars: 4 }, url = '/api/project-ratings?project=dana', customHeaders = {} } = {}) {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await handler({ method, body, url, headers: { ...headers, ...customHeaders }, socket: { remoteAddress: '127.0.0.1' } }, res);
  return res;
}

test('real counts start empty, persist across handler instances and stay isolated by project', async () => {
  const store = storage(), handler = () => createRatingsHandler({ env, fetchImpl: store.fetchImpl });
  let r = await request(handler(), { method: 'GET' });
  assert.equal(r.code, 200); assert.deepEqual(r.body, { project: 'dana', count: 0, average: null, myVote: null });
  await request(handler());
  r = await request(handler(), { customHeaders: { 'x-vercel-forwarded-for': '192.0.2.2' }, body: { project: 'dana', stars: 2 } });
  assert.equal(r.code, 200); assert.equal(r.body.count, 2); assert.equal(r.body.average, 3);
  r = await request(handler(), { method: 'GET' });
  assert.equal(r.body.myVote, 4); assert.equal(r.body.count, 2);
  r = await request(handler(), { method: 'GET', url: '/api/project-ratings?project=velora' });
  assert.equal(r.body.count, 0); assert.equal(r.body.average, null);
  assert.equal(r.headers['Cache-Control'], 'no-store');
});

test('repeat and concurrent requests cannot add a second network vote; changed votes conflict', async () => {
  const store = storage(), handler = createRatingsHandler({ env, fetchImpl: store.fetchImpl });
  const results = await Promise.all(Array.from({ length: 5 }, () => request(handler)));
  assert.ok(results.every(r => r.code === 200 && r.body.count === 1 && r.body.myVote === 4));
  const conflict = await request(handler, { body: { project: 'dana', stars: 5 } });
  assert.equal(conflict.code, 409); assert.equal(conflict.body.count, 1); assert.equal(conflict.body.myVote, 4);
});

test('lost acknowledgement can be retried without a second vote', async () => {
  const store = storage(); let lose = true;
  const handler = createRatingsHandler({ env, fetchImpl: async (...args) => {
    const result = await store.fetchImpl(...args);
    if (lose && JSON.parse(args[1].body)[1] === voteScript) { lose = false; throw new Error('Timeout after write'); }
    return result;
  } });
  assert.equal((await request(handler)).code, 503);
  const r = await request(handler); assert.equal(r.code, 200); assert.equal(r.body.count, 1);
});

test('FilliCat and unknown projects are rejected for reads and writes before accessing storage', async () => {
  const store = storage(), handler = createRatingsHandler({ env, fetchImpl: store.fetchImpl });
  assert.deepEqual(ratedProjects, ['dana', 'mamma-mia', 'kavro', 'velora']);
  for (const project of ['fillicat', 'Feliket', 'unknown', '__proto__']) {
    assert.equal((await request(handler, { body: { project, stars: 5 } })).code, 403);
    assert.equal((await request(handler, { method: 'GET', url: `/api/project-ratings?project=${project}` })).code, 403);
  }
  assert.equal(store.calls.length, 0);
});

test('invalid stars, bodies, methods, content types, origins and duplicate query parameters do not reach storage', async () => {
  const store = storage(), handler = createRatingsHandler({ env, fetchImpl: store.fetchImpl });
  for (const stars of [0, 6, -1, 1.5, '5', null, true]) assert.equal((await request(handler, { body: { project: 'dana', stars } })).code, 400);
  for (const body of ['invalid json', null, [], { project: 'dana', stars: 4, extra: 'no' }]) assert.equal((await request(handler, { body })).code, 400);
  assert.equal((await request(handler, { method: 'DELETE' })).code, 405);
  assert.equal((await request(handler, { customHeaders: { 'content-type': 'text/plain' } })).code, 415);
  assert.equal((await request(handler, { customHeaders: { origin: 'https://evil.example' } })).code, 403);
  assert.equal((await request(handler, { customHeaders: { origin: undefined } })).code, 403);
  assert.equal((await request(handler, { body: 'x'.repeat(513) })).code, 413);
  assert.equal((await request(handler, { method: 'GET', url: '/api/project-ratings?project=dana&project=velora' })).code, 400);
  assert.equal(store.calls.length, 0);
});

test('missing configuration and disabled feature fail closed without fake counts or writes', async () => {
  for (const settings of [{ PROJECT_RATINGS_ENABLED: 'false' }, { PROJECT_RATINGS_ENABLED: '' }, { UPSTASH_REDIS_REST_TOKEN: '' }, { RATE_LIMIT_SECRET: 'short' }, { UPSTASH_REDIS_REST_URL: 'http://unsafe.example' }]) {
    const store = storage(), handler = createRatingsHandler({ env: { ...env, ...settings }, fetchImpl: store.fetchImpl });
    for (const method of ['GET', 'POST']) { const r = await request(handler, { method }); assert.equal(r.code, 503); assert.equal(r.body.count, undefined); }
    assert.equal(store.calls.length, 0);
  }
});

test('existing Redis and hash-secret settings work without new configuration; the legacy token alias is supported', async () => {
  const store = storage();
  const handler = createRatingsHandler({ env: { ...env, PROJECT_RATINGS_ENABLED: undefined, UPSTASH_REDIS_REST_TOKEN: undefined, UPSPLASH_REDIS_REST_TOKEN: 'test-token' }, fetchImpl: store.fetchImpl });
  const r = await request(handler);
  assert.equal(r.code, 200); assert.equal(r.body.count, 1);
});

test('storage errors or corrupt responses never report successful votes or leak secrets', async () => {
  for (const result of [{ error: 'internal test-secret' }, { result: null }, { result: [1, 9, 4, 1] }, { result: [0, 0, 4, 1] }, { result: ['1', '4', '4', '1'] }]) {
    const handler = createRatingsHandler({ env, fetchImpl: async (_url, options) => JSON.parse(options.body)[1] === rateScript
      ? { ok: true, json: async () => ({ result: 1 }) } : { ok: true, json: async () => result } });
    const r = await request(handler); assert.equal(r.code, 503); assert.ok(!JSON.stringify(r.body).includes('test-secret'));
  }
});

test('rate limits block further writes and missing trusted IP cannot be replaced with X-Forwarded-For', async () => {
  const store = storage(), handler = createRatingsHandler({ env, fetchImpl: store.fetchImpl });
  for (let i = 0; i < 10; i++) assert.equal((await request(handler)).code, 200);
  const r = await request(handler); assert.equal(r.code, 429); assert.equal(r.headers['Retry-After'], '600');
  const callCount = store.calls.length;
  assert.equal((await request(handler, { customHeaders: { 'x-vercel-forwarded-for': undefined, 'x-forwarded-for': '192.0.2.1' } })).code, 503);
  assert.equal(store.calls.length, callCount);
});

test('server storage commands use namespaced HMAC identities without raw IPs or browser identifiers', async () => {
  const store = storage(), handler = createRatingsHandler({ env, fetchImpl: store.fetchImpl });
  await request(handler);
  const commands = store.calls.map(call => JSON.parse(call.options.body));
  assert.match(commands[0][3], /^ratings:v1:rate:[a-f0-9]{64}$/);
  assert.match(commands[1][4], /^v:[a-f0-9]{64}$/);
  assert.equal(commands[1][3], 'ratings:v1:project:dana');
  assert.ok(!commands.some(command => JSON.stringify(command).includes('192.0.2.1')));
});
