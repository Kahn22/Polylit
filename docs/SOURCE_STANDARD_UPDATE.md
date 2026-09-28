# Source-standard update — corrected and verified edition

This backup includes all prior local Polylit changes, including Samaniego and the navigation fixes, plus the source standard and completed historical-witness research.

- `docs/TEXT_SOURCE_STANDARD.md`: standing policy for every current and future text.
- `docs/TEXT_SOURCE_AUDIT.md`: per-work findings, exact remaining corrections and bibliographical qualifications.
- `content/sources/`: 11 dossiers, 79 scan images, saved transcriptions, author-date evidence, rights assessments, exact transformation logs and previous-record history.
- All 11 texts pass source review. The confirmed discrepancies in Le Lièvre et la Tortue, La camisa de Margarita, and El almohadón de pluma were corrected in atomic publication batch `text-2026-09-22-01`.
- Every selected historical edition is identified and visually reviewed. Publication history distinguishes original appearance, collection publication and the selected edition. Unproven first periodical appearances remain explicit.
- `npm run sources:check` verifies dossier coverage, checksums and canonical reconstruction. Research evidence is not included in learner downloads.

The correction batch updates canonical text, linked annotations, source bindings and reviewed quizzes together. It preserves prior identities for history, records nine exact occurrence mappings, and performs zero mastery transfers. Corrected meanings enter review only after an actual Learning View encounter.

Validation: all 228 tests pass across 35 test files; all 11 source dossiers, route pages, language-isolation checks and performance budgets pass. The local-review delivery contains 972 files. The broader strict editorial gate still reports 2,203 pending French records (2,157 vocabulary identities, 39 expressions and 7 annotation sets); Spanish has no blocked records. The configured Pages review-build remains usable while that separate French review continues.

No GitHub push or deployment was performed. To adopt this backup using GitHub Desktop, extract it outside your repository, copy its contents into your existing Polylit checkout (preserving the checkout’s `.git` directory), review the changes, then commit and push when ready. Do not include `node_modules`, generated builds or the ZIP itself in your repository.
