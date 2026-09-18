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
      { art: "nein", was: "Germogli di alfalfa e integratori di alfalfa", warum: "Contengono L-canavanina. Su questo esistono descrizioni di casi con quadri simili al lupus ed esperimenti su scimmie. Le prove sono vecchie e sottili, ma rinunciarvi non costa nulla, perciò il punto compare in quasi ogni raccomandazione per le pazienti." },
      { art: "nein", was: "Prodotti che stimolano il sistema immunitario", warum: "Echinacea e prodotti simili che dichiarano di stimolare il sistema immunitario. In una malattia in cui il sistema immunitario fa già troppo, è la direzione sbagliata." },
      { art: "vielleicht", was: "Integratori singoli ad alto dosaggio presi di testa propria", warum: "Soprattutto tutto ciò che riguarda il ferro: il ferro va integrato solo se una carenza è stata misurata." },
      { art: "vielleicht", was: "Pompelmo", warum: "Influisce sulla degradazione di alcuni farmaci. Se riguardi i tuoi, la farmacia te lo dice in un minuto." },
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
  { schluessel: "ttg", gruppe: "Celiachia", name: "tTG-IgA", einheit: "U/ml", bedeutung: "Il valore di controllo della celiachia nel tempo. Con un'alimentazione senza glutine rigorosa scende nell'arco di mesi. Un valore che torna a salire indica un apporto di glutine." },
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
      { dringend: "nein", zeichen: "Fiato corto o forte dolore al torace", warum: "Può voler dire embolia polmonare, pericardite o pleurite. Nel lupus il rischio di trombi è aumentato, soprattutto con gli anticorpi antifosfolipidi." },
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
      { dringend: "vielleicht", zeichen: "Molta meno urina del solito", warum: "Va chiarito sul versante renale." },
      { dringend: "vielleicht", zeichen: "Sanguinamenti o lividi senza un motivo", warum: "Può indicare piastrine basse." },
      { dringend: "vielleicht", zeichen: "Diarrea che non passa, calo di peso nonostante l'alimentazione senza glutine", warum: "Nella celiachia la causa più frequente è un apporto nascosto di glutine, ma va guardato." },
      { dringend: "vielleicht", zeichen: "Nuovo disturbo della vista in corso di idrossiclorochina", warum: "Il controllo della retina ha una cadenza fissa, un disturbo nuovo non aspetta quella scadenza." },
    ],
  },
  {
    kicker: "Da dire al prossimo appuntamento",
    titel: "Importante, ma non urgente",
    punkte: [
      { dringend: "ja", zeichen: "Fatigue che peggiora nell'arco di settimane", warum: "Va chiarita: emocromo, tiroide, ferro, vitamina D, sonno, umore. Non tutto questo è lupus, ed è una buona notizia, perché molto di questo si può trattare." },
      { dringend: "ja", zeichen: "Nuova caduta dei capelli, ulcere orali, fotosensibilità", warum: "Fanno parte della descrizione dell'attività e dovrebbero essere messe a verbale." },
      { dringend: "ja", zeichen: "Umore, ansia, voglia di fare", warum: "Nel lupus sono frequenti e strettamente intrecciati con la fatigue. Se ne parla troppo di rado." },
      { dringend: "ja", zeichen: "Il desiderio di un figlio, anche se è ancora lontano", warum: "Alcuni farmaci vanno cambiati molto tempo prima, e nel lupus una gravidanza si pianifica meglio in una fase tranquilla." },
    ],
  },
];

/* -------------------------------------------------------------- Domande */

window.INHALT.it.fragen = [
  { frage: "Quanto è attivo adesso il mio lupus, in numeri?", warum: "Per questo esistono strumenti di misura. Conoscere il proprio numero rende leggibile l'andamento negli anni." },
  { frage: "Quando sono state controllate l'ultima volta le proteine nelle urine?", warum: "Il rene non si fa sentire da solo." },
  { frage: "Quali valori vanno controllati e ogni quanto, e chi li fa richiedere?", warum: "Così non resta niente in mezzo fra il medico di famiglia e l'ambulatorio ospedaliero." },
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
        staerke: "Forte per lo sganciamento dall'attività misurata. Forte per sonno, dolore, umore e fibromialgia come accompagnatori.",
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
          "Alcune di queste cose si trattano bene, e proprio per questo vale la pena guardare. Con in più una " +
            "celiachia vale il doppio, perché l'assorbimento nell'intestino può essere disturbato.",
        ],
        liste: [
          "<b>Emocromo</b>, per l'anemia. Frequente sia nel lupus sia nella celiachia, e una delle cause fisiche più frequenti di spossatezza.",
          "<b>Ferro e ferritina</b>. Nella celiachia la carenza più frequente in assoluto. Attenzione: la ferritina sale con l'infiammazione, si legge insieme alla PCR.",
          "<b>Tiroide</b>. Un ipotiroidismo dà esattamente questo quadro, e le malattie autoimmuni della tiroide sono più frequenti in entrambe le malattie di base.",
          "<b>Vitamina D, B12, acido folico</b>.",
          "<b>Valori renali e urine</b>, perché un interessamento renale resta muto a lungo.",
          "<b>Sonno</b>. Dormire male nel lupus è molto frequente e negli studi è il singolo accompagnatore più forte della fatigue.",
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
            "piccole e più contraddittorie di come si leggono nei manuali di consigli.",
          "In concreto: una revisione Cochrane del 2023 arriva a una bassa certezza dei risultati e per la " +
            "fatigue non trova un beneficio statisticamente sicuro. Una sintesi successiva dello stesso piccolo " +
            "panorama di studi trova un beneficio medio per fatigue, resistenza, umore e funzione. Le due leggono " +
            "quasi gli stessi studi e arrivano a conclusioni diverse, perché fanno i conti in modo differente.",
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
            "settimane</b>, erano di intensità media e seguiti. Seguiti qui vuol dire: qualcuno ci guarda sopra. " +
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
          "Inquadrato onestamente: è una catena di prove sottile e vecchia, non una dimostrazione. Rinunciare ai " +
            "germogli di alfalfa però non costa nulla, perciò sta anche qui. Su tutto il resto conviene lo " +
            "scetticismo: molte liste di divieti in rete non sono nate da questa domanda, ma per copiatura.",
          "Un punto con una motivazione migliore: <b>i prodotti che dichiarano espressamente di stimolare il " +
            "sistema immunitario</b>, per esempio l'echinacea. In una malattia in cui il sistema immunitario si " +
            "rivolge contro il proprio corpo, è la direzione sbagliata. Anche qui la catena di prove è sottile, " +
            "ma il ragionamento tiene.",
        ],
        staerke: "Debole. Descrizioni di casi ed esperimenti sugli animali. Sostenibile come misura di prudenza, non come fatto.",
      },
    ],
  },
