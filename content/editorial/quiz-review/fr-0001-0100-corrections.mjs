// Offline authored decisions. null retains a question after contextual review.
// In replacement arrays, the first choice is correct; application rotates positions.
const E=(context,choices)=>({context,choices:choices.split('|')});
const M=E;
const A=(context,prompt,choices)=>({context,prompt,choices:choices.split('|')});
const rows=[];
const add=(index,agreement,reason,early,middle,advanced)=>rows.push({index,agreement,reason,questions:[early,middle,advanced]});
const hold=(index,reason)=>rows.push({index,status:'blocked_lexical_review',reason});
add(1,'masculine singular','Ordinary animal names use lowercase. Remove the plural and the equally plausible fox cub.',
E('Un renard roux traverse le sentier.','fox|wolf|rabbit|deer'),
M('Avec sa longue queue touffue et son pelage roux, le _____ rentre dans son terrier.','renard|castor|corbeau|lézard'),
A('Le renard quitte son terrier, croise un lièvre et disparaît dans les fougères.','Quel mot désigne l’animal roux à la queue touffue ?','renard|terrier|lièvre|fougères'));
add(2,'masculine singular','Croaking singles out the crow among four singular masculine birds.',
E('Un corbeau noir traverse le ciel.','crow|fox|eagle|sparrow'),
M('Perché sur la branche, le grand oiseau noir croasse : ce _____ fait beaucoup de bruit.','corbeau|canard|moineau|pigeon'),
A('Le corbeau croasse, le merle chante et la pie saute près du nid.','Quel mot désigne le grand oiseau noir qui croasse ?','corbeau|merle|pie|nid'));
add(3,'masculine singular','Use a dairy-specific context; bread can also contain milk, so the old advanced clue was too broad.',null,
M('Le lait a servi à fabriquer ce _____, que le vendeur coupe en tranches.','fromage|jambon|saumon|raisin'),
A('Pour le pique-nique, Zoé coupe le pain et le fromage, lave une pomme et remplit une gourde d’eau.','Quel mot désigne le produit laitier ?','fromage|pain|pomme|eau'));
add(4,'masculine singular','All gap options fit un; growing branches and leaves identify a tree.',null,
M('Dans la cour, un _____ grandit ; ses branches se couvrent de feuilles au printemps.','arbre|banc|mur|poteau'),null);
add(5,'feminine singular','A full dwelling with bedrooms and a kitchen excludes the outdoor structures.',
E('La famille habite une maison près de la rivière.','house|garden|car|bridge'),
M('Ils habitent une _____ qui comprend trois chambres, une cuisine et un salon.','maison|terrasse|façade|route'),null);
add(6,'feminine singular','Three fresh insect contexts; the sustained summer song is distinctive.',
E('Sous le soleil d’été, une cigale chante dans le pin.','cicada|ant|bee|spider'),
M('Au cœur de l’été, la _____ fait entendre son chant continu dans les pins.','cigale|fourmi|mouche|abeille'),
A('La cigale chante dans un arbre pendant qu’un lézard dort sur la pierre chaude.','Quel mot désigne l’insecte dont on entend le chant ?','cigale|arbre|lézard|pierre'));
add(7,'feminine singular','Wind sense throughout; do not offer the legitimate kiss sense as an incorrect translation.',
E('La bise souffle du nord et nous glace les mains.','cold north wind|heavy rain|thick fog|summer heat'),
M('Une _____ sèche et glacée souffle du nord et secoue les branches.','bise|pluie|neige|brume'),
A('Malgré le soleil, la bise nous oblige à fermer la fenêtre et à remettre notre manteau.','Quel mot désigne un vent froid ?','bise|soleil|fenêtre|manteau'));
hold(8,'Both source occurrences are participles of venir: « la bise fut venue », « la nuit venue ». They are incorrectly linked to the noun arrival. Requires occurrence-level semantic reassignment with preserved history.');
add(9,'masculine singular','Edible portion sense; chocolate broken off is a piece rather than a container.',
E('Elle casse un morceau de chocolat et le mange.','piece|plate|packet|spoon'),
M('Il casse la tablette et mange le petit _____ de chocolat qui vient de se détacher.','morceau|verre|bol|panier'),
A('Tom détache un morceau de pain, le trempe dans la soupe et laisse le reste dans le panier.','Quel mot désigne la petite portion séparée du pain ?','morceau|pain|soupe|panier'));
add(10,'feminine singular','Natural household insect contexts; flight and buzzing exclude the crawling alternatives.',
E('Une mouche bourdonne autour de mon assiette.','fly|beetle|spider|caterpillar'),
M('La _____ entre en volant, bourdonne au-dessus du repas, puis se pose sur le pain.','mouche|araignée|chenille|limace'),
A('Une mouche se pose sur la confiture ; Léa ferme le pot et couvre aussi le beurre.','Quel mot désigne l’insecte volant ?','mouche|confiture|pot|beurre'));
add(11,'masculine singular','Small earthworm sense, distinguished from insects with legs.',
E('Sous la terre humide, un vermisseau se tortille.','small earthworm|beetle|snail|cricket'),
M('Le petit _____ se tortille sans pattes dans la terre humide.','vermisseau|scarabée|grillon|papillon'),
A('Le jardinier soulève une motte de terre et découvre un vermisseau près d’une racine.','Quel mot désigne le petit ver ?','vermisseau|jardinier|motte|racine'));
add(12,'feminine singular','Food scarcity is explicit, not merely a generic disaster.',
E('La récolte a été détruite et la famine frappe les villages privés de nourriture.','famine|flood|epidemic|storm'),
M('Privée de récoltes et de réserves de nourriture, la région souffre d’une _____.','famine|inondation|tempête|épidémie'),
A('Pour lutter contre la famine, les habitants partagent leur dernier sac de riz avec le village voisin.','Quel mot désigne le manque général de nourriture ?','famine|habitants|sac|village'));
add(13,'feminine singular','Lowercase common noun; colony and crumbs create different everyday scenes.',
E('Une fourmi porte une miette vers sa fourmilière.','ant|fly|beetle|moth'),
M('La petite _____ rejoint les autres ouvrières dans la fourmilière.','fourmi|mouche|chenille|araignée'),
A('Sur la nappe, une fourmi trouve du sucre et repart vers le jardin avec son butin.','Quel mot désigne le petit insecte qui vit en colonie ?','fourmi|nappe|sucre|jardin'));
add(14,'feminine singular','Residential proximity establishes neighbor; choices are feminine singular social roles.',
E('Ma voisine habite l’appartement juste à côté du mien.','neighbor|customer|patient|tourist'),
M('Je ne connais cette femme ni par mon travail ni par un voyage : elle habite à côté, c’est ma _____.','voisine|cliente|patiente|guide'),
A('Notre voisine frappe à la porte pour nous rendre le courrier déposé par erreur dans sa boîte.','Quel mot désigne la personne qui habite près de chez nous ?','voisine|porte|courrier|boîte'));
add(15,'masculine singular','Cereal seed sense, with an edible kernel rather than a mill or husk.',
E('La poule picore un grain de blé tombé par terre.','grain|leaf|root|pebble'),
M('Dans l’épi de blé, elle prélève un _____ bien mûr pour vérifier la récolte.','grain|noyau|pépin|bourgeon'),
A('Un grain de riz reste au fond du bol ; l’enfant le ramasse avec sa cuillère.','Quel mot désigne une seule petite semence de céréale ?','grain|bol|enfant|cuillère'));
add(16,'feminine singular','Annual season sense; alternatives have matching feminine singular agreement.',
E('L’automne est ma saison préférée pour marcher dans les bois.','season|week|holiday|day'),
M('Quand l’hiver cède la place au printemps, une nouvelle _____ commence.','saison|semaine|journée|minute'),
A('À chaque saison, le jardin change : les fleurs apparaissent au printemps et les feuilles tombent en automne.','Quel mot désigne une des grandes périodes de l’année ?','saison|jardin|fleurs|feuilles'));
hold(17,'All three source occurrences are feminine adjective nouvelle (saison/rivière/peine), but the record is a noun with news gloss and short-story definition. Must split/reassign lexical identity before quiz approval.');
hold(18,'Source « avant l’août » uses historical harvest time, not simply the modern month. Current gloss conflates both. Resolve the contextual sense before authoring an August calendar quiz.');
hold(19,'Shared source identity combines « foi d’animal » (pledged word) with « feront foi » (attestation/evidence). One pledge quiz set would teach the second occurrence incorrectly.');
add(20,'masculine singular','Retain the natural early and advanced questions; the gap alternatives already have compatible noun agreement.',null,null,null);
hold(21,'Source « intérêt et principal » means loan interest, while the linked sense is advantage/benefit. Financial charge is a distinct meaning requiring semantic identity correction, not a silent quiz rewrite.');
add(22,'masculine singular','Loan principal is separated from the added interest; this is a fictional language example.',
E('Elle rembourse le principal du prêt, puis verse les intérêts.','original loan amount|monthly salary|sales profit|rental payment'),
M('Sur les cent euros empruntés, le _____ reste de cent euros ; cinq euros d’intérêts s’y ajoutent.','principal|bénéfice|salaire|loyer'),
A('Le contrat sépare le principal des intérêts ; le remboursement comprend les deux sommes.','Quel mot désigne la somme initialement prêtée ?','principal|contrat|intérêts|remboursement'));
add(23,'feminine singular','Direction of the loan distinguishes lender from borrower and other roles.',
E('La prêteuse récupère enfin le vélo qu’elle avait confié à son amie.','lender|borrower|buyer|tenant'),
M('Cette femme m’a confié son livre pour une semaine : je le rends à la _____.','prêteuse|vendeuse|acheteuse|locataire'),
A('La prêteuse compte les billets rendus par son amie, puis déchire le reçu.','Quel mot désigne la personne qui avait prêté l’argent ?','prêteuse|billets|amie|reçu'));
add(24,'masculine singular','Moral failing, not a manufacturing flaw; alternatives name positive qualities.',
E('Son principal défaut est de mentir pour éviter les reproches.','failing|achievement|talent|strength'),
M('Il reconnaît son _____ : il ment souvent, et cela blesse ses amis.','défaut|mérite|talent|atout'),
A('La jalousie est un défaut que cet homme essaie de corriger grâce aux conseils de son amie.','Quel mot présente la jalousie comme une faiblesse morale ?','défaut|homme|conseils|amie'));
add(25,'masculine singular','Use only time as the early answer; weather is a different legitimate sense and must not be a distractor.',
E('Nous avons encore du temps avant le départ.','time|money|space|energy'),
M('Absorbée par son livre, elle ne voit pas le _____ passer ; il est déjà minuit.','temps|train|bateau|cortège'),null);
add(26,'feminine singular','Borrower must return the item; all gap options are singular feminine roles.',
E('L’emprunteuse promet de rendre l’appareil photo samedi.','borrower|lender|seller|owner'),
M('La femme qui a reçu mon vélo pour deux jours est l’_____ ; elle devra me le rendre.','emprunteuse|acheteuse|héritière|inventrice'),
A('L’emprunteuse rapporte le roman à son propriétaire et le remercie pour ce prêt.','Quel mot désigne la personne qui avait reçu le livre à rendre ?','emprunteuse|roman|propriétaire|prêt'));
add(27,'feminine singular','Dark hours between sunset and sunrise; avoid the wrong agreement of masculine day distractors.',
E('Pendant la nuit, tout le village dort et les étoiles brillent.','night|morning|afternoon|week'),
M('Il fait sombre depuis le coucher du soleil ; nous marcherons toute la _____ jusqu’à l’aube.','nuit|matinée|journée|semaine'),
A('La nuit tombe sur le port ; les pêcheurs allument une lampe dans leur bateau.','Quel mot désigne la période sombre qui commence après le jour ?','nuit|port|lampe|bateau'));
add(28,'masculine singular','Day duration sense consistently; twenty-four-hour schedule disambiguates masculine time nouns.',
E('Elle passe un jour à Lyon et repart le lendemain.','day|month|year|century'),
M('Partis lundi à midi et revenus mardi à midi, ils ont été absents un _____.','jour|mois|an|siècle'),
A('Chaque jour, le boulanger ouvre sa boutique avant le lever du soleil.','Quel mot désigne une période de vingt-quatre heures ?','jour|boulanger|boutique|soleil'));
add(29,'masculine singular','Respectful title, with professional context specifying the lawyer; no plural or feminine giveaways.',null,
M('Elle s’adresse à son avocat : « _____ Martin, pouvez-vous défendre mon dossier ? »','Maître|Capitaine|Docteur|Colonel'),null);
add(30,'masculine singular','All three existing scenes are natural and distinct. The parrot uses its beak, not a bench, arm or back; retain reviewed questions.',null,null,null);
add(31,'feminine singular','Old gap also allowed heat; the new nose cue identifies smell.',null,
M('Son nez reconnaît une _____ de pain chaud, même les yeux fermés.','odeur|couleur|saveur|chaleur'),null);
add(32,'masculine singular','Specify spoken words; remove plural and the synonymous discours option.',null,
M('Pour expliquer avec des mots faciles, le professeur emploie un _____ simple.','langage|regard|geste|sourire'),null);
add(33,'masculine singular','Neutral title for a man without invoking a profession; all alternatives are singular masculine titles.',null,
M('Sur l’enveloppe, elle veut seulement indiquer que Dupont est un homme, sans lui attribuer de profession : elle écrit « _____ Dupont ».','Monsieur|Docteur|Capitaine|Professeur'),null);
add(34,'masculine singular','Audible resonance excludes feathers, foliage and a cloud.',null,
M('Au lever du jour, le _____ du pinson résonne dans le jardin.','ramage|plumage|feuillage|nuage'),null);
add(35,'masculine singular','Wet feathers distinguish plumage from song and fur.',null,
M('Après la pluie, le _____ du perroquet est mouillé ; l’oiseau lisse ses plumes.','plumage|ramage|pelage|feuillage'),null);
add(36,'masculine singular','Existing set consistently teaches the figurative peerless-person sense, with distinct contexts and no literal bird sense used as a wrong answer.',null,null,null);
add(37,'masculine plural','Remove visitors (another legitimate sense) and habitants (a correct synonym in the gap).',
E('Les oiseaux sont les hôtes de ce jardin : ils y vivent toute l’année.','inhabitants|owners|hunters|gardeners'),
M('Les écureuils vivent dans ces arbres toute l’année ; ils en sont les _____.','hôtes|jardiniers|bûcherons|promeneurs'),null);
add(38,'masculine plural','Use four plural masculine landscape nouns; replace invalid forms and the synonymous trees answer.',null,
M('Nous traversons les _____, entourés de centaines de chênes et de hêtres qui cachent le ciel.','bois|champs|déserts|villages'),null);
add(39,'masculine plural','Count words in a short sentence; a dictionary can explain phrases and letters too, so replace that ambiguous gap.',null,
M('Dans la phrase « le chat dort », l’enfant compte trois _____.','mots|dessins|chiffres|gestes'),null);
add(40,'feminine singular','Happy behavior disambiguates the emotion; tears alone can express several feelings.',null,
M('Ravie de cette merveilleuse nouvelle, elle rit et saute de _____.','joie|peur|colère|tristesse'),null);
add(41,'feminine singular','Loss of vocal sound singles out voice; every option is a singular feminine noun.',null,
M('Le chanteur a perdu sa _____ : il ouvre la bouche pour chanter, mais aucun son ne sort.','voix|mémoire|vue|force'),null);
add(42,'feminine singular','Explicit captured food removes ambiguity with a carried feather or branch.',null,
M('Après avoir capturé une souris pour la manger, le faucon emporte sa _____ dans ses serres.','proie|plume|nichée|branche'),null);
add(43,'masculine singular','Insincere praise for advantage distinguishes flatterer; all options are masculine people nouns.',null,
M('Ce _____ couvre son chef de compliments peu sincères pour obtenir une faveur.','flatteur|critique|adversaire|censeur'),null);
add(44,'plural; aux does not require shared gender','Existing aux dépens gap has four plural nouns and distinct meanings; retain the three contextual questions.',null,null,null);
add(45,'feminine singular','A lesson prepared for pupils, with comparable singular feminine authored-document alternatives.',null,
M('Pour enseigner la géographie à ses élèves, elle prépare une _____ avec des exercices et une carte.','leçon|recette|facture|ordonnance'),null);
add(46,'masculine singular','Certainty excludes doubt; remove conjugated/derived non-noun distractions.',null,
M('Après vérification, je suis certain du résultat : je n’ai plus aucun _____.','doute|mensonge|souvenir|projet'),null);
add(47,'feminine singular','Argument offered to support a position, rather than the causal/reasoning senses.',
E('Pour défendre son choix, elle présente une raison convaincante.','argument|order|joke|insult'),
M('Pour justifier son refus, elle avance une _____ précise et soutient son point de vue.','raison|menace|promesse|question'),
A('Sa raison est simple : ce trajet coûte moins cher. Son ami écoute cet argument, puis consulte la carte.','Quel mot introduit ce qui justifie son choix ?','raison|trajet|ami|carte'));
add(48,'feminine singular','Replace elision giveaway in l’heure with une plus four feminine time units.',null,
M('Nous avons attendu une _____ entière, de neuf heures à dix heures.','heure|minute|seconde|semaine'),null);
add(49,'masculine singular','Lowercase common animal noun; offspring and ewe identify lamb among young animals.',
E('Un agneau nouveau-né reste près de la brebis.','lamb|calf|foal|piglet'),
M('La brebis allaite son petit _____, né ce matin.','agneau|veau|poulain|porcelet'),
A('Un agneau suit sa mère dans le pré, tandis qu’un cheval attend près de la barrière.','Quel mot désigne le petit de la brebis ?','agneau|pré|cheval|barrière'));
add(50,'masculine singular','Water movement consistently; do not offer other legitimate current meanings as distractors.',
E('Le courant de la rivière emporte une branche.','water current|riverbank|bridge|riverbed'),
M('Sans vent et sans moteur, le bateau descend la rivière, entraîné par le _____ de l’eau.','courant|reflet|niveau|bruit'),
A('Le nageur lutte contre le courant pour atteindre la rive où son ami l’attend avec une corde.','Quel mot désigne le mouvement de l’eau qui pousse le nageur ?','courant|rive|ami|corde'));
add(51,'feminine singular','Poetic water sense in clear physical scenes; avoid wave as a wrong English option.',
E('La barque glisse sur l’onde calme du lac.','water|sand|mist|shore'),
M('Le poisson plonge sous l’_____ du lac et disparaît dans l’eau profonde.','onde|ombre|écorce|herbe'),
A('Le reflet de la lune tremble sur l’onde, tandis que la barque avance vers la rive.','Quel mot poétique désigne l’eau ?','onde|lune|barque|rive'));
add(52,'masculine singular','Distinct wolf scenes; alternatives are singular masculine animals.',
E('Un loup gris hurle au loin dans la montagne.','wolf|deer|bear|boar'),
M('Dans la meute, un grand _____ gris lève le museau et hurle à la lune.','loup|cerf|ours|sanglier'),
A('Le loup suit les traces d’un cerf dans la neige et rejoint sa meute près du bois.','Quel mot désigne le canidé sauvage qui vit en meute ?','loup|cerf|neige|bois'));
hold(53,'Historical « chercher aventure » is annotated as seeking a quarrel. Modern travel/adventure contexts would change the sense; resolve this phrase-specific usage before approving replacement questions.');
add(54,'feminine singular','Need for food, distinct from thirst, fear and shame; same feminine singular agreement.',
E('Je n’ai rien mangé depuis ce matin et j’ai faim.','hunger|thirst|fear|shame'),
M('Son ventre réclame de la nourriture : il a vraiment _____.','faim|soif|peur|honte'),
A('La faim réveille l’enfant ; sa mère lui apporte du pain et un bol de soupe.','Quel mot désigne le besoin de manger ?','faim|enfant|pain|soupe'));
add(55,'masculine plural','Places plural in travel and visit scenes; all gap alternatives are masculine plural nouns.',
E('Nous visitons plusieurs lieux intéressants pendant notre voyage.','places|people|vehicles|meals'),
M('Le château et le musée sont deux _____ que nous visiterons demain.','lieux|véhicules|repas|voyageurs'),
A('Ces lieux ont beaucoup changé : la place est devenue un jardin et le vieux port accueille des bateaux neufs.','Quel mot désigne les endroits évoqués ?','lieux|place|jardin|port'));
add(56,'masculine singular','Drinkable liquid in coherent scenes; no beverage synonym as a wrong option.',
E('Elle boit un breuvage chaud préparé avec des herbes.','beverage|meal|medicine bottle|spice'),
M('Il verse dans une tasse le _____ chaud qu’il va boire lentement.','breuvage|biscuit|pain|fromage'),
A('Le breuvage a refroidi dans la tasse ; le voyageur le boit avant de reprendre la route.','Quel mot désigne la boisson ?','breuvage|tasse|voyageur|route'));
add(57,'feminine singular','Fury rather than disease; do not use rabies as an incorrect translation.',
E('Fou de rage après cette insulte, il frappe du poing sur la table.','fury|joy|boredom|shame'),
M('L’insulte le met dans une _____ terrible : il hurle et casse une assiette.','rage|joie|fatigue|tristesse'),
A('Sa rage retombe peu à peu ; il cesse de crier et accepte enfin les excuses de son frère.','Quel mot désigne sa colère violente ?','rage|excuses|frère|peu'));
add(58,'feminine singular','Unnecessary danger distinguishes recklessness from positive caution or confidence.',
E('Par témérité, il traverse le pont brisé malgré les avertissements.','recklessness|caution|patience|kindness'),
M('Sauter sans protection au-dessus de ce ravin serait de la _____, pas du courage réfléchi.','témérité|prudence|patience|modestie'),
A('La témérité du grimpeur inquiète son guide : il avance sans corde au bord du vide.','Quel mot désigne son audace imprudente ?','témérité|grimpeur|guide|corde'));
add(59,'masculine singular title','Direct address to a king; all alternatives are singular masculine titles.',
E('« Sire, votre carrosse est prêt », annonce le serviteur au roi.','Sire|Doctor|Professor|Captain'),
M('Devant le roi, le serviteur s’incline : « _____, votre couronne vous attend. »','Sire|Docteur|Professeur|Capitaine'),
A('« Sire, le peuple attend votre décision », dit le conseiller en s’inclinant devant le trône.','Quel mot sert à s’adresser respectueusement au roi ?','Sire|peuple|conseiller|trône'));
add(60,'feminine singular noun after Votre','Royal honorific, with feminine singular forms throughout the gap.',
E('« Votre Majesté », dit l’ambassadeur en saluant la reine.','Majesty|Highness|Excellency|Holiness'),
M('Pour saluer la reine régnante avec son titre royal exact, il dit : « Votre _____ ».','Majesté|Sainteté|Révérence|Éminence'),
A('« Votre Majesté, la salle est prête », annonce le ministre au roi, qui quitte son fauteuil.','Quel mot appartient au titre honorifique adressé au souverain ?','Majesté|salle|ministre|fauteuil'));
hold(61,'Both occurrences (« ne se mette », « que je me mette ») are subjunctive mettre. The imported noun bread chest is wrong. Preserve old history and plan fresh correct semantic identity.');
add(62,'feminine singular','Anger is explicit; no negative emotion that also fits the stated response.',
E('La colère le fait crier après son frère.','anger|joy|boredom|pride'),
M('Fâchée par cette injustice, elle exprime sa _____ en protestant vivement.','colère|joie|satisfaction|fierté'),
A('Sa colère diminue après les excuses de son voisin ; elle baisse enfin la voix et lui ouvre la porte.','Quel mot désigne le sentiment qui la faisait se fâcher ?','colère|voisin|voix|porte'));
add(63,'masculine plural','Source distance uses plural pas; each blank choice is a masculine plural distance unit.',
E('La porte est à dix pas de moi ; je peux la rejoindre rapidement.','paces|miles|inches|kilometers'),
M('Pour mesurer la distance sans règle, il marche en comptant chacun de ses _____ jusqu’au mur.','pas|mètres|kilomètres|centimètres'),
A('À vingt pas du portail, une fontaine permet aux marcheurs de remplir leur gourde.','Quel mot indique une distance mesurée avec la marche ?','pas|portail|fontaine|gourde'));
add(64,'feminine singular','Retain clear early/middle manner questions; replace the unrelated named-person tail with a coherent context.',null,null,
A('La façon dont Léa classe ses notes, par date et par thème, facilite sa recherche dans le dossier.','Quel mot désigne sa manière d’organiser les notes ?','façon|date|thème|dossier'));
add(65,'feminine singular','General drink sense, without making water the sole translation.',
E('Il commande une boisson fraîche pour accompagner son repas.','drink|plate|napkin|dessert'),
M('Elle choisit une _____ sans alcool, puis la verse dans son verre pour la boire.','boisson|assiette|serviette|fourchette'),
A('La boisson est trop chaude ; l’enfant pose sa tasse et attend avant d’en prendre une gorgée.','Quel mot désigne le liquide à boire ?','boisson|enfant|tasse|gorgée'));
add(66,'masculine singular','Existing early birthday and intermediate full-year contexts are sound; make advanced scene cohesive.',null,null,
A('Après un an de voyage, Léa revient au village et retrouve son frère devant leur ancienne maison.','Quel mot désigne une période de douze mois ?','an|voyage|village|frère'));
hold(67,'The occurrences are adjectival « l’an passé » and verbal « s’étoit passé ». Neither supports the linked noun, whose past-tense gloss also conflicts with its elapsed-time definition. Requires a sense/POS split.');
hold(68,'Both source occurrences (« je n’étais pas », « tu ne t’en étais pas aperçue ») are être, not plural construction supports. A noun quiz would reinforce an imported homograph error.');
add(69,'feminine singular','Literal mother sense; family relations distinguish all feminine singular gap options.',
E('Sa mère lui raconte comment elle l’a mis au monde.','mother|aunt|sister|cousin'),
M('La femme qui l’a mis au monde est sa _____.','mère|tante|sœur|cousine'),
A('La mère berce le bébé qu’elle vient de mettre au monde, tandis que le père prépare le lit.','Quel mot désigne la femme qui a donné naissance à l’enfant ?','mère|bébé|père|lit'));
add(70,'masculine singular','Same parents specify sibling; do not use male friend as a possible context-independent answer.',
E('Mon frère et moi avons les mêmes parents.','brother|cousin|uncle|nephew'),
M('Paul et moi sommes les deux fils des mêmes parents : il est mon _____.','frère|cousin|oncle|neveu'),
A('Elle montre une photo de son frère, né des mêmes parents qu’elle, à sa cousine venue dîner.','Quel mot désigne le fils des mêmes parents que cette femme ?','frère|photo|parents|cousine'));
add(71,'masculine plural','English answer and all gap nouns are plural, matching bergers.',
E('Les bergers rassemblent leurs moutons avant la nuit.','shepherds|fishermen|bakers|sailors'),
M('Dans la montagne, les _____ gardent les troupeaux de moutons et les conduisent vers l’herbe.','bergers|pêcheurs|boulangers|marins'),
A('Les bergers cherchent une brebis égarée pendant que leurs chiens restent près du troupeau.','Quel mot désigne les personnes qui gardent les moutons ?','bergers|brebis|chiens|troupeau'));
add(72,'masculine plural','Retain natural early/advanced questions; every intermediate alternative is now a plural animal noun.',null,
M('Les _____ aboient devant la porte.','chiens|chats|chevaux|lapins'),null);
add(73,'masculine singular','The essential-issue sense remains consistent. Surface was a feminine grammatical giveaway; the replacement alternatives fit le.',null,
M('Les experts s’accordent sur le _____ de l’affaire, mais discutent encore des détails de présentation.','fond|calendrier|lieu|coût'),
A('Le fond du désaccord concerne la confiance : les associés discutent de ce problème avant de signer leur contrat.','Quel mot désigne la partie essentielle du désaccord ?','fond|confiance|associés|contrat'));
add(74,'feminine plural','Plural forests throughout; gap alternatives are all feminine plural landscapes.',
E('Ces forêts sont couvertes de grands arbres très serrés.','forests|beaches|meadows|dunes'),
M('Dans ces vastes _____, des milliers de troncs se dressent sous un toit de feuilles.','forêts|plages|prairies|dunes'),
A('Les forêts de la région abritent des cerfs ; un sentier permet d’y marcher entre les arbres.','Quel mot désigne les grandes étendues couvertes d’arbres ?','forêts|région|cerfs|sentier'));
add(75,'feminine singular','Procedural form, not physical shape. Fictional document scene; no legal advice or claim about an actual rule.',
E('Le document respecte le contenu demandé, mais un détail de forme reste à corriger avant sa signature.','procedure|size|color|weight'),
M('La signature manque : le problème concerne la _____ du document, et non la justesse de son contenu.','forme|couleur|longueur|matière'),
A('Le juge signale un défaut de forme dans la convocation : une étape de la procédure a été oubliée par le greffier.','Quel mot renvoie au respect de la procédure ?','forme|juge|convocation|greffier'));
add(76,'masculine singular','Natural courtroom scenes replace the pedagogical-definition frames.',
E('Pendant le procès, le juge écoute les témoins et les avocats.','trial|election|lesson|festival'),
M('Au tribunal, le _____ commence : les avocats vont présenter leurs arguments au juge.','procès|concert|match|spectacle'),
A('Le procès dure trois jours ; le juge entend les témoins avant de rendre sa décision.','Quel mot désigne la procédure judiciaire où l’affaire est examinée ?','procès|jours|juge|témoins'));
hold(77,'The everyone meaning belongs to the whole expression « tout le monde », not isolated monde. Current single-word gloss/identity should be resolved against the expression model before approval.');
add(78,'masculine singular','Old avoir gap mixed genders and also allowed envie. New noun phrase contrasts necessity with surplus.',null,
M('Cette famille manque d’eau potable ; son _____ le plus urgent est de pouvoir boire.','besoin|surplus|souvenir|loisir'),null);
add(79,'feminine singular','Truth is confirmed by matching facts; same-gender gap alternatives avoid a silence giveaway.',
E('Elle dit la vérité : la caméra confirme exactement son récit.','truth|rumor|lie|joke'),
M('Son récit correspond en tout point aux faits vérifiés : elle a dit la _____.','vérité|rumeur|légende|plaisanterie'),
A('La vérité apparaît quand les témoins racontent les faits ; le mensonge ne peut plus être caché.','Quel mot désigne ce qui est conforme aux faits ?','vérité|témoins|faits|mensonge'));
add(80,'feminine plural','Plural short fictional tales; avoid presenting a singular English gloss for fables.',
E('Les enfants écoutent des fables où les animaux parlent.','fables|recipes|letters|songs'),
M('Dans ces courtes _____, les animaux parlent et l’histoire se termine par une morale.','fables|recettes|lettres|chansons'),
A('Elle lit deux fables à sa classe, puis demande aux élèves ce que ces récits leur apprennent.','Quel mot désigne les histoires racontées pour transmettre une leçon ?','fables|classe|élèves|apprennent'));
add(81,'feminine singular','Old a thing to check also allowed cause/part; use an object demonstrative context.',
E('Quelle est cette chose posée sur la table ? Je ne reconnais pas cet objet.','thing|person|place|hour'),
M('Il montre un objet inconnu et demande : « Quelle est cette _____ ? »','chose|heure|date|fois'),null);
add(82,'feminine plural','Evidence supported by verifiable records; all gap options are feminine plural nouns.',
E('Les photos datées apportent des preuves de sa présence sur place.','evidence|rumors|questions|orders'),
M('Pour établir les faits, elle présente des _____ vérifiables : des vidéos et des reçus datés.','preuves|rumeurs|questions|suppositions'),
A('Les preuves confirment le récit du témoin : une vidéo montre son arrivée et un reçu indique l’heure.','Quel mot désigne les éléments qui établissent la réalité des faits ?','preuves|témoin|arrivée|heure'));
add(83,'feminine plural','Plural animal limbs, with compatible plural feminine body-part distractors.',
E('Le chien pose ses pattes boueuses sur le tapis.','paws|ears|tails|wings'),
M('Le chat marche sur ses quatre _____ et laisse des traces dans la boue.','pattes|oreilles|griffes|moustaches'),
A('Le vétérinaire nettoie les pattes du chien avant de retirer une épine plantée sous l’une d’elles.','Quel mot désigne les membres sur lesquels le chien marche ?','pattes|vétérinaire|chien|épine'));
add(84,'masculine singular','Lowercase common animal noun; mane distinguishes lion from other large cats.',
E('Un lion à la crinière épaisse se repose dans la savane.','lion|tiger|leopard|cheetah'),
M('Le grand félin à la crinière épaisse est un _____ qui se repose dans la savane.','lion|tigre|léopard|guépard'),
A('Le lion secoue sa crinière et rejoint les lionnes près d’un arbre, pendant qu’une gazelle s’éloigne.','Quel mot désigne le grand félin mâle à crinière ?','lion|lionnes|arbre|gazelle'));
add(85,'masculine singular','Rat is a rodent; distinguish it from other small mammals without using mouse as a misleading grammatical clue.',
E('Un rat ronge un sac de grains dans la cave.','rat|hedgehog|rabbit|bat'),
M('Un _____ au museau pointu et à la longue queue presque nue ronge le sac de blé.','rat|hérisson|lapin|écureuil'),
A('Le rat sort de son trou, saisit un grain tombé du sac et disparaît sous une planche.','Quel mot désigne le rongeur à longue queue ?','rat|trou|grain|planche'));
add(86,'feminine singular','Ground/soil usage throughout, without using planet as a wrong English sense.',
E('Elle creuse la terre pour planter des graines.','soil|water|air|stone'),
M('Le jardinier enterre les graines dans une _____ humide et fertile.','terre|eau|pierre|feuille'),
A('Après la pluie, la terre colle aux bottes du jardinier qui traverse son potager.','Quel mot désigne le sol où poussent les plantes ?','terre|pluie|bottes|jardinier'));
add(87,'masculine singular','Lowercase common title in running prose; crown and rule distinguish the king.',
E('Le roi porte sa couronne lors de la cérémonie au palais.','king|prince|minister|knight'),
M('À la mort de son père, le prince reçoit la couronne et devient le nouveau _____ du royaume.','roi|ministre|conseiller|chevalier'),
A('Le roi réunit ses ministres au palais pour décider de l’avenir du royaume.','Quel mot désigne le souverain du royaume ?','roi|ministres|palais|avenir'));
add(88,'masculine plural','Plural meaning and noun choices, with living creature context.',
E('Les animaux de la ferme ont besoin d’eau et de nourriture.','animals|plants|buildings|machines'),
M('Les vaches et les chevaux sont des _____ que le fermier nourrit chaque matin.','animaux|végétaux|bâtiments|outils'),
A('Les animaux s’abritent dans l’étable pendant que le fermier ferme la porte avant l’orage.','Quel mot désigne les êtres vivants qui peuvent se déplacer et que le fermier élève ?','animaux|étable|porte|orage'));
add(89,'feminine singular','Opportunity sense, not a dated event; feminine singular alternatives.',
E('Cette visite m’offre l’occasion de revoir mon ancien professeur.','opportunity|obligation|difficulty|refusal'),
M('Le voyage lui offre une _____ inespérée de rencontrer son écrivain préféré.','occasion|interdiction|difficulté|obligation'),
A('Une place se libère dans le cours : elle saisit cette occasion et s’inscrit avant la fin de la journée.','Quel mot désigne la possibilité favorable qu’elle utilise ?','occasion|place|cours|journée'));
add(90,'feminine singular','A person’s existence over time, not a narrower vacation or single event.',
E('Il raconte sa vie, depuis son enfance jusqu’à sa retraite.','life|holiday|career|journey'),
M('Son livre raconte toute sa _____, de sa naissance à ses quatre-vingts ans.','vie|carrière|jeunesse|retraite'),
A('À la fin de sa vie, elle rassemble ses souvenirs d’enfance et les offre à ses petits-enfants.','Quel mot désigne l’ensemble de son existence ?','vie|fin|souvenirs|enfance'));
add(91,'masculine singular','Helpful act, with masculine singular contrasts; no second favor/service synonym.',
E('Offrir un abri à cette famille sans logement est un bienfait qu’elle n’oubliera pas.','kind deed|insult|punishment|accident'),
M('Le repas offert aux voyageurs affamés est un _____ dont ils remercient leur hôte.','bienfait|préjudice|châtiment|obstacle'),
A('Elle se souvient de ce bienfait : son voisin avait réparé gratuitement le toit qui fuyait.','Quel mot désigne le service généreux qu’elle a reçu ?','bienfait|voisin|toit|gratuitement'));
hold(92,'Archaic « d’un Rat eût affaire » means need of help, while modern avoir affaire is broader dealings. Needs phrase/lexical review before using modern affair/business quizzes.');
add(93,'masculine plural','Literary nets in clear capture scenes; all intermediate alternatives plural masculine nouns.',
E('L’oiseau pris dans les rets bat des ailes sans parvenir à sortir du filet.','nets|cages|branches|rocks'),
M('Les mailles des _____ retiennent les poissons que le pêcheur ramène à bord.','rets|hameçons|seaux|paniers'),
A('Le chasseur retire les rets du buisson et libère l’oiseau coincé dans leurs mailles.','Quel mot littéraire désigne les filets ?','rets|chasseur|buisson|oiseau'));
add(94,'masculine plural','Plural roars, with parallel plural sound nouns.',
E('Les rugissements des lions résonnent dans la nuit.','roars|whispers|whistles|claps'),
M('On reconnaît les lions aux puissants _____ qu’ils poussent près de leur territoire.','rugissements|sifflements|miaulements|bêlements'),
A('Les rugissements du tigre font reculer les visiteurs, qui restent derrière la barrière.','Quel mot désigne les cris puissants du grand félin ?','rugissements|tigre|visiteurs|barrière'));
add(95,'feminine plural','Plural teeth, with feminine plural body-part alternatives.',
E('Elle se brosse les dents après le repas.','teeth|hands|ears|lips'),
M('Il croque la pomme et la mâche avec ses _____.','dents|lèvres|joues|oreilles'),
A('Le dentiste examine les dents de l’enfant et lui demande d’ouvrir davantage la bouche.','Quel mot désigne les organes durs qui servent à mâcher ?','dents|dentiste|enfant|bouche'));
add(96,'feminine singular','Single loop of net, with compatible singular feminine sewing/material nouns.',
E('Le pêcheur répare une maille déchirée dans son filet.','mesh loop|handle|weight|hook'),
M('Le fil s’est rompu : une _____ du filet est ouverte et laisse passer les petits poissons.','maille|poignée|corde|étiquette'),
A('Elle passe le fil dans une maille du filet, serre le nœud et vérifie la réparation.','Quel mot désigne une boucle qui compose le filet ?','maille|fil|nœud|réparation'));
add(97,'masculine singular','Labour/activity sense, avoiding book as an incorrect translation.',
E('Il se met à l’ouvrage pour réparer la barrière avant la nuit.','work|rest|sleep|play'),
M('Après une courte pause, elle reprend son _____ et continue de réparer la chaise.','ouvrage|repos|sommeil|repas'),
A('L’ouvrage avance lentement : les maçons posent chaque pierre avec soin avant de préparer le ciment.','Quel mot désigne ici le travail en cours ?','ouvrage|maçons|pierre|ciment'));
add(98,'feminine singular','Calm endurance through difficulty; feminine singular distractors.',
E('Elle attend avec patience, sans se plaindre du retard.','patience|anger|haste|fear'),
M('Malgré les erreurs répétées de l’enfant, elle garde sa _____ et explique encore calmement.','patience|colère|hâte|rancune'),
A('Sa patience aide les débutants : il répète les consignes sans s’énerver et les laisse essayer à nouveau.','Quel mot désigne sa capacité à supporter les difficultés sans s’irriter ?','patience|débutants|consignes|essayer'));
add(99,'feminine singular','Temporal duration sense throughout; do not mark physical length as an incorrect English meaning.',
E('La longueur de l’attente nous fatigue : voilà trois heures que nous sommes ici.','duration|noise|cost|difficulty'),
M('La _____ de la réunion nous surprend : elle dure cinq heures au lieu d’une seule.','longueur|fréquence|date|taille'),
A('Malgré la longueur du trajet, les passagers restent calmes et regardent le paysage par la fenêtre.','Quel mot évoque ici la durée du voyage ?','longueur|passagers|paysage|fenêtre'));
add(100,'feminine singular','Retain the physical-force early/middle questions; make the moral-strength passage one coherent situation.',null,null,
A('Sa force morale lui permet de résister aux menaces et de protéger son amie malgré la peur.','Quel mot désigne la puissance morale qui l’aide à résister ?','force|menaces|amie|peur'));
export default {version:1,id:'fr-2026-09-19-01',language:'fr',snapshot:'fr-0001-0100-input.json',entries:rows};
