import {readFileSync} from 'node:fs';
import {loadPublication} from '../../../dist/publication/repository.js';
const p=loadPublication();
const input=JSON.parse(readFileSync(new URL('fr-lexical-holds-input.json',import.meta.url))).entries;
const old=form=>input.find(x=>x.surface.form===form);
const lemma=id=>p.bundle.lemmas.find(x=>x.id===id);
const E=(context,choices)=>({context,choices});const M=E;const A=(context,prompt,choices)=>({context,prompt,choices});
const target=(form,lemmaValue,surfaceId,senseId,gloss,definition,features)=>({lemma:lemmaValue,surface:{id:surfaceId,lemmaId:lemmaValue.id,form,normalized:form.toLocaleLowerCase('fr'),...(features?{grammaticalFeatures:features}:{})},sense:{id:senseId,lemmaId:lemmaValue.id,gloss,definition}});
const rows=[];const add=(from,to,occurrenceIds,reason,questions,metadataCorrection=false)=>rows.push({from,target:to,occurrenceIds,reason,questions,metadataCorrection});
const same=form=>({surface:old(form).surface,sense:old(form).sense,lemma:old(form).lemma});
add('venue',target('venue',lemma('lem_venir'),'srf_fr_venue_venir','sns_fr_venir_arrival_time','come; arrived','Arriver ou se présenter, notamment en parlant d’un moment ou d’un phénomène.',{gender:'feminine',number:'singular',mood:'participle',tense:'past'}),'all',
'The bise and the night are subjects of venir in its arrival sense; venue is a feminine past participle in both source spans, never the arrival noun. Reuse the existing venir lemma, preserve the wrong noun as historical data, and create the missing participial surface and temporal/phenomenon arrival sense. Both source occurrences read in full.',[
E('La saison des pluies est venue plus tôt cette année.','come|ended|lasted|disappeared'),
M('La nuit est enfin _____ sur le village ; les premières étoiles brillent.','venue|venues|venu|venus'),
A('L’heure du départ est venue ; les voyageurs ferment leurs valises et gagnent le quai.','Quelle forme verbale indique que le moment du départ est arrivé ?','venue|heure|ferment|quai')]);
add('nouvelle',target('nouvelle',{id:'lem_fr_nouveau_adjective',headword:'nouveau',partOfSpeech:'adjective'},'srf_fr_nouvelle_adjective','sns_fr_nouveau_new','new','Qui apparaît, arrive ou remplace ce qui existait auparavant.',{gender:'feminine',number:'singular'}),'all',
'All three source occurrences modify nouns: peine, saison and rivière (necklace). New/additional/replacement are compatible adjective uses. No existing nouveau adjective lemma was present. Keep the unrelated news/short-story noun history and introduce a fresh adjective identity.',[
E('Elle remplace sa vieille lampe par une nouvelle lampe encore dans sa boîte.','new|broken|dirty|empty'),
M('Cette _____ boutique vient d’ouvrir ; nous ne l’avions jamais vue auparavant.','nouvelle|nouveau|nouvel|nouvelles'),
A('La nouvelle directrice rencontre son équipe pour la première fois et visite les bureaux.','Quel adjectif indique que la directrice vient de prendre sa place ?','nouvelle|directrice|équipe|première')]);
add('intérêt',target('intérêt',old('intérêt').lemma,old('intérêt').surface.id,'sns_fr_interet_loan_charge','interest','Somme payée en plus du capital pour l’usage d’un argent prêté.'),['occ_cigale_fourmi_bb6135bba0572186957d2d33'],
'In intérêt et principal, intérêt is the charge on borrowed capital. Only the Cigale occurrence moves to this new sense. The Zola military-advantage occurrence retains its old sense and mastery. No existing loan-interest sense was present.',[
E('Pour ce prêt de cent euros, elle doit payer cinq euros d’intérêt en plus du capital.','interest|salary|rent|deposit'),
M('Le prêt coûte cinq euros d’_____ pour l’année, en plus des cent euros à rembourser.','intérêt|acompte|héritage|achat'),
A('Le contrat indique le capital prêté et l’intérêt que le client devra payer pour utiliser cet argent.','Quel mot désigne le coût de l’argent prêté ?','intérêt|contrat|capital|client')],true);
add('intérêt',same('intérêt'),['occ_zola_1f1d69a1fd504c43b1c97f4a'],
'The retained Zola occurrence means the perceived advantage of the military institution. The three contexts below teach advantage rather than curiosity or loan interest. All intermediate nouns masculine singular; no legitimate alternate interest meaning is an English distractor.',[
E('Il agit dans l’intérêt de son équipe pour que tous en profitent.','benefit|harm|loss|risk'),
M('Cette décision profite à tous les habitants ; elle est prise dans leur _____.','intérêt|mépris|oubli|malheur'),
A('L’intérêt des élèves passe avant le confort des adultes : l’école garde sa bibliothèque ouverte plus tard.','Quel mot désigne ce qui est avantageux pour les élèves ?','intérêt|confort|école|bibliothèque')]);
add('foi',target('foi',old('foi').lemma,old('foi').surface.id,'sns_fr_foi_attestation','proof; attestation','Valeur de preuve, dans faire foi : attester la réalité d’un fait.'),['occ_lion_rat_ef733569d9ed7e3ce15683fa'],
'The Lion et Rat occurrence feront foi means attestation, not a promise. Split this occurrence into its own sense while preserving the pledged-word sense in Cigale. Questions retain the faire foi construction and use distinct documentary contexts.',[
E('Le reçu fait foi de notre paiement auprès du vendeur.','proof|permission|request|warning'),
M('Pour confirmer la date sans discussion, ce document fera _____.','foi|peur|honte|envie'),
A('La signature fera foi de son accord ; elle conserve donc une copie du contrat dans ses archives.','Quel mot, associé à fera, indique la valeur de preuve ?','foi|signature|copie|archives')]);
add('foi',same('foi'),['occ_cigale_fourmi_29e44c88d751078f4a908595'],
'The remaining foi d’animal is a pledge of one’s word. Literary pledged-word contexts are appropriate; all intermediate choices are feminine singular nouns after ma. Other legitimate faith/religion meanings are not distractors.',[
E('Sur ma foi, je tiendrai la promesse que je vous ai faite.','pledged word|fear|anger|desire'),
M('« Sur ma _____ de chevalier, je vous promets de revenir », déclare-t-il solennellement.','foi|peur|faim|colère'),
A('Il engage sa foi devant ses compagnons et jure de leur rendre le trésor confié à sa garde.','Quel mot désigne la parole donnée comme garantie ?','foi|compagnons|trésor|garde')]);
const seMettre={id:'lem_fr_se_mettre',headword:'se mettre',partOfSpeech:'verb'};
add('mette',target('mette',seMettre,'srf_fr_se_mette','sns_fr_se_mettre_state','get; enter a state','Entrer dans un état ou commencer à y être, dans un emploi pronominal.',{number:'singular',mood:'subjunctive',tense:'present'}),['occ_loup_agneau_062bff14c52108eea553a25d'],
'The Loup occurrence se mette en colère is the pronominal state-change verb, not a bread-chest noun. Separate it from the clothing use in La Parure. The three contexts concern entering anger, ease and operation. Existing mettre place/doubt senses do not cover the pronominal entry as a separate lexical verb.',[
E('J’ai peur qu’il se mette en colère en découvrant la vitre cassée.','get|remain|pretend|stop'),
M('Pour qu’elle se sente bien avant l’entretien, il faut qu’elle se _____ à l’aise.','mette|mets|mettais|mettrai'),
A('Pour que la machine se mette en marche, appuie sur le bouton et vérifie le voyant.','Quelle forme verbale, avec se, exprime le passage à un nouvel état ?','mette|machine|appuie|voyant')]);
add('mette',target('mette',lemma('lem_mettre'),'srf_fr_mette_mettre','sns_fr_mettre_wear','put on','Revêtir un vêtement ou placer un accessoire sur soi.',{number:'singular',mood:'subjunctive',tense:'present'}),['occ_parure_4d2c5e85c6e4f9b6e35f345c'],
'In La Parure, mette sur le dos means put on clothing. Reuse the existing mettre lemma, create the missing surface and clothing sense, preserve the historical bad noun, and restrict reassignment to this span.',[
E('Sa mère veut qu’il mette son manteau avant de sortir dans le froid.','put on|take off|wash|lend'),
M('Le soleil est fort ; il faut que je _____ mon chapeau avant de sortir.','mette|mets|mettais|mettrai'),
A('Pour qu’elle mette ses gants, son père les lui tend avant la promenade dans la neige.','Quelle forme verbale signifie ici qu’elle porte un accessoire sur elle ?','mette|gants|tend|neige')]);
add('passé',target('passé',lemma('lem_zola_passer'),'srf_fr_passe_passer','sns_zola_passer_elapse_happen',p.bundle.senses.find(s=>s.id==='sns_zola_passer_elapse_happen').gloss,p.bundle.senses.find(s=>s.id==='sns_zola_passer_elapse_happen').definition,{gender:'masculine',number:'singular',mood:'participle',tense:'past'}),['occ_cendrillon_90dcbd78a6e634ec009d5fe1'],
'In ce qui s’étoit passé au bal, passé is the past participle of se passer meaning happen. Reuse the existing passer elapse/happen sense and create only its missing surface. Do not assign the erroneous noun-past mastery.',[
E('Elle raconte ce qui s’est passé pendant la réunion.','happened|vanished|remained|begun'),
M('Personne ne sait ce qui s’est _____ dans la pièce fermée.','passé|passée|passés|passées'),
A('Un incident s’est passé devant la gare ; les témoins expliquent les faits aux policiers.','Quelle forme verbale indique qu’un événement a eu lieu ?','passé|incident|gare|expliquent')]);
add('passé',target('passé',{id:'lem_fr_passe_adjective',headword:'passé',partOfSpeech:'adjective'},'srf_fr_passe_adjective','sns_fr_passe_elapsed','past; last','Qui s’est écoulé et précède le moment présent.',{gender:'masculine',number:'singular'}),['occ_loup_agneau_ec498259e364569fb402985f'],
'In l’an passé, passé modifies an and means the previous/elapsed year. It is not the noun past or the event verb. Create a fresh adjective identity, preserving the old noun history.',[
E('Le mois passé, nous avons visité nos amis à Lyon.','last|next|first|entire'),
M('Le printemps _____ a été pluvieux ; celui de cette année commence sous le soleil.','passé|passée|passés|passées'),
A('Le temps passé loin de sa famille lui semble long ; il pense aux semaines déjà écoulées.','Quel adjectif indique que le temps est déjà écoulé ?','passé|famille|long|semaines')]);
add('étais',target('étais',lemma('lem_etre'),'srf_fr_etais_etre','sns_fr_etre_auxiliary','had (past auxiliary)','Auxiliaire être employé pour former un temps composé.',{number:'singular',mood:'indicative',tense:'imperfect'}),'all',
'Both source uses are auxiliary être: je n’étais pas né and tu ne t’en étais pas aperçue. The same written form covers first/second person; no false single-person feature is stored. Reuse être, add missing étais and the compound-tense auxiliary sense, preserving the unrelated construction-support noun history.',[
E('Tu étais déjà revenu quand la pluie a commencé.','had|will|must|can'),
M('Hier, tu _____ déjà parti quand je suis arrivé.','étais|était|étions|étiez'),
A('Tu étais sorti avant le début de la réunion ; ton voisin a donc gardé les documents pour toi.','Quelle forme de l’auxiliaire être accompagne sorti pour situer le départ dans le passé ?','étais|sorti|voisin|gardé')]);
const pointNeg={surface:p.bundle.surfaceForms.find(s=>s.id==='srf_point_adverb'),sense:p.bundle.senses.find(s=>s.id==='sns_point_negation'),lemma:lemma('lem_point_adverb')};
add('point',pointNeg,old('point').occurrences.filter(o=>o.id!=='occ_9df443d478de98d5baaa9ea3').map(o=>o.id),
'Each of the thirteen selected occurrences participates in literary negation ne…point (including a negative question). Reuse the existing negative-adverb identity; its three already linked occurrences are also negative. Do not duplicate the identity or reset/copy its learner progress. Replace the ambiguous ne change point/plus gap.',[
null,
M('Il refuse totalement cette proposition : il ne l’accepte _____, même en partie.','point|parfois|déjà|souvent'),
null]);
add('point',same('point'),['occ_9df443d478de98d5baaa9ea3'],
'Only the Lievre timely-moment occurrence remains on the noun identity. Retain its early and advanced questions. The middle choices form grammatical à point/à tort/à regret/à contrecœur phrases; the appositional timing explanation identifies point, avoiding the synonymous à temps.',[
null,
M('Cette pause vient à _____, juste au moment où les enfants ont besoin de repos.','point|tort|regret|contrecœur'),
null]);
const sous=old('sous');
add('sous',target('sous',lemma('lem_parure_sou_noun_c6e2f69d04'),'srf_fr_sous_sou','sns_fr_sou_small_coin','small coins','Petites pièces de monnaie ou unités monétaires de faible valeur.',{gender:'masculine',number:'plural'}),['occ_parure_68f367812c6c98723405140b'],
'In cinq sous la page, sous is plural of sou, a monetary amount. Reuse the sou lemma but not its misleading medieval-gold sense: this nineteenth-century occurrence is ordinary small money. Create a small-coin sense and plural surface. The remaining sous occurrences are prepositions.',[
E('Il compte les sous dans sa poche avant d’acheter du pain.','small coins|buttons|keys|pebbles'),
M('Dans ce récit ancien, le pain coûte quelques _____ ; il sort les petites pièces de sa poche.','sous|boutons|clous|cailloux'),
A('Elle économise ses sous dans une boîte pour payer le voyage avec cet argent.','Quel mot désigne les petites pièces de monnaie ?','sous|boîte|voyage|argent')]);
add('sous',{...same('sous'),lemma:{...sous.lemma,partOfSpeech:'preposition'}},sous.occurrences.filter(o=>o.id!=='occ_parure_68f367812c6c98723405140b').map(o=>o.id),
'All remaining occurrences are prepositional: location below, dictation, pressure, authority, presidency or pretext. Correct POS only, keeping the existing under/beneath sense and mastery; the coin occurrence has been removed explicitly. Author new location contexts within the retained definition. Prepositions are not subject to the noun-choice rule.',[
E('Le chat dort sous la table, entre ses quatre pieds.','under|above|beside|behind'),
M('La balle est tombée _____ le lit ; il se penche pour regarder dans l’espace entre le lit et le sol.','sous|sur|devant|derrière'),
A('La lettre est sous le livre : elle touche la table et le livre repose au-dessus d’elle.','Quel mot indique une position inférieure à celle du livre ?','sous|lettre|livre|touche')],true);
export default {version:1,id:'fr-2026-09-19-03',snapshot:'fr-lexical-holds-input.json',entries:rows};
