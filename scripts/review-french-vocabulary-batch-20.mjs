import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-20';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_alouettes_lem_parure_alouette_noun_6d6ed67b04_51ff1d91dd:sns_parure_alouette_petit_oiseau_passereau_terrestre_brunatre_et_au_bec_mince_qui_vit_de_grain_et_qui_fait_son_nid_dans_les_plaines_fe72d7158b', 'approve', 'Reviewed the sole occurrence: the husband planned to hunt larks in the plain near Nanterre. Alouettes is the plural of alouette, a lark, and the noun sense fits.'],
  ['srf_parure_amie_ami_noun_061093e63e:sns_parure_ami_friend_53b9cc66f8', 'approve', 'Reviewed all seven occurrences: Mme Forestier is Mathilde’s female friend, and the other uses refer to a woman’s friend. Amie is the feminine form of ami and the sense is consistent.'],
  ['srf_parure_amusaient_lem_amuser_82d0e88b99:sns_parure_amuser_divertir_par_des_choses_agreables_77b0925222', 'hold', 'The sole form occurs in s’amusaient (“were enjoying themselves/having fun”), a reflexive intransitive construction, while the current lemma/sense is transitive “amuse/entertain.” Clarify the reflexive identity and sense before approval.'],
  ['srf_parure_ancienne_ancien_adjective_53a9cd9f83:sns_parure_ancien_old_ae608f72b7', 'approve', 'Reviewed the sole use soie ancienne: ancienne describes old/antique silk furnishings. The feminine adjective form of ancien and “old” sense fit.'],
  ['srf_parure_anciens_ancien_adjective_aefaf785b8:sns_parure_ancien_old_ae608f72b7', 'approve', 'Reviewed the sole use personnages anciens: anciens describes old/ancient figures depicted on the tapestries. The plural masculine adjective form and age sense fit.'],
  ['srf_parure_antichambres_antichambre_noun_6cb53cb9c8:sns_parure_antichambre_anteroom_1b5438885a', 'approve', 'Reviewed the sole occurrence: Mathilde dreams of silent anterooms. Antichambres is the plural noun and its gloss is exact.'],
  ['srf_parure_apercue_apercevoir_verb_01bc9ce2a0:sns_parure_apercevoir_notice_489e40fc63', 'hold', 'All three occurrences are reflexive s’apercevoir (notice/realize), while the record is linked to non-reflexive apercevoir. Clarify reflexive lemma binding and ensure the notice/realize sense covers each use.'],
  ['srf_parure_apercut_lem_parure_apercevoir_verb_ec04c0315a_df1b6f4117:sns_parure_apercevoir_commencer_a_voir_1c1bdc0051', 'approve', 'Reviewed the sole occurrence: Mathilde suddenly caught sight of Mme Forestier on the Champs-Élysées. Aperçut is the past historic of apercevoir, “glimpsed/caught sight of.”'],
  ['srf_parure_appelee_lem_zola_appeler_0ee349bdc4:sns_parure_appeler_designer_quelqu_un_par_son_nom_pourvoir_quelqu_un_d_un_nom_0465c32577', 'approve', 'Reviewed the sole passive occurrence: Mme Forestier was surprised to be addressed so familiarly. Appelée means called/addressed by name, matching the sense.'],
  ['srf_parure_apporta_lem_zola_apporter_d09276151e:sns_parure_apporter_porter_quelque_chose_a_quelqu_un_note_d_usage_l_objet_du_verbe_apporter_est_toujours_un_inanime_c95e635330', 'approve', 'Reviewed the sole occurrence: Mme Forestier brought a large jewelry box to Mme Loisel. Apporta is the past historic of apporter, “brought,” with an inanimate object.'],
  ['srf_parure_apportes_lem_zola_apporter_7a402ca0b3:sns_parure_apporter_porter_quelque_chose_a_quelqu_un_note_d_usage_l_objet_du_verbe_apporter_est_toujours_un_inanime_c95e635330', 'approve', 'Reviewed the sole occurrence: the husband had brought clothes for the outing. Apportés is the masculine plural past participle of apporter, “brought,” agreeing with vêtements.'],
  ['srf_parure_approcha_lem_parure_approcher_verb_a364f962e5_e14029de31:sns_parure_approcher_mettre_proche_mettre_pres_a9f7869aae', 'approve', 'Reviewed the sole occurrence: Mme Forestier approached the mirror cabinet. Approcha is the past historic of approcher, “approached,” matching the movement.'],
  ['srf_parure_argenteries_argenterie_noun_f8bf3cff09:sns_parure_argenterie_silverware_d295311cb8', 'approve', 'Reviewed the sole occurrence: Mathilde dreams of polished silverware at fine dinners. Argenteries means silverware, matching the tableware context.'],
  ['srf_parure_armoire_lem_parure_armoire_noun_e2ea8e1d8b_0b4c7a071f:sns_parure_armoire_meuble_haut_ferme_par_une_ou_deux_portes_et_destine_au_rangement_du_linge_des_vetements_ou_d_autres_objets_b2c8b84ff7', 'approve', 'Reviewed the two occurrences: Mme Forestier goes to her armoire and takes a jewelry box from it. Armoire is a wardrobe/cabinet for storing belongings.'],
  ['srf_parure_asseyait_asseoir_verb_264b2fda1b:sns_parure_asseoir_sit_b7d2366b4e', 'hold', 'Both occurrences use s’asseoir (“sit down”), while the record is attached to the non-reflexive asseoir. Clarify reflexive lemma/form treatment before approval.'],
  ['srf_parure_assoupis_assoupi_adjective_0dd2053bcc:sns_parure_assoupi_drowsy_cf7c831751', 'approve', 'Reviewed the sole occurrence: the valets are dozing, made drowsy by the heat. Assoupis is the masculine plural adjective and means drowsy/dozing.'],
  ['srf_parure_attacha_lem_parure_attacher_verb_6149dd9f9f_f0d11efd01:sns_parure_attacher_fixer_une_chose_ou_une_personne_a_une_autre_en_sorte_qu_elle_y_tienne_1b92560094', 'approve', 'Reviewed the sole occurrence: Mathilde fastened the diamond necklace around her throat. Attacha is the past historic of attacher and the fastening sense fits.'],
  ['srf_parure_attendit_lem_zola_attendre_e13fee6e0c:sns_parure_attendre_ne_pas_bouger_rester_la_ou_l_on_est_pour_la_venue_de_quelque_chose_ou_de_quelqu_un_a0f46dec06', 'approve', 'Reviewed the sole occurrence: she waited all day after discovering the necklace was missing. Attendit is the past historic of attendre, “waited.”'],
  ['srf_parure_attention_attention_noun_5be44e732a:sns_parure_attention_notice_c42c2aae7d', 'approve', 'Reviewed the sole occurrence: Mathilde longs for the attention of admired, sought-after men. Attention means notice/attention in this social context.'],
  ['srf_parure_atterres_lem_parure_atterre_adjective_1dd2f37381_a7a5dfcc66:sns_parure_atterre_qui_est_a_terre_abattu_c31411c1de', 'approve', 'Reviewed the sole occurrence: the couple looked appalled after realizing the necklace was lost. Atterrés is the plural adjective meaning appalled/dismayed.'],
  ['srf_parure_autrefois_lem_parure_autrefois_adverb_89c4ccdde8_1f3609a822:sns_parure_autrefois_anciennement_jadis_au_temps_passe_54bb477184', 'approve', 'Reviewed the sole occurrence: Mathilde remembers the ball of years earlier. Autrefois means formerly/in the past, matching the contrast with maintenant.'],
  ['srf_parure_avant_lem_parure_avant_preposition_2bf7a798c2_cd2035fa75:sns_parure_avant_marque_la_priorite_ou_l_anteriorite_de_temps_95b333e08d', 'approve', 'Reviewed all four occurrences: avant marks earlier time relative to August, three days, the end of February, or another event. The temporal preposition sense is stable.'],
  ['srf_parure_avenir_lem_parure_avenir_noun_e9281e01e0_6c173eeda3:sns_parure_avenir_futur_ce_qui_va_arriver_7129847a55', 'approve', 'Reviewed the sole phrase angoisses de l’avenir: the debtors are frightened about what lies ahead. Avenir means the future.'],
  ['srf_parure_bal_lem_parure_bal_noun_d4b18203c0_69b3f44b37:sns_parure_bal_reunion_assemblee_ou_l_on_danse_916d86d2e6', 'approve', 'Reviewed all 18 occurrences: bal consistently denotes the formal dance party attended by Mathilde, including the event and its clothing/context. The noun sense is consistent.'],
  ['srf_parure_balbutia_lem_parure_balbutier_verb_6dc8cd45ac_4145b19065:sns_parure_balbutier_s_exprimer_ou_prononcer_difficilement_en_hesitant_7e10dc1bcd', 'approve', 'Reviewed both occurrences: characters hesitate and stammer while speaking after the loss. Balbutia is the past historic of balbutier, “stammered.”'],
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
  sequence: 20, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
