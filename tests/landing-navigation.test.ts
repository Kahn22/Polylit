import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";
const source = readFileSync("public/landing-bootstrap.js", "utf8");
function landing(path: string, hash = "", signedIn = true, language = "fr") {
  const events = new Map<string, () => void>();
  const session = new Map(signedIn ? [["french-reading-studio:demo-session:v1", "active"]] : []);
  const replace = vi.fn();
  runInNewContext(source, {
    URL, URLSearchParams,
    location: { pathname: path, hash, search: "", href: `https://polylit.test${path}${hash}`, replace },
    document: { currentScript: { src: `https://polylit.test${path.startsWith("/Polylit/") ? "/Polylit" : ""}/landing-bootstrap.js?v=123` }, querySelector: () => null, addEventListener: vi.fn() },
    window: { addEventListener: (type: string, handler: () => void) => events.set(type, handler) },
    localStorage: { getItem: () => language },
    sessionStorage: { getItem: (key: string) => session.get(key), setItem: (key: string, value: string) => session.set(key, value) },
  });
  return { replace, session, events };
}
describe("standalone page navigation", () => {
  for (const base of ["/", "/Polylit/"]) {
    it(`transfers legacy reader bookmarks at ${base}`, () => {
      const hash = "#/book/wrk_palma_camisa_margarita?position=1";
      expect(landing(base, hash, true, "es").replace).toHaveBeenCalledWith(`https://polylit.test${base}es/library/${hash}`);
      expect(landing(`${base}index.html`, "#/languages").replace).toHaveBeenCalledWith(`https://polylit.test${base}languages/`);
    });
    it(`checks the preview session on direct entry and history restoration at ${base}`, () => {
      for (const page of ["languages/", "languages/index.html", "fr/library/", "es/library/index.html"]) {
        const test = landing(base + page);
        expect(test.replace).not.toHaveBeenCalled();
        test.session.clear();
        test.events.get("pageshow")!();
        expect(test.replace).toHaveBeenCalledWith(`https://polylit.test${base}`);
        expect(landing(base + page, "", false).replace).toHaveBeenCalledWith(`https://polylit.test${base}`);
      }
    });
  }
});
