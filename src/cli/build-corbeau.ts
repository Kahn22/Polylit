import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { corbeauLearningBundle } from "../content/linguistic/le-corbeau-et-le-renard.js";
import { validateContentBundle } from "../domain/validate.js";

const validation = validateContentBundle(corbeauLearningBundle);
if (!validation.ok) throw new Error(JSON.stringify(validation.diagnostics, null, 2));
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const path = resolve(root, "content/learning/le-corbeau-et-le-renard.json");
const content = `${JSON.stringify(corbeauLearningBundle, null, 2)}\n`;
await mkdir(dirname(path), { recursive: true });
const previous = await readFile(path, "utf8").catch(() => undefined);
if (previous !== content) await writeFile(path, content, "utf8");
process.stdout.write(`${previous === content ? "unchanged" : "written"} ${path}\n`);
