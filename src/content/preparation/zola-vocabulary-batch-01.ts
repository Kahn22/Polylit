import type { ZolaVocabularySpec } from "./zola-authoring.js";

const nounEnglish: [string, string, string] = ["a window", "a spoon", "a garden"];
const nounFrench: [string, string, string] = ["fenêtre", "cuillère", "jardin"];
const verbEnglish: [string, string, string] = ["to whistle", "to sew", "to float"];
const verbFrench: [string, string, string] = ["siffler", "coudre", "flotter"];
const adjectiveEnglish: [string, string, string] = ["blue", "circular", "edible"];
const adjectiveFrench: [string, string, string] = ["bleu", "circulaire", "comestible"];

export const zolaVocabularyBatch01: ZolaVocabularySpec[] = [
  { normalized: "a", lemmaKey: "avoir", headword: "avoir", partOfSpeech: "verb", senseKey: "avoir_possess_auxiliary", gloss: "to have; auxiliary avoir", quizMeaning: "has", definition: "posséder ou servir d’auxiliaire", englishDistractors: ["whistles", "sews", "floats"], frenchDistractors: ["siffle", "coud", "flotte"] },
  { normalized: "abominable", lemmaKey: "abominable", headword: "abominable", partOfSpeech: "adjective", senseKey: "abominable", gloss: "abominable; appalling", definition: "qui inspire une très forte réprobation", englishDistractors: adjectiveEnglish, frenchDistractors: ["bleue", "circulaire", "comestible"] },
  { normalized: "abomination", lemmaKey: "abomination", headword: "abomination", partOfSpeech: "noun", senseKey: "abomination", gloss: "abomination; atrocity", definition: "chose extrêmement odieuse", englishDistractors: nounEnglish, frenchDistractors: nounFrench },
  { normalized: "abord", lemmaKey: "abord", headword: "abord", partOfSpeech: "adverbial noun", senseKey: "d_abord", gloss: "first; at first", definition: "en premier lieu", englishDistractors: ["softly", "outside", "backwards"], frenchDistractors: ["doucement", "dehors", "à reculons"] },
  { normalized: "abouti", lemmaKey: "aboutir", headword: "aboutir", partOfSpeech: "verb", senseKey: "aboutir_result", gloss: "resulted; led", definition: "a conduit à un résultat", englishDistractors: verbEnglish, frenchDistractors: verbFrench },
  { normalized: "abrège", lemmaKey: "abreger", headword: "abréger", partOfSpeech: "verb", senseKey: "abreger_shorten", gloss: "I shorten; I summarize", definition: "je rends le récit plus court", englishDistractors: ["I whistle", "I sew", "I float"], frenchDistractors: ["je siffle", "je couds", "je flotte"] },
  { normalized: "abritant", lemmaKey: "abriter", headword: "abriter", partOfSpeech: "verb", senseKey: "abriter_shelter", gloss: "sheltering; hiding behind", definition: "se protégeant derrière quelque chose", englishDistractors: ["whistling", "sewing", "floating"], frenchDistractors: ["sifflant", "cousant", "flottant"] },
  { normalized: "absence", lemmaKey: "absence", headword: "absence", partOfSpeech: "noun", senseKey: "absence", gloss: "absence; lack", definition: "fait de ne pas être présent ou de manquer", englishDistractors: nounEnglish, frenchDistractors: ["fenêtre", "cuillère", "prairie"] },
  { normalized: "absolu", lemmaKey: "absolu", headword: "absolu", partOfSpeech: "adjective", senseKey: "absolu_complete", gloss: "absolute; complete", definition: "total, sans restriction", englishDistractors: adjectiveEnglish, frenchDistractors: adjectiveFrench },
  { normalized: "absolue", lemmaKey: "absolu", headword: "absolu", partOfSpeech: "adjective", senseKey: "absolu_complete", gloss: "absolute; complete", definition: "total, sans restriction", englishDistractors: adjectiveEnglish, frenchDistractors: ["bleue", "circulaire", "comestible"] },
  { normalized: "accablante", lemmaKey: "accablant", headword: "accablant", partOfSpeech: "adjective", senseKey: "accablant_damning", gloss: "damning; overwhelming", definition: "qui apporte une preuve écrasante", englishDistractors: adjectiveEnglish, frenchDistractors: ["bleue", "circulaire", "comestible"] },
  { normalized: "accablantes", lemmaKey: "accablant", headword: "accablant", partOfSpeech: "adjective", senseKey: "accablant_damning", gloss: "damning; overwhelming", definition: "qui apporte une preuve écrasante", englishDistractors: adjectiveEnglish, frenchDistractors: ["bleues", "circulaires", "comestibles"] },
  { normalized: "accabler", lemmaKey: "accabler", headword: "accabler", partOfSpeech: "verb", senseKey: "accabler_incriminate", gloss: "to overwhelm; to incriminate", definition: "charger quelqu’un d’éléments qui l’accusent", englishDistractors: verbEnglish, frenchDistractors: verbFrench },
  { normalized: "acclamations", lemmaKey: "acclamation", headword: "acclamation", partOfSpeech: "noun", senseKey: "acclamation_cheers", gloss: "acclamations; cheers", definition: "manifestations collectives et enthousiastes d’approbation", englishDistractors: ["windows", "spoons", "gardens"], frenchDistractors: ["fenêtres", "cuillères", "jardins"] },
];
