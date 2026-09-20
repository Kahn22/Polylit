import type { ZolaVocabularySpec } from "./zola-authoring.js";

const noun = (normalized: string, lemmaKey: string, ids: readonly string[], gloss: string, definition: string, distractors: [string, string, string]): ZolaVocabularySpec => ({
  normalized, candidateIds: ids, lemmaKey, headword: normalized, partOfSpeech: "noun", senseKey: `${lemmaKey}_primary`, gloss, quizMeaning: gloss, definition,
  englishDistractors: distractors, frenchDistractors: ["lampe", "rivière", "chaise"],
});
const adjective = (normalized: string, ids: readonly string[], gloss: string, definition: string): ZolaVocabularySpec => ({
  normalized, candidateIds: ids, lemmaKey: normalized, headword: normalized, partOfSpeech: "adjective", senseKey: `${normalized}_primary`, gloss, quizMeaning: gloss, definition,
  englishDistractors: ["complex", "false", "distant"], frenchDistractors: ["complexe", "fausse", "lointain"],
});

export const zolaVocabularyBatch43: ZolaVocabularySpec[] = [
  noun("procès", "proces", ["tok_02dc9d196d14da33b6c86eec", "tok_57f48679831f6d26619b93b7", "tok_3e3e590fae6f0939f7f2c606", "tok_d37803baa787657ede4c736f", "tok_d396dd1b401bb12e9f62f3f9", "tok_84ae6acbd122f2c2deb71eb4", "tok_2c68de17ecf39033ba4fd5de"], "trial; legal proceedings", "procédure judiciaire dans laquelle une affaire est examinée", ["appeal", "sentence", "evidence"]),
  noun("sous", "sous", ["tok_76499c67141fcab8b54a1aa3", "tok_0d8d6c7ce94a92aa56727b58", "tok_e1f52a8eabe0f8c3e7fa4d54", "tok_8b82be5208da1a707d672b51", "tok_dd984a6b0b62ebb65ad776d0", "tok_47aa38b073135ae3ecc0d8d3"], "under; beneath", "introduit une position inférieure ou une circonstance qui pèse sur une action", ["over", "beside", "between"]),
  adjective("premier", ["tok_1e5aa465751e36e25dc0a9ff", "tok_12431f5065f9b195a178ea3c", "tok_e253870f9fe0728a8804e74d", "tok_3bacaec02c246c840a7fb94d", "tok_d3ed368fa3dfaf00250cb800"], "first", "qui vient avant les autres dans un ordre"),
  noun("supérieurs", "superieur", ["tok_e67ef426cbdf4691ca9f3b15", "tok_c0ecf92f5c853dd8f0e92364", "tok_c2bfd8d30f27a4df137e149c", "tok_78bfcfa8d4d687cee133a2e8"], "superiors", "personnes placées plus haut dans une hiérarchie" , ["subordinates", "witnesses", "neighbors"]),
  noun("presse", "presse", ["tok_8ad050104fe10c0812b14c40", "tok_9c5bdcaf7389a757ec874504", "tok_10ea826d5047355629b23bb0", "tok_247411be6d195fbf4fa5b3c9"], "press; newspapers", "ensemble des journaux et autres médias qui diffusent des informations", ["army", "court", "border"]),
  noun("triomphe", "triomphe", ["tok_82dfc9bec4f359dce9a41526", "tok_2a42e5aea6d2d3026d27d082", "tok_8c8c5c24c154e79e26a3cbbb"], "triumph", "victoire éclatante ou réussite solennelle", ["defeat", "silence", "doubt"]),
  noun("siècle", "siecle", ["tok_0b8d8b6fd8f015e9d28dc8bb", "tok_bc48c065fe9b02dbdb8ba83f", "tok_b68f682c2a2514cbe9e5de99"], "century", "période de cent années", ["decade", "month", "generation"]),
  adjective("simple", ["tok_fcde94ce94d799d63b0da860", "tok_21a9f51f38aff62983965c15", "tok_9f2446e5ba36e33bfc968dcc"], "simple", "qui n’est pas compliqué ou qui est présenté sans détour"),
  noun("preuves", "preuve", ["tok_6d25b5b134906bcdd9fede41", "tok_a1067c839825f15de2c8212a", "tok_cd8069abb39497954508ad0c"], "evidence; proofs", "éléments qui servent à établir la réalité d’un fait", ["rumors", "questions", "orders"]),
  noun("traître", "traitre", ["tok_72c622e1ca281b4897980358", "tok_c0b7c4ca8cf47a1e80d6d865", "tok_14e7eede247b2826be59db88"], "traitor", "personne qui trahit son pays, son groupe ou une confiance", ["ally", "judge", "victim"]),
  adjective("possible", ["tok_b0a21fb66ea6e1e7eaf4e0ed", "tok_e2134b87012e7e11a4b3e128", "tok_6cde419a5f18f579d74a27ac"], "possible", "qui peut se produire ou être réalisé"),
  adjective("sainte", ["tok_634ad7a34ce43b9cac60393f", "tok_3b4a5e3a3adab64a0704f9fd", "tok_0570af59afc7d6b7844c4cee"], "holy; sacred", "qui est considéré comme sacré ou digne d’un respect religieux"),
];
