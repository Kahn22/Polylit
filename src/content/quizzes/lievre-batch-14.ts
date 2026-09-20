import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "lorsque_when", surfaceFormId: "srf_lorsque", senseId: "sns_lorsque_primary", target: "lorsque", meaning: "when",
    early: [
      ["La cloche sonne lorsque le train arrive.", ["because", "although", "unless"]],
      ["Paul ferme la porte lorsque le vent se lève.", ["before", "without", "toward"]],
      ["Nous partirons lorsque Marie sera prête.", ["where", "whose", "how"]],
    ],
    blank: ["Prévenez-moi ___ le médecin arrivera.", ["lorsque", "puisque", "quoique", "pendant"]],
    comprehension: ["Luc allume la lampe lorsque la nuit tombe.", "À quel moment Luc allume-t-il la lampe ?", ["when night falls", "before sunset", "at noon", "when Paul arrives"], "when night falls"],
    advanced: [
      ["Lorsque la pluie cesse, les enfants retournent dans le jardin.", "Quel mot introduit le moment du retour ?", ["Lorsque", "pluie", "enfants", "jardin"]],
      ["Marie sourit lorsque son frère ouvre la lettre.", "Quelle conjonction signifie au moment où ?", ["Marie", "lorsque", "frère", "lettre"]],
      ["Le chien aboie lorsque quelqu’un approche de la maison.", "Quel mot relie les deux événements dans le temps ?", ["chien", "lorsque", "quelqu’un", "maison"]],
    ],
  },
  {
    key: "pret_ready", surfaceFormId: "srf_pret", senseId: "sns_pret_primary", target: "prêt", meaning: "ready",
    early: [
      ["Paul est prêt à partir.", ["tired", "late", "lost"]],
      ["Le repas est prêt depuis midi.", ["cold", "missing", "expensive"]],
      ["Je suis prêt pour le voyage.", ["afraid", "alone", "unable"]],
    ],
    blank: ["Le bateau est ___ à quitter le port.", ["prêt", "près", "prête", "préparé"]],
    comprehension: ["Luc a fermé sa valise et attend devant la porte : il est prêt.", "Quel est l’état de Luc ?", ["he is ready", "he is asleep", "he is uncertain", "he is still packing"], "he is ready"],
    advanced: [
      ["Le cheval est prêt, mais le cavalier cherche encore son manteau.", "Quel mot indique que le cheval peut partir ?", ["cheval", "prêt", "cavalier", "manteau"]],
      ["Paul se déclare prêt à répondre à toutes les questions.", "Quel adjectif signifie préparé ?", ["Paul", "prêt", "répondre", "questions"]],
      ["Le pont sera bientôt prêt et les voyageurs pourront traverser.", "Quel mot décrit l’ouvrage achevé et utilisable ?", ["pont", "prêt", "voyageurs", "traverser"]],
    ],
  },
  {
    key: "etre_to_be", surfaceFormId: "srf_etre", senseId: "sns_etre_primary", target: "être", meaning: "to be",
    early: [
      ["Il veut être médecin.", ["to have", "to go", "to know"]],
      ["Cette route semble être la plus courte.", ["to become", "to find", "to follow"]],
      ["Nous devons être prudents dans la forêt.", ["to arrive", "to carry", "to choose"]],
    ],
    blank: ["Marie espère ___ prête avant midi.", ["être", "avoir", "faire", "aller"]],
    comprehension: ["Paul préfère être seul pendant son travail.", "Quelle situation Paul préfère-t-il ?", ["to be alone", "to work outside", "to have assistance", "to finish early"], "to be alone"],
    advanced: [
      ["Pour être juste, le juge écoute attentivement les deux parties.", "Quel infinitif exprime un état ou une qualité ?", ["être", "juge", "écoute", "parties"]],
      ["Ce document paraît être authentique malgré son grand âge.", "Quel mot est l’infinitif du verbe est ?", ["document", "être", "authentique", "âge"]],
      ["Il faut être patient, car le prochain train arrive dans une heure.", "Quel infinitif relie le sujet à la qualité patient ?", ["être", "patient", "train", "heure"]],
    ],
  },
  {
    key: "atteint_reached", surfaceFormId: "srf_atteint", senseId: "sns_atteindre_primary", target: "atteint", meaning: "reached; attained",
    early: [
      ["Le voyageur a atteint le sommet avant midi.", ["left", "avoided", "described"]],
      ["Notre bateau atteint enfin le rivage.", ["loses", "follows", "crosses"]],
      ["Le niveau de l’eau a atteint la fenêtre.", ["hidden", "protected", "measured"]],
    ],
    blank: ["Paul a ___ son objectif après plusieurs années.", ["atteint", "attend", "atteins", "atteindre"]],
    comprehension: ["Après une longue marche, Marie a atteint le village au coucher du soleil.", "Où Marie est-elle arrivée ?", ["at the village", "at the river", "at the mountain", "at the station"], "at the village"],
    advanced: [
      ["Le feu a atteint le toit, mais les pompiers protègent encore la maison voisine.", "Quel mot signifie est parvenu jusqu’à ?", ["feu", "atteint", "toit", "maison"]],
      ["Paul a atteint la dernière étape tandis que Luc reste loin derrière.", "Quel participe passé indique que Paul est arrivé à l’étape ?", ["Paul", "atteint", "étape", "Luc"]],
      ["Le coureur atteint la ligne et lève les bras devant la foule.", "Quel verbe signifie arrive jusqu’à ?", ["coureur", "atteint", "ligne", "foule"]],
    ],
  },
  {
    key: "eloigne_moves_away", surfaceFormId: "srf_eloigne", senseId: "sns_eloigner_primary", target: "éloigne", meaning: "moves away; takes farther away",
    early: [
      ["Paul éloigne la chaise de la fenêtre.", ["brings closer", "repairs", "hides"]],
      ["Le courant éloigne le bateau du rivage.", ["anchors", "turns", "breaks"]],
      ["Cette route nous éloigne du village.", ["leads toward", "crosses", "surrounds"]],
    ],
    blank: ["Le vent ___ peu à peu les nuages.", ["éloigne", "éloigné", "approche", "arrête"]],
    comprehension: ["Marie éloigne la lampe des rideaux pour éviter un incendie.", "Que fait Marie avec la lampe ?", ["she moves it away from the curtains", "she lights it", "she puts it behind the curtains", "she gives it to Paul"], "she moves it away from the curtains"],
    advanced: [
      ["Paul éloigne le chien de la route pendant que les voitures passent.", "Quel verbe signifie fait aller plus loin ?", ["Paul", "éloigne", "chien", "voitures"]],
      ["La tempête éloigne les bateaux du port et menace les pêcheurs.", "Quel mot indique que les bateaux sont poussés plus loin ?", ["tempête", "éloigne", "port", "pêcheurs"]],
      ["Cette décision éloigne encore les deux anciens amis.", "Quel verbe exprime ici une séparation croissante ?", ["décision", "éloigne", "anciens", "amis"]],
    ],
  },
];

export const lievreQuizBatch14 = specs.flatMap(authoredSet);
