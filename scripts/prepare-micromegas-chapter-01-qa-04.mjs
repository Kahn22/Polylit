import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=name=>readFileSync(resolve(root,name));
const read=name=>JSON.parse(bytes(name));
const hash=b=>createHash('sha256').update(b).digest('hex');
const batch=read('chapter-01-batch-24.json'),plan=read('unit-plan.json'),coverage=read('chapter-01-coverage.json');
const items=batch.items.map(item=>{
 const first=item.sourceOccurrences[0];
 const token=coverage.tokens.find(t=>t.unit===first.unit&&t.start===first.start&&t.end===first.end);
 if(plan.units[first.unit-1]?.text.slice(first.start,first.end)!==first.text||token?.draft?.key!==item.key||item.questions.map(q=>q.band).join(',')!=='1-3,4-5,6-8')throw Error(`Stale correction ${item.key}`);
 return {key:item.key,form:item.form,batchFile:'chapter-01-batch-24.json',firstChapterUse:first,workwideUseCount:item.sourceOccurrences.length,questionBands:item.questions.map(q=>q.band),questionSha256:hash(JSON.stringify(item.questions)),occurrencesSha256:hash(JSON.stringify(item.sourceOccurrences)),publishedExactCandidateCount:token.candidates.length,decision:'retain_separate_contextual_meaning_and_questions_pending_import',reviewNote:`Published same-form questions were checked against this source use: ${item.editorialNote} The new answer sequence is ${item.questions.map(q=>q.answer).join(', ')}; each distractor was checked against its sentence, including grammatical agreement.`};
});
if(items.length!==8||new Set(items.map(x=>x.key)).size!==8)throw Error('Expected eight distinct corrections');
writeFileSync(resolve(root,'chapter-01-qa-04.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'contextual_source_and_three_band_question_review_recorded_unpublished',scope:'Eight corrections after all published reuse questions were compared with chapter I uses; 24 new bands',sourceSha256:hash(bytes('canonical-draft.txt')),unitPlanSha256:hash(bytes('unit-plan.json')),coverageSha256:hash(bytes('chapter-01-coverage.json')),batchEvidence:[{file:'chapter-01-batch-24.json',sha256:hash(bytes('chapter-01-batch-24.json'))}],note:'Separated eight misleading published question sets from their chapter I senses. All 236 draft meanings now have contextual question records; no published question or mastery was changed.',items},null,2)+'\n');
console.log(JSON.stringify({reviewedMeanings:8,questionBands:24}));
