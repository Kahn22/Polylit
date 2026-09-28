import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(dir,n)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const plan=read('unit-plan.json');
const coverage=read('chapter-01-coverage.json');
const items=[];
const batchEvidence=[];
for(let n=16;n<=23;n++){
 const file=`chapter-01-batch-${String(n).padStart(2,'0')}.json`;
 const bytes=readFileSync(resolve(dir,file));const batch=JSON.parse(bytes);
 batchEvidence.push({file,sha256:hash(bytes)});
 for(const item of batch.items){
  const chapterUse=item.sourceOccurrences.find(o=>o.chapter===1);
  if(!chapterUse||plan.units[chapterUse.unit-1]?.text.slice(chapterUse.start,chapterUse.end)!==chapterUse.text)throw Error(`Stale chapter source ${item.key}`);
  const token=coverage.tokens.find(t=>t.unit===chapterUse.unit&&t.start===chapterUse.start&&t.end===chapterUse.end);
  if(token?.draft?.key!==item.key)throw Error(`Wrong chapter draft ${item.key}`);
  if(item.questions.map(q=>q.band).join(',')!=='1-3,4-5,6-8'||item.questions.some(q=>q.choices.length!==4||new Set(q.choices).size!==4||q.answer!==q.choices[0]))throw Error(`Bad question bands ${item.key}`);
  items.push({key:item.key,form:item.form,batchFile:file,firstChapterUse:{unit:chapterUse.unit,start:chapterUse.start,end:chapterUse.end,text:chapterUse.text},workwideUseCount:item.sourceOccurrences.length,questionBands:item.questions.map(q=>q.band),questionSha256:hash(JSON.stringify(item.questions)),occurrencesSha256:hash(JSON.stringify(item.sourceOccurrences)),publishedExactCandidateCount:token.candidates.length,decision:'retain_offline_contextual_draft_pending_final_shared_identity_and_question_signoff',reviewNote:`${item.key==='etoile_literal_star'?'Sirius is a literal star; the same-form published questions all teach figurative luck, so retain the new celestial sense. ':''}Source sense: ${item.editorialNote} The three question answers, in band order, are ${item.questions.map(q=>JSON.stringify(q.answer)).join(', ')}; each choice set was checked against its own sentence context.`});
 }
}
if(items.length!==78||new Set(items.map(i=>i.key)).size!==78)throw Error('Expected 77 distinct reviewed meanings');
const prior=[read('chapter-01-qa-01.json'),read('chapter-01-qa-02.json')];
const earlier=new Set(prior.flatMap(qa=>qa.items.map(item=>item.key)));
if(items.some(item=>earlier.has(item.key))||earlier.size!==150)throw Error('QA reviews overlap');
const corrections=[
 {key:'celui_ci_this_one',field:'levels_4_5_and_6_8',reason:'With only one mentioned man, celui-là could also refer to him. Specified two men in order so the latter, celui-ci, is unambiguous.'},
 {key:'siens_his_people',field:'levels_4_5_and_6_8',reason:'The vague les autres could also denote his traveling companions. Replaced it with inconnus and made his own group explicit.'}
];
writeFileSync(resolve(dir,'chapter-01-qa-03.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'contextual_source_and_three_band_question_review_recorded_unpublished',scope:'Meaning drafts in batches 16–23, 78 meanings and 234 authored questions',sourceSha256:hash(readFileSync(resolve(dir,'canonical-draft.txt'))),unitPlanSha256:hash(readFileSync(resolve(dir,'unit-plan.json'))),coverageSha256:hash(readFileSync(resolve(dir,'chapter-01-coverage.json'))),batchEvidence,corrections,note:'Checked source spans, selected workwide contexts, contextual meanings and each three-band choice set for the remaining chapter I drafts. Corrected two ambiguous choice sets. The first 228 chapter I draft meanings have a recorded source-and-question review; eight later corrections are recorded in QA04, but final shared-identity mapping and publication are pending.',items},null,2)+'\n');
console.log(JSON.stringify({reviewedMeanings:items.length,questionBands:items.length*3,corrections:corrections.length}));
