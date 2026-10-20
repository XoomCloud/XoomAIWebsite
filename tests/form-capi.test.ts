import assert from "node:assert/strict";
import crypto from "node:crypto";
import { beforeEach, afterEach, test } from "node:test";
import { POST } from "../src/app/api/hubspot/form-submitted/route";
const keys=["HUBSPOT_FORM_WEBHOOK_SECRET","META_CAPI_ACCESS_TOKEN","META_PIXEL_ID","NEXT_PUBLIC_META_PIXEL_ID"];
const original=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
const originalFetch=globalThis.fetch;
let calls:{url:string;body:Record<string,unknown>;headers:Headers}[]=[];
const id="01234567-89ab-4cde-8f01-23456789abcd";
const base={formId:"d5bbb02f-27ce-4869-8428-3f9268bfe5d5",submissionId:id,submittedAt:"",email:"qa@example.com"};
function request(body:unknown={...base,submittedAt:new Date(Date.now()-1000).toISOString()},secret="test-only-secret"){
 return new Request("https://xoomai.com.au/api/hubspot/form-submitted",{method:"POST",headers:{"Content-Type":"application/json","x-webhook-secret":secret},body:JSON.stringify(body)});
}
beforeEach(()=>{for(const k of keys)delete process.env[k];process.env.HUBSPOT_FORM_WEBHOOK_SECRET="test-only-secret";process.env.META_CAPI_ACCESS_TOKEN="test-only-token";calls=[];globalThis.fetch=async(url,init)=>{calls.push({url:String(url),body:JSON.parse(String(init?.body)),headers:new Headers(init?.headers)});return Response.json({events_received:1,fbtrace_id:"trace-test"});};});
afterEach(()=>{globalThis.fetch=originalFetch;for(const k of keys){if(original[k]===undefined)delete process.env[k];else process.env[k]=original[k];}});
test("unconfigured form relay fails closed",async()=>{delete process.env.HUBSPOT_FORM_WEBHOOK_SECRET;assert.equal((await POST(request())).status,503);assert.equal(calls.length,0);});
test("unauthorized browser requests never forward events",async()=>{assert.equal((await POST(request(undefined,"wrong"))).status,401);assert.equal(calls.length,0);});
test("confirmed form sends one hashed Lead with the browser ID, fixed source, form and processing receipt",async()=>{
 const r=await POST(request({...base,submittedAt:new Date(Date.now()-1000).toISOString(),eventSourceUrl:"https://evil.example/?email=private"}));assert.equal(r.status,200);const receipt=await r.json();assert.equal(receipt.traceId,"trace-test");assert.equal(receipt.eventId,"hs_form_"+id);assert.equal(receipt.events_received,1);assert.equal(calls.length,1);
 const event=(calls[0].body.data as Record<string,unknown>[])[0];assert.equal(event.event_name,"Lead");assert.equal(event.event_id,"hs_form_"+id);assert.equal(event.event_source_url,"https://xoomai.com.au/youraiemployee");assert.deepEqual((event.user_data as Record<string,unknown>).em,[crypto.createHash("sha256").update(base.email).digest("hex")]);assert.equal((event.custom_data as Record<string,unknown>).form_id,base.formId);assert.ok(!JSON.stringify(calls[0].body).includes(base.email));assert.ok(!calls[0].url.includes("test-only-token"));
});
test("retries preserve the same event identity for Meta deduplication",async()=>{const body={...base,submissionId:id.toUpperCase(),submittedAt:new Date(Date.now()-1000).toISOString()};await POST(request(body));await POST(request(body));assert.equal((calls[0].body.data as Record<string,unknown>[])[0].event_id,(calls[1].body.data as Record<string,unknown>[])[0].event_id);});
test("wrong form and malformed submission identity are rejected",async()=>{for(const patch of [{formId:"other"},{submissionId:"made-up"},{email:"not-an-email"}]){assert.equal((await POST(request({...base,submittedAt:new Date(Date.now()-1000).toISOString(),...patch}))).status,422);}assert.equal(calls.length,0);});
test("future and expired submissions are rejected without replacing their timestamp",async()=>{for(const at of [Date.now()+60000,Date.now()-8*86400000])assert.equal((await POST(request({...base,submittedAt:new Date(at).toISOString()}))).status,422);assert.equal(calls.length,0);});
test("arrays cannot impersonate a confirmed submission",async()=>{assert.equal((await POST(request([]))).status,400);assert.equal(calls.length,0);});
test("missing CAPI configuration is a retryable failure",async()=>{delete process.env.META_CAPI_ACCESS_TOKEN;assert.equal((await POST(request())).status,503);assert.equal(calls.length,0);});
test("HTTP 200 with zero events received is not a successful conversion",async()=>{globalThis.fetch=async()=>Response.json({events_received:0});assert.equal((await POST(request())).status,503);});
test("Meta rejection is a retryable failure",async()=>{globalThis.fetch=async()=>Response.json({error:"rejected"},{status:400});assert.equal((await POST(request())).status,503);});
