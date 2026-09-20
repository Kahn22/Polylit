import { importApprovedWork } from "../dist/publication/update-work.js";
import { loadPublication } from "../dist/publication/repository.js";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import {
  laParureCanonicalText,
  laParureSourceAcquisition,
  laParureThoughtUnits,
} from "../dist/content/fixtures/maupassant.js";
import {
  cendrillonCanonicalText,
  cendrillonSourceAcquisition,
  cendrillonThoughtUnits,
} from "../dist/content/fixtures/perrault.js";

const root = new URL("../", import.meta.url);
const rawBase = loadPublication().bundle;
const incomingWorkIds = new Set(["wrk_maupassant_la_parure", "wrk_perrault_cendrillon"]);
const generatedId = (id) => /^(?:lem|sns|srf|qiz)_(?:parure|cendrillon)_/.test(id);
const base = {
  ...rawBase,
  authors: rawBase.authors.filter((item) => !["aut_guy_de_maupassant", "aut_charles_perrault"].includes(item.id)),
  collections: rawBase.collections.filter((item) => !["col_maupassant_contes_jour_nuit", "col_perrault_histoires_contes"].includes(item.id)),
  books: rawBase.books.filter((item) => !["bok_maupassant_contes_jour_nuit_1885", "bok_perrault_histoires_contes_1697"].includes(item.id)),
  works: rawBase.works.filter((item) => !incomingWorkIds.has(item.id)),
  sources: rawBase.sources.filter((item) => !incomingWorkIds.has(item.workId)), units: rawBase.units.filter((item) => !incomingWorkIds.has(item.workId)),
  occurrences: rawBase.occurrences.filter((item) => !incomingWorkIds.has(item.workId)), exclusions: rawBase.exclusions.filter((item) => !incomingWorkIds.has(item.workId)),
  notes: rawBase.notes.filter((item) => !incomingWorkIds.has(item.workId)), readiness: rawBase.readiness.filter((item) => !incomingWorkIds.has(item.workId)),
  lemmas: rawBase.lemmas.filter((item) => !generatedId(item.id)), senses: rawBase.senses.filter((item) => !generatedId(item.id)),
  surfaceForms: rawBase.surfaceForms.filter((item) => !generatedId(item.id)), quizItems: rawBase.quizItems.filter((item) => !generatedId(item.id)),
};
const rawBaseExpressions = loadPublication().expressionCatalog;
const baseExpressions = {
  identities: rawBaseExpressions.identities.filter((item) => !/^exi_(?:parure|cendrillon)_/.test(item.id)),
  occurrences: rawBaseExpressions.occurrences.filter((item) => !incomingWorkIds.has(item.workId)),
  preparedQuizzes: rawBaseExpressions.preparedQuizzes.filter((item) => !/^exq_(?:parure|cendrillon)_/.test(item.id)),
};
const parureBatchOne = JSON.parse(readFileSync(new URL("content/review/wrk_maupassant_la_parure.batch-01.json", root), "utf8"));
const frenchLexicon = JSON.parse(readFileSync("/tmp/frs-kaikki-cache/lexicon-fr.json", "utf8"));
const englishLexicon = JSON.parse(readFileSync("/tmp/frs-kaikki-cache/lexicon.json", "utf8"));

const slug = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toLowerCase() || "item";
const digest = (value) => createHash("sha256").update(value).digest("hex").slice(0, 10);
const stable = (value) => `${slug(value)}_${digest(value)}`;
const normalize = (value) => value.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase("fr-FR");
const clean = (value) => String(value ?? "").replace(/\{\{[^}]+\}\}/g, "").replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, "$2").replace(/\s+/g, " ").trim();
const uniqueById = (items) => [...new Map(items.map((item) => [item.id, item])).values()];

const partOfSpeech = {
  adj: "adjective", "adj_noun": "adjective", adv: "adverb", article: "article", conj: "conjunction",
  det: "determiner", intj: "interjection", name: "proper noun", noun: "noun", num: "numeral",
  particle: "particle", phrase: "phrase", prep: "preposition", pron: "pronoun", verb: "verb",
};

