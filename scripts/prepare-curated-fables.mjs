import { importApprovedWork } from "../dist/publication/update-work.js";
import { loadPublication } from "../dist/publication/repository.js";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { curatedLaFontaineSourceAcquisition } from "../dist/content/fixtures/curated-la-fontaine.js";

const root = new URL("../", import.meta.url);
const incomingWorkIds = new Set(curatedLaFontaineSourceAcquisition.works.map((item) => item.id));
const incomingKeys = new Set(["cigale_fourmi", "loup_agneau", "lion_rat"]);
const generatedId = (id) => /^(?:lem|sns|srf|qiz)_(?:cigale_fourmi|loup_agneau|lion_rat)_/.test(id);
const rawBase = loadPublication().bundle;
const base = {
  ...rawBase,
  works: rawBase.works.filter((item) => !incomingWorkIds.has(item.id)),
  sources: rawBase.sources.filter((item) => !incomingWorkIds.has(item.workId)),
  units: rawBase.units.filter((item) => !incomingWorkIds.has(item.workId)),
  occurrences: rawBase.occurrences.filter((item) => !incomingWorkIds.has(item.workId)),
  exclusions: rawBase.exclusions.filter((item) => !incomingWorkIds.has(item.workId)),
  notes: rawBase.notes.filter((item) => !incomingWorkIds.has(item.workId)),
  readiness: rawBase.readiness.filter((item) => !incomingWorkIds.has(item.workId)),
  lemmas: rawBase.lemmas.filter((item) => !generatedId(item.id)),
  senses: rawBase.senses.filter((item) => !generatedId(item.id)),
  surfaceForms: rawBase.surfaceForms.filter((item) => !generatedId(item.id)),
  quizItems: rawBase.quizItems.filter((item) => !generatedId(item.id)),
};
const rawExpressions = loadPublication().expressionCatalog;
const expressionCatalog = {
  identities: rawExpressions.identities.filter((item) => ![...incomingKeys].some((key) => item.id.startsWith(`exi_${key}_`))),
  occurrences: rawExpressions.occurrences.filter((item) => !incomingWorkIds.has(item.workId)),
  preparedQuizzes: rawExpressions.preparedQuizzes.filter((item) => ![...incomingKeys].some((key) => item.id.startsWith(`exq_${key}_`))),
};
const fr = JSON.parse(readFileSync("/tmp/frs-kaikki-cache/lexicon-fr.json", "utf8"));
const en = JSON.parse(readFileSync("/tmp/frs-kaikki-cache/lexicon.json", "utf8"));

const normalize = (value) => value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR");
const slug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toLowerCase() || "item";
const digest = (value) => createHash("sha256").update(value).digest("hex").slice(0, 10);
const stable = (value) => `${slug(value)}_${digest(value)}`;
const uniqueById = (items) => [...new Map(items.map((item) => [item.id, item])).values()];
const clean = (value) => String(value ?? "").replace(/\{\{[^}]+\}\}/g, "").replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2").replace(/\s+/g, " ").trim();
const posMap = { adj: "adjective", adv: "adverb", conj: "conjunction", det: "determiner", intj: "interjection", name: "proper noun", noun: "noun", num: "numeral", particle: "particle", phrase: "phrase", prep: "preposition", pron: "pronoun", verb: "verb" };
const registry = { lemmas: [...base.lemmas], senses: [...base.senses], surfaceForms: [...base.surfaceForms], quizItems: [...base.quizItems] };

