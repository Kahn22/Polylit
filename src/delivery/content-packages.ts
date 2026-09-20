import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";
import { vocabularyIdentityKey } from "../domain/model.js";

export const READING_SECTION_TARGET_WORDS = 120;
export const READING_SECTION_MIN_WORDS = 80;
export const READING_SECTION_MAX_WORDS = 150;
export const QUIZ_BATCH_SIZE = 10;
export const QUIZ_PREFETCH_REMAINING = 3;

type Unit = ContentBundle["units"][number];
type Occurrence = ContentBundle["occurrences"][number];

export interface ReadingSectionPackage {
  workId: string;
  index: number;
  units: Unit[];
  occurrences: Occurrence[];
  lemmas: ContentBundle["lemmas"];
  senses: ContentBundle["senses"];
  surfaceForms: ContentBundle["surfaceForms"];
  expressions: ContentBundle["expressions"];
  notes: ContentBundle["notes"];
}

export interface QuizBatchPackage {
  index: number;
  identityKeys: string[];
  quizItems: ContentBundle["quizItems"];
}

export interface DeliveryManifest {
  version: 2;
  readingSectionTargetWords: 120;
  quizBatchSize: 10;
  quizPrefetchRemaining: 3;
  catalog: Pick<ContentBundle, "authors" | "collections" | "books" | "works">;
  expressionCatalog: ExpressionCatalog;
  works: Record<string, { sectionCount: number }>;
  quizBatchForIdentity: Record<string, number>;
  identityLocations: Record<string, { workId: string; sectionIndex: number }[]>;
}

export type DeliveryLanguage = "fr" | "es";

export interface LanguageLibraryIndex {
  version: 1;
  language: DeliveryLanguage;
  catalog: Pick<ContentBundle, "authors" | "collections" | "books" | "works">;
  works: Record<string, { sectionCount: number; vocabularyIdentityKeys: string[]; expressionIdentityKeys: string[] }>;
}

export interface LanguageLearningManifest {
  version: 1;
  language: DeliveryLanguage;
  quizBatchSize: 10;
  quizPrefetchRemaining: 3;
  expressionCatalog: ExpressionCatalog;
  quizBatchForIdentity: Record<string, number>;
  identityLocations: Record<string, { workId: string; sectionIndex: number }[]>;
}

export interface DeliveryPackages {
  manifest: DeliveryManifest;
  libraryIndexes: Record<DeliveryLanguage, LanguageLibraryIndex>;
  learningManifests: Record<DeliveryLanguage, LanguageLearningManifest>;
  readingSections: ReadingSectionPackage[];
  quizBatches: QuizBatchPackage[];
}

