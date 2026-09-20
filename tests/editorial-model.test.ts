import { describe, expect, it } from "vitest";
import { loadPublication } from "../src/publication/repository.js";
import { prepareQuiz, legacyQuiz, targetCandidates, quizEditorialIssues, quizStructureIssues } from "../src/publication/quiz-authoring.js";
import { approveReview, approvalIssues, pendingReview } from "../src/publication/editorial.js";
import { assertTextBinding, textBinding } from "../src/publication/revisions.js";
import { sharedSourceFiles } from "../src/publication/source-store.js";
import { assertEditorialRelease, duplicateCandidates } from "../src/publication/quality-audit.js";
import { highlightedContext } from "../src/app/quiz-view.js";
import { correctChoice } from "../src/domain/prepared-quiz.js";
import { orderedChoices } from "../src/app/state.js";

const publication = loadPublication();
const example = {
  id: "qiz_example", surfaceFormId: "srf_chat", senseId: "sns_chat", band: "levels_1_3" as const, format: "meaning_choice" as const,
  contextFrench: "Le chat dort.", targetText: "chat", prompt: "Meaning" as const,
  choicesEnglish: ["cat", "dog", "bird", "horse"], correctAnswer: "cat",
};
describe("explicit quiz identity and editorial evidence", () => {
  it("round-trips inherited questions while assigning persistent choice IDs", () => {
    const quiz = prepareQuiz(example, "fr");
    expect(legacyQuiz(quiz)).toEqual(example);
    const reordered = { ...quiz, choices: orderedChoices(quiz.choices, "rotate") };
    expect(correctChoice(reordered).text).toBe("cat");
    correctChoice(reordered).text = "a cat";
    expect(reordered.correctChoiceId).toBe(quiz.correctChoiceId);
    expect(correctChoice(reordered).text).toBe("a cat");
  });
  it("does not guess among repeated words or match inside a longer word", () => {
    expect(targetCandidates("chaton chat chat", "chat", "fr")).toEqual([{ start: 7, end: 11 }, { start: 12, end: 16 }]);
    const quiz = prepareQuiz({ ...example, contextFrench: "chaton chat chat" }, "fr");
    expect(quiz.targetRange).toBeUndefined();
    expect(quizEditorialIssues(quiz)).toContain("target_selection_required");
    quiz.targetRange = { start: 12, end: 16 };
    expect(quizStructureIssues(quiz)).toEqual([]);
    expect(highlightedContext(quiz)).toBe("chaton chat <mark>chat</mark>");
  });
  it("retains original UTF-16 offsets through composed accents and surrogate pairs", () => {
    expect(targetCandidates("🐈 cafe\u0301", "café", "fr")).toEqual([{ start: 3, end: 8 }]);
    expect(targetCandidates("Él mira a él.", "él", "es")).toEqual([{ start: 0, end: 2 }, { start: 10, end: 12 }]);
  });
  it("escapes highlighted source markup and validates the exact selected span", () => {
    const quiz = prepareQuiz({ ...example, contextFrench: "<chat>" }, "fr");
    expect(highlightedContext(quiz)).toBe("&lt;<mark>chat</mark>&gt;");
    quiz.targetRange = { start: 0, end: 4 };
    expect(quizStructureIssues(quiz)).toContain("target_range_invalid");
  });
  it("rejects duplicate choice IDs and missing correct choices", () => {
    const quiz = prepareQuiz(example, "fr");
    quiz.choices[1]!.id = quiz.choices[0]!.id;
    expect(quizStructureIssues(quiz)).toContain("choices_invalid");
    expect(quizStructureIssues(quiz)).toContain("correct_choice_invalid");
  });
  it("does not mistake a mechanical migration or stale approval for editorial review", () => {
    const quiz = prepareQuiz(example, "fr");
    const pending = pendingReview("fr", "quiz", quiz.id, quiz);
    expect(approvalIssues(pending, quiz, "quiz", quiz.id, "fr")).toEqual(["approval_pending"]);
    const approved = approveReview("fr", "quiz", quiz.id, quiz, "test reviewer", "2026-09-19T00:00:00Z", "Test fixture: checked context and all alternatives");
    expect(approvalIssues(approved, quiz, "quiz", quiz.id, "fr")).toEqual([]);
    quiz.context += " Encore.";
    expect(approvalIssues(approved, quiz, "quiz", quiz.id, "fr")).toContain("approval_stale");
    expect(approvalIssues(approved, quiz, "quiz", quiz.id, "es")).toContain("approval_subject_mismatch");
  });
  it("flags empty Spanish templates even when structurally valid", () => {
    const quiz = [...publication.preparedQuizzes.values()].find(quiz => quiz.context === "Completa con la forma exacta: ___.")!;
    expect(quizStructureIssues(quiz)).toEqual([]);
    expect(quizEditorialIssues(quiz)).toContain("template_context");
    expect(() => assertEditorialRelease(publication)).toThrow("Editorial publication gate blocked");
  });
  it.each([
    "Nina emploie « chat » pour exprimer cette idée : animal domestique.",
    "Le professeur emploie « chat » pour exprimer cette idée : animal domestique.",
    "Dans cet exercice, « chat » prend un sens précis : animal domestique.",
    "Ici, « chat » sert à désigner ou exprimer ceci : animal domestique.",
    "Le terme qui signifie « animal domestique » est _____.",
    "Le terme précis pour exprimer « animal domestique » est _____.",
    "Dans le glossaire, _____ correspond à cette définition : « animal domestique ».",
    "Pour exprimer l’idée « animal domestique », le mot attendu est _____.",
    "Le mot chat est précis. Paul compare fenêtre, Léa note cahier et Marc choisit jardin.",
    "Dans cette situation, le mot « chat » exprime précisément ceci : animal domestique.",
    "Le contexte pédagogique montre que « chat » renvoie à ceci : animal domestique.",
    "Complétez avec le mot qui signifie « animal domestique » : _____.",
  ])("rejects imported French definition/choice-list frames: %s", context => {
    const quiz = prepareQuiz({ ...example, contextFrench: context }, "fr");
    expect(quizEditorialIssues(quiz)).toContain("template_context");
  });
  it("does not classify ordinary teaching scenes as definition templates", () => {
    for (const context of ["Le professeur regarde le chat dormir.", "Nina emploie un tissu doux pour nettoyer le chat.", "Dans cet exercice, le chat saute par-dessus une barre."]) {
      expect(quizEditorialIssues(prepareQuiz({ ...example, contextFrench: context }, "fr"))).not.toContain("template_context");
    }
  });
});

