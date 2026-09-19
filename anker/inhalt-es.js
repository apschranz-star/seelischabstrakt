/*
 * El contenido de Anker en español.
 *
 * Este archivo es la traducción de inhalt-de.js. La estructura es idéntica:
 * las mismas claves, los mismos id, las mismas fuentes. Solo se traduce el
 * texto legible.
 */

window.INHALT = window.INHALT || {};
window.INHALT.es = {

/* ------------------------------------------------------------------ Signos */

symptome: [
  "Dolor articular",
  "Rigidez matutina",
  "Eritema en alas de mariposa",
  "Otra erupción cutánea",
  "Fotosensibilidad",
  "Úlceras en la boca",
  "Caída del cabello",
  "Fiebre",
  "Ganglios inflamados",
  "Raynaud",
  "Ojos secos",
  "Boca seca",
  "Dolor de cabeza",
  "Dolor torácico al respirar",
  "Palpitaciones",
  "Falta de aire",
  "Dolor abdominal",
  "Hinchazón abdominal",
  "Diarrea",
  "Estreñimiento",
  "Náuseas",
  "Piernas hinchadas",
  "Orina espumosa",
  "Dolor muscular",
],

/* ------------------------------------------------------------------ Comer */

essen: [
  {
    kicker: "Enfermedad celíaca",
    titel: "La regla sin excepción",
    lead:
      "En la enfermedad celíaca la alimentación sin gluten no es una dieta más, " +
      "sino el tratamiento. Vale de por vida y también cuando después de una cantidad " +
      "pequeña no notas nada: el daño en la mucosa intestinal se produce también sin síntomas.",
    punkte: [
      { art: "nein", was: "Trigo en cualquier forma", warum: "La espelta, el farro, la escanda menor, el kamut, la espelta verde y el almidón de trigo sin declarar entran aquí. Los cereales antiguos también son trigo." },
      { art: "nein", was: "Cebada y centeno", warum: "La malta, el extracto de malta, el aroma de malta y la cerveza de cebada son los tropiezos más frecuentes." },
      { art: "vielleicht", was: "Avena", warum: "La avena en sí no contiene gluten, pero casi siempre se procesa junto con trigo. Solo avena declarada expresamente sin gluten, y aun así una pequeña minoría no la tolera." },
      { art: "ja", was: "Arroz, maíz, trigo sarraceno, mijo, quinoa, amaranto, teff", warum: "Sin gluten por naturaleza. El trigo sarraceno, pese al nombre, no es trigo." },
      { art: "ja", was: "Patata, legumbres, frutos secos, semillas", warum: "Sostienen la comida cuando falta el pan, y aportan además proteína y fibra." },
      { art: "ja", was: "Carne, pescado, huevo, lácteos, fruta y verdura sin procesar", warum: "Todo lo que no lleva lista de ingredientes es la parte segura de la compra." },
    ],
  },
  {
    kicker: "Dónde se tuerce",
    titel: "Escondido y pasado por alto",
    lead:
      "La mayoría de las exposiciones al gluten en el día a día no vienen de un pan, " +
      "sino de una pequeñez en la que nadie piensa.",
    punkte: [
      { art: "nein", was: "Salsa de soja", warum: "La salsa de soja clásica se elabora con trigo. El tamari suele ser sin gluten, pero solo con la declaración correspondiente." },
      { art: "nein", was: "Freidoras con rebozados", warum: "Las patatas fritas de la misma freidora en la que se fríe rebozado no son sin gluten. Pregúntalo en el local." },
      { art: "nein", was: "Tostadora compartida", warum: "Bastan las migas. Una tostadora propia o una bolsa para tostar lo resuelve." },
      { art: "nein", was: "Espesantes en salsas y sopas", warum: "Roux, pastillas de caldo, espesantes de salsa, adobos preparados." },
      { art: "vielleicht", was: "Medicamentos y complementos alimenticios", warum: "Es raro, pero el almidón puede estar presente como excipiente. Pide que te lo consulten en la farmacia." },
      { art: "vielleicht", was: "Puede contener trazas", warum: "Es una indicación voluntaria del fabricante, no una medición. En cambio, lo que lleva el símbolo de la espiga barrada o se declara sin gluten está sujeto al límite legal de 20 mg de gluten por kilogramo." },
      { art: "vielleicht", was: "Besos, mantequilla compartida, tabla del pan", warum: "En casa ayudan una mantequera propia, una tabla propia y untables en los que entre un solo cuchillo." },
    ],
  },
  {
    kicker: "En el lupus",
    titel: "Lo que sugiere la investigación",
    lead:
      "Ninguna alimentación cura el lupus, y ningún estudio demuestra que un cambio de dieta " +
      "sustituya a los medicamentos. Lo que hay son patrones que en los estudios se asocian con " +
      "menos actividad de la enfermedad, mejores lípidos en sangre y menos fatiga. La solidez de " +
      "estas pruebas está en el capítulo Conocimiento, en cada punto.",
    punkte: [
      { art: "ja", was: "Patrón mediterráneo", warum: "Verdura, fruta, legumbres, aceite de oliva, pescado, frutos secos; poca carne roja y procesada. En estudios observacionales en lupus se asocia con menor actividad de la enfermedad." },
      { art: "ja", was: "Pescado azul dos veces por semana", warum: "Salmón, caballa, arenque, sardina. Los omega 3 se han estudiado en el lupus en varios ensayos controlados pequeños." },
      { art: "ja", was: "Proteína suficiente a lo largo del día", warum: "Mantiene el músculo, y el músculo es lo primero que se pierde con la fatiga y con los glucocorticoides." },
      { art: "ja", was: "Buscar fibra a propósito", warum: "La cocina sin gluten es pobre en fibra de por sí. Legumbres, linaza, verdura, fruta con piel." },
      { art: "vielleicht", was: "Poca sal", warum: "En animales, mucha sal favorece los linfocitos T inflamatorios. En personas con lupus eso no está demostrado. Por la tensión arterial y por el riñón sigue siendo razonable." },
      { art: "vielleicht", was: "Alcohol", warum: "Con metotrexato y pensando en el hígado, es un tema para la consulta, no para una aplicación." },
    ],
  },
  {
    kicker: "Precaución",
    titel: "Lo que en el lupus es mejor dejar fuera",
    lead:
      "Lista corta, y cada punto tiene un motivo concreto. Todo lo demás que circula por internet " +
      "como prohibición en el lupus por lo general no resiste una revisión.",
    punkte: [
      { art: "nein", was: "Brotes de alfalfa y preparados de alfalfa", warum: "Contienen L-canavanina. Hay casos publicados de cuadros parecidos al lupus y experimentos en monos. Las pruebas son antiguas y débiles, pero renunciar a ellos no cuesta nada, por eso este punto aparece en casi toda recomendación para pacientes." },
      { art: "nein", was: "Preparados que estimulan el sistema inmunitario", warum: "La equinácea y productos similares que se venden expresamente para estimular las defensas. En una enfermedad en la que el sistema inmunitario ya hace de más, esa es la dirección equivocada." },
      { art: "vielleicht", was: "Preparados aislados a dosis altas por tu cuenta", warum: "Sobre todo lo que tiene que ver con el hierro: el hierro solo se repone cuando se ha medido una carencia." },
      { art: "vielleicht", was: "Pomelo", warum: "Altera el metabolismo de algunos medicamentos. Si afecta a los tuyos, en la farmacia te lo dicen en un minuto." },
      { art: "nein", was: "Fumar", warum: "Aumenta la actividad de la enfermedad, empeora el efecto de la hidroxicloroquina y eleva el riesgo cardiovascular, que ya está aumentado de por sí." },
    ],
  },
  {
    kicker: "Las dos juntas",
    titel: "Nutrientes que aquí fallan por partida doble",
    lead:
      "La enfermedad celíaca daña la absorción, el lupus y su tratamiento aumentan las necesidades o " +
      "las pérdidas. Estos valores hay que medirlos, no adivinarlos, y solo se repone lo que falta.",
    punkte: [
      { art: "vielleicht", was: "Hierro y ferritina", warum: "La carencia más frecuente en la enfermedad celíaca, y una causa muy frecuente de fatiga que no tiene nada que ver con el lupus." },
      { art: "vielleicht", was: "Vitamina D", warum: "En el lupus está amenazada por partida doble: se evita el sol, los glucocorticoides aumentan las pérdidas, y en la enfermedad celíaca el intestino absorbe peor." },
      { art: "vielleicht", was: "Vitamina B12 y ácido fólico", warum: "Ambos se absorben en el intestino delgado, justo donde actúa la enfermedad celíaca. Además, la harina sin gluten rara vez está enriquecida." },
      { art: "vielleicht", was: "Calcio", warum: "Importante para el hueso, y el hueso está bajo presión doble en la enfermedad celíaca y con glucocorticoides." },
      { art: "vielleicht", was: "Zinc y magnesio", warum: "En la enfermedad celíaca se miden también cuando los síntomas persisten." },
    ],
  },
  {
    kicker: "Ser honestos",
    titel: "Las trampas de la cocina sin gluten",
    lead:
      "Sin gluten no significa sano. Los productos sin gluten preparados son a menudo almidón puro, " +
      "pobres en fibra y más caros. Es un problema conocido, no un fracaso personal.",
    punkte: [
      { art: "vielleicht", was: "Poca fibra", warum: "El almidón de arroz, el almidón de maíz y la tapioca apenas aportan. Las legumbres, la linaza, la cáscara de psyllium y la verdura lo compensan." },
      { art: "vielleicht", was: "Mucho almidón rápido", warum: "El pan blanco sin gluten sube la glucosa en sangre más bruscamente que el original. Combínalo con proteína y grasa." },
      { art: "vielleicht", was: "El arroz como base principal", warum: "El arroz capta arsénico del suelo. No es motivo de pánico, pero sí para ir alternando trigo sarraceno, mijo, quinoa, patata y maíz en lugar de arroz cada día." },
      { art: "vielleicht", was: "Pocas vitaminas del grupo B", warum: "En muchos países la harina de trigo está enriquecida, la harina sin gluten casi nunca." },
    ],
  },
],

/* ------------------------------------------------------------------ Recetas */

rezepte: [
  {
    name: "Plato sin cocinar",
    aufwand: "0 minutos",
    warum:
      "Para los días en los que la cocina queda demasiado lejos. Aun así proteína, grasa y " +
      "algo verde, y con eso mejor que nada o que una galleta.",
    zutaten: [
      "1 lata de sardinas o caballa en aceite de oliva",
      "1 puñado de tomates cherry o pepino",
      "Tortitas de arroz o pan sin gluten",
      "Aceite de oliva, limón, sal",
    ],
    schritte: [
      "Abre la lata y ponla en el plato.",
      "Añade la verdura, sin cortarla si no hace falta.",
      "Limón por encima, aceite por encima, listo.",
    ],
    achtung: "Las tortitas de arroz solo como acompañamiento, no como base de cada día. Las sardinas aportan omega 3, calcio y vitamina D.",
  },
  {
    name: "Avena remojada de un día para otro, sin gluten",
    aufwand: "3 minutos por la noche",
    warum: "Por la mañana el desayuno ya está hecho. Fibra y hierro de las semillas.",
    zutaten: [
      "50 g de copos de avena sin gluten",
      "150 ml de leche o bebida vegetal",
      "1 cucharada de linaza molida o de semillas de chía",
      "1 cucharadita de crema de frutos secos",
      "Fruta",
    ],
    schritte: [
      "Todo en un tarro, remueve, cierra.",
      "Toda la noche en la nevera.",
      "Por la mañana, la fruta por encima.",
    ],
    achtung: "Solo avena declarada expresamente sin gluten. Una pequeña minoría con enfermedad celíaca tampoco tolera la avena pura; después de introducirla, fíjate en los síntomas y coméntalo con tu médica.",
  },
  {
    name: "Sopa de lentejas",
    aufwand: "25 minutos, una olla",
    warum:
      "Hierro, fibra y proteína a partir de un ingrediente barato. Aguanta tres días en la nevera " +
      "y se puede congelar en raciones, que en los días malos vale más que cualquier receta.",
    zutaten: [
      "200 g de lentejas rojas",
      "1 cebolla, 2 dientes de ajo, 2 zanahorias",
      "1 cucharada de concentrado de tomate",
      "1 cucharadita de comino, 1 cucharadita de pimentón",
      "1 l de caldo de verduras sin gluten",
      "Limón, aceite de oliva",
    ],
    schritte: [
      "Pica la cebolla, el ajo y la zanahoria y póchalos en aceite.",
      "Añade el concentrado de tomate y las especias y tuéstalos un momento.",
      "Añade las lentejas y el caldo, cuece 20 minutos.",
      "Ajusta de sabor con limón. El limón aquí no es un adorno: la vitamina C mejora claramente la absorción del hierro de origen vegetal.",
    ],
    achtung: "Revisa el caldo, muchas pastillas contienen trigo.",
  },
  {
    name: "Salmón al horno, verdura al lado",
    aufwand: "25 minutos, una bandeja",
    warum: "Omega 3 y vitamina D en un solo plato, y la bandeja es toda la vajilla que hay que fregar.",
    zutaten: [
      "2 lomos de salmón",
      "Brócoli, pimiento, calabacín, lo que haya",
      "Aceite de oliva, sal, limón",
      "Patatas en gajos",
    ],
    schritte: [
      "Horno a 200 grados.",
      "Patatas y verdura con aceite y sal en la bandeja, 15 minutos.",
      "Añade el salmón, de 10 a 12 minutos más.",
      "Limón por encima.",
    ],
  },
  {
    name: "Bol de trigo sarraceno",
    aufwand: "20 minutos",
    warum: "Trigo sarraceno en lugar de arroz, para que no haya arroz en el plato cada día.",
    zutaten: [
      "150 g de trigo sarraceno",
      "1 lata de garbanzos",
      "Pepino, tomate, cebolla roja",
      "Yogur o tahín, limón, aceite de oliva",
      "Perejil",
    ],
    schritte: [
      "Cuece el trigo sarraceno de 12 a 15 minutos en agua con sal, escúrrelo y déjalo enfriar.",
      "Corta la verdura, enjuaga los garbanzos.",
      "Mézclalo todo y añade por encima una salsa de yogur o tahín con limón.",
    ],
    achtung: "El trigo sarraceno no es trigo, pero en el estante suele estar junto a la harina. Fíjate en el etiquetado.",
  },
  {
    name: "Curry de garbanzos",
    aufwand: "20 minutos, una olla",
    warum: "Hierro y fibra, y el segundo día sabe mejor.",
    zutaten: [
      "2 latas de garbanzos",
      "1 lata de tomate, 1 lata de leche de coco",
      "Cebolla, ajo, jengibre",
      "Curry en polvo o garam masala",
      "Espinacas, frescas o congeladas",
    ],
    schritte: [
      "Sofríe la cebolla, el ajo y el jengibre, tuesta un momento las especias.",
      "Añade el tomate y la leche de coco, cuece 10 minutos.",
      "Incorpora los garbanzos y las espinacas, deja que se termine de hacer.",
    ],
    achtung: "Las pastas de curry y las mezclas de especias preparadas pueden llevar trigo como soporte.",
  },
  {
    name: "Verdura al horno para tener hecha",
    aufwand: "40 minutos, de ellos 5 de trabajo",
    warum:
      "La verdadera respuesta a la fatiga no es una receta rápida, sino una nevera en la que ya " +
      "hay algo hecho. Una vez una bandeja, tres días de guarnición.",
    zutaten: [
      "La verdura que haya, en trozos grandes",
      "Aceite de oliva, sal, hierbas",
      "Y una bandeja de patatas o boniatos",
    ],
    schritte: [
      "Todo en dos bandejas, aceite por encima, 200 grados, de 35 a 40 minutos.",
      "En frío, en recipientes en la nevera.",
      "Después conviértelo en comida con huevo, garbanzos, pescado o yogur.",
    ],
  },
  {
    name: "Despertador verde",
    aufwand: "4 minutos",
    warum: "Cuando masticar es demasiado. No sustituye a las comidas, pero es mejor que saltarse una.",
    zutaten: [
      "1 puñado de espinacas",
      "1 plátano, 1 puñado de bayas",
      "1 cucharada de crema de frutos secos o de linaza",
      "Yogur o bebida vegetal",
      "El zumo de media naranja",
    ],
    schritte: ["Todo a la batidora.", "No dejes fuera la naranja, la vitamina C saca el hierro de las espinacas."],
  },
],

/* -------------------------------------------------------------- Analítica */

laborwerte: [
  { schluessel: "dsdna", gruppe: "Lupus", name: "Anti-ADN nativo", einheit: "IU/ml", bedeutung: "Un anticuerpo que en el lupus sube y baja a menudo con la actividad de la enfermedad. Valores que suben son una señal, no un diagnóstico." },
  { schluessel: "c3", gruppe: "Lupus", name: "Complemento C3", einheit: "g/l", bedeutung: "Suele bajar cuando el lupus está activo, porque el complemento se consume en el proceso inflamatorio." },
  { schluessel: "c4", gruppe: "Lupus", name: "Complemento C4", einheit: "g/l", bedeutung: "Como el C3. Los dos juntos se leen como evolución, no como valor aislado." },
  { schluessel: "bsg", gruppe: "Inflamación", name: "Velocidad de sedimentación", einheit: "mm/h", bedeutung: "Se eleva de forma inespecífica con la inflamación. En el lupus suele estar alta mientras la PCR se mantiene normal." },
  { schluessel: "crp", gruppe: "Inflamación", name: "PCR", einheit: "mg/l", bedeutung: "En el lupus suele ser normal. Una PCR claramente elevada orienta más bien hacia una infección, lo que importa bajo inmunosupresión." },
  { schluessel: "kreatinin", gruppe: "Riñón", name: "Creatinina", einheit: "mg/dl", bedeutung: "Medida de la función renal." },
  { schluessel: "upcr", gruppe: "Riñón", name: "Cociente proteína-creatinina en orina", einheit: "mg/g", bedeutung: "El aviso precoz más importante de una afectación renal. La proteína en la orina no duele y solo se nota si se busca." },
  { schluessel: "hb", gruppe: "Hemograma", name: "Hemoglobina", einheit: "g/dl", bedeutung: "La anemia es una de las causas físicas más frecuentes de fatiga y es frecuente tanto en el lupus como en la enfermedad celíaca." },
  { schluessel: "leuko", gruppe: "Hemograma", name: "Leucocitos", einheit: "/nl", bedeutung: "En el lupus suelen estar bajos, y con algunos medicamentos su evolución es un valor de seguridad." },
  { schluessel: "thrombo", gruppe: "Hemograma", name: "Plaquetas", einheit: "/nl", bedeutung: "Pueden estar bajas en el lupus." },
  { schluessel: "ttg", gruppe: "Enfermedad celíaca", name: "tTG-IgA", einheit: "U/ml", bedeutung: "El valor de seguimiento de la enfermedad celíaca. Con una alimentación sin gluten estricta baja a lo largo de meses. Un valor que vuelve a subir apunta a ingesta de gluten." },
  { schluessel: "iga", gruppe: "Enfermedad celíaca", name: "IgA total", einheit: "g/l", bedeutung: "Se determina una vez: con déficit de IgA el tTG-IgA saldría falsamente bajo y la prueba no valdría nada." },
  { schluessel: "ferritin", gruppe: "Nutrientes", name: "Ferritina", einheit: "ng/ml", bedeutung: "Depósito de hierro. Atención: la ferritina también sube con la inflamación, por eso en el lupus se lee junto con la PCR." },
  { schluessel: "vitd", gruppe: "Nutrientes", name: "Vitamina D, 25-OH", einheit: "ng/ml", bedeutung: "En el lupus suele estar baja, porque se evita el sol y los glucocorticoides aumentan las pérdidas." },
  { schluessel: "b12", gruppe: "Nutrientes", name: "Vitamina B12", einheit: "pg/ml", bedeutung: "Se absorbe en el intestino delgado, es decir, justo donde actúa la enfermedad celíaca." },
  { schluessel: "folat", gruppe: "Nutrientes", name: "Ácido fólico", einheit: "ng/ml", bedeutung: "Como la B12. Especialmente importante si hay deseo de tener hijos y con algunos medicamentos." },
  { schluessel: "tsh", gruppe: "Tiroides", name: "TSH", einheit: "mU/l", bedeutung: "Un tiroides que funciona poco produce exactamente la fatiga que se le atribuye al lupus. Las enfermedades autoinmunes del tiroides son más frecuentes en ambas enfermedades de base." },
],

/* ----------------------------------------------------- Señales de alarma */

warnzeichen: [
  {
    kicker: "Inmediatamente",
    titel: "Llamada de emergencia o urgencias",
    punkte: [
      { dringend: "nein", zeichen: "Falta de aire o dolor torácico intenso", warum: "Puede significar embolia pulmonar, pericarditis o pleuritis. En el lupus el riesgo de trombos está aumentado, sobre todo con anticuerpos antifosfolípido." },
      { dringend: "nein", zeichen: "Debilidad repentina, alteración del habla o de la visión", warum: "Signos de ictus. En el lupus hay que tomarlos en serio a cualquier edad." },
      { dringend: "nein", zeichen: "Crisis convulsiva o confusión intensa", warum: "Puede ser una afectación del sistema nervioso." },
      { dringend: "nein", zeichen: "Fiebre alta bajo inmunosupresión", warum: "Bajo inmunosupresión una infección puede volverse grave deprisa, y falta la reacción de defensa habitual. No esperes." },
      { dringend: "nein", zeichen: "Dolor de cabeza intenso con rigidez de nuca", warum: "Sospecha de meningitis." },
    ],
  },
  {
    kicker: "Esta semana",
    titel: "A la consulta sin demora",
    punkte: [
      { dringend: "vielleicht", zeichen: "Orina espumosa, piernas o párpados hinchados", warum: "Indicio de proteína en la orina y con ello de una afectación renal. La nefritis lúpica no da síntomas durante mucho tiempo y solo se encuentra con el control de orina." },
      { dringend: "vielleicht", zeichen: "Erupción nueva con fiebre y dolor articular", warum: "Cuadro típico de un brote." },
      { dringend: "vielleicht", zeichen: "Claramente menos orina de lo habitual", warum: "Hay que estudiar el riñón." },
      { dringend: "vielleicht", zeichen: "Sangrados o moratones sin motivo", warum: "Puede indicar plaquetas bajas." },
      { dringend: "vielleicht", zeichen: "Diarrea persistente, pérdida de peso pese a la alimentación sin gluten", warum: "En la enfermedad celíaca la causa más frecuente es la ingesta de gluten oculto, pero hay que mirarlo." },
      { dringend: "vielleicht", zeichen: "Alteración nueva de la visión con hidroxicloroquina", warum: "El cribado de retina tiene un ritmo fijo, y una alteración nueva no espera a esa cita." },
    ],
  },
  {
    kicker: "Comentar en la próxima cita",
    titel: "Importante, pero no urgente",
    punkte: [
      { dringend: "ja", zeichen: "Fatiga que empeora a lo largo de semanas", warum: "Hay que estudiarla: hemograma, tiroides, hierro, vitamina D, sueño, estado de ánimo. No todo eso es lupus, y esa es una buena noticia, porque mucho de ello tiene tratamiento." },
      { dringend: "ja", zeichen: "Nueva caída del cabello, úlceras en la boca, fotosensibilidad", warum: "Forman parte de la descripción de la actividad y deberían quedar documentadas." },
      { dringend: "ja", zeichen: "Ánimo, ansiedad, motivación", warum: "Frecuentes en el lupus y muy entrelazados con la fatiga. Se habla de ello demasiado poco." },
      { dringend: "ja", zeichen: "El deseo de tener hijos, aunque quede lejos", warum: "Algunos medicamentos hay que cambiarlos mucho antes, y en el lupus un embarazo se planifica mejor en una fase tranquila." },
    ],
  },
],

/* -------------------------------------------------------------- Preguntas */

fragen: [
  { frage: "¿Cómo de activo está mi lupus ahora mismo, en cifras?", warum: "Existen instrumentos de medida para eso. Conocer la propia cifra hace legible la evolución a lo largo de los años." },
  { frage: "¿Cuándo se revisó por última vez la proteína en la orina?", warum: "El riñón no avisa por su cuenta." },
  { frage: "¿Qué valores hay que controlar y cada cuánto, y quién los solicita?", warum: "Para que nada se quede colgado entre la consulta de familia y el hospital." },
  { frage: "¿Cuándo toca el próximo cribado de retina?", warum: "Con la hidroxicloroquina hay un ritmo fijo para eso." },
  { frage: "¿Qué dosis de glucocorticoides tengo, y cuál es el plan para bajarla?", warum: "Las guías apuntan a la dosis de mantenimiento más baja posible." },
  { frage: "¿Se han medido últimamente el hierro, la vitamina D, la B12, el ácido fólico y el calcio?", warum: "En la enfermedad celíaca y con glucocorticoides es el suministro más importante, y una causa frecuente de fatiga." },
  { frage: "¿Cuándo fue la última densitometría ósea, y hace falta una?", warum: "La enfermedad celíaca y los glucocorticoides actúan los dos sobre el hueso." },
  { frage: "¿Cómo va mi valor de tTG a lo largo del tiempo?", warum: "Muestra si la alimentación sin gluten es realmente sin fisuras." },
  { frage: "¿Qué vacunas me faltan, y cuáles no puedo recibir con este tratamiento?", warum: "Las vacunas vivas atenuadas son un tema bajo inmunosupresión." },
  { frage: "¿Qué hago si tengo fiebre o una infección, a quién llamo?", warum: "Este plan se quiere tener antes de necesitarlo." },
  { frage: "¿Qué anticoncepción encaja con mi situación?", warum: "Con anticuerpos antifosfolípido, la anticoncepción con estrógenos exige consideraciones especiales." },
  { frage: "¿Puedo hacer deporte, y cuánto, también cuando me encuentro mal?", warum: "La respuesta es casi siempre sí, pero la dosis hay que hablarla, sobre todo si hay afectación cardíaca, pulmonar o renal." },
],

/* ------------------------------------------------------------ Conocimiento */

wissen: [
  {
    kicker: "Primero",
    titel: "Cómo ha nacido este texto",
    abschnitte: [
      {
        frage: "¿De dónde sale esto, y cuánto vale?",
        antwort: [
          "Este texto es una orientación, no un artículo científico ni una segunda opinión. Está escrito " +
            "para que puedas ir con él a una consulta y hacer mejores preguntas.",
          "Al reunirlo, los trabajos originales <b>no se pudieron abrir</b>: la red en la que nació este " +
            "texto no deja pasar las páginas médicas especializadas. Buscar se pudo, leer no. Eso tiene una " +
            "consecuencia clara, y está aquí en vez de en la letra pequeña: <b>las cifras sueltas de los " +
            "estudios, es decir, porcentajes, tamaños del efecto y número de participantes, no aparecen casi " +
            "en ningún punto de este texto, y es a propósito.</b> Lo que sí está es la dirección del hallazgo " +
            "y la solidez de las pruebas.",
          "A cambio, en cada capítulo están los documentos originales con su número. Con un PMID se encuentra " +
            "un trabajo en segundos, y cualquier médica tiene acceso. Este texto está construido, por tanto, " +
            "como guía hacia las fuentes, no como sustituto de ellas.",
        ],
        staerke: "Contexto, no evidencia.",
      },
      {
        frage: "Lo que este texto con seguridad no puede hacer",
        antwort: [
          "No conoce tus valores, ni qué órganos tienes afectados, ni tus antecedentes. Y en el lupus casi " +
            "toda decisión depende justo de eso.",
          "No dice nada sobre ninguna dosis. No porque sea un secreto, sino porque una dosis sin la persona " +
            "delante no tiene sentido y puede causar daño.",
          "Y es una foto de un momento, no una suscripción. En el lupus se ha movido mucho en los últimos " +
            "años. Cuando este texto envejezca no se volverá falso, pero sí incompleto.",
        ],
      },
    ],
  },

  {
    kicker: "El tema principal",
    titel: "Fatiga",
    abschnitte: [
      {
        frage: "¿Por qué estoy tan cansada si los valores están bien?",
        antwort: [
          "Porque en el lupus eso es lo normal y no la excepción. La fatiga es el síntoma más frecuente y, " +
            "para muchas personas, el más duro de llevar, y <b>no</b> sigue a la actividad de la enfermedad que se mide.",
          "Es uno de los hallazgos mejor repetidos en este campo: las medidas habituales de actividad explican " +
            "solo una parte pequeña de lo agotada que está una persona. Un resultado tranquilo no descarta, por " +
            "tanto, una fatiga intensa. Quien lo sabe no tiene que justificarse y sigue buscando en el sitio correcto.",
          "Lo que en los estudios se relaciona con más fuerza con la fatiga es <b>el trastorno del sueño, el " +
            "dolor, una fibromialgia acompañante, el ánimo y la ansiedad</b>. Esto no es una rebaja al estilo de " +
            "\"entonces es cosa psicológica\". Es lo contrario: nombra cosas contra las que sí se puede hacer algo.",
        ],
        staerke: "Sólida para la desconexión respecto a la actividad medida. Sólida para el sueño, el dolor, el ánimo y la fibromialgia como acompañantes.",
        quellen: [
          "Arnaud L et al., LEAF-Studie, RMD Open 2023. PMID 38056917",
          "Monahan RC et al., Lupus 2021. PMID 33779389",
          "Ahn GE, Ramsey-Goldman R, Int J Clin Rheumatol 2012. PMC3380630",
          "Cornet A et al., Lupus Sci Med 2021;8:e000469",
        ],
      },
      {
        frage: "¿Qué hay que estudiar antes de atribuir la fatiga al lupus?",
        antwort: [
          "Una parte de ello tiene buen tratamiento, y justo por eso merece la pena mirarlo. Si además hay " +
            "enfermedad celíaca, esto vale por partida doble, porque la absorción en el intestino puede estar alterada.",
        ],
        liste: [
          "<b>Hemograma</b>, por la anemia. Frecuente tanto en el lupus como en la enfermedad celíaca, y una de las causas físicas más frecuentes de agotamiento.",
          "<b>Hierro y ferritina</b>. En la enfermedad celíaca, la carencia más frecuente de todas. Atención: la ferritina sube con la inflamación, se lee junto con la PCR.",
          "<b>Tiroides</b>. Un hipotiroidismo produce exactamente este cuadro, y las enfermedades autoinmunes del tiroides son más frecuentes en ambas enfermedades de base.",
          "<b>Vitamina D, B12, ácido fólico</b>.",
          "<b>Función renal y orina</b>, porque una afectación renal se mantiene muda durante mucho tiempo.",
          "<b>Sueño</b>. Dormir mal es muy frecuente en el lupus y, en los estudios, el acompañante aislado más fuerte de la fatiga.",
          "<b>Ánimo y ansiedad</b>. La depresión y la ansiedad son claramente más frecuentes en el lupus que en la población general.",
          "<b>Los medicamentos</b>, como tema para la consulta.",
        ],
        staerke: "Esta lista es práctica clínica y lógica de guías, no un estudio concreto.",
      },
      {
        frage: "¿Qué ayuda de verdad contra la fatiga?",
        antwort: [
          "La respuesta honesta tiene dos partes. Primera: la medida aislada con mejores pruebas es la " +
            "<b>actividad física</b>, adaptada y construida a lo largo de semanas. Segunda: las pruebas que la " +
            "respaldan son más escasas y más contradictorias de lo que se lee en los libros de consejos.",
          "En concreto: una revisión Cochrane de 2023 llega a una certeza baja de los resultados y no encuentra " +
            "un beneficio estadísticamente significativo para la fatiga. Un resumen anterior, de 2017, encuentra en cambio un beneficio medio para la fatiga, la resistencia, el " +
            "ánimo y la función. Las dos leen casi los mismos estudios y llegan a conclusiones distintas, porque " +
            "suman de forma distinta. De las dos, la más reciente es la más prudente, y eso hay que decirlo.",
          "Lo que se puede sacar de ahí sin exagerar: el ejercicio es <b>seguro cuando la enfermedad está estable</b>, " +
            "mejora la resistencia de forma fiable, y probablemente ayude algo a la fatiga. Es más de lo que se " +
            "ha demostrado para cualquier otra medida no farmacológica en el lupus.",
          "La sociedad científica europea recomienda expresamente, en las enfermedades reumáticas inflamatorias, " +
            "registrar la fatiga y ofrecer propuestas de ejercicio adaptadas.",
        ],
        staerke: "Baja a media. Resúmenes contradictorios, estudios pequeños y casi siempre sin enmascaramiento. Más clara para la resistencia que para la fatiga.",
        quellen: [
          "Frade S et al., Cochrane Database Syst Rev 2023. DOI 10.1002/14651858.CD014816.pub2",
          "O'Dwyer T, Durcan L, Wilson F, Semin Arthritis Rheum 2017;47:204-215. PMID 28477898",
          "Tench CM et al., Rheumatology (Oxford) 2003;42:1050-1054. PMID 12730519",
          "Dures E et al., EULAR-Empfehlungen zu Fatigue, Ann Rheum Dis 2024;83:1260-1267. DOI 10.1136/ard-2023-224514",
        ],
      },
    ],
  },

  {
    kicker: "La pregunta más frecuente",
    titel: "¿Deporte, también en el brote?",
    abschnitte: [
      {
        frage: "¿Puedo hacer deporte durante un brote activo?",
        antwort: [
          "Aquí la exactitud importa más que una respuesta redonda, así que primero los hechos: <b>no hay " +
            "ningún estudio sobre esto.</b> Prácticamente todos los estudios de ejercicio en el lupus " +
            "incluyeron a personas con la enfermedad tranquila o con actividad baja y excluyeron expresamente " +
            "la enfermedad activa. La frase tranquilizadora \"el ejercicio no empeora el lupus\" es una " +
            "afirmación sobre fases estables. A un brote agudo no se puede trasladar.",
          "Lo que sí hay es una recomendación internacional de consenso de 2024. Viene a decir: durante un " +
            "brote hay que tener <b>precaución</b> y volver a comprobar si en ese momento hay algo que lo " +
            "desaconseje. En un brote con articulaciones inflamadas, justo esas articulaciones no deben " +
            "cargarse. Quien tiene la enfermedad tranquila o leve debe seguir las recomendaciones generales " +
            "de actividad física.",
          "Traducido al día a día, eso no significa \"cama\", y tampoco significa \"tirar para adelante\". " +
            "Significa: en el brote, reducir en lugar de parar. Pasear en lugar de series, " +
            "estiramientos y movimiento suave en lugar de fuerza, dejar fuera las articulaciones inflamadas. " +
            "Y: un brote nuevo hay que comunicarlo antes de ajustar el plan de entrenamiento, no después.",
          "Una limitación que está en esa misma recomendación y que se olvida con facilidad: con afectación " +
            "cardíaca, pulmonar o renal, bajo tratamiento anticoagulante o con necrosis ósea, el esfuerzo hay " +
            "que valorarlo con tu médica antes de aumentarlo.",
        ],
        staerke: "Para el brote: solo consenso de expertos, ningún estudio. Para las fases estables: media.",
        quellen: [
          "Blaess J et al., RMD Open 2024;10:e004171. DOI 10.1136/rmdopen-2024-004171",
          "Parodis I et al., EULAR, tratamiento no farmacológico, Ann Rheum Dis 2024;83:720-729. PMID 37433575",
        ],
      },
      {
        frage: "¿Cómo se empieza cuando hasta subir escaleras cansa?",
        antwort: [
          "Con una cantidad que se sienta demasiado pequeña, y con la que también salgas adelante en un día " +
            "malo. Eso no es modestia, es el método: el motivo más frecuente por el que el ejercicio fracasa " +
            "cuando hay agotamiento es un día bueno en el que se hace de más, seguido de tres días en la cama.",
          "En los estudios que mostraron algo, los programas duraban por lo general <b>de ocho a doce semanas</b>, " +
            "eran de intensidad media y estaban acompañados. Acompañados significa aquí: alguien lo supervisa. " +
            "En los análisis, esa fue una de las diferencias entre los programas que funcionaban y los que no.",
          "Un comienzo útil: una cantidad pequeña y fija cada día, la misma en los días buenos y en los malos, " +
            "y solo después de una o dos semanas sin resaca, un poquito más. En el apartado de evolución de " +
            "esta aplicación se ve, al cabo de unas semanas, si la fatiga sube el día después de una sesión.",
        ],
        staerke: "Media para la duración y la intensidad de los programas. El modo de proceder en sí es práctica, no resultado de estudios.",
      },
      {
        frage: "¿Y el pacing, es decir, dosificar las fuerzas?",
        antwort: [
          "Pacing significa repartir la energía a lo largo del día y parar de forma planificada <b>antes</b> " +
            "de que ya no puedas más, en vez de seguir hasta el desplome.",
          "Con honestidad: en el lupus apenas hay estudios sobre esto, solo pequeños programas de formación y " +
            "un estudio piloto en marcha. Los datos de mejor calidad sobre el pacing vienen de otras " +
            "enfermedades, sobre todo EM/SFC y covid persistente, y también allí son dispares. No está aclarado " +
            "si la fatiga del lupus se comporta como la de esas enfermedades.",
          "Aun así está aquí, porque es barato, inofensivo y reversible. Probarlo dos semanas y mirar en la " +
            "evolución si los días malos se hacen menos no cuesta nada.",
        ],
        staerke: "En el lupus, débil. Es un traslado desde otras enfermedades, y allí los resultados son dispares.",
      },
    ],
  },

  {
    kicker: "Alimentación",
    titel: "Lo que en el lupus está realmente demostrado",
    abschnitte: [
      {
        frage: "¿Existe una dieta para el lupus?",
        antwort: [
          "No. No hay ninguna forma de alimentarse de la que se haya demostrado que trate el lupus o " +
            "sustituya a los medicamentos. Quien lo afirma está vendiendo algo.",
          "Lo que hay son patrones. El más estudiado es el <b>mediterráneo</b>: mucha verdura, fruta, " +
            "legumbres, aceite de oliva, pescado, frutos secos, poca carne roja y procesada. En estudios " +
            "transversales en lupus se asocia con menor actividad de la enfermedad y mejores parámetros " +
            "cardiovasculares.",
          "La palabra transversal es importante: en ese tipo de estudio se mira en un solo momento quién come " +
            "de qué manera y cómo se encuentra. Si es la comida la que marca la diferencia, o si a las personas " +
            "con la enfermedad más tranquila les resulta más fácil comer así, un estudio de ese tipo no lo puede " +
            "separar. En el lupus no existe ningún estudio de intervención terminado que tenga la actividad de " +
            "la enfermedad como objetivo.",
          "Aun así hay un buen motivo para ir justo en esa dirección: el <b>riesgo cardiovascular</b> está " +
            "claramente aumentado en las mujeres jóvenes con lupus, y pocas cosas en la medicina de la " +
            "nutrición están tan bien demostradas para ese objetivo como el patrón mediterráneo.",
        ],
        staerke: "Para la actividad del lupus: débil, solo observacional. Para el corazón y los vasos: buena, pero procedente de la población general.",
      },
      {
        frage: "Omega 3, vitamina D, cúrcuma y el resto",
        antwort: [
          "El <b>omega 3</b> del pescado o del aceite se ha estudiado en el lupus en varios ensayos " +
            "controlados pequeños, con indicios de una actividad de la enfermedad algo menor y de una mejor " +
            "función de los vasos. Los estudios son pequeños y no coinciden entre sí. Pescado azul dos veces " +
            "por semana es una manera sensata de aplicarlo, y no puede estropear nada.",
          "La <b>vitamina D</b> suele estar baja en el lupus, porque se evita el sol y los glucocorticoides " +
            "aumentan las pérdidas; en la enfermedad celíaca se suma la peor absorción. Que una carencia hay " +
            "que corregirla no se discute. Que corregirla mejore la fatiga, eso sí se discute: los estudios de " +
            "tratamiento reunidos sobre esto suman solo unas pocas decenas de participantes. Así que: medir, corregir si " +
            "hay carencia, y no colgar de ahí grandes esperanzas.",
          "La <b>cúrcuma, el resveratrol, la NAC y la DHEA</b> se han estudiado en el lupus, en estudios " +
            "pequeños con resultados dispares. Nada de eso está establecido.",
          "Más importante que cualquier preparado concreto: todo lo que se traga tiene que estar en la lista " +
            "de medicamentos y pasar por la consulta. Los complementos alimenticios no son un terreno sin " +
            "reglas, tienen interacciones.",
        ],
        staerke: "Omega 3: débil a media, estudios pequeños. Vitamina D contra la fatiga: muy débil. Resto de preparados: débil.",
      },
      {
        frage: "¿Y lo de los brotes de alfalfa?",
        antwort: [
          "La alfalfa contiene L-canavanina. Sobre eso hay casos publicados antiguos de cuadros parecidos al " +
            "lupus y experimentos en monos. Es el punto que desde hace décadas aparece en todas las listas " +
            "sobre el lupus.",
          "Situado con honestidad: es una cadena de pruebas antigua y endeble, no una demostración. Pero " +
            "renunciar a los brotes de alfalfa no cuesta nada, por eso también está aquí. Con todo lo demás " +
            "merece la pena el escepticismo: muchas listas de prohibiciones en internet no nacieron de esta " +
            "pregunta, sino de copiarse unas a otras.",
          "Un punto con mejor fundamento: los <b>preparados que se venden expresamente para estimular el " +
            "sistema inmunitario</b>, por ejemplo la equinácea. En una enfermedad en la que el sistema " +
            "inmunitario se dirige contra el propio cuerpo, esa es la dirección equivocada. También aquí la " +
            "cadena de pruebas es endeble, pero el razonamiento se sostiene.",
        ],
        staerke: "Débil. Casos publicados y experimentos con animales. Defendible como precaución, no como hecho.",
      },
    ],
  },

  {
    kicker: "Enfermedad celíaca",
    titel: "Qué tiene que ser estricto y qué no",
    abschnitte: [
      {
        frage: "¿Cómo de estricto es estricto?",
        antwort: [
          "En la enfermedad celíaca la alimentación sin gluten es el tratamiento, de por vida, y el objetivo " +
            "no es solo no tener síntomas, sino la curación de la mucosa intestinal. Los síntomas son una mala " +
            "medida: una parte de las personas no tiene ninguno pese a tener daño.",
          "El límite de 20 miligramos de gluten por kilogramo para la mención sin gluten se basa en que hasta " +
            "unos 10 miligramos de gluten al día probablemente sean inofensivos para la gran mayoría. Según los " +
            "propios comités de expertos, los datos en los que se apoya son limitados, y se sigue discutiendo " +
            "cuál es el umbral correcto.",
          "Llamativo y poco conocido: las mediciones en personas que se consideran estrictamente sin gluten " +
            "encuentran con regularidad claramente más ingesta involuntaria de gluten de la que ese umbral " +
            "prevé. No es un reproche a nadie, sino una pista de dónde hay que buscar cuando la cosa no mejora.",
        ],
        staerke: "Alta para el tratamiento en sí. Débil a media para el umbral exacto.",
        quellen: [
          "Guía ACG, Am J Gastroenterol 2023. PMID 36602836",
          "Ludvigsson JF et al., BSG, Gut 2014;63:1210-1228. PMID 24917550",
          "ESsCD 2025, United European Gastroenterol J. PMID 40999951 y PMID 41831197",
        ],
      },
      {
        frage: "¿Qué cuenta de verdad en la cocina, y qué se sobrestima?",
        antwort: [
          "Aquí la investigación ha dado algo sorprendente, y hace el día a día más llevadero. Se midió cuánto " +
            "gluten pasa en realidad con los gestos habituales de cocina.",
          "<b>Más importante de lo que se pensaba:</b> el aceite de freír compartido y el agua de cocción " +
            "compartida. En patatas fritas de una freidora en la que también se fríe rebozado, una parte de las " +
            "muestras quedó claramente por encima del límite. Lo mismo con el agua de cocer pasta en la que " +
            "antes se había cocido pasta con gluten; enjuagar brevemente la pasta cocida volvió a dejar los " +
            "valores por debajo.",
          "<b>Menos grave de lo que se temía:</b> la tostadora compartida y los cubiertos compartidos. En las " +
            "mediciones, el pan sin gluten salido de una tostadora ya usada se mantuvo por debajo del límite, " +
            "incluso con migas visibles en la ranura, y un cuchillo que antes había estado en un bollo con " +
            "gluten no transfirió nada medible.",
          "Estos estudios son pequeños y no están enmascarados, así que no son una patente de corso. Pero la " +
            "dirección sirve: la energía hay que ponerla en la freidora, el agua de cocción, el polvo de harina " +
            "al hornear y las listas de ingredientes, y menos en el miedo a cada cuchara compartida. En una " +
            "enfermedad autoinmune eso también es un argumento: la fuerza que no se va en preocupación " +
            "innecesaria queda disponible para otra cosa.",
        ],
        staerke: "Débil a media. Estudios de medición pequeños y sin enmascaramiento, pero son las únicas cifras que hay sobre esto.",
        quellen: [
          "Weisbrod VM et al., Gastroenterology 2020",
          "Gluten-Free Foods Cooked in Shared Fryers With Wheat, Front Nutr 2021. DOI 10.3389/fnut.2021.652039",
          "Syage JA et al., Am J Clin Nutr 2018",
        ],
      },
      {
        frage: "¿Basta el valor de tTG para saber si todo va bien?",
        antwort: [
          "No, y ese es uno de los detalles más importantes de todo este texto. El valor de tTG se desarrolló " +
            "como <b>prueba de cribado</b>, no como prueba de seguimiento de la curación de la mucosa.",
          "En un resumen de varios estudios, con alimentación sin gluten un valor normal de tTG solo detectó " +
            "alrededor de la mitad de los casos en los que la mucosa seguía dañada. Un valor sin alteraciones " +
            "es, por tanto, una buena noticia, pero no una prueba.",
          "En la práctica significa: si los síntomas persisten o si valores como el hierro y la vitamina D no " +
            "suben, \"el tTG es normal\" no es motivo para dejar de buscar. Entonces toca una historia dietética " +
            "detallada con un dietista-nutricionista con experiencia, y según el caso más pruebas diagnósticas.",
          "Por cierto, la causa más frecuente cuando con alimentación sin gluten la cosa no mejora no es una " +
            "complicación rara, sino gluten que entra a escondidas.",
        ],
        staerke: "Media a alta para el valor limitado de la serología. Procede de un resumen de varios estudios.",
        quellen: [
          "Metaanálisis sobre anticuerpos anti-tTG y antiendomisio en la atrofia vellositaria persistente, Gastroenterology 2017",
          "Guías sobre el seguimiento, Nat Rev Gastroenterol Hepatol 2023. PMID 38110546",
        ],
      },
      {
        frage: "¿Avena, sí o no?",
        antwort: [
          "Un resumen de los estudios no encontró ningún indicio de que la avena declarada expresamente sin " +
            "gluten empeore los síntomas, el tejido, la reacción inmunitaria o la serología. La certeza de esos " +
            "resultados era baja.",
          "El problema principal no es la avena, sino el procesado: la avena corriente suele estar muy " +
            "contaminada con trigo, la avena pura prácticamente no. Por eso vale la regla: solo avena etiquetada " +
            "como sin gluten.",
          "A esto se suma una pequeña minoría que reacciona a la propia proteína de la avena. No está bien " +
            "determinado lo grande que es ese grupo; la cifra que se cita a menudo viene de un estudio al que " +
            "se apuntaron a propósito personas con sospecha de intolerancia a la avena, y por eso es demasiado " +
            "alta para el conjunto de la población.",
          "Proceder con cabeza: introducir la avena sin gluten cuando la cosa está tranquila, no a la vez que " +
            "otros cambios, y ver en el diario qué pasa.",
        ],
        staerke: "Media para la seguridad de la avena pura, la certeza de los resultados del resumen era baja.",
        quellen: ["Pinto-Sanchez MI et al., Gastroenterology 2017;153:395-409. PMID 28431885"],
      },
      {
        frage: "¿Sirve de algo el sin gluten contra el lupus en alguien que no tuviera enfermedad celíaca?",
        antwort: [
          "Para eso no hay ninguna prueba sólida. Se menciona aquí solo por completitud, porque la pregunta " +
            "aparece constantemente en los foros.",
          "En este caso la pregunta carece de objeto de todos modos: con una enfermedad celíaca confirmada se " +
            "come sin gluten, con independencia de lo que eso haga por el lupus.",
        ],
        staerke: "Ninguna prueba sólida.",
      },
    ],
  },

  {
    kicker: "Las dos juntas",
    titel: "Dónde el lupus y la enfermedad celíaca se estorban",
    abschnitte: [
      {
        frage: "¿Tienen las dos algo que ver entre sí?",
        antwort: [
          "Las enfermedades autoinmunes aparecen juntas con más frecuencia, y la enfermedad celíaca se " +
            "encuentra en el lupus más a menudo que en la población general. Cuánto más a menudo, ahí las " +
            "estimaciones publicadas se separan mucho entre sí, y por eso aquí no hay ninguna cifra, a propósito.",
          "Para el día a día la cifra tampoco importa. Lo que importa es que las dos enfermedades atacan las " +
            "mismas cosas: la absorción de nutrientes, el hueso y la fuerza.",
        ],
        staerke: "Las estimaciones se contradicen claramente. La relación en sí está establecida.",
      },
      {
        frage: "El hueso, a los 26",
        antwort: [
          "Es el punto que a esta edad se pierde de vista con más facilidad y que duele el último. Se juntan " +
            "dos cosas: la enfermedad celíaca altera durante años la absorción de calcio y de vitamina D, y los " +
            "glucocorticoides actúan directamente contra el hueso.",
          "La guía estadounidense sobre la osteoporosis por glucocorticoides dice algo que cuenta especialmente " +
            "para las mujeres jóvenes: por debajo de los 40 años el riesgo de fractura <b>no</b> se puede " +
            "estimar con la calculadora habitual, porque no está hecha para eso. En lugar de un cálculo hace " +
            "falta, por tanto, una medición.",
          "Lo que forma parte de esto en todos los casos: calcio y vitamina D suficientes, movimiento con el " +
            "peso sobre las piernas, no fumar. Y la pregunta de si una densitometría ósea tiene sentido y " +
            "cuándo, hay que hacerla, no esperar a que llegue.",
        ],
        staerke: "Basada en guías.",
        quellen: ["Humphrey MB et al., guía ACR sobre la osteoporosis inducida por glucocorticoides 2022. DOI 10.1002/art.42646"],
      },
      {
        frage: "¿Y si la fatiga sigue pese a una alimentación sin gluten estricta?",
        antwort: [
          "Pasa, y está bien descrito. El orden en el que se busca suele ser este:",
        ],
        liste: [
          "Ingesta de gluten oculto. Con diferencia la explicación más frecuente, y se encuentra mejor con un dietista-nutricionista con experiencia que en solitario.",
          "Nutrientes: hierro, B12, ácido fólico, vitamina D, zinc.",
          "Tiroides.",
          "La segunda enfermedad, es decir, el lupus mismo, junto con los riñones y el hemograma.",
          "Sueño, ánimo, dolor, fibromialgia.",
          "Solo después, las cosas raras.",
        ],
        staerke: "Práctica clínica y lógica de guías.",
      },
    ],
  },

  {
    kicker: "Tratamiento",
    titel: "Lo que hoy es el estándar",
    abschnitte: [
      {
        frage: "¿Por qué se guía hoy el tratamiento?",
        antwort: [
          "Por dos principios que están en las recomendaciones europeas actuales. Primero: " +
            "<b>hidroxicloroquina para todo el mundo</b>, siempre que nada lo desaconseje. Segundo: " +
            "<b>glucocorticoides lo más bajos posible</b>, pensados como puente y no como solución " +
            "permanente, con el objetivo de mantenerlos muy bajos en el mantenimiento o retirarlos del todo.",
          "Ese es el motivo por el que hoy se añaden antes otros medicamentos: no porque la enfermedad sea " +
            "peor, sino para que los glucocorticoides puedan bajar. Para eso hay ahora más posibilidades que " +
            "hace pocos años, algunas de aprobación reciente.",
          "El objetivo declarado del tratamiento es la remisión o un estado de baja actividad. Las dos cosas " +
            "están definidas y se pueden medir. Merece la pena preguntar por ello: convierte el \"¿cómo se " +
            "encuentra?\" en una magnitud que sigue siendo comparable a lo largo de los años.",
          "<b>De esta aplicación no sale ninguna dosis.</b> Lo que hay aquí es el marco dentro del cual " +
            "decide la consulta.",
        ],
        staerke: "Guías, el nivel más alto disponible.",
        quellen: [
          "Fanouriakis A et al., EULAR 2023, Ann Rheum Dis 2024;83:15-29. PMID 37827694",
          "Guía ACR sobre el tratamiento del LES 2025. PMID 41182321",
          "EULAR 2025, lupus con afectación renal. PMID 41107121",
        ],
      },
      {
        frage: "¿Por qué la revisión ocular con hidroxicloroquina?",
        antwort: [
          "Porque en casos raros el medicamento puede dañar la retina, y porque ese daño no da síntomas " +
            "durante mucho tiempo. Por eso se busca y no se espera.",
          "El riesgo depende sobre todo de la dosis en relación con el peso corporal y de la duración del " +
            "tratamiento; una función renal reducida y determinados medicamentos lo aumentan. Por eso hay un " +
            "límite máximo referido al peso corporal <b>real</b>.",
          "Sobre el procedimiento: una exploración al inicio y después controles regulares con técnicas que " +
            "obtienen imágenes de la retina. Los intervalos exactos varían de un país a otro y se han revisado " +
            "hace poco. Por eso la pregunta práctica para la consulta no es \"cada cuánto se hace normalmente\", " +
            "sino \"cuándo me toca la siguiente\".",
          "Bueno saberlo: si un daño incipiente se encuentra pronto y se retira el medicamento, lo habitual es " +
            "que no siga avanzando. Justo por eso el control no es un ritual, sino todo el sentido del asunto.",
        ],
        staerke: "Guías de oftalmología. Los intervalos exactos varían según el país y la versión.",
        quellen: [
          "AAO, recomendaciones sobre el cribado de la retinopatía por hidroxicloroquina, Ophthalmology. PMID 41232611",
          "Royal College of Ophthalmologists, Monitoring-Empfehlungen 2020. PMID 33423043",
        ],
      },
      {
        frage: "¿Por qué la orina una y otra vez?",
        antwort: [
          "Porque en el lupus la afectación renal es el daño de órgano que más cuesta y que se mantiene mudo " +
            "más tiempo. No duele. Se muestra como proteína en la orina mucho antes de que se note nada.",
          "Por eso la guía estadounidense sobre la nefritis lúpica emite una recomendación fuerte de buscar " +
            "proteína en la orina con regularidad también en personas <b>sin</b> afectación renal conocida.",
          "Si de todo este capítulo te llevas una sola cosa, que sea esta: el análisis de orina es la prueba " +
            "más barata y más eficaz de todo el seguimiento. No hay que olvidarla cuando una se encuentra bien.",
        ],
        staerke: "Recomendación fuerte de guía.",
        quellen: ["Guía ACR sobre la nefritis lúpica 2024. DOI 10.1002/art.43212"],
      },
    ],
  },

  {
    kicker: "A los 26",
    titel: "Lo que a esta edad forma parte",
    abschnitte: [
      {
        frage: "El deseo de tener hijos, aunque ahora no toque",
        antwort: [
          "Este tema hay que hablarlo pronto, justamente cuando todavía no está en el horizonte. El motivo es " +
            "sencillo: algunos medicamentos habituales en el lupus no se pueden tomar durante un embarazo y hay " +
            "que cambiarlos <b>meses antes</b>. Un embarazo no planificado con uno de esos medicamentos es el " +
            "escenario que todo el mundo quiere evitar.",
          "El segundo motivo: en el lupus un embarazo transcurre bastante mejor si empieza en una fase " +
            "tranquila. Es una de las pocas cosas que de verdad se pueden planificar.",
          "Dos valores en sangre son decisivos para eso y deberían conocerse, al margen de cualquier " +
            "planificación: <b>anti-Ro/SSA</b> y los <b>anticuerpos antifosfolípido</b>, incluido el " +
            "anticoagulante lúpico. Cambian el seguimiento y la elección del método anticonceptivo. Quien no " +
            "conoce su situación debería preguntar por ella.",
          "La hidroxicloroquina, por regla general, se mantiene durante el embarazo, no se retira. Eso " +
            "sorprende a mucha gente.",
        ],
        staerke: "Guías.",
        quellen: [
          "Sammaritano LR et al., guía ACR sobre salud reproductiva 2020, Arthritis Rheumatol 2020;72:529-556. PMID 32090466",
          "Andreoli L et al., EULAR, salud de la mujer en el LES y el SAF, Ann Rheum Dis 2017;76:476-485",
        ],
      },
      {
        frage: "Anticoncepción",
        antwort: [
          "El punto decisivo: con <b>anticuerpos antifosfolípido</b> demostrados se desaconseja la " +
            "anticoncepción con estrógenos, porque el estrógeno aumenta el riesgo de trombosis y ese riesgo " +
            "aquí ya está aumentado de por sí. En su lugar se recomiendan el DIU o los preparados solo con " +
            "gestágeno.",
          "Como al mismo tiempo es importante una anticoncepción fiable mientras haya de por medio " +
            "medicamentos que causarían daño en un embarazo, esta no es una cuestión secundaria.",
        ],
        staerke: "Recomendación fuerte de guía.",
        quellen: ["Sammaritano LR et al., ACR 2020. PMID 32090466"],
      },
      {
        frage: "Vacunas e infecciones",
        antwort: [
          "Bajo inmunosupresión vale esto: las <b>vacunas inactivadas</b> son posibles y se recomiendan " +
            "expresamente, las <b>vacunas vivas atenuadas</b> deben evitarse en lo posible. Lo mejor es revisar " +
            "y completar el estado vacunal antes de que empiece un tratamiento inmunosupresor, y en una fase " +
            "tranquila.",
          "La segunda parte es más práctica: <b>la fiebre bajo inmunosupresión no es un asunto para esperar.</b> " +
            "La reacción de defensa habitual puede faltar, y solo con el hemograma no siempre se puede " +
            "distinguir una infección de un brote. Esa es exactamente la situación para la que se quiere tener " +
            "de antemano un plan y un número de teléfono.",
        ],
        staerke: "Guías.",
        quellen: [
          "Furer V et al., EULAR-Impfempfehlungen 2019, Ann Rheum Dis 2020;79:39-52. PMID 31413005",
          "Bass AR et al., ACR-Impfleitlinie 2022. PMID 36597813",
        ],
      },
      {
        frage: "Sol y tabaco",
        antwort: [
          "Sobre el <b>sol</b> hay algo sólido: en un estudio controlado en el que se irradió piel con UV a " +
            "propósito, en las zonas sin tratar aparecieron lesiones cutáneas típicas del lupus, y en las zonas " +
            "tratadas con un fotoprotector alto de amplio espectro no apareció ninguna en ninguna participante. " +
            "Para esta pregunta es un estudio inusualmente claro.",
          "Importante en esto: lo que se demostró fue evitar <b>lesiones cutáneas</b> provocadas por UV, no " +
            "evitar brotes en general. Y la protección tiene que cubrir UVA y UVB.",
          "Sobre el <b>tabaco</b>: fumar se asocia con un mayor riesgo de enfermar, y empeora de forma medible " +
            "la eficacia de la hidroxicloroquina en la piel. Un detalle que da ánimo: en el análisis, las " +
            "<b>exfumadoras</b> ya no tenían un riesgo aumentado. Es decir, dejarlo sirve.",
        ],
        staerke: "Para la fotoprotección: buena, estudio controlado en personas. Para el tabaco: resumen de varios estudios.",
        quellen: [
          "Kuhn A et al., J Am Acad Dermatol 2011;64:37-48. PMID 21167404",
          "Revisión sistemática y metaanálisis sobre el tabaco en el LES, Autoimmun Rev 2019. PMID 31520802",
        ],
      },
    ],
  },
],

/* ------------------------------------------------------- Seguimiento */

ueberwachung: [
  {
    titel: "Ojos, con hidroxicloroquina",
    text: [
      "Una exploración al inicio del tratamiento y después controles regulares con técnicas de imagen de la " +
        "retina. Los intervalos varían según el país y el perfil de riesgo; la dosis referida al peso corporal " +
        "real, la duración del tratamiento y la función renal son lo que más pesa.",
      "Encontrado pronto, lo habitual es que un daño no siga avanzando después de retirar el medicamento. Ese es el motivo de los controles.",
    ],
    quellen: ["AAO, Ophthalmology. PMID 41232611", "Royal College of Ophthalmologists 2020. PMID 33423043"],
  },
  {
    titel: "Sangre y orina",
    text: [
      "Hemograma, función renal, función hepática y, según el medicamento, otros valores, con intervalos que " +
        "dependen de la actividad y del medicamento: más cortos al principio y después de cada cambio de dosis, " +
        "más largos en las fases tranquilas.",
      "Además los valores específicos del lupus, anti-ADN nativo y complemento C3 y C4, y en todo caso la orina para buscar proteína.",
      "Los intervalos se deciden en la consulta, no en una aplicación. Lo que aquí ayuda: la pregunta de quién " +
        "los solicita, para que nada se quede colgado entre la consulta de familia y el hospital.",
    ],
  },
  {
    titel: "Antes de empezar algunos medicamentos",
    text: [
      "Antes de la azatioprina se determina una enzima que controla su degradación. Si falta o está " +
        "disminuida, amenazan alteraciones graves del hemograma. Preguntar por ello es legítimo.",
      "Antes de un tratamiento inmunosupresor hay que revisar el estado vacunal, porque después algunas cosas ya no se pueden.",
    ],
  },
  {
    titel: "La enfermedad celíaca en el seguimiento",
    text: [
      "tTG-IgA a lo largo del tiempo, además los nutrientes, y un asesoramiento dietético con experiencia en " +
        "enfermedad celíaca. Esto último no es un añadido: en las guías el contacto con un profesional es " +
        "parte integrante del tratamiento.",
      "Un valor normal de tTG no descarta una mucosa que aún no ha curado. Si persisten síntomas o carencias, " +
        "se sigue buscando.",
    ],
  },
  {
    titel: "Hueso",
    text: [
      "Con un tratamiento prolongado con glucocorticoides y en la enfermedad celíaca hay que tener el hueso a " +
        "la vista. Por debajo de los 40 años el riesgo no se puede estimar con la calculadora habitual, por eso " +
        "se mide en vez de calcular.",
      "Calcio y vitamina D suficientes, movimiento con el peso sobre las piernas, no fumar.",
    ],
    quellen: ["Guía ACR sobre la osteoporosis inducida por glucocorticoides 2022. DOI 10.1002/art.42646"],
  },
],

/* ------------------------------------------------------------------ Búsqueda */

suche: {
  warnung:
    "Esta recopilación ha nacido de la memoria. Desde el entorno en el que se construyó no se pudo alcanzar ni una sola página especializada ni una sola organización de pacientes, se comprobó y es así. Por tanto no se pudo verificar nada. Por eso aquí no hay, a propósito, ninguna dirección, ningún número de teléfono y ningún nombre de una clínica o de una médica: a ese nivel un error sería peligroso, y un número equivocado que alguien marca en pleno brote causa un daño real. Lo que hay aquí son tipos de sitios, sus nombres y términos de búsqueda. Los nombres pueden haber cambiado, las organizaciones pueden haberse fusionado o haber cambiado de nombre, un directorio puede haber dejado de existir. Por eso cada entrada lleva un grado de fiabilidad. La aplicación no comprueba nada de esto, no puede, no tiene conexión con el exterior. Antes de confiar en un sitio, hay que confirmarlo una vez: en la consulta de medicina de familia, en la consulta externa del hospital o en un grupo de pacientes.",

  laender: [
    { wert: "at", text: "Austria" },
    { wert: "de", text: "Alemania" },
    { wert: "ch", text: "Suiza" },
    { wert: "it", text: "Italia" },
    { wert: "eu", text: "Europa" },
  ],

  wege: [
    {
      land: "at",
      thema: "beides",
      name: "La derivación desde la consulta de medicina de familia",
      was: "El acceso a la consulta externa del hospital, y una valoración de a qué hospital del distrito se puede llegar de verdad.",
      weg: "En Austria la mayoría de las consultas externas hospitalarias exigen una derivación de una médica con contrato con el seguro público, y además, casi siempre, una cita concertada. En la consulta, di que buscas un servicio con experiencia en lupus eritematoso sistémico, no solo de reumatología. Menciona el segundo diagnóstico desde el principio: cambia la elección.",
      suchbegriff: "derivación consulta externa de reumatología",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "La consulta externa a la que ya vas",
      was: "El camino más corto, y el nombre de alguien que pregunte por su cuenta dentro del propio hospital.",
      weg: "En la próxima cita, pregunta quién entiende de lupus y enfermedad celíaca a la vez y si tendría sentido que te vieran en un centro especializado. Pedir una segunda opinión está permitido y es habitual, no es una moción de desconfianza. A quien le resulte delicado, puede formularlo como una pregunta por un seguimiento compartido.",
      suchbegriff: "pedir segunda opinión seguimiento compartido",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "El buscador de médicos del Colegio de Médicos de Austria",
      was: "El registro oficial de todas las médicas con su especialidad, filtrable por localidad.",
      weg: "Llega a través de un buscador a la Ärztekammer y a su Arztsuche; hay una a nivel federal y una por cada colegio regional. Importante en el lupus: en Austria la reumatología fue durante mucho tiempo un añadido a la medicina interna y solo más tarde se convirtió en un título propio. Las colegas mayores llevan el añadido, las más jóvenes el título. Busca por los dos.",
      suchbegriff: "Ärztekammer Arztsuche Innere Medizin Rheumatologie",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "El buscador de proveedores concertados de la caja del seguro de enfermedad",
      was: "Quién tiene contrato con el seguro público y quién no.",
      weg: "Mira en la página de la Österreichische Gesundheitskasse el buscador de médicos o de proveedores concertados. La diferencia es dinero: con una médica privada pagas tú primero y después te devuelven una parte. Cuando las esperas son largas ese es a veces el camino más rápido, pero conviene preguntar antes cuánto se reembolsa.",
      suchbegriff: "Österreichische Gesundheitskasse Arztsuche",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "lupus",
      name: "Sociedad Austriaca de Reumatología y Rehabilitación",
      was: "La sociedad científica, con lista de miembros y un resumen de los servicios de reumatología.",
      weg: "Busca la sociedad y mira después los miembros, los centros o las consultas externas. Quien está activo en una sociedad científica suele trabajar en un sitio con suficientes casos.",
      suchbegriff: "Österreichische Gesellschaft für Rheumatologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "lupus",
      name: "La Rheumaliga austriaca",
      was: "Grupos de pacientes con secciones regionales, y el saber de dónde te tratan bien como persona.",
      weg: "Busca la Rheumaliga y tu propio estado federado. Pregunta allí qué consulta externa atiende a personas con lupus, dónde la espera es soportable y dónde se escucha. Esa información no sale de ningún directorio.",
      suchbegriff: "Rheumaliga Österreich Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "La asociación austriaca de enfermedad celíaca",
      was: "Asesoramiento, listas de productos, grupos y, a menudo, también pistas sobre consultas externas y sobre dietistas con experiencia.",
      weg: "Busca Zöliakie y Österreich. Si el nombre no es el correcto, ve por la federación europea de asociaciones de celiaquía, que enumera a sus miembros país por país. El segundo camino funciona también cuando la organización se llama de otra manera de la que se recuerda.",
      suchbegriff: "Zöliakie Österreich Arbeitsgemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Sociedad Austriaca de Gastroenterología y Hepatología",
      was: "La sociedad científica del intestino, con miembros y actividades.",
      weg: "Busca la sociedad. De la enfermedad celíaca se ocupa la gastroenterología, no la reumatología. Quien busca una consulta externa busca allí miembros en su propia localidad.",
      suchbegriff: "Österreichische Gesellschaft für Gastroenterologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "beides",
      name: "La oficina de apoyo a los grupos de pacientes del estado federado",
      was: "Puesta en contacto con grupos, también para dos diagnósticos a la vez.",
      weg: "En cada estado federado hay una oficina subvencionada que reúne grupos de pacientes y pone en contacto con ellos. Busca Selbsthilfe y el estado federado, escribe allí y nombra los dos diagnósticos. Si no hay ningún grupo que encaje, esas oficinas suelen conocer igualmente a alguien.",
      suchbegriff: "Selbsthilfe Unterstützungsstelle Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "El portal público de salud del Estado",
      was: "Explicaciones oficiales sobre trámites, derechos y caminos dentro del sistema.",
      weg: "Busca el portal público de salud de Austria. Útil sobre todo para las cuestiones administrativas: derivación, reembolso de costes, médica privada, derechos de las pacientes, vías de reclamación.",
      suchbegriff: "öffentliches Gesundheitsportal Österreich",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Dietista con experiencia en enfermedad celíaca",
      was: "El acompañamiento nutricional que en la enfermedad celíaca forma parte del tratamiento y no es un extra opcional.",
      weg: "En Austria el título protegido es Diätologin, no Ernährungsberaterin. Busca a través del colegio profesional o pide una derivación en la consulta externa. La pregunta que cuenta es: a cuántas personas con enfermedad celíaca atiende usted al año.",
      suchbegriff: "Diätologin finden Österreich Berufsverband",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Sociedad Alemana de Reumatología e Inmunología Clínica",
      was: "La sociedad científica y la red de centros regionales de reumatología.",
      weg: "Busca la sociedad científica y los centros regionales cooperativos de reumatología. Esos centros son uniones de hospitales y consultas de una región, y sus listas son un buen punto de partida.",
      suchbegriff: "Deutsche Gesellschaft für Rheumatologie Rheumazentren",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "La Deutsche Rheuma-Liga",
      was: "La gran organización de pacientes, con federaciones regionales y listas de direcciones.",
      weg: "Busca la Rheuma-Liga y el estado federado. Mantiene direcciones de reumatólogas y de hospitales, pone en contacto con grupos y publica hojas informativas bien legibles. Las hojas informativas sirven también desde Austria, las direcciones no.",
      suchbegriff: "Deutsche Rheuma-Liga Landesverband",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Los grupos de lupus del ámbito de habla alemana",
      was: "Una comunidad propia solo para el lupus, con grupos regionales y saber de experiencia sobre consultas externas.",
      weg: "Pregunta por la comunidad de pacientes con lupus a través de la Rheuma-Liga, o busca directamente Lupus y Selbsthilfe. Sirve también desde Viena: las experiencias sobre tratamiento, fatiga y trámites administrativos se pueden trasladar, las direcciones no.",
      suchbegriff: "Lupus Erythematodes Selbsthilfegemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "zoeliakie",
      name: "La Deutsche Zöliakie-Gesellschaft",
      was: "Asesoramiento, información contrastada sobre productos, grupos y pistas sobre consultas externas con experiencia.",
      weg: "Busca la Deutsche Zöliakie-Gesellschaft. La información sobre productos sirve también desde Austria, porque muchos fabricantes son los mismos. Para buscar una consulta externa vale esto: las listas son alemanas.",
      suchbegriff: "Deutsche Zöliakie-Gesellschaft",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "El buscador de médicos de las asociaciones de médicos concertados",
      was: "Quién ejerce dónde y con qué especialidad.",
      weg: "Busca Arztsuche y Kassenärztliche Vereinigung, a nivel federal o para un estado federado. El servicio de atención a pacientes de esas asociaciones también consigue citas cuando corre prisa.",
      suchbegriff: "Arztsuche Kassenärztliche Vereinigung",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "La oficina nacional para los grupos de pacientes",
      was: "Grupos y puntos de contacto regionales, también para combinaciones raras.",
      weg: "Busca la oficina nacional de contacto e información sobre grupos de pacientes. Quien tiene dos diagnósticos pregunta allí por los dos y pide que le pongan en contacto con ambos.",
      suchbegriff: "NAKOS Selbsthilfe Datenbank",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Centros de enfermedades raras en hospitales universitarios",
      was: "Un punto de orientación para cuadros poco claros o combinados.",
      weg: "Busca Zentrum für Seltene Erkrankungen junto con una ciudad universitaria, o un atlas de atención para enfermedades raras. Esos centros suelen aceptar solo con derivación y con la documentación completa, y hay tiempos de espera.",
      suchbegriff: "Zentrum für Seltene Erkrankungen Versorgungsatlas",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "beides",
      name: "El registro de guías de las sociedades médicas científicas",
      was: "Las guías sobre el lupus y sobre la enfermedad celíaca, es decir, el listón con el que se puede medir una consulta externa.",
      weg: "Busca el registro de guías de la Arbeitsgemeinschaft der Wissenschaftlichen Medizinischen Fachgesellschaften y después la enfermedad. Es un registro, no un manual de consejos, y los textos están escritos para profesionales. Aun así, el resumen y las recomendaciones del principio se pueden leer, y de algunas guías hay una versión para pacientes.",
      suchbegriff: "AWMF Leitlinienregister Zöliakie",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Rheumaliga Schweiz con las ligas cantonales",
      was: "Asesoramiento, cursos y direcciones en Suiza.",
      weg: "Busca la Rheumaliga y el cantón. Las ligas cantonales son los verdaderos puntos de contacto.",
      suchbegriff: "Rheumaliga Schweiz",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Sociedad Suiza de Reumatología",
      was: "La sociedad científica con su listado de miembros.",
      weg: "Busca la sociedad y filtra por localidad en el apartado de miembros. Además, el registro de médicos de la organización profesional FMH, que lleva de forma oficial los títulos de especialista.",
      suchbegriff: "Schweizerische Gesellschaft für Rheumatologie Mitglieder",
      sicherheit: "mittel",
    },
    {
      land: "ch",
      thema: "zoeliakie",
      name: "La asociación suiza de celiaquía",
      was: "Asesoramiento e información sobre productos para Suiza.",
      weg: "Busca Zöliakie y Schweiz, o ve por la federación europea, que enumera la asociación miembro de cada país.",
      suchbegriff: "Zöliakie Schweiz Interessengemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "zoeliakie",
      name: "Associazione Italiana Celiachia",
      was: "La organización italiana de celiaquía, con asociaciones regionales y un distintivo para locales con garantía sin gluten.",
      weg: "Busca la organización. Para viajar a Italia, la lista de locales acreditados es lo más útil que hay allí. En el Tirol del Sur hay un grupo regional de lengua alemana.",
      suchbegriff: "Associazione Italiana Celiachia",
      sicherheit: "hoch",
    },
    {
      land: "it",
      thema: "beides",
      name: "La red italiana de enfermedades raras",
      was: "Centros designados oficialmente por región, en los que se hacen el diagnóstico y el seguimiento.",
      weg: "Italia mantiene una red nacional de enfermedades raras. Las regiones designan los centros, y del reconocimiento depende la exención de los copagos. El lupus eritematoso sistémico está en la lista nacional. Busca en italiano la red nacional y la región.",
      suchbegriff: "rete nazionale malattie rare presidi",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "beides",
      name: "El servicio sanitario del Tirol del Sur",
      was: "El único camino italiano sin barrera de idioma.",
      weg: "El servicio público de salud del Tirol del Sur trabaja en alemán. Para una segunda opinión o para preguntas sobre la enfermedad celíaca en Italia es la entrada más cómoda. Antes de una cita en el extranjero, aclara siempre primero la cuestión de los costes, mira el punto nacional de contacto.",
      suchbegriff: "Südtiroler Sanitätsbetrieb Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La red europea de referencia para las enfermedades raras del tejido conjuntivo",
      was: "Una lista oficial de centros expertos, país por país, designados por los estados miembros.",
      weg: "La Unión Europea mantiene redes de referencia para enfermedades raras. Del lupus eritematoso sistémico se ocupa la red de enfermedades raras del tejido conjuntivo y musculoesqueléticas. Busca European Reference Network y connective tissue, y filtra después la lista de miembros por Austria. Quien figura ahí ha sido revisado por una autoridad pública, no por una redacción.",
      suchbegriff: "European Reference Network connective tissue ReCONNET",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La red europea de referencia para las enfermedades inmunitarias",
      was: "Una segunda red que cubre las enfermedades autoinmunes y autoinflamatorias.",
      weg: "El mismo camino que en la entrada anterior, busca European Reference Network junto con immunodeficiency o autoimmune. Algunos hospitales están en las dos redes, y eso es buena señal.",
      suchbegriff: "European Reference Network autoimmune RITA",
      sicherheit: "mittel",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Orphanet, el directorio europeo de enfermedades raras",
      was: "Centros expertos, organizaciones de pacientes, registros y estudios, filtrables por país y en español.",
      weg: "Busca Orphanet, después la enfermedad, y después fíjate en el selector de país. Para la enfermedad celíaca el directorio solo se ocupa de la forma rara resistente al tratamiento, la enfermedad celíaca corriente es demasiado frecuente para eso.",
      suchbegriff: "Orphanet centros expertos lupus eritematoso",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La federación europea de las organizaciones de lupus",
      was: "El camino hacia la organización del propio país, aunque no se conozca su nombre.",
      weg: "Busca la federación europea y mira allí las organizaciones miembro de cada país. Es el camino más fiable hacia un grupo de lupus austriaco, porque una federación mantiene su lista de miembros.",
      suchbegriff: "Lupus Europe member organisations",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "zoeliakie",
      name: "La federación europea de las asociaciones de celiaquía",
      was: "La asociación miembro de cada país y, además, el símbolo de la espiga barrada para los productos con garantía sin gluten.",
      weg: "Busca la federación europea de asociaciones de celiaquía. A través de ella se encuentran la organización austriaca y las de los países vecinos, lo que cuenta cuando se viaja.",
      suchbegriff: "Association of European Coeliac Societies",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "beides",
      name: "El punto nacional de contacto para la asistencia sanitaria transfronteriza",
      was: "Información sobre lo que cuesta un tratamiento en otro país de la UE, lo que paga el seguro y lo que hay que autorizar antes.",
      weg: "Cada estado miembro tiene que mantener un punto de contacto así. Busca punto nacional de contacto y asistencia sanitaria transfronteriza, junto con el propio país. Pregunta allí antes de cada cita planificada en el extranjero, si no te quedas tú con la factura.",
      suchbegriff: "punto nacional de contacto asistencia sanitaria transfronteriza",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "El registro europeo de ensayos clínicos",
      was: "Qué hospitales a una distancia alcanzable trabajan en estudios sobre el lupus.",
      weg: "Busca el sistema europeo de información sobre ensayos clínicos y filtra después por enfermedad y por país. Los centros participantes vienen indicados. Eso no dice nada sobre la amabilidad de un hospital, pero sí mucho sobre dónde se juntan suficientes casos. Participar es voluntario y nunca es condición para recibir atención.",
      suchbegriff: "Clinical Trials Information System lupus Austria",
      sicherheit: "mittel",
    },
  ],

  merkmale: [
    { id: "ambulanz-sagen-viele", punkt: "La consulta externa puede decir a cuántas personas con lupus eritematoso sistémico atiende al año, sin pensarlo mucho." },
    { id: "feste-ansprechperson-wenigstens", punkt: "Hay una persona de referencia fija o al menos un equipo pequeño, en lugar de una cara nueva en cada cita." },
    { id: "krankheitsaktivitaet-messinstrument-erfasst", punkt: "La actividad de la enfermedad se registra con un instrumento de medida, y el valor consta en el informe, no solo en la cabeza." },
    { id: "benannten-schub-zwischen", punkt: "Hay un camino con nombre para el brote entre citas: una consulta de agudos, una dirección de correo o un número al que alguien responde." },
    { id: "nephrologie-dermatologie-augenheilkunde", punkt: "Nefrología, dermatología, oftalmología y obstetricia están en la misma casa o son socios fijos, y la consulta externa sabe explicar cómo funciona el paso de una a otra." },
    { id: "kinderwunsch-schwangerschaft-selbst", punkt: "Allí se habla por iniciativa propia del deseo de tener hijos y del embarazo, no solo cuando se pregunta." },
    { id: "zoeliakie-mitgedacht-entweder", punkt: "La enfermedad celíaca se tiene en cuenta: o hay gastroenterología en la misma casa, o la consulta externa sabe exactamente quién la atiende y escribe allí." },
    { id: "ernaehrungsfachkraft-zoeliakieerfahrung-erreichbar", punkt: "Hay acceso a un dietista-nutricionista con experiencia en enfermedad celíaca, y la derivación es un trámite de un momento, no una negociación." },
    { id: "jedem-termin-geht", punkt: "Después de cada cita sale un informe a la consulta de medicina de familia, y tú misma recibes una copia sin tener que pelearla." },
    { id: "klar-geregelt-welche", punkt: "Está claramente regulado quién solicita cada control, para que nada se quede colgado entre el hospital y la consulta de medicina de familia." },
    { id: "muedigkeit-lichtempfindlichkeit-teil", punkt: "La fatiga y la fotosensibilidad se tratan como parte de la enfermedad y no como una nota al margen." },
    { id: "haus-nimmt-register", punkt: "El centro participa en un registro, en una red de referencia o en estudios, una señal de que allí los casos se recogen de forma sistemática." },
    { id: "termin-dauert-lang", punkt: "La cita dura lo suficiente para hablar de dos enfermedades, y al final queda fijada la siguiente." },
    { id: "kommt-schlechten-ausgezeichnete", punkt: "Se puede llegar, también en un día malo: una consulta externa excelente a tres horas de distancia se vuelve mala en pleno brote." },
  ],

  erstgespraech: [
    "La copia de seguridad de esta aplicación, junto con el informe médico de doce semanas, impreso. Las cifras a lo largo de semanas dicen más que el recuerdo de un día malo.",
    "Todos los informes en copia, ordenados por fecha: analíticas, informes de alta, el resultado de la biopsia intestinal, valores de anticuerpos antiguos. Los originales te los quedas tú.",
    "Una lista de todos los medicamentos con su dosis, además de los complementos alimenticios y la anticoncepción. También lo que se retiró, y por qué se retiró.",
    "La primera pregunta: se hace usted cargo del seguimiento continuado, o esto es una valoración única. De eso depende todo lo demás.",
    "La pregunta de quién escribe a quién: recibe un informe la consulta de medicina de familia, y recibo yo uno.",
    "La pregunta de qué hay que observar y anotar hasta la próxima vez. Así el diario tiene un objetivo en lugar de ser solo aplicado.",
    "La pregunta de cómo se localiza a la consulta externa si entretanto la cosa empeora, y qué vale el fin de semana.",
    "Apuntar antes tres cosas que a ti te importen más, y decirlas primero. El tiempo es corto y si no se va en otras cosas.",
    "Llevar a alguien contigo cuando la cabeza está en la niebla. Otro par de oídos oye más, y así no hay que escuchar y tomar notas a la vez.",
    "Tomar notas o grabar. Antes de grabar, preguntar; la mayoría dice que sí.",
    "Sacar tú misma el tema de la enfermedad celíaca, también en una consulta de reumatología. Si no, se cae entre las especialidades.",
    "La tarjeta sanitaria y la derivación. Con una médica privada, guarda la factura y aclara antes cuánto se devuelve.",
    "Poner la cita en la mitad mejor del día y no planear nada más después. Una cita cuesta más fuerza de la que ocupa en el calendario.",
    "Si algo queda poco claro, decir la frase: no lo he entendido, puede decirlo de otra manera. Eso no es debilidad, es el sentido de la cita.",
    "Justo después de la cita, una nota breve, mientras está fresco. Con la niebla mental, el recuerdo de la conversación es peor de lo que uno cree.",
  ],
},

};
