"""Reconstruct the candidate from individual page transcriptions and compare every word."""
from pathlib import Path
import difflib
import hashlib
import json
import re

root = Path(__file__).resolve().parents[1] / 'content/sources/wrk_voltaire_micromegas'
pages = json.loads((root / 'page-transcriptions.json').read_text())
assert [page['printedPage'] for page in pages] == list(range(105, 123))
prose = '\n'.join(page['text'].split('↑ ')[0] for page in pages)
prose = prose[prose.index('CHAPITRE I.'):prose.index('FIN DE L’HISTOIRE DE MICROMÉGAS.')]
headings = re.findall(r'CHAPITRE [IVX]+\.\s*[^\n]+', prose)
assert len(headings) == 7
prose = re.sub(r'CHAPITRE [IVX]+\.\s*[^\n]+', '', prose)
markers = re.findall(r'\[(\d+)\]', prose)
assert len(markers) == 34
prose = re.sub(r'\[\d+\]', '', prose)
prose = prose.replace('\u00a0', ' ')
# Visual comparison to the 1877 scans found two online transcription
# normalizations of the printed two-word spelling.
assert prose.count('au-delà') == 2
prose = prose.replace('au-delà', 'au delà')
assert prose.count('quelques apparence que ceci') == 1
assert prose.count('une âme fut logée là') == 1
prose = prose.replace('quelques apparence que ceci', 'quelque apparence que ceci')
prose = prose.replace('une âme fut logée là', 'une âme fût logée là')
for online, printed in [
    ('Ô Dieu ! qui avez donné', 'O Dieu ! qui avez donné'),
    ('« Ô atomes intelligents', '« O atomes intelligents'),
    ('Très-bien, répondit l’homme', 'Très-bien, lui répondit l’homme'),
    ('Alors monsieur Micromégas,', 'Alors M. Micromégas,'),
]:
    assert prose.count(online) == 1, online
    prose = prose.replace(online, printed)
# The page source preserves typesetting splits; the transcluded work joins them.
joins = [
    {'printedPages': [117, 118], 'pageReading': 'au-- / dessus', 'canonicalReading': 'au-dessus'},
    {'printedPages': [119, 120], 'pageReading': 'dis- / séquons', 'canonicalReading': 'disséquons'},
]
prose = re.sub(r'au--\s+dessus', 'au-dessus', prose)
prose = re.sub(r'dis-\s+séquons', 'disséquons', prose)
tokens = lambda value: re.findall(r'[\w]+(?:[’\-][\w]+)*', value.lower(), re.UNICODE)
candidate = (root / 'canonical-draft.txt').read_text()
left, right = tokens(prose), tokens(candidate)
mismatches = [
    {'kind': kind, 'pageTokens': left[a:b], 'draftTokens': right[c:d]}
    for kind, a, b, c, d in difflib.SequenceMatcher(None, left, right, autojunk=False).get_opcodes()
    if kind != 'equal'
]
assert not mismatches, mismatches[:10]
chapter_pages = []
for heading in headings:
    label = heading.splitlines()[0]
    hits = [page['printedPage'] for page in pages if label in page['text']]
    assert len(hits) == 1, (label, hits)
    chapter_pages.append({'chapter': len(chapter_pages) + 1, 'startPrintedPage': hits[0]})
report = {
    'version': 1,
    'status': 'exact_word_sequence_after_documented_transformations',
    'method': 'Independent page transcriptions, selected 1877 volume pp. 105–122, compared to the canonical draft after removing headings and 34 editorial calls and joining two page-split words. Scan OCR is a separate rough check.',
    'draftSha256': hashlib.sha256(candidate.encode()).hexdigest(),
    'pages': list(range(105, 123)),
    'chapterStartPages': chapter_pages,
    'pageBreakJoins': joins,
    'printedReadingCorrections': [
        {'printedPage': page, 'transcriptionReading': 'au-delà', 'scanReading': 'au delà', 'candidateReading': 'au delà'}
        for page in (107, 108)
    ] + [
        {'printedPage': 109, 'transcriptionReading': 'tous les êtres', 'scanReading': 'tous- les êtres', 'candidateReading': 'tous les êtres', 'reason': 'Apparent compositor hyphen after the determiner; online transcription silently corrects it.'},
        {'printedPage': 113, 'transcriptionReading': 'quelques apparence', 'scanReading': 'quelque apparence', 'candidateReading': 'quelque apparence'},
        {'printedPage': 114, 'transcriptionReading': 'une âme fut logée', 'scanReading': 'une âme fût logée', 'candidateReading': 'une âme fût logée', 'reason': 'Imperfect subjunctive distinguishes this verb from the indicative fut earlier in the same passage.'},
        {'printedPage': 118, 'transcriptionReading': 'Ô Dieu ! / Ô atomes intelligents', 'scanReading': 'O Dieu ! / O atomes intelligents', 'candidateReading': 'O Dieu ! / O atomes intelligents'},
        {'printedPage': 121, 'transcriptionReading': 'Très-bien, répondit l’homme', 'scanReading': 'Très-bien, lui répondit l’homme', 'candidateReading': 'Très-bien, lui répondit l’homme'},
        {'printedPage': 121, 'transcriptionReading': 'Alors monsieur Micromégas', 'scanReading': 'Alors M. Micromégas', 'candidateReading': 'Alors M. Micromégas'}
    ],
    'comparedWordTokens': len(right),
    'wordSequenceMismatches': 0,
    'limitation': 'Exact agreement with corrected page transcriptions supports source preparation; learner identity, expression, and quiz review remain pending.'
}
(root / 'page-comparison.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'pages': len(pages), 'tokens': len(right), 'mismatches': len(mismatches), 'chapterStartPages': chapter_pages}))
