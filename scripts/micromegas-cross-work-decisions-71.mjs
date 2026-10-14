// Exact editorial decisions for the 23 source-bound cross-work plans.
export const reusedExpressions71 = {
  3:'exi_micromegas_adbb3c0c62468c2e',
  10:'exi_micromegas_3d0331b329a96886',
  14:'exi_cigale_fourmi_eh_bien_1962dd98b7',
  16:'exi_micromegas_249e0c77fef8d792',
};
export const earlyContexts71 = {
  0:'Je veux que vous partiez tout à l’heure, sans attendre un instant.',
  1:'Le témoin raconta tout au long les événements, sans omettre un détail.',
  2:'Après cette bonne nouvelle, elle était heureuse comme tout.',
  3:'Le voisin, tout vieux qu’il estoit, continuait à parcourir le village à pied.',
  4:'Nous rentrons à pied après le bal.',
  5:'La directrice veut prendre en main le projet et en diriger elle-même les préparatifs.',
  6:'Il refuse de céder à aucun prix, même devant une offre exceptionnelle.',
  7:'Devant cette scène comique, je ne puis m’empêcher de rire.',
  8:'Cette association défend les droits de l’homme partout où ils sont menacés.',
  9:'A quoi bon réparer cette boîte si nous devons la jeter demain ?',
  10:'Le départ était irrévocable ; elle prit son parti et cessa de protester.',
  11:'Le ministre invoqua la raison d’Etat pour subordonner les autres intérêts à ceux du pays.',
  12:'Ma prédiction s’est réalisée ; avais-je pas raison ?',
  13:'Ton calcul est exact : tu as raison.',
  14:'Tu souhaites partir ? Hé bien ! prépare ton sac.',
  15:'Les élèves progressèrent, tant et si bien qu’ils réussirent tous l’épreuve.',
  16:'Ces deux familles faisoient grande figure dans leur petite ville.',
  17:'Elle leur fit part des provisions reçues la veille.',
  18:'Ces documents feront foi de la date de notre accord.',
  19:'Les vendeurs firent condition que le paiement aurait lieu avant la livraison.',
  20:'Les voisins firent tout leur possible pour sauver la récolte.',
  21:'Le détenu fut placé au secret, sans visite ni correspondance.',
  22:'Elle continua son chemin, quoy que fatiguée.',
};
export function refineQuestions71(index, item, form) {
  const questions=structuredClone(item.questions);
  const early=questions.find(q=>q.band==='1-3'),middle=questions.find(q=>q.band==='4-5'),late=questions.find(q=>q.band==='6-8');
  early.context=earlyContexts71[index];early.targetText=index===15?'tant et si bien qu’':form;
  if(index===3){
    early.answer='although he was old';early.choices=['although he was old','because he was old','before he became old','as soon as he became old'];
    middle.context='Son grand âge ne l’empêchait pas de marcher : il marchait encore, « ___ ».';
    middle.answer=form;middle.choices=[form,'parce qu’il estoit vieux','avant qu’il fût vieux','dès qu’il fut vieux'];
    late.answer=form;late.choices=[...middle.choices];late.question='Quelle construction admet le grand âge malgré lequel le fait se produit ?';
  }
  if(index===15){
    for(const q of [middle,late]){q.answer='tant et si bien qu’';q.choices=['tant et si bien qu’','bien qu’','à condition qu’','de peur qu’'];}
    middle.context='La locution qui annonce le résultat de ce qui précède, sous sa forme élidée devant elle, est « ___ ».';
    late.question='Quelle locution introduit la conséquence ou le résultat de ce qui précède ?';
  }
  if(index===16){early.answer='made a showing; presented an appearance';early.choices=['made a showing; presented an appearance','concealed their presence','changed their names','left the country'];}
  if(index===17){early.answer='shared some of the';early.choices=['shared some of the','hid all of the','kept all of the','threw away all of the'];}
  // Store a neutral comparison context and a separate semantic retrieval prompt.
  late.context=`Le lecteur compare les formulations ${late.choices.map(x=>`« ${x} »`).join(', ')}.`;
  if(!late.question||/^(Quelle expression convient|Quel mot convient|Quelle conjonction convient)/.test(late.question))late.question=item.questions.find(q=>q.band==='6-8').context;
  return questions;
}
