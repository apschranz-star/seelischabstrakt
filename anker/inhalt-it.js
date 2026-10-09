/*
 * Il contenuto di Anker in italiano.
 *
 * Questo file è la traduzione di inhalt-de.js. La struttura resta identica:
 * stesse chiavi, stessi id, stesse fonti. Tradotto è solo il testo leggibile.
 */

window.INHALT = window.INHALT || {};
window.INHALT.it = {};

/* ------------------------------------------------------------------ Segni */

window.INHALT.it.symptome = [
  "Dolore articolare",
  "Rigidità mattutina",
  "Eritema a farfalla",
  "Altro eritema",
  "Fotosensibilità",
  "Ulcere orali",
  "Caduta dei capelli",
  "Febbre",
  "Linfonodi ingrossati",
  "Raynaud",
  "Occhi secchi",
  "Bocca secca",
  "Mal di testa",
  "Dolore al torace respirando",
  "Palpitazioni",
  "Fiato corto",
  "Dolore addominale",
  "Gonfiore addominale",
  "Diarrea",
  "Stitichezza",
  "Nausea",
  "Gambe gonfie",
  "Urina schiumosa",
  "Dolore muscolare",
];

/* ---------------------------------------------------------------- Mangiare */

window.INHALT.it.essen = [
  {
    kicker: "Celiachia",
    titel: "La regola senza eccezioni",
    lead:
      "Nella celiachia l'alimentazione senza glutine non è una dieta fra le tante, " +
      "è la terapia. Vale per tutta la vita, anche quando dopo una piccola quantità " +
      "non senti nulla: il danno alla mucosa intestinale si produce anche senza disturbi.",
    punkte: [
      { art: "nein", was: "Il frumento in ogni forma", warum: "Ne fanno parte farro spelta, farro dicocco, farro monococco, kamut, il farro verde tostato e l'amido di frumento senza dicitura. Anche i cereali antichi sono frumento." },
      { art: "nein", was: "Orzo e segale", warum: "Malto, estratto di malto, aroma di malto e la birra d'orzo sono gli inciampi più frequenti." },
      { art: "vielleicht", was: "Avena", warum: "L'avena in sé non contiene glutine, ma quasi sempre viene lavorata insieme al frumento. Solo come avena dichiarata senza glutine, e anche allora una piccola minoranza non la tollera." },
      { art: "ja", was: "Riso, mais, grano saraceno, miglio, quinoa, amaranto, teff", warum: "Per natura senza glutine. Il grano saraceno, nonostante il nome, non è grano." },
      { art: "ja", was: "Patate, legumi, frutta secca a guscio, semi", warum: "Reggono il pasto quando il pane viene a mancare, e portano proteine e fibra." },
      { art: "ja", was: "Carne, pesce, uova, latticini, frutta, verdura non lavorati", warum: "Tutto ciò che non ha una lista di ingredienti è la parte sicura della spesa." },
    ],
  },
  {
    kicker: "Dove va storto",
    titel: "Nascosto e non visto",
    lead:
      "La maggior parte delle esposizioni al glutine nella vita di tutti i giorni non viene " +
      "da un pane, ma da una piccolezza a cui nessuno pensa.",
    punkte: [
      { art: "nein", was: "Salsa di soia", warum: "La salsa di soia classica è fermentata con il frumento. Il tamari di solito è senza glutine, ma solo se dichiarato." },
      { art: "nein", was: "Friggitrici con prodotti impanati", warum: "Le patatine fritte nella stessa friggitrice dei prodotti impanati non sono senza glutine. Al ristorante chiedilo." },
      { art: "nein", was: "Tostapane in comune", warum: "Bastano le briciole. Un tostapane tuo o le buste per tostare risolvono la cosa." },
      { art: "nein", was: "Addensanti in salse e zuppe", warum: "Roux, dadi da brodo, preparati per legare le salse, marinate pronte." },
      { art: "vielleicht", was: "Farmaci e integratori", warum: "Raro, ma l'amido può esserci come eccipiente. Fallo verificare in farmacia." },
      { art: "vielleicht", was: "Può contenere tracce", warum: "È un'indicazione volontaria del produttore, non una misura. Ciò che porta il simbolo della spiga barrata o la dicitura senza glutine è invece soggetto al limite di legge di 20 mg di glutine per chilogrammo." },
      { art: "vielleicht", was: "Baci, burro in comune, tagliere del pane", warum: "In casa aiutano una burriera tua, un tagliere tuo e creme spalmabili in cui entra un solo coltello." },
    ],
  },
  {
    kicker: "Nel lupus",
    titel: "Che cosa suggerisce la ricerca",
    lead:
      "Nessuna alimentazione guarisce il lupus, e nessuno studio mostra che un cambiamento " +
      "sostituisca i farmaci. Quello che esiste sono modelli alimentari che negli studi si " +
      "accompagnano a minore attività di malattia, lipidi nel sangue migliori e meno fatigue. " +
      "La forza di queste prove è indicata punto per punto nel capitolo Sapere.",
    punkte: [
      { art: "ja", was: "Modello mediterraneo", warum: "Verdura, frutta, legumi, olio d'oliva, pesce, frutta secca a guscio; poca carne rossa e poca carne lavorata. Negli studi osservazionali sul lupus si associa a una minore attività di malattia." },
      { art: "ja", was: "Pesce grasso due volte a settimana", warum: "Salmone, sgombro, aringa, sardina. Gli omega-3 nel lupus sono stati studiati in diversi piccoli studi controllati." },
      { art: "ja", was: "Proteine a sufficienza durante la giornata", warum: "Mantengono i muscoli, e i muscoli sono ciò che si perde per primo con la fatigue e sotto steroidi." },
      { art: "ja", was: "Cercare la fibra di proposito", warum: "La cucina senza glutine ne è povera di suo. Legumi, semi di lino, verdura, frutta con la buccia." },
      { art: "vielleicht", was: "Sale con parsimonia", warum: "Nell'animale da esperimento molto sale favorisce linfociti T infiammatori. Nell'essere umano, nel lupus, questo non è dimostrato. Per la pressione e per i reni ha comunque senso." },
      { art: "vielleicht", was: "Alcol", warum: "Con il metotressato e guardando al fegato è un tema da visita, non da app." },
    ],
  },
  {
    kicker: "Prudenza",
    titel: "Che cosa nel lupus è meglio lasciare fuori",
    lead:
      "Lista breve, e ogni punto ha un motivo concreto. Tutto il resto che circola in rete " +
      "come divieto nel lupus, di solito non regge a una verifica.",
    punkte: [
      { art: "nein", was: "Germogli di alfalfa e integratori di alfalfa", warum: "Contengono L-canavanina. Su questo esistono descrizioni di casi con quadri simili al lupus ed esperimenti su scimmie. Le prove sono vecchie e scarse, ma rinunciarvi non costa nulla, perciò il punto compare in quasi ogni raccomandazione per le pazienti." },
      { art: "nein", was: "Prodotti che stimolano il sistema immunitario", warum: "Echinacea e prodotti simili che dichiarano di stimolare il sistema immunitario. In una malattia in cui il sistema immunitario fa già troppo, è la direzione sbagliata." },
      { art: "vielleicht", was: "Integratori singoli ad alto dosaggio presi di testa propria", warum: "Soprattutto tutto ciò che riguarda il ferro: il ferro va integrato solo se una carenza è stata misurata." },
      { art: "vielleicht", was: "Pompelmo", warum: "Influisce sulla degradazione di alcuni farmaci. Se questo riguardi anche i tuoi farmaci, la farmacia te lo dice in un minuto." },
      { art: "nein", was: "Fumare", warum: "Aumenta l'attività di malattia, peggiora l'effetto dell'idrossiclorochina e alza il rischio cardiaco, che è già aumentato." },
    ],
  },
  {
    kicker: "Le due insieme",
    titel: "Nutrienti che qui saltano due volte",
    lead:
      "La celiachia danneggia l'assorbimento, il lupus e la sua terapia aumentano il fabbisogno " +
      "o le perdite. Questi valori vanno misurati, non indovinati, e si integra solo ciò che manca.",
    punkte: [
      { art: "vielleicht", was: "Ferro e ferritina", warum: "La carenza più frequente nella celiachia, e un motivo molto comune di stanchezza che non ha nulla a che fare con il lupus." },
      { art: "vielleicht", was: "Vitamina D", warum: "Nel lupus è a rischio due volte: il sole si evita, gli steroidi aumentano la perdita, e nella celiachia l'intestino assorbe peggio." },
      { art: "vielleicht", was: "Vitamina B12 e acido folico", warum: "Entrambi si assorbono nell'intestino tenue, proprio dove agisce la celiachia. Inoltre le farine senza glutine sono raramente fortificate." },
      { art: "vielleicht", was: "Calcio", warum: "Importante per l'osso, e l'osso nella celiachia e sotto steroidi è sotto pressione due volte." },
      { art: "vielleicht", was: "Zinco e magnesio", warum: "Nella celiachia si misurano anche questi, se i disturbi restano." },
    ],
  },
  {
    kicker: "Restare onesti",
    titel: "Le trappole della cucina senza glutine",
    lead:
      "Senza glutine non vuol dire sano. I prodotti senza glutine pronti sono spesso di solo amido, " +
      "poveri di fibra e più cari. È un problema noto, non un fallimento personale.",
    punkte: [
      { art: "vielleicht", was: "Poca fibra", warum: "Amido di riso, amido di mais e tapioca ne portano quasi nessuna. Legumi, semi di lino, cuticola di psillio e verdura compensano." },
      { art: "vielleicht", was: "Molto amido rapido", warum: "Il pane bianco senza glutine fa salire la glicemia più ripidamente dell'originale. Abbinalo a proteine e grassi." },
      { art: "vielleicht", was: "Il riso come base principale", warum: "Il riso assorbe arsenico dal terreno. Non è un motivo di panico, ma è un motivo per alternare grano saraceno, miglio, quinoa, patate e mais invece di riso tutti i giorni." },
      { art: "vielleicht", was: "Poche vitamine del gruppo B", warum: "In molti paesi la farina di frumento è fortificata, quella senza glutine di solito no." },
    ],
  },
];

/* ------------------------------------------------------------------ Ricette */

window.INHALT.it.rezepte = [
  {
    name: "Piatto senza cucinare",
    aufwand: "0 minuti",
    warum:
      "Per i giorni in cui i fornelli sono troppo lontani. Comunque proteine, grassi e " +
      "qualcosa di verde, e quindi meglio di niente o di un biscotto.",
    zutaten: [
      "1 scatoletta di sardine o sgombro sott'olio d'oliva",
      "1 manciata di pomodorini o cetriolo",
      "Gallette di riso o pane senza glutine",
      "Olio d'oliva, limone, sale",
    ],
    schritte: [
      "Apri la scatoletta, mettila nel piatto.",
      "Aggiungi la verdura, senza tagliarla se non serve.",
      "Limone sopra, olio sopra, fatto.",
    ],
    achtung: "Le gallette di riso solo come contorno, non come base di ogni giorno. Le sardine portano omega-3, calcio e vitamina D.",
  },
  {
    name: "Overnight oats, senza glutine",
    aufwand: "3 minuti la sera",
    warum: "Al mattino la colazione è già lì pronta. Fibra e ferro dai semi.",
    zutaten: [
      "50 g di fiocchi d'avena senza glutine",
      "150 ml di latte o bevanda vegetale",
      "1 cucchiaio di semi di lino macinati o semi di chia",
      "1 cucchiaino di crema di frutta secca",
      "Frutta",
    ],
    schritte: [
      "Tutto in un vasetto, mescola, chiudi.",
      "In frigorifero per la notte.",
      "Al mattino la frutta sopra.",
    ],
    achtung: "Solo avena dichiarata senza glutine. Una piccola minoranza di persone con celiachia non tollera nemmeno l'avena pura; dopo averla introdotta fai attenzione ai disturbi e parlane con il tuo medico.",
  },
  {
    name: "Zuppa di lenticchie",
    aufwand: "25 minuti, una pentola",
    warum:
      "Ferro, fibra e proteine da un ingrediente economico. Si conserva tre giorni in frigorifero " +
      "e si congela in porzioni, cosa che nei giorni brutti vale più di qualsiasi ricetta.",
    zutaten: [
      "200 g di lenticchie rosse",
      "1 cipolla, 2 spicchi d'aglio, 2 carote",
      "1 cucchiaio di concentrato di pomodoro",
      "1 cucchiaino di cumino, 1 cucchiaino di paprica",
      "1 l di brodo vegetale senza glutine",
      "Limone, olio d'oliva",
    ],
    schritte: [
      "Taglia finemente cipolla, aglio e carota e falli appassire nell'olio.",
      "Tosta brevemente insieme il concentrato di pomodoro e le spezie.",
      "Aggiungi lenticchie e brodo, fai sobbollire 20 minuti.",
      "Aggiusta con il limone. Qui il limone non è un accessorio: la vitamina C migliora nettamente l'assorbimento del ferro di origine vegetale.",
    ],
    achtung: "Controlla il brodo, molti dadi contengono frumento.",
  },
  {
    name: "Salmone al forno, verdura accanto",
    aufwand: "25 minuti, una teglia",
    warum: "Omega-3 e vitamina D in un piatto solo, e la teglia è tutti i piatti da lavare.",
    zutaten: [
      "2 filetti di salmone",
      "Broccoli, peperoni, zucchine, quello che c'è",
      "Olio d'oliva, sale, limone",
      "Patate a spicchi",
    ],
    schritte: [
      "Forno a 200 gradi.",
      "Patate e verdura sulla teglia con olio e sale, 15 minuti.",
      "Aggiungi il salmone, ancora da 10 a 12 minuti.",
      "Limone sopra.",
    ],
  },
  {
    name: "Bowl di grano saraceno",
    aufwand: "20 minuti",
    warum: "Grano saraceno al posto del riso, così nel piatto non c'è riso tutti i giorni.",
    zutaten: [
      "150 g di grano saraceno",
      "1 barattolo di ceci",
      "Cetriolo, pomodoro, cipolla rossa",
      "Yogurt o tahina, limone, olio d'oliva",
      "Prezzemolo",
    ],
    schritte: [
      "Cuoci il grano saraceno da 12 a 15 minuti in acqua salata, scola, lascia raffreddare.",
      "Taglia la verdura, sciacqua i ceci.",
      "Mescola tutto, versaci sopra una salsa di yogurt o tahina con limone.",
    ],
    achtung: "Il grano saraceno non è frumento, ma sullo scaffale sta spesso accanto alle farine. Fai attenzione alla dicitura.",
  },
  {
    name: "Curry di ceci",
    aufwand: "20 minuti, una pentola",
    warum: "Ferro e fibra, e il secondo giorno è più buono.",
    zutaten: [
      "2 barattoli di ceci",
      "1 barattolo di pomodori, 1 barattolo di latte di cocco",
      "Cipolla, aglio, zenzero",
      "Curry in polvere o garam masala",
      "Spinaci, freschi o surgelati",
    ],
    schritte: [
      "Rosola cipolla, aglio e zenzero, tosta brevemente le spezie insieme.",
      "Aggiungi pomodori e latte di cocco, fai sobbollire 10 minuti.",
      "Incorpora ceci e spinaci, lascia insaporire.",
    ],
    achtung: "Le paste di curry pronte e le miscele di spezie possono contenere frumento come supporto.",
  },
  {
    name: "Verdura al forno, di scorta",
    aufwand: "40 minuti, di cui 5 di lavoro",
    warum:
      "La vera risposta alla fatigue non è una ricetta veloce, è un frigorifero in cui c'è già " +
      "qualcosa di pronto. Una teglia una volta, contorno per tre giorni.",
    zutaten: [
      "La verdura che c'è, a pezzi grossi",
      "Olio d'oliva, sale, erbe aromatiche",
      "Più una teglia di patate o patate dolci",
    ],
    schritte: [
      "Tutto su due teglie, olio sopra, 200 gradi, da 35 a 40 minuti.",
      "Fredda, in contenitori, in frigorifero.",
      "Più tardi diventa un pasto con uovo, ceci, pesce o yogurt.",
    ],
  },
  {
    name: "Sveglia verde",
    aufwand: "4 minuti",
    warum: "Quando masticare è troppo. Non sostituisce i pasti, ma è meglio di un pasto saltato.",
    zutaten: [
      "1 manciata di spinaci",
      "1 banana, 1 manciata di frutti di bosco",
      "1 cucchiaio di crema di frutta secca o semi di lino",
      "Yogurt o bevanda vegetale",
      "Il succo di mezza arancia",
    ],
    schritte: ["Tutto nel frullatore.", "Non lasciare fuori l'arancia, la vitamina C tira fuori il ferro dagli spinaci."],
  },
];

