#!/usr/bin/env python3
"""Record the current offline chapter III package without implying publication."""
import hashlib
import json
import re
from pathlib import Path

folder = Path('content/sources/wrk_voltaire_micromegas')
path = folder / 'dossier.json'
dossier = json.loads(path.read_text())
coverage = json.loads((folder / 'chapter-03-coverage.json').read_text())
files = (['chapter-03-coverage.json', 'chapter-03-carryover.json', 'chapter-03-names.json', 'chapter-03-expressions.json', 'chapter-03-phrase-components.json',
          'chapter-03-identity-packet.json', 'chapter-03-identity-plan.json', 'chapter-03-expression-qa.json'] +
         sorted(p.name for p in folder.glob('chapter-03-batch-??.json')) +
         sorted(p.name for p in folder.glob('chapter-03-reuse-??.json')) +
         sorted(p.name for p in folder.glob('chapter-03-ambiguous-??.json')) +
         sorted(p.name for p in folder.glob('chapter-03-qa-??.json')))
roles = {
    'chapter-03-coverage.json': 'chapter_three_token_inventory_partial_review',
    'chapter-03-carryover.json': 'chapter_three_earlier_draft_question_carryover',
    'chapter-03-names.json': 'chapter_three_proper_name_review',
    'chapter-03-expressions.json': 'chapter_three_expression_triage',
    'chapter-03-phrase-components.json': 'chapter_three_phrase_component_review',
    'chapter-03-identity-packet.json': 'chapter_three_published_lemma_comparison_packet',
    'chapter-03-identity-plan.json': 'chapter_three_source_bound_identity_route_plan',
    'chapter-03-expression-qa.json': 'chapter_three_expression_three_band_question_review',
}
evidence = {item['file']: item for item in dossier['evidence']}
for name in files:
    raw = (folder / name).read_bytes()
    evidence[name] = {'role': roles.get(name, 'chapter_three_offline_editorial_review'),
                      'file': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
dossier['evidence'] = [item for item in dossier['evidence'] if item['file'] not in files] + [evidence[name] for name in files]
summary = coverage['summary']
dossier['review'].setdefault('chapterThree', {})['lexical'] = (
    f"Offline chapter review: {summary['draftedTokenUses']} drafted token uses, "
    f"{summary['reusedTokenUses']} published reuse uses, "
    f"{summary['excludedProperNameUses']} proper-name exclusions, "
    f"{summary['coveredPhraseComponents']} phrase components, "
    f"{summary['unresolvedTokenUses']} unresolved of {summary['tokenUses']}; no learner import.")
dossier['review']['chapterThree']['progress'] = {
    **summary,
    'batchCount': len([name for name in files if re.fullmatch(r'chapter-03-batch-\d\d.json', name)]),
    'newMeaningDrafts': sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-03-batch-\d\d.json', name)),
    'publishedReusePackets': len([name for name in files if re.fullmatch(r'chapter-03-(reuse|ambiguous)-\d\d.json', name)]),
    'carriedOverUses': sum(len(item['sourceOccurrences']) for item in json.loads((folder / 'chapter-03-carryover.json').read_text())['items']),
    'newQuestionBands': 3 * sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-03-batch-\d\d.json', name)),
    'expressionTriages': len(json.loads((folder / 'chapter-03-expressions.json').read_text())['items']),
    'newExpressionQuestionBands': sum(len(item.get('questions', [])) for item in json.loads((folder / 'chapter-03-expressions.json').read_text())['items']),
    'questionReviewedMeanings': sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-03-qa-\d\d.json', name)),
    'questionReviewedBands': 3 * sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-03-qa-\d\d.json', name)),
    'identityRoutes': json.loads((folder / 'chapter-03-identity-plan.json').read_text())['summary'],
    'expressionReviewedBands': 3 * len(json.loads((folder / 'chapter-03-expression-qa.json').read_text())['items']),
    'earlierExpressionSharedBands': 3,
}
version = dossier['history'][-1]['version'] + 1
dossier['history'].append({'version': version, 'date': '2026-09-28',
    'reason': f"Chapter II offline editorial review: {dossier['review']['chapterThree']['progress']['newMeaningDrafts']} contextual meaning drafts, {dossier['review']['chapterThree']['progress']['questionReviewedBands']} individually reviewed question bands, and {len(json.loads((folder / 'chapter-03-identity-plan.json').read_text())['items'])} source-bound shared identity routes. {summary['reusedTokenUses']} published reuse uses, {summary['excludedProperNameUses']} proper names and {summary['coveredPhraseComponents']} phrase components indexed; {summary['unresolvedTokenUses']} token uses unresolved. One new expression has three reviewed bands; à peine shares the earlier reviewed questions. Later chapters, whole-work reconciliation and learner import remain pending; no learner import or publication."})
path.write_text(json.dumps(dossier, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'historyVersion': version, 'evidenceFiles': len(files), **dossier['review']['chapterThree']['progress']}))