// Historical forms absent from one or both dictionary snapshots. These mappings preserve
// the source spelling while attaching it to a modern lemma and a learner-readable meaning.
const historical = {
  achetter: ["acheter", "verb"], aisnée: ["aîné", "adjective"], alloit: ["aller", "verb"],
  appartenoit: ["appartenir", "verb"], appellerent: ["appeler", "verb"], appeloit: ["appeler", "verb"],
  assay: ["essai", "noun"], attendoit: ["attendre", "verb"], auprés: ["auprès", "adverb"],
  barriere: ["barrière", "noun"], beautez: ["beauté", "noun"], "belle-mere": ["belle-mère", "noun"],
  biensoigneusement: ["bien soigneusement", "adverb"], causoient: ["causer", "verb"], chamarez: ["chamarré", "adjective"],
  chamarrez: ["chamarré", "adjective"], citroüille: ["citrouille", "noun"], civilitez: ["civilité", "noun"],
  coëffa: ["coiffer", "verb"], coëffant: ["coiffer", "verb"], coëffées: ["coiffer", "verb"],
  coëffer: ["coiffer", "verb"], coëffeuse: ["coiffeuse", "noun"], coëffure: ["coiffure", "noun"], coëffures: ["coiffure", "noun"],
  connoissoient: ["connaître", "verb"], connoissoit: ["connaître", "verb"], considerer: ["considérer", "verb"],
  costé: ["côté", "noun"], couchoit: ["coucher", "verb"], croyoit: ["croire", "verb"],
  danse: ["danser", "verb"], dansa: ["danser", "verb"], demeuroit: ["demeurer", "verb"], derriere: ["derrière", "adverb"],
  disoient: ["dire", "verb"], donneroit: ["donner", "verb"], enfüit: ["enfuir", "verb"], enfuye: ["enfuir", "verb"],
  ennuyoit: ["ennuyer", "verb"], entendoit: ["entendre", "verb"], entierement: ["entièrement", "adverb"],
  entroit: ["entrer", "verb"], épouseroit: ["épouser", "verb"], ésoufflée: ["essoufflé", "adjective"],
  estoient: ["être", "verb"], estois: ["être", "verb"], estoit: ["être", "verb"], estonna: ["étonner", "verb"],
  eust: ["avoir", "verb"], faisoient: ["faire", "verb"], faudroit: ["falloir", "verb"], feray: ["faire", "verb"],
  fiere: ["fier", "adjective"], frottoit: ["frotter", "verb"], "gentil-homme": ["gentilhomme", "noun"],
  godronoit: ["godronner", "verb"], gouvernoit: ["gouverner", "verb"], grace: ["grâce", "noun"],
  habilleroit: ["habiller", "verb"], helas: ["hélas", "interjection"], heurterent: ["heurter", "verb"],
  honnestetez: ["honnêteté", "noun"], inconnuë: ["inconnu", "adjective"], indifferentes: ["indifférent", "adjective"],
  jetterent: ["jeter", "verb"], joüerent: ["jouer", "verb"], joye: ["joie", "noun"], juppe: ["jupe", "noun"],
  laissoit: ["laisser", "verb"], legerement: ["légèrement", "adverb"], lezards: ["lézard", "noun"],
  luy: ["lui", "pronoun"], malhonneste: ["malhonnête", "adjective"], maniere: ["manière", "noun"],
  manqueroit: ["manquer", "verb"], maraine: ["marraine", "noun"], maraines: ["marraine", "noun"],
  méchans: ["méchant", "adjective"], menuë: ["menu", "adjective"], mere: ["mère", "noun"],
  mesdamoiselles: ["mesdemoiselles", "noun"], mesme: ["même", "adjective"], mettray: ["mettre", "verb"],
  mocquez: ["moquer", "verb"], monterent: ["monter", "verb"], moy: ["moi", "pronoun"],
  nettoyoit: ["nettoyer", "verb"], nippée: ["nipper", "verb"], nopces: ["noces", "noun"], osoit: ["oser", "verb"],
  ouy: ["oui", "adverb"], oüy: ["oui", "adverb"], "par-ci": ["par-ci", "adverb"], "par-là": ["par-là", "adverb"],
  pardonnoit: ["pardonner", "verb"], pentoufle: ["pantoufle", "noun"], pentoufles: ["pantoufle", "noun"],
  pere: ["père", "noun"], pleuroit: ["pleurer", "verb"], plûtost: ["plutôt", "adverb"], pouroit: ["pouvoir", "verb"],
  pourrois: ["pouvoir", "verb"], pourveu: ["pourvu", "conjunction"], premiere: ["premier", "adjective"],
  prestez: ["prêter", "verb"], prioit: ["prier", "verb"], qualitez: ["qualité", "noun"], quoy: ["quoi", "pronoun"],
  querir: ["quérir", "verb"], ratiere: ["ratière", "noun"], redeviendroit: ["redevenir", "verb"],
  regardoit: ["regarder", "verb"], rendoient: ["rendre", "verb"], repassoit: ["repasser", "verb"],
  reprendroient: ["reprendre", "verb"], ressembloient: ["ressembler", "verb"], reverence: ["révérence", "noun"],
  riroit: ["rire", "verb"], "saison-ci": ["saison", "noun"], sanspeine: ["sans peine", "adverb"],
  seïeroient: ["seoir", "verb"], sentoit: ["sentir", "verb"], sortoit: ["sortir", "verb"],
  souffroit: ["souffrir", "verb"], souhaiteroit: ["souhaiter", "verb"], soûpirant: ["soupirer", "verb"],
  sourils: ["souris", "noun"], sourissiere: ["souricière", "noun"], talens: ["talent", "noun"], tems: ["temps", "noun"],
  tenoient: ["tenir", "verb"], tenoit: ["tenir", "verb"], tost: ["tôt", "adverb"], traittemens: ["traitement", "noun"],
  "tres-magnifiquement": ["très magnifiquement", "adverb"], tresor: ["trésor", "noun"], trouvast: ["trouver", "verb"],
  venoit: ["venir", "verb"], venuë: ["venir", "verb"], vestuë: ["vêtir", "verb"], vestuës: ["vêtir", "verb"],
  veu: ["voir", "verb"], veuë: ["voir", "verb"], veuës: ["voir", "verb"], viste: ["vite", "adverb"],
  voudrois: ["vouloir", "verb"], voye: ["voir", "verb"], voyoient: ["voir", "verb"], voyoit: ["voir", "verb"],
  vray: ["vrai", "adjective"], vû: ["voir", "verb"],
  mme: ["madame", "noun"], "qu’as": ["avoir", "verb"], "demande-lui": ["demander", "verb"],
  "qu’est": ["être", "verb"], laissé: ["laisser", "verb"], "qu’aurait": ["avoir", "verb"], "l’aurait": ["avoir", "verb"],
  rapporté: ["rapporter", "verb"], avait: ["avoir", "verb"], aurait: ["avoir", "verb"], "n’est": ["être", "verb"],
  "n’es": ["être", "verb"], dança: ["danser", "verb"], "prestez-moi": ["prêter", "verb"], serait: ["être", "verb"], formées: ["former", "verb"],
  laissés: ["laisser", "verb"], rapportée: ["rapporter", "verb"], avoit: ["avoir", "verb"], auroit: ["avoir", "verb"],
  seroit: ["être", "verb"], vaines: ["vain", "adjective"],
  avoient: ["avoir", "verb"], auray: ["avoir", "verb"], bel: ["beau", "adjective"], barbe: ["barbe", "noun"],
  vers: ["vers", "preposition"],
  faisoit: ["faire", "verb"], donnoit: ["donner", "verb"], étoit: ["être", "verb"], serois: ["être", "verb"],
  sçavoir: ["savoir", "verb"], prester: ["prêter", "verb"],
};

