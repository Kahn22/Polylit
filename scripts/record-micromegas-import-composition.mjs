import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegas} from './micromegas-import-composition.mjs';

const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const sha=x=>createHash('sha256').update(x).digest('hex');
const write=(f,d)=>writeFileSync(folder+f,JSON.stringify(d,null,2)+'\n');
const composition=composeMicromegas(folder);
const file='whole-work-import-composition-42.json';
write(file,composition);
const nextAction={family:'canonical learner identity and question-bank composition',form:'planètes',unit:1,start:16,end:24,reason:'The exact source map covers all7098 tokens in215 units, with127 complete expression spans and347 owned lexical components plus nine existing word-locution attachments. All nine scope-route and five draft-bank refinements are explicit. Materialize the planned owners as Surface+Sense and expression surface identities, resolve repeated bank dependencies and all current/historical question overlays, and select one reviewed bank per final identity. Begin with planètes at1:16–24 (chapter-01-batch-08.json:planetes_worlds). Preserve source-specific reassignments, existing word-locution mastery and all original records; no automated sense merge or approval.'};
const progress={version:1,status:composition.status,summary:composition.summary,nextAction,evidenceSha256:{[file]:sha(readFileSync(folder+file))},candidateReleaseReady:false,appliedScopePlans:0};
const progressFile='whole-work-import-progress-42.json';write(progressFile,progress);
const d=JSON.parse(readFileSync(folder+'dossier.json'));
for(const f of[file,progressFile]){const bytes=readFileSync(folder+f);d.evidence=[...d.evidence.filter(e=>e.file!==f),{role:'whole_work_source_import_composition_offline',file:f,bytes:bytes.length,sha256:sha(bytes)}];}
d.review.wholeWorkImportComposition={file:progressFile,status:progress.status,summary:progress.summary,nextAction};
if(!d.history.at(-1).reason.startsWith('Import composition42:'))d.history.push({version:d.history.at(-1).version+1,date:'2026-10-02',reason:'Import composition42: Bind all7098 exact source tokens in215 thought units to their chapter review evidence and explicit whole-work overlays. Compose nine route refinements, five bank refinements,127 complete expression spans with347 exact lexical components, and nine existing vocabulary-locution attachments. Preserve the segmented faire figure intervening words, elliptical ferait and every original bank and route. Zero unresolved source placeholders or overlapping phrase owners does not grant identity, question or work approval. No publication, learner-state mutation or queue subtraction; final owner and canonical bank materialization remains.'});
write('dossier.json',d);
console.log(JSON.stringify({history:d.history.at(-1).version,...progress.summary,nextAction}));
