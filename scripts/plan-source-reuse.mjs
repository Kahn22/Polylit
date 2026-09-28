import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { tokenizeFrench } from '../dist/ingestion/tokenize.js';
import { loadPublication } from '../dist/publication/repository.js';

// Planning only: a matching spelling may have several parts of speech or senses.
// No candidate is approved or published by this report.
const [workId, sourcePath] = process.argv.slice(2);
if (!/^wrk_[a-z0-9_]+$/.test(workId ?? '') || !sourcePath) throw Error('Usage: node scripts/plan-source-reuse.mjs wrk_id source-draft.txt');
const canonical = readFileSync(resolve(sourcePath), 'utf8');
const publication = loadPublication();
const frIds = new Set(publication.sharedSources.fr.legacy.content.surfaceForms.map(x => x.id));
const approved = new Map();
for (const surface of publication.bundle.surfaceForms.filter(x => frIds.has(x.id))) {
  const senses = publication.bundle.occurrences.filter(x => x.surfaceFormId === surface.id).map(x => x.senseId);
  const identities = [...new Set(senses.map(senseId => `${surface.id}:${senseId}`))];
  const key = surface.normalized;
  approved.set(key, [...new Set([...(approved.get(key) ?? []), ...identities])]);
}
const paragraphs = canonical.trimEnd().split(/\n\n/u);
const byForm = new Map();
paragraphs.forEach((paragraph, index) => {
  for (const token of tokenizeFrench(paragraph)) {
    const key = token.normalized;
    const row = byForm.get(key) ?? { form: key, count: 0, firstPassage: index + 1, examples: [], candidateIdentities: approved.get(key) ?? [] };
    row.count++;
    if (row.examples.length < 3) row.examples.push(paragraph.slice(Math.max(0, token.start - 35), Math.min(paragraph.length, token.end + 45)));
    byForm.set(key, row);
  }
});
const forms = [...byForm.values()].sort((a,b) => b.count - a.count || a.form.localeCompare(b.form,'fr'));
const count = key => forms.filter(row => row.candidateIdentities.length === key).length;
const report = { version: 1, workId, status: 'unreviewed_source_reuse_plan', sourcePath, sourceSha256: createHash('sha256').update(canonical).digest('hex'),
  passages: paragraphs.length, tokens: forms.reduce((n,row) => n+row.count,0), distinctForms: forms.length,
  existing: { noExactActiveIdentity: count(0), oneCandidate: count(1), multipleCandidates: forms.filter(row => row.candidateIdentities.length>1).length },
  caveat: 'Exact spelling reuse is a retrieval aid, never a lexical or quiz approval. Every occurrence must be checked in context; expressions and exclusions are separate.', forms };
const folder = resolve('content/pipeline', workId);
mkdirSync(folder,{recursive:true});
writeFileSync(resolve(folder,'lexical-gap-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({workId,passages:report.passages,tokens:report.tokens,distinctForms:report.distinctForms,existing:report.existing}));