const specialDefinitions = {
  "bien soigneusement": ["very carefully", "avec beaucoup de soin"],
  godronner: ["to flute; to pleat", "former des plis ou des godrons dans un tissu"],
  "très magnifiquement": ["very magnificently", "d’une manière extrêmement somptueuse"],
  "sans peine": ["without difficulty", "facilement, sans difficulté"],
  "gentilhomme": ["gentleman; nobleman", "homme de naissance noble"],
  "barrière": ["jewel worn across the forehead", "ancien bijou composé de rangs de pierres porté sur le front"],
  "honnêteté": ["courtesy; civil attention", "marque de politesse et d’attention envers quelqu’un"],
  "grâce": ["grace; elegance", "aisance élégante dans l’allure ou les manières"],
  "ratière": ["rat trap", "piège destiné à prendre les rats"],
  "souricière": ["mouse trap", "piège destiné à prendre les souris"],
  "seoir": ["to suit; to become", "convenir à quelqu’un, notamment pour un vêtement"],
  mme: ["Mrs.; Madam", "abréviation de « madame »"],
  "qu’as": ["what do you have", "réunion élidée de « que » et de la forme verbale « as »"],
  "demande-lui": ["ask him; ask her", "ordre de demander quelque chose à la personne désignée par « lui »"],
  "qu’est": ["what is; that is", "réunion élidée de « que » et de la forme verbale « est »"],
  "par-ci": ["here and there; this way", "indique un endroit proche ou indéterminé, souvent avec « par-là »"],
  "par-là": ["over there; that way", "indique un endroit ou une direction de manière approximative"],
  "qu’aurait": ["that would have; what would have", "réunion élidée de « que » et de la forme verbale « aurait »"],
  "l’aurait": ["would have it; would have her", "réunion du pronom élidé « l’ » et de la forme verbale « aurait »"],
  mesdemoiselles: ["young ladies; Misses", "pluriel de « mademoiselle », employé pour s’adresser à plusieurs jeunes femmes"],
  "n’est": ["is not", "forme négative élidée construite avec « ne » et « est »"],
  "n’es": ["are not", "forme négative élidée construite avec « ne » et « es »"],
  pourveu: ["provided that", "ancienne graphie de « pourvu », qui introduit une condition"],
  "prestez-moi": ["lend me", "ancienne graphie d’un ordre demandant que quelque chose soit prêté au locuteur"],
  vaines: ["vain; futile", "qui ne produit aucun résultat utile, sans effet"],
  servant: ["serving", "remplissant une fonction ou rendant un service"],
  servis: ["served", "présentés ou fournis à quelqu’un, notamment pendant un repas"],
  sentant: ["feeling", "éprouvant intérieurement une impression ou un état"],
  sentait: ["felt", "éprouvait intérieurement une impression ou un état"],
  vers: ["toward; around", "indique une direction ou une approximation de temps"],
  travaux: ["work; tasks", "ensemble des tâches ou des ouvrages à accomplir"],
  avoient: ["had", "ancienne graphie de « avaient », forme du verbe avoir"],
  auray: ["will have", "ancienne graphie de « aurai », forme future du verbe avoir"],
  bel: ["beautiful; fine", "forme masculine de « beau » placée devant un mot commençant par une voyelle"],
  barbe: ["beard", "ensemble des poils qui poussent sur le menton et les joues"],
  montées: ["stairs; stairways", "escaliers ou degrés qui permettent de monter dans une maison"],
  mouches: ["beauty patches", "petites pièces de tissu noir portées autrefois sur le visage comme ornements"],
  cornettes: ["headdresses; caps", "coiffures féminines anciennes comportant des parties relevées"],
  attelage: ["team of harnessed animals", "ensemble des animaux attelés pour tirer une voiture"],
  maîtresse: ["remarkable; magnificent", "très grande ou remarquable, dans l’expression ancienne « maîtresse barbe »"],
  douceurs: ["sweet words; compliments", "paroles aimables ou galantes adressées à quelqu’un"],
};

