import { describe, expect, it } from "vitest";
import { appBundle, appExpressionCatalog } from "../src/app/content.js";
import { createDeliveryPackages, nextQuizIdentityBatch, shouldPrefetchNextQuizBatch } from "../src/delivery/content-packages.js";

describe("incremental learner content delivery", () => {
  it("groups thought units into natural reading passages with only their referenced linguistic data", () => {
    const packages = createDeliveryPackages(appBundle, appExpressionCatalog);
    const section = packages.readingSections.find((item) => item.workId === "wrk_corbeau_renard" && item.index === 0)!;
    const unitIds = new Set(section.units.map((unit) => unit.id));
    expect(section.units[0]?.ordinal).toBe(1);
    expect(section.units.length).toBeGreaterThan(1);
    expect(section.occurrences.every((item) => unitIds.has(item.unitId))).toBe(true);
    expect(new Set(section.surfaceForms.map((item) => item.id))).toEqual(new Set(section.occurrences.map((item) => item.surfaceFormId)));
    expect(section.lemmas.length).toBeLessThan(appBundle.lemmas.length);
    expect(packages.manifest.readingSectionTargetWords).toBe(120);
    expect(packages.readingSections.every((item) => item.units.length > 1 || item.units[0]!.french.trim().split(/\s+/u).length >= 80)).toBe(true);
  });

  it("stores three prepared questions per identity in deterministic ten-identity shards", () => {
    const first = createDeliveryPackages(appBundle, appExpressionCatalog);
    const second = createDeliveryPackages(appBundle, appExpressionCatalog);
    expect(first).toEqual(second);
    expect(first.quizBatches.every((batch) => batch.identityKeys.length <= 10)).toBe(true);
    expect(first.quizBatches.every((batch) => batch.quizItems.length === batch.identityKeys.length * 3)).toBe(true);
    const vocabularyIdentityCount = new Set(appBundle.quizItems.map((item) => `${item.surfaceFormId}:${item.senseId}`)).size;
    expect(Object.keys(first.manifest.quizBatchForIdentity)).toHaveLength(vocabularyIdentityCount);
    expect(first.manifest.expressionCatalog.identities).toHaveLength(39);
    expect(first.manifest.expressionCatalog.preparedQuizzes).toHaveLength(117);
  });

  it("publishes separate French and Spanish library indexes", () => {
    const packages = createDeliveryPackages(appBundle, appExpressionCatalog);
    const french = packages.libraryIndexes.fr;
    const spanish = packages.libraryIndexes.es;
    expect(french.catalog.collections.every((collection) => collection.language === "fr")).toBe(true);
    expect(spanish.catalog.collections.every((collection) => collection.language === "es")).toBe(true);
    expect(new Set(french.catalog.works.map((work) => work.id))).not.toEqual(new Set(spanish.catalog.works.map((work) => work.id)));
    expect(Object.keys(packages.learningManifests.fr.identityLocations).every((identity) =>
      packages.learningManifests.fr.identityLocations[identity]!.every((location) => french.works[location.workId] !== undefined),
    )).toBe(true);
    expect(Object.keys(packages.learningManifests.es.identityLocations).every((identity) =>
      packages.learningManifests.es.identityLocations[identity]!.every((location) => spanish.works[location.workId] !== undefined),
    )).toBe(true);
    expect(french.catalog.works).toHaveLength(8);
    expect(spanish.catalog.works).toHaveLength(2);
  });

  it("queues no more than ten unique questions and prefetches when three remain", () => {
    expect(nextQuizIdentityBatch(["a", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"], new Set(["b"]))).toEqual(["a", "c", "d", "e", "f", "g", "h", "i", "j", "k"]);
    expect(shouldPrefetchNextQuizBatch(4)).toBe(false);
    expect(shouldPrefetchNextQuizBatch(3)).toBe(true);
  });
});
