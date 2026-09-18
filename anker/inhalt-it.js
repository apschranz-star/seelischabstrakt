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
