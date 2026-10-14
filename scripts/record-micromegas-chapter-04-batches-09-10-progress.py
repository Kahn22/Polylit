#!/usr/bin/env python3
"""Record the next twenty Chapter IV meanings and the source-bound stream phrase."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
path = p / 'dossier.json'
d = json.loads(path.read_text())
read = lambda name: json.loads((p / name).read_text())
files = [f'chapter-04-batch-{n:02}.json' for n in range(1, 11)] + [f'chapter-04-qa-{n:02}.json' for n in range(1, 5)] + [
    'chapter-04-identity-packet.json', 'chapter-04-identity-plan.json',
    'chapter-04-droit-fil-review.json', 'chapter-04-07-published-candidates.json',
    'chapter-04-07-new-form-queue.json',
]
existing = {item['file']: item for item in d['evidence']}
for name in files:
    raw = (p / name).read_bytes()
    existing[name] = {'role': 'chapter_four_offline_editorial_review_or_remaining_candidate_queue', 'file': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
d['evidence'] = [item for item in d['evidence'] if item['file'] not in files] + [existing[name] for name in files]
batches = [read(f'chapter-04-batch-{n:02}.json') for n in range(1, 11)]
qa = [read(f'chapter-04-qa-{n:02}.json') for n in range(1, 5)]
identity = read('chapter-04-identity-plan.json')
pub = read('chapter-04-07-published-candidates.json')
fresh = read('chapter-04-07-new-form-queue.json')
keys = [item['key'] for batch in batches for item in batch['items']]
assert len(keys) == len(set(keys)) == 100
assert set(keys) == {item['key'] for review in qa for item in review['items']} == {item['key'] for item in identity['items']}
progress = d['review']['remainingChapters']['progress']
progress.update({
    'chapterFourNewMeaningsReviewed': 100,
    'chapterFourNewUsesReviewed': sum(len(item['sourceOccurrences']) for batch in batches for item in batch['items']),
    'newQuestionBandsReviewed': 300,
    'chapterFourIdentityRoutes': identity['summary'],
    'candidatePublishedUses': pub['summary']['uses'], 'noExactIdentityUses': fresh['summary']['uses'],
    'publishedCandidateForms': pub['summary']['forms'], 'noExactCandidateForms': fresh['summary']['forms'],
    'chapterFourAdditionalExpressionReviews': 1, 'chapterFourAdditionalExpressionQuestionBands': 3,
})
progress['editorialDecisionPendingUses'] = progress['candidatePublishedUses'] + progress['noExactIdentityUses']
progress['unresolvedTokenUses'] = progress['editorialDecisionPendingUses']
assert progress['chapterFourNewUsesReviewed'] == 110
assert progress['tokenUses'] == sum(progress[key] for key in ('alreadyAuthoredEarlierUses', 'reviewedEarlierMeaningSharedUses', 'reviewedProperNameUses', 'chapterFourPublishedReuseUses', 'chapterFourNewUsesReviewed', 'editorialDecisionPendingUses'))
assert d['history'][-1]['version'] in (56, 57)
if d['history'][-1]['version'] == 56:
    d['history'].append({'version': 57, 'date': '2026-09-28', 'reason': f"Chapter IV reviewed 20 further contextual meanings (now 100 across ten batches), 20 source uses and 60 further offline question bands (now 300). The de droit fil expression has three source-bound question bands and three component tokens held in the queue. Remaining IV–VII decisions: {progress['editorialDecisionPendingUses']}; no import or publication."})
d['review']['remainingChapters']['nextAction'] = 'Continue Chapter IV source order after dispute at unit 103:3, starting with échauffant; preserve the de droit fil component token holds, resolve all later contextual uses and published-sense repairs, and reconcile all seven chapters before learner import.'
path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(progress))
