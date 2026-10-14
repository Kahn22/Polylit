import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {composeMicromegasResolvedBankRefinements} from './micromegas-resolved-bank-refinements.mjs';
import {composeMicromegasResolvedWordPackage} from './micromegas-resolved-word-package.mjs';
import {composeMicromegasResolvedExpressions} from './micromegas-resolved-expressions.mjs';
export function checkMicromegasResolvedPackages(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),ensure=(ok,m)=>{if(!ok)throw Error(`Micromégas resolved47/48: ${m}`);};
 const words=read('whole-work-resolved-word-package-47.json'),expressions=read('whole-work-resolved-expressions-48.json'),d=read('dossier.json');
 ensure(hash(read('whole-work-resolved-bank-refinements-47.json'))===hash(composeMicromegasResolvedBankRefinements(folder)),'question refinement drift');
 ensure(hash(words)===hash(composeMicromegasResolvedWordPackage(folder))&&hash(expressions)===hash(composeMicromegasResolvedExpressions(folder)),'source, owner, sense, bank or phrase drift');
 for(const[data,file,key]of[[words,'whole-work-resolved-word-progress-47.json','wholeWorkResolvedWords'],[expressions,'whole-work-resolved-expression-progress-48.json','wholeWorkResolvedExpressions']]){
  const p=read(file);ensure(hash(data.summary)===hash(p.summary)&&hash(p.summary)===hash(d.review[key].summary)&&hash(p.nextAction)===hash(d.review[key].nextAction),'progress drift');ensure(p.candidateReleaseReady===false&&p.appliedScopePlans===0,'offline unapplied state');
  for(const[f,h]of Object.entries(p.evidenceSha256))ensure(sha(readFileSync(`${folder}/${f}`))===h,'exact progress evidence');
 }
 const p=loadPublication(),snapshot=read('whole-work-legacy-owner-snapshot-47.json');
 for(const[k,current]of[['lemmas',p.bundle.lemmas],['senses',p.bundle.senses],['surfaces',p.bundle.surfaceForms],['quizzes',[...p.preparedQuizzes.values()]]]){const byId=new Map(current.map(r=>[r.id,r]));for(const r of snapshot[k])ensure(hash(r)===hash(byId.get(r.id)),`retained legacy ${k} revision ${r.id}`);}
 const byId=new Map(p.bundle.occurrences.map(o=>[o.id,o])),units=new Map(p.bundle.units.map(u=>[u.id,u.french]));for(const o of snapshot.occurrences){const {context,...original}=o;ensure(hash(original)===hash(byId.get(o.id))&&context===units.get(o.unitId),'retained legacy source');}
 console.log('Micromégas resolved47/48:103 word keys/205 uses/309 questions;3 full expression keys/4 spans/9 questions. Offline and unapplied.');
}
