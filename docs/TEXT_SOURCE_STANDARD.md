# Polylit text source standard — version 1

Adopted by the user on 21 September 2026. Applies to **every existing and future text**, in every language, including the queued Voltaire and Verne works. This is a standing project requirement, not an optional intake checklist.

## Required dossier

Keep a versioned `content/sources/<workId>/dossier.json` with these records:

1. **Identity:** title, author, original language, origin country, first publication, collection and exact location. Distinguish first publication from the selected edition; mark unverified dates explicitly.
2. **Edition:** editor, publisher, place, edition year, volume/chapter/fable and printed page range. Record title variants. Never silently combine editions.
3. **Acquisition:** direct source URL, institution, retrieval date and stable edition/revision identifier when available. Preserve the original acquisition record; a newly found comparison witness is not proof of the original source.
4. **Evidence:** saved source transcription and relevant scans/PDF pages, with checksums and a page mapping. Website navigation, notes and page furniture remain separate from literary text. A source-page download is not a visual scan review.
5. **Rights:** documentary public-domain basis for each intended territory, author death and publication dates, and separate treatment of translations, editing and illustrations. Flag missing evidence; do not infer worldwide rights from the author's nationality.
6. **Canonical text:** exact UTF-8 text, SHA-256, version, complete-work or explicitly bounded excerpt scope, and reconstruction from ordered learning units.
7. **Changes:** original → replacement plus reason and supporting witness for each correction, modernization or omission. Explicit routine typography rules may cover repeated mechanical changes. Preserve verse, headings, morals and historical forms unless a recorded decision says otherwise.
8. **Review:** reviewer, date, edition/pages actually checked, mechanical results, editorial decisions and unresolved issues. Only mark `verified` after the complete declared scope matches the selected edition except for documented transformations and reuse is documented. Source verification and vocabulary/quiz approval are separate.
9. **History:** retain previous versions and reasons for change, including impacts on canonical text, annotations, quizzes and learner identities. Never transfer mastery automatically because a text or sense changed.

## Working procedure

- Start a dossier when a work enters intake. Select an authoritative historical edition, acquire evidence, transcribe, document transformations, compare the entire declared scope, then record source verification.
- New works must meet this standard before being described as source-verified. Unfinished candidates can be prepared and reviewed locally with their status visible.
- Existing works are migrated without inventing missing acquisition or review history. Missing evidence is tracked as `needs_review` with concrete next steps.
- Run `npm run sources:check` after changes. It checks dossier coverage, required records, evidence hashes, exact current canonical text and unit reconstruction; it does **not** certify editorial judgment.
- A failed structural or hash check must be fixed. Pending historical review is reported separately and does not reinstate the previously relaxed GitHub Pages editorial publication gate.
- Keep scans and dossiers out of learner delivery bundles. Publication reads existing canonical records; the dossier supplements provenance without changing learner identifiers.
- Before a canonical edit, preserve its previous dossier/evidence version, classify the change, review affected occurrences and quizzes, and use the existing publication update workflow.

## Initial migration

See `TEXT_SOURCE_AUDIT.md` for the current per-work evidence and outstanding verification. Initial dossiers snapshot existing texts exactly; no wording, quiz, identity or learner-progress changes were made as part of this migration. Null or pending fields are explicit missing evidence, not completed verification.
