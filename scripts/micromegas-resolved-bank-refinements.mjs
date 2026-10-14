import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const specs=[
 ['haut_vertical_measure','1-3',{answer:'height',choices:['height','width','weight','age']},'The historical dimension is a noun, not the adjective tall.'],
 ['haut_vertical_measure','4-5',{context:'Dans cette mesure ancienne, le ___ désigne la hauteur totale, et non une partie supérieure ou inférieure.',choices:['haut','bas','sommet','fond']},'Four masculine singular nouns accept le; the stated dimension distinguishes height from top, bottom or lowest part.'],
 ['haut_vertical_measure','6-8',{context:'Dans huit lieues de haut, le haut est la hauteur mesurée. Le bas est une partie inférieure, le sommet une partie supérieure et le fond la partie la plus profonde.',question:'Quel nom désigne ici la dimension verticale ?',choices:['haut','bas','sommet','fond']},'Explain the noun meaning consistently across all bands.'],
 ['pas_historical_length','4-5',{context:'Dans ce système ancien, les ___ géométriques valaient chacun cinq pieds.',choices:['pas','pieds','mètres','pouces']},'All four nouns are masculine plural, with the source plural surface; the five-foot measure selects pas.'],
 ['depuis_afterward','4-5',{context:'Dans ce récit ancien, il devint ___ géomètre, à une époque ultérieure dont la date précise est inconnue.',choices:['depuis','auparavant','immédiatement','simultanément']},'The later time is explicit without claiming immediate change; all four adverbs accept devint.'],
 ['depuis_afterward','6-8',{context:'Dans ce récit ancien, depuis situe le changement à une époque ultérieure. Auparavant le situe avant, immédiatement sans délai et simultanément au même moment.',choices:['depuis','auparavant','immédiatement','simultanément'],question:'Quel mot signifie ici à une époque ultérieure ?'},'Distinguish later from before, immediate and simultaneous.'],
 ['etres_beings','6-8',{context:'Les êtres sont les entités qui existent, matérielles ou pensées ; ce terme inclut notamment les créatures vivantes. Les objets sont des choses matérielles, les cailloux des pierres et les meubles des éléments du mobilier.',question:'Quel nom général comprend aussi les entités pensées ?'},'The shared noun meaning covers the philosophical entities of unit58, not living creatures alone.'],
 ['etre_living_being','1-3',{context:'Cet être est capable de penser.'},'One unambiguous noun target replaces a sentence containing both noun être and verb être.'],
 ['poursuivit_prosecuted','4-5',{context:'Le censeur engagea une action judiciaire contre l’auteur : il le ___ devant le tribunal.'},'Make prosecution explicit; attendance at court alone did not distinguish inviting from prosecuting.'],
 ['forme_substantial_scholastic','4-5',{context:'Dans la doctrine scolastique, le principe qui détermine ce qu’est un être, appelé ___ substantielle, est discuté.'},'Specify the defining philosophical principle rather than a topic that could also be substantial matter.'],
 ['annees_years','4-5',{context:'Dans ce récit, l’exil dure huit cents ___, c’est-à-dire huit cents périodes de douze mois.'},'Length greater than days also allowed hours and minutes; twelve-month periods select the noun.'],
 ['afflige_distressed','4-5',{context:'L’exil lui causait de la peine : il en était ___, sans être profondément triste.'},'Make sadness explicit; the old sentence allowed delighted, amused or reassured.'],
 ['tantot_alternation','1-3',{context:'Il utilise tantôt un rayon et, à d’autres moments, une comète.'},'The synthetic early context has one explicit highlighted target while keeping the alternation meaning.'],
 ['tantot_alternation','4-5',{context:'Il alterne entre deux moyens de transport : tantôt il utilise la lumière, ___ il prend une comète.'},'Alternation selects the second tantôt by meaning.'],
 ['enfin_after_all','4-5',{context:'Il fait valoir pour finir une raison décisive : car ___ Saturne est beaucoup plus grand.',choices:['enfin','probablement','apparemment','prétendument']},'Four adverbs fit the sentence; the final insistence distinguishes enfin from uncertainty and reported appearance.'],
 ['environ_approximately','4-5',{context:'Leur taille est estimée sans précision : ils mesurent ___ mille toises.'},'Remove the fixed ou environ grammar frame; all four adverbs fit before the quantity.'],
 ['familiarisa_became_familiar','4-5',{context:'Ces personnes lui étaient inconnues ; il apprit peu à peu à les connaître et se ___ avec elles.',choices:['familiarisa','disputa','battit','fâcha']},'Se séparer requires de; four past pronominal verbs now accept avec, with acquaintance selected by meaning.'],
 ['passablement_appreciable_quantity','4-5',{context:'Sans objectif précis à atteindre, il composa une quantité moyenne et appréciable, mais pas immense : il fit ___ de petits vers.',choices:['passablement','peu','énormément','trop']},'Remove sufficiently, which could equally fit an appreciable amount without a stated goal.'],
];
export function composeMicromegasResolvedBankRefinements(folder){
 const graph=JSON.parse(readFileSync(`${folder}/whole-work-identity-dependencies-43.json`)),items=new Map();
 for(const[key,band,patch,reason]of specs){
  const g=graph.directDraftBankGroups.find(g=>g.banks.some(b=>b.key===key)),b=g?.banks.find(b=>b.key===key);if(!b)throw Error(`Missing refinement ${key}`);
  const raw=b.selector.split('/').slice(1).reduce((v,k)=>v[k],JSON.parse(readFileSync(`${folder}/${b.file}`))),name=`${b.file}:${key}`;
  if(!items.has(name))items.set(name,{file:b.file,key,beforeQuestionSha256:hash(raw.questions),after:structuredClone(raw),changes:[]});
  const entry=items.get(name),q=entry.after.questions.find(q=>q.band===band),before=hash(q);if(!q)throw Error('Missing band');Object.assign(q,patch);
  entry.changes.push({band,beforeSha256:before,afterSha256:hash(q),reason});
 }
 for(const r of items.values())r.afterQuestionSha256=hash(r.after.questions);
 return {version:1,status:'offline_exact_question_refinements_unapplied',items:[...items.values()],summary:{refinedBanks:items.size,refinedQuestionBands:specs.length},policy:'Named exact-revision changes only. Preserve all source banks, old mastery and publication records.'};
}
