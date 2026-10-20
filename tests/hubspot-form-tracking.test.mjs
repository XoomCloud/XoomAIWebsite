import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../public/hubspot-form-tracking.js',import.meta.url),'utf8');
const formId='d5bbb02f-27ce-4869-8428-3f9268bfe5d5';
const guid='01234567-89ab-4cde-8f01-23456789abcd';
function harness({ready=true,store=new Map(),path='/youraiemployee',conversion=guid,apiFormId=formId}={}){
 const listeners={},meta=[],timers=[];
 const window={__xoomGaReady:true,setTimeout:fn=>timers.push(fn),location:{pathname:path},sessionStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},addEventListener:(name,fn)=>{listeners[name]=fn;},HubSpotFormsV4:{getFormFromEvent:()=>({getFormId:()=>apiFormId,getConversionId:()=>conversion})}};
 if(ready)window.fbq=(...args)=>meta.push(args);
 const context=vm.createContext({window});vm.runInContext(script,context);
 const emit=(name,detail={formId,instanceId:'instance1'})=>listeners[name]?.({detail});
 return{window,meta,emit,store,context,timers};
}
test('only confirmed form success emits one Lead and one generate_lead with matching ID and attribution',()=>{
 const b=harness();b.emit('hs-form-event:on-ready');b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,1);assert.equal(b.meta[0][0],'trackSingle');assert.equal(b.meta[0][1],'1643300670067276');assert.equal(b.meta[0][2],'Lead');assert.equal(b.meta[0][3].source_page_path,'/youraiemployee');assert.equal(b.meta[0][3].form_id,formId);assert.equal(b.meta[0][3].conversion_type,'hubspot_form_submission');assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
 b.window.location.pathname='/book';b.emit('ga4Ready');assert.equal(b.window.dataLayer.length,1);assert.equal(b.window.dataLayer[0][1],'generate_lead');assert.equal(b.window.dataLayer[0][2].event_id,b.meta[0][4].eventID);
});
test('page load, submit attempts and validation failures do not produce conversions',()=>{
 const b=harness();b.emit('hs-form-event:on-ready');b.emit('submit');b.emit('hs-form-event:on-submission:failed');assert.equal(b.meta.length,0);assert.equal(b.window.dataLayer,undefined);
});
test('duplicate success, script execution and Meta-ready notifications do not repeat events',()=>{
 const b=harness();b.emit('hs-form-event:on-submission:success');vm.runInContext(script,b.context);b.emit('hs-form-event:on-submission:success');b.emit('metaPixelReady');assert.equal(b.meta.length,1);b.timers[0]();assert.equal(b.window.dataLayer.length,1);
});
test('completed conversion stays deduplicated after reload',()=>{
 const b=harness();b.emit('hs-form-event:on-submission:success');b.timers[0]();const c=harness({store:b.store});c.emit('hs-form-event:on-submission:success');assert.equal(c.meta.length,0);assert.equal(c.window.dataLayer,undefined);
});
test('wrong form, wrong provider form instance and other landing pages are ignored',()=>{
 const b=harness();b.emit('hs-form-event:on-submission:success',{formId:'other',instanceId:'1'});assert.equal(b.meta.length,0);
 const c=harness({apiFormId:'other'});c.emit('hs-form-event:on-submission:success');assert.equal(c.meta.length,0);
 const d=harness({path:'/book'});d.emit('hs-form-event:on-submission:success');assert.equal(d.meta.length,0);
});
test('missing or malformed provider conversion IDs do not fabricate events',()=>{
 for(const conversion of [undefined,'',null,'private@example.com','unconfirmed']){const b=harness({conversion:conversion===undefined?'':conversion});b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);}
});
test('pending confirmed event survives redirect until Meta becomes ready, then fires once',()=>{
 const b=harness({ready:false});b.emit('hs-form-event:on-ready');b.emit('hs-form-event:on-submission:success');b.emit('hs-form-event:on-submission:success');b.timers[0]();assert.equal(b.window.dataLayer.length,1);
 const c=harness({ready:false,store:b.store,path:'/book'});c.window.fbq=(...a)=>c.meta.push(a);c.emit('metaPixelReady');c.emit('metaPixelReady');assert.equal(c.meta.length,1);assert.equal(c.meta[0][3].source_page_path,'/youraiemployee');assert.equal(c.window.dataLayer,undefined);
});
test('source captured on form-ready is retained if location changes before success handler',()=>{
 const b=harness();b.emit('hs-form-event:on-ready');b.window.location.pathname='/book';b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][3].source_page_path,'/youraiemployee');
});
test('expired pending conversions are discarded',()=>{
 const b=harness({ready:false});b.emit('hs-form-event:on-submission:success');const key='xoomai:hubspot-form-conversions:v1';const saved=JSON.parse(b.store.get(key));saved.pending[0].at=Date.now()-90000000;b.store.set(key,JSON.stringify(saved));const c=harness({store:b.store,path:'/book'});assert.equal(c.meta.length,0);
});

test('Google waits until the redirect document has initialized its tag',()=>{
 const b=harness();b.emit('hs-form-event:on-submission:success');assert.equal(b.window.dataLayer,undefined);
 const c=harness({store:b.store,path:'/book'});assert.equal(c.window.dataLayer.length,1);c.emit('ga4Ready');assert.equal(c.window.dataLayer.length,1);
});
test('inline success sends Google once after the redirect opportunity has passed',()=>{
 const b=harness();b.emit('hs-form-event:on-submission:success');assert.equal(b.window.dataLayer,undefined);b.timers[0]();b.emit('ga4Ready');assert.equal(b.window.dataLayer.length,1);
});
