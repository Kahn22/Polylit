import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { quizEditorialIssues } from '../dist/publication/quiz-authoring.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

// Reapply only the unchanged-meaning decisions documented after checkpoint 30.
// Corrections and identity merges are handled in separate ledgers.
const batchId = 'fr-checkpoint-30-recovery-clear-2026-09-25';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error('Recovery batch already applied');
const decisions = new Map([
  ['srf_zola_accuse_3f1850b80608_accuser:sns_zola_accuser_charge', 'Accusé is the past participle of accuser in the indexed passage; its meaning and dependent questions fit.'],
  ['srf_zola_atteints_atteindre:sns_zola_atteindre_afflict', 'Atteints expresses being afflicted or affected in the indexed passage, and its dependent questions distinguish that meaning.'],
  ['srf_zola_maison_maison:sns_zola_maison_household', 'Maison refers to an institution or establishment in the indexed passage; the stored meaning and questions fit.'],
  ['srf_zola_crois_croire:sns_zola_croire_believe', 'Crois means to believe in its indexed passage; the form and questions fit.'],
  ['srf_zola_croyait_croire:sns_zola_croire_believe', 'Croyait means believed or thought in its indexed passage; the form and questions fit.'],
  ['srf_zola_croira_croire:sns_zola_croire_believe', 'Croira means will believe in its indexed passage; the form and questions fit.'],
  ['srf_zola_croire_croire:sns_zola_croire_believe', 'Croire means to believe in its indexed passage; the form and questions fit.'],
  ['srf_zola_arrivons_arriver:sns_zola_arriver_come_to', 'Arrivons expresses reaching the point discussed in the indexed passage; the questions fit.'],
  ['srf_zola_allais_aller:sns_zola_aller_imminent', 'Allais marks the near future in the indexed passage; the questions fit.'],
  ['srf_zola_mentent_mentir:sns_zola_mentir_lie', 'Mentent means tell falsehoods in the indexed passage; the questions fit.'],
  ['srf_zola_montre_montrer:sns_zola_montrer_show', 'Montre means shows or demonstrates in the indexed passage; the questions fit.'],
  ['srf_zola_montrent_montrer:sns_zola_montrer_show', 'Montrent means show or demonstrate in the indexed passage; the questions fit.'],
  ['srf_zola_arrivait_arriver:sns_zola_arriver_reach', 'Arrivait means was arriving or happened in the indexed passage; the questions fit.'],
  ['srf_zola_temoignages_0331948ccb88_temoignage_71f87435fe14:sns_zola_temoignage_evidence', 'Témoignages is a plural noun meaning testimonies or evidence; all indexed occurrences and questions fit.'],
  ['srf_zola_juges_juge:sns_zola_juge_magistrate', 'Juges is a plural noun meaning judges; the indexed passages and number-matched questions fit.'],
  ['srf_zola_mettaient_mettre:sns_zola_mettre_doubt', 'Mettaient is part of mettre en doute, meaning to call into question; the indexed phrase and questions fit.'],
  ['srf_zola_etoile_e4729c715e44_etoile:sns_zola_etoile_destiny', 'Votre étoile is a metaphor for one’s fortune or destiny; the stored gloss and questions fit the indexed passage.'],
]);
const publication = loadPublication();
const source = publication.sharedSources.fr;
const pending = new Set(auditEditorialQuality(publication).filter(issue => issue.kind === 'vocabulary' && issue.language === 'fr').map(issue => issue.id));
const subjects = new Map(editorialSubjects(publication).filter(subject => subject.kind === 'vocabulary' && subject.language === 'fr').map(subject => [subject.id, subject]));
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = [];
for (const [subjectId, rationale] of decisions) {
  const subject = subjects.get(subjectId);
  if (!subject || !pending.has(subjectId)) throw new Error(`Missing pending target: ${subjectId}`);
  if (!subject.value.occurrences.length) throw new Error(`No source occurrences: ${subjectId}`);
  const questions = source.quizzes.filter(quiz => quiz.subject.kind === 'vocabulary' && `${quiz.subject.surfaceFormId}:${quiz.subject.senseId}` === subjectId);
  if (new Set(questions.map(question => question.band)).size !== 3 || questions.some(question => quizEditorialIssues(question).length)) throw new Error(`Dependent questions need review: ${subjectId}`);
  const reviewId = `vocabulary:${subjectId}`;
  const before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', subjectId, subject.value, 'Codex', '2026-09-25T00:00:00.000Z', rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId, reviewId, outcome: 'approve', rationale, before, after, reviewedOccurrences: subject.value.occurrences.length });
}
const ledger = { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'reconstructed contextual decisions from the documented post-checkpoint review, verified against active subjects and three question bands', changes };
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, ledger);
const backup = adoptSourceFiles(publicationRoot, files, root => { const candidate = loadPublication(root); validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry); const remaining = new Set(auditEditorialQuality(candidate).map(issue => issue.id)); for (const id of decisions.keys()) if (remaining.has(id)) throw new Error(`Approval still blocked: ${id}`); });
console.log(JSON.stringify({ batchId, reviewedIdentities: changes.length, backup }, null, 2));
