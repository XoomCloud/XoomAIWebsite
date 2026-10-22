import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../public/hubspot-form-tracking.js',import.meta.url),'utf8');
const formId='d5bbb02f-27ce-4869-8428-3f9268bfe5d5',guid='01234567-89ab-4cde-8f01-23456789abcd';
const fieldNames=['0-1/xoom_tracking_uuid','0-1/xoom_tracking_token','0-1/xoom_tracking_source_url'];
const attributionNames=['xoomai_utm_medium','xoomai_campaign_name','xoomai_campaign_id','xoomai_utm_term_adset_id','xoomai_utm_content_ad_id','xoomai_meta_fbc','xoomai_campaign_source'].map(n=>'0-1/'+n);
function harness({ready=true,store=new Map(),path='/youraiemployee',missingField=false,apiFailure=false,expired=false,wrongId=false,now=Date.now(),search='',cookie='',initialValues={},missingAttribution=false}={}){
 const listeners={},meta=[],timers=[],values={...initialValues},requests=[],reports=[],events=[],clock={now},control={apiFailure},sessionUntil=clock.now+7*86400000;
 class ClockDate extends Date { static now(){return clock.now;} }
 const form={getFormId:()=>formId,getFormFieldValues:async()=>[...fieldNames,...attributionNames].filter((name,i)=>(!missingField||i!==0)&&(!missingAttribution||!attributionNames.includes(name))).map(name=>({name,value:values[name]||''})),setFieldValue:(name,value)=>values[name]=value,getFieldValue:async name=>values[name],getConversionId:()=> 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'};
 const window={__xoomGaReady:true,CustomEvent:class {constructor(type,options){this.type=type;this.detail=options.detail;}},dispatchEvent:e=>{events.push(e);listeners[e.type]?.(e);},setTimeout:(fn,ms)=>{const t={fn,ms,cancelled:false};timers.push(t);return t;},clearTimeout:t=>t.cancelled=true,location:{pathname:path,search},document:{cookie:typeof cookie==='function'?cookie(clock.now):cookie,addEventListener:()=>{}},performance:{timeOrigin:clock.now},sessionStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},addEventListener:(name,fn)=>listeners[name]=fn,
 fetch:async(url,init)=>{if(url==='/api/telemetry/form-identity'){reports.push({url,init});if(control.telemetryFailure)throw new Error('blocked');return {ok:true};}requests.push({url,init});if(requests.length>1&&control.renewalGate)await control.renewalGate;return {ok:!control.apiFailure,json:async()=>({ok:true,eventUuid:wrongId?'invalid':guid,token:'unit.test-token-'+requests.length,expiresAt:clock.now+(expired?-1000:900000),validUntil:sessionUntil,formId,sourceUrl:'https://xoomai.com.au/youraiemployee'})};},HubSpotFormsV4:{getFormFromEvent:()=>form}};
 if(ready)window.fbq=(...args)=>meta.push(args);
 const context=vm.createContext({window,Date:ClockDate,URLSearchParams});vm.runInContext(script,context);
 const emit=(name,detail={formId,instanceId:'instance1'})=>listeners[name]?.({detail});return{window,meta,emit,store,context,timers,values,requests,clock,control,events,reports};
}
test('Meta landing values reach contact fields verbatim without emitting a conversion on ready',async()=>{
 const b=harness({search:'?utm_source=instagram&utm_medium=paid_social&utm_campaign=Sales%20%2B%20Ops&utm_id=1200123456789&utm_term=222&utm_content=333&fbclid=synthetic-click'});
 await b.emit('hs-form-event:on-ready');
 const get=n=>b.values['0-1/'+n][0];
 assert.equal(get('xoomai_campaign_source'),'meta_paid');assert.equal(get('xoomai_utm_medium'),'paid_social');
 assert.equal(get('xoomai_campaign_name'),'');assert.equal(get('xoomai_campaign_id'),'1200123456789');
 assert.equal(get('xoomai_utm_term_adset_id'),'222');assert.equal(get('xoomai_utm_content_ad_id'),'333');
 assert.equal(get('xoomai_meta_fbc'),'fb.1.'+b.clock.now+'.synthetic-click');assert.equal(b.meta.length,0);
 await b.emit('hs-form-event:on-submission:success');await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);
 assert.equal(JSON.stringify(b.meta).includes('synthetic-click'),false);
});
test('only explicit paid evidence selects a live source option',async()=>{
 for(const [search,expected] of [
  ['?utm_source=FB&utm_medium=CPC','meta_paid'],['?utm_source=ig&utm_medium=paid','meta_paid'],
  ['?utm_source=google&utm_medium=cpc','google_paid'],['?gclid=synthetic','google_paid'],
  ['?utm_source=facebook&utm_medium=organic',''],['?utm_source=google&utm_medium=organic',''],
  ['?utm_source=unknown&utm_medium=cpc',''],['','']
 ]){const b=harness({search});await b.emit('hs-form-event:on-ready');assert.equal(b.values['0-1/xoomai_campaign_source'][0],expected,search);}
});
test('numeric Meta campaign ID prefers utm_id and rejects invalid IDs without numeric coercion',async()=>{
 for(const [params,expected] of [['utm_id=00123&utm_campaign=456','00123'],['utm_campaign=456','456'],['utm_id=invalid&utm_campaign=456',''],['utm_id=12.3',''],['utm_id=123e4',''],['utm_id=%20123','']]){
  const b=harness({search:'?utm_source=facebook&utm_medium=paid&'+params});await b.emit('hs-form-event:on-ready');assert.equal(b.values['0-1/xoomai_campaign_id'][0],expected);
 }
 const google=harness({search:'?gclid=test&utm_id=123'});await google.emit('hs-form-event:on-ready');assert.equal(google.values['0-1/xoomai_campaign_id'][0],'');
});
test('direct visit clears stale provider-prefilled attribution instead of inventing direct',async()=>{
 const b=harness({initialValues:Object.fromEntries(attributionNames.map(n=>[n,['stale']]))});await b.emit('hs-form-event:on-ready');
 for(const n of attributionNames)assert.equal(b.values[n][0],'');
});
test('only truly absent utm_id permits numeric campaign fallback',async()=>{
 for(const [params,expected] of [
  ['utm_campaign=789','789'],
  ['utm_id=123&utm_id=456&utm_campaign=789',''],
  ['utm_id=123&utm_id=123&utm_campaign=789',''],
  ['utm_id=&utm_campaign=789',''],
  ['utm_id&utm_campaign=789',''],
  ['utm_id=&utm_id=123&utm_campaign=789',''],
  ['utm_id=%20&utm_campaign=789',''],
  ['utm_campaign=789&utm_campaign=456',''],
  ['utm_id=00123&utm_campaign=789','00123']
 ]){
  const b=harness({search:'?utm_source=fb&utm_medium=paid&'+params});await b.emit('hs-form-event:on-ready');
  assert.equal(b.values['0-1/xoomai_campaign_id'][0],expected,params);
  assert.equal(b.values['0-1/xoomai_campaign_name'][0],'');
 }
});
test('duplicate URL keys cannot supply a guessed campaign or source',async()=>{
 const b=harness({search:'?utm_source=facebook&utm_source=google&utm_medium=cpc&utm_campaign=One&utm_campaign=Two&utm_id=12&utm_id=34'});await b.emit('hs-form-event:on-ready');
 for(const n of ['xoomai_campaign_source','xoomai_campaign_name','xoomai_campaign_id'])assert.equal(b.values['0-1/'+n][0],'');
});
test('current-navigation fbc is preserved and older, future or ambiguous cookies are not reused',async()=>{
 for(const [cookie,valid] of [[now=>'_fbc=fb.1.'+now+'.current',true],[now=>'_fbc=fb.1.'+(now-86400000)+'.old',false],[now=>'_fbc=fb.1.'+(now+10000)+'.future',false],[now=>'_fbc=fb.1.'+now+'.one; _fbc=fb.1.'+now+'.two',false]]){
  const b=harness({cookie});await b.emit('hs-form-event:on-ready');assert.equal(b.values['0-1/xoomai_meta_fbc'][0],valid?'fb.1.'+b.clock.now+'.current':'');
 }
});
test('current fbclid replaces a mismatched cookie and is not persisted to conversion queues',async()=>{
 const b=harness({search:'?fbclid=new-click',cookie:now=>'_fbc=fb.1.'+now+'.other-click'});await b.emit('hs-form-event:on-ready');
 assert.equal(b.values['0-1/xoomai_meta_fbc'][0],'fb.1.'+b.clock.now+'.new-click');
 await b.emit('hs-form-event:on-submission:success');assert.equal([...b.store.values()].join('').includes('new-click'),false);
});
test('missing attribution fields emit a nonpersonal readiness signal without changing identity semantics',async()=>{
 const b=harness({missingAttribution:true,search:'?utm_source=fb&utm_medium=paid'});await b.emit('hs-form-event:on-ready');
 const signal=b.events.find(e=>e.type==='xoomFormAttributionUnavailable');assert.ok(signal);assert.deepEqual(Object.keys(signal.detail).sort(),['formId','source_page_path']);
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);
});
test('attribution failures reach the fixed consumer without analytics and cannot exhaust the identity report budget',async()=>{
 const b=harness({ready:false,missingAttribution:true,apiFailure:true,search:'?fbclid=private-click&utm_campaign=private-name'});
 b.window.__xoomGaReady=false;await b.emit('hs-form-event:on-ready');await new Promise(setImmediate);
 assert.equal(b.reports.length,2);
 const bodies=b.reports.map(r=>JSON.parse(r.init.body));assert.deepEqual(bodies.map(x=>x.event).sort(),['attribution_unavailable','identity_unavailable']);
 for(const report of b.reports){assert.equal(report.init.credentials,'omit');assert.equal(report.init.referrerPolicy,'no-referrer');assert.equal(report.init.body.includes('private'),false);}
 for(let i=0;i<60;i++){b.emit('xoomFormAttributionUnavailable',{formId,source_page_path:'/youraiemployee'});b.emit('xoomFormIdentityUnavailable',{formId,source_page_path:'/youraiemployee'});}
 assert.equal(b.reports.length,2);
 const c=harness({ready:false,missingAttribution:true,apiFailure:true,store:b.store,now:b.clock.now});await c.emit('hs-form-event:on-ready');assert.equal(c.reports.length,0);
 b.clock.now+=300000;b.emit('xoomFormAttributionUnavailable',{formId,source_page_path:'/youraiemployee'});assert.equal(b.reports.length,3);
 assert.equal(b.meta.length,0);assert.equal(b.window.dataLayer,undefined);
});
test('returning-visitor attribution replacement after ready is reported without inventing or duplicating a Lead',async()=>{
 for(const field of attributionNames){
  const b=harness({search:'?utm_source=fb&utm_medium=paid&utm_id=123'});await b.emit('hs-form-event:on-ready');
  b.values[field]=['stale-private-value'];await b.emit('hs-form-event:on-submission:success');await b.emit('hs-form-event:on-submission:success');
  assert.equal(b.meta.length,1);assert.equal(b.reports.length,1);assert.equal(JSON.parse(b.reports[0].init.body).event,'attribution_unavailable');
  assert.equal(b.reports[0].init.body.includes('stale-private-value'),false);
 }
});
test('a later URL change or renewal cannot replace the captured landing attribution',async()=>{
 const b=harness({search:'?utm_source=fb&utm_medium=paid&utm_campaign=Initial&utm_id=123'});await b.emit('hs-form-event:on-ready');
 b.window.location.search='?utm_campaign=Later';b.clock.now+=13*60000;b.emit('focus');await new Promise(setImmediate);
 assert.equal(b.values['0-1/xoomai_campaign_name'][0],'');assert.equal(b.values['0-1/xoomai_campaign_id'][0],'123');
});
test('URL campaign names and numeric fallback IDs never populate the campaign name or preserve its prefill',async()=>{
 for(const campaign of ['Friendly Name','123456','<script>untrusted</script>']){
  const b=harness({search:'?utm_source=fb&utm_medium=paid&utm_campaign='+encodeURIComponent(campaign),initialValues:{'0-1/xoomai_campaign_name':['stale-name']}});
  await b.emit('hs-form-event:on-ready');assert.equal(b.values['0-1/xoomai_campaign_name'][0],'');
  assert.equal(b.values['0-1/xoomai_campaign_id'][0],/^[0-9]+$/.test(campaign)?campaign:'');
 }
});
test('prepares one signed identity in hidden fields and sends only after success',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');await b.emit('hs-form-event:on-ready');assert.equal(b.requests.length,1);assert.equal(b.meta.length,0);assert.equal(b.values[fieldNames[0]][0],guid);
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);assert.equal(b.meta[0][3].source_page_path,'/youraiemployee');assert.equal(b.meta[0][1],'1643300670067276');
 b.window.location.pathname='/book';b.emit('ga4Ready');assert.equal(b.window.dataLayer[0][2].event_id,b.meta[0][4].eventID);
});
test('attempts, failed validation and missing readiness produce no conversions',async()=>{
 const b=harness();await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);await b.emit('hs-form-event:on-ready');b.emit('submit');b.emit('hs-form-event:on-submission:failed');assert.equal(b.meta.length,0);
});
test('missing fields, issue failure, expiry or invalid identity never fall back to provider ID',async()=>{
 for(const options of [{missingField:true},{apiFailure:true},{expired:true},{wrongId:true}]){const b=harness(options);await b.emit('hs-form-event:on-ready');await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);}
});
test('duplicate success, ready notifications and script loading emit once',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');await b.emit('hs-form-event:on-submission:success');await b.emit('hs-form-event:on-submission:success');b.emit('metaPixelReady');vm.runInContext(script,b.context);assert.equal(b.meta.length,1);b.timers.find(t=>t.ms===1000).fn();assert.equal(b.window.dataLayer.length,1);
});
test('wrong form and other landing pages are ignored',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready',{formId:'other',instanceId:'1'});await b.emit('hs-form-event:on-submission:success');assert.equal(b.requests.length,0);assert.equal(b.meta.length,0);const c=harness({path:'/book'});await c.emit('hs-form-event:on-ready');assert.equal(c.requests.length,0);
});
test('pending identity survives redirect without duplicate platform events after reload',async()=>{
 const b=harness({ready:false});await b.emit('hs-form-event:on-ready');await b.emit('hs-form-event:on-submission:success');const c=harness({store:b.store,path:'/book'});assert.equal(c.meta.length,1);assert.equal(c.window.dataLayer.length,1);c.emit('metaPixelReady');c.emit('ga4Ready');assert.equal(c.meta.length,1);const d=harness({store:b.store,path:'/book'});assert.equal(d.meta.length,0);assert.equal(d.window.dataLayer,undefined);
});
test('ready source survives navigation before success callback',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.window.location.pathname='/book';await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][3].source_page_path,'/youraiemployee');
});
test('Google waits for destination or inline timeout',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');await b.emit('hs-form-event:on-submission:success');assert.equal(b.window.dataLayer,undefined);b.timers.find(t=>t.ms===1000).fn();b.emit('ga4Ready');assert.equal(b.window.dataLayer.length,1);
});
test('old provider identity queue is not replayed during identity migration',()=>{
 const store=new Map([['xoomai:hubspot-form-conversions:v1',JSON.stringify({sentMeta:[],sentGa:[],pending:[{id:'hs_form_'+guid,path:'/youraiemployee',at:Date.now()}]})]]);const b=harness({store,path:'/book'});assert.equal(b.meta.length,0);
});

