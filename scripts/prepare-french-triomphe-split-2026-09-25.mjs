import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const id = 'srf_zola_triomphe_triomphe:sns_zola_triomphe_primary';
const subject = editorialSubjects(publication).find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === id);
if (!subject || subject.value.occurrences.length !== 4) throw new Error('Triomphe source changed');
const { lemma, surface, sense, occurrences } = subject.value;
const verbId = 'occ_zola_2a42e5aea6d2d3026d27d082';
const nounIds = occurrences.filter(o => o.id !== verbId).map(o => o.id);
if (nounIds.length !== 3 || !occurrences.some(o => o.id === verbId)) throw new Error('Unexpected occurrence assignment');
const folder = resolve('content/editorial/quiz-review');
const snapshot = 'fr-triomphe-split-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: [{ identity: id, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences }] }, null, 2) + '\n');
const verbLemma = { id: 'lem_fr_triompher_verb', headword: 'triompher', partOfSpeech: 'verb' };
const verbSurface = { id: 'srf_fr_triomphe_triompher_verb', lemmaId: verbLemma.id, form: 'triomphe', normalized: 'triomphe' };
const verbSense = { id: 'sns_fr_triompher_prevail', lemmaId: verbLemma.id, gloss: 'to triumph; prevail', definition: 'L’emporter, obtenir le dessus, notamment dans « la fripouille qui triomphe ».' };
const plan = { version: 1, id: 'fr-triomphe-noun-verb-split-2026-09-25', snapshot, language: 'fr', entries: [
  { from: id, occurrenceIds: nounIds, reason: 'Three occurrences are nouns: the solemn triumph of the Exposition, the hoped-for triumph of justice, and Mathilde’s triumph of beauty. The existing noun meaning and three questions remain valid.', questions: [null, null, null] },
  { from: id, occurrenceIds: [verbId], target: { lemma: verbLemma, surface: verbSurface, sense: verbSense }, reason: '« la fripouille qui triomphe insolemment » is a finite verb, not the noun triomphe. Give this occurrence its own verb identity, retain its occurrence ID, and start any new mastery only on viewing the unit.', questions: [
    { context: 'Voilà la fripouille qui triomphe insolemment dans la défaite du droit.', choices: 'prevails; triumphs|withdraws|hesitates|forgets' },
    { context: 'Au milieu de la défaite du droit, voilà la fripouille qui _____ insolemment.', choices: 'triomphe|recule|hésite|tombe' },
    { context: 'Voilà la fripouille qui triomphe insolemment dans la défaite du droit et de la simple probité.', prompt: 'Quel verbe indique que la fripouille l’emporte ?', choices: 'triomphe|fripouille|défaite|droit' },
  ] },
] };
writeFileSync(resolve(folder, 'fr-triomphe-split-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ snapshot, nounOccurrences: nounIds.length, verbOccurrence: verbId }));
