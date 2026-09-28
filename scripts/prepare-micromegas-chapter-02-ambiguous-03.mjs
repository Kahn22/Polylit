import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
const rules=[
 {form:'après',fallback:'srf_zola_apres_e3ea6e68a59f_apres:sns_zola_apres_following',exceptions:{},rationale:'Every use places one event after another in time: after sleeping, arguments, questions or reasoning; none describes shouting after somebody.'},
 {form:'fut',fallback:'srf_fut:sns_fr_etre_compound_auxiliary',exceptions:{},rationale:'Se fut couchée and se fut approché use être as the auxiliary of a reflexive compound tense.'},
 {form:'autre',fallback:'srf_autre:sns_autre_adjective',exceptions:{'30:247':'srf_fr_autre_autre_pronoun:sns_fr_autre_pronoun_other','30:424':'srf_fr_autre_autre_pronoun:sns_fr_autre_pronoun_other','60:40':'srf_fr_autre_autre_pronoun:sns_fr_autre_pronoun_other'},rationale:'L’autre refers to one of the two speakers and l’un à l’autre to the other traveler; une autre forme modifies forme adjectivally.'},
 {form:'faire',fallback:'srf_faire:sns_fr_faire_perform_activity',exceptions:{'43:19':'srf_faire:sns_faire_causative'},skip:['30:396'],rationale:'Faire un voyage denotes undertaking an activity; faire des projets is to make plans. Qu’ai-je à faire de vos brunes is held for whole-expression review.'},
 {form:'lui',fallback:'srf_lui:sns_lui_primary',exceptions:{},rationale:'Lui chercher and lui repartit refer to the other speaker as the indirect recipient; neither is a stressed subject pronoun.'},
 {form:'point',fallback:'srf_point_adverb:sns_point_negation',exceptions:{},skip:['41:92'],rationale:'Ne veux point and n’ont point intensify negation; existence est un point is a temporal mathematical point requiring a separate noun identity.'},
 {form:'par',fallback:'srf_par:sns_par_primary',exceptions:{},skip:['49:0'],rationale:'Commencer par and ressembler par le don use by/through; par exemple is held for expression overlap rather than a bare by sense.'},
 {form:'ont',fallback:'srf_zola_ont_avoir:sns_parure_avoir_etre_en_relation_possessive_soit_concrete_ou_abstraite_soit_permanente_ou_occasionnelle_dont_le_possesseur_est_le_sujet_et_le_possede_est_le_complement_d_objet_direct_787c8db8b0',exceptions:{},rationale:'Les hommes ont des sens and les êtres n’ont point d’étendue attribute senses or spatial extension, not an auxiliary tense.'},
 {form:'du',fallback:'srf_du:sns_du_primary',exceptions:{},rationale:'Du peu and du soleil each contract de + le; none is the partitive some or a name particle.'},
 {form:'assez',fallback:'srf_zola_assez_assez:sns_fr_assez_rather',exceptions:{},rationale:'Un nombre assez grand has a rather/fairly large magnitude, not enough as a threshold condition.'},
 {form:'tout',fallback:'srf_tout:sns_tout_primary',exceptions:{'38:108':'srf_fr_tout_tout_adverb:sns_fr_tout_intensifying','53:12':'srf_fr_tout_tout_pronoun:sns_fr_tout_everything'},rationale:'Tout le temps and tout cela quantify whole stretches or sets. Tout comme intensifies an exact comparison; en tout is the substantival all/everything.'},
 {form:'reste',fallback:'srf_zola_reste_rester:sns_zola_rester_present',exceptions:{'51:320':'srf_reste:sns_reste_primary','58:265':'srf_reste:sns_reste_primary'},rationale:'Il nous reste describes something remaining; et le reste twice names the remainder of a list.'},
 {form:'y',fallback:'srf_y:sns_zola_y_existential',exceptions:{'46:96':'srf_y:sns_fr_y_pronominal_reference'},rationale:'Four il y a examples use existential there is; y murmurait points back to countries where the complaints occurred.'},
 {form:'fort',fallback:'srf_cigale_fourmi_fort_lem_cigale_fourmi_fort_adverb_9eb1afa20e_9c17580472:sns_fr_fort_intensifier',exceptions:{},rationale:'Fort modifies adjectives au-dessous, supérieurs, ingénieux, incertains and jaunâtre to mean very; never physical strength.'},
 {form:'mais',fallback:'srf_mais:sns_mais_primary',exceptions:{},rationale:'All seven mais link clauses with a contrast or qualification: but.'},
 {form:'jour',fallback:'srf_zola_jour_jour:sns_zola_jour_day',exceptions:{},rationale:'Un jour means some day and avoir vécu un jour a duration of one day; neither denotes daylight.'},
 {form:'personne',fallback:'srf_fr_personne_personne_pronoun:sns_fr_personne_nobody',exceptions:{},rationale:'Personne ne m’a donné is the negative pronoun nobody, not a noun denoting a person.'},
 {form:'donné',fallback:'srf_fr_donne_donner_verb:sns_zola_donner_give',exceptions:{},rationale:'M’a donné de nouvelles is to give or provide news, not to deliver a blow.'},
 {form:'ce',fallback:'srf_ce:sns_ce_primary',exceptions:{'39:12':'srf_fr_ce_ce_pronoun:sns_fr_ce_demonstrative_pronoun','45:288':'srf_fr_ce_ce_pronoun:sns_fr_ce_demonstrative_pronoun','60:56':'srf_fr_ce_ce_pronoun:sns_fr_ce_demonstrative_pronoun','60:90':'srf_fr_ce_ce_pronoun:sns_fr_ce_demonstrative_pronoun'},rationale:'Ce pays, monde, moment, globe and petit nombre are determiners. Ce soit, ce qui and ce qu’ils... are demonstrative pronouns.'},
 {form:'s’',fallback:'srf_s_elided:sns_se_primary',exceptions:{},rationale:'All five mark a reflexive or pronominal verb: exhaust oneself, teach oneself, be called, ask about or communicate with one another.'},
 {form:'faits',fallback:'srf_zola_faits_fait_noun:sns_zola_fait_event',exceptions:{},rationale:'Revenir aux faits means return to factual evidence, not a passive participle made.'},
 {form:'soit',fallback:'srf_zola_soit_etre:sns_zola_etre_subjunctive',exceptions:{},rationale:'Que ce soit and qui ne soit both require subjunctive être as a linking verb.'},
 {form:'existence',fallback:'srf_zola_existence_existence:sns_fr_existence_lifetime',exceptions:{},rationale:'Notre existence est un point compares the Saturnian lifespan with a tiny point of time, not bare existence.'}
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
const output={version:1,workId:coverage.workId,chapter:2,status:'offline_contextual_ambiguous_reuse_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Twenty-three chapter II grammatical families reviewed against contextual identities and existing three-band questions. One à peine ... que component is held for expression triage.',items};
writeFileSync(resolve(root,'chapter-02-ambiguous-03.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,i)=>n+i.occurrences.length,0)}));
