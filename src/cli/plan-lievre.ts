import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lievreLexicalReviewPlan } from "../content/linguistic/le-lievre-et-la-tortue.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const path = resolve(root, "content/review/wrk_lievre_tortue.lexical-plan.json");
const content = `${JSON.stringify(lievreLexicalReviewPlan, null, 2)}\n`;
await mkdir(dirname(path), { recursive: true });
const previous = await readFile(path, "utf8").catch(() => undefined);
if (previous !== content) await writeFile(path, content, "utf8");
process.stdout.write(`${previous === content ? "unchanged" : "written"} ${path}\n`);
