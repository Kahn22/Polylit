import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {checkContinuations} from './check-micromegas-chapter-06-continuations.mjs';
import {loadPublication} from './micromegas-publication-baseline.mjs';
export async function checkChapterSix(folder, unitPlan) {
 const bytes=n=>readFile(`${folder}/${n}`),read=async n=>JSON.parse(await bytes(n));
 const sha=b=>createHash('sha256').update(b).digest('hex'),hash=v=>sha(JSON.stringify(v));
 const ensure=(c,m)=>{if(!c)throw Error(`Chapter VI partial review: ${m}`);};
 const key=o=>`${o.unit}:${o.start}:${o.end}`;
 const [packet,review,batch,targets,progress]=await Promise.all(['chapter-06-context-packet-01.json','chapter-06-context-review-01.json','chapter-06-batch-01.json','chapter-06-identity-targets-01.json','chapter-06-progress.json'].map(read));
 const sourceSha=sha(await bytes('canonical-draft.txt')),unitSha=sha(await bytes('unit-plan.json')),inventorySha=sha(await bytes('chapter-06-inventory.json'));
 for(const r of [packet,review,batch,targets,progress])ensure(r.sourceSha256===sourceSha&&r.unitPlanSha256===unitSha&&r.inventorySha256===inventorySha,'source revision changed');
 ensure(packet.summary.forms===120 && packet.items.length===120 && packet.summary.sourceUses===652,'fixed package count');
 ensure(review.packetSha256===sha(await bytes('chapter-06-context-packet-01.json'))&&review.batchSha256===sha(await bytes('chapter-06-batch-01.json'))&&review.identityTargetsSha256===sha(await bytes('chapter-06-identity-targets-01.json')),'reviewed revision changed');
 for(const[n,h]of Object.entries(progress.evidenceSha256))ensure(sha(await bytes(n))===h,`progress evidence ${n}`);
 const publication=loadPublication(),quizzes=[...publication.preparedQuizzes.values()],bundle=publication.bundle;
 const sourceTokens=new Map((await read('chapter-06-inventory.json')).tokens.map(t=>[key(t),t]));
 const packetMap=new Map(packet.items.map(i=>[i.form,i])),proposalMap=new Map(batch.items.map(i=>[i.key,i])),targetMap=new Map(targets.items.map(i=>[i.key,i]));
 ensure(proposalMap.size===batch.items.length&&targetMap.size===targets.items.length&&proposalMap.size===targetMap.size,'proposal ownership/duplicates');
 const questionStructure=item=>{ensure(item.questions.length===3&&item.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8',`bands ${item.key}`);for(const q of item.questions)ensure(q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer)&&q.context&&q.question,`choices ${item.key}`);};
 for(const item of batch.items){
  questionStructure(item);const target=targetMap.get(item.key);
  ensure(target.form===item.form&&target.lemma===item.lemma&&target.questionSha256===hash(item.questions)&&target.sourceOccurrencesSha256===hash(item.sourceOccurrences)&&item.reviewNote.length>90,'proposal revision');
  ensure(item.questions[0].context===unitPlan.units[item.sourceOccurrences[0].unit-1].text&&item.questions[0].targetText===item.sourceOccurrences[0].text,'full early context');
  if(target.target.startsWith('sns_')){const sense=bundle.senses.find(s=>s.id===target.target),lemma=bundle.lemmas.find(l=>l.id===sense?.lemmaId);ensure(lemma?.headword.toLocaleLowerCase('fr')===item.lemma.toLocaleLowerCase('fr')&&!lemma.id.startsWith('lem_es_'),'published target lemma');}
  else if(target.target.startsWith('new:')){const lemma=bundle.lemmas.find(l=>l.id===target.target.slice(4));ensure(lemma?.headword.toLowerCase()===item.lemma.toLowerCase(),'distinct sense ownership');}
  else if(target.target.startsWith('prior:')){const[file,id]=target.target.slice(6).split(':');const earlier=(await read(file)).items.find(i=>i.key===id);ensure(earlier?.lemma.toLowerCase()===item.lemma.toLowerCase(),'earlier sense ownership');}
  else if(target.target.startsWith('same:')){ensure(batch.items.some(i=>i.form===target.target.slice(5)&&i.lemma===item.lemma),'same batch dependency');}
  else ensure(target.target==='new','unknown target');
 }
 const expected=new Set(packet.items.slice(0,review.summary.formsConsidered).flatMap(i=>i.sourceOccurrences.map(key))),seen=new Set(),counts={published:0,earlier:0,draft:0,hold:0};
 for(const entry of [...review.items,...review.holds]){
  const p=packetMap.get(entry.form);ensure(p,'unknown form');
  for(const o of entry.sourceOccurrences){const token=sourceTokens.get(key(o));ensure(expected.has(key(o))&&!seen.has(key(o))&&token?.form===entry.form&&token.text===o.text&&o.chapter===6&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text&&o.context===unitPlan.units[o.unit-1].text,'source partition');seen.add(key(o));counts[entry.decision]+=1;}
  if(entry.decision==='published'){
   const candidate=p.publishedCandidates.find(c=>c.identity===entry.identity);const[surface,sense]=entry.identity.split(':');const current=quizzes.filter(q=>q.subject?.surfaceFormId===surface&&q.subject?.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));
   ensure(candidate&&candidate.questionSha256===entry.questionSha256&&hash(current)===entry.questionSha256&&current.length===3&&new Set(current.map(q=>q.band)).size===3&&entry.reviewNote.length>90,'published bank revision');
  }else if(entry.decision==='earlier'){
   const candidate=p.earlierCandidates.find(c=>c.file===entry.earlierFile&&c.key===entry.earlierKey),earlier=(await read(entry.earlierFile)).items.find(i=>i.key===entry.earlierKey);questionStructure(earlier);
   ensure(candidate&&sha(await bytes(entry.earlierFile))===entry.earlierFileSha256&&hash(earlier.questions)===entry.questionSha256&&entry.reviewNote.length>90,'earlier bank revision');
  }else if(entry.decision==='draft'){const item=proposalMap.get(entry.proposalKey);ensure(item?.form===entry.form&&entry.sourceOccurrences.every(o=>item.sourceOccurrences.some(a=>key(a)===key(o)))&&entry.reviewNote===item.reviewNote,'draft route');}
  else ensure(entry.decision==='hold'&&entry.status==='unresolved_dependency_not_approved'&&entry.reason.length>20,'hold is not approval');
 }
 ensure(seen.size===expected.size&&seen.size===review.summary.consideredUses,'missing/extra routes');
 const s=review.summary;ensure(s.reviewedUses===counts.published+counts.earlier+counts.draft&&s.reviewedPublishedUses===counts.published&&s.reviewedEarlierUses===counts.earlier&&s.reviewedDraftUses===counts.draft&&s.heldUses===counts.hold&&s.newQuestionBands===batch.items.length*3&&s.contextualProposals===batch.items.length&&s.untouchedQueuedUses+s.consideredUses===s.initialQueuedUses&&JSON.stringify(s)===JSON.stringify(progress.summary),'progress totals');
 const approved=new Set(review.items.flatMap(i=>i.sourceOccurrences.map(key)));const next=packet.items.flatMap(i=>i.sourceOccurrences).filter(o=>!approved.has(key(o))).sort((a,b)=>a.unit-b.unit||a.start-b.start)[0];ensure(next&&key(progress.nextAction)===key(next),'next exact source hold');
 if(progress.expressionOverlay){
  const overlay=progress.expressionOverlay,expressions=await read(overlay.file);
  ensure(sha(await bytes(overlay.file))===overlay.sha256,'expression revision');
  const eMap=new Map(expressions.items.map(i=>[i.key,i]));ensure(eMap.size===expressions.items.length,'expression keys');
  const components=new Map();
  for(const item of expressions.items){
   questionStructure(item);ensure(hash(item.questions)===item.questionSha256&&item.reviewNote.length>110,'expression bank revision');
   for(const o of item.sourceOccurrences)ensure(o.chapter===6&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text&&o.text===item.surfacePattern,'full expression source span');
   for(const t of item.componentTokens){ensure(sourceTokens.get(key(t))?.text===t.text&&item.sourceOccurrences.some(o=>o.unit===t.unit&&t.start>=o.start&&t.end<=o.end),'expression component span');components.set(key(t),item.key);}
   if(item.earlierFile){ensure(sha(await bytes(item.earlierFile))===item.earlierFileSha256,'earlier expression revision');const earlier=(await read(item.earlierFile)).items.find(i=>i.key===item.earlierKey);ensure(hash(earlier.questions)===item.questionSha256,'earlier expression bank');}
  }
  const held=new Set(review.holds.flatMap(i=>i.sourceOccurrences.map(key))),resolved=new Set(),remaining=new Set();
  for(const row of overlay.resolved){const k=key(row.sourceOccurrence);ensure(held.has(k)&&!resolved.has(k)&&components.get(k)===row.expressionKey,'resolved expression hold');resolved.add(k);}
  for(const row of overlay.remaining){const k=key(row.sourceOccurrence);ensure(held.has(k)&&!resolved.has(k)&&!remaining.has(k),'remaining held use');remaining.add(k);}
  ensure(resolved.size+remaining.size===held.size&&resolved.size===overlay.resolvedHeldUses&&remaining.size===overlay.remainingHeldUses,'hold overlay partition');
  ensure(overlay.reviewedExpressionForms===eMap.size&&overlay.reviewedQuestionBands===eMap.size*3&&(progress.initialEffectiveSummary??progress.effectiveSummary).reviewedUses===s.reviewedUses+resolved.size&&(progress.initialEffectiveSummary??progress.effectiveSummary).heldUses===remaining.size,'effective progress');
 }
 if(progress.continuationPackages)await checkContinuations(folder,unitPlan,progress);
 console.log(`Micromégas VI base partial: ${s.formsConsidered} forms / ${s.consideredUses} considered uses; ${s.reviewedUses} reviewed routes, ${s.contextualProposals} proposals / ${s.newQuestionBands} bands; ${s.heldUses} held uses and ${s.untouchedQueuedUses} untouched queued uses. Unpublished.`);
 return progress;
}
