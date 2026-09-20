import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "ainsi_thus", surfaceFormId: "srf_ainsi", senseId: "sns_ainsi_primary", target: "ainsi", meaning: "thus; in this way",
    early: [
      ["Placez les livres ainsi, dans cet ordre précis.", ["elsewhere", "yesterday", "together"]],
      ["Il parla ainsi devant toute l’assemblée.", ["quietly", "later", "outside"]],
      ["Ainsi se termina leur long voyage.", ["Perhaps", "Never", "Soon"]],
    ],
    blank: ["Faites ___ et tout ira bien.", ["ainsi", "aussi", "alors", "ailleurs"]],
    comprehension: ["Paul montre le mouvement, puis dit : « Tenez l’outil ainsi. »", "Comment faut-il tenir l’outil ?", ["in the way Paul demonstrates", "with both hands", "above the table", "without moving it"], "in the way Paul demonstrates"],
    advanced: [
      ["Marie plie la lettre ainsi et la place dans une petite enveloppe.", "Quel mot signifie de cette manière ?", ["Marie", "lettre", "ainsi", "enveloppe"]],
      ["Ainsi commence l’histoire, tandis que la fin demeure encore inconnue.", "Quel mot introduit la manière dont l’histoire commence ?", ["Ainsi", "histoire", "fin", "inconnue"]],
      ["Le juge en décida ainsi après avoir entendu les deux témoins.", "Quel mot renvoie à la décision prise de cette façon ?", ["juge", "ainsi", "entendu", "témoins"]],
    ],
  },
  {
    key: "tous_all", surfaceFormId: "srf_tous", senseId: "sns_tout_primary", target: "tous", meaning: "all; everyone",
    early: [
      ["Tous les voyageurs descendent du train.", ["some", "two", "no"]],
      ["Ils sont tous prêts avant le lever du soleil.", ["almost", "already", "perhaps"]],
      ["Tous connaissent le chemin du village.", ["nobody", "one person", "few people"]],
    ],
    blank: ["Les élèves ont ___ terminé leur travail.", ["tous", "tout", "toutes", "chaque"]],
    comprehension: ["Tous les bateaux sont rentrés au port avant la tempête.", "Combien de bateaux sont rentrés ?", ["all of them", "only one", "half of them", "none of them"], "all of them"],
    advanced: [
      ["Tous les voisins viennent aider, mais Paul reste chez lui.", "Quel mot indique la totalité des voisins ?", ["Tous", "voisins", "Paul", "lui"]],
      ["Les invités sont tous assis autour de la grande table.", "Quel mot signifie sans exception ?", ["invités", "tous", "assis", "table"]],
      ["Nous les avons tous entendus malgré le bruit de la foule.", "Quel mot indique que personne dans le groupe ne manque ?", ["Nous", "tous", "bruit", "foule"]],
    ],
  },
  {
    key: "deux_two", surfaceFormId: "srf_deux", senseId: "sns_deux_primary", target: "deux", meaning: "two",
    early: [
      ["Deux oiseaux se posent sur le toit.", ["one", "three", "ten"]],
      ["Paul achète deux pains au marché.", ["four", "six", "eight"]],
      ["La route traverse deux petits villages.", ["five", "seven", "nine"]],
    ],
    blank: ["Marie attend depuis ___ heures.", ["deux", "trois", "quatre", "douze"]],
    comprehension: ["Le jardin possède deux portes, une au nord et une au sud.", "Combien de portes le jardin possède-t-il ?", ["two", "one", "three", "four"], "two"],
    advanced: [
      ["Deux chevaux tirent la voiture et un troisième suit derrière.", "Quel mot indique le nombre de chevaux qui tirent ?", ["Deux", "chevaux", "voiture", "troisième"]],
      ["Paul partage le pain en deux parts égales.", "Quel nombre précise les parts ?", ["Paul", "pain", "deux", "parts"]],
      ["Les deux lettres portent la même signature, mais leurs dates diffèrent.", "Quel mot exprime le nombre de lettres ?", ["deux", "lettres", "signature", "dates"]],
    ],
  },
  {
    key: "les_article", surfaceFormId: "srf_les", senseId: "sns_le_primary", target: "les", meaning: "the (plural article)",
    early: [
      ["Les fenêtres donnent sur la rivière.", ["some", "these", "our"]],
      ["Paul ferme les portes avant la nuit.", ["a", "each", "two"]],
      ["Nous suivons les chemins indiqués sur la carte.", ["several", "those", "your"]],
    ],
    blank: ["Marie range ___ livres sur l’étagère.", ["les", "le", "la", "un"]],
    comprehension: ["Les cloches sonnent lorsque les voyageurs arrivent.", "Quels objets précis sonnent ?", ["the bells", "the clocks", "the doors", "the trains"], "the bells"],
    advanced: [
      ["Les nuages cachent le soleil, mais la pluie ne tombe pas encore.", "Quel article défini pluriel précède nuages ?", ["Les", "nuages", "soleil", "pluie"]],
      ["Le marchand compte les pièces et ferme ensuite la caisse.", "Quel mot signifie the devant le nom pluriel pièces ?", ["marchand", "les", "pièces", "caisse"]],
      ["Nous regardons les bateaux quitter lentement le port.", "Quel mot détermine bateaux comme groupe défini ?", ["regardons", "les", "bateaux", "port"]],
    ],
  },
  {
    key: "pas_step", surfaceFormId: "srf_pas_noun", senseId: "sns_pas_step", target: "pas", meaning: "step; pace",
    early: [
      ["Paul fait un pas vers la porte.", ["refusal", "road", "jump"]],
      ["Chaque pas laisse une trace dans la neige.", ["voice", "wheel", "branch"]],
      ["Le voyageur avance d’un pas prudent.", ["word", "dream", "signal"]],
    ],
    blank: ["Elle recule d’un ___ en entendant le bruit.", ["pas", "pied", "tour", "coup"]],
    comprehension: ["Luc fait trois pas, puis s’arrête devant le précipice.", "Que fait Luc avant de s’arrêter ?", ["he takes three steps", "he calls for help", "he crosses the bridge", "he turns around"], "he takes three steps"],
    advanced: [
      ["Son premier pas est hésitant, mais il avance ensuite avec assurance.", "Quel nom désigne le mouvement d’un pied ?", ["premier", "pas", "avance", "assurance"]],
      ["Nous entendons chaque pas dans le couloir silencieux.", "Quel mot désigne ici un bruit de marche ?", ["entendons", "pas", "couloir", "silencieux"]],
      ["Le guide marche d’un pas rapide tandis que le groupe peine à le suivre.", "Quel mot signifie allure de marche ?", ["guide", "pas", "groupe", "suivre"]],
    ],
  },
];

export const lievreQuizBatch13 = specs.flatMap(authoredSet);
