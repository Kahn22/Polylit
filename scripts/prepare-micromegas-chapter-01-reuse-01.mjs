import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The forms and contextual decisions here are authored. The coverage report
// provides spans and prior quiz references, but cannot approve them on its own.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const coverageBytes = readFileSync(resolve(root, 'chapter-01-coverage.json'));
const coverage = JSON.parse(coverageBytes);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const decisions = [
  ['dans', 'All six chapter I uses introduce a place or domain: a world, journey, book or country. The published in/within sense fits.'],
  ['ces', 'Both occurrences point to the planets or little creatures just described; the demonstrative these sense fits.'],
  ['qui', 'Every chapter I qui introduces a relative clause referring to a person or thing; use the published who/which relative sense.'],
  ['autour', 'The planet turns around Sirius; this is spatial circling, matching the published around sense.'],
  ['jeune', 'A jeune homme is a young man by age, matching the published adjective.'],
  ['beaucoup', 'Each occurrence expresses a large quantity of spirit, objects, time or knowledge; use the existing much/many sense.'],
  ['j’', 'Each elided j’ is the narrator’s first-person singular subject, not an independent idiom.'],
  ['notre', 'Every notre modifies a possession or shared planet as our, including the narrator’s rhetorical human group.'],
  ['tous', 'Each chapter I tous quantifies an entire set, including the ironic reference to all the sculptors and painters.'],
  ['entends', 'J’entends, par huit lieues means I mean by that measure; the published intended-meaning sense applies.'],
  ['mille', 'All nine chapter I uses belong to explicit numeric measurements or ages; the value thousand is literal, never countless.'],
  ['cinq', 'Both uses count five feet or another explicit quantity; they share the existing cardinal five sense.'],
  ['quelques', 'Every occurrence quantifies a small indefinite number of people, states, things or affairs: some/a few.'],
  ['gens', 'These are people, including companions or attendants in ses gens; no separate proper-name identity.'],
  ['toujours', 'In gens toujours utiles, toujours marks persistence/always; the narrator’s irony does not change its sense.'],
  ['et', 'Every chapter I et connects two constituents or clauses as and, matching the published conjunction.'],
  ['puisque', 'Puisque M. Micromégas … expresses the given premise because/since, matching the published conjunction.'],
  ['six', 'All chapter I occurrences count the number six in measured heights or quantities, not a separate expression.']
];
const used = new Set();
const items = decisions.map(([form, rationale]) => {
  const tokens = coverage.tokens.filter(token => token.form === form);
  if (!tokens.length || tokens.some(token => token.disposition !== 'one_published_candidate_context_pending' || token.candidates.length !== 1)) throw Error(`Ambiguous or missing source form: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Published reuse/questions incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (used.has(key)) throw Error(`Duplicate occurrence: ${key}`);
    used.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 1, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 1, status: 'offline_contextual_reuse_review_unpublished', coverageSha256: hash(coverageBytes), note: 'Twenty authored chapter I published-identity reuse decisions. Every occurrence is checked against its source context and prior three-band question set. Does not change published identities or import this work.', items };
writeFileSync(resolve(root, 'chapter-01-reuse-01.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
