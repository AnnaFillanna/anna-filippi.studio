import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createLegalHandler, parseEnvelope } from '../api/legal.js';
const env = { IT_RECHT_API_TOKEN: 'testOnlyToken', UPSTASH_REDIS_REST_URL: 'https://storage.example', UPSTASH_REDIS_REST_TOKEN: 'storageTestToken' };
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const base = { api_version: '1.0', user_auth_token: env.IT_RECHT_API_TOKEN, action: 'push', rechtstext_type: 'impressum', rechtstext_title: 'Testtitel', rechtstext_language: 'de', rechtstext_country: 'DE', rechtstext_text: 'TESTDATEN – keine Rechtstexte.\nZweite Zeile & Ä.' };
const envelope = (overrides = {}) => '<api>'+Object.entries({...base,...overrides}).filter(([,v])=>v!==undefined).map(([k,v])=>`<${k}>${escape(v)}</${k}>`).join('')+'</api>';
function storage() {
  const records = new Map(); const calls=[];
  return { records, calls, fetchImpl: async (url, options) => {
    calls.push({url, options});
    const [cmd,key,value] = JSON.parse(options.body);
    if(cmd==='SET') records.set(key,value);
    return {ok:true, json:async()=>({result:cmd==='SET'?'OK':records.get(key)??null})};
  }};
}
async function request(handler, body=envelope(), method='POST', url='/api/legal', headers={'content-type':'text/xml; charset=utf-8'}) {
  const res={headers:{}, setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;}, send(v){this.body=v;return this;},json(v){this.body=v;return this;}};
  await handler({method,url,headers,body},res); return res;
}
function errorCode(response, code) { assert.match(response.body, new RegExp(`<error>${code}</error>`)); assert.doesNotMatch(response.body, /<status>success/); }

