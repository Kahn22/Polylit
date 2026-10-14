#!/usr/bin/env python3
"""Record the final Chapter IV unmatched lexical forms pending phrase components."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
path = p / 'dossier.json'
d = json.loads(path.read_text())
read = lambda name: json.loads((p / name).read_text())
files = [f'chapter-04-batch-{n:02}.json' for n in range(1, 16)] + [f'chapter-04-qa-{n:02}.json' for n in range(1, 7)] + [
    'chapter-04-identity-packet.json', 'chapter-04-identity-plan.json',
    'chapter-04-droit-fil-review.json', 'chapter-04-entre-deux-eaux-review.json', 'chapter-04-07-published-candidates.json',
    'chapter-04-07-new-form-queue.json',
]
existing = {item['file']: item for item in d['evidence']}
for name in files:
    raw = (p / name).read_bytes()
    existing[name] = {'role': 'chapter_four_offline_editorial_review_or_remaining_candidate_queue', 'file': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
d['evidence'] = [item for item in d['evidence'] if item['file'] not in files] + [existing[name] for name in files]
batches = [read(f'chapter-04-batch-{n:02}.json') for n in range(1, 16)]
qa = [read(f'chapter-04-qa-{n:02}.json') for n in range(1, 7)]
identity = read('chapter-04-identity-plan.json')
pub = read('chapter-04-07-published-candidates.json')
fresh = read('chapter-04-07-new-form-queue.json')
keys = [item['key'] for batch in batches for item in batch['items']]
assert len(keys) == len(set(keys)) == 148
assert set(keys) == {item['key'] for review in qa for item in review['items']} == {item['key'] for item in identity['items']}
progress = d['review']['remainingChapters']['progress']
progress.update({
    'chapterFourNewMeaningsReviewed': 148,
    'chapterFourNewUsesReviewed': sum(len(item['sourceOccurrences']) for batch in batches for item in batch['items']),
    'newQuestionBandsReviewed': 444,
    'chapterFourIdentityRoutes': identity['summary'],
    'candidatePublishedUses': pub['summary']['uses'], 'noExactIdentityUses': fresh['summary']['uses'],
    'publishedCandidateForms': pub['summary']['forms'], 'noExactCandidateForms': fresh['summary']['forms'],
    'chapterFourAdditionalExpressionReviews': 2, 'chapterFourAdditionalExpressionQuestionBands': 6,
})
progress['editorialDecisionPendingUses'] = progress['candidatePublishedUses'] + progress['noExactIdentityUses']
progress['unresolvedTokenUses'] = progress['editorialDecisionPendingUses']
assert progress['chapterFourNewUsesReviewed'] == 161
assert progress['tokenUses'] == sum(progress[key] for key in ('alreadyAuthoredEarlierUses', 'reviewedEarlierMeaningSharedUses', 'reviewedProperNameUses', 'chapterFourPublishedReuseUses', 'chapterFourNewUsesReviewed', 'editorialDecisionPendingUses'))
assert d['history'][-1]['version'] in (58, 59)
if d['history'][-1]['version'] == 58:
    d['history'].append({'version': 59, 'date': '2026-09-29', 'reason': f"Chapter IV reviewed 28 further unmatched lexical meanings across batches 13–15 (now 148), 28 new source uses and 84 further offline question bands (now 444). The earlier eurent auxiliary remains an already reviewed carryover, distinct from the later experience-of-difficulty use. Five remaining Chapter IV no-exact tokens are phrase components. The published candidate holds still require review. Remaining IV–VII decisions: {progress['editorialDecisionPendingUses']}; no import or publication."})
d['review']['remainingChapters']['nextAction'] = 'Finish Chapter IV published-candidate holds and phrase components: 78 published-candidate uses and five no-exact phrase components remain. Review new senses and all expression question bands, then produce zero-unresolved chapter IV coverage and proceed to V–VII.'
path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(progress))
