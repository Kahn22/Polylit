import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {composeMicromegasReviewedWordBanks} from './micromegas-reviewed-word-banks.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const id=(prefix,seed)=>`${prefix}_micromegas_${sha(seed).slice(0,16)}`;
const coord=o=>`${o.unit}:${o.start}:${o.end}`;

import {directWordDefinitions} from './micromegas-direct-word-package.mjs';
export const resolvedWordHolds={
 122:'Review the full legal-defense family under the proper défendre verb head before selecting a meaning.',
 138:'Reflexive question choices mix se/s’ elision; review the complete bank and existing proper head.',
 140:'Review the cultivate-mind use with its reflexive frame and all existing former owners.',
 142:'Resolve chaise de poste as a complete lexical construction before binding its component.',
 143:'Resolve chaise de poste together with its carriage component.',
 147:'Review the fixed là-haut adverb and expression boundary before final import.',
 150:'Bind the complete au delà de construction, preserving historical spacing.',
 162:'Bind the complete à l’aide de construction, excluding the complement.',
 173:'Bind the full à travers construction rather than a through meaning under a noun head.',
 180:'Correct the se/s’ elision cue in the boasting bank and review its proper head.',
 183:'Prepare the full à Dieu ne plaise expression.',
 187:'Bind concessive quelque under its adverb head, preserving the determiner record.',
 192:'Review the existing défendre family and the resist construction.',
 196:'Resolve wise-people ownership versus the existing sage adjective before final binding.',
 211:'Review the capitalized fictional Saturnien noun head across both singular and plural drafts.',
 217:'Prepare à la vérité and en vérité as full expressions with separate surfaces.',
 218:'Review rendre compte and its discontinuous source span before binding its verb component.',
 219:'Review rendre compte together with its report component and retained adjective.',
 222:'Bind verse lines under a proper vers noun head, preserving the preposition identity.',
};
export const resolvedOwnerDecisions={
 haut:{lemmaId:'lem_fr_haut_noun',partOfSpeech:'noun',gloss:'height (historical measure)',reason:'Académie1740 distinguishes the substantive height dimension from top, adjective high and adverb aloud.',source:'https://www.dictionnaire-academie.fr/article/A3H0124'},
 pas:{lemmaId:'lem_pas_noun',partOfSpeech:'noun',reason:'Exact canonical unit2 defines the geometric pace as five feet; retain walking-step, approximate-pace and negative-adverb records.'},
 public:{headword:'public',partOfSpeech:'noun',reason:'Le public denotes people collectively; the old adjective owner is retained unchanged.'},
 'êtres':{headword:'être',partOfSpeech:'noun',gloss:'beings; entities that exist',reason:'Unit58 includes material and thinking entities; the noun meaning is not restricted to living creatures.'},
 'être':{headword:'être',partOfSpeech:'noun',reason:'Explicit same-sense join to etres_beings: pensant and the comparison specify the entity; singular number does not create another meaning.',sameSenseRoot:'chapter-01-identity-plan.json:etres_beings'},
 'très-jolie':{existingSenseId:'sns_parure_joli_qui_a_de_la_grace_de_l_agrement_c9d52e1cf5',partOfSpeech:'adjective',reason:'The historical hyphen and très intensify the existing pleasing jolie meaning. Retain this exact printed surface under joli; preserve the other legacy heads.'},
 sirien:{headword:'Sirien',partOfSpeech:'noun',printedForm:'Sirien',reason:'A fictional demonym is a lexical noun, not an excluded individual proper name. Preserve source capitalization.'},
 depuis:{headword:'depuis',partOfSpeech:'adverb',reason:'Standalone devint depuis means afterward, without a prepositional complement. Preserve the since preposition.',source:'https://www.dictionnaire-academie.fr/article/A3D0611'},
 'dérobent':{headword:'dérober',partOfSpeech:'verb',reason:'Se dérober aux microscopes means escape observation; store the reflexive meaning under the non-reflexive dictionary head.'},
 affaires:{lemmaId:'lem_affaire',partOfSpeech:'noun',reason:'Fit quelques affaires denotes troublesome disputes, a distinct meaning under the retained proper noun head. Preserve both historical affaire heads.',source:'https://www.dictionnaire-academie.fr/article/A4A0409'},
 allait:{existingSenseId:'sns_aller_primary',partOfSpeech:'verb',reason:'De globe en globe is ordinary movement under lem_aller. Do not invent an imperfect-tense meaning or inherit the near-future surface mastery.'},
};
export const resolvedWordDefinitions={
 haut_vertical_measure:'Dimension verticale mesurée de la base au sommet, dans une expression de mesure ancienne.',
 pas_historical_length:'Ancienne unité fixe de longueur, le pas géométrique, qui vaut cinq pieds dans le système décrit.',
 public_people:'Ensemble des personnes considérées collectivement.',
 terre_planet_earth:'Planète sur laquelle vivent les êtres humains.',
 etres_beings:'Ce qui existe comme entité, matérielle ou pensée ; notamment une créature vivante.',
 sirien_inhabitant:'Dans le récit, habitant d’un monde situé autour de Sirius.',
 depuis_afterward:'À une époque ultérieure, après le moment dont il est question.',
 derobent_escape_observation:'Dans se dérober à, échapper à la perception ou à l’observation.',
 affaires_troubles:'Difficultés, démêlés ou ennuis dans lesquels une personne se trouve engagée.',
 sentant_suggesting_heresy:'Évoquer ou laisser soupçonner un caractère particulier.',
 heresie_religious:'Doctrine jugée contraire à la foi reconnue par une autorité religieuse.',
 poursuivit_prosecuted:'Engager une action judiciaire contre une personne.',
 vivement_with_vigor:'Avec une grande énergie ou une forte intensité.',
 forme_substantial_scholastic:'Dans la philosophie scolastique, principe inhérent à un être qui en détermine la nature.',
 substantielle_scholastic:'Dans la philosophie scolastique, qui concerne le principe déterminant la nature d’un être.',
 puces_fleas:'Petit insecte parasite sans ailes qui se déplace en sautant.',
 nature_kind:'Caractère essentiel ou type d’une chose.',
 colimacons_snails:'Mollusque terrestre qui porte une coquille en spirale ; escargot.',
 cote_own_side:'Camp ou parti auquel une personne apporte son soutien.',
 condamner_official_censure:'Prononcer une décision officielle de censure ou d’interdiction contre une œuvre.',
 jurisconsultes_legal:'Spécialiste du droit qui étudie et interprète les lois.',
 paraitre_appear_at_court:'Se présenter dans un lieu ou se montrer en public.',
 annees_years:'Période de douze mois.',
 mediocrement_moderately:'Dans une mesure limitée ou modérée.',
 afflige_distressed:'Causer de la peine ou du chagrin à une personne.',
 banni_exiled:'Exclure officiellement une personne d’un lieu et lui interdire d’y séjourner.',
 remplie_filled:'Occuper un espace ou une situation avec un contenu abondant.',
 tracasseries_hassles:'Petite difficulté ou vexation répétée qui irrite ou gêne.',
 petitesses_petty_behavior:'Action ou conduite mesquine, attachée à des intérêts ou à des détails insignifiants.',
 chanson_song:'Composition de paroles destinées à être chantées sur une mélodie.',
 plaisante_amusing:'Qui amuse ou fait sourire.',
 celui_ci_this_one:'Désigne une personne ou une chose proche dans le discours, notamment la dernière nommée.',
 voyager_travel:'Se déplacer d’un lieu à un autre pour découvrir ou parcourir des régions.',
 berline_carriage:'Ancienne voiture de voyage fermée, tirée par des chevaux.',
 equipages_travel_conveyances:'Ensemble des moyens et équipements utilisés pour transporter des voyageurs.',
 tas_heap:'Accumulation de matière ou d’objets réunis en un amas.',
 concevons_imagine:'Se représenter une chose ou une idée par la pensée.',
 usages_customs:'Pratique habituelle admise dans une communauté.',
 voyageur_traveler:'Personne qui effectue un voyage.',
 merveilleusement_extremely_well:'D’une manière exceptionnellement bonne ou remarquable.',
 lois_physical_laws:'Principe qui décrit une régularité dans les phénomènes naturels.',
 gravitation_attraction:'Attraction qui s’exerce entre les corps ayant une masse.',
 attractives_attracting:'Qui attire des corps les uns vers les autres.',
 repulsives_repelling:'Qui repousse des corps et les éloigne les uns des autres.',
 servait_used:'Dans se servir de, employer une chose comme moyen.',
 tantot_alternation:'Indique, avec un autre tantôt, une alternance de moments ou de moyens.',
 rayon_lightbeam:'Faisceau étroit de lumière provenant d’une source.',
 commodite_convenient_means:'Facilité ou moyen commode offert pour accomplir une action.',
 comète_astronomy:'Petit corps céleste qui peut former une chevelure et une queue lumineuse en s’approchant du Soleil.',
 siens_his_people:'Les personnes appartenant à sa famille ou à son propre groupe.',
 voltige_flits:'Voler légèrement en allant d’un point à un autre.',
 branche_tree_limb:'Partie d’un arbre qui pousse à partir du tronc et porte des rameaux ou des feuilles.',
 parcourut_traversed:'Se déplacer dans une région ou un espace en le traversant.',
 semee_strewn:'Répandre ou disperser des éléments dans une étendue.',
 empyree_highest_heaven:'Se dit du ciel le plus élevé dans une ancienne représentation cosmologique.',
 illustre_famous:'Qui bénéficie d’une grande renommée.',
 vicaire_clergyman:'Ecclésiastique exerçant une fonction religieuse dans une paroisse.',
 lunette_telescope:'Instrument optique permettant d’observer des objets éloignés.',
 pretende_claims_to_assert:'Affirmer une proposition ou soutenir qu’elle est vraie.',
 observateur_observer:'Personne qui examine attentivement les faits ou les phénomènes.',
 contredire_contradict:'Exprimer une affirmation contraire à celle d’une autre personne.',
 tourne_traveled_around:'Se déplacer d’un lieu à un autre en parcourant divers endroits.',
 accoutume_used_to:'Rendre une personne familière avec une pratique ou une situation par l’habitude.',
 petitesse_smallness:'Caractère de ce qui a une très faible taille.',
 superiorite_superiority:'Situation ou sentiment d’être au-dessus d’autrui.',
 echappe_occurs_involuntarily:'Se manifester involontairement, sans que la personne puisse le retenir.',
 quelquefois_sometimes:'À certaines occasions, sans régularité constante.',
 enfin_after_all:'Appuie une justification ou une considération que l’on fait finalement valoir.',
 nains_dwarfs:'Personne ou être de très petite taille, ici par comparaison.',
 toises_historical_length:'Ancienne unité de longueur appelée toise.',
 environ_approximately:'À peu près, sans mesure exacte.',
 musicien_musician:'Personne qui compose ou pratique la musique.',
 italien_italian:'Qui vient d’Italie ou se rapporte à ce pays.',
 musique_music:'Art qui organise des sons, des rythmes et des mélodies.',
 familiarisa_became_familiar:'Dans se familiariser avec, apprendre à connaître une personne ou une chose et devenir à l’aise avec elle.',
 lia_formed_bond:'Établir un lien ou une relation entre des personnes.',
 etroite_close_relationship:'Qui unit des personnes par une forte proximité affective.',
 amitie_friendship:'Lien affectueux et réciproque entre des personnes.',
 secretaire_academy_official:'Personne chargée de rédiger les comptes rendus et de suivre les travaux d’une société savante.',
 academie_scholarly:'Société savante qui réunit des membres pour étudier et discuter leurs travaux.',
 inventions_new_creations:'Création nouvelle d’un objet, d’un procédé ou d’une idée.',
 passablement_appreciable_quantity:'En quantité appréciable, sans être immense.',
 calculs_computations:'Opération effectuée sur des nombres pour obtenir un résultat.',
 rapporterai_recount:'Raconter ou relater des paroles, des faits ou des événements.',
};

