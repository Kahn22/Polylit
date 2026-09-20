import type { ContentBundle } from "../../domain/model.js";
import type { ReviewDecision, TokenCandidate } from "../../ingestion/model.js";
import { onePronounCandidateIds } from "./zola-one-pronoun.js";

/**
 * Explicitly reviewed proper names in J’Accuse. This is editorial data, not a
 * capitalization heuristic: titles such as Monsieur and Président are absent
 * deliberately and remain learner vocabulary.
 */
const properNameForms = new Set([
  "belhomme", "billot", "boisdeffre", "clam", "couard", "dreyfus",
  "eclair", "echo", "esterhazy", "europe", "forzinetti", "france",
  "gobert", "gonse", "mathieu", "mercier", "morès", "notre-dame",
  "paris", "paty", "pellieux", "picquart", "ravary", "sandherr",
  "scheurer-kestner", "tunisie", "varinard", "zola", "émile",
]);

const contextualProperNames = new Set([
  "constitution", "diable", "dieu", "etat", "exposition", "sénat",
]);

/**
 * Existing identities whose sense is unchanged in every J’Accuse occurrence.
 * Forms with genuine contextual alternatives (for example si, plus, tout,
 * or sur) are intentionally absent and require occurrence-level review.
 * For the reviewed l’, la, le, and les forms, the definite-article sense is
 * the default, while object-pronoun occurrences are listed explicitly below.
 */
