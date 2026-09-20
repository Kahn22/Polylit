import type { ContentBundle } from "../domain/model.js";
export interface ViewMetadata { work: ContentBundle["works"][number]; book: ContentBundle["books"][number]; collection: ContentBundle["collections"][number]; author: ContentBundle["authors"][number] }
