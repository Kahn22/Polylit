#!/usr/bin/env python3
"""Source-bound Chapter IV locution review, separate from component token identities."""
import hashlib
import json
from pathlib import Path

p = Path('content/sources/wrk_voltaire_micromegas')
read = lambda name: json.loads((p / name).read_text())
inv = read('chapter-04-inventory.json')
units = read('unit-plan.json')['units']
sha = lambda name: hashlib.sha256((p / name).read_bytes()).hexdigest()
# key | source phrase | units | contextual meaning | four English choices | middle cloze | three French alternatives | upper contrast
lines = '''
pieds_de_roi|pieds de roi|86|historic royal feet as a length measure|historical length units/a monarch’s servants/books by a king/parts of a throne|La taille est exprimée en anciennes unités de longueur : en ___.|bras de roi/voix de roi/gestes de roi|Pieds de roi mesure une longueur de douze pouces par pied; les autres groupes nomment des êtres, des paroles ou des mouvements.
a_la_verite|à la vérité|87|in truth; as a corrective concession|in truth/on the left/with difficulty/at sunset|___, c’est la Terre qui fait ce voyage et non le Soleil.|à contre-cœur/à l’aveugle/à pas lents|À la vérité introduit la correction de l’affirmation sur le Soleil; les autres locutions concernent la réticence, l’absence de vue et la lenteur.
a_son_aise|à son aise|87|comfortably; with ease|comfortably/under constraint/in panic/without seeing|Tourner ainsi est plus commode que marcher : on va ___.|à grand-peine/à reculons/à l’aveugle|À son aise qualifie une manière confortable; à grand-peine indique la difficulté, à reculons la direction et à l’aveugle l’absence de vue.
de_facon_que|de façon que|96|so that; with the result that|with the result that/because of/although/before|La planète tourne gauchement, ___ ses régions polaires restent incultes.|bien que/parce que/avant que|De façon que introduit le résultat; bien que concède, parce que explique la cause et avant que marque l’antériorité.
en_verite|En vérité|97|in truth; truly|in truth/by accident/in silence/at dawn|___, je pense qu’il n’y a personne ici.|Par hasard/En silence/Au matin|En vérité renforce l’affirmation du locuteur; les autres locutions indiquent le hasard, le silence ou le matin.
non_plus|non plus|97|not either; not also|not either/much more/at once/ever again|Ces habitants ne seraient peut-être pas raisonnables ___.|davantage/à jamais/tout de suite|Non plus ajoute un autre élément nié; davantage augmente, à jamais indique la durée et tout de suite l’immédiateté.
pour_rien|pour rien|98|for no purpose; in vain|for no purpose/for payment/for everyone/for a journey|Si ce monde n’a aucun but, il a été fait ___.|pour tous/pour l’argent/pour demain|Pour rien signifie sans but dans ce passage; pour tous nomme les destinataires, pour l’argent un gain et pour demain un moment.
par_bonheur|par bonheur|103|fortunately; by good luck|fortunately/by force/in anger/with delay|___, le collier se brisa et la dispute s’arrêta.|Par force/Par colère/Par retard|Par bonheur présente une chance favorable; force est une contrainte, colère une émotion et retard un délai.
il_y_a|il y a|98,100|there is; there are|there is/he owns/he remembers/he travels|On constate la présence d’un peu de confusion : ___ de la confusion.|il possède/il oublie/il voyage|Il y a affirme une existence; il possède attribue une propriété, il oublie perd le souvenir et il voyage se déplace.
dessous_des_cartes|le dessous des cartes|114|the hidden workings of an affair|hidden facts behind the story/the underside of a map/a ship’s deck/a stack of letters|La version des journaux cache peut-être des faits : on ignore ___.|le bord des mers/le titre des journaux/le nom des marins|Le dessous des cartes désigne les ressorts secrets d’une affaire; les autres groupes nomment une côte, un titre ou des personnes.
sans_y_rien_mettre_du_mien|sans y rien mettre du mien|115|without adding anything of my own|without adding my own inventions/without speaking aloud/without leaving home/without reading the news|Je rapporterai seulement ce qui s’est passé, ___.|sans rien voir de loin/sans sortir de chez moi/sans lire les gazettes|Sans y rien mettre du mien promet de ne rien ajouter de personnel au récit; les autres expressions portent sur la vue, le déplacement et la lecture.
'''
tokens = {(t['unit'], t['start'], t['end']): t for t in inv['tokens']}
items = []
for line in lines.strip().splitlines():
    key, pattern, unit_numbers, meaning, english, middle, french, upper = line.split('|')
    occurrences = []
    components = []
    for number in map(int, unit_numbers.split(',')):
        unit = units[number - 1]
        start = unit['text'].index(pattern)
        end = start + len(pattern)
        occurrences.append({'chapter': 4, 'unit': number, 'start': start, 'end': end, 'text': pattern})
        components += [{'chapter': 4, 'unit': number, 'start': t['start'], 'end': t['end'], 'text': t['text'], 'form': t['form']} for t in inv['tokens'] if t['unit'] == number and start <= t['start'] and t['end'] <= end]
    en = english.split('/')
    fr = [pattern, *french.split('/')]
    assert len(en) == len(fr) == 4 and all(len(set(choices)) == 4 for choices in (en, fr))
    questions = [
        {'band': '1-3', 'context': units[occurrences[0]['unit'] - 1]['text'], 'question': 'What does the phrase mean here?', 'answer': en[0], 'choices': en},
        {'band': '4-5', 'context': middle, 'question': 'Complétez la phrase.', 'answer': pattern, 'choices': fr},
        {'band': '6-8', 'context': upper, 'question': f'Quelle locution signifie {meaning.split(";")[0]} ?', 'answer': pattern, 'choices': fr},
    ]
    assert middle.count('___') == 1
    items.append({'key': key, 'surfacePattern': pattern, 'meaning': meaning, 'partOfSpeech': 'locution', 'decision': 'new_expression_three_question_bands_pending_complete_work_import', 'sourceOccurrences': occurrences, 'componentTokens': components, 'questions': questions, 'reviewNote': f'In chapter IV {occurrences[0]["unit"]}:{occurrences[0]["start"]}, {pattern} means {meaning}. The three bands contrast this phrase with separate constructions; token components retain their own exact dispositions.'})
assert len(items) == 11
out = {'version': 1, 'workId': inv['workId'], 'chapter': 4, 'status': 'source_bound_chapter_four_expression_review_unpublished', 'sourceSha256': inv['sourceSha256'], 'unitPlanSha256': inv['unitPlanSha256'], 'inventorySha256': sha('chapter-04-inventory.json'), 'items': items}
(p / 'chapter-04-final-expressions.json').write_text(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print(len(items), 'expressions', len(items) * 3, 'question bands', sum(len(i['componentTokens']) for i in items), 'component occurrences')
