import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{composeMicromegasResolution58}from'./micromegas-source-resolution-58.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),coord=o=>`${o.unit}:${o.start}:${o.end}`;
export function checkMicromegasResolution58(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),ensure=(b,m)=>{if(!b)throw Error(`Micromégas package58: ${m}`);};
 const p=read('whole-work-mixed-de-resolution-58.json'),again=composeMicromegasResolution58(folder),progress=read('whole-work-mixed-de-progress-58.json'),d=read('dossier.json');
 ensure(hash(p)===hash(again),'exact independent recomposition');
 ensure(p.status==='offline_micromegas_mixed_de_resolution_unapplied'&&p.summary.newExpressionMeanings===1&&p.summary.newExpressionSurfaceKeys===2&&p.summary.expressionSourceSpans===4&&p.summary.ownedLexicalComponents===8&&p.summary.storedPreparedQuestionBands===6,'exact package counts');
 ensure(p.occurrences.length===4&&new Set(p.occurrences.map(o=>o.surfaceId)).size===2&&p.banks.length===2,'same meaning, two forms, four occurrences and one question set per surface');
 ensure(p.components.length===8&&new Set(p.components.map(c=>`${c.unit}:${c.start}:${c.end}`)).size===8,'exact lexical token ownership');
 ensure(p.quantityPrepositionReassignment.toOwner.identity==='srf_de:sns_de_primary'&&p.quantityPrepositionReassignment.fromOwner.key==='de_partitive','quantity preposition remains separate');
 const prev=read('whole-work-source-words-57.json'),old=new Set(prev.remainingDirectDraftOccurrences.map(coord)),moved=p.sourceUsePartition.reassignedToCompletePartitiveExpression.map(coord),qty=[coord(p.quantityPrepositionReassignment)],remaining=p.sourceUsePartition.remainingDirectDraftSourceUses.map(coord),partition=[...moved,...qty,...remaining];
 ensure(partition.length===old.size&&new Set(partition).size===partition.length&&partition.every(x=>old.has(x))&&remaining.length===676,'exact disjoint partition of previous direct-use queue');
 ensure(hash(progress.summary)===hash(p.summary)&&hash(progress.nextAction)===hash(p.nextAction)&&progress.candidateReleaseReady===false&&progress.appliedScopePlans===0&&d.review.wholeWorkMixedDeResolution58.file==='whole-work-mixed-de-progress-58.json','offline progress record and dossier linkage');
 for(const[f,h]of Object.entries(progress.evidenceSha256))ensure(sha(readFileSync(`${folder}/${f}`))===h,'progress fingerprint');
 console.log('Micromégas package58: five de uses resolved to one preposition route and four complete partitive expressions; exact partition verified. Offline and unapplied.');
}
