# Approved data cleanup — local implementation checkpoint

The user approved seven follow-up suggestions individually and then authorized local implementation. **No publishing or GitHub update is authorized by this work.** The earlier twelve performance improvements are retained. This checkpoint does not claim the full editorial cleanup is finished.

## Status

| Decision | Implemented | Remaining |
| --- | --- | --- |
| Spanish linguistic hierarchy | Thirteen reviewed identities, including four corrected/separated meanings; approved fresh-on-view progress policy; correct parts of speech, headwords, and grammatical features for this subset | 927 Spanish identities need contextual review |
| Quiz approval records | Exact-version records, explicit pending/approved states, review evidence, lexical-dependency invalidation, strict release gate; 39 reviewed Spanish questions | 2,781 active Spanish template questions; bind/verify inherited French editorial evidence rather than pretending a mechanical migration is review |
| French duplicate review | Generated 35 candidate groups with senses/forms/work references; preview-only alias conflict checks; ordinary import blocks implicit reassignment | Review candidates individually; approve any merge and its mastery collision policy before applying it |
| Explicit answer/target identity | Authored and delivered stable choice IDs; correctChoiceId scoring; exact UTF-16 target ranges; no first-substring guessing | 54 French and 3 Spanish early questions require explicit target selection before release |
| Text revisions | Exact reconstruction and UTF-16 unit anchors for all ten works; separate text/structure/annotation revisions; metadata-only edits do not revise text | Complete annotation review evidence; any future text edits require affected annotations to be re-anchored/reviewed |
| Expression roles | Work-level explanatory notes and shared learnable expressions explicitly tagged; legacy compatibility adapter; language checks | Review five historical Corbeau notes for possible future promotion; prepare three questions before promoting any note |
| Smaller authoring files | Version-2 manifests with stable ID-hash chunks for lemmas, senses, forms, quizzes, learnable expressions, and reviews | No further format migration required; contextual editorial work continues in these files |

## Publication safety

The inclusion registry still protects the ten works. Its approval and a work's historical `published` state do **not** certify the new editorial review policy.

The ordinary `npm run build`, `build:delivery`, and `content:build` paths call the exact-version editorial gate **before writing delivery content**. Pending, missing, stale, or incomplete approvals and known template questions block publication. `npm run publication:release-check` checks eligibility without generating output.

For unpublished engineering inspection only:

```sh
npm run check
npm run build:local-review
npm run editorial:report
```

The local review build deliberately permits pending content and is not an approved release. Its output is isolated in ignored `review-build/`, not the configured Sites deployment directory `build/`. Do not upload it or bypass the normal build for deployment. The original hosted Site and user GitHub repository have not changed. A failed normal build is expected while this queue remains incomplete; it is not a runtime loading failure.

Structural tests do not certify natural language quality. No migration script calls the review-approval function. The initial migration marks inherited questions and lexical records pending; existing historical reviews must be checked and linked to the exact current record, not invented. Missing links do not mean every old French question is wrong.

## Authoritative source layout

`content/published/shared/fr.json` and `es.json` are small manifests. They list chunks under `shared/<language>/{lemmas,senses,surfaceForms,quizzes,expressions,reviews}/<bucket>.json`. A SHA-256 ID bucket assigns each record to one of 64 stable slots. Adding a record does not shift unrelated chunks. Files are pretty-printed for GitHub Desktop comparisons; browser packaging remains compact and independent.

`content/published/works/<workId>.json` has version 2, canonical content, `textBinding`, and `expressionNotes`. A note has `kind: explanatory_note` and no mastery. A shared expression has `kind: learnable_expression`; its occurrences and three prepared quiz bands remain separate. No note was automatically made quizzable.

`textBinding.textRevision` hashes wording only. `structureRevision` binds ordered unit IDs and offsets to that text; `annotationRevision` also covers occurrences, exclusions, and expression spans. Offsets are JavaScript UTF-16 code units. A source checksum is retained for compatibility, separately from these revision IDs. Source and reading units must reconstruct exactly with the documented newline separator.

Quiz source and browser delivery use a neutral `PreparedQuiz`: explicit study/gloss languages, vocabulary-or-expression subject, three band-specific formats, choices with stable IDs, `correctChoiceId`, and optional exact `targetRange`. Repeated occurrences require an editor to select the intended range. Unselected ambiguous targets remain unhighlighted in the unpublished local review build; they cannot pass the release gate. Choice reordering does not affect scoring. Unknown answer IDs are ignored without changing learner state.

A review record is bound to its subject digest, reviewer, review time, policy, checks, and rationale. Quiz review subjects include the linked lexical definition/identity: changing the sense invalidates quiz approval as well as lexical approval. Vocabulary reviews include every indexed occurrence and its source context. Changing a reviewed question or introducing a new occurrence requires renewed evidence. Pending fingerprints may be mechanically refreshed; approved ones may not.

