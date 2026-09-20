import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { assembleZolaDraft } from "../content/preparation/zola-bundle.js";
import { zolaSourceAcquisition } from "../content/fixtures/zola.js";
import { createZolaPreparedExpressionCatalog } from "../content/preparation/zola-prepared-expressions.js";
import { prepareIngestionManifest, serializeManifest } from "../ingestion/prepare.js";
import { runAutonomousPublicationPipeline } from "../pipeline/run.js";
import { importApprovedWork } from "../publication/update-work.js";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "content/pipeline/wrk_zola_jaccuse");
const review = JSON.parse(readFileSync(resolve(root, "content/review/wrk_zola_jaccuse.exclusions.json"), "utf8"));
const draft = assembleZolaDraft(prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse"), review);
const expressionCatalog = createZolaPreparedExpressionCatalog();
const result = await runAutonomousPublicationPipeline(zolaSourceAcquisition, {
  workId: "wrk_zola_jaccuse",
  publicDomainEvidence: { publicationYear: 1898, basis: "us_publication_before_1931" },
  preparedContent: {
    bundle: draft,
    expressionCatalog,
    authoring: { method: "codex_offline_review", canonicalWordingPreserved: true, distractorsCheckedForAmbiguity: true },
  },
});
if (result.report.outcome !== "published" || !result.expressionCatalog) throw new Error("J’Accuse publication checks did not complete");
const backup = importApprovedWork(result.bundle, result.expressionCatalog, "wrk_zola_jaccuse");
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, "lexical-manifest.json"), serializeManifest(result.manifest), "utf8");
writeFileSync(resolve(output, "pipeline-report.json"), JSON.stringify(result.report, null, 2) + "\n", "utf8");
console.log("J’Accuse updated without replacing other works. Previous source retained at " + backup);