/** Builds deterministic, cacheable payloads without duplicating derivable records globally. */
export function createDeliveryPackages(bundle: ContentBundle, expressionCatalog: ExpressionCatalog = { identities: [], occurrences: [], preparedQuizzes: [] }): DeliveryPackages {
  const readingSections = bundle.works.flatMap((work) => bundle.units
    .filter((unit) => unit.workId === work.id)
    .sort((a, b) => a.ordinal - b.ordinal)
    .reduce<Unit[][]>((passages, unit) => {
      const current = passages.at(-1);
      if (!current) { passages.push([unit]); return passages; }
      const currentWords = current.reduce((total, item) => total + wordCount(item.french), 0);
      const nextWords = wordCount(unit.french);
      const mayClose = current.length >= 2 && currentWords >= READING_SECTION_MIN_WORDS;
      if (mayClose && (currentWords >= READING_SECTION_TARGET_WORDS || currentWords + nextWords > READING_SECTION_MAX_WORDS)) passages.push([unit]);
      else current.push(unit);
      return passages;
    }, [])
    .map((units, index) => createReadingSection(bundle, work.id, units, index)));

  // A short final thought belongs with the passage before it rather than being
  // presented as a one-sentence reading exercise.
  for (const work of bundle.works) {
    const workSections = readingSections.filter((section) => section.workId === work.id);
    const finalSection = workSections.at(-1);
    const previousSection = workSections.at(-2);
    if (finalSection?.units.length === 1 && previousSection) {
      previousSection.units.push(...finalSection.units);
      readingSections.splice(readingSections.indexOf(finalSection), 1);
      refreshReadingSectionData(bundle, previousSection);
    }
    readingSections.filter((section) => section.workId === work.id).forEach((section, index) => { section.index = index; });
  }

  const quizByIdentity = new Map<string, ContentBundle["quizItems"]>();
  for (const quiz of bundle.quizItems) {
    const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
    const items = quizByIdentity.get(key) ?? [];
    items.push(quiz);
    quizByIdentity.set(key, items);
  }
  const identities = [...quizByIdentity].sort(([a], [b]) => a.localeCompare(b));
  const quizBatches: QuizBatchPackage[] = [];
  const quizBatchForIdentity: Record<string, number> = {};
  const identityLocations: DeliveryManifest["identityLocations"] = {};
  for (const section of readingSections) {
    for (const occurrence of section.occurrences) {
      const key = vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId);
      const locations = identityLocations[key] ?? [];
      if (!locations.some((location) => location.workId === section.workId && location.sectionIndex === section.index)) {
        locations.push({ workId: section.workId, sectionIndex: section.index });
      }
      identityLocations[key] = locations;
    }
  }
  for (let offset = 0; offset < identities.length; offset += QUIZ_BATCH_SIZE) {
    const group = identities.slice(offset, offset + QUIZ_BATCH_SIZE);
    const index = quizBatches.length;
    for (const [key] of group) quizBatchForIdentity[key] = index;
    quizBatches.push({ index, identityKeys: group.map(([key]) => key), quizItems: group.flatMap(([, items]) => items) });
  }
  const manifest: DeliveryManifest = {
      version: 2,
      readingSectionTargetWords: READING_SECTION_TARGET_WORDS,
      quizBatchSize: QUIZ_BATCH_SIZE,
      quizPrefetchRemaining: QUIZ_PREFETCH_REMAINING,
      catalog: { authors: bundle.authors, collections: bundle.collections, books: bundle.books, works: bundle.works },
      expressionCatalog,
      works: Object.fromEntries(bundle.works.map((work) => [work.id, {
        sectionCount: readingSections.filter((section) => section.workId === work.id).length,
      }])),
      quizBatchForIdentity,
      identityLocations,
  };
  const languagePackages = Object.fromEntries((["fr", "es"] as const).map((language) => {
    const collections = bundle.collections.filter((collection) => collection.language === language);
    const collectionIds = new Set(collections.map((collection) => collection.id));
    const books = bundle.books.filter((book) => collectionIds.has(book.collectionId));
    const bookIds = new Set(books.map((book) => book.id));
    const works = bundle.works.filter((work) => bookIds.has(work.bookId));
    const workIds = new Set(works.map((work) => work.id));
    const authorIds = new Set(collections.map((collection) => collection.authorId));
    const expressionOccurrences = expressionCatalog.occurrences.filter((occurrence) => workIds.has(occurrence.workId));
    const expressionIds = new Set(expressionOccurrences.map((occurrence) => occurrence.identityId));
    const filteredLocations = Object.fromEntries(Object.entries(identityLocations).flatMap(([identity, locations]) => {
      const relevant = locations.filter((location) => workIds.has(location.workId));
      return relevant.length ? [[identity, relevant]] : [];
    }));
    const workIndex = Object.fromEntries(works.map((work) => [work.id, {
      sectionCount: manifest.works[work.id]?.sectionCount ?? 0,
      vocabularyIdentityKeys: Object.entries(filteredLocations).filter(([, locations]) => locations.some((location) => location.workId === work.id)).map(([identity]) => identity),
      expressionIdentityKeys: [...new Set(expressionOccurrences.filter((occurrence) => occurrence.workId === work.id).map((occurrence) => occurrence.identityId))],
    }]));
    const libraryIndex: LanguageLibraryIndex = {
      version: 1,
      language,
      catalog: {
        authors: bundle.authors.filter((author) => authorIds.has(author.id)),
        collections,
        books,
        works,
      },
      works: workIndex,
    };
    const learningManifest: LanguageLearningManifest = {
      version: 1,
      language,
      quizBatchSize: QUIZ_BATCH_SIZE,
      quizPrefetchRemaining: QUIZ_PREFETCH_REMAINING,
      expressionCatalog: {
        identities: expressionCatalog.identities.filter((identity) => expressionIds.has(identity.id)),
        occurrences: expressionOccurrences,
        preparedQuizzes: expressionCatalog.preparedQuizzes.filter((quiz) => expressionIds.has(quiz.expressionId)),
      },
      quizBatchForIdentity: Object.fromEntries(Object.keys(filteredLocations).flatMap((identity) => quizBatchForIdentity[identity] === undefined ? [] : [[identity, quizBatchForIdentity[identity]]])),
      identityLocations: filteredLocations,
    };
    return [language, { libraryIndex, learningManifest }];
  })) as Record<DeliveryLanguage, { libraryIndex: LanguageLibraryIndex; learningManifest: LanguageLearningManifest }>;
  return {
    manifest,
    libraryIndexes: { fr: languagePackages.fr.libraryIndex, es: languagePackages.es.libraryIndex },
    learningManifests: { fr: languagePackages.fr.learningManifest, es: languagePackages.es.learningManifest },
    readingSections,
    quizBatches,
  };
}

