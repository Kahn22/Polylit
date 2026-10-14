"""Individually authored VII whole-span decisions; component words stay suppressed."""
from pathlib import Path
import json,hashlib,sys,re
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
h=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
write=lambda f,v:(P/f).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
packet=read('chapter-07-context-packet-07.json');limit=int(sys.argv[1])if len(sys.argv)>1 else 37
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
for oldfile in ['chapter-07-expression-review-01.json','chapter-07-expression-review-02.json','chapter-07-expression-review-03.json','chapter-07-expression-review-04.json','chapter-07-expression-review-05.json','chapter-07-expression-review-06.json']:
 for old in read(oldfile)['items']:
  if old['key']in {i['key']for i in items}:continue
  if any((t['unit'],t['start'],t['end'])in considered for t in old['componentTokens']):
   item=dict(old);item.update(earlierFile=oldfile,earlierKey=old['key'],earlierFileSha256=digest(oldfile),reviewNote=old['reviewNote']+' Package07 re-read the complete earlier three-band bank unchanged for these exact phrase uses; preserve whole-expression mastery and suppress only exact components before import.');items.append(item)
# Cross-package component disposition is an explicit import dependency, never silent duplicate encounters.
for i in items:
 deps=[]
 for file in ['chapter-07-context-review-01.json','chapter-07-context-review-02.json','chapter-07-context-review-03.json','chapter-07-context-review-04.json','chapter-07-context-review-05.json','chapter-07-context-review-06.json']:
  for row in read(file)['items']:
   uses=[o for o in row['sourceOccurrences'] if any(t['unit']==o['unit'] and t['start']==o['start'] and t['end']==o['end'] for t in i['componentTokens'])]
   if uses:deps.append({'file':file,'fileSha256':digest(file),'key':row['key'],'sourceOccurrences':uses,'action':'suppress_exact_component_routes_at_whole_work_import_preserve_other_uses_and_mastery'})
 if deps:i['earlierComponentRoutes']=deps
for i in items:
 deps=[]
 for file in ['chapter-07-context-review-01.json','chapter-07-context-review-02.json','chapter-07-context-review-03.json','chapter-07-context-review-04.json','chapter-07-context-review-05.json','chapter-07-context-review-06.json']:
  for row in read(file)['holds']:
   uses=[o for o in row['sourceOccurrences'] if any(t['unit']==o['unit'] and t['start']==o['start'] and t['end']==o['end'] for t in i['componentTokens'])]
   if uses:deps.append({'file':file,'fileSha256':digest(file),'key':row['key'],'sourceOccurrences':uses,'action':'resolve_exact_held_component_at_whole_work_reconciliation_preserve_other_uses_and_mastery'})
 if deps:i['earlierHeldComponentRoutes']=deps
common={k:packet[k]for k in ['version','workId','chapter','sourceSha256','unitPlanSha256','inventorySha256']}
write('chapter-07-expression-review-07.json',{**common,'status':'offline_full_span_review_unpublished','summary':{'reviewedExpressionForms':len(items),'reviewedQuestionBands':len(items)*3,'newExpressionForms':sum(not i.get('earlierFile')for i in items),'newQuestionBands':sum(3 for i in items if not i.get('earlierFile')),'reusedEarlierQuestionBands':sum(3 for i in items if i.get('earlierFile'))},'items':items})
print(json.dumps({'limit':limit,'expressions':len(items),'bands':len(items)*3}))
