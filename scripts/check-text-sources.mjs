import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import {currentExactCandidates, exactCandidateHash, currentFrenchLemmaSenses, frenchLemmaSnapshotHash} from './prepare-micromegas-chapter-01-shared-snapshot.mjs';
import {loadPublication} from '../dist/publication/repository.js';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';

const root = resolve(import.meta.dirname, '..');
const read = async p => JSON.parse(await readFile(p, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const normalized = text => text.replace(/\s+/gu, ' ').trim();
const errors = [];
const pending = [];
let count = 0;
for (const file of (await readdir(resolve(root, 'content/published/works'))).filter(f => f.endsWith('.json'))) {
  const { content } = await read(resolve(root, 'content/published/works', file));
  for (const source of content.sources) {
    count++;
    const id = source.workId;
    try {
      const folder = resolve(root, 'content/sources', id);
      const d = await read(resolve(folder, 'dossier.json'));
      const require = (condition, message) => { if (!condition) throw new Error(message); };
      require(d.schemaVersion === 1 && d.standardVersion === 1 && d.workId === id, 'Invalid dossier identity/version');
      for (const key of ['identity', 'edition', 'acquisition', 'canonical', 'rights', 'transformations', 'review', 'history', 'evidence']) require(d[key], `Missing ${key}`);
      require(d.identity.title && d.identity.author && d.identity.language && d.identity.originCountry.code, 'Incomplete identity');
      require(d.acquisition.resolvedUrl && d.acquisition.retrievedOn, 'Missing acquisition');
      require(d.history.length && d.evidence.length, 'Missing history/evidence');
      require(['needs_review', 'verified'].includes(d.review.status), 'Unknown review status');
      const canonical = await readFile(resolve(folder, 'canonical.txt'));
      require(canonical.toString('utf8') === source.canonicalText, 'Dossier canonical text differs from current publication');
      require(hash(canonical) === d.canonical.sha256, 'Canonical checksum mismatch');
      const units = content.units.filter(u => u.workId === id).sort((a,b) => a.ordinal - b.ordinal);
      require(units.length === d.canonical.unitCount, 'Unit count changed');
      require(normalized(units.map(u => u.text ?? u.french ?? '').join('\n')) === normalized(source.canonicalText), 'Units do not reconstruct canonical text');
      for (const item of d.evidence) {
        const path = resolve(folder, item.file);
        const rel = relative(folder, path);
        require(rel && !rel.startsWith(`..${sep}`) && rel !== '..', 'Evidence path escapes dossier');
        const bytes = await readFile(path);
        require(hash(bytes) === item.sha256 && bytes.length === item.bytes, `Evidence changed: ${item.file}`);
      }
      if (d.review.status === 'verified') {
        require(d.review.openIssues.length === 0, 'Verified dossier has unresolved issues');
        require(d.rights.status === 'verified', 'Verified dossier lacks rights verification');
        require(d.canonical.scopeVerification === 'verified', 'Verified dossier lacks scope verification');
        require(d.review.scanPagesVisuallyChecked.length > 0, 'Verified dossier lacks scan review');
        require(d.transformations.status === 'verified', 'Verified dossier lacks transformation review');
      } else {
        require(d.review.openIssues.length > 0, 'Pending dossier needs concrete issues');
        pending.push(id);
      }
    } catch (error) { errors.push(`${id}: ${error.message}`); }
  }
}
// Candidate intake is checked separately from the published bundle. A passing
// source integrity check does not approve its vocabulary, quizzes or release.
const candidateId = 'wrk_voltaire_micromegas';
try {
  const folder = resolve(root, 'content/sources', candidateId);
  const dossier = await read(resolve(folder, 'dossier.json'));
  if (dossier.acquisition.status === 'acquired') {
    const require = (ok, message) => { if (!ok) throw new Error(message); };
    require(dossier.workId === candidateId && dossier.evidence.length >= 41, 'Candidate intake/evidence incomplete');
    for (const item of dossier.evidence) {
      const path = resolve(folder, item.file);
      const rel = relative(folder, path);
      require(rel && rel !== '..' && !rel.startsWith(`..${sep}`), 'Candidate evidence path escapes dossier');
      const bytes = await readFile(path);
      require(bytes.length === item.bytes && hash(bytes) === item.sha256, `Candidate evidence changed: ${item.file}`);
    }
    const draft = await readFile(resolve(folder, dossier.canonical.candidateFile));
    const comparison = await read(resolve(folder, 'page-comparison.json'));
    const preparation = await read(resolve(folder, 'candidate-preparation.json'));
    const gap = await read(resolve(root, 'content/pipeline', candidateId, 'lexical-gap-report.json'));
    const unitPlan = await read(resolve(folder, 'unit-plan.json'));
    const batchNames = dossier.evidence.map(item => item.file).filter(name => /^chapter-01-batch-\d\d\.json$/u.test(name)).sort();
    require(batchNames.length >= 8 && batchNames.every((name, index) => name === `chapter-01-batch-${String(index + 1).padStart(2, '0')}.json`), 'Candidate batch evidence sequence has a gap');
    const batches = await Promise.all(batchNames.map(name => read(resolve(folder, name))));
    const expressions = await read(resolve(folder, 'chapter-01-expressions-01.json'));
    require(hash(draft) === dossier.canonical.candidateSha256 && comparison.draftSha256 === hash(draft), 'Candidate draft checksum mismatch');
    if (dossier.canonical.status === 'source_approved_learning_pending') {
      const approved = await readFile(resolve(folder, dossier.canonical.file));
      require(approved.equals(draft) && hash(approved) === dossier.canonical.sha256 && dossier.canonical.version === 1, 'Approved source differs from the reviewed candidate');
      require(dossier.review.status === 'source_verified_learning_pending' && dossier.review.reviewedOn && dossier.review.sourceDecision?.chapterHeadings === 'preserved_as_navigation_metadata', 'Approved source is missing editorial decision');
      require(preparation.chapters.length === unitPlan.chapters.length && preparation.chapters.every((chapter, index) => chapter.label === unitPlan.chapters[index].label && chapter.heading === unitPlan.chapters[index].heading && chapter.paragraphIndex === unitPlan.chapters[index].paragraphIndex), 'Candidate chapter navigation changed');
    }
    require(preparation.canonicalDraft.sha256 === hash(draft) && gap.sourceSha256 === hash(draft), 'Candidate planning reports are stale');
    require(unitPlan.sourceSha256 === hash(draft) && unitPlan.status === 'source_reviewed_unit_and_passage_candidate', 'Candidate unit proposal is stale or prematurely approved');
    require(unitPlan.units.length === 215 && unitPlan.passages.length === 57, 'Candidate unit proposal needs regeneration/review');
    const batchOccurrences = new Map();
    const unitPlanSha256 = hash(await readFile(resolve(folder, 'unit-plan.json')));
    const items = batches.flatMap(batch => {
      require(batch.sourceSha256 === hash(draft) && batch.unitPlanSha256 === unitPlanSha256, 'Candidate lexical review is stale');
      require(batch.items.length === (batch.expectedIdentityCount ?? 10) && batch.items.length >= 7 && batch.items.length <= 10 && new Set(batch.items.map(x => x.key)).size === batch.items.length, 'Candidate lexical batch incomplete');
      return batch.items;
    });
    require(new Set(items.map(item => item.key)).size === items.length, 'Candidate duplicate sense across batches');
    for (const item of items) {
      require(item.questions.length === 3 && item.sourceOccurrences.length > 0, `Candidate lexical draft incomplete: ${item.key}`);
      for (const occ of item.sourceOccurrences) {
        const unit = unitPlan.units[occ.unit - 1];
        require(unit?.chapter === occ.chapter && unit.text.slice(occ.start, occ.end) === occ.text && occ.text.toLocaleLowerCase('fr') === item.form, `Candidate occurrence span changed: ${item.key}`);
        const key = `${occ.unit}:${occ.start}:${occ.end}`;
        require(!batchOccurrences.has(key), `Candidate occurrence assigned twice: ${key}`);
        batchOccurrences.set(key, item.form);
      }
      for (const question of item.questions) {
        require(question.choices.length === 4 && question.choices.includes(question.answer) && new Set(question.choices).size === 4, `Candidate question choices invalid: ${item.key}`);
        if (question.band === '6-8') require(question.choices.every(choice => question.context.includes(choice)), `Candidate upper-band context missing a choice: ${item.key}`);
      }
    }
    for (const form of new Set(items.map(x => x.form))) {
      const drafted = [...batchOccurrences.values()].filter(value => value === form).length;
      const total = gap.forms.find(row => row.form === form)?.count;
      require(drafted <= total, `Candidate workwide form coverage exceeds source: ${form}`);
      require(drafted === total || items.filter(item => item.form === form).every(item => item.formCoverage === 'contextual_sense_subset'), `Candidate partial form coverage needs explicit contextual-sense scope: ${form}`);
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-qa-01.json')) {
      const qa = await read(resolve(folder, 'chapter-01-qa-01.json'));
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      require(qa.sourceSha256 === hash(draft) && qa.unitPlanSha256 === unitPlanSha256 && qa.coverageSha256 === hash(coverageBytes) && qa.items.length === 50 && qa.corrections.length === 2, 'First 50 Micromégas QA reviews are stale');
      require(qa.batchEvidence.length === 5, 'QA batch count changed');
      for (const [index,e] of qa.batchEvidence.entries()) require(e.file === batchNames[index] && e.sha256 === hash(await readFile(resolve(folder,e.file))), `QA batch reference changed: ${e.file}`);
      const seen = new Set();
      for (const entry of qa.items) {
        const item = batches.slice(0,5).flatMap(b => b.items).find(i => i.key === entry.key);
        const occ = entry.firstChapterUse;
        require(item && !seen.has(entry.key) && item.form === entry.form && entry.reviewNote.length > 25 && entry.publishedExactCandidateCount === 0 && entry.questionBands.join(',') === '1-3,4-5,6-8' && entry.questionSha256 === hash(JSON.stringify(item.questions)) && entry.occurrencesSha256 === hash(JSON.stringify(item.sourceOccurrences)) && item.sourceOccurrences.some(o => o.chapter === 1 && o.unit === occ.unit && o.start === occ.start && o.end === occ.end && o.text === occ.text), `Invalid contextual QA entry ${entry.key}`);
        seen.add(entry.key);
      }
      require(seen.size === dossier.review.chapterOne?.qaReview?.reviewedMeanings && seen.size * 3 === dossier.review.chapterOne.qaReview.reviewedQuestionBands, 'QA count differs from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-qa-02.json')) {
      const qa = await read(resolve(folder, 'chapter-01-qa-02.json'));
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      require(qa.sourceSha256 === hash(draft) && qa.unitPlanSha256 === unitPlanSha256 && qa.coverageSha256 === hash(coverageBytes) && qa.items.length === 100 && qa.corrections.length === 5, 'Next 100 Micromégas QA reviews are stale');
      require(qa.batchEvidence.length === 10, 'Second QA batch count changed');
      for (const [index,e] of qa.batchEvidence.entries()) require(e.file === batchNames[index+5] && e.sha256 === hash(await readFile(resolve(folder,e.file))), `QA batch reference changed: ${e.file}`);
      const seen = new Set();
      for (const entry of qa.items) {
        const item = batches.slice(5,15).flatMap(b => b.items).find(i => i.key === entry.key);
        const occ = entry.firstChapterUse;
        const token = coverage.tokens.find(t => t.unit === occ.unit && t.start === occ.start && t.end === occ.end);
        require(item && !seen.has(entry.key) && item.form === entry.form && entry.reviewNote.length > 60 && entry.publishedExactCandidateCount === token?.candidates.length && entry.questionBands.join(',') === '1-3,4-5,6-8' && entry.questionSha256 === hash(JSON.stringify(item.questions)) && entry.occurrencesSha256 === hash(JSON.stringify(item.sourceOccurrences)) && item.sourceOccurrences.some(o => o.chapter === 1 && o.unit === occ.unit && o.start === occ.start && o.end === occ.end && o.text === occ.text), `Invalid second QA entry ${entry.key}`);
        seen.add(entry.key);
      }
      require(seen.size === dossier.review.chapterOne?.qaReview?.additionalMeanings && seen.size * 3 === dossier.review.chapterOne.qaReview.additionalQuestionBands, 'Second QA count differs from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-qa-03.json')) {
      const qa = await read(resolve(folder, 'chapter-01-qa-03.json'));
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      require(qa.sourceSha256 === hash(draft) && qa.unitPlanSha256 === unitPlanSha256 && qa.coverageSha256 === hash(coverageBytes) && qa.items.length === 78 && qa.corrections.length === 2, 'Final 78 Micromégas chapter I QA reviews are stale');
      require(qa.batchEvidence.length === 8, 'Final QA batch count changed');
      for (const [index,e] of qa.batchEvidence.entries()) require(e.file === batchNames[index+15] && e.sha256 === hash(await readFile(resolve(folder,e.file))), `QA batch reference changed: ${e.file}`);
      const prior = [await read(resolve(folder, 'chapter-01-qa-01.json')), await read(resolve(folder, 'chapter-01-qa-02.json'))];
      const seen = new Set(prior.flatMap(q => q.items.map(i => i.key)));
      require(seen.size === 150, 'Earlier QA records overlap');
      for (const entry of qa.items) {
        const item = batches.slice(15,23).flatMap(b => b.items).find(i => i.key === entry.key);
        const occ = entry.firstChapterUse;
        const token = coverage.tokens.find(t => t.unit === occ.unit && t.start === occ.start && t.end === occ.end);
        require(item && !seen.has(entry.key) && item.form === entry.form && entry.reviewNote.length > 60 && entry.publishedExactCandidateCount === token?.candidates.length && entry.questionBands.join(',') === '1-3,4-5,6-8' && entry.questionSha256 === hash(JSON.stringify(item.questions)) && entry.occurrencesSha256 === hash(JSON.stringify(item.sourceOccurrences)) && item.sourceOccurrences.some(o => o.chapter === 1 && o.unit === occ.unit && o.start === occ.start && o.end === occ.end && o.text === occ.text), `Invalid final chapter I QA entry ${entry.key}`);
        seen.add(entry.key);
      }
      require(seen.size === 228, 'First three chapter I QA ledgers changed');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-qa-04.json')) {
      const qa = await read(resolve(folder,'chapter-01-qa-04.json'));
      const coverageBytes = await readFile(resolve(folder,'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      const prior = await Promise.all(['chapter-01-qa-01.json','chapter-01-qa-02.json','chapter-01-qa-03.json'].map(name=>read(resolve(folder,name))));
      const seen = new Set(prior.flatMap(part=>part.items.map(item=>item.key)));
      require(qa.sourceSha256===hash(draft) && qa.unitPlanSha256===unitPlanSha256 && qa.coverageSha256===hash(coverageBytes) && qa.batchEvidence.length===1 && qa.batchEvidence[0].file==='chapter-01-batch-24.json' && qa.batchEvidence[0].sha256===hash(await readFile(resolve(folder,'chapter-01-batch-24.json'))) && qa.items.length===8, 'Final eight question reviews are stale');
      for(const entry of qa.items){
        const item=batches[23].items.find(i=>i.key===entry.key), occ=entry.firstChapterUse;
        const token=coverage.tokens.find(t=>t.unit===occ.unit&&t.start===occ.start&&t.end===occ.end);
        require(item && !seen.has(entry.key) && entry.form===item.form && entry.questionSha256===hash(JSON.stringify(item.questions)) && entry.occurrencesSha256===hash(JSON.stringify(item.sourceOccurrences)) && entry.publishedExactCandidateCount===token?.candidates.length && token?.draft?.key===entry.key && entry.questionBands.join(',')==='1-3,4-5,6-8' && entry.reviewNote.length>100, `Invalid fourth QA entry ${entry.key}`);
        seen.add(entry.key);
      }
      require(seen.size===items.length && seen.size===dossier.review.chapterOne?.qaReview?.totalReviewedMeanings && seen.size*3===dossier.review.chapterOne.qaReview.totalReviewedQuestionBands, 'Complete chapter I QA count differs from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-shared-identity-01.json')) {
      const ledger = await read(resolve(folder, 'chapter-01-shared-identity-01.json'));
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      const sourceKeys = new Set(coverage.tokens.filter(t => t.draft && currentExactCandidates(t.form).length).map(t => t.draft.key));
      require(ledger.sourceSha256 === hash(draft) && ledger.unitPlanSha256 === unitPlanSha256 && ledger.coverageSha256 === hash(coverageBytes) && sourceKeys.size === 44 && ledger.items.length === sourceKeys.size, 'Chapter I shared-identity review is stale');
      const seen = new Set();
      const counts = {};
      for (const entry of ledger.items) {
        const item = items.find(i => i.key === entry.key);
        const token = coverage.tokens.find(t => t.unit === entry.sourceFirstUse.unit && t.start === entry.sourceFirstUse.start && t.end === entry.sourceFirstUse.end);
        const candidates = currentExactCandidates(entry.form);
        const selected = entry.selectedIdentity && candidates.find(c => c.identity === entry.selectedIdentity);
        require(item && token?.draft?.key === entry.key && token.text === entry.sourceFirstUse.text && sourceKeys.has(entry.key) && !seen.has(entry.key) && item.form === entry.form && item.meaning === entry.draftMeaning && entry.draftQuestionsSha256 === hash(JSON.stringify(item.questions)) && entry.publishedExactCandidateCount === candidates.length && entry.publishedExactSnapshotSha256 === exactCandidateHash(entry.form) && entry.reason.length > 45 && (!entry.selectedIdentity || (selected && entry.selectedPublishedGloss === selected.gloss && entry.selectedQuestionCount === selected.quizCount && entry.selectedPublishedOccurrenceCount === selected.publishedOccurrenceCount)) && (entry.decision !== 'reuse_ready' || selected?.quizCount === 3), `Invalid shared-identity review ${entry.key}`);
        seen.add(entry.key);
        counts[entry.decision] = (counts[entry.decision] ?? 0) + 1;
      }
      require(JSON.stringify(counts) === JSON.stringify(ledger.summary) && seen.size === dossier.review.chapterOne?.sharedIdentityReview?.draftMeaningsWithPublishedForm, 'Shared-identity decision counts differ from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-shared-lemma-01.json')) {
      const ledger = await read(resolve(folder, 'chapter-01-shared-lemma-01.json'));
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      const targets = items.filter(item => !currentExactCandidates(item.form).length).slice(0,100);
      require(ledger.sourceSha256 === hash(draft) && ledger.unitPlanSha256 === unitPlanSha256 && ledger.coverageSha256 === hash(coverageBytes) && ledger.items.length === 100 && targets.length === 100, 'Chapter I first 100 lemma reviews are stale');
      const counts = {};
      const groups = {};
      for (const [index,entry] of ledger.items.entries()) {
        const item = targets[index];
        const use = entry.firstChapterUse;
        const token = coverage.tokens.find(t => t.unit === use.unit && t.start === use.start && t.end === use.end);
        const candidates = currentFrenchLemmaSenses(item.lemma);
        const selected = entry.selectedSenseId && candidates.find(c => c.senseId === entry.selectedSenseId);
        require(entry.key === item.key && entry.form === item.form && entry.lemma === item.lemma && entry.draftMeaning === item.meaning && item.sourceOccurrences.some(o => o.chapter === 1 && o.unit === use.unit && o.start === use.start && o.end === use.end && o.text === use.text) && token?.draft?.key === item.key && entry.workwideUseCount === item.sourceOccurrences.length && entry.draftQuestionsSha256 === hash(JSON.stringify(item.questions)) && entry.publishedLemmaSenseCount === candidates.length && entry.publishedLemmaSnapshotSha256 === frenchLemmaSnapshotHash(item.lemma) && entry.reason.length > 55 && (!!entry.selectedSenseId === !!selected) && (!selected || (entry.selectedLemmaId === selected.lemmaId && entry.selectedPublishedGloss === selected.gloss && entry.selectedPublishedQuestionCount === selected.quizCount && entry.selectedPublishedOccurrenceCount === selected.publishedOccurrenceCount)), `Invalid chapter I lemma review ${entry.key}`);
        counts[entry.decision] = (counts[entry.decision] ?? 0) + 1;
        if (entry.newSenseGroup) (groups[entry.newSenseGroup] ??= []).push(entry.key);
      }
      require(JSON.stringify(counts) === JSON.stringify(ledger.summary) && counts.link_published_sense === 12 && counts.new_sense_existing_lemma === 9 && counts.new_lemma_sense === 79 && Object.keys(groups).length === 3 && groups['étoile:literal_celestial']?.join(',') === 'etoiles_stars' && Object.entries(groups).filter(([name]) => name !== 'étoile:literal_celestial').every(([,keys]) => keys.length === 2) && ledger.items.length === dossier.review.chapterOne?.sharedLemmaReview?.reviewedNoExactFormMeanings, 'Lemma review totals or shared new-sense groups differ from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-shared-lemma-02.json')) {
      const ledger = await read(resolve(folder, 'chapter-01-shared-lemma-02.json'));
      const earlier = await read(resolve(folder, 'chapter-01-shared-lemma-01.json'));
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      const targets = items.filter(item => !currentExactCandidates(item.form).length).slice(100);
      require(ledger.sourceSha256 === hash(draft) && ledger.unitPlanSha256 === unitPlanSha256 && ledger.coverageSha256 === hash(coverageBytes) && ledger.items.length === 92 && targets.length === 92 && ledger.remainingMeanings === 0, 'Final 92 lemma comparisons are incomplete or stale');
      const counts = {}, groups = {}, seen = new Set(earlier.items.map(item => item.key));
      for (const [index,entry] of ledger.items.entries()) {
        const item = targets[index], use = entry.firstChapterUse;
        const token = coverage.tokens.find(t => t.unit === use.unit && t.start === use.start && t.end === use.end);
        const candidates = currentFrenchLemmaSenses(item.lemma);
        const selected = entry.selectedSenseId && candidates.find(c => c.senseId === entry.selectedSenseId);
        require(entry.key === item.key && !seen.has(entry.key) && entry.form === item.form && entry.lemma === item.lemma && entry.draftMeaning === item.meaning && item.sourceOccurrences.some(o => o.chapter === 1 && o.unit === use.unit && o.start === use.start && o.end === use.end && o.text === use.text) && token?.draft?.key === item.key && entry.workwideUseCount === item.sourceOccurrences.length && entry.draftQuestionsSha256 === hash(JSON.stringify(item.questions)) && entry.publishedLemmaSenseCount === candidates.length && entry.publishedLemmaSnapshotSha256 === frenchLemmaSnapshotHash(item.lemma) && entry.reason.length > 55 && (!!entry.selectedSenseId === !!selected) && (!selected || (entry.selectedLemmaId === selected.lemmaId && entry.selectedPublishedGloss === selected.gloss && entry.selectedPublishedQuestionCount === selected.quizCount && entry.selectedPublishedOccurrenceCount === selected.publishedOccurrenceCount)), `Invalid final lemma review ${entry.key}`);
        seen.add(entry.key);
        counts[entry.decision] = (counts[entry.decision] ?? 0) + 1;
        if (entry.newSenseGroup) (groups[entry.newSenseGroup] ??= []).push(entry.key);
        if (entry.relatedEarlierDraft) require(earlier.items.some(prior => prior.key === entry.relatedEarlierDraft), `Missing earlier grouped sense ${entry.key}`);
      }
      require(JSON.stringify(counts) === JSON.stringify(ledger.summary) && counts.new_lemma_sense === 66 && counts.link_published_sense === 16 && counts.new_sense_existing_lemma === 10 && groups['géomètre:geometry_specialist']?.length === 1 && groups['voyager:travel']?.length === 2 && Object.keys(groups).length === 2 && seen.size === 192 && ledger.items.length === dossier.review.chapterOne?.sharedLemmaReview02?.reviewedNoExactFormMeanings, 'Final lemma review totals or shared new-sense groups differ from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-identity-plan.json')) {
      const plan = await read(resolve(folder, 'chapter-01-identity-plan.json'));
      const decisions = [...(await read(resolve(folder, 'chapter-01-shared-identity-01.json'))).items,...(await read(resolve(folder, 'chapter-01-shared-lemma-01.json'))).items,...(await read(resolve(folder, 'chapter-01-shared-lemma-02.json'))).items];
      const byKey = new Map(decisions.map(item => [item.key,item]));
      const counts = {},groups = {};
      require(plan.sourceSha256 === hash(draft) && plan.unitPlanSha256 === unitPlanSha256 && plan.coverageSha256 === hash(await readFile(resolve(folder,'chapter-01-coverage.json'))) && plan.items.length === items.length && byKey.size === items.length && Object.entries(plan.reviewEvidence).every(([name,digest]) => dossier.evidence.some(e=>e.file===name && e.sha256===digest)), 'Chapter I identity mapping is stale');
      for (const [index,entry] of plan.items.entries()) {
        const item=items[index], decision=byKey.get(item.key);
        require(entry.key === item.key && entry.form === item.form && entry.lemma === item.lemma && entry.meaning === item.meaning && entry.priorDecision === decision.decision && entry.questionSha256 === hash(JSON.stringify(item.questions)) && entry.sourceOccurrencesSha256 === hash(JSON.stringify(item.sourceOccurrences)) && entry.workwideUseCount === item.sourceOccurrences.length && entry.chapterOneUseCount === item.sourceOccurrences.filter(o=>o.chapter===1).length && entry.questionBands.join(',') === '1-3,4-5,6-8' && (entry.route !== 'reuse_exact_published_identity' || entry.targetIdentity === decision.selectedIdentity) && (entry.route !== 'published_identity_pending_first_use_approval' || (entry.key === 'ciel_visible_sky' && entry.targetIdentity === decision.selectedIdentity)) && (entry.route !== 'add_surface_to_published_sense' || (entry.targetSenseId === decision.selectedSenseId || (entry.key === 'met_begins_reflexive' && entry.targetSenseId === 'sns_fr_mettre_reflexive_begin'))), `Invalid identity mapping ${item.key}`);
        counts[entry.route]=(counts[entry.route]??0)+1;
        if(entry.intendedSenseGroup)(groups[entry.intendedSenseGroup]??=[]).push(entry.key);
      }
      require(JSON.stringify(counts) === JSON.stringify(plan.summary) && counts.new_lemma_and_sense === 145 && counts.new_sense === 56 && counts.add_surface_to_published_sense === 29 && counts.reuse_exact_published_identity === 5 && counts.published_identity_pending_first_use_approval === 1 && ['habitant:person_residing','planète:celestial_body','géomètre:geometry_specialist','voyager:travel','étoile:literal_celestial'].every(g=>groups[g]?.length===2) && JSON.stringify(Object.fromEntries(Object.entries(groups).filter(([,keys])=>keys.length>1)))===JSON.stringify(plan.sharedNewSenseGroups) && dossier.review.chapterOne?.identityPlan?.mappedMeanings===236, 'Chapter I identity plan totals differ from evidence');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-published-repair-plan.json')) {
      const repair=await read(resolve(folder,'chapter-01-published-repair-plan.json'));
      const publication=loadPublication();
      require(repair.sourceSha256===hash(draft) && repair.items.length===3 && repair.items.map(i=>i.key).join(',')==='soeur_sibling,ciel_visible_sky,oiseau_bird' && repair.status==='published_gloss_repairs_applied_sky_questions_prepared_pending_first_use' && repair.publicationBatchId==='fr-micromegas-shared-repair-2026-09-27-01', 'Chapter I published repair record is stale');
      for(const entry of repair.items){
        const sense=publication.bundle.senses.find(s=>s.id===entry.senseId);
        const item=items.find(i=>i.key===entry.key);
        require(sense && item && entry.publishedSenseSnapshotSha256===hash(JSON.stringify(sense)) && entry.draftQuestionsSha256===hash(JSON.stringify(item.questions)) && entry.publishedIdentityDependencies.length>0, `Repair changed under ${entry.key}`);
        for(const dep of entry.publishedIdentityDependencies){
          const old=publication.bundle.occurrences.filter(o=>o.surfaceFormId===dep.surfaceId&&o.senseId===entry.senseId).map(o=>({id:o.id,workId:o.workId,unitId:o.unitId,start:o.start,end:o.end}));
          const quizzes=[...publication.preparedQuizzes.values()].filter(q=>q.subject?.surfaceFormId===dep.surfaceId&&q.subject?.senseId===entry.senseId).map(q=>({id:q.id,band:q.band,sha256:hash(JSON.stringify(q))}));
          require(JSON.stringify(old)===JSON.stringify(dep.occurrences) && JSON.stringify(quizzes)===JSON.stringify(dep.quizzes), `Published repair dependencies changed under ${entry.key}`);
        }
      }
      require(dossier.review.chapterOne?.publishedRepairPlan?.heldRepairs===1 && dossier.review.chapterOne.publishedRepairPlan.completedRepairs===2, 'Repair outcomes differ from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-coverage.json')) {
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const coverage = JSON.parse(coverageBytes);
      require(coverage.sourceSha256 === hash(draft) && coverage.unitPlanSha256 === unitPlanSha256 && coverage.summary.tokenUses === 1020 && coverage.summary.distinctForms === 422, 'Chapter I inventory is stale or incomplete');
      const indexed = new Set();
      for (const token of coverage.tokens) {
        const unit = unitPlan.units[token.unit - 1];
        const key = `${token.unit}:${token.start}:${token.end}`;
        require(unit?.chapter === 1 && unit.text.slice(token.start, token.end) === token.text && !indexed.has(key), `Chapter I inventory span invalid: ${key}`);
        indexed.add(key);
        if (token.draft) require(batchOccurrences.get(key) === token.form, `Inventory draft disagrees: ${key}`);
      }
      require(indexed.size === coverage.summary.tokenUses && coverage.tokens.filter(token => token.draft).length === coverage.summary.draftedTokenUses, 'Inventory token totals disagree');
      const claimed = new Set();
      for (const name of dossier.evidence.map(entry => entry.file).filter(name => /^chapter-01-(reuse|ambiguous)-\d\d\.json$/u.test(name)).sort()) {
        const packet = await read(resolve(folder, name));
        require(packet.coverageSha256 === hash(coverageBytes), `Stale chapter I packet ${name}`);
        for (const item of packet.items) for (const occ of item.occurrences) {
          const key = `${occ.unit}:${occ.start}:${occ.end}`;
          const token = coverage.tokens.find(value => value.unit === occ.unit && value.start === occ.start && value.end === occ.end);
          require(token && !token.draft && token.disposition !== 'proper_name_exclusion_to_verify' && token.form === item.form && token.text === occ.text && !claimed.has(key), `Invalid or duplicate chapter I reuse: ${name} ${key}`);
          require(token.candidates.some(candidate => candidate.identity === (occ.identity ?? item.identity) && candidate.preparedBands.join(',') === 'levels_1_3,levels_4_5,levels_6_8'), `Chapter I published sense/questions changed: ${name} ${key}`);
          claimed.add(key);
        }
      }
      require(claimed.size === dossier.review.chapterOne?.reuseReview?.indexedOccurrences, 'Chapter I reuse count differs from dossier');
      if (dossier.evidence.some(entry => entry.file === 'chapter-01-names-01.json')) {
        const names = await read(resolve(folder, 'chapter-01-names-01.json'));
        require(names.coverageSha256 === hash(coverageBytes), 'Chapter I proper-name decision stale');
        let excluded = 0;
        for (const name of names.names) for (const occ of name.occurrences) {
          const key = `${occ.unit}:${occ.start}:${occ.end}`;
          const token = coverage.tokens.find(value => value.unit === occ.unit && value.start === occ.start && value.end === occ.end);
          require(token?.form === name.form && token.disposition === 'proper_name_exclusion_to_verify' && !claimed.has(key), `Invalid chapter I proper-name exclusion: ${key}`);
          claimed.add(key);
          excluded++;
        }
        require(excluded === 24 && names.honorific.occurrences.length === 3 && names.honorific.status === 'reuse_published_abbreviated_surface_and_three_questions', 'Chapter I name/honorific decisions incomplete');
        for (const occ of names.honorific.occurrences) {
          const unit = unitPlan.units[occ.unit - 1];
          require(unit?.chapter === 1 && unit.text.slice(occ.start, occ.end) === 'M' && unit.text[occ.end] === '.', 'Chapter I honorific no longer matches the printed source');
        }
      }
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-phrase-components.json')) {
      const coverageBytes = await readFile(resolve(folder, 'chapter-01-coverage.json'));
      const packet = await read(resolve(folder, 'chapter-01-phrase-components.json'));
      require(packet.coverageSha256 === hash(coverageBytes) && packet.expressionEvidenceSha256 === hash(await readFile(resolve(folder, 'chapter-01-expressions-01.json'))) && packet.items.length === 5, 'Stale or incomplete chapter I phrase components');
      const coverage = JSON.parse(coverageBytes);
      const used = new Set();
      for (const item of packet.items) {
        const occ = item.occurrence;
        const key = `${occ.unit}:${occ.start}:${occ.end}`;
        const token = coverage.tokens.find(value => value.unit === occ.unit && value.start === occ.start && value.end === occ.end);
        const phrase = expressions.items.find(value => value.key === item.expressionKey);
        require(token && !token.draft && token.disposition !== 'proper_name_exclusion_to_verify' && token.form === item.form && token.text === occ.text && !used.has(key) && phrase?.occurrences.some(value => value.unit === occ.unit && value.start <= occ.start && value.end >= occ.end) && (phrase.questions?.length === 3 || phrase.existing?.vocabularyIdentity), `Invalid phrase component ${key}`);
        for (const name of dossier.evidence.map(entry => entry.file).filter(name => /^chapter-01-(reuse|ambiguous)-\d\d\.json$/u.test(name))) {
          const reuse = await read(resolve(folder, name));
          require(!reuse.items.some(value => value.occurrences.some(o => o.unit === occ.unit && o.start === occ.start && o.end === occ.end)), `Phrase component overlaps published reuse ${key}`);
        }
        used.add(key);
      }
      require(dossier.review.chapterOne?.phraseComponentReview?.coveredTokenUses === used.size, 'Phrase component count differs from dossier');
      require(coverage.summary.draftedTokenUses + dossier.review.chapterOne.reuseReview.indexedOccurrences + dossier.review.chapterOne.nameReview.excludedTokenUses + used.size === coverage.summary.tokenUses, 'Chapter I has an unassigned token');
    }
    require(expressions.sourceSha256 === hash(draft) && expressions.unitPlanSha256 === unitPlanSha256 && expressions.items.length === 11, 'Candidate expression triage is stale or incomplete');
    require(expressions.items.filter(x => x.questions).length === 4 && expressions.items.filter(x => x.disposition.includes('hold')).length === 0, 'Candidate expression decisions changed');
    require(expressions.items.find(x => x.key === 'a_peu_pres')?.disposition === 'reuse_existing_vocabulary_identity_no_new_expression_mastery', 'Existing à peu près mastery must be reused');
    for (const item of expressions.items) {
      require(item.occurrences.length > 0, `Candidate expression lacks source evidence: ${item.key}`);
      for (const occ of item.occurrences) {
        const unit = unitPlan.units[occ.unit - 1];
        require(unit?.chapter === occ.chapter && unit.text.slice(occ.start, occ.end) === occ.text, `Candidate expression span changed: ${item.key}`);
      }
      if (item.questions) {
        require(item.questions.length === 3 && item.questions[1].context.includes('___') && item.questions[1].answer === item.surface, `Candidate expression questions incomplete: ${item.key}`);
        for (const question of item.questions) require(question.choices.length === 4 && new Set(question.choices).size === 4 && question.choices.includes(question.answer), `Candidate expression choices invalid: ${item.key}`);
        require(item.questions[2].choices.every(choice => item.questions[2].context.includes(choice)), `Candidate upper-band expression context incomplete: ${item.key}`);
      }
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-01-expression-qa.json')) {
      const ledger = await read(resolve(folder, 'chapter-01-expression-qa.json'));
      require(ledger.sourceSha256 === hash(draft) && ledger.unitPlanSha256 === unitPlanSha256 && ledger.expressionEvidenceSha256 === hash(await readFile(resolve(folder, 'chapter-01-expressions-01.json'))) && ledger.items.length === 4, 'Expression question review is stale');
      const keys = new Set();
      for (const entry of ledger.items) {
        const phrase = expressions.items.find(item => item.key === entry.key);
        require(phrase?.questions && !keys.has(entry.key) && entry.surface === phrase.surface && entry.meaning === phrase.meaning && entry.questionSha256 === hash(JSON.stringify(phrase.questions)) && entry.occurrencesSha256 === hash(JSON.stringify(phrase.occurrences)) && entry.questionBands.join(',') === '1-3,4-5,6-8' && entry.reviewNote.length > 100 && entry.masteryOccurrences.length > 0 && entry.masteryOccurrences.every(occ => phrase.occurrences.some(o => JSON.stringify(o) === JSON.stringify(occ))) && (entry.key !== 'au_bout_de' || entry.masteryOccurrences.every(o => o.chapter === 7)), `Invalid expression QA ${entry.key}`);
        keys.add(entry.key);
      }
      require(keys.size === dossier.review.chapterOne?.expressionQuestionReview?.reviewedExpressions && keys.size * 3 === dossier.review.chapterOne.expressionQuestionReview.reviewedBands, 'Expression QA totals differ from dossier');
    }
    if (dossier.evidence.some(entry => entry.file === 'chapter-02-coverage.json')) {
      const coverage = await read(resolve(folder, 'chapter-02-coverage.json'));
      const chapterUnits = unitPlan.units.filter(unit => unit.chapter === 2);
      const expected = chapterUnits.flatMap(unit => tokenizeFrench(unit.text).map(token => `${unit.ordinal}:${token.start}:${token.end}:${token.text}`));
      const actual = coverage.tokens.map(token => `${token.unit}:${token.start}:${token.end}:${token.text}`);
      require(coverage.chapter === 2 && coverage.sourceSha256 === hash(draft) && coverage.unitPlanSha256 === unitPlanSha256 && JSON.stringify(expected) === JSON.stringify(actual), 'Chapter II exhaustive token inventory differs from source');
      const dispositionCount = kind => coverage.tokens.filter(token => token.disposition === kind).length;
      const summary = coverage.summary;
      require(summary.tokenUses === 1035 && summary.draftedTokenUses === dispositionCount('drafted_pending_signoff') && summary.reusedTokenUses === dispositionCount('published_identity_reuse_context_reviewed') && summary.excludedProperNameUses === dispositionCount('proper_name_excluded_from_vocabulary') && summary.coveredPhraseComponents === dispositionCount('phrase_component_covered_no_independent_vocabulary') && summary.unresolvedTokenUses === summary.tokenUses - summary.draftedTokenUses - summary.reusedTokenUses - summary.excludedProperNameUses - summary.coveredPhraseComponents && JSON.stringify(summary) === JSON.stringify(dossier.review.chapterTwo.progress && Object.fromEntries(Object.keys(summary).map(k => [k,dossier.review.chapterTwo.progress[k]]))), 'Chapter II dispositions or dossier counts disagree');
      const claimed = new Set();
      const verifyOcc = (occ,kind,id) => {
        const key = `${occ.unit}:${occ.start}:${occ.end}`;
        const token = coverage.tokens.find(token => `${token.unit}:${token.start}:${token.end}` === key);
        require(token?.text === occ.text && token.disposition === kind && !claimed.has(key), `Invalid overlapping chapter II occurrence ${id} ${key}`);
        claimed.add(key);
      };
      for (const item of items) for (const occ of item.sourceOccurrences.filter(occ=>occ.chapter===2)) verifyOcc(occ,'drafted_pending_signoff',item.key);
      const chapterBatches = dossier.evidence.map(entry => entry.file).filter(name => /^chapter-02-batch-\d\d\.json$/u.test(name)).sort();
      require(chapterBatches.length === dossier.review.chapterTwo.progress.batchCount && chapterBatches.every((name,index) => name === `chapter-02-batch-${String(index+1).padStart(2,'0')}.json`), 'Chapter II draft batch sequence differs');
      let draftCount = 0;
      for (const name of chapterBatches) {
        const batch = await read(resolve(folder,name));
        require(batch.chapter === 2 && batch.sourceSha256 === hash(draft) && batch.unitPlanSha256 === unitPlanSha256 && batch.items.length === (batch.expectedIdentityCount ?? 10) && batch.items.length >= 1 && batch.items.length <= 10, `Stale chapter II draft ${name}`);
        draftCount += batch.items.length;
        for (const item of batch.items) {
          require(item.questions.map(q=>q.band).join(',') === '1-3,4-5,6-8' && item.questions.every(q=>q.choices.length===4 && new Set(q.choices).size===4 && q.choices.includes(q.answer)) && item.questions[1].context.includes('___') && item.questions[2].choices.every(choice=>item.questions[2].context.toLocaleLowerCase('fr').includes(choice.toLocaleLowerCase('fr'))), `Invalid chapter II question shape ${item.key}`);
          for (const occ of item.sourceOccurrences) verifyOcc(occ,'drafted_pending_signoff',item.key);
        }
      }
      require(draftCount === dossier.review.chapterTwo.progress.newMeaningDrafts && draftCount * 3 === dossier.review.chapterTwo.progress.newQuestionBands, 'Chapter II draft counts differ');
      const packets = dossier.evidence.map(entry => entry.file).filter(name => /^chapter-02-(?:reuse|ambiguous)-\d\d\.json$/u.test(name));
      for (const name of packets) {
        const packet = await read(resolve(folder,name));
        require(packet.chapter === 2 && packet.sourceSha256 === hash(draft) && packet.unitPlanSha256 === unitPlanSha256, `Stale chapter II reuse ${name}`);
        for (const item of packet.items) for (const occ of item.occurrences) {
          verifyOcc(occ,'published_identity_reuse_context_reviewed',name);
          const token = coverage.tokens.find(token=>token.unit===occ.unit&&token.start===occ.start);
          require(token.reuse?.file===name && token.candidates.some(candidate=>candidate.identity===(occ.identity??item.identity) && candidate.preparedBands.join(',')==='levels_1_3,levels_4_5,levels_6_8'), `Chapter II reuse candidate missing ${name}`);
        }
      }
      require(packets.length===dossier.review.chapterTwo.progress.publishedReusePackets, 'Chapter II reuse packet count differs');
      const names = await read(resolve(folder,'chapter-02-names.json'));
      for (const item of names.names) for (const occ of item.occurrences) verifyOcc(occ,'proper_name_excluded_from_vocabulary',item.form);
      const expressions = await read(resolve(folder,'chapter-02-expressions.json'));
      require(expressions.sourceSha256===hash(draft) && expressions.unitPlanSha256===unitPlanSha256 && expressions.items.length===dossier.review.chapterTwo.progress.expressionTriages, 'Chapter II expression triage differs');
      let expressionBands=0;
      for (const item of expressions.items) {
        for (const occ of item.occurrences) require(unitPlan.units[occ.unit-1].text.slice(occ.start,occ.end)===occ.text, `Stale chapter II expression ${item.key}`);
        if (item.questions) {
          expressionBands += item.questions.length;
          require(item.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8' && item.questions.every(q=>q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer)) && item.questions[1].context.includes('___') && item.questions[2].choices.every(choice=>item.questions[2].context.toLocaleLowerCase('fr').includes(choice.toLocaleLowerCase('fr'))), `Invalid chapter II expression questions ${item.key}`);
        }
      }
      require(expressionBands===dossier.review.chapterTwo.progress.newExpressionQuestionBands, 'Chapter II expression question count differs');
      const components = await read(resolve(folder,'chapter-02-phrase-components.json'));
      require(components.sourceSha256===hash(draft) && components.unitPlanSha256===unitPlanSha256, 'Chapter II phrase component evidence is stale');
      for (const item of components.items) {
        require(expressions.items.some(phrase=>phrase.key===item.expressionKey), `Unknown chapter II expression ${item.expressionKey}`);
        verifyOcc(item.occurrence,'phrase_component_covered_no_independent_vocabulary',item.expressionKey);
      }
      const packet = await read(resolve(folder,'chapter-02-identity-packet.json'));
      const plan = await read(resolve(folder,'chapter-02-identity-plan.json'));
      const packetSha256 = hash(await readFile(resolve(folder,'chapter-02-identity-packet.json')));
      const planSha256 = hash(await readFile(resolve(folder,'chapter-02-identity-plan.json')));
      require(packet.items.length===draftCount && plan.items.length===draftCount && packet.sourceSha256===hash(draft) && plan.identityPacketSha256===packetSha256 && plan.sourceSha256===hash(draft) && packet.unitPlanSha256===unitPlanSha256 && plan.unitPlanSha256===unitPlanSha256, 'Chapter II identity evidence is stale');
      const draftsByKey = new Map();
      for (const name of chapterBatches) for (const item of (await read(resolve(folder,name))).items) draftsByKey.set(item.key,{name,item});
      require(draftsByKey.size===draftCount && packet.items.map(i=>i.key).join(',')===plan.items.map(i=>i.key).join(','), 'Chapter II identity routes omit or duplicate meanings');
      for (const [index,entry] of plan.items.entries()) {
        const original=draftsByKey.get(entry.key),candidate=packet.items[index];
        require(original?.name===entry.batchFile && candidate.batchFile===entry.batchFile && entry.questionSha256===hash(JSON.stringify(original.item.questions)) && candidate.questionSha256===entry.questionSha256 && entry.sourceOccurrencesSha256===hash(JSON.stringify(original.item.sourceOccurrences)) && candidate.sourceOccurrencesSha256===entry.sourceOccurrencesSha256 && entry.route && entry.rationale.length>40, `Chapter II identity route drift ${entry.key}`);
        if(entry.route==='link_published_sense') require(candidate.publishedLemmaCandidates.some(lemma=>lemma.lemmaId===entry.targetLemmaId && lemma.senses.some(sense=>sense.senseId===entry.targetSenseId)), `Chapter II published link missing ${entry.key}`);
        if(entry.route==='new_sense_existing_lemma') require(candidate.publishedLemmaCandidates.some(lemma=>lemma.lemmaId===entry.targetLemmaId), `Chapter II existing lemma missing ${entry.key}`);
        if(entry.route==='link_planned_chapter_one_sense') require(candidate.chapterOneRelated.some(prior=>prior.intendedSenseGroup===entry.intendedSenseGroup && prior.route==='new_lemma_and_sense'), `Chapter I shared plan missing ${entry.key}`);
        if(entry.route==='new_lemma_and_sense') require(candidate.publishedLemmaCandidates.length===0 && entry.intendedSenseGroup, `Chapter II new lemma decision invalid ${entry.key}`);
      }
      require(JSON.stringify(Object.fromEntries([...new Set(plan.items.map(entry=>entry.route))].map(route=>[route,plan.items.filter(entry=>entry.route===route).length])))===JSON.stringify(plan.summary) && JSON.stringify(plan.summary)===JSON.stringify(dossier.review.chapterTwo.progress.identityRoutes), 'Chapter II identity route totals differ');
      const qaFiles=dossier.evidence.map(entry=>entry.file).filter(name=>/^chapter-02-qa-\d\d\.json$/u.test(name)).sort();
      const reviewedKeys=new Set();
      for(const name of qaFiles){
        const qa=await read(resolve(folder,name));
        require(qa.sourceSha256===hash(draft) && qa.unitPlanSha256===unitPlanSha256 && qa.coverageSha256===hash(await readFile(resolve(folder,'chapter-02-coverage.json'))) && qa.identityPacketSha256===packetSha256 && qa.identityPlanSha256===planSha256, `Chapter II QA stale ${name}`);
        for(const evidence of qa.batchEvidence) require(evidence.sha256===hash(await readFile(resolve(folder,evidence.file))), `Chapter II QA batch changed ${evidence.file}`);
        for(const entry of qa.items){
          const original=draftsByKey.get(entry.key);
          require(original?.name===entry.batchFile && !reviewedKeys.has(entry.key) && entry.questionBands.join(',')==='1-3,4-5,6-8' && entry.questionSha256===hash(JSON.stringify(original.item.questions)) && entry.sourceOccurrencesSha256===hash(JSON.stringify(original.item.sourceOccurrences)) && entry.reviewNote.length>75 && entry.identityRoute===plan.items.find(route=>route.key===entry.key)?.route, `Chapter II QA invalid ${entry.key}`);
          reviewedKeys.add(entry.key);
        }
      }
      require(reviewedKeys.size===draftCount && reviewedKeys.size===dossier.review.chapterTwo.progress.questionReviewedMeanings && reviewedKeys.size*3===dossier.review.chapterTwo.progress.questionReviewedBands, 'Chapter II question QA incomplete');
      const expressionQa=await read(resolve(folder,'chapter-02-expression-qa.json'));
      require(expressionQa.sourceSha256===hash(draft) && expressionQa.unitPlanSha256===unitPlanSha256 && expressionQa.expressionEvidenceSha256===hash(await readFile(resolve(folder,'chapter-02-expressions.json'))) && expressionQa.items.length===1 && expressionQa.items.length*3===dossier.review.chapterTwo.progress.expressionReviewedBands, 'Chapter II expression QA stale');
      for(const entry of expressionQa.items){const phrase=expressions.items.find(item=>item.key===entry.key);require(phrase?.questions?.length===3 && entry.questionSha256===hash(JSON.stringify(phrase.questions)) && entry.occurrencesSha256===hash(JSON.stringify(phrase.occurrences)) && entry.questionBands.join(',')==='1-3,4-5,6-8' && entry.reviewNote.length>100, `Chapter II expression QA invalid ${entry.key}`);}
      require(claimed.size === summary.tokenUses - summary.unresolvedTokenUses, 'Chapter II reviewed coverage has an unindexed token');
    }
    require(comparison.wordSequenceMismatches === 0 && comparison.pages.length === 18 && preparation.chapters.length === 7, 'Candidate scope check incomplete');
    require(dossier.review.status !== 'verified' && dossier.review.openIssues.length > 0, 'Candidate marked fully verified without learning review');
    console.log('Micromégas candidate: source evidence, chapter navigation and draft/planning checksums valid; learning review pending.');
  }
} catch (error) { errors.push(`${candidateId}: ${error.message}`); }
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Source dossiers: ${count} structurally valid; ${pending.length} awaiting full editorial/source verification.`);
  console.log('Pending source review does not block the existing Pages review-build workflow.');
}