const reviewedReusableIdentities: Record<string, { surfaceFormId: string; senseId: string }> = {
  "à": { surfaceFormId: "srf_a", senseId: "sns_a_primary" },
  ainsi: { surfaceFormId: "srf_ainsi", senseId: "sns_ainsi_primary" },
  aller: { surfaceFormId: "srf_aller", senseId: "sns_aller_primary" },
  au: { surfaceFormId: "srf_au", senseId: "sns_au_primary" },
  aux: { surfaceFormId: "srf_aux", senseId: "sns_aux_primary" },
  avait: { surfaceFormId: "srf_avait", senseId: "sns_avoir_primary" },
  avec: { surfaceFormId: "srf_avec", senseId: "sns_avec_primary" },
  but: { surfaceFormId: "srf_but", senseId: "sns_but_primary" },
  "celle-ci": { surfaceFormId: "srf_celle_ci", senseId: "sns_celui_primary" },
  celui: { surfaceFormId: "srf_celui", senseId: "sns_celui_primary" },
  ces: { surfaceFormId: "srf_ces", senseId: "sns_ce_primary" },
  cette: { surfaceFormId: "srf_cette", senseId: "sns_ce_primary" },
  ceux: { surfaceFormId: "srf_ceux", senseId: "sns_celui_primary" },
  chose: { surfaceFormId: "srf_chose", senseId: "sns_chose_primary" },
  comme: { surfaceFormId: "srf_comme", senseId: "sns_comme_primary" },
  "d’": { surfaceFormId: "srf_d_elided", senseId: "sns_de_primary" },
  de: { surfaceFormId: "srf_de", senseId: "sns_de_primary" },
  dis: { surfaceFormId: "srf_dis", senseId: "sns_dire_primary" },
  dit: { surfaceFormId: "srf_dit", senseId: "sns_dire_primary" },
  deux: { surfaceFormId: "srf_deux", senseId: "sns_deux_primary" },
  du: { surfaceFormId: "srf_du", senseId: "sns_du_primary" },
  elle: { surfaceFormId: "srf_elle", senseId: "sns_elle_primary" },
  encore: { surfaceFormId: "srf_encore", senseId: "sns_encore_primary" },
  et: { surfaceFormId: "srf_et", senseId: "sns_et_primary" },
  entends: { surfaceFormId: "srf_entends", senseId: "sns_entendre_mean" },
  est: { surfaceFormId: "srf_est", senseId: "sns_etre_primary" },
  "êtes": { surfaceFormId: "srf_etes", senseId: "sns_etre_primary" },
  "être": { surfaceFormId: "srf_etre", senseId: "sns_etre_primary" },
  faut: { surfaceFormId: "srf_faut", senseId: "sns_falloir_primary" },
  fin: { surfaceFormId: "srf_fin", senseId: "sns_fin_primary" },
  fut: { surfaceFormId: "srf_fut", senseId: "sns_etre_primary" },
  gloire: { surfaceFormId: "srf_gloire", senseId: "sns_gloire_primary" },
  honneur: { surfaceFormId: "srf_honneur", senseId: "sns_honneur_primary" },
  il: { surfaceFormId: "srf_il", senseId: "sns_il_primary" },
  "j’": { surfaceFormId: "srf_j_elided", senseId: "sns_je_primary" },
  je: { surfaceFormId: "srf_je", senseId: "sns_je_primary" },
  "l’": { surfaceFormId: "srf_l_elided", senseId: "sns_le_primary" },
  la: { surfaceFormId: "srf_la", senseId: "sns_le_primary" },
  le: { surfaceFormId: "srf_le", senseId: "sns_le_primary" },
  les: { surfaceFormId: "srf_les", senseId: "sns_le_primary" },
  lorsque: { surfaceFormId: "srf_lorsque", senseId: "sns_lorsque_primary" },
  lui: { surfaceFormId: "srf_lui", senseId: "sns_lui_primary" },
  leur: { surfaceFormId: "srf_leur", senseId: "sns_leur_primary" },
  langage: { surfaceFormId: "srf_langage", senseId: "sns_langage_primary" },
  ma: { surfaceFormId: "srf_ma", senseId: "sns_mon_primary" },
  me: { surfaceFormId: "srf_me", senseId: "sns_me_primary" },
  moi: { surfaceFormId: "srf_moi", senseId: "sns_moi_primary" },
  mon: { surfaceFormId: "srf_mon", senseId: "sns_mon_primary" },
  monsieur: { surfaceFormId: "srf_monsieur", senseId: "sns_monsieur_primary" },
  "maître": { surfaceFormId: "srf_maitre", senseId: "sns_maitre_primary" },
  montrer: { surfaceFormId: "srf_montrer", senseId: "sns_montrer_primary" },
  "n’": { surfaceFormId: "srf_n_elided", senseId: "sns_ne_primary" },
  ne: { surfaceFormId: "srf_ne", senseId: "sns_ne_primary" },
  ni: { surfaceFormId: "srf_ni", senseId: "sns_ni_primary" },
  non: { surfaceFormId: "srf_non", senseId: "sns_non_primary" },
  notre: { surfaceFormId: "srf_notre", senseId: "sns_notre_primary" },
  on: { surfaceFormId: "srf_on", senseId: "sns_on_primary" },
  ou: { surfaceFormId: "srf_ou", senseId: "sns_ou_primary" },
  où: { surfaceFormId: "srf_ou_accent", senseId: "sns_ou_interrogative" },
  par: { surfaceFormId: "srf_par", senseId: "sns_par_primary" },
  pas: { surfaceFormId: "srf_pas", senseId: "sns_pas_primary" },
  si: { surfaceFormId: "srf_si", senseId: "sns_si_primary" },
  presque: { surfaceFormId: "srf_presque", senseId: "sns_presque_primary" },
  partir: { surfaceFormId: "srf_partir", senseId: "sns_partir_primary" },
  peu: { surfaceFormId: "srf_peu", senseId: "sns_peu_primary" },
  "première": { surfaceFormId: "srf_premiere", senseId: "sns_premier_primary" },
  prendrait: { surfaceFormId: "srf_prendrait", senseId: "sns_prendre_primary" },
  "près": { surfaceFormId: "srf_pres", senseId: "sns_pres_primary" },
  "prêt": { surfaceFormId: "srf_pret", senseId: "sns_pret_primary" },
  pour: { surfaceFormId: "srf_pour", senseId: "sns_pour_primary" },
  quand: { surfaceFormId: "srf_quand", senseId: "sns_quand_primary" },
  que: { surfaceFormId: "srf_que", senseId: "sns_que_conjunction" },
  "qu’": { surfaceFormId: "srf_qu_elided", senseId: "sns_que_conjunction" },
  quoi: { surfaceFormId: "srf_quoi", senseId: "sns_quoi_primary" },
  qui: { surfaceFormId: "srf_qui", senseId: "sns_qui_primary" },
  rien: { surfaceFormId: "srf_rien", senseId: "sns_rien_primary" },
  sage: { surfaceFormId: "srf_sage", senseId: "sns_sage_primary" },
  "s’": { surfaceFormId: "srf_s_elided", senseId: "sns_se_primary" },
  sa: { surfaceFormId: "srf_sa", senseId: "sns_son_primary" },
  sans: { surfaceFormId: "srf_sans", senseId: "sns_sans_primary" },
  se: { surfaceFormId: "srf_se", senseId: "sns_se_primary" },
  savoir: { surfaceFormId: "srf_savoir", senseId: "sns_savoir_primary" },
  sent: { surfaceFormId: "srf_sent", senseId: "sns_sentir_primary" },
  son: { surfaceFormId: "srf_son", senseId: "sns_son_primary" },
  sur: { surfaceFormId: "srf_sur", senseId: "sns_sur_primary" },
  va: { surfaceFormId: "srf_va", senseId: "sns_aller_primary" },
  vient: { surfaceFormId: "srf_vient", senseId: "sns_venir_primary" },
  sont: { surfaceFormId: "srf_sont", senseId: "sns_etre_primary" },
  serait: { surfaceFormId: "srf_serait", senseId: "sns_etre_primary" },
  tard: { surfaceFormId: "srf_tard", senseId: "sns_tard_primary" },
  temps: { surfaceFormId: "srf_temps", senseId: "sns_temps_primary" },
  tint: { surfaceFormId: "srf_tint", senseId: "sns_tenir_speak" },
  tomber: { surfaceFormId: "srf_tomber", senseId: "sns_tomber_primary" },
  tout: { surfaceFormId: "srf_tout", senseId: "sns_tout_primary" },
  tous: { surfaceFormId: "srf_tous", senseId: "sns_tout_primary" },
  toute: { surfaceFormId: "srf_toute", senseId: "sns_tout_primary" },
  un: { surfaceFormId: "srf_un", senseId: "sns_un_primary" },
  une: { surfaceFormId: "srf_une", senseId: "sns_un_primary" },
  votre: { surfaceFormId: "srf_votre", senseId: "sns_votre_primary" },
  vous: { surfaceFormId: "srf_vous", senseId: "sns_vous_primary" },
};