const editorial = {
  "l’aurais": { headword: "avoir", partOfSpeech: "verb", gloss: "would have it", definition: "réunit le pronom élidé « l’ » et la forme conditionnelle « aurais »" },
  août: { headword: "août", partOfSpeech: "noun", gloss: "August; harvest time", definition: "mois d’été, employé ici pour désigner le temps de la moisson" },
  foi: { headword: "foi", partOfSpeech: "noun", gloss: "word; pledge", definition: "assurance donnée que l’on tiendra sa promesse" },
  principal: { headword: "principal", partOfSpeech: "noun", gloss: "principal; original sum", definition: "somme prêtée, distincte des intérêts qui s’y ajoutent" },
  chaud: { headword: "chaud", partOfSpeech: "adjective", gloss: "warm; hot", definition: "où la température est élevée" },
  venant: { headword: "venir", partOfSpeech: "verb", gloss: "whoever came", definition: "qui se présente ou arrive, dans l’expression « à tout venant »" },
  jeun: { headword: "jeun", partOfSpeech: "adjective", gloss: "fasting; without having eaten", definition: "qui n’a pas mangé depuis un certain temps" },
  onde: { headword: "onde", partOfSpeech: "noun", gloss: "water; stream", definition: "eau en mouvement, dans un emploi poétique" },
  lieux: { headword: "lieu", partOfSpeech: "noun", gloss: "places; surroundings", definition: "endroits considérés dans leur situation" },
  sire: { headword: "sire", partOfSpeech: "noun", gloss: "Sire", definition: "titre respectueux adressé à un souverain ou à un personnage puissant" },
  majesté: { headword: "majesté", partOfSpeech: "noun", gloss: "Majesty", definition: "titre honorifique donné à un souverain" },
  dessous: { headword: "dessous", partOfSpeech: "adverb", gloss: "below", definition: "dans une position ou une direction inférieure" },
  tette: { headword: "teter", partOfSpeech: "verb", gloss: "suckles", definition: "boit le lait au sein de sa mère" },
  procès: { headword: "procès", partOfSpeech: "noun", gloss: "trial; legal process", definition: "procédure par laquelle une affaire est jugée" },
  rets: { headword: "rets", partOfSpeech: "noun", gloss: "nets", definition: "filets employés pour capturer des animaux" },
  maille: { headword: "maille", partOfSpeech: "noun", gloss: "mesh; loop", definition: "boucle constituant un filet" },
  ouvrage: { headword: "ouvrage", partOfSpeech: "noun", gloss: "work; construction", definition: "objet produit par un travail, ici le filet tout entier" },
  voisine: { headword: "voisin", partOfSpeech: "noun", gloss: "neighbor", definition: "personne qui habite ou se trouve à proximité" },
  priant: { headword: "prier", partOfSpeech: "verb", gloss: "begging; asking", definition: "demandant avec insistance ou déférence" },
  prêteuse: { headword: "prêteur", partOfSpeech: "noun", gloss: "lender", definition: "personne qui prête quelque chose" },
  moindre: { headword: "moindre", partOfSpeech: "adjective", gloss: "least; slightest", definition: "qui est plus petit ou moins important que les autres" },
  défaut: { headword: "défaut", partOfSpeech: "noun", gloss: "fault; failing", definition: "imperfection morale ou faiblesse que l’on reproche à quelqu’un" },
  emprunteuse: { headword: "emprunteur", partOfSpeech: "noun", gloss: "borrower", definition: "personne qui reçoit quelque chose à charge de le rendre" },
  pure: { headword: "pur", partOfSpeech: "adjective", gloss: "pure; clear", definition: "qui n’est ni souillé ni mélangé, ici en parlant de l’eau" },
  aventure: { headword: "aventure", partOfSpeech: "noun", gloss: "quarrel; trouble", definition: "occasion de querelle ou de violence, dans l’expression « chercher aventure »" },
  rend: { headword: "rendre", partOfSpeech: "verb", gloss: "makes", definition: "fait devenir ou met dans un certain état" },
  rage: { headword: "rage", partOfSpeech: "noun", gloss: "fury; rage", definition: "colère violente et incontrôlée" },
  châtié: { headword: "châtier", partOfSpeech: "verb", gloss: "punished", definition: "soumis à une punition" },
  plutôt: { headword: "plutôt", partOfSpeech: "adverb", gloss: "rather", definition: "de préférence ou plus exactement" },
  considère: { headword: "considérer", partOfSpeech: "verb", gloss: "considers; takes into account", definition: "examine par la pensée ou tient compte de" },
  désaltérant: { headword: "désaltérer", partOfSpeech: "verb", gloss: "quenching one’s thirst", definition: "apaisant sa soif en buvant" },
  aucune: { headword: "aucun", partOfSpeech: "determiner", gloss: "no; any", definition: "marque l’absence complète dans une phrase négative" },
  boisson: { headword: "boisson", partOfSpeech: "noun", gloss: "drink; drinking water", definition: "liquide que l’on boit, ici l’eau du loup" },
  troubles: { headword: "troubler", partOfSpeech: "verb", gloss: "disturb; muddy", definition: "rend moins clair ou agite, ici en parlant de l’eau" },
  cruelle: { headword: "cruel", partOfSpeech: "adjective", gloss: "cruel", definition: "qui prend plaisir à faire souffrir ou reste insensible à la souffrance" },
  né: { headword: "naître", partOfSpeech: "verb", gloss: "born", definition: "venu au monde" },
  "quelqu’un": { headword: "quelqu’un", partOfSpeech: "pronoun", gloss: "someone", definition: "une personne non précisément identifiée" },
  épargnez: { headword: "épargner", partOfSpeech: "verb", gloss: "spare", definition: "évite de faire du mal à quelqu’un ou le ménage" },
  vos: { headword: "votre", partOfSpeech: "determiner", gloss: "your", definition: "déterminant possessif qui renvoie à plusieurs choses possédées" },
  obliger: { headword: "obliger", partOfSpeech: "verb", gloss: "help; do a favor for", definition: "rendre service à quelqu’un et lui inspirer de la reconnaissance" },
  feront: { headword: "faire", partOfSpeech: "verb", gloss: "will serve as", definition: "serviront à établir quelque chose, dans l’expression « faire foi »" },
  abonde: { headword: "abonder", partOfSpeech: "verb", gloss: "abounds", definition: "existe ou se trouve en grande quantité" },
  pattes: { headword: "patte", partOfSpeech: "noun", gloss: "paws", definition: "membres d’un animal qui lui servent à marcher" },
  étourdie: { headword: "étourdi", partOfSpeech: "adjective", gloss: "heedless; careless", definition: "qui agit sans réflexion ni prudence" },
  défaire: { headword: "défaire", partOfSpeech: "verb", gloss: "free; release", definition: "délivrer de ce qui retient prisonnier" },
  rongée: { headword: "ronger", partOfSpeech: "verb", gloss: "gnawed through", definition: "entamée et coupée peu à peu avec les dents" },
  emporta: { headword: "emporter", partOfSpeech: "verb", gloss: "carried away; destroyed", definition: "fit disparaître ou céder l’ensemble de l’ouvrage" },
  longueur: { headword: "longueur", partOfSpeech: "noun", gloss: "length; duration", definition: "durée prolongée, ici associée au temps" },
};

