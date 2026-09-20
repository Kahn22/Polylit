import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"vent_wind",surfaceFormId:"srf_vent",senseId:"sns_vent_primary",target:"vent",meaning:"wind",
    early:[["Le vent souffle sur la vallée.",["rain","sun","fog"]],["Un vent froid traverse la forêt.",["road","river","voice"]],["Le bateau avance grâce au vent.",["engine","current","captain"]]],
    blank:["Le ___ fait tourner les ailes du moulin.",["vent","temps","feu","bruit"]],
    comprehension:["Le vent devient violent, alors Paul ferme toutes les fenêtres.","Pourquoi Paul ferme-t-il les fenêtres ?",["because the wind is becoming strong","because night is falling","because it is raining","because he is leaving"],"because the wind is becoming strong"],
    advanced:[["Le vent soulève les feuilles tandis que la pluie cesse.","Quel mot désigne l’air en mouvement ?",["vent","feuilles","pluie","cesse"]],["Cette nuit, le vent a cassé une branche du vieux chêne.","Quel nom indique la force qui a cassé la branche ?",["nuit","vent","branche","chêne"]],["Sans vent, la voile retombe et le bateau ralentit.","Quel mot signifie wind ?",["vent","voile","bateau","ralentit"]]] },
  { key:"aller_go",surfaceFormId:"srf_aller",senseId:"sns_aller_primary",target:"aller",meaning:"to go",
    early:[["Nous devons aller au village avant midi.",["to come","to stay","to sleep"]],["Paul veut aller voir son frère.",["to write","to call","to help"]],["Elle préfère aller à pied.",["to wait","to return","to work"]]],
    blank:["Il faut ___ chercher le médecin.",["aller","venir","partir","arriver"]],
    comprehension:["Marie prend son manteau pour aller au marché.","Où Marie compte-t-elle se rendre ?",["to the market","to the station","to the river","to the school"],"to the market"],
    advanced:[["Nous allons aller jusqu’au pont, puis revenir par la forêt.","Quel infinitif signifie se rendre ?",["aller","pont","revenir","forêt"]],["Paul préfère aller seul tandis que Luc attend ses amis.","Quel mot désigne l’action de se déplacer vers un lieu ?",["Paul","aller","Luc","amis"]],["Pour aller plus vite, les voyageurs prennent le train.","Quel verbe est à l’infinitif ?",["aller","vite","voyageurs","train"]]] },
  { key:"train_pace",surfaceFormId:"srf_train",senseId:"sns_train_primary",target:"train",meaning:"pace; course; rate",
    early:[["Le cheval avance d’un train régulier.",["railway vehicle","noise","turn"]],["Ils poursuivent leur train sans se presser.",["argument","meal","sleep"]],["Paul marche bon train vers le village.",["backward","alone","silently"]]],
    blank:["Le travail avance à un bon ___.",["train","pas","temps","tour"]],
    comprehension:["Les réparations vont bon train et seront terminées demain.","Comment progressent les réparations ?",["quickly and steadily","very slowly","not at all","without a plan"],"quickly and steadily"],
    advanced:[["La conversation va bon train pendant tout le repas.","Quel mot appartient à l’expression signifiant progresse vivement ?",["conversation","train","repas","tout"]],["Le groupe continue son train habituel malgré le mauvais temps.","Quel nom désigne ici l’allure suivie ?",["groupe","train","habituel","temps"]],["La troupe avance au petit train et atteint tard le village.","Quel mot désigne le rythme de progression ?",["troupe","train","tard","village"]]] },
  { key:"senateur_senator",surfaceFormId:"srf_senateur",senseId:"sns_senateur_primary",target:"sénateur",meaning:"senator",
    early:[["Le sénateur prend la parole devant l’assemblée.",["judge","merchant","soldier"]],["Un sénateur visite le village aujourd’hui.",["doctor","teacher","farmer"]],["Le journal interroge le sénateur sur la nouvelle loi.",["mayor","witness","captain"]]],
    blank:["Le ___ représente sa région au Parlement.",["sénateur","ministre","juge","préfet"]],
    comprehension:["Le sénateur présente un projet de loi devant ses collègues.","Que présente-t-il ?",["a proposed law","a travel report","a village map","a court judgment"],"a proposed law"],
    advanced:[["Le sénateur répond aux journalistes avant d’entrer dans l’assemblée.","Quel mot désigne le membre d’une chambre législative ?",["sénateur","journalistes","entrer","assemblée"]],["Paul rencontre le sénateur et lui remet une lettre des habitants.","Quel titre politique porte la personne rencontrée ?",["Paul","sénateur","lettre","habitants"]],["Ce sénateur siège depuis dix ans et connaît bien les débats.","Quel mot signifie senator ?",["sénateur","siège","ans","débats"]]] },
  { key:"elle_she",surfaceFormId:"srf_elle",senseId:"sns_elle_primary",target:"elle",meaning:"she; it (feminine)",
    early:[["Elle ferme la porte avant de partir.",["he","they","we"]],["Marie dit qu’elle reviendra demain.",["you","I","one"]],["La route est longue, mais elle reste sûre.",["he","we","they"]]],
    blank:["Paul attend Marie parce qu’___ possède la clé.",["elle","il","elles","on"]],
    comprehension:["Marie prend une lampe parce qu’elle doit traverser la forêt de nuit.","Qui doit traverser la forêt ?",["Marie","Paul","a guide","nobody"],"Marie"],
    advanced:[["Elle lit la lettre tandis que Paul regarde par la fenêtre.","Quel pronom désigne la lectrice ?",["Elle","lettre","Paul","fenêtre"]],["La barque paraît solide, mais elle prend déjà l’eau.","Quel mot reprend le nom féminin barque ?",["barque","elle","déjà","eau"]],["Marie promet qu’elle apportera les documents demain.","Quel pronom signifie she ?",["Marie","elle","documents","demain"]]] },
];

export const lievreQuizBatch18 = specs.flatMap(authoredSet);
