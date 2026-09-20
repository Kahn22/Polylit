import { describe, expect, it } from "vitest";
import { previewIdentityMigration, type IdentityMigrationPlan } from "../src/publication/identity-migrations.js";
import { createEncounter } from "../src/learner/scheduler.js";
const plan: IdentityMigrationPlan = { version: 1, language: "fr", id: "draft-example", status: "draft", reason: "Test fixture only", aliases: [{ from: "srf_old:sns_old", to: "srf_new:sns_new", reason: "Reviewed same form and meaning" }] };
describe("conservative mastery migration previews", () => {
  it("never applies an unapproved alias or changes the original learner record", () => {
    const state = { "srf_old:sns_old": createEncounter(new Date("2026-09-19T00:00:00Z")) };
    const before = JSON.stringify(state);
    const result = previewIdentityMigration(state, plan);
    expect(result.canApply).toBe(false);
    expect(JSON.stringify(state)).toBe(before);
    expect(result.next["srf_new:sns_new"]).toEqual(state["srf_old:sns_old"]);
    expect(result.next["srf_old:sns_old"]).toEqual(state["srf_old:sns_old"]);
  });
  it("reports collisions without selecting the highest level or altering a due date", () => {
    const old = createEncounter(new Date("2026-09-19T00:00:00Z"));
    const high = { ...old, masteryLevel: 8 as const, nextDueAt: "2027-01-01T00:00:00Z", revision: 2 };
    const state = { "srf_old:sns_old": old, "srf_new:sns_new": high };
    const result = previewIdentityMigration(state, { ...plan, status: "approved", reviewedBy: "test reviewer" });
    expect(result.canApply).toBe(false);
    expect(result.conflicts).toHaveLength(1);
    expect(result.next).toEqual(state);
  });
  it("rejects one old identity being distributed to two senses", () => {
    expect(() => previewIdentityMigration({}, { ...plan, aliases: [...plan.aliases, { ...plan.aliases[0]!, to: "srf_new:sns_other" }] })).toThrow("fan-out");
    expect(() => previewIdentityMigration({}, { ...plan, aliases: [...plan.aliases, { from: "srf_new:sns_new", to: "srf_old:sns_old", reason: "cycle" }] })).toThrow("acyclic");
  });
});
