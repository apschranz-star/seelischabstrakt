# Anker

Ein Begleitbuch bei chronischen Erkrankungen: Zoeliakie, systemischer Lupus,
Psoriasis, Hashimoto, rheumatoide Arthritis, Morbus Crohn und Colitis. Man
waehlt eine oder mehrere, und die App setzt sich daraus zusammen. Tagebuch mit
Schiebereglern, Verlauf, Rezepte des Monats, aktuelle Forschung, Arztmappe je
Erkrankung. Laeuft im Browser, ohne Server, ohne Konto. Alle Eintraege bleiben
auf dem Geraet.

Im selben Ordner liegt **REPORT.md**, der ausfuehrliche Bericht zu Muedigkeit,
Bewegung und Ernaehrung. Die App enthaelt dieselben Inhalte in kuerzerer Form.

---

## Wohin die App kommt

Die Adresse ist

    https://apschranz-star.github.io/seelischabstrakt/anker/

Dorthin legt sie der Workflow `.github/workflows/anker-pages.yml`, sobald auf
dem Zweig `main` etwas in `anker/` liegt. Der Workflow prueft vorher, dass
jede Datei parst, dass jede angebotene Sprache vollstaendig ist und dass
`index.html` nichts laedt, was nicht mitkopiert wurde. Danach dauert es etwa
drei Minuten. Die Seite fragt nach dem Zugangscode; das ist derselbe, den die
anderen Seiten auch verlangen.

Der Code sollte im Repository-Secret `SITE_ACCESS_KEY` stehen. Steht er dort
nicht, liest der Workflow ihn aus einer schon veroeffentlichten Schwesterseite
zurueck, und wenn auch dort keiner steht, bricht er ab und veroeffentlicht
nichts. Das Secret anzulegen ist trotzdem der richtige Weg: Settings, Secrets
and variables, Actions, New repository secret, Name `SITE_ACCESS_KEY`.

Die Netlify-Seite liefert `anker/` nicht aus. Sie veroeffentlicht die Wurzel
des Repositories, der Ordner waere dort also ohne Tor erreichbar; eine Regel in
`netlify.toml` gibt fuer `/anker/*` eine 404 zurueck. Die App hat genau eine
Adresse.

Das Veroeffentlichen ist kein Umweg, sondern Voraussetzung. Ein Service
Worker laeuft nur auf einer sicheren Verbindung, und *Zum Home-Bildschirm*
bietet Safari nur dort als eigene App an. Ohne HTTPS gibt es keine Offline-App.

### Vorher kurz ausprobieren, im eigenen WLAN

Zum Anschauen reicht ein Rechner im selben Netz. Im Ordner ueber `anker/`:

    python3 -m http.server 8000

Dann am iPhone in Safari `http://<IP-des-Rechners>:8000/anker/` oeffnen. Die IP
zeigt `ipconfig getifaddr en0` am Mac oder `hostname -I` unter Linux.

Zwei Dinge sind dabei anders als spaeter:

- Kein Service Worker und kein *Zum Home-Bildschirm* als eigene App. Dafuer
  braucht es HTTPS. Zum Lesen und Tippen genuegt es trotzdem.
- Eintraege, die unter dieser Adresse entstehen, bleiben dort. Der Browser
  haelt den Speicher je Adresse getrennt; sie wandern nicht zur
  veroeffentlichten Fassung mit. Zum Ausprobieren ist das gut so.

---

## Auf dem iPhone installieren

Anker ist eine Web-App. Sie kommt nicht aus dem App Store, sondern wird aus
Safari heraus auf den Home-Bildschirm gelegt. Danach hat sie ein eigenes
Symbol, laeuft im Vollbild und funktioniert ohne Netz.

1. Die Adresse in **Safari** oeffnen. Nicht in Chrome und nicht in einem
   Browser aus einer anderen App heraus, sonst fehlt der naechste Schritt.
