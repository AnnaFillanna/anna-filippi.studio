import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";
import { reserveScript, mailGateScript } from '../server/contact-delivery.js';
const data = {
  name: "Test",
  email: "test@example.org",
  project: "Website / Onlineshop",
  budget: "",
  message: "Eine neue Website gestalten.",
  website: "",
};
const env = {
  CONTACT_ENABLED: "true",
  SUPABASE_URL: "",
  VITE_SUPABASE_URL: "",
  SUPABASE_SECRET_KEY: "",
  CONTACT_FROM: "test@example.org",
  CONTACT_TO: "owner@example.org",
  CONTACT_EMAIL_FROM: "",
  CONTACT_EMAIL_TO: "",
  RESEND_API_KEY: "test",
  CONTACT_ALLOWED_ORIGINS: "https://annafilippi.studio",
  UPSTASH_REDIS_REST_URL: "https://redis.example.org",
  UPSTASH_REDIS_REST_TOKEN: "test",
  RATE_LIMIT_SECRET: "x".repeat(32),
};
async function request(
  overrides = {},
  responses = [{ result: 1 }, { id: "email-test" }],
  envOverrides = {},
) {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  Object.assign(process.env, env, envOverrides);
  let calls = 0;
  const records = new Map();
  const externalUrls = [];
  const mails = [];
  const res = {
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(n) {
      this.code = n;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  globalThis.fetch = async (url, options) => {
    externalUrls.push(url);
    assert.ok([env.UPSTASH_REDIS_REST_URL, 'https://api.resend.com/emails'].includes(url), 'Unexpected external service');
    if (url === env.UPSTASH_REDIS_REST_URL) {
      const args = JSON.parse(options.body);
      if (args[1] === reserveScript) {
        const exists = records.has(args[4]);
        if (!exists) records.set(args[4], args[5]);
        return { ok: true, json: async () => ({ result: exists ? 0 : 1 }) };
      }
      if (args[1] === mailGateScript) return { ok: true, json: async () => ({ result: 1 }) };
      if (args[0] === 'GET') return { ok: true, json: async () => ({ result: records.get(args[1]) ?? null }) };
      if (args[0] === 'EVAL' && args[3].startsWith('contact:delivery:')) {
        const matches = records.get(args[3]) === args[4];
        if (matches) records.set(args[3], args[5]);
        return { ok: true, json: async () => ({ result: matches ? 1 : 0 }) };
      }
    }
    if (url === 'https://api.resend.com/emails') mails.push(JSON.parse(options.body));
    const body = responses[calls++];
    if (body instanceof Error) throw body;
    return { ok: !body?.error, json: async () => body };
  };
  try {
    await handler(
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://annafilippi.studio",
          "idempotency-key": "12345678-1234-1234-1234-123456789abc",
          "x-vercel-forwarded-for": "192.0.2.1",
          ...overrides.headers,
        },
        body: data,
        ...Object.fromEntries(
          Object.entries(overrides).filter(([k]) => k !== "headers"),
        ),
      },
      res,
    );
    return { ...res, calls, externalUrls, mails };
  } finally {
    globalThis.fetch = originalFetch;
    for (const k of Object.keys(process.env))
      if (!(k in originalEnv)) delete process.env[k];
    Object.assign(process.env, originalEnv);
  }
}
test("only acknowledged email returns success", async () =>
  assert.equal((await request()).body.ok, true));
test("invalid email rejected before network", async () => {
  const r = await request({ body: { ...data, email: "bad" } });
  assert.equal(r.code, 400);
  assert.equal(r.calls, 0);
});
test("honeypot never reports success", async () =>
  assert.equal(
    (await request({ body: { ...data, website: "spam" } })).code,
    400,
  ));
test("oversized message rejected", async () =>
  assert.equal(
    (await request({ body: { ...data, message: "x".repeat(5001) } })).code,
    400,
  ));
test("invalid choice rejected", async () =>
  assert.equal(
    (await request({ body: { ...data, project: "other" } })).code,
    400,
  ));
test("foreign origin rejected", async () =>
  assert.equal(
    (await request({ headers: { origin: "https://evil.example" } })).code,
    403,
  ));
test("GET rejected", async () =>
  assert.equal((await request({ method: "GET" })).code, 405));
test("shared rate limit blocks email", async () => {
  const r = await request({}, [{ result: 6 }]);
  assert.equal(r.code, 429);
  assert.equal(r.calls, 1);
});
test("redis failure fails closed", async () =>
  assert.equal((await request({}, [new Error("offline")])).code, 503));
test("provider rejection does not report success", async () =>
  assert.equal(
    (await request({}, [{ result: 1 }, { error: "rejected" }])).code,
    502,
  ));
test("missing provider receipt does not report success", async () =>
  assert.equal((await request({}, [{ result: 1 }, {}])).code, 502));


test("existing Redis secret alias supports sending", async () => {
  const r = await request({}, undefined, { UPSTASH_REDIS_REST_TOKEN: '', UPSPLASH_REDIS_REST_TOKEN: 'legacy-test' });
  assert.equal(r.code, 200);
  assert.equal(r.calls, 2);
});
test("disabled sending never contacts external services", async () => {
  const r = await request({}, undefined, { CONTACT_ENABLED: 'false' });
  assert.equal(r.code, 503);
  assert.equal(r.calls, 0);
});

