import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "que_restrictive", surfaceFormId: "srf_que", senseId: "sns_que_restrictive", target: "que", meaning: "only (in ne…que)",
    early: [
      ["Il ne reste que deux places.", ["never", "already", "perhaps"]],
      ["Je ne bois que de l’eau.", ["also", "without", "because"]],
      ["Elle n’a que dix minutes pour répondre.", ["about", "after", "nearly"]],
    ],
    blank: ["Nous ne voyons ___ la moitié du jardin.", ["que", "qui", "quoi", "quand"]],
    comprehension: ["Paul ne possède que trois livres.", "Combien de livres Paul possède-t-il ?", ["only three", "at least ten", "none", "an unknown number"], "only three"],
    advanced: [
      ["Marie ne prend que le train et refuse le bateau.", "Quel mot limite son choix au train ?", ["Marie", "que", "train", "bateau"]],
      ["Il n’entend que le vent, tandis que les autres entendent la cloche.", "Quel mot signifie seulement dans cette construction ?", ["entend", "que", "vent", "cloche"]],
      ["Nous ne gardons que cette lettre et brûlons les autres papiers.", "Quel mot marque la restriction ?", ["gardons", "que", "lettre", "papiers"]],
    ],
  },
  {
    key: "que_interrogative", surfaceFormId: "srf_que", senseId: "sns_que_interrogative", target: "que", meaning: "what",
    early: [
      ["Que voulez-vous maintenant ?", ["where", "when", "who"]],
      ["Que devient cette ancienne maison ?", ["why", "whose", "how many"]],
      ["Que faut-il préparer avant le voyage ?", ["which person", "from where", "until when"]],
    ],
    blank: ["___ cherchez-vous dans ce dossier ?", ["que", "qui", "où", "quand"]],
    comprehension: ["Le juge demande : « Que contient cette lettre ? »", "Quelle information cherche le juge ?", ["what the letter contains", "who wrote the letter", "where the letter was found", "when the letter arrived"], "what the letter contains"],
    advanced: [
      ["Que choisira Paul : le train, le bateau ou la voiture ?", "Quel mot interroge sur la chose choisie ?", ["Que", "Paul", "bateau", "voiture"]],
      ["Que signifie ce mot dans le vieux manuscrit ?", "Quel pronom demande une définition ?", ["Que", "mot", "vieux", "manuscrit"]],
      ["Que répond Marie lorsque le témoin pose cette question ?", "Quel mot demande le contenu de la réponse ?", ["Que", "Marie", "témoin", "question"]],
    ],
  },
  {
    key: "qu_relative", surfaceFormId: "srf_qu_elided", senseId: "sns_que_relative", target: "qu’", meaning: "that; which; whom (relative object)",
    early: [
      ["Le livre qu’il lit appartient à Marie.", ["because", "only", "when"]],
      ["La personne qu’elle attend arrivera demain.", ["where", "whose", "how"]],
      ["Voici la lettre qu’on cherchait depuis hier.", ["if", "although", "why"]],
    ],
    blank: ["Le chemin ___il choisit traverse la forêt.", ["qu’", "que", "qui", "où"]],
    comprehension: ["Le tableau qu’Anne regarde vient du musée.", "Quel est le rôle de qu’ ?", ["it links the painting to the action of looking at it", "it asks where Anne is", "it means only", "it introduces a reason"], "it links the painting to the action of looking at it"],
    advanced: [
      ["Le chien qu’il nourrit attend devant la porte.", "Quel élément reprend chien comme objet de nourrit ?", ["chien", "qu’", "nourrit", "porte"]],
      ["La promesse qu’elle fait rassure Paul et Marie.", "Quel élément relie promesse au verbe fait ?", ["promesse", "qu’", "Paul", "Marie"]],
      ["Les pièces qu’on trouve dans la boîte sont anciennes.", "Quel élément représente les pièces comme objet de trouve ?", ["pièces", "qu’", "boîte", "anciennes"]],
    ],
  },
  {
    key: "qu_comparative", surfaceFormId: "srf_qu_elided", senseId: "sns_que_comparative", target: "qu’", meaning: "than",
    early: [
      ["Elle pense davantage au thé qu’au café.", ["because", "only", "when"]],
      ["Il travaille davantage qu’avant.", ["where", "although", "whose"]],
      ["Cette route est plus longue qu’en hiver.", ["until", "without", "perhaps"]],
    ],
    blank: ["Paul court plus vite ___avant.", ["qu’", "que", "qui", "quoi"]],
    comprehension: ["Marie voyage plus souvent qu’autrefois.", "Quelle comparaison la phrase établit-elle ?", ["Marie travels more often than before", "Marie no longer travels", "Marie travels only in winter", "Marie travels with someone else"], "Marie travels more often than before"],
    advanced: [
      ["Le train arrive plus tôt qu’hier, mais le bateau reste en retard.", "Quel élément introduit le second terme de la comparaison ?", ["train", "tôt", "qu’", "bateau"]],
      ["Paul préfère marcher plutôt qu’attendre encore une heure.", "Quel élément signifie plutôt que devant attendre ?", ["Paul", "marcher", "qu’", "heure"]],
      ["La rivière paraît moins profonde qu’au printemps.", "Quel élément relie les deux termes comparés ?", ["rivière", "profonde", "qu’", "printemps"]],
    ],
  },
  {
    key: "n_elided_not", surfaceFormId: "srf_n_elided", senseId: "sns_ne_primary", target: "n’", meaning: "not (elided ne)",
    early: [
      ["Il n’attend pas le prochain train.", ["already", "always", "also"]],
      ["Marie n’écoute jamais les rumeurs.", ["still", "often", "therefore"]],
      ["On n’entend plus la cloche.", ["soon", "together", "outside"]],
    ],
    blank: ["Paul ___ouvre pas la fenêtre.", ["n’", "ne", "ni", "non"]],
    comprehension: ["Luc n’accepte pas la proposition du marchand.", "Luc accepte-t-il la proposition ?", ["no", "yes", "only partly", "the sentence does not say"], "no"],
    advanced: [
      ["Il n’arrive jamais en retard, mais son frère oublie souvent l’heure.", "Quel élément élidé commence la négation ?", ["n’", "jamais", "frère", "souvent"]],
      ["Marie n’écrit plus à Paul et garde désormais le silence.", "Quel élément est la forme élidée de ne ?", ["Marie", "n’", "Paul", "silence"]],
      ["On n’oublie pas cette histoire, même après plusieurs années.", "Quel élément participe à la négation devant une voyelle ?", ["n’", "histoire", "après", "années"]],
    ],
  },
];

export const lievreQuizBatch09 = specs.flatMap(authoredSet);
