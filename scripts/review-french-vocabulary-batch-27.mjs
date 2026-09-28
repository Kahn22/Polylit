import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-27';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);
const decisions = [
  ['srf_parure_fevrier_lem_parure_fevrier_noun_d6850cfdac_17adca7897:sns_parure_fevrier_deuxieme_mois_du_calendrier_gregorien_qui_compte_normalement_vingt_huit_jours_sauf_dans_les_annees_bissextiles_ou_il_en_compte_vingt_neuf_16b37fc940', 'approve', 'The reference to the end of February correctly identifies the month. The noun means February.'],
  ['srf_parure_fiacre_lem_parure_fiacre_noun_1a44b77d56_943b7d38b1:sns_parure_fiacre_voiture_hippomobile_de_louage_conduite_par_un_cocher_que_l_on_utilisait_a_la_course_ou_a_l_heure_e2563a6a55', 'approve', 'Reviewed both occurrences: the couple calls for and later rides in a hired horse-drawn fiacre. The historical vehicle sense is accurate.'],
  ['srf_parure_filles_fille_noun_7709c9b174:sns_parure_fille_girl_56875b5e2d', 'approve', 'Reviewed all indexed occurrences across the two works: filles refers to daughters, young women, and girls of the people. The supplied French definition and English gloss cover these uses.'],
  ['srf_parure_finesse_finesse_noun_f2b0509822:sns_parure_finesse_subtlety_669529c0ed', 'approve', 'The occurrence describes the women’s native delicacy of judgment and refinement of spirit. “Subtlety/refinement” is accurate.'],
  ['srf_parure_fins_fin_adjective_5ee761fdde:sns_parure_fin_refined_78c52731bb', 'approve', 'Reviewed both occurrences: dîners fins are refined meals and meubles fins are elegant, finely made furniture. The sense “fine/refined” fits.'],
  ['srf_parure_fleurs_lem_parure_fleur_noun_0ca9aebf37_9b39cbd23d:sns_parure_fleur_organe_reproducteur_des_angiospermes_ou_plantes_a_fleurs_constitue_des_organes_de_la_reproduction_sexuee_etamines_carpelles_et_de_leurs_enveloppes_protectrices_sepales_petales_b987f3d207', 'hold', 'The two contexts differ: fleurs d’or describes a floral design on a cloak, while fleurs naturelles means fresh flowers. The botanical sense does not explicitly cover the decorative pattern use; split or broaden the entry before approval.'],
  ['srf_parure_foret_foret_noun_afc0d04b73:sns_parure_foret_woods_eccf35141d', 'approve', 'The occurrence is a forest of enchantment, an expanse covered with trees. Forêt means forest.'],
  ['srf_parure_fournir_lem_parure_fournir_verb_b84fbfccd1_13bfc55664:sns_parure_fournir_pourvoir_approvisionner_07049ab9dc', 'approve', 'In this occurrence the jeweler had to provide the case along with the necklace. Fournir means supply/provide.'],
  ['srf_parure_fourrures_lem_parure_fourrure_noun_5cd63c60eb_3593402ab4:sns_parure_fourrure_peau_densement_recouverte_de_poils_de_certains_mammiferes_92fa7e531d', 'approve', 'The women wrap themselves in rich furs. The noun fourrure means fur, including fur garments by extension.'],
  ['srf_parure_galanteries_galanterie_noun_911aba6cc0:sns_parure_galanterie_flattery_4367f9bfde', 'approve', 'The occurrence describes whispered, courteous and flattering compliments. The English gloss “gallant compliments” is accurate.'],
  ['srf_parure_glorieux_glorieux_adjective_e55f11d8bb:sns_parure_glorieux_triumphant_7e5fdff607', 'approve', 'Loisel comes home proud and triumphant, holding the invitation. The adjective sense describes pride associated with success.'],
  ['srf_parure_grace_grace_noun_e439791df6:sns_parure_grace_elegance_b76b8feb89', 'approve', 'The sentence lists beauty, grace, and charm as the women’s natural qualities. “Grace/elegance” is appropriate.'],
  ['srf_parure_gracieuse_lem_parure_gracieux_adjective_094270c387_358b38909a:sns_parure_gracieux_qui_a_beaucoup_de_grace_et_d_agrement_3836e8f7f0', 'approve', 'The adjective describes Mathilde as graceful and charming among the women at the ball. The lemma and sense align.'],
  ['srf_parure_grelottants_lem_parure_grelottant_adjective_03d446a633_da2e78aa39:sns_parure_grelottant_qui_grelotte_f664ba5acf', 'approve', 'The couple are shivering as they walk toward the Seine after the ball. Grelottants means shivering/trembling.'],
  ['srf_parure_grisee_lem_parure_grise_adjective_9011e5935a_c2a47efc4d:sns_parure_grise_qui_est_enivre_0e8c029e7a', 'hold', 'The definition says intoxicated/exhilarated, and the context says Mathilde is exhilarated by pleasure; however, the English gloss says “gray/grayish,” which is unrelated and misleading. Correct the gloss before approval.'],
  ['srf_parure_grosses_lem_parure_gros_adjective_c14fefc1c6_5bf258bc32:sns_parure_gros_qui_a_beaucoup_de_circonference_ou_de_volume_2f8e177ce6', 'approve', 'The phrase deux grosses larmes means two large tears. The adjective describes substantial size/volume.'],
  ['srf_parure_hein_lem_parure_hein_interjection_be5a55622f_fcbc762e85:sns_parure_hein_dont_on_accompagne_une_interrogation_ou_une_phrase_qui_exprime_l_etonnement_be4c1524e0', 'approve', 'The speaker adds hein? as a conversational tag to a question seeking confirmation. “Huh/eh?” fits the interrogative use.'],
  ['srf_parure_heroiquement_lem_parure_heroiquement_adverb_61268f34db_050f7afd26:sns_parure_heroiquement_d_une_maniere_heroique_ef3655a164', 'approve', 'Mathilde accepts the debt and resolves to repay it héroïquement. The adverb “heroically” matches the narrator’s characterization.'],
  ['srf_parure_hesitait_lem_parure_hesiter_verb_eb790bfa81_3116444872:sns_parure_hesiter_etre_incertain_indecis_sur_le_parti_sur_la_resolution_que_l_on_doit_prendre_0558e18eaa', 'approve', 'Mathilde tries on the jewelry and hesitates because she cannot decide whether to return it. The verb “hesitate” is accurate.'],
  ['srf_parure_hesitante_lem_parure_hesitant_adjective_193276e29f_8c28516b1c:sns_parure_hesitant_qui_hesite_qui_n_a_pas_de_certitude_8ad718c8b1', 'approve', 'Mathilde asks hesitantly and anxiously about the princess. The adjective means hesitant/uncertain.'],
  ['srf_parure_heures_heure_noun_c591d8a2ff:sns_zola_heure_hour', 'approve', 'Reviewed all six occurrences: heures denotes clock hours and the set time of day across both stories. The gloss “hour/time” fits.'],
  ['srf_parure_hierarchie_hierarchie_noun_f8643b207a:sns_parure_hierarchie_ranking_aefb5c3cf6', 'approve', 'The phrase leur seule hiérarchie refers to refinement and spirit as the women’s only ranking system. The sense “hierarchy/ranking” is accurate.'],
  ['srf_parure_horrible_lem_parure_horrible_adjective_52f346e3ba_0ca191653c:sns_parure_horrible_qui_fait_horreur_294f8bd4a6', 'approve', 'The phrase vie horrible des nécessiteux describes the terrible life of people in poverty. The adjective means horrible/terrible.'],
  ['srf_parure_hotel_lem_parure_hotel_noun_4089c2886d_278661d748:sns_parure_hotel_grande_maison_ou_demeure_d_un_riche_particulier_c29f681b76', 'approve', 'The invitation is to an official evening reception at the hôtel du ministère, a grand official residence/building. The historical town-house sense is accurate.'],
  ['srf_parure_humble_humble_adjective_277b239aa9:sns_zola_humble_lowly', 'approve', 'The Breton maid performs humble domestic work, reflecting her modest social position. The adjective sense “humble/lowly” fits.'],
];
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
  const after = outcome === 'approve' ? approveReview('fr', 'vocabulary', subjectId, value, 'Codex', '2026-09-24T00:00:00.000Z', rationale) : pendingReview('fr', 'vocabulary', subjectId, value, rationale);
  reviewMap.set(reviewId, after);
  return { subjectId, reviewId, outcome, rationale, before, after, reviewedOccurrences: value.occurrences.length };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 27, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length, holds: changes.filter(change => change.outcome === 'hold').length, progressTransfers: [], reviewMethod: 'individual contextual review of current lemma, part of speech, surface form, every indexed occurrence, sense, and same-lemma reuse candidates; only supported records approved', changes };
const files = new Map(sharedSourceFiles({ ...sources, reviews: [...reviewMap.values()] }));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, backup, reviewed: changes.length, approvals: ledger.approvals, holds: ledger.holds, ledger: resolve(publicationRoot, ledgerPath) }, null, 2));
