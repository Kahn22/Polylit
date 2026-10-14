#!/usr/bin/env python3
"""Record source, three-band and identity-route review for Chapter IV held published-candidate batches 16–19."""
import hashlib,json
from pathlib import Path
p=Path('content/sources/wrk_voltaire_micromegas');read=lambda n:json.loads((p/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
digest=lambda o:sha(json.dumps(o,ensure_ascii=False,separators=(',',':')).encode())
inv=read('chapter-04-inventory.json');units=read('unit-plan.json')['units'];plan=read('chapter-04-identity-plan.json')
route={i['key']:i for i in plan['items']};tokens={(t['unit'],t['start'],t['end']):t for t in inv['tokens']}
notes={
 'de_plural_article':'The plural indefinite article de before an adjective differs from the published genitive preposition; both source examples match.',
 'de_partitive':'Three partitive constructions quantify confusion, variety and difficulty; they are not possession or origin.',
 'de_approach':'The stones approach the eyes; this directional preposition differs from the genitive examples.',
 'd_article':'The elided form introduces plural microscopes before an initial vowel, distinct from a genitive.',
 'd_adjective':'Quelque chose d’imperceptible is an adjective-link construction, not ownership.',
 'd_negative_quantity':'Point d’esprit is negative quantity, and the elision before esprit is essential.',
 'd_degree':'D’aussi gros marks a degree comparison in the pronoun-adjective construction.',
 'a_existential':'Four il y a or il n’y a source uses express existence and link the published existential avoir sense with new surface questions.',
 'comme_cause':'Two occurrences introduce causal subordinate clauses; the published questions teach comparison.',
 'comme_exclamative':'The two parallel clauses exclaim about the planet’s shape and orbit.',
 'comme_manner':'Comme la chose se passa refers to the manner in which it occurred, not a resemblance between two things.',
 'gens_attendants':'The Sirian’s gens prepare food and travel in his entourage; the other two chapter IV gens are ordinary people.',
 'ou_relative':'All three places are linked by relative où or d’où, whereas the published question prompts are interrogatives.',
 'non_alternative':'Ou non completes an alternative without a standalone no reply; non plus is a separate expression.',
 'parler_refer':'The parenthetical narrator clarifies that grains refers to mountains, rather than the act of speech.',
 'etaient_passive':'The diamonds were cut or faceted; the source uses passive être, not the published linking examples.',
 'ete_motion':'Avaient été faire observations describes their earlier journey to perform research, not a static property.',
 'apercut_realized':'S’aperçut que reports a realization, matching the published notice sense rather than the exact surface’s glimpse questions.',
 'certaines_some':'Certaines means some stars, linked to the published unspecified determiner sense, not sure/certain.',
 'doigt_literal':'The little finger holds the whale literally; published questions center on figurative toucher du doigt.',
 'grains_projections':'The narrator’s parenthesis identifies the pointed grains as mountains at the giant’s scale.',
 'imagina_supposed':'S’imagina means supposed the whale-only population, separate from devising a device.',
 'livres_weight':'The number measures diamond weight; all middle-band alternatives are feminine plural nouns of different semantic categories.',
 'marche_walk':'The finite verb means walks on feet and links the published marcher walking sense, not the same-spelled marche noun.',
 'moyen_possibility':'Pas moyen de croire denies possibility, rather than naming a concrete method.',
 'pays_area':'The tiny land they inspect is a local region, not necessarily a politically bounded country.',
 'plutot_correction':'Ou plutôt replaces the preceding claim about the Sun with the Earth; published questions emphasize preference.',
 'reconnaitre_survey':'The travelers survey unfamiliar terrain; they do not acknowledge guilt or recognize a known person.',
 'sauver_escape':'Se sauver after the grounding means escape the peril oneself, not rescue another person.',
 'secours_instrument':'Par leur secours makes the microscopes the means, distinct from aid to an injured person.',
 'volee_group':'A volée of philosophers is a group, not the existing same-spelled stolen participle.',
}
items=[];batchEvidence=[];assigned=set()
for n in (16,17,18,19):
 name=f'chapter-04-batch-{n:02}.json';batch=read(name)
 assert batch['sourceSha256']==inv['sourceSha256'] and batch['unitPlanSha256']==inv['unitPlanSha256'] and len(batch['items'])==(1 if n==19 else 10)
 batchEvidence.append({'file':name,'sha256':sha((p/name).read_bytes())})
 for i in batch['items']:
  qs=i['questions'];assert [q['band'] for q in qs]==['1-3','4-5','6-8']
  assert qs[1]['answer'].casefold()==i['form'].casefold() and qs[1]['context'].count('___')==1
  assert all(len(q['choices'])==4 and len(set(q['choices']))==4 and q['answer'] in q['choices'] for q in qs)
  assert len(qs[2]['context'])>55
  for o in i['sourceOccurrences']:
   k=(o['unit'],o['start'],o['end']);t=tokens[k]
   assert k not in assigned and o['chapter']==4 and t['form']==i['form'] and not t.get('earlierDraft') and t['candidates'] and units[o['unit']-1]['text'][o['start']:o['end']]==o['text'];assigned.add(k)
  r=route[i['key']]
  note=notes.get(i['key'],'The source context and each three-band contrast were checked for the target meaning, agreement and one intended answer.')
  items.append({'key':i['key'],'form':i['form'],'meaning':i['meaning'],'batchFile':name,'sourceOccurrencesSha256':digest(i['sourceOccurrences']),'questionSha256':digest(qs),'questionBands':[q['band'] for q in qs],'reviewNote':i['editorialNote']+' '+note,'identityRoute':r['route'],'decision':'retain_reviewed_offline_draft_pending_complete_work_import'})
assert len(items)==len(set(i['key'] for i in items))==31 and len(assigned)==42
out={'version':1,'workId':inv['workId'],'chapter':4,'status':'final_unmatched_lexical_source_and_three_band_question_review_recorded_unpublished','sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],'inventorySha256':sha((p/'chapter-04-inventory.json').read_bytes()),'identityPlanSha256':sha((p/'chapter-04-identity-plan.json').read_bytes()),'identityPacketSha256':sha((p/'chapter-04-identity-packet.json').read_bytes()),'batchEvidence':batchEvidence,'scope':'Batches 16–19, 31 held meanings and 93 offline question bands','items':items,'note':'Source, meaning, grammar and three question bands inspected; complete-work reconciliation and learner import remain pending.'}
(p/'chapter-04-qa-07.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(len(items),'meanings',len(items)*3,'question bands',len(assigned),'exact source uses')
