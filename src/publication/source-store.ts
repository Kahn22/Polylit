import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import { createHash } from "node:crypto";
import type { SharedPackage, WorkPackage, SharedRecords, WorkRecords } from "./repository.js";
import type { Language } from "./format.js";
import { fromNeutral, toNeutral } from "./format.js";
import type { PreparedQuiz } from "../domain/prepared-quiz.js";
import { prepareQuiz, legacyQuiz, quizStructureIssues } from "./quiz-authoring.js";
import { pendingReview, reviewRevision, type ReviewRecord } from "./editorial.js";
import { textBinding, assertTextBinding, type TextBinding } from "./revisions.js";
import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";

const kinds = ["lemmas", "senses", "surfaceForms", "quizzes", "expressions", "reviews"] as const;
type Kind = typeof kinds[number];
export interface SharedManifest { version: 2; language: Language; files: Record<Kind, string[]> }
export interface SharedSource { legacy: SharedPackage; quizzes: PreparedQuiz[]; reviews: ReviewRecord[] }
export interface WorkSourceV2 extends Omit<WorkPackage, "version" | "content"> {
  version: 2;
  content: Omit<WorkPackage["content"], "expressions">;
  textBinding: TextBinding;
  expressionNotes: (ContentBundle["expressions"][number] & { kind: "explanatory_note" })[];
}
const parse = (path: string): unknown => JSON.parse(readFileSync(path, "utf8"));
function safeChunk(root: string, path: string, language: Language, kind: Kind): string {
  if (!new RegExp(`^shared/${language}/${kind}/[a-f0-9]{2}\\.json$`).test(path)) throw new Error(`Invalid editorial chunk path: ${path}`);
  const actual = realpathSync(resolve(root, path));
  if (!actual.startsWith(realpathSync(root) + sep)) throw new Error("Editorial chunk escapes source directory");
  return actual;
}
export function readSharedSource(root: string, language: Language): SharedSource {
  const input = parse(resolve(root, `shared/${language}.json`)) as SharedPackage | SharedManifest;
  if (input.language !== language) throw new Error(`Invalid shared language: ${language}`);
  if (input.version === 1) {
    const quizzes = [...fromNeutral<SharedRecords>(input.content).quizItems, ...fromNeutral<ExpressionCatalog["preparedQuizzes"]>(input.preparedExpressionQuizzes)].map(quiz => prepareQuiz(quiz, language));
    return { legacy: input, quizzes, reviews: [] };
  }
  if (input.version !== 2) throw new Error("Unsupported shared source version");
  const records = {} as Record<Kind, { id: string }[]>;
  const paths = new Set<string>();
  for (const kind of kinds) {
    records[kind] = [];
    const ids = new Set<string>();
    if (!Array.isArray(input.files?.[kind])) throw new Error(`Missing source chunk list: ${kind}`);
    for (const path of input.files[kind]) {
      if (paths.has(path)) throw new Error(`Duplicate source path: ${path}`);
      paths.add(path);
      const chunk = parse(safeChunk(root, path, language, kind)) as { version: number; language: Language; kind: Kind; records: { id: string }[] };
      if (chunk.version !== 2 || chunk.language !== language || chunk.kind !== kind || !Array.isArray(chunk.records)) throw new Error(`Invalid source chunk: ${path}`);
      for (const item of chunk.records) {
        if (typeof item.id !== "string" || ids.has(item.id)) throw new Error(`Duplicate/missing ${kind} ID: ${item.id}`);
        if (chunkPath(language, kind, item.id) !== path) throw new Error(`Misplaced source record: ${item.id}`);
        ids.add(item.id); records[kind].push(item);
      }
    }
  }
  const quizzes = records.quizzes as PreparedQuiz[];
  for (const quiz of quizzes) {
    if (quiz.language !== language || quizStructureIssues(quiz).length) throw new Error(`Invalid authored quiz: ${quiz.id} (${quizStructureIssues(quiz).join(", ")})`);
  }
  const expressionRecords = records.expressions as (ExpressionCatalog["identities"][number] & { kind: string })[];
  if (expressionRecords.some(item => item.kind !== "learnable_expression")) throw new Error("Shared expressions must be explicitly learnable");
  const content = {
    lemmas: records.lemmas as ContentBundle["lemmas"], senses: records.senses as ContentBundle["senses"], surfaceForms: records.surfaceForms as ContentBundle["surfaceForms"],
    quizItems: quizzes.filter(quiz => quiz.subject.kind === "vocabulary").map(legacyQuiz) as ContentBundle["quizItems"],
  };
  const reviews = records.reviews as ReviewRecord[];
  if (reviews.some(review => review.language !== language || review.id !== `${review.kind}:${review.subjectId}`)) throw new Error("Invalid editorial review identity/language");
  return {
    legacy: { version: 1, language, content: toNeutral(content), expressionIdentities: expressionRecords.map(({ kind: _kind, ...identity }) => identity), preparedExpressionQuizzes: toNeutral(quizzes.filter(quiz => quiz.subject.kind === "expression").map(legacyQuiz) as ExpressionCatalog["preparedQuizzes"]) },
    quizzes, reviews,
  };
}
/** Fixed ID hash buckets: adding a record cannot renumber unrelated files. */
export function chunkPath(language: Language, kind: Kind, id: string): string {
  const bucket = (createHash("sha256").update(id).digest()[0]! % 64).toString(16).padStart(2, "0");
  return `shared/${language}/${kind}/${bucket}.json`;
}
export function sharedSourceFiles(source: SharedSource): Map<string, unknown> {
  const { language } = source.legacy;
  const content = fromNeutral<SharedRecords>(source.legacy.content);
  const records: Record<Kind, { id: string }[]> = { lemmas: content.lemmas, senses: content.senses, surfaceForms: content.surfaceForms, quizzes: source.quizzes, expressions: source.legacy.expressionIdentities.map(identity => ({ ...identity, kind: "learnable_expression" })), reviews: source.reviews };
  const files = new Map<string, unknown>();
  const manifest: SharedManifest = { version: 2, language, files: { lemmas: [], senses: [], surfaceForms: [], quizzes: [], expressions: [], reviews: [] } };
  for (const kind of kinds) {
    const buckets = new Map<string, { id: string }[]>();
    for (const item of records[kind]) {
      const path = chunkPath(language, kind, item.id);
      const group = buckets.get(path) ?? []; group.push(item); buckets.set(path, group);
    }
    for (const [path, group] of [...buckets].sort(([a], [b]) => a.localeCompare(b, "en"))) {
      manifest.files[kind].push(path);
      files.set(path, { version: 2, language, kind, records: group.sort((a, b) => a.id.localeCompare(b.id, "en")) });
    }
  }
  files.set(`shared/${language}.json`, manifest);
  return files;
}
export function workSourceV2(work: WorkPackage): WorkSourceV2 {
  const content = fromNeutral<WorkRecords>(work.content);
  const { expressions, ...neutralContent } = work.content;
  return { ...work, version: 2, content: neutralContent, textBinding: textBinding(content, work.expressionOccurrences, content.works[0]!.id), expressionNotes: expressions.map(note => ({ ...note, kind: "explanatory_note" })) };
}
export function readWorkSource(path: string): { legacy: WorkPackage; binding: TextBinding } {
  const input = parse(path) as WorkPackage | WorkSourceV2;
  if (input.version === 1) return { legacy: input, binding: textBinding(fromNeutral<WorkRecords>(input.content), input.expressionOccurrences, input.content.works[0]!.id) };
  if (input.version !== 2 || input.expressionNotes.some(note => note.kind !== "explanatory_note")) throw new Error(`Invalid work source: ${path}`);
  const { textBinding: binding, expressionNotes, ...rest } = input;
  const legacy: WorkPackage = { ...rest, version: 1, content: { ...input.content, expressions: expressionNotes.map(({ kind: _kind, ...note }) => note) } };
  assertTextBinding(binding, textBinding(fromNeutral<WorkRecords>(legacy.content), legacy.expressionOccurrences, legacy.content.works[0]!.id), legacy.content.works[0]!.id);
  return { legacy, binding };
}
/** Keep authored choice IDs and explicit targets when importing unchanged legacy data. */
export function reconcileQuizzes(old: SharedSource, next: SharedPackage): PreparedQuiz[] {
  const previous = new Map(old.quizzes.map(quiz => [quiz.id, quiz]));
  const incoming = [...fromNeutral<SharedRecords>(next.content).quizItems, ...fromNeutral<ExpressionCatalog["preparedQuizzes"]>(next.preparedExpressionQuizzes)];
  return incoming.map(quiz => {
    const before = previous.get(quiz.id);
    if (before && reviewRevision(legacyQuiz(before)) === reviewRevision(quiz)) return before;
    const after = prepareQuiz(quiz, next.language);
    if (!before) return after;
    // Text-preserving reordering retains IDs. New wording gets a new ID and review.
    const byText = new Map(before.choices.map(choice => [choice.text, choice.id]));
    let sequence = Math.max(0, ...before.choices.map(choice => Number(choice.id.replace("choice_", ""))).filter(Number.isFinite));
    const answer = after.choices.find(choice => choice.id === after.correctChoiceId)!.text;
    after.choices = after.choices.map(choice => ({ ...choice, id: byText.get(choice.text) ?? `choice_${++sequence}` }));
    after.correctChoiceId = after.choices.find(choice => choice.text === answer)!.id;
    return after;
  });
}
export function ensureQuizReviews(source: SharedSource): SharedSource {
  const reviews = new Map(source.reviews.map(review => [review.id, review]));
  for (const quiz of source.quizzes) if (!reviews.has(`quiz:${quiz.id}`)) reviews.set(`quiz:${quiz.id}`, pendingReview(quiz.language, "quiz", quiz.id, quiz));
  return { ...source, reviews: [...reviews.values()] };
}
/** Copy-on-write source transaction. Previous sources remain recoverable. */
export function adoptSourceFiles(root: string, files: ReadonlyMap<string, unknown>, validate: (stage: string) => void): string {
  const stage = mkdtempSync(resolve(dirname(root), ".publication-stage-"));
  cpSync(root, stage, { recursive: true });
  for (const [path, value] of files) {
    if (!/^[a-zA-Z0-9_/-]+\.json$/.test(path) || path.includes("..")) throw new Error("Invalid source output path");
    const destination = resolve(stage, path);
    const serialized = JSON.stringify(value, null, 2) + "\n";
    if (existsSync(destination) && readFileSync(destination, "utf8") === serialized) continue;
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, serialized);
  }
  validate(stage);
  const backup = stage.replace(".publication-stage-", ".publication-previous-");
  renameSync(root, backup);
  try { renameSync(stage, root); } catch (error) { renameSync(backup, root); throw error; }
  return backup;
}
