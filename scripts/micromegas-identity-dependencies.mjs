import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));

/** Resolve declared chapter dependencies only. Never infer a merge from a gloss. */
export function composeMicromegasIdentityDependencies(folder){
 const evidence={},cache=new Map(),nodes=new Map(),bankNodes=new Map();
 const ensure=(ok,message)=>{if(!ok)throw Error(`Micromégas identity dependencies: ${message}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const files=readdirSync(folder).filter(f=>f.endsWith('.json')).sort();
 const publication=loadPublication(),senses=new Map(publication.bundle.senses.map(s=>[s.id,s])),lemmas=new Map(publication.bundle.lemmas.map(l=>[l.id,l]));
 const frenchLemmas=new Set(publication.sharedSources.fr.legacy.content.lemmas.map(l=>l.id));
 const add=(file,index,item)=>{const id=`${file}:${item.key}`;ensure(!nodes.has(id),`duplicate declaration ${id}`);nodes.set(id,{id,file,index,item,bank:null});};
 for(const file of files.filter(f=>/^chapter-0[1-5]-identity-plan\.json$/.test(f)||/^chapter-0[67]-identity-targets-\d+\.json$/.test(f)))read(file).items.forEach((i,n)=>add(file,n,i));
 const held='chapter-06-held-context-review-03.json';read(held).items.forEach((i,n)=>add(held,n,i));
 for(const n of nodes.values()){
  let bank=n.item.batchFile;
  if(!bank){const chapter=n.file.match(/^chapter-(\d+)/)[1];const candidates=files.filter(f=>new RegExp(`^chapter-${chapter}-(?:held-)?batch-\\d+\\.json$`).test(f)).filter(f=>read(f).items.some(i=>i.key===n.item.key&&i.questions));ensure(candidates.length===1||n.file===held,`one exact bank for ${n.id}: ${candidates}`);bank=n.file===held?held:candidates[0];}
  const items=read(bank).items,index=items.findIndex(i=>i.key===n.item.key),b=items[index];ensure(b?.questions?.length===3,`three-band bank ${bank}:${n.item.key}`);
  ensure(hash(b.questions)===n.item.questionSha256,`declared question hash ${n.id}`);
  n.bank={file:bank,key:n.item.key,selector:`/items/${index}`,questionSha256:hash(b.questions)};
  const bankId=`${bank}:${n.item.key}`;ensure(!bankNodes.has(bankId),`multiple bank declarations ${bankId}`);bankNodes.set(bankId,n.id);
 }
 const groups=new Map();
 for(const n of nodes.values())if(n.item.intendedSenseGroup&&!n.item.route?.startsWith('link_')){const id=n.item.intendedSenseGroup;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(n.id);}
 const chapterOneLemmaReviews=new Map(['chapter-01-shared-identity-01.json','chapter-01-shared-lemma-01.json','chapter-01-shared-lemma-02.json'].flatMap(file=>read(file).items.map(i=>[i.key,{file,item:i}])));
 const get=id=>{const n=nodes.get(id);ensure(n,`missing named predecessor ${id}`);return n;};
 const published=senseId=>{ensure(senses.has(senseId),`missing published sense ${senseId}`);const sense=senses.get(senseId);ensure(frenchLemmas.has(sense.lemmaId),`French sense ${senseId}`);return {kind:'published_sense',senseId,lemma:{kind:'published_lemma',lemmaId:sense.lemmaId}};};
 const routes=new Map(),visiting=new Set();
 const resolve=id=>{
  if(routes.has(id))return routes.get(id);ensure(!visiting.has(id),`dependency cycle at ${id}`);visiting.add(id);
  const n=get(id),i=n.item;let root,dependency=null,relation=null;
  const link=(target,kind)=>{target=bankNodes.get(target)??target;dependency=target;relation=kind;const prior=resolve(target);return kind==='same_sense'?prior.root:{kind:'planned_sense',declaration:id,lemma:prior.root.lemma};};
  if(i.targetSenseId)root=published(i.targetSenseId);
  else if(i.targetIdentity)root=published(i.targetIdentity.split(':')[1]);
  else if(i.route?.startsWith('link_planned')){
   let target=i.dependsOn;
   if(!target){const candidates=groups.get(i.intendedSenseGroup)??[];ensure(candidates.length>0,`named sense group ${id}`);target=candidates[0];}
   root=link(target,'same_sense');
  }else if(i.route?.startsWith('new_sense_planned'))root=link(i.dependsOn,'same_lemma_separate_sense');
  else if(i.target){
   const t=i.target;
   if(t.startsWith('sns_'))root=published(t);
   else if(t.startsWith('prior:'))root=link(t.slice(6),'same_sense');
   else if(t.startsWith('prior-bank:')){const target=bankNodes.get(t.slice(11));ensure(target,`named prior bank ${id}: ${t}`);root=link(target,'same_sense');}
   else if(t.startsWith('new-prior:'))root=link(t.slice(10),'same_lemma_separate_sense');
   else if(t.startsWith('same:')){const candidates=[...nodes.values()].filter(other=>other.file===n.file&&other.item.form===t.slice(5)&&other.id!==id);ensure(candidates.length===1,`unambiguous same-form predecessor ${id}`);root=link(candidates[0].id,'same_sense');}
   else{ensure(t==='new'||t.startsWith('new:lem_'),`unknown target ${id}: ${t}`);const lemmaId=t.startsWith('new:')?t.slice(4):null;if(lemmaId)ensure(frenchLemmas.has(lemmaId),`French existing lemma ${lemmaId}`);root={kind:'planned_sense',declaration:id,lemma:lemmaId?{kind:'published_lemma',lemmaId}:{kind:'planned_lemma',declaration:id}};}
  }else{
   const group=groups.get(i.intendedSenseGroup)??[id];
   if(group[0]!==id)root=link(group[0],'same_sense');
   else{if(i.targetLemmaId)ensure(frenchLemmas.has(i.targetLemmaId),`French existing lemma ${i.targetLemmaId}`);let lemma=i.targetLemmaId?{kind:'published_lemma',lemmaId:i.targetLemmaId}:{kind:'planned_lemma',declaration:id};if(n.file==='chapter-01-identity-plan.json'&&i.route==='new_sense'){const review=chapterOneLemmaReviews.get(i.key);ensure(['new_sense_existing_lemma','separate'].includes(review?.item.decision),`existing-lemma review ${id}`);lemma={kind:'published_lemma_pending_exact_binding',headword:i.lemma,candidateLemmaIds:[...lemmas.values()].filter(l=>frenchLemmas.has(l.id)&&l.headword.toLocaleLowerCase('fr')===i.lemma.toLocaleLowerCase('fr')).map(l=>l.id),evidence:{file:review.file,key:i.key}};ensure(lemma.candidateLemmaIds.length>0,`existing lemma candidates ${id}`);if(lemma.candidateLemmaIds.length===1)lemma={kind:'published_lemma',lemmaId:lemma.candidateLemmaIds[0],binding:'unique_existing_headword_in_declared_lemma_review',evidence:lemma.evidence};}root={kind:'planned_sense',declaration:id,lemma};}
  }
  const r={declaration:id,evidence:{file:n.file,selector:`/items/${n.index}`},form:i.form,lemmaText:i.lemma,bank:n.bank,declaredRoute:i.route??i.target,dependency,relation,root};routes.set(id,r);visiting.delete(id);return r;
 };
 for(const id of nodes.keys())resolve(id);
 const composition=read('whole-work-import-composition-42.json'),active=new Map(),overlays=[];
 for(const t of composition.tokens){
  if(t.owner.kind==='draft_bank'){
   const bankId=`${t.owner.file}:${t.owner.key}`,id=bankNodes.get(bankId);ensure(id,`unbound active source bank ${bankId}`);const r=resolve(id),identityKey=`${t.form}:${r.root.kind==='published_sense'?r.root.senseId:r.root.declaration}`;
   if(!active.has(identityKey))active.set(identityKey,{surface:t.form,root:r.root,banks:new Map(),occurrences:[]});const a=active.get(identityKey);a.banks.set(bankId,r.bank);a.occurrences.push({unit:t.unit,start:t.start,end:t.end,text:t.text});
  }else if(t.owner.kind==='reviewed_sense_route')overlays.push({unit:t.unit,start:t.start,end:t.end,text:t.text,senseTarget:t.owner.senseTarget,evidence:t.overlays.at(-1).evidence});
 }
 const bankGroups=[...active.values()].map(a=>({...a,banks:[...a.banks.values()],distinctQuestionBanks:new Set([...a.banks.values()].map(b=>b.questionSha256)).size}));
 const roots=[...routes.values()].map(r=>r.root),rootKey=r=>r.kind==='published_sense'?r.senseId:r.declaration;
 const summary={declarations:routes.size,storedBanks:bankNodes.size,declaredSameSenseLinks:[...routes.values()].filter(r=>r.relation==='same_sense').length,declaredLemmaOnlyLinks:[...routes.values()].filter(r=>r.relation==='same_lemma_separate_sense').length,publishedSenseRoots:new Set(roots.filter(r=>r.kind==='published_sense').map(rootKey)).size,plannedSenseRoots:new Set(roots.filter(r=>r.kind==='planned_sense').map(rootKey)).size,pendingExactLemmaBindings:new Set(roots.filter(r=>r.lemma.kind==='published_lemma_pending_exact_binding').map(r=>r.lemma.headword)).size,directDraftSourceUses:bankGroups.reduce((n,g)=>n+g.occurrences.length,0),directDraftIdentityGroups:bankGroups.length,repeatedBankGroups:bankGroups.filter(g=>g.banks.length>1).length,questionSelectionGroups:bankGroups.filter(g=>g.distinctQuestionBanks>1).length,wholeWorkOverrideUses:overlays.length};
 return {version:1,workId:composition.workId,status:'offline_declared_dependency_graph_unapplied',sourceSha256:composition.sourceSha256,publicationBaseline:composition.publicationBaseline,policy:'Only named same-sense dependencies and explicit intendedSenseGroups join meanings. Lemma-only dependencies keep separate sense roots. Historical declarations remain evidence; whole-work source overrides require final binding before import. No generated identity IDs, question selection, mastery migration or approval.',evidenceSha256:evidence,declarations:[...routes.values()],directDraftBankGroups:bankGroups,wholeWorkOverrides:overlays,summary};
}
