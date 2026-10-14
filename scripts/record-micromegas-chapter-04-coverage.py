#!/usr/bin/env python3
"""Reconcile every Chapter IV tokenizer span with its reviewed editorial decision."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
read = lambda name: json.loads((p / name).read_text())
sha = lambda name: hashlib.sha256((p / name).read_bytes()).hexdigest()
inv = read('chapter-04-inventory.json')
tokens = {(t['unit'], t['start'], t['end']): t for t in inv['tokens']}
assigned = {}

def assign(o, disposition, file, key):
    span = (o['unit'], o['start'], o['end'])
    t = tokens[span]
    assert span not in assigned and t['text'] == o['text']
    assigned[span] = {'disposition': disposition, 'evidenceFile': file, 'evidenceKey': key}

for t in inv['tokens']:
    if t.get('earlierDraft'):
        assign(t, 'already_authored_earlier', t['earlierDraft']['file'], t['earlierDraft']['key'])
for i in read('chapter-04-07-carryover-review.json')['items']:
    for o in i['occurrences']:
        if o['chapter'] == 4:
            assign(o, 'share_earlier_reviewed_meaning', 'chapter-04-07-carryover-review.json', i['key'])
for i in read('chapter-04-07-names.json')['items']:
    for o in i['occurrences']:
        if o['chapter'] == 4:
            assign(o, 'proper_name', 'chapter-04-07-names.json', i['form'])
for n in range(1, 6):
    file = f'chapter-04-published-reuse-review-{n:02}.json'
    for i in read(file)['items']:
        for o in i['sourceOccurrences']:
            assign(o, 'reuse_published_identity_and_questions', file, i['form'])
for n in range(1, 20):
    file = f'chapter-04-batch-{n:02}.json'
    for i in read(file)['items']:
        for o in i['sourceOccurrences']:
            assign(o, 'new_reviewed_meaning_and_questions', file, i['key'])
for i in read('chapter-04-final-dispositions.json')['items']:
    assign(i['occurrence'], i['decision'], 'chapter-04-final-dispositions.json', i.get('dependsOn', i.get('identity')))

assert len(assigned) == len(tokens) == inv['summary']['tokenUses'] == 1041
counts = {}
rows = []
for t in inv['tokens']:
    disposition = assigned[(t['unit'], t['start'], t['end'])]
    counts[disposition['disposition']] = counts.get(disposition['disposition'], 0) + 1
    rows.append({k: t[k] for k in ('unit', 'start', 'end', 'text', 'form')} | disposition)
assert sum(counts.values()) == 1041
out = {'version': 1, 'workId': inv['workId'], 'chapter': 4,
       'status': 'complete_source_bound_editorial_coverage_unpublished_pending_complete_work_import',
       'sourceSha256': inv['sourceSha256'], 'unitPlanSha256': inv['unitPlanSha256'],
       'inventorySha256': sha('chapter-04-inventory.json'),
       'summary': {'tokenUses': len(rows), 'resolvedTokenUses': len(rows), 'unresolvedTokenUses': 0,
                   'dispositions': counts, 'newMeanings': 179, 'newQuestionBands': 537,
                   'additionalExpressionReviews': 13, 'additionalExpressionQuestionBands': 39},
       'tokens': rows,
       'note': 'Each exact source token has one reviewed disposition. These offline records have not been imported or published.'}
(p / 'chapter-04-coverage.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print(out['summary'])
