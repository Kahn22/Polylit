import { z } from "zod";
import type { ContentBundle } from "./model.js";
import type { ReviewDecision, TokenCandidate } from "../ingestion/model.js";
import { validateContentBundle } from "./validate.js";

const nonBlank = z.string().trim().min(1);
const choices = z.array(nonBlank).length(4);

/** Lexical expressions have their own stable mastery, independent of component words. */
export const ExpressionIdentitySchema = z.object({
  id: z.string().regex(/^exi_[a-z0-9][a-z0-9_-]*$/),
  headword: nonBlank, gloss: nonBlank, definition: nonBlank,
});
export const ExpressionOccurrenceSchema = z.object({
  id: z.string().regex(/^exo_[a-z0-9][a-z0-9_-]*$/),
  identityId: ExpressionIdentitySchema.shape.id,
  workId: z.string().regex(/^wrk_[a-z0-9][a-z0-9_-]*$/),
  unitId: z.string().regex(/^unt_[a-z0-9][a-z0-9_-]*$/),
  start: z.number().int().nonnegative(), end: z.number().int().positive(), text: nonBlank,
});
const expressionQuizBase = z.object({ id: z.string().regex(/^exq_[a-z0-9][a-z0-9_-]*$/), expressionId: ExpressionIdentitySchema.shape.id });
export const PreparedExpressionQuizSchema = z.discriminatedUnion("band", [
  expressionQuizBase.extend({ band: z.literal("levels_1_3"), format: z.literal("meaning_choice"), contextFrench: nonBlank, targetText: nonBlank, choicesEnglish: choices, correctAnswer: nonBlank }),
  expressionQuizBase.extend({ band: z.literal("levels_4_5"), format: z.literal("surface_completion"), contextFrench: nonBlank, choicesFrench: choices, correctAnswer: nonBlank }),
  expressionQuizBase.extend({ band: z.literal("levels_6_8"), format: z.literal("target_identification"), contextFrench: nonBlank, promptFrench: nonBlank, choicesFrench: choices, correctAnswer: nonBlank }),
]);
export const ExpressionCatalogSchema = z.object({
  identities: z.array(ExpressionIdentitySchema),
  occurrences: z.array(ExpressionOccurrenceSchema),
  preparedQuizzes: z.array(PreparedExpressionQuizSchema),
});
export type ExpressionCatalog = z.infer<typeof ExpressionCatalogSchema>;
export interface ExpressionDiagnostic { code: string; id: string }

