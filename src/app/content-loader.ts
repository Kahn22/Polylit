import type { BookPage, Language, LibraryIndex, QuizIndex, QuizPackage, QuizRecord, ReadingSection, WorkManifest } from "../delivery/types.js";
import { quizShard } from "../delivery/identity-token.js";

export class ContentRequestError extends Error {
  constructor(readonly status: number) { super(`Content request failed (${status}). Please retry.`); }
}

export class ContentLoader {
  readonly #baseUrl: string;
  readonly #fetch: typeof fetch;
  readonly #timeoutMs: number;
  readonly #cache = new Map<string, Promise<unknown>>();
  #library: LibraryIndex | undefined;

  constructor(baseUrl: string, fetchImplementation: typeof fetch = fetch, timeoutMs = 12_000) {
    this.#baseUrl = baseUrl.replace(/\/?$/, "/");
    this.#fetch = fetchImplementation.bind(globalThis);
    this.#timeoutMs = timeoutMs;
  }

  async library(language: Language): Promise<LibraryIndex> {
    const embedded = typeof document === "undefined" ? undefined : document.querySelector<HTMLScriptElement>(`#polylit-library-data[data-language="${language}"]`);
    const index = embedded?.textContent ? JSON.parse(embedded.textContent) as LibraryIndex : await this.json<LibraryIndex>(`library/${language}.json`, false);
    if (index.version !== 3 || index.language !== language || !index.release || !index.catalog || !index.works || !index.quizzes) throw new Error("The library index is invalid. Refresh to get the latest release.");
    this.#library = index;
    return index;
  }

  async work(workId: string): Promise<WorkManifest> {
    const path = this.#library?.works[workId]?.manifest;
    if (!path) throw new Error("This work is not in the selected library.");
    const work = await this.json<WorkManifest>(path);
    if (work.version !== 1 || work.language !== this.#library!.language || work.workId !== workId || !Array.isArray(work.sections) || !Array.isArray(work.bookPages)) throw new Error("Invalid work manifest");
    return work;
  }

  async section(workId: string, index: number): Promise<ReadingSection> {
    const work = await this.work(workId);
    const path = work.sections[index];
    if (!path) throw new Error("Reading section not found");
    const section = await this.json<ReadingSection>(path);
    if (section.version !== 1 || section.language !== work.language || section.workId !== workId || section.index !== index || !Array.isArray(section.units) || !section.expressionCatalog) throw new Error("Invalid reading section");
    return section;
  }

  async book(workId: string, index: number): Promise<BookPage> {
    const work = await this.work(workId);
    const path = work.bookPages[index];
    if (!path) throw new Error("Book page not found");
    const page = await this.json<BookPage>(path);
    if (page.version !== 1 || page.language !== work.language || page.workId !== workId || page.index !== index || !Array.isArray(page.units)) throw new Error("Invalid book page");
    return page;
  }

  preloadNextSection(workId: string, currentIndex: number, sectionCount: number): void {
    if (currentIndex + 1 < sectionCount) void this.section(workId, currentIndex + 1).catch(() => undefined);
  }

  async quiz(identity: string): Promise<QuizRecord> {
    if (!this.#library) throw new Error("Choose a library first");
    const index = await this.json<QuizIndex>(this.#library.quizzes);
    if (index.version !== 2 || index.language !== this.#library.language || !index.shards) throw new Error("Invalid quiz index");
    const path = index.shards[quizShard(identity)];
    if (!path) throw new Error("Prepared quiz package not found");
    const batch = await this.json<QuizPackage>(path);
    if (batch.version !== 2 || batch.language !== this.#library.language || !Array.isArray(batch.records)) throw new Error("Invalid quiz package");
    const record = batch.records.find(record => record.identity === identity);
    if (!record || record.items.length !== 3 || new Set(record.items.map(item => item.band)).size !== 3) throw new Error("Prepared quiz is incomplete");
    for (const quiz of record.items) {
      const key = quiz.subject?.kind === "expression" ? `expression:${quiz.subject.expressionId}` : quiz.subject?.kind === "vocabulary" ? `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}` : undefined;
      if (quiz.language !== batch.language || key !== identity || !Array.isArray(quiz.choices) || quiz.choices.length !== 4 || new Set(quiz.choices.map(choice => choice.id)).size !== 4 || quiz.choices.filter(choice => choice.id === quiz.correctChoiceId).length !== 1) throw new Error("Invalid prepared quiz choices or identity");
    }
    return record;
  }

  json<T>(path: string, immutable = true): Promise<T> {
    if (!/^[a-z0-9_/-]+\.json$/.test(path) || path.includes("..")) return Promise.reject(new Error("Invalid content path"));
    const cached = this.#cache.get(path);
    if (cached) { this.#cache.delete(path); this.#cache.set(path, cached); return cached as Promise<T>; }
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout>;
    const request = Promise.race([
      this.#fetch(this.#baseUrl + path, { signal: controller.signal, cache: immutable ? "force-cache" : "no-cache", credentials: "same-origin" }).then(response => {
        if (!response.ok) throw new ContentRequestError(response.status);
        return response.json() as Promise<T>;
      }),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => { controller.abort(); reject(new Error("The download timed out. Please retry.")); }, this.#timeoutMs); }),
    ]).finally(() => clearTimeout(timeout));
    this.#cache.set(path, request);
    while (this.#cache.size > 64) this.#cache.delete(this.#cache.keys().next().value!);
    void request.catch(() => { if (this.#cache.get(path) === request) this.#cache.delete(path); });
    return request;
  }
}
