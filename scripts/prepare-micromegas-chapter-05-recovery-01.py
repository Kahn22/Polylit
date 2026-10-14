#!/usr/bin/env python3
"""Recover the first reviewed Chapter V lexical group from the saved source inventory.

This is an offline editorial packet. It cannot approve or import publication content.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'content/sources/wrk_voltaire_micromegas'
inventory = json.loads((BASE / 'chapter-05-inventory.json').read_text())

# Each row is an individual contextual reading and three independently authored bands.
# The Level 4 noun alternatives preserve gender and number in the unchanged sentence.
ROWS = [
 ('étendit','étendre','verb past historic','stretched out','stretched out his hand',
  'Il ___ la main vers le vaisseau.',['étendit','retira','ferma','leva'],
  'Quel verbe décrit le geste d’allonger la main ?', ['étendit','retira','ferma','leva']),
 ('doucement','doucement','adverb','gently','gently, without sudden movement',
  'Il approcha sa main ___, sans brusquer les passagers.',['doucement','brusquement','violemment','rapidement'],
  'Quel adverbe indique la délicatesse du geste ?', ['doucement','brusquement','violemment','rapidement']),
 ('endroit','endroit','noun masculine singular','place; spot','the spot where the object appeared',
  'Il regarda l’___ où l’objet paraissait.',['endroit','horizon','océan','équipage'],
  'Quel nom désigne ici un lieu précis ?', ['endroit','horizon','océan','équipage']),
 ('objet','objet','noun masculine singular','object','the thing he could see',
  'Il avança les doigts vers l’___ visible.',['objet','animal','équipage','océan'],
  'Quel nom désigne ici une chose perçue ?', ['objet','animal','équipage','océan']),
 ('paraissait','paraître','verb imperfect','appeared; seemed visible','was appearing to his sight',
  'L’objet ___ à cet endroit.',['paraissait','disparaissait','tombait','roulait'],
  'Quel verbe indique que l’objet était visible ?', ['paraissait','disparaissait','tombait','roulait']),
 ('avançant','avancer','verb present participle','moving forward','moving two fingers toward it',
  'En ___ deux doigts, il tenta de saisir le vaisseau.',['avançant','retirant','croisant','cachant'],
  'Quel participe décrit des doigts dirigés vers l’objet ?', ['avançant','retirant','croisant','cachant']),
 ('doigts','doigt','noun masculine plural','fingers','the two fingers he moved',
  'Il avança deux ___ vers l’objet.',['doigts','bras','pieds','yeux'],
  'Quel nom désigne les parties de la main qui saisissent ?', ['doigts','bras','pieds','yeux']),
 ('retirant','retirer','verb present participle','drawing back','pulling his fingers back',
  'En les ___ par crainte, il hésita.',['retirant','avançant','écartant','levant'],
  'Quel participe indique le recul des doigts ?', ['retirant','avançant','écartant','levant']),
 ('ouvrant','ouvrir','verb present participle','opening','opening his fingers',
  'En les ___, il écarta les doigts.',['ouvrant','serrant','croisant','cachant'],
  'Quel participe signifie écarter les doigts ?', ['ouvrant','serrant','croisant','cachant']),
 ('serrant','serrer','verb present participle','closing; gripping','closing his fingers around the ship',
  'En les ___, il referma les doigts.',['serrant','ouvrant','écartant','levant'],
  'Quel participe indique qu’il rapproche les doigts pour saisir ?', ['serrant','ouvrant','écartant','levant']),
 ('adroitement','adroitement','adverb','skillfully','with dexterity, without crushing the ship',
  'Il saisit le vaisseau ___ malgré sa petite taille.',['adroitement','maladroitement','violemment','aveuglément'],
  'Quel adverbe décrit l’habileté de son geste ?', ['adroitement','maladroitement','violemment','aveuglément']),
 ('vaisseau','vaisseau','noun masculine singular','ship; vessel','the ship carrying the passengers',
  'Il saisit le ___ qui portait ces messieurs.',['vaisseau','rocher','tonneau','microscope'],
  'Quel nom désigne le bateau saisi ?', ['vaisseau','rocher','tonneau','microscope']),
 ('ongle','ongle','noun masculine singular','fingernail','his fingernail, on which he placed the ship',
  'Il posa le vaisseau sur son ___.',['ongle','doigt','genou','front'],
  'Quel nom désigne la surface dure au bout du doigt ?', ['ongle','doigt','genou','front']),
 ('presser','presser','verb infinitive','to press; squeeze','to squeeze it too hard',
  'Il évita de trop ___ le vaisseau.',['presser','porter','regarder','déplacer'],
  'Quel verbe indique une pression qui risquerait de l’écraser ?', ['presser','porter','regarder','déplacer']),
 ('peur','peur','noun feminine singular','fear','fear of crushing the ship',
  'Il agit avec la ___ de l’écraser.',['peur','joie','hâte','colère'],
  'Quel nom désigne l’inquiétude devant ce risque ?', ['peur','joie','hâte','colère']),
 ('écraser','écraser','verb infinitive','to crush','to crush the small ship',
  'Il le tient avec précaution pour ne pas l’___.',['écraser','observer','approcher','entendre'],
  'Quel verbe indique une destruction par la pression ?', ['écraser','observer','approcher','entendre']),
]

ENGLISH_DISTRACTORS = {
 'étendit':['drew back his hand','closed his hand','dropped his hand'],
 'doucement':['suddenly','violently','carelessly'],
 'endroit':['a person','a measurement','a tool'],
 'objet':['a destination','a gesture','a measurement'],
 'paraissait':['vanished','fell','turned'],
 'avançant':['withdrawing','crossing','hiding'],
 'doigts':['arms','feet','eyes'],
 'retirant':['advancing','crossing','raising'],
 'ouvrant':['closing','crossing','hiding'],
 'serrant':['opening','spreading','raising'],
 'adroitement':['clumsily','violently','blindly'],
 'vaisseau':['a rock','a barrel','a microscope'],
 'ongle':['a knee','a forehead','an elbow'],
 'presser':['to carry','to observe','to hear'],
 'peur':['joy','haste','anger'],
 'écraser':['to observe','to approach','to hear'],
}

items=[]
for form,lemma,pos,meaning,definition,cloze,choices,advanced,advanced_choices in ROWS:
    occurrences=[{'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],'text':t['text']}
                 for t in inventory['tokens'] if t['unit']==116 and t['form']==form]
    assert occurrences and all(not t['candidates'] for t in inventory['tokens'] if t['unit']==116 and t['form']==form)
    assert len(choices)==len(set(choices))==4 and choices[0]==form
    assert len(ENGLISH_DISTRACTORS[form]) == 3
    assert len(advanced_choices)==len(set(advanced_choices))==4 and advanced_choices[0]==form
    key=form.replace('é','e').replace('î','i').replace('ç','c')+'_chapter_05_116'
    items.append({'key':key,'form':form,'lemma':lemma,'partOfSpeech':pos,'meaning':meaning,
                  'definition':definition,'sourceOccurrences':occurrences,
                  'editorialNote':f'Chapter V, unit 116: {form} means {definition}; source-bound offline candidate for question review.',
                  'status':'offline_contextual_question_draft_pending_editorial_review',
                  'questions':[
                     {'band':'1-3','context':next(t['context'] for t in inventory['tokens'] if t['unit']==116 and t['form']==form),
                      'question':'Meaning','answer':meaning,'choices':[meaning,*ENGLISH_DISTRACTORS[form]]},
                     {'band':'4-5','context':cloze,'question':'Complétez la phrase.','answer':form,'choices':choices},
                     {'band':'6-8','context':advanced,'question':'Quel mot convient ?','answer':form,'choices':advanced_choices}]})

packet={'version':1,'workId':inventory['workId'],'chapter':5,
        'status':'offline_editorial_draft_unpublished',
        'sourceSha256':inventory['sourceSha256'],'unitPlanSha256':inventory['unitPlanSha256'],
        'items':items}
(BASE/'chapter-05-batch-01.json').write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
print(f'Authored {len(items)} contextual meanings and {sum(len(i["questions"]) for i in items)} question bands; source uses {sum(len(i["sourceOccurrences"]) for i in items)}.')
