import { createHash } from "node:crypto";
import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import { vocabularyIdentityKey, expressionMasteryKey } from "../domain/runtime.js";
import { toNeutral } from "../publication/format.js";
import { createDeliveryPackages } from "./content-packages.js";
import { identityToken, quizShard } from "./identity-token.js";
import type { BookPage, LibraryIndex, QuizIndex, QuizPackage, QuizRecord, ReadingSection, WorkManifest, Language } from "./types.js";
import type { PreparedQuiz } from "../domain/prepared-quiz.js";
import { prepareQuiz, legacyQuiz, quizStructureIssues } from "../publication/quiz-authoring.js";
import { stableJson } from "../publication/revisions.js";

export const BOOK_SECTIONS_PER_PAGE = 8;
export function createCompactPackages(bundle: ContentBundle, expressions: ExpressionCatalog, authored?: ReadonlyMap<string, PreparedQuiz>) {
  const legacy = createDeliveryPackages(bundle, expressions);
  const files = new Map<string, string>();
  const digest = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 20);
  const add = (folder: string, value: unknown) => {
    const data = JSON.stringify(value) + "\n";
    const path = `${folder}/${digest(data)}.json`;
    files.set(path, data);
    return path;
  };
  const surfaces = new Map(bundle.surfaceForms.map(item => [item.id, item]));
  const tokenKeys = new Map<string, string>();
  const token = (key: string) => {
    const result = identityToken(key);
    if (tokenKeys.has(result) && tokenKeys.get(result) !== key) throw new Error(`Compact identity collision: ${key}`);
    tokenKeys.set(result, key);
    return result;
  };
  const libraryIndexes = {} as Record<Language, LibraryIndex>;
  const prepared = (quiz: ContentBundle["quizItems"][number] | ExpressionCatalog["preparedQuizzes"][number], language: Language) => {
    const result = authored?.get(quiz.id) ?? prepareQuiz(quiz, language);
    if (result.language !== language || quizStructureIssues(result).length || stableJson(legacyQuiz(result)) !== stableJson(quiz)) throw new Error(`Prepared quiz does not match source: ${quiz.id}`);
    return result;
  };
  for (const language of ["fr", "es"] as const) {
    const library = legacy.libraryIndexes[language];
    const workIds = new Set(library.catalog.works.map(work => work.id));
    const identityKeys = new Set(Object.values(library.works).flatMap(work => work.vocabularyIdentityKeys));
    const expressionIds = new Set(expressions.occurrences.filter(item => workIds.has(item.workId)).map(item => item.identityId));
    const records = new Map<string, QuizRecord>();
    for (const quiz of bundle.quizItems) {
      const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
      if (!identityKeys.has(key)) continue;
      const record = records.get(key) ?? { identity: key, label: surfaces.get(quiz.surfaceFormId)!.form, items: [] };
      record.items.push(prepared(quiz, language)); records.set(key, record);
    }
    for (const quiz of expressions.preparedQuizzes) {
      if (!expressionIds.has(quiz.expressionId)) continue;
      const key = expressionMasteryKey(quiz.expressionId);
      const record = records.get(key) ?? { identity: key, label: expressions.identities.find(item => item.id === quiz.expressionId)!.headword, items: [] };
      record.items.push(prepared(quiz, language)); records.set(key, record);
    }
    const buckets = new Map<string, QuizRecord[]>();
    for (const [key, record] of [...records].sort(([a], [b]) => a.localeCompare(b))) {
      token(key);
      if (record.items.length !== 3 || new Set(record.items.map(item => item.band)).size !== 3) throw new Error(`Expected all three quiz bands: ${key}`);
      record.items.sort((a, b) => a.band.localeCompare(b.band));
      const shard = quizShard(key); const group = buckets.get(shard) ?? [];
      group.push(record); buckets.set(shard, group);
    }
    const quizzes: QuizIndex = { version: 2, language, shards: {} };
    for (const [shard, group] of [...buckets].sort(([a], [b]) => a.localeCompare(b))) {
      const payload: QuizPackage = { version: 2, language, records: group };
      quizzes.shards[shard] = add(`quizzes/${language}`, payload);
    }
    const works: LibraryIndex["works"] = {};
    for (const work of library.catalog.works) {
      const sections = legacy.readingSections.filter(section => section.workId === work.id);
      const manifest: WorkManifest = { version: 1, language, workId: work.id, sections: [], bookPages: [] };
      for (const section of sections) {
        const unitIds = new Set(section.units.map(unit => unit.id));
        const occurrences = expressions.occurrences.filter(item => unitIds.has(item.unitId));
        const ids = new Set(occurrences.map(item => item.identityId));
        const payload: ReadingSection = { version: 1, language, ...toNeutral(section), expressionCatalog: { identities: expressions.identities.filter(item => ids.has(item.id)), occurrences } };
        manifest.sections.push(add(`reading/${language}`, payload));
      }
      for (let start = 0; start < sections.length; start += BOOK_SECTIONS_PER_PAGE) {
        const page: BookPage = { version: 1, language, workId: work.id, index: start / BOOK_SECTIONS_PER_PAGE, units: sections.slice(start, start + BOOK_SECTIONS_PER_PAGE).flatMap(section => section.units.map(unit => ({ id: unit.id, ordinal: unit.ordinal, text: unit.french }))) };
        manifest.bookPages.push(add(`books/${language}`, page));
      }
      works[work.id] = { sectionCount: sections.length, vocabularyTokens: library.works[work.id]!.vocabularyIdentityKeys.map(token), expressionIdentityKeys: library.works[work.id]!.expressionIdentityKeys, manifest: add(`works/${language}`, manifest) };
    }
    const index: LibraryIndex = { version: 3, language, release: "", catalog: library.catalog, works, quizzes: add(`quiz-index/${language}`, quizzes) };
    index.release = digest(JSON.stringify(index));
    libraryIndexes[language] = index;
    files.set(`library/${language}.json`, JSON.stringify(index) + "\n");
  }
  return { files, libraryIndexes };
}
