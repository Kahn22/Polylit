import { lafountainFixtures } from "../fixtures/la-fontaine.js";
import type { ContentBundle } from "../../domain/model.js";
import { prepareIngestionManifest } from "../../ingestion/prepare.js";
import { compactQuizItems } from "../quizzes/authoring.js";
import { corbeauQuizBatch01 } from "../quizzes/corbeau-batch-01.js";
import { corbeauQuizBatch02 } from "../quizzes/corbeau-batch-02.js";
import { corbeauQuizBatch03 } from "../quizzes/corbeau-batch-03.js";
import { corbeauQuizBatch04 } from "../quizzes/corbeau-batch-04.js";
import { corbeauQuizBatch05 } from "../quizzes/corbeau-batch-05.js";
import { corbeauQuizBatch06 } from "../quizzes/corbeau-batch-06.js";
import { corbeauQuizBatch07 } from "../quizzes/corbeau-batch-07.js";
import { corbeauQuizBatch08 } from "../quizzes/corbeau-batch-08.js";
import { corbeauQuizBatch09 } from "../quizzes/corbeau-batch-09.js";
import { corbeauQuizBatch10 } from "../quizzes/corbeau-batch-10.js";
import { corbeauQuizBatch11 } from "../quizzes/corbeau-batch-11.js";
import { corbeauQuizBatch12 } from "../quizzes/corbeau-batch-12.js";
import { corbeauQuizBatch13 } from "../quizzes/corbeau-batch-13.js";
import { corbeauQuizBatch14 } from "../quizzes/corbeau-batch-14.js";
import { corbeauQuizBatch15 } from "../quizzes/corbeau-batch-15.js";
import { corbeauQuizBatch16 } from "../quizzes/corbeau-batch-16.js";
import { corbeauQuizBatch17 } from "../quizzes/corbeau-batch-17.js";
import { corbeauQuizBatch18 } from "../quizzes/corbeau-batch-18.js";
import { corbeauQuizBatch19 } from "../quizzes/corbeau-batch-19.js";
import { corbeauQuizBatch20 } from "../quizzes/corbeau-batch-20.js";
import { corbeauQuizBatch21 } from "../quizzes/corbeau-batch-21.js";
import { corbeauQuizBatch22 } from "../quizzes/corbeau-batch-22.js";
import { corbeauQuizBatch23 } from "../quizzes/corbeau-batch-23.js";
import { corbeauQuizBatch24 } from "../quizzes/corbeau-batch-24.js";
import { corbeauQuizBatch25 } from "../quizzes/corbeau-batch-25.js";
import { corbeauQuizBatch26 } from "../quizzes/corbeau-batch-26.js";
import { corbeauQuizBatch27 } from "../quizzes/corbeau-batch-27.js";
import { corbeauQuizBatch28 } from "../quizzes/corbeau-batch-28.js";
import { corbeauQuizBatch29 } from "../quizzes/corbeau-batch-29.js";
import { corbeauQuizBatch30 } from "../quizzes/corbeau-batch-30.js";
import { corbeauQuizBatch31 } from "../quizzes/corbeau-batch-31.js";
import { corbeauQuizBatch32 } from "../quizzes/corbeau-batch-32.js";
import { corbeauQuizBatch33 } from "../quizzes/corbeau-batch-33.js";
import { corbeauQuizBatch34 } from "../quizzes/corbeau-batch-34.js";

interface LexemeSpec { lemma: string; partOfSpeech: string; gloss: string }

