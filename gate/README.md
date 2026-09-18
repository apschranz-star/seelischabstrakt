# Der Zugang

Ein Code, ein Link, alle Seiten. Wer den Link mit `?zugang=<Code>` öffnet, sieht die Seite, der Browser merkt sich den Zugang. Wer ohne Code kommt, sieht ein Feld. Nur der Kunst-Shop ist ohne Code offen.

    gate.snippet.html   die Vorlage, die in den Kopf jeder Seite gehört, mit Platzhaltern
    apply.py            setzt die Vorlage in eine Seite ein, mit Name, Betreiber und Kontakt
    inject.sh           schreibt den Zugangscode an die Stelle des Platzhalters, beim Veröffentlichen

Das Zugangsfenster nennt, bevor irgendetwas gespeichert ist, wer die Seite betreibt, was im Browser
abgelegt wird, bei wem die Seite liegt und dass es kein Tracking gibt. Das ist Art. 13 DSGVO und
gilt auch für eine Ansicht, die nur aus einem Feld besteht.

Ein falscher Code wird im Feld selbst abgewiesen, ohne dass eine Anfrage hinausgeht. Ein Code, der
über `?zugang=` kommt, wird sofort nach der Prüfung aus der Adresszeile genommen: er steht dann in
keinem Verlauf, in keinem Referrer der nächsten Seite und in nichts, was jemand kopiert und
weitergibt. Im Protokoll des Hosters steht er trotzdem, denn die erste Anfrage ging mit ihm hinaus.
Wer das nicht will, gibt den Code im Feld ein, statt ihn im Link mitzuschicken. Alle anderen
Parameter der Adresse bleiben stehen, ein Deep Link überlebt den Zugang also.

Nimmt der Browser nichts in den lokalen Speicher, etwa in einem privaten Fenster, öffnet der richtige
Code die Seite für diesen Besuch trotzdem. Beim nächsten Aufruf steht wieder das Feld.

## Was das ist und was nicht

GitHub Pages liefert Dateien aus, es prüft nichts. Der Code steht in der ausgelieferten Seite, wer sie
liest, findet ihn. Das hält Suchmaschinen und Zufallsbesucher fern, mehr nicht. Echter Schutz braucht
einen Host, der vor der Auslieferung prüft, zum Beispiel Netlify mit Site protection im bezahlten Tarif.

Ohne JavaScript gibt es weder das Feld noch die Sperre: das Tor wird im Browser gezeichnet, und wo
nichts läuft, liegt die Seite offen. Genau deshalb schreibt `inject.sh` beim Veröffentlichen zusätzlich
ein festes `<meta name="robots" content="noindex,nofollow">` in die Datei, und `schranz-ai/build.mjs`
tut dasselbe beim Bauen. Das ist die eine Anweisung, die auch ein Crawler ohne JavaScript liest, und
Suchmaschinen fernzuhalten ist die Aufgabe, die dieses Tor wirklich erfüllen kann.

## Wo der Code herkommt

Ein Repository-Secret namens `SITE_ACCESS_KEY`: github.com, Settings, Secrets and variables, Actions,
New repository secret. Alle fünf Workflows lesen es zuerst.

Fehlt das Secret, lesen sie den Code aus der zuletzt veröffentlichten Ausgabe der jeweiligen Seite
zurück. So läuft ein Repository ohne Secret weiter, aber es ist der schlechtere Weg: jede Seite hat
dann ihre eigene Quelle, die Codes können auseinanderlaufen, und geht die veröffentlichte Ausgabe
verloren, ist der Code weg. Findet ein Lauf ihn weder so noch so, bricht er ab und veröffentlicht
nichts, damit nie eine offene Fassung eine geschützte überschreibt.

Eine Datei mit dem Code gibt es nirgends und darf es nicht geben: das Repository ist öffentlich.

Auf Netlify heißt dieselbe Variable `SITE_ACCESS_KEY` unter Site configuration, Environment variables.
Ist sie leer, sind die Netlify-Seiten öffentlich. So kann die Praxisseite auf ihrer echten Adresse
offen sein und die Vorschau auf GitHub Pages geschlossen.

## Eine Seite anschließen

Statische Seite: `python3 gate/apply.py <seite>/index.html "<Name der Seite>" "<Betreiber, Ort>" "<Kontakt>"`.
Der Kontakt ist freiwillig, ohne ihn fällt die Zeile weg. Der Block landet hinter der Content-Security-Policy
der Seite, wenn es eine gibt, sonst hinter dem viewport-Tag. Der Zugangscode bleibt dabei ein Platzhalter
und kommt erst beim Veröffentlichen hinein. Im Workflow nach dem Kopieren `sh gate/inject.sh <pfad>/index.html "$KEY"`
aufrufen, für jede Seite des Ordners, nicht nur für die Startseite. Gebaute Seite (schranz-ai): `build.mjs`
liest `SITE_ACCESS_KEY` und setzt den Code beim Bauen ein; fehlt dabei `gate.snippet.html`, bricht der Bau ab,
statt still eine offene Seite zu schreiben.

Den Code ändern: das Secret ändern, die Workflows einmal laufen lassen. Alle alten Links hören auf zu
funktionieren, Besucher sehen wieder das Feld.
