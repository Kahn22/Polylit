#!/usr/bin/env python3
"""Source-bound lexical triage for Chapter V units 117–132, before quiz QA."""
import hashlib
import json
from pathlib import Path

base = Path(__file__).resolve().parents[1] / 'content/sources/wrk_voltaire_micromegas'
inventory = json.loads((base / 'chapter-05-inventory.json').read_text())
carry = json.loads((base / 'chapter-04-07-carryover-review.json').read_text())
names = json.loads((base / 'chapter-04-07-names.json').read_text())
existing = {(o['unit'],o['start'],o['end']):i for i in carry['items'] for o in i['occurrences'] if o['chapter']==5}
proper = {(o['unit'],o['start'],o['end']):i for i in names['items'] for o in i['occurrences'] if o['chapter']==5}

# Lexical readings come from the actual passage, including its 18th-century
# measuring instruments. These are triage decisions; question approval follows.
GLOSSES = {
 'différent':('different','unlike the previously seen animal'),
 'nain':('dwarf; Saturnian companion','the smaller Saturnian companion'),
 'prétendu':('supposed; alleged','the supposed animal, in fact the ship'),
 'creux':('hollow; palm','the hollow of his hand'),
 'passagers':('passengers','people travelling aboard the ship'),
 'équipage':('crew','the ship’s company'),
 'crus':('believed themselves','they had believed themselves taken away'),
 'enlevés':('carried away','carried off by a storm'),
 'ouragan':('hurricane; violent storm','the storm they imagined had lifted them'),
 'croyaient':('believed; thought','thought they were on a rock'),
 'espèce':('sort; kind','a sort of rock'),
 'mettent':('put; set','set themselves in motion'),
 'mouvement':('movement','their movement on the giant’s hand'),
 'matelots':('sailors','the sailors aboard the ship'),
 'prennent':('take','take barrels of wine'),
 'tonneaux':('barrels','barrels of wine thrown onto the hand'),
 'vin':('wine','wine contained in those barrels'),
 'jettent':('throw','throw the barrels onto the hand'),
 'précipitent':('rush; throw themselves','rush after the barrels'),
 'géomètres':('geometers; surveyors','the measuring scientists on the ship'),
 'cercle':('circle','the circle in quart de cercle, an angular instrument'),
 'secteurs':('sectors; measuring instruments','the instruments used for geometrical observation'),
 'laponnes':('Lapland women','the two women from Lapland'),
 'descendent':('go down','descend onto the Sirian’s fingers'),
 'remuer':('move; stir','something moving against his fingers'),
 'chatouillait':('tickled','produced a tickling sensation in his fingers'),
 'bâton':('stick; rod','the iron-tipped rod placed against him'),
 'ferré':('iron-tipped','fitted with iron at the end'),
 'enfonçait':('was driving into','was thrusting the rod into his finger'),
 'index':('index finger','the finger into which the rod was pushed'),
 'jugea':('judged; concluded','inferred something from the prick'),
 'picotement':('prickling sensation','the slight prick felt in his finger'),
 'soupçonna':('suspected','did not suspect anything more yet'),
 'microscope':('microscope','the optical instrument used to look at the tiny beings'),
 'discerner':('make out; distinguish','barely make out a whale or ship'),
 'baleine':('whale','the whale that had just been observed'),
 'imperceptible':('imperceptible','too small to be detected by that microscope'),
 'prétends':('intend; claim','the narrator does not intend to offend anyone'),
 'choquer':('offend; shock','offend the vanity of readers'),
 'vanité':('vanity','human self-importance'),
 'obligé':('obliged','the narrator feels bound to make a remark'),
 'prier':('ask; request','ask the important people to consider a remark'),
 'importants':('important people','the self-important people addressed ironically'),
 'remarque':('remark; observation','the narrator’s small observation'),
 'environ':('about; approximately','approximately five feet'),
 'faisons':('make; form','we do not make a larger figure on Earth'),
 'boule':('ball; sphere','a ten-foot-circumference sphere'),
 'millième':('thousandth','the proportional fraction in six hundred thousandth'),
 'pouce':('inch','a historical length unit in the comparison'),
 'hauteur':('height','the animal’s height'),
 'figurez':('imagine; picture','imagine a being holding the Earth'),
 'substance':('being; substance','a hypothetical being large enough to hold the Earth'),
 'tenir':('hold','hold the Earth in its hand'),
 'organes':('organs','the being’s organs proportional to ours'),
 'proportion':('proportion','the relative scale of the organs'),
 'nôtres':('ours','our human organs'),
 'très-bien':('quite well; very well','it may quite well be possible'),
 'nombre':('number','a large number of such beings'),
 'substances':('beings; substances','more than one of those hypothetical beings'),
 'concevez':('imagine; conceive','picture what those beings would think'),
 'prie':('ask; beg','the narrator politely asks the reader to imagine'),
 'penseraient':('would think','what the large beings would think about wars'),
 'batailles':('battles','wars fought for a village'),
 'gagner':('win; gain','win a village through battle'),
 'vainqueur':('victor','the victor gaining a village'),
 'village':('village','the tiny territorial prize'),
 'capitaine':('captain','a commander of grenadiers'),
 'grenadiers':('grenadiers','soldiers in the captain’s company'),
 'lit':('reads','if a captain reads this work'),
 'hausse':('raises','raises the bonnets by two feet'),
 'bonnets':('caps; hats','the soldiers’ headgear'),
 'avertis':('warn','the narrator warns the captain'),
 'siens':('his people','the soldiers belonging to his troop'),
 'infiniment':('infinitely','infinitely small in the scale comparison'),
 'adresse':('dexterity; skill','skill needed to see tiny humans'),
 'merveilleuse':('marvellous','extraordinary dexterity'),
 'fallut':('was necessary; it took','the skill that was required'),
 'philosophe':('philosopher','the philosopher from Sirius'),
 'apercevoir':('perceive; see','make out the tiny atoms'),
 'atomes':('atoms; tiny beings','the human beings viewed as atoms'),
 'viens':('have just','the narrator has just mentioned them'),
 'virent':('saw','what the microscopists first saw'),
 'premiers':('first ones','the first observers'),
 'crurent':('believed','believed they saw the seed'),
 'graine':('seed','the reproductive seed imagined under the microscope'),
 'sommes':('are','we are formed from that seed'),
 'formés':('formed','humans formed from it'),
 'étonnante':('astonishing','an astonishing discovery'),
 'découverte':('discovery','the scientific finding'),
 'machines':('machines; little mechanisms','the tiny humans figured as moving machines'),
 'examinant':('examining','examining all their movements'),
 'tours':('movements; maneuvers','their turns and movements'),
 'opérations':('activities; operations','all their actions'),
 'microscopes':('microscopes','optical instruments handed to the companion'),
 'compagnon':('companion','the Saturnian travel companion'),
 'voyage':('journey; travel','the companion on the journey'),
 'vois':('see','I can see them'),
 'disaient':('were saying','the two observers exclaimed'),
 'voyez':('see','do you see them?'),
 'portent':('carry','the tiny beings carry burdens'),
 'fardeaux':('burdens; loads','the loads they carry'),
 'baissent':('bend down','they lower themselves'),
 'relèvent':('rise again','they straighten up again'),
 'parlant':('speaking','while speaking this way'),
 'objets':('objects','new things under observation'),
 'nouveaux':('new','newly seen objects'),
 'passant':('passing; shifting','shifting from distrust to credulity'),
 'excès':('extreme; excess','an extreme of belief or disbelief'),
 'défiance':('distrust','his former skepticism'),
 'crédulité':('credulity','his new readiness to believe'),
 'crut':('believed','he believed he perceived reproduction'),
 'travaillaient':('were working','were engaged in reproduction'),
 'propagation':('propagation; reproduction','the reproduction of the tiny beings'),
 'nature':('nature','nature caught in the act'),
 'trompait':('was mistaken','his conclusion was wrong'),
 'apparences':('appearances','the deceptive outward signs'),
 'arrive':('happens','as often happens with appearances'),
 'serve':('uses','whether one uses a microscope or not'),
}