test('bisherige Absender- und Empfänger-Konfiguration bleibt gültig', async () => {
  const r = await request({}, undefined, { CONTACT_EMAIL_FROM: '', CONTACT_EMAIL_TO: '' });
  assert.equal(r.code, 200);
  assert.equal(r.mails[0].from, env.CONTACT_FROM);
  assert.deepEqual(r.mails[0].to, [env.CONTACT_TO]);
  assert.equal(r.mails[0].reply_to, data.email);
});

test('neue Konfigurationsnamen haben Vorrang vor den bisherigen', async () => {
  const r = await request({}, undefined, {
    CONTACT_EMAIL_FROM: 'studio@example.org',
    CONTACT_EMAIL_TO: 'new-owner@example.org',
  });
  assert.equal(r.code, 200);
  assert.equal(r.mails[0].from, 'studio@example.org');
  assert.deepEqual(r.mails[0].to, ['new-owner@example.org']);
});

test('neue Konfigurationsnamen funktionieren auch ohne bisherige Namen', async () => {
  const r = await request({}, undefined, {
    CONTACT_EMAIL_FROM: 'studio@example.org',
    CONTACT_EMAIL_TO: 'new-owner@example.org',
    CONTACT_FROM: '',
    CONTACT_TO: '',
  });
  assert.equal(r.code, 200);
  assert.equal(r.mails[0].from, 'studio@example.org');
  assert.deepEqual(r.mails[0].to, ['new-owner@example.org']);
});

test('fehlender Absender oder Empfänger verhindert sämtliche externen Aufrufe', async () => {
  for (const overrides of [
    { CONTACT_EMAIL_FROM: '', CONTACT_FROM: '' },
    { CONTACT_EMAIL_TO: '', CONTACT_TO: '' },
    { RESEND_API_KEY: '' },
  ]) {
    const r = await request({}, undefined, overrides);
    assert.equal(r.code, 503);
    assert.equal(r.calls, 0);
    assert.ok(!r.externalUrls.some(url => url.includes('supabase')));
    assert.equal(r.mails.length, 0);
  }
});

test('API sends all normalized fields by email without database calls', async () => {
  const r = await request({ body: { ...data, name: '  Test  ', id: 'injected', status: 'erledigt' } });
  assert.equal(r.code, 200);
  assert.equal(r.mails[0].reply_to, data.email);
  for (const value of ['Name: Test', data.email, data.project, data.message, 'Keine Angabe']) assert.ok(r.mails[0].text.includes(value));
  assert.ok(!r.mails[0].text.includes('injected'));
});
test('missing or unreachable Supabase configuration cannot block contact delivery', async () => {
  for (const overrides of [{}, { SUPABASE_URL: 'https://paused.invalid', VITE_SUPABASE_URL: 'invalid', SUPABASE_SECRET_KEY: 'invalid' }]) {
    const r = await request({}, undefined, overrides);
    assert.equal(r.code, 200);
    assert.ok(r.externalUrls.every(url => [env.UPSTASH_REDIS_REST_URL, 'https://api.resend.com/emails'].includes(url)));
  }
});

test('invalid UUID, missing IP, bad budget and malformed data never reach delivery', async () => {
  for (const overrides of [
    { headers: { 'idempotency-key': '-'.repeat(36) } },
    { headers: { 'x-vercel-forwarded-for': '' } },
    { body: { ...data, budget: 'unlisted' } },
    { body: { ...data, name: 'Test\nInjected' } },
    { body: { ...data, message: '          ' } },
    { body: { ...data, email: 'a\u0000@example.org' } },
    { body: '{invalid' },
    { body: [] },
  ]) {
    const r = await request(overrides);
    assert.notEqual(r.body.ok, true);
    assert.equal(r.calls, 0);
    assert.ok(!r.externalUrls.some(url => url.includes('supabase')));
  }
});
test('allowlist rejects missing origins and non-exact production host variants', async () => {
  for (const origin of [undefined, 'null', 'https://www.annafilippi.studio',
    'https://anna-filippi.studio', 'http://annafilippi.studio',
    'https://annafilippi.studio:444', 'https://preview.annafilippi.studio',
    'https://annafilippi.studio.evil.example', 'https://evil.studio']) {
    const r = await request({ headers: { origin } });
    assert.equal(r.code, 403);
    assert.equal(r.body.ok, false);
    assert.equal(r.calls, 0);
    assert.ok(!r.externalUrls.some(url => url.includes('supabase')));
  }
});
test('explicitly configured production origin is accepted', async () => {
  const r = await request({ headers: { origin: 'https://annafilippi.studio' } }, undefined, { CONTACT_ALLOWED_ORIGINS: 'https://annafilippi.studio' });
  assert.equal(r.code, 200);
  assert.equal(r.mails.length, 1);
});
test('rate limit response never reports successful submission or writes to Supabase', async () => {
  const r = await request({}, [{ result: 6 }]);
  assert.equal(r.code, 429);
  assert.equal(r.body.ok, false);
  assert.equal(r.headers['Retry-After'], '600');
  assert.ok(!r.externalUrls.some(url => url.includes('supabase')));
});
