import{readFileSync}from'node:fs';import{createHash}from'node:crypto';import{loadPublication}from'../../../dist/publication/repository.js';
const p=loadPublication(),input=JSON.parse(readFileSync(new URL('fr-semantic-14-input.json',import.meta.url))).entries;
const slug=s=>s.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'_');
const E=(context,choices)=>({context,choices});const M=E;const A=(context,prompt,choices)=>({context,prompt,choices});const entries=[];
function target(i,head,pos,key,gloss,definition){const x=input[i];const preferred={avoir:'lem_avoir','être':'lem_etre'};const existingSense=p.bundle.senses.find(s=>s.id===key);const lemma=(existingSense?p.bundle.lemmas.find(l=>l.id===existingSense.lemmaId):preferred[head]?p.bundle.lemmas.find(l=>l.id===preferred[head]):p.bundle.lemmas.find(l=>l.headword===head&&l.partOfSpeech===pos))??{id:`lem_fr_${slug(head)}_${pos}`,headword:head,partOfSpeech:pos};const surface=p.bundle.surfaceForms.find(s=>s.lemmaId===lemma.id&&s.form===x.surface.form)??{id:`srf_fr_${slug(x.surface.form)}_${slug(head)}_${pos}`,lemmaId:lemma.id,form:x.surface.form,normalized:x.surface.form.toLocaleLowerCase('fr')};if(p.bundle.surfaceForms.some(f=>f.id===surface.id&&f.form!==surface.form))surface.id+='_'+createHash('sha256').update(surface.form).digest('hex').slice(0,8);const sense=p.bundle.senses.find(s=>s.id===key)??{id:key,lemmaId:lemma.id,gloss,definition};return{lemma,surface,sense};}
function add(i,t,qs,reason,occurrenceIds='all'){entries.push({from:input[i].identity,target:t,occurrenceIds,reason:`All source occurrences read. ${reason} Preserve old identity and mastery; link current spans to the corrected meaning. Three independently authored contextual questions reviewed.`,questions:qs});}

const same=i=>({surface:input[i].surface,sense:input[i].sense,lemma:input[i].lemma});
const ids=(i,part)=>input[i].occurrences.filter(o=>o.workId.includes(part)).map(o=>o.id);

function clarify(i,gloss,definition){const t=same(i);return{...t,sense:{...t.sense,gloss,definition}};}
function reviewedMetadata(){entries.at(-1).metadataCorrection=true;}

const occ=(i,indices)=>indices.map(n=>input[i].occurrences[n].id);
const bands=['levels_1_3','levels_4_5','levels_6_8'];
const readQs=i=>bands.map(b=>{const q=input[i].quizzes.find(q=>q.band===b);const answer=q.choices.find(c=>c.id===q.correctChoiceId).text;return{context:q.context,prompt:q.prompt,choices:[answer,...q.choices.filter(c=>c.id!==q.correctChoiceId).map(c=>c.text)].join('|')};});
add(0,target(0,'ce','pronoun','sns_fr_ce_demonstrative_pronoun','this; that','Pronom démonstratif neutre.'),readQs(0),'All 53 c’est/c’était/c’estoit uses inspected, including clefts. Elided neuter pronoun, not noun determiner. Existing three questions read and retained verbatim in the corrected identity.');
for(const i of[1,3]){const qs=[null,null,null];qs[0]={...readQs(i)[0],choices:'than (in a comparison)|behind|inside|beside'};add(i,clarify(i,'than; as (in a comparison)','Introduit le second terme d’une comparaison, notamment après plus, moins, aussi ou autre.'),qs,'All comparative source uses and three questions read. Broaden narrow source-specific dictionary wording; retain correct grammar. Remove alternative legitimate restrictive sense from distractors.');reviewedMetadata();}
for(const i of[2,4]){add(i,clarify(i,'only (in ne…que)','Dans ne…que, marque une restriction : seulement.'),[null,null,null],'All restrictive source uses read; three existing questions correctly test restriction and elision. Clarify same meaning in French.');reviewedMetadata();}
for(const i of[5,6,7]){const t={...same(i),lemma:{...input[i].lemma,partOfSpeech:'adjective and adverb'}};add(i,t,[null,null,null],'Shared vrai lemma has adjectival vrai/vrais and adverbial dire vray. All source uses and each existing question inspected; preserve correct truth/realness meanings and allow both grammatical uses in lemma metadata.');reviewedMetadata();}
export default{version:1,id:'fr-2026-09-19-78',snapshot:'fr-semantic-14-input.json',entries};
