# Recovering Polylit editorial work

The latest **verified** ZIP is the resumption point when the working folder is absent or inconsistent. Do not choose solely by filename or by the date of a handoff left in the workspace.

1. Save each checkpoint ZIP and keep it until a newer one has been downloaded and verified. The `editorial:checkpoint` command runs checks, records a structured `candidateProgress` summary in `docs/EDITORIAL_HANDOFF.json`, compares critical files before and after validation, and only gives the ZIP its final name after checking every archived file against the working copy.
2. After saving, download that ZIP once and run `npm run editorial:verify -- /path/to/checkpoint.zip`. This checks its manifest, every entry hash, dossier version, consecutive batch records, counts and embedded handoff. To check against the current checkout too, add `--against /path/to/checkout`.
3. On the next session, verify the latest ZIP, then read `docs/EDITORIAL_HANDOFF.json`, `docs/MICROMEGAS_PROGRESS.md`, and the source dossier **inside that ZIP**. If the workspace differs, restore from the verified archive before continuing. A `publicationReady` value refers to the existing published works; the Micromégas `candidateProgress` is a separate, unpublished record.
4. For the GitHub Desktop workflow, extract the verified ZIP into the existing repository checkout, review the change list, run `npm run check` and `npm run build`, then commit. The checkpoint step itself does not push or deploy.

For a large editorial package, create internal recovery increments after roughly 20 decisions with `python3 scripts/editorial-recovery-increment.py create <base.zip> <label>`. The small increment records only files changed since the last fully verified ZIP, their hashes, the base ZIP hash, and the source dossier version. It does not replace a full checkpoint or certify publication. Verify it against the base with `python3 scripts/editorial-recovery-increment.py verify <base.zip> <increment.zip>`. If an interruption prevents completion of the full package, save the latest increment, then on resumption verify the base ZIP and the increment before restoring changed files. Continue toward the package boundary instead of stopping at an internal increment. Published-content changes require the full validation and checkpoint immediately.

If verification fails, keep the last verified checkpoint, retain the failed ZIP for diagnosis, and repair the working copy before issuing a new label. Do not treat a ZIP that merely opens as a safe recovery point.

## Navigation gate (checkpoint 380 onward)

The checkpoint runs `npm run test:navigation` explicitly. Both `build:local-review` and `build:app` run `check:navigation` against their generated output; GitHub Actions therefore uses the same page-link gate before uploading the Pages artifact. Missing pages, broken local assets, absent required page links, or paths escaping the GitHub Pages prefix fail the build and prevent checkpoint creation. The handoff records navigation results.

The focused suite covers all catalog works in both reading views, learning positions/history, review exits, content-error recovery, login/language/library routing and signed-out restoration. The offline asset gate checks `/` and `/Polylit/`. It does not check external sites, browser layout, or the deployed site. After a push, inspect Actions and smoke-test the actual deployed navigation; report these results separately.
