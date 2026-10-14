import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {checkChapterFive} from './check-micromegas-chapter-05.mjs';
import {checkChapterSeven} from './check-micromegas-chapter-07.mjs';
import {checkChapterSix} from './check-micromegas-chapter-06.mjs';

export async function checkRemaining(folder,dossier,unitPlan,draft){
 const read=async n=>JSON.parse(await readFile(resolve(folder,n)));
 const bytes=async n=>readFile(resolve(folder,n));
 const sha=b=>createHash('sha256').update(b).digest('hex');
 const ensure=(yes,what)=>{if(!yes)throw Error(`Chapters IV–VII: ${what}`)};
 const source=sha(draft),unitSha=sha(await bytes('unit-plan.json'));
 const inventories=await Promise.all([4,5,6,7].map(c=>read(`chapter-0${c}-inventory.json`)));
 const tokens=new Map();
 for(const inv of inventories){
  const actual=unitPlan.units.filter(u=>u.chapter===inv.chapter).flatMap(u=>tokenizeFrench(u.text).map(t=>({unit:u.ordinal,...t})));
  ensure(inv.sourceSha256===source&&inv.unitPlanSha256===unitSha&&actual.length===inv.tokens.length&&inv.summary.tokenUses===actual.length,`inventory ${inv.chapter} changed`);
  for(const [i,t] of inv.tokens.entries()){
   const a=actual[i],key=`${t.unit}:${t.start}:${t.end}`;
   ensure(t.chapter===undefined&&t.unit===a.unit&&t.start===a.start&&t.end===a.end&&t.text===a.text&&t.form===a.text.toLocaleLowerCase('fr')&&!tokens.has(key),`token ${key}`);
   if(t.earlierDraft){
    const old=(await read(t.earlierDraft.file)).items.find(i=>i.key===t.earlierDraft.key);
    ensure(old && old.sourceOccurrences.some(o=>o.unit===t.unit&&o.start===t.start&&o.end===t.end&&o.text===t.text) && sha(JSON.stringify(old.questions))===t.earlierDraft.questionSha256,`earlier draft changed ${key}`);
   }
   tokens.set(key,t);
  }
 }
 ensure(tokens.size===4434,'token coverage count');
 const consumed=new Set();
 const verify=(o,form)=>{
  const key=`${o.unit}:${o.start}:${o.end}`,t=tokens.get(key);
  ensure(t&&!consumed.has(key)&&t.text===o.text&&t.form===form&&unitPlan.units[o.unit-1].chapter===o.chapter&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text,`assignment ${key}`);
  consumed.add(key);return t;
 };
 const prior=await read('chapter-04-07-carryover-review.json');
 ensure(prior.sourceSha256===source&&prior.unitPlanSha256===unitSha&&prior.items.length===53,'carryover outdated');
 for(const item of prior.items){const old=(await read(item.earlierBatch)).items.find(i=>i.key===item.key);
  ensure(old&&sha(await bytes(item.earlierBatch))===item.earlierBatchSha256&&sha(JSON.stringify(old.questions))===item.earlierQuestionSha256,'earlier reviewed questions changed');
  for(const o of item.occurrences){const t=verify(o,item.form);ensure(!t.earlierDraft&&t.candidates.length===0,`shared context ${item.key}`)}
 }
 const exceptions=new Set();
 for(const x of prior.exceptions)for(const o of x.occurrences){const key=`${o.unit}:${o.start}:${o.end}`;ensure(tokens.get(key)?.form===x.form&&!consumed.has(key),`separate meaning ${key}`);exceptions.add(key)}
 ensure(exceptions.size===6,'meaning separation count');
 const names=await read('chapter-04-07-names.json');
 ensure(names.sourceSha256===source&&names.unitPlanSha256===unitSha,'names outdated');
 for(const item of names.items)for(const o of item.occurrences){const t=verify(o,item.form.toLocaleLowerCase('fr'));ensure(!t.earlierDraft,'previous authored word excluded')}
 const identity=await read('chapter-04-identity-packet.json'),routes=await read('chapter-04-identity-plan.json');
 const packetHash=sha(await bytes('chapter-04-identity-packet.json')),routeHash=sha(await bytes('chapter-04-identity-plan.json'));
 ensure(identity.sourceSha256===source&&identity.unitPlanSha256===unitSha&&routes.identityPacketSha256===packetHash&&routes.sourceSha256===source&&routes.unitPlanSha256===unitSha&&identity.items.length===179&&routes.items.length===179,'Chapter IV identity packet stale');
 const draftKeys=new Set(),draftByKey=new Map(),routeSummary={};let draftUses=0;
 for(const name of ['chapter-04-qa-01.json','chapter-04-qa-02.json','chapter-04-qa-03.json','chapter-04-qa-04.json','chapter-04-qa-05.json','chapter-04-qa-06.json','chapter-04-qa-07.json']){
  const reviewed=await read(name);
  ensure(reviewed.sourceSha256===source&&reviewed.unitPlanSha256===unitSha&&reviewed.inventorySha256===sha(await bytes('chapter-04-inventory.json'))&&reviewed.identityPacketSha256===packetHash&&reviewed.identityPlanSha256===routeHash,'Chapter IV question QA stale');
  for(const evidence of reviewed.batchEvidence){
   ensure(evidence.sha256===sha(await bytes(evidence.file))&&identity.batchEvidence[evidence.file]===evidence.sha256,'Chapter IV draft batch changed');
   for(const item of (await read(evidence.file)).items){
    ensure(!draftKeys.has(item.key)&&item.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8'&&item.questions.every(q=>q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer)),'new draft questions invalid');
    const qa=reviewed.items.find(i=>i.key===item.key),route=routes.items.find(i=>i.key===item.key),candidate=identity.items.find(i=>i.key===item.key);
    ensure(route&&candidate&&route.batchFile===evidence.file&&candidate.batchFile===evidence.file&&qa?.batchFile===evidence.file&&qa.questionSha256===route.questionSha256&&candidate.questionSha256===qa.questionSha256&&qa.questionSha256===sha(JSON.stringify(item.questions))&&qa.sourceOccurrencesSha256===sha(JSON.stringify(item.sourceOccurrences))&&candidate.sourceOccurrencesSha256===qa.sourceOccurrencesSha256&&route.sourceOccurrencesSha256===qa.sourceOccurrencesSha256&&qa.identityRoute===route.route&&route.rationale?.length>55&&qa.reviewNote.length>75,'new draft QA or route changed');
    if(route.route==='link_published_sense')ensure(candidate.publishedLemmaCandidates.some(l=>l.lemmaId===route.targetLemmaId&&l.senses.some(s=>s.senseId===route.targetSenseId)),'published route disappeared');
    if(route.route==='link_planned_earlier_sense')ensure(candidate.relatedEarlierPlans.some(i=>route.dependsOn?.endsWith(`:${i.key}`)),'earlier planned sense disappeared');
    if(route.route==='new_sense_existing_lemma')ensure(candidate.publishedLemmaCandidates.some(l=>l.lemmaId===route.targetLemmaId),'published lemma disappeared');
    if(route.route==='link_planned_chapter_four_sense')ensure(identity.items.some(i=>route.dependsOn===`chapter-04-identity-plan.json:${i.key}`&&i.lemma===item.lemma),'Chapter IV planned sense disappeared');
    if(route.route==='new_sense_planned_earlier_lemma')ensure(candidate.relatedEarlierPlans.some(i=>route.dependsOn?.endsWith(`:${i.key}`)&&i.intendedSenseGroup?.startsWith(`${item.lemma}:`)),'earlier planned lemma disappeared');
    for(const o of item.sourceOccurrences){const t=verify(o,item.form);ensure(!t.earlierDraft&&((evidence.file>='chapter-04-batch-16.json')?t.candidates.length>0:!t.candidates.length),'new draft candidate route changed');draftUses++}
    draftKeys.add(item.key);draftByKey.set(item.key,item);routeSummary[route.route]=(routeSummary[route.route]??0)+1;
   }
  }
  ensure(reviewed.items.every(i=>draftKeys.has(i.key)),'missing Chapter IV question review');
 }
 ensure(draftKeys.size===179&&draftUses===203&&JSON.stringify(routeSummary)===JSON.stringify(routes.summary),'Chapter IV reviews or identity counts incomplete');
 const pub=await read('chapter-04-07-published-candidates.json'),fresh=await read('chapter-04-07-new-form-queue.json');
 const quizzes=[...loadPublication().preparedQuizzes.values()];
 const questionHash=id=>{const [surface,sense]=id.split(':');const q=quizzes.filter(x=>x.subject?.kind==='vocabulary'&&x.subject.surfaceFormId===surface&&x.subject.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));return {hash:sha(JSON.stringify(q)),bands:q.map(x=>x.band)}};
 const reuseReviews=await Promise.all([1,2,3,4,5].map(n=>read(`chapter-04-published-reuse-review-${String(n).padStart(2,'0')}.json`)));let reuseUses=0;
 const reuseForms=new Set(),heldForms=new Set(),heldKeys=new Set();
 for(const reuse of reuseReviews){
  ensure(reuse.sourceSha256===source&&reuse.unitPlanSha256===unitSha&&reuse.chapter===4&&reuse.items.length>=15,'Chapter IV published reuse review stale');
  let packetUses=0;
  for(const item of reuse.items){
   const q=questionHash(item.identity);reuseForms.add(item.form);
   ensure(item.decision==='reuse_published_identity'&&item.reviewNote.length>50&&q.hash===item.questionSha256&&JSON.stringify(q.bands)===JSON.stringify(item.bands)&&q.bands.length===3,'reviewed published questions changed');
   for(const o of item.sourceOccurrences){const t=verify(o,item.form);ensure(o.chapter===4&&!t.earlierDraft&&t.candidates.some(c=>c.identity===item.identity&&c.gloss===item.gloss),`published reuse ${item.form}`);reuseUses++;packetUses++}
  }
  ensure(reuse.summary.reviewedForms===new Set(reuse.items.map(i=>i.form)).size&&reuse.summary.reviewedUses===packetUses&&reuse.summary.heldForms===new Set(reuse.holds.map(i=>i.form)).size&&reuse.summary.heldUses===reuse.holds.reduce((n,i)=>n+i.sourceOccurrences.length,0),'Chapter IV reuse counts changed');
  for(const hold of reuse.holds)for(const o of hold.sourceOccurrences){const key=`${o.unit}:${o.start}:${o.end}`;ensure(tokens.get(key)?.form===hold.form&&o.chapter===4&&!heldKeys.has(key)&&hold.reason.length>25,`held published context ${key}`);heldForms.add(hold.form);heldKeys.add(key)}
 }
 const finalReview=await read('chapter-04-final-dispositions.json');
 ensure(finalReview.sourceSha256===source&&finalReview.unitPlanSha256===unitSha&&finalReview.inventorySha256===sha(await bytes('chapter-04-inventory.json'))&&finalReview.items.length===41,'Chapter IV final dispositions stale');
 const finalSummary={};
 for(const item of finalReview.items){
  const t=verify(item.occurrence,item.form);ensure(!t.earlierDraft&&item.rationale.length>30,'Chapter IV final source decision incomplete');
  if(item.decision==='reuse_published_identity_and_questions'){
   ensure(t.candidates.some(c=>c.identity===item.identity)&&questionHash(item.identity).hash===item.questionSha256,'final published questions changed');
  }else if(item.decision==='share_earlier_planned_surface_sense_questions'){
   const [file,key]=item.dependsOn.split(':'),old=(await read(file)).items.find(i=>i.key===key);
   ensure(old?.questionSha256===item.questionSha256&&sha(await bytes(file))===item.earlierPlanSha256,'final earlier-planned questions changed');
  }else if(item.decision==='covered_expression_or_compositional_component'){
   const [file,key]=item.dependsOn.split(':'),review=await read(file);
   ensure(review.items.some(i=>i.key===key)&&sha(await bytes(file))===item.reviewSha256,'final expression dependency changed');
  }else ensure(false,'unrecognized final Chapter IV decision');
  finalSummary[item.decision]=(finalSummary[item.decision]??0)+1;
 }
 ensure(JSON.stringify(finalSummary)===JSON.stringify(finalReview.summary),'final decision summary changed');
 const chapterFive = dossier.evidence.some(e=>e.file==='chapter-05-coverage.json') ? await checkChapterFive(folder,unitPlan) : null;
 if(dossier.evidence.some(e=>e.file==='chapter-06-progress.json')) await checkChapterSix(folder,unitPlan);
 if(dossier.evidence.some(e=>e.file==='chapter-07-progress.json')) await checkChapterSeven(folder,unitPlan);
 let chapterFiveAdditionalUses = 0;
 if (chapterFive) for (const row of chapterFive.tokens) {
  const k=`${row.unit}:${row.start}:${row.end}`, t=tokens.get(k);
  ensure(t?.form===row.form && t.text===row.text,'Chapter V source route changed');
  if(!t.earlierDraft && !consumed.has(k)){ consumed.add(k);chapterFiveAdditionalUses++; }
 }
 for(const list of [pub,fresh]){
  ensure(list.sourceSha256===source&&list.unitPlanSha256===unitSha,'candidate queue outdated');
  for(const row of list.items){
   for(const o of row.occurrences){const t=verify(o,row.form);ensure(!t.earlierDraft&&((list===fresh)===(t.candidates.length===0))&&!!o.priorMeaningException===exceptions.has(`${o.unit}:${o.start}:${o.end}`),`candidate misclassified ${row.form}`)}
   if(list===pub)for(const candidate of row.candidates){const q=questionHash(candidate.identity);ensure(q.hash===candidate.questionSha256&&JSON.stringify(q.bands)===JSON.stringify(candidate.bands),'published question snapshot changed')}
  }
 }
 ensure([pub,fresh].every(list=>list.items.every(row=>row.occurrences.every(o=>o.chapter!==4))),'Chapter IV candidate queue not empty');
 if(chapterFive) ensure(chapterFiveAdditionalUses===573 && [pub,fresh].every(list=>list.items.every(row=>row.occurrences.every(o=>o.chapter!==5))),'Chapter V candidate queue not reconciled');
 const already=[...tokens.entries()].filter(([,t])=>t.earlierDraft).map(([key])=>key);
 ensure(already.every(k=>!consumed.has(k))&&consumed.size+already.length===tokens.size,'missing or duplicated source tokens');
 const coverage=await read('chapter-04-coverage.json'),inventoryFour=inventories[0];
 ensure(coverage.sourceSha256===source&&coverage.unitPlanSha256===unitSha&&coverage.inventorySha256===sha(await bytes('chapter-04-inventory.json'))&&coverage.tokens.length===inventoryFour.tokens.length&&coverage.summary.tokenUses===1041&&coverage.summary.resolvedTokenUses===1041&&coverage.summary.unresolvedTokenUses===0&&coverage.summary.newMeanings===179&&coverage.summary.newQuestionBands===537&&coverage.summary.additionalExpressionReviews===13&&coverage.summary.additionalExpressionQuestionBands===39,'Chapter IV coverage stale');
 const coverageCounts={};
 for(const [index,row] of coverage.tokens.entries()){
  const t=inventoryFour.tokens[index],key=`${row.unit}:${row.start}:${row.end}`;
  ensure(row.unit===t.unit&&row.start===t.start&&row.end===t.end&&row.text===t.text&&row.form===t.form&&row.evidenceFile&&row.evidenceKey&&(t.earlierDraft?row.disposition==='already_authored_earlier':consumed.has(key)),'Chapter IV coverage span or disposition changed');
  coverageCounts[row.disposition]=(coverageCounts[row.disposition]??0)+1;
 }
 ensure(JSON.stringify(coverageCounts)===JSON.stringify(coverage.summary.dispositions)&&coverageCounts.already_authored_earlier===36&&coverageCounts.share_earlier_reviewed_meaning===19&&coverageCounts.proper_name===14&&coverageCounts.reuse_published_identity_and_questions===738&&coverageCounts.new_reviewed_meaning_and_questions===203&&coverageCounts.share_earlier_planned_surface_sense_questions===4&&coverageCounts.covered_expression_or_compositional_component===27,'Chapter IV coverage totals changed');
 const expr=await read('chapter-04-07-expressions.json');
 ensure(expr.sourceSha256===source&&expr.unitPlanSha256===unitSha&&expr.items.length===25,'expression queue outdated');
 for(const item of expr.items){
  for(const o of item.occurrences)ensure(unitPlan.units[o.unit-1].chapter===o.chapter&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text,`expression span ${item.key}`);
  for(const old of item.earlierDecisions??[])ensure(sha(await bytes(old.file))===old.fileSha256,`earlier expression changed ${item.key}`);
 }
 const straight=await read('chapter-04-droit-fil-review.json');
 ensure(straight.sourceSha256===source&&straight.unitPlanSha256===unitSha&&straight.inventorySha256===sha(await bytes('chapter-04-inventory.json'))&&straight.items.length===1,'de droit fil review stale');
 const line=straight.items[0];
 ensure(line.key==='de_droit_fil'&&line.meaning==='in a straight line; without veering'&&line.sourceOccurrences.length===1&&line.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8'&&line.questions.every(q=>q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer))&&line.reviewNote.length>110,'de droit fil phrase or questions changed');
 const span=line.sourceOccurrences[0],unit=unitPlan.units[span.unit-1];
 ensure(span.chapter===4&&span.unit===95&&span.start===207&&span.end===219&&unit.text.slice(span.start,span.end)===line.surfacePattern,'de droit fil span changed');
 ensure(line.componentTokenHolds.map(t=>`${t.form}:${t.start}`).join(',')==='de:207,droit:210,fil:216'&&line.componentTokenHolds.every(o=>unit.text.slice(o.start,o.end)===o.text&&consumed.has(`${o.unit}:${o.start}:${o.end}`)),'de droit fil token holds changed');
 const underwater=await read('chapter-04-entre-deux-eaux-review.json');
 ensure(underwater.sourceSha256===source&&underwater.unitPlanSha256===unitSha&&underwater.inventorySha256===sha(await bytes('chapter-04-inventory.json'))&&underwater.items.length===1,'entre deux eaux review stale');
 const phrase=underwater.items[0],underSpan=phrase.sourceOccurrences[0],underUnit=unitPlan.units[underSpan.unit-1];
 ensure(phrase.key==='entre_deux_eaux'&&phrase.meaning==='below the water surface, away from the bottom'&&phrase.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8'&&phrase.questions.every(q=>q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer))&&phrase.reviewNote.length>120&&underSpan.chapter===4&&underSpan.unit===108&&underSpan.start===74&&underSpan.end===89&&underUnit.text.slice(underSpan.start,underSpan.end)===phrase.surfacePattern,'entre deux eaux phrase or questions changed');
 ensure(phrase.componentTokenHolds.map(t=>`${t.form}:${t.start}`).join(',')==='entre:74,deux:80,eaux:85'&&phrase.componentTokenHolds.every(o=>underUnit.text.slice(o.start,o.end)===o.text&&consumed.has(`${o.unit}:${o.start}:${o.end}`)),'entre deux eaux token holds changed');
 const finalExpressions=await read('chapter-04-final-expressions.json');
 ensure(finalExpressions.sourceSha256===source&&finalExpressions.unitPlanSha256===unitSha&&finalExpressions.inventorySha256===sha(await bytes('chapter-04-inventory.json'))&&finalExpressions.items.length===11,'Chapter IV expression review stale');
 for(const item of finalExpressions.items){
  ensure(item.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8'&&item.questions.every(q=>q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer))&&item.reviewNote.length>90,'Chapter IV expression questions incomplete');
  for(const o of item.sourceOccurrences)ensure(o.chapter===4&&unitPlan.units[o.unit-1].text.slice(o.start,o.end)===item.surfacePattern,'Chapter IV expression source span changed');
  for(const o of item.componentTokens)ensure(unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text&&tokens.get(`${o.unit}:${o.start}:${o.end}`)?.form===o.form,'Chapter IV expression component changed');
 }
 const p=dossier.review.remainingChapters?.progress;
 ensure(p&&p.tokenUses===4434&&p.alreadyAuthoredEarlierUses===already.length&&p.reviewedEarlierMeaningSharedUses===prior.summary.sharedUses&&p.reviewedProperNameUses===names.summary.sourceUses&&p.chapterFourPublishedReuseForms===reuseForms.size&&p.chapterFourPublishedReuseUses===reuseUses&&p.chapterFourPublishedReuseHolds===heldForms.size&&p.candidatePublishedUses===pub.summary.uses&&p.noExactIdentityUses===fresh.summary.uses&&p.editorialDecisionPendingUses===pub.summary.uses+fresh.summary.uses&&p.unresolvedTokenUses===p.editorialDecisionPendingUses&&p.chapterFourNewMeaningsReviewed===draftKeys.size&&p.chapterFourNewUsesReviewed===draftUses&&p.newQuestionBandsReviewed===draftKeys.size*3&&p.chapterFourAdditionalExpressionReviews===straight.items.length+underwater.items.length+finalExpressions.items.length&&p.chapterFourAdditionalExpressionQuestionBands===line.questions.length+phrase.questions.length+finalExpressions.items.length*3&&p.chapterFourFinalDispositionUses===finalReview.items.length&&p.chapterFourUnresolvedUses===0&&JSON.stringify(p.chapterFourIdentityRoutes)===JSON.stringify(routes.summary),'dossier pending counts inconsistent');
 if(chapterFive) ensure(p.chapterFiveUnresolvedUses===0 && p.chapterFiveAdditionalResolvedUses===chapterFiveAdditionalUses && p.chapterFiveReviewedVocabularyQuestionBands===411 && p.chapterFiveReviewedExpressionQuestionBands===27,'Chapter V dossier progress inconsistent');
 console.log(`Micromégas IV–VII: 4,434 exact source uses and candidate queues verified; ${p.editorialDecisionPendingUses} contextual decisions remain pending.`);
}
