import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { loadPublication } from "../dist/publication/repository.js";
import { reviewRevision } from "../dist/publication/editorial.js";
const root = new URL("../content/editorial/quiz-review/", import.meta.url);
if (existsSync(new URL("queue.json", root))) throw new Error("Review queue already exists; resume it instead");
const p = loadPublication();
const surfaces = new Map(p.bundle.surfaceForms.map(x => [x.id, x]));
const senses = new Map(p.bundle.senses.map(x => [x.id, x]));
const lemmas = new Map(p.bundle.lemmas.map(x => [x.id, x]));
const languages = new Map(p.registry.works.map(x => [x.id, x.language]));
const preferred = ["srf_renard", "srf_corbeau", "srf_fromage", "srf_arbre", "srf_maison"];
const bands = ["levels_1_3", "levels_4_5", "levels_6_8"];
const queue = [];
for (const language of ["fr", "es"]) {
  const keys = [...new Set(p.bundle.occurrences.filter(o => languages.get(o.workId) === language).map(o => `${o.surfaceFormId}:${o.senseId}`))];
  keys.sort((a,b) => {
    const score = key => { const sf = surfaces.get(key.split(":")[0]); const preferredIndex = preferred.indexOf(sf.id); return preferredIndex >= 0 ? preferredIndex : lemmas.get(sf.lemmaId).partOfSpeech === "noun" ? 10 : 20; };
    return score(a)-score(b);
  });
  for (const key of keys) queue.push({ language, identity: key, status: "pending" });
}
mkdirSync(root, { recursive: true });
writeFileSync(new URL("queue.json", root), JSON.stringify({ version: 1, order: ["fr", "es"], checkpointEvery: 100, note: "Pending means not yet reviewed against the current rules. Structural checks alone never count as editorial review. Preserve user-approved Spanish sets.", entries: queue }, null, 2)+"\n");
const selected = queue.filter(x => x.language === "fr").slice(0,100).map((row,index) => {
  const [surfaceFormId,senseId] = row.identity.split(":");
  const surface = surfaces.get(surfaceFormId), sense = senses.get(senseId), lemma = lemmas.get(surface.lemmaId);
  const quizzes = [...p.preparedQuizzes.values()].filter(q => q.subject.kind === "vocabulary" && q.subject.surfaceFormId === surfaceFormId && q.subject.senseId === senseId).sort((a,b)=>bands.indexOf(a.band)-bands.indexOf(b.band));
  const occurrences = p.bundle.occurrences.filter(o=>o.surfaceFormId===surfaceFormId&&o.senseId===senseId);
  const contexts = [...new Set(occurrences.map(o=>o.unitId))].map(id=>p.bundle.units.find(u=>u.id===id));
  const subject = {surface,sense,lemma,quizzes,occurrences,contexts};
  return { index:index+1, identity:row.identity, baseRevision:reviewRevision(subject), ...subject };
});
writeFileSync(new URL("fr-0001-0100-input.json",root),JSON.stringify({version:1,language:"fr",entries:selected},null,2)+"\n");
console.log(JSON.stringify({fr:queue.filter(x=>x.language==="fr").length,es:queue.filter(x=>x.language==="es").length,selected:selected.length}));
