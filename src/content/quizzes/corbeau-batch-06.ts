import type { ContentBundle } from "../../domain/model.js";
import { authoredSet } from "./authoring.js";

export const corbeauQuizBatch06: ContentBundle["quizItems"] = [
  ...authoredSet({ key:"l_article", surfaceFormId:"srf_l_elided", senseId:"sns_le_primary", target:"l’", meaning:"the",
    early:[["L’enfant ferme doucement la porte.",["an","this","his"]],["Nous visitons l’église au centre du village.",["an","some","our"]],["Le médecin examine l’œil blessé.",["an","each","your"]]],
    blank:["Nous retrouvons ___adresse déjà notée.",["l’","le","la","les"]],
    comprehension:["L’infirmière appelle le patient suivant.","Qui appelle le patient ?",["the nurse","a teacher","the doctor","a neighbor"],"the nurse"],
    advanced:[["L’enfant prend un livre, ferme ce cahier et cherche son crayon.","Quel élément est l’article défini élidé devant « enfant » ?",["l’","un","ce","son"]],["L’artiste termine un portrait pendant que ce visiteur observe son travail.","Quel élément détermine « artiste » de façon définie ?",["l’","un","ce","son"]],["L’orage approche ; un marin replie ce drapeau et protège son bateau.","Quel élément est l’article défini élidé devant « orage » ?",["l’","un","ce","son"]]] }),
  ...authoredSet({ key:"odeur", surfaceFormId:"srf_odeur", senseId:"sns_odeur_primary", target:"odeur", meaning:"smell",
    early:[["Une odeur de café remplit la cuisine.",["sound","color","taste"]],["Cette odeur de fumée vient du couloir.",["light","noise","shape"]],["L’odeur des roses attire les visiteurs.",["texture","shadow","temperature"]]],
    blank:["Une agréable ___ de pain chaud sort de la boulangerie.",["odeur","couleur","saveur","chaleur"]],
    comprehension:["Une forte odeur de citron reste sur ses mains.","Quel fruit reconnaît-on grâce à l’odeur ?",["a lemon","an orange","an apple","a pear"],"a lemon"],
    advanced:[["Une odeur de soupe traverse la porte ; la musique couvre le bruit de la rue.","Quel mot désigne ce que le nez perçoit ?",["odeur","musique","bruit","rue"]],["Dans le jardin, l’odeur du jasmin accompagne la couleur des fleurs et le chant des oiseaux.","Quel mot nomme la sensation perçue par l’odorat ?",["jardin","odeur","couleur","chant"]],["Le chimiste remarque une odeur inhabituelle, vérifie la température et observe la couleur du liquide.","Quel mot correspond à la perception olfactive ?",["chimiste","odeur","température","couleur"]]] }),
  ...authoredSet({ key:"alleche", surfaceFormId:"srf_alleche", senseId:"sns_allecher_primary", target:"alléché", meaning:"enticed; attracted",
    early:[["Alléché par le parfum du pain, Paul entre dans la boulangerie.",["frightened","annoyed","exhausted"]],["Le chat, alléché par l’odeur du poisson, approche de la table.",["hidden","injured","chased"]],["Alléché par la récompense annoncée, le candidat accepte le défi.",["discouraged","confused","forgotten"]]],
    blank:["___ par l’arôme du repas, le garçon se dirige vers la cuisine.",["alléché","alléchée","alléchés","allécher"]],
    comprehension:["Alléché par l’odeur des biscuits, Marc ouvre la boîte.","Pourquoi Marc ouvre-t-il la boîte ?",["The smell of the cookies attracts him.","He wants to clean it.","Someone orders him to leave.","The box falls on the floor."],"The smell of the cookies attracts him."],
    advanced:[["Alléché par le miel, l’ours quitte la forêt, traverse le pré et approche de la ruche.","Quel mot indique que le miel attire l’ours ?",["alléché","forêt","pré","ruche"]],["Le client, alléché par le parfum du gâteau, regarde la vitrine puis entre dans le magasin.","Quel mot décrit l’attraction exercée sur le client ?",["client","alléché","vitrine","magasin"]],["Alléché par une promesse de gain, l’investisseur lit le contrat, consulte son avocat et retarde sa décision.","Quel mot montre que la promesse tente l’investisseur ?",["alléché","contrat","avocat","décision"]]] }),
];
