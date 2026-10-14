#!/usr/bin/env python3
"""Record the completed offline Chapter IV editorial packet in the work dossier."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
read = lambda name: json.loads((p / name).read_text())
path = p / 'dossier.json'
d = read('dossier.json')
files = ([f'chapter-04-batch-{n:02}.json' for n in range(1, 20)]
         + [f'chapter-04-qa-{n:02}.json' for n in range(1, 8)]
         + ['chapter-04-identity-packet.json', 'chapter-04-identity-plan.json',
            'chapter-04-droit-fil-review.json', 'chapter-04-entre-deux-eaux-review.json',
            'chapter-04-final-expressions.json', 'chapter-04-final-dispositions.json',
            'chapter-04-coverage.json', 'chapter-04-07-published-candidates.json',
            'chapter-04-07-new-form-queue.json'])
existing = {i['file']: i for i in d['evidence']}
for name in files:
    raw = (p / name).read_bytes()
    existing[name] = {'role': 'chapter_four_offline_editorial_review_and_coverage',
                      'file': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
d['evidence'] = [i for i in d['evidence'] if i['file'] not in files] + [existing[name] for name in files]
batches = [read(f'chapter-04-batch-{n:02}.json') for n in range(1, 20)]
qa = [read(f'chapter-04-qa-{n:02}.json') for n in range(1, 8)]
routes = read('chapter-04-identity-plan.json')
pub = read('chapter-04-07-published-candidates.json')
fresh = read('chapter-04-07-new-form-queue.json')
final = read('chapter-04-final-dispositions.json')
coverage = read('chapter-04-coverage.json')
keys = [i['key'] for b in batches for i in b['items']]
assert len(keys) == len(set(keys)) == 179
assert set(keys) == {i['key'] for q in qa for i in q['items']} == {i['key'] for i in routes['items']}
assert coverage['summary']['unresolvedTokenUses'] == 0
progress = d['review']['remainingChapters']['progress']
progress.update({
    'chapterFourNewMeaningsReviewed': len(keys),
    'chapterFourNewUsesReviewed': sum(len(i['sourceOccurrences']) for b in batches for i in b['items']),
    'newQuestionBandsReviewed': 3 * len(keys),
    'chapterFourIdentityRoutes': routes['summary'],
    'candidatePublishedUses': pub['summary']['uses'],
    'noExactIdentityUses': fresh['summary']['uses'],
    'publishedCandidateForms': pub['summary']['forms'],
    'noExactCandidateForms': fresh['summary']['forms'],
    'chapterFourAdditionalExpressionReviews': 13,
    'chapterFourAdditionalExpressionQuestionBands': 39,
    'chapterFourFinalDispositionUses': len(final['items']),
    'chapterFourUnresolvedUses': 0,
})
progress['editorialDecisionPendingUses'] = progress['candidatePublishedUses'] + progress['noExactIdentityUses']
progress['unresolvedTokenUses'] = progress['editorialDecisionPendingUses']
assert progress['chapterFourNewUsesReviewed'] == 203
assert progress['editorialDecisionPendingUses'] == 3183
assert progress['tokenUses'] == sum(progress[k] for k in (
    'alreadyAuthoredEarlierUses', 'reviewedEarlierMeaningSharedUses', 'reviewedProperNameUses',
    'chapterFourPublishedReuseUses', 'chapterFourNewUsesReviewed',
    'chapterFourFinalDispositionUses', 'editorialDecisionPendingUses'))
assert d['history'][-1]['version'] == 59
d['history'].append({'version': 60, 'date': '2026-09-29',
    'reason': 'Chapter IV offline editorial source coverage completed: all 1,041 tokenizer uses assigned exactly once; 179 new meanings, 203 source uses, 537 three-band vocabulary questions, 13 expression reviews with 39 questions, 728 earlier published reuse uses, and 41 final dispositions. Zero Chapter IV candidates remain. Chapters V–VII retain 3,183 contextual decisions. No complete-work import or publication.'})
d['review']['remainingChapters']['nextAction'] = ('Proceed with source-bound Chapter V–VII lexical, phrase, identity and question reviews. '
    'After all chapters reach zero unresolved uses, perform complete-work reconciliation and import checks before any separate publication gate.')
path.write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(progress))