describe("versioned sources and stable editorial chunks", () => {
  it("reconstructs all texts with exact offsets and distinguishes metadata from wording", () => {
    for (const work of publication.bundle.works) {
      const binding = textBinding(publication.bundle, publication.expressionCatalog.occurrences, work.id);
      const source = publication.bundle.sources.find(source => source.workId === work.id)!;
      for (const anchor of binding.units) expect(source.canonicalText.slice(anchor.start, anchor.end)).toBe(publication.bundle.units.find(unit => unit.id === anchor.unitId)!.french);
      expect(() => assertTextBinding(publication.textBindings.get(work.id)!, binding, work.id)).not.toThrow();
    }
    const changed = structuredClone(publication.bundle);
    const id = changed.works[0]!.id;
    changed.works[0]!.title += " (metadata only)";
    changed.sources.find(source => source.workId === id)!.provenance.citation += " (citation correction)";
    expect(textBinding(changed, publication.expressionCatalog.occurrences, id)).toEqual(publication.textBindings.get(id));
  });
  it("blocks source/unit divergence and stale annotation positions", () => {
    const changed = structuredClone(publication.bundle);
    const unit = changed.units[0]!;
    unit.french += " Extra.";
    expect(() => textBinding(changed, publication.expressionCatalog.occurrences, unit.workId)).toThrow("reconstruct");
    const binding = structuredClone(publication.textBindings.get(unit.workId)!);
    binding.units[0]!.start++;
    expect(() => assertTextBinding(binding, publication.textBindings.get(unit.workId)!, unit.workId)).toThrow("Stale");
  });
  it("changes only one record bucket when a question is corrected", () => {
    const source = publication.sharedSources.es;
    const before = sharedSourceFiles(source);
    const edited = structuredClone(source);
    edited.quizzes[0]!.context += " Una frase nueva.";
    const after = sharedSourceFiles(edited);
    expect([...after.keys()].filter(path => JSON.stringify(before.get(path)) !== JSON.stringify(after.get(path)))).toHaveLength(1);
    expect([...after.keys()].some(path => path.includes("/lemmas/"))).toBe(true);
    expect([...after.keys()].some(path => path.includes("/reviews/"))).toBe(true);
  });
  it("reports duplicate candidates without merging their identities", () => {
    const originalIds = publication.bundle.lemmas.map(item => item.id);
    const candidates = duplicateCandidates(publication);
    expect(candidates.filter(item => item.language === "fr")).toHaveLength(35);
    expect(candidates.every(item => item.status === "pending")).toBe(true);
    expect(publication.bundle.lemmas.map(item => item.id)).toEqual(originalIds);
  });
});