2. Unten auf den **Teilen-Knopf** tippen, das Quadrat mit dem Pfeil nach oben.
3. In der Liste nach unten scrollen zu **Zum Home-Bildschirm**.
4. Namen bestaetigen, fertig.

Danach die App ueber das Symbol am Home-Bildschirm starten, nicht mehr ueber
Safari. Das ist wichtig: der Speicher der App am Home-Bildschirm und der
Speicher in Safari sind derselbe, aber nur die Fassung am Home-Bildschirm
laeuft im Vollbild und behaelt den Speicherplatz zuverlaessiger.

### Ohne Netz

Beim ersten Start legt die App alles ab, was sie braucht. Danach laeuft sie im
Flugmodus, im Zug und im Wartezimmer. Es geht nie eine Anfrage an einen fremden
Server, und die Sicherheitsregel im Kopf der Seite verbietet das auch technisch
(`connect-src 'none'`).

---

## Sicherung, und warum sie nicht optional ist

Alles steht im lokalen Speicher dieses einen Browsers auf diesem einen Geraet.
Es gibt keinen Server, der das nachhaelt. Das heisst:

- Wird der Browserverlauf mit Website-Daten geloescht, sind die Eintraege weg.
- Wird die App vom Home-Bildschirm entfernt, sind sie weg.
- Wird das Geraet zurueckgesetzt oder geht verloren, sind sie weg.
- iOS raeumt den Speicher von Web-Apps, die lange nicht benutzt werden, unter
  Umstaenden selbst weg. Anker bittet beim Start darum, das nicht zu tun
  (`navigator.storage.persist()`), aber eine Garantie ist das nicht.

Deshalb: **Mehr, Sicherung, Sicherung teilen oder speichern.** Das schreibt
eine einzige JSON-Datei heraus. Sie gehoert in iCloud Drive, in einen Ordner in
der Dateien-App oder in eine Mail an sich selbst.

Die App erinnert nach vierzehn Tagen ohne Sicherung von selbst daran.

Zurueckholen geht ueber dieselbe Seite, **Sicherung einlesen**. Das ersetzt
alles, was gerade in der App steht.

In der Datei stehen seit den Anlaufstellen auch Namen, Telefonnummern und Adressen
von Aerztinnen. Das sind Daten anderer Leute, und zusammen mit der Diagnose sind sie
aussagekraeftig. Wer die Sicherung weitergibt, gibt das mit weiter.

---

## Was drin ist

| Bereich | Was er macht |
|---|---|
| **Heute** | Oben ein grosser Regler fuer das Befinden, 0 bis 10, nach rechts heisst besser. Darunter die Regler aller gewaehlten Erkrankungen, je Erkrankung eine Frage des Tages (Gluten, Sonne, Schilddruesentablette, Stuhlgang ...), Schlaf, Zeichen, Bewegung, Medikamente, Notiz, ein Rezeptvorschlag. Ein unberuehrter Regler bleibt leer, und leer ist auch eine Antwort. Oben die Termine der naechsten sieben Tage, unten der Stand in einem Satz. |
| **Verlauf** | Oben der Stand der letzten 14 Tage (siehe unten). Bis zu drei Regler als Linien ueber 14, 30 oder 90 Tage, frei waehlbar. Kalender nach Befinden, Tabelle, Nachtragen eines beliebigen Tages. |
| **Essen** | Rezepte des Monats, passend zu den Erkrankungen, mit Herz zum Merken. Hinweise, wo eine Zutat nicht zur Erkrankung passt. Gemerkte Rezepte. Die Regeln je Erkrankung. |
| **Wissen** | Aktuelle Forschung aus PubMed je Erkrankung und fuer jedes Paar, Arbeiten zum Merken. Die Kapitel aus dem Bericht, Warnzeichen, Fragen fuer den Termin. |
| **Mappe** | Meine Erkrankungen, Arztmappe je Erkrankung oder alles, Gemerktes, Medikamente mit Erinnerung, Laborwerte mit Verlaufslinie, Termine mit Erinnerung, Anlaufstellen, Sicherung, Darstellung. |

