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
for(let n=6;n<=15;n++){
 const file=`chapter-01-batch-${String(n).padStart(2,'0')}.json`;
 const bytes=readFileSync(resolve(dir,file));const batch=JSON.parse(bytes);
 batchEvidence.push({file,sha256:hash(bytes)});
 for(const item of batch.items){
  const chapterUse=item.sourceOccurrences.find(o=>o.chapter===1);
  if(!chapterUse||plan.units[chapterUse.unit-1]?.text.slice(chapterUse.start,chapterUse.end)!==chapterUse.text)throw Error(`Stale chapter source ${item.key}`);
  const token=coverage.tokens.find(t=>t.unit===chapterUse.unit&&t.start===chapterUse.start&&t.end===chapterUse.end);
  if(token?.draft?.key!==item.key)throw Error(`Wrong chapter draft ${item.key}`);
  if(item.questions.map(q=>q.band).join(',')!=='1-3,4-5,6-8'||item.questions.some(q=>q.choices.length!==4||new Set(q.choices).size!==4||q.answer!==q.choices[0]))throw Error(`Bad question bands ${item.key}`);
  items.push({key:item.key,form:item.form,batchFile:file,firstChapterUse:{unit:chapterUse.unit,start:chapterUse.start,end:chapterUse.end,text:chapterUse.text},workwideUseCount:item.sourceOccurrences.length,questionBands:item.questions.map(q=>q.band),questionSha256:hash(JSON.stringify(item.questions)),occurrencesSha256:hash(JSON.stringify(item.sourceOccurrences)),publishedExactCandidateCount:token.candidates.length,decision:'retain_offline_contextual_draft_pending_final_shared_identity_and_question_signoff',reviewNote:`Source sense: ${item.editorialNote} The three question answers, in band order, are ${item.questions.map(q=>JSON.stringify(q.answer)).join(', ')}; each choice set was checked against its own sentence context.`});
 }
}
if(items.length!==100||new Set(items.map(i=>i.key)).size!==100)throw Error('Expected 100 distinct reviewed meanings');
const corrections=[
 {key:'afflige_distressed',field:'levels_4_5_and_6_8',reason:'The source says médiocrement affligé; removed a deeply distressed scenario and crying that overstated the degree.'},
 {key:'septieme_seventh',field:'meaning_and_all_question_bands',reason:'La septième partie is one seventh of a whole, not the seventh position in a sequence.'},
 {key:'faible_weak',field:'workwide_scope_and_all_question_bands',reason:'The chapter I inadequate image and later faint voice need separate contextual review; retained only the former and aligned all questions with it.'},
 {key:'pieds_length_measure',field:'levels_4_5',reason:'Pieds and pouces de roi could both complete the previous blank; the revised five-foot geometric pace has a unique answer.'},
 {key:'excellence_title',field:'levels_4_5',reason:'The old Son ___ blank made distractor honorifics grammatically wrong; revised sentence gives four compatible titles and contextual clues.'}
];
writeFileSync(resolve(dir,'chapter-01-qa-02.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'contextual_source_and_three_band_question_review_recorded_unpublished',scope:'Meaning drafts in batches 06–15, 100 meanings and 300 authored questions',sourceSha256:hash(readFileSync(resolve(dir,'canonical-draft.txt'))),unitPlanSha256:hash(readFileSync(resolve(dir,'unit-plan.json'))),coverageSha256:hash(readFileSync(resolve(dir,'chapter-01-coverage.json'))),batchEvidence,corrections,note:'Checked source spans, intended contextual meanings and each three-band choice set for the next hundred drafts. Corrected five draft question/sense sets. Published exact-form candidates remain triage only, and final shared-identity mapping, the remaining batches and learner import are pending.',items},null,2)+'\n');
console.log(JSON.stringify({reviewedMeanings:items.length,questionBands:items.length*3,corrections:corrections.length}));
