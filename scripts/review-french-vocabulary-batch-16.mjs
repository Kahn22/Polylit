import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-16';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_lion_rat_animaux_lem_animal_7854ab9a8d:sns_lion_rat_animal_metazoaire_etre_organise_doue_de_sensibilite_et_de_mouvement_et_reproductible_au_sein_de_son_espece_6c644b0ff3', 'approve', 'Reviewed the sole use Roi des animaux (“king of the animals”): animaux is the plural of animal, the animal kingdom. The common-noun sense and plural form fit.'],
  ['srf_lion_rat_bienfait_lem_lion_rat_bienfait_noun_432715c518_1f51da02b6:sns_lion_rat_bienfait_bien_qu_on_fait_a_quelqu_un_service_bon_office_que_l_on_rend_grace_faveur_que_l_on_accorde_682b6986ac', 'approve', 'Reviewed the sole sentence Ce bienfait ne fut pas perdu: the rat’s helpful deed was not forgotten. Bienfait means a good deed/favor, matching the story.'],
  ['srf_lion_rat_defaire_lem_zola_defaire_1e95c0a216:sns_lion_rat_defaire_delivrer_de_ce_qui_retient_prisonnier_58fcef5c18', 'approve', 'Reviewed the sole occurrence: the lion’s roars could not free him from the nets. Défaire means to release/free from what binds, matching the context.'],
  ['srf_lion_rat_dents_lem_lion_rat_dent_noun_071a135418_5fa27089de:sns_lion_rat_dent_petit_organe_compose_d_email_de_dentine_et_d_une_pulpe_enchasses_dans_la_machoire_qui_sert_a_inciser_a_dechirer_a_macher_les_aliments_et_a_mordre_fdabf3b0ff', 'approve', 'Reviewed the sole occurrence: the rat gnawed through a mesh with his teeth. Dents is the plural form of dent, the tooth noun, and the anatomical sense fits.'],
  ['srf_lion_rat_emporta_lem_emporter_cdb9d4debc:sns_lion_rat_emporter_fit_disparaitre_ou_ceder_l_ensemble_de_l_ouvrage_6389013efe', 'approve', 'Reviewed the sole occurrence: one gnawed mesh carried away/brought down the whole web. Emporta is the past historic of emporter, and the contextual “carried away; destroyed” gloss fits.'],
  ['srf_lion_rat_etourdie_lem_lion_rat_etourdi_adjective_c94b700e0e_80b8ffe5a2:sns_lion_rat_etourdi_qui_agit_sans_reflexion_ni_prudence_881025a8e8', 'hold', 'The sole occurrence uses à l’étourdie adverbially (“heedlessly/unwarily”), while this is assigned to an adjective lemma/form. Clarify the construction and grammatical assignment before approval.'],
  ['srf_lion_rat_fables_lem_lion_rat_fable_noun_bbca160f90_2e14a7a2ac:sns_lion_rat_fable_ce_que_l_on_dit_ce_que_l_on_raconte_246c7ebc45', 'approve', 'Reviewed the sole occurrence: two fables are said to bear witness to a truth. Fables means stories/fables, and the plural noun form is correct.'],
  ['srf_lion_rat_feront_lem_faire_b1cfeaa31c:sns_lion_rat_faire_serviront_a_etablir_quelque_chose_dans_l_expression_faire_foi_0bfc11d427', 'approve', 'Reviewed the sole construction deux fables feront foi: the fables will serve as evidence/testify to the truth. The future form ferонt and expression-specific sense are appropriate.'],
  ['srf_lion_rat_lion_lem_lion_rat_lion_noun_52c384662a_84de8392eb:sns_lion_rat_lion_grand_felin_carnivore_panthera_leo_autrefois_repandu_des_balkans_au_sous_continent_indien_et_dans_toute_l_afrique_2fe7ea3cdf', 'approve', 'Reviewed all three occurrences: Lion names the animal caught in nets, including the fable’s title and narrative references. The animal noun sense is consistent.'],
  ['srf_lion_rat_longueur_lem_lion_rat_longueur_noun_970a573be9_d2d97d5456:sns_lion_rat_longueur_duree_prolongee_ici_associee_au_temps_76f62e699d', 'approve', 'Reviewed the sole phrase patience et longueur de temps: longueur refers to the duration/length of time. The gloss “length; duration” fits the aphorism.'],
  ['srf_lion_rat_maille_lem_lion_rat_maille_noun_fae981889d_de69a413ea:sns_lion_rat_maille_boucle_constituant_un_filet_cadb49ba14', 'approve', 'Reviewed the sole occurrence: the rat gnaws through a maille of the lion’s net. Maille means a mesh/loop in a net, matching the concrete object.'],
  ['srf_lion_rat_montra_lem_montrer_6afd7932d0:sns_lion_rat_montrer_faire_voir_exposer_aux_regards_fea895fd29', 'hold', 'The occurrence means the king revealed/showed his true character, but an unresolved same-lemma duplicate candidate exists. Reconcile exact lemma/sense reuse before approval.'],
  ['srf_lion_rat_obliger_lem_zola_obliger_856816f66b:sns_lion_rat_obliger_rendre_service_a_quelqu_un_et_lui_inspirer_de_la_reconnaissance_6eee18dab5', 'approve', 'Reviewed the sole occurrence Il faut… obliger tout le monde: the maxim says to help/do favors for everyone when possible. Oblig(er) has that sense here.'],
  ['srf_lion_rat_pattes_lem_lion_rat_patte_noun_7dc0289cbe_d189792b07:sns_lion_rat_patte_membres_d_un_animal_qui_lui_servent_a_marcher_1e0ece0e15', 'approve', 'Reviewed the sole occurrence: the rat emerges from beneath the lion’s paws. Pattes is the plural noun for an animal’s feet/paws.'],
  ['srf_lion_rat_rets_lem_lion_rat_rets_noun_a2b86ebfe8_d6d3a456a5:sns_lion_rat_rets_filets_employes_pour_capturer_des_animaux_2b19842dd7', 'approve', 'Reviewed the sole occurrence: the lion is caught in rets, nets used to capture animals. The noun and net sense are exact.'],
  ['srf_lion_rat_rongee_lem_lion_rat_ronger_verb_2d919a618b_4f4c2727ac:sns_lion_rat_ronger_entamee_et_coupee_peu_a_peu_avec_les_dents_8631960329', 'approve', 'Reviewed the sole occurrence: the mesh was gnawed through by the rat’s teeth. Rongée is the feminine participle of ronger and its sense matches.'],
  ['srf_lion_rat_rugissements_lem_lion_rat_rugissement_noun_bb041cecf8_3382bfeab6:sns_lion_rat_rugissement_action_de_rugir_a800392432', 'approve', 'Reviewed the sole occurrence: the captured lion’s roars could not free him. Rugissements means roars, correctly assigned to the plural noun.'],
  ['srf_lorsque:sns_lorsque_primary', 'hold', 'The seven uses express temporal “when,” but an unresolved same-lemma duplicate candidate remains. Reconcile the exact conjunction identity and reuse before approval.'],
  ['srf_loup_agneau_agneau_lem_loup_agneau_agneau_noun_9615d86047_9f9248b262:sns_loup_agneau_agneau_petit_du_belier_et_de_la_brebis_706f3e0fae', 'approve', 'Reviewed all three occurrences: Agneau names the lamb being addressed and the animal in the fable. The singular masculine noun means lamb.'],
  ['srf_loup_agneau_attirait_lem_parure_attirer_verb_c2f10071ea_431b6cc6d6:sns_parure_attirer_tirer_a_soi_faire_venir_a_soi_4eb1765b85', 'approve', 'Reviewed the sole context: hunger drew/attracted the wolf to the place. Attirait is the imperfect form of attirer, and the meaning fits.'],
  ['srf_loup_agneau_au_dessous_lem_loup_agneau_au_dessous_adverb_a41db17726_df9326aa49:sns_loup_agneau_au_dessous_plus_bas_en_bas_1819175319', 'approve', 'Reviewed the sole phrase vingt pas au-dessous d’Elle: au-dessous means below/lower than her position. The locative adverbial sense is exact.'],
  ['srf_loup_agneau_aucune_lem_zola_aucun_a841b3c202:sns_loup_agneau_aucun_marque_l_absence_complete_dans_une_phrase_negative_e15229fe7f', 'approve', 'Reviewed the sole context en aucune façon: aucune is the feminine form of the negative determiner aucun, meaning no/any in a negative phrase. The grammatical form fits façon.'],
  ['srf_loup_agneau_bergers_lem_loup_agneau_berger_noun_f18f92a4d2_2fb13930fc:sns_loup_agneau_berger_patre_gardien_de_troupeau_465a3aeeb4', 'approve', 'Reviewed the sole occurrence: the lamb lists the shepherds and dogs as persecutors. Bergers is the plural noun for shepherds.'],
  ['srf_loup_agneau_boisson_lem_loup_agneau_boisson_noun_59e8c7c666_f73a1e7665:sns_loup_agneau_boisson_liquide_que_l_on_boit_ici_l_eau_du_loup_60f662c5ae', 'approve', 'Reviewed the sole occurrence: the wolf accuses the lamb of disturbing his drinking water. Boisson means a drink/beverage and is contextualized as water.'],
  ['srf_loup_agneau_breuvage_lem_loup_agneau_breuvage_noun_a47f123a76_2891665619:sns_loup_agneau_breuvage_boisson_liquide_a_boire_396fb1130f', 'approve', 'Reviewed the sole accusation Qui te rend si hardi de troubler mon breuvage ?: breuvage means beverage/drink, here the wolf’s water. The noun sense fits.'],
];

