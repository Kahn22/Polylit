import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{loadPublication}from'./micromegas-publication-baseline.mjs';
import{composeMicromegasReviewedWordBanks}from'./micromegas-reviewed-word-banks.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`,coord=o=>`${o.unit}:${o.start}:${o.end}`;
export const specs61=[
[790,'adverb',null],[791,'adjective',null],[792,'verb',null],[793,'hold',null],
[794,'noun','Ce qui possède la même valeur ou remplit le même rôle qu’une autre chose.'],
[795,'verb','Considérer une qualité ou une faculté comme appartenant à quelqu’un ou à quelque chose.'],
[796,'verb',null],[797,'adjective','Qui est contraire à la raison ou au bon sens.'],[798,'verb',null],[799,'verb',null],
[800,'verb','Prononcer ou énoncer à voix haute des paroles.'],
[801,'noun','Mot ou ensemble de mots prononcés pour exprimer quelque chose.'],[802,'verb',null],
[803,'noun','Raison ou raisonnement employé pour soutenir une affirmation.'],[804,'verb',null],[805,'noun',null],
[806,'verb',null],[807,'verb',null],[808,'verb',null],[809,'adverb',null],
[810,'noun','Au pluriel, outil de coupe constitué de deux lames articulées qui se croisent.'],
[811,'pronoun','Dans cet emploi ancien, introduit un complément de moyen et signifie avec lequel ou avec lesquels.'],
[812,'verb','Sectionner ou détacher une partie d’une chose à l’aide d’un instrument tranchant.'],
[813,'noun','Petit morceau détaché d’une chose en en coupant le bord ou l’extrémité.'],[814,'adjective',null],
[815,'adjective','Qui présente une grande étendue ou offre beaucoup d’espace.'],
[816,'noun','Ustensile à large ouverture, généralement conique, prolongé par un tube étroit.'],
[817,'noun','Conduit creux, généralement allongé, par lequel peut passer un fluide ou un son.'],
[818,'noun','Organe de l’ouïe, notamment sa partie extérieure.'],
[819,'verb','Entourer de tous côtés, contenir à l’intérieur d’un contour.'],
[820,'adjective','Qui a peu d’intensité, en parlant notamment d’un son.'],[821,'verb',null],
[822,'noun','Éléments fins et allongés, comparables à des filaments, qui constituent une matière.'],
[823,'adjective','Qui a la forme d’un cercle ou suit un cercle.'],
[824,'noun','Habileté ingénieuse à réaliser un travail ou à inventer un moyen d’agir.'],
[825,'noun','Bruit continu et sourd, comparable à celui d’insectes en vol.'],
[826,'verb','Réussir à atteindre un résultat, notamment après des efforts.'],
[827,'verb','Percevoir séparément et reconnaître ce qui se mêle à d’autres choses.'],[828,'noun',null],
[829,'verb','Comprendre le sens de paroles ou d’une langue.'],
[830,'noun','Langue française.'],[831,'noun','Caractère de ce qui exige un effort ou présente un obstacle à surmonter.'],
[832,'verb','Augmenter sensiblement d’intensité ou de force.'],[833,'verb',null],
[834,'noun','Par comparaison, êtres d’une extrême petitesse évoquant de minuscules insectes.'],
[835,'adjective','Dont on ne peut donner l’explication.'],[836,'verb',null],
[837,'noun','Bruit intense produit par la foudre, auquel on compare une voix très forte.'],
[838,'adverb','Particule explétive qui accompagne notamment un verbe de crainte sans exprimer de négation.'],
[839,'verb','Rendre sourd ou gêner fortement l’audition par un bruit intense.'],
[840,'verb','Rendre moins grand, moins fort ou moins intense.'],[841,'verb',null],
[842,'noun','Petits bâtonnets pointus servant à retirer les débris qui restent entre les dents.'],
[843,'adjective','Qui s’amincit et se termine en pointe.'],
[844,'verb','Aboutir à un lieu, atteindre un endroit, dans cet emploi spatial intransitif.'],
[845,'noun','Articulations entre les cuisses et les jambes ; par extension, la partie sur laquelle repose une personne assise sur les genoux d’une autre.'],
[846,'verb','Faire descendre une partie du corps ou une chose vers une position moins haute.'],
[847,'preposition','À l’aide de, grâce aux moyens ou aux conditions indiqués.'],
[848,'noun','Mesures prises à l’avance pour prévenir un danger ou une difficulté.'],[849,'adverb',null],
[850,'noun','Développement suivi de paroles adressées à des auditeurs.'],[851,'adjective',null],[852,'verb',null],
[853,'noun','Profondeur immense, figurément impossible à sonder.'],[854,'verb',null],[855,'verb',null],
[856,'verb','Consentir à faire quelque chose en marquant une faveur ou une supériorité.'],
[857,'verb','Révéler à quelqu’un ce qui lui était caché ou inconnu.'],[858,'verb',null],
[859,'adjective','Que l’esprit ne parvient pas à comprendre ou à sonder.'],[860,'verb',null],[861,'verb',null],
[862,'noun','Aide ou appui qui met à l’abri d’un danger.'],[863,'verb',null],[864,'verb',null],[865,'verb',null],
[866,'verb','Provenir d’un lieu, en parlant notamment de paroles ou de sons.'],
[867,'noun','Prêtre chargé du service religieux auprès d’un groupe ou dans un établissement.'],
[868,'verb','Prononcer à voix haute un texte, notamment appris ou fixé à l’avance.'],
[869,'noun','Paroles adressées à une divinité pour la louer, la remercier ou lui demander quelque chose.'],
[870,'noun','Rites religieux destinés à chasser un esprit mauvais.'],
[871,'verb','Prononcer des jurons sous le coup d’une émotion.'],
[872,'noun','Ensemble organisé d’idées ou d’hypothèses proposé pour expliquer un phénomène.'],[873,'noun',null],
[874,'pronoun','Pronom interrogatif employé pour demander l’identité d’une personne.'],
[875,'adjective','Qui a peu de force et n’est pas rude ou violent, en parlant d’une voix.'],[876,'verb',null],[877,'verb',null],[878,'verb',null],[879,'verb',null],[880,'adjective',null],
[881,'adjective','Qui est proche d’un état ou d’une condition, par comparaison ou approximation.'],
[882,'noun','Disparition complète ou réduction au néant.'],[883,'verb',null],[884,'adjective',null],
[885,'verb','Se reproduire et augmenter en nombre, en parlant d’êtres vivants.'],[886,'noun',null],[887,'verb',null],[888,'verb',null],
[889,'verb','Regarder attentivement pour examiner ou étudier.']
];
const patches61=[
['qui_chapter_06_154_200','4-5',{context:'Le pronom interrogatif qui demande l’identité de la personne parlant est « ___ ».'},'Quoted forms avoid a missing subject with the adverb distractors.'],
['douce_chapter_06_03_155_43','4-5',{context:'Sa voix avait peu de puissance et aucune dureté sonore : elle était ___.'},'Include gentleness as well as low volume.'],
['avoir_chapter_06_03_156_96','4-5',{context:'Dans après les avoir plaints, le verbe qui sert d’auxiliaire à l’infinitif passé est « ___ ».'},'Quoted forms remove incompatible participle complements.'],
['avaient_chapter_06_03_156_150','4-5',{context:'Dans ils avaient toujours été dans cet état, le mot qui sert d’auxiliaire au plus-que-parfait est « ___ ».'},'Quoted forms remove incompatible participle complements.'],
['multipliaient_chapter_06_04_156_330','4-5',{context:'Dans cet emploi intransitif ancien, le verbe qui signifie se reproduisaient et augmentaient en nombre est « ___ ».'},'Preserve the intransitive source use without supplying a reflexive clitic.'],
['a_chapter_06_03_150_135','4-5',{context:'Dans il a découvert un secret, la forme qui sert d’auxiliaire au passé composé est « ___ ».'},'Quoted forms remove participle-complement mismatches.'],
['eu_chapter_06_03_152_17','4-5',{context:'Dans il y a eu quelqu’un, le participe qui porte le sens d’existence est « ___ ».'},'Quoted forms test existential meaning without malformed compound alternatives.'],
['semblaient_chapter_06_03_150_173','4-5',{context:'Le verbe à l’imparfait pluriel qui exprime une impression sans affirmer la réalité ni un changement est « ___ ».'},'Quoted forms remove the adjective-complement mismatch of disparaissaient.'],
['daigné_chapter_06_03_150_137','4-5',{context:'Le participe qui signifie consenti à agir en marquant une faveur ou une supériorité est « ___ ».'},'Explicit lexical definition distinguishes condescension from mere desire or ability.'],
['daignerait_chapter_06_03_151_13','4-5',{context:'Le verbe au conditionnel qui signifie consentirait à agir en marquant une faveur ou une supériorité est « ___ ».'},'Specify the distinctive sense rather than allowing all four modal verbs.'],
['daignerait_chapter_06_03_151_13','6-8',{context:'Quel verbe au conditionnel signifie consentirait à faire quelque chose en marquant une faveur ou une supériorité ?'},'Distinguish daignerait from simple voudrait.'],
['offre_chapter_06_03_151_97','4-5',{context:'Le verbe au présent qui signifie propose quelque chose à votre acceptation est « ___ ».'},'Remove the l’ versus le agreement cue.'],
['offre_chapter_06_03_151_97','6-8',{context:'Quel verbe au présent signifie propose quelque chose à votre acceptation ?'},'Remove clitic context incompatible with distractors.'],
['français_chapter_06_02_141_76','4-5',{context:'La langue appelée French en anglais se nomme en français « ___ ».'},'Quoted masculine singular language nouns remove the le/l’ agreement cue.'],
['n__chapter_06_145_180','4-5',{context:'Dans il craignait que sa voix n’assourdît les passagers, la particule élidée sans valeur négative est « ___ ».'},'Quoted forms test the expletive role rather than a malformed clitic sequence.'],
['craignait_chapter_06_02_145_113','4-5',{context:'Le verbe à l’imparfait qui signifie avait peur d’un événement est « ___ ».'},'Quoted forms avoid differing mood selection after espérer.'],
['donner_chapter_06_03_147_95','4-5',{context:'Dans cet emploi ancien, le verbe intransitif qui signifie atteindre cet endroit ou y aboutir est « ___ ».'},'Quoted forms remove missing objects for the transitive distractors.'],
['encore_chapter_06_03_149_57','4-5',{context:'Le mot qui marque ici un ajout aux mesures déjà prises est « ___ ».'},'Explicit addition rather than a time word that could also fit.'],
['dont_chapter_06_02_138_285','4-5',{context:'Dans cet usage ancien, le relatif qui reprend les ciseaux comme instrument de la coupe est « ___ ».'},'Quoted forms distinguish the instrumental relation without a grammatical completion cue.'],
['grande_chapter_06_02_138_389','4-5',{context:'L’adjectif qui qualifie les dimensions considérables de la trompette est « ___ ».'},'Narrow or short instruments might also occupy much space; specify the lexical quality.'],
['auraient_chapter_06_134_182','4-5',{context:'Dans cette hypothèse, la forme verbale qui signifie posséderaient est « ___ ».'},'Quoted forms avoid the direct object mismatch of manqueraient.'],
['paraissait_chapter_06_135_172','4-5',{context:'La forme qui exprime une impression, sans affirmer la réalité ni un changement, est « ___ ».'},'Quoted forms remove adjective-complement mismatches.'],
['paraissent_chapter_06_138_29','4-5',{context:'Le verbe pluriel qui exprime l’impression donnée, sans affirmer la réalité ni un changement, est « ___ ».'},'Quoted forms remove adjective-complement mismatches.'],
['supposez_chapter_06_137_0','4-5',{context:'Vous admettez cette hypothèse sans l’avoir démontrée : vous ___ que l’argument est plus difficile à produire.'},'Positive provisional acceptance distinguishes supposition from denial or forgetting.']
];
export function composeRefinements61(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 for(const[key,band,patch,reason]of patches61){const b=graph.directDraftBankGroups.flatMap(g=>g.banks).find(b=>b.key===key);let raw=JSON.parse(readFileSync(`${folder}/${b.file}`));for(const k of b.selector.split('/').slice(1))raw=raw[k];const tag=b.file+':'+key;if(!items.has(tag))items.set(tag,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});const x=items.get(tag),q=x.after.questions.find(q=>q.band===band),beforeSha256=hash(q);Object.assign(q,patch);x.changes.push({band,beforeSha256,afterSha256:hash(q),reason});}
 for(const x of items.values())x.afterQuestionSha256=hash(x.after.questions);
 return{version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:patches61.length}};
}
export function composeWords61(folder){
 const evidence={},cache=new Map(),ensure=(b,s)=>{if(!b)throw Error('Source61: '+s)},read=f=>{if(!cache.has(f)){const b=readFileSync(`${folder}/${f}`);evidence[f]=sha(b);cache.set(f,JSON.parse(b));}return cache.get(f)},pointer=b=>b.selector.split('/').slice(1).reduce((v,k)=>v[k],read(b.file));
 const graph=read('whole-work-identity-dependencies-43.json'),base=read('whole-work-import-composition-42.json'),prev=read('whole-work-source-words-60.json'),refs=read('whole-work-source-bank-refinements-61.json'),p=loadPublication();
 ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged published baseline');
 const names=['whole-work-reviewed-word-bindings-44.json','whole-work-direct-word-package-46.json','whole-work-resolved-word-package-47.json','whole-work-continuation-word-package-49.json','whole-work-reviewed-family-words-51.json','whole-work-source-words-55.json','whole-work-source-words-57.json','whole-work-source-words-59.json','whole-work-source-words-60.json'];
 const priors=names.map(read),maps={newLemmas:new Map(p.bundle.lemmas.map(x=>[x.id,x])),newSenses:new Map(p.bundle.senses.map(x=>[x.id,x])),newSurfaceForms:new Map(p.bundle.surfaceForms.map(x=>[x.id,x]))},fresh={newLemmas:[],newSenses:[],newSurfaceForms:[]};
 for(const n of Object.keys(maps))for(const a of priors)for(const x of a[n]){ensure(!maps[n].has(x.record.id),'prior record collision');maps[n].set(x.record.id,x.record);}
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d])),source=new Map(base.tokens.map(t=>[coord(t),t])),old=new Set(prev.remainingDirectDraftOccurrences.map(coord));
 const identityGroups=[],occurrenceBindings=[],bankDependencies=[],decisions=[];
 const ownershipHolds=[{sourceGroupIndex:793,form:'qu’auraient',occurrences:structuredClone(graph.directDraftBankGroups[793].occurrences),reason:'The source token contains two lexical components: interrogative que and conditional avoir. Do not create a fused surface under the avoir lemma. Preserve the exact unbound source use until a two-component source refinement and separate question banks are prepared.'}];
 const add=(key,record,extra)=>{ensure(!maps[key].has(record.id),'new record duplicate');maps[key].set(record.id,record);fresh[key].push({record,...extra});};
 const selections=[];
 for(const[index,pos,definition]of specs61){const g=structuredClone(graph.directDraftBankGroups[index]);g.index=index;g.pos=pos;g.definition=definition;g.reason='Reviewed source context and all three exact stored question bands.';
  if(index===793)continue;
  if(index===881){g.root={kind:'planned_sense',declaration:'chapter-06-identity-targets-04.json:voisin_chapter_06_04_156_197',lemma:{kind:'planned_lemma',declaration:'chapter-03-identity-plan.json:voisine_nearby'}};g.reason='Abstract proximity to annihilation is distinct from the staged spatial-only definition. Reuse the adjective lemma, not the published voisin noun.';}
  if(index===871)g.reason='Published jurer banks describe solemn promises; retain them and separate the cursing meaning.';
  if(index===874)g.reason='Published qui banks describe relative clauses; this indirect question asks for a person’s identity.';
  if(index===835)g.reason='The homographic published inexplicable adjective belongs to Spanish (lem_es_inexplicable_adjective); create a distinct French lemma and identity without transferring Spanish mastery.';
  if(index===846){g.root={kind:'planned_sense',declaration:'chapter-06-identity-targets-03.json:baissait_chapter_06_03_148_90',lemma:{kind:'planned_lemma',declaration:'chapter-04-identity-plan.json:baisserent_bent_down'}};g.reason='Lowering the head is transitive. The staged se baisser sense explicitly describes bending the whole body; keep that prior meaning unchanged.';}
  if(index===843)g.reason='Effilé describes the pointed shape; use an adjective headword effilé, not an adjective lemma effiler.';
  selections.push(g);
 }
 for(const g of selections){ensure(g.banks.length===1||[814].includes(g.index),'named alternate bank selection');const b=g.banks[0],bank=pointer(b);ensure(hash(bank.questions)===b.questionSha256,'exact bank revision');let senseId,lemmaId;
  if(g.root.kind==='published_sense'){senseId=g.root.senseId;ensure(maps.newSenses.has(senseId),'published meaning exists');lemmaId=maps.newSenses.get(senseId).lemmaId;}
  else{const root=g.root;senseId=id('sns','direct-draft:'+root.declaration);if(maps.newSenses.has(senseId))lemmaId=maps.newSenses.get(senseId).lemmaId;else{ensure(g.definition,'explicit definition for '+g.surface);const decl=declarations.get(root.declaration),rootBank=pointer(decl.bank);if(g.index===843){lemmaId=id('lem','effilé:adjective');if(!maps.newLemmas.has(lemmaId))add('newLemmas',{id:lemmaId,headword:'effilé',partOfSpeech:'adjective'},{evidence:decl.evidence});}else if(root.lemma.kind==='published_lemma')lemmaId=root.lemma.lemmaId;else{const headword=rootBank.lemma;lemmaId=id('lem',`${headword}:${g.pos}`);if(!maps.newLemmas.has(lemmaId)){ensure(!p.bundle.lemmas.some(l=>l.headword===headword&&l.partOfSpeech===g.pos&&!(g.index===835&&l.id==='lem_es_inexplicable_adjective')),'existing head requires explicit choice '+headword);add('newLemmas',{id:lemmaId,headword,partOfSpeech:g.pos},{evidence:decl.evidence});}}
   const gloss=rootBank.meaning;add('newSenses',{id:senseId,lemmaId,gloss,definition:g.definition},{declaredSenseRoot:root.declaration,evidence:decl.evidence,definitionAuthority:{file:'scripts/micromegas-source-words-61.mjs',sourceGroupIndex:g.index}});
  }}
  ensure(maps.newLemmas.get(lemmaId)?.partOfSpeech===g.pos,'proper lexical category '+g.surface);
  const candidates=[...maps.newSurfaceForms.values()].filter(x=>x.lemmaId===lemmaId&&x.normalized===g.surface),hasQuiz=x=>[...p.preparedQuizzes.values()].some(q=>q.subject.surfaceFormId===x.id&&q.subject.senseId===senseId),active=candidates.filter(hasQuiz);ensure(active.length<=1&&(active.length===1||candidates.length<=1),'surface ambiguity '+g.surface);
  let surface=active[0]??candidates[0];if(!surface){surface={id:id('srf',`${lemmaId}:${g.surface}`),lemmaId,form:g.surface,normalized:g.surface};add('newSurfaceForms',surface,{evidence:{file:b.file,selector:b.selector}});}
  const identity=surface.id+':'+senseId,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';const merged=identityGroups.find(x=>x.identity===identity);if(merged){ensure(false,'unexpected same-key merger');merged.occurrences.push(...g.occurrences);}else identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(old.has(coord(o))&&t.owner.kind==='draft_bank'&&g.banks.some(x=>x.file===t.owner.file&&x.key===t.owner.key),'available exact source use');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:b.file,selector:b.selector}});}
  const draft={kind:'contextual_draft_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256};const refined=refs.items.find(x=>x.file===b.file&&x.key===b.key);if(refined)draft.reviewedOverlay={evidence:{file:'whole-work-source-bank-refinements-61.json',selector:`/items/${refs.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);const bankCandidates=[draft];if(existing.length){ensure(existing.length===3,'three retained questions');bankCandidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const alt of g.banks.slice(1)){ensure(hash(pointer(alt).questions)===alt.questionSha256,'exact alternate bank');bankCandidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:alt.file,selector:alt.selector},key:alt.key,questionSha256:alt.questionSha256,reason:'The first source bank represents the same reviewed meaning; retain this alternative without creating a second bank.'});}
  if(merged){const dep=bankDependencies.find(x=>x.identity===identity);dep.candidates.push({...draft,kind:'preserved_unselected_contextual_bank',reason:g.reason});}else bankDependencies.push({identity,candidates:bankCandidates,status:'explicit_reviewed_selection'});decisions.push({sourceGroupIndex:g.index,form:g.surface,identity,occurrences:g.occurrences,reason:g.reason,sourceQuestionSha256:b.questionSha256});
 }
 const priorBankFiles=['whole-work-reviewed-word-banks-45.json',...names.slice(1)],priorBanks=new Map();for(const f of priorBankFiles)for(const b of read(f).banks)priorBanks.set(b.identity,{bank:b,file:f});
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!priorBanks.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]},prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{const old=priorBanks.get(g.identity);if(!old)return prepared.banks.find(b=>b.identity===g.identity);return{...old.bank,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:old.file,selector:`/banks/${read(old.file).banks.indexOf(old.bank)}`},questionSha256:old.bank.questionSha256},masteryAction:g.masteryAction};});
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'disjoint source bindings');const remaining=prev.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o))),keys=new Set(remaining.map(coord));
 return{version:1,workId:graph.workId,status:'offline_source_word_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,...fresh,identityGroups,occurrenceBindings,bankDependencies,banks,decisions,ownershipHolds,remainingDirectDraftOccurrences:remaining,sourceGroupRange:{first:790,last:specs61.at(-1)[0]},lexicalAuthorities:[{key:'industrie_ingenuity',url:'https://www.dictionnaire-academie.fr/article/A9I1018',reading:'Literary sense of practical skill and inventiveness, distinct from manufacturing.'}],summary:{reviewedSourceGroups:specs61.length,unresolvedOwnershipGroups:ownershipHolds.length,boundDirectDraftIdentityGroups:identityGroups.length,boundDirectDraftSourceUses:occurrenceBindings.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:fresh.newLemmas.length,newSenses:fresh.newSenses.length,newSurfaceForms:fresh.newSurfaceForms.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,refinedBanks:refs.summary.refinedBanks,refinedQuestionBands:refs.summary.refinedQuestionBands,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>keys.has(coord(o)))).length,pendingPhraseSpans:base.phrases.length}};
}
