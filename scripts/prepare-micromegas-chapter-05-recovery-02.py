#!/usr/bin/env python3
"""Additional contextual question drafts for Chapter V units 117–119."""
import json
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
inv=json.loads((base/'chapter-05-inventory.json').read_text())

# form, lemma, grammatical class, contextual answer, contrasting English
# meanings, unchanged French cloze, same-class French choices, advanced clue.
ROWS=[
 ('différent','différent','adjective masculine singular','different from the first',
  ['identical to the first','smaller than the first','older than the first'],
  'Un animal bien ___ du premier apparaît.',['différent','semblable','proche','voisin'],
  'Il n’est pas le même que le premier animal.'),
 ('prétendu','prétendu','adjective masculine singular','supposed; alleged',
  ['confirmed','enormous','living'],
  'Le ___ animal est en réalité un vaisseau.',['prétendu','véritable','grand','vivant'],
  'On le nomme animal sans être sûr qu’il le soit.'),
 ('creux','creux','noun masculine singular','hollow; cup of the hand',
  ['back of the hand','tip of the finger','middle of the arm'],
  'Il le place dans le ___ de sa main.',['creux','dos','bord','bout'],
  'Le vaisseau repose dans la partie concave de sa main.'),
 ('passagers','passager','noun masculine plural','passengers',
  ['sailors only','instruments','barrels'],
  'Les ___ se trouvent à bord du vaisseau.',['passagers','matelots','géomètres','soldats'],
  'Ces personnes voyagent à bord.'),
 ('équipage','équipage','noun masculine singular','ship’s crew',
  ['ship’s cargo','ship’s hull','storm'],
  'Les gens de l’___ sont sur le vaisseau.',['équipage','océan','horizon','animal'],
  'Il s’agit du personnel qui sert sur le navire.'),
 ('crus','croire','verb past participle masculine plural','believed themselves',
  ['rescued themselves','hid themselves','saw themselves'],
  'Ils s’étaient ___ enlevés par un ouragan.',['crus','vus','sentis','trouvés'],
  'Ils tenaient cette explication pour vraie, à tort.'),
 ('enlevés','enlever','verb past participle masculine plural','carried away',
  ['left behind','protected','welcomed'],
  'Ils s’étaient crus ___ par un ouragan.',['enlevés','portés','sauvés','cachés'],
  'Ils pensaient que le vent les avait emportés.'),
 ('ouragan','ouragan','noun masculine singular','hurricane; violent storm',
  ['gentle breeze','small wave','calm sky'],
  'Ils se croyaient emportés par un ___.',['ouragan','orage','vent','courant'],
  'Ils imaginaient une tempête d’une extrême violence.'),
 ('croyaient','croire','verb imperfect plural','thought; believed',
  ['knew with certainty','denied','forgot'],
  'Ils se ___ sur une espèce de rocher.',['croyaient','voyaient','trouvaient','tenaient'],
  'Ils se représentaient ce lieu comme un rocher.'),
 ('espèce','espèce','noun feminine singular','sort; kind',
  ['exact copy','cause','distance'],
  'Ils se croyaient sur une ___ de rocher.',['espèce','forme','partie','surface'],
  'Le mot nuance le nom rocher : quelque chose qui lui ressemble.'),
 ('mettent','mettre','verb present plural','set themselves in motion',
  ['remain still','fall asleep','shout'],
  'Ils se ___ tous en mouvement.',['mettent','jettent','tiennent','voient'],
  'Ils commencent tous à bouger.'),
 ('mouvement','mouvement','noun masculine singular','movement',
  ['stillness','silence','sleep'],
  'Tous se mettent en ___.',['mouvement','désordre','silence','danger'],
  'Leur immobilité prend fin.'),
 ('matelots','matelot','noun masculine plural','sailors',
  ['passengers as a whole','scientists','giants'],
  'Les ___ prennent des tonneaux de vin.',['matelots','géomètres','passagers','philosophes'],
  'Ce sont les membres de l’équipage qui manœuvrent le navire.'),
 ('prennent','prendre','verb present plural','take; pick up',
  ['throw away','measure','open'],
  'Les matelots ___ des tonneaux.',['prennent','jettent','roulent','ouvrent'],
  'Avant de les lancer, les marins saisissent les tonneaux.'),
 ('tonneaux','tonneau','noun masculine plural','barrels',
  ['bottles','ships','stones'],
  'Ils jettent des ___ de vin.',['tonneaux','vaisseaux','rochers','instruments'],
  'Ces grands récipients contiennent le vin.'),
 ('vin','vin','noun masculine singular','wine',
  ['water','milk','oil'],
  'Les tonneaux contiennent du ___.',['vin','lait','cidre','jus'],
  'Les tonneaux transportent cette boisson issue du raisin.'),
 ('jettent','jeter','verb present plural','throw',
  ['keep','drink','measure'],
  'Ils ___ les tonneaux sur la main.',['jettent','gardent','ouvrent','portent'],
  'Les marins lancent les tonneaux sur la main.'),
 ('précipitent','précipiter','verb present plural reflexive','rush after them',
  ['remain behind','walk slowly','hide'],
  'Ils se ___ après les tonneaux.',['précipitent','retirent','reposent','cachent'],
  'Ils se lancent avec hâte à leur suite.'),
 ('géomètres','géomètre','noun masculine plural','geometers; measuring scientists',
  ['sailors','soldiers','passengers without instruments'],
  'Les ___ prennent leurs instruments de mesure.',['géomètres','matelots','passagers','philosophes'],
  'Ils prennent des quarts de cercle et des secteurs pour mesurer.'),
 ('secteurs','secteur','noun masculine plural','angular measuring instruments',
  ['parts of a city','ship compartments','wooden sticks'],
  'Les géomètres prennent leurs ___ pour mesurer.',['secteurs','vaisseaux','tonneaux','rochers'],
  'Ce sont des instruments géométriques, aux côtés des quarts de cercle.'),
]

items=[]
for form,lemma,pos,answer,en,cloze,fr,clue in ROWS:
    ts=[t for t in inv['tokens'] if 117<=t['unit']<=119 and t['form']==form]
    assert ts and fr[0]==form and len(set(fr))==4 and len(en)==3
    occurrences=[{'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],'text':t['text']} for t in ts]
    items.append({'key':form.replace('é','e').replace('è','e')+'_chapter_05_02',
      'form':form,'lemma':lemma,'partOfSpeech':pos,'meaning':answer,
      'sourceOccurrences':occurrences,
      'editorialNote':f'Chapter V source context: {clue} Individual editorial signoff remains pending.',
      'status':'offline_contextual_question_draft_pending_editorial_review',
      'questions':[
       {'band':'1-3','context':ts[0]['context'],'question':'Meaning','answer':answer,'choices':[answer,*en]},
       {'band':'4-5','context':cloze,'question':'Complétez la phrase.','answer':form,'choices':fr},
       {'band':'6-8','context':clue,'question':'Quel mot convient ?','answer':form,'choices':fr},
      ]})
packet={'version':1,'workId':inv['workId'],'chapter':5,'status':'offline_editorial_draft_unpublished',
        'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],'items':items}
(base/'chapter-05-batch-02.json').write_text(json.dumps(packet,ensure_ascii=False,indent=2)+'\n')
print(f'{len(items)} new draft meanings, {3*len(items)} draft question bands, {sum(len(i["sourceOccurrences"]) for i in items)} source uses.')
