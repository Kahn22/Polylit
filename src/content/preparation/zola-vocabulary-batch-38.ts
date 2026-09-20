import type { ZolaVocabularySpec } from "./zola-authoring.js";

const candidateIds = [
  "tok_0b720d476363697ffc61c26e", "tok_cffcb90f490ccdc1151f87c7", "tok_a6a779f6c720bd7c6af34c66",
  "tok_13c4087569a12ab9d0e9d1ac", "tok_62775605e39a26756062423b", "tok_dc5914c0749d8a6b9e60d1af",
  "tok_b414d3747f52dec69895c53f", "tok_00ca6c90fcdd7c12e9557e99", "tok_5526b814e24c2e60bf91007d",
  "tok_156475d9f54f2adbfade9149", "tok_9bb7e45c04abd089faa895f4", "tok_a846e74aa139234bcf8fcb08",
  "tok_8e327306e1794d58254d42ba", "tok_91982909f8373dcf25d0578f", "tok_ea2c917370371b96f30a76d2",
  "tok_bfcca76c9ff5b51eba91dc9e", "tok_249b3d8ebdf6b3660f440b7c", "tok_5715ddb891e465703bb9d1c1",
] as const;

export const zolaVocabularyBatch38: ZolaVocabularySpec[] = [{
  normalized: "vérité", candidateIds, lemmaKey: "verite", headword: "vérité", partOfSpeech: "noun",
  senseKey: "verite_truth", gloss: "truth", quizMeaning: "truth",
  definition: "ce qui est conforme aux faits et à la réalité",
  englishDistractors: ["justice", "rumor", "silence"], frenchDistractors: ["justice", "rumeur", "silence"],
}];
