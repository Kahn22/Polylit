"""Resolve the two earlier held avez auxiliary uses without touching possession."""
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
h=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
def write(f,d):(P/f).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
first=read('chapter-06-context-review-01.json');uses=[o for row in first['holds']if row['form']=='avez'for o in row['sourceOccurrences']]
assert [(o['unit'],o['start'])for o in uses]==[(136,28),(164,13)]
qs=[{'band':'1-3','context':uses[0]['context'],'targetText':'avez','question':'What does the highlighted word mean here?','answer':'have, as an auxiliary for a completed action','choices':['have, as an auxiliary for a completed action','own a possession','must perform an action','can perform an action']},{'band':'4-5','context':'Racontez au passé composé ce que vous venez de faire : « Vous ___ observé ces êtres. »','question':'Complétez la phrase.','answer':'avez','choices':['avez','aviez','aurez','auriez']},{'band':'6-8','context':'Quel auxiliaire au présent, adressé à vous, précède le participe passé dans « vous ... cru » pour raconter une action accomplie ?','question':'Quel mot convient ?','answer':'avez','choices':['avez','aviez','aurez','auriez']}]
note='Avez cru and qui avez donné are compound-tense auxiliary uses; the God vocative uses honorific second-plural vous agreement. The existing avez possession bank was inspected and remains unchanged. Attach this surface to the already distinct published avoir auxiliary sense, without copying possession mastery or inventing a tense-only meaning. All three complete questions test auxiliary function; the middle four options can each precede a past participle, and passé composé selects the present auxiliary.'
item={'key':'avez_compound_auxiliary_chapter_06','form':'avez','lemma':'avoir','partOfSpeech':'compound-tense auxiliary present second plural','meaning':'have, as a compound-tense auxiliary','target':'sns_fr_avoir_compound_auxiliary','sourceOccurrences':uses,'questions':qs,'questionSha256':h(qs),'sourceOccurrencesSha256':h(uses),'reviewNote':note,'status':'offline_contextual_three_band_review_recorded_unpublished'}
common={k:first[k]for k in ['version','workId','chapter','sourceSha256','unitPlanSha256','inventorySha256']}
record={**common,'status':'offline_earlier_hold_context_and_questions_reviewed_unpublished','originalReviewFile':'chapter-06-context-review-01.json','originalReviewSha256':digest('chapter-06-context-review-01.json'),'summary':{'resolvedHeldUses':len(uses),'contextualProposals':1,'newQuestionBands':3,'reviewedRouteGroups':1},'items':[item]}
file='chapter-06-held-context-review-02.json';write(file,record)
progress=read('chapter-06-progress.json');before=progress.setdefault('preHoldContextSummary',progress['effectiveSummary']);effective={**before}
for field,n in [('reviewedUses',2),('heldUses',-2),('reviewedDraftUses',2),('reviewedRouteGroups',1),('contextualProposals',1),('newQuestionBands',3)]:effective[field]+=n
progress['effectiveSummary']=effective
progress['heldContextOverlay']={'file':file,'sha256':digest(file),'summary':record['summary']}
progress['evidenceSha256'][file]=digest(file)
progress['nextAction']['reason']='Earliest unresolved shared repair dependency. Next untouched lexical form: bout, unit 147 offsets 71–75. Outstanding holds: historical agent en at 145:207, fused qu’auraient at 134:222, relational pour, and comment/et/sans capitalization repairs. The two avez auxiliary uses now have a reviewed bank on sns_fr_avoir_compound_auxiliary; no possession mastery is reused.'
write('chapter-06-progress.json',progress)
d=read('dossier.json')
for f in [file,'chapter-06-progress.json']:
 d['evidence']=[e for e in d['evidence']if e['file']!=f]+[{'role':'chapter_six_earlier_hold_review','file':f,'bytes':(P/f).stat().st_size,'sha256':digest(f)}]
d['review']['chapterSix']['progress']={'file':'chapter-06-progress.json',**effective}
d['review']['chapterSix']['lexical']=f"Partial offline VI: {effective['formsConsidered']} forms/{effective['consideredUses']} considered uses; {effective['reviewedUses']} reviewed, {effective['heldUses']} held, {effective['untouchedQueuedUses']} untouched. {effective['contextualProposals']} vocabulary banks/{effective['newQuestionBands']} bands and {effective['reviewedExpressionForms']} full-expression forms/{effective['reviewedExpressionQuestionBands']} bands. No import."
d['history'].append({'version':d['history'][-1]['version']+1,'date':'2026-09-30','reason':'Earlier VI hold reconciliation: both avez compound auxiliaries have an individually authored and reviewed three-band bank on the existing auxiliary sense. Preserve the earlier possession identity, question bank and mastery; no shared mutation, import or publication. Fused qu’auraient remains explicitly unresolved after inspecting lexical qu’as, compound-auxiliary qu’aurait and earlier relational qu’ai banks.'})
write('dossier.json',d)
print(json.dumps(effective))
