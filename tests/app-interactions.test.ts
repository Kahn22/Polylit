import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { appBundle, appExpressionCatalog, appPreparedQuizzes } from "../src/app/content.js";
import { createCompactPackages } from "../src/delivery/compact-packages.js";
import { createReviewSession } from "../src/learner/scheduler.js";
import { quizShard } from "../src/delivery/identity-token.js";
import type { QuizIndex, QuizPackage, ReadingSection, WorkManifest } from "../src/delivery/types.js";
import { spanishEditorial02 } from "../src/content/editorial/spanish-02.js";
import type { VocabularyLearnerStateRecord } from "../src/learner/scheduler.js";
let packages: ReturnType<typeof createCompactPackages>;
beforeAll(() => { packages = createCompactPackages(appBundle, appExpressionCatalog, appPreparedQuizzes); });
beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());
const workId = "wrk_maupassant_la_parure";
const learnerKey = "french-reading-studio:learner-state:v2";
const bookKey = "french-reading-studio:book-position:v1";

function environment(language: "fr" | "es" = "fr") {
  const index = packages.libraryIndexes[language];
  const saved = new Map<string, string>();
  const location = new URL(`https://polylit.test/${language}/library/`);
  const handlers = new Map<string, () => void>();
  let clickHandler: (event: unknown) => void;
  const app = {
    innerHTML: "",
    addEventListener: (name: string, handler: typeof clickHandler) => { if (name === "click") clickHandler = handler; },
    insertAdjacentHTML: (_position: string, html: string) => { app.innerHTML = html + app.innerHTML; },
  };
  const reviewButton = { disabled: true };
  const dueCounter = { dataset: { scope: workId }, textContent: "0", closest: () => reviewButton };
  let activeElement: unknown = null;
  const continueButton = { focus: vi.fn(() => { activeElement = continueButton; }) };
  let observed: { dataset: { readingUnit: string } }[] = [];
  let observeCallback: (entries: unknown[], observer: unknown) => void;
  const observer = { unobserve: vi.fn() };
  class TestObserver {
    constructor(callback: typeof observeCallback) { observeCallback = callback; observed = []; }
    observe(element: typeof observed[number]) { observed.push(element); }
    disconnect() { observed = []; }
    unobserve() {}
  }
  const fetcher = vi.fn(async (url: string | URL | Request, _options?: RequestInit) => {
    const path = String(url).split("/content/")[1]!;
    return new Response(packages.files.get(path) ?? "{}", { status: packages.files.has(path) ? 200 : 404 });
  });
  vi.stubGlobal("location", location);
  vi.stubGlobal("localStorage", { getItem: (key: string) => saved.get(key) ?? null, setItem: (key: string, value: string) => saved.set(key, value) });
  vi.stubGlobal("sessionStorage", { getItem: () => "active" });
  vi.stubGlobal("fetch", fetcher);
  vi.stubGlobal("IntersectionObserver", TestObserver);
  vi.stubGlobal("window", { IntersectionObserver: TestObserver, addEventListener: (name: string, handler: () => void) => handlers.set(name, handler), removeEventListener: vi.fn(), setInterval: vi.fn(), scrollTo: vi.fn(), scrollY: 0 });
  vi.stubGlobal("document", {
    querySelector: (selector: string) => {
      if (selector === "#app") return app;
      if (selector.startsWith("#polylit-library-data")) return { textContent: JSON.stringify(index) };
      if (selector === "#content-error" && app.innerHTML.includes('id="content-error"')) return { remove: () => { app.innerHTML = app.innerHTML.replace(/<section id="content-error"[\s\S]*?<\/section>/, ""); } };
      if ((selector === ".continue" || selector === '[data-action="continue-quiz"]') && app.innerHTML.includes('data-action="continue-quiz"')) return continueButton;
      return null;
    },
    querySelectorAll: (selector: string) => selector === "[data-due-count][data-scope]" ? [dueCounter] : selector === "[data-reading-unit]" ? [...app.innerHTML.matchAll(/data-reading-unit="([^"]+)"/g)].map(match => ({ dataset: { readingUnit: match[1]! }, isConnected: true })) : [],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(), hidden: false,
    get activeElement() { return activeElement; },
    body: { classList: { contains: () => false, add: vi.fn(), remove: vi.fn() }, style: { top: "" } },
  });
  const click = async (dataset: Record<string, string>) => {
    clickHandler({ target: { closest: (selector: string) => selector === "[data-retry-content]" ? ("retryContent" in dataset ? { dataset } : null) : { dataset } } });
    await Promise.resolve();
  };
  const hashChange = () => handlers.get("hashchange")!();
  const viewUnit = (id: string) => { observeCallback([{ isIntersecting: true, intersectionRatio: 0.5, target: observed.find(element => element.dataset.readingUnit === id)! }], observer); };
  const viewFirstUnit = () => viewUnit(observed[0]!.dataset.readingUnit);
  const lateCallback = () => { const callback = observeCallback, target = observed[0]; return () => callback([{ isIntersecting: true, intersectionRatio: 0.5, target }], observer); };
  return { app, saved, fetcher, click, hashChange, viewFirstUnit, viewUnit, lateCallback, index, location, reviewButton, dueCounter };
}

