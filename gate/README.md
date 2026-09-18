# Der Zugang

Ein Code, ein Link, alle Seiten. Wer den Link mit `?zugang=<Code>` öffnet, sieht die Seite, der Browser merkt sich den Zugang. Wer ohne Code kommt, sieht ein Feld. Nur der Kunst-Shop ist ohne Code offen.

    gate.snippet.html   die Vorlage, die in den Kopf jeder Seite gehört, mit Platzhaltern
    apply.py            setzt die Vorlage in eine Seite ein, mit Name, Betreiber und Kontakt
    inject.sh           schreibt den Zugangscode an die Stelle des Platzhalters, beim Veröffentlichen

Das Zugangsfenster nennt, bevor irgendetwas gespeichert ist, wer die Seite betreibt, was im Browser
abgelegt wird, bei wem die Seite liegt und dass es kein Tracking gibt. Das ist Art. 13 DSGVO und
gilt auch für eine Ansicht, die nur aus einem Feld besteht. Ein falscher Code wird im Feld selbst
abgewiesen, ohne dass eine Anfrage hinausgeht, und der Code steht nie in der Adresszeile, also auch
nicht im Serverprotokoll des Hosters. Ohne JavaScript bleibt das Formular als Weg, dann wird der
Code einmal über die Adresszeile geschickt.

Was das ist und was nicht: GitHub Pages liefert Dateien aus, es prüft nichts. Der Code steht in der ausgelieferten Seite, wer sie liest, findet ihn. Das hält Suchmaschinen und Zufallsbesucher fern, mehr nicht. Echter Schutz braucht einen Host, der vor der Auslieferung prüft, zum Beispiel Netlify mit Site protection im bezahlten Tarif.

## Wo der Code herkommt

Ein Repository-Secret namens `SITE_ACCESS_KEY`: github.com, Settings, Secrets and variables, Actions, New repository secret. Die Workflows für Farida, die persönliche Seite, Schranz AI und die JING-Demo lesen es. Fehlt es, veröffentlichen sie nichts und sagen das als Warnung, damit nie eine offene Fassung eine geschützte überschreibt.

Auf Netlify heißt dieselbe Variable `SITE_ACCESS_KEY` unter Site configuration, Environment variables. Ist sie leer, sind die Netlify-Seiten öffentlich. So kann die Praxisseite auf ihrer echten Adresse offen sein und die Vorschau auf GitHub Pages geschlossen.

## Eine Seite anschließen

Statische Seite: `python3 gate/apply.py <seite>/index.html "<Name der Seite>" "<Betreiber, Ort>" "<Kontakt>"`. Der Kontakt ist freiwillig, ohne ihn fällt die Zeile weg. Der Zugangscode bleibt dabei ein Platzhalter und kommt erst beim Veröffentlichen hinein. Im Workflow nach dem Kopieren `sh gate/inject.sh <pfad>/index.html "$KEY"` aufrufen. Gebaute Seite (schranz-ai): `build.mjs` liest `SITE_ACCESS_KEY` und setzt den Code beim Bauen ein.

Den Code ändern: das Secret ändern, die Workflows einmal laufen lassen. Alle alten Links hören auf zu funktionieren, Besucher sehen wieder das Feld.