/* -------------------------------------------------------- Esami di laboratorio */

window.INHALT.it.laborwerte = [
  { schluessel: "dsdna", gruppe: "Lupus", name: "Anti-dsDNA", einheit: "IU/ml", bedeutung: "Un anticorpo che nel lupus spesso sale e scende insieme all'attività di malattia. Valori in salita sono un segnale, non una diagnosi." },
  { schluessel: "c3", gruppe: "Lupus", name: "Complemento C3", einheit: "g/l", bedeutung: "Tipicamente scende quando il lupus è attivo, perché il complemento viene consumato nel processo infiammatorio." },
  { schluessel: "c4", gruppe: "Lupus", name: "Complemento C4", einheit: "g/l", bedeutung: "Come il C3. I due insieme si leggono come andamento nel tempo, non come valore singolo." },
  { schluessel: "bsg", gruppe: "Infiammazione", name: "VES", einheit: "mm/h", bedeutung: "Aumenta in modo aspecifico quando c'è infiammazione. Nel lupus spesso è alta mentre la PCR resta normale." },
  { schluessel: "crp", gruppe: "Infiammazione", name: "PCR", einheit: "mg/l", bedeutung: "Nel lupus spesso è normale. Una PCR nettamente aumentata sposta il sospetto piuttosto verso un'infezione, cosa che sotto immunosoppressione conta." },
  { schluessel: "kreatinin", gruppe: "Rene", name: "Creatinina", einheit: "mg/dl", bedeutung: "Misura della funzione renale." },
  { schluessel: "upcr", gruppe: "Rene", name: "Rapporto proteine/creatinina urinarie", einheit: "mg/g", bedeutung: "Il segnale precoce più importante di un interessamento renale. Le proteine nelle urine non fanno male e si notano solo se le si cerca." },
  { schluessel: "hb", gruppe: "Emocromo", name: "Emoglobina", einheit: "g/dl", bedeutung: "L'anemia è una delle cause fisiche più frequenti di stanchezza ed è comune sia nel lupus sia nella celiachia." },
  { schluessel: "leuko", gruppe: "Emocromo", name: "Leucociti", einheit: "/nl", bedeutung: "Nel lupus spesso bassi, e con alcuni farmaci il loro andamento è un valore di sicurezza." },
  { schluessel: "thrombo", gruppe: "Emocromo", name: "Piastrine", einheit: "/nl", bedeutung: "Nel lupus possono essere basse." },
  { schluessel: "ttg", gruppe: "Celiachia", name: "tTG-IgA", einheit: "U/ml", bedeutung: "Il valore di controllo della celiachia nel tempo. Con un'alimentazione senza glutine rigorosa scende nell'arco di mesi. Un valore che torna a salire fa pensare a un apporto di glutine." },
  { schluessel: "iga", gruppe: "Celiachia", name: "IgA totali", einheit: "g/l", bedeutung: "Si determina una volta: in caso di deficit di IgA il tTG-IgA risulterebbe falsamente basso e il test non varrebbe nulla." },
  { schluessel: "ferritin", gruppe: "Nutrienti", name: "Ferritina", einheit: "ng/ml", bedeutung: "Deposito di ferro. Attenzione: la ferritina sale anche con l'infiammazione, perciò nel lupus si legge insieme alla PCR." },
  { schluessel: "vitd", gruppe: "Nutrienti", name: "Vitamina D, 25-OH", einheit: "ng/ml", bedeutung: "Nel lupus spesso bassa, perché il sole si evita e gli steroidi aumentano la perdita." },
  { schluessel: "b12", gruppe: "Nutrienti", name: "Vitamina B12", einheit: "pg/ml", bedeutung: "Si assorbe nell'intestino tenue, cioè proprio dove agisce la celiachia." },
  { schluessel: "folat", gruppe: "Nutrienti", name: "Acido folico", einheit: "ng/ml", bedeutung: "Come la B12. Particolarmente importante in caso di desiderio di gravidanza e con alcuni farmaci." },
  { schluessel: "tsh", gruppe: "Tiroide", name: "TSH", einheit: "mU/l", bedeutung: "Una tiroide che funziona poco dà esattamente la stanchezza che si attribuisce al lupus. Le malattie autoimmuni della tiroide sono più frequenti in entrambe le malattie di base." },
];

/* ----------------------------------------------------------- Segnali d'allarme */

window.INHALT.it.warnzeichen = [
  {
    kicker: "Subito",
    titel: "Numero di emergenza o pronto soccorso",
    punkte: [
      { dringend: "nein", zeichen: "Difficoltà a respirare o forte dolore al torace", warum: "Può voler dire embolia polmonare, pericardite o pleurite. Nel lupus il rischio di trombi è aumentato, soprattutto con gli anticorpi antifosfolipidi." },
      { dringend: "nein", zeichen: "Debolezza improvvisa, disturbo del linguaggio o della vista", warum: "Segni di ictus. Nel lupus vanno presi sul serio a ogni età." },
      { dringend: "nein", zeichen: "Crisi convulsiva o forte stato confusionale", warum: "Può essere un interessamento del sistema nervoso." },
      { dringend: "nein", zeichen: "Febbre alta durante l'immunosoppressione", warum: "Sotto immunosoppressione un'infezione può diventare grave in fretta, e la solita reazione di difesa manca. Non aspettare." },
      { dringend: "nein", zeichen: "Forte mal di testa con rigidità del collo", warum: "Sospetto di meningite." },
    ],
  },
  {
    kicker: "Questa settimana",
    titel: "A visita in tempi brevi",
    punkte: [
      { dringend: "vielleicht", zeichen: "Urina schiumosa, gambe o palpebre gonfie", warum: "Indica proteine nelle urine e quindi un interessamento renale. La nefrite lupica per molto tempo non dà disturbi e si trova solo con il controllo delle urine." },
      { dringend: "vielleicht", zeichen: "Nuovo eritema con febbre e dolori articolari", warum: "Il quadro tipico di una riacutizzazione." },
      { dringend: "vielleicht", zeichen: "Nettamente meno urina del solito", warum: "Va chiarito sul versante renale." },
      { dringend: "vielleicht", zeichen: "Sanguinamenti o lividi senza un motivo", warum: "Può indicare piastrine basse." },
      { dringend: "vielleicht", zeichen: "Diarrea che non passa, calo di peso nonostante l'alimentazione senza glutine", warum: "Nella celiachia la causa più frequente è un apporto nascosto di glutine, ma va comunque controllato." },
      { dringend: "vielleicht", zeichen: "Nuovo disturbo della vista in corso di idrossiclorochina", warum: "Il controllo della retina ha una cadenza fissa, un disturbo nuovo non aspetta quella scadenza." },
    ],
  },
  {
    kicker: "Da dire al prossimo appuntamento",
    titel: "Importante, ma non urgente",
    punkte: [
      { dringend: "ja", zeichen: "Fatigue che peggiora nell'arco di settimane", warum: "Va chiarita: emocromo, tiroide, ferro, vitamina D, sonno, umore. Non tutto questo è lupus, ed è una buona notizia, perché molto di questo si può trattare." },
      { dringend: "ja", zeichen: "Nuova caduta dei capelli, ulcere orali, fotosensibilità", warum: "Fanno parte della descrizione dell'attività e dovrebbero essere documentate." },
      { dringend: "ja", zeichen: "Umore, ansia, voglia di fare", warum: "Nel lupus sono frequenti e strettamente intrecciati con la fatigue. Se ne parla troppo di rado." },
      { dringend: "ja", zeichen: "Il desiderio di un figlio, anche se è ancora lontano", warum: "Alcuni farmaci vanno cambiati molto tempo prima, e nel lupus una gravidanza si pianifica meglio in una fase tranquilla." },
    ],
  },
];

/* -------------------------------------------------------------- Domande */

window.INHALT.it.fragen = [
  { frage: "Quanto è attivo adesso il mio lupus, in numeri?", warum: "Per questo esistono strumenti di misura. Conoscere il proprio numero rende leggibile l'andamento negli anni." },
  { frage: "Quando sono state controllate l'ultima volta le proteine nelle urine?", warum: "Il rene non si fa sentire da solo." },
  { frage: "Quali valori vanno controllati e ogni quanto, e chi li prescrive?", warum: "Così non resta niente in mezzo fra il medico di famiglia e l'ambulatorio ospedaliero." },
  { frage: "Quando scade il prossimo controllo della retina?", warum: "Con l'idrossiclorochina per questo c'è una cadenza fissa." },
  { frage: "Quanto è alta la mia dose di cortisone, e qual è il piano per abbassarla?", warum: "Le linee guida puntano alla dose di mantenimento più bassa possibile." },
  { frage: "Ferro, vitamina D, B12, acido folico e calcio sono stati misurati di recente?", warum: "Nella celiachia e sotto cortisone sono il rifornimento più importante, e una causa frequente di stanchezza." },
  { frage: "Quando è stata l'ultima densitometria ossea, e ne serve una?", warum: "Celiachia e cortisone agiscono entrambi sull'osso." },
  { frage: "Come va il mio valore di tTG nel tempo?", warum: "Mostra se l'alimentazione senza glutine è davvero senza falle." },
  { frage: "Quali vaccinazioni mi mancano, e quali non posso fare con questa terapia?", warum: "I vaccini vivi sotto immunosoppressione sono un tema." },
  { frage: "Che cosa faccio se ho febbre o un'infezione, chi chiamo?", warum: "Questo piano lo si vuole avere prima di averne bisogno." },
  { frage: "Quale contraccezione va bene per la mia situazione?", warum: "Con gli anticorpi antifosfolipidi per la contraccezione con estrogeni valgono considerazioni particolari." },
  { frage: "Posso fare sport, e quanto, anche quando sto male?", warum: "La risposta è quasi sempre sì, ma la dose va discussa, soprattutto se c'è un interessamento del cuore, dei polmoni o dei reni." },
];

/* ------------------------------------------------------------------ Sapere */

