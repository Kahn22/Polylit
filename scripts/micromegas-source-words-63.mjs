import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{loadPublication}from'./micromegas-publication-baseline.mjs';
import{composeMicromegasReviewedWordBanks}from'./micromegas-reviewed-word-banks.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`,coord=o=>`${o.unit}:${o.start}:${o.end}`;
export const specs63=[
[970,'noun','Disputes ou conflits opposant des personnes ou des groupes.'],[971,'preposition',null],
[972,'adjective','De peu de force ou de vigueur, d’apparence faible et fragile.'],[973,'noun',null],
[974,'verb','Tuer avec une grande brutalité, par extension du fait de trancher la gorge.'],
[975,'noun','Brin de paille ; par comparaison, chose d’une valeur ou d’une importance infime.'],[976,'verb',null],
[977,'noun','Titre porté par certains souverains musulmans, notamment le souverain ottoman.'],
[978,'noun','Petit endroit ou portion limitée d’un espace.'],[979,'verb',null],
[980,'adverb','De façon réciproque, chacun agissant sur l’autre.'],[981,'interjection',null],[982,'preposition',null],[983,'verb',null],
[984,'adjective','D’une fureur extrême qui dépasse toute retenue.'],[985,'noun',null],
[986,'noun','Personnes qui commettent des meurtres.'],[987,'adjective',null],[988,'verb',null],
[989,'noun','Destruction, perte ou effondrement d’une personne ou d’un groupe.'],
[990,'verb',null],[991,'adjective','Qui correspond au rang cent ou à une des cent parts égales d’un tout.'],
[992,'noun','Personnes dans une situation pénible et qui inspirent la pitié.'],[993,'verb',null],[994,'verb',null],
[995,'noun','Arme à poignée et à longue lame, généralement droite et à deux tranchants.'],[996,'noun','État de lassitude ou d’épuisement produit notamment par des efforts.'],
[997,'noun','Manque de modération dans les plaisirs, notamment le boire et le manger.'],[998,'verb','Causer la mort, en parlant notamment d’une maladie ou d’une cause de destruction.'],
[999,'noun','Personnes d’une grande cruauté ou inhumanité.'],[1000,'adjective','Qui restent habituellement au même endroit et se déplacent peu.'],[1001,'noun',null],[1002,'noun',null],
[1003,'verb','Donner l’ordre de faire une chose.'],[1004,'noun','Processus par lequel le corps transforme les aliments après leur ingestion.'],
[1005,'noun','Mise à mort collective et brutale.'],[1006,'noun',null],[1007,'adverb','Avec gravité et cérémonie.'],
[1008,'verb','Toucher ou troubler une personne en suscitant en elle une émotion.'],[1009,'noun','Sentiment de compassion devant la souffrance ou le malheur d’autrui.'],
[1010,'preposition','Introduit la personne ou la chose vers laquelle se porte un sentiment.'],[1011,'verb',null],[1012,'adjective',null],
[1013,'noun','Oppositions marquées entre des éléments mis en regard.'],[1014,'verb',null],
[1015,'preposition','Introduit la rémunération ou la contrepartie reçue en échange d’une action.'],[1016,'hold',null],
[1017,'verb','Dans s’occuper, consacrer son temps ou son activité à quelque chose.'],[1018,'verb',null],[1019,'noun',null],[1020,'verb',null],
[1021,'noun','Objets géométriques à une dimension, ayant une longueur sans largeur ni épaisseur.'],
[1022,'verb','Réunir ou combiner plusieurs éléments.'],[1023,'noun','Entités mathématiques exprimant des valeurs numériques et entrant dans les calculs.'],
[1024,'noun','Questions particulières ou sujets précis examinés dans une discussion.'],[1025,'verb',null],
[1026,'verb','Discuter d’une question en opposant des arguments.'],[1027,'noun','Envie ou désir spontané qui vient à l’esprit.'],
[1028,'verb','Poser des questions à quelqu’un pour obtenir des renseignements.'],[1029,'noun',null],
[1030,'verb',null],[1031,'noun','Unités de mesure d’un angle, chacune égale à un trois-cent-soixantième de tour.'],
[1032,'adjective','Qui représente la moitié de l’unité nommée.'],[1033,'noun','Moitiés de diamètre, correspondant aux rayons d’un cercle ou d’une sphère.'],[1034,'verb',null],
[1035,'verb','Prendre quelqu’un en défaut par une ruse ou une question trompeuse.'],[1036,'adjective',null],
[1037,'numeral','Nombre égal à dix plus neuf.'],[1038,'noun','Ancienne pièce de monnaie, notamment frappée en or.'],
[1039,'noun','Paroles ou indications données pour répondre à une question.'],[1040,'verb','Donner envie de faire quelque chose, incliner à une action.'],
[1041,'preposition','Introduit l’identité ou la qualité que l’on attribue à quelqu’un dans prendre pour.'],
[1042,'noun','Personnes auxquelles on attribue la pratique de la magie.'],[1043,'adjective',null],[1044,'relative pronoun',null],[1045,'verb',null],
[1046,'verb','Ne pas vouloir accorder ou reconnaître quelque chose à quelqu’un.'],[1047,'noun',null],
[1048,'adverb','À un moment antérieur à celui dont on parle.'],[1049,'adverb',null]
];
const patches63=[
['convenaient_chapter_07_04_186_119','4-5',{context:'Le verbe à l’imparfait qui signifie étaient d’accord sur un fait est « ___ ».'},'Quoted forms avoid the incompatible en mentaient construction.'],
['degrés_chapter_07_04_188_47','6-8',{context:'Quel nom masculin pluriel désigne des unités égales chacune à un trois-cent-soixantième de tour ?'},'Radian and turn are also angle units; specify the degree.'],
['pèse_chapter_07_04_188_168','4-5',{context:'Le verbe qui exprime le poids propre d’un objet est « ___ ».'},'Quoted forms remove incompatible object or measure complements.'],
['légère_chapter_07_04_189_128','4-5',{context:'L’adjectif féminin qui signifie de faible poids est « ___ ».'},'Small quantities can be both dense and low-weight; identify the meaning.'],
['avait_chapter_07_04_190_118','4-5',{context:'Dans il avait refusé, l’auxiliaire du plus-que-parfait est « ___ ».'},'Quoted forms remove participle-complement cues.'],

['découvrait_chapter_07_03_184_82','4-5',{context:'Il apprenait à connaître ces contrastes jusque-là inconnus : il les ___.'},'Keep the narrative tense consistent.'],
['pour_chapter_07_02_185_111','4-5',{context:'La préposition qui introduit la rémunération reçue en échange de l’action est « ___ ».'},'Identify payment rather than a merely compatible accompaniment.'],
['disputons_chapter_07_04_185_363','4-5',{context:'Dans nous disputons sur ces questions, le verbe qui signifie échangeons des arguments opposés est « ___ ».'},'Preserve the source intransitive construction without adding a reflexive clitic.'],
['disputons_chapter_07_04_185_363','6-8',{context:'Quel verbe signifie discutons d’une question en opposant des arguments ?'},'Do not call the source verb pronominal.'],

['auraient_chapter_07_03_182_117','4-5',{context:'Dans ils n’auraient pas tiré l’épée, l’auxiliaire du conditionnel passé est « ___ ».'},'Quoted forms remove elision and participle-complement cues.'],
['solennellement_chapter_07_03_183_225','4-5',{context:'L’adverbe qui signifie avec gravité et cérémonie est « ___ ».'},'A ceremony can also be secret; identify the lexical meaning.'],
['pitie_pity','4-5',{context:'La compassion qu’inspire leur souffrance est de la ___.'},'The former globe context did not distinguish compassion from anger or fear.'],
['pitie_pity','6-8',{context:'Quel nom féminin désigne la compassion éprouvée devant la souffrance d’autrui ?'},'Do not give the answer verbatim in the question.'],

['avec_chapter_07_03_179_38','4-5',{context:'La préposition qui marque que la confiance accompagne la parole est « ___ ».'},'Presence of the feeling distinguishes with from without.'],
['coups_chapter_07_03_180_60','1-3',{answer:'blows; strikes',choices:['blows; strikes','greetings','looks','smiles']},'De pied supplies the instrument; coups names the blows.']
];
export function composeRefinements63(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 for(const[key,band,patch,reason]of patches63){const b=graph.directDraftBankGroups.flatMap(g=>g.banks).find(b=>b.key===key);let raw=JSON.parse(readFileSync(`${folder}/${b.file}`));for(const k of b.selector.split('/').slice(1))raw=raw[k];const tag=b.file+':'+key;if(!items.has(tag))items.set(tag,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});const x=items.get(tag),q=x.after.questions.find(q=>q.band===band),beforeSha256=hash(q);Object.assign(q,patch);x.changes.push({band,beforeSha256,afterSha256:hash(q),reason});}
 for(const x of items.values())x.afterQuestionSha256=hash(x.after.questions);
 return{version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:patches63.length}};
}
export function composeWords63(folder){
 const evidence={},cache=new Map(),ensure=(b,s)=>{if(!b)throw Error('Source63: '+s)},read=f=>{if(!cache.has(f)){const b=readFileSync(`${folder}/${f}`);evidence[f]=sha(b);cache.set(f,JSON.parse(b));}return cache.get(f)},pointer=b=>b.selector.split('/').slice(1).reduce((v,k)=>v[k],read(b.file));
 const graph=read('whole-work-identity-dependencies-43.json'),base=read('whole-work-import-composition-42.json'),prev=read('whole-work-source-words-62.json'),refs=read('whole-work-source-bank-refinements-63.json'),p=loadPublication();
 ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged published baseline');
 const names=['whole-work-reviewed-word-bindings-44.json','whole-work-direct-word-package-46.json','whole-work-resolved-word-package-47.json','whole-work-continuation-word-package-49.json','whole-work-reviewed-family-words-51.json','whole-work-source-words-55.json','whole-work-source-words-57.json','whole-work-source-words-59.json','whole-work-source-words-60.json','whole-work-source-words-61.json','whole-work-source-words-62.json'];
 const priors=names.map(read),maps={newLemmas:new Map(p.bundle.lemmas.map(x=>[x.id,x])),newSenses:new Map(p.bundle.senses.map(x=>[x.id,x])),newSurfaceForms:new Map(p.bundle.surfaceForms.map(x=>[x.id,x]))},fresh={newLemmas:[],newSenses:[],newSurfaceForms:[]};
 for(const n of Object.keys(maps))for(const a of priors)for(const x of a[n]){ensure(!maps[n].has(x.record.id),'prior record collision');maps[n].set(x.record.id,x.record);}
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d])),source=new Map(base.tokens.map(t=>[coord(t),t])),old=new Set(prev.remainingDirectDraftOccurrences.map(coord));
 const identityGroups=[],occurrenceBindings=[],bankDependencies=[],decisions=[];
 const ownershipHolds=[{sourceGroupIndex:1016,form:'dites-moi',occurrences:structuredClone(graph.directDraftBankGroups[1016].occurrences),reason:'The hyphenated source contains imperative dire plus indirect-object moi. Preserve both exact uses pending separate component owners and banks, rather than create a fused verb surface.'}];
 const add=(key,record,extra)=>{ensure(!maps[key].has(record.id),'new record duplicate');maps[key].set(record.id,record);fresh[key].push({record,...extra});};
 const selections=[];
 for(const[index,pos,definition]of specs63){const g=structuredClone(graph.directDraftBankGroups[index]);g.index=index;g.pos=pos;g.definition=definition;g.reason='Reviewed source context and all three exact stored question bands.';
  if(index===1016)continue;
  if(index===1023){g.root={kind:'planned_sense',declaration:'chapter-07-identity-targets-04.json:nombres_chapter_07_04_185_279',lemma:{kind:'planned_lemma',declaration:'chapter-02-identity-plan.json:nombre_count'}};g.reason='Abstract mathematical numbers used in calculation, distinct from the staged definition limited to the counted size of a set.';}
  selections.push(g);
 }
 for(const g of selections){ensure(g.banks.length===1||[1001].includes(g.index),'named alternate bank selection');const b=g.banks[0],bank=pointer(b);ensure(hash(bank.questions)===b.questionSha256,'exact bank revision');let senseId,lemmaId;
  if(g.root.kind==='published_sense'){senseId=g.root.senseId;ensure(maps.newSenses.has(senseId),'published meaning exists');lemmaId=maps.newSenses.get(senseId).lemmaId;}
  else{const root=g.root;senseId=id('sns','direct-draft:'+root.declaration);if(maps.newSenses.has(senseId))lemmaId=maps.newSenses.get(senseId).lemmaId;else{ensure(g.definition,'explicit definition for '+g.surface);const decl=declarations.get(root.declaration),rootBank=pointer(decl.bank);if(root.lemma.kind==='published_lemma')lemmaId=root.lemma.lemmaId;else{const headword=rootBank.lemma;lemmaId=id('lem',`${headword}:${g.pos}`);if(!maps.newLemmas.has(lemmaId)){ensure(!p.bundle.lemmas.some(l=>l.headword===headword&&l.partOfSpeech===g.pos),'existing head requires explicit choice '+headword);add('newLemmas',{id:lemmaId,headword,partOfSpeech:g.pos},{evidence:decl.evidence});}}
   const gloss=rootBank.meaning;add('newSenses',{id:senseId,lemmaId,gloss,definition:g.definition},{declaredSenseRoot:root.declaration,evidence:decl.evidence,definitionAuthority:{file:'scripts/micromegas-source-words-63.mjs',sourceGroupIndex:g.index}});
  }}
  ensure(maps.newLemmas.get(lemmaId)?.partOfSpeech===g.pos,'proper lexical category '+g.surface);
  const candidates=[...maps.newSurfaceForms.values()].filter(x=>x.lemmaId===lemmaId&&x.normalized===g.surface),hasQuiz=x=>[...p.preparedQuizzes.values()].some(q=>q.subject.surfaceFormId===x.id&&q.subject.senseId===senseId),active=candidates.filter(hasQuiz);ensure(active.length<=1&&(active.length===1||candidates.length<=1),'surface ambiguity '+g.surface);
  let surface=active[0]??candidates[0];if(!surface){surface={id:id('srf',`${lemmaId}:${g.surface}`),lemmaId,form:g.surface,normalized:g.surface};add('newSurfaceForms',surface,{evidence:{file:b.file,selector:b.selector}});}
  const identity=surface.id+':'+senseId,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';const merged=identityGroups.find(x=>x.identity===identity);if(merged){ensure(false,'unexpected same-key merger');merged.occurrences.push(...g.occurrences);}else identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(old.has(coord(o))&&t.owner.kind==='draft_bank'&&g.banks.some(x=>x.file===t.owner.file&&x.key===t.owner.key),'available exact source use');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:b.file,selector:b.selector}});}
  const draft={kind:'contextual_draft_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256};const refined=refs.items.find(x=>x.file===b.file&&x.key===b.key);if(refined)draft.reviewedOverlay={evidence:{file:'whole-work-source-bank-refinements-63.json',selector:`/items/${refs.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);const bankCandidates=[draft];if(existing.length){ensure(existing.length===3,'three retained questions');bankCandidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const alt of g.banks.slice(1)){ensure(hash(pointer(alt).questions)===alt.questionSha256,'exact alternate bank');bankCandidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:alt.file,selector:alt.selector},key:alt.key,questionSha256:alt.questionSha256,reason:'The first source bank represents the same reviewed meaning; retain this alternative without creating a second bank.'});}
  if(merged){const dep=bankDependencies.find(x=>x.identity===identity);dep.candidates.push({...draft,kind:'preserved_unselected_contextual_bank',reason:g.reason});}else bankDependencies.push({identity,candidates:bankCandidates,status:'explicit_reviewed_selection'});decisions.push({sourceGroupIndex:g.index,form:g.surface,identity,occurrences:g.occurrences,reason:g.reason,sourceQuestionSha256:b.questionSha256});
 }
 const priorBankFiles=['whole-work-reviewed-word-banks-45.json',...names.slice(1)],priorBanks=new Map();for(const f of priorBankFiles)for(const b of read(f).banks)priorBanks.set(b.identity,{bank:b,file:f});
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!priorBanks.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]},prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{const old=priorBanks.get(g.identity);if(!old)return prepared.banks.find(b=>b.identity===g.identity);return{...old.bank,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:old.file,selector:`/banks/${read(old.file).banks.indexOf(old.bank)}`},questionSha256:old.bank.questionSha256},masteryAction:g.masteryAction};});
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'disjoint source bindings');const remaining=prev.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o))),keys=new Set(remaining.map(coord));
 return{version:1,workId:graph.workId,status:'offline_source_word_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,...fresh,identityGroups,occurrenceBindings,bankDependencies,banks,decisions,ownershipHolds,remainingDirectDraftOccurrences:remaining,sourceGroupRange:{first:970,last:specs63.at(-1)[0]},lexicalAuthorities:[{form:'ducat',url:'https://www.dictionnaire-academie.fr/article/A4D1619',note:'Académie 1762: coin noun and or ducat for gold at ducat standard.'},{form:'demi-diamètres',url:'https://www.dictionnaire-academie.fr/article/A4R0328',note:'Académie 1762 rayon: geometrical demi-diamètre.'}],summary:{reviewedSourceGroups:specs63.length,unresolvedOwnershipGroups:ownershipHolds.length,boundDirectDraftIdentityGroups:identityGroups.length,boundDirectDraftSourceUses:occurrenceBindings.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:fresh.newLemmas.length,newSenses:fresh.newSenses.length,newSurfaceForms:fresh.newSurfaceForms.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,refinedBanks:refs.summary.refinedBanks,refinedQuestionBands:refs.summary.refinedQuestionBands,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>keys.has(coord(o)))).length,pendingPhraseSpans:base.phrases.length}};
}
