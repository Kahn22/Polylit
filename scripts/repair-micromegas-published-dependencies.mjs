import {createHash} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPublication,publicationRoot,validatePublication} from '../dist/publication/repository.js';
import {approveReview,pendingReview} from '../dist/publication/editorial.js';
import {auditEditorialQuality,editorialSubjects} from '../dist/publication/quality-audit.js';
import {quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
import {fromNeutral,toNeutral} from '../dist/publication/format.js';
import {adoptSourceFiles,reconcileQuizzes,sharedSourceFiles} from '../dist/publication/source-store.js';

const dryRun=process.argv.includes('--dry-run');
const batchId='fr-micromegas-shared-repair-2026-09-27-01';
const batchFile=`editorial-batches/${batchId}.json`;
const reviewFile=`editorial-review-batches/${batchId}.json`;
if(existsSync(resolve(publicationRoot,batchFile)))throw Error('Repair already applied');
const root=resolve('content/sources/wrk_voltaire_micromegas');
const repair=JSON.parse(readFileSync(resolve(root,'chapter-01-published-repair-plan.json')));
if(repair.status!=='reviewed_repair_proposals_no_published_mutation'||repair.items.length!==3)throw Error('Repair plan changed');
const p=loadPublication(),source=p.sharedSources.fr,content=fromNeutral(source.legacy.content);
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const changes=[],reviewChanges=[];
const quizReason='Replaced the three rejected dictionary-placeholder sky questions with the source-reviewed Micromégas contexts; retained their IDs, target identity, and three separate bands. The identity has no indexed published use until Micromégas import.';
for(const entry of repair.items){
 const index=content.senses.findIndex(s=>s.id===entry.senseId),before=content.senses[index];
 if(!before||sha(before)!==entry.publishedSenseSnapshotSha256)throw Error(`Published sense changed: ${entry.key}`);
 for(const dep of entry.publishedIdentityDependencies){
  const old=p.bundle.occurrences.filter(o=>o.surfaceFormId===dep.surfaceId&&o.senseId===entry.senseId).map(o=>({id:o.id,workId:o.workId,unitId:o.unitId,start:o.start,end:o.end}));
  const quizzes=[...p.preparedQuizzes.values()].filter(q=>q.subject?.surfaceFormId===dep.surfaceId&&q.subject?.senseId===entry.senseId).map(q=>({id:q.id,band:q.band,sha256:sha(q)}));
  if(JSON.stringify(old)!==JSON.stringify(dep.occurrences)||JSON.stringify(quizzes)!==JSON.stringify(dep.quizzes))throw Error(`Published dependencies changed: ${entry.key}`);
 }
 if(entry.proposedGloss){
  const after={...before,gloss:entry.proposedGloss};content.senses[index]=after;
  changes.push({kind:'senses',id:before.id,before,after,reason:entry.action});
 }else{
  if(entry.key!=='ciel_visible_sky'||entry.proposedReplacementBands.length!==3)throw Error('Unexpected question proposal');
  for(const spec of entry.proposedReplacementBands){
   const band={'1-3':'levels_1_3','4-5':'levels_4_5','6-8':'levels_6_8'}[spec.band];
   const qIndex=content.quizItems.findIndex(q=>q.senseId===entry.senseId&&q.band===band);
   const old=content.quizItems[qIndex];if(!old)throw Error(`Missing sky band ${band}`);
   const fields=band==='levels_1_3'?{contextFrench:spec.context,targetText:'ciel',correctAnswer:spec.answer,choicesEnglish:spec.choices,prompt:'Meaning'}:band==='levels_4_5'?{contextFrench:spec.context,correctAnswer:spec.answer,choicesFrench:spec.choices}:{contextFrench:spec.context,promptFrench:spec.question,correctAnswer:spec.answer,choicesFrench:spec.choices};
   const after={...old,...fields};content.quizItems[qIndex]=after;
   changes.push({kind:'quizItems',id:old.id,before:old,after,reason:quizReason});
  }
 }
}
const legacy={...source.legacy,content:toNeutral(content)};
const quizzes=reconcileQuizzes(source,legacy);
for(const q of quizzes.filter(q=>repair.items.some(e=>e.senseId===q.subject?.senseId)))if(quizEditorialIssues(q).length)throw Error(`Question failed review: ${q.id}: ${quizEditorialIssues(q)}`);
const senseMap=new Map(content.senses.map(x=>[x.id,x]));
const surfaceMap=new Map(content.surfaceForms.map(x=>[x.id,x]));
const lemmaMap=new Map(content.lemmas.map(x=>[x.id,x]));
const reviews=new Map(source.reviews.map(r=>[r.id,r]));
const subjects=editorialSubjects(p).filter(s=>s.kind==='vocabulary'&&repair.items.some(e=>e.proposedGloss&&e.senseId===s.value.sense.id));
if(subjects.length!==3)throw Error(`Expected three existing active identities, found ${subjects.length}`);
for(const s of subjects){
 const revised={...s.value,sense:senseMap.get(s.value.sense.id)},id=`vocabulary:${s.id}`,before=reviews.get(`vocabulary:${s.id}`);
 if(before?.status!=='approved')throw Error(`Previously approved identity changed ${s.id}`);
 const reason='The same family or bird meaning applies to every existing indexed use. The shared English gloss now covers singular and plural, while the established surface+sense IDs and all existing questions remain unchanged.';
 const after=approveReview('fr','vocabulary',s.id,revised,'Codex','2026-09-27T00:00:00.000Z',reason);
 reviews.set(after.id,after);reviewChanges.push({subjectId:s.id,before,after,reviewedOccurrences:s.value.occurrences.length,reason});
}
let activeQuizReapprovals=0,historicalQuizProposals=0;
for(const q of quizzes.filter(q=>repair.items.some(e=>e.senseId===q.subject?.senseId))){
 const target={surface:surfaceMap.get(q.subject.surfaceFormId),sense:senseMap.get(q.subject.senseId),lemma:lemmaMap.get(surfaceMap.get(q.subject.surfaceFormId).lemmaId)};
 const before=reviews.get(`quiz:${q.id}`);
 if(q.subject.senseId===repair.items.find(e=>e.key==='ciel_visible_sky').senseId){
  if(before?.status!=='rejected')throw Error(`Sky placeholder approval changed: ${q.id}`);
  reviews.set(`quiz:${q.id}`,pendingReview('fr','quiz',q.id,{quiz:q,target},quizReason));historicalQuizProposals++;
 }else{
  if(before?.status!=='approved')throw Error(`Previously approved quiz changed: ${q.id}`);
  const reason='Rechecked the unchanged context, answer, noun agreement and distractors after the singular/plural compatible gloss correction; its surface and mastery identity remain stable.';
  const after=approveReview('fr','quiz',q.id,{quiz:q,target},'Codex','2026-09-27T00:00:00.000Z',reason);
  reviews.set(after.id,after);reviewChanges.push({subjectId:q.id,before,after,reason});activeQuizReapprovals++;
 }
}
if(changes.length!==5||activeQuizReapprovals!==9||historicalQuizProposals!==3)throw Error('Unexpected repair impact');
const files=new Map(sharedSourceFiles({...source,legacy,quizzes,reviews:[...reviews.values()]}));
files.set(batchFile,{version:1,id:batchId,language:'fr',masteryIdsChanged:false,progressTransfers:[],correctedSenses:2,correctedHistoricalQuestionBands:3,activeIdentityReapprovals:3,activeQuizReapprovals:9,historicalQuizProposals:3,changes});
files.set(reviewFile,{version:1,kind:'offline_editorial_review_batch',id:batchId,date:'2026-09-27',language:'fr',subjectKind:'vocabulary',reviewedIdentities:3,approvals:3,holds:0,progressTransfers:[],reviewMethod:'checked all 15 indexed uses, nine active old quiz bands and three source-reviewed sky replacements against exact published revisions',changes:reviewChanges.slice(0,3).map(x=>({...x,reviewId:x.after.id,outcome:'approve',rationale:x.reason})),quizRebindings:reviewChanges.slice(3)});
if(dryRun){console.log(JSON.stringify({dryRun:true,changedRecords:changes.length,activeIdentities:subjects.length,activeQuizReapprovals,historicalQuizProposals}));process.exit(0);}
const backup=adoptSourceFiles(publicationRoot,files,stage=>{
 const saved=loadPublication(stage);validatePublication(saved.bundle,saved.expressionCatalog,saved.registry);
 const blocked=auditEditorialQuality(saved);if(blocked.length)throw Error(`Published release blocked: ${JSON.stringify(blocked.slice(0,3))}`);
 for(const e of repair.items)if(!saved.bundle.senses.some(s=>s.id===e.senseId&&s.gloss===(e.proposedGloss??e.currentGloss)))throw Error(`Repair missing ${e.key}`);
 if(saved.bundle.occurrences.length!==p.bundle.occurrences.length||[...saved.preparedQuizzes.keys()].sort().join()!==[...p.preparedQuizzes.keys()].sort().join())throw Error('Published IDs or indexed uses changed');
});
console.log(JSON.stringify({batchId,changedRecords:changes.length,activeIdentityReapprovals:subjects.length,activeQuizReapprovals,historicalQuizProposals,backup}));
