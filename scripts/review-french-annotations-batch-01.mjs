import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-annotations-2026-09-24-01';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error('Batch already exists');

const decisions = [
  ['wrk_cigale_fourmi', 'The 11 ordered unit spans reconstruct the canonical text exactly; all vocabulary, exclusions, and five expression spans validate against the bound revisions.'],
  ['wrk_corbeau_renard', 'The 11 ordered unit spans reconstruct the canonical text exactly; every vocabulary span and the complete zero-expression annotation set validate against the bound revisions.'],
  ['wrk_lion_rat', 'The 11 ordered unit spans reconstruct the canonical text exactly; all vocabulary, exclusions, and four expression spans validate against the bound revisions.'],
  ['wrk_loup_agneau', 'The 20 ordered unit spans reconstruct the canonical text exactly; all vocabulary, exclusions, and six expression spans validate against the bound revisions.'],
  ['wrk_maupassant_la_parure', 'The 134 ordered unit spans reconstruct the canonical text exactly; all vocabulary, 34 exclusions, and ten expression spans validate against the bound revisions.'],
  ['wrk_perrault_cendrillon', 'The 55 ordered unit spans reconstruct the canonical text exactly; all vocabulary, 38 exclusions, and seven expression spans validate against the bound revisions.'],
  ['wrk_zola_jaccuse', 'The 199 ordered unit spans reconstruct the canonical text exactly; all vocabulary, 153 exclusions, and eleven expression spans validate against the bound revisions.'],
];

const publication = loadPublication();
const subjects = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'annotations').map(subject => [subject.id, subject]));
const queue = auditEditorialQuality(publication).filter(issue => issue.language === 'fr' && issue.kind === 'annotations').map(issue => issue.id).sort();
if (decisions.some(([id], index) => id !== queue[index]) || queue.length !== decisions.length) throw new Error('French annotation queue changed');
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = decisions.map(([subjectId, rationale]) => {
  const subject = subjects.get(subjectId);
  if (!subject) throw new Error(`Missing annotations ${subjectId}`);
  const reviewId = `annotations:${subjectId}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'annotations', subjectId, subject.value, 'Codex', '2026-09-24T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.units.length };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-24', language: 'fr', subjectKind: 'annotations', sequence: 1, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'work-level review of exact canonical reconstruction, ordered UTF-16 unit spans, vocabulary and exclusion coverage, and expression spans', changes };
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, stage => { const candidate = loadPublication(stage); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); });
console.log(JSON.stringify({ batchId, reviewed: changes.length, approvals: changes.length, holds: 0, backup }, null, 2));
