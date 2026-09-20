import{readFileSync}from'node:fs';import{loadPublication}from'../../../dist/publication/repository.js';
const p=loadPublication(),input=JSON.parse(readFileSync(new URL('fr-semantic-09-input.json',import.meta.url))).entries;
const slug=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
const E=(context,choices)=>({context,choices});const M=E;const A=(context,prompt,choices)=>({context,prompt,choices});const entries=[];
function target(i,head,pos,key,gloss,definition){const x=input[i];const preferred={avoir:'lem_avoir','être':'lem_etre'};const existingSense=p.bundle.senses.find(s=>s.id===key);const lemma=(existingSense?p.bundle.lemmas.find(l=>l.id===existingSense.lemmaId):preferred[head]?p.bundle.lemmas.find(l=>l.id===preferred[head]):p.bundle.lemmas.find(l=>l.headword===head&&l.partOfSpeech===pos))??{id:`lem_fr_${slug(head)}_${pos}`,headword:head,partOfSpeech:pos};const surface=p.bundle.surfaceForms.find(s=>s.lemmaId===lemma.id&&s.form===x.surface.form)??{id:`srf_fr_${slug(x.surface.form)}_${slug(head)}_${pos}`,lemmaId:lemma.id,form:x.surface.form,normalized:x.surface.form.toLocaleLowerCase('fr')};const sense=p.bundle.senses.find(s=>s.id===key)??{id:key,lemmaId:lemma.id,gloss,definition};return{lemma,surface,sense};}
function add(i,t,qs,reason,occurrenceIds='all'){entries.push({from:input[i].identity,target:t,occurrenceIds,reason:`All source occurrences read. ${reason} Preserve old identity and mastery; link current spans to the corrected meaning. Three independently authored contextual questions reviewed.`,questions:qs});}

const same=i=>({surface:input[i].surface,sense:input[i].sense,lemma:input[i].lemma});
const ids=(i,part)=>input[i].occurrences.filter(o=>o.workId.includes(part)).map(o=>o.id);

function clarify(i,gloss,definition){const t=same(i);return{...t,sense:{...t.sense,gloss,definition}};}
function reviewedMetadata(){entries.at(-1).metadataCorrection=true;}

const occ=(i,indices)=>indices.map(n=>input[i].occurrences[n].id);
const imp=[1,2,5,6,7,11,19,22,23,24,28,30,34,36,38,40,44,46,47,55,56,57,58,66,70,73,74,77,78,80,81,91,94,103,108,113,121,123,132,133,135,136,137,138,140,141,142,144,146,148,150,152,154];
add(7,clarify(7,'he; it','Pronom personnel sujet de la troisième personne du singulier, reprenant un être ou une chose au masculin ou un antécédent neutre.'),[
E('Paul entre dans la pièce ; il porte une grande valise.','he|she|they|we'),M('Ce livre est ancien ; _____ appartient à mon grand-père.','il|elle|ils|elles'),A('Le jardin paraît désert, mais il abrite de nombreux oiseaux.','Quel pronom sujet reprend jardin ?','il|jardin|abrite|oiseaux')],'Referential masculine/neuter subject including subject inversion after cela.',input[7].occurrences.filter((_,n)=>!imp.includes(n)).map(o=>o.id));reviewedMetadata();
add(7,target(7,'il','pronoun','sns_fr_il_impersonal','it; impersonal subject','Sujet grammatical impersonnel sans référent, employé notamment avec falloir, il y a et certaines constructions impersonnelles.'),[
E('Il faut attendre quelques minutes avant de partir.','it (impersonal subject)|he|she|they'),M('_____ reste deux places libres dans cette salle.','il|ils|elles|nous'),A('Il est arrivé trois voyageurs pendant la nuit.','Quel pronom sert de sujet grammatical impersonnel, distinct du groupe trois voyageurs ?','Il|trois|voyageurs|nuit')],'Every occurrence read; existential, necessity, impersonal passive and event constructions.',occ(7,imp));
export default{version:1,id:'fr-2026-09-19-68',snapshot:'fr-semantic-09-input.json',entries};
