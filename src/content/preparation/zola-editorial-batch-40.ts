import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";

export const zolaEditorialBatch40: Record<string, EditorialQuizSet> = {
  "président:president_head_of_state": {
    early: "Dans cet exercice, « Président » prend un sens précis : personne qui dirige une république ou préside une institution.", englishChoices: ["president", "minister", "judge", "senator"],
    intermediate: "Dans le glossaire, _____ correspond à cette définition : « personne qui dirige une république ou préside une institution ».", frenchChoices: ["Président", "ministre", "juge", "sénateur"],
    advanced: "Dans cette situation, le mot « Président » exprime précisément ceci : personne qui dirige une république ou préside une institution. Marc ouvre la fenêtre, tandis que Nina vérifie le registre, tandis que Paul lit la lettre.", prompt: "Quel mot du contexte signifie « personne qui dirige une république ou préside une institution » ?", advancedChoices: ["Président", "fenêtre", "registre", "lettre"],
  },
};
