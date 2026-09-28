# Updating the Polylit editorial branch with GitHub Desktop

1. In GitHub Desktop, open your local `Kahn22/french-reading-studio` repository and fetch the latest changes. Create a branch from the current project baseline named `editorial/french-review` (or another `editorial/…` name).
2. Extract the latest Polylit recovery ZIP. Copy its project files into the local repository folder, preserving their paths. Remove the obsolete `.github/workflows/ci.yml` from the local repository; simply copying ZIP contents over an existing checkout will not remove old files. Do not copy a `.git` directory or generated `node_modules`, `dist`, `build`, or `review-build` folders. Review the changed-file list in GitHub Desktop before committing; keep any unrelated local changes.
3. Commit the editorial update and click **Publish branch** or **Push origin**. The `checks` workflow will run the test suite, source validation, local review build, and editorial audit. Open the GitHub check summary to see the current pending count.
4. Keep the editorial branch separate from the Pages deployment branch until the production editorial gate is clear. A passing review check with pending French vocabulary means the branch is structurally sound; it does not mean the content is approved for publication.

The ZIP remains a recoverable snapshot. Git commits are the preferred ongoing history once the branch is established. If GitHub shows conflicts or unexpected deletions, resolve those against the current repository before committing rather than replacing the repository wholesale.
