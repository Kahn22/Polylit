import{readFileSync}from'node:fs';import{createHash}from'node:crypto';
import{composeCrossWork71}from'./micromegas-cross-work-expressions-71.mjs';import{composeContextRepairs73}from'./micromegas-context-repairs-73.mjs';
import{quizEditorialIssues}from'../dist/publication/quiz-authoring.js';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex'),ensure=(x,m)=>{if(!x)throw Error(`Cross-work73 check: ${m}`);};
export function validateRepairLedger73(w,base){
 ensure(!w.publicationApplied&&!w.learnerStateChanged&&!w.candidateReleaseReady,'offline state');
 const queue=new Map(base.repairQueue.map(r=>[r.quizId,r]));ensure(w.repairs.length===queue.size&&new Set(w.repairs.map(r=>r.id)).size===queue.size,'complete unique repair ledger');
 for(const r of w.repairs){const item=queue.get(r.id);ensure(item&&item.beforeSha256===r.beforeSha256&&hash(r.before)===r.beforeSha256&&hash(r.after)===r.afterSha256,'exact question revisions');
  ensure(r.before.id===r.after.id&&r.id===r.after.id&&hash(r.before.subject)===hash(r.after.subject)&&hash(r.before.choices)===hash(r.after.choices)&&r.before.correctChoiceId===r.after.correctChoiceId,'identity and answers preserved');
  ensure(!quizEditorialIssues(r.after).length,'stored target and format');
  if(r.after.band==='levels_6_8')ensure(r.after.prompt.includes(r.before.context)&&r.after.choices.every(c=>r.after.context.includes(`« ${c.text} »`)),'lossless advanced presentation');
 }
 ensure(w.summary.remainingDomainDiagnostics===0&&w.validation.contentBundle==='passed'&&w.validation.expressionCatalog==='passed','domain result');return true;
}
export function checkCrossWork73(folder){const read=f=>JSON.parse(readFileSync(`${folder}/${f}`));const x=read('whole-work-cross-work-expressions-71.json'),t=read('whole-work-offline-transaction-72.json'),w=read('whole-work-context-repairs-73.json');ensure(hash(x)===hash(composeCrossWork71(folder)),'exact source transactions71');validateRepairLedger73(w,t);ensure(hash(w)===hash(composeContextRepairs73(folder)),'exact combined projection73');console.log('Micromégas71–73: cross-work source transactions, retained ownership and all1101 context repairs verified offline.');return w;}
