import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";

export const zolaEditorialBatch39: Record<string, EditorialQuizSet> = {
  "pièce:piece_room": {
    early: "Ici, « pièce » sert à désigner ou exprimer ceci : espace intérieur délimité dans un bâtiment.", englishChoices: ["room", "document", "verdict", "letter"],
    intermediate: "Le terme précis pour exprimer « espace intérieur délimité dans un bâtiment » est _____.", frenchChoices: ["pièce", "document", "verdict", "lettre"],
    advanced: "Dans cette situation, le mot « pièce » exprime précisément ceci : espace intérieur délimité dans un bâtiment. Paul classe le dossier, tandis que Léa entre dans le bureau, tandis que Marc ouvre la fenêtre.", prompt: "Quel mot du contexte signifie « espace intérieur délimité dans un bâtiment » ?", advancedChoices: ["pièce", "dossier", "bureau", "fenêtre"],
  },
  "pièce:piece_document": {
    early: "Le professeur emploie « pièce » pour exprimer cette idée : document ou élément matériel présenté comme preuve dans une affaire.", englishChoices: ["document; piece of evidence", "room", "speech", "punishment"],
    intermediate: "Pour exprimer l’idée « document ou élément matériel présenté comme preuve dans une affaire », le mot attendu est _____.", frenchChoices: ["pièce", "salle", "discours", "châtiment"],
    advanced: "Dans cette situation, le mot « pièce » exprime précisément ceci : document ou élément matériel présenté comme preuve dans une affaire. Léa entre dans le bureau, tandis que Marc ouvre la fenêtre, tandis que Nina vérifie le registre.", prompt: "Quel mot du contexte signifie « document ou élément matériel présenté comme preuve dans une affaire » ?", advancedChoices: ["pièce", "bureau", "fenêtre", "registre"],
  },
};
