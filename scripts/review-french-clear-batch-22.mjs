import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { sharedSourceFiles, adoptSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-review-2026-09-25-22';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw Error('Review batch exists');
const entries = [
  { id: 'srf_zola_mais_mais:sns_zola_mais_but', count: 12, rationale: 'All twelve indexed uses introduce a contrast, including « Mais voici Dreyfus », « mais il est certain », and Mathilde’s « mais malheureuse ». The meaning but/however and the three existing questions test that contrast with appropriate alternatives.' },
  { id: 'srf_zola_lorsqu_c8b690e031d8_lorsque:sns_zola_lorsque_when', count: 9, rationale: 'The nine elided « lorsqu’ » spans introduce time clauses in Zola, La Parure, and Cendrillon, such as « lorsqu’une enquête », « Lorsqu’ils furent dans la rue », and « lorsqu’elle ne les vit plus ». The meaning when and all three questions agree with this use.' },
  { id: 'srf_zola_en_en:sns_zola_en_neanmoins', count: 1, rationale: 'In « Vous n’en avez pas moins un devoir d’homme », en belongs to the concession « n’en ... pas moins ». The three existing questions use the same concession and distinguish it from a simple object pronoun or a negation.' },
  { id: 'srf_zola_en_en:sns_zola_en_gros', count: 1, rationale: '« J’abrège, car ce n’est ici, en gros, que le résumé » uses the adverbial expression en gros to mean broadly. The early meaning, completion, and identification questions all test that expression in distinct appropriate contexts.' },
];
const publication = loadPublication();
const subjects = new Map(editorialSubjects(publication).filter(s => s.kind === 'vocabulary' && s.language === 'fr').map(s => [s.id, s]));
const pending = new Set(auditEditorialQuality(publication).filter(i => i.kind === 'vocabulary' && i.language === 'fr').map(i => i.id));
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = [];
for (const entry of entries) {
  const subject = subjects.get(entry.id);
  if (!subject || !pending.has(entry.id) || subject.value.occurrences.length !== entry.count) throw Error(`Source changed: ${entry.id}`);
  const reviewId = `vocabulary:${entry.id}`, before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', entry.id, subject.value, 'Codex offline contextual review', new Date().toISOString(), entry.rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId: entry.id, reviewId, outcome: 'approve', rationale: entry.rationale, before, after, reviewedOccurrences: entry.count });
}
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'all indexed occurrences and three question bands reviewed for each identity', changes });
adoptSourceFiles(publicationRoot, files, root => {
  const candidate = loadPublication(root);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
  if (auditEditorialQuality(candidate).some(issue => issue.kind === 'vocabulary' && entries.some(entry => entry.id === issue.id))) throw Error('Reviewed record still pending');
});
console.log(JSON.stringify({ batchId, approved: changes.length }));
