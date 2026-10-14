import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPublication} from './micromegas-publication-baseline.mjs';
const folder=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(folder,n)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const inventories=[4,5,6,7].map(c=>read(`chapter-0${c}-inventory.json`));
const proper=read('chapter-04-07-names.json'),carry=read('chapter-04-07-carryover-review.json');
const nameUses=new Set(proper.items.flatMap(i=>i.occurrences.map(o=>`${o.unit}:${o.start}`)));
const sharedUses=new Set(carry.items.flatMap(i=>i.occurrences.map(o=>`${o.unit}:${o.start}`)));
const separateUses=new Set(carry.exceptions.flatMap(i=>i.occurrences.map(o=>`${o.unit}:${o.start}`)));
const newDrafts=Array.from({length:19},(_,n)=>read(`chapter-04-batch-${String(n+1).padStart(2,'0')}.json`));
const newDraftUses=new Set(newDrafts.flatMap(batch=>batch.items.flatMap(i=>i.sourceOccurrences.map(o=>`${o.unit}:${o.start}`))));
const finalUses=new Set(read('chapter-04-final-dispositions.json').items.map(i=>`${i.occurrence.unit}:${i.occurrence.start}`));
const reuseReviews=[1,2,3,4,5].map(n=>read(`chapter-04-published-reuse-review-${String(n).padStart(2,'0')}.json`));
const reviewedPublishedUses=new Set(reuseReviews.flatMap(review=>review.items.flatMap(i=>i.sourceOccurrences.map(o=>`${o.unit}:${o.start}`))));
const publication=loadPublication(),quizzes=[...publication.preparedQuizzes.values()];
const quizCache=new Map();
const questionSet=id=>{
 if(!quizCache.has(id)){
  const [surface,sense]=id.split(':');
  const list=quizzes.filter(q=>q.subject?.kind==='vocabulary'&&q.subject.surfaceFormId===surface&&q.subject.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));
  quizCache.set(id,{questionSha256:sha(JSON.stringify(list)),bands:list.map(q=>q.band),questions:list.map(q=>({band:q.band,context:q.context,answer:q.answer,choices:q.choices}))});
 }
 return quizCache.get(id);
};
const byForm=new Map();
for(const inv of inventories)for(const t of inv.tokens){
 if(t.earlierDraft||nameUses.has(`${t.unit}:${t.start}`)||sharedUses.has(`${t.unit}:${t.start}`)||newDraftUses.has(`${t.unit}:${t.start}`)||reviewedPublishedUses.has(`${t.unit}:${t.start}`)||finalUses.has(`${t.unit}:${t.start}`))continue;
 const arr=byForm.get(t.form)??[];arr.push({chapter:inv.chapter,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,candidates:t.candidates,priorMeaningException:separateUses.has(`${t.unit}:${t.start}`)});byForm.set(t.form,arr);
}
const common={version:1,workId:inventories[0].workId,chapters:[4,5,6,7],sourceSha256:inventories[0].sourceSha256,unitPlanSha256:inventories[0].unitPlanSha256,inventorySha256:Object.fromEntries(inventories.map(i=>[i.chapter,sha(readFileSync(resolve(folder,`chapter-0${i.chapter}-inventory.json`)))]))};
const published=[],noExact=[];
for(const [form,occurrences] of byForm){
 const byCandidate=new Map();
 for(const o of occurrences)for(const c of o.candidates)byCandidate.set(c.identity,c);
 const row={form,useCount:occurrences.length,firstContext:occurrences[0].context,occurrences:occurrences.map(({chapter,unit,start,end,text,context,priorMeaningException})=>({chapter,unit,start,end,text,context,...(priorMeaningException?{priorMeaningException:true}:{})}))};
 if(!byCandidate.size)noExact.push({...row,status:'new_contextual_sense_or_proper_name_pending_individual_review'});
 else published.push({...row,status:'published_identity_candidate_not_contextually_approved',candidates:[...byCandidate.values()].map(c=>({...c,...questionSet(c.identity)}))});
}
const sort=(a,b)=>b.useCount-a.useCount||a.form.localeCompare(b.form,'fr');published.sort(sort);noExact.sort(sort);
writeFileSync(resolve(folder,'chapter-04-07-published-candidates.json'),JSON.stringify({...common,status:'published_source_candidates_pending_contextual_question_review',summary:{forms:published.length,uses:published.reduce((n,i)=>n+i.useCount,0),candidateIdentities:quizCache.size},items:published},null,2)+'\n');
writeFileSync(resolve(folder,'chapter-04-07-new-form-queue.json'),JSON.stringify({...common,status:'new_form_meaning_and_three_band_questions_pending_review',summary:{forms:noExact.length,uses:noExact.reduce((n,i)=>n+i.useCount,0)},items:noExact},null,2)+'\n');
console.log(JSON.stringify({publishedForms:published.length,publishedUses:published.reduce((n,i)=>n+i.useCount,0),newForms:noExact.length,newUses:noExact.reduce((n,i)=>n+i.useCount,0),sharedUses:sharedUses.size,nameUses:nameUses.size,priorDraftUses:inventories.reduce((n,i)=>n+i.summary.priorAuthoredUses,0),newDraftUses:newDraftUses.size,reviewedPublishedUses:reviewedPublishedUses.size,chapterFourFinalUses:finalUses.size}));
