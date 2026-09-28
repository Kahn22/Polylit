import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {tokenizeFrench} from '../dist/ingestion/tokenize.js';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=readFileSync(resolve(dir,'unit-plan.json')),plan=JSON.parse(bytes),draft=readFileSync(resolve(dir,'canonical-draft.txt'));
const hash=b=>createHash('sha256').update(b).digest('hex');
// Each line records a contextual meaning and separately authored three-band choices.
const records=[
{form:'été',offsets:['46:5'],key:'ete_been_in_place',lemma:'être',pos:'past participle in j’ai été',meaning:'been; stayed or visited a place',note:'J’ai été dans les pays means the traveler has been in those places. The published été question set tests being happy or being a guide; this spatial-presence use needs its own contextual identity and three bands.',q13:['J’ai été dans plusieurs pays lointains.','been to those places','been happy','been a guide','been forgotten'],q45:['Je me suis trouvé dans ce pays autrefois : j’y ai ___.','été','dormi','travaillé','couru'],q68:['J’ai été dans ce pays signifie que je m’y suis trouvé. J’y ai dormi si j’y ai passé une nuit, travaillé si j’y ai exercé une activité et couru si j’y ai fait une course.','Quel participe indique simplement ma présence passée ?','été','dormi','travaillé','couru']}
];
const prior=new Set(Array.from({length:24},(_,n)=>JSON.parse(readFileSync(resolve(dir,`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`))).items).flat().flatMap(i=>(i.sourceOccurrences??[]).filter(o=>o.chapter===2).map(o=>`${o.unit}:${o.start}:${o.end}`)));
for(const filename of ['chapter-02-batch-01.json','chapter-02-batch-02.json','chapter-02-batch-03.json','chapter-02-batch-04.json','chapter-02-batch-05.json','chapter-02-batch-06.json','chapter-02-batch-07.json','chapter-02-batch-08.json','chapter-02-batch-09.json','chapter-02-batch-10.json','chapter-02-batch-11.json','chapter-02-batch-12.json','chapter-02-batch-13.json','chapter-02-batch-14.json','chapter-02-batch-15.json','chapter-02-batch-16.json','chapter-02-batch-17.json']) for(const item of JSON.parse(readFileSync(resolve(dir,filename))).items)for(const o of item.sourceOccurrences)prior.add(`${o.unit}:${o.start}:${o.end}`);
for(let b=0;b<1;b++){
 const items=records.slice(b*10,(b+1)*10).map(r=>{
  const sourceOccurrences=plan.units.filter(u=>u.chapter===2).flatMap(u=>tokenizeFrench(u.text).filter(t=>t.text.toLocaleLowerCase('fr')===r.form&&(!r.offsets||r.offsets.includes(`${u.ordinal}:${t.start}`))).map(t=>({chapter:2,unit:u.ordinal,start:t.start,end:t.end,text:t.text})));
  if(!sourceOccurrences.length)throw Error(`Missing ${r.form}`);
  for(const o of sourceOccurrences){const k=`${o.unit}:${o.start}:${o.end}`;if(prior.has(k))throw Error(`Prior overlap ${k}`);prior.add(k)}
  const [c13,...a13]=r.q13,[c45,...a45]=r.q45,[c68,p68,...a68]=r.q68;
  if(!c13.toLocaleLowerCase('fr').includes(r.form)||c45.match(/___/gu)?.length!==1||a45[0].toLocaleLowerCase('fr')!==r.form||[a13,a45,a68].some(a=>a.length!==4||new Set(a).size!==4)||a68.some(a=>!c68.toLocaleLowerCase('fr').includes(a.toLocaleLowerCase('fr'))))throw Error(`Question mismatch ${r.form}`);
  return {key:r.key,form:r.form,lemma:r.lemma,partOfSpeech:r.pos,meaning:r.meaning,editorialNote:r.note,formCoverage:'contextual_sense_subset',sourceOccurrences,status:'chapter_two_context_reviewed_question_signoff_pending',questions:[{band:'1-3',context:c13,question:'Meaning',answer:a13[0],choices:a13},{band:'4-5',context:c45,question:'Complétez la phrase.',answer:a45[0],choices:a45},{band:'6-8',context:c68,question:p68,answer:a68[0],choices:a68}]};
 });
 const filename=`chapter-02-batch-${String(b+18).padStart(2,'0')}.json`;
 writeFileSync(resolve(dir,filename),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:2,status:'offline_editorial_draft_unpublished',expectedIdentityCount:1,sourceSha256:hash(draft),unitPlanSha256:hash(bytes),note:'Chapter II contextual source and three-band question drafts. All learner import and complete chapter coverage remain pending.',items},null,2)+'\n');
 console.log(JSON.stringify({file:filename,meanings:items.length,uses:items.reduce((n,i)=>n+i.sourceOccurrences.length,0),questionBands:items.length*3}));
}
