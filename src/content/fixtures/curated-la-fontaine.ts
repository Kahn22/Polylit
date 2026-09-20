import type { ContentBundle } from "../../domain/model.js";

const cigaleTexts = [
  "La Cigale, ayant chanté tout l’été,",
  "Se trouva fort dépourvue quand la bise fut venue :",
  "Pas un seul petit morceau de mouche ou de vermisseau.",
  "Elle alla crier famine chez la Fourmi sa voisine,",
  "La priant de lui prêter quelque grain pour subsister jusqu’à la saison nouvelle.",
  "« Je vous paierai, lui dit-elle, avant l’août, foi d’animal, intérêt et principal. »",
  "La Fourmi n’est pas prêteuse : c’est là son moindre défaut.",
  "« Que faisiez-vous au temps chaud ? dit-elle à cette emprunteuse.",
  "— Nuit et jour à tout venant, je chantais, ne vous déplaise.",
  "— Vous chantiez ? j’en suis fort aise.",
  "Eh bien ! dansez maintenant. »",
] as const;

const loupAgneauTexts = [
  "La raison du plus fort est toujours la meilleure :",
  "Nous l’allons montrer tout à l’heure.",
  "Un Agneau se désaltérait dans le courant d’une onde pure.",
  "Un Loup survient à jeun, qui cherchait aventure, et que la faim en ces lieux attirait.",
  "« Qui te rend si hardi de troubler mon breuvage ? dit cet animal plein de rage :",
  "Tu seras châtié de ta témérité.",
  "— Sire, répond l’Agneau, que Votre Majesté ne se mette pas en colère ;",
  "Mais plutôt qu’elle considère que je me vas désaltérant dans le courant,",
  "Plus de vingt pas au-dessous d’Elle ;",
  "Et que par conséquent, en aucune façon, je ne puis troubler sa boisson.",
  "— Tu la troubles, reprit cette bête cruelle ;",
  "Et je sais que de moi tu médis l’an passé.",
  "— Comment l’aurais-je fait si je n’étais pas né ? reprit l’Agneau ; je tette encor ma mère.",
  "— Si ce n’est toi, c’est donc ton frère.",
  "— Je n’en ai point.",
  "— C’est donc quelqu’un des tiens :",
  "Car vous ne m’épargnez guère, vous, vos bergers, et vos chiens.",
  "On me l’a dit : il faut que je me venge. »",
  "Là-dessus, au fond des forêts, le Loup l’emporte, et puis le mange,",
  "Sans autre forme de procès.",
] as const;

const lionRatTexts = [
  "Il faut, autant qu’on peut, obliger tout le monde :",
  "On a souvent besoin d’un plus petit que soi.",
  "De cette vérité deux fables feront foi, tant la chose en preuves abonde.",
  "Entre les pattes d’un Lion, un Rat sortit de terre assez à l’étourdie.",
  "Le Roi des animaux, en cette occasion, montra ce qu’il était, et lui donna la vie.",
  "Ce bienfait ne fut pas perdu.",
  "Quelqu’un aurait-il jamais cru qu’un Lion d’un Rat eût affaire ?",
  "Cependant il advint qu’au sortir des forêts ce Lion fut pris dans des rets,",
  "Dont ses rugissements ne le purent défaire.",
  "Sire Rat accourut, et fit tant par ses dents qu’une maille rongée emporta tout l’ouvrage.",
  "Patience et longueur de temps font plus que force ni que rage.",
] as const;

function units(workKey: string, workId: string, texts: readonly string[]) {
  return texts.map((french, index) => ({ id: `unt_${workKey}_${String(index + 1).padStart(2, "0")}`, workId, ordinal: index + 1, french }));
}
function source(workId: string, texts: readonly string[], citation: string, url: string) {
  return { workId, canonicalText: texts.join("\n"), provenance: { citation, url, accessedOn: "2026-09-15" }, typographyPolicy: "modern_conventional_typography_preserving_wording" as const };
}

export const curatedLaFontaineSourceAcquisition: ContentBundle = {
  authors: [{ id: "aut_jean_de_la_fontaine", name: "Jean de La Fontaine", sortName: "La Fontaine, Jean de" }],
  collections: [{ id: "col_lafontaine_fables", authorId: "aut_jean_de_la_fontaine", title: "Fables", language: "fr" }],
  books: [
    { id: "bok_lafontaine_fables_01", collectionId: "col_lafontaine_fables", ordinal: 1, title: "Livre I" },
    { id: "bok_lafontaine_fables_02", collectionId: "col_lafontaine_fables", ordinal: 2, title: "Livre II" },
  ],
  works: [
    { id: "wrk_cigale_fourmi", bookId: "bok_lafontaine_fables_01", ordinal: 1, title: "La Cigale et la Fourmi", publicationState: "source_structured" },
    { id: "wrk_loup_agneau", bookId: "bok_lafontaine_fables_01", ordinal: 10, title: "Le Loup et l’Agneau", publicationState: "source_structured" },
    { id: "wrk_lion_rat", bookId: "bok_lafontaine_fables_02", ordinal: 11, title: "Le Lion et le Rat", publicationState: "source_structured" },
  ],
  sources: [
    source("wrk_cigale_fourmi", cigaleTexts, "Jean de La Fontaine, Fables, Livre I, fable I (1668)", "https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._1874)/La_Cigale_et_la_Fourmi"),
    source("wrk_loup_agneau", loupAgneauTexts, "Jean de La Fontaine, Fables, Livre I, fable X (1668)", "https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._1874)/Le_Loup_et_l%E2%80%99Agneau"),
    source("wrk_lion_rat", lionRatTexts, "Jean de La Fontaine, Fables, Livre II, fable XI (1668)", "https://fr.wikisource.org/wiki/Fables_de_La_Fontaine_(%C3%A9d._1874)/Le_Lion_et_le_Rat"),
  ],
  units: [
    ...units("cigale_fourmi", "wrk_cigale_fourmi", cigaleTexts),
    ...units("loup_agneau", "wrk_loup_agneau", loupAgneauTexts),
    ...units("lion_rat", "wrk_lion_rat", lionRatTexts),
  ],
  lemmas: [], senses: [], surfaceForms: [], occurrences: [], exclusions: [], expressions: [], notes: [], quizItems: [],
  readiness: ["wrk_cigale_fourmi", "wrk_loup_agneau", "wrk_lion_rat"].map((workId) => ({ workId, thoughtUnitsComplete: true, occurrencesReviewed: false, unresolvedLearnerTokens: ["linguistic annotation pending"] })),
};
