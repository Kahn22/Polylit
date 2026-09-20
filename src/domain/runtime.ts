/** Browser-safe identity and scheduling primitives. Editorial schemas stay offline. */
export const MASTERY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type MasteryLevel = (typeof MASTERY_LEVELS)[number];
export type QuizBand = "levels_1_3" | "levels_4_5" | "levels_6_8";
export function quizBandForMasteryLevel(level: MasteryLevel): QuizBand {
  return level <= 3 ? "levels_1_3" : level <= 5 ? "levels_4_5" : "levels_6_8";
}
export function vocabularyIdentityKey(surfaceFormId: string, senseId: string): string {
  return `${surfaceFormId}:${senseId}`;
}
export function expressionMasteryKey(identityId: string): string { return `expression:${identityId}`; }
