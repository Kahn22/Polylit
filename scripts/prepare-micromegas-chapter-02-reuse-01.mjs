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
  ['et', 'All twenty-five uses join words, phrases or clauses, including paired examples and a concluding action; the published and sense fits.'],
  ['qui', 'Each relative qui introduces an identifying clause about beings, a sun or properties; the published who/which sense fits.'],
  ['nous', 'All twenty-one occurrences refer to the Saturnian or Sirian speaker and companions, as subject or object: we/us.'],
  ['notre', 'Every occurrence modifies a shared quality, world, life, manner or duration: our.'],
  ['votre', 'Every occurrence addresses the interlocutor and modifies his comparison, world, substance or sun: your.'],
  ['vos', 'Vos brunes and vos habitants are both plural things ascribed to the addressed speaker: your.'],
  ['visage', 'Both uses concern a face, first that of the secretary and later that of a person compared with other faces.'],
  ['avouer', 'Il faut avouer asks the traveler to acknowledge that nature is varied; the existing admit sense applies.'],
  ['oui', 'Oui answers the traveler affirmatively before the Saturnian begins his comparison: yes.'],
  ['fleurs', 'The incomplete parterre dont les fleurs evokes literal flowers in a flower bed.'],
  ['reprit', 'Reprit le secrétaire is a speech tag signaling that he resumed his attempted comparison.'],
  ['eh', 'Both Eh ! interruptions are spoken exclamations, fitting the published interjection.'],
  ['je', 'All occurrences are a speaker’s first-person subject pronoun, including rhetorical questions and reported travel.'],
  ['vous', 'All uses address the interlocutor directly, including polite singular forms and objects of speech.'],
  ['combien', 'All uses ask or report how many senses, years, properties or substances there are.'],
  ['douze', 'The uses in soixante et douze and other numerical counts refer to twelve, with no independent idiomatic sense.'],
  ['cinq', 'Both uses quantify exactly five moons or five hundred revolutions.'],
  ['trop', 'Trop bornés and related complaints express excessive degree beyond what the speaker accepts.']
];
const used = new Set();
const items = decisions.map(([form, rationale]) => {
  const tokens = coverage.tokens.filter(token => token.form === form);
  if (!tokens.length || tokens.some(token => !['one_published_candidate_context_pending', 'published_identity_reuse_context_reviewed'].includes(token.disposition) || (token.reuse && token.reuse.file !== 'chapter-02-reuse-01.json') || token.candidates.length !== 1)) throw Error(`Ambiguous or missing source form: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Published reuse/questions incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (used.has(key)) throw Error(`Duplicate occurrence: ${key}`);
    used.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 2, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 2, status: 'offline_contextual_reuse_review_unpublished', sourceSha256: coverage.sourceSha256, unitPlanSha256: coverage.unitPlanSha256, note: 'Eighteen authored chapter II published-identity reuse decisions. Every occurrence is checked against its source context and prior three-band question set. Does not change published identities or import this work.', items };
writeFileSync(resolve(root, 'chapter-02-reuse-01.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
