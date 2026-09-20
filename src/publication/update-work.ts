import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import { vocabularyIdentityKey } from "../domain/runtime.js";
import { toNeutral, fromNeutral } from "./format.js";
import { loadPublication, publicationRoot, sourceDigest, validatePublication, type SharedPackage, type WorkPackage, type WorkRecords } from "./repository.js";
import { adoptSourceFiles, readWorkSource, sharedSourceFiles, workSourceV2, reconcileQuizzes, ensureQuizReviews } from "./source-store.js";

/** Pure merge: only the requested work is replaced; shared identities are reused.
 * A changed shared definition/question needs explicit editorial acknowledgement. */
export function prepareWorkUpdate(current: ReturnType<typeof loadPublication>, incoming: ContentBundle, expressions: ExpressionCatalog, workId: string, replaceShared = false) {
  const entry = current.registry.works.find(entry => entry.id === workId && entry.status === "approved");
  if (!entry) throw new Error(`Approve this work in registry.json before importing: ${workId}`);
  const work = incoming.works.find(work => work.id === workId);
  if (!work) throw new Error(`Incoming package does not contain ${workId}`);
  const result = structuredClone(current);
  const bundle = result.bundle;
  const merge = <T extends { id: string }>(existing: T[], additions: T[], shared = false): T[] => {
    const map = new Map(existing.map(item => [item.id, item]));
    for (const item of additions) {
      const previous = map.get(item.id);
      if (shared && previous && !isDeepStrictEqual(previous, item) && !replaceShared) throw new Error(`Shared record differs (${item.id}); review its cross-work impact and explicitly allow replacement`);
      map.set(item.id, item);
    }
    return [...map.values()];
  };
  const book = incoming.books.find(book => book.id === work.bookId)!;
  const collection = incoming.collections.find(collection => collection.id === book?.collectionId)!;
  const author = incoming.authors.find(author => author.id === collection?.authorId)!;
  if (!book || !collection || !author || collection.language !== entry.language) throw new Error("Incoming work language or catalog references do not match approval");
  bundle.authors = merge(bundle.authors, [author], true);
  bundle.collections = merge(bundle.collections, [collection], true);
  bundle.books = merge(bundle.books, [book], true);
  bundle.works = bundle.works.map(existing => existing.id === workId ? { ...existing, ...work } : existing);
  for (const key of ["sources", "units", "occurrences", "exclusions", "expressions", "notes", "readiness"] as const) {
    (bundle[key] as { workId: string }[]) = [...bundle[key].filter(item => item.workId !== workId), ...incoming[key].filter(item => item.workId === workId)];
  }
  const occurrences = incoming.occurrences.filter(item => item.workId === workId);
  const oldOccurrences = new Map(current.bundle.occurrences.filter(item => item.workId === workId).map(item => [item.id, item]));
  for (const occurrence of occurrences) {
    const old = oldOccurrences.get(occurrence.id);
    if (old && vocabularyIdentityKey(old.surfaceFormId, old.senseId) !== vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId)) throw new Error(`Explicit learner-identity migration required before reassigning ${occurrence.id}; --replace-shared does not authorize sense merges or splits`);
  }
  const surfaces = new Set(occurrences.map(item => item.surfaceFormId));
  const senses = new Set(occurrences.map(item => item.senseId));
  const lemmas = new Set(incoming.surfaceForms.filter(item => surfaces.has(item.id)).map(item => item.lemmaId));
  const identities = new Set(occurrences.map(item => vocabularyIdentityKey(item.surfaceFormId, item.senseId)));
  bundle.lemmas = merge(bundle.lemmas, incoming.lemmas.filter(item => lemmas.has(item.id)), true);
  bundle.senses = merge(bundle.senses, incoming.senses.filter(item => senses.has(item.id)), true);
  bundle.surfaceForms = merge(bundle.surfaceForms, incoming.surfaceForms.filter(item => surfaces.has(item.id)), true);
  bundle.quizItems = merge(bundle.quizItems, incoming.quizItems.filter(item => identities.has(vocabularyIdentityKey(item.surfaceFormId, item.senseId))), true);
  const expressionOccurrences = expressions.occurrences.filter(item => item.workId === workId);
  const expressionIds = new Set(expressionOccurrences.map(item => item.identityId));
  result.expressionCatalog.occurrences = [...result.expressionCatalog.occurrences.filter(item => item.workId !== workId), ...expressionOccurrences];
  result.expressionCatalog.identities = merge(result.expressionCatalog.identities, expressions.identities.filter(item => expressionIds.has(item.id)), true);
  result.expressionCatalog.preparedQuizzes = merge(result.expressionCatalog.preparedQuizzes, expressions.preparedQuizzes.filter(item => expressionIds.has(item.expressionId)), true);
  result.registry.catalog = { authors: bundle.authors, collections: bundle.collections, books: bundle.books };
  validatePublication(bundle, result.expressionCatalog, result.registry);
  return result;
}

export function importApprovedWork(incoming: ContentBundle, expressions: ExpressionCatalog, workId: string, replaceShared = false, root = publicationRoot): string {
  const current = loadPublication(root);
  const next = prepareWorkUpdate(current, incoming, expressions, workId, replaceShared);
  const entry = next.registry.works.find(entry => entry.id === workId)!;
  const original = readWorkSource(resolve(root, `works/${workId}.json`)).legacy;
  const content: WorkRecords = { works: next.bundle.works.filter(item => item.id === workId), sources: [], units: [], occurrences: [], exclusions: [], expressions: [], notes: [], readiness: [] };
  for (const key of ["sources", "units", "occurrences", "exclusions", "expressions", "notes", "readiness"] as const) (content[key] as unknown[]) = next.bundle[key].filter(item => item.workId === workId);
  const work: WorkPackage = { ...original, sourceDigest: sourceDigest(content.sources), content: toNeutral(content), expressionOccurrences: next.expressionCatalog.occurrences.filter(item => item.workId === workId) };
  const shared: SharedPackage = structuredClone(current.sharedSources[entry.language].legacy);
  const previousShared = fromNeutral(shared.content);
  const otherLanguage = entry.language === "fr" ? "es" : "fr";
  const other = current.sharedSources[otherLanguage].legacy;
  const foreign = fromNeutral(other.content);
  for (const key of ["lemmas", "senses", "surfaceForms", "quizItems"] as const) {
    const foreignIds = new Set(foreign[key].map(item => item.id));
    (previousShared[key] as { id: string }[]) = next.bundle[key].filter(item => !foreignIds.has(item.id));
  }
  shared.content = toNeutral(previousShared);
  const foreignExpressions = new Set(other.expressionIdentities.map(item => item.id));
  shared.expressionIdentities = next.expressionCatalog.identities.filter(item => !foreignExpressions.has(item.id));
  shared.preparedExpressionQuizzes = toNeutral(next.expressionCatalog.preparedQuizzes.filter(item => !foreignExpressions.has(item.expressionId)));
  const updated = ensureQuizReviews({ legacy: shared, quizzes: reconcileQuizzes(current.sharedSources[entry.language], shared), reviews: current.sharedSources[entry.language].reviews });
  const files = sharedSourceFiles(updated);
  files.set(`works/${workId}.json`, workSourceV2(work));
  files.set("registry.json", next.registry);
  return adoptSourceFiles(root, files, stage => {
    const staged = loadPublication(stage);
    validatePublication(staged.bundle, staged.expressionCatalog, staged.registry);
  });
}