test('a form submitted after the original 15-minute window retains its canonical identity',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');const original=b.values[fieldNames[0]][0];
 b.clock.now+=13*60000;const refresh=b.timers.find(t=>!t.cancelled&&t.ms>1000);await refresh.fn();await new Promise(setImmediate);
 assert.equal(b.requests.length,2);assert.equal(JSON.parse(b.requests[1].init.body).token,'unit.test-token-1');
 assert.equal(b.values[fieldNames[0]][0],original);b.clock.now+=3*60000;await b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+original);
});
test('focus renews a suspended tab with the same identity before submission',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=16*60000;b.emit('focus');await new Promise(setImmediate);
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.requests.length,2);
});
test('transient renewal failure retries without replacing the identity',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=13*60000;b.control.apiFailure=true;b.emit('focus');await new Promise(setImmediate);
 const retry=b.timers.find(t=>!t.cancelled&&t.ms===5000);assert.ok(retry);b.control.apiFailure=false;await retry.fn();await new Promise(setImmediate);
 b.clock.now+=3*60000;await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
});
test('unavailable identity emits a non-personal operational signal instead of silently inventing a conversion',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=7*86400000;b.control.apiFailure=true;b.emit('focus');await new Promise(setImmediate);await b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,0);assert.ok(b.events.length>0);assert.equal(b.events[0].type,'xoomFormIdentityUnavailable');assert.equal(b.events[0].detail.formId,formId);assert.deepEqual(Object.keys(b.events[0].detail).sort(),['formId','source_page_path']);
});

