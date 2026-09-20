const E=(context,choices)=>({context,choices:choices.split('|')});const M=E;const A=(context,prompt,choices)=>({context,prompt,choices:choices.split('|')});const rows=[];
const add=(index,agreement,reason,early,middle,advanced)=>rows.push({index,agreement,reason,questions:[early,middle,advanced]});const hold=(index,reason)=>rows.push({index,status:'blocked_lexical_review',reason});
add(201,'masculine singular','Natural task/labour contexts; all gap choices singular masculine abstract nouns.',
E('Ce travail de réparation lui prend toute la matinée.','work|rest|game|journey'),
M('Pour terminer la réparation, il reste encore deux heures de _____ à faire.','travail|repos|sommeil|loisir'),
A('Le travail avance : elle ponce le bois, assemble les planches et vérifie chaque joint.','Quel mot désigne l’activité consacrée à la tâche ?','travail|bois|planches|joint'));
hold(202,'The historical lettre-télégramme needs its communication format and contextual sense verified before writing three precise contexts. Its generic near-telegram definition is insufficient to distinguish it reliably from other urgent letters.');
add(203,'masculine singular','Daylight/illumination sense, distinct from the 24-hour day; no legitimate day sense is a wrong English choice.',
E('Le jour entre par les rideaux et éclaire toute la chambre.','daylight|rain|wind|dust'),
M('Les rideaux fermés empêchent le _____ d’éclairer la pièce, même à midi.','jour|vent|froid|bruit'),
A('Au grand jour, les couleurs du tissu sont plus faciles à distinguer que sous la petite lampe de l’atelier.','Quel mot renvoie à la lumière naturelle ?','jour|couleurs|tissu|atelier'));
add(204,'feminine singular','The existing three judicial-decision questions are distinct and their intermediate nouns all agree.',null,null,null);
add(205,'masculine plural','Plural documents rather than unrelated singular items in a glossary frame.',
E('Il range les papiers du dossier dans une chemise.','documents|keys|tools|clothes'),
M('La secrétaire classe les _____ écrits qui composent le dossier.','papiers|outils|couteaux|vêtements'),
A('Les papiers signés par le directeur sont prêts ; son assistante les glisse dans une enveloppe et les envoie au client.','Quel mot désigne les documents écrits ?','papiers|directeur|enveloppe|client'));
add(206,'feminine singular with son before a vowel','All alternatives fit son; invention distinguished from memory.',null,
M('Pour inventer un monde qui n’a jamais existé, elle fait appel à son _____.','imagination|impatience|indifférence|inquiétude'),
A('Son imagination fait naître des créatures inconnues ; elle les dessine dans un carnet et leur invente une histoire.','Quel mot désigne sa faculté d’inventer ?','imagination|créatures|carnet|histoire'));
add(207,'feminine singular','Accountability for a task, with matched feminine singular alternatives.',
E('Il assume la responsabilité de son erreur et promet de la réparer.','responsibility|innocence|wealth|freedom'),
M('Elle devra répondre du résultat : cette mission est placée sous sa _____.','responsabilité|curiosité|fortune|fatigue'),
A('La responsabilité de la sécurité lui revient ; il vérifie donc les portes avant d’accueillir le public.','Quel mot désigne l’obligation de répondre de cette mission ?','responsabilité|portes|public|sécurité'));
add(208,'feminine singular','Stain, without confusing unaccented tache with tâche.',
E('Une tache de café salit sa chemise blanche.','stain|seam|button|fold'),
M('Le jus renversé a laissé une _____ rouge sur la nappe.','tache|couture|poche|broderie'),
A('Elle frotte la tache avec un chiffon humide, puis rince la nappe pour faire disparaître la marque.','Quel mot désigne la marque qui salit le tissu ?','tache|chiffon|nappe|frotte'));
add(209,'feminine singular with elision','The old early and advanced sentences repeated the same scene. Make three distinct inner-life contexts; all gap nouns fit l’.',null,
M('Ses mots de réconfort apaisent la peine qu’il ressent au fond de l’_____.','âme|oreille|épaule|image'),
A('Son âme généreuse le pousse à secourir l’inconnu ; il lui offre un repas et un endroit où dormir.','Quel mot désigne ici sa vie intérieure et morale ?','âme|inconnu|repas|endroit'));
add(210,'masculine singular','Existing leader questions are coherent and all intermediate people nouns masculine singular.',null,null,null);
add(211,'feminine singular with elision','All alternatives fit l’; recognized decision power specifies authority.',null,
M('Elle a le droit de donner cet ordre : le règlement lui accorde l’_____ nécessaire.','autorité|habitude|imagination|hésitation'),
A('Son autorité lui permet de fermer la salle ; elle prévient les usagers, puis donne ses instructions au gardien.','Quel mot désigne le pouvoir reconnu de décider ?','autorité|salle|usagers|gardien'));
add(212,'feminine singular','Existing atrocity set has distinct contexts, one answer, and matching noun agreement.',null,null,null);
add(213,'feminine singular','Retain the clear emotion early/middle questions; remove the disconnected advanced tail.',null,null,
A('L’émotion lui serre la gorge quand elle retrouve son frère ; elle le prend dans ses bras sans parvenir à parler.','Quel mot désigne sa réaction affective vive ?','émotion|gorge|frère|bras'));
add(214,'masculine singular','Literal violent weather sense within supplied definition; avoid crisis, another legitimate target meaning, as a wrong choice.',
E('Un orage éclate : les éclairs illuminent le ciel et le tonnerre gronde.','thunderstorm|breeze|fog|rainbow'),
M('Les éclairs se succèdent et le tonnerre gronde : un _____ approche.','orage|brouillard|arc-en-ciel|gel'),
A('L’orage surprend les promeneurs ; ils cherchent un abri quand le tonnerre retentit et que la pluie commence.','Quel mot désigne la perturbation accompagnée d’éclairs et de tonnerre ?','orage|promeneurs|abri|pluie'));
add(215,'masculine singular','Existing colonel set consistently tests the senior officer with compatible masculine noun distractors.',null,null,null);
add(216,'feminine plural','Responsibilities plural, with all intermediate alternatives feminine plural.',
E('Ses responsabilités comprennent la sécurité du bâtiment et la formation des employés.','responsibilities|opinions|possessions|journeys'),
M('Diriger l’équipe et contrôler le budget font partie de ses nouvelles _____.','responsabilités|vacances|possessions|inquiétudes'),
A('Elle prend ses responsabilités au sérieux : elle vérifie les comptes et répond des résultats devant son directeur.','Quel mot désigne les obligations dont elle doit répondre ?','responsabilités|comptes|résultats|directeur'));
add(217,'feminine singular','Remove masculine salary and the plausible reputation answer; wealth is specified by assets.',null,
M('Ses immeubles, ses économies et ses terres constituent une immense _____.','fortune|dette|réputation|inquiétude'),
A('Elle consacre une partie de sa fortune à l’hôpital, en vendant un immeuble et en donnant ses économies.','Quel mot désigne l’ensemble de ses biens ?','fortune|hôpital|immeuble|donnant'));
add(218,'feminine plural','Existing plural accusation set identifies charges, with compatible feminine plural alternatives.',null,null,null);
add(219,'feminine singular','Source maison denotes an institution, not a dwelling. New publishing/fashion firm contexts isolate the establishment use.',
E('Cette maison d’édition publie des romans depuis cinquante ans.','firm|school|club|committee'),
M('Cette _____ d’édition signe un contrat avec l’écrivain pour publier son roman.','maison|école|classe|église'),
A('La maison de couture présente sa collection ; ses employés accueillent les clients dans le salon.','Quel mot désigne ici l’entreprise ?','maison|collection|employés|salon'));
add(220,'feminine singular','Remove the masculine retard distractor; bad arithmetic identifies an error.',null,
M('Le total est faux : elle corrige une _____ de calcul dans le rapport.','erreur|signature|alerte|date'),
A('L’erreur vient d’une dépense comptée deux fois ; elle refait le total en vérifiant chaque reçu.','Quel mot désigne la faute de calcul ?','erreur|dépense|total|reçu'));
add(221,'feminine singular title','Lowercase title in direct address; alternatives feminine singular titles and a context specifying ordinary civil address.',
E('« Bonjour, madame, puis-je vous aider ? » demande le vendeur à la cliente.','Madam|Princess|Sister|Your Majesty'),
M('Pour saluer poliment une cliente dont il ignore le nom et le métier, il dit simplement : « Bonjour, _____ ».','madame|princesse|reine|abbesse'),
A('« Merci, madame », dit l’enfant à la passante qui lui a indiqué le chemin de l’école.','Quel titre de politesse s’adresse ici à une femme ?','madame|enfant|passante|chemin'));
add(222,'masculine singular','Scorn, with masculine singular attitudes rather than mixed-gender objects.',
E('Son mépris se voit quand il traite les autres comme des gens sans valeur.','contempt|admiration|respect|affection'),
M('Il juge les autres indignes d’estime et leur parle avec _____.','mépris|respect|enthousiasme|intérêt'),
A('Elle ressent son mépris lorsqu’il refuse même de lui parler et se moque de son travail devant les collègues.','Quel mot désigne le sentiment qui rabaisse autrui ?','mépris|travail|collègues|parler'));
add(223,'masculine plural','All alternatives are plural masculine; explicit allotted time specifies deadlines.',null,
M('Les _____ accordés pour répondre sont de dix jours pour chaque dossier.','délais|tarifs|titres|motifs'),
A('Les délais expirent vendredi ; elle termine donc les dossiers et les dépose avant la fermeture du bureau.','Quel mot désigne les périodes de temps accordées ?','délais|dossiers|fermeture|bureau'));
add(224,'feminine plural','Keep the sound investigation questions; advanced investigators work on the same two cases.',null,null,
A('Les enquêtes portent sur deux fraudes ; une équipe examine les comptes, tandis qu’une autre interroge les témoins.','Quel mot désigne les recherches organisées pour établir les faits ?','enquêtes|fraudes|comptes|témoins'));
add(225,'masculine singular','Thinking faculty, without offering ghost/spirit as a wrong English sense.',
E('Son esprit reste occupé par ce problème, même pendant le repas.','mind|hand|voice|stomach'),
M('Il réfléchit sans cesse à cette énigme ; son _____ cherche une solution.','esprit|bras|pied|regard'),
A('Son esprit travaille encore sur le problème ; il imagine plusieurs solutions avant de choisir la plus simple.','Quel mot désigne sa faculté de penser ?','esprit|problème|solutions|simple'));
add(226,'feminine singular','Forward movement/progress, not a stair step as a wrong meaning.',
E('La marche du cortège est ralentie par la foule qui bloque la rue.','progress|rest|noise|size'),
M('Le groupe avance lentement ; sa _____ est freinée par les obstacles sur le chemin.','marche|halte|pause|taille'),
A('La marche des travaux reprend après la livraison du matériel ; le chantier avance de nouveau.','Quel mot désigne la progression vers le résultat ?','marche|livraison|matériel|chantier'));
add(227,'feminine singular','Grave injustice, with matched feminine singular abstract nouns.',
E('Punir un innocent pour protéger le vrai coupable est une iniquité.','injustice|kindness|prudence|reward'),
M('Ce traitement profondément injuste révolte tous les témoins : quelle _____ !','iniquité|bonté|prudence|générosité'),
A('Elle dénonce l’iniquité du jugement qui frappe l’innocent et laisse le responsable en liberté.','Quel mot désigne la profonde injustice ?','iniquité|jugement|innocent|liberté'));
add(228,'feminine plural','Practical steps to achieve a goal; do not use physical measurements as a wrong English meaning.',
E('La mairie prend des mesures pour réduire la vitesse près de l’école.','measures|rumors|questions|complaints'),
M('Pour prévenir les accidents, ces _____ imposent un ralentissement et une meilleure signalisation.','mesures|rumeurs|questions|plaintes'),
A('Les mesures de sécurité comprennent la fermeture de la rue et la pose de barrières devant le chantier.','Quel mot désigne les dispositions prises pour protéger le public ?','mesures|rue|barrières|chantier'));
add(229,'feminine singular','Threat of harm with singular feminine speech-act alternatives.',
E('Il prend la menace au sérieux quand son voisin annonce qu’il va casser sa fenêtre.','threat|apology|request|compliment'),
M('« Si tu parles, je détruirai tes affaires » : cette _____ lui fait peur.','menace|excuse|invitation|félicitation'),
A('La menace contenue dans la lettre l’inquiète ; il la montre à la police pour protéger sa famille.','Quel mot désigne l’annonce d’un danger possible ?','menace|lettre|police|famille'));
add(230,'masculine singular','Fate/future, without a magic-spell distractor.',
E('Après le naufrage, le sort des passagers reste inconnu.','fate|past|method|opinion'),
M('Personne ne sait ce qu’il adviendra des disparus : leur _____ demeure incertain.','sort|passé|nom|âge'),
A('Le sort du village dépend de la rivière : si elle déborde encore, les habitants devront partir.','Quel mot désigne l’avenir qui attend le village ?','sort|rivière|habitants|partir'));
add(231,'feminine singular','Retain clear discipline early/middle; cohesive military routine at advanced.',null,null,
A('La discipline impose aux soldats de respecter les horaires ; leur commandant contrôle donc les présences au rassemblement.','Quel mot désigne la règle d’obéissance imposée au groupe ?','discipline|soldats|horaires|présences'));
add(232,'masculine singular','Outstanding success rather than defeat or setback.',
E('La pièce remporte un triomphe : le public applaudit debout pendant de longues minutes.','triumph|failure|delay|argument'),
M('Après une victoire éclatante, l’équipe célèbre son _____ devant la foule enthousiaste.','triomphe|échec|recul|retard'),
A('Son triomphe au concours lui vaut une médaille ; les autres participants le félicitent pour sa brillante réussite.','Quel mot désigne le succès éclatant ?','triomphe|concours|médaille|participants'));
add(233,'masculine plural','Dishonest-person sense; all gap alternatives plural masculine people nouns.',null,
M('Ces _____ trompent volontairement leurs voisins et leur volent leurs économies.','coquins|bienfaiteurs|sauveurs|protecteurs'),null);
add(234,'masculine singular','Court as an institution; matching masculine singular buildings/institutions.',
E('Le tribunal examine l’affaire et entend les témoins.','court|ministry|museum|hospital'),
M('Le _____ rend son jugement après avoir entendu les arguments des avocats.','tribunal|ministère|musée|hôpital'),
A('Le tribunal convoque les parties ; le juge leur demande de présenter les pièces du dossier.','Quel mot désigne l’institution chargée de juger ?','tribunal|parties|juge|pièces'));
add(235,'feminine singular','Speechless surprise distinct from ordinary joy or calm.',
E('La nouvelle le plonge dans la stupeur ; il reste immobile, incapable de répondre.','astonishment|patience|confidence|boredom'),
M('Saisie de _____ devant cette révélation inattendue, elle reste bouche bée, sans réaction.','stupeur|sérénité|patience|certitude'),
A('Sa stupeur dure quelques instants ; puis il retrouve la parole et demande comment un tel événement a pu se produire.','Quel mot désigne le saisissement qui l’a laissé sans réaction ?','stupeur|instants|parole|événement'));
add(236,'feminine singular with elision','All gap alternatives fit l’; soldiers distinguish the military institution.',null,
M('Les soldats de l’_____ avancent sous les ordres du général.','armée|école|entreprise|association'),
A('L’armée déploie ses soldats pour aider les habitants ; le général organise le transport des vivres jusqu’au village.','Quel mot désigne l’ensemble organisé des forces militaires ?','armée|habitants|général|vivres'));
add(237,'feminine singular','An assigned objective, with singular feminine alternatives.',
E('Sa mission consiste à apporter les documents avant midi.','assignment|holiday|accident|illness'),
M('Son chef lui confie une _____ précise : inspecter le pont et rédiger un rapport.','mission|permission|invitation|récompense'),
A('Elle accomplit sa mission en remettant le message au destinataire, puis retourne faire son rapport.','Quel mot désigne la tâche qui lui avait été confiée ?','mission|message|destinataire|rapport'));
add(238,'feminine singular','Existing accusation set has clear charges and compatible singular feminine nouns.',null,null,null);
add(239,'masculine singular','Existing author questions consistently identify the writer; all middle roles masculine singular.',null,null,null);
add(240,'masculine singular','Fictional study/application contexts avoid presenting a universal legal claim as quiz background.',
E('Elle étudie le droit pour comprendre les règles juridiques de son pays.','law|history|medicine|economics'),null,
A('Le droit occupe ses journées : elle lit des lois, compare des décisions et prépare son examen.','Quel mot désigne l’ensemble des règles juridiques qu’elle étudie ?','droit|journées|décisions|examen'));
add(241,'feminine singular','Minute as a short unit of time; singular feminine time-unit alternatives.',
E('Attends une minute ; je termine cette phrase et je viens.','minute|hour|week|year'),
M('Il observe l’horloge pendant soixante secondes : une _____ vient de s’écouler.','minute|heure|semaine|année'),
A('Une minute suffit pour mettre le pain dans le sac ; elle rejoint ensuite son ami devant la porte.','Quel mot désigne une courte durée de soixante secondes ?','minute|pain|sac|porte'));
add(242,'feminine singular','Opinion as a judgment; singular feminine mental-attitude nouns.',
E('À mon avis, le projet est utile ; mon voisin ne partage pas cette opinion.','opinion|memory|fear|habit'),
M('« Je trouve ce film réussi » : elle exprime son _____ après la séance.','opinion|impatience|inquiétude|habitude'),
A('Son opinion change après la lecture du rapport : il juge désormais le projet trop coûteux.','Quel mot désigne son jugement sur le projet ?','opinion|lecture|rapport|projet'));
add(243,'feminine plural','Existing mouths/speakers set is coherent, with four feminine plural body-part nouns.',null,null,null);
add(244,'feminine plural','Hands and possession metaphor; do not use possession as a wrong English sense.',
E('Elle prend la tasse entre ses deux mains pour la réchauffer.','hands|feet|knees|ears'),
M('Elle enfile ses gants pour protéger ses _____ du froid.','mains|oreilles|jambes|joues'),
A('Ses mains tremblent lorsqu’elle tient la lettre ; elle la pose sur la table avant de la lire.','Quel mot désigne les organes avec lesquels elle tient la lettre ?','mains|lettre|table|lire'));
add(245,'feminine singular','Action attributed to someone in de sa part, matching source de leur part; all gap nouns feminine singular.',
E('Ce geste de sa part nous montre qu’elle veut nous aider.','side; behalf|fear|fault|voice'),
M('C’est très aimable de sa _____ de nous avoir apporté ce repas.','part|peur|voix|faute'),
A('Nous recevons un mot de sa part ; il nous remercie de l’avoir accueilli chez nous.','Quel mot, dans de sa…, attribue le message à son auteur ?','part|mot|remercie|accueilli'));
add(246,'masculine plural','Retain clear years questions; use a coherent return-from-travel advanced passage.',null,null,
A('Après trois ans de voyage, elle revient au village et retrouve ses parents devant leur maison.','Quel mot désigne des périodes de douze mois ?','ans|voyage|village|parents'));
add(247,'masculine singular','Professional/moral obligation, with all intermediate alternatives masculine singular.',null,null,
A('Son devoir de sauveteur est de secourir les nageurs ; il surveille donc la plage et garde son matériel prêt.','Quel mot désigne son obligation professionnelle ?','devoir|nageurs|plage|matériel'));
add(248,'feminine singular','Report the polemical label as an author’s judgment; do not endorse an attack on a religious group.',
E('Dans son pamphlet, l’auteur appelle cette école une jésuitière et critique l’influence des jésuites qui la dirigent.','Jesuit stronghold|royal residence|military camp|workers’ union'),
M('Dans ce texte polémique, le collège dirigé par les jésuites est désigné avec hostilité comme une _____.','jésuitière|caserne|usine|mairie'),
A('Le pamphlétaire traite le collège de jésuitière ; il accuse ses dirigeants religieux d’y exercer une influence excessive.','Quel mot polémique désigne le milieu qu’il juge dominé par les jésuites ?','jésuitière|collège|dirigeants|influence'));
hold(249,'Like lèse-humanité, lèse-justice appears as a bound compound in crime de lèse-justice. Verify the component-versus-whole-expression meaning and grammatical classification before standalone noun quiz approval.');
add(250,'masculine singular','Remove voluntary deed as an incorrect English meaning of acte; the document sense remains separate.',
E('L’acte de naissance porte le nom de l’enfant et sa date de naissance.','official record|oral promise|private opinion|personal memory'),null,
A('L’acte signé devant le notaire est conservé dans les archives ; une copie est remise aux deux parties.','Quel mot désigne le document officiel ?','acte|notaire|archives|parties'));
add(251,'masculine plural','The existing figurative hearts questions are coherent; all gap choices masculine plural nouns.',null,null,null);
add(252,'feminine plural','Naive remarks/assumptions rather than lack of intelligence in general.',
E('Croire que tous les inconnus disent toujours la vérité fait partie de ses naïvetés.','naive assumptions|clever tricks|careful checks|firm refusals'),
M('Elle croit tout sans vérifier et promet des choses impossibles ; ses _____ inquiètent ses proches.','naïvetés|ruses|précautions|méfiances'),
A('Ses naïvetés amusent son frère, mais il lui explique pourquoi ces idées trop simples ne tiennent pas compte de la réalité.','Quel mot désigne ses manifestations de crédulité ou de simplicité excessive ?','naïvetés|frère|idées|réalité'));
add(253,'masculine singular','A deity in an explicitly fictional/mythological scene; no claims about real beliefs.',
E('Dans ce mythe, le dieu de la mer commande aux vagues.','god|king|sailor|priest'),
M('Dans cette légende, les habitants prient un _____ immortel qui gouverne le soleil.','dieu|roi|marin|prêtre'),
A('Le dieu du récit apparaît dans un nuage et promet aux humains de protéger leur cité.','Quel mot désigne l’être divin ?','dieu|récit|nuage|cité'));
add(254,'feminine singular','Betrayal, with feminine singular alternatives and explicit breach of trust.',
E('Livrer les secrets de ses amis à leurs ennemis est une trahison.','betrayal|alliance|celebration|reconciliation'),
M('Il avait juré de nous protéger, mais il a livré nos plans à l’ennemi : quelle _____ !','trahison|alliance|réconciliation|célébration'),
A('La trahison détruit leur confiance ; après la révélation de leurs secrets, ils refusent de lui parler.','Quel mot désigne la rupture de la fidélité promise ?','trahison|confiance|secrets|parler'));
add(255,'masculine plural','Plural makeshifts; remove feminine alternatives and the definition-like advanced opening.',null,
M('Faute de solution durable, ils utilisent ces _____ provisoires pour gagner du temps.','expédients|principes|objectifs|résultats'),
A('Les expédients ne suffisent plus : le ruban posé sur la fuite se décolle et il faut enfin appeler un plombier.','Quel mot désigne les moyens temporaires employés faute de mieux ?','expédients|ruban|fuite|plombier'));
add(256,'feminine plural','All alternatives feminine plural; obligation to repay specifies debts.',null,
M('Elle doit rembourser plusieurs sommes à ses créanciers : ses _____ sont lourdes.','dettes|économies|récompenses|recettes'),
A('Ses dettes comprennent un prêt et trois factures impayées ; elle prépare un budget pour les rembourser.','Quel mot désigne les sommes qu’elle doit payer ?','dettes|prêt|factures|budget'));
add(257,'masculine singular','Seat occupied by a judge, with compatible masculine furniture alternatives.',
E('Le juge reprend son siège après la suspension de l’audience.','seat|desk|door|shelf'),
M('Le juge s’assied dans son _____ rembourré et s’appuie contre le dossier.','siège|bureau|pupitre|portemanteau'),
A('Le magistrat quitte son siège et sort de la salle ; le greffier rassemble les dossiers restés sur la table.','Quel mot désigne la place où le magistrat était assis ?','siège|salle|greffier|table'));
add(258,'feminine singular','Evidence item, without using room or coin as wrong English meanings.',
E('L’avocate verse une pièce nouvelle au dossier : une lettre qui confirme la date.','evidence item|witness|verdict|penalty'),
M('Cette lettre constitue une _____ du dossier que les avocats peuvent examiner.','pièce|audience|peine|plaidoirie'),
A('La pièce produite par le témoin est une photographie ; le juge l’examine avant de poursuivre l’audience.','Quel mot désigne l’élément présenté comme preuve ?','pièce|témoin|juge|audience'));
add(259,'feminine singular with elision','Keep sound illegality questions; make advanced evidence gathering coherent.',null,null,
A('L’illégalité de l’opération est confirmée par le tribunal ; les documents montrent qu’elle viole la loi.','Quel mot désigne le caractère contraire à la loi ?','illégalité|opération|tribunal|documents'));
add(260,'feminine singular','Integrity shown by rejecting dishonest gain; matching feminine singular abstractions.',
E('Sa probité lui interdit d’accepter de l’argent pour mentir.','integrity|greed|anger|fear'),
M('Elle refuse tout pot-de-vin et reste scrupuleusement honnête : sa _____ est reconnue.','probité|cupidité|ruse|malhonnêteté'),
A('La probité du trésorier inspire confiance ; il refuse de détourner un seul euro et rend compte de chaque dépense.','Quel mot désigne son honnêteté scrupuleuse ?','probité|trésorier|euro|dépense'));
add(261,'feminine plural','Secret calculated maneuvers; all gap nouns feminine plural.',
E('Leurs menées secrètes visent à écarter un concurrent sans qu’il s’en aperçoive.','schemes|celebrations|apologies|gifts'),
M('Ils agissent en secret pour nuire à leur rival ; leurs _____ sont découvertes dans une lettre compromettante.','menées|réconciliations|célébrations|donations'),
A('Elle surveille les menées de ses adversaires et découvre leur plan pour la faire renvoyer.','Quel mot désigne les actions secrètes et calculées ?','menées|adversaires|plan|renvoyer'));
add(262,'plural; no gender agreement required by les','Existing people questions have four plural nouns and a unique human-group meaning.',null,null,
A('Les gens devant la gare demandent des nouvelles du train ; un agent vient leur expliquer le retard.','Quel mot désigne les personnes rassemblées ?','gens|gare|train|retard'));
add(263,'masculine plural','Remove documents as a legitimate alternate meaning of actes; all gap nouns masculine plural.',
E('Ses actes montrent sa générosité envers les autres.','deeds|promises|thoughts|wishes'),
M('Il ne suffit pas de promettre : ses _____, ce qu’il fait réellement, montreront sa bonne volonté.','actes|souhaits|rêves|discours'),
A('Ses actes prouvent son courage : il secourt les voisins et protège les enfants malgré le danger.','Quel mot désigne ses actions effectivement accomplies ?','actes|courage|voisins|danger'));
add(264,'masculine singular','Paper/document sense; singular masculine materials and a written sheet context.',
E('Elle plie le papier sur lequel elle a écrit son adresse.','paper|cloth|wood|glass'),
M('Il prend une feuille de _____ pour y écrire une lettre.','papier|métal|verre|béton'),
A('Le papier signé est posé sur le bureau ; elle le relit, puis le glisse dans une enveloppe.','Quel mot désigne le document écrit ?','papier|bureau|relit|enveloppe'));
add(265,'masculine singular','Existing struggle questions use distinct contexts and grammatical masculine singular nouns.',null,null,null);
add(266,'masculine plural','Formal questioning sessions rather than individual questions; plural masculine event alternatives.',
E('Les interrogatoires des témoins durent plusieurs heures au commissariat.','questioning sessions|court verdicts|public speeches|concert rehearsals'),
M('Pendant ces _____, les policiers posent aux suspects une série de questions sur les faits.','interrogatoires|verdicts|discours|concerts'),
A('Les interrogatoires permettent de comparer les réponses des suspects ; les enquêteurs notent chaque contradiction.','Quel mot désigne les séances de questions officielles ?','interrogatoires|réponses|suspects|contradiction'));
add(267,'feminine plural','Windows also show reflections, so replace that ambiguous distractor.',null,
M('Dans la boutique, elle se regarde de la tête aux pieds dans les grandes _____ fixées au mur.','glaces|peintures|affiches|étagères'),
A('Les glaces renvoient son image ; elle ajuste son manteau en se regardant, puis sort du magasin.','Quel mot désigne les miroirs ?','glaces|image|manteau|magasin'));
add(268,'feminine singular','Intense interest in an activity, with singular feminine alternatives.',
E('Sa passion pour la musique lui fait passer des heures au piano chaque soir.','passion|fear|boredom|dislike'),
M('Elle aime la peinture avec une intensité extraordinaire : cette _____ remplit ses loisirs de bonheur.','passion|crainte|aversion|lassitude'),
A('Sa passion pour les étoiles la pousse à observer le ciel chaque nuit et à lire de nombreux livres d’astronomie.','Quel mot désigne son intérêt très intense ?','passion|étoiles|ciel|livres'));
add(269,'feminine singular','Existing boldness set distinguishes courage/risk and has compatible feminine nouns.',null,null,null);
add(270,'feminine singular','Handle/hilt; remove masculine fourreau and the alternative blade that might be grasped in a vague sentence.',
E('Elle saisit la poignée de la porte et la tourne pour entrer.','handle|blade|hinge|lock'),
M('Elle abaisse la _____ de la porte pour actionner le loquet et entrer.','poignée|lame|serrure|charnière'),
A('Il tient le sabre par la poignée, en gardant les doigts loin de la lame tranchante.','Quel mot désigne la partie prévue pour saisir l’arme ?','poignée|sabre|doigts|lame'));
add(271,'masculine singular','Existing figurative heart set remains coherent and has matching masculine singular noun alternatives.',null,null,null);
add(272,'feminine singular with elision','Literary lack-of-understanding sense, with compatible vowel-initial feminine alternatives.',
E('Son inintelligence de la situation lui fait prendre une décision absurde.','lack of understanding|kindness|patience|caution'),
M('Il ne comprend rien aux explications les plus simples ; son _____ du problème frappe ses collègues.','inintelligence|ingéniosité|habileté|intelligence'),
A('L’inintelligence du personnage apparaît dans ses réponses absurdes ; il ne saisit pas le problème que les autres ont compris.','Quel mot désigne son incapacité à comprendre correctement ?','inintelligence|personnage|réponses|problème'));
add(273,'feminine plural','Old professional-report gap also allowed successes; explicit violations identify faults.',null,
M('Le rapport dénonce les _____ du directeur : il a menti et falsifié les comptes.','fautes|réussites|promesses|découvertes'),null);
add(274,'masculine singular','Existing offender set clearly identifies the person who committed the act; all gap roles agree.',null,null,null);
add(275,'masculine singular','Existing resolution/ending set is natural, distinct and unambiguous.',null,null,null);
add(276,'feminine plural','Remove masculine souvenirs and distinguish moral judgment from habit or appetite.',null,
M('Leur sens moral leur interdit de cacher cette injustice : ils écoutent leurs _____.','consciences|habitudes|envies|craintes'),null);
add(277,'feminine singular','Foolish act rather than wisdom; same feminine singular agreement.',
E('Sortir sans manteau dans ce froid était une sottise qu’il regrette aussitôt.','foolish act|wise decision|kind gesture|careful plan'),
M('Il agit sans réfléchir et casse l’objet qu’il voulait réparer : quelle _____ !','sottise|sagesse|prudence|habileté'),
A('Elle reconnaît sa sottise : elle a jeté le billet encore valable et doit maintenant payer de nouveau.','Quel mot désigne son action déraisonnable ?','sottise|billet|valable|payer'));
add(278,'masculine singular','Husband rather than another family relation; no context-independent role ambiguity.',
E('Son mari lui offre des fleurs pour leur anniversaire de mariage.','husband|brother|father|cousin'),
M('Elle a épousé Paul il y a dix ans ; depuis ce mariage, il est son _____.','mari|frère|père|cousin'),
A('Elle voyage avec son mari pour célébrer leur mariage, tandis que son frère garde la maison.','Quel mot désigne l’homme avec qui elle est mariée ?','mari|mariage|frère|maison'));
add(279,'masculine singular with elision','Office-performance sense; replace the l’ elision giveaways with vowel-initial masculine nouns.',null,
M('En tant que maire en fonction, il prend cette décision dans l’_____ de son mandat.','exercice|abandon|oubli|effacement'),
A('L’exercice de son mandat l’amène à rencontrer les habitants et à décider des travaux de la commune.','Quel mot désigne l’accomplissement effectif de sa fonction ?','exercice|mandat|habitants|travaux'));
add(280,'feminine singular','Subject under discussion in être question de, matching the source use.',
E('Dans cette réunion, il est question de réparer le toit de l’école.','subject; matter|answer|silence|departure'),
M('Les participants parlent du budget : c’est la _____ examinée pendant cette réunion.','question|réponse|consigne|salle'),
A('Il est question du nouveau pont dans le rapport ; les auteurs y discutent du coût et des délais.','Quel mot introduit le sujet dont on parle ?','question|pont|auteurs|coût'));
add(281,'feminine singular','Existing distress set clearly contrasts anguish with positive states and has matching noun agreement.',null,null,null);
add(282,'feminine singular','Person harmed; all feminine singular role alternatives.',
E('La victime du vol signale la disparition de son sac.','victim|witness|judge|thief'),
M('Cette femme a subi le vol de ses économies : la _____ demande réparation.','victime|coupable|voleuse|complice'),
A('La victime reçoit de l’aide après l’incendie ; sa maison est détruite et elle cherche un abri.','Quel mot désigne la personne qui a subi le dommage ?','victime|maison|détruite|abri'));
add(283,'masculine singular','Lowercase common role in normal prose; head of an association avoids current political facts.',
E('Le président de l’association ouvre la réunion et présente les projets.','president|treasurer|secretary|member'),
M('Élu pour présider l’association et en diriger les réunions, le _____ prend la parole.','président|trésorier|secrétaire|membre'),
A('Le président du club dirige la séance ; la secrétaire prend les notes et le trésorier présente les comptes.','Quel mot désigne la personne qui préside le club ?','président|secrétaire|trésorier|comptes'));
add(284,'feminine singular','Figurative lucky star; remove elision giveaways and the synonymous destin answer from advanced.',
E('Il attribue sa chance à une bonne étoile qui le protège.','lucky star|lamp|map|signal'),
M('Elle imagine qu’un astre bienveillant protège son avenir : elle croit en sa bonne _____.','étoile|lampe|carte|route'),
A('Il remercie sa bonne étoile après cette rencontre heureuse ; il y voit un signe de chance pour son voyage.','Quel mot évoque figurément ce qui favoriserait sa destinée ?','étoile|rencontre|signe|voyage'));
add(285,'masculine singular','Unexplained hidden matter; singular masculine alternatives.',
E('La disparition de la clé reste un mystère : personne ne sait où elle est passée.','mystery|certainty|habit|rule'),
M('Personne ne peut expliquer cette disparition : elle reste un _____.','mystère|accord|règlement|contrat'),
A('Elle cherche à éclaircir le mystère du tableau disparu en interrogeant les visiteurs et en examinant la fenêtre ouverte.','Quel mot désigne l’affaire qui reste inexpliquée ?','mystère|tableau|visiteurs|fenêtre'));
add(286,'feminine singular','All alternatives singular feminine; organized public actions specify campaign.',null,
M('Pendant un mois, l’association organise affiches, réunions et annonces dans une _____ de sensibilisation.','campagne|maison|dispute|promenade'),null);
hold(287,'Source d’une part/d’autre part is a discourse expression. Resolve how the independently tested component part should represent aspect/side without silently changing to a food-portion or share sense.');
add(288,'masculine plural','Plural minds, with grammatical plural masculine body/faculty alternatives.',
E('Cette énigme occupe les esprits des élèves toute la matinée.','minds|voices|hands|stomachs'),
M('Les élèves réfléchissent en silence ; leurs _____ cherchent une solution à l’énigme.','esprits|bras|pieds|regards'),
A('Les esprits s’échauffent pendant le débat ; chacun défend ses idées et cherche à convaincre ses voisins.','Quel mot renvoie aux facultés de penser des participants ?','esprits|débat|idées|voisins'));
add(289,'masculine singular','Period of sovereign rule; masculine singular temporal/event alternatives.',
E('Pendant le règne de cette reine, plusieurs ponts ont été construits.','reign|exile|trial|journey'),
M('Couronné à vingt ans, il gouverne jusqu’à sa mort : son _____ dure cinquante ans.','règne|exil|procès|voyage'),
A('Le règne du roi s’achève à sa mort ; son fils reçoit alors la couronne et prend le pouvoir.','Quel mot désigne la période durant laquelle le souverain gouverne ?','règne|mort|fils|couronne'));
add(290,'feminine singular','A claimed justification rather than any explanation or proof; cohesive late-arrival scene.',null,
M('Pour justifier sa faute et éviter un reproche, il invente une _____.','excuse|consigne|récompense|invitation'),
A('Elle présente une excuse pour son retard : son réveil n’a pas sonné, affirme-t-elle au directeur.','Quel mot désigne la raison avancée pour atténuer sa faute ?','excuse|retard|réveil|directeur'));
add(291,'feminine singular','Hostility explicit instead of leaving the emotion unspecified.',null,
M('Il rejette violemment son rival et souhaite lui nuire ; ses paroles expriment une profonde _____.','haine|affection|estime|curiosité'),
A('La haine le pousse à vouloir blesser son adversaire ; une amie intervient pour empêcher la violence.','Quel mot désigne le sentiment d’hostilité violente ?','haine|adversaire|amie|violence'));
add(292,'masculine singular','Existing government early/middle sound; coherent cabinet action at advanced.',null,null,
A('Le gouvernement réunit les ministres pour préparer sa politique ; les décisions seront annoncées après la réunion.','Quel mot désigne l’ensemble qui dirige l’État ?','gouvernement|ministres|politique|réunion'));
add(293,'masculine singular','Existing disaster set is clear and has compatible singular masculine nouns.',null,null,null);
add(294,'masculine plural','The old armées étaient ennemis had incorrect gender and adjectival use. Replace with a noun question.',null,
M('Ces hommes veulent nous attaquer et combattent notre camp : ce sont nos _____.','ennemis|alliés|protecteurs|sauveurs'),
A('Les ennemis acceptent enfin la paix ; ils déposent leurs armes et signent le traité avec leurs anciens adversaires.','Quel mot désigne ceux qui combattaient le camp opposé ?','ennemis|paix|armes|traité'));
add(295,'masculine plural','Remove stops/breaks as legitimate alternate English meanings and the feminine pauses gap option.',
E('Les arrêts de cette cour sont publiés chaque mois.','court rulings|travel plans|work schedules|price lists'),
M('La cour rend plusieurs _____ motivés pour trancher ces affaires.','arrêts|voyages|retards|discours'),null);
add(296,'feminine singular','Lasting resentment after offense; feminine singular emotions.',
E('Il lui garde de la rancune longtemps après cette humiliation.','resentment|gratitude|trust|joy'),
M('Des années après l’offense, elle n’a toujours pas pardonné et éprouve encore de la _____.','rancune|gratitude|confiance|joie'),
A('Sa rancune persiste malgré les excuses ; il évite toujours la personne qui l’a autrefois humilié.','Quel mot désigne l’hostilité durable née de l’offense ?','rancune|excuses|personne|humilié'));
add(297,'masculine plural','Make the confessions reveal the wrongdoing rather than circularly introducing another admission.',
E('Dans ses aveux, il reconnaît avoir caché la lettre pour tromper ses collègues.','confessions|denials|questions|orders'),null,
A('Les aveux du suspect révèlent où il a caché l’argent ; les policiers retrouvent la somme derrière une armoire.','Quel mot désigne ses reconnaissances d’un fait compromettant ?','aveux|suspect|somme|armoire'));
add(298,'masculine singular','Existing forger set is coherent; all gap roles masculine singular and forged documents identify the role.',null,null,null);
add(299,'feminine singular with elision','All alternatives fit l’; fully surrounded land distinguishes island.',null,
M('Le bateau approche de l’_____, cette terre entourée d’eau de tous côtés.','île|oasis|anse|embouchure'),
A('L’île est loin du continent ; les habitants prennent le bateau pour rejoindre le port le plus proche.','Quel mot désigne la terre entièrement entourée d’eau ?','île|continent|habitants|port'));
add(300,'feminine singular','All gap people nouns feminine singular; remove avocate as a second advanced answer to adult female person.',null,
M('Âgée de quarante ans, cette _____ reprend ses études à l’université.','femme|fillette|adolescente|gamine'),
A('La femme attend son mari devant la fenêtre, tandis que leurs enfants jouent dans le jardin.','Quel mot désigne ici la personne adulte de sexe féminin ?','femme|mari|enfants|jardin'));
export default {version:1,id:'fr-2026-09-19-05',language:'fr',snapshot:'fr-0201-0300-input.json',entries:rows};
