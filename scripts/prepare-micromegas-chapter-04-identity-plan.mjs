import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas'),packetBytes=readFileSync(resolve(dir,'chapter-04-identity-packet.json'));
const packet=JSON.parse(packetBytes),sha=b=>createHash('sha256').update(b).digest('hex');
// Source meaning was compared with the published French lemma senses and prior chapter plans.
const links={
 mangerent_ate:'sns_cendrillon_manger_macher_et_avaler_',permis_permitted:'sns_zola_permettre_allow',fit_made:'sns_faire_primary',
 suivait_was_following:'sns_cendrillon_suivre_aller_ou_venir_apres_',suivrait_would_follow:'sns_cendrillon_suivre_aller_ou_venir_apres_',
 telles_such:'sns_tel_primary',tres_petit_very_small:'sns_zola_petit_small',pareil_similar:'sns_parure_pareil_qui_presente_',
 songer_to_think:'sns_fr_songer_think',vont_go:'sns_aller_primary',partis_departed:'sns_partir_primary',
 revenus_returned:'sns_zola_revenir_return',apercevoir_to_catch_sight_of:'sns_parure_apercevoir_commencer_a_voir_',
 tacher_to_try:'sns_fr_tacher_try',allant_going:'sns_aller_primary',coucherent_lay_down:'sns_parure_coucher_etendre_',
 decida_decided:'sns_zola_decider_determine',apercois_i_can_see:'sns_parure_apercevoir_commencer_a_voir_',
 concluez_do_you_conclude:'sns_zola_conclure_conclude',existent_exist:'sns_zola_exister_be_present',
 sentir_to_make_someone_realize:'sns_fr_sentir_perceive_realize',senti_felt:'sns_parure_sentir_recevoir_quelque_impression_par_le_moyen_des_sens_',
 ronds_round:'sns_parure_rond_round_',pense_think:'sns_fr_penser_think',voudraient_would_want:'sns_zola_vouloir_conditional',
 dites_say:'sns_dire_primary',remarque_noticed:'sns_fr_remarquer_notice',raison_la_that_very_reason:'sns_loup_agneau_raison_argument_',
 raisons_reasons:'sns_loup_agneau_raison_argument_',tomberent_fell:'sns_tomber_primary',
 jolis_pretty:'sns_parure_joli_pretty_',choisit_chose:'sns_fr_choisir_select',
 ongle_fingernail:'sns_parure_ongle_lame_dure_',idees_ideas:'sns_zola_idee_conception',
 examina_examined:'sns_zola_examiner_inspect',penser_to_think:'sns_fr_penser_think',
 revenait_was_returning:'sns_zola_revenir_return',
 passa_happened:'sns_zola_passer_elapse_happen',a_existential:'sns_fr_avoir_existential',
 apercut_realized:'sns_parure_apercevoir_notice_',certaines_some:'sns_fr_certain_unspecified',
 marche_walk:'sns_zola_marcher_advance'
};
const shared={nain_dwarf:'nains_dwarfs',sensation_sensation:'sensations_sensory_experiences',globe_ci_this_globe_here:'globe_planet',tourne_orbits:'tournent_orbit',variete_variety:'varietes_diversities',quelques_uns_some_of_them:'quelques_unes_some_of_them',microscope_microscope:'microscopes_optical'};
const within={baleines_whales:'baleine_whale',d_article:'de_plural_article'};
const plannedLemma={embarrasse_perplexed:'embarrassa_bothered'};
const distinct={
 tourne_rotates:'Turns on its own axis. The published tourner questions concern changes of direction or bodily orientation; earlier planned forms describe orbital travel.',
 etrangers_la_those_strangers:'The compound refers to those foreign travelers as people, while the existing étranger sense is an adjective meaning foreign.',
 recurent_received:'Receiving a sensory impression differs from the published questions about an incoming letter or parcel.',
 jugeait_was_judging:'Forms a hasty opinion on whether there are inhabitants; the existing judge sense teaches formal adjudication.',
 demeurer_to_live:'The source asks whether beings would reside on the planet; published demeurer questions teach remaining in a state or staying somewhere temporarily, so residential dwelling needs separate review.',
 tire_drawn:'The fixed au cordeau construction describes a regular layout with a cord; published tirer senses teach pulling toward oneself, removing something, or shooting.',
 pesaient_weighed:'The diamonds have measurable weight in livres; the published peser sense teaches figurative pressure or burden, so literal weight needs a distinct sense.',
 tirait_derived:'The source asks where an atom derives motion; published tirer questions concern drawing or pulling a physical object and shooting.',
 logee_housed:'The figurative lodging of an âme within a whale differs from a person staying in a residence.',
 temps_la_that_time:'The attached demonstrative points to a particular historical period; the published temps senses teach unqualified time.',
 avise_thought_of:'Personne ne s’était avisé means nobody had thought of it; published aviser teaches considering a course of action or advising.',
 eurent_had:'Eurent de la peine expresses experienced difficulty; the earlier planned eurent is an auxiliary in eurent fait and has an already reviewed source occurrence.',
 de_plural_article:'De before plural adjectives acts as an indefinite plural article; the published de questions teach prepositional of/from.',
 de_partitive:'De la confusion and de la variété express an unspecified quantity; published genitive de questions teach a relation between nouns.',
 de_approach:'Approcher de ses yeux uses de for direction toward a target, unlike the published genitive examples.',
 d_adjective:'Quelque chose d’imperceptible links an indefinite pronoun to an adjective, unlike published of/from examples.',
 d_negative_quantity:'Point d’esprit uses de under negation after a quantifier, unlike the published genitive examples.',
 d_degree:'D’aussi gros qu’une baleine links an adjective in a degree comparison, unlike the published genitive examples.',
 comme_cause:'Comme opens a causal clause, whereas published comme questions teach similarity.',
 comme_exclamative:'The exclamative comme highlights how the planet is shaped and moving; published questions teach comparison.',
 comme_manner:'Comme la chose se passa specifies the manner of narration, whereas the published questions teach simple comparison.',
 gens_attendants:'Ses gens are the travelers’ attendants; the published gens questions teach people of a neighborhood generally.',
 ou_relative:'These relative où occurrences refer back to a place or source; published questions teach an interrogative where.',
 non_alternative:'Ou non completes a yes-or-no alternative; published non questions teach a standalone negative reply.',
 parler_refer:'Parler des montagnes means referring to them; published parler questions teach speaking aloud.',
 etaient_passive:'Étaient taillés is a passive formation; published étaient questions teach linking or a compound tense.',
 ete_motion:'Avaient été faire observations is a historical going-to-do construction; published été questions teach a linking state.',
 doigt_literal:'Petit doigt is a literal finger; the published question set foregrounds figurative toucher du doigt.',
 grains_projections:'The pointed grains are mountainous protrusions at the giants’ scale, unlike the published cereal examples.',
 imagina_supposed:'S’imagina that the planet contained only whales expresses a supposition; published questions teach devising something.',
 livres_weight:'Four hundred livres are a unit of weight, unlike the published book and account-book senses.',
 moyen_possibility:'Pas moyen de croire denies possibility; published moyen questions teach a method or instrument.',
 pays_area:'The little pays is the terrain before the travelers, not necessarily a bordered nation in the published examples.',
 plutot_correction:'Ou plutôt corrects the preceding noun; published plutôt questions teach preference between alternatives.',
 reconnaitre_survey:'Reconnaître the little country is to survey terrain; published questions teach acknowledging or identifying a familiar thing.',
 sauver_escape:'Se sauver after a shipwreck means escape; published sauver questions teach transitive rescue.',
 secours_instrument:'Par leur secours refers to the microscopes as means; published secours questions teach help to a distressed person.'
};
const held={
 reposes_rested:'The published reposer gloss defines only repose as third-person singular, while the source uses plural reflexive reposés; inspect all earlier questions and dependencies before sharing its rest sense.',
 chien_dog:'The published chien sense gloss defines the plural chiens; this singular chien needs a number-compatible shared dog gloss before linkage.'
};
const used=new Set();
const items=packet.items.map(e=>{
 let route,targetSenseId,targetLemmaId,dependsOn,intendedSenseGroup,rationale;
 if(Object.hasOwn(links,e.key)){
  used.add(e.key);
  const choices=e.publishedLemmaCandidates.flatMap(l=>l.senses.map(s=>({...s,lemmaId:l.lemmaId}))).filter(s=>s.senseId.startsWith(links[e.key]));
  if(choices.length!==1)throw Error(`Published identity unclear ${e.key}: ${choices.length}`);
  const m=choices[0];route='link_published_sense';targetSenseId=m.senseId;targetLemmaId=m.lemmaId;
  rationale=`In the source, ${e.form} means ${e.meaning}; the chosen published sense (${m.gloss}) teaches the same contextual action or attribute, with this new surface retaining its authored three question bands.`;
 }else if(Object.hasOwn(shared,e.key)){
  used.add(e.key);const previous=e.relatedEarlierPlans.find(i=>i.key===shared[e.key]);
  if(!previous)throw Error(`Earlier planned sense missing ${e.key}`);
  route='link_planned_earlier_sense';dependsOn=`chapter-${String(previous.chapter).padStart(2,'0')}-identity-plan.json:${previous.key}`;
  intendedSenseGroup=previous.intendedSenseGroup??`${e.lemma}:${previous.key}`;
  rationale=`The new ${e.form} occurrence has the same source meaning as earlier ${previous.form}: ${previous.meaning}; preserve their one planned sense while authoring this form's own questions.`;
 }else if(Object.hasOwn(within,e.key)){
  used.add(e.key);const previous=packet.items.find(i=>i.key===within[e.key]);if(!previous||previous.lemma!==e.lemma)throw Error(`Chapter IV planned sense missing ${e.key}`);
  route='link_planned_chapter_four_sense';dependsOn=`chapter-04-identity-plan.json:${previous.key}`;intendedSenseGroup=`${e.lemma}:${previous.key}`;
  rationale=`The source use ${e.form} is the plural of earlier Chapter IV ${previous.form}; both refer to ${previous.meaning}, so retain one planned sense with separate surface questions.`;
 }else if(Object.hasOwn(plannedLemma,e.key)){
  used.add(e.key);const previous=e.relatedEarlierPlans.find(i=>i.key===plannedLemma[e.key]);if(!previous)throw Error(`Planned lemma missing ${e.key}`);
  route='new_sense_planned_earlier_lemma';dependsOn=`chapter-${String(previous.chapter).padStart(2,'0')}-identity-plan.json:${previous.key}`;intendedSenseGroup=`${e.lemma}:${e.key}`;
  rationale=`The source ${e.form} means ${e.meaning}, distinct from earlier ${previous.form} (${previous.meaning}); add a sense under the planned lemma rather than creating a duplicate lemma.`;
 }else if(Object.hasOwn(distinct,e.key)){
  used.add(e.key);if(!e.publishedLemmaCandidates.length)throw Error(`Missing published lemma ${e.key}`);
  route='new_sense_existing_lemma';targetLemmaId=e.publishedLemmaCandidates.find(l=>l.partOfSpeech===e.partOfSpeech.split(' ')[0])?.lemmaId??e.publishedLemmaCandidates[0].lemmaId;
  rationale=distinct[e.key];
 }else if(Object.hasOwn(held,e.key)){
  used.add(e.key);if(!e.publishedLemmaCandidates.length)throw Error(`Missing published lemma hold ${e.key}`);
  route='published_sense_repair_pending';targetLemmaId=e.publishedLemmaCandidates[0].lemmaId;targetSenseId=e.publishedLemmaCandidates[0].senses[0].senseId;
  rationale=held[e.key];
 }else{
  if(e.publishedLemmaCandidates.length)throw Error(`Unadjudicated published French lemma ${e.key}`);
  route='new_lemma_and_sense';intendedSenseGroup=`${e.lemma}:${e.key}`;
  rationale=`No published French lemma for ${e.lemma}; prepare a new ${e.meaning} source sense and check later occurrences across the remaining chapters before learner import.`;
 }
 return {key:e.key,form:e.form,lemma:e.lemma,meaning:e.meaning,batchFile:e.batchFile,questionSha256:e.questionSha256,sourceOccurrencesSha256:e.sourceOccurrencesSha256,sourceUseCount:e.sourceOccurrences.length,route,...(targetSenseId?{targetSenseId}:{}),...(targetLemmaId?{targetLemmaId}:{}),...(dependsOn?{dependsOn}:{}),...(intendedSenseGroup?{intendedSenseGroup}:{}),rationale,status:'offline_identity_route_pending_complete_work_import'};
});
for(const key of [...Object.keys(links),...Object.keys(shared),...Object.keys(within),...Object.keys(plannedLemma),...Object.keys(distinct),...Object.keys(held)])if(!used.has(key))throw Error(`Unused decision ${key}`);
const summary={};for(const item of items)summary[item.route]=(summary[item.route]??0)+1;
writeFileSync(resolve(dir,'chapter-04-identity-plan.json'),JSON.stringify({version:1,workId:packet.workId,chapter:4,status:'source_bound_partial_chapter_identity_plan_unpublished',identityPacketSha256:sha(packetBytes),sourceSha256:packet.sourceSha256,unitPlanSha256:packet.unitPlanSha256,summary,items},null,2)+'\n');
console.log(JSON.stringify({meanings:items.length,routes:summary}));
