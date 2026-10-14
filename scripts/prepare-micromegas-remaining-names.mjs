import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const folder=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(folder,n)));
const sha=b=>createHash('sha256').update(b).digest('hex');
const reasons={
 'Micromégas':'Name of the visitor from Sirius; the protagonist is identified by this proper name.',
 'Saturne':'Planet Saturn; the nearby Saturnien demonym remains teachable vocabulary.',
 'Prusse':'Historical name of Prussia, used as a geographical comparison.',
 'Méditerranée':'Named Mediterranean Sea; the general sea noun remains vocabulary.',
 'Jupiter':'Planet Jupiter in the comparison of planetary scale.',
 'Baltique':'Specific Baltic Sea named in the narrated voyage.',
 'Botnie':'Historical geographical name Bothnia on the Baltic coast.',
 'Sirius':'Named star Sirius and the traveller’s place of origin.',
 'Leuwenhoek':'Named historical microscopist in the observational analogy.',
 'Hartsoeker':'Named historical microscopist in the observational analogy.',
 'Swift':'Surname of the writer invoked by the narrator.',
 'Virgile':'French name of the Roman poet Virgil.',
 'Swammerdam':'Surname of the microscopist.',
 'Réaumur':'Surname of the French naturalist.',
 'César':'Historical figure Caesar, rather than a common noun in this context.',
 'Canicule':'In étoile de la Canicule, the traditional name of the Dog Star.',
 'Gémeaux':'Name of the Gemini constellation used for a star-distance question.',
 'Aristote':'French name of the philosopher Aristotle, the speaker’s attribution.',
 'Descartes':'Surname of the philosopher Descartes.',
 'Malebranche':'Surname of the philosopher Malebranche.',
 'Leibnitz':'Historical spelling of Leibniz’s surname; the adjective leibnitzien is a distinct vocabulary item.',
 'Locke':'Surname of the philosopher Locke.',
 'Louvre':'Named Louvre edition mentioned in a bibliographical citation.',
 'Thomas':'Named Thomas Aquinas in Somme de saint Thomas, not the ordinary given-name sense.',
 'Homère':'French name of the poet Homer.',
 'Paris':'City of Paris in the book’s delivery scene.',
};
const inv=[4,5,6,7].map(c=>read(`chapter-0${c}-inventory.json`));
const items=Object.entries(reasons).map(([form,rationale])=>{
 const occurrences=inv.flatMap(x=>x.tokens.filter(t=>t.text===form).map(t=>({chapter:x.chapter,unit:t.unit,start:t.start,end:t.end,text:t.text})));
 if(!occurrences.length)throw Error(`Name absent: ${form}`);
 return {form,rationale,decision:'proper_name_excluded_from_lexical_mastery',occurrences};
});
const output={version:1,workId:inv[0].workId,chapters:[4,5,6,7],status:'source_bound_proper_name_review_unpublished',sourceSha256:inv[0].sourceSha256,unitPlanSha256:inv[0].unitPlanSha256,inventorySha256:Object.fromEntries(inv.map(x=>[x.chapter,sha(readFileSync(resolve(folder,`chapter-0${x.chapter}-inventory.json`)))])),summary:{properNames:items.length,sourceUses:items.reduce((n,i)=>n+i.occurrences.length,0)},items};
writeFileSync(resolve(folder,'chapter-04-07-names.json'),JSON.stringify(output,null,2)+'\n');console.log(output.summary);
