import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';
import {loadPublication} from './micromegas-publication-baseline.mjs';

const folder=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(folder,n)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const unitBytes=readFileSync(resolve(folder,'unit-plan.json'));
const units=JSON.parse(unitBytes).units;
const sourceSha256=sha(readFileSync(resolve(folder,'canonical-draft.txt')));
const unitPlanSha256=sha(unitBytes);
const publication=loadPublication();
const gap=JSON.parse(readFileSync(resolve('content/pipeline/wrk_voltaire_micromegas/lexical-gap-report.json')));
const forms=new Map(gap.forms.map(f=>[f.form,f]));
const prior=new Map();
for(const name of readdirSync(folder).filter(n=>/^chapter-0[123]-batch-\d\d\.json$/u.test(n)).sort()){
 for(const item of read(name).items)for(const o of item.sourceOccurrences){
  if(o.chapter<4)continue;
  const key=`${o.unit}:${o.start}:${o.end}`;
  if(prior.has(key))throw Error(`Prior draft overlap ${key}`);
  prior.set(key,{file:name,key:item.key,meaning:item.meaning,questionSha256:sha(JSON.stringify(item.questions))});
 }
}
const quizBands=new Map();
for(const q of publication.preparedQuizzes.values())if(q.subject?.kind==='vocabulary'){
 const key=`${q.subject.surfaceFormId}:${q.subject.senseId}`;
 quizBands.set(key,[...(quizBands.get(key)??[]),q.band]);
}
const surfaces=new Map(publication.bundle.surfaceForms.map(s=>[s.id,s]));
const senses=new Map(publication.bundle.senses.map(s=>[s.id,s]));
const lemmas=new Map(publication.bundle.lemmas.map(l=>[l.id,l]));
for(let chapter=4;chapter<=7;chapter++){
 const tokens=[];
 for(const unit of units.filter(u=>u.chapter===chapter))for(const token of tokenizeFrench(unit.text)){
  const key=`${unit.ordinal}:${token.start}:${token.end}`,form=token.text.toLocaleLowerCase('fr');
  const index=forms.get(form);
  if(!index)throw Error(`Gap report missing ${form}`);
  const earlier=prior.get(key);
  const candidates=index.candidateIdentities.map(c=>{
   const [surfaceId,senseId]=c.split(':');
   const surface=surfaces.get(surfaceId),sense=senses.get(senseId);
   if(!surface||!sense||surface.lemmaId!==sense.lemmaId)throw Error(`Invalid candidate ${c.identity}`);
   return {identity:c,lemma:lemmas.get(surface.lemmaId)?.headword,gloss:sense.gloss,definition:sense.definition,preparedBands:[...(quizBands.get(c)??[])].sort()};
  });
  tokens.push({unit:unit.ordinal,paragraphIndex:unit.paragraphIndex,start:token.start,end:token.end,text:token.text,form,context:unit.text.slice(Math.max(0,token.start-42),Math.min(unit.text.length,token.end+58)),disposition:earlier?'earlier_authored_draft_context_to_reconcile':candidates.length===0?'no_exact_published_identity_context_pending':candidates.length===1?'one_published_candidate_context_pending':'multiple_published_candidates_context_pending',...(earlier?{earlierDraft:earlier}:{}),candidates});
 }
 const summary={tokenUses:tokens.length,distinctForms:new Set(tokens.map(t=>t.form)).size,priorAuthoredUses:tokens.filter(t=>t.earlierDraft).length,zeroCandidateUses:tokens.filter(t=>!t.earlierDraft&&!t.candidates.length).length,oneCandidateUses:tokens.filter(t=>!t.earlierDraft&&t.candidates.length===1).length,multipleCandidateUses:tokens.filter(t=>!t.earlierDraft&&t.candidates.length>1).length,reviewedTokenUses:0};
 summary.unresolvedTokenUses=summary.tokenUses-summary.priorAuthoredUses;
 const result={version:1,workId:'wrk_voltaire_micromegas',chapter,status:'complete_source_inventory_editorial_decisions_pending',sourceSha256,unitPlanSha256,summary,tokens};
 const name=`chapter-${String(chapter).padStart(2,'0')}-inventory.json`;
 writeFileSync(resolve(folder,name),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({chapter,...summary}));
}
