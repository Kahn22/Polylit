#!/usr/bin/env python3
"""Record source, three-band and identity-route review for Chapter IV batches 13–15."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda o:sha(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode())
inv=read('chapter-04-inventory.json');units=read('unit-plan.json')['units'];plan=read('chapter-04-identity-plan.json')
route={i['key']:i for i in plan['items']};tokens={(t['unit'],t['start'],t['end']):t for t in inv['tokens']}
notes={
 'pouce_thumb':'The body part is the opposable thumb, not a unit of length; all Level 4–5 alternatives are masculine singular digits.',
 'baleines_whales':'This plural refers to the same animal sense as singular baleine in the preceding passage; keep distinct surface questions.',
 'tirait_derived':'D’où un atome tirait son mouvement asks about the source of motion, not physical pulling or shooting.',
 'embarrasse_perplexed':'The giant is perplexed by the question of an âme in the whale; the earlier embarrassa lemma is planned for a different reflexive action.',
 'logee_housed':'The hypothetical soul would reside inside the animal; the wording is figurative and feminine singular.',
 'inclinaient_were_inclined':'The movement toward a belief is figurative, without certainty or a physical lean.',
 'temps_la_that_time':'The attached -là points to a specific period mentioned by the narrator; preserve the historical form and demonstrative.',
 'cercle_circle':'Cercle polaire is the geographic latitude circle, rather than a social group or drawing tool.',
 'avise_thought_of':'The negative personne ne s’était avisé means nobody had thought of the observations; distinguish the published aviser senses.',
 'gazettes_newspapers':'The gazettes report an alleged shipwreck; these are news periodicals, not private letters.',
 'echoua_ran_aground':'The vessel reaches the coasts of Botnie and runs aground, a nautical use, rather than merely failing at a task.',
 'eurent_had':'Eurent de la peine means experienced difficulty; the past historic form shares the existing avoir possession/auxiliary sense.',
 'ingenument_candidly':'The narrator claims candor and no embellishment, with ironic force in the final sentence.',
 'passa_happened':'Se passa describes what happened, matching the existing passer event sense, rather than movement past a place.',
}
items=[];batchEvidence=[];assigned=set()
for n in (13,14,15):
 name=f'chapter-04-batch-{n:02}.json';batch=read(name)
 assert batch['sourceSha256']==inv['sourceSha256'] and batch['unitPlanSha256']==inv['unitPlanSha256'] and len(batch['items'])==(8 if n==15 else 10)
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
assert len(items)==len(set(i['key'] for i in items))==28 and len(assigned)==28
out={'version':1,'workId':inv['workId'],'chapter':4,'status':'final_unmatched_lexical_source_and_three_band_question_review_recorded_unpublished','sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':batchEvidence,'scope':'Batches 13–15, 28 meanings and 84 offline question bands','items':items,'note':'Source, meaning, grammar and three question bands inspected; complete-work reconciliation and learner import remain pending.'}
(p/'chapter-04-qa-06.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands',len(assigned),'exact source uses')