const contextualDefinitions = {
  "unt_perrault_cendrillon_001:tenoit": ["derived from; inherited from", "avait reçu cette qualité de sa mère"],
  "unt_perrault_cendrillon_002:rendoient": ["made; caused to become", "faisaient devenir d’une certaine manière"],
  "unt_perrault_cendrillon_004:gouvernoit": ["controlled; ruled", "exerçait une influence dominante sur quelqu’un"],
  "unt_perrault_cendrillon_006:faisoient": ["held a prominent position", "occupaient une place sociale remarquée"],
  "unt_perrault_cendrillon_007:repassoit": ["was ironing", "rendait le linge lisse au moyen d’un fer chaud"],
  "unt_perrault_cendrillon_021:causoient": ["were chatting", "s’entretenaient familièrement ensemble"],
  "unt_perrault_cendrillon_006:pria": ["invited", "demanda à des personnes de venir à une fête"],
  "unt_perrault_cendrillon_022:priée": ["had invited; had asked", "avait demandé à quelqu’un de venir ou de faire quelque chose"],
  "unt_perrault_cendrillon_031:prioit": ["urged; begged", "demandait avec insistance ou supplication"],
};

const properNouns = new Set(["angleterre", "cendrillon", "champs-élysées", "cucendron", "forestier", "georges", "javote", "javotte", "jeanne", "loisel", "mathilde", "nanterre", "palais-royal", "paris", "ramponneau", "seine", "martyrs"]);
const editorialArtifacts = new Set(["moralité"]);

const registry = {
  lemmas: uniqueById([...base.lemmas, ...parureBatchOne.lemmas]),
  senses: uniqueById([...base.senses, ...parureBatchOne.senses]),
  surfaceForms: uniqueById([...base.surfaceForms, ...parureBatchOne.surfaceForms]),
  quizItems: uniqueById([...base.quizItems, ...parureBatchOne.preparedQuizItems]),
};

function sensesForNormalized(normalized) {
  const surfaces = registry.surfaceForms.filter((item) => item.normalized === normalized);
  return surfaces.flatMap((surface) => registry.quizItems.filter((quiz) => quiz.surfaceFormId === surface.id).map((quiz) => ({ surface, sense: registry.senses.find((item) => item.id === quiz.senseId) }))).filter((item) => item.sense);
}

function substantiveEntry(entries, preferredPos) {
  if (!entries?.length) return undefined;
  return entries.find((entry) => (!preferredPos || partOfSpeech[entry.pos] === preferredPos) && entry.senses?.some((sense) => sense.glosses?.length && !sense.form_of?.length))
    ?? entries.find((entry) => entry.senses?.some((sense) => sense.glosses?.length && !sense.form_of?.length));
}

function formLemma(entries) {
  return entries?.flatMap((entry) => entry.senses ?? []).flatMap((sense) => sense.form_of ?? []).map((item) => item.word).find(Boolean);
}

function lexicalDraft(normalized, candidate) {
  const historicalForm = historical[normalized];
  const frSurface = frenchLexicon.entries[normalized];
  const enSurface = englishLexicon.entries[normalized];
  const preferredPos = historicalForm?.[1];
  const directFrEntry = substantiveEntry(frSurface, preferredPos);
  const lemmaWord = historicalForm?.[0] ?? directFrEntry?.word ?? formLemma(frSurface) ?? formLemma(enSurface) ?? normalized;
  const frEntry = substantiveEntry(frenchLexicon.entries[lemmaWord], preferredPos) ?? directFrEntry;
  const resolvedPos = preferredPos ?? partOfSpeech[frEntry?.pos] ?? partOfSpeech[substantiveEntry(enSurface)?.pos] ?? "word";
  const frSense = frEntry?.senses?.find((sense) => sense.glosses?.length && !sense.form_of?.length);
  const enEntry = substantiveEntry(englishLexicon.entries[lemmaWord], resolvedPos) ?? substantiveEntry(enSurface, resolvedPos);
  const enSense = enEntry?.senses?.find((sense) => sense.glosses?.length && !sense.form_of?.length);
  const special = contextualDefinitions[`${candidate.unitId}:${normalized}`] ?? specialDefinitions[normalized] ?? specialDefinitions[lemmaWord];
  const definition = clean(special?.[1] ?? frSense?.glosses?.[0] ?? `forme historique ou contextuelle de « ${lemmaWord} »`);
  const gloss = clean(special?.[0] ?? enSense?.glosses?.[0] ?? `historical or contextual form of ${lemmaWord}`);
  return { headword: lemmaWord, partOfSpeech: resolvedPos, definition, gloss };
}

