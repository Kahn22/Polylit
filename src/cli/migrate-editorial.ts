/** Lossless structural migration. No editorial approvals, lexical merges, or publication. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadPublication, publicationRoot, validatePublication } from "../publication/repository.js";
import { adoptSourceFiles, sharedSourceFiles, readWorkSource, workSourceV2 } from "../publication/source-store.js";
import { missingReviews } from "../publication/quality-audit.js";
import { stableJson } from "../publication/revisions.js";

const current = loadPublication();
validatePublication(current.bundle, current.expressionCatalog, current.registry);
if (["fr", "es"].every(language => JSON.parse(readFileSync(resolve(publicationRoot, `shared/${language}.json`), "utf8")).version === 2)) throw new Error("Editorial migration already applied; refusing to replace authored records");
const pending = missingReviews(current);
const files = new Map<string, unknown>();
for (const language of ["fr", "es"] as const) {
  const source = current.sharedSources[language];
  for (const [path, data] of sharedSourceFiles({ ...source, reviews: [...source.reviews, ...pending.filter(review => review.language === language)] })) files.set(path, data);
}
for (const work of current.registry.works.filter(work => work.status === "approved")) files.set(`works/${work.id}.json`, workSourceV2(readWorkSource(resolve(publicationRoot, `works/${work.id}.json`)).legacy));
const sorted = (values: unknown[]) => [...values].sort((a, b) => {
  const left = a as { id?: string; workId?: string }, right = b as typeof left;
  return (left.id ?? left.workId ?? "").localeCompare(right.id ?? right.workId ?? "", "en");
});
const backup = adoptSourceFiles(publicationRoot, files, root => {
  const next = loadPublication(root);
  validatePublication(next.bundle, next.expressionCatalog, next.registry);
  for (const key of Object.keys(current.bundle) as (keyof typeof current.bundle)[]) if (stableJson(sorted(next.bundle[key])) !== stableJson(sorted(current.bundle[key]))) throw new Error(`Migration changed ${key}`);
  for (const key of Object.keys(current.expressionCatalog) as (keyof typeof current.expressionCatalog)[]) if (stableJson(sorted(next.expressionCatalog[key])) !== stableJson(sorted(current.expressionCatalog[key]))) throw new Error(`Migration changed expression ${key}`);
});
console.log(`Migrated ${current.bundle.works.length} texts and ${current.preparedQuizzes.size} questions without changing wording or mastery IDs. ${pending.length} exact-version reviews explicitly pending. Recoverable source checkpoint: ${backup}`);
