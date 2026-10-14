import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadPublication } from './micromegas-publication-baseline.mjs';
import { quizEditorialIssues, prepareQuiz } from '../dist/publication/quiz-authoring.js';

const sha = x => createHash('sha256').update(x).digest('hex');
const hash = x => sha(JSON.stringify(x));
const coordinate = x => `${x.unit}:${x.start}:${x.end}`;
const unitId = n => `unt_micromegas_${String(n).padStart(3, '0')}`;
const key = q => q.subject.kind === 'vocabulary' ? `${q.subject.surfaceFormId}:${q.subject.senseId}` : q.subject.surfaceId ? `${q.subject.surfaceId}:${q.subject.expressionId}` : q.subject.expressionId;
const ordered = qs => qs.toSorted((a,b) => a.band.localeCompare(b.band));
const ensure = (ok, message) => { if (!ok) throw Error(`Candidate70: ${message}`); };
export const wordFiles70 = ['whole-work-reviewed-word-bindings-44.json', 'whole-work-direct-word-package-46.json', 'whole-work-resolved-word-package-47.json', 'whole-work-continuation-word-package-49.json', 'whole-work-reviewed-family-words-51.json', ...[55,57,59,60,61,62,63,64].map(n => `whole-work-source-words-${n}.json`), 'whole-work-held-components-65.json'];
export const expressionFiles70 = ['whole-work-resolved-expressions-48.json','whole-work-construction-expressions-50.json','whole-work-family-constructions-52.json','whole-work-next-constructions-53.json','whole-work-expression-supplement-54.json','whole-work-expression-package-56.json','whole-work-mixed-de-resolution-58.json', ...[66,67,68,69].map(n => `whole-work-original-phrases-${n}.json`)];

