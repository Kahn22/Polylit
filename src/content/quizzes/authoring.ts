import type { ContentBundle } from "../../domain/model.js";
import { vocabularyIdentityKey } from "../../domain/model.js";

export type AuthoredQuizSpec = {
  key: string; surfaceFormId: string; senseId: string; target: string; meaning: string;
  early: [[string,string[]],[string,string[]],[string,string[]]];
  blank: [string,string[]]; comprehension: [string,string,string[],string];
  advanced: [[string,string,string[]],[string,string,string[]],[string,string,string[]]];
};

type QuizIdentity = { id: string; surfaceFormId: string; senseId: string; contextFrench: string; correctAnswer: string };
export type LegacyQuizItem = QuizIdentity & { masteryLevel: 1|2|3; format: "meaning_choice"; targetText: string; prompt: "Meaning"; choicesEnglish: string[] }
  | QuizIdentity & { masteryLevel: 4; format: "surface_completion"; choicesFrench: string[] }
  | QuizIdentity & { masteryLevel: 5; format: "comprehension_choice"; targetText: string; promptFrench: string; choicesEnglish: string[] }
  | QuizIdentity & { masteryLevel: 6|7|8; format: "target_identification"; promptFrench: string; choicesFrench: string[] };

/** Deterministically migrates older eight-question sets without rewriting authored text. */
export function compactQuizItems(items: readonly (LegacyQuizItem | ContentBundle["quizItems"][number])[]): ContentBundle["quizItems"] {
  return items.flatMap((item) => {
    if ("band" in item) return [item];
    if (item.masteryLevel === 1 && item.format === "meaning_choice") return [{ ...item, id: item.id.replace(/_01$/, "_early"), band: "levels_1_3" as const, masteryLevel: undefined }].map(({ masteryLevel: _removed, ...quiz }) => quiz);
    if (item.masteryLevel === 4 && item.format === "surface_completion") return [{ ...item, id: item.id.replace(/_04$/, "_intermediate"), band: "levels_4_5" as const, masteryLevel: undefined }].map(({ masteryLevel: _removed, ...quiz }) => quiz);
    if (item.masteryLevel === 6 && item.format === "target_identification") return [{ ...item, id: item.id.replace(/_06$/, "_advanced"), band: "levels_6_8" as const, masteryLevel: undefined }].map(({ masteryLevel: _removed, ...quiz }) => quiz);
    return [];
  });
}

export function authoredSet(s: AuthoredQuizSpec): ContentBundle["quizItems"] {
  const [earlyContext, earlyDistractors] = s.early[0];
  const [advancedContext, advancedPrompt, advancedChoices] = s.advanced[0];
  return [
    { id:`qiz_${s.key}_early`, surfaceFormId:s.surfaceFormId, senseId:s.senseId, band:"levels_1_3", format:"meaning_choice", contextFrench:earlyContext, targetText:s.target, prompt:"Meaning", choicesEnglish:[s.meaning,...earlyDistractors], correctAnswer:s.meaning },
    { id:`qiz_${s.key}_intermediate`, surfaceFormId:s.surfaceFormId, senseId:s.senseId, band:"levels_4_5", format:"surface_completion", contextFrench:s.blank[0], choicesFrench:s.blank[1], correctAnswer:s.target },
    { id:`qiz_${s.key}_advanced`, surfaceFormId:s.surfaceFormId, senseId:s.senseId, band:"levels_6_8", format:"target_identification", contextFrench:advancedContext, promptFrench:advancedPrompt, choicesFrench:advancedChoices, correctAnswer:advancedChoices.find(choice => choice.toLocaleLowerCase("fr-FR") === s.target.toLocaleLowerCase("fr-FR")) ?? s.target },
  ];
}

export function quizCoverageForWork(bundle: ContentBundle, workId: string) {
  const required = new Set(bundle.occurrences.filter(x => x.workId === workId).map(x => vocabularyIdentityKey(x.surfaceFormId,x.senseId)));
  const bands = new Map<string,Set<string>>();
  for (const q of bundle.quizItems) { const key=vocabularyIdentityKey(q.surfaceFormId,q.senseId); const set=bands.get(key)??new Set<string>(); set.add(q.band); bands.set(key,set); }
  const completed=[...required].filter(key => bands.get(key)?.size===3).sort();
  const missing=[...required].filter(key => bands.get(key)?.size!==3).sort();
  return { requiredIdentities:required.size, completedIdentities:completed.length, preparedItems:bundle.quizItems.length, completed, missing };
}
