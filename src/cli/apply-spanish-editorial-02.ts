import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { semanticProgressPolicy, spanishEditorial02 } from "../content/editorial/spanish-02.js";
import type { ContentBundle } from "../domain/model.js";
import { loadPublication, publicationRoot, validatePublication, type SharedRecords, type WorkRecords } from "../publication/repository.js";
import { editorialSubjects, auditEditorialQuality } from "../publication/quality-audit.js";
import { approveReview, reviewRevision } from "../publication/editorial.js";
import { adoptSourceFiles, readWorkSource, sharedSourceFiles, workSourceV2 } from "../publication/source-store.js";
import { fromNeutral, toNeutral } from "../publication/format.js";
import { prepareQuiz, quizEditorialIssues } from "../publication/quiz-authoring.js";
import { textBinding } from "../publication/revisions.js";

const batchId = "es-2026-09-19-02";
const ledgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error("This editorial batch is already applied");
const publication = loadPublication();
const beforeSubjects = new Map(editorialSubjects(publication).map(subject => [`${subject.kind}:${subject.id}`, subject]));
// Check every fingerprint before any mutation, including the noun/adjective split.
for (const entry of spanishEditorial02) {
  const subject = beforeSubjects.get(`vocabulary:srf_es_${entry.oldSuffix}:sns_es_${entry.oldSuffix}`);
  if (!subject || reviewRevision(subject.value) !== entry.baseRevision) throw new Error(`Editorial source changed since review: ${entry.form}`);
}
const candidate = structuredClone(publication);
const source = candidate.sharedSources.es;
const content = fromNeutral<SharedRecords>(source.legacy.content);
const changes: { kind: keyof ContentBundle; id: string; before: unknown; after: unknown; reason: string }[] = [];
const reviewed = new Map<string, string>();
const mappings: { from: string; to: string; occurrenceIds: string[]; previousIdentity: "retained" | "historical_only" }[] = [];
const touchedWorks = new Set<string>();
function replace<T extends { id: string }>(kind: keyof ContentBundle, items: T[], next: T, reason: string, mustBeNew = false) {
  const index = items.findIndex(item => item.id === next.id);
  if (mustBeNew && index !== -1) throw new Error(`Fresh identity collision: ${next.id}`);
  changes.push({ kind, id: next.id, before: index === -1 ? null : structuredClone(items[index]), after: structuredClone(next), reason });
  if (index === -1) items.push(next); else items[index] = next;
}
for (const entry of spanishEditorial02) {
  const oldSurfaceId = `srf_es_${entry.oldSuffix}`, oldSenseId = `sns_es_${entry.oldSuffix}`;
  const oldSurface = content.surfaceForms.find(item => item.id === oldSurfaceId)!;
  const lemmaId = entry.newLexeme ? `lem_${entry.newLexeme}` : oldSurface.lemmaId;
  const surfaceId = entry.newLexeme ? `srf_${entry.newLexeme}_${entry.form.replace("é", "e")}` : oldSurfaceId;
  const senseId = entry.senseId;
  const newMeaning = senseId !== oldSenseId;
  replace("lemmas", content.lemmas, { id: lemmaId, headword: entry.headword, partOfSpeech: entry.partOfSpeech }, entry.rationale, !!entry.newLexeme);
  replace("surfaceForms", content.surfaceForms, { ...oldSurface, id: surfaceId, lemmaId, grammaticalFeatures: entry.features }, entry.rationale, !!entry.newLexeme);
  replace("senses", content.senses, { id: senseId, lemmaId, gloss: entry.gloss, definition: entry.definition }, entry.rationale, newMeaning);
  for (const id of entry.occurrenceIds) {
    const occurrence = candidate.bundle.occurrences.find(item => item.id === id);
    if (!occurrence || occurrence.surfaceFormId !== oldSurfaceId || occurrence.senseId !== oldSenseId) throw new Error(`Unexpected occurrence identity: ${id}`);
    if (newMeaning) {
      replace("occurrences", candidate.bundle.occurrences, { ...occurrence, surfaceFormId: surfaceId, senseId }, entry.rationale);
      touchedWorks.add(occurrence.workId);
    }
  }
  const key = `${surfaceId}:${senseId}`;
  reviewed.set(`vocabulary:${key}`, entry.rationale);
  if (newMeaning) mappings.push({ from: `${oldSurfaceId}:${oldSenseId}`, to: key, occurrenceIds: entry.occurrenceIds, previousIdentity: entry.oldSuffix === "0501_medico" ? "retained" : "historical_only" });
  for (const band of ["levels_1_3", "levels_4_5", "levels_6_8"] as const) {
    const old = source.quizzes.find(quiz => quiz.subject.kind === "vocabulary" && quiz.subject.surfaceFormId === oldSurfaceId && quiz.subject.senseId === oldSenseId && quiz.band === band)!;
    if (!old) throw new Error(`Missing baseline question: ${entry.form} ${band}`);
    const id = newMeaning ? `qiz_${senseId.slice(4)}_${band}` : old.id;
    const base = { id, surfaceFormId: surfaceId, senseId };
    const authored: ContentBundle["quizItems"][number] = band === "levels_1_3"
      ? { ...base, band, format: "meaning_choice", contextFrench: entry.meaning.context, targetText: entry.form, prompt: "Meaning", choicesEnglish: entry.meaning.choices, correctAnswer: entry.meaning.choices[0] }
      : band === "levels_4_5"
        ? { ...base, band, format: "surface_completion", contextFrench: entry.completion.context, choicesFrench: entry.completion.choices, correctAnswer: entry.completion.choices[0] }
        : { ...base, band, format: "target_identification", contextFrench: entry.identification.context, promptFrench: entry.identification.prompt, choicesFrench: entry.identification.choices, correctAnswer: entry.identification.choices[0] };
    const next = prepareQuiz(authored, "es");
    if (quizEditorialIssues(next).length) throw new Error(`Invalid authored question: ${id}`);
    replace("quizItems", content.quizItems, authored, entry.rationale, newMeaning);
    if (newMeaning) source.quizzes.push(next); else source.quizzes[source.quizzes.indexOf(old)] = next;
    reviewed.set(`quiz:${id}`, entry.rationale);
  }
}
source.legacy.content = toNeutral(content);
for (const kind of ["lemmas", "senses", "surfaceForms", "quizItems"] as const) {
  const oldIds = new Set(publication.sharedSources.es.legacy.content[kind].map(item => item.id));
  (candidate.bundle[kind] as { id: string }[]) = [...candidate.bundle[kind].filter(item => !oldIds.has(item.id)), ...content[kind]];
}
for (const quiz of source.quizzes) candidate.preparedQuizzes.set(quiz.id, quiz);
for (const workId of touchedWorks) candidate.textBindings.set(workId, textBinding(candidate.bundle, candidate.expressionCatalog.occurrences, workId));
validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
const subjects = editorialSubjects(candidate);
const reviewMap = new Map(source.reviews.map(record => [record.id, record]));
for (const subject of subjects.filter(subject => subject.language === "es")) {
  const id = `${subject.kind}:${subject.id}`, reason = reviewed.get(id);
  if (reason) reviewMap.set(id, approveReview("es", subject.kind, subject.id, subject.value, "Codex offline contextual review", "2026-09-19", reason));
  else if (subject.kind === "annotations" && touchedWorks.has(subject.id)) {
    const previous = reviewMap.get(id);
    if (previous?.status === "pending") reviewMap.set(id, { ...previous, subjectRevision: reviewRevision(subject.value) });
  }
}
source.reviews = [...reviewMap.values()];
const files = sharedSourceFiles(source);
for (const workId of touchedWorks) {
  const work = readWorkSource(resolve(publicationRoot, `works/${workId}.json`)).legacy;
  const workContent = fromNeutral<WorkRecords>(work.content);
  workContent.occurrences = candidate.bundle.occurrences.filter(item => item.workId === workId);
  work.content = toNeutral(workContent);
  files.set(`works/${workId}.json`, workSourceV2(work));
}
files.set(ledgerPath, {
  version: 2, id: batchId, policy: "polylit-editorial-v2", reviewedBy: "Codex offline contextual review", reviewedAt: "2026-09-19",
  masteryIdsChanged: true, progressPolicy: semanticProgressPolicy,
  userDecision: "Approved: new or corrected meanings begin at Level 1 only when their thought units are actually viewed in Learning View; retain prior records and unchanged mastery. No publishing or GitHub update.",
  progressTransfers: [], mappings, references: [...new Set(spanishEditorial02.map(entry => entry.reference))], changes,
});
const backup = adoptSourceFiles(publicationRoot, files, root => {
  const saved = loadPublication(root);
  validatePublication(saved.bundle, saved.expressionCatalog, saved.registry);
  const snapshot = (bundle: ContentBundle) => Object.fromEntries(Object.entries(bundle).map(([kind, items]) => [kind, [...items].sort((a: { id?: string; workId?: string }, b: { id?: string; workId?: string }) => (a.id ?? a.workId ?? "").localeCompare(b.id ?? b.workId ?? "", "en"))]));
  if (reviewRevision(snapshot(saved.bundle)) !== reviewRevision(snapshot(candidate.bundle))) throw new Error("Saved candidate differs from reviewed data");
  if (auditEditorialQuality(saved).some(issue => reviewed.has(`${issue.kind}:${issue.id}`))) throw new Error("Newly reviewed subjects failed approval");
  for (const mapping of mappings) {
    const used = saved.bundle.occurrences.filter(item => `${item.surfaceFormId}:${item.senseId}` === mapping.to).map(item => item.id).sort();
    if (JSON.stringify(used) !== JSON.stringify([...mapping.occurrenceIds].sort())) throw new Error("Semantic reassignment escaped its reviewed spans");
    if (mapping.previousIdentity === "historical_only" && saved.bundle.occurrences.some(item => `${item.surfaceFormId}:${item.senseId}` === mapping.from)) throw new Error("Historical identity still referenced by current text");
  }
  for (const [id, binding] of saved.textBindings) {
    const old = publication.textBindings.get(id)!;
    if (old.textRevision !== binding.textRevision || old.structureRevision !== binding.structureRevision) throw new Error("Semantic correction changed canonical text or structure");
  }
});
console.log(`Applied four fresh meanings, retained doctor mastery, and reviewed 15 authored questions. No learner state copied/reset. Source checkpoint: ${backup}`);
