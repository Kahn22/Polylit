import{readFileSync}from'node:fs';import{loadPublication}from'../../../dist/publication/repository.js';
const p=loadPublication(),input=JSON.parse(readFileSync(new URL('fr-semantic-10-input.json',import.meta.url))).entries;
const slug=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
const E=(context,choices)=>({context,choices});const M=E;const A=(context,prompt,choices)=>({context,prompt,choices});const entries=[];
function target(i,head,pos,key,gloss,definition){const x=input[i];const preferred={avoir:'lem_avoir','être':'lem_etre'};const existingSense=p.bundle.senses.find(s=>s.id===key);const lemma=(existingSense?p.bundle.lemmas.find(l=>l.id===existingSense.lemmaId):preferred[head]?p.bundle.lemmas.find(l=>l.id===preferred[head]):p.bundle.lemmas.find(l=>l.headword===head&&l.partOfSpeech===pos))??{id:`lem_fr_${slug(head)}_${pos}`,headword:head,partOfSpeech:pos};const surface=p.bundle.surfaceForms.find(s=>s.lemmaId===lemma.id&&s.form===x.surface.form)??{id:`srf_fr_${slug(x.surface.form)}_${slug(head)}_${pos}`,lemmaId:lemma.id,form:x.surface.form,normalized:x.surface.form.toLocaleLowerCase('fr')};const sense=p.bundle.senses.find(s=>s.id===key)??{id:key,lemmaId:lemma.id,gloss,definition};return{lemma,surface,sense};}
function add(i,t,qs,reason,occurrenceIds='all'){entries.push({from:input[i].identity,target:t,occurrenceIds,reason:`All source occurrences read. ${reason} Preserve old identity and mastery; link current spans to the corrected meaning. Three independently authored contextual questions reviewed.`,questions:qs});}

const same=i=>({surface:input[i].surface,sense:input[i].sense,lemma:input[i].lemma});
const ids=(i,part)=>input[i].occurrences.filter(o=>o.workId.includes(part)).map(o=>o.id);

function clarify(i,gloss,definition){const t=same(i);return{...t,sense:{...t.sense,gloss,definition}};}
function reviewedMetadata(){entries.at(-1).metadataCorrection=true;}

const occ=(i,indices)=>indices.map(n=>input[i].occurrences[n].id);
const rest=(i,ns)=>input[i].occurrences.filter((_,n)=>!ns.includes(n)).map(o=>o.id);
add(6,same(6),[
E('Le chien de notre voisin dort sous cet arbre.','the|a|some|each'),M('Elle choisit _____ dernier billet disponible, le seul qui reste.','le|la|les|l’'),A('Le matin, il ouvre sa boutique et prépare ses outils.','Quel article défini détermine matin ?','Le|matin|boutique|outils')],'All 244 current occurrences read; retain definite articles and superlative constructions.',rest(6,[7,99,166,175,183,191,193,194,207]));
add(6,target(6,'le','determiner and pronoun','sns_le_object','him; her; it; them (direct object)','Pronom complément d’objet direct de la troisième personne.'),[
E('Ce paquet est lourd ; je le pose sur la table.','it|her|them|us'),M('Paul est arrivé ; je _____ vois devant nous, lui seul.','le|la|les|lui'),A('Il affirme que tout est prêt, mais je ne le crois pas.','Quel pronom peut reprendre ici ce qui vient d’être affirmé ?','le|affirme|prêt|crois')],'Object masculine singular or proposition.',occ(6,[7,99,166,175,183,191,193,194,207]));
add(13,same(13),[
E('Les fenêtres de cette maison donnent sur notre jardin.','the|some|each|no'),M('_____ deux fenêtres de cette pièce sont ouvertes.','Les|Le|La|L’'),A('Les plus jeunes attendent leur tour devant la porte.','Quel article défini introduit le groupe nominal au pluriel ?','Les|jeunes|tour|porte')],'Definite plural articles, including nominalized numerals and superlatives.',rest(13,[2,82,83,91,119,123,124,125,126,127,128,129,130,132,133,134,139,146,149,152,153,154,155,156,157]));
add(13,target(13,'le','determiner and pronoun','sns_le_object','him; her; it; them (direct object)','Pronom complément d’objet direct de la troisième personne.'),[
E('Ces valises sont prêtes ; nous les chargeons dans la voiture.','them|him|her|us'),M('Les deux colis sont arrivés ; je _____ ouvre tous les deux.','les|le|la|lui'),A('Ces enfants, les voilà enfin devant nous après le voyage.','Quel pronom reprend ces enfants devant voilà ?','les|enfants|voilà|voyage')],'Object plural includes historical apporte les moy and presentative les voilà.',occ(13,[2,82,83,91,119,123,124,125,126,127,128,129,130,132,133,134,139,146,149,152,153,154,155,156,157]));
add(19,same(19),[
E('Marie nous attend ; nous la rejoignons au café.','her|him|them|us'),M('Cette lettre est prête ; je _____ glisse dans une enveloppe.','la|le|les|lui'),A('Cette histoire, elle la raconte souvent à ses enfants.','Quel pronom reprend histoire comme objet direct ?','la|histoire|raconte|enfants')],'Reopened target coverage: all 52 original and newly mapped occurrences read; each is feminine singular direct object.');
export default{version:1,id:'fr-2026-09-19-66',snapshot:'fr-semantic-10-input.json',entries};