describe("learner flow against generated content", () => {
  it.each(spanishEditorial02)("preserves history and applies the viewed-only policy to $senseId", async entry => {
    const env = environment("es");
    const spanishKey = "polylit:es:learner-state:v1";
    const prior: VocabularyLearnerStateRecord = Object.fromEntries(spanishEditorial02.map(item => [`srf_es_${item.oldSuffix}:sns_es_${item.oldSuffix}`, { masteryLevel: 8, nextDueAt: "2099-01-01T12:34:56.000Z", obligation: "scheduled", revision: 17 }]));
    env.saved.set(spanishKey, JSON.stringify(prior));
    const state = () => JSON.parse(env.saved.get(spanishKey)!) as VocabularyLearnerStateRecord;
    const occurrence = appBundle.occurrences.find(item => item.id === entry.occurrenceIds[0])!;
    const key = `${occurrence.surfaceFormId}:${occurrence.senseId}`;
    await import("../src/app/main.js");
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("Your spanish library"));
    expect(state()).toEqual(prior);
    await env.click({ route: `#/book/${occurrence.workId}` }); env.hashChange();
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("No underlining, quizzes, or vocabulary tracking in Book View."));
    expect(state()).toEqual(prior);
    await env.click({ action: "enter-learning", workId: occurrence.workId }); env.hashChange();
    const manifest = JSON.parse(packages.files.get(env.index.works[occurrence.workId]!.manifest)!) as WorkManifest;
    let found = false;
    for (const path of manifest.sections) {
      const section = JSON.parse(packages.files.get(path)!) as ReadingSection;
      await vi.waitFor(() => expect(env.app.innerHTML).toContain(`data-reading-unit="${section.units[0]!.id}"`));
      expect(state()).toEqual(prior); // Loading and prefetching are not viewing.
      if (section.units.some(unit => unit.id === occurrence.unitId)) { found = true; break; }
      await env.click({ action: "next-section" });
    }
    expect(found).toBe(true);
    env.viewUnit(occurrence.unitId);
    for (const [id, old] of Object.entries(prior)) expect(state()[id]).toEqual(old);
    expect(state()[key]?.masteryLevel).toBe(key in prior ? 8 : 1);
    expect(state()[key]?.revision).toBe(key in prior ? 17 : 0);
    const after = state();
    env.viewUnit(occurrence.unitId);
    expect(state()).toEqual(after); // Rereading does not reset or reschedule.
    const deliverLate = env.lateCallback();
    await env.click({ route: `#/book/${occurrence.workId}` }); env.hashChange();
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("No underlining, quizzes, or vocabulary tracking in Book View."));
    deliverLate();
    expect(state()).toEqual(after);
  });
  it("keeps Book View encounter-free, encounters only viewed units, and reviews without fetching reading data", async () => {
    const env = environment();
    await import("../src/app/main.js");
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("Your french library"));
    await env.click({ route: `#/book/${workId}` }); env.hashChange();
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("No underlining, quizzes, or vocabulary tracking in Book View."));
    expect(env.saved.has(learnerKey)).toBe(false);
    expect(env.fetcher.mock.calls.every(([url]) => !String(url).includes("/reading/") && !String(url).includes("/quizzes/"))).toBe(true);
    await env.click({ action: "enter-learning", workId }); env.hashChange();
    await vi.waitFor(() => expect(env.app.innerHTML).toContain('data-reading-unit="'));
    expect(env.saved.has(learnerKey)).toBe(false);
    expect(env.reviewButton.disabled).toBe(true);
    env.viewFirstUnit();
    expect(env.reviewButton.disabled).toBe(false);
    expect(Number(env.dueCounter.textContent)).toBeGreaterThan(0);
    const state = JSON.parse(env.saved.get(learnerKey)!);
    const manifest = JSON.parse(packages.files.get(env.index.works[workId]!.manifest)!) as WorkManifest;
    const section = JSON.parse(packages.files.get(manifest.sections[0]!)!) as ReadingSection;
    const expected = new Set(section.occurrences.filter(item => item.unitId === section.units[0]!.id).map(item => `${item.surfaceFormId}:${item.senseId}`));
    for (const item of section.expressionCatalog.occurrences.filter(item => item.unitId === section.units[0]!.id)) expected.add(`expression:${item.identityId}`);
    expect(new Set(Object.keys(state))).toEqual(expected);
    env.fetcher.mockClear();
    await env.click({ action: "next-section" });
    await vi.waitFor(() => expect(env.app.innerHTML).toContain('class="quiz"'));
    expect(env.app.innerHTML).toContain("Skip review and read the next section");
    expect(env.fetcher.mock.calls.every(([url]) => !String(url).includes("/reading/") && !String(url).includes("/works/"))).toBe(true);
    const claim = createReviewSession(state, new Date())[0]!;
    const quizIndex = JSON.parse(packages.files.get(env.index.quizzes)!) as QuizIndex;
    const batch = JSON.parse(packages.files.get(quizIndex.shards[quizShard(claim.vocabularyIdentity)]!)!) as QuizPackage;
    const quiz = batch.records.find(record => record.identity === claim.vocabularyIdentity)!.items.find(item => item.band === "levels_1_3")!;
    await env.click({ answer: quiz.choices.find(choice => choice.id === quiz.correctChoiceId)!.text });
    expect(env.saved.get(learnerKey)).toEqual(JSON.stringify(state));
    await env.click({ answer: quiz.correctChoiceId });
    await vi.waitFor(() => expect(JSON.parse(env.saved.get(learnerKey)!)[claim.vocabularyIdentity].masteryLevel).toBe(2));
    expect(env.app.innerHTML).toContain('class="quiz-result"');
    expect(env.app.innerHTML).toContain('class="correct-answer"');
    expect(env.app.innerHTML).not.toContain('class="quiz-choices"');
    expect(document.activeElement).toBe(document.querySelector('[data-action="continue-quiz"]'));
    const afterAnswer = env.saved.get(learnerKey);
    await env.click({ action: "reread-section" });
    await vi.waitFor(() => expect(env.app.innerHTML).toContain('data-reading-unit="'));
    expect(env.saved.get(learnerKey)).toBe(afterAnswer);
  });
  it("retries a failed next Book View page without advancing twice or erasing progress", async () => {
    const env = environment();
    const existing = JSON.stringify({ "srf_existing:sns_existing": { masteryLevel: 8, nextDueAt: "2030-01-01T00:00:00.000Z", obligation: "scheduled", revision: 12 } });
    env.saved.set(learnerKey, existing);
    await import("../src/app/main.js");
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("Your french library"));
    await env.click({ route: `#/book/${workId}` }); env.hashChange();
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("Part 1 of"));
    env.fetcher.mockRejectedValueOnce(new Error("Temporary offline test"));
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    await env.click({ action: "next-book-page" });
    await vi.waitFor(() => expect(env.app.innerHTML).toContain('id="content-error"'));
    await env.click({ retryContent: "" });
    await vi.waitFor(() => expect(env.app.innerHTML).toContain("Part 2 of"));
    expect(env.app.innerHTML).not.toContain('id="content-error"');
    expect(JSON.parse(env.saved.get(bookKey)!)[workId]).toBe(1);
    expect(env.saved.get(learnerKey)).toBe(existing);
    errorLog.mockRestore();
  });
});
