import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas'),coverage=JSON.parse(readFileSync(resolve(dir,'chapter-03-coverage.json')));
const names=[
 ['Saturne','61:70','The celestial body is a proper name; its inhabitants have separate Saturnien vocabulary.'],
 ['Jupiter','69:101,70:19,74:14,80:101','Every occurrence names the planet Jupiter.'],
 ['Mars','74:117,76:63','Both uses name the planet Mars.'],
 ['Moréri','72:76','The promised encyclopedia entry names Moréri, a person or titled reference.'],
 ['Castel','75:25','Père Castel identifies a named person; père itself denotes the clerical title.'],
 ['Baltique','82:166','La mer Baltique is the proper geographic name; mer is an ordinary noun.'],
];
const items=names.map(([form,offsets,rationale])=>{
 const allowed=new Set(offsets.split(',')),found=coverage.tokens.filter(t=>allowed.has(`${t.unit}:${t.start}`)&&t.text===form);
 if(found.length!==allowed.size)throw Error(`Name span missing ${form}`);
 return {form,rationale,occurrences:found.map(t=>({chapter:3,unit:t.unit,start:t.start,end:t.end,text:t.text}))};
});
writeFileSync(resolve(dir,'chapter-03-names.json'),JSON.stringify({version:1,workId:coverage.workId,chapter:3,status:'source_reviewed_proper_names_not_vocabulary',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,names:items},null,2)+'\n');
console.log(JSON.stringify({names:items.length,uses:items.reduce((n,i)=>n+i.occurrences.length,0)}));
