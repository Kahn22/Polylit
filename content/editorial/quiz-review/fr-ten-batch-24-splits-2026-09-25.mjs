export default {
  "version": 1,
  "id": "fr-ten-batch-24-splits-2026-09-25",
  "snapshot": "fr-ten-batch-24-splits-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_zola_doute_doute_noun:sns_zola_doute_uncertainty",
      "occurrenceIds": [
        "occ_zola_323b3b60c19228deb4c9edcb"
      ],
      "reason": "The three « sans doute » spans signal a probable explanation. The remaining « mettre en doute » span expresses uncertainty about the bordereau and retains the noun doubt sense.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_doute_doute_noun:sns_zola_doute_uncertainty",
      "occurrenceIds": [
        "occ_zola_08fc2bd3bcc72fe38ee8d4f0",
        "occ_zola_cb070a368046b7a1edeced1a",
        "occ_zola_fc4a4cac019748a7ff2a73e6"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_doute_noun",
          "headword": "doute",
          "partOfSpeech": "noun"
        },
        "surface": {
          "id": "srf_zola_doute_doute_noun",
          "lemmaId": "lem_zola_doute_noun",
          "form": "doute",
          "normalized": "doute"
        },
        "sense": {
          "id": "sns_fr_sans_doute_probably",
          "lemmaId": "lem_zola_doute_noun",
          "gloss": "probably; no doubt",
          "definition": "Dans « sans doute », marque une forte probabilité ou une supposition."
        }
      },
      "reason": "The three « sans doute » spans signal a probable explanation. The remaining « mettre en doute » span expresses uncertainty about the bordereau and retains the noun doubt sense.",
      "questions": [
        {
          "context": "L’un sans doute par passion cléricale, l’autre peut-être par cet esprit de corps.",
          "choices": "probably; no doubt|never|by accident|in secret"
        },
        {
          "context": "L’un sans _____ par passion cléricale, l’autre peut-être par esprit de corps.",
          "choices": "doute|preuve|risque|moyen"
        },
        {
          "context": "Il n’osa pas, dans la terreur sans doute de l’opinion publique, certainement aussi dans la crainte de livrer tout l’état-major.",
          "prompt": "Quel mot appartient à l’expression indiquant ici une supposition probable ?",
          "choices": "doute|terreur|opinion|crainte"
        }
      ]
    },
    {
      "from": "srf_zola_mets_mettre:sns_zola_mettre_place",
      "occurrenceIds": [
        "occ_zola_daaef0aaa304204fd32277a7"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_mettre",
          "headword": "mettre",
          "partOfSpeech": "verb"
        },
        "surface": {
          "id": "srf_zola_mets_mettre",
          "lemmaId": "lem_zola_mettre",
          "form": "mets",
          "normalized": "mets"
        },
        "sense": {
          "id": "sns_fr_se_mettre_sous_le_coup_liability",
          "lemmaId": "lem_zola_mettre",
          "gloss": "to become subject to; expose oneself to",
          "definition": "Dans « se mettre sous le coup de la loi », se placer en situation d’être poursuivi selon ces dispositions."
        }
      },
      "reason": "« Je me mets sous le coup des articles 30 et 31 » means that Zola exposes himself to the cited legal provisions, rather than physically putting an object somewhere.",
      "questions": [
        {
          "context": "En portant ces accusations, je me mets sous le coup des articles de la loi sur la presse.",
          "choices": "become subject to legal provisions|place a physical object|forget|escape"
        },
        {
          "context": "En portant ces accusations, je me _____ sous le coup de la loi.",
          "choices": "mets|tiens|cache|repose"
        },
        {
          "context": "En portant ces accusations, je n’ignore pas que je me mets sous le coup des articles 30 et 31 de la loi sur la presse.",
          "prompt": "Quel verbe exprime le fait de s’exposer à ces dispositions ?",
          "choices": "mets|portant|ignore|articles"
        }
      ]
    },
    {
      "from": "srf_zola_en_en:sns_zola_en_gerund",
      "occurrenceIds": [
        "occ_parure_b2d4eb840239b31fc69367b0",
        "occ_parure_babc29842bbd6c5664bf9794",
        "occ_parure_d8bfc10a486120e82ea4d5b7",
        "occ_zola_01f253b092f32388f41a1c0c",
        "occ_zola_0a59ff5258250ee7f53e357b",
        "occ_zola_22b1f26625544586f14ae46d",
        "occ_zola_564563a38f93fd95b1f6d070",
        "occ_zola_77bb3524c41a114beb1fe7a5",
        "occ_zola_888a2dd8b3f9fb63fd287a57",
        "occ_zola_9055a66702bc40a549e76f6d",
        "occ_zola_a545f5ef5f48dc0db0d94065",
        "occ_zola_b28c69cb46897093c6b1afb3",
        "occ_zola_d826dd49673e460bbecf56dc",
        "occ_zola_dd6a6cdd8e8cb9cb6981e30f"
      ],
      "reason": "« de plus loin en plus loin » expresses progression toward increasing distance; the fourteen other en occurrences precede a present participle in a gerund construction.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_en_en:sns_zola_en_gerund",
      "occurrenceIds": [
        "occ_zola_ac01976d7c7f77e2e889be4c"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_en",
          "headword": "en",
          "partOfSpeech": "preposition and pronoun"
        },
        "surface": {
          "id": "srf_zola_en_en",
          "lemmaId": "lem_zola_en",
          "form": "en",
          "normalized": "en"
        },
        "sense": {
          "id": "sns_fr_en_repeated_progression",
          "lemmaId": "lem_zola_en",
          "gloss": "to; progressively, in a repeated comparison",
          "definition": "Dans « de plus loin en plus loin », marque le passage progressif d’un degré au suivant."
        }
      },
      "reason": "« de plus loin en plus loin » expresses progression toward increasing distance; the fourteen other en occurrences precede a present participle in a gerund construction.",
      "questions": [
        {
          "context": "On le déplaçait de plus loin en plus loin.",
          "choices": "to progressively greater distance|while traveling|at once|back home"
        },
        {
          "context": "On l’éloigna de plus loin _____ plus loin.",
          "choices": "en|de|sur|par"
        },
        {
          "context": "On l’éloigna de plus loin en plus loin.",
          "prompt": "Quel mot relie les deux degrés de distance dans cette progression ?",
          "choices": "en|éloigna|plus|loin"
        }
      ]
    }
  ]
};
