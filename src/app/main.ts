import { answerReview, claimReview, createEncounter, createReviewSession, isDue, isVocabularyLearnerState, type ReviewClaim, type VocabularyLearnerStateRecord } from "../learner/scheduler.js";
import { quizBandForMasteryLevel, expressionMasteryKey } from "../domain/runtime.js";
import type { Quiz } from "../delivery/types.js";
import { bundle, contentIndex, contentLoader, expressionCatalog, initializeAppShell, libraryIndex, loadReadingSection } from "./app-shell.js";
import { libraryMarkup } from "../presentation/library.js";
import { ProgressIndex } from "./progress-index.js";
import { observeVisibleReadingUnits } from "./reading-visibility.js";
import { sitePath } from "./paths.js";
import { ContentRequestError } from "./content-loader.js";
import { parseRoute, routeHash, type AppRoute } from "./routes.js";
import { clampMastery, isQuizEligibleLibraryStatus, libraryStatusFor, orderedChoices, parseReadingLibraryState, shouldUnderlineVocabulary, vocabularyKey, withLibraryStatus, type LibraryStatus, type ReadingLibraryState } from "./state.js";

type StudyLanguage = "fr" | "es";
const languageStorageKey = "polylit:active-language:v1";
const frenchStorageKey = "french-reading-studio:learner-state:v2";
const spanishStorageKey = "polylit:es:learner-state:v1";
const legacyStorageKey = "french-reading-studio:mastery:v1";
const demoSessionKey = "french-reading-studio:demo-session:v1";
const frenchReadingLibraryStorageKey = "french-reading-studio:reading-library:v1";
const spanishReadingLibraryStorageKey = "polylit:es:reading-library:v1";
const frenchBookPositionStorageKey = "french-reading-studio:book-position:v1";
const spanishBookPositionStorageKey = "polylit:es:book-position:v1";
// Initialize these before the top-level learner/library state reads below.
const learnerStorageKey = (language: StudyLanguage) => language === "fr" ? frenchStorageKey : spanishStorageKey;
const readingStorageKey = (language: StudyLanguage) => language === "fr" ? frenchReadingLibraryStorageKey : spanishReadingLibraryStorageKey;
const bookStorageKey = (language: StudyLanguage) => language === "fr" ? frenchBookPositionStorageKey : spanishBookPositionStorageKey;
const polylitLogoUrl = new URL("../assets/polylit-logo-display.png", import.meta.url).href;
const BOOK_SECTIONS_PER_PAGE = 8;
let visibleWorks: typeof bundle.works = [];
let visibleWorkIds = new Set<string>();
let readableWorkIds = new Set<string>();
let quizEligibleWorkIds = new Set<string>();
const app = document.querySelector<HTMLDivElement>("#app")!;

type Occurrence = (typeof bundle.occurrences)[number];
type QuizItem = Quiz;
type ExpressionQuiz = Quiz;
let progressRevision = 0;
let progressIndex: ProgressIndex | undefined;

let activeLanguage: StudyLanguage = languageFromPath() ?? loadActiveLanguage();
let learnerState = loadLearnerState(activeLanguage);
let readingLibraryState = loadReadingLibraryState(activeLanguage);
const previewRequested = new URLSearchParams(location.search).get("preview") === "1";
let demoSignedIn = readDemoSession() || previewRequested;
let currentRoute: AppRoute = routeFromLocation();
let selectedOccurrence: Occurrence | undefined;
let selectedExpressionId: string | undefined;
let selectedAnswer: string | undefined;
let activeQuiz: QuizItem | ExpressionQuiz | undefined;
let reviewLabel = "";
let quizRenderer: typeof import("./quiz-view.js").quizMarkup | undefined;
let activeClaim: ReviewClaim | undefined;
let reviewSession: ReviewClaim[] | undefined;
let reviewBacklog: ReviewClaim[] = [];
let reviewPrefetch: Promise<void> | undefined;
let reviewSessionIndex = 0;
let reviewScopeWorkId: string | undefined;
let reviewReturnRoute: AppRoute = { name: "library" };
let sectionReviewAdvances = false;
let readerSectionIndex = 0;
let bookPageIndex = 0;
let currentSection: Awaited<ReturnType<typeof loadReadingSection>> | undefined;
let encounterObserver: { disconnect(): void } | undefined;
let readingRenderRevision = 0;
let sheetScrollPosition = 0;

function lockPageScroll() {
  if (document.body.classList.contains("sheet-open")) return;
  sheetScrollPosition = window.scrollY;
  document.body.style.top = `-${sheetScrollPosition}px`;
  document.body.classList.add("sheet-open");
}

