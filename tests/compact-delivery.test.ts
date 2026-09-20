import { beforeAll, describe, expect, it } from "vitest";
import { gzipSync } from "node:zlib";
import { appBundle, appExpressionCatalog, appPreparedQuizzes } from "../src/app/content.js";
import { createCompactPackages } from "../src/delivery/compact-packages.js";
import { identityToken, quizShard } from "../src/delivery/identity-token.js";
import type { BookPage, QuizPackage, ReadingSection, WorkManifest } from "../src/delivery/types.js";
let packages: ReturnType<typeof createCompactPackages>;
beforeAll(() => { packages = createCompactPackages(appBundle, appExpressionCatalog, appPreparedQuizzes); });
const payload = <T>(path: string) => JSON.parse(packages.files.get(path)!) as T;

describe("compact language-specific delivery", () => {
  it("keeps French library data under its compressed size budget without changing membership", () => {
    expect(gzipSync(packages.files.get("library/fr.json")!).length).toBeLessThan(36_000);
    for (const index of Object.values(packages.libraryIndexes)) for (const [workId, work] of Object.entries(index.works)) {
      const expected = new Set(appBundle.occurrences.filter(item => item.workId === workId).map(item => identityToken(`${item.surfaceFormId}:${item.senseId}`)));
      expect(new Set(work.vocabularyTokens)).toEqual(expected);
    }
  });
  it("keeps the exact canonical text in both views and omits learning records from Book View", () => {
    for (const index of Object.values(packages.libraryIndexes)) for (const [workId, work] of Object.entries(index.works)) {
      const manifest = payload<WorkManifest>(work.manifest);
      const sections = manifest.sections.map(path => payload<ReadingSection>(path));
      const books = manifest.bookPages.map(path => payload<BookPage>(path));
      const original = appBundle.units.filter(unit => unit.workId === workId).sort((a, b) => a.ordinal - b.ordinal);
      expect(sections.flatMap(section => section.units.map(unit => unit.text))).toEqual(original.map(unit => unit.french));
      expect(books.flatMap(book => book.units.map(unit => unit.text))).toEqual(original.map(unit => unit.french));
      for (const book of books) expect(Object.keys(book)).toEqual(["version", "language", "workId", "index", "units"]);
      for (const section of sections) expect(section.expressionCatalog).not.toHaveProperty("preparedQuizzes");
    }
    const manifest = payload<WorkManifest>(packages.libraryIndexes.fr.works.wrk_maupassant_la_parure!.manifest);
    expect(gzipSync(packages.files.get(manifest.bookPages[0]!)!).length).toBeLessThan(4_000);
  });
  it("never mixes languages in a quiz package and retains all three bands and permanent keys", () => {
    const seen = new Set<string>();
    for (const [path, text] of packages.files) if (path.startsWith("quizzes/")) {
      const batch = JSON.parse(text) as QuizPackage;
      expect(path.startsWith(`quizzes/${batch.language}/`)).toBe(true);
      const membership = new Set(Object.values(packages.libraryIndexes[batch.language].works).flatMap(work => [...work.vocabularyTokens, ...work.expressionIdentityKeys.map(id => identityToken(`expression:${id}`))]));
      for (const record of batch.records) {
        expect(membership.has(identityToken(record.identity))).toBe(true);
        expect(record.items).toHaveLength(3);
        expect(new Set(record.items.map(item => item.band)).size).toBe(3);
        expect(seen.has(record.identity)).toBe(false);
        seen.add(record.identity);
      }
    }
    const current = new Set(appBundle.occurrences.map(item => `${item.surfaceFormId}:${item.senseId}`));
    for (const item of appExpressionCatalog.occurrences) current.add(`expression:${item.identityId}`);
    expect(seen).toEqual(current); // Historical, unreferenced questions stay source-only.
  });
  it("uses deterministic content-addressed paths and stable quiz grouping", () => {
    const next = createCompactPackages(appBundle, appExpressionCatalog, appPreparedQuizzes);
    expect(next).toEqual(packages);
    for (const path of packages.files.keys()) if (!path.startsWith("library/")) expect(path).toMatch(/\/(fr|es)\/[a-f0-9]{20}\.json$/);
    expect(quizShard("srf_a:sns_a")).toBe(quizShard("srf_a:sns_a"));
    expect(packages.files.has("manifest.json")).toBe(false);
    expect([...packages.files.keys()].some(path => path.startsWith("learning/"))).toBe(false);
  });
});
