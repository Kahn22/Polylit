import type { ContentBundle } from "../../src/domain/model.js";

const identity = { surfaceFormId: "srf_fromage", senseId: "sns_fromage_food" } as const;

export const preparedFromageQuizSet: ContentBundle["quizItems"] = [
  { id: "qiz_fromage_early", ...identity, band: "levels_1_3", format: "meaning_choice", contextFrench: "Elle achète du fromage au marché.", targetText: "fromage", prompt: "Meaning", choicesEnglish: ["cheese", "bridge", "blanket", "hammer"], correctAnswer: "cheese" },
  { id: "qiz_fromage_intermediate", ...identity, band: "levels_4_5", format: "surface_completion", contextFrench: "Cet aliment fait avec du lait est un ___.", choicesFrench: ["fromage", "doucement", "sous", "demain"], correctAnswer: "fromage" },
  { id: "qiz_fromage_advanced", ...identity, band: "levels_6_8", format: "target_identification", contextFrench: "Le pain, le fromage, la pomme et l’eau sont sur la table.", promptFrench: "Quel mot désigne un aliment fait avec du lait ?", choicesFrench: ["pain", "fromage", "pomme", "eau"], correctAnswer: "fromage" },
];