const reviewedContextualReuse: Record<string, { surfaceFormId: string; senseId: string }> = {
  // The reflexive/passive constructions retain the lexical reflexive clitic;
  // grammatical voice alone does not create another vocabulary sense.
  ...Object.fromEntries([
    "tok_1559ae0e2ce4afdcd83a2f5d", "tok_25ef3a14362ffe75ac91e9b2",
    "tok_d4e88a783f925ed04d8c26fb", "tok_c7c354346c6d5296cf1836e8",
    "tok_8b86d8c3754342883d0f8bc8", "tok_eba269d1b72705dcac428170",
    "tok_fe658df25dd454a0f28103bc", "tok_31305e22639a713b667c11b3",
    "tok_f3d4ed4817f478355e2b18af", "tok_db3a388a6c659d01be628f70",
    "tok_e644742f5c27eb91bd8df464",
  ].map((id) => [id, { surfaceFormId: "srf_se", senseId: "sns_se_primary" }])),
  // In the conditional consequence and the question frame, que still joins
  // clauses; these constructions do not change its lexical conjunction sense.
  tok_966948c4bf04a660fbea341d: { surfaceFormId: "srf_qu_elided", senseId: "sns_que_conjunction" },
  tok_4b858968188d448eadcf1a2a: { surfaceFormId: "srf_que", senseId: "sns_que_conjunction" },
  tok_85aa85e9f7ee3d41cb268450: { surfaceFormId: "srf_lui", senseId: "sns_lui_subject" },
  tok_49b5d6ffd75bc3739e6ac451: { surfaceFormId: "srf_lui", senseId: "sns_lui_subject" },
  tok_6d408172a59edef51d2dfe8a: { surfaceFormId: "srf_lui", senseId: "sns_lui_subject" },
  tok_b48bc24befa037f849b0a7a3: { surfaceFormId: "srf_lui", senseId: "sns_lui_subject" },
  tok_57431c8ee52abd4a92c03807: { surfaceFormId: "srf_lui", senseId: "sns_lui_subject" },
  // Each exception was checked against its source sentence. Default que/qu’
  // is subordinating; relative, restrictive, comparative and exclamative
  // uses must not accidentally inherit that vocabulary identity.
  ...Object.fromEntries([
    "tok_26f76bfbe2b73846c07ffeb4", "tok_85a632edbb94c1e52ea83d7e",
    "tok_93b7c0dcb3ec23e8156ed6a2", "tok_475aa70fa763c3b72611b3ca",
    "tok_40d7116e8b01fcabef235dea", "tok_dd4e54553769de1e66fcb045",
    "tok_dee76cee1c3b02fba4d68d50", "tok_840bae63c2af204a3d870871",
    "tok_c74a568d73f76929ada86293", "tok_ae5bcfabc81a096ffea32757",
    "tok_e6d002f9d471c990845635bc",
  ].map((id) => [id, { surfaceFormId: "srf_que", senseId: "sns_que_relative" }])),
  ...Object.fromEntries([
    "tok_48263aaf19ffb009cf102573", "tok_b2d52718844cf9d779f07ac5",
    "tok_92de55e71d29308ae0281d2a", "tok_3945dd584868ade6679c0e99",
    "tok_2476fac7f6f6749b128be0d1", "tok_7cb8ed846ae3ab05f79519f3",
    "tok_e677a081e099657526a710bc", "tok_8e5bdfafa21c1b84f2ba7181",
    "tok_2c075bdaf750c9b13011cc32", "tok_08a6197f9f26ce2359ee1ff3",
    "tok_75ef6402e5d1a716592b2a70", "tok_b7e6a61b0362da02669b5d41",
    "tok_0b5389bc8f1892cfced5f901", "tok_69f55411d4dffd76aa8d368b",
  ].map((id) => [id, { surfaceFormId: "srf_que", senseId: "sns_que_restrictive" }])),
  tok_f10fd88de5d9c6f4306027ba: { surfaceFormId: "srf_que", senseId: "sns_que_comparative" },
  tok_5df811444e163ec0e3925c60: { surfaceFormId: "srf_que", senseId: "sns_que_exclamative" },
  tok_d383ea434e43455f65f0d5e8: { surfaceFormId: "srf_que", senseId: "sns_que_exclamative" },
  ...Object.fromEntries([
    "tok_a63866a196adcb3b64903a20", "tok_e6a6a9b2a062ca1cf0fc3d82",
    "tok_b8346005b9cf5593f132086c", "tok_41c3fbee606acfe90028a8e7",
    "tok_17103d6e3a481f28a91eb927", "tok_c932fea538efd854e3a0b62e",
    "tok_3fa7c38fc291dece0df958fa", "tok_072c1252cb05f0f183aef73e",
    "tok_fd79a18e462d4548b7f174e9", "tok_86134e8347d615ff804da55a",
    "tok_ea6ac20567f32c51845edaa0", "tok_6abdb3d3d81b93dd05ebb352",
    "tok_9d7487f6e0aa6a775c8d5936", "tok_d7ffd0a72819cd4e6eac9f17",
    "tok_2f05cf9efbe0978d73d2502a", "tok_274951cdbcacd57b8be34231",
    "tok_fcdb4f079302f2ed3473f183",
  ].map((id) => [id, { surfaceFormId: "srf_qu_elided", senseId: "sns_que_relative" }])),
  ...Object.fromEntries([
    "tok_86fa4238c02801cc4184d61c", "tok_865124647f78b4dcd5622d65",
    "tok_c99d02baddbfd6a35314e751", "tok_4bc1cdd6ddd63a81693ef0e5",
    "tok_21a23747575458dfe12d43e6",
  ].map((id) => [id, { surfaceFormId: "srf_qu_elided", senseId: "sns_que_restrictive" }])),
  tok_0ba69783779ff0ef4d3096c2: { surfaceFormId: "srf_qu_elided", senseId: "sns_que_comparative" },
  tok_03d49d6f4480401c62b51124: { surfaceFormId: "srf_autre", senseId: "sns_autre_pronoun" },
  tok_5ab11185901e29c92e5fcded: { surfaceFormId: "srf_autre", senseId: "sns_autre_adjective" },
  tok_e264cff6eb4cf7e920aa157c: { surfaceFormId: "srf_autre", senseId: "sns_autre_pronoun" },
  tok_9f304c31fdeaddea24c74717: { surfaceFormId: "srf_autre", senseId: "sns_autre_pronoun" },
  // Most l’ occurrences are the elided definite article. These reviewed
  // object-pronoun occurrences keep the same global surface identity while
  // selecting the distinct le-object sense.
  tok_d74918ad15380aea901fb78d: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_b9525e6a1f37a7b8967198a5: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_25f39400454bcc6a62b11987: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_e65dc1088fd63fbfab57ed5d: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_895dcf21624aae2349c8a327: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_e378c71211bbce14a080fa5f: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_4dd433b028974aa5e3c240d1: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_fe5708083db30dce997367f1: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_afe576c543c66975fb2e8544: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_c2dacffe589660670597cf1a: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_166650a6984b3e16b963cad9: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_567d30175e1445366998ac27: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_1ba1d7173bfc53e21fa69aaa: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_0f1ababb05ba9b9c44c7e52f: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  tok_909bc266beb9f02c701f4182: { surfaceFormId: "srf_l_elided", senseId: "sns_le_object" },
  // La refers back to a feminine singular object in these thirteen contexts.
  tok_5bc2446cedcb573c3fd7b351: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_4b52505f6dd130c6da3eeada: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_e61486e47e999241d697ec3e: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_cff8c7ba34980c707b97729a: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_fb2acc2badd4006efd1f1630: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_abdee40cfa7315249bdb1e42: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_fd2944c8f17426403127081b: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_b99de7a3689d42e9c672ea80: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_44fd9382e16af92dc238ab09: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_e9522cebcfb291ce54adf602: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_c86a79ef6d2fb5a383a52cc8: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_90351dba1895bd243513cbc7: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  tok_ad4a0f2b16c59d549e44537d: { surfaceFormId: "srf_la", senseId: "sns_le_object" },
  // The masculine singular direct object refers to a previously mentioned
  // person, act, or object, not the following noun.
  tok_80093ff9e9f731ad9b168858: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_83fe9d3bb2e4dc2787014a98: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_bb4e14d4a5be0b579c824c30: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_f6cf9034ed776d3923997f72: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_c023acc8336842510d6902af: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_b07e68ac58bef60072dad2ce: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_50d9aff57cfdd3624291bb6c: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_df7f4f48ed6ba77ff1ec7d17: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_8f3728b9c00d8c340771a974: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_42a2876bbbd412774e1d0575: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_6f56d7db1eac68881019d6dd: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_c850b2bfc22c75ac88148853: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  tok_5d169a1a8a8a2fe6cc907056: { surfaceFormId: "srf_le", senseId: "sns_le_object" },
  // Les is a plural direct-object pronoun in these thirteen contexts.
  tok_a6e62bbdb6d595f0a73f7892: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_81fee3e5c48051b1e090a634: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_794eaab139ba497997da1c03: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_b495890393d3dd4609d099ec: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_cc832b2d16d8deb9bef1f7f8: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_2e52ba069fc1a5ba0c8fb8d9: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_c99a4b4b5f5b7f5048f52d6c: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_91ab9b6636e90aa6ec687903: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_3f526f68881042956feec0a2: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_d1175894be6dc04c9f5272c4: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_4788716f9a71f6782ecca095: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_50643711ce631a964e2047a3: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  tok_fa462eeb994498d2f5982658: { surfaceFormId: "srf_les", senseId: "sns_le_object" },
  // Existing faire/fait identities are reused occurrence by occurrence so
  // causative, completed-action, and primary meanings never share mastery.
  tok_507f5ea49191bc337a152588: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_0afa9ff19ceb6acf36892f23: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_d30a5035c808de69f7405f62: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_fc3bd442891d2135effe944c: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_875048880396ff33206baae0: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_63afaeba3ac6688d1b8987b5: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_ca08fd3ae0c5ddf1805feca5: { surfaceFormId: "srf_faire", senseId: "sns_faire_causative" },
  tok_4768f508f1a6da16d88c8ed9: { surfaceFormId: "srf_faire", senseId: "sns_faire_primary" },
  tok_9bec572e91ddb8bb7e227081: { surfaceFormId: "srf_faire", senseId: "sns_faire_primary" },
  tok_95f60b85022cf4c1bed74ec4: { surfaceFormId: "srf_faire", senseId: "sns_faire_primary" },
  tok_6e7f9cafff0c2e03ccd21d37: { surfaceFormId: "srf_faire", senseId: "sns_faire_primary" },
  tok_cbe06fc86be9c52f4c840e52: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_1ec48403d72a02e00feaf184: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_14cd831613bc225e256f3595: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_25742825f396721f9d3a73a9: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_7f96acf382926af157028c05: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_9279750856dca76b0b83e1d2: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_3d8a7dffa6566b8ea674778d: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_8f6da884ff29b691381413a7: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_f24df51fcf937c26ec589338: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_2a7215966bda78133d36dd67: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_20d3a0c831915dd422c04359: { surfaceFormId: "srf_fait", senseId: "sns_faire_done" },
  tok_fdcc147e66fb911edfb101a6: { surfaceFormId: "srf_fait", senseId: "sns_faire_causative" },
  tok_dcb296ca1912f8b6b4468c5a: { surfaceFormId: "srf_fait", senseId: "sns_faire_causative" },
  tok_442e4bfe61fb470c9da8f55c: { surfaceFormId: "srf_fait", senseId: "sns_faire_causative" },
  tok_4b7f8ddb948d18c038da6bcb: { surfaceFormId: "srf_fait", senseId: "sns_faire_primary" },
  tok_dfa5758907d9d4c20cd851f9: { surfaceFormId: "srf_fait", senseId: "sns_faire_primary" },
};

