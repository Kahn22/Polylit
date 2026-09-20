export interface EditorialBatchManifest {
  batch: number;
  totalBatches: number;
  identityCount: number;
  identities: { surfaceFormId: string; senseId: string; form: string; meaning: string }[];
}

/** Account for both frozen batches against a freshly generated coverage report. */
export function reportEditorialBatchProgress(
  manifests: readonly EditorialBatchManifest[],
  entries: readonly { surfaceFormId: string; senseId: string; status: string }[],
  remaining: number,
) {
  const byIdentity = new Map(entries.map((entry) => [`${entry.surfaceFormId}:${entry.senseId}`, entry.status]));
  const seen = new Set<string>();
  const batches = manifests.map((manifest, index) => {
    if (manifest.batch !== index + 1 || manifest.totalBatches !== manifests.length ||
        manifest.identityCount !== manifest.identities.length) throw new Error("Invalid editorial batch manifest");
    let needsRevision = 0;
    for (const identity of manifest.identities) {
      const key = `${identity.surfaceFormId}:${identity.senseId}`;
      if (seen.has(key) || !byIdentity.has(key)) throw new Error(`Duplicate or unknown identity ${key}`);
      seen.add(key);
      if (byIdentity.get(key) === "needs_revision") needsRevision++;
    }
    return { batch: manifest.batch, identityCount: manifest.identityCount,
      prepared: manifest.identityCount - needsRevision, needsRevision };
  });
  if (seen.size !== 1020 || batches.reduce((total, batch) => total + batch.needsRevision, 0) !== remaining) {
    throw new Error("The frozen batches do not account for the remaining editorial work");
  }
  return batches;
}
