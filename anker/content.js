/*
 * Der Inhalt von Anker, getrennt vom Code.
 *
 * Diese Datei ist zum Aendern gedacht. Wer einen Punkt anders formulieren, ein
 * Rezept ergaenzen oder einen Laborwert aufnehmen will, aendert hier und sonst
 * nirgends. Die App liest nur.
 *
 * WAS HIER STEHT UND WAS NICHT
 * Alles hier ist allgemeine Information, wie sie in Leitlinien und in
 * veroeffentlichten Studien steht. Nichts davon ist auf eine einzelne Person
 * zugeschnitten, nichts ersetzt die Sprechstunde, und nichts hier sagt, welche
 * Dosis richtig ist. Wo die Belege duenn sind, steht das dabei. Das ist kein
 * Kleingedrucktes, das ist der Punkt: bei Lupus kursiert sehr viel, was nie
 * geprueft wurde, und der Unterschied zwischen "in einer Studie gemessen" und
 * "steht so im Internet" ist die ganze Sache wert.
 */

const INHALT = {};

/* ------------------------------------------------------------------ Zeichen */

INHALT.symptome = [
  "Gelenkschmerz",
  "Morgensteifigkeit",
  "Schmetterlingsausschlag",
  "anderer Ausschlag",
  "Lichtempfindlich",
  "Mundgeschwuere",
  "Haarausfall",
  "Fieber",
  "Lymphknoten",
  "Raynaud",
  "trockene Augen",
  "trockener Mund",
  "Kopfschmerz",
  "Brustschmerz beim Atmen",
  "Herzrasen",
  "Kurzatmig",
  "Bauchschmerz",
  "Blaehungen",
  "Durchfall",
  "Verstopfung",
  "Uebelkeit",
  "geschwollene Beine",
  "schaeumender Urin",
  "Muskelschmerz",
];

/* -------------------------------------------------------------------- Essen */

INHALT.essen = [
  {
    kicker: "Zoeliakie",
    titel: "Die Regel ohne Ausnahme",
    lead:
      "Bei Zoeliakie ist die glutenfreie Ernaehrung nicht eine Diaet unter mehreren, " +
      "sondern die Behandlung. Sie gilt lebenslang und auch dann, wenn nach einer kleinen " +
      "Menge nichts zu spueren ist: der Schaden an der Darmschleimhaut entsteht auch ohne Beschwerden.",
    punkte: [
      { art: "nein", was: "Weizen in jeder Form", warum: "Dinkel, Emmer, Einkorn, Kamut, Gruenkern und Weizenstaerke ohne Kennzeichnung gehoeren dazu. Auch Urgetreide ist Weizen." },
      { art: "nein", was: "Gerste und Roggen", warum: "Malz, Malzextrakt, Malzaroma und Bier aus Gerste sind die haeufigsten Stolpersteine." },
      { art: "vielleicht", was: "Hafer", warum: "Hafer selbst enthaelt kein Gluten, wird aber fast immer mit Weizen zusammen verarbeitet. Nur als ausdruecklich glutenfreier Hafer, und auch dann vertraegt ihn eine kleine Minderheit nicht." },
      { art: "ja", was: "Reis, Mais, Buchweizen, Hirse, Quinoa, Amaranth, Teff", warum: "Von Natur aus glutenfrei. Buchweizen ist trotz des Namens kein Weizen." },
      { art: "ja", was: "Kartoffel, Huelsenfruechte, Nuesse, Samen", warum: "Traeger der Mahlzeit, wenn Brot wegfaellt, und dazu Eiweiss und Ballaststoff." },
      { art: "ja", was: "Fleisch, Fisch, Ei, Milchprodukte, Obst, Gemuese unverarbeitet", warum: "Alles ohne Zutatenliste ist der sichere Teil des Einkaufs." },
    ],
  },
  {
    kicker: "Wo es schiefgeht",
    titel: "Versteckt und uebersehen",
    lead:
      "Die meisten Glutenexpositionen im Alltag kommen nicht von einem Brot, sondern von " +
      "einer Kleinigkeit, an die niemand denkt.",
    punkte: [
      { art: "nein", was: "Sojasauce", warum: "Klassische Sojasauce wird mit Weizen gebraut. Tamari ist meist glutenfrei, aber nur mit Kennzeichnung." },
      { art: "nein", was: "Fritteusen mit Panade", warum: "Pommes aus derselben Fritteuse wie panierte Ware sind nicht glutenfrei. Im Lokal danach fragen." },
      { art: "nein", was: "Gemeinsamer Toaster", warum: "Kruemel reichen. Ein eigener Toaster oder Toastbeutel loest das." },
      { art: "nein", was: "Bindemittel in Sauce und Suppe", warum: "Mehlschwitze, Bruehwuerfel, Sossenbinder, Fertigmarinaden." },
      { art: "vielleicht", was: "Medikamente und Nahrungsergaenzung", warum: "Selten, aber Staerke kann als Hilfsstoff drin sein. In der Apotheke nachfragen lassen." },
      { art: "vielleicht", was: "Kann Spuren enthalten", warum: "Eine freiwillige Angabe des Herstellers, kein Messwert. Was mit dem durchgestrichenen Aehrensymbol oder als glutenfrei ausgelobt ist, unterliegt dagegen der gesetzlichen Grenze von 20 mg Gluten je Kilogramm." },
      { art: "vielleicht", was: "Kuesse, gemeinsame Butter, Brotbrett", warum: "Zu Hause hilft eine eigene Butterdose, ein eigenes Brett und Aufstriche, aus denen nur ein Messer kommt." },
    ],
  },
  {
    kicker: "Bei Lupus",
    titel: "Was die Forschung nahelegt",
    lead:
      "Keine Ernaehrung heilt Lupus, und keine Studie zeigt, dass eine Umstellung Medikamente " +
      "ersetzt. Was es gibt, sind Muster, die in Studien mit weniger Krankheitsaktivitaet, " +
      "besseren Blutfetten und weniger Muedigkeit einhergehen. Die Staerke dieser Belege steht " +
      "im Kapitel Wissen bei jedem Punkt.",
    punkte: [
      { art: "ja", was: "Mediterranes Muster", warum: "Gemuese, Obst, Huelsenfruechte, Olivenoel, Fisch, Nuesse; wenig rotes und verarbeitetes Fleisch. In Beobachtungsstudien bei Lupus mit geringerer Krankheitsaktivitaet verbunden." },
      { art: "ja", was: "Fetter Fisch zweimal die Woche", warum: "Lachs, Makrele, Hering, Sardine. Omega-3 ist bei Lupus in mehreren kleinen kontrollierten Studien untersucht worden." },
      { art: "ja", was: "Genug Eiweiss ueber den Tag", warum: "Haelt Muskeln, und Muskeln sind bei Muedigkeit und unter Kortison das, was zuerst verloren geht." },
      { art: "ja", was: "Ballaststoffe gezielt suchen", warum: "Die glutenfreie Kueche ist von sich aus arm daran. Huelsenfruechte, Leinsamen, Gemuese, Obst mit Schale." },
      { art: "vielleicht", was: "Salz sparsam", warum: "Im Tierversuch foerdert viel Salz entzuendliche T-Zellen. Beim Menschen ist das bei Lupus nicht belegt. Wegen Blutdruck und Nieren trotzdem sinnvoll." },
      { art: "vielleicht", was: "Alkohol", warum: "Mit Methotrexat und mit Blick auf die Leber ein Thema fuer die Sprechstunde, nicht fuer eine App." },
    ],
  },
  {
    kicker: "Vorsicht",
    titel: "Was bei Lupus besser wegbleibt",
    lead:
      "Kurze Liste, und jeder Punkt hat einen konkreten Grund. Alles andere, was im Netz als " +
      "Lupus-Verbot kursiert, haelt einer Pruefung meist nicht stand.",
    punkte: [
      { art: "nein", was: "Alfalfa-Sprossen und Alfalfa-Praeparate", warum: "Enthalten L-Canavanin. Dazu gibt es Fallberichte von Lupus-aehnlichen Bildern und Affenversuche. Die Belege sind alt und duenn, der Verzicht kostet aber nichts, deshalb steht der Punkt in fast jeder Patientenempfehlung." },
      { art: "nein", was: "Immunanregende Praeparate", warum: "Echinacea und aehnliche Mittel, die ausdruecklich das Immunsystem anregen sollen. Bei einer Krankheit, in der das Immunsystem bereits zu viel tut, ist das die falsche Richtung." },
      { art: "vielleicht", was: "Hochdosierte Einzelpraeparate auf eigene Faust", warum: "Vor allem alles, was mit Eisen zu tun hat: Eisen gehoert nur ersetzt, wenn ein Mangel gemessen wurde." },
      { art: "vielleicht", was: "Grapefruit", warum: "Beeinflusst den Abbau mancher Medikamente. Ob das die eigenen betrifft, sagt die Apotheke in einer Minute." },
      { art: "nein", was: "Rauchen", warum: "Erhoeht die Krankheitsaktivitaet, verschlechtert die Wirkung von Hydroxychloroquin und steigert das ohnehin erhoehte Herzrisiko." },
    ],
  },
  {
    kicker: "Beides zusammen",
    titel: "Naehrstoffe, die hier doppelt kippen",
    lead:
      "Zoeliakie schaedigt die Aufnahme, Lupus und seine Behandlung erhoehen den Bedarf oder " +
      "die Verluste. Diese Werte gehoeren gemessen, nicht geraten, und ersetzt wird nur, was fehlt.",
    punkte: [
      { art: "vielleicht", was: "Eisen und Ferritin", warum: "Haeufigster Mangel bei Zoeliakie, und ein sehr haeufiger Grund fuer Muedigkeit, der nichts mit Lupus zu tun hat." },
      { art: "vielleicht", was: "Vitamin D", warum: "Bei Lupus doppelt gefaehrdet: Sonne wird gemieden, Kortison erhoeht den Verlust, und der Darm nimmt bei Zoeliakie schlechter auf." },
      { art: "vielleicht", was: "Vitamin B12 und Folsaeure", warum: "Beide werden im Duenndarm aufgenommen, genau dort, wo Zoeliakie wirkt. Glutenfreies Mehl ist ausserdem selten angereichert." },
      { art: "vielleicht", was: "Kalzium", warum: "Wichtig fuer den Knochen, und der steht bei Zoeliakie und unter Kortison doppelt unter Druck." },
      { art: "vielleicht", was: "Zink und Magnesium", warum: "Werden bei Zoeliakie mit gemessen, wenn Beschwerden bleiben." },
    ],
  },
  {
    kicker: "Ehrlich bleiben",
    titel: "Die Fallen der glutenfreien Kueche",
    lead:
      "Glutenfrei heisst nicht gesund. Fertige glutenfreie Produkte sind oft aus reiner Staerke, " +
      "arm an Ballaststoff und teurer. Das ist ein bekanntes Problem, kein persoenliches Versagen.",
    punkte: [
      { art: "vielleicht", was: "Wenig Ballaststoff", warum: "Reisstaerke, Maisstaerke und Tapioka bringen kaum welche mit. Huelsenfruechte, Leinsamen, Flohsamenschalen und Gemuese gleichen das aus." },
      { art: "vielleicht", was: "Viel schnelle Staerke", warum: "Glutenfreies Weissbrot laesst den Blutzucker steiler steigen als das Original. Mit Eiweiss und Fett kombinieren." },
      { art: "vielleicht", was: "Reis als Hauptgrundlage", warum: "Reis nimmt Arsen aus dem Boden auf. Kein Grund zur Panik, aber ein Grund, zwischen Buchweizen, Hirse, Quinoa, Kartoffel und Mais zu wechseln statt jeden Tag Reis." },
      { art: "vielleicht", was: "Wenig B-Vitamine", warum: "Weizenmehl ist in vielen Laendern angereichert, glutenfreies Mehl meist nicht." },
    ],
  },
];

/* ------------------------------------------------------------------ Rezepte */

