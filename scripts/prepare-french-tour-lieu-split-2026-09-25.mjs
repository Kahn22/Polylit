import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const specs = [
  {
    id: 'srf_zola_tour_tour:sns_zola_tour_turn',
    moved: 'occ_parure_1026152b866014ca721da6d3',
    target: {
      lemma: { id: 'lem_zola_tour', headword: 'tour', partOfSpeech: 'noun' },
      surface: { id: 'srf_zola_tour_tour', lemmaId: 'lem_zola_tour', form: 'tour', normalized: 'tour' },
      sense: { id: 'sns_fr_tour_stroll', lemmaId: 'lem_zola_tour', gloss: 'walk; stroll', definition: 'Promenade, notamment dans l’expression « faire un tour ».' },
    },
    reason: 'In « faire un tour aux Champs-Élysées », tour means a walk. The other occurrence, « à son tour », retains the established turn sense.',
    questions: [
      { context: 'Elle était allée faire un tour aux Champs-Élysées pour se délasser.', choices: 'walk; stroll|argument|meal|purchase' },
      { context: 'Elle était allée faire un _____ aux Champs-Élysées pour se délasser.', choices: 'tour|discours|repas|cadeau' },
      { context: 'Un dimanche, elle était allée faire un tour aux Champs-Élysées pour se délasser des besognes de la semaine.', prompt: 'Quel mot désigne ici une promenade ?', choices: 'tour|dimanche|semaine|besognes' },
    ],
  },
  {
    id: 'srf_zola_lieu_avoir_lieu:sns_zola_avoir_lieu_happen',
    moved: 'occ_parure_b73bb190783193f01e8fd68b',
    target: {
      lemma: { id: 'lem_fr_au_lieu_de', headword: 'au lieu de', partOfSpeech: 'expression' },
      surface: { id: 'srf_fr_lieu_au_lieu_de', lemmaId: 'lem_fr_au_lieu_de', form: 'lieu', normalized: 'lieu' },
      sense: { id: 'sns_fr_au_lieu_de_instead', lemmaId: 'lem_fr_au_lieu_de', gloss: 'instead of', definition: 'À la place de, dans l’expression « au lieu de ».' },
    },
    reason: '« Au lieu d’être ravie » expresses substitution, not an event taking place. The five occurrences of « avoir lieu » retain the established event sense.',
    questions: [
      { context: 'Au lieu d’être ravie, elle jeta avec dépit l’invitation sur la table.', choices: 'instead of|because of|in spite of|at the moment of' },
      { context: 'Au _____ d’être ravie, elle jeta avec dépit l’invitation sur la table.', choices: 'lieu|moment|temps|point' },
      { context: 'Au lieu d’être ravie, comme l’espérait son mari, elle jeta avec dépit l’invitation sur la table.', prompt: 'Quel mot appartient à l’expression signifiant « à la place de » ?', choices: 'lieu|mari|invitation|table' },
    ],
  },
];
const subjects = editorialSubjects(publication);
const entries = [], planEntries = [];
for (const spec of specs) {
  const subject = subjects.find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === spec.id);
  if (!subject || subject.value.occurrences.length < 2 || !subject.value.occurrences.some(o => o.id === spec.moved)) throw Error(`Unexpected source ${spec.id}`);
  const { lemma, surface, sense, occurrences } = subject.value;
  entries.push({ identity: spec.id, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences });
  planEntries.push({ from: spec.id, occurrenceIds: occurrences.filter(o => o.id !== spec.moved).map(o => o.id), reason: spec.reason, questions: [null, null, null] });
  planEntries.push({ from: spec.id, occurrenceIds: [spec.moved], target: spec.target, reason: spec.reason, questions: spec.questions });
}
const folder = resolve('content/editorial/quiz-review');
const snapshot = 'fr-tour-lieu-split-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries }, null, 2) + '\n');
const plan = { version: 1, id: 'fr-tour-lieu-split-2026-09-25', snapshot, language: 'fr', entries: planEntries };
writeFileSync(resolve(folder, 'fr-tour-lieu-split-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ snapshot, identities: entries.length, reassignedOccurrences: specs.length }));
