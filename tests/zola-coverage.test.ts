import { describe, expect, it } from "vitest";
import { createWorkQuizCoverageReport } from "../src/content/preparation/zola-coverage.js";
import { createLievreLinguisticBundle } from "../src/content/linguistic/le-lievre-et-la-tortue.js";
import { vocabularyIdentityKey } from "../src/domain/model.js";

describe("content-only quiz coverage report", () => {
  it("distinguishes global reuse, missing bands, and independently prepared work questions", () => {
    const bundle = createLievreLinguisticBundle();
    const workId = "wrk_lievre_tortue";
    const occurrence = bundle.occurrences.find((item) => item.workId === workId)!;
    const identity = vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId);
    const globalQuizzes = bundle.quizItems.filter((item) => vocabularyIdentityKey(item.surfaceFormId, item.senseId) === identity);
    expect(globalQuizzes).toHaveLength(3);
    const globalOnly = createWorkQuizCoverageReport(workId, bundle, globalQuizzes, 10, 0);
    expect(globalOnly.counts.uniqueExpressionIdentities).toBe(10);
    expect(globalOnly.entries.find((item) => vocabularyIdentityKey(item.surfaceFormId, item.senseId) === identity)).toMatchObject({
      status: "global_reuse", missingCleanBands: [],
    });

    const missingQuiz = globalQuizzes[0]!;
    const withoutQuiz = { ...bundle, quizItems: bundle.quizItems.filter((item) => item.id !== missingQuiz.id) };
    const incomplete = createWorkQuizCoverageReport(workId, withoutQuiz, globalQuizzes, 10, 0);
    expect(incomplete.entries.find((item) => vocabularyIdentityKey(item.surfaceFormId, item.senseId) === identity)).toMatchObject({
      status: "needs_revision", missingCleanBands: [missingQuiz.band],
    });
    expect(incomplete.counts.missingCleanBandItems).toBe(globalOnly.counts.missingCleanBandItems + 1);

    const authored = createWorkQuizCoverageReport(workId, bundle, [], 10, 0);
    expect(authored.entries.find((item) => vocabularyIdentityKey(item.surfaceFormId, item.senseId) === identity)?.status).toBe("work_prepared");
  });
});
