import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {composeMicromegasReviewedWordBanks} from './micromegas-reviewed-word-banks.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const id=(prefix,seed)=>`${prefix}_micromegas_${sha(seed).slice(0,16)}`;
const coord=o=>`${o.unit}:${o.start}:${o.end}`;

import {resolvedWordDefinitions} from './micromegas-resolved-word-package.mjs';
import {continuationWordDefinitions} from './micromegas-continuation-word-package.mjs';
import {directWordDefinitions} from './micromegas-direct-word-package.mjs';
export const reviewedFamilyWordHolds={273:'Full jusqu’à présent expression.',300:'Full Pour moi standpoint expression.',326:'Full Par exemple illustrative expression.',361:'Full tire sur color construction.',362:'Full tire sur color construction.'};
export const reviewedFamilyOwnerDecisions={
 "va": {
  "existingSenseId": "sns_fr_aller_extent",
  "partOfSpeech": "verb",
  "reason": "Full aller family and all63 current/historical questions plus54 indexed uses reviewed. Figurative extent is the retained meaning; stage a generic definition without changing any old record or mastery."
 },
 "arrive": {
  "existingSenseId": "sns_fr_arriver_happen",
  "partOfSpeech": "verb",
  "reason": "Death and what occurs are events, not destinations. Review all21 questions and12 indexed arriver uses; bind the retained happen meaning."
 },
 "nouvelles": {
  "lemmaId": "lem_parure_nouvelle_noun_2c5e3b64b5",
  "partOfSpeech": "noun",
  "reason": "The published literary definition conflicts with its news gloss. Preserve that exact record and its three questions; prepare a fresh reports meaning under the retained proper noun head."
 },
 "s’écria": {
  "lemmaId": "lem_parure_ecrier_verb_97ae4328ce",
  "partOfSpeech": "verb",
  "reason": "Explicit pronominal exclamation meaning under retained écrier, separated from the legacy metal-cleaning definition and conflicting exclaim gloss. Preserve old bank and mastery."
 },
 "espèce": {
  "headword": "espèce",
  "partOfSpeech": "noun",
  "reason": "Approximate sort in three source comparisons. Separate human biological species in units135/173."
 },
 "espece_species": {
  "headword": "espèce",
  "partOfSpeech": "noun",
  "reason": "Fresh biological-species meaning for the two explicitly named human-kind occurrences, under the same proper noun head."
 },
 "blanc": {
  "headword": "blanc",
  "partOfSpeech": "noun",
  "reason": "White color in unit55 is a noun, separated from the blank adjective in unit215."
 },
 "blanc_blank": {
  "headword": "blanc",
  "partOfSpeech": "adjective",
  "reason": "The final book contains no writing. A fresh blank meaning belongs under a proper adjective head, separate from the color noun."
 },
 "créateur": {
  "printedForm": "Créateur",
  "reason": "Preserve the printed capital for the lexical Creator noun; it remains a vocabulary identity rather than an excluded personal name."
 },
 "providence": {
  "printedForm": "Providence",
  "reason": "Preserve the source capital for the lexical divine-ordering noun."
 },
 "brune": {
  "headword": "brun",
  "partOfSpeech": "noun",
  "reason": "Explicit same-sense singular join to package49 brunes. Retain exact staged meaning; separate surface, no number-only meaning."
 },
 "plat": {
  "headword": "plat",
  "partOfSpeech": "adjective",
  "reason": "Flat surface requires a proper adjective head; preserve the published dish noun and all its progress."
 },
 "dernière": {
  "lemmaId": "lem_zola_dernier",
  "partOfSpeech": "adjective",
  "reason": "Final moon in an ordered spatial series, distinct from the already staged most-recent temporal meaning; no gender-only sense."
 },
 "étendue": {
  "reason": "Keep the spatially extended adjective and the noun étendue as distinct grammatical heads."
 },
 "étendus": {
  "reason": "Explicit same-root philosophical extension meaning as adjective étendue; no number or gender-only sense."
 },
 "couleurs": {
  "reason": "Explicit same-root plural of couleur; number changes the surface, not the meaning."
 },
 "différent": {
  "reason": "Explicit same-root distinct meaning already prepared for différents in49. Retain both alternative source banks, select the earliest generic one."
 },
 "différentes": {
  "reason": "Explicit same-root distinct meaning from49; no gender-only sense."
 },
 "révolution": {
  "reason": "Explicit same-root singular orbital cycle already prepared as révolutions in49."
 },
 "comptez": {
  "reason": "Counting properties and calculating measured angular/distance quantities share quantitative reckoning. Full retained compter bank and indexed passage reviewed; stage generic definition, preserve all old questions and mastery."
 },
 "comptons": {
  "reason": "Retain the same quantitative reckoning meaning and bank source revision."
 },
 "comptait": {
  "reason": "Retain the same quantitative reckoning meaning with a separate past surface."
 },
 "été": {
  "reason": "All24 retained presence questions and16 indexed passages reviewed. Both selected Micromégas uses locate a person or head in space. Select generic presence bank and preserve the other source bank."
 },
 "lesquelles": {
  "reason": "Retain the proper relatif/interrogative lequel owner. Translate only the highlighted pronoun; all middle choices are feminine plural pronouns in a quoted-label frame."
 },
 "beaux": {
  "reason": "Retained beau meaning which pleases by its qualities includes remarkable secrets; six current/historical questions and indexed ironic-result use reviewed."
 }
};
export const reviewedFamilyWordDefinitions={
 "espece_kind_of": "Sorte ou catégorie approximative, dans une comparaison indiquant une ressemblance.",
 "espece_species": "Catégorie d’êtres vivants partageant des caractères communs ; notamment l’espèce humaine.",
 "nouvelles_reports": "Information ou récit reçu au sujet d’une personne, d’un lieu ou d’un événement.",
 "ecria_exclaimed": "Dans s’écrier, prononcer des paroles sous forme d’exclamation.",
 "blanc_blank": "Qui ne porte aucune écriture ni impression, en parlant d’une page ou d’un livre.",
 "derniere_final_in_sequence": "Qui vient à la fin d’une série ordonnée, après tous les autres éléments.",
 "matiere_physical_substance": "Substance physique dont sont constitués les corps.",
 "etendue_extended_adjective": "Qui occupe une portion de l’espace, dans l’emploi philosophique.",
 "proprietes_attributes": "Caractéristique propre à une chose, ici à la matière.",
 "diverses_varied": "Qui présente des formes ou des caractéristiques variées.",
 "etendue_spatial_extension_noun": "Propriété d’un corps qui occupe une portion de l’espace.",
 "impenetrabilite_resistance_to_overlap": "Propriété par laquelle deux corps matériels ne peuvent occuper exactement la même place.",
 "mobilite_capacity_to_move": "Capacité de changer de place ou de se déplacer.",
 "divisibilite_capacity_to_divide": "Possibilité d’être séparé en plusieurs parties.",
 "apparemment_apparently": "D’après ce que l’on peut observer ou supposer, sans certitude absolue.",
 "vues_purposes": "Intention ou projet que l’on souhaite réaliser.",
 "createur_creator": "Celui qui produit ce qui n’existait pas ; avec une majuscule, Dieu comme auteur du monde.",
 "habitation_dwelling_place": "Lieu où l’on habite et où l’on vit.",
 "sagesse_wisdom": "Qualité d’un jugement et d’une conduite fondés sur le discernement et la prudence.",
 "sensations_sensory_experiences": "Impression perçue par l’un des sens.",
 "providence_divine_care": "Puissance divine conçue comme veillant sur l’ordre du monde et sur les êtres.",
 "couleur_hue": "Teinte perçue par la vue, comme le rouge ou le bleu.",
 "blanc_white_hue": "Couleur claire semblable à celle de la neige.",
 "jaunatre_yellowish": "Dont la couleur se rapproche du jaune.",
 "divisons_we_divide": "Séparer un tout en plusieurs parties.",
 "contient_contains": "Renfermer quelque chose à l’intérieur ou parmi ses éléments.",
 "trente_neuf_thirty_nine": "Nombre égal à trente plus neuf.",
 "primitives_primary": "Qui est présenté comme premier ou fondamental, ici dans un système de couleurs.",
 "parmi_among": "Au sein d’un ensemble ou d’un groupe.",
 "questions_inquiries": "Parole ou demande destinée à obtenir une information.",
 "informa_inquired": "Dans s’informer, chercher ou demander des renseignements.",
 "substances_basic_realities": "Réalité ou entité qui existe par elle-même, corporelle ou incorporelle, dans le vocabulaire philosophique.",
 "essentiellement_by_essential_nature": "Par la nature fondamentale d’une chose.",
 "trentaine_about_thirty": "Ensemble ou quantité d’environ trente unités.",
 "espace_space": "Étendue dans laquelle les corps peuvent être situés.",
 "penetrent_interpenetrate": "Dans se pénétrer, entrer l’un dans l’autre ou se traverser mutuellement.",
 "prodigieusement_enormously": "À un degré extraordinairement élevé.",
 "resolurent_decided": "Prendre une décision après réflexion.",
 "ensemble_together": "Les uns avec les autres, en compagnie ou en liaison.",
 "philosophique_philosophical": "Qui concerne la réflexion sur les questions fondamentales de la connaissance ou de l’existence.",
 "embarquer_to_embark": "Dans s’embarquer, monter à bord ou entreprendre un voyage.",
 "atmosphere_atmosphere": "Enveloppe gazeuse qui entoure une planète.",
 "provision_supply": "Réserve de choses préparée pour un besoin, notamment pour un voyage.",
 "instruments_instruments": "Outil ou appareil servant à effectuer une opération, ici une mesure scientifique.",
 "mathematiques_mathematical": "Qui concerne les nombres, les calculs ou les relations géométriques.",
 "maitresse_mistress": "Femme avec laquelle une personne entretient une relation amoureuse.",
 "remontrances_reproaches": "Reproche adressé à quelqu’un pour critiquer sa conduite.",
 "reparait_made_up_for": "Compenser un défaut ou un désavantage par une autre qualité.",
 "agrements_charms": "Qualité qui rend une personne agréable et attirante.",
 "resiste_resisted": "Ne pas céder à une demande, une sollicitation ou une pression.",
 "rendre_to_yield": "Dans se rendre, cesser de résister et céder.",
 "geant_giant": "Être vivant d’une taille extraordinairement grande.",
 "curieux_curious_person": "Personne qui désire voir, découvrir ou connaître des choses nouvelles.",
 "amour_love": "Sentiment d’attachement affectif ou amoureux envers une personne.",
 "fidele_faithful": "Qui reste attaché à une personne ou à un engagement sans les abandonner.",
 "moins_less": "Indique une quantité, un degré ou une intensité inférieurs.",
 "errantes_wandering": "Qui se déplace ou erre sans rester fixe.",
 "pamee_fainted": "Dans se pâmer, perdre momentanément connaissance.",
 "consoler_to_console_oneself": "Dans se consoler, trouver un apaisement à sa peine.",
 "petit_maitre_fashionable_young_gallant": "Homme élégant et affecté qui se donne de l’importance, notamment auprès des femmes.",
 "plat_flat": "Qui présente une surface sans relief ou dont la forme est aplatie.",
 "elancerent_sprang_forward": "Dans s’élancer, se porter vivement en avant, notamment par un bond.",
 "domestiques_servants": "Personne employée au service d’une maison ou d’une autre personne.",
 "rencontrerent_encountered": "Se trouver en présence de quelqu’un ou de quelque chose sur son chemin.",
 "satellites_natural_satellites": "Corps céleste naturel qui tourne autour d’une planète.",
 "actuellement_at_present": "Au moment présent, à l’époque dont on parle."
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

/** Bind the reviewed source families and explicit meaning splits without changing publication or mastery. */
export function composeMicromegasReviewedFamilyWords(folder){
 const evidence={},cache=new Map();
 const ensure=(ok,msg)=>{if(!ok)throw Error(`Micromégas reviewed family package51: ${msg}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const pointer=e=>e.selector.split('/').slice(1).reduce((v,k)=>v[k],read(e.file));
 const graph=read('whole-work-identity-dependencies-43.json'),composition=read('whole-work-import-composition-42.json'),previousWords=read('whole-work-reviewed-word-bindings-44.json'),previousBanks=read('whole-work-reviewed-word-banks-45.json');
 const previousContinuation=read('whole-work-continuation-word-package-49.json'),previousConstructions=read('whole-work-construction-expressions-50.json');
 const previousDirect=read('whole-work-direct-word-package-46.json'),previousResolved=read('whole-work-resolved-word-package-47.json'),previousExpressions=read('whole-work-resolved-expressions-48.json'),refinements=read('whole-work-family-bank-refinements-51.json'),routes=read('whole-work-family-owner-routes-51.json');
 const p=loadPublication();ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged publication baseline');
 const declarations=new Map([...graph.declarations,...routes.declarations].map(d=>[d.declaration,d]));
 const excluded=new Map(Object.entries(reviewedFamilyWordHolds).map(([i,reason])=>[Number(i),reason]));
 const cleared=new Set([251,274,298,317,324]);
 const selected=graph.directDraftBankGroups.filter((g,i)=>cleared.has(i)||(i>=331&&i<=436&&!excluded.has(i))).map(g=>structuredClone(g));
 const find=f=>selected.find(g=>g.surface===f), root=i=>structuredClone(graph.directDraftBankGroups[i].root);
 for(const [form,index] of [['couleurs',353],['étendus',332]])find(form).root=root(index);
 // The explicit alias targets are asserted by declaration below; indices are never semantic authority.
 for(const [f,d] of [['différent','chapter-02-identity-plan.json:differents_distinct'],['différentes','chapter-02-identity-plan.json:differents_distinct'],['révolution','chapter-02-identity-plan.json:revolutions_orbital_cycles'],['brune','chapter-02-identity-plan.json:brunes_dark_haired_women']])find(f).root=structuredClone(graph.declarations.find(x=>x.declaration===d).root);
 for(const f of ['nouvelles','s’écria','dernière'])find(f).root=structuredClone(routes.declarations.find(d=>d.form===f).root);
 for(const [f,route,units] of [['espèce','espece_species',[135,173]],['blanc','blanc_blank',[215]]]){
  const g=find(f),occurrences=g.occurrences.filter(o=>units.includes(o.unit));g.occurrences=g.occurrences.filter(o=>!units.includes(o.unit));
  const d=routes.declarations.find(d=>d.form===route);selected.push({...structuredClone(g),route,occurrences,sourceBanks:g.banks,root:d.root,banks:[d.bank]});
 }
 ensure(selected.length===111,'exact109 source groups plus two semantic splits');
 const held=graph.directDraftBankGroups.map((g,i)=>({g,i})).filter(({i})=>excluded.has(i)).map(({g,i})=>({index:i,surface:g.surface,root:g.root,banks:g.banks,occurrences:g.occurrences,reason:excluded.get(i)}));
 const lemmas=new Map(p.bundle.lemmas.map(l=>[l.id,l])),senses=new Map(p.bundle.senses.map(s=>[s.id,s])),surfaces=new Map(p.bundle.surfaceForms.map(s=>[s.id,s]));
 for(const[k,m]of[['newLemmas',lemmas],['newSenses',senses],['newSurfaceForms',surfaces]])for(const e of [...previousWords[k],...previousDirect[k],...previousResolved[k],...previousContinuation[k]]){ensure(!m.has(e.record.id),'prior staged record collision');m.set(e.record.id,e.record);}
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
  const override=reviewedFamilyOwnerDecisions[form];if(override?.existingSenseId){ensure(senses.has(override.existingSenseId),'explicit existing meaning');return override.existingSenseId;}
  
  if(root.kind==='published_sense'){ensure(senses.has(root.senseId),'existing sense retained');return root.senseId;}
  const stagedId=id('sns',`direct-draft:${root.declaration}`);if(senses.has(stagedId))return stagedId;
  const d=declarations.get(root.declaration),bank=pointer({file:d.bank.file,selector:d.bank.selector}),key=root.declaration.split(':')[1],definition=reviewedFamilyWordDefinitions[key]??continuationWordDefinitions[key]??resolvedWordDefinitions[key]??directWordDefinitions[key];
  ensure(definition,`explicit French definition required: ${key}`);const ownerOverride=reviewedFamilyOwnerDecisions[form];
  let lemmaId;if(ownerOverride?.lemmaId){lemmaId=ownerOverride.lemmaId;ensure(lemmas.has(lemmaId),'explicit retained proper head');}else if(ownerOverride?.headword){const record={id:id('lem',`${ownerOverride.headword}:${ownerOverride.partOfSpeech}`),headword:ownerOverride.headword,partOfSpeech:ownerOverride.partOfSpeech};lemmaId=record.id;ensure(!p.bundle.lemmas.some(l=>l.headword===record.headword&&l.partOfSpeech===record.partOfSpeech),'new proper head absent in publication');if(!lemmas.has(lemmaId)&&!newLemmas.has(lemmaId))newLemmas.set(lemmaId,{record,evidence:d.evidence,declaredLemmaRoot:root.declaration,ownerDecision:ownerOverride});}else lemmaId=materializeLemma(root);
  const senseId=id('sns',`direct-draft:${root.declaration}`);
  ensure(lemmaRecord(lemmaId).partOfSpeech===(reviewedFamilyOwnerDecisions[form]?.partOfSpeech??category(bank.partOfSpeech)),`proper lexical owner ${key}`);
  const record={id:senseId,lemmaId,gloss:ownerOverride?.gloss??bank.meaning,definition};
  if(senses.has(senseId)){ensure(hash(senses.get(senseId))===hash(record),'reuse exact previously staged root');return senseId;}
  if(newSenses.has(senseId))ensure(hash(newSenses.get(senseId).record)===hash(record),'same declared sense exact metadata');else newSenses.set(senseId,{record,evidence:d.evidence,declaredSenseRoot:root.declaration,definitionAuthority:{file:'scripts/micromegas-reviewed-family-words.mjs',key}});
  return senseId;
 };
 const occurrenceBindings=[],identityGroups=[],bankDependencies=[];
 for(const g of selected){
  ensure(g.banks.length===1||['été','espèce','différent'].includes(g.surface),'only explicitly resolved competing bank');
  const senseId=senseIdFor(g.root,g.route??g.surface),sense=senses.get(senseId)??newSenses.get(senseId).record,lemmaId=sense.lemmaId,bank=pointer({file:g.banks[0].file,selector:g.banks[0].selector});
  ensure(lemmaRecord(lemmaId).partOfSpeech===(reviewedFamilyOwnerDecisions[g.route??g.surface]?.partOfSpeech??category(bank.partOfSpeech)),`source category agrees with proper owner ${g.surface}`);
  const matches=[...surfaces.values(),...[...newSurfaces.values()].map(e=>e.record)].filter(s=>s.lemmaId===lemmaId&&s.normalized===g.surface);
  const hasQuiz=s=>[...p.preparedQuizzes.values()].some(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===s.id&&q.subject.senseId===senseId);
  const active=matches.filter(hasQuiz);ensure(active.length<=1&&((active.length===1)||matches.length<=1),`explicit surface selection required ${g.surface}`);
  let surface=active[0]??matches[0];if(!surface){const surfaceId=id('srf',`${lemmaId}:${g.surface}`);surface={id:surfaceId,lemmaId,form:reviewedFamilyOwnerDecisions[g.route??g.surface]?.printedForm??g.surface,normalized:g.surface};newSurfaces.set(surfaceId,{record:surface,evidence:{file:g.banks[0].file,selector:g.banks[0].selector}});}
  const identity=`${surface.id}:${senseId}`,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';
  ensure(!identityGroups.some(x=>x.identity===identity),'distinct declared surface-and-sense groups');
  identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root,ownerDecision:reviewedFamilyOwnerDecisions[g.route??g.surface]??null});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(t?.owner.kind==='draft_bank'&&(g.sourceBanks??g.banks).some(b=>t.owner.file===b.file&&t.owner.key===b.key)&&t.form===g.surface&&t.text===o.text,'exact current draft source owner');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:t.owner.file,selector:(g.sourceBanks??g.banks).find(b=>b.file===t.owner.file&&b.key===t.owner.key).selector}});}
  ensure(hash(bank.questions)===g.banks[0].questionSha256,'exact chapter bank revision');
  const candidates=[{kind:'contextual_draft_bank',evidence:{file:g.banks[0].file,selector:g.banks[0].selector},key:g.banks[0].key,questionSha256:g.banks[0].questionSha256,reviewedOverlay:composition.bankBindings.find(b=>b.file===g.banks[0].file&&b.key===g.banks[0].key&&b.beforeQuestionSha256!==b.afterQuestionSha256)??null}];
  const refined=refinements.items.find(r=>r.file===g.banks[0].file&&r.key===g.banks[0].key);
  if(refined){ensure(!candidates[0].reviewedOverlay||candidates[0].reviewedOverlay.beforeQuestionSha256===candidates[0].reviewedOverlay.afterQuestionSha256,'only explicit metadata-only predecessor overlay may precede refinement');ensure(hash(bank.questions)===refined.beforeQuestionSha256&&hash(refined.after.questions)===refined.afterQuestionSha256,'exact named direct refinement');candidates[0].reviewedOverlay={evidence:{file:'whole-work-family-bank-refinements-51.json',selector:`/items/${refinements.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};}
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);
  if(existing.length){ensure(existing.length===3,'complete retained historical bank');candidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const b of g.banks.slice(1)){ensure(hash(pointer({file:b.file,selector:b.selector}).questions)===b.questionSha256,'exact unselected alternate bank');candidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256});}
  bankDependencies.push({identity,candidates,status:'explicit_single_draft_or_existing_bank_selection'});
 }
 const prior=new Map([...previousBanks.banks,...previousDirect.banks,...previousResolved.banks,...previousContinuation.banks].map(b=>[b.identity,b]));
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!prior.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]};
 const prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{
  const previous=prior.get(g.identity);if(!previous)return prepared.banks.find(b=>b.identity===g.identity);
  const file=previousBanks.banks.includes(previous)?'whole-work-reviewed-word-banks-45.json':previousDirect.banks.includes(previous)?'whole-work-direct-word-package-46.json':previousResolved.banks.includes(previous)?'whole-work-resolved-word-package-47.json':'whole-work-continuation-word-package-49.json';
  const sourceBank=file.includes('45')?previousBanks.banks:file.includes('46')?previousDirect.banks:file.includes('47')?previousResolved.banks:previousContinuation.banks;
  return {...previous,chosen:{kind:'previously_bound_candidate_bank',evidence:{file,selector:`/banks/${sourceBank.indexOf(previous)}`},questionSha256:previous.questionSha256},selectionReason:'Retain the exact previously bound Surface+Sense bank; add these separately indexed draft source uses.',alternateCandidates:bankDependencies.find(d=>d.identity===g.identity).candidates,masteryAction:g.masteryAction};
 });
 ensure(banks.length===111&&banks.every(b=>b?.questions.length===3),'complete exact canonical banks');
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'source use bound once');
 const remaining=previousConstructions.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o)));
 const remainingGroups=graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>remaining.some(r=>coord(r)===coord(o)))).length;
 const summary={boundDirectDraftSourceUses:occurrenceBindings.length,boundDirectDraftIdentityGroups:identityGroups.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:newLemmas.size,newSenses:newSenses.size,newSurfaceForms:newSurfaces.size,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,freshIdentityGroups:identityGroups.filter(g=>g.masteryAction==='fresh_identity_on_exact_unit_view').length,preservedPriorCanonicalBanks:banks.filter(b=>b.chosen.kind==='previously_bound_candidate_bank').length,preservedExistingBankSelections:banks.filter(b=>b.chosen.kind==='existing_prepared_bank').length,contextualBankSelections:banks.filter(b=>b.chosen.kind==='contextual_draft_bank').length,refinedBanks:refinements.summary.refinedBanks,refinedQuestionBands:refinements.summary.refinedQuestionBands,explicitOwnershipAndBankHolds:held.length,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:remainingGroups,pendingPhraseSpans:composition.phrases.length};
 const senseChanges=routes.senseChanges;for(const c of senseChanges)ensure(hash(senses.get(c.before.id))===c.beforeSha256&&hash(c.after)===c.afterSha256,'exact retained sense metadata revision');
 return {senseChanges,version:1,workId:graph.workId,status:'offline_direct_draft_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,policy:'Prepare111 exact word identities. Explicitly separate espèce species and approximate sort, and blanc color noun and blank adjective; retain proper nouvelle/écrier heads with fresh reports/exclamation meanings. Retain all published records and prior banks. Exact sense metadata changes are staged separately after full impact review. Variants explicitly share meaning roots. Fresh keys start on exact unit view only. Offline, unapplied, no release approval or deployment.',reviewedFamilyOwnerDecisions,preservedCompetingBanks:selected.filter(g=>g.banks.length>1).map(g=>({surface:g.surface,selected:g.banks[0],alternates:g.banks.slice(1),reason:'Explicitly select the earliest generic source bank for this declared meaning; preserve every alternate source revision without a duplicate mastery slot.'})),newLemmas:[...newLemmas.values()],newSenses:[...newSenses.values()],newSurfaceForms:[...newSurfaces.values()],identityGroups,occurrenceBindings,bankDependencies,banks,heldGroups:held,remainingDirectDraftOccurrences:remaining,summary};
}
