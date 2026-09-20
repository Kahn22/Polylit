import { afterEach, describe, expect, it, vi } from "vitest";
import { build } from "vite";
import { resolve } from "node:path";

afterEach(() => vi.unstubAllGlobals());

describe("production navigation under root and GitHub Pages prefixes", () => {
  it("executes Vite-built navigation without embedding a source file as the site root", async () => {
    const result = await build({
      configFile: false,
      logLevel: "silent",
      build: {
        write: false,
        minify: true,
        lib: { entry: resolve("src/app/paths.ts"), formats: ["es"], fileName: "paths" },
      },
    });
    const output = Array.isArray(result) ? result[0] : result;
    if (!output || !("output" in output)) throw new Error("Unexpected Vite output");
    const chunk = output.output.find(item => item.type === "chunk");
    if (!chunk || chunk.type !== "chunk") throw new Error("Missing navigation bundle");
    expect(chunk.code).not.toContain("video/mp2t");
    expect(chunk.code).not.toContain("base64,");
    let version = 0;
    for (const base of ["/", "/Polylit/"]) {
      for (const route of ["", "index.html", "languages/", "fr/library/", "es/library/", "es/library/index.html", "fr/library"]) {
        vi.stubGlobal("location", { pathname: `${base}${route}` });
        // Execute the emitted JavaScript, not only the TypeScript source.
        const url = `data:text/javascript;base64,${Buffer.from(chunk.code).toString("base64")}#${version++}`;
        const navigation = await import(/* @vite-ignore */ url);
        expect(navigation.siteBase).toBe(base);
        for (const destination of ["", "languages/", "fr/library/", "es/library/", "es/library/#/book/wrk_palma_camisa_margarita", "es/library/#/read/wrk_quiroga_almohadon_plumas"]) {
          expect(navigation.sitePath(destination)).toBe(`${base}${destination}`);
        }
      }
    }
  });
});
