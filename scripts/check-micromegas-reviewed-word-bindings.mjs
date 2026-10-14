import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegasReviewedWords} from './micromegas-reviewed-word-bindings.mjs';
import {composeMicromegasReviewedWordBanks} from './micromegas-reviewed-word-banks.mjs';

export function checkMicromegasReviewedWordBindings(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex'),d=read('dossier.json');
 const words=composeMicromegasReviewedWords(folder),banks=composeMicromegasReviewedWordBanks(folder,words);
 for(const[f,p,key,fresh]of[['whole-work-reviewed-word-bindings-44.json','whole-work-reviewed-word-progress-44.json','wholeWorkReviewedWordBindings',words],['whole-work-reviewed-word-banks-45.json','whole-work-reviewed-bank-progress-45.json','wholeWorkReviewedWordBanks',banks]]){
  const stored=read(f),progress=read(p);if(hash(stored)!==hash(fresh))throw Error('Micromégas reviewed words: exact source, identity, bank or evidence drift');
  if([progress.summary,d.review[key].summary].some(s=>hash(s)!==hash(stored.summary))||hash(progress.nextAction)!==hash(d.review[key].nextAction))throw Error('Micromégas reviewed words: summary or next action drift');
  if(progress.candidateReleaseReady!==false||progress.appliedScopePlans!==0)throw Error('Micromégas reviewed words: candidate composition is not approval');
  for(const[name,h]of Object.entries(progress.evidenceSha256))if(createHash('sha256').update(readFileSync(`${folder}/${name}`)).digest('hex')!==h)throw Error('Micromégas reviewed words: progress evidence drift');
 }
 console.log(`Micromégas reviewed word composition44/45: ${words.summary.reviewedSourceUses} exact uses/${words.summary.reviewedIdentityGroups} final keys; ${banks.summary.storedPreparedQuestionBands} stored prepared bands; one exact sentit correction. Offline and unapplied.`);
}
