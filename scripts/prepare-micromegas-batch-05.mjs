import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Authored offline. Exact form indexing supports review; it never grants
// identity or question approval or changes the current learner bundle.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = [1, 2, 3, 4].flatMap(n => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-0${n}.json`))).items);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'sur_le_champ_immediately', form: 'sur-le-champ', lemma: 'sur-le-champ', partOfSpeech: 'adverb invariable', meaning: 'immediately; on the spot', note: 'A single hyphenated adverb at two points in the story; the phrase triage explicitly routes this orthographic token to vocabulary, not independent expression mastery.',
    q13: ['Elle répondit sur-le-champ à l’appel.', 'immediately', 'tomorrow', 'slowly', 'elsewhere'],
    q45: ['En entendant l’alarme, elle partit ___, sans attendre.', 'sur-le-champ', 'le lendemain', 'une semaine après', 'après réflexion'],
    q68: ['Elle part sur-le-champ dès l’alarme. Son voisin attend le lendemain ; son frère reviendra le matin et sa sœur le soir.', 'Quel mot indique qu’elle part immédiatement ?', 'sur-le-champ', 'lendemain', 'matin', 'soir'] },
  { key: 'rayon_lightbeam', form: 'rayon', lemma: 'rayon', partOfSpeech: 'noun masculine singular', meaning: 'ray; beam of light', note: 'Used for a beam from the sun employed in cosmic travel. Not a radius or department-store aisle.',
    q13: ['Un rayon de soleil éclaire le sol.', 'sunbeam', 'cloud', 'wind', 'noise'],
    q45: ['Un ___ de soleil traverse la fenêtre et éclaire la table.', 'rayon', 'nuage', 'vent', 'bruit'],
    q68: ['Le rayon du soleil éclaire la fenêtre. Un nuage le cache ensuite ; le vent déplace les feuilles.', 'Quel mot désigne la lumière qui arrive du Soleil ?', 'rayon', 'nuage', 'vent', 'fenêtre'] },
  { key: 'lois_physical_laws', form: 'lois', lemma: 'loi', partOfSpeech: 'noun feminine plural', meaning: 'physical laws; principles', note: 'The laws of gravitation are principles describing natural behavior, a separate sense from statutes; related existing loi law identities must not be reused without checking sense.',
    q13: ['Les lois de la physique décrivent le mouvement des corps.', 'laws of nature', 'paintings', 'stories', 'maps'],
    q45: ['Les ___ de la gravitation permettent de prévoir les mouvements des planètes.', 'lois', 'images', 'histoires', 'légendes'],
    q68: ['Les lois de la gravitation décrivent comment les masses s’attirent. Les images illustrent les résultats, et les histoires racontent la vie des savants.', 'Quel mot désigne les principes qui décrivent ce phénomène naturel ?', 'lois', 'images', 'histoires', 'résultats'] },
  { key: 'forces_physical', form: 'forces', lemma: 'force', partOfSpeech: 'noun feminine plural', meaning: 'physical forces', note: 'Refers to attractive and repulsive effects in the astronomical passage, not an army or personal strength.',
    q13: ['Des forces agissent entre ces deux aimants.', 'forces', 'shapes', 'distances', 'speeds'],
    q45: ['Ces ___ physiques attirent les aimants l’un vers l’autre.', 'forces', 'formes', 'distances', 'vitesses'],
    q68: ['Les forces attirent les deux aimants. Les distances indiquent leur écartement, les formes décrivent leur contour et les vitesses leur mouvement.', 'Quel mot désigne ce qui provoque leur attraction ?', 'forces', 'distances', 'formes', 'vitesses'] },
  { key: 'attractives_attracting', form: 'attractives', lemma: 'attractif', partOfSpeech: 'adjective feminine plural', meaning: 'attractive; drawing together', note: 'Agrees with forces; means physically drawing objects together, not appealing or charming.',
    q13: ['Ces forces attractives rapprochent les deux aimants.', 'attracting', 'repelling', 'warming', 'slowing'],
    q45: ['Les deux corps se rapprochent sous l’effet de forces ___.', 'attractives', 'répulsives', 'destructrices', 'isolantes'],
    q68: ['Les forces attractives rapprochent les deux objets. Les forces répulsives les éloignent ; les forces destructrices les brisent et les forces isolantes les séparent.', 'Quel mot qualifie les forces qui rapprochent ?', 'attractives', 'répulsives', 'destructrices', 'isolantes'] },
  { key: 'repulsives_repelling', form: 'répulsives', lemma: 'répulsif', partOfSpeech: 'adjective feminine plural', meaning: 'repulsive; pushing apart', note: 'Agrees with forces; describes physical repulsion, not unpleasant appearance.',
    q13: ['Les forces répulsives éloignent les deux aimants.', 'repelling', 'attracting', 'illuminating', 'warming'],
    q45: ['Les deux aimants s’éloignent sous l’effet de forces ___.', 'répulsives', 'attractives', 'créatrices', 'réparatrices'],
    q68: ['Les forces répulsives éloignent les aimants ; les forces attractives les rapprochent. Des actions réparatrices consolident l’appareil et des mesures préventives réduisent les risques.', 'Quel mot qualifie les forces qui éloignent les aimants ?', 'répulsives', 'attractives', 'réparatrices', 'préventives'] },
  { key: 'inventions_new_creations', form: 'inventions', lemma: 'invention', partOfSpeech: 'noun feminine plural', meaning: 'inventions; newly created devices or ideas', note: 'The secretary reports others’ inventions; the narrator explicitly says he invented none himself.',
    q13: ['Ces inventions ont changé la façon de mesurer le temps.', 'inventions', 'repairs', 'translations', 'copies'],
    q45: ['Ces machines entièrement nouvelles sont des ___ qui n’existaient pas auparavant.', 'inventions', 'réparations', 'imitations', 'traductions'],
    q68: ['Les inventions sont des machines nouvelles. Les réparations remettent en état les machines anciennes, et les imitations en reproduisent la forme.', 'Quel mot désigne les créations inédites ?', 'inventions', 'réparations', 'imitations', 'machines'] },
  { key: 'calculs_computations', form: 'calculs', lemma: 'calcul', partOfSpeech: 'noun masculine plural', meaning: 'calculations; computations', note: 'The Saturnian secretary performs mathematical computations; not plans, kidney stones, or political schemes.',
    q13: ['Ses calculs donnent une réponse exacte.', 'calculations', 'drawings', 'stories', 'songs'],
    q45: ['Pour additionner ces quantités, elle effectue plusieurs ___.', 'calculs', 'dessins', 'récits', 'poèmes'],
    q68: ['Ses calculs additionnent les nombres. Ses dessins montrent les figures, ses récits racontent les voyages et ses poèmes jouent sur les sons.', 'Quel mot désigne les opérations sur les nombres ?', 'calculs', 'dessins', 'récits', 'poèmes'] },
  { key: 'academie_scholarly', form: 'académie', lemma: 'académie', partOfSpeech: 'noun feminine singular', meaning: 'academy; scholarly institution', note: 'The Saturnian academy and Paris Academy of Sciences are learned institutions, not school classes or physical libraries.',
    q13: ['Cette académie réunit des chercheurs qui présentent leurs travaux.', 'academy', 'factory', 'library', 'classroom'],
    q45: ['Cette ___ des sciences, société savante composée de chercheurs élus, organise des débats.', 'académie', 'bibliothèque', 'usine', 'école'],
    q68: ['L’académie accueille les chercheurs pour débattre de leurs découvertes. La bibliothèque conserve leurs livres, et l’usine fabrique leurs instruments.', 'Quel mot désigne ici la société savante ?', 'académie', 'bibliothèque', 'usine', 'chercheurs'] },
  { key: 'conversation_dialogue', form: 'conversation', lemma: 'conversation', partOfSpeech: 'noun feminine singular', meaning: 'conversation; spoken exchange', note: 'The three uses are spoken exchanges, including one the giants seek with humans. « Lier conversation » is a contextual collocation for later expression triage.',
    q13: ['Leur conversation dura longtemps après le repas.', 'conversation', 'song', 'letter', 'silence'],
    q45: ['En se parlant tour à tour, ils eurent une longue ___ au café.', 'conversation', 'chanson', 'lettre', 'traduction'],
    q68: ['La conversation continue : Paul parle et Léa répond. Une chanson passe à la radio, puis une lettre arrive par la poste.', 'Quel mot désigne leur échange de paroles ?', 'conversation', 'chanson', 'lettre', 'radio'] }
];
const used = new Set(previous.flatMap(item => item.sourceOccurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
const items = records.map(record => {
  const row = gap.forms.find(candidate => candidate.form === record.form);
  if (!row || row.candidateIdentities.length || record.q13.length !== 5 || record.q45.length !== 5 || record.q68.length !== 6) throw Error(`Unreviewed candidate or question shape: ${record.key}`);
  const occurrences = plan.units.flatMap(unit => tokenizeFrench(unit.text).filter(token => token.normalized === record.form)
    .map(token => ({ chapter: unit.chapter, unit: unit.ordinal, start: token.start, end: token.end, text: unit.text.slice(token.start, token.end) })));
  if (occurrences.length !== row.count || !occurrences.some(occ => occ.chapter === 1)) throw Error(`Incomplete chapter/workwide occurrence coverage: ${record.key}`);
  for (const occ of occurrences) {
    const key = `${occ.unit}:${occ.start}:${occ.end}`;
    if (used.has(key)) throw Error(`Occurrence overlap: ${record.key} ${key}`);
    used.add(key);
  }
  const [context13, ...choices13] = record.q13;
  const [context45, ...choices45] = record.q45;
  const [context68, question68, ...choices68] = record.q68;
  if (!context13.toLocaleLowerCase('fr').includes(occurrences[0].text.toLocaleLowerCase('fr')) || !context45.includes('___') || !choices45.map(choice => choice.toLocaleLowerCase('fr')).includes(occurrences[0].text.toLocaleLowerCase('fr'))) throw Error(`Target mismatch: ${record.key}`);
  if ([choices13, choices45, choices68].some(choices => new Set(choices).size !== 4) || choices68.some(choice => !context68.includes(choice))) throw Error(`Choice mismatch: ${record.key}`);
  return { key: record.key, form: record.form, lemma: record.lemma, partOfSpeech: record.partOfSpeech, meaning: record.meaning,
    editorialNote: record.note, sourceOccurrences: occurrences, status: 'workwide_context_reviewed_question_signoff_pending',
    questions: [
      { band: '1-3', context: context13, question: 'Meaning', answer: choices13[0], choices: choices13 },
      { band: '4-5', context: context45, question: 'Complétez la phrase.', answer: choices45[0], choices: choices45 },
      { band: '6-8', context: context68, question: question68, answer: choices68[0], choices: choices68 }
    ] };
});
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'offline_editorial_draft_unpublished',
  sourceSha256: sha(draft), unitPlanSha256: sha(planBytes),
  note: 'Ten additional contextual sense drafts with all exact-form occurrences and three authored question bands. Physical laws, forces, and light rays are distinguished from legal laws, armies or geometrical radii; published same-lemma identities still require final reuse QA.', items };
writeFileSync(resolve(root, 'chapter-01-batch-05.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
