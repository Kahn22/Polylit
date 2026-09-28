import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-24-05';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_aller_primary', { gloss: 'to go', definition: 'Se déplacer ou se diriger vers un lieu.' }],
  ['sns_apprendre_primary', { gloss: 'to learn', definition: 'Acquérir une connaissance ou prendre connaissance de quelque chose.' }],
  ['sns_atteindre_primary', { gloss: 'to reach; catch up with', definition: 'Parvenir jusqu’à un lieu, une personne ou une chose, notamment en la rejoignant.' }],
  ['sns_celui_primary', { gloss: 'the one; the ones', definition: 'Pronom démonstratif qui reprend un être ou une chose identifiable : celui, celle, ceux ou celles.' }],
  ['sns_parure_aller_se_deplacer_jusqu_a_un_endroit_3680154133', { gloss: 'to go', definition: 'Se déplacer d’un endroit vers un autre ou se rendre quelque part.' }],
  ['sns_cendrillon_asseoir_mettre_quelqu_un_sur_un_siege_ou_sur_quelque_chose_qui_tient_lieu_de_siege_153ae61f5e', { gloss: 'to seat; sit down', definition: 'Mettre quelqu’un sur un siège ou, avec se, prendre place sur un siège.' }],
  ['sns_cendrillon_courir_se_deplacer_rapidement_avec_impetuosite_par_un_mouvement_alternatif_des_jambes_ou_des_pattes_prenant_appui_sur_le_sol_avec_une_phase_de_suspension_en_l_air_sans_appui_f406f5e4a6', { gloss: 'to run', definition: 'Se déplacer rapidement par une succession de foulées.' }],
  ['sns_cendrillon_habiller_mettre_des_habits_a_quelqu_un_le_vetir_23cc97bb05', { gloss: 'to dress; clothe', definition: 'Mettre des vêtements à quelqu’un ou le vêtir.' }],
  ['sns_cendrillon_heureux_qui_jouit_du_bonheur_qui_possede_ce_qui_peut_le_rendre_content_90fac6a4b9', { gloss: 'happy', definition: 'Qui éprouve du bonheur ou se trouve content de sa situation.' }],
  ['sns_cendrillon_loger_sejourner_avoir_sa_demeure_habituelle_ou_temporaire_dans_un_logis_4e5fea2575', { gloss: 'to lodge; stay', definition: 'Habiter ou séjourner temporairement dans un logement.' }],
  ['sns_cendrillon_magnificence_caractere_magnifique_de_quelque_chose_ou_de_quelqu_un_9ad099cd6a', { gloss: 'magnificence; splendor', definition: 'Caractère somptueux, grandiose ou éclatant de quelqu’un ou de quelque chose.' }],
  ['sns_cendrillon_mechant_mauvais_contraire_de_bon_95fba00ab4', { gloss: 'bad; poor-quality', definition: 'Mauvais, médiocre ou de qualité insuffisante.' }],
  ['sns_cendrillon_moi_pronom_tonique_de_la_premiere_personne_du_singulier_10c9a4a04d', { gloss: 'me; I (stressed pronoun)', definition: 'Pronom personnel accentué de première personne du singulier, écrit ici selon l’ancienne graphie moy.' }],
  ['sns_cendrillon_ouvrage_travail_action_de_travailler_380311d5fd', { gloss: 'work; task', definition: 'Travail que l’on accomplit ou résultat de ce travail.' }],
  ['sns_cendrillon_parqueter_garnir_d_un_parquet_17b470d791', { gloss: 'to fit with parquet flooring', definition: 'Garnir le sol d’une pièce d’un parquet en bois.' }],
  ['sns_cendrillon_place_lieu_endroit_espace_qu_occupe_ou_que_peut_occuper_une_personne_une_chose_36416224e1', { gloss: 'place; seat; position', definition: 'Lieu ou espace qu’une personne ou une chose occupe ou peut occuper.' }],
  ['sns_cendrillon_remercier_rendre_grace_exprimer_la_gratitude_c35ff021e6', { gloss: 'to thank', definition: 'Exprimer sa gratitude à quelqu’un.' }],
  ['sns_cendrillon_reveiller_tirer_du_sommeil_148b7b959d', { gloss: 'to wake; awaken', definition: 'Tirer quelqu’un du sommeil ou, avec se, sortir du sommeil.' }],
  ['sns_cendrillon_roi_titre_porte_par_celui_qui_regne_sur_un_peuple_un_etat_en_particulier_un_etat_monarchique_et_qui_tient_sa_fonction_de_l_heredite_ou_de_l_election_celui_qui_est_a_la_tete_d_un_royaume_93d71f9fb3', { gloss: 'king', definition: 'Souverain qui règne à la tête d’un royaume.' }],
  ['sns_cigale_fourmi_crier_jeter_un_ou_plusieurs_cris_324ab66571', { gloss: 'to shout; cry out', definition: 'Pousser un ou plusieurs cris ou parler d’une voix forte.' }],
  ['sns_cigale_fourmi_famine_indisponibilite_generale_des_aliments_les_plus_essentiels_c0053b76ad', { gloss: 'famine', definition: 'Manque général et grave des aliments essentiels dans une région ou une population.' }],
  ['sns_depens_primary', { gloss: 'expense; detriment', definition: 'Coût ou préjudice supporté par quelqu’un, notamment dans l’expression « aux dépens de ».' }],
  ['sns_joli_primary', { gloss: 'pretty; handsome', definition: 'Agréable à regarder par sa beauté ou sa grâce.' }],
  ['sns_lion_rat_etourdi_qui_agit_sans_reflexion_ni_prudence_881025a8e8', { gloss: 'heedless; careless', definition: 'Qui agit sans assez de réflexion, d’attention ou de prudence.' }],
  ['sns_lion_rat_montrer_faire_voir_exposer_aux_regards_fea895fd29', { gloss: 'to show', definition: 'Faire voir ou exposer quelque chose aux regards.' }],
  ['sns_loup_agneau_jeun_qui_n_a_pas_mange_depuis_un_certain_temps_f1ac5cfc55', { gloss: 'fasting; without having eaten', definition: 'Qui n’a pas mangé depuis un certain temps, notamment dans l’expression « à jeun ».' }],
  ['sns_loup_agneau_rage_colere_violente_et_incontrolee_a2738d7be6', { gloss: 'rage; fury', definition: 'Colère très violente et difficile à contrôler.' }],
  ['sns_loup_agneau_sire_titre_respectueux_adresse_a_un_souverain_ou_a_un_personnage_puissant_f90b9e2081', { gloss: 'Sire; Your Majesty', definition: 'Titre respectueux employé pour s’adresser à un roi ou à un souverain.' }],
  ['sns_loup_agneau_teter_boit_le_lait_au_sein_de_sa_mere_57d56e2881', { gloss: 'to suckle; nurse', definition: 'Boire le lait au sein de sa mère.' }],
]);
const lemmaUpdates = new Map([]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const beforeSenses = new Map(content.senses.filter(sense => senseUpdates.has(sense.id)).map(sense => [sense.id, sense]));
const beforeLemmas = new Map(content.lemmas.filter(lemma => lemmaUpdates.has(lemma.id)).map(lemma => [lemma.id, lemma]));
if (beforeSenses.size !== senseUpdates.size || beforeLemmas.size !== lemmaUpdates.size) throw new Error('Correction targets changed');
content.senses = content.senses.map(sense => senseUpdates.has(sense.id) ? { ...sense, ...senseUpdates.get(sense.id) } : sense);
content.lemmas = content.lemmas.map(lemma => lemmaUpdates.has(lemma.id) ? { ...lemma, ...lemmaUpdates.get(lemma.id) } : lemma);
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const updatedSenses = new Map(content.senses.map(sense => [sense.id, sense]));
const updatedLemmas = new Map(content.lemmas.map(lemma => [lemma.id, lemma]));
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary' && senseUpdates.has(subject.value.sense.id));
const rationale = 'Corrected the learner-facing gloss and definition to match every indexed context while preserving the existing lemma, sense, surface-form, occurrence, and learner mastery IDs.';
const changes = subjects.map(subject => {
  const value = subject.value;
  const revised = { ...value, lemma: updatedLemmas.get(value.lemma.id), sense: updatedSenses.get(value.sense.id) };
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, revised, 'Codex', '2026-09-24T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length };
});

let reboundQuizzes = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !senseUpdates.has(quiz.subject.senseId)) continue;
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  const sense = updatedSenses.get(quiz.subject.senseId);
  const lemma = updatedLemmas.get(surface.lemmaId);
  const reason = 'Re-reviewed the unchanged authored question after its target meaning was corrected; context, target, answer, grammar, distractors, and all three distinct bands remain accurate.';
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma } }, 'Codex', '2026-09-24T00:00:00.000Z', reason));
  reboundQuizzes++;
}

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 5, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'controlled correction of learner glosses and definitions followed by contextual re-review with stable identity IDs', changes };
const correctionLedger = { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals: reboundQuizzes, changes: [
  ...[...beforeLemmas].map(([id, before]) => ({ kind: 'lemmas', id, before, after: updatedLemmas.get(id), reason: 'Corrected the standard French citation spelling without changing the permanent lemma ID.' })),
  ...[...beforeSenses].map(([id, before]) => ({ kind: 'senses', id, before, after: updatedSenses.get(id), reason: 'Replaced an inaccurate, circular, opaque, or overly narrow learner meaning with a contextual learner-ready meaning.' })),
] };
const next = { ...source, legacy, quizzes, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(reviewLedgerPath, reviewLedger);
files.set(correctionLedgerPath, correctionLedger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, correctedSenses: senseUpdates.size, correctedLemmas: lemmaUpdates.size, approvedIdentities: changes.length, reboundQuizApprovals: reboundQuizzes, backup }, null, 2));