test('version aliases and single-site account use the documented envelope', async()=>{
 const handler=createLegalHandler({env,fetchImpl:storage().fetchImpl});
 for(const action of ['getversion','version','getaccountlist']) {
  const r=await request(handler,envelope({action})); assert.match(r.body,/<status>success<\/status>/); assert.equal(r.headers['Content-Type'],'text/xml; charset=utf-8');
  if(action==='getaccountlist') assert.match(r.body, /<accountid>0<\/accountid><accountname\/>/);
 }
});
test('strict parsing rejects malformed XML, DTDs, entities, duplicates and nested markup',()=>{
 for(const xml of ['', '<api>', '<api/><api/>', '<api a="1"/>', '<api><x><y/></x></api>', '<api><x/><x/></api>', '<!DOCTYPE api [<!ENTITY x SYSTEM "file:///etc/passwd">]><api>&x;</api>', '<api><x>&unknown;</x></api>', '<api><x>\u0000</x></api>', '<api></other>', '<api><x>text</api>']) assert.throws(()=>parseEnvelope(xml), {code:12},xml);
 const parsed=parseEnvelope('<api><text><![CDATA[<b>literal</b>]]>&amp;&#13;Ä</text></api>'); assert.equal(parsed.text,'<b>literal</b>&\rÄ');
});
test('validation returns documented codes without writing or exposing tokens',async()=>{
 const store=storage(); const handler=createLegalHandler({env,fetchImpl:store.fetchImpl});
 const cases = [ [{user_auth_token:'wrong'},3], [{user_auth_token:undefined},3], [{api_version:'2'},1], [{action:'delete'},10], [{user_account_id:'another'},11], [{rechtstext_type:'agb'},4], [{rechtstext_title:''},18], [{rechtstext_language:undefined},9], [{rechtstext_language:'en'},82], [{rechtstext_country:'AT'},17], [{rechtstext_text:' '},5] ];
 for(const [fields,code] of cases) { const r=await request(handler,envelope(fields)); errorCode(r,code); assert.ok(!r.body.includes(env.IT_RECHT_API_TOKEN)); }
 errorCode(await request(handler,'<api>'),12); assert.equal(store.calls.length,0);
});
test('push persists only public text, survives new handler instances and replaces atomically',async()=>{
 const store=storage(); const handler=()=>createLegalHandler({env,fetchImpl:store.fetchImpl});
 for(const type of ['impressum','datenschutz']) {
  const r=await request(handler(),envelope({rechtstext_type:type,rechtstext_html:'<script>alert(1)</script>'}));
  assert.match(r.body,new RegExp(`<target_url>https://annafilippi.studio/${type}</target_url>`));
  const read=await request(handler(),undefined,'GET',`/api/legal?type=${type}`);
  assert.equal(read.code,200); assert.equal(read.body.text,base.rechtstext_text); assert.equal(read.headers['Cache-Control'],'no-store');
 }
 await request(handler(),envelope({rechtstext_text:'Neue vollständige Testversion'}));
 assert.equal((await request(handler(),undefined,'GET','/api/legal?type=impressum')).body.text,'Neue vollständige Testversion');
 assert.equal(store.records.size,2);
 for(const value of store.records.values()) { assert.ok(!value.includes('Token')); assert.ok(!value.includes('<script>')); }
 assert.equal(JSON.parse(store.calls[0].options.body).length,3); // No expiry/TTL.
});
test('storage/config failures never acknowledge a transfer',async()=>{
 errorCode(await request(createLegalHandler({env:{}})),80);
 errorCode(await request(createLegalHandler({env:{IT_RECHT_API_TOKEN:env.IT_RECHT_API_TOKEN}})),80);
 for(const fetchImpl of [async()=>{throw new Error('secret infrastructure detail');}, async()=>({ok:false}), async()=>({ok:true,json:async()=>({error:'quota'})}), async()=>({ok:true,json:async()=>({result:null})})]) {
  const r=await request(createLegalHandler({env,fetchImpl})); errorCode(r,50); assert.ok(!r.body.includes('secret infrastructure'));
 }
});
test('public reads handle missing text, outage and unknown types',async()=>{
 const handler=createLegalHandler({env,fetchImpl:storage().fetchImpl});
 assert.equal((await request(handler,undefined,'GET','/api/legal?type=impressum')).code,404);
 assert.equal((await request(handler,undefined,'GET','/api/legal?type=other')).code,400);
 assert.equal((await request(createLegalHandler({env:{}}),undefined,'GET','/api/legal?type=impressum')).code,503);
 const r=await request(handler,undefined,'DELETE'); assert.equal(r.code,405); assert.equal(r.headers.Allow,'GET, POST');
});
test('body limits, media type and invalid UTF-8 are rejected',async()=>{
 const handler=createLegalHandler({env,fetchImpl:storage().fetchImpl});
 errorCode(await request(handler,'x'.repeat(2*1024*1024+1)),12);
 errorCode(await request(handler,Buffer.from([0xff])),12);
 errorCode(await request(handler,envelope(),'POST','/api/legal',{'content-type':'application/json'}),12);
 const stream=Readable.from([envelope({action:'getversion'})]); Object.assign(stream,{method:'POST',url:'/api/legal',headers:{'content-type':'text/xml'}});
 let output=''; await handler(stream,{setHeader(){},status(){return this;},send(s){output=s;}}); assert.match(output,/<status>success/);
});

test('existing Production secret alias works and the canonical token takes precedence', async () => {
  for (const canonical of [undefined, 'canonicalTestToken']) {
    const store = storage();
    const handler = createLegalHandler({
      env: { ...env, UPSTASH_REDIS_REST_TOKEN: canonical, UPSPLASH_REDIS_REST_TOKEN: 'legacyTestToken' },
      fetchImpl: store.fetchImpl,
    });
    const response = await request(handler, undefined, 'GET', '/api/legal?type=datenschutz');
    assert.equal(response.code, 404); // Configuration succeeded; no document in this test store.
    assert.equal(store.calls[0].options.headers.Authorization, `Bearer ${canonical || 'legacyTestToken'}`);
  }
});
