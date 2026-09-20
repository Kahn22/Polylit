import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { appBundle, appExpressionCatalog, appPreparedQuizzes } from "../src/app/content.js";
import { createCompactPackages } from "../src/delivery/compact-packages.js";

let indexes: ReturnType<typeof createCompactPackages>["libraryIndexes"];

beforeAll(() => {
  indexes = createCompactPackages(appBundle, appExpressionCatalog, appPreparedQuizzes).libraryIndexes;
});

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllGlobals());

// Minimal DOM ports for executing the real entry module, not a mock of startup.
// Browser navigation and layout still require separate browser QA.
function environment(language: "fr" | "es", embedded: boolean, signedIn = true) {
  const index = indexes[language];
  const app = {
    innerHTML: "",
    insertAdjacentHTML: vi.fn(),
    addEventListener: vi.fn((_type: string, _listener: (event: Event) => unknown) => {}),
  };
  const saved = new Map<string, string>([["polylit:active-language:v1", language === "fr" ? "es" : "fr"]]);
  const local = {
    getItem: vi.fn((key: string) => saved.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => { saved.set(key, value); }),
  };
  const location = new URL(`https://polylit.test/${language}/library/`);
  const runtime = { addEventListener: vi.fn(), setInterval: vi.fn(), __polylitAppReady: false };
  const fetcher = vi.fn(async (_url: string | URL | Request) => new Response(JSON.stringify(index)));
  vi.stubGlobal("location", location);
  vi.stubGlobal("window", runtime);
  vi.stubGlobal("localStorage", local);
  vi.stubGlobal("sessionStorage", { getItem: () => signedIn ? "active" : null });
  vi.stubGlobal("history", { replaceState: (_state: unknown, _title: string, path: string) => {
    location.href = new URL(path, location).href;
  } });
  vi.stubGlobal("fetch", fetcher);
  vi.stubGlobal("document", {
    querySelector: (selector: string) => {
      if (selector === "#app") return app;
      if (embedded && selector === `#polylit-library-data[data-language="${language}"]`) {
        return { textContent: JSON.stringify(index) };
      }
      return null;
    },
    querySelectorAll: () => [],
    addEventListener: vi.fn(),
    body: { classList: { contains: () => false } },
  });
  return { app, local, location, runtime, fetcher };
}

describe("application entry startup", () => {
  for (const language of ["fr", "es"] as const) {
    it(`links the language selection to a separate ${language} library document`, async () => {
      const { app, local, location } = environment("fr", false);
      location.pathname = "/languages/";
      local.setItem("polylit:active-language:v1", "fr");
      await import("../src/app/main.js");
      await vi.waitFor(() => expect(app.innerHTML).toContain("What would you like to study?"));
      const selectionHtml = app.innerHTML;
      const href = `/${language}/library/`;
      expect(selectionHtml).toContain(`href="${href}" target="_self" data-action="choose-language" data-language="${language}"`);
      const click = app.addEventListener.mock.calls.find(([type]) => type === "click")![1];
      const preventDefault = vi.fn();
      local.getItem.mockClear();
      await click({
        target: { closest: () => ({ dataset: { action: "choose-language", language } }) },
        preventDefault,
      } as unknown as Event);
      expect(preventDefault).not.toHaveBeenCalled();
      expect(app.innerHTML).toBe(selectionHtml);
      expect(local.getItem).not.toHaveBeenCalled();
      expect(local.setItem).toHaveBeenLastCalledWith("polylit:active-language:v1", language);

      // Simulate the new document reached through the native anchor navigation.
      vi.resetModules();
      const destination = environment(language, true);
      destination.location.href = new URL(href, location).href;
      await import("../src/app/main.js");
      await vi.waitFor(() => expect(destination.app.innerHTML).toContain(`Your ${language === "fr" ? "french" : "spanish"} library`));
      expect(destination.location.pathname).toBe(href);
      expect(destination.app.innerHTML.match(/<article class="text-card/g)).toHaveLength(language === "fr" ? 8 : 2);
    });

    for (const embedded of [false, true]) {
      it(`opens the ${language} library with ${embedded ? "embedded" : "fetched"} content`, async () => {
        const { app, local, runtime, fetcher } = environment(language, embedded);
        // This import must execute all top-level initializers without a TDZ error.
        await import("../src/app/main.js");
        await vi.waitFor(() => expect(app.innerHTML).toContain(`Your ${language === "fr" ? "french" : "spanish"} library`));
        expect(runtime.__polylitAppReady).toBe(true);
        expect(app.innerHTML).not.toContain("Opening your library");
        expect(app.innerHTML).not.toContain("Preparing your books, vocabulary, and quizzes");
        expect(app.innerHTML).toContain('<a class="language-switch" href="/languages/" target="_self">Choose language</a>');
        expect(app.innerHTML).not.toContain(`href="/${language === "fr" ? "es" : "fr"}/library/"`);
        expect(app.innerHTML.match(/<article class="text-card/g)).toHaveLength(language === "fr" ? 8 : 2);
        for (const work of indexes[language === "fr" ? "es" : "fr"].catalog.works) {
          expect(app.innerHTML).not.toContain(`data-work-id="${work.id}"`);
        }
        const prefix = language === "fr" ? "french-reading-studio" : "polylit:es";
        expect(local.getItem).toHaveBeenCalledWith(`${prefix}:learner-state:${language === "fr" ? "v2" : "v1"}`);
        expect(local.getItem).toHaveBeenCalledWith(`${prefix}:reading-library:v1`);
        expect(local.setItem).toHaveBeenCalledWith("polylit:active-language:v1", language);
        expect(fetcher).toHaveBeenCalledTimes(embedded ? 0 : 1);
        if (!embedded) expect(String(fetcher.mock.calls[0]?.[0])).toMatch(new RegExp(`/content/library/${language}\\.json$`));
      });
    }
  }

  it("does not initialize library content on login or language selection", async () => {
    for (const pathname of ["/", "/languages/"]) {
      vi.resetModules();
      const { location, fetcher, app } = environment("fr", false);
      location.pathname = pathname;
      await import("../src/app/main.js");
      await vi.waitFor(() => expect(app.innerHTML).toContain(pathname === "/" ? "Preview learner account" : "What would you like to study?"));
      expect(fetcher).not.toHaveBeenCalled();
    }
  });

  it("returns to login when the preview session is absent", async () => {
    const { app, location } = environment("fr", true, false);
    await import("../src/app/main.js");
    await vi.waitFor(() => expect(app.innerHTML).toContain("Preview learner account"));
    expect(location.pathname).toBe("/");
    expect(app.innerHTML).not.toContain("Opening your library");
  });
});
