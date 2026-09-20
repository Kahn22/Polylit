import { z } from "zod";

const id = (prefix: string) => z.string().regex(new RegExp(`^${prefix}_[a-z0-9][a-z0-9_-]*$`));

export const ReviewDispositionSchema = z.enum([
  "pending",
  "vocabulary",
  "expression",
  "proper_noun",
  "editorial_artifact",
]);

export const TokenCandidateSchema = z.object({
  id: id("tok"),
  workId: id("wrk"),
  unitId: id("unt"),
  start: z.number().int().nonnegative(),
  end: z.number().int().positive(),
  text: z.string().min(1),
  normalized: z.string().min(1),
  capitalizationHint: z.enum(["lowercase", "sentence_initial", "internal_uppercase"]),
  disposition: ReviewDispositionSchema,
});

export const IngestionManifestSchema = z.object({
  schemaVersion: z.literal(1),
  algorithmVersion: z.literal("fr-tokenizer-v2"),
  workId: id("wrk"),
  sourceDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/),
  candidates: z.array(TokenCandidateSchema),
});

export type ReviewDisposition = z.infer<typeof ReviewDispositionSchema>;
export type TokenCandidate = z.infer<typeof TokenCandidateSchema>;
export type IngestionManifest = z.infer<typeof IngestionManifestSchema>;

export interface ReviewDecision {
  candidateId: string;
  disposition: Exclude<ReviewDisposition, "pending">;
  lemmaId?: string;
  senseId?: string;
  surfaceFormId?: string;
  expressionIdentityId?: string;
}
