import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {currentFrenchLemmaSenses} from './prepare-micromegas-chapter-01-shared-snapshot.mjs';

const root=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=name=>readFileSync(resolve(root,name));
const read=name=>JSON.parse(bytes(name));
const hash=value=>createHash('sha256').update(value).digest('hex');
const drafts=Array.from({length:24},(_,n)=>read(`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`).items).flat();
const exact=read('chapter-01-shared-identity-01.json');
const first=read('chapter-01-shared-lemma-01.json');
const second=read('chapter-01-shared-lemma-02.json');
const reviews=new Map([...exact.items,...first.items,...second.items].map(item=>[item.key,item]));
if(reviews.size!==236||drafts.length!==236)throw Error('Every distinct chapter I draft needs one identity decision');
const metSense='sns_fr_mettre_reflexive_begin';
if(!currentFrenchLemmaSenses('mettre').some(s=>s.senseId===metSense))throw Error('Published reflexive-begin sense missing');
const entries=drafts.map(draft=>{
 const decision=reviews.get(draft.key);
 if(!decision||decision.form!==draft.form||decision.draftMeaning!==draft.meaning||decision.draftQuestionsSha256!==hash(JSON.stringify(draft.questions)))throw Error(`Stale decision: ${draft.key}`);
 let route, targetSenseId, targetIdentity, group;
 if(decision.decision==='reuse_ready'){
  route='reuse_exact_published_identity';targetIdentity=decision.selectedIdentity;
 }else if(decision.decision==='link_published_sense'){
  route='add_surface_to_published_sense';targetSenseId=decision.selectedSenseId;
 }else if(draft.key==='met_begins_reflexive'){
  route='add_surface_to_published_sense';targetSenseId=metSense;
 }else if(decision.decision==='reuse_pending_activation'){
  route='published_identity_pending_first_use_approval';targetIdentity=decision.selectedIdentity;
 }else if(['separate','new_sense_existing_lemma','new_lemma_sense'].includes(decision.decision)){
  route=decision.decision==='new_lemma_sense'?'new_lemma_and_sense':'new_sense';
  group=decision.newSenseGroup??(draft.key==='géomètres_geometry'?'géomètre:geometry_specialist':draft.key==='etoile_literal_star'?'étoile:literal_celestial':`${draft.lemma}:${draft.key}`);
 }else throw Error(`Unrecognized decision ${draft.key}: ${decision.decision}`);
 return {key:draft.key,form:draft.form,lemma:draft.lemma,meaning:draft.meaning,partOfSpeech:draft.partOfSpeech,sourceOccurrencesSha256:hash(JSON.stringify(draft.sourceOccurrences)),workwideUseCount:draft.sourceOccurrences.length,chapterOneUseCount:draft.sourceOccurrences.filter(o=>o.chapter===1).length,questionSha256:hash(JSON.stringify(draft.questions)),questionBands:draft.questions.map(q=>q.band),priorDecision:decision.decision,route,...(targetIdentity?{targetIdentity}:{}),...(targetSenseId?{targetSenseId}:{}),...(group?{intendedSenseGroup:group}:{}),status:route==='published_identity_pending_first_use_approval'?'blocked_until_first_indexed_use_and_quiz_approval':'offline_import_plan_pending_complete_work_signoff'};
});
const groups={};for(const e of entries)if(e.intendedSenseGroup)(groups[e.intendedSenseGroup]??=[]).push(e.key);
for(const [name,count] of Object.entries({'habitant:person_residing':2,'planète:celestial_body':2,'géomètre:geometry_specialist':2,'voyager:travel':2,'étoile:literal_celestial':2}))if(groups[name]?.length!==count)throw Error(`Unresolved cross-surface group ${name}`);
const summary=Object.fromEntries([...new Set(entries.map(e=>e.route))].map(k=>[k,entries.filter(e=>e.route===k).length]));
if(summary.reuse_exact_published_identity!==5||summary.add_surface_to_published_sense!==29||summary.published_identity_pending_first_use_approval!==1||summary.new_lemma_and_sense!==145||summary.new_sense!==56)throw Error(`Unexpected identity routes ${JSON.stringify(summary)}`);
writeFileSync(resolve(root,'chapter-01-identity-plan.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'offline_import_mapping_unpublished',sourceSha256:hash(bytes('canonical-draft.txt')),unitPlanSha256:hash(bytes('unit-plan.json')),coverageSha256:hash(bytes('chapter-01-coverage.json')),reviewEvidence:Object.fromEntries(['chapter-01-shared-identity-01.json','chapter-01-shared-lemma-01.json','chapter-01-shared-lemma-02.json'].map(name=>[name,hash(bytes(name))])),note:'One source-bound draft-to-sense route for every chapter I draft. The 29 surface additions include present met linking the already published reflexive-begin sense (not the same-form place sense). The historical sky identity still needs first-use approval; this map does not import the seven-chapter work.',summary,sharedNewSenseGroups:Object.fromEntries(Object.entries(groups).filter(([,keys])=>keys.length>1)),items:entries},null,2)+'\n');
console.log(JSON.stringify({items:entries.length,summary}));
