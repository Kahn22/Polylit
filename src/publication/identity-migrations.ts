import type { VocabularyLearnerStateRecord } from "../learner/scheduler.js";
import { stableJson } from "./revisions.js";

export interface IdentityAlias { from: string; to: string; reason: string }
export interface IdentityMigrationPlan {
  version: 1;
  language: "fr" | "es";
  id: string;
  status: "draft" | "approved";
  reviewedBy?: string;
  reason: string;
  aliases: IdentityAlias[];
}
/** Preview only. No writes, merges, automatic highest-level selection, or fan-out. */
export function previewIdentityMigration(state: VocabularyLearnerStateRecord, plan: IdentityMigrationPlan) {
  const next = structuredClone(state);
  const fromIds = new Set<string>();
  const sourceIds = new Set(plan.aliases.map(alias => alias.from));
  for (const alias of plan.aliases) {
    if (alias.from === alias.to || !alias.reason.trim() || fromIds.has(alias.from) || sourceIds.has(alias.to)) throw new Error("Identity aliases must be explicit, acyclic, one-step mappings without sense fan-out");
    fromIds.add(alias.from);
  }
  const conflicts: { from: string; to: string; reason: string }[] = [];
  for (const alias of plan.aliases) {
    const prior = state[alias.from];
    if (!prior) continue;
    const target = next[alias.to];
    if (target && stableJson(target) !== stableJson(prior)) {
      conflicts.push({ from: alias.from, to: alias.to, reason: "Different mastery/scheduling histories require a separately approved resolution; neither was overwritten" });
      continue;
    }
    // Preserve the old key as a recovery alias; preview does not erase records.
    next[alias.to] = structuredClone(prior);
  }
  return { next, original: structuredClone(state), conflicts, canApply: plan.status === "approved" && !!plan.reviewedBy?.trim() && !!plan.reason.trim() && conflicts.length === 0 };
}
