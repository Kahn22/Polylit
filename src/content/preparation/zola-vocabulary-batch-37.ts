import type { ZolaVocabularySpec } from "./zola-authoring.js";

const nounEnglish: [string, string, string] = ["a telescope", "a turnip", "a cushion"];
const nounFrench: [string, string, string] = ["télescope", "navet", "coussin"];
const determinerEnglish: [string, string, string] = ["the book", "the lantern", "the bridge"];
const determinerFrench: [string, string, string] = ["le livre", "la lanterne", "le pont"];
const verbEnglish: [string, string, string] = ["to knit", "to paddle", "to sneeze"];
const verbFrench: [string, string, string] = ["tricoter", "pagayer", "éternuer"];

const desDeLes = [
  "tok_46c5c633e3e2eb6ba8d49567", "tok_3b3befe3509ff47d5aacdbbd", "tok_acf5a01be305b7783406354a",
  "tok_82989ebe1b1e9e4c7cdff5f3", "tok_a5b342d2829a65254047ffc5", "tok_dfe796c02377639b5ed3cba7",
  "tok_538c69b12bbe56744f72785f", "tok_e872caebfdd598b2630ddf1e", "tok_186a10c9c7f187e8506eca03",
  "tok_e0062a41076e6e50e488916e", "tok_9cf03c7f08ba62f580429dae", "tok_601c521b38d2f7ed8b40b0c9",
  "tok_6ae43013cf05809150a6268e", "tok_a718836195fe4ba69ba2ac00", "tok_39314fe9f72bd2a024e70a16",
  "tok_eafd3953416074ef134685ca", "tok_6f95116119633da944c91c4b", "tok_4daa46baf80e995d32775ec7",
  "tok_9ca546f52c4b31a0a2392ff1", "tok_34822722afb62df698ee02dc", "tok_5a621246297709c8d9f963de",
  "tok_ecc5ad4b6244bbf4f3a0da61", "tok_388448e013f023527e882115", "tok_75e81beb75589e58406c7c49",
  "tok_da70d45de16fcc65413b6107",
] as const;

const desIndefinite = [
  "tok_df221d2590c34b304adf302d", "tok_553729d15620c51cdc73b519", "tok_137854d7a78e6320b579b033",
  "tok_2891db986d7f0b3eacd9b726", "tok_e460449e6719383b9203c7e9", "tok_474f86d76df2bd11eb727208",
  "tok_36decdf7ad97e46ef7ea3f6f", "tok_2280ea30b92dbe1d8f16e291", "tok_6987bf68235430ebf4741333",
  "tok_47b19ca3c9cb2eee3f636558", "tok_760eb2d447a2c26a444c7aea", "tok_1cd16dd6528ec285d99badad",
  "tok_6c26fa6ec88a30e7258abf10", "tok_3fa565ab8a4880ab7717cba1", "tok_e585a0e23491325a6887c1d7",
  "tok_cbfd29e5e59f321b0e145f03", "tok_996ec880028a27abbc795bfe", "tok_b47adddfec66071612995a23",
  "tok_47ef97259604aeebb7420535", "tok_fc5b33799114e34684c13a04", "tok_14450a63bcfa23a1ee9a130c",
  "tok_22f99e5b971e3cd85c11afb4", "tok_adce62253f3f534e8c28ec2f", "tok_23b99defd9703f6bcaa2f630",
] as const;

const enPronoun = [
  "tok_46e3e46f62d4b387785a692e", "tok_05eebf9a4b732349e8c1d62c", "tok_a582c6858523999eadac3d49",
  "tok_6382d3302f6c60e3227557cd", "tok_e2f5f1ee4b81de531c696d64", "tok_fa252eed126cef7f66304b63",
  "tok_0aa8e903b87536cc15e7bc16",
] as const;

const enPreposition = [
  "tok_9ec57539a95165a6d85ffaca", "tok_930001abb1b54a5708500e0e", "tok_1565509d663aeb3aa54aa615",
  "tok_46d4b0db96f006922897494d", "tok_7cf0a21c5060ab6c6be6efaf", "tok_08a503bf9e8141af754cffa5",
  "tok_4a0967b94d2b4a1052f8b5fe", "tok_f1e52dbeb76dccba7cb31718", "tok_0ce35dd6ff820d4fcc9214f3",
  "tok_59cd9c4b49008b939673d7fe", "tok_9b88bd944e6a5a8b1bc0224d", "tok_162274f5e237af0c2a968757",
  "tok_5f431701bd38d54b8785700e", "tok_2de06ca212b75ba9c8f5d2e7", "tok_4fb123f81acf96ba1e48b1e7",
  "tok_6400b05b1ecd007829967b71", "tok_67d47bba6bd32479cbda252f", "tok_519bf534e8cd44d37fc1aabb",
] as const;

