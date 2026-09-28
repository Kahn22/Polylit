# Samaniego update — 21 September 2026

Adds the complete public-domain *La zorra y las uvas* by Félix María Samaniego to the Spanish library, marked 🇪🇸 Spain. The 1902 edition was checked against its historical scans. Wording is preserved apart from a documented printing-error correction; obsolete accent marks are modernized. Source details, scans, authored questions, and exact editorial approval are in `content/intake/samaniego-zorra-uvas/`.

- Catalog: 11 works, comprising 8 French and 3 Spanish.
- New work: 16 lines, 4 thought units, one 103-word learning section.
- Vocabulary: 80 identities, of which 34 are reused and 46 new.
- Expressions: en ayunas and de fijo, separately learnable.
- Questions: 246 applicable, including 144 new and 102 reused unchanged.
- Earlier content and learner mastery identities are preserved. No progress is transferred.
- Stored verse line breaks are displayed in Book View and Learning View.
- The prior language-navigation, decorative-logo, and sign-out fixes are included in this source snapshot.

## Verification

- `npm run check`: 35 test files, 228 tests passed.
- `npm run build:local-review`: passed, including route generation, release references, language separation, and download-size budgets. This is the build used by `.github/workflows/pages.yml`.
- Spanish library index: 11,509 bytes gzip, within the existing 12,000-byte limit.
- New work's Book View package: 515 bytes gzip.
- `git diff --check`: passed.
- `npm run build`: the strict production gate still reports the same 2,206 pre-existing editorial blockers (2,204 French and 2 Spanish). This intake adds no blockers. The two older validation workflows that call this strict command will still report that backlog; the Pages workflow separately builds the user-authorized review candidate.

The exact source transaction retained a previous-source backup before adoption. The accompanying ZIP is a full source snapshot; it excludes dependencies, generated build output, git internals, and transient backup directories. No remote push or live deployment was performed.

## Update using GitHub Desktop on Mac

1. Extract the ZIP. Open your existing Polylit repository using **Repository → Show in Finder** in GitHub Desktop.
2. Copy the contents of the extracted `Polylit` folder into that repository, merging folders and replacing matching files. Use **Command–Shift–.** in Finder to show and copy `.github` and `.gitignore` too. Keep the existing repository's `.git` folder.
3. In GitHub Desktop, review the changed files. Commit with a message such as `Add Samaniego's La zorra y las uvas`, then choose **Push origin** when ready.
4. Wait for the **deploy-pages-preview** action to finish. The fable will then appear in the Spanish library at https://kahn22.github.io/Polylit/.
