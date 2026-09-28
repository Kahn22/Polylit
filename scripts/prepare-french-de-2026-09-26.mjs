import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication } from '../dist/publication/repository.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { reviewRevision } from '../dist/publication/editorial.js';

// Each branch identifies exact occurrence IDs and teaches its fixed phrase.
const branches = [
  ['de_sorte_que','de','de sorte que','so that; with the result that','Introduit la conséquence de ce qui précède.',['occ_zola_388a3082524c7cf8b496f94e','occ_zola_a3725912dcefded9b9ed867d'],'Il a insisté, de sorte que nous avons accepté.','Elle a parlé, de sorte que chacun a compris.',['insisté','nous','accepté']],
  ['de_meme','de','de même','likewise; similarly','Introduit une comparaison ou une répétition semblable.',['occ_zola_e98b4c0b8c942b595dace86b'],'De même, Paul partit avec ses amis.','De même, elle examina les autres pièces.',['Paul','partit','amis']],
  ['de_quoi','de','de quoi','what use; to what end','Dans de quoi sert, demande quelle utilité possède la chose.',['occ_a297f6256c3f89c2e38bcfdf'],'De quoi vous sert cette vitesse ?','De quoi sert ce beau discours au voyageur ?',['vous','sert','vitesse']],
  ['d_autant_plus','d’','d’autant plus','all the more; especially so','Marque une intensification renforcée par une circonstance.',['occ_zola_16d0ad03184d3db46dd273a6','occ_zola_4686b754dabb2294f429f2e0'],'Cette accusation est d’autant plus grave que les preuves manquent.','Sa colère grandit d’autant plus qu’on lui cache la vérité.',['accusation','grave','preuves']],
  ['d_ailleurs','d’','d’ailleurs','besides; moreover','Ajoute un argument ou une précision incidente.',['occ_zola_22e70cd1bbab0f46077e3875','occ_parure_f0ea09a55b191b16ec045570'],'D’ailleurs, nous avons déjà répondu à cette question.','D’ailleurs, elle connaissait depuis longtemps la réponse.',['nous','répondu','question']],
  ['tout_d_un_coup','d’','tout d’un coup','suddenly; all at once','Indique un changement soudain.',['occ_zola_44fadef64beab4a66a78ec90','occ_parure_5b03663d3cf43dc98ba903f6'],'Tout d’un coup, une décision change le procès.','Tout d’un coup, elle aperçoit un bijou sur la table.',['Tout','décision','procès']],
  ['d_abord','d’','d’abord','at first; first','Indique la première étape ou priorité.',['occ_zola_539503b27576106133c864ce','occ_zola_874d6ec75b87762e2a5b9293','occ_zola_c0a30c57b43a2989dd496f0c','occ_zola_fd7736563d97b016ae6b3d5d','occ_parure_7bcdfe1dc5791384206629d9'],'D’abord, elle examine le collier dans la boîte.','D’abord, le témoin décrit ce qu’il a vu.',['elle','examine','collier']],
  ['d_autre_part','d’','d’autre part','on the other hand; elsewhere','Introduit un autre point dans le raisonnement.',['occ_zola_8cddad69e9a73b9f3e55d432'],'D’autre part, le témoin présente une preuve nouvelle.','D’autre part, nous devons vérifier ce document.',['témoin','présente','preuve']],
  ['d_accord','d’','d’accord','in agreement; agreed','Indique une même opinion ou un accord.',['occ_zola_4619c76d627c61e9aac11542'],'Les experts ne sont pas d’accord sur ce point.','Les deux juges semblent d’accord sur la date.',['experts','sont','point']],
];
const p = loadPublication(), subjects = editorialSubjects(p);
const snapshot = { version: 1, language: 'fr', entries: [] }, entries = [];
for (const key of ['srf_de:sns_de_primary','srf_d_elided:sns_de_primary']) {
  const s = subjects.find(x => x.kind === 'vocabulary' && x.language === 'fr' && x.id === key);
  if (!s) throw Error(`Missing ${key}`);
  const { lemma, surface, sense, occurrences } = s.value;
  const group = branches.filter(b => b[1] === surface.form);
  const moved = group.flatMap(b => b[5]);
  if (new Set(moved).size !== moved.length || moved.some(id => !occurrences.some(o => o.id === id))) throw Error(`Invalid occurrence selection ${key}`);
  snapshot.entries.push({ identity: key, baseRevision: reviewRevision(s.value), lemma, surface, sense, occurrences });
  entries.push({ from: key, occurrenceIds: occurrences.filter(o => !moved.includes(o.id)).map(o => o.id), metadataCorrection: true,
    target: { lemma, surface, sense: { ...sense, gloss: 'of; from; for; by; with; than', definition: 'Relie notamment origine, possession, matière, quantité, comparaison et complément de verbe; selon la construction, peut ne pas se traduire séparément en anglais.' } },
    reason: `The remaining ${occurrences.length - moved.length} ${surface.form} occurrences were reviewed across the five source works for source, possession, material, quantity, comparison and verb complements. The existing six questions test genuine central uses (of/from, or elided de). Fixed discourse, temporal and manner phrases are separated below; the same revised sense metadata is shared by both written forms.`,
    questions: [null, null, null] });
  for (const [stem, form, headword, gloss, definition, ids, first, second, distractors] of group) {
    if ((first.match(new RegExp(form,'gi')) ?? []).length !== 1 || (second.match(new RegExp(form,'gi')) ?? []).length !== 1 || distractors.some(x => !first.includes(x))) throw Error(`Quiz context ${stem}`);
    const lemmaNew = { id: `lem_fr_${stem}`, headword, partOfSpeech: 'expression' };
    const surfaceNew = { id: `srf_fr_${stem}_${form === 'de' ? 'de' : 'd_elided'}`, lemmaId: lemmaNew.id, form, normalized: form };
    const senseNew = { id: `sns_fr_${stem}`, lemmaId: lemmaNew.id, gloss, definition };
    entries.push({ from: key, occurrenceIds: ids, target: { lemma: lemmaNew, surface: surfaceNew, sense: senseNew },
      reason: `These ${ids.length} source use(s) belong to « ${headword} », meaning “${gloss}” in their quoted passages. An isolated of/from relation does not teach this fixed construction. Source spans and IDs are preserved.`,
      questions: [
        { context: first, choices: `${gloss}|belonging to|toward a place|under an object` },
        { context: second.replace(new RegExp(form,'i'),'_____'), choices: `${form}|à|par|sans` },
        { context: 'Selon le narrateur, ' + first[0].toLocaleLowerCase('fr') + first.slice(1), prompt: `Quel élément appartient à la locution « ${headword} » ?`, choices: [form, ...distractors].join('|') },
      ],
    });
  }
}
const folder = resolve('content/editorial/quiz-review'), name = 'fr-de-2026-09-26';
writeFileSync(resolve(folder, `${name}-input.json`), JSON.stringify(snapshot, null, 2) + '\n');
writeFileSync(resolve(folder, `${name}.mjs`), `export default ${JSON.stringify({ version: 1, id: 'fr-de-semantic-2026-09-26', snapshot: `${name}-input.json`, language: 'fr', entries }, null, 2)};\n`);
console.log(JSON.stringify({ sourceIdentities: snapshot.entries.length, branches: branches.length, moved: branches.flatMap(b => b[5]).length }));