// These are not the same sense as the existing interrogative "what",
// comparative "than", or conjunction "that"; review them separately.
const pendingQueConstructions = new Set([
  "tok_4b858968188d448eadcf1a2a", // est-ce que: yes/no question marker
  "tok_2835f572e75beb77c29724ba", // ainsi que: "as"
  "tok_966948c4bf04a660fbea341d", // hypothetical "even if ... then"
]);

const pendingToutConstructions = new Set([
  "tok_33c7470ecba92c7e64bfbb44", // tout au plus
  "tok_51ae57093097f5ff4f0b687e", // tout frais
  "tok_7b7a08ce9198664f5acb605c", // tout d’un coup
  "tok_3452d846338771f45000d3b4", // tout au long
  "tok_9a18a6805818fdbfbdab2696", // tout au moins
  "tok_0f18184dac6d092910472f15", // toutes les fautes: no existing surface
]);

const pendingSeConstructions = new Set([
  "tok_1559ae0e2ce4afdcd83a2f5d", // se faire introduire (causative)
  "tok_25ef3a14362ffe75ac91e9b2", // se faire (pronominal past)
  "tok_d4e88a783f925ed04d8c26fb", // se faire fort (idiom)
  "tok_c7c354346c6d5296cf1836e8", // se trouver (state/passive)
  "tok_8b86d8c3754342883d0f8bc8", // se discuter (passive)
  "tok_eba269d1b72705dcac428170", // se trouver (state)
  "tok_fe658df25dd454a0f28103bc", // se passer (elapsed)
  "tok_31305e22639a713b667c11b3", // se passer (occur)
  "tok_f3d4ed4817f478355e2b18af", // se décider (passive)
  "tok_db3a388a6c659d01be628f70", // se faire une idée (idiom)
  "tok_e644742f5c27eb91bd8df464", // se faire (passive)
]);

