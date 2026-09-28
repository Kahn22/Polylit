import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
const rules=[
 {form:'mort',fallback:'srf_zola_mort_mort_noun:sns_zola_mort_death',exceptions:{},rationale:'La mort arrives before experience; this is the noun death.'},
 {form:'monde',fallback:'srf_zola_monde_monde:sns_zola_monde_world_public',exceptions:{},rationale:'Dans ce monde refers to the inhabited world, not a group of people or a negative intensifier.'},
 {form:'si',fallback:'srf_si:sns_si_primary',exceptions:{},rationale:'Both si introduce conditions: if the listener were not a philosopher, and if he speaks of properties.'},
 {form:'pas',fallback:'srf_pas:sns_pas_primary',exceptions:{},rationale:'All five negate clauses with ne/n’; none measures a walking step.'},
 {form:'rendre',fallback:'srf_parure_rendre_lem_zola_rendre_506e242df3:sns_parure_rendre_remettre_une_chose_entre_les_mains_de_celui_a_qui_elle_appartient_de_quelque_maniere_qu_on_l_ait_eue_2b7ef09520',exceptions:{},rationale:'Rendre son corps aux éléments means giving the body back to its constituent elements, not making it adopt a new state.'},
 {form:'sous',fallback:'srf_zola_sous_sous:sns_zola_sous_primary',exceptions:{},rationale:'Sous une autre forme locates nature under/in a different form; it is a preposition, not coins.'},
 {form:'forme',fallback:'srf_cendrillon_forme_lem_cendrillon_forme_noun_6b4aecede8_d787e4c83b:sns_cendrillon_forme_aspect_exterieur_configuration_caracteristique_ou_particuliere_d_une_chose_b1bed43ef5',exceptions:{},rationale:'Une autre forme means another configuration or shape, never legal formality.'},
 {form:'avoir',fallback:'srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary',exceptions:{},rationale:'Avoir vécu twice and avoir raisonné once use avoir as the auxiliary of a compound tense.'},
 {form:'même',fallback:'srf_zola_meme_25c826df8191_meme_adjective:sns_fr_meme_same',exceptions:{},rationale:'La même chose means the identical thing despite different lifetimes.'},
 {form:'vit',fallback:'srf_vit:sns_vivre_primary',exceptions:{},rationale:'L’on vit mille fois plus longtemps uses vivre: a person lives for a duration, not past historic voir.'},
 {form:'trouvé',fallback:'srf_zola_trouve_453838240045_trouver:sns_zola_trouver_past',exceptions:{},rationale:'J’ai trouvé qu’on y murmurait says the traveler found or observed the complaint; no encounter with death or fate.'},
 {form:'leur',fallback:'srf_fr_leur_leur_determiner:sns_fr_leur_possessive',exceptions:{},rationale:'Leur parti is what belongs to those people, the possessive their.'},
 {form:'sur',fallback:'srf_sur:sns_sur_primary',exceptions:{'52:95':'srf_sur:sns_fr_sur_about_topic'},skip:['55:202'],rationale:'Sur cet univers is over/across the universe; vues sur l’habitation concerns the habitation. Tire sur le rouge denotes a color tendency and remains held for phrase/sense review.'},
 {form:'aussi',fallback:'srf_zola_aussi_aussi:sns_zola_aussi_also',exceptions:{},rationale:'Mais aussi adds proportions to differences, and habitants le sont aussi adds the inhabitants to the smallness comparison.'},
 {form:'autres',fallback:'srf_fr_autres_pronoun:sns_fr_autres_others',exceptions:{},rationale:'Tous les autres refers to other faces; trois mille autres refers to additional counted substances, both substantival others.'},
 {form:'découvert',fallback:'srf_fr_decouvert_decouvrir_verb:sns_fr_decouvrir_find',exceptions:{},rationale:'The traveler has discovered thousands of other substances; no physical uncovering adjective.'},
 {form:'être',fallback:'srf_etre:sns_fr_etre_compound_auxiliary',exceptions:{},rationale:'S’être communiqué uses être as the auxiliary of a reciprocal compound verb.'}
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
const output={version:1,workId:coverage.workId,chapter:2,status:'offline_contextual_ambiguous_reuse_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Seventeen chapter II grammatical families reviewed against contextual identities and existing three-band questions. One à peine ... que component is held for expression triage.',items};
writeFileSync(resolve(root,'chapter-02-ambiguous-04.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,i)=>n+i.occurrences.length,0)}));
