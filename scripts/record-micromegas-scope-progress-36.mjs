import{readFileSync,writeFileSync}from'node:fs';import{createHash}from'node:crypto';
const dir=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname,read=f=>JSON.parse(readFileSync(dir+f)),sha=x=>createHash('sha256').update(x).digest('hex'),write=(f,x)=>writeFileSync(dir+f,JSON.stringify(x,null,2)+'\n');
const plan=read('whole-work-scope-plan-36.json'),files=['whole-work-scope-plan-36.json',...plan.impacts.map(i=>i.file)];
const progress={version:1,status:plan.status,summary:plan.summary,nextAction:plan.nextAction,evidenceSha256:Object.fromEntries(files.map(f=>[f,sha(readFileSync(dir+f))]))};
write('whole-work-scope-progress-36.json',progress);files.push('whole-work-scope-progress-36.json');const dossier=read('dossier.json');
for(const file of files){const b=readFileSync(dir+file);dossier.evidence=[...dossier.evidence.filter(e=>e.file!==file),{role:'whole_work_soleil_scope_reconciliation_offline',file,bytes:b.length,sha256:sha(b)}];}
dossier.review.wholeWorkSoleilScope={file:'whole-work-scope-progress-36.json',status:progress.status,summary:progress.summary,nextAction:progress.nextAction};
if(!dossier.history.at(-1).reason.startsWith('Scope reconciliation36:'))dossier.history.push({version:dossier.history.at(-1).version+1,date:'2026-10-01',reason:'Scope reconciliation36: Read all published and candidate suns and their banks; stage two semantic question repairs and one generic stellar definition on the existing owner. Preserve every record and mastery; continue ventre, quoique and voir with held reprendre and figure prerequisites unchanged.'});
write('dossier.json',dossier);console.log(JSON.stringify({history:dossier.history.at(-1).version,...progress.summary,nextAction:progress.nextAction}));
