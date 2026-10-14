import{readFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{loadPublication}from'./micromegas-publication-baseline.mjs';
import{composeMicromegasReviewedWordBanks}from'./micromegas-reviewed-word-banks.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x)),id=(p,s)=>`${p}_micromegas_${sha(s).slice(0,16)}`,coord=o=>`${o.unit}:${o.start}:${o.end}`;
export const reviewedLimit64=90;
export const specs64=[
 [
  1050,
  "verb",
  "Construire ou faire naître des idées dans son esprit."
 ],
 [
  1051,
  "verb",
  null
 ],
 [
  1052,
  "noun",
  null
 ],
 [
  1053,
  "noun",
  "Homme âgé, considéré notamment par rapport à des personnes plus jeunes."
 ],
 [
  1054,
  "verb",
  null
 ],
 [
  1055,
  "noun",
  "Adepte de la philosophie d’Aristote."
 ],
 [
  1056,
  "noun",
  "Assurance avec laquelle une personne pense, parle ou agit."
 ],
 [
  1057,
  "noun",
  "Dans la philosophie aristotélicienne, forme essentielle par laquelle un être est constitué et accompli."
 ],
 [
  1058,
  "noun",
  "Capacité ou possibilité d’être, par opposition à la réalisation en acte."
 ],
 [
  1059,
  "adverb",
  "En termes explicites et formels."
 ],
 [
  1060,
  "noun",
  "Extrait ou portion d’un texte."
 ],
 [
  1061,
  "verb",
  null
 ],
 [
  1062,
  "noun",
  "Langue des Grecs."
 ],
 [
  1063,
  "noun",
  null
 ],
 [
  1064,
  "noun",
  "Personne qui possède des connaissances approfondies."
 ],
 [
  1065,
  "noun",
  null
 ],
 [
  1066,
  "verb",
  null
 ],
 [
  1067,
  "noun",
  "Adepte de la philosophie de Descartes."
 ],
 [
  1068,
  "noun",
  null
 ],
 [
  1069,
  "adjective",
  "Relatif à l’être, à la réalité et aux premiers principes de la connaissance."
 ],
 [
  1070,
  "verb",
  null
 ],
 [
  1071,
  "noun",
  "Établissement destiné à l’enseignement."
 ],
 [
  1072,
  "adjective",
  "Qui possède des connaissances approfondies."
 ],
 [
  1073,
  "preposition",
  "Introduit un résultat qui contraste avec la situation précédente."
 ],
 [
  1074,
  "adjective",
  null
 ],
 [
  1075,
  "verb",
  null
 ],
 [
  1076,
  "noun",
  "Partie saillante du bas du visage, située sous la bouche."
 ],
 [
  1077,
  "hold",
  null
 ],
 [
  1078,
  "verb",
  null
 ],
 [
  1079,
  "adjective",
  null
 ],
 [
  1080,
  "noun",
  "Étendues mesurables d’un objet dans l’espace, telles que longueur, largeur et profondeur."
 ],
 [
  1081,
  "adjective",
  "Qui a un poids et est soumis à la pesanteur."
 ],
 [
  1082,
  "adjective",
  "Qui peut être partagé en plusieurs parties."
 ],
 [
  1083,
  "verb",
  null
 ],
 [
  1084,
  "noun",
  "Propriétés que l’on reconnaît à une chose."
 ],
 [
  1085,
  "noun",
  null
 ],
 [
  1086,
  "adjective",
  "Relatif à la philosophie de Malebranche ou qui y adhère."
 ],
 [
  1087,
  "verb",
  "Dans se mêler de, prendre part à une affaire ou y intervenir."
 ],
 [
  1088,
  "verb",
  null
 ],
 [
  1089,
  "noun",
  "Terme d’adresse familier ou bienveillant, sans impliquer une amitié établie."
 ],
 [
  1090,
  "noun",
  "Adepte de la philosophie de Leibniz."
 ],
 [
  1091,
  "noun",
  "Tige mobile indiquant les heures sur le cadran d’une horloge."
 ],
 [
  1092,
  "verb",
  "Faire entendre le son d’un carillon."
 ],
 [
  1093,
  "noun",
  "Encadrement ou partie qui entoure les bords d’un objet."
 ],
 [
  1094,
  "adjective",
  "Facile à comprendre."
 ],
 [
  1095,
  "noun",
  "Personne qui soutient une doctrine ou y adhère."
 ],
 [
  1096,
  "adverb",
  null
 ],
 [
  1097,
  "verb",
  null
 ],
 [
  1098,
  "adjective",
  "Qui n’a pas de nature matérielle ou corporelle."
 ],
 [
  1099,
  "adjective",
  null
 ],
 [
  1100,
  "verb",
  "Considérer avec un profond respect."
 ],
 [
  1101,
  "adjective",
  null
 ],
 [
  1102,
  "verb",
  "Dans il appartient à quelqu’un de, relever de son droit, de sa responsabilité ou de son ressort."
 ],
 [
  1103,
  "verb",
  "Imposer des limites à une chose ou à son étendue."
 ],
 [
  1104,
  "verb",
  "Dans se contenter de, s’en tenir à quelque chose sans rechercher davantage."
 ],
 [
  1105,
  "verb",
  null
 ],
 [
  1106,
  "verb",
  null
 ],
 [
  1107,
  "noun",
  "Adepte d’une doctrine."
 ],
 [
  1108,
  "adjective",
  "Qui atteint un degré très élevé."
 ],
 [
  1109,
  "noun",
  "Manque de proportion ou grand écart d’échelle entre des choses."
 ],
 [
  1110,
  "verb",
  null
 ],
 [
  1111,
  "noun",
  "Animal extrêmement petit ; par comparaison, être minuscule."
 ],
 [
  1112,
  "noun",
  null
 ],
 [
  1113,
  "noun",
  "Ouvrage réunissant de façon étendue les connaissances d’un domaine."
 ],
 [
  1114,
  "adjective",
  "Reconnu pour sa sainteté, notamment comme qualification devant un nom de personne."
 ],
 [
  1115,
  "verb",
  null
 ],
 [
  1116,
  "adjective",
  "Qui appartient au ciel ou aux astres."
 ],
 [
  1117,
  "verb",
  "Maintenir et défendre une affirmation."
 ],
 [
  1118,
  "noun",
  "Globes ou domaines célestes considérés comme des lieux d’existence."
 ],
 [
  1119,
  "adverb",
  "De façon exclusive, sans autre objet."
 ],
 [
  1120,
  "verb",
  "Éprouver une difficulté à respirer, notamment sous l’effet d’un rire excessif."
 ],
 [
  1121,
  "noun",
  "Manifestation sonore de la gaieté ou de l’amusement."
 ],
 [
  1122,
  "adjective",
  "Qui ne peut être éteint ou arrêté."
 ],
 [
  1123,
  "noun",
  null
 ],
 [
  1124,
  "noun",
  "Secousses brusques et involontaires du corps."
 ],
 [
  1125,
  "verb",
  null
 ],
 [
  1126,
  "verb",
  null
 ],
 [
  1127,
  "verb",
  "Remettre en ordre ou ajuster de nouveau ce qui s’est dérangé."
 ],
 [
  1128,
  "adjective",
  "Mécontent ou irrité."
 ],
 [
  1129,
  "verb",
  null
 ],
 [
  1130,
  "noun",
  "Opinion excessivement haute de sa propre valeur ou importance."
 ],
 [
  1131,
  "adjective",
  null
 ],
 [
  1132,
  "noun",
  "Réflexion raisonnée sur les questions fondamentales de l’existence, de la réalité et de la connaissance."
 ],
 [
  1133,
  "verb",
  null
 ],
 [
  1134,
  "adverb",
  "En petits caractères, en parlant d’écriture."
 ],
 [
  1135,
  "noun",
  "Utilisation d’une chose en vue du service ou du bénéfice qu’elle procure."
 ],
 [
  1136,
  "adverb",
  "En réalité ; confirme ce qui vient d’être annoncé ou affirmé."
 ],
 [
  1137,
  "noun",
  "Action ou moment de quitter un lieu."
 ],
 [
  1138,
  "noun",
  null
 ],
 [
  1139,
  "verb",
  null
 ]
].slice(0,reviewedLimit64);
const allPatches64=[
 [
  "demandez_chapter_07_05_200_41",
  "4-5",
  {
   "context": "Le verbe qui signifie posez une question pour obtenir une réponse est « ___ »."
  },
  "Remove missing-complement cues in the original cloze."
 ],
 [
  "être_chapter_07_01_204_207",
  "4-5",
  {
   "context": "L’infinitif qui, employé absolument, signifie exister est « ___ »."
  },
  "Quoted forms remove the missing complement of devenir."
 ],
 [
  "ami_chapter_07_06_205_12",
  "1-3",
  {
   "answer": "friend; a familiar form of address",
   "choices": [
    "friend; a familiar form of address",
    "enemy; a hostile opponent",
    "stranger; an unknown person",
    "adversary; a rival"
   ]
  },
  "The vocative does not assert an established reciprocal friendship."
 ],
 [
  "ami_chapter_07_06_205_12",
  "4-5",
  {
   "context": "Pour s’adresser familièrement et avec bienveillance à cet interlocuteur, il l’appelle « mon ___ »."
  },
  "Use the source familiar address rather than a factual friendship claim."
 ],
 [
  "ami_chapter_07_06_205_12",
  "6-8",
  {
   "context": "Quel nom masculin sert ici d’adresse familière et bienveillante, sans prouver une amitié déjà établie ?"
  },
  "Keep the address meaning explicit."
 ],
 [
  "carillonne_chapter_07_06_205_170",
  "4-5",
  {
   "context": "Le verbe qui signifie fait entendre un carillon est « ___ »."
  },
  "The clock can advance while chiming; identify the lexical meaning."
 ],
 [
  "révère_chapter_07_06_208_3",
  "4-5",
  {
   "context": "Le verbe qui signifie considère avec un profond respect est « ___ »."
  },
  "Avoid the la/insulte elision cue."
 ],
 [
  "contente_chapter_07_06_208_99",
  "6-8",
  {
   "context": "Quel verbe, dans je me … de, signifie m’en tiens à cela sans prétendre davantage ?"
  },
  "Correct the mismatched person in s’en tiens."
 ],
 [
  "saint_chapter_07_06_210_205",
  "6-8",
  {
   "context": "Quel adjectif religieux qualifie une personne reconnue par l’Église pour sa vie exemplaire et honorée dans son culte ?"
  },
  "Remove answer leakage through sainte."
 ],
 [
  "rire_chapter_07_06_211_90",
  "4-5",
  {
   "context": "Le nom masculin qui désigne la manifestation sonore de gaieté est « ___ »."
  },
  "A cry can also express joy; ask for the lexical meaning."
 ],
 [
  "écrit_chapter_07_07_214_58",
  "6-8",
  {
   "context": "Quel participe signifie représenté avec des lettres sur un support ?"
  },
  "Remove the answer écrit from the prompt."
 ],
 [
  "usage_chapter_07_07_214_84",
  "4-5",
  {
   "context": "L’utilisation prévue de ce livre, destiné à leur servir, est son ___.",
   "choices": [
    "usage",
    "achat",
    "transport",
    "stockage"
   ]
  },
  "Replace feminine vente with masculine transport and specify utilization."
 ],
 [
  "menu_chapter_07_07_214_69",
  "4-5",
  {
   "context": "L’adverbe qui signifie en petits caractères, à propos de l’écriture, est « ___ »."
  },
  "Small letters can also be written quickly or slowly; identify the meaning."
 ],
 [
  "effectivement_chapter_07_07_215_0",
  "4-5",
  {
   "context": "L’adverbe qui confirme que la promesse a bien été réalisée est « ___ »."
  },
  "An event can also occur unfortunately; remove the compatible alternative."
 ]
];
export function composeRefinements64(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 const selected=new Set(specs64.flatMap(([i])=>graph.directDraftBankGroups[i].banks.map(b=>b.key))),patches64=allPatches64.filter(x=>selected.has(x[0]));
 for(const[key,band,patch,reason]of patches64){const b=graph.directDraftBankGroups.flatMap(g=>g.banks).find(b=>b.key===key);let raw=JSON.parse(readFileSync(`${folder}/${b.file}`));for(const k of b.selector.split('/').slice(1))raw=raw[k];const tag=b.file+':'+key;if(!items.has(tag))items.set(tag,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});const x=items.get(tag),q=x.after.questions.find(q=>q.band===band),beforeSha256=hash(q);Object.assign(q,patch);x.changes.push({band,beforeSha256,afterSha256:hash(q),reason});}
 for(const x of items.values())x.afterQuestionSha256=hash(x.after.questions);
 return{version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:patches64.length}};
}
export function composeWords64(folder){
 const evidence={},cache=new Map(),ensure=(b,s)=>{if(!b)throw Error('Source64: '+s)},read=f=>{if(!cache.has(f)){const b=readFileSync(`${folder}/${f}`);evidence[f]=sha(b);cache.set(f,JSON.parse(b));}return cache.get(f)},pointer=b=>b.selector.split('/').slice(1).reduce((v,k)=>v[k],read(b.file));
 const graph=read('whole-work-identity-dependencies-43.json'),base=read('whole-work-import-composition-42.json'),prev=read('whole-work-source-words-63.json'),refs=read('whole-work-source-bank-refinements-64.json'),p=loadPublication();
 ensure(hash(p.bundle)===graph.publicationBaseline.bundleSha256&&hash([...p.preparedQuizzes.values()])===graph.publicationBaseline.quizzesSha256,'unchanged published baseline');
 const names=['whole-work-reviewed-word-bindings-44.json','whole-work-direct-word-package-46.json','whole-work-resolved-word-package-47.json','whole-work-continuation-word-package-49.json','whole-work-reviewed-family-words-51.json','whole-work-source-words-55.json','whole-work-source-words-57.json','whole-work-source-words-59.json','whole-work-source-words-60.json','whole-work-source-words-61.json','whole-work-source-words-62.json','whole-work-source-words-63.json'];
 const priors=names.map(read),maps={newLemmas:new Map(p.bundle.lemmas.map(x=>[x.id,x])),newSenses:new Map(p.bundle.senses.map(x=>[x.id,x])),newSurfaceForms:new Map(p.bundle.surfaceForms.map(x=>[x.id,x]))},fresh={newLemmas:[],newSenses:[],newSurfaceForms:[]};
 for(const n of Object.keys(maps))for(const a of priors)for(const x of a[n]){ensure(!maps[n].has(x.record.id),'prior record collision');maps[n].set(x.record.id,x.record);}
 const declarations=new Map(graph.declarations.map(d=>[d.declaration,d])),source=new Map(base.tokens.map(t=>[coord(t),t])),old=new Set(prev.remainingDirectDraftOccurrences.map(coord));
 const identityGroups=[],occurrenceBindings=[],bankDependencies=[],decisions=[];
 const ownershipHolds=specs64.some(([i])=>i===1077)?[{sourceGroupIndex:1077,form:'qu’entends',occurrences:structuredClone(graph.directDraftBankGroups[1077].occurrences),reason:'Separate interrogative que and entendre meaning/intention components are required; do not create a fused verb surface.'}]:[];
 const add=(key,record,extra)=>{ensure(!maps[key].has(record.id),'new record duplicate');maps[key].set(record.id,record);fresh[key].push({record,...extra});};
 const selections=[];
 for(const[index,pos,definition]of specs64){const g=structuredClone(graph.directDraftBankGroups[index]);g.index=index;g.pos=pos;g.definition=definition;g.reason='Reviewed source context and all three exact stored question bands.';
  if(index===1077)continue;
  if(index===1050){g.root={kind:'planned_sense',declaration:'chapter-07-identity-targets-04.json:formez_chapter_07_04_192_54',lemma:{kind:'planned_lemma',declaration:'chapter-01-identity-plan.json:former_cultivate_mind'}};g.reason='Constructing an idea differs from cultivating mental faculties and forming a living being.';}
  if(index===1085){g.root={kind:'published_sense',senseId:'sns_micromegas_2d3ad42b9d9db969',lemma:{kind:'planned_lemma',declaration:'chapter-01-identity-plan.json:sages_wise_people'}};g.reason='Reuse the staged noun sage; the original adjective owner is categorically wrong.';}
  if(index===1089){g.root={kind:'planned_sense',declaration:'chapter-07-identity-targets-06.json:ami_chapter_07_06_205_12',lemma:{kind:'published_lemma',lemmaId:'lem_parure_ami_noun_7c9b217a9f'}};g.glossOverride='friend; a familiar form of address';g.reason='Familiar address does not assert an existing reciprocal friendship; fresh meaning with three corrected bands.';}
  selections.push(g);
 }
 for(const g of selections){ensure(g.banks.length===1||[].includes(g.index),'named alternate bank selection');const b=g.banks[0],bank=pointer(b);ensure(hash(bank.questions)===b.questionSha256,'exact bank revision');let senseId,lemmaId;
  if(g.root.kind==='published_sense'){senseId=g.root.senseId;ensure(maps.newSenses.has(senseId),'published meaning exists');lemmaId=maps.newSenses.get(senseId).lemmaId;}
  else{const root=g.root;senseId=id('sns','direct-draft:'+root.declaration);if(maps.newSenses.has(senseId))lemmaId=maps.newSenses.get(senseId).lemmaId;else{ensure(g.definition,'explicit definition for '+g.surface);const decl=declarations.get(root.declaration),rootBank=pointer(decl.bank);if(root.lemma.kind==='published_lemma')lemmaId=root.lemma.lemmaId;else{const headword=rootBank.lemma;lemmaId=id('lem',`${headword}:${g.pos}`);if(!maps.newLemmas.has(lemmaId)){ensure(!p.bundle.lemmas.some(l=>l.headword===headword&&l.partOfSpeech===g.pos),'existing head requires explicit choice '+headword);add('newLemmas',{id:lemmaId,headword,partOfSpeech:g.pos},{evidence:decl.evidence});}}
   const gloss=g.glossOverride??rootBank.meaning;add('newSenses',{id:senseId,lemmaId,gloss,definition:g.definition},{declaredSenseRoot:root.declaration,evidence:decl.evidence,definitionAuthority:{file:'scripts/micromegas-source-words-64.mjs',sourceGroupIndex:g.index}});
  }}
  ensure(maps.newLemmas.get(lemmaId)?.partOfSpeech===g.pos,'proper lexical category '+g.surface);
  const candidates=[...maps.newSurfaceForms.values()].filter(x=>x.lemmaId===lemmaId&&x.normalized===g.surface),hasQuiz=x=>[...p.preparedQuizzes.values()].some(q=>q.subject.surfaceFormId===x.id&&q.subject.senseId===senseId),active=candidates.filter(hasQuiz);ensure(active.length<=1&&(active.length===1||candidates.length<=1),'surface ambiguity '+g.surface);
  let surface=active[0]??candidates[0];if(!surface){surface={id:id('srf',`${lemmaId}:${g.surface}`),lemmaId,form:g.surface,normalized:g.surface};add('newSurfaceForms',surface,{evidence:{file:b.file,selector:b.selector}});}
  const identity=surface.id+':'+senseId,masteryAction=hasQuiz(surface)?'retain_existing_identity_progress':'fresh_identity_on_exact_unit_view';const merged=identityGroups.find(x=>x.identity===identity);if(merged){ensure(false,'unexpected same-key merger');merged.occurrences.push(...g.occurrences);}else identityGroups.push({identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,occurrences:g.occurrences,declaredRoot:g.root});
  for(const o of g.occurrences){const t=source.get(coord(o));ensure(old.has(coord(o))&&t.owner.kind==='draft_bank'&&g.banks.some(x=>x.file===t.owner.file&&x.key===t.owner.key),'available exact source use');occurrenceBindings.push({...o,form:g.surface,identity,surfaceFormId:surface.id,senseId,lemmaId,masteryAction,baseOwner:t.owner,evidence:{file:b.file,selector:b.selector}});}
  const draft={kind:'contextual_draft_bank',evidence:{file:b.file,selector:b.selector},key:b.key,questionSha256:b.questionSha256};const refined=refs.items.find(x=>x.file===b.file&&x.key===b.key);if(refined)draft.reviewedOverlay={evidence:{file:'whole-work-source-bank-refinements-64.json',selector:`/items/${refs.items.indexOf(refined)}`},beforeQuestionSha256:refined.beforeQuestionSha256,afterQuestionSha256:refined.afterQuestionSha256};
  const existing=[...p.preparedQuizzes.values()].filter(q=>q.subject.surfaceFormId===surface.id&&q.subject.senseId===senseId);const bankCandidates=[draft];if(existing.length){ensure(existing.length===3,'three retained questions');bankCandidates.unshift({kind:'existing_prepared_bank',questionIds:existing.map(q=>q.id),questionSha256:hash(existing),requiresReviewedOverlays:true});}
  for(const alt of g.banks.slice(1)){ensure(hash(pointer(alt).questions)===alt.questionSha256,'exact alternate bank');bankCandidates.push({kind:'preserved_unselected_contextual_bank',evidence:{file:alt.file,selector:alt.selector},key:alt.key,questionSha256:alt.questionSha256,reason:'The first source bank represents the same reviewed meaning; retain this alternative without creating a second bank.'});}
  if(merged){const dep=bankDependencies.find(x=>x.identity===identity);dep.candidates.push({...draft,kind:'preserved_unselected_contextual_bank',reason:g.reason});}else bankDependencies.push({identity,candidates:bankCandidates,status:'explicit_reviewed_selection'});decisions.push({sourceGroupIndex:g.index,form:g.surface,identity,occurrences:g.occurrences,reason:g.reason,sourceQuestionSha256:b.questionSha256});
 }
 const priorBankFiles=['whole-work-reviewed-word-banks-45.json',...names.slice(1)],priorBanks=new Map();for(const f of priorBankFiles)for(const b of read(f).banks)priorBanks.set(b.identity,{bank:b,file:f});
 const bindings={workId:graph.workId,publicationBaseline:graph.publicationBaseline,identityGroups:identityGroups.filter(g=>!priorBanks.has(g.identity)),occurrenceBindings,bankDependencies,newBanks:[]},prepared=composeMicromegasReviewedWordBanks(folder,bindings);Object.assign(evidence,prepared.evidenceSha256);
 const banks=identityGroups.map(g=>{const old=priorBanks.get(g.identity);if(!old)return prepared.banks.find(b=>b.identity===g.identity);return{...old.bank,chosen:{kind:'previously_bound_candidate_bank',evidence:{file:old.file,selector:`/banks/${read(old.file).banks.indexOf(old.bank)}`},questionSha256:old.bank.questionSha256},masteryAction:g.masteryAction};});
 const bound=new Set(occurrenceBindings.map(coord));ensure(bound.size===occurrenceBindings.length,'disjoint source bindings');const remaining=prev.remainingDirectDraftOccurrences.filter(o=>!bound.has(coord(o))),keys=new Set(remaining.map(coord));
 return{version:1,workId:graph.workId,status:'offline_source_word_package_unapplied',publicationBaseline:graph.publicationBaseline,evidenceSha256:evidence,...fresh,identityGroups,occurrenceBindings,bankDependencies,banks,decisions,ownershipHolds,remainingDirectDraftOccurrences:remaining,sourceGroupRange:{first:1050,last:specs64.at(-1)[0]},lexicalAuthorities:[{form:'entéléchie',url:'https://www.dictionnaire-academie.fr/article/A4E0955',note:'Historical essential form in Aristotelian philosophy.'},{form:'puissance',url:'https://www.dictionnaire-academie.fr/article/A9P5033',note:'Potentiality as distinct from realized act.'},{form:'ami',url:'https://www.dictionnaire-academie.fr/article/A4A0872',note:'Familiar form of address distinct from a claim of reciprocal friendship.'},{form:'péripatéticien',url:'https://www.dictionnaire-academie.fr/article/A9P1578',note:'Noun for a follower of Aristotle.'}],summary:{reviewedSourceGroups:specs64.length,unresolvedOwnershipGroups:ownershipHolds.length,boundDirectDraftIdentityGroups:identityGroups.length,boundDirectDraftSourceUses:occurrenceBindings.length,storedPreparedQuestionBands:banks.length*3,newProperLemmas:fresh.newLemmas.length,newSenses:fresh.newSenses.length,newSurfaceForms:fresh.newSurfaceForms.length,reusedIdentityGroups:identityGroups.filter(g=>g.masteryAction==='retain_existing_identity_progress').length,refinedBanks:refs.summary.refinedBanks,refinedQuestionBands:refs.summary.refinedQuestionBands,remainingDirectDraftSourceUses:remaining.length,remainingDirectDraftIdentityGroups:graph.directDraftBankGroups.filter(g=>g.occurrences.some(o=>keys.has(coord(o)))).length,pendingPhraseSpans:base.phrases.length}};
}
