import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {composeMicromegasReviewedWordBanks} from './micromegas-reviewed-word-banks.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const id=(prefix,seed)=>`${prefix}_micromegas_${sha(seed).slice(0,16)}`;
const coord=o=>`${o.unit}:${o.start}:${o.end}`;

import {resolvedWordDefinitions} from './micromegas-resolved-word-package.mjs';
import {directWordDefinitions} from './micromegas-direct-word-package.mjs';
export const continuationWordHolds={
 234:'Bind laissez là as a full expression with its adverb.',235:'Bind laissez là as a full expression with its verb.',
 251:'Review the full aller extent family before binding va au delà.',
 273:'Prepare à présent as a full time expression.',274:'News is not the published literary short-story meaning; review all nouvelle owners and banks.',
 298:'Review all arriver event and destination meanings before binding death and occurrence uses.',
 300:'Prepare pour moi as a full standpoint expression.',317:'Review all être presence banks and indexed occurrences before selecting été.',
 324:'Review all kind/category uses and both espèce banks before selecting a common meaning.',326:'Prepare par exemple as a complete illustrative expression.',
};
export const continuationOwnerDecisions={
 'défendit':{existingSenseId:'sns_zola_defendre_protect',partOfSpeech:'verb',reason:'The retained proper défendre head and accusation-defense meaning already include legal reflexive self-defense; all seven indexed legacy uses and fifteen current/historical questions were reviewed. No past-tense or reflexive-only meaning.'},
 embarrassa:{headword:'embarrasser',partOfSpeech:'verb',reason:'Pronominal concern under the non-reflexive dictionary head. In s’en, en determines elision; every original verb choice accepts this frame.'},
 former:{headword:'former',partOfSpeech:'verb',reason:'Se former l’esprit develops the mind; retain the non-reflexive verb head and a cultivated-development meaning.'},
 vante:{headword:'vanter',partOfSpeech:'verb',reason:'Se vanter means boast; in s’en, en controls elision for all original verb choices.'},
 quelque:{headword:'quelque',partOfSpeech:'adverb',reason:'Before accoutumé, concessive degree means however accustomed. Explicitly split this unit23 use from the determiner before système in unit154.',source:'https://www.dictionnaire-academie.fr/article/A3Q0062'},
 quelque_determiner:{lemmaId:'lem_zola_quelque',partOfSpeech:'determiner',reason:'Before système, whatever system is a concessive determiner. Keep the indefinite some meaning unchanged and start the newly separated sense fresh.',source:'https://vitrinelinguistique.oqlf.gouv.qc.ca/22720/la-grammaire/les-determinants/determinants-indefinis/accord-du-determinant-indefini-ou-de-ladverbe-quelque-dans-quelque-que'},
 'défendre':{lemmaId:'lem_zola_defendre',partOfSpeech:'verb',reason:'Se défendre de ce sourire means resist an impulse; distinct from protecting against attack or accusation under the same retained proper head.'},
 sages:{headword:'sage',partOfSpeech:'noun',reason:'Wise people are a substantive lexical noun; preserve the existing sage adjective and all its progress.'},
 saturniens:{headword:'Saturnien',partOfSpeech:'noun',printedForm:'Saturniens',reason:'Capitalized fictional demonym; all thirteen singular/plural source uses reviewed. The number variants share one meaning and retain separate surfaces.'},
 saturnien:{headword:'Saturnien',partOfSpeech:'noun',printedForm:'Saturnien',reason:'Explicit same-root singular form of Saturniens, with no number-only meaning.'},
 vers:{headword:'vers',partOfSpeech:'noun',reason:'Verse lines require a proper noun head, preserving every preposition record and approximate-age meaning.'},
 'variée':{headword:'varié',partOfSpeech:'adjective',reason:'An adjective meaning diverse belongs under varié; do not create an adjective owner named varier.'},
};
export const continuationWordDefinitions={
 embarrassa_bothered:'Dans s’embarrasser de, se préoccuper d’une chose ou s’en soucier.',
 former_cultivate_mind:'Développer et cultiver les facultés intellectuelles ou morales.',
 vante_boasts:'Dans se vanter, parler de soi ou de ses qualités avec une fierté affichée.',
 quelque_concessive:'Devant un adjectif, indique que le degré de cette qualité ne change pas ce qui suit : aussi… que.',
 quelque_concessive_determiner:'Devant un nom dans une concession, désigne n’importe lequel, sans que son choix change ce qui suit.',
 defendre_resist_reflexive:'Dans se défendre de, résister à une impulsion ou empêcher un comportement de se produire.',
 sages_wise_people:'Personne dont les jugements et la conduite témoignent de sagesse et de discernement.',
 saturniens_inhabitants:'Dans le récit, habitant de la planète Saturne.',
 vers_lines_of_poetry:'Ligne d’un poème, soumise ou non à des règles de rythme et de mesure.',
 ici_in_this_account:'À cet endroit ou à ce moment du récit ou de l’exposé.',
 satisfaction_pleasure:'Sentiment de contentement ou de plaisir éprouvé lorsqu’un désir ou une attente est satisfait.',
 lecteurs_readers:'Personne qui lit un texte ou une œuvre.',
 conversation_dialogue:'Échange oral de propos entre plusieurs personnes.',
 variee_diverse:'Qui présente des différences, des formes ou des aspects divers.',
 parterre_flower_bed:'Partie d’un jardin aménagée en plates-bandes et plantée de fleurs.',
 assemblee_gathering:'Ensemble de personnes réunies dans un même lieu.',
 blondes_fair_haired_women:'Femme dont les cheveux sont d’une couleur blonde, jaune pâle à dorée.',
 brunes_dark_haired_women:'Femme dont les cheveux sont de couleur brune, foncée.',
 parures_adornments:'Ensemble des vêtements et des ornements qui embellissent l’apparence d’une personne.',
 galerie_gallery:'Salle ou espace où sont présentées des œuvres d’art.',
 peintures_paintings:'Œuvre représentant une image au moyen de peinture.',
 traits_painted_lines:'Ligne tracée qui dessine un contour ou un détail d’une image.',
 comparaisons_similes:'Rapprochement de deux choses afin d’en montrer une ressemblance ou d’expliquer l’une par l’autre.',
 sens_sensory_faculties:'Faculté de percevoir les sensations et les informations du monde extérieur.',
 soixante_sixty:'Nombre égal à six dizaines.',
 academicien_scholar:'Membre d’une académie ou d’une société savante.',
 plaignons_complain:'Dans se plaindre, exprimer son mécontentement ou sa souffrance.',
 anneau_planetary_ring:'Bande annulaire de particules qui entoure une planète.',
 lunes_satellites:'Satellite naturel qui tourne autour d’une planète.',
 bornes_limited:'Qui est soumis à des limites et ne peut aller au-delà.',
 malgre_despite:'Indique qu’une action a lieu même si une circonstance pourrait y faire obstacle.',
 curiosite_wish_to_know:'Désir d’apprendre, de découvrir ou de connaître quelque chose.',
 nombre_count:'Quantité d’éléments d’un ensemble, obtenue en les comptant.',
 passions_strong_desires:'Émotion ou désir d’une grande intensité.',
 resultent_follow_from:'Se produire comme effet ou conséquence d’une cause.',
 vague_indistinct:'Qui n’est pas précisément défini ou déterminé.',
 inquietude_unease:'Sentiment de souci ou d’agitation qui empêche d’être tranquille.',
 parfaits_complete:'Qui est jugé accompli et dépourvu de défaut.',
 mortels_mortal_beings:'Être vivant dont la vie peut prendre fin par la mort.',
 manque_is_lacking:'Être absent ou ne pas exister en quantité suffisante.',
 positives_definite:'Qui est établi avec certitude et ne repose pas sur une simple supposition.',
 epuiserent_wore_themselves_out:'Dans s’épuiser, dépenser ses forces ou ses efforts jusqu’à ne plus en avoir.',
 conjectures_hypotheses:'Supposition ou hypothèse qui n’a pas encore été démontrée.',
 raisonnements_chains_of_reasoning:'Suite d’idées ou d’arguments liés pour parvenir à une conclusion.',
 ingenieux_clever:'Qui témoigne d’invention et d’habileté intellectuelle.',
 incertains_uncertain:'Qui n’est pas établi avec certitude et reste sujet au doute.',
 repliqua_replied:'Répondre à une question ou aux paroles d’une autre personne.',
 chez_among_world_of:'Dans le monde, le milieu ou la communauté d’une personne ou d’un groupe.',
 revolutions_orbital_cycles:'Cycle complet du mouvement d’un astre autour d’un autre.',
 revient_amounts_to:'Dans revenir à une quantité, être équivalent à cette quantité.',
 quinze_fifteen:'Nombre égal à dix plus cinq.',
 point_tiny_instant:'Marque de très faible étendue qui figure ici la brièveté d’une existence.',
 duree_duration:'Temps pendant lequel une chose existe ou une action se poursuit.',
 instant_moment:'Moment extrêmement bref.',
 atome_tiny_particle:'Particule extrêmement petite de matière ; par comparaison, être ou objet minuscule.',
 experience_life_knowledge:'Connaissance acquise par la pratique ou par ce que l’on a vécu.',
 projets_plans:'Intention ou plan d’une action à réaliser dans l’avenir.',
 goutte_drop:'Très petite quantité de liquide qui forme une masse arrondie.',
 ocean_ocean:'Très vaste étendue d’eau salée.',
 immense_vast:'Qui a une étendue ou des dimensions extrêmement grandes.',
 philosophe_thinker:'Personne qui réfléchit aux questions fondamentales de la connaissance et de l’existence.',
 craindrais_would_fear:'Éprouver de la peur ou de l’appréhension devant un danger ou un événement possible.',
 votre_yours_feminine:'Pronom possessif désignant ce qui appartient à la personne ou aux personnes auxquelles on s’adresse.',
 elements_constituents:'Partie constitutive de la matière ou de la nature.',
 ranimer_revive:'Redonner de la vie, de la vigueur ou de l’activité.',
 metamorphose_transformation:'Transformation d’une forme ou d’un état en un autre.',
 eternite_eternity:'Durée sans commencement ou sans fin, ou imaginée comme illimitée.',
 precisement_exactly:'D’une manière exacte, sans approximation.',
 murmurait_grumbled:'Exprimer son mécontentement par des protestations discrètes ou à voix basse.',
 repandu_spread:'Disperser ou distribuer une matière ou des éléments dans une étendue.',
 univers_cosmos:'Ensemble de ce qui existe dans le cosmos.',
 profusion_abundance:'Très grande abondance de choses.',
 varietes_diversities:'Sorte ou forme distincte au sein d’un ensemble.',
 uniformite_sameness:'Caractère de ce qui suit une même forme ou présente une ressemblance générale.',
 pensants_thinking:'Qui est capable de penser et de former des idées.',
 differents_distinct:'Qui présente une distinction et n’est pas identique à un autre.',
 pensee_faculty_of_thought:'Faculté de former des idées, de réfléchir et de raisonner.',
};

