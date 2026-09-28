import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const folder = resolve('content/sources/wrk_voltaire_micromegas');
const bytes = readFileSync(resolve(folder, 'chapter-01-coverage.json'));
const coverage = JSON.parse(bytes);
const rules = [
  { form:'que', fallback:'srf_que:sns_que_conjunction', groups:[
    ['srf_fr_que_lower_pronoun:sns_fr_que_relative_pronoun','1:120 6:221 7:48 9:47 20:155 29:83'],
    ['srf_que:sns_que_comparative','4:148 12:284 24:60'],
    ['srf_que:sns_que_restrictive','3:303 15:10 15:79 24:30 24:129 26:130'],
    ['srf_que:sns_zola_que_as','10:103'] ],
    rationale:'Relative que links a noun to a clause; comparative que follows a comparison; restrictive que completes ne … que, including the attenuation n’est guère que. À ce que dit sa sœur means as she says. Remaining que uses introduce a complement or result clause.' },
  { form:'qu’', fallback:'srf_qu_elided:sns_que_conjunction', groups:[
    ['srf_fr_qu__que_pronoun:sns_fr_que_relative_pronoun','1:178'],
    ['srf_qu_elided:sns_que_restrictive','6:172 17:21'] ],
    rationale:'Qu’il fit modifies voyage; ne sont qu’une and ne voyagent qu’en restrict with ne. The other four introduce subordinate clauses, including concessive quelque … qu’il fût.' },
  { form:'à', fallback:'srf_a:sns_a_primary', groups:[['srf_fr_a_peu_pres_a:sns_fr_a_peu_pres','25:44']], rationale:'The à of à peu près belongs to its existing approximate expression identity. Other occurrences express destination, location, complement, extent, or the à propos, à l’aide, à travers and à la vérité constructions; their wider expressions remain separately under review.' },
  { form:'en', fallback:'srf_en:sns_en_in', groups:[
    ['srf_en:sns_en_it','9:96 10:56 11:193 19:5 25:5'],
    ['srf_fr_en_en_preposition:sns_fr_en_gerund','10:84 23:76'],
    ['srf_zola_en_en:sns_fr_en_repeated_progression','16:124 19:128 19:191'] ],
    rationale:'En refers back to some of the things or to a previously named object with inventé, deviné, composa, servait and moqua. En se jouant/en voyant introduce simultaneous action. De planète en planète, de globe en globe and de branche en branche form repeated progression. Remaining en marks place, time, manner, vehicle or country.' },
  { form:'d’', fallback:'srf_d_elided:sns_de_primary', groups:[['srf_fr_d_abord_d_elided:sns_fr_d_abord','23:67 25:21']], rationale:'Two d’abord occurrences mean at first; the remaining elided de forms mark relation, material, complement, infinitive construction or source.' },
  { form:'des', fallback:'srf_des:sns_des_primary', groups:[['srf_fr_des_des_article:sns_fr_des_indefinite_plural','12:80 14:43 23:35 24:109']], rationale:'Des propositions, des jurisconsultes, des choses nouvelles and des nains introduce indefinite plural nouns; the other eight are de + les, including un des plus and des inventions des autres.' },
  { form:'plus', fallback:'srf_plus:sns_fr_plus_greater_degree', groups:[['srf_plus:sns_zola_plus_additional','8:205']], rationale:'Plus une fraction adds an extra fraction. All other uses compare magnitude, number or degree, including the superlative le plus and bare plus de cinquante.' },
  { form:'fort', fallback:'srf_cigale_fourmi_fort_lem_cigale_fourmi_fort_adverb_9eb1afa20e_9c17580472:sns_fr_fort_intensifier', groups:[], rationale:'Fort modifies convient, mauvais, curieux, ignorant, plaisante, bien and bon as an intensifying adverb rather than an adjective meaning powerful.' },
  { form:'par', fallback:'srf_par:sns_par_primary', groups:[], rationale:'Par marks the phrasing of a measure, a means, the agency of jurisconsults or transport by a comet.' },
  { form:'du', fallback:'srf_du:sns_du_primary', groups:[], rationale:'Each du contracts de + le before pays, Sirien, soleil or globe; none is the partitive article or a personal-name particle.' },
  { form:'mais', fallback:'srf_mais:sns_mais_primary', groups:[], rationale:'Each occurrence opposes or qualifies the preceding proposition, including sentence-initial Mais comme.' },
  { form:'était', fallback:'srf_zola_etait_6fbc20a25532_etre:sns_etre_primary', groups:[
    ['srf_zola_etait_6fbc20a25532_etre:sns_fr_etre_passive_auxiliary','8:232 15:65'],
    ['srf_zola_etait_6fbc20a25532_etre:sns_fr_etre_presence','21:90'] ], rationale:'Était à démontrer and était remplie use passive forms; était de même nature links a subject to a property; était sur les lieux conveys presence.' },
  { form:'sur', fallback:'srf_sur:sns_sur_primary', groups:[], rationale:'Sur locates an action or person upon a figurative anthill, heap of mud or the scene of events.' },
  { form:'autres', fallback:'srf_zola_autres_autre:sns_zola_autre_adjective', groups:[['srf_fr_autres_pronoun:sns_fr_autres_others','28:192']], rationale:'Nous autres modifies nous as other people; des autres is a standalone pronoun meaning the others.' },
  { form:'après', fallback:'srf_zola_apres_e3ea6e68a59f_apres:sns_zola_apres_following', groups:[], rationale:'All three refer to a later event after another action, not calling after someone.' },
  { form:'être', fallback:'srf_etre:sns_etre_primary', groups:[['srf_etre:sns_fr_etre_passive_auxiliary','15:37']], rationale:'Être banni is passive, whereas un être pensant is an independent noun in context and n’être pas ridicule is a linking verb. The noun être lacks a matching published identity, so that occurrence is withheld.' },
  { form:'bon', fallback:'srf_bon:sns_bon_primary', groups:[], rationale:'Bon describes the quality of an observer, mind and favorable account; none belongs to bon plaisir or means useful.' },
  { form:'bien', fallback:'srf_zola_bien_bien:sns_fr_bien_well', groups:[['srf_zola_bien_bien:sns_fr_bien_intensifier','26:92']], rationale:'Bien tourné and bien vite express a manner or degree of action; fort bien intensifies the absence of ridiculousness.' }
];
const exclude = new Map([['être',new Set(['26:69'])]]);
const items = rules.map(rule => {
 const overrides=new Map(rule.groups.flatMap(([id, keys])=>keys.split(' ').map(key=>[key,id])));
 const tokens=coverage.tokens.filter(t=>t.form===rule.form);
 const seen=new Set();
 const occurrences=tokens.filter(t=>!exclude.get(rule.form)?.has(`${t.unit}:${t.start}`)).map(t=>{
  const key=`${t.unit}:${t.start}`; seen.add(key); const id=overrides.get(key)??rule.fallback;
  const candidate=t.candidates.find(c=>c.identity===id);
  if(!candidate || candidate.preparedBands.join(',')!=='levels_1_3,levels_4_5,levels_6_8') throw Error(`${rule.form} ${key}: candidate missing ${id}`);
  return {chapter:1,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,identity:id,gloss:candidate.gloss};
 });
 for(const key of overrides.keys()) if(!seen.has(key)) throw Error(`Stale override ${rule.form} ${key}`);
 return {form:rule.form,status:'chapter_uses_context_reviewed_reuse_pending_final_bundle_signoff',rationale:rule.rationale,occurrences};
});
const output={version:1,workId:coverage.workId,chapter:1,status:'offline_contextual_ambiguous_reuse_unpublished',coverageSha256:createHash('sha256').update(bytes).digest('hex'),note:'Seventeen grammar and sense families reviewed in the chapter context. One noun être occurrence remains unassigned for its missing noun identity; published question bands and mastery identities are retained.',items};
writeFileSync(resolve(folder,'chapter-01-ambiguous-03.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({forms:items.length,occurrences:items.reduce((n,x)=>n+x.occurrences.length,0)}));
