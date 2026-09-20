import type { Language } from "./format.js";
import { revision } from "./revisions.js";

export const REVIEW_POLICY = "polylit-editorial-v2" as const;
export type ReviewKind = "quiz" | "vocabulary" | "annotations" | "expression";
export interface ReviewRecord {
  id: string;
  language: Language;
  kind: ReviewKind;
  subjectId: string;
  subjectRevision: string;
  policy: typeof REVIEW_POLICY;
  status: "pending" | "approved" | "rejected";
  reason: string;
  reviewedBy?: string;
  reviewedAt?: string;
  checks?: string[];
}
export function reviewRevision(subject: unknown): string { return revision("rev", subject); }
export function pendingReview(language: Language, kind: ReviewKind, subjectId: string, subject: unknown, reason = "Imported without a question-/identity-level approval bound to this exact revision"): ReviewRecord {
  return { id: `${kind}:${subjectId}`, language, kind, subjectId, subjectRevision: reviewRevision(subject), policy: REVIEW_POLICY, status: "pending", reason };
}
export const requiredChecks: Record<ReviewKind, readonly string[]> = {
  quiz: ["natural_context", "sense_in_context", "single_defensible_answer", "distractors_reviewed", "three_distinct_contexts", "target_checked"],
  vocabulary: ["lemma_and_part_of_speech", "sense_in_every_occurrence", "surface_form", "existing_identity_reuse"],
  annotations: ["canonical_reconstruction", "all_spans", "exclusions_and_expressions"],
  expression: ["shared_meaning", "source_spans", "separate_from_component_words"],
};
export function approvalIssues(review: ReviewRecord | undefined, subject: unknown, kind: ReviewKind, subjectId: string, language: Language): string[] {
  if (!review) return ["approval_missing"];
  const issues: string[] = [];
  if (review.kind !== kind || review.subjectId !== subjectId || review.language !== language || review.id !== `${kind}:${subjectId}` || review.policy !== REVIEW_POLICY) issues.push("approval_subject_mismatch");
  if (review.subjectRevision !== reviewRevision(subject)) issues.push("approval_stale");
  if (review.status !== "approved") issues.push("approval_pending");
  if (review.status === "approved") {
    if (!review.reviewedBy?.trim() || !review.reviewedAt || !Number.isFinite(Date.parse(review.reviewedAt)) || !review.reason.trim()) issues.push("approval_evidence_missing");
    if (requiredChecks[kind].some(check => !review.checks?.includes(check))) issues.push("approval_checks_missing");
  }
  return issues;
}
/** Call only after an actual offline review; mechanical migration never calls this. */
export function approveReview(language: Language, kind: ReviewKind, subjectId: string, subject: unknown, reviewer: string, reviewedAt: string, reason: string): ReviewRecord {
  const record: ReviewRecord = { ...pendingReview(language, kind, subjectId, subject, reason), status: "approved", reviewedBy: reviewer, reviewedAt, checks: [...requiredChecks[kind]] };
  if (approvalIssues(record, subject, kind, subjectId, language).length) throw new Error("Editorial approval evidence is incomplete");
  return record;
}
