"""Record the individually chosen Chapter VI routes and authored questions.
Selectors and exceptions below are editorial decisions, never inferred approvals.
The limit supports source-bound recovery increments during the work package.
"""
from pathlib import Path
import json,hashlib,sys
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'content/sources/wrk_voltaire_micromegas'
def read(f): return json.loads((P/f).read_text())
def hashv(v): return hashlib.sha256(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode()).hexdigest()
def digest(f): return hashlib.sha256((P/f).read_bytes()).hexdigest()
def write(f,d): (P/f).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
packet=read('chapter-06-context-packet-01.json');byform={i['form']:i for i in packet['items']}
limit=int(sys.argv[1]) if len(sys.argv)>1 else 120
# All these banks were read in full: source meaning, four alternatives in each
# band, and number/gender for noun banks. Exceptional functions are listed below.
DEFAULT={
'bien':5,'meilleur':0,'que':2,'son':0,'vit':2,'les':0,'se':0,'il':0,'le':0,'fit':1,'remarquer':0,'à':5,'qui':0,'honteux':0,'de':1,'s’':0,'être':2,'sur':1,'l’':0,'la':0,'ne':0,'voulut':0,'point':0,'croire':0,'pareilles':0,'des':1,'avait':0,'don':0,'langues':0,'aussi':2,'n’':0,'parler':0,'nos':0,'qu’':2,'ils':0,'pas':2,'d’':4,'ailleurs':0,'ces':0,'voix':0,'dire':0,'pour':0,'faut':0,'ou':0,'peu':0,'mais':1,'donc':0,'une':0,'âme':0,'or':0,'cette':0,'cela':0,'lui':0,'dit':0,'vous':0,'avez':0,'cru':0,'tout':2,'est':0,'ce':1,'on':0,'puisse':0,'faire':1,'quelque':0,'du':0,'soit':1,'plus':1,'produire':0,'un':0,'enfant':0,'moi':0,'autre':1,'me':0,'grands':0,'je':0,'ose':0,'ni':0,'ai':0,'opinion':0}
NOTES={
'bien':'Degree in bien meilleur and bien d’autres; favorable manner in bien dit; affirmation in croyez/mesurerai/garderai bien. Neither willingness nor a discourse-marker reading applies.',
'que':'Comparative, clause-linking, relative-object and restrictive functions are assigned separately at exact offsets; the relative object has the appropriate pronoun lemma rather than a conjunction lemma.',
'vit':'Visual perception of the talking atoms selects voir, not the homographic vivre. The perception bank uses visual evidence and three sound bands.',
'se':'Reciprocal speaking/communicating, the indirect reflexive body-part construction se coupa les ongles, and other pronominal constructions fall within the inspected definition.',
'il':'Personal references to the Sirian/dwarf are separated from referent-free falloir, possibility, il y a and the literary existential il est des êtres.',
'fit':'Causative fit remarquer is kept apart from performed activity fit autant/fit deux stations and manufacture of a speaking trumpet.',
'qui':'Relative-subject uses have explicit antecedents. The indirect question deviner qui leur parlait needs a separate interrogation proposal.',
'de':'Prepositional possession, relation, infinitive complements and material remain distinct from indefinite plural de pareilles espèces/de grands mystères.',
's’':'Elided si introduces conditions or indirect whether questions; s’être, s’est plu and s’écria are pronominal se, not conjunctions.',
'être':'Compound auxiliary in s’être mépris, passive auxiliary in être entendue, linking infinitive in être si petits. The living-being noun proposal is inapplicable.',
'sur':'Mépris sur l’article and fabuleux sur les abeilles concern a topic; placement on knees/nail/instrument and judgement resting on grandeur use the support sense.',
'pareilles':'The adjective characterizes such kinds by resemblance/likeness; all three stored bands teach the inspected same resemblance sense, with feminine plural adjective alternatives in the middle band.',
'des':'The contractions in don des langues, étonnement des voyageurs, prières des exorcismes, au-dessus des nuages and un des philosophes are separated from indefinite plural objects.',
'qu’':'Elided relative-object, comparative, clause-linking and restriction functions are selected individually. The literary concessive quelque système qu’ils fissent still links a subordinate clause.',
'd’':'Prepositional complements are separate from indefinite plural d’autres, negative indefinite d’opinion and attributive d’étonné; d’ailleurs is reserved as a full expression.',
'pour':'Purpose in pour parler and beneficiary in respect pour les dames fit the broad preposition. Pour moi is a standpoint construction; the scale analogies are held for a construction-specific review.',
'âme':'Soul as a principle of inner thought/life fits the inspected inner-self definition. The middle alternatives âme, épaule, image, oreille are all feminine singular and fit unchanged l’.',
'voix':'The organ-produced sound of speech is voice in all four contexts. All four middle alternatives voix/mémoire/vue/force are feminine singular; the loss-of-sound clue selects voix.',
'don':'The ability to understand languages is an endowed aptitude. Don/dégoût/ennui/doute are all masculine singular; exceptional aptitude alone selects don.',
'langues':'French and other systems of communication are languages, not tongues as organs. All four middle choices langues/chansons/histoires/opinions are feminine plural; communication selects langues.',
'est':'Linking quality/identity, compound auxiliary s’est plu, passive est bien dit and existential il est des êtres are distinct readings. Est-ce que is reviewed as a full expression later.',
'ce':'Determiner ce jeu/ce misérable état differs from neutral pronoun ce que and ce furent; the interrogative est-ce que span is held as one expression.',
'un':'Indefinite article before a noun differs from pronominal l’un and un des philosophes. The interrupted un… remains an article introducing the unfinished predicate nominal.',
'plus':'Negative plus ends belief/opinion; the other occurrences express a higher degree or a superlative. The legacy anymore and degree senses are not conflated.',
'produire':'Presenting/formulating an argument fits the inspected faire apparaître ou présenter un élément sense. The material-child comparison does not change this verb’s target to giving birth.',
'opinion':'The dwarf’s personal judgement fits the published definition including an individual’s manner of thinking. All four middle choices are feminine singular; expressed judgement selects opinion.',
'enfant':'A newly produced child is a young person; all middle choices enfant/adulte/octogénaire/adolescent are masculine singular with the unchanged cet. Six years old selects enfant.'}
# Exact same-surface banks previously authored and reviewed; these have been
# re-read, including each noun distractor, for the new Chapter VI contexts.
EARLIER={'nain':0,'atomes':0,'idées':0,'organes':0,'penser':0,'tâcher':0}
EARLIER_NOTE={
'nain':'The smaller Saturnian is the same comparative dwarf as in IV; nain/géant/capitaine/roi are masculine singular. Relative smallness selects nain.',
'atomes':'All four contexts call tiny humans atoms metaphorically; the Chapter V bank teaches tiny particles/beings and all middle choices are masculine plural.',
'idées':'The exchanged content is thoughts. Idées/formes/odeurs/ombres are feminine plural; forming thoughts selects idées.',
'organes':'The organs of voice are bodily organs, the same anatomical sense as V. Organes/livres/cordages/vaisseaux are masculine plural; proportional body parts select organes.',
'penser':'The ability to form thoughts here fits the earlier penser definition linked to sns_fr_penser_think; three existing bands test thinking and do not claim a physical activity.',
'tâcher':'The dwarf wants to try examining the creatures; the earlier bank tests making an effort rather than refusal, completion or forgetting.'}
EXCEPT={}
def assign(form,unit,start,kind,value): EXCEPT[(form,unit,start)]=(kind,value)
for u,s,c in [(133,12,2),(149,43,2),(138,212,3)]:assign('bien',u,s,'published',c)
for u,s in [(133,38),(155,49),(157,39),(163,55),(164,130),(164,210),(165,132)]:assign('que',u,s,'published',4)
for u,s in [(150,23),(161,62),(161,99),(164,299),(166,30),(166,86),(166,120),(167,72),(167,111),(167,190)]:assign('que',u,s,'published',9)
assign('que',167,279,'published',5)
for s in [36,92]:assign('les',156,s,'published',1)
for u,s in [(135,13),(137,28),(138,134),(146,0),(152,10),(163,69),(164,160),(164,179),(165,72),(167,23)]:assign('il',u,s,'published',1)
for u,s in [(133,103),(150,111),(158,216)]:assign('le',u,s,'published',1)
assign('fit',133,106,'published',3)
assign('de',133,226,'earlier',0);assign('de',138,40,'earlier',0)
for u,s in [(133,153),(150,47),(158,17)]:assign('s’',u,s,'published',1)
assign('être',133,155,'published',1);assign('être',145,210,'published',0)
for u,s in [(133,167),(166,60)]:assign('sur',u,s,'published',2)
for u,s in [(158,213),(167,265)]:assign('ne',u,s,'published',1)
for u,s in [(134,16),(143,13),(154,42),(160,130),(165,3)]:assign('des',u,s,'published',2)
for u,s in [(150,129),(156,58),(156,228),(157,71),(162,70)]:assign('qu’',u,s,'published',1)
assign('qu’',137,75,'published',5);assign('qu’',158,224,'published',0)
assign('d’',149,48,'earlier',0);assign('d’',167,223,'earlier',0);assign('d’',138,122,'earlier',2);assign('d’',152,30,'earlier',1)
assign('pour',138,0,'earlier',0)
assign('tout',166,22,'published',1)
assign('est',150,49,'published',2);assign('est',138,203,'published',4);assign('est',165,75,'published',3)
assign('ce',144,52,'published',0);assign('ce',156,176,'published',0)
for u,s in [(138,71),(138,117)]:assign('plus',u,s,'published',5)
assign('un',138,12,'published',1);assign('un',165,0,'published',1)
# Construction components are NOT approved as isolated word quizzes. The
# deferred work is explicit, including shared repairs already impact-reviewed.
HOLDS={}
def hold(form,unit,start,note): HOLDS[(form,unit,start)]=note
for form,u,s,n in [
('bien',134,34,'Full aussi bien que construction: as well as; review entire span and three-band expression bank.'),('que',134,39,'Full aussi bien que construction.'),('aussi',134,28,'Full aussi bien que construction.'),
('que',136,86,'Full est-ce que interrogative expression.'),('est',136,79,'Full est-ce que interrogative expression.'),('ce',136,83,'Full est-ce que interrogative expression.'),
('que',140,81,'Full de sorte que result expression.'),('de',140,72,'Full de sorte que result expression.'),
('son',160,58,'Full de son long expression: at full length.'),('de',160,55,'Full de son long expression.'),
('à',135,32,'Full à peu près approximation expression; same phrase already reviewed in V.'),('peu',135,34,'Full à peu près approximation expression.'),('près',135,38,'Full à peu près approximation expression; not spatial near.'),
('tout',136,37,'Full tout à l’heure expression meaning a moment ago in this past context.'),('à',136,42,'Full tout à l’heure expression, past reference.'),('l’',136,44,'Full tout à l’heure expression, past reference.'),('heure',136,46,'Full tout à l’heure expression, not an elapsed hour.'),
('d’',134,137,'Full d’ailleurs expression: besides.'),('ailleurs',134,139,'Full d’ailleurs expression.'),('d’',137,14,'Full d’ailleurs expression: besides.'),('ailleurs',137,16,'Full d’ailleurs expression.'),
('à',140,92,'Full grâce à expression: thanks to.'),('à',158,227,'Full à travers expression: through.'),('à',161,146,'Full à cause de expression: because of.'),('de',161,154,'Full à cause de expression.'),
('à',168,4,'Full peu à peu expression: gradually.'),('peu',168,0,'Full peu à peu expression.'),('peu',168,6,'Full peu à peu expression.'),
('du',136,177,'Full du moins expression: at least as a qualification, not numeric minimum.'),('moins',136,180,'Full du moins expression; published au moins bank does not teach this qualification.'),
('faisaient',136,59,'Full faisaient l’amour phrase; historical courting and physical/procreative context must be reconciled.'),('faire',136,115,'Full faire l’amour phrase.'),('amour',136,71,'Full faisaient l’amour phrase, not isolated love/affection.'),('amour',136,123,'Full faire l’amour phrase.'),('l’',136,69,'Full faisaient l’amour phrase.'),('l’',136,121,'Full faire l’amour phrase.'),
('faire',136,194,'Full se faire entendre construction: make oneself heard/understood.'),('se',136,191,'Full se faire entendre construction.'),('entendre',136,200,'Full se faire entendre construction; compare hearing with understanding.'),
('qu’auraient',134,222,'Que interrogative + lexical auraient in qu’auraient-ils à dire. Reconcile the combined surface with existing fused-form policy; do not invent a tense-only sense.'),
('pour',167,51,'Relational scale analogy sont pour les abeilles ce que... needs a dedicated construction decision.'),('pour',167,94,'Relational scale analogy.'),('pour',167,140,'Relational scale analogy.'),('pour',167,218,'Relational scale analogy.'),
('comment',134,149,'Published middle blank starts a sentence but all choices are lowercase; propose capitalization repair only after workwide impact review.')]:hold(form,u,s,n)
# New or newly separated contextual banks. Parameters are authored individually:
# surface, lemma, POS, English meaning/options, French semantic middle clue,
# same-grammar French options, retrieval clue, identity route target.
SPECS=[]
def new(form,lemma,pos,meaning,low,middle,choices,advanced,target,occ=None,note=''):
 SPECS.append(dict(form=form,lemma=lemma,partOfSpeech=pos,meaning=meaning,low=[meaning,*low],middle=middle,choices=choices,advanced=advanced,target=target,occ=occ,note=note))
