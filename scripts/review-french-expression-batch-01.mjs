import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-expression-2026-09-24-01';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error('Batch already exists');

const decisions = [
  ['exi_a_priori', 'Un a priori correctly denotes a preconception formed before examining the evidence; identity, span, and context agree.'],
  ['exi_ainsi_que', 'Ainsi que les appelle means as he calls them and introduces reported wording; the expression meaning and source span fit.'],
  ['exi_au_point_de', 'Au point de devenir marks a degree sufficient to cause the stated consequence; the expression meaning and span fit.'],
  ['exi_cendrillon_a_cause_de_3ae5baee14', 'À cause de sa maîtresse barbe introduces the reason for the fairy’s choice; the causal expression is correctly identified.'],
  ['exi_cendrillon_a_force_de_5417d6c27a', 'À force de les serrer attributes the result to repeated intense tightening; the expression meaning and span fit.'],
  ['exi_cendrillon_de_sorte_qu_487e71ecc1', 'De sorte qu’elle entendit introduces the consequence of forgetting the warning; the expression and elided span fit.'],
  ['exi_cendrillon_en_meme_tems_bf19c49139', 'En même tems states that the transformation happened simultaneously with the touch; meaning and historical spelling fit.'],
  ['exi_cendrillon_en_venir_a_bout_a778c48125', 'In both indexed contexts en venir à bout means manage or succeed in a difficult aim; the shared expression identity fits.'],
  ['exi_cendrillon_sans_doute_9d5b8f1836', 'Sans doute expresses strong certainty that the quality is a great advantage; the expression meaning and source span fit.'],
  ['exi_cigale_fourmi_a_tout_venant_50dd93c807', 'À tout venant means to anyone who came or was present to hear; the expression meaning and span fit the fable.'],
  ['exi_cigale_fourmi_eh_bien_1962dd98b7', 'Eh bien introduces the ant’s pointed reaction and conclusion; the discourse expression is correctly identified.'],
  ['exi_cigale_fourmi_ne_vous_deplaise_2bd398b2c8', 'Ne vous déplaise is a polite formula softening the assertion; the expression meaning and source span fit.'],
  ['exi_cigale_fourmi_nuit_et_jour_16d3e2d0ed', 'Nuit et jour means continuously through night and day; the fixed expression meaning and span fit.'],
  ['exi_cigale_fourmi_tout_l_ete_ba43040897', 'Tout l’été denotes the entire summer duration; the expression meaning and indexed span fit.'],
  ['exi_de_sorte_que', 'Both occurrences of de sorte que introduce a consequence of the preceding facts; the shared expression identity fits.'],
  ['exi_lion_rat_a_l_etourdie_e856010e0a', 'À l’étourdie describes the rat acting heedlessly and without reflection; the expression meaning and span fit.'],
  ['exi_lion_rat_au_sortir_des_forets_971cce2bcd', 'Au sortir des forêts means at the moment of leaving the forests; the expression meaning and complete span fit.'],
  ['exi_lion_rat_en_cette_occasion_1677dff97d', 'En cette occasion identifies the particular circumstance in which the lion acts; meaning and span fit.'],
  ['exi_lion_rat_tout_le_monde_35b35f38b6', 'Tout le monde denotes everyone without exception in the moral; the expression meaning and span fit.'],
  ['exi_loup_agneau_a_jeun_3ba446c799', 'À jeun means having eaten nothing, explaining the wolf’s hunger; the fixed expression meaning and span fit.'],
  ['exi_loup_agneau_en_aucune_facon_4ae166529f', 'En aucune façon completely denies the possibility of troubling the water; the expression meaning and span fit.'],
  ['exi_loup_agneau_la_dessus_65898e9f44', 'Là-dessus introduces what happens immediately after the exchange; the discourse expression and span fit.'],
  ['exi_loup_agneau_sans_autre_forme_de_proces_068600a92c', 'Sans autre forme de procès means without further discussion or procedure; the idiomatic expression and full span fit.'],
  ['exi_loup_agneau_tout_a_l_heure_56956d49b5', 'Tout à l’heure means shortly or right away in this prospective context; the expression meaning and span fit.'],
  ['exi_parure_a_cause_de_3ae5baee14', 'À cause de toi explicitly identifies the cause of the hardship; the causal expression meaning and span fit.'],
  ['exi_parure_au_bout_d_14acdedfeb', 'Au bout d’une semaine marks the end of a one-week duration; the expression meaning and elided span fit.'],
  ['exi_parure_au_juste_5d7dcba51c', 'Au juste means exactly or with precision in not knowing the amount; the expression meaning and span fit.'],
  ['exi_parure_au_lieu_d_ca7ea8ca24', 'Au lieu d’être ravie contrasts the actual reaction with the expected one; the replacement expression and span fit.'],
  ['exi_parure_en_face_de', 'En face de son mari describes a directly facing position at the table; the expression meaning and span fit.'],
  ['exi_parure_par_consequent_40a447f3d5', 'Both occurrences of par conséquent introduce a logical consequence; the shared expression meaning and spans fit.'],
  ['exi_parure_sans_cesse', 'Sans cesse means continuously or without interruption in her suffering; the expression meaning and span fit.'],
  ['exi_parure_tout_a_coup_cf94b2f6b5', 'Both occurrences of tout à coup mark a sudden unexpected perception; the shared expression meaning and spans fit.'],
  ['exi_parure_tout_en', 'Tout en mangeant introduces an action simultaneous with her imagining; the expression meaning and span fit.'],
  ['exi_quant_a', 'Quant aux gens introduces the people as the next topic under discussion; the expression meaning and inflected span fit.'],
  ['exi_se_faire_fort_de', 'Se fait fort de means confidently undertaking to expose the traitor; the pronominal expression meaning and span fit.'],
  ['exi_tout_au_long', 'Écrites tout au long means written out fully and at length; the expression meaning and span fit.'],
  ['exi_tout_au_moins', 'Tout au moins means at least, qualifying the minimum claimed complicity; the expression meaning and span fit.'],
  ['exi_tout_au_plus', 'Tout au plus sets the maximum concession that can be made; the expression meaning and span fit.'],
  ['exi_tout_d_un_coup', 'Tout d’un coup marks the sudden change in Esterhazy’s behavior; the expression meaning and span fit.'],
];

const publication = loadPublication();
const subjects = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'expression').map(subject => [subject.id, subject]));
const queue = auditEditorialQuality(publication).filter(issue => issue.language === 'fr' && issue.kind === 'expression').map(issue => issue.id).sort();
if (decisions.some(([id], index) => id !== queue[index]) || queue.length !== decisions.length) throw new Error('French expression queue changed');
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = decisions.map(([subjectId, rationale]) => {
  const subject = subjects.get(subjectId);
  if (!subject) throw new Error(`Missing expression ${subjectId}`);
  const reviewId = `expression:${subjectId}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'expression', subjectId, subject.value, 'Codex', '2026-09-24T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.occurrences.length };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'expression', sequence: 1, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'individual contextual review of shared expression meaning, every indexed source span, and separation from component words', changes };
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, reviewed: changes.length, approvals: changes.length, holds: 0, backup }, null, 2));
