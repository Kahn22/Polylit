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
const previous = [1, 2, 3, 4, 5].flatMap(n => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-0${n}.json`))).items);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'dissequa_anatomical', form: 'disséqua', lemma: 'disséquer', partOfSpeech: 'verb past historic third singular', meaning: 'dissected; cut open for anatomical study', note: 'Micromégas anatomically examines small creatures, not merely reading about or sketching them.',
    q13: ['Le savant disséqua un insecte pour en étudier le corps.', 'dissected', 'painted', 'fed', 'released'],
    q45: ['Pour étudier ses organes internes, le chercheur ___ un insecte.', 'disséqua', 'dessina', 'nourrit', 'photographia'],
    q68: ['Il disséqua l’insecte pour voir ses organes ; son collègue dessina son extérieur, puis photographia les résultats et classa ses notes.', 'Quel verbe indique qu’il ouvrit le corps pour l’examiner ?', 'disséqua', 'dessina', 'photographia', 'classa'] },
  { key: 'derobent_escape_observation', form: 'dérobent', lemma: 'se dérober', partOfSpeech: 'verb pronominal present third plural', meaning: 'elude; escape observation', note: 'With se and aux microscopes, the tiny organisms cannot be seen with ordinary microscopes; this is neither stealing nor deliberately hiding.',
    q13: ['Ces êtres minuscules se dérobent à nos regards.', 'escape notice', 'steal', 'shout', 'grow'],
    q45: ['Trop petits pour être vus, ces organismes se ___ aux regards.', 'dérobent', 'montrent', 'révèlent', 'présentent'],
    q68: ['Les insectes se dérobent aux regards : on ne les voit pas. Les autres se montrent, se présentent et se révèlent au microscope.', 'Quel verbe indique qu’ils échappent à l’observation ?', 'dérobent', 'montrent', 'présentent', 'révèlent'] },
  { key: 'vetillard_petifogging', form: 'vétillard', lemma: 'vétillard', partOfSpeech: 'adjective masculine singular', meaning: 'petty and fault-finding over trifles', note: 'Historical pejorative directed at the mufti for quibbling over insignificant matters; see CNRTL https://www.cnrtl.fr/definition/v%C3%A9tillard.',
    q13: ['Ce censeur vétillard fait une querelle de chaque détail insignifiant.', 'petty and fault-finding', 'generous', 'careless', 'cheerful'],
    q45: ['Il cherche querelle pour chaque détail sans importance : ce censeur est ___.', 'vétillard', 'indulgent', 'distrait', 'généreux'],
    q68: ['Le censeur vétillard conteste chaque minuscule détail. Son collègue indulgent pardonne les erreurs ; un autre est distrait et un dernier généreux.', 'Quel adjectif décrit celui qui chicane sur des riens ?', 'vétillard', 'indulgent', 'distrait', 'généreux'] },
  { key: 'suspectes_dubious', form: 'suspectes', lemma: 'suspect', partOfSpeech: 'adjective feminine plural', meaning: 'suspect; viewed with mistrust', note: 'The religious authority deems the propositions suspect; this is an accusation, not confirmation that they are false or criminal.',
    q13: ['Le censeur juge ces propositions suspectes et demande un examen.', 'suspicious', 'certain', 'harmless', 'clear'],
    q45: ['Le censeur doute de ces thèses et les juge ___, sans avoir prouvé son accusation.', 'suspectes', 'évidentes', 'innocentes', 'certaines'],
    q68: ['Le censeur trouve ces idées suspectes et demande une enquête. Les autres les trouvent évidentes, certaines ou innocentes.', 'Quel adjectif indique la méfiance du censeur ?', 'suspectes', 'évidentes', 'certaines', 'innocentes'] },
  { key: 'malsonnantes_doctrinal_offense', form: 'malsonnantes', lemma: 'malsonnant', partOfSpeech: 'adjective feminine plural', meaning: 'offensive to accepted religious doctrine', note: 'In the eighteenth-century theological formula propositions malsonnantes, an accusation that the words offend doctrine; not merely bad sounding or poorly written. Académie française 1762 https://www.dictionnaire-academie.fr/article/A4M0210.',
    q13: ['Le tribunal religieux qualifie ces thèses de malsonnantes.', 'offensive to doctrine', 'musical', 'mathematical', 'silent'],
    q45: ['Aux yeux du censeur, ces propositions choquent la doctrine admise : elles sont ___.', 'malsonnantes', 'conformes', 'banales', 'lisibles'],
    q68: ['Pour le censeur, les propositions malsonnantes choquent la doctrine. D’autres textes sont conformes à la doctrine, banals ou seulement lisibles.', 'Quel adjectif exprime l’accusation de choquer la doctrine ?', 'malsonnantes', 'conformes', 'banals', 'lisibles'] },
  { key: 'temeraires_doctrinal_reckless', form: 'téméraires', lemma: 'téméraire', partOfSpeech: 'adjective feminine plural', meaning: 'rashly bold in doctrine', note: 'Historical theological censure for propositions judged too daring and capable of implying false doctrine; Académie française 1762 https://www.dictionnaire-academie.fr/article/A4T0225.',
    q13: ['Le censeur juge ces thèses téméraires parce qu’elles vont trop loin.', 'rashly bold', 'careful', 'modest', 'ordinary'],
    q45: ['Selon ce juge, ces thèses vont trop loin sans prudence : elles sont ___.', 'téméraires', 'prudentes', 'banales', 'mesurées'],
    q68: ['Le juge qualifie de téméraires ces idées trop hardies. D’autres thèses sont prudentes, banales ou mesurées.', 'Quel adjectif décrit l’audace excessive dénoncée par le juge ?', 'téméraires', 'prudentes', 'banales', 'mesurées'] },
  { key: 'heretiques_against_doctrine', form: 'hérétiques', lemma: 'hérétique', partOfSpeech: 'adjective feminine plural', meaning: 'heretical; judged contrary to religious doctrine', note: 'The mufti accuses the propositions of heresy; that label belongs to the accuser, not to the narrator’s endorsement.',
    q13: ['Le tribunal dit que ces doctrines hérétiques contredisent sa foi.', 'heretical', 'officially accepted', 'scientific', 'ancient'],
    q45: ['Le censeur accuse ces propositions de contredire la foi officielle : il les dit ___.', 'hérétiques', 'orthodoxes', 'inoffensives', 'anciennes'],
    q68: ['Le juge appelle hérétiques les thèses qu’il croit contraires à sa foi. Les autres thèses sont orthodoxes, anciennes ou inoffensives.', 'Quel adjectif désigne ici les thèses accusées de contredire la foi ?', 'hérétiques', 'orthodoxes', 'anciennes', 'inoffensives'] },
  { key: 'puces_fleas', form: 'puces', lemma: 'puce', partOfSpeech: 'noun feminine plural', meaning: 'fleas; small jumping insects', note: 'The philosophical dispute absurdly concerns Sirius’s fleas; do not read as computer chips.',
    q13: ['Les puces sautent sur le pelage de l’animal.', 'fleas', 'birds', 'shells', 'stones'],
    q45: ['Ces petits parasites sans ailes sautent dans le pelage : ce sont des ___.', 'puces', 'chenilles', 'limaces', 'abeilles'],
    q68: ['Les puces sont de petits parasites qui sautent. Les chenilles rampent, les abeilles volent et les limaces glissent.', 'Quel mot désigne les parasites sauteurs ?', 'puces', 'chenilles', 'abeilles', 'limaces'] },
  { key: 'colimacons_snails', form: 'colimaçons', lemma: 'colimaçon', partOfSpeech: 'noun masculine plural', meaning: 'snails', note: 'Snails compared with the imagined fleas of Sirius; zoological meaning, not a spiral staircase.',
    q13: ['Les colimaçons avancent lentement avec leur coquille.', 'snails', 'butterflies', 'fish', 'birds'],
    q45: ['Ces animaux rampent et portent une coquille en spirale : ce sont des ___.', 'colimaçons', 'papillons', 'scarabées', 'criquets'],
    q68: ['Les colimaçons rampent avec leur coquille en spirale. Les papillons et les criquets ont des ailes ; les scarabées ont une carapace.', 'Quel mot désigne les animaux à coquille en spirale ?', 'colimaçons', 'papillons', 'criquets', 'scarabées'] },
  { key: 'condamner_official_censure', form: 'condamner', lemma: 'condamner', partOfSpeech: 'verb infinitive', meaning: 'officially condemn or censure a work', note: 'The mufti has legal scholars condemn a book without reading it; do not conflate the book’s censure with sentencing its author.',
    q13: ['Les autorités décidèrent de condamner ce livre et d’en interdire la diffusion.', 'condemn', 'print', 'translate', 'read'],
    q45: ['Le tribunal va ___ ce livre et en interdire la circulation.', 'condamner', 'publier', 'traduire', 'diffuser'],
    q68: ['Le tribunal veut condamner le livre et l’interdire. L’éditeur veut le publier, le traducteur va le traduire, et le libraire souhaite le diffuser.', 'Quel verbe marque la décision officielle contre le livre ?', 'condamner', 'publier', 'traduire', 'diffuser'] }
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
  note: 'Ten additional contextual sense drafts from the chapter I scientific and theological satire, with all exact-form occurrences and three authored question bands. Historical doctrinal censure meanings are recorded against contemporary dictionary evidence; all identities and questions still require final review.', items };
writeFileSync(resolve(root, 'chapter-01-batch-06.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
