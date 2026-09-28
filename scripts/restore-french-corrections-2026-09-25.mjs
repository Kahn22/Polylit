import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects, auditEditorialQuality } from '../dist/publication/quality-audit.js';
import { quizEditorialIssues } from '../dist/publication/quiz-authoring.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-checkpoint-30-recovery-corrections-2026-09-25';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Recovery correction batch already applied');

// These changes reproduce the post-checkpoint editorial decisions whose source
// contexts and target identities are still present in the saved checkpoint.
const senseUpdates = new Map([
  ['sns_loup_agneau_raison_argument_presente_comme_juste_ou_fonde_2637035b0d', { gloss: 'reason; rationale', definition: 'Motif ou justification invoqué pour expliquer ou défendre une action ; dans la fable, le pouvoir détermine ce qui passe pour la meilleure raison.' }],
  ['sns_parure_appeler_designer_quelqu_un_par_son_nom_pourvoir_quelqu_un_d_un_nom_0465c32577', { gloss: 'to call; name', definition: 'Désigner quelqu’un par un nom ou l’appeler d’une certaine façon, comme « Cucendron » ou « Cendrillon ».' }],
  ['sns_zola_garde_official', { gloss: 'Keeper of the Seals; keeper', definition: 'Dans « garde des sceaux », titre du ministre de la Justice ; ailleurs, personne chargée officiellement de garder quelque chose.' }],
  ['sns_zola_endormir_sleep', { gloss: 'asleep; fallen asleep', definition: 'Qui dort ou qui vient de s’endormir ; « accusé endormi » désigne ici l’accusé pendant son sommeil.' }],
  ['sns_zola_laisser_allow', { gloss: 'to leave; let; allow; be taken in', definition: 'Permettre une action ou laisser quelque chose dans un état ; « se laisser prendre » signifie tomber dans un piège ou être trompé.' }],
]);
const lemmaUpdates = new Map([
  ['lem_zola_secret_noun', { headword: 'secret' }],
  ['lem_zola_armer', { headword: 'armé' }],
]);
const reviewedIds = new Set([
  'srf_raison:sns_loup_agneau_raison_argument_presente_comme_juste_ou_fonde_2637035b0d',
  'srf_parure_appelee_lem_zola_appeler_0ee349bdc4:sns_parure_appeler_designer_quelqu_un_par_son_nom_pourvoir_quelqu_un_d_un_nom_0465c32577',
  'srf_cendrillon_appeloit_lem_zola_appeler_c5c8c2b407:sns_parure_appeler_designer_quelqu_un_par_son_nom_pourvoir_quelqu_un_d_un_nom_0465c32577',
  'srf_zola_garde_garde:sns_zola_garde_official',
  'srf_zola_secrets_secret_noun:sns_zola_secret_noun',
  'srf_zola_joli_joli:sns_zola_joli_fine_ironic',
  'srf_zola_aura_avoir:sns_zola_avoir_possess_auxiliary',
  'srf_zola_endormi_endormir:sns_zola_endormir_sleep',
  'srf_zola_laisse_bdbd2ad91cf3_laisser:sns_zola_laisser_allow',
  'srf_zola_laisser_laisser:sns_zola_laisser_allow',
  'srf_zola_arme_8c5fe48540d9_armer:sns_zola_arme_equipped',
]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const pending = new Set(auditEditorialQuality(publication).filter(issue => issue.kind === 'vocabulary' && issue.language === 'fr').map(issue => issue.id));
// A shared sense can affect an identity approved before this correction.
if (![...reviewedIds].some(id => pending.has(id))) throw new Error('No pending identity in recovery batch');
const corrections = [];
function updateRecord(kind, id, fields, reason) {
  const index = content[kind].findIndex(value => value.id === id);
  if (index < 0) throw new Error(`Missing ${kind} record: ${id}`);
  const before = content[kind][index];
  const after = { ...before, ...fields };
  content[kind][index] = after;
  corrections.push({ kind, id, before, after, reason });
}
for (const [id, fields] of senseUpdates) updateRecord('senses', id, fields, 'Clarified the learner meaning against every indexed source passage.');
for (const [id, fields] of lemmaUpdates) updateRecord('lemmas', id, fields, 'Corrected the headword spelling or part-of-speech label without changing the stable identity.');

const authored = new Map();
function rewrite(id, fields) { authored.set(id, fields); updateRecord('quizItems', id, fields, 'Reauthored against the actual work and checked all four answer choices.'); }
const reasonId = content.quizItems.find(q => q.surfaceFormId === 'srf_raison' && q.senseId === 'sns_loup_agneau_raison_argument_presente_comme_juste_ou_fonde_2637035b0d' && q.band === 'levels_1_3')?.id;
if (!reasonId) throw new Error('Reason question missing');
rewrite(reasonId, { correctAnswer: 'reason', choicesEnglish: ['joke', 'insult', 'reason', 'order'] });
for (const quiz of content.quizItems.filter(q => q.surfaceFormId === 'srf_parure_appelee_lem_zola_appeler_0ee349bdc4')) {
  if (quiz.band === 'levels_1_3') rewrite(quiz.id, { contextFrench: 'L’autre s’étonnait d’être appelée ainsi familièrement par cette bourgeoise.', targetText: 'appelée', correctAnswer: 'called', choicesEnglish: ['thanked', 'hired', 'called', 'followed'] });
  if (quiz.band === 'levels_4_5') rewrite(quiz.id, { contextFrench: 'L’autre s’étonnait d’être _____ ainsi familièrement par cette bourgeoise.', correctAnswer: 'appelée', choicesFrench: ['appelée', 'grondée', 'invitée', 'renvoyée'] });
  if (quiz.band === 'levels_6_8') rewrite(quiz.id, { contextFrench: 'L’autre ne la reconnaissait point et s’étonnait d’être appelée ainsi familièrement par cette bourgeoise.', promptFrench: 'Quel mot signifie que cette femme s’adresse à l’autre par son nom ?', correctAnswer: 'appelée', choicesFrench: ['reconnaissait', 's’étonnait', 'appelée', 'familièrement'] });
}
for (const quiz of content.quizItems.filter(q => q.surfaceFormId === 'srf_cendrillon_appeloit_lem_zola_appeler_c5c8c2b407')) {
  if (quiz.band === 'levels_1_3') rewrite(quiz.id, { contextFrench: 'On l’appeloit communément dans le logis Cucendron.', targetText: 'appeloit', correctAnswer: 'called', choicesEnglish: ['feared', 'called', 'followed', 'helped'] });
  if (quiz.band === 'levels_4_5') rewrite(quiz.id, { contextFrench: 'Dans le logis, on l’_____ communément Cucendron.', correctAnswer: 'appeloit', choicesFrench: ['grondoit', 'appeloit', 'louoit', 'regardoit'] });
  if (quiz.band === 'levels_6_8') rewrite(quiz.id, { contextFrench: 'Elle s’asseyait dans les cendres, ce qui faisait qu’on l’appeloit communément dans le logis Cucendron.', promptFrench: 'Quel mot indique le nom qu’on lui donnait ?', correctAnswer: 'appeloit', choicesFrench: ['cendres', 'faisait', 'appeloit', 'logis'] });
}
for (const quiz of content.quizItems.filter(q => q.surfaceFormId === 'srf_zola_aura_avoir')) {
  if (quiz.band === 'levels_1_3') rewrite(quiz.id, { contextFrench: 'Une enquête loyale aura établi nettement ses actes.', targetText: 'aura', correctAnswer: 'will have (auxiliary)', choicesEnglish: ['will have (auxiliary)', 'would have', 'had', 'has now'] });
  if (quiz.band === 'levels_4_5') rewrite(quiz.id, { contextFrench: 'On ne connaîtra la vérité que lorsqu’une enquête loyale _____ établi nettement ses actes.', correctAnswer: 'aura', choicesFrench: ['avait', 'aura', 'aurait', 'a'] });
  if (quiz.band === 'levels_6_8') rewrite(quiz.id, { contextFrench: 'On ne la connaîtra que lorsqu’une enquête loyale aura établi nettement ses actes.', promptFrench: 'Quel mot sert d’auxiliaire au futur antérieur du verbe établir ?', correctAnswer: 'aura', choicesFrench: ['connaîtra', 'enquête', 'aura', 'établi'] });
}
for (const quiz of content.quizItems.filter(q => q.surfaceFormId === 'srf_zola_joli_joli' && q.band === 'levels_4_5')) rewrite(quiz.id, { contextFrench: 'Le _____ de l’histoire, c’est qu’il était justement antisémite.', correctAnswer: 'joli', choicesFrench: ['lieu', 'début', 'personnage', 'joli'] });

const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const updatedSenses = new Map(content.senses.map(value => [value.id, value]));
const updatedLemmas = new Map(content.lemmas.map(value => [value.id, value]));
const surfaces = new Map(content.surfaceForms.map(value => [value.id, value]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && reviewedIds.has(subject.id));
if (subjects.length !== reviewedIds.size) throw new Error(`Expected ${reviewedIds.size} subjects; found ${subjects.length}`);
const activeQuizIds = new Set(editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'quiz').map(subject => subject.id));
const rationale = 'Rechecked the indexed source passage, learner meaning, stable identity, and the three authored question bands after the documented correction.';
const changes = subjects.map(subject => {
  const value = subject.value;
  const revised = { ...value, lemma: updatedLemmas.get(value.lemma.id), sense: updatedSenses.get(value.sense.id) };
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, revised, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length };
});
let reboundQuizzes = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary') continue;
  const key = `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}`;
  if (!reviewedIds.has(key) && !senseUpdates.has(quiz.subject.senseId) && !lemmaUpdates.has(surfaces.get(quiz.subject.surfaceFormId)?.lemmaId)) continue;
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  const sense = updatedSenses.get(quiz.subject.senseId);
  const lemma = updatedLemmas.get(surface?.lemmaId);
  if (!surface || !sense || !lemma) throw new Error(`Missing dependent quiz target: ${quiz.id}`);
  if (quizEditorialIssues(quiz).length) {
    if (activeQuizIds.has(quiz.id)) throw new Error(`Invalid active dependent quiz: ${quiz.id}`);
    continue; // Historical questions are retained but do not enter learner delivery.
  }
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma } }, 'Codex', '2026-09-25T00:00:00.000Z', rationale));
  reboundQuizzes++;
}
const next = { ...source, legacy, quizzes, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(reviewLedgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'contextual correction and question reauthoring recovered from documented post-checkpoint decisions', changes });
files.set(correctionLedgerPath, { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals: reboundQuizzes, changes: corrections });
const backup = adoptSourceFiles(publicationRoot, files, root => { const candidate = loadPublication(root); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); const blocked = new Set(auditEditorialQuality(candidate).map(issue => issue.id)); for (const id of reviewedIds) if (blocked.has(id)) throw new Error(`Still blocked: ${id}`); });
console.log(JSON.stringify({ batchId, correctedSenses: senseUpdates.size, correctedLemmas: lemmaUpdates.size, rewrittenQuestions: authored.size, reviewedIdentities: changes.length, reboundQuizApprovals: reboundQuizzes, backup }, null, 2));
