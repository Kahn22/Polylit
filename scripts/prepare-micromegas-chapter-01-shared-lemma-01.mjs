import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {currentExactCandidates,currentFrenchLemmaSenses,frenchLemmaSnapshotHash} from './prepare-micromegas-chapter-01-shared-snapshot.mjs';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=name=>JSON.parse(readFileSync(resolve(dir,name)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const plan=read('unit-plan.json');
const coverage=read('chapter-01-coverage.json');
const allDrafts=Array.from({length:24},(_,n)=>read(`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`).items).flat();
const targets=allDrafts.filter(item=>!currentExactCandidates(item.form).length).slice(0,100);
const reviewed={
 livre_book:['link_published_sense','Written book is exactly the existing book sense, including the final blank volume.','sns_parure_livre_assemblage_de_feuilles_manuscrites_ou_imprimees_destinees_a_etre_lues_a87a577f33'],
 etres_beings:['new_sense_existing_lemma','The plural noun denotes entities or creatures; all existing être senses are verbal.'],
 etoiles_stars:['new_sense_existing_lemma','The plural source tokens denote literal celestial stars. All three published étoile questions teach a figurative lucky star determining a person’s fate; keep that old identity and add a literal-star sense for étoiles.'],
 lois_physical_laws:['new_sense_existing_lemma','Gravitation laws are physical principles; the existing law sense is a state-enforced statute.'],
 forces_physical:['link_published_sense','The published sense includes dynamic physical power capable of producing an effect, which covers attractive and repulsive forces.','sns_zola_force_power'],
 condamner_official_censure:['new_sense_existing_lemma','The scholars condemn a book as doctrine; the published sense sentences a guilty person.'],
 affaires_troubles:['new_sense_existing_lemma','Quelques affaires denotes troubles brought by prosecution, not business, a generic matter or having need of someone.'],
 ordinaires_usual:['link_published_sense','The plural adjective means common or habitual, matching the existing ordinaire sense despite having a new surface.','sns_parure_ordinaire_commun_habituel_a8bfdb1e4d'],
 tournent_orbit:['new_sense_existing_lemma','Planets orbit Sirius; the current tourner sense and its questions concern a body changing orientation.'],
 nommee_called:['link_published_sense','The name Sirius is given to the star; this matches the existing nommer name/call sense.','sns_cendrillon_nommer_attribuer_imposer_un_nom_a_une_personne_une_chose_ou_une_collectivite_6380ea9273'],
 connaitre_person:['link_published_sense','The narrator becomes acquainted with a person, covered explicitly by the existing connaître-person sense.','sns_cendrillon_connaitre_faire_ou_avoir_fait_l_experience_permettant_une_representation_mentale_de_quelque_chose_ou_quelqu_un_avoir_l_idee_la_notion_d_une_personne_ou_d_une_chose_832d4989ec'],
 convient_suits:['new_sense_existing_lemma','The name suits the giant; the existing French convenir sense is agreeing on a decision.'],
 trouveront_deduce:['link_published_sense','Geometers discover a calculated result after seeking it; existing trouver includes a solution found through examination.','sns_zola_trouver_discover'],
 produit_origin:['new_sense_existing_lemma','The planet metaphorically produced its native giant; existing produire presents an item as evidence.'],
 appelait_was_named:['link_published_sense','Se appelait gives the person a name, matching the existing appeler name/call sense, not a summons.','sns_zola_appeler_name'],
 prendront_take_up:['link_published_sense','The geometers physically take up a pen to write; the published grasp-in-hand sense covers this action.','sns_parure_prendre_saisir_mettre_en_sa_main_d76a9c8f6e'],
 etats_territories:['new_sense_existing_lemma','Political territories governed by rulers differ from the published personal or physical condition.'],
 prodigieuses_immense:['link_published_sense','Extraordinary differences in scale match the published exceptional-by-magnitude sense.','sns_zola_prodigieux_extraordinary'],
 demontrer_prove:['link_published_sense','The geometrical proof establishes a result by reasoning, exactly the existing démontrer sense.','sns_zola_demontrer_prove'],
 etant_being:['link_published_sense','The participle links a subject to a measured quality or state, covered by the published copular être sense.','sns_etre_primary'],
 etonnes_surprised:['link_published_sense','Both contexts express a reaction of surprise to unexpected things, matching the published étonner sense.','sns_zola_etonner_surprise']
};
const sharedNewSenseGroups={habitant_resident:'habitant:person_residing',habitants_residents:'habitant:person_residing',planete_world:'planète:celestial_body',planetes_worlds:'planète:celestial_body',etoiles_stars:'étoile:literal_celestial'};
const items=[];
for(const item of targets){
 const candidates=currentFrenchLemmaSenses(item.lemma);
 const spec=reviewed[item.key];
 if(Boolean(candidates.length)!==Boolean(spec))throw Error(`Unreviewed or unexpected lemma match ${item.key}`);
 const [decision,reason,selectedSenseSuffix]=spec??['new_lemma_sense','No matching French lemma headword exists in the published catalogue; create a sense under a new lemma only after final bundle signoff.'];
 const selected=selectedSenseSuffix?candidates.filter(c=>c.senseId===selectedSenseSuffix):[];
 if(selectedSenseSuffix&&selected.length!==1)throw Error(`Selected lemma sense missing ${item.key}`);
 const use=item.sourceOccurrences.find(o=>o.chapter===1);
 const token=coverage.tokens.find(t=>t.unit===use.unit&&t.start===use.start&&t.end===use.end);
 if(plan.units[use.unit-1]?.text.slice(use.start,use.end)!==use.text||token?.draft?.key!==item.key)throw Error(`Stale source ${item.key}`);
 items.push({key:item.key,form:item.form,lemma:item.lemma,draftMeaning:item.meaning,firstChapterUse:use,workwideUseCount:item.sourceOccurrences.length,draftQuestionsSha256:hash(JSON.stringify(item.questions)),publishedLemmaSenseCount:candidates.length,publishedLemmaSnapshotSha256:frenchLemmaSnapshotHash(item.lemma),decision,...(sharedNewSenseGroups[item.key]?{newSenseGroup:sharedNewSenseGroups[item.key]}:{}),...(selected.length?{selectedSenseId:selected[0].senseId,selectedLemmaId:selected[0].lemmaId,selectedPublishedGloss:selected[0].gloss,selectedPublishedQuestionCount:selected[0].quizCount,selectedPublishedOccurrenceCount:selected[0].publishedOccurrenceCount}:{}),reason});
}
if(items.length!==100||Object.keys(reviewed).length!==21||new Set(items.map(i=>i.key)).size!==100)throw Error('Expected 100 unique draft meanings and 21 existing lemmas');
const summary=Object.fromEntries([...new Set(items.map(i=>i.decision))].map(k=>[k,items.filter(i=>i.decision===k).length]));
if(summary.link_published_sense!==12||summary.new_sense_existing_lemma!==9||summary.new_lemma_sense!==79||summary.lemma_sense_hold)throw Error(`Unexpected decisions ${JSON.stringify(summary)}`);
writeFileSync(resolve(dir,'chapter-01-shared-lemma-01.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'offline_existing_lemma_and_new_lemma_review_unpublished',scope:'First 100 chapter I draft meanings with no exact published surface, in batch/source order',sourceSha256:hash(readFileSync(resolve(dir,'canonical-draft.txt'))),unitPlanSha256:hash(readFileSync(resolve(dir,'unit-plan.json'))),coverageSha256:hash(readFileSync(resolve(dir,'chapter-01-coverage.json'))),note:'Compares the current French published lemma and all of its senses, including questions and indexed uses. Link-published-sense decisions use the already reviewed Micromégas surface-specific questions; no learner identity is imported or old mastery changed. Paired new surfaces preserve one intended sense group. The remaining 92 no-exact-form drafts need their own comparison.',summary,items},null,2)+'\n');
console.log(JSON.stringify(summary));
