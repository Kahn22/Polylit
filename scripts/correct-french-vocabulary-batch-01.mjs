import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-24-01';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_brouter_primary', { gloss: 'to graze; browse', definition: 'Manger de l’herbe ou de jeunes pousses directement sur les plantes.' }],
  ['sns_but_primary', { gloss: 'goal; purpose', definition: 'Objectif que l’on cherche à atteindre ou intention qui motive une action.' }],
  ['sns_carriere_primary', { gloss: 'course; track; riding arena', definition: 'Terrain ou piste aménagée où se déroule une course ou un exercice équestre.' }],
  ['sns_cendrillon_amoureux_qui_aime_d_amour_04366087fe', { gloss: 'in love', definition: 'Qui éprouve un sentiment d’amour pour une personne.' }],
  ['sns_cendrillon_baguette_petit_baton_mince_plus_ou_moins_long_et_flexible_5d188d4ca9', { gloss: 'wand', definition: 'Petit bâton magique dont une fée ou un magicien se sert pour accomplir un enchantement.' }],
  ['sns_cendrillon_cheminee_construction_abritant_un_atre_ou_l_on_fait_du_feu_et_comportant_un_conduit_pour_donner_issue_a_la_fumee_5f304a43c2', { gloss: 'fireplace; chimney', definition: 'Construction comprenant un foyer où l’on fait du feu et un conduit qui évacue la fumée.' }],
  ['sns_cendrillon_coiffeuse_artisane_salariee_ou_meme_jadis_employee_de_maison_dont_le_metier_est_de_couper_et_coiffer_les_cheveux_c6556929b6', { gloss: 'hairdresser', definition: 'Personne dont le métier est de couper ou d’arranger les cheveux.' }],
  ['sns_cendrillon_coiffure_maniere_dont_on_arrange_les_cheveux_selon_le_pays_et_la_mode_8b6f84f977', { gloss: 'hairstyle', definition: 'Manière dont les cheveux sont arrangés selon le goût ou la mode.' }],
  ['sns_cendrillon_collation_repas_leger_que_les_catholiques_font_les_jours_de_jeune_pour_remplacer_le_souper_et_par_extension_un_repas_leger_pris_au_cours_de_la_journee_ccf386d9fe', { gloss: 'light meal; snack', definition: 'Repas léger pris au cours de la journée ou servi entre les repas principaux.' }],
  ['sns_cendrillon_croire_tenir_pour_veritable_36281025b7', { gloss: 'to believe; think', definition: 'Tenir une personne, une chose ou une proposition pour vraie.' }],
  ['sns_cendrillon_forme_aspect_exterieur_configuration_caracteristique_ou_particuliere_d_une_chose_b1bed43ef5', { gloss: 'shape; form', definition: 'Aspect extérieur ou configuration caractéristique d’une chose.' }],
  ['sns_cendrillon_garniture_ce_qui_est_mis_a_une_chose_pour_la_garnir_la_completer_l_orner_l_embellir_53005b6937', { gloss: 'decorative trim; embellishment', definition: 'Élément ajouté à un vêtement ou à un objet pour le compléter ou l’orner.' }],
  ['sns_cendrillon_habit_tout_ce_qui_est_fait_pour_couvrir_le_corps_excepte_le_linge_la_coiffure_et_la_chaussure_35c5cc2f5e', { gloss: 'clothing; garment', definition: 'Pièce ou ensemble de pièces portées pour couvrir le corps.' }],
  ['sns_cendrillon_helas_marque_l_affliction_le_regret_ou_la_deception_exprime_une_plainte_be548ab058', { gloss: 'alas', definition: 'Interjection qui exprime l’affliction, le regret ou la déception.' }],
  ['sns_cendrillon_legerement_d_une_maniere_legere_non_pesante_98a68504b3', { gloss: 'lightly; nimbly', definition: 'D’une manière légère, agile et peu pesante, notamment dans un mouvement.' }],
]);
const lemmaUpdates = new Map([
  ['lem_carriere', { headword: 'carrière' }],
]);

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

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'vocabulary', sequence: 1, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'controlled correction of learner glosses and definitions followed by contextual re-review with stable identity IDs', changes };
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
