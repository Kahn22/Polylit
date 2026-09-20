import type { ContentBundle } from "../../domain/model.js";
import { authoredSet } from "./authoring.js";

export const corbeauQuizBatch04 = [
  ...authoredSet({ key:"bec", surfaceFormId:"srf_bec", senseId:"sns_bec_primary", target:"bec", meaning:"beak",
    early:[["Le canard plonge son bec dans l’eau.",["wing","claw","tail"]],["L’aigle transporte une branche dans son bec.",["claw","feather","nest"]],["Ce petit oiseau casse la graine avec son bec.",["foot","wing","tail"]]],
    blank:["Le perroquet saisit le fruit avec son ___.",["bec","banc","bras","dos"]],
    comprehension:["Le héron tient un poisson dans son bec.","Avec quelle partie de son corps le héron tient-il le poisson ?",["its beak","its wing","its foot","its tail"],"its beak"],
    advanced:[["L’oiseau ouvre son bec, prend une graine et quitte la branche.","Quel mot désigne la partie dure de la bouche de l’oiseau ?",["oiseau","bec","graine","branche"]],["Le pélican remplit son bec de poissons tandis que ses ailes restent ouvertes.","Quel mot nomme l’organe avec lequel le pélican prend les poissons ?",["pélican","bec","poissons","ailes"]],["La chouette nettoie son bec, replie une aile et observe la souris depuis le rocher.","Quel mot désigne la partie pointue située à l’avant de la tête de la chouette ?",["chouette","bec","aile","rocher"]]] }),
  ...authoredSet({ key:"fromage", surfaceFormId:"srf_fromage", senseId:"sns_fromage_primary", target:"fromage", meaning:"cheese",
    early:[["Elle achète du fromage au marché.",["bread","fruit","milk"]],["Ce fromage a une odeur forte.",["sauce","meat","cake"]],["Nous partageons un fromage après le repas.",["dessert","plate","drink"]]],
    blank:["Il pose le ___ sur la table.",["fromage","fromages","fromager","formage"]],
    comprehension:["Léa coupe le fromage en petits morceaux.","Que coupe Léa ?",["cheese","paper","wood","fabric"],"cheese"],
    advanced:[["Le pain, le fromage, la pomme et l’eau sont sur la table.","Quel mot désigne un aliment fait avec du lait ?",["pain","fromage","pomme","eau"]],["Paul range le beurre, le fromage, le jus et le raisin dans le réfrigérateur.","Quel mot désigne ici le produit laitier solide ?",["beurre","fromage","jus","raisin"]],["Le serveur propose du café, une poire, du fromage et une tisane.","Quel mot désigne l’aliment obtenu par transformation du lait ?",["café","poire","fromage","tisane"]]] }),
  ...authoredSet({ key:"par", surfaceFormId:"srf_par", senseId:"sns_par_primary", target:"par", meaning:"by",
    early:[["La porte est ouverte par le gardien.",["before","without","under"]],["Le tableau a été peint par une artiste locale.",["against","after","inside"]],["Le colis est envoyé par le train de midi.",["beside","toward","outside"]]],
    blank:["Cette lettre a été écrite ___ ma grand-mère.",["par","pour","sans","chez"]],
    comprehension:["Le repas est préparé par Nadia ce soir.","Qui prépare le repas ?",["Nadia","a waiter","the family","a neighbor"],"Nadia"],
    advanced:[["Le roman est traduit par Louise, relu par Marc et publié en juin.","Quel mot introduit la personne qui effectue la traduction ?",["roman","par","Marc","juin"]],["Le portail est fermé par le concierge, mais la fenêtre reste ouverte dans le bureau.","Quel mot introduit l’agent qui ferme le portail ?",["portail","par","fenêtre","dans"]],["Le prix est attribué par le jury après le vote, devant les candidats réunis.","Quel mot introduit le groupe responsable de l’attribution ?",["prix","par","après","candidats"]]] }),
] satisfies ContentBundle["quizItems"];
