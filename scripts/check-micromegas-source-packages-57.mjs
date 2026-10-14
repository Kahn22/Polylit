import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{composeMicromegasExpressions56}from'./micromegas-expression-package-56.mjs';
import{composeMicromegasSourceBankRefinements57}from'./micromegas-source-bank-refinements-57.mjs';
import{composeMicromegasSourceWords57}from'./micromegas-source-words-57.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),coord=o=>`${o.unit}:${o.start}:${o.end}`;
export function checkMicromegasSourcePackages57(folder){
 const read=f=>JSON.parse(readFileSync(`${folder}/${f}`)),ensure=(b,m)=>{if(!b)throw Error(`Micromégas packages56/57: ${m}`);};
 const e=read('whole-work-expression-package-56.json'),w=read('whole-work-source-words-57.json'),ref=read('whole-work-source-bank-refinements-57.json'),prior=read('whole-work-source-words-55.json'),d=read('dossier.json');
 ensure(hash(e)===hash(composeMicromegasExpressions56(folder))&&hash(ref)===hash(composeMicromegasSourceBankRefinements57(folder))&&hash(w)===hash(composeMicromegasSourceWords57(folder)),'exact independently recomposed source records');
 for(const[data,file,key]of[[e,'whole-work-expression-progress-56.json','wholeWorkExpressions56'],[w,'whole-work-source-word-progress-57.json','wholeWorkSourceWords57']]){const p=read(file);ensure(hash(data.summary)===hash(p.summary)&&hash(p.summary)===hash(d.review[key].summary)&&hash(p.nextAction)===hash(d.review[key].nextAction)&&p.candidateReleaseReady===false&&p.appliedScopePlans===0,'offline recorded progress');for(const[f,h]of Object.entries(p.evidenceSha256))ensure(sha(readFileSync(`${folder}/${f}`))===h,'exact evidence fingerprint');}
 const old=new Set(prior.remainingDirectDraftOccurrences.map(coord)),moved=e.components.filter(c=>c.baseOwner.kind==='draft_bank').map(coord),bound=w.occurrenceBindings.map(coord),remaining=w.remainingDirectDraftOccurrences.map(coord),all=[...moved,...bound,...remaining];ensure(all.length===old.size&&new Set(all).size===all.length&&all.every(x=>old.has(x)),'exact disjoint direct-use partition');
 ensure(e.banks.length===3&&e.components.length===7&&w.banks.length===80&&w.occurrenceBindings.length===95&&w.summary.storedPreparedQuestionBands===240,'exact package scope');
 ensure(w.ownershipHolds.length===1&&w.ownershipHolds[0].occurrences.length===5&&w.ownershipHolds[0].occurrences.every(o=>remaining.includes(coord(o)))&&!w.occurrenceBindings.some(o=>o.form==='de'),'mixed determiner group remains untouched');
 const lemma=form=>{const o=w.occurrenceBindings.find(o=>o.form===form);return w.newLemmas.find(x=>x.record.id===o.lemmaId)?.record;};
 ensure(lemma('étrangers-là')?.partOfSpeech==='noun'&&lemma('certaines')?.partOfSpeech==='determiner','proper noun and determiner owners');ensure(lemma('imperceptible')?.id!=='lem_es_imperceptible_adjective','language isolation');
 for(const[a,b]of w.explicitSameMeaningJoins){const aa=w.occurrenceBindings.find(o=>o.form===a),bb=w.occurrenceBindings.find(o=>o.form===b);ensure(aa.senseId===bb.senseId&&aa.surfaceFormId!==bb.surfaceFormId,'same meaning separate printed surface');}
 ensure(w.summary.remainingDirectDraftSourceUses===681&&w.summary.remainingDirectDraftIdentityGroups===531,'remaining queue totals');
 console.log('Micromégas packages56/57: three complete phrases;80 word keys/95 uses/240 questions; one explicit ownership hold. Offline and unapplied.');
}
