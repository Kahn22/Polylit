import type { LibraryIndex } from "../delivery/types.js";
import { libraryStatusFor, type LibraryStatus, type ReadingLibraryState } from "../app/state.js";
import { escapeHtml } from "../app/html.js";
/** Shared build-time/browser markup: personal counts are supplied, never embedded at publication. */
export function libraryMarkup(index: LibraryIndex, readingLibraryState: ReadingLibraryState, dueCounts: ReadonlyMap<string, number>, unencounteredCounts: ReadonlyMap<string, number>, navigation: string): string {
  const visibleWorks = index.catalog.works;
  const dueCount = (id = "all") => dueCounts.get(id) ?? 0;
  const unencounteredVocabularyCount = (id: string) => unencounteredCounts.get(id) ?? index.works[id]?.vocabularyTokens.length ?? 0;
  const languageName = () => index.language === "fr" ? "French" : "Spanish";
  const originLabel = (work: LibraryIndex["catalog"]["works"][number]) => [work.originCountryFlag, work.originCountryName].filter(Boolean).join(" ");
  const workMetadata = (id: string) => {
    const work = visibleWorks.find(work => work.id === id)!;
    const book = index.catalog.books.find(book => book.id === work.bookId)!;
    const collection = index.catalog.collections.find(collection => collection.id === book.collectionId)!;
    const author = index.catalog.authors.find(author => author.id === collection.authorId)!;
    return { collection, author };
  };
function renderTextCard(work: LibraryIndex["catalog"]["works"][number], status: LibraryStatus) {
  const { collection, author } = workMetadata(work.id);
  const unencountered = unencounteredVocabularyCount(work.id);
  const textDue = dueCount(work.id);
  const workId = escapeHtml(work.id);
  const advisory = work.contentAdvisory ? `<p class="card-meta">Content advisory: ${escapeHtml(work.contentAdvisory)}</p>` : "";
  const metadata = `<div class="text-card-title"><p class="card-meta">${escapeHtml(author.name)} · ${escapeHtml(collection.title)} · ${escapeHtml(originLabel(work))}</p><h3>${escapeHtml(work.title)}</h3>${advisory}</div>`;
  const counts = `<div class="card-counts"><span class="unencountered-count"><strong>${unencountered}</strong> unencountered</span>${status === "available" ? "" : `<span class="due-count"><strong data-due-count data-scope="${workId}">${textDue}</strong> due</span>`}</div>`;
  const bookAction = `<button class="secondary book-view-action" type="button" data-route="#/book/${workId}">Read in Book View</button>`;
  const reviewAction = status !== "available" ? `<button type="button" data-action="start-review-text" data-work-id="${workId}" ${textDue === 0 ? "disabled" : ""}>Review due words and expressions</button>` : "";
  const menu = (actions: string) => reviewAction || actions ? `<details class="card-menu"><summary aria-label="More options for ${escapeHtml(work.title)}">•••</summary><div class="card-menu-items">${reviewAction}${actions}</div></details>` : "";
  const actions = (primaryAction: string, menuActions: string) => `<div class="card-primary"><div class="card-action-stack">${primaryAction}${bookAction}</div>${menu(menuActions)}</div>`;
  if (status === "available") return `<article class="text-card">${metadata}${counts}${actions(`<button class="primary" type="button" data-action="start-reading" data-work-id="${workId}">Start learning</button>`, `<button type="button" data-action="mark-reading" data-work-id="${workId}">Move to Reading</button>`)}</article>`;
  if (status === "completed") return `<article class="text-card completed-card">${metadata}${counts}${actions(`<button class="secondary" type="button" data-action="start-reading" data-work-id="${workId}">Read again</button>`, "")}</article>`;
  return `<article class="text-card reading-card">${metadata}${counts}${actions(`<button class="primary" type="button" data-route="#/read/${workId}">Continue learning</button>`, `<button type="button" data-action="stop-reading" data-work-id="${workId}">Move to available</button><button class="complete-action" type="button" data-action="mark-completed" data-work-id="${workId}">Mark completed</button>`)}</article>`;
}

function renderLibrary() {
  const totalDue = dueCount();
  const easiestFirst = (works: typeof visibleWorks) => [...works].sort((a, b) => unencounteredVocabularyCount(a.id) - unencounteredVocabularyCount(b.id) || a.title.localeCompare(b.title, "fr"));
  const reading = easiestFirst(visibleWorks.filter((work) => libraryStatusFor(readingLibraryState, work.id) === "reading"));
  const available = easiestFirst(visibleWorks.filter((work) => libraryStatusFor(readingLibraryState, work.id) === "available"));
  const completed = easiestFirst(visibleWorks.filter((work) => libraryStatusFor(readingLibraryState, work.id) === "completed"));
  const shelf = (id: string, eyebrow: string, title: string, works: typeof visibleWorks, empty: string, expanded = false) => `<details class="library-shelf" ${expanded ? "open" : ""}><summary class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2 id="${id}">${title}</h2></div><span class="shelf-count">${works.length}</span><span class="shelf-chevron" aria-hidden="true">⌄</span></summary>${works.length ? `<div class="text-grid">${works.map((work) => renderTextCard(work, libraryStatusFor(readingLibraryState, work.id))).join("")}</div>` : `<p class="empty-shelf">${empty}</p>`}</details>`;
  return `${navigation}<div class="page library-page"><header class="library-header"><div><p class="eyebrow">Polylit · ${languageName()} library</p><h1>Your ${languageName().toLowerCase()} library</h1><p class="lede">Mark any available text as Reading to open it and activate its vocabulary and expression reviews.</p></div>
    <button class="review-hero" type="button" data-action="start-review-all" ${totalDue === 0 ? "disabled" : ""}><span>Review all due items</span><strong data-due-count data-scope="all">${totalDue}</strong><small>${totalDue === 1 ? "word or expression due" : "words or expressions due"}</small></button></header>
    ${shelf("reading-title", "Active shelf", "Reading", reading, "No texts are marked as Reading.", true)}
    ${shelf("available-title", "Library", "Available texts", available, "Every available text is currently in your Reading or Completed list.")}
    ${shelf("completed-title", "Your history", "Completed texts", completed, "Completed texts will appear here.")}
    <p class="preview-notice">Preview account · Library status and progress are saved only in this browser.</p></div>`;
}


  return renderLibrary();
}
