import { describe, expect, it } from "vitest";
import { loadPublication } from "../src/publication/repository.js";
import { spanishEditorial01 } from "../src/content/editorial/spanish-01.js";
import { spanishEditorial02, semanticProgressPolicy } from "../src/content/editorial/spanish-02.js";
import { editorialSubjects, auditEditorialQuality } from "../src/publication/quality-audit.js";
import { readFileSync } from "node:fs";
import { createCompactPackages } from "../src/delivery/compact-packages.js";
import { ProgressIndex } from "../src/app/progress-index.js";
import { createEncounter } from "../src/learner/scheduler.js";
import { approvalIssues } from "../src/publication/editorial.js";
import { quizEditorialIssues } from "../src/publication/quiz-authoring.js";
import { prepareWorkUpdate } from "../src/publication/update-work.js";
const publication = loadPublication();
describe("first contextual Spanish editorial batch", () => {
  it("binds eight vocabulary reviews and 24 natural questions to the actual source revision", () => {
    const subjects = new Map(editorialSubjects(publication).map(subject => [`${subject.kind}:${subject.id}`, subject]));
    const reviews = new Map(publication.reviews.map(review => [review.id, review]));
    for (const entry of spanishEditorial01) {
      const surface = publication.bundle.surfaceForms.find(item => item.form === entry.form && item.id.startsWith("srf_es_"))!;
      const lemma = publication.bundle.lemmas.find(item => item.id === surface.lemmaId)!;
      expect(lemma.headword).toBe(entry.headword);
      expect(lemma.partOfSpeech).toBe("noun");
      expect(surface.grammaticalFeatures).toEqual({ gender: entry.gender, number: entry.number });
      const quizzes = [...publication.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === "vocabulary" && quiz.subject.surfaceFormId === surface.id);
      expect(quizzes).toHaveLength(3);
      expect(new Set(quizzes.map(quiz => quiz.context)).size).toBe(3);
      for (const quiz of quizzes) {
        expect(quizEditorialIssues(quiz)).toEqual([]);
        const subject = subjects.get(`quiz:${quiz.id}`)!;
        expect(approvalIssues(reviews.get(`quiz:${quiz.id}`), subject.value, "quiz", quiz.id, "es")).toEqual([]);
      }
      const occurrence = publication.bundle.occurrences.find(item => item.surfaceFormId === surface.id)!;
      const id = `${surface.id}:${occurrence.senseId}`;
      expect(approvalIssues(reviews.get(`vocabulary:${id}`), subjects.get(`vocabulary:${id}`)!.value, "vocabulary", id, "es")).toEqual([]);
    }
  });
  it("invalidates question approval when the underlying sense changes", () => {
    const candidate = structuredClone(publication);
    const sense = candidate.bundle.senses.find(item => item.id === "sns_es_0112_cama")!;
    sense.definition += " A changed meaning.";
    const subject = editorialSubjects(candidate).find(item => item.kind === "quiz" && item.id === "qiz_es_0112_cama_early")!;
    const review = publication.reviews.find(item => item.id === `quiz:${subject.id}`);
    expect(approvalIssues(review, subject.value, "quiz", subject.id, "es")).toContain("approval_stale");
  });
  it("does not let the ordinary work importer silently reassign a learner identity", () => {
    const incoming = structuredClone(publication.bundle);
    const occurrence = incoming.occurrences.find(item => item.workId === "wrk_quiroga_almohadon_plumas")!;
    occurrence.senseId = "sns_unapproved_replacement";
    expect(() => prepareWorkUpdate(publication, incoming, publication.expressionCatalog, occurrence.workId, true)).toThrow("Explicit learner-identity migration");
  });
});

