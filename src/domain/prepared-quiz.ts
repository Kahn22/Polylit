/** Browser-safe, language-neutral quiz contract. IDs, not display strings, score answers. */
export interface QuizChoice { id: string; text: string }
export interface TargetRange { start: number; end: number }
export interface PreparedQuiz {
  id: string;
  language: "fr" | "es";
  glossLanguage: "en";
  subject: { kind: "vocabulary"; surfaceFormId: string; senseId: string } | { kind: "expression"; expressionId: string };
  band: "levels_1_3" | "levels_4_5" | "levels_6_8";
  format: "meaning_choice" | "surface_completion" | "target_identification";
  context: string;
  targetText?: string;
  targetRange?: TargetRange;
  prompt?: string;
  choices: QuizChoice[];
  correctChoiceId: string;
}
export function correctChoice(quiz: PreparedQuiz): QuizChoice {
  const choice = quiz.choices.find(item => item.id === quiz.correctChoiceId);
  if (!choice) throw new Error(`Missing correct choice: ${quiz.id}`);
  return choice;
}
