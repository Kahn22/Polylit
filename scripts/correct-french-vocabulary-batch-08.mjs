import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { fromNeutral, toNeutral } from '../dist/publication/format.js';
import { adoptSourceFiles, reconcileQuizzes, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-correction-2026-09-25-08';
const reviewLedgerPath = `editorial-review-batches/${batchId}.json`;
const correctionLedgerPath = `editorial-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, reviewLedgerPath)) || existsSync(resolve(publicationRoot, correctionLedgerPath))) throw new Error('Correction batch already exists');

const senseUpdates = new Map([
  ['sns_cendrillon_pantoufle_chaussure_d_interieur_que_l_on_met_chez_soi_pour_etre_plus_a_l_aise_f4799862bc', { gloss: 'slipper; glass slipper', definition: 'Chaussure légère, souvent portée à l’intérieur ; dans ce récit, chaussure de verre.' }],
  ['sns_cendrillon_manquer_faillir_tomber_en_faute_c7512f1e5a', { gloss: 'to fail; fail to do', definition: 'Ne pas accomplir une action attendue ou ne pas respecter un engagement, notamment dans « manquer de » suivi d’un infinitif.' }],
  ['sns_parure_quitter_laisser_quelqu_un_quelque_part_se_separer_de_lui_27032d5ee3', { gloss: 'to leave; part from', definition: 'Cesser d’être avec quelqu’un ou se séparer de quelqu’un ; quitter un lieu, c’est aussi en partir.' }],
  ['sns_parure_sentir_recevoir_quelque_impression_par_le_moyen_des_sens_eprouver_en_soi_quelque_chose_d_agreable_ou_de_penible_46c27b8810', { gloss: 'to feel; experience', definition: 'Éprouver une sensation, une émotion ou un état ; dans « ne pas se sentir de joie », être submergé de joie.' }],
  ['sns_parure_ennuyer_causer_de_l_ennui_fatiguer_l_esprit_par_quelque_chose_d_insignifiant_de_monotone_de_deplaisant_ou_de_trop_long_3943cceb9a', { gloss: 'to bore; be bored', definition: 'Causer de l’ennui à quelqu’un ou, avec se, éprouver de l’ennui.' }],
  ['sns_zola_soumettre_submitted', { gloss: 'to submit; subject to', definition: 'Présenter quelque chose à une autorité pour examen, ou imposer une épreuve ou un traitement à quelqu’un.' }],
]);
const reviewOnlyIds = new Set([
  'srf_zola_court_courir:sns_zola_courir_run',
  'srf_zola_dorment_dormir:sns_zola_dormir_sleep',
  'srf_zola_eloigna_39057499692a_eloigner:sns_zola_eloigner_send_away',
  'srf_zola_honteuse_honteux:sns_zola_honteux_shameful',
]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const content = fromNeutral(source.legacy.content);
const beforeSenses = new Map(content.senses.filter(sense => senseUpdates.has(sense.id)).map(sense => [sense.id, sense]));
if (beforeSenses.size !== senseUpdates.size) throw new Error('Correction targets changed');
content.senses = content.senses.map(sense => senseUpdates.has(sense.id) ? { ...sense, ...senseUpdates.get(sense.id) } : sense);
const legacy = { ...source.legacy, content: toNeutral(content) };
const quizzes = reconcileQuizzes(source, legacy);
const updatedSenses = new Map(content.senses.map(sense => [sense.id, sense]));
const updatedLemmas = new Map(content.lemmas.map(lemma => [lemma.id, lemma]));
const surfaces = new Map(content.surfaceForms.map(surface => [surface.id, surface]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && (senseUpdates.has(subject.value.sense.id) || reviewOnlyIds.has(subject.id)));
if (!subjects.length || [...reviewOnlyIds].some(id => !subjects.some(subject => subject.id === id))) throw new Error('Vocabulary review targets changed');
const rationale = 'Reviewed every indexed source context and the learner-facing meaning; corrected senses also received a fresh review of their unchanged dependent questions. Permanent vocabulary identity and occurrence IDs remain stable.';
const changes = subjects.map(subject => {
  const value = subject.value;
  const revised = { ...value, lemma: updatedLemmas.get(value.lemma.id), sense: updatedSenses.get(value.sense.id) };
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, revised, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: value.occurrences.length };
});

let reboundQuizzes = 0;
for (const quiz of quizzes) {
  if (quiz.subject.kind !== 'vocabulary' || !senseUpdates.has(quiz.subject.senseId)) continue;
  const surface = surfaces.get(quiz.subject.surfaceFormId);
  const sense = updatedSenses.get(quiz.subject.senseId);
  const lemma = updatedLemmas.get(surface.lemmaId);
  const reason = 'Re-reviewed the authored question after its target meaning was corrected or clarified; its context, answer, grammatical fit, distractors, and band remain valid.';
  reviews.set(`quiz:${quiz.id}`, approveReview('fr', 'quiz', quiz.id, { quiz, target: { surface, sense, lemma } }, 'Codex', '2026-09-25T00:00:00.000Z', reason));
  reboundQuizzes++;
}

const reviewLedger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', sequence: 8, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'contextual sense correction and exact-version question re-review; separate approvals for fully accurate identities', changes };
const correctionLedger = { version: 1, id: batchId, language: 'fr', masteryIdsChanged: false, progressTransfers: [], reboundQuizApprovals: reboundQuizzes, changes: [...[...beforeSenses].map(([id, before]) => ({ kind: 'senses', id, before, after: updatedSenses.get(id), reason: 'Clarified a construction-specific, reflexive, idiomatic, or contextual meaning while preserving its stable vocabulary identity.' }))] };
const next = { ...source, legacy, quizzes, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(reviewLedgerPath, reviewLedger);
files.set(correctionLedgerPath, correctionLedger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, correctedSenses: senseUpdates.size, reviewedIdentities: changes.length, reboundQuizApprovals: reboundQuizzes, backup }, null, 2));
