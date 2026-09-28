import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-23';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_convenable_lem_parure_convenable_adjective_9535f5b36c_525da324d8:sns_parure_convenable_qui_est_approprie_ou_qui_convient_a_quelqu_un_ou_a_quelque_chose_7836971e62', 'approve', 'Reviewed the sole phrase une toilette convenable: the clothes should be appropriate and suitable for reuse on other occasions. The adjective meaning “suitable/appropriate” fits.'],
  ['srf_parure_copie_lem_parure_copie_noun_b71429933f_9f5fb5bd99:sns_parure_copie_action_de_copier_42ec439369', 'approve', 'Reviewed the sole occurrence: the husband earns five sous per page by making copies at night. Copie means copying/transcription as a work activity.'],
  ['srf_parure_coquets_coquet_adjective_6ae9e2fb92:sns_parure_coquet_attractive_dbc75a3407', 'approve', 'Reviewed the sole occurrence: the imagined salons are coquets, charming and tastefully decorated. The adjective meaning “charming/attractive” fits.'],
  ['srf_parure_corde_lem_parure_corde_noun_392b30fa43_569f2d1418:sns_parure_corde_tortis_fait_ordinairement_de_chanvre_et_quelquefois_de_coton_de_laine_de_soie_d_ecorce_d_arbres_de_poil_de_crin_de_jonc_et_d_autres_matieres_pliantes_et_flexibles_c9c90dc3ea', 'approve', 'Reviewed the sole occurrence: the washed clothes are hung to dry on a corde. The noun means rope/cord.'],
  ['srf_parure_cou_lem_parure_cou_noun_7146776b1b_1879767094:sns_parure_cou_partie_du_corps_qui_joint_la_tete_aux_epaules_41f813b733', 'approve', 'Reviewed both occurrences: Mathilde jumps at her friend’s neck and later discovers the necklace missing around her neck. Cou means the body part joining head and shoulders.'],
  ['srf_parure_coucher_lem_parure_coucher_verb_bd3616cb69_5ecedb3bd1:sns_parure_coucher_etendre_de_son_long_sur_la_terre_sur_un_lit_etc_mettre_quelque_chose_en_position_horizontale_4a02e0bbf1', 'hold', 'The sole occurrence is se coucher (“lie down/go to bed”), a reflexive construction, while the record is assigned to non-reflexive coucher (“lay something down”). Clarify reflexive lemma/form treatment before approval.'],
  ['srf_parure_coupes_lem_parure_coupe_noun_faf92e4311_5e0e155f0d:sns_parure_coupe_voiture_hippomobile_fermee_raccourcie_au_nombre_de_places_limite_b052c9dbca', 'hold', 'The occurrence is an old coupé noctambule that the couple hires at night; this is a 19th-century enclosed carriage/cab, not a modern automobile. Replace the potentially anachronistic “coupé (car)” gloss with the historical vehicle sense.'],
  ['srf_parure_courte_court_adjective_bab46620d5:sns_parure_court_short_944a8d1ad8', 'approve', 'Reviewed the sole phrase culotte courte: courte describes the valets’ short breeches. The feminine adjective form and sense “short” agree with culotte.'],
  ['srf_parure_couterait_lem_parure_couter_verb_aa798284b2_924d716ede:sns_parure_couter_valoir_tel_ou_tel_prix_d_achat_a134ea3afd', 'approve', 'Reviewed the sole question: the husband asks how much a suitable outfit would cost. Coûterait is the conditional form of coûter, “would cost.”'],
  ['srf_parure_couvent_couvent_noun_a1caf58f1e:sns_parure_couvent_convent_84a7656f5c', 'approve', 'Reviewed the sole occurrence: Mathilde’s friend was her companion at the convent/school. Couvent means convent, matching the institution.'],
  ['srf_parure_couverte_couvrir_verb_739cacb308:sns_parure_couvrir_cover_42fc6b6b2a', 'approve', 'Reviewed the sole occurrence: the table was covered with a three-day-old tablecloth. Couverte is the feminine past participle of couvrir, “covered.”'],
  ['srf_parure_creusee_lem_parure_creuse_adjective_2610e3a81f_2c60199b31:sns_parure_creuse_en_parlant_du_visage_ou_de_parties_du_visage_empreint_de_creux_emacie_b45f32a206', 'hold', 'The context says Loisel returned with a hollow/gaunt, pale face after failing to find the necklace. The gloss “concave” is too literal and misleading for the facial adjective; revise it to “sunken/hollow/gaunt.”'],
  ['srf_parure_culotte_culotte_noun_71ceeccc41:sns_parure_culotte_breeches_752935d106', 'approve', 'Reviewed the sole occurrence: the valets wear short breeches. Culotte means breeches/trousers in this historical clothing context.'],
  ['srf_parure_dames_dame_noun_892d2bd304:sns_zola_dame_woman', 'approve', 'Reviewed the sole phrase les plus grandes dames: it refers to high-ranking ladies compared with working-class girls. Dame means lady/woman in this social context.'],
  ['srf_parure_dansait_lem_parure_danser_verb_3256054ca3_b60c465b2b:sns_parure_danser_executer_une_danse_22af2015ff', 'approve', 'Reviewed the sole occurrence: Mathilde danced with delight and abandon at the ball. Dansait is the imperfect form of danser, “danced.”'],
  ['srf_parure_dechira_dechirer_verb_8eff0cfea9:sns_parure_dechirer_tear_13c7513d2f', 'approve', 'Reviewed the sole occurrence: Mathilde quickly tore open the paper to take out the invitation. Déchira is the past historic of déchirer, “tore open.”'],
  ['srf_parure_declara_lem_zola_declarer_8b1e42748d:sns_parure_declarer_faire_connaitre_d_une_facon_manifeste_bef4e159ff', 'approve', 'Reviewed both occurrences: the characters state their response or decision aloud. Déclara is the past historic of déclarer, “declared/said.”'],
  ['srf_parure_declassee_declasse_adjective_a8de8dd42e:sns_parure_declasse_lowered_status_782496bd8d', 'approve', 'Reviewed the sole comparison: Mathilde is unhappy like someone fallen out of her social class. Déclassée is the feminine adjective for a woman whose social status has declined.'],
  ['srf_parure_decouvrait_decouvrir_verb_61f6d785fa:sns_parure_decouvrir_uncover_d6b4bab416', 'approve', 'Reviewed the sole occurrence: her husband lifted the lid of the soup tureen as he served dinner. Découvrait is the imperfect of découvrir in the sense “uncover.”'],
  ['srf_parure_dedans_lem_parure_dedans_adverb_dfc9a07f4d_57ae72dfc8:sns_parure_dedans_a_l_interieur_dans_la_place_dont_on_vient_de_parler_90e3057408', 'hold', 'The sole occurrence says the jeweler’s name was found inside the box. The current gloss “towards the inside; inwardly; internally” does not match this static location; use “inside/in it.”'],
  ['srf_parure_delasser_lem_parure_delasser_verb_8ee8d06a3e_b8527f8057:sns_parure_delasser_delivrer_de_la_lassitude_reposer_b6b54448a4', 'hold', 'The sole occurrence is se délasser (“relax/rest oneself”), a reflexive construction, while the record is assigned to the non-reflexive verb délasser. Clarify reflexive lemma/form treatment before approval.'],
  ['srf_parure_delicatesses_delicatesse_noun_7df36c5428:sns_parure_delicatesse_refinement_6175b0fc61', 'approve', 'Reviewed the sole occurrence: Mathilde longs for délicatesses and luxuries she feels she was born to enjoy. Délicatesses means refinements/sensibilities or refined pleasures in this context.'],
  ['srf_parure_demanda_lem_zola_demander_70a61764b9:sns_parure_demander_indiquer_a_quelqu_un_par_des_paroles_par_un_ecrit_ou_tout_autre_moyen_ce_qu_on_desire_obtenir_de_lui_ae7f189661', 'approve', 'Reviewed all six occurrences: demander introduces questions about the ball, asks for the name of the princess, asks guards about a princess, and asks the sisters about their evening. The general verb “ask” covers both information and requests.'],
  ['srf_parure_demandaient_lem_zola_demander_57e26cd349:sns_parure_demander_indiquer_a_quelqu_un_par_des_paroles_par_un_ecrit_ou_tout_autre_moyen_ce_qu_on_desire_obtenir_de_lui_ae7f189661', 'approve', 'Reviewed the sole occurrence: the men asked Mathilde’s name at the ball. Demandaient is the imperfect form of demander, “asked.”'],
  ['srf_parure_demandait_lem_zola_demander_d30b6c11ec:sns_parure_demander_indiquer_a_quelqu_un_par_des_paroles_par_un_ecrit_ou_tout_autre_moyen_ce_qu_on_desire_obtenir_de_lui_ae7f189661', 'approve', 'Reviewed both occurrences: Mme Forestier repeatedly asks Mathilde which jewelry she wants, and a speaker asks a question before an answer. Demandait is the imperfect of demander, “asked.”'],
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
  sequence: 23, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
