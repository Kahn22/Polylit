import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  laParureCanonicalText,
  laParureSourceAcquisition,
  laParureThoughtUnits,
} from "../src/content/fixtures/maupassant.js";
import {
  cendrillonCanonicalText,
  cendrillonSourceAcquisition,
  cendrillonThoughtUnits,
} from "../src/content/fixtures/perrault.js";
import { learnerVocabularyForWork } from "../src/domain/publication.js";
import { curatedLaFontaineSourceAcquisition } from "../src/content/fixtures/curated-la-fontaine.js";
import { validateContentBundle } from "../src/domain/validate.js";
import { prepareIngestionManifest } from "../src/ingestion/prepare.js";

const digest = (text: string) => createHash("sha256").update(text).digest("hex");

describe("next source texts", () => {
  it("stores the three selected La Fontaine fables as complete structured sources", () => {
    const expected = [
      ["wrk_cigale_fourmi", 11, "La Cigale, ayant chanté tout l’été,", "Eh bien ! dansez maintenant. »"],
      ["wrk_loup_agneau", 20, "La raison du plus fort est toujours la meilleure :", "Sans autre forme de procès."],
      ["wrk_lion_rat", 11, "Il faut, autant qu’on peut, obliger tout le monde :", "Patience et longueur de temps font plus que force ni que rage."],
    ] as const;

    expect(validateContentBundle(curatedLaFontaineSourceAcquisition)).toEqual({ ok: true, diagnostics: [] });
    for (const [workId, unitCount, opening, ending] of expected) {
      const source = curatedLaFontaineSourceAcquisition.sources.find((item) => item.workId === workId)!;
      const units = curatedLaFontaineSourceAcquisition.units.filter((item) => item.workId === workId);
      expect(units).toHaveLength(unitCount);
      expect(source.canonicalText).toMatch(new RegExp(`^${opening.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
      expect(source.canonicalText.endsWith(ending)).toBe(true);
      expect(units.map((unit) => unit.french).join("\n")).toBe(source.canonicalText);
      expect(prepareIngestionManifest(curatedLaFontaineSourceAcquisition, workId).candidates.length).toBeGreaterThan(80);
    }
  });

  it("stores and structures the complete 1885 La Parure text", () => {
    expect(laParureCanonicalText).toMatch(/^C’était une de ces jolies et charmantes filles/);
    expect(laParureCanonicalText).toContain("Et voilà dix ans que nous la payons.");
    expect(laParureCanonicalText).toMatch(/Elle valait au plus cinq cents francs !…$/);
    expect(laParureThoughtUnits).toHaveLength(134);
    expect(laParureThoughtUnits.every((unit) => unit.french.length <= 520)).toBe(true);
    expect(laParureThoughtUnits.map((unit) => unit.french).join("\n")).toBe(laParureCanonicalText);
    expect(digest(laParureCanonicalText)).toBe("f28b82463e992a42ba29ca83fd26348eefcfd0730b0ee940faa2090698224d49");
  });

  it("stores the complete 1697 Cendrillon with both moralités", () => {
    expect(cendrillonCanonicalText).toMatch(/^Il estoit une fois un gentil-homme/);
    expect(cendrillonCanonicalText).toContain("Elle promit à sa Maraine qu’elle ne manqueroit pas de sortir du bal avant minuit");
    expect(cendrillonCanonicalText).toContain("MORALITÉ\nLa beauté, pour le sexe");
    expect(cendrillonCanonicalText).toContain("AUTRE MORALITÉ\nC’est sans doute un grand avantage");
    expect(cendrillonCanonicalText).toMatch(/Ou des parrains, ou des Maraines\.$/);
    expect(cendrillonCanonicalText).not.toMatch(/[ſ&]/);
    expect(cendrillonThoughtUnits).toHaveLength(55);
    expect(cendrillonThoughtUnits.every((unit) => unit.french.length <= 520)).toBe(true);
    expect(cendrillonThoughtUnits.map((unit) => unit.french).join("\n")).toBe(cendrillonCanonicalText);
    expect(digest(cendrillonCanonicalText)).toBe("f04fdd51bb9959d1ded5b3fa36e2e02d417bcda9866972b577b3c26cdec68f10");
  });

  it.each([
    [laParureSourceAcquisition, "wrk_maupassant_la_parure"],
    [cendrillonSourceAcquisition, "wrk_perrault_cendrillon"],
  ] as const)("keeps %s valid and gated from learners", (bundle, workId) => {
    expect(validateContentBundle(bundle)).toEqual({ ok: true, diagnostics: [] });
    expect(bundle.works[0]?.publicationState).toBe("source_structured");
    expect(bundle.readiness[0]).toMatchObject({ thoughtUnitsComplete: true, occurrencesReviewed: false });
    expect(learnerVocabularyForWork(bundle, workId)).toEqual([]);
    const manifest = prepareIngestionManifest(bundle, workId);
    expect(manifest.workId).toBe(workId);
    expect(manifest.candidates.length).toBeGreaterThan(500);
    expect(manifest.candidates.every((candidate) => candidate.disposition === "pending")).toBe(true);
  });
});
