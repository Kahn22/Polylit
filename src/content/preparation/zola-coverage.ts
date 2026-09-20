import type { ContentBundle } from "../../domain/model.js";
import { vocabularyIdentityKey } from "../../domain/model.js";
import { inspectZolaQuizEditorialReadiness } from "./zola-quality.js";

const requiredBands = ["levels_1_3", "levels_4_5", "levels_6_8"] as const;
type Band = (typeof requiredBands)[number];

/** Deterministic global reuse and outstanding editorial work for one complete work. */
export function createWorkQuizCoverageReport(
  workId: string,
  bundle: ContentBundle,
  globalQuizzes: readonly ContentBundle["quizItems"][number][],
  expressionIdentityCount: number,
  unresolvedCandidates: number,
) {
  const required = new Set(bundle.occurrences.filter((occurrence) => occurrence.workId === workId)
    .map((occurrence) => vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId)));
  const globalBands = new Map<string, Set<Band>>();
  const workBands = new Map<string, Set<Band>>();
  const cleanBands = new Map<string, Set<Band>>();
  const editorial = inspectZolaQuizEditorialReadiness(bundle.units.filter((unit) => unit.workId === workId), bundle.quizItems);
  const invalidIds = new Set([...editorial.sourceReused, ...editorial.sourceDerivedBlanks, ...editorial.syntheticChoiceLists].map((quiz) => quiz.id));
  const globalIds = new Set(globalQuizzes.map((quiz) => quiz.id));
  for (const quiz of bundle.quizItems) {
    const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
    const target = globalIds.has(quiz.id) ? globalBands : workBands;
    if (!target.has(key)) target.set(key, new Set());
    target.get(key)!.add(quiz.band);
    if (!invalidIds.has(quiz.id)) {
      if (!cleanBands.has(key)) cleanBands.set(key, new Set());
      cleanBands.get(key)!.add(quiz.band);
    }
  }
  const surfaces = new Map(bundle.surfaceForms.map((surface) => [surface.id, surface]));
  const senses = new Map(bundle.senses.map((sense) => [sense.id, sense]));
  const entries = [...required].map((key) => {
    const [surfaceFormId, senseId] = key.split(":") as [string, string];
    const global = globalBands.get(key) ?? new Set<Band>();
    const work = workBands.get(key) ?? new Set<Band>();
    const clean = cleanBands.get(key) ?? new Set<Band>();
    return {
      surfaceFormId, senseId,
      form: surfaces.get(surfaceFormId)?.form ?? "",
      meaning: senses.get(senseId)?.gloss ?? "",
      status: requiredBands.every((band) => global.has(band)) && !editorial.affectedIdentities.has(key) ? "global_reuse"
        : requiredBands.every((band) => clean.has(band)) ? "work_prepared" : "needs_revision",
      globalPreparedBands: requiredBands.filter((band) => global.has(band)),
      workPreparedBands: requiredBands.filter((band) => work.has(band)),
      missingCleanBands: requiredBands.filter((band) => !clean.has(band)),
    };
  }).sort((a, b) => a.form.localeCompare(b.form, "fr") || a.senseId.localeCompare(b.senseId));
  return {
    schemaVersion: 1, workId,
    counts: {
      uniqueVocabularyIdentities: entries.length,
      uniqueExpressionIdentities: expressionIdentityCount,
      fullyCoveredGlobally: entries.filter((entry) => entry.status === "global_reuse").length,
      partiallyCoveredGlobally: entries.filter((entry) => entry.globalPreparedBands.length > 0 && entry.globalPreparedBands.length < 3).length,
      workPrepared: entries.filter((entry) => entry.status === "work_prepared").length,
      requiringEditorialRevision: entries.filter((entry) => entry.status === "needs_revision").length,
      missingCleanBandItems: entries.reduce((sum, entry) => sum + entry.missingCleanBands.length, 0),
      blockedByUnresolvedLinguisticAnalysis: unresolvedCandidates,
    },
    entries,
  };
}
