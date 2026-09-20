import { createHash } from "node:crypto";
import type { ContentBundle } from "../domain/model.js";
import { validateExpressionCatalog, type ExpressionCatalog } from "../domain/expression-content.js";
import { vocabularyIdentityKey } from "../domain/model.js";
import { validateContentBundle } from "../domain/validate.js";
import { prepareIngestionManifest, serializeManifest } from "../ingestion/prepare.js";
import type { IngestionManifest } from "../ingestion/model.js";
import { PIPELINE_VERSION, PipelineReportSchema, type PipelineReport, type PipelineStage, type PublicDomainEvidence } from "./model.js";

export interface PreparedContentArtifact {
  bundle: ContentBundle;
  expressionCatalog: ExpressionCatalog;
  authoring: { method: "codex_offline_review"; canonicalWordingPreserved: true; distractorsCheckedForAmbiguity: true };
}

export interface PipelineOptions {
  workId: string;
  publicDomainEvidence: PublicDomainEvidence;
  preparedContent?: PreparedContentArtifact;
}

export interface PipelineResult { bundle: ContentBundle; manifest: IngestionManifest; report: PipelineReport; expressionCatalog?: ExpressionCatalog }

const trustedSourceHosts = new Set(["www.gutenberg.org", "gallica.bnf.fr", "fr.wikisource.org"]);

export async function runAutonomousPublicationPipeline(input: ContentBundle, options: PipelineOptions): Promise<PipelineResult> {
  const bundle = structuredClone(input);
  const completed: PipelineStage[] = [];
  const initial = validateContentBundle(bundle);
  if (!initial.ok) throw new Error(`Invalid registered content: ${initial.diagnostics[0]?.code ?? "unknown"}`);
  completed.push("registration");

  const work = bundle.works.find((item) => item.id === options.workId);
  const source = bundle.sources.find((item) => item.workId === options.workId);
  if (!work || !source) throw new Error(`Missing work or source: ${options.workId}`);
  verifyRights(source.provenance.url, options.publicDomainEvidence);
  completed.push("rights_verification", "source_acquisition");

  const originalSourceDigest = digest(source.canonicalText);
  const originalUnits = bundle.units.filter((unit) => unit.workId === options.workId).sort((a, b) => a.ordinal - b.ordinal);
  const manifest = prepareIngestionManifest(bundle, options.workId);
  completed.push("source_structuring", "lexical_manifest");
  work.publicationState = "processing";

  const checksums = {
    source: `sha256:${originalSourceDigest}`,
    structure: `sha256:${digest(JSON.stringify(originalUnits))}`,
    lexicalManifest: `sha256:${digest(serializeManifest(manifest))}`,
  };
  if (!options.preparedContent) return blocked(bundle, manifest, completed, "linguistic_preparation", "preparation.artifact_missing", "The complete repository-owned linguistic and quiz artifact has not been authored yet", checksums);

  const preparation = structuredClone(options.preparedContent);
  assertCanonicalContentUnchanged(preparation.bundle, options.workId, originalSourceDigest, originalUnits);
  if (preparation.authoring.method !== "codex_offline_review" || !preparation.authoring.canonicalWordingPreserved || !preparation.authoring.distractorsCheckedForAmbiguity) {
    return blocked(bundle, manifest, completed, "linguistic_preparation", "preparation.assurance_missing", "The prepared artifact lacks its required offline editorial assurances", checksums);
  }
  const preparedWork = preparation.bundle.works.find((item) => item.id === options.workId);
  if (!preparedWork) throw new Error(`Preparation removed work: ${options.workId}`);
  preparedWork.publicationState = "learning_ready";
  const preparedValidation = validateContentBundle(preparation.bundle);
  if (!preparedValidation.ok) return blocked(preparation.bundle, manifest, completed, "linguistic_preparation", "preparation.invalid", preparedValidation.diagnostics[0]?.message ?? "Prepared bundle is invalid", checksums);
  const preparedExpressions = validateExpressionCatalog(preparation.bundle, preparation.expressionCatalog);
  if (preparedExpressions.length) return blocked(preparation.bundle, manifest, completed, "linguistic_preparation", "preparation.expression_invalid", `${preparedExpressions[0]!.code}: ${preparedExpressions[0]!.id}`, checksums);
  completed.push("linguistic_preparation");

  const verification = validateContentBundle(structuredClone(preparation.bundle));
  if (!verification.ok) return blocked(preparation.bundle, manifest, completed, "independent_verification", verification.diagnostics[0]?.code ?? "verification.failed", verification.diagnostics[0]?.message ?? "Independent verification failed", checksums);
  const expressionVerification = validateExpressionCatalog(structuredClone(preparation.bundle), structuredClone(preparation.expressionCatalog));
  if (expressionVerification.length) return blocked(preparation.bundle, manifest, completed, "independent_verification", expressionVerification[0]!.code, expressionVerification[0]!.id, checksums);
  completed.push("independent_verification", "learner_packaging");

  preparedWork.publicationState = "published";
  const publishedValidation = validateContentBundle(preparation.bundle);
  if (!publishedValidation.ok) return blocked(preparation.bundle, manifest, completed, "publication", "publication.invalid", publishedValidation.diagnostics[0]?.message ?? "Published bundle is invalid", checksums);
  const publishedExpressions = validateExpressionCatalog(preparation.bundle, preparation.expressionCatalog);
  if (publishedExpressions.length) return blocked(preparation.bundle, manifest, completed, "publication", publishedExpressions[0]!.code, publishedExpressions[0]!.id, checksums);
  completed.push("publication");
  const report = reportFor(preparation.bundle, options.workId, manifest, completed, [], { ...checksums, publishedBundle: `sha256:${digest(JSON.stringify({ bundle: preparation.bundle, expressionCatalog: preparation.expressionCatalog }))}` });
  return { bundle: preparation.bundle, expressionCatalog: preparation.expressionCatalog, manifest, report };
}

