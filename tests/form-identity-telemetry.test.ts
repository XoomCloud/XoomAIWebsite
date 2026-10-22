import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createIdentityTelemetry,TELEMETRY_MARKER} from '../src/lib/form-identity-telemetry';
const valid={event:'identity_unavailable',form:'enquiry',source:'/youraiemployee'};
function request(input: unknown=valid,extra: RequestInit={},query='') {
 return new Request('https://xoomai.com.au/api/telemetry/form-identity'+query,{method:'POST',headers:{origin:'https://xoomai.com.au','content-type':'application/json'},body:JSON.stringify(input),...extra});
}
test('accepted failure logs only the fixed sanitized metadata contract',async()=>{
 const lines:string[]=[];const ops=createIdentityTelemetry(()=>Date.UTC(2026,9,22),line=>lines.push(line));
 const r=await ops.report(request());assert.equal(r.status,204);assert.equal(r.headers.get('cache-control'),'no-store');
 assert.deepEqual(JSON.parse(lines[0]),{marker:TELEMETRY_MARKER,event:'form_identity_status',form:'enquiry',source:'/youraiemployee',time:'2026-10-22T00:00:00.000Z',service_status:'identity_unavailable',failure_count:1});
});
test('arbitrary properties, incorrect form, source, event and query are rejected without logging',async()=>{
 const lines:string[]=[];const ops=createIdentityTelemetry(Date.now,line=>lines.push(line));
 for(const input of [null,[],{}, {...valid,email:'private@example.invalid'},{...valid,token:'private-token'}, {...valid,uuid:'private-id'}, {...valid,form:'other'}, {...valid,event:'generate_lead'}, {...valid,source:'/youraiemployee?email=private'}, {...valid,source:'https://xoomai.com.au/youraiemployee'}]){
 assert.equal((await ops.report(request(input))).status,422);
 }
 assert.equal((await ops.report(request(valid,{},'?private=secret'))).status,400);assert.equal(lines.length,0);
});
test('forbidden origins, content types and malformed JSON do not log headers or cookies',async()=>{
 const lines:string[]=[];const ops=createIdentityTelemetry(Date.now,line=>lines.push(line));
 assert.equal((await ops.report(request(valid,{headers:{origin:'https://evil.invalid','content-type':'application/json',cookie:'private',authorization:'private'}}))).status,403);
 assert.equal((await ops.report(request(valid,{headers:{origin:'https://xoomai.com.au','content-type':'text/plain'}}))).status,415);
 assert.equal((await ops.report(request(valid,{body:'not json'}))).status,400);assert.equal(lines.length,0);
});
test('declared and chunked oversized bodies are bounded including dishonest length',async()=>{
 const ops=createIdentityTelemetry(()=>0,()=>assert.fail('must not log'));
 assert.equal((await ops.report(request(valid,{headers:{origin:'https://xoomai.com.au','content-type':'application/json','content-length':'257'}}))).status,413);
 let cancelled=false;
 const body=new ReadableStream({pull(controller){controller.enqueue(new TextEncoder().encode('x'.repeat(257)));},cancel(){cancelled=true;}});
 const r=new Request('https://xoomai.com.au/api/telemetry/form-identity',{method:'POST',headers:{origin:'https://xoomai.com.au','content-type':'application/json','content-length':'1'},body,duplex:'half'} as RequestInit);
 assert.equal((await ops.report(r)).status,413);assert.equal(cancelled,true);
});
test('concurrent reports are capped at twelve per warm instance minute and reset next minute',async()=>{
 let time=0;const lines:string[]=[];const ops=createIdentityTelemetry(()=>time,line=>lines.push(line));
 const statuses=await Promise.all(Array.from({length:30},async()=> (await ops.report(request())).status));
 assert.equal(statuses.filter(x=>x===204).length,12);assert.equal(statuses.filter(x=>x===429).length,18);assert.equal(lines.length,12);
 time=60000;assert.equal((await ops.report(request())).status,204);assert.equal(lines.length,13);
});
test('health probe exposes consumer status once per minute and no false identity health claim',async()=>{
 const lines:string[]=[];const ops=createIdentityTelemetry(()=>0,line=>lines.push(line));
 assert.deepEqual(await ops.health().json(),{service:'form_identity_telemetry',status:'ready',version:1});ops.health();
 assert.equal(lines.length,1);assert.equal(JSON.parse(lines[0]).service_status,'consumer_ready');assert.equal(JSON.parse(lines[0]).failure_count,0);
});

test('browser custom event is consumed by first-party route and produces sanitized runtime output without analytics',async()=>{
 const {readFileSync}=await import('node:fs');const {runInNewContext}=await import('node:vm');
 const lines:string[]=[],listeners:Record<string,(event:unknown)=>Promise<void>|void>={};
 const ops=createIdentityTelemetry(()=>0,line=>lines.push(line));let delivery:Promise<Response>|undefined;
 const window={location:{pathname:'/youraiemployee'},sessionStorage:{getItem:()=>null,setItem:()=>{}},
 addEventListener:(name:string,handler:(event:unknown)=>void)=>listeners[name]=handler,
 CustomEvent:class{constructor(public type:string,public detail:unknown){this.detail=(detail as {detail:unknown}).detail;}},
 dispatchEvent:(event:{type:string})=>listeners[event.type]?.(event),setTimeout:()=>{},
 fetch:(url:string,init:RequestInit)=>{assert.equal(url,'/api/telemetry/form-identity');delivery=ops.report(request(valid,{...init,headers:{...init.headers,origin:'https://xoomai.com.au'}}));return delivery;},
 HubSpotFormsV4:{getFormFromEvent:()=>({getFormId:()=> 'd5bbb02f-27ce-4869-8428-3f9268bfe5d5',setFieldValue:()=>{},getFormFieldValues:async()=>[]})}};
 runInNewContext(readFileSync(new URL('../public/hubspot-form-tracking.js',import.meta.url),'utf8'),{window});
 await listeners['hs-form-event:on-ready']({detail:{formId:'d5bbb02f-27ce-4869-8428-3f9268bfe5d5',instanceId:'synthetic-local-instance'}});
 assert.ok(delivery);assert.equal((await delivery).status,204);assert.equal(lines.length,2);
 assert.deepEqual(lines.map(line=>JSON.parse(line).service_status).sort(),['attribution_unavailable','identity_unavailable']);
 assert.equal(JSON.parse(lines[0]).marker,TELEMETRY_MARKER);assert.equal(JSON.parse(lines[0]).failure_count,1);
 assert.equal(lines[0].includes('synthetic-local-instance'),false);
});
test('attribution reports use the same strict sanitized contract and shared server rate limit',async()=>{
 const lines:string[]=[];const ops=createIdentityTelemetry(()=>0,line=>lines.push(line));
 const attribution={...valid,event:'attribution_unavailable'};
 assert.equal((await ops.report(request({...attribution,campaign:'private'}))).status,422);
 assert.equal((await ops.report(request({...attribution,event:['attribution_unavailable']}))).status,422);
 for(let i=0;i<6;i++)assert.equal((await ops.report(request(attribution))).status,204);
 for(let i=0;i<6;i++)assert.equal((await ops.report(request(valid))).status,204);
 assert.equal((await ops.report(request(attribution))).status,429);
 assert.equal(lines.length,12);assert.equal(JSON.parse(lines[0]).service_status,'attribution_unavailable');
 assert.deepEqual(Object.keys(JSON.parse(lines[0])).sort(),['event','failure_count','form','marker','service_status','source','time']);
});
