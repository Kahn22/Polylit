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
  ['on', 'Each use is an indefinite human subject in direct speech or the narrator’s account: one/people.'],
  ['me', 'All three uses refer to the first-person speaker as object or recipient, including me dire and me plaise.'],
  ['m’', 'Both elisions refer to the first-person speaker: m’instruise and m’a donné.'],
  ['avons', 'The speakers have senses or colors in every occurrence; the existing have form covers these.'],
  ['imagination', 'Notre imagination names the faculty of imagining things beyond necessity.'],
  ['nos', 'Every occurrence modifies the speakers’ needs, senses, ring or moons: our.'],
  ['avec', 'Both occurrences combine a quality or possession with another: with.'],
  ['car', 'The speaker introduces an explanation for his belief with car: for/because.'],
  ['dans', 'All eight uses place something within a world, country, argument, substance or physical setting.'],
  ['sais', 'Both occurrences in je ne sais quel/quelle mean I do not know which; the know sense fits.'],
  ['désir', 'The singular vague desire is a wish without a clear object, matching the existing desire sense.'],
  ['beaucoup', 'These occurrences indicate a large amount of superiority, reasoning or knowledge.'],
  ['j’', 'Each elided first-person subject refers to the speaker narrating his travels or assertions.'],
  ['ai', 'The traveler’s j’ai vu/j’ai voyagé and related uses use ai as first-person have or auxiliary.'],
  ['vu', 'All three are past participles of seeing other mortal beings, not a noun.'],
  ['vrais', 'Vrais besoins contrasts genuine necessities with desires: real.'],
  ['pays', 'A figurative land lacking nothing and lands visited both use the country/land sense.'],
  ['où', 'The relative adverb identifies the country where a condition holds; the existing where sense fits.'],
  ['rien', 'In il ne manque rien, no thing is lacking; the published nothing sense applies.'],
  ['alors', 'The two travelers then proceed to conjectures, in chronological sequence.'],
  ['homme', 'The petit homme de Saturne is a male person; the existing man sense fits.'],
  ['loi', 'A supposed universal law of nature is a rule, within the published law sense.'],
  ['universelle', 'The supposed rule applies everywhere, so the published universal adjective fits.'],
  ['soleil', 'Each occurrence refers to a star or its radiation, in the characters’ worlds.'],
  ['cela', 'Cela refers back to the preceding duration or state: that.'],
  ['ans', 'The parenthetical fifteen thousand ans counts years.'],
  ['ou', 'Both occurrences connect alternative values or durations with or.'],
  ['presque', 'Presque au moment means close to but short of the very moment: almost.'],
  ['moment', 'Both uses name a point in time of birth or transformation.'],
  ['né', 'Est né describes having been born; the published born sense fits.'],
  ['avant', 'Before gaining experience indicates chronological order.'],
  ['ait', 'Qu’on ait de l’expérience uses avoir in the subjunctive, possession of experience.']
];
const used = new Set();
const items = decisions.map(([form, rationale]) => {
  const tokens = coverage.tokens.filter(token => token.form === form);
  if (!tokens.length || tokens.some(token => !['one_published_candidate_context_pending', 'published_identity_reuse_context_reviewed'].includes(token.disposition) || (token.reuse && token.reuse.file !== 'chapter-02-reuse-02.json') || token.candidates.length !== 1)) throw Error(`Ambiguous or missing source form: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Published reuse/questions incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (used.has(key)) throw Error(`Duplicate occurrence: ${key}`);
    used.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 2, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 2, status: 'offline_contextual_reuse_review_unpublished', sourceSha256: coverage.sourceSha256, unitPlanSha256: coverage.unitPlanSha256, note: 'Thirty-two authored chapter II published-identity reuse decisions. Every occurrence is checked against its source context and prior three-band question set. Does not change published identities or import this work.', items };
writeFileSync(resolve(root, 'chapter-02-reuse-02.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