### Erkrankungen als Bausteine

Jede Erkrankung steht in `module.js` und bringt mit: Regler, Zeichen, eine Frage
des Tages mit drei Antworten, Laborwerte, Essensregeln, Rezeptvorlieben, eine
PubMed-Suche und Fragen fuer den Termin, alles auf Deutsch und Englisch. Zwei
gewaehlte Erkrankungen ergeben eine App, die beide abbildet; was sie teilen,
etwa die Gelenke bei Lupus und Arthritis, steht nur einmal da. Eine neue
Erkrankung ist ein Eintrag mehr in `module.js`, sonst nichts.
`werkzeug/pruefe-module.js` prueft, dass jeder Text in beiden Sprachen dasteht
und jeder Verweis auf ein Zeichen oder einen Laborwert aufgeht.

Wer Anker schon vorher benutzt hat, bekommt beim ersten Start Lupus und
Zoeliakie gesetzt, denn dafuer war die App gebaut. Nichts geht verloren.

### Stand der letzten 14 Tage

Auf der Seite Verlauf, kurz auf Heute und in der Arztmappe. Alles aus den
eigenen Eintraegen, keine Diagnose und kein Krankheitsindex: Krankheitsaktivitaet
misst die Praxis. Was der Stand tut:

- **Mittelwerte einordnen**: 1 bis unter 4 leicht, 4 bis unter 7 mittel, ab 7
  stark, wie Muedigkeit und Schmerz auf 0-bis-10-Skalen in Studien eingeteilt
  werden (Mendoza 1999, Serlin 1995); Juckreiz zusaetzlich ab 9 sehr stark
  (Reich 2012). Fuer die anderen Regler eine Orientierung, das steht so in der App.
- **Veraenderung**: gegen die 14 Tage davor, ab 1 Punkt "etwas", ab 2 Punkten
  "deutlich" (rund 2 Punkte gelten als spuerbar, Farrar 2001). Ein Mittelwert
  braucht mindestens drei Eintraege, der Stand mindestens vier Tage.
- **Punkte fuer die Praxis**: `warnzeichen` und `signale` in `module.js`.
  Ein Warnzeichen ist ein Zeichen, das bei dieser Erkrankung nicht bis zum
  Routinetermin warten sollte (schaeumender Urin bei Lupus, Blut im Stuhl bei
  CED, ein ganz geschwollener Finger bei Psoriasis). Ein Signal ist eine
  Antwort der Frage des Tages, die oft vorkam (zweimal Gluten in 14 Tagen,
  dreimal ueber eine Stunde steif). `pruefe-module.js` prueft, dass jedes
  Warnzeichen ein Zeichen der Erkrankung ist und jedes Signal auf eine
  vorhandene Antwort zeigt.
- **Medikamente**: an wie vielen Tagen mit Eintrag abgehakt.

### Erinnerungen

Eine Webseite ohne Server darf auf dem iPhone keine Benachrichtigung schicken.
Deshalb gibt Anker eine Kalenderdatei (.ics) heraus, und der Kalender des
Telefons erinnert: Termine am Vortag und zwei Stunden vorher (ohne Uhrzeit am
Vorabend um 18 Uhr), Medikamente taeglich zur eingetragenen Uhrzeit. Die Datei
entsteht auf dem Geraet, es geht nichts nach draussen.

### Aktuelle Forschung, einmal im Monat

Die App selbst darf nichts aus dem Netz holen. Deshalb laeuft am Ersten jedes
Monats `.github/workflows/anker-aktuell.yml`: es fragt PubMed ueber die
offizielle Schnittstelle (E-utilities) nach Leitlinien, Meta-Analysen,
Uebersichten und randomisierten Studien der letzten zwoelf Monate, schreibt
`aktuell.js` und veroeffentlicht die App neu. Gespeichert werden Titel,
Zeitschrift, Datum, Art und PubMed-Nummer, keine Zusammenfassungen. Von Hand:
Actions, Refresh Anker research, Run workflow, oder `node werkzeug/aktualisieren.js`.

