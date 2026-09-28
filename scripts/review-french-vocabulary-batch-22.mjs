import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-22';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_chaleur_chaleur_noun_838be309fc:sns_parure_chaleur_heat_dfc7513000', 'approve', 'Reviewed the sole occurrence: the valets fall asleep in the heavy heat from the calorifère. Chaleur means heat/warmth, matching the cause.'],
  ['srf_parure_charmantes_charmant_adjective_1e0134ec46:sns_parure_charmant_delightful_437583226d', 'approve', 'Reviewed the sole use: the young woman is described as one of the charming girls. Charmantes is the feminine plural form of charmant, “charming/delightful.”'],
  ['srf_parure_charme_charme_noun_d901157982:sns_parure_charme_appeal_fe24061d21', 'approve', 'Reviewed the sole occurrence: charm, beauty, and grace are described as qualities that confer social standing. Charme means charm/appeal.'],
  ['srf_parure_chemises_lem_parure_chemise_noun_2b8c543650_aaef640765:sns_parure_chemise_vetement_en_linge_ou_en_laine_qu_on_porte_sur_la_chair_couvrant_le_buste_et_les_bras_7bb27ab89f', 'approve', 'Reviewed the sole occurrence: chemises are laundry Mathilde washes with the shirts and towels. Chemises is the plural of chemise, shirt.'],
  ['srf_parure_cherchant_lem_zola_chercher_881920142b:sns_parure_chercher_se_donner_du_mouvement_du_soin_ou_de_la_peine_pour_trouver_quelqu_un_ou_quelque_chose_2c389ae825', 'approve', 'Reviewed the sole occurrence: the couple searched from jeweler to jeweler for a matching necklace. Cherchant is the present participle of chercher, “looking for/seeking.”'],
  ['srf_parure_chercher_lem_zola_chercher_85eaf43111:sns_parure_chercher_se_donner_du_mouvement_du_soin_ou_de_la_peine_pour_trouver_quelqu_un_ou_quelque_chose_2c389ae825', 'approve', 'Reviewed both occurrences: the couple looks for a carriage and the husband goes to look for a replacement necklace. Chercher means to look for/seek in both.'],
  ['srf_parure_chercherent_lem_zola_chercher_e8289aac13:sns_parure_chercher_se_donner_du_mouvement_du_soin_ou_de_la_peine_pour_trouver_quelqu_un_ou_quelque_chose_2c389ae825', 'approve', 'Reviewed the sole occurrence: they searched every fold and pocket for the necklace. Cherchèrent is the past historic of chercher and the sense fits.'],
  ['srf_parure_chere_lem_parure_chere_noun_8f05788f9a_e1fe986f64:sns_parure_chere_personne_consideree_comme_chere_qui_est_tenu_avec_une_affectueuse_haute_estime_ou_par_ironie_a_qui_est_adressee_une_forme_de_dedain_58e0779114', 'hold', 'The sole address ma chère means “my dear,” an affectionate form of address, while the stored gloss “face” is incorrect for this token. Correct the sense/gloss before approval.'],
  ['srf_parure_cherie_lem_parure_cherie_noun_c0381d6fa7_0e0e93bfcd:sns_parure_cherie_terme_affectueux_par_lequel_on_s_adresse_a_la_femme_qu_on_aime_1d5a069210', 'hold', 'The sole address ma chérie is an affectionate “my darling/dear,” but the gloss says only “historical or contextual form of chérie.” Rewrite the learner-facing meaning before approval.'],
  ['srf_parure_chic_lem_parure_chic_adjective_c55065291b_e0556769d2:sns_parure_chic_elegant_31549ec8b2', 'approve', 'Reviewed the sole statement: natural flowers are very chic this season. Chic means stylish/elegant, fitting the fashion advice.'],
  ['srf_parure_chuchotees_chuchoter_verb_636090e5fd:sns_zola_chuchoter_whisper', 'approve', 'Reviewed the sole occurrence: the imagined flirtations are whispered and listened to. Chuchotées is the feminine plural past participle of chuchoter, “whispered.”'],
  ['srf_parure_cinq_cinq_numeral_48c2ac6ff3:sns_parure_cinq_five_850cc1a8aa', 'approve', 'Reviewed all six occurrences: cinq marks quantities including years, hundreds of francs, coins, and the price per page. The numeral five is consistent.'],
  ['srf_parure_coffret_lem_parure_coffret_noun_b3e333d599_e0e6cf1aa2:sns_parure_coffret_petit_coffre_52e96cea77', 'approve', 'Reviewed the sole occurrence: Mme Forestier takes and opens a large jewelry casket/box. Coffret means a small box or case, matching the container.'],
  ['srf_parure_collegue_lem_parure_collegue_noun_3386aa4edf_d6649683d3:sns_parure_collegue_personne_qui_exerce_la_meme_profession_ou_qui_travaille_dans_la_meme_organisation_qu_une_autre_02e8df89ca', 'approve', 'Reviewed the sole occurrence: Mathilde suggests giving her invitation to a colleague whose wife is better dressed. Collègue means colleague/coworker.'],
  ['srf_parure_collier_lem_parure_collier_noun_112933b9f6_e6faa6a776:sns_parure_collier_ornement_bijou_qui_fait_le_tour_du_cou_2ad7905476', 'approve', 'Reviewed the sole occurrence: a pearl necklace is one of the pieces of jewelry Mathilde tries on. Collier means necklace, worn around the neck.'],
  ['srf_parure_commis_commis_noun_bb51127133:sns_parure_commis_clerk_f8adb8c8e6', 'approve', 'Reviewed the sole occurrence: Mathilde marries a junior clerk in the Ministry of Public Instruction. Commis means clerk/employee in this administrative context.'],
  ['srf_parure_comprise_comprendre_verb_703888d67e:sns_zola_comprendre_understand', 'approve', 'Reviewed the sole occurrence: Mathilde had no means of being understood by a wealthy, distinguished man. Comprise is the feminine past participle of comprendre, “understood.”'],
  ['srf_parure_comptes_lem_zola_compte_d077781be0:sns_parure_compte_action_de_compter_denombrement_calcul_opere_sur_tel_ou_tel_ensemble_de_choses_resultat_de_cette_action_1acd6f6623', 'hold', 'Both occurrences refer to bookkeeping/financial accounts (Mathilde calculates what to request; her husband prepares a merchant’s accounts), not a bank/user account. Correct the sense and learner gloss before approval.'],
  ['srf_parure_comptoir_lem_parure_comptoir_noun_35d353c7ca_9e92e5f92f:sns_parure_comptoir_sorte_de_bureau_ou_de_table_longue_et_etroite_sur_laquelle_le_marchand_comptait_autrefois_l_argent_et_ou_maintenant_le_vendeur_etale_la_marchandise_da755de6c6', 'approve', 'Reviewed the sole occurrence: the husband deposits the money on the jeweler’s counter. Comptoir means shop counter, matching the transaction.'],
  ['srf_parure_connus_connu_adjective_5026bfd28d:sns_parure_connu_well_known_55fc3b6c0c', 'approve', 'Reviewed the sole occurrence: women envy the attention of men who are known and sought after. Connus means well-known/familiar, agreeing with hommes.'],
  ['srf_parure_connut_lem_parure_connaitre_verb_e00eb870fc_4b0327fcd5:sns_parure_connaitre_faire_ou_avoir_fait_l_experience_permettant_une_representation_mentale_de_quelque_chose_ou_quelqu_un_avoir_l_idee_la_notion_d_une_personne_ou_d_une_chose_a28b24d22d', 'hold', 'The two occurrences mean that Mathilde experienced the life and chores of the poor, but the gloss only says “historical or contextual form of connaître.” Rewrite the direct sense “experienced/lived through” and clarify the grammatical note.'],
  ['srf_parure_conta_lem_parure_conter_verb_cd5fda14dc_db3cb73a96:sns_parure_conter_exposer_par_un_recit_il_se_dit_principalement_de_recits_que_l_on_fait_dans_la_conversation_661a92ba68', 'approve', 'Reviewed the sole occurrence: Mathilde told her friend about her distress. Conta is the past historic of conter, “recount/tell,” and the sense matches.'],
  ['srf_parure_contemplaient_lem_parure_contempler_verb_5796339ee0_83fdf52dea:sns_parure_contempler_considerer_avec_toute_la_force_de_son_attention_soit_avec_les_yeux_soit_par_la_pensee_74f759fac8', 'approve', 'Reviewed the sole occurrence: the couple looked at each other in dismay. Contemplaient means gazed/looked at, a fitting visual sense of contempler.'],
  ['srf_parure_contente_lem_parure_content_adjective_c87065705a_fe586d5fd7:sns_parure_content_satisfait_heureux_03d8f33716', 'approve', 'Reviewed both occurrences: contente describes Mathilde’s hoped-for reaction to the invitation and her later satisfaction at finishing the debt. The feminine adjective means pleased/satisfied in both.'],
  ['srf_parure_convaincue_lem_parure_convaincu_adjective_f133631f6c_1ec3e36bd1:sns_parure_convaincu_intimement_persuade_94caf91479', 'approve', 'Reviewed the sole occurrence Elle n’était point convaincue: Mathilde was not persuaded by her husband’s explanation. Convaincue is the feminine adjective meaning convinced.'],
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
  sequence: 22, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
