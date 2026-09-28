import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-review-2026-09-25-10';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error('Review batch already exists');
const targetIds = new Set([
  'srf_zola_affaire_affaire:sns_zola_affaire_matter',
  'srf_zola_premier_premier:sns_zola_premier_primary',
  'srf_zola_eut_avoir:sns_zola_avoir_possess_auxiliary',
  'srf_zola_nos_notre:sns_zola_notre_our',
  'srf_zola_crie_crier:sns_zola_crier_proclaim',
  'srf_zola_crierai_crier:sns_zola_crier_proclaim',
  'srf_zola_hater_59df7691434d_hater:sns_zola_hater_hasten',
  'srf_zola_entendus_s_entendre:sns_zola_s_entendre_agree',
]);

const publication = loadPublication();
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && targetIds.has(subject.id));
if (subjects.length !== targetIds.size) throw new Error(`Expected ${targetIds.size} review subjects, found ${subjects.length}`);
const rationale = 'Reviewed the indexed literary contexts and each dependent question. The existing sense, learner gloss, context, answer, and grammatical fit are accurate; no wording change is needed.';
const changes = subjects.map(subject => {
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subject.id, subject.value, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.occurrences?.length ?? 0, questionOutcome: 'reviewed and approved dependent questions' };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', sequence: 10, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'contextual review of every indexed sense and dependent question; no content rewrite was needed', changes };
const next = { ...source, reviews: [...reviews.values()] };
const files = new Map(sharedSourceFiles(next));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, reviewedIdentities: changes.length, reboundQuizApprovals: 0, backup }, null, 2));
