import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import type { Neutral, Language } from "../publication/format.js";
export type { Language };
export type { PreparedQuiz as Quiz } from "../domain/prepared-quiz.js";
import type { PreparedQuiz as Quiz } from "../domain/prepared-quiz.js";
export type Unit = Neutral<ContentBundle["units"][number]>;
export interface LibraryIndex {
  version: 3;
  language: Language;
  release: string;
  catalog: Pick<ContentBundle, "authors" | "collections" | "books" | "works">;
  works: Record<string, { sectionCount: number; vocabularyTokens: string[]; expressionIdentityKeys: string[]; manifest: string }>;
  quizzes: string;
}
export interface WorkManifest { version: 1; language: Language; workId: string; sections: string[]; bookPages: string[] }
export interface ReadingSection {
  version: 1;
  language: Language;
  workId: string;
  index: number;
  units: Unit[];
  occurrences: ContentBundle["occurrences"];
  lemmas: ContentBundle["lemmas"];
  senses: ContentBundle["senses"];
  surfaceForms: ContentBundle["surfaceForms"];
  expressions: ContentBundle["expressions"];
  notes: ContentBundle["notes"];
  expressionCatalog: Pick<ExpressionCatalog, "identities" | "occurrences">;
}
export interface BookPage { version: 1; language: Language; workId: string; index: number; units: Pick<Unit, "id" | "ordinal" | "text">[] }
export interface QuizRecord { identity: string; label: string; items: Quiz[] }
export interface QuizPackage { version: 2; language: Language; records: QuizRecord[] }
export interface QuizIndex { version: 2; language: Language; shards: Record<string, string> }
