import type { ZolaVocabularySpec } from "./zola-authoring.js";

/** Pièce is reviewed as room in one context and document/evidence elsewhere. */
export const zolaVocabularyBatch39: ZolaVocabularySpec[] = [
  {
    normalized: "pièce", candidateIds: ["tok_cc3ccb93a12af1be0e93afbd"],
    lemmaKey: "piece", headword: "pièce", partOfSpeech: "noun", senseKey: "piece_room",
    gloss: "room", quizMeaning: "room", definition: "espace intérieur délimité dans un bâtiment",
    englishDistractors: ["document", "verdict", "letter"], frenchDistractors: ["document", "verdict", "lettre"],
  },
  {
    normalized: "pièce", candidateIds: [
      "tok_8e1085d3d0a1a5f85ec7c342", "tok_467a464dad5137c75909c38e", "tok_a2965c2dd3ffac6917ba1347",
      "tok_36b3ba6e6930e7e7d9f29b39", "tok_d3278efc1f5c528c44714b3f", "tok_bf864ea5e801127970875b53",
      "tok_f0194e0f5d20804aac4218d4", "tok_e7e288d318e17868dac022b1",
    ],
    lemmaKey: "piece", headword: "pièce", partOfSpeech: "noun", senseKey: "piece_document",
    gloss: "document; piece of evidence", quizMeaning: "document; piece of evidence",
    definition: "document ou élément matériel présenté comme preuve dans une affaire",
    englishDistractors: ["room", "speech", "punishment"], frenchDistractors: ["salle", "discours", "châtiment"],
  },
];
