import type { loadPublication } from "./repository.js";
import { vocabularyIdentityKey } from "../domain/runtime.js";
import { approvalIssues, pendingReview, type ReviewKind } from "./editorial.js";
import { normalizeText, quizEditorialIssues } from "./quiz-authoring.js";
import type { Language } from "./format.js";
import { revision } from "./revisions.js";

type Publication = ReturnType<typeof loadPublication>;
export interface EditorialSubject { id: string; kind: ReviewKind; language: Language; value: unknown }
/** Binding to contexts prevents a lexical approval silently covering a new use. */
export function editorialSubjects(publication: Publication): EditorialSubject[] {
  const { bundle, expressionCatalog, registry } = publication;
  const languages = new Map(registry.works.map(work => [work.id, work.language]));
  const surfaces = new Map(bundle.surfaceForms.map(item => [item.id, item]));
  const senses = new Map(bundle.senses.map(item => [item.id, item]));
  const lemmas = new Map(bundle.lemmas.map(item => [item.id, item]));
  const units = new Map(bundle.units.map(item => [item.id, item]));
  const occurrences = new Map<string, typeof bundle.occurrences>();
  for (const occurrence of bundle.occurrences) {
    const key = vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId);
    const group = occurrences.get(key) ?? []; group.push(occurrence); occurrences.set(key, group);
  }
  // Historical questions stay recoverable in source, but release checks cover
  // the same occurrence-referenced identities as delivery. Reusing one later
  // makes its exact-version approval mandatory again; it is never auto-approved.
  const expressionIds = new Set(expressionCatalog.occurrences.map(item => item.identityId));
  const subjects: EditorialSubject[] = [...publication.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === "vocabulary"
    ? occurrences.has(vocabularyIdentityKey(quiz.subject.surfaceFormId, quiz.subject.senseId))
    : expressionIds.has(quiz.subject.expressionId)).map(quiz => {
    const subject = quiz.subject;
    const target = subject.kind === "expression" ? expressionCatalog.identities.find(identity => identity.id === subject.expressionId) : { surface: surfaces.get(subject.surfaceFormId), sense: senses.get(subject.senseId), lemma: lemmas.get(surfaces.get(subject.surfaceFormId)!.lemmaId) };
    return { id: quiz.id, kind: "quiz", language: quiz.language, value: { quiz, target } };
  });
  for (const [id, group] of occurrences) {
    const first = group[0]!;
    const surface = surfaces.get(first.surfaceFormId)!;
    const contexts = [...new Set(group.map(item => item.unitId))].sort().map(unitId => ({ ...units.get(unitId)!, textRevision: publication.textBindings.get(units.get(unitId)!.workId)!.textRevision }));
    subjects.push({ id, kind: "vocabulary", language: languages.get(first.workId)!, value: { lemma: lemmas.get(surface.lemmaId), sense: senses.get(first.senseId), surface, occurrences: [...group].sort((a, b) => a.id.localeCompare(b.id, "en")), contexts } });
  }
  for (const identity of expressionCatalog.identities) {
    const occurrences = expressionCatalog.occurrences.filter(item => item.identityId === identity.id).sort((a, b) => a.id.localeCompare(b.id, "en"));
    const first = occurrences[0];
    if (!first) continue;
    subjects.push({ id: identity.id, kind: "expression", language: languages.get(first.workId)!, value: { identity, occurrences, contexts: occurrences.map(item => units.get(item.unitId)) } });
  }
  for (const [id, binding] of publication.textBindings) subjects.push({ id, kind: "annotations", language: languages.get(id)!, value: binding });
  return subjects;
}
export function missingReviews(publication: Publication) {
  const existing = new Set(publication.reviews.map(review => review.id));
  return editorialSubjects(publication).filter(subject => !existing.has(`${subject.kind}:${subject.id}`)).map(subject => pendingReview(subject.language, subject.kind, subject.id, subject.value));
}
export interface QualityIssue { kind: ReviewKind; id: string; language: Language; issues: string[] }
export function auditEditorialQuality(publication: Publication): QualityIssue[] {
  const reviews = new Map(publication.reviews.map(review => [review.id, review]));
  const quizGroups = new Map<string, string[]>();
  for (const quiz of publication.preparedQuizzes.values()) {
    const key = quiz.subject.kind === "expression" ? quiz.subject.expressionId : vocabularyIdentityKey(quiz.subject.surfaceFormId, quiz.subject.senseId);
    const group = quizGroups.get(key) ?? []; group.push(normalizeText(quiz.context, quiz.language)); quizGroups.set(key, group);
  }
  return editorialSubjects(publication).flatMap(subject => {
    const issues = approvalIssues(reviews.get(`${subject.kind}:${subject.id}`), subject.value, subject.kind, subject.id, subject.language);
    if (subject.kind === "quiz") {
      const quiz = publication.preparedQuizzes.get(subject.id)!;
      issues.push(...quizEditorialIssues(quiz));
      const key = quiz.subject.kind === "expression" ? quiz.subject.expressionId : vocabularyIdentityKey(quiz.subject.surfaceFormId, quiz.subject.senseId);
      const contexts = quizGroups.get(key)!;
      if (contexts.length !== 3 || new Set(contexts).size !== 3) issues.push("three_distinct_contexts_required");
    }
    if (subject.kind === "vocabulary") {
      const { lemma } = subject.value as { lemma: { partOfSpeech: string } };
      if (lemma.partOfSpeech === "Spanish vocabulary") issues.push("linguistic_classification_required");
    }
    return issues.length ? [{ kind: subject.kind, id: subject.id, language: subject.language, issues }] : [];
  });
}
export interface DuplicateCandidate {
  id: string; language: Language; headword: string; partOfSpeech: string; lemmaIds: string[];
  status: "pending"; reason: string;
  entries: { lemmaId: string; senses: { id: string; gloss: string; definition: string }[]; surfaceFormIds: string[]; workIds: string[] }[];
}
/** Deliberately a report, never an automatic lexical merge. */
export function duplicateCandidates(publication: Publication): DuplicateCandidate[] {
  const { bundle } = publication;
  const candidates: DuplicateCandidate[] = [];
  for (const language of ["fr", "es"] as const) {
    const lemmaIds = new Set(publication.sharedSources[language].legacy.content.lemmas.map(item => item.id));
    const groups = new Map<string, typeof bundle.lemmas>();
    for (const lemma of bundle.lemmas.filter(item => lemmaIds.has(item.id))) {
      const key = `${normalizeText(lemma.headword, language)}|${normalizeText(lemma.partOfSpeech, language)}`;
      const group = groups.get(key) ?? []; group.push(lemma); groups.set(key, group);
    }
    for (const group of groups.values()) if (group.length > 1) {
      const ids = group.map(item => item.id).sort();
      candidates.push({ id: revision("dup", { language, ids }), language, headword: group[0]!.headword, partOfSpeech: group[0]!.partOfSpeech, lemmaIds: ids, status: "pending", reason: "Matching headword and part of speech only; senses and occurrences require review before any merge", entries: group.map(lemma => {
        const surfaces = bundle.surfaceForms.filter(item => item.lemmaId === lemma.id).map(item => item.id);
        const surfaceSet = new Set(surfaces);
        return { lemmaId: lemma.id, senses: bundle.senses.filter(item => item.lemmaId === lemma.id).map(({ lemmaId: _lemmaId, ...sense }) => sense), surfaceFormIds: surfaces, workIds: [...new Set(bundle.occurrences.filter(item => surfaceSet.has(item.surfaceFormId)).map(item => item.workId))].sort() };
      }) });
    }
  }
  return candidates.sort((a, b) => a.headword.localeCompare(b.headword, a.language));
}
export function assertEditorialRelease(publication: Publication): void {
  const issues = auditEditorialQuality(publication);
  if (issues.length) {
    const summary = { blockedRecords: issues.length, byLanguage: Object.fromEntries(["fr", "es"].map(language => [language, issues.filter(issue => issue.language === language).length])), examples: issues.slice(0, 5) };
    throw new Error(`Editorial publication gate blocked this candidate: ${JSON.stringify(summary)}. Use the local review build only while editorial work is incomplete.`);
  }
}