new('clairement','clairement','adverb','clearly',['vaguely','silently','slowly'],'La distinction était nette : il voyait ___ les minuscules êtres.',['clairement','confusément','vaguement','indistinctement'],'Quel adverbe signifie de façon nette, sans confusion ?','new')
new('parlaient','parler','verb imperfect plural','were speaking',['were sleeping','were writing','were hiding'],'Les êtres échangeaient des paroles : ils se ___.',['parlaient','cachaient','battaient','regardaient'],'Quel verbe indique un échange de paroles à l’imparfait ?','sns_zola_parler_speak')
new('mépris','se méprendre','verb past participle','mistaken',['contempt','forgotten','hidden'],'Il avait pris une chose pour une autre : il s’était ___.',['mépris','souvenu','réjoui','méfié'],'Quel participe, avec se, signifie trompé dans son jugement ?','new',note='The compound infinitive s’être mépris selects se méprendre; exclude the published noun mépris, contempt. Confirmed against Académie 1762.')
new('article','article','noun masculine singular','matter; point under discussion',['newspaper article','item for sale','word class'],'Ce point particulier de la discussion était l’___ sur lequel il s’était trompé.',['article','avocat','éditeur','acteur'],'Quel nom désigne ici un point particulier dont on discute ?','new:lem_zola_article',note='Article de la génération means the topic/point of reproduction. Distinct from a numbered law provision and the Chapter III encyclopaedia entry. All middle choices are masculine singular and begin with a vowel, preserving l’.')
new('génération','génération','noun feminine singular','reproduction; procreation',['people of the same age','conversation','navigation'],'La production de nouveaux êtres vivants par reproduction est appelée la ___.',['génération','navigation','conversation','population'],'Quel nom désigne l’action d’engendrer de nouveaux êtres vivants ?','new',note='The debate recalls reproduction in Chapter V. Académie 1740 documents the process of engendering. Generation as an age cohort is inapplicable. All middle choices are feminine singular.')
new('espèces','espèce','noun feminine plural','kinds; sorts',['planets','stones','shapes'],'Pour classer ces êtres par types, il distingue plusieurs ___.',['espèces','planètes','pierres','figures'],'Quel nom pluriel désigne des catégories ou sortes d’êtres ou de choses ?','prior:chapter-02-identity-plan.json:espece_kind_of',note='Categories of beings and espèces de cure-dents both retain the general kind/sort meaning; number does not justify a fresh sense. All middle choices are feminine plural.')
new('pussent','pouvoir','verb imperfect subjunctive plural','could; were able to',['wanted to','had to','refused to'],'Il doutait de leur capacité de parler et ne croyait pas qu’ils ___ le faire.',['pussent','voulussent','dussent','refusassent'],'Quel verbe à l’imparfait du subjonctif exprime une capacité possible ?','sns_zola_pouvoir_present_ability',note='Past subjunctive inflection changes the surface, not the capacity/possibility sense; do not create a sense defined only by tense.')
new('communiquer','communiquer','verb infinitive','communicate; share',['conceal','destroy','forget'],'Pour échanger leurs idées avec les autres, ils doivent les ___.',['communiquer','cacher','détruire','oublier'],'Quel infinitif signifie transmettre des idées à autrui ?','prior:chapter-02-identity-plan.json:communique_shared_information',note='Reciprocal se communiquer des idées is sharing information with one another, same sense as Chapter II communiqué; se is separately reciprocal.')
new('entendait','entendre','verb imperfect singular','could hear; heard',['could see','could smell','could touch'],'Aucun son ne parvenait à son oreille : il n’___ point les atomes parler.',['entendait','voyait','sentait','touchait'],'Quel verbe désigne la perception de sons par l’oreille à l’imparfait ?','sns_cendrillon_entendre_percevoir_un_son_1d1dcaee8e')
new('supposait','supposer','verb imperfect singular','assumed; supposed',['proved','denied','forgot'],'Il admettait cette hypothèse sans preuve : il ___ que les êtres ne parlaient pas.',['supposait','prouvait','niait','oubliait'],'Quel verbe signifie admettait une hypothèse sans la démontrer ?','new')
new('imperceptibles','imperceptible','adjective plural','imperceptible; too small to notice',['clearly visible','immense','noisy'],'Ces êtres étaient si minuscules qu’on ne pouvait les apercevoir : ils étaient ___.',['imperceptibles','visibles','immenses','bruyants'],'Quel adjectif décrit des êtres qui échappent à la perception ?','prior:chapter-04-identity-plan.json:imperceptible_imperceptible',note='Plural of the reviewed French imperceptible proposal, still too small to be perceived. Inflection does not change the meaning; exclude homographic Spanish lemmas.')
new('auraient','avoir','verb conditional plural','would have',['would lose','would destroy','would lack'],'S’ils pensaient, ils ___ une âme : ils en posséderaient l’équivalent.',['auraient','perdraient','détruiraient','manqueraient'],'Quel verbe au conditionnel signifie posséderaient ?','sns_avoir_primary',note='Both organs and an equivalent of a soul are things possessed; no compound auxiliary occurs after this conditional form.')
new('pensaient','penser','verb imperfect plural','were thinking',['were eating','were swimming','were sleeping'],'S’ils formaient des pensées, s’ils ___, ils auraient peut-être une âme.',['pensaient','mangeaient','nageaient','dormaient'],'Quel verbe désigne une activité de l’esprit à l’imparfait pluriel ?','sns_fr_penser_think')
new('équivalent','équivalent','noun masculine singular','equivalent; counterpart of equal value',['opposite','addition','obstacle'],'Il cherche un ___ de l’âme, quelque chose qui ait la même valeur et la même fonction.',['équivalent','contraire','complément','obstacle'],'Quel nom désigne ce qui a la même valeur ou remplit le même rôle ?','new',note='The article l’ nominalizes équivalent; all four middle options are masculine singular and un is unchanged.')
new('attribuer','attribuer','verb infinitive','attribute; ascribe',['remove','refuse','destroy'],'Affirmer que ces êtres ont une âme, c’est leur ___ cette qualité.',['attribuer','retirer','refuser','ôter'],'Quel infinitif signifie reconnaître à quelqu’un une qualité ou une faculté ?','new')
new('paraissait','paraître','verb imperfect singular','seemed',['became','remained','disappeared'],'Sans savoir si c’était vrai, il trouvait l’idée absurde : elle lui ___ absurde.',['paraissait','devenait','restait','disparaissait'],'Quel verbe exprime une impression, sans affirmer la réalité de ce qui est perçu ?','sns_fr_paraitre_seem',note='All three uses express an impression (absurd, inexplicable, belonging to whales), not the Chapter V separate visible-object sense.')
new('absurde','absurde','adjective singular','absurd; contrary to reason',['reasonable','obvious','necessary'],'Pour lui, l’idée contredisait toute raison et n’avait aucun sens : elle était ___.',['absurde','raisonnable','évidente','nécessaire'],'Quel adjectif qualifie une idée contraire au bon sens ou à la raison ?','new')
new('croyez','croire','verb present second plural','you believe',['you deny','you hide','you forget'],'Vous tenez cette affirmation pour vraie : vous la ___.',['croyez','niez','cachez','oubliez'],'Quel verbe signifie tenir pour vrai, adressé à vous ?','sns_croire_primary')
new('proférer','proférer','verb infinitive','utter; say aloud',['conceal','erase','forget'],'Faire sortir une parole de sa bouche, c’est la ___.',['proférer','cacher','effacer','oublier'],'Quel infinitif signifie prononcer à voix haute une parole ?','new')
new('parole','parole','noun feminine singular','spoken word; utterance',['stone','sail','rope'],'Il n’a rien dit à voix haute : aucune ___ n’est sortie de sa bouche.',['parole','pierre','voile','corde'],'Quel nom féminin désigne un mot ou un propos prononcé ?','new',note='Parole is something uttered in speech, not a promise here. All middle choices are feminine singular; voile is the feminine sail noun.')
new('entendre','entendre','verb infinitive','understand',['forget','conceal','distort'],'Après avoir appris le sens des mots, il réussit à ___ le français.',['entendre','oublier','cacher','déformer'],'Quel infinitif signifie comprendre une langue dans ce passage ?','new:lem_entendre',occ=[(141,64)],note='Entendre le français means comprehend the language, distinct from hearing speech sounds in entendait. The se faire entendre occurrence remains a full-construction hold.')
new('supposez','supposer','verb present second plural','you assume; suppose',['you prove','you deny','you forget'],'Sans l’avoir démontré, vous ___ que l’argument est plus difficile à produire.',['supposez','prouvez','niez','oubliez'],'Quel verbe signifie admettre une hypothèse, adressé à vous ?','same:supposait')
new('argument','argument','noun masculine singular','argument; reason supporting a claim',['child','journey','instrument'],'Pour justifier son idée par une raison, il avance un ___.',['argument','enfant','voyage','instrument'],'Quel nom désigne une raison employée pour soutenir une affirmation ?','new',note='The argument is a reason offered in a discussion, contrasted with producing a child. All four middle alternatives argument/enfant/voyage/instrument are masculine singular; a reason supporting a claim selects argument.')
new('paraissent','paraître','verb present plural','seem',['become','remain','disappear'],'Sans certitude sur leur nature réelle, ces êtres lui ___ méprisables.',['paraissent','deviennent','restent','disparaissent'],'Quel verbe pluriel exprime l’impression que donnent des êtres ou des choses ?','sns_fr_paraitre_seem',note='Mysteries and the creatures’ apparent worth/size concern an impression. Link the published seeming sense, rather than creating a tense-specific sense.')
new('mystères','mystère','noun masculine plural','mysteries; inexplicable things',['measurements','instruments','journeys'],'Les choses inexpliquées dont la raison échappe à l’esprit sont des ___.',['mystères','calculs','instruments','voyages'],'Quel nom pluriel désigne des choses dont l’explication échappe à l’esprit ?','sns_zola_mystere_secrecy',note='Inexplicability is explicitly within the published definition; secrecy alone is not imposed. All four middle choices are masculine plural.')
new('nier','nier','verb infinitive','deny',['accept','conceal','forget'],'Déclarer qu’une affirmation est fausse, c’est la ___.',['nier','admettre','cacher','oublier'],'Quel infinitif signifie déclarer qu’un fait n’est pas vrai ?','sns_zola_nier_deny')
new('fit','faire','verb past historic singular','made; manufactured',['destroyed','hid','lost'],'À partir de son ongle, il fabriqua une trompette : il en ___ une.',['fit','détruisit','cacha','perdit'],'Quel verbe au passé signifie fabriqua un objet ?','sns_parure_faire_creer_produire_fabriquer_en_parlant_de_toute_uvre_materielle_a8e6f1d980',occ=[(138,358)],note='Use the existing material-manufacture sense, rather than the status-change sense or the earlier song-composition proposal.')
new('faisaient','faire','verb imperfect plural','were doing',['were avoiding','were forgetting','were refusing'],'Le nain demande quelle activité ils pratiquaient : que ___-ils sur ce globe ?',['faisaient','évitaient','oubliaient','refusaient'],'Quel verbe à l’imparfait pluriel signifie accomplissaient une activité ?','sns_fr_faire_perform_activity',occ=[(156,235)],note='Question about activities on Earth, without an infinitive caused action. The other occurrence belongs to faisaient l’amour and stays held.')
new('qui','qui','interrogative pronoun','who',['where','when','why'],'Pour connaître son identité, ils se demandent ___ leur parle.',['qui','où','quand','pourquoi'],'Quel pronom interroge sur l’identité d’une personne ?','new:lem_qui',occ=[(154,200)],note='Indirect interrogation deviner qui leur parlait is distinct from relative qui attached to an antecedent. Existing who/which bank was inspected but its three questions only teach relative-subject linking.')
new('n’','ne','expletive particle','expletive marker after fearing',['not','only','already'],'Il craignait qu’un bruit trop fort ___assourdît les passagers ; cette particule ne marque ici aucune négation.',['n’','l’','m’','s’'],'Dans craindre que, quelle particule élidée peut accompagner le subjonctif sans nier le fait redouté ?','new:lem_ne',occ=[(145,180)],note='Fear of deafening the mites makes n’ expletive: it does not mean fearing that the voice would NOT deafen them. All choices are elided particles/pronouns attachable to assourdît; the stated absence of semantic negation isolates the target.')
# Existing ai auxiliary proposal has the correct three bands: use it for ai
# mesuré/vus; possessive ai in n’ai plus d’opinion keeps the published bank.
assign('ai',159,15,'earlier',0);assign('ai',164,305,'earlier',0)
# Dedicated auxiliary identity exists but these surface-specific banks currently
# test possession only. Record this dependency rather than copy mastery or
# silently reuse a lexical possession question for an auxiliary target.
for u,s in [(136,28),(164,13)]:hold('avez',u,s,'Compound avoir auxiliary. Prepare avez bank linked to sns_fr_avoir_compound_auxiliary; existing bank teaches possession only.')

