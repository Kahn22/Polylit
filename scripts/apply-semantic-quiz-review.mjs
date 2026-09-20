import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadPublication,publicationRoot,validatePublication} from '../dist/publication/repository.js';
import {editorialSubjects,auditEditorialQuality} from '../dist/publication/quality-audit.js';
import {reviewRevision,approveReview} from '../dist/publication/editorial.js';
import {fromNeutral,toNeutral} from '../dist/publication/format.js';
import {adoptSourceFiles,sharedSourceFiles,readWorkSource,workSourceV2,reconcileQuizzes} from '../dist/publication/source-store.js';
import {prepareQuiz,quizEditorialIssues,legacyQuiz,targetCandidates} from '../dist/publication/quiz-authoring.js';
import {textBinding} from '../dist/publication/revisions.js';
const path=resolve(process.argv[2]??'');if(!process.argv[2])throw Error('Authored plan required');
const plan=(await import(pathToFileURL(path))).default;
const snapshot=JSON.parse(readFileSync(resolve(dirname(path),plan.snapshot),'utf8'));
const language=plan.language??snapshot.language??'fr';if(!['fr','es'].includes(language)||snapshot.language!==language)throw Error('Invalid semantic review language');
const ledgerPath=`editorial-batches/${plan.id}.json`;if(existsSync(resolve(publicationRoot,ledgerPath)))throw Error('Already applied');
const p=loadPublication(), candidate=structuredClone(p),source=candidate.sharedSources[language],content=fromNeutral(source.legacy.content);
const subjects=new Map(editorialSubjects(p).map(s=>[`${s.kind}:${s.id}`,s]));
const inputs=new Map(snapshot.entries.map(e=>[e.identity,e]));
function inputFor(key){if(inputs.has(key))return inputs.get(key);const matches=snapshot.entries.filter(e=>e.surface.form===key);if(matches.length!==1)throw Error(`Ambiguous or missing semantic input ${key}; use identity`);return matches[0];}
if(new Set(plan.entries.map(e=>e.from)).size>100)throw Error('Checkpoint required after at most 100 source identities');
const touched=new Set(),changes=[],mappings=[],reviewed=new Map(),resolutions=[];
const date=new Date().toISOString();
const byId=(items,id)=>items.find(x=>x.id===id);
function replace(kind,items,next,reason){const index=items.findIndex(x=>x.id===next.id);const old=index<0?null:items[index];if(reviewRevision(old)===reviewRevision(next))return;changes.push({kind,id:next.id,before:structuredClone(old),after:structuredClone(next),reason});if(index<0)items.push(next);else items[index]=next;}
for(const form of new Set(plan.entries.map(e=>e.from))){const s=inputFor(form);if(!s||reviewRevision(subjects.get(`vocabulary:${s.identity}`)?.value)!==s.baseRevision)throw Error(`Stale review input ${form}`);}
// A resolved source must account for every occurrence, including retained meanings.
for(const key of new Set(plan.entries.map(e=>e.from))){
 const input=inputFor(key),expected=input.occurrences.map(o=>o.id),selected=plan.entries.filter(e=>e.from===key).flatMap(e=>e.occurrenceIds==='all'?expected:e.occurrenceIds??[]);
 if(new Set(selected).size!==selected.length||selected.length!==expected.length||selected.some(id=>!expected.includes(id)))throw Error(`Incomplete or duplicate occurrence coverage ${key}`);
}
for(const e of plan.entries){
 const input=inputFor(e.from),reason=e.reason;
 if(!reason||e.questions?.length!==3)throw Error('Explicit editorial evidence and three questions required');
 const to=e.target??{surface:input.surface,sense:input.sense,lemma:input.lemma};
 const lemma=to.lemma,surface={...to.surface,normalized:to.surface.form.normalize('NFC').toLocaleLowerCase(language)},sense=to.sense;
 if(surface.lemmaId!==lemma.id||sense.lemmaId!==lemma.id)throw Error('Lemma mismatch');
 for(const [kind,value]of [['lemmas',lemma],['surfaceForms',surface],['senses',sense]]){
   const old=byId(content[kind],value.id);
   // Existing reused records must be identical unless this is explicitly a same-meaning metadata correction.
   if(old&&reviewRevision(old)!==reviewRevision(value)&&!e.metadataCorrection)throw Error(`Unacknowledged existing record edit ${value.id}`);
   replace(kind,content[kind],value,reason);
 }
 const key=`${surface.id}:${sense.id}`;
 const ids=e.occurrenceIds==='all'?input.occurrences.map(o=>o.id):e.occurrenceIds;
 if(!Array.isArray(ids)||!ids.length)throw Error('Explicit occurrence selection required');
 if(key!==input.identity){
  for(const id of ids){const old=byId(candidate.bundle.occurrences,id);if(!old||`${old.surfaceFormId}:${old.senseId}`!==input.identity)throw Error(`Unexpected occurrence ${id}`);replace('occurrences',candidate.bundle.occurrences,{...old,surfaceFormId:surface.id,senseId:sense.id},reason);touched.add(old.workId);}
  mappings.push({from:input.identity,to:key,occurrenceIds:ids,reusedExistingIdentity:p.bundle.occurrences.some(o=>`${o.surfaceFormId}:${o.senseId}`===key)});
 }
 const bands=['levels_1_3','levels_4_5','levels_6_8'];
 for(let i=0;i<3;i++){
  const band=bands[i],question=e.questions[i];
  const existing=source.quizzes.find(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===sense.id&&q.band===band);
  if(question===null){if(!existing||quizEditorialIssues(existing).length)throw Error('Cannot retain invalid question');reviewed.set(`quiz:${existing.id}`,reason);continue;}
  const id=existing?.id??`qiz_${sense.id.slice(4)}_${surface.id.slice(4)}_${band}`;
  const labels=question.choices.split('|'),answer=labels[0];if(labels.length!==4)throw Error('Four choices required');
  const offset=(i+plan.entries.indexOf(e))%4,choices=labels.slice(offset).concat(labels.slice(0,offset));
  const base={id,surfaceFormId:surface.id,senseId:sense.id,band,contextFrench:question.context,correctAnswer:answer};
  const authored=i===0?{...base,format:'meaning_choice',targetText:surface.form,prompt:'Meaning',choicesEnglish:choices}:i===1?{...base,format:'surface_completion',choicesFrench:choices}:{...base,format:'target_identification',promptFrench:question.prompt,choicesFrench:choices};
  const prepared=prepareQuiz(authored,language);
  if(quizEditorialIssues(prepared).length)throw Error(`Quiz fails gates ${id}: ${quizEditorialIssues(prepared)}`);
  if(i===2&&choices.some(c=>!targetCandidates(prepared.context,c,language).length))throw Error(`Missing passage choice ${id}`);
  replace('quizItems',content.quizItems,authored,reason);reviewed.set(`quiz:${id}`,reason);
 }
 reviewed.set(`vocabulary:${key}`,reason);
 resolutions.push({from:input.identity,to:key,form:surface.form,reason});
}
source.legacy.content=toNeutral(content);source.quizzes=reconcileQuizzes(p.sharedSources[language],source.legacy);
for(const kind of['lemmas','senses','surfaceForms','quizItems']){const oldIds=new Set(p.sharedSources[language].legacy.content[kind].map(x=>x.id));candidate.bundle[kind]=[...candidate.bundle[kind].filter(x=>!oldIds.has(x.id)),...content[kind]];}
for(const quiz of source.quizzes)candidate.preparedQuizzes.set(quiz.id,quiz);
for(const workId of touched)candidate.textBindings.set(workId,textBinding(candidate.bundle,candidate.expressionCatalog.occurrences,workId));
validatePublication(candidate.bundle,candidate.expressionCatalog,candidate.registry);
const reviewMap=new Map(source.reviews.map(r=>[r.id,r]));
for(const s of editorialSubjects(candidate)){const id=`${s.kind}:${s.id}`,reason=reviewed.get(id);if(reason)reviewMap.set(id,approveReview(language,s.kind,s.id,s.value,'Codex offline contextual review',date,reason));}
source.reviews=[...reviewMap.values()];
for(const mapping of mappings)mapping.previousIdentity=candidate.bundle.occurrences.some(o=>`${o.surfaceFormId}:${o.senseId}`===mapping.from)?'retained':'historical_only';
const files=sharedSourceFiles(source);
for(const workId of touched){const work=readWorkSource(resolve(publicationRoot,`works/${workId}.json`)).legacy;const c=fromNeutral(work.content);c.occurrences=candidate.bundle.occurrences.filter(o=>o.workId===workId);work.content=toNeutral(c);files.set(`works/${workId}.json`,workSourceV2(work));}
files.set(ledgerPath,{version:2,id:plan.id,policy:'polylit-editorial-v2',reviewedBy:'Codex offline contextual review',reviewedAt:date,masteryIdsChanged:mappings.length>0,progressPolicy:'preserve-history-fresh-on-view-v1',progressTransfers:[],mappings,resolutions,changes});
const recovery=adoptSourceFiles(publicationRoot,files,root=>{
 const saved=loadPublication(root);validatePublication(saved.bundle,saved.expressionCatalog,saved.registry);
 if(auditEditorialQuality(saved).some(issue=>reviewed.has(`${issue.kind}:${issue.id}`)))throw Error('Newly reviewed records fail quality gate');
 for(const mapping of mappings)for(const id of mapping.occurrenceIds){const o=byId(saved.bundle.occurrences,id);if(`${o.surfaceFormId}:${o.senseId}`!==mapping.to)throw Error('Occurrence mapping mismatch');}
 for(const [id,b]of saved.textBindings){const before=p.textBindings.get(id);if(before.textRevision!==b.textRevision||before.structureRevision!==b.structureRevision)throw Error('Canonical text changed');}
 const changedOccIds=new Set(mappings.flatMap(m=>m.occurrenceIds));
 for(const o of saved.bundle.occurrences){const old=byId(p.bundle.occurrences,o.id);if(!old)throw Error('Unexpected occurrence');if(reviewRevision({...o,surfaceFormId:old.surfaceFormId,senseId:old.senseId})!==reviewRevision(old))throw Error('Occurrence span changed');if(!changedOccIds.has(o.id)&&reviewRevision(o)!==reviewRevision(old))throw Error('Unreviewed occurrence changed');}
});
const queuePath=resolve(dirname(path),'queue.json'),queue=JSON.parse(readFileSync(queuePath,'utf8'));
for(const from of new Set(resolutions.map(r=>r.from))){const targets=[...new Set(resolutions.filter(r=>r.from===from).map(r=>r.to))];const old=queue.entries.find(q=>q.identity===from&&q.language===language);Object.assign(old,{status:targets.includes(from)?'quiz_reviewed':'resolved_semantic',batch:plan.id,targets,reviewedAt:date});}
for(const r of resolutions){let q=queue.entries.find(q=>q.identity===r.to&&q.language===language);if(!q){q={language,identity:r.to};queue.entries.push(q);}if(q.status==='blocked_lexical_review'&&!resolutions.some(x=>x.from===r.to))continue;Object.assign(q,{status:'quiz_reviewed',batch:plan.id,reviewedAt:date});}
writeFileSync(queuePath,JSON.stringify(queue,null,2)+'\n');console.log(JSON.stringify({batch:plan.id,resolvedSourceIdentities:new Set(resolutions.map(r=>r.from)).size,reviewedTargetIdentities:new Set(resolutions.map(r=>r.to)).size,reviewedQuestions:[...reviewed.keys()].filter(x=>x.startsWith('quiz:')).length,mappings:mappings.length,recovery}));
