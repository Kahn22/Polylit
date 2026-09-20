import { ContentBundleSchema, type ContentBundle, vocabularyIdentityKey } from "./model.js";

export interface Diagnostic { code: string; path: string; message: string }
export interface ValidationResult { ok: boolean; diagnostics: Diagnostic[] }

const readyStates = new Set(["learning_ready", "published"]);

export function validateContentBundle(input: unknown): ValidationResult {
  const parsed = ContentBundleSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, diagnostics: parsed.error.issues.map((i) => ({
      code: "schema.invalid", path: i.path.join("."), message: i.message,
    })).sort(byDiagnostic) };
  }
  const b = parsed.data;
  const diagnostics: Diagnostic[] = [];
  uniqueIds(b, diagnostics);
  const authors = ids(b.authors), collections = ids(b.collections), books = ids(b.books), works = ids(b.works);
  const units = ids(b.units), lemmas = ids(b.lemmas), senses = ids(b.senses), surfaces = ids(b.surfaceForms);
  const unitById = new Map(b.units.map((unit) => [unit.id, unit]));
  const normalizedUnitTexts = b.units.map((unit) => normalize(unit.french));
  const normalizedUnitTextSet = new Set(normalizedUnitTexts);
  const readinessByWork = new Map(b.readiness.map((status) => [status.workId, status]));
  const worksWithSources = new Set(b.sources.map((source) => source.workId));
  const worksWithUnits = new Set(b.units.map((unit) => unit.workId));
  const occurrencesByWork = new Map<string, typeof b.occurrences>();
  for (const occurrence of b.occurrences) {
    const occurrences = occurrencesByWork.get(occurrence.workId) ?? [];
    occurrences.push(occurrence);
    occurrencesByWork.set(occurrence.workId, occurrences);
  }
  b.collections.forEach((x) => reference(authors, x.authorId, `collections.${x.id}.authorId`, diagnostics));
  b.books.forEach((x) => reference(collections, x.collectionId, `books.${x.id}.collectionId`, diagnostics));
  b.works.forEach((x) => reference(books, x.bookId, `works.${x.id}.bookId`, diagnostics));
  b.sources.forEach((x) => reference(works, x.workId, `sources.${x.workId}.workId`, diagnostics));
  b.units.forEach((x) => reference(works, x.workId, `units.${x.id}.workId`, diagnostics));
  b.senses.forEach((x) => reference(lemmas, x.lemmaId, `senses.${x.id}.lemmaId`, diagnostics));
  b.surfaceForms.forEach((x) => reference(lemmas, x.lemmaId, `surfaceForms.${x.id}.lemmaId`, diagnostics));
  const senseById = new Map(b.senses.map((x) => [x.id, x]));
  const surfaceById = new Map(b.surfaceForms.map((x) => [x.id, x]));
  const quizBands = new Map<string, Set<string>>();
  for (const quiz of b.quizItems) {
    const key = vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId);
    const bands = quizBands.get(key) ?? new Set<string>();
    if (bands.has(quiz.band)) add(diagnostics, "quiz.duplicate_band", `quizItems.${quiz.id}`, "Exactly one prepared question per identity and mastery band is allowed");
    bands.add(quiz.band); quizBands.set(key, bands);
  }
  for (const occurrence of b.occurrences) {
    reference(works, occurrence.workId, `occurrences.${occurrence.id}.workId`, diagnostics);
    reference(units, occurrence.unitId, `occurrences.${occurrence.id}.unitId`, diagnostics);
    const unit = unitById.get(occurrence.unitId);
    if (unit && unit.workId !== occurrence.workId) add(diagnostics, "occurrence.work_mismatch", `occurrences.${occurrence.id}`, "Occurrence and unit must belong to the same work");
    const sense = senseById.get(occurrence.senseId), surface = surfaceById.get(occurrence.surfaceFormId);
    if (!sense) reference(senses, occurrence.senseId, `occurrences.${occurrence.id}.senseId`, diagnostics);
    if (!surface) reference(surfaces, occurrence.surfaceFormId, `occurrences.${occurrence.id}.surfaceFormId`, diagnostics);
    if (sense && surface && sense.lemmaId !== surface.lemmaId) add(diagnostics, "vocabulary.lemma_mismatch", `occurrences.${occurrence.id}`, "Surface form and sense must belong to the same lemma");
    if (unit && (occurrence.end > unit.french.length || occurrence.start >= occurrence.end)) add(diagnostics, "occurrence.invalid_span", `occurrences.${occurrence.id}`, "Occurrence span must be inside its thought unit");
    if (unit && surface && normalize(unit.french.slice(occurrence.start, occurrence.end)) !== surface.normalized) add(diagnostics, "occurrence.surface_mismatch", `occurrences.${occurrence.id}`, "Occurrence span must match the referenced surface form");
  }
  for (const exclusion of b.exclusions) {
    reference(works, exclusion.workId, `exclusions.${exclusion.id}.workId`, diagnostics);
    reference(units, exclusion.unitId, `exclusions.${exclusion.id}.unitId`, diagnostics);
    const unit = unitById.get(exclusion.unitId);
    if (unit && unit.workId !== exclusion.workId) add(diagnostics, "exclusion.work_mismatch", `exclusions.${exclusion.id}`, "Exclusion and unit must belong to the same work");
    if (unit && (exclusion.end > unit.french.length || exclusion.start >= exclusion.end || unit.french.slice(exclusion.start, exclusion.end) !== exclusion.text)) add(diagnostics, "exclusion.invalid_span", `exclusions.${exclusion.id}`, "Exclusion text and span must match its thought unit");
  }
  for (const quiz of b.quizItems) {
    const sense = senseById.get(quiz.senseId), surface = surfaceById.get(quiz.surfaceFormId);
    if (!sense) reference(senses, quiz.senseId, `quizItems.${quiz.id}.senseId`, diagnostics);
    if (!surface) reference(surfaces, quiz.surfaceFormId, `quizItems.${quiz.id}.surfaceFormId`, diagnostics);
    if (sense && surface && sense.lemmaId !== surface.lemmaId) add(diagnostics, "vocabulary.lemma_mismatch", `quizItems.${quiz.id}`, "Surface form and sense must belong to the same lemma");
    const choices = "choicesEnglish" in quiz ? quiz.choicesEnglish : quiz.choicesFrench;
    if (new Set(choices).size !== 4) add(diagnostics, "quiz.duplicate_choice", `quizItems.${quiz.id}`, "Quiz choices must be four distinct answers");
    if (choices.filter((choice) => choice === quiz.correctAnswer).length !== 1) add(diagnostics, "quiz.correct_answer", `quizItems.${quiz.id}`, "The correct answer must appear exactly once among the choices");
    if (surface && "targetText" in quiz && normalize(quiz.targetText) !== surface.normalized) add(diagnostics, "quiz.target_mismatch", `quizItems.${quiz.id}`, "Highlighted target text must match the exact surface form");
    if ("targetText" in quiz && !normalize(quiz.contextFrench).includes(normalize(quiz.targetText))) add(diagnostics, "quiz.target_missing", `quizItems.${quiz.id}`, "Prepared context must contain its declared target text");
    if (quiz.format === "surface_completion" && !quiz.contextFrench.includes("___")) add(diagnostics, "quiz.blank_missing", `quizItems.${quiz.id}`, "Levels 4–5 context must contain a visible blank");
    if (quiz.format === "surface_completion" && surface && normalize(quiz.correctAnswer) !== surface.normalized) add(diagnostics, "quiz.answer_mismatch", `quizItems.${quiz.id}`, "Levels 4–5 correct answer must be the exact target surface form");
    if (quiz.format === "target_identification") {
      if (surface && normalize(quiz.correctAnswer) !== surface.normalized) add(diagnostics, "quiz.answer_mismatch", `quizItems.${quiz.id}`, "Levels 6–8 must identify the exact target surface form");
      if (quiz.choicesFrench.some((choice) => !normalize(quiz.contextFrench).includes(normalize(choice)))) add(diagnostics, "quiz.choice_not_in_context", `quizItems.${quiz.id}`, "Every Levels 6–8 choice must appear in the displayed French context");
    }
    if (normalizedUnitTextSet.has(normalize(quiz.contextFrench))) add(diagnostics, "quiz.source_reuse", `quizItems.${quiz.id}`, "Mastery quiz context must be genuinely different from source text");
    if (quiz.format === "surface_completion") {
      const fragments = normalize(quiz.contextFrench).split(/_{3,}/);
      if (fragments.length === 2) {
        const [before, after] = fragments as [string, string];
        if (normalizedUnitTexts.some((source) => {
          return source.startsWith(before) && source.endsWith(after) && source.length > before.length + after.length;
        })) add(diagnostics, "quiz.source_derived_blank", `quizItems.${quiz.id}`, "A source sentence with its target blanked is not a new quiz context");
      }
    }
    if (quiz.contextFrench.includes("Les formes proposées sont «")) add(diagnostics, "quiz.synthetic_choice_list", `quizItems.${quiz.id}`, "Quiz choices must be used in a natural context, not appended as an option list");
  }
  for (const expression of b.expressions) {
    reference(works, expression.workId, `expressions.${expression.id}.workId`, diagnostics);
    reference(units, expression.unitId, `expressions.${expression.id}.unitId`, diagnostics);
  }
  for (const work of b.works.filter((x) => readyStates.has(x.publicationState))) {
    const status = readinessByWork.get(work.id);
    if (!status?.thoughtUnitsComplete || !status.occurrencesReviewed || status.unresolvedLearnerTokens.length) add(diagnostics, "publication.incomplete", `works.${work.id}`, "Learning-ready and published works require complete, reviewed content with no unresolved learner tokens");
    if (!worksWithSources.has(work.id) || !worksWithUnits.has(work.id)) add(diagnostics, "publication.missing_content", `works.${work.id}`, "Learning-ready and published works require source text and thought units");
    const missingQuiz = (occurrencesByWork.get(work.id) ?? []).some((x) => (quizBands.get(vocabularyIdentityKey(x.surfaceFormId, x.senseId))?.size ?? 0) !== 3);
    if (missingQuiz) add(diagnostics, "publication.missing_quiz", `works.${work.id}`, "Every vocabulary identity must have prepared quiz content covering Levels 1–3, 4–5, and 6–8 before learner use");
  }
  validateOrdinals(b.books, "collectionId", diagnostics);
  validateOrdinals(b.works, "bookId", diagnostics);
  validateOrdinals(b.units, "workId", diagnostics);
  for (const group of ["sources", "readiness"] as const) {
    const workIds = new Set<string>();
    for (const item of b[group]) {
      if (workIds.has(item.workId)) add(diagnostics, `${group}.duplicate_work`, `${group}.${item.workId}`, "Only one record per work is allowed");
      workIds.add(item.workId);
      reference(works, item.workId, `${group}.${item.workId}.workId`, diagnostics);
    }
  }
  return { ok: diagnostics.length === 0, diagnostics: diagnostics.sort(byDiagnostic) };
}

