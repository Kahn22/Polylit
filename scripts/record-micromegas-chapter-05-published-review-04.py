#!/usr/bin/env python3
"""Review lower frequency Chapter V identities and retain contextual holds."""
import hashlib
import json
from pathlib import Path

base=Path(__file__).resolve().parents[1]/'content/sources/wrk_voltaire_micromegas'
read=lambda f:json.loads((base/f).read_text())
inv=read('chapter-05-inventory.json');packet=read('chapter-04-07-published-candidates.json')
by_form={i['form']:i for i in packet['items']}
previous=[read(f'chapter-05-published-reuse-review-{n:02}.json') for n in (1,2,3)]
prior_assigned={(o['unit'],o['start'],o['end']) for review in previous for i in review['items'] for o in i['sourceOccurrences']}
prior_held={(h['unit'],h['start'],h['end']) for review in previous for h in review['holds']}
assert not (prior_assigned & prior_held)

SELECTIONS={
 'ah':'sns_zola_ah_emotion','ainsi':'sns_ainsi_primary',
 'après':'sns_zola_apres_following','avait':'sns_avoir_primary',
 'cent':'sns_parure_cent_quatre_vingt_dix_neuf_plus_un_soit_dix_fois_dix_correspondant_au_nombre_100_ad112dfd8a',
 'cet':'sns_ce_primary','cinq':'sns_parure_cinq_five_850cc1a8aa',
 'davantage':'sns_cendrillon_davantage_plus_82ff461bc0',
 'disait':'sns_dire_primary','dit':'sns_dire_primary',
 'dix':'sns_parure_dix_neuf_plus_un_adjectif_numeral_cardinal_correspondant_au_nombre_10_5525f11ef7',
 'elles':'sns_parure_elles_pronom_clitique_de_la_troisieme_personne_du_pluriel_feminin_sujet_pour_parler_d_un_groupe_de_femmes_d_animaux_ou_de_choses_grammaticalement_feminines_2626f57105',
 'enfin':'sns_zola_enfin_finally','ensuite':'sns_zola_ensuite_afterward',
 'est':'sns_etre_primary','filles':'sns_parure_fille_girl_56875b5e2d',
 'gens':'sns_zola_gens_people','grand':'sns_zola_grand_great',
 'grande':'sns_zola_grand_great','joie':'sns_joie_primary',
 'j’':'sns_je_primary','moi':'sns_moi_primary','non':'sns_non_primary',
 'notre':'sns_notre_primary','or':'sns_zola_or_now_yet',
 'où':'sns_ou_interrogative','parler':'sns_zola_parler_speak',
 'personne':'sns_fr_personne_nobody',
 'petit':'sns_parure_petit_small_dfe627cb55',
 'petite':'sns_parure_petit_small_dfe627cb55',
 'petites':'sns_zola_petit_small','peut':'sns_zola_pouvoir_ability',
 'premier':'sns_zola_premier_primary','puis':'sns_zola_puis_then',
 'quand':'sns_quand_primary','quel':'sns_quel_primary',
 'quelle':'sns_quel_primary','rocher':'sns_zola_rocher_cliff',
 'saisit':'sns_saisir_primary','seront':'sns_etre_primary',
 'ses':'sns_son_primary',
 'six':'sns_cendrillon_six_cinq_plus_un_adjectif_numeral_cardinal_correspondant_au_nombre_6_7cbdec0f1a',
 'sorti':'sns_zola_sortir_emerge','suis':'sns_etre_primary',
 'tant':'sns_zola_tant_degree',
 'vers':'sns_parure_vers_indique_une_direction_ou_une_approximation_de_temps_1a64e1a49d',
 'voici':'sns_zola_voici_presentative','voyant':'sns_fr_voir_perceive',
 'écria':'sns_fr_secrier_exclaim','étaient':'sns_fr_etre_compound_auxiliary',
}
HOLDS={
 'donc':'The rhetorical Quelle adresse ... ne fallut-il donc pas uses emphatic donc, whereas the stored questions teach a consequence.',
 'encore':'Le mit encore sur son ongle means again; all three current published questions illustrate still/continuation.',
 'tenait':'The creature qu’il tenait is held in his hand; the stored tenir questions teach general holding, but review the pronoun and source reference before sharing.',
 'ouvrage':'Cet ouvrage is the text/book being read; the published Level 4–5 question teaches repair work.',
 'messieurs':'Ces messieurs are the people on the ship, while published questions teach the direct polite title Monsieur.',
 'portait':'The ship carried passengers; the only published portait identity and questions concern an inscription.',
 'pied':'D’un pied is a historical unit of length; published questions teach the anatomical foot.',
 'quarts':'Quarts de cercle names measuring instruments; published questions teach fractions of time.',
 'prise':'The microscope had no prise sur tiny humans, meaning it could not resolve them; published questions teach taking someone for another person.',
 'figure':'A figure on the Earth is size or outline; published choices offer face or social standing.',
 'fois':'À la fois is a simultaneity expression, not the independent noun time or occasion.',
 'fait':'Sur le fait is a caught-in-the-act expression and needs its complete phrase questions.',
 'pris':'J’ai pris la nature sur le fait forms the caught-in-the-act expression; inspect it as a whole.',
 'aura':'Aura beau faire is a futile-attempt expression and awaits complete phrase review.',
 'beau':'Aura beau faire is a futile-attempt expression; avoid teaching beauty in this use.',
 'moins':'Au moins is a minimum expression; inspect the published expression rather than approving an isolated component.',
 'petits':'Des infiniment petits substantivizes the adjective as tiny beings; the stored questions teach adjectives for small rooms or social status.',
 'sans':'The current Level 4–5 correct choice is capitalized Sans in a mid-sentence blank; hold pending shared question repair.',
 'prenant':'En prenant la taille means taking a measurement, while the published question teaches grasping a book in one’s hands.',
 'partie':'La six cent millième partie is a fractional part; the existing bands use en partie, an adverbial partly construction.',
 'troupe':'Sa troupe is a military troop of grenadiers; the published bands teach a troupe of actors in a theatre.',
}

