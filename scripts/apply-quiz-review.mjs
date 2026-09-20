import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { legacyQuiz, normalizeText, quizEditorialIssues, targetCandidates } from '../dist/publication/quiz-authoring.js';
import { reviewRevision, approveReview, approvalIssues } from '../dist/publication/editorial.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { reconcileQuizzes, sharedSourceFiles, adoptSourceFiles } from '../dist/publication/source-store.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
const path = resolve(process.argv[2] ?? '');
if (!process.argv[2]) throw Error('Provide an offline-authored correction module');
const plan = (await import(pathToFileURL(path).href)).default;
const snapshot = JSON.parse(readFileSync(resolve(dirname(path), plan.snapshot), 'utf8'));
const queuePath = resolve(dirname(path), 'queue.json');
const queue = JSON.parse(readFileSync(queuePath, 'utf8'));
if (!plan.entries.length || plan.entries.length > queue.checkpointEvery) throw Error('Batch must contain 1–100 identities');
if (new Set(plan.entries.map(e=>e.index)).size !== plan.entries.length) throw Error('Duplicate batch index');
const ledgerPath = `editorial-batches/${plan.id}.json`;
if (existsSync(resolve(publicationRoot,ledgerPath))) throw Error('Batch already applied; recover queue from its ledger if needed');
const p=loadPublication(), language=plan.language;
if(language==='es' && queue.entries.some(e=>e.language==='fr' && e.status==='pending')) throw Error('French must be processed before Spanish');
const source=p.sharedSources[language];
const records=fromNeutral(source.legacy.content);
const changes=[], reviewed=[], blocked=[];
const replacements=new Map();
const bands=['levels_1_3','levels_4_5','levels_6_8'];
for(const row of plan.entries){
 const input=snapshot.entries.find(e=>e.index===row.index);
 if(!input || !row.reason?.trim()) throw Error('Missing input/evidence');
 const queueRow=queue.entries.find(e=>e.identity===input.identity&&e.language===language);
 if(queueRow?.status!=='pending')throw Error(`Not pending: ${input.identity}`);
 const surface=p.bundle.surfaceForms.find(s=>s.id===input.surface.id),sense=p.bundle.senses.find(s=>s.id===input.sense.id),lemma=p.bundle.lemmas.find(l=>l.id===surface.lemmaId);
 const quizzes=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===sense.id).sort((a,b)=>bands.indexOf(a.band)-bands.indexOf(b.band));
 const occurrences=p.bundle.occurrences.filter(o=>o.surfaceFormId===surface.id&&o.senseId===sense.id);
 const contexts=[...new Set(occurrences.map(o=>o.unitId))].map(id=>p.bundle.units.find(u=>u.id===id));
 if(reviewRevision({surface,sense,lemma,quizzes,occurrences,contexts})!==input.baseRevision)throw Error(`Stale input: ${input.identity}`);
 if(row.status==='blocked_lexical_review'){
   blocked.push({identity:input.identity,form:surface.form,reason:row.reason});
   continue;
 }
 if(!row.agreement || row.questions?.length!==3 || quizzes.length!==3)throw Error('Explicit three-band review and agreement evidence required');
 const ids=[];
 row.questions.forEach((edit,index)=>{
   const old=legacyQuiz(quizzes[index]);
   ids.push(old.id);
   if(edit===null)return;
   if(edit.choices?.length!==4)throw Error(`Need four choices: ${old.id}`);
   const correctAnswer=edit.choices[0];
   const offset=createHash('sha256').update(old.id).digest()[0]%4;
   const choices=edit.choices.slice(offset).concat(edit.choices.slice(0,offset));
   const after={...old,contextFrench:edit.context,correctAnswer};
   if(index===0)after.choicesEnglish=choices;
   else after.choicesFrench=choices;
   if(index===2)after.promptFrench=edit.prompt;
   replacements.set(old.id,after);
   if(reviewRevision(old)!==reviewRevision(after))changes.push({kind:'quizItems',id:old.id,before:old,after,reason:row.reason});
 });
 reviewed.push({identity:input.identity,form:surface.form,quizIds:ids,agreement:row.agreement,reason:row.reason});
}
const nextLegacy={...source.legacy,content:toNeutral({...records,quizItems:records.quizItems.map(q=>replacements.get(q.id)??q)})};
const nextQuizzes=reconcileQuizzes(source,nextLegacy);
const nextReviews=new Map(source.reviews.map(r=>[r.id,r]));
const date=new Date().toISOString();
for(const row of reviewed){
 const [sf,se]=row.identity.split(':');
 const surface=p.bundle.surfaceForms.find(s=>s.id===sf),sense=p.bundle.senses.find(s=>s.id===se),lemma=p.bundle.lemmas.find(l=>l.id===surface.lemmaId);
 const contexts=[];
 for(const id of row.quizIds){
   const quiz=nextQuizzes.find(q=>q.id===id);
   const issues=quizEditorialIssues(quiz);
   if(issues.length)throw Error(`${id}: ${issues.join(',')}`);
   if(quiz.band==='levels_6_8'&&quiz.choices.some(c=>!targetCandidates(quiz.context,c.text,language).length))throw Error(`Advanced choice not a whole word in context: ${id}`);
   contexts.push(normalizeText(quiz.context,language));
   const value={quiz,target:{surface,sense,lemma}};
   nextReviews.set(`quiz:${id}`,approveReview(language,'quiz',id,value,'Codex offline contextual review',date,`${row.reason} Intermediate agreement: ${row.agreement}. Each band inspected; retained content was also read. No vocabulary/occurrence approval is implied.`));
 }
 if(new Set(contexts).size!==3)throw Error(`Repeated contexts ${row.identity}`);
}
// Explicit rejection ensures a mistaken lexical target cannot acquire quiz approval.
for(const row of blocked){
 const [sf,se]=row.identity.split(':');
 for(const quiz of nextQuizzes.filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===sf&&q.subject.senseId===se)){
  const surface=p.bundle.surfaceForms.find(s=>s.id===sf),sense=p.bundle.senses.find(s=>s.id===se),lemma=p.bundle.lemmas.find(l=>l.id===surface.lemmaId);
  nextReviews.set(`quiz:${quiz.id}`,{id:`quiz:${quiz.id}`,language,kind:'quiz',subjectId:quiz.id,subjectRevision:reviewRevision({quiz,target:{surface,sense,lemma}}),policy:'polylit-editorial-v2',status:'rejected',reason:row.reason,reviewedBy:'Codex offline contextual review',reviewedAt:date});
 }
}
const next={legacy:nextLegacy,quizzes:nextQuizzes,reviews:[...nextReviews.values()]};
const ledger={version:1,id:plan.id,reviewedBy:'Codex offline contextual review',reviewedAt:date,policy:'polylit-editorial-v2',masteryIdsChanged:false,forms:reviewed.map(r=>r.form),reviewed,blocked,changes};
const files=sharedSourceFiles(next);files.set(ledgerPath,ledger);
const recovery=adoptSourceFiles(publicationRoot,files,stage=>{
 const loaded=loadPublication(stage);
 validatePublication(loaded.bundle,loaded.expressionCatalog,loaded.registry);
 const subjects=new Map(editorialSubjects(loaded).filter(s=>s.kind==='quiz').map(s=>[s.id,s]));
 for(const row of reviewed)for(const id of row.quizIds){const s=subjects.get(id);const r=loaded.reviews.find(r=>r.id===`quiz:${id}`);if(approvalIssues(r,s.value,'quiz',id,language).length)throw Error(`Approval mismatch ${id}`);}
 // Only quizzes and their review evidence may change in this transaction.
 for(const key of Object.keys(p.bundle).filter(k=>k!=='quizItems'))if(reviewRevision(p.bundle[key])!==reviewRevision(loaded.bundle[key]))throw Error(`Unexpected non-quiz change: ${key}`);
});
for(const row of reviewed){const q=queue.entries.find(e=>e.identity===row.identity&&e.language===language);Object.assign(q,{status:'quiz_reviewed',batch:plan.id,reviewedAt:date});}
for(const row of blocked){const q=queue.entries.find(e=>e.identity===row.identity&&e.language===language);Object.assign(q,{status:'blocked_lexical_review',batch:plan.id,reason:row.reason,reviewedAt:date});}
writeFileSync(queuePath,JSON.stringify(queue,null,2)+'\n');
console.log(JSON.stringify({batch:plan.id,processed:plan.entries.length,reviewedWords:reviewed.length,reviewedQuestions:reviewed.length*3,changedQuestions:changes.length,blockedWords:blocked.length,recovery}));
