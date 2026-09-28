import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Explicit contextual grammar decisions for every occurrence in eight
// homographic families. IDs are selected by sense, never by first-match order.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const bytes = readFileSync(resolve(root, 'chapter-01-coverage.json'));
const coverage = JSON.parse(bytes);
const hash = data => createHash('sha256').update(data).digest('hex');
const rules = [
  { form: 'de', fallback: 'srf_de:sns_de_primary', exceptions: {}, rationale: 'All 66 occurrences are the ordinary preposition de, including possession, origin, measure and the productive de X en X pattern. No chapter I use introduces de même, de sorte que or de quoi as those separate locutions.' },
  { form: 'il', fallback: 'srf_il:sns_il_primary', exceptions: { '1:72': 'srf_il:sns_fr_il_impersonal', '4:27': 'srf_il:sns_fr_il_impersonal', '8:120': 'srf_il:sns_fr_il_impersonal', '12:193': 'srf_il:sns_fr_il_impersonal' }, rationale: 'Il y avait, two il faut constructions and il s’agissait have a grammatical dummy subject. The other 25 occurrences refer to Micromégas or another named male subject.' },
  { form: 'la', fallback: 'srf_la:sns_le_primary', exceptions: {}, rationale: 'Each la precedes a feminine noun such as plume, terre, nature or conversation; all 22 uses are articles, with no direct-object pronoun.' },
  { form: 'le', fallback: 'srf_le:sns_le_primary', exceptions: { '12:168': 'srf_le:sns_le_object' }, rationale: 'Le poursuivit refers back to the book’s author as a direct object. The other sixteen instances determine a following masculine noun.' },
  { form: 'une', fallback: 'srf_une:sns_un_primary', exceptions: { '1:5': 'srf_fr_une_un_pronoun:sns_fr_un_group_member' }, rationale: 'Une de ces planètes selects one member from a known group; the other nine une forms introduce a following noun as indefinite articles.' },
  { form: 'un', fallback: 'srf_un:sns_un_primary', exceptions: { '9:26': 'srf_fr_un_un_pronoun:sns_fr_un_group_member' }, rationale: 'Un des plus cultivés selects one of a group; the thirteen other un forms introduce masculine singular nouns.' },
  { form: 'l’', fallback: 'srf_l_elided:sns_le_primary', exceptions: { '4:63': 'srf_l_elided:sns_le_object', '14:69': 'srf_l_elided:sns_le_object', '16:189': 'srf_fr_l__l__particle:sns_fr_l_euphonic_on' }, rationale: 'L’a produit and l’avaient pas lu have direct-object l’. L’on dit has the optional euphonic l’ before on. The ten other elisions introduce a noun as a definite article.' },
  { form: 'les', fallback: 'srf_les:sns_le_primary', exceptions: { '27:45': 'srf_les:sns_le_object' }, rationale: 'Après les avoir étonnés uses a direct-object pronoun referring to the Saturnians; the twelve other les forms determine plural nouns.' }
];
const items = rules.map(rule => {
  const tokens = coverage.tokens.filter(token => token.form === rule.form);
  if (!tokens.length || tokens.some(token => token.disposition !== 'multiple_published_candidates_context_pending')) throw Error(`Missing contextual family ${rule.form}`);
  const found = new Set();
  const occurrences = tokens.map(token => {
    const key = `${token.unit}:${token.start}`;
    if (rule.exceptions[key]) found.add(key);
    const id = rule.exceptions[key] ?? rule.fallback;
    const candidate = token.candidates.find(value => value.identity === id);
    if (!candidate || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Missing old sense or three question bands: ${rule.form} ${key}`);
    return { chapter: 1, unit: token.unit, start: token.start, end: token.end, text: token.text, context: token.context, identity: id, gloss: candidate.gloss };
  });
  if (Object.keys(rule.exceptions).some(key => !found.has(key))) throw Error(`Stale contextual exception for ${rule.form}`);
  return { form: rule.form, status: 'all_chapter_uses_context_reviewed_reuse_pending_final_bundle_signoff', rationale: rule.rationale, occurrences };
});
const output = { version: 1, workId: coverage.workId, chapter: 1, status: 'offline_contextual_ambiguous_reuse_unpublished', coverageSha256: hash(bytes), note: 'Eight authored homographic-family decisions, with per-token sense choices. All chosen identities have three published quiz bands; existing learner mastery is untouched.', items };
writeFileSync(resolve(root, 'chapter-01-ambiguous-01.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), alternateUses: items.reduce((n,item)=>n+item.occurrences.filter(occ => rules.find(rule => rule.form === item.form).fallback !== occ.identity).length,0) }));
