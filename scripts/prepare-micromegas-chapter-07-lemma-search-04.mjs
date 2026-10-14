import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
const dir='content/sources/wrk_voltaire_micromegas',read=f=>JSON.parse(readFileSync(`${dir}/${f}`)),sha=x=>createHash('sha256').update(x).digest('hex'),b=loadPublication().bundle;
const lemmas=['disséquer','mouche','mesurer','ligne','assembler','nombre','point','entendre','disputer','prendre','fantaisie','interroger','chose','convenir','grand','degré','demi','demi-diamètre','peser','air','attraper','volume','léger','dix-neuf','ducat','tenter','sorcier','même','auquel','avoir','refuser','âme','quart','auparavant','encore','former','parler','avis','vieux','citer','prononcer','confiance','entéléchie','raison','expressément'];
const files=readdirSync(dir).filter(f=>/^chapter-0[1-6]-(identity-plan|((held-)?batch-\d\d))\.json$/.test(f)).concat(['chapter-07-batch-01.json','chapter-07-batch-02.json','chapter-07-batch-03.json','chapter-06-held-context-review-03.json']);
const items=lemmas.map(lemma=>({lemma,publishedFrench:b.lemmas.filter(l=>l.headword.toLowerCase()===lemma&&!l.id.startsWith('lem_es_')).map(l=>({...l,senses:b.senses.filter(s=>s.lemmaId===l.id)})),earlierPlans:files.flatMap(file=>{const matches=read(file).items.filter(i=>i.lemma===lemma);return matches.length?[{file,fileSha256:sha(readFileSync(`${dir}/${file}`)),matches}]:[]})}));
writeFileSync(`${dir}/chapter-07-lemma-search-04.json`,JSON.stringify({version:1,status:'global_and_earlier_lemma_inventory_individually_compared',items},null,2)+'\n');
console.log(`${items.length} French lemma families captured; candidate evidence only.`);
