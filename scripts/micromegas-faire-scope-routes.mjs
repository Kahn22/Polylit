/** Exact offline source meanings; phrase components await the separate full-span review. */
export const faireForms=new Set(['faire','fait','faite','faits','faites','fais','faisons','font','faisait','faisoit','faisaient','faisoient','faisais','faisions','faisiez','faisant','fit','fis','firent','fîmes','fîtes','fera','ferai','feras','feray','ferons','ferez','feront','ferait','feraient','ferais','ferions','feriez','fasse','fasses','fassent','fassions','fassiez','fît','fissent']);
export const creation='sns_parure_faire_creer_produire_fabriquer_en_parlant_de_toute_uvre_materielle_a8e6f1d980',activity='sns_fr_faire_perform_activity',cause='sns_fr_faire_cause_clause',causative='sns_faire_causative',formation='sns_fr_faire_reflexive_form',constitution='planned_faire_generic_constitute_form_total';
export function faireRoute(u,t){
 if(u===37)return 'sns_zola_fait_event';
 if(u===131)return 'prior_full_expression:sur_le_fait';
 if(u===156&&t.start===47)return 'deferred_full_expression:mettre_au_fait';
 if(u===136&&t.start<190)return 'deferred_full_expression:faire_l_amour';
 if(u===6||(u===87&&t.start===51))return 'prior_full_expression:faire_le_tour';
 if(u===124)return 'prior_full_expression:avoir_beau_faire';
 if(u===30)return 'deferred_full_expression:avoir_a_faire_de_relevance';
 if(u===44||(u===122&&t.start!==97))return 'deferred_full_expression:faire_figure';
 if(u===80)return 'deferred_full_expression:faire_pitie';
 if(u===172)return 'deferred_full_expression:faire_du_mal';
 if([3,7].includes(u))return constitution;
 if([16,28,43,72,98,138,154,210,214].includes(u))return creation;
 if(u===11||u===97)return cause;
 if(u===123&&t.start===146)return formation;
 if([14,91,94,109,121,133,136,150,176,183].includes(u)||(u===123&&t.start===272))return causative;
 if(u===65)return 'sns_faire_done';
 return activity;
}