function unlockPageScroll() {
  if (!document.body.classList.contains("sheet-open")) return;
  document.body.classList.remove("sheet-open");
  document.body.style.top = "";
  window.scrollTo(0, sheetScrollPosition);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

function parsedJson(key: string): unknown {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? undefined : JSON.parse(stored);
  } catch { return undefined; }
}

function loadActiveLanguage(): StudyLanguage {
  try { return localStorage.getItem(languageStorageKey) === "es" ? "es" : "fr"; } catch { return "fr"; }
}

function languageFromPath(pathname = location.pathname): StudyLanguage | undefined {
  const match = pathname.match(/\/(fr|es)\/library\/?$/);
  return match?.[1] === "fr" || match?.[1] === "es" ? match[1] : undefined;
}

function routeFromLocation(): AppRoute {
  if (location.hash.startsWith("#/") && location.hash !== "#/") return parseRoute(location.hash);
  if (/\/languages\/?$/.test(location.pathname)) return { name: "languages" };
  if (languageFromPath()) return { name: "library" };
  return { name: "home" };
}

function routePath(route: AppRoute) {
  if (route.name === "home") return sitePath();
  if (route.name === "languages") return sitePath("languages/");
  const libraryPath = sitePath(`${activeLanguage}/library/`);
  return route.name === "library" ? libraryPath : `${libraryPath}${routeHash(route)}`;
}

function loadLearnerState(language: StudyLanguage): VocabularyLearnerStateRecord {
  const current = parsedJson(learnerStorageKey(language));
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return Object.fromEntries(Object.entries(current).filter((entry) => isVocabularyLearnerState(entry[1])));
  }
  if (language === "es") return {};
  const legacy = parsedJson(legacyStorageKey);
  if (!legacy || typeof legacy !== "object" || Array.isArray(legacy)) return {};
  const dueNow = new Date().toISOString();
  return Object.fromEntries(Object.entries(legacy).flatMap(([key, value]) => typeof value === "number" && Number.isFinite(value)
    ? [[key, { masteryLevel: clampMastery(value), nextDueAt: dueNow, obligation: "scheduled" as const, revision: 0 }]] : []));
}

function saveLearnerState() {
  progressRevision += 1;
  try { localStorage.setItem(learnerStorageKey(activeLanguage), JSON.stringify(learnerState)); } catch { /* Private browsing may prevent persistence. */ }
}

function loadReadingLibraryState(language: StudyLanguage): ReadingLibraryState {
  return parseReadingLibraryState(parsedJson(readingStorageKey(language)));
}

function loadBookPositions(): Record<string, number> {
  const value = parsedJson(bookStorageKey(activeLanguage));
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, number] => typeof entry[1] === "number" && Number.isSafeInteger(entry[1]) && entry[1] >= 0));
}

function saveBookPosition(workId: string, pageIndex: number) {
  try { localStorage.setItem(bookStorageKey(activeLanguage), JSON.stringify({ ...loadBookPositions(), [workId]: pageIndex })); } catch { /* Reading position is a local convenience. */ }
}

function refreshLibraryAccess() {
  progressRevision += 1;
  readableWorkIds = new Set(visibleWorks.filter((work) => libraryStatusFor(readingLibraryState, work.id) === "reading").map((work) => work.id));
  quizEligibleWorkIds = new Set(visibleWorks.filter((work) => isQuizEligibleLibraryStatus(libraryStatusFor(readingLibraryState, work.id))).map((work) => work.id));
}

function setLibraryStatus(workId: string, status: LibraryStatus) {
  readingLibraryState = withLibraryStatus(readingLibraryState, workId, status);
  refreshLibraryAccess();
  try { localStorage.setItem(readingStorageKey(activeLanguage), JSON.stringify(readingLibraryState)); } catch { /* Preview state may be unavailable in private browsing. */ }
}

function readDemoSession() {
  try { return sessionStorage.getItem(demoSessionKey) === "active"; } catch { return false; }
}

function setDemoSession(active: boolean) {
  demoSignedIn = active;
  try {
    if (active) sessionStorage.setItem(demoSessionKey, "active");
    else sessionStorage.removeItem(demoSessionKey);
  } catch { /* This flag is only a disposable preview convenience. */ }
}

if (previewRequested) {
  setDemoSession(true);
  if (location.pathname === sitePath()) history.replaceState(null, "", sitePath("languages/"));
}

const identityFor = (occurrence: Occurrence) => vocabularyKey(occurrence.surfaceFormId, occurrence.senseId);

