# Anker

Ein Begleitbuch bei systemischem Lupus erythematodes und Zoeliakie. Tagebuch,
Verlauf, Nachschlagewerk, Arztbericht. Laeuft im Browser, ohne Server, ohne
Konto. Alle Eintraege bleiben auf dem Geraet.

Im selben Ordner liegt **REPORT.md**, der ausfuehrliche Bericht zu Muedigkeit,
Bewegung und Ernaehrung. Die App enthaelt dieselben Inhalte in kuerzerer Form.

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
| **Heute** | Vier Skalen von 0 bis 10, Schlaf, Symptome, Gluten, Notiz. Was nicht angetippt wird, bleibt leer, und leer ist auch eine Antwort. |
| **Verlauf** | Linien ueber 14, 30 oder 90 Tage, Kalenderansicht, Tabelle, Nachtragen. |
| **Essen** | Was bei Zoeliakie weg muss, was in der Kueche wirklich zaehlt, Naehrstoffe, Rezepte. |
| **Wissen** | Die Kapitel aus dem Bericht, dazu Warnzeichen und die Fragenliste fuer den Termin. |
| **Mehr** | Medikamente, Laborwerte, Termine, Anlaufstellen, Arztbericht, Sicherung, Darstellung. |

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
| `content.js` | **Alle Texte und Listen.** Hier stehen Symptome, Essensregeln, Rezepte, Laborwerte, Warnzeichen, Fragen und die Wissenskapitel. |
| `sw.js` | Offline-Ablage |
| `fonts/` | Die Schrift, selbst ausgeliefert. Nicht von Hand aendern, siehe unten. |

**Wer Inhalte aendern will, braucht nur `content.js`.** Die Datei ist ein
einziges Objekt `INHALT` mit benannten Abschnitten. Ein neues Symptom ist ein
Eintrag mehr in einer Liste, ein neues Rezept ein Objekt mehr.

Nach einer Aenderung an `app.js`, `app.css` oder `content.js` sieht man die
neue Fassung beim uebernaechsten Start: der Service Worker liefert beim
naechsten Start noch die abgelegte Fassung und holt die neue im Hintergrund.
Zweimal schliessen und oeffnen genuegt.

### Schrift

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

`icon.svg` ist das Original. Die PNG-Dateien fuer iOS und den Manifest werden
daraus erzeugt. Das Skript dafuer liegt nicht im Repository, die Geometrie
steht im SVG.

---

## Daten, sonst nichts

- Kein Server, kein Konto, keine Anmeldung.
- `connect-src 'none'`: die Seite kann keine Verbindung nach draussen aufbauen,
  auch nicht aus Versehen und auch nicht, wenn spaeter jemand Code einfuegt.
- Keine Schrift, kein Skript, kein Bild von einer fremden Adresse.
- Keine Statistik, keine Zaehlpixel, keine Cookies.
- Keine Schrift von Google. Die Dateien liegen im Ordner `fonts/`.
- Keine Ortung. Die App fragt nie nach dem Standort.
- Die Seite traegt `noindex,nofollow`.

Was das kostet, steht oben unter Sicherung: was nur hier liegt, ist auch nur
hier.
