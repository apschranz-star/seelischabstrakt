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

---

## Was drin ist

| Bereich | Was er macht |
|---|---|
| **Heute** | Vier Skalen von 0 bis 10, Schlaf, Symptome, Gluten, Notiz. Was nicht angetippt wird, bleibt leer, und leer ist auch eine Antwort. |
| **Verlauf** | Linien ueber 14, 30 oder 90 Tage, Kalenderansicht, Tabelle, Nachtragen. |
| **Essen** | Was bei Zoeliakie weg muss, was in der Kueche wirklich zaehlt, Naehrstoffe, Rezepte. |
| **Wissen** | Die Kapitel aus dem Bericht, dazu Warnzeichen und die Fragenliste fuer den Termin. |
| **Mehr** | Medikamente, Laborwerte, Termine, Arztbericht, Sicherung, Darstellung. |

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

**Wer Inhalte aendern will, braucht nur `content.js`.** Die Datei ist ein
einziges Objekt `INHALT` mit benannten Abschnitten. Ein neues Symptom ist ein
Eintrag mehr in einer Liste, ein neues Rezept ein Objekt mehr.

Nach einer Aenderung an `app.js`, `app.css` oder `content.js` sieht man die
neue Fassung beim uebernaechsten Start: der Service Worker liefert beim
naechsten Start noch die abgelegte Fassung und holt die neue im Hintergrund.
Zweimal schliessen und oeffnen genuegt.

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
- Die Seite traegt `noindex,nofollow`.

Was das kostet, steht oben unter Sicherung: was nur hier liegt, ist auch nur
hier.
