import type { ContentBundle } from "../../domain/model.js";

/** A review decision is not an editorially accepted question set. */
export function auditZolaQuizEditorialReadiness(
  units: readonly ContentBundle["units"][number][],
  quizzes: readonly ContentBundle["quizItems"][number][],
) {
  const findings = inspectZolaQuizEditorialReadiness(units, quizzes);
  return {
    sourceReusedQuizItems: findings.sourceReused.length,
    sourceDerivedBlankQuizItems: findings.sourceDerivedBlanks.length,
    syntheticChoiceListQuizItems: findings.syntheticChoiceLists.length,
    identitiesRequiringQuestionReview: findings.affectedIdentities.size,
    editoriallyReady: findings.affectedIdentities.size === 0,
  };
}

/** Identity-level defects used by the content-only coverage report. */
export function inspectZolaQuizEditorialReadiness(
  units: readonly ContentBundle["units"][number][],
  quizzes: readonly ContentBundle["quizItems"][number][],
) {
  const sourceSentences = new Set(units.map((unit) => normalize(unit.french)));
  const sourceReused = quizzes.filter((quiz) => sourceSentences.has(normalize(quiz.contextFrench)));
  const sourceDerivedBlanks = quizzes.filter((quiz) => {
    if (quiz.format !== "surface_completion") return false;
    const fragments = normalize(quiz.contextFrench).split(/_{3,}/);
    if (fragments.length !== 2) return false;
    const [before, after] = fragments as [string, string];
    return [...sourceSentences].some((source) => source.startsWith(before) && source.endsWith(after) && source.length > before.length + after.length);
  });
  const syntheticChoiceLists = quizzes.filter((quiz) => quiz.contextFrench.includes("Les formes proposées sont «"));
  const affectedIdentities = new Set([...sourceReused, ...sourceDerivedBlanks, ...syntheticChoiceLists].map((quiz) => `${quiz.surfaceFormId}:${quiz.senseId}`));
  return { sourceReused, sourceDerivedBlanks, syntheticChoiceLists, affectedIdentities };
}

function normalize(value: string): string { return value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR"); }
