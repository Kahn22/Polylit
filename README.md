# Polylit

Polylit is a multilingual reading and spaced-repetition learning application built around canonical public-domain literature. It has eight French works and two Spanish works, with separate libraries, vocabulary progress, and quiz state. This repository contains a framework-neutral TypeScript content model, deterministic validation, reference fixtures, and a lightweight browser learner interface. It intentionally does not yet choose production authentication or a database.

The authoritative publication source is now `content/published/registry.json`, per-work packages under `content/published/works`, and shared language collections under `content/published/shared`. The old aggregate learning files remain historical migration fixtures, not the current catalog. See [Publication and performance](docs/PERFORMANCE_AND_PUBLICATION.md) for the approved architecture, safe update workflow, caching policy, and release checks.

The seven follow-up data-cleanup decisions are **in progress**, not fully complete. The local candidate now uses versioned text bindings, stable quiz choice IDs, exact target ranges, small editorial source chunks, and exact-version review records. Thirteen Spanish vocabulary identities and 39 questions have been contextually reviewed. Four flagged meaning corrections now follow the approved fresh-on-view policy: retain old progress, preserve unchanged meanings, and begin new meanings at Level 1 only when viewed in Learning View. Remaining Spanish templates, French duplicate candidates, and inherited approvals still require editorial work. See [Data cleanup status](docs/DATA_CLEANUP.md). No deployment or Git push accompanies these changes.

The learner catalog contains Émile Zola’s complete *J’Accuse…!* divided into 199 ordered sentence/thought units. Its historical linguistic/quiz review and `published` catalog state are preserved. The newer exact-version editorial gate is independent of that historical state; it must pass before publishing this cleanup candidate.

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Run locally

```bash
npm install
npm run check
npm run build:local-review
```

`build:local-review` is an explicitly unpublished inspection build written to `review-build/`, separate from the deployment output. The normal `npm run build` and `npm run content:build` enforce editorial approval and currently stop before delivery writes because the review queue is incomplete. `npm run editorial:report` refreshes the review summary and duplicate-candidate report; `npm run publication:release-check` tests release eligibility without generating a site.

Start the browser interface with `npm run dev`. The public homepage contains the future account entry points and an explicit learner-preview button; it does not collect credentials. The learner home organizes texts into Available, Reading, and Completed shelves. A learner may mark any number of texts as Reading; only Reading texts can be opened in Learning View, while both Reading and Completed texts contribute questions to general and text-specific review. Moving a text back to Available preserves mastery and due timestamps but removes its unique items from active review. Marking a text Completed preserves both progress and continuing quiz eligibility; “Read again” restores learning access. Learning View groups indexed thought units into natural passages targeting about 120 words, while preserving canonical wording without English sentence translations. A vocabulary identity or expression becomes encountered only when the learner scrolls its specific thought unit into view; opening the work or preloading a later passage does not encounter unseen material. Vocabulary below mastery Level 4 is underlined in the reader, while vocabulary at Levels 4–8 it remains tappable without an underline. Selecting an occurrence opens its lemma, contextual sense, mastery level, and next review time. Leaving a passage starts a review of due identities in that passage; the learner can complete it, skip ahead with due state unchanged, or return to reread. Book View is available from the library and reader, displays roughly eight learning passages at a time in book typography, and never creates encounters, changes mastery, schedules reviews, underlines vocabulary, or presents quizzes.

The account contract and Learner/Admin/Owner authorization boundaries are vendor-neutral. Real registration, verification, sign-in, recovery, secure server sessions, and multi-device persistence deliberately remain unconnected until a hosting and authentication architecture is approved. The preview session is labeled clearly and uses session storage only as a disposable navigation convenience; it never stores credentials or pretends to provide security.

The approved Vite production build is written into `build/` and still requires passing the exact-version editorial gate. By explicit project-owner decision, GitHub Pages temporarily deploys `review-build/` as a public review candidate while the remaining editorial records are reviewed; this preview is not an approved production release. No quiz content is generated or rewritten at learner runtime.

