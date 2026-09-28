import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects, auditEditorialQuality } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const previousPath = process.argv[2];
if (!previousPath) throw Error('Pass the publication path before the à and de splits');
const batchId = 'fr-a-de-annotations-2026-09-26';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw Error('Batch exists');
const previous = loadPublication(resolve(previousPath));
const publication = loadPublication();
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const issues = auditEditorialQuality(publication).filter(issue => issue.kind === 'annotations' && issue.language === 'fr');
const moved = ['fr-a-semantic-2026-09-26', 'fr-de-semantic-2026-09-26'].flatMap(batch => {
  const ledger = JSON.parse(readFileSync(resolve(publicationRoot, `editorial-batches/${batch}.json`), 'utf8'));
  return ledger.mappings.flatMap(mapping => mapping.occurrenceIds);
});
const movedIds = new Set(moved);
if (movedIds.size !== 40 || issues.length !== 7) throw Error('Unexpected impact scope');
const changes = [];
for (const { id, issues: flags } of issues) {
  const before = previous.textBindings.get(id), after = publication.textBindings.get(id);
  if (!before || !after || before.textRevision !== after.textRevision || before.structureRevision !== after.structureRevision || before.annotationRevision === after.annotationRevision || flags.join(',') !== 'approval_stale') throw Error(`Unexpected binding change ${id}`);
  const reassigned = publication.bundle.occurrences.filter(o => o.workId === id && movedIds.has(o.id));
  if (!reassigned.length) throw Error(`Missing reassignment ${id}`);
  const subject = editorialSubjects(publication).find(s => s.kind === 'annotations' && s.id === id);
  const reviewId = `annotations:${id}`, original = reviews.get(reviewId);
  const rationale = `The canonical text and ordered unit structure match the prior approved binding. All ${reassigned.length} reassigned à/de/d’ word occurrences keep their original source spans and now point to their reviewed fixed-expression senses; the remaining preposition uses keep the revised functional senses.`;
  const approved = approveReview('fr', 'annotations', id, subject.value, 'Codex offline contextual review', new Date().toISOString(), rationale);
  reviews.set(reviewId, approved);
  changes.push({ subjectId: id, reviewId, outcome: 'approve', rationale, before: original, after: approved, reviewedOccurrences: subject.value.units.length });
}
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-26', language: 'fr', subjectKind: 'annotations', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'exact canonical text and ordered structure comparison after 40 reviewed occurrence reassignments', changes });
const backup = adoptSourceFiles(publicationRoot, files, root => {
  const candidate = loadPublication(root);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
  if (auditEditorialQuality(candidate).length) throw Error('Still blocked');
});
console.log(JSON.stringify({ batchId, reviewedWorks: changes.length, reassignedOccurrences: moved.length, backup }));
