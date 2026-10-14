#!/usr/bin/env python3
"""Record the first reviewed Chapter IV meanings while preserving pending queues."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');path=p/'dossier.json';d=json.loads(path.read_text())
read=lambda n:json.loads((p/n).read_text())
files=['chapter-04-batch-01.json','chapter-04-batch-02.json','chapter-04-qa-01.json','chapter-04-07-published-candidates.json','chapter-04-07-new-form-queue.json']
evidence={e['file']:e for e in d['evidence']}
for f in files:
 b=(p/f).read_bytes();evidence[f]={'role':'chapter_four_offline_source_and_question_review' if '-batch-' in f or '-qa-' in f else 'remaining_chapters_recomputed_unresolved_candidate_queue','file':f,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
d['evidence']=[e for e in d['evidence'] if e['file'] not in files]+[evidence[f] for f in files]
q=read('chapter-04-qa-01.json');b=[read('chapter-04-batch-01.json'),read('chapter-04-batch-02.json')]
reviewedUses=sum(len(i['sourceOccurrences']) for batch in b for i in batch['items'])
assert len(q['items'])==20 and reviewedUses==26
progress=d['review']['remainingChapters']['progress'];pub=read('chapter-04-07-published-candidates.json');new=read('chapter-04-07-new-form-queue.json')
progress.update({'chapterFourNewMeaningsReviewed':20,'chapterFourNewUsesReviewed':reviewedUses,'newQuestionBandsReviewed':60,
 'candidatePublishedUses':pub['summary']['uses'],'noExactIdentityUses':new['summary']['uses'],
 'publishedCandidateForms':pub['summary']['forms'],'noExactCandidateForms':new['summary']['forms']})
progress['editorialDecisionPendingUses']=progress['candidatePublishedUses']+progress['noExactIdentityUses'];progress['unresolvedTokenUses']=progress['editorialDecisionPendingUses']
assert progress['tokenUses']==progress['alreadyAuthoredEarlierUses']+progress['reviewedEarlierMeaningSharedUses']+progress['reviewedProperNameUses']+progress['chapterFourNewUsesReviewed']+progress['editorialDecisionPendingUses']
assert d['history'][-1]['version']==48
d['history'].append({'version':49,'date':'2026-09-28','reason':f"Chapter IV first 20 source-bound new meanings: {reviewedUses} uses, 60 individually inspected offline question bands. Remaining IV–VII candidate queue has {progress['editorialDecisionPendingUses']} uses requiring contextual decisions, shared identity routes and complete work import. No publication."})
d['review']['remainingChapters']['nextAction']='Continue chapter IV source-order meaning and published-reuse review from unit 86 after the first 20 authored meanings, then chapters V–VII. Resolve 4,129 queued uses, remaining expressions, shared identity routes and the published plural tes repair hold before import.'
path.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print(progress)
