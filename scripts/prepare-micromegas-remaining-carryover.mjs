import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const folder=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(folder,n)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const base=read('chapter-04-inventory.json'),old=new Map();
for(const name of readdirSync(folder).filter(n=>/^chapter-0[123]-batch-\d\d\.json$/u.test(n)))for(const item of read(name).items){
 const arr=old.get(item.form)??[];arr.push({name,item});old.set(item.form,arr);
}
// The excluded uses change meaning: do not attach their previous mastery.
const separate=new Map([
 ['amour','Faire l’amour names sexual intimacy, not the bare noun love tested in chapter III.'],
 ['article','L’article de la génération denotes a topic or question, not a printed article.'],
 ['nouveau','De nouveau means again, not a reformed calendar.'],
 ['faible','The faint voice is a weak sound, while the previous draft tests an inadequate analogy.'],
 ['eurent@114:76','Eurent de la peine means experienced difficulty; the earlier questions test the past-anterior auxiliary.'],
]);
const acceptedForms=`aperçurent apparemment apprit arrive atome blanc compagnon comparaisons comptez créateur difficile différent différents ensemble espèce eurent fallut géant habitation instant lesquelles lune manière matière mer nombre océan pensants peur philosophe philosophes philosophique pitié plat prétende questions remercier répliqua saturnien savez soixante sommes sortant substances univers venaient village virent vois voyages voyageurs voyez édition`.split(' ');
const accepted=new Set(acceptedForms),source=readFileSync(resolve(folder,'canonical-draft.txt'));
const inventories=[4,5,6,7].map(c=>read(`chapter-0${c}-inventory.json`));
const items=[],exceptions=[];
for(const form of acceptedForms){
 const matches=old.get(form)??[];
 if(matches.length!==1)throw Error(`Ambiguous earlier source draft for ${form}: ${matches.length}`);
 const {name,item}=matches[0];
 const tokens=inventories.flatMap(inv=>inv.tokens.map(t=>({...t,chapter:inv.chapter}))).filter(t=>t.form===form&&!t.earlierDraft&&!separate.has(`${form}@${t.unit}:${t.start}`));
 if(!tokens.length)throw Error(`No eligible occurrences ${form}`);
 items.push({form,key:item.key,earlierBatch:name,earlierBatchSha256:sha(readFileSync(resolve(folder,name))),earlierQuestionSha256:sha(JSON.stringify(item.questions)),earlierMeaning:item.meaning,decision:'share_earlier_authored_source_sense_questions_pending_complete_work_import',rationale:`In these exact source passages, ${form} keeps the previously drafted meaning “${item.meaning}”; reusing the planned surface/sense keeps one mastery identity.`,occurrences:tokens.map(t=>({chapter:t.chapter,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context}))});
}
for(const [key,rationale] of separate){
 const [form,where]=key.split('@');
 const tokens=inventories.flatMap(inv=>inv.tokens.map(t=>({...t,chapter:inv.chapter}))).filter(t=>t.form===form&&!t.earlierDraft&&(!where||`${t.unit}:${t.start}`===where));
 if(!tokens.length)throw Error(`Missing separated use ${key}`);
 exceptions.push({form,rationale,decision:'distinct_contextual_meaning_or_expression_pending_new_questions',occurrences:tokens.map(t=>({chapter:t.chapter,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context}))});
}
const output={version:1,workId:base.workId,chapters:[4,5,6,7],status:'source_bound_earlier_draft_sharing_review_offline',sourceSha256:sha(source),unitPlanSha256:base.unitPlanSha256,inventorySha256:Object.fromEntries(inventories.map(x=>[x.chapter,sha(readFileSync(resolve(folder,`chapter-0${x.chapter}-inventory.json`)))])),summary:{sharedMeanings:items.length,sharedUses:items.reduce((s,x)=>s+x.occurrences.length,0),separateMeaningUses:exceptions.reduce((s,x)=>s+x.occurrences.length,0)},items,exceptions};
writeFileSync(resolve(folder,'chapter-04-07-carryover-review.json'),JSON.stringify(output,null,2)+'\n');
console.log(output.summary);
