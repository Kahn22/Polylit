import { describe, expect, it } from "vitest";
import { zolaSourceAcquisition } from "../src/content/fixtures/zola.js";
import { validateZolaExpressionSpans } from "../src/content/preparation/zola-expression-plan.js";
import { createZolaPreparedExpressionCatalog } from "../src/content/preparation/zola-prepared-expressions.js";
import { assertReviewedExpressionCoverage, validateExpressionCatalog } from "../src/domain/expression-content.js";
import { prepareIngestionManifest } from "../src/ingestion/prepare.js";

describe("J’Accuse expression editorial plan", () => {
  const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");

  it("preserves exact canonical phrase spans with reusable identities", () => {
    const plan = validateZolaExpressionSpans(zolaSourceAcquisition.units, manifest.candidates);
    expect(plan).toHaveLength(11);
    expect(plan.filter((item) => item.identityId === "exi_de_sorte_que")).toHaveLength(2);
    for (const item of plan) {
      const unit = zolaSourceAcquisition.units.find((source) => source.id === item.unitId)!;
      expect(unit.french.slice(item.start, item.end)).toBe(item.text);
    }
    expect(plan.find((item) => item.identityId === "exi_a_priori")?.text).toBe("a priori");
  });

  it("rejects canonical phrase drift instead of publishing a guessed boundary", () => {
    const changed = structuredClone(zolaSourceAcquisition.units);
    changed.find((unit) => unit.id === "unt_zola_jaccuse_023")!.french = changed.find((unit) => unit.id === "unt_zola_jaccuse_023")!.french.replace("a priori", "préjugé");
    expect(() => validateZolaExpressionSpans(changed, manifest.candidates)).toThrow("Expression wording absent");
  });

  it("rejects a stale anchor when an earlier edit moves the phrase", () => {
    const changed = structuredClone(zolaSourceAcquisition.units);
    changed.find((unit) => unit.id === "unt_zola_jaccuse_023")!.french = `X ${changed.find((unit) => unit.id === "unt_zola_jaccuse_023")!.french}`;
    expect(() => validateZolaExpressionSpans(changed, manifest.candidates)).toThrow("Expression anchor outside phrase or changed");
  });

  it("authors three fixed quiz bands for each reviewed expression, reusing de sorte que", () => {
    const first = createZolaPreparedExpressionCatalog();
    expect(createZolaPreparedExpressionCatalog()).toEqual(first);
    expect(first.identities.map((identity) => identity.id)).toEqual(["exi_a_priori", "exi_tout_d_un_coup", "exi_de_sorte_que", "exi_tout_au_plus", "exi_tout_au_moins", "exi_au_point_de", "exi_se_faire_fort_de", "exi_tout_au_long", "exi_ainsi_que", "exi_quant_a"]);
    for (const identity of first.identities) expect(first.preparedQuizzes.filter((quiz) => quiz.expressionId === identity.id).map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    expect(first.occurrences.filter((item) => item.identityId === "exi_de_sorte_que")).toHaveLength(2);
    expect(validateExpressionCatalog(zolaSourceAcquisition, first)).toEqual([]);
    expect(first.preparedQuizzes.some((quiz) => "choicesEnglish" in quiz && quiz.choicesEnglish.some((choice) => choice.includes("sentence")))).toBe(false);
  });

  it("accepts the a priori token as reviewed only with its enclosing prepared expression", () => {
    const catalog = createZolaPreparedExpressionCatalog();
    const decisions = [{ candidateId: "tok_448dc46860f9dc4b9b7f4f28", disposition: "expression" as const, expressionIdentityId: "exi_a_priori" }];
    expect(() => assertReviewedExpressionCoverage(manifest.candidates, decisions, catalog)).not.toThrow();
    const missing = structuredClone(catalog);
    missing.preparedQuizzes = missing.preparedQuizzes.filter((quiz) => quiz.id !== "exq_a_priori_advanced");
    expect(() => assertReviewedExpressionCoverage(manifest.candidates, decisions, missing)).toThrow("Missing prepared expression");
    expect(() => assertReviewedExpressionCoverage(manifest.candidates, [{ ...decisions[0]!, expressionIdentityId: "exi_other" }], catalog)).toThrow("Missing prepared expression");
  });
});
