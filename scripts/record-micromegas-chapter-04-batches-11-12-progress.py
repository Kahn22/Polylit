#!/usr/bin/env python3
"""Record the next twenty Chapter IV meanings and the literal underwater phrase."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
path = p / 'dossier.json'
d = json.loads(path.read_text())
read = lambda name: json.loads((p / name).read_text())
files = [f'chapter-04-batch-{n:02}.json' for n in range(1, 13)] + [f'chapter-04-qa-{n:02}.json' for n in range(1, 6)] + [
    'chapter-04-identity-packet.json', 'chapter-04-identity-plan.json',
    'chapter-04-droit-fil-review.json', 'chapter-04-entre-deux-eaux-review.json', 'chapter-04-07-published-candidates.json',
    'chapter-04-07-new-form-queue.json',
]
existing = {item['file']: item for item in d['evidence']}
for name in files:
    raw = (p / name).read_bytes()
    existing[name] = {'role': 'chapter_four_offline_editorial_review_or_remaining_candidate_queue', 'file': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
d['evidence'] = [item for item in d['evidence'] if item['file'] not in files] + [existing[name] for name in files]
batches = [read(f'chapter-04-batch-{n:02}.json') for n in range(1, 13)]
qa = [read(f'chapter-04-qa-{n:02}.json') for n in range(1, 6)]
identity = read('chapter-04-identity-plan.json')
pub = read('chapter-04-07-published-candidates.json')
fresh = read('chapter-04-07-new-form-queue.json')
keys = [item['key'] for batch in batches for item in batch['items']]
assert len(keys) == len(set(keys)) == 120
assert set(keys) == {item['key'] for review in qa for item in review['items']} == {item['key'] for item in identity['items']}
progress = d['review']['remainingChapters']['progress']
progress.update({
    'chapterFourNewMeaningsReviewed': 120,
    'chapterFourNewUsesReviewed': sum(len(item['sourceOccurrences']) for batch in batches for item in batch['items']),
    'newQuestionBandsReviewed': 360,
    'chapterFourIdentityRoutes': identity['summary'],
    'candidatePublishedUses': pub['summary']['uses'], 'noExactIdentityUses': fresh['summary']['uses'],
    'publishedCandidateForms': pub['summary']['forms'], 'noExactCandidateForms': fresh['summary']['forms'],
    'chapterFourAdditionalExpressionReviews': 2, 'chapterFourAdditionalExpressionQuestionBands': 6,
})
progress['editorialDecisionPendingUses'] = progress['candidatePublishedUses'] + progress['noExactIdentityUses']
progress['unresolvedTokenUses'] = progress['editorialDecisionPendingUses']
assert progress['chapterFourNewUsesReviewed'] == 133
assert progress['tokenUses'] == sum(progress[key] for key in ('alreadyAuthoredEarlierUses', 'reviewedEarlierMeaningSharedUses', 'reviewedProperNameUses', 'chapterFourPublishedReuseUses', 'chapterFourNewUsesReviewed', 'editorialDecisionPendingUses'))
assert d['history'][-1]['version'] in (57, 58)
if d['history'][-1]['version'] == 57:
    d['history'].append({'version': 58, 'date': '2026-09-28', 'reason': f"Chapter IV reviewed 20 further contextual meanings across batches 11–12 (now 120), 23 source uses and 60 further offline question bands (now 360). Entre deux eaux has three literal underwater phrase questions; its components retain token dispositions. The historical Académie distinguishes carats as small diamonds sold by weight. Remaining IV–VII decisions: {progress['editorialDecisionPendingUses']}; no import or publication."})
d['review']['remainingChapters']['nextAction'] = 'Continue Chapter IV source order after ongle at unit 109:70, starting with pouce; preserve de droit fil and entre deux eaux component token holds, resolve all later contextual uses and published-sense repairs, and reconcile all seven chapters before learner import.'
path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(progress))
