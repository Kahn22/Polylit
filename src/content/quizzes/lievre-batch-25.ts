import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"bout_end",surfaceFormId:"srf_bout",senseId:"sns_bout_primary",target:"bout",meaning:"end; tip",
    early:[["Paul attend au bout du chemin.",["middle","beginning","side"]],["Le chat joue avec le bout de la corde.",["knot","length","color"]],["Nous voyons enfin le bout du tunnel.",["entrance","roof","wall"]]],
    blank:["Une lumière brille au ___ de la rue.",["bout","bord","milieu","coin"]],
    comprehension:["Marie marche jusqu’au bout du pont, puis fait demi-tour.","Jusqu’où Marie marche-t-elle ?",["to the end of the bridge","to the middle of the bridge","to the riverbank","to the village"],"to the end of the bridge"],
    advanced:[["Le bout de la branche touche presque la fenêtre.","Quel mot désigne l’extrémité de la branche ?",["bout","branche","fenêtre","touche"]],["Paul place la lampe au bout de la longue table.","Quel nom signifie extrémité ?",["Paul","lampe","bout","table"]],["Au bout d’une heure, le train entre enfin en gare.","Quel mot appartient à l’expression signifiant après une heure ?",["bout","heure","train","gare"]]] },
  { key:"carriere_course",surfaceFormId:"srf_carriere",senseId:"sns_carriere_primary",target:"carrière",meaning:"course; racetrack",
    early:[["Les chevaux entrent dans la carrière pour courir.",["stable","forest","river"]],["Le coureur parcourt toute la carrière.",["career profession","village","bridge"]],["La carrière est prête pour la course.",["road","field","harbor"]]],
    blank:["Le cheval s’élance au milieu de la ___.",["carrière","prairie","cour","route"]],
    comprehension:["Les spectateurs entourent la carrière où les chevaux vont disputer la course.","Que vont faire les chevaux ?",["race on the course","pull a cart","cross a river","return to the stable"],"race on the course"],
    advanced:[["Le lièvre traverse la carrière à toute vitesse tandis que la tortue avance lentement.","Quel nom désigne le parcours de la course ?",["lièvre","carrière","tortue","lentement"]],["Les chevaux font deux fois le tour de la carrière.","Quel mot nomme ici la piste ?",["chevaux","tour","carrière","fois"]],["La foule se place autour de la carrière avant le départ.","Quel mot signifie champ de course ?",["foule","carrière","départ","autour"]]] },
  { key:"partit_departed",surfaceFormId:"srf_partit",senseId:"sns_partir_primary",target:"partit",meaning:"left; departed (literary past)",
    early:[["Paul partit avant le lever du soleil.",["arrived","waited","slept"]],["Le bateau partit malgré le mauvais temps.",["returned","sank","stopped"]],["Marie partit seule vers la montagne.",["remained","spoke","worked"]]],
    blank:["Le messager ___ aussitôt pour le village.",["partit","partait","part","partira"]],
    comprehension:["Luc prit son manteau et partit sans attendre ses compagnons.","Que fit Luc après avoir pris son manteau ?",["he left","he sat down","he called his companions","he opened a letter"],"he left"],
    advanced:[["Paul partit à pied, mais Marie choisit le train.","Quel verbe au passé signifie quitta les lieux ?",["Paul","partit","Marie","train"]],["Le dernier voyageur partit lorsque la cloche sonna.","Quel mot est le passé simple de partir ?",["voyageur","partit","cloche","sonna"]],["Elle partit vers la rivière et disparut derrière les arbres.","Quel mot indique son départ accompli ?",["Elle","partit","rivière","arbres"]]] },
  { key:"comme_like",surfaceFormId:"srf_comme",senseId:"sns_comme_primary",target:"comme",meaning:"like; as; since",
    early:[["Paul court comme le vent.",["against","without","after"]],["Faites comme le guide vous montre.",["before","although","unless"]],["Comme il pleut, nous restons à la maison.",["Where","When","How"]]],
    blank:["Marie chante ___ sa mère.",["comme","comment","puisque","avec"]],
    comprehension:["Luc avance comme un homme qui connaît parfaitement le chemin.","De quelle manière Luc avance-t-il ?",["like someone who knows the way","very slowly and fearfully","behind the other travelers","without choosing a direction"],"like someone who knows the way"],
    advanced:[["Le bateau file comme une flèche tandis que le vent se renforce.","Quel mot introduit la comparaison ?",["bateau","comme","flèche","vent"]],["Comme la nuit tombe, Paul allume une lampe.","Quel mot signifie puisque dans ce contexte ?",["Comme","nuit","Paul","lampe"]],["Marie agit comme le juge le lui a demandé.","Quel mot signifie de la manière que ?",["Marie","comme","juge","demandé"]]] },
  { key:"trait_dart",surfaceFormId:"srf_trait",senseId:"sns_trait_primary",target:"trait",meaning:"dart; bolt; arrow",
    early:[["Le lièvre part comme un trait.",["rope","stone","wheel"]],["Le trait atteint la cible au centre.",["sword","shield","bow"]],["L’archer lance un trait vers le ciel.",["net","torch","signal"]]],
    blank:["Le cavalier évite le ___ lancé depuis le rempart.",["trait","tronc","coup","piège"]],
    comprehension:["La flèche fend l’air comme un trait et se plante dans la cible.","Que fait le projectile ?",["it strikes the target","it falls beside the archer","it breaks the bow","it returns backward"],"it strikes the target"],
    advanced:[["Le trait traverse l’air et frappe le bouclier du soldat.","Quel mot désigne le projectile ?",["trait","air","bouclier","soldat"]],["Paul s’élance comme un trait tandis que ses compagnons démarrent lentement.","Quel nom évoque ici une flèche très rapide ?",["Paul","trait","compagnons","lentement"]],["L’archer retire un trait de son carquois avant de viser.","Quel mot signifie flèche ou projectile ?",["archer","trait","carquois","viser"]]] },
];

export const lievreQuizBatch25 = specs.flatMap(authoredSet);
