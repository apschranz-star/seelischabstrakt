# Betriebsanleitung für KI-Assistenten (ChatGPT, Claude)

Du hilfst Alexander Schranz, den Shop seelischabstrakt zu pflegen. Lies das hier zuerst, dann handle.

## Was der Shop ist
Eine statische Website (kein Framework, kein Build, keine Datenbank) in einem GitHub-Repository, das Netlify automatisch veröffentlicht. Jede Änderung an einer Datei im Repository ist etwa eine Minute später live.

## Dateien und was du damit tun darfst
- works.json: die Produkte. Hier kommen neue Werke hinein, Preise, "available": false für verkauft, Captions in EN und DE. Struktur nie ändern, nur Werte und Einträge. Feld "img" zeigt auf eine Datei in img/.
- site.json: alle Texte (EN/DE), Farben, Schriften, Layout, Versandkosten, Steuerflag, rechtliche Angaben. Werte ändern erlaubt, Schlüssel nicht umbenennen.
- img/: Fotos. Dateinamen klein, mit Bindestrichen, .jpg, maximal 1600 px lange Seite.
- index.html, admin.html, add.html, netlify/functions/works.js, netlify.toml: Code. Nur ändern, wenn Alexander ausdrücklich eine Design- oder Funktionsänderung wünscht. Dann immer die ganze Datei zurückgeben, nie Ausschnitte. Nie index.html und admin.html im selben Schritt umbauen.
- README.md: Anleitung für Menschen. Dieses Dokument: Anleitung für dich.

## Wenn du keine Action hast: der Block für /add
Gib das Werk als einen einzigen JSON-Block aus, ohne Kommentar davor oder danach, genau in dieser Form. Alexander kopiert ihn in das Feld "Aus ChatGPT einfügen" auf seelischabstrakt.netlify.app/add, wählt das Foto und tippt Veröffentlichen.

{"title":"Kopf, rot","w":30,"h":24,"year":2026,"price":380,"medium":{"de":"Ölkreide und Acryl auf Papier, gerahmt","en":"Oil stick and acrylic on paper, framed"},"caption":{"de":"Roter Grund, weiße Spachtelzüge.","en":"Red ground, white knife strokes."},"nomat":false,"prints":[{"size":"30 × 40","price":95}]}

Regeln: w und h in cm als Zahl, price in EUR als Zahl, prints leer lassen ([]) wenn keine Drucke, nomat true nur wenn das Foto bereits Rahmen und Teppich zeigt. Captions schreibst du selbst.

## Der schnellste Weg, ein Werk anzulegen (mit Action)
Wenn du eine Action "upsertWork" hast (Custom GPT): rufe sie mit title, w, h (cm), medium {en, de}, caption {en, de}, price (EUR), optional prints [{size, price}] auf. Captions schreibst du selbst: ein bis zwei Sätze, konkret, roh, keine Werbesprache, keine Ausrufezeichen, keine Gedankenstriche. Fotos kannst du nicht hochladen; sag Alexander, er soll das Foto unter /add oder im Studio desk nachlegen, oder gib der Action eine öffentliche Bild-URL mit.

Wenn du keine Action hast: erzeuge den fertigen JSON-Block für works.json und sag ihm, er soll ihn im Studio desk oder direkt in GitHub (Stift-Symbol auf der Datei) einfügen. Komma-Regeln beachten.

## Tonalität der Texte
Atelier in Wien, kleine Formate, Teppich als Bühne, "Multum in parvo." Sätze kurz. Deutsch in österreichischer Färbung, Englisch schlicht. Keine Gedankenstriche im Text.

## Was du nie tust
- Preise oder Rechtstexte erfinden. Bei Unsicherheit fragen.
- Den Desk-Schlüssel oder Tokens irgendwo hinschreiben.
- Werke löschen, ohne dass Alexander es ausdrücklich sagt (verkauft = "available": false, nicht löschen).
- Die Struktur von works.json oder site.json verändern.

## Wenn etwas kaputt ist
Seite zeigt keine Werke: fast immer ein fehlendes Komma in works.json oder site.json. Datei durch einen JSON-Prüfer laufen lassen, Zeile korrigieren.
/add oder die Action meldet 401: Desk-Schlüssel falsch (Netlify, Environment variables, DESK_KEY).
Meldet 500 mit GitHub: Token abgelaufen oder ohne Schreibrecht (Contents: Read and write). Neuen Token erzeugen, in Netlify als GITHUB_TOKEN eintragen, neu deployen.
Netlify baut nicht: Deploys öffnen, Log lesen, meist steht der Dateiname dort.
