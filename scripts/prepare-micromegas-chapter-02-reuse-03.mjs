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
  ['son', 'Son Excellence is an honorific before a person; the other son modifies the secretary’s face. In both, the possessive his/her/its fits.'],
  ['se', 'Each use marks a reflexive or pronominal verb, including se coucher, se rapprocher, se ressembler and se pénétrer.'],
  ['faut', 'Il faut avouer, il faut que and il faut rendre each express necessity or obligation.'],
  ['comme', 'The garden and painting similes, comme la nature, comparisons of worlds and the listed example comme Dieu all use like/as.'],
  ['dont', 'Each occurrence links a prior noun to a dependent clause: whose/of which, including flowers, ornaments, traits and suns.'],
  ['ah', 'Two Ah ! exclamations punctuate the conversation and match the interjection.'],
  ['elle', 'Elle points to feminine nature or matter in each context, matching the third-person feminine pronoun.'],
  ['donc', 'Elle est donc marks the secretary’s attempted inference: then/therefore.'],
  ['non', 'Eh non rejects the gallery comparison; the published no sense applies.'],
  ['encore', 'Encore une fois marks repetition, nous reste encore continuation and encore in complaint continuation; the published again/still/more covers the contexts.'],
  ['fois', 'Encore une fois asks once again, a single occasion or time.'],
  ['pourquoi', 'Pourquoi lui chercher des comparaisons asks for a reason: why.'],
  ['chercher', 'Chercher des comparaisons means looking for analogies.'],
  ['plaire', 'Pour vous plaire expresses the intention of pleasing the addressee.'],
  ['répondit', 'Both répondit speech tags introduce replies.'],
  ['veux', 'Je veux point and je veux qu’on m’instruise express the speaker’s wishes.'],
  ['dire', 'Me dire combien asks to tell the speaker a number.'],
  ['hommes', 'Les hommes de votre globe names people inhabiting the planet, not all specifically male persons.'],
  ['tous', 'Tous les jours and tous les êtres quantify the whole set, as do the remaining uses.'],
  ['jours', 'Tous les jours counts days in the repeated daily complaint.'],
  ['peu', 'Peu de senses, little time or properties and un peu of knowledge all signal a small quantity.'],
  ['au', 'Au delà, au-dessous and au fond each contain the historical contraction of à + le; phrase meaning needs its own review.'],
  ['trouvons', 'Nous trouvons describes finding or discovering an assessment and seven colors.'],
  ['toute', 'Toute notre curiosité quantifies the whole curiosity.'],
  ['grand', 'Un nombre assez grand means a large number.'],
  ['temps', 'Tout le temps and related time reference use the noun time.'],
  ['crois', 'Je le crois bien expresses belief in the other speaker’s complaint.'],
  ['mille', 'Each thousand in the count of senses, years and substances is numeric, not figuratively countless.'],
  ['quel', 'Je ne sais quel désir modifies an unspecified desire: what kind/which.'],
  ['quelle', 'Je ne sais quelle inquiétude and other interrogative contexts modify feminine nouns: which/what.'],
  ['a', 'Il y a and related avoir forms express there is/has; the published avoir form accounts for the auxiliary or possession.'],
  ['au-dessous', 'Mortals au-dessous de nous are beneath/inferior in the speaker’s comparison, an extension of below.'],
  ['supérieurs', 'Des mortels fort supérieurs means beings superior to the travelers in relative development.'],
  ['désirs', 'More desires than needs and later desires of thinking beings both mean wishes.'],
  ['peut-être', 'He may perhaps reach a place with no lack; the existing uncertainty adverb applies.'],
  ['jusqu’', 'Jusqu’à présent means up to the present time; the temporal until/up-to sense fits.'],
  ['revenir', 'Il en fallut revenir aux faits means returning to facts after conjectures.'],
  ['aux', 'All three contractions stand for à + les, including revenir aux faits and returning the body to elements.'],
  ['petit', 'Petit homme, petit nombre and petite place refer to smaller size or quantity.'],
  ['toujours', 'Nous nous plaignons toujours means that the complaint continues habitually.'],
  ['cents', 'Five hundred and seven hundred count hundreds of revolutions and years.'],
  ['grandes', 'Grandes révolutions means lengthy or great revolutions of the sun.'],
  ['compter', 'À compter à notre manière means calculating the duration in our reckoning.']
];
const used = new Set();
const items = decisions.map(([form, rationale]) => {
  const tokens = coverage.tokens.filter(token => token.form === form && (token.disposition === 'one_published_candidate_context_pending' || token.reuse?.file === 'chapter-02-reuse-03.json'));
  if (!tokens.length || tokens.some(token => !['one_published_candidate_context_pending', 'published_identity_reuse_context_reviewed'].includes(token.disposition) || (token.reuse && token.reuse.file !== 'chapter-02-reuse-03.json') || token.candidates.length !== 1)) throw Error(`Ambiguous or missing source form: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Published reuse/questions incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (used.has(key)) throw Error(`Duplicate occurrence: ${key}`);
    used.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 2, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 2, status: 'offline_contextual_reuse_review_unpublished', sourceSha256: coverage.sourceSha256, unitPlanSha256: coverage.unitPlanSha256, note: 'Forty-three authored chapter II published-identity reuse decisions. D’abord is held as a single locution, with its abord token treated as a phrase component. Every selected occurrence is checked against its source context and prior three-band question set.', items };
writeFileSync(resolve(root, 'chapter-02-reuse-03.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
