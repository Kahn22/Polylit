import type { ZolaVocabularySpec } from "./zola-authoring.js";
import { authoredSet } from "../quizzes/authoring.js";

/** Last contextual decisions; quizzes are written away from Zola's sentences. */
export const zolaFinalVocabulary: ZolaVocabularySpec[] = [
  { normalized: "que", candidateIds: ["tok_2835f572e75beb77c29724ba"], lemmaKey: "que", existingLemmaId: "lem_que", headword: "que", partOfSpeech: "conjunction", senseKey: "que_as", gloss: "as (in the way that)", definition: "introduit une comparaison de manière après ainsi", englishDistractors: ["although", "until", "because"], frenchDistractors: ["dont", "où", "si"] },
  { normalized: "tout", candidateIds: ["tok_51ae57093097f5ff4f0b687e", "tok_3452d846338771f45000d3b4"], lemmaKey: "tout", existingLemmaId: "lem_tout", headword: "tout", partOfSpeech: "adverb", senseKey: "tout_intensifier", gloss: "quite; entirely", definition: "renforce l’adjectif ou l’adverbe qui suit", englishDistractors: ["barely", "rarely", "never"], frenchDistractors: ["peu", "pas", "non"] },
  { normalized: "toutes", candidateIds: ["tok_0f18184dac6d092910472f15"], lemmaKey: "tout", existingLemmaId: "lem_tout", existingSenseId: "sns_tout_primary", headword: "tout", partOfSpeech: "determiner", senseKey: "tout_primary", gloss: "all", definition: "désigne la totalité d’un groupe féminin pluriel", englishDistractors: ["none", "one", "some"], frenchDistractors: ["tous", "toute", "tout"] },
  { normalized: "quant", candidateIds: ["tok_cec2d718a80800329a7a91c9"], lemmaKey: "quant", headword: "quant", partOfSpeech: "preposition", senseKey: "quant_regarding", gloss: "as for; regarding", definition: "introduit le sujet dont il est question dans quant à", englishDistractors: ["because", "until", "despite"], frenchDistractors: ["quand", "tant", "avant"] },
];

