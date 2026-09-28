import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const specs = [
  {
    identity: 'srf_ne:sns_ne_primary',
    ids: [
      'occ_zola_1f6a51770544472f6e1affba', 'occ_zola_278e1f18f4a003a5f60adbf5',
      'occ_zola_6253acfabf851d4bf0eb56a5', 'occ_zola_6cd27a24ddca96272b32a37f',
      'occ_zola_ba1788aa5853c8341ef0ae3e', 'occ_zola_ebb494ea7e7a120c1117db79',
      'occ_parure_6fb8722ace6a117d302a0778', 'occ_cendrillon_16f1ee225e4b403a71f04675',
      'occ_cendrillon_662d4efecba1b31d449570a6', 'occ_cendrillon_7dda75ed85068d4078d37603',
    ],
    reason: 'These ten unelided ne occurrences form restrictive ne ... que, meaning only, while the other ne occurrences negate a clause with pas, point, jamais, plus, rien, or literary ne alone.',
    questions: [
      { context: 'Il ne restait qu’une seule preuve dans le dossier.', choices: 'only, in ne ... que|not at all|already|never again' },
      { context: 'Il _____ pouvait s’agir que d’un officier de troupe.', choices: 'ne|se|le|en' },
      { context: 'La vérité ne se dévoilera que lorsqu’une enquête sera menée.', prompt: 'Quel mot forme avec « que » la restriction signifiant « seulement » ?', choices: 'ne|vérité|enquête|menée' },
    ],
  },
  {
    identity: 'srf_n_elided:sns_ne_primary',
    ids: [
      'occ_68f407d6a864b78af4b1aa0a', 'occ_zola_0151e84f53f3f74b76c66c94',
      'occ_zola_1ad7d70706d8f167e8441a83', 'occ_zola_1eefd0f5b841f67b9e341635',
      'occ_zola_49f40d2ce53a7ac0fc82130e', 'occ_zola_4b0ada8ed616f513be2601a7',
      'occ_zola_548965006ba1a4c7ed2caa82', 'occ_zola_773a7538e1c3face917bdf3b',
      'occ_zola_8c9f38b4bec04baebdfa12a5', 'occ_zola_8dfede1f991873b5cb554e8c',
      'occ_zola_9bcfee0a9560b660dd438af0', 'occ_zola_fe3dcfc318e5f1bb3b2a7909',
      'occ_parure_c1eddbc9e02c9b1ddede8ad0', 'occ_cendrillon_9e2c0c7e46578a05cdbee7ea',
      'occ_cendrillon_827771ac7140750b421c08a8', 'occ_cendrillon_b1dcbb9abb9f0a6bd6782066',
      'occ_cendrillon_1ed1915ec285f4016bb40503', 'occ_cendrillon_2a62bbabb770111c3a23e1f0',
    ],
    reason: 'These eighteen elided n’ spans belong to restrictive n’ ... que, as in « n’ai qu’une passion » and « n’avait que quatre pas »; the remaining n’ spans express negation.',
    questions: [
      { context: 'Il n’y a ici qu’une seule explication.', choices: 'only, in n’ ... que|not at all|already|everywhere' },
      { context: 'Elle _____avait que quatre pas à faire.', choices: 'n’|ne|ni|non' },
      { context: 'Je n’ai qu’une passion, comprendre la vérité et la faire connaître.', prompt: 'Quel mot forme avec « que » la restriction signifiant « seulement » ?', choices: 'n’|passion|vérité|connaître' },
    ],
  },
];
const publication = loadPublication(), subjects = editorialSubjects(publication);
const snapshotEntries = [], planEntries = [];
for (const spec of specs) {
  const subject = subjects.find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === spec.identity);
  if (!subject || new Set(spec.ids).size !== spec.ids.length || spec.ids.some(id => !subject.value.occurrences.some(o => o.id === id))) throw Error(`Unexpected occurrence assignment ${spec.identity}`);
  const { lemma, surface, sense, occurrences } = subject.value;
  snapshotEntries.push({ identity: spec.identity, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences });
  planEntries.push({ from: spec.identity, occurrenceIds: occurrences.filter(o => !spec.ids.includes(o.id)).map(o => o.id), reason: spec.reason, questions: [null, null, null] });
  const restrictive = { id: 'sns_fr_ne_que_only', lemmaId: lemma.id, gloss: 'only (in ne ... que)', definition: 'Particule de la restriction ne ... que, équivalant à seulement.' };
  planEntries.push({ from: spec.identity, occurrenceIds: spec.ids, target: { lemma, surface, sense: restrictive }, reason: spec.reason, questions: spec.questions });
}
const folder = resolve('content/editorial/quiz-review');
const snapshot = 'fr-ne-restrictive-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: snapshotEntries }, null, 2) + '\n');
const plan = { version: 1, id: 'fr-ne-restrictive-split-2026-09-25', snapshot, language: 'fr', entries: planEntries };
writeFileSync(resolve(folder, 'fr-ne-restrictive-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ sourceIdentities: 2, movedOccurrences: specs.flatMap(s => s.ids).length }));
