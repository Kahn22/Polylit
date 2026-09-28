import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { sharedSourceFiles, adoptSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'fr-lexical-review-2026-09-25-24';
const ledgerPath = `editorial-review-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw Error('Review batch exists');
const entries = [
  { id: 'srf_zola_avez_avoir:sns_zola_avoir_possess_auxiliary', count: 5, rationale: 'Across five passages, avez expresses having a duty or power, or acts as the auxiliary in « m’avez fait » and « avez conquis ». The shared avoir sense explicitly covers both functions, and the three questions correctly test vous avez with distinct possession contexts.' },
  { id: 'srf_zola_eu_avoir:sns_zola_avoir_possess_auxiliary', count: 5, rationale: 'The five eu passages express having had evidence, trouble, difficult days or desire, or form « il n’y a eu ». The broad have/auxiliary sense covers the participle, and all three existing questions use the same past-participle form and had meaning.' },
  { id: 'srf_zola_avons_avoir:sns_zola_avoir_possess_auxiliary', count: 5, rationale: 'The five nous avons spans include auxiliary uses with vu, voulu and fait, possession of a report, and « n’avons pour elle que tendresse ». The shared meaning includes both have and auxiliary avoir; all three questions use the correct first-person plural form.' },
  { id: 'srf_zola_ait_avoir:sns_zola_avoir_possess_auxiliary', count: 3, rationale: 'The three subjunctive ait occurrences serve as the auxiliary in « ait pu », « ait jamais veuës », or form « ait lieu ». The existing questions accurately distinguish the subjunctive form ait in three grammatical contexts.' },
  { id: 'srf_zola_allait_aller:sns_zola_aller_imminent', count: 4, rationale: 'All four allait passages use the imperfect of aller to project an impending event: testimony, the sun shining, approaching misery, or speaking to Mme Forestier. The three questions test this was-going-to construction and its singular form.' },
  { id: 'srf_zola_allaient_aller:sns_zola_aller_imminent', count: 2, rationale: 'The judges « allaient ... acquitter » and the friends « allaient tirer des alouettes » each describe a forthcoming action. The three questions correctly test the plural imperfect of the same prospective construction.' },
  { id: 'srf_zola_en_en:sns_zola_en_doute', count: 1, rationale: '« ne mettaient pas en doute que le fameux bordereau fût de l’écriture d’Esterhazy » uses en within mettre en doute, to call into question. The three distinct questions all test that idiom rather than a gerund or an object pronoun.' },
];
if (entries.length !== 7) throw Error('Expected seven approvals following three source splits');
const publication = loadPublication();
const subjects = new Map(editorialSubjects(publication).filter(s => s.kind === 'vocabulary' && s.language === 'fr').map(s => [s.id, s]));
const pending = new Set(auditEditorialQuality(publication).filter(i => i.kind === 'vocabulary' && i.language === 'fr').map(i => i.id));
const source = publication.sharedSources.fr;
const reviews = new Map(source.reviews.map(review => [review.id, review]));
const changes = [];
for (const entry of entries) {
  const subject = subjects.get(entry.id);
  if (!subject || !pending.has(entry.id) || subject.value.occurrences.length !== entry.count) throw Error(`Source changed: ${entry.id}`);
  const questions = source.quizzes.filter(q => q.subject.kind === 'vocabulary' && `${q.subject.surfaceFormId}:${q.subject.senseId}` === entry.id);
  if (questions.length !== 3 || new Set(questions.map(q => q.band)).size !== 3) throw Error(`Question family changed: ${entry.id}`);
  const reviewId = `vocabulary:${entry.id}`, before = reviews.get(reviewId);
  const after = approveReview('fr', 'vocabulary', entry.id, subject.value, 'Codex offline contextual review', new Date().toISOString(), entry.rationale);
  reviews.set(reviewId, after);
  changes.push({ subjectId: entry.id, reviewId, outcome: 'approve', rationale: entry.rationale, before, after, reviewedOccurrences: entry.count });
}
const files = new Map(sharedSourceFiles({ ...source, reviews: [...reviews.values()] }));
files.set(ledgerPath, { version: 1, kind: 'offline_editorial_review_batch', id: batchId, date: '2026-09-25', language: 'fr', subjectKind: 'vocabulary', reviewedIdentities: changes.length, approvals: changes.length, holds: 0, progressTransfers: [], reviewMethod: 'indexed occurrences and three questions for each unchanged identity after three semantic splits', changes });
adoptSourceFiles(publicationRoot, files, root => {
  const candidate = loadPublication(root);
  validatePublication(candidate.bundle, candidate.expressionCatalog, candidate.registry);
  if (auditEditorialQuality(candidate).some(issue => issue.kind === 'vocabulary' && entries.some(entry => entry.id === issue.id))) throw Error('Reviewed record still pending');
});
console.log(JSON.stringify({ batchId, approved: changes.length, inspectedOccurrences: changes.reduce((n, c) => n + c.reviewedOccurrences, 0) }));
