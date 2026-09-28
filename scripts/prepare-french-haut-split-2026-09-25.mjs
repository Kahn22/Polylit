import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const identity = 'srf_zola_haut_haut_adverb:sns_zola_haut_aloud';
const moved = 'occ_cendrillon_59d84ad801dcf2315455ba0e';
const subject = editorialSubjects(publication).find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === identity);
if (!subject || subject.value.occurrences.length !== 3 || !subject.value.occurrences.some(o => o.id === moved)) throw Error('Haut source changed');
const { lemma, surface, sense, occurrences } = subject.value;
const snapshot = 'fr-haut-split-2026-09-25-input.json';
const folder = resolve('content/editorial/quiz-review');
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: [{ identity, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences }] }, null, 2) + '\n');
const nounLemma = { id: 'lem_fr_haut_noun', headword: 'haut', partOfSpeech: 'noun' };
const nounSurface = { id: 'srf_fr_haut_noun', lemmaId: nounLemma.id, form: 'haut', normalized: 'haut' };
const nounSense = { id: 'sns_fr_haut_top', lemmaId: nounLemma.id, gloss: 'top; upper part', definition: 'Partie supérieure d’un lieu ou d’un objet, notamment « au haut de la maison ».' };
const plan = { version: 1, id: 'fr-haut-noun-adverb-split-2026-09-25', snapshot, language: 'fr', entries: [
  { from: identity, occurrenceIds: occurrences.filter(o => o.id !== moved).map(o => o.id), reason: '« parlait haut » and « affirmer bien haut » use the adverb describing loud or public speech.', questions: [null, null, null] },
  { from: identity, occurrenceIds: [moved], target: { lemma: nounLemma, surface: nounSurface, sense: nounSense }, reason: '« au haut de la maison » names the top of the house, so this occurrence is a noun and cannot share the adverb study meaning.', questions: [
    { context: 'Elle couchoit tout au haut de la maison, dans un grenier.', choices: 'top; upper part|basement|entrance|courtyard' },
    { context: 'Elle couchoit tout au _____ de la maison, dans un grenier.', choices: 'haut|centre|seuil|pied' },
    { context: 'Elle couchoit tout au haut de la maison, dans un grenier, sur une méchante paillasse.', prompt: 'Quel nom désigne la partie supérieure de la maison ?', choices: 'haut|maison|grenier|paillasse' },
  ] },
] };
writeFileSync(resolve(folder, 'fr-haut-split-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ snapshot, identities: 1, reassignedOccurrences: 1 }));
