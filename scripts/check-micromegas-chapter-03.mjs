import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';
import {loadPublication} from './micromegas-publication-baseline.mjs';

export async function checkChapterThree(folder,dossier,unitPlan,draft){
  const sha=b=>createHash('sha256').update(b).digest('hex');
  const digest=o=>sha(JSON.stringify(o));
  const read=async name=>JSON.parse(await readFile(resolve(folder,name)));
  const bytes=async name=>readFile(resolve(folder,name));
  const insist=(ok,message)=>{if(!ok)throw Error(`Chapter III: ${message}`)};
  const sourceSha=sha(draft), planSha=sha(await bytes('unit-plan.json'));
  const coverage=await read('chapter-03-coverage.json'),summary=coverage.summary;
  const progress=dossier.review.chapterThree?.progress;
  insist(progress && coverage.sourceSha256===sourceSha && coverage.unitPlanSha256===planSha && coverage.chapter===3,'source inventory stale');
  const expected=unitPlan.units.filter(u=>u.chapter===3).flatMap(u=>tokenizeFrench(u.text).map(t=>({unit:u.ordinal,start:t.start,end:t.end,text:t.text})));
  insist(expected.length===coverage.tokens.length && summary.tokenUses===expected.length && summary.distinctForms===new Set(coverage.tokens.map(t=>t.form)).size,'tokenizer coverage differs');
  const keys=new Map();
  for(let index=0;index<expected.length;index++){
    const a=expected[index],t=coverage.tokens[index],key=`${a.unit}:${a.start}:${a.end}`;
    insist(t.unit===a.unit && t.start===a.start && t.end===a.end && t.text===a.text && t.form===a.text.toLocaleLowerCase('fr') && !keys.has(key),`invalid token ${key}`);
    keys.set(key,t);
  }
  const assigned=new Set();
  const verify=(o,kind,form)=>{
    const key=`${o.unit}:${o.start}:${o.end}`,t=keys.get(key);
    insist(t && !assigned.has(key) && t.disposition===kind && t.text===o.text && unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text && (!form||t.form===form.toLocaleLowerCase('fr')),`invalid assignment ${key}`);
    assigned.add(key);return t;
  };
  const packets=dossier.evidence.map(e=>e.file).filter(name=>/^chapter-03-(batch|reuse|ambiguous|qa)-\d\d\.json$/u.test(name)).sort();
  const batchNames=packets.filter(n=>n.includes('-batch-'));
  insist(batchNames.length===13 && batchNames.every((n,i)=>n===`chapter-03-batch-${String(i+1).padStart(2,'0')}.json`),'batch sequence incomplete');
  const byKey=new Map();
  for(const name of batchNames){
    const batch=await read(name);
    insist(batch.sourceSha256===sourceSha && batch.unitPlanSha256===planSha,'batch stale');
    for(const item of batch.items){
      insist(!byKey.has(item.key) && item.questions.length===3 && item.questions.map(q=>q.band).join(',')==='1-3,4-5,6-8','draft questions incomplete');
      byKey.set(item.key,{name,item});
      for(const o of item.sourceOccurrences){const t=verify(o,'drafted_pending_signoff',item.form);insist(t.draft?.file===name && t.draft.key===item.key,`draft link ${item.key}`)}
      for(const q of item.questions)insist(q.choices.length===4 && new Set(q.choices).size===4 && q.choices.includes(q.answer) && (q.band!=='6-8'||q.choices.every(c=>q.context.toLocaleLowerCase('fr').includes(c.toLocaleLowerCase('fr')))),`question choices ${item.key}`);
    }
  }
  insist(byKey.size===122,'new meaning count');
  const prior=await read('chapter-03-carryover.json');
  insist(prior.sourceSha256===sourceSha && prior.unitPlanSha256===planSha && prior.items.length===10,'carryover stale');
  let carried=0;
  for(const item of prior.items){
    const old=await read(item.earlierBatch),matched=old.items.find(i=>i.key===item.key);
    insist(sha(await bytes(item.earlierBatch))===item.earlierBatchSha256 && matched && digest(matched.questions)===item.earlierQuestionSha256,'earlier questions changed');
    for(const o of item.sourceOccurrences){const t=verify(o,'drafted_pending_signoff',item.form);insist(t.draft?.file==='chapter-03-carryover.json' && t.draft.key===item.key,'carryover link');carried++}
  }
  insist(carried===progress.carriedOverUses,'carryover count');
  const oldDraftNames=dossier.evidence.map(e=>e.file).filter(n=>/^chapter-0[12]-batch-\d\d\.json$/u.test(n));
  for(const name of oldDraftNames)for(const item of (await read(name)).items)for(const o of item.sourceOccurrences.filter(o=>o.chapter===3)){
    const t=verify(o,'drafted_pending_signoff',item.form);insist(t.draft?.file===name && t.draft.key===item.key,'older draft link');
  }
  const published=loadPublication(),quizzes=[...published.preparedQuizzes.values()];
  const questionHash=id=>{
    const [surface,sense]=id.split(':');
    const q=quizzes.filter(q=>q.subject?.kind==='vocabulary' && q.subject.surfaceFormId===surface && q.subject.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));
    insist(q.length===3,`published question count ${id}`);return sha(JSON.stringify(q));
  };
  for(const name of packets.filter(n=>/-reuse-|-ambiguous-/u.test(n))){
    const packet=await read(name);
    insist(packet.sourceSha256===sourceSha && packet.unitPlanSha256===planSha,'reuse stale');
    for(const item of packet.items)for(const o of item.occurrences){
      const id=o.identity??item.identity,expectedHash=o.publishedQuestionSha256??item.publishedQuestionSha256;
      const t=verify(o,'published_identity_reuse_context_reviewed',item.form);
      insist(t.reuse?.file===name && t.reuse.identity===id && t.candidates.some(c=>c.identity===id && c.preparedBands.length===3) && questionHash(id)===expectedHash,`published identity/question changed ${id}`);
    }
  }
  const names=await read('chapter-03-names.json');
  insist(names.sourceSha256===sourceSha && names.unitPlanSha256===planSha,'names stale');
  for(const n of names.names)for(const o of n.occurrences)verify(o,'proper_name_excluded_from_vocabulary',n.form);
  const expressions=await read('chapter-03-expressions.json');
  insist(expressions.sourceSha256===sourceSha && expressions.unitPlanSha256===planSha && expressions.items.length===14,'expression triage stale');
  for(const p of expressions.items)for(const o of p.occurrences)insist(unitPlan.units[o.unit-1].text.slice(o.start,o.end)===o.text,`expression span ${p.key}`);
  const components=await read('chapter-03-phrase-components.json');
  insist(components.sourceSha256===sourceSha && components.unitPlanSha256===planSha,'components stale');
  for(const item of components.items){insist(expressions.items.some(p=>p.key===item.expressionKey),'unknown expression');const t=verify(item.occurrence,'phrase_component_covered_no_independent_vocabulary');insist(t.component?.expressionKey===item.expressionKey,'component mismatch')}
  insist(assigned.size===summary.tokenUses && [...keys.values()].every(t=>assigned.has(`${t.unit}:${t.start}:${t.end}`)),'unassigned tokens');
  for(const [field,kind] of [['draftedTokenUses','drafted_pending_signoff'],['reusedTokenUses','published_identity_reuse_context_reviewed'],['excludedProperNameUses','proper_name_excluded_from_vocabulary'],['coveredPhraseComponents','phrase_component_covered_no_independent_vocabulary']])insist(summary[field]===coverage.tokens.filter(t=>t.disposition===kind).length && progress[field]===summary[field],`incorrect ${field}`);
  insist(summary.unresolvedTokenUses===0 && progress.tokenUses===summary.tokenUses && progress.newMeaningDrafts===byKey.size && progress.newQuestionBands===byKey.size*3,'progress totals');
  const identity=await read('chapter-03-identity-packet.json'),plan=await read('chapter-03-identity-plan.json');
  const identitySha=sha(await bytes('chapter-03-identity-packet.json')),planSha2=sha(await bytes('chapter-03-identity-plan.json'));
  insist(identity.sourceSha256===sourceSha && identity.unitPlanSha256===planSha && plan.identityPacketSha256===identitySha && plan.sourceSha256===sourceSha && plan.unitPlanSha256===planSha && identity.items.length===byKey.size && plan.items.length===byKey.size,'identity evidence stale');
  const routes={};
  for(const [index,route] of plan.items.entries()){
    const candidate=identity.items[index],draft=byKey.get(route.key);
    insist(draft && candidate.key===route.key && draft.name===route.batchFile && candidate.batchFile===route.batchFile && route.questionSha256===digest(draft.item.questions) && route.sourceOccurrencesSha256===digest(draft.item.sourceOccurrences) && candidate.questionSha256===route.questionSha256 && candidate.sourceOccurrencesSha256===route.sourceOccurrencesSha256 && route.rationale?.length>40,'identity route drift');
    routes[route.route]=(routes[route.route]??0)+1;
  }
  insist(JSON.stringify(routes)===JSON.stringify(plan.summary) && JSON.stringify(routes)===JSON.stringify(progress.identityRoutes),'identity totals');
  const qaNames=packets.filter(n=>/-qa-/u.test(n));
  insist(qaNames.length===3,'QA record sequence');
  const reviewed=new Set();
  for(const name of qaNames){const qa=await read(name);
    insist(qa.sourceSha256===sourceSha && qa.unitPlanSha256===planSha && qa.coverageSha256===sha(await bytes('chapter-03-coverage.json')) && qa.identityPacketSha256===identitySha && qa.identityPlanSha256===planSha2,'QA evidence stale');
    for(const e of qa.batchEvidence)insist(e.sha256===sha(await bytes(e.file)),'QA batch changed');
    for(const entry of qa.items){const draft=byKey.get(entry.key);insist(draft && draft.name===entry.batchFile && !reviewed.has(entry.key) && entry.questionSha256===digest(draft.item.questions) && entry.sourceOccurrencesSha256===digest(draft.item.sourceOccurrences) && entry.questionBands.join(',')==='1-3,4-5,6-8' && entry.reviewNote.length>75 && entry.identityRoute===plan.items.find(i=>i.key===entry.key)?.route,`QA item invalid ${entry.key}`);reviewed.add(entry.key)}
  }
  insist(reviewed.size===byKey.size && progress.questionReviewedMeanings===reviewed.size && progress.questionReviewedBands===reviewed.size*3,'QA incomplete');
  const expressionQa=await read('chapter-03-expression-qa.json');
  insist(expressionQa.expressionEvidenceSha256===sha(await bytes('chapter-03-expressions.json')) && expressionQa.sourceSha256===sourceSha && expressionQa.unitPlanSha256===planSha && expressionQa.items.length===1,'expression QA stale');
  for(const entry of expressionQa.items){const item=expressions.items.find(i=>i.key===entry.key);insist(item?.questions?.length===3 && entry.questionSha256===digest(item.questions) && entry.occurrencesSha256===digest(item.occurrences) && item.questions.every(q=>q.choices.length===4 && new Set(q.choices).size===4 && q.choices.includes(q.answer)),'expression questions changed')}
  const linked=expressions.items.find(i=>i.key==='a_peine'),earlier=expressionQa.earlierReviewedExpression;
  insist(linked && earlier?.earlierQuestionSha256===linked.earlierQuestionSha256 && earlier.earlierExpressionSha256===sha(await bytes('chapter-02-expressions.json')) && earlier.chapterThreeOccurrencesSha256===digest(linked.occurrences),'shared expression changed');
  insist(progress.expressionReviewedBands===3 && progress.newExpressionQuestionBands===3 && progress.earlierExpressionSharedBands===3,'expression totals');
  console.log('Micromégas chapter III: every token disposition, draft, published reuse, identity route and question QA fingerprint valid.');
}
