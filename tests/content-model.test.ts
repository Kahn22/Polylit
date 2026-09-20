import { describe, expect, it } from "vitest";
import { lafountainFixtures } from "../src/content/fixtures/la-fontaine.js";
import { MASTERY_LEVELS, vocabularyIdentityKey } from "../src/domain/model.js";
import { validateContentBundle } from "../src/domain/validate.js";
import { preparedFromageQuizSet } from "./helpers/prepared-quizzes.js";

const clone = () => structuredClone(lafountainFixtures);

describe("content foundation", () => {
  it("validates the canonical fixtures deterministically without mutation", () => {
    const fixture = clone(); const before = JSON.stringify(fixture);
    const first = validateContentBundle(fixture); const second = validateContentBundle(fixture);
    expect(first).toEqual({ ok: true, diagnostics: [] });
    expect(second).toEqual(first); expect(JSON.stringify(fixture)).toBe(before);
  });

  it("reserves all twelve ordered books and locates the fixture fables correctly", () => {
    expect(lafountainFixtures.books.map((book) => book.ordinal)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
    expect(lafountainFixtures.works.map(({ bookId, ordinal }) => [bookId, ordinal])).toEqual([
      ["bok_lafontaine_fables_01", 2], ["bok_lafontaine_fables_06", 10],
    ]);
  });

  it("contains the complete ending of Le Lièvre et la Tortue", () => {
    const text = lafountainFixtures.sources.find((x) => x.workId === "wrk_lievre_tortue")?.canonicalText;
    expect(text).toContain("Moi l’emporter ! et que serait-ce si vous portiez une maison ?");
    expect(lafountainFixtures.units.filter((x) => x.workId === "wrk_lievre_tortue")).toHaveLength(16);
  });

  it("defines exactly eight mastery levels", () => expect(MASTERY_LEVELS).toEqual([1,2,3,4,5,6,7,8]));
  it("derives shared vocabulary identity solely from surface form and sense", () => {
    expect(vocabularyIdentityKey("srf_cours", "sns_courir_move")).toBe("srf_cours:sns_courir_move");
  });

  it("rejects a surface form paired with a sense from another lemma", () => {
    const b = clone();
    b.lemmas.push({ id: "lem_un", headword: "un", partOfSpeech: "determiner" }, { id: "lem_fromage", headword: "fromage", partOfSpeech: "noun" });
    b.senses.push({ id: "sns_fromage_food", lemmaId: "lem_fromage", gloss: "cheese", definition: "A food made from milk" });
    b.surfaceForms.push({ id: "srf_un", lemmaId: "lem_un", form: "un", normalized: "un" });
    b.occurrences.push({ id: "occ_bad_pair", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_01", surfaceFormId: "srf_un", senseId: "sns_fromage_food", start: 43, end: 45 });
    expect(validateContentBundle(b).diagnostics.map((x) => x.code)).toContain("vocabulary.lemma_mismatch");
  });

  it("blocks learner-facing publication when processing or quizzes are incomplete", () => {
    const b = clone(); b.works[0]!.publicationState = "published";
    const codes = validateContentBundle(b).diagnostics.map((x) => x.code);
    expect(codes).toContain("publication.incomplete");
  });

  it("requires globally prepared quizzes for every published vocabulary identity", () => {
    const b = clone(); b.works[0]!.publicationState = "learning_ready";
    b.readiness[0] = { workId: "wrk_corbeau_renard", thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [] };
    b.lemmas.push({ id: "lem_fromage", headword: "fromage", partOfSpeech: "noun" });
    b.senses.push({ id: "sns_fromage_food", lemmaId: "lem_fromage", gloss: "cheese", definition: "A food made from milk" });
    b.surfaceForms.push({ id: "srf_fromage", lemmaId: "lem_fromage", form: "fromage", normalized: "fromage" });
    b.occurrences.push({ id: "occ_fromage_corbeau", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_01", surfaceFormId: "srf_fromage", senseId: "sns_fromage_food", start: 58, end: 65 });
    expect(validateContentBundle(b).diagnostics.map((x) => x.code)).toContain("publication.missing_quiz");
    b.quizItems.push(...preparedFromageQuizSet);
    expect(validateContentBundle(b)).toEqual({ ok: true, diagnostics: [] });
  });

  it("stores no English sentence translations", () => {
    expect(lafountainFixtures.units.every((unit) => !("english" in unit))).toBe(true);
  });
});
