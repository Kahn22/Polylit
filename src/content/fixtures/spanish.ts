import type { ContentBundle } from "../../domain/model.js";

const camisaTexts = [
  "Probable es que algunos de mis lectores hayan oído decir a las viejas de Lima, cuando quieren ponderar lo subido de precio de un artículo: —¡Qué! Si esto es más caro que la camisa de Margarita Pareja. Habríame quedado con la curiosidad de saber quién fue esa Margarita, cuya camisa anda en lenguas, si en La América, de Madrid, no hubiera tropezado con un artículo firmado por D. Ildefonso Antonio Bermejo (autor de un notable libro sobre el Paraguay) quien, aunque muy a la ligera habla de la niña y de su camisa, me puso en vía de desenredar el ovillo, alcanzando a sacar en limpio la historia que van ustedes a leer.",
  "Margarita Pareja era (por los años de 1765) la hija más mimada de D. Raimundo Pareja, caballero de Santiago y colector general del Callao.",
  "La muchacha era una de esas limeñitas que por su belleza cautivan al mismo diablo y lo hacen persignarse y tirar piedras. Lucía un par de ojos negros que eran como dos torpedos cargados con dinamita y que hacían explosión sobre las entretelas del alma de los galanes limeños.",
  "Llegó por entonces de España un arrogante mancebo, hijo de la coronada villa del oso y del madroño, llamado D. Luis Alcázar. Tenía éste en Lima un tío solterón y acaudalado, aragonés rancio y linajudo, y que gastaba más orgullo que los hijos del rey Fruela.",
  "Por supuesto que, mientras le llegaba la ocasión de heredar al tío, vivía nuestro D. Luis tan pelado como una rata y pasando la pena negra. Con decir que hasta sus trapicheos eran al fiado y para pagar cuando mejorase de fortuna, creo que digo lo preciso.",
  "En la procesión de Santa Rosa conoció Alcázar a la linda Margarita. La muchacha le llenó el ojo y le flechó el corazón. La echó flores, y aunque ella no le contestó ni sí ni no, dio a entender con sonrisitas y demás armas del arsenal femenino que el galán era plato muy de su gusto. La verdad, como si me estuviera confesando, es que se enamoraron hasta la raíz del pelo.",
  "Como los amantes olvidan que existe la aritmética, creyó D. Luis que para el logro de sus amores no sería obstáculo su presente pobreza, y fue al padre de Margarita y sin muchos perfiles le pidió la mano de su hija.",
  "A D. Raimundo no le cayó en gracia la petición, y cortésmente despidió al postulante, diciéndole que Margarita era aún muy niña para tomar marido; pues a pesar de sus diez y ocho años, todavía jugaba a las muñecas.",
  "Pero no era ésta la verdadera madre del ternero. La negativa nacía de que D. Raimundo no quería ser suegro de un pobretón; y así hubo de decirlo en confianza a sus amigos, uno de los que fue con el chisme a don Honorato, que así se llamaba el tío aragonés. Éste, que era más altivo que el Cid, trinó de rabia y dijo: —¡Cómo se entiende! ¡Desairar a mi sobrino! Muchos se darían con un canto en el pecho por emparentar con el muchacho, que no lo hay más gallardo en todo Lima. ¡Habrase visto insolencia de la laya! Pero ¿adónde ha de ir conmigo ese colectorcillo de mala muerte?",
  "Margarita, que se anticipaba a su siglo, pues era nerviosa como una damisela de hoy, gimoteó, y se arrancó el pelo, y tuvo pataleta, y si no amenazó con envenenarse fue porque todavía no se habían inventado los fósforos.",
  "Margarita perdía colores y carnes, se desmejoraba a vista de ojos, hablaba de meterse monja, y no hacía nada en concierto. «¡O de Luis o de Dios!» gritaba cada vez que los nervios se le sublevaban, lo que acontecía una hora sí y otra también. Alarmose el caballero santiagués, llamó físicos y curanderas, y todos declararon que la niña tiraba a tísica, y que la única medicina salvadora no se vendía en la botica.",
  "O casarla con el varón de su gusto, o encerrarla en el cajón con palma y corona. Tal fue el ultimátum médico.",
  "D. Raimundo (¡al fin padre!), olvidándose de coger capa y bastón, se encaminó como loco a casa de D. Honorato, y lo dijo: —Vengo a que consienta usted en que mañana mismo se case su sobrino con Margarita, porque si no la muchacha se nos va por la posta. —No puede ser —contestó con desabrimiento el tío—. Mi sobrino es un pobretón, y lo que usted debe buscar para su hija es un hombre que varee la plata.",
  "El diálogo fue borrascoso. Mientras más rogaba D. Raimundo, más se subía el aragonés a la parra, y ya aquél iba a retirarse desahuciado cuando D. Luis, terciando en la cuestión, dijo: —Pero, tío, no es de cristianos que matemos a quien no tiene la culpa. —¿Tú te das por satisfecho? —De todo corazón, tío y señor. —Pues bien, muchacho: consiento en darte gusto; pero con una condición, y es esta: D. Raimundo me ha de jurar ante la Hostia consagrada que no regalará un ochavo a su hija ni la dejará un real en la herencia.",
  "Aquí se entabló nuevo y más agitado litigio. —Pero, hombre —arguyó D. Raimundo—, mi hija tiene veinte mil duros de dote. —Renunciamos a la dote. La niña vendrá a casa de su marido nada más que con lo encapillado. —Concédame usted entonces obsequiarla los muebles y el ajuar de novia. —Ni un alfiler. Si no acomoda, dejarlo y que se muera la chica. —Sea usted razonable, D. Honorato. Mi hija necesita llevar siquiera una camisa para reemplazar la puesta. —Bien: paso por esa funda para que no me acuse de obstinado. Consiento en que le regale la camisa de novia, y san se acabó.",
  "Al día siguiente D. Raimundo y D. Honorato se dirigieron muy de mañana a San Francisco, arrodillándose para oír misa y, según lo pactado, en el momento en que el sacerdote elevaba la Hostia divina, dijo el padre de Margarita: —Juro no dar a mi hija más que la camisa de novia. Así Dios me condene si perjurare.",
  "Y D. Raimundo Pareja cumplió ad pedem litterae su juramento; porque ni en vida ni en muerte dio después a su hija cosa que valiera un maravedí.",
  "Los encajes de Flandes que adornaban la camisa de la novia costaron dos mil setecientos duros. El cordoncillo que ajustaba al cuello era una cadeneta de brillantes, valorizada en treinta mil monedas de plata.",
  "Los recién casados hicieron creer al tío aragonés que la camisa a lo más valdría una onza; porque D. Honorato era tan testarudo que, a saberlo cierto, habría forzado al sobrino a divorciarse.",
  "Convengamos en que fue muy merecida la fama que alcanzó la camisa nupcial de Margarita Pareja.",
] as const;