test('confirmed success during held focus renewal emits once with the original identity and survives redirect',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');const capturedToken=b.values[fieldNames[1]][0];
 let release;b.control.renewalGate=new Promise(resolve=>release=resolve);b.clock.now+=16*60000;b.emit('focus');
 assert.equal(b.requests.length,2);await b.emit('hs-form-event:on-submission:success');await b.emit('hs-form-event:on-submission:success');
 assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
 b.window.location.pathname='/book';b.emit('ga4Ready');assert.equal(b.window.dataLayer.length,1);
 release();await new Promise(setImmediate);b.emit('metaPixelReady');b.emit('ga4Ready');assert.equal(b.meta.length,1);assert.equal(b.window.dataLayer.length,1);
 assert.equal(b.values[fieldNames[1]][0],capturedToken);assert.equal(b.timers.filter(t=>!t.cancelled&&t.ms>1000).length,0);
 const c=harness({store:b.store,path:'/book'});assert.equal(c.meta.length,0);assert.equal(c.window.dataLayer,undefined);
});
test('a failed renewal does not invalidate a prepared identity within its supported session',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.clock.now+=16*60000;b.control.apiFailure=true;b.emit('focus');await new Promise(setImmediate);
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.meta[0][4].eventID,'hs_form_'+guid);
});

