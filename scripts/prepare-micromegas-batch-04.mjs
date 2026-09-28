import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = [1, 2, 3].flatMap(n => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-0${n}.json`))).items);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'cinquante_fifty', form: 'cinquante', lemma: 'cinquante', partOfSpeech: 'numeral invariable', meaning: 'fifty', note: 'Six uses have the same cardinal value, whether counting feet, years, mathematical propositions, distances, or weights.',
    q13: ['Cinquante élèves sont entrés dans la salle.', 'fifty', 'forty', 'sixty', 'thirty'],
    q45: ['Deux fois vingt-cinq font ___.', 'cinquante', 'quarante', 'soixante', 'trente'],
    q68: ['Le calcul donne cinquante : deux fois vingt-cinq. Un autre groupe compte quarante, le suivant soixante et le dernier trente.', 'Quel mot correspond à deux fois vingt-cinq ?', 'cinquante', 'quarante', 'soixante', 'trente'] },
  { key: 'huit_eight', form: 'huit', lemma: 'huit', partOfSpeech: 'numeral invariable', meaning: 'eight', note: 'Four uses keep the same cardinal value in eight leagues and eight hundred years.',
    q13: ['Huit personnes attendent à la porte.', 'eight', 'six', 'seven', 'nine'],
    q45: ['Quatre paires de chaussures contiennent ___ chaussures.', 'huit', 'six', 'sept', 'neuf'],
    q68: ['Quatre paires donnent huit chaussures. Trois paires donnent six chaussures ; ailleurs, on en compte sept ou neuf.', 'Quel mot correspond à quatre paires de chaussures ?', 'huit', 'six', 'sept', 'neuf'] },
  { key: 'citoyens_inhabitants', form: 'citoyens', lemma: 'citoyen', partOfSpeech: 'noun masculine plural', meaning: 'citizens; members of a community', note: 'The narrator applies citoyens to Earth people and Saturn people rhetorically, as members of their respective worlds; do not imply formal planetary nationality.',
    q13: ['Les citoyens de Saturne vivent sur leur planète.', 'members of that world', 'visitors', 'tourists', 'foreigners'],
    q45: ['Ils appartiennent à la communauté de Saturne : ce sont ses ___.', 'citoyens', 'visiteurs', 'touristes', 'étrangers'],
    q68: ['Les citoyens de Saturne appartiennent à la communauté de cette planète. Les visiteurs sont de passage, les touristes viennent brièvement et les étrangers appartiennent à une autre communauté.', 'Quel mot désigne les membres de la communauté de Saturne ?', 'citoyens', 'visiteurs', 'touristes', 'étrangers'] },
  { key: 'propositions_mathematical', form: 'propositions', lemma: 'proposition', partOfSpeech: 'noun feminine plural', meaning: 'mathematical propositions; theorems', senseRole: 'mathematical', expected: 1, note: 'Only the Euclid occurrence names propositions of geometry. The other two are religiously suspect assertions and get a separate sense.',
    q13: ['Les propositions de géométrie sont démontrées une par une.', 'mathematical propositions', 'painted figures', 'measured weights', 'printed pages'],
    q45: ['Dans ce traité de géométrie, les ___ sont des énoncés à démontrer.', 'propositions', 'figures', 'longueurs', 'mesures'],
    q68: ['Le géomètre démontre les propositions du traité. Il dessine les figures, calcule les mesures et relie les points.', 'Quel mot désigne les énoncés mathématiques à démontrer ?', 'propositions', 'figures', 'mesures', 'points'] },
  { key: 'propositions_assertions', form: 'propositions', lemma: 'proposition', partOfSpeech: 'noun feminine plural', meaning: 'assertions; claims', senseRole: 'assertions', expected: 2, note: 'The mufti and later inquisitors object to stated claims, not geometrical theorems; the two contexts remain satire about censorship.',
    q13: ['Plusieurs propositions de cet auteur affirment que le monde a changé.', 'claims', 'drawings', 'measurements', 'colors'],
    q45: ['Dans son livre, ses ___ affirment des idées que ses adversaires contestent.', 'propositions', 'figures', 'mesures', 'couleurs'],
    q68: ['Le philosophe écrit des propositions que le censeur conteste. Il ajoute des dessins, des mesures et des couleurs pour illustrer son livre.', 'Quel mot désigne ici les idées affirmées par l’auteur ?', 'propositions', 'dessins', 'mesures', 'couleurs'] },
  { key: 'tiers_third', form: 'tiers', lemma: 'tiers', partOfSpeech: 'noun masculine singular', meaning: 'one third', note: 'Partitive « le tiers de son beau visage » means one of three equal parts, not a third party.',
    q13: ['Un tiers de la tarte représente une part sur trois parts égales.', 'one third', 'one half', 'one quarter', 'one fifth'],
    q45: ['Le gâteau est coupé en trois parts égales : une part est un ___ du gâteau.', 'tiers', 'quart', 'demi', 'cinquième'],
    q68: ['Le tiers correspond à une part sur trois ; le quart à une part sur quatre et le demi à une part sur deux.', 'Quel mot désigne une part sur trois ?', 'tiers', 'quart', 'demi', 'part'] },
  { key: 'fraction_part', form: 'fraction', lemma: 'fraction', partOfSpeech: 'noun feminine singular', meaning: 'fraction; part of a whole', note: 'The precise giant-nose calculation ends in a fractional remainder, not a whole extra foot.',
    q13: ['Trois quarts est une fraction.', 'fraction', 'sum', 'equation', 'square root'],
    q45: ['Trois quarts représente une ___ de l’unité, et non un nombre entier.', 'fraction', 'somme', 'racine', 'équation'],
    q68: ['La fraction trois quarts désigne une partie de l’unité. La somme de deux et trois vaut cinq ; une équation demande de trouver une inconnue.', 'Quel mot désigne une partie numérique d’une unité ?', 'fraction', 'somme', 'équation', 'inconnue'] },
  { key: 'metaphysicien_philosopher', form: 'métaphysicien', lemma: 'métaphysicien', partOfSpeech: 'noun masculine singular', meaning: 'metaphysician; philosopher studying the nature of reality', note: 'A satirical judgment calls Pascal a bad metaphysician while acknowledging his geometrical insight.',
    q13: ['Le métaphysicien étudie la nature de l’être et de la réalité.', 'metaphysician', 'surgeon', 'musician', 'navigator'],
    q45: ['Il étudie la nature de l’être et la réalité : ce philosophe est un ___.', 'métaphysicien', 'chirurgien', 'musicien', 'navigateur'],
    q68: ['Le métaphysicien réfléchit à la nature de la réalité. Le chirurgien opère à l’hôpital, le musicien joue du violon et le navigateur prépare sa route.', 'Quel mot désigne ici le philosophe de la réalité ?', 'métaphysicien', 'chirurgien', 'musicien', 'navigateur'] },
  { key: 'tracasseries_hassles', form: 'tracasseries', lemma: 'tracasserie', partOfSpeech: 'noun feminine plural', meaning: 'petty hassles; vexations', note: 'The court from which the hero is banished is full of irritating disputes and petty hassles, not physical obstacles.',
    q13: ['Les tracasseries administratives lui font perdre patience.', 'petty hassles', 'celebrations', 'rewards', 'compliments'],
    q45: ['Les formulaires répétés et les retards lui causent des ___ administratives.', 'tracasseries', 'récompenses', 'félicitations', 'réjouissances'],
    q68: ['Les tracasseries retardent chaque démarche : il faut refaire les mêmes formulaires. Les récompenses et les félicitations, elles, donnent du plaisir.', 'Quel mot désigne les petites difficultés irritantes ?', 'tracasseries', 'récompenses', 'félicitations', 'formulaires'] },
  { key: 'peintres_painters', form: 'peintres', lemma: 'peintre', partOfSpeech: 'noun masculine plural', meaning: 'painters; visual artists', note: 'The narrator addresses sculptors and painters about the giant’s proportions; neither means house decorators in this context.',
    q13: ['Les peintres appliquent des couleurs sur leurs toiles.', 'painters', 'sculptors', 'writers', 'sailors'],
    q45: ['Ces ___ appliquent de la peinture sur les toiles de l’atelier.', 'peintres', 'sculpteurs', 'écrivains', 'musiciens'],
    q68: ['Les peintres travaillent sur les toiles ; les sculpteurs taillent la pierre, les écrivains rédigent des livres et les musiciens jouent du piano.', 'Quel mot désigne les artistes des toiles ?', 'peintres', 'sculpteurs', 'écrivains', 'musiciens'] }
];
const used = new Set(previous.flatMap(item => item.sourceOccurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
const items = records.map(record => {
  const row = gap.forms.find(candidate => candidate.form === record.form);
  if (!row || row.candidateIdentities.length || record.q13.length !== 5 || record.q45.length !== 5 || record.q68.length !== 6) throw Error(`Unreviewed candidate or question shape: ${record.key}`);
  const occurrences = plan.units.flatMap(unit => tokenizeFrench(unit.text)
    .filter(token => token.normalized === record.form && (!record.senseRole || ((unit.chapter === 1 && unit.ordinal === 9) === (record.senseRole === 'mathematical'))))
    .map(token => ({ chapter: unit.chapter, unit: unit.ordinal, start: token.start, end: token.end, text: unit.text.slice(token.start, token.end) })));
  if (occurrences.length !== (record.expected ?? row.count) || !occurrences.some(occ => occ.chapter === 1)) throw Error(`Incomplete chapter/workwide occurrence coverage: ${record.key}`);
  for (const occ of occurrences) {
    const key = `${occ.unit}:${occ.start}:${occ.end}`;
    if (used.has(key)) throw Error(`Occurrence overlap: ${record.key} ${key}`);
    used.add(key);
  }
  const [context13, ...choices13] = record.q13;
  const [context45, ...choices45] = record.q45;
  const [context68, question68, ...choices68] = record.q68;
  if (!context13.toLocaleLowerCase('fr').includes(occurrences[0].text.toLocaleLowerCase('fr')) || !context45.includes('___') || !choices45.includes(occurrences[0].text)) throw Error(`Target mismatch: ${record.key}`);
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
  note: 'Ten contextual surface-and-sense candidates, including a mathematical versus doctrinal assertion split for propositions. All occurrences are explicitly assigned and questions are author-drafted; final identity, expression and question signoff is pending.', items };
writeFileSync(resolve(root, 'chapter-01-batch-04.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
