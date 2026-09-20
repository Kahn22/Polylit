import { MASTERY_LEVELS, type MasteryLevel } from "../domain/runtime.js";
export type ReviewObligation = "scheduled" | "accelerated";

export interface VocabularyLearnerState {
  masteryLevel: MasteryLevel;
  nextDueAt: string;
  obligation: ReviewObligation;
  revision: number;
}

export type VocabularyLearnerStateRecord = Record<string, VocabularyLearnerState>;

export interface ReviewClaim {
  vocabularyIdentity: string;
  expectedRevision: number;
  dueAt: string;
  obligation: ReviewObligation;
}

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const ACCELERATED_CAP = 7 * DAY;

const fixedIntervals: Partial<Record<MasteryLevel, number>> = {
  1: 10 * MINUTE,
  2: DAY,
  3: 3 * DAY,
  4: 7 * DAY,
  5: 21 * DAY,
  6: 60 * DAY,
};

function validDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function addCalendarMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const originalDay = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(originalDay, lastDay));
  return result;
}

/** Level 7 and 8 use calendar intervals; the other levels use elapsed durations. */
export function dueAfterLevel(level: MasteryLevel, anchor: Date): Date {
  if (!Number.isFinite(anchor.getTime())) throw new Error("A valid scheduling anchor is required");
  if (level === 7) return addCalendarMonths(anchor, 6);
  if (level === 8) return addCalendarMonths(anchor, 12);
  return new Date(anchor.getTime() + fixedIntervals[level]!);
}

export function clampMastery(value: number): MasteryLevel {
  return Math.max(1, Math.min(8, Math.trunc(value))) as MasteryLevel;
}

/** Creates the first learner-state row for a vocabulary identity. */
export function createEncounter(encounteredAt: Date, immediatelyDue = false): VocabularyLearnerState {
  return {
    masteryLevel: 1,
    nextDueAt: (immediatelyDue ? encounteredAt : dueAfterLevel(1, encounteredAt)).toISOString(),
    obligation: "scheduled",
    revision: 0,
  };
}

export function isVocabularyLearnerState(value: unknown): value is VocabularyLearnerState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const state = value as Partial<VocabularyLearnerState>;
  return MASTERY_LEVELS.includes(state.masteryLevel as MasteryLevel)
    && typeof state.nextDueAt === "string" && validDate(state.nextDueAt)
    && (state.obligation === "scheduled" || state.obligation === "accelerated")
    && typeof state.revision === "number" && Number.isSafeInteger(state.revision) && state.revision >= 0;
}

export function isDue(state: VocabularyLearnerState, at: Date): boolean {
  return Date.parse(state.nextDueAt) <= at.getTime();
}

export function claimReview(vocabularyIdentity: string, state: VocabularyLearnerState): ReviewClaim {
  return {
    vocabularyIdentity,
    expectedRevision: state.revision,
    dueAt: state.nextDueAt,
    obligation: state.obligation,
  };
}

function acceleratedDueAt(levelAfterMiss: MasteryLevel, anchor: Date): Date {
  const basisLevel = clampMastery(levelAfterMiss - 1);
  const ordinaryDue = dueAfterLevel(basisLevel, anchor);
  return new Date(Math.min(ordinaryDue.getTime(), anchor.getTime() + ACCELERATED_CAP));
}

/**
 * Applies one due obligation without mutating the supplied state. The claim makes
 * stale/double submissions fail instead of applying a second mastery transition.
 */
export function answerReview(
  vocabularyIdentity: string,
  state: VocabularyLearnerState,
  claim: ReviewClaim,
  correct: boolean,
  submittedAt: Date,
): VocabularyLearnerState {
  if (!Number.isFinite(submittedAt.getTime())) throw new Error("A valid submission time is required");
  if (claim.vocabularyIdentity !== vocabularyIdentity
    || claim.expectedRevision !== state.revision
    || claim.dueAt !== state.nextDueAt
    || claim.obligation !== state.obligation) throw new Error("This review obligation is stale");
  if (!isDue(state, submittedAt)) throw new Error("This review obligation is not due yet");

  if (state.obligation === "accelerated") {
    return {
      masteryLevel: state.masteryLevel,
      nextDueAt: dueAfterLevel(state.masteryLevel, submittedAt).toISOString(),
      obligation: "scheduled",
      revision: state.revision + 1,
    };
  }

  if (correct) {
    const masteryLevel = clampMastery(state.masteryLevel + 1);
    return {
      masteryLevel,
      nextDueAt: dueAfterLevel(masteryLevel, submittedAt).toISOString(),
      obligation: "scheduled",
      revision: state.revision + 1,
    };
  }

  const masteryLevel = clampMastery(state.masteryLevel - 1);
  return {
    masteryLevel,
    nextDueAt: acceleratedDueAt(masteryLevel, submittedAt).toISOString(),
    obligation: "accelerated",
    revision: state.revision + 1,
  };
}

/** Returns a frozen, oldest-due-first snapshot for a review session. */
export function createReviewSession(states: VocabularyLearnerStateRecord, startedAt: Date): ReviewClaim[] {
  return Object.entries(states)
    .filter(([, state]) => isDue(state, startedAt))
    .sort(([leftKey, left], [rightKey, right]) =>
      Date.parse(left.nextDueAt) - Date.parse(right.nextDueAt) || leftKey.localeCompare(rightKey))
    .map(([key, state]) => claimReview(key, state));
}
