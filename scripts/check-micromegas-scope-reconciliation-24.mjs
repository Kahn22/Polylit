import{checkReviewedVerbScope}from'./check-micromegas-scope-review-helpers.mjs';
export async function checkMonsieurScopeReconciliation(folder,unitPlan){
 const title='sns_fr_monsieur_title',singular='sns_monsieur_primary',plural='sns_parure_monsieur_appellation_permettant_de_s_adresser_de_facon_polie_a_un_homme_un_client_un_professeur_un_passant_etc_217dc4c4ee',route=(u,t)=>t.normalized==='m'?title:t.normalized==='messieurs'?plural:singular;
 return checkReviewedVerbScope(folder,unitPlan,'24','Monsieur',new Set(['m','mm','monsieur','messieurs']),route,{reviewKey:'wholeWorkMonsieurScope',validate({plan,p,unitPlan,ensure,eq,hash,summary}){
  ensure(plan.plannedSenseGroups.length===0&&plan.newWordBanks.length===0&&plan.wordChanges.length===1&&plan.senseChanges.length===2&&plan.senseChanges.every(c=>c.after.lemmaId==='lem_monsieur'),'one proper masculine noun, unchanged legacy meanings');
  ensure(eq(plan.wordChanges[0].after.choices.map(c=>c.text),['M','Dr','Pr','Me'])&&!plan.wordChanges[0].after.context.includes('monsieur')&&!plan.wordChanges[0].after.context.includes('___. '),'masculine singular title labels and semantic clue without punctuation shortcut');
  ensure(plan.candidateBindings.length===2&&plan.candidateBindings.every(b=>eq(b.before,b.after)&&b.identityTarget===(b.before.form==='m'?title:plural)),'both earlier banks retained on existing meanings');
  ensure(eq(plan.candidateBindings.find(b=>b.before.form==='messieurs').after.questions[1].choices,['messieurs','animaux','objets','instruments']),'four masculine plural noun alternatives');
  for(const u of plan.candidate)for(const t of u.tokens)if(t.normalized==='m')ensure(u.context[t.end]==='.'&&t.text==='M','exact abbreviated title excludes following period');
  ensure(plan.occurrenceReassignments.length===1,'one exact unnecessary new-sense route override');const o=plan.occurrenceReassignments[0],u=unitPlan.units[o.unit-1];
  ensure(o.unit===116&&o.start===239&&o.end===248&&o.text==='messieurs'&&u.text===o.context&&hash(o.context)===o.contextSha256&&o.context.slice(o.start,o.end)===o.text&&o.beforeRoute==='chapter-05-identity-plan.json:new_sense_existing_lemma'&&o.afterRoute===plural&&o.targetIdentity==='srf_parure_messieurs_lem_monsieur_3a91e2dfec:'+plural&&o.masteryAction==='reuse_only_existing_identity_own_mastery_or_start_on_exact_view_if_unseen'&&o.reason.length>100,'existing correct identity reuses only its own progress');
  ensure(plan.priorBindings.some(b=>b.file==='chapter-05-identity-plan.json'&&b.before.route==='new_sense_existing_lemma'),'immutable old new-sense proposal retained');
  ensure(plan.newExpressions.length===0&&plan.phraseComponents.length===0&&plan.candidatePhraseComponents.length===0&&plan.legacyComponentBanks.length===0,'no unrelated expression mutations');summary.correctedPriorUses=plan.occurrenceReassignments.length;
 }});
}
