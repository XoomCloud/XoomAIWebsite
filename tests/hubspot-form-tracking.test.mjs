import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../public/hubspot-form-tracking.js',import.meta.url),'utf8');
const formId='d5bbb02f-27ce-4869-8428-3f9268bfe5d5',guid='01234567-89ab-4cde-8f01-23456789abcd';
const fieldNames=['0-1/xoom_tracking_uuid','0-1/xoom_tracking_token','0-1/xoom_tracking_source_url'];
function harness({ready=true,store=new Map(),path='/youraiemployee',missingField=false,apiFailure=false,expired=false,wrongId=false}={}){
 const listeners={},meta=[],timers=[],values={},requests=[],events=[],clock={now:Date.now()},control={apiFailure},sessionUntil=clock.now+7*86400000;
 class ClockDate extends Date { static now(){return clock.now;} }
 const form={getFormId:()=>formId,getFormFieldValues:async()=>fieldNames.filter((_,i)=>!missingField||i!==0).map(name=>({name,value:values[name]||''})),setFieldValue:(name,value)=>values[name]=value,getFieldValue:async name=>values[name],getConversionId:()=> 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'};
 const window={__xoomGaReady:true,CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}},dispatchEvent:e=>events.push(e),setTimeout:(fn,ms)=>{const t={fn,ms,cancelled:false};timers.push(t);return t;},clearTimeout:t=>t.cancelled=true,location:{pathname:path},sessionStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},addEventListener:(name,fn)=>listeners[name]=fn,
 fetch:async(url,init)=>{requests.push({url,init});if(requests.length>1&&control.renewalGate)await control.renewalGate;return {ok:!control.apiFailure,json:async()=>({ok:true,eventUuid:wrongId?'invalid':guid,token:'unit.test-token-'+requests.length,expiresAt:clock.now+(expired?-1000:900000),validUntil:sessionUntil,formId,sourceUrl:'https://xoomai.com.au/youraiemployee'})};},HubSpotFormsV4:{getFormFromEvent:()=>form}};
 if(ready)window.fbq=(...args)=>meta.push(args);
 const context=vm.createContext({window,Date:ClockDate});vm.runInContext(script,context);
 const emit=(name,detail={formId,instanceId:'instance1'})=>listeners[name]?.({detail});return{window,meta,emit,store,context,timers,values,requests,clock,control,events};
}
test('prepares one signed identity in hidden fields and sends only after success',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');await b.emit('hs-form-event:on-ready');assert.equal(b.requests.length,1);assert.equal(b.meta.length,0);assert.equal(b.values[fieldNames[0]][0],guid);
 b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);assert.equal(b.meta[0][3].source_page_path,'/youraiemployee');assert.equal(b.meta[0][1],'1643300670067276');
 b.window.location.pathname='/book';b.emit('ga4Ready');assert.equal(b.window.dataLayer[0][2].event_id,b.meta[0][4].eventID);
});
test('attempts, failed validation and missing readiness produce no conversions',async()=>{
 const b=harness();b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);await b.emit('hs-form-event:on-ready');b.emit('submit');b.emit('hs-form-event:on-submission:failed');assert.equal(b.meta.length,0);
});
test('missing fields, issue failure, expiry or invalid identity never fall back to provider ID',async()=>{
 for(const options of [{missingField:true},{apiFailure:true},{expired:true},{wrongId:true}]){const b=harness(options);await b.emit('hs-form-event:on-ready');b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);}
});
test('duplicate success, ready notifications and script loading emit once',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.emit('hs-form-event:on-submission:success');b.emit('hs-form-event:on-submission:success');b.emit('metaPixelReady');vm.runInContext(script,b.context);assert.equal(b.meta.length,1);b.timers.find(t=>t.ms===1000).fn();assert.equal(b.window.dataLayer.length,1);
});
test('wrong form and other landing pages are ignored',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready',{formId:'other',instanceId:'1'});b.emit('hs-form-event:on-submission:success');assert.equal(b.requests.length,0);assert.equal(b.meta.length,0);const c=harness({path:'/book'});await c.emit('hs-form-event:on-ready');assert.equal(c.requests.length,0);
});
test('pending identity survives redirect without duplicate platform events after reload',async()=>{
 const b=harness({ready:false});await b.emit('hs-form-event:on-ready');b.emit('hs-form-event:on-submission:success');const c=harness({store:b.store,path:'/book'});assert.equal(c.meta.length,1);assert.equal(c.window.dataLayer.length,1);c.emit('metaPixelReady');c.emit('ga4Ready');assert.equal(c.meta.length,1);const d=harness({store:b.store,path:'/book'});assert.equal(d.meta.length,0);assert.equal(d.window.dataLayer,undefined);
});
test('ready source survives navigation before success callback',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.window.location.pathname='/book';b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][3].source_page_path,'/youraiemployee');
});
test('Google waits for destination or inline timeout',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.emit('hs-form-event:on-submission:success');assert.equal(b.window.dataLayer,undefined);b.timers.find(t=>t.ms===1000).fn();b.emit('ga4Ready');assert.equal(b.window.dataLayer.length,1);
});
test('old provider identity queue is not replayed during identity migration',()=>{
 const store=new Map([['xoomai:hubspot-form-conversions:v1',JSON.stringify({sentMeta:[],sentGa:[],pending:[{id:'hs_form_'+guid,path:'/youraiemployee',at:Date.now()}]})]]);const b=harness({store,path:'/book'});assert.equal(b.meta.length,0);
});