### Rezepte: aus dem Netz und aus der eigenen Sammlung

**Aus dem Netz.** Am Ersten jedes Monats sammelt `werkzeug/rezepte-holen.js`
glutenfreie Rezepte von Seiten, die glutenfrei kochen (derzeit Meaningful Eats,
Mama Knows Gluten Free, Dish by Dish, Minimalist Baker, Gluten Free Palate,
Kochtrotz). Gelesen wird der RSS-Feed jeder Seite und auf jeder Rezeptseite das
maschinenlesbare Rezept (schema.org/Recipe), robots.txt wird beachtet, zwischen
zwei Anfragen an dieselbe Seite liegen zwei Sekunden. Gespeichert werden Name,
Zutaten, Zeiten, Portionen, Autorin und Adresse in `rezepte-netz.js`. Die
Zubereitung ist Text der Autorin und bleibt auf der Originalseite; die App
verlinkt sie. Bilder werden nicht kopiert.

Gluten, dreifach: die Quelle ist glutenfrei oder markiert das Rezept so; eine
Zutat auf der Sperrliste (Weizen, Dinkel, Gerste, Roggen, Malz, Couscous ...)
verwirft das Rezept; eine Zutat, die nur mit Zusatz sicher ist (Mehl, Hafer,
Brot, Kekse, Sojasauce, Backpulver, Bruehe, Bruehwuerfel ...), muss den Zusatz tragen, sonst steht
beim Rezept sichtbar "Bitte pruefen". Ein schwacher Zusatz wie "glutenfrei
moeglich" oder "gluten-free as needed" zaehlt nicht. Deutsche
Zusammensetzungen (Butterkekse, Hartweizengriess) werden erkannt. Eine Garantie
ist das nicht, und die App sagt das bei jedem Rezept aus dem Netz.

Passend zur Erkrankung: `rezeptAchtung` in `module.js` sucht in den Zutaten
nach dem, was nicht passt (Alkohol bei Psoriasis und Arthritis wegen
Methotrexat, Alfalfa bei Lupus, Soja bei Hashimoto wegen der Tablette). Das
Rezept zeigt dann einen Hinweis und rutscht in der Liste nach unten.

Gemerkt wird eine Kopie, damit ein Rezept nicht verschwindet, wenn es im
naechsten Monat nicht mehr gesammelt wird. Eine neue Quelle ist eine Zeile in
`QUELLEN` oben in `rezepte-holen.js`.

**Aus der eigenen Sammlung.** `rezepte.js`, jedes Rezept glutenfrei, mit
Zubereitung. Jeden Monat stehen sechs andere oben, vier davon passend zu den
Erkrankungen.

### Anlaufstellen

Unter Mehr, Anlaufstellen. Der Teil heisst nicht Expertensuche, und das ist Absicht:
suchen kann diese App nicht. Sie hat kein Netz, kein Verzeichnis, und beim Bauen war
keine einzige medizinische Seite erreichbar. Eine Adresse, die niemand geprueft hat,
gehoert nicht in eine App, die im Schub aufgemacht wird.

Was sie stattdessen tut, und was in der Praxis die groessere Huerde ist:

- **Eine Stelle finden.** Land und Thema waehlen, dann stehen die Wege da: welche Art
  von Stelle, wie sie heisst, wonach genau zu suchen ist und was man dort fragt.
  Jeder Weg traegt eine Marke, wie sicher er ist. Die sichersten stehen oben, und es
  sind die, die nicht im Netz liegen: die Zuweisung aus der Hausarztpraxis, die
  Ambulanz, in der sie ohnehin schon ist, die Selbsthilfegruppe. Der Suchbegriff
  daneben laesst sich antippen und kopieren.
