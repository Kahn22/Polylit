import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-28';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);
const decisions = [
  ['srf_parure_humiliant_lem_parure_humiliant_adjective_e345fb4b06_002738b620:sns_parure_humiliant_qui_humilie_a76ab4fe5f', 'The phrase avoir l’air pauvre au milieu de femmes riches is described as humiliating. The adjective “humiliating” is exact.'],
  ['srf_parure_il_lem_parure_il_noun_0162c75df9_7493f3922c:sns_parure_il_organe_de_la_vue_eb6549bfda', 'In the phrase d’un œil irrité, œil means eye. The noun and anatomical sense match.'],
  ['srf_parure_immodere_lem_parure_immodere_adjective_946b9241aa_698cdb6c6f:sns_parure_immodere_qui_manque_de_moderation_9ea31c00a8', 'The desire for the necklace is described as immoderate/excessive, matching the gloss and definition.'],
  ['srf_parure_impatience_lem_parure_impatience_noun_a21ecf9d49_4b32ed46b3:sns_parure_impatience_manque_de_patience_sentiment_d_inquietude_ou_d_irritation_que_l_on_eprouve_soit_dans_la_souffrance_d_un_mal_soit_dans_l_attente_de_quelque_bien_d9b8a740a8', 'The noun describes Mathilde’s irritation and impatience as she looks at her husband. The definition includes this emotional state.'],
  ['srf_parure_indignaient_indigner_verb_487fe0ecc7:sns_zola_indigner_outrage', 'The sight of the maid’s humble work outrages Mathilde, provoking strong anger. “Outrage/provoke indignation” fits.'],
  ['srf_parure_inestimables_inestimable_adjective_49106b7004:sns_parure_inestimable_priceless_947918dd23', 'The furniture bears bibelots described as beyond price. Inestimables means priceless.'],
  ['srf_parure_infinie_lem_parure_infini_adjective_db436f1445_f96d2ac3ce:sns_parure_infini_qui_n_a_ni_commencement_ni_fin_qui_est_sans_bornes_et_sans_limites_47883a3c93', 'The phrase une peine infinie means she had enormous trouble obtaining the necklace. “Endless/ceaseless” expresses the intensity and duration.'],
  ['srf_parure_instinct_instinct_noun_363061ef74:sns_parure_instinct_intuition_0f3a9fbc09', 'The phrase instinct d’élégance describes an innate natural tendency. The noun “instinct” is accurate.'],
  ['srf_parure_intimes_intime_adjective_38249b202d:sns_parure_intime_close_d4f7e8c1a3', 'The phrase amis les plus intimes refers to close, familiar friends. The adjective sense is accurate.'],
  ['srf_parure_irrite_lem_parure_irrite_adjective_a75f296437_704ef518d4:sns_parure_irrite_de_mauvaise_humeur_a_cause_de_quelque_chose_91d91c3eb1', 'Mathilde looks at her husband with an irritated eye and speaks impatiently. The adjective means irritated/annoyed.'],
  ['srf_parure_janvier_lem_parure_janvier_noun_296301f8e3_426c024446:sns_parure_janvier_premier_mois_de_l_annee_du_calendrier_gregorien_qui_compte_31_jours_6a0178329a', 'The invitation specifies Monday, January 18. Janvier means January.'],
  ['srf_parure_jeta_lem_zola_jeter_47b03b9787:sns_parure_jeter_lancer_avec_la_main_ou_de_quelque_autre_maniere_b57344c617', 'Reviewed both contexts: Loisel throws clothes over Mathilde’s shoulders, and she throws the invitation onto the table. “Throw” covers both uses.'],
  ['srf_parure_jeune_lem_parure_jeune_adjective_277511adb4_0222ccf24b:sns_parure_jeune_qui_est_dans_une_phase_au_commencement_de_sa_vie_ou_de_son_developpement_qui_n_est_guere_avance_en_age_en_parlant_des_humains_des_animaux_ou_des_vegetaux_f603055cea', 'Reviewed all occurrences across both works: jeune describes young women, a young prince, and a child. The sense “young” fits.'],
  ['srf_parure_joaillier_lem_parure_joaillier_noun_f68edbf1d7_30e1f96da6:sns_parure_joaillier_fabricant_ou_vendeur_de_joyaux_3b7faec43d', 'Reviewed both occurrences: the couple visits the jeweler who sold the necklace and supplied the replacement case. The noun is accurate.'],
  ['srf_parure_jolie_lem_joli_efaa15ed3f:sns_parure_joli_qui_a_de_la_grace_de_l_agrement_c9d52e1cf5', 'Reviewed both occurrences: Cinderella and Mathilde are described as very pretty. The feminine form agrees with the noun and means pretty.'],
  ['srf_parure_jolies_joli_adjective_3148819c3c:sns_parure_joli_pretty_a9fdf55348', 'Both occurrences describe beautiful glass slippers or attractive young women. The adjective sense “pretty” fits.'],
  ['srf_parure_joues_lem_zola_joue_f6e6924a29:sns_parure_joue_partie_du_visage_de_l_humain_qui_est_au_dessous_des_tempes_et_des_yeux_et_qui_s_etend_de_chaque_cote_du_nez_jusqu_au_menton_dont_la_peau_ferme_lateralement_la_bouche_536fd2b53e', 'Mathilde wipes her wet cheeks. The anatomical noun joues means cheeks.'],
  ['srf_parure_jours_jour_noun_5c456df97c:sns_parure_jour_day_e9df7ed025', 'Reviewed all indexed occurrences: jour refers to calendar days and periods of time across both works. The plural “days” is supported.'],
  ['srf_parure_jupes_lem_parure_jupe_noun_5c3481dfa4_c761663878:sns_parure_jupe_partie_de_l_habillement_feminin_qui_descend_depuis_la_ceinture_plus_ou_moins_bas_suivant_la_mode_a00e907c3b', 'The phrase les jupes de travers describes skirts worn askew. The noun means skirts.'],
  ['srf_parure_laideur_laideur_noun_cb75863aa6:sns_parure_laideur_ugliness_7439848979', 'The narrator describes the ugliness of worn upholstery and fabrics in Mathilde’s home. The noun means ugliness.'],
  ['srf_parure_laissa_laisser_verb_b2b1644aaf:sns_parure_laisser_allow_9b583fe23f', 'Reviewed both contexts: Cinderella let a slipper fall, and Mathilde let herself be married to a clerk. The causative/allowing sense is appropriate.'],
  ['srf_parure_larges_large_adjective_4f9ae1e0a8:sns_large_primary', 'The phrase larges fauteuils describes wide armchairs. The adjective means wide.'],
  ['srf_parure_larmes_lem_parure_larme_noun_c90b04c371_86de271599:sns_parure_larme_goutte_du_liquide_secrete_par_les_glandes_lacrymales_situees_a_cote_de_chaque_il_273979401d', 'The occurrence refers to tears descending from the corners of Mathilde’s eyes. The plural noun means tears.'],
  ['srf_parure_lava_lem_parure_laver_verb_af3f3c4e06_e0f1b3174b:sns_parure_laver_nettoyer_avec_de_l_eau_pure_ou_savonneuse_ou_de_lessive_ou_avec_tout_autre_liquide_259d709e77', 'Mathilde washes the dishes as part of her household chores. The past historic form lava means “washed.”'],
  ['srf_parure_lavait_lem_parure_laver_verb_af3f3c4e06_644b71c1c5:sns_parure_laver_nettoyer_avec_de_l_eau_pure_ou_savonneuse_ou_de_lessive_ou_avec_tout_autre_liquide_259d709e77', 'Mathilde washed the floors with plenty of water while doing household work. The imperfect form and sense “wash” are accurate.'],
].map(([id, rationale]) => ['srf_parure_jolie_lem_joli_efaa15ed3f:sns_parure_joli_qui_a_de_la_grace_de_l_agrement_c9d52e1cf5', 'srf_parure_jolies_joli_adjective_3148819c3c:sns_parure_joli_pretty_a9fdf55348', 'srf_parure_laissa_laisser_verb_b2b1644aaf:sns_parure_laisser_allow_9b583fe23f'].includes(id)
  ? [id, 'hold', `${rationale} An unresolved same-lemma duplicate candidate also needs reconciliation before approval.`]
  : [id, 'approve', rationale]);