items=[];review=[];holds=[];routes=[]
for spec in SPECS:
 if spec['form'] not in {i['form']for i in packet['items'][:limit]}:continue
 occurrences=[o for o in byform[spec['form']]['sourceOccurrences']if spec['occ'] is None or(o['unit'],o['start'])in spec['occ']]
 key=spec['form'].replace('’','_')+'_chapter_06_'+str(occurrences[0]['unit'])+'_'+str(occurrences[0]['start'])
 questions=[{'band':'1-3','context':occurrences[0]['context'],'question':'What does the highlighted word mean here?','targetText':occurrences[0]['text'],'answer':spec['meaning'],'choices':spec['low']}, {'band':'4-5','context':spec['middle'],'question':'Complétez la phrase.','answer':spec['form'],'choices':spec['choices']}, {'band':'6-8','context':spec['advanced'],'question':'Quel mot convient ?','answer':spec['form'],'choices':spec['choices']}]
 item={k:spec[k]for k in ['form','lemma','partOfSpeech','meaning']};item.update(key=key,status='offline_contextual_three_band_review_recorded_unpublished',sourceOccurrences=occurrences,questions=questions,reviewNote=spec['note']or f"The inspected source uses teach {spec['meaning']}. The full thought-unit early question and both French clues isolate the target by meaning; all four alternatives in each band were checked for the unchanged construction.")
 items.append(item)
 for o in occurrences:assign(spec['form'],o['unit'],o['start'],'draft',key)
 routes.append({'key':key,'form':spec['form'],'lemma':spec['lemma'],'meaning':spec['meaning'],'target':spec['target'],'questionSha256':hashv(questions),'sourceOccurrencesSha256':hashv(occurrences),'reviewNote':item['reviewNote'],'status':'explicit_identity_target_pending_final_reconciliation'})

