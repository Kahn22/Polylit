#!/usr/bin/env python3
"""Record the current offline chapter II package without implying publication."""
import hashlib
import json
import re
from pathlib import Path

folder = Path('content/sources/wrk_voltaire_micromegas')
path = folder / 'dossier.json'
dossier = json.loads(path.read_text())
coverage = json.loads((folder / 'chapter-02-coverage.json').read_text())
files = (['chapter-02-coverage.json', 'chapter-02-names.json', 'chapter-02-expressions.json', 'chapter-02-phrase-components.json',
          'chapter-02-identity-packet.json', 'chapter-02-identity-plan.json', 'chapter-02-expression-qa.json'] +
         sorted(p.name for p in folder.glob('chapter-02-batch-??.json')) +
         sorted(p.name for p in folder.glob('chapter-02-reuse-??.json')) +
         sorted(p.name for p in folder.glob('chapter-02-ambiguous-??.json')) +
         sorted(p.name for p in folder.glob('chapter-02-qa-??.json')))
roles = {
    'chapter-02-coverage.json': 'chapter_two_token_inventory_partial_review',
    'chapter-02-names.json': 'chapter_two_proper_name_review',
    'chapter-02-expressions.json': 'chapter_two_expression_triage',
    'chapter-02-phrase-components.json': 'chapter_two_phrase_component_review',
    'chapter-02-identity-packet.json': 'chapter_two_published_lemma_comparison_packet',
    'chapter-02-identity-plan.json': 'chapter_two_source_bound_identity_route_plan',
    'chapter-02-expression-qa.json': 'chapter_two_expression_three_band_question_review',
}
evidence = {item['file']: item for item in dossier['evidence']}
for name in files:
    raw = (folder / name).read_bytes()
    evidence[name] = {'role': roles.get(name, 'chapter_two_offline_editorial_review'),
                      'file': name, 'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest()}
dossier['evidence'] = [item for item in dossier['evidence'] if item['file'] not in files] + [evidence[name] for name in files]
summary = coverage['summary']
dossier['review']['chapterTwo']['lexical'] = (
    f"Offline chapter review: {summary['draftedTokenUses']} drafted token uses, "
    f"{summary['reusedTokenUses']} published reuse uses, "
    f"{summary['excludedProperNameUses']} proper-name exclusions, "
    f"{summary['coveredPhraseComponents']} phrase components, "
    f"{summary['unresolvedTokenUses']} unresolved of {summary['tokenUses']}; no learner import.")
dossier['review']['chapterTwo']['progress'] = {
    **summary,
    'batchCount': len([name for name in files if re.fullmatch(r'chapter-02-batch-\d\d.json', name)]),
    'newMeaningDrafts': sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-02-batch-\d\d.json', name)),
    'publishedReusePackets': len([name for name in files if re.fullmatch(r'chapter-02-(reuse|ambiguous)-\d\d.json', name)]),
    'newQuestionBands': 3 * sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-02-batch-\d\d.json', name)),
    'expressionTriages': len(json.loads((folder / 'chapter-02-expressions.json').read_text())['items']),
    'newExpressionQuestionBands': sum(len(item.get('questions', [])) for item in json.loads((folder / 'chapter-02-expressions.json').read_text())['items']),
    'questionReviewedMeanings': sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-02-qa-\d\d.json', name)),
    'questionReviewedBands': 3 * sum(len(json.loads((folder / name).read_text())['items']) for name in files if re.fullmatch(r'chapter-02-qa-\d\d.json', name)),
    'identityRoutes': json.loads((folder / 'chapter-02-identity-plan.json').read_text())['summary'],
    'expressionReviewedBands': 3 * len(json.loads((folder / 'chapter-02-expression-qa.json').read_text())['items']),
}
version = dossier['history'][-1]['version'] + 1
dossier['history'].append({'version': version, 'date': '2026-09-28',
    'reason': f"Chapter II offline editorial review: {dossier['review']['chapterTwo']['progress']['newMeaningDrafts']} contextual meaning drafts, {dossier['review']['chapterTwo']['progress']['questionReviewedBands']} individually reviewed question bands, and {len(json.loads((folder / 'chapter-02-identity-plan.json').read_text())['items'])} source-bound shared identity routes. {summary['reusedTokenUses']} published reuse uses, {summary['excludedProperNameUses']} proper names and {summary['coveredPhraseComponents']} phrase components indexed; {summary['unresolvedTokenUses']} token uses unresolved. One expression has three reviewed bands. Later chapters, whole-work reconciliation and learner import remain pending; no learner import or publication."})
path.write_text(json.dumps(dossier, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'historyVersion': version, 'evidenceFiles': len(files), **dossier['review']['chapterTwo']['progress']}))
