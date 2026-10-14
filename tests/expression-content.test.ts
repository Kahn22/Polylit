import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { lafountainFixtures } from "../src/content/fixtures/la-fontaine.js";
import { expressionMasteryKey, learnerExpressionsForWork, partitionExpressionTokens, validateExpressionCatalog, assertReviewedExpressionCoverage, type ExpressionCatalog } from "../src/domain/expression-content.js";
import { tokenizeFrench } from "../src/ingestion/tokenize.js";

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

  it("owns only the two lexical parts in each reviewed faire figure envelope", () => {
    const plan = JSON.parse(readFileSync("content/sources/wrk_voltaire_micromegas/whole-work-scope-plan-27.json", "utf8"));
    const phrases = [...plan.phraseComponents, ...plan.candidatePhraseComponents];
    expect(phrases).toHaveLength(3);
    let intervening = 0;
    for (const [index, phrase] of phrases.entries()) {
      const occurrence = { id: `exo_figure_${index}`, identityId: "exi_figure", workId: phrase.workId ?? "wrk_voltaire_micromegas", unitId: phrase.unitId ?? `unt_figure_${index}`, start: phrase.start, end: phrase.end, text: phrase.text, lexicalSegments: phrase.lexicalSegments };
      const tokens = tokenizeFrench(phrase.context);
      const { components, retained } = partitionExpressionTokens(occurrence, tokens);
      expect(components.map((item) => [item.start, item.end])).toEqual(phrase.lexicalSegments.map((item: { start: number; end: number }) => [item.start, item.end]));
      expect(retained.map((item) => item.text)).toEqual(phrase.retainedInterveningTokens.map((item: { text: string }) => item.text));
      intervening += retained.length;
      expect(() => partitionExpressionTokens(occurrence, [...tokens, components[0]!])).toThrow("missing or duplicated");
      const catalog: ExpressionCatalog = { identities: [{ id: "exi_figure", headword: "faire figure", gloss: "showing", definition: "présenter une apparence" }], occurrences: [occurrence], preparedQuizzes: fixture().preparedQuizzes.map((quiz) => ({ ...quiz, expressionId: "exi_figure" })) };
      const b = bundle();
      b.units.push({ id: occurrence.unitId, workId: occurrence.workId, ordinal: 100 + index, french: phrase.context });
      expect(validateExpressionCatalog(b, catalog).some((item) => item.code === "expression.invalid_lexical_segments")).toBe(false);
      const changed = structuredClone(catalog);
      changed.occurrences[0]!.lexicalSegments![0]!.text = "wrong";
      expect(validateExpressionCatalog(b, changed).map((item) => item.code)).toContain("expression.invalid_lexical_segments");
      const candidate = { id: `tok_figure_${index}`, workId: occurrence.workId, unitId: occurrence.unitId, start: retained[0]!.start, end: retained[0]!.end, text: retained[0]!.text, normalized: retained[0]!.text, capitalizationHint: "lowercase" as const, disposition: "expression" as const };
      expect(() => assertReviewedExpressionCoverage([candidate], [{ candidateId: candidate.id, disposition: "expression", expressionIdentityId: "exi_figure" }], catalog)).toThrow("Missing prepared expression");
    }
    expect(intervening).toBe(11);
  });
});
