import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-24';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_demande_lui_lem_zola_demander_d3edee95dd:sns_parure_demander_ordre_de_demander_quelque_chose_a_la_personne_designee_par_lui_d3370d7ae8', 'approve', 'Reviewed the sole imperative: Mme Forestier tells Mathilde to ask her friend to lend jewelry. Demande-lui means “ask him/her,” and the pronoun refers to a woman, so the feminine reading is correct.'],
  ['srf_parure_demander_lem_zola_demander_35674d0bb0:sns_parure_demander_indiquer_a_quelqu_un_par_des_paroles_par_un_ecrit_ou_tout_autre_moyen_ce_qu_on_desire_obtenir_de_lui_ae7f189661', 'approve', 'Reviewed all three occurrences: demander refers to requesting a sum, asking for a hairstyle, and asking for clothing/jewelry. “Ask/request” covers the uses.'],
  ['srf_parure_depit_lem_parure_depit_noun_b504bdc5b1_3aab66a7a5:sns_parure_depit_irritation_causee_par_un_froissement_d_amour_propre_aigreur_suite_a_la_deception_a_l_amertume_au_sentiment_de_ranc_ur_plus_ou_moins_tenace_difficile_a_avouer_56ea48a884', 'hold', 'The sole phrase avec dépit means Mathilde throws the invitation down in frustration/annoyance at the disappointment, not with “scorn.” Replace the gloss with the contextual emotional sense before approval.'],
  ['srf_parure_descendaient_lem_parure_descendre_verb_70a291f929_dc9a4e8e78:sns_parure_descendre_aller_de_haut_en_bas_b2e5c69940', 'approve', 'Reviewed both occurrences: tears ran down the face, and the couple walked down toward the Seine. Descendaient means moved/went downward in both contexts.'],
  ['srf_parure_descendait_lem_parure_descendre_verb_70a291f929_d3f1269fe0:sns_parure_descendre_aller_de_haut_en_bas_b2e5c69940', 'approve', 'Reviewed the sole occurrence: Mathilde hurried down the staircase. Descendait is the imperfect of descendre, “was going down.”'],
  ['srf_parure_desert_lem_zola_desert_3792408523:sns_parure_desert_qui_est_inhabite_ou_qui_n_est_guere_frequente_c5b89792c4', 'approve', 'Reviewed the sole occurrence: the salon is empty of people while the women are at the ball. Désert means deserted/unoccupied, matching the scene.'],
  ['srf_parure_desesperes_lem_zola_desespere_f97f44ffd4:sns_parure_desespere_qui_est_dans_le_desespoir_qui_agit_par_desespoir_2be616aaf1', 'approve', 'Reviewed the sole occurrence: the couple is desperate and shivering as they search the streets for the lost necklace. Désespérés means desperate, and the masculine plural form agrees with ils.'],
  ['srf_parure_desespoir_desespoir_noun_3eb40516f0:sns_parure_desespoir_despair_47361a88ac', 'approve', 'Reviewed the sole occurrence: Mathilde cries from grief, regret, despair, and distress. Désespoir means despair, matching the emotional list.'],
  ['srf_parure_desir_lem_parure_desir_noun_7ada568efb_e8b942badb:sns_parure_desir_action_de_desirer_resultat_de_cette_action_40582cb34c', 'approve', 'Reviewed the sole occurrence: Mathilde feels an intense desire for the diamond necklace. Désir means desire, matching the scene.'],
  ['srf_parure_desirent_desirer_verb_81a366fc01:sns_zola_desirer_want', 'approve', 'Reviewed the sole occurrence: women want/desire the attention of well-known men. Désirent is the present plural form of désirer, “want.”'],
  ['srf_parure_desirs_lem_parure_desir_noun_7ada568efb_6e3bd6c2cf:sns_parure_desir_action_de_desirer_resultat_de_cette_action_40582cb34c', 'approve', 'Reviewed the sole occurrence: Mathilde’s success at the ball awakens desires among the men who admire her. Désirs means desires/wants.'],
  ['srf_parure_desoles_desole_adjective_681daa3ca4:sns_parure_desole_desolate_d1f77506ab', 'approve', 'Reviewed the sole phrase regrets désolés: the Breton maid’s sight awakens painful, desolate regrets in Mathilde. Désolés means sorrowful/desolate and agrees with the masculine plural noun.'],
  ['srf_parure_destin_destin_noun_566c080bed:sns_parure_destin_fate_049ecf3c55', 'approve', 'Reviewed the sole phrase erreur du destin: the narrator describes Mathilde’s birth into a clerk’s family as if fate had erred. Destin means fate/destiny.'],
  ['srf_parure_dette_lem_zola_dette_9260d738be:sns_parure_dette_somme_due_a_un_creancier_313b17b78b', 'approve', 'Reviewed the sole occurrence: the couple must repay the debt incurred to replace the necklace. Dette means money owed to a creditor, matching the financial plot.'],
  ['srf_parure_devetu_lem_parure_devetir_verb_eabd22dc8e_a2c1701f39:sns_parure_devetir_oter_les_vetements_1af8a94978', 'approve', 'Reviewed the sole occurrence: the husband is already half undressed when Mathilde speaks. Dévêtu is the past participle of dévêtir, “undressed,” and is correct.'],
  ['srf_parure_diamants_lem_parure_diamant_noun_b2d8e3f2dd_40c21e98c4:sns_parure_diamant_corps_simple_le_plus_dur_du_regne_mineral_constitue_de_carbone_cristallise_dans_le_systeme_cubique_utilise_en_joaillerie_et_dans_l_industrie_sa_formule_chimique_est_c_ef5b5afbea', 'approve', 'Reviewed all five occurrences: diamants are gemstones in necklaces and other jewelry, including the replacement river necklace. The plural noun meaning “diamonds” is accurate.'],
  ['srf_parure_dictee_lem_parure_dictee_noun_98a1ad545a_25a343a620:sns_parure_dictee_action_de_dicter_6c6d11936f', 'approve', 'Reviewed the sole occurrence: Mathilde wrote down the story under her husband’s dictation. Dictée means dictation, the act of speaking words for someone else to write.'],
  ['srf_parure_dimanche_lem_parure_dimanche_noun_7a445b009b_777508d18d:sns_parure_dimanche_septieme_1_jour_de_la_semaine_suit_le_samedi_et_precede_le_lundi_65c06bd8de', 'approve', 'Reviewed both occurrences: dimanche refers to the day of the week when the husband hunts and Mathilde visits the Champs-Élysées. The noun means Sunday.'],
  ['srf_parure_diner_diner_verb_b0a3c2e077:sns_parure_diner_eat_956b0f9d6c', 'approve', 'Reviewed the sole infinitive: Mathilde sits down pour dîner, to have dinner. Dîner is the verb “to dine/have dinner.”'],
  ['srf_parure_diners_diner_noun_75c7a94f79:sns_parure_diner_meal_72db769863', 'approve', 'Reviewed the sole occurrence: Mathilde dreams of fine evening meals. Dîners is the plural noun “dinners.”'],
  ['srf_parure_dirait_lem_dire_91e73bb020:sns_parure_dire_exprimer_par_la_parole_960c81d4dd', 'approve', 'Reviewed the sole conditional: Mathilde would tell her friend everything now that she had paid. Dirait is the conditional of dire, “would tell.”'],
  ['srf_parure_distingue_distingue_adjective_439632789b:sns_parure_distingue_refined_8341da98ce', 'approve', 'Reviewed the sole occurrence: Mathilde imagines marrying a wealthy, distinguished man. Distingué means distinguished/refined in this social description.'],
  ['srf_parure_dormait_lem_dormir_2569108f6a:sns_parure_dormir_se_reposer_dans_un_etat_inconscient_de_sommeil_c9bdd6abba', 'hold', 'The context clearly means that Loisel was sleeping, but an unresolved same-lemma duplicate candidate exists for dormir. Reconcile exact lemma/sense reuse before approval.'],
  ['srf_parure_dos_lem_parure_dos_noun_8c509116b8_41dab69dd2:sns_parure_dos_partie_du_corps_humain_situee_au_dessus_du_posterieur_depuis_le_cou_jusqu_aux_reins_133ce2854f', 'hold', 'The sole idiomatic phrase sur le dos means what to wear/on oneself to attend the ball, not specifically the anatomical back. Review the phrase-level sense and provide a contextual gloss before approval.'],
  ['srf_parure_dot_dot_noun_4f642c6692:sns_parure_dot_dowry_a05fda4b15', 'approve', 'Reviewed the sole occurrence: Mathilde had no dowry when she married. Dot means a dowry/property brought to a marriage, matching the context.'],
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
  sequence: 24, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
