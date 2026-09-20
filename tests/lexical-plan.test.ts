import { describe, expect, it } from "vitest";
import { appBundle } from "../src/app/content.js";
import { zolaSourceAcquisition } from "../src/content/fixtures/zola.js";
import { prepareIngestionManifest } from "../src/ingestion/prepare.js";
import { createLexicalPlan } from "../src/pipeline/lexical-plan.js";

describe("offline lexical authoring plan", () => {
  it("groups every J’Accuse occurrence deterministically and exposes safe reuse candidates", () => {
    const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");
    const first = createLexicalPlan(zolaSourceAcquisition, manifest, appBundle);
    const second = createLexicalPlan(zolaSourceAcquisition, manifest, appBundle);
    expect(second).toEqual(first);
    expect(first).toHaveLength(1373);
    expect(first.reduce((total, entry) => total + entry.occurrenceCount, 0)).toBe(4889);
    expect(first.find((entry) => entry.normalized === "rendez-vous")?.occurrenceCount).toBe(1);
    const monsieur = first.find((entry) => entry.normalized === "monsieur")!;
    expect(monsieur.reusableIdentities).toContainEqual({ surfaceFormId: "srf_monsieur", senseId: "sns_monsieur_primary" });
    expect(first.find((entry) => entry.normalized === "dreyfus")?.capitalizationHints).toContain("internal_uppercase");
  });
});
