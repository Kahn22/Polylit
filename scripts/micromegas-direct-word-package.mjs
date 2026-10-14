import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadPublication} from './micromegas-publication-baseline.mjs';
import {composeMicromegasReviewedWordBanks} from './micromegas-reviewed-word-banks.mjs';

const sha=x=>createHash('sha256').update(x).digest('hex');
const hash=x=>sha(JSON.stringify(x));
const id=(prefix,seed)=>`${prefix}_micromegas_${sha(seed).slice(0,16)}`;
const coord=o=>`${o.unit}:${o.start}:${o.end}`;

// Explicit editorial holds, not an automatic POS conversion or sense merge.
export const directWordHolds={
 haut:'Bind the historical de haut construction to its proper grammatical owner after examining all three existing haut heads.',
 pas:'Choose the proper noun owner for historical paces from the two legacy pas heads; retain both records.',
 public:'The chapter route points at an adjective lemma, but the source le public is a noun. Review the existing noun family before reassigning.',
 'sur-le-champ':'Resolve the complete adverbial locution as a stored expression or an explicitly retained attached word identity before import.',
 terre:'Choose one canonical bank explicitly after comparing both Earth banks; retain both source records.',
 'êtres':'The chapter route points at the être verb lemma, but the source les êtres is a noun. Review proper noun owners before binding.',
 'très-jolie':'Resolve the historical hyphenated degree modifier under a proper joli adjective head without inventing a très-joli lexical head.',
 sirien:'Keep the fictional demonym distinct from excluded proper names and validate the proper noun head and capitalization.',
 jouant:'Resolve the full en se jouant construction before binding its verb component to a separate effortless-action meaning.',
 depuis:'The chapter route points at a preposition head, but this standalone historical use is an adverb. Review that owner explicitly.',
 sortir:'Resolve the nominalized au sortir de construction and full-phrase boundary before applying the chapter verb route.',
 'dérobent':'Use a proper dérober verb head for se dérober and review the reflexive escape meaning; do not create a se dérober head automatically.',
 affaires:'Choose the proper existing affaire noun owner after examining both retained legacy heads.',
};

