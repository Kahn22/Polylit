import {loadPublication} from '../src/publication/repository.js';
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { appBundle, appExpressionCatalog } from "../src/app/content.js";
import { highlightedContext } from "../src/app/quiz-view.js";
import { ContentLoader } from "../src/app/content-loader.js";
import { ProgressIndex } from "../src/app/progress-index.js";
import { createCompactPackages } from "../src/delivery/compact-packages.js";
import { validateExpressionCatalog, type ExpressionCatalog } from "../src/domain/expression-content.js";
import { expressionMasteryKey } from "../src/domain/runtime.js";
import { createEncounter } from "../src/learner/scheduler.js";

const plan = JSON.parse(readFileSync("content/sources/wrk_voltaire_micromegas/whole-work-scope-plan-27.json", "utf8"));
const phrases = [...plan.phraseComponents, ...plan.candidatePhraseComponents] as {
  workId?: string; unitId?: string; start: number; end: number; text: string; context: string;
  lexicalSegments: { start: number; end: number; text: string }[];
}[];
const identity = { id: "exi_faire_figure", headword: "faire figure", gloss: "present an appearance", definition: "Présenter une apparence ou une impression." };
function proposed(index: number) {
  const phrase = phrases[index]!;
  const surfaceId = `exs_faire_figure_${index + 1}`;
  const occurrence = { id: `exo_faire_figure_${index + 1}`, identityId: identity.id, surfaceId,
    workId: phrase.workId ?? "wrk_voltaire_micromegas", unitId: phrase.unitId ?? `unt_micromegas_figure_${index + 1}`,
    start: phrase.start, end: phrase.end, text: phrase.text, lexicalSegments: phrase.lexicalSegments };
  const choices = [phrase.text, "dessine une figure", "observe une figure", "décrit une figure"];
  const quizzes: ExpressionCatalog["preparedQuizzes"] = [
    { id: `exq_figure_${index + 1}_early`, expressionId: identity.id, surfaceId, band: "levels_1_3", format: "meaning_choice", contextFrench: phrase.context + " Autre pensée.", targetText: phrase.text, targetSegments: phrase.lexicalSegments.map(({ start, end }) => ({ start, end })), choicesEnglish: ["present an appearance", "draw a face", "observe a face", "describe a face"], correctAnswer: "present an appearance" },
    { id: `exq_figure_${index + 1}_middle`, expressionId: identity.id, surfaceId, band: "levels_4_5", format: "surface_completion", contextFrench: "Dans ce récit, ils ___ devant les autres.", choicesFrench: choices, correctAnswer: phrase.text },
    { id: `exq_figure_${index + 1}_late`, expressionId: identity.id, surfaceId, band: "levels_6_8", format: "target_identification", contextFrench: choices.join(" ; "), promptFrench: "Quel groupe exprime une apparence ?", choicesFrench: choices, correctAnswer: phrase.text },
  ];
  return { occurrence, quizzes, phrase };
}