for i in packet['items'][:limit]:
 grouped={}
 for o in i['sourceOccurrences']:
  k=(i['form'],o['unit'],o['start'])
  if k in HOLDS:kind,value='hold',HOLDS[k]
  elif i['form']in ['et','sans']:kind,value='hold','Shared published middle-band capitalization repair already impact-reviewed in Chapter V; do not apply during this package.'
  else:kind,value=EXCEPT.get(k,('earlier',EARLIER[i['form']])if i['form']in EARLIER else('published',DEFAULT.get(i['form'])))
  if value is None:raise ValueError(f'No individually selected route: {k}')
  grouped.setdefault((kind,value),[]).append(o)
 for(kind,value),occurrences in grouped.items():
  entry={'key':f"{i['form']}_{occurrences[0]['unit']}_{occurrences[0]['start']}",'form':i['form'],'sourceOccurrences':occurrences,'decision':kind}
  if kind=='published':
   c=i['publishedCandidates'][value];entry.update(identity=c['identity'],gloss=c['gloss'],questionSha256=c['questionSha256'],reviewNote=NOTES.get(i['form'],f"At these exact occurrences {i['form']} has the inspected published meaning {c['gloss']}. All three stored question contexts and their four choices were read; the selected answer is compatible with the source function. No shared bank is overwritten."))
  elif kind=='earlier':
   c=i['earlierCandidates'][value];entry.update(earlierFile=c['file'],earlierKey=c['key'],earlierFileSha256=c['fileSha256'],questionSha256=c['questionSha256'],reviewNote=EARLIER_NOTE.get(i['form'],f"The exact occurrences of {i['form']} match the earlier contextual meaning {c['meaning']}. All three existing bands and alternatives were read again; they preserve this meaning. Share the surface/sense, without copying learner progress."))
  elif kind=='draft':entry.update(proposalKey=value,reviewNote=next(it['reviewNote']for it in items if it['key']==value))
  else:entry.update(reason=value,status='unresolved_dependency_not_approved');holds.append(entry);continue
  review.append(entry)