items=[];holds=[];covered=set()
for t in inv['tokens']:
 form=t['form']
 if (t['unit'],t['start'],t['end']) in prior_assigned|prior_held:continue
 if form in HOLDS:
  holds.append({'form':form,'unit':t['unit'],'start':t['start'],'end':t['end'],'text':t['text'],
                'context':t['context'],'decision':'hold_for_contextual_or_expression_review','reviewNote':HOLDS[form]});covered.add(form);continue
 if form not in SELECTIONS:continue
 sense=SELECTIONS[form]
 candidate=next(c for c in by_form[form]['candidates'] if c['identity'].endswith(':'+sense))
 assert any(c['identity']==candidate['identity'] for c in t['candidates']),form
 assert candidate['bands']==['levels_1_3','levels_4_5','levels_6_8'] and len(candidate['questions'])==3,form
 items.append({'form':form,'decision':'reuse_published_identity_and_questions',
               'identity':candidate['identity'],'gloss':candidate['gloss'],
               'questionSha256':candidate['questionSha256'],'bands':candidate['bands'],
               'sourceOccurrences':[{'chapter':5,'unit':t['unit'],'start':t['start'],'end':t['end'],
                                     'text':t['text'],'context':t['context']}],
               'reviewNote':f'Chapter V uses {form} as {candidate["gloss"]}; the three stored published contexts and Level 4–5 choices were compared with this exact use.'})
assert len(items)==len(SELECTIONS) and covered==set(HOLDS),(len(items),len(SELECTIONS),covered^set(HOLDS))
out={'version':1,'workId':inv['workId'],'chapter':5,
     'status':'offline_contextual_published_reuse_review_unpublished',
     'sourceSha256':inv['sourceSha256'],'unitPlanSha256':inv['unitPlanSha256'],
     'inventorySha256':hashlib.sha256((base/'chapter-05-inventory.json').read_bytes()).hexdigest(),
     'reviewScope':'Lower frequency candidate source contexts and three published bands, with separate semantic and expression holds.',
     'summary':{'reviewedForms':len(items),'reviewedUses':len(items),
                'heldForms':len(covered),'heldUses':len(holds)},
     'items':items,'holds':holds}
(base/'chapter-05-published-reuse-review-04.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out['summary']))
