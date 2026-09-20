import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"part_leaves",surfaceFormId:"srf_part",senseId:"sns_partir_primary",target:"part",meaning:"leaves; departs",
    early:[["Paul part avant le lever du soleil.",["arrives","waits","sleeps"]],["Le train part à huit heures précises.",["stops","returns","passes"]],["Marie part seule pour le village.",["stays","works","speaks"]]],
    blank:["Le bateau ___ dès que le vent se lève.",["part","pars","partent","partait"]],
    comprehension:["Luc part demain matin pour Lyon.","Quand Luc quitte-t-il les lieux ?",["tomorrow morning","this evening","next week","at noon today"],"tomorrow morning"],
    advanced:[["Paul part à pied, tandis que Marie attend encore la voiture.","Quel verbe signifie quitte les lieux ?",["Paul","part","Marie","voiture"]],["Le dernier voyageur part et l’auberge ferme ses portes.","Quel mot est une forme du verbe partir ?",["voyageur","part","auberge","portes"]],["Elle part sans bruit avant que les autres se réveillent.","Quel mot indique son départ ?",["Elle","part","bruit","autres"]]] },
  { key:"evertue_strives",surfaceFormId:"srf_evertue",senseId:"sns_evertuer_primary",target:"évertue",meaning:"strives; makes every effort",
    early:[["Paul s’évertue à réparer la vieille horloge.",["refuses","forgets","pretends"]],["Elle s’évertue à convaincre le juge.",["avoids","orders","allows"]],["Le guide s’évertue à rassurer les voyageurs.",["abandons","follows","questions"]]],
    blank:["Marie s’___ à comprendre ce texte difficile.",["évertue","efforce","épuise","éloigne"]],
    comprehension:["Luc s’évertue à ouvrir la porte malgré la serrure rouillée.","Que fait Luc ?",["he tries very hard to open the door","he replaces the door","he searches for another house","he waits for a locksmith"],"he tries very hard to open the door"],
    advanced:[["Paul s’évertue à finir le travail, mais le temps lui manque.","Quel verbe exprime un effort persistant ?",["Paul","évertue","travail","temps"]],["Elle s’évertue à parler clairement devant une foule impatiente.","Quel mot signifie fait tous ses efforts ?",["Elle","évertue","foule","impatiente"]],["Le cheval s’évertue à tirer la lourde voiture hors de la boue.","Quel verbe décrit l’effort intense du cheval ?",["cheval","évertue","voiture","boue"]]] },
  { key:"hate_hurries",surfaceFormId:"srf_hate",senseId:"sns_hater_primary",target:"hâte",meaning:"hurries; hastens",
    early:[["Paul se hâte pour ne pas manquer le train.",["rests","hesitates","stops"]],["Elle se hâte vers la maison avant l’orage.",["wanders","returns slowly","hides"]],["Le messager se hâte de porter la nouvelle.",["refuses","forgets","waits"]]],
    blank:["Luc se ___ de fermer les volets.",["hâte","halte","cache","charge"]],
    comprehension:["Marie se hâte car la porte de la gare va fermer.","Pourquoi Marie avance-t-elle rapidement ?",["the station door is about to close","she has lost her ticket","the train is cancelled","Paul is waiting at home"],"the station door is about to close"],
    advanced:[["Le voyageur se hâte, mais son compagnon marche encore lentement.","Quel verbe indique qu’il accélère ?",["voyageur","hâte","compagnon","lentement"]],["Paul se hâte de répondre avant que le juge ne parte.","Quel mot signifie se dépêche ?",["Paul","hâte","juge","parte"]],["Elle se hâte vers le pont tandis que la pluie commence.","Quel verbe exprime son mouvement pressé ?",["Elle","hâte","pont","pluie"]]] },
  { key:"lenteur_slowness",surfaceFormId:"srf_lenteur",senseId:"sns_lenteur_primary",target:"lenteur",meaning:"slowness",
    early:[["La lenteur du voyage fatigue les passagers.",["speed","length","danger"]],["Paul travaille avec une grande lenteur.",["precision","strength","joy"]],["La lenteur de la tortue trompe ses adversaires.",["silence","size","color"]]],
    blank:["La ___ des réparations inquiète les habitants.",["lenteur","vitesse","qualité","fin"]],
    comprehension:["À cause de la lenteur du bateau, les voyageurs arrivent après la nuit.","Pourquoi arrivent-ils tard ?",["the boat moves slowly","the river is closed","they left at night","they lost their luggage"],"the boat moves slowly"],
    advanced:[["La lenteur du service irrite les clients, mais le repas est excellent.","Quel nom signifie manque de rapidité ?",["lenteur","service","clients","repas"]],["Marie répond avec lenteur parce qu’elle choisit soigneusement ses mots.","Quel mot décrit son rythme peu rapide ?",["Marie","lenteur","choisit","mots"]],["Cette lenteur contraste avec la vitesse du premier coureur.","Quel mot est l’opposé de vitesse ?",["lenteur","contraste","vitesse","coureur"]]] },
  { key:"lui_subject_he",surfaceFormId:"srf_lui",senseId:"sns_lui_subject",target:"lui",meaning:"he; him (stressed pronoun)",
    early:[["Lui préfère rester, mais moi, je pars.",["she","we","they"]],["Paul est prêt ; lui connaît déjà le chemin.",["her","them","you"]],["Lui seul peut ouvrir cette porte.",["nobody","everyone","she"]]],
    blank:["Moi, je prends le train ; ___, il voyage à pied.",["lui","leur","le","ils"]],
    comprehension:["Marie attend dehors ; lui entre immédiatement dans la maison.","Qui entre dans la maison ?",["the man referred to by lui","Marie","both people","nobody"],"the man referred to by lui"],
    advanced:[["Lui veut continuer, tandis que ses compagnons demandent une pause.","Quel pronom met le sujet masculin en relief ?",["Lui","compagnons","pause","continuer"]],["Paul reste silencieux ; lui seul connaît toute la vérité.","Quel mot signifie he avec insistance ?",["Paul","lui","seul","vérité"]],["Entre les deux frères, lui semble le plus prudent.","Quel pronom désigne l’homme montré ou opposé aux autres ?",["frères","lui","prudent","deux"]]] },
];

export const lievreQuizBatch19 = specs.flatMap(authoredSet);
