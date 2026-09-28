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
    // New works are additive intakes, distinct from corrections to old records.
    // Replay their exact records while still comparing every baseline record.
    const intakeDirectory = new URL("../content/published/intake-batches/", import.meta.url);
    for (const name of readdirSync(intakeDirectory).sort()) {
      const intake = JSON.parse(readFileSync(new URL(name, intakeDirectory), "utf8")) as {
        kind: string; workId: string; progressTransfers: unknown[]; replacesExistingRecords: boolean;
        bundleAdditions: ContentBundle; expressionAdditions: ExpressionCatalog;
      };
      expect(intake.kind).toBe("additive_work_intake");
      expect(intake.progressTransfers).toEqual([]);
      expect(intake.replacesExistingRecords).toBe(false);
      expect(expected.works.some(work => work.id === intake.workId)).toBe(false);
      for (const key of Object.keys(expected) as (keyof ContentBundle)[]) {
        const current = expected[key] as { id?: string; workId?: string }[];
        const existing = new Set(current.map(item => item.id ?? item.workId));
        for (const item of intake.bundleAdditions[key] as typeof current) {
          expect(existing.has(item.id ?? item.workId), `${key}:${item.id ?? item.workId}`).toBe(false);
          existing.add(item.id ?? item.workId);
          current.push(item);
        }
      }
      for (const key of Object.keys(expectedExpressions) as (keyof ExpressionCatalog)[]) {
        const current = expectedExpressions[key] as { id: string }[];
        for (const item of intake.expressionAdditions[key]) {
          expect(current.some(existing => existing.id === item.id)).toBe(false);
          current.push(item);
        }
      }
    }
    // Canonical-source corrections are replayed after additive intakes. They
    // may change source/work records keyed by workId, add or remove token
    // annotations, and preserve learner history without progress transfers.
    const correctionDirectory = new URL("../content/published/source-correction-batches/", import.meta.url);
    for (const name of readdirSync(correctionDirectory).sort()) {
      const ledger = JSON.parse(readFileSync(new URL(name, correctionDirectory), "utf8")) as {
        kind: string; masteryIdsChanged: boolean; progressPolicy: string; progressTransfers: unknown[];
        mappings: { occurrenceId: string; from: string; to: string; progress: string }[];
        changes: { kind: keyof ContentBundle; id: string; before: unknown; after: unknown }[];
      };
      expect(ledger.kind).toBe("canonical_source_correction");
      expect(ledger.masteryIdsChanged).toBe(true);
      expect(ledger.progressPolicy).toBe(semanticProgressPolicy);
      expect(ledger.progressTransfers).toEqual([]);
      for (const change of ledger.changes) {
        const items = expected[change.kind] as { id?: string; workId?: string }[];
        const key = (item: { id?: string; workId?: string }) => change.kind === "sources" || change.kind === "readiness" ? item.workId : item.id;
        const index = items.findIndex(item => key(item) === change.id);
        if (change.before === null) {
          expect(index, `${change.kind}:${change.id}`).toBe(-1);
          items.push(change.after as { id?: string; workId?: string });
        } else {
          expect(index, `${change.kind}:${change.id}`).toBeGreaterThanOrEqual(0);
          expect(items[index]).toEqual(change.before);
          if (change.after === null) items.splice(index, 1);
          else items[index] = change.after as { id?: string; workId?: string };
        }
      }
      for (const mapping of ledger.mappings) {
        const change = ledger.changes.find(item => item.kind === "occurrences" && item.id === mapping.occurrenceId)!;
        const before = change.before as ContentBundle["occurrences"][number], after = change.after as typeof before;
        expect(mapping.from).toBe(`${before.surfaceFormId}:${before.senseId}`);
        expect(mapping.to).toBe(`${after.surfaceFormId}:${after.senseId}`);
        expect(mapping.progress).toBe("fresh_on_actual_view_if_identity_not_previously_encountered");
      }
    }
    for (const key of Object.keys(original) as (keyof ContentBundle)[]) expect(sorted(publication.bundle[key]), key).toEqual(sorted(expected[key]));
    for (const key of Object.keys(expectedExpressions) as (keyof ExpressionCatalog)[]) expect(sorted(publication.expressionCatalog[key]), key).toEqual(sorted(expectedExpressions[key]));
    expect(publication.bundle.occurrences).toHaveLength(expected.occurrences.length);
    expect(sorted(publication.bundle.sources)).toEqual(sorted(expected.sources));
    expect(publication.registry.works).toHaveLength(expected.works.length);
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
  it("updates one work without losing other works or duplicating shared records", () => {
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
