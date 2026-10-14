import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {prepareQuiz,quizEditorialIssues,targetCandidates} from '../dist/publication/quiz-authoring.js';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));

/** Materialize one stored bank per reviewed word identity; do not publish it. */
export function composeMicromegasReviewedWordBanks(folder,bindings){
 const evidence={},cache=new Map();
 const ensure=(ok,message)=>{if(!ok)throw Error(`Micromégas canonical reviewed banks: ${message}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const pointer=(e)=>e.selector.split('/').slice(1).reduce((value,key)=>value[key],read(e.file));
 const p=loadPublication(),units=read('unit-plan.json').units,changes=new Map();
 for(let n=3;n<=41;n++){
  if(n===40)continue;const file=`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`,d=read(file);
  for(const[index,c]of(d.wordChanges??[]).entries()){
   const current=p.preparedQuizzes.get(c.id);ensure(current&&hash(current)===c.beforeSha256&&hash(c.after)===c.afterSha256,`exact published question revision ${c.id}`);
   if(changes.has(c.id))ensure(hash(changes.get(c.id).after)===hash(c.after),`conflicting word question changes ${c.id}`);
   changes.set(c.id,{...c,evidence:{file,selector:`/wordChanges/${index}`}});
  }
 }
 const multipleDraftSelections={fit:'fit_composed_song',font:'faire_chapter_05_held_01_123',pense:'pense_think',communiquer:'communiquer_chapter_06_133_258'};
 const records=bindings.identityGroups.map(g=>{
  const dependency=bindings.bankDependencies.find(d=>d.identity===g.identity),owners=bindings.occurrenceBindings.filter(o=>o.identity===g.identity),form=owners[0].form;
  const byKind=kind=>dependency.candidates.filter(c=>c.kind===kind);
  const indexed=p.bundle.occurrences.some(o=>o.surfaceFormId===g.surfaceFormId&&o.senseId===g.senseId);
  const existingCandidate=byKind('existing_prepared_bank')[0];
  const existingSafe=indexed&&existingCandidate?.questionIds.every(id=>quizEditorialIssues(changes.get(id)?.after??p.preparedQuizzes.get(id)).length===0);
  let chosen=byKind('new_missing_surface_bank')[0]??byKind('reviewed_historical_bank_replacement')[0]??(existingSafe?existingCandidate:null)??byKind('reviewed_scope_bank')[0];
  if(!chosen){const drafts=byKind('contextual_draft_bank');if(drafts.length>1){ensure(multipleDraftSelections[form],`editorial duplicate-bank choice required ${g.identity}`);chosen=drafts.find(d=>d.key===multipleDraftSelections[form]);ensure(chosen,`named duplicate-bank selection ${form}`);}else chosen=drafts[0];}
  ensure(chosen,`one selected stored bank ${g.identity}`);
  let questions,sourceQuestions=null,overlays=[];
  const existing=byKind('existing_prepared_bank')[0];
  if(chosen.kind==='existing_prepared_bank'){
   questions=chosen.questionIds.map(id=>{const before=p.preparedQuizzes.get(id),change=changes.get(id);if(change){ensure(change.after.subject.surfaceFormId===g.surfaceFormId&&change.after.subject.senseId===g.senseId,'retained exact question subject');overlays.push({questionId:id,beforeSha256:hash(before),afterSha256:hash(change.after),evidence:change.evidence});return change.after;}return before;});
  }else{
   let bank;
   if(chosen.kind==='new_missing_surface_bank')bank=bindings.newBanks[chosen.index];
   else{bank=pointer(chosen.evidence);if(chosen.kind==='contextual_draft_bank'&&chosen.reviewedOverlay){const overlay=pointer(chosen.reviewedOverlay.evidence);ensure(hash(bank.questions)===chosen.reviewedOverlay.beforeQuestionSha256&&hash(overlay.after.questions)===chosen.reviewedOverlay.afterQuestionSha256,'exact contextual question overlay');bank=overlay.after;overlays.push({evidence:chosen.reviewedOverlay.evidence,beforeSha256:chosen.reviewedOverlay.beforeQuestionSha256,afterSha256:chosen.reviewedOverlay.afterQuestionSha256});}}
   sourceQuestions=bank.questions;ensure(sourceQuestions?.length===3,'three selected source bands');
   questions=sourceQuestions.map(q=>{
    const band={'1-3':'levels_1_3','4-5':'levels_4_5','6-8':'levels_6_8'}[q.band];ensure(band,`known stored source band ${g.identity}`);
    const existingId=existing?.questionIds.find(id=>p.preparedQuizzes.get(id).band===band),id=existingId??`qiz_micromegas_${sha(g.identity).slice(0,16)}_${band}`;
    const common={id,surfaceFormId:g.surfaceFormId,senseId:g.senseId,contextFrench:q.context,correctAnswer:q.answer,band};
    const legacy=q.band==='1-3'?{...common,format:'meaning_choice',targetText:q.targetText??form,prompt:'Meaning',choicesEnglish:q.choices}:q.band==='4-5'?{...common,format:'surface_completion',choicesFrench:q.choices}:{...common,format:'target_identification',promptFrench:q.question??'Quel mot convient ?',choicesFrench:q.choices};
    let prepared=prepareQuiz(legacy,'fr');
    if(q.band==='1-3'&&!prepared.targetRange){
     // Select an enumerated source occurrence, never the first substring match.
     const exact=owners.filter(o=>units[o.unit-1].text===q.context&&targetCandidates(q.context,legacy.targetText,'fr').some(r=>r.start===o.start&&r.end===o.end));
     ensure(exact.length>0,`explicit highlighted source target required ${g.identity} form=${form} context=${q.context}`);
     const selected=exact.toSorted((a,b)=>a.unit-b.unit||a.start-b.start)[0];prepared={...prepared,targetRange:{start:selected.start,end:selected.end}};
     overlays.push({kind:'explicit_earliest_indexed_owned_source_target',band,unit:selected.unit,start:selected.start,end:selected.end,reason:'This exact enumerated source use belongs to the selected Surface+Sense; all other uses and owners remain unchanged.'});
    }
    return prepared;
   });
  }
  ensure(new Set(questions.map(q=>q.band)).size===3&&questions.every(q=>q.subject.surfaceFormId===g.surfaceFormId&&q.subject.senseId===g.senseId),'one bank per exact Surface+Sense');
  for(const q of questions)ensure(quizEditorialIssues(q).length===0,`prepared bank gate ${g.identity}/${q.band}: ${quizEditorialIssues(q)}`);
  return {identity:g.identity,chosen,selectionReason:chosen.kind==='existing_prepared_bank'?'Retain the existing identity bank and apply only its exact-revision reviewed question changes. Contextual drafts remain evidence.':chosen.kind==='reviewed_historical_bank_replacement'?'The earlier ledger explicitly selects the reviewed unit127 pleasure bank for the exact historical sentit identity; preserve its existing question IDs.':chosen.kind==='new_missing_surface_bank'?'No complete bank exists for this exact form and reviewed sense; store the newly authored three-band bank and preserve all legacy records.':chosen.kind==='reviewed_scope_bank'?'Use the explicitly reviewed scope bank for this exact corrected category or added surface.':dependency.candidates.filter(c=>c.kind==='contextual_draft_bank').length>1?'The named earliest source bank already tests the shared generic meaning; retain the other source bank as contextual evidence, without a duplicate mastery or quiz slot.':'Use the reviewed contextual bank, including its explicit later question overlay, under the final exact form-and-sense subject.',masteryAction:g.masteryAction,alternateCandidates:dependency.candidates.filter(c=>c!==chosen),overlays,sourceQuestionSha256:sourceQuestions?hash(sourceQuestions):null,questions,questionSha256:hash(questions),status:'offline_stored_candidate_bank_not_release_approval'};
 });
 const summary={identityBanks:records.length,storedPreparedQuestionBands:records.length*3,reusedIdentityBanks:records.filter(r=>r.masteryAction==='retain_existing_identity_progress').length,freshIdentityBanks:records.filter(r=>r.masteryAction==='fresh_identity_on_exact_unit_view').length,preservedExistingBankSelections:records.filter(r=>r.chosen.kind==='existing_prepared_bank').length,reviewedHistoricalBankReplacements:records.filter(r=>r.chosen.kind==='reviewed_historical_bank_replacement').length,newMissingSurfaceBanks:records.filter(r=>r.chosen.kind==='new_missing_surface_bank').length,reviewedScopeBankSelections:records.filter(r=>r.chosen.kind==='reviewed_scope_bank').length,contextualBankSelections:records.filter(r=>r.chosen.kind==='contextual_draft_bank').length,appliedStoredQuestionOverlays:records.reduce((n,r)=>n+r.overlays.filter(o=>o.kind!=='explicit_earliest_indexed_owned_source_target').length,0),explicitIndexedTargetSelections:records.reduce((n,r)=>n+r.overlays.filter(o=>o.kind==='explicit_earliest_indexed_owned_source_target').length,0),preservedAlternateBanks:records.reduce((n,r)=>n+r.alternateCandidates.length,0)};
 return {version:1,workId:bindings.workId,status:'offline_reviewed_word_canonical_banks_unapplied',wordBindingsSha256:hash(bindings),publicationBaseline:bindings.publicationBaseline,evidenceSha256:evidence,policy:'Exactly three stored prepared questions per bound word identity. Keep all predecessor banks and existing mastery. Reviewed changes and exact subject bindings are staged only; no approval or learner-runtime generation.',banks:records,summary};
}