const specs: Record<string, LexemeSpec> = Object.fromEntries(`
maître|maître|noun|master; title of address
corbeau|corbeau|noun|crow
renard|renard|noun|fox
monsieur|monsieur|noun|mister; sir
sur|sur|preposition|on
un|un|determiner|a; an
arbre|arbre|noun|tree
perché|percher|verb|perched
tenait|tenir|verb|held
en|en|preposition|in; of it
son|son|determiner|his; its
bec|bec|noun|beak
fromage|fromage|noun|cheese
par|par|preposition|by; through
l’|le|determiner|the (elided form)
odeur|odeur|noun|smell
alléché|allécher|verb|attracted; tempted
lui|lui|pronoun|to him
tint|tenir|verb|spoke; held
à|à|preposition|to; at
peu|peu|adverb|little
près|près|adverb|near
ce|ce|determiner|this
langage|langage|noun|speech; language
hé|hé|interjection|hey
bonjour|bonjour|interjection|hello; good day
du|du|determiner|of the
que|que|function word|that; how; what
vous|vous|pronoun|you
êtes|être|verb|are
joli|joli|adjective|pretty; handsome
me|me|pronoun|to me
semblez|sembler|verb|seem; appear
beau|beau|adjective|beautiful; handsome
sans|sans|preposition|without
mentir|mentir|verb|to lie
si|si|conjunction|if
votre|votre|determiner|your
ramage|ramage|noun|birdsong; voice
se|se|pronoun|oneself
rapporte|rapporter|verb|corresponds; relates
plumage|plumage|noun|plumage; feathers
le|le|determiner|the
phénix|phénix|noun|peerless being; paragon
des|des|determiner|of the; some
hôtes|hôte|noun|inhabitants; guests
de|de|preposition|of; from
ces|ce|determiner|these
bois|bois|noun|woods
mots|mot|noun|words
ne|ne|adverb|not
sent|sentir|verb|feels
pas|pas|adverb|not
joie|joie|noun|joy
et|et|conjunction|and
pour|pour|preposition|for; in order to
montrer|montrer|verb|to show
sa|son|determiner|his; her; its
belle|beau|adjective|beautiful
voix|voix|noun|voice
il|il|pronoun|he
ouvre|ouvrir|verb|opens
large|large|adjective|wide
laisse|laisser|verb|lets; leaves
tomber|tomber|verb|to fall
proie|proie|noun|prey; prize
s’|se|pronoun|oneself (elided form)
saisit|saisir|verb|grabs; seizes
dit|dire|verb|says
mon|mon|determiner|my
bon|bon|adjective|good
apprenez|apprendre|verb|learn
tout|tout|determiner|every; all
flatteur|flatteur|noun|flatterer
vit|vivre|verb|lives
aux|aux|determiner|to the; at the
dépens|dépens|noun|expense
celui|celui|pronoun|the one
qui|qui|pronoun|who; which
écoute|écouter|verb|listens to
cette|ce|determiner|this
leçon|leçon|noun|lesson
vaut|valoir|verb|is worth
bien|bien|adverb|well; indeed
doute|doute|noun|doubt
honteux|honteux|adjective|ashamed
confus|confus|adjective|embarrassed; confused
jura|jurer|verb|swore
mais|mais|conjunction|but
tard|tard|adverb|late
qu’|que|conjunction|that (elided form)
on|on|pronoun|one; people
y|y|pronoun|there; in it
prendrait|prendre|verb|would catch; would take
plus|plus|adverb|anymore; no longer
`.trim().split("\n").map((line) => { const [form, lemma, partOfSpeech, gloss] = line.split("|"); return [form!, { lemma: lemma!, partOfSpeech: partOfSpeech!, gloss: gloss! }]; }));

const excluded = new Set<string>();
const slug = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").replaceAll("’", "_elided").replace(/[^a-z0-9]+/gi, "_").replace(/^_|_$/g, "").toLowerCase();

