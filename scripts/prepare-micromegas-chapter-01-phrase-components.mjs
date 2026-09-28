import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=name=>JSON.parse(readFileSync(resolve(dir,name)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const expressions=read('chapter-01-expressions-01.json');
const planned={key:'voie_lactee',surface:'voie lactée',disposition:'new_expression_draft_question_signoff_pending',occurrences:[{chapter:1,unit:20,start:16,end:27,text:'voie lactée'}],meaning:'Milky Way; our galaxy',decision:'The two words together name the Milky Way, the astronomical body the traveler crosses. Keep one expression mastery item for the whole name; do not test voie and lactée independently as if their general component meanings identified this celestial object. Source case follows the printed edition.',questions:[
{band:'1-3',context:'Il traverse la voie lactée en peu de temps.',question:'Meaning',answer:'Milky Way',choices:['Milky Way','planet Saturn','the sun','a comet']},
{band:'4-5',context:'Cette vaste bande d’étoiles qui contient notre système solaire est la ___.',question:'Complétez la phrase.',answer:'voie lactée',choices:['voie lactée','planète Mars','comète','lune']},
{band:'6-8',context:'La voie lactée est la galaxie à laquelle appartient le Soleil. La planète Mars est un monde voisin, une comète est un petit corps glacé et la lune est un satellite naturel.',question:'Quelle expression nomme la galaxie traversée par le voyageur ?',answer:'voie lactée',choices:['voie lactée','planète Mars','comète','lune']}]
};
const unit=read('unit-plan.json').units[19];
if(unit.text.slice(16,27)!=='voie lactée')throw Error('Printed astronomical name changed');
expressions.items=expressions.items.filter(item=>item.key!==planned.key);expressions.items.push(planned);
expressions.note='Eleven chapter I phrase candidates checked against source spans and existing published identities. À peu près reuses existing vocabulary mastery, while à propos and voie lactée are independent offline expression drafts. Se mettre à uses the existing reflexive-begin sense with a planned new met surface; no expression imported or approved.';
writeFileSync(resolve(dir,'chapter-01-expressions-01.json'),JSON.stringify(expressions,null,2)+'\n');
const coverageBytes=readFileSync(resolve(dir,'chapter-01-coverage.json'));const coverage=JSON.parse(coverageBytes);
const specification=[
{form:'propos',unit:19,start:21,expressionKey:'a_propos',reason:'The meaning aptly belongs to the authored à propos expression; the noun propos alone does not yield this sense. Expression questions are already drafted.'},
{form:'voie',unit:20,start:16,expressionKey:'voie_lactee',reason:'The astronomical proper designation voie lactée is a single expression; voie is not separately assessed as a generic road or track in this occurrence.'},
{form:'lactée',unit:20,start:21,expressionKey:'voie_lactee',reason:'The adjective component is kept inside the Milky Way name, not independent mastery for milkiness.'},
{form:'peu',unit:25,start:46,expressionKey:'a_peu_pres',reason:'The approximate sense belongs to the existing published à peu près vocabulary identity on the à anchor, retaining its mastery and quizzes.'},
{form:'près',unit:25,start:50,expressionKey:'a_peu_pres',reason:'The approximate sense belongs to the existing published à peu près vocabulary identity on the à anchor, not the generic near identity.'}
];
const items=specification.map(x=>{
 const t=coverage.tokens.find(t=>t.unit===x.unit&&t.start===x.start&&t.form===x.form);
 const expression=expressions.items.find(y=>y.key===x.expressionKey);
 if(!t||t.draft||!expression?.occurrences.some(o=>o.unit===x.unit&&o.start<=t.start&&o.end>=t.end))throw Error(`Expression component mismatch ${x.form}`);
 if(!expression.questions&&!expression.existing?.vocabularyIdentity)throw Error(`Missing expression mastery plan ${x.expressionKey}`);
 return {form:x.form,expressionKey:x.expressionKey,reason:x.reason,occurrence:{chapter:1,unit:t.unit,start:t.start,end:t.end,text:t.text},status:'covered_by_expression_no_independent_vocabulary_mastery_pending_bundle_signoff'};
});
writeFileSync(resolve(dir,'chapter-01-phrase-components.json'),JSON.stringify({version:1,workId:coverage.workId,chapter:1,status:'offline_source_bound_expression_component_decisions_unpublished',coverageSha256:sha(coverageBytes),expressionEvidenceSha256:sha(readFileSync(resolve(dir,'chapter-01-expressions-01.json'))),note:'Five chapter I source tokens are components of three documented phrase identities, so their literal standalone vocabulary meanings would mislead and duplicate mastery. The phrase anchor/identity remains subject to final bundle signoff.',items},null,2)+'\n');
console.log(JSON.stringify({expressionCandidates:expressions.items.length,expressionQuestionSets:expressions.items.filter(x=>x.questions).length,componentUses:items.length}));
