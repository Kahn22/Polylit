import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { quizEditorialIssues } from '../dist/publication/quiz-authoring.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-25-13';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Batch already exists');
const sourceId = 'sns_zola_surprendre_catch_unawares';
const targetIds = new Set([
  `srf_zola_surpris_surprendre:${sourceId}`,
  `srf_zola_surprendre_surprendre:${sourceId}`,
]);
const rationale = 'Zola writes both « un traître à surprendre » (catch unawares) and « secrets ... d’avoir surpris » (discover unexpectedly); the shared verb sense now explains both constructions. Checked all three question bands for each form.';
const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const index = content.senses.findIndex(sense => sense.id === sourceId);
if (index < 0) throw new Error('Shared sense missing');
const beforeSense = content.senses[index];
const afterSense = { ...beforeSense, gloss: 'to catch unawares; discover unexpectedly', definition: 'Surprendre une personne à l’improviste ou découvrir, entendre quelque chose sans s’y attendre, notamment un secret.' };
content.senses[index] = afterSense;
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const subjects = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary' && subject.language === 'fr').map(subject => [subject.id, subject]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = [];
for (const id of targetIds) {
  const subject = subjects.get(id);
  if (!subject) throw new Error(`Missing affected identity: ${id}`);
  const reviewId = `vocabulary:${id}`, before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', id, { ...subject.value, sense: afterSense }, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId: id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.occurrences.length });
}
const lemmas = new Map(content.lemmas.map(lemma => [lemma.id, lemma]));
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
let reboundQuizApprovals = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !targetIds.has(`${quiz.subject.surfaceFormId}:${quiz.subject.senseId}`)) continue;
  if (quizEditorialIssues(quiz).length) throw new Error(`Question invalid: ${quiz.id}`);
  const surface = surfaces.get(quiz.subject.surfaceFormId), lemma = lemmas.get(surface.lemmaId);
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense: afterSense, lemma } }, 'Codex', '2026-09-25T00:00:00.000Z', rationale));
  reboundQuizApprovals++;
}
const files = new Map(sharedSourceFiles({ ...source, legacy, quizzes, reviews: [...reviews.values()] }));
files.set(reviewLedgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'both observed constructions and exact-version question recheck', changes });
files.set(correctionLedgerPath, { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals, changes: [{ kind: 'senses', id: sourceId, before: beforeSense, after: afterSense, reason: rationale }] });
const backup = adoptSourceFiles(publicationRoot, files, root => { const candidate = loadPublication(root); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); const blocked = auditEditorialQuality(candidate); for (const id of targetIds) if (blocked.some(issue => issue.kind === 'vocabulary' && issue.id === id)) throw new Error(`Still blocked: ${id}`); });
console.log(JSON.stringify({ batchId, reviewedAffectedIdentities: targetIds.size, reboundQuizApprovals, backup }));
