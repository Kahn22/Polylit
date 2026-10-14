import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const evidence = [
  "content/sources/wrk_palma_camisa_margarita/publication-history.html",
  "content/sources/wrk_samaniego_zorra_uvas/publication-history.html",
  "content/sources/wrk_samaniego_zorra_uvas/witness.html",
  "content/sources/wrk_zola_jaccuse/transcription.html",
  "content/sources/wrk_zola_jaccuse/witness-clean.txt",
];

describe("Git preserves checksum-bound content", () => {
  for (const autocrlf of ["false", "input", "true"]) {
    it(`preserves original bytes through staging and checkout with autocrlf=${autocrlf}`, () => {
      const temp = mkdtempSync(join(tmpdir(), "polylit-git-bytes-"));
      const git = (...args: string[]) => execFileSync("git", ["-c", `core.autocrlf=${autocrlf}`, ...args], { cwd: temp });
      try {
        git("init", "--quiet");
        writeFileSync(join(temp, ".gitattributes"), readFileSync(join(root, ".gitattributes")));
        const expected = new Map(evidence.map(path => [path, readFileSync(join(root, path))]));
        expected.set("content/published/probe.json", Buffer.from('{"immutable":true}\n'));
        for (const [path, bytes] of expected) {
          mkdirSync(dirname(join(temp, path)), { recursive: true });
          writeFileSync(join(temp, path), bytes);
        }
        git("add", ".gitattributes", "content");
        const checkout = join(temp, "checkout");
        mkdirSync(checkout);
        git("checkout-index", "--all", `--prefix=${checkout}/`);
        for (const [path, bytes] of expected) {
          expect(git("show", `:${path}`).equals(bytes), `${path}: staged bytes`).toBe(true);
          expect(readFileSync(join(checkout, path)).equals(bytes), `${path}: checkout bytes`).toBe(true);
        }
      } finally { rmSync(temp, { recursive: true, force: true }); }
    });
  }
});
