import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { reportEditorialBatchProgress } from "../content/preparation/zola-editorial-batches.js";

const directory = resolve(import.meta.dirname, "../../content/review");
const file = (name: string) => resolve(directory, `wrk_zola_jaccuse.${name}.json`);
const read = (name: string) => JSON.parse(readFileSync(file(name), "utf8"));
const coverage = read("quiz-coverage");
const batches = reportEditorialBatchProgress(
  [read("editorial-batch-1"), read("editorial-batch-2")],
  coverage.entries,
  coverage.counts.requiringEditorialRevision,
);
const progress = { schemaVersion: 1, workId: coverage.workId, batches };
writeFileSync(file("editorial-progress"), `${JSON.stringify(progress, null, 2)}\n`, "utf8");
console.log(JSON.stringify(progress));