window.INHALT.it.wissen = [
  {
    kicker: "Prima di tutto",
    titel: "Come è nato questo testo",
    abschnitte: [
      {
        frage: "Da dove viene tutto questo, e quanto vale?",
        antwort: [
          "Questo testo è un orientamento, non un articolo scientifico e non un secondo parere. È scritto " +
            "in modo da poterci andare a una visita e fare domande migliori.",
          "Mentre veniva messo insieme, i lavori originali <b>non si sono potuti aprire</b>: la rete in cui " +
            "questo testo è nato non lascia passare i siti medici specialistici. Cercare si poteva, leggere no. " +
            "Questo ha una conseguenza chiara, e sta qui e non in fondo in caratteri piccoli: <b>i singoli numeri " +
            "degli studi, cioè percentuali, dimensioni dell'effetto e numerosità, in questo testo non compaiono " +
            "quasi mai, di proposito.</b> Quello che c'è è la direzione di ciò che si è capito e la forza delle prove.",
          "In compenso, a ogni capitolo ci sono i documenti originali con il loro numero. Con un PMID un lavoro " +
            "si trova in pochi secondi, e ogni medico ha accesso. Questo testo è quindi costruito come indicazione " +
            "verso le fonti, non come loro sostituto.",
        ],
        staerke: "Inquadramento, non evidenza.",
      },
      {
        frage: "Che cosa questo testo di sicuro non può fare",
        antwort: [
          "Non conosce i tuoi valori, non conosce il tuo interessamento d'organo e non conosce la tua storia. " +
            "Nel lupus è proprio da questo che dipende quasi ogni decisione.",
          "Non dice nulla su nessuna dose. Non perché sia un segreto, ma perché indicare una dose senza avere " +
            "davanti la persona non ha senso e può fare danno.",
          "Ed è una fotografia, non un abbonamento. Nel lupus negli ultimi anni si è mosso molto. Quando questo " +
            "testo invecchia, non diventa sbagliato, ma incompleto.",
        ],
      },
    ],
  },

  {
    kicker: "Il tema principale",
    titel: "La fatigue",
    abschnitte: [
      {
        frage: "Perché sono così stanca anche se i valori sono buoni?",
        antwort: [
          "Perché nel lupus questo è il caso normale, non l'eccezione. La fatigue è il sintomo più frequente e " +
            "per molte il più pesante, e <b>non</b> segue l'attività di malattia misurata.",
          "È uno dei risultati più volte confermati in questo campo: le solite misure di attività spiegano solo " +
            "una piccola parte di quanto una persona sia sfinita. Un quadro tranquillo non esclude quindi una " +
            "fatigue grave. Chi lo sa non deve giustificarsi e continua a cercare nel punto giusto.",
          "Negli studi, ciò che si lega più fortemente alla fatigue sono <b>il disturbo del sonno, il dolore, " +
            "una fibromialgia associata, l'umore e l'ansia</b>. Non è una svalutazione del tipo " +
            "\"allora è psicologico\". È il contrario: nomina cose contro cui si può fare qualcosa.",
        ],
        staerke: "Forte per lo sganciamento dall'attività misurata. Forte per sonno, dolore, umore e fibromialgia come fattori associati.",
        quellen: [
          "Arnaud L et al., LEAF-Studie, RMD Open 2023. PMID 38056917",
          "Monahan RC et al., Lupus 2021. PMID 33779389",
          "Ahn GE, Ramsey-Goldman R, Int J Clin Rheumatol 2012. PMC3380630",
          "Cornet A et al., Lupus Sci Med 2021;8:e000469",
        ],
      },
      {
        frage: "Che cosa va chiarito prima di attribuire la fatigue al lupus?",
        antwort: [
          "Alcune di queste cose si trattano bene, e proprio per questo vale la pena guardare. Se c'è anche una " +
            "celiachia, vale il doppio, perché l'assorbimento nell'intestino può essere disturbato.",
        ],
        liste: [
          "<b>Emocromo</b>, per l'anemia. Frequente sia nel lupus sia nella celiachia, e una delle cause fisiche più frequenti di spossatezza.",
          "<b>Ferro e ferritina</b>. Nella celiachia la carenza più frequente in assoluto. Attenzione: la ferritina sale con l'infiammazione, si legge insieme alla PCR.",
          "<b>Tiroide</b>. Un ipotiroidismo dà esattamente questo quadro, e le malattie autoimmuni della tiroide sono più frequenti in entrambe le malattie di base.",
          "<b>Vitamina D, B12, acido folico</b>.",
          "<b>Valori renali e urine</b>, perché un interessamento renale resta muto a lungo.",
          "<b>Sonno</b>. Dormire male nel lupus è molto frequente e negli studi è il fattore che più si associa alla fatigue.",
          "<b>Umore e ansia</b>. Depressione e ansia nel lupus sono nettamente più frequenti che nella popolazione generale.",
          "<b>Farmaci</b>, come tema da portare alla visita.",
        ],
        staerke: "Questa lista è pratica clinica e logica delle linee guida, non un singolo studio.",
      },
      {
        frage: "Che cosa aiuta davvero contro la fatigue?",
        antwort: [
          "La risposta onesta ha due parti. Primo: la singola misura meglio documentata è <b>l'attività " +
            "fisica</b>, adattata e costruita nell'arco di settimane. Secondo: le prove a sostegno sono più " +
            "piccole e più contraddittorie di quanto si legga nelle guide divulgative.",
          "In concreto: una revisione Cochrane del 2023 arriva a una bassa certezza dei risultati e per la " +
            "fatigue non trova un beneficio statisticamente sicuro. Una sintesi precedente, del 2017, trova invece un beneficio medio per fatigue, resistenza, umore e " +
            "funzione. Entrambe leggono quasi gli stessi studi e arrivano a conclusioni diverse, perché fanno i conti " +
            "in modo differente. Delle due, la più recente è la più prudente, e questo va detto.",
          "Quello che se ne può portare via senza esagerare: il movimento <b>con malattia stabile è sicuro</b>, " +
            "migliora la resistenza in modo affidabile e alla fatigue fa probabilmente un po' di bene. È più di " +
            "quanto sia stato mostrato per qualsiasi altra misura non farmacologica nel lupus.",
          "La società scientifica europea raccomanda espressamente, nelle malattie reumatiche infiammatorie, di " +
            "rilevare la fatigue e di proporre attività di movimento adattate.",
        ],
        staerke: "Da bassa a media. Sintesi contraddittorie, studi piccoli e per lo più non in cieco. Più chiara per la resistenza che per la fatigue.",
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
    kicker: "La domanda più frequente",
    titel: "Sport, anche in riacutizzazione?",
    abschnitte: [
      {
        frage: "Posso fare sport durante una riacutizzazione attiva?",
        antwort: [
          "Qui la precisione conta più di una risposta a effetto, perciò prima i fatti: <b>su questo non " +
            "esiste alcuno studio.</b> Praticamente tutti gli studi sul movimento nel lupus hanno incluso " +
            "persone con attività di malattia tranquilla o bassa e hanno escluso espressamente la malattia " +
            "attiva. L'affermazione rassicurante \"il movimento non peggiora il lupus\" è un'affermazione " +
            "sulle fasi stabili. A una riacutizzazione acuta non si può trasferire.",
          "Quello che c'è è una raccomandazione di consenso internazionale del 2024. In sostanza dice: durante " +
            "una riacutizzazione serve <b>prudenza</b> e va verificato di nuovo se al momento qualcosa la " +
            "sconsiglia. In una riacutizzazione con articolazioni infiammate, proprio quelle articolazioni non " +
            "vanno caricate. Chi ha malattia tranquilla o lieve si attiene alle raccomandazioni generali sul movimento.",
          "Tradotto nella vita di tutti i giorni non vuol dire \"letto\", e non vuol dire \"tirare dritto\". " +
            "Vuol dire: nella riacutizzazione farsi più piccoli invece di smettere. Camminare invece di fare " +
            "intervalli, allungamento e movimento leggero invece di pesi, lasciare fuori le articolazioni " +
            "infiammate. E: una nuova riacutizzazione va segnalata prima di adattare il programma di " +
            "allenamento, non dopo.",
          "Una limitazione che sta nella stessa raccomandazione e che si dimentica facilmente: con " +
            "interessamento di cuore, polmoni o reni, in corso di terapia anticoagulante o in caso di necrosi " +
            "ossea, il carico va chiarito con il medico prima di aumentarlo.",
        ],
        staerke: "Per la riacutizzazione: solo consenso di esperti, nessuno studio. Per le fasi stabili: media.",
        quellen: [
          "Blaess J et al., RMD Open 2024;10:e004171. DOI 10.1136/rmdopen-2024-004171",
          "Parodis I et al., EULAR, trattamento non farmacologico, Ann Rheum Dis 2024;83:720-729. PMID 37433575",
        ],
      },
      {
        frage: "Come si comincia, se già salire le scale è faticoso?",
        antwort: [
          "Con una quantità che sembra troppo piccola, e con cui si arriva in fondo anche nel giorno brutto. " +
            "Non è modestia, è il metodo: il motivo più frequente per cui il movimento fallisce quando c'è " +
            "spossatezza è un giorno buono in cui si fa troppo, seguito da tre giorni a letto.",
          "Negli studi che hanno mostrato qualcosa, i programmi duravano per lo più <b>da otto a dodici " +
            "settimane</b>, erano di intensità media e seguiti. Seguiti qui vuol dire: c'è qualcuno che tiene d'occhio come va. " +
            "Nelle analisi questa era una delle differenze fra i programmi che funzionavano e quelli che no.",
          "Un inizio utilizzabile: una quantità piccola e fissa ogni giorno, la stessa nei giorni buoni e in " +
            "quelli brutti, e solo dopo una o due settimane senza strascichi un pochino di più. Nell'andamento " +
            "di questa app, dopo qualche settimana, si vede se la fatigue sale il giorno dopo una seduta.",
        ],
        staerke: "Media per la durata e l'intensità dei programmi. Il modo di procedere in sé è pratica, non risultato di studi.",
      },
      {
        frage: "E il pacing, cioè distribuire le forze?",
        antwort: [
          "Pacing vuol dire distribuire le forze nell'arco della giornata e fare pause programmate " +
            "<b>prima</b> che non si riesca più, invece di andare avanti fino al crollo.",
          "Onestamente: per il lupus su questo ci sono pochissimi studi, solo piccoli programmi educativi e uno " +
            "studio pilota in corso. I dati buoni sul pacing vengono da altre malattie, soprattutto ME/CFS e " +
            "long covid, e anche lì sono contrastanti. Se la fatigue del lupus si comporti come quella non è chiarito.",
          "Sta qui lo stesso, perché costa poco, non è pericoloso ed è reversibile. Provarlo due settimane e " +
            "guardare nell'andamento se i giorni brutti diventano meno non costa nulla.",
        ],
        staerke: "Nel lupus debole. Trasferimento da altre malattie, dove i risultati sono contrastanti.",
      },
    ],
  },

  {
    kicker: "Alimentazione",
    titel: "Che cosa nel lupus è davvero documentato",
    abschnitte: [
      {
        frage: "Esiste una dieta per il lupus?",
        antwort: [
          "No. Non esiste una forma di alimentazione per cui sia stato mostrato che tratta il lupus o " +
            "sostituisce i farmaci. Chi lo sostiene sta vendendo qualcosa.",
          "Quello che esiste sono modelli. Il più studiato è quello <b>mediterraneo</b>: molta verdura, frutta, " +
            "legumi, olio d'oliva, pesce, frutta secca a guscio, poca carne rossa e poca carne lavorata. Negli " +
            "studi trasversali sul lupus si accompagna a una minore attività di malattia e a valori cardiaci migliori.",
          "La parola trasversale è importante: si guarda in un unico momento chi mangia come e come sta. Se sia " +
            "il cibo a fare la differenza, oppure se alle persone con malattia più tranquilla riesca più facile " +
            "mangiare così, uno studio di questo tipo non lo può distinguere. Uno studio di intervento concluso, " +
            "con l'attività di malattia come obiettivo, nel lupus non esiste.",
          "C'è comunque un buon motivo per andare proprio in quella direzione: il <b>rischio cardiovascolare</b> " +
            "nelle donne giovani con lupus è nettamente aumentato, e per questo obiettivo il modello mediterraneo " +
            "è documentato come poche altre cose in nutrizione clinica.",
        ],
        staerke: "Per l'attività del lupus: debole, solo osservazionale. Per cuore e vasi: buona, ma proveniente dalla popolazione generale.",
      },
      {
        frage: "Omega-3, vitamina D, curcuma e il resto",
        antwort: [
          "Gli <b>omega-3</b> da pesce o da olio nel lupus sono stati studiati in diversi piccoli studi " +
            "controllati, con indizi di un'attività di malattia un po' minore e di una migliore funzione dei " +
            "vasi. Gli studi sono piccoli e non uniformi. Pesce grasso due volte a settimana è una realizzazione " +
            "ragionevole, che non può rovinare nulla.",
          "La <b>vitamina D</b> nel lupus è spesso bassa, perché il sole si evita e gli steroidi aumentano la " +
            "perdita; nella celiachia si aggiunge il peggiore assorbimento. Che una carenza vada corretta non è " +
            "in discussione. Che la correzione migliori la fatigue lo è: gli studi di trattamento su questo, " +
            "messi insieme, comprendono in tutto solo poche decine di partecipanti. Quindi: misurare, correggere " +
            "se c'è carenza, non appenderci grandi speranze.",
          "<b>Curcuma, resveratrolo, NAC, DHEA</b> nel lupus sono stati studiati, in studi piccoli con risultati " +
            "non uniformi. Nulla di tutto questo è consolidato.",
          "Più importante di ogni singolo prodotto: tutto ciò che si ingoia va sulla lista dei farmaci e va " +
            "portato alla visita. Gli integratori non sono una zona franca, hanno interazioni.",
        ],
        staerke: "Omega-3: da debole a media, studi piccoli. Vitamina D contro la fatigue: molto debole. Restanti prodotti: debole.",
      },
      {
        frage: "E la storia dei germogli di alfalfa?",
        antwort: [
          "L'alfalfa, cioè l'erba medica, contiene L-canavanina. Su questo esistono vecchie descrizioni di casi " +
            "con quadri simili al lupus ed esperimenti su scimmie. È quell'unico punto che da decenni sta su " +
            "ogni lista per il lupus.",
          "Inquadrato onestamente: è una catena di prove fragile e vecchia, non una dimostrazione. Rinunciare ai " +
            "germogli di alfalfa però non costa nulla, perciò sta anche qui. Su tutto il resto conviene lo " +
            "scetticismo: molte liste di divieti in rete non sono nate da questa domanda, ma per copiatura.",
          "Un punto con una motivazione migliore: <b>i prodotti che dichiarano espressamente di stimolare il " +
            "sistema immunitario</b>, per esempio l'echinacea. In una malattia in cui il sistema immunitario si " +
            "rivolge contro il proprio corpo, è la direzione sbagliata. Anche qui la catena di prove è fragile, " +
            "ma il ragionamento tiene.",
        ],
        staerke: "Debole. Descrizioni di casi ed esperimenti sugli animali. Sostenibile come misura di prudenza, non come fatto.",
      },
    ],
  },

  {
    kicker: "Celiachia",
    titel: "Che cosa deve essere rigoroso e che cosa no",
    abschnitte: [
      {
        frage: "Quanto rigoroso è rigoroso?",
        antwort: [
          "Nella celiachia l'alimentazione senza glutine è la terapia, per tutta la vita, e l'obiettivo non è " +
            "solo l'assenza di disturbi, è la guarigione della mucosa intestinale. I disturbi sono una misura " +
            "scadente: una parte delle persone non ne ha, pur avendo il danno.",
          "Il limite di 20 milligrammi di glutine per chilogrammo per la dicitura senza glutine si basa sul " +
            "fatto che fino a circa 10 milligrammi di glutine al giorno dovrebbero essere innocui per la grande " +
            "maggioranza. La base di dati, a detta degli stessi organismi tecnici, è limitata, e su quale sia " +
            "la soglia giusta si continua a discutere.",
          "Notevole e poco noto: le misurazioni su persone convinte di mangiare rigorosamente senza glutine " +
            "trovano regolarmente un apporto involontario di glutine nettamente maggiore di quanto questa soglia " +
            "preveda. Non è un rimprovero a nessuno, è un'indicazione su dove bisogna cercare quando le cose non migliorano.",
        ],
        staerke: "Alta per la terapia in sé. Da debole a media per la soglia esatta.",
        quellen: [
          "Linea guida ACG, Am J Gastroenterol 2023. PMID 36602836",
          "Ludvigsson JF et al., BSG, Gut 2014;63:1210-1228. PMID 24917550",
          "ESsCD 2025, United European Gastroenterol J. PMID 40999951 e PMID 41831197",
        ],
      },
      {
        frage: "Che cosa in cucina conta davvero, e che cosa viene sopravvalutato?",
        antwort: [
          "Qui la ricerca ha dato un risultato sorprendente, e rende la vita di tutti i giorni più leggera. È " +
            "stato misurato quanto glutine passa davvero con i gesti abituali in cucina.",
          "<b>Più importante di quanto si pensasse:</b> l'olio di frittura in comune e l'acqua di cottura in " +
            "comune. Nelle patatine fritte in una friggitrice in cui si friggono anche prodotti impanati, una parte " +
            "dei campioni stava nettamente sopra il limite. Lo stesso per l'acqua in cui era stata " +
            "cotta prima della pasta con glutine; sciacquare brevemente la pasta cotta riportava i valori sotto il limite.",
          "<b>Meno grave di quanto si temeva:</b> il tostapane in comune e le posate in comune. Nelle " +
            "misurazioni il pane senza glutine uscito da un tostapane già usato restava sotto il limite, anche " +
            "con briciole visibili nel vano, e un coltello che era stato prima su un prodotto da forno con " +
            "glutine non trasferiva nulla di misurabile.",
          "Questi studi sono piccoli e non in cieco, quindi non sono un lasciapassare. Ma la direzione è " +
            "utilizzabile: l'energia va alla friggitrice, all'acqua di cottura, alla polvere di farina quando si " +
            "impasta e alle liste degli ingredienti, e meno alla paura di ogni cucchiaio in comune. In una " +
            "malattia autoimmune anche questo è un argomento: la forza che non finisce in preoccupazioni inutili " +
            "resta disponibile altrove.",
        ],
        staerke: "Da debole a media. Studi di misura piccoli e non in cieco, ma sono gli unici numeri che esistono su questo.",
        quellen: [
          "Weisbrod VM et al., Gastroenterology 2020",
          "Gluten-Free Foods Cooked in Shared Fryers With Wheat, Front Nutr 2021. DOI 10.3389/fnut.2021.652039",
          "Syage JA et al., Am J Clin Nutr 2018",
        ],
      },
      {
        frage: "Basta il valore del tTG per sapere se va tutto bene?",
        antwort: [
          "No, ed è uno dei dettagli più importanti di tutto questo testo. Il valore del tTG è stato sviluppato " +
            "come <b>test di screening</b>, non come test di controllo della guarigione della mucosa.",
          "In una sintesi di più studi, con alimentazione senza glutine un valore di tTG normale riconosceva " +
            "solo circa la metà dei casi in cui la mucosa era ancora danneggiata. Un valore nella norma è quindi " +
            "una buona notizia, ma non una dimostrazione.",
          "In pratica vuol dire: se i disturbi restano o se valori come ferro e vitamina D non risalgono, " +
            "\"il tTG è normale\" non è un motivo per chiudere la ricerca. Allora ci vuole un'anamnesi " +
            "alimentare accurata con una professionista della nutrizione esperta, e secondo il caso altri accertamenti.",
          "La causa più frequente, quando con l'alimentazione senza glutine non si migliora, non è del resto una " +
            "complicanza rara, è glutine assunto senza accorgersene.",
        ],
        staerke: "Da media ad alta per il limitato valore informativo della sierologia. Da una sintesi di più studi.",
        quellen: [
          "Meta-analisi su tTG e anticorpi anti-endomisio nell'atrofia dei villi persistente, Gastroenterology 2017",
          "Linee guida sul follow-up, Nat Rev Gastroenterol Hepatol 2023. PMID 38110546",
        ],
      },
      {
        frage: "Avena, sì o no?",
        antwort: [
          "Una sintesi degli studi non ha trovato indizi che l'avena dichiarata senza glutine peggiori i " +
            "disturbi, il tessuto, la reazione immunitaria o la sierologia. La certezza dei risultati era però bassa.",
          "Il problema principale non è l'avena, è la lavorazione: l'avena comune è spesso molto contaminata da " +
            "frumento, quella pura invece praticamente no. Perciò vale: solo avena etichettata come senza glutine.",
          "A questo si aggiunge una piccola minoranza che reagisce alla proteina dell'avena stessa. Quanto sia " +
            "grande questo gruppo non è stabilito con precisione; il numero spesso citato viene da uno studio in " +
            "cui si erano presentate proprio persone con sospetta intolleranza all'avena, ed è quindi troppo " +
            "alto per la generalità.",
          "Procedere con la testa: introdurre l'avena senza glutine quando il periodo è tranquillo, non insieme " +
            "ad altri cambiamenti, e guardare nel diario che cosa succede.",
        ],
        staerke: "Media per la sicurezza dell'avena pura, la certezza dei risultati della sintesi era bassa.",
        quellen: ["Pinto-Sanchez MI et al., Gastroenterology 2017;153:395-409. PMID 28431885"],
      },
      {
        frage: "Il senza glutine servirebbe a qualcosa contro il lupus, se non si avesse affatto la celiachia?",
        antwort: [
          "Per questo non ci sono prove solide. È citato qui solo per completezza, perché nei forum la domanda " +
            "salta fuori di continuo.",
          "In questo caso è comunque priva di oggetto: con una celiachia accertata si mangia senza glutine, " +
            "indipendentemente da quello che questo fa per il lupus.",
        ],
        staerke: "Nessuna prova solida.",
      },
    ],
  },

  {
    kicker: "Le due insieme",
    titel: "Dove lupus e celiachia si intralciano",
    abschnitte: [
      {
        frage: "Le due cose sono davvero collegate?",
        antwort: [
          "Le malattie autoimmuni compaiono spesso insieme, e nel lupus la celiachia si trova più spesso che " +
            "nella popolazione generale. Su quanto più spesso, le stime pubblicate divergono molto, e perciò " +
            "qui, di proposito, non c'è nessun numero.",
          "Per la vita di tutti i giorni il numero non è nemmeno importante. Importante è che entrambe le " +
            "malattie attaccano le stesse cose: l'assorbimento dei nutrienti, l'osso e la forza.",
        ],
        staerke: "Le stime si contraddicono nettamente. Il legame in sé è consolidato.",
      },
      {
        frage: "L'osso, a 26 anni",
        antwort: [
          "È il punto che a questa età sfugge più facilmente e che si fa sentire più tardi di ogni altro. Due cose si " +
            "sommano: la celiachia disturba per anni l'assorbimento di calcio e vitamina D, e il cortisone " +
            "agisce direttamente contro l'osso.",
          "La linea guida americana sull'osteoporosi da cortisone dice una cosa che conta proprio per le donne " +
            "giovani: sotto i 40 anni il rischio di frattura con il calcolatore abituale <b>non</b> si può " +
            "stimare, perché quello non è fatto per questo. Al posto di un calcolo serve quindi una misurazione.",
          "Quello che in ogni caso ci vuole: calcio e vitamina D a sufficienza, movimento con il peso sulle " +
            "gambe, non fumare. E la domanda se e quando una densitometria ossea abbia senso va posta, non attesa.",
        ],
        staerke: "Basata su linee guida.",
        quellen: ["Humphrey MB et al., linea guida ACR sull'osteoporosi indotta da glucocorticoidi 2022. DOI 10.1002/art.42646"],
      },
      {
        frage: "E se la fatigue resta nonostante un'alimentazione senza glutine rigorosa?",
        antwort: [
          "Succede ed è ben descritto. L'ordine in cui si cerca è di solito questo:",
        ],
        liste: [
          "Apporto nascosto di glutine. Di gran lunga la spiegazione più frequente, e la si individua meglio insieme a una professionista della nutrizione esperta, non da sola.",
          "Nutrienti: ferro, B12, acido folico, vitamina D, zinco.",
          "Tiroide.",
          "La seconda malattia, cioè il lupus stesso, con reni ed emocromo.",
          "Sonno, umore, dolore, fibromialgia.",
          "Solo dopo le cose rare.",
        ],
        staerke: "Pratica clinica e logica delle linee guida.",
      },
    ],
  },

  {
    kicker: "Terapia",
    titel: "Che cosa oggi è lo standard",
    abschnitte: [
      {
        frage: "A che cosa si orienta oggi la terapia?",
        antwort: [
          "A due principi, che stanno nelle raccomandazioni europee attuali. Primo: " +
            "<b>idrossiclorochina per tutti</b>, se nulla la sconsiglia. Secondo: <b>cortisone il più basso " +
            "possibile</b>, pensato come ponte e non come soluzione permanente, con l'obiettivo di tenerlo " +
            "molto basso nel mantenimento o di sospenderlo del tutto.",
          "È il motivo per cui oggi si aggiungono prima altri farmaci: non perché la malattia sia peggiore, ma " +
            "perché il cortisone possa scendere. Per questo oggi ci sono più possibilità che pochi anni fa, " +
            "anche farmaci approvati di recente.",
          "L'obiettivo dichiarato della terapia è la remissione o uno stato di bassa attività. Entrambi sono " +
            "definiti e misurabili. Vale la pena chiederlo: trasforma il \"come sta\" in una grandezza che resta " +
            "confrontabile negli anni.",
          "<b>Nessuna dose da questa app.</b> Quello che c'è qui è la cornice dentro cui decide la visita.",
        ],
        staerke: "Linee guida, il livello più alto disponibile.",
        quellen: [
          "Fanouriakis A et al., EULAR 2023, Ann Rheum Dis 2024;83:15-29. PMID 37827694",
          "Linea guida ACR sul trattamento del LES 2025. PMID 41182321",
          "EULAR 2025, lupus con interessamento renale. PMID 41107121",
        ],
      },
      {
        frage: "Perché il controllo degli occhi con l'idrossiclorochina?",
        antwort: [
          "Perché in casi rari il farmaco può danneggiare la retina, e perché questo danno a lungo non dà " +
            "disturbi. Per questo lo si cerca invece di aspettarlo.",
          "Il rischio dipende soprattutto dalla dose in rapporto al peso corporeo e dalla durata della terapia; " +
            "una funzione renale ridotta e certi altri farmaci lo aumentano. Per questo c'è un limite massimo " +
            "riferito al peso corporeo <b>reale</b>.",
          "Come si svolge: un esame all'inizio, poi controlli regolari con metodiche che danno immagini della " +
            "retina. Gli intervalli esatti sono diversi da paese a paese e sono stati rivisti di recente. La " +
            "domanda pratica da fare in visita non è quindi \"ogni quanto si fa di solito\", ma \"quando scade " +
            "il mio prossimo\".",
          "Buono da sapere: se un danno iniziale viene trovato presto e il farmaco viene sospeso, di solito non " +
            "avanza oltre. Proprio per questo il controllo non è un rituale, è tutto il punto.",
        ],
        staerke: "Linee guida di oculistica. Gli intervalli esatti sono diversi a seconda del paese e della versione.",
        quellen: [
          "AAO, raccomandazioni sullo screening della retinopatia da idrossiclorochina, Ophthalmology. PMID 41232611",
          "Royal College of Ophthalmologists, Monitoring-Empfehlungen 2020. PMID 33423043",
        ],
      },
      {
        frage: "Perché le urine ogni volta?",
        antwort: [
          "Perché nel lupus l'interessamento renale è il danno d'organo che costa di più e che resta muto più a " +
            "lungo. Non fa male. Si mostra come proteine nelle urine, molto prima che si senta qualcosa.",
          "Per questo la linea guida americana sulla nefrite lupica dà una raccomandazione forte a cercare " +
            "regolarmente le proteine nelle urine anche nelle persone <b>senza</b> un interessamento renale noto.",
          "Se da tutto questo capitolo si porta via una cosa sola, sia questa: l'esame delle urine è il test più " +
            "economico e più efficace di tutta l'assistenza. Non va dimenticato quando si sta bene.",
        ],
        staerke: "Raccomandazione forte da linee guida.",
        quellen: ["Linea guida ACR sulla nefrite lupica 2024. DOI 10.1002/art.43212"],
      },
    ],
  },

  {
    kicker: "A 26 anni",
    titel: "Che cosa va considerato a questa età",
    abschnitte: [
      {
        frage: "Il desiderio di un figlio, anche se non è attuale",
        antwort: [
          "Questo tema va affrontato presto, proprio quando non è ancora all'ordine del giorno. Il motivo è " +
            "semplice: alcuni farmaci usati nel lupus non si possono prendere in gravidanza e vanno cambiati " +
            "<b>mesi prima</b>. Una gravidanza non programmata sotto un farmaco di questo tipo è lo scenario " +
            "che tutti vogliono evitare.",
          "Il secondo motivo: nel lupus una gravidanza va nettamente meglio se comincia in una fase tranquilla. " +
            "È una delle poche cose che si possono davvero pianificare.",
          "Due esami del sangue sono decisivi e dovrebbero essere noti, indipendentemente da ogni programma: " +
            "<b>anti-Ro/SSA</b> e gli <b>anticorpi antifosfolipidi</b>, lupus anticoagulant compreso. " +
            "Cambiano l'assistenza e la scelta della contraccezione. Chi non conosce il proprio stato dovrebbe chiederlo.",
          "L'idrossiclorochina in gravidanza di regola si continua, non si sospende. Questo sorprende molte persone.",
        ],
        staerke: "Linee guida.",
        quellen: [
          "Sammaritano LR et al., linea guida ACR sulla salute riproduttiva 2020, Arthritis Rheumatol 2020;72:529-556. PMID 32090466",
          "Andreoli L et al., EULAR, salute della donna nel LES e nella APS, Ann Rheum Dis 2017;76:476-485",
        ],
      },
      {
        frage: "Contraccezione",
        antwort: [
          "Il punto decisivo: in presenza di <b>anticorpi antifosfolipidi</b> documentati si sconsiglia la " +
            "contraccezione con estrogeni, perché l'estrogeno aumenta il rischio di trombosi e qui questo " +
            "rischio è già aumentato di suo. Si consigliano invece la spirale o preparati con solo progestinico.",
          "Poiché allo stesso tempo una contraccezione affidabile è importante finché sono in gioco farmaci che " +
            "in gravidanza farebbero danno, questa non è una questione secondaria.",
        ],
        staerke: "Raccomandazione forte da linee guida.",
        quellen: ["Sammaritano LR et al., ACR 2020. PMID 32090466"],
      },
      {
        frage: "Vaccinazioni e infezioni",
        antwort: [
          "Sotto immunosoppressione vale: i <b>vaccini inattivati</b> sono possibili e sono espressamente " +
            "raccomandati, i <b>vaccini vivi</b> vanno evitati per quanto possibile. Meglio verificare e " +
            "completare lo stato vaccinale prima che cominci una terapia immunosoppressiva, e in una fase tranquilla.",
          "La seconda parte è più pratica: <b>la febbre sotto immunosoppressione non è una cosa su cui aspettare.</b> " +
            "La solita reazione di difesa può mancare, e dal solo emocromo un'infezione non sempre si distingue " +
            "da una riacutizzazione. È esattamente la situazione per cui si vuole avere prima un piano e un " +
            "numero di telefono.",
        ],
        staerke: "Linee guida.",
        quellen: [
          "Furer V et al., EULAR-Impfempfehlungen 2019, Ann Rheum Dis 2020;79:39-52. PMID 31413005",
          "Bass AR et al., ACR-Impfleitlinie 2022. PMID 36597813",
        ],
      },
      {
        frage: "Sole e fumo",
        antwort: [
          "Sul <b>sole</b> c'è qualcosa di concreto: in uno studio controllato, in cui la pelle è stata " +
            "irradiata di proposito con raggi UV, nelle aree non trattate sono comparse le tipiche alterazioni " +
            "cutanee del lupus, mentre nelle aree trattate con una protezione alta ad ampio spettro non sono " +
            "comparse in nessuna partecipante. Per questa domanda è uno studio insolitamente chiaro.",
          "Importante: è stata mostrata la prevenzione delle <b>alterazioni cutanee</b> da UV, non la " +
            "prevenzione delle riacutizzazioni in generale. E la protezione deve coprire UVA e UVB.",
          "Sul <b>fumo</b>: fumare si associa a un rischio più alto di ammalarsi, e peggiora in modo misurabile " +
            "l'efficacia dell'idrossiclorochina sulla pelle. Un dettaglio che dà coraggio: nell'analisi le " +
            "<b>ex</b> fumatrici non avevano più un rischio aumentato. Smettere quindi funziona.",
        ],
        staerke: "Per la protezione solare: buona, studio controllato sull'uomo. Per il fumo: sintesi di più studi.",
        quellen: [
          "Kuhn A et al., J Am Acad Dermatol 2011;64:37-48. PMID 21167404",
          "Revisione sistematica e meta-analisi sul fumo nel LES, Autoimmun Rev 2019. PMID 31520802",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------- Sorveglianza */

window.INHALT.it.ueberwachung = [
  {
    titel: "Occhi, in corso di idrossiclorochina",
    text: [
      "Un esame all'inizio della terapia e poi controlli regolari con metodiche che danno immagini della " +
        "retina. Gli intervalli sono diversi a seconda del paese e del profilo di rischio; la dose riferita al " +
        "peso corporeo reale, la durata della terapia e la funzione renale hanno qui il ruolo principale.",
      "Trovato presto, dopo la sospensione un danno di solito non avanza oltre. È questo il motivo dei controlli.",
    ],
    quellen: ["AAO, Ophthalmology. PMID 41232611", "Royal College of Ophthalmologists 2020. PMID 33423043"],
  },
  {
    titel: "Sangue e urine",
    text: [
      "Emocromo, valori renali, valori epatici e, secondo il farmaco, altri valori, a intervalli che seguono " +
        "l'attività e il farmaco: più stretti all'inizio e dopo ogni cambio di dose, più larghi nelle fasi tranquille.",
      "In più i valori specifici del lupus, anti-dsDNA e complemento C3 e C4, e in ogni caso le urine per le proteine.",
      "Gli intervalli appartengono alla visita, non a un'app. Quello che qui aiuta: la domanda su chi li " +
        "prescrive, così non resta niente in mezzo fra il medico di famiglia e l'ambulatorio ospedaliero.",
    ],
  },
  {
    titel: "Prima di iniziare certi farmaci",
    text: [
      "Prima dell'azatioprina si determina un enzima che governa la degradazione. Se manca o è ridotto e non lo si sa, " +
        "si rischiano gravi alterazioni dell'emocromo. Chiederlo è legittimo.",
      "Prima di una terapia immunosoppressiva lo stato vaccinale va verificato, perché dopo alcune cose non si possono più fare.",
    ],
  },
  {
    titel: "Celiachia nel tempo",
    text: [
      "tTG-IgA nel tempo, con i nutrienti, e una consulenza nutrizionale con esperienza nella celiachia. " +
        "Quest'ultima non è un'aggiunta: nelle linee guida il contatto con una professionista è parte integrante della terapia.",
      "Un valore di tTG normale non esclude una mucosa non ancora guarita. Se restano disturbi o carenze, si continua a cercare.",
    ],
  },
  {
    titel: "Osso",
    text: [
      "Con una terapia cortisonica prolungata e con la celiachia l'osso va tenuto d'occhio. Sotto i 40 anni il " +
        "rischio con il calcolatore abituale non si può stimare, perciò si misura invece di calcolare.",
      "Calcio e vitamina D a sufficienza, movimento con il peso sulle gambe, non fumare.",
    ],
    quellen: ["Linea guida ACR sull'osteoporosi indotta da glucocorticoidi 2022. DOI 10.1002/art.42646"],
  },
];


/* ------------------------------------------------------------------ Ricerca */

window.INHALT.it.suche = {
  warnung:
    "Questa raccolta è nata a memoria. Dall'ambiente in cui è stata costruita non era raggiungibile nemmeno un sito specialistico e nemmeno un'organizzazione di pazienti, è stato verificato ed è così. Quindi non si è potuto controllare nulla. Per questo qui, di proposito, non c'è nessun indirizzo, nessun numero di telefono e nessun nome di una clinica o di un medico: a questo livello un errore sarebbe pericoloso, e un numero sbagliato, composto da qualcuno durante una riacutizzazione, fa un danno vero. Quello che c'è qui sono tipi di enti, i loro nomi e le parole con cui cercarli. I nomi possono essere cambiati, le organizzazioni possono essersi fuse o essere state rinominate, un registro può non esistere più. Per questo ogni voce porta un grado di sicurezza. L'app non ne verifica nessuno, non può farlo, non ha alcun collegamento verso l'esterno. Prima di affidarsi a un ente, va fatto confermare una volta: dal medico di famiglia, dall'ambulatorio ospedaliero o da un gruppo di auto mutuo aiuto.",

  laender: [
    { wert: "at", text: "Austria" },
    { wert: "de", text: "Germania" },
    { wert: "ch", text: "Svizzera" },
    { wert: "it", text: "Italia" },
    { wert: "eu", text: "Europa" },
  ],

  wege: [
    {
      land: "at",
      thema: "beides",
      name: "L'impegnativa dal medico di famiglia",
      was: "L'accesso all'ambulatorio ospedaliero, e una valutazione su quale ospedale del distretto sia davvero raggiungibile.",
      weg: "In Austria la maggior parte degli ambulatori ospedalieri chiede un'impegnativa di un medico convenzionato, e di solito anche un appuntamento fissato. Nello studio di' che cerchi un ambulatorio con esperienza nel lupus eritematoso sistemico, non solo un ambulatorio reumatologico. Nomina subito anche la seconda diagnosi, cambia la scelta.",
      suchbegriff: "impegnativa ambulatorio reumatologico",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "L'ambulatorio in cui sei già",
      was: "La strada più breve, e un nome da parte di qualcuno che lì chiede di persona.",
      weg: "Al prossimo appuntamento chiedi chi conosce lupus e celiachia insieme e se abbia senso una visita in un centro specializzato. Chiedere un secondo parere è permesso ed è usuale, non è una mozione di sfiducia. Se ti sembra delicato, formulalo come domanda su una presa in carico condivisa.",
      suchbegriff: "chiedere secondo parere presa in carico condivisa",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "La ricerca medici dell'ordine dei medici austriaco",
      was: "Il registro ufficiale di tutti i medici con la loro specialità, filtrabile per località.",
      weg: "Passa da un motore di ricerca cercando Ärztekammer e Arztsuche, ce n'è una federale e una per ogni camera regionale. Importante nel lupus: in Austria la reumatologia è stata a lungo un'aggiunta alla medicina interna ed è diventata un titolo di specialista a sé solo più tardi. I colleghi più anziani portano l'aggiunta, i più giovani il titolo. Cerca entrambi.",
      suchbegriff: "Ärztekammer Arztsuche Innere Medizin Rheumatologie",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "La ricerca dei convenzionati della cassa malattia",
      was: "Chi ha una convenzione con la cassa e chi no.",
      weg: "Sul sito della Österreichische Gesundheitskasse guarda la ricerca dei medici o dei convenzionati. La differenza sono i soldi: da un medico non convenzionato paghi prima tu e più tardi ti torna indietro una parte. Con attese lunghe a volte è la via più rapida, ma il rimborso conviene chiederlo prima.",
      suchbegriff: "Österreichische Gesundheitskasse Arztsuche",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "lupus",
      name: "Österreichische Gesellschaft für Rheumatologie und Rehabilitation",
      was: "La società scientifica, con elenco dei soci e una panoramica delle strutture reumatologiche.",
      weg: "Cerca la società, poi guarda soci, centri o ambulatori. Chi è attivo in una società scientifica lavora di solito in un posto con abbastanza casi.",
      suchbegriff: "Österreichische Gesellschaft für Rheumatologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "lupus",
      name: "Österreichische Rheumaliga",
      was: "Auto mutuo aiuto con gruppi regionali, e la conoscenza di dove una persona è in buone mani.",
      weg: "Cerca la Rheumaliga e il tuo Land. Lì chiedi quale ambulatorio segue persone con lupus, dove l'attesa è sopportabile e dove ti ascoltano. Questa informazione non si ottiene da nessun registro.",
      suchbegriff: "Rheumaliga Österreich Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "L'associazione austriaca per la celiachia",
      was: "Consulenza, liste di prodotti, gruppi, spesso anche indicazioni su ambulatori e su dietiste con esperienza.",
      weg: "Cerca celiachia e Austria. Se il nome non è quello giusto, passa dalla federazione europea delle associazioni per la celiachia, che elenca i suoi membri paese per paese. La seconda via funziona anche quando l'organizzazione si chiama diversamente da come la si ricordava.",
      suchbegriff: "Zöliakie Österreich Arbeitsgemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Österreichische Gesellschaft für Gastroenterologie und Hepatologie",
      was: "La società scientifica per l'intestino, con soci ed eventi.",
      weg: "Cerca la società. Per la celiachia è competente la gastroenterologia, non la reumatologia. Chi cerca un ambulatorio cerca lì i soci nella propria località.",
      suchbegriff: "Österreichische Gesellschaft für Gastroenterologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "beides",
      name: "Il servizio di supporto all'auto mutuo aiuto nel Land",
      was: "Indirizzamento ai gruppi, anche con due diagnosi insieme.",
      weg: "In ogni Land austriaco c'è un servizio finanziato che raccoglie e indirizza i gruppi di auto mutuo aiuto. Cerca auto mutuo aiuto e il Land, scrivi lì e nomina entrambe le diagnosi. Se non c'è un gruppo adatto, questi servizi di solito conoscono comunque qualcuno.",
      suchbegriff: "Selbsthilfe Unterstützungsstelle Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "Il portale sanitario pubblico dello Stato",
      was: "Spiegazioni ufficiali su procedure, diritti e percorsi dentro il sistema.",
      weg: "Cerca il portale sanitario pubblico dell'Austria. Utile soprattutto per le questioni amministrative: impegnativa, rimborso delle spese, medico non convenzionato, diritti dei pazienti, vie di reclamo.",
      suchbegriff: "öffentliches Gesundheitsportal Österreich",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Dietista con esperienza nella celiachia",
      was: "L'accompagnamento nutrizionale che nella celiachia fa parte della terapia e non degli extra.",
      weg: "In Austria il titolo protetto è Diätologin, non consulente alimentare. Cerca tramite l'associazione professionale oppure chiedi in ambulatorio un'impegnativa. La domanda che conta è: quante persone con celiachia segue in un anno.",
      suchbegriff: "Diätologin finden Österreich Berufsverband",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Deutsche Gesellschaft für Rheumatologie und Klinische Immunologie",
      was: "La società scientifica e la rete dei centri reumatologici regionali.",
      weg: "Cerca la società scientifica e i centri reumatologici cooperativi regionali. Questi centri sono unioni di cliniche e studi medici di una regione, i loro elenchi sono un buon punto di partenza.",
      suchbegriff: "Deutsche Gesellschaft für Rheumatologie Rheumazentren",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Deutsche Rheuma-Liga",
      was: "La grande organizzazione di pazienti, con federazioni regionali ed elenchi di indirizzi.",
      weg: "Cerca la Rheuma-Liga e il Land. Tiene indirizzi di reumatologi e di cliniche, indirizza ai gruppi e pubblica schede informative ben leggibili. Le schede sono utilizzabili anche dall'Austria, gli indirizzi no.",
      suchbegriff: "Deutsche Rheuma-Liga Landesverband",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "L'auto mutuo aiuto per il lupus nell'area di lingua tedesca",
      was: "Una comunità propria solo per il lupus, con gruppi regionali e l'esperienza diretta sugli ambulatori.",
      weg: "Chiedi della comunità di auto mutuo aiuto per il lupus tramite la Rheuma-Liga, oppure cerca direttamente lupus e auto mutuo aiuto. Utilizzabile anche da Vienna: le esperienze su terapia, fatigue e uffici pubblici sono trasferibili, gli indirizzi no.",
      suchbegriff: "Lupus Erythematodes Selbsthilfegemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "zoeliakie",
      name: "Deutsche Zöliakie-Gesellschaft",
      was: "Consulenza, conoscenze verificate sui prodotti, gruppi, indicazioni su ambulatori esperti.",
      weg: "Cerca la Deutsche Zöliakie-Gesellschaft. Le conoscenze sui prodotti sono utilizzabili anche dall'Austria, perché molti produttori sono gli stessi. Per la ricerca di un ambulatorio vale questo: gli elenchi sono tedeschi.",
      suchbegriff: "Deutsche Zöliakie-Gesellschaft",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "La ricerca medici delle associazioni dei medici convenzionati",
      was: "Chi esercita dove e con quale titolo di specialista.",
      weg: "Cerca Arztsuche e Kassenärztliche Vereinigung, a livello federale o per un Land. Il servizio pazienti delle associazioni procura anche appuntamenti, quando è urgente.",
      suchbegriff: "Arztsuche Kassenärztliche Vereinigung",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "L'ente nazionale per l'auto mutuo aiuto",
      was: "Gruppi e punti di contatto regionali, anche per combinazioni rare.",
      weg: "Cerca il punto nazionale di contatto e informazione sull'auto mutuo aiuto. Chi ha due diagnosi chiede lì di entrambe e si fa indirizzare per entrambe.",
      suchbegriff: "NAKOS Selbsthilfe Datenbank",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Centri per le malattie rare presso le cliniche universitarie",
      was: "Un punto di orientamento per quadri poco chiari o composti.",
      weg: "Cerca Zentrum für Seltene Erkrankungen e una città universitaria, oppure un atlante dell'assistenza per le malattie rare. Questi centri accettano di solito solo con impegnativa e documentazione completa, e ci sono tempi di attesa.",
      suchbegriff: "Zentrum für Seltene Erkrankungen Versorgungsatlas",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "beides",
      name: "Il registro delle linee guida delle società scientifiche mediche",
      was: "Le linee guida sul lupus e sulla celiachia, cioè il metro con cui si può misurare un ambulatorio.",
      weg: "Cerca il registro delle linee guida dell'Arbeitsgemeinschaft der Wissenschaftlichen Medizinischen Fachgesellschaften, poi la malattia. È un registro, non una guida divulgativa, i testi sono scritti per specialisti. Il riassunto e le raccomandazioni all'inizio restano comunque leggibili, e per alcune linee guida esiste una versione per pazienti.",
      suchbegriff: "AWMF Leitlinienregister Zöliakie",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Rheumaliga Schweiz con le leghe cantonali",
      was: "Consulenza, corsi e indirizzi in Svizzera.",
      weg: "Cerca la Rheumaliga e il cantone. Le leghe cantonali sono i veri punti di riferimento.",
      suchbegriff: "Rheumaliga Schweiz",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Schweizerische Gesellschaft für Rheumatologie",
      was: "La società scientifica con il registro dei soci.",
      weg: "Cerca la società e nell'area soci filtra per località. In più il registro dei medici dell'organizzazione di categoria FMH, che tiene ufficialmente i titoli di specialista.",
      suchbegriff: "Schweizerische Gesellschaft für Rheumatologie Mitglieder",
      sicherheit: "mittel",
    },
    {
      land: "ch",
      thema: "zoeliakie",
      name: "L'associazione svizzera per la celiachia",
      was: "Consulenza e conoscenze sui prodotti per la Svizzera.",
      weg: "Cerca celiachia e Svizzera, oppure passa dalla federazione europea, che elenca l'associazione membro paese per paese.",
      suchbegriff: "Zöliakie Schweiz Interessengemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "zoeliakie",
      name: "Associazione Italiana Celiachia",
      was: "L'organizzazione italiana per la celiachia, con associazioni regionali e un marchio per i locali verificati senza glutine.",
      weg: "Cerca l'organizzazione. Per i viaggi in Italia la lista dei locali verificati è la cosa più utile che ci sia. In Alto Adige c'è un gruppo regionale di lingua tedesca.",
      suchbegriff: "Associazione Italiana Celiachia",
      sicherheit: "hoch",
    },
    {
      land: "it",
      thema: "beides",
      name: "La rete italiana per le malattie rare",
      was: "Presidi designati ufficialmente per ogni regione, dove avvengono diagnosi e presa in carico.",
      weg: "L'Italia ha una rete nazionale per le malattie rare. Le regioni designano i presidi, e al riconoscimento è legata l'esenzione dal ticket. Il lupus eritematoso sistemico è nell'elenco nazionale. Cerca in italiano la rete nazionale e la regione.",
      suchbegriff: "rete nazionale malattie rare presidi",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "beides",
      name: "L'Azienda sanitaria dell'Alto Adige",
      was: "L'unica via italiana senza barriera linguistica.",
      weg: "Il servizio sanitario pubblico in Alto Adige lavora in tedesco. Per un secondo parere o per domande sulla celiachia in Italia è l'ingresso più comodo. Prima di un appuntamento all'estero chiarisci sempre per prima cosa la questione dei costi, vedi il punto di contatto nazionale.",
      suchbegriff: "Südtiroler Sanitätsbetrieb Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La rete europea di riferimento per le malattie rare del tessuto connettivo",
      was: "Un elenco ufficiale di centri esperti, paese per paese, designati dagli Stati membri.",
      weg: "L'Unione europea mantiene reti di riferimento per le malattie rare. Per il lupus eritematoso sistemico è competente la rete per le malattie rare del tessuto connettivo e muscoloscheletriche. Cerca European Reference Network e connective tissue, poi filtra l'elenco dei membri per l'Austria. Chi sta lì dentro è stato verificato da un'autorità, non da una redazione.",
      suchbegriff: "European Reference Network connective tissue ReCONNET",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La rete europea di riferimento per le malattie immunitarie",
      was: "Una seconda rete, che copre le malattie autoimmuni e autoinfiammatorie.",
      weg: "Stessa via della voce precedente, cerca European Reference Network e immunodeficiency oppure autoimmune. Alcuni ospedali stanno in entrambe le reti, è un buon segno.",
      suchbegriff: "European Reference Network autoimmune RITA",
      sicherheit: "mittel",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Orphanet, il registro europeo delle malattie rare",
      was: "Centri esperti, organizzazioni di auto mutuo aiuto, registri e studi, filtrabili per paese e in italiano.",
      weg: "Cerca Orphanet, poi la malattia, poi fai attenzione alla scelta del paese. Per la celiachia il registro è competente solo per la rara forma resistente alla terapia, la celiachia comune è troppo frequente per starci.",
      suchbegriff: "Orphanet centri esperti lupus eritematoso",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "La federazione europea delle organizzazioni per il lupus",
      was: "La via verso l'organizzazione del proprio paese, anche quando non se ne conosce il nome.",
      weg: "Cerca la federazione europea e lì guarda le organizzazioni membro paese per paese. È la via più affidabile verso un gruppo austriaco per il lupus, perché una federazione tiene aggiornato l'elenco dei suoi membri.",
      suchbegriff: "Lupus Europe member organisations",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "zoeliakie",
      name: "La federazione europea delle associazioni per la celiachia",
      was: "L'associazione membro paese per paese, e il marchio della spiga barrata per i prodotti verificati senza glutine.",
      weg: "Cerca la federazione europea delle associazioni per la celiachia. Tramite essa si trova l'organizzazione austriaca e quelle dei paesi vicini, cosa che in viaggio conta.",
      suchbegriff: "Association of European Coeliac Societies",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "beides",
      name: "Il punto di contatto nazionale per l'assistenza sanitaria transfrontaliera",
      was: "Informazioni su quanto costa una cura in un altro paese dell'Unione europea, su che cosa paga la cassa e su che cosa va autorizzato prima.",
      weg: "Ogni Stato membro deve gestire un punto di questo tipo. Cerca punto di contatto nazionale e assistenza sanitaria transfrontaliera, più il proprio paese. Prima di ogni appuntamento programmato all'estero chiedi lì, altrimenti la fattura resta sulle tue spalle.",
      suchbegriff: "punto di contatto nazionale assistenza sanitaria transfrontaliera",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Il registro europeo degli studi clinici",
      was: "Quali cliniche a distanza raggiungibile lavorano a studi sul lupus.",
      weg: "Cerca il sistema informativo europeo per gli studi clinici, poi filtra per malattia e per paese. I centri coinvolti sono indicati. Questo non dice nulla sulla gentilezza di un ospedale, ma dice molto su dove si raccolgono abbastanza casi. La partecipazione è volontaria e non è mai una condizione per essere seguiti.",
      suchbegriff: "Clinical Trials Information System lupus Austria",
      sicherheit: "mittel",
    },
  ],

  merkmale: [
    { id: "ambulanz-sagen-viele", punkt: "L'ambulatorio sa dire quante persone con lupus eritematoso sistemico segue in un anno, senza doverci pensare a lungo." },
    { id: "feste-ansprechperson-wenigstens", punkt: "C'è una persona di riferimento fissa o almeno una piccola équipe, invece di un volto nuovo a ogni appuntamento." },
    { id: "krankheitsaktivitaet-messinstrument-erfasst", punkt: "L'attività di malattia viene rilevata con uno strumento di misura, e il valore sta nel referto, non solo nella testa." },
    { id: "benannten-schub-zwischen", punkt: "C'è una via dichiarata per la riacutizzazione fra un appuntamento e l'altro: un ambulatorio per le urgenze, un indirizzo di posta elettronica o un numero a cui qualcuno risponde." },
    { id: "nephrologie-dermatologie-augenheilkunde", punkt: "Nefrologia, dermatologia, oculistica e ostetricia sono nella stessa struttura o sono partner fissi, e l'ambulatorio sa spiegare come funziona il passaggio." },
    { id: "kinderwunsch-schwangerschaft-selbst", punkt: "Il desiderio di un figlio e la gravidanza vengono affrontati lì spontaneamente, non solo su richiesta." },
    { id: "zoeliakie-mitgedacht-entweder", punkt: "La celiachia viene tenuta presente: o c'è una gastroenterologia nella struttura, oppure l'ambulatorio sa esattamente chi la segue e scrive lì." },
    { id: "ernaehrungsfachkraft-zoeliakieerfahrung-erreichbar", punkt: "Una professionista della nutrizione con esperienza nella celiachia è raggiungibile, e l'invio è un gesto, non una trattativa." },
    { id: "jedem-termin-geht", punkt: "Dopo ogni appuntamento parte una lettera per il medico di famiglia, e una copia arriva anche a te, senza doverla conquistare." },
    { id: "klar-geregelt-welche", punkt: "È regolato chiaramente chi prescrive quale controllo, così non resta niente in mezzo fra l'ambulatorio e il medico di famiglia." },
    { id: "muedigkeit-lichtempfindlichkeit-teil", punkt: "La fatigue e la fotosensibilità vengono trattate come parte della malattia e non come una nota a margine." },
    { id: "haus-nimmt-register", punkt: "La struttura partecipa a un registro, a una rete di riferimento o a studi, un indizio che lì i casi vengono raccolti in modo sistematico." },
    { id: "termin-dauert-lang", punkt: "L'appuntamento dura abbastanza per parlare di due malattie, e alla fine il successivo è già fissato." },
    { id: "kommt-schlechten-ausgezeichnete", punkt: "Ci si arriva, anche in un giorno brutto: un ambulatorio eccellente a tre ore di distanza, in una riacutizzazione, diventa un ambulatorio pessimo." },
  ],

  erstgespraech: [
    "Il backup di questa app, e con esso la relazione per il medico su dodici settimane, stampata. I numeri su più settimane dicono più del ricordo di un giorno brutto.",
    "Tutti i referti in copia, ordinati per data: esami di laboratorio, lettere di dimissione, il referto della biopsia intestinale, vecchi valori di anticorpi. Gli originali li tieni tu.",
    "Una lista di tutti i farmaci con la dose, più integratori e contraccezione. Anche ciò che è stato sospeso, e perché è stato sospeso.",
    "La prima domanda: prende in carico l'assistenza continuativa, oppure questa è una valutazione una tantum. Da questo dipende tutto il resto.",
    "La domanda su chi scrive a chi: il medico di famiglia riceve una lettera, e ne ricevo una anch'io.",
    "La domanda su che cosa osservare e annotare fino alla volta successiva. Così il diario diventa mirato invece che soltanto diligente.",
    "La domanda su come si raggiunge l'ambulatorio se nel frattempo si peggiora, e su che cosa vale nel fine settimana.",
    "Scrivi prima tre cose che per te contano di più, e dille per prime. Il tempo è poco e altrimenti se ne va per altro.",
    "Porta qualcuno con te, quando la testa è nella nebbia. Due orecchie sentono di più, e non devi ascoltare e prendere appunti allo stesso tempo.",
    "Prendere appunti o registrare. Prima di registrare chiedi, la maggior parte dice di sì.",
    "Parla della celiachia di tua iniziativa, anche in un ambulatorio reumatologico. Altrimenti cade fra le specialità.",
    "E-card e impegnativa. Da un medico non convenzionato conserva la parcella e chiarisci prima quanto torna indietro.",
    "Metti l'appuntamento nella metà migliore della giornata e dopo non programmare altro. Un appuntamento costa più forze di quante ne stiano nel calendario.",
    "Se qualcosa resta poco chiaro, di' la frase: questo non l'ho capito, può dirlo in un altro modo. Non è una debolezza, è il senso dell'appuntamento.",
    "Subito dopo l'appuntamento una nota breve, finché è fresco. Con la nebbia in testa il ricordo del colloquio è peggiore di quanto si pensi.",
  ],
};

/* ------------------------------------------------------- Oberflaeche */
/*
 * Die Knopf- und Meldungstexte aus app.js. Schluessel ist der deutsche Satz,
 * siehe README unter Sprachen. Nicht von einer Muttersprachlerin geprueft.
 */
window.INHALT.it.ui = {
  "Alles, was du eintraegst, bleibt auf diesem Geraet. Es gibt keinen Server und kein Konto. Die Seite darf gar keine Verbindung nach draussen aufbauen, das ist im Kopf des Dokuments festgelegt. Der Preis dafuer: gesichert wird nur, was du selbst sicherst.": "Tutto ciò che inserisci resta su questo dispositivo. Non c'è un server e non c'è un account. La pagina non può aprire alcuna connessione verso l'esterno: è stabilito nell'intestazione del documento. Il prezzo: viene salvato solo ciò che salvi tu.",
  "Anker ist ein Tagebuch und eine Merkhilfe. Es stellt keine Diagnose, es rechnet nichts aus, was eine Aerztin ausrechnen muesste, und es gibt keine Empfehlung zu Medikamenten. Es hilft dabei, beim Termin die richtigen Dinge zu erzaehlen, und es macht sichtbar, was ueber Wochen passiert.": "Anker è un diario e un promemoria. Non fa diagnosi, non calcola nulla che debba calcolare un medico e non consiglia farmaci. Ti aiuta a raccontare le cose giuste alla visita e rende visibile ciò che succede nel corso delle settimane.",
  "Anker nennt keine Ambulanz und keine Aerztin. Beim Bauen dieser App war kein einziges medizinisches Verzeichnis erreichbar, also waere jede Adresse hier ungeprueft, und eine ungepruefte Nummer ist schlechter als keine.": "Anker non indica né ambulatori né medici. Mentre questa app veniva costruita, nessun elenco medico era raggiungibile: ogni indirizzo qui sarebbe stato non verificato, e un numero non verificato è peggio di nessun numero.",
  "Anker nennt keine Ambulanz. Es kann keine pruefen. Was hier steht, sind Wege und die Woerter, mit denen man sie findet.": "Anker non indica ambulatori. Non può verificarne nessuno. Qui trovi le strade e le parole con cui trovarle.",
  "Ausgedruckt oder abfotografiert mitnehmen. In der Sprechstunde faellt einem die Haelfte nicht ein.": "Portala stampata o fotografata. Durante la visita metà delle cose non vengono in mente.",
  "Die sichersten Wege stehen oben, und es sind die, die nicht im Netz liegen. Der Suchbegriff daneben ist zum Kopieren gedacht: einmal tippen, dann Safari, dann einfuegen.": "Le strade più sicure sono in alto, e sono quelle che non stanno su internet. Il termine di ricerca accanto è da copiare: un tocco, poi Safari, poi incolla.",
  "Diese Liste ist fuer die Notaufnahme, die Apotheke und den naechsten Termin. Sie aendert nichts an der Behandlung, sie schreibt sie nur auf.": "Questa lista serve al pronto soccorso, alla farmacia e alla prossima visita. Non cambia nulla della terapia, la mette solo per iscritto.",
  "Diese Seite beurteilt nicht die Krankheit, sondern die Stelle. Das ist etwas anderes als die Fragen unter Wissen, die in die Sprechstunde gehoeren. Zum Ausdrucken ueber den Teilen-Knopf des Browsers.": "Questa pagina valuta il centro, non la malattia. È una cosa diversa dalle domande in Sapere, che appartengono alla visita. Da stampare con il pulsante Condividi del browser.",
  "Kein Zeitplan aus dieser App, sondern der aus der Sprechstunde. Die Liste hier ist nur die Erinnerung daran, dass es einen gibt und dass er eingehalten wird.": "Non un calendario di questa app, ma quello dell'ambulatorio. Questa lista ricorda soltanto che esiste e che va rispettato.",
  "Mehrfach moeglich. Was hier steht, sind die Dinge, die beim naechsten Termin zaehlen, weil man sie zwei Monate spaeter nicht mehr erinnert.": "Più scelte possibili. Qui ci sono le cose che contano alla prossima visita, perché due mesi dopo non le ricordi più.",
  "Nur abschreiben, was auf dem Befund steht. Die Bedeutung steht beim jeweiligen Wert, die Beurteilung macht die Aerztin.": "Copia solo ciò che c'è sul referto. Il significato è indicato accanto a ogni valore, la valutazione spetta al medico.",
  "Was die App kann: sagen, wonach genau zu suchen ist und ueber welche Stellen, und dann behalten, was du gefunden hast. Der zweite Teil ist der, der in fuenf Jahren noch etwas wert ist.": "Cosa può fare l'app: dirti cosa cercare esattamente e attraverso quali canali, e poi conservare ciò che hai trovato. La seconda parte è quella che tra cinque anni varrà ancora qualcosa.",
  "14 Tage": "14 giorni",
  "30 Tage": "30 giorni",
  "90 Tage": "90 giorni",
  "Achtung: das ersetzt alles, was jetzt in der App steht.": "Attenzione: sostituisce tutto ciò che c'è ora nell'app.",
  "Adresse": "Indirizzo",
  "Aerztinnen und Ambulanzen finden und behalten": "Trovare e conservare medici e ambulatori",
  "Aktuell": "Attuale",
  "Alle auf derselben Skala, 0 bis 10": "Tutti sulla stessa scala, da 0 a 10",
  "Alles Aktuelle durch die Sicherung ersetzen?": "Sostituire tutto con il backup?",
  "Alles entfernen": "Togliere tutto",
  "Alles loeschen": "Cancella tutto",
  "Als Notfallkontakt": "Imposta come contatto d'emergenza",
  "Andere": "Altro",
  "Angerufen, Rueckruf zugesagt": "Chiamato, promesso richiamo",
  "Anker Sicherung": "Backup di Anker",
  "Anker laeuft nur als eigene Seite, nicht in einem fremden Rahmen.": "Anker funziona solo come pagina a sé, non dentro una cornice altrui.",
  "Anlaufstellen": "Punti di riferimento",
  "Arztbericht": "Resoconto per il medico",
  "Aufgewacht um": "Sveglia alle",
  "Aufpassen": "Attenzione",
  "Augenheilkunde": "Oculistica",
  "Aus dem Labor": "Dal laboratorio",
  "Bei wem": "Da chi",
  "Beides": "Entrambe",
  "Beim ersten Mal": "La prima volta",
  "Bewegung": "Movimento",
  "Da steht nichts.": "Non c'è scritto niente.",
  "Dann sofort aerztliche Hilfe.": "Allora chiedi subito aiuto medico.",
  "Darstellung": "Aspetto",
  "Das ist keine Anker-Sicherung.": "Questo non è un backup di Anker.",
  "Daten loeschen": "Cancella i dati",
  "Datum": "Data",
  "Deine Nummern": "I tuoi numeri",
  "Der Anlass fehlt.": "Manca il motivo.",
  "Der Name fehlt.": "Manca il nome.",
  "Der Speicher dieses Browsers nimmt nichts an.": "La memoria di questo browser non accetta nulla.",
  "Der Weg, nicht die Adresse": "La strada, non l'indirizzo",
  "Der erste Termin": "Il primo appuntamento",
  "Diaetologie": "Dietologia",
  "Die Zahlen als Tabelle": "I numeri in tabella",
  "Diese Liste ersetzt kein Urteil.": "Questa lista non sostituisce il giudizio.",
  "Diese Stelle entfernen?": "Togliere questo punto di riferimento?",
  "Dosis": "Dose",
  "Drucken oder als PDF": "Stampa o salva come PDF",
  "Dunkel": "Scuro",
  "Ein Name fehlt.": "Manca un nome.",
  "Eine Stelle finden": "Trovare un centro",
  "Eingetragen.": "Inserito.",
  "Eintraege": "voci",
  "Eintrag": "voce",
  "Eintragen": "Inserisci",
  "Essen": "Mangiare",
  "Form passt nicht": "Il formato non corrisponde",
  "Fragen, die sich lohnen": "Domande che valgono la pena",
  "Fuer den naechsten Termin": "Per la prossima visita",
  "Fuer diesen Zeitraum gibt es noch keine Eintraege.": "Per questo periodo non ci sono ancora voci.",
  "Gastroenterologie": "Gastroenterologia",
  "Geloescht.": "Cancellato.",
  "Genommen": "Preso",
  "Gestern ist leer": "Ieri è vuoto",
  "Gluten bekommen": "Ho preso glutine",
  "Haus oder Ordination": "Ospedale o studio",
  "Hausarztpraxis": "Medico di base",
  "Hell": "Chiaro",
  "Hell oder dunkel": "Chiaro o scuro",
  "Herausschreiben": "Esportare",
  "Heute": "Oggi",
  "Heute bemerkt": "Notato oggi",
  "Hinzufuegen": "Aggiungi",
  "Im privaten Modus von Safari ist das normal. Eintraege gehen dann beim Schliessen verloren.": "Nella modalità privata di Safari è normale. Le voci si perdono alla chiusura.",
  "In die Liste": "Aggiungi alla lista",
  "In eigenen Worten": "Con parole tue",
  "In welcher Sprache": "In quale lingua",
  "Jetzt sichern": "Salva ora",
  "Kein Notfallkontakt": "Non più contatto d'emergenza",
  "Keine Adresse, die niemand geprueft hat": "Nessun indirizzo che nessuno ha verificato",
  "Konnte nicht speichern. Ist der Speicher voll oder gesperrt?": "Impossibile salvare. La memoria è piena o bloccata?",
  "Kontakt": "Contatto",
  "Kopieren": "Copia",
  "Kopieren ging nicht. Bitte von Hand markieren.": "La copia non è riuscita. Selezionalo a mano.",
  "Laborwerte": "Esami di laboratorio",
  "Letzte Frage. Alles weg?": "Ultima domanda. Via tutto?",
  "Liste": "Lista",
  "Loeschen": "Elimina",
  "Lupus": "Lupus",
  "Max": "Max",
  "Medikamente": "Farmaci",
  "Meine Stellen": "I miei punti di riferimento",
  "Merkmale einer guten Stelle": "Caratteristiche di un buon centro",
  "Min": "Min",
  "Minuten": "Minuti",
  "Mitnehmen und fragen": "Da portare e da chiedere",
  "Mitnehmen, fragen": "Da portare, da chiedere",
  "Mittel": "Media",
  "Mittel, hoechster und tiefster Wert": "Media, valore più alto e più basso",
  "Nacht": "Notte",
  "Nachtragen": "Aggiungere dopo",
  "Name": "Nome",
  "Neue Stelle": "Nuovo punto di riferimento",
  "Neuer Termin": "Nuovo appuntamento",
  "Neues Medikament": "Nuovo farmaco",
  "Nicht mehr bei den Warnzeichen.": "Non più tra i segnali d'allarme.",
  "Nimmt jeden Eintrag von diesem Geraet. Das laesst sich nicht rueckgaengig machen.": "Toglie ogni voce da questo dispositivo. Non si può annullare.",
  "Noch leer": "Ancora vuoto",
  "Noch nichts eingetragen.": "Ancora niente inserito.",
  "Noch nichts eingetragen. Das ist am Anfang der Normalfall.": "Ancora niente inserito. All'inizio è normale.",
  "Notiert": "Annotato",
  "Notiert.": "Annotato.",
  "Notiz": "Nota",
  "Notizen": "Note",
  "Rheumatologie": "Reumatologia",
  "Schlaf": "Sonno",
  "Schlaf, Stunden": "Sonno, ore",
  "Schlafqualitaet": "Qualità del sonno",
  "Seit": "Da",
  "Sicherung": "Backup",
  "Sicherung eingelesen.": "Backup caricato.",
  "Sicherung einlesen": "Caricare un backup",
  "Sicherung erstellen": "Creare un backup",
  "Sicherung erstellt.": "Backup creato.",
  "Sicherung teilen oder speichern": "Condividi o salva il backup",
  "Sicherungsdatei auswaehlen": "Scegli il file di backup",
  "So geht es": "Come si fa",
  "Spaziergang": "Passeggiata",
  "Sprache": "Lingua",
  "Steht jetzt bei den Warnzeichen.": "Ora compare tra i segnali d'allarme.",
  "Stunden": "Ore",
  "Suchbegriff": "Termine di ricerca",
  "Tag": "Giorno",
  "Tage": "Giorni",
  "Telefon": "Telefono",
  "Termine": "Appuntamenti",
  "Und was sie nicht ist": "E ciò che non è",
  "Wann": "Quando",
  "Warnzeichen": "Segnali d'allarme",
  "Warnzeichen ansehen": "Vedi i segnali d'allarme",
  "Warum kein einziger Link dasteht": "Perché qui non c'è nemmeno un link",
  "Was": "Cosa",
  "Was ansteht": "Cosa c'è in programma",
  "Was diese App ist": "Che cos'è questa app",
  "Was diese Stelle kann": "Cosa sa fare questo centro",
  "Was du nimmst": "Cosa prendi",
  "Was ging heute": "Cosa è stato possibile oggi",
  "Was ueberwacht gehoert": "Cosa va controllato",
  "Was war": "Cosa è successo",
  "Weg": "Via",
  "Weg dorthin, in deinen Worten": "Come arrivarci, con parole tue",
  "Wege": "strade",
  "Weiter": "Avanti",
  "Welche Linie, wie viele Minuten, wo die Tuer ist": "Quale linea, quanti minuti, dov'è la porta",
  "Wen du anrufst": "Chi chiamare",
  "Wenn du eine gefunden hast": "Quando ne hai trovato uno",
  "Wenn du noch keine hast": "Se non ne hai ancora",
  "Wenn eines davon auftritt, ist das kein Fall fuer eine App.": "Se compare uno di questi segnali, non è un caso per un'app.",
  "Wert": "Valore",
  "Werte eintragen": "Inserire un valore",
  "Wie das Geraet": "Come il dispositivo",
  "Wie das gemeint ist": "Come va inteso",
  "Wie geht es dir": "Come stai",
  "Wie gut belegt:": "Quanto è documentato:",
  "Wie oft": "Quante volte",
  "Wie verlaesslich das hier ist": "Quanto è affidabile",
  "Wirklich alles loeschen? Vorher gesichert?": "Davvero cancellare tutto? Hai fatto un backup?",
  "Wissen": "Sapere",
  "Wo suchst du": "Dove cerchi",
  "Wofuer": "Per cosa",
  "Woran du sie erkennst": "Come riconoscerlo",
  "Zahl": "Numero",
  "Zahlen": "Numeri",
  "Zeichen": "Segni",
  "Zeichen im Zeitraum": "Segni nel periodo",
  "Zeit fuer eine Sicherung.": "È ora di fare un backup.",
  "Zoeliakie": "Celiachia",
  "Zu meinen Stellen": "Ai miei punti di riferimento",
  "Zum Mitnehmen": "Da portare con te",
  "Zum Nachlesen": "Da approfondire",
  "Zurueck": "Indietro",
  "Zurueck zu Wissen": "Torna a Sapere",
  "Zurueckholen": "Ripristinare",
  "Zusammenfassung fuer den Termin": "Riepilogo per la visita",
  "Zutaten": "Ingredienti",
  "Zwoelf Wochen": "Dodici settimane",
  "kein Eintrag": "nessuna voce",
  "seit": "da",
  "nicht gesetzt": "non impostato",
  "{n} von 10": "{n} su 10",
  "Auch null Minuten sind ein Eintrag. Der Verlauf wird erst dann ehrlich, wenn die schlechten Tage genauso darin stehen wie die guten.": "Anche zero minuti sono una voce. L'andamento diventa onesto solo quando i giorni brutti ci sono quanto quelli belli.",
  "Im Zweifel anrufen. Bei Atemnot, starken Brustschmerzen, ploetzlicher Schwaeche oder Sprachstoerung, Krampfanfall oder hohem Fieber unter immunsuppressiver Behandlung: Notruf.": "Nel dubbio chiama. In caso di difficoltà a respirare, forte dolore al petto, improvvisa debolezza o difficoltà a parlare, crisi convulsiva o febbre alta durante una terapia immunosoppressiva: numero di emergenza.",
  "Zum Inhalt springen": "Vai al contenuto",
  "Hauptbereiche": "Sezioni principali",
  "schlecht": "pessima",
  "erholsam": "ristoratrice",
  "Muedigkeit {n}": "Stanchezza {n}",
  "Schmerz {n}": "Dolore {n}",
  "{n} h Schlaf": "{n} h di sonno",
  "nichts eingetragen": "niente inserito",
  "Verlauf ueber {n} Tage. Die Zahlen stehen in der Tabelle darunter.": "Andamento su {n} giorni. I numeri sono nella tabella qui sotto.",
  "{n} eingetragen": "{n} inseriti",
  "{n} im Notfall": "{n} per le emergenze",
  "keiner eingetragen": "nessuno inserito",
  "naechster am {datum}": "prossimo il {datum}",
  "noch nie gesichert": "mai salvato",
  "heute gesichert": "salvato oggi",
  "{name} aus der Liste nehmen?": "Togliere {name} dalla lista?",
  "200 mg": "200 mg",
  "morgens": "al mattino",
  "verschrieben von ...": "prescritto da ...",
  "Die Zahl fehlt.": "Manca il numero.",
  "{was} kopiert.": "{was} copiato.",
  "Wie du sie nennst": "Come lo chiami tu",
  "Notfallkontakt": "contatto d'emergenza",
  "Telefon {nummer}": "Telefono {nummer}",
  "sicher": "sicura",
  "wohl": "probabile",
  "unsicher": "incerta",
  "Anker koennte eine Adresse hinschreiben, aber nicht pruefen, ob sie stimmt und ob dort heute noch dasselbe steht. Ein Suchbegriff ueberlebt einen Seitenumbau, eine gespeicherte Adresse nicht. Und es geht keine Anfrage von dieser App aus, auch keine, die verraet, wonach du suchst.": "Anker potrebbe scrivere un indirizzo, ma non verificare se è giusto e se oggi lì c'è ancora la stessa cosa. Un termine di ricerca sopravvive a un sito rifatto, un indirizzo salvato no. E da questa app non parte nessuna richiesta, nemmeno una che riveli cosa stai cercando.",
  "Rheumatologie, Kontrolle": "Reumatologia, controllo",
  "{von} bis {bis}, {n} Tage mit Eintrag. Ueber den Teilen-Knopf des Browsers drucken oder als PDF sichern.": "Dal {von} al {bis}, {n} giorni con voci. Da stampare o salvare come PDF con il pulsante Condividi del browser.",
  "{tage} Tage, {werte} Laborwerte, {medikamente} Medikamente. Die Sicherung ist eine einzige Datei. Leg sie in iCloud Drive, in einen Ordner in der Dateien-App oder schick sie dir selbst. Ohne sie ist alles weg, wenn dem Telefon etwas passiert.": "{tage} giorni, {werte} valori di laboratorio, {medikamente} farmaci. Il backup è un unico file. Mettilo in iCloud Drive, in una cartella dell'app File, oppure mandalo a te. Senza di lui, se al telefono succede qualcosa, è tutto perso.",
  "{n} Tag steht in dieser App, und er steht nur hier. Eine Sicherung dauert zehn Sekunden.": "In questa app c'è {n} giorno, e c'è solo qui. Un backup richiede dieci secondi.",
  "{n} Tage stehen in dieser App, und sie stehen nur hier. Eine Sicherung dauert zehn Sekunden.": "In questa app ci sono {n} giorni, e ci sono solo qui. Un backup richiede dieci secondi.",
  "{n} Messung": "{n} misurazione",
  "{n} Messungen": "{n} misurazioni",
  "{n} Stelle": "{n} punto di riferimento",
  "{n} Stellen": "{n} punti di riferimento",
  "vor {n} Tag gesichert": "salvato {n} giorno fa",
  "vor {n} Tagen gesichert": "salvato {n} giorni fa",
  "an {n} von {gesamt} Tagen": "in {n} giorni su {gesamt}",
  "Mappe": "Cartella",
  "Persoenliches Begleitbuch bei chronischen Erkrankungen. Alle Eintraege bleiben auf diesem Geraet.": "Diario personale per malattie croniche. Tutte le voci restano su questo dispositivo.",
  "Meine Erkrankungen": "Le mie malattie",
  "Gemerkt": "Salvati",
  "leeren": "azzera",
  "Du traegst fuer {datum} nach.": "Stai completando il {datum}.",
  "Zurueck zu heute": "Torna a oggi",
  "Ein Wert fuer den ganzen Tag": "Un valore per tutta la giornata",
  "Gesamt": "Complessivo",
  "Dein Koerper heute": "Il tuo corpo oggi",
  "Schieben, wo es passt. Was du nicht beruehrst, bleibt leer, und leer ist auch eine Antwort.": "Fai scorrere dove serve. Ciò che non tocchi resta vuoto, e anche vuoto è una risposta.",
  "Fuer heute vorgeschlagen": "Proposto per oggi",
  "Rezepte des Monats": "Ricette del mese",
  "{datum}. Wenn du magst, kurz nachtragen.": "{datum}. Se vuoi, completalo in breve.",
  "Gestern nachtragen": "Completa ieri",
  "Deine Regler im Verlauf": "I tuoi cursori nel tempo",
  "Hoechstens drei Linien zugleich.": "Al massimo tre linee alla volta.",
  "Befinden {n}": "Benessere {n}",
  "mediterran": "mediterranea",
  "Omega-3": "Omega-3",
  "Eisen": "Ferro",
  "Kalzium": "Calcio",
  "Eiweiss": "Proteine",
  "Ballaststoffe": "Fibre",
  "schonend": "leggera",
  "vegetarisch": "vegetariana",
  "ohne Milch": "senza latticini",
  "auf Vorrat": "da preparare in anticipo",
  "wenig Kraft": "poche energie",
  "Nicht mehr merken": "Togli dai salvati",
  "Merken": "Salva",
  "In der Mappe gemerkt.": "Salvata nella cartella.",
  "Nicht mehr gemerkt.": "Tolta dai salvati.",
  "Fuer deine Erkrankungen": "Per le tue malattie",
  "Essen, das passt": "Cibo adatto a te",
  "Diesen Monat": "Questo mese",
  "Gemerkt ({n})": "Salvati ({n})",
  "Regeln": "Regole",
  "Was zu deinen Erkrankungen passt, ist hervorgehoben. Mit dem Herz landet ein Rezept in der Mappe und bleibt dort, auch wenn der Monat wechselt.": "Ciò che si adatta alle tue malattie è evidenziato. Con il cuore una ricetta finisce nella cartella e ci resta anche quando cambia il mese.",
  "Alle Rezepte": "Tutte le ricette",
  "Gemerkte Rezepte": "Ricette salvate",
  "Noch nichts gemerkt. Tippe bei einem Rezept auf das Herz.": "Ancora niente salvato. Tocca il cuore su una ricetta.",
  "Was beim Essen zaehlt": "Cosa conta a tavola",
  "Leitlinie": "Linea guida",
  "Meta-Analyse": "Meta-analisi",
  "Uebersicht": "Revisione",
  "Studie": "Studio",
  "Artikel": "Articolo",
  "In PubMed lesen": "Leggi su PubMed",
  "Fuer den Termin merken": "Salva per la visita",
  "Stand {monat}": "Aggiornato a {monat}",
  "Aktuelle Forschung": "Ricerca attuale",
  "Jeden Monat neu aus PubMed: Leitlinien, Uebersichten und Studien des letzten Jahres zu deinen Erkrankungen. Die Titel stehen im Original und sind nicht bewertet. Was davon fuer dich gilt, klaert die Sprechstunde.": "Ogni mese nuovo da PubMed: linee guida, revisioni e studi dell'ultimo anno sulle tue malattie. I titoli sono in lingua originale e non valutati. Cosa vale per te lo chiarisce la visita.",
  "Zusammen": "Insieme",
  "Ernaehrung, Muedigkeit, Bewegung": "Alimentazione, stanchezza, movimento",
  "Quelle: {quelle}. Gesucht nach Leitlinien, Meta-Analysen, systematischen Uebersichten und randomisierten Studien.": "Fonte: {quelle}. Cercati linee guida, meta-analisi, revisioni sistematiche e studi randomizzati.",
  "Deine App richtet sich danach": "La tua app si adatta a questo",
  "Erkrankungen aendern": "Cambia malattie",
  "Fuer den Arzttermin": "Per la visita medica",
  "Arztmappe": "Cartella per il medico",
  "Zwoelf Wochen zusammengefasst, je Erkrankung oder alles zusammen. Zum Zeigen am Telefon, zum Drucken oder als PDF.": "Dodici settimane riassunte, per malattia o tutto insieme. Da mostrare sul telefono, da stampare o come PDF.",
  "Alles": "Tutto",
  "Die Forschungsuebersicht kommt nicht aus dem Netz in die App. Sie wird einmal im Monat auf GitHub aus PubMed zusammengestellt und als Datei mit der App ausgeliefert. Vom Telefon geht dabei nichts hinaus, auch nicht, welche Erkrankungen du gewaehlt hast.": "La panoramica della ricerca non arriva nell'app da internet. Viene compilata da PubMed una volta al mese su GitHub e consegnata con l'app come file. Dal telefono non esce nulla, nemmeno quali malattie hai scelto.",
  "Willkommen bei Anker": "Ti diamo il benvenuto in Anker",
  "Wofuer brauchst du Anker?": "Per cosa ti serve Anker?",
  "Waehle eine oder mehrere Erkrankungen. Jede bringt ihre eigenen Regler, Fragen, Laborwerte, Rezepte und Forschung mit, und die App setzt sich daraus zusammen. Aendern geht jederzeit unter Mappe.": "Scegli una o più malattie. Ognuna porta i propri cursori, domande, valori di laboratorio, ricette e ricerca, e l'app si compone da sé. Puoi cambiare in qualsiasi momento in Cartella.",
  "Was du hier abwaehlst, verschwindet aus der Ansicht, nicht aus den Daten. Waehlst du es wieder, ist alles noch da.": "Ciò che deselezioni qui sparisce dalla vista, non dai dati. Se lo riscegli, c'è ancora tutto.",
  "Los geht es": "Iniziamo",
  "Fertig": "Fatto",
  "Bitte mindestens eine Erkrankung waehlen.": "Scegli almeno una malattia.",
  "Fehlt eine Erkrankung? Neue Bausteine kommen in die Datei module.js, mit eigenen Reglern, Zeichen, Laborwerten und Regeln. Die App setzt sich daraus von selbst zusammen.": "Manca una malattia? I nuovi moduli vanno nel file module.js, con i propri cursori, segni, valori di laboratorio e regole. L'app si compone da sé.",
  "Fuer den Termin gemerkt": "Salvati per la visita",
  "Diese Arbeiten stehen auch in der Arztmappe. Am besten mit der Frage mitnehmen, ob sie fuer dich etwas aendern.": "Questi articoli compaiono anche nella cartella per il medico. Meglio portarli con la domanda se cambiano qualcosa per te.",
  "Noch nichts gemerkt. Unter Wissen, Aktuelle Forschung, laesst sich jede Arbeit merken.": "Ancora niente salvato. In Sapere, Ricerca attuale, ogni articolo si può salvare.",
  "Arztmappe {name}": "Cartella per il medico: {name}",
  "{name} (10 ist gut)": "{name} (10 è buono)",
  "Letzte Werte": "Ultimi valori",
  "Zuletzt": "Ultimo",
  "Davor": "Precedente",
  "Zum Nachfragen": "Da chiedere",
  "Gemerkte Forschung": "Ricerca salvata",
  "Die Frage dazu: Aendert das etwas fuer mich?": "La domanda da fare: cambia qualcosa per me?",
  "{n} Minute": "{n} minuto",
  "{n} Minuten": "{n} minuti",
  "{n} Rezept": "{n} ricetta",
  "{n} Rezepte": "{n} ricette",
  "{n} Arbeit": "{n} articolo",
  "{n} Arbeiten": "{n} articoli",
  "Zeit beim Original": "Tempo sulla fonte",
  "Portionen: {n}": "Porzioni: {n}",
  "von {autor}": "di {autor}",
  "Bitte pruefen, ob glutenfrei:": "Controlla che siano senza glutine:",
  "Zur Zubereitung bei {quelle}": "Preparazione su {quelle}",
  "Glutenfrei laut Quelle und nach Pruefung der Zutatenliste. Beim Einkauf jede Packung trotzdem selbst pruefen.": "Senza glutine secondo la fonte e dopo il controllo degli ingredienti. Al momento dell'acquisto controlla comunque ogni confezione.",
  "Nur glutenfreie Rezepte, aus dem Netz und aus der eigenen Sammlung. Die Auswahl wechselt jeden Monat und richtet sich nach dem, was deine Erkrankungen brauchen. Eine Merkhilfe, keine Verordnung.": "Solo ricette senza glutine, dal web e dalla raccolta di Anker. La scelta cambia ogni mese e segue ciò di cui hanno bisogno le tue malattie. Un promemoria, non una prescrizione.",
  "Aus dem Netz, glutenfrei": "Dal web, senza glutine",
  "Jeden Monat neu gesammelt von Seiten, die glutenfrei kochen, sortiert nach deinen Erkrankungen. Hier stehen die Zutaten, die Zubereitung steht beim Original.": "Raccolte ogni mese da siti che cucinano senza glutine, ordinate per le tue malattie. Qui ci sono gli ingredienti, la preparazione è sull'originale.",
  "Aus der Anker-Sammlung": "Dalla raccolta di Anker",
  "{n} Zutat": "{n} ingrediente",
  "{n} Zutaten": "{n} ingredienti",
  "{n} Schritt beim Original.": "{n} passaggio sull'originale.",
  "{n} Schritte beim Original.": "{n} passaggi sull'originale.",
  "Diese Uebersetzung ist sorgfaeltig gemacht, aber noch nicht von Muttersprachlerinnen oder medizinischem Fachpersonal geprueft. Im Zweifel gilt die deutsche Fassung.": "Questa traduzione è stata fatta con cura, ma non è ancora stata verificata da madrelingua né da personale sanitario. In caso di dubbio vale la versione tedesca.",
  "kaum": "quasi nulla",
  "leicht": "lieve",
  "mittel": "moderato",
  "stark": "forte",
  "sehr stark": "molto forte",
  "Es gibt Punkte fuer die Praxis": "Ci sono punti per l'ambulatorio",
  "Starke Beschwerden": "Disturbi forti",
  "Schlechter als davor": "Peggio di prima",
  "Besser als davor": "Meglio di prima",
  "Ruhig und gleichbleibend": "Tranquillo e stabile",
  "deutlich besser": "nettamente meglio",
  "etwas besser": "un po' meglio",
  "gleich": "uguale",
  "etwas schlechter": "un po' peggio",
  "deutlich schlechter": "nettamente peggio",
  "Dein Stand": "Il tuo stato",
  "Noch zu wenig fuer ein Bild": "Ancora troppo poco per un quadro",
  "Ab vier Tagen mit Eintrag in den letzten {n} Tagen fasst Anker hier zusammen. Bisher: {k}.": "Da quattro giorni con annotazioni negli ultimi {n} giorni, Anker riassume qui. Finora: {k}.",
  "Dein Stand, letzte {n} Tage": "Il tuo stato, ultimi {n} giorni",
  "{k} Tage mit Eintrag, verglichen mit den {n} Tagen davor.": "{k} giorni con annotazioni, confrontati con i {n} giorni precedenti.",
  "Zuerst: {was}": "Prima di tutto: {was}",
  "Ganzen Stand ansehen": "Vedi il quadro completo",
  "Mittel {m} von 10": "Media {m} su 10",
  "davor {m}": "prima {m}",
  "Mittel {m}": "Media {m}",
  "Nicht bis zum Routinetermin warten": "Non aspettare la visita di routine",
  "Punkte fuer die Praxis": "Punti per l'ambulatorio",
  "Aus deinen Eintraegen. Bei starken oder rasch schlimmer werdenden Beschwerden nicht warten: Notruf 112, in Oesterreich auch 144.": "Dalle tue annotazioni. Con disturbi forti o che peggiorano rapidamente non aspettare: numero di emergenza 112, in Austria anche 144.",
  "an {n} Tagen, zuletzt {datum}": "in {n} giorni, l'ultima volta il {datum}",
  "an {n} Tagen": "in {n} giorni",
  "Medikamente abgehakt": "Farmaci spuntati",
  "an {n} von {gesamt} Tagen mit Eintrag": "in {n} su {gesamt} giorni con annotazioni",
  "Gezaehlt wird nur, was abgehakt ist. Nicht abgehakt heisst nicht unbedingt vergessen.": "Conta solo ciò che è spuntato. Non spuntato non significa per forza dimenticato.",
  "Wie dieser Stand entsteht": "Come nasce questo quadro",
  "Alles beruht auf deinen eigenen Eintraegen. Anker stellt keine Diagnose und berechnet keinen Krankheitsindex; wie aktiv eine Erkrankung ist, beurteilt die Praxis mit Untersuchung und Labor.": "Tutto si basa sulle tue annotazioni. Anker non fa diagnosi e non calcola alcun indice di malattia; quanto è attiva una malattia lo valuta l'ambulatorio con visita ed esami di laboratorio.",
  "Einordnung der Mittelwerte: 0 bis unter 1 kaum, 1 bis unter 4 leicht, 4 bis unter 7 mittel, ab 7 stark. So werden Muedigkeit und Schmerz auf 0-bis-10-Skalen in Studien eingeteilt; fuer Juckreiz gilt zusaetzlich ab 9 sehr stark. Fuer die anderen Regler ist das eine Orientierung, keine gepruefte Grenze.": "Come si classificano le medie: da 0 a meno di 1 quasi nulla, da 1 a meno di 4 lieve, da 4 a meno di 7 moderato, da 7 in su forte. Così vengono classificati stanchezza e dolore su scale da 0 a 10 negli studi; per il prurito, da 9 in su vale anche molto forte. Per gli altri cursori è un orientamento, non una soglia validata.",
  "Veraenderung: verglichen mit den vierzehn Tagen davor. Ab einem Punkt Unterschied heisst es etwas, ab zwei Punkten deutlich, weil rund zwei Punkte in Studien als spuerbare Veraenderung gelten. Fuer einen Mittelwert braucht es mindestens drei Eintraege.": "Variazione: confrontata con i quattordici giorni precedenti. Da un punto di differenza dice un po', da due punti nettamente, perché negli studi circa due punti contano come una variazione percepibile. Per una media servono almeno tre annotazioni.",
  "Kalenderdatei erstellt. Oeffnen, dann uebernimmt der Kalender die Erinnerung.": "File del calendario creato. Aprilo e il calendario si occuperà del promemoria.",
  "{name} nehmen": "Prendere {name}",
  "Demnaechst": "Prossimamente",
  "heute": "oggi",
  "morgen": "domani",
  "Arztmappe vorbereiten": "Prepara la cartella per il medico",
  "Fuer deine Erkrankungen:": "Per le tue malattie:",
  "Erinnern": "Promemoria",
  "Fuer eine Erinnerung fehlt die Uhrzeit. Eintrag loeschen und mit Uhrzeit neu anlegen.": "Per un promemoria manca l'orario. Elimina la voce e aggiungila di nuovo con l'orario.",
  "Uhrzeit fuer die Erinnerung": "Orario del promemoria",
  "In den Kalender": "Nel calendario",
  "Uhrzeit": "Orario",
  "Das Datum fehlt.": "Manca la data.",
  "Eingetragen. Auch in den Kalender des Telefons, mit Erinnerung?": "Inserito. Anche nel calendario del telefono, con promemoria?",
  "Erinnern macht der Kalender.": "Il promemoria lo fa il calendario.",
  "Eine Webseite ohne Server darf auf dem iPhone keine Benachrichtigung schicken, und einen Server hat Anker absichtlich nicht. Der Knopf In den Kalender gibt den Termin samt Erinnerung an den Kalender des Telefons weiter: am Vortag und zwei Stunden vorher, ohne Uhrzeit am Vorabend um 18 Uhr.": "Su iPhone un sito senza server non può inviare notifiche, e Anker volutamente non ha un server. Il pulsante Nel calendario passa l'appuntamento con i promemoria al calendario del telefono: il giorno prima e due ore prima, senza orario la sera prima alle 18.",
  "{n} Termin diese Woche": "{n} appuntamento questa settimana",
  "{n} Termine diese Woche": "{n} appuntamenti questa settimana",
  "an {n} Tag, zuletzt {datum}": "in {n} giorno, l'ultima volta il {datum}",
  "an {n} Tag": "in {n} giorno",
  "Journal": "Diario",
  "Kurz gefragt": "Domande veloci",
  "Was heute war": "Com'è andata oggi",
  "Ein Satz reicht. Was anders war, was geholfen hat, was dich beschaeftigt.": "Basta una frase. Cosa è stato diverso, cosa ha aiutato, cosa ti preoccupa.",
  "Diese Woche": "Questa settimana",
  "Heute beginnt eine Serie": "Oggi inizia una serie",
  "{n} von {gesamt} erfasst": "{n} di {gesamt} registrati",
  "Das Journal entsteht von selbst, sobald es ein paar Tage gibt.": "Il diario si crea da solo appena ci sono alcuni giorni.",
  "Deine Bilanz": "Il tuo bilancio",
  "wie davor": "come prima",
  "laengste Serie": "serie più lunga",
  "der letzten 30 Tage erfasst": "degli ultimi 30 giorni registrati",
  "Befinden, Mittel 30 Tage": "Benessere, media 30 giorni",
  "Befinden der letzten 30 Tage, ein Balken je Tag": "Benessere degli ultimi 30 giorni, una barra per giorno",
  "Voriger Monat": "Mese precedente",
  "Naechster Monat": "Mese successivo",
  "Befinden im Mittel {m}": "benessere medio {m}",
  "Termin": "Appuntamento",
  "An diesem Tag steht nichts im Journal.": "Per questo giorno non c'è nulla nel diario.",
  "aufgewacht {zeit}": "sveglia alle {zeit}",
  "{n} Minuten Bewegung": "{n} minuti di movimento",
  "Bearbeiten": "Modifica",
  "Statistik": "Statistica",
  "Was die Zahlen sagen": "Cosa dicono i numeri",
  "Fuer eine Statistik braucht es mindestens drei Eintraege je Regler.": "Per una statistica servono almeno tre annotazioni per cursore.",
  "Median": "Mediana",
  "Spanne": "Intervallo",
  "Trend je Woche": "Tendenza a settimana",
  "flach": "piatta",
  "Bewegung, Minuten": "Movimento, minuti",
  "starker": "forte",
  "mittlerer": "moderata",
  "schwacher": "debole",
  "gleichlaeufig": "nella stessa direzione",
  "gegenlaeufig": "in direzione opposta",
  "{a} und {b}: {staerke} Zusammenhang, {richtung}": "{a} e {b}: relazione {staerke}, {richtung}",
  "Zusammenhaenge": "Relazioni",
  "Gleichlaeufig heisst: steigt das eine, steigt meist auch das andere. Ein Zusammenhang ist keine Ursache. Gezeigt ab 14 gemeinsamen Tagen; Einordnung nach Cohen: ab 0,1 schwach, ab 0,3 mittel, ab 0,5 stark.": "Nella stessa direzione significa: se uno sale, di solito sale anche l'altro. Una relazione non è una causa. Mostrata da 14 giorni in comune; classificazione secondo Cohen: da 0,1 debole, da 0,3 moderata, da 0,5 forte.",
  "Wochentage": "Giorni della settimana",
  "Am besten ging es dir im Mittel am {gut} ({mg}), am schlechtesten am {schlecht} ({ms}).": "In media sei stata meglio di {gut} ({mg}) e peggio di {schlecht} ({ms}).",
  "Haeufigste Zeichen": "Segni più frequenti",
  "Anteil der {n} Tage mit Eintrag.": "Quota dei {n} giorni con annotazioni.",
  "Dein Journal": "Il tuo diario",
  "Weitere {n} anzeigen": "Mostra altri {n}",
  "Geprueft glutenfrei": "Verificato senza glutine",
  "Mit Aufschrift glutenfrei kaufen:": "Comprare con la dicitura senza glutine:",
  "Jede Zutat einzeln geprueft: von Natur aus glutenfrei, oder Packungsware, die mit der Aufschrift glutenfrei gekauft wird. In der EU heisst das hoechstens 20 mg Gluten je kg. Eine Laboranalyse ist das nicht.": "Ogni ingrediente verificato uno per uno: senza glutine per natura, oppure un prodotto confezionato acquistato con la dicitura senza glutine. Nell'UE significa al massimo 20 mg di glutine per kg. Non è un'analisi di laboratorio.",
  "Deine Termine": "I tuoi appuntamenti",
  "Behandlung im Blick": "Le cure sotto controllo",
  "geplant": "previsti",
  "erledigt {jahr}": "fatti nel {jahr}",
  "Fachrichtungen": "specialità",
  "ohne Ergebnis": "senza esito",
  "Naechster Termin": "Prossimo appuntamento",
  "Nach dem Termin": "Dopo l'appuntamento",
  "Was kam bei {was} heraus?": "Cosa è emerso da {was}?",
  "Als erledigt festhalten": "Segna come fatto",
  "Festgehalten.": "Registrato.",
  "Fand nicht statt": "Non si è svolto",
  "Kommende Termine": "Prossimi appuntamenti",
  "Wo": "Dove",
  "Wegen": "Per",
  "Verlauf der Behandlung": "Andamento delle cure",
  "Alle": "Tutti",
  "Hausarzt": "Medico di base",
  "Dermatologie": "Dermatologia",
  "Endokrinologie": "Endocrinologia",
  "Nephrologie": "Nefrologia",
  "Gynaekologie": "Ginecologia",
  "Labor": "Laboratorio",
  "Physiotherapie": "Fisioterapia",
  "Psychotherapie": "Psicoterapia",
  "Sonstiges": "Altro",
  "Fachrichtung": "Specialità",
  "bitte waehlen": "scegli",
  "Ergebnis, Befund": "Esito, referto",
  "Was gesagt, gemessen, entschieden wurde": "Cosa è stato detto, misurato, deciso",
  "Naechste Schritte": "Prossimi passi",
  "Kontrolle in drei Monaten, Blutabnahme vorher": "Controllo tra tre mesi, prelievo prima",
  "Neu verordnet, geaendert": "Nuova prescrizione, modifiche",
  "Medikament, Dosis, ab wann": "Farmaco, dose, da quando",
  "Ergebnis fehlt": "Esito mancante",
  "erledigt": "fatto",
  "abgesagt": "annullato",
  "Im Zeitraum": "Nel periodo",
  "Termine und Ergebnisse": "Appuntamenti ed esiti",
  "Ergebnis": "Esito",
  "Verordnung": "Prescrizione",
  "{n} Frage fuer heute": "{n} domanda per oggi",
  "{n} Fragen fuer heute": "{n} domande per oggi",
  "{n} Tag in Folge": "{n} giorno di fila",
  "{n} Tage in Folge": "{n} giorni di fila",
  "{n} Tag im Journal": "{n} giorno nel diario",
  "{n} Tage im Journal": "{n} giorni nel diario",
  "Tag in Folge": "giorno di fila",
  "Tage in Folge": "giorni di fila",
  "{n} Eintrag": "{n} annotazione",
  "{n} Eintraege": "{n} annotazioni",
  "in {n} Tag": "tra {n} giorno",
  "in {n} Tagen": "tra {n} giorni",
  "{n} Frage, die sich lohnt": "{n} domanda da fare",
  "{n} Fragen, die sich lohnen": "{n} domande da fare",
  "Termine (Leiste)": "Visite",
};
