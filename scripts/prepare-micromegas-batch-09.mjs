import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Editorially authored offline. Exact spans do not approve a learner identity.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = Array.from({ length: 8 }, (_, i) => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-${String(i + 1).padStart(2, '0')}.json`))).items).flat();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'dernier_most_recent', form: 'dernier', lemma: 'dernier', partOfSpeech: 'adjective masculine singular', meaning: 'last; most recent', note: 'The narrator’s most recent journey, not the second of two items; compare the published Zola sense before reuse.',
    q13: ['Lors de mon dernier voyage, j’ai visité Saturne.', 'most recent', 'earliest', 'shortest', 'longest'],
    q45: ['Après plusieurs voyages, je raconte mon voyage le plus récent : mon ___ voyage.', 'dernier', 'premier', 'prochain', 'ancien'],
    q68: ['Mon dernier voyage a eu lieu hier. Le premier était il y a dix ans, le prochain sera demain et un ancien voyage remonte à cinq ans.', 'Quel adjectif désigne le voyage le plus récent ?', 'dernier', 'premier', 'prochain', 'ancien'] },
  { key: 'appelait_was_named', form: 'appelait', lemma: 'appeler', partOfSpeech: 'pronominal verb imperfect third singular', meaning: 'was called; bore the name', note: 'The name Micromégas follows se; do not confuse this pronominal naming use with calling aloud.',
    q13: ['Il s’appelait Micromégas.', 'was called', 'was frightened', 'was hidden', 'was dismissed'],
    q45: ['Ce personnage portait le nom de Micromégas : il s’___ ainsi.', 'appelait', 'éloignait', 'cachait', 'étonnait'],
    q68: ['Le voyageur s’appelait Micromégas : c’était son nom. Son ami s’éloignait, le chat se cachait et l’enfant s’étonnait.', 'Quel verbe indique le nom du voyageur ?', 'appelait', 'éloignait', 'cachait', 'étonnait'] },
  { key: 'utiles_helpful', form: 'utiles', lemma: 'utile', partOfSpeech: 'adjective plural', meaning: 'useful; of help', note: 'The narrator ironically calls geometers useful to society; the adjective’s lexical sense remains useful.',
    q13: ['Ces géomètres sont utiles au public.', 'useful', 'invisible', 'unhappy', 'distant'],
    q45: ['Leurs calculs rendent service aux habitants : ils sont ___.', 'utiles', 'inutiles', 'absents', 'lointains'],
    q68: ['Ces outils utiles rendent service. Les objets inutiles ne servent à rien, les élèves absents ne sont pas là et les villages lointains sont éloignés.', 'Quel adjectif signifie qu’ils rendent service ?', 'utiles', 'inutiles', 'absents', 'lointains'] },
  { key: 'public_people', form: 'public', lemma: 'public', partOfSpeech: 'noun masculine singular', meaning: 'the public; people in general', note: 'Au public denotes the community benefiting from geometers, not the published adjective sense accessible to everyone.',
    q13: ['Les découvertes des géomètres profitent au public.', 'people in general', 'a private letter', 'a building', 'a ruler'],
    q45: ['Cette découverte profite à toute la population : elle sert le ___.', 'public', 'secret', 'palais', 'tribunal'],
    q68: ['Le public profite de la découverte : beaucoup de personnes en bénéficient. Le palais abrite le souverain, le tribunal juge et le secret reste caché.', 'Quel nom désigne les gens en général ?', 'public', 'palais', 'tribunal', 'secret'] },
  { key: 'prendront_take_up', form: 'prendront', lemma: 'prendre', partOfSpeech: 'verb future third plural', meaning: 'will take up; will pick up', note: 'The geometers will take up a pen to calculate, a literal action with a familiar metonym for writing.',
    q13: ['Les géomètres prendront la plume pour écrire.', 'will pick up', 'will throw away', 'will forget', 'will hide'],
    q45: ['Pour écrire leur réponse, ils ___ la plume et ouvriront leur cahier.', 'prendront', 'jetteront', 'cacheront', 'oublieront'],
    q68: ['Ils prendront la plume dans leur main. Les autres jetteront leurs stylos, cacheront leurs cahiers ou oublieront leurs notes.', 'Quel verbe indique qu’ils saisiront la plume ?', 'prendront', 'jetteront', 'cacheront', 'oublieront'] },
  { key: 'plume_writing_quill', form: 'plume', lemma: 'plume', partOfSpeech: 'noun feminine singular', meaning: 'pen; writing quill', note: 'Prendre la plume refers to writing, not a bird’s feather used in isolation; compare any published senses before shared reuse.',
    q13: ['Pour noter leurs calculs, les géomètres prennent la plume.', 'writing pen', 'bird nest', 'stone', 'clock'],
    q45: ['Pour écrire sa lettre à l’ancienne, elle prend une ___ et de l’encre.', 'plume', 'craie', 'brosse', 'règle'],
    q68: ['Elle écrit à la plume avec de l’encre. Son ami trace au tableau avec une craie, peint avec une brosse et mesure avec une règle.', 'Quel nom désigne son instrument pour écrire à l’encre ?', 'plume', 'craie', 'brosse', 'règle'] },
  { key: 'dis_say', form: 'dis', lemma: 'dire', partOfSpeech: 'verb present first singular', meaning: 'I say', note: 'The narrator’s parenthetical dis-je marks his own interruption; distinguish from second-person dis in other contexts.',
    q13: ['Ils trouveront, dis-je, la réponse.', 'I say', 'I write', 'I erase', 'I doubt'],
    q45: ['Je reprends la parole : « Je vous ___ la vérité. »', 'dis', 'cache', 'retire', 'dessine'],
    q68: ['Je dis la réponse à voix haute. Je cache mon carnet, je retire mon manteau et je dessine une carte.', 'Quel verbe exprime le fait de parler ?', 'dis', 'cache', 'retire', 'dessine'] },
  { key: 'absolument_necessarily', form: 'absolument', lemma: 'absolument', partOfSpeech: 'adverb invariable', meaning: 'absolutely; necessarily', note: 'Il faut absolument emphasizes necessity in the satirical calculation, not an approval of its truth.',
    q13: ['Il faut absolument terminer ce calcul.', 'it is essential', 'perhaps', 'rarely', 'secretly'],
    q45: ['Sans aucune exception, ils doivent finir ce travail : il faut ___ le terminer.', 'absolument', 'rarement', 'peut-être', 'secrètement'],
    q68: ['Il faut absolument terminer : c’est indispensable. On pourrait peut-être attendre, travailler rarement ou agir secrètement.', 'Quel adverbe exprime une nécessité sans réserve ?', 'absolument', 'peut-être', 'rarement', 'secrètement'] },
  { key: 'simple_uncomplicated', form: 'simple', lemma: 'simple', partOfSpeech: 'adjective masculine singular', meaning: 'simple; uncomplicated', note: 'Rien n’est plus simple is the narrator’s ironic claim that the calculation is obvious; compare published simple sense.',
    q13: ['Ce calcul paraît simple.', 'easy to understand', 'difficult', 'secret', 'dangerous'],
    q45: ['Ce raisonnement ne présente aucune difficulté : il paraît ___.', 'simple', 'complexe', 'confus', 'obscur'],
    q68: ['Ce calcul simple est facile à suivre. Un autre est complexe, un exposé confus manque de clarté et un texte obscur reste difficile à comprendre.', 'Quel adjectif désigne le calcul facile à comprendre ?', 'simple', 'complexe', 'confus', 'obscur'] },
  { key: 'ordinaire_common', form: 'ordinaire', lemma: 'ordinaire', partOfSpeech: 'adjective masculine singular', meaning: 'ordinary; usual', note: 'Rien n’est plus ordinaire is ironic but uses the usual/common sense; compare the published La Parure sense.',
    q13: ['C’est un événement ordinaire dans ce récit.', 'common', 'unique', 'impossible', 'secret'],
    q45: ['Ce fait arrive tous les jours : il est tout à fait ___.', 'ordinaire', 'exceptionnel', 'impossible', 'mystérieux'],
    q68: ['Un événement ordinaire se produit souvent. Un événement exceptionnel est rare, un fait impossible ne peut survenir et un phénomène mystérieux est mal expliqué.', 'Quel adjectif signifie courant ?', 'ordinaire', 'exceptionnel', 'impossible', 'mystérieux'] }
];

const used = new Set(previous.flatMap(item => item.sourceOccurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
const items = records.map(record => {
  const occurrences = plan.units.flatMap(unit => tokenizeFrench(unit.text).filter(token => token.text.toLocaleLowerCase('fr') === record.form).map(token => ({ chapter: unit.chapter, unit: unit.ordinal, start: token.start, end: token.end, text: token.text })));
  if (!occurrences.some(occ => occ.chapter === 1) || occurrences.length !== gap.forms.find(row => row.form === record.form)?.count) throw Error(`Workwide form mismatch: ${record.key}`);
  for (const occ of occurrences) {
    const key = `${occ.unit}:${occ.start}:${occ.end}`;
    if (used.has(key)) throw Error(`Occurrence overlap: ${key}`);
    used.add(key);
  }
  const [context13, ...choices13] = record.q13;
  const [context45, ...choices45] = record.q45;
  const [context68, question68, ...choices68] = record.q68;
  if (!context13.toLocaleLowerCase('fr').includes(record.form) || !context45.includes('___') || choices45[0].toLocaleLowerCase('fr') !== record.form || [choices13, choices45, choices68].some(choices => choices.length !== 4 || new Set(choices).size !== 4) || choices68.some(choice => !context68.includes(choice))) throw Error(`Question mismatch: ${record.key}`);
  return { key: record.key, form: record.form, lemma: record.lemma, partOfSpeech: record.partOfSpeech, meaning: record.meaning, editorialNote: record.note, sourceOccurrences: occurrences, status: 'workwide_context_reviewed_question_signoff_pending', questions: [
    { band: '1-3', context: context13, question: 'Meaning', answer: choices13[0], choices: choices13 },
    { band: '4-5', context: context45, question: 'Complétez la phrase.', answer: choices45[0], choices: choices45 },
    { band: '6-8', context: context68, question: question68, answer: choices68[0], choices: choices68 }
  ] };
});
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'offline_editorial_draft_unpublished', sourceSha256: sha(draft), unitPlanSha256: sha(planBytes), note: 'Ten opening-narration meanings with single exact-form workwide occurrences and three authored question bands each. Published sense reuse and final question approval pending; no learner import.', items };
writeFileSync(resolve(root, 'chapter-01-batch-09.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
