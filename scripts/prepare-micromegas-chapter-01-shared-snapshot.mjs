import {createHash} from 'node:crypto';
import {loadPublication} from '../dist/publication/repository.js';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const publication=loadPublication();
const surfaces=publication.bundle.surfaceForms;
const senses=publication.bundle.senses;
const quizzes=[...publication.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary');
const occurrences=publication.bundle.occurrences;
const candidateCache=new Map();
const lemmaCache=new Map();
export const currentExactCandidates=form=>{
 if(candidateCache.has(form))return candidateCache.get(form);
 const exactSurfaces=surfaces.filter(s=>s.form.toLocaleLowerCase('fr')===form);
 const result=exactSurfaces.flatMap(surface=>senses.filter(s=>s.lemmaId===surface.lemmaId).map(sense=>{
  const identity=`${surface.id}:${sense.id}`;
  const selectedQuizzes=quizzes.filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===sense.id).sort((a,b)=>a.band.localeCompare(b.band));
  const selectedOccurrences=occurrences.filter(o=>o.surfaceFormId===surface.id&&o.senseId===sense.id).map(o=>({workId:o.workId,unitId:o.unitId,start:o.start,end:o.end})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return {identity,gloss:sense.gloss,definition:sense.definition,quizCount:selectedQuizzes.length,quizSha256:hash(selectedQuizzes),publishedOccurrenceCount:selectedOccurrences.length,occurrencesSha256:hash(selectedOccurrences)};
 })).sort((a,b)=>a.identity.localeCompare(b.identity));
 candidateCache.set(form,result);
 return result;
};
export const exactCandidateHash=form=>hash(currentExactCandidates(form));
export const currentFrenchLemmaSenses=headword=>{
 const normalized=headword.toLocaleLowerCase('fr');
 if(lemmaCache.has(normalized))return lemmaCache.get(normalized);
 const matchingLemmas=publication.bundle.lemmas.filter(l=>!l.id.startsWith('lem_es_')&&l.headword.toLocaleLowerCase('fr')===normalized);
 const result=matchingLemmas.flatMap(lemma=>senses.filter(s=>s.lemmaId===lemma.id&&!s.id.startsWith('sns_es_')).map(sense=>{
  const linkedSurfaces=surfaces.filter(s=>s.lemmaId===lemma.id);
  const selectedQuizzes=quizzes.filter(q=>linkedSurfaces.some(s=>s.id===q.subject.surfaceFormId)&&q.subject.senseId===sense.id).sort((a,b)=>a.id.localeCompare(b.id));
  const selectedOccurrences=occurrences.filter(o=>linkedSurfaces.some(s=>s.id===o.surfaceFormId)&&o.senseId===sense.id).map(o=>({workId:o.workId,unitId:o.unitId,start:o.start,end:o.end})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return {lemmaId:lemma.id,senseId:sense.id,gloss:sense.gloss,definition:sense.definition,linkedSurfaceCount:linkedSurfaces.length,quizCount:selectedQuizzes.length,quizSha256:hash(selectedQuizzes),publishedOccurrenceCount:selectedOccurrences.length,occurrencesSha256:hash(selectedOccurrences)};
 })).sort((a,b)=>a.senseId.localeCompare(b.senseId));
 lemmaCache.set(normalized,result);
 return result;
};
export const frenchLemmaSnapshotHash=headword=>hash(currentFrenchLemmaSenses(headword));