export const zolaFinalVocabularyQuizzes = [
  ...authoredSet({
    key: "zola_que_as", surfaceFormId: "srf_que", senseId: "sns_zola_que_as", target: "que", meaning: "as (in the way that)",
    early: [["Ainsi que le note le professeur, la classe est prête.", ["although", "until", "because"]], ["Ainsi que je le pensais, le train est arrivé tôt.", ["although", "until", "because"]], ["Ainsi que l’annonce la radio, la route est ouverte.", ["although", "until", "because"]]],
    blank: ["Ainsi ___ le dit la directrice, les élèves sont prêts.", ["que", "dont", "où", "si"]],
    comprehension: ["Ainsi que le dit Léa, la porte est ouverte.", "Que dit Léa ?", ["la porte est ouverte", "le train est en retard", "la fenêtre est fermée", "le livre est perdu"], "la porte est ouverte"],
    advanced: [["Ainsi que le rappelle Léa, la porte est ouverte. Paul attend depuis lundi ; malgré la pluie, il reste dehors. Il entre toutefois ce matin.", "Quel mot, après « ainsi », introduit ce que rappelle Léa ?", ["que", "depuis", "malgré", "toutefois"]], ["Ainsi que le confirme Paul, le colis est arrivé. Depuis hier, Léa attend ; malgré le froid, elle sort toutefois.", "Quel mot suit « ainsi » pour rapporter la confirmation ?", ["que", "depuis", "malgré", "toutefois"]], ["Ainsi que le souligne Marie, la salle est libre. Depuis lundi, Paul attend ; malgré l’heure, il travaille toutefois.", "Quel mot suit « ainsi » pour introduire l’observation ?", ["que", "depuis", "malgré", "toutefois"]]],
  }),
  ...authoredSet({
    key: "zola_tout_intensifier", surfaceFormId: "srf_tout", senseId: "sns_zola_tout_intensifier", target: "tout", meaning: "quite; entirely",
    early: [["Le pain est tout frais ce matin.", ["barely", "rarely", "never"]], ["Ce manteau est tout neuf.", ["barely", "rarely", "never"]], ["L’enfant est tout heureux de partir.", ["barely", "rarely", "never"]]],
    blank: ["Ce cahier est ___ neuf : personne ne l’a encore utilisé.", ["tout", "tous", "toute", "toutes"]],
    comprehension: ["Ce manteau est tout neuf.", "Dans quel état est le manteau ?", ["entièrement neuf", "très usé", "déchiré", "mouillé"], "entièrement neuf"],
    advanced: [["Ce livre est tout neuf. Le carton est presque vide, le rayon bien rangé et le magasin encore ouvert.", "Quel mot renforce l’idée que le livre est neuf ?", ["tout", "presque", "bien", "encore"]], ["Le gâteau est tout chaud. Le four est presque froid, le plat bien couvert et la porte encore ouverte.", "Quel mot renforce la chaleur du gâteau ?", ["tout", "presque", "bien", "encore"]], ["Le pull est tout propre. Le panier est presque plein, le linge bien plié et l’eau encore tiède.", "Quel mot renforce la propreté du pull ?", ["tout", "presque", "bien", "encore"]]],
  }),
  ...authoredSet({
    key: "zola_toutes_all", surfaceFormId: "srf_zola_toutes_tout", senseId: "sns_tout_primary", target: "toutes", meaning: "all (feminine plural)",
    early: [["Toutes les fenêtres sont ouvertes.", ["none", "one", "some"]], ["Toutes les lettres sont arrivées.", ["none", "one", "some"]], ["Toutes les tables sont libres.", ["none", "one", "some"]]],
    blank: ["___ les fenêtres sont ouvertes.", ["toutes", "tous", "toute", "tout"]],
    comprehension: ["Toutes les lettres sont arrivées.", "Combien des lettres attendues sont arrivées ?", ["la totalité", "aucune", "une seule", "quelques-unes"], "la totalité"],
    advanced: [["Toutes les portes sont ouvertes. Tous les voisins entrent ; toute la rue est calme et tout le quartier écoute.", "Quel mot porte sur l’ensemble des portes ?", ["Toutes", "Tous", "toute", "tout"]], ["Toutes les chaises sont prises. Tous les bancs restent libres ; toute la salle est éclairée et tout le monde attend.", "Quel mot porte sur l’ensemble des chaises ?", ["Toutes", "Tous", "toute", "tout"]], ["Toutes les lampes sont allumées. Tous les livres sont fermés ; toute la maison est calme et tout le monde dort.", "Quel mot porte sur l’ensemble des lampes ?", ["Toutes", "Tous", "toute", "tout"]]],
  }),
  ...authoredSet({
    key: "zola_quant_regarding", surfaceFormId: "srf_zola_quant_quant", senseId: "sns_zola_quant_regarding", target: "quant", meaning: "as for; regarding",
    early: [["Quant à Léa, elle arrivera demain.", ["because", "until", "despite"]], ["Quant au dessert, Paul le préparera.", ["because", "until", "despite"]], ["Quant aux billets, ils sont déjà vendus.", ["because", "until", "despite"]]],
    blank: ["___ à Marie, elle prépare le dessert.", ["quant", "quand", "tant", "avant"]],
    comprehension: ["Quant à Léa, elle arrivera demain.", "De qui parle-t-on maintenant ?", ["de Léa", "de Paul", "de Marie", "du voisin"], "de Léa"],
    advanced: [["Quant à Léa, elle part lundi. Quand Luc arrivera, nous mangerons. Tant que Marie attend, Paul peut préparer la table avant midi.", "Quel mot introduit le nouveau sujet, Léa ?", ["Quant", "Quand", "Tant", "avant"]], ["Quant au dessert, Léa s’en charge. Quand Luc revient, on mange. Tant que Paul attend, Marie peut préparer les assiettes avant le repas.", "Quel mot introduit le sujet du dessert ?", ["Quant", "Quand", "Tant", "avant"]], ["Quant aux billets, Luc les garde. Quand Léa arrive, nous partons. Tant que Paul attend, Marie peut vérifier les places avant le départ.", "Quel mot introduit le sujet des billets ?", ["Quant", "Quand", "Tant", "avant"]]],
  }),
];
