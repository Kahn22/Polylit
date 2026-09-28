import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const specs = [
  {
    from: 'srf_sur:sns_sur_primary',
    corrected: { id: 'sns_sur_primary', lemmaId: 'lem_sur', gloss: 'on; onto; upon; based on', definition: 'Marque un contact ou une position sur une surface, ou un appui matériel ou figuré.' },
    retainedReason: 'The remaining twenty-eight uses locate something on or onto a surface or rest a claim or action upon a basis: on a tree/table/robe/quay, a suspicion on Dreyfus, a sentence based on evidence, or a burden upon the council. The original physical-on questions remain a valid instance of this relation.',
    branches: [
      { ids: ['occ_zola_4adcf03ec8b0c66c1fe2313b', 'occ_zola_5c263f73be731c944621da02', 'occ_zola_98c9b2eaf1cb4264da57114a', 'occ_cendrillon_95ac119a7525edb78b8e0776'],
        sense: { id: 'sns_fr_sur_about_topic', lemmaId: 'lem_sur', gloss: 'about; concerning', definition: 'Introduit le sujet d’une loi, d’un propos ou d’un récit.' },
        reason: 'The law concerns the press, Zola asks for truth about the trial and conviction, and the moral comments on the tale; these four sur tokens introduce a topic rather than a surface.',
        questions: [
          { context: 'Le journal publie un article sur le procès.', choices: 'about; concerning|under|behind|without' },
          { context: 'Un ouvrage _____ la condamnation de Dreyfus paraîtra demain.', choices: 'sur|sous|vers|entre' },
          { context: 'La chroniqueuse écrit sur le procès devant le tribunal.', prompt: 'Quelle préposition introduit le sujet du texte ?', choices: 'sur|chroniqueuse|procès|tribunal' },
        ] },
      { ids: ['occ_cendrillon_66420e33789039b3227bcb08'],
        target: {
          lemma: { id: 'lem_fr_sur_toutes_choses', headword: 'sur toutes choses', partOfSpeech: 'expression' },
          surface: { id: 'srf_fr_sur_toutes_choses_sur', lemmaId: 'lem_fr_sur_toutes_choses', form: 'sur', normalized: 'sur' },
          sense: { id: 'sns_fr_sur_toutes_choses_above_all', lemmaId: 'lem_fr_sur_toutes_choses', gloss: 'above all; especially', definition: 'Ancienne locution signifiant avant toute autre chose.' },
        }, reason: 'The godmother’s warning « sur toutes choses, de ne pas passer minuit » means above all or especially, not physical location or subject matter.',
        questions: [
          { context: 'Sur toutes choses, respecte l’heure fixée pour rentrer.', choices: 'above all; especially|on top of objects|because of|afterward' },
          { context: '_____ toutes choses, n’oublie pas de rentrer avant minuit.', choices: 'sur|dans|entre|par' },
          { context: 'Sa marraine lui rappela, sur toutes choses, de ne pas dépasser minuit.', prompt: 'Quel mot ouvre la locution signifiant « avant tout » ?', choices: 'sur|marraine|choses|minuit' },
        ] },
    ],
  },
  {
    from: 'srf_par:sns_par_primary',
    corrected: { id: 'sns_par_primary', lemmaId: 'lem_par', gloss: 'by; through; via; because of; per', definition: 'Introduit un agent, un moyen, une cause, un passage ou une répartition.' },
    retainedReason: 'The other thirty-seven uses introduce an agent, means, cause, route, or unit: tempted by the smell, by order or patriotism, written by a person, affected by warmth or fear, and hour by hour. The original by-agent questions remain accurate for a central use.',
    branches: [
      { ids: ['occ_loup_agneau_269204ff5687dc0b53a3ca13', 'occ_parure_238183973e1b337139208f0c'],
        target: {
          lemma: { id: 'lem_fr_par_consequent', headword: 'par conséquent', partOfSpeech: 'expression' },
          surface: { id: 'srf_fr_par_consequent_par', lemmaId: 'lem_fr_par_consequent', form: 'par', normalized: 'par' },
          sense: { id: 'sns_fr_par_consequent_therefore', lemmaId: 'lem_fr_par_consequent', gloss: 'therefore; consequently', definition: 'Locution qui présente une conséquence de ce qui précède.' },
        }, reason: 'In the fable’s reasoning and Mathilde’s explanation, par conséquent is the logical connector therefore, not an agentive or causal by.',
        questions: [
          { context: 'Je n’ai pas de robe convenable ; par conséquent, je ne peux aller à la fête.', choices: 'therefore; consequently|however|meanwhile|by someone' },
          { context: 'Elle n’a pas de robe ; _____ conséquent, elle refuse l’invitation.', choices: 'par|sur|de|en' },
          { context: 'Il n’a pas les vêtements nécessaires ; par conséquent, il restera chez lui.', prompt: 'Quel mot appartient au lien logique « donc » ?', choices: 'par|vêtements|conséquent|restera' },
        ] },
      { ids: ['occ_zola_04bccbcf12d5eed3653442d3', 'occ_zola_85d6fde67cb9bca947a60ad0'],
        target: {
          lemma: { id: 'lem_fr_finir_par', headword: 'finir par', partOfSpeech: 'expression' },
          surface: { id: 'srf_fr_finir_par_par', lemmaId: 'lem_fr_finir_par', form: 'par', normalized: 'par' },
          sense: { id: 'sns_fr_finir_par_eventually', lemmaId: 'lem_fr_finir_par', gloss: 'eventually; end up doing', definition: 'Dans finir par suivi d’un infinitif, indique le résultat atteint après un temps ou une suite d’actions.' },
        }, reason: '« finira par éprouver » and « finissent par se convaincre » express an eventual outcome rather than means, cause or agent.',
        questions: [
          { context: 'Après plusieurs débats, ils finissent par se convaincre.', choices: 'eventually; end up doing|through a person|at the start|without trying' },
          { context: 'Il finira _____ éprouver un remords après cette affaire.', choices: 'par|sur|de|sans' },
          { context: 'Après de longues recherches, ils finissent par se convaincre de son innocence.', prompt: 'Quelle préposition appartient à la tournure indiquant un résultat final ?', choices: 'par|recherches|convaincre|innocence' },
        ] },
      { ids: ['occ_parure_d91cb9c034d5466b67f9576f'],
        target: {
          lemma: { id: 'lem_fr_par_la_place', headword: 'par là', partOfSpeech: 'expression' },
          surface: { id: 'srf_fr_par_la_place_par', lemmaId: 'lem_fr_par_la_place', form: 'par', normalized: 'par' },
          sense: { id: 'sns_fr_par_la_around_there', lemmaId: 'lem_fr_par_la_place', gloss: 'around there; in that area', definition: 'Dans par là, indique un lieu approximatif ou les environs.' },
        }, reason: 'The men went to Nanterre to hunt larks « par là », meaning around that area, not by a person or through an instrument.',
        questions: [
          { context: 'Ils allaient chasser du côté de Nanterre, par là, le dimanche.', choices: 'around there; in that area|because of this|by an agent|after that' },
          { context: 'Ils allaient chasser près de Nanterre, _____ là.', choices: 'par|sur|de|avec' },
          { context: 'Quelques amis allaient tirer des alouettes par là, du côté de Nanterre.', prompt: 'Quelle préposition appartient à la locution désignant les environs ?', choices: 'par|amis|alouettes|Nanterre' },
        ] },
    ],
  },
];
const publication = loadPublication(), subjects = editorialSubjects(publication);
const snapshotEntries = [], planEntries = [];
for (const spec of specs) {
  const subject = subjects.find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === spec.from);
  if (!subject) throw Error(`Missing ${spec.from}`);
  const { lemma, surface, sense, occurrences } = subject.value;
  const moved = spec.branches.flatMap(b => b.ids);
  if (new Set(moved).size !== moved.length || moved.some(id => !occurrences.some(o => o.id === id))) throw Error(`Unexpected source use ${spec.from}`);
  snapshotEntries.push({ identity: spec.from, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences });
  const retained = occurrences.filter(o => !moved.includes(o.id)).map(o => o.id);
  planEntries.push({ from: spec.from, occurrenceIds: retained, target: { lemma, surface, sense: spec.corrected }, metadataCorrection: true, reason: spec.retainedReason, questions: [null, null, null] });
  for (const branch of spec.branches) planEntries.push({ from: spec.from, occurrenceIds: branch.ids, target: branch.target ?? { lemma, surface, sense: branch.sense }, reason: branch.reason, questions: branch.questions });
}
const folder = resolve('content/editorial/quiz-review');
const snapshot = 'fr-sur-par-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: snapshotEntries }, null, 2) + '\n');
const plan = { version: 1, id: 'fr-sur-par-semantic-2026-09-25', snapshot, language: 'fr', entries: planEntries };
writeFileSync(resolve(folder, 'fr-sur-par-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ sourceIdentities: specs.length, movedOccurrences: specs.flatMap(s => s.branches.flatMap(b => b.ids)).length }));
