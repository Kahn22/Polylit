import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "fut_was", surfaceFormId: "srf_fut", senseId: "sns_etre_primary", target: "fut", meaning: "was (literary simple past)",
    early: [
      ["Le voyage fut long et difficile.", ["will be", "becomes", "seems"]],
      ["La décision fut annoncée au matin.", ["is", "would be", "remains"]],
      ["Ce jour fut mémorable pour le village.", ["will become", "has", "appears"]],
    ],
    blank: ["La traversée ___ plus rapide que prévu.", ["fut", "furent", "sera", "soit"]],
    comprehension: ["Le repas fut excellent malgré la longue attente.", "Comment était le repas ?", ["it was excellent", "it will be late", "it was unfinished", "it became expensive"], "it was excellent"],
    advanced: [
      ["La nuit fut calme, mais le matin devint orageux.", "Quel mot est une forme littéraire passée de être ?", ["nuit", "fut", "matin", "devint"]],
      ["Son règne fut bref et son départ surprit la cour.", "Quel mot signifie était dans ce récit ?", ["règne", "fut", "départ", "cour"]],
      ["La réponse fut claire, puis le juge ferma le dossier.", "Quel mot relie la réponse à sa qualité dans le passé ?", ["réponse", "fut", "juge", "dossier"]],
    ],
  },
  {
    key: "fait_done", surfaceFormId: "srf_fait", senseId: "sns_faire_done", target: "fait", meaning: "done; completed",
    early: [
      ["Le travail est fait depuis ce matin.", ["forgotten", "delayed", "hidden"]],
      ["Une fois le choix fait, personne ne protesta.", ["discussed", "refused", "lost"]],
      ["Le repas fut fait avant l’arrivée des invités.", ["served", "purchased", "spoiled"]],
    ],
    blank: ["Tout est ___ ; nous pouvons maintenant partir.", ["fait", "fais", "font", "faire"]],
    comprehension: ["Le contrat est fait et les deux parties l’ont signé.", "Quel est l’état du contrat ?", ["it is completed", "it is missing", "it is being translated", "it was rejected"], "it is completed"],
    advanced: [
      ["Le travail fait repose sur la table avec le dossier inachevé.", "Quel mot indique que le travail est terminé ?", ["travail", "fait", "table", "inachevé"]],
      ["Le choix fut fait hier, mais l’annonce viendra demain.", "Quel mot signifie accompli ou décidé ?", ["choix", "fait", "annonce", "demain"]],
      ["Une promesse faite diffère d’un accord fait et signé.", "Quel mot masculin marque ici l’action accomplie ?", ["promesse", "accord", "fait", "signé"]],
    ],
  },
  {
    key: "fait_does", surfaceFormId: "srf_fait", senseId: "sns_faire_primary", target: "fait", meaning: "does; makes; takes",
    early: [
      ["Il fait trois pas vers la fenêtre.", ["sees", "counts", "erases"]],
      ["Paul fait son travail avant le dîner.", ["avoids", "loses", "describes"]],
      ["Le boulanger fait le pain chaque matin.", ["sells", "cuts", "carries"]],
    ],
    blank: ["Chaque jour, elle ___ un tour du jardin.", ["fait", "font", "fais", "faire"]],
    comprehension: ["Luc fait cinq pas puis s’arrête devant la porte.", "Que fait Luc avant de s’arrêter ?", ["he takes five steps", "he opens the door", "he calls a friend", "he sits on a chair"], "he takes five steps"],
    advanced: [
      ["Il fait deux pas, regarde la route et revient aussitôt.", "Quel mot exprime l’action d’effectuer les pas ?", ["fait", "pas", "route", "revient"]],
      ["Marie fait un dessin pendant que Paul lit un livre.", "Quel mot signifie réalise ou produit ?", ["Marie", "fait", "dessin", "livre"]],
      ["Le cuisinier fait la soupe, puis le serveur apporte les assiettes.", "Quel mot indique que le cuisinier prépare la soupe ?", ["cuisinier", "fait", "serveur", "assiettes"]],
    ],
  },
  {
    key: "fait_causative", surfaceFormId: "srf_fait", senseId: "sns_faire_causative", target: "fait", meaning: "makes; has someone do",
    early: [
      ["Le professeur fait lire le texte aux élèves.", ["allows the students to leave", "reads instead of the students", "hides the text"]],
      ["Cette nouvelle fait sourire toute la famille.", ["asks", "prevents", "forgets"]],
      ["Le guide fait avancer le groupe malgré la pluie.", ["watches", "finds", "abandons"]],
    ],
    blank: ["Le chef ___ préparer la salle par son équipe.", ["fait", "fais", "font", "faire"]],
    comprehension: ["La maîtresse fait écrire une phrase à chaque enfant.", "Quelle action la maîtresse provoque-t-elle ?", ["each child writes a sentence", "each child closes a book", "the class leaves early", "the teacher writes alone"], "each child writes a sentence"],
    advanced: [
      ["Le vent fait tomber les feuilles, puis la pluie mouille le chemin.", "Quel mot indique que le vent provoque la chute ?", ["vent", "fait", "feuilles", "pluie"]],
      ["Paul fait réparer sa montre par un artisan du quartier.", "Quel mot construit ici l’idée de faire exécuter une action ?", ["Paul", "fait", "montre", "artisan"]],
      ["Le capitaine fait monter les voyageurs pendant que le marin détache la corde.", "Quel mot signifie qu’il ordonne ou provoque l’embarquement ?", ["capitaine", "fait", "voyageurs", "marin"]],
    ],
  },
  {
    key: "mit_put", surfaceFormId: "srf_mit", senseId: "sns_mettre_primary", target: "mit", meaning: "put; placed (literary simple past)",
    early: [
      ["Elle mit la lettre dans le tiroir.", ["found", "read", "burned"]],
      ["Le serveur mit les verres sur la table.", ["washed", "broke", "counted"]],
      ["Paul mit son manteau avant de sortir.", ["sold", "lost", "folded"]],
    ],
    blank: ["Le juge ___ le document près du dossier.", ["mit", "met", "mît", "mis"]],
    comprehension: ["Marie mit les clés dans son sac puis ferma la porte.", "Que fit Marie avec les clés ?", ["she put them in her bag", "she left them in the door", "she gave them to Paul", "she dropped them outside"], "she put them in her bag"],
    advanced: [
      ["Il mit le livre sur l’étagère et rangea le cahier dans le tiroir.", "Quel mot signifie plaça dans ce récit ?", ["mit", "livre", "étagère", "cahier"]],
      ["La reine mit sa couronne, puis le roi ouvrit la cérémonie.", "Quel mot est la forme passée littéraire de mettre ?", ["reine", "mit", "couronne", "roi"]],
      ["Le marchand mit les pièces dans une boîte avant de fermer la boutique.", "Quel mot indique qu’il plaça les pièces ?", ["marchand", "mit", "pièces", "boîte"]],
    ],
  },
];

export const lievreQuizBatch05 = specs.flatMap(authoredSet);
