import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadPublication, validatePublication } from "../publication/repository.js";
import { auditEditorialQuality, duplicateCandidates, editorialSubjects } from "../publication/quality-audit.js";
const publication = loadPublication();
validatePublication(publication.bundle, publication.expressionCatalog, publication.registry);
const issues = auditEditorialQuality(publication);
const candidates = duplicateCandidates(publication);
const activeQuizIds = new Set(editorialSubjects(publication).filter(subject => subject.kind === "quiz").map(subject => subject.id));
const allQuizzes = [...publication.preparedQuizzes.values()];
const summary = {
  version: 1, sourceFormat: 2, works: publication.bundle.works.length,
  questions: activeQuizIds.size, historicalQuestions: allQuizzes.length - activeQuizIds.size,
  releaseReady: issues.length === 0, blockedRecords: issues.length,
  languages: Object.fromEntries(["fr", "es"].map(language => [language, {
    quizzes: allQuizzes.filter(quiz => quiz.language === language && activeQuizIds.has(quiz.id)).length,
    historicalQuestions: allQuizzes.filter(quiz => quiz.language === language && !activeQuizIds.has(quiz.id)).length,
    blockedByKind: Object.fromEntries(["quiz", "vocabulary", "expression", "annotations"].map(kind => [kind, issues.filter(issue => issue.language === language && issue.kind === kind).length])),
    templateQuestions: issues.filter(issue => issue.language === language && issue.issues.includes("template_context")).length,
    missingTargetSelections: issues.filter(issue => issue.language === language && issue.issues.includes("target_selection_required")).length,
  }])), duplicateCandidateGroups: candidates.length,
};
if (process.argv.includes("--write-report")) {
  const output = resolve(import.meta.dirname, "../../content/editorial");
  mkdirSync(output, { recursive: true });
  writeFileSync(resolve(output, "quality-report.json"), JSON.stringify({ ...summary, note: "This summary contains examples only; full per-record review states are in the shared review chunks.", issueExamples: issues.slice(0, 20) }, null, 2) + "\n");
  writeFileSync(resolve(output, "duplicate-candidates.json"), JSON.stringify({ version: 1, description: "Generated candidates only; no approval or automatic merge", candidates }, null, 2) + "\n");
}
console.log(JSON.stringify(summary, null, 2));
