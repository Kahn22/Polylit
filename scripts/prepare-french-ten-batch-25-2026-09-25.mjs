import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

const publication = loadPublication();
const specs = [
  {
    from: 'srf_beau:sns_beau_primary',
    branches: [
      { ids: ['occ_cendrillon_7fadef0d7fd90dcbb4a81153'], target: {
        lemma: { id: 'lem_fr_avoir_beau_expression', headword: 'avoir beau', partOfSpeech: 'expression' },
        surface: { id: 'srf_fr_beau_avoir_beau', lemmaId: 'lem_fr_avoir_beau_expression', form: 'beau', normalized: 'beau' },
        sense: { id: 'sns_fr_avoir_beau_concessive_expression', lemmaId: 'lem_fr_avoir_beau_expression', gloss: 'however much; in vain', definition: 'Dans « avoir beau » suivi de l’infinitif, une action reste sans effet sur le résultat.' },
      }, reason: 'The moral says that however much one possesses talents, they are vain without patrons; avoir beau is a concessive expression, not a description of beauty.', questions: [
        { context: 'Mais vous aurez beau les avoir, pour vostre avancement ce seront choses vaines.', choices: 'however much; in vain|beautiful|already|from afar' },
        { context: 'Vous aurez _____ les avoir : sans parrains, ces talents resteront vains.', choices: 'beau|bel|belle|beaux' },
        { context: 'Mais vous aurez beau les avoir, pour vostre avancement ce seront choses vaines si vous n’avez des parrains ou des Maraines.', prompt: 'Quel mot appartient à la locution signifiant « malgré tous vos efforts » ?', choices: 'beau|avancement|choses|Maraines' },
      ] },
    ],
    retainedReason: 'The raven, carriage, horse and color passages describe attractive appearance; the three existing beauty questions apply to those four uses.',
  },
  {
    from: 'srf_zola_toutes_tout:sns_tout_primary',
    branches: [
      { ids: ['occ_parure_d59675e4a8da9d4d3f8c457d', 'occ_cendrillon_1b5d3fb8a04c49fd4d8f3491'], target: {
        lemma: { id: 'lem_fr_tout_pronoun', headword: 'tout', partOfSpeech: 'pronoun' },
        surface: { id: 'srf_fr_toutes_pronoun', lemmaId: 'lem_fr_tout_pronoun', form: 'toutes', normalized: 'toutes' },
        sense: { id: 'sns_fr_toutes_all_of_them', lemmaId: 'lem_fr_tout_pronoun', gloss: 'all of them (feminine plural)', definition: 'Pronom qui reprend un ensemble féminin pluriel sans nom exprimé après toutes.' },
      }, reason: '« plus jolie que toutes » and « six souris toutes en vie » use toutes independently of a following noun; the other fourteen spans determine an explicit feminine plural noun.', questions: [
        { context: 'Au bal, elle était plus jolie que toutes.', choices: 'all of them (feminine plural)|each man|none of them|one woman' },
        { context: 'Les six souris étaient _____ en vie.', choices: 'toutes|tous|toute|tout' },
        { context: 'Elle était plus jolie que toutes, élégante, gracieuse, souriante et folle de joie.', prompt: 'Quel pronom désigne toutes les autres femmes sans répéter le nom ?', choices: 'toutes|jolie|gracieuse|joie' },
      ] },
    ],
    retainedReason: 'Fourteen occurrences determine explicit feminine plural nouns, including toutes les fautes, toutes choses and toutes les personnes; the three existing questions target that determiner form.',
  },
  {
    from: 'srf_zola_bien_bien:sns_zola_bien_well',
    branches: [
      { ids: ['occ_zola_52bdf3043f03fcc8b86a8249', 'occ_zola_6562105a85029d21cedef310'], sense: { id: 'sns_fr_bien_intensifier', lemmaId: 'lem_zola_bien', gloss: 'very; much; many', definition: 'Renforce le degré, l’intensité ou la quantité, notamment devant un adjectif ou avec des.' }, reason: '« bien haut » and « bien obligés » intensify the following word rather than describing how well an action is done.', questions: [
        { context: 'Ce qu’il faut affirmer bien haut, c’est que Gonse était convaincu.', choices: 'very; emphatically|poorly|only afterward|in secret' },
        { context: 'Ils étaient _____ obligés de l’acquitter, faute de preuve.', choices: 'bien|peu|mal|pas' },
        { context: 'Les généraux sont bien obligés de faire acquitter le commandant, puisqu’ils ne peuvent laisser reconnaître son innocence.', prompt: 'Quel mot renforce l’idée qu’ils sont obligés ?', choices: 'bien|généraux|commandant|innocence' },
      ] },
    ],
    retainedReason: 'The other five uses express certainty or affirmation, as in « On verra bien » and « je crois bien »; the established indeed/well sense and questions remain applicable.',
  },
  {
    from: 'srf_zola_mettre_mettre:sns_zola_mettre_place',
    branches: [
      { ids: ['occ_zola_80b6c3361167562b6d54ebbb'], sense: { id: 'sns_fr_mettre_en_flammes', lemmaId: 'lem_zola_mettre', gloss: 'to set ablaze; throw into turmoil', definition: 'Dans « mettre en flammes », enflammer ou provoquer de graves bouleversements.' }, reason: '« mettre l’Europe en flammes » predicts upheaval, not physical placement of an object.', questions: [
        { context: 'Les révélations étaient capables de mettre l’Europe en flammes.', choices: 'set ablaze; throw into turmoil|place on a shelf|tidy up|give back' },
        { context: 'Ces révélations risquaient de _____ l’Europe en flammes.', choices: 'mettre|tenir|rendre|porter' },
        { context: 'Les choses dangereuses, capables de mettre l’Europe en flammes, avaient été enterrées derrière ce huis clos.', prompt: 'Quel verbe appartient à la locution signifiant provoquer un embrasement ?', choices: 'mettre|choses|Europe|flammes' },
      ] },
      { ids: ['occ_parure_fc64544df17a76dbd2a33f9f'], sense: { id: 'sns_fr_mettre_au_net', lemmaId: 'lem_zola_mettre', gloss: 'to write up neatly; make a clean copy', definition: 'Dans « mettre au net les comptes », établir une version propre et ordonnée des comptes.' }, reason: 'Mathilde’s husband works to put accounts into a clean final form; mettre au net is a distinct accounting or copying expression.', questions: [
        { context: 'Le mari travaillait le soir à mettre au net les comptes d’un commerçant.', choices: 'write up neatly; make a clean copy|set on fire|hide|lend' },
        { context: 'Il passait ses soirées à _____ au net les comptes.', choices: 'mettre|voir|tenir|prendre' },
        { context: 'Le mari travaillait, le soir, à mettre au net les comptes d’un commerçant, et la nuit il faisait de la copie.', prompt: 'Quel verbe appartient à l’expression signifiant établir des comptes propres ?', choices: 'mettre|comptes|commerçant|copie' },
      ] },
    ],
    retainedReason: 'The two other occurrences put a garment on the body or place oneself near the fireplace, which fit the ordinary put/place meaning and its questions.',
  },
  {
    from: 'srf_zola_autres_autre:sns_zola_autre_adjective',
    branches: [
      { ids: ['occ_zola_bdbc1668e3640e43dbe6f9e2', 'occ_zola_dfaf928132a64fd82d9791ca', 'occ_parure_dbd10734cd111bc5a7d806fc', 'occ_cendrillon_b009be49f7ba5df25f3b99a0'], target: {
        lemma: { id: 'lem_fr_autre_pronoun', headword: 'autre', partOfSpeech: 'pronoun' },
        surface: { id: 'srf_fr_autres_pronoun', lemmaId: 'lem_fr_autre_pronoun', form: 'autres', normalized: 'autres' },
        sense: { id: 'sns_fr_autres_others', lemmaId: 'lem_fr_autre_pronoun', gloss: 'others; the other ones', definition: 'Désigne d’autres personnes ou choses sans répéter leur nom.' },
      }, reason: '« les autres », « d’autres » and « tous les autres » stand for people or items without a following noun; the four remaining autres modify an explicit noun.', questions: [
        { context: 'Il a pris à sa charge le crime des autres.', choices: 'others; the other ones|the same people|everyone|nobody' },
        { context: 'Il fallait payer des billets, en renouveler d’_____.', choices: 'autres|anciens|utiles|amples' },
        { context: 'En renouvelant d’autres billets chaque mois, il obtint un peu de temps pour rembourser sa dette.', prompt: 'Quel pronom désigne ici des billets supplémentaires ?', choices: 'autres|billets|mois|temps' },
      ] },
    ],
    retainedReason: 'The other four occurrences explicitly modify occasions, men, women or talents, and the existing other-adjective questions fit each use.',
  },
  {
    from: 'srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary',
    branches: [
      { ids: ['occ_zola_7db9219cdab0e8be4185211b', 'occ_zola_7f57294f369691d6a38f5f84'], target: {
        lemma: { id: 'lem_zola_avoir_lieu', headword: 'avoir lieu', partOfSpeech: 'expression' },
        surface: { id: 'srf_fr_avoir_avoir_lieu', lemmaId: 'lem_zola_avoir_lieu', form: 'avoir', normalized: 'avoir' },
        sense: { id: 'sns_zola_avoir_lieu_happen', lemmaId: 'lem_zola_avoir_lieu', gloss: 'to take place; happen', definition: 'se produire ou se dérouler à un moment ou dans un cadre donné' },
      }, reason: 'The duel and an inner collapse « vont/doivent avoir lieu »: the whole expression means take place, not possess something.', questions: [
        { context: 'Dès lors, le duel va avoir lieu entre les deux lieutenants-colonels.', choices: 'take place; happen|possess|borrow|remember' },
        { context: 'Le duel va _____ lieu entre les deux hommes.', choices: 'avoir|faire|prendre|donner' },
        { context: 'Dès lors, le duel va avoir lieu entre le lieutenant-colonel Picquart et le lieutenant-colonel du Paty de Clam.', prompt: 'Quel verbe appartient à l’expression signifiant se dérouler ?', choices: 'avoir|duel|Picquart|Clam' },
      ] },
      { ids: ['occ_parure_baa151f8b17e15dc81bdb226'], target: {
        lemma: { id: 'lem_fr_avoir_l_air', headword: 'avoir l’air', partOfSpeech: 'expression' },
        surface: { id: 'srf_fr_avoir_avoir_l_air', lemmaId: 'lem_fr_avoir_l_air', form: 'avoir', normalized: 'avoir' },
        sense: { id: 'sns_fr_avoir_l_air_seem', lemmaId: 'lem_fr_avoir_l_air', gloss: 'to look; seem', definition: 'Dans « avoir l’air » suivi d’un adjectif, donner l’impression d’être ainsi.' },
      }, reason: '« avoir l’air pauvre » means appear poor, distinct from possession or auxiliary avoir.', questions: [
        { context: 'Elle trouvait humiliant d’avoir l’air pauvre au milieu de femmes riches.', choices: 'look; seem|possess|become wealthy|borrow' },
        { context: 'Elle craignait d’_____ l’air pauvre au milieu des femmes riches.', choices: 'avoir|être|faire|voir' },
        { context: 'Il n’y a rien de plus humiliant que d’avoir l’air pauvre au milieu de femmes riches.', prompt: 'Quel verbe appartient à l’expression signifiant paraître pauvre ?', choices: 'avoir|humiliant|pauvre|femmes' },
      ] },
      { ids: ['occ_zola_b3eb097738faae8aab58d49e'], target: {
        lemma: { id: 'lem_fr_y_avoir_existential', headword: 'y avoir', partOfSpeech: 'expression' },
        surface: { id: 'srf_fr_avoir_y_avoir', lemmaId: 'lem_fr_y_avoir_existential', form: 'avoir', normalized: 'avoir' },
        sense: { id: 'sns_fr_y_avoir_exist', lemmaId: 'lem_fr_y_avoir_existential', gloss: 'there to be; to occur', definition: 'Dans « il y avoir », marque l’existence ou la survenue de quelque chose.' },
      }, reason: '« Il dut y avoir là une minute psychologique » means there must have been such a moment, not that someone owned it.', questions: [
        { context: 'Il pouvait y avoir une minute d’hésitation avant que le conseil ne tranche.', choices: 'there to be; to occur|possess|take away|remember' },
        { context: 'Il dut y _____ là une minute d’angoisse.', choices: 'avoir|être|faire|aller' },
        { context: 'Il dut y avoir un instant d’angoisse avant la décision du conseil.', prompt: 'Quel verbe appartient à la tournure marquant l’existence de cet instant ?', choices: 'avoir|instant|angoisse|conseil' },
      ] },
    ],
    retainedReason: 'The remaining avoir uses express possession, having a quality, or auxiliary avoir; the existing questions use its infinitive possession sense.',
  },
];
const rewrite = {
  from: 'srf_zola_beau_beau:sns_zola_beau_beautiful',
  reason: 'The sole beau passage describes a “fine result” ironically: the honest Picquart will be punished. The existing questions about a pretty garden tested only literal beauty, so these three questions now test the ironic favorable adjective in context while preserving the already broad beautiful/fine sense.',
  questions: [
    { context: 'Le beau résultat de cette affaire, c’est que l’homme honnête sera puni.', choices: 'fine; splendid (said ironically)|ugly|ordinary|secret' },
    { context: 'Quel _____ résultat : Picquart a fait son devoir et sera pourtant puni !', choices: 'beau|bel|belle|beaux' },
    { context: 'Et le beau résultat de cette situation prodigieuse, c’est que l’honnête homme, le lieutenant-colonel Picquart, va être la victime.', prompt: 'Quel adjectif qualifie ironiquement ce résultat ?', choices: 'beau|résultat|Picquart|victime' },
  ],
};
const subjects = editorialSubjects(publication);
const snapshotEntries = [], planEntries = [];
for (const spec of specs) {
  const subject = subjects.find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === spec.from);
  if (!subject) throw Error(`Missing ${spec.from}`);
  const { lemma, surface, sense, occurrences } = subject.value;
  const moved = spec.branches.flatMap(b => b.ids);
  if (new Set(moved).size !== moved.length || moved.some(id => !occurrences.some(o => o.id === id))) throw Error(`Unexpected occurrence ${spec.from}`);
  snapshotEntries.push({ identity: spec.from, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences });
  const retained = occurrences.filter(o => !moved.includes(o.id)).map(o => o.id);
  if (retained.length) planEntries.push({ from: spec.from, occurrenceIds: retained, reason: spec.retainedReason, questions: [null, null, null] });
  for (const branch of spec.branches) planEntries.push({ from: spec.from, occurrenceIds: branch.ids, target: branch.target ?? { lemma, surface, sense: branch.sense }, reason: branch.reason, questions: branch.questions });
}
const subject = subjects.find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === rewrite.from);
if (!subject || subject.value.occurrences.length !== 1) throw Error('Beau rewrite input changed');
const { lemma, surface, sense, occurrences } = subject.value;
snapshotEntries.push({ identity: rewrite.from, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences });
planEntries.push({ from: rewrite.from, occurrenceIds: occurrences.map(o => o.id), reason: rewrite.reason, questions: rewrite.questions });
const folder = resolve('content/editorial/quiz-review');
const snapshot = 'fr-ten-batch-25-2026-09-25-input.json';
writeFileSync(resolve(folder, snapshot), JSON.stringify({ version: 1, language: 'fr', entries: snapshotEntries }, null, 2) + '\n');
const plan = { version: 1, id: 'fr-ten-batch-25-semantic-2026-09-25', snapshot, language: 'fr', entries: planEntries };
writeFileSync(resolve(folder, 'fr-ten-batch-25-2026-09-25.mjs'), `export default ${JSON.stringify(plan, null, 2)};\n`);
console.log(JSON.stringify({ sourceIdentities: specs.length + 1, movedOccurrences: specs.flatMap(s => s.branches.flatMap(b => b.ids)).length }));
