import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { jAccuseCanonicalText, jAccuseThoughtUnits, zolaSourceAcquisition } from "../src/content/fixtures/zola.js";
import { learnerVocabularyForWork } from "../src/domain/publication.js";
import { validateContentBundle } from "../src/domain/validate.js";

describe("J’Accuse…! source acquisition", () => {
  it("stores the complete verified letter deterministically", () => {
    expect(jAccuseCanonicalText).toMatch(/^Monsieur le Président,/);
    expect(jAccuseCanonicalText).toContain("la vérité est en marche, et rien ne l’arrêtera.");
    expect(jAccuseCanonicalText).toContain("J’accuse le lieutenant-colonel du Paty de Clam");
    expect(jAccuseCanonicalText).toMatch(/ÉMILE ZOLA$/);
    expect(createHash("sha256").update(jAccuseCanonicalText).digest("hex")).toBe("f9c77975ede9a67867c12b954762a1d9807ca584e8a1aaef5a1a07922ffac863");
  });

  it("keeps newspaper and transcription artifacts out of canonical text", () => {
    expect(jAccuseCanonicalText).not.toContain("PROJECT GUTENBERG");
    expect(jAccuseCanonicalText).not.toContain("LES ANNONCES SONT REÇUES");
    expect(jAccuseCanonicalText).not.toContain("Au lecteur");
  });

  it("has 199 ordered thought units that reconstruct the canonical source", () => {
    expect(jAccuseThoughtUnits).toHaveLength(199);
    expect(jAccuseThoughtUnits.map((unit) => unit.ordinal)).toEqual(Array.from({ length: 199 }, (_, index) => index + 1));
    expect(jAccuseThoughtUnits.every((unit) => unit.french.length <= 451)).toBe(true);
    expect(jAccuseThoughtUnits.map((unit) => unit.french).join("\n")).toBe(jAccuseCanonicalText);
    expect(jAccuseThoughtUnits.some((unit) => /\bM\.$/.test(unit.french))).toBe(false);
  });

  it("is valid source-structured content but cannot reach learners yet", () => {
    expect(validateContentBundle(zolaSourceAcquisition)).toEqual({ ok: true, diagnostics: [] });
    expect(zolaSourceAcquisition.works[0]?.publicationState).toBe("source_structured");
    expect(zolaSourceAcquisition.units).toHaveLength(199);
    expect(zolaSourceAcquisition.readiness[0]?.thoughtUnitsComplete).toBe(true);
    expect(zolaSourceAcquisition.readiness[0]?.occurrencesReviewed).toBe(false);
    expect(learnerVocabularyForWork(zolaSourceAcquisition, "wrk_zola_jaccuse")).toEqual([]);
  });
});
