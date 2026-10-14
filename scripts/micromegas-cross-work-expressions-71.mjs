import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {prepareQuiz,quizEditorialIssues,legacyQuiz} from '../dist/publication/quiz-authoring.js';
import {validateExpressionCatalog,partitionExpressionTokens} from '../dist/domain/expression-content.js';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';
import {reusedExpressions71,refineQuestions71} from './micromegas-cross-work-decisions-71.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(prefix,seed)=>`${prefix}_micromegas_${sha(seed).slice(0,16)}`;
const ensure=(ok,msg)=>{if(!ok)throw Error(`Cross-work71: ${msg}`);};
const coord=o=>`${o.workId}:${o.unitId}:${o.start}:${o.end}`;
export function composeCrossWork71(folder){
 const evidenceSha256={},read=file=>{const bytes=readFileSync(`${folder}/${file}`);evidenceSha256[file]=sha(bytes);return JSON.parse(bytes);};
 const candidate=read('whole-work-candidate-catalog-70.json'),p=loadPublication();
 ensure(hash(p.bundle)===candidate.publicationBaseline.bundleSha256&&hash(p.expressionCatalog)===candidate.publicationBaseline.expressionCatalogSha256&&hash([...p.preparedQuizzes.values()])===candidate.publicationBaseline.quizzesSha256,'unchanged publication');
 const identities=new Map([...p.expressionCatalog.identities,...candidate.records.expressionIdentities].map(x=>[x.id,x]));
 const newIdentities=[],newSurfaceForms=[],expressionOccurrences=[],wordOccurrences=[],banks=[],sourceTransactions=[],decisions=[],refinements=[],legacySnapshots=[];
 const suppressed=new Set(),replaced=new Set();
 for(const [index,entry] of candidate.crossWorkExpressionQueue.entries()){
  const item=read(entry.file).newExpressions[Number(entry.selector.split('/').at(-1))];ensure(hash(item)===entry.planSha256,'exact source plan');
  const first=entry.sourceOccurrences[0],form=first.text,word=index===22;
  let meaning,surfaceId,identity;
  if(word){
   const sense=candidate.records.senses.find(s=>s.id==='sns_fr_quoy_que_although');ensure(sense?.lemmaId==='lem_fr_quoique_conjunction','retained concession meaning');
   meaning=sense;surfaceId=id('srf',`${sense.lemmaId}:${form.toLowerCase()}`);identity=`${surfaceId}:${sense.id}`;
   newSurfaceForms.push({id:surfaceId,lemmaId:sense.lemmaId,form:form.toLowerCase(),normalized:form.toLowerCase()});
  }else{
   const reuse=reusedExpressions71[index],family=index===12||index===13?'avoir_raison_being_right':item.key??item.senseGroup??entry.headword;
   const meaningId=reuse??id('exi',`cross-work:${family}`);
   meaning=identities.get(meaningId);
   if(!meaning){meaning={id:meaningId,headword:entry.headword,gloss:item.meaning??item.questions[0].answer,definition:item.definition??(index===15?'Introduit la conséquence ou le résultat de ce qui précède.':null)};ensure(meaning.definition,'generic meaning definition');identities.set(meaningId,meaning);newIdentities.push({record:meaning,...item.meaningSourceSenseId?{meaningSourceSenseId:item.meaningSourceSenseId,newLexicalMeaning:false}:{newLexicalMeaning:true}});}
   surfaceId=id('exs',`${meaning.id}:${form.toLowerCase()}`);identity=`${surfaceId}:${meaning.id}`;
  }
  const questions=refineQuestions71(index,item,form),prepared=questions.map(q=>{
   const band={'1-3':'levels_1_3','4-5':'levels_4_5','6-8':'levels_6_8'}[q.band],common={id:id(word?'qiz':'exq',`${identity}:${band}`),...(word?{surfaceFormId:surfaceId,senseId:meaning.id}:{surfaceId,expressionId:meaning.id}),band,contextFrench:q.context,correctAnswer:q.answer};
   const raw=q.band==='1-3'?{...common,format:'meaning_choice',targetText:q.targetText,choicesEnglish:q.choices,...word?{prompt:'Meaning'}:{}}:q.band==='4-5'?{...common,format:'surface_completion',choicesFrench:q.choices}:{...common,format:'target_identification',promptFrench:q.question,choicesFrench:q.choices};
   if(q.band==='1-3'&&first.lexicalSegments){const offset=q.context.indexOf(q.targetText);ensure(offset>=0,'independent segmented example');raw.targetSegments=first.lexicalSegments.map(s=>({start:offset+s.start-first.start,end:offset+s.end-first.start}));}
   const out=prepareQuiz(raw,'fr');ensure(quizEditorialIssues(out).length===0,`stored question ${index}/${q.band}: ${quizEditorialIssues(out)}`);return out;
  });
  banks.push({identity,questions:prepared,questionSha256:hash(prepared),legacyPreparedQuizzes:prepared.map(legacyQuiz),masteryAction:'fresh_identity_on_exact_unit_view'});
  const changedBands=questions.filter((q,n)=>hash(q)!==hash(item.questions[n])).map(q=>q.band);
  refinements.push({queueIndex:index,identity,source:{file:entry.file,selector:entry.selector},before:item.questions,after:questions,beforeQuestionSha256:hash(item.questions),afterQuestionSha256:hash(questions),changedBands,reason:'Exact printed-surface bank, independent early example, neutral advanced context and grammatically compatible semantic alternatives. Preserve every predecessor bank.'});
  for(const source of entry.sourceOccurrences){
   const unit=p.bundle.units.find(u=>u.id===source.unitId);ensure(unit&&sha(unit.french)===source.unitSha256&&unit.french.slice(source.start,source.end)===source.text,'exact published source');
   const occurrence={id:id(word?'occ':'exo',`${coord(source)}:${identity}`),workId:source.workId,unitId:source.unitId,start:source.start,end:source.end,text:source.text,...word?{surfaceFormId:surfaceId,senseId:meaning.id}:{surfaceId,identityId:meaning.id},...source.lexicalSegments?{lexicalSegments:source.lexicalSegments}:{}};
   if(word)wordOccurrences.push(occurrence);else expressionOccurrences.push(occurrence);
   const lexical=source.lexicalSegments??[{start:source.start,end:source.end,text:source.text}];
   const components=tokenizeFrench(unit.french).filter(t=>lexical.some(s=>t.start>=s.start&&t.end<=s.end));
   const oldWords=p.bundle.occurrences.filter(o=>o.unitId===source.unitId&&lexical.some(s=>o.start<s.end&&o.end>s.start));
   ensure(hash(oldWords)===hash(source.currentWordOwners),'exact old word records');
   for(const old of oldWords){ensure(components.some(c=>c.start===old.start&&c.end===old.end),`complete component boundary ${old.id}`);ensure(!suppressed.has(old.id),'disjoint source transactions');suppressed.add(old.id);}
   // Some proper-name components are explicitly excluded in the current publication.
   const excluded=p.bundle.exclusions.filter(o=>o.unitId===source.unitId&&lexical.some(s=>o.start<s.end&&o.end>s.start));
   ensure(components.every(c=>[...oldWords,...excluded].some(o=>o.start===c.start&&o.end===c.end)),`all components currently accounted for ${coord(source)}`);
   const oldExpressions=p.expressionCatalog.occurrences.filter(o=>o.unitId===source.unitId&&o.start<source.end&&o.end>source.start);
   ensure(hash(oldExpressions)===hash(source.currentExpressionOwners),'exact old expression records');
   for(const old of oldExpressions){ensure(old.start===source.start&&old.end===source.end&&[0,1].includes(index),'explicit old wrong-meaning expression replacement');ensure(!replaced.has(old.id),'unique old expression');replaced.add(old.id);}
   sourceTransactions.push({queueIndex:index,source:{workId:source.workId,unitId:source.unitId,start:source.start,end:source.end,text:source.text,unitSha256:source.unitSha256},newOwner:occurrence,lexicalComponents:components,removeWordOccurrences:oldWords,removeExclusions:excluded,replaceExpressionOccurrences:oldExpressions,retainInterveningWords:source.retainedInterveningWordOwners,publicationApplied:false,masteryTransfers:[]});
  }
  const previousKeys=new Set(entry.sourceOccurrences.flatMap(o=>o.currentWordOwners.map(w=>`${w.surfaceFormId}:${w.senseId}`)));
  const priorQuizzes=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&previousKeys.has(`${q.subject.surfaceFormId}:${q.subject.senseId}`));
  const oldExpressionIds=new Set(entry.sourceOccurrences.flatMap(o=>o.currentExpressionOwners.map(x=>x.identityId)));
  const priorExpressionQuizzes=p.expressionCatalog.preparedQuizzes.filter(q=>oldExpressionIds.has(q.expressionId));
  legacySnapshots.push({queueIndex:index,componentKeys:[...previousKeys].sort(),preparedWordQuizzes:priorQuizzes,preparedExpressionQuizzes:priorExpressionQuizzes,sha256:hash({priorQuizzes,priorExpressionQuizzes}),preserveAllRecordsAndMastery:true,retentionIsNotStandaloneReactivationApproval:true});
  decisions.push({queueIndex:index,source:{file:entry.file,selector:entry.selector,planSha256:entry.planSha256},form,identity,meaningId:meaning.id,meaningSourceSenseId:item.meaningSourceSenseId??null,route:word?'complete_word_surface_on_existing_conjunction_meaning':reusedExpressions71[index]?'new_surface_on_existing_expression_meaning':'complete_expression_surface',sourceContexts:entry.sourceOccurrences.map(o=>({unitId:o.unitId,text:o.context,sha256:o.unitSha256})),reviewNote:item.reviewNote});
 }
 const bundle=structuredClone(p.bundle);bundle.occurrences=bundle.occurrences.filter(o=>!suppressed.has(o.id));bundle.occurrences.push(...wordOccurrences);bundle.surfaceForms.push(...newSurfaceForms);const removeExclusions=new Set(sourceTransactions.flatMap(t=>t.removeExclusions.map(o=>o.id)));bundle.exclusions=bundle.exclusions.filter(o=>!removeExclusions.has(o.id));
 const candidateUnits=candidate.units.map(u=>({id:`unt_micromegas_${String(u.ordinal).padStart(3,'0')}`,workId:candidate.workId,ordinal:u.ordinal,french:u.text}));bundle.units.push(...candidateUnits);bundle.occurrences.push(...candidate.wordOccurrences);bundle.exclusions.push(...candidate.exclusions);bundle.works.push({id:candidate.workId,publicationState:'learning_ready'});
 const catalog={identities:[...identities.values()],occurrences:[...p.expressionCatalog.occurrences.filter(o=>!replaced.has(o.id)),...candidate.expressionOccurrences,...expressionOccurrences],preparedQuizzes:[]};
 const active=new Set(catalog.occurrences.map(o=>o.surfaceId?`${o.surfaceId}:${o.identityId}`:o.identityId)),byKey=new Map();
 for(const q of p.expressionCatalog.preparedQuizzes){const k=q.surfaceId?`${q.surfaceId}:${q.expressionId}`:q.expressionId;if(active.has(k)){if(!byKey.has(k))byKey.set(k,[]);byKey.get(k).push(q);}}
 for(const b of [...candidate.effectiveBanks,...banks].filter(b=>b.questions[0].subject.kind==='expression'))byKey.set(b.identity,b.questions.map(legacyQuiz));
 catalog.preparedQuizzes=[...byKey.values()].flat();const diagnostics=validateExpressionCatalog(bundle,catalog);ensure(!diagnostics.length,`combined expression catalog: ${JSON.stringify(diagnostics.slice(0,5))}`);
 const summary={reviewedPlans:decisions.length,sourceSpans:sourceTransactions.length,newExpressionMeanings:newIdentities.filter(x=>x.newLexicalMeaning).length,existingConceptExpressionAdapters:newIdentities.filter(x=>!x.newLexicalMeaning).length,reusedExpressionMeanings:Object.keys(reusedExpressions71).length,newExpressionSurfaceKeys:banks.filter(b=>b.questions[0].subject.kind==='expression').length,newCompleteWordSurfaceKeys:newSurfaceForms.length,storedQuestionBands:banks.length*3,expressionOccurrences:expressionOccurrences.length,wordOccurrences:wordOccurrences.length,suppressedWordOccurrences:suppressed.size,suppressedExclusions:removeExclusions.size,replacedExpressionOccurrences:replaced.size,retainedInterveningWordOccurrences:sourceTransactions.reduce((n,t)=>n+t.retainInterveningWords.length,0),refinedQuestionBands:refinements.reduce((n,r)=>n+r.changedBands.length,0),remainingCrossWorkExpressionPlans:0};
 return{version:1,workId:candidate.workId,status:'offline_cross_work_expression_transaction_prepared_unapplied',publicationBaseline:candidate.publicationBaseline,evidenceSha256,newIdentities,newSurfaceForms,expressionOccurrences,wordOccurrences,banks,decisions,refinements,sourceTransactions,legacySnapshots,summary,publicationApplied:false,learnerStateChanged:false,candidateReleaseReady:false};
}
