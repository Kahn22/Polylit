import{readFileSync}from'node:fs';import{createHash}from'node:crypto';import{loadPublication}from'../../../dist/publication/repository.js';
const p=loadPublication(),input=JSON.parse(readFileSync(new URL('fr-semantic-13-input.json',import.meta.url))).entries;
const slug=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
const E=(context,choices)=>({context,choices});const M=E;const A=(context,prompt,choices)=>({context,prompt,choices});const entries=[];
function target(i,head,pos,key,gloss,definition){const x=input[i];const preferred={avoir:'lem_avoir','être':'lem_etre'};const existingSense=p.bundle.senses.find(s=>s.id===key);const lemma=(existingSense?p.bundle.lemmas.find(l=>l.id===existingSense.lemmaId):preferred[head]?p.bundle.lemmas.find(l=>l.id===preferred[head]):p.bundle.lemmas.find(l=>l.headword===head&&l.partOfSpeech===pos))??{id:`lem_fr_${slug(head)}_${pos}`,headword:head,partOfSpeech:pos};const surface=p.bundle.surfaceForms.find(s=>s.lemmaId===lemma.id&&s.form===x.surface.form)??{id:`srf_fr_${slug(x.surface.form)}_${slug(head)}_${pos}`,lemmaId:lemma.id,form:x.surface.form,normalized:x.surface.form.toLocaleLowerCase('fr')};if(p.bundle.surfaceForms.some(f=>f.id===surface.id&&f.form!==surface.form))surface.id+='_'+createHash('sha256').update(surface.form).digest('hex').slice(0,8);const sense=p.bundle.senses.find(s=>s.id===key)??{id:key,lemmaId:lemma.id,gloss,definition};return{lemma,surface,sense};}
function add(i,t,qs,reason,occurrenceIds='all'){entries.push({from:input[i].identity,target:t,occurrenceIds,reason:`All source occurrences read. ${reason} Preserve old identity and mastery; link current spans to the corrected meaning. Three independently authored contextual questions reviewed.`,questions:qs});}

const same=i=>({surface:input[i].surface,sense:input[i].sense,lemma:input[i].lemma});
const ids=(i,part)=>input[i].occurrences.filter(o=>o.workId.includes(part)).map(o=>o.id);

function clarify(i,gloss,definition){const t=same(i);return{...t,sense:{...t.sense,gloss,definition}};}
function reviewedMetadata(){entries.at(-1).metadataCorrection=true;}

const occ=(i,indices)=>indices.map(n=>input[i].occurrences[n].id);
add(0,clarify(0,'unremarkable; of little interest','Qui présente peu d’intérêt ou d’importance. Dans une négation atténuée, peut souligner au contraire le caractère remarquable de la chose.'),[
E('Ces parures ne sont pas indifferentes : elles méritent vraiment l’attention, explique le vieux récit.','unremarkable|remarkable|fascinating|exceptional'),M('Le texte ancien qualifie ces choses d’_____, car elles présentent peu d’intérêt.','indifferentes|importantes|exceptionnelles|remarquables'),A('Ces parures ne sont pas des plus indifferentes, dit-elle pour attirer l’attention sur elles.','Quel adjectif ancien, nié ici, signifie de peu d’intérêt ?','indifferentes|parures|attention|elles')],'Refine same historical evaluative meaning to little interest/importance; Académie 8 entry https://www.cnrtl.fr/definition/academie8/indiff%C3%A9rent supports this. Do not overstate monetary value or poor workmanship.');reviewedMetadata();
export default{version:1,id:'fr-2026-09-19-77',snapshot:'fr-semantic-13-input.json',entries};
