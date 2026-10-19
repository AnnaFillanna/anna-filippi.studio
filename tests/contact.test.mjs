import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/contact.js";
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
  CONTACT_FROM: "test@example.org",
  CONTACT_TO: "owner@example.org",
  RESEND_API_KEY: "test",
  CONTACT_ALLOWED_ORIGINS: "https://anna-filippi.studio",
  UPSTASH_REDIS_REST_URL: "https://redis.example.org",
  UPSTASH_REDIS_REST_TOKEN: "test",
  RATE_LIMIT_SECRET: "x".repeat(32),
};
async function request(
  overrides = {},
  responses = [{ result: 1 }, { id: "email-test" }],
) {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  Object.assign(process.env, env);
  let calls = 0;
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
  globalThis.fetch = async () => {
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
          origin: "https://anna-filippi.studio",
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
    return { ...res, calls };
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
