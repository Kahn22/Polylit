import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"cependant_however",surfaceFormId:"srf_cependant",senseId:"sns_cependant_primary",target:"cependant",meaning:"however; nevertheless",
    early:[["La route est longue ; cependant, elle reste sûre.",["therefore","meanwhile","instead"]],["Paul est fatigué, mais il continue cependant.",["immediately","outside","together"]],["Il pleut ; cependant, les voyageurs avancent.",["because","before","unless"]]],
    blank:["Le travail est difficile ; ___, Marie refuse d’abandonner.",["cependant","donc","puisque","ensuite"]],
    comprehension:["Le vent souffle très fort ; cependant, le bateau quitte le port.","Que fait le bateau malgré le vent ?",["it leaves the port","it returns immediately","it loses its sail","it remains tied up"],"it leaves the port"],
    advanced:[["Paul connaît le danger ; cependant, il traverse le pont.","Quel mot marque une opposition entre les deux idées ?",["Paul","danger","cependant","pont"]],["La réponse paraît simple ; elle est cependant inexacte.","Quel adverbe signifie néanmoins ?",["réponse","simple","cependant","inexacte"]],["Le train est en retard ; cependant, tous les voyageurs attendent calmement.","Quel mot introduit le contraste ?",["train","retard","cependant","voyageurs"]]] },
  { key:"meprise_despises",surfaceFormId:"srf_meprise",senseId:"sns_mepriser_primary",target:"méprise",meaning:"despises; scorns",
    early:[["Paul méprise les mensonges et la flatterie.",["admires","repeats","believes"]],["Elle méprise celui qui trahit ses amis.",["welcomes","follows","helps"]],["Le puissant méprise parfois les conseils du sage.",["requests","remembers","explains"]]],
    blank:["Le juge ___ toute tentative de corruption.",["méprise","méprisent","respecte","accepte"]],
    comprehension:["Marie méprise la cruauté et refuse de faire souffrir les animaux.","Quel comportement Marie rejette-t-elle ?",["cruelty","patience","honesty","kindness"],"cruelty"],
    advanced:[["Paul méprise l’argent facile, mais son frère rêve de richesse.","Quel verbe signifie considère sans estime ?",["Paul","méprise","frère","richesse"]],["Elle méprise les flatteurs et préfère les paroles sincères.","Quel mot exprime son profond dédain ?",["Elle","méprise","flatteurs","paroles"]],["Le général méprise le danger tandis que ses soldats restent prudents.","Quel verbe indique qu’il traite le danger avec dédain ?",["général","méprise","danger","soldats"]]] },
  { key:"une_article",surfaceFormId:"srf_une",senseId:"sns_un_primary",target:"une",meaning:"a; an; one (feminine)",
    early:[["Marie porte une robe bleue.",["the","this","her"]],["Paul cherche une petite clé.",["some","that","every"]],["Une lampe éclaire la pièce.",["Two","No","Each"]]],
    blank:["Luc écrit ___ lettre à son frère.",["une","un","la","des"]],
    comprehension:["Marie voit une barque près du rivage.","Combien de barques Marie voit-elle ?",["one", "two", "several", "none"],"one"],
    advanced:[["Une étoile brille au-dessus de la forêt sombre.","Quel article indéfini féminin précède étoile ?",["Une","étoile","forêt","sombre"]],["Paul ouvre une fenêtre tandis que Marie ferme la porte.","Quel mot signifie a devant fenêtre ?",["Paul","une","Marie","porte"]],["Nous suivons une route étroite jusqu’au village.","Quel mot détermine route sans l’identifier précisément ?",["suivons","une","route","village"]]] },
  { key:"telle_such",surfaceFormId:"srf_telle",senseId:"sns_tel_primary",target:"telle",meaning:"such; like that (feminine)",
    early:[["Une telle erreur peut coûter cher.",["small","different","final"]],["Je n’ai jamais vu une telle tempête.",["the same","a distant","the first"]],["Telle est la décision du juge.",["Why","Where","When"]]],
    blank:["Une ___ promesse exige beaucoup de courage.",["telle","tel","telles","cette"]],
    comprehension:["Marie ne s’attendait pas à une telle réponse du directeur.","Qu’est-ce qui surprend Marie ?",["a response of that kind","the director’s silence","a new question","Paul’s arrival"],"a response of that kind"],
    advanced:[["Une telle victoire restera longtemps dans les mémoires.","Quel adjectif signifie de cette sorte ?",["telle","victoire","longtemps","mémoires"]],["Telle fut sa réponse, brève mais parfaitement claire.","Quel mot présente la réponse comme celle qui vient d’être décrite ?",["Telle","réponse","brève","claire"]],["Paul refuse une telle proposition et quitte immédiatement la salle.","Quel mot qualifie proposition comme étant de ce genre ?",["Paul","telle","proposition","salle"]]] },
  { key:"victoire_victory",surfaceFormId:"srf_victoire",senseId:"sns_victoire_primary",target:"victoire",meaning:"victory",
    early:[["La victoire réjouit toute l’équipe.",["defeat","journey","argument"]],["Paul célèbre sa victoire avec ses amis.",["departure","promise","mistake"]],["Cette victoire met fin à la guerre.",["letter","storm","meeting"]]],
    blank:["Les joueurs fêtent leur ___ sur la place.",["victoire","défaite","effort","course"]],
    comprehension:["Après sa victoire, Marie reçoit une médaille devant la foule.","Pourquoi Marie reçoit-elle une médaille ?",["because she won","because she arrived late","because she helped Paul","because she found a letter"],"because she won"],
    advanced:[["La victoire appartient au coureur qui franchit le premier la ligne.","Quel nom désigne le succès dans la compétition ?",["victoire","coureur","premier","ligne"]],["Cette victoire surprend les adversaires, mais réjouit les habitants.","Quel mot est l’opposé de défaite ?",["victoire","adversaires","réjouit","habitants"]],["Paul dédie sa victoire à son entraîneur et à toute son équipe.","Quel nom désigne le résultat gagnant ?",["Paul","victoire","entraîneur","équipe"]]] },
];

export const lievreQuizBatch20 = specs.flatMap(authoredSet);
