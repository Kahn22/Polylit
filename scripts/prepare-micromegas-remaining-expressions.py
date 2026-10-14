#!/usr/bin/env python3
"""Source-bound phrase triage for chapters IV–VII; unresolved identities stay pending."""
import hashlib,json,re
from pathlib import Path
folder=Path('content/sources/wrk_voltaire_micromegas')
read=lambda n:json.loads((folder/n).read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
units=read('unit-plan.json')['units']
inventories={c:read(f'chapter-0{c}-inventory.json') for c in range(4,8)}
old={}
for f in ['chapter-01-expressions-01.json','chapter-02-expressions.json','chapter-03-expressions.json']:
 for i in read(f)['items']:old.setdefault(i['key'],[]).append({'file':f,'item':i})
phrases=[
 ('d_abord',r'd’abord','link_published_locution_identity','The established published first/at first identity is suitable where the movement or perception begins.'),
 ('a_peine',r'à peine','share_chapter_two_reviewed_expression','The barely/no-sooner reading matches the reviewed chapter II temporal expression; check its precise clause relation at import.'),
 ('a_peu_pres',r'à peu près','reuse_published_approximation_identity','The magnitude is approximate, as in the earlier vocabulary decision.'),
 ('au_bout_de',r'au bout de','share_chapter_one_temporal_expression','The ten-year duration matches the already reviewed temporal expression and differs from spatial at the tip.'),
 ('faire_le_tour',r'fait le tour','share_chapter_one_travel_expression','The travelers circumnavigate the Earth, the same action tested in the earlier expression.'),
 ('sur_le_champ',r'sur-le-champ','single_orthographic_token','Immediate action is one tokenizer token and requires vocabulary treatment.'),
 ('de_sorte_que',r'de sorte que','published_expression_candidate_review','The consequence clause uses a previously published expression; inspect its full prior questions before reuse.'),
 ('bon_sens',r'bon sens','published_judgment_identity_candidate','Practical judgment rather than the sensory organ sense; check the earlier identity against both uses.'),
 ('de_quoi',r'de quoi','candidate_construction_review','Possibility or available reason differs across de quoi coucher and de quoi je doute; inspect before merging.'),
 ('faire_l_amour',r'faire l’amour','new_expression_or_separate_love_sense_pending','Sexual intimacy cannot inherit the earlier bare noun love questions without a semantic decision.'),
 ('de_nouveau',r'de nouveau','new_repetition_sense_pending','Means again, not the reformed calendar adjective drafted in chapter III.'),
 ('article_de_la_generation',r'l’article de la génération','new_topic_sense_pending','Article means matter or topic, not the previously drafted printed article.'),
 ('tout_a_l_heure',r'tout à l’heure','new_temporal_expression_pending','Refers back to a little while earlier in this exchange.'),
 ('a_la_verite',r'à la vérité','new_concessive_expression_pending','Introduces a concession before contrasting the Earth with the Sun.'),
 ('a_son_aise',r'à son aise','new_manner_expression_pending','Turning comfortably as opposed to walking.'),
 ('dessous_des_cartes',r'le dessous des cartes','new_figurative_expression_pending','Figurative hidden truth behind the newspapers’ story.'),
 ('sur_le_fait',r'sur le fait','new_caught_in_act_expression_pending','The Saturnian claims direct proof of nature’s process.'),
 ('de_bonne_foi',r'de bonne foi','new_sincerity_expression_pending','The philosopher concedes candidly that people are unhappy.'),
 ('peu_a_peu',r'Peu à peu','new_gradual_expression_pending','The conversation gradually becomes interesting.'),
 ('de_haut_en_bas',r'de haut en bas','contextual_gaze_expression_pending','The cleric looks the visitors up and down; later decide literal or contemptuous reading.'),
 ('a_la_fois',r'à la fois','new_simultaneity_expression_pending','Several speakers or actions happen at the same time.'),
 ('au_moins',r'au moins','published_minimum_expression_candidate','At least a minimum amount or certainty, pending question comparison.'),
 ('avoir_beau',r'aura beau','new_futile_attempt_expression_pending','The effort cannot change the stated result.'),
 ('de_loin',r'de loin','compositional_distance','Following at a distance is already supported by the distance adverb.'),
 ('peu_de_mots',r'en peu de mots','compositional_brevity','Ordinary quantifier plus words denotes a brief account.'),
]
items=[]
for key,pattern,decision,note in phrases:
 occurrences=[]
 for unit in units:
  if unit['chapter'] not in inventories:continue
  for match in re.finditer(pattern,unit['text'],re.I):
   occurrences.append({'chapter':unit['chapter'],'unit':unit['ordinal'],'start':match.start(),'end':match.end(),'text':match.group()})
 if not occurrences:raise ValueError(f'No source occurrences for {key}')
 item={'key':key,'surfacePattern':pattern,'decision':decision,'editorialNote':note,'occurrences':occurrences}
 if key in old:
  item['earlierDecisions']=[{'file':r['file'],'key':r['item']['key'],'disposition':r['item']['disposition'],'fileSha256':sha((folder/r['file']).read_bytes()),'questionsSha256':sha(json.dumps(r['item'].get('questions',[]),ensure_ascii=False,separators=(',',':')).encode())} for r in old[key]]
 items.append(item)
out={'version':1,'workId':'wrk_voltaire_micromegas','chapters':[4,5,6,7],'status':'source_bound_expression_triage_many_questions_and_identities_pending','sourceSha256':inventories[4]['sourceSha256'],'unitPlanSha256':inventories[4]['unitPlanSha256'],'summary':{'candidates':len(items),'phraseUses':sum(len(i['occurrences']) for i in items),'previousExpressionKeys':sum(bool(i.get('earlierDecisions')) for i in items)},'items':items}
(folder/'chapter-04-07-expressions.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(out['summary'])