- **Meine Stellen.** Ihr eigenes Verzeichnis. Name, Rolle, Haus, Telefon, Adresse,
  und ein Feld fuer den Weg in ihren eigenen Worten, also welche Linie, wie viele
  Minuten, wo die Tuer ist. Dazu ein Kontaktprotokoll, weil Warteliste der Normalfall
  und Vergessen der Feind ist.
- **Beim ersten Mal.** Woran man eine geeignete Stelle erkennt, und was man zum
  ersten Termin mitnimmt und fragt. Zum Ausdrucken. Dieselben Merkmale lassen sich
  je Stelle abhaken, und bei zwei Ambulanzen ist das der Vergleich, den sonst
  niemand fuehrt.

Eine Stelle laesst sich als **Notfallkontakt** markieren. Dann steht ihre Nummer ganz
oben auf der Warnzeichen-Seite, als antippbarer Anruf. Das ist die wichtigste
Verbindung der Funktion, weil diese Seite im schlechtesten Moment geoeffnet wird.

**Keine Ortung, mit Absicht.** Eine Luftlinie sagt in einer Stadt wenig, sie waere die
einzige Stelle der App, die eine Standortfreigabe braucht, und der Satz, den sie
selbst ins Feld Weg schreibt, hilft an einem schlechten Tag mehr als jede Zahl.

**Kein einziger Link nach draussen.** Die App koennte eine Adresse hinschreiben, aber
nicht pruefen, ob sie stimmt. Ein Suchbegriff ueberlebt einen Seitenumbau, eine
gespeicherte Adresse nicht.

Der **Arztbericht** fasst zwoelf Wochen zusammen: Mittelwerte, hoechster und
tiefster Wert, wie oft welches Symptom, Medikamente, Laborwerte. Er ist zum
Ausdrucken oder als PDF ueber den Teilen-Knopf gedacht.

---

## Was die App nicht ist

Sie stellt keine Diagnose. Sie rechnet nichts aus, was eine Aerztin ausrechnen
muesste. Sie gibt keine Empfehlung zu Medikamenten und keine Dosierung. Sie
schickt nichts an niemanden.

Sie hilft dabei, beim Termin die richtigen Dinge zu erzaehlen, und sie macht
sichtbar, was ueber Wochen passiert.

---

## Aendern

Die App besteht aus fuenf Dateien und braucht keinen Bauschritt. Wer etwas
aendern will, aendert die Datei und laedt neu.

| Datei | Wofuer |
|---|---|
| `index.html` | Geruest, Kopf, Tableiste, Sicherheitsregel |
| `app.css` | Aussehen, Farben, hell und dunkel |
| `app.js` | Mechanik: Speicher, Router, Seiten, Diagramme, Sicherung |
| `inhalt-de.js` | **Alle Texte und Listen.** Hier stehen Symptome, Essensregeln, Rezepte, Laborwerte, Warnzeichen, Fragen und die Wissenskapitel. |
| `module.js` | Die Erkrankungen als Bausteine, Deutsch und Englisch |
| `rezepte.js` | Die eigene Rezeptsammlung fuer die monatliche Auswahl |
| `rezepte-netz.js` | Glutenfreie Rezepte aus dem Netz. Wird erzeugt, nicht von Hand aendern. |
| `uebersetzung.js` | Italienisch, Franzoesisch, Spanisch fuer module.js und rezepte.js |
| `aktuell.js` | Die Forschungsuebersicht. Wird erzeugt, nicht von Hand aendern. |
| `sw.js` | Offline-Ablage |
| `inhalt-en.js` und drei weitere | Derselbe Inhalt auf Englisch, Italienisch, Franzoesisch, Spanisch |
| `fonts/` | Die Schrift, selbst ausgeliefert. Nicht von Hand aendern, siehe unten. |
| `werkzeug/` | Die Pruefwerkzeuge. Vor jedem Commit laufen lassen. |