function initializeSectionEncounters(workId: string, unitId: string, occurrences: readonly Occurrence[], encounteredAt: Date) {
  let changed = false;
  for (const occurrence of occurrences) {
    const key = identityFor(occurrence);
    if (learnerState[key]) continue;
    learnerState[key] = createEncounter(encounteredAt, true);
    changed = true;
  }
  for (const expressionId of new Set(expressionCatalog.occurrences
    .filter((item) => item.workId === workId && item.unitId === unitId)
    .map((item) => item.identityId))) {
    const key = expressionMasteryKey(expressionId);
    if (learnerState[key]) continue;
    learnerState[key] = createEncounter(encounteredAt, true);
    changed = true;
  }
  if (changed) {
    saveLearnerState();
    refreshReviewControls();
  }
}

const surfaceFor = (occurrence: Occurrence) => contentIndex.surfaces.get(occurrence.surfaceFormId)!;
const senseFor = (occurrence: Occurrence) => contentIndex.senses.get(occurrence.senseId)!;
const lemmaFor = (occurrence: Occurrence) => contentIndex.lemmas.get(surfaceFor(occurrence).lemmaId)!;

function actionableClaims(workId?: string, at = new Date()) {
  progressIndex?.refresh(learnerState, quizEligibleWorkIds, progressRevision, at);
  return progressIndex?.claims(workId) ?? [];
}

function actionableClaimsForSection(section: NonNullable<typeof currentSection>, at = new Date()) {
  const identities = new Set(section.occurrences.map(identityFor));
  const unitIds = new Set(section.units.map((unit) => unit.id));
  for (const occurrence of expressionCatalog.occurrences) {
    if (occurrence.workId === section.workId && unitIds.has(occurrence.unitId)) identities.add(expressionMasteryKey(occurrence.identityId));
  }
  return createReviewSession(learnerState, at).filter((claim) => identities.has(claim.vocabularyIdentity));
}

const dueCount = (workId?: string) => actionableClaims(workId).length;

function unencounteredVocabularyCount(workId: string) {
  progressIndex?.refresh(learnerState, quizEligibleWorkIds, progressRevision, new Date());
  return progressIndex?.unencountered(workId) ?? 0;
}

function formattedDueState(state: VocabularyLearnerStateRecord[string]) {
  if (isDue(state, new Date())) return state.obligation === "accelerated" ? "Révision accélérée disponible" : "Révision disponible";
  const value = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(state.nextDueAt));
  return `Prochaine révision : ${value}`;
}

function workMetadata(workId: string) {
  const work = bundle.works.find((item) => item.id === workId)!;
  const book = bundle.books.find((item) => item.id === work.bookId)!;
  const collection = bundle.collections.find((item) => item.id === book.collectionId)!;
  const author = bundle.authors.find((item) => item.id === collection.authorId)!;
  return { work, book, collection, author };
}

function languageName(language = activeLanguage) { return language === "fr" ? "French" : "Spanish"; }
function originLabel(work: (typeof bundle.works)[number]) {
  return [work.originCountryFlag, work.originCountryName].filter(Boolean).join(" ");
}
function readyWorksFor(language: "fr" | "es") {
  return bundle.works.filter((work) => ["learning_ready", "published"].includes(work.publicationState) && workMetadata(work.id).collection.language === language);
}

function logo(className: string, alt = "Polylit") {
  return `<img class="${className}" src="${escapeHtml(polylitLogoUrl)}" alt="${alt}">`;
}

function navigation() {
  return `<nav class="topbar" aria-label="Main navigation"><span class="brand">${logo("brand-logo")}</span><div class="topbar-actions"><a class="language-switch" href="${sitePath("languages/")}" target="_self">Choose language</a><a class="text-button" href="${sitePath()}" data-action="sign-out">Sign out</a></div></nav>`;
}

function renderHome() {
  const returning = demoSignedIn ? `<a class="primary button-link" href="${sitePath("languages/")}">Choose a language</a>` : "";
  app.innerHTML = `<main class="home"><section class="home-intro">${logo("home-logo")}<p class="eyebrow">${languageName()} library</p><h1>Read the language<br>in its literature.</h1><p class="lede">Authentic public-domain literature with prepared vocabulary practice and spaced review.</p>${returning}</section>
    <section class="auth-card" aria-labelledby="sign-in-title"><p class="eyebrow">Learner account</p><h2 id="sign-in-title">Sign in</h2><form><label for="email">Email</label><input id="email" type="email" autocomplete="username" disabled><label for="password">Password</label><input id="password" type="password" autocomplete="current-password" minlength="15" disabled><button class="primary wide" type="submit" disabled>Sign in</button></form>
    <p class="auth-note">Secure accounts will be connected after the hosting and authentication decision. No credentials are collected by this preview.</p><a class="secondary wide button-link" href="${sitePath("languages/")}" data-action="start-demo">Preview learner account</a><div class="auth-links"><button type="button" disabled>Create account</button><button type="button" disabled>Forgot password?</button></div></section></main>`;
}

