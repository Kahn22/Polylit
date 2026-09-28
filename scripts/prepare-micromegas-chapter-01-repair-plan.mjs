import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {loadPublication} from '../dist/publication/repository.js';
const root=resolve('content/sources/wrk_voltaire_micromegas');
const read=name=>JSON.parse(readFileSync(resolve(root,name)));
const hash=value=>createHash('sha256').update(value).digest('hex');
const pub=loadPublication();
const applied=process.argv.includes('--after');
const drafts=Array.from({length:23},(_,n)=>read(`chapter-01-batch-${String(n+1).padStart(2,'0')}.json`).items).flat();
const decisions=[...read('chapter-01-shared-identity-01.json').items,...read('chapter-01-shared-lemma-02.json').items];
const specs=[
 {key:'soeur_sibling',senseId:'sns_cendrillon_s_ur_femme_ou_fille_ayant_le_meme_pere_et_la_meme_mere_que_la_personne_consideree_si_un_seul_des_parents_est_commun_c_est_une_demi_s_ur_722dee1466',proposedGloss:'sister; sisters',action:'Adjust shared sense gloss to cover both singular and plural. Keep the two existing surfaces and all six authored questions; the singular Micromégas form reuses its existing identity after exact-revision review.'},
 {key:'ciel_visible_sky',senseId:'sns_cendrillon_ciel_espace_immense_dans_lequel_se_meuvent_tous_les_astres_bf02df63bc',action:'Replace the three published dictionary-placeholder bands with the source-reviewed, contextual Micromégas sky questions; review the existing capitalized quiz target against the lowercase published surface. Retain the established identity and any learner progress.'},
 {key:'oiseau_bird',senseId:'sns_parure_oiseau_bird_9f2b853e65',proposedGloss:'bird; birds',action:'Adjust the shared gloss to cover the existing plural oiseaux and proposed singular oiseau. Preserve the old plural identity, one indexed use and its three grammatical questions; add a new singular surface with its own three source-reviewed bands at import.'}
];
const items=specs.map(spec=>{
 const decision=decisions.find(x=>x.key===spec.key),draft=drafts.find(x=>x.key===spec.key);
 const sense=pub.bundle.senses.find(s=>s.id===spec.senseId);
 if(!decision||!draft||!sense||![decision.selectedSenseId,decision.selectedIdentity?.split(':').at(-1)].includes(spec.senseId))throw Error(`Stale repair target ${spec.key}`);
 const linked=pub.bundle.surfaceForms.filter(s=>s.lemmaId===sense.lemmaId);
 const identities=linked.filter(s=>pub.bundle.occurrences.some(o=>o.surfaceFormId===s.id&&o.senseId===sense.id)||[...pub.preparedQuizzes.values()].some(q=>q.subject?.surfaceFormId===s.id&&q.subject?.senseId===sense.id)).map(s=>({surfaceId:s.id,form:s.form,occurrences:pub.bundle.occurrences.filter(o=>o.surfaceFormId===s.id&&o.senseId===sense.id).map(o=>({id:o.id,workId:o.workId,unitId:o.unitId,start:o.start,end:o.end})),quizzes:[...pub.preparedQuizzes.values()].filter(q=>q.subject?.surfaceFormId===s.id&&q.subject?.senseId===sense.id).map(q=>({id:q.id,band:q.band,sha256:hash(JSON.stringify(q))}))}));
 return {...spec,currentGloss:sense.gloss,currentDefinition:sense.definition,publishedSenseSnapshotSha256:hash(JSON.stringify(sense)),publishedIdentityDependencies:identities,proposedReplacementBands:spec.key==='ciel_visible_sky'?draft.questions:undefined,draftQuestionsSha256:hash(JSON.stringify(draft.questions)),sourceOccurrences:draft.sourceOccurrences,status:'proposal_only_published_change_requires_exact_revision_review'};
});
if(items[0].publishedIdentityDependencies.length!==2||items[0].publishedIdentityDependencies.reduce((n,i)=>n+i.occurrences.length,0)!==14||items[1].publishedIdentityDependencies.reduce((n,i)=>n+i.quizzes.length,0)!==3||items[2].publishedIdentityDependencies.reduce((n,i)=>n+i.occurrences.length,0)!==1)throw Error('Affected published records changed');
if(applied&&(!items.every(e=>!e.proposedGloss||e.currentGloss===e.proposedGloss)||!read('chapter-01-batch-21.json').items.some(i=>i.key==='ciel_visible_sky')))throw Error('Published repair has not been applied');
writeFileSync(resolve(root,'chapter-01-published-repair-plan.json'),JSON.stringify({version:1,workId:'wrk_voltaire_micromegas',status:applied?'published_gloss_repairs_applied_sky_questions_prepared_pending_first_use':'reviewed_repair_proposals_no_published_mutation',...(applied?{publicationBatchId:'fr-micromegas-shared-repair-2026-09-27-01'}:{}),sourceSha256:hash(readFileSync(resolve(root,'canonical-draft.txt'))),note:applied?'Two existing glosses repaired across their approved published identities; all nine active questions reapproved. Three sky placeholders replaced with authored questions under stable IDs, pending first indexed use and final approval. Before and after published records are in the named editorial batch; no learner mastery moved.':'All published identities, old indexed uses and active question hashes affected by these repairs are listed. No content mutation or editorial approval is performed by this plan. Run exact-revision publication impact and reapprove every dependent identity when executing the repairs.',items},null,2)+'\n');
console.log(JSON.stringify({repairs:items.length,affectedIdentities:items.reduce((n,i)=>n+i.publishedIdentityDependencies.length,0)}));
