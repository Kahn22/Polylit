import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {currentExactCandidates,currentFrenchLemmaSenses,frenchLemmaSnapshotHash} from './prepare-micromegas-chapter-01-shared-snapshot.mjs';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=name=>JSON.parse(readFileSync(resolve(dir,name)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const plan=read('unit-plan.json');
const coverage=read('chapter-01-coverage.json');
const drafts=Array.from({length:24},(_,n)=>read(`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`).items).flat();
const targets=drafts.filter(item=>!currentExactCandidates(item.form).length).slice(100);
const decisions={
 conviendront_agree:['link_published_sense','The sculptors will agree on a measured conclusion; the existing convenir covers reaching agreement on a point.','sns_convenir_primary'],
 mises_placed:['link_published_sense','Nature metaphorically placed differences among beings, covered by mettre in a location or position.','sns_mettre_primary'],
 dite_said:['link_published_sense','Dite refers back to the previously stated height, the ordinary verbal say/tell sense.','sns_dire_primary'],
 ayons_have_subjunctive:['link_published_sense','The narrator has distinguished geometers in his known group; subjunctive mood does not change avoir possession.','sns_avoir_primary'],
 etudiait_studied:['link_published_sense','Studying at school entails examining material to understand it, covered by the existing étudier sense.','sns_zola_etudier_examine'],
 devina_inferred:['link_published_sense','The young scholar worked out propositions without direct proof, matching existing deviner inference.','sns_fr_deviner_infer'],
 devine_inferred:['link_published_sense','The workwide insights reach conclusions without full prior knowledge, matching existing deviner inference.','sns_fr_deviner_infer'],
 jouant_effortlessly:['new_sense_existing_lemma','En se jouant means with playful ease in calculation, distinct from literal play or playing an instrument.'],
 devint_became:['link_published_sense','The change into a geometer is a change of state, matching the published devenir sense.','sns_zola_devenir_become'],
 paraitre_appear_at_court:['new_sense_existing_lemma','Showing oneself physically at court differs from the apparent/seeming meaning exercised by all old paraître questions.'],
 remplie_filled:['new_sense_existing_lemma','A court full of petty quarrels is filled, not fulfilling an obligation or task.'],
 connaissait_knew:['link_published_sense','Knowledge of laws and forces is knowing a subject, covered by the published connaître knowledge sense.','sns_zola_connaitre_know'],
 servait_used:['new_sense_existing_lemma','Se servait des forces means used them; the existing servir senses cover food service, serving as or being useful.'],
 oiseau_bird:['link_published_sense','The singular oiseau and plural oiseaux share the bird sense; the revised shared gloss now covers both. Add a singular surface with its own reviewed bands while preserving the plural identity.','sns_parure_oiseau_bird_9f2b853e65'],
 oblige_compelled:['link_published_sense','The narrator is obliged to concede a point, matching the published compel/oblige sense.','sns_zola_obliger_compel'],
 plaise_heaven_forbid:['new_sense_existing_lemma','À Dieu ne plaise is a fixed rejection formula, not the ordinary pleasing of someone.'],
 tourne_traveled_around:['new_sense_existing_lemma','After traveling around, the giant arrives on Saturn; old tourner examples are bodily changes of orientation.'],
 nouvelles_new_things:['link_published_sense','The plural adjective describes unfamiliar new things, matching the existing nouveau new sense.','sns_fr_nouveau_new'],
 sages_wise_people:['new_sense_existing_lemma','Les plus sages is a substantive noun group of wise people; the current sage identity and questions teach an adjective.'],
 pays_la_that_place:['link_published_sense','The hyphenated demonstrative points to a land or country already referenced, the published pays territory sense.','sns_zola_pays_country'],
 moqua_mocked:['link_published_sense','Mocking Saturnians matches the published se moquer derision sense.','sns_cendrillon_moquer_se_railler_de_quelqu_un_ou_de_quelque_chose_en_rire_en_faire_un_sujet_de_plaisanterie_ou_de_derision_ed5e0baacf'],
 comprit_understood:['link_published_sense','Realizing the idea is grasping its significance, matching published comprendre.','sns_zola_comprendre_understand'],
 vite_quickly:['link_published_sense','The adverb marks rapid thought or movement, matching published vite quickly.','sns_cendrillon_vite_rapidement_avec_vitesse_5bc32d98b1'],
 etroite_close_relationship:['new_sense_existing_lemma','An intimate friendship is figuratively close, distinct from the published narrow or strict physical sense.'],
 rendait_gave_account:['new_sense_existing_lemma','Rendait compte reports inventions; existing rendre senses are giving back, issuing judgment or causing a change.'],
 rapporterai_recount:['new_sense_existing_lemma','The narrator will relate a conversation; old rapporter corresponds to something or brings an object back.']
};
const newSenseGroups={geometre_geometry_scholar:'géomètre:geometry_specialist',voyager_travel:'voyager:travel',voyagent_travel_present:'voyager:travel'};
const first=read('chapter-01-shared-lemma-01.json').items;
const oldGroups={geometre_geometry_scholar:'géomètres_geometry'};
for(const [key,prior] of Object.entries(oldGroups))if(!first.some(i=>i.key===prior))throw Error(`Missing related earlier draft ${prior}`);
const limit=Number(process.argv[2]??92);
if(!Number.isInteger(limit)||limit<1||limit>92)throw Error('Limit must be 1–92');
const items=[];
for(const item of targets.slice(0,limit)){
 const candidates=currentFrenchLemmaSenses(item.lemma);const spec=decisions[item.key];
 if(Boolean(candidates.length)!==Boolean(spec))throw Error(`Unreviewed lemma match ${item.key}`);
 const [decision,reason,selectedSenseId]=spec??['new_lemma_sense','No matching French lemma headword exists in the current published catalogue; create a sense under a new lemma at final bundle signoff.'];
 const selected=selectedSenseId?candidates.filter(c=>c.senseId===selectedSenseId):[];
 if(selectedSenseId&&selected.length!==1)throw Error(`Missing published sense ${item.key}`);
 const use=item.sourceOccurrences.find(o=>o.chapter===1),token=coverage.tokens.find(t=>t.unit===use.unit&&t.start===use.start&&t.end===use.end);
 if(plan.units[use.unit-1]?.text.slice(use.start,use.end)!==use.text||token?.draft?.key!==item.key)throw Error(`Stale source ${item.key}`);
 items.push({key:item.key,form:item.form,lemma:item.lemma,draftMeaning:item.meaning,firstChapterUse:use,workwideUseCount:item.sourceOccurrences.length,draftQuestionsSha256:hash(JSON.stringify(item.questions)),publishedLemmaSenseCount:candidates.length,publishedLemmaSnapshotSha256:frenchLemmaSnapshotHash(item.lemma),decision,...(newSenseGroups[item.key]?{newSenseGroup:newSenseGroups[item.key],relatedEarlierDraft:oldGroups[item.key]}:{}),...(selected.length?{selectedSenseId:selected[0].senseId,selectedLemmaId:selected[0].lemmaId,selectedPublishedGloss:selected[0].gloss,selectedPublishedQuestionCount:selected[0].quizCount,selectedPublishedOccurrenceCount:selected[0].publishedOccurrenceCount}:{}),reason});
}
if(targets.length!==92||Object.keys(decisions).length!==26||new Set(items.map(i=>i.key)).size!==limit)throw Error('Scope or unique key mismatch');
const summary=Object.fromEntries([...new Set(items.map(i=>i.decision))].map(k=>[k,items.filter(i=>i.decision===k).length]));
if(limit===92&&(summary.link_published_sense!==16||summary.new_sense_existing_lemma!==10||summary.new_lemma_sense!==66))throw Error(`Unexpected final decisions ${JSON.stringify(summary)}`);
writeFileSync(resolve(dir,'chapter-01-shared-lemma-02.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:limit===92?'offline_existing_lemma_and_new_lemma_review_unpublished':'internal_review_in_progress_not_final',scope:`Last ${limit} of 92 chapter I draft meanings without an exact published surface, in batch/source order`,sourceSha256:hash(readFileSync(resolve(dir,'canonical-draft.txt'))),unitPlanSha256:hash(readFileSync(resolve(dir,'unit-plan.json'))),coverageSha256:hash(readFileSync(resolve(dir,'chapter-01-coverage.json'))),reviewedMeanings:limit,remainingMeanings:92-limit,note:'Current French lemma senses and published question/use counts checked for each draft. Surface-specific Micromégas questions remain offline, and no published identity is mutated or imported. Cross-ledger new sense groups preserve geometry-specialist and travel senses across singular/plural or infinitive/finite surfaces.',summary,items},null,2)+'\n');
console.log(JSON.stringify({reviewed:limit,remaining:92-limit,summary}));
