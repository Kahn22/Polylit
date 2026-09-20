import { zolaEditorialBatch02 } from "./zola-editorial-batch-02.js";
import { zolaEditorialBatch03 } from "./zola-editorial-batch-03.js";
import { zolaEditorialBatch04 } from "./zola-editorial-batch-04.js";
import { zolaEditorialBatch05 } from "./zola-editorial-batch-05.js";
import { zolaEditorialBatch05b } from "./zola-editorial-batch-05b.js";
import { zolaEditorialBatch06 } from "./zola-editorial-batch-06.js";
import { zolaEditorialBatch07 } from "./zola-editorial-batch-07.js";
import { zolaEditorialBatch08 } from "./zola-editorial-batch-08.js";
import { zolaEditorialBatch09 } from "./zola-editorial-batch-09.js";
import { zolaEditorialBatch10 } from "./zola-editorial-batch-10.js";
import { zolaEditorialBatch11 } from "./zola-editorial-batch-11.js";
import { zolaEditorialBatch12 } from "./zola-editorial-batch-12.js";
import { zolaEditorialBatch13 } from "./zola-editorial-batch-13.js";
import { zolaEditorialBatch14 } from "./zola-editorial-batch-14.js";
import { zolaEditorialBatch15 } from "./zola-editorial-batch-15.js";
import { zolaEditorialBatch16 } from "./zola-editorial-batch-16.js";
import { zolaEditorialBatch17 } from "./zola-editorial-batch-17.js";
import { zolaEditorialBatch18 } from "./zola-editorial-batch-18.js";
import { zolaEditorialBatch19 } from "./zola-editorial-batch-19.js";
import { zolaEditorialBatch20 } from "./zola-editorial-batch-20.js";
import { zolaEditorialBatch21 } from "./zola-editorial-batch-21.js";
import { zolaEditorialBatch22 } from "./zola-editorial-batch-22.js";
import { zolaEditorialBatch23 } from "./zola-editorial-batch-23.js";
import { zolaEditorialBatch24 } from "./zola-editorial-batch-24.js";
import { zolaEditorialBatch25 } from "./zola-editorial-batch-25.js";
import { zolaEditorialBatch26 } from "./zola-editorial-batch-26.js";
import { zolaEditorialBatch27 } from "./zola-editorial-batch-27.js";
import { zolaEditorialBatch28 } from "./zola-editorial-batch-28.js";
import { zolaEditorialBatch29 } from "./zola-editorial-batch-29.js";
import { zolaEditorialBatch30 } from "./zola-editorial-batch-30.js";
import { zolaEditorialBatch31 } from "./zola-editorial-batch-31.js";
import { zolaEditorialBatch32 } from "./zola-editorial-batch-32.js";
import { zolaEditorialBatch33 } from "./zola-editorial-batch-33.js";
import { zolaEditorialBatch34 } from "./zola-editorial-batch-34.js";
import { zolaEditorialBatch35 } from "./zola-editorial-batch-35.js";
import { zolaEditorialBatch36 } from "./zola-editorial-batch-36.js";
import { zolaEditorialBatch37 } from "./zola-editorial-batch-37.js";
import { zolaEditorialBatch38 } from "./zola-editorial-batch-38.js";
import { zolaEditorialBatch39 } from "./zola-editorial-batch-39.js";
import { zolaEditorialBatch40 } from "./zola-editorial-batch-40.js";
import { zolaEditorialBatch41 } from "./zola-editorial-batch-41.js";
import { zolaEditorialBatch42 } from "./zola-editorial-batch-42.js";
import { zolaEditorialBatch43 } from "./zola-editorial-batch-43.js";
import { zolaEditorialBatch44 } from "./zola-editorial-batch-44.js";
import { zolaEditorialBatch45 } from "./zola-editorial-batch-45.js";
import { zolaEditorialBatch46 } from "./zola-editorial-batch-46.js";
import { zolaEditorialBatch47 } from "./zola-editorial-batch-47.js";
import { zolaEditorialBatch48 } from "./zola-editorial-batch-48.js";
import { zolaEditorialBatch49 } from "./zola-editorial-batch-49.js";
import { zolaEditorialBatch50 } from "./zola-editorial-batch-50.js";

/** Independently written contexts for vocabulary identities in the J’Accuse review. */
export interface EditorialQuizSet {
  early: string;
  englishChoices: [string, string, string, string];
  intermediate: string;
  frenchChoices: [string, string, string, string];
  advanced: string;
  prompt: string;
  advancedChoices: [string, string, string, string];
}

