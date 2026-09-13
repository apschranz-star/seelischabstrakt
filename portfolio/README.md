# alexanderschranz.netlify.app

Ein persönliches Journal im Zeitungssatz, schwarzweiß, ohne Framework und ohne Build. Zwei Seiten:

    index.html    das Journal, fünf nummerierte Einträge
    photos.html   die Tafeln, nichts als Fotos
    journal.json  der gesamte Inhalt beider Seiten
    img/          die Fotos

## Pflegen
Alles steht in journal.json. In GitHub öffnen, Stift-Symbol, ändern, Commit. Eine Minute später live.

- Jeder Text ist ein Paar: {"en": "...", "de": "..."}. Fehlt Deutsch, wird Englisch gezeigt.
- Neuer Eintrag: einen Block in "entries" kopieren, id vergeben, Texte schreiben. Die Nummerierung I, II, III läuft automatisch mit.
- "draft": true schreibt einen Eintrag, veröffentlicht ihn aber nicht. Der Eintrag "seen" ist so ein Entwurf und wartet auf deine Reisen.
- Bild je Eintrag: "figure" mit src, caption und layout. "block" stellt es neben den Text, "plate" über die ganze Breite. Leeres src heißt kein Bild.
- Kasten mit Fakten: "factbox" in einem Eintrag, mit title und items.
- Zitat zwischen den Linien: "pullquote".
- Tafelseite: Einträge in "plates.items" ergänzen, Reihenfolge ist die Reihenfolge auf der Seite.
- Fotos nach img/ legen, klein halten, 1400 px lange Seite und unter 450 kB. Alle Bilder erscheinen in einer Farbe, wie im Druck.
- Kopfzeile, Motto und Kolophon stehen in "masthead" und "colophon".

## Was die Seite bewusst nicht hat
Keinen Lebenslauf, keine Firmennamen, keinen Beruf, nichts zu verkaufen, keine Links nach außen außer der E-Mail. Wer das wieder will, findet die frühere Fassung in der Git-Historie.

## Impressum
Die Seite hat keinen Impressumslink. Sobald sie beruflich verschickt wird, gehört einer dazu: Name, Adresse, E-Mail. Entweder als eigener Eintrag im Kolophon oder als kleine impressum.html im Ordner.

## Netlify einrichten (einmalig)
1. Netlify, Add new project, Import from Git, dasselbe Repository wählen.
2. Base directory: portfolio. Publish directory: portfolio. Build command leer.
3. Deploy, dann Project configuration, General, Change project name: alexanderschranz.
4. Eigene Domain später: Domain management, Add domain. Danach die Adresse in index.html (canonical), photos.html, sitemap.xml und robots.txt tauschen.

## ChatGPT
journal.json und diese Datei zeigen, beschreiben, was neu ist, den fertigen JSON-Block zurückkopieren.