The detailed product and editorial rules are recorded in [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md), and the ordered production queue is recorded in [`docs/CONTENT_ROADMAP.md`](docs/CONTENT_ROADMAP.md). English sentence/thought-unit translations are intentionally excluded. English vocabulary meanings and answer choices remain only where Levels 1–5 require them.

## Content architecture

The model separates five concerns:

- `catalog`: authors, collections, ordered books, and ordered works
- `works`: canonical French source text, French sentence/thought units, notes, expressions, and indexed occurrences
- `lexicon`: the shared linguistic hierarchy `Lemma → Sense → Surface form → Indexed occurrence`
- `quizzes`: prepared, immutable-at-runtime quiz material keyed to vocabulary identity
- application services: learner state in its own module, with authentication/authorization remaining a separate future service; neither belongs in canonical content

Stable opaque IDs are permanent identity. Display numbers such as “Livre VI” and “Fable X” are ordering metadata and may change without changing references.

### Vocabulary identity

A learner vocabulary item is exactly `(surfaceFormId, senseId)`. Occurrences in any number of works point to that same pair, so mastery is shared across texts. A validator ensures that the surface form and sense belong to the same lemma. The pair's canonical key is derived with `vocabularyIdentityKey`; it is not duplicated as authoritative data.

Prepared quiz items also point to this global pair, never to a work. They are authored and validated before learner use; runtime generation is outside the design.

Vocabulary publication is automatic and derived rather than stored. A valid `Surface form + Sense` pair becomes learner-published as soon as matching prepared quiz content exists. There is no separate vocabulary publish switch to forget or duplicate. Automatic vocabulary publication does not bypass the work gate: occurrences are exposed only from a fully validated `learning_ready` or `published` work.

### Publication workflow

Works progress monotonically through:

1. `source_acquired`
2. `source_structured`
3. `processing`
4. `learning_ready`
5. `published`

At `learning_ready` and `published`, validation requires complete thought units, a complete occurrence review, no unresolved learner tokens, valid cross-references, and three prepared quiz bands covering mastery Levels 1–3, 4–5, and 6–8 for every vocabulary identity used by the work. Publication consumers should only query those two states.

`runAutonomousPublicationPipeline` executes the versioned, fail-closed workflow. Every run emits source, structure, lexical-manifest, and eventual published-bundle checksums plus a machine-readable report. Linguistic and quiz material is authored by Codex as a repository-owned offline artifact, then checked independently by deterministic validators. If that complete artifact is absent, uncertain, or invalid, the work remains hidden in `processing` with a precise diagnostic; no external AI service and no runtime learner-content generation are used.

The fixtures preserve La Fontaine's wording with conventional modern typography. They are deliberately `source_structured`: the complete source and initial thought segmentation are present, but linguistic annotation and quiz preparation still require editorial review.

## Repository layout

```text
src/
  app/                    French reading and prepared-quiz learner interface
  content/fixtures/       Reference content for the ingestion pipeline
  cli/                    Reproducible editorial commands
  domain/                 Schemas, types, validation, deterministic helpers
  ingestion/              Tokenization and review-manifest preparation
  learner/                Mastery state, timestamps, and deterministic scheduling
  pipeline/               Autonomous stage orchestration and provider-neutral contracts
content/review/            Generated manifests intended for human review
content/pipeline/          Versioned lexical manifests and machine-readable run reports
docs/                      Authoritative product and editorial specification
tests/                    Model and invariant tests
```

## Adding content

1. Assign opaque IDs; never use a book/fable number as permanent identity.
2. Preserve the canonical wording in `canonicalText` and record provenance.
3. Segment the text into ordered complete sentences, thoughts, or quoted utterances without rewriting it.
4. Add global lemmas, senses, and surface forms before occurrences.
5. Exclude proper nouns and editorial artifacts from learner occurrences. Convert useful footnotes into explicit notes.
6. Prepare global quiz items for every vocabulary identity.
7. Require both structural validation and `publication:release-check` before releasing a candidate. A historical `published` flag or a structurally valid question is not an editorial approval.

