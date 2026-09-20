import { describe, expect, it } from "vitest";
import { corbeauLearningBundle } from "../src/content/linguistic/le-corbeau-et-le-renard.js";
import { zolaSourceAcquisition } from "../src/content/fixtures/zola.js";
import { runAutonomousPublicationPipeline, type PreparedContentArtifact } from "../src/pipeline/run.js";

const evidence = { publicationYear: 1898, basis: "us_publication_before_1931" as const };

describe("autonomous publication pipeline", () => {
  it("runs deterministically and fails closed when preparation is unavailable", async () => {
    const first = await runAutonomousPublicationPipeline(zolaSourceAcquisition, { workId: "wrk_zola_jaccuse", publicDomainEvidence: evidence });
    const second = await runAutonomousPublicationPipeline(zolaSourceAcquisition, { workId: "wrk_zola_jaccuse", publicDomainEvidence: evidence });
    expect(second.report).toEqual(first.report);
    expect(second.manifest).toEqual(first.manifest);
    expect(first.report.outcome).toBe("blocked");
    expect(first.report.blockedStage).toBe("linguistic_preparation");
    expect(first.report.diagnostics[0]?.code).toBe("preparation.artifact_missing");
    expect(first.report.resultingPublicationState).toBe("processing");
    expect(first.report.counts.thoughtUnits).toBe(199);
    expect(first.report.counts.tokenCandidates).toBeGreaterThan(4_000);
  });

  it("automatically publishes only a fully prepared and independently verified bundle", async () => {
    const input = structuredClone(corbeauLearningBundle);
    input.sources[0]!.provenance.url = "https://www.gutenberg.org/ebooks/999";
    const preparedContent: PreparedContentArtifact = { bundle: input, expressionCatalog: { identities: [], occurrences: [], preparedQuizzes: [] }, authoring: { method: "codex_offline_review", canonicalWordingPreserved: true, distractorsCheckedForAmbiguity: true } };
    const result = await runAutonomousPublicationPipeline(input, { workId: "wrk_corbeau_renard", publicDomainEvidence: { publicationYear: 1668, basis: "us_publication_before_1931" }, preparedContent });
    expect(result.report.outcome).toBe("published");
    expect(result.report.completedStages.at(-1)).toBe("publication");
    expect(result.bundle.works.find((work) => work.id === "wrk_corbeau_renard")?.publicationState).toBe("published");
  });

  it("blocks publication when an expression is missing any prepared quiz band", async () => {
    const input = structuredClone(corbeauLearningBundle);
    input.sources[0]!.provenance.url = "https://www.gutenberg.org/ebooks/999";
    const preparedContent: PreparedContentArtifact = {
      bundle: input,
      expressionCatalog: {
        identities: [{ id: "exi_sans_mentir", headword: "sans mentir", gloss: "truthfully", definition: "en disant la vérité" }],
        occurrences: [{ id: "exo_sans_mentir", identityId: "exi_sans_mentir", workId: "wrk_corbeau_renard", unitId: "unt_corbeau_06", start: 0, end: 11, text: "Sans mentir" }],
        preparedQuizzes: [],
      },
      authoring: { method: "codex_offline_review", canonicalWordingPreserved: true, distractorsCheckedForAmbiguity: true },
    };
    const result = await runAutonomousPublicationPipeline(input, { workId: "wrk_corbeau_renard", publicDomainEvidence: { publicationYear: 1668, basis: "us_publication_before_1931" }, preparedContent });
    expect(result.report.outcome).toBe("blocked");
    expect(result.report.diagnostics[0]?.code).toBe("preparation.expression_invalid");
    expect(result.report.diagnostics[0]?.message).toContain("expression.missing_prepared_quiz");
  });

  it("rejects any provider that changes canonical wording", async () => {
    const mutated = structuredClone(zolaSourceAcquisition);
    mutated.sources[0]!.canonicalText += " changement";
    const preparedContent: PreparedContentArtifact = { bundle: mutated, expressionCatalog: { identities: [], occurrences: [], preparedQuizzes: [] }, authoring: { method: "codex_offline_review", canonicalWordingPreserved: true, distractorsCheckedForAmbiguity: true } };
    await expect(runAutonomousPublicationPipeline(zolaSourceAcquisition, { workId: "wrk_zola_jaccuse", publicDomainEvidence: evidence, preparedContent })).rejects.toThrow("immutable canonical content");
  });
});
