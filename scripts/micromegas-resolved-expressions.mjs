import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {prepareQuiz,quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
import {validateExpressionCatalog} from '../dist/domain/expression-content.js';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x));
const id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`;
const coord=o=>`${o.unit}:${o.start}:${o.end}`;
const specs=[
 {unit:3,start:62,end:74,text:'sur-le-champ',headword:'sur-le-champ',gloss:'immediately; without delay',definition:'Immédiatement, sans attendre.',rawKey:'sur_le_champ_immediately',source:'https://www.dictionnaire-academie.fr/article/A3C0605',questions:[
  {band:'1-3',context:'À cette nouvelle, il prend sur-le-champ sa plume, sans attendre.',answer:'immediately',choices:['immediately','later','reluctantly','secretly']},
  {band:'4-5',context:'Il agit immédiatement, sans aucun délai : il prend ___ sa plume.',answer:'sur-le-champ',choices:['sur-le-champ','le lendemain','à contrecœur','en secret']},
  {band:'6-8',context:'Sur-le-champ signifie immédiatement. Le lendemain situe l’action au jour suivant, à contrecœur marque la réticence et en secret la discrétion.',question:'Quelle expression indique une action sans délai ?',answer:'sur-le-champ',choices:['sur-le-champ','le lendemain','à contrecœur','en secret']},
 ]},
 {unit:10,start:84,end:96,text:'en se jouant',headword:'en se jouant',gloss:'effortlessly; with ease',definition:'Sans difficulté, avec une grande facilité.',rawKey:'jouant_effortlessly',source:'https://www.dictionnaire-academie.fr/article/A3J0107',questions:[
  {band:'1-3',context:'Il résout ce problème en se jouant, avec une facilité remarquable.',answer:'effortlessly',choices:['effortlessly','with difficulty','hesitantly','fearfully']},
  {band:'4-5',context:'Il réussit avec une facilité remarquable, sans aucun effort : il résout le problème ___.',answer:'en se jouant',choices:['en se jouant','à grand-peine','en hésitant','en tremblant']},
  {band:'6-8',context:'En se jouant signifie sans difficulté. À grand-peine indique de grandes difficultés, en hésitant le manque de décision et en tremblant la peur ou un tremblement.',question:'Quelle expression souligne une grande facilité ?',answer:'en se jouant',choices:['en se jouant','à grand-peine','en hésitant','en tremblant']},
 ]},
 {unit:11,start:36,end:48,text:'au sortir de',headword:'au sortir de',gloss:'upon leaving; at the end of',definition:'Au moment de quitter un lieu ou d’atteindre le terme d’une période.',rawKey:'sortir_leaving_childhood',reuse:'exi_lion_rat_au_sortir_des_forets_971cce2bcd',source:'https://www.dictionnaire-academie.fr/article/A9S2179',questions:[
  {band:'1-3',context:'Au sortir de l’enfance, il commence cette étude, quand cette période se termine.',answer:'at the end of',choices:['at the end of','at the beginning of','in the middle of','long before']},
  {band:'4-5',context:'Cette étude commence au moment où l’enfance se termine : il l’entreprend ___ l’enfance.',answer:'au sortir de',choices:['au sortir de','au début de','au milieu de','bien avant']},
  {band:'6-8',context:'Au sortir de situe l’action au moment de quitter un lieu ou de terminer une période. Au début de indique le commencement, au milieu de une position centrale et bien avant une époque antérieure.',question:'Quelle expression indique ici le terme de la période ?',answer:'au sortir de',choices:['au sortir de','au début de','au milieu de','bien avant']},
 ]},
];
export function composeMicromegasResolvedExpressions(folder){
 const evidence={},read=f=>{const bytes=readFileSync(`${folder}/${f}`);evidence[f]=sha(bytes);return JSON.parse(bytes);};
 const composed=read('whole-work-import-composition-42.json'),graph=read('whole-work-identity-dependencies-43.json'),words=read('whole-work-resolved-word-package-47.json'),units=read('unit-plan.json').units,p=loadPublication();
 const ensure=(ok,msg)=>{if(!ok)throw Error(`Micromégas expression48: ${msg}`);};
 ensure(hash(p.expressionCatalog)===graph.publicationBaseline.expressionCatalogSha256,'unchanged expression baseline');
 const newIdentities=[],identityChanges=[],occurrences=[],banks=[],componentBindings=[],legacyImpact=[];
 for(const s of specs){
  ensure(units[s.unit-1].text.slice(s.start,s.end)===s.text,'exact full source boundary');
  ensure(!composed.phrases.some(o=>o.unit===s.unit&&o.start<s.end&&s.start<o.end),'no existing phrase overlap');
  const identityId=s.reuse??id('exi',s.headword),surfaceId=id('exs',`${identityId}:${s.text}`),record={id:identityId,headword:s.headword,gloss:s.gloss,definition:s.definition};
  if(s.reuse){
   const before=p.expressionCatalog.identities.find(x=>x.id===identityId),oldOccurrences=p.expressionCatalog.occurrences.filter(x=>x.identityId===identityId),oldQuizzes=p.expressionCatalog.preparedQuizzes.filter(x=>x.expressionId===identityId);
   ensure(before&&oldOccurrences.length===1&&oldQuizzes.length===3,'exact fully reviewed legacy expression impact');
   legacyImpact.push({identityId,before,occurrences:oldOccurrences,quizzes:oldQuizzes,sha256:hash({before,occurrences:oldOccurrences,quizzes:oldQuizzes}),decision:'The forest complement instantiates the same generic exit construction. Retain the old forest source, all three questions and the unsurfaced legacy mastery key unchanged. New au sortir de surface has its own fresh Surface+Expression key; no old progress is copied.'});
   identityChanges.push({before,beforeSha256:hash(before),after:record,afterSha256:hash(record),status:'offline_metadata_generalization_unapplied',source:s.source});
  }else{ensure(!p.expressionCatalog.identities.some(x=>x.headword===s.headword),'new expression head absent');newIdentities.push({record,source:s.source});}
  const sourceSpans=s.text==='sur-le-champ'?[s,{unit:138,start:362,end:374,text:s.text}]:[s];
  for(const span of sourceSpans){
   ensure(units[span.unit-1].text.slice(span.start,span.end)===s.text,'each exact full expression source boundary');
   ensure(!composed.phrases.some(o=>o.unit===span.unit&&o.start<span.end&&span.start<o.end),'each expression span avoids prior phrase owners');
   const occurrence={id:id('exo',`${span.unit}:${span.start}:${span.end}:${identityId}`),identityId,surfaceId,workId:graph.workId,unitId:`unt_micromegas_${String(span.unit).padStart(3,'0')}`,start:span.start,end:span.end,text:s.text};occurrences.push(occurrence);
   const components=composed.tokens.filter(t=>t.unit===span.unit&&t.start>=span.start&&t.end<=span.end);ensure(components.length>0,'exact lexical components');
   for(const t of components){ensure(!words.occurrenceBindings.some(o=>coord(o)===coord(t)),'no duplicate prepared word binding');ensure(['draft_bank','published_identity'].includes(t.owner.kind),'declared component base owner');componentBindings.push({unit:t.unit,start:t.start,end:t.end,text:t.text,form:t.form,baseOwner:t.owner,expressionOccurrenceId:occurrence.id,expressionId:identityId,surfaceId,identity:`${surfaceId}:${identityId}`,masteryAction:'fresh_identity_on_exact_unit_view',componentAction:'suppress_only_this_source_use_in_candidate_preserve_all_legacy_mastery'});}
  }
  const g=graph.directDraftBankGroups.find(g=>g.banks.some(b=>b.key===s.rawKey));ensure(g&&g.occurrences.length===sourceSpans.length,'exact held draft construction');
  const original=g.banks.find(b=>b.key===s.rawKey),originalBank=original.selector.split('/').slice(1).reduce((v,k)=>v[k],read(original.file));ensure(hash(originalBank.questions)===original.questionSha256,'original bank retained exact revision');
  const legacy=s.questions.map(q=>{const common={id:id('exq',`${surfaceId}:${q.band}`),expressionId:identityId,surfaceId,contextFrench:q.context,correctAnswer:q.answer,band:{'1-3':'levels_1_3','4-5':'levels_4_5','6-8':'levels_6_8'}[q.band]};return q.band==='1-3'?{...common,format:'meaning_choice',targetText:s.text,choicesEnglish:q.choices}:q.band==='4-5'?{...common,format:'surface_completion',choicesFrench:q.choices}:{...common,format:'target_identification',promptFrench:q.question,choicesFrench:q.choices};});
  const questions=legacy.map(q=>prepareQuiz(q,'fr'));ensure(questions.every(q=>quizEditorialIssues(q).length===0),'prepared expression question gate');
  banks.push({identity:`${surfaceId}:${identityId}`,expressionId:identityId,surfaceId,originalSourceBank:original,sourceQuestions:s.questions,sourceQuestionSha256:hash(s.questions),legacyPreparedQuizzes:legacy,questions,questionSha256:hash(questions),masteryAction:'fresh_identity_on_exact_unit_view',status:'offline_stored_expression_bank_unapplied'});
 }
 ensure(componentBindings.length===8&&componentBindings.filter(o=>o.baseOwner.kind==='draft_bank').length===4,'eight exact components, four held draft uses');
 const replaced=new Map(identityChanges.map(x=>[x.after.id,x.after]));
 const catalog={identities:[...p.expressionCatalog.identities.map(i=>replaced.get(i.id)??i),...newIdentities.map(i=>i.record)],occurrences:[...p.expressionCatalog.occurrences,...occurrences],preparedQuizzes:[...p.expressionCatalog.preparedQuizzes,...banks.flatMap(b=>b.legacyPreparedQuizzes)]};
 const bundle={...p.bundle,units:[...p.bundle.units,...occurrences.map(o=>({id:o.unitId,workId:graph.workId,french:units[Number(o.unitId.split('_').at(-1))-1].text}))]};
 ensure(validateExpressionCatalog(bundle,catalog).length===0,`full expression catalog gate ${JSON.stringify(validateExpressionCatalog(bundle,catalog))}`);
 const moved=new Set(componentBindings.filter(c=>c.baseOwner.kind==='draft_bank').map(coord)),remaining=words.remainingDirectDraftOccurrences.filter(o=>!moved.has(coord(o)));
 return {version:1,workId:graph.workId,status:'offline_resolved_expressions_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,policy:'Store complete expression banks with exact source boundaries; only eight named component uses are suppressed in the candidate. Retain every published record, legacy question, old key and all predecessor word banks. All three new surface keys start fresh only on exact unit view. No import, learner-state write, work release approval or deployment.',newIdentities,identityChanges,legacyImpact,occurrences,banks,componentBindings,remainingDirectDraftOccurrences:remaining,summary:{boundExpressionSurfaceKeys:banks.length,storedPreparedQuestionBands:banks.length*3,newExpressionMeanings:newIdentities.length,reusedExpressionMeanings:identityChanges.length,expressionSourceSpans:occurrences.length,ownedLexicalComponents:componentBindings.length,reassignedDraftWordUses:moved.size,suppressedExistingWordUses:componentBindings.length-moved.size,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:words.summary.remainingDirectDraftIdentityGroups-specs.length,pendingOriginalPhraseSpans:composed.phrases.length}};
}
