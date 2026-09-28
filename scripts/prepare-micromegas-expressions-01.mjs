import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Contextual triage only; no active learner expression is created here.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const activeExpressions = readdirSync(resolve('content/published/shared/fr/expressions'))
  .flatMap(file => JSON.parse(readFileSync(resolve('content/published/shared/fr/expressions', file))).records);
const span = (needle, { chapterOnly = false, accept = () => true } = {}) => plan.units.flatMap(unit => {
  if (chapterOnly && unit.chapter !== 1) return [];
  const matches = [];
  let from = 0;
  while (true) {
    const start = unit.text.toLocaleLowerCase('fr').indexOf(needle.toLocaleLowerCase('fr'), from);
    if (start < 0) break;
    const end = start + needle.length;
    if (accept(unit, start, end)) matches.push({ chapter: unit.chapter, unit: unit.ordinal, start, end, text: unit.text.slice(start, end) });
    from = end;
  }
  return matches;
});
const questions = (early, english, middle, french, late, prompt, upper) => [
  { band: '1-3', context: early, question: 'Meaning', answer: english[0], choices: english },
  { band: '4-5', context: middle, question: 'Complétez la phrase.', answer: french[0], choices: french },
  { band: '6-8', context: late, question: prompt, answer: upper[0], choices: upper }
];
const items = [
  { key: 'sur_le_champ', surface: 'sur-le-champ', disposition: 'single_orthographic_word_lexical_queue', occurrences: span('sur-le-champ'), decision: 'The hyphenated adverb is one orthographic token meaning immediately. Index it as vocabulary surface+sense, not independent multiword expression mastery.' },
  { key: 'a_peu_pres', surface: 'à peu près', disposition: 'reuse_existing_vocabulary_identity_no_new_expression_mastery', occurrences: span('à peu près'), existing: { explanatoryNoteId: 'exp_a_peu_pres', vocabularyIdentity: 'srf_fr_a_peu_pres_a:sns_fr_a_peu_pres', questionBands: 3 }, decision: 'The chapter I, V and VI uses express approximation, matching the already published surface à plus locution sense and its three prepared quiz bands. Reuse that exact vocabulary identity on the à token when importing the work; retain the phrase note. Do not create a second expression mastery item or transfer/reset progress. Check the indexed occurrence and page context during import.' },
  { key: 'ne_que', surface: 'ne … que', disposition: 'grammatical_construction_no_new_expression', occurrences: span('n’ont que', { chapterOnly: true, accept: unit => unit.ordinal === 24 }).slice(0, 1), decision: 'Restrictive negation is productive grammar, with existing vocabulary identities for restriction; this is a representative source span, not exhaustive workwide expression indexing.' },
  { key: 'de_meme_nature', surface: 'de même nature', disposition: 'compositional_no_new_expression', occurrences: span('de même nature'), decision: 'Means of the same kind. The nature kind sense is already separately drafted in chapter I batch 01; independent phrase mastery would double count a compositional comparison.' },
  { key: 'de_globe_en_globe', surface: 'de globe en globe', disposition: 'productive_pattern_no_new_expression', occurrences: span('de globe en globe'), decision: 'Repeated-noun de X en X travel construction; the same pattern also occurs with planète and branche, so keep components learnable without a separate fixed phrase identity.' },
  { key: 'faire_le_tour', surface: 'faire le tour', disposition: 'new_expression_draft_question_signoff_pending', occurrences: span('faire le tour'), meaning: 'go around; make a circuit of', decision: 'The path around the small states has a stable circuit meaning. No published expression identity with this headword was found; retain component vocabulary independently.',
    questions: questions('Ils vont faire le tour du lac à pied.', ['go all the way around', 'cross by boat', 'stay inside', 'leave immediately'], 'Pour revenir au point de départ en suivant toute la rive, ils vont ___ du lac.', ['faire le tour', 'prendre le chemin', 'rester près', 's’éloigner'], 'Les promeneurs veulent faire le tour du lac. D’autres préfèrent prendre le chemin du village, rester près du pont ou s’éloigner de la rive.', 'Quelle expression signifie suivre tout le contour ?', ['faire le tour', 'prendre le chemin', 'rester près', 's’éloigner']) },
  { key: 'se_mettre_a', surface: 'se mettre à', disposition: 'reuse_existing_vocabulary_sense_per_surface_no_expression_mastery', occurrences: [...span('se mit à'), ...span('se met à')].sort((a, b) => a.unit - b.unit || a.start - b.start), existing: { vocabularySenseIds: ['sns_fr_mettre_reflexive_begin', 'sns_fr_mettre_begin'], surfaceForms: ['mit', 'mirent'], reusablePastIdentity: 'srf_mit:sns_fr_mettre_reflexive_begin', presentSenseId: 'sns_fr_mettre_reflexive_begin', pendingPresentSurface: 'met', questionBandsPerSense: 3 }, decision: 'All three occurrences mean begin an action. The two Micromégas past se mit à uses match the already published mit + reflexive-begin identity, which should keep its mastery and questions. The present se met à links a new met surface to the same reflexive-begin sense under the chapter I identity plan, while retaining separate mastery for met versus mit. The other published begin sense under mirent stays unchanged. Keep the whole phrase out of independent expression mastery; import the present surface only after complete work signoff.' },
  { key: 'au_bout_de', surface: 'au bout de', disposition: 'split_spatial_compositional_temporal_expression_draft', occurrences: span('au bout de'), meaning: 'after; at the end of a period', decision: 'The p. 1 telescope use is the spatial end of an object and is compositional. Chapter VII au bout de dix ans is temporal and may warrant an independent expression identity; only that latter use receives questions.',
    expressionOccurrenceUnits: [182],
    questions: questions('Ils se revoient au bout de trois ans.', ['after three years', 'for three years', 'before three years', 'every three years'], 'Ils se sont quittés en 2020 et se sont revus en 2023, ___ trois ans.', ['au bout de', 'pendant', 'avant', 'tous les'], 'Ils se retrouvent au bout de trois ans. Ils écrivent pendant ces années ; avant leur séparation, ils vivaient ensemble, puis ils voyagent tous les étés.', 'Quelle expression marque la fin de l’attente de trois ans ?', ['au bout de', 'pendant', 'avant', 'tous les']) },
  { key: 'a_propos', surface: 'à propos', disposition: 'new_expression_draft_question_signoff_pending', occurrences: span('à propos'), meaning: 'aptly; appropriately', decision: 'In « si à propos que » the locution means suitably or at the right moment, not the discourse marker “by the way.” No matching published expression identity found.',
    questions: questions('Elle choisit à propos les mots qui calment la dispute.', ['aptly', 'late', 'randomly', 'without reason'], 'Son commentaire arrive ___ : il répond exactement à la question posée.', ['à propos', 'en retard', 'à côté', 'sans raison'], 'Le professeur répond à propos et éclaire la question. Son collègue arrive en retard, parle à côté et intervient sans raison.', 'Quelle expression dit que la réponse convient bien à la situation ?', ['à propos', 'en retard', 'à côté', 'sans raison']) },
  { key: 'de_planete_en_planete', surface: 'de planète en planète', disposition: 'productive_pattern_no_new_expression', occurrences: span('de planète en planète'), decision: 'Same productive de X en X travel construction as de globe en globe; the independently useful planet noun is drafted in batch 03.' }
];
if (items.length !== 10 || new Set(items.map(item => item.key)).size !== 10) throw Error('Expression triage needs ten distinct candidates');
if (activeExpressions.some(item => items.some(candidate => candidate.questions && candidate.surface === item.headword))) throw Error('Already active expression: inspect before authoring');
for (const item of items) {
  if (!item.occurrences.length) throw Error(`Missing source phrase: ${item.key}`);
  for (const occ of item.occurrences) {
    const unit = plan.units[occ.unit - 1];
    if (unit?.chapter !== occ.chapter || unit.text.slice(occ.start, occ.end) !== occ.text) throw Error(`Stale source span: ${item.key}`);
  }
  if (item.questions) {
    if (item.questions.length !== 3 || item.questions[0].choices.length !== 4 || !item.questions[0].context.toLocaleLowerCase('fr').includes(item.surface)) throw Error(`Incomplete early question: ${item.key}`);
    if (!item.questions[1].context.includes('___') || item.questions[1].choices[0] !== item.surface) throw Error(`Incomplete middle question: ${item.key}`);
    if (item.questions[2].choices.some(choice => !item.questions[2].context.includes(choice))) throw Error(`Incomplete upper question: ${item.key}`);
    for (const question of item.questions) if (new Set(question.choices).size !== 4 || !question.choices.includes(question.answer)) throw Error(`Invalid choices: ${item.key}`);
  }
}
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'offline_expression_triage_and_question_drafts_unpublished', sourceSha256: sha(draft), unitPlanSha256: sha(planBytes),
  note: 'Ten chapter I phrase candidates checked against complete-work source units and existing published expression headwords. À peu près reuses its existing vocabulary identity and three quiz bands without duplicating mastery; se mettre à uses the existing reflexive-begin sense with a planned new met surface. Three other expression candidates have drafted three-band questions; none is published or approved.', items };
writeFileSync(resolve(root, 'chapter-01-expressions-01.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ candidates: items.length, authoredExpressions: items.filter(x => x.questions).length, questions: items.reduce((n,x)=>n+(x.questions?.length ?? 0),0), holds: items.filter(x=>x.disposition.includes('hold')).length, sourceSpans: items.reduce((n,x)=>n+x.occurrences.length,0) }));
