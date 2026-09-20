import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { reportEditorialBatchProgress } from "../src/content/preparation/zola-editorial-batches.js";

const root = new URL("../content/review/", import.meta.url);
const read = (name: string) => JSON.parse(readFileSync(new URL(`wrk_zola_jaccuse.${name}.json`, root), "utf8"));

describe("frozen J’Accuse editorial batches", () => {
  it("accounts for each originally pending identity exactly once across two 510-item batches", () => {
    const coverage = read("quiz-coverage");
    const manifests = [read("editorial-batch-1"), read("editorial-batch-2")];
    const progress = reportEditorialBatchProgress(manifests, coverage.entries, coverage.counts.requiringEditorialRevision);
    expect(progress).toHaveLength(2);
    expect(progress.map((batch) => batch.identityCount)).toEqual([510, 510]);
    expect(progress.reduce((sum, batch) => sum + batch.needsRevision, 0)).toBe(coverage.counts.requiringEditorialRevision);
    expect(() => reportEditorialBatchProgress([manifests[0], manifests[0]], coverage.entries, coverage.counts.requiringEditorialRevision)).toThrow();
  });
});
