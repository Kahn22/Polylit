import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

/** Stored editorial questions for Lièvre identities; never generated at learner runtime. */
const specs: AuthoredQuizSpec[] = [
  {
    key: "commere_address", surfaceFormId: "srf_commere", senseId: "sns_commere_primary", target: "commère", meaning: "good woman; gossip (familiar, old-fashioned)",
    early: [
      ["« Ma commère, approchez donc », dit la vieille voisine.", ["young gentleman", "honored judge", "foreign traveler"]],
      ["La commère du village connaît toutes les nouvelles.", ["schoolteacher", "silent child", "farm worker"]],
      ["Dans ce vieux conte, le renard appelle la poule sa commère.", ["queen", "enemy soldier", "servant boy"]],
    ],
    blank: ["La vieille ___ raconte encore les histoires du quartier.", ["commère", "comtesse", "bergère", "servante"]],
    comprehension: ["On appelle parfois cette voisine une commère parce qu’elle répète tous les secrets.", "Pourquoi lui donne-t-on ce nom ?", ["she repeats everyone’s secrets", "she owns the village inn", "she teaches the children", "she lives far away"], "she repeats everyone’s secrets"],
    advanced: [
      ["La commère bavarde avec la voisine devant le marché.", "Quel mot désigne familièrement la femme bavarde ?", ["commère", "voisine", "marché", "bavarde"]],
      ["« Écoutez, commère », dit le paysan à cette femme du village.", "Quel mot sert ici d’adresse familière ancienne ?", ["Écoutez", "commère", "paysan", "village"]],
      ["Dans la fable, une commère parle au renard, tandis que le marchand écoute.", "Quel mot peut désigner familièrement une femme ou une bavarde ?", ["fable", "commère", "renard", "marchand"]],
    ],
  },
  {
    key: "purger_cleanse", surfaceFormId: "srf_purger", senseId: "sns_purger_primary", target: "purger", meaning: "to purge; cleanse medically",
    early: [
      ["L’ancien médecin voulait purger son patient.", ["to feed", "to praise", "to question"]],
      ["On croyait autrefois pouvoir purger le corps avec certaines plantes.", ["to strengthen", "to decorate", "to measure"]],
      ["Ce remède devait purger le malade selon la médecine ancienne.", ["to entertain", "to awaken", "to reward"]],
    ],
    blank: ["Le médecin d’autrefois prescrivait cette herbe pour ___ le patient.", ["purger", "nourrir", "endormir", "féliciter"]],
    comprehension: ["Le praticien prépare une potion pour purger le malade.", "Quel est le but de la potion ?", ["to cleanse the patient’s body", "to improve the patient’s memory", "to color the patient’s hair", "to help the patient travel"], "to cleanse the patient’s body"],
    advanced: [
      ["Le médecin veut purger le malade avec une plante amère.", "Quel mot décrit l’ancien traitement destiné à vider ou nettoyer le corps ?", ["médecin", "purger", "malade", "plante"]],
      ["Pour purger son patient, l’apothicaire prépare un remède puissant.", "Quel infinitif désigne l’action médicale recherchée ?", ["purger", "patient", "apothicaire", "remède"]],
      ["La médecine moderne refuse de purger systématiquement chaque fièvre.", "Quel mot nomme la pratique d’évacuation corporelle ?", ["médecine", "moderne", "purger", "fièvre"]],
    ],
  },
  {
    key: "grains_small_doses", surfaceFormId: "srf_grains", senseId: "sns_grain_primary", target: "grains", meaning: "grains; small seeds or doses",
    early: [
      ["Quelques grains de blé restent sur la table.", ["branches", "bottles", "stones"]],
      ["L’apothicaire mesure deux grains de cette poudre.", ["cups", "sheets", "ropes"]],
      ["Trois grains tombent du petit sachet.", ["birds", "coins", "leaves"]],
    ],
    blank: ["Elle ajoute quatre ___ de sel dans le mortier.", ["grains", "graines", "grands", "grammes"]],
    comprehension: ["Le jardinier conserve plusieurs grains pour les semer au printemps.", "Que conserve le jardinier ?", ["small seeds", "garden tools", "flower pots", "tree branches"], "small seeds"],
    advanced: [
      ["Deux grains de riz tombent entre la tasse et l’assiette.", "Quel mot désigne les petits éléments de riz ?", ["grains", "riz", "tasse", "assiette"]],
      ["Le pharmacien pèse les grains, puis verse la poudre dans le flacon.", "Quel mot désigne ici de très petites quantités mesurées ?", ["pharmacien", "grains", "poudre", "flacon"]],
      ["Parmi les grains, les cailloux et les feuilles, seules les petites graines germeront.", "Quel mot peut désigner les petits éléments semblables à des graines ?", ["grains", "cailloux", "feuilles", "graines"]],
    ],
  },
  {
    key: "ellebore_plant", surfaceFormId: "srf_ellebore", senseId: "sns_ellebore_primary", target: "ellébore", meaning: "hellebore (a medicinal plant)",
    early: [
      ["L’ellébore fleurit malgré le froid.", ["oak", "wheat", "ivy"]],
      ["Les anciens attribuaient des vertus médicinales à l’ellébore.", ["rosemary", "mint", "lavender"]],
      ["Cette variété d’ellébore pousse dans le jardin ombragé.", ["mushroom", "fruit tree", "grass"]],
    ],
    blank: ["Autrefois, on préparait certains remèdes avec de l’___.", ["ellébore", "érable", "avoine", "argile"]],
    comprehension: ["Le botaniste montre un ellébore et explique que cette plante peut être toxique.", "Que montre le botaniste ?", ["a hellebore plant", "a medicinal bottle", "a poisonous insect", "a garden map"], "a hellebore plant"],
    advanced: [
      ["L’ellébore est une plante, tandis que le chêne est un arbre.", "Quel mot nomme la plante autrefois employée comme remède ?", ["ellébore", "plante", "chêne", "arbre"]],
      ["Le médecin ancien mentionne l’ellébore dans son traité de botanique.", "Quel mot désigne la plante médicinale citée ?", ["médecin", "ellébore", "traité", "botanique"]],
      ["Entre l’ellébore, la rose et le thym, l’apothicaire choisit la première plante.", "Quel mot désigne la plante choisie par l’apothicaire ?", ["ellébore", "rose", "thym", "apothicaire"]],
    ],
  },
  {
    key: "parie_bet", surfaceFormId: "srf_parie", senseId: "sns_parier_primary", target: "parie", meaning: "bet; wager",
    early: [
      ["Je parie que notre équipe gagnera.", ["doubt", "announce", "forget"]],
      ["Paul parie cinq euros sur le cheval gris.", ["borrows", "finds", "hides"]],
      ["Elle parie toujours sur le joueur le plus calme.", ["waits for", "speaks to", "runs beside"]],
    ],
    blank: ["Je ___ que le train arrivera avant midi.", ["parie", "pars", "pense", "promets"]],
    comprehension: ["Luc parie dix euros que Marie terminera la première.", "Que fait Luc ?", ["he makes a ten-euro bet", "he gives Marie ten euros", "he enters the race", "he stops the contest"], "he makes a ten-euro bet"],
    advanced: [
      ["Je parie sur le bateau bleu, mais Paul choisit le rouge.", "Quel mot indique que le locuteur fait un pari ?", ["parie", "bateau", "Paul", "rouge"]],
      ["Anne parie que la pluie cessera, tandis que Marc reste prudent.", "Quel mot exprime la mise d’Anne sur un résultat ?", ["Anne", "parie", "pluie", "prudent"]],
      ["Il parie une pièce, observe la course et attend le vainqueur.", "Quel mot désigne l’action de miser ?", ["parie", "pièce", "course", "vainqueur"]],
    ],
  },
];

export const lievreQuizBatch04 = specs.flatMap(authoredSet);
