export default {
  "version": 1,
  "id": "fr-checkpoint-30-recovery-identities-2026-09-25",
  "snapshot": "fr-checkpoint-30-identity-recovery-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_zola_compromis_compromettre:sns_zola_compromettre_incriminate",
      "occurrenceIds": "all",
      "metadataCorrection": true,
      "reason": "In each of the three J’Accuse passages, compromis means implicated or entangled in wrongdoing, unlike the adjective compromettant. Corrected the learner gloss while retaining the stable meaning ID; checked the three existing questions.",
      "target": {
        "lemma": {
          "id": "lem_zola_compromettre",
          "headword": "compromettre",
          "partOfSpeech": "verb"
        },
        "surface": {
          "id": "srf_zola_compromis_compromettre",
          "lemmaId": "lem_zola_compromettre",
          "form": "compromis",
          "normalized": "compromis"
        },
        "sense": {
          "id": "sns_zola_compromettre_incriminate",
          "lemmaId": "lem_zola_compromettre",
          "gloss": "compromised; implicated",
          "definition": "Mis en cause ou impliqué dans une affaire susceptible de nuire à sa réputation ou à sa défense."
        }
      },
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_belle_beau:sns_zola_beau_beautiful",
      "occurrenceIds": "all",
      "reason": "The single Zola occurrence « la belle besogne » shares the ordinary beau/belle aesthetic sense with the established cross-work identity. Retain its occurrence ID and make subsequent encounters fresh on view of that unit; the three canonical questions fit.",
      "target": {
        "lemma": {
          "id": "lem_beau",
          "headword": "beau",
          "partOfSpeech": "adjective"
        },
        "surface": {
          "id": "srf_belle",
          "lemmaId": "lem_beau",
          "form": "belle",
          "normalized": "belle"
        },
        "sense": {
          "id": "sns_beau_primary",
          "lemmaId": "lem_beau",
          "gloss": "beautiful",
          "definition": "beautiful"
        }
      },
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_doigt_doigt:sns_zola_doigt_finger",
      "occurrenceIds": "all",
      "metadataCorrection": true,
      "reason": "In « faire toucher du doigt comment l’erreur judiciaire a pu être possible », doigt participates in an idiom meaning to make a point concrete. Corrected the learner meaning and replaced the three invented finger-injury and jewelry contexts with contexts tied to Zola’s actual explanation.",
      "target": {
        "lemma": {
          "id": "lem_zola_doigt",
          "headword": "doigt",
          "partOfSpeech": "noun"
        },
        "surface": {
          "id": "srf_zola_doigt_doigt",
          "lemmaId": "lem_zola_doigt",
          "form": "doigt",
          "normalized": "doigt"
        },
        "sense": {
          "id": "sns_zola_doigt_finger",
          "lemmaId": "lem_zola_doigt",
          "gloss": "finger; directly, concretely (in toucher du doigt)",
          "definition": "Partie de la main ; dans « faire toucher du doigt », faire saisir directement et concrètement une idée ou une preuve."
        }
      },
      "questions": [
        {
          "context": "Je voudrais faire toucher du doigt comment l’erreur judiciaire a pu être possible.",
          "choices": "directly, concretely (in the phrase)|secretly|accidentally|from far away"
        },
        {
          "context": "Zola veut faire toucher du _____ les machinations qui ont rendu possible l’erreur judiciaire.",
          "choices": "doigt|coude|genou|poignet"
        },
        {
          "context": "Je voudrais faire toucher du doigt les machinations qui ont rendu possible l’erreur judiciaire.",
          "prompt": "Quel mot complète l’expression qui rend cette démonstration concrète ?",
          "choices": "doigt|toucher|erreur|possible"
        }
      ]
    },
    {
      "from": "srf_zola_mes_mon:sns_zola_mon_my",
      "occurrenceIds": "all",
      "reason": "« mes vilains habits » in Cendrillon and « Mes nuits » in J’Accuse are the same first-person plural possessive determiner. Merge the two occurrence IDs into the shared mon/my lemma and sense, adding the mes form; retain history without transferring mastery.",
      "target": {
        "lemma": {
          "id": "lem_mon",
          "headword": "mon",
          "partOfSpeech": "determiner"
        },
        "surface": {
          "id": "srf_fr_mes_mon_determiner",
          "lemmaId": "lem_mon",
          "form": "mes",
          "normalized": "mes"
        },
        "sense": {
          "id": "sns_mon_primary",
          "lemmaId": "lem_mon",
          "gloss": "my",
          "definition": "my"
        }
      },
      "questions": [
        {
          "context": "Mes nuits seraient hantées par le spectre de l’innocent.",
          "choices": "my|your|his|their"
        },
        {
          "context": "Est-ce que j’irai comme cela, avec _____ vilains habits ?",
          "choices": "mes|tes|ses|nos"
        },
        {
          "context": "Est-ce que j’irai comme cela, avec mes vilains habits ? Sa marraine la touche avec sa baguette.",
          "prompt": "Quel mot rattache les habits à la personne qui pose la question ?",
          "choices": "mes|habits|marraine|baguette"
        }
      ]
    }
  ]
};
