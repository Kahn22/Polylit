import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegasIdentityDependencies} from './micromegas-identity-dependencies.mjs';

const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const sha=x=>createHash('sha256').update(x).digest('hex');
const write=(file,data)=>writeFileSync(folder+file,JSON.stringify(data,null,2)+'\n');
const graph=composeMicromegasIdentityDependencies(folder),file='whole-work-identity-dependencies-43.json';
write(file,graph);
const nextAction={family:'whole-work final identity and canonical bank binding',form:'homme',unit:1,start:92,end:97,reason:'All 1,271 chapter identity declarations and stored banks resolve their 115 explicit dependencies without cycles. The 1,718 direct draft uses form 1,140 provisional Surface+Sense groups; 18 have competing stored banks. Bind 368 whole-work overrides and 127 complete phrases before choosing final IDs/banks, preserving declared new senses and four unresolved historical lemma headwords (affaire, haut, aller, pas). Begin with the reviewed homme reuse at 1:92–97, then resolve the exact sense targets in source order. The planètes/planète celestial-body group already shares one declared planned sense while keeping distinct surface identities. No historical route is applied automatically.'};
const progress={version:1,status:graph.status,summary:graph.summary,nextAction,evidenceSha256:{[file]:sha(readFileSync(folder+file))},candidateReleaseReady:false,appliedScopePlans:0};
const progressFile='whole-work-identity-progress-43.json';write(progressFile,progress);
const d=JSON.parse(readFileSync(folder+'dossier.json'));
for(const f of[file,progressFile]){const bytes=readFileSync(folder+f);d.evidence=[...d.evidence.filter(e=>e.file!==f),{role:'whole_work_declared_identity_dependency_graph_offline',file:f,bytes:bytes.length,sha256:sha(bytes)}];}
d.review.wholeWorkIdentityDependencies={file:progressFile,status:progress.status,summary:progress.summary,nextAction};
if(!d.history.at(-1).reason.startsWith('Identity dependencies43:'))d.history.push({version:d.history.at(-1).version+1,date:'2026-10-02',reason:'Identity dependencies43: Resolve all 1,271 stored chapter declarations, preserving 96 explicit same-sense links and 19 lemma-only links with distinct senses. Bind 1,718 direct draft source uses into 1,140 provisional surface-and-sense groups; retain 18 competing-bank groups and 368 later source overrides for final composition. Bind only unambiguous previously declared existing lemma headwords; preserve four historical headword ambiguities rather than guessing or merging duplicate legacy lemmas. Validate exact stored question hashes and named predecessors; reject cycles and missing targets. Historical declarations remain evidence, not final source owners or approval. No published content or learner-state mutation.'});
write('dossier.json',d);console.log(JSON.stringify({history:d.history.at(-1).version,...graph.summary,nextAction}));
