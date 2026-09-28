import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Authored contextual choices on grammatical lookalikes and published senses.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const bytes = readFileSync(resolve(root, 'chapter-01-coverage.json'));
const coverage = JSON.parse(bytes);
const old = JSON.parse(readFileSync(resolve(root, 'chapter-01-ambiguous-01.json')));
const priorForms = new Set(old.items.map(item => item.form));
const rules = [
  { form: 'n’', fallback: 'srf_n_elided:sns_ne_primary', exceptions: { '15:63': 'srf_n_elided:sns_fr_ne_que_only', '24:123': 'srf_n_elided:sns_fr_ne_que_only', '26:122': 'srf_n_elided:sns_fr_ne_que_only' }, rationale: 'These three elided n’ forms restrict with que and mean only. Other uses negate with pas, jamais, rien or guère; n’avons guère que and n’est guère que are treated with guère as negative attenuation, not the bare restrictive ne … que identity.' },
  { form: 'ne', fallback: 'srf_ne:sns_ne_primary', exceptions: { '6:164': 'srf_ne:sns_fr_ne_que_only', '15:3': 'srf_ne:sns_fr_ne_que_only', '17:9': 'srf_ne:sns_fr_ne_que_only' }, rationale: 'Ne sont qu’une, ne fut que and ne voyagent qu’en restrict to only. The remaining eight ne tokens pair with a negative such as pas, rien, jamais or the optative ne plaise.' },
  { form: 'pas', fallback: 'srf_pas:sns_pas_primary', exceptions: {}, rationale: 'Two historical-length pas géométriques tokens have a distinct contextual draft; the five remaining pas occurrences negate a verb as not.' },
  { form: 'esprit', fallback: 'srf_zola_esprit_esprit:sns_zola_esprit_mind', exceptions: {}, rationale: 'All seven chapter I uses concern a person’s mind, intelligence or cultivated wit. None denotes the ethos of a group.' },
  { form: 'est', fallback: 'srf_est:sns_etre_primary', exceptions: { '20:124': 'srf_est:sns_fr_etre_passive_auxiliary' }, rationale: 'Elle est semée uses passive être with semée. C’est un, n’est plus simple, and n’est guère que link subjects to qualities or identities.' },
  { form: 'ce', fallback: 'srf_fr_ce_ce_pronoun:sns_fr_ce_demonstrative_pronoun', exceptions: { '20:134': 'srf_ce:sns_ce_primary', '23:144': 'srf_ce:sns_ce_primary', '24:93': 'srf_ce:sns_ce_primary' }, rationale: 'Ce beau ciel, ce sourire and ce pays determine nouns. Ce qui, à ce que dit sa sœur and Ce n’est pas use the demonstrative pronoun.' },
  { form: 'avoir', fallback: 'srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary', exceptions: {}, rationale: 'The six infinitives are possession or auxiliary avoir, such as peut avoir a length and après avoir/les avoir plus a past participle; none means to happen, seem or exist in il y avoir.' },
  { form: 's’', fallback: 'srf_s_elided:sns_se_primary', exceptions: {}, rationale: 'All five elided s’ tokens mark pronominal verbs, including s’appelait, s’agissait, s’embarrassa and s’en; none is the conjunction si.' }
];
const items = rules.map(rule => {
  if (priorForms.has(rule.form)) throw Error(`Previously resolved: ${rule.form}`);
  const tokens = coverage.tokens.filter(token => token.form === rule.form && !token.draft);
  if (!tokens.length || tokens.some(token => token.disposition !== 'multiple_published_candidates_context_pending')) throw Error(`Missing ambiguous source family: ${rule.form}`);
  const found = new Set();
  const occurrences = tokens.map(token => {
    const key = `${token.unit}:${token.start}`;
    if (rule.exceptions[key]) found.add(key);
    const id = rule.exceptions[key] ?? rule.fallback;
    const candidate = token.candidates.find(value => value.identity === id);
    if (!candidate || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Missing published sense or questions: ${rule.form} ${key}`);
    return { chapter: 1, unit: token.unit, start: token.start, end: token.end, text: token.text, context: token.context, identity: id, gloss: candidate.gloss };
  });
  if (Object.keys(rule.exceptions).some(key => !found.has(key))) throw Error(`Stale exception: ${rule.form}`);
  return { form: rule.form, status: 'all_chapter_uses_context_reviewed_reuse_pending_final_bundle_signoff', rationale: rule.rationale, occurrences };
});
const output = { version: 1, workId: coverage.workId, chapter: 1, status: 'offline_contextual_ambiguous_reuse_unpublished', coverageSha256: createHash('sha256').update(bytes).digest('hex'), note: 'Eight further grammatical/sense families reviewed for every chapter I use. Existing quiz bands and mastery identities retained.', items };
writeFileSync(resolve(root, 'chapter-01-ambiguous-02.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), alternateUses: items.reduce((n,item)=>n+item.occurrences.filter(occ=>rules.find(rule=>rule.form===item.form).fallback!==occ.identity).length,0) }));
