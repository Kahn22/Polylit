#!/usr/bin/env python3
"""Bind the next 40 individually inspected Chapter IV drafts to source/question hashes."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas'); read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda obj:sha(json.dumps(obj,ensure_ascii=False,separators=(',',':')).encode())
inventory=read('chapter-04-inventory.json');plan=read('unit-plan.json');identity=read('chapter-04-identity-plan.json')
corrections={'concluez_do_you_conclude':'Replaced grammatically weak inverted-verb distractors with grammatical alternatives for ___-vous que.',
 'tourne_rotates':'Restricted the two source uses to turning about an axis; the later turn around the sun needs its own contextual orbit decision.',
 'dessous_underneath':'Restricted the draft to literal position in unit 90; the underside of the cards in unit 114 requires an expression decision.',
 'cinquantieme_fiftieth':'Kept all ordinal adjective alternatives feminine singular to agree with étoile.'}
items=[];batchEvidence=[];assigned=set()
for n in range(3,7):
 name=f'chapter-04-batch-{n:02}.json';batch=read(name)
 assert batch['sourceSha256']==inventory['sourceSha256'] and batch['unitPlanSha256']==inventory['unitPlanSha256'] and len(batch['items'])==10
 batchEvidence.append({'file':name,'sha256':sha((p/name).read_bytes())})
 for item in batch['items']:
  qs=item['questions']; assert [q['band'] for q in qs]==['1-3','4-5','6-8']
  assert qs[1]['answer'].casefold()==item['form'].casefold() and qs[1]['context'].count('___')==1
  assert all(len(q['choices'])==4 and len(set(q['choices']))==4 and q['answer'] in q['choices'] for q in qs)
  assert all(c.casefold() in qs[2]['context'].casefold() for c in qs[2]['choices'])
  for o in item['sourceOccurrences']:
   k=(o['unit'],o['start'],o['end']);t=[t for t in inventory['tokens'] if (t['unit'],t['start'],t['end'])==k]
   assert len(t)==1 and not t[0].get('earlierDraft') and not t[0]['candidates'] and o['chapter']==4 and o['text']==plan['units'][o['unit']-1]['text'][o['start']:o['end']] and k not in assigned
   assigned.add(k)
  items.append({'key':item['key'],'form':item['form'],'meaning':item['meaning'],'batchFile':name,'sourceOccurrencesSha256':digest(item['sourceOccurrences']),'questionSha256':digest(qs),'questionBands':[q['band'] for q in qs],'reviewNote':item['editorialNote']+' The three question bands were inspected for meaning, grammatical choices and one intended answer. '+corrections.get(item['key'],'The contextual contrast records why the authored alternatives differ.'),'identityRoute':next(route['route'] for route in identity['items'] if route['key']==item['key']),'decision':'retain_reviewed_offline_draft_pending_complete_work_import'})
assert len(items)==len(set(i['key'] for i in items))==40
out={'version':1,'workId':inventory['workId'],'chapter':4,'status':'next_forty_source_and_three_band_question_review_recorded_unpublished','sourceSha256':inventory['sourceSha256'],'unitPlanSha256':inventory['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':batchEvidence,'scope':'Batches 03–06, 40 meanings and 120 offline question bands','items':items,'note':'Individual source meaning and three question bands inspected. This is offline review, not published reuse or identity-route approval.'}
(p/'chapter-04-qa-02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands',len(assigned),'exact source uses')
