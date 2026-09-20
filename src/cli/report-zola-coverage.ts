import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { assembleZolaDraft } from "../content/preparation/zola-bundle.js";
import { createWorkQuizCoverageReport } from "../content/preparation/zola-coverage.js";
import { zolaSourceAcquisition } from "../content/fixtures/zola.js";
import { createLievreLinguisticBundle } from "../content/linguistic/le-lievre-et-la-tortue.js";
import { prepareIngestionManifest } from "../ingestion/prepare.js";

const root = resolve(import.meta.dirname, "../..");
const workId = "wrk_zola_jaccuse";
const review = JSON.parse(readFileSync(resolve(root, "content/review/wrk_zola_jaccuse.exclusions.json"), "utf8"));
const manifest = prepareIngestionManifest(zolaSourceAcquisition, workId);
const bundle = assembleZolaDraft(manifest, review);
const report = createWorkQuizCoverageReport(workId, bundle, createLievreLinguisticBundle().quizItems, review.expressionCatalog.identities.length, review.counts.remainingCandidates);
writeFileSync(resolve(root, "content/review/wrk_zola_jaccuse.quiz-coverage.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report.counts));
