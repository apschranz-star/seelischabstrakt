# Bar Oasi Cafè

Anteprima di studio fuer die Bar an der Via Cassia 67 in Acquapendente.
Eine einzige Datei, keine fremde Adresse, kein Bauschritt.

    index.html    die ganze Seite, Schriften als data-URI eingebettet
    img/          die beiden Portraets, von der Familie
    pruefe.js     die Pruefung, ohne Browser und ohne ein einziges Paket
    UEBERGABE.md  der Text, mit dem ChatGPT die Seite uebernimmt

Vor jedem Commit:

    node oasi/pruefe.js

Das sieht nach, ob der Kopf der Seite vollstaendig ist, ob eine Uebersetzung
fehlt oder tot ist, ob die Platzhalter {h} und {g} noch stimmen, ob ein src auf
eine fremde Adresse zeigt, ob der Entwurfsstreifen noch da ist und wie viele
Platzhalter im Impressum offen sind. Der Workflow fuehrt dasselbe noch einmal
aus und veroeffentlicht nichts, wenn etwas fehlt.

Italienisch ist die Seite selbst, Deutsch und Englisch kommen aus dem
Woerterbuch in index.html. Ohne JavaScript bleibt Italienisch stehen, und das
ist fuer ein italienisches Lokal die richtige Sprache.

## Wohin die Seite kommt

    https://apschranz-star.github.io/seelischabstrakt/oasi/

Dorthin legt sie .github/workflows/oasi-pages.yml, sobald auf dem Zweig main
etwas in oasi/ liegt. Hinter demselben Zugangscode wie die uebrigen
Vorschauen, mit noindex, und oasi steht in .github/pages-owned.txt, damit der
Workflow der Praxisseite den Ordner stehen laesst.

Der Workflow bricht ab und veroeffentlicht nichts, wenn der Seite das doctype,
das charset oder das viewport-Tag fehlt, wenn ein src auf eine fremde Adresse
zeigt, wenn eines der beiden Portraets fehlt oder wenn der Entwurfsstreifen
nicht mehr da ist. Das Letzte ist der wichtigste Punkt: solange Telefonnummer,
Oeffnungszeiten und Rechtsdaten nicht bestaetigt sind, muss die Seite selbst
sagen, dass sie nicht die offizielle ist.

## Was vor einer Veroeffentlichung fehlt

- Fotos vom Lokal. Die in der Google-Liste gehoeren Google.
- Ragione sociale, Partita IVA, REA, E-Mail. Stehen als [da inserire] drin und
  werden nicht erfunden.
- Bestaetigung von Fabio: Oeffnungszeiten, Telefonnummer, und ob diese Nummer
  auf WhatsApp liegt. Alle WhatsApp-Knoepfe haengen daran.
- Faridas Einverstaendnis fuer ihr Foto und die Erwaehnung ihres Berufs.
- Der Ort des Gemuesegartens, falls er genannt werden soll. Im Moment steht da
  nur "ein paar Kilometer entfernt", und das stimmt sicher.

Der Streifen oben sagt, dass es ein Entwurf ist und nicht die offizielle Seite.
Der bleibt, bis die Punkte oben erledigt sind.
