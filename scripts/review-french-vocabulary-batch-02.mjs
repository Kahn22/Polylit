import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview, pendingReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-2026-09-23-02';
const batchDirectory = 'editorial-review-batches';
const ledgerPath = `${batchDirectory}/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} already exists`);

const decisions = [
  ['srf_broute:sns_brouter_primary', 'hold', 'The verb and grazing sense are supported by the tortoise fable, but the current gloss/definition (“Brouter is the infinitive to graze”) is circular and not a learner-ready meaning. Rewrite it concisely, then re-review both surface forms sharing this lemma and sense.'],
  ['srf_brouter:sns_brouter_primary', 'hold', 'The infinitive means “to graze” in its sole indexed context, but the current gloss/definition (“Brouter is the infinitive to graze”) is circular and not learner-ready. Rewrite the shared sense once and re-review both surface forms before approval.'],
  ['srf_but:sns_but_primary', 'hold', 'All four contexts concern an intended goal or purpose, but the present definition (“But is the noun goal”) is self-referential and the single sense groups a target with a political purpose. Replace it with a precise, contextual definition before approval.'],
  ['srf_carriere:sns_carriere_primary', 'hold', 'The race-course context supports “course/track,” but the lemma is recorded as unaccented carriere while the indexed French form and standard headword are carrière. Correct the lemma spelling and rebind/review this exact identity before approval.'],
  ['srf_celle_ci:sns_celui_primary', 'hold', 'The three occurrences are feminine-singular demonstrative pronoun celle-ci (“this one”), while the shared sense gloss says “the one; the ones” and generalizes across gender and number. Refine the exact learner gloss/sense and re-review dependent questions.'],
  ['srf_celui:sns_celui_primary', 'approve', 'Reviewed all four contexts: masculine-singular celui identifies a person or thing (“the one who listens,” “the one they sought,” and related anaphoric uses). The lemma, form, broad demonstrative-pronoun sense, definition, and indexed uses align; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_achetter_lem_parure_acheter_verb_aee9a3f6e3_5559bd2b57:sns_parure_acheter_acquerir_quelque_chose_en_l_echangeant_contre_sa_valeur_reelle_ou_supposee_en_devise_4f14798b40', 'approve', 'Reviewed the sole Perrault occurrence: historical achetter is the source spelling of modern acheter, here used in the infinitive meaning to buy/purchase. The purchase context, verb lemma, and sense align; preserve the primary-text spelling and teach the modern lemma.'],
  ['srf_cendrillon_achever_lem_zola_achever_9a48f86ba0:sns_cendrillon_achever_finir_une_chose_commencee_15602b231f', 'approve', 'Reviewed the sole occurrence: ne put achever means she could not finish what she had begun saying. The infinitive, verb lemma, “to finish/complete” sense, definition, and full context align; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_admira_lem_cendrillon_admirer_verb_4ba47d46da_f621bef0d5:sns_cendrillon_admirer_considerer_avec_un_etonnement_mele_de_plaisir_ce_qui_parait_beau_ce_qui_parait_merveilleux_d91aa1359a', 'approve', 'Reviewed the sole past-historic occurrence admira: the crowd admired Cinderella’s beauty and grace. The inflected form, admirer lemma, sense of admiring with pleasure, and context align; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_admirer_lem_cendrillon_admirer_verb_4ba47d46da_845ad8e04c:sns_cendrillon_admirer_considerer_avec_un_etonnement_mele_de_plaisir_ce_qui_parait_beau_ce_qui_parait_merveilleux_d91aa1359a', 'approve', 'Reviewed the sole infinitive in De l’admirer jamais on ne se lasse: admirer means to admire/behold with pleasure. The form, lemma, sense, definition, and verse context agree; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_aimable_lem_cendrillon_aimable_adjective_866e3c55a9_76b4bccf73:sns_cendrillon_aimable_qui_merite_d_etre_aime_8fb82c42ec', 'approve', 'Reviewed the sole occurrence describing the unknown woman as belle et aimable: the adjective means amiable/likable and describes a person who is pleasant or lovable. Its form, lemma, sense, and context align; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_aimer_lem_zola_aimer_d5ad7b2f17:sns_parure_aimer_ressentir_un_fort_sentiment_d_attirance_pour_quelqu_un_ou_quelque_chose_713af449e1', 'approve', 'Reviewed the sole occurrence: Cinderella asks her sisters to love her always after forgiving them. The infinitive aimer, verb lemma, affective sense, definition, and context align; the usage note appropriately distinguishes this person-directed meaning from “like.”'],
  ['srf_cendrillon_ainee_lem_cendrillon_ainee_noun_34716a6b73_d8b404d4bd:sns_cendrillon_ainee_enfant_la_plus_agee_d_une_famille_b32c48d7c8', 'approve', 'Reviewed the sole direct-speech occurrence Moy, dit l’aînée: aînée is the eldest sister/daughter, a feminine noun in context. The lemma, form, family-age sense, definition, and use align; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_alloit_lem_aller_312ce8f741:sns_parure_aller_se_deplacer_jusqu_a_un_endroit_3680154133', 'hold', 'The source has s’alloit mettre, an older spelling in a pronominal aller + infinitive construction (“was going to settle/sit down”), not an unambiguous standalone movement use. The active corpus has competing aller senses; resolve the occurrence-level sense and duplicate before approval.'],
  ['srf_cendrillon_amoureux_lem_cendrillon_amoureux_adjective_62bdd0184b_1f9da17b44:sns_cendrillon_amoureux_qui_aime_d_amour_04366087fe', 'hold', 'The context fort amoureux means “very much in love,” but the learner gloss is the noun/verb “love,” not an adjective gloss. Replace it with “in love” (or equivalent), then bind and review the exact revised sense.'],
  ['srf_cendrillon_appartenoit_lem_zola_appartenir_61492aa7db:sns_cendrillon_appartenir_etre_la_propriete_legitime_de_quelqu_un_que_celui_a_qui_est_la_chose_l_ait_en_sa_possession_ou_non_ca8cd59a53', 'approve', 'Reviewed the sole historical imperfect appartenoit: the slipper belonged to the beautiful person. The older spelling maps to appartenir; “to belong” and the ownership definition fit the context.'],
  ['srf_cendrillon_appeloit_lem_zola_appeler_c5c8c2b407:sns_parure_appeler_designer_quelqu_un_par_son_nom_pourvoir_quelqu_un_d_un_nom_0465c32577', 'hold', 'Both appeloit occurrences mean “called/named” someone (Cucendron or Cendrillon), not “called out.” The underlying definition broadly fits, but the learner gloss conflicts with these contexts; correct the gloss and re-review dependent questions.'],
  ['srf_cendrillon_arrosoir_lem_cendrillon_arrosoir_noun_c3cc8734d8_e03fe80891:sns_cendrillon_arrosoir_outil_utilise_pour_l_arrosage_et_qui_se_compose_d_un_recipient_muni_d_une_anse_et_d_un_long_col_ou_queue_qui_peut_etre_termine_par_une_plaque_percee_de_petits_trous_pomme_83fa5d69dc', 'approve', 'Reviewed the sole occurrence: the lizards are behind the arrosoir, a watering can. The masculine noun lemma, surface form, definition, and concrete context agree; no unresolved duplicate candidate exists.'],
  ['srf_cendrillon_assay_lem_cendrillon_essai_noun_ae727b2ba7_7417f83873:sns_cendrillon_essai_test_examen_epreuve_de_solidite_de_perennite_d_adequation_de_potabilite_de_comestibilite_etc_30fcdefe2e', 'approve', 'Reviewed the sole historical spelling assay in faisoit l’assay de la pantoufle: it denotes the trial/trying-on of the slipper. The source form, modern essai lemma, noun classification, and test/trial sense align.'],
  ['srf_cendrillon_asseoir_lem_parure_asseoir_verb_0ca4eea9f9_78f8442052:sns_cendrillon_asseoir_mettre_quelqu_un_sur_un_siege_ou_sur_quelque_chose_qui_tient_lieu_de_siege_153ae61f5e', 'hold', 'The three contexts combine reflexive s’asseoir (“sit down”) with faire asseoir (“seat/make sit”). The current transitive definition does not state the reflexive use. Refine the shared sense or split occurrences, then review the dependent questions.'],
  ['srf_cendrillon_attachez_lem_parure_attacher_verb_6149dd9f9f_bacd3b1f3c:sns_parure_attacher_fixer_une_chose_ou_une_personne_a_une_autre_en_sorte_qu_elle_y_tienne_1b92560094', 'approve', 'Reviewed the sole occurrence: the lizards cling/hold attached to the rat-trap, matching the past participle attachés and the attach/fix-to sense. The lemma, form, and context align.'],
  ['srf_cendrillon_attelage_lem_cendrillon_attelage_noun_8cd148cf61_f9a0e6106e:sns_cendrillon_attelage_ensemble_des_animaux_atteles_pour_tirer_une_voiture_a4c7365fa4', 'approve', 'Reviewed the sole occurrence: six horses form the attelage that draws the carriage. The noun means a team of harnessed draft animals, matching the source context and definition.'],
  ['srf_cendrillon_attentif_lem_cendrillon_attentif_adjective_b6353a9185_5032b5e82a:sns_cendrillon_attentif_qui_a_de_l_attention_de_la_concentration_sur_quelque_chose_f720ba5941', 'approve', 'Reviewed the masculine-singular occurrence: the king is attentif à contempler the beautiful stranger, i.e. attentive/focused on observing her. Lemma, form, adjective sense, and context align.'],
  ['srf_cendrillon_attentives_lem_cendrillon_attentif_adjective_b6353a9185_cb800f9c56:sns_cendrillon_attentif_qui_a_de_l_attention_de_la_concentration_sur_quelque_chose_f720ba5941', 'approve', 'Reviewed the feminine-plural occurrence: the ladies are attentives à considérer her hairstyle and clothes, meaning attentive/focused on them. The form is correctly inflected from attentif, and the shared sense fits.'],
  ['srf_cendrillon_avancement_lem_cendrillon_avancement_noun_8e0002fb16_507d2c2842:sns_cendrillon_avancement_progres_en_quelle_que_matiere_que_ce_soit_5a4ba890dc', 'approve', 'Reviewed the sole moralité occurrence Pour vostre avancement: avancement means advancement/progress in one’s prospects or position. The noun lemma, broad progress sense, and source context align; no competing occurrence requires another sense.'],
];

