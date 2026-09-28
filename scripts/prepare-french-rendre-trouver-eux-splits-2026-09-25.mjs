import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const specs = [
  {
    identity: 'srf_parure_rendre_lem_zola_rendre_506e242df3:sns_parure_rendre_remettre_une_chose_entre_les_mains_de_celui_a_qui_elle_appartient_de_quelque_maniere_qu_on_l_ait_eue_2b7ef09520',
    moved: ['occ_cendrillon_81e0596097eb120c9f6d284f'],
    sense: { id: 'sns_loup_agneau_rendre_fait_devenir_ou_met_dans_un_certain_etat_dcec08f1b7', lemmaId: 'lem_zola_rendre', gloss: 'makes', definition: 'fait devenir ou met dans un certain état' },
    reason: 'In « pour leur rendre la taille plus menuë », rendre means make their waists slimmer. The two La Parure occurrences mean return borrowed jewelry.',
    questions: [
      { context: 'On serra les lacets pour leur rendre la taille plus menuë.', choices: 'make; cause to become|give back|sell|borrow' },
      { context: 'On serra les lacets pour leur _____ la taille plus menuë.', choices: 'rendre|donner|prendre|cacher' },
      { context: 'On rompit plus de douze lacets à force de les serrer pour leur rendre la taille plus menuë.', prompt: 'Quel verbe signifie faire devenir la taille plus fine ?', choices: 'rendre|rompit|lacets|serrer' },
    ],
  },
  {
    identity: 'srf_parure_trouver_lem_zola_trouver_75d0160413:sns_parure_trouver_rencontrer_la_personne_ou_la_chose_que_l_on_cherche_26ab9fa323',
    moved: ['occ_cendrillon_afb9769504e295351ffa3b23', 'occ_parure_c9219ab48203ec3ee1aa91fd'],
    sense: { id: 'sns_fr_aller_trouver_see_person', lemmaId: 'lem_zola_trouver', gloss: 'go see; seek out', definition: 'Dans « aller trouver quelqu’un », se rendre auprès de cette personne pour lui parler.' },
    reason: '« alla trouver sa Maraine » and « Va trouver ton amie » mean go see the person, unlike the pumpkin occurrence that means find a thing.',
    questions: [
      { context: 'Dés qu’elle fut arrivée, elle alla trouver sa Maraine pour la remercier.', choices: 'go see; seek out|discover a lost object|forget|avoid' },
      { context: 'Va _____ ton amie Mme Forestier et demande-lui de te prêter des bijoux.', choices: 'trouver|quitter|perdre|cacher' },
      { context: 'Va trouver ton amie Mme Forestier et demande-lui de te prêter des bijoux.', prompt: 'Quel verbe, avec « va », signifie aller voir son amie ?', choices: 'trouver|demande|prêter|bijoux' },
    ],
  },
  {
    identity: 'srf_zola_eux_memes_9137724deb62_eux:sns_zola_eux_them',
    moved: ['occ_zola_90acc4af5c8da1f2f373f501'],
    sense: { id: 'sns_fr_eux_memes_themselves', lemmaId: 'lem_zola_eux', gloss: 'themselves', definition: 'Forme pronominale intensive : les personnes mentionnées agissent elles-mêmes.' },
    reason: '« ses supérieurs ... instruisaient eux-mêmes son procès » emphasizes that the superiors did it themselves; the bare eux sense is them.',
    questions: [
      { context: 'Ses supérieurs instruisaient eux-mêmes son procès.', choices: 'themselves|them|one another|someone else' },
      { context: 'Ses supérieurs instruisaient _____ son procès.', choices: 'eux-mêmes|eux|elle-même|lui-même' },
      { context: 'Ses supérieurs le faisaient couvrir de boue, instruisaient eux-mêmes son procès, de la façon la plus inattendue.', prompt: 'Quel pronom souligne que les supérieurs instruisaient personnellement le procès ?', choices: 'eux-mêmes|supérieurs|boue|procès' },
    ],
  },
];
const subjects = editorialSubjects(publication);
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
const snapshot = 'fr-rendre-trouver-eux-splits-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: snapshotEntries }, null, 2) + '\n');
const plan = { version: 1, id: 'fr-rendre-trouver-eux-splits-2026-09-25', snapshot, language: 'fr', entries: planEntries };
writeFileSync(resolve(folder, 'fr-rendre-trouver-eux-splits-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ identities: specs.length, moved: specs.flatMap(s => s.moved).length }));