export const zolaEditorialQuizzes: Record<string, EditorialQuizSet> = {
  ...zolaEditorialBatch02,
  ...zolaEditorialBatch03,
  ...zolaEditorialBatch04,
  ...zolaEditorialBatch05,
  ...zolaEditorialBatch05b,
  ...zolaEditorialBatch06,
  ...zolaEditorialBatch07,
  ...zolaEditorialBatch08,
  ...zolaEditorialBatch09,
  ...zolaEditorialBatch10,
  ...zolaEditorialBatch11,
  ...zolaEditorialBatch12,
  ...zolaEditorialBatch13,
  ...zolaEditorialBatch14,
  ...zolaEditorialBatch15,
  ...zolaEditorialBatch16,
  ...zolaEditorialBatch17,
  ...zolaEditorialBatch18,
  ...zolaEditorialBatch19,
  ...zolaEditorialBatch20,
  ...zolaEditorialBatch21,
  ...zolaEditorialBatch22,
  ...zolaEditorialBatch23,
  ...zolaEditorialBatch24,
  ...zolaEditorialBatch25,
  ...zolaEditorialBatch26,
  ...zolaEditorialBatch27,
  ...zolaEditorialBatch28,
  ...zolaEditorialBatch29,
  ...zolaEditorialBatch30,
  ...zolaEditorialBatch31,
  ...zolaEditorialBatch32,
  ...zolaEditorialBatch33,
  ...zolaEditorialBatch34,
  ...zolaEditorialBatch35,
  ...zolaEditorialBatch36,
  ...zolaEditorialBatch37,
  ...zolaEditorialBatch38,
  ...zolaEditorialBatch39,
  ...zolaEditorialBatch40,
  ...zolaEditorialBatch41,
  ...zolaEditorialBatch42,
  ...zolaEditorialBatch43,
  ...zolaEditorialBatch44,
  ...zolaEditorialBatch45,
  ...zolaEditorialBatch46,
  ...zolaEditorialBatch47,
  ...zolaEditorialBatch48,
  ...zolaEditorialBatch49,
  ...zolaEditorialBatch50,
  "a:avoir_possess_auxiliary": {
    early: "Léa a un vélo rouge.", englishChoices: ["has", "wants", "borrows", "repairs"],
    intermediate: "Marc _____ un frère et deux sœurs.", frenchChoices: ["a", "ont", "sont", "êtes"],
    advanced: "Léa a un chien et habite près du parc. Paul possède un chat et revient chez lui.",
    prompt: "Quel mot indique que Léa possède un chien ?", advancedChoices: ["a", "habite", "possède", "revient"],
  },
  "abominable:abominable": {
    early: "L’odeur de la poubelle est abominable.", englishChoices: ["appalling", "pleasant", "faint", "ordinary"],
    intermediate: "Cette odeur de déchets pourris est _____.", frenchChoices: ["abominable", "agréable", "parfumée", "délicieuse"],
    advanced: "Une odeur abominable sort de la poubelle. Le café est agréable, le pain est tiède et la fenêtre est ouverte.",
    prompt: "Quel mot qualifie l’odeur insupportable ?", advancedChoices: ["abominable", "agréable", "tiède", "ouverte"],
  },
  "abomination:abomination": {
    early: "Le juge qualifie cet acte cruel d’abomination.", englishChoices: ["atrocity", "compliment", "accident", "inconvenience"],
    intermediate: "Il dénonce ce massacre comme une _____.", frenchChoices: ["abomination", "récompense", "fête", "réussite"],
    advanced: "Le témoin décrit une abomination : des innocents ont été tués. Il demande justice, tandis que la foule attend en silence.",
    prompt: "Quel nom désigne ici un acte extrêmement odieux ?", advancedChoices: ["abomination", "justice", "foule", "silence"],
  },
  "abord:d_abord": {
    early: "D’abord, nous lisons la lettre ; ensuite, nous répondons.", englishChoices: ["first", "outside", "quietly", "again"],
    intermediate: "D’_____, prépare tes affaires ; ensuite, appelle un taxi.", frenchChoices: ["abord", "abords", "aborder", "abordé"],
    advanced: "D’abord, Nora lit l’adresse ; ensuite, elle écrit une lettre. Enfin, elle ferme l’enveloppe.",
    prompt: "Quel choix forme avec « d’ » l’expression qui annonce la première étape ?", advancedChoices: ["abord", "ensuite", "Enfin", "adresse"],
  },
  "abouti:aboutir_result": {
    early: "Après plusieurs essais, leur projet a abouti.", englishChoices: ["succeeded", "failed", "stopped", "vanished"],
    intermediate: "Leur long travail a finalement _____ à un accord.", frenchChoices: ["abouti", "renoncé", "échoué", "résisté"],
    advanced: "Le débat a abouti à un accord. La salle est restée calme, le président a signé le texte et les invités ont applaudi.",
    prompt: "Quel mot indique que le débat a conduit à un résultat ?", advancedChoices: ["abouti", "calme", "signé", "applaudi"],
  },
  "abrège:abreger_shorten": {
    early: "Je vois que l’heure passe ; j’abrège mon récit.", englishChoices: ["shorten", "repeat", "invent", "forget"],
    intermediate: "Pour gagner du temps, j’_____ le compte rendu en supprimant les détails.", frenchChoices: ["abrège", "allonge", "copie", "imprime"],
    advanced: "Quand le temps manque, j’abrège mon récit. Mon voisin répète une phrase, la secrétaire copie le titre et l’orateur décrit la scène.",
    prompt: "Quel verbe signifie que je raccourcis mon récit ?", advancedChoices: ["abrège", "répète", "copie", "décrit"],
  },
  "abritant:abriter_shelter": {
    early: "Luc reste au sec en s’abritant sous un auvent.", englishChoices: ["sheltering", "wandering", "shouting", "searching"],
    intermediate: "Luc reste au sec en s’_____ sous un auvent pendant l’averse.", frenchChoices: ["abritant", "exposant", "éloignant", "égarant"],
    advanced: "En s’abritant sous l’auvent, Luc reste au sec. Marie court vers la porte, Paul cherche son manteau et Léa ferme la fenêtre.",
    prompt: "Quel mot exprime le fait de se protéger de la pluie ?", advancedChoices: ["abritant", "court", "cherche", "ferme"],
  },
  "absence:absence": {
    early: "En l’absence de Léa, Paul ouvre la boutique.", englishChoices: ["absence", "arrival", "approval", "invitation"],
    intermediate: "Le bureau est fermé aujourd’hui à cause de l’_____ du directeur, qui est malade.", frenchChoices: ["absence", "arrivée", "aide", "invitation"],
    advanced: "L’absence du médecin retarde la visite. La secrétaire prévient les patients, vérifie le calendrier et ferme la salle d’attente.",
    prompt: "Quel mot indique que le médecin n’est pas présent ?", advancedChoices: ["absence", "secrétaire", "calendrier", "salle"],
  },
  "absolu:absolu_complete": {
    early: "Le règlement donne au chef un pouvoir absolu.", englishChoices: ["absolute", "limited", "temporary", "uncertain"],
    intermediate: "Il exerce un pouvoir _____, sans aucune restriction.", frenchChoices: ["absolu", "limité", "partagé", "provisoire"],
    advanced: "Le directeur revendique un pouvoir absolu. Le conseil propose un contrôle annuel, le budget reste limité et le vote est provisoire.",
    prompt: "Quel mot indique que le pouvoir du directeur est sans restriction ?", advancedChoices: ["absolu", "annuel", "limité", "provisoire"],
  },
  "absolue:absolu_complete": {
    early: "L’interdiction est absolue : personne ne peut entrer.", englishChoices: ["absolute", "limited", "optional", "temporary"],
    intermediate: "La règle est _____ : aucune exception n’est permise.", frenchChoices: ["absolue", "limitée", "facultative", "provisoire"],
    advanced: "La règle est absolue : aucun visiteur n’entre. La porte reste fermée, le gardien est attentif et le couloir est vide.",
    prompt: "Quel mot exprime l’absence de toute exception à la règle ?", advancedChoices: ["absolue", "fermée", "attentif", "vide"],
  },
  "accablante:accablant_damning": {
    early: "Le rapport présente une preuve accablante contre le suspect.", englishChoices: ["damning", "minor", "irrelevant", "unclear"],
    intermediate: "La preuve est _____ : elle démontre clairement sa culpabilité.", frenchChoices: ["accablante", "fragile", "incertaine", "inutile"],
    advanced: "La preuve est accablante : la caméra montre le geste du suspect. Le témoin est calme, la salle est silencieuse et le juge reste attentif.",
    prompt: "Quel mot qualifie la force de la preuve contre le suspect ?", advancedChoices: ["accablante", "calme", "silencieuse", "attentif"],
  },
  "accablantes:accablant_damning": {
    early: "Les preuves accablantes convainquent le juge.", englishChoices: ["damning", "weak", "irrelevant", "conflicting"],
    intermediate: "Les images montrent clairement le vol ; ces preuves sont _____.", frenchChoices: ["accablantes", "fragiles", "inutiles", "contradictoires"],
    advanced: "Les preuves accablantes pèsent contre le suspect. Les témoins sont prudents, les archives sont anciennes et les explications sont brèves.",
    prompt: "Quel mot indique que les preuves pèsent lourdement contre le suspect ?", advancedChoices: ["accablantes", "prudents", "anciennes", "brèves"],
  },
  "accabler:accabler_incriminate": {
    early: "Les nouveaux témoignages vont accabler le suspect.", englishChoices: ["incriminate", "clear", "help", "comfort"],
    intermediate: "Ces documents peuvent _____ le suspect : ils prouvent qu’il a menti.", frenchChoices: ["accabler", "innocenter", "rassurer", "féliciter"],
    advanced: "Ces nouveaux éléments vont accabler le suspect. Un témoin confirme les faits, le médecin examine le dossier et l’avocat prépare sa réponse.",
    prompt: "Quel verbe signifie ici charger le suspect de preuves ?", advancedChoices: ["accabler", "confirme", "examine", "prépare"],
  },
  "acclamations:acclamation_cheers": {
    early: "La chanteuse reçoit des acclamations après le concert.", englishChoices: ["cheers", "complaints", "warnings", "questions"],
    intermediate: "À la fin du concert, la salle éclate en _____ pour applaudir la chanteuse.", frenchChoices: ["acclamations", "protestations", "disputes", "plaintes"],
    advanced: "Après le spectacle, les acclamations remplissent la salle. Des fleurs couvrent la scène, les rideaux se ferment et les musiciens saluent le public.",
    prompt: "Quel mot désigne les cris enthousiastes du public ?", advancedChoices: ["acclamations", "fleurs", "rideaux", "musiciens"],
  },
  "accommoder:accommoder_tolerate": {
    early: "Luc apprend à s’accommoder du bruit dans cet immeuble.", englishChoices: ["tolerate", "measure", "create", "explain"],
    intermediate: "Il accepte de vivre avec ces règles et apprend à s’_____ de la situation.", frenchChoices: ["accommoder", "accommode", "accommodé", "accommodent"],
    advanced: "Il faut s’accommoder du bruit pour travailler ici. Luc préfère protester, Marie essaie de dormir et Paul décide de partir.",
    prompt: "Quel verbe signifie accepter ce désagrément ?", advancedChoices: ["accommoder", "protester", "dormir", "partir"],
  },
  "accomplis:accomplir_perform": {
    early: "J’accomplis ma tâche chaque matin.", englishChoices: ["I carry out", "I postpone", "I avoid", "I abandon"],
    intermediate: "Je m’applique et j’_____ toutes les tâches qui me sont confiées.", frenchChoices: ["accomplis", "oublie", "évite", "ignore"],
    advanced: "J’accomplis la mission prévue. Luc range les outils, Marie écrit le rapport et Paul ferme la porte.",
    prompt: "Quel mot indique que je réalise la mission ?", advancedChoices: ["accomplis", "range", "écrit", "ferme"],
  },
  "accord:accord_agreement": {
    early: "L’accord entre les deux équipes met fin au conflit.", englishChoices: ["agreement", "dispute", "order", "delay"],
    intermediate: "Après des concessions réciproques, les deux voisins signent un _____ pour partager le jardin à l’amiable.", frenchChoices: ["accord", "conflit", "mensonge", "doute"],
    advanced: "Après de longues discussions, un accord rapproche les voisins. Le désaccord avait duré un mois, une lettre reste sur la table et le jardin ouvre demain.",
    prompt: "Quel mot désigne l’entente obtenue ?", advancedChoices: ["accord", "désaccord", "lettre", "jardin"],
  },
  "accueil:accueil_reception": {
    early: "L’accueil chaleureux de Nina rassure les visiteurs.", englishChoices: ["welcome", "refusal", "farewell", "warning"],
    intermediate: "Les visiteurs remercient leur hôtesse pour son _____ chaleureux.", frenchChoices: ["accueil", "refus", "départ", "silence"],
    advanced: "À l’arrivée des invités, l’accueil de Nina est chaleureux. Elle ouvre la porte, montre le salon et sert du thé.",
    prompt: "Quel mot désigne la manière dont Nina reçoit les invités ?", advancedChoices: ["accueil", "porte", "salon", "thé"],
  },
  "accusation:accusation_charge": {
    early: "L’accusation de vol repose sur un témoignage.", englishChoices: ["accusation", "praise", "apology", "promise"],
    intermediate: "La police l’interroge après une _____ de vol.", frenchChoices: ["accusation", "félicitation", "permission", "invitation"],
    advanced: "Une accusation de vol vise le voisin. Le témoin apporte un dossier, le juge écoute et l’avocat prend des notes.",
    prompt: "Quel nom désigne la mise en cause du voisin ?", advancedChoices: ["accusation", "témoin", "dossier", "avocat"],
  },
  "accusations:accusation_charge": {
    early: "Deux accusations graves visent cet entrepreneur.", englishChoices: ["accusations", "compliments", "requests", "warnings"],
    intermediate: "On lui reproche le vol et la fraude : il fait face à deux _____.", frenchChoices: ["accusations", "félicitations", "excuses", "demandes"],
    advanced: "Les accusations contre Marc portent sur le vol et la fraude. Les témoins attendent dans le couloir, les dossiers sont prêts et les avocats discutent.",
    prompt: "Quel mot désigne les deux charges portées contre Marc ?", advancedChoices: ["accusations", "témoins", "dossiers", "avocats"],
  },
  "accuse:accuser_charge": {
    early: "J’accuse mon voisin d’avoir cassé la vitre.", englishChoices: ["I accuse", "I excuse", "I help", "I warn"],
    intermediate: "J’_____ Luc d’avoir menti : je dis qu’il est responsable.", frenchChoices: ["accuse", "excuse", "admire", "remercie"],
    advanced: "J’accuse Luc d’avoir menti, mais Léa le défend. Marc examine la vitre et Nora téléphone au gardien.",
    prompt: "Quel verbe indique que je tiens Luc pour responsable ?", advancedChoices: ["accuse", "défend", "examine", "téléphone"],
  },
  "accuser:accuser_charge": {
    early: "Sans preuve, il refuse d’accuser son ami.", englishChoices: ["to accuse", "to defend", "to help", "to trust"],
    intermediate: "Avant d’_____ quelqu’un, il faut examiner les preuves contre lui.", frenchChoices: ["accuser", "aider", "inviter", "féliciter"],
    advanced: "Avant d’accuser Léa, Paul vérifie les faits. Il préfère écouter Marie, examiner le dossier et attendre la réponse.",
    prompt: "Quel verbe signifie attribuer une faute à Léa ?", advancedChoices: ["accuser", "écouter", "examiner", "attendre"],
  },
  "accusé:accuse_defendant": {
    early: "L’accusé se lève quand le juge entre.", englishChoices: ["defendant", "witness", "judge", "lawyer"],
    intermediate: "Au tribunal, l’_____ répond au juge qui le soupçonne de vol.", frenchChoices: ["accusé", "avocat", "greffier", "témoin"],
    advanced: "L’accusé répond aux questions au tribunal. Le juge préside, le témoin raconte ce qu’il a vu et l’avocat prend des notes.",
    prompt: "Quel mot désigne la personne jugée pour un possible délit ?", advancedChoices: ["accusé", "juge", "témoin", "avocat"],
  },
  "accusé:accuser_charge": {
    early: "La police l’a accusé d’avoir menti.", englishChoices: ["accused", "defended", "questioned", "released"],
    intermediate: "Un témoin l’a _____ de vol en déclarant l’avoir vu prendre l’argent.", frenchChoices: ["accusé", "innocenté", "félicité", "remercié"],
    advanced: "Paul a accusé le voisin de vol sans preuve. Marie a défendu le voisin, Luc a lu le dossier et Nina a téléphoné au juge.",
    prompt: "Quel mot indique que Paul reproche un vol au voisin ?", advancedChoices: ["accusé", "défendu", "lu", "téléphoné"],
  },
};
