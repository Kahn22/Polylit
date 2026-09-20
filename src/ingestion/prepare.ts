import { createHash } from "node:crypto";
import type { ContentBundle } from "../domain/model.js";
import { IngestionManifestSchema, type IngestionManifest, type ReviewDecision, type TokenCandidate } from "./model.js";
import { tokenizeFrench } from "./tokenize.js";

export function prepareIngestionManifest(bundle: ContentBundle, workId: string): IngestionManifest {
  const source = bundle.sources.find((item) => item.workId === workId);
  if (!source) throw new Error(`No canonical source for ${workId}`);
  const units = bundle.units.filter((item) => item.workId === workId).sort((a, b) => a.ordinal - b.ordinal);
  if (units.length === 0) throw new Error(`No thought units for ${workId}`);
  const reconstructed = units.map((unit) => unit.french).join("\n");
  if (reconstructed !== source.canonicalText) throw new Error(`Thought units do not reconstruct canonical source for ${workId}`);

  const candidates: TokenCandidate[] = units.flatMap((unit) => tokenizeFrench(unit.french).map((token, index) => ({
    id: stableCandidateId(workId, unit.id, token.start, token.end, token.normalized),
    workId,
    unitId: unit.id,
    start: token.start,
    end: token.end,
    text: token.text,
    normalized: token.normalized,
    capitalizationHint: capitalizationHint(token.text, index),
    disposition: "pending" as const,
  })));

  return IngestionManifestSchema.parse({
    schemaVersion: 1,
    algorithmVersion: "fr-tokenizer-v2",
    workId,
    sourceDigest: `sha256:${digest(source.canonicalText)}`,
    candidates,
  });
}

export function applyReviewDecisions(manifest: IngestionManifest, decisions: readonly ReviewDecision[]): IngestionManifest {
  const decisionById = new Map(decisions.map((decision) => [decision.candidateId, decision]));
  if (decisionById.size !== decisions.length) throw new Error("Review decisions contain duplicate candidate IDs");
  for (const id of decisionById.keys()) if (!manifest.candidates.some((candidate) => candidate.id === id)) throw new Error(`Unknown candidate ID: ${id}`);
  const candidates = manifest.candidates.map((candidate) => {
    const decision = decisionById.get(candidate.id);
    return decision ? { ...candidate, disposition: decision.disposition } : candidate;
  });
  return IngestionManifestSchema.parse({ ...manifest, candidates });
}

export function assertReviewComplete(manifest: IngestionManifest, decisions: readonly ReviewDecision[]): void {
  const reviewed = applyReviewDecisions(manifest, decisions);
  const pending = reviewed.candidates.filter((candidate) => candidate.disposition === "pending");
  if (pending.length) throw new Error(`${manifest.workId} has ${pending.length} pending token candidates`);
  const decisionById = new Map(decisions.map((decision) => [decision.candidateId, decision]));
  for (const candidate of reviewed.candidates.filter((item) => item.disposition === "vocabulary")) {
    const decision = decisionById.get(candidate.id);
    if (!decision?.lemmaId || !decision.senseId || !decision.surfaceFormId) throw new Error(`Vocabulary candidate ${candidate.id} lacks lemma, sense, or surface-form identity`);
  }
  for (const candidate of reviewed.candidates.filter((item) => item.disposition === "expression")) {
    if (!decisionById.get(candidate.id)?.expressionIdentityId) throw new Error(`Expression candidate ${candidate.id} lacks expression identity`);
  }
}

export function serializeManifest(manifest: IngestionManifest): string {
  return `${JSON.stringify(IngestionManifestSchema.parse(manifest), null, 2)}\n`;
}

function capitalizationHint(text: string, index: number): TokenCandidate["capitalizationHint"] {
  if (text[0] === text[0]?.toLocaleUpperCase("fr-FR") && text[0] !== text[0]?.toLocaleLowerCase("fr-FR")) return index === 0 ? "sentence_initial" : "internal_uppercase";
  return "lowercase";
}

function stableCandidateId(workId: string, unitId: string, start: number, end: number, normalized: string): string {
  return `tok_${digest([workId, unitId, start, end, normalized].join("\u0000")).slice(0, 24)}`;
}

function digest(value: string): string { return createHash("sha256").update(value, "utf8").digest("hex"); }
