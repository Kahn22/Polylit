import { loadPublication } from "../dist/publication/repository.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const existing = loadPublication().bundle;
const parureBatch = JSON.parse(await readFile(new URL("content/review/wrk_maupassant_la_parure.batch-01.json", root), "utf8"));
const parureManifest = JSON.parse(await readFile(new URL("content/review/wrk_maupassant_la_parure.manifest.json", root), "utf8"));
const cendrillonManifest = JSON.parse(await readFile(new URL("content/review/wrk_perrault_cendrillon.manifest.json", root), "utf8"));
const known = new Set([...existing.surfaceForms, ...parureBatch.surfaceForms].map((item) => item.normalized));
const historicalLemmas = `acheter aîné aller appartenir appeler essai attendre auprès barrière beauté belle-mère causer chamarré citrouille civilité coiffer coiffeuse coiffure connaître considérer côté coucher croire danser demeurer derrière dire donner enfuir ennuyer entendre entièrement entrer épouser essoufflé être étonner avoir faire falloir fier frotter gentilhomme godronner gouverner grâce habiller hélas heurter honnêteté inconnu indifférent jeter jouer joie jupe laisser légèrement lézard lui malhonnête manière manquer marraine méchant menu mère mesdemoiselles même mettre moquer monter moi nettoyer nipper noces oser oui pardonner pantoufle père pleurer plutôt pouvoir pourvu premier prêter prier qualité quoi quérir ratière redevenir regarder rendre repasser reprendre ressembler révérence rire saison seoir sentir sortir souffrir souhaiter soupirer souris souricière talent temps tenir tôt traitement trésor trouver venir vêtir voir vite vouloir vrai madame rapporter former`.split(" ");
const requested = [...new Set([
  ...parureManifest.candidates.slice(500).map((item) => item.normalized),
  ...cendrillonManifest.candidates.map((item) => item.normalized),
  ...historicalLemmas,
].filter((word) => !known.has(word)))].sort((a, b) => a.localeCompare(b, "fr"));

const outputDirectory = "/tmp/frs-kaikki-cache";
await mkdir(outputDirectory, { recursive: true });
const records = new Map();
const missing = new Set();

function urlFor(word) {
  const chars = [...word];
  const first = encodeURIComponent(chars[0] ?? "_");
  const firstTwo = encodeURIComponent(chars.slice(0, 2).join("") || "_");
  return `https://kaikki.org/dictionary/French/meaning/${first}/${firstTwo}/${encodeURIComponent(word)}.jsonl`;
}

function frenchUrlFor(word) {
  const chars = [...word];
  const first = encodeURIComponent(chars[0] ?? "_");
  const firstTwo = encodeURIComponent(chars.slice(0, 2).join("") || "_");
  return `https://kaikki.org/frwiktionary/Fran%C3%A7ais/meaning/${first}/${firstTwo}/${encodeURIComponent(word)}.jsonl`;
}

async function fetchWords(words, label) {
  let cursor = 0;
  const workers = Array.from({ length: 30 }, async () => {
    while (cursor < words.length) {
      const index = cursor++;
      const word = words[index];
      try {
        const response = await fetch(urlFor(word));
        if (!response.ok) { missing.add(word); continue; }
        const text = await response.text();
        const entries = text.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
        if (entries.length) records.set(word, entries); else missing.add(word);
      } catch {
        missing.add(word);
      }
      if ((index + 1) % 100 === 0) process.stdout.write(`${label} ${index + 1}/${words.length}\n`);
    }
  });
  await Promise.all(workers);
}

async function fetchFrenchWords(words, label, frenchRecords, frenchMissing) {
  let cursor = 0;
  const workers = Array.from({ length: 30 }, async () => {
    while (cursor < words.length) {
      const index = cursor++;
      const word = words[index];
      try {
        const response = await fetch(frenchUrlFor(word));
        if (!response.ok) { frenchMissing.add(word); continue; }
        const body = await response.text();
        const entries = body.trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
        if (entries.length) frenchRecords.set(word, entries); else frenchMissing.add(word);
      } catch {
        frenchMissing.add(word);
      }
      if ((index + 1) % 100 === 0) process.stdout.write(`${label} ${index + 1}/${words.length}\n`);
    }
  });
  await Promise.all(workers);
}

await fetchWords(requested, "surface");
const lemmas = [...new Set([...records.values()].flatMap((entries) => entries.flatMap((entry) => entry.senses ?? []).flatMap((sense) => sense.form_of ?? []).map((form) => form.word)).filter((word) => word && !records.has(word)))];
await fetchWords(lemmas, "lemma");

const payload = {
  source: "Kaikki.org machine-readable French dictionary derived from English Wiktionary",
  sourceSnapshot: "2026-09-09",
  requestedSurfaceForms: requested.length,
  resolvedSurfaceForms: requested.filter((word) => records.has(word)).length,
  fetchedLemmaForms: lemmas.filter((word) => records.has(word)).length,
  missing: [...missing].filter((word) => requested.includes(word)).sort((a, b) => a.localeCompare(b, "fr")),
  entries: Object.fromEntries([...records].sort(([a], [b]) => a.localeCompare(b, "fr"))),
};
const serialized = `${JSON.stringify(payload)}\n`;
await writeFile(`${outputDirectory}/lexicon.json`, serialized, "utf8");
await writeFile(`${outputDirectory}/lexicon.sha256`, `${createHash("sha256").update(serialized).digest("hex")}  lexicon.json\n`, "utf8");

const frenchRecords = new Map();
const frenchMissing = new Set();
await fetchFrenchWords(requested, "surface-fr", frenchRecords, frenchMissing);
const frenchLemmas = [...new Set([...frenchRecords.values()].flatMap((entries) => entries.flatMap((entry) => entry.senses ?? []).flatMap((sense) => sense.form_of ?? []).map((form) => form.word)).filter((word) => word && !frenchRecords.has(word)))];
await fetchFrenchWords(frenchLemmas, "lemma-fr", frenchRecords, frenchMissing);
const frenchPayload = {
  source: "Kaikki.org machine-readable French dictionary derived from French Wiktionary",
  sourceSnapshot: "2026-09-09",
  requestedSurfaceForms: requested.length,
  resolvedSurfaceForms: requested.filter((word) => frenchRecords.has(word)).length,
  fetchedLemmaForms: frenchLemmas.filter((word) => frenchRecords.has(word)).length,
  missing: [...frenchMissing].filter((word) => requested.includes(word)).sort((a, b) => a.localeCompare(b, "fr")),
  entries: Object.fromEntries([...frenchRecords].sort(([a], [b]) => a.localeCompare(b, "fr"))),
};
const frenchSerialized = `${JSON.stringify(frenchPayload)}\n`;
await writeFile(`${outputDirectory}/lexicon-fr.json`, frenchSerialized, "utf8");
await writeFile(`${outputDirectory}/lexicon-fr.sha256`, `${createHash("sha256").update(frenchSerialized).digest("hex")}  lexicon-fr.json\n`, "utf8");
console.log(JSON.stringify({ requested: requested.length, english: { resolved: payload.resolvedSurfaceForms, lemmas: payload.fetchedLemmaForms, missing: payload.missing.length }, french: { resolved: frenchPayload.resolvedSurfaceForms, lemmas: frenchPayload.fetchedLemmaForms, missing: frenchPayload.missing.length }, outputDirectory }));
