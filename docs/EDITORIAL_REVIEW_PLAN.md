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

The starting audit lists 9,087 active French and 3,102 active Spanish questions, with zero blocked quiz approvals; historical questions are tracked separately. If a lexical or expression correction changes a quiz target, affected exact-version approvals become stale and must be reviewed again.

## Review history and current checkpoint — 25 September 2026

The historical-source correction completed on 22 September; all 11 source dossiers now pass `npm run sources:check`. The current editorial audit reports 2,203 blocked records before this review queue began. French has 2,157 pending vocabulary reviews, 39 expression reviews, and 7 annotation reviews; Spanish has no remaining blocked records. French has zero blocked active quiz questions.

The initial review pass is complete for every originally unreviewed French vocabulary identity, all 39 French expression identities, and all seven French work-annotation bindings. Eighty-seven vocabulary batches record 1,878 approvals and 254 holds; the expression and annotation batches add 46 approvals. Correction batches 1–8 repaired 145 senses and one lemma while preserving the affected stable identity IDs, then rebound 555 dependent quiz approvals. Subsequent correction and clear-review batches continued from checkpoint 30 and recovery 241. The three latest editorial rounds inspected 45 occurrences and twelve dependent questions without changing learner progress or occurrence mappings. The current audit reports **47 blocked French vocabulary records**, with zero blocked expressions, annotations, active quiz approvals, or Spanish records. The next phase is to resolve these held lexical records in controlled batches, preserve or explicitly migrate learner identities, and re-review questions affected by each correction. The machine-readable next queue and validation handoff are in `docs/EDITORIAL_NEXT_PACKET.json` and `docs/EDITORIAL_HANDOFF.json`; decision history is in `docs/FR_EDITORIAL_REVIEW_PROGRESS.md` and the published editorial ledgers.

## Review sequence

1. Review the French vocabulary identities in deterministic batches of no more than 100 identities.
2. For each identity, check the lemma and part of speech, the sense in every indexed occurrence, the surface form, and reuse of an existing Surface form + Sense identity.
3. Correct, split, or hold records that do not support approval. Preserve unchanged mastery identities; genuinely corrected meanings use the approved fresh-on-view policy.
4. Review the French expressions for shared meaning, source spans, and separation from component-word identities.
5. Review all seven French work-annotation records for exact canonical reconstruction, spans, exclusions, and expressions.
6. Re-review only quizzes made stale by an underlying vocabulary or expression correction. Apply the existing language-specific grammar and distractor rules.
7. Save a recoverable checkpoint every 10–20 newly resolved identities and retain an atomic editorial ledger for each applied batch.
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

## Resume and validation workflow

1. Read `docs/EDITORIAL_HANDOFF.json` and generate `npm run editorial:packet -- --limit 10`. It groups pending records by shared sense, includes approved forms using that same sense, and collects every indexed occurrence, passage, current and historical dependent question, and same-headword candidate. Lanes (`focused_review`, `shared_sense`, `identity_candidates`) are deterministic estimates of work; no lane asserts that an answer or meaning is correct. The packet is evidence to inspect, not an approval.
2. Review each identity against all source uses and answer choices. Before changing a sense, run `npm run editorial:impact -- --sense <sense-id>` to enumerate affected active identities, occurrence passages, current questions, and historical questions. Correct or split a shared sense when its uses differ; record fresh-on-view mappings if identity changes. Keep uncertain entries pending with precise reasons. Save exact-revision decisions in a batch ledger.
3. Run the affected checks and `npm run editorial:audit` after each batch. Continue without waiting for a user reply when the established editorial rules resolve the next step. If a check fails, repair it before reviewing more records.
4. After 10–20 newly resolved identities, run `npm run editorial:checkpoint -- recovery-<count>-<date>`. It runs full checks, the local review build and editorial audit, and writes a next-step handoff into an immutable ZIP. Save that ZIP persistently before depending on it. Choose a new label every time; do not overwrite checkpoints. Restored ZIPs work without a Git repository.
5. Continue to the next packet after the checkpoint. A full queue and passing production gate are the finish line. A missing source, genuinely ambiguous interpretation or tool/session limit is a reason to hand off explicitly, not to silently mark an identity approved or declare completion.

## GitHub review checks

The single `.github/workflows/check.yml` workflow runs for pushes to `main`, `editorial/**`, and `work/**` branches and for pull requests. It installs pinned dependencies, runs `npm run check`, builds the unpublished local review candidate, and adds an editorial count table to the GitHub check summary. It fails if quizzes, expressions, annotations, or Spanish records become blocked, or if French vocabulary blockers grow above the latest handoff baseline. When the queue reaches zero, it also runs the strict release check, production build, and content check. These checks cannot confer editorial approval, publish content, or deploy a Site. The Pages workflow remains separate.
