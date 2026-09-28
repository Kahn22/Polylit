import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(root,n)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const packetBytes=readFileSync(resolve(root,'chapter-02-identity-packet.json'));
const packet=JSON.parse(packetBytes);
// Every key in this table was compared to the listed published lemma sense.
// Prefix resolution below rejects an ambiguous or absent sense, including a catalogue change.
const links={
 couchee_lain_down:'sns_parure_coucher_etendre',approche_moved_nearer:'sns_parure_approcher_mettre_proche',laissez_leave:'sns_parure_laisser_quitter',
 plaise_please:'sns_parure_plaire_please',instruise_teach:'sns_cendrillon_instruire_enseigner',commencez_begin:'sns_zola_commencer_begin',
 besoins_necessities:'sns_zola_besoin_need',sommes_we_are:'sns_etre_primary',ennuyer_get_bored:'sns_fr_ennuyer_reflexive_bored',
 avertit_warns:'sns_cendrillon_avertir_informer',arriverai_will_reach:'sns_fr_arriver_reach_destination',nouvelles_reports:'sns_parure_nouvelle_genre_litteraire',
 fallut_was_necessary:'sns_parure_falloir_etre_de_necessite',vivez_live:'sns_vivre_primary',helas_alas:'sns_cendrillon_helas_marque',
 vivons_we_live:'sns_vivre_primary',maniere_way:'sns_cendrillon_maniere_facon',voyez_you_see:'sns_fr_voir_ascertain',
 mourir_die:'sns_zola_mourir_die',commence_started:'sns_zola_commencer_begin',arrive_comes:'sns_arriver_primary',
 trouve_feels_oneself:'sns_fr_trouver_reflexive_state',etiez_were:'sns_etre_primary',savez_you_know:'sns_zola_savoir_present',
 vecu_lived:'sns_vivre_primary',remercier_thank:'sns_cendrillon_remercier_rendre',ressemblent_are_alike:'sns_cendrillon_ressembler_avoir',
 comptez_count:'sns_zola_compter_count',parlez_speak:'sns_zola_parler_speak',lesquelles_which:'sns_zola_lequel_which',
 croyons_we_believe:'sns_croire_primary',comptons_we_count:'sns_zola_compter_count',admire_admires:'sns_cendrillon_admirer_considerer',
 vois_i_see:'sns_zola_voir_observe',examine_examined:'sns_zola_examiner_inspect',ressemble_is_alike:'sns_cendrillon_ressembler_avoir',
 comptait_counted:'sns_zola_compter_count',apprit_learned:'sns_apprendre_primary',sentent_perceive:'sns_parure_sentir_recevoir',
 pensent_think:'sns_fr_penser_think',etonna_surprised:'sns_zola_etonner_surprise',savaient_knew:'sns_zola_savoir_present',
 aucuns_no_plans_determiner:'sns_zola_aucun_none',aient_have_subjunctive:'sns_avoir_primary',pres_approximately:'sns_fr_pres_nearly',
 instruire_learn:'sns_cendrillon_instruire_enseigner',ete_been_in_place:'sns_fr_etre_presence'
};
const newSenses={
 quai_what_have_i:'The fused interrogative and first-person verb ask what relation the speaker has; no published avoir question teaches this token.',
 traits_painted_lines:'The visible lines/features of paintings differ from the published arrow or dart noun.',
 plaignons_complain:'Reflexive complaint about too few senses differs from pitying someone.',
 manque_is_lacking:'Il ne manque rien expresses absence, not the published fail-to-do sense.',
 revient_amounts_to:'The conversion amounts to fifteen thousand years rather than a return journey.',
 experience_life_knowledge:'Wisdom gained from living differs from an experiment or ordeal.',
 apprenant_informing:'The speaker would inform his listener, whereas published apprendre teaches learning as recipient.',
 murmurait_grumbled:'Complaint about lifespan has a grumbling value beyond the published soft-speaking sense.',
 vues_purposes:'The Creator’s aims are intentions, not visual sight.',
 tire_tends_toward_color:'The solar color tends toward red; published drawing, taking out and shooting are different.',
 questions_inquiries:'Requests for answers differ from the published issue or matter noun.',
 aucuns_none_pronoun:'An archaic plural independent pronoun needs a separate grammatical sense from the determiner no/any.',
 parures_adornments:'Unspecified finery and ornamentation should not be narrowed to the published set of jewelry.',
 passions_strong_desires:'Intense desires springing from senses differ from dedication to a pursuit.',
 pensee_faculty_of_thought:'The faculty of thinking differs from one particular thought in the published questions.',
 la_set_aside:'Laissez là dismisses a comparison; a location-there identity and quiz would misteach it.',
 pour_for_my_part:'Pour moi marks viewpoint rather than the published purpose or beneficiary use.',
 chez_among_world_of:'Among inhabitants of a world differs from the published premises of a relative.',
 fais_cut_a_figure:'Faire figure presents an impression, not fabrication or causing someone to act.',
 exemple_illustration:'An illustrative example differs from a historical precedent or a model to imitate.',
 sens_sensory_faculties:'Perceptual faculties are distinct from direction and sound judgment.',
 point_tiny_instant:'A dimensionless point as a metaphor for duration differs from negation or timely à point.',
 figure_appearance:'The appearance one cuts before another differs from anatomy and standing.',
 va_goes_beyond:'Figurative imagination exceeding needs differs from walking, near future and progressive auxiliary.',
 sur_toward_color:'The shade tends toward red rather than being on or about something.'
};
const sharedWithChapterOne={
 saturnien_inhabitant:'saturniens_inhabitants',voyage_traveled:'voyager_travel',satisfaction_fulfillment:'satisfaction_pleasure',
 affliger_distress:'afflige_distressed',proportions_ratios:'proportion_ratio',rayons_lightbeams:'rayon_lightbeam',
 voyages_journeys:'voyage_journey'
};
const usedLink=new Set(),usedNew=new Set(),usedShared=new Set();
const items=packet.items.map(entry=>{
 let route,targetSenseId,targetLemmaId,intendedSenseGroup,rationale;
 if(Object.hasOwn(sharedWithChapterOne,entry.key)){
  usedShared.add(entry.key);
  const priorKey=sharedWithChapterOne[entry.key],prior=entry.chapterOneRelated.find(item=>item.key===priorKey);
  if(!prior||prior.route!=='new_lemma_and_sense'||!prior.intendedSenseGroup)throw Error(`Stale chapter I group ${entry.key}`);
  route='link_planned_chapter_one_sense';intendedSenseGroup=prior.intendedSenseGroup;
  rationale=`The source meaning shares the ${prior.meaning} thought unit with chapter I ${prior.key}; retain one future sense across its different surface forms.`;
 }else if(Object.hasOwn(links,entry.key)){
  usedLink.add(entry.key);
  const candidates=entry.publishedLemmaCandidates.flatMap(l=>l.senses.map(s=>({...s,lemmaId:l.lemmaId})));
  const matches=candidates.filter(c=>c.senseId.startsWith(links[entry.key]));
  if(matches.length!==1)throw Error(`Ambiguous published sense ${entry.key}: ${matches.length}`);
  route='link_published_sense';targetSenseId=matches[0].senseId;targetLemmaId=matches[0].lemmaId;
  rationale=`The reviewed source sense ${entry.meaning} fits published ${matches[0].gloss}; author the separate ${entry.form} surface questions while sharing the sense.`;
 }else if(Object.hasOwn(newSenses,entry.key)){
  usedNew.add(entry.key);
  if(!entry.publishedLemmaCandidates.length)throw Error(`Missing existing lemma for ${entry.key}`);
  route='new_sense_existing_lemma';targetLemmaId=entry.publishedLemmaCandidates.find(l=>l.partOfSpeech===entry.partOfSpeech.split(' ')[0])?.lemmaId??entry.publishedLemmaCandidates[0].lemmaId;
  rationale=newSenses[entry.key];
 }else{
  if(entry.publishedLemmaCandidates.length)throw Error(`Unadjudicated published lemma ${entry.key}`);
  route='new_lemma_and_sense';intendedSenseGroup=`${entry.lemma}:${entry.key}`;
  rationale=`No published French lemma candidate; the source meaning ${entry.meaning} requires a new lemma and sense unless complete-work reconciliation finds a later shared form.`;
 }
 return {key:entry.key,form:entry.form,lemma:entry.lemma,meaning:entry.meaning,partOfSpeech:entry.partOfSpeech,batchFile:entry.batchFile,sourceOccurrencesSha256:entry.sourceOccurrencesSha256,questionSha256:entry.questionSha256,chapterTwoUseCount:entry.sourceOccurrences.filter(o=>o.chapter===2).length,route,...(targetSenseId?{targetSenseId}:{}),...(targetLemmaId?{targetLemmaId}:{}),...(intendedSenseGroup?{intendedSenseGroup}:{}),rationale,status:'offline_identity_route_pending_individual_question_QA_and_full_work_import'};
});
if(usedLink.size!==Object.keys(links).length||usedNew.size!==Object.keys(newSenses).length||usedShared.size!==Object.keys(sharedWithChapterOne).length)throw Error('Unused identity decision');
const summary={};for(const item of items)summary[item.route]=(summary[item.route]??0)+1;
const output={version:1,workId:packet.workId,chapter:2,status:'source_bound_offline_identity_route_plan_unpublished',identityPacketSha256:hash(packetBytes),sourceSha256:packet.sourceSha256,unitPlanSha256:packet.unitPlanSha256,note:'Each of 171 new meanings has a source-and-question fingerprint and an editorial route. A route is not a learner import or approval of its three questions; later chapters may add forms and must share the appropriate planned sense.',summary,items};
writeFileSync(resolve(root,'chapter-02-identity-plan.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({meanings:items.length,routes:summary}));
