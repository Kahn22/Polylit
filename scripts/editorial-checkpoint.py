"""Validate an editorial milestone and save an immutable, resumable source ZIP."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import sys
import zipfile
from checkpoint_integrity import candidate_progress, source_snapshot, verify_archive

root = Path(__file__).resolve().parents[1]
label = sys.argv[1] if len(sys.argv) == 2 else ''
if not re.fullmatch(r'[a-z0-9][a-z0-9_-]*', label):
    raise SystemExit('Usage: npm run editorial:checkpoint -- <lowercase-label>')
destination = root.parent / f'Polylit-French-Editorial-{label}.zip'
if destination.exists():
    raise SystemExit(f'Checkpoint already exists: {destination.name}; choose a new label')
temporary = destination.with_name(destination.name + '.partial')
if temporary.exists():
    raise SystemExit(f'Unfinished checkpoint exists: {temporary.name}; inspect it before retrying')
source_before = source_snapshot(root)
progress_before = candidate_progress(lambda name: (root / name).read_bytes())

def run(*command):
    subprocess.run(command, cwd=root, check=True)

run('npm', 'run', 'check')
run('npm', 'run', 'build:local-review')
audit = json.loads(subprocess.check_output(['node', 'dist/cli/audit-editorial.js'], cwd=root, text=True))
if audit['blockedRecords'] == 0:
    run('npm', 'run', 'publication:release-check')
    run('npm', 'run', 'build')
run('node', 'scripts/editorial-review-packet.mjs', '--limit', '10')
packet = json.loads((root / 'docs/EDITORIAL_NEXT_PACKET.json').read_text())
micromegas_intake = root / 'content/sources/wrk_voltaire_micromegas/dossier.json'
micromegas_acquired = micromegas_intake.exists() and json.loads(micromegas_intake.read_text())['acquisition']['status'] == 'acquired'
micromegas_chapter_one_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-01.json').exists()
micromegas_chapter_two_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-02-review.json').exists()
micromegas_chapter_four_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-04-review.json').exists()
micromegas_chapter_seven_reviewed = (root / 'content/sources/wrk_voltaire_micromegas/chapter-07-review.json').exists()
micromegas_second_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-02.json').exists()
micromegas_third_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-03.json').exists()
micromegas_fourth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-04.json').exists()
micromegas_fifth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-05.json').exists()
micromegas_sixth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-06.json').exists()
micromegas_eighth_batch = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-batch-08.json').exists()
micromegas_expressions = (root / 'content/sources/wrk_voltaire_micromegas/chapter-01-expressions-01.json').exists()
pending = audit['languages']['fr']['blockedByKind']['vocabulary']
if pending != packet['pendingFrenchVocabulary']:
    raise SystemExit('Audit and review packet disagree; no checkpoint saved')
if source_snapshot(root) != source_before:
    raise SystemExit('Micromégas source/progress files changed during validation; no checkpoint saved')

handoff = {
    'version': 1,
    'checkpoint': destination.name,
    'publicationReady': audit['releaseReady'],
    'blockedRecords': audit['blockedRecords'],
    'blockedByKind': {language: data['blockedByKind'] for language, data in audit['languages'].items()},
    'nextFrenchVocabularyIds': [identity for family in packet['families'] for identity in family['pendingIdentityIds']],
    'nextSharedSenseIds': [family['senseId'] for family in packet['families']],
    'nextContentWorkId': 'wrk_voltaire_micromegas' if micromegas_intake.exists() else None,
    'candidateProgress': progress_before,
    'nextAction': ('Continue Micromégas contextual vocabulary and expression review after eight ten-sense batches (226 workwide occurrences, 240 vocabulary questions) and ten phrase candidates (three expression question sets, two progress-reuse holds). Resolve shared senses and remaining forms before identity import; candidate remains unpublished.' if audit['releaseReady'] and micromegas_eighth_batch else 'Continue Micromégas contextual vocabulary and expression review after six ten-sense batches (201 workwide occurrences, 180 vocabulary questions) and ten phrase candidates (three expression question sets, two progress-reuse holds). Review remaining forms and reconcile à peu près and se mettre à before identity import; this candidate remains unpublished.' if audit['releaseReady'] and micromegas_sixth_batch else 'Continue Micromégas contextual vocabulary and expression review after five ten-sense batches (191 workwide occurrences, 150 vocabulary questions) and ten phrase candidates (three expression question sets, two progress-reuse holds). Resolve remaining forms and reconcile à peu près and se mettre à before identity import; this candidate remains unpublished.' if audit['releaseReady'] and micromegas_fifth_batch else 'Continue Micromégas vocabulary and expression review after four ten-sense batches (177 workwide occurrences, 120 question drafts) and ten phrase candidates (three expression question sets, two existing-progress holds); reconcile à peu près and se mettre à before any identity duplication. Candidate remains outside the 11-work release gate.' if audit['releaseReady'] and micromegas_expressions else 'Continue Micromégas contextual vocabulary/expression review after four ten-sense batches (177 workwide exact-form occurrences, 120 offline questions); resolve remaining forms, related lemma reuse and question signoff. All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_fourth_batch else 'Continue Micromégas contextual vocabulary/expression review after three ten-sense batches (157 workwide exact-form occurrences, 90 offline questions); resolve related lemma reuse and sign off questions. All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_third_batch else 'Continue Micromégas contextual vocabulary/expression review after two ten-sense batches (107 workwide exact-form occurrences, 60 offline questions); resolve related lemma reuse and sign off questions. All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_second_batch else 'Finish Micromégas canonical approval and continue contextual vocabulary/expression review after batch 01 (ten senses, 79 occurrences, 30 offline questions). All seven chapters have source and unit reviews; the existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_seven_reviewed else 'Proofread Micromégas chapters V–VII and review their proposed units. Continue contextual vocabulary/expressions after batch 01 (ten senses, 79 occurrences, 30 offline questions). The existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_four_reviewed else 'Proofread Micromégas chapters III–VII and review their proposed units. Continue contextual identities/expressions after batch 01 (ten senses, 79 occurrences, 30 offline questions) through chapters I–II. The existing 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_two_reviewed else 'Continue Micromégas chapter I after the first ten contextual sense and 30 question drafts: review remaining occurrence and expression candidates, cross-check those ten senses throughout chapters II–VII, and proofread remaining scans and unit boundaries. The 11-work release gate does not include this candidate.' if audit['releaseReady'] and micromegas_chapter_one_reviewed else 'Proofread Micromégas against its scans, review proposed units and passages, then resolve lexical identities and author three question bands before import and a work-specific release audit. Current release readiness covers previously published works only.' if audit['releaseReady'] and micromegas_acquired else 'Acquire and verify the complete Micromégas witness and scans under the source standard, then prepare its seven chapters, identities and questions.' if audit['releaseReady'] and micromegas_intake.exists() else 'Extract this release-ready source checkpoint into the existing Git checkout, review and commit the changes in GitHub Desktop, and deploy after the repository update.' if audit['releaseReady'] else 'Review each indexed use and every dependent question. Resolve any shared-sense or identity conflict before approving; then run the audit and continue to the next packet.'),
    'validation': {'check': 'passed', 'sourceDossiers': 'included in check', 'localReviewBuild': 'passed', 'editorialAudit': 'passed', 'productionBuild': 'passed' if audit['releaseReady'] else 'gated by pending editorial records'},
    'source': 'This is an unpublished source checkpoint; no GitHub push or deployment has occurred.',
}
if audit['releaseReady'] and micromegas_acquired:
    chapter_coverage = progress_before.get('chapterOneCoverage', {})
    handoff['nextAction'] = (f"Continue Micromégas review after {progress_before['batchCount']} ten-sense batches "
        f"({progress_before['workwideOccurrences']} workwide occurrences, "
        f"{progress_before['vocabularyQuestionDrafts']} offline vocabulary questions). "
        f"Chapter I has {chapter_coverage.get('unresolvedTokenUses', 'unverified')} unresolved token uses, "
        f"after {chapter_coverage.get('reusedTokenUses', 'unverified')} contextual published-identity reuses "
        f"and {chapter_coverage.get('excludedProperNameUses', 'unverified')} proper-name exclusions. "
        "Reuse the existing à peu près and past se mit à identities; map present se met à to a new surface under the existing reflexive-begin sense; review the four expression drafts, the 721 contextual reuses and remaining chapters before learner import. "
        "The candidate remains unpublished; the existing 11-work release gate does not include it.")
    chapter_two = progress_before.get('chapterTwoCoverage')
    if chapter_two:
        handoff['nextAction'] = (f"Continue the same chapter II package from its source-bound inventory: "
            f"{chapter_two['draftedTokenUses']} drafted uses, {chapter_two['reusedTokenUses']} reviewed published reuses, "
            f"{chapter_two['excludedProperNameUses']} excluded names, and {chapter_two['unresolvedTokenUses']} unresolved "
            f"of {chapter_two['tokenUses']} tokens. The next undecided forms begin with besoins, anneau, lunes, "
            "sommes and bornés; review all remaining meanings, published candidates, expressions, three-band questions, "
            "identity routes and chapter QA before considering chapter II complete. Micromégas remains unpublished.")
        if chapter_two['unresolvedTokenUses'] == 0:
            if chapter_two.get('questionReviewedMeanings') == chapter_two['newMeaningDrafts'] and chapter_two.get('expressionReviewedBands') == chapter_two['newExpressionQuestionBands']:
                handoff['nextAction'] = (f"Chapter II offline review is recorded: all {chapter_two['tokenUses']} tokenizer uses have dispositions, "
                    f"{chapter_two['newMeaningDrafts']} new meanings have {chapter_two['questionReviewedBands']} reviewed question bands and identity routes, "
                    f"and the à peine expression has {chapter_two['expressionReviewedBands']} reviewed bands. "
                    "Continue with chapter III coverage and complete-work sense reconciliation before importing Micromégas. "
                    "The candidate remains unpublished; the existing release gate covers the previous 11 works only.")
            else:
                handoff['nextAction'] = (f"Chapter II has zero unresolved tokenizer uses: {chapter_two['draftedTokenUses']} draft uses, "
                    f"{chapter_two['reusedTokenUses']} contextual published reuses, {chapter_two['excludedProperNameUses']} names "
                    f"and {chapter_two['coveredPhraseComponents']} phrase components. Review the "
                    f"{chapter_two['newMeaningDrafts']} new meanings and {chapter_two['newQuestionBands']} question bands individually, "
                    "adjudicate shared identity routes and the à peine expression, then run final chapter QA. "
                    "Keep Micromégas offline while chapters III–VII remain pending.")
(root / 'docs/EDITORIAL_HANDOFF.json').write_text(json.dumps(handoff, indent=2) + '\n')

excluded = {'.git', 'node_modules', 'dist', 'build', 'review-build', 'site-dist', 'coverage', '.sites-runtime', '__pycache__'}
manifest = []
try:
    with zipfile.ZipFile(temporary, 'x', zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(root.rglob('*')):
            relative = path.relative_to(root)
            if not path.is_file() or path.is_symlink() or str(relative) == 'CHECKPOINT.json' or any(part in excluded or part.startswith('.publication-') for part in relative.parts):
                continue
            if path.name.startswith('.env') or path.suffix in {'.pem', '.key', '.log'}:
                continue
            if relative.parts[0].startswith('.') and relative.parts[0] not in {'.github', '.gitignore', '.openai'}:
                continue
            if relative.parts[0] == '.openai' and str(relative) != '.openai/hosting.json':
                continue
            if str(relative).startswith('public/content/'):
                continue
            data = path.read_bytes()
            archive.writestr(str(relative), data)
            manifest.append({'path': str(relative), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        archive.writestr('CHECKPOINT.json', json.dumps({'label': label, 'handoff': 'docs/EDITORIAL_HANDOFF.json', 'files': manifest}, indent=2))
    if source_snapshot(root) != source_before:
        raise RuntimeError('Micromégas source/progress files changed while writing the ZIP')
    verify_archive(temporary, root, expected_name=destination.name)
    temporary.rename(destination)
finally:
    temporary.unlink(missing_ok=True)
print(json.dumps({'checkpoint': str(destination), 'files': len(manifest), 'bytes': destination.stat().st_size, 'blockedRecords': audit['blockedRecords'], 'nextFrenchVocabularyIds': handoff['nextFrenchVocabularyIds']}))
