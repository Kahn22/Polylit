import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"tient_considers",surfaceFormId:"srf_tient",senseId:"sns_tenir_consider",target:"tient",meaning:"considers; regards",
    early:[["Paul tient cette promesse pour sincère.",["holds physically","writes","forgets"]],["Le juge tient le témoin pour honnête.",["arrests","questions","follows"]],["Marie tient ce conseil pour utile.",["keeps","hides","repeats"]]],
    blank:["Le village ___ cet homme pour un héros.",["tient","tiennent","garde","porte"]],
    comprehension:["Luc tient cette histoire pour vraie malgré les doutes de Paul.","Quelle opinion Luc a-t-il de l’histoire ?",["he considers it true","he has never heard it","he thinks it is incomplete","he wants to rewrite it"],"he considers it true"],
    advanced:[["Paul tient ce chemin pour dangereux, mais Marie décide de l’emprunter.","Quel verbe signifie considère comme ?",["Paul","tient","chemin","Marie"]],["Le conseil tient cette affaire pour terminée après le vote.","Quel mot exprime le jugement du conseil ?",["conseil","tient","affaire","vote"]],["Elle tient son voisin pour responsable de l’accident.","Quel mot signifie regarde comme ?",["Elle","tient","voisin","accident"]]] },
  { key:"gageure_wager",surfaceFormId:"srf_gageure",senseId:"sns_gageure_primary",target:"gageure",meaning:"wager; daunting challenge",
    early:[["Terminer ce travail en une heure serait une gageure.",["certainty","habit","reward"]],["Paul accepte la gageure proposée par son ami.",["letter","warning","apology"]],["Traverser la montagne en hiver est une gageure.",["shortcut","celebration","routine"]]],
    blank:["Courir cette distance si vite constitue une ___.",["gageure","victoire","promesse","erreur"]],
    comprehension:["Construire le pont avant l’arrivée des pluies paraît une véritable gageure.","Comment le projet est-il présenté ?",["as an extremely difficult challenge","as an easy routine task","as an abandoned plan","as a completed success"],"as an extremely difficult challenge"],
    advanced:[["La gageure amuse Paul, mais ses compagnons la jugent impossible.","Quel nom désigne le défi accepté ?",["gageure","Paul","compagnons","impossible"]],["Réparer seul ce navire est une gageure qui demandera beaucoup de courage.","Quel mot signifie défi presque impossible ?",["navire","gageure","courage","seul"]],["Marie relève la gageure et promet de finir avant midi.","Quel mot désigne ici le pari audacieux ?",["Marie","gageure","promet","midi"]]] },
  { key:"gloire_glory",surfaceFormId:"srf_gloire",senseId:"sns_gloire_primary",target:"gloire",meaning:"glory; fame",
    early:[["Le général rêve de gloire et de victoire.",["silence","rest","money"]],["Cette découverte apporte la gloire au savant.",["danger","sorrow","confusion"]],["Paul ne cherche ni richesse ni gloire.",["shelter","work","advice"]]],
    blank:["Le héros revient couvert de ___.",["gloire","honte","boue","fatigue"]],
    comprehension:["Après sa victoire, la gloire du coureur se répand dans tout le pays.","Pourquoi le coureur devient-il célèbre ?",["because of his victory","because he wrote a book","because he left the country","because he helped a merchant"],"because of his victory"],
    advanced:[["La gloire passe, mais les œuvres du poète demeurent.","Quel mot désigne la renommée éclatante ?",["gloire","œuvres","poète","demeurent"]],["Paul partage la gloire de la victoire avec toute son équipe.","Quel nom signifie grand honneur public ?",["Paul","gloire","victoire","équipe"]],["Le soldat préfère accomplir son devoir sans rechercher la gloire.","Quel mot désigne ici la célébrité admirée ?",["soldat","devoir","gloire","rechercher"]]] },
  { key:"croit_believes",surfaceFormId:"srf_croit",senseId:"sns_croire_primary",target:"croit",meaning:"believes; thinks",
    early:[["Paul croit que le train arrivera bientôt.",["knows","denies","forgets"]],["Elle croit cette histoire malgré les doutes.",["writes","changes","repeats"]],["Le village croit encore à cette ancienne légende.",["laughs at","hides","abandons"]]],
    blank:["Marie ___ connaître le bon chemin.",["croit","crois","croient","sait"]],
    comprehension:["Luc croit que la lettre vient de son frère, mais la signature est illisible.","Que pense Luc ?",["the letter comes from his brother","the letter is a forgery","the letter contains money","the letter was sent yesterday"],"the letter comes from his brother"],
    advanced:[["Paul croit Marie, tandis que le juge doute encore de son récit.","Quel verbe signifie accorde foi à ?",["Paul","croit","juge","récit"]],["Elle croit pouvoir terminer avant midi malgré le retard.","Quel mot exprime son opinion ou son espoir ?",["Elle","croit","midi","retard"]],["Le marchand croit que cette pièce est ancienne et précieuse.","Quel mot est une forme du verbe croire ?",["marchand","croit","pièce","précieuse"]]] },
  { key:"y_at_stake",surfaceFormId:"srf_y",senseId:"sns_y_enjeu",target:"y",meaning:"at stake; involved (in il y va de)",
    early:[["Il y va de notre sécurité.",["there","to it","away"]],["Dans cette décision, il y va de l’avenir du village.",["nearby","yesterday","perhaps"]],["Il y va de son honneur, et Paul refuse de céder.",["inside","afterward","together"]]],
    blank:["Il ___ va de la vie des voyageurs.",["y","en","le","lui"]],
    comprehension:["Le juge exige toute la vérité, car il y va de la liberté d’un innocent.","Qu’est-ce qui est en jeu ?",["an innocent person’s freedom","the judge’s salary","the date of the trial","the ownership of a house"],"an innocent person’s freedom"],
    advanced:[["Il y va de la survie du bateau, mais le capitaine garde son calme.","Quel mot appartient à l’expression indiquant ce qui est en jeu ?",["y","survie","bateau","capitaine"]],["Dans ce choix, il y va de l’avenir de toute la famille.","Quel pronom fait partie de la tournure il y va de ?",["choix","y","avenir","famille"]],["Il y va de notre réputation, tandis que nos adversaires observent chaque geste.","Quel mot contribue à exprimer l’enjeu ?",["y","réputation","adversaires","geste"]]] },
];

export const lievreQuizBatch21 = specs.flatMap(authoredSet);
