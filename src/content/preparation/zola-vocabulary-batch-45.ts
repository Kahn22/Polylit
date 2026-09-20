import type { ZolaVocabularySpec } from "./zola-authoring.js";

type Kind = "noun" | "adjective" | "verb" | "adverb" | "conjunction" | "numeral";
const make = (normalized: string, lemmaKey: string, ids: readonly string[], kind: Kind, senseKey: string, gloss: string, definition: string, headword = normalized): ZolaVocabularySpec => ({
  normalized, candidateIds: ids, lemmaKey, headword, partOfSpeech: kind, senseKey, gloss, quizMeaning: gloss, definition,
  englishDistractors: kind === "verb" ? ["to hide", "to forget", "to refuse"] : kind === "adjective" ? ["false", "distant", "complicated"] : ["silence", "window", "journey"],
  frenchDistractors: kind === "verb" ? ["cacher", "oublier", "refuser"] : kind === "adjective" ? ["fausse", "lointaine", "compliquée"] : ["silence", "fenêtre", "voyage"],
});

export const zolaVocabularyBatch45: ZolaVocabularySpec[] = [
  make("voulu", "vouloir", ["tok_50f932f046822cde4d9adea5", "tok_021c20fe0d5ae0097c2adb84", "tok_d85d2b4dd97161717b07081e", "tok_74ab6d78768b4214b65e1717"], "verb", "vouloir_past", "wanted", "participe passé de vouloir, indiquant une intention ou une volonté passée", "vouloir"),
  make("seulement", "seulement", ["tok_dd740a51002b0e5143cd048c", "tok_c1a48b696587418e22a296e1", "tok_4bf038d6e406a47764515233", "tok_b0387736b31820a112c723eb"], "adverb", "seulement_only", "only; merely", "limite une quantité, une circonstance ou un moment"),
  make("voilà", "voila", ["tok_d8d2f9667e86863a73612f0a", "tok_abaeefad491ec6f10bde5459", "tok_83a9108b81a8bd1fcd03397f"], "adverb", "voila_deictic", "there is; behold", "présente ou désigne vivement une personne, une chose ou une situation"),
  make("trois", "trois", ["tok_12154d7f5d24fc54af8338fb", "tok_8e8769fb02cd86f336047b07", "tok_9251807c6c549cafe3fcf257"], "numeral", "trois_number", "three", "nombre entier suivant deux et précédant quatre"),
  make("revision", "revision", ["tok_60db36ecc82bca3228436769", "tok_12f025a35a14417d770b86bc", "tok_7b16b7f75fca5a151023d65e"], "noun", "revision_review", "review; retrial", "examen à nouveau d’une décision ou d’une procédure judiciaire"),
  make("vie", "vie", ["tok_2d26e85c27f0cb9e6fa85190", "tok_f3f777509a25958ea32a0447", "tok_eb68c27f4691ab8f9b947af6"], "noun", "vie_life", "life", "ensemble de l’existence d’une personne ou durée pendant laquelle elle vit"),
  make("second", "second", ["tok_57f86a0448dbe3cdd3e2719d", "tok_16a51d99878f11f72f9e86fc", "tok_8da2a2be8a5d19685a243bc7"], "adjective", "second_ordinal", "second", "qui vient immédiatement après le premier"),
  make("sabre", "sabre", ["tok_8cc7d645bdd85525d9ca86ca", "tok_fac7f2b07b1abb6ac2b0d491", "tok_96679e52c066f7c762993696"], "noun", "sabre_sword", "sabre; sword", "arme blanche à lame longue et légèrement courbe"),
  make("souci", "souci", ["tok_f9dd3d0a07c248c43a4b2cff", "tok_81ae237999735d90b3976878"], "noun", "souci_concern", "concern; care", "attention préoccupée portée à une personne, une chose ou un résultat"),
  make("universelle", "universel", ["tok_ac645caa015b3eb076f57d1a", "tok_9cf71b18649f16f29f22aa7a"], "adjective", "universel_general", "universal", "qui concerne tout le monde ou l’ensemble d’un domaine"),
  make("travail", "travail", ["tok_228a1d9769b0b5398b12d2b5", "tok_1de50d2ca457e327757847d4"], "noun", "travail_work", "work; labor", "activité ou effort consacré à une tâche"),
  make("tache", "tache", ["tok_215db4882ef2335190811181", "tok_ed653360ce7d6df440b18f2a"], "noun", "tache_stain", "stain; blemish", "marque qui souille une surface ou porte atteinte à une réputation"),
  make("suprême", "supreme", ["tok_e3ec7e2be2c18cb7e119f803", "tok_393d65bf740881a300f9cd93"], "adjective", "supreme_highest", "supreme; highest", "qui est au plus haut degré ou occupe le rang le plus élevé"),
  make("souillure", "souillure", ["tok_da08e145b1256ee6344eb0e9", "tok_d58f6b4b2514ce7a017d5d59"], "noun", "souillure_stain", "stain; disgrace", "marque de saleté ou de déshonneur"),
  make("présidence", "presidence", ["tok_a5ba2cff0d2311a244f51262", "tok_f595860e4cde5b9acd7efd17"], "noun", "presidence_office", "presidency", "fonction ou période pendant laquelle une personne préside"),
  make("puisqu’", "puisque", ["tok_9c2b346a34f7dfd793bf9d48", "tok_a2cd8994c0f6eebcca93bc65"], "conjunction", "puisque_since", "since; as", "introduit la cause considérée comme connue ou évidente"),
  make("pleine", "plein", ["tok_3472ec5e50f944af8d61a2a6", "tok_e536cf0c8e0ebee4b66c604b"], "adjective", "plein_full", "full", "qui contient tout ce qu’il peut contenir ou qui est entièrement occupé", "plein"),
  make("veux", "vouloir", ["tok_b55713b8aef1c9378de4d157", "tok_9043c8dcfbae7e855d1df467"], "verb", "vouloir_present", "want", "forme du présent de vouloir exprimant une volonté", "vouloir"),
  make("révolte", "revolte", ["tok_6b6f783e4498baf7d0517dcf", "tok_1552120a35fff2a6439fbf06"], "noun", "revolte_uprising", "rebellion; revolt", "opposition collective ou personnelle contre une autorité ou une injustice"),
  make("vrais", "vrai", ["tok_8195728652d670ef82e930dc", "tok_c8270ee0607d48b75c0deef3"], "adjective", "vrai_true", "true; real", "conforme à la réalité ou à la vérité", "vrai"),
  make("responsabilités", "responsabilite", ["tok_f7a9f05ca5fdca8b729a5474", "tok_243bf56575c9e0312d75ed3c"], "noun", "responsabilite_accountability", "responsibility; accountability", "obligation de répondre d’un acte, d’une faute ou d’une mission", "responsabilité"),
  make("romanesques", "romanesque", ["tok_af02454a4403ac553b51ab51", "tok_67ac16df802323c65a67e0a6"], "adjective", "romanesque_novelistic", "romantic; novelistic", "qui rappelle les intrigues extraordinaires d’un roman"),
];
