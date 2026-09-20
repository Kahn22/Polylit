import { z } from "zod";

export const PIPELINE_VERSION = "content-pipeline-v1" as const;

export const PipelineStageSchema = z.enum([
  "registration",
  "rights_verification",
  "source_acquisition",
  "source_structuring",
  "lexical_manifest",
  "linguistic_preparation",
  "independent_verification",
  "learner_packaging",
  "publication",
]);

export const PipelineReportSchema = z.object({
  schemaVersion: z.literal(1),
  pipelineVersion: z.literal(PIPELINE_VERSION),
  workId: z.string().regex(/^wrk_[a-z0-9][a-z0-9_-]*$/),
  outcome: z.enum(["blocked", "published"]),
  resultingPublicationState: z.enum(["source_acquired", "source_structured", "processing", "learning_ready", "published"]),
  completedStages: z.array(PipelineStageSchema),
  blockedStage: PipelineStageSchema.optional(),
  diagnostics: z.array(z.object({ code: z.string().min(1), message: z.string().min(1) })),
  checksums: z.object({ source: z.string(), structure: z.string(), lexicalManifest: z.string(), publishedBundle: z.string().optional() }),
  counts: z.object({ thoughtUnits: z.number().int().nonnegative(), tokenCandidates: z.number().int().nonnegative(), vocabularyIdentities: z.number().int().nonnegative(), quizItems: z.number().int().nonnegative() }),
});

export type PipelineStage = z.infer<typeof PipelineStageSchema>;
export type PipelineReport = z.infer<typeof PipelineReportSchema>;

export interface PublicDomainEvidence {
  publicationYear: number;
  basis: "us_publication_before_1931";
}
