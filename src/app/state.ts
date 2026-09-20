export { clampMastery } from "../learner/scheduler.js";
export { vocabularyIdentityKey as vocabularyKey } from "../domain/runtime.js";

export const libraryStatuses = ["available", "reading", "completed"] as const;
export type LibraryStatus = (typeof libraryStatuses)[number];
export type ReadingLibraryState = Record<string, LibraryStatus>;

export function parseReadingLibraryState(input: unknown): ReadingLibraryState {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const allowed = new Set<string>(libraryStatuses);
  return Object.fromEntries(Object.entries(input).filter((entry): entry is [string, LibraryStatus] => allowed.has(String(entry[1]))));
}

export function libraryStatusFor(state: ReadingLibraryState, workId: string): LibraryStatus {
  return state[workId] ?? "available";
}

export function withLibraryStatus(state: ReadingLibraryState, workId: string, status: LibraryStatus): ReadingLibraryState {
  return { ...state, [workId]: status };
}

export function isQuizEligibleLibraryStatus(status: LibraryStatus): boolean {
  return status === "reading" || status === "completed";
}

export function shouldUnderlineVocabulary(masteryLevel: number): boolean {
  return masteryLevel < 4;
}

/** Stable presentation order prevents the authored correct-first convention leaking into the UI. */
export function orderedChoices<T>(choices: T[], quizId: string): T[] {
  if (choices.length < 2) return [...choices];
  const rotation = [...quizId].reduce((total, character) => total + character.codePointAt(0)!, 0) % choices.length;
  return [...choices.slice(rotation), ...choices.slice(0, rotation)];
}