common={k:packet[k]for k in ['version','workId','chapter','sourceSha256','unitPlanSha256','inventorySha256']}
write('chapter-06-batch-01.json',{**common,'status':'offline_individually_authored_and_reviewed_questions_unpublished','items':items})
write('chapter-06-identity-targets-01.json',{**common,'status':'explicit_editorial_targets_not_import_approval','items':routes})
counts={kind:sum(len(i['sourceOccurrences'])for i in review if i['decision']==kind)for kind in ['published','earlier','draft']}
summary={'formsConsidered':limit,'consideredUses':sum(len(i['sourceOccurrences'])for i in packet['items'][:limit]),'reviewedRouteGroups':len(review),'reviewedUses':sum(counts.values()),'reviewedPublishedUses':counts['published'],'reviewedEarlierUses':counts['earlier'],'reviewedDraftUses':counts['draft'],'contextualProposals':len(items),'newQuestionBands':len(items)*3,'heldUses':sum(len(i['sourceOccurrences'])for i in holds),'untouchedQueuedUses':1060-sum(len(i['sourceOccurrences'])for i in packet['items'][:limit]),'initialQueuedUses':1060,'queueRemoval':'deferred_until_complete_chapter_coverage'}
write('chapter-06-context-review-01.json',{**common,'status':'offline_partial_contextual_review_unpublished','packetSha256':digest('chapter-06-context-packet-01.json'),'batchSha256':digest('chapter-06-batch-01.json'),'identityTargetsSha256':digest('chapter-06-identity-targets-01.json'),'summary':summary,'items':review,'holds':holds})
covered={(o['unit'],o['start'],o['end'])for i in review for o in i['sourceOccurrences']}
nexttoken=next(t for t in read('chapter-06-inventory.json')['tokens']if(t['unit'],t['start'],t['end'])in {(o['unit'],o['start'],o['end'])for i in packet['items']for o in i['sourceOccurrences']} and(t['unit'],t['start'],t['end'])not in covered)
write('chapter-06-progress.json',{**common,'status':'partial_offline_review_remaining_contexts_and_dependencies_pending','summary':summary,'nextAction':{'form':nexttoken['form'],'unit':nexttoken['unit'],'start':nexttoken['start'],'end':nexttoken['end'],'reason':'Earliest unresolved source use; shared et/sans repairs remain deferred to complete-work reconciliation. Next actionable construction: aussi bien que at unit 134 offsets 28–42. Continue untouched forms at examiner, unit 138 offsets 151–159.'},'reviewFiles':['chapter-06-context-review-01.json'],'evidenceSha256':{f:digest(f)for f in ['chapter-06-context-packet-01.json','chapter-06-context-review-01.json','chapter-06-batch-01.json','chapter-06-identity-targets-01.json']}})
d=read('dossier.json')
for f in ['chapter-06-context-packet-01.json','chapter-06-context-review-01.json','chapter-06-batch-01.json','chapter-06-identity-targets-01.json','chapter-06-progress.json']:
 e={'role':'chapter_six_partial_offline_contextual_review','file':f,'bytes':(P/f).stat().st_size,'sha256':digest(f)}
 d['evidence']=[old for old in d['evidence']if old['file']!=f]+[e]
d['review']['chapterSix']['lexical']=f"Partial offline review: {limit} forms, {summary['reviewedUses']} reviewed source routes, {summary['heldUses']} held uses, {len(items)} vocabulary proposals/{len(items)*3} reviewed bands; candidate queue retained until complete Chapter VI coverage."
d['review']['chapterSix']['progress']={'file':'chapter-06-progress.json',**summary}
d['history'].append({'version':d['history'][-1]['version']+1,'date':'2026-09-30','reason':f"Chapter VI exact-revision work package recorded through {limit} forms: {summary['reviewedUses']} reviewed uses, {summary['heldUses']} unresolved held uses, {len(items)} contextual vocabulary proposals and {len(items)*3} bands. Existing/earlier banks were individually inspected; no learner import, shared published mutation or deployment."})
write('dossier.json',d)
print(json.dumps(summary))
