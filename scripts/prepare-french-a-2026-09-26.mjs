import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

// The word token remains anchored to its original span even when it is taught
// through a fixed expression. Every reassignment below was checked in context.
const branches = [
  ['a_peu_pres', 'à peu près', 'approximately; more or less', 'Locution d’approximation.', ['occ_d318556891862c9ecb3fd5d3'], 'Il a raconté à peu près la même histoire.', ['raconté','histoire','même']],
  ['a_jeun', 'à jeun', 'on an empty stomach', 'Sans avoir mangé.', ['occ_loup_agneau_98c95ce2dcf002f5ac292a8d'], 'Le voyageur part à jeun ce matin.', ['voyageur','part','matin']],
  ['a_l_etourdie', 'à l’étourdie', 'heedlessly; rashly', 'Sans réflexion ou prudence.', ['occ_lion_rat_9d2c9cac5faf9e8a440631b2'], 'Le rat sort à l’étourdie de son abri.', ['rat','sort','abri']],
  ['a_cause_de', 'à cause de', 'because of; on account of', 'Introduit la cause.', ['occ_parure_12ea6f7273907293793b2a67','occ_cendrillon_60c4a6805d0d35d91382ce08'], 'Elle est partie à cause de cette dispute.', ['Elle','partie','dispute']],
  ['tout_a_coup', 'tout à coup', 'suddenly; all at once', 'Indique un événement soudain.', ['occ_parure_1dbd063375d22ee959bd3037','occ_parure_52b21e656fb2d283f37d03f0'], 'Tout à coup, elle découvre le bijou.', ['Tout','découvre','bijou']],
  ['peu_a_peu', 'peu à peu', 'gradually; little by little', 'Indique une progression graduelle.', ['occ_zola_6be9fc8e394a43138c87eaa9','occ_zola_911987fe0abf9e8e6ff19d49'], 'Peu à peu, sa confiance revient.', ['Peu','confiance','revient']],
  ['a_moins_que', 'à moins que', 'unless', 'Introduit une exception conditionnelle.', ['occ_zola_7b14dcdd91c77c37e893a212'], 'Il viendra à moins que la pluie ne tombe.', ['viendra','pluie','tombe']],
  ['a_force_de', 'à force de', 'by dint of; through repeated effort', 'Indique un résultat obtenu par une action intense ou répétée.', ['occ_cendrillon_1915d75b33036811be4e16f3'], 'Elle réussit à force de patience et de travail.', ['réussit','patience','travail']],
  ['a_bas', 'à bas', 'down; to the ground', 'Dans jeter à bas, signifie renverser.', ['occ_zola_992ee17261079fd468187000'], 'Il veut jeter à bas cette vieille clôture.', ['jeter','vieille','clôture']],
  ['a_jamais', 'à jamais', 'forever; for all time', 'Indique une durée sans fin.', ['occ_zola_ae5db86c1358fc370ea45a8b'], 'Cette décision restera à jamais dans les mémoires.', ['décision','restera','mémoires']],
  ['a_pied', 'à pied', 'on foot', 'Indique un déplacement en marchant.', ['occ_parure_99c756fd9177b9f2aa4d54b0'], 'Nous rentrons à pied après le bal.', ['rentrons','après','bal']],
  ['a_moitie', 'à moitié', 'half; halfway; partly', 'Indique qu’une action ou un état est partiel.', ['occ_parure_ea9eef88fcc9c8a184f0c2c2'], 'Son mari est à moitié habillé ce soir.', ['mari','habillé','soir']],
  ['a_la_fin', 'à la fin', 'in the end; finally', 'Indique le terme d’une action ou d’une attente.', ['occ_3de7cf9e228aafe0f30e1f78'], 'À la fin, le coureur atteint le but.', ['coureur','atteint','but']],
  ['a_son_tour', 'à son tour', 'in turn; in his or her turn', 'Indique qu’une personne accomplit ensuite une action semblable.', ['occ_zola_5b2255f11ee92957c3e41c45'], 'Le témoin répond à son tour au juge.', ['témoin','répond','juge']],
  ['a_point', 'à point', 'at the right moment; in time', 'Dans partir à point, signifie au moment opportun.', ['occ_8ff86f039bf2305054ce8f06'], 'Il faut partir à point pour finir la course.', ['partir','finir','course']],
  ['a_tout_heure', 'à tout l’heure', 'in a moment; soon', 'Indique un moment prochain.', ['occ_loup_agneau_423e70a68bdc062cb99f9914'], 'Je te montrerai à tout l’heure la preuve.', ['montrerai','preuve','tout']],
  ['a_aucun_prix', 'à aucun prix', 'at no price; under no circumstances', 'Marque un refus absolu.', ['occ_zola_5f69c5d12f65e4955389e331'], 'Le directeur ne signerait à aucun prix cette proposition.', ['directeur','signerait','proposition']],
  ['a_son_de_trompe', 'à son de trompe', 'by public proclamation; with a trumpet call', 'Annonce faite publiquement au son d’une trompe.', ['occ_cendrillon_2b9c9b32eaa175f7e72a409b'], 'Le messager annonce à son de trompe la nouvelle.', ['messager','annonce','nouvelle']],
  ['a_grande_eau', 'à grande eau', 'with plenty of water; thoroughly', 'Indique un lavage avec beaucoup d’eau.', ['occ_parure_59047881db85fa8277250971'], 'Elle lave à grande eau les planchers.', ['lave','planchers','grande']],
  ['sou_a_sou', 'sou à sou', 'penny by penny; one coin at a time', 'Indique une dépense ou une épargne minutieuse, sou par sou.', ['occ_parure_0009c457b3f69e20ccda7117'], 'Elle économise sou à sou son argent.', ['économise','son','argent']],
];
const alternateContexts = [
  'Son compte rendu est à peu près exact.',
  'Elle travaille à jeun avant le repas.',
  'Le visiteur entre à l’étourdie dans la salle.',
  'Le bal est annulé à cause de la pluie.',
  'Tout à coup, le silence revient.',
  'Peu à peu, les soupçons grandissent.',
  'Nous partons à moins que le train ne tarde.',
  'Il apprend à force de pratique et de temps.',
  'Les ouvriers vont jeter à bas le mur.',
  'Son nom restera à jamais gravé ici.',
  'Ils vont à pied vers la gare.',
  'Le manteau est à moitié fermé ce soir.',
  'À la fin, le lièvre perd sa course.',
  'La directrice parle à son tour devant la classe.',
  'Nous devons arriver à point pour le départ.',
  'Nous parlerons à tout l’heure de ce sujet.',
  'Le ministre ne céderait à aucun prix sa place.',
  'Le crieur proclame à son de trompe le mariage.',
  'Le concierge nettoie à grande eau le sol.',
  'Le marchand compte sou à sou ses économies.',
];
const publication = loadPublication();
const subject = editorialSubjects(publication).find(s => s.kind === 'vocabulary' && s.language === 'fr' && s.id === 'srf_a:sns_a_primary');
if (!subject) throw Error('Missing à review subject');
const { lemma, surface, sense, occurrences } = subject.value;
const selected = branches.flatMap(x => x[4]);
if (new Set(selected).size !== selected.length || selected.some(id => !occurrences.some(o => o.id === id))) throw Error('Invalid à occurrence selection');
const snapshot = { version: 1, language: 'fr', entries: [{ identity: subject.id, baseRevision: reviewRevision(subject.value), lemma, surface, sense, occurrences }] };
const retained = occurrences.filter(o => !selected.includes(o.id)).map(o => o.id);
const entries = [{
  from: subject.id, occurrenceIds: retained, metadataCorrection: true,
  target: { lemma, surface, sense: { ...sense, gloss: 'to; at; in; on; for; with', definition: 'Relie un destinataire, une destination, un lieu ou un moment, et introduit aussi certains compléments de verbe, de nom ou de manière.' } },
  reason: 'The retained source uses were read in passage order: they link recipients and destinations (donner à, aller à), position or time (à la porte, à dix heures), infinitive complements (se mettre à, suffire à), rate and price (à cinq sous, à trente-six mille), and manner or attribute (à fleurs d’or, à la mode). Those constructions remain in the functional preposition identity; the twenty fixed expressions below have separate meanings. The original recipient and time quiz contexts are valid instances.',
  questions: [null, null, null],
}];
for (const [branchIndex, [key, headword, gloss, definition, ids, context, distractors]] of branches.entries()) {
  const stem = `fr_${key}`;
  const lemmaNew = { id: `lem_${stem}`, headword, partOfSpeech: 'expression' };
  const form = { id: `srf_${stem}_a`, lemmaId: lemmaNew.id, form: 'à', normalized: 'à' };
  const senseNew = { id: `sns_${stem}`, lemmaId: lemmaNew.id, gloss, definition };
  const index = context.toLocaleLowerCase('fr').indexOf('à');
  if (index < 0 || context.toLocaleLowerCase('fr').indexOf('à', index + 1) !== -1 || distractors.some(word => !context.includes(word))) throw Error(`Invalid quiz context for ${key}`);
  const alternate = alternateContexts[branchIndex];
  if (!alternate || (alternate.match(/à/gi) ?? []).length !== 1) throw Error(`Invalid alternate context for ${key}`);
  const completion = alternate.replace(/à/i, '_____');
  const identification = 'Selon le narrateur, ' + context[0].toLocaleLowerCase('fr') + context.slice(1);
  entries.push({
    from: subject.id, occurrenceIds: ids, target: { lemma: lemmaNew, surface: form, sense: senseNew },
    reason: `The ${ids.length} occurrence(s) use « ${headword} » in context with the phrase meaning “${gloss}”; the preposition's destination, time and complement gloss does not express that fixed meaning. Retain original occurrence IDs and spans.`,
    questions: [
      { context, choices: `${gloss}|towards a place|by an agent|beneath an object` },
      { context: completion, choices: 'à|de|par|sans' },
      { context: identification, prompt: `Quelle préposition figure dans la locution « ${headword} » ?`, choices: ['à', ...distractors].join('|') },
    ],
  });
}
const folder = resolve('content/editorial/quiz-review');
const name = 'fr-a-2026-09-26';
writeFileSync(resolve(folder, `${name}-input.json`), JSON.stringify(snapshot, null, 2) + '\n');
writeFileSync(resolve(folder, `${name}.mjs`), `export default ${JSON.stringify({ version: 1, id: 'fr-a-semantic-2026-09-26', snapshot: `${name}-input.json`, language: 'fr', entries }, null, 2)};\n`);
console.log(JSON.stringify({ retained: retained.length, branches: branches.length, moved: selected.length }));
