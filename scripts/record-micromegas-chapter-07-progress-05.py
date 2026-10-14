"""Record source-bound partial VII counts and exact question revisions."""
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
h=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
write=lambda f,d:(P/f).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
r=read('chapter-07-context-review-05.json');e=read('chapter-07-expression-review-05.json');s=dict(r['summary']);key=lambda o:(o['unit'],o['start'],o['end'])
components={key(t):i['key']for i in e['items']for t in i['componentTokens']};resolved=[];remaining=[]
for row in r['holds']:
 for o in row['sourceOccurrences']:
  item={'form':row['form'],'sourceOccurrence':o}
  if key(o)in components:resolved.append({**item,'expressionKey':components[key(o)]})
  else:remaining.append({**item,'reason':row['reason']})
pending={key(o)for f in ['chapter-04-07-published-candidates.json','chapter-04-07-new-form-queue.json']for row in read(f)['items']for o in row['occurrences']if o['chapter']==7}
groups={}
for t in read('chapter-07-inventory.json')['tokens']:
 if key(t)in pending:groups.setdefault(t['form'],[]).append(t)
end=r['formRange']['endExclusive'];form,uses=list(groups.items())[end];o=uses[0]
s.update(initialQueuedUses=len(pending),reviewedUses=s['reviewedUses']+len(resolved),heldUses=len(remaining),untouchedQueuedUses=len(pending)-s['consideredUses'],reviewedExpressionComponentUses=len(resolved),reviewedExpressionForms=e['summary']['newExpressionForms'],reviewedExpressionQuestionBands=e['summary']['newQuestionBands'],recheckedEarlierExpressionBands=e['summary']['reusedEarlierQuestionBands'])
files=['chapter-07-'+a+'-05.json'for a in ['context-packet','context-review','batch','identity-targets','expression-review','lemma-search']]
qa=[]
for file in ['chapter-07-batch-05.json','chapter-07-expression-review-05.json']:
 for i in read(file)['items']:qa.append({'file':file,'key':i['key'],'questionSha256':h(i['questions']),'sourceOccurrencesSha256':h(i['sourceOccurrences']),'reviewNote':i['reviewNote']})
write('chapter-07-qa-05.json',{'status':'individual_context_and_three_band_review_recorded_unpublished','reviewedBankEntries':len(qa),'reviewedBands':len(qa)*3,'filesSha256':{f:digest(f)for f in ['chapter-07-batch-05.json','chapter-07-expression-review-05.json']},'items':qa,'reviewBasis':'Full source thought units, independently written meaning clues, every middle alternative, noun number and agreement, distinct meanings and explicit ownership dependencies were individually inspected. Structural checks verify revision and coverage, never editorial approval.'})
files.append('chapter-07-qa-05.json')
if (P/'chapter-07-lexical-evidence-05.json').exists():files.append('chapter-07-lexical-evidence-05.json')
p={'version':1,'workId':r['workId'],'chapter':7,'status':'offline_partial_contextual_review_unpublished','reviewFile':'chapter-07-context-review-05.json','packetFile':'chapter-07-context-packet-05.json','batchFile':'chapter-07-batch-05.json','identityTargetsFile':'chapter-07-identity-targets-05.json','expressionFile':'chapter-07-expression-review-05.json','qaFile':'chapter-07-qa-05.json','lemmaSearchFile':'chapter-07-lemma-search-05.json','effectiveSummary':s,'expressionOverlay':{'resolved':resolved,'remaining':remaining},'nextUntouchedFormIndex':end,'nextUntouchedAction':{'form':form,**{k:o[k]for k in ['unit','start','end']}},'nextAction':{'form':form,**{k:o[k]for k in ['unit','start','end']},'reason':'Continue source-order VII contextual review. Retain sans doute canonical certainty/probability reconciliation and shared et/sans repair holds; all content remains offline until full-work reconciliation.'},'evidenceSha256':{f:digest(f)for f in files}}
old=read('chapter-07-progress.json');packages=old.get('packages',[old]);packages=[x for x in packages if x['reviewFile']!=p['reviewFile']]+[p]
keys=['formsConsidered','consideredUses','reviewedRouteGroups','reviewedUses','reviewedPublishedUses','reviewedEarlierUses','reviewedDraftUses','contextualProposals','newQuestionBands','heldUses','reviewedExpressionComponentUses','reviewedExpressionForms','reviewedExpressionQuestionBands','recheckedEarlierExpressionBands']
total=dict(packages[0]['effectiveSummary'])
for package in packages[1:]:
 for k in keys:total[k]+=package['effectiveSummary'][k]
total['untouchedQueuedUses']=total['initialQueuedUses']-total['consideredUses']
p={**old,'packages':packages,'effectiveSummary':total,'nextUntouchedFormIndex':end,'nextUntouchedAction':p['nextUntouchedAction'],'nextAction':p['nextAction'],'evidenceSha256':{**old['evidenceSha256'],**p['evidenceSha256']}}
s=total
write('chapter-07-progress.json',p)
d=read('dossier.json')
for file in [*files,'chapter-07-progress.json']:
 d['evidence']=[x for x in d['evidence']if x['file']!=file]+[{'role':'chapter_seven_fifth_contextual_review','file':file,'bytes':(P/file).stat().st_size,'sha256':digest(file)}]
d['review']['chapterSeven']['progress']={'file':'chapter-07-progress.json',**s}
d['review']['chapterSeven']['lexical']=f"Partial VII offline review: {s['formsConsidered']} forms/{s['consideredUses']} considered uses; {s['reviewedUses']} reviewed/{s['heldUses']} held/{s['untouchedQueuedUses']} untouched. {s['contextualProposals']} word banks/{s['newQuestionBands']} new bands; {s['reviewedExpressionForms']} new full expressions/{s['reviewedExpressionQuestionBands']} bands and {s['recheckedEarlierExpressionBands']} earlier bands rechecked. No learner import."
d['history'].append({'version':d['history'][-1]['version']+1,'date':'2026-10-01','reason':d['review']['chapterSeven']['lexical']})
write('dossier.json',d)
print(json.dumps({'summary':s,'next':p['nextUntouchedAction']}))
