#!/usr/bin/env python3
"""Fingerprint the inspected source uses and all three authored bands for first 20 meanings."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas')
read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda o:sha(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode())
inventory=read('chapter-04-inventory.json');plan=read('chapter-04-identity-plan.json');items=[]
corrections={'dejeuner_morning_meal':'Checked the eighteenth-century breakfast meaning in the 1762 Académie dictionary; avoided a modern-only midday gloss.',
 'manchon_muff':'Checked the historical hand warmer and petit chien de manchon phrase against the Académie dictionary.',
 'telles_such':'Made the adjective distractors agree as feminine plurals after de in the same syntactic frame.'}
for n in (1,2):
 f=f'chapter-04-batch-0{n}.json';batch=read(f)
 assert batch['sourceSha256']==inventory['sourceSha256'] and batch['unitPlanSha256']==inventory['unitPlanSha256']
 for i in batch['items']:
  assert len(i['questions'])==3 and [q['band'] for q in i['questions']]==['1-3','4-5','6-8']
  assert all(len(q['choices'])==4 and q['answer'] in q['choices'] and len(set(q['choices']))==4 for q in i['questions'])
  assert i['questions'][1]['context'].count('___')==1 and all(s.lower() in i['questions'][2]['context'].lower() for s in i['questions'][2]['choices'])
  for o in i['sourceOccurrences']:
   t=[t for t in inventory['tokens'] if t['unit']==o['unit'] and t['start']==o['start'] and t['end']==o['end']]
   assert len(t)==1 and not t[0].get('earlierDraft') and not t[0]['candidates'] and t[0]['text']==o['text']
  items.append({'key':i['key'],'form':i['form'],'meaning':i['meaning'],'batchFile':f,'sourceOccurrencesSha256':digest(i['sourceOccurrences']),'questionSha256':digest(i['questions']),'questionBands':['1-3','4-5','6-8'],'reviewNote':i['editorialNote']+' The three contrast questions were inspected for agreement and one intended contextual answer. '+corrections.get(i['key'],'The source excerpt retains the form, and the upper band distinguishes its four options.'),'identityRoute':next(route['route'] for route in plan['items'] if route['key']==i['key']),'decision':'reviewed_offline_questions_pending_complete_work_import'})
assert len(items)==len(set(i['key'] for i in items))==20
output={'version':1,'workId':inventory['workId'],'chapter':4,'status':'first_twenty_meanings_source_and_question_review_offline','sourceSha256':inventory['sourceSha256'],'unitPlanSha256':inventory['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':[{'file':f'chapter-04-batch-0{n}.json','sha256':sha((p/f'chapter-04-batch-0{n}.json').read_bytes())} for n in (1,2)],'note':'First two chapter IV batches have reviewed source uses and questions; the remaining IV–VII queues and all complete-work identity routes remain pending. No learner import.','items':items}
(p/'chapter-04-qa-01.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands')
