import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Validates manually authored contextual reuse decisions; never selects a
// candidate from a spelling match and never changes published learner state.
export function writeReusePacket(number, decisions) {
  const root = resolve('content/sources/wrk_voltaire_micromegas');
  const bytes = readFileSync(resolve(root, 'chapter-01-coverage.json'));
  const coverage = JSON.parse(bytes);
  const previous = Array.from({ length: number - 1 }, (_, i) => JSON.parse(readFileSync(resolve(root, `chapter-01-reuse-${String(i + 1).padStart(2, '0')}.json`))));
  const used = new Set(previous.flatMap(packet => packet.items).flatMap(item => item.occurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
  const forms = new Set(previous.flatMap(packet => packet.items.map(item => item.form)));
  const items = decisions.map(([form, rationale]) => {
    if (forms.has(form) || !rationale) throw Error(`Missing or duplicate contextual decision: ${form}`);
    forms.add(form);
    const tokens = coverage.tokens.filter(token => token.form === form);
    if (!tokens.length || tokens.some(token => token.disposition !== 'one_published_candidate_context_pending' || token.candidates.length !== 1)) throw Error(`Ambiguous or missing published candidate: ${form}`);
    const candidate = tokens[0].candidates[0];
    if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Old quiz coverage incomplete: ${form}`);
    for (const token of tokens) {
      const key = `${token.unit}:${token.start}:${token.end}`;
      if (used.has(key)) throw Error(`Duplicate indexed use: ${key}`);
      used.add(key);
    }
    return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 1, unit, start, end, text, context })) };
  });
  const output = { version: 1, workId: coverage.workId, chapter: 1, status: 'offline_contextual_reuse_review_unpublished', coverageSha256: createHash('sha256').update(bytes).digest('hex'), note: `Authored chapter I contextual published-identity reuse decisions, packet ${number}. Each form retains its published three-band questions. The work remains unpublished.`, items };
  writeFileSync(resolve(root, `chapter-01-reuse-${String(number).padStart(2, '0')}.json`), JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ packet: number, forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
}
