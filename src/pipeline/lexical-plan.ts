import type { ContentBundle } from "../domain/model.js";
import { vocabularyIdentityKey } from "../domain/model.js";
import type { IngestionManifest } from "../ingestion/model.js";

export interface LexicalPlanEntry {
  normalized: string;
  occurrenceCount: number;
  candidateIds: string[];
  sampleContexts: string[];
  capitalizationHints: string[];
  reusableIdentities: { surfaceFormId: string; senseId: string }[];
}

/** Groups occurrences for offline editorial authoring without making linguistic decisions. */
export function createLexicalPlan(target: ContentBundle, manifest: IngestionManifest, existing: ContentBundle): LexicalPlanEntry[] {
  const unitById = new Map(target.units.map((unit) => [unit.id, unit]));
  const existingSurfaceIds = new Map<string, string[]>();
  for (const surface of existing.surfaceForms) {
    const ids = existingSurfaceIds.get(surface.normalized) ?? [];
    ids.push(surface.id);
    existingSurfaceIds.set(surface.normalized, ids);
  }
  const groups = new Map<string, typeof manifest.candidates>();
  for (const candidate of manifest.candidates) {
    const group = groups.get(candidate.normalized) ?? [];
    group.push(candidate);
    groups.set(candidate.normalized, group);
  }
  return [...groups].sort(([a], [b]) => a.localeCompare(b, "fr")).map(([normalized, candidates]) => {
    const surfaceIds = new Set(existingSurfaceIds.get(normalized) ?? []);
    const reusable = new Map<string, { surfaceFormId: string; senseId: string }>();
    for (const occurrence of existing.occurrences.filter((item) => surfaceIds.has(item.surfaceFormId))) {
      const identity = { surfaceFormId: occurrence.surfaceFormId, senseId: occurrence.senseId };
      reusable.set(vocabularyIdentityKey(identity.surfaceFormId, identity.senseId), identity);
    }
    return {
      normalized,
      occurrenceCount: candidates.length,
      candidateIds: candidates.map((candidate) => candidate.id),
      sampleContexts: [...new Set(candidates.map((candidate) => unitById.get(candidate.unitId)?.french).filter((value): value is string => value !== undefined))].slice(0, 3),
      capitalizationHints: [...new Set(candidates.map((candidate) => candidate.capitalizationHint))].sort(),
      reusableIdentities: [...reusable].sort(([a], [b]) => a.localeCompare(b)).map(([, identity]) => identity),
    };
  });
}
