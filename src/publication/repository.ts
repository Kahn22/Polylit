import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import { validateContentBundle } from "../domain/validate.js";
import { validateExpressionCatalog } from "../domain/expression-content.js";
import { fromNeutral, type Language, type Neutral } from "./format.js";
import { readSharedSource, readWorkSource, type SharedSource } from "./source-store.js";
import { textBinding, type TextBinding } from "./revisions.js";
import type { PreparedQuiz } from "../domain/prepared-quiz.js";
import type { ReviewRecord } from "./editorial.js";

export interface PublicationRegistry {
  version: 1;
  catalog: Pick<ContentBundle, "authors" | "collections" | "books">;
  works: { id: string; language: Language; status: "approved" | "retired"; retirementReason?: string }[];
}
export type WorkRecords = Pick<ContentBundle, "works" | "sources" | "units" | "occurrences" | "exclusions" | "expressions" | "notes" | "readiness">;
export type SharedRecords = Pick<ContentBundle, "lemmas" | "senses" | "surfaceForms" | "quizItems">;
export interface WorkPackage { version: 1; language: Language; sourceDigest: string; content: Neutral<WorkRecords>; expressionOccurrences: ExpressionCatalog["occurrences"]; editorialReviewFiles: string[] }
export interface SharedPackage { version: 1; language: Language; content: Neutral<SharedRecords>; expressionIdentities: ExpressionCatalog["identities"]; preparedExpressionQuizzes: Neutral<ExpressionCatalog["preparedQuizzes"]> }
export const publicationRoot = resolve(import.meta.dirname, "../..", "content/published");
export function sourceDigest(sources: ContentBundle["sources"]): string { return createHash("sha256").update(JSON.stringify(sources)).digest("hex"); }
export function readRegistry(root = publicationRoot): PublicationRegistry { return JSON.parse(readFileSync(resolve(root, "registry.json"), "utf8")); }

/** Approval lives outside producers. A rebuild cannot silently remove or add works. */
export function assertApprovedWorks(bundle: ContentBundle, registry: PublicationRegistry): void {
  if (registry.version !== 1) throw new Error("Unsupported publication registry");
  const approved = new Set<string>();
  const seen = new Set<string>();
  for (const entry of registry.works) {
    if (!/^wrk_[a-z0-9_-]+$/.test(entry.id) || seen.has(entry.id)) throw new Error(`Invalid/duplicate registry work: ${entry.id}`);
    seen.add(entry.id);
    if (entry.status === "retired") { if (!entry.retirementReason?.trim()) throw new Error(`Explicit retirement reason required: ${entry.id}`); }
    else if (entry.status === "approved" && ["fr", "es"].includes(entry.language)) approved.add(entry.id);
    else throw new Error(`Invalid approval: ${entry.id}`);
  }
  const actual = new Set(bundle.works.map(work => work.id));
  for (const id of approved) if (!actual.has(id)) throw new Error(`Publication blocked: approved work missing (${id})`);
  for (const work of bundle.works) {
    if (!approved.has(work.id)) throw new Error(`Publication blocked: work not approved (${work.id})`);
    if (!["learning_ready", "published"].includes(work.publicationState)) throw new Error(`Publication blocked: work is not ready (${work.id})`);
    const book = bundle.books.find(book => book.id === work.bookId);
    const language = bundle.collections.find(collection => collection.id === book?.collectionId)?.language;
    if (language !== registry.works.find(entry => entry.id === work.id)?.language) throw new Error(`Language mismatch: ${work.id}`);
  }
  if (actual.size !== bundle.works.length) throw new Error("Duplicate published work");
}

