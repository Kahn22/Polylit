import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';
import {loadPublication} from './micromegas-publication-baseline.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const key=o=>`${o.unit}:${o.start}:${o.end}`;
const equal=(a,b)=>hash(a)===hash(b);

/** Compose evidence, never import records or grant editorial approval. */
export function composeMicromegas(folder){
 const cache=new Map(),evidence={};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const ensure=(v,m)=>{if(!v)throw Error(`Micromégas composition: ${m}`);};
 const files=readdirSync(folder).filter(f=>f.endsWith('.json')).sort();
 const plan=read('unit-plan.json'),units=plan.units;
 const rows=units.flatMap(u=>tokenizeFrench(u.text).map(t=>({chapter:u.chapter,unit:u.ordinal,start:t.start,end:t.end,text:t.text,form:t.normalized,base:null,overlays:[],owner:null})));
 const tokens=new Map(rows.map(t=>[key(t),t]));
 const source=o=>{const t=tokens.get(key(o));ensure(t&&t.text===o.text,`exact token ${key(o)} ${o.text}`);return t;};
 const ref=(file,selector)=>({file,selector});
 const bank=(file,id)=>{const d=read(file),i=d.items?.find(i=>i.key===id);if(i&&!i.questions&&(i.earlierBatch||i.earlierFile||i.batchFile))return bank(i.earlierBatch??i.earlierFile??i.batchFile,i.earlierKey??id);ensure(i?.questions?.length===3,`missing three-band bank ${file}:${id}`);return{kind:'draft_bank',file,key:id,questionSha256:hash(i.questions)};};
 const published=id=>({kind:'published_identity',identity:id});
 const assignment=(o,owner,e)=>{const t=source(o);if(t.base){ensure(equal(t.base.owner,owner),`conflicting chapter dispositions ${key(o)}`);t.base.evidence.push(e);}else t.base={owner,evidence:[e]};};
 const occs=i=>i.sourceOccurrences??i.occurrences??(i.sourceOccurrence?[i.sourceOccurrence]:i.occurrence?[i.occurrence]:[]);

 // Chapters I–III use explicit draft/reuse partitions. Chapter I has later
 // reuse/name/component reviews instead of a rewritten coverage inventory.
 const oneReuse=new Map();
 for(const file of files.filter(f=>/^chapter-01-(reuse|ambiguous)-\d+\.json$/.test(f)))for(const [n,i]of read(file).items.entries())for(const o of occs(i)){
  const id=o.identity??i.identity;ensure(id,`explicit chapter I identity ${file}:${n}`);
  const k=key(o),prior=oneReuse.get(k);ensure(!prior||prior.identity===id,`chapter I reuse conflict ${k}`);oneReuse.set(k,{identity:id,evidence:ref(file,`/items/${n}`)});
 }
 const oneNames=read('chapter-01-names-01.json'),oneComponents=read('chapter-01-phrase-components.json');
 for(let chapter=1;chapter<=3;chapter++){
  const file=`chapter-0${chapter}-coverage.json`,c=read(file);
  const actual=rows.filter(t=>t.chapter===chapter);ensure(c.tokens.length===actual.length,`chapter ${chapter} inventory size`);
  for(const [n,t]of c.tokens.entries()){
   ensure(key(t)===key(actual[n])&&t.text===actual[n].text,`chapter ${chapter} inventory order`);const e=ref(file,`/tokens/${n}`);
   if(t.draft)assignment(t,bank(t.draft.file,t.draft.key),e);
   else if(t.reuse)assignment(t,published(t.reuse.identity),e);
   else if(t.exclusion)assignment(t,{kind:'proper_name_exclusion'},e);
   else if(t.component)assignment(t,{kind:'phrase_component_reference',target:t.component.expressionKey},e);
   else if(chapter===1&&oneReuse.has(key(t))){const a=oneReuse.get(key(t));assignment(t,published(a.identity),a.evidence);}
   else if(chapter===1&&oneNames.names.some(i=>occs(i).some(o=>key(o)===key(t))))assignment(t,{kind:'proper_name_exclusion'},ref('chapter-01-names-01.json','/names'));
   else if(chapter===1&&oneComponents.items.some(i=>key(i.occurrence)===key(t))){const i=oneComponents.items.find(i=>key(i.occurrence)===key(t));assignment(t,{kind:'phrase_component_reference',target:i.expressionKey},ref('chapter-01-phrase-components.json',`/items/${oneComponents.items.indexOf(i)}`));}
   else ensure(false,`unresolved chapter ${chapter} token ${key(t)} ${t.text}`);
  }
 }

 const findEvidence=(file,k,t)=>{
  const d=read(file);let items=d.items??[];
  const coordinates=i=>occs(i).some(o=>key(o)===key(t))||(Number.isInteger(i.unit)&&key(i)===key(t));
  const exact=items.filter(i=>coordinates(i)&&(i.key===k||i.earlierKey===k||i.form===k||i.identity===k||i.dependsOn===k));
  if(exact.length===1)return exact[0];
  const match=items.filter(i=>i.key===k||i.earlierKey===k||i.form===k||i.identity===k);
  ensure(match.length===1,`unique evidence ${file}:${k} for ${key(t)}`);return match[0];
 };
 const ownerFromEvidence=(file,k,t,disposition)=>{
  if(/proper_name/.test(disposition))return{kind:'proper_name_exclusion'};
  if(/batch/.test(file))return bank(file,k);
  const i=findEvidence(file,k,t);
  if(i.identity)return published(i.identity);
  if(i.earlierFile&&i.earlierKey)return bank(i.earlierFile,i.earlierKey);
  if(i.earlierBatch)return bank(i.earlierBatch,i.key);
  if(i.senseId)return{kind:'shared_sense_dependency',senseTarget:i.senseId};
  if(i.dependsOn){const[f,id]=i.dependsOn.split(':'),dep=read(f).items?.find(a=>a.key===id);ensure(dep,`dependency ${i.dependsOn}`);if(dep.batchFile)return bank(dep.batchFile,id);if(/identity-plan/.test(f)){const batches=files.filter(file=>/^chapter-.*batch.*\.json$/.test(file)&&read(file).items?.some(b=>b.key===id&&b.questions));ensure(batches.length===1,`unique authored bank for ${i.dependsOn}`);return bank(batches[0],id);}return{kind:'prior_plan_reference',file:f,key:id};}
  if(i.expressionKey||/expression|component/.test(disposition))return{kind:'phrase_component_reference',target:i.expressionKey??k,evidenceFile:file};
  ensure(false,`unknown chapter evidence owner ${file}:${k}`);
 };
 for(let chapter=4;chapter<=5;chapter++){
  const file=`chapter-0${chapter}-coverage.json`,c=read(file),actual=rows.filter(t=>t.chapter===chapter);
  ensure(c.tokens.length===actual.length,`chapter ${chapter} inventory size`);
  for(const [n,t]of c.tokens.entries()){ensure(key(t)===key(actual[n])&&t.text===actual[n].text,`chapter ${chapter} source order`);assignment(t,ownerFromEvidence(t.evidenceFile,t.evidenceKey,t,t.disposition),ref(file,`/tokens/${n}`));}
 }

 // VI–VII retain earlier workwide banks and have source-order review packages.
 for(let chapter=6;chapter<=7;chapter++){
  const file=`chapter-0${chapter}-inventory.json`,inventory=read(file),actual=rows.filter(t=>t.chapter===chapter);
  ensure(inventory.tokens.length===actual.length,`chapter ${chapter} inventory size`);
  for(const[n,t]of inventory.tokens.entries()){ensure(key(t)===key(actual[n])&&t.text===actual[n].text,`chapter ${chapter} source order`);if(t.earlierDraft)assignment(t,bank(t.earlierDraft.file,t.earlierDraft.key),ref(file,`/tokens/${n}`));}
  for(const[n,i]of read('chapter-04-07-names.json').items.entries())for(const o of occs(i).filter(o=>o.chapter===chapter))assignment(o,{kind:'proper_name_exclusion'},ref('chapter-04-07-names.json',`/items/${n}`));
  for(const[n,i]of read('chapter-04-07-carryover-review.json').items.entries())for(const o of occs(i).filter(o=>o.chapter===chapter))assignment(o,bank(i.earlierBatch,i.key),ref('chapter-04-07-carryover-review.json',`/items/${n}`));
  const progress=read(`chapter-0${chapter}-progress.json`),packages=chapter===6?[{reviewFile:progress.reviewFiles[0],batchFile:'chapter-06-batch-01.json'},...progress.continuationPackages]:progress.packages;
  for(const pack of packages){const review=read(pack.reviewFile);for(const [n,i]of [...review.items,...review.holds].entries())for(const o of occs(i)){
   const owner=i.decision==='published'?published(i.identity):i.decision==='earlier'?bank(i.earlierFile,i.earlierKey):i.decision==='draft'?bank(pack.batchFile,i.proposalKey):{kind:'held_chapter_dependency',target:i.form,reason:i.reason};
   assignment(o,owner,ref(pack.reviewFile,`/${n<review.items.length?'items':'holds'}/${n<review.items.length?n:n-review.items.length}`));
  }}
 }
 ensure(rows.every(t=>t.base),`missing base dispositions: ${rows.filter(t=>!t.base).slice(0,8).map(key)}`);
 for(const t of rows)t.owner=structuredClone(t.base.owner);

 const override=(o,owner,e,reason)=>{const t=source(o);t.overlays.push({evidence:e,previousOwner:t.owner,owner,reason});t.owner=owner;};
 const heldFile='chapter-06-held-context-review-03.json';
 for(const[n,i]of read(heldFile).items.entries())for(const o of occs(i))override(o,bank(heldFile,i.key),ref(heldFile,`/items/${n}`),'Explicit held-context resolution, with the earlier hold retained.');

 // Named whole-work decisions retain symbolic targets until bank reconciliation.
 const ledgerFile='whole-work-review-ledger-01.json';
 const ledger=read(ledgerFile);
 for(const[uIndex,u]of ledger.candidateSourceReview.entries())for(const[n,t]of u.tokens.entries()){
  if(t.expressionKey)override({...t,unit:u.unit},{kind:'phrase_component_reference',target:t.expressionKey},ref(ledgerFile,`/candidateSourceReview/${uIndex}/tokens/${n}`),'Complete expression ownership from whole-work review 01.');
  else if(t.decision.startsWith('reuse_')){const candidates=ledger.items.filter(i=>i.identity.split(':')[0]&&(i.key.startsWith(`${t.normalized}:`)||i.key.startsWith('sentir:')&&t.normalized==='sentit'));if(candidates.length===1)override({...t,unit:u.unit},published(candidates[0].identity),ref(ledgerFile,`/candidateSourceReview/${uIndex}/tokens/${n}`),t.decision);else if(t.normalized==='puisque'||t.normalized==='puisqu’'){const c=ledger.items.find(i=>i.key.startsWith('puisque:')&&i.identity.split(':')[0]===(t.normalized==='puisque'?'srf_zola_puisque_puisque':'srf_zola_puisqu_6e17d07b702e_puisque'));ensure(c,'exact reviewed puisque surface');override({...t,unit:u.unit},published(c.identity),ref(ledgerFile,`/candidateSourceReview/${uIndex}/tokens/${n}`),t.decision);}}
 }
 const scopePlans=[],scopeRoutes=new Map(),routeRefinements=[];
 const authorizedRouteRefinements=new Map([
  ['131:23:27','11:12'],['121:90:95','11:13'],['6:71:76','25:26'],['87:51:55','25:26'],['124:191:196','25:26'],['131:45:49','25:26'],['136:59:68','25:26'],['136:115:120','25:26'],['213:10:16','19:41'],
 ]);
 for(let n=3;n<=41;n++){if(n===40)continue;const file=`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`,d=read(file);scopePlans.push({number:n,file,sha256:evidence[file]});
  for(const[uIndex,u]of (d.candidate??[]).entries())for(const[tIndex,t]of u.tokens.entries()){
   const route=t.route;
   const coordinate=key({...t,unit:u.unit}),prior=scopeRoutes.get(coordinate);
   if(prior&&prior.route!==route){ensure(authorizedRouteRefinements.get(coordinate)===`${prior.scope}:${n}`,`unrecorded scope route collision ${coordinate} ${prior.scope}:${n}`);routeRefinements.push({coordinate,text:t.text,before:prior,after:{scope:n,route,evidence:ref(file,`/candidate/${uIndex}/tokens/${tIndex}`)}});}
   scopeRoutes.set(coordinate,{scope:n,route,evidence:ref(file,`/candidate/${uIndex}/tokens/${tIndex}`)});
   const owner=route.startsWith('retain')?tokens.get(key({...t,unit:u.unit})).owner:route.startsWith('expression:')?{kind:'phrase_component_reference',target:route.slice(11)}:route.startsWith('deferred')||route.startsWith('held_')?{kind:'held_scope_dependency',target:route}:{kind:'reviewed_sense_route',senseTarget:route,baseOwner:tokens.get(key({...t,unit:u.unit})).base.owner};
   override({...t,unit:u.unit},owner,ref(file,`/candidate/${uIndex}/tokens/${tIndex}`),t.reviewNote);
  }
  for(const[n,i]of (d.ellipticalSources??[]).entries())override(i,{kind:'reviewed_sense_route',senseTarget:i.identityTarget,baseOwner:source(i).base.owner},ref(file,`/ellipticalSources/${n}`),'Exact elliptical verb; no absent noun or expression surface is manufactured.');
 }

 ensure(routeRefinements.length===authorizedRouteRefinements.size,'all nine explicit route refinements composed');
 const phrases=new Map();
 const vIdentityByKey=new Map(read('chapter-05-expression-review.json').items.filter(i=>i.identity?.startsWith('srf_')).map(i=>[i.key,i.identity]));
 const phrase=(file,selector,o,components,target,authority)=>{
  if(!o.unit)return;const u=units[o.unit-1];ensure(u.text.slice(o.start,o.end)===o.text,`phrase envelope ${file} ${key(o)}`);
  const ts=components.filter(t=>(t.unit??o.unit)===o.unit&&t.start>=o.start&&t.end<=o.end).map(t=>({...t,unit:o.unit}));
  ensure(ts.length>0,`explicit phrase segments ${file} ${key(o)}`);for(const t of ts)source(t);
  if(o.spanKind==='explicit_lexical_segments'){const expected=tokenizeFrench(u.text).filter(t=>o.lexicalSegments.some(s=>t.start>=s.start&&t.end<=s.end));ensure(expected.length===ts.length&&expected.every(t=>ts.some(s=>s.start===t.start&&s.end===t.end&&s.text===t.text)),`segment-only ownership ${file} ${key(o)}`);}
  const segments=ts.map(t=>({start:t.start,end:t.end,text:t.text}));
  const id=`${key(o)}:${hash(segments).slice(0,16)}`;const claim={evidence:ref(file,selector),target,authority};
  if(phrases.has(id)){const old=phrases.get(id);old.claims.push(claim);if(authority>old.selected.authority)old.selected=claim;}
  else phrases.set(id,{id,unit:o.unit,start:o.start,end:o.end,text:o.text,lexicalSegments:segments,claims:[claim],selected:claim});
 };
 // These chapter records explicitly enumerate owned lexical tokens. Nothing
 // between discontinuous segments is inferred to be a phrase component.
 for(const file of files.filter(f=>/^chapter-/.test(f)&&(/expression/.test(f)||/droit-fil|entre-deux-eaux/.test(f))))for(const[n,i]of (read(file).items??[]).entries()){
  if(i.identity?.startsWith('srf_')||vIdentityByKey.has(i.key))continue;
  const ts=i.componentTokens??i.componentTokenHolds;if(!ts?.length)continue;
  for(const[oIndex,o]of occs(i).entries())phrase(file,`/items/${n}/sourceOccurrences/${oIndex}`,o,ts,i.identityTarget??i.key,0);
 }
 // The first three chapters use whole-phrase QA spans instead of token arrays.
 const qa1=read('chapter-01-expression-qa.json'),expressions1=read('chapter-01-expressions-01.json');
 for(const[n,q]of qa1.items.entries()){const i=expressions1.items.find(i=>i.key===q.key);for(const[oIndex,o]of q.masteryOccurrences.entries()){
  const ts=tokenizeFrench(units[o.unit-1].text).filter(t=>t.start>=o.start&&t.end<=o.end);phrase('chapter-01-expression-qa.json',`/items/${n}/masteryOccurrences/${oIndex}`,o,ts,i.key,0);
 }}
 for(const chapter of [2,3]){const file=`chapter-0${chapter}-expressions.json`;for(const[n,i]of read(file).items.entries()){
  if(!i.questions?.length&&i.disposition!=='link_existing_chapter_two_expression')continue;
  for(const[oIndex,o]of occs(i).entries()){const ts=tokenizeFrench(units[o.unit-1].text).filter(t=>t.start>=o.start&&t.end<=o.end);phrase(file,`/items/${n}/occurrences/${oIndex}`,o,ts,i.key,0);}
 }}
 const fourthPhrases='chapter-04-07-expressions.json';
 const earlierAPeine=read('chapter-02-expressions.json').items.find(i=>i.key==='a_peine');ensure(earlierAPeine?.questions?.length===3,'reviewed earlier à peine bank');
 for(const[n,i]of read(fourthPhrases).items.entries())if(i.key==='a_peine')for(const[oIndex,o]of occs(i).entries())if(o.chapter===4){const ts=tokenizeFrench(units[o.unit-1].text).filter(t=>t.start>=o.start&&t.end<=o.end);ensure(ts.every(t=>source({...t,unit:o.unit}).base.owner.kind==='prior_plan_reference'),'exact reviewed IV à peine component references');phrase(fourthPhrases,`/items/${n}/occurrences/${oIndex}`,o,ts,'a_peine',0);}
 const fullFile='whole-work-component-plan-01.json';
 for(const[n,i]of read(fullFile).items.entries())phrase(fullFile,`/items/${n}`,i.sourceOccurrence,i.componentTokens,i.expressionKey,1);
 for(const s of scopePlans){const d=read(s.file);for(const[n,i]of (d.candidatePhraseComponents??[]).entries())phrase(s.file,`/candidatePhraseComponents/${n}`,i,i.componentTokens,i.expressionTarget??i.expressionKey??i.target??i.route,s.number);
  for(const[n,i]of (d.newExpressions??[]).entries())for(const[oIndex,o]of (i.sourceOccurrences??[]).entries())if(o.unit){const explicit=o.componentTokens??i.componentTokens??d.candidatePhraseComponents?.find(a=>key(a)===key(o))?.componentTokens;phrase(s.file,`/newExpressions/${n}/sourceOccurrences/${oIndex}`,o,explicit??[],o.expressionTarget??i.senseGroup??i.plannedTarget??i.identityTarget??i.key,s.number);}
 }
 const phraseMembership=new Map(),phraseConflicts=[];
 for(const p of phrases.values())for(const s of p.lexicalSegments){const k=key({...s,unit:p.unit});if(phraseMembership.has(k)&&phraseMembership.get(k)!==p.id)phraseConflicts.push({coordinate:k,first:phraseMembership.get(k),second:p.id});else phraseMembership.set(k,p.id);}
 ensure(phraseConflicts.length===0,'overlapping complete phrase ownership');
 for(const[k,id]of phraseMembership){const p=phrases.get(id),t=tokens.get(k);override(t,{kind:'complete_expression_component',phraseId:id,target:p.selected.target},p.selected.evidence,'Own only the explicitly reviewed lexical segments; preserve every intervening word independently.');}

 // Previously learned word locutions remain vocabulary identities. Their
 // accompanying words have coverage references, never duplicate phrase mastery.
 const publication=loadPublication(),attachments=new Map();
 for(const file of files.filter(f=>/^chapter-/.test(f)&&/expression/.test(f)))for(const[n,i]of (read(file).items??[]).entries()){
  const identity=i.existing?.vocabularyIdentity??i.identity??vIdentityByKey.get(i.key);if(!identity?.startsWith('srf_'))continue;
  const surface=publication.bundle.surfaceForms.find(s=>s.id===identity.split(':')[0]);ensure(surface,`published locution anchor ${identity}`);
  for(const[oIndex,o]of occs(i).entries())if(o.unit){const ts=tokenizeFrench(units[o.unit-1].text).filter(t=>t.start>=o.start&&t.end<=o.end),anchors=ts.filter(t=>t.normalized===surface.normalized);ensure(anchors.length===1,`one locution anchor ${file} ${key(o)}`);const id=`${key(o)}:${identity}`,a={id,unit:o.unit,start:o.start,end:o.end,text:o.text,identity,anchor:{unit:o.unit,start:anchors[0].start,end:anchors[0].end,text:anchors[0].text},componentTokens:ts.map(t=>({unit:o.unit,start:t.start,end:t.end,text:t.text})),evidence:ref(file,`/items/${n}/${i.sourceOccurrence?'sourceOccurrence':'occurrences'}/${oIndex}`)};
   if(!attachments.has(id))attachments.set(id,a);
  }
 }
 for(const a of attachments.values()){override(a.anchor,published(a.identity),a.evidence,'Retain the existing Surface+Sense locution anchor and mastery.');for(const t of a.componentTokens)if(key(t)!==key(a.anchor))override(t,{kind:'attached_word_locution_component',attachmentId:a.id,anchor:a.anchor,identity:a.identity},a.evidence,'Component coverage belongs to an existing word locution; no independent duplicate mastery.');}
 // Two reviewed compositional omissions refer to a specific neighboring word.
 for(const t of rows.filter(t=>t.owner.kind==='prior_plan_reference')){
  const o=t.owner;
  if(o.file==='chapter-04-batch-07.json'&&o.key==='mi_jambe_halfway_up_the_leg'){const b=read(o.file).items.find(i=>i.key===o.key),anchor=b.sourceOccurrences.find(a=>a.unit===t.unit);ensure(anchor,'mi-jambe anchor');override(t,{kind:'attached_word_locution_component',anchor,bank:bank(o.file,o.key)},ref('chapter-04-final-dispositions.json',`coordinate:${key(t)}`),'Preserve the exact reviewed compositional à omission beside mi-jambe.');}
  else if(o.file==='chapter-01-expressions-01.json'&&o.key==='se_mettre_a'){const i=expressions1.items.find(i=>i.key===o.key),span=occs(i).find(s=>s.unit===t.unit&&t.start>=s.start&&t.end<=s.end),verb=tokenizeFrench(units[t.unit-1].text).find(v=>v.start>=span.start&&v.end<=span.end&&v.normalized==='mit');ensure(verb,'reviewed reflexive-begin anchor');override(t,{kind:'attached_word_locution_component',anchor:{unit:t.unit,...verb},identity:i.existing.reusablePastIdentity},ref('chapter-04-final-dispositions.json',`coordinate:${key(t)}`),'Preserve the exact reviewed à component omission and existing mit onset identity.');}
 }

 const bankBindings=new Map(),bankRefinements=[];
 const authorizedBankRefinements=new Map([
  ['chapter-05-held-batch-03.json:pris_caught_in_act','11:12'],['chapter-02-batch-17.json:fais_cut_a_figure','25:27'],['chapter-05-batch-04.json:faire_chapter_05_04_faisons','25:27'],['chapter-05-held-batch-02.json:faire_ferait_chapter_05_held_01_122','25:27'],['chapter-07-batch-05.json:reprit_chapter_07_05_213_10','19:41'],
 ]);
 const bindBank=(b,file,selector,authority)=>{if(!b.file||!b.key)return;const k=`${b.file}:${b.key}`,entry={file:b.file,key:b.key,beforeQuestionSha256:hash(b.before.questions),afterQuestionSha256:hash((b.after??b.before).questions),identityTarget:b.identityTarget??b.target??null,...(b.canonicalOwner?{canonicalOwner:b.canonicalOwner}:{}),evidence:ref(file,selector),authority};const previous=bankBindings.get(k);if(previous){ensure(previous.beforeQuestionSha256===entry.beforeQuestionSha256,`bank refinements share exact predecessor ${k}`);ensure(authorizedBankRefinements.get(k)===`${previous.authority}:${authority}`,`unrecorded bank refinement ${k}`);bankRefinements.push({bank:k,before:previous,after:entry});}bankBindings.set(k,entry);};
 const ownerFile='whole-work-owner-plan-02.json';for(const[n,i]of read(ownerFile).items.entries())for(const[bIndex,b]of (i.candidateBindings??[]).entries())bindBank({...b,canonicalOwner:i.canonicalOwner},ownerFile,`/items/${n}/candidateBindings/${bIndex}`,2);
 for(const s of scopePlans)for(const[n,b]of (read(s.file).candidateBindings??[]).entries())bindBank(b,s.file,`/candidateBindings/${n}`,s.number);
 ensure(bankRefinements.length===authorizedBankRefinements.size,'all five explicit bank refinements composed');
 for(const t of rows){const b=t.owner.kind==='draft_bank'?t.owner:t.owner.baseOwner;if(b?.kind==='draft_bank'&&bankBindings.has(`${b.file}:${b.key}`))t.bankBinding=bankBindings.get(`${b.file}:${b.key}`);}
 const ownerCounts={};for(const t of rows)ownerCounts[t.owner.kind]=(ownerCounts[t.owner.kind]??0)+1;
 const danglingComponents=rows.filter(t=>t.owner.kind==='phrase_component_reference');
 ensure(rows.every(t=>!t.owner.kind.startsWith('held_')&&t.owner.kind!=='prior_plan_reference')&&danglingComponents.length===0,'all chapter placeholders receive an exact composed owner');
 return{version:1,status:'offline_source_composition_unapplied',workId:'wrk_voltaire_micromegas',sourceSha256:sha(readFileSync(`${folder}/canonical-draft.txt`)),unitPlanSha256:evidence['unit-plan.json'],publicationBaseline:{bundleSha256:hash(publication.bundle),expressionCatalogSha256:hash(publication.expressionCatalog),quizzesSha256:hash([...publication.preparedQuizzes.values()])},masteryPolicy:'No copied mastery, reset, publication approval or encounter. Final Surface+Sense and expression surface identities encounter only on exact thought-unit view.',scopePlans,evidenceSha256:evidence,routeRefinements,units:units.map(u=>({unit:u.ordinal,chapter:u.chapter,contextSha256:hash(u.text)})),tokens:rows,phrases:[...phrases.values()],wordLocutionAttachments:[...attachments.values()],phraseConflicts,bankBindings:[...bankBindings.values()],bankRefinements,danglingComponents:danglingComponents.map(t=>({coordinate:key(t),text:t.text,target:t.owner.target})),summary:{sourceUnits:units.length,sourceTokens:rows.length,baseDispositions:rows.filter(t=>t.base).length,overlaidTokens:rows.filter(t=>t.overlays.length).length,heldRoutes:rows.filter(t=>t.owner.kind.startsWith('held_')).length,phraseSpans:phrases.size,phraseComponentUses:phraseMembership.size,phraseConflicts:phraseConflicts.length,wordLocutionAttachments:attachments.size,danglingComponentUses:danglingComponents.length,refinedBankSelectors:bankBindings.size,bankRefinements:bankRefinements.length,routeRefinements:routeRefinements.length,ownerCounts},nextAction:'Materialize final Surface+Sense and expression surface targets and choose one reviewed bank per identity before constructing an isolated import candidate.'};
}
