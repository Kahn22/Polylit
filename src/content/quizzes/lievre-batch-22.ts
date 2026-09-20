import { authoredSet, type AuthoredQuizSpec } from "./authoring.js";

const specs: AuthoredQuizSpec[] = [
  { key:"va_goes",surfaceFormId:"srf_va",senseId:"sns_aller_primary",target:"va",meaning:"goes; is going",
    early:[["Paul va au marché chaque matin.",["comes","stays","sleeps"]],["Le train va bientôt partir.",["has just","refuses to","used to"]],["Cette route va jusqu’au village.",["begins after","passes under","turns away from"]]],
    blank:["Marie ___ chercher le médecin.",["va","vas","vont","allait"]],
    comprehension:["Luc va à la gare pour prendre le dernier train.","Où Luc se rend-il ?",["to the station","to the market","to the harbor","to the village square"],"to the station"],
    advanced:[["Paul va vers la rivière tandis que Marie retourne à la maison.","Quel verbe indique le déplacement de Paul ?",["Paul","va","Marie","maison"]],["Le bateau va plus vite lorsque le vent se lève.","Quel mot est une forme du verbe aller ?",["bateau","va","vent","lève"]],["Cette clé va dans la petite serrure, mais l’autre ouvre le coffre.","Quel mot signifie convient ou se place ?",["clé","va","serrure","coffre"]]] },
  { key:"honneur_honor",surfaceFormId:"srf_honneur",senseId:"sns_honneur_primary",target:"honneur",meaning:"honor; credit",
    early:[["Paul défend son honneur devant le juge.",["money","house","journey"]],["Cet acte fait honneur à toute l’équipe.",["harm","noise","room"]],["Le village rend honneur à ses anciens héros.",["a letter","a warning","a debt"]]],
    blank:["Le soldat agit avec courage et ___.",["honneur","honte","colère","crainte"]],
    comprehension:["Marie refuse de mentir parce que son honneur compte davantage que la victoire.","Pourquoi Marie refuse-t-elle de mentir ?",["she values her honor","she fears the judge","she knows the answer","she wants to leave"],"she values her honor"],
    advanced:[["Son honneur lui interdit de trahir une promesse faite à ses amis.","Quel mot désigne son sens de la dignité morale ?",["honneur","promesse","amis","trahir"]],["Le maire reçoit cet honneur au nom de tous les habitants.","Quel nom signifie distinction publique ?",["maire","honneur","nom","habitants"]],["Paul met son honneur en jeu pour défendre la vérité.","Quel mot désigne sa réputation morale ?",["Paul","honneur","jeu","vérité"]]] },
  { key:"broute_grazes",surfaceFormId:"srf_broute",senseId:"sns_brouter_primary",target:"broute",meaning:"grazes; browses",
    early:[["La chèvre broute près de la rivière.",["sleeps","runs","hides"]],["Le cheval broute l’herbe du pré.",["carries","tramples","avoids"]],["Un mouton broute derrière la barrière.",["jumps","waits","calls"]]],
    blank:["La vache ___ tranquillement sous les arbres.",["broute","broutent","brouter","boit"]],
    comprehension:["Le cerf broute de jeunes feuilles au bord de la forêt.","Que mange le cerf ?",["young leaves","dry grain","tree bark","wild berries"],"young leaves"],
    advanced:[["La tortue avance tandis que le lièvre broute quelques herbes.","Quel verbe indique que le lièvre mange de la végétation ?",["tortue","lièvre","broute","herbes"]],["Le troupeau se repose, mais une chèvre broute encore.","Quel mot signifie paît ?",["troupeau","chèvre","broute","encore"]],["Le cheval broute dans le champ pendant que son maître répare la clôture.","Quel verbe est une forme de brouter ?",["cheval","broute","maître","clôture"]]] },
  { key:"repose_rests",surfaceFormId:"srf_repose",senseId:"sns_reposer_primary",target:"repose",meaning:"rests; is resting",
    early:[["Paul se repose après le voyage.",["works","leaves","hurries"]],["Le livre repose sur la table.",["falls","opens","disappears"]],["Marie repose sa tête contre le mur.",["raises","turns","hides"]]],
    blank:["Le cheval se ___ près de la rivière.",["repose","reposes","reposent","réveille"]],
    comprehension:["Après avoir marché toute la journée, Luc se repose sous un arbre.","Que fait Luc sous l’arbre ?",["he rests","he eats","he reads","he waits for Paul"],"he rests"],
    advanced:[["Marie se repose dans sa chambre tandis que Paul prépare le repas.","Quel verbe signifie prend du repos ?",["Marie","repose","Paul","repas"]],["La décision repose sur les témoignages de trois personnes.","Quel mot signifie est fondée ?",["décision","repose","témoignages","personnes"]],["Le paquet repose près de la porte depuis ce matin.","Quel verbe indique que le paquet est posé ?",["paquet","repose","porte","matin"]]] },
  { key:"amuse_amuses",surfaceFormId:"srf_amuse",senseId:"sns_amuser_primary",target:"amuse",meaning:"amuses; entertains",
    early:[["Cette histoire amuse les enfants.",["frightens","tires","confuses"]],["Paul s’amuse avec ses amis dans le jardin.",["argues","works","hides"]],["Le spectacle amuse toute la famille.",["worries","divides","awakens"]]],
    blank:["Ce jeu ___ beaucoup Marie.",["amuse","amusent","ennuie","surprend"]],
    comprehension:["Le chien court après sa queue et amuse les voyageurs.","Quel effet le chien a-t-il sur les voyageurs ?",["he entertains them","he frightens them","he guides them","he wakes them"],"he entertains them"],
    advanced:[["La plaisanterie amuse Paul, mais le juge reste sérieux.","Quel verbe signifie fait rire ou divertit ?",["plaisanterie","amuse","juge","sérieux"]],["Marie s’amuse à observer les oiseaux près de la rivière.","Quel mot indique qu’elle prend plaisir à cette activité ?",["Marie","amuse","oiseaux","rivière"]],["Ce petit jeu amuse les enfants pendant le long voyage.","Quel verbe exprime le divertissement ?",["jeu","amuse","enfants","voyage"]]] },
];

export const lievreQuizBatch22 = specs.flatMap(authoredSet);
