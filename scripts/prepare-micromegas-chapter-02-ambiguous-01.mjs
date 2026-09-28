import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
// The exceptions are individual reviewed source offsets, not a part-of-speech guess.
const rules=[
 {form:'le',fallback:'srf_le:sns_le_primary',exceptions:{'34:5':'srf_le:sns_le_object','54:37':'srf_le:sns_le_object'},rationale:'Most le tokens precede nouns as the article. Je le crois and les habitants le sont point back to statements or attributes as direct objects.'},
 {form:'la',fallback:'srf_la:sns_le_primary',exceptions:{},rationale:'All eighteen la uses introduce a feminine noun, including nature, matter, death, figure and providence; none substitutes for an object.'},
 {form:'les',fallback:'srf_les:sns_le_primary',exceptions:{},rationale:'All eleven les uses introduce plural nouns such as flowers, ornaments, people, countries and beings; none is a direct-object pronoun.'},
 {form:'un',fallback:'srf_un:sns_un_primary',exceptions:{'60:33':'srf_fr_un_un_pronoun:sns_fr_un_group_member'},rationale:'The ordinary indefinite article precedes a noun in every other use. L’un à l’autre refers to one traveler in a pair; un there is substantival.'},
 {form:'une',fallback:'srf_une:sns_un_primary',exceptions:{},rationale:'All eleven une tokens determine feminine nouns, including assemblée, galerie, loi, goutte, éternité and révolution.'},
 {form:'il',fallback:'srf_il:sns_fr_il_impersonal',exceptions:{'48:0':'srf_il:sns_il_primary','51:194':'srf_il:sns_il_primary','55:155':'srf_il:sns_il_primary','57:43':'srf_il:sns_il_primary','58:0':'srf_il:sns_il_primary'},rationale:'Impersonal il accompanies falloir, restait, il y a or manquait. Referential il at the five listed offsets points respectively to the creator, globe, sunbeam, traveler and traveler.'},
 {form:'dit',fallback:'srf_dit:sns_dire_primary',exceptions:{},rationale:'Every dit is a speech tag introducing what a character says; none is the figurative implies sense.'},
 {form:'est',fallback:'srf_est:sns_etre_primary',exceptions:{'45:346':'srf_est:sns_fr_etre_compound_auxiliary'},rationale:'Est links subjects to qualities or identities, including matter being extended everywhere. In le moment est venu, être auxiliates venir in the compound tense.'},
 {form:'l’',fallback:'srf_l_elided:sns_le_primary',exceptions:{'41:55':'srf_fr_l__l__particle:sns_fr_l_euphonic_on','46:26':'srf_fr_l__l__particle:sns_fr_l_euphonic_on'},rationale:'L’on in two clauses uses optional euphonic l’. Other l’ tokens introduce nouns including l’autre, l’académicien, l’étendue and l’ouvrage; none stands for an object.'},
 {form:'ne',fallback:'srf_ne:sns_ne_primary',exceptions:{'39:69':'srf_ne:sns_fr_ne_que_only'},rationale:'Ne vivons ... que cinq cents restricts the number to only five hundred. Other ne tokens negate with point, pas, rien or a negative relative clause.'}
];
const items=rules.map(rule=>{
 const tokens=coverage.tokens.filter(t=>t.form===rule.form&&t.disposition==='multiple_published_candidates_context_pending');
 if(!tokens.length)throw Error(`Missing ${rule.form}`);
 const found=new Set();
 const occurrences=tokens.map(t=>{
  const key=`${t.unit}:${t.start}`;if(rule.exceptions[key])found.add(key);
  const identity=rule.exceptions[key]??rule.fallback;
  const candidate=t.candidates.find(c=>c.identity===identity);
  if(!candidate||candidate.preparedBands.join(',')!=='levels_1_3,levels_4_5,levels_6_8')throw Error(`Question or identity mismatch ${rule.form} ${key}`);
  return {chapter:2,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,identity,gloss:candidate.gloss};
 });
 if(Object.keys(rule.exceptions).some(key=>!found.has(key)))throw Error(`Stale exception ${rule.form}`);
 return {form:rule.form,status:'chapter_two_context_reviewed_reuse_pending_final_bundle_signoff',rationale:rule.rationale,occurrences};
});
const output={version:1,workId:coverage.workId,chapter:2,status:'offline_contextual_ambiguous_reuse_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Ten chapter II homograph families and their source occurrences reviewed against existing identities and three prepared bands. Final work signoff remains pending.',items};
writeFileSync(resolve(root,'chapter-02-ambiguous-01.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,i)=>n+i.occurrences.length,0)}));
