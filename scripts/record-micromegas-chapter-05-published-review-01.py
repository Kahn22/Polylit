#!/usr/bin/env python3
"""Record a contextual and existing-question review of frequent Chapter V forms."""
import hashlib
import json
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((base/f).read_text())
inv=read('chapter-05-inventory.json');packet=read('chapter-04-07-published-candidates.json')
published={i['form']:i for i in packet['items']}

# The suffix selects a published surface/sense identity, not a lemma inferred
# from the spelling. Notes reflect all three stored bands inspected in the
# packet, including Level 4–5 agreement for nouns.
SELECTIONS={
 'de':('sns_de_primary','All 29 uses introduce a complement or infinitive, including fear, quantity, comparison and origin. The broad published de sense and three prepared bands fit.'),
 'qui':('sns_qui_primary','Each use is a relative subject linking a noun or ce to a verb. The who/which questions match.'),
 'se':('sns_se_primary','Each use is the pronominal marker before a verb, including se peut and se serve; the reflexive or pronominal published sense is broad enough.'),
 'sur':('sns_sur_primary','Physical support or position in seven uses, including the figurative prise sur; the surface/figurative support definition and questions fit. Idiomatic and topic uses are held separately.'),
 'ne':('sns_ne_primary','Seven uses form negation with pas or an interrogative ne; the published negative questions fit. The restrictive ne…que use is held separately.'),
 'une':('sns_un_primary','Each use is an indefinite feminine singular determiner, not the pronoun one of a group; the stored three bands teach this article.'),
 'je':('sns_je_primary','All seven occurrences refer to the narrator or speaker as first-person subject; all three stored questions teach I.'),
 'pas':('sns_pas_primary','All six uses are negative particles, never the noun step; the published negation questions remain apt.'),
 'par':('sns_par_primary','The five uses express cause, agent, or means; the published broad preposition sense covers these and its stored questions test by.'),
 'dans':('sns_zola_dans_in','All five source uses express containment or location, including within activities; the three published in questions fit.'),
 'main':('sns_parure_main_body_part_bdc9fe7397','The four hands are anatomical, never authorship or control. The three published questions distinguish body part, with feminine singular Level 4–5 choices.'),
 'deux':('sns_deux_primary','All four uses are cardinal two, including tous deux; the published cardinal questions fit.'),
 'ces':('sns_ce_primary','All four point to identifiable plural referents. The published demonstrative questions distinguish these from possessives.'),
 'animal':('sns_animal_primary','All four uses name an animal or apply that noun ironically to the ship; the lexical animal meaning remains the same. Level 4–5 alternatives are masculine singular.'),
 'du':('sns_du_primary','All four uses are de + le, including du microscope; no partitive or name particle. The published contraction questions fit.'),
 'leurs':('sns_fr_leur_possessive','Each use denotes a plural possessed object belonging to the people just named; all three possessive questions fit.'),
 'ils':('sns_zola_ils_they','Each plural subject refers to the humans or observers just mentioned; the published they questions fit.'),
 'crainte':('sns_zola_crainte_fear','Both uses mean fear of a potential loss or error. The stored fear questions fit and the noun choices are feminine singular.'),
 'son':('sns_son_primary','Both uses refer to a singular possessed masculine object; the published possessive questions fit.'),
 'trop':('sns_zola_trop_excess','Both uses mark an excessive degree. The published too questions fit.'),
}

HOLDS={
 ('sur',131,38):'Sur le fait is part of caught in the act; review the whole expression instead of approving the physical-support questions in isolation.',
 ('sur',132,20):'Se trompait sur les apparences introduces the topic of error, matching the separate published about/concerning sense rather than surface support; review its questions separately.',
 ('ne',124,219):'Ne seront jamais que means only; the negative particle questions alone do not teach this restriction, so inspect the dedicated ne…que identity.',
}

items=[];holds=[];assigned=set()
for form,(sense,note) in SELECTIONS.items():
    candidate=next(c for c in published[form]['candidates'] if c['identity'].endswith(':'+sense))
    assert candidate['bands']==['levels_1_3','levels_4_5','levels_6_8']
    assert len(candidate['questions'])==3 and candidate['questionSha256']
    occurrences=[]
    for t in inv['tokens']:
        k=(t['unit'],t['start'],t['end'])
        if t['form']!=form or not t['candidates'] or (form,t['unit'],t['start']) in HOLDS:continue
        assert any(c['identity']==candidate['identity'] for c in t['candidates']),k
        occurrences.append({'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],
                            'text':t['text'],'context':t['context']});assert k not in assigned;assigned.add(k)
    assert occurrences,form
    items.append({'form':form,'decision':'reuse_published_identity_and_questions',
                  'identity':candidate['identity'],'gloss':candidate['gloss'],
                  'questionSha256':candidate['questionSha256'],'bands':candidate['bands'],
                  'sourceOccurrences':occurrences,'reviewNote':note})
for (form,unit,start),reason in HOLDS.items():
    t=next(t for t in inv['tokens'] if (t['form'],t['unit'],t['start'])==(form,unit,start))
    holds.append({'form':form,'unit':unit,'start':start,'end':t['end'],'text':t['text'],
                  'context':t['context'],'decision':'hold_for_contextual_or_expression_review',
                  'reviewNote':reason})

out={'version':1,'workId':inv['workId'],'chapter':5,
     'status':'offline_contextual_published_reuse_review_unpublished',
     'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],
     'inventorySha256':hashlib.sha256((base/'chapter-05-inventory.json').read_bytes()).hexdigest(),
     'reviewScope':'Exact Chapter V contexts and all three stored published question bands inspected; complete-work import and remaining distractor QA pending.',
     'summary':{'reviewedForms':len(items),'reviewedUses':len(assigned),'heldUses':len(holds)},
     'items':items,'holds':holds}
(base/'chapter-05-published-reuse-review-01.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out['summary']))