// French definitions describe lexical meanings, never tense, gender or person.
// Keys name the already declared chapter sense roots; distinct keys stay distinct.
export const directWordDefinitions={
 planete_world:'Corps céleste qui décrit une orbite autour d’une étoile.',
 tournent_orbit:'Se déplacer sur une orbite autour d’un astre.',
 etoiles_stars:'Astre qui produit sa propre lumière.',
 honneur_privilege:'Privilège ou distinction dont une personne se sent honorée.',
 dernier_most_recent:'Le plus récent dans une succession.',
 voyage_journey:'Déplacement d’un lieu à un autre, généralement éloigné.',
 fourmilière_anthill:'Habitation d’une colonie de fourmis.',
 nom_appellation:'Mot qui sert à désigner une personne ou une chose.',
 convient_suits:'Être approprié à une personne, une chose ou une situation.',
 huit_eight:'Nombre entier qui suit sept et précède neuf.',
 lieues_distance:'Ancienne unité de longueur appelée lieue.',
 vingt_quatre_twenty_four:'Nombre entier égal à vingt plus quatre.',
 geometriques_measured_paces:'Se dit des pas employés comme mesure fixe de longueur dans l’ancien système décrit.',
 chacun_each:'Chaque personne ou chaque élément d’un ensemble, considéré séparément.',
 géomètres_geometry:'Spécialiste de la géométrie.',
 utiles_helpful:'Qui rend service ou apporte une aide.',
 plume_writing_quill:'Instrument d’écriture formé d’une plume taillée et utilisé avec de l’encre.',
 habitant_resident:'Personne qui réside dans un lieu.',
 tete_body_head:'Partie du corps qui porte notamment le visage et le cerveau.',
 citoyens_inhabitants:'Membre d’une communauté politique.',
 globe_planet:'Corps sphérique constituant un monde ou une planète.',
 neuf_nine:'Nombre entier qui suit huit et précède dix.',
 tour_circumference:'Longueur du contour d’une chose.',
 absolument_necessarily:'D’une manière indispensable, sans réserve.',
 produit_origin:'Faire naître ou donner naissance à un être.',
 vingt_un_twenty_one:'Nombre entier égal à vingt plus un.',
 millions_number:'Nombre égal à mille milliers.',
 fois_multiplier:'Mot qui indique le nombre par lequel une quantité est multipliée.',
 circonférence_perimeter:'Longueur du contour d’un cercle ou d’un corps arrondi.',
 nature_world:'Ensemble du monde naturel et de ses êtres.',
 etats_territories:'Territoire et communauté soumis à une autorité politique.',
 souverains_rulers:'Personne qui détient l’autorité suprême dans un État.',
 demi_heure_half_hour:'Durée de trente minutes.',
 compares_placed_side_by_side:'Examiner plusieurs choses ensemble pour en apprécier les ressemblances ou les différences.',
 empire_large_realm:'Vaste ensemble de territoires gouverné par un empereur ou une autorité souveraine.',
 faible_weak:'Qui représente insuffisamment la réalité ou la force de ce qu’il évoque.',
 image_representation:'Représentation qui évoque une chose ou une idée.',
 differences_distinctions:'Caractère par lequel des choses ou des êtres se distinguent.',
 taille_stature:'Hauteur du corps d’une personne ou d’un être.',
 excellence_title:'Titre honorifique donné à certains hauts dignitaires.',
 hauteur_height:'Dimension verticale mesurée de la base au sommet.',
 sculpteurs_artists:'Artiste qui façonne des œuvres en relief dans une matière.',
 peintres_painters:'Artiste qui réalise des œuvres avec de la peinture.',
 ceinture_waist_belt:'Bande portée autour de la taille.',
 cinquante_fifty:'Nombre entier égal à cinq dizaines.',
 proportion_ratio:'Rapport de grandeur entre plusieurs parties ou quantités.',
 nez_nose:'Organe du visage qui sert notamment à sentir les odeurs.',
 tiers_third:'Une des trois parts égales d’un tout.',
 septieme_seventh:'Qui représente une des sept parts égales d’un tout.',
 corps_physical:'Ensemble physique d’un être vivant.',
 trente_trois_thirty_three:'Nombre entier égal à trente plus trois.',
 fraction_part:'Partie numérique d’une unité, exprimée par un rapport de nombres.',
 cultives_educated:'Qui a développé ses connaissances et sa culture.',
 quelques_unes_some_of_them:'Un nombre indéterminé d’éléments d’un ensemble, sans en désigner la totalité.',
 selon_according_to:'Conformément à une règle, un usage ou une indication.',
 coutume_custom:'Usage collectif transmis et pratiqué depuis longtemps.',
 college_school:'Établissement dans lequel des élèves reçoivent un enseignement.',
 celebre_famous:'Qui est largement connu et jouit d’une renommée.',
 propositions_mathematical:'Énoncé mathématique dont on peut établir la vérité par une démonstration.',
 trente_deux_thirty_two:'Nombre entier égal à trente plus deux.',
 metaphysicien_philosopher:'Philosophe qui étudie les principes de l’être et de la réalité.',
 vers_approximately_age:'Indique une approximation de temps ou d’âge.',
 enfance_childhood:'Première période de la vie, pendant laquelle une personne est enfant.',
 dissequa_anatomical:'Ouvrir et séparer les parties d’un corps pour en étudier l’organisation.',
 insectes_insects:'Petit animal arthropode qui possède six pattes à l’âge adulte.',
 diamètre_width:'Segment qui passe par le centre d’un cercle et en relie deux points opposés.',
 microscopes_optical:'Instrument optique permettant d’observer des objets très petits.',
 composa_wrote_book:'Créer une œuvre écrite en en organisant les éléments.',
 curieux_intriguing_book:'Qui éveille l’intérêt par son caractère singulier ou inattendu.',
 muphti_mufti:'Spécialiste du droit religieux musulman qui rend des avis juridiques.',
 vetillard_petifogging:'Qui cherche querelle sur des détails insignifiants.',
 ignorant_unlearned:'Qui manque de connaissances.',
 propositions_assertions:'Énoncé qui affirme une idée susceptible d’être discutée.',
 suspectes_dubious:'Qui inspire la méfiance ou paraît douteux.',
 malsonnantes_doctrinal_offense:'Qui paraît choquer la doctrine religieuse admise.',
 temeraires_doctrinal_reckless:'Qui paraît d’une audace imprudente au regard de la doctrine admise.',
 heretiques_against_doctrine:'Qui est jugé contraire à la doctrine religieuse reconnue.',
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
export function composeMicromegasDirectWordPackage(folder){
 const evidence={},cache=new Map();
 const ensure=(ok,msg)=>{if(!ok)throw Error(`Micromégas direct package46: ${msg}`);};
 const read=file=>{if(!cache.has(file)){const bytes=readFileSync(`${folder}/${file}`);evidence[file]=sha(bytes);cache.set(file,JSON.parse(bytes));}return cache.get(file);};
 const pointer=e=>e.selector.split('/').slice(1).reduce((v,k)=>v[k],read(e.file));
 const graph=read('whole-work-identity-dependencies-43.json'),composition=read('whole-work-import-composition-42.json'),previousWords=read('whole-work-reviewed-word-bindings-44.json'),previousBanks=read('whole-work-reviewed-word-banks-45.json');
 const refinements=read('whole-work-direct-bank-refinements-46.json');
 const p=loadPublication();ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged publication baseline');
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d]));
 const selected=graph.directDraftBankGroups.slice(0,113).filter(g=>!Object.hasOwn(directWordHolds,g.surface));
 ensure(selected.length===100&&selected[0].surface==='planètes'&&selected.at(-1).surface==='hérétiques','exact named source-order package');
 const held=graph.directDraftBankGroups.slice(0,113).filter(g=>Object.hasOwn(directWordHolds,g.surface)).map(g=>({surface:g.surface,root:g.root,banks:g.banks,occurrences:g.occurrences,reason:directWordHolds[g.surface]}));
 ensure(held.length===13,'all named holds retained');
 const lemmas=new Map(p.bundle.lemmas.map(l=>[l.id,l])),senses=new Map(p.bundle.senses.map(s=>[s.id,s])),surfaces=new Map(p.bundle.surfaceForms.map(s=>[s.id,s]));
 for(const[k,m]of[['newLemmas',lemmas],['newSenses',senses],['newSurfaceForms',surfaces]])for(const e of previousWords[k]){ensure(!m.has(e.record.id),'prior staged record collision');m.set(e.record.id,e.record);}
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
 const senseIdFor=root=>{
  if(root.kind==='published_sense'){ensure(senses.has(root.senseId),'existing sense retained');return root.senseId;}
  const d=declarations.get(root.declaration),bank=pointer({file:d.bank.file,selector:d.bank.selector}),key=root.declaration.split(':')[1],definition=directWordDefinitions[key];
  ensure(definition,`explicit French definition required: ${key}`);const lemmaId=materializeLemma(root),senseId=id('sns',`direct-draft:${root.declaration}`);
  ensure(lemmaRecord(lemmaId).partOfSpeech===category(bank.partOfSpeech),`proper lexical owner ${key}`);
  const record={id:senseId,lemmaId,gloss:bank.meaning,definition};
  if(newSenses.has(senseId))ensure(hash(newSenses.get(senseId).record)===hash(record),'same declared sense exact metadata');else newSenses.set(senseId,{record,evidence:d.evidence,declaredSenseRoot:root.declaration,definitionAuthority:{file:'scripts/micromegas-direct-word-package.mjs',key}});
  return senseId;
 };
 const occurrenceBindings=[],identityGroups=[],bankDependencies=[];
 for(const g of selected){
  ensure(g.banks.length===1,'no automatic choice between competing banks');
  const senseId=senseIdFor(g.root),sense=senses.get(senseId)??newSenses.get(senseId).record,lemmaId=sense.lemmaId,bank=pointer({file:g.banks[0].file,selector:g.banks[0].selector});
  ensure(lemmaRecord(lemmaId).partOfSpeech===category(bank.partOfSpeech),`source category agrees with proper owner ${g.surface}`);
  const matches=[...surfaces.values(),...[...newSurfaces.values()].map(e=>e.record)].filter(s=>s.lemmaId===lemmaId&&s.normalized===g.surface);
  const hasQuiz=s=>[...p.preparedQuizzes.values()].some(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===s.id&&q.subject.senseId===senseId);
  const active=matches.filter(hasQuiz);ensure(active.length<=1&&((active.length===1)||matches.length<=1),`explicit surface selection required ${g.surface}`);
  let surface=active[0]??matches[0];if(!surface){const surfaceId=id('srf',`${lemmaId}:${g.surface}`);surface={id:surfaceId,lemmaId,form:g.surface,normalized:g.surface};newSurfaces.set(surfaceId,{record:surface,evidence:{file:g.banks[0].file,selector:g.banks[0].selector}});}
  const identity=`${surface.id}:${senseId}`,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';
  ensure(!identityGroups.some(x=>x.identity===identity),'distinct declared surface-and-sense groups');
  identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(t?.owner.kind==='draft_bank'&&t.owner.file===g.banks[0].file&&t.owner.key===g.banks[0].key&&t.form===g.surface&&t.text===o.text,'exact current draft source owner');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:g.banks[0].file,selector:g.banks[0].selector}});}
  ensure(hash(bank.questions)===g.banks[0].questionSha256,'exact chapter bank revision');
  const candidates=[{kind:'contextual_draft_bank',evidence:{file:g.banks[0].file,selector:g.banks[0].selector},key:g.banks[0].key,questionSha256:g.banks[0].questionSha256,reviewedOverlay:composition.bankBindings.find(b=>b.file===g.banks[0].file&&b.key===g.banks[0].key)??null}];
  const refined=refinements.items.find(r=>r.file===g.banks[0].file&&r.key===g.banks[0].key);
  if(refined){ensure(!candidates[0].reviewedOverlay,'no implicit refinement conflict');ensure(hash(bank.questions)===refined.beforeQuestionSha256&&hash(refined.after.questions)===refined.afterQuestionSha256,'exact named direct refinement');candidates[0].reviewedOverlay={evidence:{file:'whole-work-direct-bank-refinements-46.json',selector:`/items/${refinements.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};}
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);
  if(existing.length){ensure(existing.length===3,'complete retained historical bank');candidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  bankDependencies.push({identity,candidates,status:'explicit_single_draft_or_existing_bank_selection'});
 }
 const prior=new Map(previousBanks.banks.map(b=>[b.identity,b]));
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!prior.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]};
 const prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{
  const previous=prior.get(g.identity);if(!previous)return prepared.banks.find(b=>b.identity===g.identity);
  return {...previous,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:'whole-work-reviewed-word-banks-45.json',selector:`/banks/${previousBanks.banks.indexOf(previous)}`},questionSha256:previous.questionSha256},selectionReason:'Retain the already bound canonical bank for this exact Surface+Sense; add only these separately indexed draft source occurrences.',alternateCandidates:bankDependencies.find(d=>d.identity===g.identity).candidates,masteryAction:g.masteryAction};
 });
 ensure(banks.length===100&&banks.every(b=>b?.questions.length===3),'complete exact canonical banks');
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'source use bound once');
 const remaining=graph.directDraftBankGroups.flatMap(g=>g.occurrences.filter(o=>!bound.has(coord(o))).map(o=>({...o,form:g.surface,root:g.root,banks:g.banks})));
 const summary={boundDirectDraftSourceUses:occurrenceBindings.length,boundDirectDraftIdentityGroups:identityGroups.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:newLemmas.size,newSenses:newSenses.size,newSurfaceForms:newSurfaces.size,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,freshIdentityGroups:identityGroups.filter(g=>g.masteryAction==='fresh_identity_on_exact_unit_view').length,preservedPriorCanonicalBanks:banks.filter(b=>b.chosen.kind==='previously_bound_candidate_bank').length,preservedExistingBankSelections:banks.filter(b=>b.chosen.kind==='existing_prepared_bank').length,contextualBankSelections:banks.filter(b=>b.chosen.kind==='contextual_draft_bank').length,refinedBanks:refinements.summary.refinedBanks,refinedQuestionBands:refinements.summary.refinedQuestionBands,explicitOwnershipAndBankHolds:held.length,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.length-selected.length,pendingPhraseSpans:composition.phrases.length};
 return {version:1,workId:graph.workId,status:'offline_direct_draft_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,policy:'Only the 100 named source groups are materialized. Their chapter meaning roots remain separate unless an explicit dependency joins them. Thirteen named ownership or bank decisions stay unbound. All old records and canonical banks are retained. No learner-state write, runtime AI, bulk encounter or release approval.',newLemmas:[...newLemmas.values()],newSenses:[...newSenses.values()],newSurfaceForms:[...newSurfaces.values()],identityGroups,occurrenceBindings,bankDependencies,banks,heldGroups:held,remainingDirectDraftOccurrences:remaining,summary};
}