items=[]
for form,(gloss,note) in GLOSSES.items():
    ts=[t for t in inventory['tokens'] if 117<=t['unit']<=132 and t['form']==form]
    assert ts,form
    occurrences=[]
    for t in ts:
        k=(t['unit'],t['start'],t['end'])
        route=('share_earlier_reviewed_meaning' if k in existing else
               'proper_name' if k in proper else 'new_or_linked_contextual_meaning_pending_identity_review')
        occurrences.append({'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],
                            'text':t['text'],'route':route,'context':t['context']})
    items.append({'form':form,'gloss':gloss,'contextualReading':note,
                  'sourceOccurrences':occurrences,'status':'offline_lexical_triage_pending_question_and_identity_review'})

out={'version':1,'workId':inventory['workId'],'chapter':5,'status':'offline_lexical_triage_unpublished',
     'sourceSha256':inventory['sourceSha256'],'unitPlanSha256':inventory['unitPlanSha256'],
     'inventorySha256':hashlib.sha256((base/'chapter-05-inventory.json').read_bytes()).hexdigest(),
     'scope':'Units 117–132; source readings and prior review links only; no question approval',
     'items':items}
(base/'chapter-05-triage-02.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(f'Triaged {len(items)} forms and {sum(len(i["sourceOccurrences"]) for i in items)} exact source uses.')
