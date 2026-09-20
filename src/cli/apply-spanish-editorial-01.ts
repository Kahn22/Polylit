import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { spanishEditorial01 } from "../content/editorial/spanish-01.js";
import { loadPublication, publicationRoot, validatePublication } from "../publication/repository.js";
import { editorialSubjects } from "../publication/quality-audit.js";
import { approveReview, reviewRevision } from "../publication/editorial.js";
import { adoptSourceFiles, sharedSourceFiles } from "../publication/source-store.js";
import { fromNeutral, toNeutral } from "../publication/format.js";
import { prepareQuiz, quizEditorialIssues, legacyQuiz } from "../publication/quiz-authoring.js";
import type { SharedRecords } from "../publication/repository.js";
import type { ContentBundle } from "../domain/model.js";

const batchId = "es-2026-09-19-01";
const ledgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error("This editorial batch is already applied");
const publication = loadPublication();
const beforeSubjects = new Map(editorialSubjects(publication).map(subject => [`${subject.kind}:${subject.id}`, subject]));
const source = structuredClone(publication.sharedSources.es);
const content = fromNeutral<SharedRecords>(source.legacy.content);
const reviewedIds = new Set<string>();
const changes: { kind: string; id: string; before: unknown; after: unknown; reason: string }[] = [];
for (const entry of spanishEditorial01) {
  const surface = content.surfaceForms.find(surface => surface.form === entry.form)!;
  const senseIds = new Set(publication.bundle.occurrences.filter(occurrence => occurrence.surfaceFormId === surface.id).map(occurrence => occurrence.senseId));
  if (senseIds.size !== 1) throw new Error(`This batch does not authorize a sense split: ${entry.form}`);
  const sense = content.senses.find(sense => sense.id === [...senseIds][0])!;
  const key = `${surface.id}:${sense.id}`;
  const before = beforeSubjects.get(`vocabulary:${key}`)!;
  if (reviewRevision(before.value) !== entry.baseRevision) throw new Error(`Editorial source changed since review: ${entry.form}`);
  if (sense.gloss !== entry.gloss) throw new Error(`Meaning correction needs separate review: ${entry.form}`);
  const lemma = content.lemmas.find(lemma => lemma.id === surface.lemmaId)!;
  const recordChange = (kind: string, record: { id: string }, mutate: () => void) => {
    const prior = structuredClone(record); mutate(); changes.push({ kind, id: record.id, before: prior, after: structuredClone(record), reason: entry.rationale });
  };
  recordChange("lemmas", lemma, () => { lemma.headword = entry.headword; lemma.partOfSpeech = "noun"; });
  recordChange("senses", sense, () => { sense.definition = entry.definition; });
  recordChange("surfaceForms", surface, () => { surface.grammaticalFeatures = { gender: entry.gender, number: entry.number }; });
  reviewedIds.add(`vocabulary:${key}`);
  for (const band of ["levels_1_3", "levels_4_5", "levels_6_8"] as const) {
    const index = source.quizzes.findIndex(quiz => quiz.subject.kind === "vocabulary" && quiz.subject.surfaceFormId === surface.id && quiz.subject.senseId === sense.id && quiz.band === band);
    const old = source.quizzes[index];
    if (!old) throw new Error(`Missing existing quiz: ${key} ${band}`);
    const base = { id: old.id, surfaceFormId: surface.id, senseId: sense.id };
    const authored: ContentBundle["quizItems"][number] = band === "levels_1_3"
      ? { ...base, band, format: "meaning_choice", contextFrench: entry.meaning.context, targetText: entry.form, prompt: "Meaning", choicesEnglish: entry.meaning.choices, correctAnswer: entry.meaning.choices[0] }
      : band === "levels_4_5"
        ? { ...base, band, format: "surface_completion", contextFrench: entry.completion.context, choicesFrench: entry.completion.choices, correctAnswer: entry.completion.choices[0] }
        : { ...base, band, format: "target_identification", contextFrench: entry.identification.context, promptFrench: entry.identification.prompt, choicesFrench: entry.identification.choices, correctAnswer: entry.identification.choices[0] };
    const next = prepareQuiz(authored, "es");
    if (quizEditorialIssues(next).length) throw new Error(`Authored question failed its mechanical gate: ${next.id}`);
    changes.push({ kind: "quizItems", id: old.id, before: legacyQuiz(old), after: authored, reason: entry.rationale });
    source.quizzes[index] = next;
    reviewedIds.add(`quiz:${next.id}`);
  }
}
content.quizItems = source.quizzes.filter(quiz => quiz.subject.kind === "vocabulary").map(legacyQuiz) as ContentBundle["quizItems"];
source.legacy.content = toNeutral(content);
const files = sharedSourceFiles(source);
const ledger = { version: 1, id: batchId, reviewedBy: "Codex offline contextual review", reviewedAt: "2026-09-19", policy: "polylit-editorial-v2", masteryIdsChanged: false, forms: spanishEditorial01.map(entry => entry.form), changes };
files.set(ledgerPath, ledger);
// Review hashes must refer to the actual reconstructed candidate, including its
// lexical definitions, not to stale pre-edit objects or just the quiz strings.
const candidate = structuredClone(publication);
candidate.sharedSources.es = source;
candidate.bundle.lemmas = candidate.bundle.lemmas.map(item => content.lemmas.find(next => next.id === item.id) ?? item);
candidate.bundle.senses = candidate.bundle.senses.map(item => content.senses.find(next => next.id === item.id) ?? item);
candidate.bundle.surfaceForms = candidate.bundle.surfaceForms.map(item => content.surfaceForms.find(next => next.id === item.id) ?? item);
candidate.bundle.quizItems = candidate.bundle.quizItems.map(item => content.quizItems.find(next => next.id === item.id) ?? item);
for (const quiz of source.quizzes) candidate.preparedQuizzes.set(quiz.id, quiz);
validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
const subjects = editorialSubjects(candidate);
for (const language of ["fr", "es"] as const) {
  const target = language === "es" ? source : structuredClone(publication.sharedSources.fr);
  const subjectById = new Map(subjects.filter(subject => subject.language === language).map(subject => [`${subject.kind}:${subject.id}`, subject]));
  target.reviews = target.reviews.map(record => {
    const subject = subjectById.get(record.id);
    if (!subject) return record;
    if (reviewedIds.has(record.id)) {
      const reason = subject.kind === "vocabulary" ? spanishEditorial01.find(entry => (subject.value as { surface: { form: string } }).surface.form === entry.form)!.rationale : `Question independently authored and context/distractors reviewed in ${batchId}; see the versioned batch ledger for the item-specific rationale.`;
      return approveReview(language, subject.kind, subject.id, subject.value, ledger.reviewedBy, ledger.reviewedAt, reason);
    }
    // Updating a pending subject fingerprint is not approval. Approved records
    // are never silently rebound; changing their subject leaves them stale.
    return record.status === "pending" ? { ...record, subjectRevision: reviewRevision(subject.value) } : record;
  });
  for (const [path, value] of sharedSourceFiles(target)) files.set(path, value);
}
const backup = adoptSourceFiles(publicationRoot, files, root => {
  const saved = loadPublication(root);
  validatePublication(saved.bundle, saved.expressionCatalog, saved.registry);
  const beforeKeys = publication.bundle.occurrences.map(item => `${item.id}:${item.surfaceFormId}:${item.senseId}`);
  const afterKeys = saved.bundle.occurrences.map(item => `${item.id}:${item.surfaceFormId}:${item.senseId}`);
  if (JSON.stringify(beforeKeys) !== JSON.stringify(afterKeys)) throw new Error("Editorial batch changed learner identity references");
});
console.log(`Applied ${spanishEditorial01.length} contextual vocabulary reviews and ${spanishEditorial01.length * 3} authored questions. No mastery identities changed. Source checkpoint: ${backup}`);
