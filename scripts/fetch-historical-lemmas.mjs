import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const directory = "/tmp/frs-kaikki-cache";
const lemmas = `acheter aîné aller appartenir appeler essai attendre auprès barrière beauté belle-mère causer chamarré citrouille civilité coiffer coiffeuse coiffure connaître considérer côté coucher croire danser demeurer derrière dire donner enfuir ennuyer entendre entièrement entrer épouser essoufflé être étonner avoir faire falloir fier frotter gentilhomme godronner gouverner grâce habiller hélas heurter honnêteté inconnu indifférent jeter jouer joie jupe laisser légèrement lézard lui malhonnête manière manquer marraine méchant menu mère mesdemoiselles même mettre moquer monter moi nettoyer nipper noces oser oui pardonner pantoufle père pleurer plutôt pouvoir pourvu premier prêter prier qualité quoi quérir ratière redevenir regarder rendre repasser reprendre ressembler révérence rire saison seoir sentir sortir souffrir souhaiter soupirer souris souricière talent temps tenir tôt traitement trésor trouver venir vêtir voir vite vouloir vrai madame rapporter former`.split(" ");

function urlFor(word, french) {
  const chars = [...word];
  const first = encodeURIComponent(chars[0]);
  const firstTwo = encodeURIComponent(chars.slice(0, 2).join(""));
  const root = french ? "https://kaikki.org/frwiktionary/Fran%C3%A7ais" : "https://kaikki.org/dictionary/French";
  return `${root}/meaning/${first}/${firstTwo}/${encodeURIComponent(word)}.jsonl`;
}

async function enrich(filename, french) {
  const payload = JSON.parse(await readFile(`${directory}/${filename}`, "utf8"));
  const pending = lemmas.filter((word) => !payload.entries[word]);
  let cursor = 0;
  await Promise.all(Array.from({ length: 30 }, async () => {
    while (cursor < pending.length) {
      const word = pending[cursor++];
      try {
        const response = await fetch(urlFor(word, french));
        if (!response.ok) continue;
        const entries = (await response.text()).trim().split("\n").filter(Boolean).map((line) => JSON.parse(line));
        if (entries.length) payload.entries[word] = entries;
      } catch { /* An absent aid is handled explicitly by the authoring fallback. */ }
    }
  }));
  payload.entries = Object.fromEntries(Object.entries(payload.entries).sort(([a], [b]) => a.localeCompare(b, "fr")));
  const serialized = `${JSON.stringify(payload)}\n`;
  await writeFile(`${directory}/${filename}`, serialized, "utf8");
  await writeFile(`${directory}/${filename.replace(".json", ".sha256")}`, `${createHash("sha256").update(serialized).digest("hex")}  ${filename}\n`, "utf8");
  return { requested: pending.length, resolved: pending.filter((word) => payload.entries[word]).length };
}

console.log(JSON.stringify({ english: await enrich("lexicon.json", false), french: await enrich("lexicon-fr.json", true) }));