test('failure reports work with missing analytics and contain no signed identity',async()=>{
 const b=harness({ready:false,apiFailure:true});b.window.__xoomGaReady=false;
 await b.emit('hs-form-event:on-ready');
 assert.equal(b.reports.length,1);assert.equal(b.meta.length,0);assert.equal(b.window.dataLayer,undefined);
 const r=b.reports[0];assert.deepEqual(JSON.parse(r.init.body),{event:'identity_unavailable',form:'enquiry',source:'/youraiemployee'});
 assert.equal(r.init.credentials,'omit');assert.equal(r.init.referrerPolicy,'no-referrer');assert.equal(r.init.keepalive,true);
});
test('five-second failure retries are coalesced with a three-report session ceiling across reloads',async()=>{
 const b=harness({apiFailure:true,ready:false});await b.emit('hs-form-event:on-ready');
 for(let i=0;i<180;i++){
   b.clock.now+=5000;await b.timers.filter(t=>!t.cancelled&&t.ms===5000).at(-1).fn();await new Promise(setImmediate);
 }
 assert.equal(b.requests.length,181);assert.equal(b.reports.length,3);assert.equal(b.meta.length,0);
 const c=harness({store:b.store,apiFailure:true,now:b.clock.now});await c.emit('hs-form-event:on-ready');assert.equal(c.reports.length,0);
});
test('blocked analytics and telemetry transport cannot break form retry or invent conversions',async()=>{
 const b=harness({ready:false,apiFailure:true});b.window.gtag=()=>{throw new Error('blocked');};b.window.fbq=()=>{throw new Error('blocked');};b.window.__xoomGaReady=false;b.control.telemetryFailure=true;
 await b.emit('hs-form-event:on-ready');await new Promise(setImmediate);
 b.clock.now+=5000;await b.timers.find(t=>t.ms===5000).fn();await new Promise(setImmediate);
 assert.equal(b.requests.length,2);assert.equal(b.reports.length,1);assert.equal(b.window.dataLayer,undefined);
});
test('returning visitor stale values before ready are overwritten by the newly prepared identity',async()=>{
 const b=harness();for(const name of fieldNames)b.values[name]=['stale-returning-visitor'];
 await b.emit('hs-form-event:on-ready');assert.equal(b.values[fieldNames[0]][0],guid);
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,1);assert.equal(b.reports.length,0);
});
test('late prefill of each hidden field after ready fails closed at success with an alert',async()=>{
 for(const field of fieldNames){const b=harness();await b.emit('hs-form-event:on-ready');b.values[field]=['stale-returning-visitor'];
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);assert.equal(b.window.dataLayer,undefined);assert.equal(b.reports.length,1);
 assert.equal(JSON.parse(b.store.get('xoomai:hubspot-form-conversions:v2')).pending.length,0);}
});
test('unreadable hidden fields at success fail closed with telemetry',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');b.window.HubSpotFormsV4.getFormFromEvent().getFieldValue=async()=>{throw new Error('unavailable');};
 await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);assert.equal(b.reports.length,1);
});
test('duplicate success while read-back is held emits one conversion',async()=>{
 const b=harness();await b.emit('hs-form-event:on-ready');const form=b.window.HubSpotFormsV4.getFormFromEvent();let release;
 const gate=new Promise(resolve=>release=resolve);form.getFieldValue=async name=>{await gate;return b.values[name];};
 const success=b.emit('hs-form-event:on-submission:success');await b.emit('hs-form-event:on-submission:success');assert.equal(b.meta.length,0);
 release();await success;assert.equal(b.meta.length,1);
});
