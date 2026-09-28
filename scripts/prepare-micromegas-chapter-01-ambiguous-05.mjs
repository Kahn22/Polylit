import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const folder=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=readFileSync(resolve(folder,'chapter-01-coverage.json'));const coverage=JSON.parse(bytes);
const decisions=[
 {form:'roi',locations:'3:237 7:180 8:201',identity:'srf_cendrillon_roi_lem_cendrillon_roi_noun_edddf2e562_aa31040522:sns_cendrillon_roi_titre_porte_par_celui_qui_regne_sur_un_peuple_un_etat_en_particulier_un_etat_monarchique_et_qui_tient_sa_fonction_de_l_heredite_ou_de_l_election_celui_qui_est_a_la_tete_d_un_royaume_93d71f9fb3',rationale:'Pied de roi names a historical royal foot of length. Roi still denotes the monarch whose standard supplies the measure, rather than a new general meaning for every roi token; the full unit is explained in the separate pieds length draft. The later king of Prussia has the same underlying monarch meaning.'},
 {form:'fit',locations:'1:184',identity:'srf_fit:sns_fr_faire_perform_activity',rationale:'Le dernier voyage qu’il fit describes the journey he made or undertook. This is the published perform-an-activity sense; the other fit uses in the chapter describe causing condemnation, causing trouble or composing a song and require their own contextual assignments.'}
];
const reserved=new Set();for(const name of ['chapter-01-reuse-01.json','chapter-01-reuse-02.json','chapter-01-reuse-03.json','chapter-01-reuse-04.json','chapter-01-reuse-05.json','chapter-01-reuse-06.json','chapter-01-reuse-07.json','chapter-01-ambiguous-01.json','chapter-01-ambiguous-02.json','chapter-01-ambiguous-03.json','chapter-01-ambiguous-04.json']){
 for(const item of JSON.parse(readFileSync(resolve(folder,name))).items)for(const o of item.occurrences)reserved.add(`${o.unit}:${o.start}`);
}
const items=decisions.map(rule=>({form:rule.form,identity:rule.identity,rationale:rule.rationale,status:'chapter_context_reviewed_reuse_pending_final_bundle_signoff',occurrences:rule.locations.split(' ').map(loc=>{
 if(reserved.has(loc))throw Error(`Overlapping ${loc}`);reserved.add(loc);
 const t=coverage.tokens.find(x=>`${x.unit}:${x.start}`===loc&&x.form===rule.form);
 const candidate=t?.candidates.find(c=>c.identity===rule.identity);
 if(!candidate||candidate.preparedBands.join(',')!=='levels_1_3,levels_4_5,levels_6_8')throw Error(`Published sense/questions missing: ${loc}`);
 return {chapter:1,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,identity:rule.identity,gloss:candidate.gloss};
 })}));
const output={version:1,workId:coverage.workId,chapter:1,status:'offline_contextual_ambiguous_reuse_unpublished',coverageSha256:createHash('sha256').update(bytes).digest('hex'),note:'Royal qualifier in the historical length measure and the performed journey reuse existing published identities without changing mastery; other same-form contexts stay open.',items};
writeFileSync(resolve(folder,'chapter-01-ambiguous-05.json'),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,x)=>n+x.occurrences.length,0)}));