function renderLanguageChoice() {
  app.innerHTML = `<nav class="topbar" aria-label="Account navigation"><span class="brand">${logo("brand-logo")}</span><a class="text-button" href="${sitePath("")}" data-action="sign-out">Sign out</a></nav>
    <main class="language-choice"><header><p class="eyebrow">Learner account</p><h1>What would you like to study?</h1><p class="lede">Choose a language to open its reading library.</p></header>
    <div class="language-options">
      <a class="language-card" href="${sitePath("fr/library/")}" target="_self" data-action="choose-language" data-language="fr"><span class="language-flag" aria-hidden="true">🇫🇷</span><span><strong>French</strong><small>Open the French library</small></span><span class="language-arrow" aria-hidden="true">→</span></a>
      <a class="language-card" href="${sitePath("es/library/")}" target="_self" data-action="choose-language" data-language="es"><span class="language-flag" aria-hidden="true">🇪🇸</span><span><strong>Spanish</strong><small>Open the Spanish library</small></span><span class="language-arrow" aria-hidden="true">→</span></a>
    </div></main>`;
}

function renderLibrary() {
  encounterObserver?.disconnect();
  const dueCounts = new Map([["all", dueCount()], ...visibleWorks.map(work => [work.id, dueCount(work.id)] as [string, number])]);
  const unencounteredCounts = new Map(visibleWorks.map(work => [work.id, unencounteredVocabularyCount(work.id)]));
  app.innerHTML = libraryMarkup(libraryIndex, readingLibraryState, dueCounts, unencounteredCounts, navigation());
}

async function renderText(workId: string) {
  encounterObserver?.disconnect();
  const revision = ++readingRenderRevision;
  const metadata = workMetadata(workId);
  const sectionCount = libraryIndex.works[workId]?.sectionCount ?? 0;
  readerSectionIndex = Math.max(0, Math.min(readerSectionIndex, Math.max(0, sectionCount - 1)));
  const [section, view] = await Promise.all([loadReadingSection(workId, readerSectionIndex), import("./learning-view.js")]);
  if (revision !== readingRenderRevision || currentRoute.name !== "read" || currentRoute.workId !== workId) return;
  currentSection = section;
  app.innerHTML = view.learningMarkup({ navigation: navigation(), origin: originLabel(metadata.work), metadata, readerSectionIndex, sectionCount, textDue: dueCount(workId), section, learnerState });
  observeReadingUnits(workId, section.occurrences);
  contentLoader.preloadNextSection(workId, readerSectionIndex, sectionCount);
}

function observeReadingUnits(workId: string, occurrences: Occurrence[]) {
  const encounter = (unitId: string) => initializeSectionEncounters(workId, unitId, occurrences.filter((item) => item.unitId === unitId), new Date());
  encounterObserver = observeVisibleReadingUnits([...document.querySelectorAll<HTMLElement>("[data-reading-unit]")], encounter);
}

async function renderBook(workId: string) {
  encounterObserver?.disconnect();
  currentSection = undefined;
  const metadata = workMetadata(workId);
  const pageCount = Math.max(1, Math.ceil((libraryIndex.works[workId]?.sectionCount ?? 0) / BOOK_SECTIONS_PER_PAGE));
  bookPageIndex = Math.max(0, Math.min(bookPageIndex, pageCount - 1));
  const [page, view] = await Promise.all([contentLoader.book(workId, bookPageIndex), import("./book-view.js")]);
  saveBookPosition(workId, bookPageIndex);
  app.innerHTML = view.bookMarkup({ navigation: navigation(), origin: originLabel(metadata.work), metadata, bookPageIndex, pageCount, page });
}

function renderVocabularySheet(occurrence: Occurrence) {
  if (currentRoute.name !== "read" || currentSection?.workId !== occurrence.workId || !currentSection.occurrences.some(item => item.id === occurrence.id)) return;
  // An explicit tap is also evidence that this unit was viewed, even before
  // the asynchronous visibility observer delivered its first callback.
  initializeSectionEncounters(occurrence.workId, occurrence.unitId, currentSection.occurrences.filter(item => item.unitId === occurrence.unitId), new Date());
  selectedOccurrence = occurrence;
  activeQuiz = undefined;
  const surface = surfaceFor(occurrence), sense = senseFor(occurrence), lemma = lemmaFor(occurrence);
  const state = learnerState[identityFor(occurrence)]!;
  lockPageScroll();
  app.insertAdjacentHTML("beforeend", `<div class="scrim" data-action="close-sheet"></div><aside class="sheet" aria-modal="true" role="dialog" aria-labelledby="vocabulary-title"><button class="close" type="button" data-action="close-sheet" aria-label="Fermer">×</button><p class="eyebrow">Vocabulaire · Niveau ${state.masteryLevel} sur 8</p><h2 id="vocabulary-title">${escapeHtml(surface.form)}</h2><dl><div><dt>Lemme</dt><dd>${escapeHtml(lemma.headword)}</dd></div><div><dt>Sens ici</dt><dd>${escapeHtml(sense.gloss)}</dd></div><div><dt>Catégorie</dt><dd>${escapeHtml(lemma.partOfSpeech)}</dd></div></dl></aside>`);
  document.querySelector<HTMLButtonElement>(".sheet .close")?.focus();
}

