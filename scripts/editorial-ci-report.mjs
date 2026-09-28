import { appendFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadPublication } from '../dist/publication/repository.js';
import { auditEditorialQuality } from '../dist/publication/quality-audit.js';

const handoff = JSON.parse(readFileSync('docs/EDITORIAL_HANDOFF.json', 'utf8'));
const issues = auditEditorialQuality(loadPublication());
const count = (language, kind) => issues.filter(issue => issue.language === language && issue.kind === kind).length;
const frenchVocabulary = count('fr', 'vocabulary');
const baseline = handoff.blockedByKind.fr.vocabulary;
const unexpected = issues.filter(issue => issue.language !== 'fr' || issue.kind !== 'vocabulary');
const summary = [
  '## Polylit editorial checks', '',
  '| Category | Pending |', '| --- | ---: |',
  `| French vocabulary | ${frenchVocabulary} |`,
  `| French quizzes | ${count('fr', 'quiz')} |`,
  `| French expressions and annotations | ${count('fr', 'expression') + count('fr', 'annotations')} |`,
  `| Spanish records | ${issues.filter(issue => issue.language === 'es').length} |`, '',
  `Latest handoff baseline: ${baseline} French vocabulary blockers.`,
  'Pending vocabulary requires individual editorial review; these checks never approve it.', '',
].join('\n');
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
else process.stdout.write(summary);
if (unexpected.length) throw new Error(`${unexpected.length} blocker(s) outside the pending French vocabulary queue`);
if (frenchVocabulary > baseline) throw new Error(`French vocabulary blockers grew from ${baseline} to ${frenchVocabulary}; inspect revised approvals and update the handoff after valid corrections`);
if (issues.length === 0) {
  execFileSync('npm', ['run', 'publication:release-check'], { stdio: 'inherit' });
  execFileSync('npm', ['run', 'build'], { stdio: 'inherit' });
  execFileSync('npm', ['run', 'content:check'], { stdio: 'inherit' });
}
