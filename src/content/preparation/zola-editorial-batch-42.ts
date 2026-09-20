import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";

export const zolaEditorialBatch42: Record<string, EditorialQuizSet> = {
  "puis:puis_then": {
    early: "Le professeur emploie « puis » pour exprimer cette idée : indique qu’une action ou un fait vient après un autre.", englishChoices: ["then", "before", "never", "perhaps"],
    intermediate: "Pour exprimer l’idée « indique qu’une action ou un fait vient après un autre », le mot attendu est _____.", frenchChoices: ["puis", "avant", "jamais", "peut-être"],
    advanced: "Dans cette situation, le mot « puis » exprime précisément ceci : indique qu’une action ou un fait vient après un autre. Nina consulte le rapport, tandis que Paul classe le dossier, tandis que Léa entre dans le bureau.", prompt: "Quel mot du contexte signifie « indique qu’une action ou un fait vient après un autre » ?", advancedChoices: ["puis", "rapport", "dossier", "bureau"],
  },
  "pu:pouvoir_past_ability": {
    early: "Dans cet exercice, « pu » prend un sens précis : forme du verbe pouvoir indiquant une possibilité ou une capacité passée.", englishChoices: ["could; was able to", "must have", "wanted to", "would leave"],
    intermediate: "Dans le glossaire, _____ correspond à cette définition : « forme du verbe pouvoir indiquant une possibilité ou une capacité passée ».", frenchChoices: ["pu", "devait", "voulait", "partirait"],
    advanced: "Dans cette situation, le mot « pu » exprime précisément ceci : forme du verbe pouvoir indiquant une possibilité ou une capacité passée. Paul classe le dossier, tandis que Léa entre dans le bureau, tandis que Marc ouvre la fenêtre.", prompt: "Quel mot du contexte signifie « forme du verbe pouvoir indiquant une possibilité ou une capacité passée » ?", advancedChoices: ["pu", "dossier", "bureau", "fenêtre"],
  },
};
