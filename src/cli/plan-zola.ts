import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { zolaSourceAcquisition } from "../content/fixtures/zola.js";
import { createLievreLinguisticBundle } from "../content/linguistic/le-lievre-et-la-tortue.js";
import { prepareIngestionManifest } from "../ingestion/prepare.js";
import { createLexicalPlan } from "../pipeline/lexical-plan.js";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "content/review/wrk_zola_jaccuse.lexical-plan.json");
const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");
const plan = createLexicalPlan(zolaSourceAcquisition, manifest, createLievreLinguisticBundle());
mkdirSync(resolve(root, "content/review"), { recursive: true });
writeFileSync(output, `${JSON.stringify({ schemaVersion: 1, workId: "wrk_zola_jaccuse", entries: plan }, null, 2)}\n`, "utf8");
console.log(`written ${plan.length} lexical forms`);
