import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeCandidate70} from './micromegas-candidate-catalog-70.mjs';
import {validateExpressionCatalog} from '../dist/domain/expression-content.js';
import {LemmaSchema,SenseSchema,SurfaceFormSchema,OccurrenceSchema,ExcludedOccurrenceSchema} from '../dist/domain/model.js';
import {quizEditorialIssues} from '../dist/publication/quiz-authoring.js';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const coord=x=>`${x.unit}:${x.start}:${x.end}`;
const key=q=>q.subject.kind==='vocabulary'?`${q.subject.surfaceFormId}:${q.subject.senseId}`:q.subject.surfaceId?`${q.subject.surfaceId}:${q.subject.expressionId}`:q.subject.expressionId;
const ensure=(x,m)=>{if(!x)throw Error(`Candidate70 validation: ${m}`);};
export function validateCandidate70(w,base) {
 ensure(!w.publicationApplied&&!w.learnerStateChanged&&!w.candidateReleaseReady,'offline state');
 ensure(w.tokenOwnership.length===base.tokens.length&&w.tokenOwnership.every((t,i)=>coord(t)===coord(base.tokens[i])&&t.text===base.tokens[i].text),'exact complete token partition');
 const words=new Map(w.wordOccurrences.map(o=>[o.id,o])),expressions=new Map(w.expressionOccurrences.map(o=>[o.id,o])),excluded=new Map(w.exclusions.map(o=>[o.id,o]));
 ensure(words.size===w.wordOccurrences.length&&expressions.size===w.expressionOccurrences.length&&excluded.size===w.exclusions.length,'unique owners');
 const usedWords=new Set(),usedExpressions=new Set(),usedExcluded=new Set();
 const lemma=new Map(w.records.lemmas.map(o=>[o.id,o])),sense=new Map(w.records.senses.map(o=>[o.id,o])),surface=new Map(w.records.surfaceForms.map(o=>[o.id,o]));
 for(const [name,schema] of [['lemmas',LemmaSchema],['senses',SenseSchema],['surfaceForms',SurfaceFormSchema]])for(const r of w.records[name])ensure(schema.safeParse(r).success,`metadata schema ${r.id}`);
 for(const s of [...sense.values(),...surface.values()])ensure(lemma.has(s.lemmaId),`known lemma ${s.id}`);
 const wordCheck=(o,t,contained=false)=>{ensure(o&&o.unit===t.unit&&(contained?o.start>=t.start&&o.end<=t.end:o.start===t.start&&o.end===t.end),'exact word owner');usedWords.add(o.id);};
 for(const t of w.tokenOwnership){const a=t.owner;
  ensure(w.units[t.unit-1].text.slice(t.start,t.end)===t.text,'source binding');
  if(a.kind==='word')wordCheck(words.get(a.occurrenceId),t);
  else if(a.kind==='refined_word_components') {
   const parts=a.occurrences.map(id=>words.get(id));for(const o of parts)wordCheck(o,t,true);
   let end=t.start;for(const o of parts){ensure(o.start>=end&&!/\p{L}/u.test(w.units[t.unit-1].text.slice(end,o.start)),'refined lexical gap');end=o.end;}ensure(end===t.end,'refined complete span');
  } else if(a.kind==='expression_component'){
   const e=expressions.get(a.occurrenceId);ensure(e&&Number(e.unitId.split('_').at(-1))===t.unit&&(e.surfaceId?`${e.surfaceId}:${e.identityId}`:e.identityId)===a.identity,'exact expression owner');
   ensure((e.lexicalSegments??[e]).some(s=>s.start<=t.start&&s.end>=t.end),'expression owns only lexical segments');usedExpressions.add(e.id);
  } else if(a.kind==='complete_word_component'){
   const o=words.get(a.occurrenceId);ensure(o&&o.unit===t.unit&&o.start<=t.start&&o.end>=t.end&&o.identity===a.identity,'complete word component');usedWords.add(o.id);
  } else if(a.kind==='exclusion') {const o=excluded.get(a.occurrenceId);ensure(o&&coord(o)===coord(t),'exact exclusion');usedExcluded.add(o.id);}
  else if(a.kind==='legacy_word_locution_component')ensure(w.wordOccurrences.some(o=>coord(o)===a.anchor&&o.identity===a.identity),'existing attached locution anchor');
  else ensure(false,'unknown source owner');
 }
 ensure(usedWords.size===words.size&&usedExpressions.size===expressions.size&&usedExcluded.size===excluded.size,'no orphan owners');
 const banks=new Map(w.effectiveBanks.map(b=>[b.identity,b]));ensure(banks.size===w.effectiveBanks.length,'unique banks');
 for(const o of words.values()){
  ensure(OccurrenceSchema.safeParse(o).success,'word schema');const s=surface.get(o.surfaceFormId),m=sense.get(o.senseId);
  ensure(s&&m&&s.lemmaId===m.lemmaId,'same lemma');ensure(s.normalized===o.text.toLowerCase()&&w.units[o.unit-1].text.slice(o.start,o.end)===o.text,'exact printed surface');
  ensure(banks.has(o.identity)&&o.identity===`${o.surfaceFormId}:${o.senseId}`,'word bank');
 }
 for(const o of excluded.values())ensure(ExcludedOccurrenceSchema.safeParse(o).success,'exclusion schema');
 const allQuestions=[];
 for(const b of banks.values()) {ensure(b.questions.length===3&&new Set(b.questions.map(q=>q.band)).size===3&&hash(b.questions)===b.questionSha256,'complete fingerprinted bank');for(const q of b.questions){ensure(key(q)===b.identity&&quizEditorialIssues(q).length===0,'prepared question');allQuestions.push(q);}}
 ensure(new Set(allQuestions.map(q=>q.id)).size===allQuestions.length,'unique question IDs');
 const legacy=allQuestions.filter(q=>q.subject.kind==='expression').map(q=>({id:q.id,expressionId:q.subject.expressionId,...q.subject.surfaceId?{surfaceId:q.subject.surfaceId}:{},band:q.band,format:q.format,contextFrench:q.context,correctAnswer:q.choices.find(c=>c.id===q.correctChoiceId).text,...q.band==='levels_1_3'?{targetText:q.targetText,...q.targetSegments?{targetSegments:q.targetSegments}:{},choicesEnglish:q.choices.map(c=>c.text)}:{choicesFrench:q.choices.map(c=>c.text),...q.band==='levels_6_8'?{promptFrench:q.prompt}:{}}}));
 const fixture={works:[{id:w.workId,publicationState:'learning_ready'}],units:w.units.map(u=>({id:`unt_micromegas_${String(u.ordinal).padStart(3,'0')}`,workId:w.workId,french:u.text})),occurrences:w.wordOccurrences,exclusions:w.exclusions};
 const diagnostics=validateExpressionCatalog(fixture,{identities:w.records.expressionIdentities,occurrences:w.expressionOccurrences,preparedQuizzes:legacy});ensure(!diagnostics.length,`expression domain validation ${JSON.stringify(diagnostics.slice(0,5))}`);
 return {tokens:w.tokenOwnership.length,wordOccurrences:words.size,expressionOccurrences:expressions.size,banks:banks.size,questions:allQuestions.length};
}
export function checkCandidate70(folder){const w=JSON.parse(readFileSync(`${folder}/whole-work-candidate-catalog-70.json`)),base=JSON.parse(readFileSync(`${folder}/whole-work-import-composition-42.json`));validateCandidate70(w,base);ensure(hash(w)===hash(composeCandidate70(folder)),'exact recomposition');console.log('Micromégas candidate70: all source owners, final metadata and stored banks verified offline.');return w;}
