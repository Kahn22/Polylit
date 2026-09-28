import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const dir=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=name=>readFileSync(resolve(dir,name));
const read=name=>JSON.parse(bytes(name));
const hash=value=>createHash('sha256').update(value).digest('hex');
const plan=read('unit-plan.json');
const expressions=read('chapter-01-expressions-01.json');
const decisions={
 faire_le_tour:'The chapter I route around the little states means a complete circuit. The three bands distinguish crossing, staying and leaving; the middle blank requires following the entire boundary and returning to the start.',
 au_bout_de:'Only the chapter VII interval of ten years receives temporal expression mastery. The chapter I telescope tip is spatial and compositional. Each band distinguishes after an elapsed period from during, before and every.',
 a_propos:'The source si à propos que denotes an apt or timely intervention. The prompts make suitability explicit; en retard, à côté and sans raison cannot answer the middle or upper context.',
 voie_lactee:'The printed astronomical name refers to our galaxy. The two components receive one expression identity. Middle-band alternatives are feminine singular noun phrases agreeing with la, and only the galaxy matches the described band of stars.'
};
const items=expressions.items.filter(item=>item.questions).map(item=>{
 const note=decisions[item.key];
 if(!note||item.questions.map(q=>q.band).join(',')!=='1-3,4-5,6-8')throw Error(`Unreviewed expression ${item.key}`);
 const occurrences=item.key==='au_bout_de'?item.occurrences.filter(o=>o.chapter===7):item.occurrences;
 if(!occurrences.length||occurrences.some(o=>plan.units[o.unit-1]?.text.slice(o.start,o.end)!==o.text))throw Error(`Stale expression source ${item.key}`);
 for(const q of item.questions)if(q.choices.length!==4||new Set(q.choices).size!==4||q.answer!==q.choices[0])throw Error(`Bad question choices ${item.key}`);
 return {key:item.key,surface:item.surface,meaning:item.meaning,questionSha256:hash(JSON.stringify(item.questions)),occurrencesSha256:hash(JSON.stringify(item.occurrences)),masteryOccurrences:occurrences,questionBands:item.questions.map(q=>q.band),decision:'contextual_expression_questions_reviewed_offline_pending_complete_work_import',reviewNote:note};
});
if(items.length!==4||Object.keys(decisions).length!==4)throw Error('Expected four reviewed expression question sets');
writeFileSync(resolve(dir,'chapter-01-expression-qa.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'four_expression_three_band_question_sets_reviewed_offline',sourceSha256:hash(bytes('canonical-draft.txt')),unitPlanSha256:hash(bytes('unit-plan.json')),expressionEvidenceSha256:hash(bytes('chapter-01-expressions-01.json')),note:'All four drafted expression sets have contextual source and question reviews. Chapter I spatial au bout de is excluded from temporal mastery. This ledger does not approve the seven-chapter work for import.',items},null,2)+'\n');
console.log(JSON.stringify({expressions:items.length,questionBands:items.length*3}));
