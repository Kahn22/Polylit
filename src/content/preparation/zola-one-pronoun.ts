import type { ContentBundle } from "../../domain/model.js";
import type { ReviewDecision, TokenCandidate } from "../../ingestion/model.js";
import { authoredSet } from "../quizzes/authoring.js";

/** Explicit contextual exceptions to the existing un/une indefinite articles. */
export const onePronounCandidates = {
  un: [
    "tok_0632259f23bec93517e6720f", // qu’un d’eux
    "tok_8e4edf961b612ba45b4ecee3", // l’un ... l’autre
    "tok_69b5fb701c9dc34fb7533765", // l’un ... l’autre
  ],
  une: [
    "tok_841c6b5915f6a5a639f688da", // qu’une seule
    "tok_99fe1b926b2647d8609983d8", // d’une des plus grandes
  ],
} as const;

export const onePronounCandidateIds = new Set<string>([...onePronounCandidates.un, ...onePronounCandidates.une]);

export const zolaOnePronounSense: ContentBundle["senses"][number] = {
  id: "sns_zola_un_one",
  lemmaId: "lem_un",
  gloss: "one (of a group)",
  definition: "Pronom indéfini désignant un membre d’un groupe déjà évoqué, sans nom qui suit.",
};

export function reviewedOnePronounDecisions(candidates: readonly TokenCandidate[]): ReviewDecision[] {
  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  return (Object.entries(onePronounCandidates) as Array<["un" | "une", readonly string[]]>).flatMap(([normalized, ids]) =>
    ids.map((candidateId) => {
      const candidate = byId.get(candidateId);
      if (candidate?.normalized !== normalized) throw new Error(`Unknown or mismatched one-pronoun occurrence: ${candidateId}`);
      return {
        candidateId,
        disposition: "vocabulary" as const,
        lemmaId: "lem_un",
        senseId: zolaOnePronounSense.id,
        surfaceFormId: normalized === "un" ? "srf_un" : "srf_une",
      };
    }),
  );
}

/** Self-contained offline questions; neither source sentence is reused. */
export const zolaOnePronounQuizzes: ContentBundle["quizItems"] = [
  ...authoredSet({
    key: "un_one_of_group",
    surfaceFormId: "srf_un",
    senseId: zolaOnePronounSense.id,
    target: "un",
    meaning: "one (masculine)",
    early: [
      ["Deux manteaux sont suspendus : un seul reste sec.", ["both", "none", "several"]],
      ["Parmi ces garçons, un seul connaît la réponse.", ["both", "none", "several"]],
      ["Trois bols sont sur la table : un seul est intact.", ["both", "none", "several"]],
    ],
    blank: ["Parmi les deux parapluies, ___ protège encore de la pluie ; l’autre est troué.", ["un", "chacun", "tout", "quelqu’un"]],
    comprehension: ["Parmi deux manteaux, un seul reste sec.", "Combien de manteaux sont secs ?", ["un", "deux", "aucun", "tous"], "un"],
    advanced: [
      ["Deux manteaux sont suspendus : un est sec, l’autre est mouillé. Chacun avait été vérifié ; tout est rangé et quelqu’un frappe.", "Quel pronom désigne le seul manteau sec ?", ["un", "Chacun", "tout", "quelqu’un"]],
      ["Deux livres sont ouverts : un est annoté, l’autre reste vierge. Chacun appartient à Léa ; tout est en ordre et quelqu’un entre.", "Quel pronom désigne le livre annoté ?", ["un", "Chacun", "tout", "quelqu’un"]],
      ["Deux colis attendent : un est léger, l’autre très lourd. Chacun porte une adresse ; tout est prêt et quelqu’un sonne.", "Quel pronom désigne le colis léger ?", ["un", "Chacun", "tout", "quelqu’un"]],
    ],
  }),
  ...authoredSet({
    key: "une_one_of_group",
    surfaceFormId: "srf_une",
    senseId: zolaOnePronounSense.id,
    target: "une",
    meaning: "one (feminine)",
    early: [
      ["Deux lampes sont sur la table : une seule est allumée.", ["both", "none", "several"]],
      ["Parmi ces lettres, une seule porte un cachet.", ["both", "none", "several"]],
      ["Trois chaises sont ici : une seule est intacte.", ["both", "none", "several"]],
    ],
    blank: ["Parmi les deux lampes, ___ éclaire encore la pièce ; l’autre est éteinte.", ["une", "chacune", "tout", "quelqu’un"]],
    comprehension: ["Deux lampes sont sur la table : une seule est allumée.", "Combien de lampes sont allumées ?", ["une", "deux", "aucune", "toutes"], "une"],
    advanced: [
      ["Deux lampes sont sur la table : une éclaire la pièce, l’autre est éteinte. Chacune a été vérifiée hier. Tout est rangé et quelqu’un ferme la porte.", "Quel pronom désigne la lampe allumée ?", ["une", "Chacune", "Tout", "quelqu’un"]],
      ["Deux lettres sont arrivées : une porte un cachet, l’autre est vierge. Chacune sera classée ; tout est prêt et quelqu’un attend.", "Quel pronom désigne la lettre cachetée ?", ["une", "Chacune", "tout", "quelqu’un"]],
      ["Deux chaises sont dans le salon : une est intacte, l’autre est cassée. Chacune sera examinée ; tout est calme et quelqu’un entre.", "Quel pronom désigne la chaise intacte ?", ["une", "Chacune", "tout", "quelqu’un"]],
    ],
  }),
];
