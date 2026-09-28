import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const specs = [
  {
    identity: 'srf_zola_doute_doute_noun:sns_zola_doute_uncertainty',
    moved: ['occ_zola_08fc2bd3bcc72fe38ee8d4f0', 'occ_zola_cb070a368046b7a1edeced1a', 'occ_zola_fc4a4cac019748a7ff2a73e6'],
    sense: { id: 'sns_fr_sans_doute_probably', lemmaId: 'lem_zola_doute_noun', gloss: 'probably; no doubt', definition: 'Dans « sans doute », marque une forte probabilité ou une supposition.' },
    reason: 'The three « sans doute » spans signal a probable explanation. The remaining « mettre en doute » span expresses uncertainty about the bordereau and retains the noun doubt sense.',
    questions: [
      { context: 'L’un sans doute par passion cléricale, l’autre peut-être par cet esprit de corps.', choices: 'probably; no doubt|never|by accident|in secret' },
      { context: 'L’un sans _____ par passion cléricale, l’autre peut-être par esprit de corps.', choices: 'doute|preuve|risque|moyen' },
      { context: 'Il n’osa pas, dans la terreur sans doute de l’opinion publique, certainement aussi dans la crainte de livrer tout l’état-major.', prompt: 'Quel mot appartient à l’expression indiquant ici une supposition probable ?', choices: 'doute|terreur|opinion|crainte' },
    ],
  },
  {
    identity: 'srf_zola_mets_mettre:sns_zola_mettre_place',
    moved: ['occ_zola_daaef0aaa304204fd32277a7'],
    sense: { id: 'sns_fr_se_mettre_sous_le_coup_liability', lemmaId: 'lem_zola_mettre', gloss: 'to become subject to; expose oneself to', definition: 'Dans « se mettre sous le coup de la loi », se placer en situation d’être poursuivi selon ces dispositions.' },
    reason: '« Je me mets sous le coup des articles 30 et 31 » means that Zola exposes himself to the cited legal provisions, rather than physically putting an object somewhere.',
    questions: [
      { context: 'En portant ces accusations, je me mets sous le coup des articles de la loi sur la presse.', choices: 'become subject to legal provisions|place a physical object|forget|escape' },
      { context: 'En portant ces accusations, je me _____ sous le coup de la loi.', choices: 'mets|tiens|cache|repose' },
      { context: 'En portant ces accusations, je n’ignore pas que je me mets sous le coup des articles 30 et 31 de la loi sur la presse.', prompt: 'Quel verbe exprime le fait de s’exposer à ces dispositions ?', choices: 'mets|portant|ignore|articles' },
    ],
  },
  {
    identity: 'srf_zola_en_en:sns_zola_en_gerund',
    moved: ['occ_zola_ac01976d7c7f77e2e889be4c'],
    sense: { id: 'sns_fr_en_repeated_progression', lemmaId: 'lem_zola_en', gloss: 'to; progressively, in a repeated comparison', definition: 'Dans « de plus loin en plus loin », marque le passage progressif d’un degré au suivant.' },
    reason: '« de plus loin en plus loin » expresses progression toward increasing distance; the fourteen other en occurrences precede a present participle in a gerund construction.',
    questions: [
      { context: 'On le déplaçait de plus loin en plus loin.', choices: 'to progressively greater distance|while traveling|at once|back home' },
      { context: 'On l’éloigna de plus loin _____ plus loin.', choices: 'en|de|sur|par' },
      { context: 'On l’éloigna de plus loin en plus loin.', prompt: 'Quel mot relie les deux degrés de distance dans cette progression ?', choices: 'en|éloigna|plus|loin' },
    ],
  },
];
const publication = loadPublication(), subjects = editorialSubjects(publication);
const snapshotEntries = [], planEntries = [];
for (const spec of specs) {
  const subject = subjects.find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === spec.identity);
  if (!subject || spec.moved.some(id => !subject.value.occurrences.some(o => o.id === id))) throw Error(`Unexpected source ${spec.identity}`);
  const { lemma, surface, sense, occurrences } = subject.value;
  snapshotEntries.push({ identity: spec.identity, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences });
  const retained = occurrences.filter(o => !spec.moved.includes(o.id)).map(o => o.id);
  if (retained.length) planEntries.push({ from: spec.identity, occurrenceIds: retained, reason: spec.reason, questions: [null, null, null] });
  planEntries.push({ from: spec.identity, occurrenceIds: spec.moved, target: { lemma, surface, sense: spec.sense }, reason: spec.reason, questions: spec.questions });
}
const folder = resolve('content/editorial/quiz-review');
const snapshot = 'fr-ten-batch-24-splits-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: snapshotEntries }, null, 2) + '\n');
const plan = { version: 1, id: 'fr-ten-batch-24-splits-2026-09-25', snapshot, language: 'fr', entries: planEntries };
writeFileSync(resolve(folder, 'fr-ten-batch-24-splits-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ sourceIdentities: specs.length, movedOccurrences: specs.flatMap(s => s.moved).length }));
