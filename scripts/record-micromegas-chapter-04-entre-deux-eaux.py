#!/usr/bin/env python3
"""Record the literal underwater locution while holding its component tokens."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
read = lambda name: json.loads((p / name).read_text())
inv = read('chapter-04-inventory.json')
unit = read('unit-plan.json')['units'][107]
phrase = 'entre deux eaux'
start = unit['text'].index(phrase)
assert (unit['ordinal'], start) == (108, 74)
components = [t for t in inv['tokens'] if t['unit'] == 108 and start <= t['start'] < start + len(phrase)]
assert [(t['form'], t['start']) for t in components] == [('entre', 74), ('deux', 80), ('eaux', 85)]
questions = [
    {'band': '1-3', 'context': 'quelque chose d’imperceptible qui remuait entre deux eaux', 'question': 'Where was it moving?', 'answer': 'below the water’s surface', 'choices': ['below the water’s surface', 'high in the sky', 'on dry land', 'at the sea bottom']},
    {'band': '4-5', 'context': 'La baleine nage sous la surface, sans être au fond : elle remue ___.', 'question': 'Complétez la phrase.', 'answer': phrase, 'choices': [phrase, 'sur la plage', 'dans les airs', 'au fond de la mer']},
    {'band': '6-8', 'context': 'Le Saturnien voit un mouvement dans la mer Baltique, sous la surface de l’eau. Le sens est spatial, sans allusion aux partis que l’on ménage.', 'question': 'Quelle locution du passage indique cette position ?', 'answer': phrase, 'choices': [phrase, 'à fleur de terre', 'à ciel ouvert', 'de droit fil']},
]
assert all(len(set(q['choices'])) == 4 and q['answer'] in q['choices'] for q in questions)
sha = lambda name: hashlib.sha256((p / name).read_bytes()).hexdigest()
out = {
    'version': 1, 'workId': inv['workId'], 'chapter': 4,
    'status': 'source_bound_expression_review_unpublished_component_decisions_pending',
    'sourceSha256': inv['sourceSha256'], 'unitPlanSha256': inv['unitPlanSha256'],
    'inventorySha256': sha('chapter-04-inventory.json'),
    'items': [{
        'key': 'entre_deux_eaux', 'surfacePattern': phrase,
        'meaning': 'below the water surface, away from the bottom', 'partOfSpeech': 'adverbial locution',
        'decision': 'new_expression_three_question_bands_pending_complete_work_import',
        'sourceOccurrences': [{'chapter': 4, 'unit': 108, 'start': start, 'end': start + len(phrase), 'text': phrase}],
        'componentTokenHolds': [{'chapter': 4, 'unit': 108, 'start': t['start'], 'end': t['end'], 'text': t['text'], 'form': t['form']} for t in components],
        'questions': questions,
        'reviewNote': 'The whale moves below the Baltic surface, rather than between political factions. The Académie records the literal nager entre deux eaux and later glosses it as below the surface. Entre, deux and eaux retain separate pending or reviewed token dispositions.',
        'references': ['https://dictionnaire-academie.fr/article/A4N0010', 'https://www.dictionnaire-academie.fr/article/A6E1065'],
    }],
}
(p / 'chapter-04-entre-deux-eaux-review.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print('Reviewed one underwater phrase and three question bands; component tokens remain in their own dispositions')
