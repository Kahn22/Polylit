# French Reading Studio working baseline

Treat the checked-in `main` branch as the canonical working version for future French Reading Studio work.

Preserve these product rules unless the user explicitly changes them:

- Learner vocabulary identity is `Surface form + Sense` and mastery is shared across texts.
- Approved semantic-correction policy: preserve legacy progress records and unchanged meanings. A corrected or newly separated meaning gets a fresh identity and begins at Level 1 only when its thought unit is actually viewed in Learning View. Never copy old mastery into the new meaning or reset an already encountered identity. Record explicit occurrence reassignments in an editorial batch ledger.
- Learning sections use natural passages targeting about 120 French words (normally 80–150), preserve authored thought-unit boundaries, and avoid single-sentence sections unless unavoidable.
- A word or prepared expression becomes encountered only when the learner views the specific thought unit containing that occurrence. Opening a work, changing its shelf status, preloading another section, or reading in Book View must not encounter unseen material.
- Vocabulary is underlined only at mastery Levels 1–3. At Levels 4–8 it remains tappable without an underline.
- Leaving a learning section triggers review of due identities in that section. The learner may complete it, skip to the next section without changing due state, or return to reread the section.
- Book View presents large, book-like passages without underlining, interactive vocabulary, quizzes, encounters, mastery changes, or scheduling changes.
- Reading and Completed texts contribute previously encountered items to review. Available texts do not contribute their unique items, and changing shelf status never erases learner progress.
- Published experiences use only pre-generated, reviewed, stored content. AI generation is permitted only during pre-publication production and never at learner runtime.
- Across French, Spanish, and every future language with comparable grammar, Level 4–5 noun questions require four noun choices matching the target's grammatical number and all agreement required by the unchanged sentence (including gender or case where applicable). Meaning must select the sole correct answer; grammatical mismatches must not eliminate distractors. Apply this during authoring and review of existing questions; do not assume old questions already comply.
- Keep canonical content, linguistic data, prepared quiz content, authentication/authorization, and learner state separate.

Before treating a change as the new working baseline, run `npm run check` and `npm run build`.
