#!/usr/bin/env python3
"""Finish the initial Chapter V published candidate triage without auto approval."""
import hashlib
import json
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((base/f).read_text())
inv=read('chapter-05-inventory.json');packet=read('chapter-04-07-published-candidates.json')
by_form={i['form']:i for i in packet['items']}
previous=[read(f'chapter-05-published-reuse-review-{n:02}.json') for n in (1,2,3,4)]
assigned={(o['unit'],o['start'],o['end']) for ledger in previous for i in ledger['items'] for o in i['sourceOccurrences']}
held={(h['unit'],h['start'],h['end']) for ledger in previous for h in ledger['holds']}
assert not (assigned & held)
pending={(t['unit'],t['start'],t['end']) for t in read('chapter-05-progress.json')['tokens']
         if t['disposition']=='published_candidate_context_and_question_review_pending'}

SELECTIONS={
 'tout':('sns_fr_tout_intensifying','Tout doucement intensifies gently; the stored bands teach the intensifying adverb.'),
 'tromper':('sns_fr_se_tromper_mistake','Se tromper is to make a mistake, directly matched by the published infinitive question.'),
 'fort':('sns_fr_fort_intensifier','Fort adroitement means very skillfully, an adverbial degree, not physical strength.'),
 'bien':('sns_fr_bien_intensifier','Bien différent intensifies the adjective, as in the stored well/very degree questions.'),
 'faisait':('sns_faire_causative','The microscope made things barely discernible; the published causative band teaches faire + infinitive.'),
 'point':('sns_point_negation','N’avait point de prise uses literary negation, as the three stored negative bands do.'),
 'aussi':('sns_fr_aussi_equal_degree','Aussi imperceptible que forms an equality comparison, matching the published as…as bands.'),
 'plus':('sns_zola_plus_degree','Plus grande expresses comparative degree, matching the published greater-degree questions.'),
 'pourrait':('sns_parure_pouvoir_etre_capable_de_avoir_la_faculte_de_etre_en_etat_de_etre_en_mesure_de_d4a1b091b1','The hypothetical being could hold the Earth; the stored conditional ability questions fit.'),
 'y':('sns_zola_y_existential','Il y ait is existential there is/are; the published il y a questions fit this grammatical role.'),
 'toutes':('sns_tout_primary','Toutes leurs opérations uses the plural determiner all, not the stand-alone pronoun all of them.'),
 'leur':('sns_leur_primary','Les mains leur tremblaient has a dative pronoun to them, not the possessive their.'),
 'tremblaient':('sns_parure_trembler_etre_agite_de_petites_et_frequentes_secousses_526cccd9af','Hands were trembling, matching the three stored shake/tremble questions.'),
}
HOLDS={
 'abord':'D’abord is the published at-first locution; do not approve abord independently of its whole expression.',
 'peine':'À peine means barely in this passage; the available peine identities teach effort, sorrow or worry.',
 'ferait':'Would make a figure on a sphere is not the stored turn-a-hangar-into-a-workshop sense; author the contextual making question.',
 'peu':'À peu près is an approximation expression; the independent peu questions teach a small quantity.',
 'ait':'Il y ait is existential; the only stored ait questions teach possession, so review an appropriate context.',
 'font':'Font gagner means cause someone to win; the available bands teach doing, forming an idea, or turning into a different person.',
 'doute':'Je ne doute pas uses nonreflexive doubter; available candidates are noun doubt, sans doute, or reflexive se douter.',
 'beaucoup':'Pas à beaucoup près is a degree expression, not the stored beaucoup de monde quantity question.',
 'suivant':'En les suivant is the present participle of suivre, meaning following them; published suivant is next/following adjective.',
 'ai':'J’ai pris is an auxiliary in a compound tense; the published ai bands teach possession, so inspect auxiliary questions before sharing.',
 'soit':'Soit qu’on se serve ou non means whether one uses it or not; none of the published soit bands teach this concessive conjunction.',
}

items=[];holds=[]
for t in inv['tokens']:
 k=(t['unit'],t['start'],t['end'])
 if k not in pending or k in held:continue
 form=t['form']
 if form in HOLDS:
  holds.append({'form':form,'unit':t['unit'],'start':t['start'],'end':t['end'],'text':t['text'],
                'context':t['context'],'decision':'hold_for_contextual_meaning_or_expression_review',
                'reviewNote':HOLDS[form]});continue
 if form not in SELECTIONS:continue
 sense,note=SELECTIONS[form]
 candidate=next(c for c in by_form[form]['candidates'] if c['identity'].endswith(':'+sense))
 assert any(c['identity']==candidate['identity'] for c in t['candidates']),k
 assert candidate['bands']==['levels_1_3','levels_4_5','levels_6_8'] and len(candidate['questions'])==3,k
 items.append({'form':form,'decision':'reuse_published_identity_and_questions',
               'identity':candidate['identity'],'gloss':candidate['gloss'],
               'questionSha256':candidate['questionSha256'],'bands':candidate['bands'],
               'sourceOccurrences':[{'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],
                                     'text':t['text'],'context':t['context']}],
               'reviewNote':note})
new_assigned={(o['unit'],o['start'],o['end']) for i in items for o in i['sourceOccurrences']}
new_held={(h['unit'],h['start'],h['end']) for h in holds}
remaining=[t for t in inv['tokens'] if (t['unit'],t['start'],t['end']) in pending-(held|new_assigned|new_held)]
assert not remaining,[(t['unit'],t['start'],t['text']) for t in remaining]
assert len(items)==len(SELECTIONS) and len(holds)==len(HOLDS)
out={'version':1,'workId':inv['workId'],'chapter':5,
     'status':'offline_contextual_published_reuse_review_unpublished',
     'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],
     'inventorySha256':hashlib.sha256((base/'chapter-05-inventory.json').read_bytes()).hexdigest(),
     'reviewScope':'All remaining published candidate contexts triaged against the current three-band questions; unsuitable senses and expression components are held for authoring.',
     'summary':{'reviewedForms':len(items),'reviewedUses':len(items),
                'heldForms':len(holds),'heldUses':len(holds),'untriagedPublishedCandidateUses':0},
     'items':items,'holds':holds}
(base/'chapter-05-published-reuse-review-05.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out['summary']))
