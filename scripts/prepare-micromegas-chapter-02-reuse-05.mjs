import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The forms and contextual decisions here are authored. The coverage report
// provides spans and prior quiz references, but cannot approve them on its own.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const coverageBytes = readFileSync(resolve(root, 'chapter-02-coverage.json'));
const coverage = JSON.parse(coverageBytes);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const decisions = [
  ['c’', '38:102,41:20,45:404', 'All three elided c’ in c’est are demonstrative pronouns referring to a situation or state, matching the published pronoun and questions.'],
  ['chose', '34:223,45:430', 'Peu de chose calls the speakers a thing of little significance, while la même chose identifies the same thing; the published general noun includes abstract things and facts. The idiomatic understatement is recorded in the phrase triage without separate mastery.'],
  ['pour', '32:43', 'Pour vous plaire introduces a purpose, explicitly covered by the existing in-order-to quiz. Pour moi is a viewpoint held for a separate sense.'],
  ['sans', '34:189,51:123', 'Sans cesse means without stopping and sans lesquelles means without those properties; both retain the without preposition. Cesse receives its separately prepared phrase-aware noun questions.'],
  ['cesse', '34:194', 'Sans cesse is without pause; the published three-band questions explicitly use the same phrase and noun pause sense.'],
  ['parti', '47:65', 'Prendre leur parti is to accept one’s lot; the published noun sense and all three questions explicitly target this very expression.'],
  ['dieu', '58:54', 'Dieu is listed as the divine being in the Saturnian metaphysical taxonomy; the existing deity noun sense and divine-being questions apply.']
];
const used = new Set();
const items = decisions.map(([form, offsets, rationale]) => {
  const allowed = new Set(offsets.split(','));
  const tokens = coverage.tokens.filter(token => token.form === form && allowed.has(`${token.unit}:${token.start}`) && (token.disposition === 'one_published_candidate_context_pending' || token.reuse?.file === 'chapter-02-reuse-05.json'));
  if (tokens.length !== allowed.size || tokens.some(token => !['one_published_candidate_context_pending', 'published_identity_reuse_context_reviewed'].includes(token.disposition) || (token.reuse && token.reuse.file !== 'chapter-02-reuse-05.json') || token.candidates.length !== 1)) throw Error(`Ambiguous or missing source form: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Published reuse/questions incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (used.has(key)) throw Error(`Duplicate occurrence: ${key}`);
    used.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 2, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 2, status: 'offline_contextual_reuse_review_unpublished', sourceSha256: coverage.sourceSha256, unitPlanSha256: coverage.unitPlanSha256, note: 'Seven authored chapter II published-identity reuse decisions. Every occurrence is checked against its source context and prior three-band question set. Does not change published identities or import this work.', items };
writeFileSync(resolve(root, 'chapter-02-reuse-05.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