### Sprachen

Der Inhalt liegt je Sprache in einer eigenen Datei. Eine Sprache wird erst
angeboten, wenn zweierlei uebersetzt ist: der Inhalt und die Oberflaeche.
Der Inhalt ist es in allen fuenf Sprachen. Die Oberflaeche, also rund
zweihundertneunzig Knopf- und Meldungstexte aus `app.js`, ist es auf Englisch
und auf Deutsch, und seit Oktober 2026 auch auf Italienisch, Franzoesisch und
Spanisch. In `OBERFLAECHE_FERTIG` stehen alle fuenf. Die Bausteine aus
`module.js` und `rezepte.js` sind fuer diese drei Sprachen in `uebersetzung.js`
uebersetzt, mit dem deutschen Text als Schluessel; `werkzeug/pruefe-module.js`
prueft, dass jeder Text da ist und jede Zahl darin stimmt.

Italienisch, Franzoesisch und Spanisch sind sorgfaeltig uebersetzt, aber nicht
von Muttersprachlerinnen und nicht von medizinischem Fachpersonal geprueft.
Die App sagt das unter Mappe, Sprache. Eine weitere Sprache braucht dreierlei:
den ganzen Inhalt als `inhalt-<code>.js`, die `ui`-Tabelle und die Eintraege in
`uebersetzung.js`.

Deutsch ist die Schluesselsprache: in `app.js` steht der deutsche Satz selbst
als Schluessel, und `inhalt-en.js` traegt unter `ui` die Uebersetzung dazu.
Drei Formen gibt es:

    T("Heute")                             ein fester Satz
    TV("Letzte {n} Tage", { n: 30 })       mit Platzhaltern, die die
                                           Uebersetzung umstellen darf
    TP("{n} Tag", "{n} Tage", n)           Einzahl und Mehrzahl als zwei
                                           eigene Schluessel

Gespeichert wird nie das Uebersetzte, sondern immer der deutsche Schluessel.
Das gilt fuer die angekreuzten Zeichen und fuer die Rolle einer Anlaufstelle.
Andersherum verlore ein Sprachwechsel jedes Kreuz, das schon gesetzt ist.

    node werkzeug/finde-texte.js       zeigt die Texte, die in app.js stecken
    node werkzeug/pruefe-sprache.js inhalt-en.js en    Struktur gegen das Original
    node werkzeug/pruefe-texte.js      fehlende, tote und schiefe Oberflaechentexte
    node werkzeug/pruefe-deutsch.js    hat sich ein deutscher Satz geaendert?
    node werkzeug/textabzug.js         Text aller Seiten abziehen und vergleichen

`pruefe-deutsch.js` haelt die 290 deutschen Saetze in `werkzeug/deutsch.json`
fest. Wer einen davon in `app.js` umformuliert, aendert zugleich den
Schluessel, unter dem die Uebersetzung liegt, und Englisch faellt dort still
auf Deutsch zurueck. Ist die Aenderung gewollt, folgt `--merken`, und die Datei
geht mit in den Commit. `textabzug.js` prueft dasselbe gruendlicher, indem es
die Seiten wirklich rendert, braucht dafuer aber Playwright und einen Chromium.

Die Felder `id`, `schluessel`, `dringend`, `land`, `thema`, `sicherheit`, `wert`,
`art` und `einheit` sind keine Sprache, sondern Technik. Wer sie beim Uebersetzen
verschiebt, nimmt einer echten Nutzerin ihre Eintraege und ihre gesetzten Haken
weg, ohne dass es jemand merkt. `pruefe-sprache.js` faengt genau das ab.

**Wer Inhalte aendern will, braucht nur `inhalt-de.js`.** Die Datei ist ein
einziges Objekt `INHALT` mit benannten Abschnitten. Ein neues Symptom ist ein
Eintrag mehr in einer Liste, ein neues Rezept ein Objekt mehr.

