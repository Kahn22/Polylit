import { describe, expect, it } from "vitest";
import { lafountainFixtures } from "../src/content/fixtures/la-fontaine.js";
import { isVocabularyIdentityLearnerPublished, learnerVocabularyForWork } from "../src/domain/publication.js";
import { preparedFromageQuizSet } from "./helpers/prepared-quizzes.js";

function completedBundle() {
  const bundle = structuredClone(lafountainFixtures);
  bundle.lemmas.push({ id: "lem_fromage", headword: "fromage", partOfSpeech: "noun" });
  bundle.senses.push({ id: "sns_fromage_food", lemmaId: "lem_fromage", gloss: "cheese", definition: "A food made from milk" });
  bundle.surfaceForms.push({ id: "srf_fromage", lemmaId: "lem_fromage", form: "fromage", normalized: "fromage" });
  bundle.occurrences.push({ id: "occ_fromage_corbeau", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_01", surfaceFormId: "srf_fromage", senseId: "sns_fromage_food", start: 58, end: 65 });
  return bundle;
}

function addPreparedQuizSet(bundle: ReturnType<typeof completedBundle>) {
  bundle.quizItems.push(...preparedFromageQuizSet);
}

describe("automatic vocabulary publication", () => {
  it("does not publish an identity before prepared quiz content exists", () => {
    const bundle = completedBundle();
    expect(isVocabularyIdentityLearnerPublished(bundle, "srf_fromage", "sns_fromage_food")).toBe(false);
  });

  it("publishes a complete identity automatically when its quiz is added", () => {
    const bundle = completedBundle();
    addPreparedQuizSet(bundle);
    expect(isVocabularyIdentityLearnerPublished(bundle, "srf_fromage", "sns_fromage_food")).toBe(true);
  });

  it("still hides automatically published vocabulary until its work is learner-safe", () => {
    const bundle = completedBundle();
    addPreparedQuizSet(bundle);
    expect(learnerVocabularyForWork(bundle, "wrk_corbeau_renard")).toEqual([]);
    bundle.works[0]!.publicationState = "learning_ready";
    bundle.readiness[0] = { workId: "wrk_corbeau_renard", thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [] };
    expect(learnerVocabularyForWork(bundle, "wrk_corbeau_renard")).toEqual([{ surfaceFormId: "srf_fromage", senseId: "sns_fromage_food" }]);
  });
});
