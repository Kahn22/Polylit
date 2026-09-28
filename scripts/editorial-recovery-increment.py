"""Small verified work-in-progress delta relative to the last full editorial ZIP."""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parent.parent
CANDIDATE = Path('content/sources/wrk_voltaire_micromegas')
EXACT = {'AGENTS.md', 'docs/CHECKPOINT_RECOVERY.md', 'docs/MICROMEGAS_PROGRESS.md', 'docs/MICROMEGAS_READINESS.md', 'scripts/check-text-sources.mjs', 'scripts/checkpoint_integrity.py', 'scripts/editorial-recovery-increment.py'}
MANIFEST = 'RECOVERY_INCREMENT.json'


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def paths() -> list[Path]:
    names = set(EXACT)
    names.update(str(p.relative_to(ROOT)) for p in (ROOT / CANDIDATE).rglob('*') if p.is_file())
    names.update(str(p.relative_to(ROOT)) for p in (ROOT / 'scripts').glob('prepare-micromegas-*.mjs'))
    names.update(str(p.relative_to(ROOT)) for p in (ROOT / 'docs').glob('MICROMEGAS_*.json'))
    return sorted(Path(name) for name in names)


def checked_base(path: Path) -> zipfile.ZipFile:
    base = zipfile.ZipFile(path)
    if 'CHECKPOINT.json' not in base.namelist() or 'docs/EDITORIAL_HANDOFF.json' not in base.namelist():
        raise ValueError('Base is not a full editorial checkpoint')
    return base


def create(base_path: Path, label: str) -> Path:
    if not label or not all(c.isalnum() or c in '-_' for c in label):
        raise ValueError('Label must contain only letters, numbers, dash or underscore')
    with checked_base(base_path) as base:
        changed = {}
        for relative in paths():
            current = (ROOT / relative).read_bytes()
            name = relative.as_posix()
            if name not in base.namelist() or base.read(name) != current:
                changed[name] = current
    dossier = json.loads((ROOT / CANDIDATE / 'dossier.json').read_bytes())
    manifest = {'version': 1, 'status': 'internal_recovery_increment_not_publication_approval', 'baseFilename': base_path.name, 'baseSha256': digest(base_path.read_bytes()), 'dossierHistoryVersion': dossier['history'][-1]['version'], 'changedFiles': {name: digest(data) for name, data in changed.items()}}
    destination = ROOT.parent / f'Polylit-internal-recovery-{label}.zip'
    with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as output:
        output.writestr(MANIFEST, json.dumps(manifest, indent=2) + '\n')
        for name, data in changed.items():
            output.writestr(name, data)
    verify(base_path, destination)
    return destination


def verify(base_path: Path, increment_path: Path) -> dict:
    with checked_base(base_path) as base, zipfile.ZipFile(increment_path) as increment:
        manifest = json.loads(increment.read(MANIFEST))
        if manifest['baseSha256'] != digest(base_path.read_bytes()) or manifest['baseFilename'] != base_path.name:
            raise ValueError('Recovery increment belongs to a different full checkpoint')
        expected = manifest['changedFiles']
        if sorted(increment.namelist()) != sorted([MANIFEST, *expected]):
            raise ValueError('Recovery increment file list differs from its manifest')
        for name, claimed in expected.items():
            if Path(name).is_absolute() or '..' in Path(name).parts or digest(increment.read(name)) != claimed:
                raise ValueError(f'Unsafe or changed recovery file: {name}')
        dossier_name = (CANDIDATE / 'dossier.json').as_posix()
        dossier_bytes = increment.read(dossier_name) if dossier_name in expected else base.read(dossier_name)
        if json.loads(dossier_bytes)['history'][-1]['version'] != manifest['dossierHistoryVersion']:
            raise ValueError('Dossier history version differs from recovery increment')
        return {'base': base_path.name, 'increment': increment_path.name, 'changedFiles': len(expected), 'dossierHistoryVersion': manifest['dossierHistoryVersion']}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['create', 'verify'])
    parser.add_argument('base', type=Path)
    parser.add_argument('label_or_increment')
    args = parser.parse_args()
    if args.action == 'create':
        file = create(args.base, args.label_or_increment)
        print(json.dumps({'output': str(file), **verify(args.base, file)}))
    else:
        print(json.dumps(verify(args.base, Path(args.label_or_increment))))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, FileNotFoundError, zipfile.BadZipFile) as exc:
        print(f'Recovery increment rejected: {exc}', file=sys.stderr)
        sys.exit(1)
