import type { LegacyQuizItem } from "./authoring.js";

/** Editorially authored quiz content. These are stored questions, never runtime prompts. */
export const corbeauQuizBatch01: LegacyQuizItem[] = [
  {
    id: "qiz_maitre_title_01", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 1, format: "meaning_choice", contextFrench: "L’apprenti répond : « Oui, Maître Bernard. »", targetText: "Maître", prompt: "Meaning",
    choicesEnglish: ["Master (respectful title)", "neighbor", "young man", "stranger"], correctAnswer: "Master (respectful title)",
  },
  {
    id: "qiz_maitre_title_02", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 2, format: "meaning_choice", contextFrench: "Tous saluent Maître Aubert avant le début de la leçon.", targetText: "Maître", prompt: "Meaning",
    choicesEnglish: ["Master (respectful title)", "student", "visitor", "child"], correctAnswer: "Master (respectful title)",
  },
  {
    id: "qiz_maitre_title_03", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 3, format: "meaning_choice", contextFrench: "« Merci de votre conseil, Maître Louis », dit le jeune artisan.", targetText: "Maître", prompt: "Meaning",
    choicesEnglish: ["Master (respectful title)", "brother", "merchant", "servant"], correctAnswer: "Master (respectful title)",
  },
  {
    id: "qiz_maitre_title_04", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 4, format: "surface_completion", contextFrench: "« Bonjour, ___ Bernard », dit respectueusement l’apprenti.",
    choicesFrench: ["Maître", "maîtres", "maîtresse", "élève"], correctAnswer: "Maître",
  },
  {
    id: "qiz_maitre_title_05", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 5, format: "comprehension_choice", contextFrench: "L’apprenti demande à Maître Simon de vérifier son travail.", targetText: "Maître",
    promptFrench: "À qui l’apprenti demande-t-il de vérifier son travail ?", choicesEnglish: ["his respected master", "his younger brother", "a new customer", "a passing traveler"], correctAnswer: "his respected master",
  },
  {
    id: "qiz_maitre_title_06", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 6, format: "target_identification", contextFrench: "L’apprenti appelle Bernard « Maître », puis ouvre son cahier et attend le conseil.",
    promptFrench: "Quel mot est employé comme titre respectueux ?", choicesFrench: ["apprenti", "Maître", "cahier", "conseil"], correctAnswer: "Maître",
  },
  {
    id: "qiz_maitre_title_07", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 7, format: "target_identification", contextFrench: "Dans l’atelier, Luc salue Maître Colin ; son ami ferme la porte.",
    promptFrench: "Quel mot placé devant un nom sert ici de titre honorifique ?", choicesFrench: ["atelier", "Maître", "ami", "porte"], correctAnswer: "Maître",
  },
  {
    id: "qiz_maitre_title_08", surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary",
    masteryLevel: 8, format: "target_identification", contextFrench: "Le juge écoute l’avocat, et le greffier annonce : « Maître Robert va parler. »",
    promptFrench: "Quel mot introduit respectueusement le nom de l’avocat ?", choicesFrench: ["juge", "avocat", "greffier", "Maître"], correctAnswer: "Maître",
  },

  {
    id: "qiz_sur_on_01", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 1, format: "meaning_choice", contextFrench: "Le livre repose sur la table.", targetText: "sur", prompt: "Meaning",
    choicesEnglish: ["on", "under", "behind", "inside"], correctAnswer: "on",
  },
  {
    id: "qiz_sur_on_02", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 2, format: "meaning_choice", contextFrench: "Une tasse est posée sur le bureau.", targetText: "sur", prompt: "Meaning",
    choicesEnglish: ["on", "beside", "below", "across from"], correctAnswer: "on",
  },
  {
    id: "qiz_sur_on_03", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 3, format: "meaning_choice", contextFrench: "Le chat dort sur le coussin rouge.", targetText: "sur", prompt: "Meaning",
    choicesEnglish: ["on", "between", "without", "toward"], correctAnswer: "on",
  },
  {
    id: "qiz_sur_on_04", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 4, format: "surface_completion", contextFrench: "Elle pose ses clés ___ l’étagère.",
    choicesFrench: ["sur", "sous", "dans", "entre"], correctAnswer: "sur",
  },
  {
    id: "qiz_sur_on_05", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 5, format: "comprehension_choice", contextFrench: "Une pomme verte reste sur l’assiette blanche.", targetText: "sur",
    promptFrench: "Où se trouve la pomme ?", choicesEnglish: ["on the plate", "under the plate", "in a bag", "beside the window"], correctAnswer: "on the plate",
  },
  {
    id: "qiz_sur_on_06", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 6, format: "target_identification", contextFrench: "Le manteau est sur la chaise, tandis que les bottes restent sous la table.",
    promptFrench: "Quel mot indique que le manteau repose au-dessus de la chaise en la touchant ?", choicesFrench: ["manteau", "sur", "sous", "table"], correctAnswer: "sur",
  },
  {
    id: "qiz_sur_on_07", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 7, format: "target_identification", contextFrench: "Dans la cuisine, le pain est sur le comptoir et le lait demeure dans le réfrigérateur.",
    promptFrench: "Quel mot situe le pain au-dessus du comptoir avec contact ?", choicesFrench: ["cuisine", "sur", "dans", "lait"], correctAnswer: "sur",
  },
  {
    id: "qiz_sur_on_08", surfaceFormId: "srf_sur", senseId: "sns_sur_primary",
    masteryLevel: 8, format: "target_identification", contextFrench: "Paul range un dossier dans le tiroir, mais laisse la lettre sur le secrétaire près de la lampe.",
    promptFrench: "Quel mot indique la position de la lettre par rapport au secrétaire ?", choicesFrench: ["dans", "tiroir", "sur", "près"], correctAnswer: "sur",
  },

  {
    id: "qiz_un_article_01", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 1, format: "meaning_choice", contextFrench: "Un chat attend devant la porte.", targetText: "Un", prompt: "Meaning",
    choicesEnglish: ["a; one", "the", "this", "every"], correctAnswer: "a; one",
  },
  {
    id: "qiz_un_article_02", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 2, format: "meaning_choice", contextFrench: "Il cherche un crayon bleu.", targetText: "un", prompt: "Meaning",
    choicesEnglish: ["a; one", "some", "that", "no"], correctAnswer: "a; one",
  },
  {
    id: "qiz_un_article_03", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 3, format: "meaning_choice", contextFrench: "Nous entendons un bruit dans le couloir.", targetText: "un", prompt: "Meaning",
    choicesEnglish: ["a; one", "the", "several", "each"], correctAnswer: "a; one",
  },
  {
    id: "qiz_un_article_04", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 4, format: "surface_completion", contextFrench: "Marc choisit ___ livre parmi plusieurs romans.",
    choicesFrench: ["un", "une", "des", "la"], correctAnswer: "un",
  },
  {
    id: "qiz_un_article_05", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 5, format: "comprehension_choice", contextFrench: "Un enfant attend seul devant l’école.", targetText: "Un",
    promptFrench: "Combien d’enfants attendent devant l’école ?", choicesEnglish: ["one child", "two children", "several children", "no children"], correctAnswer: "one child",
  },
  {
    id: "qiz_un_article_06", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 6, format: "target_identification", contextFrench: "Un voisin apporte le pain, tandis que cette voisine prépare les assiettes.",
    promptFrench: "Quel mot présente « voisin » comme une personne masculine non encore identifiée ?", choicesFrench: ["Un", "le", "cette", "les"], correctAnswer: "Un",
  },
  {
    id: "qiz_un_article_07", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 7, format: "target_identification", contextFrench: "Dans la cour, un garçon tient ce ballon et les filles regardent une affiche.",
    promptFrench: "Quel mot est l’article indéfini masculin singulier devant « garçon » ?", choicesFrench: ["la", "un", "ce", "les"], correctAnswer: "un",
  },
  {
    id: "qiz_un_article_08", surfaceFormId: "srf_un", senseId: "sns_un_primary",
    masteryLevel: 8, format: "target_identification", contextFrench: "Chaque témoin reçoit un numéro, puis le secrétaire place les dossiers dans cette boîte.",
    promptFrench: "Quel mot détermine « numéro » sans désigner un numéro déjà identifié ?", choicesFrench: ["Chaque", "un", "les", "cette"], correctAnswer: "un",
  },
];
