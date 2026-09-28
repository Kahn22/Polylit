import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {currentExactCandidates,exactCandidateHash} from './prepare-micromegas-chapter-01-shared-snapshot.mjs';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=name=>JSON.parse(readFileSync(resolve(dir,name)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const plan=read('unit-plan.json');
const coverage=read('chapter-01-coverage.json');
const drafts=Array.from({length:24},(_,n)=>read(`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`).items).flat();
const decisions={
 dernier_most_recent:['separate','The old questions explicitly teach the latter of two people; the journey here is the most recent in a sequence.'],
 haut_vertical_measure:['separate','The published identities are aloud and a nominal top; de haut states vertical extent.'],
 pieds_length_measure:['separate','Anatomical feet are not historical units of length. The same printed form needs its own measured-unit meaning.'],
 public_people:['separate','Au public is a noun referring to people, while the old adjective means accessible or publicly known.'],
 font_amount_to:['separate','The product of pace count and foot length amounts to a measured total, distinct from an action, transformation or creation.'],
 tour_circumference:['separate','De tour measures distance around an object, distinct from a turn or a stroll.'],
 dis_say:['reuse_ready','Dis-je reports the narrator’s spoken words; the existing first-person say identity has three context-appropriate reviewed bands.','sns_dire_primary'],
 fois_multiplier:['separate','Fois plus is multiplication by a factor; old occasion questions ask when an event recurs.'],
 simple_uncomplicated:['reuse_ready','Rien n’est plus simple shares the old uncomplicated sense despite the narrator’s irony; three old bands fit.','sns_zola_simple_primary'],
 ordinaire_common:['reuse_ready','Rien n’est plus ordinaire uses the old usual/common meaning despite its irony; three old bands fit.','sns_parure_ordinaire_commun_habituel_a8bfdb1e4d'],
 tour_full_circuit:['separate','Faire le tour is a complete circuit of a globe or territory, distinct from the existing turn or short stroll quizzes.'],
 taille_stature:['separate','A measured bodily stature is neither the waist nor the garment cut in the current catalogue.'],
 fait_yields_result:['separate','Ce qui fait une proportion produces a numerical result; existing passive done, activity, causative and transformation bands do not teach it.'],
 corps_physical:['separate','The giant’s physical body differs from the published institutional corps.'],
 soeur_sibling:['reuse_ready','The printed singular sœur and all three published question bands denote a female sibling. The shared gloss now covers singular and plural; reuse the existing identity without resetting mastery.','sns_cendrillon_s_ur_femme_ou_fille_ayant_le_meme_pere_et_la_meme_mere_que_la_personne_consideree_si_un_seul_des_parents_est_commun_c_est_une_demi_s_ur_722dee1466'],
 depuis_afterward:['separate','Devint depuis means became later; since/from marks a starting point or duration.'],
 fit_caused_trouble:['separate','The book caused trouble; none of the current fit question sets tests this transitive result without an infinitive.'],
 sentant_suggesting_heresy:['separate','Propositions sentant l’hérésie seem to contain a doctrine; sensory experience and feeling one’s own state do not express that censure.'],
 vivement_with_vigor:['separate','The censor prosecuted vigorously; old questions select rapid motion, which the source does not entail.'],
 forme_substantial_scholastic:['separate','The scholastic inner principle is neither outward shape nor formal procedure.'],
 cote_own_side:['separate','Winning people to one’s side means support in a dispute, distinct from an anatomical or spatial side and from working separately on one’s own part.'],
 eut_received_order:['reuse_ready','Eut ordre uses the existing broad avoir/received possession meaning, like the old eut une idée and eut une réaction examples.','sns_zola_avoir_possess_auxiliary'],
 fit_composed_song:['separate','Faire une chanson means composing a new work. The published perform-activity questions teach doing work or attempts, while the published material-creation sense concerns a physical work; neither gives this composition sense.'],
 chaise_postal_carriage:['separate','Chaise de poste is a historical travel vehicle, not a household chair.'],
 allait_moved:['separate','Il allait de globe en globe expresses movement, not an auxiliary near future or progressive verb phrase.'],
 travers_through:['separate','The 1762 Académie distinguishes nominal width from the preposition à travers meaning through the middle. The published width identity and its outside gloss and placeholder questions cannot teach this source use; create a distinct contextual sense. See https://www.dictionnaire-academie.fr/article/A4T0837.'],
 ciel_visible_sky:['reuse_pending_activation','The astronomical sky identity now has three contextual replacement bands in shared source, but no indexed published use. Its questions remain pending approval until Micromégas supplies the first occurrence; keep the planned reuse blocked until then.','sns_cendrillon_ciel_espace_immense_dans_lequel_se_meuvent_tous_les_astres_bf02df63bc'],
 quelque_concessive:['separate','Quelque accoutumé qu’il fût and quelque système qu’ils fissent concede despite a condition, not indefinite quantity.'],
 defendre_resist_reflexive:['separate','Se défendre de sourire is to resist smiling, not protect a person against attack.'],
 enfin_after_all:['separate','Car enfin supplies argumentative support, not a final point in chronological order.'],
 met_begins_reflexive:['separate','Se met à rire means begins; the exact published met place sense is inapplicable. A different surface mit already has a begin sense and must retain its own mastery.'],
 etre_living_being:['separate','Un être pensant is a countable living being, distinct from the verb être and its auxiliary and linking uses.'],
 verite_in_truth:['separate','À la vérité and en vérité serve as discourse formulas meaning in fact. The published truth noun and its three questions concern factual truth as an object; this discourse use needs a separate contextual sense.'],
 compte_report:['separate','Rendre un bon compte des inventions is a narrative report, whereas current compte identities teach numerical accounts and final reckoning.'],
 vers_lines_of_poetry:['separate','Petits vers are poetic lines, distinct from the published directional preposition.'],
 etoile_literal_star:['separate','Sirius is a literal luminous star. All three same-form published questions teach figurative bonne étoile as luck; group this with plural celestial étoiles as one new sense.'],
 honneur_privilege:['separate','The old honor bands all test moral dignity and reputation; meeting someone is a privilege or honor of acquaintance.'],
 tete_body_head:['separate','The old head bands all describe leading a group or staying in front, while this is an anatomical head.'],
 terre_planet_earth:['separate','The three old terre bands teach garden soil; every chapter I use names the Earth as a planet.'],
 ici_in_this_account:['separate','The old here bands are physical place deixis; je rapporterai ici points to this place in the written account.'],
 nom_appellation:['separate','The old name bands teach reputation and clearing an accusation; this word gives the person’s appellation Micromégas.'],
 vers_approximately_age:['separate','The old vers bands all teach movement toward a location; this preposition approximates an age.'],
 pas_historical_length:['separate','The old pas noun bands teach individual steps while walking; a pas géométrique is a standardized historical unit of five feet.'],
 sortir_leaving_childhood:['separate','The old sortir bands concern physically leaving a building; au sortir de l’enfance means emerging from a life stage.']
};
const seen=new Set();const items=[];
for(const token of coverage.tokens){
 const key=token.draft?.key;if(!key||seen.has(key))continue;seen.add(key);
 const candidates=currentExactCandidates(token.form);
 if(!candidates.length)continue;
 const draft=drafts.find(item=>item.key===key);
 const spec=decisions[key];if(!draft||!spec)throw Error(`Missing shared-identity review ${key}`);
 const [decision,reason,selectedSuffix]=spec;
 const selected=selectedSuffix?candidates.filter(c=>c.identity.endsWith(`:${selectedSuffix}`)):[];
 if(selectedSuffix&&selected.length!==1)throw Error(`Selected candidate is missing or ambiguous: ${key}`);
 if(!draft.sourceOccurrences.some(o=>o.chapter===1&&o.unit===token.unit&&o.start===token.start&&o.end===token.end))throw Error(`Stale draft span: ${key}`);
 if(decision==='reuse_ready'&&selected[0].quizCount!==3)throw Error(`Published reuse lacks three question bands: ${key}`);
 items.push({key,form:draft.form,draftMeaning:draft.meaning,chapterUses:draft.sourceOccurrences.filter(o=>o.chapter===1).length,sourceFirstUse:{unit:token.unit,start:token.start,end:token.end,text:token.text},draftQuestionsSha256:hash(JSON.stringify(draft.questions)),publishedExactCandidateCount:candidates.length,publishedExactSnapshotSha256:exactCandidateHash(token.form),decision,...(selected.length?{selectedIdentity:selected[0].identity,selectedPublishedGloss:selected[0].gloss,selectedQuestionCount:selected[0].quizCount,selectedPublishedOccurrenceCount:selected[0].publishedOccurrenceCount}:{}),reason});
}
if(items.length!==44||Object.keys(decisions).length!==44||new Set(items.map(item=>item.key)).size!==44)throw Error(`Expected 44 shared candidates, got ${items.length}`);
const summary=Object.fromEntries([...new Set(items.map(i=>i.decision))].map(k=>[k,items.filter(i=>i.decision===k).length]));
writeFileSync(resolve(dir,'chapter-01-shared-identity-01.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'offline_exact_published_identity_review_unpublished',scope:'All 44 chapter I draft meanings with at least one same-form published surface in the current catalogue, including senses omitted by the older lexical gap report',sourceSha256:hash(readFileSync(resolve(dir,'canonical-draft.txt'))),unitPlanSha256:hash(readFileSync(resolve(dir,'unit-plan.json'))),coverageSha256:hash(readFileSync(resolve(dir,'chapter-01-coverage.json'))),note:'Current published same-form senses and active question sets were reviewed directly. Reuse-ready decisions preserve the selected shared mastery and old question bands; held identities need the specified repair or further sense adjudication. No published content was changed or imported.',summary,items},null,2)+'\n');
console.log(JSON.stringify(summary));
