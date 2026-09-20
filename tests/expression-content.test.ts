import { describe, expect, it } from "vitest";
import { lafountainFixtures } from "../src/content/fixtures/la-fontaine.js";
import { expressionMasteryKey, learnerExpressionsForWork, validateExpressionCatalog, type ExpressionCatalog } from "../src/domain/expression-content.js";

const bundle = () => structuredClone(lafountainFixtures);
const fixture = (): ExpressionCatalog => ({
  identities: [{ id: "exi_shared", headword: "sans mentir", gloss: "truthfully", definition: "en disant la vérité" }],
  occurrences: [
    { id: "exo_first", identityId: "exi_shared", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_06", start: 0, end: 11, text: "Sans mentir" },
  ],
  preparedQuizzes: [
    { id: "exq_first", expressionId: "exi_shared", band: "levels_1_3", format: "meaning_choice", contextFrench: "Sans mentir, voici la vérité.", targetText: "Sans mentir", choicesEnglish: ["truthfully", "with anger", "at dawn", "in secret"], correctAnswer: "truthfully" },
    { id: "exq_second", expressionId: "exi_shared", band: "levels_4_5", format: "surface_completion", contextFrench: "_____, je vous assure que c’est exact.", choicesFrench: ["Sans mentir", "Sans dormir", "Sans parler", "Sans attendre"], correctAnswer: "Sans mentir" },
    { id: "exq_third", expressionId: "exi_shared", band: "levels_6_8", format: "target_identification", contextFrench: "Sans mentir, sans dormir, sans parler, sans attendre : laquelle affirme la sincérité ?", promptFrench: "Quelle expression affirme la sincérité ?", choicesFrench: ["Sans mentir", "sans dormir", "sans parler", "sans attendre"], correctAnswer: "Sans mentir" },
  ],
});

describe("expression mastery content", () => {
  it("shares one mastery identity across works while component words stay separate", () => {
    const b = bundle(), catalog = fixture();
    b.units.push({ id: "unt_shared_example", workId: "wrk_lievre_tortue", ordinal: 99, french: "Sans mentir, la tortue a gagné." });
    catalog.occurrences.push({ id: "exo_other_work", identityId: "exi_shared", workId: "wrk_lievre_tortue", unitId: "unt_shared_example", start: 0, end: 11, text: "Sans mentir" });
    expect(expressionMasteryKey("exi_shared")).toBe("expression:exi_shared");
    expect(expressionMasteryKey("exi_shared")).not.toContain("srf_");
    expect(new Set(catalog.occurrences.map((item) => item.identityId))).toEqual(new Set(["exi_shared"]));
    expect(validateExpressionCatalog(b, catalog)).toEqual([]);
  });

  it("fails closed on invalid source spans, duplicate quiz bands and missing choices", () => {
    const b = bundle(), catalog = fixture();
    catalog.occurrences[0]!.start += 1;
    expect(validateExpressionCatalog(b, catalog).map((x) => x.code)).toContain("expression.invalid_source_span");
    const duplicate = fixture();
    duplicate.preparedQuizzes.push({ ...duplicate.preparedQuizzes[0]!, id: "exq_duplicate" });
    expect(validateExpressionCatalog(b, duplicate).map((x) => x.code)).toContain("expression.duplicate_band");
    const missing = fixture();
    missing.preparedQuizzes.pop();
    b.works.find((work) => work.id === "wrk_corbeau_renard")!.publicationState = "published";
    expect(validateExpressionCatalog(b, missing).map((x) => x.code)).toContain("expression.missing_prepared_quiz");
  });

  it("does not expose expressions from an unfinished work or unprepared catalog", () => {
    const b = bundle(), catalog = fixture();
    expect(learnerExpressionsForWork(b, catalog, "wrk_corbeau_renard")).toEqual([]);
    const incomplete = fixture(); incomplete.preparedQuizzes.pop();
    b.works.find((work) => work.id === "wrk_corbeau_renard")!.publicationState = "published";
    b.readiness.find((item) => item.workId === "wrk_corbeau_renard")!.thoughtUnitsComplete = true;
    b.readiness.find((item) => item.workId === "wrk_corbeau_renard")!.occurrencesReviewed = true;
    b.readiness.find((item) => item.workId === "wrk_corbeau_renard")!.unresolvedLearnerTokens = [];
    expect(learnerExpressionsForWork(b, incomplete, "wrk_corbeau_renard")).toEqual([]);
    expect(learnerExpressionsForWork(b, catalog, "wrk_corbeau_renard")).toEqual(["exi_shared"]);
  });
});
