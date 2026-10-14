"""Apply individually reviewed Chapter V revisions; never approve learner content."""
import copy
import hashlib
import json
from pathlib import Path

P = Path(__file__).resolve().parents[1] / 'content/sources/wrk_voltaire_micromegas'
read = lambda n: json.loads((P / n).read_text())
write = lambda n, d: (P / n).write_text(json.dumps(d, ensure_ascii=False, indent=2) + '\n')
units = {u['ordinal']: u['text'] for u in read('unit-plan.json')['units']}
files = [f'chapter-05-batch-{n:02}.json' for n in range(1, 7)] + [f'chapter-05-held-batch-{n:02}.json' for n in (1, 2)]
batches = {n: read(n) for n in files}
changes = []

# Each clue below was compared with all four choices, not just with the answer.
middle = {
 'étendit': 'Pour atteindre le navire, il ___ la main en allongeant le bras.',
 'endroit': 'Le lieu précis où apparaît le navire est l’___ qu’il regarde.',
 'objet': 'Il distingue une chose matérielle : un ___ apparaît sous ses yeux.',
 'paraissait': 'L’objet restait visible : il ___ dans le champ du microscope.',
 'avançant': 'En ___ les doigts vers le navire, il les rapproche de lui.',
 'doigts': 'Au bout de sa main, il allonge deux ___ pour saisir le navire.',
 'retirant': 'En les ___ vers lui, il éloigne ses doigts du navire.',
 'adroitement': 'Avec beaucoup d’habileté, il saisit le navire ___.',
 'vaisseau': 'Le ___ transporte ces voyageurs sur la mer.',
 'ongle': 'La lame dure au bout de son doigt est son ___.',
 'presser': 'Pour ne pas l’écraser par une pression excessive, il évite de trop ___ le navire.',
 'écraser': 'Une pression trop forte pourrait l’___ et le réduire en morceaux.',
 'différent': 'Ce nouvel animal n’est pas semblable au premier : il est bien ___ de lui.',
 'creux': 'Il dépose le navire dans le ___ de sa main, sa partie concave.',
 'passagers': 'Les voyageurs transportés par le navire, sans appartenir à son équipage, sont les ___.',
 'crus': 'Ils avaient tenu cette explication pour vraie : ils s’étaient ___ enlevés par un ouragan.',
 'enlevés': 'Ils pensaient avoir été ___ par le vent, arrachés à leur place et emportés.',
 'ouragan': 'Ils imaginent un ___, tempête caractérisée par des vents extrêmement violents.',
 'croyaient': 'Ils imaginaient, à tort, être sur un rocher : ils se ___ sur une espèce de rocher.',
 'espèce': 'Ce n’est pas vraiment un rocher, mais quelque chose de ce genre : une ___ de rocher.',
 'mouvement': 'Ils cessent de rester immobiles et se mettent en ___.',
 'matelots': 'Les ___, marins chargés de manœuvrer le navire, saisissent les tonneaux.',
 'prennent': 'Avant de les lancer, les matelots ___ les tonneaux en les saisissant.',
 'tonneaux': 'Ils transportent le vin dans des ___, grands récipients de bois à douves.',
 'vin': 'Les tonneaux contiennent du ___, boisson alcoolisée obtenue par fermentation du raisin.',
 'jettent': 'Ils lancent les tonneaux : ils les ___ sur la main du géant.',
 'précipitent': 'Ils se ___ après les tonneaux, en se lançant à leur suite avec hâte.',
 'géomètres': 'Les ___ sont des savants spécialisés dans la mesure des figures et des angles.',
 'descendent': 'Ils vont vers le bas : les géomètres ___ du navire jusqu’aux doigts.',
 'remuer': 'Il sent quelque chose ___, se mouvoir contre ses doigts.',
 'bâton': 'La longue tige rigide qu’ils poussent est un ___ ferré.',
 'enfonçait': 'On lui ___ un bâton dans le doigt, en le poussant à l’intérieur.',
 'picotement': 'Comme de petites piqûres, un ___ se fait sentir au doigt.',
 'soupçonna': 'Il ne se douta de rien de plus : il n’en ___ pas davantage.',
 'prétends': 'Mon intention n’est pas de les offenser : je ne ___ pas choquer ces lecteurs.',
 'choquer': 'Le narrateur évite de ___ leur vanité, c’est-à-dire de blesser leur amour-propre.',
 'prier': 'Je souhaite leur adresser une demande polie : je vais ___ les lecteurs de réfléchir.',
 'remarque': 'Cette brève observation sur notre taille est une petite ___.',
 'faisons': 'Nous représentons une présence minuscule sur Terre : nous y ___ une toute petite figure.',
 'millième': 'Un pouce est divisé en six cent mille parts égales : chacune est sa six cent ___ partie.',
 'substance': 'Le philosophe nomme ___ cet être hypothétique, distinct d’un objet fabriqué.',
 'nôtres': 'Il compare ses organes à ceux qui nous appartiennent, aux ___.',
 'prie': 'Je vous adresse une demande polie : je vous ___ de considérer cette idée.',
 'penseraient': 'Quelle opinion ces êtres auraient-ils de nous ? Que ___-ils de nos batailles ?',
 'batailles': 'Ces affrontements entre armées, ces ___, n’apportent qu’un village au vainqueur.',
 'infiniment': 'À l’échelle du géant, leur petitesse semble sans limite : ils sont ___ petits.',
 'hausse': 'Pour en augmenter la hauteur, le capitaine ___ les bonnets de deux pieds.',
 'adresse': 'Le maniement habile du microscope exige une grande ___.',
 'merveilleuse': 'Cette habileté suscite l’admiration par son caractère extraordinaire : elle est ___.',
 'atomes': 'À l’échelle du géant, les hommes ressemblent à des particules minuscules, à des ___.',
 'viens': 'J’en ai parlé à l’instant : je ___ de parler de ces êtres.',
 'premiers': 'Avant tous les autres observateurs, ils ont vu cette graine les ___.',
 'crurent': 'Ils tinrent cette observation incertaine pour vraie : ils ___ voir une graine.',
 'graine': 'Selon leur ancienne hypothèse, les hommes proviendraient d’une ___, comme une plante issue de sa semence.',
 'découverte': 'Trouver un fait scientifique jusque-là inconnu serait faire une ___.',
 'machines': 'Le géant compare les humains à de petits mécanismes en action, à des ___.',
 'tours': 'Il observe leurs gestes et leurs changements de position, tous leurs ___.',
 'opérations': 'Il suit les actions qu’ils accomplissent, toutes leurs ___.',
 'disaient': 'Les voyageurs prononçaient ces mots à voix haute : ils ___ « Je les vois ! ».',
 'portent': 'Ces hommes ___ des fardeaux en les transportant sur leurs épaules.',
 'fardeaux': 'Les charges pesantes qu’ils transportent sur leurs épaules sont des ___.',
 'baissent': 'Ils se ___ : ils inclinent le corps vers le sol pour saisir une charge.',
 'relèvent': 'Après s’être penchés, ils se ___ et reprennent une position droite.',
 'parlant': 'En ___ ainsi, ils prononcent des mots pendant leur observation.',
 'objets': 'Les choses matérielles qu’ils voient, ces ___, les étonnent.',
 'passant': 'En ___ de la défiance à la crédulité, il abandonne une attitude pour l’autre.',
 'crut': 'Il pensa voir un phénomène sans en être certain : il ___ l’apercevoir.',
 'travaillaient': 'Il les croyait occupés à cette activité : ils ___ à la propagation.',
 'propagation': 'Il pense que ces êtres se reproduisent : il croit assister à leur ___.',
 'serve': 'Pour observer avec cet instrument, il faut qu’on se ___ d’un microscope.',
 'encore': 'Il répète son geste : il pose le navire ___ sur son ongle.',
 'pied': 'Cette ancienne unité de longueur vaut douze pouces : c’est un ___.',
 'prise': 'La baleine est visible, mais les hommes restent indiscernables : le microscope n’a pas de ___ sur eux.',
 'prenant': 'En ___ la taille humaine comme donnée de sa comparaison, il la choisit comme point de départ.',
 'figure': 'Notre taille nous donne une présence visuelle minuscule : nous faisons une bien petite ___.',
 'petits': 'À cette échelle ils sont minuscules : ils resteront des infiniment ___.',
 'donc': 'Quelle adresse ne fallut-il ___ pas ! La question insiste sur cette habileté extraordinaire.',
 'faire': 'Pour formuler cette observation, le narrateur veut ___ une remarque.',
 'perdre': 'Après la conquête, le village échappe à son contrôle : le vainqueur finit par le ___.',
 'jamais': 'Si tu lis ___ ce livre, un jour quelconque, tu comprendras cette remarque.',
 'firent': 'Ils réalisèrent cette découverte : ils ___ une découverte scientifique.',
 'sentit': 'Micromégas ___ un grand plaisir, éprouvant de la joie en les voyant.',
 'font': 'Ces batailles causent la conquête : elles ___ gagner un village au vainqueur.',
 'doute': 'Je suis certain de cette réaction : je ne ___ pas que le capitaine réagisse ainsi.',
}
choice_edits = {
 'objet': ['objet', 'départ', 'calcul', 'trajet'],
 'prier': ['prier', 'forcer', 'empêcher', 'dispenser'],
 'prie': ['prie', 'ordonne', 'défends', 'dispense'],
 'passant': ['passant', 'restant', 'dormant', 'songeant'],
 'doute': ['doute', 'crois', 'pense', 'suppose'],
 'terre': ['Terre', 'Lune', 'France', 'Grèce'],
 'portait': ['portait', 'quittait', 'suivait', 'évitait'],
}
for name, batch in batches.items():
 for item in batch['items']:
  old = copy.deepcopy(item)
  form = item['form']
  # Complete authorial thought units replace broken character-window excerpts.
  item['questions'][0]['context'] = units[item['sourceOccurrences'][0]['unit']]
  item['questions'][0]['targetText'] = item['sourceOccurrences'][0]['text']
  item['questions'][0]['question'] = 'What does the highlighted word mean here?'
  if form in middle:
   item['questions'][1]['context'] = middle[form]
  if form in choice_edits:
   for q in item['questions'][1:]: q['choices'] = choice_edits[form]
  if form == 'ferait': item['key'] = 'faire_ferait_chapter_05_held_01_122'
  if form == 'trompait': item['lemma'] = 'se tromper'
  if form == 'prétends':
   item['meaning'] = 'intend; have the intention of'
   q = item['questions'][0]; q['answer'] = 'intend'; q['choices'] = ['intend', 'refuse', 'remember', 'finish']
  if form == 'premiers':
   item['partOfSpeech'] = 'ordinal adjective masculine plural used adverbially'
   item['meaning'] = 'first; before the other observers'
   q = item['questions'][0]; q['answer'] = 'first; before the others'; q['choices'] = ['first; before the others', 'last; after the others', 'at the same time as everyone', 'without seeing anything']
   item['questions'][2]['context'] = 'Ils ont été les premiers observateurs à voir cette graine, avant tous les autres.'
  if form == 'terre':
   item['questions'][1]['context'] = 'Le nom de notre planète est la ___. Ce n’est ni un satellite ni un pays.'
   item['questions'][2]['context'] = 'Quel nom désigne la planète habitée par les humains, et non un pays ou un satellite ?'
  if form == 'pied': item['questions'][2]['context'] = 'Cette ancienne unité de longueur comprend exactement douze pouces.'
  if form == 'doute': item['questions'][2]['context'] = 'Quel verbe signifie avoir des incertitudes, dans la première personne « je ... » ?'
  if form == 'dont':
   item['meaning'] = 'of which; about which or from which'
   item['questions'][0]['choices'] = ['about which; from which', 'to which; towards which', 'where', 'when']
  if form == 'perdre':
   item['meaning'] = 'lose possession or control of'
   item['sourceOccurrences'] = [o for o in item['sourceOccurrences'] if o['unit'] == 123]
   item['questions'][2]['context'] = 'Après la conquête, le vainqueur cesse de posséder le village. Quel verbe décrit ce résultat ?'
   item['editorialNote'] = 'Loss of possession is separate from losing sight of the observed beings at unit 129.'
  if form == 'portait': item['questions'][2]['context'] = 'Le navire transportait les voyageurs; quel verbe exprime cette fonction ?'
  if old != item:
   changes.append({'file': name, 'key': item['key'], 'beforeSha256': hashlib.sha256(json.dumps(old, ensure_ascii=False, sort_keys=True, separators=(',', ':')).encode()).hexdigest(), 'reason': 'Complete source context, exclusive semantic clue, agreement-compatible alternatives, and contextual sense separation reviewed individually.'})