function verifyRights(url: string | undefined, evidence: PublicDomainEvidence): void {
  if (evidence.basis !== "us_publication_before_1931" || evidence.publicationYear > 1930) throw new Error("Public-domain evidence does not satisfy content-pipeline-v1");
  if (!url || !trustedSourceHosts.has(new URL(url).hostname)) throw new Error("Canonical source is not hosted by an approved source archive");
}

function assertCanonicalContentUnchanged(bundle: ContentBundle, workId: string, sourceDigest: string, units: ContentBundle["units"]): void {
  const source = bundle.sources.find((item) => item.workId === workId);
  const candidateUnits = bundle.units.filter((unit) => unit.workId === workId).sort((a, b) => a.ordinal - b.ordinal);
  if (!source || digest(source.canonicalText) !== sourceDigest || JSON.stringify(candidateUnits) !== JSON.stringify(units)) throw new Error("Preparation changed immutable canonical content");
}

function blocked(bundle: ContentBundle, manifest: IngestionManifest, completedStages: PipelineStage[], blockedStage: PipelineStage, code: string, message: string, checksums: PipelineReport["checksums"]): PipelineResult {
  const report = reportFor(bundle, manifest.workId, manifest, completedStages, [{ code, message }], checksums, blockedStage);
  return { bundle, manifest, report };
}

function reportFor(bundle: ContentBundle, workId: string, manifest: IngestionManifest, completedStages: PipelineStage[], diagnostics: { code: string; message: string }[], checksums: PipelineReport["checksums"], blockedStage?: PipelineStage): PipelineReport {
  const identities = new Set(bundle.occurrences.filter((item) => item.workId === workId).map((item) => vocabularyIdentityKey(item.surfaceFormId, item.senseId)));
  const state = bundle.works.find((item) => item.id === workId)?.publicationState ?? "processing";
  return PipelineReportSchema.parse({
    schemaVersion: 1,
    pipelineVersion: PIPELINE_VERSION,
    workId,
    outcome: state === "published" && diagnostics.length === 0 ? "published" : "blocked",
    resultingPublicationState: state,
    completedStages,
    ...(blockedStage ? { blockedStage } : {}),
    diagnostics,
    checksums,
    counts: { thoughtUnits: bundle.units.filter((item) => item.workId === workId).length, tokenCandidates: manifest.candidates.length, vocabularyIdentities: identities.size, quizItems: bundle.quizItems.length },
  });
}

function digest(value: string): string { return createHash("sha256").update(value, "utf8").digest("hex"); }
