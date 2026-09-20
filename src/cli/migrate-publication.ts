/** One-time, non-overwriting migration. No text, quiz, or mastery identity is authored here. */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import { publicationRoot, sourceDigest, validatePublication, type PublicationRegistry, type SharedPackage, type WorkPackage } from "../publication/repository.js";
import { toNeutral } from "../publication/format.js";
const root = resolve(import.meta.dirname, "../..");
if (existsSync(resolve(publicationRoot, "registry.json"))) throw new Error("Migration already completed; existing publication packages will not be overwritten");
const bundle: ContentBundle = JSON.parse(readFileSync(resolve(root, "content/learning/jaccuse.json"), "utf8"));
const expressions: ExpressionCatalog = JSON.parse(readFileSync(resolve(root, "content/learning/jaccuse-expressions.json"), "utf8"));
const registry: PublicationRegistry = { version: 1, catalog: { authors: bundle.authors, collections: bundle.collections, books: bundle.books }, works: bundle.works.map(work => ({ id: work.id, status: "approved", language: bundle.collections.find(collection => collection.id === bundle.books.find(book => book.id === work.bookId)!.collectionId)!.language })) };
validatePublication(bundle, expressions, registry);
const spanishWorks = new Set(registry.works.filter(work => work.language === "es").map(work => work.id));
const spanishOccurrences = bundle.occurrences.filter(occurrence => spanishWorks.has(occurrence.workId));
const spanishSurfaces = new Set(spanishOccurrences.map(item => item.surfaceFormId));
const spanishSenses = new Set(spanishOccurrences.map(item => item.senseId));
const spanishLemmas = new Set(bundle.surfaceForms.filter(item => spanishSurfaces.has(item.id)).map(item => item.lemmaId));
const spanishExpressions = new Set(expressions.occurrences.filter(item => spanishWorks.has(item.workId)).map(item => item.identityId));
const files = new Map<string, unknown>();
files.set("registry.json", registry);
for (const language of ["fr", "es"] as const) {
  const include = (spanish: boolean) => (language === "es") === spanish;
  const shared: SharedPackage = { version: 1, language, content: toNeutral({ lemmas: bundle.lemmas.filter(item => include(spanishLemmas.has(item.id))), senses: bundle.senses.filter(item => include(spanishSenses.has(item.id))), surfaceForms: bundle.surfaceForms.filter(item => include(spanishSurfaces.has(item.id))), quizItems: bundle.quizItems.filter(item => include(spanishSurfaces.has(item.surfaceFormId))) }), expressionIdentities: expressions.identities.filter(item => include(spanishExpressions.has(item.id))), preparedExpressionQuizzes: toNeutral(expressions.preparedQuizzes.filter(item => include(spanishExpressions.has(item.expressionId)))) };
  files.set(`shared/${language}.json`, shared);
}
const reviewFiles = readdirSync(resolve(root, "content/review"));
for (const entry of registry.works) {
  const id = entry.id;
  const content = { works: bundle.works.filter(item => item.id === id), sources: bundle.sources.filter(item => item.workId === id), units: bundle.units.filter(item => item.workId === id), occurrences: bundle.occurrences.filter(item => item.workId === id), exclusions: bundle.exclusions.filter(item => item.workId === id), expressions: bundle.expressions.filter(item => item.workId === id), notes: bundle.notes.filter(item => item.workId === id), readiness: bundle.readiness.filter(item => item.workId === id) };
  const work: WorkPackage = { version: 1, language: entry.language, sourceDigest: sourceDigest(content.sources), content: toNeutral(content), expressionOccurrences: expressions.occurrences.filter(item => item.workId === id), editorialReviewFiles: reviewFiles.filter(file => file.startsWith(id + ".")).map(file => `content/review/${file}`) };
  files.set(`works/${id}.json`, work);
}
mkdirSync(resolve(publicationRoot, "shared"), { recursive: true });
mkdirSync(resolve(publicationRoot, "works"), { recursive: true });
for (const [path, value] of files) writeFileSync(resolve(publicationRoot, path), JSON.stringify(value) + "\n", { flag: "wx" });
console.log(`Migrated ${registry.works.length} approved works without changing text, questions, or identity keys.`);
