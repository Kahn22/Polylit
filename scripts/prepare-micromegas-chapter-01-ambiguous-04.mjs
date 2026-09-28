import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const folder=resolve('content/sources/wrk_voltaire_micromegas');
const bytes=readFileSync(resolve(folder,'chapter-01-coverage.json'));
const coverage=JSON.parse(bytes);
// Each entry specifies a source location, exact published surface+sense identity,
// and the contextual reason. Cases without a fitting published meaning stay open.
const decisions=[
 ['y','1:75','srf_y:sns_zola_y_existential','Il y avait means there was; y is existential, not a locative reference.'],
 ['pieds','3:172','srf_cendrillon_pieds_lem_parure_pied_noun_932ec5db4e_7988494874:sns_parure_pied_partie_du_corps_humain_situee_a_l_extremite_des_jambes_229cd337b6','De la tête aux pieds names literal body parts. Other chapter pieds uses are length measures, which need a separate historical-unit sense.'],
 ['enfin','14:0','srf_zola_enfin_enfin:sns_zola_enfin_finally','Enfin introduces the eventual condemnation after the preceding dispute; the later Car enfin is a discourse justification, held separately.'],
 ['au','3:41 4:79 9:207 11:36 17:179 20:205','srf_au:sns_au_primary','Every au contracts à and le: the public, au juste, the college, departure from childhood, au delà and the end of a telescope. Wider phrase meanings are reviewed separately.'],
 ['juste','4:82','srf_fr_juste_juste_adverb:sns_fr_juste_exactly','Au juste asks for an exact numerical result.'],
 ['faire','6:71','srf_faire:sns_fr_faire_perform_activity','Faire le tour performs the action of going around a territory; the whole phrase also awaits expression review.'],
 ['peine','7:122','srf_parure_peine_lem_parure_peine_noun_526c115751_397c1d86a7:sns_fr_peine_effort','Conviendront sans peine means agree without difficulty, not sadness or worry.'],
 ['beau','8:30 8:50 8:108 20:137','srf_beau:sns_beau_primary','The four beau adjectives modify the giant’s face, body and the described sky as beautiful or fine; none is avoir beau.'],
 ['dit','10:107 16:194','srf_dit:sns_dire_primary','What his sister says and comme l’on dit are both acts of saying.'],
 ['assez','10:146','srf_zola_assez_assez:sns_fr_assez_rather','Assez médiocre means rather mediocre, not enough mediocre.'],
 ['petits','11:88 28:231','srf_zola_petits_petit:sns_zola_petit_small','The insects and the poems are small or little; no low social rank is intended.'],
 ['ont','11:110 24:125','srf_zola_ont_avoir:sns_parure_avoir_etre_en_relation_possessive_soit_concrete_ou_abstraite_soit_permanente_ou_occasionnelle_dont_le_possesseur_est_le_sujet_et_le_possede_est_le_complement_d_objet_direct_787c8db8b0','Both subjects have a stated measurement or dimension; ont is possession, not a compound tense auxiliary.'],
 ['lui','11:236','srf_lui:sns_lui_primary','Lui receives the trouble caused by his book as an indirect object. The later lui is a stressed subject.'],
 ['lui','19:138','srf_lui:sns_lui_subject','Lui et les siens forms an emphatic subject together with his companions.'],
 ['trouva','12:58','srf_cendrillon_trouva_lem_zola_trouver_e1babdf88b:sns_parure_trouver_rencontrer_la_personne_ou_la_chose_que_l_on_cherche_26ab9fa323','The censor found suspect propositions in the book; he searched out their presence rather than using trouver as a judgment of a person.'],
 ['agissait','12:198','srf_zola_agissait_agir:sns_zola_s_agir_concern','Il s’agissait de savoir introduces what the dispute concerned.'],
 ['si','12:217','srf_si:sns_fr_si_whether','Savoir si introduces an indirect yes/no question.'],
 ['si','19:16','srf_fr_si_si_adverb:sns_fr_si_intensity','Si à propos que expresses degree and its result.'],
 ['même','12:272','srf_zola_meme_25c826df8191_meme_adjective:sns_zola_meme_same','De même nature compares the same kind or nature; it is the adjective, not even or likewise.'],
 ['mit','13:40','srf_mit:sns_mettre_primary','Il mit les femmes de son côté means he placed them on his side.'],
 ['mit','16:99','srf_mit:sns_fr_mettre_reflexive_begin','Il se mit à voyager means began traveling; this exact published identity preserves prior mastery.'],
 ['fit','14:16','srf_fit:sns_faire_causative','Fit condamner means caused the book to be condemned by others.'],
 ['ordre','14:103','srf_zola_ordre_ordre:sns_zola_ordre_command','Eut ordre de ne paraître conveys a prohibition or command, not a sequence.'],
 ['cour','14:129 15:54','srf_zola_cour_cour:sns_fr_cour_royal_entourage','Banishment from court and not appearing there concern a royal court, not a tribunal.'],
 ['fut','15:6','srf_fut:sns_etre_primary','Il ne fut que médiocrement affligé links the person to an emotional state.'],
 ['seront','17:57','srf_zola_seront_etre:sns_etre_primary','Seront étonnés predicts a state of astonishment, not an action performed by a named agent.'],
 ['doute','17:69','srf_zola_doute_doute_noun:sns_fr_sans_doute_probably','Sans doute functions as the existing probably/no doubt expression.'],
 ['toutes','18:75','srf_zola_toutes_tout:sns_tout_primary','Toutes determines les forces; it does not stand alone as a pronoun.'],
 ['vit','20:81','srf_vit_voir:sns_fr_voir_perceive','He never saw the empyrean sky through the stars; this is voir, not vivre.'],
 ['personne','21:162','srf_fr_personne_personne_pronoun:sns_fr_personne_nobody','Ne veux contredire personne means he does not wish to contradict anyone.'],
 ['fût','23:24','srf_zola_fut_9e9b85f25b02_etre:sns_etre_primary','Quelque accoutumé qu’il fût is a linking verb, subjunctive form.'],
 ['gros','24:55','srf_fr_gros_gros_adjective:sns_fr_gros_large_heavy','Plus gros que la terre compares physical size.'],
 ['peu','20:31 25:17','srf_peu:sns_peu_primary','Peu de temps and un peu express a small amount; the adjacent à peu près component remains reserved to its expression identity.'],
 ['vient','25:127','srf_vient:sns_venir_primary','Quand il vient en France describes travel to France, not the recent-past auxiliary.'],
 ['faisait','28:207','srf_zola_faisait_faire:sns_fr_faire_perform_activity','Faisait de petits vers describes his activity of making verse; not causative faire.'],
 ['eut','29:98','srf_zola_eut_avoir:sns_zola_avoir_possess_auxiliary','Eut un jour une conversation is to have a conversation; the order-of-banishment construction remains under review.'],
 ['jour','29:105','srf_zola_jour_jour:sns_zola_jour_day','Un jour locates the conversation on one day, not in public daylight.']
];
const reserved=new Set();
for (const name of ['chapter-01-reuse-01.json','chapter-01-reuse-02.json','chapter-01-reuse-03.json','chapter-01-reuse-04.json','chapter-01-reuse-05.json','chapter-01-reuse-06.json','chapter-01-reuse-07.json','chapter-01-ambiguous-01.json','chapter-01-ambiguous-02.json','chapter-01-ambiguous-03.json']) {
 const packet=JSON.parse(readFileSync(resolve(folder,name)));
 for(const item of packet.items) for(const o of item.occurrences) reserved.add(`${o.unit}:${o.start}`);
}
const items=decisions.map(([form,locations,id,rationale])=>{
 const occurrences=locations.split(' ').map(location=>{
  if(reserved.has(location)) throw Error(`Already assigned ${location}`);
  reserved.add(location);
  const t=coverage.tokens.find(x=>`${x.unit}:${x.start}`===location && x.form===form);
  const candidate=t?.candidates.find(c=>c.identity===id);
  if(!candidate || candidate.preparedBands.join(',')!=='levels_1_3,levels_4_5,levels_6_8') throw Error(`Invalid ${form} ${location}: ${id}`);
  return {chapter:1,unit:t.unit,start:t.start,end:t.end,text:t.text,context:t.context,identity:id,gloss:candidate.gloss};
 });
 return {form,identity:id,rationale,status:'chapter_context_reviewed_reuse_pending_final_bundle_signoff',occurrences};
});
const result={version:1,workId:coverage.workId,chapter:1,status:'offline_contextual_published_reuse_unpublished',coverageSha256:createHash('sha256').update(bytes).digest('hex'),note:'Per-location authored contextual published-identity decisions; other same-spelling uses are intentionally held if the sense does not fit. Existing question bands and mastery identities remain unchanged.',items};
writeFileSync(resolve(folder,'chapter-01-ambiguous-04.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({decisions:items.length,uses:items.reduce((n,x)=>n+x.occurrences.length,0)}));
