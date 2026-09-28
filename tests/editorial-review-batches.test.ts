import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { loadPublication } from '../src/publication/repository.js';
import { approvalIssues, requiredChecks } from '../src/publication/editorial.js';
import { auditEditorialQuality, editorialSubjects } from '../src/publication/quality-audit.js';

const publication = loadPublication();

describe('offline editorial review batches', () => {
  it('keeps batch decisions bound to exact current subject revisions and records holds without approval', () => {
    const directory = new URL('../content/published/editorial-review-batches/', import.meta.url);
    const files = readdirSync(directory).filter(file => file.endsWith('.json')).sort();
    expect(files.length).toBeGreaterThan(0);
    const subjects = new Map(editorialSubjects(publication).map(subject => [`${subject.kind}:${subject.id}`, subject]));
    const reviews = new Map(publication.reviews.map(review => [review.id, review]));
    const correctionDirectory = new URL('../content/published/editorial-batches/', import.meta.url);
    const corrections = readdirSync(correctionDirectory).filter(file => file.endsWith('.json')).map(file => JSON.parse(readFileSync(new URL(file, correctionDirectory), 'utf8')) as { mappings?: { from: string }[]; resolutions?: { to: string }[] }).filter(correction => correction.mappings && correction.resolutions);
    const retiredVocabularyReviewIds = new Set(corrections.flatMap(correction => correction.mappings!.map(mapping => `vocabulary:${mapping.from}`)).filter(id => !subjects.has(id)));
    const correctedVocabularyReviewIds = new Set(corrections.flatMap(correction => correction.resolutions!.map(resolution => `vocabulary:${resolution.to}`)));
    let reviewed = 0;
    let approvals = 0;
    let holds = 0;
    const ledgerChanges: { reviewId: string; outcome: string; after: unknown }[] = [];
    const initialVocabularyReviewIds = new Set<string>();
    for (const file of files) {
      const ledger = JSON.parse(readFileSync(new URL(file, directory), 'utf8')) as {
        id: string; kind: string; reviewedIdentities: number; approvals: number; holds: number; progressTransfers: unknown[]; changes: { subjectId: string; reviewId: string; outcome: string; rationale: string; after: { status: string; subjectRevision: string; checks?: string[] }; reviewedOccurrences: number }[];
      };
      expect(ledger.kind).toBe('offline_editorial_review_batch');
      expect(ledger.progressTransfers).toEqual([]);
      expect(ledger.reviewedIdentities).toBe(ledger.changes.length);
      expect(ledger.approvals).toBe(ledger.changes.filter(change => change.outcome === 'approve').length);
      expect(ledger.holds).toBe(ledger.changes.filter(change => change.outcome === 'hold').length);
      for (const change of ledger.changes) {
        reviewed++;
        ledgerChanges.push(change);
        if (/^fr-lexical-\d{4}-\d{2}-\d{2}-\d{2}$/.test(ledger.id)) initialVocabularyReviewIds.add(change.reviewId);
        expect(change.rationale.trim().length).toBeGreaterThan(40);
        const subject = subjects.get(change.reviewId.replace(/^(vocabulary|expression|annotations):/, '$1:'));
        if (!subject) expect(retiredVocabularyReviewIds.has(change.reviewId)).toBe(true);
        const current = reviews.get(change.reviewId);
        if (change.outcome === 'approve') {
          approvals++;
          expect(change.after.status).toBe('approved');
          if (subject) expect(change.after.checks).toEqual([...requiredChecks[subject.kind]]);
        } else {
          holds++;
          expect(change.after.status).toBe('pending');
        }
        expect(current).toBeDefined();
      }
    }
    expect(reviewed).toBeGreaterThan(0);
    expect(approvals + holds).toBe(reviewed);
    const currentLedgerChanges = ledgerChanges.filter(change => JSON.stringify(reviews.get(change.reviewId)) === JSON.stringify(change.after));
    for (const change of currentLedgerChanges) {
      const subject = subjects.get(change.reviewId.replace(/^(vocabulary|expression|annotations):/, '$1:'));
      if (!subject) { expect(retiredVocabularyReviewIds.has(change.reviewId)).toBe(true); continue; }
      const current = reviews.get(change.reviewId);
      if (change.outcome === 'approve') expect(approvalIssues(current, subject.value, subject.kind, subject.id, subject.language)).toEqual([]);
      else expect(approvalIssues(current, subject.value, subject.kind, subject.id, subject.language)).toContain('approval_pending');
    }
    for (const reviewId of new Set(ledgerChanges.map(change => change.reviewId))) {
      if (currentLedgerChanges.some(change => change.reviewId === reviewId)) continue;
      expect(correctedVocabularyReviewIds.has(reviewId), reviewId).toBe(true);
      const subject = subjects.get(reviewId)!;
      expect(approvalIssues(reviews.get(reviewId), subject.value, subject.kind, subject.id, subject.language)).toEqual([]);
    }
    const outstanding = auditEditorialQuality(publication).filter(issue => issue.language === 'fr' && issue.kind === 'vocabulary');
    const currentVocabularyApprovals = new Set([
      ...currentLedgerChanges.filter(change => change.outcome === 'approve' && initialVocabularyReviewIds.has(change.reviewId) && !retiredVocabularyReviewIds.has(change.reviewId)).map(change => change.reviewId),
      ...[...correctedVocabularyReviewIds].filter(id => initialVocabularyReviewIds.has(id)),
    ]);
    expect(initialVocabularyReviewIds.size).toBe(2157);
    expect(outstanding.length).toBe(initialVocabularyReviewIds.size - currentVocabularyApprovals.size - [...retiredVocabularyReviewIds].filter(id => initialVocabularyReviewIds.has(id)).length);
  });
});
