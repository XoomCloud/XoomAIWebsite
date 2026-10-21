import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { FORM_ID, SOURCE_URL, issueIdentity, renewIdentity, readClaim, verifySubmission, redisNonceStore, type NonceStore } from '../src/lib/form-identity';
import { identityConfig, issueResponse, verifyResponse } from '../src/lib/form-identity-http';
const secret = 'unit-test-signing-key-not-a-production-secret';
const verifierKey = 'unit-test-verifier-key-not-a-production-secret';
function store(): NonceStore { const bindings = new Map<string,string>(); return { async bind(n,h) { if(bindings.has(n)) return bindings.get(n)===h; bindings.set(n,h); return true; } }; }
function fixture(now = Date.now()) { return { ...issueIdentity(secret, now - 1000), email: 'test@example.com', submittedAt: new Date(now - 500).toISOString() }; }
function sign(c: object) { const p = Buffer.from(JSON.stringify(c)).toString('base64url'); return p + '.' + createHmac('sha256', secret).update(p).digest('base64url'); }
test('issued identity is scoped, short-lived and independently random', () => {
 const a=issueIdentity(secret),b=issueIdentity(secret),c=readClaim(a.token,secret)!;
 assert.notEqual(a.eventUuid,b.eventUuid);assert.notEqual(c.id,c.nonce);assert.equal(c.formId,FORM_ID);assert.equal(c.sourceUrl,SOURCE_URL);assert.equal(c.exp-c.iat,900);
});
test('confirmed bundle produces matching identity without exposing token or email',async()=>{
 const f=fixture(),r=await verifySubmission(f,secret,store());assert.equal(r?.eventId,'hs_form_'+f.eventUuid);assert.equal(r?.sourceUrl,SOURCE_URL);
 assert.ok(!JSON.stringify(r).includes(f.email));assert.ok(!JSON.stringify(r).includes(f.token));
});
test('concurrent identical verification is idempotent',async()=>{
 const f=fixture(),s=store(),r=await Promise.all([verifySubmission(f,secret,s),verifySubmission(f,secret,s)]);assert.equal(r.filter(Boolean).length,2);assert.deepEqual(r[0],r[1]);
});
test('tampered, malformed and oversized tokens fail',()=>{
 const f=fixture();for(const t of [f.token+'x','','a.b.c','x'.repeat(2049)])assert.equal(readClaim(t,secret),null);assert.equal(readClaim(f.token,verifierKey),null);
});
test('UUID version and variant, form, source and lifetime are enforced on signed claims',()=>{
 const c=readClaim(fixture().token,secret)!;
 for(const change of [{id:c.id.toUpperCase()},{id:'0'.repeat(36)},{id:'00000000-0000-0000-0000-000000000000'},{nonce:'bad'},{formId:'wrong'},{sourceUrl:'https://xoomai.com.au/'},{iat:c.exp},{exp:c.exp+1},{v:2}])assert.equal(readClaim(sign({...c,...change}),secret),null);
});
test('expired and future claims fail',()=>{
 const f=fixture(),c=readClaim(f.token,secret)!;assert.equal(readClaim(f.token,secret,c.exp*1000),null);assert.equal(readClaim(f.token,secret,(c.iat-1)*1000),null);
});
test('bundle form, source, identity, email and submission time must match',async()=>{
 const f=fixture();for(const change of [{formId:'other'},{sourceUrl:'https://xoomai.com.au/'},{eventUuid:issueIdentity(secret).eventUuid},{email:''},{email:'bad'},{submittedAt:'invalid'},{submittedAt:new Date(Date.now()+10000).toISOString()},{submittedAt:'2000-01-01T00:00:00Z'}])assert.equal(await verifySubmission({...f,...change},secret,store()),null);
});
test('shared Redis atomically binds once and accepts only identical retry',async()=>{
 const calls:unknown[]=[];let value:string|undefined;
 const mock:typeof fetch=async(_u,i)=>{const command=JSON.parse(String(i?.body));calls.push(command);if(command[0]==='GET')return Response.json({result:value??null});if(value)return Response.json({result:null});value=command[2];return Response.json({result:'OK'});};
 const s=redisNonceStore('https://redis.example.test','unit-token',mock);assert.equal(await s.bind('nonce','hash',42),true);assert.equal(await s.bind('nonce','hash',42),true);assert.equal(await s.bind('nonce','changed',42),false);assert.deepEqual(calls[0],['SET','xoomai:hubspot:binding:nonce','hash','NX','EX',42]);
});
test('Redis errors and unknown responses fail closed',async()=>{
 for(const b of [{error:'denied'},{result:1},{}]){const s=redisNonceStore('https://redis.example.test','unit-token',async()=>Response.json(b));await assert.rejects(()=>s.bind('n','e',10));}assert.throws(()=>redisNonceStore('http://redis.example.test','unit-token'));
});
test('issuer rejects missing config and unapproved origins',async()=>{
 const c={signingKey:secret,verifierKey,store:store()},req=(origin:string)=>new Request('https://xoomai.com.au/api',{method:'POST',headers:{origin}});
 assert.equal((await issueResponse(req('https://xoomai.com.au'),null)).status,503);assert.equal((await issueResponse(req('https://attacker.test'),c)).status,403);
 const r=await issueResponse(req('https://xoomai.com.au'),c);assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');
});
test('browser token possession cannot redeem without relay authentication',async()=>{
 const c={signingKey:secret,verifierKey,store:store()},f=fixture(),req=(key:string)=>new Request('https://xoomai.com.au/api',{method:'POST',headers:{authorization:key},body:JSON.stringify(f)});
 assert.equal((await verifyResponse(req('Bearer wrong'),c)).status,401);assert.equal((await verifyResponse(req('Bearer '+verifierKey),c)).status,200);assert.equal((await verifyResponse(req('Bearer '+verifierKey),c)).status,200);
});
test('verifier rejects oversized input, invalid JSON and store failure',async()=>{
 const c={signingKey:secret,verifierKey,store:store()},req=(body:string)=>new Request('https://xoomai.com.au/api',{method:'POST',headers:{authorization:'Bearer '+verifierKey},body});
 assert.equal((await verifyResponse(req('x'.repeat(8193)),c)).status,413);assert.equal((await verifyResponse(req('{'),c)).status,400);
 assert.equal((await verifyResponse(req(JSON.stringify(fixture())),{...c,store:{async bind(){throw Error('unavailable');}}})).status,503);
});

