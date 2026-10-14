import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegasDirectWordPackage} from './micromegas-direct-word-package.mjs';
import {composeMicromegasDirectBankRefinements} from './micromegas-direct-bank-refinements.mjs';
export function checkMicromegasDirectWordPackage(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x));
 const data=read('whole-work-direct-word-package-46.json'),progress=read('whole-work-direct-word-progress-46.json'),d=read('dossier.json');
 if(hash(read('whole-work-direct-bank-refinements-46.json'))!==hash(composeMicromegasDirectBankRefinements(folder))||hash(data)!==hash(composeMicromegasDirectWordPackage(folder)))throw Error('Micromégas direct package46: source, identity, bank or refinement drift');
 if(hash(data.summary)!==hash(progress.summary)||hash(progress.summary)!==hash(d.review.wholeWorkDirectWordPackage.summary)||hash(progress.nextAction)!==hash(d.review.wholeWorkDirectWordPackage.nextAction))throw Error('Micromégas direct package46: progress drift');
 if(progress.candidateReleaseReady!==false||progress.appliedScopePlans!==0)throw Error('Micromégas direct package46: no release approval');
 for(const[f,h]of Object.entries(progress.evidenceSha256))if(sha(readFileSync(`${folder}/${f}`))!==h)throw Error('Micromégas direct package46: progress evidence drift');
 console.log(`Micromégas direct package46: ${data.summary.boundDirectDraftSourceUses} uses,100 word keys,300 stored questions;13 explicit holds. Offline and unapplied.`);
}