const publication = loadPublication();
const subjects = editorialSubjects(publication);
const subjectMap = new Map(subjects.filter(subject => subject.kind === 'vocabulary').map(subject => [subject.id, subject]));
const alreadyReviewed = new Set(readdirSync(resolve(publicationRoot, batchDirectory))
  .filter(file => file.endsWith('.json'))
  .flatMap(file => JSON.parse(readFileSync(resolve(publicationRoot, batchDirectory, file), 'utf8')).changes.map(change => change.subjectId)));
const blockedIds = auditEditorialQuality(publication)
  .filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary' && !alreadyReviewed.has(issue.id))
  .map(issue => issue.id).sort();
const expectedIds = blockedIds.slice(0, decisions.length);
if (expectedIds.length !== decisions.length || decisions.some(([id], index) => id !== expectedIds[index])) throw new Error('French vocabulary queue changed; prepare and review a fresh batch before applying.');

const duplicateGroups = duplicateCandidates(publication);
const sources = publication.sharedSources.fr;
const reviewMap = new Map(sources.reviews.map(review => [review.id, review]));
const changes = [];
for (const [subjectId, outcome, rationale] of decisions) {
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
  changes.push({ subjectId, reviewId, outcome, rationale, before, after, reviewedOccurrences: value.occurrences.length });
}

const ledger = {
  version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-23', language: 'fr', subjectKind: 'vocabulary',
  sequence: 2, reviewedIdentities: decisions.length, approvals: changes.filter(change => change.outcome === 'approve').length,
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
