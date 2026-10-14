import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{loadPublication}from'./micromegas-publication-baseline.mjs';
import{composeMicromegasReviewedWordBanks}from'./micromegas-reviewed-word-banks.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`,coord=o=>`${o.unit}:${o.start}:${o.end}`;
export const specs60=[
[690,'noun','Ensemble des personnes qui assurent le service et la manœuvre d’un navire.'],[691,'verb',null],
[692,'verb','Arracher une personne ou une chose à sa place en l’emportant.'],
[693,'noun','Tempête caractérisée par des vents d’une extrême violence.'],[694,'verb',null],
[695,'verb','Faire entrer dans un état ou une situation ; dans se mettre en mouvement, commencer à bouger.'],
[696,'noun','Marins qui participent à la manœuvre et au service d’un navire.'],
[697,'noun','Grands récipients de bois formés de douves assemblées, destinés notamment à contenir des liquides.'],
[698,'noun','Boisson alcoolisée obtenue par fermentation du raisin.'],[699,'verb',null],
[700,'verb','Dans se précipiter, se lancer ou se porter quelque part avec une grande hâte.'],
[701,'noun','Instruments de mesure des angles constitués notamment d’un arc gradué.'],
[702,'adjective','Qui est originaire de Laponie ou se rapporte à cette région.'],[703,'verb',null],[704,'verb',null],
[705,'verb','Provoquer par un contact léger une sensation de chatouillement sur la peau.'],
[706,'noun','Morceau de bois long et rigide que l’on peut tenir à la main.'],
[707,'adjective','Garni de fer, notamment à son extrémité.'],
[708,'verb','Faire pénétrer profondément une chose dans une autre en la poussant.'],
[709,'noun','Doigt de la main situé entre le pouce et le majeur.'],
[710,'verb',null],[711,'noun','Sensation semblable à une succession de petites piqûres.'],[712,'verb',null],
[713,'verb','Distinguer par la vue un objet ou ses contours.'],[714,'verb','Avoir l’intention de faire quelque chose.'],
[715,'verb','Blesser les sentiments ou l’amour-propre de quelqu’un.'],[716,'noun','Satisfaction excessive de soi et désir de paraître supérieur.'],[717,'verb',null],
[718,'noun','Personnes qui se donnent de l’importance ou affectent une supériorité.'],
[719,'noun','Observation ou réflexion portant sur un fait.'],[720,'pronoun',null],
[721,'noun','Objet ou corps de forme sphérique.'],[722,'adjective','Qui correspond au rang mille, notamment pour désigner une des mille parts égales d’un tout ; entre aussi dans un ordinal composé.'],
[723,'noun','Portion d’un tout, notamment une fraction de sa quantité ou de sa mesure.'],
[724,'noun','Ancienne unité de longueur correspondant à la douzième partie d’un pied.'],[725,'noun',null],[726,'verb',null],
[727,'noun','Parties d’un organisme qui remplissent des fonctions déterminées.'],
[728,'pronoun','Avec l’article, désigne ce qui appartient ou se rapporte à nous.'],[729,'verb',null],
[730,'verb',null],[731,'verb',null],[732,'noun','Combats livrés entre des armées.'],
[733,'verb','Obtenir ou acquérir quelque chose par une lutte ou une compétition.'],
[734,'noun','Personne ou groupe qui remporte une lutte, une bataille ou une compétition.'],[735,'verb',null],
[736,'verb','Ne pas tenir une chose pour certaine, éprouver de l’incertitude à son sujet.'],
[737,'noun','Soldats d’infanterie autrefois chargés de lancer des grenades, puis membres de corps d’élite.'],[738,'verb',null],
[739,'adverb','À quelque moment que ce soit, dans un emploi non négatif, notamment conditionnel ou comparatif.'],
[740,'noun','Œuvre écrite, notamment un livre.'],[741,'verb','Porter plus haut ou augmenter la hauteur de quelque chose.'],
[742,'noun','Coiffures qui couvrent la tête, notamment celles portées par certains soldats.'],
[743,'noun','Ensemble de soldats réunis sous un commandement.'],[744,'verb',null],
[745,'adverb','À un degré qui paraît sans limite, ou extrêmement élevé.'],
[746,'noun','Habileté à exécuter un geste ou à réussir ce que l’on entreprend.'],[747,'adjective',null],
[748,'adverb','Renforce une question, une exclamation ou une demande en marquant l’insistance.'],
[749,'noun','Par comparaison, êtres dont la petitesse paraît extrême.'],
[750,'pronoun',null],[751,'adjective',null],[752,'verb',null],
[753,'noun','Semence ou germe considéré comme origine d’un être vivant, dans le vocabulaire ancien de la génération.'],
[754,'verb','Donner naissance ou donner une forme et une constitution à un être.'],[755,'adjective',null],
[756,'noun','Action de trouver ou de reconnaître ce qui était jusque-là inconnu, ou résultat de cette action.'],
[757,'noun','Organismes envisagés par comparaison comme des ensembles de mécanismes en action.'],[758,'verb',null],
[759,'noun','Mouvements, gestes ou manœuvres accomplis par un être.'],[760,'verb',null],
[761,'noun','Actions ou ensembles d’actions accomplis pour réaliser une activité.'],[762,'verb',null],[763,'verb',null],
[764,'noun','Charges pesantes que l’on porte ou transporte.'],[765,'verb',null],[766,'verb',null],[767,'verb',null],[768,'noun',null],[769,'adjective',null],
[770,'verb','Cesser de voir ou de suivre du regard une personne ou une chose.'],
[771,'verb','Quitter un état, une attitude ou une situation pour en adopter une autre.'],
[772,'noun','Disposition à ne pas se fier à quelqu’un ou à quelque chose, à en suspecter la valeur ou la vérité.'],
[773,'noun','Disposition à croire trop facilement, sans preuve suffisante.'],[774,'verb',null],[775,'verb',null],
[776,'noun','Multiplication des êtres vivants par la reproduction.'],[777,'verb',null],[778,'verb',null],
[779,'noun','Aspects extérieurs par lesquels les choses se présentent, sans garantir leur réalité profonde.'],
[780,'conjunction','Avec que, introduit une possibilité mise en alternative avec une autre, sans changer la conclusion.'],
[781,'verb',null],[782,'adverb','De façon nette et distincte, sans confusion.'],[783,'verb',null],
[784,'verb','Se tromper dans l’interprétation ou le jugement de quelque chose.'],
[785,'noun','Point particulier d’une question ou sujet sur lequel porte une discussion.'],
[786,'noun','Action d’engendrer, de produire de nouveaux êtres vivants.'],[787,'noun',null],[788,'verb',null],
[789,'verb','Admettre une chose à titre d’hypothèse, sans l’avoir démontrée.']
];
const patches60=[
['passer_chapter_05_04_passant','4-5',{context:'Le participe qui décrit la transition d’une attitude à une autre est « ___ ».'},'Quoted forms remove incompatible de...à complements.'],
['apparence_chapter_05_04_apparences','4-5',{context:'Les aspects extérieurs qui se présentent à ses yeux, sans garantir la réalité, sont les « ___ ».'},'Four feminine plural nouns; select outward appearance rather than another uncertain basis.'],
['soit_chapter_05_held_01_132','4-5',{context:'Le mot qui, suivi de que, ouvre une alternative entre l’usage de l’instrument et son absence est « ___ ».'},'Specify alternative rather than a generic concessive or causal connection.'],
['entendait_chapter_06_134_60','4-5',{context:'La forme verbale qui exprime la perception de sons par l’oreille à l’imparfait est « ___ ».'},'Quoted forms remove the n’/ne grammatical giveaway.'],
['avoir_chapter_05_held_01_131','4-5',{context:'Pour former le passé composé de prendre à la première personne, j’ai pris, on emploie l’auxiliaire « ___ ».'},'Explicitly test this printed auxiliary form rather than infer tense from a compatible time cue.'] ,
['dont_chapter_05_held_01_125','4-5',{context:'Le pronom relatif qui reprend ici de ces êtres, dans les êtres dont je parle, est « ___ ».'},'Identify the de relation rather than select by grammatical elimination.'],
['croire_chapter_05_04_crurent','4-5',{context:'La forme verbale qui signifie tinrent pour vraie une observation incertaine est « ___ ».'},'Quoted forms remove the de/infinitive complement cue.'],
['graine_chapter_05_04_graine','6-8',{context:'Le texte emploie, pour le germe supposé des êtres humains, le nom de la semence dont naît une plante.'},'A root or flower could also originate new plants; identify the seed analogy.'],
['former_chapter_05_04_formes','4-5',{context:'Ces êtres auraient pris forme à partir de cette semence : ils se seraient ___ ainsi.'},'Explicit formation rather than any event occurring from a seed.'],
['opération_chapter_05_04_operations','4-5',{context:'Le nom qui désigne l’ensemble de leurs actions et travaux, et non leurs seuls propos, est « ___ ».'},'Distinguish general operations from words, which are also actions.'],
['fardeau_chapter_05_04_fardeaux','4-5',{context:'Le terme général qui désigne des charges pesantes à porter est « ___ ».'},'Do not make gifts or hats impossible merely because of a particular context.'],
['nouveau_chapter_05_04_nouveaux','4-5',{context:'L’adjectif qui signifie encore inconnus des observateurs, découverts par eux pour la première fois, est « ___ ».'},'An old object could also be seen for the first time; identify the relevant lexical meaning.'] ,
['concevoir_chapter_05_04_concevez','4-5',{context:'Représentez-vous mentalement leurs pensées : ___ ce que ces êtres penseraient des batailles.'},'An explicit imagination cue excludes forgetting or concealing.'],
['gagner_chapter_05_04_gagner','4-5',{context:'Par la conquête, le vainqueur acquiert un village : la bataille lui permet de le ___.'},'Acquisition rather than any consequence of a battle.'],
['ouvrage_chapter_05_held_01_124','4-5',{context:'Ce livre, en tant qu’œuvre écrite, est un « ___ ».'},'Quoted masculine singular nouns avoid the cet/navire mismatch.'],
['avertir_chapter_05_04_avertis','4-5',{context:'Le verbe qui signifie je le préviens d’un résultat à venir est « ___ ».'},'Quoted forms avoid the le/l’ cue and the incompatible que complements.'],
['adresse_chapter_05_04_adresse','4-5',{context:'Son habileté à manier cet instrument se nomme son « ___ ».'},'Skill itself is selected, not another condition that might assist success.'],
['donc_chapter_05_held_01_125','4-5',{context:'Dans Quelle adresse ne fallut-il donc pas !, le mot qui renforce l’exclamation est « ___ ».'},'Identify emphatic use rather than a merely possible connective.'] ,
['juger_chapter_05_03','4-5',{context:'Il tira une conclusion du picotement : il ___ qu’une chose était sortie.'},'An inference cue, not merely evidence compatible with denial.'],
['vanité_chapter_05_03','4-5',{context:'Leur sentiment excessif de leur propre importance, leur ___, risque d’être blessé.'},'Four feminine singular nouns; explicit self-importance distinguishes the answer.'],
['prier_chapter_05_04_prier','4-5',{context:'Le verbe qui signifie adresser une demande polie, sans contraindre ni interdire, est « ___ ».'},'Quoted verbs avoid the à/de complement mismatch of forcer.'],
['boule_chapter_05_04_boule','4-5',{context:'Il imagine un corps sphérique, une ___ de dix pieds de tour.'},'A planche may be round; require a three-dimensional sphere.'],
['substance_chapter_05_04_substance','1-3',{answer:'being; independently existing entity',choices:['being; independently existing entity','tiny village','ship instrument','written book']},'Hypothetical is supplied by figurez-vous, not by substance itself.'],
['tenir_chapter_05_04_tenir','4-5',{context:'Cette créature pourrait garder la Terre dans sa main, sans la lâcher : elle pourrait l’y ___.'},'Explicitly maintain possession rather than merely act on the Earth.'],
['organe_chapter_05_04_organes','4-5',{context:'Les parties de son corps qui remplissent des fonctions vitales sont ses ___.'},'The original size comparison allowed books or ships as possessions.'],
['avoir_chapter_05_held_01_123','4-5',{context:'Dans la tournure il y ait, le verbe qui exprime l’existence est « ___ ».'},'Quoted forms remove a construction-only completion cue.'] ,
['equipage_chapter_05_02','4-5',{context:'Le personnel chargé de la manœuvre et du service du navire constitue l’___.'},'Four masculine singular nouns with valid elision; meaning selects the crew.'],
['crus_chapter_05_02','1-3',{answer:'believed',choices:['believed','rescued','hidden','seen']},'The reflexive pronoun contributes themselves; translate the highlighted participle.'],
['enleves_chapter_05_02','4-5',{choices:['enlevés','retenus','sauvés','cachés']},'Avoid portés, which also fits being carried by the wind.'],
['enleves_chapter_05_02','6-8',{choices:['enlevés','retenus','sauvés','cachés']},'Preserve the same unambiguous contrasts.'],
['mettent_chapter_05_02','1-3',{answer:'put; set',choices:['put; set','keep','see','find']},'En mouvement supplies the resulting state; mettre contributes putting into it.'],
['mettent_chapter_05_02','4-5',{context:'Ils passent de l’immobilité au mouvement : ils se ___ en mouvement.',choices:['mettent','maintiennent','voient','trouvent']},'Entry into the state distinguishes setting in motion from remaining or perceiving.'],
['mettent_chapter_05_02','6-8',{context:'Se mettre en mouvement signifie commencer à bouger, entrer dans cet état.',choices:['mettent','maintiennent','voient','trouvent']},'Align the middle-band contrasts.'],
['tonneaux_chapter_05_02','6-8',{context:'Ces récipients sont formés de douves de bois assemblées et contiennent le vin.'},'Vaisseau can itself mean a container; the wooden stave construction selects tonneau.'],
['vin_chapter_05_02','6-8',{context:'Cette boisson alcoolisée est obtenue par fermentation du raisin.'},'Unfermented grape juice otherwise competes.'],
['precipitent_chapter_05_02','1-3',{answer:'rush; hurl themselves',choices:['rush; hurl themselves','remain','walk slowly','hide']},'Après supplies following the barrels, not the target verb.'],
['secteurs_chapter_05_02','4-5',{context:'Les géomètres mesurent des angles avec leurs ___, instruments munis d’un arc gradué.'},'Specific instrument function, with four masculine plural nouns.'],
['descendre_chapter_05_03','4-5',{context:'Le verbe qui indique simplement aller du haut vers le bas, sans préciser un saut, est « ___ ».',choices:['descendent','montent','restent','sautent']},'Do not allow sautent as a competing downward action; quote to avoid complement grammar.'],
['descendre_chapter_05_03','6-8',{context:'Descendre indique la direction du haut vers le bas. Sauter précise un bond sans en fixer la direction.'},'Distinguish direction from a compatible manner of movement.'],
['remuer_chapter_05_03','4-5',{context:'Le verbe qui signifie faire de petits mouvements, sans exprimer une chute, est « ___ ».'},'Motion is not enough to exclude tomber.'],
['remuer_chapter_05_03','6-8',{context:'Remuer signifie faire des mouvements ; tomber précise une chute, grandir une croissance et dormir un état de sommeil.'},'Explicit semantic contrasts.'],
['chatouiller_chapter_05_03','4-5',{context:'Ce contact léger produisait un chatouillement : il lui ___ les doigts.'},'Light contact alone does not exclude injury or numbness.']
];
export function composeRefinements60(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 for(const[key,band,patch,reason]of patches60){const b=graph.directDraftBankGroups.flatMap(g=>g.banks).find(b=>b.key===key);let raw=JSON.parse(readFileSync(`${folder}/${b.file}`));for(const k of b.selector.split('/').slice(1))raw=raw[k];const tag=b.file+':'+key;if(!items.has(tag))items.set(tag,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});const x=items.get(tag),q=x.after.questions.find(q=>q.band===band),beforeSha256=hash(q);Object.assign(q,patch);x.changes.push({band,beforeSha256,afterSha256:hash(q),reason});}
 for(const x of items.values())x.afterQuestionSha256=hash(x.after.questions);
 return{version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:patches60.length}};
}
export function composeWords60(folder){
 const evidence={},cache=new Map(),ensure=(b,s)=>{if(!b)throw Error('Source60: '+s)},read=f=>{if(!cache.has(f)){const b=readFileSync(`${folder}/${f}`);evidence[f]=sha(b);cache.set(f,JSON.parse(b));}return cache.get(f)},pointer=b=>b.selector.split('/').slice(1).reduce((v,k)=>v[k],read(b.file));
 const graph=read('whole-work-identity-dependencies-43.json'),base=read('whole-work-import-composition-42.json'),prev=read('whole-work-source-words-59.json'),refs=read('whole-work-source-bank-refinements-60.json'),p=loadPublication();
 ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged published baseline');
 const names=['whole-work-reviewed-word-bindings-44.json','whole-work-direct-word-package-46.json','whole-work-resolved-word-package-47.json','whole-work-continuation-word-package-49.json','whole-work-reviewed-family-words-51.json','whole-work-source-words-55.json','whole-work-source-words-57.json','whole-work-source-words-59.json'];
 const priors=names.map(read),maps={newLemmas:new Map(p.bundle.lemmas.map(x=>[x.id,x])),newSenses:new Map(p.bundle.senses.map(x=>[x.id,x])),newSurfaceForms:new Map(p.bundle.surfaceForms.map(x=>[x.id,x]))},fresh={newLemmas:[],newSenses:[],newSurfaceForms:[]};
 for(const n of Object.keys(maps))for(const a of priors)for(const x of a[n]){ensure(!maps[n].has(x.record.id),'prior record collision');maps[n].set(x.record.id,x.record);}
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d])),source=new Map(base.tokens.map(t=>[coord(t),t])),old=new Set(prev.remainingDirectDraftOccurrences.map(coord));
 const identityGroups=[],occurrenceBindings=[],bankDependencies=[],decisions=[];
 const add=(key,record,extra)=>{ensure(!maps[key].has(record.id),'new record duplicate');maps[key].set(record.id,record);fresh[key].push({record,...extra});};
 const selections=[];
 for(const[index,pos,definition]of specs60){const g=structuredClone(graph.directDraftBankGroups[index]);g.index=index;g.pos=pos;g.definition=definition;g.reason='Reviewed source context and all three exact stored question bands.';
  if(index===725){g.root=structuredClone(declarations.get('chapter-02-identity-plan.json:substances_basic_realities').root);g.reason='Reuse the already staged philosophical entity meaning; hypothetical status does not create a new lexical meaning.';}
  if(index===690)g.reason='Crew in all four nautical source contexts; unit212 follows the fall of the occupied ship and recovery of its people. The antecedent is not a hearing apparatus. Retain the earlier travel-equipment meaning separately.';
  if(index===707)g.reason='Ferré is adjectival here; assign the adjective ferré, not an adjective lemma ferrer.';
  selections.push(g);
 }
 for(const g of selections){ensure(g.banks.length===1||[690,720,739,746].includes(g.index),'named alternate bank selection');const b=g.banks[0],bank=pointer(b);ensure(hash(bank.questions)===b.questionSha256,'exact bank revision');let senseId,lemmaId;
  if(g.root.kind==='published_sense'){senseId=g.root.senseId;ensure(maps.newSenses.has(senseId),'published meaning exists');lemmaId=maps.newSenses.get(senseId).lemmaId;}
  else{const root=g.root;senseId=id('sns','direct-draft:'+root.declaration);if(maps.newSenses.has(senseId))lemmaId=maps.newSenses.get(senseId).lemmaId;else{ensure(g.definition,'explicit definition for '+g.surface);const decl=declarations.get(root.declaration),rootBank=pointer(decl.bank);if(g.index===707){lemmaId=id('lem','ferré:adjective');if(!maps.newLemmas.has(lemmaId))add('newLemmas',{id:lemmaId,headword:'ferré',partOfSpeech:'adjective'},{evidence:decl.evidence});}else if(root.lemma.kind==='published_lemma')lemmaId=root.lemma.lemmaId;else{const headword=rootBank.lemma;lemmaId=id('lem',`${headword}:${g.pos}`);if(!maps.newLemmas.has(lemmaId)){ensure(!p.bundle.lemmas.some(l=>l.headword===headword&&l.partOfSpeech===g.pos),'existing head requires explicit choice '+headword);add('newLemmas',{id:lemmaId,headword,partOfSpeech:g.pos},{evidence:decl.evidence});}}
   const gloss=rootBank.meaning;add('newSenses',{id:senseId,lemmaId,gloss,definition:g.definition},{declaredSenseRoot:root.declaration,evidence:decl.evidence,definitionAuthority:{file:'scripts/micromegas-source-words-60.mjs',sourceGroupIndex:g.index}});
  }}
  ensure(maps.newLemmas.get(lemmaId)?.partOfSpeech===g.pos,'proper lexical category '+g.surface);
  const candidates=[...maps.newSurfaceForms.values()].filter(x=>x.lemmaId===lemmaId&&x.normalized===g.surface),hasQuiz=x=>[...p.preparedQuizzes.values()].some(q=>q.subject.surfaceFormId===x.id&&q.subject.senseId===senseId),active=candidates.filter(hasQuiz);ensure(active.length<=1&&(active.length===1||candidates.length<=1),'surface ambiguity '+g.surface);
  let surface=active[0]??candidates[0];if(!surface){surface={id:id('srf',`${lemmaId}:${g.surface}`),lemmaId,form:g.surface,normalized:g.surface};add('newSurfaceForms',surface,{evidence:{file:b.file,selector:b.selector}});}
  const identity=surface.id+':'+senseId,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';const merged=identityGroups.find(x=>x.identity===identity);if(merged){ensure(false,'unexpected same-key merger');merged.occurrences.push(...g.occurrences);}else identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(old.has(coord(o))&&t.owner.kind==='draft_bank'&&g.banks.some(x=>x.file===t.owner.file&&x.key===t.owner.key),'available exact source use');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:b.file,selector:b.selector}});}
  const draft={kind:'contextual_draft_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256};const refined=refs.items.find(x=>x.file===b.file&&x.key===b.key);if(refined)draft.reviewedOverlay={evidence:{file:'whole-work-source-bank-refinements-60.json',selector:`/items/${refs.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);const bankCandidates=[draft];if(existing.length){ensure(existing.length===3,'three retained questions');bankCandidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const alt of g.banks.slice(1)){ensure(hash(pointer(alt).questions)===alt.questionSha256,'exact alternate bank');bankCandidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:alt.file,selector:alt.selector},key:alt.key,questionSha256:alt.questionSha256,reason:'The first source bank represents the same reviewed meaning; retain this alternative without creating a second bank.'});}
  if(merged){const dep=bankDependencies.find(x=>x.identity===identity);dep.candidates.push({...draft,kind:'preserved_unselected_contextual_bank',reason:g.reason});}else bankDependencies.push({identity,candidates:bankCandidates,status:'explicit_reviewed_selection'});decisions.push({sourceGroupIndex:g.index,form:g.surface,identity,occurrences:g.occurrences,reason:g.reason,sourceQuestionSha256:b.questionSha256});
 }
 const priorBankFiles=['whole-work-reviewed-word-banks-45.json',...names.slice(1)],priorBanks=new Map();for(const f of priorBankFiles)for(const b of read(f).banks)priorBanks.set(b.identity,{bank:b,file:f});
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!priorBanks.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]},prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{const old=priorBanks.get(g.identity);if(!old)return prepared.banks.find(b=>b.identity===g.identity);return{...old.bank,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:old.file,selector:`/banks/${read(old.file).banks.indexOf(old.bank)}`},questionSha256:old.bank.questionSha256},masteryAction:g.masteryAction};});
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'disjoint source bindings');const remaining=prev.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o))),keys=new Set(remaining.map(coord));
 return{version:1,workId:graph.workId,status:'offline_source_word_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,...fresh,identityGroups,occurrenceBindings,bankDependencies,banks,decisions,remainingDirectDraftOccurrences:remaining,sourceGroupRange:{first:690,last:specs60.at(-1)[0]},lexicalAuthorities:[{key:'grenadier_soldier',url:'https://www.dictionnaire-academie.fr/article/A7G0865',reading:'Elite soldiers named after the original function of throwing grenades.'},{key:'secteur_instrument',url:'https://www.dictionnaire-academie.fr/article/A5S0513',reading:'An astronomical angular measuring instrument with an arc smaller than a quadrant.'},{key:'pouce_measure',url:'https://www.dictionnaire-academie.fr/article/A4P1701',reading:'Historical length unit: one twelfth of a foot, distinct from the thumb.'},{key:'equipage_nautical',url:'https://www.dictionnaire-academie.fr/article/A3E0977',reading:'Historical nautical sense names the people serving aboard; chapterVII unit212 recovers the occupants after the fall of their ship.'}],summary:{reviewedSourceGroups:specs60.length,boundDirectDraftIdentityGroups:identityGroups.length,boundDirectDraftSourceUses:occurrenceBindings.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:fresh.newLemmas.length,newSenses:fresh.newSenses.length,newSurfaceForms:fresh.newSurfaceForms.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,refinedBanks:refs.summary.refinedBanks,refinedQuestionBands:refs.summary.refinedQuestionBands,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>keys.has(coord(o)))).length,pendingPhraseSpans:base.phrases.length}};
}