INHALT.rezepte = [
  {
    name: "Teller ohne Kochen",
    aufwand: "0 Minuten",
    warum:
      "Fuer die Tage, an denen der Herd zu weit weg ist. Trotzdem Eiweiss, Fett und " +
      "etwas Gruenes, und damit besser als nichts oder als Keks.",
    zutaten: [
      "1 Dose Sardinen oder Makrele in Olivenoel",
      "1 Handvoll Kirschtomaten oder Gurke",
      "Reiswaffeln oder glutenfreies Brot",
      "Olivenoel, Zitrone, Salz",
    ],
    schritte: [
      "Dose oeffnen, auf den Teller.",
      "Gemuese dazu, nicht schneiden wenn es nicht sein muss.",
      "Zitrone darueber, Oel darueber, fertig.",
    ],
    achtung: "Reiswaffeln nur als Beilage, nicht als Grundlage jeden Tag. Sardinen bringen Omega-3, Kalzium und Vitamin D mit.",
  },
  {
    name: "Overnight Oats, glutenfrei",
    aufwand: "3 Minuten am Abend",
    warum: "Am Morgen steht das Fruehstueck schon fertig da. Ballaststoff und Eisen aus Samen.",
    zutaten: [
      "50 g glutenfreie Haferflocken",
      "150 ml Milch oder Pflanzendrink",
      "1 EL Leinsamen geschrotet oder Chiasamen",
      "1 TL Nussmus",
      "Obst",
    ],
    schritte: [
      "Alles in ein Glas, umruehren, zumachen.",
      "Ueber Nacht in den Kuehlschrank.",
      "Morgens Obst darauf.",
    ],
    achtung: "Nur ausdruecklich glutenfreier Hafer. Eine kleine Minderheit mit Zoeliakie vertraegt auch reinen Hafer nicht; nach der Einfuehrung auf Beschwerden achten und das mit der Aerztin besprechen.",
  },
  {
    name: "Linsensuppe",
    aufwand: "25 Minuten, ein Topf",
    warum:
      "Eisen, Ballaststoff und Eiweiss aus einer billigen Zutat. Haelt drei Tage im Kuehlschrank " +
      "und laesst sich portionsweise einfrieren, was an schlechten Tagen mehr wert ist als jedes Rezept.",
    zutaten: [
      "200 g rote Linsen",
      "1 Zwiebel, 2 Knoblauchzehen, 2 Karotten",
      "1 EL Tomatenmark",
      "1 TL Kreuzkuemmel, 1 TL Paprika",
      "1 l glutenfreie Gemuesebruehe",
      "Zitrone, Olivenoel",
    ],
    schritte: [
      "Zwiebel, Knoblauch, Karotte klein schneiden und in Oel anschwitzen.",
      "Tomatenmark und Gewuerze kurz mitroesten.",
      "Linsen und Bruehe dazu, 20 Minuten koecheln.",
      "Mit Zitrone abschmecken. Zitrone ist hier kein Beiwerk: Vitamin C verbessert die Eisenaufnahme aus Pflanzen deutlich.",
    ],
    achtung: "Bruehe pruefen, viele Wuerfel enthalten Weizen.",
  },
  {
    name: "Lachs aus dem Ofen, Gemuese daneben",
    aufwand: "25 Minuten, ein Blech",
    warum: "Omega-3 und Vitamin D in einem Gang, und das Blech ist die ganze Abwasch.",
    zutaten: [
      "2 Lachsfilets",
      "Brokkoli, Paprika, Zucchini, was da ist",
      "Olivenoel, Salz, Zitrone",
      "Kartoffeln in Spalten",
    ],
    schritte: [
      "Ofen auf 200 Grad.",
      "Kartoffeln und Gemuese mit Oel und Salz auf das Blech, 15 Minuten.",
      "Lachs dazulegen, weitere 10 bis 12 Minuten.",
      "Zitrone darueber.",
    ],
  },
  {
    name: "Buchweizen-Bowl",
    aufwand: "20 Minuten",
    warum: "Buchweizen statt Reis, damit nicht jeden Tag Reis auf dem Teller liegt.",
    zutaten: [
      "150 g Buchweizen",
      "1 Dose Kichererbsen",
      "Gurke, Tomate, rote Zwiebel",
      "Joghurt oder Tahin, Zitrone, Olivenoel",
      "Petersilie",
    ],
    schritte: [
      "Buchweizen 12 bis 15 Minuten in Salzwasser kochen, abgiessen, auskuehlen lassen.",
      "Gemuese schneiden, Kichererbsen abspuelen.",
      "Alles mischen, Sauce aus Joghurt oder Tahin mit Zitrone daruebergeben.",
    ],
    achtung: "Buchweizen ist kein Weizen, aber im Regal steht er oft neben Mehl. Auf die Kennzeichnung achten.",
  },
  {
    name: "Kichererbsen-Curry",
    aufwand: "20 Minuten, ein Topf",
    warum: "Eisen und Ballaststoff, und es schmeckt am zweiten Tag besser.",
    zutaten: [
      "2 Dosen Kichererbsen",
      "1 Dose Tomaten, 1 Dose Kokosmilch",
      "Zwiebel, Knoblauch, Ingwer",
      "Currypulver oder Garam Masala",
      "Spinat, frisch oder tiefgekuehlt",
    ],
    schritte: [
      "Zwiebel, Knoblauch, Ingwer anbraten, Gewuerze kurz mitroesten.",
      "Tomaten und Kokosmilch dazu, 10 Minuten koecheln.",
      "Kichererbsen und Spinat unterruehren, fertig ziehen lassen.",
    ],
    achtung: "Fertige Currypasten und Gewuerzmischungen koennen Weizen als Traegerstoff enthalten.",
  },
  {
    name: "Ofengemuese auf Vorrat",
    aufwand: "40 Minuten, davon 5 Arbeit",
    warum:
      "Die eigentliche Antwort auf Muedigkeit ist nicht ein schnelles Rezept, sondern ein " +
      "Kuehlschrank, in dem schon etwas Fertiges steht. Einmal ein Blech, drei Tage Beilage.",
    zutaten: [
      "Was an Gemuese da ist, in grobe Stuecke",
      "Olivenoel, Salz, Kraeuter",
      "Dazu ein Blech Kartoffeln oder Suesskartoffeln",
    ],
    schritte: [
      "Alles auf zwei Bleche, Oel darueber, 200 Grad, 35 bis 40 Minuten.",
      "Kalt in Dosen im Kuehlschrank.",
      "Spaeter mit Ei, Kichererbsen, Fisch oder Joghurt zu einer Mahlzeit machen.",
    ],
  },
  {
    name: "Gruener Aufwecker",
    aufwand: "4 Minuten",
    warum: "Wenn Kauen zu viel ist. Kein Ersatz fuer Mahlzeiten, aber besser als eine ausgelassene.",
    zutaten: [
      "1 Handvoll Spinat",
      "1 Banane, 1 Handvoll Beeren",
      "1 EL Nussmus oder Leinsamen",
      "Joghurt oder Pflanzendrink",
      "Saft einer halben Orange",
    ],
    schritte: ["Alles in den Mixer.", "Orange nicht weglassen, das Vitamin C holt das Eisen aus dem Spinat."],
  },
];

/* -------------------------------------------------------------- Laborwerte */

INHALT.laborwerte = [
  { schluessel: "dsdna", gruppe: "Lupus", name: "Anti-dsDNA", einheit: "IU/ml", bedeutung: "Ein Antikoerper, der bei Lupus oft mit der Krankheitsaktivitaet steigt und faellt. Steigende Werte sind ein Signal, keine Diagnose." },
  { schluessel: "c3", gruppe: "Lupus", name: "Komplement C3", einheit: "g/l", bedeutung: "Faellt typischerweise, wenn Lupus aktiv ist, weil Komplement im Entzuendungsprozess verbraucht wird." },
  { schluessel: "c4", gruppe: "Lupus", name: "Komplement C4", einheit: "g/l", bedeutung: "Wie C3. Beide zusammen werden als Verlauf gelesen, nicht als Einzelwert." },
  { schluessel: "bsg", gruppe: "Entzuendung", name: "Blutsenkung", einheit: "mm/h", bedeutung: "Unspezifisch erhoeht bei Entzuendung. Bei Lupus oft hoch, waehrend CRP normal bleibt." },
  { schluessel: "crp", gruppe: "Entzuendung", name: "CRP", einheit: "mg/l", bedeutung: "Bei Lupus haeufig normal. Ein deutlich erhoehtes CRP lenkt den Verdacht eher auf eine Infektion, was unter Immunsuppression wichtig ist." },
  { schluessel: "kreatinin", gruppe: "Niere", name: "Kreatinin", einheit: "mg/dl", bedeutung: "Mass fuer die Nierenfunktion." },
  { schluessel: "upcr", gruppe: "Niere", name: "Protein-Kreatinin-Quotient im Urin", einheit: "mg/g", bedeutung: "Der wichtigste Frueh-Hinweis auf eine Nierenbeteiligung. Eiweiss im Urin tut nicht weh und faellt nur auf, wenn man danach sucht." },
  { schluessel: "hb", gruppe: "Blutbild", name: "Haemoglobin", einheit: "g/dl", bedeutung: "Blutarmut ist eine der haeufigsten koerperlichen Ursachen von Muedigkeit und bei Lupus wie bei Zoeliakie haeufig." },
  { schluessel: "leuko", gruppe: "Blutbild", name: "Leukozyten", einheit: "/nl", bedeutung: "Bei Lupus oft niedrig, und unter manchen Medikamenten ist der Verlauf ein Sicherheitswert." },
  { schluessel: "thrombo", gruppe: "Blutbild", name: "Thrombozyten", einheit: "/nl", bedeutung: "Koennen bei Lupus niedrig sein." },
  { schluessel: "ttg", gruppe: "Zoeliakie", name: "tTG-IgA", einheit: "U/ml", bedeutung: "Der Verlaufswert der Zoeliakie. Unter konsequent glutenfreier Ernaehrung faellt er ueber Monate. Ein wieder steigender Wert deutet auf Glutenzufuhr hin." },
  { schluessel: "iga", gruppe: "Zoeliakie", name: "Gesamt-IgA", einheit: "g/l", bedeutung: "Wird einmal bestimmt: bei IgA-Mangel waere tTG-IgA falsch niedrig und der Test wertlos." },
  { schluessel: "ferritin", gruppe: "Naehrstoffe", name: "Ferritin", einheit: "ng/ml", bedeutung: "Eisenspeicher. Achtung: Ferritin steigt auch bei Entzuendung, deshalb wird es bei Lupus zusammen mit CRP gelesen." },
  { schluessel: "vitd", gruppe: "Naehrstoffe", name: "Vitamin D, 25-OH", einheit: "ng/ml", bedeutung: "Bei Lupus haeufig niedrig, weil Sonne gemieden wird und Kortison den Verlust erhoeht." },
  { schluessel: "b12", gruppe: "Naehrstoffe", name: "Vitamin B12", einheit: "pg/ml", bedeutung: "Wird im Duenndarm aufgenommen, also genau dort, wo Zoeliakie wirkt." },
  { schluessel: "folat", gruppe: "Naehrstoffe", name: "Folsaeure", einheit: "ng/ml", bedeutung: "Wie B12. Bei Kinderwunsch und unter manchen Medikamenten besonders wichtig." },
  { schluessel: "tsh", gruppe: "Schilddruese", name: "TSH", einheit: "mU/l", bedeutung: "Eine unterfunktionierende Schilddruese macht genau die Muedigkeit, die man dem Lupus zuschreibt. Autoimmune Schilddruesenerkrankungen kommen bei beiden Grunderkrankungen gehaeuft vor." },
];

/* ----------------------------------------------------------- Warnzeichen */

