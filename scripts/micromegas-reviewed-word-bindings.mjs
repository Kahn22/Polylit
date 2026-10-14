import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {reviewedWordGapBanks} from './micromegas-reviewed-word-gap-banks.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const coordinate=o=>`${o.unit}:${o.start}:${o.end}`;
const stableId=(prefix,seed)=>`${prefix}_micromegas_${sha(seed).slice(0,16)}`;

/** Bind reviewed word owners in isolation, retaining every old identity. */
export function composeMicromegasReviewedWords(folder){
 const evidence={},cache=new Map();
 const ensure=(ok,message)=>{if(!ok)throw Error(`Micromégas reviewed word bindings: ${message}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const composition=read('whole-work-import-composition-42.json');
 const p=loadPublication();
 ensure(hash(p.bundle)===composition.publicationBaseline.bundleSha256&&hash(p.expressionCatalog)===composition.publicationBaseline.expressionCatalogSha256&&hash([...p.preparedQuizzes.values()])===composition.publicationBaseline.quizzesSha256,'exact unchanged publication baseline');
 const lemmas=new Map(p.bundle.lemmas.map(l=>[l.id,l])),senses=new Map(p.bundle.senses.map(s=>[s.id,s])),surfaces=new Map(p.bundle.surfaceForms.map(s=>[s.id,s]));
 const frenchLemmas=new Set(p.sharedSources.fr.legacy.content.lemmas.map(l=>l.id));
 const newLemmas=new Map(),newSenses=new Map(),newSurfaces=new Map(),planned=new Map();
 const ref=(file,selector)=>({file,selector});
 const plan=n=>read(`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`);
 const lemma=(id,headword,partOfSpeech,e)=>{
  if(lemmas.has(id)){ensure(frenchLemmas.has(id),'French lemma owner');return id;}
  ensure(headword&&partOfSpeech,`declared proper lemma metadata ${id}`);
  const actual=stableId('lem',`${headword}:${partOfSpeech}`),record={id:actual,headword,partOfSpeech};
  if(newLemmas.has(actual))ensure(hash(newLemmas.get(actual).record)===hash(record),`planned lemma collision ${id}`);
  else newLemmas.set(actual,{record,evidence:e});return actual;
 };
 const addSense=(target,spec,e)=>{
  const lemmaId=lemma(spec.lemmaId,spec.headword,spec.partOfSpeech,e),senseId=stableId('sns',target);
  const record={id:senseId,lemmaId,gloss:spec.gloss??spec.meaning,definition:spec.definition};
  ensure(record.gloss&&record.definition,`declared sense definition ${target}`);
  ensure(!planned.has(target),`duplicate planned sense declaration ${target}`);planned.set(target,senseId);newSenses.set(senseId,{target,record,evidence:e});return senseId;
 };
 for(const n of[11,13,15,16,17,18,20,25,32,37]){
  const d=plan(n),file=`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`;
  for(const[index,s]of d.plannedSenseGroups.entries()){
   let owner=(d.plannedLemmas??[]).find(l=>l.id===s.lemmaId);
   owner??=s;
   addSense(s.plannedTarget??s.id,{...owner,...s},ref(file,`/plannedSenseGroups/${index}`));
  }
 }
 for(const[n,field,chosen,target]of[[6,'nounOwner','petit:small_entity_or_domain','proper_small_noun'],[7,'pronounOwner','aucun:none','proper_pronoun_none'],[7,'pronounOwner','aucun:any','proper_pronoun_any'],[10,'adverbOwner','exclamation','planned_quoi_adverb_exclamation']]){
  const d=plan(n),o=d[field],index=o.senseGroups.findIndex(s=>s.key===chosen);ensure(index>=0,`proper category declaration ${target}`);
  addSense(target,{...o,...o.senseGroups[index],lemmaId:`planned_${o.headword}_${o.partOfSpeech}`},ref(`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`,`/${field}/senseGroups/${index}`));
 }
 const lengthBank=plan(4).candidateBindings.find(b=>b.key==='pieds_length_measure');
 addSense('historical_length_unit',{lemmaId:'lem_parure_pied_noun_932ec5db4e',gloss:lengthBank.after.meaning,definition:'Ancienne unité de longueur appelée pied.'},ref('whole-work-scope-plan-04.json','/candidateBindings/0'));
 const existingAliases={
  existing_figurative_power:'sns_zola_main_control',existing_generic_anatomical_hand:'sns_parure_main_body_part_bdc9fe7397',existing_generic_punishment:'sns_zola_punir_past',existing_generic_purity:'sns_loup_agneau_pur_qui_n_est_ni_souille_ni_melange_ici_en_parlant_de_l_eau_58fdd88fd2',existing_impersonal_existence:'sns_fr_avoir_existential',existing_recent_past:'sns_fr_venir_recent_past',existing_time_arrival:'sns_fr_venir_arrival_time',generic_anatomical_foot:'sns_parure_pied_partie_du_corps_humain_situee_a_l_extremite_des_jambes_229cd337b6',generic_physical_cover:'sns_parure_couvrir_cover_42fc6b6b2a',neutral_everything_pronoun:'sns_fr_tout_everything',ordinary_degree_adverb:'sns_fr_tout_intensifying',plural_group_pronoun:'sns_fr_toutes_all_of_them',
 };
 const baseIdentity=t=>t.owner.baseOwner?.identity;
 const senseTarget=t=>{
  const target=t.owner.senseTarget;
  if(target==='existing_determiner_none')return baseIdentity(t)?.split(':')[1]??'sns_zola_aucun_none';
  return target.startsWith('sns_')?target:planned.get(target)??existingAliases[target];
 };
 const actualSense=id=>senses.get(id)??newSenses.get(id)?.record;
 const binding=(t,senseId)=>{
  const sense=actualSense(senseId);ensure(sense,`known final sense ${t.owner.senseTarget}: ${coordinate(t)}`);
  const lemmaId=sense.lemmaId;ensure(frenchLemmas.has(lemmaId)||newLemmas.has(lemmaId),'French or reviewed new lemma');
  const old=baseIdentity(t)?.split(':')[0];let surface=surfaces.get(old);
  if(surface?.lemmaId!==lemmaId||surface.normalized!==t.form)surface=null;
  const matching=p.bundle.surfaceForms.filter(s=>s.lemmaId===lemmaId&&s.normalized===t.form);
  if(!surface){
   const active=matching.filter(s=>[...p.preparedQuizzes.values()].some(q=>q.subject?.kind==='vocabulary'&&q.subject.surfaceFormId===s.id&&q.subject.senseId===senseId));
   ensure(active.length<=1,`ambiguous existing reviewed identity ${t.form}:${senseId}`);
   if(active.length===1)surface=active[0];else{ensure(matching.length<=1,`ambiguous proper surface owner ${t.form}:${lemmaId}`);surface=matching[0];}
  }
  if(!surface){const id=stableId('srf',`${lemmaId}:${t.form}`);surface={id,lemmaId,form:t.form,normalized:t.form};newSurfaces.set(id,{record:surface,evidence:t.overlays.at(-1).evidence});}
  const identity=`${surface.id}:${senseId}`,isPublished=[...p.preparedQuizzes.values()].some(q=>q.subject?.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);
  return {unit:t.unit,start:t.start,end:t.end,text:t.text,form:t.form,route:t.owner.senseTarget,identity,surfaceFormId:surface.id,senseId,lemmaId,baseOwner:t.owner.baseOwner,evidence:t.overlays.at(-1).evidence,masteryAction:isPublished?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view',legacyIdentity:baseIdentity(t)??null};
 };
 const surfaceCorrections=[];
 const ledger=read('whole-work-review-ledger-01.json'),chapterFive=read('chapter-05-identity-plan.json');
 const feeling=chapterFive.items.find(i=>i.key==='sentir_chapter_05_held_01_127');
 const pleasure=composition.tokens.find(t=>coordinate(t)==='127:13:19');
 const reviewedUnit=ledger.candidateSourceReview.find(u=>u.unit===127),reviewedToken=reviewedUnit.tokens.find(t=>t.start===13&&t.end===19);
 ensure(pleasure.text==='sentit'&&reviewedToken.decision==='reuse_experienced_feeling_sentit_after_historical_bank_repair'&&feeling.existingIdentity,'explicit exact-surface feeling correction');
 const corrected={...pleasure,owner:{kind:'reviewed_sense_route',senseTarget:feeling.targetSenseId,baseOwner:pleasure.owner},overlays:[...pleasure.overlays,{evidence:ref('chapter-05-identity-plan.json',`/items/${chapterFive.items.indexOf(feeling)}`)}]};
 surfaceCorrections.push({unit:127,start:13,end:19,text:'sentit',beforeIdentity:pleasure.owner.identity,afterIdentity:feeling.existingIdentity,reason:'The source contains sentit, not sentoit. The reviewed pleasure decision retains the existing experienced-feeling sense on the exact published sentit surface; no sentoit mastery is copied.',evidence:[ref('whole-work-review-ledger-01.json',`/candidateSourceReview/${ledger.candidateSourceReview.indexOf(reviewedUnit)}/tokens/${reviewedUnit.tokens.indexOf(reviewedToken)}`),corrected.overlays.at(-1).evidence]});
 const bound=[...composition.tokens.filter(t=>t.owner.kind==='reviewed_sense_route').map(t=>binding(t,senseTarget(t))),binding(corrected,feeling.targetSenseId)];
 ensure(bound.at(-1).identity===feeling.existingIdentity,'exact reviewed feeling surface identity');
 const groups=new Map();
 for(const o of bound){if(!groups.has(o.identity))groups.set(o.identity,{identity:o.identity,surfaceFormId:o.surfaceFormId,senseId:o.senseId,lemmaId:o.lemmaId,masteryAction:o.masteryAction,occurrences:[]});groups.get(o.identity).occurrences.push({unit:o.unit,start:o.start,end:o.end,text:o.text});}
 const unchanged=composition.tokens.filter(t=>t.owner.kind==='published_identity'&&coordinate(t)!=='127:13:19').map(t=>{
  const[surfaceId,senseId]=t.owner.identity.split(':'),s=surfaces.get(surfaceId),meaning=senses.get(senseId);ensure(s&&meaning&&s.lemmaId===meaning.lemmaId&&s.normalized===t.form,`retained exact identity ${coordinate(t)}`);
  return {unit:t.unit,start:t.start,end:t.end,text:t.text,identity:t.owner.identity};
 });
 const identityGroups=[...groups.values()];
 const units=read('unit-plan.json').units;
 const newBanks=reviewedWordGapBanks.map((b,index)=>{
  const owners=bound.filter(o=>o.form===b.form&&o.senseId===b.senseId);ensure(owners.length>0&&owners.some(o=>o.unit===b.firstUnit),`declared missing bank source ${b.form}`);
  const sourceOccurrences=owners.map(o=>({unit:o.unit,start:o.start,end:o.end,text:o.text,context:units[o.unit-1].text}));
  const questions=[{band:'1-3',context:units[b.firstUnit-1].text,targetText:b.form,question:'What does the highlighted word mean here?',...b.early},{band:'4-5',question:'Complétez la phrase.',...b.middle},{band:'6-8',question:'Quel mot convient ?',...b.upper}];
  for(const q of questions)ensure(q.choices.length===4&&new Set(q.choices).size===4&&q.choices.includes(q.answer),`four distinct stored choices ${b.form}`);
  return {identity:owners[0].identity,form:b.form,senseId:b.senseId,sourceOccurrences,questions,questionSha256:hash(questions),reviewNote:b.reviewNote,evidence:ref('scripts/micromegas-reviewed-word-gap-banks.mjs',`/reviewedWordGapBanks/${index}`)};
 });
 const bankDependencies=identityGroups.map(g=>{
  const owners=bound.filter(o=>o.identity===g.identity),candidates=[];
  const current=[...p.preparedQuizzes.values()].filter(q=>q.subject?.kind==='vocabulary'&&q.subject.surfaceFormId===g.surfaceFormId&&q.subject.senseId===g.senseId);
  if(current.length){ensure(current.length===3&&new Set(current.map(q=>q.band)).size===3,`complete existing identity bank ${g.identity}`);candidates.push({kind:'existing_prepared_bank',questionIds:current.map(q=>q.id),questionSha256:hash(current),requiresReviewedOverlays:true});}
  const seen=new Set();
  for(const o of owners)if(o.baseOwner.kind==='draft_bank'){
   const b=o.baseOwner,k=`${b.file}:${b.key}`;if(seen.has(k))continue;seen.add(k);
   const items=read(b.file).items,index=items.findIndex(i=>i.key===b.key),item=items[index];ensure(hash(item.questions)===b.questionSha256,'exact original contextual bank');
   const overlay=composition.bankBindings.find(a=>a.file===b.file&&a.key===b.key);
   candidates.push({kind:'contextual_draft_bank',evidence:ref(b.file,`/items/${index}`),key:b.key,questionSha256:b.questionSha256,reviewedOverlay:overlay??null});
  }
  for(let n=3;n<=41;n++){
   if(n===40)continue;const d=plan(n),file=`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`;
   for(const[index,b]of(d.newWordBanks??[]).entries())if(b.form===owners[0].form&&(b.sourceOccurrences??[]).some(a=>owners.some(o=>a.unit===o.unit&&a.start===o.start&&a.end===o.end)))candidates.push({kind:'reviewed_scope_bank',evidence:ref(file,`/newWordBanks/${index}`),questionSha256:hash(b.questions)});
  }
  const authored=newBanks.find(b=>b.identity===g.identity);if(authored)candidates.push({kind:'new_missing_surface_bank',index:newBanks.indexOf(authored),questionSha256:authored.questionSha256});
  if(owners.some(o=>o.unit===127&&o.start===13)){
   const items=read(feeling.batchFile).items,index=items.findIndex(i=>i.key===feeling.key);
   candidates.push({kind:'reviewed_historical_bank_replacement',evidence:ref(feeling.batchFile,`/items/${index}`),questionSha256:hash(items[index].questions),authority:'whole-work-review-ledger-01.json:historicalQuestionReview'});
  }
  ensure(candidates.length>0,`stored bank coverage ${g.identity}`);
  return {identity:g.identity,candidates,status:'canonical_selection_and_question_subject_binding_pending'};
 });
 const summary={reviewedSourceUses:bound.length,reviewedIdentityGroups:identityGroups.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,freshIdentityGroups:identityGroups.filter(g=>g.masteryAction==='fresh_identity_on_exact_unit_view').length,unchangedPublishedSourceUses:unchanged.length,exactSurfaceCorrections:surfaceCorrections.length,newProperLemmas:newLemmas.size,newSenses:newSenses.size,newSurfaceForms:newSurfaces.size,bankCoveredIdentityGroups:bankDependencies.length,newMissingSurfaceBanks:newBanks.length,newMissingSurfaceQuestionBands:newBanks.length*3,pendingDirectDraftSourceUses:composition.summary.ownerCounts.draft_bank,pendingPhraseSpans:composition.summary.phraseSpans};
 return {version:1,workId:composition.workId,status:'offline_reviewed_word_identity_bindings_unapplied',sourceSha256:composition.sourceSha256,publicationBaseline:composition.publicationBaseline,evidenceSha256:evidence,masteryPolicy:'Retain every legacy record and existing identity progress. Fresh Surface+Sense keys encounter at Level1 solely when their exact thought unit is viewed. No progress copy, reset, bulk encounter or approval.',newLemmas:[...newLemmas.values()],newSenses:[...newSenses.values()],newSurfaceForms:[...newSurfaces.values()],identityGroups,occurrenceBindings:bound,unchangedPublishedBindings:unchanged,surfaceCorrections,newBanks,bankDependencies,summary};
}
