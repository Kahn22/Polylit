import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPublication} from '../dist/publication/repository.js';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(root,n)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const publication=loadPublication(),bundle=publication.bundle;
const lemmaById=new Map(bundle.lemmas.map(l=>[l.id,l]));
const senseByLemma=new Map();for(const s of bundle.senses){const list=senseByLemma.get(s.lemmaId)??[];list.push(s);senseByLemma.set(s.lemmaId,list)}
const surfaceByForm=new Map();for(const s of bundle.surfaceForms){const key=s.normalized??s.form.toLocaleLowerCase('fr');const list=surfaceByForm.get(key)??[];list.push(s);surfaceByForm.set(key,list)}
const lemmaByHead=new Map();for(const l of bundle.lemmas){const key=l.headword.toLocaleLowerCase('fr');const list=lemmaByHead.get(key)??[];list.push(l);lemmaByHead.set(key,list)}
const prior=read('chapter-01-identity-plan.json').items;
const files=readdirSync(root).filter(n=>/^chapter-02-batch-\d\d\.json$/u.test(n)).sort();
const quizBands=(sf,sn)=>[...publication.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===sf&&q.subject.senseId===sn).map(q=>q.band).sort();
const items=files.flatMap(file=>read(file).items.map(item=>{
 const exact=(surfaceByForm.get(item.form.toLocaleLowerCase('fr'))??[]).flatMap(surface=>(senseByLemma.get(surface.lemmaId)??[]).map(sense=>({identity:`${surface.id}:${sense.id}`,gloss:sense.gloss,definition:sense.definition,preparedBands:quizBands(surface.id,sense.id)}))).filter(candidate=>candidate.preparedBands.length===3);
 const lemmas=(lemmaByHead.get(item.lemma.toLocaleLowerCase('fr'))??[]).map(lemma=>({lemmaId:lemma.id,partOfSpeech:lemma.partOfSpeech,senses:(senseByLemma.get(lemma.id)??[]).map(sense=>({senseId:sense.id,gloss:sense.gloss,definition:sense.definition}))}));
 const chapterOne=prior.filter(entry=>entry.lemma.toLocaleLowerCase('fr')===item.lemma.toLocaleLowerCase('fr')).map(entry=>({key:entry.key,meaning:entry.meaning,route:entry.route,intendedSenseGroup:entry.intendedSenseGroup,...(entry.targetSenseId?{targetSenseId:entry.targetSenseId}:{}),...(entry.targetIdentity?{targetIdentity:entry.targetIdentity}:{})}));
 return {key:item.key,form:item.form,lemma:item.lemma,partOfSpeech:item.partOfSpeech,meaning:item.meaning,sourceOccurrences:item.sourceOccurrences,questionSha256:sha(JSON.stringify(item.questions)),sourceOccurrencesSha256:sha(JSON.stringify(item.sourceOccurrences)),batchFile:file,exactPublished:exact,publishedLemmaCandidates:lemmas,chapterOneRelated:chapterOne,status:'identity_route_editorial_decision_pending'};
}));
const output={version:1,workId:'wrk_voltaire_micromegas',chapter:2,status:'offline_identity_candidate_packet_not_editorial_approval',sourceSha256:sha(readFileSync(resolve(root,'canonical-draft.txt'))),unitPlanSha256:sha(readFileSync(resolve(root,'unit-plan.json'))),batchEvidence:Object.fromEntries(files.map(n=>[n,sha(readFileSync(resolve(root,n)))])),publishedCandidateSnapshotSha256:sha(JSON.stringify(bundle.surfaceForms)+JSON.stringify(bundle.senses)+JSON.stringify(bundle.lemmas)),note:'Candidate lookup only. Similar spellings and shared lemmas are not approvals; every new chapter II meaning needs a source-and-question-aware identity route.',items};
writeFileSync(resolve(root,'chapter-02-identity-packet.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({meanings:items.length,exactPublished:items.filter(i=>i.exactPublished.length).length,lemmaCandidates:items.filter(i=>i.publishedLemmaCandidates.length).length,chapterOneRelated:items.filter(i=>i.chapterOneRelated.length).length}));