describe("printed expression surfaces with one shared meaning", () => {
  it("validates three independent surfaces and fails closed on quiz or source drift", () => {
    const bundle = structuredClone(loadPublication('content/sources/wrk_voltaire_micromegas/publication-baseline-376').bundle);
    const proposals = phrases.map((_, index) => proposed(index));
    for (const { occurrence, phrase } of proposals.slice(1)) bundle.units.push({ id: occurrence.unitId, workId: occurrence.workId, ordinal: 300, french: phrase.context });
    const cendrillon = proposals[0]!.occurrence;
    const original = structuredClone(bundle.occurrences);
    bundle.occurrences = bundle.occurrences.filter(item => item.unitId !== cendrillon.unitId || !cendrillon.lexicalSegments.some(part => part.start === item.start && part.end === item.end));
    const catalog: ExpressionCatalog = { identities: [identity], occurrences: proposals.map(item => item.occurrence), preparedQuizzes: proposals.flatMap(item => item.quizzes) };
    expect(validateExpressionCatalog(bundle, catalog)).toEqual([]);
    const duplicate = structuredClone(bundle);
    duplicate.occurrences = original;
    expect(validateExpressionCatalog(duplicate, catalog).map(item => item.code)).toContain("expression.duplicate_component");
    const doubleRoute = structuredClone(catalog);
    doubleRoute.occurrences.push({ ...cendrillon, id: "exo_faire_figure_duplicate", surfaceId: "exs_faire_figure_duplicate" });
    expect(validateExpressionCatalog(bundle, doubleRoute).map(item => item.code)).toContain("expression.duplicate_surface_route");
    const missingGrammar = structuredClone(bundle);
    missingGrammar.occurrences = missingGrammar.occurrences.filter(item => !(item.unitId === cendrillon.unitId && item.start === 158 && item.end === 164));
    expect(validateExpressionCatalog(missingGrammar, catalog).map(item => item.code)).toContain("expression.intervening_token_missing");
    expect(new Set(catalog.occurrences.map(item => expressionMasteryKey(item.identityId, item.surfaceId))).size).toBe(3);
    const missing = structuredClone(catalog);
    missing.preparedQuizzes = missing.preparedQuizzes.filter(item => item.surfaceId !== "exs_faire_figure_1" || item.band !== "levels_4_5");
    expect(validateExpressionCatalog(bundle, missing).map(item => item.code)).toContain("expression.missing_prepared_quiz");
    const wrongSurface = structuredClone(catalog);
    wrongSurface.preparedQuizzes[3]!.surfaceId = "exs_faire_figure_1";
    expect(validateExpressionCatalog(bundle, wrongSurface).map(item => item.code)).toContain("expression.duplicate_band");
    const wrongSegments = structuredClone(catalog);
    if (wrongSegments.preparedQuizzes[3]!.band === "levels_1_3") wrongSegments.preparedQuizzes[3]!.targetSegments![0]!.start += 1;
    expect(validateExpressionCatalog(bundle, wrongSegments).map(item => item.code)).toContain("expression.invalid_target_segments");
  });

  it("delivers the Cendrillon surface and its prepared segmented question under its own mastery key", async () => {
    const one = proposed(0);
    const bundle = structuredClone(appBundle);
    bundle.occurrences = bundle.occurrences.filter(item => item.unitId !== one.occurrence.unitId || !one.occurrence.lexicalSegments.some(part => part.start === item.start && part.end === item.end));
    const catalog: ExpressionCatalog = { identities: [...appExpressionCatalog.identities, identity], occurrences: [...appExpressionCatalog.occurrences, one.occurrence], preparedQuizzes: [...appExpressionCatalog.preparedQuizzes, ...one.quizzes] };
    expect(validateExpressionCatalog(bundle, catalog)).toEqual([]);
    const packages = createCompactPackages(bundle, catalog);
    const key = expressionMasteryKey(identity.id, one.occurrence.surfaceId);
    const index = packages.libraryIndexes.fr;
    expect(index.works.wrk_perrault_cendrillon!.expressionIdentityKeys).toContain(`${one.occurrence.surfaceId}:${identity.id}`);
    const loader = new ContentLoader("https://polylit.test/content", async (url) => {
      const path = String(url).split("/content/")[1]!;
      return new Response(packages.files.get(path) ?? "{}", { status: packages.files.has(path) ? 200 : 404 });
    });
    await loader.library("fr");
    const record = await loader.quiz(key);
    expect(record.items.map(item => item.band)).toEqual(["levels_1_3", "levels_4_5", "levels_6_8"]);
    const early = record.items.find(item => item.band === "levels_1_3")!;
    expect(highlightedContext(early).match(/<mark>/g)).toHaveLength(2);
    expect(highlightedContext(early)).toContain("</mark> grande <mark>");
    const progress = new ProgressIndex(index);
    const encountered = { [key]: createEncounter(new Date("2026-10-01T12:00:00Z"), true) };
    progress.refresh(encountered, new Set(["wrk_perrault_cendrillon"]), 1, new Date("2026-10-01T12:00:01Z"));
    expect(progress.claims("wrk_perrault_cendrillon").map(item => item.vocabularyIdentity)).toContain(key);
    expect(encountered).not.toHaveProperty(expressionMasteryKey(identity.id));
  });
});
