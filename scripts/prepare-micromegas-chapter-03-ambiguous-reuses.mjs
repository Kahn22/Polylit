import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
const root=resolve('content/sources/wrk_voltaire_micromegas'),coverage=JSON.parse(readFileSync(resolve(root,'chapter-03-coverage.json'))),published=loadPublication();
const sha=b=>createHash('sha256').update(b).digest('hex');
// A published ID is selected by its complete surface:sense pair, not by the
// first spelling hit. Exceptions are exact unit:start source decisions.
const rules=[
 ['étaient','srf_zola_etaient_cdec19ace9e4_etre:sns_etre_primary',{},'Ready describes their state; étions is a linking verb, not a compound auxiliary.'],
 ['à','srf_a:sns_a_primary',{},'The nine remaining à uses introduce an infinitive, recipient, endpoint or manner; à peine is held for the prior expression identity.'],
 ['s’','srf_s_elided:sns_se_primary',{},'S’ is reflexive in s’embarquer, s’être pâmée and s’élancèrent, not the conditional si.'],
 ['l’','srf_l_elided:sns_le_primary',{'66:14':'srf_l_elided:sns_le_object','67:111':'srf_l_elided:sns_le_object','75:74':'srf_l_elided:sns_le_object'},'Articles precede atmosphère, anneau and archevêque; direct-object pronouns refer to the woman, the ring and the existence.'],
 ['de','srf_de:sns_de_primary',{},'Ordinary origin, possession, comparison and relationship uses; none asserts the unrelated published de même or de quoi expressions.'],
 ['une','srf_une:sns_un_primary',{},'Each une introduces a singular feminine noun, including an aurore and an année.'],
 ['fort','srf_cigale_fourmi_fort_lem_cigale_fourmi_fort_adverb_9eb1afa20e_9c17580472:sns_fr_fort_intensifier',{},'Fort is an adverb of intensity with jolie, bien deviné and beaux, not a strong person.'],
 ['d’','srf_d_elided:sns_de_primary',{'67:53':'srf_fr_d_abord_d_elided:sns_fr_d_abord'},'D’instruments, d’un, d’amour and d’environ retain ordinary de; d’abord reuses its published first/at first locution.'],
 ['la','srf_la:sns_le_primary',{},'All thirteen remaining la tokens introduce feminine nouns; no direct object is present.'],
 ['du','srf_du:sns_du_primary',{},'Du Saturnien, du pays and du soleil are of/from the, not a family name particle or partitive some.'],
 ['en','srf_fr_en_en_pronoun:sns_fr_en_pronominal_reference',{'61:203':'srf_en:sns_en_in','67:203':'srf_zola_en_en:sns_fr_en_repeated_progression','74:0':'srf_fr_en_en_preposition:sns_fr_en_gerund'},'En eut, j’en ai lu and m’en rapporte are pronoun references; en larmes denotes a state, de lune en lune progression and en sortant a gerund.'],
 ['des','srf_fr_des_des_article:sns_fr_des_indefinite_plural',{},'News, charms and people are indefinite plurals, not of the.'],
 ['faire','srf_faire:sns_fr_faire_perform_activity',{},'Faire ses remontrances carries out a reproach, rather than causing another person to act.'],
 ['était','srf_zola_etait_6fbc20a25532_etre:sns_etre_primary',{},'Was attributes the woman, the philosopher and the Earth to states or identities.'],
 ['n’','srf_n_elided:sns_ne_primary',{'62:35':'srf_n_elided:sns_fr_ne_que_only','63:235':'srf_n_elided:sns_fr_ne_que_only'},'N’avait que and n’es qu’un express restriction; n’as jamais, n’aimerai, n’oublierai and n’y pas negate.'],
 ['que','srf_que:sns_que_conjunction',{'62:43':'srf_que:sns_que_restrictive','63:351':'srf_que:sns_que_interrogative','64:35':'srf_que:sns_que_comparative','74:169':'srf_que:sns_que_comparative'},'Only six hundred toises, an interrogative What, two comparisons and two clause links require distinct published senses.'],
 ['mais','srf_mais:sns_mais_primary',{},'Each mais contrasts a preceding thought with a new one.'],
 ['par','srf_par:sns_par_primary',{},'Par introduces compensation by charms or reasoning by analogy.'],
 ['bien','srf_zola_bien_bien:sns_fr_bien_intensifier',{'67:120':'srf_zola_bien_bien:sns_fr_bien_well','75:8':'srf_zola_bien_bien:sns_zola_bien_well'},'Bien des agréments means many; bien deviné indicates quality and je sais bien marks assured knowledge.'],
 ['après','srf_zola_apres_e3ea6e68a59f_apres:sns_zola_apres_following',{},'Both après clauses place the action later, not a calling-after construction.'],
 ['avoir','srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary',{},'T’avoir résisté uses the compound-tense auxiliary with resisted.'],
 ['un','srf_un:sns_un_primary',{},'Each un is the indefinite masculine singular article, including un curieux and un long article.'],
 ['autre','srf_autre:sns_autre_adjective',{},'D’un autre monde modifies a noun, not a standalone the other.'],
 ['monde','srf_zola_monde_monde:sns_zola_monde_world_public',{},'Another world is a planetary world, not tout le monde or a mere emphatic adverb.'],
 ['va','srf_va:sns_aller_primary',{},'Va is the imperative go addressed to the Saturnian, sharing the published movement sense.'],
 ['qu’','srf_qu_elided:sns_que_conjunction',{'63:240':'srf_fr_qu__que_adverb:sns_fr_que_restriction','66:60':'srf_qu_elided:sns_que_comparative','67:75':'srf_fr_qu__que_pronoun:sns_fr_que_relative_pronoun','71:148':'srf_fr_qu__que_pronoun:sns_fr_que_relative_pronoun','72:62':'srf_fr_qu__que_pronoun:sns_fr_que_relative_pronoun'},'Qu’un curieux restricts; tout philosophe qu’il était concedes the status; qu’ils trouvèrent, qu’on ne saurait and qu’on fera refer back to nouns; si petit qu’ils links a consequence.'],
 ['as','srf_fr_as_avoir_verb:sns_fr_avoir_compound_auxiliary',{},'Tu n’as jamais eu uses have to form the past tense, not possession on its own.'],
 ['si','srf_fr_si_si_adverb:sns_fr_si_intensifier',{'63:283':'srf_si:sns_si_primary'},'The first si introduces an if condition; the other three intensify great hope, distance and small size.'],
 ['serais','srf_parure_serais_lem_etre_64c7f0ec2e:sns_parure_etre_definir_un_etat_une_caracteristique_du_sujet_151b22dfa3',{},'Tu serais fidèle predicates an imagined quality; no compound tense is formed.'],
 ['vas','srf_parure_vas_lem_aller_eb07407384:sns_parure_aller_se_deplacer_jusqu_a_un_endroit_3680154133',{},'Où vas-tu courir asks about movement and destination, not the near-future auxiliary.'],
 ['est','srf_est:sns_etre_primary',{},'The ring, completed action, Mars size and Mars distance each take linking être.'],
 ['fait','srf_fait:sns_faire_done',{'69:17':'srf_fait:sns_fr_faire_perform_activity'},'Voilà qui est fait is an accomplished action; eurent fait a distance records a performed journey.'],
 ['plus','srf_plus:sns_plus_primary',{'74:157':'srf_plus:sns_fr_plus_greater_degree'},'Ne ... jamais plus means no longer; five times plus petite compares degrees.'],
 ['personne','srf_fr_personne_personne_pronoun:sns_fr_personne_nobody',{},'With n’aimerai jamais, personne means no one, not an ordinary person noun.'],
 ['le','srf_le:sns_le_primary',{},'All six remaining le tokens are definite articles, including le père Castel and le bord.'],
 ['tout','srf_fr_tout_tout_adverb:sns_fr_tout_intensifying',{},'Tout philosophe qu’il était strengthens the concession; tout auprès intensifies nearness.'],
 ['il','srf_il:sns_il_primary',{'76:39':'srf_il:sns_fr_il_impersonal'},'The Saturnian is he; il serait difficile has an impersonal it.'],
 ['être','srf_etre:sns_fr_etre_compound_auxiliary',{},'S’être pâmée forms a compound tense with être as auxiliary.'],
 ['sur','srf_sur:sns_sur_primary',{},'Each sur locates a leap, the comet tail or landing on a shore.'],
 ['assez','srf_zola_assez_assez:sns_fr_assez_rather',{'71:165':'srf_zola_assez_assez:sns_zola_assez_enough'},'Assez plat and assez plaisamment mean rather; ne saurait assez louer is cannot praise enough.'],
 ['les','srf_les:sns_le_primary',{},'Both occurrences determine plural satellites or inquisitors.'],
 ['même','srf_zola_meme_25c826df8191_meme_adjective:sns_zola_meme_itself',{'75:43':'srf_zola_meme_25c826df8191_meme_adverb:sns_zola_meme_even'},'Dans Jupiter même emphasizes the planet itself; et même adds even.'],
 ['y','srf_y:sns_fr_y_pronominal_reference',{},'They stay there in Jupiter, and later fear finding nothing there on the small planet.'],
 ['sous','srf_zola_sous_sous:sns_zola_sous_primary',{},'Sous presse literally places the manuscript under the printing process, not a small coin.'],
 ['ont','srf_zola_ont_avoir:sns_fr_avoir_compound_auxiliary',{},'Both ont trouvé and ont échappé form compound past tenses.'],
 ['ne','srf_ne:sns_ne_primary',{},'Ne saurait and ne trouvèrent rien are ordinary negations.'],
 ['aussi','srf_zola_aussi_aussi:sns_zola_aussi_therefore',{},'Aussi je lui promets draws a consequence; it is not also/too.'],
 ['lui','srf_lui:sns_lui_primary',{},'Lui promets names the indirect recipient of the narrator’s promise.'],
 ['pas','srf_pas:sns_pas_primary',{},'N’oublierai pas and n’y pas trouver are negative, never distance units.'],
 ['leur','srf_fr_leur_leur_determiner:sns_fr_leur_possessive',{},'Leur père and leur chemin are possessive their, not to them.'],
 ['existence','srf_zola_existence_existence:sns_zola_existence_fact',{},'The moons’ existence is the fact that they exist, not the lifetime of a person.'],
 ['serait','srf_serait:sns_etre_primary',{},'Il serait difficile predicates a difficult situation, not a passive construction.'],
 ['trouver','srf_parure_trouver_lem_zola_trouver_75d0160413:sns_parure_trouver_rencontrer_la_personne_ou_la_chose_que_l_on_cherche_26ab9fa323',{},'They fear not finding lodging; the published find meaning covers discovering what one seeks.'],
];
const byForm=Map.groupBy(coverage.tokens.filter(t=>t.disposition==='multiple_published_candidates_context_pending'),t=>t.form);
if(rules.length!==new Set(rules.map(r=>r[0])).size)throw Error('Duplicate ambiguous rule');
const missing=[...byForm.keys()].filter(form=>!rules.some(r=>r[0]===form));
const surplus=rules.filter(rule=>!byForm.has(rule[0])).map(rule=>rule[0]);
if(missing.length||surplus.length)throw Error(`Unadjudicated ${missing}; stale ${surplus}`);
const items=rules.map(([form,fallback,exceptions,rationale])=>{
 const matched=new Set();
 const occurrences=byForm.get(form).map(token=>{
  const key=`${token.unit}:${token.start}`,prefix=exceptions[key]??fallback;
  const candidates=token.candidates.filter(c=>c.identity===prefix&&c.preparedBands.join(',')==='levels_1_3,levels_4_5,levels_6_8');
  if(candidates.length!==1)throw Error(`Missing published choice ${form} ${key} ${prefix}`);
  if(exceptions[key])matched.add(key);
  const [surface,sense]=prefix.split(':');
  const questions=[...published.preparedQuizzes.values()].filter(q=>q.subject?.kind==='vocabulary'&&q.subject.surfaceFormId===surface&&q.subject.senseId===sense).sort((a,b)=>a.band.localeCompare(b.band));
  if(questions.length!==3)throw Error(`Changed published question set ${form} ${key}`);
  return {chapter:3,unit:token.unit,start:token.start,end:token.end,text:token.text,context:token.context,identity:prefix,gloss:candidates[0].gloss,publishedQuestionSha256:sha(JSON.stringify(questions))};
 });
 if(Object.keys(exceptions).some(key=>!matched.has(key)))throw Error(`Obsolete offset ${form}`);
 return {form,rationale,status:'source_context_and_published_bands_checked_offline',occurrences};
});
writeFileSync(resolve(root,'chapter-03-ambiguous-01.json'),JSON.stringify({version:1,workId:coverage.workId,chapter:3,status:'offline_contextual_ambiguous_reuse_review_unpublished',sourceSha256:coverage.sourceSha256,unitPlanSha256:coverage.unitPlanSha256,items},null,2)+'\n');
console.log(JSON.stringify({families:items.length,uses:items.reduce((n,i)=>n+i.occurrences.length,0)}));
