import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadPublication } from "../src/publication/repository.js";
import { auditEditorialQuality } from "../src/publication/quality-audit.js";
import { createCompactPackages } from "../src/delivery/compact-packages.js";
import type { ReadingSection, WorkManifest } from "../src/delivery/types.js";

const publication = loadPublication();
const { bundle } = publication;
const workId = "wrk_samaniego_zorra_uvas";
const read = (name: string) => readFileSync(new URL(`../content/intake/samaniego-zorra-uvas/${name}`, import.meta.url), "utf8").trimEnd();

describe("Samaniego canonical intake", () => {
  it("preserves the complete poem with only the documented editorial changes", () => {
    const diplomatic = read("diplomatic.txt");
    const canonical = diplomatic.replaceAll(" á ", " a ").replace("vió", "vio").replace("fué", "fue").replace("Y dí,", "Y di,").replace("fue cuanto", "fue cuando");
    expect(read("canonical.txt")).toBe(canonical);
    expect(canonical.split("\n")).toHaveLength(16);
    expect(bundle.sources.find(source => source.workId === workId)?.canonicalText).toBe(canonical);
    const units = bundle.units.filter(unit => unit.workId === workId);
    expect(units).toHaveLength(4);
    expect(units.map(unit => unit.french).join("\n")).toBe(canonical);
    expect(bundle.works.find(work => work.id === workId)).toMatchObject({ originCountryCode: "ES", originCountryFlag: "🇪🇸" });
  });

  it("covers every token once and distinguishes articles, pronouns, and relative clauses", () => {
    const units = bundle.units.filter(unit => unit.workId === workId);
    const occurrences = bundle.occurrences.filter(item => item.workId === workId);
    const exclusions = bundle.exclusions.filter(item => item.workId === workId);
    expect(exclusions.map(item => item.text)).toEqual(["Fabio"]);
    for (const unit of units) for (const match of unit.french.matchAll(/\p{L}[\p{L}\p{M}]*/gu)) {
      const annotations = [...occurrences, ...exclusions].filter(item => item.unitId === unit.id && item.start === match.index && item.end === match.index! + match[0].length);
      expect(annotations, match[0]).toHaveLength(1);
    }
    const uses = (form: string) => occurrences.filter(o => {
      const unit = units.find(u => u.id === o.unitId)!;
      return unit.french.slice(o.start, o.end).toLowerCase() === form;
    }).map(o => o.senseId);
    expect(uses("las")).toEqual(["sns_es_0444_las", "sns_es_samaniego_las_pronoun"]);
    expect(uses("que")).toEqual(["sns_es_0674_que", "sns_es_que_relative"]);
    expect(new Set(occurrences.map(o => `${o.surfaceFormId}:${o.senseId}`)).size).toBe(80);
    const newIds = new Set(occurrences.map(o => `${o.surfaceFormId}:${o.senseId}`));
    const expressionIds = new Set(publication.expressionCatalog.occurrences.filter(o => o.workId === workId).map(o => o.identityId));
    const quizzes = [...publication.preparedQuizzes.values()].filter(q => q.subject.kind === "vocabulary" ? newIds.has(`${q.subject.surfaceFormId}:${q.subject.senseId}`) : expressionIds.has(q.subject.expressionId));
    expect(quizzes).toHaveLength(246);
    const quizIds = new Set(quizzes.map(q => q.id));
    expect(auditEditorialQuality(publication).filter(issue => issue.id === workId || newIds.has(issue.id) || expressionIds.has(issue.id) || quizIds.has(issue.id))).toEqual([]);
  });

  it("delivers one complete Spanish learning section without adding the work to French", () => {
    const packages = createCompactPackages(bundle, publication.expressionCatalog, publication.preparedQuizzes);
    expect(packages.libraryIndexes.fr.works[workId]).toBeUndefined();
    const work = packages.libraryIndexes.es.works[workId]!;
    const manifest = JSON.parse(packages.files.get(work.manifest)!) as WorkManifest;
    expect(manifest.sections).toHaveLength(1);
    const section = JSON.parse(packages.files.get(manifest.sections[0]!)!) as ReadingSection;
    expect(section.units.map(unit => unit.text).join("\n")).toBe(read("canonical.txt"));
    expect(section.language).toBe("es");
  });
});
