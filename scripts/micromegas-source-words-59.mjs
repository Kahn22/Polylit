import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{loadPublication}from'./micromegas-publication-baseline.mjs';
import{composeMicromegasReviewedWordBanks}from'./micromegas-reviewed-word-banks.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`,coord=o=>`${o.unit}:${o.start}:${o.end}`;
export const specs59=[
[610,'noun','Discussion dans laquelle des personnes soutiennent des opinions opposées.'],
[611,'verb','Dans s’échauffer, parler ou agir avec une ardeur ou une excitation croissante.'],
[612,'verb','Rompre une chose en la brisant.'],
[613,'noun','Élément long et très fin, notamment de fibres, employé pour attacher ou relier des objets.'],
[614,'verb',null],[615,'adjective',null],
[616,'noun','Dans cet emploi ancien, petit diamant vendu au poids.'],
[617,'adjective','Qui ne présente pas la même mesure ou les mêmes dimensions qu’un autre élément.'],
[618,'verb','Avoir un poids exprimé par une mesure.'],
[619,'noun','Ancienne unité de poids appelée livre, distincte du livre à lire et de l’unité monétaire.'],
[620,'pronoun',null],[621,'verb',null],[622,'preposition',null],[623,'verb',null],
[624,'verb','Façonner une pierre précieuse en coupant ou en travaillant sa surface.'],
[625,'determiner',null],
[626,'adjective','Qui possède un très haut degré de qualité.'],
[627,'noun',null],
[628,'verb','Mettre une chose contre une autre, en contact avec elle.'],
[629,'noun','Pupille, ouverture située au centre de l’iris de l’œil.'],
[630,'verb',null],[631,'noun','Aide ou moyen d’action fourni par une chose, notamment un instrument.'],
[632,'verb','Dans s’ajuster, adapter sa position ou sa disposition pour accomplir une action.'],
[633,'preposition','Relie un pronom indéfini tel que quelque chose ou quelqu’un à l’adjectif qui le qualifie.'],
[634,'verb','Faire des mouvements, ne pas rester immobile.'],
[635,'noun','Grand mammifère marin appartenant aux cétacés.'],
[636,'adverb','Avec habileté et adresse.'],[637,'noun',null],
[638,'noun','Doigt court de la main qui peut s’opposer aux autres doigts.'],
[639,'noun','Degré ou quantité qui dépasse la mesure ordinaire ou raisonnable.'],
[640,'verb','Dans s’imaginer, se représenter comme vrai ce que l’on suppose sans l’avoir constaté.'],
[641,'noun',null],[642,'noun','Personne qui raisonne beaucoup et aime discuter des idées.'],
[643,'verb','Obtenir ou recevoir quelque chose d’une source dont on le fait provenir.'],
[644,'noun','Changement de position d’un corps ou de ses parties dans l’espace.'],
[645,'noun',null],[646,'adjective','Qui ne sait que penser ou comment résoudre une difficulté.'],
[647,'verb',null],[648,'adverb','Avec patience, sans précipitation ni irritation devant une difficulté.'],
[649,'noun','Possibilité de faire quelque chose, notamment dans la tournure il y a moyen de.'],
[650,'verb','Placer ou abriter quelque chose à l’intérieur d’un lieu ou d’un être.'],
[651,'verb','Tendre vers une opinion ou une décision, sans la tenir encore pour certaine.'],
[652,'determiner','Forme réduite de l’article indéfini ou partitif après une négation portant sur la quantité.'],
[653,'preposition',null],[654,'verb','Se maintenir à la surface d’un liquide sans s’enfoncer.'],
[655,'noun','Époque ou période à laquelle se rapporte un fait.'],
[656,'noun','Groupe de personnes considéré collectivement, par comparaison avec un groupe d’oiseaux.'],
[657,'verb',null],[658,'noun','Ligne circulaire imaginaire tracée sur une sphère, notamment un parallèle terrestre.'],
[659,'adjective','Qui se rapporte aux pôles géographiques.'],
[660,'verb','Aller ou se rendre quelque part, dans cet emploi de être à un temps passé.'],
[661,'noun','Examens attentifs de phénomènes pour en recueillir des informations.'],
[662,'verb','Dans s’aviser de, penser à quelque chose ou en concevoir l’idée.'],
[663,'noun','Journaux qui donnent des nouvelles et des informations.'],
[664,'noun','Grand bateau destiné à naviguer sur la mer.'],
[665,'verb','S’immobiliser sur le fond ou le rivage, en parlant d’un bateau.'],
[666,'noun','Parties de la terre qui bordent la mer.'],
[667,'verb','Éprouver un état, un sentiment ou une difficulté.'],
[668,'verb','Dans se sauver, échapper à un danger en se mettant en sécurité.'],
[669,'adverb','Avec franchise et simplicité, sans dissimulation ni artifice.'],
[670,'adverb',null],[671,'verb',null],
[672,'noun','Personne qui étudie et expose les faits du passé.'],[673,'verb',null],
[674,'adverb','Avec douceur et délicatesse, sans brusquerie.'],[675,'noun',null],
[676,'noun','Chose matérielle que l’on peut percevoir.'],
[677,'verb','Se montrer à la vue, être visible.'],
[678,'verb','Porter ou déplacer quelque chose vers l’avant.'],[679,'noun','Chacune des parties articulées qui terminent la main.'],
[680,'verb','Ramener une partie du corps en arrière ou l’éloigner de ce vers quoi elle était portée.'],
[681,'verb',null],[682,'verb',null],[683,'verb',null],
[684,'adverb','Marque la répétition d’une action ou d’un fait.'],
[685,'verb','Exercer une pression sur quelque chose en le serrant.'],
[686,'verb','Déformer ou détruire une chose en exerçant sur elle une forte pression.'],
[687,'adjective','Donné pour ce qu’il n’est pas ou pour ce qu’il n’est pas assuré d’être.'],
[688,'noun','Partie concave ou enfoncée d’une surface, notamment de la paume de la main.'],
[689,'noun','Personnes transportées à bord d’un véhicule, sans faire partie de son équipage.']
];
const patches59=[
['comme_manner','4-5',{context:'Pour annoncer la manière dont l’événement s’est déroulé, il dit : « Je raconterai ___ la chose se passa. »'},'Manner is explicit rather than one of four equally possible questions.'],
['paraissait_chapter_05_116','4-5',{context:'Le verbe qui signifie était visible, sans exprimer un mouvement, est « ___ ».'},'Visibility selects paraissait, rather than a compatible movement.'],
['avancant_chapter_05_116','4-5',{context:'En ___ les doigts vers le navire, il les porte en avant et les rapproche du navire.'},'Remove the ambiguous pronoun lui that could refer to the giant.'],
['retirant_chapter_05_116','4-5',{context:'Il ramène ses doigts en arrière, vers lui : il les éloigne du navire en les ___.'},'Explicit backward motion distinguishes withdrawal from spreading or raising.'],
['encore_chapter_05_held_01_116','4-5',{context:'L’adverbe qui marque ici une nouvelle répétition du geste est « ___ ».',choices:['encore','désormais','jamais','déjà']},'Avoid toujours, which can also mean repeatedly; quoted forms remove negation cues.'],
['encore_chapter_05_held_01_116','6-8',{context:'Encore signifie une nouvelle fois. Désormais signifie à partir de maintenant ; jamais nie la réalisation et déjà la présente comme accomplie.',choices:['encore','désormais','jamais','déjà']},'Explicit repeated-action contrasts.'],
['logee_housed','4-5',{context:'Cette hypothèse situe l’âme à l’intérieur de l’animal : elle y serait ___.'},'Explicit location within rather than any state of the soul.'],
['inclinaient_were_inclined','4-5',{context:'Ils tendaient vers cette opinion sans certitude : ils ___ à la croire.',choices:['inclinaient','renonçaient','hésitaient','résistaient']},'All choices permit à; positive tendency selects incliner.'],
['inclinaient_were_inclined','6-8',{context:'Incliner à croire indique une tendance favorable. Renoncer abandonne, hésiter suspend le choix et résister marque une opposition.',choices:['inclinaient','renonçaient','hésitaient','résistaient']},'Align exact semantic contrasts with the middle band.'],
['d_negative_quantity','4-5',{context:'Dans point d’esprit, le déterminant réduit après la négation est « ___ ».',choices:['d’','un','le','cet']},'Quote the form so elision and blank spacing cannot select it.'],
['d_negative_quantity','6-8',{context:'D’ est ici la forme réduite de l’article après une négation de quantité. Un est indéfini, le défini et cet démonstratif.',choices:['d’','un','le','cet']},'Explicit negative article ownership.'],
['d_adjective','1-3',{answer:'links the pronoun to its adjective',choices:['links the pronoun to its adjective','marks a destination','expresses opposition','compares two quantities']},'Do not translate aussi or the adjective as the meaning of de.'],
['d_adjective','4-5',{context:'Dans quelque chose d’imperceptible, la forme qui relie le pronom à son adjectif est « ___ ».',choices:['d’','très','moins','contre']},'Quoted forms test the relation without an elision cue.'],
['d_adjective','6-8',{context:'D’ relie ici le pronom indéfini à son adjectif. Très et moins modifient le degré ; contre exprime une opposition.',choices:['d’','très','moins','contre']},'Keep the linker separate from degree modifiers.'],
['volee_group','1-3',{answer:'flock; group',choices:['flock; group','letter','map','star']},'Translate the target noun, not its following complement.'],
['revenait_was_returning','4-5',{context:'Le groupe regagnait son point de départ ; ce déplacement est exprimé par « ___ ».'},'Return direction explicitly selects the answer; quoted forms remove complement cues.'],
['cercle_circle','1-3',{answer:'circle',choices:['circle','square','shore','voyage']},'Polaire contributes polar; the noun alone means circle.'],
['ete_motion','1-3',{answer:'gone',choices:['gone','stayed','slept','forgotten']},'The auxiliary avaient contributes the past-perfect construction.'],
['echoua_ran_aground','4-5',{context:'Le bateau heurta les hauts-fonds et y resta immobilisé : il ___.'},'Grounding entails immobilization, not merely collision.'],
['eurent_had','1-3',{answer:'had; experienced',choices:['had; experienced','removed','forgot','measured']},'Peine contributes difficulty; translate only the target verb.'],
['eurent_had','4-5',{context:'Dans ils eurent beaucoup de peine, la forme qui signifie éprouvèrent est « ___ ».'},'Quoted forms avoid selecting by complement compatibility.'],
['sauver_escape','1-3',{answer:'escape; get to safety',choices:['escape; get to safety','rescue someone else','hide an object','lose a ship']},'Idiomatic English for the reflexive escape meaning.'],
['sauver_escape','4-5',{context:'Ils échappèrent au naufrage et gagnèrent un lieu sûr : ils réussirent à se ___.'},'An explicit escape to safety selects sauver.'],
['choisit_chose','4-5',{context:'Il fit une sélection parmi les instruments : il en ___ un pour son usage.'},'Explicit selection cue rather than availability alone.'],
['secours_instrument','4-5',{context:'L’aide fournie par ces instruments est ici appelée leur « ___ ».'},'Four masculine singular nouns; select aid rather than weight or price by meaning.'],
['remuait_was_moving','4-5',{context:'Le verbe qui décrit ses mouvements, par opposition à son immobilité, est « ___ ».'},'Describe the motion itself rather than a merely compatible activity.'],
['adroitement_deftly','4-5',{context:'Avec adresse et habileté dans son geste, il saisit la baleine ___.'},'Positive skill cue.'],
['imagina_supposed','4-5',{context:'La forme verbale qui, avec le pronom réfléchi, exprime une supposition sans constatation est « ___ ».',choices:['imagina','aperçut','souvint','assura']},'Quoted forms eliminate the s’/se cue; perception, memory and verification contrast with supposition.'],
['imagina_supposed','6-8',{context:'S’imagina exprime une supposition. S’aperçut exprime une constatation, se souvint rappelle un souvenir et s’assura indique une vérification.',choices:['imagina','aperçut','souvint','assura']},'Avoid persuaded as a near-competing unverified conviction.'],
['mouvement_movement','4-5',{context:'Le changement de position de cet atome constitue un ___.'},'All choices are masculine singular nouns; identify motion rather than a compatible property.'],
['patiemment_patiently','4-5',{context:'Avec patience, sans s’irriter de la difficulté ni se précipiter, il observa l’animal ___.'},'Explicit patience rather than mere absence of haste.'],
['moyen_possibility','4-5',{context:'La possibilité de réussir à faire quelque chose se nomme ici un « ___ ».',choices:['moyen','obstacle','ordre','devoir']},'Four masculine singular noun choices; quoted frame removes complement-selection cues.'],
['moyen_possibility','6-8',{context:'Pas moyen de croire nie la possibilité. Un obstacle gêne une action, un ordre la commande et un devoir oblige à agir.',choices:['moyen','obstacle','ordre','devoir']},'Same noun contrasts as the middle bank.'],
['dispute_argument','1-3',{answer:'argument; debate',choices:['argument; debate','agreement','silence','journey']},'Keep the discussion of opposing views explicit; do not require a hostile altercation.'],
['dispute_argument','4-5',{context:'Ils opposent vivement leurs idées dans une discussion : cette ___ dure longtemps.'},'The disagreement is expressed verbally; all four nouns are feminine singular.'],
['tomberent_fell','4-5',{context:'Le fil se rompit et les pierres descendirent sous leur propre poids : elles ___ au sol.'},'An explicit downward movement and consistent past narration select the target.'],
['quelques_uns_some_of_them','4-5',{context:'Sans les désigner précisément, il ne recueillit qu’une partie des diamants : ___ furent recueillis.',choices:['quelques-uns','tous','ceux-ci','ceux-là']},'Masculine plural antecedent and four compatible pronouns; an unidentified subset supplies the answer.'],
['quelques_uns_some_of_them','6-8',{context:'Quelques-uns désigne une partie non précisée d’un ensemble. Tous désigne la totalité ; ceux-ci et ceux-là désignent des éléments de manière démonstrative.',choices:['quelques-uns','tous','ceux-ci','ceux-là'],question:'Quel pronom désigne une partie non précisée de l’ensemble ?'},'Remove the gender mismatch and distinguish indefinite from demonstrative reference.'],
['apercut_realized','4-5',{context:'La forme verbale qui, avec le pronom réfléchi, signifie remarqua un fait est « ___ ».',choices:['aperçut','imagina','assura','persuada']},'Quoted forms avoid selecting by the different elision and complement patterns.'],
['etaient_passive','1-3',{context:'Les diamants étaient taillés par un lapidaire.',answer:'were',choices:['were','will be','must be','might be']},'Highlight only étaient, once; taillés contributes cut.'],
['etaient_passive','4-5',{context:'Pour dire au passé que le lapidaire taillait ces pierres, on écrit à la voix passive : « Elles ___ taillées par lui. »'},'Explicit passive construction, without a separate tense-only meaning.'],
['d_article','4-5',{context:'Le déterminant élidé qui introduit ici des instruments sans les identifier est « ___ » dans d’excellents microscopes.'},'A quoted answer frame avoids an apostrophe/space cue and selects indefinite meaning.']
];
export function composeRefinements59(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 for(const[key,band,patch,reason]of patches59){const b=graph.directDraftBankGroups.flatMap(g=>g.banks).find(b=>b.key===key);let raw=JSON.parse(readFileSync(`${folder}/${b.file}`));for(const k of b.selector.split('/').slice(1))raw=raw[k];const tag=b.file+':'+key;if(!items.has(tag))items.set(tag,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});const x=items.get(tag),q=x.after.questions.find(q=>q.band===band),beforeSha256=hash(q);Object.assign(q,patch);x.changes.push({band,beforeSha256,afterSha256:hash(q),reason});}
 for(const x of items.values())x.afterQuestionSha256=hash(x.after.questions);
 return{version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:patches59.length}};
}
export function composeExpressionRefinements59(previous){
 const contexts=[
  'Le déterminant qui présente une quantité non comptée de variété, sans désigner une variété particulière, est « ___ ».',
  'Le déterminant partitif qui introduit argent sans identifier une somme ni en préciser la petitesse est « ___ ».'
 ];
 return previous.banks.map((bank,i)=>{const after=structuredClone(bank),context=contexts[i];
  after.sourceQuestions.find(q=>q.band==='4-5').context=context;
  after.legacyPreparedQuizzes.find(q=>q.band==='levels_4_5').contextFrench=context;
  after.questions.find(q=>q.band==='levels_4_5').context=context;
  if(i===1){const c='De l’ est un article partitif qui laisse la quantité indéterminée, sans la qualifier de petite. Cet désigne, aucun nie toute quantité et un peu d’ indique explicitement une petite quantité.';
   after.sourceQuestions.find(q=>q.band==='6-8').context=c;
   after.sourceQuestions.find(q=>q.band==='6-8').question='Quel est ici l’article partitif, sans indication explicite de petitesse ?';
   after.legacyPreparedQuizzes.find(q=>q.band==='levels_6_8').contextFrench=c;
   after.legacyPreparedQuizzes.find(q=>q.band==='levels_6_8').promptFrench='Quel est ici l’article partitif, sans indication explicite de petitesse ?';
   after.questions.find(q=>q.band==='levels_6_8').context=c;
   after.questions.find(q=>q.band==='levels_6_8').prompt='Quel est ici l’article partitif, sans indication explicite de petitesse ?';
  }
  return{identity:bank.identity,beforeBankSha256:hash(bank),afterBankSha256:hash(after),source:{file:'whole-work-mixed-de-resolution-58.json',selector:`/banks/${i}`},reason:'Quoted answer frames remove elision cues and require an unspecified partitive quantity. Explicitly distinguish an unspecified amount from an amount characterized as small.',selection:'replace_exact_prior_candidate_bank_when_composing_import',after};
 });
}
export function composeWords59(folder){
 const evidence={},cache=new Map(),ensure=(b,s)=>{if(!b)throw Error('Source59: '+s)},read=f=>{if(!cache.has(f)){const b=readFileSync(`${folder}/${f}`);evidence[f]=sha(b);cache.set(f,JSON.parse(b));}return cache.get(f)},pointer=b=>b.selector.split('/').slice(1).reduce((v,k)=>v[k],read(b.file));
 const graph=read('whole-work-identity-dependencies-43.json'),base=read('whole-work-import-composition-42.json'),prev=read('whole-work-mixed-de-resolution-58.json'),refs=read('whole-work-source-bank-refinements-59.json'),p=loadPublication();
 ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged published baseline');
 const names=['whole-work-reviewed-word-bindings-44.json','whole-work-direct-word-package-46.json','whole-work-resolved-word-package-47.json','whole-work-continuation-word-package-49.json','whole-work-reviewed-family-words-51.json','whole-work-source-words-55.json','whole-work-source-words-57.json'];
 const priors=names.map(read),maps={newLemmas:new Map(p.bundle.lemmas.map(x=>[x.id,x])),newSenses:new Map(p.bundle.senses.map(x=>[x.id,x])),newSurfaceForms:new Map(p.bundle.surfaceForms.map(x=>[x.id,x]))},fresh={newLemmas:[],newSenses:[],newSurfaceForms:[]};
 for(const n of Object.keys(maps))for(const a of priors)for(const x of a[n]){ensure(!maps[n].has(x.record.id),'prior record collision');maps[n].set(x.record.id,x.record);}
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d])),source=new Map(base.tokens.map(t=>[coord(t),t])),old=new Set(prev.sourceUsePartition.remainingDirectDraftSourceUses.map(coord));
 const identityGroups=[],occurrenceBindings=[],bankDependencies=[],decisions=[];
 const add=(key,record,extra)=>{ensure(!maps[key].has(record.id),'new record duplicate');maps[key].set(record.id,record);fresh[key].push({record,...extra});};
 const selections=[];
 for(const[index,pos,definition]of specs59){const g=structuredClone(graph.directDraftBankGroups[index]);g.index=index;g.pos=pos;g.definition=definition;g.reason='Reviewed source context and all three exact stored question bands.';
  if(index===670){g.root=structuredClone(declarations.get('chapter-04-identity-plan.json:comme_exclamative').root);g.reason='The already staged adverb covers manner observations as well as degree. Reuse that exact owner and bank, preserving the manner draft as contextual evidence.';}
  if(index===653){g.root=structuredClone(graph.directDraftBankGroups[633].root);g.reason='D’aussi gros links the indefinite pronoun to its adjective, exactly as d’imperceptible. Aussi supplies degree; preserve the original degree bank only as unselected evidence.';}
  if(index===622){g.root={kind:'published_sense',senseId:'sns_de_primary'};g.reason='Approcher de uses the retained verb-complement preposition. Preserve the proposed approach bank as alternate evidence, not a new direction-only meaning.';}
  if(index===623){g.root={kind:'published_sense',senseId:'sns_fr_etre_passive_auxiliary'};g.reason='The passive auxiliary already exists. Add or reuse this printed surface without a tense-only sense.';}
  if(index===619)g.reason='Weight livre is the feminine homograph, separate from the masculine book/ledger owner in the original plan.';
  if(index===624)g.reason='Taillés is the verbal past participle of tailler in the passive construction; do not create an adjective headword tailler.';
  if(index===625){const quantity=structuredClone(g);quantity.pos='preposition';quantity.root={kind:'published_sense',senseId:'sns_de_primary'};quantity.occurrences=g.occurrences.filter(o=>o.unit===149);quantity.reason='Bien d’autres introduces a quantity complement with pronominal autres. Keep this exact use on the existing preposition identity.';g.occurrences=g.occurrences.filter(o=>o.unit!==149);g.reason='D’excellents microscopes and d’autres substances use the already staged plural indefinite determiner, separate from the quantity complement in unit149.';selections.push(g,quantity);}else selections.push(g);
 }
 for(const g of selections){ensure(g.banks.length===1||[636,637,644,664].includes(g.index),'named alternate bank selection');const b=g.banks[0],bank=pointer(b);ensure(hash(bank.questions)===b.questionSha256,'exact bank revision');let senseId,lemmaId;
  if(g.root.kind==='published_sense'){senseId=g.root.senseId;ensure(maps.newSenses.has(senseId),'published meaning exists');lemmaId=maps.newSenses.get(senseId).lemmaId;}
  else{const root=g.root;senseId=id('sns','direct-draft:'+root.declaration);if(maps.newSenses.has(senseId))lemmaId=maps.newSenses.get(senseId).lemmaId;else{ensure(g.definition,'explicit definition for '+g.surface);const decl=declarations.get(root.declaration),rootBank=pointer(decl.bank);if(g.index===652){lemmaId=id('lem','de:determiner');ensure(maps.newLemmas.has(lemmaId),'staged determiner head exists');}else if(g.index===646){lemmaId=id('lem','embarrassé:adjective');if(!maps.newLemmas.has(lemmaId))add('newLemmas',{id:lemmaId,headword:'embarrassé',partOfSpeech:'adjective'},{evidence:decl.evidence});}else if(g.index===619){lemmaId=id('lem','livre:noun:weight-homograph');if(!maps.newLemmas.has(lemmaId))add('newLemmas',{id:lemmaId,headword:'livre',partOfSpeech:'noun'},{homograph:'feminine weight unit',evidence:decl.evidence});}else if(root.lemma.kind==='published_lemma')lemmaId=root.lemma.lemmaId;else{const headword=rootBank.lemma;lemmaId=id('lem',`${headword}:${g.pos}`);if(!maps.newLemmas.has(lemmaId)){ensure(!p.bundle.lemmas.some(l=>l.headword===headword&&l.partOfSpeech===g.pos),'existing head requires explicit choice '+headword);add('newLemmas',{id:lemmaId,headword,partOfSpeech:g.pos},{evidence:decl.evidence});}}
   const gloss=g.index===610?'argument; debate':g.index===665?'ran aground':g.index===660?'gone':rootBank.meaning;add('newSenses',{id:senseId,lemmaId,gloss,definition:g.definition},{declaredSenseRoot:root.declaration,evidence:decl.evidence,definitionAuthority:{file:'scripts/micromegas-source-words-59.mjs',sourceGroupIndex:g.index}});
  }}
  ensure(maps.newLemmas.get(lemmaId)?.partOfSpeech===g.pos,'proper lexical category '+g.surface);
  const candidates=[...maps.newSurfaceForms.values()].filter(x=>x.lemmaId===lemmaId&&x.normalized===g.surface),hasQuiz=x=>[...p.preparedQuizzes.values()].some(q=>q.subject.surfaceFormId===x.id&&q.subject.senseId===senseId),active=candidates.filter(hasQuiz);ensure(active.length<=1&&(active.length===1||candidates.length<=1),'surface ambiguity '+g.surface);
  let surface=active[0]??candidates[0];if(!surface){surface={id:id('srf',`${lemmaId}:${g.surface}`),lemmaId,form:g.surface,normalized:g.surface};add('newSurfaceForms',surface,{evidence:{file:b.file,selector:b.selector}});}
  const identity=surface.id+':'+senseId,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';const merged=identityGroups.find(x=>x.identity===identity);if(merged){ensure(g.index===653,'explicit reviewed same-meaning merger');merged.occurrences.push(...g.occurrences);}else identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(old.has(coord(o))&&t.owner.kind==='draft_bank'&&g.banks.some(x=>x.file===t.owner.file&&x.key===t.owner.key),'available exact source use');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:b.file,selector:b.selector}});}
  const draft={kind:'contextual_draft_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256};const refined=refs.items.find(x=>x.file===b.file&&x.key===b.key);if(refined)draft.reviewedOverlay={evidence:{file:'whole-work-source-bank-refinements-59.json',selector:`/items/${refs.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);const bankCandidates=[draft];if(existing.length){ensure(existing.length===3,'three retained questions');bankCandidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const alt of g.banks.slice(1)){ensure(hash(pointer(alt).questions)===alt.questionSha256,'exact alternate bank');bankCandidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:alt.file,selector:alt.selector},key:alt.key,questionSha256:alt.questionSha256,reason:'The first source bank represents the same reviewed meaning; retain this alternative without creating a second bank.'});}
  if(merged){const dep=bankDependencies.find(x=>x.identity===identity);dep.candidates.push({...draft,kind:'preserved_unselected_contextual_bank',reason:g.reason});}else bankDependencies.push({identity,candidates:bankCandidates,status:'explicit_reviewed_selection'});decisions.push({sourceGroupIndex:g.index,form:g.surface,identity,occurrences:g.occurrences,reason:g.reason,sourceQuestionSha256:b.questionSha256});
 }
 const priorBankFiles=['whole-work-reviewed-word-banks-45.json',...names.slice(1)],priorBanks=new Map();for(const f of priorBankFiles)for(const b of read(f).banks)priorBanks.set(b.identity,{bank:b,file:f});
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!priorBanks.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]},prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{const old=priorBanks.get(g.identity);if(!old)return prepared.banks.find(b=>b.identity===g.identity);return{...old.bank,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:old.file,selector:`/banks/${read(old.file).banks.indexOf(old.bank)}`},questionSha256:old.bank.questionSha256},masteryAction:g.masteryAction};});
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'disjoint source bindings');const remaining=prev.sourceUsePartition.remainingDirectDraftSourceUses.filter(o=>!bound.has(coord(o))),keys=new Set(remaining.map(coord));
 return{version:1,workId:graph.workId,status:'offline_source_word_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,expressionBankRefinements:composeExpressionRefinements59(prev),...fresh,identityGroups,occurrenceBindings,bankDependencies,banks,decisions,remainingDirectDraftOccurrences:remaining,sourceGroupRange:{first:610,last:specs59.at(-1)[0]},lexicalAuthorities:[{key:'etre_motion',url:'https://www.dictionnaire-academie.fr/article/A9E2986',reading:'Être can be used at past tenses with the meaning aller; avaient été faire des observations expresses having gone to make observations.'},{key:'carats_small_diamonds_sold_by_wei',url:'https://www.dictionnaire-academie.fr/article/A4C0403',reading:'Historical extension: small diamonds sold by weight; not a unit of length or the weight itself.'}],summary:{reviewedSourceGroups:specs59.length,boundDirectDraftIdentityGroups:identityGroups.length,boundDirectDraftSourceUses:occurrenceBindings.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:fresh.newLemmas.length,newSenses:fresh.newSenses.length,newSurfaceForms:fresh.newSurfaceForms.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,refinedBanks:refs.summary.refinedBanks,refinedQuestionBands:refs.summary.refinedQuestionBands,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>keys.has(coord(o)))).length,refinedExpressionBanks:2,refinedExpressionQuestionBands:3,pendingPhraseSpans:base.phrases.length}};
}
