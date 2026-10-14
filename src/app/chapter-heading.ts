import type { ContentBundle } from "../domain/model.js";
import { escapeHtml } from "./html.js";

export function chapterHeading(work: ContentBundle["works"][number], unitId: string): string {
  const chapter = work.chapters?.find(item => item.firstUnitId === unitId);
  return chapter ? `<h2 class="chapter-heading"><span>${escapeHtml(chapter.label)}</span> ${escapeHtml(chapter.title)}</h2>` : "";
}
