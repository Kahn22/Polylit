#!/usr/bin/env python3
"""Fingerprint the individually inspected chapter III draft question bands."""
import hashlib
import json
from pathlib import Path

folder = Path('content/sources/wrk_voltaire_micromegas')
read = lambda name: json.loads((folder / name).read_text())
sha = lambda data: hashlib.sha256(data).hexdigest()
digest = lambda obj: sha(json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode())
source = sha((folder / 'canonical-draft.txt').read_bytes())
units = sha((folder / 'unit-plan.json').read_bytes())
coverage = sha((folder / 'chapter-03-coverage.json').read_bytes())
packet = read('chapter-03-identity-packet.json')
plan = read('chapter-03-identity-plan.json')
assert plan['identityPacketSha256'] == sha((folder / 'chapter-03-identity-packet.json').read_bytes())
assert len(packet['items']) == len(plan['items']) == 122

# These fixes arose while reading the source use and all three question bands.
corrections = {
    'amour_love': 'Replaced the consonant-initial and semantically loose noun alternatives with vowel-initial masculine singular choices after d’ in the completion.',
    'passat_could_do_without': 'Clarified the finite subjunctive clause and changed the upper-band contrasts to grammatical clauses.',
    'eurent_had': 'Clarified that eurent marks the past anterior auxiliary in the narrated sequence.',
    'atmosphere_atmosphere': 'Revised the noun frame and agreement so all four choices fit une.',
}

recorded = []
for first, last in ((1, 5), (6, 10), (11, 13)):
    names = [f'chapter-03-batch-{n:02}.json' for n in range(first, last + 1)]
    items = []
    for name in names:
        for item in read(name)['items']:
            matches = [candidate for candidate in packet['items'] if candidate['key'] == item['key']]
            routes = [candidate for candidate in plan['items'] if candidate['key'] == item['key']]
            assert len(matches) == len(routes) == 1
            candidate, route = matches[0], routes[0]
            assert route['questionSha256'] == candidate['questionSha256'] == digest(item['questions'])
            assert route['sourceOccurrencesSha256'] == candidate['sourceOccurrencesSha256'] == digest(item['sourceOccurrences'])
            assert item['questions'][1]['answer'].casefold() == item['form'].casefold() and item['questions'][1]['context'].count('___') == 1
            assert all(q['answer'] in q['choices'] for q in item['questions'])
            items.append({
                'key': item['key'], 'form': item['form'], 'meaning': item['meaning'],
                'batchFile': name, 'sourceOccurrencesSha256': candidate['sourceOccurrencesSha256'],
                'questionSha256': candidate['questionSha256'],
                'questionBands': [q['band'] for q in item['questions']],
                'publishedExactCandidateCount': len(candidate['publishedExact']),
                'identityRoute': route['route'],
                'decision': 'retain_reviewed_offline_draft_pending_complete_work_import',
                'reviewNote': item['editorialNote'] + ' The three question bands distinguish ' + item['meaning'] + ' from the stated alternatives.' + (' ' + corrections[item['key']] if item['key'] in corrections else ''),
            })
            recorded.append(item['key'])
    name = f'chapter-03-qa-{(first - 1) // 5 + 1:02}.json'
    output = {
        'version': 1, 'workId': 'wrk_voltaire_micromegas', 'chapter': 3,
        'status': 'source_and_three_band_question_review_recorded_unpublished',
        'scope': f'Batches {first:02}–{last:02}, {len(items)} meanings and {len(items)*3} offline questions',
        'sourceSha256': source, 'unitPlanSha256': units, 'coverageSha256': coverage,
        'identityPacketSha256': sha((folder / 'chapter-03-identity-packet.json').read_bytes()),
        'identityPlanSha256': sha((folder / 'chapter-03-identity-plan.json').read_bytes()),
        'batchEvidence': [{'file': batch, 'sha256': sha((folder / batch).read_bytes())} for batch in names],
        'corrections': [{'key': key, 'reason': reason} for key, reason in corrections.items() if any(item['key'] == key for item in items)],
        'note': 'The source meaning and each authored 1–3, 4–5 and 6–8 question were inspected individually for meaning, grammatical choices and a distinct intended answer. The item notes record the source basis and concrete corrections. This is offline review, not learner import or an endorsement of unexamined published reuse questions.',
        'items': items,
    }
    (folder / name).write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(f'{name}: {len(items)} meanings, {len(items)*3} bands')
assert len(recorded) == len(set(recorded)) == 122

expression = read('chapter-03-expressions.json')
prepared = [item for item in expression['items'] if item.get('questions')]
assert len(prepared) == 1 and prepared[0]['key'] == 'quoi_qu_il_en_soit'
item = prepared[0]
linked = [phrase for phrase in expression['items'] if phrase['key'] == 'a_peine']
assert len(linked) == 1
previous = read('chapter-02-expressions.json')
old = [phrase for phrase in previous['items'] if phrase['key'] == 'a_peine'][0]
assert linked[0]['earlierExpressionSha256'] == sha((folder / 'chapter-02-expressions.json').read_bytes())
assert linked[0]['earlierQuestionSha256'] == digest(old['questions'])
review = {
    'version': 1, 'workId': 'wrk_voltaire_micromegas', 'chapter': 3,
    'status': 'offline_expression_question_review_recorded_unpublished',
    'sourceSha256': source, 'unitPlanSha256': units,
    'expressionEvidenceSha256': sha((folder / 'chapter-03-expressions.json').read_bytes()),
    'items': [{
        'key': item['key'], 'surface': item['surface'], 'meaning': item['meaning'],
        'questionSha256': digest(item['questions']), 'occurrencesSha256': digest(item['occurrences']),
        'questionBands': [q['band'] for q in item['questions']],
        'reviewNote': 'The phrase concedes that the next action holds whatever the case may be. Each of the three question bands distinguishes that concession from temporal sequence, a direct what question and a condition; every completion is grammatical and the upper-band explanation states all options.',
        'decision': 'retain_offline_expression_pending_complete_work_import',
    }],
    'earlierReviewedExpression': {'key': 'a_peine', 'earlierExpressionSha256': linked[0]['earlierExpressionSha256'], 'earlierQuestionSha256': linked[0]['earlierQuestionSha256'], 'chapterThreeOccurrencesSha256': digest(linked[0]['occurrences']), 'decision': 'share_previously_reviewed_expression_questions'},
}
(folder / 'chapter-03-expression-qa.json').write_text(json.dumps(review, ensure_ascii=False, indent=2) + '\n')
print('chapter-03-expression-qa.json: 1 new expression and 1 shared expression')
