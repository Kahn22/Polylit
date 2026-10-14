"""Aggregate source-bound package 03 without changing earlier decisions."""
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
def write(f,d):(P/f).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=read('chapter-06-progress.json');r=read('chapter-06-context-review-04.json');e=read('chapter-06-expression-review-04.json');b=r['summary'];components={(t['unit'],t['start'],t['end']):i['key']for i in e['items']for t in i['componentTokens']}
resolved=[];remaining=[]
for row in r['holds']:
 for o in row['sourceOccurrences']:
  k=(o['unit'],o['start'],o['end']);entry={'form':row['form'],'sourceOccurrence':o}
  if k in components:resolved.append({**entry,'expressionKey':components[k]})
  else:remaining.append({**entry,'reason':row['reason']})
package={k:'chapter-06-'+f+'-04.json'for k,f in [('packetFile','context-packet'),('reviewFile','context-review'),('batchFile','batch'),('identityTargetsFile','identity-targets'),('expressionFile','expression-review')]}
package.update(formRange=r['formRange'],summary=b,expressionOverlay={'resolvedHeldUses':len(resolved),'remainingHeldUses':len(remaining),'resolved':resolved,'remaining':remaining,'newExpressionForms':e['summary']['newExpressionForms'],'newQuestionBands':e['summary']['newQuestionBands'],'recheckedEarlierBands':e['summary']['reusedEarlierQuestionBands']})
p['continuationPackages']=[a for a in p['continuationPackages']if a['reviewFile']!=package['reviewFile']]+[package]
total={**p['initialEffectiveSummary'],'recheckedEarlierExpressionBands':0}
for a in p['continuationPackages']:
 s=a['summary'];v=a['expressionOverlay']
 for k in ['formsConsidered','consideredUses','reviewedRouteGroups','reviewedPublishedUses','reviewedEarlierUses','reviewedDraftUses','contextualProposals','newQuestionBands']:total[k]+=s[k]
 total['reviewedUses']+=s['reviewedUses']+v['resolvedHeldUses'];total['heldUses']+=v['remainingHeldUses'];total['reviewedExpressionComponentUses']+=v['resolvedHeldUses'];total['reviewedExpressionForms']+=v['newExpressionForms'];total['reviewedExpressionQuestionBands']+=v['newQuestionBands'];total['recheckedEarlierExpressionBands']+=v['recheckedEarlierBands']
total['untouchedQueuedUses']=1060-total['consideredUses'];p['preHoldContextSummary']=dict(total)
v=p['heldContextOverlay']['summary'];total['reviewedUses']+=v['resolvedHeldUses'];total['heldUses']-=v['resolvedHeldUses'];total['reviewedDraftUses']+=v['resolvedHeldUses'];total['contextualProposals']+=v['contextualProposals'];total['newQuestionBands']+=v['newQuestionBands'];total['reviewedRouteGroups']+=v['reviewedRouteGroups'];p['effectiveSummary']=total
end=r['formRange']['endExclusive'];p['nextUntouchedFormIndex']=end
pending={(o['unit'],o['start'],o['end'])for f in ['chapter-04-07-published-candidates.json','chapter-04-07-new-form-queue.json']for row in read(f)['items']for o in row['occurrences']if o['chapter']==6}
groups={}
for t in read('chapter-06-inventory.json')['tokens']:
 if (t['unit'],t['start'],t['end'])in pending:groups.setdefault(t['form'],[]).append(t)
assert end<=len(groups)
if end<len(groups):
 form,uses=list(groups.items())[end];o=uses[0];p['nextUntouchedAction']={'form':form,**{k:o[k]for k in ['unit','start','end']}}
 continuation=f"Continue at {form} {o['unit']}:{o['start']}–{o['end']}."
else:
 assert total['untouchedQueuedUses']==0
 p['nextUntouchedAction']=None
 continuation='All queued VI forms have been considered. Resolve the retained context/repair dependencies before import; Chapter VII contextual review remains pending.'
p['nextAction']['reason']=f"Earliest shared repair hold remains deferred. {continuation} Read the active held-context overlay for resolved lexical and source-bank dependencies; published et/sans/sentit repairs require final whole-work impact review."
files=[package[k]for k in ['packetFile','reviewFile','batchFile','identityTargetsFile','expressionFile']]+['chapter-06-lemma-search-04.json']
for f in ['chapter-06-qa-04.json','chapter-06-lexical-evidence-04.json']:
 if (P/f).exists():files.append(f)
for f in files:p['evidenceSha256'][f]=digest(f)
write('chapter-06-progress.json',p)
d=read('dossier.json')
for f in [*files,'chapter-06-progress.json']:d['evidence']=[a for a in d['evidence']if a['file']!=f]+[{'role':'chapter_six_fourth_contextual_review','file':f,'bytes':(P/f).stat().st_size,'sha256':digest(f)}]
d['review']['chapterSix']['progress']={'file':'chapter-06-progress.json',**total}
d['review']['chapterSix']['lexical']=f"Partial offline VI review: {total['formsConsidered']} forms / {total['consideredUses']} uses; {total['reviewedUses']} reviewed, {total['heldUses']} held, {total['untouchedQueuedUses']} untouched. {total['contextualProposals']} vocabulary banks/{total['newQuestionBands']} bands and {total['reviewedExpressionForms']} full expression forms/{total['reviewedExpressionQuestionBands']} bands. No learner import."
d['history'].append({'version':d['history'][-1]['version']+1,'date':'2026-10-01','reason':f"Fourth VI source-bound package through {b['formsConsidered']} further forms, {b['consideredUses']} uses: {b['contextualProposals']} vocabulary banks/{b['newQuestionBands']} bands and {e['summary']['newExpressionForms']} new full expressions. Earlier packages unchanged; cumulative {total['reviewedUses']} reviewed/{total['heldUses']} held/{total['untouchedQueuedUses']} untouched. Unpublished."})
write('dossier.json',d);print(json.dumps({'package':b,'expression':e['summary'],'effective':total,'next':p['nextUntouchedAction']}))