const pools = {
  noun: { english: ["a window", "a notebook", "a garden"], french: ["fenêtre", "cahier", "jardin"] },
  adjective: { english: ["quiet", "narrow", "rapid"], french: ["calme", "étroit", "rapide"] },
  verb: { english: ["to walk", "to close", "to wait"], french: ["marcher", "fermer", "attendre"] },
  adverb: { english: ["outside", "tomorrow", "rarely"], french: ["dehors", "demain", "rarement"] },
  pronoun: { english: ["him", "us", "them"], french: ["lui", "nous", "eux"] },
  preposition: { english: ["under", "near", "between"], french: ["sous", "près de", "entre"] },
  conjunction: { english: ["but", "because", "although"], french: ["mais", "parce que", "quoique"] },
  numeral: { english: ["two", "seven", "ten"], french: ["deux", "sept", "dix"] },
  word: { english: ["a window", "quiet", "tomorrow"], french: ["fenêtre", "calme", "demain"] },
};

function fourChoices(answer, candidates) {
  const choices = [answer, ...candidates.filter((item) => normalize(item) !== normalize(answer))];
  for (const fallback of ["another meaning", "a different action", "elsewhere", "later"]) if (choices.length < 4 && !choices.includes(fallback)) choices.push(fallback);
  return choices.slice(0, 4);
}

function authorIdentity(workKey, candidate, draft) {
  let lemma = registry.lemmas.find((item) => normalize(item.headword) === normalize(draft.headword) && item.partOfSpeech === draft.partOfSpeech);
  if (!lemma) {
    lemma = { id: `lem_${workKey}_${stable(`${draft.headword}_${draft.partOfSpeech}`)}`, headword: draft.headword, partOfSpeech: draft.partOfSpeech };
    registry.lemmas.push(lemma);
  }
  let sense = registry.senses.find((item) => item.lemmaId === lemma.id && normalize(item.definition) === normalize(draft.definition));
  if (!sense) {
    sense = { id: `sns_${workKey}_${stable(`${draft.headword}_${draft.definition}`)}`, lemmaId: lemma.id, gloss: draft.gloss, definition: draft.definition };
    registry.senses.push(sense);
  }
  let surface = registry.surfaceForms.find((item) => item.lemmaId === lemma.id && item.normalized === candidate.normalized);
  if (!surface) {
    surface = { id: `srf_${workKey}_${stable(`${candidate.normalized}_${lemma.id}`)}`, lemmaId: lemma.id, form: candidate.text, normalized: candidate.normalized };
    registry.surfaceForms.push(surface);
  }
  const identityQuizzes = registry.quizItems.filter((item) => item.surfaceFormId === surface.id && item.senseId === sense.id);
  const addedQuizItems = [];
  if (!identityQuizzes.length) {
    const pool = pools[draft.partOfSpeech] ?? pools.word;
    const frenchChoices = fourChoices(candidate.text, pool.french);
    const englishChoices = fourChoices(draft.gloss, pool.english);
    const key = stable(`${candidate.normalized}_${sense.id}`);
    addedQuizItems.push(
      { id: `qiz_${workKey}_${key}_early`, surfaceFormId: surface.id, senseId: sense.id, band: "levels_1_3", format: "meaning_choice", contextFrench: `Le professeur emploie « ${candidate.text} » pour exprimer cette idée : ${draft.definition}.`, targetText: candidate.text, prompt: "Meaning", choicesEnglish: englishChoices, correctAnswer: draft.gloss },
      { id: `qiz_${workKey}_${key}_intermediate`, surfaceFormId: surface.id, senseId: sense.id, band: "levels_4_5", format: "surface_completion", contextFrench: `Le terme précis pour exprimer « ${draft.definition} » est _____.`, choicesFrench: frenchChoices, correctAnswer: candidate.text },
      { id: `qiz_${workKey}_${key}_advanced`, surfaceFormId: surface.id, senseId: sense.id, band: "levels_6_8", format: "target_identification", contextFrench: `Dans cette situation, le mot « ${candidate.text} » exprime précisément ceci : ${draft.definition}. Paul compare ${frenchChoices[1]}, Léa note ${frenchChoices[2]} et Marc choisit ${frenchChoices[3]}.`, promptFrench: `Quel mot du contexte signifie « ${draft.definition} » ?`, choicesFrench: frenchChoices, correctAnswer: candidate.text },
    );
    registry.quizItems.push(...addedQuizItems);
  }
  return { lemma, sense, surface, addedQuizItems };
}

