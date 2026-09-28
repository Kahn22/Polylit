import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Contextual drafts only. This script checks source offsets and quiz shape,
// but it cannot approve a sense or a learner question.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = Array.from({ length: 9 }, (_, i) => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-${String(i + 1).padStart(2, '0')}.json`))).items).flat();
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'etats_territories', form: 'états', lemma: 'état', partOfSpeech: 'noun masculine plural', meaning: 'states; territories governed by rulers', note: 'The small German and Italian rulers’ States are political territories, distinct from conditions or physical states; the capital É belongs to the printed proper political designation, not a separate lexical sense.',
    q13: ['Les États de ces souverains sont très petits.', 'political territories', 'paintings', 'ships', 'tools'],
    q45: ['Ces souverains gouvernent plusieurs territoires : leurs ___ sont voisins.', 'États', 'tableaux', 'navires', 'outils'],
    q68: ['Les États du souverain sont les territoires qu’il gouverne. Ses tableaux sont exposés, ses navires voyagent et ses outils restent dans l’atelier.', 'Quel nom désigne les territoires gouvernés ?', 'États', 'tableaux', 'navires', 'outils'] },
  { key: 'souverains_rulers', form: 'souverains', lemma: 'souverain', partOfSpeech: 'noun masculine plural', meaning: 'rulers; sovereigns', note: 'Political rulers of small German or Italian states, not an adjective meaning independent.',
    q13: ['Les souverains règnent sur leurs petits États.', 'rulers', 'painters', 'sailors', 'students'],
    q45: ['Ces rois dirigent chacun leur territoire : ce sont des ___.', 'souverains', 'peintres', 'marins', 'étudiants'],
    q68: ['Les souverains gouvernent leurs territoires. Les peintres dessinent des portraits, les marins naviguent et les étudiants lisent leurs cours.', 'Quel nom désigne ceux qui gouvernent ?', 'souverains', 'peintres', 'marins', 'étudiants'] },
  { key: 'compares_placed_side_by_side', form: 'comparés', lemma: 'comparer', partOfSpeech: 'past participle masculine plural', meaning: 'compared; considered side by side', note: 'The small states are measured against a vast empire to show scale, not judged equally valuable.',
    q13: ['Les petits États sont comparés à un grand empire.', 'compared', 'destroyed', 'forgotten', 'hidden'],
    q45: ['Pour mesurer leur différence de taille, les deux États sont ___.', 'comparés', 'détruits', 'oubliés', 'cachés'],
    q68: ['Ces territoires sont comparés pour évaluer leur taille. D’autres sont détruits par la guerre, oubliés des cartes ou cachés aux voyageurs.', 'Quel mot indique qu’on examine les deux ensemble ?', 'comparés', 'détruits', 'oubliés', 'cachés'] },
  { key: 'empire_large_realm', form: 'empire', lemma: 'empire', partOfSpeech: 'noun masculine singular', meaning: 'empire; vast state under one ruler', note: 'The Turkish, Muscovite and Chinese territories provide the contrast in size with minor European rulers’ states; this is a political realm.',
    q13: ['Le petit État est comparé à un vaste empire.', 'empire', 'village', 'garden', 'boat'],
    q45: ['Un empereur gouverne cet immense territoire : c’est un ___.', 'empire', 'village', 'jardin', 'navire'],
    q68: ['L’empire réunit de vastes territoires sous un souverain. Le village n’a que quelques maisons, le jardin contient des fleurs et le navire traverse la mer.', 'Quel nom désigne le vaste ensemble politique ?', 'empire', 'village', 'jardin', 'navire'] },
  { key: 'image_representation', form: 'image', lemma: 'image', partOfSpeech: 'noun feminine singular', meaning: 'image; representation or illustration', note: 'A weak image is an imperfect illustration of the immense differences in nature, not a literal photograph.',
    q13: ['Cette comparaison n’est qu’une faible image de ces différences.', 'illustration', 'cause', 'duration', 'command'],
    q45: ['Cette comparaison représente imparfaitement l’idée : elle en donne une faible ___.', 'image', 'cause', 'durée', 'consigne'],
    q68: ['L’image illustre imparfaitement le phénomène. Sa cause explique son origine, sa durée indique le temps écoulé et la consigne donne un ordre.', 'Quel nom désigne une représentation ?', 'image', 'cause', 'durée', 'consigne'] },
  { key: 'prodigieuses_immense', form: 'prodigieuses', lemma: 'prodigieux', partOfSpeech: 'adjective feminine plural', meaning: 'astonishingly large; extraordinary', note: 'Describes the vast differences among beings, rather than a supernatural claim. The feminine plural agrees with différences.',
    q13: ['La nature présente des différences prodigieuses entre ces êtres.', 'astonishingly great', 'tiny', 'ordinary', 'invisible'],
    q45: ['Ces différences dépassent tout ce qu’on imaginait : elles sont ___.', 'prodigieuses', 'minuscules', 'banales', 'ordinaires'],
    q68: ['Les différences prodigieuses sont immenses. Les différences minuscules sont petites, les différences banales sont communes et les différences ordinaires ne surprennent pas.', 'Quel adjectif indique un écart étonnamment grand ?', 'prodigieuses', 'minuscules', 'banales', 'ordinaires'] },
  { key: 'ceinture_waist_belt', form: 'ceinture', lemma: 'ceinture', partOfSpeech: 'noun feminine singular', meaning: 'belt; object worn around the waist', note: 'The giant’s ceinture is a belt measured around his body in the geometrical joke; no implied planetary belt.',
    q13: ['La ceinture du géant entoure sa taille.', 'belt', 'hat', 'shoe', 'glove'],
    q45: ['Autour de sa taille, il porte une ___ de cuir.', 'ceinture', 'montre', 'botte', 'lampe'],
    q68: ['Il serre sa ceinture autour de sa taille. Il lit l’heure sur sa montre, met sa botte au pied et allume sa lampe.', 'Quel nom désigne l’objet qu’il porte à la taille ?', 'ceinture', 'montre', 'botte', 'lampe'] },
  { key: 'septieme_seventh', form: 'septième', lemma: 'septième', partOfSpeech: 'fractional adjective feminine singular', meaning: 'one seventh; the seventh part', note: 'In la septième partie de la hauteur, the face measures one of seven equal portions of the body height; this describes a fraction of a whole, not a position in a sequence.',
    q13: ['Son visage mesure la septième partie de sa hauteur totale.', 'one seventh of the whole', 'the seventh item in a series', 'one half of the whole', 'seven whole units'],
    q45: ['Si une hauteur est divisée en sept parts égales, chaque part est la ___ partie.', 'septième', 'sixième', 'huitième', 'dixième'],
    q68: ['La septième partie d’une hauteur est une part sur sept. La sixième est une part sur six, la huitième une sur huit et la dixième une sur dix.', 'Quelle partie représente une part sur sept ?', 'septième', 'sixième', 'huitième', 'dixième'] },
  { key: 'demontrer_prove', form: 'démontrer', lemma: 'démontrer', partOfSpeech: 'verb infinitive', meaning: 'to prove by reasoning', note: 'Ce qui était à démontrer closes an ironically elaborate geometrical proof; it does not mean merely to display an object.',
    q13: ['Voilà ce qu’il fallait démontrer par le calcul.', 'prove', 'erase', 'forget', 'hide'],
    q45: ['Avec un raisonnement rigoureux, il veut ___ ce théorème.', 'démontrer', 'contester', 'oublier', 'effacer'],
    q68: ['Elle veut démontrer son résultat avec une preuve. Son collègue veut le contester, un autre risque de l’oublier et le dernier veut l’effacer du tableau.', 'Quel verbe signifie prouver par un raisonnement ?', 'démontrer', 'contester', 'oublier', 'effacer'] },
  { key: 'coutume_custom', form: 'coutume', lemma: 'coutume', partOfSpeech: 'noun feminine singular', meaning: 'custom; established practice', note: 'Étudier au collège at that age follows the Sirius society’s established custom, not a personal promise or a written law.',
    q13: ['Selon la coutume, les jeunes gens vont au collège à cet âge.', 'custom', 'mistake', 'promise', 'answer'],
    q45: ['Cette habitude transmise depuis longtemps est une ___ locale.', 'coutume', 'promesse', 'erreur', 'réponse'],
    q68: ['La coutume est une habitude partagée depuis longtemps. Une promesse engage quelqu’un, une erreur est une faute et une réponse vient après une question.', 'Quel nom désigne une habitude collective ?', 'coutume', 'promesse', 'erreur', 'réponse'] }
];

const occupied = new Set(previous.flatMap(item => item.sourceOccurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
const items = records.map(record => {
  const occurrences = plan.units.flatMap(unit => tokenizeFrench(unit.text).filter(token => token.text.toLocaleLowerCase('fr') === record.form).map(token => ({ chapter: unit.chapter, unit: unit.ordinal, start: token.start, end: token.end, text: token.text })));
  if (!occurrences.some(occ => occ.chapter === 1) || occurrences.length !== gap.forms.find(row => row.form === record.form)?.count) throw Error(`Workwide form mismatch: ${record.key}`);
  for (const occ of occurrences) {
    const key = `${occ.unit}:${occ.start}:${occ.end}`;
    if (occupied.has(key)) throw Error(`Occurrence overlap: ${key}`);
    occupied.add(key);
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
const output = { version: 1, workId: 'wrk_voltaire_micromegas', chapter: 1, status: 'offline_editorial_draft_unpublished', sourceSha256: sha(draft), unitPlanSha256: sha(planBytes), note: 'Ten chapter I political comparison, scale and schooling meanings with exact-form uses throughout the work and three authored question bands. No learner import or final sense/question signoff.', items };
writeFileSync(resolve(root, 'chapter-01-batch-10.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