function wordCount(text: string): number {
  return text.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
}

function createReadingSection(bundle: ContentBundle, workId: string, units: Unit[], index: number): ReadingSectionPackage {
  const section: ReadingSectionPackage = { workId, index, units, occurrences: [], lemmas: [], senses: [], surfaceForms: [], expressions: [], notes: [] };
  refreshReadingSectionData(bundle, section);
  return section;
}

function refreshReadingSectionData(bundle: ContentBundle, section: ReadingSectionPackage): void {
  const unitIds = new Set(section.units.map((unit) => unit.id));
  const occurrences = bundle.occurrences.filter((occurrence) => unitIds.has(occurrence.unitId));
  const surfaceIds = new Set(occurrences.map((occurrence) => occurrence.surfaceFormId));
  const senseIds = new Set(occurrences.map((occurrence) => occurrence.senseId));
  const lemmaIds = new Set([
    ...bundle.surfaceForms.filter((surface) => surfaceIds.has(surface.id)).map((surface) => surface.lemmaId),
    ...bundle.senses.filter((sense) => senseIds.has(sense.id)).map((sense) => sense.lemmaId),
  ]);
  section.occurrences = occurrences;
  section.lemmas = bundle.lemmas.filter((lemma) => lemmaIds.has(lemma.id));
  section.senses = bundle.senses.filter((sense) => senseIds.has(sense.id));
  section.surfaceForms = bundle.surfaceForms.filter((surface) => surfaceIds.has(surface.id));
  section.expressions = bundle.expressions.filter((expression) => unitIds.has(expression.unitId));
  section.notes = bundle.notes.filter((note) => note.workId === section.workId && (note.unitId === undefined || unitIds.has(note.unitId)));
}

/** Returns at most ten due identities and never duplicates an identity within a batch. */
export function nextQuizIdentityBatch(dueIdentityKeys: readonly string[], consumed: ReadonlySet<string>): string[] {
  return [...new Set(dueIdentityKeys)].filter((key) => !consumed.has(key)).slice(0, QUIZ_BATCH_SIZE);
}

export function shouldPrefetchNextQuizBatch(remaining: number): boolean {
  return remaining <= QUIZ_PREFETCH_REMAINING;
}