test('verification after downstream failure returns identical normalized identity after lease expiry',async()=>{
 const f=fixture(),s=store(),first=await verifySubmission(f,secret,s);
 assert.deepEqual(await verifySubmission(f,secret,s,Date.now()+3600000),first);
 assert.equal(await verifySubmission({...f,email:'changed@example.com'},secret,s),null);
 assert.equal(await verifySubmission({...f,submittedAt:new Date(Date.parse(f.submittedAt)+1).toISOString()},secret,s),null);
});
test('renewal preserves canonical event and nonce, including recovery after a suspended tab',async()=>{
 const now=Date.now(),first=issueIdentity(secret,now),renewed=renewIdentity(first.token,secret,now+16*60000)!;
 assert.equal(renewed.eventUuid,first.eventUuid);assert.notEqual(renewed.token,first.token);
 assert.equal(readClaim(renewed.token,secret,now+16*60000)?.nonce,readClaim(first.token,secret,now)?.nonce);
 const confirmed={...renewed,email:'test@example.com',submittedAt:new Date(now+17*60000).toISOString()};
 assert.equal((await verifySubmission(confirmed,secret,store(),now+18*60000))?.eventId,'hs_form_'+first.eventUuid);
 assert.equal(renewIdentity(first.token+'x',secret,now+16*60000),null);
 assert.equal(renewIdentity(first.token,secret,now+7*86400000),null);
});
test('retry beyond Meta delivery retention is rejected',async()=>{
 const now=Date.now(),f=fixture(now);assert.equal(await verifySubmission(f,secret,store(),now+7*86400000),null);
});

test('the old token captured by HubSpot remains verifiable when submission races renewal',async()=>{
 const now=Date.now(),original=issueIdentity(secret,now),submitted=now+16*60000;
 const body={...original,email:'test@example.com',submittedAt:new Date(submitted).toISOString()};
 const renewed=renewIdentity(original.token,secret,submitted)!;assert.equal(renewed.eventUuid,original.eventUuid);assert.equal(renewed.validUntil,original.validUntil);
 const s=store(),r=await verifySubmission(body,secret,s,submitted+1000);assert.equal(r?.eventId,'hs_form_'+original.eventUuid);
 assert.deepEqual(await verifySubmission(body,secret,s,submitted+3600000),r);
 assert.equal(await verifySubmission({...body,submittedAt:new Date(original.validUntil).toISOString()},secret,store(),original.validUntil+1000),null);
});


