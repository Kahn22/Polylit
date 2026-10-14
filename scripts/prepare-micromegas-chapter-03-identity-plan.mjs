import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas'),data=readFileSync(resolve(dir,'chapter-03-identity-packet.json'));
const packet=JSON.parse(data),sha=b=>createHash('sha256').update(b).digest('hex');
// These links compare source meanings to specific published French senses.
// A spelling or an automatically ranked candidate never approves a link.
const links={
 prets_ready:'sns_pret_primary',vint_came:'sns_zola_venir_arrive',cruel_cruel:'sns_loup_agneau_cruel_',s_ecria_exclaimed:'sns_parure_ecrier_',
 commencais_i_was_beginning:'sns_zola_commencer_begin',quittes_you_leave:'sns_parure_quitter_laisser_',changeant_changeable:'sns_fr_changeant_variable',
 aimerai_i_will_love:'sns_zola_aimer_love',pleura_cried:'sns_cendrillon_pleurer_',partirent_left:'sns_partir_primary',sauterent_jumped:'sns_parure_sauter_',
 eurent_had:'sns_zola_avoir_possess_auxiliary',passerent_passed:'sns_parure_passer_aller_d_un_lieu_',resterent_stayed:'sns_zola_rester_present',
 apprirent_learned:'sns_apprendre_primary',beaux_fine:'sns_zola_beau_beautiful',promets_i_promise:'sns_parure_promettre_s_engager_',
 fera_will_make:'sns_parure_faire_creer_produire_',oublierai_i_will_forget:'sns_cendrillon_oublier_',
 revenons_let_us_return:'sns_zola_revenir_return',sortant_leaving:'sns_parure_sortir_passer_du_dedans_',virent_saw:'sns_fr_voir_perceive',
 servent_serve:'sns_fr_servir_useful',raisonnent_reason:'sns_zola_raisonner_reason',bons_good:'sns_zola_bon_good',
 apercurent_spotted:'sns_parure_apercevoir_commencer_a_voir_',venaient_came:'sns_zola_venir_arrive',arriverent_arrived:'sns_fr_arriver_reach_destination',
 mil_thousand:'sns_parure_mille_dix_fois_cent_',nouveau_new:'sns_fr_nouveau_new',livres_books:'sns_parure_livre_assemblage_de_feuilles_',
 long_long:'sns_zola_long_extended',trouvant_finding:'sns_zola_trouver_discover',mirent_placed_themselves:'sns_parure_mettre_placer_une_personne_',
 toute_quite:'sns_fr_tout_intensifying',etais_you_were:'sns_etre_primary',passe_spent:'sns_fr_passer_spend_time',
 trouve_considered:'sns_zola_trouver_judge',trouverent_found_to_be:'sns_zola_trouver_judge',passait_was_passing_by:'sns_parure_passer_aller_d_un_lieu_'
};
const shared={
 philosophes_philosophers:'philosophe_thinker',lune_moon:'lunes_satellites',annee_year:'annees_years',
 voyageurs_travelers:'voyageur_traveler',philosophes_la_those_philosophers:'philosophe_thinker',craignirent_feared:'craindrais_would_fear',
 derniere_last:'dernier_most_recent',fit_caused:'fit_caused_trouble'
};
const newSenses={
 reparait_made_up_for:'The pleasant qualities compensate for small size; existing réparer only repairs physical damage.',
 plat_flat:'Published plat is a noun for a dish; the ring requires a flat adjective.',
 dures_harsh:'The inquisitors judge ideas objectionable; harsh character and harsh living conditions questions teach other senses.',
 louer_to_praise:'Praise of a prelate is separate from renting a home.',
 article_article:'An encyclopedia entry differs from the published statutory article of a law.',
 donnent_give:'Giving hope or inspiring expectations differs from the published physical transfer of possessions.',
 passat_could_do_without:'Se passer de something means manage without it, not moving past it.',
 poussent_push_onward:'Pushing the journey onward to the next town differs from physically pushing a person or object.',
 pere_father:'Père Castel is a clerical title, distinct from biological father; preserve the parent identity at the other chapter use.',
 rapporte_defer_to:'Je m’en rapporte defers to another person’s judgment, not reporting or bringing back.',
 voisine_nearby:'An adjacent city is an adjective, distinct from a female neighbor noun.',
 presse_printing_press:'Sous presse is the printing process, not the published journalists and newspapers sense.',
 terre_land:'Arriving at dry land differs from the published fertile soil question and from Earth as a planet.',
 moins_less:'Fewer/less has no correct published moins questions; existing senses mean unless, at least or in the least.',
 rendre_to_yield:'She yields to her lover, different from give back, make become, or issue a decision.',
 maitresse_mistress:'His romantic partner differs from published maîtresse as an imposing adjective in maîtresse barbe.'
};
const held={tes_your:'The published ton determiner definition restricts possession to masculine singular; tes bras needs plural-compatible shared your semantics. Inspect all dependencies before broadening the existing sense; keep the new questions offline.'};
const plannedLemmaDistinct={echappe_escaped_notice:'The earlier escaping smile and this escape from observation share a planned lemma, but their question scopes differ.'};
const used={links:new Set(),shared:new Set(),newSenses:new Set(),held:new Set(),plannedLemmaDistinct:new Set()};
const items=packet.items.map(entry=>{
 let route,targetSenseId,targetLemmaId,intendedSenseGroup,rationale,dependsOn;
 if(Object.hasOwn(links,entry.key)){
  used.links.add(entry.key);
  const matches=entry.publishedLemmaCandidates.flatMap(l=>l.senses.map(s=>({...s,lemmaId:l.lemmaId}))).filter(s=>s.senseId.startsWith(links[entry.key]));
  if(matches.length!==1)throw Error(`Published choice missing/ambiguous ${entry.key} ${matches.length}`);
  const m=matches[0];route='link_published_sense';targetSenseId=m.senseId;targetLemmaId=m.lemmaId;
  rationale=`The source use ${entry.meaning} matches published ${m.gloss}; new ${entry.form} questions remain separate from the existing surface questions.`;
 }else if(Object.hasOwn(shared,entry.key)){
  used.shared.add(entry.key);
  const prior=entry.relatedEarlierPlans.find(i=>i.key===shared[entry.key]);
  if(!prior)throw Error(`Missing earlier identity ${entry.key}`);
  route='link_planned_earlier_sense';dependsOn=`chapter-${String(prior.chapter).padStart(2,'0')}-identity-plan.json:${prior.key}`;
  intendedSenseGroup=prior.intendedSenseGroup??`planned:${prior.chapter}:${prior.key}`;
  rationale=`The source meaning ${entry.meaning} fits the earlier ${prior.meaning} thought unit; preserve its sense across the distinct ${entry.form} surface.`;
 }else if(Object.hasOwn(newSenses,entry.key)){
  used.newSenses.add(entry.key);if(!entry.publishedLemmaCandidates.length)throw Error(`Published lemma missing ${entry.key}`);
  route='new_sense_existing_lemma';targetLemmaId=entry.publishedLemmaCandidates.find(l=>l.partOfSpeech===entry.partOfSpeech.split(' ')[0])?.lemmaId??entry.publishedLemmaCandidates[0].lemmaId;
  rationale=newSenses[entry.key];
 }else if(Object.hasOwn(held,entry.key)){
  used.held.add(entry.key);route='published_sense_repair_pending';targetLemmaId=entry.publishedLemmaCandidates[0]?.lemmaId;
  targetSenseId=entry.publishedLemmaCandidates[0]?.senses[0]?.senseId;
  rationale=held[entry.key];
 }else if(Object.hasOwn(plannedLemmaDistinct,entry.key)){
  used.plannedLemmaDistinct.add(entry.key);route='new_sense_planned_lemma';dependsOn='chapter-01-identity-plan.json:echappe_occurs_involuntarily';
  rationale=plannedLemmaDistinct[entry.key];
 }else{
  if(entry.publishedLemmaCandidates.length)throw Error(`Published lemma unadjudicated ${entry.key}`);
  route='new_lemma_and_sense';intendedSenseGroup=`${entry.lemma}:${entry.key}`;
  rationale=`No published French lemma for ${entry.lemma}; create the source-scoped ${entry.meaning} sense, reconciling later chapter forms before learner import.`;
 }
 return {key:entry.key,form:entry.form,lemma:entry.lemma,meaning:entry.meaning,batchFile:entry.batchFile,questionSha256:entry.questionSha256,sourceOccurrencesSha256:entry.sourceOccurrencesSha256,sourceUseCount:entry.sourceOccurrences.length,route,...(targetLemmaId?{targetLemmaId}:{}),...(targetSenseId?{targetSenseId}:{}),...(intendedSenseGroup?{intendedSenseGroup}:{}),...(dependsOn?{dependsOn}:{}),rationale,status:'offline_chapter_identity_route_pending_complete_work_import'};
});
for(const [group,record] of Object.entries(used))if(record.size!==Object.keys({links,shared,newSenses,held,plannedLemmaDistinct}[group]).length)throw Error(`Unused ${group}`);
const summary={};for(const item of items)summary[item.route]=(summary[item.route]??0)+1;
writeFileSync(resolve(dir,'chapter-03-identity-plan.json'),JSON.stringify({version:1,workId:packet.workId,chapter:3,status:'source_bound_identity_plan_unpublished',identityPacketSha256:sha(data),sourceSha256:packet.sourceSha256,unitPlanSha256:packet.unitPlanSha256,summary,items},null,2)+'\n');
console.log(JSON.stringify({meanings:items.length,routes:summary}));
