import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Authored offline drafts. Every exact-form use is linked to its source unit;
// questions and identity reuse require final editorial signoff before import.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = JSON.parse(readFileSync(resolve(root, 'chapter-01-batch-01.json')));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'circonférence_perimeter', form: 'circonférence', lemma: 'circonférence', partOfSpeech: 'noun feminine singular', meaning: 'circumference', note: 'The giant’s planet and the funnel are measured around their perimeter; not an area or diameter.',
    q13: ['On mesure la circonférence du cercle avec une ficelle.', 'circumference', 'radius', 'area', 'height'],
    q45: ['La longueur mesurée tout autour du cercle est sa ___.', 'circonférence', 'surface', 'largeur', 'profondeur'],
    q68: ['La circonférence suit le bord du cercle. Le rayon va du centre au bord ; le diamètre traverse le centre.', 'Quel mot nomme la longueur du contour du cercle ?', 'circonférence', 'rayon', 'diamètre', 'centre'] },
  { key: 'diamètre_width', form: 'diamètre', lemma: 'diamètre', partOfSpeech: 'noun masculine singular', meaning: 'diameter', note: 'The width of the giant’s insect or microscope is specified across its round section.',
    q13: ['Le diamètre de cette roue est de cinquante centimètres.', 'diameter', 'circumference', 'weight', 'height'],
    q45: ['Le segment qui traverse le centre du cercle et relie deux points du bord est un ___.', 'diamètre', 'rayon', 'périmètre', 'segment'],
    q68: ['Le diamètre traverse le centre du disque d’un bord à l’autre. Le rayon part du centre et s’arrête au bord ; le contour entoure le disque.', 'Quel mot désigne ici la mesure d’un bord à l’autre en passant par le centre ?', 'diamètre', 'rayon', 'contour', 'centre'] },
  { key: 'microscopes_optical', form: 'microscopes', lemma: 'microscope', partOfSpeech: 'noun masculine plural', meaning: 'microscopes', note: 'Instruments for seeing very small things; the chapter IV description of the giants’ eyes uses the instrument metaphorically. Singular microscope awaits its own surface-form decision.',
    q13: ['Les microscopes permettent de voir de minuscules cellules.', 'microscopes', 'telescopes', 'cameras', 'clocks'],
    q45: ['Pour observer ces cellules invisibles à l’œil nu, les savants utilisent des ___.', 'microscopes', 'télescopes', 'périscopes', 'oscilloscopes'],
    q68: ['Les microscopes révèlent les cellules. Les télescopes montrent des étoiles, et les périscopes aident à regarder par-dessus un obstacle.', 'Quels instruments servent ici à observer les cellules ?', 'microscopes', 'télescopes', 'périscopes', 'étoiles'] },
  { key: 'heresie_religious', form: 'hérésie', lemma: 'hérésie', partOfSpeech: 'noun feminine singular', meaning: 'heresy', note: 'The mufti accuses Micromégas of a religiously unacceptable doctrine; distinguish the accusation from the narrator’s judgment.',
    q13: ['Le tribunal religieux accusa le savant d’hérésie.', 'heresy', 'charity', 'pilgrimage', 'prayer'],
    q45: ['Le tribunal juge cette doctrine contraire à la foi officielle et l’accuse d’___.', 'hérésie', 'ignorance', 'avarice', 'imprudence'],
    q68: ['Le juge parle d’hérésie parce que la doctrine contredit sa foi officielle. Le savant parle de recherche ; un autre témoin évoque une simple erreur de calcul.', 'Quel mot désigne la doctrine accusée de contredire une foi officielle ?', 'hérésie', 'recherche', 'erreur', 'calcul'] },
  { key: 'jurisconsultes_legal', form: 'jurisconsultes', lemma: 'jurisconsulte', partOfSpeech: 'noun masculine plural', meaning: 'legal scholars; jurists', note: 'The satire says these legal experts condemn the book without reading it; not a claim that they were judges.',
    q13: ['Les jurisconsultes donnent leur avis sur la loi.', 'legal scholars', 'astronomers', 'painters', 'farmers'],
    q45: ['Pour interpréter une loi difficile, le tribunal demande l’avis des ___.', 'jurisconsultes', 'astronomes', 'peintres', 'jardiniers'],
    q68: ['Les jurisconsultes examinent les textes de loi. Les astronomes étudient le ciel, et les médecins soignent les malades.', 'Quel mot désigne les spécialistes du droit ?', 'jurisconsultes', 'astronomes', 'médecins', 'malades'] },
  { key: 'berline_carriage', form: 'berline', lemma: 'berline', partOfSpeech: 'noun feminine singular', meaning: 'carriage; coach', note: 'Historical horse-drawn vehicle in « chaise de poste ou berline », not the modern sedan car.',
    q13: ['Dans le récit ancien, la berline avance derrière les chevaux.', 'coach', 'boat', 'cart', 'train'],
    q45: ['Au dix-huitième siècle, cette famille voyage dans une ___ fermée et confortable, tirée par des chevaux.', 'berline', 'barque', 'charrette', 'locomotive'],
    q68: ['La berline transporte des voyageurs sur la route derrière deux chevaux. Une barque descend la rivière ; un train roule sur des rails.', 'Quel mot désigne ici la voiture ancienne tirée par des chevaux ?', 'berline', 'barque', 'train', 'rivière'] },
  { key: 'toises_historical_length', form: 'toises', lemma: 'toise', partOfSpeech: 'noun feminine plural', meaning: 'toises (historical length units)', note: 'All six uses are historical lengths, including two exclamations. No single universal metric value is asserted.',
    q13: ['Dans cet ancien livre, la tour mesure cent toises.', 'toises', 'hours', 'coins', 'gallons'],
    q45: ['Le vieux géomètre décrit la hauteur de la tour en ___, une ancienne unité de longueur.', 'toises', 'heures', 'livres', 'années'],
    q68: ['Le géomètre donne la hauteur en toises et le poids en livres. Il note aussi le temps du trajet en heures et le prix en pièces.', 'Quel mot est ici une ancienne unité de longueur ?', 'toises', 'livres', 'heures', 'pièces'] },
  { key: 'secretaire_academy_official', form: 'secrétaire', lemma: 'secrétaire', partOfSpeech: 'noun masculine singular', meaning: 'secretary; official who records and conducts an academy’s business', note: 'Five uses denote the Saturnian academy secretary, one the secretary of the Paris Academy of Sciences. Not the piece of furniture or a private letter writer.',
    q13: ['Le secrétaire de l’académie rédige le compte rendu.', 'secretary', 'president', 'visitor', 'printer'],
    q45: ['À l’académie, le ___ rédige le procès-verbal de la séance.', 'secrétaire', 'président', 'visiteur', 'peintre'],
    q68: ['Le secrétaire rédige le compte rendu de la réunion ; le président la dirige, tandis que le visiteur écoute et que le peintre prépare un portrait.', 'Quel mot désigne la personne chargée ici du compte rendu ?', 'secrétaire', 'président', 'visiteur', 'peintre'] },
  { key: 'sculpteurs_artists', form: 'sculpteurs', lemma: 'sculpteur', partOfSpeech: 'noun masculine plural', meaning: 'sculptors', note: 'The narrator appeals to sculptors alongside painters to imagine the giant’s proportions.',
    q13: ['Les sculpteurs taillent des figures dans la pierre.', 'sculptors', 'painters', 'sailors', 'writers'],
    q45: ['Pour façonner ces statues dans la pierre, les ___ utilisent des ciseaux.', 'sculpteurs', 'peintres', 'marins', 'écrivains'],
    q68: ['Les sculpteurs taillent des statues en pierre ; les peintres travaillent sur une toile, et les écrivains composent des récits.', 'Quel mot désigne les artistes qui taillent les statues ?', 'sculpteurs', 'peintres', 'écrivains', 'statues'] },
  { key: 'voyageur_traveler', form: 'voyageur', lemma: 'voyageur', partOfSpeech: 'noun masculine singular', meaning: 'traveler', note: 'All five singular uses denote a person traveling, often Micromégas; do not merge the narrator’s generic plural voyageurs without reviewing its surface form.',
    q13: ['Le voyageur arrive dans une ville inconnue.', 'traveler', 'farmer', 'merchant', 'soldier'],
    q45: ['Celui qui entreprend un long voyage est un ___.', 'voyageur', 'fermier', 'marchand', 'soldat'],
    q68: ['Le voyageur traverse les montagnes et rejoint le marchand au marché. Le fermier travaille aux champs et le soldat garde la porte.', 'Quel mot désigne celui qui parcourt les montagnes ?', 'voyageur', 'marchand', 'fermier', 'soldat'] }
];
const used = new Set(previous.items.flatMap(item => item.sourceOccurrences.map(occ => `${occ.unit}:${occ.start}:${occ.end}`)));
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
  if (!context13.includes(occurrences[0].text) || !context45.includes('___') || !choices45.includes(occurrences[0].text)) throw Error(`Target mismatch: ${record.key}`);
  if ([choices13,choices45,choices68].some(choices => new Set(choices).size !== 4) || choices68.some(choice => !context68.includes(choice))) throw Error(`Choice mismatch: ${record.key}`);
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
  note: 'Ten additional candidate surface-and-sense meanings assigned across all exact-form uses, with three individually authored question bands. Existing exact-form identity lookup returned none; final semantic, expression and question signoff remains pending.', items };
writeFileSync(resolve(root, 'chapter-01-batch-02.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
