#!/usr/bin/env python3
"""Review additional Chapter V published candidates and record source holds."""
import hashlib
import json
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((base/f).read_text())
inv=read('chapter-05-inventory.json');packet=read('chapter-04-07-published-candidates.json')
by_form={i['form']:i for i in packet['items']}

DEFAULT={
 'à':'sns_a_primary','mais':'sns_zola_mais_but','ce':'sns_ce_primary',
 'lui':'sns_lui_primary','mit':'sns_mettre_primary','n’':'sns_ne_primary',
 'quelque':'sns_zola_quelque_indefinite','sa':'sns_son_primary','si':'sns_si_primary',
 'tous':'sns_tout_primary','vous':'sns_vous_primary','au':'sns_au_primary',
 'aurait':'sns_zola_avoir_possess_auxiliary','avec':'sns_avec_primary',
 'chose':'sns_chose_primary','c’':'sns_fr_ce_demonstrative_pronoun',
 'firent':'sns_fr_faire_perform_activity','grands':'sns_zola_grand_great',
 'hommes':'sns_zola_homme_man_human','ici':'sns_zola_ici_here',
 'jamais':'sns_zola_jamais_ever_never','mains':'sns_zola_main_possession',
 'nous':'sns_zola_nous_we_us','on':'sns_on_primary','ou':'sns_ou_primary',
 'plaisir':'sns_zola_plaisir_pleasure','pour':'sns_pour_primary',
 'sentit':'sns_fr_sentir_perceive_realize','s’':'sns_se_primary',
 'voir':'sns_zola_voir_observe','était':'sns_etre_primary',
}
OVERRIDES={
 ('ce',123,227):'sns_fr_ce_demonstrative_pronoun',('ce',132,41):'sns_fr_ce_demonstrative_pronoun',
 ('lui',124,202):'sns_lui_subject',
 ('si',126,141):'sns_fr_si_intensity',('si',129,80):'sns_fr_si_intensity',
 ('était',120,196):'sns_fr_etre_compound_auxiliary',
}
HOLDS={
 ('à',121,27):'À peine is an already reviewed Chapter II expression; reuse the locution after whole-phrase reconciliation.',
 ('à',122,326):'À peu près is a published approximation expression; do not approve its component as an independent à question.',
 ('à',126,121):'À beaucoup près is a degree-of-comparison construction; inspect the phrase and its interaction with the à peu près identity.',
 ('à',128,38):'À la fois expresses simultaneity and awaits its own whole-phrase questions.',
 ('faire',122,97):'Faire une remarque means make a remark; the published do or causative-have-done questions do not test this construction.',
 ('faire',123,146):'Il se peut très-bien faire que is an impersonal idiom, neither plain do nor have something done.',
 ('faire',124,191):'Avoir beau faire is a futile-attempt expression awaiting whole-phrase questions.',
 ('firent',126,110):'Firent une découverte means made a discovery, while the published bands test did one’s best; inspect a suitable making sense.',
 ('jamais',124,67):'In the conditional si ... lit jamais, jamais means ever; the published questions test never.',
 ('sentit',127,13):'Sentit du plaisir is experienced pleasure without reflexive se; neither current question set directly tests that construction.',
 ('terre',122,228):'The planet Earth is contrasted with a tiny sphere; the published earth/ground questions teach soil.',
 ('terre',123,49):'The planet Earth fits in a hypothetical giant hand; the published questions teach soil.',
 ('comme',127,147):'Comme il s’écria is an exclamation meaning how he cried out; the published like/as/since questions miss this force.',
 ('comme',127,166):'Comme il mit expresses how eagerly he placed the microscope; the published like/as/since questions miss this force.',
 ('dont',125,106):'Dont je viens de parler means about which I just spoke; published questions focus possessive whose.',
 ('dont',126,78):'Dont nous sommes formés means from which we are formed; published questions focus possessive whose.',
 ('perdre',123,316):'Perdre le village means lose it after winning it; the published Level 4–5 question focuses on ruining a person’s reputation.',
 ('perdre',129,118):'Perdre les objets means lose sight of them; the published Level 4–5 question focuses on ruining a person’s reputation.',
 ('près',122,332):'À peu près is an approximation expression, not the independent near identity.',
 ('près',126,132):'À beaucoup près is a degree expression, not the independent near identity.',
}

groups={};holds=[];count=0
for t in inv['tokens']:
 form=t['form'];key=(form,t['unit'],t['start'])
 if form not in DEFAULT and key not in HOLDS:continue
 count+=1
 if key in HOLDS:
  holds.append({'form':form,'unit':t['unit'],'start':t['start'],'end':t['end'],
                'text':t['text'],'context':t['context'],
                'decision':'hold_for_contextual_meaning_or_expression_review','reviewNote':HOLDS[key]});continue
 sense=OVERRIDES.get(key,DEFAULT[form])
 candidate=next(c for c in by_form[form]['candidates'] if c['identity'].endswith(':'+sense))
 assert any(c['identity']==candidate['identity'] for c in t['candidates']),key
 assert candidate['bands']==['levels_1_3','levels_4_5','levels_6_8'] and len(candidate['questions'])==3,key
 group=groups.setdefault((form,candidate['identity']),{'form':form,'decision':'reuse_published_identity_and_questions',
    'identity':candidate['identity'],'gloss':candidate['gloss'],
    'questionSha256':candidate['questionSha256'],'bands':candidate['bands'],
    'sourceOccurrences':[]})
 assert group['questionSha256']==candidate['questionSha256']
 group['sourceOccurrences'].append({'chapter':5,'unit':t['unit'],'start':t['start'],
                                    'end':t['end'],'text':t['text'],'context':t['context']})

items=list(groups.values())
for item in items:
 item['reviewNote']=(f"In the indexed Chapter V occurrence(s), {item['form']} conveys "
   f"{item['gloss']}; all three published questions were inspected, including the stored "
   "Level 4–5 choices. The listed idioms and mismatched question contexts remain held separately.")
assert count==sum(len(i['sourceOccurrences']) for i in items)+len(holds)
assert len(holds)==20
out={'version':1,'workId':inv['workId'],'chapter':5,
     'status':'offline_contextual_published_reuse_review_unpublished',
     'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],
     'inventorySha256':hashlib.sha256((base/'chapter-05-inventory.json').read_bytes()).hexdigest(),
     'reviewScope':'Indexed occurrences and the three published question bands inspected for frequent remaining forms; held contexts await authoring or phrase reconciliation.',
     'summary':{'reviewedForms':len({i['form'] for i in items}),'reviewedIdentityGroups':len(items),
                'reviewedUses':sum(len(i['sourceOccurrences']) for i in items),
                'heldForms':len({h['form'] for h in holds}),'heldUses':len(holds)},
     'items':items,'holds':holds}
(base/'chapter-05-published-reuse-review-03.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out['summary']))
