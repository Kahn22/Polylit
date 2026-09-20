import { describe, expect, it } from "vitest";
import { clampMastery, isQuizEligibleLibraryStatus, libraryStatusFor, orderedChoices, parseReadingLibraryState, shouldUnderlineVocabulary, vocabularyKey, withLibraryStatus } from "../src/app/state.js";

describe("prototype learner state", () => {
  it("uses surface form plus sense as the mastery identity", () => {
    expect(vocabularyKey("srf_tint", "sns_tenir_primary")).toBe("srf_tint:sns_tenir_primary");
  });
  it("keeps mastery inside the eight-level interface", () => {
    expect(clampMastery(0)).toBe(1); expect(clampMastery(9)).toBe(8);
  });
  it("underlines vocabulary only below mastery level 4", () => {
    expect(shouldUnderlineVocabulary(1)).toBe(true);
    expect(shouldUnderlineVocabulary(3)).toBe(true);
    expect(shouldUnderlineVocabulary(4)).toBe(false);
    expect(shouldUnderlineVocabulary(8)).toBe(false);
  });
  it("orders prepared choices deterministically without changing their content", () => {
    const choices = ["correct", "second", "third", "fourth"];
    expect(orderedChoices(choices, "qiz_example_01")).toEqual(orderedChoices(choices, "qiz_example_01"));
    expect(new Set(orderedChoices(choices, "qiz_example_01"))).toEqual(new Set(choices));
    expect(choices).toEqual(["correct", "second", "third", "fourth"]);
  });
  it("keeps reading-library status separate from learner mastery", () => {
    const parsed = parseReadingLibraryState({ first: "reading", second: "completed", invalid: "borrowed" });
    expect(parsed).toEqual({ first: "reading", second: "completed" });
    expect(libraryStatusFor(parsed, "new-work")).toBe("available");
    const updated = withLibraryStatus(parsed, "first", "completed");
    expect(updated.first).toBe("completed");
    expect(parsed.first).toBe("reading");
    expect(isQuizEligibleLibraryStatus("available")).toBe(false);
    expect(isQuizEligibleLibraryStatus("reading")).toBe(true);
    expect(isQuizEligibleLibraryStatus("completed")).toBe(true);
  });
});
