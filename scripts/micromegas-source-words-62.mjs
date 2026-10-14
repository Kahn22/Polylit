import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{loadPublication}from'./micromegas-publication-baseline.mjs';
import{composeMicromegasReviewedWordBanks}from'./micromegas-reviewed-word-banks.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`,coord=o=>`${o.unit}:${o.start}:${o.end}`;
export const specs62=[
[890,'noun','Personne avec laquelle on échange des paroles.'],
[891,'noun','Petites plaques percées fixées à un instrument pour effectuer des visées et des alignements.'],
[892,'verb','Orienter un instrument ou ses pièces de visée vers une cible.'],
[893,'noun','Positions successives où l’on place un instrument pour effectuer des observations ou des mesures.'],
[894,'adjective','Qui occupe le rang suivant le deuxième.'],[895,'verb',null],
[896,'preposition','Indique le point de départ d’une étendue dans l’espace.'],
[897,'verb','Dans se tromper, commettre une erreur sans intention de tromper autrui.'],
[898,'verb','Déterminer les dimensions d’une personne ou d’une chose.'],
[899,'noun','Dimension ou étendue physique d’un corps.'],
[900,'pronoun','Avec l’article, reprend une chose appartenant ou se rapportant à une troisième personne.'],
[901,'noun','Savant qui étudie les phénomènes de la nature.'],[902,'verb',null],[903,'adjective',null],
[904,'noun','Action ou projet que l’on suggère à l’acceptation de quelqu’un.'],
[905,'verb','Donner son accord à une proposition ou à une demande.'],[906,'verb',null],[907,'verb',null],
[908,'verb','Dans se tenir, maintenir son corps dans une certaine position.'],
[909,'adverb','En position verticale, le corps reposant sur les pieds.'],
[910,'adverb','À une position plus haute dans l’espace.'],[911,'noun',null],
[912,'verb','Fixer solidement une chose en la dressant.'],[913,'noun','Personne qui porte un titre universitaire obtenu par un doctorat.'],[914,'verb',null],[915,'verb',null],
[916,'noun','Succession d’éléments disposés ou considérés les uns après les autres.'],[917,'noun','Figures géométriques planes à trois côtés.'],
[918,'verb','Raccorder ou relier des choses les unes aux autres.'],[919,'verb',null],
[920,'verb','Articuler ou dire des paroles à voix haute.'],[921,'adjective','Qui se présente au regard ou à l’esprit sans garantir ce qu’est réellement la chose.'],
[922,'adjective','Qui mérite le mépris, qui est indigne d’estime.'],[923,'verb','Exiger un effort ou une peine de quelqu’un.'],[924,'pronoun',null],
[925,'adverb','Marque qu’une possibilité reste valable malgré une objection ou une condition qui pourrait la contrarier.'],
[926,'adjective','Qui a une qualité ou une capacité plus élevée.'],[927,'adjective',null],[928,'verb',null],[929,'verb',null],
[930,'adjective','Capables de comprendre et de raisonner avec discernement.'],
[931,'adverb','Renforce un comparatif en marquant une différence considérable de degré.'],[932,'adverb',null],
[933,'adjective','Qui relève de la fable ou de l’imagination plutôt que de faits établis.'],
[934,'noun','Insectes qui récoltent le nectar des fleurs et produisent du miel.'],[935,'verb',null],[936,'verb',null],
[937,'preposition','Met en relation des êtres ou des choses dont on compare les rapports respectifs.'],[938,'adjective',null],
[939,'preposition','Par comparaison avec, en considérant la différence relative entre deux êtres ou choses.'],
[940,'adjective','Qui suscite de l’intérêt et retient l’attention.'],[941,'noun',null],
[942,'adjective','Qui n’a ni commencement ni fin.'],[943,'verb','Rendre perceptible ou évident.'],[944,'noun',null],
[945,'verb','Éprouver quelque chose avec plaisir.'],[946,'noun',null],[947,'verb',null],[948,'noun',null],
[949,'verb','Faire bouger à plusieurs reprises de côté et d’autre.'],
[950,'adjective','Qui exprime sincèrement ce qu’il pense, sans dissimulation.'],[951,'verb',null],
[952,'verb','Laisser en dehors d’un ensemble ou d’un jugement général comme une exception.'],[953,'adjective',null],
[954,'verb','Tenir en estime et traiter avec respect.'],[955,'noun','Ensemble formé par la réunion de plusieurs éléments ou personnes.'],
[956,'noun','Personnes qui manquent de raison ou de mesure dans leur conduite.'],[957,'noun','Personnes malveillantes qui veulent faire du mal.'],
[958,'noun','Personnes qui souffrent ou se trouvent dans une situation pénible.'],[959,'adverb',null],
[960,'noun','Ce qui nuit ou cause de la souffrance.'],[961,'noun','Couvre-chefs constitués d’une calotte entourée de bords.'],
[962,'verb','Causer la mort d’un être vivant.'],[963,'noun','Couvre-chef formé d’une étoffe enroulée autour de la tête.'],[964,'verb',null],[965,'verb',null],[966,'preposition',null],
[967,'verb','Trembler légèrement sous l’effet d’une émotion.'],[968,'noun','Ce dont on parle ou ce sur quoi porte une discussion ou une querelle.'],[969,'adjective',null]
];
const patches62=[
['sont_chapter_07_02_173_189','4-5',{context:'Dans ils sont massacrés par leurs ennemis, l’auxiliaire passif au présent pluriel est « ___ ».'},'Quoted forms remove incompatible auxiliary alternatives.'],
['malheureux_chapter_07_02_171_250','1-3',{answer:'unfortunate people; people who suffer',choices:['unfortunate people; people who suffer','privileged people','happy people','victors']},'Bind the descriptive unit171 use; defer the reproachful unit179 address to its own meaning and bank.'],

['non_chapter_06_04_166_14','4-5',{context:'Le mot qui exclut le récit inventé au profit des observations est « ___ ».'},'Explicit exclusion rather than a sentence that can add both accounts.'],
['a_chapter_06_03_167_28','4-5',{context:'Dans il y a des animaux, le verbe qui exprime leur existence est « ___ ».'},'Quoted forms avoid malformed alternatives in the existential frame.'],
['pour_held_chapter_06_03','4-5',{context:'Dans ces êtres sont pour les abeilles ce que les abeilles sont pour l’homme, la préposition qui marque le rapport analogique est « ___ ».'},'Identify the relation without relying on complement compatibility.'],
['vastes_chapter_06_04_167_160','4-5',{context:'L’adjectif pluriel qui signifie d’une très grande étendue est « ___ ».'},'Great extent need not exclude narrowness.'],
['devant_chapter_06_04_167_243','4-5',{context:'La préposition qui signifie ici par comparaison avec est « ___ ».'},'Specify comparative meaning rather than a potentially spatial situation.'],
['paraissant_chapter_07_01_169_207','4-5',{context:'Le participe présent qui signifie donnant l’impression d’être est « ___ ».'},'Claims and beliefs may also create impressions; identify the lexical meaning.'],

['au-dessus_chapter_06_04_160_120','4-5',{context:'La locution qui indique une position plus haute dans l’espace est « ___ ».'},'Quoted forms remove the incompatible derrière des complement.'],
['conclurent_chapter_06_04_162_52','4-5',{context:'Le verbe qui signifie tirèrent un résultat de leur raisonnement est « ___ ».'},'Identify inference rather than belief that may follow it.'],
['méprisables_chapter_06_04_164_76','1-3',{answer:'contemptible; unworthy of esteem',choices:['contemptible; unworthy of esteem','admirable','respectable','valuable']},'Paraissent contributes seeming; the adjective contributes unworthiness of esteem.'],
['méprisables_chapter_06_04_164_76','6-8',{context:'Quel adjectif pluriel signifie dignes de mépris, indignes d’estime ?'},'Do not encode seeming in the adjective.'],
['coûte_chapter_06_04_164_114','4-5',{context:'Le verbe qui signifie exige un effort de quelqu’un est « ___ ».'},'Little effort does not establish whether creation also pleases.'],
['encore_chapter_06_03_164_235','4-5',{context:'Le mot qui maintient ici une possibilité malgré la petite taille des êtres est « ___ ».'},'Quoted forms avoid negative polarity and temporal alternatives.'],
['suis_chapter_06_04_164_370','4-5',{context:'Dans je suis descendu, le mot qui sert d’auxiliaire au passé composé est « ___ ».'},'Quoted forms remove incompatible participle complements.'],

['interlocuteur_chapter_06_04_157_107','4-5',{context:'Le nom qui désigne une personne en tant que partenaire d’un échange de paroles est « ___ ».'},'Specify the conversational role rather than exclude a messenger who may also speak.'],
['parla_chapter_06_04_157_212','4-5',{context:'Il exprima ses pensées oralement, sans les chanter : il ___.'},'Speech rather than song; both can express thoughts aloud.'],
['grand_chapter_06_04_159_78','4-5',{context:'L’adjectif qui signifie de dimensions considérables est « ___ ».'},'Large dimensions do not by themselves rule out narrowness.'],
['fût_chapter_06_04_160_82','4-5',{context:'Dans s’il se fût tenu debout, le mot qui sert d’auxiliaire au temps composé est « ___ ».'},'Quoted forms avoid incompatible participle complements.'],
['tenu_chapter_06_04_160_86','4-5',{context:'Avec se, le participe qui signifie maintenu son corps dans une position est « ___ ».'},'Quoted forms remove complement-selection cues.']
];
export function composeRefinements62(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 for(const[key,band,patch,reason]of patches62){const b=graph.directDraftBankGroups.flatMap(g=>g.banks).find(b=>b.key===key);let raw=JSON.parse(readFileSync(`${folder}/${b.file}`));for(const k of b.selector.split('/').slice(1))raw=raw[k];const tag=b.file+':'+key;if(!items.has(tag))items.set(tag,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});const x=items.get(tag),q=x.after.questions.find(q=>q.band===band),beforeSha256=hash(q);Object.assign(q,patch);x.changes.push({band,beforeSha256,afterSha256:hash(q),reason});}
 for(const x of items.values())x.afterQuestionSha256=hash(x.after.questions);
 return{version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:patches62.length}};
}
export function composeWords62(folder){
 const evidence={},cache=new Map(),ensure=(b,s)=>{if(!b)throw Error('Source62: '+s)},read=f=>{if(!cache.has(f)){const b=readFileSync(`${folder}/${f}`);evidence[f]=sha(b);cache.set(f,JSON.parse(b));}return cache.get(f)},pointer=b=>b.selector.split('/').slice(1).reduce((v,k)=>v[k],read(b.file));
 const graph=read('whole-work-identity-dependencies-43.json'),base=read('whole-work-import-composition-42.json'),prev=read('whole-work-source-words-61.json'),refs=read('whole-work-source-bank-refinements-62.json'),p=loadPublication();
 ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged published baseline');
 const names=['whole-work-reviewed-word-bindings-44.json','whole-work-direct-word-package-46.json','whole-work-resolved-word-package-47.json','whole-work-continuation-word-package-49.json','whole-work-reviewed-family-words-51.json','whole-work-source-words-55.json','whole-work-source-words-57.json','whole-work-source-words-59.json','whole-work-source-words-60.json','whole-work-source-words-61.json'];
 const priors=names.map(read),maps={newLemmas:new Map(p.bundle.lemmas.map(x=>[x.id,x])),newSenses:new Map(p.bundle.senses.map(x=>[x.id,x])),newSurfaceForms:new Map(p.bundle.surfaceForms.map(x=>[x.id,x]))},fresh={newLemmas:[],newSenses:[],newSurfaceForms:[]};
 for(const n of Object.keys(maps))for(const a of priors)for(const x of a[n]){ensure(!maps[n].has(x.record.id),'prior record collision');maps[n].set(x.record.id,x.record);}
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d])),source=new Map(base.tokens.map(t=>[coord(t),t])),old=new Set(prev.remainingDirectDraftOccurrences.map(coord));
 const identityGroups=[],occurrenceBindings=[],bankDependencies=[],decisions=[];
 const ownershipHolds=[{sourceGroupIndex:958,form:'malheureux',occurrences:structuredClone(graph.directDraftBankGroups[958].occurrences.filter(o=>o.unit===179)),reason:'The indignant address deplores murderous conduct. Do not apply the descriptive people-who-suffer bank from unit171; prepare a separate reproachful-address sense and three question bands.'}];
 const add=(key,record,extra)=>{ensure(!maps[key].has(record.id),'new record duplicate');maps[key].set(record.id,record);fresh[key].push({record,...extra});};
 const selections=[];
 for(const[index,pos,definition]of specs62){const g=structuredClone(graph.directDraftBankGroups[index]);g.index=index;g.pos=pos;g.definition=definition;g.reason='Reviewed source context and all three exact stored question bands.';
  if(index===925){g.root={kind:'planned_sense',declaration:'chapter-06-identity-targets-03.json:encore_chapter_06_03_164_235',lemma:{kind:'published_lemma',lemmaId:'lem_encore'}};g.reason='Logical persistence despite a condition, not temporal continuation of an action or state. Keep existing encore meanings and mastery unchanged.';}
  if(index===958){g.occurrences=g.occurrences.filter(o=>o.unit===171);g.reason='Bind only the descriptive noun in unit171; the reproachful address in unit179 stays unbound for its own sense and bank.';}
  selections.push(g);
 }
 for(const g of selections){ensure(g.banks.length===1||[].includes(g.index),'named alternate bank selection');const b=g.banks[0],bank=pointer(b);ensure(hash(bank.questions)===b.questionSha256,'exact bank revision');let senseId,lemmaId;
  if(g.root.kind==='published_sense'){senseId=g.root.senseId;ensure(maps.newSenses.has(senseId),'published meaning exists');lemmaId=maps.newSenses.get(senseId).lemmaId;}
  else{const root=g.root;senseId=id('sns','direct-draft:'+root.declaration);if(maps.newSenses.has(senseId))lemmaId=maps.newSenses.get(senseId).lemmaId;else{ensure(g.definition,'explicit definition for '+g.surface);const decl=declarations.get(root.declaration),rootBank=pointer(decl.bank);if(root.lemma.kind==='published_lemma')lemmaId=root.lemma.lemmaId;else{const headword=rootBank.lemma;lemmaId=id('lem',`${headword}:${g.pos}`);if(!maps.newLemmas.has(lemmaId)){ensure(!p.bundle.lemmas.some(l=>l.headword===headword&&l.partOfSpeech===g.pos),'existing head requires explicit choice '+headword);add('newLemmas',{id:lemmaId,headword,partOfSpeech:g.pos},{evidence:decl.evidence});}}
   const gloss=rootBank.meaning;add('newSenses',{id:senseId,lemmaId,gloss,definition:g.definition},{declaredSenseRoot:root.declaration,evidence:decl.evidence,definitionAuthority:{file:'scripts/micromegas-source-words-62.mjs',sourceGroupIndex:g.index}});
  }}
  ensure(maps.newLemmas.get(lemmaId)?.partOfSpeech===g.pos,'proper lexical category '+g.surface);
  const candidates=[...maps.newSurfaceForms.values()].filter(x=>x.lemmaId===lemmaId&&x.normalized===g.surface),hasQuiz=x=>[...p.preparedQuizzes.values()].some(q=>q.subject.surfaceFormId===x.id&&q.subject.senseId===senseId),active=candidates.filter(hasQuiz);ensure(active.length<=1&&(active.length===1||candidates.length<=1),'surface ambiguity '+g.surface);
  let surface=active[0]??candidates[0];if(!surface){surface={id:id('srf',`${lemmaId}:${g.surface}`),lemmaId,form:g.surface,normalized:g.surface};add('newSurfaceForms',surface,{evidence:{file:b.file,selector:b.selector}});}
  const identity=surface.id+':'+senseId,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';const merged=identityGroups.find(x=>x.identity===identity);if(merged){ensure(false,'unexpected same-key merger');merged.occurrences.push(...g.occurrences);}else identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(old.has(coord(o))&&t.owner.kind==='draft_bank'&&g.banks.some(x=>x.file===t.owner.file&&x.key===t.owner.key),'available exact source use');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:b.file,selector:b.selector}});}
  const draft={kind:'contextual_draft_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256};const refined=refs.items.find(x=>x.file===b.file&&x.key===b.key);if(refined)draft.reviewedOverlay={evidence:{file:'whole-work-source-bank-refinements-62.json',selector:`/items/${refs.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);const bankCandidates=[draft];if(existing.length){ensure(existing.length===3,'three retained questions');bankCandidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const alt of g.banks.slice(1)){ensure(hash(pointer(alt).questions)===alt.questionSha256,'exact alternate bank');bankCandidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:alt.file,selector:alt.selector},key:alt.key,questionSha256:alt.questionSha256,reason:'The first source bank represents the same reviewed meaning; retain this alternative without creating a second bank.'});}
  if(merged){const dep=bankDependencies.find(x=>x.identity===identity);dep.candidates.push({...draft,kind:'preserved_unselected_contextual_bank',reason:g.reason});}else bankDependencies.push({identity,candidates:bankCandidates,status:'explicit_reviewed_selection'});decisions.push({sourceGroupIndex:g.index,form:g.surface,identity,occurrences:g.occurrences,reason:g.reason,sourceQuestionSha256:b.questionSha256});
 }
 const priorBankFiles=['whole-work-reviewed-word-banks-45.json',...names.slice(1)],priorBanks=new Map();for(const f of priorBankFiles)for(const b of read(f).banks)priorBanks.set(b.identity,{bank:b,file:f});
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!priorBanks.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]},prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{const old=priorBanks.get(g.identity);if(!old)return prepared.banks.find(b=>b.identity===g.identity);return{...old.bank,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:old.file,selector:`/banks/${read(old.file).banks.indexOf(old.bank)}`},questionSha256:old.bank.questionSha256},masteryAction:g.masteryAction};});
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'disjoint source bindings');const remaining=prev.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o))),keys=new Set(remaining.map(coord));
 return{version:1,workId:graph.workId,status:'offline_source_word_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,...fresh,identityGroups,occurrenceBindings,bankDependencies,banks,decisions,ownershipHolds,remainingDirectDraftOccurrences:remaining,sourceGroupRange:{first:890,last:specs62.at(-1)[0]},lexicalAuthorities:[{key:'malheureux_address',url:'https://www.larousse.fr/dictionnaires/francais/malheureux/48892',reading:'The exclamatory address can deplore conduct, distinct from describing people in misfortune.'},{key:'pinnule_sighting',url:'https://dictionnaire-academie.fr/article/A9P2466',reading:'Pierced instrument plates used for sighting and alignment.'},{key:'station_surveying',url:'https://www.dictionnaire-academie.fr/article/A4S1234',reading:'The 1762 entry explicitly describes instrument positions for trigonometric and levelling observations.'}],summary:{reviewedSourceGroups:specs62.length,unresolvedOwnershipGroups:ownershipHolds.length,boundDirectDraftIdentityGroups:identityGroups.length,boundDirectDraftSourceUses:occurrenceBindings.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:fresh.newLemmas.length,newSenses:fresh.newSenses.length,newSurfaceForms:fresh.newSurfaceForms.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,refinedBanks:refs.summary.refinedBanks,refinedQuestionBands:refs.summary.refinedQuestionBands,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>keys.has(coord(o)))).length,pendingPhraseSpans:base.phrases.length}};
}