describe("approved fresh-on-view Spanish meaning corrections", () => {
  const ledger = JSON.parse(readFileSync(new URL("../content/published/editorial-batches/es-2026-09-19-02.json", import.meta.url), "utf8")) as { progressPolicy: string; progressTransfers: unknown[]; mappings: { from: string; to: string; occurrenceIds: string[]; previousIdentity: string }[] };
  it("records four explicit semantic changes and no progress transfers", () => {
    expect(ledger.progressPolicy).toBe(semanticProgressPolicy);
    expect(ledger.progressTransfers).toEqual([]);
    expect(ledger.mappings).toHaveLength(4);
    for (const mapping of ledger.mappings) {
      expect(mapping.to).not.toBe(mapping.from);
      const ids = publication.bundle.occurrences.filter(item => `${item.surfaceFormId}:${item.senseId}` === mapping.to).map(item => item.id).sort();
      expect(ids).toEqual([...mapping.occurrenceIds].sort());
      const [oldSurface, oldSense] = mapping.from.split(":");
      expect(publication.bundle.surfaceForms.some(item => item.id === oldSurface)).toBe(true);
      expect(publication.bundle.senses.some(item => item.id === oldSense)).toBe(true);
    }
  });
  it("binds all five contextual reviews and fifteen questions to the corrected meanings", () => {
    const issues = auditEditorialQuality(publication);
    for (const entry of spanishEditorial02) {
      const occurrence = publication.bundle.occurrences.find(item => item.id === entry.occurrenceIds[0])!;
      const id = `${occurrence.surfaceFormId}:${occurrence.senseId}`;
      expect(occurrence.senseId).toBe(entry.senseId);
      expect(issues.some(issue => issue.kind === "vocabulary" && issue.id === id)).toBe(false);
      const quizzes = [...publication.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === "vocabulary" && quiz.subject.surfaceFormId === occurrence.surfaceFormId && quiz.subject.senseId === entry.senseId);
      expect(quizzes).toHaveLength(3);
      expect(new Set(quizzes.map(quiz => quiz.context)).size).toBe(3);
      for (const quiz of quizzes) {
        expect(issues.some(issue => issue.id === quiz.id)).toBe(false);
        expect(quizEditorialIssues(quiz)).toEqual([]);
      }
    }
  });
  it("retains historical quizzes but excludes unreferenced identities from delivery and due counts", () => {
    const packages = createCompactPackages(publication.bundle, publication.expressionCatalog, publication.preparedQuizzes);
    const active = new Set(editorialSubjects(publication).filter(subject => subject.kind === "quiz").map(subject => subject.id));
    const retired = ledger.mappings.filter(mapping => mapping.previousIdentity === "historical_only");
    const state = Object.fromEntries(retired.map(mapping => [mapping.from, createEncounter(new Date("2020-01-01"), true)]));
    const progress = new ProgressIndex(packages.libraryIndexes.es);
    progress.refresh(state, new Set(Object.keys(packages.libraryIndexes.es.works)), 0, new Date("2026-09-19"));
    expect(progress.claims()).toEqual([]);
    const deliveredQuizzes = [...packages.files].filter(([path]) => path.startsWith("quizzes/")).map(([, data]) => data).join("\n");
    expect(deliveredQuizzes.length).toBeGreaterThan(0);
    for (const mapping of retired) {
      const old = [...publication.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === "vocabulary" && `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}` === mapping.from);
      expect(old).toHaveLength(3);
      for (const quiz of old) { expect(active.has(quiz.id)).toBe(false); expect(deliveredQuizzes).not.toContain(`"${quiz.id}"`); }
    }
  });
  it("requires editorial approval again if an old historical meaning is reintroduced", () => {
    const candidate = structuredClone(publication);
    const mapping = ledger.mappings.find(item => item.previousIdentity === "historical_only")!;
    const occurrence = candidate.bundle.occurrences.find(item => item.id === mapping.occurrenceIds[0])!;
    [occurrence.surfaceFormId, occurrence.senseId] = mapping.from.split(":") as [string, string];
    const issues = auditEditorialQuality(candidate);
    expect(issues.some(issue => issue.id === mapping.from && issue.issues.includes("approval_pending"))).toBe(true);
    const oldQuizzes = new Set([...candidate.preparedQuizzes.values()].filter(quiz => quiz.subject.kind === "vocabulary" && `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}` === mapping.from).map(quiz => quiz.id));
    expect(issues.filter(issue => oldQuizzes.has(issue.id) && issue.issues.includes("template_context"))).toHaveLength(3);
  });
});