const publication = loadPublication();
const subjectMap = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary').map(subject => [subject.id, subject]));
const alreadyReviewed = new Set(readdirSync(resolve(publicationRoot, batchDirectory))
  .filter(file => file.endsWith('.json'))
  .flatMap(file => JSON.parse(readFileSync(resolve(publicationRoot, batchDirectory, file), 'utf8')).changes.map(change => change.subjectId)));
const blockedIds = auditEditorialQuality(publication)
  .filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary' && !alreadyReviewed.has(issue.id))
  .map(issue => issue.id).sort();
if (decisions.some(([id], index) => id !== blockedIds[index]) || blockedIds.length < decisions.length) throw new Error('French vocabulary queue changed; prepare and review a fresh batch before applying.');

const duplicateGroups = duplicateCandidates(publication);
const sources = publication.sharedSources.fr;
const reviewMap = new Map(sources.reviews.map(review => [review.id, review]));
const changes = decisions.map(([subjectId, outcome, rationale]) => {
  const subject = subjectMap.get(subjectId);
  if (!subject) throw new Error(`Missing current subject ${subjectId}`);
  const value = subject.value;
  const duplicate = duplicateGroups.find(group => group.lemmaIds.includes(value.lemma.id));
  if (outcome === 'approve' && duplicate) throw new Error(`Unexpected unresolved duplicate candidate for ${subjectId}: ${duplicate.id}`);
  const reviewId = `vocabulary:${subjectId}`;
  const before = reviewMap.get(reviewId);
  const after = outcome === 'approve'
    ? approveReview('fr', 'vocabulary', subjectId, value, 'Codex', '2026-09-23T00:00:00.000Z', rationale)
    : pendingReview('fr', 'vocabulary', subjectId, value, rationale);
  reviewMap.set(reviewId, after);
  return { subjectId, reviewId, outcome, rationale, before, after, reviewedOccurrences: value.occurrences.length };
});

const ledger = {
  version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-23', language: 'fr', subjectKind: 'vocabulary',
  sequence: 16, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
  holds: changes.filter(change => change.outcome === 'hold').length, progressTransfers: [],
  reviewMethod: 'individual contextual review of current lemma, part of speech, surface form, every indexed occurrence, sense, and same-lemma reuse candidates; only supported records approved',
  changes,
};

const nextSources = { ...sources, reviews: [...reviewMap.values()] };
const files = new Map(sharedSourceFiles(nextSources));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => {
  const candidate = loadPublication(stage);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
});
console.log(JSON.stringify({ batchId, backup, reviewed: changes.length, approvals: ledger.approvals, holds: ledger.holds, ledger: resolve(publicationRoot, ledgerPath) }, null, 2));
