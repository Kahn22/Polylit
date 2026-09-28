import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-25-17';
const reviewPath = `editorial-review-batches/${batchId}.json`;
const correctionPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewPath)) || existsSync(resolve(publicationRoot, correctionPath))) throw new Error('Correction batch already exists');
const updates = new Map([
  ['sns_parure_nipper_fournir_de_nippes_88f7738218', { gloss: 'dressed; clothed', definition: 'Habillé de certains vêtements ; ici, mieux vêtu pour assister à une fête.' }],
]);
const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const beforeSenses = new Map(content.senses.filter(sense => updates.has(sense.id)).map(sense => [sense.id, sense]));
if (beforeSenses.size !== updates.size) throw new Error('Correction senses changed');
content.senses = content.senses.map(sense => updates.has(sense.id) ? { ...sense, ...updates.get(sense.id) } : sense);
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const senses = new Map(content.senses.map(sense => [sense.id, sense]));
const lemmas = new Map(content.lemmas.map(lemma => [lemma.id, lemma]));
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && updates.has(subject.value.sense.id));
if (subjects.length !== 1) throw new Error(`Expected one identity, found ${subjects.length}`);
const changes = subjects.map(subject => {
  const value = subject.value;
  const rationale = 'La Parure contrasts the speaker’s lack of suitable clothes with a better-dressed colleague. The three questions test being dressed and feminine participle agreement; the old gloss described a form instead of its meaning.';
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, { ...value, sense: senses.get(value.sense.id) }, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length };
});
let reboundQuizApprovals = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !updates.has(quiz.subject.senseId)) continue;
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  const sense = senses.get(quiz.subject.senseId);
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma: lemmas.get(surface.lemmaId) } }, 'Codex', '2026-09-25T00:00:00.000Z', 'Rechecked the contextual meaning, correct choice, answer alternatives, and grammar after clarifying the gloss; all three authored bands still fit.'));
  reboundQuizApprovals++;
}
if (reboundQuizApprovals !== 3) throw new Error(`Expected three dependent questions, found ${reboundQuizApprovals}`);
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', sequence: 17, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'individual source passage and dependent question review', changes };
const corrections = { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals, changes: [...beforeSenses].map(([id, before]) => ({ kind: 'senses', id, before, after: senses.get(id), reason: 'Replace historical-form gloss with a learner-facing contextual meaning without changing identity or occurrences.' })) };
const files = new Map(sharedSourceFiles({ ...source, legacy, quizzes, reviews: [...reviews.values()] }));
files.set(reviewPath, ledger);
files.set(correctionPath, corrections);
adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, correctedSenses: 1, reviewedIdentities: 1, reboundQuizApprovals }, null, 2));