const category=raw=>{
 if(/\bnoun\b/.test(raw))return'noun';
 if(/\bpronoun\b/.test(raw))return'pronoun';
 if(/\badjective\b/.test(raw))return'adjective';
 if(/\bverb\b|participle|indicative|subjunctive|infinitive|past historic|future/.test(raw))return'verb';
 if(/\bnumeral\b/.test(raw))return'numeral';
 if(/\badverb\b/.test(raw))return'adverb';
 if(/\bpreposition\b/.test(raw))return'preposition';
 throw Error(`Undeclared lexical category: ${raw}`);
};

/** Materialize a named 100-group package, leaving all uncertain owners untouched. */
export function composeMicromegasResolvedWordPackage(folder){
 const evidence={},cache=new Map();
 const ensure=(ok,msg)=>{if(!ok)throw Error(`Micromégas resolved package47: ${msg}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const pointer=e=>e.selector.split('/').slice(1).reduce((v,k)=>v[k],read(e.file));
 const graph=read('whole-work-identity-dependencies-43.json'),composition=read('whole-work-import-composition-42.json'),previousWords=read('whole-work-reviewed-word-bindings-44.json'),previousBanks=read('whole-work-reviewed-word-banks-45.json');
 const previousDirect=read('whole-work-direct-word-package-46.json'),refinements=read('whole-work-resolved-bank-refinements-47.json');
 const p=loadPublication();ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged publication baseline');
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d]));
 const excluded=new Map(Object.entries(resolvedWordHolds).map(([i,reason])=>[Number(i),reason]));
 const resolvedForms=new Set(['haut','pas','public','terre','êtres','très-jolie','sirien','depuis','dérobent','affaires']);
 const selected=graph.directDraftBankGroups.filter((g,i)=>(i<113&&resolvedForms.has(g.surface))||(i>=113&&i<=224&&!excluded.has(i)));
 ensure(selected.length===103,'exact named source-order package');
 const held=graph.directDraftBankGroups.map((g,i)=>({g,i})).filter(({i})=>excluded.has(i)).map(({g,i})=>({index:i,surface:g.surface,root:g.root,banks:g.banks,occurrences:g.occurrences,reason:excluded.get(i)}));
 const lemmas=new Map(p.bundle.lemmas.map(l=>[l.id,l])),senses=new Map(p.bundle.senses.map(s=>[s.id,s])),surfaces=new Map(p.bundle.surfaceForms.map(s=>[s.id,s]));
 for(const[k,m]of[['newLemmas',lemmas],['newSenses',senses],['newSurfaceForms',surfaces]])for(const e of [...previousWords[k],...previousDirect[k]]){ensure(!m.has(e.record.id),'prior staged record collision');m.set(e.record.id,e.record);}
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
  const override=resolvedOwnerDecisions[form];if(override?.existingSenseId){ensure(senses.has(override.existingSenseId),'explicit existing meaning');return override.existingSenseId;}
  if(form==='être')root=graph.directDraftBankGroups.find(g=>g.surface==='êtres').root;
  if(root.kind==='published_sense'){ensure(senses.has(root.senseId),'existing sense retained');return root.senseId;}
  const d=declarations.get(root.declaration),bank=pointer({file:d.bank.file,selector:d.bank.selector}),key=root.declaration.split(':')[1],definition=resolvedWordDefinitions[key]??directWordDefinitions[key];
  ensure(definition,`explicit French definition required: ${key}`);const ownerOverride=resolvedOwnerDecisions[form==='être'?'êtres':form];
  let lemmaId;if(ownerOverride?.lemmaId){lemmaId=ownerOverride.lemmaId;ensure(lemmas.has(lemmaId),'explicit retained proper head');}else if(ownerOverride?.headword){const record={id:id('lem',`${ownerOverride.headword}:${ownerOverride.partOfSpeech}`),headword:ownerOverride.headword,partOfSpeech:ownerOverride.partOfSpeech};lemmaId=record.id;ensure(!p.bundle.lemmas.some(l=>l.headword===record.headword&&l.partOfSpeech===record.partOfSpeech),'new proper head absent in publication');if(!lemmas.has(lemmaId)&&!newLemmas.has(lemmaId))newLemmas.set(lemmaId,{record,evidence:d.evidence,declaredLemmaRoot:root.declaration,ownerDecision:ownerOverride});}else lemmaId=materializeLemma(root);
  const senseId=id('sns',`direct-draft:${root.declaration}`);
  ensure(lemmaRecord(lemmaId).partOfSpeech===(resolvedOwnerDecisions[form]?.partOfSpeech??category(bank.partOfSpeech)),`proper lexical owner ${key}`);
  const record={id:senseId,lemmaId,gloss:ownerOverride?.gloss??bank.meaning,definition};
  if(senses.has(senseId)){ensure(hash(senses.get(senseId))===hash(record),'reuse exact previously staged root');return senseId;}
  if(newSenses.has(senseId))ensure(hash(newSenses.get(senseId).record)===hash(record),'same declared sense exact metadata');else newSenses.set(senseId,{record,evidence:d.evidence,declaredSenseRoot:root.declaration,definitionAuthority:{file:'scripts/micromegas-resolved-word-package.mjs',key}});
  return senseId;
 };
 const occurrenceBindings=[],identityGroups=[],bankDependencies=[];
 for(const g of selected){
  ensure(g.banks.length===1||g.surface==='terre','only explicitly resolved competing bank');
  const senseId=senseIdFor(g.root,g.surface),sense=senses.get(senseId)??newSenses.get(senseId).record,lemmaId=sense.lemmaId,bank=pointer({file:g.banks[0].file,selector:g.banks[0].selector});
  ensure(lemmaRecord(lemmaId).partOfSpeech===(resolvedOwnerDecisions[g.surface]?.partOfSpeech??category(bank.partOfSpeech)),`source category agrees with proper owner ${g.surface}`);
  const matches=[...surfaces.values(),...[...newSurfaces.values()].map(e=>e.record)].filter(s=>s.lemmaId===lemmaId&&s.normalized===g.surface);
  const hasQuiz=s=>[...p.preparedQuizzes.values()].some(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===s.id&&q.subject.senseId===senseId);
  const active=matches.filter(hasQuiz);ensure(active.length<=1&&((active.length===1)||matches.length<=1),`explicit surface selection required ${g.surface}`);
  let surface=active[0]??matches[0];if(!surface){const surfaceId=id('srf',`${lemmaId}:${g.surface}`);surface={id:surfaceId,lemmaId,form:resolvedOwnerDecisions[g.surface]?.printedForm??g.surface,normalized:g.surface};newSurfaces.set(surfaceId,{record:surface,evidence:{file:g.banks[0].file,selector:g.banks[0].selector}});}
  const identity=`${surface.id}:${senseId}`,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';
  ensure(!identityGroups.some(x=>x.identity===identity),'distinct declared surface-and-sense groups');
  identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root,ownerDecision:resolvedOwnerDecisions[g.surface]??null});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(t?.owner.kind==='draft_bank'&&g.banks.some(b=>t.owner.file===b.file&&t.owner.key===b.key)&&t.form===g.surface&&t.text===o.text,'exact current draft source owner');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:t.owner.file,selector:g.banks.find(b=>b.file===t.owner.file&&b.key===t.owner.key).selector}});}
  ensure(hash(bank.questions)===g.banks[0].questionSha256,'exact chapter bank revision');
  const candidates=[{kind:'contextual_draft_bank',evidence:{file:g.banks[0].file,selector:g.banks[0].selector},key:g.banks[0].key,questionSha256:g.banks[0].questionSha256,reviewedOverlay:composition.bankBindings.find(b=>b.file===g.banks[0].file&&b.key===g.banks[0].key&&b.beforeQuestionSha256!==b.afterQuestionSha256)??null}];
  const refined=refinements.items.find(r=>r.file===g.banks[0].file&&r.key===g.banks[0].key);
  if(refined){ensure(!candidates[0].reviewedOverlay||candidates[0].reviewedOverlay.beforeQuestionSha256===candidates[0].reviewedOverlay.afterQuestionSha256,'only explicit metadata-only predecessor overlay may precede refinement');ensure(hash(bank.questions)===refined.beforeQuestionSha256&&hash(refined.after.questions)===refined.afterQuestionSha256,'exact named direct refinement');candidates[0].reviewedOverlay={evidence:{file:'whole-work-resolved-bank-refinements-47.json',selector:`/items/${refinements.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};}
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);
  if(existing.length){ensure(existing.length===3,'complete retained historical bank');candidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  bankDependencies.push({identity,candidates,status:'explicit_single_draft_or_existing_bank_selection'});
 }
 const prior=new Map([...previousBanks.banks,...previousDirect.banks].map(b=>[b.identity,b]));
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!prior.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]};
 const prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{
  const previous=prior.get(g.identity);if(!previous)return prepared.banks.find(b=>b.identity===g.identity);
  return {...previous,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:previousBanks.banks.includes(previous)?'whole-work-reviewed-word-banks-45.json':'whole-work-direct-word-package-46.json',selector:`/banks/${previousBanks.banks.includes(previous)?previousBanks.banks.indexOf(previous):previousDirect.banks.indexOf(previous)}`},questionSha256:previous.questionSha256},selectionReason:'Retain the already bound canonical bank for this exact Surface+Sense; add only these separately indexed draft source occurrences.',alternateCandidates:bankDependencies.find(d=>d.identity===g.identity).candidates,masteryAction:g.masteryAction};
 });
 ensure(banks.length===103&&banks.every(b=>b?.questions.length===3),'complete exact canonical banks');
 const bound=new Set(occurrenceBindings.map(coord));const priorBound=new Set(previousDirect.occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'source use bound once');
 const remaining=graph.directDraftBankGroups.flatMap(g=>g.occurrences.filter(o=>!bound.has(coord(o))&&!priorBound.has(coord(o))).map(o=>({...o,form:g.surface,root:g.root,banks:g.banks})));
 const summary={boundDirectDraftSourceUses:occurrenceBindings.length,boundDirectDraftIdentityGroups:identityGroups.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:newLemmas.size,newSenses:newSenses.size,newSurfaceForms:newSurfaces.size,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,freshIdentityGroups:identityGroups.filter(g=>g.masteryAction==='fresh_identity_on_exact_unit_view').length,preservedPriorCanonicalBanks:banks.filter(b=>b.chosen.kind==='previously_bound_candidate_bank').length,preservedExistingBankSelections:banks.filter(b=>b.chosen.kind==='existing_prepared_bank').length,contextualBankSelections:banks.filter(b=>b.chosen.kind==='contextual_draft_bank').length,refinedBanks:refinements.summary.refinedBanks,refinedQuestionBands:refinements.summary.refinedQuestionBands,explicitOwnershipAndBankHolds:held.length,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.length-selected.length-previousDirect.identityGroups.length,pendingPhraseSpans:composition.phrases.length};
 return {version:1,workId:graph.workId,status:'offline_direct_draft_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,policy:'Only 103 named direct word groups are materialized against the unchanged baseline. Explicit owner corrections and the noun être/êtres same-sense join are named in the ledger; all legacy records and mastery remain untouched. Competing Earth banks are both retained; chapter01 is explicitly selected. Full constructions remain separately indexed holds until their prepared expression package. No learner-state write, runtime AI, bulk encounter or release approval.',resolvedOwnerDecisions,preservedCompetingBanks:selected.filter(g=>g.banks.length>1).map(g=>({surface:g.surface,selected:g.banks[0],alternates:g.banks.slice(1),reason:'The chapter01 Earth bank tests the planet meaning without a capitalized proper-name-only frame. Retain the later chapter05 bank as evidence, with no duplicate mastery slot.'})),newLemmas:[...newLemmas.values()],newSenses:[...newSenses.values()],newSurfaceForms:[...newSurfaces.values()],identityGroups,occurrenceBindings,bankDependencies,banks,heldGroups:held,remainingDirectDraftOccurrences:remaining,summary};
}
