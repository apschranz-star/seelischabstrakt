# alexanderschranz.at

Persönliches Portfolio, schwarzweiß, eine Seite. Kein Framework, kein Build. Alles Inhaltliche steht in portfolio.json.

## Pflegen
- portfolio.json in GitHub öffnen (Stift-Symbol), ändern, Commit. Eine Minute später live.
- Texte können ein einfacher String sein oder {"en": "...", "de": "..."}. Sobald irgendwo ein "de" steht, erscheint der Sprachschalter.
- Neues Projekt: einen Block in projects.items kopieren. "draft": true blendet einen Eintrag aus.
- Neuer Eintrag unter Aktuell: updates.items, Datum als JJJJ-MM oder JJJJ-MM-TT, neueste stehen automatisch oben.
- Bilder in portfolio/img ablegen (klein, unter 400 kB), Pfad img/name.jpg eintragen. Alle Bilder erscheinen schwarzweiß, in Farbe erst beim Darüberfahren.
- Der Bereich Kunst holt die Werke automatisch aus dem Shop (art.source). Nichts doppelt pflegen. art.max begrenzt die Anzahl.
- Reihenfolge und Namen der Bereiche: nav. Ein Bereich verschwindet, wenn sein Block in portfolio.json fehlt.
- Dunkel oder hell folgt dem System, der Knopf oben links schaltet um.

## Netlify einrichten (einmalig)
1. Netlify, Add new project, Import from Git, dasselbe Repository wählen.
2. Base directory: portfolio. Publish directory: portfolio. Build command leer.
3. Deploy. Dann Domain management, Add domain, alexanderschranz.at, DNS-Anleitung befolgen. HTTPS kommt automatisch.

## ChatGPT
Dem GPT diese Datei und portfolio.json zeigen und sagen, was neu ist. Er liefert den fertigen JSON-Block, den du in GitHub einfügst.
