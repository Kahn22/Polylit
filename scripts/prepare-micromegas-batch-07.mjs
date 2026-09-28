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
const previous = [1, 2, 3, 4, 5, 6].flatMap(n => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-0${n}.json`))).items);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'composa_wrote_book', form: 'composa', lemma: 'composer', partOfSpeech: 'verb past historic third singular', meaning: 'composed; wrote a book', note: 'After studying insects, Micromégas wrote a book about them; not the unrelated arrangement of an object.',
    q13: ['Le savant composa un livre sur ses découvertes.', 'wrote', 'sold', 'burned', 'hid'],
    q45: ['Après ses recherches, elle ___ un ouvrage où elle expliqua ses découvertes.', 'composa', 'détruisit', 'dissimula', 'vendit'],
    q68: ['Elle composa un livre pour exposer ses recherches. Son éditeur le vendit ; un lecteur le cacha, puis un autre le prêta.', 'Quel verbe signifie qu’elle écrivit le livre ?', 'composa', 'vendit', 'cacha', 'prêta'] },
  { key: 'affaires_troubles', form: 'affaires', lemma: 'affaire', partOfSpeech: 'noun feminine plural', meaning: 'troubles; legal difficulties', note: '« Un livre qui lui fit quelques affaires » means it brought trouble, specifically a prosecution, not commercial business or belongings. Académie française 1762: https://www.dictionnaire-academie.fr/article/A4A0409.',
    q13: ['Ce livre lui fit quelques affaires auprès des autorités : il eut un procès.', 'troubles', 'profits', 'presents', 'holidays'],
    q45: ['Dans cette vieille tournure, son livre lui fit quelques ___ : les autorités le poursuivirent.', 'affaires', 'recettes', 'vacances', 'faveurs'],
    q68: ['Le livre lui fit des affaires : il eut des ennuis devant la justice. Il ne reçut ni faveurs ni recettes ; ses vacances furent annulées.', 'Quel mot désigne ici ses démêlés avec la justice ?', 'affaires', 'faveurs', 'recettes', 'vacances'] },
  { key: 'poursuivit_prosecuted', form: 'poursuivit', lemma: 'poursuivre', partOfSpeech: 'verb past historic third singular', meaning: 'prosecuted; pursued legal action against', note: 'The mufti actively pursued a case against the author for alleged heresy; not simply followed him in space.',
    q13: ['Le censeur poursuivit le savant devant le tribunal.', 'prosecuted', 'congratulated', 'guided', 'ignored'],
    q45: ['À cause du livre, le censeur ___ son auteur devant le tribunal.', 'poursuivit', 'félicita', 'invita', 'oublia'],
    q68: ['Le censeur poursuivit l’auteur devant le tribunal. Un ami le félicita, un autre l’invita chez lui, et le secrétaire oublia son nom.', 'Quel verbe décrit l’action judiciaire du censeur ?', 'poursuivit', 'félicita', 'invita', 'oublia'] },
  { key: 'defendit_self_in_case', form: 'défendit', lemma: 'se défendre', partOfSpeech: 'verb pronominal past historic third singular', meaning: 'defended himself against an accusation', note: 'The pronominal form describes Micromégas’s answer to the case; compare existing lem_zola_defendre / sns_fr_defendre_protect and sns_zola_defendre_protect before linking or separating the shared sense.',
    q13: ['Accusé devant le tribunal, il se défendit avec des arguments.', 'defended himself', 'confessed', 'fled', 'applauded'],
    q45: ['Au procès, il se ___ avec des arguments contre l’accusation.', 'défendit', 'félicita', 'cacha', 'présenta'],
    q68: ['Accusé, il se défendit devant les juges. Son ami le félicita, le témoin se cacha et le greffier se présenta à la porte.', 'Quel verbe indique sa réponse à l’accusation ?', 'défendit', 'félicita', 'cacha', 'présenta'] },
  { key: 'afflige_distressed', form: 'affligé', lemma: 'affliger', partOfSpeech: 'past participle masculine singular', meaning: 'distressed; saddened', note: 'He was only slightly troubled by exile from a petty court; médiocrement modifies the degree of distress, not the fact of banishment.',
    q13: ['Après cette mauvaise nouvelle, il se sentit affligé.', 'distressed', 'delighted', 'rested', 'amused'],
    q45: ['Malgré son exil, il paraissait seulement un peu ___.', 'affligé', 'réjoui', 'amusé', 'rassuré'],
    q68: ['Il était médiocrement affligé par son exil : sa peine était légère. Son frère, au contraire, était réjoui ; leur ami était amusé et le témoin rassuré.', 'Quel mot décrit sa peine légère ?', 'affligé', 'réjoui', 'amusé', 'rassuré'] },
  { key: 'banni_exiled', form: 'banni', lemma: 'bannir', partOfSpeech: 'past participle masculine singular', meaning: 'banished; expelled from a court or place', note: 'The author must stay away from the court for eight hundred years, despite being only slightly distressed about it.',
    q13: ['Le savant fut banni de la cour et ne put plus y revenir.', 'banished', 'welcomed', 'crowned', 'invited'],
    q45: ['Interdit de séjour à la cour, il en fut ___ pour de longues années.', 'banni', 'accueilli', 'invité', 'nommé'],
    q68: ['Le savant fut banni et dut quitter la cour. Son collègue fut accueilli, un artiste invité et un juge nommé.', 'Quel mot indique son exclusion de la cour ?', 'banni', 'accueilli', 'invité', 'nommé'] },
  { key: 'equipages_travel_conveyances', form: 'équipages', lemma: 'équipage', partOfSpeech: 'noun masculine plural', meaning: 'means of transport; traveling conveyances', note: 'The narrator contrasts human carriages with extraordinary celestial travel arrangements, not a ship’s crew. Historical vehicle and entourage senses: https://www.dictionnaire-academie.fr/article/A3E0977.',
    q13: ['Ces équipages transportent les voyageurs à travers le pays.', 'traveling conveyances', 'ship crews', 'maps', 'cities'],
    q45: ['Ces ___ permettent aux voyageurs de passer d’une planète à l’autre.', 'équipages', 'bagages', 'paysages', 'villages'],
    q68: ['Les équipages emportent les voyageurs sur la route. Les bagages sont leurs valises ; les paysages défilent et les villages marquent les étapes.', 'Quel mot désigne ici les moyens de voyager ?', 'équipages', 'bagages', 'paysages', 'villages'] },
  { key: 'usages_customs', form: 'usages', lemma: 'usage', partOfSpeech: 'noun masculine plural', meaning: 'customs; habitual ways', note: 'The narrator says humans imagine only what fits their own familiar practices, not technical uses of an object.',
    q13: ['Les usages de ce pays étonnent les visiteurs.', 'customs', 'buildings', 'rivers', 'tickets'],
    q45: ['Les habitudes transmises dans cette communauté sont ses ___.', 'usages', 'bâtiments', 'voyages', 'outils'],
    q68: ['Les usages sont les habitudes du pays. Ses bâtiments bordent les routes, ses outils servent au travail et ses voyages mènent ailleurs.', 'Quel mot nomme les pratiques habituelles ?', 'usages', 'bâtiments', 'outils', 'voyages'] },
  { key: 'petitesses_petty_behavior', form: 'petitesses', lemma: 'petitesse', partOfSpeech: 'noun feminine plural', meaning: 'pettiness; petty actions', note: 'The court is full of trivial meanness, a criticism of character rather than of physical size. Académie française: https://www.dictionnaire-academie.fr/article/A5P0941.',
    q13: ['Ses petitesses se voient dans ses querelles sur des détails sans importance.', 'pettiness', 'kindness', 'bravery', 'honesty'],
    q45: ['Ces querelles mesquines et inutiles sont des ___ qui fatiguent toute la cour.', 'petitesses', 'gentillesses', 'victoires', 'générosités'],
    q68: ['Les petitesses de la cour sont ses querelles mesquines. Ses générosités aident les pauvres, ses victoires sont célébrées et ses gentillesses consolent.', 'Quel mot désigne les comportements mesquins ?', 'petitesses', 'générosités', 'victoires', 'gentillesses'] },
  { key: 'ordinaires_usual', form: 'ordinaires', lemma: 'ordinaire', partOfSpeech: 'adjective plural', meaning: 'usual; ordinary', note: 'Both microscopes and giant steps are compared to their familiar, normal versions. The published lemma lem_parure_ordinaire_adjective_35198f7a8a and sense sns_parure_ordinaire_commun_habituel_a8bfdb1e4d are likely reusable for a new plural surface after final review.',
    q13: ['Les pas ordinaires du voyageur sont réguliers.', 'usual', 'exceptional', 'invisible', 'broken'],
    q45: ['Ces microscopes ___ sont employés tous les jours, sans propriété spéciale.', 'ordinaires', 'exceptionnels', 'défectueux', 'nouveaux'],
    q68: ['Les microscopes ordinaires sont les appareils courants. Les exceptionnels sont rares, les défectueux sont cassés et les nouveaux viennent d’être achetés.', 'Quel adjectif signifie habituels ici ?', 'ordinaires', 'exceptionnels', 'défectueux', 'nouveaux'] }
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
  note: 'Ten more chapter I contextual sense drafts from the author’s prosecution and cosmic travel, indexed to all workwide exact-form occurrences with three authored question bands. Existing défense and ordinaire same-lemma senses need explicit shared-identity decisions; no learner import or final signoff.', items };
writeFileSync(resolve(root, 'chapter-01-batch-07.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