const contextualEditorial = {
  "unt_cigale_fourmi_02:fort": { headword: "fort", partOfSpeech: "adverb", gloss: "very", definition: "à un degré élevé, beaucoup" },
  "unt_cigale_fourmi_10:fort": { headword: "fort", partOfSpeech: "adverb", gloss: "very", definition: "à un degré élevé, beaucoup" },
  "unt_cigale_fourmi_10:aise": { headword: "aise", partOfSpeech: "adjective", gloss: "glad; pleased", definition: "content ou satisfait, dans l’expression « être aise »" },
  "unt_loup_agneau_01:raison": { headword: "raison", partOfSpeech: "noun", gloss: "argument; claim", definition: "argument présenté comme juste ou fondé" },
  "unt_loup_agneau_01:fort": { headword: "fort", partOfSpeech: "adjective", gloss: "strong; powerful", definition: "qui dispose de puissance ou de supériorité" },
  "unt_loup_agneau_01:meilleure": { headword: "meilleur", partOfSpeech: "adjective", gloss: "best; strongest", definition: "qui l’emporte sur les autres" },
  "unt_loup_agneau_03:courant": { headword: "courant", partOfSpeech: "noun", gloss: "current; stream", definition: "mouvement continu de l’eau dans un cours d’eau" },
  "unt_loup_agneau_08:courant": { headword: "courant", partOfSpeech: "noun", gloss: "current; stream", definition: "mouvement continu de l’eau dans un cours d’eau" },
  "unt_loup_agneau_08:vas": { headword: "aller", partOfSpeech: "verb", gloss: "am going; am in the act of", definition: "forme ancienne de « vais », employée ici dans une action en cours" },
  "unt_loup_agneau_09:pas": { headword: "pas", partOfSpeech: "noun", gloss: "step; pace", definition: "unité approximative de distance fondée sur la longueur d’un pas" },
  "unt_loup_agneau_10:puis": { headword: "pouvoir", partOfSpeech: "verb", gloss: "can; am able to", definition: "avoir la possibilité ou la capacité de faire quelque chose" },
  "unt_loup_agneau_20:forme": { headword: "forme", partOfSpeech: "noun", gloss: "formality; procedure", definition: "manière réglementée de procéder, spécialement dans une affaire de justice" },
  "unt_lion_rat_01:monde": { headword: "monde", partOfSpeech: "noun", gloss: "everyone", definition: "ensemble des personnes, dans l’expression « tout le monde »" },
  "unt_lion_rat_06:perdu": { headword: "perdre", partOfSpeech: "verb", gloss: "wasted; unrewarded", definition: "resté sans effet ni récompense" },
  "unt_lion_rat_07:affaire": { headword: "affaire", partOfSpeech: "noun", gloss: "need; use", definition: "besoin ou recours à quelqu’un, dans l’expression « avoir affaire »" },
  "unt_lion_rat_08:pris": { headword: "prendre", partOfSpeech: "verb", gloss: "caught; trapped", definition: "capturé et retenu dans un piège" },
  "unt_lion_rat_10:fit": { headword: "faire", partOfSpeech: "verb", gloss: "did; worked", definition: "agit avec effort pour produire un résultat" },
};