const category=raw=>{
 if(/\binterjection\b/.test(raw))return'interjection';
 if(/\bdeterminer\b/.test(raw))return'determiner';
 if(/\bnoun\b/.test(raw))return'noun';
 if(/\bpronoun\b/.test(raw))return'pronoun';
 if(/\badjective\b/.test(raw))return'adjective';
 if(/\bverb\b|participle|indicative|subjunctive|infinitive|past historic|future|imperative|conditional/.test(raw))return'verb';
 if(/\bnumeral\b/.test(raw))return'numeral';
 if(/\badverb\b/.test(raw))return'adverb';
 if(/\bpreposition\b/.test(raw))return'preposition';
 throw Error(`Undeclared lexical category: ${raw}`);
};

/** Materialize106 named identities from105 groups and one explicit sense split, leaving all uncertain owners untouched. */
export function composeMicromegasContinuationWordPackage(folder){
 const evidence={},cache=new Map();
 const ensure=(ok,msg)=>{if(!ok)throw Error(`Micromégas continuation package49: ${msg}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const pointer=e=>e.selector.split('/').slice(1).reduce((v,k)=>v[k],read(e.file));
 const graph=read('whole-work-identity-dependencies-43.json'),composition=read('whole-work-import-composition-42.json'),previousWords=read('whole-work-reviewed-word-bindings-44.json'),previousBanks=read('whole-work-reviewed-word-banks-45.json');
 const previousDirect=read('whole-work-direct-word-package-46.json'),previousResolved=read('whole-work-resolved-word-package-47.json'),previousExpressions=read('whole-work-resolved-expressions-48.json'),refinements=read('whole-work-continuation-bank-refinements-49.json'),routes=read('whole-work-owner-routes-49.json');
 const p=loadPublication();ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged publication baseline');
 const declarations=new Map([...graph.declarations,...routes.declarations].map(d=>[d.declaration,d]));
 const excluded=new Map(Object.entries(continuationWordHolds).map(([i,reason])=>[Number(i),reason]));
 const cleared=new Set([122,138,140,180,187,192,196,211,222]);
 const selected=graph.directDraftBankGroups.filter((g,i)=>cleared.has(i)||(i>=225&&i<=330&&!excluded.has(i))).map(g=>structuredClone(g));
 const split=selected.find(g=>g.surface==='quelque');
 const nounUse=split.occurrences.filter(o=>o.unit===154);split.occurrences=split.occurrences.filter(o=>o.unit===23);
 ensure(split.occurrences.length===1&&nounUse.length===1,'explicit two source quelque routes');
 selected.push({...structuredClone(split),route:'quelque_determiner',occurrences:nounUse,sourceBanks:split.banks,root:routes.declarations[0].root,banks:[routes.bank]});
 ensure(selected.length===106,'exact named source-order package plus one explicit separated meaning');
 const held=graph.directDraftBankGroups.map((g,i)=>({g,i})).filter(({i})=>excluded.has(i)).map(({g,i})=>({index:i,surface:g.surface,root:g.root,banks:g.banks,occurrences:g.occurrences,reason:excluded.get(i)}));
 const lemmas=new Map(p.bundle.lemmas.map(l=>[l.id,l])),senses=new Map(p.bundle.senses.map(s=>[s.id,s])),surfaces=new Map(p.bundle.surfaceForms.map(s=>[s.id,s]));
 for(const[k,m]of[['newLemmas',lemmas],['newSenses',senses],['newSurfaceForms',surfaces]])for(const e of [...previousWords[k],...previousDirect[k],...previousResolved[k]]){ensure(!m.has(e.record.id),'prior staged record collision');m.set(e.record.id,e.record);}
 const newLemmas=new Map(),newSenses=new Map(),newSurfaces=new Map(),source=new Map(composition.tokens.map(t=>[coord(t),t]));
 const lemmaRecord=lemma=>lemmas.get(lemma)??newLemmas.get(lemma)?.record;
 const materializeLemma=root=>{
  const l=root.lemma;if(l.kind==='published_lemma'){ensure(lemmas.has(l.lemmaId),'declared published lemma');return l.lemmaId;}
  ensure(l.kind==='planned_lemma','no unresolved historical lemma owner');
  const d=declarations.get(l.declaration),bank=pointer({file:d.bank.file,selector:d.bank.selector}),partOfSpeech=category(bank.partOfSpeech),headword=bank.lemma;
  ensure(!headword.startsWith('se '),'proper non-reflexive verb head required');
  const lemmaId=id('lem',`${headword}:${partOfSpeech}`),record={id:lemmaId,headword,partOfSpeech};
  if(lemmas.has(lemmaId))ensure(hash(lemmas.get(lemmaId))===hash(record),'exact previously staged lexical owner');
  else{const existing=p.bundle.lemmas.filter(l=>l.headword===headword&&l.partOfSpeech===partOfSpeech);ensure(existing.length===0,`explicit current existing-head review required: ${headword}`);if(newLemmas.has(lemmaId))ensure(hash(newLemmas.get(lemmaId).record)===hash(record),'new lemma metadata collision');else newLemmas.set(lemmaId,{record,evidence:d.evidence,declaredLemmaRoot:l.declaration});}
  return lemmaId;
 };
 const senseIdFor=(root,form)=>{
  const override=continuationOwnerDecisions[form];if(override?.existingSenseId){ensure(senses.has(override.existingSenseId),'explicit existing meaning');return override.existingSenseId;}
  
  if(root.kind==='published_sense'){ensure(senses.has(root.senseId),'existing sense retained');return root.senseId;}
  const d=declarations.get(root.declaration),bank=pointer({file:d.bank.file,selector:d.bank.selector}),key=root.declaration.split(':')[1],definition=continuationWordDefinitions[key]??resolvedWordDefinitions[key]??directWordDefinitions[key];
  ensure(definition,`explicit French definition required: ${key}`);const ownerOverride=continuationOwnerDecisions[form];
  let lemmaId;if(ownerOverride?.lemmaId){lemmaId=ownerOverride.lemmaId;ensure(lemmas.has(lemmaId),'explicit retained proper head');}else if(ownerOverride?.headword){const record={id:id('lem',`${ownerOverride.headword}:${ownerOverride.partOfSpeech}`),headword:ownerOverride.headword,partOfSpeech:ownerOverride.partOfSpeech};lemmaId=record.id;ensure(!p.bundle.lemmas.some(l=>l.headword===record.headword&&l.partOfSpeech===record.partOfSpeech),'new proper head absent in publication');if(!lemmas.has(lemmaId)&&!newLemmas.has(lemmaId))newLemmas.set(lemmaId,{record,evidence:d.evidence,declaredLemmaRoot:root.declaration,ownerDecision:ownerOverride});}else lemmaId=materializeLemma(root);
  const senseId=id('sns',`direct-draft:${root.declaration}`);
  ensure(lemmaRecord(lemmaId).partOfSpeech===(continuationOwnerDecisions[form]?.partOfSpeech??category(bank.partOfSpeech)),`proper lexical owner ${key}`);
  const record={id:senseId,lemmaId,gloss:ownerOverride?.gloss??bank.meaning,definition};
  if(senses.has(senseId)){ensure(hash(senses.get(senseId))===hash(record),'reuse exact previously staged root');return senseId;}
  if(newSenses.has(senseId))ensure(hash(newSenses.get(senseId).record)===hash(record),'same declared sense exact metadata');else newSenses.set(senseId,{record,evidence:d.evidence,declaredSenseRoot:root.declaration,definitionAuthority:{file:'scripts/micromegas-continuation-word-package.mjs',key}});
  return senseId;
 };
 const occurrenceBindings=[],identityGroups=[],bankDependencies=[];
 for(const g of selected){
  ensure(g.banks.length===1||g.surface==='satisfaction','only explicitly resolved competing bank');
  const senseId=senseIdFor(g.root,g.route??g.surface),sense=senses.get(senseId)??newSenses.get(senseId).record,lemmaId=sense.lemmaId,bank=pointer({file:g.banks[0].file,selector:g.banks[0].selector});
  ensure(lemmaRecord(lemmaId).partOfSpeech===(continuationOwnerDecisions[g.route??g.surface]?.partOfSpeech??category(bank.partOfSpeech)),`source category agrees with proper owner ${g.surface}`);
  const matches=[...surfaces.values(),...[...newSurfaces.values()].map(e=>e.record)].filter(s=>s.lemmaId===lemmaId&&s.normalized===g.surface);
  const hasQuiz=s=>[...p.preparedQuizzes.values()].some(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===s.id&&q.subject.senseId===senseId);
  const active=matches.filter(hasQuiz);ensure(active.length<=1&&((active.length===1)||matches.length<=1),`explicit surface selection required ${g.surface}`);
  let surface=active[0]??matches[0];if(!surface){const surfaceId=id('srf',`${lemmaId}:${g.surface}`);surface={id:surfaceId,lemmaId,form:continuationOwnerDecisions[g.route??g.surface]?.printedForm??g.surface,normalized:g.surface};newSurfaces.set(surfaceId,{record:surface,evidence:{file:g.banks[0].file,selector:g.banks[0].selector}});}
  const identity=`${surface.id}:${senseId}`,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';
  ensure(!identityGroups.some(x=>x.identity===identity),'distinct declared surface-and-sense groups');
  identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root,ownerDecision:continuationOwnerDecisions[g.route??g.surface]??null});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(t?.owner.kind==='draft_bank'&&(g.sourceBanks??g.banks).some(b=>t.owner.file===b.file&&t.owner.key===b.key)&&t.form===g.surface&&t.text===o.text,'exact current draft source owner');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:t.owner.file,selector:(g.sourceBanks??g.banks).find(b=>b.file===t.owner.file&&b.key===t.owner.key).selector}});}
  ensure(hash(bank.questions)===g.banks[0].questionSha256,'exact chapter bank revision');
  const candidates=[{kind:'contextual_draft_bank',evidence:{file:g.banks[0].file,selector:g.banks[0].selector},key:g.banks[0].key,questionSha256:g.banks[0].questionSha256,reviewedOverlay:composition.bankBindings.find(b=>b.file===g.banks[0].file&&b.key===g.banks[0].key&&b.beforeQuestionSha256!==b.afterQuestionSha256)??null}];
  const refined=refinements.items.find(r=>r.file===g.banks[0].file&&r.key===g.banks[0].key);
  if(refined){ensure(!candidates[0].reviewedOverlay||candidates[0].reviewedOverlay.beforeQuestionSha256===candidates[0].reviewedOverlay.afterQuestionSha256,'only explicit metadata-only predecessor overlay may precede refinement');ensure(hash(bank.questions)===refined.beforeQuestionSha256&&hash(refined.after.questions)===refined.afterQuestionSha256,'exact named direct refinement');candidates[0].reviewedOverlay={evidence:{file:'whole-work-continuation-bank-refinements-49.json',selector:`/items/${refinements.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};}
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);
  if(existing.length){ensure(existing.length===3,'complete retained historical bank');candidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const b of g.banks.slice(1)){ensure(hash(pointer({file:b.file,selector:b.selector}).questions)===b.questionSha256,'exact unselected alternate bank');candidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256});}
  bankDependencies.push({identity,candidates,status:'explicit_single_draft_or_existing_bank_selection'});
 }
 const prior=new Map([...previousBanks.banks,...previousDirect.banks,...previousResolved.banks].map(b=>[b.identity,b]));
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!prior.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]};
 const prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{
  const previous=prior.get(g.identity);if(!previous)return prepared.banks.find(b=>b.identity===g.identity);
  const file=previousBanks.banks.includes(previous)?'whole-work-reviewed-word-banks-45.json':previousDirect.banks.includes(previous)?'whole-work-direct-word-package-46.json':'whole-work-resolved-word-package-47.json';
  const sourceBank=file.includes('45')?previousBanks.banks:file.includes('46')?previousDirect.banks:previousResolved.banks;
  return {...previous,chosen:{kind:'previously_bound_candidate_bank',evidence:{file,selector:`/banks/${sourceBank.indexOf(previous)}`},questionSha256:previous.questionSha256},selectionReason:'Retain the exact previously bound Surface+Sense bank; add these separately indexed draft source uses.',alternateCandidates:bankDependencies.find(d=>d.identity===g.identity).candidates,masteryAction:g.masteryAction};
 });
 ensure(banks.length===106&&banks.every(b=>b?.questions.length===3),'complete exact canonical banks');
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'source use bound once');
 const remaining=previousExpressions.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o)));
 const remainingGroups=graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>remaining.some(r=>coord(r)===coord(o)))).length;
 const summary={boundDirectDraftSourceUses:occurrenceBindings.length,boundDirectDraftIdentityGroups:identityGroups.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:newLemmas.size,newSenses:newSenses.size,newSurfaceForms:newSurfaces.size,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,freshIdentityGroups:identityGroups.filter(g=>g.masteryAction==='fresh_identity_on_exact_unit_view').length,preservedPriorCanonicalBanks:banks.filter(b=>b.chosen.kind==='previously_bound_candidate_bank').length,preservedExistingBankSelections:banks.filter(b=>b.chosen.kind==='existing_prepared_bank').length,contextualBankSelections:banks.filter(b=>b.chosen.kind==='contextual_draft_bank').length,refinedBanks:refinements.summary.refinedBanks,refinedQuestionBands:refinements.summary.refinedQuestionBands,explicitOwnershipAndBankHolds:held.length,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:remainingGroups,pendingPhraseSpans:composition.phrases.length};
 return {version:1,workId:graph.workId,status:'offline_direct_draft_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,policy:'Prepare106 exact word identities including separately routed concessive quelque. Preserve all published records, predecessor packages, old mastery and alternative satisfaction banks. Proper noun heads and non-reflexive verb heads are explicit; Saturnien number forms share one meaning. Fresh meanings start only on exact unit view. Offline only, no import, release approval or deployment.',continuationOwnerDecisions,preservedCompetingBanks:selected.filter(g=>g.banks.length>1).map(g=>({surface:g.surface,selected:g.banks[0],alternates:g.banks.slice(1),reason:'The earliest satisfaction bank tests contentment and pleasure, which also covers satisfaction of needs; explicitly retain the later contextual bank without a duplicate mastery slot.'})),newLemmas:[...newLemmas.values()],newSenses:[...newSenses.values()],newSurfaceForms:[...newSurfaces.values()],identityGroups,occurrenceBindings,bankDependencies,banks,heldGroups:held,remainingDirectDraftOccurrences:remaining,summary};
}
