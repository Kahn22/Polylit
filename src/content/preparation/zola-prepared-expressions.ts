import type { ExpressionCatalog } from "../../domain/expression-content.js";
import { validateExpressionCatalog } from "../../domain/expression-content.js";
import { zolaSourceAcquisition } from "../fixtures/zola.js";
import { prepareIngestionManifest } from "../../ingestion/prepare.js";
import { validateZolaExpressionSpans } from "./zola-expression-plan.js";

/** Human-authored offline questions; runtime never generates or edits them. */
export function createZolaPreparedExpressionCatalog(): ExpressionCatalog {
  const manifest = prepareIngestionManifest(zolaSourceAcquisition, "wrk_zola_jaccuse");
  const planned = validateZolaExpressionSpans(zolaSourceAcquisition.units, manifest.candidates);
  const aPriori = planned.find((span) => span.identityId === "exi_a_priori");
  if (!aPriori) throw new Error("Reviewed J’Accuse a priori span is missing");
  const catalog: ExpressionCatalog = {
    identities: [{
      id: "exi_a_priori", headword: "un a priori", gloss: "a preconception",
      definition: "jugement formé avant d’avoir examiné les faits",
    }, {
      id: "exi_tout_d_un_coup", headword: "tout d’un coup", gloss: "suddenly",
      definition: "soudainement, sans signe annonciateur",
    }, {
      id: "exi_de_sorte_que", headword: "de sorte que", gloss: "so that; with the result that",
      definition: "introduit une conséquence de ce qui précède",
    }, {
      id: "exi_tout_au_plus", headword: "tout au plus", gloss: "at most",
      definition: "indique une limite maximale qui ne sera pas dépassée",
    }, {
      id: "exi_tout_au_moins", headword: "tout au moins", gloss: "at least",
      definition: "indique une quantité minimale certaine, qui peut être dépassée",
    }, {
      id: "exi_au_point_de", headword: "au point de", gloss: "to the point of",
      definition: "indique un degré assez élevé pour produire une conséquence",
    }, {
      id: "exi_se_faire_fort_de", headword: "se faire fort de", gloss: "to undertake confidently to",
      definition: "affirmer avec assurance qu’on réussira à accomplir une action",
    }, {
      id: "exi_tout_au_long", headword: "tout au long", gloss: "throughout; at length",
      definition: "indique la continuité sur toute une durée ou toute une étendue",
    }, {
      id: "exi_ainsi_que", headword: "ainsi que", gloss: "as; just as",
      definition: "introduit une manière ou des propos rapportés en comparaison",
    }, {
      id: "exi_quant_a", headword: "quant à", gloss: "as for; regarding",
      definition: "introduit un nouveau sujet dont on va parler",
    }],
    occurrences: [{
      id: "exo_zola_a_priori", identityId: aPriori.identityId,
      workId: "wrk_zola_jaccuse", unitId: aPriori.unitId,
      start: aPriori.start, end: aPriori.end, text: aPriori.text,
    }, ...planned.filter((span) => ["exi_tout_d_un_coup", "exi_de_sorte_que", "exi_tout_au_plus", "exi_tout_au_moins", "exi_au_point_de", "exi_se_faire_fort_de", "exi_tout_au_long", "exi_ainsi_que", "exi_quant_a"].includes(span.identityId)).map((span) => ({
      id: `exo_zola_${span.unitId}_${span.identityId}`, identityId: span.identityId,
      workId: "wrk_zola_jaccuse", unitId: span.unitId,
      start: span.start, end: span.end, text: span.text,
    }))],
    preparedQuizzes: [
      {
        id: "exq_a_priori_early", expressionId: "exi_a_priori", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Son a priori a faussé son jugement.",
        targetText: "a priori", choicesEnglish: ["a preconception", "an umbrella", "a violin", "a lemon"], correctAnswer: "a preconception",
      },
      {
        id: "exq_a_priori_intermediate", expressionId: "exi_a_priori", band: "levels_4_5",
        format: "surface_completion", contextFrench: "L’enquêteur avait un _____ sur la culpabilité du suspect.",
        choicesFrench: ["a priori", "parapluie", "violon", "citron"], correctAnswer: "a priori",
      },
      {
        id: "exq_a_priori_advanced", expressionId: "exi_a_priori", band: "levels_6_8",
        format: "target_identification", contextFrench: "L’enquêteur avait un a priori sur le suspect. Une carte, un agenda et un crayon se trouvaient sur son bureau.",
        promptFrench: "Quelle expression désigne un jugement formé avant d’avoir examiné les faits ?",
        choicesFrench: ["a priori", "carte", "agenda", "crayon"], correctAnswer: "a priori",
      },
      {
        id: "exq_tout_d_un_coup_early", expressionId: "exi_tout_d_un_coup", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Tout d’un coup, la fenêtre s’est ouverte.", targetText: "Tout d’un coup",
        choicesEnglish: ["suddenly", "politely", "slowly", "repeatedly"], correctAnswer: "suddenly",
      },
      {
        id: "exq_tout_d_un_coup_intermediate", expressionId: "exi_tout_d_un_coup", band: "levels_4_5",
        format: "surface_completion", contextFrench: "La porte s’est ouverte _____, sans le moindre avertissement.",
        choicesFrench: ["tout d’un coup", "à voix basse", "avec patience", "de bon cœur"], correctAnswer: "tout d’un coup",
      },
      {
        id: "exq_tout_d_un_coup_advanced", expressionId: "exi_tout_d_un_coup", band: "levels_6_8",
        format: "target_identification", contextFrench: "L’enfant parlait à voix basse et attendait avec patience. De bon cœur, il aida sa sœur. Tout d’un coup, la porte s’ouvrit.",
        promptFrench: "Quelle expression indique que la porte s’est ouverte soudainement ?",
        choicesFrench: ["Tout d’un coup", "à voix basse", "avec patience", "De bon cœur"], correctAnswer: "Tout d’un coup",
      },
      {
        id: "exq_de_sorte_que_early", expressionId: "exi_de_sorte_que", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Elle a coupé le courant, de sorte que les lampes se sont éteintes.", targetText: "de sorte que",
        choicesEnglish: ["with the result that", "although", "while", "because"], correctAnswer: "with the result that",
      },
      {
        id: "exq_de_sorte_que_intermediate", expressionId: "exi_de_sorte_que", band: "levels_4_5",
        format: "surface_completion", contextFrench: "Il a oublié sa clé, _____ il est resté dehors toute la nuit.",
        choicesFrench: ["de sorte que", "parce que", "tandis que", "alors que"], correctAnswer: "de sorte que",
      },
      {
        id: "exq_de_sorte_que_advanced", expressionId: "exi_de_sorte_que", band: "levels_6_8",
        format: "target_identification", contextFrench: "Il s’est endormi, de sorte que le train est parti sans lui. Il est rentré parce que la gare fermait, tandis que son frère restait. Alors que la ville dormait, il attendait encore.",
        promptFrench: "Quelle expression introduit ici la conséquence du fait qu’il s’est endormi ?",
        choicesFrench: ["de sorte que", "parce que", "tandis que", "Alors que"], correctAnswer: "de sorte que",
      },
      {
        id: "exq_tout_au_plus_early", expressionId: "exi_tout_au_plus", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Le bus prendra tout au plus dix voyageurs.", targetText: "tout au plus",
        choicesEnglish: ["at most", "at least", "exactly", "more than"], correctAnswer: "at most",
      },
      {
        id: "exq_tout_au_plus_intermediate", expressionId: "exi_tout_au_plus", band: "levels_4_5",
        format: "surface_completion", contextFrench: "Personne n’a encore confirmé et seules deux invitations ont été envoyées. Il y aura _____ deux invités.",
        choicesFrench: ["tout au plus", "tout au moins", "exactement", "plus de"], correctAnswer: "tout au plus",
      },
      {
        id: "exq_tout_au_plus_advanced", expressionId: "exi_tout_au_plus", band: "levels_6_8",
        format: "target_identification", contextFrench: "Le train aura tout au plus dix minutes de retard. La gare attend tout au moins vingt voyageurs; exactement trois agents sont présents et plus de quatre taxis attendent dehors.",
        promptFrench: "Quelle expression indique que le retard ne dépassera pas dix minutes ?",
        choicesFrench: ["tout au plus", "tout au moins", "exactement", "plus de"], correctAnswer: "tout au plus",
      },
      {
        id: "exq_tout_au_moins_early", expressionId: "exi_tout_au_moins", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Nous aurons tout au moins dix minutes pour discuter.", targetText: "tout au moins",
        choicesEnglish: ["at least", "at most", "exactly", "fewer than"], correctAnswer: "at least",
      },
      {
        id: "exq_tout_au_moins_intermediate", expressionId: "exi_tout_au_moins", band: "levels_4_5",
        format: "surface_completion", contextFrench: "Deux invités ont déjà confirmé; d’autres pourraient encore venir. Il y aura _____ deux invités.",
        choicesFrench: ["tout au moins", "tout au plus", "exactement", "moins de"], correctAnswer: "tout au moins",
      },
      {
        id: "exq_tout_au_moins_advanced", expressionId: "exi_tout_au_moins", band: "levels_6_8",
        format: "target_identification", contextFrench: "Le magasin a reçu tout au moins dix colis. Tout au plus trois sont endommagés; exactement deux portent une étiquette rouge et moins de cinq sont ouverts.",
        promptFrench: "Quelle expression indique que dix colis est un minimum ?",
        choicesFrench: ["tout au moins", "Tout au plus", "exactement", "moins de"], correctAnswer: "tout au moins",
      },
      {
        id: "exq_au_point_de_early", expressionId: "exi_au_point_de", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Il était épuisé au point de s’endormir debout.", targetText: "au point de",
        choicesEnglish: ["to the point of", "in the hope of", "for fear of", "with the intention of"], correctAnswer: "to the point of",
      },
      {
        id: "exq_au_point_de_intermediate", expressionId: "exi_au_point_de", band: "levels_4_5",
        format: "surface_completion", contextFrench: "Le moteur vibrait _____ faire trembler les vitres; les verres sur la table bougeaient déjà.",
        choicesFrench: ["au point de", "dans l’espoir de", "de peur de", "avec l’intention de"], correctAnswer: "au point de",
      },
      {
        id: "exq_au_point_de_advanced", expressionId: "exi_au_point_de", band: "levels_6_8",
        format: "target_identification", contextFrench: "Le moteur vibrait au point de faire trembler les vitres. Paul cherchait de l’aide dans l’espoir de le réparer. Anne attendait dehors de peur de recevoir un éclat; le propriétaire est arrivé avec l’intention de l’éteindre.",
        promptFrench: "Quelle expression indique que les vibrations du moteur atteignaient un degré extrême ?",
        choicesFrench: ["au point de", "dans l’espoir de", "de peur de", "avec l’intention de"], correctAnswer: "au point de",
      },
      {
        id: "exq_se_faire_fort_de_early", expressionId: "exi_se_faire_fort_de", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Le capitaine se fait fort de retrouver le bateau avant la nuit.", targetText: "se fait fort de",
        choicesEnglish: ["confidently undertakes to", "refuses to", "forgets to", "is forbidden to"], correctAnswer: "confidently undertakes to",
      },
      {
        id: "exq_se_faire_fort_de_intermediate", expressionId: "exi_se_faire_fort_de", band: "levels_4_5",
        format: "surface_completion", contextFrench: "Le guide _____ ramener tout le groupe avant le coucher du soleil.",
        choicesFrench: ["se fait fort de", "refuse de", "oublie de", "a peur de"], correctAnswer: "se fait fort de",
      },
      {
        id: "exq_se_faire_fort_de_advanced", expressionId: "exi_se_faire_fort_de", band: "levels_6_8",
        format: "target_identification", contextFrench: "Le guide se fait fort de retrouver le chemin. Paul refuse de partir ; Léa oublie de fermer la porte et Marie a peur de tomber.",
        promptFrench: "Quelle expression présente l’engagement assuré du guide ?",
        choicesFrench: ["se fait fort de", "refuse de", "oublie de", "a peur de"], correctAnswer: "se fait fort de",
      },
      {
        id: "exq_tout_au_long_early", expressionId: "exi_tout_au_long", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Elle a pris des notes tout au long du voyage.", targetText: "tout au long",
        choicesEnglish: ["throughout", "before", "instead of", "after"], correctAnswer: "throughout",
      },
      {
        id: "exq_tout_au_long_intermediate", expressionId: "exi_tout_au_long", band: "levels_4_5",
        format: "surface_completion", contextFrench: "Il a gardé son carnet _____ du voyage : il a écrit chaque jour.",
        choicesFrench: ["tout au long", "au début", "à la fin", "bien avant"], correctAnswer: "tout au long",
      },
      {
        id: "exq_tout_au_long_advanced", expressionId: "exi_tout_au_long", band: "levels_6_8",
        format: "target_identification", contextFrench: "Léa a dessiné tout au long du trajet. Paul a dormi au début, Marie a chanté à la fin et Luc était parti bien avant.",
        promptFrench: "Quelle expression indique une activité pendant toute la durée du trajet ?",
        choicesFrench: ["tout au long", "au début", "à la fin", "bien avant"], correctAnswer: "tout au long",
      },
      {
        id: "exq_ainsi_que_early", expressionId: "exi_ainsi_que", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Ainsi que l’a annoncé la radio, le pont est fermé.", targetText: "Ainsi que",
        choicesEnglish: ["as", "although", "because", "until"], correctAnswer: "as",
      },
      {
        id: "exq_ainsi_que_intermediate", expressionId: "exi_ainsi_que", band: "levels_4_5",
        format: "surface_completion", contextFrench: "_____ le confirme le médecin, le traitement fonctionne.",
        choicesFrench: ["ainsi que", "alors que", "parce que", "bien que"], correctAnswer: "ainsi que",
      },
      {
        id: "exq_ainsi_que_advanced", expressionId: "exi_ainsi_que", band: "levels_6_8",
        format: "target_identification", contextFrench: "Ainsi que l’a dit le médecin, le repos est utile. Paul attend alors que Léa travaille, parce que Marie est malade, bien que la salle soit ouverte.",
        promptFrench: "Quelle expression introduit ici ce qu’a dit le médecin ?",
        choicesFrench: ["Ainsi que", "alors que", "parce que", "bien que"], correctAnswer: "Ainsi que",
      },
      {
        id: "exq_quant_a_early", expressionId: "exi_quant_a", band: "levels_1_3",
        format: "meaning_choice", contextFrench: "Quant aux billets, ils sont dans le tiroir.", targetText: "Quant aux",
        choicesEnglish: ["as for", "despite", "because of", "before"], correctAnswer: "as for",
      },
      {
        id: "exq_quant_a_intermediate", expressionId: "exi_quant_a", band: "levels_4_5",
        format: "surface_completion", contextFrench: "_____ billets, ils sont déjà vendus ; parlons maintenant de leur prix.",
        choicesFrench: ["Quant aux", "Pendant les", "Malgré les", "Depuis les"], correctAnswer: "Quant aux",
      },
      {
        id: "exq_quant_a_advanced", expressionId: "exi_quant_a", band: "levels_6_8",
        format: "target_identification", contextFrench: "Quant aux billets, Léa les garde. Pendant les vacances, elle reste à Paris. Malgré les retards, elle sourit. Depuis les travaux, le hall est fermé.",
        promptFrench: "Quelle expression introduit ici le nouveau sujet des billets ?",
        choicesFrench: ["Quant aux", "Pendant les", "Malgré les", "Depuis les"], correctAnswer: "Quant aux",
      },
    ],
  };
  const diagnostics = validateExpressionCatalog(zolaSourceAcquisition, catalog);
  if (diagnostics.length) throw new Error(`Invalid offline expression questions: ${diagnostics[0]!.code}`);
  return catalog;
}
