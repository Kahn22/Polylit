import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { assembleZolaDraft } from "../content/preparation/zola-bundle.js";
import { zolaSourceAcquisition } from "../content/fixtures/zola.js";
import { createZolaPreparedExpressionCatalog } from "../content/preparation/zola-prepared-expressions.js";
import { auditZolaQuizEditorialReadiness } from "../content/preparation/zola-quality.js";
import { validateExpressionCatalog } from "../domain/expression-content.js";
import { validateContentBundle } from "../domain/validate.js";
import { prepareIngestionManifest } from "../ingestion/prepare.js";

const review = JSON.parse(readFileSync(resolve(import.meta.dirname, "../../content/review/wrk_zola_jaccuse.exclusions.json"), "utf8"));
const bundle = assembleZolaDraft(prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse"), review);
const validation = validateContentBundle(bundle);
const expressionDiagnostics = validateExpressionCatalog(bundle, createZolaPreparedExpressionCatalog());
const editorial = auditZolaQuizEditorialReadiness(zolaSourceAcquisition.units, review.authoredContent.quizItems);
const byCode = Object.fromEntries([...new Set(validation.diagnostics.map((item) => item.code))].sort().map((code) => [code, validation.diagnostics.filter((item) => item.code === code).length]));
console.log(JSON.stringify({ lexicalReviewComplete: review.counts.remainingCandidates === 0, editorial, validationDiagnostics: byCode, expressionDiagnostics: expressionDiagnostics.length }, null, 2));
if (editorial.editoriallyReady && validation.ok && !expressionDiagnostics.length) console.log("Draft is eligible for independent publication review");
