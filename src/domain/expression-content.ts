import { z } from "zod";
import type { ContentBundle } from "./model.js";
import type { ReviewDecision, TokenCandidate } from "../ingestion/model.js";
import { validateContentBundle } from "./validate.js";
import { expressionMasteryKey } from "./runtime.js";
import { tokenizeFrench } from "../ingestion/tokenize.js";

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
  surfaceId: z.string().regex(/^exs_[a-z0-9][a-z0-9_-]*$/).optional(),
  workId: z.string().regex(/^wrk_[a-z0-9][a-z0-9_-]*$/),
  unitId: z.string().regex(/^unt_[a-z0-9][a-z0-9_-]*$/),
  start: z.number().int().nonnegative(), end: z.number().int().positive(), text: nonBlank,
  /** Source offsets of the words that belong to a discontinuous expression. */
  lexicalSegments: z.array(z.object({ start: z.number().int().nonnegative(), end: z.number().int().positive(), text: nonBlank })).min(1).optional(),
});
const expressionQuizBase = z.object({ id: z.string().regex(/^exq_[a-z0-9][a-z0-9_-]*$/), expressionId: ExpressionIdentitySchema.shape.id, surfaceId: ExpressionOccurrenceSchema.shape.surfaceId });
export const PreparedExpressionQuizSchema = z.discriminatedUnion("band", [
  expressionQuizBase.extend({ band: z.literal("levels_1_3"), format: z.literal("meaning_choice"), contextFrench: nonBlank, targetText: nonBlank, targetSegments: z.array(z.object({ start: z.number().int().nonnegative(), end: z.number().int().positive() })).min(1).optional(), choicesEnglish: choices, correctAnswer: nonBlank }),
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
  const occurrencesByMastery = new Map<string, typeof catalog.occurrences>();
  const surfaceForms = new Map<string, string>();
  const surfaceRoutes = new Map<string, string>();
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
    if (unit && !validLexicalSegments(unit.french, occurrence)) add("expression.invalid_lexical_segments", occurrence.id);
    if (occurrence.lexicalSegments && occurrence.lexicalSegments.length > 1 && !occurrence.surfaceId) add("expression.surface_required", occurrence.id);
    if (unit && occurrence.lexicalSegments && occurrence.lexicalSegments.length > 1 && bundle.works.some((work) => work.id === occurrence.workId && ["learning_ready", "published"].includes(work.publicationState))) {
      try {
        const { components, retained } = partitionExpressionTokens(occurrence, tokenizeFrench(unit.french));
        const words = bundle.occurrences.filter((item) => item.workId === occurrence.workId && item.unitId === occurrence.unitId);
        const exclusions = bundle.exclusions.filter((item) => item.workId === occurrence.workId && item.unitId === occurrence.unitId);
        if (components.some((token) => words.some((word) => token.start < word.end && token.end > word.start) || exclusions.some((item) => token.start < item.end && token.end > item.start))) add("expression.duplicate_component", occurrence.id);
        if (retained.some((token) => ![...words, ...exclusions].some((item) => item.start === token.start && item.end === token.end))) add("expression.intervening_token_missing", occurrence.id);
      } catch { add("expression.invalid_lexical_segments", occurrence.id); }
    }
    const key = expressionMasteryKey(occurrence.identityId, occurrence.surfaceId);
    const form = normalize(occurrence.text);
    const route = `${occurrence.identityId}:${form}`;
    const priorRoute = surfaceRoutes.get(route);
    if (priorRoute && priorRoute !== key) add("expression.duplicate_surface_route", occurrence.id);
    surfaceRoutes.set(route, key);
    const masteryGroup = occurrencesByMastery.get(key) ?? [];
    masteryGroup.push(occurrence);
    occurrencesByMastery.set(key, masteryGroup);
    if (occurrence.surfaceId) {
      const prior = surfaceForms.get(occurrence.surfaceId);
      if (prior && prior !== form) add("expression.surface_mismatch", occurrence.id);
      surfaceForms.set(occurrence.surfaceId, form);
    }
  }
  for (const quiz of catalog.preparedQuizzes) {
    if (!identityIds.has(quiz.expressionId)) add("expression.unknown_identity", quiz.id);
    const key = expressionMasteryKey(quiz.expressionId, quiz.surfaceId);
    const bands = quizBands.get(key) ?? new Set<string>();
    if (bands.has(quiz.band)) add("expression.duplicate_band", quiz.id);
    bands.add(quiz.band);
    quizBands.set(key, bands);
    const variants = occurrencesByMastery.get(key) ?? [];
    if (!variants.length) add("expression.unknown_surface", quiz.id);
    const sourceForms = new Set(variants.map((occurrence) => normalize(occurrence.text)));
    const answer = quiz.correctAnswer;
    const quizChoices = "choicesEnglish" in quiz ? quiz.choicesEnglish : quiz.choicesFrench;
    if (new Set(quizChoices).size !== 4 || quizChoices.filter((choice) => choice === answer).length !== 1) add("expression.invalid_choices", quiz.id);
    if (quiz.band === "levels_1_3") {
      if (!sourceForms.has(normalize(quiz.targetText)) || !normalize(quiz.contextFrench).includes(normalize(quiz.targetText))) add("expression.invalid_target", quiz.id);
      if (variants.some((variant) => variant.lexicalSegments && variant.lexicalSegments.length > 1) && !quiz.targetSegments) add("expression.target_segments_required", quiz.id);
      if (quiz.targetSegments && !validQuizSegments(quiz.contextFrench, quiz.targetText, quiz.targetSegments, variants)) add("expression.invalid_target_segments", quiz.id);
    } else {
      if (!sourceForms.has(normalize(answer))) add("expression.invalid_target", quiz.id);
      if (quiz.band === "levels_4_5" && !quiz.contextFrench.includes("___")) add("expression.blank_missing", quiz.id);
      if (quiz.band === "levels_6_8" && quiz.choicesFrench.some((choice) => !normalize(quiz.contextFrench).includes(normalize(choice)))) add("expression.choice_not_in_context", quiz.id);
    }
    if (bundle.units.some((unit) => normalize(unit.french) === normalize(quiz.contextFrench))) add("expression.source_reuse", quiz.id);
  }
  for (const [key, occurrences] of occurrencesByMastery) {
    if (occurrences.some((occurrence) => bundle.works.some((work) => work.id === occurrence.workId && ["learning_ready", "published"].includes(work.publicationState))) && quizBands.get(key)?.size !== 3) add("expression.missing_prepared_quiz", key);
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
    const key = expressionMasteryKey(item.expressionId, item.surfaceId);
    const set = bands.get(key) ?? new Set<string>();
    set.add(item.band);
    bands.set(key, set);
  }
  return [...new Set(catalog.occurrences.filter((item) => item.workId === workId && bands.get(expressionMasteryKey(item.identityId, item.surfaceId))?.size === 3).map((item) => item.surfaceId ? `${item.surfaceId}:${item.identityId}` : item.identityId))].sort();
}

