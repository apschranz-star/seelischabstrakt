/*
 * Il contenuto di Anker in italiano.
 *
 * Questo file è la traduzione di content.js. La struttura resta identica:
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
          "Parodis I et al., EULAR, nicht medikamentoese Behandlung, Ann Rheum Dis 2024;83:720-729. PMID 37433575",
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
          "ACG-Leitlinie, Am J Gastroenterol 2023. PMID 36602836",
          "Ludvigsson JF et al., BSG, Gut 2014;63:1210-1228. PMID 24917550",
          "ESsCD 2025, United European Gastroenterol J. PMID 40999951 und PMID 41831197",
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
          "Meta-Analyse zu tTG und Endomysium-Antikoerpern bei persistierender Zottenatrophie, Gastroenterology 2017",
          "Leitlinien zur Verlaufskontrolle, Nat Rev Gastroenterol Hepatol 2023. PMID 38110546",
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
        quellen: ["Humphrey MB et al., ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022. DOI 10.1002/art.42646"],
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
          "ACR-Leitlinie zur Behandlung des SLE 2025. PMID 41182321",
          "EULAR 2025, Lupus mit Nierenbeteiligung. PMID 41107121",
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
          "AAO, Empfehlungen zum Screening auf Hydroxychloroquin-Retinopathie, Ophthalmology. PMID 41232611",
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
        quellen: ["ACR-Leitlinie zur Lupusnephritis 2024. DOI 10.1002/art.43212"],
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
          "Sammaritano LR et al., ACR-Leitlinie zur reproduktiven Gesundheit 2020, Arthritis Rheumatol 2020;72:529-556. PMID 32090466",
          "Andreoli L et al., EULAR, Frauengesundheit bei SLE und APS, Ann Rheum Dis 2017;76:476-485",
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
          "Systematische Uebersicht und Metaanalyse zum Rauchen bei SLE, Autoimmun Rev 2019. PMID 31520802",
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
    quellen: ["ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022. DOI 10.1002/art.42646"],
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
