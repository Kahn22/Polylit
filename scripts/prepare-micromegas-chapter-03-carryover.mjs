import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(dir,n)));
const coverage=read('chapter-03-coverage.json'),sha=b=>createHash('sha256').update(b).digest('hex');
const previous=Array.from({length:24},(_,n)=>`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`).concat(Array.from({length:18},(_,n)=>`chapter-02-batch-${String(n+1).padStart(2,'0')}.json`));
const candidates=previous.flatMap(file=>read(file).items.map(item=>({...item,file})));
// An explicit Chapter III source comparison: only these earlier meanings and
// question sets remain applicable in the indicated new contexts.
const decisions=[
 ['saturnien_inhabitant','61:161,63:303','The secretary is the Saturnian lover in both passages.'],
 ['nouvelles_reports','61:187','She receives information about his impending departure, not new things.'],
 ['soixante_sixty','62:56','The number sixty contributes to six hundred sixty.'],
 ['toises_historical_length','62:65','Her height is counted in the same historical length unit.'],
 ['petitesse_smallness','62:117','The noun describes her comparatively small height.'],
 ['taille_stature','62:133','Taille denotes stature, not the waist in the existing publication.'],
 ['quinze_fifteen','63:53','Fifteen contributes to fifteen hundred years.'],
 ['voyager_travel','63:187','She accuses him of going on a journey.'],
 ['lunes_satellites','64:9,74:209,75:98,76:122','Both Saturn’s and Mars’s natural satellites are astronomical moons.'],
 ['anneau_planetary_ring','64:50,67:67','Saturn’s ring is described and then used as a departure point.'],
 ['philosophe_thinker','66:3,66:49','Both uses describe the thinking Saturnian, including the ironic concession.'],
 ['devine_inferred','67:125','The distinguished inhabitant worked out the ring’s shape by inference.'],
 ['illustre_famous','67:135,71:55,72:202','Distinction or renown describes the thinker, prelate, and father.'],
 ['habitant_resident','67:144','A resident of our globe shares the earlier inhabitant meaning.'],
 ['globe_planet','67:168,74:185','Our small globe is Earth, a planet, in both comparisons.'],
 ['comète_astronomy','68:4,82:33','The celestial body reappears with its tail.'],
 ['environ_approximately','69:22,74:52','Both approximate vast journey distances.'],
 ['cinquante_fifty','69:35','Fifty combines with one hundred in the distance count.'],
 ['millions_number','69:45,74:65','Both numbers count millions of distance units.'],
 ['lieues_distance','69:57,74:77','Both travel distances use historical leagues.'],
 ['propositions_assertions','70:207','Inquisitors find doctrinal claims objectionable, not mathematical theorems.'],
 ['espace_space','74:43','The travellers pass through a physical expanse.'],
 ['planete_world','74:106,74:235','Both references identify Mars as a planet.'],
 ['sirien_inhabitant','78:8','The traveler is still an inhabitant of Sirius.'],
 ['terre_planet_earth','80:51','The light resolves into the planet Earth, not landing ground.'],
 ['resolurent_decided','81:56','The travellers make a deliberate decision to land.'],
];
const claimed=new Set();
const items=decisions.map(([key,offsets,rationale])=>{
 const prior=candidates.filter(item=>item.key===key);
 if(prior.length!==1)throw Error(`Missing earlier meaning ${key}`);
 const old=prior[0],allowed=new Set(offsets.split(','));
 const matches=coverage.tokens.filter(t=>allowed.has(`${t.unit}:${t.start}`)&&t.form===old.form.toLocaleLowerCase('fr'));
 if(matches.length!==allowed.size||matches.some(t=>t.draft&&t.draft.key!==key)||matches.some(t=>claimed.has(`${t.unit}:${t.start}`)))throw Error(`Carryover overlap ${key}`);
 const added=matches.filter(t=>!t.draft);
 added.forEach(t=>claimed.add(`${t.unit}:${t.start}`));
 return added.length?{key,form:old.form,meaning:old.meaning,earlierBatch:old.file,earlierBatchSha256:sha(readFileSync(resolve(dir,old.file))),earlierQuestionSha256:sha(JSON.stringify(old.questions)),rationale,sourceOccurrences:added.map(t=>({chapter:3,unit:t.unit,start:t.start,end:t.end,text:t.text})),status:'previously_reviewed_question_set_source_context_matched_offline'}:null;
}).filter(Boolean);
const output={version:1,workId:coverage.workId,chapter:3,status:'source_bound_previous_draft_reuse_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,note:'Each reuse compares the new chapter III context with the earlier drafted meaning and its three reviewed bands. Earlier batch question evidence stays unchanged; later full-work import will assign the shared identity.',items};
writeFileSync(resolve(dir,'chapter-03-carryover.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({meaningLinks:items.length,tokenUses:claimed.size}));