/** Editorial semantics of distractors still require human/offline review; these are mechanical publication gates. */
export function validateExpressionCatalog(bundle: ContentBundle, input: unknown): ExpressionDiagnostic[] {
  const parsed = ExpressionCatalogSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map((issue) => ({ code: "expression.schema_invalid", id: issue.path.join(".") }));
  const catalog = parsed.data;
  const diagnostics: ExpressionDiagnostic[] = [];
  const ids = new Set<string>();
  const identityIds = new Set(catalog.identities.map((item) => item.id));
  const occurrencesByIdentity = new Map<string, typeof catalog.occurrences>();
  const quizBands = new Map<string, Set<string>>();
  const add = (code: string, id: string) => { diagnostics.push({ code, id }); };
  for (const item of [...catalog.identities, ...catalog.occurrences, ...catalog.preparedQuizzes]) {
    if (ids.has(item.id)) add("expression.duplicate_id", item.id);
    ids.add(item.id);
  }
  for (const occurrence of catalog.occurrences) {
    if (!identityIds.has(occurrence.identityId)) add("expression.unknown_identity", occurrence.id);
    const unit = bundle.units.find((item) => item.id === occurrence.unitId);
    if (!unit || unit.workId !== occurrence.workId || unit.french.slice(occurrence.start, occurrence.end) !== occurrence.text || occurrence.start >= occurrence.end) add("expression.invalid_source_span", occurrence.id);
    const group = occurrencesByIdentity.get(occurrence.identityId) ?? [];
    group.push(occurrence);
    occurrencesByIdentity.set(occurrence.identityId, group);
  }
  for (const quiz of catalog.preparedQuizzes) {
    if (!identityIds.has(quiz.expressionId)) add("expression.unknown_identity", quiz.id);
    const bands = quizBands.get(quiz.expressionId) ?? new Set<string>();
    if (bands.has(quiz.band)) add("expression.duplicate_band", quiz.id);
    bands.add(quiz.band);
    quizBands.set(quiz.expressionId, bands);
    const variants = occurrencesByIdentity.get(quiz.expressionId) ?? [];
    const sourceForms = new Set(variants.map((occurrence) => normalize(occurrence.text)));
    const answer = quiz.correctAnswer;
    const quizChoices = "choicesEnglish" in quiz ? quiz.choicesEnglish : quiz.choicesFrench;
    if (new Set(quizChoices).size !== 4 || quizChoices.filter((choice) => choice === answer).length !== 1) add("expression.invalid_choices", quiz.id);
    if (quiz.band === "levels_1_3") {
      if (!sourceForms.has(normalize(quiz.targetText)) || !normalize(quiz.contextFrench).includes(normalize(quiz.targetText))) add("expression.invalid_target", quiz.id);
    } else {
      if (!sourceForms.has(normalize(answer))) add("expression.invalid_target", quiz.id);
      if (quiz.band === "levels_4_5" && !quiz.contextFrench.includes("___")) add("expression.blank_missing", quiz.id);
      if (quiz.band === "levels_6_8" && quiz.choicesFrench.some((choice) => !normalize(quiz.contextFrench).includes(normalize(choice)))) add("expression.choice_not_in_context", quiz.id);
    }
    if (bundle.units.some((unit) => normalize(unit.french) === normalize(quiz.contextFrench))) add("expression.source_reuse", quiz.id);
  }
  for (const [identityId, occurrences] of occurrencesByIdentity) {
    if (occurrences.some((occurrence) => bundle.works.some((work) => work.id === occurrence.workId && ["learning_ready", "published"].includes(work.publicationState))) && quizBands.get(identityId)?.size !== 3) add("expression.missing_prepared_quiz", identityId);
  }
  return diagnostics.sort((a, b) => a.id.localeCompare(b.id) || a.code.localeCompare(b.code));
}

/** A shared expression cannot be exposed until both the work and the catalog are complete. */
export function learnerExpressionsForWork(bundle: ContentBundle, catalog: ExpressionCatalog, workId: string): string[] {
  if (!validateContentBundle(bundle).ok || validateExpressionCatalog(bundle, catalog).length) return [];
  const work = bundle.works.find((item) => item.id === workId);
  if (!work || !["learning_ready", "published"].includes(work.publicationState)) return [];
  const bands = new Map<string, Set<string>>();
  for (const item of catalog.preparedQuizzes) {
    const set = bands.get(item.expressionId) ?? new Set<string>();
    set.add(item.band);
    bands.set(item.expressionId, set);
  }
  return [...new Set(catalog.occurrences.filter((item) => item.workId === workId && bands.get(item.identityId)?.size === 3).map((item) => item.identityId))].sort();
}

export { expressionMasteryKey } from "./runtime.js";
/** Review anchors must point to a prepared expression whose source span contains that token. */
export function assertReviewedExpressionCoverage(candidates: readonly TokenCandidate[], decisions: readonly ReviewDecision[], catalog: ExpressionCatalog): void {
  const byCandidate = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  for (const decision of decisions.filter((item) => item.disposition === "expression")) {
    const candidate = byCandidate.get(decision.candidateId);
    if (!candidate) throw new Error(`Unknown expression review candidate: ${decision.candidateId}`);
    const occurrences = catalog.occurrences.filter((item) => item.identityId === decision.expressionIdentityId && item.unitId === candidate.unitId && item.workId === candidate.workId && item.start <= candidate.start && item.end >= candidate.end);
    const bands = new Set(catalog.preparedQuizzes.filter((item) => item.expressionId === decision.expressionIdentityId).map((item) => item.band));
    if (occurrences.length !== 1 || bands.size !== 3) throw new Error(`Missing prepared expression for review candidate: ${decision.candidateId}`);
  }
}
function normalize(value: string): string { return value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR"); }