const enGerund = [
  "tok_9055a66702bc40a549e76f6d", "tok_77bb3524c41a114beb1fe7a5", "tok_a545f5ef5f48dc0db0d94065",
  "tok_ac01976d7c7f77e2e889be4c", "tok_dd6a6cdd8e8cb9cb6981e30f", "tok_22b1f26625544586f14ae46d",
  "tok_888a2dd8b3f9fb63fd287a57", "tok_01f253b092f32388f41a1c0c", "tok_0a59ff5258250ee7f53e357b",
  "tok_564563a38f93fd95b1f6d070", "tok_b28c69cb46897093c6b1afb3", "tok_d826dd49673e460bbecf56dc",
] as const;

const espritMind = [
  "tok_27802591356bc8283dd881dd", "tok_8b5680344f60366acc471897", "tok_7f9778211f6afd030f004dc2",
] as const;
const espritGroup = ["tok_570dbf7ebb4fa5d454c2c058", "tok_172b733489838b11496e0bee"] as const;
const espritSupernatural = ["tok_5706195e2457d0e2a47a9027", "tok_c09a4da91d5496a23270f6d7"] as const;

export const zolaVocabularyBatch37: ZolaVocabularySpec[] = [
  { normalized: "c’", lemmaKey: "ce", existingLemmaId: "lem_ce", existingSenseId: "sns_ce_primary", headword: "ce", partOfSpeech: "determiner", senseKey: "ce_primary", gloss: "this; that", quizMeaning: "it is; this is", definition: "déterminant ou pronom démonstratif qui désigne une personne, une chose ou une situation", englishDistractors: determinerEnglish, frenchDistractors: determinerFrench },
  { normalized: "ce", lemmaKey: "ce", existingLemmaId: "lem_ce", existingSenseId: "sns_ce_primary", headword: "ce", partOfSpeech: "determiner", senseKey: "ce_primary", gloss: "this; that", definition: "déterminant ou pronom démonstratif qui désigne une personne, une chose ou une situation", englishDistractors: determinerEnglish, frenchDistractors: determinerFrench },
  { normalized: "des", candidateIds: desDeLes, lemmaKey: "des", existingLemmaId: "lem_des", existingSenseId: "sns_des_primary", headword: "de + les", partOfSpeech: "determiner", senseKey: "des_primary", gloss: "of the", definition: "Contraction de de + les introduisant un complément pluriel", englishDistractors: ["some", "toward the", "without the"], frenchDistractors: ["quelques", "vers les", "sans les"] },
  { normalized: "des", candidateIds: desIndefinite, lemmaKey: "des_indefinite", headword: "des", partOfSpeech: "determiner", senseKey: "des_indefinite_some", gloss: "some", definition: "déterminant indéfini pluriel indiquant une quantité non précisée", englishDistractors: ["of the", "toward the", "without the"], frenchDistractors: ["de", "vers les", "sans les"] },
  { normalized: "diable", candidateIds: ["tok_c9d3944f0043508423413b62"], lemmaKey: "diable", headword: "diable", partOfSpeech: "noun", senseKey: "diable_devil", gloss: "devil", definition: "figure surnaturelle personnifiant le mal dans la tradition chrétienne", englishDistractors: nounEnglish, frenchDistractors: ["horloge", "moulin", "bateau"] },
  { normalized: "dieu", candidateIds: ["tok_3f56d07d6cb47ad4c68d35ed", "tok_a61a5eacd27dcd67f9b116a1", "tok_345a3abd7e29ce21728a0545"], lemmaKey: "dieu", headword: "dieu", partOfSpeech: "noun", senseKey: "dieu_deity", gloss: "God; deity", definition: "être divin ou puissance surnaturelle faisant l’objet d’un culte", englishDistractors: nounEnglish, frenchDistractors: ["horloge", "moulin", "bateau"] },
  { normalized: "en", candidateIds: enPronoun, lemmaKey: "en", existingLemmaId: "lem_en", existingSenseId: "sns_en_it", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_it", gloss: "it; of it", quizMeaning: "of it; of them", definition: "Pronoun replacing a complement introduced by de or referring back to something mentioned", englishDistractors: ["in", "toward", "without"], frenchDistractors: ["dans", "vers", "sans"] },
  { normalized: "en", candidateIds: enPreposition, lemmaKey: "en", existingLemmaId: "lem_en", existingSenseId: "sns_en_in", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_in", gloss: "in", quizMeaning: "in; into", definition: "Introduces the place or state in which something is situated", englishDistractors: ["of it", "despite", "without"], frenchDistractors: ["de cela", "malgré", "sans"] },
  { normalized: "en", candidateIds: enGerund, lemmaKey: "en", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_gerund", gloss: "while; by", definition: "introduit un gérondif et indique la manière, le moyen ou la simultanéité", englishDistractors: ["because", "despite", "before"], frenchDistractors: ["parce que", "malgré", "avant"] },
  { normalized: "en", candidateIds: ["tok_5a9d0810c21c613df6f757a4"], lemmaKey: "en", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_outre", gloss: "moreover; in addition", definition: "dans « en outre », ajoute un élément au raisonnement", englishDistractors: ["yesterday", "outside", "silently"], frenchDistractors: ["hier", "dehors", "silencieusement"] },
  { normalized: "en", candidateIds: ["tok_f8b01402d1a9aa83762b13c4"], lemmaKey: "en", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_doute", gloss: "in doubt", definition: "dans « mettre en doute », indique que quelque chose est considéré comme incertain", englishDistractors: ["in the garden", "on the table", "under the bridge"], frenchDistractors: ["dans le jardin", "sur la table", "sous le pont"] },
  { normalized: "en", candidateIds: ["tok_2e0e086a15b7f11cba14a366"], lemmaKey: "en", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_gros", gloss: "roughly; broadly", definition: "dans « en gros », présente une idée sans entrer dans les détails", englishDistractors: ["at midnight", "underwater", "carefully"], frenchDistractors: ["à minuit", "sous l’eau", "soigneusement"] },
  { normalized: "en", candidateIds: ["tok_62b5574f335277d0fa0d3508"], lemmaKey: "en", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_situation", gloss: "there; in that state", definition: "pronom adverbial renvoyant à une situation déjà évoquée", englishDistractors: ["nearby", "upstairs", "tomorrow"], frenchDistractors: ["à côté", "à l’étage", "demain"] },
  { normalized: "en", candidateIds: ["tok_2aa3cd40728046fd9d83d147"], lemmaKey: "en", headword: "en", partOfSpeech: "preposition and pronoun", senseKey: "en_neanmoins", gloss: "nevertheless; nonetheless", definition: "dans « n’en ... pas moins », marque qu’un fait reste vrai malgré ce qui précède", englishDistractors: ["immediately", "upstairs", "silently"], frenchDistractors: ["immédiatement", "à l’étage", "silencieusement"] },
  { normalized: "esprit", candidateIds: espritMind, lemmaKey: "esprit", headword: "esprit", partOfSpeech: "noun", senseKey: "esprit_mind", gloss: "mind; mentality", definition: "faculté de penser ou manière de considérer les choses", englishDistractors: nounEnglish, frenchDistractors: ["jardins", "navires", "clochers"] },
  { normalized: "esprit", candidateIds: espritGroup, lemmaKey: "esprit", headword: "esprit", partOfSpeech: "noun", senseKey: "esprit_group", gloss: "spirit; group ethos", definition: "manière de penser propre à un groupe ou à un corps constitué", englishDistractors: nounEnglish, frenchDistractors: ["jardins", "navires", "clochers"] },
  { normalized: "esprits", candidateIds: espritSupernatural, lemmaKey: "esprit", headword: "esprit", partOfSpeech: "noun", senseKey: "esprit_supernatural", gloss: "spirits; supernatural beings", quizMeaning: "spirits", definition: "êtres immatériels ou puissances invisibles présentés comme agissants", englishDistractors: ["telescopes", "turnips", "cushions"], frenchDistractors: ["télescopes", "navets", "coussins"] },
  { normalized: "esprits", candidateIds: ["tok_46b1ede5cd8b85f45e059485"], lemmaKey: "esprit", headword: "esprit", partOfSpeech: "noun", senseKey: "esprit_mind", gloss: "mind; mentality", quizMeaning: "minds", definition: "faculté de penser ou manière de considérer les choses", englishDistractors: ["telescopes", "turnips", "cushions"], frenchDistractors: ["télescopes", "navets", "coussins"] },
];
