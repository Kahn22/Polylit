import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { quizEditorialIssues } from '../dist/publication/quiz-authoring.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-25-12';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Batch already applied');
const reasons = new Map([
  ['srf_zola_ecritures_9dd460ce2c2b_ecriture:sns_zola_ecriture_handwriting', 'Both occurrences concern the handwriting examined by investigators or handwriting experts. The plural noun gloss and the three choices in each band distinguish scripts from other plural nouns.'],
  ['srf_zola_discute_discuter:sns_zola_discuter_question', 'In « une vérité qui ne se discute même pas », discute means is questioned or debated; the three existing questions use the matching contestation sense.'],
  ['srf_zola_universelle_universel:sns_zola_universel_general', 'Conscience universelle and Exposition universelle both reach beyond one country or group. Corrected the completion distractors to feminine singular adjectives so grammar alone cannot identify universelle.'],
  ['srf_zola_surpris_surprendre:sns_zola_surprendre_catch_unawares', 'Secrets qu’il ne fait pas bon d’avoir surpris means secrets discovered unexpectedly; replaced a theft scenario and three unrelated contexts with questions about discovering secrets.'],
]);
const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const active = new Set(auditEditorialQuality(publication).filter(issue => issue.kind === 'vocabulary' && issue.language === 'fr').map(issue => issue.id));
for (const id of reasons.keys()) if (!active.has(id)) throw new Error(`Expected pending identity: ${id}`);
const corrections = [];
function update(kind, id, fields, reason) {
  const index = content[kind].findIndex(value => value.id === id);
  if (index < 0) throw new Error(`Missing ${kind}:${id}`);
  const before = content[kind][index], after = { ...before, ...fields };
  content[kind][index] = after;
  corrections.push({ kind, id, before, after, reason });
}
update('senses', 'sns_zola_surprendre_catch_unawares', { gloss: 'to discover unexpectedly; overhear', definition: 'Découvrir, entendre ou saisir quelque chose à l’improviste, notamment un secret.' }, reasons.get('srf_zola_surpris_surprendre:sns_zola_surprendre_catch_unawares'));
for (const q of content.quizItems.filter(q => q.surfaceFormId === 'srf_zola_surpris_surprendre')) {
  if (q.band === 'levels_1_3') update('quizItems', q.id, { contextFrench: 'Il est des secrets qu’il ne fait pas bon d’avoir surpris.', targetText: 'surpris', correctAnswer: 'discovered unexpectedly', choicesEnglish: ['revealed publicly', 'discovered unexpectedly', 'forgotten', 'concealed'] }, 'A Zola-based sentence tests encountering a secret unexpectedly.');
  if (q.band === 'levels_4_5') update('quizItems', q.id, { contextFrench: 'Il avait appris ces secrets par hasard et les avait gardés pour lui ; ce sont des secrets qu’il ne fait pas bon d’avoir _____.', correctAnswer: 'surpris', choicesFrench: ['surpris', 'dévoilés', 'écrits', 'oubliés'] }, 'Plural participle options fit the grammar; context selects unexpectedly discovered secrets.');
  if (q.band === 'levels_6_8') update('quizItems', q.id, { contextFrench: 'On examinait les écritures ; il est des secrets qu’il ne fait pas bon d’avoir surpris.', promptFrench: 'Quel mot indique que ces secrets ont été découverts à l’improviste ?', correctAnswer: 'surpris', choicesFrench: ['écritures', 'secrets', 'surpris', 'examinait'] }, 'The target is selected from a Zola-based context.');
}
for (const q of content.quizItems.filter(q => q.surfaceFormId === 'srf_zola_universelle_universel' && q.band === 'levels_4_5')) update('quizItems', q.id, { choicesFrench: ['locale', 'limitée', 'particulière', 'universelle'] }, 'Every unchanged feminine singular adjective fits the grammatical frame; only universal means applicable to all.');
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const lemmas = new Map(content.lemmas.map(value => [value.id, value]));
const senses = new Map(content.senses.map(value => [value.id, value]));
const surfaces = new Map(content.surfaceForms.map(value => [value.id, value]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary' && subject.language === 'fr').map(subject => [subject.id, subject]));
const changes = [];
for (const [subjectId, rationale] of reasons) {
  const subject = subjects.get(subjectId);
  if (!subject) throw new Error(`Missing subject:${subjectId}`);
  const value = { ...subject.value, sense: senses.get(subject.value.sense.id) };
  const reviewId = `vocabulary:${subjectId}`, before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subjectId, value, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length });
}
let reboundQuizApprovals = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !reasons.has(`${quiz.subject.surfaceFormId}:${quiz.subject.senseId}`)) continue;
  if (quizEditorialIssues(quiz).length) throw new Error(`Question invalid: ${quiz.id}`);
  const surface = surfaces.get(quiz.subject.surfaceFormId), sense = senses.get(quiz.subject.senseId), lemma = lemmas.get(surface.lemmaId);
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma } }, 'Codex', '2026-09-25T00:00:00.000Z', reasons.get(`${quiz.subject.surfaceFormId}:${quiz.subject.senseId}`)));
  reboundQuizApprovals++;
}
const files = new Map(sharedSourceFiles({ ...source, legacy, quizzes, reviews: [...reviews.values()] }));
files.set(reviewLedgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'source-context check and individually rechecked question bands', changes });
files.set(correctionLedgerPath, { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals, changes: corrections });
const backup = adoptSourceFiles(publicationRoot, files, root => { const candidate = loadPublication(root); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); const blocked = auditEditorialQuality(candidate); for (const id of reasons.keys()) if (blocked.some(issue => issue.kind === 'vocabulary' && issue.id === id)) throw new Error(`Still blocked: ${id}`); });
console.log(JSON.stringify({ batchId, reviewedIdentities: changes.length, changedQuestions: 4, correctedSenses: 1, reboundQuizApprovals, backup }));
