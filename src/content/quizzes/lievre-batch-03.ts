import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "sage_wise", surfaceFormId: "srf_sage", senseId: "sns_sage_primary", target: "sage", meaning: "wise; sensible",
    early: [
      ["Son conseil est sage et prudent.", ["careless", "noisy", "rapid"]],
      ["Il serait sage d’attendre avant de répondre.", ["dangerous", "impossible", "amusing"]],
      ["Cette décision sage évite un conflit inutile.", ["foolish", "sudden", "secret"]],
    ],
    blank: ["Écouter les deux témoins serait une décision ___.", ["sage", "lourde", "bruyante", "étroite"]],
    comprehension: ["Claire est sage : elle réfléchit avant d’agir.", "Pourquoi Claire est-elle décrite ainsi ?", ["she thinks before acting", "she speaks very loudly", "she runs every morning", "she refuses all advice"], "she thinks before acting"],
    advanced: [
      ["Un choix sage protège le village, tandis qu’un choix imprudent le menace.", "Quel mot qualifie le choix réfléchi ?", ["choix", "sage", "village", "imprudent"]],
      ["Le vieux juge donne une réponse sage après une longue réflexion.", "Quel mot signifie raisonnable et avisé ?", ["juge", "réponse", "sage", "réflexion"]],
      ["Marie reste sage, mais son frère agit sans réfléchir.", "Quel mot décrit la personne raisonnable ?", ["Marie", "sage", "frère", "réfléchir"]],
    ],
  },
  {
    key: "repartit_replied", surfaceFormId: "srf_repartit", senseId: "sns_repartir_primary", target: "repartit", meaning: "replied; retorted",
    early: [
      ["« Vous vous trompez », repartit le témoin.", ["departed again", "fell asleep", "laughed"]],
      ["Le juge posa une question ; l’avocat repartit calmement.", ["ran away", "closed the door", "wrote a letter"]],
      ["« J’accepte le défi », repartit-elle aussitôt.", ["she whispered", "she returned home", "she hesitated"]],
    ],
    blank: ["« Cette accusation est fausse », ___ le marchand.", ["repartit", "repartait", "partit", "dormit"]],
    comprehension: ["Paul demanda une preuve ; Luc repartit qu’il avait un témoin.", "Que fit Luc ?", ["he replied", "he left again", "he hid the evidence", "he called the judge"], "he replied"],
    advanced: [
      ["« Non », repartit le berger, puis le voyageur garda le silence.", "Quel mot introduit la réponse du berger ?", ["Non", "repartit", "berger", "silence"]],
      ["La reine interrogea le messager, qui repartit avec assurance.", "Quel mot signifie répondit dans ce récit ?", ["reine", "messager", "repartit", "assurance"]],
      ["« Je connais la route », repartit Jeanne devant le guide étonné.", "Quel mot indique que Jeanne répond ?", ["route", "repartit", "guide", "étonné"]],
    ],
  },
  {
    key: "animal_creature", surfaceFormId: "srf_animal", senseId: "sns_animal_primary", target: "animal", meaning: "animal",
    early: [
      ["Cet animal vit dans la forêt.", ["plant", "building", "tool"]],
      ["Le vétérinaire examine un animal blessé.", ["machine", "document", "tree"]],
      ["Chaque animal reçoit de l’eau fraîche.", ["visitor", "vehicle", "instrument"]],
    ],
    blank: ["Le renard est un ___ sauvage.", ["animal", "arbre", "chemin", "village"]],
    comprehension: ["Un animal inconnu laisse des traces près de la rivière.", "Qu’est-ce qui laisse des traces ?", ["an animal", "a boat", "a traveler", "a falling branch"], "an animal"],
    advanced: [
      ["L’animal boit près du ruisseau pendant que le berger attend.", "Quel mot désigne l’être vivant qui boit ?", ["animal", "ruisseau", "berger", "attend"]],
      ["Ce chien est un animal fidèle, mais ce chêne est un arbre.", "Quel mot classe le chien parmi les êtres vivants mobiles ?", ["chien", "animal", "chêne", "arbre"]],
      ["Le naturaliste observe un animal, une plante et une pierre.", "Quel mot désigne la créature observée ?", ["naturaliste", "animal", "plante", "pierre"]],
    ],
  },
  {
    key: "leger_light", surfaceFormId: "srf_leger", senseId: "sns_leger_primary", target: "léger", meaning: "light; nimble",
    early: [
      ["Ce sac est assez léger pour un enfant.", ["heavy", "fragile", "empty"]],
      ["D’un pas léger, la danseuse traverse la scène.", ["slow", "uncertain", "noisy"]],
      ["Un vent léger agite les feuilles.", ["violent", "cold", "constant"]],
    ],
    blank: ["Ce petit colis est si ___ que je le porte d’une main.", ["léger", "légère", "lourd", "solide"]],
    comprehension: ["Le colis est léger ; Paul peut le soulever facilement.", "Pourquoi Paul le soulève-t-il facilement ?", ["it is light", "it is open", "it is valuable", "it is nearby"], "it is light"],
    advanced: [
      ["Le danseur léger bondit, tandis que son partenaire lourd marche lentement.", "Quel mot décrit le danseur agile ?", ["danseur", "léger", "lourd", "lentement"]],
      ["Ce tissu léger sèche vite, mais la couverture épaisse reste humide.", "Quel mot indique que le tissu pèse peu ?", ["tissu", "léger", "couverture", "humide"]],
      ["Un oiseau léger quitte la branche avant le lourd corbeau.", "Quel mot qualifie l’oiseau peu pesant ?", ["oiseau", "léger", "branche", "corbeau"]],
    ],
  },
  {
    key: "ma_my", surfaceFormId: "srf_ma", senseId: "sns_mon_primary", target: "Ma", meaning: "my (feminine singular)",
    early: [
      ["Ma sœur arrive demain.", ["your", "his", "our"]],
      ["Je cherche ma veste noire.", ["your", "her", "their"]],
      ["Ma réponse est définitive.", ["this", "that", "every"]],
    ],
    blank: ["Voici ___ nouvelle adresse.", ["Ma", "Mon", "Mes", "Ta"]],
    comprehension: ["Ma voiture est garée devant la maison.", "À qui appartient la voiture ?", ["to the speaker", "to the listener", "to Paul", "to the neighbors"], "to the speaker"],
    advanced: [
      ["Ma tante prépare le repas, et ton oncle apporte le pain.", "Quel mot indique que la tante est liée au locuteur ?", ["Ma", "tante", "ton", "oncle"]],
      ["Je ferme ma valise avant de prendre notre voiture.", "Quel mot marque la possession du locuteur devant valise ?", ["ferme", "ma", "valise", "notre"]],
      ["Ma décision surprend Paul, mais sa réponse rassure Marie.", "Quel mot signifie que la décision appartient au locuteur ?", ["Ma", "décision", "sa", "réponse"]],
    ],
  },
];

export const lievreQuizBatch03 = specs.flatMap(authoredSet);
