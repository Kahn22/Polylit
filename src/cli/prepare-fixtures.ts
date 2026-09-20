import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { lafountainFixtures } from "../content/fixtures/la-fontaine.js";
import { laParureSourceAcquisition } from "../content/fixtures/maupassant.js";
import { cendrillonSourceAcquisition } from "../content/fixtures/perrault.js";
import { curatedLaFontaineSourceAcquisition } from "../content/fixtures/curated-la-fontaine.js";
import { prepareIngestionManifest, serializeManifest } from "../ingestion/prepare.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const outputDirectory = resolve(root, "content/review");
await mkdir(outputDirectory, { recursive: true });

const sourceBundles = [lafountainFixtures, curatedLaFontaineSourceAcquisition, laParureSourceAcquisition, cendrillonSourceAcquisition];

for (const bundle of sourceBundles) {
  for (const work of [...bundle.works].sort((a, b) => a.id.localeCompare(b.id))) {
    const path = resolve(outputDirectory, `${work.id}.manifest.json`);
    const content = serializeManifest(prepareIngestionManifest(bundle, work.id));
    const previous = await readFile(path, "utf8").catch(() => undefined);
    if (previous !== content) await writeFile(path, content, "utf8");
    process.stdout.write(`${previous === content ? "unchanged" : "written"} ${path}\n`);
  }
}