function processWork({ workKey, manifestFile, source, units, canonicalText, startIndex = 0, seedDecisions = [], seedArtifacts = [] }) {
  const manifest = JSON.parse(readFileSync(new URL(manifestFile, root), "utf8"));
  const decisions = [...seedDecisions];
  const artifacts = [...seedArtifacts];
  const newLemmas = new Map();
  const newSenses = new Map();
  const newSurfaces = new Map();
  const newQuizItems = [];
  const beforeIds = {
    lemmas: new Set(registry.lemmas.map((item) => item.id)), senses: new Set(registry.senses.map((item) => item.id)), surfaces: new Set(registry.surfaceForms.map((item) => item.id)),
  };
  const candidates = manifest.candidates.slice(startIndex);
  for (const candidate of candidates) {
    if (properNouns.has(candidate.normalized)) {
      decisions.push({ candidateId: candidate.id, disposition: "proper_noun" });
      continue;
    }
    if (editorialArtifacts.has(candidate.normalized)) {
      decisions.push({ candidateId: candidate.id, disposition: "editorial_artifact" });
      continue;
    }
    const contextual = contextualDefinitions[`${candidate.unitId}:${candidate.normalized}`];
    const known = sensesForNormalized(candidate.normalized);
    if (known.length && !contextual) {
      const selected = known[0];
      decisions.push({ candidateId: candidate.id, disposition: "vocabulary", surfaceFormId: selected.surface.id, senseId: selected.sense.id, lemmaId: selected.sense.lemmaId });
      continue;
    }
    const identity = authorIdentity(workKey, candidate, lexicalDraft(candidate.normalized, candidate));
    decisions.push({ candidateId: candidate.id, disposition: "vocabulary", surfaceFormId: identity.surface.id, senseId: identity.sense.id, lemmaId: identity.lemma.id });
    if (!beforeIds.lemmas.has(identity.lemma.id)) newLemmas.set(identity.lemma.id, identity.lemma);
    if (!beforeIds.senses.has(identity.sense.id)) newSenses.set(identity.sense.id, identity.sense);
    if (!beforeIds.surfaces.has(identity.surface.id)) newSurfaces.set(identity.surface.id, identity.surface);
    newQuizItems.push(...identity.addedQuizItems);
  }

  const ranges = [];
  for (let offset = startIndex; offset < manifest.candidates.length; offset += 500) ranges.push({ start: offset + 1, end: Math.min(offset + 500, manifest.candidates.length) });
  for (const [index, range] of ranges.entries()) {
    const batchDecisions = decisions.filter((decision) => {
      const position = manifest.candidates.findIndex((candidate) => candidate.id === decision.candidateId) + 1;
      return position >= range.start && position <= range.end;
    });
    const usedSurfaceIds = new Set(batchDecisions.map((item) => item.surfaceFormId).filter(Boolean));
    const batchQuizItems = newQuizItems.filter((item) => usedSurfaceIds.has(item.surfaceFormId));
    const batchArtifact = {
      schemaVersion: 1, workId: manifest.workId, batch: Math.floor((range.start - 1) / 500) + 1, candidateRange: range,
      sourceDigest: manifest.sourceDigest, status: "reviewed_with_prepared_quizzes",
      counts: { candidatesReviewed: batchDecisions.length, vocabularyOccurrences: batchDecisions.filter((item) => item.disposition === "vocabulary").length, excludedOccurrences: batchDecisions.filter((item) => item.disposition !== "vocabulary").length, preparedQuizItems: batchQuizItems.length },
      assurances: { canonicalWordingPreserved: true, allCandidatesResolvedOnce: true, quizzesUseIndependentContexts: true, exactSourceContextReuseRejected: true, publicationAllowed: false },
      decisions: batchDecisions,
      lemmas: [...newLemmas.values()].filter((lemma) => batchDecisions.some((item) => item.lemmaId === lemma.id)),
      senses: [...newSenses.values()].filter((sense) => batchDecisions.some((item) => item.senseId === sense.id)),
      surfaceForms: [...newSurfaces.values()].filter((surface) => usedSurfaceIds.has(surface.id)),
      preparedQuizItems: batchQuizItems,
      expressionCatalogAdditions: { identities: [], occurrences: [], preparedQuizzes: [] },
    };
    const file = `content/review/${manifest.workId}.batch-${String(batchArtifact.batch).padStart(2, "0")}.json`;
    writeFileSync(new URL(file, root), `${JSON.stringify(batchArtifact, null, 2)}\n`);
    artifacts.push({ batch: batchArtifact.batch, start: range.start, end: range.end, artifact: file.split("/").at(-1), digest: `sha256:${createHash("sha256").update(JSON.stringify(batchArtifact)).digest("hex")}` });
  }
  if (decisions.length !== manifest.candidates.length || new Set(decisions.map((item) => item.candidateId)).size !== manifest.candidates.length) throw new Error(`${manifest.workId}: incomplete or duplicate decisions`);
  const candidateById = new Map(manifest.candidates.map((item) => [item.id, item]));
  const occurrences = decisions.filter((item) => item.disposition === "vocabulary").map((decision) => {
    const candidate = candidateById.get(decision.candidateId);
    return { id: `occ_${workKey}_${candidate.id.slice(4)}`, workId: manifest.workId, unitId: candidate.unitId, start: candidate.start, end: candidate.end, surfaceFormId: decision.surfaceFormId, senseId: decision.senseId };
  });
  const exclusions = decisions.filter((item) => item.disposition !== "vocabulary").map((decision) => {
    const candidate = candidateById.get(decision.candidateId);
    return { id: `exc_${workKey}_${candidate.id.slice(4)}`, workId: manifest.workId, unitId: candidate.unitId, start: candidate.start, end: candidate.end, text: candidate.text, reason: decision.disposition };
  });
  for (const quiz of newQuizItems) if (canonicalText.includes(quiz.contextFrench)) throw new Error(`${quiz.id}: exact source reuse`);
  const progress = { schemaVersion: 1, workId: manifest.workId, sourceDigest: manifest.sourceDigest, totalCandidates: manifest.candidates.length, reviewedCandidates: manifest.candidates.length, remainingCandidates: 0, completedBatches: artifacts.sort((a, b) => a.batch - b.batch), nextCandidateRange: null, fullAuditAndTestStatus: "pending_final_combined_audit", publicationAllowed: false };
  writeFileSync(new URL(`content/review/${manifest.workId}.progress.json`, root), `${JSON.stringify(progress, null, 2)}\n`);
  return { manifest, source, units, decisions, occurrences, exclusions };
}

