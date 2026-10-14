#!/usr/bin/env python3
"""Record chapter IV sixty reviewed meanings and current pending queues."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');path=p/'dossier.json';d=json.loads(path.read_text())
read=lambda n:json.loads((p/n).read_text())
files=['chapter-04-batch-%02d.json'%n for n in range(1,7)]+['chapter-04-qa-01.json','chapter-04-qa-02.json','chapter-04-identity-packet.json','chapter-04-identity-plan.json','chapter-04-07-published-candidates.json','chapter-04-07-new-form-queue.json']
existing={i['file']:i for i in d['evidence']}
for name in files:
 raw=(p/name).read_bytes();existing[name]={'role':'chapter_four_offline_editorial_review_or_remaining_candidate_queue','file':name,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
d['evidence']=[x for x in d['evidence'] if x['file'] not in files]+[existing[n] for n in files]
progress=d['review']['remainingChapters']['progress'];batches=[read(f'chapter-04-batch-{n:02}.json') for n in range(1,7)]
qa=[read('chapter-04-qa-01.json'),read('chapter-04-qa-02.json')]
identity=read('chapter-04-identity-plan.json');pub=read('chapter-04-07-published-candidates.json');new=read('chapter-04-07-new-form-queue.json')
keys=[i['key'] for b in batches for i in b['items']]
assert len(keys)==len(set(keys))==60 and set(keys)=={i['key'] for q in qa for i in q['items']}=={i['key'] for i in identity['items']}
progress.update({'chapterFourNewMeaningsReviewed':60,'chapterFourNewUsesReviewed':sum(len(i['sourceOccurrences']) for b in batches for i in b['items']),
 'newQuestionBandsReviewed':180,'chapterFourIdentityRoutes':identity['summary'],
 'candidatePublishedUses':pub['summary']['uses'],'noExactIdentityUses':new['summary']['uses'],
 'publishedCandidateForms':pub['summary']['forms'],'noExactCandidateForms':new['summary']['forms']})
progress['editorialDecisionPendingUses']=progress['candidatePublishedUses']+progress['noExactIdentityUses'];progress['unresolvedTokenUses']=progress['editorialDecisionPendingUses']
assert progress['tokenUses']==progress['alreadyAuthoredEarlierUses']+progress['reviewedEarlierMeaningSharedUses']+progress['reviewedProperNameUses']+progress['chapterFourNewUsesReviewed']+progress['editorialDecisionPendingUses']
assert d['history'][-1]['version']==49
d['history'].append({'version':50,'date':'2026-09-28','reason':f"Chapter IV first 60 contextual meanings across six ten-meaning batches: {progress['chapterFourNewUsesReviewed']} indexed uses, 180 individually reviewed offline question bands and 60 proposed identity routes, including two held published sense repairs. The remaining four-chapter editorial queue contains {progress['editorialDecisionPendingUses']} uses; no Micromégas import or publication."})
d['review']['remainingChapters']['nextAction']='Continue source-order Chapter IV from the next unresolved form très-distinctement in unit 94, then finish chapters V–VII, inspect all published-question reuse, reconcile identities and resolve published-sense holds (reposés, chien, tes) before import.'
path.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(progress))