INHALT.warnzeichen = [
  {
    kicker: "Sofort",
    titel: "Notruf oder Notaufnahme",
    punkte: [
      { dringend: "nein", zeichen: "Atemnot oder starker Brustschmerz", warum: "Kann Lungenembolie, Herzbeutel- oder Rippenfellentzuendung bedeuten. Bei Lupus ist das Risiko fuer Gerinnsel erhoeht, besonders mit Antiphospholipid-Antikoerpern." },
      { dringend: "nein", zeichen: "Ploetzliche Schwaeche, Sprach- oder Sehstoerung", warum: "Schlaganfallzeichen. Bei Lupus jeden Alters ernst zu nehmen." },
      { dringend: "nein", zeichen: "Krampfanfall oder starke Verwirrtheit", warum: "Kann eine Beteiligung des Nervensystems sein." },
      { dringend: "nein", zeichen: "Hohes Fieber unter Immunsuppression", warum: "Unter Immunsuppression kann eine Infektion schnell schwer verlaufen, und die uebliche Abwehrreaktion fehlt. Nicht abwarten." },
      { dringend: "nein", zeichen: "Starke Kopfschmerzen mit Nackensteife", warum: "Verdacht auf Hirnhautentzuendung." },
    ],
  },
  {
    kicker: "Diese Woche",
    titel: "Zeitnah in die Sprechstunde",
    punkte: [
      { dringend: "vielleicht", zeichen: "Schaeumender Urin, geschwollene Beine oder Augenlider", warum: "Hinweis auf Eiweiss im Urin und damit auf eine Nierenbeteiligung. Lupusnephritis macht lange keine Beschwerden und wird nur durch Urinkontrolle gefunden." },
      { dringend: "vielleicht", zeichen: "Neuer Ausschlag mit Fieber und Gelenkschmerzen", warum: "Typisches Bild eines Schubs." },
      { dringend: "vielleicht", zeichen: "Deutlich weniger Urin als sonst", warum: "Gehoert zur Niere abgeklaert." },
      { dringend: "vielleicht", zeichen: "Blutungen oder blaue Flecken ohne Anlass", warum: "Kann auf niedrige Thrombozyten hinweisen." },
      { dringend: "vielleicht", zeichen: "Anhaltender Durchfall, Gewichtsverlust trotz glutenfreier Ernaehrung", warum: "Bei Zoeliakie ist die haeufigste Ursache versteckte Glutenzufuhr, aber es gehoert nachgesehen." },
      { dringend: "vielleicht", zeichen: "Neue Sehstoerung unter Hydroxychloroquin", warum: "Die Netzhautkontrolle hat einen festen Rhythmus, eine neue Stoerung wartet nicht darauf." },
    ],
  },
  {
    kicker: "Beim naechsten Termin ansprechen",
    titel: "Wichtig, aber nicht dringend",
    punkte: [
      { dringend: "ja", zeichen: "Muedigkeit, die sich ueber Wochen verschlechtert", warum: "Gehoert abgeklaert: Blutbild, Schilddruese, Eisen, Vitamin D, Schlaf, Stimmung. Nicht alles davon ist Lupus, und das ist eine gute Nachricht, denn vieles davon ist behandelbar." },
      { dringend: "ja", zeichen: "Neue Haarausfaelle, Mundgeschwuere, Lichtempfindlichkeit", warum: "Gehoeren zur Beschreibung der Aktivitaet und sollten dokumentiert sein." },
      { dringend: "ja", zeichen: "Stimmung, Angst, Antrieb", warum: "Bei Lupus haeufig und mit der Muedigkeit eng verwoben. Wird zu selten angesprochen." },
      { dringend: "ja", zeichen: "Kinderwunsch, auch wenn er noch weit weg ist", warum: "Manche Medikamente muessen lange vorher umgestellt werden, und eine Schwangerschaft wird bei Lupus am besten in einer ruhigen Phase geplant." },
    ],
  },
];

/* -------------------------------------------------------------- Fragen */

INHALT.fragen = [
  { frage: "Wie aktiv ist mein Lupus gerade, in Zahlen?", warum: "Es gibt Messinstrumente dafuer. Die eigene Zahl zu kennen macht den Verlauf ueber Jahre lesbar." },
  { frage: "Wann wurde zuletzt der Urin auf Eiweiss geprueft?", warum: "Die Niere meldet sich nicht von selbst." },
  { frage: "Welche Werte sollen wie oft kontrolliert werden, und wer veranlasst das?", warum: "Damit nichts zwischen Hausarztpraxis und Ambulanz liegen bleibt." },
  { frage: "Wann ist die naechste Netzhautkontrolle faellig?", warum: "Bei Hydroxychloroquin gibt es dafuer einen festen Rhythmus." },
  { frage: "Wie hoch ist meine Kortisondosis, und was ist der Plan, sie zu senken?", warum: "Die Leitlinien zielen auf die niedrigstmoegliche Erhaltungsdosis." },
  { frage: "Sind Eisen, Vitamin D, B12, Folsaeure und Kalzium zuletzt gemessen worden?", warum: "Bei Zoeliakie und unter Kortison der wichtigste Nachschub, und eine haeufige Ursache von Muedigkeit." },
  { frage: "Wann war die letzte Knochendichtemessung, und ist eine noetig?", warum: "Zoeliakie und Kortison wirken beide auf den Knochen." },
  { frage: "Wie ist mein tTG-Wert im Verlauf?", warum: "Er zeigt, ob die glutenfreie Ernaehrung wirklich lueckenlos ist." },
  { frage: "Welche Impfungen fehlen, und welche darf ich unter dieser Behandlung nicht bekommen?", warum: "Lebendimpfstoffe sind unter Immunsuppression ein Thema." },
  { frage: "Was mache ich bei Fieber oder einer Infektion, wen rufe ich an?", warum: "Diesen Plan will man haben, bevor man ihn braucht." },
  { frage: "Welche Verhuetung passt zu meiner Situation?", warum: "Bei Antiphospholipid-Antikoerpern gelten fuer oestrogenhaltige Verhuetung besondere Ueberlegungen." },
  { frage: "Darf ich Sport machen, und wie viel, auch wenn es mir schlecht geht?", warum: "Die Antwort ist fast immer ja, aber die Dosis gehoert besprochen, besonders bei Herz-, Lungen- oder Nierenbeteiligung." },
];

/* ------------------------------------------------------------------ Wissen */