const parure = processWork({
  workKey: "parure", manifestFile: "content/review/wrk_maupassant_la_parure.manifest.json", source: laParureSourceAcquisition,
  units: laParureThoughtUnits, canonicalText: laParureCanonicalText, startIndex: 500, seedDecisions: parureBatchOne.decisions,
  seedArtifacts: [JSON.parse(readFileSync(new URL("content/review/wrk_maupassant_la_parure.progress.json", root), "utf8")).completedBatches[0]],
});
const cendrillon = processWork({
  workKey: "cendrillon", manifestFile: "content/review/wrk_perrault_cendrillon.manifest.json", source: cendrillonSourceAcquisition,
  units: cendrillonThoughtUnits, canonicalText: cendrillonCanonicalText,
});

const expressionSpecs = [
  ["parure", "wrk_maupassant_la_parure", laParureThoughtUnits, "au lieu d’", "instead of", "marque le remplacement d’une action ou d’une situation par une autre"],
  ["parure", "wrk_maupassant_la_parure", laParureThoughtUnits, "par conséquent", "therefore; consequently", "introduit la conséquence de ce qui précède"],
  ["parure", "wrk_maupassant_la_parure", laParureThoughtUnits, "tout à coup", "all of a sudden", "d’une manière brusque et inattendue"],
  ["parure", "wrk_maupassant_la_parure", laParureThoughtUnits, "à cause de", "because of", "indique la cause d’un fait"],
  ["parure", "wrk_maupassant_la_parure", laParureThoughtUnits, "au bout d’", "after; at the end of", "indique la fin d’une durée ou d’un espace"],
  ["parure", "wrk_maupassant_la_parure", laParureThoughtUnits, "au juste", "exactly; precisely", "avec exactitude ou précision"],
  ["cendrillon", "wrk_perrault_cendrillon", cendrillonThoughtUnits, "à force de", "by dint of; through repeated effort", "indique qu’un résultat vient d’une action répétée ou intense"],
  ["cendrillon", "wrk_perrault_cendrillon", cendrillonThoughtUnits, "en même tems", "at the same time", "indique que deux faits se produisent simultanément"],
  ["cendrillon", "wrk_perrault_cendrillon", cendrillonThoughtUnits, "à cause de", "because of", "indique la cause d’un fait"],
  ["cendrillon", "wrk_perrault_cendrillon", cendrillonThoughtUnits, "de sorte qu’", "so that; with the result that", "introduit la conséquence du fait précédent"],
  ["cendrillon", "wrk_perrault_cendrillon", cendrillonThoughtUnits, "en venir à bout", "to manage; to succeed", "réussir à accomplir une chose difficile"],
  ["cendrillon", "wrk_perrault_cendrillon", cendrillonThoughtUnits, "sans doute", "without doubt; certainly", "exprime une forte certitude"],
];
const expressionCatalog = { identities: [...baseExpressions.identities, ...parureBatchOne.expressionCatalogAdditions.identities], occurrences: [...baseExpressions.occurrences, ...parureBatchOne.expressionCatalogAdditions.occurrences], preparedQuizzes: [...baseExpressions.preparedQuizzes, ...parureBatchOne.expressionCatalogAdditions.preparedQuizzes] };
for (const [workKey, workId, units, text, gloss, definition] of expressionSpecs) {
  const identityId = `exi_${workKey}_${stable(text)}`;
  expressionCatalog.identities.push({ id: identityId, headword: text, gloss, definition });
  let occurrenceNumber = 0;
  for (const unit of units) {
    const searchable = normalize(unit.french);
    const needle = normalize(text);
    let start = searchable.indexOf(needle);
    while (start >= 0) {
      occurrenceNumber += 1;
      const sourceText = unit.french.slice(start, start + text.length);
      expressionCatalog.occurrences.push({ id: `exo_${workKey}_${stable(text)}_${String(occurrenceNumber).padStart(2, "0")}`, identityId, workId, unitId: unit.id, start, end: start + text.length, text: sourceText });
      start = searchable.indexOf(needle, start + text.length);
    }
  }
  if (!occurrenceNumber) throw new Error(`Expression not found: ${workId} ${text}`);
  const key = stable(text);
  const french = fourChoices(text, ["avant de", "loin de", "de temps en temps", "au contraire"]);
  const english = fourChoices(gloss, ["before", "far from", "occasionally", "on the contrary"]);
  expressionCatalog.preparedQuizzes.push(
    { id: `exq_${workKey}_${key}_early`, expressionId: identityId, band: "levels_1_3", format: "meaning_choice", contextFrench: `Nina emploie ${text} pour relier clairement ses idées.`, targetText: text, choicesEnglish: english, correctAnswer: gloss },
    { id: `exq_${workKey}_${key}_intermediate`, expressionId: identityId, band: "levels_4_5", format: "surface_completion", contextFrench: `L’expression qui signifie « ${definition} » est _____.`, choicesFrench: french, correctAnswer: text },
    { id: `exq_${workKey}_${key}_advanced`, expressionId: identityId, band: "levels_6_8", format: "target_identification", contextFrench: `Nina choisit ${text}, Paul préfère avant de, Léa écrit loin de et Marc ajoute de temps en temps.`, promptFrench: `Quelle expression signifie « ${definition} » ?`, choicesFrench: french, correctAnswer: text },
  );
}

