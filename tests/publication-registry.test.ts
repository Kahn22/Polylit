import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { ContentBundle } from "../src/domain/model.js";
import type { ExpressionCatalog } from "../src/domain/expression-content.js";
import { assertApprovedWorks, loadPublication } from "../src/publication/repository.js";
import { prepareWorkUpdate } from "../src/publication/update-work.js";
import { fromNeutral, toNeutral } from "../src/publication/format.js";
import { semanticProgressPolicy } from "../src/content/editorial/spanish-02.js";
const publication = loadPublication();
const original: ContentBundle = JSON.parse(readFileSync(new URL("../content/learning/jaccuse.json", import.meta.url), "utf8"));

describe("approved publication sources", () => {
  it("preserves the migration baseline except for individually recorded editorial changes", () => {
    const sorted = (values: unknown[]) => [...values].sort((a, b) => {
      const left = a as { id?: string; workId?: string }, right = b as typeof left;
      return (left.id ?? left.workId ?? "").localeCompare(right.id ?? right.workId ?? "");
    });
    const expected = structuredClone(original);
    const expectedExpressions: ExpressionCatalog = JSON.parse(readFileSync(new URL("../content/learning/jaccuse-expressions.json", import.meta.url), "utf8"));
    const indices = new Map<string, Map<string, number>>();
    const ledgerDirectory = new URL("../content/published/editorial-batches/", import.meta.url);
    for (const name of readdirSync(ledgerDirectory).sort()) {
      const ledger = JSON.parse(readFileSync(new URL(name, ledgerDirectory), "utf8")) as { masteryIdsChanged: boolean; progressPolicy?: string; progressTransfers?: unknown[]; mappings?: { from: string; to: string; occurrenceIds: string[] }[]; changes: { kind: keyof ContentBundle | "expressionQuizzes"; id: string; before: unknown; after: unknown }[] };
      if (ledger.masteryIdsChanged) {
        expect(ledger.progressPolicy).toBe(semanticProgressPolicy);
        expect(ledger.progressTransfers).toEqual([]);
        expect(ledger.mappings?.length).toBeGreaterThan(0);
        const mappedOccurrenceIds = ledger.mappings!.flatMap(mapping => mapping.occurrenceIds);
        expect(new Set(mappedOccurrenceIds).size).toBe(mappedOccurrenceIds.length);
        expect(mappedOccurrenceIds.length).toBe(ledger.changes.filter(change => change.kind === "occurrences").length);
      }
      for (const change of ledger.changes) {
        const items = (change.kind === "expressionQuizzes" ? expectedExpressions.preparedQuizzes : expected[change.kind]) as { id: string }[];
        let byId = indices.get(change.kind);
        if (!byId) {
          byId = new Map(items.map((item, index) => [item.id, index]));
          indices.set(change.kind, byId);
        }
        const index = byId.get(change.id) ?? -1;
        expect((change.after as { id: string }).id).toBe(change.id);
        if (change.before === null) {
          // Rebinding a lemma can preserve the surface+sense mastery identity.
          if (change.kind !== "lemmas") expect(ledger.masteryIdsChanged).toBe(true);
          expect(["lemmas", "senses", "surfaceForms", "quizItems"]).toContain(change.kind);
          expect(index).toBe(-1);
          byId.set(change.id, items.length);
          items.push(change.after as { id: string });
        } else {
          expect(index).toBeGreaterThanOrEqual(0);
          expect(items[index]).toEqual(change.before);
          if (change.kind === "occurrences") {
            const before = change.before as ContentBundle["occurrences"][number], after = change.after as typeof before;
            const mapping = ledger.mappings?.find(item => item.occurrenceIds.includes(change.id));
            expect(mapping?.from).toBe(`${before.surfaceFormId}:${before.senseId}`);
            expect(mapping?.to).toBe(`${after.surfaceFormId}:${after.senseId}`);
            expect({ ...after, surfaceFormId: before.surfaceFormId, senseId: before.senseId }).toEqual(before);
          }
          items[index] = change.after as { id: string };
        }
      }
    }
    for (const key of Object.keys(original) as (keyof ContentBundle)[]) expect(sorted(publication.bundle[key]), key).toEqual(sorted(expected[key]));
    for (const key of Object.keys(expectedExpressions) as (keyof ExpressionCatalog)[]) expect(sorted(publication.expressionCatalog[key]), key).toEqual(sorted(expectedExpressions[key]));
    expect(publication.bundle.occurrences).toHaveLength(original.occurrences.length);
    expect(sorted(publication.bundle.sources)).toEqual(sorted(original.sources));
    expect(publication.registry.works).toHaveLength(10);
  });
  it("round-trips neutral names without renaming exclusions, expressions, or notes", () => {
    expect(fromNeutral(toNeutral(original))).toEqual(original);
    const serialized = JSON.stringify(toNeutral(original));
    expect(serialized).not.toMatch(/"(?:french|contextFrench|promptFrench|choicesFrench|choicesEnglish)":/);
  });
  it("blocks the old five-work overwrite before any source replacement", () => {
    const candidate = { ...publication.bundle, works: publication.bundle.works.filter(work => ["wrk_corbeau_renard", "wrk_lievre_tortue", "wrk_zola_jaccuse", "wrk_palma_camisa_margarita", "wrk_quiroga_almohadon_plumas"].includes(work.id)) };
    expect(() => assertApprovedWorks(candidate, publication.registry)).toThrow("approved work missing");
  });
  it("requires explicit retirement and refuses unexpected additions or changed languages", () => {
    const registry = structuredClone(publication.registry);
    registry.works[0]!.status = "retired";
    expect(() => assertApprovedWorks(publication.bundle, registry)).toThrow("retirement reason");
    const other = structuredClone(publication.registry);
    other.works[0]!.language = "es";
    expect(() => assertApprovedWorks(publication.bundle, other)).toThrow("Language mismatch");
    const extra = { ...publication.bundle, works: [...publication.bundle.works, { ...publication.bundle.works[0]!, id: "wrk_unapproved" }] };
    expect(() => assertApprovedWorks(extra, publication.registry)).toThrow("not approved");
  });
  it("updates one work without losing the other nine or duplicating shared records", () => {
    // A no-change import must use current reviewed questions. The migration
    // baseline now contains superseded shared French questions and is correctly
    // rejected as an unacknowledged overwrite.
    const result = prepareWorkUpdate(publication, structuredClone(publication.bundle), publication.expressionCatalog, "wrk_zola_jaccuse");
    expect(result.bundle.works).toEqual(publication.bundle.works);
    expect(result.bundle.quizItems).toHaveLength(publication.bundle.quizItems.length);
    expect(result.bundle.sources.filter(item => item.workId !== "wrk_zola_jaccuse")).toEqual(publication.bundle.sources.filter(item => item.workId !== "wrk_zola_jaccuse"));
  });
  it("requires explicit acknowledgement before replacing shared authored questions", () => {
    const incoming = structuredClone(publication.bundle);
    const occurrence = incoming.occurrences.find(item => item.workId === "wrk_zola_jaccuse")!;
    const quiz = incoming.quizItems.find(item => item.surfaceFormId === occurrence.surfaceFormId && item.senseId === occurrence.senseId)!;
    quiz.contextFrench += " Une modification.";
    expect(() => prepareWorkUpdate(publication, incoming, publication.expressionCatalog, "wrk_zola_jaccuse")).toThrow("Shared record differs");
  });
});