INHALT.wissen = [
  {
    kicker: "Zuerst",
    titel: "Wie dieser Text entstanden ist",
    abschnitte: [
      {
        frage: "Woher kommt das hier, und was ist es wert?",
        antwort: [
          "Dieser Text ist eine Orientierung, kein Fachartikel und keine Zweitmeinung. Er ist so geschrieben, " +
            "dass man damit in eine Sprechstunde gehen und bessere Fragen stellen kann.",
          "Bei der Zusammenstellung konnten die Originalarbeiten <b>nicht geoeffnet werden</b>: das Netz, in dem " +
            "dieser Text entstand, laesst medizinische Fachseiten nicht durch. Gesucht werden konnte, gelesen nicht. " +
            "Das hat eine klare Folge, und sie steht hier statt im Kleingedruckten: <b>einzelne Zahlen aus Studien, " +
            "also Prozentwerte, Effektstaerken und Studiengroessen, stehen in diesem Text bewusst fast nirgends.</b> " +
            "Was dasteht, ist die Richtung der Erkenntnis und die Staerke der Belege.",
          "Dafuer stehen bei jedem Kapitel die Originaldokumente mit ihrer Nummer. Mit einer PMID findet man eine " +
            "Arbeit in Sekunden, und jede Aerztin hat Zugang. Dieser Text ist also als Wegweiser zu den Quellen " +
            "gebaut, nicht als Ersatz fuer sie.",
        ],
        staerke: "Einordnung, keine Evidenz.",
      },
      {
        frage: "Was dieser Text ganz sicher nicht kann",
        antwort: [
          "Er kennt deine Werte nicht, deine Organbeteiligung nicht und deine Vorgeschichte nicht. Genau daran " +
            "haengt bei Lupus fast jede Entscheidung.",
          "Er sagt zu keiner Dosis etwas. Nicht, weil das geheim waere, sondern weil eine Dosisangabe ohne die " +
            "Person davor keinen Sinn ergibt und Schaden anrichten kann.",
          "Und er ist ein Stand, kein Abonnement. Bei Lupus hat sich in den letzten Jahren viel bewegt. Wenn " +
            "dieser Text alt wird, wird er nicht falsch, aber unvollstaendig.",
        ],
      },
    ],
  },

  {
    kicker: "Das Hauptthema",
    titel: "Muedigkeit",
    abschnitte: [
      {
        frage: "Warum bin ich so muede, obwohl die Werte gut sind?",
        antwort: [
          "Weil das bei Lupus der Normalfall ist und nicht die Ausnahme. Muedigkeit ist das haeufigste und fuer " +
            "viele das belastendste Symptom, und sie folgt der gemessenen Krankheitsaktivitaet <b>nicht</b>.",
          "Das ist einer der am besten wiederholten Befunde in diesem Feld: die ueblichen Aktivitaetsmasse erklaeren " +
            "nur einen kleinen Teil davon, wie erschoepft jemand ist. Ein ruhiger Befund schliesst schwere " +
            "Muedigkeit also nicht aus. Wer das weiss, muss sich nicht rechtfertigen und sucht an der richtigen Stelle weiter.",
          "Was in Untersuchungen am staerksten mit der Muedigkeit zusammenhaengt, sind <b>Schlafstoerung, Schmerz, " +
            "eine begleitende Fibromyalgie, Stimmung und Angst</b>. Das ist keine Abwertung nach dem Muster " +
            "\"dann ist es eben psychisch\". Es ist das Gegenteil: es benennt Dinge, gegen die sich etwas tun laesst.",
        ],
        staerke: "Stark fuer die Entkopplung von der gemessenen Aktivitaet. Stark fuer Schlaf, Schmerz, Stimmung und Fibromyalgie als Begleiter.",
        quellen: [
          "Arnaud L et al., LEAF-Studie, RMD Open 2023. PMID 38056917",
          "Monahan RC et al., Lupus 2021. PMID 33779389",
          "Ahn GE, Ramsey-Goldman R, Int J Clin Rheumatol 2012. PMC3380630",
          "Cornet A et al., Lupus Sci Med 2021;8:e000469",
        ],
      },
      {
        frage: "Was gehoert abgeklaert, bevor man Muedigkeit dem Lupus zuschreibt?",
        antwort: [
          "Einiges davon ist gut behandelbar, und genau deshalb lohnt sich das Nachsehen. Bei einer Zoeliakie " +
            "dazu gilt das doppelt, weil die Aufnahme im Darm gestoert sein kann.",
        ],
        liste: [
          "<b>Blutbild</b>, wegen Blutarmut. Bei Lupus wie bei Zoeliakie haeufig, und eine der haeufigsten koerperlichen Ursachen von Erschoepfung.",
          "<b>Eisen und Ferritin</b>. Bei Zoeliakie der haeufigste Mangel ueberhaupt. Achtung: Ferritin steigt bei Entzuendung, es wird zusammen mit dem CRP gelesen.",
          "<b>Schilddruese</b>. Eine Unterfunktion macht genau dieses Bild, und autoimmune Schilddruesenerkrankungen kommen bei beiden Grunderkrankungen gehaeuft vor.",
          "<b>Vitamin D, B12, Folsaeure</b>.",
          "<b>Nierenwerte und Urin</b>, weil eine Nierenbeteiligung lange stumm bleibt.",
          "<b>Schlaf</b>. Schlechter Schlaf ist bei Lupus sehr haeufig und in Untersuchungen der staerkste einzelne Begleiter der Muedigkeit.",
          "<b>Stimmung und Angst</b>. Depression und Angst sind bei Lupus deutlich haeufiger als in der Allgemeinbevoelkerung.",
          "<b>Medikamente</b>, als Thema fuer die Sprechstunde.",
        ],
        staerke: "Diese Liste ist klinische Praxis und Leitlinienlogik, keine einzelne Studie.",
      },
      {
        frage: "Was hilft wirklich gegen die Muedigkeit?",
        antwort: [
          "Die ehrliche Antwort hat zwei Teile. Erstens: die beste belegte Einzelmassnahme ist <b>koerperliche " +
            "Aktivitaet</b>, und zwar angepasst und ueber Wochen aufgebaut. Zweitens: die Belege dafuer sind " +
            "kleiner und widerspruechlicher, als man es in Ratgebern liest.",
          "Konkret: eine Cochrane-Uebersicht von 2023 kommt zu geringer Ergebnissicherheit und findet fuer " +
            "Muedigkeit keinen statistisch gesicherten Nutzen. Eine fruehere Zusammenfassung von 2017 findet " +
            "dagegen einen mittleren Nutzen fuer Muedigkeit, Ausdauer, Stimmung und Funktion. " +
            "Beide lesen fast dieselben Studien und kommen zu verschiedenen Schluessen, weil sie unterschiedlich " +
            "zusammenrechnen. Die neuere von beiden ist die vorsichtigere, und das gehoert dazugesagt.",
          "Was man daraus mitnehmen kann, ohne zu uebertreiben: Bewegung ist <b>bei stabiler Erkrankung sicher</b>, " +
            "sie verbessert die Ausdauer verlaesslich, und sie hilft der Muedigkeit wahrscheinlich etwas. Das ist " +
            "mehr, als fuer jede andere nicht medikamentoese Massnahme bei Lupus gezeigt ist.",
          "Die europaeische Fachgesellschaft empfiehlt bei entzuendlich-rheumatischen Erkrankungen ausdruecklich, " +
            "Muedigkeit zu erfassen und angepasste Bewegungsangebote zu machen.",
        ],
        staerke: "Gering bis mittel. Widerspruechliche Zusammenfassungen, kleine und meist unverblindete Studien. Fuer Ausdauer klarer als fuer Muedigkeit.",
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
    kicker: "Die haeufigste Frage",
    titel: "Sport, auch im Schub?",
    abschnitte: [
      {
        frage: "Darf ich waehrend eines aktiven Schubs Sport machen?",
        antwort: [
          "Hier ist Genauigkeit wichtiger als eine griffige Antwort, deshalb zuerst die Faktenlage: <b>es gibt " +
            "dazu keine Studie.</b> Praktisch alle Bewegungsstudien bei Lupus haben Menschen mit ruhiger oder " +
            "niedriger Krankheitsaktivitaet eingeschlossen und aktive Erkrankung ausdruecklich ausgeschlossen. " +
            "Die beruhigende Aussage \"Bewegung verschlechtert den Lupus nicht\" ist eine Aussage ueber stabile " +
            "Phasen. Auf einen akuten Schub laesst sie sich nicht uebertragen.",
          "Was es gibt, ist eine internationale Konsensempfehlung von 2024. Sie sagt sinngemaess: waehrend eines " +
            "Schubs ist <b>Vorsicht</b> geboten und es gehoert neu geprueft, ob gerade etwas dagegen spricht. " +
            "Bei einem Schub mit entzuendeten Gelenken sollen genau diese Gelenke nicht belastet werden. Wer " +
            "ruhige oder milde Erkrankung hat, soll sich an die allgemeinen Bewegungsempfehlungen halten.",
          "Uebersetzt in den Alltag heisst das nicht \"Bett\", und es heisst nicht \"durchziehen\". Es heisst: " +
            "im Schub kleiner werden statt aufhoeren. Spazieren statt Intervalle, Dehnen und leichte Bewegung " +
            "statt Krafttraining, entzuendete Gelenke auslassen. Und: ein neuer Schub gehoert gemeldet, bevor man " +
            "das Trainingsprogramm anpasst, nicht danach.",
          "Eine Einschraenkung, die in derselben Empfehlung steht und leicht vergessen wird: bei Herz-, Lungen- " +
            "oder Nierenbeteiligung, unter Gerinnungshemmung oder bei Knochennekrose gehoert die Belastung " +
            "aerztlich abgeklaert, bevor sie gesteigert wird.",
        ],
        staerke: "Fuer den Schub: nur Expertenkonsens, keine Studien. Fuer stabile Phasen: mittel.",
        quellen: [
          "Blaess J et al., RMD Open 2024;10:e004171. DOI 10.1136/rmdopen-2024-004171",
          "Parodis I et al., EULAR, nicht medikamentoese Behandlung, Ann Rheum Dis 2024;83:720-729. PMID 37433575",
        ],
      },
      {
        frage: "Wie faengt man an, wenn schon Treppensteigen anstrengt?",
        antwort: [
          "Mit einer Menge, die sich zu klein anfuehlt, und mit der man auch am schlechten Tag durchkommt. " +
            "Das ist keine Bescheidenheit, sondern die Methode: der haeufigste Grund, warum Bewegung bei " +
            "Erschoepfung scheitert, ist ein guter Tag, an dem zu viel gemacht wird, gefolgt von drei Tagen im Bett.",
          "In den Studien, die etwas gezeigt haben, waren die Programme meist <b>acht bis zwoelf Wochen</b> lang, " +
            "von mittlerer Intensitaet und begleitet. Begleitet heisst hier: jemand schaut drauf. Das war in den " +
            "Auswertungen einer der Unterschiede zwischen Programmen, die wirkten, und solchen, die nicht wirkten.",
          "Ein brauchbarer Einstieg: eine feste, kleine Menge taeglich, dieselbe an guten und an schlechten Tagen, " +
            "und erst nach ein bis zwei Wochen ohne Nachwirkung ein kleines bisschen mehr. Im Verlauf dieser App " +
            "sieht man nach ein paar Wochen, ob die Muedigkeit am Tag nach einer Einheit steigt.",
        ],
        staerke: "Mittel fuer Dauer und Intensitaet der Programme. Das Vorgehen selbst ist Praxis, nicht Studienergebnis.",
      },
      {
        frage: "Was ist mit Pacing, also Kraefteeinteilung?",
        antwort: [
          "Pacing heisst, die Kraft ueber den Tag einzuteilen und geplant zu pausieren, <b>bevor</b> nichts mehr geht, " +
            "statt bis zum Einbruch weiterzumachen.",
          "Ehrlich dazu: fuer Lupus gibt es dafuer kaum Untersuchungen, nur kleine Schulungsprogramme und eine " +
            "laufende Pilotstudie. Die gute Studienlage zu Pacing stammt aus anderen Erkrankungen, vor allem ME/CFS " +
            "und Long Covid, und ist auch dort gemischt. Ob Lupus-Muedigkeit sich so verhaelt wie die dortige, ist " +
            "nicht geklaert.",
          "Trotzdem steht es hier, weil es billig, ungefaehrlich und umkehrbar ist. Es zwei Wochen zu versuchen und " +
            "im Verlauf nachzusehen, ob die schlechten Tage weniger werden, kostet nichts.",
        ],
        staerke: "Bei Lupus schwach. Uebertragung aus anderen Erkrankungen, dort gemischte Ergebnisse.",
      },
    ],
  },

  {
    kicker: "Ernaehrung",
    titel: "Was bei Lupus wirklich belegt ist",
    abschnitte: [
      {
        frage: "Gibt es eine Lupus-Diaet?",
        antwort: [
          "Nein. Es gibt keine Ernaehrungsform, fuer die gezeigt waere, dass sie Lupus behandelt oder Medikamente " +
            "ersetzt. Wer das behauptet, verkauft etwas.",
          "Was es gibt, sind Muster. Am haeufigsten untersucht ist das <b>mediterrane</b>: viel Gemuese, Obst, " +
            "Huelsenfruechte, Olivenoel, Fisch, Nuesse, wenig rotes und verarbeitetes Fleisch. In Querschnitts" +
            "untersuchungen bei Lupus geht es mit geringerer Krankheitsaktivitaet und besseren Herzwerten einher.",
          "Das Wort Querschnitt ist wichtig: dabei wird zu einem Zeitpunkt geschaut, wer wie isst und wie es ihm " +
            "geht. Ob das Essen den Unterschied macht oder ob es Menschen mit ruhigerer Erkrankung leichter faellt, " +
            "so zu essen, kann eine solche Untersuchung nicht trennen. Eine abgeschlossene Interventionsstudie mit " +
            "Krankheitsaktivitaet als Ziel gibt es bei Lupus nicht.",
          "Es gibt trotzdem einen guten Grund, genau dorthin zu gehen: das <b>Herz-Kreislauf-Risiko</b> ist bei " +
            "jungen Frauen mit Lupus deutlich erhoeht, und das mediterrane Muster ist fuer dieses Ziel so gut " +
            "belegt wie kaum etwas anderes in der Ernaehrungsmedizin.",
        ],
        staerke: "Fuer Lupus-Aktivitaet: schwach, nur beobachtend. Fuer Herz und Gefaesse: gut, aber aus der Allgemeinbevoelkerung.",
      },
      {
        frage: "Omega-3, Vitamin D, Kurkuma und der Rest",
        antwort: [
          "<b>Omega-3</b> aus Fisch oder Oel ist bei Lupus in mehreren kleinen kontrollierten Studien untersucht " +
            "worden, mit Hinweisen auf etwas geringere Krankheitsaktivitaet und bessere Gefaessfunktion. Die " +
            "Studien sind klein und nicht einheitlich. Zweimal fetter Fisch die Woche ist eine vernuenftige " +
            "Umsetzung, die nichts kaputtmachen kann.",
          "<b>Vitamin D</b> ist bei Lupus haeufig niedrig, weil Sonne gemieden wird und Kortison den Verlust " +
            "erhoeht; bei Zoeliakie kommt die schlechtere Aufnahme dazu. Dass ein Mangel ausgeglichen gehoert, ist " +
            "unstrittig. Dass ein Ausgleich die Muedigkeit bessert, ist es nicht: die zusammengefassten " +
            "Behandlungsstudien dazu umfassen zusammen nur wenige Dutzend Teilnehmerinnen. Also: messen, bei Mangel " +
            "ausgleichen, keine grossen Hoffnungen daran haengen.",
          "<b>Kurkuma, Resveratrol, NAC, DHEA</b> sind bei Lupus untersucht worden, in kleinen Studien mit " +
            "uneinheitlichen Ergebnissen. Nichts davon ist etabliert.",
          "Wichtiger als jedes einzelne Praeparat: alles, was geschluckt wird, gehoert auf die Medikamentenliste " +
            "und in die Sprechstunde. Nahrungsergaenzung ist kein rechtsfreier Raum, sie hat Wechselwirkungen.",
        ],
        staerke: "Omega-3: schwach bis mittel, kleine Studien. Vitamin D gegen Muedigkeit: sehr schwach. Uebrige Praeparate: schwach.",
      },
      {
        frage: "Und das mit den Alfalfa-Sprossen?",
        antwort: [
          "Alfalfa, also Luzerne, enthaelt L-Canavanin. Dazu gibt es aeltere Fallberichte von Lupus-aehnlichen " +
            "Bildern und Versuche an Affen. Es ist der eine Punkt, der seit Jahrzehnten auf jeder Lupus-Liste steht.",
          "Ehrlich eingeordnet: das ist eine duenne, alte Belegkette, kein Beweis. Der Verzicht auf Alfalfa-Sprossen " +
            "kostet aber nichts, deshalb steht er auch hier. Bei allem anderen lohnt sich Skepsis: viele " +
            "Verbotslisten im Netz sind nicht mit dieser Frage entstanden, sondern durch Abschreiben.",
          "Ein Punkt mit besserer Begruendung: <b>Praeparate, die ausdruecklich das Immunsystem anregen sollen</b>, " +
            "etwa Echinacea. Bei einer Erkrankung, in der das Immunsystem sich gegen den eigenen Koerper richtet, " +
            "ist das die falsche Richtung. Auch hier ist die Belegkette duenn, aber die Ueberlegung ist stimmig.",
        ],
        staerke: "Schwach. Fallberichte und Tierversuche. Als Vorsichtsmassnahme vertretbar, nicht als Tatsache.",
      },
    ],
  },

  {
    kicker: "Zoeliakie",
    titel: "Was streng sein muss und was nicht",
    abschnitte: [
      {
        frage: "Wie streng ist streng?",
        antwort: [
          "Die glutenfreie Ernaehrung ist bei Zoeliakie die Behandlung, lebenslang, und das Ziel ist nicht nur " +
            "Beschwerdefreiheit, sondern die Heilung der Darmschleimhaut. Beschwerden sind ein schlechter Messwert: " +
            "ein Teil der Menschen hat trotz Schaden keine.",
          "Die Grenze von 20 Milligramm Gluten je Kilogramm fuer die Kennzeichnung glutenfrei beruht darauf, dass " +
            "bis etwa 10 Milligramm Gluten am Tag fuer die grosse Mehrheit unschaedlich sein duerften. Die " +
            "Datengrundlage dafuer ist nach Angabe der Fachgremien selbst begrenzt, und die richtige Schwelle wird " +
            "weiter diskutiert.",
          "Bemerkenswert und wenig bekannt: Messungen bei Menschen, die sich fuer streng glutenfrei halten, finden " +
            "regelmaessig deutlich mehr unabsichtliche Glutenzufuhr, als diese Schwelle vorsieht. Das ist kein " +
            "Vorwurf an irgendwen, sondern ein Hinweis darauf, wo man suchen muss, wenn es nicht besser wird.",
        ],
        staerke: "Hoch fuer die Behandlung an sich. Schwach bis mittel fuer die genaue Schwelle.",
        quellen: [
          "ACG-Leitlinie, Am J Gastroenterol 2023. PMID 36602836",
          "Ludvigsson JF et al., BSG, Gut 2014;63:1210-1228. PMID 24917550",
          "ESsCD 2025, United European Gastroenterol J. PMID 40999951 und PMID 41831197",
        ],
      },
      {
        frage: "Was in der Kueche zaehlt wirklich, und was wird ueberschaetzt?",
        antwort: [
          "Hier hat die Forschung etwas Ueberraschendes ergeben, und es macht den Alltag leichter. Gemessen wurde, " +
            "wie viel Gluten bei ueblichen Kuechenhandgriffen tatsaechlich uebergeht.",
          "<b>Wichtiger als gedacht:</b> gemeinsames Frittieroel und gemeinsames Kochwasser. Bei Pommes aus einer " +
            "Fritteuse, in der auch Paniertes gebacken wird, lag ein Teil der Proben deutlich ueber der Grenze. " +
            "Nudelwasser, in dem vorher glutenhaltige Nudeln gekocht wurden, ebenfalls; kurzes Abspuelen der " +
            "gekochten Nudeln brachte die Werte wieder darunter.",
          "<b>Weniger schlimm als befuerchtet:</b> der gemeinsame Toaster und gemeinsames Besteck. In den " +
            "Messungen blieb glutenfreies Brot aus einem benutzten Toaster unter der Grenze, sogar mit sichtbaren " +
            "Kruemeln im Fach, und ein Messer, das vorher an glutenhaltigem Gebaeck war, uebertrug nichts Messbares.",
          "Diese Studien sind klein und nicht verblindet, also kein Freibrief. Aber die Richtung ist brauchbar: " +
            "die Energie gehoert zu Fritteuse, Kochwasser, Mehlstaub beim Backen und zu Zutatenlisten, und weniger " +
            "zu einer Angst vor jedem gemeinsamen Loeffel. Bei einer Autoimmunerkrankung ist auch das ein Argument: " +
            "Kraft, die nicht in unnoetige Sorge geht, steht woanders zur Verfuegung.",
        ],
        staerke: "Schwach bis mittel. Kleine, nicht verblindete Messstudien, aber die einzigen Zahlen, die es dazu gibt.",
        quellen: [
          "Weisbrod VM et al., Gastroenterology 2020",
          "Gluten-Free Foods Cooked in Shared Fryers With Wheat, Front Nutr 2021. DOI 10.3389/fnut.2021.652039",
          "Syage JA et al., Am J Clin Nutr 2018",
        ],
      },
      {
        frage: "Reicht der tTG-Wert, um zu wissen, ob alles gut ist?",
        antwort: [
          "Nein, und das ist eine der wichtigsten Einzelheiten in diesem ganzen Text. Der tTG-Wert wurde als " +
            "<b>Suchtest</b> entwickelt, nicht als Verlaufstest fuer die Heilung der Schleimhaut.",
          "In einer Zusammenfassung mehrerer Untersuchungen erkannte ein normaler tTG-Wert unter glutenfreier " +
            "Ernaehrung nur etwa die Haelfte der Faelle, in denen die Schleimhaut noch geschaedigt war. Ein " +
            "unauffaelliger Wert ist also eine gute Nachricht, aber kein Beweis.",
          "Praktisch heisst das: wenn Beschwerden bleiben oder Werte wie Eisen und Vitamin D nicht hochkommen, " +
            "ist \"der tTG ist normal\" kein Grund, die Suche zu beenden. Dann gehoert eine genaue " +
            "Ernaehrungsanamnese bei einer erfahrenen Ernaehrungsfachkraft dazu, und je nach Lage weitere Diagnostik.",
          "Die haeufigste Ursache, wenn es unter glutenfreier Ernaehrung nicht besser wird, ist uebrigens nicht " +
            "eine seltene Komplikation, sondern versteckt zugefuehrtes Gluten.",
        ],
        staerke: "Mittel bis hoch fuer die begrenzte Aussagekraft der Serologie. Aus einer Zusammenfassung mehrerer Studien.",
        quellen: [
          "Meta-Analyse zu tTG und Endomysium-Antikoerpern bei persistierender Zottenatrophie, Gastroenterology 2017",
          "Leitlinien zur Verlaufskontrolle, Nat Rev Gastroenterol Hepatol 2023. PMID 38110546",
        ],
      },
      {
        frage: "Hafer, ja oder nein?",
        antwort: [
          "Eine Zusammenfassung der Studien fand keinen Hinweis, dass ausdruecklich glutenfreier Hafer Beschwerden, " +
            "Gewebe, Immunreaktion oder Serologie verschlechtert. Die Ergebnissicherheit war dabei gering.",
          "Das Hauptproblem ist nicht der Hafer, sondern die Verarbeitung: gewoehnlicher Hafer ist oft stark mit " +
            "Weizen verunreinigt, reiner Hafer dagegen praktisch nicht. Deshalb gilt: nur als glutenfrei " +
            "gekennzeichneter Hafer.",
          "Dazu kommt eine kleine Minderheit, die auf Hafereiweiss selbst reagiert. Wie gross diese Gruppe ist, " +
            "ist nicht sauber bestimmt; die oft zitierte Zahl stammt aus einer Untersuchung, in die sich gezielt " +
            "Menschen mit vermuteter Haferunvertraeglichkeit gemeldet hatten, und ist damit zu hoch fuer die " +
            "Allgemeinheit.",
          "Vorgehen mit Verstand: glutenfreien Hafer einfuehren, wenn es gerade ruhig ist, nicht gleichzeitig mit " +
            "anderen Umstellungen, und im Tagebuch sehen, was passiert.",
        ],
        staerke: "Mittel fuer die Sicherheit von reinem Hafer, die Ergebnissicherheit der Zusammenfassung war gering.",
        quellen: ["Pinto-Sanchez MI et al., Gastroenterology 2017;153:395-409. PMID 28431885"],
      },
      {
        frage: "Bringt glutenfrei etwas gegen den Lupus, wenn man gar keine Zoeliakie haette?",
        antwort: [
          "Dafuer gibt es keinen belastbaren Beleg. Das ist hier nur der Vollstaendigkeit halber erwaehnt, weil die " +
            "Frage in Foren staendig auftaucht.",
          "In diesem Fall ist sie ohnehin gegenstandslos: bei gesicherter Zoeliakie wird glutenfrei gegessen, " +
            "unabhaengig davon, was es fuer den Lupus tut.",
        ],
        staerke: "Kein belastbarer Beleg.",
      },
    ],
  },

  {
    kicker: "Beides zusammen",
    titel: "Wo sich Lupus und Zoeliakie in die Quere kommen",
    abschnitte: [
      {
        frage: "Haengen die beiden ueberhaupt zusammen?",
        antwort: [
          "Autoimmunerkrankungen treten gehaeuft gemeinsam auf, und Zoeliakie wird bei Lupus haeufiger gefunden " +
            "als in der Allgemeinbevoelkerung. Wie viel haeufiger, dazu gehen die veroeffentlichten Schaetzungen " +
            "weit auseinander, und deshalb steht hier bewusst keine Zahl.",
          "Fuer den Alltag ist die Zahl auch nicht wichtig. Wichtig ist, dass beide Erkrankungen dieselben Dinge " +
            "angreifen: die Aufnahme von Naehrstoffen, den Knochen und die Kraft.",
        ],
        staerke: "Schaetzungen widersprechen sich deutlich. Der Zusammenhang selbst ist etabliert.",
      },
      {
        frage: "Der Knochen, mit 26",
        antwort: [
          "Das ist der Punkt, der in diesem Alter am leichtesten untergeht und am spaetesten weh tut. Zwei Dinge " +
            "treffen zusammen: Zoeliakie stoert ueber Jahre die Aufnahme von Kalzium und Vitamin D, und Kortison " +
            "wirkt direkt gegen den Knochen.",
          "Die amerikanische Leitlinie zur kortisonbedingten Osteoporose sagt etwas, das gerade fuer junge Frauen " +
            "zaehlt: unter 40 Jahren laesst sich das Frakturrisiko mit dem ueblichen Rechner <b>nicht</b> " +
            "abschaetzen, weil der dafuer nicht gemacht ist. Statt einer Rechnung braucht es also eine Messung.",
          "Was in jedem Fall dazugehoert: ausreichend Kalzium und Vitamin D, Bewegung mit Gewicht auf den Beinen, " +
            "nicht rauchen. Und die Frage, ob und wann eine Knochendichtemessung sinnvoll ist, gehoert gestellt, " +
            "nicht abgewartet.",
        ],
        staerke: "Leitlinienbasiert.",
        quellen: ["Humphrey MB et al., ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022. DOI 10.1002/art.42646"],
      },
      {
        frage: "Was, wenn die Muedigkeit trotz strenger glutenfreier Ernaehrung bleibt?",
        antwort: [
          "Das kommt vor und ist gut beschrieben. Die Reihenfolge, in der gesucht wird, ist meistens diese:",
        ],
        liste: [
          "Versteckte Glutenzufuhr. Mit Abstand die haeufigste Erklaerung, und sie findet man am besten mit einer erfahrenen Ernaehrungsfachkraft, nicht allein.",
          "Naehrstoffe: Eisen, B12, Folsaeure, Vitamin D, Zink.",
          "Schilddruese.",
          "Die zweite Erkrankung, also Lupus selbst, samt Nieren und Blutbild.",
          "Schlaf, Stimmung, Schmerz, Fibromyalgie.",
          "Erst danach die seltenen Dinge.",
        ],
        staerke: "Klinische Praxis und Leitlinienlogik.",
      },
    ],
  },

  {
    kicker: "Behandlung",
    titel: "Was heute Standard ist",
    abschnitte: [
      {
        frage: "Woran orientiert sich die Behandlung heute?",
        antwort: [
          "An zwei Grundsaetzen, die in den aktuellen europaeischen Empfehlungen stehen. Erstens: " +
            "<b>Hydroxychloroquin fuer alle</b>, sofern nichts dagegen spricht. Zweitens: <b>Kortison so niedrig " +
            "wie moeglich</b>, als Ueberbrueckung gedacht und nicht als Dauerloesung, mit dem Ziel, es im " +
            "Erhaltungsbetrieb sehr niedrig zu halten oder ganz zu beenden.",
          "Das ist der Grund, warum heute frueher weitere Medikamente dazukommen: nicht, weil die Erkrankung " +
            "schlimmer waere, sondern damit das Kortison heruntergehen kann. Dafuer gibt es inzwischen mehr " +
            "Moeglichkeiten als noch vor wenigen Jahren, auch neu zugelassene.",
          "Das erklaerte Behandlungsziel ist Remission oder ein Zustand niedriger Aktivitaet. Beides ist definiert " +
            "und messbar. Danach zu fragen lohnt sich: es macht aus \"wie geht es Ihnen\" eine Groesse, die ueber " +
            "Jahre vergleichbar bleibt.",
          "<b>Keine Dosis aus dieser App.</b> Was hier steht, ist der Rahmen, in dem die Sprechstunde entscheidet.",
        ],
        staerke: "Leitlinien, hoechste verfuegbare Ebene.",
        quellen: [
          "Fanouriakis A et al., EULAR 2023, Ann Rheum Dis 2024;83:15-29. PMID 37827694",
          "ACR-Leitlinie zur Behandlung des SLE 2025. PMID 41182321",
          "EULAR 2025, Lupus mit Nierenbeteiligung. PMID 41107121",
        ],
      },
      {
        frage: "Warum die Augenkontrolle bei Hydroxychloroquin?",
        antwort: [
          "Weil das Medikament in seltenen Faellen die Netzhaut schaedigen kann, und weil dieser Schaden lange " +
            "keine Beschwerden macht. Deshalb wird er gesucht und nicht abgewartet.",
          "Das Risiko haengt vor allem an der Dosis im Verhaeltnis zum Koerpergewicht und an der Behandlungsdauer; " +
            "eingeschraenkte Nierenfunktion und bestimmte andere Medikamente erhoehen es. Deshalb gibt es eine " +
            "Obergrenze bezogen auf das <b>tatsaechliche</b> Koerpergewicht.",
          "Zum Ablauf: eine Untersuchung zu Beginn, danach regelmaessige Kontrollen mit Verfahren, die die " +
            "Netzhaut abbilden. Die genauen Abstaende unterscheiden sich zwischen Laendern und wurden zuletzt " +
            "ueberarbeitet. Die praktische Frage an die Sprechstunde lautet deshalb nicht \"wie oft ist ueblich\", " +
            "sondern \"wann ist meine naechste faellig\".",
          "Gut zu wissen: wird ein beginnender Schaden frueh gefunden und das Medikament beendet, schreitet er " +
            "meist nicht weiter fort. Genau deswegen ist die Kontrolle kein Ritual, sondern der ganze Punkt.",
        ],
        staerke: "Leitlinien der Augenheilkunde. Die genauen Intervalle unterscheiden sich je nach Land und Fassung.",
        quellen: [
          "AAO, Empfehlungen zum Screening auf Hydroxychloroquin-Retinopathie, Ophthalmology. PMID 41232611",
          "Royal College of Ophthalmologists, Monitoring-Empfehlungen 2020. PMID 33423043",
        ],
      },
      {
        frage: "Warum immer wieder Urin?",
        antwort: [
          "Weil die Nierenbeteiligung bei Lupus der Organschaden ist, der am meisten kostet und am laengsten " +
            "stumm bleibt. Sie tut nicht weh. Sie zeigt sich als Eiweiss im Urin, lange bevor man etwas merkt.",
          "Die amerikanische Leitlinie zur Lupusnephritis spricht deshalb eine starke Empfehlung aus, auch bei " +
            "Menschen <b>ohne</b> bekannte Nierenbeteiligung regelmaessig auf Eiweiss im Urin zu untersuchen.",
          "Wenn man aus diesem ganzen Kapitel eine einzige Sache mitnimmt, dann diese: der Urintest ist der " +
            "guenstigste und wirksamste Test in der ganzen Betreuung. Er gehoert nicht vergessen, wenn es einem gut geht.",
        ],
        staerke: "Starke Leitlinienempfehlung.",
        quellen: ["ACR-Leitlinie zur Lupusnephritis 2024. DOI 10.1002/art.43212"],
      },
    ],
  },

  {
    kicker: "Mit 26",
    titel: "Was in diesem Alter dazugehoert",
    abschnitte: [
      {
        frage: "Kinderwunsch, auch wenn er nicht aktuell ist",
        antwort: [
          "Dieses Thema gehoert frueh angesprochen, gerade wenn es noch nicht ansteht. Der Grund ist einfach: " +
            "einige bei Lupus gebraeuchliche Medikamente duerfen in einer Schwangerschaft nicht genommen werden " +
            "und muessen <b>Monate vorher</b> umgestellt werden. Eine ungeplante Schwangerschaft unter einem " +
            "solchen Medikament ist das Szenario, das alle vermeiden wollen.",
          "Der zweite Grund: eine Schwangerschaft verlaeuft bei Lupus deutlich besser, wenn sie in einer ruhigen " +
            "Phase beginnt. Das ist eines der wenigen Dinge, die sich wirklich planen lassen.",
          "Zwei Blutwerte sind dafuer entscheidend und sollten bekannt sein, unabhaengig von jeder Planung: " +
            "<b>Anti-Ro/SSA</b> und die <b>Antiphospholipid-Antikoerper</b> einschliesslich Lupus-Antikoagulans. " +
            "Sie aendern die Betreuung und die Wahl der Verhuetung. Wer seinen Status nicht kennt, sollte danach fragen.",
          "Hydroxychloroquin wird in der Schwangerschaft in aller Regel fortgefuehrt, nicht abgesetzt. Das " +
            "ueberrascht viele.",
        ],
        staerke: "Leitlinien.",
        quellen: [
          "Sammaritano LR et al., ACR-Leitlinie zur reproduktiven Gesundheit 2020, Arthritis Rheumatol 2020;72:529-556. PMID 32090466",
          "Andreoli L et al., EULAR, Frauengesundheit bei SLE und APS, Ann Rheum Dis 2017;76:476-485",
        ],
      },
      {
        frage: "Verhuetung",
        antwort: [
          "Der entscheidende Punkt: bei nachgewiesenen <b>Antiphospholipid-Antikoerpern</b> wird von " +
            "oestrogenhaltiger Verhuetung abgeraten, weil Oestrogen das Thromboserisiko erhoeht und dieses Risiko " +
            "hier ohnehin schon erhoeht ist. Empfohlen werden stattdessen Spirale oder reine Gestagenpraeparate.",
          "Weil zugleich eine zuverlaessige Verhuetung wichtig ist, solange Medikamente im Spiel sind, die in einer " +
            "Schwangerschaft schaden wuerden, ist das keine Nebenfrage.",
        ],
        staerke: "Starke Leitlinienempfehlung.",
        quellen: ["Sammaritano LR et al., ACR 2020. PMID 32090466"],
      },
      {
        frage: "Impfungen und Infekte",
        antwort: [
          "Unter Immunsuppression gilt: <b>Totimpfstoffe</b> sind moeglich und werden ausdruecklich empfohlen, " +
            "<b>Lebendimpfstoffe</b> sollen so weit wie moeglich vermieden werden. Am besten wird der Impfstatus " +
            "geprueft und aufgefuellt, bevor eine immununterdrueckende Behandlung beginnt, und in einer ruhigen Phase.",
          "Der zweite Teil ist praktischer: <b>Fieber unter Immunsuppression ist kein Abwarten-Thema.</b> Die " +
            "uebliche Abwehrreaktion kann fehlen, und aus dem Blutbild allein laesst sich ein Infekt nicht immer " +
            "von einem Schub unterscheiden. Das ist genau die Situation, fuer die man vorher einen Plan und eine " +
            "Telefonnummer haben will.",
        ],
        staerke: "Leitlinien.",
        quellen: [
          "Furer V et al., EULAR-Impfempfehlungen 2019, Ann Rheum Dis 2020;79:39-52. PMID 31413005",
          "Bass AR et al., ACR-Impfleitlinie 2022. PMID 36597813",
        ],
      },
      {
        frage: "Sonne und Rauchen",
        antwort: [
          "Zur <b>Sonne</b> gibt es etwas Handfestes: in einer kontrollierten Untersuchung, in der Haut gezielt " +
            "mit UV bestrahlt wurde, entstanden in den unbehandelten Feldern typische Lupus-Hautveraenderungen, " +
            "in den mit einem hohen Breitbandschutz behandelten Feldern bei keiner einzigen Teilnehmerin. Das ist " +
            "fuer diese Frage eine ungewoehnlich klare Studie.",
          "Wichtig dabei: gezeigt wurde die Verhinderung von <b>Hautveraenderungen</b> durch UV, nicht die " +
            "Verhinderung von Schueben insgesamt. Und der Schutz muss UVA und UVB abdecken.",
          "Zum <b>Rauchen</b>: Rauchen ist mit hoeherem Erkrankungsrisiko verbunden, und es verschlechtert " +
            "messbar die Wirksamkeit von Hydroxychloroquin an der Haut. Ein Detail, das Mut macht: in der " +
            "Auswertung hatten <b>ehemalige</b> Raucherinnen kein erhoehtes Risiko mehr. Aufhoeren wirkt also.",
        ],
        staerke: "Fuer den Sonnenschutz: gut, kontrollierte Studie am Menschen. Fuer Rauchen: Zusammenfassung mehrerer Studien.",
        quellen: [
          "Kuhn A et al., J Am Acad Dermatol 2011;64:37-48. PMID 21167404",
          "Systematische Uebersicht und Metaanalyse zum Rauchen bei SLE, Autoimmun Rev 2019. PMID 31520802",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------- Ueberwachung */

INHALT.ueberwachung = [
  {
    titel: "Augen, unter Hydroxychloroquin",
    text: [
      "Eine Untersuchung zu Beginn der Behandlung und danach regelmaessige Kontrollen mit bildgebenden Verfahren " +
        "der Netzhaut. Die Abstaende unterscheiden sich je nach Land und Risikoprofil; die Dosis bezogen auf das " +
        "tatsaechliche Koerpergewicht, die Behandlungsdauer und die Nierenfunktion spielen dabei die Hauptrolle.",
      "Frueh gefunden schreitet ein Schaden nach dem Absetzen meist nicht weiter fort. Das ist der Grund fuer die Kontrollen.",
    ],
    quellen: ["AAO, Ophthalmology. PMID 41232611", "Royal College of Ophthalmologists 2020. PMID 33423043"],
  },
  {
    titel: "Blut und Urin",
    text: [
      "Blutbild, Nierenwerte, Leberwerte und je nach Medikament weitere Werte, in Abstaenden, die sich nach der " +
        "Aktivitaet und nach dem Medikament richten: enger bei Beginn und nach jeder Dosisaenderung, weiter in " +
        "ruhigen Phasen.",
      "Dazu die Lupus-spezifischen Werte, Anti-dsDNA und Komplement C3 und C4, und in jedem Fall der Urin auf Eiweiss.",
      "Die Abstaende gehoeren in die Sprechstunde, nicht in eine App. Was hier hilft: die Frage, wer sie veranlasst, " +
        "damit nichts zwischen Hausarztpraxis und Ambulanz liegen bleibt.",
    ],
  },
  {
    titel: "Vor dem Start mancher Medikamente",
    text: [
      "Vor Azathioprin wird ein Enzym bestimmt, das den Abbau steuert. Fehlt es oder ist es vermindert, drohen " +
        "sonst schwere Blutbildveraenderungen. Danach fragen ist berechtigt.",
      "Vor immununterdrueckender Behandlung gehoert der Impfstatus geprueft, weil manches danach nicht mehr geht.",
    ],
  },
  {
    titel: "Zoeliakie im Verlauf",
    text: [
      "tTG-IgA im Verlauf, dazu die Naehrstoffe, und eine Ernaehrungsberatung mit Erfahrung in Zoeliakie. Letztere " +
        "ist keine Zugabe: in den Leitlinien ist der Kontakt zu einer Fachkraft fester Bestandteil der Behandlung.",
      "Ein normaler tTG-Wert schliesst eine noch nicht verheilte Schleimhaut nicht aus. Bleiben Beschwerden oder " +
        "Maengel, wird weiter gesucht.",
    ],
  },
  {
    titel: "Knochen",
    text: [
      "Unter laengerer Kortisonbehandlung und bei Zoeliakie gehoert der Knochen im Blick. Unter 40 Jahren laesst " +
        "sich das Risiko mit dem ueblichen Rechner nicht abschaetzen, deshalb wird gemessen statt gerechnet.",
      "Kalzium und Vitamin D ausreichend, Bewegung mit Gewicht auf den Beinen, nicht rauchen.",
    ],
    quellen: ["ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022. DOI 10.1002/art.42646"],
  },
];


/* ------------------------------------------------------------------ Suche
 *
 * Eine Stelle finden, ohne Netz und ohne Verzeichnis.
 *
 * Was hier NICHT steht, ist der Kern: keine Klinik, keine Adresse, keine
 * Telefonnummer, kein Name einer Aerztin. Beim Bauen dieser App war kein
 * einziges medizinisches Verzeichnis und keine Patientenorganisation
 * erreichbar, geprueft und bestaetigt. Nichts davon liesse sich also
 * nachsehen, und eine falsche Nummer, die jemand im Schub waehlt, richtet
 * echten Schaden an.
 *
 * Was hier steht, sind Wege: die Art der Stelle, wie sie heisst, wonach man
 * sucht und was man dort fragt. Ein Weg ueber einen Suchbegriff ueberlebt
 * einen Seitenumbau, eine gespeicherte Adresse nicht.
 */
INHALT.suche = {
  warnung:
    "Diese Zusammenstellung ist aus dem Gedaechtnis entstanden. Aus der Umgebung, in der sie gebaut wurde, war keine einzige Fachseite und keine einzige Patientenorganisation erreichbar, das wurde geprueft und es stimmt. Nachgesehen werden konnte also nichts. Deshalb steht hier bewusst keine Adresse, keine Telefonnummer und kein Name einer Klinik oder einer Aerztin: auf dieser Ebene waere ein Irrtum gefaehrlich, und eine falsche Nummer, die jemand im Schub waehlt, richtet echten Schaden an. Was hier steht, sind Arten von Stellen, ihre Namen und Suchbegriffe. Namen koennen sich geaendert haben, Organisationen koennen verschmolzen oder umbenannt sein, ein Verzeichnis kann es nicht mehr geben. Jeder Eintrag traegt deshalb eine Sicherheit. Die App prueft davon nichts nach, sie kann es nicht, sie hat keine Verbindung nach draussen. Bevor man sich auf eine Stelle verlaesst, gehoert sie einmal bestaetigt: von der Hausarztpraxis, von der Ambulanz oder von einer Selbsthilfegruppe.",

  laender: [
    { wert: "at", text: "Oesterreich" },
    { wert: "de", text: "Deutschland" },
    { wert: "ch", text: "Schweiz" },
    { wert: "it", text: "Italien" },
    { wert: "eu", text: "Europa" },
  ],

  wege: [
    {
      land: "at",
      thema: "beides",
      name: "Die Zuweisung aus der Hausarztpraxis",
      was: "Den Zugang zur Spitalsambulanz, und eine Einschaetzung, welches Haus im Bezirk wirklich erreichbar ist.",
      weg: "In Oesterreich verlangen die meisten Spitalsambulanzen eine Zuweisung von einer Kassenaerztin, dazu meist einen vereinbarten Termin. In der Praxis sagen, dass eine Ambulanz mit Erfahrung in systemischem Lupus gesucht wird, nicht nur eine rheumatologische. Die zweite Diagnose gleich dazusagen, sie aendert die Auswahl.",
      suchbegriff: "Zuweisung rheumatologische Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "Die Ambulanz, in der du ohnehin schon bist",
      was: "Den kuerzesten Weg, und einen Namen von jemandem, der selbst dort nachfragt.",
      weg: "Beim naechsten Termin fragen, wer sich mit Lupus und Zoeliakie zusammen auskennt und ob eine Vorstellung an einer spezialisierten Stelle sinnvoll waere. Um eine Zweitmeinung zu bitten ist erlaubt und ueblich, es ist kein Misstrauensantrag. Wer das heikel findet, formuliert es als Frage nach einer Mitbetreuung.",
      suchbegriff: "Zweitmeinung Mitbetreuung erbitten",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "Arztsuche der Oesterreichischen Aerztekammer",
      was: "Das amtliche Verzeichnis aller Aerztinnen mit ihrem Fachgebiet, nach Ort filterbar.",
      weg: "Ueber eine Suchmaschine nach der Aerztekammer und Arztsuche gehen, es gibt eine bundesweite und je eine der Landeskammern. Wichtig bei Lupus: Rheumatologie war in Oesterreich lange ein Zusatz zur Inneren Medizin und ist erst spaeter ein eigener Fachtitel geworden. Aeltere Kolleginnen tragen den Zusatz, juengere den Titel. Nach beidem suchen.",
      suchbegriff: "Aerztekammer Arztsuche Innere Medizin Rheumatologie",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "Vertragspartnersuche der Gesundheitskasse",
      was: "Wer einen Kassenvertrag hat, und wer nicht.",
      weg: "Auf der Seite der Oesterreichischen Gesundheitskasse nach der Arzt- oder Vertragspartnersuche sehen. Der Unterschied ist Geld: bei einer Wahlaerztin zahlt man zuerst selbst und bekommt spaeter einen Teil zurueck. Bei langen Wartezeiten ist das manchmal der schnellere Weg, die Rueckerstattung sollte man aber vorher erfragen.",
      suchbegriff: "Oesterreichische Gesundheitskasse Arztsuche",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "lupus",
      name: "Oesterreichische Gesellschaft fuer Rheumatologie und Rehabilitation",
      was: "Die Fachgesellschaft, mit Mitgliederliste und einer Uebersicht rheumatologischer Einrichtungen.",
      weg: "Nach der Gesellschaft suchen, dann nach Mitgliedern, Zentren oder Ambulanzen sehen. Wer in einer Fachgesellschaft aktiv ist, arbeitet meist an einer Stelle mit genug Faellen.",
      suchbegriff: "Oesterreichische Gesellschaft fuer Rheumatologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "lupus",
      name: "Oesterreichische Rheumaliga",
      was: "Selbsthilfe mit Landesgruppen, und das Wissen darueber, wo man als Mensch gut aufgehoben ist.",
      weg: "Nach der Rheumaliga und dem eigenen Bundesland suchen. Dort fragen, welche Ambulanz Menschen mit Lupus betreut, wo die Wartezeit ertraeglich ist und wo zugehoert wird. Diese Auskunft bekommt man aus keinem Verzeichnis.",
      suchbegriff: "Rheumaliga Oesterreich Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Die oesterreichische Zoeliakie-Gesellschaft",
      was: "Beratung, Produktlisten, Gruppen, oft auch Hinweise auf Ambulanzen und auf Diaetologinnen mit Erfahrung.",
      weg: "Nach Zoeliakie und Oesterreich suchen. Wenn der Name nicht stimmt, ueber den europaeischen Dachverband der Zoeliakie-Gesellschaften gehen, der seine Mitglieder je Land auffuehrt. Der zweite Weg funktioniert auch dann, wenn die Organisation anders heisst als erinnert.",
      suchbegriff: "Zoeliakie Oesterreich Arbeitsgemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Oesterreichische Gesellschaft fuer Gastroenterologie und Hepatologie",
      was: "Die Fachgesellschaft fuer den Darm, mit Mitgliedern und Veranstaltungen.",
      weg: "Nach der Gesellschaft suchen. Fuer die Zoeliakie ist die Gastroenterologie zustaendig, nicht die Rheumatologie. Wer eine Ambulanz sucht, sucht dort nach Mitgliedern am eigenen Ort.",
      suchbegriff: "Oesterreichische Gesellschaft fuer Gastroenterologie",
      sicherheit: "mittel",
    },
    {
      land: "at",
      thema: "beides",
      name: "Die Selbsthilfe-Unterstuetzungsstelle im Bundesland",
      was: "Vermittlung an Gruppen, auch zu zwei Diagnosen gleichzeitig.",
      weg: "In jedem Bundesland gibt es eine gefoerderte Stelle, die Selbsthilfegruppen sammelt und vermittelt. Nach Selbsthilfe und dem Bundesland suchen, dort schreiben und beide Diagnosen nennen. Wenn es keine passende Gruppe gibt, kennen diese Stellen meist trotzdem jemanden.",
      suchbegriff: "Selbsthilfe Unterstuetzungsstelle Wien",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "beides",
      name: "Das oeffentliche Gesundheitsportal des Bundes",
      was: "Amtliche Erklaerungen zu Ablaeufen, Rechten und Wegen im System.",
      weg: "Nach dem oeffentlichen Gesundheitsportal Oesterreichs suchen. Nuetzlich vor allem fuer die Verwaltungsfragen: Zuweisung, Kostenerstattung, Wahlaerztin, Patientenrechte, Beschwerdewege.",
      suchbegriff: "oeffentliches Gesundheitsportal Oesterreich",
      sicherheit: "hoch",
    },
    {
      land: "at",
      thema: "zoeliakie",
      name: "Diaetologin mit Zoeliakie-Erfahrung",
      was: "Die Ernaehrungsbegleitung, die bei Zoeliakie zur Behandlung gehoert und nicht zur Kuer.",
      weg: "In Oesterreich ist Diaetologin der geschuetzte Titel, nicht Ernaehrungsberaterin. Ueber den Berufsverband suchen oder in der Ambulanz nach einer Zuweisung fragen. Die Frage, die zaehlt, lautet: wie viele Menschen mit Zoeliakie betreuen Sie im Jahr.",
      suchbegriff: "Diaetologin finden Oesterreich Berufsverband",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Deutsche Gesellschaft fuer Rheumatologie und Klinische Immunologie",
      was: "Die Fachgesellschaft und das Netz der regionalen Rheumazentren.",
      weg: "Nach der Fachgesellschaft suchen und nach regionalen kooperativen Rheumazentren. Diese Zentren sind Zusammenschluesse von Kliniken und Praxen einer Region, ihre Listen sind ein guter Ausgangspunkt.",
      suchbegriff: "Deutsche Gesellschaft fuer Rheumatologie Rheumazentren",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Deutsche Rheuma-Liga",
      was: "Die grosse Patientenorganisation, mit Landesverbaenden und Adresslisten.",
      weg: "Nach der Rheuma-Liga und dem Bundesland suchen. Sie fuehrt Adressen von Rheumatologinnen und Kliniken, vermittelt Gruppen und gibt gut lesbare Merkblaetter heraus. Die Merkblaetter sind auch von Oesterreich aus brauchbar, die Adressen nicht.",
      suchbegriff: "Deutsche Rheuma-Liga Landesverband",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Die Lupus-Selbsthilfe im deutschen Sprachraum",
      was: "Eine eigene Gemeinschaft nur fuer Lupus, mit Regionalgruppen und Erfahrungswissen zu Ambulanzen.",
      weg: "Ueber die Rheuma-Liga nach der Lupus-Selbsthilfegemeinschaft fragen, oder direkt nach Lupus und Selbsthilfe suchen. Auch aus Wien nutzbar: Erfahrungen zu Behandlung, Muedigkeit und Aemtern sind uebertragbar, die Adressen sind es nicht.",
      suchbegriff: "Lupus Erythematodes Selbsthilfegemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "zoeliakie",
      name: "Deutsche Zoeliakie-Gesellschaft",
      was: "Beratung, geprueftes Produktwissen, Gruppen, Hinweise auf erfahrene Ambulanzen.",
      weg: "Nach der Deutschen Zoeliakie-Gesellschaft suchen. Das Produktwissen ist auch von Oesterreich aus brauchbar, weil viele Hersteller dieselben sind. Fuer die Suche nach einer Ambulanz gilt: die Listen sind deutsch.",
      suchbegriff: "Deutsche Zoeliakie-Gesellschaft",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "Arztsuche der Kassenaerztlichen Vereinigungen",
      was: "Wer mit welcher Facharztbezeichnung wo niedergelassen ist.",
      weg: "Nach Arztsuche und Kassenaerztliche Vereinigung suchen, bundesweit oder fuer ein Bundesland. Der Patientenservice der Vereinigungen vermittelt auch Termine, wenn es dringend ist.",
      suchbegriff: "Arztsuche Kassenaerztliche Vereinigung",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "beides",
      name: "Die nationale Stelle fuer Selbsthilfe",
      was: "Gruppen und regionale Kontaktstellen, auch zu seltenen Kombinationen.",
      weg: "Nach der nationalen Kontakt- und Informationsstelle zur Selbsthilfe suchen. Wer zwei Diagnosen hat, fragt dort nach beiden und laesst sich beides vermitteln.",
      suchbegriff: "NAKOS Selbsthilfe Datenbank",
      sicherheit: "hoch",
    },
    {
      land: "de",
      thema: "lupus",
      name: "Zentren fuer Seltene Erkrankungen an Universitaetskliniken",
      was: "Eine Lotsenstelle fuer unklare oder zusammengesetzte Bilder.",
      weg: "Nach Zentrum fuer Seltene Erkrankungen und einer Universitaetsstadt suchen, oder nach einem Versorgungsatlas fuer seltene Erkrankungen. Solche Zentren nehmen meist nur mit Zuweisung und vollstaendigen Unterlagen an, und es gibt Wartezeiten.",
      suchbegriff: "Zentrum fuer Seltene Erkrankungen Versorgungsatlas",
      sicherheit: "mittel",
    },
    {
      land: "de",
      thema: "beides",
      name: "Das Leitlinienregister der medizinischen Fachgesellschaften",
      was: "Die Leitlinien zu Lupus und zu Zoeliakie, also den Massstab, an dem sich eine Ambulanz messen laesst.",
      weg: "Nach dem Leitlinienregister der Arbeitsgemeinschaft der Wissenschaftlichen Medizinischen Fachgesellschaften suchen, dann nach der Erkrankung. Es ist ein Register, kein Ratgeber, die Texte sind fuer Fachleute geschrieben. Die Zusammenfassung und die Empfehlungen am Anfang sind trotzdem lesbar, und zu manchen Leitlinien gibt es eine Fassung fuer Patientinnen.",
      suchbegriff: "AWMF Leitlinienregister Zoeliakie",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Rheumaliga Schweiz mit den kantonalen Ligen",
      was: "Beratung, Kurse und Adressen in der Schweiz.",
      weg: "Nach der Rheumaliga und dem Kanton suchen. Die kantonalen Ligen sind die eigentlichen Anlaufstellen.",
      suchbegriff: "Rheumaliga Schweiz",
      sicherheit: "hoch",
    },
    {
      land: "ch",
      thema: "lupus",
      name: "Schweizerische Gesellschaft fuer Rheumatologie",
      was: "Die Fachgesellschaft mit Mitgliederverzeichnis.",
      weg: "Nach der Gesellschaft suchen und im Mitgliederbereich nach Ort filtern. Dazu das Aerzteverzeichnis der Standesorganisation FMH, das die Facharzttitel amtlich fuehrt.",
      suchbegriff: "Schweizerische Gesellschaft fuer Rheumatologie Mitglieder",
      sicherheit: "mittel",
    },
    {
      land: "ch",
      thema: "zoeliakie",
      name: "Die schweizerische Zoeliakie-Vereinigung",
      was: "Beratung und Produktwissen fuer die Schweiz.",
      weg: "Nach Zoeliakie und Schweiz suchen, oder ueber den europaeischen Dachverband gehen, der die Mitgliedsgesellschaft je Land auffuehrt.",
      suchbegriff: "Zoeliakie Schweiz Interessengemeinschaft",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "zoeliakie",
      name: "Associazione Italiana Celiachia",
      was: "Die italienische Zoeliakie-Organisation, mit Regionalverbaenden und einem Zeichen fuer geprueft glutenfreie Lokale.",
      weg: "Nach der Organisation suchen. Fuer Reisen nach Italien ist die Liste der geprueften Lokale das Nuetzlichste, was es dort gibt. In Suedtirol gibt es eine deutschsprachige Regionalgruppe.",
      suchbegriff: "Associazione Italiana Celiachia",
      sicherheit: "hoch",
    },
    {
      land: "it",
      thema: "beides",
      name: "Das italienische Netz fuer seltene Erkrankungen",
      was: "Amtlich benannte Zentren je Region, an denen Diagnose und Betreuung stattfinden.",
      weg: "Italien fuehrt ein nationales Netz fuer seltene Erkrankungen. Die Regionen benennen die Zentren, und an der Anerkennung haengt die Befreiung von Zuzahlungen. Systemischer Lupus steht auf der nationalen Liste. Auf Italienisch nach dem nationalen Netz und der Region suchen.",
      suchbegriff: "rete nazionale malattie rare presidi",
      sicherheit: "mittel",
    },
    {
      land: "it",
      thema: "beides",
      name: "Der Suedtiroler Sanitaetsbetrieb",
      was: "Den einzigen italienischen Weg ohne Sprachhuerde.",
      weg: "Der oeffentliche Gesundheitsdienst in Suedtirol arbeitet auf Deutsch. Fuer eine Zweitmeinung oder fuer Fragen zur Zoeliakie in Italien ist das der bequemste Einstieg. Vor einem Termin im Ausland immer zuerst die Kostenfrage klaeren, siehe die nationale Kontaktstelle.",
      suchbegriff: "Suedtiroler Sanitaetsbetrieb Ambulanz",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Das europaeische Referenznetz fuer seltene Bindegewebserkrankungen",
      was: "Eine amtliche Liste von Expertenzentren, Land fuer Land, von den Mitgliedstaaten benannt.",
      weg: "Die Europaeische Union unterhaelt Referenznetze fuer seltene Erkrankungen. Fuer systemischen Lupus ist das Netz fuer seltene Bindegewebs- und Muskel-Skelett-Erkrankungen zustaendig. Nach European Reference Network und connective tissue suchen, dann die Mitgliederliste nach Oesterreich filtern. Wer dort steht, wurde von einer Behoerde geprueft, nicht von einer Redaktion.",
      suchbegriff: "European Reference Network connective tissue ReCONNET",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Das europaeische Referenznetz fuer Immunerkrankungen",
      was: "Ein zweites Netz, das autoimmune und autoinflammatorische Erkrankungen abdeckt.",
      weg: "Gleicher Weg wie beim vorigen Eintrag, nach European Reference Network und immunodeficiency oder autoimmune suchen. Manche Haeuser stehen in beiden Netzen, das ist ein gutes Zeichen.",
      suchbegriff: "European Reference Network autoimmune RITA",
      sicherheit: "mittel",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Orphanet, das europaeische Verzeichnis seltener Erkrankungen",
      was: "Expertenzentren, Selbsthilfeorganisationen, Register und Studien, nach Land filterbar und auf Deutsch.",
      weg: "Nach Orphanet suchen, dann nach der Erkrankung, dann auf die Laenderauswahl achten. Fuer Zoeliakie ist das Verzeichnis nur bei der seltenen therapieresistenten Form zustaendig, die gewoehnliche Zoeliakie ist dafuer zu haeufig.",
      suchbegriff: "Orphanet Expertenzentren Lupus erythematodes",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Der europaeische Dachverband der Lupus-Organisationen",
      was: "Den Weg zur Organisation im eigenen Land, auch wenn man deren Namen nicht kennt.",
      weg: "Nach dem europaeischen Dachverband suchen und dort die Mitgliedsorganisationen je Land ansehen. Das ist der verlaesslichste Weg zu einer oesterreichischen Lupus-Gruppe, weil ein Dachverband seine Mitgliederliste pflegt.",
      suchbegriff: "Lupus Europe member organisations",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "zoeliakie",
      name: "Der europaeische Dachverband der Zoeliakie-Gesellschaften",
      was: "Die Mitgliedsgesellschaft je Land, dazu das Zeichen der durchgestrichenen Aehre fuer geprueft glutenfreie Produkte.",
      weg: "Nach dem europaeischen Dachverband der Zoeliakie-Gesellschaften suchen. Ueber ihn findet man die oesterreichische Organisation und die der Nachbarlaender, was auf Reisen zaehlt.",
      suchbegriff: "Association of European Coeliac Societies",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "beides",
      name: "Die nationale Kontaktstelle fuer grenzueberschreitende Gesundheitsversorgung",
      was: "Auskunft darueber, was eine Behandlung in einem anderen EU-Land kostet, was die Kasse zahlt und was vorher genehmigt werden muss.",
      weg: "Jeder Mitgliedstaat muss eine solche Stelle betreiben. Nach nationaler Kontaktstelle und grenzueberschreitender Gesundheitsversorgung suchen, dazu das eigene Land. Vor jedem geplanten Termin im Ausland dort fragen, sonst bleibt man auf der Rechnung sitzen.",
      suchbegriff: "nationale Kontaktstelle grenzueberschreitende Gesundheitsversorgung",
      sicherheit: "hoch",
    },
    {
      land: "eu",
      thema: "lupus",
      name: "Das europaeische Register klinischer Studien",
      was: "Welche Kliniken in erreichbarer Naehe an Lupus-Studien arbeiten.",
      weg: "Nach dem europaeischen Informationssystem fuer klinische Studien suchen, dann nach der Erkrankung und dem Land filtern. Die beteiligten Standorte stehen dabei. Das sagt nichts ueber die Freundlichkeit eines Hauses, aber viel darueber, wo genug Faelle zusammenkommen. Eine Teilnahme ist freiwillig und nie Voraussetzung fuer Betreuung.",
      suchbegriff: "Clinical Trials Information System lupus Austria",
      sicherheit: "mittel",
    },
  ],

  merkmale: [
    { id: "ambulanz-sagen-viele", punkt: "Die Ambulanz kann sagen, wie viele Menschen mit systemischem Lupus sie im Jahr betreut, ohne lange zu ueberlegen." },
    { id: "feste-ansprechperson-wenigstens", punkt: "Es gibt eine feste Ansprechperson oder wenigstens ein kleines Team, statt bei jedem Termin ein neues Gesicht." },
    { id: "krankheitsaktivitaet-messinstrument-erfasst", punkt: "Die Krankheitsaktivitaet wird mit einem Messinstrument erfasst, und der Wert steht im Brief, nicht nur im Kopf." },
    { id: "benannten-schub-zwischen", punkt: "Es gibt einen benannten Weg fuer den Schub zwischen den Terminen: eine Akutsprechstunde, eine Mailadresse oder eine Nummer, bei der jemand abhebt." },
    { id: "nephrologie-dermatologie-augenheilkunde", punkt: "Nephrologie, Dermatologie, Augenheilkunde und Geburtshilfe sind im Haus oder feste Partner, und die Ambulanz kann erklaeren, wie die Ueberleitung laeuft." },
    { id: "kinderwunsch-schwangerschaft-selbst", punkt: "Kinderwunsch und Schwangerschaft werden dort von selbst angesprochen, nicht erst auf Nachfrage." },
    { id: "zoeliakie-mitgedacht-entweder", punkt: "Die Zoeliakie wird mitgedacht: entweder gibt es eine Gastroenterologie im Haus, oder die Ambulanz weiss genau, wer sie betreut und schreibt dorthin." },
    { id: "ernaehrungsfachkraft-zoeliakieerfahrung-erreichbar", punkt: "Eine Ernaehrungsfachkraft mit Zoeliakie-Erfahrung ist erreichbar, und die Zuweisung dorthin ist ein Handgriff, keine Verhandlung." },
    { id: "jedem-termin-geht", punkt: "Nach jedem Termin geht ein Brief an die Hausarztpraxis, und man bekommt selbst eine Kopie, ohne darum zu kaempfen." },
    { id: "klar-geregelt-welche", punkt: "Es ist klar geregelt, welche Kontrolle wer veranlasst, damit nichts zwischen Ambulanz und Hausarztpraxis liegen bleibt." },
    { id: "muedigkeit-lichtempfindlichkeit-teil", punkt: "Muedigkeit und Lichtempfindlichkeit werden als Teil der Erkrankung behandelt und nicht als Randnotiz." },
    { id: "haus-nimmt-register", punkt: "Das Haus nimmt an einem Register, einem Referenznetz oder an Studien teil, ein Hinweis darauf, dass Faelle dort systematisch erfasst werden." },
    { id: "termin-dauert-lang", punkt: "Der Termin dauert lang genug, um zwei Erkrankungen zu besprechen, und der naechste steht am Ende fest." },
    { id: "kommt-schlechten-ausgezeichnete", punkt: "Man kommt hin, auch an einem schlechten Tag: eine ausgezeichnete Ambulanz drei Stunden entfernt wird im Schub zur schlechten." },
  ],

  erstgespraech: [
    "Die Sicherung aus dieser App, dazu den Arztbericht ueber zwoelf Wochen, ausgedruckt. Zahlen ueber Wochen sagen mehr als die Erinnerung an einen schlechten Tag.",
    "Alle Befunde in Kopie, nach Datum geordnet: Laborbefunde, Entlassungsbriefe, der Befund der Darmbiopsie, aeltere Antikoerperwerte. Die Originale behaelt man selbst.",
    "Eine Liste aller Medikamente mit Dosis, dazu Nahrungsergaenzung und Verhuetung. Auch das, was abgesetzt wurde, und warum es abgesetzt wurde.",
    "Die erste Frage: uebernehmen Sie die laufende Betreuung, oder ist das eine einmalige Begutachtung. Davon haengt alles Weitere ab.",
    "Die Frage, wer an wen schreibt: bekommt die Hausarztpraxis einen Brief, und bekomme ich selbst einen.",
    "Die Frage, was bis zum naechsten Mal beobachtet und aufgeschrieben werden soll. Damit wird das Tagebuch gezielt statt bloss fleissig.",
    "Die Frage, wie man die Ambulanz erreicht, wenn es zwischendurch schlechter wird, und was am Wochenende gilt.",
    "Drei Dinge vorher aufschreiben, die einem selbst am wichtigsten sind, und sie zuerst sagen. Die Zeit ist kurz und geht sonst fuer anderes drauf.",
    "Eine Begleitperson mitnehmen, wenn der Kopf im Nebel ist. Zwei Ohren hoeren mehr, und man muss nicht gleichzeitig zuhoeren und mitschreiben.",
    "Mitschreiben oder aufnehmen. Vor einer Aufnahme fragen, die meisten sagen ja.",
    "Die Zoeliakie von selbst ansprechen, auch in einer rheumatologischen Ambulanz. Sonst faellt sie zwischen die Faecher.",
    "E-Card und Zuweisung. Bei einer Wahlaerztin die Honorarnote aufheben und vorher klaeren, wie viel zurueckkommt.",
    "Den Termin in die bessere Tageshaelfte legen und danach nichts anderes planen. Ein Termin kostet mehr Kraft, als im Kalender steht.",
    "Wenn etwas unklar bleibt, den Satz sagen: ich habe das nicht verstanden, koennen Sie es anders sagen. Das ist keine Schwaeche, das ist der Sinn des Termins.",
    "Gleich nach dem Termin eine kurze Notiz, solange es frisch ist. Bei Nebel ist die Erinnerung an das Gespraech schlechter, als man denkt.",
  ],
};
