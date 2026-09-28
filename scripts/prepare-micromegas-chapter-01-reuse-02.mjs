import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Twenty further authored contextual decisions, not automatic spelling reuse.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const bytes = readFileSync(resolve(root, 'chapter-01-coverage.json'));
const coverage = JSON.parse(bytes);
const previous = JSON.parse(readFileSync(resolve(root, 'chapter-01-reuse-01.json')));
const selected = [
  ['avait', 'The giant had a height, age and history; in the clause n’avait rien inventé this is auxiliary avoir. Both belong to the published broad have/auxiliary sense.'],
  ['homme', 'Jeune homme and the secretary called an homme refer to a person/man, matching the published man/human sense.'],
  ['ai', 'J’ai eu expresses the narrator’s perfect tense with auxiliary avoir; use the published have/auxiliary identity.'],
  ['eu', 'The narrator’s j’ai eu l’honneur uses the past participle of avoir, not a different lexical action.'],
  ['petite', 'Our little anthill and little Earth are physically small in the giant’s comparison, never young.'],
  ['a', 'Every chapter I a is third-singular avoir for possession, measurement or a completed experience; no preposition à is involved.'],
  ['cent', 'All chapter I uses participate in explicit numeric measures or ages and mean one hundred, never a figurative multitude.'],
  ['vingt', 'The occurrences are cardinal twenty in the large numeric calculation; retain the existing numeric sense.'],
  ['nous', 'The narrator includes humans in nous autres and first-person plural nous; existing we/us pronoun.'],
  ['avons', 'Nous n’avons guère and other chapter uses are present first-plural avoir, meaning have.'],
  ['guère', 'N’avons guère and ne … guère constructions mean hardly or not much, not a place or quantity with a new identity.'],
  ['ils', 'The plural subject refers back to geometers or other previously named people; use published they.'],
  ['je', 'The narrator’s unabbreviated je is the first-person subject of his statements; distinct surface from elided j’.'],
  ['faut', 'Il faut is impersonal necessity throughout the chapter, matching the published falloir surface and sense.'],
  ['ait', 'Qu’il … ait is the subjunctive form of avoir in the hypothesis; published broad have/auxiliary sense applies.'],
  ['rien', 'Rien n’est plus simple means nothing is simpler, the published negative indefinite pronoun.'],
  ['ou', 'Ou connects alternatives, such as Allemagne ou Italie and instruments or destinations, with the existing or identity.'],
  ['dont', 'Each dont introduces a relative clause expressing whose/of which, including counted things and persons.'],
  ['on', 'In on peut and comme l’on dit, on expresses an indefinite human subject; retain the published one/people sense.']
];
const reserved = new Set(previous.items.flatMap(item => item.occurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
const items = selected.map(([form, rationale]) => {
  if (previous.items.some(item => item.form === form)) throw Error(`Previously reviewed form: ${form}`);
  const tokens = coverage.tokens.filter(token => token.form === form);
  if (!tokens.length || tokens.some(token => token.disposition !== 'one_published_candidate_context_pending' || token.candidates.length !== 1)) throw Error(`Ambiguous or missing published candidate: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Old quiz coverage incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (reserved.has(key)) throw Error(`Duplicate indexed use: ${key}`);
    reserved.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 1, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 1, status: 'offline_contextual_reuse_review_unpublished', coverageSha256: createHash('sha256').update(bytes).digest('hex'), note: 'Twenty more authored reuse decisions covering all chapter I uses of each form, with prior three-band questions. Published mastery is unchanged and Micromégas remains unpublished.', items };
writeFileSync(resolve(root, 'chapter-01-reuse-02.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
