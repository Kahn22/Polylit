#!/usr/bin/env python3
"""Record source, three-band and identity-route review for Chapter IV batches 11–12."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda o:sha(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode())
inv=read('chapter-04-inventory.json');units=read('unit-plan.json')['units'];plan=read('chapter-04-identity-plan.json')
route={i['key']:i for i in plan['items']};tokens={(t['unit'],t['start'],t['end']):t for t in inv['tokens']}
notes={
 'echauffant_getting_heated':'The reflexive gerund describes increasing animation while speaking, rather than physical warming by an external heat source.',
 'casse_broken':'The snapped necklace thread causes the diamonds to fall; the completed participle has masculine singular agreement with fil.',
 'fil_thread':'Only the literal thread at unit 103:98 is assigned. Fil at unit 95:216 remains a held component of de droit fil.',
 'carats_small_diamonds_sold_by_wei':'The 1762 Académie entry also calls small diamonds sold by weight carats; the passage says these carats fell and weighed many livres, so the noun refers to the stones themselves, not only the unit.',
 'pesaient_weighed':'Literal mass in livres differs from the published figurative burden sense of peser.',
 'quelques_uns_some_of_them':'The indefinite pronoun identifies several but not all diamonds; link to the earlier feminine quelques-unes pronoun sense while retaining this masculine form’s questions.',
 'tailles_cut':'The source explicitly connects the diamonds’ cut to their usefulness as microscopes, so this is faceting rather than pruning or resizing clothing.',
 'excellents_excellent':'Both indexed uses qualify the improvised optical instruments as very good.',
 'microscope_microscope':'Both singular uses of the optical instrument share the earlier planned plural microscopes sense.',
 'prunelle_pupil_of_the_eye':'The 1762 Académie anatomy entry identifies the dark opening in the eye; all Level 4–5 alternatives are feminine singular eye parts.',
 'ajuster_to_adjust_oneself':'The reflexive infinitive in the optical scene means aligning one’s viewing position for the instrument.',
 'baleine_whale':'Both singular source uses refer to the animal seen through the optical instrument; feminine singular distractors are other sea creatures.',
 'ongle_fingernail':'The anatomical fingernail matches the published sense; the middle prompt distinguishes it from the entire thumb or arm.',
}
items=[];batchEvidence=[];assigned=set()
for n in (11,12):
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
assert len(items)==len(set(i['key'] for i in items))==20 and len(assigned)==23
out={'version':1,'workId':inv['workId'],'chapter':4,'status':'next_twenty_source_and_three_band_question_review_recorded_unpublished','sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':batchEvidence,'scope':'Batches 11–12, 20 meanings and 60 offline question bands','items':items,'note':'Source, meaning, grammar and three question bands inspected; complete-work reconciliation and learner import remain pending.'}
(p/'chapter-04-qa-05.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands',len(assigned),'exact source uses')
