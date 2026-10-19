import { createHash, timingSafeEqual } from 'node:crypto';
import sax from 'sax';

const LIMIT = 2 * 1024 * 1024;
const TYPES = new Set(['impressum', 'datenschutz']);
const ORIGIN = 'https://annafilippi.studio';
const escapeXml = value => String(value).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]);
class ProtocolError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new ProtocolError(code, message); };

// Strict flat LTI envelope. No DTDs, external entities, nested markup or duplicate fields.
export function parseEnvelope(xml) {
  if (typeof xml !== 'string' || Buffer.byteLength(xml) > LIMIT || /<!DOCTYPE|<!ENTITY/i.test(xml) || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/u.test(xml)) fail(12, 'Invalid XML.');
  const fields = Object.create(null);
  const parser = sax.parser(true, { strictEntities: true, trim: false, normalize: false });
  let depth = 0, rootSeen = false, current = '';
  parser.onopentag = node => {
    if (Object.keys(node.attributes).length || depth > 1) fail(12, 'Invalid XML structure.');
    if (depth === 0) {
      if (rootSeen || node.name !== 'api') fail(12, 'Expected one api root element.');
      rootSeen = true;
    } else {
      if (Object.hasOwn(fields, node.name)) fail(12, 'Duplicate XML field.');
      current = node.name;
      fields[current] = '';
    }
    depth++;
  };
  const append = text => {
    if (depth === 2) fields[current] += text;
    else if (text.trim()) fail(12, 'Unexpected XML text.');
  };
  parser.ontext = append;
  parser.oncdata = append;
  parser.onclosetag = () => { depth--; current = ''; };
  parser.ondoctype = () => fail(12, 'DTDs are not supported.');
  parser.onprocessinginstruction = instruction => {
    if (instruction.name !== 'xml' || rootSeen || /encoding\s*=\s*['"](?!utf-8['"])/i.test(instruction.body)) fail(12, 'Only UTF-8 XML is supported.');
  };
  try { parser.write(xml).close(); } catch { fail(12, 'Invalid XML.'); }
  if (!rootSeen || depth !== 0) fail(12, 'Invalid XML.');
  return fields;
}

async function readBody(req) {
  let buffer;
  if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) buffer = Buffer.from(req.body);
  else if (req.body !== undefined && req.body !== null) fail(12, 'Expected an XML body.');
  else {
    const chunks = []; let size = 0;
    for await (const chunk of req) {
      const data = Buffer.from(chunk); size += data.length;
      if (size > LIMIT) fail(12, 'Request exceeds the 2 MiB limit.');
      chunks.push(data);
    }
    buffer = Buffer.concat(chunks);
  }
  if (buffer.length > LIMIT) fail(12, 'Request exceeds the 2 MiB limit.');
  try { return new TextDecoder('utf-8', { fatal: true }).decode(buffer); }
  catch { fail(12, 'Expected UTF-8 XML.'); }
}

function authenticated(received, expected) {
  const digest = value => createHash('sha256').update(value).digest();
  return typeof received === 'string' && timingSafeEqual(digest(received), digest(expected));
}
function storageConfig(env) {
  let url;
  try { url = new URL(env.UPSTASH_REDIS_REST_URL); } catch { fail(80, 'Configure Upstash Redis storage in Vercel.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !env.UPSTASH_REDIS_REST_TOKEN) fail(80, 'Invalid storage configuration.');
  const prefix = env.IT_RECHT_STORAGE_PREFIX || 'legal:annafilippi.studio';
  if (!/^[a-zA-Z0-9:_.-]{1,100}$/.test(prefix)) fail(80, 'Invalid storage prefix.');
  return { url: url.href, token: env.UPSTASH_REDIS_REST_TOKEN, prefix };
}
async function command(config, fetchImpl, args) {
  const response = await fetchImpl(config.url, {
    method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args), signal: AbortSignal.timeout(8000), redirect: 'error',
  });
  if (!response.ok) throw new Error('Storage unavailable');
  const data = await response.json();
  if (!data || data.error || !Object.hasOwn(data, 'result')) throw new Error('Storage rejected command');
  return data.result;
}
function xmlResponse(res, inner) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><response>${inner}<meta_shopversion>1.0</meta_shopversion><meta_modulversion>1.0.0</meta_modulversion></response>`);
}

export function createLegalHandler({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Public read API for this website, separate from the documented LTI XML POST protocol.
    if (req.method === 'GET') {
      const type = new URL(req.url, ORIGIN).searchParams.get('type');
      if (!TYPES.has(type)) return res.status(400).json({ error: 'Unbekannter Rechtstext.' });
      try {
        const config = storageConfig(env);
        const stored = await command(config, fetchImpl, ['GET', `${config.prefix}:${type}:de:DE`]);
        if (stored === null) return res.status(404).json({ error: 'Der Rechtstext wurde noch nicht übertragen.' });
        const document = JSON.parse(stored);
        if (document.type !== type || typeof document.title !== 'string' || typeof document.text !== 'string' || !document.text.trim()) throw new Error('Invalid stored document');
        return res.status(200).json({ type, title: document.title, text: document.text, updatedAt: document.updatedAt });
      } catch { return res.status(503).json({ error: 'Der Rechtstext ist derzeit nicht abrufbar. Bitte versuchen Sie es später erneut.' }); }
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed.' });
    }
    try {
      const contentType = req.headers['content-type'] || '';
      if (!/^text\/xml(?:\s*;|$)/i.test(contentType)) fail(12, 'Send UTF-8 XML using Content-Type text/xml.');
      const fields = parseEnvelope(await readBody(req));
      if (!env.IT_RECHT_API_TOKEN) fail(80, 'Configure the integration token in Vercel.');
      if (!authenticated(fields.user_auth_token, env.IT_RECHT_API_TOKEN)) fail(3, 'The authentication token is invalid.');
      if (fields.api_version !== '1.0') fail(1, 'Unsupported API version.');
      const success = extra => xmlResponse(res, `<status>success</status>${extra}`);
      // Both spellings occur in the official specification.
      if (fields.action === 'getversion' || fields.action === 'version') return success('');
      if (fields.action === 'getaccountlist') return success('<account><accountid>0</accountid><accountname/><locales><locale>de</locale></locales><countries><country>DE</country></countries></account>');
      if (fields.action !== 'push') fail(10, 'Unsupported action.');
      if (fields.user_account_id && fields.user_account_id !== '0') fail(11, 'Unknown account.');
      if (!TYPES.has(fields.rechtstext_type)) fail(4, 'Only impressum and datenschutz are supported.');
      if (!fields.rechtstext_title?.trim()) fail(18, 'Missing legal text title.');
      if (!fields.rechtstext_language) fail(9, 'Missing language.');
      if (fields.rechtstext_language !== 'de') fail(82, 'Only German legal texts are supported.');
      if (fields.rechtstext_country !== 'DE') fail(17, 'Only country DE is supported.');
      if (!fields.rechtstext_text?.trim()) fail(5, 'Missing plain legal text.');
      const config = storageConfig(env);
      const type = fields.rechtstext_type;
      const document = { type, title: fields.rechtstext_title, text: fields.rechtstext_text, updatedAt: new Date().toISOString() };
      try {
        // Atomic replacement without TTL. Never store the authentication token or request envelope.
        const result = await command(config, fetchImpl, ['SET', `${config.prefix}:${type}:de:DE`, JSON.stringify(document)]);
        if (result !== 'OK') throw new Error('Write not acknowledged');
      } catch { fail(50, 'Legal text storage failed. Check the Redis connection and quota, then retry the transfer.'); }
      return success(`<target_url>${ORIGIN}/${type}</target_url>`);
    } catch (error) {
      const known = error instanceof ProtocolError;
      return xmlResponse(res, `<status>error</status><error>${known ? error.code : 99}</error><error_message>${escapeXml(known ? error.message : 'Unexpected integration error.')}</error_message>`);
    }
  };
}
export default createLegalHandler();
