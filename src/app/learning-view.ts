import type { ReadingSection } from "../delivery/types.js";
import type { VocabularyLearnerStateRecord } from "../learner/scheduler.js";
import type { ViewMetadata } from "./view-types.js";
import { shouldUnderlineVocabulary, vocabularyKey } from "./state.js";
import { escapeHtml } from "./html.js";
function renderUnitFrench(unit: ReadingSection["units"][number], occurrences: ReadingSection["occurrences"], learnerState: VocabularyLearnerStateRecord) {
  const unitOccurrences = occurrences.filter((item) => item.unitId === unit.id).sort((a, b) => a.start - b.start);
  let cursor = 0;
  let html = "";
  for (const occurrence of unitOccurrences) {
    html += escapeHtml(unit.text.slice(cursor, occurrence.start));
    const text = unit.text.slice(occurrence.start, occurrence.end);
    const masteryLevel = learnerState[vocabularyKey(occurrence.surfaceFormId, occurrence.senseId)]?.masteryLevel ?? 1;
    const className = shouldUnderlineVocabulary(masteryLevel) ? "word learning-word" : "word";
    html += `<button class="${className}" type="button" data-occurrence-id="${escapeHtml(occurrence.id)}" aria-label="Étudier ${escapeHtml(text)}">${escapeHtml(text)}</button>`;
    cursor = occurrence.end;
  }
  return html + escapeHtml(unit.text.slice(cursor));
}


export function learningMarkup({ navigation, origin, metadata, readerSectionIndex, sectionCount, textDue, section, learnerState }: { navigation: string; origin: string; metadata: ViewMetadata; readerSectionIndex: number; sectionCount: number; textDue: number; section: ReadingSection; learnerState: VocabularyLearnerStateRecord }): string {
  const { units, occurrences } = section;
  const sectionExpressions = section.expressionCatalog.identities;
  const workId = metadata.work.id;
  const isSpanish = metadata.collection.language === "es";
  return `${navigation}<div class="page reader-page"><button class="back" type="button" data-route="#/library">← Your library</button><header><p class="eyebrow">${escapeHtml(metadata.author.name)} · ${escapeHtml(metadata.collection.title)} · ${escapeHtml(origin)} · ${isSpanish ? "Libro" : "Livre"} ${metadata.book.ordinal} · ${isSpanish ? "Texto" : "Texte"} ${metadata.work.ordinal}</p><h1>${escapeHtml(metadata.work.title)}</h1><p class="lede">${isSpanish ? "Texto español auténtico · Toca una palabra subrayada para estudiarla." : "Passage français authentique · Touchez un mot souligné pour l’étudier."}</p>
    <div class="reader-actions"><button class="review-button" type="button" data-action="start-review-text" data-work-id="${escapeHtml(workId)}" ${textDue === 0 ? "disabled" : ""}>Réviser les mots et expressions de ce texte <span class="due-pill" data-due-count data-scope="${escapeHtml(workId)}">${textDue}</span></button><button class="secondary" type="button" data-route="#/book/${escapeHtml(workId)}">Switch to Book View</button><button class="text-button complete-action" type="button" data-action="mark-completed" data-work-id="${escapeHtml(workId)}">Mark completed</button></div></header>
    <main class="text-units" lang="${metadata.collection.language}" aria-label="${isSpanish ? "Texto español" : "Texte français"}">${units.map((unit) => `<article class="unit" data-reading-unit="${escapeHtml(unit.id)}"><span class="number" aria-hidden="true">${unit.ordinal}</span><p class="french">${renderUnitFrench(unit, occurrences, learnerState)}</p></article>`).join("")}</main>
    ${sectionExpressions.length ? `<section class="expression-panel" aria-labelledby="expressions-title"><p class="eyebrow">Expressions dans cette section</p><h2 id="expressions-title">Expressions préparées</h2><div class="expression-list">${sectionExpressions.map((identity) => `<button class="secondary" type="button" data-expression-id="${escapeHtml(identity.id)}">${escapeHtml(identity.headword)} · ${escapeHtml(identity.gloss)}</button>`).join("")}</div></section>` : ""}
    <footer class="reading-checkpoint"><p>Section ${readerSectionIndex + 1} sur ${sectionCount}</p><div><button class="secondary" type="button" data-action="previous-section" ${readerSectionIndex === 0 ? "disabled" : ""}>← Précédente</button> <button class="primary" type="button" data-action="next-section" ${readerSectionIndex + 1 >= sectionCount ? "disabled" : ""}>Suivante →</button></div></footer></div>`;
}
