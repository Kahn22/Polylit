import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { prepareIngestionManifest } from "../dist/ingestion/prepare.js";
import { zolaSourceAcquisition } from "../dist/content/fixtures/zola.js";

const ranges = [
  [48, 18, Number.POSITIVE_INFINITY],
  [49, 0, Number.POSITIVE_INFINITY],
  [50, 0, Number.POSITIVE_INFINITY],
];

const candidates = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse").candidates;
const contextNouns = [
  ["rapport", "Nina consulte le rapport"],
  ["dossier", "Paul classe le dossier"],
  ["bureau", "Léa entre dans le bureau"],
  ["fenêtre", "Marc ouvre la fenêtre"],
  ["registre", "Nina vérifie le registre"],
  ["lettre", "Paul lit la lettre"],
  ["table", "Léa regarde la table"],
  ["porte", "Marc ferme la porte"],
  ["journal", "Nina ouvre le journal"],
  ["carte", "Paul examine la carte"],
];
const earlyTemplates = [
  (target, definition) => `Le professeur emploie « ${target} » pour exprimer cette idée : ${definition}.`,
  (target, definition) => `Dans cet exercice, « ${target} » prend un sens précis : ${definition}.`,
  (target, definition) => `Le contexte pédagogique montre que « ${target} » renvoie à ceci : ${definition}.`,
  (target, definition) => `Ici, « ${target} » sert à désigner ou exprimer ceci : ${definition}.`,
];
const intermediateTemplates = [
  (definition) => `Pour exprimer l’idée « ${definition} », le mot attendu est _____.`,
  (definition) => `Dans le glossaire, _____ correspond à cette définition : « ${definition} ».`,
  (definition) => `Complétez avec le mot qui signifie « ${definition} » : _____.`,
  (definition) => `Le terme précis pour exprimer « ${definition} » est _____.`,
];

const quote = (value) => JSON.stringify(value);
const tuple = (values) => `[${values.map(quote).join(", ")}]`;

function answerText(spec) {
  const requested = spec.candidateIds ? new Set(spec.candidateIds) : undefined;
  const match = candidates.find((candidate) => candidate.normalized === spec.normalized && (!requested || requested.has(candidate.id)));
  if (!match) throw new Error(`No source occurrence for ${spec.normalized}:${spec.senseKey}`);
  return match.text;
}

function block(spec, index) {
  const target = answerText(spec);
  const key = `${spec.normalized}:${spec.senseKey}`;
  const alternatives = contextNouns.filter(([word]) => word.toLocaleLowerCase("fr-FR") !== target.toLocaleLowerCase("fr-FR")).slice(index % 5, index % 5 + 3);
  if (alternatives.length < 3) alternatives.push(...contextNouns.filter(([word]) => !alternatives.some(([chosen]) => chosen === word) && word !== target).slice(0, 3 - alternatives.length));
  const advanced = `Dans cette situation, le mot « ${target} » exprime précisément ceci : ${spec.definition}. ${alternatives.map(([, clause]) => clause).join(", tandis que ")}.`;
  const prompt = `Quel mot du contexte signifie « ${spec.definition} » ?`;
  return [
    `  ${quote(key)}: {`,
    `    early: ${quote(earlyTemplates[index % earlyTemplates.length](target, spec.definition))}, englishChoices: ${tuple([spec.quizMeaning ?? spec.gloss, ...spec.englishDistractors])},`,
    `    intermediate: ${quote(intermediateTemplates[index % intermediateTemplates.length](spec.definition))}, frenchChoices: ${tuple([target, ...spec.frenchDistractors])},`,
    `    advanced: ${quote(advanced)}, prompt: ${quote(prompt)}, advancedChoices: ${tuple([target, ...alternatives.map(([word]) => word)])},`,
    "  },",
  ].join("\n");
}

let authored = 0;
for (const [batch, start, requestedEnd] of ranges) {
  const module = await import(`../dist/content/preparation/zola-vocabulary-batch-${String(batch).padStart(2, "0")}.js`);
  const specs = module[`zolaVocabularyBatch${batch}`];
  const end = Math.min(specs.length, requestedEnd);
  const selected = specs.slice(start, end);
  const generated = selected.map((spec, index) => block(spec, authored + index)).join("\n");
  const path = new URL(`../src/content/preparation/zola-editorial-batch-${String(batch).padStart(2, "0")}.ts`, import.meta.url);
  if (existsSync(path)) {
    const existing = readFileSync(path, "utf8");
    if (!existing.endsWith("};\n")) throw new Error(`Unexpected ending in ${path.pathname}`);
    writeFileSync(path, `${existing.slice(0, -3)}${generated}\n};\n`, "utf8");
  } else {
    writeFileSync(path, `import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";\n\nexport const zolaEditorialBatch${String(batch).padStart(2, "0")}: Record<string, EditorialQuizSet> = {\n${generated}\n};\n`, "utf8");
  }
  authored += selected.length;
}
if (authored !== 171) throw new Error(`Expected 171 source specifications, authored ${authored}`);
console.log(`Authored ${authored} editorial identities.`);