const almohadonTexts = [
  "Su luna de miel fue un largo escalofrío. Rubia, angelical y tímida, el carácter duro de su marido heló sus soñadas niñerías de novia. Lo quería mucho; sin embargo, a veces sentía un ligero estremecimiento cuando, volviendo de noche juntos por la calle, echaba una furtiva mirada a la alta estatura de Jordán, mudo desde hacía una hora. Él, por su parte, la amaba profundamente, sin darlo a conocer.",
  "Durante tres meses —se habían casado en abril— vivieron una dicha especial. Sin duda hubiera ella deseado menos severidad en ese rígido cielo de amor, más expansiva e incauta ternura; pero el impasible semblante de su marido la contenía siempre.",
  "La casa en que vivían influía un poco en sus estremecimientos. La blancura del patio silencioso —frisos, columnas y estatuas de mármol— producía una otoñal impresión de palacio encantado. Dentro, el brillo glacial del estuco, sin el más leve rasguño en las altas paredes, afirmaba aquella sensación de desapacible frío. Al cruzar de una pieza a otra, los pasos hallaban eco en toda la casa, como si un largo abandono hubiera sensibilizado su resonancia.",
  "En ese extraño nido de amor, Alicia pasó todo el otoño. No obstante, había concluido por echar un velo sobre sus antiguos sueños, y aún vivía dormida en la casa hostil, sin querer pensar en nada hasta que llegaba su marido.",
  "No es raro que adelgazara. Tuvo un ligero ataque de influenza que se arrastró insidiosamente días y días; Alicia no se reponía nunca. Al fin, una tarde pudo salir al jardín apoyada en el brazo de él. Miraba indiferente a uno y otro lado. De pronto Jordán, con honda ternura, le pasó la mano por la cabeza, y Alicia rompió enseguida en sollozos, echándole los brazos al cuello. Lloró largamente todo su espanto callado, redoblando el llanto a la menor tentativa de caricia.",
  "Luego los sollozos fueron retardándose, y aún quedó largo rato escondida en su cuello, sin moverse ni decir una palabra.",
  "Fue ese el último día que Alicia estuvo levantada. Al día siguiente amaneció desvanecida. El médico de Jordán la examinó con suma atención, ordenándole calma y descanso absolutos.",
  "—No sé —le dijo a Jordán en la puerta de calle, con la voz todavía baja—. Tiene una gran debilidad que no me explico, y sin vómitos, nada. Si mañana se despierta como hoy, llámeme enseguida.",
  "Al otro día Alicia seguía peor. Hubo consulta. Constatose una anemia de marcha agudísima, completamente inexplicable. Alicia no tuvo más desmayos, pero se iba visiblemente a la muerte. Todo el día el dormitorio estaba con las luces encendidas y en pleno silencio. Pasábanse horas sin oír el menor ruido. Alicia dormitaba. Jordán vivía casi en la sala, también con toda la luz encendida. Paseábase sin cesar de un extremo a otro, con incansable obstinación. La alfombra ahogaba sus pasos.",
  "A ratos entraba en el dormitorio y proseguía su mudo vaivén a lo largo de la cama, mirando a su mujer cada vez que caminaba en su dirección.",
  "Pronto Alicia comenzó a tener alucinaciones, confusas y flotantes al principio, y que descendieron luego a ras del suelo. La joven, con los ojos desmesuradamente abiertos, no hacía sino mirar la alfombra a uno y otro lado del respaldo de la cama. Una noche se quedó de repente mirando fijamente. Al rato abrió la boca para gritar, y sus narices y labios se perlaron de sudor.",
  "—¡Jordán! ¡Jordán! —clamó, rígida de espanto, sin dejar de mirar la alfombra.",
  "Jordán corrió al dormitorio y, al verlo aparecer, Alicia dio un alarido de horror.",
  "—¡Soy yo, Alicia, soy yo!",
  "Alicia lo miró con extravío, miró la alfombra, volvió a mirarlo y, después de largo rato de estupefacta confrontación, se serenó. Sonrió y tomó entre las suyas la mano de su marido, acariciándola y temblando.",
  "Entre sus alucinaciones más porfiadas, hubo un antropoide apoyado en la alfombra sobre los dedos, que tenía fijos en ella los ojos.",
  "Los médicos volvieron inútilmente. Había allí delante de ellos una vida que se acababa, desangrándose día a día, hora a hora, sin saber absolutamente cómo. En la última consulta Alicia yacía en estupor mientras ellos la pulsaban, pasándose de uno a otro la muñeca inerte. La observaron largo rato en silencio y siguieron al comedor.",
  "—Es un caso serio —se encogió de hombros, desalentado, su médico—. Poco hay que hacer.",
  "—¡Solo eso me faltaba! —resopló Jordán, y tamborileó bruscamente sobre la mesa.",
  "Alicia fue extinguiéndose en subdelirio de anemia, agravado de tarde, pero que remitía siempre en las primeras horas. Durante el día no avanzaba su enfermedad, pero cada mañana amanecía lívida, en síncope casi. Parecía que únicamente de noche se le fuera la vida en nuevas olas de sangre. Tenía siempre, al despertar, la sensación de estar desplomada en la cama con un millón de kilos encima.",
  "Desde el tercer día este hundimiento no la abandonó más. Apenas podía mover la cabeza. No quiso que le tocaran la cama, ni aun que le arreglaran el almohadón. Sus terrores crepusculares avanzaron en forma de monstruos que se arrastraban hasta la cama y trepaban dificultosamente por la colcha.",
  "Perdió luego el conocimiento. Los dos días finales deliró sin cesar a media voz. Las luces continuaban fúnebremente encendidas en el dormitorio y la sala. En el silencio agónico de la casa, no se oía más que el delirio monótono que salía de la cama y el rumor ahogado de los eternos pasos de Jordán.",
  "Murió, por fin. La sirvienta, que entró después a deshacer la cama, sola ya, miró un rato extrañada el almohadón.",
  "—¡Señor! —llamó a Jordán en voz baja—. En el almohadón hay manchas que parecen de sangre.",
  "Jordán se acercó rápidamente y se dobló a su vez. Efectivamente, sobre la funda, a ambos lados del hueco que había dejado la cabeza de Alicia, se veían manchitas oscuras.",
  "—Parecen picaduras —murmuró la sirvienta después de un rato de inmóvil observación.",
  "—Levántelo a la luz —le dijo Jordán.",
  "La sirvienta lo levantó, pero enseguida lo dejó caer y se quedó mirándolo, lívida y temblando. Sin saber por qué, Jordán sintió que los cabellos se le erizaban.",
  "—¿Qué hay? —murmuró con la voz ronca.",
  "—Pesa mucho —articuló la sirvienta, sin dejar de temblar.",
  "Jordán lo levantó; pesaba extraordinariamente. Salieron con él, y sobre la mesa del comedor Jordán cortó funda y envoltura de un tajo. Las plumas superiores volaron, y la sirvienta dio un grito de horror con toda la boca abierta, llevándose las manos crispadas a los bandós: sobre el fondo, entre las plumas, moviendo lentamente las patas velludas, había un animal monstruoso, una bola viviente y viscosa. Estaba tan hinchado que apenas se le pronunciaba la boca.",
  "Noche a noche, desde que Alicia había caído en cama, había aplicado sigilosamente su boca —su trompa, mejor dicho— a las sienes de aquella, chupándole la sangre. La picadura era casi imperceptible. La remoción diaria del almohadón había impedido sin duda su desarrollo, pero desde que la joven no pudo moverse, la succión fue vertiginosa. En cinco días, en cinco noches, había vaciado a Alicia.",
  "Estos parásitos de las aves, diminutos en el medio habitual, llegan a adquirir en ciertas condiciones proporciones enormes. La sangre humana parece serles particularmente favorable, y no es raro hallarlos en los almohadones de pluma.",
] as const;