held3 = {k: v for k, v in batches['chapter-05-held-batch-02.json'].items() if k != 'items'}
held3['items'] = []
inventory = read('chapter-05-inventory.json')
def add(key, form, lemma, pos, meaning, unit, start, early, early_choices, context, choices, high, note):
 token = next(t for t in inventory['tokens'] if t['unit'] == unit and t['start'] == start)
 assert token['form'] == form
 held3['items'].append({'key': key, 'form': form, 'lemma': lemma, 'partOfSpeech': pos, 'meaning': meaning,
  'sourceOccurrences': [{'chapter': 5, 'unit': unit, 'start': start, 'end': token['end'], 'text': token['text']}],
  'status': 'offline_contextual_question_draft_pending_editorial_review', 'editorialNote': note,
  'questions': [
   {'band': '1-3', 'context': units[unit], 'targetText': token['text'], 'question': 'What does the highlighted word mean here?', 'answer': early, 'choices': early_choices},
   {'band': '4-5', 'context': context, 'question': 'Complétez la phrase.', 'answer': form, 'choices': choices},
   {'band': '6-8', 'context': high, 'question': 'Quel mot convient ?', 'answer': form, 'choices': choices}]})
add('en_figure_anaphor', 'en', 'en', 'anaphoric pronoun', 'one; referring back to a figure or showing', 122, 260,
 'one; referring back to such a figure', ['one; referring back to such a figure', 'there; referring to a place', 'they; referring to people', 'then; referring to a time'],
 'Cet animal ferait une petite figure; il ___ ferait une sur cette boule, en reprenant le nom « figure ».', ['en', 'y', 'lui', 'leur'],
 'Quel pronom reprend « des figures » dans « Il ... ferait une », en laissant la quantité exprimée ? ',
 'En resumes the nominal figure in the comparison; this is an anaphoric quantitative pronoun, not the preposition en or a source-of-motion use. Académie 9e en, section III, supports the construction; identifying figure as antecedent is the contextual editorial inference.')
