"""Recoverable source checkpoint; excludes credentials, dependencies and builds."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
label = sys.argv[1]
if not label or any(c not in "abcdefghijklmnopqrstuvwxyz0123456789-_" for c in label):
    raise SystemExit("Use a lowercase checkpoint label")
destination = root.parent.parent / "polylit-backups" / f"polylit-quiz-review-{label}.zip"
destination.parent.mkdir(parents=True, exist_ok=True)
if destination.exists():
    raise SystemExit("Checkpoint already exists; never overwrite a recovery point")
names = sorted(set(subprocess.check_output(["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], cwd=root).decode().split("\0")) - {""})
manifest = []
with zipfile.ZipFile(destination, "x", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for name in names:
        path = Path(name)
        if any(part in {".git", "node_modules", "dist", "build", "review-build", ".sites-runtime"} or part.startswith(".publication-") for part in path.parts):
            continue
        if path.name.startswith(".env") or path.suffix in {".pem", ".key", ".log"}:
            continue
        if path.parts[0].startswith(".") and path.parts[0] not in {".github", ".gitignore"} and name != ".openai/hosting.json":
            continue
        source = root / path
        if not source.is_file() or source.is_symlink():
            continue
        data = source.read_bytes()
        archive.writestr("french-reading-studio/" + name, data)
        manifest.append({"path": name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
    archive.writestr("CHECKPOINT.json", json.dumps({"label": label, "gitHead": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root).decode().strip(), "note": "Unpublished source checkpoint including uncommitted work. Install dependencies and run validation after extraction; editorial release checks may intentionally block unfinished content.", "files": manifest}, indent=2))
with zipfile.ZipFile(destination) as archive:
    bad = archive.testzip()
    if bad:
        raise RuntimeError(f"Corrupt backup member: {bad}")
print(json.dumps({"file": str(destination), "files": len(manifest), "bytes": destination.stat().st_size, "sha256": hashlib.sha256(destination.read_bytes()).hexdigest()}))