const configEnvNames = ['HUBSPOT_IDENTITY_SIGNING_KEY', 'HUBSPOT_IDENTITY_VERIFIER_KEY', 'HUBSPOT_IDENTITY_REDIS_URL', 'HUBSPOT_IDENTITY_REDIS_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN'];
async function withConfigEnv(values: Record<string, string>, check: () => Promise<void>) {
 const saved = configEnvNames.map(name => process.env[name]);
 const originalFetch = globalThis.fetch;
 try {
  for (const name of configEnvNames) delete process.env[name];
  Object.assign(process.env, { HUBSPOT_IDENTITY_SIGNING_KEY: secret, HUBSPOT_IDENTITY_VERIFIER_KEY: verifierKey }, values);
  await check();
 } finally {
  configEnvNames.forEach((name, i) => { if (saved[i] === undefined) delete process.env[name]; else process.env[name] = saved[i]; });
  globalThis.fetch = originalFetch;
 }
}
async function assertConfiguredStore(url: string, token: string) {
 let calls = 0;
 globalThis.fetch = async (input, init) => {
  calls++; assert.equal(String(input), url); assert.equal((init?.headers as Record<string,string>).Authorization, 'Bearer ' + token);
  return Response.json({ result: 'OK' });
 };
 const config = identityConfig(); assert.ok(config);
 assert.equal(await config.store.bind('test-nonce', 'test-binding', 60), true); assert.equal(calls, 1);
}
test('identity config uses protected Vercel Marketplace REST variables as fallback', async () => {
 await withConfigEnv({ KV_REST_API_URL: 'https://marketplace.example.test/', KV_REST_API_TOKEN: 'marketplace-test-token' }, async () => {
  await assertConfiguredStore('https://marketplace.example.test/', 'marketplace-test-token');
 });
});
test('identity config canonical REST names take priority over Marketplace values', async () => {
 await withConfigEnv({ HUBSPOT_IDENTITY_REDIS_URL: 'https://canonical.example.test/', HUBSPOT_IDENTITY_REDIS_TOKEN: 'canonical-test-token', KV_REST_API_URL: 'https://marketplace.example.test/', KV_REST_API_TOKEN: 'marketplace-test-token' }, async () => {
  await assertConfiguredStore('https://canonical.example.test/', 'canonical-test-token');
 });
});
test('identity config applies fallback independently to each absent or empty canonical value', async () => {
 await withConfigEnv({ HUBSPOT_IDENTITY_REDIS_URL: 'https://canonical.example.test/', HUBSPOT_IDENTITY_REDIS_TOKEN: '', KV_REST_API_TOKEN: 'marketplace-test-token' }, async () => {
  await assertConfiguredStore('https://canonical.example.test/', 'marketplace-test-token');
 });
 await withConfigEnv({ HUBSPOT_IDENTITY_REDIS_URL: '', HUBSPOT_IDENTITY_REDIS_TOKEN: 'canonical-test-token', KV_REST_API_URL: 'https://marketplace.example.test/' }, async () => {
  await assertConfiguredStore('https://marketplace.example.test/', 'canonical-test-token');
 });
});
test('identity config fallback fails closed for missing configuration, invalid selected URLs and invalid server keys', async () => {
 const fallback = { KV_REST_API_URL: 'https://marketplace.example.test/', KV_REST_API_TOKEN: 'marketplace-test-token' };
 for (const values of [{}, { KV_REST_API_URL: fallback.KV_REST_API_URL }, { KV_REST_API_TOKEN: fallback.KV_REST_API_TOKEN },
  { ...fallback, KV_REST_API_URL: 'http://marketplace.example.test/' },
  { ...fallback, HUBSPOT_IDENTITY_REDIS_URL: 'not-a-url' },
  { ...fallback, HUBSPOT_IDENTITY_SIGNING_KEY: '' }, { ...fallback, HUBSPOT_IDENTITY_VERIFIER_KEY: 'short' },
  { ...fallback, HUBSPOT_IDENTITY_VERIFIER_KEY: secret }]) {
  await withConfigEnv(values, async () => {
   globalThis.fetch = async () => { throw new Error('Configuration validation must not make a network request'); };
   assert.equal(identityConfig(), null);
   const request = () => new Request('https://xoomai.com.au/api', { method: 'POST', headers: { origin: 'https://xoomai.com.au' } });
   assert.equal((await issueResponse(request())).status, 503); assert.equal((await verifyResponse(request())).status, 503);
  });
 }
});
