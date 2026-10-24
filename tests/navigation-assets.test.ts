import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const directories: string[] = [];
afterEach(() => { for (const path of directories.splice(0)) rmSync(path, { recursive: true, force: true }); });
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "polylit-navigation-"));
  directories.push(root);
  const write = (name: string, html: string) => {
    const path = join(root, name);
    mkdirSync(join(path, ".."), { recursive: true });
    writeFileSync(path, html);
  };
  write("index.html", '<a href="languages/">Preview</a><script src="app.js"></script>');
  write("app.js", "");
  write("languages/index.html", '<a href="../">Sign out</a><a href="../fr/library/">French</a><a href="../es/library/">Spanish</a>');
  for (const language of ["fr", "es"]) write(`${language}/library/index.html`, '<a href="../../">Sign out</a><a href="../../languages/">Choose language</a>');
  return { root, write, run: () => spawnSync("python3", ["scripts/check-navigation.py", "--directory", root], { encoding: "utf8" }) };
}
describe("generated navigation gate", () => {
  it("accepts a connected site at root and the Pages prefix", () => {
    const result = fixture().run();
    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout).prefixes).toEqual(["/", "/Polylit/"]);
  });
  it("rejects missing generated documents", () => {
    const site = fixture(); rmSync(join(site.root, "es/library/index.html"));
    expect(site.run().status).not.toBe(0);
  });
  it("rejects missing assets", () => {
    const site = fixture(); rmSync(join(site.root, "app.js"));
    expect(site.run().stderr).toContain("missing or unsafe target");
  });
  it("rejects root-only links that escape the repository prefix", () => {
    const site = fixture(); site.write("index.html", '<a href="/languages/">Preview</a>');
    expect(site.run().stderr).toContain("escapes deployment prefix");
  });
  it("rejects removal of a required navigation button link", () => {
    const site = fixture(); site.write("index.html", "<h1>Polylit</h1>");
    expect(site.run().stderr).toContain("missing navigation links");
  });
});
