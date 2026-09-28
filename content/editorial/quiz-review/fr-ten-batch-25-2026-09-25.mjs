export default {
  "version": 1,
  "id": "fr-ten-batch-25-semantic-2026-09-25",
  "snapshot": "fr-ten-batch-25-2026-09-25-input.json",
  "language": "fr",
  "entries": [
    {
      "from": "srf_beau:sns_beau_primary",
      "occurrenceIds": [
        "occ_c8a3ac7dce9b7e621df0ca20",
        "occ_cendrillon_2aa798cdeda2b4a40773afa2",
        "occ_cendrillon_39a10c5c03b3793b9675e9d0",
        "occ_cendrillon_eb733c43530b66ddcf05208e"
      ],
      "reason": "The raven, carriage, horse and color passages describe attractive appearance; the three existing beauty questions apply to those four uses.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_beau:sns_beau_primary",
      "occurrenceIds": [
        "occ_cendrillon_7fadef0d7fd90dcbb4a81153"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_avoir_beau_expression",
          "headword": "avoir beau",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_beau_avoir_beau",
          "lemmaId": "lem_fr_avoir_beau_expression",
          "form": "beau",
          "normalized": "beau"
        },
        "sense": {
          "id": "sns_fr_avoir_beau_concessive_expression",
          "lemmaId": "lem_fr_avoir_beau_expression",
          "gloss": "however much; in vain",
          "definition": "Dans « avoir beau » suivi de l’infinitif, une action reste sans effet sur le résultat."
        }
      },
      "reason": "The moral says that however much one possesses talents, they are vain without patrons; avoir beau is a concessive expression, not a description of beauty.",
      "questions": [
        {
          "context": "Mais vous aurez beau les avoir, pour vostre avancement ce seront choses vaines.",
          "choices": "however much; in vain|beautiful|already|from afar"
        },
        {
          "context": "Vous aurez _____ les avoir : sans parrains, ces talents resteront vains.",
          "choices": "beau|bel|belle|beaux"
        },
        {
          "context": "Mais vous aurez beau les avoir, pour vostre avancement ce seront choses vaines si vous n’avez des parrains ou des Maraines.",
          "prompt": "Quel mot appartient à la locution signifiant « malgré tous vos efforts » ?",
          "choices": "beau|avancement|choses|Maraines"
        }
      ]
    },
    {
      "from": "srf_zola_toutes_tout:sns_tout_primary",
      "occurrenceIds": [
        "occ_cendrillon_44bcd32aa98cfd9dd311333f",
        "occ_cendrillon_6f3eb6d3e3c2db35c8a1b7be",
        "occ_cendrillon_af8f87c6e6b22b858bce049e",
        "occ_cendrillon_b93fdcb6067e63b355ce4e8f",
        "occ_cendrillon_d4735e25e123e5c3d850a1e9",
        "occ_cendrillon_f0cbe1a84bb0696c585b8007",
        "occ_parure_1e411a28cf0c5e5d14034256",
        "occ_parure_4a54cee8dba0cc0faf5950b1",
        "occ_parure_55c945b4bd031f8f312dd8d8",
        "occ_parure_b0affc1195a5c144f44ac69f",
        "occ_parure_b125fb0af9a9d24cde33a9c1",
        "occ_parure_b18afe97de0d00a7d66da7ad",
        "occ_parure_fd7c513146603dc8012fb5ee",
        "occ_zola_0f18184dac6d092910472f15"
      ],
      "reason": "Fourteen occurrences determine explicit feminine plural nouns, including toutes les fautes, toutes choses and toutes les personnes; the three existing questions target that determiner form.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_toutes_tout:sns_tout_primary",
      "occurrenceIds": [
        "occ_parure_d59675e4a8da9d4d3f8c457d",
        "occ_cendrillon_1b5d3fb8a04c49fd4d8f3491"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_tout_pronoun",
          "headword": "tout",
          "partOfSpeech": "pronoun"
        },
        "surface": {
          "id": "srf_fr_toutes_pronoun",
          "lemmaId": "lem_fr_tout_pronoun",
          "form": "toutes",
          "normalized": "toutes"
        },
        "sense": {
          "id": "sns_fr_toutes_all_of_them",
          "lemmaId": "lem_fr_tout_pronoun",
          "gloss": "all of them (feminine plural)",
          "definition": "Pronom qui reprend un ensemble féminin pluriel sans nom exprimé après toutes."
        }
      },
      "reason": "« plus jolie que toutes » and « six souris toutes en vie » use toutes independently of a following noun; the other fourteen spans determine an explicit feminine plural noun.",
      "questions": [
        {
          "context": "Au bal, elle était plus jolie que toutes.",
          "choices": "all of them (feminine plural)|each man|none of them|one woman"
        },
        {
          "context": "Les six souris étaient _____ en vie.",
          "choices": "toutes|tous|toute|tout"
        },
        {
          "context": "Elle était plus jolie que toutes, élégante, gracieuse, souriante et folle de joie.",
          "prompt": "Quel pronom désigne toutes les autres femmes sans répéter le nom ?",
          "choices": "toutes|jolie|gracieuse|joie"
        }
      ]
    },
    {
      "from": "srf_zola_bien_bien:sns_zola_bien_well",
      "occurrenceIds": [
        "occ_zola_4aa139a10011093e5766efb1",
        "occ_zola_5768e809b519173678fc3772",
        "occ_zola_8cea296824afd9c0b343ce84",
        "occ_zola_a793fd493704fbbea25c60b7",
        "occ_zola_dfda2d8bd4c748a20b927bfa"
      ],
      "reason": "The other five uses express certainty or affirmation, as in « On verra bien » and « je crois bien »; the established indeed/well sense and questions remain applicable.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_bien_bien:sns_zola_bien_well",
      "occurrenceIds": [
        "occ_zola_52bdf3043f03fcc8b86a8249",
        "occ_zola_6562105a85029d21cedef310"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_bien",
          "headword": "bien",
          "partOfSpeech": "adverb"
        },
        "surface": {
          "id": "srf_zola_bien_bien",
          "lemmaId": "lem_zola_bien",
          "form": "bien",
          "normalized": "bien"
        },
        "sense": {
          "id": "sns_fr_bien_intensifier",
          "lemmaId": "lem_zola_bien",
          "gloss": "very; much; many",
          "definition": "Renforce le degré, l’intensité ou la quantité, notamment devant un adjectif ou avec des."
        }
      },
      "reason": "« bien haut » and « bien obligés » intensify the following word rather than describing how well an action is done.",
      "questions": [
        {
          "context": "Ce qu’il faut affirmer bien haut, c’est que Gonse était convaincu.",
          "choices": "very; emphatically|poorly|only afterward|in secret"
        },
        {
          "context": "Ils étaient _____ obligés de l’acquitter, faute de preuve.",
          "choices": "bien|peu|mal|pas"
        },
        {
          "context": "Les généraux sont bien obligés de faire acquitter le commandant, puisqu’ils ne peuvent laisser reconnaître son innocence.",
          "prompt": "Quel mot renforce l’idée qu’ils sont obligés ?",
          "choices": "bien|généraux|commandant|innocence"
        }
      ]
    },
    {
      "from": "srf_zola_mettre_mettre:sns_zola_mettre_place",
      "occurrenceIds": [
        "occ_cendrillon_f3a09416be3a06a8faf9f5c5",
        "occ_parure_f3bff65666452abd26e77ba9"
      ],
      "reason": "The two other occurrences put a garment on the body or place oneself near the fireplace, which fit the ordinary put/place meaning and its questions.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_mettre_mettre:sns_zola_mettre_place",
      "occurrenceIds": [
        "occ_zola_80b6c3361167562b6d54ebbb"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_mettre",
          "headword": "mettre",
          "partOfSpeech": "verb"
        },
        "surface": {
          "id": "srf_zola_mettre_mettre",
          "lemmaId": "lem_zola_mettre",
          "form": "mettre",
          "normalized": "mettre"
        },
        "sense": {
          "id": "sns_fr_mettre_en_flammes",
          "lemmaId": "lem_zola_mettre",
          "gloss": "to set ablaze; throw into turmoil",
          "definition": "Dans « mettre en flammes », enflammer ou provoquer de graves bouleversements."
        }
      },
      "reason": "« mettre l’Europe en flammes » predicts upheaval, not physical placement of an object.",
      "questions": [
        {
          "context": "Les révélations étaient capables de mettre l’Europe en flammes.",
          "choices": "set ablaze; throw into turmoil|place on a shelf|tidy up|give back"
        },
        {
          "context": "Ces révélations risquaient de _____ l’Europe en flammes.",
          "choices": "mettre|tenir|rendre|porter"
        },
        {
          "context": "Les choses dangereuses, capables de mettre l’Europe en flammes, avaient été enterrées derrière ce huis clos.",
          "prompt": "Quel verbe appartient à la locution signifiant provoquer un embrasement ?",
          "choices": "mettre|choses|Europe|flammes"
        }
      ]
    },
    {
      "from": "srf_zola_mettre_mettre:sns_zola_mettre_place",
      "occurrenceIds": [
        "occ_parure_fc64544df17a76dbd2a33f9f"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_mettre",
          "headword": "mettre",
          "partOfSpeech": "verb"
        },
        "surface": {
          "id": "srf_zola_mettre_mettre",
          "lemmaId": "lem_zola_mettre",
          "form": "mettre",
          "normalized": "mettre"
        },
        "sense": {
          "id": "sns_fr_mettre_au_net",
          "lemmaId": "lem_zola_mettre",
          "gloss": "to write up neatly; make a clean copy",
          "definition": "Dans « mettre au net les comptes », établir une version propre et ordonnée des comptes."
        }
      },
      "reason": "Mathilde’s husband works to put accounts into a clean final form; mettre au net is a distinct accounting or copying expression.",
      "questions": [
        {
          "context": "Le mari travaillait le soir à mettre au net les comptes d’un commerçant.",
          "choices": "write up neatly; make a clean copy|set on fire|hide|lend"
        },
        {
          "context": "Il passait ses soirées à _____ au net les comptes.",
          "choices": "mettre|voir|tenir|prendre"
        },
        {
          "context": "Le mari travaillait, le soir, à mettre au net les comptes d’un commerçant, et la nuit il faisait de la copie.",
          "prompt": "Quel verbe appartient à l’expression signifiant établir des comptes propres ?",
          "choices": "mettre|comptes|commerçant|copie"
        }
      ]
    },
    {
      "from": "srf_zola_autres_autre:sns_zola_autre_adjective",
      "occurrenceIds": [
        "occ_cendrillon_2d37af16ec128af48d2f116b",
        "occ_parure_7cac5876afa8389d4c2b2024",
        "occ_parure_a1ce957621bb23fba845b433",
        "occ_parure_e208852906d72a7bc5e60005"
      ],
      "reason": "The other four occurrences explicitly modify occasions, men, women or talents, and the existing other-adjective questions fit each use.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_autres_autre:sns_zola_autre_adjective",
      "occurrenceIds": [
        "occ_zola_bdbc1668e3640e43dbe6f9e2",
        "occ_zola_dfaf928132a64fd82d9791ca",
        "occ_parure_dbd10734cd111bc5a7d806fc",
        "occ_cendrillon_b009be49f7ba5df25f3b99a0"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_autre_pronoun",
          "headword": "autre",
          "partOfSpeech": "pronoun"
        },
        "surface": {
          "id": "srf_fr_autres_pronoun",
          "lemmaId": "lem_fr_autre_pronoun",
          "form": "autres",
          "normalized": "autres"
        },
        "sense": {
          "id": "sns_fr_autres_others",
          "lemmaId": "lem_fr_autre_pronoun",
          "gloss": "others; the other ones",
          "definition": "Désigne d’autres personnes ou choses sans répéter leur nom."
        }
      },
      "reason": "« les autres », « d’autres » and « tous les autres » stand for people or items without a following noun; the four remaining autres modify an explicit noun.",
      "questions": [
        {
          "context": "Il a pris à sa charge le crime des autres.",
          "choices": "others; the other ones|the same people|everyone|nobody"
        },
        {
          "context": "Il fallait payer des billets, en renouveler d’_____.",
          "choices": "autres|anciens|utiles|amples"
        },
        {
          "context": "En renouvelant d’autres billets chaque mois, il obtint un peu de temps pour rembourser sa dette.",
          "prompt": "Quel pronom désigne ici des billets supplémentaires ?",
          "choices": "autres|billets|mois|temps"
        }
      ]
    },
    {
      "from": "srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary",
      "occurrenceIds": [
        "occ_cendrillon_248cfeef7363da2cf3b37f0d",
        "occ_cendrillon_4bb8ff8436a4d54254a6e8ec",
        "occ_cendrillon_7a32c62c48aa93bb7b76fc78",
        "occ_cendrillon_8546fe09587049b99b9b67ae",
        "occ_cendrillon_a80fe9406b6b74e97fc4185f",
        "occ_parure_353eb94ec1a8f17e64e50dcc",
        "occ_parure_e17d3e0890d4d5f186c8e32b",
        "occ_parure_f6bb8a2aa12e3e300e93102c",
        "occ_zola_07a52ddb6af1cf7b460e0324",
        "occ_zola_5854386a9770df07399dd695",
        "occ_zola_603109294bebf3e0df99527b",
        "occ_zola_6e34b7ce374843ffc79a67ae",
        "occ_zola_76f1aa5ca96210b41e7528aa",
        "occ_zola_7a66b228c99125bb3a636f66",
        "occ_zola_7ac94f281109585f5f25b9d7",
        "occ_zola_8020d38b20bb0b119592ab15",
        "occ_zola_9b18447faceb6bfb629c0308",
        "occ_zola_a662c46f5e788f5625f401f9",
        "occ_zola_af625b5770ec57e25aefad66",
        "occ_zola_b362812a7d0899e33dedb809",
        "occ_zola_d7afcfb0979356e6611b4d96",
        "occ_zola_ed589bf69f12d1c2dfc6c8e0",
        "occ_zola_fac98db338e94c4afec12971"
      ],
      "reason": "The remaining avoir uses express possession, having a quality, or auxiliary avoir; the existing questions use its infinitive possession sense.",
      "questions": [
        null,
        null,
        null
      ]
    },
    {
      "from": "srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary",
      "occurrenceIds": [
        "occ_zola_7db9219cdab0e8be4185211b",
        "occ_zola_7f57294f369691d6a38f5f84"
      ],
      "target": {
        "lemma": {
          "id": "lem_zola_avoir_lieu",
          "headword": "avoir lieu",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_avoir_avoir_lieu",
          "lemmaId": "lem_zola_avoir_lieu",
          "form": "avoir",
          "normalized": "avoir"
        },
        "sense": {
          "id": "sns_zola_avoir_lieu_happen",
          "lemmaId": "lem_zola_avoir_lieu",
          "gloss": "to take place; happen",
          "definition": "se produire ou se dérouler à un moment ou dans un cadre donné"
        }
      },
      "reason": "The duel and an inner collapse « vont/doivent avoir lieu »: the whole expression means take place, not possess something.",
      "questions": [
        {
          "context": "Dès lors, le duel va avoir lieu entre les deux lieutenants-colonels.",
          "choices": "take place; happen|possess|borrow|remember"
        },
        {
          "context": "Le duel va _____ lieu entre les deux hommes.",
          "choices": "avoir|faire|prendre|donner"
        },
        {
          "context": "Dès lors, le duel va avoir lieu entre le lieutenant-colonel Picquart et le lieutenant-colonel du Paty de Clam.",
          "prompt": "Quel verbe appartient à l’expression signifiant se dérouler ?",
          "choices": "avoir|duel|Picquart|Clam"
        }
      ]
    },
    {
      "from": "srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary",
      "occurrenceIds": [
        "occ_parure_baa151f8b17e15dc81bdb226"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_avoir_l_air",
          "headword": "avoir l’air",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_avoir_avoir_l_air",
          "lemmaId": "lem_fr_avoir_l_air",
          "form": "avoir",
          "normalized": "avoir"
        },
        "sense": {
          "id": "sns_fr_avoir_l_air_seem",
          "lemmaId": "lem_fr_avoir_l_air",
          "gloss": "to look; seem",
          "definition": "Dans « avoir l’air » suivi d’un adjectif, donner l’impression d’être ainsi."
        }
      },
      "reason": "« avoir l’air pauvre » means appear poor, distinct from possession or auxiliary avoir.",
      "questions": [
        {
          "context": "Elle trouvait humiliant d’avoir l’air pauvre au milieu de femmes riches.",
          "choices": "look; seem|possess|become wealthy|borrow"
        },
        {
          "context": "Elle craignait d’_____ l’air pauvre au milieu des femmes riches.",
          "choices": "avoir|être|faire|voir"
        },
        {
          "context": "Il n’y a rien de plus humiliant que d’avoir l’air pauvre au milieu de femmes riches.",
          "prompt": "Quel verbe appartient à l’expression signifiant paraître pauvre ?",
          "choices": "avoir|humiliant|pauvre|femmes"
        }
      ]
    },
    {
      "from": "srf_zola_avoir_avoir:sns_zola_avoir_possess_auxiliary",
      "occurrenceIds": [
        "occ_zola_b3eb097738faae8aab58d49e"
      ],
      "target": {
        "lemma": {
          "id": "lem_fr_y_avoir_existential",
          "headword": "y avoir",
          "partOfSpeech": "expression"
        },
        "surface": {
          "id": "srf_fr_avoir_y_avoir",
          "lemmaId": "lem_fr_y_avoir_existential",
          "form": "avoir",
          "normalized": "avoir"
        },
        "sense": {
          "id": "sns_fr_y_avoir_exist",
          "lemmaId": "lem_fr_y_avoir_existential",
          "gloss": "there to be; to occur",
          "definition": "Dans « il y avoir », marque l’existence ou la survenue de quelque chose."
        }
      },
      "reason": "« Il dut y avoir là une minute psychologique » means there must have been such a moment, not that someone owned it.",
      "questions": [
        {
          "context": "Il pouvait y avoir une minute d’hésitation avant que le conseil ne tranche.",
          "choices": "there to be; to occur|possess|take away|remember"
        },
        {
          "context": "Il dut y _____ là une minute d’angoisse.",
          "choices": "avoir|être|faire|aller"
        },
        {
          "context": "Il dut y avoir un instant d’angoisse avant la décision du conseil.",
          "prompt": "Quel verbe appartient à la tournure marquant l’existence de cet instant ?",
          "choices": "avoir|instant|angoisse|conseil"
        }
      ]
    },
    {
      "from": "srf_zola_beau_beau:sns_zola_beau_beautiful",
      "occurrenceIds": [
        "occ_zola_8649e012ee6217313cae7727"
      ],
      "reason": "The sole beau passage describes a “fine result” ironically: the honest Picquart will be punished. The existing questions about a pretty garden tested only literal beauty, so these three questions now test the ironic favorable adjective in context while preserving the already broad beautiful/fine sense.",
      "questions": [
        {
          "context": "Le beau résultat de cette affaire, c’est que l’homme honnête sera puni.",
          "choices": "fine; splendid (said ironically)|ugly|ordinary|secret"
        },
        {
          "context": "Quel _____ résultat : Picquart a fait son devoir et sera pourtant puni !",
          "choices": "beau|bel|belle|beaux"
        },
        {
          "context": "Et le beau résultat de cette situation prodigieuse, c’est que l’honnête homme, le lieutenant-colonel Picquart, va être la victime.",
          "prompt": "Quel adjectif qualifie ironiquement ce résultat ?",
          "choices": "beau|résultat|Picquart|victime"
        }
      ]
    }
  ]
};
