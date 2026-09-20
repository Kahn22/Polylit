import type { EditorialQuizSet } from "./zola-editorial-quizzes.js";

export const zolaEditorialBatch23: Record<string, EditorialQuizSet> = {
  "faisaient:faire_causative": {
    early: "Ces menaces faisaient trembler les témoins.", englishChoices: ["were making", "were helping", "were watching", "were allowing"],
    intermediate: "Les courants d’air _____ claquer les portes toute la nuit.", frenchChoices: ["faisaient", "aidaient", "regardaient", "permettaient"],
    advanced: "Les nouvelles mesures faisaient augmenter les prix en imposant une taxe supplémentaire. Nina comparait les factures, Paul lisait le décret et Léa interrogeait les commerçants.", prompt: "Quel mot indique que les mesures causaient l’augmentation des prix ?", advancedChoices: ["faisaient", "imposant", "comparait", "interrogeait"],
  },
  "faisait:faire_causative": {
    early: "Le vent faisait trembler les fenêtres toute la nuit.", englishChoices: ["was making", "was watching", "was allowing", "was preventing"],
    intermediate: "La chaleur _____ fondre la glace très rapidement.", frenchChoices: ["faisait", "regardait", "permettait", "empêchait"],
    advanced: "La nouvelle faisait sourire Nina malgré sa fatigue. Paul rangeait les lettres, Léa fermait les rideaux et Marc préparait du thé.", prompt: "Quel mot indique que la nouvelle causait le sourire de Nina ?", advancedChoices: ["faisait", "rangeait", "fermait", "préparait"],
  },
  "faite:faire_done": {
    early: "La réparation est faite et la machine fonctionne de nouveau.", englishChoices: ["done", "delayed", "forgotten", "refused"],
    intermediate: "La copie sera _____ avant la fermeture du bureau.", frenchChoices: ["faite", "retardée", "oubliée", "refusée"],
    advanced: "La vérification est faite : chaque chiffre a été contrôlé. Nina signe le rapport, Paul classe les reçus et Léa ferme le dossier.", prompt: "Quel mot indique que la vérification a été accomplie ?", advancedChoices: ["faite", "contrôlé", "signe", "classe"],
  },
  "fasse:faire_done": {
    early: "Il faut que l’analyse se fasse avant toute décision.", englishChoices: ["be done", "be delayed", "be hidden", "be abandoned"],
    intermediate: "Le directeur exige que la réparation se _____ aujourd’hui.", frenchChoices: ["fasse", "retarde", "cache", "abandonne"],
    advanced: "Le juge veut que l’expertise se fasse en présence des deux parties. Nina ouvre la salle, Paul apporte le dossier et Léa appelle les avocats.", prompt: "Quel mot indique que l’expertise doit être accomplie ?", advancedChoices: ["fasse", "ouvre", "apporte", "appelle"],
  },
  "ferai:faire_primary": {
    early: "Demain, je ferai les démarches nécessaires auprès de la mairie.", englishChoices: ["will do", "will avoid", "will forget", "will postpone"],
    intermediate: "Je _____ une copie du document avant de l’envoyer.", frenchChoices: ["ferai", "éviterai", "oublierai", "reporterai"],
    advanced: "Je ferai le rapport demain en réunissant toutes les conclusions. Nina vérifiera les chiffres, Paul classera les annexes et Léa ouvrira le bureau.", prompt: "Quel mot indique que j’accomplirai le rapport ?", advancedChoices: ["ferai", "vérifiera", "classera", "ouvrira"],
  },
  "fit:faire_done": {
    early: "Le silence se fit lorsque le juge entra.", englishChoices: ["was made", "was broken", "was forgotten", "was refused"],
    intermediate: "Une ouverture se _____ soudain dans la foule.", frenchChoices: ["fit", "brisa", "oublia", "refusa"],
    advanced: "Un passage se fit entre les spectateurs, permettant au médecin d’avancer. Nina recula, Paul leva la corde et Léa ouvrit la porte.", prompt: "Quel mot indique qu’un passage se forma ?", advancedChoices: ["fit", "recula", "leva", "ouvrit"],
  },
  "font:faire_primary": {
    early: "Ces poutres font la structure principale du toit.", englishChoices: ["make", "damage", "hide", "measure"],
    intermediate: "Les témoignages concordants _____ la force de ce dossier.", frenchChoices: ["font", "abîment", "cachent", "mesurent"],
    advanced: "Les nombreuses preuves font de cette affaire un dossier solide. Nina relit les témoignages, Paul classe les photos et Léa appelle l’avocat.", prompt: "Quel mot indique que les preuves forment un dossier solide ?", advancedChoices: ["font", "relit", "classe", "appelle"],
  },
};
