#!/usr/bin/env python3
"""Record source, three-band and identity-route review for the next twenty Chapter IV meanings."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda o:sha(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode())
inv=read('chapter-04-inventory.json');units=read('unit-plan.json')['units'];plan=read('chapter-04-identity-plan.json')
route={i['key']:i for i in plan['items']};tokens={(t['unit'],t['start'],t['end']):t for t in inv['tokens']}
notes={
 'mi_jambe_halfway_up_the_leg':'Compared the mid-leg water-height sense with the Académie 4th- and 8th-edition entries for mi and jambe; choices keep the same à mi- compound frame.',
 'sentir_to_make_someone_realize':'This causative phrase conveys an argument to the listener, not a physical touch. Linked the published mental-perception sense.',
 'grandeur_apparent_magnitude':'Grandeur in étoile de la cinquantième grandeur describes stellar apparent brightness class, not physical size; kept four feminine singular noun options.',
 'senti_felt':'The reply vous avez mal senti refers to failed sensory perception; it remains distinct from the figurative faire sentir.',
 'irregulier_irregular':'Both source uses refer to irregular form or arrangement and have one shared meaning and question set.',
 'globe_ci_this_globe_here':'The proximal -ci identifies this particular globe; its planned planet sense is shared with the earlier globe route.',
 'etangs_ponds':'The tiny-pond description is the Saturnian’s scale comparison with Earth’s waters; the answer retains the narrator’s noun.',
 'ronds_round':'Kept all Level 4–5 shape adjectives masculine plural to agree with étangs and linked the existing round sense.',
 'carres_square':'Four-sided alternatives are all masculine plural; only carrés describes four equal sides and right angles.',
 'ovales_oval':'All unchanged-sentence alternatives agree in masculine plural; an oval is rounded and elongated.',
 'reguliere_regular':'All Level 4–5 adjective choices agree with feminine singular forme.',
 'pointus_pointed':'All Level 4–5 adjective choices agree with masculine plural grains.',
 'ecorche_scraped':'Changed the middle sentence to keep the object after the auxiliary, so all four uninflected past-participle choices are grammatical.',
 'poles_the_poles':'Both source uses mean the Earth’s geographic poles, and the noun alternatives are masculine plurals.',
}
items=[];batchEvidence=[];assigned=set()
for n in (7,8):
 name=f'chapter-04-batch-{n:02}.json';batch=read(name)
 assert batch['sourceSha256']==inv['sourceSha256'] and batch['unitPlanSha256']==inv['unitPlanSha256'] and len(batch['items'])==10
 batchEvidence.append({'file':name,'sha256':sha((p/name).read_bytes())})
 for i in batch['items']:
  qs=i['questions'];assert [q['band'] for q in qs]==['1-3','4-5','6-8']
  assert qs[1]['answer'].casefold()==i['form'].casefold() and qs[1]['context'].count('___')==1
  assert all(len(q['choices'])==4 and len(set(q['choices']))==4 and q['answer'] in q['choices'] for q in qs)
  assert all(c.casefold() in qs[2]['context'].casefold() for c in qs[2]['choices'])
  for o in i['sourceOccurrences']:
   k=(o['unit'],o['start'],o['end']);t=tokens[k]
   assert k not in assigned and o['chapter']==4 and t['form']==i['form'] and not t.get('earlierDraft') and not t['candidates'] and units[o['unit']-1]['text'][o['start']:o['end']]==o['text'];assigned.add(k)
  r=route[i['key']]
  note=notes.get(i['key'],'The source context and each three-band contrast were checked for the target meaning, agreement and one intended answer.')
  items.append({'key':i['key'],'form':i['form'],'meaning':i['meaning'],'batchFile':name,'sourceOccurrencesSha256':digest(i['sourceOccurrences']),'questionSha256':digest(qs),'questionBands':[q['band'] for q in qs],'reviewNote':i['editorialNote']+' '+note,'identityRoute':r['route'],'decision':'retain_reviewed_offline_draft_pending_complete_work_import'})
assert len(items)==len(set(i['key'] for i in items))==20 and len(assigned)==22
out={'version':1,'workId':inv['workId'],'chapter':4,'status':'next_twenty_source_and_three_band_question_review_recorded_unpublished','sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':batchEvidence,'scope':'Batches 07–08, 20 meanings and 60 offline question bands','items':items,'note':'Source, meaning, grammar and three question bands inspected; complete-work reconciliation and learner import remain pending.'}
(p/'chapter-04-qa-03.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands',len(assigned),'exact source uses')