/** A source-bound, offline composition. This does not write publication or learner data. */
export function composeCandidate70(folder) {
  const evidenceSha256 = {}, read = file => { const bytes = readFileSync(`${folder}/${file}`); evidenceSha256[file] = sha(bytes); return JSON.parse(bytes); };
  const base = read('whole-work-import-composition-42.json'), units = read('unit-plan.json').units;
  const p = loadPublication(), baseline = base.publicationBaseline;
  ensure(hash(p.bundle) === baseline.bundleSha256 && hash(p.expressionCatalog) === baseline.expressionCatalogSha256 && hash([...p.preparedQuizzes.values()]) === baseline.quizzesSha256, 'unchanged publication baseline');
  const words = wordFiles70.map(file => ({file, data: read(file)})), expressions = expressionFiles70.map(file => ({file, data: read(file)}));
  const scopes = Array.from({length:39}, (_,i) => i+3).map(n => ({file:`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`, data:read(`whole-work-scope-plan-${String(n).padStart(2,'0')}.json`)}));
  const metadata = Object.fromEntries(['lemmas','senses','surfaceForms'].map(k => [k,new Map(p.bundle[k].map(x => [x.id,structuredClone(x)]))]));
  metadata.expressionIdentities = new Map(p.expressionCatalog.identities.map(x => [x.id,structuredClone(x)]));
  const metadataChanges = [], bankSelections = [], publishedQuestions = new Map([...p.preparedQuizzes].map(([id,q])=>[id,structuredClone(q)]));
  for (const {file,data} of [...words,...expressions]) {
    for (const [source,target] of [['newLemmas','lemmas'],['newSenses','senses'],['newSurfaceForms','surfaceForms'],['newIdentities','expressionIdentities']]) {
      for (const item of data[source]??[]) { const r=item.record; ensure(r?.id,`record shape ${file}/${source}`); const old=metadata[target].get(r.id); ensure(!old||hash(old)===hash(r),`conflicting metadata ${file}/${r.id}`); metadata[target].set(r.id,r); }
    }
    if (file==='whole-work-mixed-de-resolution-58.json') metadata.expressionIdentities.set(data.identity.id,data.identity);
  }
  const overlay = (map, change, file, kind) => {
    const id=change.after.id, current=map.get(id);
    ensure(current && hash(change.before)===change.beforeSha256 && hash(change.after)===change.afterSha256,`overlay fingerprints ${file}/${id}`);
    ensure(hash(current)===change.beforeSha256||hash(current)===change.afterSha256,`overlay predecessor ${file}/${id}`);
    if (hash(current)!==change.afterSha256) { map.set(id,change.after); metadataChanges.push({kind,id,file,before:change.before,after:change.after,beforeSha256:change.beforeSha256,afterSha256:change.afterSha256,reason:change.reason??change.status}); }
  };
  for (const {file,data} of [...scopes,...words,...expressions]) {
    for (const c of data.senseChanges??[]) overlay(metadata.senses,c,file,'sense');
    for (const c of [...data.identityChanges??[],...data.identityOverlays??[]]) overlay(metadata.expressionIdentities,c,file,'expression');
    for (const c of [...data.wordChanges??[],...data.publishedQuestionOverlays??[]]) overlay(publishedQuestions,c,file,'question');
    for (const c of data.expressionChanges??[]) {
      const legacy=p.expressionCatalog.preparedQuizzes.find(q=>q.id===c.id);
      ensure(legacy&&hash(legacy)===c.beforeSha256&&hash(c.after)===c.afterSha256,`legacy expression question fingerprint ${file}/${c.id}`);
      const before=prepareQuiz(c.before,'fr'),after=prepareQuiz(c.after,'fr');
      overlay(publishedQuestions,{before,after,beforeSha256:hash(before),afterSha256:hash(after),reason:c.reason},file,'question');
    }
  }
  const banks = new Map();
  const addBank = (b,file,data) => {
    ensure(b.questions.length===3 && new Set(b.questions.map(q=>q.band)).size===3 && b.questions.every(q=>key(q)===b.identity),`bank subjects ${file}/${b.identity}`);
    const old=banks.get(b.identity);
    if (old && hash(ordered(old.questions))!==hash(ordered(b.questions))) {
      const refinement=(data.refinements??[]).find(r=>r.identity===b.identity && r.beforeQuestionSha256===hash(old.sourceQuestions) && r.afterQuestionSha256===hash(b.sourceQuestions));
      ensure(refinement,`unreviewed bank conflict ${file}/${b.identity}`);
      bankSelections.push({identity:b.identity,from:old.evidence,to:file,reason:'exact previously reviewed question refinement',beforeSha256:hash(old.questions),afterSha256:hash(b.questions)});
    }
    banks.set(b.identity,{...b,evidence:file});
  };
  const firstBanks = read('whole-work-reviewed-word-banks-45.json');
  for (const b of firstBanks.banks) addBank(b,'whole-work-reviewed-word-banks-45.json',firstBanks);
  for (const {file,data} of [...words,...expressions]) for (const b of [...data.banks??[],...data.wordBanks??[]]) addBank(b,file,data);
  for (const {file,data} of words) for (const r of data.expressionBankRefinements??[]) {
    const old=banks.get(r.identity), source=read(r.source.file).banks[Number(r.source.selector.split('/').at(-1))];
    ensure(old&&hash(source)===r.beforeBankSha256&&hash(r.after)===r.afterBankSha256&&hash(old.questions)===hash(source.questions),'exact partitive replacement');
    banks.set(r.identity,{...r.after,evidence:file});bankSelections.push({identity:r.identity,from:r.source.file,to:file,reason:r.reason,beforeSha256:hash(old.questions),afterSha256:hash(r.after.questions)});
  }
  const sourceBindings = new Map();
  for (const {file,data} of words) for (const o of data.occurrenceBindings) {ensure(!sourceBindings.has(coordinate(o)),`duplicate word binding ${coordinate(o)}`);sourceBindings.set(coordinate(o),{...o,evidencePackage:file});}
  const components = new Map(), expressionOccurrences=[];
  for (const {file,data} of expressions) {
    expressionOccurrences.push(...data.occurrences.map(o=>({...o,evidencePackage:file})));
    for (const c of data.componentBindings??data.components??[]) {ensure(!components.has(coordinate(c)),`duplicate expression component ${coordinate(c)}`);components.set(coordinate(c),{...c,evidencePackage:file});}
  }
  const held=words.at(-1).data, pronoun=expressions.find(x=>x.file.endsWith('-68.json')).data, mixed=expressions.find(x=>x.file.endsWith('-58.json')).data;
  const parents=new Map(held.sourceTokenRefinements.map(r=>[coordinate(r.parent),r]));
  const pronounComponents=new Map(pronoun.wordComponentBindings.map(c=>[coordinate(c),c]));
  const attached=new Map(base.wordLocutionAttachments.flatMap(a=>a.componentTokens.filter(c=>coordinate(c)!==coordinate(a.anchor)).map(c=>[coordinate(c),a])));
  const tokenOwnership=[], wordOccurrences=[], exclusions=[], suppressedWordBindings=[];
  const wordOccurrence=(o,identity,source) => {
    const [surfaceFormId,senseId]=identity.split(':'),surface=metadata.surfaceForms.get(surfaceFormId),sense=metadata.senses.get(senseId);
    ensure(surface&&sense&&surface.lemmaId===sense.lemmaId,`surface/sense lemma ${coordinate(o)}/${identity}`);
    ensure(surface.normalized===o.text.toLowerCase(),`printed surface ${coordinate(o)}/${o.text}/${surface.form}`);
    const record={id:`occ_micromegas_${sha(`${coordinate(o)}:${identity}`).slice(0,16)}`,workId:base.workId,unitId:unitId(o.unit),unit:o.unit,start:o.start,end:o.end,text:o.text,surfaceFormId,senseId,identity,evidencePackage:source};wordOccurrences.push(record);return record;
  };
  for (const t of base.tokens) {
    const c=coordinate(t), bind=sourceBindings.get(c), component=components.get(c), whole=pronounComponents.get(c);
    let owner;
    if(component) {if(bind){ensure(component.componentAction?.startsWith('suppress_only_this') && hash(component.baseOwner)===hash(t.owner),`explicit component replacement ${c}`);suppressedWordBindings.push({coordinate:c,priorBinding:bind,replacement:component});} owner={kind:'expression_component',occurrenceId:component.expressionOccurrenceId,identity:component.identity};}
    else if(whole) owner={kind:'complete_word_component',occurrenceId:whole.wordOccurrenceId,identity:whole.identity};
    else if(parents.has(c)) {const refined=parents.get(c);owner={kind:'refined_word_components',occurrences:refined.components.map(o=>wordOccurrence(o,o.identity,'whole-work-held-components-65.json').id),nonLexicalSeparators:refined.nonLexicalSeparators};}
    else if(bind) {const o=wordOccurrence(t,bind.identity,bind.evidencePackage);owner={kind:'word',occurrenceId:o.id,identity:o.identity};}
    else if(c===coordinate(mixed.quantityPrepositionReassignment)) {const o=wordOccurrence(t,mixed.quantityPrepositionReassignment.toOwner.identity,'whole-work-mixed-de-resolution-58.json');owner={kind:'word',occurrenceId:o.id,identity:o.identity};}
    else if(t.owner.kind==='published_identity') {const o=wordOccurrence(t,t.owner.identity,'whole-work-import-composition-42.json');owner={kind:'word',occurrenceId:o.id,identity:o.identity};}
    else if(t.owner.kind==='proper_name_exclusion') {const o={id:`exc_micromegas_${sha(c).slice(0,16)}`,workId:base.workId,unitId:unitId(t.unit),unit:t.unit,start:t.start,end:t.end,text:t.text,reason:'proper_noun'};exclusions.push(o);owner={kind:'exclusion',occurrenceId:o.id};}
    else if(attached.has(c)||t.owner.kind==='attached_word_locution_component') {const a=attached.get(c)??t.owner;owner={kind:'legacy_word_locution_component',anchor:coordinate(a.anchor),identity:a.identity,evidence:a.evidence};}
    else throw Error(`Candidate70: unowned source token ${c}/${JSON.stringify(t.owner)}`);
    ensure(units[t.unit-1].text.slice(t.start,t.end)===t.text,`source text ${c}`);
    tokenOwnership.push({unit:t.unit,start:t.start,end:t.end,text:t.text,baseOwner:t.owner,owner});
  }
  wordOccurrences.push(...pronoun.wordOccurrences.map(o=>({...o,evidencePackage:'whole-work-original-phrases-68.json'})));
  // The four fused parents create eight word owners; every other bound word must be emitted exactly once.
  for(const [c,b] of sourceBindings) ensure(wordOccurrences.some(o=>coordinate(o)===c&&o.identity===b.identity)||suppressedWordBindings.some(x=>x.coordinate===c),`lost reviewed word ${c}`);
  const used=new Set([...wordOccurrences.map(o=>o.identity),...expressionOccurrences.map(o=>o.surfaceId?`${o.surfaceId}:${o.identityId}`:o.identityId)]);
  const effectiveBanks=[];
  for(const identity of [...used].sort()) {
    const chosen=banks.get(identity);
    let questions=chosen?.questions ?? [...publishedQuestions.values()].filter(q=>key(q)===identity);
    // Any global reviewed question overlay must also reach selected banks containing that exact old ID.
    questions=questions.map(q=>{const next=publishedQuestions.get(q.id),old=p.preparedQuizzes.get(q.id);return old&&next&&hash(old)!==hash(next)&&hash(q)===hash(old)?next:q;});
    ensure(questions.length===3&&new Set(questions.map(q=>q.band)).size===3,`missing complete bank ${identity}/${questions.length}`);
    for(const q of questions) ensure(quizEditorialIssues(q).length===0,`bank validation ${q.id}: ${quizEditorialIssues(q)}`);
    effectiveBanks.push({identity,questions:ordered(questions),questionSha256:hash(ordered(questions)),evidence:chosen?.evidence??'unchanged_published_bank',masteryAction:[...p.preparedQuizzes.values()].some(q=>key(q)===identity)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view'});
  }
  const usedSurfaces=new Set(wordOccurrences.map(o=>o.surfaceFormId)),usedSenses=new Set(wordOccurrences.map(o=>o.senseId)),usedLemmas=new Set([...usedSenses].map(id=>metadata.senses.get(id).lemmaId)),usedExpressions=new Set(expressionOccurrences.map(o=>o.identityId));
  const records={lemmas:[...usedLemmas].sort().map(id=>metadata.lemmas.get(id)),senses:[...usedSenses].sort().map(id=>metadata.senses.get(id)),surfaceForms:[...usedSurfaces].sort().map(id=>metadata.surfaceForms.get(id)),expressionIdentities:[...usedExpressions].sort().map(id=>metadata.expressionIdentities.get(id))};
  for(const [name,rs] of Object.entries(records)) ensure(rs.every(Boolean),`missing ${name}`);
  const questions=effectiveBanks.flatMap(b=>b.questions);ensure(new Set(questions.map(q=>q.id)).size===questions.length,'duplicate effective quiz IDs');
  ensure(new Set(wordOccurrences.map(coordinate)).size===wordOccurrences.length,'duplicate word occurrences');
  const publishedDependencies=metadataChanges.filter(c=>c.kind==='sense'?p.bundle.senses.some(s=>s.id===c.id):c.kind==='expression'?p.expressionCatalog.identities.some(s=>s.id===c.id):true).map(c=>({...c,publicationApplied:false,affectedOccurrences:c.kind==='sense'?p.bundle.occurrences.filter(o=>o.senseId===c.id).map(o=>({id:o.id,workId:o.workId,unitId:o.unitId})):c.kind==='expression'?p.expressionCatalog.occurrences.filter(o=>o.identityId===c.id).map(o=>({id:o.id,workId:o.workId,unitId:o.unitId})):[],affectedQuestionIds:c.kind==='sense'?[...p.preparedQuizzes.values()].filter(q=>q.subject.senseId===c.id).map(q=>q.id):c.kind==='expression'?[...p.preparedQuizzes.values()].filter(q=>q.subject.expressionId===c.id).map(q=>q.id):[c.id]}));
  // Capture every effective published-bank change, including historical bank replacements
  // and expression revisions that are not represented by a scope wordChanges entry.
  const dependencyQuestionIds=new Set(publishedDependencies.filter(c=>c.kind==='question').map(c=>c.id));
  for(const q of questions) {
    const before=p.preparedQuizzes.get(q.id);
    if(before && hash(before)!==hash(q) && !dependencyQuestionIds.has(q.id)) {
      publishedDependencies.push({kind:'question',id:q.id,file:effectiveBanks.find(b=>b.identity===key(q)).evidence,before,after:q,beforeSha256:hash(before),afterSha256:hash(q),reason:'Previously reviewed canonical bank selected for the complete offline catalog.',publicationApplied:false,affectedQuestionIds:[q.id],affectedOccurrences:[]});
      dependencyQuestionIds.add(q.id);
    }
  }
  // Existing-work source reroutes remain a separate transaction. Retain exact plans,
  // rather than silently applying candidate decisions to already published passages.
  const crossWorkPlans=scopes.filter(({data})=>(data.published??[]).length || (data.newExpressions??[]).some(e=>(e.sourceOccurrences??e.occurrences??[]).some(o=>o.workId&&o.workId!==base.workId))).map(({file,data})=>({file,planSha256:evidenceSha256[file],publishedEvidenceRecords:(data.published??[]).length,newExpressionPlans:(data.newExpressions??[]).length,publicationApplied:false,status:'requires_exact_published_occurrence_transaction_reconciliation'}));
  const crossWorkExpressionQueue=[];
  for(const {file,data} of scopes)for(const [index,item] of (data.newExpressions??[]).entries()) {
    const sourceOccurrences=(item.sourceOccurrences??[]).filter(o=>o.workId&&o.workId!==base.workId);
    if(!sourceOccurrences.length)continue;
    const sources=sourceOccurrences.map(o=>{
      const unit=p.bundle.units.find(u=>u.id===o.unitId);
      ensure(unit&&unit.workId===o.workId&&unit.french.slice(o.start,o.end)===o.text,`cross-work exact expression source ${file}/${index}`);
      const segments=o.lexicalSegments??[{start:o.start,end:o.end,text:o.text}];
      return {...o,unitSha256:sha(unit.french),currentWordOwners:p.bundle.occurrences.filter(x=>x.unitId===o.unitId&&segments.some(s=>x.start<s.end&&x.end>s.start)),currentExpressionOwners:p.expressionCatalog.occurrences.filter(x=>x.unitId===o.unitId&&x.start<o.end&&x.end>o.start),retainedInterveningWordOwners:p.bundle.occurrences.filter(x=>x.unitId===o.unitId&&x.start>=o.start&&x.end<=o.end&&!segments.some(s=>x.start<s.end&&x.end>s.start))};
    });
    crossWorkExpressionQueue.push({file,selector:`/newExpressions/${index}`,headword:item.headword??item.surfacePattern??item.form,planSha256:hash(item),sourceOccurrences:sources,storedSourceQuestionBands:item.questions?.length??0,status:'source_bound_plan_requires_final_identity_bank_and_transaction_review',publicationApplied:false});
  }
  const summary={sourceUnits:units.length,sourceTokens:tokenOwnership.length,wordOccurrences:wordOccurrences.length,wordKeys:new Set(wordOccurrences.map(o=>o.identity)).size,expressionOccurrences:expressionOccurrences.length,expressionKeys:new Set(expressionOccurrences.map(o=>o.surfaceId?`${o.surfaceId}:${o.identityId}`:o.identityId)).size,properNameExclusions:exclusions.length,legacyWordLocutionAttachments:base.wordLocutionAttachments.length,refinedFusedSourceUses:parents.size,canonicalBanks:effectiveBanks.length,storedQuestionBands:questions.length,explicitLaterBankSelections:bankSelections.length,publishedDependencyRecords:publishedDependencies.length,crossWorkScopePlans:crossWorkPlans.length,crossWorkExpressionPlans:crossWorkExpressionQueue.length,crossWorkExpressionSpans:crossWorkExpressionQueue.reduce((n,x)=>n+x.sourceOccurrences.length,0),suppressedPriorWordBindings:suppressedWordBindings.length,unownedTokens:0};
  return {version:1,workId:base.workId,status:'offline_complete_candidate_catalog_unapplied',publicationBaseline:baseline,evidenceSha256,sourceSha256:base.sourceSha256,units,records,wordOccurrences,expressionOccurrences,exclusions,wordLocutionAttachments:base.wordLocutionAttachments,tokenOwnership,suppressedWordBindings,effectiveBanks,bankSelections,metadataChanges,publishedDependencies,crossWorkPlans,crossWorkExpressionQueue,summary,publicationApplied:false,learnerStateChanged:false,candidateReleaseReady:false};
}
