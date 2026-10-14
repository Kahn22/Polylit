import{checkReviewedVerbScope}from'./check-micromegas-scope-review-helpers.mjs';
export async function checkPierreScopeReconciliation(folder,unitPlan){
 const rock='sns_parure_pierre_roche_solide_et_plus_ou_moins_dure_qui_constitue_une_masse_compacte_dans_le_sol_ou_qui_affleure_a_la_surface_20bd83683a';
 return checkReviewedVerbScope(folder,unitPlan,'23','Pierre',new Set(['pierre','pierres']),()=>rock,{reviewKey:'wholeWorkPierreScope',validate({plan,p,ensure,eq}){
  ensure(plan.plannedSenseGroups.length===0&&plan.newWordBanks.length===0&&plan.wordChanges.length===0&&plan.senseChanges.length===1,'same existing rock meaning, no piece-only identity');
  ensure(plan.senseChanges[0].id===rock&&plan.senseChanges[0].after.lemmaId==='lem_parure_pierre_noun_982db9015e'&&plan.senseChanges[0].after.definition==='Matière rocheuse solide et plus ou moins dure, ou fragment de cette matière.','proper unchanged rock owner');
  ensure(p.bundle.lemmas.find(l=>l.id===plan.senseChanges[0].after.lemmaId).partOfSpeech==='noun','proper noun');
  ensure(plan.candidateBindings.length===1&&plan.candidateBindings[0].identityTarget===rock&&eq(plan.candidateBindings[0].before,plan.candidateBindings[0].after)&&eq(plan.candidateBindings[0].after.questions[1].choices,['pierre','plume','feuille','fleur']),'retain three already correct feminine-singular questions');
  ensure(plan.historical.length===3&&plan.candidate.length===1&&plan.candidate[0].unit===201&&plan.candidate[0].tokens.length===1,'all inactive legacy bands retained and one exact rock use');
  ensure(plan.newExpressions.length===0&&plan.phraseComponents.length===0&&plan.candidatePhraseComponents.length===0&&plan.legacyComponentBanks.length===0,'no unrelated expression mutations');
 }});
}
