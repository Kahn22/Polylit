# Polylit editorial review plan

## Responsibility and publication status

Codex will perform the remaining offline contextual review. The project owner is not expected to approve every vocabulary identity or quiz question individually. The owner will be consulted only when a record exposes a genuine policy, product, or interpretation choice that cannot be resolved reliably under the established rules.

GitHub Pages may serve `review-build/` as a public review candidate while this work continues. The strict production command, `npm run build`, remains fail-closed and must not produce `build/` until the exact-version editorial gate passes.

## Starting inventory

The 2026-09-20 audit reports 2,206 blocked records:

| Language | Vocabulary | Expressions | Annotations | Quizzes | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| French | 2,157 | 39 | 8 | 0 | 2,204 |
| Spanish | 0 | 0 | 2 | 0 | 2 |
| Total | 2,157 | 39 | 10 | 0 | 2,206 |

All 12,036 active quiz questions currently have exact-version approvals. If a lexical or expression correction changes a quiz target, only the affected quiz approvals become stale and must be reviewed again.

## Review sequence

1. Review the ten work-annotation records for exact canonical reconstruction, spans, exclusions, and expressions.
2. Review the 2,157 French vocabulary identities in deterministic batches of no more than 100 identities.
3. For each identity, check the lemma and part of speech, the sense in every indexed occurrence, the surface form, and reuse of an existing Surface form + Sense identity.
4. Correct, split, or hold records that do not support approval. Preserve unchanged mastery identities; genuinely corrected meanings use the approved fresh-on-view policy.
5. Review the 39 French expressions for shared meaning, source spans, and separation from component-word identities.
6. Re-review only quizzes made stale by an underlying vocabulary or expression correction. Apply the existing language-specific grammar and distractor rules.
7. Save a recoverable checkpoint at least every 100 vocabulary identities and retain an atomic editorial ledger for each applied batch.
8. Run the complete tests, editorial audit, publication release check, and production build.

## Approval evidence

Every approval must remain bound to the exact subject revision and contain:

- language, kind, and stable subject ID;
- reviewer and review timestamp;
- a substantive rationale;
- every required check for that record kind; and
- an exact revision digest that becomes stale after relevant content changes.

Mechanical validation or migration never counts as editorial approval. Uncertain records remain pending or rejected with a reason rather than being approved automatically.

## Completion condition

The editorial project is complete when `npm run editorial:audit` reports `blockedRecords: 0` and `releaseReady: true`, followed by successful `npm run publication:release-check`, `npm run check`, and `npm run build`. At that point GitHub Pages can return to deploying the approved `build/` directory.
