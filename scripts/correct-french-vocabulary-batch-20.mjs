import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { quizEditorialIssues } from '../dist/publication/quiz-authoring.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-25-20';
const reviewPath = `editorial-review-batches/${batchId}.json`;
const correctionPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewPath)) || existsSync(resolve(publicationRoot, correctionPath))) throw new Error('Batch already exists');
const publication = loadPublication();
const subject = editorialSubjects(publication).find(item => item.kind === 'vocabulary' && item.id.startsWith('srf_cendrillon_maraine_'));
if (!subject || !auditEditorialQuality(publication).some(issue => issue.kind === 'vocabulary' && issue.id === subject.id)) throw new Error('Maraine no longer pending');
if (subject.value.occurrences.length !== 15 || !subject.value.contexts.some(unit => unit.french.includes('sa Maraine, qui estoit Fée'))) throw new Error('Source contexts changed');
const senseId = subject.value.sense.id;
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const beforeSense = content.senses.find(sense => sense.id === senseId);
const afterSense = { ...beforeSense, gloss: 'godmother; fairy godmother', definition: 'Marraine d’un enfant ; dans ce conte, la fée marraine qui aide Cendrillon.' };
content.senses = content.senses.map(sense => sense.id === senseId ? afterSense : sense);
const corrections = [{ kind: 'senses', id: senseId, before: beforeSense, after: afterSense, reason: 'Replace a form-label gloss with the fairy godmother meaning attested throughout Cendrillon.' }];
function changeQuestion(band, fields, reason) {
  const old = content.quizItems.find(quiz => quiz.senseId === senseId && quiz.surfaceFormId.startsWith('srf_cendrillon_maraines_') && quiz.band === band);
  if (!old) throw new Error(`Missing historical plural question: ${band}`);
  const next = { ...old, ...fields };
  content.quizItems = content.quizItems.map(quiz => quiz.id === old.id ? next : quiz);
  corrections.push({ kind: 'quizItems', id: old.id, before: old, after: next, reason });
}
changeQuestion('levels_1_3', { contextFrench: 'Ces Maraines accompagnent leurs filleuls pendant la cérémonie.', correctAnswer: 'godmothers', choicesEnglish: ['godmothers', 'aunts', 'teachers', 'sisters'] }, 'Plural form now tests the meaning of godmothers in natural context.');
changeQuestion('levels_4_5', { contextFrench: 'Au baptême, les femmes désignées pour présenter les enfants aux côtés des parrains sont leurs _____.', correctAnswer: 'Maraines', choicesFrench: ['mères', 'tantes', 'Maraines', 'sœurs'] }, 'Four feminine plural nouns fit the grammar; the baptism role selects Maraines.');
changeQuestion('levels_6_8', { contextFrench: 'Lors de la cérémonie, les Maraines présentent les enfants avec les parrains. Leurs parentes attendent à l’entrée.', promptFrench: 'Quel nom désigne les mères spirituelles des enfants ?', correctAnswer: 'Maraines', choicesFrench: ['Maraines', 'enfants', 'parrains', 'parentes'] }, 'The target is identified in a coherent context with three distinct alternatives.');
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const rationale = 'All 15 indexed Cendrillon occurrences name the fairy godmother, including “sa Maraine, qui estoit Fée”. The learner gloss now states the meaning. All three active questions are valid; the three historical plural questions were rewritten with natural contexts and reviewed for answer and agreement. Maraines in the active moral remains separately assigned to its patron sense; no progress is transferred.';
const reviewId = `vocabulary:${subject.id}`, before = reviews.get(reviewId);
const after = approveReview('fr', 'vocabulary', subject.id, { ...subject.value, sense: afterSense }, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
reviews.set(reviewId, after);
const lemma = subject.value.lemma;
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
let reboundQuizApprovals = 0;
for (const quiz of quizzes.filter(item => item.subject.kind === 'vocabulary' && item.subject.senseId === senseId)) {
  if (quizEditorialIssues(quiz).length) throw new Error(`Question invalid: ${quiz.id}`);
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense: afterSense, lemma } }, 'Codex', '2026-09-25T00:00:00.000Z', rationale));
  reboundQuizApprovals++;
}
if (reboundQuizApprovals !== 6) throw new Error(`Expected six current and historical questions, got ${reboundQuizApprovals}`);
const files = new Map(sharedSourceFiles({ ...source, legacy, quizzes, reviews: [...reviews.values()] }));
files.set(reviewPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: 1, approvals: 1, holds: 0, progressTransfers: [], reviewMethod: 'all 15 source contexts and six current/historical question bands', changes: [{ subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: 15 }] });
files.set(correctionPath, { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals, changes: corrections });
adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); if (auditEditorialQuality(candidate).some(issue => issue.kind === 'vocabulary' && issue.id === subject.id)) throw new Error('Maraine still blocked'); });
console.log(JSON.stringify({ batchId, reviewedIdentities: 1, correctedSenses: 1, rewrittenHistoricalQuizzes: 3, reboundQuizApprovals }));
