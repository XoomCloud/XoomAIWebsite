import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { FORM_ID, SOURCE_URL, issueIdentity, readClaim, verifySubmission, redisNonceStore, type NonceStore } from '../src/lib/form-identity';
import { issueResponse, verifyResponse } from '../src/lib/form-identity-http';
const secret = 'unit-test-signing-key-not-a-production-secret';
const verifierKey = 'unit-test-verifier-key-not-a-production-secret';
function store(): NonceStore { const used = new Set<string>(); return { async consume(n) { if (used.has(n)) return false; used.add(n); return true; } }; }
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
test('atomic nonce consume rejects reuse and concurrent verification',async()=>{
 const f=fixture(),s=store(),r=await Promise.all([verifySubmission(f,secret,s),verifySubmission(f,secret,s)]);assert.equal(r.filter(Boolean).length,1);
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
test('shared Redis uses NX and expiry, and rejects replay',async()=>{
 const calls:unknown[]=[];const mock:typeof fetch=async(_u,i)=>{calls.push(JSON.parse(String(i?.body)));return Response.json({result:calls.length===1?'OK':null});};
 const s=redisNonceStore('https://redis.example.test','unit-token',mock);assert.equal(await s.consume('nonce','event',42),true);assert.equal(await s.consume('nonce','event',42),false);assert.deepEqual(calls[0],['SET','xoomai:hubspot:used:nonce','event','NX','EX',42]);
});
test('Redis errors and unknown responses fail closed',async()=>{
 for(const b of [{error:'denied'},{result:1},{}]){const s=redisNonceStore('https://redis.example.test','unit-token',async()=>Response.json(b));await assert.rejects(()=>s.consume('n','e',10));}assert.throws(()=>redisNonceStore('http://redis.example.test','unit-token'));
});
test('issuer rejects missing config and unapproved origins',async()=>{
 const c={signingKey:secret,verifierKey,store:store()},req=(origin:string)=>new Request('https://xoomai.com.au/api',{method:'POST',headers:{origin}});
 assert.equal((await issueResponse(req('https://xoomai.com.au'),null)).status,503);assert.equal((await issueResponse(req('https://attacker.test'),c)).status,403);
 const r=await issueResponse(req('https://xoomai.com.au'),c);assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');
});
test('browser token possession cannot redeem without relay authentication',async()=>{
 const c={signingKey:secret,verifierKey,store:store()},f=fixture(),req=(key:string)=>new Request('https://xoomai.com.au/api',{method:'POST',headers:{authorization:key},body:JSON.stringify(f)});
 assert.equal((await verifyResponse(req('Bearer wrong'),c)).status,401);assert.equal((await verifyResponse(req('Bearer '+verifierKey),c)).status,200);assert.equal((await verifyResponse(req('Bearer '+verifierKey),c)).status,422);
});
test('verifier rejects oversized input, invalid JSON and store failure',async()=>{
 const c={signingKey:secret,verifierKey,store:store()},req=(body:string)=>new Request('https://xoomai.com.au/api',{method:'POST',headers:{authorization:'Bearer '+verifierKey},body});
 assert.equal((await verifyResponse(req('x'.repeat(8193)),c)).status,413);assert.equal((await verifyResponse(req('{'),c)).status,400);
 assert.equal((await verifyResponse(req(JSON.stringify(fixture())),{...c,store:{async consume(){throw Error('unavailable');}}})).status,503);
});