add('faire_impersonal_happen', 'faire', 'faire', 'infinitive in impersonal se faire', 'happen; be the case in an impersonal possibility construction', 123, 146,
 'happen; be the case', ['happen; be the case', 'manufacture an object', 'say aloud', 'remember the past'],
 'Il est possible que cela arrive : il peut se ___ qu’ils existent.', ['faire', 'dire', 'croire', 'rappeler'],
 'Quel infinitif exprime qu’une situation peut se produire, dans « Il peut se ... que cela arrive » ?',
 'The historical il se peut faire que means it may happen or be the case. Preserve the printed order and modifier très-bien in the source; the new middle context uses contemporary word order. Académie 1694 pouvoir explicitly records il se peut faire que.')
add('pris_caught_in_act', 'pris', 'prendre', 'past participle masculine singular', 'caught; surprised in the act', 131, 23,
 'caught; surprised in the act', ['caught; surprised in the act', 'held in his hand', 'lost from view', 'invented from nothing'],
 'Je l’ai surpris pendant son action : je l’ai ___ sur le fait.', ['pris', 'perdu', 'laissé', 'caché'],
 'Quel participe exprime avoir surpris quelqu’un pendant son action, dans « Je l’ai ... sur le fait » ?',
 'Prendre sur le fait means catch in the act, not grasp a physical object. The nature example is figurative observation; keep the linked sur_le_fait phrase span as well. Académie 1835 prendre records the surprise-in-action sense.')
