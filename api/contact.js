import { createHmac, createHash } from 'node:crypto';

const projects = ['Website / Onlineshop', 'Software / Web-App', 'Produktfotografie', 'Etwas anderes'];
const budgets = ['', 'Bis 500 €', '500–1.500 €', '1.500–3.000 €', 'Über 3.000 €', 'Noch offen / Ich brauche Beratung'];
const email = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const unavailable = 'Der Formularversand ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut oder nutzen Sie WhatsApp.';
const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n";

export default async function handler(req, res) {
  const send = (code, message) => res.status(code).json({ ok: code === 200, ...(message ? { message } : {}) });
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, 'Bitte verwenden Sie das Anfrageformular.'); }
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(415, 'Ungültiges Anfrageformat.');
  const env = process.env;
  const redisToken = env.UPSTASH_REDIS_REST_TOKEN || env.UPSPLASH_REDIS_REST_TOKEN;
  const required = ['RESEND_API_KEY', 'CONTACT_FROM', 'CONTACT_TO', 'CONTACT_ALLOWED_ORIGINS', 'UPSTASH_REDIS_REST_URL', 'RATE_LIMIT_SECRET'];
  if (required.some(key => !env[key]) || !redisToken || env.CONTACT_ENABLED !== 'true' || env.RATE_LIMIT_SECRET.length < 32) return send(503, unavailable);
  const origins = env.CONTACT_ALLOWED_ORIGINS.split(',').map(value => value.trim());
  if (!origins.includes(req.headers.origin)) return send(403, 'Diese Anfrage ist nicht erlaubt.');
  let data;
  try {
    if (Number(req.headers['content-length']) > 16000) return send(413, 'Ihre Anfrage ist zu lang.');
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (!raw || Buffer.byteLength(raw) > 16000) return send(413, 'Ihre Anfrage ist zu lang.');
    data = JSON.parse(raw);
  } catch { return send(400, 'Bitte prüfen Sie Ihre Eingaben.'); }
  if (!data || Array.isArray(data) || typeof data !== 'object') return send(400, 'Bitte prüfen Sie Ihre Eingaben.');
  if (typeof data.website !== 'string' || data.website.trim()) return send(400, 'Die Anfrage konnte nicht verarbeitet werden.');
  const limits = { name: 100, email: 254, project: 80, budget: 80, message: 5000 };
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof data[key] !== 'string' || data[key].length > limit || /\u0000/.test(data[key])) return send(400, 'Bitte prüfen Sie die Länge und den Inhalt Ihrer Eingaben.');
    data[key] = data[key].trim();
  }
  if (!data.name || /[\r\n]/.test(data.name) || !email.test(data.email) || !projects.includes(data.project) || !budgets.includes(data.budget) || data.message.length < 10) return send(400, 'Bitte geben Sie einen Namen, eine gültige E-Mail-Adresse, ein Projekt und mindestens 10 Zeichen Beschreibung ein.');
  const id = req.headers['idempotency-key'];
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/i.test(id)) return send(400, 'Bitte laden Sie das Formular neu.');
  // Vercel overwrites this header. Never trust arbitrary X-Forwarded-For values.
  const ip = req.headers['x-vercel-forwarded-for'] || (env.VERCEL ? '' : req.socket?.remoteAddress);
  if (typeof ip !== 'string' || !ip) return send(503, unavailable);
  try {
    const digest = createHmac('sha256', env.RATE_LIMIT_SECRET).update(ip).digest('hex');
    const rate = await fetch(env.UPSTASH_REDIS_REST_URL, {
      method: 'POST', headers: { Authorization: `Bearer ${redisToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', script, '1', `contact:rate:${digest}`, '600']), signal: AbortSignal.timeout(4000),
    });
    const counter = await rate.json();
    if (!rate.ok || counter.error || !Number.isInteger(counter.result)) return send(503, unavailable);
    if (counter.result > 5) { res.setHeader('Retry-After', '600'); return send(429, 'Zu viele Anfragen. Bitte warten Sie 10 Minuten und versuchen Sie es erneut.'); }
    const payload = {
      from: env.CONTACT_FROM, to: [env.CONTACT_TO], reply_to: data.email,
      subject: `Neue Projektanfrage · ${data.project}`,
      text: `Name: ${data.name}\nE-Mail: ${data.email}\nProjekt: ${data.project}\nBudget (unverbindlich): ${data.budget || 'Keine Angabe'}\n\n${data.message}`,
    };
    const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact/${id}/${hash}` },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(12000),
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id) return send(502, 'Der Versand konnte nicht bestätigt werden. Bitte versuchen Sie es erneut.');
    return send(200);
  } catch { return send(503, unavailable); }
}
