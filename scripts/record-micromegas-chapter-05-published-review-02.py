#!/usr/bin/env python3
"""Review Chapter V articles, pronouns and elisions against published bands."""
import hashlib
import json
from collections import Counter
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((base/f).read_text())
inv=read('chapter-05-inventory.json');packet=read('chapter-04-07-published-candidates.json')
by_form={i['form']:i for i in packet['items']}

DEFAULT={
 'les':'sns_le_primary','il':'sns_il_primary','la':'sns_le_primary',
 'un':'sns_un_primary','le':'sns_le_primary','en':'sns_en_in',
 'qu’':'sns_que_conjunction','des':'sns_fr_des_indefinite_plural',
 'l’':'sns_le_primary','d’':'sns_de_primary','que':'sns_que_conjunction',
}
OVERRIDES={
 ('les',116,108):'sns_le_object',('les',116,156):'sns_le_object',('les',116,171):'sns_le_object',
 ('les',118,204):'sns_le_object',('les',127,104):'sns_le_object',
 ('les',128,5):'sns_le_object',('les',128,53):'sns_le_object',('les',129,114):'sns_le_object',
 ('il',120,193):'sns_fr_il_impersonal',('il',123,125):'sns_fr_il_impersonal',
 ('il',123,155):'sns_fr_il_impersonal',('il',125,38):'sns_fr_il_impersonal',
 ('un',127,189):'sns_fr_un_group_member',
 ('le',116,253):'sns_le_object',('le',116,287):'sns_le_object',('le',123,313):'sns_le_object',
 ('en',120,4):'sns_fr_en_pronominal_reference',('en',120,263):'sns_fr_en_pronominal_reference',
 ('en',122,147):'sns_fr_en_gerund',('en',127,31):'sns_fr_en_gerund',
 ('en',127,70):'sns_fr_en_gerund',('en',127,101):'sns_fr_en_gerund',('en',129,0):'sns_fr_en_gerund',
 ('qu’',120,116):'sns_fr_que_relative_pronoun',('qu’',120,238):'sns_fr_que_relative_pronoun',
 ('qu’',123,230):'sns_fr_que_relative_pronoun',('qu’',122,257):'sns_fr_que_comparison',
 ('des',122,168):'sns_des_primary',('des',123,109):'sns_des_primary',('des',124,41):'sns_des_primary',
 ('l’',116,315):'sns_le_object',('l’',124,165):'sns_le_object',
 ('que',121,128):'sns_que_comparative',('que',124,236):'sns_que_restrictive',
 ('que',132,57):'sns_que_restrictive',
}
HOLDS={
 ('la',128,40):'À la fois is a whole simultaneity expression awaiting its own question set.',
 ('le',131,42):'Sur le fait is a whole caught-in-the-act expression; review its components together.',
 ('en',122,260):'Qu’en ferait has an anaphoric en within a scale comparison; inspect the intended reference and published questions before sharing.',
 ('d’',120,280):'D’abord has a reviewed published locution identity; do not silently approve its de component alone.',
}
for t in inv['tokens']:
 if t['form']=='et' and t['candidates']:
  HOLDS[('et',t['unit'],t['start'])]='The current Level 4–5 stored answer is capitalized Et in the middle of a sentence. Repair and review its shared published question before reuse.'

groups={};holds=[];visited=set()
for t in inv['tokens']:
 form=t['form'];key=(form,t['unit'],t['start'])
 if form not in DEFAULT and form!='et':continue
 if key in HOLDS:
  holds.append({'form':form,'unit':t['unit'],'start':t['start'],'end':t['end'],'text':t['text'],
                'context':t['context'],'decision':'hold_for_expression_or_published_question_review',
                'reviewNote':HOLDS[key]});visited.add(key);continue
 sense=OVERRIDES.get(key,DEFAULT[form]);candidate=next(c for c in by_form[form]['candidates'] if c['identity'].endswith(':'+sense))
 assert any(c['identity']==candidate['identity'] for c in t['candidates']),key
 assert candidate['bands']==['levels_1_3','levels_4_5','levels_6_8'] and len(candidate['questions'])==3,key
 group=groups.setdefault((form,candidate['identity']),{'form':form,'decision':'reuse_published_identity_and_questions',
    'identity':candidate['identity'],'gloss':candidate['gloss'],'questionSha256':candidate['questionSha256'],
    'bands':candidate['bands'],'sourceOccurrences':[]})
 assert group['questionSha256']==candidate['questionSha256']
 group['sourceOccurrences'].append({'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],
                                    'text':t['text'],'context':t['context']});visited.add(key)

items=list(groups.values())
NOTES={
 'les':'Distinguished definite plural article from the direct-object pronoun at each source position; the stored bands test the corresponding grammatical role.',
 'il':'Distinguished referential he/it from impersonal il in se peut, il y ait, il est sorti and fallut-il; the three published bands fit each role.',
 'la':'Definite feminine article throughout the reviewed uses; the à la fois expression is held for whole-phrase review.',
 'un':'One of his microscopes is a pronoun selecting a group member; the other uses are indefinite masculine articles.',
 'le':'Object pronoun for the ship or village in three uses; elsewhere definite article, except the held expression sur le fait.',
 'en':'Five gerunds, two anaphoric pronouns and three in/as prepositions; the scale comparison remains held.',
 'qu’':'Relative object in three uses, comparative once and clause linker seven times, with three matching published bands for each identity.',
 'des':'Three contractions de + les and six indefinite plural articles; the stored bands distinguish these uses.',
 'l’':'Definite article before a vowel in four uses and direct-object pronoun twice; the published bands match.',
 'd’':'Four elided prepositions de; the d’abord locution is held for its own reviewed expression identity.',
 'que':'Clause linker twice, comparison once and restrictive ne…que twice; all are tied to corresponding stored bands.',
}
for item in items:
 item['reviewNote']=NOTES[item['form']]
assert len(visited)==sum(t['form'] in DEFAULT or t['form']=='et' for t in inv['tokens'])
assert len(holds)==18 and sum(len(i['sourceOccurrences']) for i in items)==len(visited)-len(holds)

out={'version':1,'workId':inv['workId'],'chapter':5,
     'status':'offline_contextual_published_reuse_review_unpublished',
     'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],
     'inventorySha256':hashlib.sha256((base/'chapter-05-inventory.json').read_bytes()).hexdigest(),
     'reviewScope':'Every exact source position and three stored question bands inspected for these eleven ambiguous forms; held expressions and Et repair remain pending.',
     'summary':{'reviewedForms':len({i['form'] for i in items}),'reviewedIdentityGroups':len(items),
                'reviewedUses':sum(len(i['sourceOccurrences']) for i in items),
                'heldForms':len({h['form'] for h in holds}),'heldUses':len(holds)},
     'items':items,'holds':holds}
(base/'chapter-05-published-reuse-review-02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out['summary']))