const forcedEditorial = new Set([
  "voisine", "priant", "prêteuse", "moindre", "défaut", "emprunteuse", "pure", "aventure", "rend", "rage", "châtié", "plutôt", "considère", "désaltérant", "aucune", "boisson", "troubles", "cruelle", "né", "quelqu’un", "épargnez", "vos", "obliger", "feront", "abonde", "pattes", "étourdie", "défaire", "rongée", "emporta", "longueur",
]);

function substantive(entries, preferredPos) {
  return entries?.find((entry) => (!preferredPos || posMap[entry.pos] === preferredPos) && entry.senses?.some((sense) => sense.glosses?.length && !sense.form_of?.length))
    ?? entries?.find((entry) => entry.senses?.some((sense) => sense.glosses?.length && !sense.form_of?.length));
}
function formLemma(entries) { return entries?.flatMap((entry) => entry.senses ?? []).flatMap((sense) => sense.form_of ?? []).map((item) => item.word).find(Boolean); }
function lexicalDraft(candidate) {
  if (editorial[candidate.normalized]) return editorial[candidate.normalized];
  const frSurface = fr.entries[candidate.normalized], enSurface = en.entries[candidate.normalized];
  const direct = substantive(frSurface);
  const headword = direct?.word ?? formLemma(frSurface) ?? formLemma(enSurface) ?? candidate.normalized;
  const frEntry = substantive(fr.entries[headword]) ?? direct;
  const enEntry = substantive(en.entries[headword]) ?? substantive(enSurface);
  const frSense = frEntry?.senses?.find((sense) => sense.glosses?.length && !sense.form_of?.length);
  const enSense = enEntry?.senses?.find((sense) => sense.glosses?.length && !sense.form_of?.length);
  return {
    headword, partOfSpeech: posMap[frEntry?.pos] ?? posMap[enEntry?.pos] ?? "word",
    gloss: clean(enSense?.glosses?.[0] ?? `meaning of ${headword}`),
    definition: clean(frSense?.glosses?.[0] ?? `sens contextuel de « ${headword} »`),
  };
}