const publication = loadPublication();
const subjectMap = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary').map(subject => [subject.id, subject]));
const alreadyReviewed = new Set(readdirSync(resolve(publicationRoot, batchDirectory)).filter(file => file.endsWith('.json')).flatMap(file => JSON.parse(readFileSync(resolve(publicationRoot, batchDirectory, file), 'utf8')).changes.map(change => change.subjectId)));
const blockedIds = auditEditorialQuality(publication).filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary' && !alreadyReviewed.has(issue.id)).map(issue => issue.id).sort();
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
    ? approveReview('fr', 'vocabulary', subjectId, value, 'Codex', '2026-09-24T00:00:00.000Z', rationale)
    : pendingReview('fr', 'vocabulary', subjectId, value, rationale);
  reviewMap.set(reviewId, after);
  return { subjectId, reviewId, outcome, rationale, before, after, reviewedOccurrences: value.occurrences.length };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 28, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length, holds: changes.filter(change => change.outcome === 'hold').length, progressTransfers: [], reviewMethod: 'individual contextual review of current lemma, part of speech, surface form, every indexed occurrence, sense, and same-lemma reuse candidates; only supported records approved', changes };
const files = new Map(sharedSourceFiles({ ...sources, reviews: [...reviewMap.values()] }));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, backup, reviewed: changes.length, approvals: ledger.approvals, holds: ledger.holds, ledger: resolve(publicationRoot, ledgerPath) }, null, 2));
