import { describe, expect, it } from "vitest";
import { canManageAdministrators, canManageContent } from "../src/auth/model.js";

describe("account authorization boundaries", () => {
  it("keeps learner, admin, and owner privileges distinct", () => {
    expect(canManageContent("learner")).toBe(false);
    expect(canManageContent("admin")).toBe(true);
    expect(canManageContent("owner")).toBe(true);
    expect(canManageAdministrators("learner")).toBe(false);
    expect(canManageAdministrators("admin")).toBe(false);
    expect(canManageAdministrators("owner")).toBe(true);
  });
});
