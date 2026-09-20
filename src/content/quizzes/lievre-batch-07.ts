import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "ni_nor", surfaceFormId: "srf_ni", senseId: "sns_ni_primary", target: "ni", meaning: "nor; neither",
    early: [
      ["Il ne boit ni café ni thé.", ["and", "but", "because"]],
      ["Ni Paul ni Marie ne connaît la réponse.", ["both", "either", "with"]],
      ["Elle n’accepte ni excuse ni retard.", ["also", "therefore", "although"]],
    ],
    blank: ["Je ne vois ___ le pont ni la rivière.", ["ni", "et", "ou", "mais"]],
    comprehension: ["Luc ne prend ni le train ni le bateau.", "Quel moyen de transport Luc choisit-il parmi les deux ?", ["neither one", "the train", "the boat", "both of them"], "neither one"],
    advanced: [
      ["Ni le vent ni la pluie n’arrêtent les marcheurs.", "Quel mot coordonne deux éléments également niés ?", ["Ni", "vent", "pluie", "marcheurs"]],
      ["Elle ne veut ni attendre ni revenir demain.", "Quel mot signifie pas davantage l’un que l’autre ?", ["veut", "ni", "revenir", "demain"]],
      ["Le témoin n’a reconnu ni Paul ni son frère.", "Quel mot introduit les deux personnes exclues ?", ["témoin", "reconnu", "ni", "frère"]],
    ],
  },
  {
    key: "quel_which", surfaceFormId: "srf_quel", senseId: "sns_quel_primary", target: "quel", meaning: "which; what",
    early: [
      ["Quel chemin devons-nous prendre ?", ["this", "every", "no"]],
      ["Je demande quel livre vous préférez.", ["whose", "that", "some"]],
      ["Quel jour le train part-il ?", ["how", "why", "where"]],
    ],
    blank: ["___ témoin parlera le premier ?", ["quel", "quelle", "quels", "quelles"]],
    comprehension: ["Paul demande quel bateau va partir à midi.", "Quelle information Paul cherche-t-il ?", ["which boat will leave", "where the harbor is", "who owns the boat", "why the trip is canceled"], "which boat will leave"],
    advanced: [
      ["Quel train dessert Lyon, le rapide ou l’omnibus ?", "Quel mot demande de choisir parmi plusieurs trains ?", ["Quel", "train", "rapide", "omnibus"]],
      ["Le juge ignore quel document contient la signature.", "Quel déterminant interrogatif porte sur document ?", ["juge", "quel", "document", "signature"]],
      ["Quel voisin a vu Paul devant la maison hier ?", "Quel mot interroge sur l’identité du voisin ?", ["Quel", "voisin", "Paul", "maison"]],
    ],
  },
  {
    key: "juge_judge", surfaceFormId: "srf_juge", senseId: "sns_juge_primary", target: "juge", meaning: "judge",
    early: [
      ["Le juge écoute les deux témoins.", ["lawyer", "merchant", "guard"]],
      ["Cette affaire sera présentée au juge demain.", ["doctor", "teacher", "captain"]],
      ["Le juge rend sa décision après le débat.", ["witness", "clerk", "prisoner"]],
    ],
    blank: ["Le ___ examine les preuves avant de trancher.", ["juge", "juger", "jugement", "juste"]],
    comprehension: ["Le juge interroge Marie puis consulte le dossier.", "Qui interroge Marie ?", ["the judge", "the lawyer", "the clerk", "the witness"], "the judge"],
    advanced: [
      ["Le juge entre dans la salle, et l’avocat se lève.", "Quel mot désigne la personne chargée de trancher l’affaire ?", ["juge", "salle", "avocat", "lève"]],
      ["Après le témoignage, le juge annonce la décision au public.", "Quel mot nomme l’autorité judiciaire ?", ["témoignage", "juge", "décision", "public"]],
      ["Le greffier remet le dossier au juge avant l’audience.", "Quel mot désigne celui qui décidera du cas ?", ["greffier", "dossier", "juge", "audience"]],
    ],
  },
  {
    key: "convint_agreed", surfaceFormId: "srf_convint", senseId: "sns_convenir_primary", target: "convint", meaning: "agreed; was settled (literary simple past)",
    early: [
      ["Après le débat, Paul convint de revenir demain.", ["refused", "forgot", "ordered"]],
      ["Le marchand convint du prix avec son client.", ["hid", "doubled", "ignored"]],
      ["Chacun convint que la proposition était juste.", ["doubted", "announced", "discovered"]],
    ],
    blank: ["Après une longue discussion, le conseil ___ d’attendre.", ["convint", "convient", "conviendra", "convainquit"]],
    comprehension: ["Marie convint avec Luc de partager les frais du voyage.", "Quelle décision prit Marie ?", ["she agreed to share the costs", "she canceled the journey", "she paid every cost alone", "she refused to speak to Luc"], "she agreed to share the costs"],
    advanced: [
      ["Le roi convint du traité, puis le messager informa la ville.", "Quel mot signifie accepta ou se mit d’accord ?", ["roi", "convint", "messager", "ville"]],
      ["Après quelques objections, le juge convint que le témoin disait vrai.", "Quel mot marque l’accord du juge ?", ["objections", "juge", "convint", "témoin"]],
      ["Paul convint de partir lundi, tandis que Marie préféra mardi.", "Quel mot est la forme littéraire passée de convenir ?", ["Paul", "convint", "lundi", "mardi"]],
    ],
  },
  {
    key: "notre_our", surfaceFormId: "srf_notre", senseId: "sns_notre_primary", target: "notre", meaning: "our",
    early: [
      ["Notre maison se trouve près de la rivière.", ["your", "their", "his"]],
      ["Nous attendons notre train sur le quai.", ["my", "her", "your"]],
      ["Notre décision concerne toute l’équipe.", ["this", "that", "every"]],
    ],
    blank: ["Nous préparons ___ voyage depuis plusieurs mois.", ["notre", "nos", "votre", "leur"]],
    comprehension: ["Notre voiture est devant l’hôtel ; nous pouvons partir.", "À qui appartient la voiture ?", ["to the speakers", "to the hotel", "to a stranger", "to the driver alone"], "to the speakers"],
    advanced: [
      ["Notre voisin garde son chien pendant que nous fermons la maison.", "Quel mot indique le lien entre le voisin et les locuteurs ?", ["Notre", "voisin", "chien", "maison"]],
      ["Nous présentons notre projet, puis Paul explique sa proposition.", "Quel mot marque la possession des locuteurs devant projet ?", ["présentons", "notre", "projet", "sa"]],
      ["Notre équipe gagne le match, mais leur capitaine reçoit le prix.", "Quel mot signifie que l’équipe appartient au groupe qui parle ?", ["Notre", "équipe", "capitaine", "prix"]],
    ],
  },
];

export const lievreQuizBatch07 = specs.flatMap(authoredSet);
