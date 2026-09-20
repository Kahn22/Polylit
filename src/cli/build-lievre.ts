import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lievreLinguisticBundle } from "../content/linguistic/le-lievre-et-la-tortue.js";
import { validateContentBundle } from "../domain/validate.js";

const validation = validateContentBundle(lievreLinguisticBundle);
if (!validation.ok) throw new Error(validation.diagnostics.map((item) => `${item.code}: ${item.message}`).join("\n"));

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const path = resolve(root, "content/learning/le-lievre-et-la-tortue.json");
const content = `${JSON.stringify(lievreLinguisticBundle, null, 2)}\n`;
await mkdir(dirname(path), { recursive: true });
const previous = await readFile(path, "utf8").catch(() => undefined);
if (previous !== content) await writeFile(path, content, "utf8");
process.stdout.write(`${previous === content ? "unchanged" : "written"} ${path}\n`);
