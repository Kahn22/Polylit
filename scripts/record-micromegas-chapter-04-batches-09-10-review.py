#!/usr/bin/env python3
"""Record source, three-band and identity-route review for Chapter IV batches 09–10."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda o:sha(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode())
inv=read('chapter-04-inventory.json');units=read('unit-plan.json')['units'];plan=read('chapter-04-identity-plan.json')
route={i['key']:i for i in plan['items']};tokens={(t['unit'],t['start'],t['end']):t for t in inv['tokens']}
notes={
 'tourne_orbits':'The around-the-sun phrase is orbital revolution, sharing the earlier planned orbit sense and remaining distinct from the axis rotation in this chapter.',
 'gauche_awkward':'The source manner adverbial modifies the imagined motion; the answer describes awkwardness rather than leftward direction.',
 'incultes_uncultivated':'The polar climates are described as unfavorable to cultivation; the context does not judge the inhabitants’ education.',
 'pense_think':'The first-person speaker offers an opinion about inhabitants, so the published cognitive sense fits.',
 'voudraient_would_want':'The conditional form expresses what sensible beings would want; the published conditional wanting sense fits.',
 'demeurer_to_live':'The residence question is distinct from the published remain-in-state and temporary-stay questions.',
 'apparence_likelihood':'Quelque apparence conveys plausible grounds rather than visual outward appearance.',
 'ceci_this':'The proximal demonstrative points to the present world as a whole, not an identified person.',
 'tire_drawn':'Tiré au cordeau describes regular layout in the ironic comparison with Saturn and Jupiter, not physically pulling a cord toward oneself.',
 'cordeau_chalk_line':'The cord is a straight-line layout tool, which explains the geometric regularity in the preceding adjective.',
 'raison_la_that_very_reason':'The suffix -là points back to the specific reason; the underlying argument sense matches the published reason identity.',
 'remarque_noticed':'The completed observation matches the published notice sense; the question uses a masculine object for past-participle agreement.',
 'variete_variety':'The singular diversity use shares the earlier planned plural variétés sense.',
 'raisons_reasons':'Several arguments are presented as grounds for the claim, matching the published argument sense.',
}
items=[];batchEvidence=[];assigned=set()
for n in (9,10):
 name=f'chapter-04-batch-{n:02}.json';batch=read(name)
 assert batch['sourceSha256']==inv['sourceSha256'] and batch['unitPlanSha256']==inv['unitPlanSha256'] and len(batch['items'])==10
 batchEvidence.append({'file':name,'sha256':sha((p/name).read_bytes())})
 for i in batch['items']:
  qs=i['questions'];assert [q['band'] for q in qs]==['1-3','4-5','6-8']
  assert qs[1]['answer'].casefold()==i['form'].casefold() and qs[1]['context'].count('___')==1
  assert all(len(q['choices'])==4 and len(set(q['choices']))==4 and q['answer'] in q['choices'] for q in qs)
  assert len(qs[2]['context'])>55
  for o in i['sourceOccurrences']:
   k=(o['unit'],o['start'],o['end']);t=tokens[k]
   assert k not in assigned and o['chapter']==4 and t['form']==i['form'] and not t.get('earlierDraft') and not t['candidates'] and units[o['unit']-1]['text'][o['start']:o['end']]==o['text'];assigned.add(k)
  r=route[i['key']]
  note=notes.get(i['key'],'The source context and each three-band contrast were checked for the target meaning, agreement and one intended answer.')
  items.append({'key':i['key'],'form':i['form'],'meaning':i['meaning'],'batchFile':name,'sourceOccurrencesSha256':digest(i['sourceOccurrences']),'questionSha256':digest(qs),'questionBands':[q['band'] for q in qs],'reviewNote':i['editorialNote']+' '+note,'identityRoute':r['route'],'decision':'retain_reviewed_offline_draft_pending_complete_work_import'})
assert len(items)==len(set(i['key'] for i in items))==20 and len(assigned)==20
out={'version':1,'workId':inv['workId'],'chapter':4,'status':'next_twenty_source_and_three_band_question_review_recorded_unpublished','sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':batchEvidence,'scope':'Batches 09–10, 20 meanings and 60 offline question bands','items':items,'note':'Source, meaning, grammar and three question bands inspected; complete-work reconciliation and learner import remain pending.'}
(p/'chapter-04-qa-04.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands',len(assigned),'exact source uses')
