import{readFileSync}from'node:fs';import{createHash}from'node:crypto';import{loadPublication}from'./micromegas-publication-baseline.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
export function composeMicromegasOwnerRoutes(folder){
 const g=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)).directDraftBankGroups[187];
 const item={key:'quelque_concessive_determiner',form:'quelque',lemma:'quelque',partOfSpeech:'determiner',meaning:'whatever; no matter which',sourceOccurrences:g.occurrences.filter(o=>o.unit===154),questions:[
  {band:'1-3',context:'Quelque système qu’il invente, il ne trouve pas la réponse.',answer:'whatever',choices:['whatever','a certain','each','no']},
  {band:'4-5',context:'Dans « quelque système qu’il invente », le mot ___ signifie n’importe lequel, sans que le choix du système change la suite.',answer:'quelque',choices:['quelque','un','ce','chaque']},
  {band:'6-8',context:'Dans « quelque système qu’il invente », quelque signifie n’importe lequel. Un désigne un exemplaire indéterminé, ce désigne un système montré ou déjà nommé et chaque considère les systèmes séparément.',question:'Quel déterminant exprime la concession, quel que soit le système ?',answer:'quelque',choices:['quelque','un','ce','chaque']}
 ]};
 const declaration='chapter-01-identity-plan.json:quelque_concessive_determiner',root={kind:'planned_sense',declaration,lemma:{kind:'published_lemma',lemmaId:'lem_zola_quelque'}},bank={file:'whole-work-owner-routes-49.json',key:item.key,selector:'/items/0',questionSha256:hash(item.questions)};
 return{version:1,status:'offline_explicit_source_sense_split_unapplied',declarations:[{declaration,root,bank,evidence:{file:g.banks[0].file,selector:g.banks[0].selector},reason:'Explicit separation of unit154 nominal concession from unit23 adjective-degree adverb. Preserve indefinite quelque and all predecessor records.'}],bank,items:[item]};
}
export function composeMicromegasContinuationOwnerSnapshot(){
 const p=loadPublication(),heads=new Set(['défendre','quelque','sage','vers','varier','varié','Saturnien','saturnien','embarrasser','former','vanter','chez']),lemmas=p.bundle.lemmas.filter(l=>heads.has(l.headword)),lemmaIds=new Set(lemmas.map(l=>l.id)),senses=p.bundle.senses.filter(s=>lemmaIds.has(s.lemmaId)),senseIds=new Set(senses.map(s=>s.id)),surfaces=p.bundle.surfaceForms.filter(s=>lemmaIds.has(s.lemmaId)),quizzes=[...p.preparedQuizzes.values()].filter(q=>q.subject.kind==='vocabulary'&&senseIds.has(q.subject.senseId)),units=new Map(p.bundle.units.map(u=>[u.id,u.french])),occurrences=p.bundle.occurrences.filter(o=>senseIds.has(o.senseId)).map(o=>({...o,context:units.get(o.unitId)}));
 return{version:1,status:'unchanged_legacy_records_not_blanket_approval',policy:'Preserve every record, indexed passage and current/historical question in these retained owner families. The legal-defense reuse and separated quelque routes apply only to explicitly named candidate occurrences. Snapshot inclusion does not approve every old bank, merge duplicate meanings or change learner mastery.',lemmas,senses,surfaces,quizzes,occurrences,summary:{heads:lemmas.length,senses:senses.length,surfaces:surfaces.length,currentAndHistoricalQuestions:quizzes.length,indexedOccurrences:occurrences.length},sha256:hash({lemmas,senses,surfaces,quizzes,occurrences})};
}
export const continuationLexicalAuthorities={version:1,status:'primary_lexical_support_not_source_provenance_or_release_approval',reviewedOn:'2026-10-02',authorities:[
 ['quelque','https://www.dictionnaire-academie.fr/article/A3Q0062','The 1740 entry distinguishes nominal whatever from an adjective-degree adverb.'],
 ['quelque','https://vitrinelinguistique.oqlf.gouv.qc.ca/22720/la-grammaire/les-determinants/determinants-indefinis/accord-du-determinant-indefini-ou-de-ladverbe-quelque-dans-quelque-que','OQLF confirms the determiner/adverb distinction in concessive quelque…que.'],
 ['chaise de poste','https://www.dictionnaire-academie.fr/article/A9C1494','A light traveling carriage; bind the full compound rather than the ordinary seat.'],
 ['là-haut','https://www.dictionnaire-academie.fr/article/A8H0171','A locution indicating the higher place, also the sky.'],
 ['au delà de','https://www.dictionnaire-academie.fr/article/A6D0540','Historical unhyphenated spelling and figurative excess beyond a limit.'],
 ['à l’aide de','https://www.dictionnaire-academie.fr/article/A9A0955','A prepositional locution expressing use of a means.'],
 ['à travers','https://www.dictionnaire-academie.fr/article/A5T0889','A prepositional construction for passage through an extent.'],
 ['à Dieu ne plaise','https://www.dictionnaire-academie.fr/article/A3D0947','A fixed formula expressing aversion or rejection.'],
 ['à la vérité','https://www.dictionnaire-academie.fr/article/A7V0336','An admitted fact followed by qualification or contrast.'],
 ['rendre compte','https://www.dictionnaire-academie.fr/article/A8R1098','Give details or explanation, including a determiner and adjective between rendre and compte.'],
 ['laisser là','https://www.dictionnaire-academie.fr/article/A8L0080','Cease occupying oneself with or discussing a subject.'],
].map(([headword,url,paraphrase])=>({headword,url,paraphrase}))};
