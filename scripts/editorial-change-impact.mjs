import { writeFileSync } from 'node:fs';
import { loadPublication, validatePublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { revision } from '../dist/publication/revisions.js';

const args = process.argv.slice(2);
const senseId = args[args.indexOf('--sense') + 1];
const outputIndex = args.indexOf('--output');
const output = outputIndex < 0 ? 'docs/EDITORIAL_IMPACT.json' : args[outputIndex + 1];
if (!senseId || !/^sns_[a-z0-9_]+$/.test(senseId)) throw new Error('Use --sense <existing-sense-id>');
if (!output || output.startsWith('/') || output.includes('..')) throw new Error('Output must be a relative path inside the project');

const publication = loadPublication();
validatePublication(publication.bundle, publication.expressionCatalog, publication.registry);
const sense = publication.bundle.senses.find(item => item.id === senseId);
if (!sense) throw new Error(`Unknown sense: ${senseId}`);
const subjects = editorialSubjects(publication);
const activeQuizIds = new Set(subjects.filter(subject => subject.kind === 'quiz').map(subject => subject.id));
const reviews = new Map(publication.reviews.map(review => [review.id, review]));
const identities = subjects.filter(subject => subject.kind === 'vocabulary' && subject.value.sense.id === senseId).map(subject => {
  const value = subject.value;
  const quizzes = [...publication.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === 'vocabulary' && quiz.subject.senseId === senseId && quiz.subject.surfaceFormId === value.surface.id).map(quiz => ({
    id: quiz.id, active: activeQuizIds.has(quiz.id), band: quiz.band,
    approval: reviews.get(`quiz:${quiz.id}`)?.status ?? 'missing',
    context: quiz.context, prompt: quiz.prompt,
    choices: quiz.choices.map(choice => ({ text: choice.text, correct: choice.id === quiz.correctChoiceId })),
  }));
  return {
    id: subject.id, surface: value.surface.form, lemma: value.lemma.headword,
    currentRevision: revision('rev', value), approval: reviews.get(`vocabulary:${subject.id}`)?.status ?? 'missing',
    occurrences: value.occurrences.map(occurrence => ({
      id: occurrence.id, workId: occurrence.workId, unitId: occurrence.unitId,
      passage: value.contexts.find(unit => unit.id === occurrence.unitId)?.french,
      span: [occurrence.start, occurrence.end],
    })), quizzes,
  };
}).sort((a, b) => a.id.localeCompare(b.id, 'en'));
if (!identities.length) throw new Error(`No active identity uses sense ${senseId}`);
const activeSurfaceIds = new Set(subjects.filter(subject => subject.kind === 'vocabulary' && subject.value.sense.id === senseId).map(subject => subject.value.surface.id));
const historicalDependentQuizzes = [...publication.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === 'vocabulary' && quiz.subject.senseId === senseId && !activeSurfaceIds.has(quiz.subject.surfaceFormId)).map(quiz => ({
  id: quiz.id, surfaceFormId: quiz.subject.surfaceFormId, band: quiz.band,
  context: quiz.context, prompt: quiz.prompt,
  choices: quiz.choices.map(choice => ({ text: choice.text, correct: choice.id === quiz.correctChoiceId })),
}));
const affectedQuizIds = [...identities.flatMap(identity => identity.quizzes.map(quiz => quiz.id)), ...historicalDependentQuizzes.map(quiz => quiz.id)];
const report = {
  version: 1, generatedAt: new Date().toISOString(), sense,
  changeType: 'proposed sense edit only; no mutation or approval performed',
  impact: {
    activeIdentityCount: identities.length,
    occurrenceCount: identities.reduce((sum, identity) => sum + identity.occurrences.length, 0),
    activeQuizCount: identities.reduce((sum, identity) => sum + identity.quizzes.filter(quiz => quiz.active).length, 0),
    historicalQuizCount: identities.reduce((sum, identity) => sum + identity.quizzes.filter(quiz => !quiz.active).length, 0) + historicalDependentQuizzes.length,
    affectedQuizIds,
    note: 'Editing this shared sense changes the exact revision of every listed identity and quiz target. Re-review their passages and answer choices before rebinding approvals. If a use has a distinct meaning, apply the documented fresh-on-view identity policy instead of relabeling its old mastery.',
  }, identities, historicalDependentQuizzes,
};
writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ output, senseId, ...Object.fromEntries(Object.entries(report.impact).filter(([key]) => key.endsWith('Count'))) }));
