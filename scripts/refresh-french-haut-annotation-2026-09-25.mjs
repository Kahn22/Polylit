import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects, auditEditorialQuality } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const previousPath = process.argv[2];
if (!previousPath) throw Error('Pass the previous publication path returned by the semantic split');
const batchId = 'fr-haut-annotation-2026-09-25';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw Error('Batch exists');
const previous = loadPublication(resolve(previousPath));
const publication = loadPublication();
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const issues = auditEditorialQuality(publication);
const changes = [];
for (const id of ['wrk_perrault_cendrillon']) {
  const a = previous.textBindings.get(id), b = publication.textBindings.get(id);
  if (!a || !b || a.textRevision !== b.textRevision || a.structureRevision !== b.structureRevision || a.annotationRevision === b.annotationRevision) throw Error(`Unexpected text or binding revision ${id}`);
  const subject = editorialSubjects(publication).find(s => s.kind === 'annotations' && s.id === id);
  if (!subject || !issues.some(issue => issue.kind === 'annotations' && issue.id === id)) throw Error(`Annotation not stale ${id}`);
  const reviewId = `annotations:${id}`, before = reviews.get(reviewId);
  const rationale = 'The ordered passage units retain identical canonical text and structure; the noun haut occurrence retains its exact source span and now matches « au haut de la maison ».';
  const after = approveReview('fr', 'annotations', id, subject.value, 'Codex offline contextual review', new Date().toISOString(), rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId: id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.units.length });
}
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'annotations', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'exact canonical and structural revision comparison after one occurrence reassignment', changes });
const backup = adoptSourceFiles(publicationRoot, files, root => {
  const candidate = loadPublication(root);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
  if (auditEditorialQuality(candidate).some(issue => changes.some(c => issue.kind === 'annotations' && issue.id === c.subjectId))) throw Error('Still blocked');
});
console.log(JSON.stringify({ batchId, reviewedWorks: changes.length, backup }));
