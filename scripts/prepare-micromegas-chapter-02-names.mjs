import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const coverage=JSON.parse(readFileSync(resolve(root,'chapter-02-coverage.json')));
const notes={micromégas:'The named fictional protagonist remains in the story but is not assigned a vocabulary identity.',saturne:'The named planet remains in the story but is not assigned a vocabulary identity.'};
const names=Object.entries(notes).map(([form,rationale])=>{
 const uses=coverage.tokens.filter(t=>t.form===form);
 if(uses.length!==3||uses.some(t=>t.disposition!=='proper_name_exclusion_to_verify'))throw Error(`Stale proper-name review: ${form}`);
 return {form,status:'chapter_proper_name_excluded_from_vocabulary',rationale,occurrences:uses.map(({unit,start,end,text,context})=>({chapter:2,unit,start,end,text,context}))};
});
const output={version:1,workId:coverage.workId,chapter:2,status:'proper_names_excluded_from_vocabulary_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Both names retain all six chapter II prose uses and are excluded from learner vocabulary.',names};
writeFileSync(resolve(root,'chapter-02-names.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({names:names.length,excludedTokenUses:6}));
