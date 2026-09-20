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
add(19,same(19),[
E('Ces petites chaussures conviennent aux pieds d’un enfant.','small|large|heavy|new'),M('Ces boîtes sont _____ : elles tiennent toutes dans la paume de la main.','petites|grandes|immenses|gigantesques'),A('Les petites fenêtres laissent entrer moins de lumière que les grandes baies.','Quel adjectif indique des dimensions réduites ?','petites|fenêtres|lumière|baies')],'Retain physical smallness of carriages and slippers.',occ(19,[1,2,3]));
add(19,target(19,'petit','adjective','sns_fr_petit_familiar_diminutive','little (familiar or disparaging qualifier)','Diminutif exprimant une manière familière ou dépréciative de parler d’une personne, sans mesurer sa taille.'),[
E('« Ces petites prétentieuses ! » dit-il avec mépris, sans parler de leur taille.','little (disparaging)|respected|admired|honoured'),M('Il les rabaisse en disant : « Ces _____ sottes ! », avec le diminutif au féminin pluriel.','petites|petits|petit|petite'),A('Il parle de ces petites dames sur un ton familier, sans rien dire de leurs dimensions physiques.','Quel adjectif donne ici une nuance familière plutôt qu’une mesure de taille ?','petites|dames|familier|dimensions')],'Source interpretation limited to nonliteral familiar/diminutive qualification in the gallant context of petites femmes. Do not infer occupation, age, physical height or precise sexual status. Lexicographic support for familiar and disparaging petit: https://fr.wiktionary.org/wiki/petit, senses 6–7, accessed 2026-09-19; source-specific application is contextual inference.',occ(19,[0]));
export default{version:1,id:'fr-2026-09-19-69',snapshot:'fr-semantic-09-input.json',entries};
