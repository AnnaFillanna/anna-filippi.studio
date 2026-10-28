import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { transformWithEsbuild } from 'vite';

const source = await readFile('src/components/ProjectRating/ratingsStore.ts', 'utf8');
const { code } = await transformWithEsbuild(source, 'ratingsStore.ts', { loader: 'ts', format: 'cjs' });
function store(fetch) {
  const context = { module: { exports: {} }, fetch, AbortSignal };
  vm.runInNewContext(code, context);
  return context.module.exports;
}
const empty = { project: 'dana', count: 0, average: null, myVote: null };
const saved = { project: 'dana', count: 1, average: 4, myVote: 4 };
const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });

test('carousel copies share one read request and subscriptions receive the same confirmed rating', async () => {
  let calls = 0, updates = 0;
  const ratings = store(async () => { calls++; return response(empty); });
  const unsubscribe = ratings.subscribe(() => updates++);
  await Promise.all([ratings.loadRating('dana'), ratings.loadRating('dana'), ratings.loadRating('dana')]);
  assert.equal(calls, 1); assert.equal(ratings.snapshot('dana').state, 'ready');
  assert.equal(ratings.snapshot('dana').rating.average, null); assert.ok(updates >= 2);
  unsubscribe();
});

test('invalid or unavailable reads never invent empty ratings and can be retried', async () => {
  for (const bad of [null, { ...empty, project: 'velora' }, { ...empty, count: -1 }, { ...saved, average: 9 }, { ...empty, average: 0 }, { ...empty, myVote: 5 }]) {
    let calls = 0;
    const ratings = store(async () => response(calls++ ? empty : bad));
    await ratings.loadRating('dana'); assert.equal(ratings.snapshot('dana').state, 'unavailable');
    assert.equal(ratings.snapshot('dana').rating, undefined);
    await ratings.loadRating('dana', true); assert.equal(ratings.snapshot('dana').state, 'ready');
  }
});

test('one pending vote is shared by all card copies and only an acknowledged vote locks the controls', async () => {
  let posts = 0, complete;
  const ratings = store(async (_url, options) => {
    if (options.method !== 'POST') return response(empty);
    posts++; return new Promise(resolve => { complete = () => resolve(response(saved)); });
  });
  await ratings.loadRating('dana');
  const first = ratings.submitRating('dana', 4);
  await ratings.submitRating('dana', 4);
  assert.equal(posts, 1); assert.equal(ratings.snapshot('dana').busy, true);
  complete(); await first;
  assert.equal(ratings.snapshot('dana').rating.myVote, 4);
  await ratings.submitRating('dana', 5); assert.equal(posts, 1);
});

test('network errors and rate limiting preserve the last summary and permit an explicit retry', async () => {
  for (const status of [429, 503, 'network']) {
    const ratings = store(async (_url, options) => {
      if (options.method !== 'POST') return response(empty);
      if (status === 'network') throw new Error('Timeout');
      return response({}, status);
    });
    await ratings.loadRating('dana'); await ratings.submitRating('dana', 4);
    const value = ratings.snapshot('dana');
    assert.equal(value.rating.myVote, null); assert.equal(value.rating.count, 0); assert.ok(!value.busy);
    assert.match(value.message, status === 429 ? /10 Minuten/ : /nicht bestätigt/);
  }
});

test('conflicts show the existing server vote; a success without a vote acknowledgement is not accepted', async () => {
  for (const conflict of [true, false]) {
    const ratings = store(async (_url, options) => options.method === 'POST' ? response(conflict ? saved : empty, conflict ? 409 : 200) : response(empty));
    await ratings.loadRating('dana'); await ratings.submitRating('dana', 5);
    const value = ratings.snapshot('dana');
    assert.equal(value.rating.myVote, conflict ? 4 : null);
    assert.match(value.message, conflict ? /bereits bewertet/ : /nicht bestätigt/);
  }
});
