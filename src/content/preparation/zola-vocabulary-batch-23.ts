import type { ZolaVocabularySpec } from "./zola-authoring.js";

const causative = {
  lemmaKey: "faire",
  existingLemmaId: "lem_faire",
  existingSenseId: "sns_faire_causative",
  headword: "faire",
  partOfSpeech: "verb",
  senseKey: "faire_causative",
  gloss: "to make; cause",
  definition: "faire accomplir une action ou provoquer un résultat",
} as const;

const completed = {
  lemmaKey: "faire",
  existingLemmaId: "lem_faire",
  existingSenseId: "sns_faire_done",
  headword: "faire",
  partOfSpeech: "verb",
  senseKey: "faire_done",
  gloss: "to do; make",
  definition: "accomplir ou produire quelque chose",
} as const;

const primary = {
  lemmaKey: "faire",
  existingLemmaId: "lem_faire",
  existingSenseId: "sns_faire_primary",
  headword: "faire",
  partOfSpeech: "verb",
  senseKey: "faire_primary",
  gloss: "to do; make",
  definition: "accomplir, produire ou former quelque chose",
} as const;

export const zolaVocabularyBatch23: ZolaVocabularySpec[] = [
 {normalized:"faisaient",...causative,quizMeaning:"were making; were causing",englishDistractors:["were weaving","were diving","were snoring"],frenchDistractors:["tissaient","plongeaient","ronflaient"]},
 {normalized:"faisait",...causative,quizMeaning:"was making; was causing",englishDistractors:["was weaving","was diving","was snoring"],frenchDistractors:["tissait","plongeait","ronflait"]},
 {normalized:"faite",...completed,quizMeaning:"done; made",englishDistractors:["woven","dived","snored"],frenchDistractors:["tissée","plongée","ronflée"]},
 {normalized:"fasse",...completed,quizMeaning:"be done; be made",englishDistractors:["be woven","be dived","be snored"],frenchDistractors:["tisse","plonge","ronfle"]},
 {normalized:"ferai",...primary,quizMeaning:"will do; will make",englishDistractors:["will weave","will dive","will snore"],frenchDistractors:["tisserai","plongerai","ronflerai"]},
 {normalized:"fit",...completed,quizMeaning:"was made; formed",englishDistractors:["woven","dived","snored"],frenchDistractors:["tissa","plongea","ronfla"]},
 {normalized:"font",...primary,quizMeaning:"make; form",englishDistractors:["weave","dive","snore"],frenchDistractors:["tissent","plongent","ronflent"]},
];
