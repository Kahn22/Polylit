import { describe, expect, it } from "vitest";
import { parseRoute, routeHash } from "../src/app/routes.js";

describe("application routes", () => {
  it("recognizes the public homepage, language choice, learner library, and text reader", () => {
    expect(parseRoute("#/")) .toEqual({ name: "home" });
    expect(parseRoute("#/languages")).toEqual({ name: "languages" });
    expect(parseRoute("#/library")).toEqual({ name: "library" });
    expect(parseRoute("#/read/wrk_corbeau_renard")).toEqual({ name: "read", workId: "wrk_corbeau_renard" });
    expect(parseRoute("#/book/wrk_corbeau_renard")).toEqual({ name: "book", workId: "wrk_corbeau_renard" });
  });

  it("falls back safely instead of accepting malformed paths", () => {
    expect(parseRoute("#/admin")) .toEqual({ name: "home" });
    expect(parseRoute("#/read/../../secret")).toEqual({ name: "home" });
  });

  it("formats stable hash routes for GitHub Pages", () => {
    expect(routeHash({ name: "languages" })).toBe("#/languages");
    expect(routeHash({ name: "library" })).toBe("#/library");
    expect(routeHash({ name: "read", workId: "wrk_corbeau_renard" })).toBe("#/read/wrk_corbeau_renard");
    expect(routeHash({ name: "book", workId: "wrk_corbeau_renard" })).toBe("#/book/wrk_corbeau_renard");
  });
});
