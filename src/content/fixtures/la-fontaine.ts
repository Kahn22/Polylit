import type { ContentBundle } from "../../domain/model.js";

const books = Array.from({ length: 12 }, (_, index) => ({
  id: `bok_lafontaine_fables_${String(index + 1).padStart(2, "0")}`,
  collectionId: "col_lafontaine_fables",
  ordinal: index + 1,
  title: `Livre ${["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][index]}`,
}));

const corbeauUnits = [
  ["unt_corbeau_01", "Maître Corbeau, sur un arbre perché, tenait en son bec un fromage."],
  ["unt_corbeau_02", "Maître Renard, par l’odeur alléché, lui tint à peu près ce langage :"],
  ["unt_corbeau_03", "« Hé ! bonjour, Monsieur du Corbeau."],
  ["unt_corbeau_04", "Que vous êtes joli !"],
  ["unt_corbeau_05", "Que vous me semblez beau !"],
  ["unt_corbeau_06", "Sans mentir, si votre ramage se rapporte à votre plumage, vous êtes le Phénix des hôtes de ces bois. »"],
  ["unt_corbeau_07", "À ces mots le Corbeau ne se sent pas de joie ;"],
  ["unt_corbeau_08", "Et pour montrer sa belle voix, il ouvre un large bec, laisse tomber sa proie."],
  ["unt_corbeau_09", "Le Renard s’en saisit, et dit : « Mon bon Monsieur, apprenez que tout flatteur vit aux dépens de celui qui l’écoute."],
  ["unt_corbeau_10", "Cette leçon vaut bien un fromage, sans doute. »"],
  ["unt_corbeau_11", "Le Corbeau, honteux et confus, jura, mais un peu tard, qu’on ne l’y prendrait plus."],
] as const;

const lievreUnits = [
  ["unt_lievre_01", "Rien ne sert de courir ; il faut partir à point."],
  ["unt_lievre_02", "Le Lièvre et la Tortue en sont un témoignage."],
  ["unt_lievre_03", "« Gageons, dit celle-ci, que vous n’atteindrez point sitôt que moi ce but."],
  ["unt_lievre_04", "— Sitôt ? Êtes-vous sage ? repartit l’animal léger."],
  ["unt_lievre_05", "Ma commère, il vous faut purger avec quatre grains d’ellébore."],
  ["unt_lievre_06", "— Sage ou non, je parie encore. »"],
  ["unt_lievre_07", "Ainsi fut fait : et de tous deux on mit près du but les enjeux : savoir quoi, ce n’est pas l’affaire, ni de quel juge l’on convint."],
  ["unt_lievre_08", "Notre Lièvre n’avait que quatre pas à faire ; j’entends de ceux qu’il fait lorsque prêt d’être atteint il s’éloigne des chiens, les renvoie aux calendes, et leur fait arpenter les landes."],
  ["unt_lievre_09", "Ayant, dis-je, du temps de reste pour brouter, pour dormir, et pour écouter d’où vient le vent, il laisse la Tortue aller son train de sénateur."],
  ["unt_lievre_10", "Elle part, elle s’évertue ; elle se hâte avec lenteur."],
  ["unt_lievre_11", "Lui cependant méprise une telle victoire, tient la gageure à peu de gloire, croit qu’il y va de son honneur de partir tard."],
  ["unt_lievre_12", "Il broute, il se repose, il s’amuse à toute autre chose qu’à la gageure."],
  ["unt_lievre_13", "À la fin, quand il vit que l’autre touchait presque au bout de la carrière, il partit comme un trait ; mais les élans qu’il fit furent vains : la Tortue arriva la première."],
  ["unt_lievre_14", "« Eh bien ! lui cria-t-elle, avais-je pas raison ?"],
  ["unt_lievre_15", "De quoi vous sert votre vitesse ?"],
  ["unt_lievre_16", "Moi l’emporter ! et que serait-ce si vous portiez une maison ? »"],
] as const;

const canonical = (units: readonly (readonly [string, string])[]) => units.map(([, text]) => text).join("\n");
const units = (workId: string, values: readonly (readonly [string, string])[]) => values.map(([id, french], i) => ({
  id, workId, ordinal: i + 1, french,
}));

export const lafountainFixtures: ContentBundle = {
  authors: [{ id: "aut_jean_de_la_fontaine", name: "Jean de La Fontaine", sortName: "La Fontaine, Jean de" }],
  collections: [{ id: "col_lafontaine_fables", authorId: "aut_jean_de_la_fontaine", title: "Fables", language: "fr" }],
  books,
  works: [
    { id: "wrk_corbeau_renard", bookId: "bok_lafontaine_fables_01", ordinal: 2, title: "Le Corbeau et le Renard", publicationState: "source_structured" },
    { id: "wrk_lievre_tortue", bookId: "bok_lafontaine_fables_06", ordinal: 10, title: "Le Lièvre et la Tortue", publicationState: "source_structured" },
  ],
  sources: [
    { workId: "wrk_corbeau_renard", canonicalText: canonical(corbeauUnits), provenance: { citation: "Jean de La Fontaine, Fables, Livre I, fable II (1668)" }, typographyPolicy: "modern_conventional_typography_preserving_wording" },
    { workId: "wrk_lievre_tortue", canonicalText: canonical(lievreUnits), provenance: { citation: "Jean de La Fontaine, Fables, Livre VI, fable X (1668)" }, typographyPolicy: "modern_conventional_typography_preserving_wording" },
  ],
  units: [...units("wrk_corbeau_renard", corbeauUnits), ...units("wrk_lievre_tortue", lievreUnits)],
  lemmas: [], senses: [], surfaceForms: [], occurrences: [], exclusions: [], expressions: [], notes: [], quizItems: [],
  readiness: [
    { workId: "wrk_corbeau_renard", thoughtUnitsComplete: true, occurrencesReviewed: false, unresolvedLearnerTokens: ["linguistic annotation pending"] },
    { workId: "wrk_lievre_tortue", thoughtUnitsComplete: true, occurrencesReviewed: false, unresolvedLearnerTokens: ["linguistic annotation pending"] },
  ],
};
