import { createHash } from "node:crypto";
import type { ContentBundle } from "../domain/model.js";
import type { ExpressionCatalog } from "../domain/expression-content.js";

/** Semantic JSON digest: object property ordering is not an editorial change. */
export function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value).filter(([, v]) => v !== undefined).sort(([a], [b]) => a.localeCompare(b, "en")).map(([k, v]) => `${JSON.stringify(k)}:${stableJson(v)}`).join(",")}}`;
  return JSON.stringify(value);
}
export function revision(prefix: string, value: unknown): string {
  return `${prefix}_${createHash("sha256").update(stableJson(value)).digest("hex")}`;
}
export interface TextBinding {
  textRevision: string;
  structureRevision: string;
  annotationRevision: string;
  offsetUnit: "utf16";
  separator: "\n";
  units: { unitId: string; start: number; end: number }[];
}
export function textBinding(bundle: Pick<ContentBundle, "sources" | "units" | "occurrences" | "exclusions">, expressions: ExpressionCatalog["occurrences"], workId: string): TextBinding {
  const sources = bundle.sources.filter(item => item.workId === workId);
  if (sources.length !== 1) throw new Error(`Exactly one canonical source is required: ${workId}`);
  const source = sources[0]!;
  const units = bundle.units.filter(item => item.workId === workId).sort((a, b) => a.ordinal - b.ordinal);
  if (!units.length || units.map(unit => unit.french).join("\n") !== source.canonicalText) throw new Error(`Reading units do not reconstruct canonical text: ${workId}`);
  let position = 0;
  const anchors = units.map(unit => {
    const anchor = { unitId: unit.id, start: position, end: position + unit.french.length };
    position = anchor.end + 1;
    return anchor;
  });
  const textRevision = revision("txt", source.canonicalText);
  const structureRevision = revision("str", { textRevision, anchors });
  const byId = <T extends { id: string }>(values: T[]) => [...values].sort((a, b) => a.id.localeCompare(b.id, "en"));
  const annotationRevision = revision("ann", {
    structureRevision,
    occurrences: byId(bundle.occurrences.filter(item => item.workId === workId)),
    exclusions: byId(bundle.exclusions.filter(item => item.workId === workId)),
    expressions: byId(expressions.filter(item => item.workId === workId)),
  });
  return { textRevision, structureRevision, annotationRevision, offsetUnit: "utf16", separator: "\n", units: anchors };
}
export function assertTextBinding(actual: TextBinding, expected: TextBinding, workId: string): void {
  if (stableJson(actual) !== stableJson(expected)) throw new Error(`Stale text/annotation binding: ${workId}; re-anchor and review the affected revision`);
}