function renderExpressionSheet(expressionId: string) {
  const identity = expressionCatalog.identities.find((item) => item.id === expressionId);
  const state = learnerState[expressionMasteryKey(expressionId)];
  if (!identity || !state) return;
  selectedExpressionId = expressionId;
  selectedOccurrence = undefined;
  activeQuiz = undefined;
  const due = isDue(state, new Date());
  lockPageScroll();
  app.insertAdjacentHTML("beforeend", `<div class="scrim" data-action="close-sheet"></div><aside class="sheet" aria-modal="true" role="dialog" aria-labelledby="expression-title"><button class="close" type="button" data-action="close-sheet" aria-label="Fermer">×</button><p class="eyebrow">Expression · Niveau ${state.masteryLevel} sur 8</p><h2 id="expression-title">${escapeHtml(identity.headword)}</h2><dl><div><dt>Sens</dt><dd>${escapeHtml(identity.gloss)}</dd></div><div><dt>Définition</dt><dd>${escapeHtml(identity.definition)}</dd></div></dl><p class="schedule-status">${escapeHtml(formattedDueState(state))}</p><button class="primary" type="button" data-action="start-expression-quiz" ${due ? "" : "disabled"}>${state.obligation === "accelerated" ? "Faire la révision accélérée" : "Réviser cette expression"}</button></aside>`);
  document.querySelector<HTMLButtonElement>(".sheet .close")?.focus();
}

function renderQuiz() {
  encounterObserver?.disconnect();
  readingRenderRevision += 1;
  unlockPageScroll();
  if (!activeClaim || !activeQuiz || !quizRenderer) return finishReview();
  const state = learnerState[activeClaim.vocabularyIdentity]!;
  app.innerHTML = quizRenderer({ quiz: activeQuiz, label: reviewLabel, state, selectedAnswer, reviewSession, reviewSessionIndex, reviewScopeWorkId, sectionReviewAdvances, language: activeLanguage });
  if (selectedAnswer !== undefined) document.querySelector<HTMLButtonElement>(".continue")?.focus({ preventScroll: true });
}

function closeSheet() {
  document.querySelector(".scrim")?.remove(); document.querySelector(".sheet")?.remove();
  unlockPageScroll();
  selectedOccurrence = undefined; selectedExpressionId = undefined; activeQuiz = undefined; activeClaim = undefined;
}

async function startClaim(claim: ReviewClaim): Promise<boolean> {
  const state = learnerState[claim.vocabularyIdentity];
  if (!state || !isDue(state, new Date()) || state.revision !== claim.expectedRevision || state.nextDueAt !== claim.dueAt || state.obligation !== claim.obligation) return false;
  if (!actionableClaims(reviewScopeWorkId).some(item => item.vocabularyIdentity === claim.vocabularyIdentity)) return false;
  const [record, view] = await Promise.all([contentLoader.quiz(claim.vocabularyIdentity), import("./quiz-view.js")]);
  quizRenderer = view.quizMarkup;
  activeQuiz = record.items.find(item => item.band === quizBandForMasteryLevel(state.masteryLevel));
  if (!activeQuiz) throw new Error("The prepared question could not load.");
  reviewLabel = record.label;
  selectedOccurrence = undefined; selectedExpressionId = undefined; selectedAnswer = undefined; activeClaim = claim;
  renderQuiz();
  const upcoming = [...(reviewSession?.slice(reviewSessionIndex + 1) ?? []), ...reviewBacklog].slice(0, 3);
  void Promise.all(upcoming.map(item => contentLoader.quiz(item.vocabularyIdentity))).catch(() => undefined);
  return true;
}

async function beginReview(workId?: string, singleClaim?: ReviewClaim, suppliedClaims?: ReviewClaim[], advanceAfter = false) {
  reviewScopeWorkId = workId;
  reviewReturnRoute = workId ? { name: "read", workId } : { name: "library" };
  sectionReviewAdvances = advanceAfter;
  const claims = suppliedClaims ?? (singleClaim ? [singleClaim] : actionableClaims(workId));
  reviewSession = claims.slice(0, 10);
  reviewBacklog = claims.slice(10);
  reviewPrefetch = undefined;
  reviewSessionIndex = 0;
  if (!reviewSession[0] || !(await startClaim(reviewSession[0]))) await continueReviewSession();
}

