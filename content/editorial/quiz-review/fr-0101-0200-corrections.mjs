const E=(context,choices)=>({context,choices:choices.split('|')});const M=E;
const A=(context,prompt,choices)=>({context,prompt,choices:choices.split('|')});const rows=[];
const add=(index,agreement,reason,early,middle,advanced)=>rows.push({index,agreement,reason,questions:[early,middle,advanced]});
const hold=(index,reason)=>rows.push({index,status:'blocked_lexical_review',reason});
hold(101,'Shared point identity combines timely à point with numerous negative ne…point occurrences. Correct per-occurrence meaning before approving a timely-moment quiz.');
add(102,'masculine singular','Lowercase common noun; long ears and field habitat retain the hare identification.',null,
M('Au bord du bois, un _____ aux longues oreilles et aux longues pattes arrière bondit à travers le champ.','lièvre|renard|corbeau|cheval'),null);
add(103,'feminine singular','Common noun lowercase; all gap choices are singular feminine animals. Retain clear shell clue.',null,
M('La _____ rentre lentement la tête dans sa carapace.','tortue|biche|poule|souris'),null);
add(104,'masculine singular','Existing testimony set has natural, distinct contexts and four masculine singular nouns at the intermediate band.',null,null,null);
add(105,'masculine singular','The old advanced choices included objectif, an equally correct answer to the synonym question.',null,null,
A('Le but de notre équipe est de terminer le pont avant l’hiver ; chacun travaille avec soin.','Quel mot désigne l’objectif que l’équipe veut atteindre ?','but|équipe|pont|hiver'));
add(106,'masculine plural','Remove adjective grands and the equally possible grammes of salt; English answer is plural.',
E('Quelques grains de blé restent sur la table.','grains|branches|bottles|stones'),
M('Les poules picorent les petits _____ de blé tombés d’un épi.','grains|cailloux|insectes|copeaux'),null);
add(107,'masculine plural','What can be gained or lost identifies stakes; mere importance of negotiation also allowed troubles.',null,
M('L’emploi et l’avenir de l’usine sont les principaux _____ de cette négociation : tout peut être gagné ou perdu.','enjeux|outils|documents|locaux'),null);
add(108,'masculine singular','A walking movement rather than an arbitrary unit of distance; all options singular masculine nouns.',null,
M('Elle avance un pied, puis l’autre : après une longue immobilité, elle fait enfin son premier _____.','pas|saut|tour|plongeon'),null);
add(109,'feminine singular','Keep the natural matter/case set; the gap alternatives are already feminine singular nouns.',null,null,null);
add(110,'masculine singular','Replace verb/adjective distractors with people nouns; the judicial decision specifies judge.',null,
M('Après avoir écouté les avocats, le _____ rend sa décision pour trancher le litige.','juge|témoin|accusé|greffier'),null);
hold(111,'Source « les renvoie aux calendes » is a figurative distant/postponed date. Current questions teach only literal Roman calendar facts. Resolve the phrase-specific sense before approval.');
add(112,'feminine plural','All gap alternatives are plural landscapes; heath vegetation distinguishes moorland.',null,
M('Ces vastes _____ couvertes de bruyère et d’ajoncs n’ont presque aucun arbre.','landes|forêts|plages|vignes'),null);
add(113,'masculine singular','What remains after the others ate is explicit; remove the equally possible morceau.',null,
M('Tout le monde a mangé ; elle range le _____ du gâteau, la partie qui n’a pas été servie.','reste|début|prix|poids'),null);
add(114,'masculine singular','Three sound wind contexts; all intermediate nouns have matching agreement.',null,null,null);
add(115,'masculine singular','Pace sense only; railway vehicle is a legitimate other meaning and is removed from wrong English choices.',
E('Le cheval avance d’un train régulier, sans accélérer ni ralentir.','pace|noise|direction|distance'),
M('Les chevaux gardent un _____ régulier pendant la marche, sans accélérer ni ralentir.','train|cri|sommeil|regard'),null);
add(116,'masculine singular','Senate membership is decisive; generic representation or speaking also fits other officials.',null,
M('Élu au Sénat, ce _____ participe au vote des lois dans cette assemblée.','sénateur|ministre|juge|préfet'),null);
add(117,'feminine singular','Explicit lack of progress removes the old equally plausible quality or speed options.',null,
M('Les travaux avancent très peu chaque jour ; leur _____ retarde la réouverture du pont.','lenteur|rapidité|qualité|beauté'),null);
add(118,'feminine singular','Winning establishes victory, and all choices are feminine singular competition outcomes/events.',null,
M('Après avoir gagné la finale, les joueuses fêtent leur _____.','victoire|défaite|élimination|blessure'),null);
add(119,'feminine singular','Use wager consistently to match the source contest, rather than switching to a daunting project.',
E('Ils acceptent la gageure : le perdant offrira le dîner au gagnant.','wager|certainty|habit|reward'),
M('Ils acceptent cette _____ : chacun mise dix euros sur sa propre victoire.','gageure|certitude|habitude|récompense'),
A('La gageure amuse les deux amis : celui qui perdra la partie devra payer le repas.','Quel mot désigne le pari accepté par les amis ?','gageure|amis|partie|repas'));
add(120,'feminine singular','Public admiration distinguishes glory; a returning hero can also be muddy or tired.',null,
M('Admirée et célébrée dans tout le pays pour son exploit, elle connaît enfin la _____.','gloire|honte|fatigue|misère'),null);
add(121,'masculine singular','Moral honor sense and matching masculine singular abstract nouns.',
E('Paul défend son honneur devant le juge.','honor|wealth|comfort|safety'),
M('Il préfère tenir sa parole plutôt que gagner de l’argent en trichant : il tient à son _____.','honneur|profit|confort|repos'),null);
add(122,'feminine singular','Remove purpose, another legitimate meaning of fin; explicit closing identifies the end.',
E('Le voyage touche à sa fin.','end|beginning|middle|delay'),
M('Le rideau se ferme, les acteurs saluent et le public sort : c’est la _____ du spectacle.','fin|suite|cause|durée'),null);
add(123,'masculine singular','The old generic light-on-the-street gap allowed several positions.',
E('Paul attend au bout du chemin, là où il se termine.','end|middle|width|surface'),
M('Elle arrive au _____ du chemin : au-delà, il n’y a plus de route, seulement la mer.','bout|milieu|centre|cœur'),null);
add(124,'feminine singular','Race arena/course sense; replace the source-like hare/tortoise scene and ambiguous ordinary field gap.',
E('Les chevaux entrent dans la carrière pour s’entraîner sur la piste de sable.','riding arena|stable|forest|river'),
M('Pour entraîner les chevaux, on a aménagé une _____ rectangulaire avec du sable et des barrières.','carrière|écurie|prairie|route'),
A('Dans la carrière, la cavalière guide son cheval entre les obstacles pendant que son entraîneur observe depuis la barrière.','Quel mot désigne l’espace aménagé pour l’exercice du cheval ?','carrière|cavalière|cheval|barrière'));
add(125,'masculine singular','New projectile context avoids the source-like hare comparison.',
E('Le trait lancé par l’arbalète se plante dans la cible.','bolt|rope|wheel|shield'),
M('Le _____ décoché par l’arbalète traverse l’air et se plante dans le bois.','trait|tronc|bouclier|casque'),null);
add(126,'masculine plural','Three different scenes; remove steps and efforts that also fit a generic powerful movement.',
E('Le chevreuil avance par grands élans au-dessus des hautes herbes.','leaps|pauses|turns|stumbles'),
M('Le danseur progresse par _____ vers l’avant, quittant le sol à chaque bond.','élans|arrêts|reculs|repos'),
A('Les élans du jeune chien le portent au-dessus des flaques, tandis que son maître reste sur le chemin sec.','Quel mot désigne les bonds vers l’avant ?','élans|chien|flaques|chemin'));
hold(127,'This reason identity combines avoir raison (being right) and raison d’État with causal-motive quizzes. Source meanings require explicit lexical/phrase separation; the existing early answer even combines reason and right.');
add(128,'feminine singular','Vehicle speed set already has distinct coherent contexts and compatible singular feminine nouns.',null,null,null);
add(129,'feminine singular','Retain early/middle family questions; make the advanced family scene coherent.',null,null,
A('La famille se réunit pour le repas : les parents arrivent avec leurs enfants et apportent un gâteau.','Quel mot désigne l’ensemble uni par la parenté ?','famille|repas|enfants|gâteau'));
add(130,'masculine singular','Highest-level army officer rather than an unspecified planner; remove the unrelated names in advanced.',null,
M('Cet officier de très haut rang commande plusieurs divisions de l’armée : le _____ présente son plan.','général|capitaine|sergent|caporal'),
A('Le général dirige les opérations de plusieurs divisions ; ses officiers lui présentent la carte avant de transmettre les ordres.','Quel mot désigne l’officier de très haut rang ?','général|divisions|carte|ordres'));
add(131,'feminine singular','An episode in a film, not an inserted definition or word list.',
E('Cette scène du film montre les retrouvailles des deux amis.','scene|title|review|poster'),
M('Dans cette _____ du film, les deux personnages se rencontrent pour la première fois.','scène|affiche|critique|musique'),
A('La scène se termine quand le personnage ferme la porte ; le film passe ensuite à une autre époque.','Quel mot désigne l’épisode du film ?','scène|personnage|porte|époque'));
add(132,'feminine singular','Existing affair/case contexts are coherent and the gap alternatives agree.',null,null,null);
add(133,'feminine singular','Make weakness physically explicit; the old security-system gap also allowed age.',null,
M('Après deux semaines au lit, sa _____ l’empêche même de soulever une petite valise.','faiblesse|vigueur|souplesse|adresse'),
A('Sa faiblesse physique l’empêche de porter la caisse ; elle appelle son voisin, qui apporte un chariot.','Quel mot désigne le manque de force ?','faiblesse|caisse|voisin|chariot'));
add(134,'feminine singular','All gap alternatives are feminine nouns; military fighting disambiguates conflict.',null,
M('Pour faire cesser les combats entre les deux pays, les diplomates tentent de mettre fin à la _____.','guerre|paix|fête|récolte'),
A('La guerre chasse les habitants de leurs maisons ; ils traversent la frontière pour fuir les combats.','Quel mot désigne le conflit armé ?','guerre|habitants|maisons|frontière'));
add(135,'masculine singular','Officer versus noncommissioned/subordinate roles, with explicit command authority.',
E('L’officier donne ses ordres aux soldats avant leur départ.','military officer|civilian|recruit|prisoner'),
M('Ce lieutenant est un _____ qui commande une unité de soldats.','officier|civil|détenu|conscrit'),
A('L’officier rassemble ses soldats dans la cour et leur présente le plan de l’exercice.','Quel mot désigne le militaire titulaire d’un grade de commandement ?','officier|soldats|cour|plan'));
add(136,'masculine plural','Administrative departments rather than furniture; all existing scenes and alternatives fit.',null,null,null);
add(137,'feminine plural','Plural pages and plural feminine written-document distractors.',
E('Elle tourne les pages du livre pour retrouver le passage marqué.','pages|covers|titles|shelves'),
M('Les _____ de ce livre sont numérotées en bas et imprimées des deux côtés.','pages|couvertures|reliures|étiquettes'),
A('Les pages du cahier se détachent ; l’élève les rassemble et les range dans une chemise.','Quel mot désigne les feuilles écrites du cahier ?','pages|cahier|élève|chemise'));
add(138,'masculine singular','Remove the unnatural finger attached to the end of the hand gloss; all gap body parts masculine singular.',
E('Elle lève un doigt pour demander la parole.','finger|elbow|knee|shoulder'),
M('Elle glisse une bague autour d’un _____ de sa main gauche.','doigt|coude|genou|poignet'),
A('Elle se coupe le doigt en préparant les légumes, pose le couteau et demande un pansement.','Quel mot désigne la partie de la main qui est blessée ?','doigt|légumes|couteau|pansement'));
add(139,'masculine singular','General staff, not another administrative body; remove disjoint unrelated named actions.',null,null,
A('L’état-major examine la carte avec le général, puis prépare les ordres à transmettre aux unités.','Quel mot désigne les officiers qui assistent le commandement ?','état-major|carte|ordres|unités'));
add(140,'masculine plural','Information sense, with grammatical plural noun alternatives.',
E('Le guide nous donne des renseignements sur les horaires des visites.','information|warnings|souvenirs|tickets'),
M('Pour connaître les heures d’ouverture, elle demande des _____ à l’accueil.','renseignements|souvenirs|cadeaux|outils'),
A('Les renseignements reçus par téléphone permettent au voyageur de choisir son train et de préparer son départ.','Quel mot désigne les informations obtenues ?','renseignements|téléphone|train|départ'));
add(141,'feminine singular','Illness in a fictional ordinary context; no diagnostic or treatment advice.',
E('La maladie le fatigue et l’oblige à rester chez lui quelques jours.','illness|journey|celebration|argument'),
M('Atteint d’une _____ contagieuse, il reste à la maison pour éviter de la transmettre.','maladie|blessure|fracture|brûlure'),
A('Pendant sa maladie, son amie lui apporte les notes du cours pour qu’il puisse les lire au lit.','Quel mot désigne l’altération de sa santé ?','maladie|amie|notes|lit'));
add(142,'feminine plural','Victims plural, all feminine plural groups; harm makes the role clear.',
E('Les victimes de l’incendie reçoivent des vêtements et un logement provisoire.','victims|rescuers|witnesses|organizers'),
M('Ces familles ont tout perdu dans l’inondation : les _____ sont accueillies dans un gymnase.','victimes|organisatrices|donatrices|secouristes'),
A('Les victimes du vol signalent la disparition de leurs sacs à la police et décrivent les objets manquants.','Quel mot désigne les personnes qui ont subi le dommage ?','victimes|sacs|police|objets'));
add(143,'feminine singular','Human society rather than a company; all gap choices are feminine singular collectives.',
E('Dans cette société, les habitants partagent des règles de vie communes.','society|family|team|committee'),
M('Les lois, l’école et les traditions organisent la vie de toute la _____ de ce pays.','société|compagnie|chorale|brigade'),
A('La société évolue quand ses habitants changent leurs habitudes, leurs lois et leur manière de vivre ensemble.','Quel mot désigne l’ensemble des personnes vivant dans une communauté organisée ?','société|habitants|lois|manière'));
add(144,'feminine singular','Fairness/right of each person, with matched singular feminine abstractions.',
E('Par souci de justice, elle applique la même règle à chaque participant.','fairness|revenge|anger|haste'),
M('Pour respecter les droits de chacun sans favoriser ses amis, elle agit avec _____.','justice|partialité|haine|négligence'),
A('La justice exige ici que chacun soit traité selon les mêmes règles, sans privilège accordé aux plus riches.','Quel mot désigne le principe de respect des droits de chacun ?','justice|règles|privilège|riches'));
add(145,'masculine plural','Serial fiction, with plural masculine printed-text alternatives.',
E('Le journal publie des romans-feuilletons dont les lecteurs attendent chaque épisode.','serial novels|private letters|weather reports|advertisements'),
M('Ces _____ paraissent chapitre après chapitre dans le journal, et chaque épisode poursuit la même histoire.','romans-feuilletons|bulletins météo|avis publics|comptes rendus'),
A('Elle découpe les romans-feuilletons du journal et conserve les épisodes pour relire chaque récit en entier.','Quel mot désigne les romans publiés par épisodes ?','romans-feuilletons|journal|épisodes|récit'));
add(146,'masculine singular','Retain attentive examination early/middle; integrate advanced accounting details naturally.',null,null,
A('L’examen des comptes révèle une erreur : une facture a été comptée deux fois dans le registre.','Quel mot désigne l’étude attentive destinée à vérifier les comptes ?','examen|erreur|facture|registre'));
add(147,'feminine singular','Literary loss-of-reason sense in explicit fiction, not a clinical diagnosis; cohesive stage scene.',null,null,
A('Dans la pièce, la démence du roi grandit : il parle à un fauteuil vide et croit y voir un ennemi.','Quel mot désigne ici le dérèglement profond de la raison du personnage ?','démence|roi|fauteuil|ennemi'));
add(148,'feminine singular','Innocence established by not committing the act; vowel-initial feminine alternatives fit son.',
E('La vidéo prouve son innocence : il n’était pas sur les lieux au moment du vol.','innocence|guilt|fear|anger'),
M('La preuve qu’elle n’a pas commis le vol établit son _____.','innocence|imprudence|avidité|hostilité'),
A('Son innocence est reconnue après la découverte d’une vidéo qui montre le véritable voleur.','Quel mot désigne le fait de ne pas avoir commis la faute reprochée ?','innocence|découverte|vidéo|voleur'));
add(149,'masculine plural','Physical places, not times or methods that also fit the old observation gap.',null,
M('La plage et le jardin sont deux _____ où nous aimons nous promener.','endroits|moments|motifs|moyens'),
A('Ces endroits offrent une vue sur la vallée ; les promeneurs s’y arrêtent pour photographier le paysage.','Quel mot désigne les lieux où les promeneurs s’arrêtent ?','endroits|vallée|promeneurs|paysage'));
add(150,'masculine singular','Sacrificing someone for another interest, rather than changing to a religious ritual sense.',
E('Le sacrifice de cet employé, licencié pour protéger son supérieur, révolte ses collègues.','sacrifice|promotion|rescue|reward'),
M('Abandonner un innocent pour protéger les vrais responsables serait un _____ injuste.','sacrifice|sauvetage|accueil|hommage'),
A('Elle refuse le sacrifice de son collègue : elle révèle les faits pour empêcher qu’il paie à la place des autres.','Quel mot désigne le fait d’abandonner quelqu’un au profit d’autrui ?','sacrifice|collègue|faits|place'));
add(151,'masculine singular','Firsthand observation distinguishes witness; all gap alternatives are singular masculine roles.',
E('Le témoin raconte l’accident qu’il a vu depuis sa fenêtre.','witness|judge|suspect|author'),
M('Cet homme a assisté à l’accident et peut raconter ce qu’il a vu : la police interroge ce _____.','témoin|romancier|traducteur|comptable'),
A('Le témoin décrit la voiture qui a heurté le mur ; le policier note les détails dans son carnet.','Quel mot désigne la personne qui a vu les faits ?','témoin|voiture|mur|carnet'));
add(152,'masculine singular','Remove feminine certainty giveaway; uncertainty arises from contradictions.',null,
M('Les témoignages se contredisent : un _____ subsiste sur ce qui s’est passé.','doute|accord|fait|constat'),
A('Le doute persiste après deux réponses contradictoires ; elle vérifie donc la date dans le courrier du directeur.','Quel mot désigne son incertitude ?','doute|date|courrier|directeur'));
add(153,'feminine plural','Secret harmful schemes, with matching plural feminine alternatives.',
E('Leurs machinations secrètes visent à faire renvoyer un collègue innocent.','schemes|celebrations|apologies|donations'),
M('Pour nuire à leur rival, ils préparent des _____ secrètes et répandent de faux documents.','machinations|réconciliations|célébrations|donations'),
A('Elle découvre les machinations de ses adversaires en lisant une lettre qui détaille leur plan pour la ruiner.','Quel mot désigne les manœuvres secrètes destinées à nuire ?','machinations|adversaires|lettre|plan'));
add(154,'masculine singular','The existing crime set is coherent and all intermediate alternatives agree; no legal advice is supplied.',null,null,null);
add(155,'masculine singular','Painful regret after wrongdoing; all singular masculine emotion/state nouns.',
E('Pris de remords après son mensonge, il retourne présenter ses excuses.','remorse|pride|relief|amusement'),
M('Depuis qu’il a trahi son ami, un _____ douloureux le pousse à vouloir réparer sa faute.','remords|orgueil|bonheur|soulagement'),
A('Le remords l’empêche de dormir ; il repense à sa trahison et décide de rendre l’argent volé.','Quel mot désigne le regret douloureux d’avoir mal agi ?','remords|trahison|argent|dormir'));
add(156,'masculine singular','Attachment to country, with singular masculine abstract alternatives.',
E('Son patriotisme l’incite à servir son pays avec dévouement.','patriotism|selfishness|boredom|distrust'),
M('Par _____, elle consacre ses efforts au service de son pays, auquel elle est profondément attachée.','patriotisme|égoïsme|mépris|désintérêt'),
A('Le patriotisme rassemble ces citoyens qui veulent aider leur pays après la catastrophe.','Quel mot désigne l’attachement et le dévouement au pays ?','patriotisme|citoyens|pays|catastrophe'));
hold(157,'Existing early answer closed doors translates the whole expression à huis clos, not target huis (door). Review the expression/component treatment and archaic independent usage before approving.');
add(158,'masculine singular','A hundred-year period in concrete dated contexts; matching masculine time units.',
E('Un siècle sépare ces deux photographies, prises en 1900 et en 2000.','century|decade|year|month'),
M('Entre la naissance de cet homme en 1900 et son centième anniversaire en 2000, un _____ s’est écoulé.','siècle|mois|an|millénaire'),
A('Ce pont a résisté pendant un siècle avant sa rénovation, réalisée cent ans après sa construction.','Quel mot désigne la période de cent années ?','siècle|pont|rénovation|construction'));
add(159,'feminine plural','Invention rather than memory; all alternatives plural feminine faculties.',null,
M('Pour inventer des mondes qui n’ont jamais existé, les enfants font travailler leurs _____.','imaginations|mémoires|habitudes|émotions'),
A('Les imaginations des élèves inventent des créatures différentes ; chacun dessine la sienne et lui donne un nom.','Quel mot désigne les facultés d’invention ?','imaginations|élèves|créatures|nom'));
add(160,'masculine singular','Face distinguished by eyes/nose/mouth, with masculine singular body-region distractors.',
E('Son visage s’éclaire d’un sourire quand elle nous voit.','face|arm|back|chest'),
M('Elle lave son _____, en passant le gant autour des yeux, du nez et de la bouche.','visage|bras|dos|cou'),
A('Il cache son visage derrière ses mains, mais son sourire apparaît entre ses doigts.','Quel mot désigne l’avant de la tête ?','visage|mains|sourire|doigts'));
hold(161,'Source sous combines preposition (sous terre, sous la pression) with plural coin noun (cinq sous la page), while its lemma is classified as noun and its sense as preposition. Split/reassign occurrences before questions.');
add(162,'masculine plural','Existing council-plural questions consistently refer to deliberating assemblies and satisfy agreement.',null,null,null);
add(163,'masculine singular','Existing council-singular questions use the assembly sense consistently and have compatible gap nouns.',null,null,null);
add(164,'feminine singular','Completed creative work, with the same feminine agreement for all alternatives.',
E('Cette œuvre du sculpteur représente un cheval grandeur nature.','work|tool|payment|workshop'),
M('Sa statue de marbre achevée, la sculptrice expose cette _____ grandeur nature dans la galerie.','œuvre|photographie|partition|gravure'),
A('L’œuvre occupe le centre de la salle ; le public admire la sculpture et félicite son auteur.','Quel mot désigne le résultat du travail artistique ?','œuvre|salle|public|auteur'));
add(165,'feminine singular','Intolerance of beliefs, not food intolerance; all choices fit son through vowel-initial feminine nouns.',
E('Son intolérance le pousse à rejeter toute personne dont les croyances diffèrent des siennes.','bigotry|curiosity|kindness|generosity'),
M('Il refuse d’accepter les croyances différentes : son _____ blesse ceux qui ne pensent pas comme lui.','intolérance|ouverture|indulgence|amabilité'),
A('L’intolérance divise le village : certains habitants excluent leurs voisins à cause de leur religion.','Quel mot désigne le refus d’accepter des croyances différentes ?','intolérance|village|habitants|voisins'));
add(166,'masculine singular','Guard role made explicit; a director can also protect archives, so replace the vague old clue.',null,
M('Payé pour surveiller l’entrée et empêcher les intrusions, le _____ contrôle les autorisations.','garde|visiteur|artiste|touriste'),
A('Le garde arrête le visiteur à la porte du palais et vérifie son autorisation avant de le laisser entrer.','Quel mot désigne la personne chargée de protéger l’entrée ?','garde|visiteur|palais|autorisation'));
add(167,'feminine singular with elision','All alternatives begin with a vowel and fit l’; tracing letters specifies handwriting.',null,
M('Grâce à la forme particulière des lettres tracées au stylo, elle reconnaît l’_____ de son frère.','écriture|image|empreinte|illustration'),
A('L’écriture serrée de son frère est difficile à lire ; elle rapproche la lettre de la lampe pour déchiffrer les mots.','Quel mot désigne sa manière de tracer les caractères ?','écriture|frère|lettre|lampe'));
add(168,'masculine singular','Named military rank between commandant and colonel, as defined in the supplied vocabulary record.',
E('Promu lieutenant-colonel, il espère devenir colonel plus tard.','lieutenant colonel|captain|sergeant|corporal'),
M('Après le grade de commandant et avant celui de colonel, il devient _____.','lieutenant-colonel|capitaine|sergent|caporal'),
A('Le lieutenant-colonel salue le colonel, puis rejoint les officiers qui l’attendent près du véhicule.','Quel mot désigne le grade situé juste au-dessous de colonel ?','lieutenant-colonel|colonel|officiers|véhicule'));
hold(169,'Source sous le coup des articles de la loi denotes legal applicability, while current quizzes use emotional shock. Resolve these contextual meanings before approving one shared quiz set.');
hold(170,'The sense is defined solely by the historical Dreyfus document. New generic packing-list contexts would silently broaden it; resolve the reusable document sense versus historical note first.');
add(171,'feminine singular','News media, not a machine or crowd; feminine singular institutions in the gap.',
E('La presse publie plusieurs articles sur l’ouverture du musée.','press|police|army|school'),
M('Les journaux envoient leurs reporters sur place : la _____ prépare des articles sur l’événement.','presse|police|mairie|bibliothèque'),
A('La presse interroge les habitants et publie leurs réactions dans les journaux du lendemain.','Quel mot désigne l’ensemble des médias d’information ?','presse|habitants|réactions|lendemain'));
add(172,'masculine singular','Authority/capacity to decide, not inability; all gap choices singular masculine nouns.',
E('Le directeur a le pouvoir de signer les contrats au nom de l’entreprise.','authority|doubt|fear|wish'),
M('Le règlement lui donne le _____ de prendre seul cette décision et de la faire appliquer.','pouvoir|doute|souvenir|regret'),
A('Son pouvoir lui permet de nommer le directeur et de modifier les règles de l’organisation.','Quel mot désigne son autorité pour agir et décider ?','pouvoir|directeur|règles|organisation'));
add(173,'feminine singular','Preserve exact historical surface revision without accent; judicial re-examination in fictional examples.',
E('De nouveaux éléments conduisent à demander la revision du procès.','review|punishment|arrest|testimony'),
M('Pour faire examiner de nouveau une décision contestée à la lumière de preuves nouvelles, il demande sa _____.','revision|confirmation|publication|rédaction'),
A('La revision du jugement permet un nouvel examen des preuves ; la famille attend la décision qui en résultera.','Quel mot désigne le fait de réexaminer une décision ?','revision|jugement|famille|décision'));
add(174,'feminine singular','Calm despite disruption; alternatives match noun agreement.',
E('Elle répond avec sérénité, sans s’énerver malgré les critiques.','serenity|anxiety|anger|panic'),
M('Malgré le bruit et les retards, elle conserve sa _____ et reste parfaitement calme.','sérénité|angoisse|colère|panique'),
A('Sa sérénité rassure les voyageurs : elle sourit tranquillement et explique le nouvel horaire.','Quel mot désigne son calme paisible ?','sérénité|voyageurs|sourit|horaire'));
add(175,'masculine singular','Clear welcome/reception set; all three existing scenes are natural and distinct.',null,null,null);
add(176,'masculine singular','Government department, with singular masculine institution/place alternatives.',
E('Le ministère de l’Éducation prépare une nouvelle politique scolaire.','ministry|museum|market|theater'),
M('Le ministre dirige son _____ et donne des instructions aux services de cette administration.','ministère|musée|marché|théâtre'),
A('Le ministère publie une circulaire que les services administratifs transmettent aux écoles.','Quel mot désigne l’administration placée sous l’autorité d’un ministre ?','ministère|circulaire|services|écoles'));
add(177,'feminine singular','Narrative sense; all gap options feminine singular, with events that form a story.',null,
M('Elle raconte une _____ dont les personnages vivent de nombreuses aventures.','histoire|loi|preuve|règle'),
A('L’histoire raconte comment une enfant retrouve un chien perdu ; le récit se termine par leurs retrouvailles.','Quel mot désigne le récit des événements ?','histoire|enfant|chien|retrouvailles'));
add(178,'masculine singular','Betrayal of one’s own side, distinct from an openly opposed adversary.',
E('Le traître livre les secrets de son propre camp à l’ennemi.','traitor|opponent|prisoner|visitor'),
M('Membre de notre groupe, il transmet secrètement nos plans à l’ennemi : ce _____ nous a vendus.','traître|adversaire|prisonnier|visiteur'),
A('Le traître quitte le camp après avoir révélé les plans de ses compagnons à leurs ennemis.','Quel mot désigne celui qui a trahi la confiance de son groupe ?','traître|camp|plans|compagnons'));
add(179,'feminine singular','Opposition to authority, with matching feminine collective-event alternatives.',
E('La révolte éclate quand les habitants refusent d’obéir au gouverneur.','rebellion|celebration|election|ceremony'),
M('Les habitants se soulèvent contre le pouvoir : cette _____ vise à renverser le gouverneur.','révolte|célébration|réception|cérémonie'),
A('La révolte gagne plusieurs villes ; les habitants dressent des barricades et défient les soldats du gouverneur.','Quel mot désigne le soulèvement contre l’autorité ?','révolte|villes|barricades|soldats'));
add(180,'feminine singular','Official public statement; remove the unrelated chairs and calendar tail.',null,null,
A('La déclaration du directeur confirme que l’école restera ouverte ; les journalistes reprennent cette annonce dans leurs articles.','Quel mot désigne l’annonce officielle du directeur ?','déclaration|directeur|école|articles'));
add(181,'masculine plural','Courts as institutions; masculine plural administrative-body alternatives.',
E('Les tribunaux examinent les litiges que les citoyens leur soumettent.','courts|newspapers|ministries|museums'),
M('Les _____ rendent des jugements après avoir entendu les parties au procès.','tribunaux|ministères|journaux|musées'),
A('Les tribunaux de la région traitent de nombreuses affaires ; les juges y écoutent les avocats et les témoins.','Quel mot désigne les institutions chargées de juger ?','tribunaux|région|affaires|témoins'));
add(182,'feminine plural','Strong attachments to activities, with plural feminine alternatives.',
E('La musique et la peinture sont ses passions ; il leur consacre tout son temps libre.','passions|obligations|worries|habits'),
M('Elle aime intensément la danse et le chant : ces deux _____ occupent tous ses loisirs.','passions|obligations|inquiétudes|dettes'),
A('Ses passions l’amènent souvent au théâtre et au musée ; elle en parle avec enthousiasme à ses amis.','Quel mot désigne ses centres d’intérêt très intenses ?','passions|théâtre|musée|amis'));
add(183,'masculine singular','Suspicion of wrongdoing without proof; all gap alternatives singular masculine states.',
E('Un soupçon naît quand il découvre que la serrure a été forcée.','suspicion|certainty|forgiveness|relief'),
M('Sans preuve certaine, un _____ de vol lui vient en voyant le tiroir ouvert.','soupçon|pardon|soulagement|bonheur'),
A('Le soupçon pèse sur le voisin, mais aucune preuve ne permet encore de l’accuser du vol.','Quel mot désigne l’idée encore incertaine qu’une faute a été commise ?','soupçon|voisin|preuve|vol'));
add(184,'masculine singular','Shared outlook/group ethos, not mind or ghost senses as distractors.',
E('Un esprit de solidarité unit les membres de cette équipe.','ethos|building|schedule|uniform'),
M('Dans ce groupe, l’entraide guide toutes les décisions : un _____ de solidarité y règne.','esprit|bâtiment|uniforme|calendrier'),
A('L’esprit de coopération du groupe encourage chacun à aider ses collègues plutôt qu’à leur faire concurrence.','Quel mot désigne la manière de penser partagée par le groupe ?','esprit|coopération|groupe|collègues'));
add(185,'masculine singular','Head of a ministry; all alternatives singular masculine public roles.',
E('Le ministre présente au gouvernement les projets de son ministère.','minister|mayor|judge|ambassador'),
M('Membre du gouvernement chargé de diriger un ministère, le _____ annonce sa politique.','ministre|maire|juge|ambassadeur'),
A('Le ministre réunit les responsables de son administration pour préparer le budget qu’il présentera au gouvernement.','Quel mot désigne le membre du gouvernement à la tête d’un département public ?','ministre|responsables|administration|budget'));
add(186,'masculine plural','Plural suspicions, same uncertainty sense as singular but independently authored contexts.',
E('Ses réponses contradictoires éveillent les soupçons des enquêteurs.','suspicions|certainties|pardons|hopes'),
M('Ils le pensent peut-être coupable, mais leurs _____ ne sont pas encore des preuves.','soupçons|pardons|souhaits|soulagements'),
A('Les soupçons disparaissent quand la vidéo montre que le gardien était absent au moment du vol.','Quel mot désigne les doutes sur une possible faute ?','soupçons|vidéo|gardien|vol'));
add(187,'masculine singular','Commanding officer rather than rank-specific extension; compatible masculine roles.',null,
M('À la tête du bataillon, le _____ donne l’ordre à ses soldats de se rassembler.','commandant|témoin|médecin|cuisinier'),null);
add(188,'feminine singular','All gap body parts feminine singular; swallowing locates the throat without clinical advice.',null,
M('Quand elle avale, sa _____ irritée lui fait mal à l’intérieur du cou.','gorge|épaule|cheville|hanche'),
A('Sa gorge lui fait mal quand elle avale ; elle pose son verre et parle doucement à son amie.','Quel mot désigne la partie intérieure du cou concernée ?','gorge|verre|doucement|amie'));
add(189,'masculine singular','Remove certificate/contract as incorrect English meanings of acte; coherent action scene.',
E('Aider cette inconnue était un acte généreux.','deed|thought|wish|feeling'),
M('Il ne s’est pas contenté de paroles : en sauvant l’enfant, il a accompli un _____ courageux.','acte|souhait|rêve|sentiment'),
A('Son acte courageux sauve l’enfant tombé dans l’eau ; les témoins le félicitent sur la rive.','Quel mot désigne l’action accomplie ?','acte|enfant|témoins|rive'));
hold(190,'The target is the bound component lèse-humanité in crime de lèse-humanité, while its gloss translates the whole crime. Resolve expression/component identity before standalone noun questions.');
add(191,'masculine plural','Hidden information, with all alternatives plural masculine nouns.',
E('Il confie ses secrets à une amie qui promet de ne les révéler à personne.','secrets|announcements|orders|greetings'),
M('Ces informations doivent rester cachées : ne révèle pas nos _____ à qui que ce soit.','secrets|outils|bijoux|bagages'),
A('Les secrets du laboratoire sont enfermés dans un coffre auquel seules deux personnes ont accès.','Quel mot désigne les informations gardées cachées ?','secrets|laboratoire|coffre|personnes'));
add(192,'masculine singular','Natural solid stone mass, with singular masculine landscape/object alternatives.',
E('Un énorme rocher bloque le sentier après s’être détaché de la falaise.','rock|tree|truck|cloud'),
M('Un énorme _____ de granit s’est détaché de la falaise et barre le chemin.','rocher|tronc|camion|buisson'),
A('Les vagues frappent le rocher au pied de la falaise ; un oiseau se pose sur cette masse de pierre.','Quel mot désigne la masse naturelle de pierre ?','rocher|vagues|falaise|oiseau'));
add(193,'feminine singular','Methodical search for facts; an audience can also hear testimony, so replace the ambiguous old alternative.',null,
M('Pour rechercher méthodiquement l’origine de l’incendie, la police ouvre une _____.','enquête|fête|excursion|cérémonie'),
A('L’enquête progresse grâce aux indices : un policier photographie la fenêtre et interroge le voisin.','Quel mot désigne la recherche organisée des faits ?','enquête|indices|fenêtre|voisin'));
add(194,'feminine plural','All alternatives now plural feminine footwear; high waterproof boots identified by covering legs.',null,
M('Pour traverser la boue sans mouiller leurs pieds ni le bas de leurs jambes, ils mettent de hautes _____ imperméables.','bottes|sandales|pantoufles|baskets'),null);
add(195,'feminine singular','Pejorative dishonest-person sense; agreement no longer mixes gendered roles.',null,
M('Cette _____ trompe les clients et leur vole leur argent sans le moindre scrupule.','fripouille|bienfaitrice|protectrice|donatrice'),
A('La fripouille vend de faux billets aux voyageurs, puis disparaît avec leur argent avant l’arrivée de la police.','Quel mot péjoratif désigne la personne malhonnête ?','fripouille|billets|voyageurs|police'));
add(196,'feminine plural','Burning flames, with all feminine plural alternatives; cohesive fire scene.',null,
M('Les _____ du brasier montent et brûlent les poutres du toit.','flammes|ombres|branches|vagues'),
A('Les flammes gagnent le toit ; les pompiers arrosent la maison pendant que les habitants s’éloignent.','Quel mot désigne les parties lumineuses du feu ?','flammes|toit|pompiers|habitants'));
add(197,'feminine plural','Official responsibilities, all plural feminine alternatives; coherent advanced duties.',null,null,
A('Ses fonctions comprennent la direction de l’équipe et la signature des contrats ; il prend ces responsabilités très au sérieux.','Quel mot désigne ses responsabilités officielles ?','fonctions|direction|équipe|contrats'));
add(198,'feminine singular','Pejorative crowd sense, not peat as an incorrect alternate meaning.',
E('Une tourbe hostile entoure le voyageur et lui lance des insultes.','rabble|family|committee|jury'),
M('Cette _____ malfaisante hurle des insultes et se presse pour piller les boutiques.','tourbe|famille|équipe|classe'),
A('Le récit décrit une tourbe cruelle qui poursuit l’étranger ; la foule bloque la rue et refuse de le laisser passer.','Quel mot désigne péjorativement cette foule malfaisante ?','tourbe|récit|étranger|rue'));
add(199,'feminine singular','Human dignity, not an honorific rank; replace the irrelevant appended actions.',
E('Même humiliée publiquement, elle conserve sa dignité et exige le respect.','dignity|wealth|strength|comfort'),null,
A('Dans le bureau, elle défend sa dignité en refusant les insultes et en demandant à être traitée avec respect devant ses collègues.','Quel mot désigne le respect dû à sa personne ?','dignité|insultes|bureau|collègues'));
add(200,'masculine singular with cet','All alternatives fit cet, including vowel/mute-h masculine nouns; adult male sense is explicit.',null,
M('Cet _____ est le père adulte de deux enfants ; il témoigne au tribunal.','homme|enfant|adolescent|écolier'),
A('L’homme attend avec sa femme et leurs enfants devant la porte de la maison.','Quel mot désigne ici la personne adulte de sexe masculin ?','homme|femme|enfants|porte'));
export default {version:1,id:'fr-2026-09-19-02',language:'fr',snapshot:'fr-0101-0200-input.json',entries:rows};
