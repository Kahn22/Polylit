import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const identity = 'srf_zola_sens_sens:sns_zola_sens_direction';
const moved = 'occ_cendrillon_987c1a0c6b227d97f009c90d';
const subject = editorialSubjects(publication).find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === identity);
if (!subject || subject.value.occurrences.length !== 2 || !subject.value.occurrences.some(o => o.id === moved)) throw Error('Sens source changed');
const { lemma, surface, sense, occurrences } = subject.value;
const snapshot = 'fr-sens-split-2026-09-25-input.json';
const folder = resolve('content/editorial/quiz-review');
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: [{ identity, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences }] }, null, 2) + '\n');
const nounLemma = { id: 'lem_zola_sens', headword: 'sens', partOfSpeech: 'noun' };
const nounSurface = { id: 'srf_zola_sens_sens', lemmaId: nounLemma.id, form: 'sens', normalized: 'sens' };
const nounSense = { id: 'sns_fr_sens_judgment', lemmaId: nounLemma.id, gloss: 'good sense; sound judgment', definition: 'Faculté de juger raisonnablement, notamment dans « du bon sens ».' };
const plan = { version: 1, id: 'fr-sens-judgment-direction-split-2026-09-25', snapshot, language: 'fr', entries: [
  { from: identity, occurrenceIds: occurrences.filter(o => o.id !== moved).map(o => o.id), reason: '« dans le sens désiré » describes the desired direction of the conclusion and retains the direction sense.', questions: [null, null, null] },
  { from: identity, occurrenceIds: [moved], target: { lemma: nounLemma, surface: nounSurface, sense: nounSense }, reason: '« du bon sens » in Cendrillon’s second moral means good judgment, not a physical or procedural direction.', questions: [
    { context: 'De la naissance, du bon sens, et d’autres semblables talens.', choices: 'good sense; sound judgment|physical direction|hearing|meaning of a word' },
    { context: 'De la naissance, du bon _____, et d’autres semblables talens.', choices: 'sens|courage|esprit|talent' },
    { context: 'D’avoir de l’esprit, du courage, de la naissance, du bon sens, et d’autres semblables talens.', prompt: 'Quel nom désigne ici le jugement raisonnable ?', choices: 'sens|esprit|courage|talens' },
  ] },
] };
writeFileSync(resolve(folder, 'fr-sens-split-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ snapshot, identities: 1, reassignedOccurrences: 1 }));
