import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentLoader } from "../src/app/content-loader.js";
import { quizShard } from "../src/delivery/identity-token.js";
import type { LibraryIndex } from "../src/delivery/types.js";

const library: LibraryIndex = { version: 3, release: "test-release", language: "fr", catalog: { authors: [], collections: [], books: [], works: [] }, quizzes: "quiz-index/fr/test.json", works: { wrk_example: { manifest: "works/fr/test.json", sectionCount: 2, vocabularyTokens: [], expressionIdentityKeys: [] } } };
const identity = "srf_word:sns_word";
const files: Record<string, unknown> = {
  "library/fr.json": library,
  "works/fr/test.json": { version: 1, language: "fr", workId: "wrk_example", sections: ["reading/fr/zero.json", "reading/fr/one.json"], bookPages: ["books/fr/zero.json"] },
  "reading/fr/zero.json": { version: 1, language: "fr", workId: "wrk_example", index: 0, units: [], expressionCatalog: { identities: [], occurrences: [] } },
  "reading/fr/one.json": { version: 1, language: "fr", workId: "wrk_example", index: 1, units: [], expressionCatalog: { identities: [], occurrences: [] } },
  "books/fr/zero.json": { version: 1, language: "fr", workId: "wrk_example", index: 0, units: [{ id: "unt_example", ordinal: 1, text: "Bonjour." }] },
  "quiz-index/fr/test.json": { version: 2, language: "fr", shards: { [quizShard(identity)]: "quizzes/fr/test.json" } },
  "quizzes/fr/test.json": { version: 2, language: "fr", records: [{ identity, label: "word", items: ["levels_1_3", "levels_4_5", "levels_6_8"].map(band => ({ band, language: "fr", subject: { kind: "vocabulary", surfaceFormId: "srf_word", senseId: "sns_word" }, choices: [1, 2, 3, 4].map(n => ({ id: `choice_${n}`, text: `word ${n}` })), correctChoiceId: "choice_1" })) }] },
};
function environment() {
  vi.stubGlobal("document", { querySelector: () => ({ textContent: JSON.stringify(library) }) });
  const fetcher = vi.fn(async (url: string | URL | Request, _options?: RequestInit) => {
    const path = String(url).split("/content/")[1]!;
    return new Response(JSON.stringify(files[path]), { status: path in files ? 200 : 404 });
  });
  return { fetcher, loader: new ContentLoader("/content", fetcher) };
}
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("versioned content loader", () => {
  it("uses embedded data without a duplicate library request", async () => {
    const { loader, fetcher } = environment();
    await expect(loader.library("fr")).resolves.toEqual(library);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("revalidates the fallback library index", async () => {
    const { loader, fetcher } = environment();
    vi.stubGlobal("document", { querySelector: () => null });
    await loader.library("fr");
    expect(fetcher).toHaveBeenCalledWith("/content/library/fr.json", expect.objectContaining({ cache: "no-cache" }));
  });
  it("pins hashed paths, caches sections, and preloads only the following section", async () => {
    const { loader, fetcher } = environment();
    await loader.library("fr");
    await Promise.all([loader.section("wrk_example", 0), loader.section("wrk_example", 0)]);
    loader.preloadNextSection("wrk_example", 0, 2);
    loader.preloadNextSection("wrk_example", 1, 2);
    await loader.section("wrk_example", 1);
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual(["/content/works/fr/test.json", "/content/reading/fr/zero.json", "/content/reading/fr/one.json"]);
    expect(fetcher.mock.calls.every(([, options]) => options?.cache === "force-cache")).toBe(true);
  });
  it("loads Book View without reading, vocabulary, or quiz packages", async () => {
    const { loader, fetcher } = environment();
    await loader.library("fr");
    const book = await loader.book("wrk_example", 0);
    expect(book.units[0]?.text).toBe("Bonjour.");
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual(["/content/works/fr/test.json", "/content/books/fr/zero.json"]);
  });
  it("loads a self-contained quiz without any work or reading section", async () => {
    const { loader, fetcher } = environment();
    await loader.library("fr");
    await expect(loader.quiz(identity)).resolves.toMatchObject({ identity, label: "word" });
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual(["/content/quiz-index/fr/test.json", "/content/quizzes/fr/test.json"]);
  });
  it("evicts failed requests so Retry can fetch successfully", async () => {
    const { loader, fetcher } = environment();
    await loader.library("fr");
    fetcher.mockRejectedValueOnce(new Error("Offline"));
    await expect(loader.book("wrk_example", 0)).rejects.toThrow("Offline");
    await expect(loader.book("wrk_example", 0)).resolves.toMatchObject({ index: 0 });
  });
  it("bounds a stalled download even if a fetch implementation ignores abort", async () => {
    vi.useFakeTimers();
    const loader = new ContentLoader("/content", vi.fn(() => new Promise<Response>(() => {})), 100);
    const request = expect(loader.json("works/fr/stalled.json")).rejects.toThrow("timed out");
    await vi.advanceTimersByTimeAsync(101);
    await request;
  });
  it("rejects cross-language payloads and paths outside content", async () => {
    const { loader } = environment();
    await expect(loader.library("es")).rejects.toThrow("invalid");
    await expect(loader.json("../private.json")).rejects.toThrow("Invalid content path");
    await expect(loader.json("https://example.com/data.json")).rejects.toThrow("Invalid content path");
  });
});
