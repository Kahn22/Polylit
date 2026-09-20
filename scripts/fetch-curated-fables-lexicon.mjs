import { loadPublication } from "../dist/publication/repository.js";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const directory = "/tmp/frs-kaikki-cache";
const base = loadPublication().bundle;
const manifests = await Promise.all(["cigale_fourmi", "loup_agneau", "lion_rat"].map(async (key) => JSON.parse(await readFile(new URL(`../content/review/wrk_${key}.manifest.json`, import.meta.url), "utf8"))));
const known = new Set(base.surfaceForms.map((item) => item.normalized));
const requested = [...new Set(manifests.flatMap((manifest) => manifest.candidates.map((item) => item.normalized)).filter((word) => !known.has(word)))];

function urlFor(word, french) {
  const chars = [...word];
  const first = encodeURIComponent(chars[0]);
  const firstTwo = encodeURIComponent(chars.slice(0, 2).join(""));
  const root = french ? "https://kaikki.org/frwiktionary/Fran%C3%A7ais" : "https://kaikki.org/dictionary/French";
  return `${root}/meaning/${first}/${firstTwo}/${encodeURIComponent(word)}.jsonl`;
}
async function fetchEntries(words, french) {
  const found = {};
  let cursor = 0;
  await Promise.all(Array.from({ length: 30 }, async () => {
    while (cursor < words.length) {
      const word = words[cursor++];
      try {
        const response = await fetch(urlFor(word, french));
        if (!response.ok) continue;
        const entries = (await response.text()).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
        if (entries.length) found[word] = entries;
      } catch { /* Missing entries are reported and must be covered editorially. */ }
    }
  }));
  return found;
}
function formLemmas(entries) {
  return [...new Set(Object.values(entries).flat().flatMap((entry) => entry.senses ?? []).flatMap((sense) => sense.form_of ?? []).map((item) => item.word).filter(Boolean))];
}
async function enrich(filename, french) {
  const payload = JSON.parse(await readFile(`${directory}/${filename}`, "utf8"));
  const surfacePending = requested.filter((word) => !payload.entries[word]);
  Object.assign(payload.entries, await fetchEntries(surfacePending, french));
  const lemmaPending = formLemmas(Object.fromEntries(requested.filter((word) => payload.entries[word]).map((word) => [word, payload.entries[word]]))).filter((word) => !payload.entries[word]);
  Object.assign(payload.entries, await fetchEntries(lemmaPending, french));
  payload.entries = Object.fromEntries(Object.entries(payload.entries).sort(([a], [b]) => a.localeCompare(b, "fr")));
  const serialized = `${JSON.stringify(payload)}\n`;
  await writeFile(`${directory}/${filename}`, serialized, "utf8");
  await writeFile(`${directory}/${filename.replace(".json", ".sha256")}`, `${createHash("sha256").update(serialized).digest("hex")}  ${filename}\n`, "utf8");
  return { requested: surfacePending.length, resolved: surfacePending.filter((word) => payload.entries[word]).length, lemmas: lemmaPending.length };
}
console.log(JSON.stringify({ distinctNewForms: requested.length, english: await enrich("lexicon.json", false), french: await enrich("lexicon-fr.json", true) }));
