"""Full-span expression decisions for the second VI contextual package."""
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((P/f).read_text())
h=lambda v:hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
digest=lambda f:hashlib.sha256((P/f).read_bytes()).hexdigest()
def write(f,d):(P/f).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
units=read('unit-plan.json')['units'];tokens=read('chapter-06-inventory.json')['tokens'];base=read('chapter-06-context-review-02.json');packet=read('chapter-06-context-packet-02.json')
considered={ (o['unit'],o['start'],o['end'])for row in [*base['items'],*base['holds']]for o in row['sourceOccurrences']}
items=[]
def expr(key,phrase,occ,meaning,low,middle,options,advanced,note,target='new_expression_meaning',nounAgreement=None):
 uses=[]
 for unit in occ:
  text=units[unit-1]['text'];start=text.index(phrase);uses.append({'chapter':6,'unit':unit,'start':start,'end':start+len(phrase),'text':phrase})
 component=[t for t in tokens if any(t['unit']==o['unit']and t['start']>=o['start']and t['end']<=o['end']for o in uses)]
 if not any((t['unit'],t['start'],t['end'])in considered for t in component):return
 qs=[{'band':'1-3','context':units[uses[0]['unit']-1]['text'],'targetText':phrase,'question':'What does the highlighted phrase mean here?','answer':meaning,'choices':[meaning,*low]},{'band':'4-5','context':middle,'question':'Complétez la phrase.','answer':options[0],'choices':options},{'band':'6-8','context':advanced,'question':'Quelle expression convient ?','answer':options[0],'choices':options}]
 item={'key':key,'surfacePattern':phrase,'meaning':meaning,'sourceOccurrences':uses,'componentTokens':[{k:t[k]for k in ['unit','start','end','text','form']}for t in component],'questions':qs,'questionSha256':h(qs),'identityTarget':target,'reviewNote':note,'status':'offline_full_span_three_band_review_recorded_unpublished'}
 if nounAgreement:item['middleNounAgreement']=nounAgreement
 items.append(item)
expr('trompette_parlante','trompette parlante',[138],'speaking trumpet; sound-amplifying horn',['astronomical telescope','portable balance','marine compass'],'L’appareil en forme de cornet qui amplifie une voix pour la faire entendre au loin est une ___.',['trompette parlante','lunette astronomique','balance portative','boussole marine'],'Quelle locution nominale ancienne désigne un cornet utilisé pour amplifier la voix ?','Académie 1718 names the instrument used to carry a voice between ships. The dwarf repurposes its funnel/tube shape for listening: contextual inference from the ear and hearing sequence. All four middle noun phrases are feminine singular, including their adjectives, and fit une; amplification alone selects the instrument.',nounAgreement='feminine singular noun phrase; all four choices and their adjectives fit une')
expr('mit_au_fait','mit au fait',[156],'informed; acquainted with the facts',['kept ignorant','deceived','forgot'],'Il leur expliqua qui était Micromégas, afin qu’ils le sachent : il les ___.',['mit au fait','laissa dans l’ignorance','induisit en erreur','détourna'],'Quelle construction au passé signifie donna les informations nécessaires pour comprendre ?','The dwarf informs the humans about Micromégas; mit has no spatial direct object here. The full construction prevents false reuse of put or se mettre à begin. Its alternatives contrast informing with withholding, misleading and diverting; every choice fits the unchanged object construction.')
expr('bon_sens','bon sens',[144],'sound judgment; common sense',['bad temper','great courage','good luck'],'Ils jugent les choses raisonnablement, avec du ___.',['bon sens','mauvais caractère','grand courage','heureux hasard'],'Quelle locution nominale désigne la faculté de juger raisonnablement ?','The published sens judgment definition explicitly covers bon sens, and all three banks were read. Retain that meaning with a full phrase and an unambiguous semantic middle clue. Each complete middle noun phrase is masculine singular and fits du; reasonable judgment differs from mood, bravery and luck. No new duplicate meaning or immediate shared-bank overwrite.','retain_published_meaning_full_span_import_reconciliation:srf_zola_sens_sens:sns_fr_sens_judgment','masculine singular noun phrase; all four adjective/noun phrases fit du')
expr('jeu_de_la_nature','jeu de la nature',[144],'extraordinary natural phenomenon',['planned human work','arithmetic calculation','organized amusement'],'Cette production naturelle étonnante, qui paraît bizarre aux voyageurs, est un ___.',['jeu de la nature','ouvrage humain','calcul numérique','divertissement organisé'],'Quelle locution désigne une production naturelle qui paraît bizarre ou extraordinaire ?','Académie 1762 distinguishes extraordinary natural productions from recreational games. Contextual inference: tiny creatures speaking rationally appear to the giants an extraordinary phenomenon. Jeu de la nature/ouvrage humain/calcul numérique/divertissement organisé are masculine singular noun phrases fitting un; the natural oddity clue uniquely selects the target.',nounAgreement='masculine singular noun phrase; all four choices fit un')
expr('brulaient_d_impatience','brûlaient d’impatience',[145],'were extremely eager',['were fast asleep','were waiting calmly','were refusing to act'],'Ils désiraient parler sans pouvoir supporter l’attente : ils ___.',['brûlaient d’impatience','dormaient profondément','attendaient calmement','refusaient d’agir'],'Quelle construction à l’imparfait pluriel exprime une extrême envie d’agir sans attendre ?','Académie 1762 documents figurative brûler for intense desire/impatience. The source is eager anticipation of conversation, with no literal fire. The entire construction carries that metaphor; choices are all plural imperfect predicates, differentiated by eagerness, sleep, calm and refusal.')
expr('lier_conversation','lier conversation',[145],'strike up a conversation',['keep silent','end the conversation','avoid contact'],'Pour commencer à échanger des paroles avec les êtres, ils veulent ___.',['lier conversation','garder le silence','couper court','éviter tout contact'],'Quelle construction ancienne signifie entrer en conversation avec quelqu’un ?','Académie 1762 explicitly defines lier conversation as entering conversation. The earlier lia amitié bank establishes a social bond rather than physically tying; this full conversation construction stays linked to that planned lier lemma at final reconciliation, without blindly copying friendship mastery. No literal cord or binding is present.','planned_lier_lemma_full_construction:chapter-01-identity-plan.json:lia_formed_bond')
expr('en_effet','en effet',[162,165],'indeed; in fact',['perhaps','instead','nevertheless'],'La mesure confirme leur conclusion : c’était ___ un jeune homme de cette taille.',['en effet','peut-être','à la place','néanmoins'],'Quelle locution confirme une affirmation comme correspondant à la réalité ?','Both source contexts confirm a measured conclusion or the existence of intelligent smaller beings. The entire phrase is an assertion/confirmation, not isolated en in. Three independent complete questions distinguish confirmation from uncertainty, substitution and concession.')
# Earlier bon sens triage forbids duplicate phrase mastery; the new full-span
# bank remains an augmentation of the existing judgment identity.
for item in items:
 if item['key']=='bon_sens':
  item.update(earlierDecisionFile='chapter-02-expressions.json',earlierDecisionKey='bon_sens',earlierDecisionFileSha256=digest('chapter-02-expressions.json'))
  item['reviewNote']+=' Chapter II explicitly chose no additional phrase mastery; preserve that policy while reconciling this full-span bank.'
