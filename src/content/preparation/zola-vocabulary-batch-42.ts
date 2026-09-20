import type { ZolaVocabularySpec } from "./zola-authoring.js";

export const zolaVocabularyBatch42: ZolaVocabularySpec[] = [
  {
    normalized: "puis", candidateIds: [
      "tok_7b495fb92c08a55b8e249087", "tok_f23c194999cb61dcf54e01f1", "tok_a04a66fc4d516e6c115aa5dc",
      "tok_afd5180a56678151022b73f8", "tok_9559e977ddcc2030805ca246", "tok_352380aebd839b9423d1ad2a",
      "tok_9373b7c02c05e4c172352c1d", "tok_6c5b1cdc92bddb5c96253fd7",
    ],
    lemmaKey: "puis", headword: "puis", partOfSpeech: "adverb", senseKey: "puis_then", gloss: "then", quizMeaning: "then",
    definition: "indique qu’une action ou un fait vient après un autre",
    englishDistractors: ["before", "never", "perhaps"], frenchDistractors: ["avant", "jamais", "peut-être"],
  },
  {
    normalized: "pu", candidateIds: [
      "tok_77ef9e917bc2ccb861a88c82", "tok_2c27f86dea09cb9e4c000bfb", "tok_37462bb63cdcd469ba7af435",
      "tok_01586de6e01c173dbf83ea0d", "tok_4c4ac041fca5982df1d11cf6", "tok_ff20846b15b19181aeea5920",
      "tok_24cfc3b16ed795777c282418", "tok_4c7378c42d5e0618a514eeb9",
    ],
    lemmaKey: "pouvoir", headword: "pouvoir", partOfSpeech: "verb", senseKey: "pouvoir_past_ability", gloss: "could; was able to", quizMeaning: "could; was able to",
    definition: "forme du verbe pouvoir indiquant une possibilité ou une capacité passée",
    englishDistractors: ["must have", "wanted to", "would leave"], frenchDistractors: ["devait", "voulait", "partirait"],
  },
];