Nach einer Aenderung an `app.js`, `app.css` oder `inhalt-de.js` sieht man die
neue Fassung beim uebernaechsten Start: der Service Worker liefert beim
naechsten Start noch die abgelegte Fassung und holt die neue im Hintergrund.
Zweimal schliessen und oeffnen genuegt.

### Schrift

Ueberschriften in Bricolage Grotesque (variabel, 300 bis 800), der Rest in
IBM Plex Sans. Beide liegen in `fonts/`, beide nicht von Google geladen.

IBM Plex Sans, als variable Datei fuer den Bereich 400 bis 700, 88 kB fuer latin und
latin-ext. Sie liegt in `fonts/` und wird nicht von Google geladen: es soll keine
Anfrage nach draussen gehen, auch keine, die nur eine Schriftdatei holt und dabei die
IP-Adresse mitnimmt. Geholt hat sie `tools/selfhost-fonts.py` im Elternordner.

Der Grund fuer diese Schrift und keine andere: die App besteht zur Haelfte aus Zahlen,
die untereinander stehen und verglichen werden. Plex ist fuer technische Dokumentation
gezeichnet und hat eine eindeutige Eins, eine offene Sechs und Neun und eine Null, die
keine Acht sein kann.

Wer sie tauschen will, misst vorher drei Dinge nach, weil sie knapp bemessen sind:

1. Die Ziffernbreite. `font-variant-numeric: tabular-nums` steht zwar an drei Stellen,
   greift aber ins Leere, weil der Zuschnitt von Google kein `tnum` mitbringt. Dass
   die Tabellen trotzdem stimmen, liegt allein daran, dass in Plex jede Ziffer 0.6em
   breit ist. Eine Schrift mit proportionalen Ziffern zerreisst die Spalten still.
2. Die elf Skalenknoepfe auf der Heute-Seite sind 27 Punkt breit. Dort muss "10" hinein.
3. Die Endbeschriftung im Diagramm hat 50 Einheiten Platz. Das laengste Wort ist
   "Schmerz". Laeuft eine Schrift breiter, rutscht es aus der Karte, und weil das SVG
   auf `overflow: visible` steht, wird es nicht abgeschnitten, sondern steht daneben.

### Farben

Die drei Diagrammfarben sind nicht frei gewaehlt. Sie sind gegen Rot-Gruen- und
Blau-Gelb-Schwaeche geprueft und halten den Mindestabstand, und sie erreichen
3:1 gegen die Flaeche. Wer sie aendert, sollte das nachpruefen. Zusaetzlich
traegt jede Linie ihre Beschriftung am letzten Punkt, und es gibt die
Tabellenansicht, damit die Farbe die Linien nie allein auseinanderhalten muss.

### Icons

`icon.svg` ist das Original: ein Anker auf Nachtblau, der Bogen im Verlauf der
Erkrankungsfarben. Die PNG-Dateien fuer iOS und den Manifest sind daraus mit
Chromium gerendert, die maskierbare Fassung auf 76 Prozent verkleinert, damit
sie in jede Maske passt.

---

## Daten, sonst nichts

- Kein Server, kein Konto, keine Anmeldung.
- `connect-src 'none'`: die Seite kann keine Verbindung nach draussen aufbauen,
  auch nicht aus Versehen und auch nicht, wenn spaeter jemand Code einfuegt.
  Die Forschungsuebersicht aendert daran nichts: sie kommt als Datei mit der App.
- Keine Schrift, kein Skript, kein Bild von einer fremden Adresse.
- Keine Statistik, keine Zaehlpixel, keine Cookies.
- Keine Schrift von Google. Die Dateien liegen im Ordner `fonts/`.
- Keine Ortung. Die App fragt nie nach dem Standort.
- Die Seite traegt `noindex,nofollow`.

Was das kostet, steht oben unter Sicherung: was nur hier liegt, ist auch nur
hier.
