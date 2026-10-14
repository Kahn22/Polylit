import{readFileSync,writeFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{composeMicromegasResolution58}from'./micromegas-source-resolution-58.mjs';
const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const sha=x=>createHash('sha256').update(x).digest('hex');
const write=(f,d)=>writeFileSync(folder+f,JSON.stringify(d,null,2)+'\n');
const result=composeMicromegasResolution58(folder);
const packageFile='whole-work-mixed-de-resolution-58.json';write(packageFile,result);
const resultBytes=readFileSync(folder+packageFile);
const progressFile='whole-work-mixed-de-progress-58.json';
const progress={version:1,status:result.status,summary:result.summary,nextAction:result.nextAction,evidenceSha256:{[packageFile]:sha(resultBytes)},candidateReleaseReady:false,appliedScopePlans:0};
write(progressFile,progress);
const dossierFile='dossier.json',d=JSON.parse(readFileSync(folder+dossierFile));
d.review.wholeWorkMixedDeResolution58={file:progressFile,status:result.status,summary:result.summary,nextAction:result.nextAction};
for(const f of [packageFile,progressFile]){const bytes=readFileSync(folder+f);d.evidence=[...d.evidence.filter(x=>x.file!==f),{file:f,role:'reviewed_source_ordered_partitive_expressions_and_quantity_preposition_unapplied',sha256:sha(bytes),bytes:bytes.length}];}
const marker='Source package58:';
if(!d.history.some(h=>h.reason.startsWith(marker)))d.history.push({version:d.history.at(-1).version+1,date:'2026-10-02',reason:`${marker} resolve the five-use mixed de ownership group without changing published content: prepare one partitive expression meaning with de la and de l’ surface keys, four source spans, eight exact components and six prepared question bands; move four draft de uses into complete expressions, suppress only the four existing article-word routes at those candidate spans, and keep un peu de confusion on the published sns_de_primary preposition with legacy mastery preserved. The remaining direct source queue is676 uses/530 groups and127 original phrase spans. Resume dispute at unit103 offsets3–10. Offline and unapplied.`});
write(dossierFile,d);
console.log(JSON.stringify({history:d.history.at(-1).version,summary:result.summary,nextAction:result.nextAction}));
