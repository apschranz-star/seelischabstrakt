# Der Zugang

Ein Code, ein Link, alle Seiten. Wer den Link mit `?zugang=<Code>` öffnet, sieht die Seite, der Browser merkt sich den Zugang. Wer ohne Code kommt, sieht ein Feld. Nur der Kunst-Shop ist ohne Code offen.

    gate.snippet.html   der Code, der in den Kopf jeder Seite gehört, mit dem Platzhalter __ACCESS_KEY__
    inject.sh           schreibt den Code an die Stelle des Platzhalters, beim Veröffentlichen

Was das ist und was nicht: GitHub Pages liefert Dateien aus, es prüft nichts. Der Code steht in der ausgelieferten Seite, wer sie liest, findet ihn. Das hält Suchmaschinen und Zufallsbesucher fern, mehr nicht. Echter Schutz braucht einen Host, der vor der Auslieferung prüft, zum Beispiel Netlify mit Site protection im bezahlten Tarif.

## Wo der Code herkommt

Ein Repository-Secret namens `SITE_ACCESS_KEY`: github.com, Settings, Secrets and variables, Actions, New repository secret. Die Workflows für Farida, die persönliche Seite, Schranz AI und die JING-Demo lesen es. Fehlt es, veröffentlichen sie nichts und sagen das als Warnung, damit nie eine offene Fassung eine geschützte überschreibt.

Auf Netlify heißt dieselbe Variable `SITE_ACCESS_KEY` unter Site configuration, Environment variables. Ist sie leer, sind die Netlify-Seiten öffentlich. So kann die Praxisseite auf ihrer echten Adresse offen sein und die Vorschau auf GitHub Pages geschlossen.

## Eine Seite anschließen

Statische Seite: den Inhalt von `gate.snippet.html` in den `<head>` der index.html einfügen, direkt nach dem viewport-Tag, `__SITE_NAME__` durch den Namen der Seite ersetzen, `__ACCESS_KEY__` stehen lassen. Im Workflow nach dem Kopieren `sh gate/inject.sh <pfad>/index.html "$KEY"` aufrufen. Gebaute Seite (schranz-ai): `build.mjs` liest `SITE_ACCESS_KEY` und setzt den Code beim Bauen ein.

Den Code ändern: das Secret ändern, die Workflows einmal laufen lassen. Alle alten Links hören auf zu funktionieren, Besucher sehen wieder das Feld.