test('a form submitted after the original 15-minute window retains its canonical identity',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');const original=b.values[fieldNames[0]][0];
 b.clock.now+=13*60000;const refresh=b.timers.find(t=>!t.cancelled&&t.ms>1000);await refresh.fn();await new Promise(setImmediate);
 assert.equal(b.requests.length,2);assert.equal(JSON.parse(b.requests[1].init.body).token,'unit.test-token-1');
 assert.equal(b.values[fieldNames[0]][0],original);b.clock.now+=3*60000;b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+original);
});
test('focus renews a suspended tab with the same identity before submission',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=16*60000;b.emit('focus');await new Promise(setImmediate);
 b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.requests.length,2);
});
test('transient renewal failure retries without replacing the identity',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=13*60000;b.control.apiFailure=true;b.emit('focus');await new Promise(setImmediate);
 const retry=b.timers.find(t=>!t.cancelled&&t.ms===5000);assert.ok(retry);b.control.apiFailure=false;await retry.fn();await new Promise(setImmediate);
 b.clock.now+=3*60000;b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
});
test('unavailable identity emits a non-personal operational signal instead of silently inventing a conversion',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=7*86400000;b.control.apiFailure=true;b.emit('focus');await new Promise(setImmediate);b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,0);assert.ok(b.events.length>0);assert.equal(b.events[0].type,'xoomFormIdentityUnavailable');assert.equal(b.events[0].detail.formId,formId);assert.deepEqual(Object.keys(b.events[0].detail).sort(),['formId','source_page_path']);
});

test('confirmed success during held focus renewal emits once with the original identity and survives redirect',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');const capturedToken=b.values[fieldNames[1]][0];
 let release;b.control.renewalGate=new Promise(resolve=>release=resolve);b.clock.now+=16*60000;b.emit('focus');
 assert.equal(b.requests.length,2);b.emit('hs-form-event:on-submission:success');b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
 b.window.location.pathname='/book';b.emit('ga4Ready');assert.equal(b.window.dataLayer.length,1);
 release();await new Promise(setImmediate);b.emit('metaPixelReady');b.emit('ga4Ready');assert.equal(b.meta.length,1);assert.equal(b.window.dataLayer.length,1);
 assert.equal(b.values[fieldNames[1]][0],capturedToken);assert.equal(b.timers.filter(t=>!t.cancelled&&t.ms>1000).length,0);
 const c=harness({store:b.store,path:'/book'});assert.equal(c.meta.length,0);assert.equal(c.window.dataLayer,undefined);
});
test('a failed renewal does not invalidate a prepared identity within its supported session',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=16*60000;b.control.apiFailure=true;b.emit('focus');await new Promise(setImmediate);
 b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
});