`validateContentBundle` is pure, sorts diagnostics deterministically, and does not mutate input. Re-running it on identical content produces identical output.

## Editorial ingestion

Generate review manifests for the canonical fixtures with:

```bash
npm run content:prepare
```

The command first builds the project and then writes one manifest per work under `content/review`. It uses exact character spans, normalized token values, stable content-derived candidate IDs, and a SHA-256 source digest. It deliberately records no timestamp, so identical input produces byte-identical output and unchanged files are not rewritten.

The existing `content/review/wrk_lievre_tortue.lexical-plan.json` groups the second fixture's 256 tokens into 163 first-appearance-ordered written forms and lists possible identities already present in the first fable. Matching spelling never automatically decides lemma or sense. Fixture preparation is separate from publication; rebuilding delivery no longer reruns authoring scripts or overwrites the catalog.

All new candidates start as `pending`. Capitalization is only a review hint: the pipeline never guesses that a title-cased word is or is not learner vocabulary. An editor must explicitly classify every candidate as vocabulary, a proper noun, or an editorial artifact. Vocabulary decisions additionally require an existing lemma, sense, and surface-form identity before review can be marked complete.

Build delivery from the approved registry and validate its complete source without rewriting it:

```bash
npm run content:build
npm run content:check
```

The first processed package is `content/learning/le-corbeau-et-le-renard.json`. It includes reviewed learner tokens (not a reduced “core vocabulary” list), eleven French thought units, expressions, indexed occurrences, and 294 prepared quiz items. All 98 `Surface form + Sense` identities—including the literary, figurative use of *Phénix*—have three compliant quiz bands covering Levels 1–8, so the package is `learning_ready` and its vocabulary is learner-visible as one complete set.

Learner delivery groups complete thought units into natural passages targeting 120 words (normally 80–150). Learning packages include only the current section's linguistic data and expressions. Book View has independent text-only pages of eight passages. Prepared quizzes use stable, language-specific hash buckets; all three bands for an identity stay together, and at most three upcoming questions' packages are prefetched. Ten-question review sessions are independent of storage packaging. Every payload is prepared and validated before publication; the browser never generates or rewrites questions.

## Learner scheduling

Learner scheduling is a separate deterministic module under `src/learner`. A first encounter creates Level 1 with a due time ten minutes later. Correct scheduled reviews advance exactly one level; incorrect scheduled reviews drop exactly one level and create the specified accelerated obligation. Completing an accelerated review never changes mastery and resumes the normal schedule from the completion time.

Normal intervals are 10 minutes, 1 day, 3 days, 7 days, 21 days, 60 days, 6 calendar months, and 1 calendar year for Levels 1–8. Level 8 continues with annual reviews. Review sessions freeze currently actionable items at session start and order them oldest-due first. Claims carry the learner-state revision and obligation details so a stale or duplicate submission cannot transition an obligation twice.

The authoritative browser record contains only the current mastery level, one `nextDueAt` timestamp, the active obligation kind, and a revision used for atomic transitions. Due status, overdue duration, queues, labels, and unnecessary timestamp history are derived rather than stored. Existing number-only browser mastery is preserved during the one-time migration and becomes immediately due because the old prototype had no authoritative due timestamp.

## First collection

The canonical catalog organizes individually selected works from Jean de La Fontaine's *Fables*, with their book and fable order preserved. The current pipeline fixtures are:

- Livre I, Fable I — *La Cigale et la Fourmi*
- Livre I, Fable II — *Le Corbeau et le Renard*
- Livre I, Fable X — *Le Loup et l’Agneau*
- Livre II, Fable XI — *Le Lion et le Rat*
- Livre VI, Fable X — *Le Lièvre et la Tortue* (complete, unadapted text)

## Next boundary

The next release boundary is completing the contextual editorial queue and approving any required learner-identity migration policy, followed by the exact-version release gate, browser/iPhone QA, and a separately authorized repository update and deployment. Authentication and server-side multi-device learner persistence remain separate future services.
