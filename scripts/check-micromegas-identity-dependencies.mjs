import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegasIdentityDependencies} from './micromegas-identity-dependencies.mjs';

export function checkMicromegasIdentityDependencies(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`));
 const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
 const stored=read('whole-work-identity-dependencies-43.json'),fresh=composeMicromegasIdentityDependencies(folder),progress=read('whole-work-identity-progress-43.json'),dossier=read('dossier.json');
 if(hash(stored)!==hash(fresh))throw Error('Micromégas identity dependencies: declarations, banks or source bindings changed');
 if([progress.summary,dossier.review.wholeWorkIdentityDependencies.summary].some(s=>hash(s)!==hash(stored.summary))||hash(progress.nextAction)!==hash(dossier.review.wholeWorkIdentityDependencies.nextAction))throw Error('Micromégas identity dependencies: progress binding changed');
 if(progress.candidateReleaseReady!==false||progress.appliedScopePlans!==0||stored.status!=='offline_declared_dependency_graph_unapplied')throw Error('Micromégas identity dependencies: no approval or scope application');
 for(const[file,h]of Object.entries(progress.evidenceSha256))if(createHash('sha256').update(readFileSync(`${folder}/${file}`)).digest('hex')!==h)throw Error('Micromégas identity dependencies: evidence changed');
 console.log(`Micromégas identity dependencies43: ${stored.summary.declarations} declared identities/${stored.summary.storedBanks} exact stored banks; ${stored.summary.declaredSameSenseLinks} same-sense and ${stored.summary.declaredLemmaOnlyLinks} lemma-only links. Final source overrides and bank selection remain offline.`);
}
