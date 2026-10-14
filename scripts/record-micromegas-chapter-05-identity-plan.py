"""Record contextual decisions after inspecting published and earlier sense candidates."""
import hashlib
import json
from collections import Counter
from pathlib import Path

P = Path(__file__).resolve().parents[1] / 'content/sources/wrk_voltaire_micromegas'
read = lambda n: json.loads((P / n).read_text())
sha = lambda b: hashlib.sha256(b).hexdigest()
packet = read('chapter-05-identity-packet.json')
# Values are unique sense identifiers or unique prefixes in the reviewed packet.
links = {
 'étendit': 'sns_cendrillon_etendre_faire_', 'endroit': 'sns_zola_endroit_place',
 'ouvrant': 'sns_parure_ouvrir_faire_', 'serrant': 'sns_fr_serrer_tighten',
 'ongle': 'sns_parure_ongle_lame_', 'crus': 'sns_croire_primary', 'croyaient': 'sns_croire_primary',
 'prennent': 'sns_parure_prendre_saisir_', 'jettent': 'sns_parure_jeter_lancer_',
 'descendent': 'sns_parure_descendre_aller_', 'prier': 'sns_fr_prier_request', 'tenir': 'sns_tenir_hold',
 'prie': 'sns_fr_prier_request', 'penseraient': 'sns_fr_penser_think', 'lit': 'sns_zola_lire_read',
 'avertis': 'sns_cendrillon_avertir_informer_', 'merveilleuse': 'sns_parure_merveilleux_wonderful_',
 'viens': 'sns_fr_venir_recent_past', 'premiers': 'sns_premier_primary', 'crurent': 'sns_croire_primary',
 'étonnante': 'sns_parure_etonnant_qui_', 'examinant': 'sns_zola_examiner_inspect',
 'disaient': 'sns_dire_primary', 'portent': 'sns_parure_porter_soutenir_',
 'relèvent': 'sns_cendrillon_relever_lever_', 'parlant': 'sns_zola_parler_speak',
 'nouveaux': 'sns_fr_nouveau_new', 'crut': 'sns_croire_primary', 'travaillaient': 'sns_fr_travailler_work',
 'trompait': 'sns_fr_se_tromper_mistake', 'portait': 'sns_parure_porter_soutenir_',
 'dont': 'sns_zola_dont_whose_of_which', 'perdre': 'sns_fr_perdre_lose_possession',
 'ait': 'sns_fr_avoir_existential', 'font': 'sns_faire_causative', 'ai': 'sns_fr_avoir_compound_auxiliary',
 'suivant': 'sns_fr_suivre_gaze', 'en': 'sns_fr_en_pronominal_reference',
 'sentit': 'sns_parure_sentir_recevoir_',
}
# Same meaning, different morphology or additional exact uses in this chapter.
prior = {
 'doigts': (4, 'doigt_literal'), 'adroitement': (4, 'adroitement_deftly'),
 'vaisseau': (4, 'vaisseau_ship'), 'peur': (3, 'peur_fear'), 'différent': (2, 'different_distinct'),
 'espèce': (2, 'espece_kind_of'), 'mouvement': (4, 'mouvement_movement'),
 'géomètres': (1, 'géomètres_geometry'), 'remuer': (4, 'remuait_was_moving'),
 'jugea': (4, 'jugeait_was_judging'), 'soupçonna': (4, 'soupconner_to_suspect'),
 'concevez': (1, 'concevons_imagine'), 'baissent': (4, 'baisserent_bent_down'),
 'serve': (1, 'servait_used'), 'terre': (1, 'terre_planet_earth'), 'pied': (1, 'pieds_length_measure'),
 'comme': (4, 'comme_exclamative'),
}
within = {'objets': 'objet_chapter_05_116', 'ferait': 'faire_chapter_05_04_faisons'}
distinct = {
 'paraissait': 'The ship appears visibly at a spot, rather than seeming to have a property or presenting oneself at court.',
 'équipage': 'A ship’s serving personnel differ from the earlier equipages, which name travel conveyances.',
 'mettent': 'Se mettre en mouvement expresses setting oneself in motion, not the infinitival beginning construction se mettre à.',
 'prétends': 'The narrator disclaims an intention to offend, unlike the earlier prétendre claim or assertion.',
 'faisons': 'Faire figure expresses the visual showing of a body at a relative scale, not fabrication, social rank or the earlier social impression.',
 'substance': 'The hypothetical huge being differs from Chapter II’s abstract kinds of fundamental reality; retain a distinct contextual sense on the earlier proposed lemma.',
 'atomes': 'The humans are metaphorically tiny beings; Chapter II’s atom is a theoretical small material particle.',
 'formés': 'The humans came into being; this is not cultivation or development of a mind in the earlier former sense.',
 'tours': 'The little beings’ gestures and maneuvers differ from a circumference, full circuit, stroll or turn on an occasion.',
 'pouce': 'This historical inch is a length measure, unlike the opposable finger called pouce in Chapter IV.',
 'passant': 'A transition between attitudes differs from physical travel, elapsed time or an event taking place.',
 'apparences': 'These outward appearances can deceive an observer; the Chapter IV singular refers to apparent likelihood of inhabitants.',
 'messieurs': 'The plural polite reference to the men aboard is not the singular direct-address title Mr or sir.',
 'encore': 'This source repeats placement on the nail; published intermediate and advanced questions teach continued waiting, so repetition needs its own sense.',
 'prise': 'A microscope’s resolving purchase on a tiny object differs from an electrical outlet and the unrelated past participle prise.',
 'prenant': 'The narrator takes the human height as a starting datum, rather than grasping a physical object or adopting an official measure.',
 'figure': 'The comparative figure is apparent size at a scale; published face/social standing and earlier social impression questions are different.',
 'partie': 'An explicitly measured fractional part of an inch differs from the published incomplete-realization locution en partie.',
 'ouvrage': 'The captain can read this written work; published ouvrage teaches work or task, rather than a book.',
 'troupe': 'The captain’s grenadiers form a military troop, whereas all published three-band contexts describe a theatrical company.',
 'petits': 'Des infiniment petits names tiny beings by substantivization, unlike adjectival small rooms or low social status.',
 'donc': 'The rhetorical question uses emphatic then, not a logical therefore consequence taught by the published bank.',
 'faire': 'Faire une remarque expresses formulating an observation, distinct from plain doing, physical manufacture and causative faire.',
 'jamais': 'Under si the adverb means ever on a possible occasion; all three published bands test never under negation.',
 'firent': 'Faire une découverte expresses making a discovery, not the stored doing an activity or stipulating a condition.',
 'soit': 'Soit que … ou non introduces an alternative regardless of which applies; neither the être verb nor the assent interjection belongs to this lemma.',
}
by_key = {i['key']: i for i in packet['items']}
items = []
for candidate in packet['items']:
 form, key = candidate['form'], candidate['key']
 out = {k: candidate[k] for k in ('key', 'form', 'lemma', 'meaning', 'batchFile', 'questionSha256', 'sourceOccurrencesSha256')}
 out['sourceUseCount'] = len(candidate['sourceOccurrences'])
 if key == 'perdre_lose_sight':
  out.update(route='new_sense_existing_lemma', targetLemmaId='lem_zola_perdre',
             rationale='Lose sight of the tiny objects is a visibility sense, separate from losing possession of the village and ruining someone.')
 elif key == 'faire_impersonal_happen':
  out.update(route='new_sense_existing_lemma', targetLemmaId='lem_faire',
             rationale='Historical impersonal se faire que means happen or be the case; the existing reflexive form/arise definition concerns formation, not propositional possibility.')
 elif key == 'pris_caught_in_act':
  out.update(route='new_sense_existing_lemma', targetLemmaId='lem_prendre',
             rationale='Taking nature sur le fait is catching or surprising it in action, distinct from literal capture, trickery, note-taking and grasping.')
 elif form in within:
  dependency = by_key[within[form]]
  assert dependency['lemma'] == candidate['lemma']
  out.update(route='link_planned_chapter_five_sense', dependsOn='chapter-05-identity-plan.json:' + dependency['key'],
             rationale='This inflected surface shares the same contextual meaning as the named Chapter V proposal; reuse its sense while retaining form-specific questions.')
 elif form in prior:
  chapter, prior_key = prior[form]
  dependency = next(i for i in candidate['relatedEarlierPlans'] if i['chapter'] == chapter and i['key'] == prior_key)
  out.update(route='link_planned_earlier_sense', dependsOn=f'chapter-{chapter:02}-identity-plan.json:{prior_key}',
             rationale=f'The source meaning {candidate["meaning"]} matches the reviewed earlier meaning {dependency["meaning"]}; morphology alone does not create a new sense.')
  out['questionReconciliation'] = 'Reuse earlier three bands if the surface is identical; otherwise retain the reviewed new surface questions. Exact whole-work question selection remains an import dependency.'
 elif form in links:
  matches = [(lemma, sense) for lemma in candidate['publishedLemmaCandidates'] for sense in lemma['senses'] if sense['senseId'].startswith(links[form])]
  assert len(matches) == 1, (form, matches)
  lemma, sense = matches[0]
  exact = [x for x in candidate['publishedExact'] if x['identity'].endswith(':' + sense['senseId']) and x['questionIds']]
  out.update(route='link_published_sense', targetLemmaId=lemma['lemmaId'], targetSenseId=sense['senseId'],
             rationale=f'The source meaning {candidate["meaning"]} fits the inspected definition {sense["definition"]}; grammar changes the surface, not the shared meaning.')
  if exact:
   out['existingIdentity'] = exact[0]['identity']
   out['questionReconciliation'] = 'Reuse the existing reviewed bank; this draft is contextual evidence, not permission to overwrite the published questions.'
  if form == 'sentit':
   out['route'] = 'published_question_repair_pending'
   out['rationale'] = 'The published sense definition includes experiencing an emotion, but its exact sentit early question incorrectly answers to smell. Keep the shared sense; impact-review and repair its bank before importing this occurrence.'
 elif form in distinct:
  candidates = candidate['publishedLemmaCandidates']
  compatible = [l for l in candidates if l['partOfSpeech'] not in ('interjection',)]
  if compatible:
   out.update(route='new_sense_existing_lemma', targetLemmaId=compatible[0]['lemmaId'], rationale=distinct[form])
  elif candidate['relatedEarlierPlans']:
   dependency = candidate['relatedEarlierPlans'][0]
   out.update(route='new_sense_planned_earlier_lemma', dependsOn=f'chapter-{dependency["chapter"]:02}-identity-plan.json:{dependency["key"]}', rationale=distinct[form])
  else:
   out.update(route='new_lemma_and_sense', intendedSenseGroup=f'{candidate["lemma"]}:{key}', rationale=distinct[form])
 else:
  assert not candidate['publishedLemmaCandidates'] and not candidate['relatedEarlierPlans'], key
  out.update(route='new_lemma_and_sense', intendedSenseGroup=f'{candidate["lemma"]}:{key}',
             rationale=f'No published French lemma or earlier planned matching meaning was found. The exact source uses teach {candidate["meaning"]}; propose this lemma and sense for complete-work reconciliation.')
 out['status'] = 'offline_identity_route_pending_complete_work_import'
 items.append(out)
assert len(items) == len({i['key'] for i in items}) == 137
output = {'version': 1, 'workId': packet['workId'], 'chapter': 5,
 'status': 'reviewed_offline_contextual_identity_plan_unpublished',
 'sourceSha256': packet['sourceSha256'], 'unitPlanSha256': packet['unitPlanSha256'],
 'identityPacketSha256': sha((P / 'chapter-05-identity-packet.json').read_bytes()),
 'summary': dict(Counter(i['route'] for i in items)), 'items': items,
 'note': 'Routes preserve lemma ownership and surface-plus-sense mastery. New senses begin only on viewed occurrences after a future import. No published mutation or learner import occurs here.'}
(P / 'chapter-05-identity-plan.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(output['summary'])
