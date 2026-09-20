import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { loadPublication, validatePublication } from "../publication/repository.js";
import { createCompactPackages } from "../delivery/compact-packages.js";
import { assertEditorialRelease } from "../publication/quality-audit.js";

const root = resolve(import.meta.dirname, "../..");
const publication = loadPublication();
const { bundle, expressionCatalog, registry } = publication;
// Validate the complete release BEFORE touching any existing delivery file.
validatePublication(bundle, expressionCatalog, registry);
if (!process.argv.includes("--local-review")) assertEditorialRelease(publication);
else console.warn("LOCAL REVIEW BUILD ONLY: editorial approvals are incomplete. Not approved for publication.");
const packages = createCompactPackages(bundle, expressionCatalog, publication.preparedQuizzes);
const output = resolve(root, "public/content");
let changed = 0;
// Immutable payloads first, mutable entry indexes last. Retain previous hashed
// payloads for open tabs pinned to an older release. Never wipe the output tree.
const ordered = [...packages.files].sort(([a], [b]) => Number(a.startsWith("library/")) - Number(b.startsWith("library/")));
for (const [path, data] of ordered) {
  const destination = resolve(output, path);
  if (existsSync(destination) && readFileSync(destination, "utf8") === data) continue;
  mkdirSync(dirname(destination), { recursive: true });
  const temporary = destination + ".next";
  writeFileSync(temporary, data);
  renameSync(temporary, destination);
  changed += 1;
}
console.log(`Validated ${bundle.works.length} approved works; ${changed}/${packages.files.size} delivery files updated.`);
