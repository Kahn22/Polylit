# Push this foundation to GitHub

The ZIP includes the tested source tree and its local Git history.

## Terminal method

1. Extract the ZIP and open a terminal in the extracted `french-reading-studio` folder.
2. Run:

```bash
git remote add origin https://github.com/Kahn22/french-reading-studio.git
git push -u origin main
```

If `origin` already exists, use this instead of `git remote add`:

```bash
git remote set-url origin https://github.com/Kahn22/french-reading-studio.git
git push -u origin main
```

GitHub may ask you to authenticate. Do not put a personal access token in a file or commit it.

## Verify before pushing (optional)

```bash
npm install
npm run check
npm run build
```

The GitHub website does not extract uploaded ZIP archives into a repository. If you only have the website, extract the ZIP on your device and upload the contained files while preserving their folders. The terminal method is less error-prone.