# The two existing VI full-span banks cover previously untouched later components.
for key in ['de_sorte_que','grace_a']:
 earlier=next(i for i in read('chapter-06-expression-review-01.json')['items']if i['key']==key)
 if not any((t['unit'],t['start'],t['end'])in considered for t in earlier['componentTokens']):continue
 item={**earlier,'identityTarget':'share_reviewed_earlier_full_expression','earlierFile':'chapter-06-expression-review-01.json','earlierKey':key,'earlierFileSha256':digest('chapter-06-expression-review-01.json'),'reviewNote':earlier['reviewNote']+' Re-read all three complete earlier VI bands for the newly considered sorte/grâce component; this reuses an existing full-expression bank and creates no new expression or mastery.'}
 items.append(item)
common={k:base[k]for k in ['version','workId','chapter','sourceSha256','unitPlanSha256','inventorySha256']}
record={**common,'status':'offline_full_span_expression_questions_reviewed_unpublished','summary':{'reviewedExpressionForms':len(items),'reviewedQuestionBands':len(items)*3,'newExpressionForms':sum(not i.get('earlierFile')for i in items),'newQuestionBands':sum(not i.get('earlierFile')for i in items)*3,'reusedEarlierQuestionBands':sum(bool(i.get('earlierFile'))for i in items)*3,'sourcePhraseUses':sum(len(i['sourceOccurrences'])for i in items)},'items':items}
write('chapter-06-expression-review-02.json',record)
components={(t['unit'],t['start'],t['end']):i['key']for i in items for t in i['componentTokens']}
resolved=[];remaining=[]
for row in base['holds']:
 for o in row['sourceOccurrences']:
  k=(o['unit'],o['start'],o['end'])
  if k in components:resolved.append({'form':row['form'],'sourceOccurrence':o,'expressionKey':components[k]})
  else:remaining.append({'form':row['form'],'sourceOccurrence':o,'reason':row['reason']})
