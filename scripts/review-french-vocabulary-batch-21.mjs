import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-21';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_parure_beaute_beaute_noun_150224a82c:sns_parure_beaute_beauty_c87109f4ca', 'approve', 'Reviewed all three occurrences: beauté means physical beauty or attractiveness and describes Mathilde’s appearance, charm, and status at the ball. The noun sense is consistent.'],
  ['srf_parure_begaya_lem_parure_begayer_verb_58a90bdf85_d7546f3f43:sns_parure_begayer_articuler_mal_les_mots_les_prononcer_en_hesitant_et_en_repetant_la_meme_syllabe_avant_de_prononcer_celle_qui_suit_269a801587', 'approve', 'Reviewed the sole occurrence: after seeing Mathilde cry, her husband stammered. Bégaya is the past historic of bégayer and the hesitation-in-speech sense fits.'],
  ['srf_parure_besognes_lem_zola_besogne_53a1d47622:sns_parure_besogne_travail_qu_exige_de_chacun_sa_profession_action_par_laquelle_on_fait_une_uvre_5eb99dcf29', 'approve', 'Reviewed both occurrences: besognes refers to the unpleasant household tasks and the week’s work. The plural noun sense “work/tasks” fits both contexts.'],
  ['srf_parure_bibelots_bibelot_noun_15d22dd054:sns_parure_bibelot_ornament_e10f2286c6', 'approve', 'Reviewed the sole occurrence: inestimable bibelots are ornaments/knickknacks displayed on furniture. The plural noun sense fits.'],
  ['srf_parure_bijou_lem_parure_bijou_noun_483730c8b0_5b897883f2:sns_parure_bijou_petit_ouvrage_de_luxe_d_un_travail_elegant_et_d_une_matiere_precieuse_et_qui_sert_de_parure_et_d_ornement_97ed32e724', 'approve', 'Reviewed both occurrences: Mathilde longs for a jewel and the couple must replace the necklace. Bijou means an individual piece of jewelry/ornament.'],
  ['srf_parure_bijoux_bijou_noun_67aaa2d961:sns_parure_bijou_jewelry_24ac7c5708', 'approve', 'Reviewed both occurrences: bijoux refers generically to jewelry Mathilde loves and borrows. The plural form and collective “jewelry” gloss fit.'],
  ['srf_parure_boite_lem_parure_boite_noun_31f3e74a4a_ebd7982d94:sns_parure_boite_objet_rigide_et_creux_ayant_la_capacite_de_se_fermer_et_qui_a_vocation_a_accueillir_quelque_chose_443f1913bb', 'approve', 'Reviewed both occurrences: one box holds the diamond necklace; the next is the container from which the jeweler identifies its name. Boîte means box/container.'],
  ['srf_parure_bouche_lem_zola_bouche_7f977d9386:sns_parure_bouche_organe_de_l_etre_humain_compose_de_deux_levres_horizontales_situees_au_bas_du_visage_lui_servant_notamment_a_ingurgiter_de_la_nourriture_et_de_la_boisson_a_parler_a_embrasser_et_a_faire_des_expressions_faciales_df05452fb7', 'approve', 'Reviewed the sole occurrence: the tears run toward the corners of the husband’s mouth. Bouche means mouth, matching the facial feature.'],
  ['srf_parure_boutique_lem_parure_boutique_noun_93a4d50fc4_a6d3d83d3f:sns_parure_boutique_magasin_partie_de_facade_du_rez_de_chaussee_d_une_maison_consacree_a_un_commerce_de_detail_ou_a_la_fois_a_la_fabrication_et_a_la_vente_650b1efde6', 'approve', 'Reviewed the sole occurrence: the couple found a diamond necklace in a shop at the Palais-Royal. Boutique means shop/store.'],
  ['srf_parure_bracelets_lem_parure_bracelet_noun_46eff23837_6d5d0b550c:sns_parure_bracelet_ornement_qui_se_porte_principalement_au_bras_autour_du_poignet_ce5df2c993', 'approve', 'Reviewed the sole occurrence: bracelets are listed among the jewelry Mathilde admires and tries on. The plural noun for wrist ornaments is exact.'],
  ['srf_parure_bretonne_bretonne_noun_1d0ff014cb:sns_parure_bretonne_woman_e937b54c5d', 'approve', 'Reviewed the sole occurrence: la petite Bretonne is a young Breton woman working as a maid in Mathilde’s household. The lemma and gloss “Breton woman” preserve both gender and regional identity.'],
  ['srf_parure_bronze_bronze_noun_1fd5f69f79:sns_parure_bronze_metal_46f84bc7a8', 'approve', 'Reviewed the sole occurrence: tall torchères are made of bronze. The material noun sense is direct and accurate.'],
  ['srf_parure_ca_lem_parure_ca_pronoun_3ca57e8db6_1045e5d967:sns_parure_ca_cette_chose_cette_situation_94a901ac74', 'approve', 'Reviewed both occurrences: ça refers to the situation in “Comment ça ?” and to the couple’s financial hardship in “ça n’était pas aisé.” The demonstrative pronoun sense fits.'],
  ['srf_parure_calme_lem_parure_calme_adjective_db7d58a5f5_718e1a3f51:sns_parure_calme_qui_est_sans_turbulence_sans_agitation_tant_au_sens_physique_que_moral_6e6e555895', 'approve', 'Reviewed the sole occurrence: Mathilde answers in a calm voice despite her distress. Calme describes a composed, unagitated manner.'],
  ['srf_parure_calorifere_calorifere_noun_dbf1eb1ecf:sns_parure_calorifere_heater_607b9b506f', 'approve', 'Reviewed the sole occurrence: the valets doze from the heat of the calorifère, a heating stove/heater. The noun gloss fits.'],
  ['srf_parure_camarade_camarade_noun_6ff5cbb6db:sns_zola_camarade_colleague', 'hold', 'The sole context is une camarade de couvent, a schoolmate/convent companion, not a workplace colleague. Correct the sense/gloss to classmate or school friend before approval.'],
  ['srf_parure_capitonnees_capitonner_verb_f032b68fc1:sns_parure_capitonner_pad_6a413769e7', 'approve', 'Reviewed the sole occurrence: the imagined salons are upholstered/padded with rich hangings. Capitonnées is the feminine plural past participle of capitonner, matching the implied rooms.'],
  ['srf_parure_carte_carte_noun_7a39220105:sns_parure_carte_card_a6d006c5ab', 'approve', 'Reviewed both occurrences: one is the invitation card and the other is the card Mathilde could give to a colleague. The “card/invitation card” sense fits both.'],
  ['srf_parure_casseroles_lem_parure_casserole_noun_5b3de7536d_9cf3256c67:sns_parure_casserole_ustensile_de_cuisine_a_fond_plat_et_a_bords_haut_muni_le_plus_souvent_d_un_manche_generalement_utilise_dans_la_confection_de_recettes_a_base_de_liquides_a01bf6d905', 'approve', 'Reviewed the sole occurrence: Mathilde scrubs the greasy bottoms of cooking pots. Casseroles is the plural of casserole, a saucepan/pot.'],
  ['srf_parure_caste_caste_noun_0c2e435ee2:sns_parure_caste_social_class_6437d490dc', 'approve', 'Reviewed both occurrences: caste refers to social rank or class that Mathilde believes women lack and that another woman shares. The social-class sense is consistent.'],
  ['srf_parure_cause_lem_parure_cause_noun_56c8c57e9b_5a3b159376:sns_parure_cause_ce_qui_fait_qu_une_chose_est_ou_s_opere_052d81a7c9', 'hold', 'Both occurrences appear in the fixed phrase à cause de (“because of”), rather than a standalone noun use. Review at the expression level and clarify component-word approval before approving this noun record.'],
  ['srf_parure_causerie_causerie_noun_4ece15999c:sns_parure_causerie_conversation_cd9e5ebf8e', 'approve', 'Reviewed the sole occurrence: the salons are imagined as places for intimate afternoon conversation. Causerie means conversation/chat.'],
  ['srf_parure_cesse_cesse_noun_c9ca88643d:sns_parure_cesse_stopping_3bb34c9554', 'hold', 'The sole use is sans cesse (“unceasingly/constantly”), a fixed adverbial expression, not a standalone noun meaning cessation. Clarify the expression-level assignment and learner gloss before approval.'],
  ['srf_parure_chagrin_chagrin_noun_2250bab904:sns_parure_chagrin_sorrow_c3422144c6', 'approve', 'Reviewed both occurrences: Mathilde cries from sorrow and the couple is sick with grief after losing the necklace. Chagrin means sorrow/grief in both.'],
  ['srf_parure_chaise_lem_parure_chaise_noun_f984069fea_589f6d88bb:sns_parure_chaise_siege_avec_dossier_sans_accoudoirs_45098225ce', 'approve', 'Reviewed the sole occurrence: Mathilde collapses onto a chair after the loss. Chaise means chair/seat, matching the furniture item.'],
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
  sequence: 21, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
