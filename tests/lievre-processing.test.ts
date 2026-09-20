import { describe, expect, it } from "vitest";
import { createLievreLexicalReviewPlan, createLievreLinguisticBundle, lievreLexicalReviewPlan, validateLievreLexicalReviewPlan } from "../src/content/linguistic/le-lievre-et-la-tortue.js";
import { validateContentBundle } from "../src/domain/validate.js";
import { quizCoverageForWork } from "../src/content/quizzes/authoring.js";
import { learnerVocabularyForWork } from "../src/domain/publication.js";

const senseOf = (resolution: (typeof lievreLexicalReviewPlan.candidates)[number]["occurrenceResolutions"][number] | undefined) =>
  resolution?.action === "exclude_editorial" ? undefined : resolution?.senseId;

describe("Le Lièvre et la Tortue lexical review plan", () => {
  it("is deterministic and covers every canonical token", () => {
    expect(createLievreLexicalReviewPlan()).toEqual(lievreLexicalReviewPlan);
    expect(lievreLexicalReviewPlan.tokenCount).toBe(261);
    expect(lievreLexicalReviewPlan.candidates.flatMap((candidate) => candidate.occurrenceCandidateIds)).toHaveLength(261);
    expect(new Set(lievreLexicalReviewPlan.candidates.flatMap((candidate) => candidate.occurrenceCandidateIds)).size).toBe(261);
  });

  it("keeps spelling matches as suggestions rather than automatic identity reuse", () => {
    expect(lievreLexicalReviewPlan.distinctFormCount).toBe(163);
    expect(lievreLexicalReviewPlan.possibleReuseCount).toBe(35);
    expect(lievreLexicalReviewPlan.newFormCount).toBe(128);
    expect(lievreLexicalReviewPlan.candidates.find((candidate) => candidate.normalized === "vit")?.possibleExistingIdentities)
      .toContainEqual({ surfaceFormId: "srf_vit", lemmaId: "lem_vivre", senseIds: ["sns_vivre_primary"] });
  });

  it("preserves canonical first-appearance order", () => {
    expect(lievreLexicalReviewPlan.candidates.slice(0, 10).map((candidate) => candidate.normalized))
      .toEqual(["rien", "ne", "sert", "de", "courir", "il", "faut", "partir", "à", "point"]);
  });

  it("records contextual identity decisions without bypassing publication validation", () => {
    const resolutions = lievreLexicalReviewPlan.candidates.flatMap((candidate) => candidate.occurrenceResolutions);
    const byOccurrence = new Map(resolutions.map((resolution) => [resolution.occurrenceCandidateId, resolution]));

    expect(byOccurrence.get("tok_9df443d478de98d5baaa9ea3")).toMatchObject({ lemmaId: "lem_point_noun", senseId: "sns_point_opportune", surfaceFormId: "srf_point_noun" });
    expect(byOccurrence.get("tok_87f54dfc230f106562124b22")).toMatchObject({ lemmaId: "lem_point_adverb", senseId: "sns_point_negation", surfaceFormId: "srf_point_adverb" });
    expect(senseOf(byOccurrence.get("tok_f3a3086fb355deabe5e6c98c"))).toBe("sns_pas_step");
    expect(senseOf(byOccurrence.get("tok_18b1e79667ca9adc6ef18d24"))).toBe("sns_pas_primary");
    expect(byOccurrence.get("tok_d29da1894f360800448c77c4")).toMatchObject({
      action: "new_identity", lemmaId: "lem_voir", senseId: "sns_voir_past", surfaceFormId: "srf_vit_voir",
    });
    expect(senseOf(byOccurrence.get("tok_5d2445c0530350951a32ff72"))).toBe("sns_lui_subject");
    expect(senseOf(byOccurrence.get("tok_006a7eb3909866dafe4ed252"))).toBe("sns_lui_primary");
    expect(senseOf(byOccurrence.get("tok_8c1880aca071a566e75a75a7"))).toBe("sns_bien_discourse");
    expect(senseOf(byOccurrence.get("tok_078a9e7840cbd3a31fcac5e1"))).toBe("sns_y_enjeu");
    expect(byOccurrence.get("tok_6bde49898eea0420cafeaa82")).toMatchObject({ action: "exclude_editorial" });
    expect(lievreLexicalReviewPlan.candidates.every((candidate) => candidate.reviewStatus === "resolved")).toBe(true);
  });

  it("resolves unambiguous repeated forms consistently", () => {
    const byForm = new Map(lievreLexicalReviewPlan.candidates.map((candidate) => [candidate.normalized, candidate]));
    expect(byForm.get("rien")?.occurrenceResolutions[0]).toMatchObject({ lemmaId: "lem_rien", senseId: "sns_rien_primary" });
    expect(byForm.get("sert")?.occurrenceResolutions).toHaveLength(2);
    expect(byForm.get("de")?.occurrenceResolutions).toHaveLength(11);
    expect(byForm.get("de")?.occurrenceResolutions.every((resolution) => senseOf(resolution) === "sns_de_primary")).toBe(true);
    expect(byForm.get("il")?.occurrenceResolutions).toHaveLength(12);
    expect(byForm.get("faut")?.occurrenceResolutions).toHaveLength(2);
    expect(byForm.get("partir")?.occurrenceResolutions).toHaveLength(2);
    expect(byForm.get("à")?.occurrenceResolutions).toHaveLength(6);
  });

  it("keeps the reviewed occurrence count explicit", () => {
    const reviewedOccurrences = lievreLexicalReviewPlan.candidates
      .reduce((total, candidate) => total + candidate.occurrenceResolutions.length, 0);
    expect(reviewedOccurrences).toBe(261);
  });

  it("rejects resolutions that are detached from their occurrence candidate", () => {
    const invalid = structuredClone(lievreLexicalReviewPlan);
    invalid.candidates[0]!.occurrenceResolutions = [{
      occurrenceCandidateId: "tok_not_in_candidate",
      action: "new_identity",
      lemmaId: "lem_test",
      senseId: "sns_test",
      surfaceFormId: "srf_test",
      rationale: "test",
    }];
    expect(() => validateLievreLexicalReviewPlan(invalid)).toThrow(/not part/);
  });

  it("rejects malformed stable linguistic identifiers", () => {
    const invalid = structuredClone(lievreLexicalReviewPlan);
    const resolution = invalid.candidates[0]!.occurrenceResolutions[0]!;
    if (resolution.action === "exclude_editorial") throw new Error("Expected vocabulary resolution fixture");
    resolution.lemmaId = "lem invalid";
    expect(() => validateLievreLexicalReviewPlan(invalid)).toThrow(/invalid stable identity/);
  });

  it("materializes a valid learning-ready bundle with complete quizzes", () => {
    const bundle = createLievreLinguisticBundle();
    expect(validateContentBundle(bundle)).toEqual({ ok: true, diagnostics: [] });
    expect(bundle.occurrences.filter((occurrence) => occurrence.workId === "wrk_lievre_tortue")).toHaveLength(260);
    expect(bundle.exclusions.filter((exclusion) => exclusion.workId === "wrk_lievre_tortue")).toEqual([
      expect.objectContaining({ text: "l’", reason: "editorial_artifact" }),
    ]);
    expect(bundle.works.find((work) => work.id === "wrk_lievre_tortue")?.publicationState).toBe("learning_ready");
    expect(bundle.readiness.find((item) => item.workId === "wrk_lievre_tortue")).toMatchObject({
      thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [],
    });
    expect(quizCoverageForWork(bundle, "wrk_lievre_tortue")).toMatchObject({
      requiredIdentities: 174, completedIdentities: 174, preparedItems: 717,
      missing: [],
    });
    expect(learnerVocabularyForWork(bundle, "wrk_lievre_tortue")).toHaveLength(174);
  });
});
