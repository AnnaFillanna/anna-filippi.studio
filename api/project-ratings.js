import { createHmac } from 'node:crypto';

// Explicit allowlist: FilliCat is in development and must not accept votes.
export const ratedProjects = ['dana', 'mamma-mia', 'kavro', 'velora'];
const unavailable = 'Bewertungen sind derzeit nicht verfügbar. Bitte versuche es später erneut.';
const origin = 'https://annafilippi.studio';
export const rateScript = `local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n`;
export const voteScript = `
local values=redis.call('HMGET',KEYS[1],'count','sum',ARGV[1])
local count=tonumber(values[1] or '0')
local sum=tonumber(values[2] or '0')
local previous=tonumber(values[3] or '0')
if not count or not sum or not previous or count<0 or count%1~=0 or sum%1~=0 or sum<count or sum>count*5 or previous<0 or previous>5 or previous%1~=0 then return redis.error_reply('Invalid rating data') end
local vote=tonumber(ARGV[2])
local created=0
if vote>0 and previous==0 then
  count=count+1
  sum=sum+vote
  previous=vote
  redis.call('HSET',KEYS[1],'count',count,'sum',sum,ARGV[1],vote)
  created=1
end
return {count,sum,previous,created}`;

function configuration(env) {
  const url = new URL(env.UPSTASH_REDIS_REST_URL);
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.UPSPLASH_REDIS_REST_TOKEN;
  const secret = env.PROJECT_RATINGS_SECRET || env.RATE_LIMIT_SECRET;
  if ((env.PROJECT_RATINGS_ENABLED ?? 'true') !== 'true' || url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !token || typeof secret !== 'string' || secret.length < 32) throw new Error('Ratings not configured');
  const allowedOrigins = (env.PROJECT_RATINGS_ALLOWED_ORIGINS || origin).split(',').map(value => value.trim());
  return { url: url.href, token, secret, allowedOrigins };
}

export function createRatingsHandler({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, body) => res.status(status).json(body);
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(405, { message: 'Diese Methode ist nicht erlaubt.' });
    }
    let project, vote = 0;
    if (req.method === 'GET') {
      const params = new URL(req.url, origin).searchParams;
      if (params.getAll('project').length !== 1) return send(400, { message: 'Bitte wähle ein Projekt.' });
      project = params.get('project');
    } else {
      if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return send(415, { message: 'Bitte sende JSON.' });
      if (Number(req.headers['content-length']) > 512) return send(413, { message: 'Die Anfrage ist zu groß.' });
      try {
        const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        if (!raw || Buffer.byteLength(raw) > 512) return send(413, { message: 'Die Anfrage ist zu groß.' });
        const body = JSON.parse(raw);
        if (!body || Array.isArray(body) || Object.keys(body).some(key => !['project', 'stars'].includes(key))) throw new Error('Invalid body');
        project = body.project;
        vote = body.stars;
        if (!Number.isInteger(vote) || vote < 1 || vote > 5) throw new Error('Invalid vote');
      } catch { return send(400, { message: 'Bitte wähle zwischen 1 und 5 Sternen.' }); }
    }
    if (!ratedProjects.includes(project)) return send(403, { message: 'Dieses Projekt kann derzeit nicht bewertet werden.' });
    let config;
    try { config = configuration(env); } catch { return send(503, { message: unavailable }); }
    if (req.method === 'POST' && !config.allowedOrigins.includes(req.headers.origin)) return send(403, { message: 'Diese Anfrage ist nicht erlaubt.' });
    // Vercel overwrites this header; never use caller-supplied X-Forwarded-For.
    const ip = req.headers['x-vercel-forwarded-for'] || (env.VERCEL ? '' : req.socket?.remoteAddress);
    if (typeof ip !== 'string' || !ip || ip.length > 200) return send(503, { message: unavailable });
    const digest = value => createHmac('sha256', config.secret).update(`project-ratings:v1:${value}`).digest('hex');
    const voter = `v:${digest(`${project}:${ip}`)}`;
    async function redis(args) {
      const response = await fetchImpl(config.url, {
        method: 'POST', headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(args), redirect: 'error', signal: AbortSignal.timeout(4000),
      });
      if (!response.ok) throw new Error('Storage unavailable');
      const result = await response.json();
      if (!result || result.error || !Object.hasOwn(result, 'result')) throw new Error('Storage unavailable');
      return result.result;
    }
    try {
      if (req.method === 'POST') {
        const attempts = await redis(['EVAL', rateScript, '1', `ratings:v1:rate:${digest(ip)}`]);
        if (!Number.isInteger(attempts) || attempts < 1) throw new Error('Invalid rate limit');
        if (attempts > 10) {
          res.setHeader('Retry-After', '600');
          return send(429, { message: 'Zu viele Versuche. Bitte warte 10 Minuten.' });
        }
      }
      // One atomic operation handles concurrent requests and acknowledgement-loss retries.
      const values = await redis(['EVAL', voteScript, '1', `ratings:v1:project:${project}`, voter, String(vote)]);
      if (!Array.isArray(values) || values.length !== 4) throw new Error('Invalid result');
      const [count, sum, myVote, created] = values;
      if (![count, sum, myVote, created].every(Number.isSafeInteger) || count < 0 || sum < count || sum > count * 5 || myVote < 0 || myVote > 5 || ![0, 1].includes(created) || (myVote > 0 && count === 0) || (vote > 0 && myVote === 0)) throw new Error('Invalid result');
      const summary = { project, count, average: count ? sum / count : null, myVote: myVote || null };
      if (vote > 0 && myVote !== vote) return send(409, { ...summary, message: 'Für dieses Projekt wurde aus deinem Netzwerk bereits eine Bewertung abgegeben.' });
      return send(200, { ...summary, ...(vote > 0 ? { message: created ? 'Vielen Dank für deine Bewertung!' : 'Deine Bewertung wurde bereits gespeichert.' } : {}) });
    } catch { return send(503, { message: unavailable }); }
  };
}

export default createRatingsHandler();
