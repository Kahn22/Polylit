import { describe, expect, it } from "vitest";
import { appBundle, appExpressionCatalog, appVisibleWorks } from "../src/app/content.js";
import { learnerExpressionsForWork, validateExpressionCatalog } from "../src/domain/expression-content.js";
import { vocabularyIdentityKey } from "../src/domain/model.js";
import { learnerVocabularyForWork } from "../src/domain/publication.js";
import { validateContentBundle } from "../src/domain/validate.js";

const identitySet = (workId: string) => new Set(
  appBundle.occurrences
    .filter((occurrence) => occurrence.workId === workId)
    .map((occurrence) => vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId)),
);

describe("learner application content", () => {
  it("loads the validated combined learning bundle", () => {
    expect(validateContentBundle(appBundle)).toEqual({ ok: true, diagnostics: [] });
  });

  it("offers every completed work in canonical collection order", () => {
    expect(appVisibleWorks.map((work) => [work.id, work.title])).toEqual([
      ["wrk_cigale_fourmi", "La Cigale et la Fourmi"],
      ["wrk_corbeau_renard", "Le Corbeau et le Renard"],
      ["wrk_loup_agneau", "Le Loup et l’Agneau"],
      ["wrk_lion_rat", "Le Lion et le Rat"],
      ["wrk_lievre_tortue", "Le Lièvre et la Tortue"],
      ["wrk_zola_jaccuse", "J’Accuse…!"],
      ["wrk_maupassant_la_parure", "La Parure"],
      ["wrk_perrault_cendrillon", "Cendrillon ou la Petite Pantoufle de verre"],
      ["wrk_palma_camisa_margarita", "La camisa de Margarita"],
      ["wrk_quiroga_almohadon_plumas", "El almohadón de plumas"],
    ]);
  });

  it("exposes every prepared identity and shares identities across texts", () => {
    expect(learnerVocabularyForWork(appBundle, "wrk_cigale_fourmi")).toHaveLength(86);
    expect(learnerVocabularyForWork(appBundle, "wrk_corbeau_renard")).toHaveLength(98);
    expect(learnerVocabularyForWork(appBundle, "wrk_loup_agneau")).toHaveLength(146);
    expect(learnerVocabularyForWork(appBundle, "wrk_lion_rat")).toHaveLength(103);
    expect(learnerVocabularyForWork(appBundle, "wrk_lievre_tortue")).toHaveLength(179);
    expect(learnerVocabularyForWork(appBundle, "wrk_zola_jaccuse")).toHaveLength(1450);
    expect(learnerVocabularyForWork(appBundle, "wrk_maupassant_la_parure")).toHaveLength(1084);
    expect(learnerVocabularyForWork(appBundle, "wrk_perrault_cendrillon")).toHaveLength(794);
    expect(learnerVocabularyForWork(appBundle, "wrk_palma_camisa_margarita")).toHaveLength(502);
    expect(learnerVocabularyForWork(appBundle, "wrk_quiroga_almohadon_plumas")).toHaveLength(568);

    const corbeau = identitySet("wrk_corbeau_renard");
    const lievre = identitySet("wrk_lievre_tortue");
    const shared = [...corbeau].filter((identity) => lievre.has(identity));
    expect(shared).toHaveLength(32);
    expect(shared).toContain("srf_vous:sns_vous_primary");
  });

  it("delivers every prepared expression to the learner app", () => {
    expect(validateExpressionCatalog(appBundle, appExpressionCatalog)).toEqual([]);
    expect(learnerExpressionsForWork(appBundle, appExpressionCatalog, "wrk_zola_jaccuse")).toHaveLength(10);
    expect(appExpressionCatalog.identities).toHaveLength(39);
    expect(appExpressionCatalog.preparedQuizzes).toHaveLength(117);
  });

  it("does not reuse any selected fable source passage verbatim as a quiz context", () => {
    const selectedWorkIds = new Set(["wrk_cigale_fourmi", "wrk_loup_agneau", "wrk_lion_rat"]);
    const canonicalTexts = appBundle.sources
      .filter((source) => selectedWorkIds.has(source.workId))
      .map((source) => source.canonicalText);
    const vocabularyIdentities = new Set(appBundle.occurrences
      .filter((occurrence) => selectedWorkIds.has(occurrence.workId))
      .map((occurrence) => vocabularyIdentityKey(occurrence.surfaceFormId, occurrence.senseId)));
    const expressionIdentities = new Set(appExpressionCatalog.occurrences
      .filter((occurrence) => selectedWorkIds.has(occurrence.workId))
      .map((occurrence) => occurrence.identityId));

    const contexts = [
      ...appBundle.quizItems
        .filter((quiz) => vocabularyIdentities.has(vocabularyIdentityKey(quiz.surfaceFormId, quiz.senseId)))
        .map((quiz) => quiz.contextFrench),
      ...appExpressionCatalog.preparedQuizzes
        .filter((quiz) => expressionIdentities.has(quiz.expressionId))
        .map((quiz) => quiz.contextFrench),
    ];
    expect(contexts.every((context) => canonicalTexts.every((source) => !source.includes(context)))).toBe(true);
  });
});
