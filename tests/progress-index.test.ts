import { describe, expect, it } from "vitest";
import { ProgressIndex } from "../src/app/progress-index.js";
import { identityToken } from "../src/delivery/identity-token.js";
import type { LibraryIndex } from "../src/delivery/types.js";
import { createEncounter, type VocabularyLearnerStateRecord } from "../src/learner/scheduler.js";
const shared = "srf_same:sns_same", unique = "srf_unique:sns_unique";
const work = (tokens: string[]) => ({ vocabularyTokens: tokens, expressionIdentityKeys: [], manifest: "works/fr/test.json", sectionCount: 1 });
const library: LibraryIndex = { version: 3, language: "fr", release: "test", catalog: { works: [], authors: [], collections: [], books: [] }, works: { a: work([identityToken(shared)]), b: work([identityToken(shared), identityToken(unique)]) }, quizzes: "quiz-index/fr/test.json" };
describe("derived learner progress indexes", () => {
  it("shares identities without duplicating global claims and ignores Available-only items", () => {
    const at = new Date("2026-09-19T00:00:00Z");
    const state = { [shared]: createEncounter(at, true), [unique]: createEncounter(at, true) };
    const index = new ProgressIndex(library);
    index.refresh(state, new Set(["a"]), 0, at);
    expect(index.claims().map(item => item.vocabularyIdentity)).toEqual([shared]);
    expect(index.unencountered("b")).toBe(0);
    index.refresh(state, new Set(["a", "b"]), 1, at);
    expect(index.claims()).toHaveLength(2);
    expect(index.claims("b")).toHaveLength(2);
    expect(Object.keys(state)).toEqual([shared, unique]);
  });
  it("refreshes at due time without a state write and after an encounter", () => {
    const at = new Date("2026-09-19T00:00:00Z");
    const state: VocabularyLearnerStateRecord = { [shared]: createEncounter(at) };
    const index = new ProgressIndex(library);
    index.refresh(state, new Set(["a", "b"]), 0, at);
    expect(index.claims()).toHaveLength(0);
    expect(index.unencountered("b")).toBe(1);
    index.refresh(state, new Set(["a", "b"]), 0, new Date(at.getTime() + 600_000));
    expect(index.claims()).toHaveLength(1);
    state[unique] = createEncounter(at, true);
    index.refresh(state, new Set(["a", "b"]), 1, at);
    expect(index.unencountered("b")).toBe(0);
  });
});
