"""Individually authored VII whole-span decisions; component words stay suppressed."""
from pathlib import Path
import json,hashlib,sys,re
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
h=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
write=lambda f,v:(P/f).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
packet=read('chapter-07-context-packet-02.json');limit=int(sys.argv[1])if len(sys.argv)>1 else 80
units=read('unit-plan.json')['units'];tokens=read('chapter-07-inventory.json')['tokens']
considered={(o['unit'],o['start'],o['end'])for i in packet['items'][:limit]for o in i['sourceOccurrences']}
items=[]
def spans(phrase,occ):
 return [{'chapter':7,'unit':u,'start':m.start(),'end':m.end(),'text':m.group()}for u in occ for m in re.finditer(re.escape(phrase),units[u-1]['text'],re.I)]
def components(uses):return [{k:t[k]for k in ['unit','start','end','text','form']}for t in tokens if any(t['unit']==o['unit']and t['start']>=o['start']and t['end']<=o['end']for o in uses)]
def expr(key,phrase,occ,meaning,low,middle,options,advanced,note,target='new_expression_meaning',earlier=None):
 uses=spans(phrase,occ);assert uses,(key,phrase);ct=components(uses)
 if not any((t['unit'],t['start'],t['end'])in considered for t in ct):return
 qs=[] if earlier else [{'band':'1-3','context':units[uses[0]['unit']-1]['text'],'targetText':uses[0]['text'],'question':'What does the highlighted phrase mean here?','answer':meaning,'choices':[meaning,*low]},{'band':'4-5','context':middle,'question':'Complétez la phrase.','answer':options[0],'choices':options},{'band':'6-8','context':advanced,'question':'Quelle expression convient ?','answer':options[0],'choices':options}]
 if earlier:
  file,oldkey=earlier;old=next(i for i in read(file)['items']if i['key']==oldkey);qs=old['questions'];target=old.get('identityTarget',f'share_earlier_expression_meaning:{file}:{oldkey}')
 item=dict(key=key,surfacePattern=phrase,meaning=meaning,sourceOccurrences=uses,componentTokens=ct,questions=qs,questionSha256=h(qs),identityTarget=target,reviewNote=note,status='offline_full_span_three_band_review_recorded_unpublished')
 if earlier:item.update(earlierFile=file,earlierKey=oldkey,earlierFileSha256=digest(file))
 items.append(item)
oldfile='chapter-07-expression-review-01.json'
for old in read(oldfile)['items']:
 if any((t['unit'],t['start'],t['end'])in considered for t in old['componentTokens']):
  item=dict(old);item.update(earlierFile=oldfile,earlierKey=old['key'],earlierFileSha256=digest(oldfile),reviewNote=old['reviewNote']+' Newly considered component forms in VII package02 reuse this exact full-span bank; all three earlier questions were re-read unchanged, and no new expression meaning or duplicated component mastery is created.');items.append(item)
expr('par_exemple','par exemple',[173,201],'for example; to give an illustration',['as a result','on the contrary','in the meantime'],'Il introduit un cas destiné à illustrer son propos : « ___, considérons cette pierre. »',['Par exemple','Par conséquent','Au contraire','Pendant ce temps'],'Quelle locution présente un cas qui illustre le propos ?','The philosopher illustrates harmful human behavior and later offers a stone as an example in the matter discussion. The earlier II exemple_illustration word plan and all three questions were read. Share that illustrative meaning through a single full phrase before import, suppressing par/exemple duplication rather than creating a precedent meaning. All four connectors fit the illustration prompt, while example rather than consequence, opposition or simultaneity selects the target.','share_earlier_word_meaning:chapter-02-identity-plan.json:exemple_illustration')
for i in items:
 if i['key']=='par_exemple':i.update(earlierDecisionFile='chapter-02-identity-plan.json',earlierDecisionKey='exemple_illustration',earlierDecisionFileSha256=digest('chapter-02-identity-plan.json'))
expr('pas_trop','pas trop',[198],'not very; not particularly',['not at all','not always','not yet'],'Il comprend assez peu cette langue : il ne la comprend ___ bien.',['pas trop','pas du tout','pas toujours','pas encore'],'Quelle construction indique ici un faible degré de compréhension, sans parler de fréquence ou d’un délai ?','Académie 1762 trop explicitly records pas trop as guère. In je n’entends pas trop bien le grec, the giant understands Greek little or not particularly well, rather than saying his understanding fails to exceed a proper limit. All four negative constructions fit ne la comprend… bien; small degree differs from complete absence, frequency and not-yet timing. Trop’s other source use retains excessive quantity; no generic negative or excess-word encounter is duplicated.')
common={k:packet[k]for k in ['version','workId','chapter','sourceSha256','unitPlanSha256','inventorySha256']}
write('chapter-07-expression-review-02.json',{**common,'status':'offline_full_span_review_unpublished','summary':{'reviewedExpressionForms':len(items),'reviewedQuestionBands':len(items)*3,'newExpressionForms':sum(not i.get('earlierFile')for i in items),'newQuestionBands':sum(3 for i in items if not i.get('earlierFile')),'reusedEarlierQuestionBands':sum(3 for i in items if i.get('earlierFile'))},'items':items})
print(json.dumps({'limit':limit,'expressions':len(items),'bands':len(items)*3}))
