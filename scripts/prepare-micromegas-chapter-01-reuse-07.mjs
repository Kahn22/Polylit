import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const folder=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=readFileSync(resolve(folder,'chapter-01-coverage.json'));
const coverage=JSON.parse(bytes);
const names=JSON.parse(readFileSync(resolve(folder,'chapter-01-names-01.json')));
const id='srf_fr_m_monsieur_noun:sns_fr_monsieur_title';
const occurrences=coverage.tokens.filter(t=>t.disposition==='honorific_monsieur_mapping_to_verify').map(t=>{
 const candidate=t.candidates.find(c=>c.identity===id);
 if(!candidate || candidate.preparedBands.length!==3 || t.text!=='M') throw Error('Published abbreviation/questions missing');
 return {chapter:1,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,identity:id,gloss:candidate.gloss};
});
if(occurrences.length!==3 || names.honorific.occurrences.some((x,i)=> x.unit!==occurrences[i].unit || x.start!==occurrences[i].start)) throw Error('Honorific review changed');
const output={version:1,workId:coverage.workId,chapter:1,status:'offline_contextual_published_reuse_unpublished',coverageSha256:createHash('sha256').update(bytes).digest('hex'),note:'Reuse the already published M abbreviation identity, its three questions and mastery; the following period is punctuation in the source.',items:[{form:'m',identity:id,status:'all_chapter_uses_context_reviewed_reuse_pending_final_bundle_signoff',rationale:'Each M. precedes a named person as a title. The source tokenizer indexes M separately from the period, exactly matching the existing M surface and monsieur title sense.',occurrences}]};
writeFileSync(resolve(folder,'chapter-01-reuse-07.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:1,occurrences:occurrences.length}));