package={'packetFile':'chapter-06-context-packet-02.json','reviewFile':'chapter-06-context-review-02.json','batchFile':'chapter-06-batch-02.json','identityTargetsFile':'chapter-06-identity-targets-02.json','expressionFile':'chapter-06-expression-review-02.json','formRange':base['formRange'],'summary':base['summary'],'expressionOverlay':{'resolvedHeldUses':len(resolved),'remainingHeldUses':len(remaining),'resolved':resolved,'remaining':remaining,'newExpressionForms':record['summary']['newExpressionForms'],'newQuestionBands':record['summary']['newQuestionBands'],'recheckedEarlierBands':record['summary']['reusedEarlierQuestionBands']}}
progress=read('chapter-06-progress.json')
if 'initialEffectiveSummary' not in progress:progress['initialEffectiveSummary']=progress['effectiveSummary']
progress['continuationPackages']=[package]
a=progress['initialEffectiveSummary'];b=base['summary']
effective=dict(a)
for k in ['formsConsidered','consideredUses','reviewedRouteGroups','reviewedPublishedUses','reviewedEarlierUses','reviewedDraftUses','contextualProposals','newQuestionBands']:effective[k]=a[k]+b[k]
effective.update(reviewedUses=a['reviewedUses']+b['reviewedUses']+len(resolved),heldUses=a['heldUses']+len(remaining),untouchedQueuedUses=1060-a['consideredUses']-b['consideredUses'],reviewedExpressionComponentUses=a['reviewedExpressionComponentUses']+len(resolved),reviewedExpressionForms=a['reviewedExpressionForms']+record['summary']['newExpressionForms'],reviewedExpressionQuestionBands=a['reviewedExpressionQuestionBands']+record['summary']['newQuestionBands'],recheckedEarlierExpressionBands=record['summary']['reusedEarlierQuestionBands'])
progress['effectiveSummary']=effective
progress['nextUntouchedFormIndex']=120+b['formsConsidered']
nextform=packet['items'][b['formsConsidered']]['form']if b['formsConsidered']<80 else 'bout'
nexto=packet['items'][b['formsConsidered']]['sourceOccurrences'][0]if b['formsConsidered']<80 else next(t for t in tokens if t['form']=='bout')
progress['nextUntouchedAction']={'form':nextform,'unit':nexto['unit'],'start':nexto['start'],'end':nexto['end']}
progress['nextAction']['reason']=f"Earliest unresolved shared repair dependency. Next untouched lexical form: {nextform}, unit {nexto['unit']} offsets {nexto['start']}–{nexto['end']}. Outstanding holds: historical agent en at 145:207, qu’auraient at 134:222, avez compound auxiliary, relational pour, comment/shared capitalization repairs."
progress['evidenceSha256']['chapter-06-lemma-search-02.json']=digest('chapter-06-lemma-search-02.json')
for f in [package[k]for k in ['packetFile','reviewFile','batchFile','identityTargetsFile','expressionFile']]:progress['evidenceSha256'][f]=digest(f)
write('chapter-06-progress.json',progress)
d=read('dossier.json')
for f in [*[package[k]for k in ['packetFile','reviewFile','batchFile','identityTargetsFile','expressionFile']],'chapter-06-progress.json','chapter-06-lemma-search-02.json']:
 d['evidence']=[e for e in d['evidence']if e['file']!=f]+[{'role':'chapter_six_second_contextual_review','file':f,'bytes':(P/f).stat().st_size,'sha256':digest(f)}]
d['review']['chapterSix']['progress']={'file':'chapter-06-progress.json',**effective}
d['review']['chapterSix']['lexical']=f"Partial offline VI review: {effective['formsConsidered']} considered forms / {effective['consideredUses']} uses; {effective['reviewedUses']} reviewed, {effective['heldUses']} held and {effective['untouchedQueuedUses']} untouched. {effective['contextualProposals']} vocabulary proposals/{effective['newQuestionBands']} bands; {effective['reviewedExpressionForms']} unique full-expression forms/{effective['reviewedExpressionQuestionBands']} bands. No import or deployment."
d['history'].append({'version':d['history'][-1]['version']+1,'date':'2026-09-30','reason':f"Second VI package through {b['formsConsidered']} additional forms: {b['reviewedUses']} word uses, {len(resolved)} phrase components resolved, {len(remaining)} explicit holds. {b['contextualProposals']} individually authored vocabulary banks/{b['newQuestionBands']} bands, {record['summary']['newExpressionForms']} new full-expression banks/{record['summary']['newQuestionBands']} bands and {record['summary']['reusedEarlierQuestionBands']} earlier expression bands rechecked. Prior package files remain unchanged; no learner import."})
write('dossier.json',d)
print(json.dumps({'package':b,'expression':record['summary'],'effective':effective,'next':progress['nextUntouchedAction']}))
