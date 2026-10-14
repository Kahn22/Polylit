import{readFileSync}from'node:fs';import{createHash}from'node:crypto';
import{composeTransaction72}from'./micromegas-offline-transaction-72.mjs';
import{examples73}from'./micromegas-independent-contexts-73.mjs';
import{targetCandidates,quizEditorialIssues,legacyQuiz}from'../dist/publication/quiz-authoring.js';
import{validateContentBundle}from'../dist/domain/validate.js';
import{validateExpressionCatalog}from'../dist/domain/expression-content.js';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x));
const ensure=(x,m)=>{if(!x)throw Error(`Context73: ${m}`);};
export function composeContextRepairs73(folder,{includeProjection=false}={}){
 const file='whole-work-offline-transaction-72.json',bytes=readFileSync(`${folder}/${file}`),base=JSON.parse(bytes),fresh=composeTransaction72(folder,{includeProjection:true}),{projection,...transaction}=fresh;
 ensure(hash(base)===hash(transaction),'exact recorded transaction');
 const prepared=new Map(projection.preparedQuizzes.map(q=>[q.id,q])),repairs=[];let early=0;
 for(const item of base.repairQueue){
  const before=prepared.get(item.quizId);ensure(hash(before)===item.beforeSha256,'exact prepared question before');
  let after,reason;
  if(item.diagnostics.some(d=>d.code==='quiz.source_reuse')){
   const spec=examples73[early++];ensure(spec&&spec[0]===before.targetText,`source queue order ${early-1}`);
   const candidates=targetCandidates(spec[1],spec[0],before.language);ensure(candidates.length===1||(Number.isInteger(spec[2])&&candidates[spec[2]]),`unique authored target ${early-1}/${spec[0]}: ${JSON.stringify(candidates)}`);
   after={...before,context:spec[1],targetRange:candidates[spec[2]??0]};
   reason='Individually authored independent French example of the unchanged surface and meaning; exact target selected. Answer, alternatives and learner identity preserved.';
  }else{
   ensure(item.diagnostics.length===1&&item.diagnostics[0].code==='quiz.choice_not_in_context'&&before.band==='levels_6_8','explicit advanced presentation repair');
   after={...before,context:`Le lecteur compare les mots ${before.choices.map(c=>`« ${c.text} »`).join(', ')}.`,prompt:before.prompt==='Quel mot convient ?'?before.context:`${before.context} ${before.prompt}`};
   reason='Lossless presentation repair: retain the earlier semantic context in the question prompt and display all four unchanged alternatives in the neutral French context. This is not a new semantic-approval claim.';
  }
  ensure(!quizEditorialIssues(after).length,`prepared question ${before.id}: ${quizEditorialIssues(after)}`);
  ensure(hash(after.subject)===hash(before.subject)&&hash(after.choices)===hash(before.choices)&&after.correctChoiceId===before.correctChoiceId,'unchanged identity and answer');
  prepared.set(after.id,after);repairs.push({id:before.id,identity:item.identity,before,after,beforeSha256:hash(before),afterSha256:hash(after),resolvedDiagnostics:item.diagnostics,reason,publicationApplied:false});
 }
 ensure(early===examples73.length,'all independent examples used');
 projection.bundle.quizItems=projection.bundle.quizItems.map(q=>prepared.has(q.id)?legacyQuiz(prepared.get(q.id)):q);projection.preparedQuizzes=[...prepared.values()];
 const validation=validateContentBundle(projection.bundle),expressions=validateExpressionCatalog(projection.bundle,projection.expressionCatalog);
 ensure(validation.ok,`content domain ${JSON.stringify(validation.diagnostics)}`);ensure(!expressions.length,`expression domain ${JSON.stringify(expressions)}`);
 const result={version:1,workId:base.workId,status:'offline_combined_domain_validation_passed_unapplied',evidenceSha256:{[file]:sha(bytes)},publicationBaseline:base.publicationBaseline,repairs,summary:{independentEarlyContexts:early,advancedPresentationRepairs:repairs.length-early,resolvedDiagnosticCount:base.validation.diagnostics.length,remainingDomainDiagnostics:0,unchangedQuestionIds:repairs.length,unchangedLearnerIdentities:new Set(repairs.map(r=>r.identity)).size},validation:{contentBundle:'passed',expressionCatalog:'passed',structuralValidationIsNotEditorialApproval:true,projectionSha256:{bundle:hash(projection.bundle),expressionCatalog:hash(projection.expressionCatalog),preparedQuizzes:hash(projection.preparedQuizzes)}},nextAction:{stage:'offline_editorial_acceptance_and_import_dry_run',reason:'All recorded source decisions and domain diagnostics are resolved offline. Review the combined import delta and exact-revision editorial acceptance, including historical banks and noun-choice agreement, before any learning-ready approval. Micromégas remains processing and unapplied.'},publicationApplied:false,learnerStateChanged:false,candidateReleaseReady:false};
 return includeProjection?{...result,projection}:result;
}