async function continueReviewSession() {
  if (!reviewSession) return finishReview();
  const learning = { quizBatchSize: 10, quizPrefetchRemaining: 3 };
  reviewSessionIndex += 1;
  if (reviewSession.length - reviewSessionIndex <= learning.quizPrefetchRemaining && reviewBacklog.length && !reviewPrefetch) {
    const nextClaims = reviewBacklog.slice(0, learning.quizBatchSize);
    reviewPrefetch = Promise.all(nextClaims.slice(0, 3).map((claim) => contentLoader.quiz(claim.vocabularyIdentity))).then(() => undefined).catch(() => undefined);
  }
  while (reviewSessionIndex < reviewSession.length) {
    if (await startClaim(reviewSession[reviewSessionIndex]!)) return;
    reviewSessionIndex += 1;
  }
  if (reviewBacklog.length) {
    await reviewPrefetch;
    reviewSession = reviewBacklog.splice(0, learning.quizBatchSize);
    reviewSessionIndex = 0;
    reviewPrefetch = undefined;
    if (reviewSession[0] && await startClaim(reviewSession[0])) return;
    return continueReviewSession();
  }
  finishReview();
}

function finishReview() {
  const advance = sectionReviewAdvances && reviewReturnRoute.name === "read";
  reviewSession = undefined; reviewBacklog = []; reviewPrefetch = undefined; selectedOccurrence = undefined; selectedExpressionId = undefined; selectedAnswer = undefined; activeQuiz = undefined; activeClaim = undefined;
  sectionReviewAdvances = false;
  if (advance) readerSectionIndex += 1;
  go(reviewReturnRoute);
}

function leaveSectionReview(advance: boolean) {
  const route = reviewReturnRoute;
  reviewSession = undefined; reviewBacklog = []; reviewPrefetch = undefined; selectedOccurrence = undefined; selectedExpressionId = undefined; selectedAnswer = undefined; activeQuiz = undefined; activeClaim = undefined; sectionReviewAdvances = false;
  if (advance) readerSectionIndex += 1;
  go(route);
}

function go(route: AppRoute) {
  const next = routePath(route);
  if (route.name === "read" || route.name === "book") {
    const libraryPath = sitePath(`${activeLanguage}/library/`);
    if (location.pathname !== libraryPath) location.assign(next);
    else if (location.hash === routeHash(route)) requestRouteRender();
    else location.hash = routeHash(route);
    return;
  }
  if (location.pathname === next && !location.hash) requestRouteRender();
  else location.assign(next);
}

function resetTransientUi() {
  unlockPageScroll();
  selectedOccurrence = undefined; selectedExpressionId = undefined; selectedAnswer = undefined; activeQuiz = undefined; activeClaim = undefined; reviewSession = undefined; reviewBacklog = []; reviewPrefetch = undefined; sectionReviewAdvances = false;
}

async function renderCurrentRoute() {
  encounterObserver?.disconnect();
  readingRenderRevision += 1;
  currentRoute = routeFromLocation(); resetTransientUi();
  if (currentRoute.name !== "home" && !demoSignedIn) {
    currentRoute = { name: "home" };
    history.replaceState(null, "", sitePath());
  }
  if (currentRoute.name === "languages") return renderLanguageChoice();
  if (currentRoute.name === "library") return renderLibrary();
  if (currentRoute.name === "read" && readableWorkIds.has(currentRoute.workId)) return renderText(currentRoute.workId);
  if (currentRoute.name === "book" && visibleWorkIds.has(currentRoute.workId)) {
    bookPageIndex = loadBookPositions()[currentRoute.workId] ?? 0;
    return renderBook(currentRoute.workId);
  }
  renderHome();
}

