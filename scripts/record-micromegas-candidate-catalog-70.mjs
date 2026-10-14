import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeCandidate70} from './micromegas-candidate-catalog-70.mjs';
import {validateCandidate70} from './check-micromegas-candidate-catalog-70.mjs';
const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const sha=x=>createHash('sha256').update(x).digest('hex'),write=(f,x)=>writeFileSync(folder+f,JSON.stringify(x,null,2)+'\n');
const w=composeCandidate70(folder);validateCandidate70(w,JSON.parse(readFileSync(folder+'whole-work-import-composition-42.json')));
const wf='whole-work-candidate-catalog-70.json',pf='whole-work-candidate-progress-70.json';
const nextAction={family:'cross-work expression transaction preparation',form:w.crossWorkExpressionQueue[0].headword,source:w.crossWorkExpressionQueue[0].file,selector:w.crossWorkExpressionQueue[0].selector,reason:'The complete Micromégas candidate catalog is composed and independently validated offline. Prepare the 23 existing-work expression plans covering25 source spans, starting with classical tout à l’heure in Le Loup et l’Agneau. Resolve final shared meaning/surface keys and three-band banks against this catalog, then compose the exact published occurrence transaction and its metadata/question overlays. Preserve all legacy records and mastery. No publication, deployment or learner-state changes.'};
write(wf,w);write(pf,{version:1,status:w.status,summary:w.summary,evidenceSha256:{[wf]:sha(readFileSync(folder+wf))},nextAction,candidateReleaseReady:false,publicationApplied:false,learnerStateChanged:false});
const d=JSON.parse(readFileSync(folder+'dossier.json'));d.review.wholeWorkCandidateCatalog70={file:pf,status:w.status,summary:w.summary,nextAction};
for(const f of[wf,pf]){const b=readFileSync(folder+f);d.evidence=[...d.evidence.filter(e=>e.file!==f),{file:f,role:'complete_offline_candidate_catalog_exact_ownership_and_cross_work_dependency_assessment',bytes:b.length,sha256:sha(b)}];}
const reason='Candidate catalog70: all7098 source tokens reconciled into6568 word occurrences and158 expression occurrences,96 proper-name exclusions and retained legacy locution attachments. One canonical bank for1911 keys/5733 stored bands; nine explicit later bank selections. Published dependency assessment identifies272 exact metadata/question overlays and23 expression plans/25 existing-work spans. Source ownership and expression-domain checks pass offline; no publication or learner mutation.';
const old=d.history.find(h=>h.reason.startsWith('Candidate catalog70:'));if(old)old.reason=reason;else d.history.push({version:d.history.at(-1).version+1,date:'2026-10-03',reason});write('dossier.json',d);console.log(JSON.stringify({summary:w.summary,nextAction}));
