import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-25';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_dressa_lem_parure_dresser_verb_fca7f6c702_31a891d8fd:sns_parure_dresser_faire_tenir_droit_verticalement_6d37f7f7ff', 'hold', 'The occurrence is se dresser (“rise/stand up”), a reflexive construction; the current sense is the transitive “raise/set upright.” Clarify reflexive lemma and sense treatment before approval.'],
  ['srf_parure_eau_lem_parure_eau_noun_635a1a6c8f_c75c989330:sns_parure_eau_liquide_transparent_incolore_inodore_et_insipide_a_l_etat_pur_qui_est_le_principal_constituant_des_lacs_rivieres_mers_et_oceans_6b0ca065fc', 'approve', 'Reviewed both contexts: laver à grande eau means washing with plenty of water, and monter l’eau means carrying water upstairs. The noun “water” fits both.'],
  ['srf_parure_eclairees_eclairer_verb_a7490d04c2:sns_parure_eclairer_light_74abf57274', 'approve', 'Reviewed the phrase éclairées par de hautes torchères: the torches illuminate the rooms. The past participle sense “lit/illuminated” is accurate.'],
  ['srf_parure_econome_lem_parure_econome_adjective_c6b76e2c17_060c2e27c5:sns_parure_econome_qualifie_une_personne_qui_evite_de_depenser_de_l_argent_inutilement_9bfe66c428', 'approve', 'Reviewed the phrase le commis économe: the clerk is careful or sparing with money. “Thrifty/economical” fits the adjective in context.'],
  ['srf_parure_ecoutait_lem_ecouter_8d57561295:sns_parure_ecouter_faire_attention_preter_l_oreille_pour_entendre_127d74adc4', 'approve', 'Reviewed the sole occurrence: Mathilde does not listen to her husband and hurries down the stairs. Écouter means “listen to.”'],
  ['srf_parure_ecrin_lem_parure_ecrin_noun_51fefdf05b_613450d000:sns_parure_ecrin_petit_coffret_ou_etui_ou_l_on_met_des_bagues_des_pierreries_et_des_objets_precieux_9894f27130', 'approve', 'Reviewed both occurrences: écrin refers to the case for the borrowed necklace and the case supplied with the replacement necklace. “Jewel case” is accurate.'],
  ['srf_parure_ecrire_lem_zola_ecrire_2ea5f6a88b:sns_parure_ecrire_creer_une_representation_de_mots_a_l_aide_de_lettres_et_de_symboles_par_le_biais_d_un_media_32d2ad523f', 'approve', 'Reviewed the infinitive in écrire à ton amie: the husband tells Mathilde to write to her friend. The sense “to write” is accurate.'],
  ['srf_parure_ecrivit_lem_zola_ecrire_e5f400bc55:sns_parure_ecrire_creer_une_representation_de_mots_a_l_aide_de_lettres_et_de_symboles_par_le_biais_d_un_media_32d2ad523f', 'approve', 'Reviewed the sole occurrence: Mathilde wrote the account under her husband’s dictation. Écrivit is the past historic of écrire, “wrote.”'],
  ['srf_parure_effaree_lem_parure_effare_adjective_f403a173a3_d71e3578a0:sns_parure_effare_hagard_stupefait_3c86568db9', 'approve', 'Reviewed the phrase une exclamation effarée: the clerk reacts with alarmed astonishment at the request. “Aghast/alarmed” is accurate.'],
  ['srf_parure_effarement_lem_parure_effarement_noun_de358a1e74_8b35736c59:sns_parure_effarement_etat_d_une_personne_effaree_c80e72a91f', 'approve', 'Reviewed the phrase état d’effarement devant cet affreux désastre: it describes a state of stunned alarm/shock. “Alarm” is supported by the context and definition.'],
  ['srf_parure_effort_lem_parure_effort_noun_a2ec118533_fd8c93d494:sns_parure_effort_action_de_s_efforcer_22f4332aa5', 'approve', 'Reviewed the phrase par un effort violent: Mathilde makes a forceful effort to master her grief. The noun “effort” is accurate.'],
  ['srf_parure_elegance_elegance_noun_2e7448d5f7:sns_parure_elegance_refinement_cd2767b11f', 'approve', 'Reviewed both contexts: élégance describes the refinement of Mathilde’s ball attire and the innate sense of refinement attributed to women. The gloss is accurate.'],
  ['srf_parure_elles_lem_parure_elles_pronoun_bb47288152_2bdbaa9831:sns_parure_elles_pronom_clitique_de_la_troisieme_personne_du_pluriel_feminin_sujet_pour_parler_d_un_groupe_de_femmes_d_animaux_ou_de_choses_grammaticalement_feminines_2626f57105', 'approve', 'Reviewed all indexed occurrences across Cendrillon and La Parure: elles refers to feminine plural groups, principally the sisters and women. “They (female)” correctly captures the pronoun’s reference.'],
  ['srf_parure_employes_employe_noun_010f52bd2e:sns_parure_employe_worker_57eeeca27b', 'approve', 'Reviewed both occurrences: employés describes salaried clerks and office workers, including Mathilde’s family and the people at the official reception. “Employees; clerks” fits.'],
  ['srf_parure_emprunta_lem_parure_emprunter_verb_eeb40b61d4_233aeede83:sns_parure_emprunter_demander_et_recevoir_en_pret_obtenir_a_titre_de_pret_82ba773cbc', 'approve', 'Reviewed the sole occurrence: Loisel borrowed money from several lenders to replace the necklace. Emprunter means “borrow,” and the gloss’s source construction is compatible with emprunter à.'],
  ['srf_parure_emprunterait_lem_parure_emprunter_verb_eeb40b61d4_fcd06118fc:sns_parure_emprunter_demander_et_recevoir_en_pret_obtenir_a_titre_de_pret_82ba773cbc', 'approve', 'Reviewed the conditional: Loisel would borrow the remaining amount after using his inheritance. Emprunterait is the conditional of emprunter, “would borrow.”'],
  ['srf_parure_emue_lem_parure_emu_adjective_6c5a5af827_c4af90c9b5:sns_parure_emu_en_proie_a_une_emotion_plus_ou_moins_vive_f4e2f143ac', 'approve', 'Reviewed both occurrences: Mme Forestier is deeply moved on hearing the story, and Mme Loisel feels moved before speaking to her. “Touched/moved” is accurate.'],
  ['srf_parure_enchante_enchante_adjective_2f3a1d2d30:sns_parure_enchante_delighted_1a8e0c2b27', 'approve', 'Reviewed the phrase un air enchanté as Loisel admires the pot-au-feu. Here enchanté means delighted, matching the approving expression.'],
  ['srf_parure_enfant_lem_zola_enfant_05264b5851:sns_parure_enfant_personne_qui_n_a_pas_encore_atteint_l_adolescence_e908581be1', 'approve', 'Reviewed both occurrences: enfant refers to the young Cinderella and a child being walked by her mother. The sense “child” is accurate.'],
  ['srf_parure_entiers_entier_adjective_f29dbbf0a5:sns_zola_entier_whole', 'approve', 'Reviewed the phrase des jours entiers: the grief lasts for whole days. The adjective “whole/entire” is accurate.'],
  ['srf_parure_enveloppaient_lem_parure_envelopper_verb_084aacf03c_aeb14fbdfb:sns_parure_envelopper_entourer_de_tous_cotes_quelque_chose_avec_du_papier_une_etoffe_un_linge_etc_qui_couvre_qui_environne_de_tous_cotes_a2124fbef2', 'hold', 'The occurrence is s’envelopper de fourrures (“wrap oneself in furs”), a reflexive construction, while the reviewed sense is the transitive envelopper. Clarify reflexive lemma and sense treatment before approval.'],
  ['srf_parure_enveloppe_enveloppe_noun_fcb280a9f0:sns_parure_enveloppe_letter_4bb52f77e1', 'approve', 'Reviewed the sole occurrence: the husband comes home holding the large envelope containing the invitation. The noun “envelope” is accurate.'],
  ['srf_parure_enviee_envier_verb_7dad57d9a6:sns_parure_envier_be_envied_815651a777', 'hold', 'The surface form is the past participle in the passive phrase être enviée (“to be envied”), but the current gloss/definition describes being the object of others’ envy without documenting the passive construction. Align the form, voice, and sense before approval.'],
  ['srf_parure_envient_envier_verb_fa0cdb1110:sns_parure_envier_envy_d6d84d35af', 'approve', 'Reviewed the phrase toutes les femmes envient et désirent l’attention: the women envy and desire the attention sought by Mathilde. Envient is the present plural form of envier and the sense is accurate.'],
  ['srf_parure_epaules_lem_parure_epaule_noun_592ab24fe8_3e69c72ad5:sns_parure_epaule_partie_du_corps_qui_attache_au_cou_l_articulation_du_bras_chez_l_etre_humain_et_du_membre_anterieur_chez_les_quadrupedes_articulation_qui_relie_l_arriere_bras_au_tronc_0b09ab8d0b', 'approve', 'Reviewed both occurrences: Mathilde removes clothing from her shoulders and Loisel throws clothing over them. The anatomical noun “shoulder” is accurate.'],
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
  sequence: 25, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