async function handleClick(event: MouseEvent) {
  const target = (event.target as HTMLElement).closest<HTMLElement>("[data-occurrence-id], [data-expression-id], [data-route], [data-action], [data-answer]");
  if (!target) return;
  if (target.dataset.route) {
    if (target.dataset.route.startsWith("#/read/")) readerSectionIndex = 0;
    if (target.dataset.route.startsWith("#/book/") && currentRoute.name === "read") {
      bookPageIndex = Math.floor(readerSectionIndex / BOOK_SECTIONS_PER_PAGE);
      saveBookPosition(currentRoute.workId, bookPageIndex);
    }
    location.hash = target.dataset.route;
    return;
  }
  if (target.dataset.occurrenceId) {
    const occurrence = contentIndex.occurrences.get(target.dataset.occurrenceId);
    if (occurrence) renderVocabularySheet(occurrence);
    return;
  }
  if (target.dataset.expressionId && currentRoute.name === "read") {
    renderExpressionSheet(target.dataset.expressionId);
    return;
  }
  const action = target.dataset.action;
  if (action === "start-demo") { setDemoSession(true); return; }
  if (action === "sign-out") {
    event.preventDefault();
    setDemoSession(false);
    location.assign(sitePath());
    return;
  }
  if (action === "choose-language") {
    const language = target.dataset.language;
    if (language !== "fr" && language !== "es") return;
    try { localStorage.setItem(languageStorageKey, language); } catch { /* The destination URL selects the language. */ }
    // Leave navigation to the real link. The destination page loads its own
    // library and learner state; do not switch the selection page in place.
    return;
  }
  if (action === "switch-language") {
    activeLanguage = activeLanguage === "fr" ? "es" : "fr";
    try { localStorage.setItem(languageStorageKey, activeLanguage); } catch { /* Selection remains active for this visit. */ }
    learnerState = loadLearnerState(activeLanguage);
    readingLibraryState = loadReadingLibraryState(activeLanguage);
    visibleWorks = readyWorksFor(activeLanguage);
    visibleWorkIds = new Set(visibleWorks.map((work) => work.id));
    refreshLibraryAccess();
    currentSection = undefined;
    readerSectionIndex = 0;
    bookPageIndex = 0;
    go(demoSignedIn ? { name: "library" } : { name: "home" });
    return;
  }
  if (action === "close-sheet") { closeSheet(); return; }
  if (action === "start-review-all") { await beginReview(); return; }
  if (action === "start-reading") {
    const workId = target.dataset.workId;
    if (workId && visibleWorkIds.has(workId)) { setLibraryStatus(workId, "reading"); readerSectionIndex = 0; go({ name: "read", workId }); }
    return;
  }
  if (action === "mark-reading") {
    const workId = target.dataset.workId;
    if (workId && visibleWorkIds.has(workId)) { setLibraryStatus(workId, "reading"); renderLibrary(); }
    return;
  }
  if (action === "enter-learning") {
    const workId = target.dataset.workId;
    if (workId && visibleWorkIds.has(workId)) {
      setLibraryStatus(workId, "reading");
      readerSectionIndex = bookPageIndex * BOOK_SECTIONS_PER_PAGE;
      go({ name: "read", workId });
    }
    return;
  }
  if (action === "mark-completed") {
    const workId = target.dataset.workId;
    if (workId && visibleWorkIds.has(workId)) { setLibraryStatus(workId, "completed"); go({ name: "library" }); }
    return;
  }
  if (action === "stop-reading") {
    const workId = target.dataset.workId;
    if (workId && readableWorkIds.has(workId)) {
      const count = dueCount(workId);
      if (count > 0 && !window.confirm(`${count} due ${count === 1 ? "item" : "items"} will leave active review until you mark this text as Reading again. Your progress will be preserved.`)) return;
      setLibraryStatus(workId, "available"); renderLibrary();
    }
    return;
  }
  if (action === "start-review-text") {
    const workId = target.dataset.workId;
    if (workId && quizEligibleWorkIds.has(workId)) await beginReview(workId);
    return;
  }
  if (action === "start-expression-quiz" && selectedExpressionId) {
    const key = expressionMasteryKey(selectedExpressionId);
    const state = learnerState[key];
    if (state && isDue(state, new Date())) await beginReview(currentRoute.name === "read" ? currentRoute.workId : undefined, claimReview(key, state));
    return;
  }
  if (action === "continue-quiz") { await continueReviewSession(); return; }
  if (action === "previous-section" && currentRoute.name === "read") { readerSectionIndex -= 1; await renderText(currentRoute.workId); return; }
  if (action === "next-section" && currentRoute.name === "read") {
    const claims = currentSection ? actionableClaimsForSection(currentSection) : [];
    if (claims.length) await beginReview(currentRoute.workId, undefined, claims, true);
    else { readerSectionIndex += 1; await renderText(currentRoute.workId); }
    return;
  }
  if (action === "skip-section-review") { leaveSectionReview(true); return; }
  if (action === "reread-section") { leaveSectionReview(false); return; }
  if (action === "previous-book-page" && currentRoute.name === "book") { bookPageIndex -= 1; await renderBook(currentRoute.workId); return; }
  if (action === "next-book-page" && currentRoute.name === "book") { bookPageIndex += 1; await renderBook(currentRoute.workId); return; }
  if (action === "end-review") { finishReview(); return; }
  const answer = target.dataset.answer;
  if (answer === undefined || !activeQuiz || !activeClaim || selectedAnswer !== undefined || !activeQuiz.choices.some(choice => choice.id === answer)) return;
  const key = activeClaim.vocabularyIdentity;
  const state = learnerState[key];
  if (!state) return;
  try { learnerState[key] = answerReview(key, state, activeClaim, answer === activeQuiz.correctChoiceId, new Date()); } catch { return; }
  saveLearnerState(); selectedAnswer = answer; renderQuiz();
}

