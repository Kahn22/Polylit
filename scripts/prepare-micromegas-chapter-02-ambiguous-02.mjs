import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
const rules=[
 {form:'de',fallback:'srf_de:sns_de_primary',exceptions:{},rationale:'The forty-seven prepositions connect a verb or noun to its complement, for instance approaching a face, counting senses, needing something or comparing beings. No instance belongs to de même, de sorte que or de quoi.'},
 {form:'des',fallback:'srf_fr_des_des_article:sns_fr_des_indefinite_plural',exceptions:{},rationale:'All eight introduce indefinite plural things, including comparisons, beings, passions and properties; none contracts de + les.'},
 {form:'en',fallback:'srf_fr_en_en_pronoun:sns_fr_en_pronominal_reference',exceptions:{'37:45':'srf_en:sns_en_in','45:91':'srf_fr_en_en_preposition:sns_fr_en_gerund','53:9':'srf_en:sns_en_in'},rationale:'Most en refer back to senses, beings, properties or substances, with en fallut revenir also recalling the prior conjectures. En conjectures and en tout are prepositions; en vous apprenant introduces a simultaneous means with the gerund.'},
 {form:'bien',fallback:'srf_zola_bien_bien:sns_fr_bien_well',exceptions:{'30:146':'srf_zola_bien_bien:sns_fr_bien_intensifier','34:14':'srf_bien:sns_bien_primary','38:54':'srf_zola_bien_bien:sns_fr_bien_intensifier'},rationale:'Bien variée and bien peu intensify degree. Je le crois bien affirms indeed. Voyez bien, savez trop bien and bien examiné use well with perception, knowledge or examination.'},
 {form:'plus',fallback:'srf_plus:sns_fr_plus_greater_degree',exceptions:{},rationale:'Each occurrence increases degree or quantity in an explicit comparison: more perfect, more desires and needs, or a longer lifetime.'},
 {form:'n’',fallback:'srf_n_elided:sns_ne_primary',exceptions:{'58:16':'srf_n_elided:sns_fr_ne_que_only'},rationale:'N’en comptait qu’une trentaine restricts the count to only thirty. Other elided n’ uses negate with pas, aucuns or point.'},
 {form:'que',fallback:'srf_que:sns_que_conjunction',exceptions:{'35:152':'srf_que:sns_que_comparative','35:193':'srf_que:sns_que_comparative','39:98':'srf_que:sns_que_restrictive','41:51':'srf_fr_que_lower_pronoun:sns_fr_que_relative_pronoun','44:60':'srf_fr_que_lower_pronoun:sns_fr_que_relative_pronoun','45:155':'srf_que:sns_que_comparative','46:61':'srf_que:sns_que_comparative','52:73':'srf_fr_que_lower_pronoun:sns_fr_que_relative_pronoun'},skip:['42:45'],rationale:'Que introduces a clause in the ordinary cases. In comparisons it means than; ne vivons ... que restricts to only; after moment, figure or vues it connects a relative clause. The que in à peine ... que remains for the expression review.'},
 {form:'qu’',fallback:'srf_qu_elided:sns_que_conjunction',exceptions:{'58:30':'srf_fr_qu__que_adverb:sns_fr_que_restriction','60:59':'srf_fr_qu__que_pronoun:sns_fr_que_relative_pronoun','60:93':'srf_fr_qu__que_pronoun:sns_fr_que_relative_pronoun'},rationale:'Most qu’ introduce a content or subordinate clause. N’en comptait qu’une restricts the count; ce qu’ils savaient/ne savaient uses a relative pronoun referring to what was known.'}
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
const output={version:1,workId:coverage.workId,chapter:2,status:'offline_contextual_ambiguous_reuse_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Eight chapter II grammatical families reviewed against contextual identities and existing three-band questions. One à peine ... que component is held for expression triage.',items};
writeFileSync(resolve(root,'chapter-02-ambiguous-02.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,i)=>n+i.occurrences.length,0)}));