function ids(items: { id: string }[]): Set<string> { return new Set(items.map((x) => x.id)); }
function normalize(value: string): string { return value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR"); }
function add(items: Diagnostic[], code: string, path: string, message: string): void { items.push({ code, path, message }); }
function reference(values: Set<string>, value: string, path: string, diagnostics: Diagnostic[]): void {
  if (!values.has(value)) add(diagnostics, "reference.missing", path, `Unknown reference: ${value}`);
}
function byDiagnostic(a: Diagnostic, b: Diagnostic): number {
  return a.path.localeCompare(b.path) || a.code.localeCompare(b.code) || a.message.localeCompare(b.message);
}
function uniqueIds(bundle: ContentBundle, diagnostics: Diagnostic[]): void {
  const groups = [bundle.authors, bundle.collections, bundle.books, bundle.works, bundle.units, bundle.lemmas,
    bundle.senses, bundle.surfaceForms, bundle.occurrences, bundle.exclusions, bundle.expressions, bundle.notes, bundle.quizItems];
  const seen = new Set<string>();
  for (const item of groups.flat()) {
    if (seen.has(item.id)) add(diagnostics, "id.duplicate", item.id, "Stable IDs must be globally unique");
    seen.add(item.id);
  }
}
function validateOrdinals<T extends { id: string; ordinal: number }>(items: T[], parentKey: keyof T, diagnostics: Diagnostic[]): void {
  const seen = new Set<string>();
  for (const item of items) {
    const key = `${String(item[parentKey])}:${item.ordinal}`;
    if (seen.has(key)) add(diagnostics, "ordinal.duplicate", item.id, "Ordinals must be unique within their parent");
    seen.add(key);
  }
}
