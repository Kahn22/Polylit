import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-review-2026-09-25-09';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error('Review batch already exists');
const targetIds = new Set([
  'srf_mentir:sns_mentir_primary',
  'srf_sent:sns_sentir_primary',
  'srf_montrer:sns_montrer_primary',
  'srf_ouvre:sns_ouvrir_primary',
  'srf_laisse:sns_laisser_primary',
  'srf_mon:sns_mon_primary',
  'srf_bon:sns_bon_primary',
  'srf_mais:sns_mais_primary',
  'srf_on:sns_on_primary',
  'srf_ma:sns_mon_primary',
  'srf_zola_ai_avoir:sns_zola_avoir_possess_auxiliary',
  'srf_zola_a_avoir:sns_zola_avoir_possess_auxiliary',
  'srf_zola_aurait_avoir:sns_zola_avoir_possess_auxiliary',
  'srf_zola_cru_croire:sns_zola_croire_believe',
  'srf_zola_dont_dont:sns_zola_dont_whose_of_which',
  'srf_zola_des_des_indefinite:sns_zola_des_indefinite_some',
]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && targetIds.has(subject.id));
if (subjects.length !== targetIds.size) throw new Error(`Expected ${targetIds.size} review subjects, found ${subjects.length}`);
const rationale = 'Reviewed every indexed occurrence and the exact-version dependent questions; the existing sense, learner gloss, context, answer, and grammatical fit are accurate. No content or question rewrite was needed.';
const changes = subjects.map(subject => {
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, subject.value, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.occurrences.length };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', sequence: 9, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'contextual re-review of pending identities with unchanged, learner-ready meanings and approved dependent questions', changes };
const next = { ...source, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, reviewedIdentities: changes.length, reboundQuizApprovals: 0, backup }, null, 2));
