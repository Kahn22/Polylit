import { describe, expect, it } from "vitest";
import { lafountainFixtures } from "../src/content/fixtures/la-fontaine.js";
import { applyReviewDecisions, assertReviewComplete, prepareIngestionManifest, serializeManifest } from "../src/ingestion/prepare.js";
import { tokenizeFrench } from "../src/ingestion/tokenize.js";

describe("editorial ingestion", () => {
  it("tokenizes elisions with exact source spans and normalized typography", () => {
    const source = "Lorsqu'il s’éloigne d’où vient l’odeur";
    const tokens = tokenizeFrench(source);
    expect(tokens.map((token) => token.text)).toEqual(["Lorsqu'", "il", "s’", "éloigne", "d’", "où", "vient", "l’", "odeur"]);
    for (const token of tokens) expect(source.slice(token.start, token.end)).toBe(token.text);
    expect(tokens[0]?.normalized).toBe("lorsqu’");
  });

  it("splits inverted verb-pronoun forms without treating linking t as vocabulary", () => {
    const source = "Êtes-vous sage ? cria-t-elle, avais-je raison ? celle-ci répond";
    const tokens = tokenizeFrench(source);
    expect(tokens.map((token) => token.text)).toEqual([
      "Êtes", "vous", "sage", "cria", "elle", "avais", "je", "raison", "celle-ci", "répond",
    ]);
    for (const token of tokens) expect(source.slice(token.start, token.end)).toBe(token.text);
  });

  it("keeps nominal rendez-vous intact without masking imperative inversion", () => {
    const source = "Les rendez-vous dans les endroits déserts; rendez-vous demain.";
    const tokens = tokenizeFrench(source);
    expect(tokens.map((token) => token.text)).toEqual(["Les", "rendez-vous", "dans", "les", "endroits", "déserts", "rendez", "vous", "demain"]);
    for (const token of tokens) expect(source.slice(token.start, token.end)).toBe(token.text);
  });

  it("produces byte-identical manifests for identical input", () => {
    const first = serializeManifest(prepareIngestionManifest(lafountainFixtures, "wrk_lievre_tortue"));
    const second = serializeManifest(prepareIngestionManifest(structuredClone(lafountainFixtures), "wrk_lievre_tortue"));
    expect(second).toBe(first);
    expect(first).not.toContain("generatedAt");
  });

  it("rejects source and thought-unit drift", () => {
    const bundle = structuredClone(lafountainFixtures);
    bundle.units.find((unit) => unit.id === "unt_corbeau_01")!.french += " ";
    expect(() => prepareIngestionManifest(bundle, "wrk_corbeau_renard")).toThrow("do not reconstruct canonical source");
  });

  it("keeps every candidate pending until an explicit editorial decision", () => {
    const manifest = prepareIngestionManifest(lafountainFixtures, "wrk_corbeau_renard");
    expect(manifest.candidates.length).toBeGreaterThan(100);
    expect(new Set(manifest.candidates.map((candidate) => candidate.disposition))).toEqual(new Set(["pending"]));
    expect(() => assertReviewComplete(manifest, [])).toThrow("pending token candidates");
  });

  it("applies proper-noun exclusions without converting them into vocabulary", () => {
    const manifest = prepareIngestionManifest(lafountainFixtures, "wrk_corbeau_renard");
    const corbeau = manifest.candidates.find((candidate) => candidate.text === "Corbeau")!;
    const reviewed = applyReviewDecisions(manifest, [{ candidateId: corbeau.id, disposition: "proper_noun" }]);
    expect(reviewed.candidates.find((candidate) => candidate.id === corbeau.id)?.disposition).toBe("proper_noun");
    expect(manifest.candidates.find((candidate) => candidate.id === corbeau.id)?.disposition).toBe("pending");
  });

  it("requires complete linguistic identity for vocabulary decisions", () => {
    const manifest = prepareIngestionManifest(lafountainFixtures, "wrk_corbeau_renard");
    const decisions = manifest.candidates.map((candidate) => ({ candidateId: candidate.id, disposition: "editorial_artifact" as const }));
    decisions[0] = { candidateId: manifest.candidates[0]!.id, disposition: "vocabulary" } as never;
    expect(() => assertReviewComplete(manifest, decisions)).toThrow("lacks lemma, sense, or surface-form identity");
  });

  it("requires a stable identity for expression review decisions", () => {
    const manifest = prepareIngestionManifest(lafountainFixtures, "wrk_corbeau_renard");
    const decisions = manifest.candidates.map((candidate) => ({ candidateId: candidate.id, disposition: "editorial_artifact" as const }));
    decisions[0] = { candidateId: manifest.candidates[0]!.id, disposition: "expression" } as never;
    expect(() => assertReviewComplete(manifest, decisions)).toThrow("lacks expression identity");
  });
});
