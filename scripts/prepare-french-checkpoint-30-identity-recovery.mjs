import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const directory = resolve('content/editorial/quiz-review');
const ids = [
  'srf_zola_compromis_compromettre:sns_zola_compromettre_incriminate',
  'srf_zola_belle_beau:sns_zola_beau_beautiful',
  'srf_zola_doigt_doigt:sns_zola_doigt_finger',
  'srf_zola_mes_mon:sns_zola_mon_my',
];
const subjects = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary' && subject.language === 'fr').map(subject => [subject.id, subject]));
const entries = ids.map(identity => {
  const subject = subjects.get(identity);
  if (!subject) throw new Error(`Missing review subject: ${identity}`);
  const { lemma, surface, sense, occurrences } = subject.value;
  return { identity, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences };
});
const snapshot = 'fr-checkpoint-30-identity-recovery-input.json';
writeFileSync(resolve(directory, snapshot), JSON.stringify({ version: 1, language: 'fr', entries }, null, 2) + '\n');
const byId = new Map(entries.map(entry => [entry.identity, entry]));
const compromise = byId.get(ids[0]);
const beautiful = subjects.get('srf_belle:sns_beau_primary').value;
const finger = byId.get(ids[2]);
const mine = subjects.get('srf_mon:sns_mon_primary').value;
const plan = {
  version: 1,
  id: 'fr-checkpoint-30-recovery-identities-2026-09-25',
  snapshot,
  language: 'fr',
  entries: [
    { from: ids[0], occurrenceIds: 'all', metadataCorrection: true,
      reason: 'In each of the three J’Accuse passages, compromis means implicated or entangled in wrongdoing, unlike the adjective compromettant. Corrected the learner gloss while retaining the stable meaning ID; checked the three existing questions.',
      target: { lemma: compromise.lemma, surface: compromise.surface, sense: { ...compromise.sense, gloss: 'compromised; implicated', definition: 'Mis en cause ou impliqué dans une affaire susceptible de nuire à sa réputation ou à sa défense.' } },
      questions: [null, null, null] },
    { from: ids[1], occurrenceIds: 'all',
      reason: 'The single Zola occurrence « la belle besogne » shares the ordinary beau/belle aesthetic sense with the established cross-work identity. Retain its occurrence ID and make subsequent encounters fresh on view of that unit; the three canonical questions fit.',
      target: { lemma: beautiful.lemma, surface: beautiful.surface, sense: beautiful.sense }, questions: [null, null, null] },
    { from: ids[2], occurrenceIds: 'all', metadataCorrection: true,
      reason: 'In « faire toucher du doigt comment l’erreur judiciaire a pu être possible », doigt participates in an idiom meaning to make a point concrete. Corrected the learner meaning and replaced the three invented finger-injury and jewelry contexts with contexts tied to Zola’s actual explanation.',
      target: { lemma: finger.lemma, surface: finger.surface, sense: { ...finger.sense, gloss: 'finger; directly, concretely (in toucher du doigt)', definition: 'Partie de la main ; dans « faire toucher du doigt », faire saisir directement et concrètement une idée ou une preuve.' } },
      questions: [
        { context: 'Je voudrais faire toucher du doigt comment l’erreur judiciaire a pu être possible.', choices: 'directly, concretely (in the phrase)|secretly|accidentally|from far away' },
        { context: 'Zola veut faire toucher du _____ les machinations qui ont rendu possible l’erreur judiciaire.', choices: 'doigt|coude|genou|poignet' },
        { context: 'Je voudrais faire toucher du doigt les machinations qui ont rendu possible l’erreur judiciaire.', prompt: 'Quel mot complète l’expression qui rend cette démonstration concrète ?', choices: 'doigt|toucher|erreur|possible' },
      ] },
    { from: ids[3], occurrenceIds: 'all',
      reason: '« mes vilains habits » in Cendrillon and « Mes nuits » in J’Accuse are the same first-person plural possessive determiner. Merge the two occurrence IDs into the shared mon/my lemma and sense, adding the mes form; retain history without transferring mastery.',
      target: { lemma: mine.lemma, surface: { id: 'srf_fr_mes_mon_determiner', lemmaId: mine.lemma.id, form: 'mes', normalized: 'mes' }, sense: mine.sense },
      questions: [
        { context: 'Mes nuits seraient hantées par le spectre de l’innocent.', choices: 'my|your|his|their' },
        { context: 'Est-ce que j’irai comme cela, avec _____ vilains habits ?', choices: 'mes|tes|ses|nos' },
        { context: 'Est-ce que j’irai comme cela, avec mes vilains habits ? Sa marraine la touche avec sa baguette.', prompt: 'Quel mot rattache les habits à la personne qui pose la question ?', choices: 'mes|habits|marraine|baguette' },
      ] },
  ],
};
writeFileSync(resolve(directory, 'fr-checkpoint-30-identity-recovery.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ snapshot, plan: 'fr-checkpoint-30-identity-recovery.mjs', sourceIdentities: ids.length }));