export { expressionMasteryKey } from "./runtime.js";
/** Review anchors must point to a prepared expression whose source span contains that token. */
export function assertReviewedExpressionCoverage(candidates: readonly TokenCandidate[], decisions: readonly ReviewDecision[], catalog: ExpressionCatalog): void {
  const byCandidate = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  for (const decision of decisions.filter((item) => item.disposition === "expression")) {
    const candidate = byCandidate.get(decision.candidateId);
    if (!candidate) throw new Error(`Unknown expression review candidate: ${decision.candidateId}`);
    const occurrences = catalog.occurrences.filter((item) => item.identityId === decision.expressionIdentityId && item.unitId === candidate.unitId && item.workId === candidate.workId && expressionSourceSegments(item).some((segment) => segment.start <= candidate.start && segment.end >= candidate.end));
    const bands = occurrences.length === 1 ? new Set(catalog.preparedQuizzes.filter((item) => expressionMasteryKey(item.expressionId, item.surfaceId) === expressionMasteryKey(occurrences[0]!.identityId, occurrences[0]!.surfaceId)).map((item) => item.band)) : new Set<string>();
    if (occurrences.length !== 1 || bands.size !== 3) throw new Error(`Missing prepared expression for review candidate: ${decision.candidateId}`);
  }
}
function normalize(value: string): string { return value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR"); }

export type ExpressionOccurrence = ExpressionCatalog["occurrences"][number];
type SourceSpan = Pick<ExpressionOccurrence, "start" | "end" | "text">;

export function expressionSourceSegments(occurrence: ExpressionOccurrence): readonly SourceSpan[] {
  return occurrence.lexicalSegments ?? [occurrence];
}

function validLexicalSegments(source: string, occurrence: ExpressionOccurrence): boolean {
  if (!occurrence.lexicalSegments) return true;
  let end = occurrence.start;
  for (const segment of occurrence.lexicalSegments) {
    if (segment.start < end || segment.end > occurrence.end || segment.start >= segment.end || source.slice(segment.start, segment.end) !== segment.text) return false;
    end = segment.end;
  }
  return occurrence.lexicalSegments[0]!.start === occurrence.start && end === occurrence.end;
}

function validQuizSegments(context: string, target: string, segments: readonly { start: number; end: number }[], variants: readonly ExpressionOccurrence[]): boolean {
  const start = context.indexOf(target);
  if (start < 0 || context.indexOf(target, start + 1) !== -1) return false;
  return variants.some((variant) => {
    const lexical = expressionSourceSegments(variant);
    return segments.length === lexical.length && segments.every((part, index) => {
      const source = lexical[index]!;
      return part.start === start + source.start - variant.start && part.end === start + source.end - variant.start && context.slice(part.start, part.end) === source.text;
    });
  });
}

/** Stage an expression by exact token spans; never consume the grammar between its lexical parts. */
export function partitionExpressionTokens<T extends { start: number; end: number }>(occurrence: ExpressionOccurrence, tokens: readonly T[]): { components: T[]; retained: T[] } {
  const components: T[] = [], retained: T[] = [];
  const segments = expressionSourceSegments(occurrence);
  for (const token of tokens) {
    if (token.end <= occurrence.start || token.start >= occurrence.end) continue;
    if (token.start < occurrence.start || token.end > occurrence.end || segments.some((segment) => token.start < segment.end && token.end > segment.start && !(token.start === segment.start && token.end === segment.end))) {
      throw new Error(`Expression token crosses a lexical boundary: ${occurrence.id}`);
    }
    if (segments.some((segment) => segment.start === token.start && segment.end === token.end)) components.push(token);
    else retained.push(token);
  }
  if (components.length !== segments.length) throw new Error(`Expression lexical component missing or duplicated: ${occurrence.id}`);
  return { components, retained };
}
