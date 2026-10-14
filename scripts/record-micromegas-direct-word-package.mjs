import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {composeMicromegasDirectBankRefinements} from './micromegas-direct-bank-refinements.mjs';
import {composeMicromegasDirectWordPackage} from './micromegas-direct-word-package.mjs';
const folder=new URL('../content/sources/wrk_voltaire_micromegas/',import.meta.url).pathname;
const sha=x=>createHash('sha256').update(x).digest('hex');
const write=(f,d)=>writeFileSync(folder+f,JSON.stringify(d,null,2)+'\n');
write('whole-work-direct-bank-refinements-46.json',composeMicromegasDirectBankRefinements(folder));
const data=composeMicromegasDirectWordPackage(folder),file='whole-work-direct-word-package-46.json';write(file,data);
const first=data.remainingDirectDraftOccurrences[0];
const nextAction={family:'explicit draft ownership correction and remaining direct words',form:first.form,unit:first.unit,start:first.start,end:first.end,reason:'Continue at haut in the historical height construction at2:24–28. Review all retained noun/adjective/adverb heads before choosing an exact owner. This package binds100 direct draft groups/221 uses and300 stored questions, preserving declared planètes/planète and géomètres/géomètre shared senses and separate surfaces. Thirteen named decisions remain explicit holds, including public and êtres noun ownership, depuis adverb ownership, historical lemma ambiguities, full constructions and the competing Earth banks. Continue1497 direct draft uses/1040 groups and127 full phrases; no import, release approval, deployment or mastery migration.'};
const progressFile='whole-work-direct-word-progress-46.json';
const progress={version:1,status:data.status,summary:data.summary,nextAction,evidenceSha256:{[file]:sha(readFileSync(folder+file)),'whole-work-direct-bank-refinements-46.json':sha(readFileSync(folder+'whole-work-direct-bank-refinements-46.json'))},candidateReleaseReady:false,appliedScopePlans:0};write(progressFile,progress);
const d=JSON.parse(readFileSync(folder+'dossier.json'));
for(const f of[file,progressFile,'whole-work-direct-bank-refinements-46.json']){const bytes=readFileSync(folder+f);d.evidence=[...d.evidence.filter(e=>e.file!==f),{file:f,role:'whole_work_direct_draft_identity_and_bank_materialization_offline',sha256:sha(bytes),bytes:bytes.length}];}
d.review.wholeWorkDirectWordPackage={file:progressFile,status:data.status,summary:data.summary,nextAction};
if(!d.history.some(h=>h.reason.startsWith('Direct word package46:')))d.history.push({version:d.history.at(-1).version+1,date:'2026-10-02',reason:'Direct word package46: Materialize100 explicitly declared direct word groups covering221 exact current source uses and300 stored prepared questions. Preserve four existing indexed identity banks and96 fresh keys; store62 proper lemma records,77 separately declared meanings with French definitions and85 missing surface records. Singular/plural celestial-body and geometer forms share their declared sense while retaining separate mastery. Review all three selected bands and refine14 draft question bands in13 banks, preserving every predecessor. Keep13 named ownership/construction/bank decisions unbound, including three earlier category mismatches. Remaining1497 direct uses/1040 groups and127 full phrases are explicitly indexed. All candidates remain offline and unapplied; no automatic semantic merge, work approval, learner-state write, publication or deployment.'});
write('dossier.json',d);console.log(JSON.stringify({history:d.history.at(-1).version,summary:data.summary,nextAction}));
