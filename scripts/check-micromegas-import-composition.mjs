import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegas} from './micromegas-import-composition.mjs';

export function checkMicromegasImportComposition(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`));
 const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
 const stored=read('whole-work-import-composition-42.json'),fresh=composeMicromegas(folder),progress=read('whole-work-import-progress-42.json'),d=read('dossier.json');
 if(hash(stored)!==hash(fresh))throw Error('Micromégas import composition: exact source/evidence/owner map changed');
 if([progress.summary,d.review.wholeWorkImportComposition.summary].some(s=>hash(s)!==hash(stored.summary))||hash(progress.nextAction)!==hash(d.review.wholeWorkImportComposition.nextAction))throw Error('Micromégas import composition: progress binding changed');
 if(progress.candidateReleaseReady!==false||progress.appliedScopePlans!==0||stored.status!=='offline_source_composition_unapplied')throw Error('Micromégas import composition: source map is not release approval');
 for(const[file,h]of Object.entries(progress.evidenceSha256))if(createHash('sha256').update(readFileSync(`${folder}/${file}`)).digest('hex')!==h)throw Error('Micromégas import composition: progress evidence changed');
 console.log(`Micromégas import composition42: ${stored.summary.sourceTokens} exact tokens; ${stored.summary.phraseSpans} phrases/${stored.summary.phraseComponentUses} owned segments; no overlapping owners or unresolved placeholders. Offline, identities and banks still require materialization.`);
}