export function createCorbeauLearningBundle(): ContentBundle {
  const bundle = structuredClone(lafountainFixtures);
  const manifest = prepareIngestionManifest(bundle, "wrk_corbeau_renard");
  const missing = [...new Set(manifest.candidates.map((candidate) => candidate.normalized))]
    .filter((form) => !excluded.has(form) && !specs[form]);
  if (missing.length) throw new Error(`Missing reviewed lexeme specifications: ${missing.join(", ")}`);

  const learnerCandidates = manifest.candidates.filter((candidate) => !excluded.has(candidate.normalized));
  const forms = [...new Set(learnerCandidates.map((candidate) => candidate.normalized))];
  const lemmaSpecs = new Map(forms.map((form) => [specs[form]!.lemma, specs[form]!]));
  bundle.lemmas = [...lemmaSpecs].map(([lemma, spec]) => ({ id: `lem_${slug(lemma)}`, headword: lemma, partOfSpeech: spec.partOfSpeech }));
  bundle.senses = [...lemmaSpecs].map(([lemma, spec]) => ({ id: `sns_${slug(lemma)}_primary`, lemmaId: `lem_${slug(lemma)}`, gloss: spec.gloss, definition: spec.gloss }));
  // These forms carry distinct lexical meanings in this work. Keep one surface
  // record where the spelling is identical, but assign each occurrence to the
  // correct sense so learner mastery cannot leak between meanings.
  bundle.senses = bundle.senses.filter((sense) => !["sns_tenir_primary", "sns_en_primary", "sns_que_primary"].includes(sense.id));
  bundle.senses.push(
    { id: "sns_tenir_hold", lemmaId: "lem_tenir", gloss: "hold", definition: "To have or keep something in one’s grasp or possession" },
    { id: "sns_tenir_speak", lemmaId: "lem_tenir", gloss: "address; speak", definition: "To address someone in a particular manner, especially in the expression tenir un langage" },
    { id: "sns_en_in", lemmaId: "lem_en", gloss: "in", definition: "Introduces the place or state in which something is situated" },
    { id: "sns_en_it", lemmaId: "lem_en", gloss: "it; of it", definition: "Pronoun replacing a complement introduced by de or referring back to something mentioned" },
    { id: "sns_que_exclamative", lemmaId: "lem_que", gloss: "how", definition: "Introduces an exclamation about degree or intensity" },
    { id: "sns_que_conjunction", lemmaId: "lem_que", gloss: "that", definition: "Introduces a subordinate clause" },
    { id: "sns_le_object", lemmaId: "lem_le", gloss: "him; her; it; them", definition: "Direct-object pronoun replacing one or more previously mentioned people or things" },
  );
  const lemmaHeadwords: Record<string, string> = {
    lem_du: "de + le",
    lem_des: "de + les",
    lem_aux: "à + les",
  };
  for (const lemma of bundle.lemmas) lemma.headword = lemmaHeadwords[lemma.id] ?? lemma.headword;
  bundle.lemmas.find((lemma) => lemma.id === "lem_le")!.partOfSpeech = "determiner and pronoun";
  bundle.lemmas.find((lemma) => lemma.id === "lem_en")!.partOfSpeech = "preposition and pronoun";
  const contextualSenses: Record<string, { gloss: string; definition: string }> = {
    sns_langage_primary: { gloss: "speech", definition: "Words or a manner of speaking addressed to someone" },
    sns_hote_primary: { gloss: "inhabitant", definition: "A being that inhabits a particular place" },
    sns_bois_primary: { gloss: "woods", definition: "A tract of land covered with trees" },
    sns_bien_primary: { gloss: "indeed", definition: "An adverb adding emphasis to an assertion" },
    sns_y_primary: { gloss: "that way", definition: "Pronoun referring to the situation or manner already mentioned" },
    sns_prendre_primary: { gloss: "catch; trick", definition: "To catch or deceive someone by means of a ruse" },
    sns_plus_primary: { gloss: "anymore", definition: "With ne, indicates that an action or state no longer continues" },
    sns_des_primary: { gloss: "of the", definition: "Contraction of de + les introducing a plural complement" },
    sns_du_primary: { gloss: "of the", definition: "Contraction of de + le introducing a masculine singular complement" },
    sns_aux_primary: { gloss: "at the", definition: "Contraction of à + les introducing a plural complement" },
    sns_confus_primary: { gloss: "abashed; embarrassed", definition: "Feeling ashamed and embarrassed after being exposed or corrected" },
    sns_phenix_primary: { gloss: "peerless being; paragon", definition: "A literary figurative use of the phoenix for an exceptional, incomparable being" },
  };
  for (const sense of bundle.senses) Object.assign(sense, contextualSenses[sense.id] ?? {});
  bundle.surfaceForms = forms.map((form) => ({ id: `srf_${slug(form)}`, lemmaId: `lem_${slug(specs[form]!.lemma)}`, form: manifest.candidates.find((candidate) => candidate.normalized === form)!.text, normalized: form }));
  bundle.occurrences = learnerCandidates.map((candidate) => ({
    id: `occ_${candidate.id.slice(4)}`, workId: candidate.workId, unitId: candidate.unitId,
    surfaceFormId: `srf_${slug(candidate.normalized)}`, senseId: `sns_${slug(specs[candidate.normalized]!.lemma)}_primary`,
    start: candidate.start, end: candidate.end,
  }));
  for (const occurrence of bundle.occurrences) {
    if (occurrence.surfaceFormId === "srf_tenait") occurrence.senseId = "sns_tenir_hold";
    if (occurrence.surfaceFormId === "srf_tint") occurrence.senseId = "sns_tenir_speak";
    if (occurrence.surfaceFormId === "srf_en") occurrence.senseId = occurrence.unitId === "unt_corbeau_01" ? "sns_en_in" : "sns_en_it";
    if (occurrence.surfaceFormId === "srf_que") occurrence.senseId = ["unt_corbeau_04", "unt_corbeau_05"].includes(occurrence.unitId) ? "sns_que_exclamative" : "sns_que_conjunction";
    if (occurrence.surfaceFormId === "srf_qu_elided") occurrence.senseId = "sns_que_conjunction";
    if (occurrence.surfaceFormId === "srf_l_elided" && occurrence.unitId === "unt_corbeau_09") occurrence.senseId = "sns_le_object";
  }
  bundle.exclusions = manifest.candidates.filter((candidate) => excluded.has(candidate.normalized)).map((candidate) => ({
    id: `exc_${candidate.id.slice(4)}`, workId: candidate.workId, unitId: candidate.unitId,
    start: candidate.start, end: candidate.end, text: candidate.text, reason: "proper_noun" as const,
  }));
  bundle.expressions = [
    { id: "exp_a_peu_pres", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_02", text: "à peu près", gloss: "approximately" },
    { id: "exp_sans_mentir", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_06", text: "Sans mentir", gloss: "truthfully; without lying" },
    { id: "exp_aux_depens_de", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_09", text: "aux dépens de", gloss: "at the expense of" },
    { id: "exp_sans_doute", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_10", text: "sans doute", gloss: "without doubt; certainly" },
    { id: "exp_ne_plus", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_11", text: "ne … plus", gloss: "no longer; not anymore" },
  ];
  bundle.quizItems = structuredClone(compactQuizItems([...corbeauQuizBatch01, ...corbeauQuizBatch02, ...corbeauQuizBatch03, ...corbeauQuizBatch04, ...corbeauQuizBatch05, ...corbeauQuizBatch06, ...corbeauQuizBatch07, ...corbeauQuizBatch08, ...corbeauQuizBatch09, ...corbeauQuizBatch10, ...corbeauQuizBatch11, ...corbeauQuizBatch12, ...corbeauQuizBatch13, ...corbeauQuizBatch14, ...corbeauQuizBatch15, ...corbeauQuizBatch16, ...corbeauQuizBatch17, ...corbeauQuizBatch18, ...corbeauQuizBatch19, ...corbeauQuizBatch20, ...corbeauQuizBatch21, ...corbeauQuizBatch22, ...corbeauQuizBatch23, ...corbeauQuizBatch24, ...corbeauQuizBatch25, ...corbeauQuizBatch26, ...corbeauQuizBatch27, ...corbeauQuizBatch28, ...corbeauQuizBatch29, ...corbeauQuizBatch30, ...corbeauQuizBatch31, ...corbeauQuizBatch32, ...corbeauQuizBatch33, ...corbeauQuizBatch34]));
  bundle.works.find((work) => work.id === "wrk_corbeau_renard")!.publicationState = "learning_ready";
  bundle.readiness.find((item) => item.workId === "wrk_corbeau_renard")!.occurrencesReviewed = true;
  bundle.readiness.find((item) => item.workId === "wrk_corbeau_renard")!.unresolvedLearnerTokens = [];
  return bundle;
}

export const corbeauLearningBundle = createCorbeauLearningBundle();
