import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const dir=resolve('content/sources/wrk_voltaire_micromegas');
const read=n=>JSON.parse(readFileSync(resolve(dir,n)));
const hash=b=>createHash('sha256').update(b).digest('hex');
const plan=read('unit-plan.json');
const coverage=read('chapter-01-coverage.json');
const notes=[
['fourmilière_anthill','The anthill metaphor for Earth retains the anthill referent; all three questions identify an ant colony home.'],
['lieues_distance','All indexed uses measure historical distance; the questions distinguish units of length from time without asserting one fixed modern conversion.'],
['géomètres_geometry','The narratorial geometers compute proportions, matching the geometry specialists in each question.'],
['globe_planet','Across the work globe refers to a world, including Earth and Saturn; the questions target an entire planet rather than a geographic town.'],
['nature_world','This group refers to the natural world or its workings; the separate kind/character group remains excluded.'],
['nature_kind','De même nature and de cette nature mean kind, distinct from the natural-world contexts; the three bands distinguish type from other properties.'],
['sirien_inhabitant','Sirien is a demonym for the inhabitant of Sirius, preserving printed capitalization and contrasting other planetary origins.'],
['muphti_mufti','The historical spelling denotes a Muslim legal-religious authority; the questions do not assert that the censor is a judge.'],
['gravitation_attraction','The physical gravitation law in the source supports the attraction meaning and not a political law.'],
['comète_astronomy','The traveler uses a comet as conveyance; the astronomical object remains a comet rather than a star or planet.'],
['circonférence_perimeter','The measured perimeter is a circumference, distinct from radius or diameter in every band.'],
['diamètre_width','The revised middle band specifies a center-crossing segment and removes generic segment, which was also true of the original description.'],
['microscopes_optical','Ordinary microscopes fail to reveal tiny Sirian insects; all three bands use optical instruments and retain plural agreement.'],
['heresie_religious','The censor calls propositions heretical; the question frames heresy as an accusation against doctrine, not a finding of fact.'],
['jurisconsultes_legal','Legal scholars condemn a book unread in the satire; the questions ask for expertise in law, not a judicial office.'],
['berline_carriage','The source contrasts a coach with post chaise; every band uses a horse-drawn historical coach rather than a modern sedan.'],
['toises_historical_length','All six sources use historical lengths; distractors in the noun blank are plural feminine units or objects with the same agreement.'],
['secretaire_academy_official','The Saturnian and Paris academies share an official secretary role; the questions distinguish that office from president or visitor.'],
['sculpteurs_artists','Sculptors are invoked alongside painters to reason about body proportions; the questions distinguish the two arts.'],
['voyageur_traveler','Each singular source token denotes a traveler; the singular surface stays distinct from unreviewed plural morphology.'],
['planete_world','The named planet of the traveler and later planetary bodies share the astronomical sense.'],
['livre_book','The censored book and the final book are written works, not a unit of weight.'],
['hauteur_height','The vertical dimension is consistently height, including later body comparisons.'],
['habitant_resident','The individual inhabitant of Sirius shares a sense with later individual residents but retains singular mastery.'],
['etres_beings','These plural beings include creatures of different sizes; no infinitive être is assigned to this noun identity.'],
['insectes_insects','The Sirian small creatures and later metaphorical humans preserve the insect comparison while keeping the underlying referent legible.'],
['etoiles_stars','Star occurrences are celestial luminous bodies; the questions distinguish self-luminous stars from planets.'],
['voyage_journey','Journey contexts cover movement between worlds and cities; the questions distinguish the trip from an event on the trip.'],
['petitesse_smallness','The smallness of Saturn and its inhabitants supports the measurable-size gloss, not a moral judgment.'],
['habitants_residents','Plural inhabitants in planetary communities share the singular resident sense but require a separate surface-plus-sense mastery key.'],
['cinquante_fifty','Every selected occurrence is the cardinal fifty; the three bands exercise numerical value.'],
['huit_eight','Eight remains a cardinal in length and banishment measures; the four workwide spans agree.'],
['citoyens_inhabitants','Revised all three bands to identify membership in a planetary community instead of falsely requiring civic voting rights.'],
['propositions_mathematical','Euclid propositions are mathematical statements awaiting proof; the censorship claims are a separate meaning.'],
['propositions_assertions','Suspect or philosophical propositions are stated claims, not Euclidean theorems; both indexed contexts fit.'],
['tiers_third','The nose-to-face ratio is one third; the questions distinguish other fractional denominators.'],
['fraction_part','The additional fractional foot is a part of a unit, not another complete foot.'],
['metaphysicien_philosopher','The ironic poor metaphysician studies metaphysics; the questions distinguish other professions.'],
['tracasseries_hassles','Petty court vexations explain the limited grief at banishment; the questions retain plural feminine agreement.'],
['peintres_painters','Painters are paired with sculptors for bodily proportion; the questions focus the artists who paint.'],
['sur_le_champ_immediately','One hyphenated adverb means immediately in both indexed contexts, with no duplicate phrase identity.'],
['rayon_lightbeam','A solar ray used for travel remains a beam of light; the questions avoid nonlight rayon senses.'],
['lois_physical_laws','Laws govern gravitation here; the questions distinguish natural principles from legislation.'],
['forces_physical','Attractive and repulsive physical forces occur together; the noun alternatives remain feminine plural.'],
['attractives_attracting','The feminine plural adjective agrees with forces and denotes drawing objects together.'],
['repulsives_repelling','The feminine plural adjective agrees with forces and denotes moving objects apart.'],
['inventions_new_creations','Fontenelle reports others’ inventions; machine examples in the questions illustrate but do not exhaust ideas or discoveries.'],
['calculs_computations','Great calculations are numerical operations, distinct from artistic writing and drawings.'],
['academie_scholarly','The Saturn and Paris academies are learned institutions, not a schoolroom or book storage.'],
['conversation_dialogue','The narrator promises an exchange of speech, matching later conversation contexts.']
];
const byKey=new Map(notes);
if(notes.length!==50||byKey.size!==50)throw Error('Expected 50 individual review notes');
const items=[];
const evidence=[];
for(let n=1;n<=5;n++){
 const file=`chapter-01-batch-${String(n).padStart(2,'0')}.json`;
 const bytes=readFileSync(resolve(dir,file));const batch=JSON.parse(bytes);
 evidence.push({file,sha256:hash(bytes)});
 for(const item of batch.items){
  const reviewNote=byKey.get(item.key);if(!reviewNote)throw Error(`Missing review note ${item.key}`);byKey.delete(item.key);
  const chapterUse=item.sourceOccurrences.find(occ=>occ.chapter===1);
  if(!chapterUse||plan.units[chapterUse.unit-1]?.text.slice(chapterUse.start,chapterUse.end)!==chapterUse.text)throw Error(`Stale source ${item.key}`);
  const token=coverage.tokens.find(t=>t.unit===chapterUse.unit&&t.start===chapterUse.start&&t.end===chapterUse.end);
  if(token?.draft?.key!==item.key||token.candidates.length)throw Error(`Wrong identity candidate ${item.key}`);
  if(item.questions.length!==3||item.questions.some(q=>q.choices.length!==4||new Set(q.choices).size!==4||!q.choices.includes(q.answer)))throw Error(`Bad question shape ${item.key}`);
  items.push({key:item.key,form:item.form,batchFile:file,firstChapterUse:{unit:chapterUse.unit,start:chapterUse.start,end:chapterUse.end,text:chapterUse.text},workwideUseCount:item.sourceOccurrences.length,questionBands:item.questions.map(q=>q.band),questionSha256:hash(JSON.stringify(item.questions)),occurrencesSha256:hash(JSON.stringify(item.sourceOccurrences)),publishedExactCandidateCount:0,decision:'retain_offline_draft_pending_final_identity_and_question_signoff',reviewNote});
 }
}
if(byKey.size)throw Error(`Unused review notes ${[...byKey.keys()]}`);
writeFileSync(resolve(dir,'chapter-01-qa-01.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',chapter:1,status:'contextual_source_and_three_band_question_review_recorded_unpublished',scope:'Meaning drafts in batches 01–05, 50 meanings and 150 authored questions',sourceSha256:hash(readFileSync(resolve(dir,'canonical-draft.txt'))),unitPlanSha256:hash(readFileSync(resolve(dir,'unit-plan.json'))),coverageSha256:hash(readFileSync(resolve(dir,'chapter-01-coverage.json'))),batchEvidence:evidence,corrections:[{key:'diamètre_width',field:'levels_4_5',reason:'A generic segment also satisfied the prior geometric description; substituted centre and specified center-crossing segment.'},{key:'citoyens_inhabitants',field:'all_question_bands',reason:'Planetary membership does not imply the formal voting rights used in the previous questions.'}],note:'Individual source contexts, intended meanings, choice grammar and answer uniqueness checked for the first fifty drafts. This review records concrete corrections without certifying final shared-identity mapping, all later contexts, or learner publication.',items},null,2)+'\n');
console.log(JSON.stringify({meaningReviews:items.length,questionBandsReviewed:items.length*3,corrections:2}));