add('perdre_lose_sight', 'perdre', 'perdre', 'infinitive', 'lose sight of', 129, 118,
 'lose sight of', ['lose sight of', 'win a contest', 'keep in view', 'protect from danger'],
 'Les savants ne les verraient plus : ils risqueraient de les ___.', ['perdre', 'garder', 'suivre', 'protéger'],
 'Les êtres minuscules disparaissent de leur champ de vision. Quel verbe indique qu’ils ne les voient plus ?',
 'Losing sight of the tiny beings differs from surrendering possession of a village; no mastery is shared across those two contextual meanings.')
batches['chapter-05-held-batch-03.json'] = held3
for name, data in batches.items(): write(name, data)

exp = read('chapter-05-expression-review.json')
exp_middle = {
 'a_peine': 'La baleine reste presque invisible : le microscope permet ___ de la distinguer.',
 'sur_le_fait': 'Le savant croit surprendre la nature pendant son action même : il la surprend ___.',
 'a_la_fois': 'Leurs paroles sont simultanées : les deux voyageurs s’écrient ___ « Je les vois ! ».',
 'au_moins': 'Deux pieds sont le minimum : il rehausserait les bonnets de deux pieds ___.',
 'avoir_beau': 'Quels que soient ses efforts futurs, rien ne changera : il ___, ils resteront petits.',
}
for item in exp['items']:
 if item['key'] in exp_middle: item['questions'][1]['context'] = exp_middle[item['key']]
 # The English effort distractor overlapped barely in this example.
 if item['key'] == 'a_peine': item['questions'][0]['choices'][-1] = 'not at all'
write('chapter-05-expression-review.json', exp)
routes = read('chapter-05-held-resolution.json')
routes['expressionReviewSha256'] = hashlib.sha256((P / 'chapter-05-expression-review.json').read_bytes()).hexdigest()
write('chapter-05-held-resolution.json', routes)
write('chapter-05-question-corrections.json', {'version': 1, 'workId': inventory['workId'], 'chapter': 5,
 'status': 'offline_editorial_revision_log_not_learner_approval', 'sourceSha256': inventory['sourceSha256'],
 'unitPlanSha256': inventory['unitPlanSha256'], 'items': changes,
 'additionalDecisions': ['Three remaining construction drafts authored.', 'Perdre possession and perdre sight split into separate senses.', 'Premiers is ordinal priority of observation, not arrival.', 'Prétends tests intention without conflating assertion.', 'Expression clues select a sole answer and preserve printed spans.']})
print(len(changes), 'revised word drafts; four held drafts added; expression clues corrected')