## Completed editorial batch

`src/content/editorial/spanish-01.ts` contains eight explicitly authored entries and 24 distinct contexts, reviewed against every current occurrence. Forms: `casa`, `cama`, `almohadón`, `dormitorio`, `noche`, `paredes`, `puerta`, `pasos`.

The one-time application is recorded in `content/published/editorial-batches/es-2026-09-19-01.json`, including the before/after record data and rationale. It refuses to run twice or against changed contextual input. No canonical text, occurrence reference, sense ID, surface ID, quiz ID, storage key, mastery level, or due timestamp changed. Two plural entries now have singular dictionary headwords, but their plural mastery identities remain independent.

The migration regression test replays this explicit ledger against the historical snapshot and requires every other record to remain identical. It does not simply exempt all Spanish content from regression checking.

## Approved semantic correction policy — implemented locally

The user approved `preserve-history-fresh-on-view-v1` on 2026-09-19. It retains legacy learner records and unchanged meanings. Newly corrected or separated meanings receive a different Surface + Sense key, with no mastery transfer. Their learner-state rows are created at Level 1 only when the specific unit is viewed in Learning View. Repeated views do not reset a level or due date. No eager storage migration, library initialization, prefetch, or Book View encounter is performed.

`src/content/editorial/spanish-02.ts` and the versioned `es-2026-09-19-02.json` ledger record these resolutions:

| Contextual identity | Source treatment | Progress treatment |
| --- | --- | --- |
| `plumas` as feathers | Two Quiroga spans use a new feather sense; retain the plural surface and normalize its lemma | Old pens key retained as history; feather key starts on view |
| `médico` as medical | One Palma adjective span gets an adjective lemma, surface, and sense | New adjective key starts on view |
| `médico` as doctor | Two Quiroga noun spans keep their original Surface + Sense key | Existing level and due date preserved |
| `mujer` as wife | One Quiroga span uses a new spouse sense under the existing noun/surface | Old general-woman key retained as history; spouse key starts on view |
| `paso` as accepting | One Palma span gets a `pasar` verb lemma, first-person present surface, and contextual sense | Old step key retained as history; verb key starts on view; plural noun `pasos` unchanged |

This batch contains 15 independently authored questions for the five reviewed identities. Exactly five occurrence references changed, without changing their IDs, offsets, unit text, or canonical sources. The ledger retains before/after records and contains no progress transfers. The original nine questions for the three now-unreferenced identities remain recoverable in source, but are not delivered or counted in the current release gate. Reintroducing one into a work requires current contextual/quiz approval again. Historical progress is excluded from due counts by current work membership, not deleted.

The contextual analysis was checked against the DLE entries for [pluma](https://dle.rae.es/pluma), [médico](https://dle.rae.es/m%C3%A9dico), [mujer](https://dle.rae.es/mujer), and [pasar](https://dle.rae.es/pasar). The accepting sense in Palma is a contextual interpretation, supported by the adjacent statement of consent; definitions and questions are original paraphrases. The separately stored singular `pluma` remains unreviewed and was not automatically merged.

Viewport observation now rejects hidden-tab, detached, and late/cancelled callbacks. Browsers without IntersectionObserver measure actual visible area instead of encountering the whole loaded section. Explicit vocabulary taps also initialize the viewed unit safely. A late reading request cannot restart observation after navigation away.

`previewIdentityMigration` remains a separate offline, non-mutating helper for potential same-meaning aliases. It is not used for these semantic corrections and is not connected to browser storage. French merges and mastery collision choices still need their own approval and tested integration.

## Recovery and verification

Both structural migration and the editorial batch used copy-on-write source staging, validated the whole candidate, and retained prior source trees in ignored recoverable checkpoints. No source corpus was deleted. Historical aggregate fixtures remain unchanged.

At this checkpoint: 211 tests pass, type checking passes, and the local review build passes the existing route/reference/language/payload budgets. Five end-to-end simulated app flows exercise the four fresh meanings and preserved doctor meaning against generated content. They verify no encounter on library/Book View/loading/prefetch, creation only on the selected unit's visibility, unchanged legacy state, and no late Book View encounters. Separate tests cover browsers without IntersectionObserver, cancelled callbacks, historical due exclusions, and exact editorial-ledger replay.

The normal production build is intentionally blocked by 15,114 records requiring editorial evidence or correction. The active corpus contains 11,367 questions, plus nine retained historical questions. No real-browser visual check or hosted preview was performed for this local-only checkpoint; prior browser access was blocked by the environment. Nothing was published, committed, or pushed.
