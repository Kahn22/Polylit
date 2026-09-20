import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
const requestedDirectory = process.argv.includes("--directory") ? process.argv[process.argv.indexOf("--directory") + 1] : "build";
assert(["build", "review-build"].includes(requestedDirectory), "Unsupported check directory");
const root = resolve(import.meta.dirname, "..", requestedDirectory);
const read = path => readFileSync(resolve(root, path));
const json = path => JSON.parse(read(path));
const gzip = path => gzipSync(read(path)).length;
const manifest = json(".vite/manifest.json");
const entry = manifest["index.html"];
assert(entry?.isEntry, "Build entry is missing");
const eager = new Set();
function collect(key) {
  const item = manifest[key];
  assert(item, `Missing code dependency: ${key}`);
  if (eager.has(item.file)) return;
  eager.add(item.file);
  for (const dependency of item.imports ?? []) collect(dependency);
}
collect("index.html");
const loginJs = [...eager].reduce((sum, file) => sum + gzip(file), 0);
assert(loginJs < 2_000, `Login JS exceeds 2 KB gzip budget (${loginJs})`);
const main = Object.values(manifest).find(item => item.name === "main");
assert(main, "Library code is missing");
assert(gzip(main.file) < 15_000, "Library JS exceeds 15 KB gzip budget");
assert(!read(main.file).toString().includes("Zod"), "Editorial validation leaked into browser code");

for (const route of ["index.html", "languages/index.html", "fr/library/index.html", "es/library/index.html"]) {
  const html = read(route).toString();
  assert(html.includes('rel="stylesheet"'), `${route}: stylesheet must load independently of JS`);
  assert(!html.includes("Opening your library") && !html.includes("Preparing your books"), `${route}: loading-only placeholder returned`);
  const base = new URL(route, "https://polylit.test/");
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = new URL(match[1], base);
    if (url.origin !== base.origin || !/\.(js|css|png)$/.test(url.pathname)) continue;
    assert(existsSync(resolve(root, url.pathname.slice(1))), `${route}: missing asset ${url.pathname}`);
  }
  if (!route.includes("library/")) assert(!html.includes("polylit-library-data"), `${route}: library data must not be embedded`);
}
const bootstrap = read("landing-bootstrap.js").toString();
assert(!/\bfetch\s*\(/.test(bootstrap), "Entry-page library prefetch must not return");
const report = { loginJavaScriptGzip: loginJs, libraryJavaScriptGzip: gzip(main.file), libraries: {}, bookView: {} };
for (const language of ["fr", "es"]) {
  const file = `content/library/${language}.json`, index = json(file);
  const size = gzip(file);
  assert(size < (language === "fr" ? 36_000 : 12_000), `${language}: library data exceeds gzip budget`);
  assert(index.version === 3 && index.language === language && index.release, "Invalid release index");
  const html = read(`${language}/library/index.html`).toString();
  assert.equal((html.match(/<article class="text-card/g) ?? []).length, index.catalog.works.length, "All book cards must be generated before JS runs");
  const embedded = JSON.parse(html.match(/id="polylit-library-data"[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(embedded, index, "Library HTML and data belong to different releases");
  report.libraries[language] = { raw: read(file).length, gzip: size, documentGzip: gzip(`${language}/library/index.html`) };
  const quizIndex = json(`content/${index.quizzes}`);
  assert.equal(quizIndex.version, 2);
  assert.equal(quizIndex.language, language);
  for (const path of Object.values(quizIndex.shards)) {
    const batch = json(`content/${path}`);
    assert.equal(batch.version, 2);
    assert.equal(batch.language, language);
    assert(path.startsWith(`quizzes/${language}/`));
    for (const record of batch.records) {
      assert.equal(record.items.length, 3);
      assert.equal(new Set(record.items.map(item => item.band)).size, 3);
      for (const quiz of record.items) {
        assert.equal(quiz.language, language);
        assert.equal(quiz.choices.length, 4);
        assert.equal(new Set(quiz.choices.map(choice => choice.id)).size, 4);
        assert.equal(quiz.choices.filter(choice => choice.id === quiz.correctChoiceId).length, 1);
        assert(!Object.hasOwn(quiz, "correctAnswer"), "Legacy answer strings must not score browser quizzes");
        if (quiz.targetRange) {
          const target = quiz.context.slice(quiz.targetRange.start, quiz.targetRange.end);
          const normalize = text => text.normalize("NFC").replaceAll("'", "’").toLocaleLowerCase(language);
          assert.equal(normalize(target), normalize(quiz.targetText));
        }
      }
    }
  }
  for (const [workId, work] of Object.entries(index.works)) {
    const contents = json(`content/${work.manifest}`);
    assert.equal(contents.workId, workId);
    assert.equal(contents.language, language);
    for (const path of contents.sections) {
      const section = json(`content/${path}`);
      assert.equal(section.workId, workId);
      assert.equal(section.language, language);
      assert(!section.expressionCatalog.preparedQuizzes, "Do not ship expression quizzes with reading text");
    }
    for (const path of contents.bookPages) {
      const book = json(`content/${path}`);
      assert.equal(book.workId, workId);
      assert.deepEqual(Object.keys(book), ["version", "language", "workId", "index", "units"]);
    }
    const path = `content/${contents.bookPages[0]}`;
    report.bookView[workId] = { raw: read(path).length, gzip: gzip(path) };
  }
}
assert(report.bookView.wrk_maupassant_la_parure.gzip < 4_000, "La Parure text-only first page exceeds 4 KB gzip budget");
console.log("Release references, generated pages, language isolation, and performance budgets passed.");
console.log(JSON.stringify(report, null, 2));
