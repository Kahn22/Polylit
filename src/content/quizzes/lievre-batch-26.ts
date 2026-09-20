import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"elans_leaps",surfaceFormId:"srf_elans",senseId:"sns_elan_primary",target:"élans",meaning:"leaps; bounds; bursts",
    early:[["Le lièvre avance par grands élans.",["steps","pauses","circles"]],["Les élans du cheval soulèvent la poussière.",["whinnies","shadows","reins"]],["Ses élans deviennent moins rapides après la montée.",["thoughts","words","turns"]]],
    blank:["Le coureur progresse par ___ puissants.",["élans","pas","gestes","efforts"]],
    comprehension:["Le cerf franchit le ruisseau en deux élans rapides.","Comment le cerf franchit-il le ruisseau ?",["in two quick bounds","by swimming slowly","over a wooden bridge","with help from Paul"],"in two quick bounds"],
    advanced:[["Les élans du lièvre sont rapides, mais ils l’épuisent bientôt.","Quel mot désigne ses bonds vers l’avant ?",["élans","lièvre","rapides","épuisent"]],["Le cheval gravit la pente par élans courts et puissants.","Quel nom pluriel signifie bonds ?",["cheval","pente","élans","puissants"]],["Après quelques élans, Paul ralentit et reprend son souffle.","Quel mot désigne les brusques mouvements en avant ?",["élans","Paul","ralentit","souffle"]]] },
  { key:"fit_did",surfaceFormId:"srf_fit",senseId:"sns_faire_primary",target:"fit",meaning:"did; made (literary past)",
    early:[["Paul fit un pas vers la porte.",["said","saw","took"]],["Elle fit le voyage en trois jours.",["planned","cancelled","described"]],["Le juge fit signe au témoin de parler.",["refused","forgot","waited"]]],
    blank:["Marie ___ tout son possible pour aider.",["fit","fait","faisait","fera"]],
    comprehension:["Luc fit une table avec le vieux bois trouvé dans la grange.","Que fabriqua Luc ?",["a table","a chair","a door","a boat"],"a table"],
    advanced:[["Paul fit le travail, mais Marie vérifia chaque détail.","Quel verbe au passé signifie accomplit ?",["Paul","fit","Marie","détail"]],["Elle fit une promesse devant toute l’assemblée.","Quel mot est le passé simple de faire ?",["Elle","fit","promesse","assemblée"]],["Le cheval fit trois bonds et franchit la barrière.","Quel mot signifie effectua ?",["cheval","fit","bonds","barrière"]]] },
  { key:"furent_were",surfaceFormId:"srf_furent",senseId:"sns_etre_primary",target:"furent",meaning:"were (literary past)",
    early:[["Les voyageurs furent surpris par l’orage.",["will be","are","had"]],["Paul et Luc furent les premiers arrivés.",["became","remained","seemed"]],["Les portes furent fermées avant la nuit.",["opened","repaired","painted"]]],
    blank:["Les deux témoins ___ entendus par le juge.",["furent","étaient","seront","fut"]],
    comprehension:["Les lettres furent retrouvées sous une vieille table.","Qu’est-il arrivé aux lettres ?",["they were found","they were burned","they were mailed","they were rewritten"],"they were found"],
    advanced:[["Les chevaux furent rapides, mais la tortue resta constante.","Quel mot est le passé simple pluriel de être ?",["chevaux","furent","tortue","constante"]],["Paul et Marie furent heureux de revoir leur village.","Quel verbe relie les sujets à heureux dans le passé ?",["Paul","Marie","furent","village"]],["Ces décisions furent difficiles et divisèrent longtemps le conseil.","Quel mot signifie were dans ce registre littéraire ?",["décisions","furent","longtemps","conseil"]]] },
  { key:"vains_futile",surfaceFormId:"srf_vains",senseId:"sns_vain_primary",target:"vains",meaning:"vain; futile; ineffective (plural)",
    early:[["Tous ses efforts furent vains.",["successful","careful","rapid"]],["Les appels vains ne changèrent pas la décision.",["urgent","secret","repeated"]],["Paul abandonna ses projets vains.",["ambitious","new","shared"]]],
    blank:["Leurs avertissements restèrent ___.",["vains","utiles","clairs","entendus"]],
    comprehension:["Les efforts des voyageurs furent vains : la porte ne s’ouvrit pas.","Quel fut le résultat de leurs efforts ?",["they had no effect","the door opened","the lock broke","help arrived"],"they had no effect"],
    advanced:[["Ses vains discours n’impressionnent ni le juge ni les témoins.","Quel mot signifie sans effet ?",["vains","discours","juge","témoins"]],["Paul fait de vains efforts pour déplacer la lourde pierre.","Quel adjectif indique que les efforts échouent ?",["Paul","vains","efforts","pierre"]],["Ces espoirs vains disparaissent lorsque la vérité est connue.","Quel mot qualifie les espoirs d’irréalisables ?",["espoirs","vains","vérité","connue"]]] },
  { key:"arriva_arrived",surfaceFormId:"srf_arriva",senseId:"sns_arriver_primary",target:"arriva",meaning:"arrived (literary past)",
    early:[["Paul arriva avant le coucher du soleil.",["left","waited","slept"]],["Le bateau arriva malgré la tempête.",["sank","turned back","stopped"]],["Marie arriva seule au village.",["remained","worked","called"]]],
    blank:["Le médecin ___ juste avant la nuit.",["arriva","arrivait","arrive","arrivera"]],
    comprehension:["Luc arriva à la gare quelques minutes avant le départ du train.","Où Luc parvint-il ?",["at the station","at the harbor","at the market","at the bridge"],"at the station"],
    advanced:[["Paul arriva le premier, mais Marie le suivit de près.","Quel verbe au passé indique qu’il atteignit le lieu ?",["Paul","arriva","Marie","près"]],["Le messager arriva essoufflé devant la porte du château.","Quel mot est le passé simple de arriver ?",["messager","arriva","porte","château"]],["Elle arriva au sommet lorsque le soleil se leva.","Quel mot signifie parvint ?",["Elle","arriva","sommet","soleil"]]] },
];

export const lievreQuizBatch26 = specs.flatMap(authoredSet);
