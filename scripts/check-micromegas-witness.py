"""Mechanical scan/transcription comparison; editorial scan review remains separate."""
from pathlib import Path
import difflib
import json
import re
import subprocess
import unicodedata

root = Path(__file__).resolve().parents[1] / 'content/sources/wrk_voltaire_micromegas'
pages = json.loads((root / 'page-transcriptions.json').read_text())
assert len(pages) == 18 and [x['printedPage'] for x in pages] == list(range(105, 123))

def tokens(text):
    text = unicodedata.normalize('NFD', text.lower())
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return re.findall(r'[a-z]+', text)

report = []
for page in pages:
    number = page['printedPage']
    scan = root / f'scan-p{number}.jpg'
    assert scan.is_file() and scan.stat().st_size > 200_000
    ocr = subprocess.check_output(['tesseract', str(scan), 'stdout', '-l', 'eng'], stderr=subprocess.DEVNULL, text=True)
    # The OCR sees running heads and editorial notes; retain them in both sides.
    a, b = tokens(page['text']), tokens(ocr)
    ratio = difflib.SequenceMatcher(None, a, b, autojunk=False).ratio()
    report.append({'printedPage': number, 'scanFile': scan.name, 'transcriptionTokens': len(a), 'ocrTokens': len(b), 'tokenAlignmentRatio': round(ratio, 4)})
(root / 'scan-ocr-comparison.json').write_text(json.dumps({'version': 1, 'method': 'Tesseract English OCR of 18 historical French page images; rough alignment only, not an editorial approval', 'pages': report}, indent=2) + '\n')
print(json.dumps({'pages': len(report), 'minAlignment': min(x['tokenAlignmentRatio'] for x in report), 'meanAlignment': round(sum(x['tokenAlignmentRatio'] for x in report)/len(report), 3), 'lowest': sorted(report, key=lambda x:x['tokenAlignmentRatio'])[:3]}))
