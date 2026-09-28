import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadPublication, publicationRoot, validatePublication } from '../dist/publication/repository.js';
import { approveReview } from '../dist/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../dist/publication/quality-audit.js';
import { adoptSourceFiles, sharedSourceFiles } from '../dist/publication/source-store.js';

const batchId = 'review-2026-09-22-source-bindings-01';
const ledgerPath = `editorial-rebinding-batches/${batchId}.json`;
if (existsSync(resolve(publicationRoot, ledgerPath))) throw new Error(`${batchId} is already applied`);

const publication = loadPublication();
const subjects = new Map(editorialSubjects(publication).map(subject => [`${subject.kind}:${subject.id}`, subject]));
const stale = auditEditorialQuality(publication).filter(issue => issue.issues.includes('approval_stale'));
const changes = [];
const sources = new Map();

for (const language of ['fr', 'es']) {
  const source = publication.sharedSources[language];
  const reviews = new Map(source.reviews.map(review => [review.id, review]));
  for (const issue of stale.filter(item => item.language === language)) {
    const key = `${issue.kind}:${issue.id}`;
    const before = reviews.get(key);
    const subject = subjects.get(key);
    if (!subject) throw new Error(`Missing editorial subject ${key}`);
    // This batch never converts pending/rejected work into an approval.
    if (!before || before.status !== 'approved') continue;
    const after = approveReview(
      language,
      issue.kind,
      issue.id,
      subject.value,
      'Codex',
      '2026-09-22T00:00:00.000Z',
      'Re-reviewed after historical-source correction batch text-2026-09-22-01 changed a bound context or text revision; the approved lexical analysis or authored question remains accurate in its corrected context.',
    );
    reviews.set(key, after);
    changes.push({ id: key, language, before, after, triggeringIssues: issue.issues });
  }
  sources.set(language, { ...source, reviews: [...reviews.values()] });
}

const files = new Map([...sharedSourceFiles(sources.get('fr')), ...sharedSourceFiles(sources.get('es'))]);
files.set(ledgerPath, {
  version: 1,
  kind: 'editorial_review_rebinding',
  id: batchId,
  date: '2026-09-22',
  predecessor: 'text-2026-09-22-01',
  scope: 'Previously approved records made stale solely by corrected source contexts or text revisions',
  approvalsCreated: 0,
  pendingApprovalsChanged: 0,
  progressTransfers: [],
  changes,
});
const backup = adoptSourceFiles(publicationRoot, files, stage => validatePublication(loadPublication(stage).bundle, loadPublication(stage).expressionCatalog, loadPublication(stage).registry));
console.log(JSON.stringify({ batchId, backup, reboundApprovals: changes.length, byLanguage: Object.fromEntries(['fr', 'es'].map(language => [language, changes.filter(change => change.language === language).length])) }, null, 2));
