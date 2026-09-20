import { authoredSet } from "../quizzes/authoring.js";

/** Offline questions only for shared que identities not covered in earlier works. */
export const zolaSharedQuizBatch42 = [
  ...authoredSet({
    key: "que_relative_object",
    surfaceFormId: "srf_que", senseId: "sns_que_relative", target: "que",
    meaning: "that; which; whom (relative object)",
    early: [
      ["Le livre que Luc lit est bleu.", ["because", "only", "when"]],
      ["Voici la lettre que Marie cherche.", ["therefore", "never", "unless"]],
      ["Les voisins que Paul invite arrivent demain.", ["although", "before", "without"]],
    ],
    blank: ["Le tableau ___ Marie regarde est ancien.", ["que", "dont", "où", "quand"]],
    comprehension: ["Le livre que Luc lit est bleu.", "Que lit Luc ?", ["le livre", "le mur", "la lettre", "le journal"], "le livre"],
    advanced: [
      ["Le livre que Luc lit est bleu. Luc est dehors, mais il lit toujours.", "Quel mot relie livre à lit comme objet ?", ["que", "mais", "dehors", "toujours"]],
      ["La lettre que Léa signe est courte. Son frère attend dehors.", "Quel mot reprend lettre comme objet de signe ?", ["que", "frère", "dehors", "courte"]],
      ["Le jardin que Paul dessine est grand. Une fontaine est au centre.", "Quel mot reprend jardin comme objet de dessine ?", ["que", "centre", "fontaine", "grand"]],
    ],
  }),
  ...authoredSet({
    key: "que_comparative_than",
    surfaceFormId: "srf_que", senseId: "sns_que_comparative", target: "que",
    meaning: "than (in a comparison)",
    early: [
      ["Ce sentier est plus long que l’autre.", ["because", "only", "when"]],
      ["Cette boîte est moins lourde que la valise.", ["therefore", "unless", "without"]],
      ["Elle court plus vite que son frère.", ["although", "before", "where"]],
    ],
    blank: ["La colline est plus haute ___ la maison.", ["que", "dont", "où", "quand"]],
    comprehension: ["Le sentier est plus long que la route.", "Quel trajet est le plus long ?", ["le sentier", "la route", "les deux", "aucun"], "le sentier"],
    advanced: [
      ["Le pont est plus long que le tunnel. La rivière passe sous le pont.", "Quel mot introduit le second élément comparé ?", ["que", "pont", "rivière", "sous"]],
      ["La valise est moins lourde que le sac. Paul porte la valise.", "Quel mot introduit le sac dans la comparaison ?", ["que", "porte", "Paul", "lourde"]],
      ["Luc court plus vite que Paul. Marie regarde la course.", "Quel mot relie les personnes comparées ?", ["que", "regarde", "course", "vite"]],
    ],
  }),
  ...authoredSet({
    key: "qu_elided_restrictive_only",
    surfaceFormId: "srf_qu_elided", senseId: "sns_que_restrictive", target: "qu’",
    meaning: "only (in ne…qu’)",
    early: [
      ["Elle n’a qu’un billet pour le train.", ["never", "already", "perhaps"]],
      ["Nous n’avons qu’une heure pour partir.", ["always", "therefore", "perhaps"]],
      ["Il ne reste qu’un verre sur la table.", ["sometimes", "also", "because"]],
    ],
    blank: ["Il n’y a ___une place libre.", ["qu’", "d’", "l’", "s’"]],
    comprehension: ["Marie n’a qu’un billet.", "Combien de billets Marie a-t-elle ?", ["un seul", "deux", "aucun", "dix"], "un seul"],
    advanced: [
      ["Nous n’avons qu’une clé et toutes les portes sont fermées. La gardienne arrive bientôt.", "Quel élément limite le nombre de clés ?", ["qu’", "clé", "portes", "bientôt"]],
      ["Il ne reste qu’un siège. Le wagon est plein et les voyageurs attendent.", "Quel élément signifie seulement dans cette phrase ?", ["qu’", "siège", "voyageurs", "plein"]],
      ["Je n’ai qu’une question. Le professeur écoute et les autres élèves se taisent.", "Quel élément restreint le nombre de questions ?", ["qu’", "écoute", "autres", "taisent"]],
    ],
  }),
];
