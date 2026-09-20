import type { ContentBundle } from "./model.js";
import { vocabularyIdentityKey } from "./model.js";
import { validateContentBundle } from "./validate.js";

export interface LearnerVocabularyIdentity {
  surfaceFormId: string;
  senseId: string;
}

/** Vocabulary publication is derived rather than stored. */
export function isVocabularyIdentityLearnerPublished(
  bundle: ContentBundle,
  surfaceFormId: string,
  senseId: string,
): boolean {
  const surface = bundle.surfaceForms.find((item) => item.id === surfaceFormId);
  const sense = bundle.senses.find((item) => item.id === senseId);
  const preparedBands = new Set(bundle.quizItems
    .filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === senseId)
    .map((quiz) => quiz.band));
  return Boolean(
    surface
    && sense
    && surface.lemmaId === sense.lemmaId
    && preparedBands.size === 3,
  );
}

/** Returns automatically published identities only from a learner-safe work. */
export function learnerVocabularyForWork(bundle: ContentBundle, workId: string): LearnerVocabularyIdentity[] {
  const validation = validateContentBundle(bundle);
  if (!validation.ok) throw new Error(`Cannot expose invalid content: ${validation.diagnostics[0]?.code ?? "unknown"}`);
  const work = bundle.works.find((item) => item.id === workId);
  if (!work || !["learning_ready", "published"].includes(work.publicationState)) return [];

  const preparedBandsByIdentity = new Map<string, Set<string>>();
  for (const quiz of bundle.quizItems) {
    const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
    const bands = preparedBandsByIdentity.get(key) ?? new Set<string>();
    bands.add(quiz.band);
    preparedBandsByIdentity.set(key, bands);
  }
  const learnerPublished = new Set(
    [...preparedBandsByIdentity.entries()]
      .filter(([, bands]) => bands.size === 3)
      .map(([key]) => key),
  );
  const identities = new Map<string, LearnerVocabularyIdentity>();
  for (const occurrence of bundle.occurrences.filter((item) => item.workId === workId)) {
    const key = vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId);
    if (!learnerPublished.has(key)) continue;
    const identity = { surfaceFormId: occurrence.surfaceFormId, senseId: occurrence.senseId };
    identities.set(key, identity);
  }
  return [...identities.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, identity]) => identity);
}