function units(workKey: string, workId: string, texts: readonly string[]) {
  return texts.map((french, index) => ({ id: `unt_${workKey}_${String(index + 1).padStart(3, "0")}`, workId, ordinal: index + 1, french }));
}

export const camisaThoughtUnits = units("palma_camisa", "wrk_palma_camisa_margarita", camisaTexts);
export const almohadonThoughtUnits = units("quiroga_almohadon", "wrk_quiroga_almohadon_plumas", almohadonTexts);

export const spanishSourceAcquisition: ContentBundle = {
  authors: [
    { id: "aut_ricardo_palma", name: "Ricardo Palma", sortName: "Palma, Ricardo" },
    { id: "aut_horacio_quiroga", name: "Horacio Quiroga", sortName: "Quiroga, Horacio" },
  ],
  collections: [
    { id: "col_palma_tradiciones_peruanas", authorId: "aut_ricardo_palma", title: "Tradiciones peruanas", language: "es" },
    { id: "col_quiroga_cuentos_amor_locura_muerte", authorId: "aut_horacio_quiroga", title: "Cuentos de amor de locura y de muerte", language: "es" },
  ],
  books: [
    { id: "bok_palma_tradiciones_quinta", collectionId: "col_palma_tradiciones_peruanas", ordinal: 1, title: "Quinta serie" },
    { id: "bok_quiroga_cuentos_1918", collectionId: "col_quiroga_cuentos_amor_locura_muerte", ordinal: 1, title: "Edición de 1918" },
  ],
  works: [
    { id: "wrk_palma_camisa_margarita", bookId: "bok_palma_tradiciones_quinta", ordinal: 1, title: "La camisa de Margarita", publicationState: "source_structured", originCountryCode: "PE", originCountryName: "Peru", originCountryFlag: "🇵🇪" },
    { id: "wrk_quiroga_almohadon_plumas", bookId: "bok_quiroga_cuentos_1918", ordinal: 1, title: "El almohadón de plumas", publicationState: "source_structured", originCountryCode: "UY", originCountryName: "Uruguay", originCountryFlag: "🇺🇾", contentAdvisory: "Dark horror involving illness and death" },
  ],
  sources: [
    { workId: "wrk_palma_camisa_margarita", canonicalText: camisaTexts.join("\n"), provenance: { citation: "Ricardo Palma, «La camisa de Margarita», Tradiciones peruanas, quinta serie (1893 edition)", url: "https://es.wikisource.org/wiki/La_camisa_de_Margarita", accessedOn: "2026-09-19" }, typographyPolicy: "modern_conventional_typography_preserving_wording" },
    { workId: "wrk_quiroga_almohadon_plumas", canonicalText: almohadonTexts.join("\n"), provenance: { citation: "Horacio Quiroga, «El almohadón de pluma», Cuentos de amor de locura y de muerte (1918)", url: "https://es.wikisource.org/wiki/El_almohad%C3%B3n_de_pluma", accessedOn: "2026-09-19" }, typographyPolicy: "modern_conventional_typography_preserving_wording" },
  ],
  units: [...camisaThoughtUnits, ...almohadonThoughtUnits],
  lemmas: [], senses: [], surfaceForms: [], occurrences: [], exclusions: [], expressions: [], notes: [
    { id: "not_palma_camisa_orthography", workId: "wrk_palma_camisa_margarita", text: "Modern conventional typography and spelling are used while preserving the source wording; abbreviated honorifics and named people and places are excluded from learner vocabulary.", kind: "source" },
    { id: "not_quiroga_almohadon_advisory", workId: "wrk_quiroga_almohadon_plumas", text: "Content advisory: dark horror involving illness and death.", kind: "editorial" },
  ], quizItems: [],
  readiness: ["wrk_palma_camisa_margarita", "wrk_quiroga_almohadon_plumas"].map((workId) => ({ workId, thoughtUnitsComplete: true, occurrencesReviewed: false, unresolvedLearnerTokens: ["linguistic annotation pending"] })),
};
