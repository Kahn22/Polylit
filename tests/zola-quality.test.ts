import { describe, expect, it } from "vitest";
import { auditZolaQuizEditorialReadiness } from "../src/content/preparation/zola-quality.js";
import { zolaFinalVocabularyQuizzes } from "../src/content/preparation/zola-final-vocabulary.js";
import { zolaSourceAcquisition } from "../src/content/fixtures/zola.js";

describe("J’Accuse question publication gate", () => {
  it("distinguishes completed lexical decisions from editorially accepted questions", () => {
    const source = zolaSourceAcquisition.units[0]!.french;
    const sample = zolaFinalVocabularyQuizzes[0]!;
    const audit = auditZolaQuizEditorialReadiness(zolaSourceAcquisition.units, [
      { ...sample, contextFrench: source },
      { ...sample, contextFrench: `${source} Les formes proposées sont « que », « si », « où », « dont ».` },
    ]);
    expect(audit).toEqual({ sourceReusedQuizItems: 1, sourceDerivedBlankQuizItems: 0, syntheticChoiceListQuizItems: 1, identitiesRequiringQuestionReview: 1, editoriallyReady: false });
    expect(auditZolaQuizEditorialReadiness(zolaSourceAcquisition.units, zolaFinalVocabularyQuizzes).editoriallyReady).toBe(true);
  });

  it("flags a source sentence even when its target has been replaced by a blank", () => {
    const source = zolaSourceAcquisition.units[0]!.french;
    const start = source.search(/\p{L}/u);
    const target = source.slice(start).match(/^\p{L}+/u)?.[0] ?? "";
    expect(target).not.toBe("");
    const quiz = { ...zolaFinalVocabularyQuizzes[1]!, contextFrench: `${source.slice(0, start)}_____${source.slice(start + target.length)}` };
    expect(auditZolaQuizEditorialReadiness(zolaSourceAcquisition.units, [quiz])).toEqual({
      sourceReusedQuizItems: 0, sourceDerivedBlankQuizItems: 1, syntheticChoiceListQuizItems: 0,
      identitiesRequiringQuestionReview: 1, editoriallyReady: false,
    });
  });
});
