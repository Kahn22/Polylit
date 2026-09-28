export default {
  "version": 1,
  "id": "fr-sur-par-semantic-2026-09-25",
  "snapshot": "fr-sur-par-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_sur:sns_sur_primary",
      "occurrenceIds": [
        "occ_cendrillon_aff06513c868dcf5f81dd11c",
        "occ_cendrillon_f1f57ae74cacdcc300780625",
        "occ_e8cc09e195961593af19fa5c",
        "occ_parure_1000dd08ebf32c91cd682c20",
        "occ_parure_55837954f2f4ded3a3546aad",
        "occ_parure_6553973155c66cc0330e1539",
        "occ_parure_7099c3c59c4fbb84c2528c80",
        "occ_parure_82759760c8e77dd757d90fb2",
        "occ_parure_89e31a53df87fdeeec71c6bc",
        "occ_parure_932df7b67b82a387c1fa0d63",
        "occ_parure_9c4941926f9636f98e1e434f",
        "occ_parure_dc5c7c070f19dbc0a89f1e9c",
        "occ_parure_e89278af31b1436b19665f01",
        "occ_parure_e98c9ff151e1d103b579872f",
        "occ_zola_1d1b6b191427620988f9a8b6",
        "occ_zola_3cd48a24678c4190b9789e09",
        "occ_zola_40e6e941d692ef8d370a8476",
        "occ_zola_54466a25747e43bc69a1f6d9",
        "occ_zola_656cc51f75bb3a86c5211b9e",
        "occ_zola_7be82f56cd40e87d8c9ce1a7",
        "occ_zola_7dc3f5c67017fbc4361a9846",
        "occ_zola_932048df4bed13a978d6d9ee",
        "occ_zola_b2f2db9d24c0a052ea0ffcd9",
        "occ_zola_b938c9e3f600ceb44003073f",
        "occ_zola_c5bd72fa43e2ae52733a44db",
        "occ_zola_caed0a5165c217a5cb7dea9d",
        "occ_zola_f21fecd6fb0124c1723cab97",
        "occ_zola_f7185007c90bdf8abbefabe1"
      ],
      "target": {
        "lemma": {
          "id": "lem_sur",
          "headword": "sur",
          "partOfSpeech": "preposition"
        },
        "surface": {
          "id": "srf_sur",
          "lemmaId": "lem_sur",
          "form": "sur",
          "normalized": "sur"
        },
        "sense": {
          "id": "sns_sur_primary",
          "lemmaId": "lem_sur",
          "gloss": "on; onto; upon; based on",
          "definition": "Marque un contact ou une position sur une surface, ou un appui matériel ou figuré."
        }
      },
      "metadataCorrection": true,
      "reason": "The remaining twenty-eight uses locate something on or onto a surface or rest a claim or action upon a basis: on a tree/table/robe/quay, a suspicion on Dreyfus, a sentence based on evidence, or a burden upon the council. The original physical-on questions remain a valid instance of this relation.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_sur:sns_sur_primary",
      "occurrenceIds": [
        "occ_zola_4adcf03ec8b0c66c1fe2313b",
        "occ_zola_5c263f73be731c944621da02",
        "occ_zola_98c9b2eaf1cb4264da57114a",
        "occ_cendrillon_95ac119a7525edb78b8e0776"
      ],
      "target": {
        "lemma": {
          "id": "lem_sur",
          "headword": "sur",
          "partOfSpeech": "preposition"
        },
        "surface": {
          "id": "srf_sur",
          "lemmaId": "lem_sur",
          "form": "sur",
          "normalized": "sur"
        },
        "sense": {
          "id": "sns_fr_sur_about_topic",
          "lemmaId": "lem_sur",
          "gloss": "about; concerning",
          "definition": "Introduit le sujet d’une loi, d’un propos ou d’un récit."
        }
      },
      "reason": "The law concerns the press, Zola asks for truth about the trial and conviction, and the moral comments on the tale; these four sur tokens introduce a topic rather than a surface.",
      "questions": [
        {
          "context": "Le journal publie un article sur le procès.",
          "choices": "about; concerning|under|behind|without"
        },
        {
          "context": "Un ouvrage _____ la condamnation de Dreyfus paraîtra demain.",
          "choices": "sur|sous|vers|entre"
        },
        {
          "context": "La chroniqueuse écrit sur le procès devant le tribunal.",
          "prompt": "Quelle préposition introduit le sujet du texte ?",
          "choices": "sur|chroniqueuse|procès|tribunal"
        }
      ]
    },
    {
      "from": "srf_sur:sns_sur_primary",
      "occurrenceIds": [
        "occ_cendrillon_66420e33789039b3227bcb08"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_sur_toutes_choses",
          "headword": "sur toutes choses",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_sur_toutes_choses_sur",
          "lemmaId": "lem_fr_sur_toutes_choses",
          "form": "sur",
          "normalized": "sur"
        },
        "sense": {
          "id": "sns_fr_sur_toutes_choses_above_all",
          "lemmaId": "lem_fr_sur_toutes_choses",
          "gloss": "above all; especially",
          "definition": "Ancienne locution signifiant avant toute autre chose."
        }
      },
      "reason": "The godmother’s warning « sur toutes choses, de ne pas passer minuit » means above all or especially, not physical location or subject matter.",
      "questions": [
        {
          "context": "Sur toutes choses, respecte l’heure fixée pour rentrer.",
          "choices": "above all; especially|on top of objects|because of|afterward"
        },
        {
          "context": "_____ toutes choses, n’oublie pas de rentrer avant minuit.",
          "choices": "sur|dans|entre|par"
        },
        {
          "context": "Sa marraine lui rappela, sur toutes choses, de ne pas dépasser minuit.",
          "prompt": "Quel mot ouvre la locution signifiant « avant tout » ?",
          "choices": "sur|marraine|choses|minuit"
        }
      ]
    },
    {
      "from": "srf_par:sns_par_primary",
      "occurrenceIds": [
        "occ_7ec16dbc7b179e09097fb417",
        "occ_lion_rat_5f0f8149abbe9dd3bf51072a",
        "occ_parure_0f0412541f77926977265c13",
        "occ_parure_1e1f18876ebdddc63fb5b711",
        "occ_parure_303451538204c397c102bc00",
        "occ_parure_393311f5c77930716237a4b9",
        "occ_parure_3ed0f45426a6b64c76ed251e",
        "occ_parure_59d2905566b4006c1f96ceec",
        "occ_parure_69d3a49e49bd4fabf571096f",
        "occ_parure_77705112d43f13c9f88ba25b",
        "occ_parure_823d1e3877a153ef2febf07b",
        "occ_parure_d2d39cc6c125e0627ed4f785",
        "occ_parure_dab106a320da5468f66bc698",
        "occ_zola_2b342208247af8ba60e1e5c7",
        "occ_zola_34c58ddc57a8852988c8d981",
        "occ_zola_39f4256e7eb3d039bae50b32",
        "occ_zola_413d63755c0bc5d549c22afc",
        "occ_zola_5700adb338b05adbc5aa3a42",
        "occ_zola_5a74fb807b9fc0adc98972b2",
        "occ_zola_5ec533b889f3102c2f26065b",
        "occ_zola_630b2cab71077b4765606b58",
        "occ_zola_7f177fc5fc65ff292ce9f82d",
        "occ_zola_84feaba82cef7f23961bd703",
        "occ_zola_8936fa8306705dc916292e6c",
        "occ_zola_977087f282840d9b1c295e1b",
        "occ_zola_a93e7d78be4c1c6838d6c21e",
        "occ_zola_b4e7b66faf5204b4a860b700",
        "occ_zola_b69559b78aca542bb4b41532",
        "occ_zola_ba24730eab489f54a2b096a8",
        "occ_zola_c3a885803b796015d97722a0",
        "occ_zola_d50e8b4278226a240a55f0ad",
        "occ_zola_d6d7ee9ae4a93e1be55eee22",
        "occ_zola_de1b30896f5abdb343813136",
        "occ_zola_e1479c56f6f12d9ded7a7bb6",
        "occ_zola_f1982249cc5305c041bd3312",
        "occ_zola_fa18141997c69b593a8d5ea6",
        "occ_zola_fafe525a5014b04a7b7398be"
      ],
      "target": {
        "lemma": {
          "id": "lem_par",
          "headword": "par",
          "partOfSpeech": "preposition"
        },
        "surface": {
          "id": "srf_par",
          "lemmaId": "lem_par",
          "form": "par",
          "normalized": "par"
        },
        "sense": {
          "id": "sns_par_primary",
          "lemmaId": "lem_par",
          "gloss": "by; through; via; because of; per",
          "definition": "Introduit un agent, un moyen, une cause, un passage ou une répartition."
        }
      },
      "metadataCorrection": true,
      "reason": "The other thirty-seven uses introduce an agent, means, cause, route, or unit: tempted by the smell, by order or patriotism, written by a person, affected by warmth or fear, and hour by hour. The original by-agent questions remain accurate for a central use.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_par:sns_par_primary",
      "occurrenceIds": [
        "occ_loup_agneau_269204ff5687dc0b53a3ca13",
        "occ_parure_238183973e1b337139208f0c"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_par_consequent",
          "headword": "par conséquent",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_par_consequent_par",
          "lemmaId": "lem_fr_par_consequent",
          "form": "par",
          "normalized": "par"
        },
        "sense": {
          "id": "sns_fr_par_consequent_therefore",
          "lemmaId": "lem_fr_par_consequent",
          "gloss": "therefore; consequently",
          "definition": "Locution qui présente une conséquence de ce qui précède."
        }
      },
      "reason": "In the fable’s reasoning and Mathilde’s explanation, par conséquent is the logical connector therefore, not an agentive or causal by.",
      "questions": [
        {
          "context": "Je n’ai pas de robe convenable ; par conséquent, je ne peux aller à la fête.",
          "choices": "therefore; consequently|however|meanwhile|by someone"
        },
        {
          "context": "Elle n’a pas de robe ; _____ conséquent, elle refuse l’invitation.",
          "choices": "par|sur|de|en"
        },
        {
          "context": "Il n’a pas les vêtements nécessaires ; par conséquent, il restera chez lui.",
          "prompt": "Quel mot appartient au lien logique « donc » ?",
          "choices": "par|vêtements|conséquent|restera"
        }
      ]
    },
    {
      "from": "srf_par:sns_par_primary",
      "occurrenceIds": [
        "occ_zola_04bccbcf12d5eed3653442d3",
        "occ_zola_85d6fde67cb9bca947a60ad0"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_finir_par",
          "headword": "finir par",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_finir_par_par",
          "lemmaId": "lem_fr_finir_par",
          "form": "par",
          "normalized": "par"
        },
        "sense": {
          "id": "sns_fr_finir_par_eventually",
          "lemmaId": "lem_fr_finir_par",
          "gloss": "eventually; end up doing",
          "definition": "Dans finir par suivi d’un infinitif, indique le résultat atteint après un temps ou une suite d’actions."
        }
      },
      "reason": "« finira par éprouver » and « finissent par se convaincre » express an eventual outcome rather than means, cause or agent.",
      "questions": [
        {
          "context": "Après plusieurs débats, ils finissent par se convaincre.",
          "choices": "eventually; end up doing|through a person|at the start|without trying"
        },
        {
          "context": "Il finira _____ éprouver un remords après cette affaire.",
          "choices": "par|sur|de|sans"
        },
        {
          "context": "Après de longues recherches, ils finissent par se convaincre de son innocence.",
          "prompt": "Quelle préposition appartient à la tournure indiquant un résultat final ?",
          "choices": "par|recherches|convaincre|innocence"
        }
      ]
    },
    {
      "from": "srf_par:sns_par_primary",
      "occurrenceIds": [
        "occ_parure_d91cb9c034d5466b67f9576f"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_par_la_place",
          "headword": "par là",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_par_la_place_par",
          "lemmaId": "lem_fr_par_la_place",
          "form": "par",
          "normalized": "par"
        },
        "sense": {
          "id": "sns_fr_par_la_around_there",
          "lemmaId": "lem_fr_par_la_place",
          "gloss": "around there; in that area",
          "definition": "Dans par là, indique un lieu approximatif ou les environs."
        }
      },
      "reason": "The men went to Nanterre to hunt larks « par là », meaning around that area, not by a person or through an instrument.",
      "questions": [
        {
          "context": "Ils allaient chasser du côté de Nanterre, par là, le dimanche.",
          "choices": "around there; in that area|because of this|by an agent|after that"
        },
        {
          "context": "Ils allaient chasser près de Nanterre, _____ là.",
          "choices": "par|sur|de|avec"
        },
        {
          "context": "Quelques amis allaient tirer des alouettes par là, du côté de Nanterre.",
          "prompt": "Quelle préposition appartient à la locution désignant les environs ?",
          "choices": "par|amis|alouettes|Nanterre"
        }
      ]
    }
  ]
};
