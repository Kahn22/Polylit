"""Individually authored VII whole-span decisions; component words stay suppressed."""
from pathlib import Path
import json,hashlib,sys,re
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
h=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
write=lambda f,v:(P/f).write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
packet=read('chapter-07-context-packet-03.json');limit=int(sys.argv[1])if len(sys.argv)>1 else 80
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
expr('au_bout_de','au bout de',[182],'after; at the end of a period',[], '',[],'','The unit 182 ten-year period ends with few soldiers surviving. The complete Chapter I temporal au_bout_de bank and all three questions were read unchanged; duration rather than spatial endpoint selects this full phrase. Suppress its current au/bout components at import while preserving that earlier full-expression meaning.',earlier=('chapter-01-expressions-01.json','au_bout_de'))
expr('au_moins','au moins',[200],'at least; no less than',[],'',[],'','Au moins sets a minimal question about whether the speaker knows matter at all, rather than a maximum or merely chronological condition. The earlier V minimum phrase bank and its three questions were read unchanged; preserve its meaning and suppress the new au component on this complete source span.',earlier=('chapter-05-expression-review.json','au_moins'))
expr('quand_meme','quand même',[182],'even if; even supposing',['when','because','provided that'],'La locution qui pose une hypothèse concédée sans changer la conclusion est ___.',['Quand même','Parce que','À condition que','Après que'],'Quelle locution introduit une hypothèse concessive qui ne changerait pas le résultat ?','Quand même with conditional auraient introduces a concessive counterfactual hypothesis: even without combat, other causes would kill them. It is not literal temporal when or independent even. All four subordinate connectors fit a clause prompt as grammatical labels; concession regardless of the hypothesis differs from cause, condition or time. Prepare one full-span expression bank and suppress both components before import.')
expr('se_donner_la_peine','Ne vous en donnez pas la peine',[181],'do not bother; do not take the trouble',['do not be sad','do not worry about an absence','do not impose a punishment'],'Pour dire qu’il est inutile de faire cet effort, la phrase est ___.',['Ne vous en donnez pas la peine','Ne vous laissez pas abattre','Ne vous inquiétez pas pour lui','Ne lui infligez pas cette peine'],'Quelle phrase signifie ici ne faites pas cet effort ?','The philosopher tells the giant not to make the effort to destroy humans, since they already bring about their own ruin. The full negative source phrase realizes se donner la peine, not literal giving, sorrow or punishment. Share the existing effort noun meaning through a proper complete-expression bridge before import; negation does not create a second canonical positive/negative meaning. All four full imperative alternatives fit a metalinguistic sentence prompt and the effort clue selects the target. Earlier-package ne/vous/en/pas component routes must be suppressed on this exact span, without altering their other uses or mastery.','share_published_word_meaning:sns_fr_peine_effort')
expr('etre_la_peine','n’était donc pas la peine',[199],'was therefore not worth the trouble',['was therefore not sad','was therefore not certain','was therefore not the punishment'],'Pour juger qu’un effort n’aurait aucune utilité, il dit que cela ___.',['n’était donc pas la peine','n’était donc pas triste','n’était donc pas certain','n’était donc pas le châtiment'],'Quelle tournure juge ici qu’il ne valait pas la peine de faire cet effort ?','The giant says the supposed prenatal knowledge was not worth the trouble if the soul becomes ignorant later. This is an evaluation of usefulness, not sorrow or a penal sentence; prepare the canonical être la peine/valoir la peine worth-the-trouble meaning with the negative occurrence recorded exactly. No negative-only fresh meaning or claim that prenatal knowledge actually exists is made. Every full predicate fits cela; useless effort selects the target. Suppress exact earlier component word routes before import.')
expr('le_bout_des_choses','le bout des choses',[214],'the ultimate explanation; the final understanding',['the edge of physical objects','a room’s middle','the passage of time'],'Le livre promettrait de leur révéler l’explication ultime de la réalité : ils y verraient ___.',['le bout des choses','le bord des objets','le milieu de la salle','le passage du temps'],'Quelle expression désigne ici l’explication ultime des choses ?','The promised philosophy book would reveal final understanding of reality, while its eventual blankness makes that promise ironic. Le bout des choses denotes ultimate explanation, not a physical extremity. Prepare the complete phrase under a proper expression owner and compare its conceptual endpoint overlap with the broad published bout before import. All four masculine singular complete noun phrases fit verraient; knowledge rather than spatial edges, room location or elapsed time selects the target. Earlier des/choses word routes must be suppressed on this exact span before import.')
# Cross-package component disposition is an explicit import dependency, never silent duplicate encounters.
for i in items:
 deps=[]
 for file in ['chapter-07-context-review-01.json','chapter-07-context-review-02.json']:
  for row in read(file)['items']:
   uses=[o for o in row['sourceOccurrences'] if any(t['unit']==o['unit'] and t['start']==o['start'] and t['end']==o['end'] for t in i['componentTokens'])]
   if uses:deps.append({'file':file,'fileSha256':digest(file),'key':row['key'],'sourceOccurrences':uses,'action':'suppress_exact_component_routes_at_whole_work_import_preserve_other_uses_and_mastery'})
 if deps:i['earlierComponentRoutes']=deps
common={k:packet[k]for k in ['version','workId','chapter','sourceSha256','unitPlanSha256','inventorySha256']}
write('chapter-07-expression-review-03.json',{**common,'status':'offline_full_span_review_unpublished','summary':{'reviewedExpressionForms':len(items),'reviewedQuestionBands':len(items)*3,'newExpressionForms':sum(not i.get('earlierFile')for i in items),'newQuestionBands':sum(3 for i in items if not i.get('earlierFile')),'reusedEarlierQuestionBands':sum(3 for i in items if i.get('earlierFile'))},'items':items})
print(json.dumps({'limit':limit,'expressions':len(items),'bands':len(items)*3}))
