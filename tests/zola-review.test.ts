import { describe, expect, it } from "vitest";
import { zolaSourceAcquisition } from "../src/content/fixtures/zola.js";
import { reviewedZolaExclusions } from "../src/content/preparation/zola-review.js";
import { reviewedZolaReuseDecisions } from "../src/content/preparation/zola-review.js";
import { zolaSharedQuizBatch38 } from "../src/content/preparation/zola-shared-quiz-batch-38.js";
import { zolaSharedQuizCoverage } from "../src/content/preparation/zola-shared-quiz-coverage.js";
import { zolaSharedQuizBatch40 } from "../src/content/preparation/zola-shared-quiz-batch-40.js";
import { zolaSharedQuizBatch42 } from "../src/content/preparation/zola-shared-quiz-batch-42.js";
import { onePronounCandidates, reviewedOnePronounDecisions, zolaOnePronounQuizzes, zolaOnePronounSense } from "../src/content/preparation/zola-one-pronoun.js";
import { createLievreLinguisticBundle } from "../src/content/linguistic/le-lievre-et-la-tortue.js";
import { prepareIngestionManifest } from "../src/ingestion/prepare.js";
import { validateContentBundle } from "../src/domain/validate.js";

describe("J’Accuse editorial review", () => {
  const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");
  const decisions = reviewedZolaExclusions(manifest.candidates);

  it("excludes the reviewed proper names and editorial initials deterministically", () => {
    expect(decisions).toHaveLength(153);
    expect(new Set(decisions.map((decision) => decision.candidateId)).size).toBe(decisions.length);
    expect(decisions.every((decision) => decision.disposition !== "vocabulary")).toBe(true);
  });

  it("reuses only explicitly reviewed shared vocabulary identities", () => {
    const decisions = reviewedZolaReuseDecisions(manifest.candidates, createLievreLinguisticBundle());
    expect(decisions).toHaveLength(2219);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_que")).toHaveLength(82);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_qu_elided")).toHaveLength(46);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_se" && decision.senseId === "sns_se_primary")).toHaveLength(22);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_que" && decision.senseId === "sns_que_relative")).toHaveLength(11);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_qu_elided" && decision.senseId === "sns_que_relative")).toHaveLength(17);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_qu_elided" && decision.senseId === "sns_que_restrictive")).toHaveLength(5);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_l_elided" && decision.senseId === "sns_le_primary")).toHaveLength(111);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_l_elided" && decision.senseId === "sns_le_object")).toHaveLength(15);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_la" && decision.senseId === "sns_le_primary")).toHaveLength(106);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_la" && decision.senseId === "sns_le_object")).toHaveLength(13);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_le" && decision.senseId === "sns_le_primary")).toHaveLength(147);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_le" && decision.senseId === "sns_le_object")).toHaveLength(13);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_les" && decision.senseId === "sns_le_primary")).toHaveLength(65);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_les" && decision.senseId === "sns_le_object")).toHaveLength(13);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_un" && decision.senseId === "sns_un_primary")).toHaveLength(59);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_une" && decision.senseId === "sns_un_primary")).toHaveLength(46);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_monsieur")).toHaveLength(7);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_comme")).toHaveLength(13);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_encore")).toHaveLength(5);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_faire" && decision.senseId === "sns_faire_causative")).toHaveLength(7);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_faire" && decision.senseId === "sns_faire_primary")).toHaveLength(4);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_fait" && decision.senseId === "sns_faire_done")).toHaveLength(11);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_fait" && decision.senseId === "sns_faire_causative")).toHaveLength(3);
    expect(decisions.filter((decision) => decision.surfaceFormId === "srf_fait" && decision.senseId === "sns_faire_primary")).toHaveLength(2);
    expect(new Set(decisions.filter((decision) => decision.surfaceFormId === "srf_autre").map((decision) => decision.senseId))).toEqual(new Set(["sns_autre_adjective", "sns_autre_pronoun"]));
    expect(decisions.every((decision) => decision.disposition === "vocabulary")).toBe(true);
  });

  it("prepares the previously uncovered global la-object identity without a new surface", () => {
    const base = createLievreLinguisticBundle();
    expect(base.surfaceForms.filter((surface) => surface.id === "srf_la")).toHaveLength(1);
    expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === "srf_la" && quiz.senseId === "sns_le_object")).toHaveLength(0);
    expect(zolaSharedQuizBatch38.map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    expect(zolaSharedQuizBatch38.every((quiz) => quiz.surfaceFormId === "srf_la" && quiz.senseId === "sns_le_object")).toBe(true);
    base.quizItems.push(...zolaSharedQuizBatch38);
    expect(validateContentBundle(base)).toEqual({ ok: true, diagnostics: [] });
  });

  it("prepares the uncovered global causative faire identity only once", () => {
    const base = createLievreLinguisticBundle();
    expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === "srf_faire" && quiz.senseId === "sns_faire_causative")).toHaveLength(0);
    expect(zolaSharedQuizCoverage.map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    base.quizItems.push(...zolaSharedQuizCoverage);
    expect(validateContentBundle(base)).toEqual({ ok: true, diagnostics: [] });
  });

  it("reuses existing que quizzes and only authors missing surface-and-sense combinations", () => {
    const base = createLievreLinguisticBundle();
    for (const [surfaceFormId, senseId] of [
      ["srf_que", "sns_que_relative"], ["srf_que", "sns_que_comparative"],
      ["srf_qu_elided", "sns_que_restrictive"],
    ]) {
      expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === senseId)).toHaveLength(0);
      expect(zolaSharedQuizBatch42.filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === senseId).map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    }
    expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === "srf_que" && quiz.senseId === "sns_que_conjunction")).toHaveLength(3);
    expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === "srf_qu_elided" && quiz.senseId === "sns_que_relative")).toHaveLength(3);
    base.quizItems.push(...zolaSharedQuizBatch42);
    expect(validateContentBundle(base)).toEqual({ ok: true, diagnostics: [] });
  });

  it("reuses article questions and prepares only uncovered le/les object identities", () => {
    const base = createLievreLinguisticBundle();
    for (const surfaceFormId of ["srf_le", "srf_les"]) {
      expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === "sns_le_primary")).toHaveLength(3);
      expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === "sns_le_object")).toHaveLength(0);
      expect(zolaSharedQuizBatch40.filter((quiz) => quiz.surfaceFormId === surfaceFormId).map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    }
    base.quizItems.push(...zolaSharedQuizBatch40);
    expect(validateContentBundle(base)).toEqual({ ok: true, diagnostics: [] });
  });

  it("separates one-of-a-group pronouns from indefinite articles and prepares their own quizzes", () => {
    const base = createLievreLinguisticBundle();
    const reused = reviewedZolaReuseDecisions(manifest.candidates, base);
    const pronouns = reviewedOnePronounDecisions(manifest.candidates);
    expect(pronouns).toHaveLength(5);
    expect(pronouns.filter((decision) => decision.surfaceFormId === "srf_un")).toHaveLength(3);
    expect(pronouns.filter((decision) => decision.surfaceFormId === "srf_une")).toHaveLength(2);
    const reusedIds = new Set(reused.map((decision) => decision.candidateId));
    expect(pronouns.some((decision) => reusedIds.has(decision.candidateId))).toBe(false);
    expect(onePronounCandidates.un).toHaveLength(3);
    expect(onePronounCandidates.une).toHaveLength(2);
    expect(zolaOnePronounSense.lemmaId).toBe("lem_un");
    for (const surfaceFormId of ["srf_un", "srf_une"]) {
      expect(base.quizItems.filter((quiz) => quiz.surfaceFormId === surfaceFormId && quiz.senseId === "sns_un_primary")).toHaveLength(3);
      expect(zolaOnePronounQuizzes.filter((quiz) => quiz.surfaceFormId === surfaceFormId).map((quiz) => quiz.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    }
    base.senses.push(zolaOnePronounSense);
    base.quizItems.push(...zolaOnePronounQuizzes);
    expect(validateContentBundle(base)).toEqual({ ok: true, diagnostics: [] });
  });

  it("keeps Monsieur and Président available for learner vocabulary", () => {
    const excluded = new Set(decisions.map((decision) => decision.candidateId));
    for (const candidate of manifest.candidates.filter((item) => ["monsieur", "président"].includes(item.normalized))) {
      expect(excluded.has(candidate.id)).toBe(false);
    }
  });

  it("does not mistake lowercase common nouns for proper names", () => {
    const excluded = new Set(decisions.map((decision) => decision.candidateId));
    for (const candidate of manifest.candidates.filter((item) => item.normalized === "diable" && item.capitalizationHint === "lowercase")) {
      expect(excluded.has(candidate.id)).toBe(false);
    }
  });
});
