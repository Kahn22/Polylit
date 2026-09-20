import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import type { PreparedQuiz, TargetRange } from "../domain/prepared-quiz.js";
import { correctChoice } from "../domain/prepared-quiz.js";
import type { Language } from "./format.js";

type LegacyQuiz = ContentBundle["quizItems"][number] | ExpressionCatalog["preparedQuizzes"][number];
export function normalizeText(text: string, language: Language): string {
  return text.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase(language);
}
/** Never pick the first substring. Multiple candidates require an editorial choice. */
export function targetCandidates(context: string, target: string, language: Language): TargetRange[] {
  const candidates: TargetRange[] = [];
  const normalizedTarget = normalizeText(target, language);
  // Scan original UTF-16 boundaries so NFC normalization cannot shift stored offsets.
  const boundaries = [0];
  let offset = 0;
  for (const character of context) { offset += character.length; boundaries.push(offset); }
  for (let i = 0; i < boundaries.length - 1; i++) {
    const start = boundaries[i]!;
    if (start > 0 && /[\p{L}\p{M}\p{N}]/u.test(context.slice(0, start).at(-1)!) && /^[\p{L}\p{M}\p{N}]/u.test(target)) continue;
    for (let j = i + 1; j < boundaries.length && boundaries[j]! - start <= target.length + 8; j++) {
      const end = boundaries[j]!;
      if (end < context.length && /[\p{L}\p{M}\p{N}]/u.test(context[end]!) && /[\p{L}\p{M}\p{N}]$/u.test(target)) continue;
      if (normalizeText(context.slice(start, end), language) === normalizedTarget) candidates.push({ start, end });
    }
  }
  return candidates;
}
export function prepareQuiz(quiz: LegacyQuiz, language: Language): PreparedQuiz {
  const labels = "choicesEnglish" in quiz ? quiz.choicesEnglish : quiz.choicesFrench;
  const choices = labels.map((text, index) => ({ id: `choice_${index + 1}`, text }));
  if (labels.filter(label => label === quiz.correctAnswer).length !== 1) throw new Error(`Ambiguous correct answer: ${quiz.id}`);
  const candidates = "targetText" in quiz ? targetCandidates(quiz.contextFrench, quiz.targetText, language) : [];
  return {
    id: quiz.id, language, glossLanguage: "en",
    subject: "expressionId" in quiz ? { kind: "expression", expressionId: quiz.expressionId } : { kind: "vocabulary", surfaceFormId: quiz.surfaceFormId, senseId: quiz.senseId },
    band: quiz.band, format: quiz.format, context: quiz.contextFrench,
    ...("targetText" in quiz ? { targetText: quiz.targetText } : {}),
    ...(candidates.length === 1 ? { targetRange: candidates[0]! } : {}),
    ...("promptFrench" in quiz ? { prompt: quiz.promptFrench } : "prompt" in quiz ? { prompt: quiz.prompt } : {}),
    choices, correctChoiceId: choices.find(choice => choice.text === quiz.correctAnswer)!.id,
  };
}
/** Compatibility only; the authored source and browser both use PreparedQuiz. */
export function legacyQuiz(quiz: PreparedQuiz): LegacyQuiz {
  const identity = quiz.subject.kind === "expression" ? { id: quiz.id, expressionId: quiz.subject.expressionId } : { id: quiz.id, surfaceFormId: quiz.subject.surfaceFormId, senseId: quiz.subject.senseId };
  const common = { ...identity, contextFrench: quiz.context, correctAnswer: correctChoice(quiz).text };
  const labels = quiz.choices.map(choice => choice.text);
  if (quiz.band === "levels_1_3") return { ...common, band: quiz.band, format: "meaning_choice", targetText: quiz.targetText!, ...(quiz.subject.kind === "vocabulary" ? { prompt: "Meaning" as const } : {}), choicesEnglish: labels } as LegacyQuiz;
  if (quiz.band === "levels_4_5") return { ...common, band: quiz.band, format: "surface_completion", choicesFrench: labels };
  return { ...common, band: quiz.band, format: "target_identification", promptFrench: quiz.prompt!, choicesFrench: labels };
}
export function quizStructureIssues(quiz: PreparedQuiz): string[] {
  const issues: string[] = [];
  if (!["fr", "es"].includes(quiz.language) || quiz.glossLanguage !== "en") issues.push("language_invalid");
  const expected = { levels_1_3: "meaning_choice", levels_4_5: "surface_completion", levels_6_8: "target_identification" };
  if (expected[quiz.band] !== quiz.format) issues.push("band_format_mismatch");
  if (quiz.choices.length !== 4 || new Set(quiz.choices.map(choice => choice.id)).size !== 4 || quiz.choices.some(choice => !/^choice_[a-z0-9_-]+$/.test(choice.id) || !choice.text.trim())) issues.push("choices_invalid");
  if (new Set(quiz.choices.map(choice => normalizeText(choice.text, quiz.language))).size !== 4) issues.push("duplicate_choices");
  if (quiz.choices.filter(choice => choice.id === quiz.correctChoiceId).length !== 1) issues.push("correct_choice_invalid");
  if (!quiz.context.trim()) issues.push("context_missing");
  if (quiz.format === "meaning_choice") {
    const range = quiz.targetRange;
    if (!quiz.targetText) issues.push("target_missing");
    if (range && (!Number.isInteger(range.start) || !Number.isInteger(range.end) || range.start < 0 || range.end <= range.start || range.end > quiz.context.length || !targetCandidates(quiz.context, quiz.targetText ?? "", quiz.language).some(candidate => candidate.start === range.start && candidate.end === range.end))) issues.push("target_range_invalid");
  } else if (quiz.targetRange) issues.push("unexpected_target_range");
  return issues;
}
/** These are necessary gates, not a substitute for contextual editorial review. */
export function quizEditorialIssues(quiz: PreparedQuiz): string[] {
  const issues = quizStructureIssues(quiz);
  if (quiz.format === "meaning_choice" && !quiz.targetRange) issues.push("target_selection_required");
  const context = quiz.context.trim();
  const definitionFrames = [
    /^(La forma estudiada es|Completa con la forma exacta:|Compara estas formas:|Les formes proposées sont)/u,
    /^(?:Nina|Le professeur) emploie « .+ » pour exprimer cette idée\s*:/u,
    /^Dans cet exercice, « .+ » prend un sens précis\s*:/u,
    /^Ici, « .+ » sert à désigner ou exprimer ceci\s*:/u,
    /^Le terme (?:précis pour exprimer|qui signifie) « .+ » est _/u,
    /^Dans le glossaire, _+ correspond à cette définition\s*:/u,
    /^Pour exprimer l’idée « .+ », le mot attendu est _/u,
    /^Le mot .+ est précis\. Paul compare/u,
    /^Dans cette situation, le mot « .+ » exprime précisément ceci\s*:/u,
    /^Le contexte pédagogique montre que « .+ » renvoie à ceci\s*:/u,
    /^Complétez avec le mot qui signifie « .+ »\s*:\s*_/u,
  ];
  if (definitionFrames.some(pattern => pattern.test(context))) issues.push("template_context");
  if (quiz.format === "surface_completion" && (quiz.context.match(/_{3,}/g)?.length !== 1)) issues.push("exactly_one_blank_required");
  return issues;
}
