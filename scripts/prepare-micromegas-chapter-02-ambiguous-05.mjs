import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
const rules=[
 {form:'à',fallback:'srf_a:sns_a_primary',exceptions:{},skip:['42:0'],rationale:'Seven prepositions introduce an infinitive, a recipient, a manner, an equivalent number or a temporal endpoint. The À of À peine is held for expression mastery.'},
 {form:'faire',fallback:'srf_faire:sns_fr_faire_perform_activity',exceptions:{},rationale:'Qu’ai-je à faire de vos brunes uses faire as doing or having dealings with; the idiomatic whole question rejects relevance, without a second expression mastery item.'},
 {form:'d’',fallback:'srf_d_elided:sns_de_primary',exceptions:{'32:182':'srf_fr_d_abord_d_elided:sns_fr_d_abord'},rationale:'D’abord uses the already published first/at first locution identity on d’ with phrase component abord; d’eau, d’uniformité, d’un blanc and d’étendue retain ordinary of/from.'},
 {form:'sens',fallback:'srf_zola_sens_sens:sns_fr_sens_judgment',exceptions:{},rationale:'Bon sens means sound judgment; the four sensory-faculty occurrences are separate draft meanings.'},
 {form:'bon',fallback:'srf_zola_bon_bon:sns_zola_bon_good',exceptions:{},rationale:'Bon sens applies the ordinary favorable/good adjective to the person’s judgment.'},
 {form:'par',fallback:'srf_par:sns_par_primary',exceptions:{},rationale:'Par exemple introduces an illustration by way of an example; the example noun has a separate illustrative draft and no extra expression mastery.'},
 {form:'que',fallback:'srf_que:sns_que_comparative',exceptions:{},rationale:'À peine ... que is a temporal no-sooner-than construction; the comparative clause-linking que remains, while À peine receives phrase treatment.'}
];
const items=rules.map(rule=>{
 const tokens=coverage.tokens.filter(t=>t.form===rule.form&&t.disposition==='multiple_published_candidates_context_pending'&&!(rule.skip??[]).includes(`${t.unit}:${t.start}`));
 if(!tokens.length)throw Error(`Missing ${rule.form}`);
 const found=new Set();
 const occurrences=tokens.map(t=>{
  const key=`${t.unit}:${t.start}`;if(rule.exceptions[key])found.add(key);
  const identity=rule.exceptions[key]??rule.fallback;
  const candidate=t.candidates.find(c=>c.identity===identity);
  if(!candidate||candidate.preparedBands.join(',')!=='levels_1_3,levels_4_5,levels_6_8')throw Error(`Question or identity mismatch ${rule.form} ${key} ${identity}`);
  return {chapter:2,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,identity,gloss:candidate.gloss};
 });
 if(Object.keys(rule.exceptions).some(key=>!found.has(key))||(rule.skip??[]).some(key=>!coverage.tokens.some(t=>t.form===rule.form&&`${t.unit}:${t.start}`===key)))throw Error(`Stale offset ${rule.form}`);
 return {form:rule.form,status:'chapter_two_context_reviewed_reuse_pending_final_bundle_signoff',rationale:rule.rationale,...(rule.skip?{heldExpressionComponentOffsets:rule.skip}:{}),occurrences};
});
const output={version:1,workId:coverage.workId,chapter:2,status:'offline_contextual_ambiguous_reuse_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Seven chapter II grammatical families reviewed against contextual identities and existing three-band questions. One à peine ... que component is held for expression triage.',items};
writeFileSync(resolve(root,'chapter-02-ambiguous-05.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,i)=>n+i.occurrences.length,0)}));