export function loadPublication(root = publicationRoot): { bundle: ContentBundle; expressionCatalog: ExpressionCatalog; registry: PublicationRegistry; preparedQuizzes: Map<string, PreparedQuiz>; reviews: ReviewRecord[]; textBindings: Map<string, TextBinding>; sharedSources: Record<Language, SharedSource> } {
  const registry = readRegistry(root);
  const bundle: ContentBundle = { ...registry.catalog, works: [], sources: [], units: [], lemmas: [], senses: [], surfaceForms: [], occurrences: [], exclusions: [], expressions: [], notes: [], quizItems: [], readiness: [] };
  const expressionCatalog: ExpressionCatalog = { identities: [], occurrences: [], preparedQuizzes: [] };
  const sharedLanguages = new Map<string, Language>();
  const expressionLanguages = new Map<string, Language>();
  const preparedQuizzes = new Map<string, PreparedQuiz>();
  const reviews: ReviewRecord[] = [];
  const textBindings = new Map<string, TextBinding>();
  const sharedSources = {} as Record<Language, SharedSource>;
  for (const language of ["fr", "es"] as const) {
    const source = readSharedSource(root, language);
    sharedSources[language] = source;
    const shared = source.legacy;
    for (const quiz of source.quizzes) {
      if (preparedQuizzes.has(quiz.id)) throw new Error(`Duplicate authored quiz ID: ${quiz.id}`);
      preparedQuizzes.set(quiz.id, quiz);
    }
    reviews.push(...source.reviews);
    if (shared.version !== 1 || shared.language !== language) throw new Error(`Invalid shared package: ${language}`);
    const content = fromNeutral<SharedRecords>(shared.content);
    for (const key of ["lemmas", "senses", "surfaceForms", "quizItems"] as const) {
      for (const item of content[key]) { if (sharedLanguages.has(item.id)) throw new Error(`Shared ID belongs to two language packages: ${item.id}`); sharedLanguages.set(item.id, language); }
      (bundle[key] as { id: string }[]).push(...content[key]);
    }
    expressionCatalog.identities.push(...shared.expressionIdentities);
    expressionCatalog.preparedQuizzes.push(...fromNeutral<ExpressionCatalog["preparedQuizzes"]>(shared.preparedExpressionQuizzes));
    for (const identity of shared.expressionIdentities) {
      if (expressionLanguages.has(identity.id)) throw new Error(`Expression belongs to two language packages: ${identity.id}`);
      expressionLanguages.set(identity.id, language);
    }
    for (const quiz of fromNeutral(shared.preparedExpressionQuizzes)) if (expressionLanguages.get(quiz.expressionId) !== language) throw new Error(`Cross-language expression quiz: ${quiz.id}`);
    for (const sense of content.senses) if (sharedLanguages.get(sense.lemmaId) !== language) throw new Error(`Cross-language lemma reference: ${sense.id}`);
    for (const surface of content.surfaceForms) if (sharedLanguages.get(surface.lemmaId) !== language) throw new Error(`Cross-language lemma reference: ${surface.id}`);
    for (const quiz of content.quizItems) if (sharedLanguages.get(quiz.surfaceFormId) !== language || sharedLanguages.get(quiz.senseId) !== language) throw new Error(`Cross-language quiz reference: ${quiz.id}`);
  }
  for (const entry of registry.works.filter(entry => entry.status === "approved")) {
    if (!/^wrk_[a-z0-9_-]+$/.test(entry.id)) throw new Error("Invalid registry path");
    const source = readWorkSource(resolve(root, `works/${entry.id}.json`));
    const work = source.legacy;
    textBindings.set(entry.id, source.binding);
    const content = fromNeutral<WorkRecords>(work.content);
    if (work.version !== 1 || work.language !== entry.language || content.works.length !== 1 || content.works[0]?.id !== entry.id) throw new Error(`Invalid work package: ${entry.id}`);
    if (sourceDigest(content.sources) !== work.sourceDigest) throw new Error(`Canonical source changed without editorial acknowledgement: ${entry.id}`);
    for (const occurrence of content.occurrences) if (sharedLanguages.get(occurrence.surfaceFormId) !== entry.language || sharedLanguages.get(occurrence.senseId) !== entry.language) throw new Error(`Cross-language vocabulary reference: ${occurrence.id}`);
    for (const occurrence of work.expressionOccurrences) if (expressionLanguages.get(occurrence.identityId) !== entry.language) throw new Error(`Cross-language expression reference: ${occurrence.id}`);
    for (const key of ["works", "sources", "units", "occurrences", "exclusions", "expressions", "notes", "readiness"] as const) (bundle[key] as unknown[]).push(...content[key]);
    expressionCatalog.occurrences.push(...work.expressionOccurrences);
  }
  assertApprovedWorks(bundle, registry);
  return { bundle, expressionCatalog, registry, preparedQuizzes, reviews, textBindings, sharedSources };
}

export function validatePublication(bundle: ContentBundle, catalog: ExpressionCatalog, registry: PublicationRegistry): void {
  assertApprovedWorks(bundle, registry);
  const validation = validateContentBundle(bundle);
  if (!validation.ok) throw new Error(`Publication validation failed: ${JSON.stringify(validation.diagnostics.slice(0, 5))}`);
  const diagnostics = validateExpressionCatalog(bundle, catalog);
  if (diagnostics.length) throw new Error(`Expression validation failed: ${JSON.stringify(diagnostics.slice(0, 5))}`);
  for (const work of bundle.works) textBinding(bundle, catalog.occurrences, work.id);
}
