import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';

// Offline source-bound drafts; editorial identity and question approval is
// separate from deterministic occurrence and choice-shape checks below.
const root = resolve('content/sources/wrk_voltaire_micromegas');
const planBytes = readFileSync(resolve(root, 'unit-plan.json'));
const plan = JSON.parse(planBytes);
const draft = readFileSync(resolve(root, 'canonical-draft.txt'));
const gap = JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const previous = [1, 2].flatMap(n => JSON.parse(readFileSync(resolve(root, `chapter-01-batch-0${n}.json`))).items);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [
  { key: 'planete_world', form: 'planète', lemma: 'planète', partOfSpeech: 'noun feminine singular', meaning: 'planet', note: 'Five workwide uses denote celestial planets; « de planète en planète » also needs separate expression triage.',
    q13: ['Une planète tourne autour de son étoile.', 'planet', 'star', 'comet', 'moon'],
    q45: ['La Terre est une ___ qui tourne autour du Soleil.', 'planète', 'étoile', 'comète', 'lune'],
    q68: ['Cette planète tourne autour de son étoile. Sa lune l’accompagne, tandis qu’une comète traverse parfois le ciel.', 'Quel mot désigne le monde en orbite autour de l’étoile ?', 'planète', 'étoile', 'lune', 'comète'] },
  { key: 'livre_book', form: 'livre', lemma: 'livre', partOfSpeech: 'noun masculine singular', meaning: 'book', note: 'All six uses denote written books, including the final entirely blank volume; distinct from the historical weight/currency unit livre.',
    q13: ['Elle ouvre le livre pour lire le premier chapitre.', 'book', 'painting', 'letter', 'map'],
    q45: ['Le bibliothécaire range sur son étagère le ___ relié qui contient tout ce roman.', 'livre', 'journal', 'carnet', 'tableau'],
    q68: ['Le livre contient un long récit réparti en chapitres ; le journal annonce les nouvelles du jour, et le tableau reste accroché au mur.', 'Quel mot désigne l’ouvrage en chapitres ?', 'livre', 'journal', 'tableau', 'mur'] },
  { key: 'hauteur_height', form: 'hauteur', lemma: 'hauteur', partOfSpeech: 'noun feminine singular', meaning: 'height', note: 'All four uses describe measured vertical extent, including the giant and a tiny Earth creature; no figurative superiority sense.',
    q13: ['La hauteur de la tour se mesure du sol au sommet.', 'height', 'width', 'weight', 'age'],
    q45: ['Du sol jusqu’au sommet, la ___ de cette tour est de vingt mètres.', 'hauteur', 'largeur', 'masse', 'durée'],
    q68: ['La hauteur de la tour se mesure du sol au sommet. Sa largeur se mesure d’un mur à l’autre, et sa masse indique son poids.', 'Quel mot désigne sa dimension verticale ?', 'hauteur', 'largeur', 'masse', 'poids'] },
  { key: 'habitant_resident', form: 'habitant', lemma: 'habitant', partOfSpeech: 'noun masculine singular', meaning: 'inhabitant; resident', note: 'All three singular uses denote someone who lives in a place; plural habitants gets a distinct surface identity in this batch but may share a sense.',
    q13: ['Un habitant de ce village connaît toutes les rues.', 'resident', 'visitor', 'traveler', 'driver'],
    q45: ['Il habite ici depuis trente ans et n’est pas de passage : c’est un ___.', 'habitant', 'invité', 'touriste', 'chauffeur'],
    q68: ['L’habitant vit dans ce village depuis longtemps ; le touriste n’y passe qu’une journée, et le chauffeur traverse la place sans s’arrêter.', 'Quel mot désigne celui qui vit ici ?', 'habitant', 'touriste', 'chauffeur', 'village'] },
  { key: 'etres_beings', form: 'êtres', lemma: 'être', partOfSpeech: 'noun masculine plural', meaning: 'beings; entities', note: 'Ten substantival uses denote beings broadly, especially living or thinking beings; the sense is not the finite verb être. Do not conflate the noun with other surface and grammar forms.',
    q13: ['Dans ce conte, d’autres êtres vivent sur les étoiles.', 'beings', 'buildings', 'numbers', 'machines'],
    q45: ['Ces ___ vivants et intelligents pensent et communiquent, même s’ils sont minuscules.', 'êtres', 'objets', 'cailloux', 'meubles'],
    q68: ['Les êtres du récit pensent et parlent. Les objets du laboratoire, comme les cailloux et les meubles, restent silencieux.', 'Quel mot nomme les personnes ou créatures qui pensent dans ce récit ?', 'êtres', 'objets', 'cailloux', 'meubles'] },
  { key: 'insectes_insects', form: 'insectes', lemma: 'insecte', partOfSpeech: 'noun masculine plural', meaning: 'insects', note: 'Chapter I uses literal tiny insects at giant scale; chapter VI likens humans to insects from the giants’ perspective. Keep the metaphor linked to the animal sense.',
    q13: ['Les insectes comme les fourmis ont six pattes.', 'insects', 'birds', 'fish', 'mammals'],
    q45: ['Les fourmis et les abeilles sont des ___ à six pattes.', 'insectes', 'oiseaux', 'poissons', 'mammifères'],
    q68: ['Les insectes du jardin comprennent les fourmis et les abeilles. Les oiseaux volent aussi, mais ont des plumes et deux pattes.', 'Quel mot désigne la famille des fourmis et des abeilles ?', 'insectes', 'oiseaux', 'fourmis', 'plumes'] },
  { key: 'etoiles_stars', form: 'étoiles', lemma: 'étoile', partOfSpeech: 'noun feminine plural', meaning: 'stars', note: 'All four plural uses denote celestial stars, including the unobservably faint ones and the theologian’s grandiose claim.',
    q13: ['Les étoiles brillent au-dessus du village.', 'stars', 'planets', 'clouds', 'mountains'],
    q45: ['Dans un ciel clair, les ___ très lointaines brillent pendant la nuit.', 'étoiles', 'planètes', 'comètes', 'lueurs'],
    q68: ['Les étoiles brillent dans le ciel nocturne. Les planètes reflètent leur lumière ; les comètes peuvent passer près du Soleil.', 'Quel mot désigne ici les astres qui produisent leur propre lumière ?', 'étoiles', 'planètes', 'comètes', 'lumière'] },
  { key: 'voyage_journey', form: 'voyage', lemma: 'voyage', partOfSpeech: 'noun masculine singular', meaning: 'journey; travel', note: 'The five singular occurrences name movement through places, including the expression « compagnon de voyage »; one trip is called philosophical but remains a journey.',
    q13: ['Le voyage entre ces deux villes a duré trois jours.', 'journey', 'meal', 'meeting', 'lesson'],
    q45: ['La traversée de la mer fut un long ___ de plusieurs semaines.', 'voyage', 'repas', 'cours', 'spectacle'],
    q68: ['Le voyage commence au port et se termine dans une autre ville. Le repas a lieu sur le navire ; le spectacle attend les passagers à l’arrivée.', 'Quel mot désigne le déplacement entre les deux lieux ?', 'voyage', 'repas', 'spectacle', 'navire'] },
  { key: 'petitesse_smallness', form: 'petitesse', lemma: 'petitesse', partOfSpeech: 'noun feminine singular', meaning: 'smallness', note: 'All three uses refer to small physical size of worlds or inhabitants, not meanness of character.',
    q13: ['La petitesse de la graine surprend l’enfant.', 'smallness', 'weight', 'color', 'warmth'],
    q45: ['Il faut une loupe pour voir cette graine : sa ___ surprend tout le monde.', 'petitesse', 'lourdeur', 'couleur', 'douceur'],
    q68: ['La petitesse de la graine oblige à prendre une loupe. Sa couleur est rouge, sa surface est lisse, et sa forme est ronde.', 'Quel mot désigne sa très faible taille ?', 'petitesse', 'couleur', 'surface', 'forme'] },
  { key: 'habitants_residents', form: 'habitants', lemma: 'habitant', partOfSpeech: 'noun masculine plural', meaning: 'inhabitants; residents', note: 'All six plural uses refer to the people or beings of a place, including the two celestial giants called « habitants célestes ». Same lemma/sense as singular habitant, but distinct mastery surface.',
    q13: ['Les habitants de cette ville connaissent la vieille place.', 'residents', 'visitors', 'drivers', 'tourists'],
    q45: ['Ces ___ vivent dans le même village depuis des années.', 'habitants', 'invités', 'chauffeurs', 'touristes'],
    q68: ['Les habitants vivent ici toute l’année. Les touristes viennent pour une semaine, tandis que les chauffeurs traversent le village.', 'Quel mot désigne les personnes qui vivent ici ?', 'habitants', 'touristes', 'chauffeurs', 'village'] }
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
  if (!context13.includes(occurrences[0].text) || !context45.includes('___') || !choices45.includes(occurrences[0].text)) throw Error(`Target mismatch: ${record.key}`);
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
  note: 'Ten additional contextual surface-and-sense drafts with workwide exact-form assignment and three individually written question bands. Singular/plural habitant share a lexical sense but retain distinct surface mastery; final editorial signoff and expression overlap review remain pending.', items };
writeFileSync(resolve(root, 'chapter-01-batch-03.json'), JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ identities: items.length, chapterOneOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.filter(o=>o.chapter===1).length,0), workwideOccurrences: items.reduce((n,x)=>n+x.sourceOccurrences.length,0), questions: items.reduce((n,x)=>n+x.questions.length,0) }));
