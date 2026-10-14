import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
/** Structural/source integrity only; editorial choices live in exact-revision ledgers. */
export async function checkContinuations(folder,unitPlan,progress){
 const bytes=f=>readFile(`${folder}/${f}`),read=async f=>JSON.parse(await bytes(f));
 const sha=v=>createHash('sha256').update(v).digest('hex'),hash=v=>sha(JSON.stringify(v));
 const ensure=(c,m)=>{if(!c)throw Error(`VI continuation: ${m}`);};
 const key=o=>`${o.unit}:${o.start}:${o.end}`;
 const inventory=await read('chapter-06-inventory.json'),tokens=new Map(inventory.tokens.map(t=>[key(t),t]));
 const publication=loadPublication(),b=publication.bundle,qq=[...publication.preparedQuizzes.values()];
 for(const lemmaFile of Object.keys(progress.evidenceSha256).filter(f=>/^chapter-06-lemma-search-\d\d\.json$/.test(f))){
 const lemmaSearch=await read(lemmaFile);
 for(const row of lemmaSearch.items){const current=b.lemmas.filter(l=>l.headword.toLowerCase()===row.lemma&&!l.id.startsWith('lem_es_')).map(l=>({...l,senses:b.senses.filter(s=>s.lemmaId===l.id)}));ensure(hash(current)===hash(row.publishedFrench),'searched published lemma revision');for(const old of [...row.earlierPlans,...row.currentChapterEarlierBanks])ensure(sha(await bytes(old.file))===old.fileSha256,'searched earlier lemma revision');}
 }
 const pending=new Set((await Promise.all(['chapter-04-07-published-candidates.json','chapter-04-07-new-form-queue.json'].map(read))).flatMap(d=>d.items.flatMap(i=>i.occurrences)).filter(o=>o.chapter===6).map(key));
 const groups=[...Map.groupBy(inventory.tokens.filter(t=>pending.has(key(t))),t=>t.form)];
 const expectedRevision={sourceSha256:sha(await bytes('canonical-draft.txt')),unitPlanSha256:sha(await bytes('unit-plan.json')),inventorySha256:sha(await bytes('chapter-06-inventory.json'))};
 const questionStructure=i=>{ensure(i.questions.length===3&&i.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8',`bands ${i.key}`);for(const q of i.questions)ensure(q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer)&&q.context&&q.question,`choices ${i.key}`);};
 const source=o=>ensure(tokens.has(key(o))&&o.chapter===6&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text,'source token/span');
 for(const qaFile of Object.keys(progress.evidenceSha256).filter(f=>/^chapter-06-qa-\d\d\.json$/.test(f))){
 const qa=await read(qaFile);
 let bankCount=0,bandCount=0;const qaSeen=new Set();
 for(const[file,digest]of Object.entries(qa.filesSha256)){
  ensure(sha(await bytes(file))===digest,'QA file revision');const record=await read(file);
  for(const i of record.items){const tag=`${file}:${i.key}`,row=qa.items.find(a=>a.file===file&&a.key===i.key);ensure(row&&!qaSeen.has(tag)&&row.questionSha256===hash(i.questions)&&row.sourceOccurrencesSha256===hash(i.sourceOccurrences)&&row.reviewNote===i.reviewNote,'QA exact bank/source fingerprint');qaSeen.add(tag);bankCount++;bandCount+=i.questions.length;}
 }
 ensure(bankCount===qa.items.length&&bankCount===qa.reviewedBankEntries&&bandCount===qa.reviewedBands&&qa.newVocabularyBands+qa.newFullExpressionBands+qa.earlierExpressionBandsRechecked===bandCount,'QA bank/band totals');
 }
 const base=progress.initialEffectiveSummary;ensure(base&&base.formsConsidered===120,'immutable initial summary');
 const total={...base,recheckedEarlierExpressionBands:0};
 const used=new Set((await read('chapter-06-context-packet-01.json')).items.flatMap(i=>i.sourceOccurrences.map(key)));
 let end=120;
 for(const packageRow of progress.continuationPackages){
  const p=await read(packageRow.packetFile),r=await read(packageRow.reviewFile),batch=await read(packageRow.batchFile),targets=await read(packageRow.identityTargetsFile),expressions=await read(packageRow.expressionFile);
  for(const d of [p,r,batch,targets,expressions])for(const[k,v]of Object.entries(expectedRevision))ensure(d[k]===v,`source revision ${k}`);
  const range=packageRow.formRange,s=r.summary;ensure(range.startInclusive===end&&range.endExclusive===end+s.formsConsidered&&JSON.stringify(range)===JSON.stringify(r.formRange)&&JSON.stringify(s)===JSON.stringify(packageRow.summary),'package range/counts');
  ensure(p.formRange.startInclusive===range.startInclusive&&p.items.length===p.summary.forms&&p.formRange.endExclusive===p.formRange.startInclusive+p.items.length&&s.formsConsidered<=p.items.length,'packet range');
  ensure(p.items.every((i,j)=>i.form===groups[p.formRange.startInclusive+j]?.[0]),'source-order forms');
  for(const i of p.items){const exact=new Set(groups.find(([form])=>form===i.form)[1].map(key));ensure(exact.size===i.sourceOccurrences.length&&i.sourceOccurrences.every(o=>exact.has(key(o))),'packet exhaustive form occurrences');}
  ensure(r.packetSha256===sha(await bytes(packageRow.packetFile))&&r.batchSha256===sha(await bytes(packageRow.batchFile))&&r.identityTargetsSha256===sha(await bytes(packageRow.identityTargetsFile)),'reviewed revisions');
  const proposals=new Map(batch.items.map(i=>[i.key,i])),targetMap=new Map(targets.items.map(i=>[i.key,i]));ensure(proposals.size===batch.items.length&&targetMap.size===proposals.size,'proposal ownership');
  for(const i of batch.items){
   questionStructure(i);const t=targetMap.get(i.key);ensure(t?.form===i.form&&t.lemma===i.lemma&&t.questionSha256===hash(i.questions)&&t.sourceOccurrencesSha256===hash(i.sourceOccurrences)&&t.reviewNote===i.reviewNote&&i.reviewNote.length>90,'proposal revision');
   for(const o of i.sourceOccurrences){source(o);ensure(o.context===unitPlan.units[o.unit-1].text&&tokens.get(key(o)).form===i.form,'proposal full context');}
   ensure(i.questions[0].context===i.sourceOccurrences[0].context&&i.questions[0].targetText===i.sourceOccurrences[0].text,'early full context');
   const target=t.target;
   if(target.startsWith('sns_')){const sense=b.senses.find(s=>s.id===target),lemma=b.lemmas.find(l=>l.id===sense?.lemmaId);ensure(lemma?.headword.toLowerCase()===i.lemma.toLowerCase()&&!lemma.id.startsWith('lem_es_'),'published lemma owner');}
   else if(target.startsWith('new:')){const lemma=b.lemmas.find(l=>l.id===target.slice(4));ensure(lemma?.headword.toLowerCase()===i.lemma.toLowerCase()&&!lemma.id.startsWith('lem_es_'),'new sense lemma owner');}
   else if(/^(prior|prior-bank|new-prior):/.test(target)){const[file,id]=target.split(':').slice(1),old=(await read(file)).items.find(i=>i.key===id);ensure(old?.lemma.toLowerCase()===i.lemma.toLowerCase()&&t.earlierFileSha256===sha(await bytes(file)),'earlier lemma/sense revision');}
   else ensure(target==='new','unknown explicit target');
  }
  const packetMap=new Map(p.items.map(i=>[i.form,i])),expected=new Set(p.items.slice(0,s.formsConsidered).flatMap(i=>i.sourceOccurrences.map(key))),seen=new Set(),counts={published:0,earlier:0,draft:0,hold:0};
  for(const row of [...r.items,...r.holds]){
   const i=packetMap.get(row.form);ensure(i,'route packet form');
   for(const o of row.sourceOccurrences){source(o);ensure(expected.has(key(o))&&!seen.has(key(o))&&!used.has(key(o))&&tokens.get(key(o)).form===row.form&&o.context===unitPlan.units[o.unit-1].text,'unique source partition');seen.add(key(o));counts[row.decision]++;}
   if(row.decision==='published'){const c=i.publishedCandidates.find(c=>c.identity===row.identity),[surface,sense]=row.identity.split(':'),current=qq.filter(q=>q.subject?.surfaceFormId===surface&&q.subject?.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));ensure(c?.questionSha256===row.questionSha256&&hash(current)===row.questionSha256&&current.length===3&&new Set(current.map(q=>q.band)).size===3&&row.reviewNote.length>90,'published exact bank');}
   else if(row.decision==='earlier'){const c=i.earlierCandidates.find(c=>c.file===row.earlierFile&&c.key===row.earlierKey),old=(await read(row.earlierFile)).items.find(i=>i.key===row.earlierKey);questionStructure(old);ensure(c&&sha(await bytes(row.earlierFile))===row.earlierFileSha256&&hash(old.questions)===row.questionSha256&&row.reviewNote.length>90,'earlier exact bank');}
   else if(row.decision==='draft'){const i=proposals.get(row.proposalKey);ensure(i?.form===row.form&&row.sourceOccurrences.every(o=>i.sourceOccurrences.some(a=>key(a)===key(o)))&&row.reviewNote===i.reviewNote,'draft source ownership');}
   else ensure(row.decision==='hold'&&row.status==='unresolved_dependency_not_approved'&&row.reason.length>20,'explicit unresolved hold');
  }
  ensure(seen.size===expected.size&&seen.size===s.consideredUses,'complete package partition');for(const k of seen)used.add(k);
  ensure(s.reviewedPublishedUses===counts.published&&s.reviewedEarlierUses===counts.earlier&&s.reviewedDraftUses===counts.draft&&s.reviewedUses===counts.published+counts.earlier+counts.draft&&s.heldUses===counts.hold&&s.contextualProposals===batch.items.length&&s.newQuestionBands===batch.items.length*3&&s.reviewedRouteGroups===r.items.length,'source counts');
  const components=new Map(),emap=new Map(expressions.items.map(i=>[i.key,i]));ensure(emap.size===expressions.items.length,'expression keys');
  let newExpressions=0,rechecked=0;
  for(const i of expressions.items){
   questionStructure(i);ensure(hash(i.questions)===i.questionSha256&&i.reviewNote.length>110,'expression revision');
   for(const o of i.sourceOccurrences)ensure(o.chapter===6&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text&&o.text===i.surfacePattern,'whole expression span');
   const expectedTokens=inventory.tokens.filter(t=>i.sourceOccurrences.some(o=>t.unit===o.unit&&t.start>=o.start&&t.end<=o.end));ensure(expectedTokens.length===i.componentTokens.length&&expectedTokens.every(t=>i.componentTokens.some(a=>key(a)===key(t)&&a.text===t.text)),'exhaustive expression components');
   for(const t of i.componentTokens){ensure(tokens.get(key(t))?.text===t.text&&!components.has(key(t)),'non-overlap expression components');components.set(key(t),i.key);}
   if(i.earlierDecisionFile){const d=(await read(i.earlierDecisionFile)).items.find(a=>a.key===i.earlierDecisionKey);ensure(d&&sha(await bytes(i.earlierDecisionFile))===i.earlierDecisionFileSha256,'earlier no-duplicate-mastery decision');}
   if(i.earlierFile){const earlier=(await read(i.earlierFile)).items.find(a=>a.key===i.earlierKey);ensure(sha(await bytes(i.earlierFile))===i.earlierFileSha256&&hash(earlier.questions)===i.questionSha256,'shared earlier expression bank');rechecked+=3;}else newExpressions++;
  }
  const overlay=packageRow.expressionOverlay,held=new Set(r.holds.flatMap(i=>i.sourceOccurrences.map(key))),resolved=new Set(),remaining=new Set();
  for(const row of overlay.resolved){const k=key(row.sourceOccurrence);ensure(held.has(k)&&!resolved.has(k)&&components.get(k)===row.expressionKey,'resolved exact phrase component');resolved.add(k);}
  for(const row of overlay.remaining){const k=key(row.sourceOccurrence);ensure(held.has(k)&&!resolved.has(k)&&!remaining.has(k)&&!components.has(k),'remaining explicit hold');remaining.add(k);}
  ensure(resolved.size+remaining.size===held.size&&resolved.size===overlay.resolvedHeldUses&&remaining.size===overlay.remainingHeldUses&&newExpressions===overlay.newExpressionForms&&overlay.newQuestionBands===newExpressions*3&&overlay.recheckedEarlierBands===rechecked,'expression partition/counts');
  ensure(expressions.summary.reviewedExpressionForms===emap.size&&expressions.summary.reviewedQuestionBands===emap.size*3&&expressions.summary.newExpressionForms===newExpressions&&expressions.summary.newQuestionBands===newExpressions*3&&expressions.summary.reusedEarlierQuestionBands===rechecked,'expression summary');
  for(const k of ['formsConsidered','consideredUses','reviewedRouteGroups','reviewedPublishedUses','reviewedEarlierUses','reviewedDraftUses','contextualProposals','newQuestionBands'])total[k]+=s[k];
  total.reviewedUses+=s.reviewedUses+resolved.size;total.heldUses+=remaining.size;total.reviewedExpressionComponentUses+=resolved.size;total.reviewedExpressionForms+=newExpressions;total.reviewedExpressionQuestionBands+=newExpressions*3;total.recheckedEarlierExpressionBands+=rechecked;
  end=range.endExclusive;
 }
 total.untouchedQueuedUses=total.initialQueuedUses-total.consideredUses;
 if(progress.heldContextOverlay){
  ensure(JSON.stringify(total)===JSON.stringify(progress.preHoldContextSummary),'pre-hold cumulative summary');
  const overlay=progress.heldContextOverlay,record=await read(overlay.file),original=await read(record.originalReviewFile);
  ensure(sha(await bytes(overlay.file))===overlay.sha256&&sha(await bytes(record.originalReviewFile))===record.originalReviewSha256&&JSON.stringify(record.summary)===JSON.stringify(overlay.summary),'earlier hold revision');
  for(const[k,v]of Object.entries(expectedRevision))ensure(record[k]===v,'earlier hold source revision');
  const remaining=new Set([progress.expressionOverlay,...progress.continuationPackages.map(p=>p.expressionOverlay)].flatMap(v=>v.remaining.map(row=>key(row.sourceOccurrence)))),originalHeld=new Set(original.holds.flatMap(row=>row.sourceOccurrences.map(key))),resolved=new Set();
  for(const ref of record.additionalOriginalReviews??[]){ensure(progress.continuationPackages.some(p=>p.reviewFile===ref.file)&&sha(await bytes(ref.file))===ref.sha256,'additional original held revision');for(const row of (await read(ref.file)).holds)for(const o of row.sourceOccurrences)originalHeld.add(key(o));}
  if(record.supersedesFile){ensure(sha(await bytes(record.supersedesFile))===record.supersedesSha256,'superseded hold revision');for(const i of (await read(record.supersedesFile)).items)ensure(hash(i)===hash(record.items.find(a=>a.key===i.key)),'unchanged inherited held bank');}
  for(const i of record.items){
   questionStructure(i);ensure(hash(i.questions)===i.questionSha256&&hash(i.sourceOccurrences)===i.sourceOccurrencesSha256&&i.reviewNote.length>110,'held bank revision');
   const sense=b.senses.find(s=>s.id===i.target),lemma=b.lemmas.find(l=>l.id===(i.target.startsWith('new:')?i.target.slice(4):sense?.lemmaId));ensure(lemma?.headword===i.lemma&&!lemma.id.startsWith('lem_es_'),'held target owner');
   for(const o of i.sourceOccurrences){source(o);ensure(remaining.has(key(o))&&originalHeld.has(key(o))&&!resolved.has(key(o))&&tokens.get(key(o)).form===i.form&&o.context===unitPlan.units[o.unit-1].text,'exact earlier held source use');resolved.add(key(o));}
   ensure(i.questions[0].context===i.sourceOccurrences[0].context&&i.questions[0].targetText===i.sourceOccurrences[0].text,'held full early context');
  }
  const summary=record.summary;ensure(resolved.size===summary.resolvedHeldUses&&record.items.length===summary.contextualProposals&&summary.newQuestionBands===record.items.length*3&&summary.reviewedRouteGroups===record.items.length,'earlier held counts');
  total.reviewedUses+=resolved.size;total.heldUses-=resolved.size;total.reviewedDraftUses+=resolved.size;total.contextualProposals+=record.items.length;total.newQuestionBands+=record.items.length*3;total.reviewedRouteGroups+=record.items.length;
 }
 total.untouchedQueuedUses=total.initialQueuedUses-total.consideredUses;
 ensure(total.reviewedUses+total.heldUses+total.untouchedQueuedUses===pending.size&&used.size===total.consideredUses,'cumulative source partition');
 ensure(JSON.stringify(total)===JSON.stringify(progress.effectiveSummary),'cumulative progress totals');
 const nextGroup=groups[end],next=nextGroup?.[1][0];ensure(end===progress.nextUntouchedFormIndex,'next source form index');
 if(nextGroup)ensure(nextGroup[0]===progress.nextUntouchedAction?.form&&key(next)===key(progress.nextUntouchedAction),'exact next untouched source form');
 else ensure(end===groups.length&&progress.nextUntouchedAction===null&&total.untouchedQueuedUses===0,'exhausted queue has no next untouched form');
 console.log(`VI cumulative: ${total.formsConsidered} forms/${total.consideredUses} considered uses, ${total.reviewedUses} reviewed, ${total.heldUses} held, ${total.untouchedQueuedUses} untouched; ${total.newQuestionBands} vocabulary and ${total.reviewedExpressionQuestionBands} expression bands. Unpublished.`);
}
