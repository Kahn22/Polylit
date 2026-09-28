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
  ['moi', 'Pour moi names the speaker’s point of view and chez moi his place; both use the stressed first-person pronoun.'],
  ['ose', 'Je n’ose faire means the speaker does not dare to make plans.'],
  ['eau', 'Une goutte d’eau in the ocean is literal water.'],
  ['suis', 'Je suis honteux attributes a state to the speaker through être.'],
  ['honteux', 'The speaker feels ashamed of his small figure beside the traveler.'],
  ['surtout', 'Surtout devant vous singles out the interlocutor particularly.'],
  ['devant', 'Devant vous places the ashamed speaker in the presence of his addressee.'],
  ['ridicule', 'Figure ridicule describes his supposedly laughable appearance and status.'],
  ['repartit', 'Lui repartit introduces Micromégas’s spoken reply, not a physical departure.'],
  ['vie', 'Notre vie is each creature’s lifespan in the duration comparison.'],
  ['sept', 'Sept cents and sept colors each count the cardinal seven.'],
  ['longue', 'Une vie plus longue measures an extended duration.'],
  ['quand', 'Each quand introduces a temporal condition or moment in the death discussion.'],
  ['appelle', 'Ce qui s’appelle mourir names what the described change is called.'],
  ['venu', 'Le moment est venu means the time has arrived.'],
  ['longtemps', 'Living longer in other lands uses the duration adverb for a long time.'],
  ['partout', 'Each instance says the state occurs throughout the places considered: everywhere.'],
  ['gens', 'Gens de bon sens describes people who accept their lot.'],
  ['savent', 'Savent prendre leur parti expresses knowing how to accept the situation.'],
  ['auteur', 'L’auteur de la nature is its originator in this philosophical passage.'],
  ['cet', 'Cet univers points demonstratively to the universe being discussed.'],
  ['admirable', 'Uniformité admirable means the speaker finds that uniformity worthy of admiration.'],
  ['sont', 'Les êtres sont différents and les habitants le sont both attribute qualities with être.'],
  ['fond', 'Au fond means fundamentally or at the heart of the matter; this matches the published heart-of-the-matter meaning.'],
  ['don', 'Le don de la pensée names an endowment or gift of thought.'],
  ['chaque', 'Chaque globe means each planet individually.'],
  ['ces', 'Ces propriétés points to the previously discussed characteristics of matter.'],
  ['pourrait', 'Ne pourrait subsister says the globe would not be able to continue existing.'],
  ['subsister', 'Le globe subsister means it continues to exist.'],
  ['tel', 'Tel qu’il est refers to the globe in its present state: as it is.'],
  ['trois', 'Trois cents and three thousand are explicit numerical counts of properties or substances.'],
  ['suffit', 'Ce petit nombre suffit means the number is adequate for the Creator’s ends.'],
  ['avait', 'Le Créateur avait and related instances use avoir to ascribe possession in past time.'],
  ['petite', 'Petite habitation refers to the small Saturnian dwelling world.'],
  ['sa', 'Sa sagesse ascribes wisdom to the divine creator: his.'],
  ['avez', 'Vous avez peu de sensations addresses the Saturnian’s possession of few sensations.'],
  ['ouvrage', 'L’ouvrage de la Providence is a work or creation attributed to providence.'],
  ['ses', 'Ses rayons belong to the sun; the other possessive likewise refers back to a singular owner.'],
  ['rouge', 'Le soleil tire sur le rouge describes the reddish color.'],
  ['ceux', 'Tous ceux refers back to suns; other uses designate ones in a previous set.'],
  ['plusieurs', 'Plusieurs questions is an indefinite plural number of questions.'],
  ['cette', 'Cette nature points demonstratively to the kind of questions just discussed.'],
  ['enfin', 'Enfin opens the eventual conclusion of the conversation: finally.'],
  ['ils', 'Ils designates the two travelers as a third-person plural subject.'],
  ['raisonné', 'Après avoir raisonné means the travelers have reasoned or argued.'],
  ['pendant', 'Pendant une révolution du soleil locates their reasoning over the duration of a revolution.']
];
const used = new Set();
const items = decisions.map(([form, rationale]) => {
  const tokens = coverage.tokens.filter(token => token.form === form && (token.disposition === 'one_published_candidate_context_pending' || token.reuse?.file === 'chapter-02-reuse-04.json'));
  if (!tokens.length || tokens.some(token => !['one_published_candidate_context_pending', 'published_identity_reuse_context_reviewed'].includes(token.disposition) || (token.reuse && token.reuse.file !== 'chapter-02-reuse-04.json') || token.candidates.length !== 1)) throw Error(`Ambiguous or missing source form: ${form}`);
  const candidate = tokens[0].candidates[0];
  if (tokens.some(token => token.candidates[0].identity !== candidate.identity) || candidate.preparedBands.join(',') !== 'levels_1_3,levels_4_5,levels_6_8') throw Error(`Published reuse/questions incomplete: ${form}`);
  for (const token of tokens) {
    const key = `${token.unit}:${token.start}:${token.end}`;
    if (used.has(key)) throw Error(`Duplicate occurrence: ${key}`);
    used.add(key);
  }
  return { form, identity: candidate.identity, lemma: candidate.lemma, publishedGloss: candidate.gloss, publishedBands: candidate.preparedBands, decision: rationale, status: 'chapter_context_reviewed_reuse_pending_final_bundle_signoff', occurrences: tokens.map(({ unit, start, end, text, context }) => ({ chapter: 2, unit, start, end, text, context })) };
});
const output = { version: 1, workId: coverage.workId, chapter: 2, status: 'offline_contextual_reuse_review_unpublished', sourceSha256: coverage.sourceSha256, unitPlanSha256: coverage.unitPlanSha256, note: 'Forty-six authored chapter II published-identity reuse decisions. Every occurrence is checked against its source context and prior three-band question set. Does not change published identities or import this work.', items };
writeFileSync(resolve(root, 'chapter-02-reuse-04.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ forms: items.length, occurrences: items.reduce((n,item)=>n+item.occurrences.length,0), questionBandsReused: items.reduce((n,item)=>n+item.publishedBands.length,0) }));
