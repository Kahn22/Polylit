import { describe, expect, it } from "vitest";
import {
  answerReview,
  claimReview,
  createEncounter,
  createReviewSession,
  dueAfterLevel,
  type VocabularyLearnerState,
} from "../src/learner/scheduler.js";
import type { MasteryLevel } from "../src/domain/model.js";

const at = (value: string) => new Date(value);

describe("learner scheduling", () => {
  it("uses the agreed normal intervals for all eight mastery levels", () => {
    const anchor = at("2026-01-15T12:00:00.000Z");
    const expected = [
      "2026-01-15T12:10:00.000Z",
      "2026-01-16T12:00:00.000Z",
      "2026-01-18T12:00:00.000Z",
      "2026-01-22T12:00:00.000Z",
      "2026-02-05T12:00:00.000Z",
      "2026-03-16T12:00:00.000Z",
      "2026-07-15T12:00:00.000Z",
      "2027-01-15T12:00:00.000Z",
    ];
    expect(expected.map((_, index) => dueAfterLevel((index + 1) as MasteryLevel, anchor).toISOString())).toEqual(expected);
  });

  it("starts a first encounter at level 1 due ten minutes later", () => {
    expect(createEncounter(at("2026-09-11T10:00:00.000Z"))).toEqual({
      masteryLevel: 1,
      nextDueAt: "2026-09-11T10:10:00.000Z",
      obligation: "scheduled",
      revision: 0,
    });
  });

  it("can make a newly encountered word immediately due for text reading", () => {
    expect(createEncounter(at("2026-09-11T10:00:00.000Z"), true)).toEqual({
      masteryLevel: 1,
      nextDueAt: "2026-09-11T10:00:00.000Z",
      obligation: "scheduled",
      revision: 0,
    });
  });

  it("advances exactly one level after a correct scheduled review", () => {
    const state: VocabularyLearnerState = { masteryLevel: 4, nextDueAt: "2026-09-11T10:00:00.000Z", obligation: "scheduled", revision: 2 };
    const result = answerReview("srf:sns", state, claimReview("srf:sns", state), true, at("2026-09-11T12:00:00.000Z"));
    expect(result).toEqual({ masteryLevel: 5, nextDueAt: "2026-10-02T12:00:00.000Z", obligation: "scheduled", revision: 3 });
    expect(state.masteryLevel).toBe(4);
  });

  it("keeps level 8 at level 8 and schedules its annual review", () => {
    const state: VocabularyLearnerState = { masteryLevel: 8, nextDueAt: "2026-09-11T10:00:00.000Z", obligation: "scheduled", revision: 0 };
    expect(answerReview("srf:sns", state, claimReview("srf:sns", state), true, at("2026-09-11T12:00:00.000Z"))).toMatchObject({
      masteryLevel: 8, nextDueAt: "2027-09-11T12:00:00.000Z", obligation: "scheduled",
    });
  });

  it.each([
    [8, 7, "2026-09-18T12:00:00.000Z"],
    [7, 6, "2026-09-18T12:00:00.000Z"],
    [6, 5, "2026-09-18T12:00:00.000Z"],
    [5, 4, "2026-09-14T12:00:00.000Z"],
    [4, 3, "2026-09-12T12:00:00.000Z"],
    [3, 2, "2026-09-11T12:10:00.000Z"],
    [2, 1, "2026-09-11T12:10:00.000Z"],
    [1, 1, "2026-09-11T12:10:00.000Z"],
  ] as const)("drops L%i to L%i and creates the agreed accelerated due time", (before, after, nextDueAt) => {
    const state: VocabularyLearnerState = { masteryLevel: before, nextDueAt: "2026-09-11T10:00:00.000Z", obligation: "scheduled", revision: 0 };
    expect(answerReview("srf:sns", state, claimReview("srf:sns", state), false, at("2026-09-11T12:00:00.000Z"))).toEqual({
      masteryLevel: after, nextDueAt, obligation: "accelerated", revision: 1,
    });
  });

  it("finishes accelerated review without changing mastery or chaining a miss", () => {
    const state: VocabularyLearnerState = { masteryLevel: 4, nextDueAt: "2026-09-11T10:00:00.000Z", obligation: "accelerated", revision: 3 };
    for (const correct of [true, false]) {
      expect(answerReview("srf:sns", state, claimReview("srf:sns", state), correct, at("2026-09-12T10:00:00.000Z"))).toEqual({
        masteryLevel: 4, nextDueAt: "2026-09-19T10:00:00.000Z", obligation: "scheduled", revision: 4,
      });
    }
  });

  it("rejects early and stale submissions", () => {
    const state = createEncounter(at("2026-09-11T10:00:00.000Z"));
    const claim = claimReview("srf:sns", state);
    expect(() => answerReview("srf:sns", state, claim, true, at("2026-09-11T10:09:59.999Z"))).toThrow("not due");
    expect(() => answerReview("other:sense", state, claim, true, at("2026-09-11T10:10:00.000Z"))).toThrow("stale");
    expect(() => answerReview("srf:sns", { ...state, revision: 1 }, claim, true, at("2026-09-11T10:10:00.000Z"))).toThrow("stale");
  });

  it("freezes only currently due items in oldest-due-first order", () => {
    const states = {
      beta: { masteryLevel: 1, nextDueAt: "2026-09-11T09:00:00.000Z", obligation: "scheduled", revision: 0 },
      alpha: { masteryLevel: 2, nextDueAt: "2026-09-11T09:00:00.000Z", obligation: "scheduled", revision: 1 },
      future: { masteryLevel: 3, nextDueAt: "2026-09-12T09:00:00.000Z", obligation: "scheduled", revision: 0 },
    } satisfies Record<string, VocabularyLearnerState>;
    expect(createReviewSession(states, at("2026-09-11T10:00:00.000Z")).map((claim) => claim.vocabularyIdentity)).toEqual(["alpha", "beta"]);
  });
});