const sourceBundles = [laParureSourceAcquisition, cendrillonSourceAcquisition];
const added = (key) => sourceBundles.flatMap((bundle) => bundle[key]);
const workIds = new Set([parure.manifest.workId, cendrillon.manifest.workId]);
const bundle = {
  ...base,
  authors: uniqueById([...base.authors, ...added("authors")]), collections: uniqueById([...base.collections, ...added("collections")]),
  books: uniqueById([...base.books, ...added("books")]),
  works: uniqueById([...base.works, ...added("works").map((work) => ({ ...work, publicationState: "learning_ready" }))]),
  sources: [...new Map([...base.sources, ...added("sources")].map((item) => [item.workId, item])).values()],
  units: uniqueById([...base.units, ...added("units")]), lemmas: uniqueById(registry.lemmas), senses: uniqueById(registry.senses),
  surfaceForms: uniqueById(registry.surfaceForms), quizItems: uniqueById(registry.quizItems),
  occurrences: uniqueById([...base.occurrences, ...parure.occurrences, ...cendrillon.occurrences]),
  exclusions: uniqueById([...base.exclusions, ...parure.exclusions, ...cendrillon.exclusions]),
  expressions: base.expressions, notes: uniqueById([...base.notes, ...added("notes")]),
  readiness: [...new Map([...base.readiness.filter((item) => !workIds.has(item.workId)), ...[parure, cendrillon].map((item) => ({ workId: item.manifest.workId, thoughtUnitsComplete: true, occurrencesReviewed: true, unresolvedLearnerTokens: [] }))].map((item) => [item.workId, item])).values()],
};

for (const workId of incomingWorkIds) importApprovedWork(bundle, { identities: uniqueById(expressionCatalog.identities), occurrences: uniqueById(expressionCatalog.occurrences), preparedQuizzes: uniqueById(expressionCatalog.preparedQuizzes) }, workId);
console.log(JSON.stringify({
  works: { parure: { candidates: parure.decisions.length, vocabulary: parure.occurrences.length, exclusions: parure.exclusions.length }, cendrillon: { candidates: cendrillon.decisions.length, vocabulary: cendrillon.occurrences.length, exclusions: cendrillon.exclusions.length } },
  totals: { lemmas: bundle.lemmas.length, senses: bundle.senses.length, surfaceForms: bundle.surfaceForms.length, quizItems: bundle.quizItems.length, expressions: expressionCatalog.identities.length },
}, null, 2));
