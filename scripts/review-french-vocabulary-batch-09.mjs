import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-09';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_cendrillon_patience_lem_cendrillon_patience_noun_d0b71c3672_4785cbcae2:sns_cendrillon_patience_vertu_qui_fait_supporter_les_adversites_les_douleurs_les_injures_les_incommodites_etc_7c7ad38b62', 'approve', 'Reviewed both occurrences: the fable praises patience as a virtue, and Cinderella bears hardship with patience. The noun consistently means patient endurance/forbearance.'],
  ['srf_cendrillon_paysanne_lem_cendrillon_paysanne_noun_e86002eefd_e724debfa8:sns_cendrillon_paysanne_femme_qui_s_occupe_des_travaux_de_la_terre_et_vit_a_la_campagne_84373a0f96', 'approve', 'Reviewed the sole occurrence: the guards say the poorly dressed girl looked more like a peasant woman than a lady. The feminine noun paysanne and rural-labor definition fit the contrast.'],
  ['srf_cendrillon_pentoufle_lem_cendrillon_pantoufle_noun_4a911c8ad5_abed3147e1:sns_cendrillon_pantoufle_chaussure_d_interieur_que_l_on_met_chez_soi_pour_etre_plus_a_l_aise_f4799862bc', 'hold', 'All three occurrences name Cinderella’s glass ball shoe, not indoor footwear for comfort. The current definition is too narrow for the Perrault context; add the historical shoe sense and re-review.'],
  ['srf_cendrillon_pentoufles_lem_cendrillon_pantoufle_noun_4a911c8ad5_f6334e90fd:sns_cendrillon_pantoufle_chaussure_d_interieur_que_l_on_met_chez_soi_pour_etre_plus_a_l_aise_f4799862bc', 'hold', 'The glass pentoufles are elegant footwear worn to the ball, not house slippers. The current definition conflicts with the story use; broaden/split the pantoufle sense and re-review.'],
  ['srf_cendrillon_pere_lem_parure_pere_noun_ed8aad9a3c_ac10b5c12f:sns_parure_pere_male_ayant_feconde_un_ovule_qui_a_donne_naissance_a_un_enfant_geniteur_9f98dd6000', 'approve', 'Reviewed the sole occurrence: Cinderella does not dare complain to her father, who might scold her. Père means father/parent; the noun and family relation fit.'],
  ['srf_cendrillon_personnes_lem_cendrillon_personne_noun_69ac7cf987_e5f6d44d5d:sns_cendrillon_personne_etre_humain_considere_en_tant_qu_individu_003f631f98', 'approve', 'Reviewed the sole occurrence: people of rank are invited to the prince’s ball. Personnes denotes individual people; the phrase qualifier de qualité adds social standing but does not change the noun sense.'],
  ['srf_cendrillon_pieds_lem_parure_pied_noun_932ec5db4e_7988494874:sns_parure_pied_partie_du_corps_humain_situee_a_l_extremite_des_jambes_229cd337b6', 'approve', 'Reviewed both contexts: the sisters see Cinderella from feet to head, then fall at her feet to ask forgiveness. Pieds consistently means the anatomical feet.'],
  ['srf_cendrillon_place_lem_cendrillon_place_noun_c4d9627bc2_d5b3718734:sns_cendrillon_place_lieu_endroit_espace_qu_occupe_ou_que_peut_occuper_une_personne_une_chose_36416224e1', 'hold', 'The prince seats Cinderella at an honorable place/position, but the learner gloss adds square, plaza, and piazza—unrelated senses not present here. Simplify it to place/position and re-review.'],
  ['srf_cendrillon_pleurer_lem_parure_pleurer_verb_2a216fae80_d4c40b3890:sns_cendrillon_pleurer_repandre_des_larmes_757a9bb62f', 'approve', 'Reviewed both occurrences: Cinderella starts crying and cries so hard that she cannot finish her request. Pleurer means to shed tears in both contexts.'],
  ['srf_cendrillon_pleuroit_lem_parure_pleurer_verb_2a216fae80_eb485d9fe7:sns_cendrillon_pleurer_repandre_des_larmes_757a9bb62f', 'approve', 'Reviewed the sole historical imperfect: Cinderella was crying so hard she could not finish speaking. The form pleuroit maps to pleurer and the tear-shedding sense fits.'],
  ['srf_cendrillon_pleurs_lem_cendrillon_pleur_noun_63c6b4dcc0_33b86b327a:sns_cendrillon_pleur_action_de_pleurer_ecoulement_de_larmes_larmes_90fbfd5cff', 'approve', 'Reviewed the sole phrase toute en pleurs: the godmother sees Cinderella in tears. Pleurs denotes crying/tears; the noun and context agree.'],
  ['srf_cendrillon_pouroit_lem_zola_pouvoir_9705e4452e:sns_parure_pouvoir_etre_capable_de_avoir_la_faculte_de_etre_en_etat_de_etre_en_mesure_de_d4a1b091b1', 'approve', 'Reviewed the sole conditional: Cinderella wonders how the pumpkin could make her go to the ball. Pouroit is an older form of pouvoir expressing possibility/ability; the lemma and sense fit.'],
  ['srf_cendrillon_pourrois_lem_zola_pouvoir_c7fe915744:sns_parure_pouvoir_etre_capable_de_avoir_la_faculte_de_etre_en_etat_de_etre_en_mesure_de_d4a1b091b1', 'approve', 'Reviewed the sole conditional question: Cinderella asks whether she could see the princess. The conditional pouvoir means can/be able to; form and context align.'],
  ['srf_cendrillon_pourveu_lem_cendrillon_pourvu_conjunction_ce4b461982_97682904d1:sns_cendrillon_pourvu_ancienne_graphie_de_pourvu_qui_introduit_une_condition_7c307d82b3', 'approve', 'Reviewed the sole occurrence pourveu qu’il se trouvast: it introduces a condition that suitable fabrics and skilled workers be found. The historical spelling maps to pourvu (“provided that”).'],
  ['srf_cendrillon_prestez_moi_lem_parure_preter_verb_09be92b3b5_2dc92608b2:sns_cendrillon_preter_ancienne_graphie_d_un_ordre_demandant_que_quelque_chose_soit_prete_au_locuteur_d18d1affae', 'approve', 'Reviewed the sole imperative prestez-moi: Cinderella asks Javotte to lend her the yellow dress. The form is historical spelling of prêter and the learner gloss “lend me” matches.'],
  ['srf_cendrillon_pria_lem_parure_prier_verb_0b3fbb5c15_242aafeb35:sns_cendrillon_prier_demanda_a_des_personnes_de_venir_a_une_fete_347a3ff2fd', 'approve', 'Reviewed the sole occurrence: the prince invited all people of rank to his ball. Prier means to invite someone to a gathering here; the verb sense is precise.'],
  ['srf_cendrillon_prince_lem_cendrillon_prince_noun_daf410f8e0_b92cf364e7:sns_cendrillon_prince_celui_qui_est_d_une_maison_souveraine_4bbbac1229', 'approve', 'Reviewed all three occurrences: the prince watches Cinderella, follows her, and later marries her. The title prince, member of a sovereign house, fits every context.'],
  ['srf_cendrillon_prioit_lem_parure_prier_verb_0b3fbb5c15_9a11a30b61:sns_cendrillon_prier_demandait_avec_insistance_ou_supplication_f721bf4852', 'approve', 'Reviewed the sole historical imperfect: Cinderella begged/prayed her sisters to love her always. Prioit means to ask earnestly/supplicate; this distinct sense is well supported.'],
  ['srf_cendrillon_promit_lem_zola_promettre_855abb2f21:sns_parure_promettre_s_engager_verbalement_ou_par_ecrit_a_quelque_chose_27d09190ce', 'approve', 'Reviewed the sole past-historic occurrence: Cinderella promised her godmother she would leave before midnight. Promettre means to promise/commit verbally; form and context fit.'],
  ['srf_cendrillon_promptement_lem_cendrillon_promptement_adverb_2f30aa1ccc_0cd9a0742f:sns_cendrillon_promptement_avec_promptitude_90fb2ebf1f', 'approve', 'Reviewed the sole occurrence: the princess fled promptly when midnight rang and quickly dropped a slipper. Promptement means quickly/promptly; the adverb is accurate.'],
  ['srf_cendrillon_purent_lem_zola_pouvoir_86c0387940:sns_parure_pouvoir_etre_capable_de_avoir_la_faculte_de_etre_en_etat_de_etre_en_mesure_de_d4a1b091b1', 'approve', 'Reviewed the sole past-historic plural: the sisters could not manage to fit their feet into the slipper. Purent is pouvoir and expresses ability/possibility; the negative construction fits.'],
  ['srf_cendrillon_put_lem_zola_pouvoir_af88ee5221:sns_parure_pouvoir_etre_capable_de_avoir_la_faculte_de_etre_en_etat_de_etre_en_mesure_de_d4a1b091b1', 'approve', 'Reviewed the sole occurrence: Cinderella leaves as quickly as she could. Pût is the imperfect subjunctive of pouvoir; the ability sense is correct in context.'],
  ['srf_cendrillon_qualitez_lem_cendrillon_qualite_noun_e3e361cc64_d665e29ae1:sns_cendrillon_qualite_maniere_d_etre_bonne_ou_mauvaise_grande_ou_petite_etc_de_quelque_chose_ou_de_quelqu_un_etat_caracteristique_c0aacd9fa3', 'approve', 'Reviewed the sole plural occurrence bonnes qualitez: Cinderella’s positive qualities make the stepsisters seem worse. Qualité means a characteristic/trait, with the adjective bonnes supplying the positive value.'],
  ['srf_cendrillon_quarts_lem_cendrillon_quart_noun_e9b4167c1a_7d1a07d28c:sns_cendrillon_quart_partie_d_une_unite_subdivisee_en_quatre_parties_egales_1_4_6254ce0597', 'approve', 'Reviewed the time phrase onze heures trois quarts: it means quarter to twelve, so quarts denotes quarter-hour portions. The fractional noun sense correctly grounds the time expression.'],
  ['srf_cendrillon_querir_lem_cendrillon_querir_verb_1381766317_c2a46ed713:sns_cendrillon_querir_chercher_avec_charge_d_amener_la_personne_ou_d_apporter_la_chose_dont_il_est_question_e83293d1b7', 'approve', 'Reviewed the sole occurrence envoyer querir la coëffeuse: the household sends someone to fetch the hairdresser. Querir means to seek/fetch a person with the intent to bring them; the verb and context align.'],
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
  sequence: 9, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
