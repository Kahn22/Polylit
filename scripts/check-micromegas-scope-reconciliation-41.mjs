import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {checkReviewedVerbScope} from './check-micromegas-scope-review-helpers.mjs';

const take='sns_parure_reprendre_prendre_de_nouveau_002348fae7';
const speech='sns_fr_reprendre_resume_speech';
const surface='srf_parure_reprit_lem_parure_reprendre_verb_cbc44546b1_fb5e6b751e';
export async function checkReprendre213Resolution(folder,unitPlan){
 await checkReviewedVerbScope(folder,unitPlan,'41','Reprendre unit 213',new Set(['reprit']),unit=>unit===213?take:speech,{reviewKey:'wholeWorkReprendre213Resolution',validate:async({plan,p,ensure,eq,hash,summary})=>{
  const bytes=f=>readFile(`${folder}/${f}`),read=async f=>JSON.parse(await bytes(f)),sha=b=>createHash('sha256').update(b).digest('hex');
  const old=await read('whole-work-scope-plan-40.json'),held=old.heldSourceDecisions[0],r=plan.resolution;
  ensure(plan.reconciliationBinding.file==='whole-work-scope-plan-40.json'&&plan.reconciliationBinding.sha256===sha(await bytes(plan.reconciliationBinding.file))&&plan.reconciliationBinding.groups===39&&old.reconciliationBindings.length===39,'prior complete reconciliation bound');
  ensure(r.priorHoldFile===plan.reconciliationBinding.file&&r.priorHoldSha256===plan.reconciliationBinding.sha256&&r.unit===held.unit&&r.start===held.start&&r.end===held.end&&r.text===held.text&&r.context===held.context&&r.contextSha256===hash(r.context)&&eq(r.priorAlternatives,held.alternatives)&&r.route===take&&r.surfaceFormId===surface&&r.identity===`${surface}:${take}`&&r.status==='resolved_editorial_inference_offline_unapplied'&&r.reviewNote.length>100,'one exact previously held occurrence resolved');
  ensure(eq(r.surroundingSources.map(u=>u.unit),[211,212,213,214,215]),'full recovery and subsequent thought units');
  for(const u of r.surroundingSources)ensure(unitPlan.units[u.unit-1].text===u.context&&hash(u.context)===u.contextSha256,'exact surrounding source');
  ensure(plan.lexicalEvidence.length===5&&plan.lexicalEvidence.some(e=>e.url==='https://www.dictionnaire-academie.fr/article/A4R0975')&&plan.lexicalEvidence.some(e=>e.url==='https://fr.wikisource.org/wiki/Microm%C3%A9gas/Texte_entier')&&plan.lexicalEvidence.every(e=>e.paraphrase.length>50),'primary source and contradictory translation evidence');
  ensure(eq(plan.publicationBaseline,{bundleSha256:hash(p.bundle),quizzesSha256:hash([...p.preparedQuizzes.values()]),expressionCatalogSha256:hash(p.expressionCatalog)}),'publication and questions unchanged');
  const routes=plan.candidate.flatMap(u=>u.tokens.map(t=>({unit:u.unit,start:t.start,end:t.end,route:t.route})));
  ensure(eq(routes.map(t=>t.unit),[30,138,198,204,213])&&routes.every(t=>t.route===(t.unit===213?take:speech))&&routes.at(-1).start===10&&routes.at(-1).end===16,'all five candidate uses with only one route change');
  ensure(plan.impacts.length===1&&plan.impacts[0].file==='whole-work-impact-scope-19-1.json'&&plan.published.length===1&&plan.published[0].reviewedBands===3&&plan.historical.length===6,'all current and inactive dependencies');
  ensure(plan.senseChanges.length===1&&plan.senseChanges[0].id===take&&plan.senseChanges[0].after.gloss==='to take up again; take back'&&plan.senseChanges[0].after.definition.includes('condition de rachat')&&plan.senseChanges[0].after.definition.includes('personne'),'same owner covers both physical and merchant return');
  ensure(plan.candidateBindings.length===1&&plan.candidateBindings[0].identityTarget===take&&plan.candidateBindings[0].sourceOccurrences.length===1&&plan.candidateBindings[0].sourceOccurrences[0].unit===213&&plan.candidateBindings[0].after.questions[1].context.includes('___')&&!plan.candidateBindings[0].after.questions[1].context.includes('main')&&plan.candidateBindings[0].after.questions[2].choices.every(c=>plan.candidateBindings[0].after.questions[2].context.includes(c)),'source-bound question correction');
  ensure(['wordChanges','priorBindings','newWordBanks','newExpressions','phraseComponents','candidatePhraseComponents','legacyComponentBanks'].every(k=>plan[k].length===0),'no unrelated change');
  summary.resolvedEditorialUses=1;summary.previousReconciliationGroups=39;summary.heldEditorialUses=0;summary.appliedScopePlans=0;summary.candidateReleaseReady=false;
 }});
}
