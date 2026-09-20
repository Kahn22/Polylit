import type { ZolaVocabularySpec } from "./zola-authoring.js";

const spec = (
  senseKey: string, ids: readonly string[], gloss: string, definition: string,
): ZolaVocabularySpec => ({
  normalized: "plus", candidateIds: ids, lemmaKey: "plus", existingLemmaId: "lem_plus",
  headword: "plus", partOfSpeech: "adverb", senseKey, gloss, quizMeaning: gloss,
  definition, englishDistractors: ["less", "already", "never"], frenchDistractors: ["moins", "déjà", "jamais"],
});

export const zolaVocabularyBatch41: ZolaVocabularySpec[] = [
  // Comparative “more” and superlative “most” are one degree meaning;
  // the surrounding adjective/article supplies the grammatical contrast.
  spec("plus_degree", [
    "tok_5f7bf35ef26367e7d592e4a7", "tok_beb288e312eb42d2207c288b", "tok_53cda151c825dad2fba68354",
    "tok_bd634d44f0cbfbd0c0e55974", "tok_140bd4a6fa648f1790e057b2", "tok_dd0c2ea92f13c19081af8e72",
    "tok_08cf0753324686645cdeb552", "tok_85ffedaac37efd2a7f71de55", "tok_0b50845e73ec367ba3033238",
    "tok_a44365c685da6c7e2d435d90", "tok_546cfceb3f693f81b89630be", "tok_1b9f739d79364acb226ab9bd",
    "tok_cec9dacaf701483972237aa0", "tok_a9e3600e5e35c760ac27958a", "tok_43c2d4273b1534f6b9981bd3",
    "tok_35f91a576b24eb927561d3b1", "tok_c25af7d03107167f273ceb7c", "tok_1b93cc345cd7f65ab843aa2d",
    "tok_2a243edc2ddd28aa74ae230a", "tok_7a15b5de07285bed67000d28", "tok_d5c47daab47fde308a80ab48",
  ], "more; most", "indique un degré supérieur ou maximal dans une comparaison"),
  spec("plus_later", [
    "tok_8c95df985065169236e89657", "tok_019e2c70ecb4b222f4580bd5", "tok_850c4aca22a908646bacd6da",
    "tok_9389fe8cbaf3e03be40bc737", "tok_ab35f7f61238747a715eb582",
  ], "later", "indique un moment ultérieur"),
  spec("plus_farther", [
    "tok_0f94777a981e08c391015a65", "tok_a24b966b92cf9d8dc5be27bb",
  ], "farther", "indique une distance croissante"),
  spec("plus_at_most", ["tok_615c149c3675521810517d3a"], "at most", "indique une limite supérieure"),
  spec("plus_additional", ["tok_7fdd5b8de6cabd95de25cab9"], "more; additional", "ajoute un élément de même nature"),
  spec("plus_all_the_more", ["tok_f700e3e7a7d5ff7457428809"], "all the more", "renforce un degré en corrélation avec ce qui suit"),
];
