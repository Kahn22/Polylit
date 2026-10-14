#!/usr/bin/env python3
"""Record chapter IV–VII source queues without claiming question review or import."""
import hashlib,json
from pathlib import Path
folder=Path('content/sources/wrk_voltaire_micromegas')
path=folder/'dossier.json';dossier=json.loads(path.read_text())
files=[f'chapter-0{n}-inventory.json' for n in range(4,8)]+[
 'chapter-04-07-carryover-review.json','chapter-04-07-names.json',
 'chapter-04-07-expressions.json','chapter-04-07-published-candidates.json','chapter-04-07-new-form-queue.json']
existing={e['file']:e for e in dossier['evidence']}
for f in files:
 b=(folder/f).read_bytes()
 existing[f]={'role':'chapter_four_to_seven_offline_source_bound_inventory_and_editorial_queue','file':f,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
dossier['evidence']=[e for e in dossier['evidence'] if e['file'] not in files]+[existing[f] for f in files]
read=lambda n:json.loads((folder/n).read_text())
inventories=[read(f'chapter-0{n}-inventory.json') for n in range(4,8)]
prior=read('chapter-04-07-carryover-review.json')
names=read('chapter-04-07-names.json');expressions=read('chapter-04-07-expressions.json')
published=read('chapter-04-07-published-candidates.json');new=read('chapter-04-07-new-form-queue.json')
progress={'chapters':[4,5,6,7], 'tokenUses':sum(i['summary']['tokenUses'] for i in inventories),
 'thoughtUnits':133,'alreadyAuthoredEarlierUses':sum(i['summary']['priorAuthoredUses'] for i in inventories),
 'reviewedEarlierMeaningSharedUses':prior['summary']['sharedUses'],
 'reviewedProperNameUses':names['summary']['sourceUses'],
 'editorialDecisionPendingUses':published['summary']['uses']+new['summary']['uses'],
 'candidatePublishedUses':published['summary']['uses'],
 'noExactIdentityUses':new['summary']['uses'],
 'publishedCandidateForms':published['summary']['forms'],
 'noExactCandidateForms':new['summary']['forms'],
 'separateMeaningUsesWithinPending':prior['summary']['separateMeaningUses'],
 'expressionCandidatesTriaged':expressions['summary']['candidates'],
 'expressionPhraseUses':expressions['summary']['phraseUses'],
 'newQuestionBandsReviewed':0,
 'unresolvedTokenUses':published['summary']['uses']+new['summary']['uses']}
assert progress['tokenUses']==4434 and progress['thoughtUnits']==sum(len([u for u in read('unit-plan.json')['units'] if u['chapter']==c]) for c in range(4,8))
assert progress['tokenUses']==progress['alreadyAuthoredEarlierUses']+progress['reviewedEarlierMeaningSharedUses']+progress['reviewedProperNameUses']+progress['editorialDecisionPendingUses']
dossier['review']['remainingChapters']={'status':'complete_source_inventories_candidate_review_and_new_questions_pending','progress':progress,
 'nextAction':'Start chapter IV with the sorted chapter-04-07-new-form-queue.json and chapter-04-07-published-candidates.json; resolve all context-specific senses and authored question bands, then chapters V–VII and whole-work reconciliation. Keep the plural tes published-sense repair hold.'}
version=dossier['history'][-1]['version']+1
if version!=48:raise ValueError(f'Unexpected dossier history version {version}')
dossier['history'].append({'version':version,'date':'2026-09-28','reason':f"Chapters IV–VII source-bound inventory: {progress['tokenUses']} token uses in 133 thought units; {progress['alreadyAuthoredEarlierUses']} previously authored uses, {progress['reviewedEarlierMeaningSharedUses']} newly reviewed carryovers, {progress['reviewedProperNameUses']} proper names and {progress['editorialDecisionPendingUses']} explicit contextual decisions pending. 25 expressions triaged, six meaning exceptions segregated. No new authored question bands, learner import or publication."})
path.write_text(json.dumps(dossier,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(progress))
