// Server-only module. Never import from src/ or expose credentials through VITE_.
import { createHash, createHmac } from 'node:crypto';

export const controlKey = 'contact:control:enabled';
// Atomic within this Redis script; not a cross-region linearizability guarantee.
export const reserveScript = "if redis.call('GET',KEYS[1]) ~= 'true' then return -1 end; if redis.call('SET',KEYS[2],ARGV[1],'NX') then return 1 end; return 0";
export const mailGateScript = "if redis.call('GET',KEYS[1]) == 'true' then return 1 end; return 0";
const paused = { code: 503, message: 'Der Formularversand ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut.' };

export const replaceStateScript = "if redis.call('GET',KEYS[1]) == ARGV[1] then redis.call('SET',KEYS[1],ARGV[2]); return 1 end; return 0";
const retryMessage = 'Die Verarbeitung konnte nicht vollständig bestätigt werden. Bitte versuche es mit unveränderten Angaben erneut.';
const reviewMessage = 'Der Eingang muss geprüft werden. Bitte kontaktiere mich per E-Mail oder WhatsApp, statt die Anfrage neu abzusenden.';

export function storageConfig(env) {
  const url = new URL(env.SUPABASE_URL || env.VITE_SUPABASE_URL);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('Invalid storage configuration');
  if (!/^sb_secret_[A-Za-z0-9_-]+$/.test(env.SUPABASE_SECRET_KEY || '')) throw new Error('Missing server secret');
  return { endpoint: new URL('/rest/v1/kontaktanfragen', url).href, key: env.SUPABASE_SECRET_KEY };
}

export async function deliverContact({ data, id, payload, env, config, redis, fetchImpl = globalThis.fetch, now = Date.now }) {
  // Bind each request ID to the normalized form AND exact mail destination/content.
  // HMAC avoids storing PII or guessable plaintext hashes in Redis.
  const fingerprint = createHmac('sha256', env.RATE_LIMIT_SECRET).update(JSON.stringify({ data, payload, endpoint: config.endpoint })).digest('hex');
  const key = `contact:delivery:v1:${createHash('sha256').update(id).digest('hex')}`;
  const initial = JSON.stringify({ fingerprint, phase: 'storing' });
  let storageUncertain = false;
  try {
    // No expiry: an uncertain INSERT must never be blindly replayed after a TTL.
    const acquired = await redis(['EVAL', reserveScript, '2', controlKey, key, initial]);
    let raw;
    if (acquired === 1) {
      raw = initial;
      storageUncertain = true;
      // Exact allowlist; no RETURNING, .select(), count, upsert or client-controlled metadata.
      const response = await fetchImpl(config.endpoint, {
        method: 'POST',
        headers: { apikey: config.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(data), signal: AbortSignal.timeout(6000), redirect: 'error',
      });
      if (response.status !== 201) return { code: 503, message: reviewMessage };
      const stored = JSON.stringify({ fingerprint, phase: 'stored' });
      if (await redis(['EVAL', replaceStateScript, '1', key, raw, stored]) !== 1) return { code: 503, message: reviewMessage };
      raw = stored;
      storageUncertain = false;
    } else if (acquired === 0) {
      raw = await redis(['GET', key]);
    } else {
      return paused;
    }
    let state = JSON.parse(raw);
    if (!state || state.fingerprint !== fingerprint) return { code: 409, message: 'Diese Anfrage-ID wurde bereits für andere Angaben verwendet. Bitte kontaktiere mich direkt.' };
    if (state.phase === 'done') return { code: 200 };
    if (state.phase === 'storing') return { code: 503, message: reviewMessage };
    if (state.phase === 'stored') {
      const pending = JSON.stringify({ fingerprint, phase: 'mail_pending', mailStartedAt: now() });
      if (await redis(['EVAL', replaceStateScript, '1', key, raw, pending]) === 1) raw = pending;
      else raw = await redis(['GET', key]);
      state = JSON.parse(raw);
    }
    if (state?.fingerprint !== fingerprint) return { code: 503, message: reviewMessage };
    if (state.phase === 'done') return { code: 200 };
    // Resend retains idempotency keys for 24h. Leave a 1h margin; never reset this clock.
    if (state.phase !== 'mail_pending' || !Number.isFinite(state.mailStartedAt) || now() < state.mailStartedAt || now() - state.mailStartedAt >= 23 * 60 * 60 * 1000) return { code: 503, message: reviewMessage };
    const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    // Fresh check for every attempt, including retries. Never cache the switch.
    if (await redis(['EVAL', mailGateScript, '1', controlKey]) !== 1) return paused;
    const response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${id}/${hash}` },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(6000), redirect: 'error',
    });
    const result = await response.json();
    if (!response.ok || typeof result?.id !== 'string' || !result.id) return { code: 502, message: retryMessage };
    const done = JSON.stringify({ fingerprint, phase: 'done' });
    if (await redis(['EVAL', replaceStateScript, '1', key, raw, done]) !== 1 && await redis(['GET', key]) !== done) return { code: 503, message: retryMessage };
    return { code: 200 };
  } catch {
    // Never log response bodies, request data, infrastructure errors or credentials.
    return { code: 503, message: storageUncertain ? reviewMessage : retryMessage };
  }
}
