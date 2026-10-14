#!/usr/bin/env python3
"""Record the Chapter IV stream phrase without consuming its component token decisions."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
read = lambda name: json.loads((p / name).read_text())
inv = read('chapter-04-inventory.json')
plan = read('unit-plan.json')
unit = plan['units'][94]
phrase = 'de droit fil'
start = unit['text'].index(phrase)
assert (unit['ordinal'], start) == (95, 207)
components = [t for t in inv['tokens'] if t['unit'] == 95 and start <= t['start'] < start + len(phrase)]
assert [(t['form'], t['start']) for t in components] == [('de', 207), ('droit', 210), ('fil', 216)]
questions = [
    {'band': '1-3', 'context': 'aucun ne va de droit fil', 'question': 'What does “de droit fil” mean here?', 'answer': 'in a straight line', 'choices': ['in a straight line', 'very slowly', 'under water', 'in a circle']},
    {'band': '4-5', 'context': 'Le ruisseau ne suit pas une ligne droite : il ne va pas ___.', 'question': 'Complétez la phrase.', 'answer': 'de droit fil', 'choices': ['de droit fil', 'à reculons', 'en rond', 'à tâtons']},
    {'band': '6-8', 'context': 'Le nain voudrait que les ruisseaux suivent une trajectoire droite, sans biaiser.', 'question': 'Quelle locution du passage décrit cette trajectoire ?', 'answer': 'de droit fil', 'choices': ['de droit fil', 'de fil en aiguille', 'à contre-courant', 'au hasard']},
]
assert all(len(set(q['choices'])) == 4 and q['answer'] in q['choices'] for q in questions)
sha = lambda name: hashlib.sha256((p / name).read_bytes()).hexdigest()
out = {
    'version': 1, 'workId': inv['workId'], 'chapter': 4,
    'status': 'source_bound_expression_review_unpublished_component_decisions_pending',
    'sourceSha256': inv['sourceSha256'], 'unitPlanSha256': inv['unitPlanSha256'],
    'inventorySha256': sha('chapter-04-inventory.json'),
    'items': [{
        'key': 'de_droit_fil', 'surfacePattern': phrase,
        'meaning': 'in a straight line; without veering', 'partOfSpeech': 'adverbial locution',
        'decision': 'new_expression_three_question_bands_pending_complete_work_import',
        'sourceOccurrences': [{'chapter': 4, 'unit': 95, 'start': start, 'end': start + len(phrase), 'text': phrase}],
        'componentTokenHolds': [{'chapter': 4, 'unit': 95, 'start': t['start'], 'end': t['end'], 'text': t['text'], 'form': t['form']} for t in components],
        'questions': questions,
        'reviewNote': 'The stream does not travel in a straight line. The historical Académie entry for fil records aller de droit fil; the phrase is reviewed as one locution while de, droit and fil retain separate pending token dispositions.',
        'reference': 'https://www.dictionnaire-academie.fr/article/A2F0344',
    }],
}
(p / 'chapter-04-droit-fil-review.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print('Reviewed one phrase and three question bands; three component token decisions remain pending')