let taskInProgress = false;
let pendingRouteRender = false;
let retryTask: (() => Promise<void>) | undefined;
function requestRouteRender() {
  if (taskInProgress) pendingRouteRender = true;
  else void runTask(renderCurrentRoute);
}
function showDownloadError(error: unknown, retry: () => Promise<void>) {
  console.error("Polylit content could not load", error);
  retryTask = retry;
  document.querySelector("#content-error")?.remove();
  app.insertAdjacentHTML("afterbegin", `<section id="content-error" class="download-error" role="alert"><p>This content could not load. Your saved progress is unchanged.</p><button class="primary" type="button" data-retry-content>Retry</button> <a class="text-button" href="${sitePath(`${activeLanguage}/library/`)}">Return to library</a></section>`);
}
async function runTask(task: () => Promise<void>) {
  if (taskInProgress) return;
  taskInProgress = true;
  document.querySelector("#content-error")?.remove();
  try { await task(); retryTask = undefined; }
  catch (error) {
    // Retry the current destination/question, never replay a state-changing
    // click such as Next or Submit (which could advance or answer twice).
    const retry = error instanceof ContentRequestError && [404, 410].includes(error.status)
      ? async () => { location.reload(); }
      : !progressIndex ? startApplication : reviewSession
      ? async () => { const claim = reviewSession?.[reviewSessionIndex]; if (claim) await startClaim(claim); }
      : currentRoute.name === "read" ? async () => { if (currentRoute.name === "read") await renderText(currentRoute.workId); }
      : currentRoute.name === "book" ? async () => { if (currentRoute.name === "book") await renderBook(currentRoute.workId); }
      : renderCurrentRoute;
    showDownloadError(error, retry);
  } finally {
    taskInProgress = false;
    if (pendingRouteRender) { pendingRouteRender = false; requestRouteRender(); }
  }
}
app.addEventListener("click", (event) => {
  if ((event.target as HTMLElement).closest<HTMLElement>("[data-retry-content]")?.dataset.retryContent !== undefined) { if (retryTask) void runTask(retryTask); return; }
  void runTask(() => handleClick(event));
});

document.addEventListener("click", (event) => {
  const openMenus = [...document.querySelectorAll<HTMLDetailsElement>(".card-menu[open]")];
  if (!openMenus.length || openMenus.some((menu) => menu.contains(event.target as Node))) return;
  event.preventDefault();
  event.stopPropagation();
  for (const menu of openMenus) menu.open = false;
}, true);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.querySelector(".sheet")) closeSheet();
  else if (document.querySelector(".quiz")) sectionReviewAdvances ? leaveSectionReview(false) : finishReview();
});

window.addEventListener("hashchange", requestRouteRender);
function refreshReviewControls() {
  for (const counter of document.querySelectorAll<HTMLElement>("[data-due-count][data-scope]")) {
    const count = dueCount(counter.dataset.scope === "all" ? undefined : counter.dataset.scope);
    counter.textContent = String(count);
    const button = counter.closest<HTMLButtonElement>("button");
    if (button) button.disabled = count === 0;
  }
}
window.setInterval(refreshReviewControls, 30_000);

async function startApplication() {
  try {
    if (currentRoute.name === "home" || currentRoute.name === "languages") return renderCurrentRoute();
    await initializeAppShell(activeLanguage);
    progressIndex = new ProgressIndex(libraryIndex);
    activeLanguage = languageFromPath() ?? loadActiveLanguage();
    try { localStorage.setItem(languageStorageKey, activeLanguage); } catch { /* The URL remains authoritative. */ }
    learnerState = loadLearnerState(activeLanguage);
    readingLibraryState = loadReadingLibraryState(activeLanguage);
    visibleWorks = readyWorksFor(activeLanguage);
    visibleWorkIds = new Set(visibleWorks.map((work) => work.id));
    refreshLibraryAccess();
    // The lightweight landing script owns clicks until all library data is
    // ready. From this point onward the complete application takes over.
    (window as Window & { __polylitAppReady?: boolean }).__polylitAppReady = true;
    await renderCurrentRoute();
  } catch (error) { throw error; }
}

void runTask(startApplication);
