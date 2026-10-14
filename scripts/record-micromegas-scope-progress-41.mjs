import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const dir=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const read=f=>JSON.parse(readFileSync(dir+f));
const sha=x=>createHash('sha256').update(x).digest('hex');
const write=(f,x)=>writeFileSync(dir+f,JSON.stringify(x,null,2)+'\n');
const plan=read('whole-work-scope-plan-41.json'),files=['whole-work-scope-plan-41.json',...plan.impacts.map(i=>i.file)];
const progress={version:1,status:plan.status,summary:plan.summary,nextAction:plan.nextAction,evidenceSha256:Object.fromEntries(files.map(f=>[f,sha(readFileSync(dir+f))]))};
write('whole-work-scope-progress-41.json',progress);
const dossier=read('dossier.json');
for(const file of ['whole-work-scope-plan-41.json','whole-work-scope-progress-41.json']){const b=readFileSync(dir+file);dossier.evidence=[...dossier.evidence.filter(e=>e.file!==file),{role:'whole_work_reprendre_213_editorial_resolution_offline',file,bytes:b.length,sha256:sha(b)}];}
dossier.review.wholeWorkReprendre213Resolution={file:'whole-work-scope-progress-41.json',status:progress.status,summary:progress.summary,nextAction:progress.nextAction};
if(!dossier.history.at(-1).reason.startsWith('Scope reconciliation41:'))dossier.history.push({version:dossier.history.at(-1).version+1,date:'2026-10-01',reason:'Scope reconciliation41: Resolve the exact unit213 reprit hold as physically taking the recovered humans up again. Record the full units211–215, period dictionary distinctions, competing translations, all current and historical published dependencies, broadened same-owner taking-again definition and corrected draft question without inventing a hand placement. Prior39 reconciliation groups and all baseline publication remain intact. The candidate stays offline and unapplied pending complete import preflight.'});
write('dossier.json',dossier);
console.log(JSON.stringify({history:dossier.history.at(-1).version,...progress.summary,nextAction:progress.nextAction}));