const pendingSiIntensifier = new Set([
  "tok_070543a6274bd6189acaabb7", "tok_6268071f3f972f94de0f9494", "tok_29244b413f5ea0931d5d979f",
  "tok_8ec3949ebb662ca68eccc1e5", "tok_cb28ae9ec363197b25c7796d",
]);

/** Returns only decisions that have received explicit editorial review. */
export function reviewedZolaExclusionDecision(candidate: TokenCandidate): ReviewDecision | undefined {
  if (candidate.normalized === "m" || candidate.normalized === "d") {
    return { candidateId: candidate.id, disposition: "editorial_artifact" };
  }
  if (properNameForms.has(candidate.normalized)) {
    return { candidateId: candidate.id, disposition: "proper_noun" };
  }
  if (candidate.capitalizationHint === "internal_uppercase" && contextualProperNames.has(candidate.normalized)) {
    return { candidateId: candidate.id, disposition: "proper_noun" };
  }
  return undefined;
}

export function reviewedZolaExclusions(candidates: readonly TokenCandidate[]): ReviewDecision[] {
  return candidates.flatMap((candidate) => {
    const decision = reviewedZolaExclusionDecision(candidate);
    return decision ? [decision] : [];
  });
}

export function reviewedZolaReuseDecisions(candidates: readonly TokenCandidate[], existing: ContentBundle): ReviewDecision[] {
  const surfaces = new Map(existing.surfaceForms.map((surface) => [surface.id, surface]));
  const senses = new Map(existing.senses.map((sense) => [sense.id, sense]));
  return candidates.flatMap((candidate) => {
    if (onePronounCandidateIds.has(candidate.id) || ((pendingQueConstructions.has(candidate.id) || pendingToutConstructions.has(candidate.id) || pendingSeConstructions.has(candidate.id) || pendingSiIntensifier.has(candidate.id)) && !reviewedContextualReuse[candidate.id])) return [];
    const identity = reviewedContextualReuse[candidate.id] ?? reviewedReusableIdentities[candidate.normalized];
    if (!identity) return [];
    const surface = surfaces.get(identity.surfaceFormId);
    const sense = senses.get(identity.senseId);
    if (!surface || !sense || surface.lemmaId !== sense.lemmaId) {
      throw new Error(`Invalid reviewed reuse identity for ${candidate.normalized}`);
    }
    return [{
      candidateId: candidate.id,
      disposition: "vocabulary" as const,
      lemmaId: surface.lemmaId,
      senseId: sense.id,
      surfaceFormId: surface.id,
    }];
  });
}
