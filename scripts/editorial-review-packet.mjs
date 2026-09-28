import { writeFileSync } from 'node:fs';
import { loadPublication, validatePublication } from '../dist/publication/repository.js';
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from '../dist/publication/quality-audit.js';
import { revision } from '../dist/publication/revisions.js';

const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const outputIndex = args.indexOf('--output');
const limit = limitIndex < 0 ? 10 : Number(args[limitIndex + 1]);
if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20) throw new Error('Family limit must be 1–20');
const output = outputIndex < 0 ? 'docs/EDITORIAL_NEXT_PACKET.json' : args[outputIndex + 1];
if (!output || output.startsWith('/') || output.includes('..')) throw new Error('Output must be a relative path inside the project');

const publication = loadPublication();
validatePublication(publication.bundle, publication.expressionCatalog, publication.registry);
const issues = auditEditorialQuality(publication).filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary');
const allSubjects = editorialSubjects(publication);
const vocabulary = allSubjects.filter(subject => subject.kind === 'vocabulary' && subject.language === 'fr');
const activeQuizIds = new Set(allSubjects.filter(subject => subject.kind === 'quiz').map(subject => subject.id));
const reviews = new Map(publication.reviews.map(review => [review.id, review]));
const duplicates = duplicateCandidates(publication).filter(group => group.language === 'fr');
const issueById = new Map(issues.map(issue => [issue.id, issue]));
const quizzesByIdentity = new Map();
for (const quiz of publication.preparedQuizzes.values()) {
  if (quiz.language !== 'fr' || quiz.subject.kind !== 'vocabulary') continue;
  const id = `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}`;
  const group = quizzesByIdentity.get(id) ?? [];
  group.push(quiz); quizzesByIdentity.set(id, group);
}
const bySense = new Map();
for (const subject of vocabulary) {
  const group = bySense.get(subject.value.sense.id) ?? [];
  group.push(subject); bySense.set(subject.value.sense.id, group);
}
const groups = [...bySense].map(([senseId, subjects]) => {
  const pending = subjects.filter(subject => issueById.has(subject.id));
  if (!pending.length) return null;
  const collision = subjects.some(subject => duplicates.some(candidate => candidate.lemmaIds.includes(subject.value.lemma.id)));
  // Triage suggests likely work only; it cannot assert semantic correctness.
  const lane = collision ? 'identity_candidates' : subjects.length > 1 ? 'shared_sense' : 'focused_review';
  return { senseId, subjects, pending, lane, firstPendingId: pending.map(subject => subject.id).sort()[0] };
}).filter(Boolean);
const laneRank = { focused_review: 0, shared_sense: 1, identity_candidates: 2 };
groups.sort((a, b) => laneRank[a.lane] - laneRank[b.lane] || a.pending.length - b.pending.length || a.firstPendingId.localeCompare(b.firstPendingId, 'en'));

function evidence(subject) {
  const value = subject.value;
  const contexts = new Map(value.contexts.map(unit => [unit.id, unit]));
  const quizzes = (quizzesByIdentity.get(subject.id) ?? []).map(quiz => ({
    id: quiz.id, active: activeQuizIds.has(quiz.id),
    band: quiz.band, format: quiz.format, context: quiz.context, prompt: quiz.prompt, targetText: quiz.targetText ?? null,
    choices: quiz.choices.map(choice => ({ text: choice.text, correct: choice.id === quiz.correctChoiceId })),
    approval: reviews.get(`quiz:${quiz.id}`)?.status ?? 'missing',
  }));
  const matches = duplicates.filter(group => group.lemmaIds.includes(value.lemma.id)).map(group => ({ headword: group.headword, lemmaIds: group.lemmaIds, entries: group.entries }));
  const review = reviews.get(`vocabulary:${subject.id}`);
  return {
    identity: subject.id, revision: revision('rev', value), issues: issueById.get(subject.id)?.issues ?? [],
    previousReview: review ? { status: review.status, reason: review.reason, subjectRevision: review.subjectRevision } : null,
    lemma: value.lemma, surface: value.surface, sense: value.sense,
    occurrences: value.occurrences.map(occurrence => {
      const unit = contexts.get(occurrence.unitId);
      if (!unit || unit.french.slice(occurrence.start, occurrence.end).toLocaleLowerCase('fr') !== value.surface.form.toLocaleLowerCase('fr')) throw new Error(`Occurrence span mismatch: ${occurrence.id}`);
      return { ...occurrence, passage: unit.french, markedSpan: [occurrence.start, occurrence.end], textRevision: unit.textRevision };
    }),
    quizzes, sameHeadwordCandidates: matches,
  };
}
const families = groups.slice(0, limit).map(group => {
  const identities = group.subjects.sort((a, b) => a.id.localeCompare(b.id, 'en')).map(evidence);
  const activeSurfaceIds = new Set(identities.map(item => item.surface.id));
  const historicalDependentQuizzes = [...publication.preparedQuizzes.values()].filter(quiz => quiz.language === 'fr' && quiz.subject.kind === 'vocabulary' && quiz.subject.senseId === group.senseId && !activeSurfaceIds.has(quiz.subject.surfaceFormId)).map(quiz => ({
    id: quiz.id, surfaceFormId: quiz.subject.surfaceFormId, band: quiz.band,
    context: quiz.context, prompt: quiz.prompt,
    choices: quiz.choices.map(choice => ({ text: choice.text, correct: choice.id === quiz.correctChoiceId })),
  }));
  return {
    senseId: group.senseId, lane: group.lane,
    laneNote: 'Mechanical work estimate only; verify every occurrence and question before approval.',
    pendingIdentityIds: group.pending.map(subject => subject.id).sort(),
    affectedIdentityIds: identities.map(item => item.identity),
    affectedQuizIds: [...identities.flatMap(item => item.quizzes.map(quiz => quiz.id)), ...historicalDependentQuizzes.map(quiz => quiz.id)].sort(),
    historicalDependentQuizzes,
    identities,
  };
});
const packet = {
  version: 2, generatedAt: new Date().toISOString(),
  purpose: 'Complete shared-sense evidence and mechanical triage; generation never approves a record',
  pendingFrenchVocabulary: issues.length, pendingFamilies: groups.length,
  selectedFamilies: families.length,
  selectedPendingIdentities: families.reduce((sum, family) => sum + family.pendingIdentityIds.length, 0),
  families,
};
writeFileSync(output, JSON.stringify(packet, null, 2) + '\n');
console.log(JSON.stringify({ output, pendingFrenchVocabulary: issues.length, pendingFamilies: groups.length, selectedFamilies: families.length, firstFamily: families[0]?.senseId ?? null }));