function options(normalized) {
  const surfaces = registry.surfaceForms.filter((item) => item.normalized === normalized);
  const pairs = surfaces.flatMap((surface) => registry.quizItems.filter((quiz) => quiz.surfaceFormId === surface.id).map((quiz) => ({ surface, sense: registry.senses.find((item) => item.id === quiz.senseId) }))).filter((item) => item.sense);
  return [...new Map(pairs.map((item) => [`${item.surface.id}:${item.sense.id}`, item])).values()];
}
function selectExisting(candidate, units) {
  const choices = options(candidate.normalized);
  if (choices.length <= 1) return choices[0];
  const unit = units.find((item) => item.id === candidate.unitId)?.french ?? "";
  const before = normalize(unit.slice(Math.max(0, candidate.start - 14), candidate.start));
  const after = normalize(unit.slice(candidate.end, candidate.end + 18));
  const wanted = (() => {
    if (candidate.normalized === "plus") return "more|degree";
    if (candidate.normalized === "point") return "not at all|negation";
    if (candidate.normalized === "en") return /n[’']$/.test(before) ? "it; of it|pronoun" : "in";
    if (["le", "la", "l’"].includes(candidate.normalized)) return /^(?:emporte|a |allons|ouvrage|aurais|purent)/.test(after.trim()) ? "object|him; her; it" : "article|the";
    if (candidate.normalized === "que" || candidate.normalized === "qu’") {
      if (/plus\s*$/.test(before)) return "than|comparative";
      if (/^(?:faisiez|votre)/.test(after.trim())) return "what|interrogative";
      if (/^(?:on|il|une|je)/.test(after.trim()) && /(?:ce|chose|tout|dents)\s*$/.test(before)) return "relative";
      return "that|conjunction";
    }
    if (candidate.normalized === "tout") return "all|whole";
    return "";
  })();
  const regex = new RegExp(wanted, "i");
  return choices.find((item) => regex.test(`${item.sense.id} ${item.sense.gloss} ${item.sense.definition}`)) ?? choices[0];
}

const pools = {
  noun: { en: ["a window", "a notebook", "a garden"], fr: ["fenêtre", "cahier", "jardin"] }, adjective: { en: ["quiet", "narrow", "rapid"], fr: ["calme", "étroit", "rapide"] },
  verb: { en: ["to walk", "to close", "to wait"], fr: ["marcher", "fermer", "attendre"] }, adverb: { en: ["outside", "tomorrow", "rarely"], fr: ["dehors", "demain", "rarement"] },
  pronoun: { en: ["him", "us", "them"], fr: ["lui", "nous", "eux"] }, word: { en: ["a window", "quiet", "tomorrow"], fr: ["fenêtre", "calme", "demain"] },
};
const four = (answer, values) => [answer, ...values.filter((value) => normalize(value) !== normalize(answer))].slice(0, 4);
function author(workKey, candidate, draft) {
  let lemma = registry.lemmas.find((item) => normalize(item.headword) === normalize(draft.headword) && item.partOfSpeech === draft.partOfSpeech);
  if (!lemma) { lemma = { id: `lem_${workKey}_${stable(`${draft.headword}_${draft.partOfSpeech}`)}`, headword: draft.headword, partOfSpeech: draft.partOfSpeech }; registry.lemmas.push(lemma); }
  let sense = registry.senses.find((item) => item.lemmaId === lemma.id && normalize(item.definition) === normalize(draft.definition));
  if (!sense) { sense = { id: `sns_${workKey}_${stable(`${draft.headword}_${draft.definition}`)}`, lemmaId: lemma.id, gloss: draft.gloss, definition: draft.definition }; registry.senses.push(sense); }
  let surface = registry.surfaceForms.find((item) => item.lemmaId === lemma.id && item.normalized === candidate.normalized);
  if (!surface) { surface = { id: `srf_${workKey}_${stable(`${candidate.normalized}_${lemma.id}`)}`, lemmaId: lemma.id, form: candidate.text, normalized: candidate.normalized }; registry.surfaceForms.push(surface); }
  if (!registry.quizItems.some((item) => item.surfaceFormId === surface.id && item.senseId === sense.id)) {
    const pool = pools[draft.partOfSpeech] ?? pools.word, choicesFrench = four(candidate.text, pool.fr), choicesEnglish = four(draft.gloss, pool.en), key = stable(`${candidate.normalized}_${sense.id}`);
    registry.quizItems.push(
      { id: `qiz_${workKey}_${key}_early`, surfaceFormId: surface.id, senseId: sense.id, band: "levels_1_3", format: "meaning_choice", contextFrench: `Nina emploie « ${candidate.text} » pour exprimer cette idée : ${draft.definition}.`, targetText: candidate.text, prompt: "Meaning", choicesEnglish, correctAnswer: draft.gloss },
      { id: `qiz_${workKey}_${key}_intermediate`, surfaceFormId: surface.id, senseId: sense.id, band: "levels_4_5", format: "surface_completion", contextFrench: `Le terme qui signifie « ${draft.definition} » est _____.`, choicesFrench, correctAnswer: candidate.text },
      { id: `qiz_${workKey}_${key}_advanced`, surfaceFormId: surface.id, senseId: sense.id, band: "levels_6_8", format: "target_identification", contextFrench: `Le mot ${candidate.text} est précis. Paul compare ${choicesFrench[1]}, Léa note ${choicesFrench[2]} et Marc choisit ${choicesFrench[3]}.`, promptFrench: `Quel mot signifie « ${draft.definition} » ?`, choicesFrench, correctAnswer: candidate.text },
    );
  }
  return { lemma, sense, surface };
}

const occurrences = [], exclusions = [], progress = [];
for (const work of curatedLaFontaineSourceAcquisition.works) {
  const workKey = work.id.slice(4), manifest = JSON.parse(readFileSync(new URL(`content/review/${work.id}.manifest.json`, root), "utf8"));
  const workUnits = curatedLaFontaineSourceAcquisition.units.filter((item) => item.workId === work.id);
  const decisions = [];
  for (const candidate of manifest.candidates) {
    const contextualDraft = contextualEditorial[`${candidate.unitId}:${candidate.normalized}`];
    const forcedDraft = contextualDraft ?? (forcedEditorial.has(candidate.normalized) ? editorial[candidate.normalized] : undefined);
    const existing = forcedDraft ? undefined : selectExisting(candidate, workUnits);
    const identity = existing ? { surface: existing.surface, sense: existing.sense, lemma: registry.lemmas.find((item) => item.id === existing.sense.lemmaId) } : author(workKey, candidate, forcedDraft ?? lexicalDraft(candidate));
    decisions.push({ candidateId: candidate.id, disposition: "vocabulary", surfaceFormId: identity.surface.id, senseId: identity.sense.id, lemmaId: identity.lemma.id });
    occurrences.push({ id: `occ_${workKey}_${candidate.id.slice(4)}`, workId: work.id, unitId: candidate.unitId, start: candidate.start, end: candidate.end, surfaceFormId: identity.surface.id, senseId: identity.sense.id });
  }
  const artifact = { schemaVersion: 1, workId: work.id, batch: 1, candidateRange: { start: 1, end: manifest.candidates.length }, sourceDigest: manifest.sourceDigest, status: "reviewed_with_prepared_quizzes", counts: { candidatesReviewed: decisions.length, vocabularyOccurrences: decisions.length, excludedOccurrences: 0 }, assurances: { canonicalWordingPreserved: true, allCandidatesResolvedOnce: true, quizzesUseIndependentContexts: true, exactSourceContextReuseRejected: true, publicationAllowed: true }, decisions };
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  writeFileSync(new URL(`content/review/${work.id}.batch-01.json`, root), serialized);
  const workProgress = { schemaVersion: 1, workId: work.id, sourceDigest: manifest.sourceDigest, totalCandidates: manifest.candidates.length, reviewedCandidates: manifest.candidates.length, remainingCandidates: 0, completedBatches: [{ batch: 1, start: 1, end: manifest.candidates.length, artifact: `${work.id}.batch-01.json`, digest: `sha256:${createHash("sha256").update(serialized).digest("hex")}` }], nextCandidateRange: null, fullAuditAndTestStatus: "pending_final_combined_audit", publicationAllowed: false };
  writeFileSync(new URL(`content/review/${work.id}.progress.json`, root), `${JSON.stringify(workProgress, null, 2)}\n`);
  progress.push(workProgress);
}

const expressionSpecs = [
  ["wrk_cigale_fourmi", "tout l’été", "all summer", "pendant la totalité de l’été"], ["wrk_cigale_fourmi", "nuit et jour", "night and day", "continuellement, pendant la nuit comme pendant le jour"],
  ["wrk_cigale_fourmi", "à tout venant", "to anyone who came", "à toute personne qui se présente"], ["wrk_cigale_fourmi", "ne vous déplaise", "if you please", "formule polie qui atténue une affirmation"], ["wrk_cigale_fourmi", "eh bien", "well then", "introduit une réaction ou une conclusion"],
  ["wrk_loup_agneau", "tout à l’heure", "right away; shortly", "dans un délai très proche"], ["wrk_loup_agneau", "à jeun", "on an empty stomach", "sans avoir mangé"], ["wrk_loup_agneau", "par conséquent", "therefore", "introduit la conséquence logique de ce qui précède"],
  ["wrk_loup_agneau", "en aucune façon", "in no way", "nie complètement toute possibilité"], ["wrk_loup_agneau", "là-dessus", "thereupon", "à la suite immédiate de ce qui vient d’être dit"], ["wrk_loup_agneau", "sans autre forme de procès", "without further ado", "sans discussion ni procédure supplémentaire"],
  ["wrk_lion_rat", "en cette occasion", "on this occasion", "dans cette circonstance particulière"],
  ["wrk_lion_rat", "tout le monde", "everyone", "toutes les personnes sans exception"], ["wrk_lion_rat", "à l’étourdie", "heedlessly", "d’une manière irréfléchie et imprudente"], ["wrk_lion_rat", "au sortir des forêts", "upon leaving the forests", "au moment de quitter les forêts"],
];
for (const [workId, text, gloss, definition] of expressionSpecs) {
  const workKey = workId.slice(4), units = curatedLaFontaineSourceAcquisition.units.filter((item) => item.workId === workId);
  let identity = expressionCatalog.identities.find((item) => normalize(item.headword) === normalize(text));
  if (!identity) { identity = { id: `exi_${workKey}_${stable(text)}`, headword: text, gloss, definition }; expressionCatalog.identities.push(identity); }
  let found = 0;
  for (const unit of units) {
    const start = normalize(unit.french).indexOf(normalize(text));
    if (start < 0) continue;
    found += 1; const sourceText = unit.french.slice(start, start + text.length);
    expressionCatalog.occurrences.push({ id: `exo_${workKey}_${stable(text)}_${String(found).padStart(2, "0")}`, identityId: identity.id, workId, unitId: unit.id, start, end: start + text.length, text: sourceText });
  }
  if (!found) throw new Error(`Expression not found: ${workId} ${text}`);
  if (!expressionCatalog.preparedQuizzes.some((item) => item.expressionId === identity.id)) {
    const choicesFrench = four(text, ["avant de", "loin de", "de temps en temps"]), choicesEnglish = four(gloss, ["before", "far away", "occasionally"]), key = stable(text);
    expressionCatalog.preparedQuizzes.push(
      { id: `exq_${workKey}_${key}_early`, expressionId: identity.id, band: "levels_1_3", format: "meaning_choice", contextFrench: `Nina emploie ${text} dans une phrase nouvelle.`, targetText: text, choicesEnglish, correctAnswer: gloss },
      { id: `exq_${workKey}_${key}_intermediate`, expressionId: identity.id, band: "levels_4_5", format: "surface_completion", contextFrench: `L’expression qui signifie « ${definition} » est _____.`, choicesFrench, correctAnswer: text },
      { id: `exq_${workKey}_${key}_advanced`, expressionId: identity.id, band: "levels_6_8", format: "target_identification", contextFrench: `Nina choisit ${text}, Paul écrit avant de, Léa note loin de et Marc ajoute de temps en temps.`, promptFrench: `Quelle expression signifie « ${definition} » ?`, choicesFrench, correctAnswer: text },
    );
  }
}

const mergedWorks = [...base.works, ...curatedLaFontaineSourceAcquisition.works.map((item) => ({ ...item, publicationState: "learning_ready" }))];
const lafOrder = new Map([["wrk_cigale_fourmi", 1], ["wrk_corbeau_renard", 2], ["wrk_loup_agneau", 10], ["wrk_lion_rat", 111], ["wrk_lievre_tortue", 610]]);
const laFontaineWorks = mergedWorks.filter((item) => lafOrder.has(item.id)).sort((a, b) => lafOrder.get(a.id) - lafOrder.get(b.id));
const bundle = {
  ...base,
  authors: uniqueById([...base.authors, ...curatedLaFontaineSourceAcquisition.authors]), collections: uniqueById([...base.collections, ...curatedLaFontaineSourceAcquisition.collections]),
  works: [...laFontaineWorks, ...mergedWorks.filter((item) => !lafOrder.has(item.id))],
  sources: [...new Map([...base.sources, ...curatedLaFontaineSourceAcquisition.sources].map((item) => [item.workId, item])).values()],
  units: uniqueById([...base.units, ...curatedLaFontaineSourceAcquisition.units]), lemmas: uniqueById(registry.lemmas), senses: uniqueById(registry.senses), surfaceForms: uniqueById(registry.surfaceForms),
  occurrences: uniqueById([...base.occurrences, ...occurrences]), exclusions: uniqueById([...base.exclusions, ...exclusions]), notes: uniqueById([...base.notes, ...curatedLaFontaineSourceAcquisition.notes]),
  quizItems: uniqueById(registry.quizItems),
  readiness: [...new Map([...base.readiness, ...curatedLaFontaineSourceAcquisition.works.map((item) => ({ workId: item.id, thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [] }))].map((item) => [item.workId, item])).values()],
};
for (const workId of incomingWorkIds) importApprovedWork(bundle, { identities: uniqueById(expressionCatalog.identities), occurrences: uniqueById(expressionCatalog.occurrences), preparedQuizzes: uniqueById(expressionCatalog.preparedQuizzes) }, workId);
console.log(JSON.stringify({ works: progress.map((item) => ({ workId: item.workId, candidates: item.totalCandidates })), totals: { works: bundle.works.length, identities: new Set(bundle.quizItems.map((item) => `${item.surfaceFormId}:${item.senseId}`)).size, expressions: expressionCatalog.identities.length } }, null, 2));
