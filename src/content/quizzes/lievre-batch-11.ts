import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "la_article", surfaceFormId: "srf_la", senseId: "sns_le_primary", target: "la", meaning: "the (feminine singular article)",
    early: [
      ["La porte reste ouverte toute la nuit.", ["a", "this", "my"]],
      ["Paul traverse la rivière avant midi.", ["one", "that", "each"]],
      ["Nous suivons la route qui mène au village.", ["some", "another", "your"]],
    ],
    blank: ["Marie ferme ___ fenêtre avant de partir.", ["la", "le", "les", "un"]],
    comprehension: ["La cloche sonne lorsque le train arrive.", "Quel objet précis sonne ?", ["the bell", "a clock", "the train", "a door"], "the bell"],
    advanced: [
      ["La lampe éclaire la table, mais le reste de la pièce demeure sombre.", "Quel mot détermine lampe comme nom féminin défini ?", ["La", "lampe", "table", "pièce"]],
      ["Le voyageur regarde la carte et choisit un chemin plus court.", "Quel article féminin défini précède carte ?", ["voyageur", "la", "carte", "chemin"]],
      ["Nous quittons la maison tandis que Paul reste dans le jardin.", "Quel mot signifie the devant maison ?", ["quittons", "la", "Paul", "jardin"]],
    ],
  },
  {
    key: "sont_are", surfaceFormId: "srf_sont", senseId: "sns_etre_primary", target: "sont", meaning: "are",
    early: [
      ["Les portes sont fermées depuis hier.", ["were", "will be", "have"]],
      ["Paul et Marie sont dans le jardin.", ["go", "remain", "arrive"]],
      ["Ces deux chemins sont très différents.", ["seem", "become", "cross"]],
    ],
    blank: ["Les voyageurs ___ prêts à partir.", ["sont", "est", "sommes", "êtes"]],
    comprehension: ["Les clés sont sous le vieux livre.", "Où se trouvent les clés ?", ["under the old book", "inside the box", "beside the door", "on the table"], "under the old book"],
    advanced: [
      ["Les pommes sont mûres, mais les poires restent encore vertes.", "Quel mot est la troisième personne du pluriel de être ?", ["pommes", "sont", "poires", "restent"]],
      ["Paul et Luc sont voisins depuis leur enfance.", "Quel verbe relie les deux hommes à leur qualité de voisins ?", ["Paul", "sont", "voisins", "enfance"]],
      ["Ces lettres sont anciennes et leur écriture est difficile à lire.", "Quel mot signifie are dans cette phrase ?", ["lettres", "sont", "écriture", "lire"]],
    ],
  },
  {
    key: "celle_ci_this_one", surfaceFormId: "srf_celle_ci", senseId: "sns_celui_primary", target: "celle-ci", meaning: "this one (feminine)",
    early: [
      ["Entre les deux clés, celle-ci ouvre la porte.", ["that man", "these things", "the same place"]],
      ["Cette route est longue, mais celle-ci est plus sûre.", ["he", "those", "ours"]],
      ["Je préfère celle-ci parmi toutes les peintures.", ["this person", "that one over there", "each one"]],
    ],
    blank: ["Deux lettres sont arrivées ; ___ vient de Lyon.", ["celle-ci", "celui-ci", "celles-ci", "ceux-ci"]],
    comprehension: ["Marie montre deux robes et dit : « Celle-ci convient mieux à la cérémonie. »", "Quelle robe Marie juge-t-elle préférable ?", ["the one she indicates nearby", "both dresses", "neither dress", "a dress not present"], "the one she indicates nearby"],
    advanced: [
      ["La première boîte est vide ; celle-ci contient tous les documents.", "Quel pronom féminin désigne la boîte indiquée ?", ["première", "boîte", "celle-ci", "documents"]],
      ["Parmi ces chaises, celle-ci appartient à Paul et les autres au voisin.", "Quel mot signifie this one au féminin ?", ["chaises", "celle-ci", "Paul", "voisin"]],
      ["Regardez cette étoile : celle-ci brille davantage que les autres.", "Quel pronom reprend étoile ?", ["étoile", "celle-ci", "brille", "autres"]],
    ],
  },
  {
    key: "avec_with", surfaceFormId: "srf_avec", senseId: "sns_avec_primary", target: "avec", meaning: "with",
    early: [
      ["Paul voyage avec son frère.", ["without", "before", "behind"]],
      ["Elle coupe le pain avec un couteau.", ["under", "against", "among"]],
      ["Nous parlons avec le nouveau voisin.", ["about", "after", "toward"]],
    ],
    blank: ["Marie écrit ___ un crayon bleu.", ["avec", "sans", "dans", "pour"]],
    comprehension: ["Luc traverse la forêt avec un guide expérimenté.", "Qui accompagne Luc ?", ["an experienced guide", "his brother", "a merchant", "nobody"], "an experienced guide"],
    advanced: [
      ["Paul prépare le repas avec Marie, tandis que Luc met la table.", "Quel mot indique l’accompagnement de Marie ?", ["repas", "avec", "Marie", "table"]],
      ["Le menuisier mesure la planche avec une règle en métal.", "Quel mot introduit l’instrument utilisé ?", ["menuisier", "planche", "avec", "règle"]],
      ["Nous avançons avec prudence parce que le chemin devient étroit.", "Quel mot relie l’action à la manière prudente ?", ["avançons", "avec", "chemin", "étroit"]],
    ],
  },
  {
    key: "quatre_four", surfaceFormId: "srf_quatre", senseId: "sns_quatre_primary", target: "quatre", meaning: "four",
    early: [
      ["Quatre voyageurs attendent devant l’auberge.", ["two", "six", "ten"]],
      ["La table possède quatre pieds de bois.", ["three", "five", "eight"]],
      ["Elle partage le gâteau en quatre parts égales.", ["one", "seven", "twelve"]],
    ],
    blank: ["Paul a lu ___ chapitres ce matin.", ["quatre", "deux", "cinq", "neuf"]],
    comprehension: ["Le marchand place quatre pommes dans chaque panier.", "Combien de pommes met-il dans chaque panier ?", ["four", "three", "five", "eight"], "four"],
    advanced: [
      ["Quatre chevaux tirent la voiture et deux autres suivent derrière.", "Quel mot indique le nombre de chevaux qui tirent ?", ["Quatre", "chevaux", "voiture", "deux"]],
      ["La maison compte quatre fenêtres au premier étage.", "Quel nombre précède fenêtres ?", ["maison", "quatre", "fenêtres", "premier"]],
      ["Nous marcherons quatre kilomètres avant de faire une pause.", "Quel mot exprime la distance numérique ?", ["marcherons", "quatre", "kilomètres", "pause"]],
    ],
  },
];

export const lievreQuizBatch11 = specs.flatMap(authoredSet);
