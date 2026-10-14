import{createHash}from'node:crypto';
import{readFileSync,writeFileSync}from'node:fs';
import{resolve}from'node:path';
const root=resolve('content/sources/wrk_voltaire_micromegas'),read=n=>JSON.parse(readFileSync(resolve(root,n))),sha=b=>createHash('sha256').update(b).digest('hex');
const inv=read('chapter-04-inventory.json'),units=read('unit-plan.json').units;
const pub=read('chapter-04-07-published-candidates.json'),fresh=read('chapter-04-07-new-form-queue.json');
const pending=new Map([...pub.items,...fresh.items].flatMap(row=>row.occurrences.filter(o=>o.chapter===4).map(o=>[`${o.unit}:${o.start}`,{form:row.form,occurrence:o,candidates:row.candidates??[]}])));
// Exact source assignments, not a spelling-wide guess. The published question sets were inspected for these contexts.
const published=[
 ['grand','88:181,110:130','srf_zola_grand_grand:sns_zola_grand_great','The large ocean and grand raisonneur both retain the broad published great/large sense; its three degree questions remain applicable.'],
 ['encore','96:15','srf_encore:sns_encore_primary','Remarquez-vous encore asks the listener to notice another feature; the published still/again/more set covers this additive use.'],
 ['rien','107:48,115:60','srf_rien:sns_rien_primary','Ne vit rien and sans y rien mettre use nothing/anything under negation; the published choices include this negative-pronoun use.'],
 ['gens','97:92,97:204','srf_zola_gens_gens:sns_zola_gens_people','Des gens de bon sens refers to people in general, matching the published neighborhood people questions; attendants were drafted separately.'],
 ['étaient','84:55','srf_zola_etaient_cdec19ace9e4_etre:sns_etre_primary','Où ils étaient is the imperfect of être with locative complement; the published were/conjugation questions apply.'],
 ['convaincu','110:14','srf_zola_convaincu_convaincre:sns_zola_convaincre_persuade','The Saturnian is convinced the world is inhabited; the published convince/persuade meaning and three past-participle questions apply.'],
 ['voilà','88:4','srf_zola_voila_0f351252f6ae_voila:sns_zola_voila_deictic','Les voilà revenus presents the travelers on return; the published deictic there-is/behold sense is suitable.'],
];
const earlier=[
 ['terre','87:133,92:98','chapter-01-identity-plan.json','terre_planet_earth','Both Terre uses denote the planet in its motion and topography, matching the earlier planned planet Earth surface and reviewed questions.'],
 ['nom','88:174','chapter-01-identity-plan.json','nom_appellation','Sous le nom du grand Océan is an appellation, the earlier planned nom sense and same-surface question set.'],
 ['honneur','91:292','chapter-01-identity-plan.json','honneur_privilege','Avoir l’honneur d’exister uses the same ceremonious privilege or courtesy formula as the earlier planned honneur sense.'],
];
const expressions=[
 ['de','95:207','chapter-04-droit-fil-review.json','de_droit_fil','De is part of the reviewed straight-line locution.'],
 ['de','96:133','chapter-04-final-expressions.json','de_facon_que','De introduces the reviewed result conjunction.'],
 ['que','96:142','chapter-04-final-expressions.json','de_facon_que','Que completes the reviewed result conjunction.'],
 ['à','87:107','chapter-04-final-expressions.json','a_la_verite','À begins the corrective locution.'],
 ['à','87:218','chapter-04-final-expressions.json','a_son_aise','À begins the comfortable-manner locution.'],
 ['à','89:32','chapter-04-batch-07.json','mi_jambe_halfway_up_the_leg','À marks the height before the reviewed mi-jambe compound; no independent at/to question is applied.'],
 ['à','89:47','chapter-04-07-expressions.json','a_peine','À peine shares the earlier reviewed temporal expression.'],
 ['à','109:127','chapter-01-expressions-01.json','se_mettre_a','Se mit à rire begins an action, sharing the earlier reflexive-begin identity.'],
 ['en','97:0','chapter-04-final-expressions.json','en_verite','En vérité is an introductory assertion, not the gerund preposition.'],
 ['plus','97:195','chapter-04-final-expressions.json','non_plus','Non plus adds another negated possibility, not a comparative more.'],
 ['par','103:33','chapter-04-final-expressions.json','par_bonheur','Par bonheur means fortunately, not the ordinary by/through preposition.'],
 ['rien','98:65','chapter-04-final-expressions.json','pour_rien','Pour rien means for no purpose; the other two rien occurrences use the published negative pronoun.'],
 ['non','97:191','chapter-04-final-expressions.json','non_plus','Non plus is one negative additive locution.'],
 ['abord','85:15,92:60,107:32','chapter-04-07-expressions.json','d_abord','Each abord is the component of d’abord, which has an existing first/at-first identity.'],
 ['peine','89:49','chapter-04-07-expressions.json','a_peine','Peine is the component of the reviewed à peine temporal expression, not difficulty here.'],
 ['bonheur','103:37','chapter-04-final-expressions.json','par_bonheur','Bonheur belongs to fortunately here, rather than a standalone state of happiness.'],
 ['roi','86:84','chapter-04-final-expressions.json','pieds_de_roi','Pieds de roi denotes the historical length measure, not a ruler.'],
 ['aise','87:224','chapter-04-final-expressions.json','a_son_aise','À son aise expresses comfort, not the published pleased adjective.'],
 ['droit','95:210','chapter-04-droit-fil-review.json','de_droit_fil','Droit is straight in the expression, not law or entitlement.'],
 ['mettre','115:65','chapter-04-final-expressions.json','sans_y_rien_mettre_du_mien','Mettre du mien is adding one’s own invention to the account, not placing an object.'],
 ['cartes','114:166','chapter-04-final-expressions.json','dessous_des_cartes','Cartes is part of the hidden-workings locution, not a literal map or playing-card mastery here.'],
 ['dessous','114:154','chapter-04-final-expressions.json','dessous_des_cartes','Dessous is figurative hidden workings, not a standalone underside.'],
 ['eaux','108:85','chapter-04-entre-deux-eaux-review.json','entre_deux_eaux','Eaux belongs to the literal underwater phrase.'],
 ['fil','95:216','chapter-04-droit-fil-review.json','de_droit_fil','Fil belongs to the straight-line phrase; the later necklace thread has its own draft.'],
 ['mien','115:75','chapter-04-final-expressions.json','sans_y_rien_mettre_du_mien','Mien belongs to the narrator’s no-personal-invention promise.'],
];
const taken=new Set(),items=[];
function add(form,offsets,decision,detail,rationale){for(const k of offsets.split(',')){if(taken.has(k))throw Error(`duplicate ${k}`);taken.add(k);const row=pending.get(k),[unit,start]=k.split(':').map(Number);if(!row||row.form!==form)throw Error(`not pending ${form} ${k}`);const t=inv.tokens.find(t=>t.unit===unit&&t.start===start);if(!t||t.text!==row.occurrence.text||units[unit-1].text.slice(t.start,t.end)!==t.text)throw Error(`source changed ${k}`);items.push({form,occurrence:{chapter:4,unit,start,end:t.end,text:t.text},decision,...detail,rationale});}}
for(const[form,keys,identity,rationale]of published){for(const k of keys.split(',')){const row=pending.get(k);const candidate=row?.candidates.find(c=>c.identity===identity);if(!candidate||candidate.bands.join(',')!=='levels_1_3,levels_4_5,levels_6_8')throw Error(`published questions changed ${k}`);add(form,k,'reuse_published_identity_and_questions',{identity,questionSha256:candidate.questionSha256},rationale)}}
for(const[form,keys,file,key,rationale]of earlier){const plan=read(file),route=plan.items.find(i=>i.key===key);if(!route||!route.questionSha256)throw Error(`Earlier plan missing ${key}`);add(form,keys,'share_earlier_planned_surface_sense_questions',{dependsOn:`${file}:${key}`,earlierPlanSha256:sha(readFileSync(resolve(root,file))),questionSha256:route.questionSha256},rationale)}
for(const[form,keys,file,key,rationale]of expressions){const review=read(file),item=review.items.find(i=>i.key===key);if(!item)throw Error(`Expression missing ${file}:${key}`);for(const k of keys.split(',')){const [unit,start]=k.split(':').map(Number),o=item.sourceOccurrences?.find(o=>o.unit===unit&&o.start<=start&&start<o.end)??item.occurrences?.find(o=>o.unit===unit&&o.start<=start&&start<o.end);const adjacent=file==='chapter-04-batch-07.json'&&item.sourceOccurrences?.some(o=>o.unit===unit&&o.start===start+2);if(!o&&!adjacent&&file!=='chapter-01-expressions-01.json')throw Error(`Expression span missing ${key} ${k}`)}add(form,keys,'covered_expression_or_compositional_component',{dependsOn:`${file}:${key}`,reviewSha256:sha(readFileSync(resolve(root,file)))},rationale)}
if(taken.size!==pending.size)throw Error(`Unassigned Chapter IV queue: ${[...pending.keys()].filter(k=>!taken.has(k)).join(',')}`);
const summary={};for(const item of items)summary[item.decision]=(summary[item.decision]??0)+1;
writeFileSync(resolve(root,'chapter-04-final-dispositions.json'),JSON.stringify({version:1,workId:inv.workId,chapter:4,status:'source_bound_chapter_four_final_token_dispositions_unpublished',sourceSha256:inv.sourceSha256,unitPlanSha256:inv.unitPlanSha256,inventorySha256:sha(readFileSync(resolve(root,'chapter-04-inventory.json'))),summary,items},null,2)+'\n');
console.log(JSON.stringify({uses:items.length,summary}));
