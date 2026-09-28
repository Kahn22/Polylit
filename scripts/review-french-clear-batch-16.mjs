import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-review-2026-09-25-16';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error('Review batch already exists');
const reasons = new Map([
  ['srf_zola_apprenons_apprendre:sns_zola_apprendre_learn', 'In J’Accuse, “nous apprenons même que les experts” means learning new information. All three questions test that meaning, and the completion uses first-person plural agreement.'],
  ['srf_zola_doutes_doute_noun:sns_zola_doute_uncertainty', 'In “l’historique des doutes, puis de la conviction”, doutes are uncertainties preceding conviction. The three questions test plural uncertainties with suitable noun distractors.'],
  ['srf_parure_ouvrit_lem_ouvrir_21e385e324:sns_parure_ouvrir_faire_que_ce_qui_etait_clos_ferme_ne_le_soit_plus_7ff93dc6d2', 'Both La Parure occurrences concern opening a container, the second under negation. The three questions test opened/opening and the past-tense surface form with grammatical alternatives.'],
]);
const publication = loadPublication();
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const subjects = editorialSubjects(publication).filter(subject => subject.language === 'fr' && subject.kind === 'vocabulary' && reasons.has(subject.id));
if (subjects.length !== reasons.size) throw new Error(`Expected ${reasons.size} subjects, found ${subjects.length}`);
const changes = subjects.map(subject => {
  const reviewId = `vocabulary:${subject.id}`;
  const before = reviews.get(reviewId);
  if (before?.status === 'approved') throw new Error(`Already approved: ${subject.id}`);
  const rationale = reasons.get(subject.id);
  const after = approveReview('fr', 'vocabulary', subject.id, subject.value, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  return { subjectId: subject.id, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.occurrences.length, questionOutcome: 'all three dependent questions reviewed; unchanged' };
});
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', sequence: 16, reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'individual passage and dependent question review', changes };
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, ledger);
adoptSourceFiles(publicationRoot, files, stage => {
  const candidate = loadPublication(stage);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
});
console.log(JSON.stringify({ batchId, reviewedIdentities: changes.length }, null, 2));
