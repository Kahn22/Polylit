import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Authored offline drafts. They are source-bound, intentionally unpublished,
// and must be reviewed alongside the remaining work before import.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const preparation = JSON.parse(readFileSync(resolve(root, 'candidate-preparation.json')));
const plan = JSON.parse(readFileSync(resolve(root, 'unit-plan.json')));
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'fourmilière_anthill', form: 'fourmilière', lemma: 'fourmilière', partOfSpeech: 'noun feminine singular', meaning: 'anthill', note: 'In chapter I, our Earth is metaphorically called an anthill. The quiz transfers the literal noun.',
    q13: ['Les fourmis rentrent dans la fourmilière.', 'anthill', 'beehive', 'burrow', 'tree'],
    q45: ['Toute la colonie de fourmis habite dans la même ___.', 'fourmilière', 'ruche', 'tanière', 'mare'],
    q68: ['Sous le chêne, la fourmilière abrite des centaines de fourmis. À côté, une ruche accueille les abeilles ; un nid accueille les oiseaux.', 'Quel mot désigne l’abri de la colonie de fourmis ?', 'fourmilière', 'ruche', 'nid', 'chêne'] },
  { key: 'lieues_distance', form: 'lieues', lemma: 'lieue', partOfSpeech: 'noun feminine plural', meaning: 'leagues (historical distance units)', note: 'Historical length varies by place and era; no fixed metric conversion is asserted.',
    q13: ['Le vieux récit dit que le château est à cinq lieues.', 'leagues', 'hours', 'roads', 'miles'],
    q45: ['La distance entre ces deux villages est indiquée en ___ sur cette carte ancienne.', 'lieues', 'heures', 'années', 'pages'],
    q68: ['Le carnet donne deux mesures : trois lieues entre les bourgs, et deux heures pour le trajet. La route traverse une forêt.', 'Quel mot est une ancienne unité de distance ?', 'lieues', 'heures', 'route', 'forêt'] },
  { key: 'géomètres_geometry', form: 'géomètres', lemma: 'géomètre', partOfSpeech: 'noun masculine plural', meaning: 'geometers', note: 'The 1877 literary base says géomètres; its editorial note reports algébristes in other editions. Do not blend the variants.',
    q13: ['Les géomètres étudient les angles de la figure.', 'geometers', 'painters', 'sailors', 'gardeners'],
    q45: ['Pour établir un théorème sur les triangles, les ___ ont comparé leurs démonstrations.', 'géomètres', 'médecins', 'boulangers', 'musiciens'],
    q68: ['Les géomètres ont prouvé un théorème. Les peintres ont dessiné un tableau, tandis que les médecins soignaient les malades.', 'Quel mot désigne les spécialistes de la géométrie ?', 'géomètres', 'peintres', 'médecins', 'malades'] },
  { key: 'globe_planet', form: 'globe', lemma: 'globe', partOfSpeech: 'noun masculine singular', meaning: 'world; planet', note: 'All workwide uses refer to a celestial world, never to a model globe or a ball.',
    q13: ['Dans ce récit, des habitants vivent sur un autre globe.', 'world', 'village', 'ship', 'mountain'],
    q45: ['Les astronomes imaginent la vie sur un autre ___, loin de la Terre.', 'globe', 'port', 'village', 'jardin'],
    q68: ['Le marin rêve de parcourir le globe. Son navire quitte un port, traverse un océan et rejoint une île.', 'Quel mot désigne la Terre entière ?', 'globe', 'navire', 'océan', 'île'] },
  { key: 'nature_world', form: 'nature', lemma: 'nature', partOfSpeech: 'noun feminine singular', meaning: 'nature; the natural world', note: 'Natural world sense across the work, including both uses of « la nature est comme la nature ». « même nature » and « cette nature » mean kind.', senseRole: 'world',
    q13: ['La nature change avec les saisons.', 'nature', 'office', 'painting', 'city'],
    q45: ['Dans cette réserve, on protège la ___ et les animaux sauvages.', 'nature', 'culture', 'ville', 'peinture'],
    q68: ['La nature entoure le village : la forêt pousse près de la rivière et les oiseaux nichent dans les arbres.', 'Quel mot désigne l’ensemble du monde naturel ?', 'nature', 'village', 'forêt', 'rivière'] },
  { key: 'nature_kind', form: 'nature', lemma: 'nature', partOfSpeech: 'noun feminine singular', meaning: 'kind; character', note: 'Three occurrences: de même nature / questions de cette nature compare kinds; separate from the natural world sense.', senseRole: 'kind',
    q13: ['Ces deux problèmes sont de même nature.', 'kind', 'forest', 'weather', 'garden'],
    q45: ['Ces deux erreurs sont de même ___ : elles viennent toutes deux d’un mauvais calcul.', 'nature', 'couleur', 'hauteur', 'durée'],
    q68: ['Leur première dispute concernait le prix, tandis que la seconde concernait le poids : les deux problèmes n’étaient pas de même nature. Leur durée, en revanche, était identique.', 'Quel mot désigne ici le type ou le caractère d’un problème ?', 'nature', 'durée', 'prix', 'poids'] },
  { key: 'sirien_inhabitant', form: 'sirien', lemma: 'Sirien', partOfSpeech: 'noun masculine singular', meaning: 'inhabitant of Sirius', note: 'Capitalized fictional demonym, not the individual proper name Micromégas; confirm handling across all chapters.',
    q13: ['Dans cette fiction, un Sirien raconte la vie près de Sirius.', 'inhabitant of Sirius', 'inhabitant of Earth', 'inhabitant of Mars', 'inhabitant of Saturn'],
    q45: ['Dans cette fiction, le visiteur vient de Sirius : c’est un ___.', 'Sirien', 'Terrien', 'Martien', 'Saturnien'],
    q68: ['Un Sirien raconte son voyage à une Terrienne. Un Martien les rejoint, puis un Saturnien leur montre des cartes.', 'Quel mot désigne l’être venant de Sirius ?', 'Sirien', 'Terrienne', 'Martien', 'Saturnien'] },
  { key: 'muphti_mufti', form: 'muphti', lemma: 'muphti', partOfSpeech: 'noun masculine singular', meaning: 'mufti', note: 'Historical spelling muphti; modern French spelling mufti may be shown only after the answer. Religious jurist role in satire.',
    q13: ['Le muphti donne son avis sur une règle religieuse.', 'mufti', 'captain', 'merchant', 'painter'],
    q45: ['Un juge consulte le ___ avant de trancher une question de droit islamique.', 'muphti', 'marchand', 'navigateur', 'jardinier'],
    q68: ['Le muphti rédige un avis juridique ; le juge le lit avant l’audience. Le marchand attend dehors avec le marin.', 'Quel mot désigne le spécialiste du droit religieux musulman ?', 'muphti', 'juge', 'marchand', 'marin'] },
  { key: 'gravitation_attraction', form: 'gravitation', lemma: 'gravitation', partOfSpeech: 'noun feminine singular', meaning: 'gravitation; gravity', note: 'Physical attraction, not an abstract burden.',
    q13: ['La gravitation maintient la Lune sur son orbite.', 'gravity', 'heat', 'weather', 'sound'],
    q45: ['La ___ attire les corps les uns vers les autres.', 'gravitation', 'respiration', 'végétation', 'fermentation'],
    q68: ['La gravitation agit entre les astres ; la lumière éclaire le télescope, et la chaleur réchauffe l’observatoire.', 'Quel mot désigne l’attraction entre les corps matériels ?', 'gravitation', 'lumière', 'chaleur', 'télescope'] },
  { key: 'comète_astronomy', form: 'comète', lemma: 'comète', partOfSpeech: 'noun feminine singular', meaning: 'comet', note: 'Astronomical object, rather than a figurative expression.',
    q13: ['Une comète laisse parfois une longue traînée lumineuse.', 'comet', 'planet', 'moon', 'cloud'],
    q45: ['Dans le ciel, la ___ développe une queue lumineuse à l’approche du Soleil.', 'comète', 'planète', 'étoile', 'lune'],
    q68: ['Une comète traverse le ciel avec sa longue queue brillante. Une étoile scintille près d’une planète.', 'Quel mot désigne l’astre muni d’une queue visible près du Soleil ?', 'comète', 'étoile', 'planète', 'ciel'] }
];
const items = records.map(record => {
  const occurrences = plan.units.flatMap(unit => tokenizeFrench(unit.text)
    .filter(token => token.normalized === record.form && (!record.senseRole || ((/(?:même|cette)\s*$/u.test(unit.text.slice(0, token.start))) === (record.senseRole === 'kind'))))
    .map(token => ({ chapter: unit.chapter, unit: unit.ordinal, start: token.start, end: token.end, text: unit.text.slice(token.start, token.end) })));
  if (!occurrences.length || record.q13.length !== 5 || record.q45.length !== 5 || record.q68.length !== 6) throw Error(`Incomplete authoring: ${record.key}`);
  const [context13, ...choices13] = record.q13;
  const [context45, ...choices45] = record.q45;
  const [context68, question68, ...choices68] = record.q68;
  if (!context13.includes(occurrences[0].text) || !context45.includes('___') || !choices45.includes(occurrences[0].text)) throw Error(`Target mismatch: ${record.key}`);
  if (new Set(choices13).size !== 4 || new Set(choices45).size !== 4 || new Set(choices68).size !== 4 || choices68.some(choice => !context68.includes(choice))) throw Error(`Choice mismatch: ${record.key}`);
  return { key: record.key, form: record.form, lemma: record.lemma, partOfSpeech: record.partOfSpeech, meaning: record.meaning,
    editorialNote: record.note, sourceOccurrences: occurrences, status: 'workwide_context_reviewed_question_signoff_pending',
    questions: [
      { band: '1-3', context: context13, question: 'Meaning', answer: choices13[0], choices: choices13 },
      { band: '4-5', context: context45, question: 'Complétez la phrase.', answer: choices45[0], choices: choices45 },
      { band: '6-8', context: context68, question: question68, answer: choices68[0], choices: choices68 }
    ] };
});
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'offline_editorial_draft_unpublished',
  sourceSha256: sha(draft), unitPlanSha256: sha(readFileSync(resolve(root, 'unit-plan.json'))),
  note: 'Ten workwide contextual sense drafts and three authored question bands each. Exact active catalogue lookup found no matching surface identity for these forms; inspect related lemmas, expression overlap, lexical review of other forms and final choice semantics before importing.', items };
writeFileSync(resolve(root, 'chapter-01-batch-01.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
