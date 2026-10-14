import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {prepareQuiz,legacyQuiz,quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
import {validateContentBundle} from '../dist/domain/validate.js';
import {validateExpressionCatalog} from '../dist/domain/expression-content.js';
import {newWordBanks72} from './micromegas-cross-work-word-banks-72.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`;
const ensure=(x,m)=>{if(!x)throw Error(`Transaction72: ${m}`);};
const exprKey=o=>o.surfaceId?`${o.surfaceId}:${o.identityId??o.expressionId}`:o.identityId??o.expressionId;
const wordKey=o=>`${o.surfaceFormId}:${o.senseId}`;
const sameSpan=(a,b)=>a.unitId===b.unitId&&a.start===b.start&&a.end===b.end;
export function composeTransaction72(folder,{includeProjection=false}={}){
 const evidenceSha256={},read=f=>{const bytes=readFileSync(`${folder}/${f}`);evidenceSha256[f]=sha(bytes);return JSON.parse(bytes);};
 const c=read('whole-work-candidate-catalog-70.json'),x=read('whole-work-cross-work-expressions-71.json'),p=loadPublication();
 ensure(hash(p.bundle)===c.publicationBaseline.bundleSha256&&hash(p.expressionCatalog)===c.publicationBaseline.expressionCatalogSha256&&hash([...p.preparedQuizzes.values()])===c.publicationBaseline.quizzesSha256,'unchanged publication');
 const scopes=Array.from({length:39},(_,i)=>i+3).map(n=>({file:`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`,data:read(`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`)}));
 const bundle=structuredClone(p.bundle),catalog=structuredClone(p.expressionCatalog),prepared=new Map([...p.preparedQuizzes].map(([k,q])=>[k,structuredClone(q)]));
 const merge=(list,record)=>{const index=list.findIndex(x=>x.id===record.id);if(index<0)list.push(record);else ensure(hash(list[index])===hash(record),`conflicting record ${record.id}`);};
 const metadataOverlays=c.publishedDependencies.filter(d=>d.kind!=='question'),questionOverlays=c.publishedDependencies.filter(d=>d.kind==='question');
 for(const d of metadataOverlays){const list=d.kind==='sense'?bundle.senses:catalog.identities,index=list.findIndex(r=>r.id===d.id);ensure(index>=0&&hash(list[index])===d.beforeSha256&&hash(d.after)===d.afterSha256,`exact metadata before ${d.id}`);list[index]=d.after;}
 for(const d of questionOverlays){ensure(hash(prepared.get(d.id))===d.beforeSha256&&hash(d.after)===d.afterSha256,`exact quiz before ${d.id}`);prepared.set(d.id,d.after);}
 for(const name of ['lemmas','senses','surfaceForms'])for(const record of c.records[name])merge(bundle[name],record);
 for(const record of [...c.records.expressionIdentities,...x.newIdentities.map(x=>x.record)]){
  const prior=catalog.identities.find(r=>r.id===record.id);
  if(prior&&hash(prior)!==hash(record)){const overlay=c.metadataChanges.find(d=>d.kind==='expression'&&d.id===record.id&&hash(d.after)===hash(record));ensure(overlay,'explicit candidate expression metadata');catalog.identities[catalog.identities.indexOf(prior)]=record;}else merge(catalog.identities,record);
 }
 for(const record of x.newSurfaceForms)merge(bundle.surfaceForms,record);
 for(const b of [...c.effectiveBanks,...x.banks])for(const q of b.questions)prepared.set(q.id,q);
 const removeWords=new Map(x.sourceTransactions.flatMap(t=>t.removeWordOccurrences.map(o=>[o.id,o]))),removeExclusions=new Map(x.sourceTransactions.flatMap(t=>t.removeExclusions.map(o=>[o.id,o]))),removeExpressions=new Map(x.sourceTransactions.flatMap(t=>t.replaceExpressionOccurrences.map(o=>[o.id,o])));
 const existingPhraseTransactions=[],coveredPhraseSpans=new Set(x.sourceTransactions.map(t=>`${t.source.unitId}:${t.source.start}:${t.source.end}`));
 for(const {file,data} of scopes)for(const span of data.phraseComponents??[]){
  if(!span.workId||!span.target?.startsWith('exi_'))continue;
  const spanKey=`${span.unitId}:${span.start}:${span.end}`;if(coveredPhraseSpans.has(spanKey))continue;
  const unit=p.bundle.units.find(u=>u.id===span.unitId);ensure(unit&&unit.french.slice(span.start,span.end)===span.text,'recorded existing phrase source');
  let occurrence=p.expressionCatalog.occurrences.find(o=>sameSpan(o,span));
  if(occurrence)ensure(occurrence.identityId===span.target,'existing whole phrase identity');
  else occurrence={id:id('exo',`existing-phrase:${spanKey}:${span.target}`),identityId:span.target,workId:span.workId,unitId:span.unitId,start:span.start,end:span.end,text:span.text};
  const components=span.componentTokens??[],oldWords=components.flatMap(t=>p.bundle.occurrences.filter(o=>o.unitId===span.unitId&&o.start===t.start&&o.end===t.end));
  for(const old of oldWords){ensure(!removeWords.has(old.id),'disjoint phrase component removals');removeWords.set(old.id,old);}
  existingPhraseTransactions.push({file,source:{workId:span.workId,unitId:span.unitId,start:span.start,end:span.end,text:span.text,unitSha256:sha(unit.french)},occurrence,addOccurrence:!p.expressionCatalog.occurrences.some(o=>o.id===occurrence.id),removeWordOccurrences:oldWords,componentTokens:components,publicationApplied:false});coveredPhraseSpans.add(spanKey);
 }
 // Resolve every previously reviewed published word reassignment under proper owners.
 const newSenses=[],newSurfaces=[],newBanks=[],wordReassignments=[];
 const weakOwner=read('whole-work-scope-plan-06.json').nounOwner,weakSpec=weakOwner.senseGroups.find(s=>s.key==='petit:weak_or_lowly');
 const weakLemma=c.records.lemmas.find(l=>l.headword==='petit'&&l.partOfSpeech==='noun');ensure(weakLemma,'existing proper petit noun owner');
 const weakSense={id:id('sns','proper_weak_or_lowly_noun'),lemmaId:weakLemma.id,gloss:weakSpec.gloss,definition:weakSpec.definition};newSenses.push(weakSense);merge(bundle.senses,weakSense);
 const quoi=c.records.senses.find(s=>c.records.lemmas.find(l=>l.id===s.lemmaId)?.headword==='quoi'&&c.records.lemmas.find(l=>l.id===s.lemmaId)?.partOfSpeech==='adverb');ensure(quoi,'existing exclamative adverb meaning');
 const bankIdentity=q=>q.subject.kind==='vocabulary'?`${q.subject.surfaceFormId}:${q.subject.senseId}`:exprKey(q.subject);
 const finalBanks=new Map(c.effectiveBanks.map(b=>[b.identity,b.questions]));
 const authoredBank=(surface,sense)=>{
  const identity=`${surface.id}:${sense.id}`;
  if(finalBanks.has(identity))return finalBanks.get(identity);
  const stored=[...prepared.values()].filter(q=>q.subject.kind==='vocabulary'&&bankIdentity(q)===identity);
  if(stored.length===3)return stored;
  const spec=Object.values(newWordBanks72).find(b=>b.form===surface.normalized&&(b.senseId===sense.id||(b.senseGroup==='petit:weak_or_lowly'&&sense.id===weakSense.id)));ensure(spec,`missing reviewed word bank ${identity}`);
  const qs=['levels_1_3','levels_4_5','levels_6_8'].map((band,n)=>{
   const common={id:id('qiz',`cross-work:${identity}:${band}`),surfaceFormId:surface.id,senseId:sense.id,band};
   const raw=n===0?{...common,format:'meaning_choice',contextFrench:spec.early[0],targetText:surface.form,prompt:'Meaning',correctAnswer:spec.early[1],choicesEnglish:spec.early[2]}:n===1?{...common,format:'surface_completion',contextFrench:spec.middle[0],correctAnswer:surface.form,choicesFrench:spec.middle[1]}:{...common,format:'target_identification',contextFrench:`Le lecteur compare les mots ${spec.late[1].map(s=>`« ${s} »`).join(', ')}.`,promptFrench:spec.late[0],correctAnswer:surface.form,choicesFrench:spec.late[1]};
   const q=prepareQuiz(raw,'fr');ensure(!quizEditorialIssues(q).length,`word bank validity ${identity}`);return q;
  });newBanks.push({identity,questions:qs,questionSha256:hash(qs),reason:'Previously reviewed cross-work meaning and exact form; four semantically selected grammatically compatible alternatives.'});finalBanks.set(identity,qs);for(const q of qs)prepared.set(q.id,q);return qs;
 };
 for(const {file,data} of scopes)for(const group of data.published??[])for(const source of group.sourceReview??[]){
  const decision=source.decision,old=p.bundle.occurrences.find(o=>o.id===source.id);if(!old||!decision||removeWords.has(old.id))continue;
  if(!decision.route?.startsWith('correct')&&decision.route!=='planned_quoi_adverb_exclamation')continue;
  const unit=p.bundle.units.find(u=>u.id===old.unitId);ensure(unit.french===source.passage&&hash(unit.french)===source.passageSha256,`reviewed full published word passage ${source.id} ${sha(unit.french)} ${source.passageSha256}`);
  const meaningId=decision.senseId??(decision.senseGroup==='petit:weak_or_lowly'?weakSense.id:decision.route==='planned_quoi_adverb_exclamation'?quoi.id:null),sense=bundle.senses.find(s=>s.id===meaningId);ensure(sense,'explicit reviewed sense route');
  const form=unit.french.slice(old.start,old.end).toLowerCase(),matches=bundle.surfaceForms.filter(s=>s.lemmaId===sense.lemmaId&&s.normalized===form);ensure(matches.length<=1,'unambiguous correct surface');
  let surface=matches[0];if(!surface){surface={id:id('srf',`${sense.lemmaId}:${form}`),lemmaId:sense.lemmaId,form,normalized:form};newSurfaces.push(surface);merge(bundle.surfaceForms,surface);}
  const after={...old,surfaceFormId:surface.id,senseId:sense.id};ensure(wordKey(old)!==wordKey(after),'actual word identity correction');
  const qs=authoredBank(surface,sense);wordReassignments.push({file,sourceReview:source,before:old,after,beforeSha256:hash(old),afterSha256:hash(after),identity:wordKey(after),questionIds:qs.map(q=>q.id),masteryAction:'retain_legacy_progress_new_key_only_on_exact_unit_view',publicationApplied:false});
 }
 bundle.occurrences=bundle.occurrences.filter(o=>!removeWords.has(o.id)).map(o=>wordReassignments.find(r=>r.before.id===o.id)?.after??o);bundle.occurrences.push(...x.wordOccurrences);
 bundle.exclusions=bundle.exclusions.filter(o=>!removeExclusions.has(o.id));catalog.occurrences=catalog.occurrences.filter(o=>!removeExpressions.has(o.id));catalog.occurrences.push(...x.expressionOccurrences,...existingPhraseTransactions.filter(t=>t.addOccurrence).map(t=>t.occurrence));
 const unresolved=[];
 for(const {file,data} of scopes)for(const group of data.published??[])for(const source of group.sourceReview??[]){
  const decision=source.decision,old=p.bundle.occurrences.find(o=>o.id===source.id);if(!old||!decision?.route||decision.route.startsWith('retain')||decision.route===old.senseId)continue;
  if(!removeWords.has(old.id)&&!wordReassignments.some(r=>r.before.id===old.id))unresolved.push({file,occurrenceId:old.id,decision});
 }
 ensure(!unresolved.length,`unresolved published source decisions ${JSON.stringify(unresolved)}`);
 // The projection is only an in-memory validation fixture. Nothing is written to publication.
 const dossier=JSON.parse(readFileSync(`${folder}/dossier.json`,'utf8')),canonical=readFileSync(`${folder}/canonical-draft.txt`,'utf8');evidenceSha256['canonical-draft.txt']=sha(canonical);
 bundle.authors.push({id:'aut_voltaire',name:'Voltaire',sortName:'Voltaire'});bundle.collections.push({id:'col_voltaire_contes',authorId:'aut_voltaire',title:'Contes philosophiques',language:'fr'});bundle.books.push({id:'bok_voltaire_micromegas',collectionId:'col_voltaire_contes',ordinal:1,title:'Micromégas'});
 bundle.works.push({id:c.workId,bookId:'bok_voltaire_micromegas',ordinal:1,title:'Micromégas',publicationState:'processing',originCountryCode:'FR',originCountryName:'France',originCountryFlag:'🇫🇷'});
 bundle.sources.push({workId:c.workId,canonicalText:canonical,provenance:{citation:dossier.edition.candidateBase,url:dossier.edition.transcriptionUrl},typographyPolicy:'modern_conventional_typography_preserving_wording'});
 bundle.units.push(...c.units.map(u=>({id:`unt_micromegas_${String(u.ordinal).padStart(3,'0')}`,workId:c.workId,ordinal:u.ordinal,french:u.text})));bundle.occurrences.push(...c.wordOccurrences);bundle.exclusions.push(...c.exclusions);bundle.readiness.push({workId:c.workId,thoughtUnitsComplete:true,occurrencesReviewed:false,unresolvedLearnerTokens:[]});catalog.occurrences.push(...c.expressionOccurrences);
 const activeExpressionKeys=new Set(catalog.occurrences.map(exprKey)),wordQuizzes=[...prepared.values()].filter(q=>q.subject.kind==='vocabulary'),expressionQuizzes=[...prepared.values()].filter(q=>q.subject.kind==='expression'&&activeExpressionKeys.has(exprKey(q.subject)));
 bundle.quizItems=wordQuizzes.map(legacyQuiz);catalog.preparedQuizzes=expressionQuizzes.map(legacyQuiz);
 const validation=validateContentBundle(bundle),expressionDiagnostics=validateExpressionCatalog(bundle,catalog);
 const bankCounts=new Map();for(const q of wordQuizzes)bankCounts.set(wordKey(q.subject),(bankCounts.get(wordKey(q.subject))??0)+1);for(const o of bundle.occurrences)ensure(bankCounts.get(wordKey(o))===3,`active three-band word bank ${wordKey(o)}`);
 const archivedExpressionBanks=p.expressionCatalog.preparedQuizzes.filter(q=>!activeExpressionKeys.has(exprKey(q))),summary={crossWorkPlanCount:x.summary.reviewedPlans,crossWorkNewSurfaceSpans:x.summary.sourceSpans,wordReassignments:wordReassignments.length,correctedWordKeys:new Set(wordReassignments.map(r=>r.identity)).size,newWordMeanings:newSenses.length,newWordSurfaces:newSurfaces.length,newWordBanks:newBanks.length,newWordQuestionBands:newBanks.length*3,existingPhraseSpans:existingPhraseTransactions.length,addedExistingMeaningPhraseOccurrences:existingPhraseTransactions.filter(t=>t.addOccurrence).length,suppressedWordOccurrences:removeWords.size,suppressedExclusions:removeExclusions.size,replacedExpressionOccurrences:removeExpressions.size,stagedMetadataOverlays:metadataOverlays.length,stagedQuestionOverlays:questionOverlays.length,archivedInactiveExpressionBands:archivedExpressionBanks.length,unresolvedPublishedSourceDecisions:unresolved.length,projectedWorks:bundle.works.length,projectedWordOccurrences:bundle.occurrences.length,projectedExpressionOccurrences:catalog.occurrences.length};
 const diagnosticIds=[...new Set(validation.diagnostics.map(d=>d.path.split('.').slice(1).join('.')))];
 const repairQueue=diagnosticIds.map(quizId=>{const question=prepared.get(quizId);ensure(question,'diagnostic quiz lookup');return{quizId,identity:bankIdentity(question),question,beforeSha256:hash(question),diagnostics:validation.diagnostics.filter(d=>d.path===`quizItems.${quizId}`),sourceUnitIds:bundle.units.filter(u=>u.french===question.context).map(u=>u.id)};});
 const result={version:1,workId:c.workId,status:validation.ok&&!expressionDiagnostics.length?'offline_combined_transaction_validated_unapplied':'offline_combined_transaction_blocked_unapplied',publicationBaseline:c.publicationBaseline,evidenceSha256,repairQueue,sourceEdition:{candidateBase:dossier.edition.candidateBase,transcriptionUrl:dossier.edition.transcriptionUrl},newSenses,newSurfaces,newBanks,wordReassignments,existingPhraseTransactions,removeWordOccurrences:[...removeWords.values()],removeExclusions:[...removeExclusions.values()],replaceExpressionOccurrences:[...removeExpressions.values()],metadataOverlays,questionOverlays,archivedExpressionBanks,summary,validation:{contentBundle:validation.ok?'passed':'blocked',expressionCatalog:expressionDiagnostics.length?'blocked':'passed',diagnostics:[...validation.diagnostics,...expressionDiagnostics],activeWordThreeBandCoverage:'passed',allRecordedPublishedSourceDecisions:'resolved',projectionSha256:{bundle:hash(bundle),expressionCatalog:hash(catalog)},publicationRegistryUnchanged:true},publicationApplied:false,learnerStateChanged:false,candidateReleaseReady:false};
 if(includeProjection)return{...result,projection:{bundle,expressionCatalog:catalog,preparedQuizzes:[...prepared.values()]}};return result;
}
