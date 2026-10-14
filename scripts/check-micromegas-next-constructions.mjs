import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{composeMicromegasNextConstructions}from'./micromegas-next-constructions.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x));
export function checkMicromegasNextConstructions(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),file='whole-work-next-constructions-53.json',progress=read('whole-work-next-construction-progress-53.json'),data=read(file),dossier=read('dossier.json'),prior=read('whole-work-family-constructions-52.json'),coord=o=>`${o.unit}:${o.start}:${o.end}`;
 if(hash(data)!==hash(composeMicromegasNextConstructions(folder)))throw Error('Next construction source or bank changed');
 if(hash(data.summary)!==hash(progress.summary)||hash(progress.summary)!==hash(dossier.review.wholeWorkNextConstructions.summary)||hash(progress.nextAction)!==hash(dossier.review.wholeWorkNextConstructions.nextAction)||progress.candidateReleaseReady!==false||progress.appliedScopePlans!==0||progress.evidenceSha256[file]!==sha(readFileSync(`${folder}/${file}`)))throw Error('Next construction progress changed');
 const keys=[...data.componentBindings.filter(x=>x.baseOwner.kind==='draft_bank'),...data.remainingDirectDraftOccurrences].map(coord);if(keys.length!==prior.remainingDirectDraftOccurrences.length||new Set(keys).size!==keys.length||keys.some(k=>!prior.remainingDirectDraftOccurrences.some(x=>coord(x)===k)))throw Error('Next construction direct source partition changed');
 console.log('Micromégas next constructions53: four whole expressions, four spans, 12 questions; offline and unapplied.');
}
