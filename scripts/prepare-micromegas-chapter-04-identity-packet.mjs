import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPublication} from './micromegas-publication-baseline.mjs';
const root=resolve('content/sources/wrk_voltaire_micromegas'),read=n=>JSON.parse(readFileSync(resolve(root,n)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const bundle=loadPublication().bundle,lemmas=new Map(bundle.lemmas.map(l=>[l.id,l])),senses=Map.groupBy(bundle.senses,s=>s.lemmaId),frenchSurfaces=bundle.surfaceForms.filter(s=>!s.lemmaId.startsWith('lem_es_')),surfaces=Map.groupBy(frenchSurfaces,s=>s.form.toLocaleLowerCase('fr')),byHead=Map.groupBy(bundle.lemmas.filter(l=>!l.id.startsWith('lem_es_')),l=>l.headword.toLocaleLowerCase('fr'));
const prior=[...read('chapter-01-identity-plan.json').items.map(i=>({...i,priorChapter:1})),...read('chapter-02-identity-plan.json').items.map(i=>({...i,priorChapter:2})),...read('chapter-03-identity-plan.json').items.map(i=>({...i,priorChapter:3}))];
const files=readdirSync(root).filter(n=>/^chapter-04-batch-\d\d\.json$/u.test(n)).sort();
const items=files.flatMap(file=>read(file).items.map(item=>{
 const related=prior.filter(i=>i.lemma.toLocaleLowerCase('fr')===item.lemma.toLocaleLowerCase('fr')).map(i=>({key:i.key,chapter:i.priorChapter,form:i.form,meaning:i.meaning,route:i.route,...(i.targetSenseId?{targetSenseId:i.targetSenseId}:{}),...(i.intendedSenseGroup?{intendedSenseGroup:i.intendedSenseGroup}:{})}));
 const publishedExact=(surfaces.get(item.form.toLocaleLowerCase('fr'))??[]).flatMap(surface=>(senses.get(surface.lemmaId)??[]).map(sense=>({identity:`${surface.id}:${sense.id}`,gloss:sense.gloss,definition:sense.definition})));
 const publishedLemmaCandidates=(byHead.get(item.lemma.toLocaleLowerCase('fr'))??[]).map(l=>({lemmaId:l.id,partOfSpeech:l.partOfSpeech,senses:(senses.get(l.id)??[]).map(s=>({senseId:s.id,gloss:s.gloss,definition:s.definition}))}));
 return {key:item.key,form:item.form,lemma:item.lemma,meaning:item.meaning,partOfSpeech:item.partOfSpeech,batchFile:file,sourceOccurrences:item.sourceOccurrences,questionSha256:sha(JSON.stringify(item.questions)),sourceOccurrencesSha256:sha(JSON.stringify(item.sourceOccurrences)),publishedExact,publishedLemmaCandidates,relatedEarlierPlans:related,status:'identity_route_editorial_decision_pending'};
}));
const output={version:1,workId:'wrk_voltaire_micromegas',chapter:4,status:'offline_identity_candidate_packet_not_editorial_approval',sourceSha256:sha(readFileSync(resolve(root,'canonical-draft.txt'))),unitPlanSha256:sha(readFileSync(resolve(root,'unit-plan.json'))),publishedCandidateSnapshotSha256:sha(JSON.stringify(bundle.lemmas)+JSON.stringify(bundle.senses)+JSON.stringify(bundle.surfaceForms)),batchEvidence:Object.fromEntries(files.map(f=>[f,sha(readFileSync(resolve(root,f)))])),items};
writeFileSync(resolve(root,'chapter-04-identity-packet.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({meanings:items.length,exact:items.filter(i=>i.publishedExact.length).length,lemmas:items.filter(i=>i.publishedLemmaCandidates.length).length,earlier:items.filter(i=>i.relatedEarlierPlans.length).length}));
