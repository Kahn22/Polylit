import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import type { Language, LibraryIndex, ReadingSection } from "../delivery/types.js";
import { ContentLoader } from "./content-loader.js";

const contentBaseUrl = import.meta.env.DEV ? `${import.meta.env.BASE_URL}content` : new URL("../content/", import.meta.url).href;
export const contentLoader = new ContentLoader(contentBaseUrl);
export let libraryIndex: LibraryIndex;
export const expressionCatalog: Pick<ExpressionCatalog, "identities" | "occurrences"> = { identities: [], occurrences: [] };
export const bundle: Pick<ContentBundle, "authors" | "collections" | "books" | "works" | "occurrences" | "lemmas" | "senses" | "surfaceForms" | "expressions" | "notes"> & { units: ReadingSection["units"] } = {
  authors: [], collections: [], books: [], works: [], units: [], lemmas: [], senses: [], surfaceForms: [], occurrences: [], expressions: [], notes: [],
};
export const contentIndex = {
  surfaces: new Map<string, ContentBundle["surfaceForms"][number]>(),
  senses: new Map<string, ContentBundle["senses"][number]>(),
  lemmas: new Map<string, ContentBundle["lemmas"][number]>(),
  occurrences: new Map<string, ContentBundle["occurrences"][number]>(),
};
export async function initializeAppShell(language: Language): Promise<void> {
  libraryIndex = await contentLoader.library(language);
  Object.assign(bundle, libraryIndex.catalog);
}
export async function loadReadingSection(workId: string, index: number): Promise<ReadingSection> {
  const section = await contentLoader.section(workId, index);
  // Only active-section linguistic data is retained in the UI; bounded loader
  // caching serves back-navigation without repeatedly merging growing arrays.
  Object.assign(bundle, { units: section.units, occurrences: section.occurrences, lemmas: section.lemmas, senses: section.senses, surfaceForms: section.surfaceForms, expressions: section.expressions, notes: section.notes });
  Object.assign(expressionCatalog, section.expressionCatalog);
  for (const [target, records] of [[contentIndex.surfaces, section.surfaceForms], [contentIndex.senses, section.senses], [contentIndex.lemmas, section.lemmas], [contentIndex.occurrences, section.occurrences]] as const) {
    target.clear();
    for (const record of records) (target as Map<string, unknown>).set(record.id, record);
  }
  return section;
}
