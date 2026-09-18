# Websites mit ChatGPT bauen und betreiben

Ja, das geht. ChatGPT kann über den GitHub-Connector Dateien in deinen Repositories lesen und schreiben. Alles, was danach passiert, macht die Infrastruktur von selbst: Netlify oder ein GitHub-Workflow baut die Seite und stellt sie live. Dieses Kit sagt, welche Dateien es dafür braucht, welche Bauart für welchen Zweck passt, und woran ein GPT eine gute Seite von einer schlechten unterscheidet.

Alles hier bezieht sich auf dieses Repository `apschranz-star/seelischabstrakt`. Es enthält vier fertige Seiten, die als Vorlagen dienen:

    /                 seelischabstrakt, Kunst-Shop, statisch, Netlify-Funktionen für Bestellung und Admin
    /portfolio        alexanderschranz.netlify.app, persönliche Seite mit Journal, journal.json als Inhalt
    /farida           Praxisseite, fünf Sprachen, content.json als Inhalt, kein Build
    /schranz-ai       SCHRANZ AI SOLUTIONS, Pitchdeck als Website, zwei Sprachen, content.json plus build.mjs
    Branch jing       JING, Beauty-Shop, Next.js, serverseitige Kasse, eigene Übergabe in HANDOVER.md

## Teil 1: Was ChatGPT kann und was nicht

Kann: Dateien lesen, ändern, neue anlegen, committen. Texte schreiben und übersetzen. JSON pflegen. Fehler aus einer CI-Meldung lesen und beheben. Daraus folgt: Alles, was eine Seite ausmacht, muss in Dateien im Repository liegen, und ein Push muss reichen, damit die Seite live geht.

Kann nicht: Befehle ausführen, `npm run build` starten, einen Browser öffnen, Screenshots ansehen, in Netlify klicken, Domains kaufen, Zugangsdaten verwalten. Bauen und Ausspielen übernehmen deshalb Netlify (liest `netlify.toml`) oder GitHub Actions (liest `.github/workflows/*.yml`). Beides ist in diesem Repository eingerichtet und kopierbar.

Grenze, die bleibt: ChatGPT sieht die fertige Seite nicht. Vor jeder Freigabe schaust du selbst auf die Live-Adresse, am Telefon und am Rechner.

## Teil 2: Einmal einrichten

1. ChatGPT, Explore GPTs, Create. Name zum Beispiel "Web Desk". Unter Actions oder Connectors GitHub verbinden, dieses Repository freigeben. Für jedes neue Repository später dasselbe.
2. Netlify ist mit GitHub verbunden. Jede Seite ist dort ein eigenes Projekt aus demselben Repository mit eigenem Base directory (`farida`, `portfolio`, `schranz-ai`). Die Datei `netlify.toml` im jeweiligen Ordner regelt den Rest.
3. Instructions des GPT, diesen Text hinein:

```
Du baust und pflegst Websites von Alexander Schranz. Der Code liegt auf GitHub im Repository
apschranz-star/seelischabstrakt. Jede Seite ist ein Ordner. Lies zuerst SITE-KIT.md, dann die
README.md des Ordners, den du änderst.

Arbeitsweise: Vor jeder Änderung die Datei lesen, die du ändern willst. Ändere nur, was
Alexander genannt hat. Eine Änderung ist ein Commit mit einem Satz, der sagt, was sich für
Besucher ändert. Läuft danach ein Workflow oder ein Netlify-Build rot, lies den Fehler vor und
behebe ihn, bevor du etwas anderes machst.

Inhalte stehen in JSON-Dateien (content.json, journal.json, works.json, site.json). Dort nur
Werte ändern, nie Schlüssel umbenennen, nie die Struktur ändern, nie eine Sprache leer lassen.
Nach einer JSON-Änderung prüfst du, dass die Datei gültiges JSON ist: jede Klammer geschlossen,
jedes Komma gesetzt, keine Kommentare.

Texte: kurze Sätze, konkret, keine Werbesprache, keine Ausrufezeichen, keine Gedankenstriche,
keine Behauptungen ohne Beleg. Deutsch mit österreichischer Färbung, Englisch schlicht.

Regeln, die nicht verhandelbar sind:
Preise, Adressen, Registernummern, Zahlen und Rechtstexte nie erfinden. Fehlt eine Angabe,
frag nach und lass einen Platzhalter in eckigen Klammern stehen.
Keine Tokens, Schlüssel oder Passwörter in Dateien, Commits oder Antworten. Schickt Alexander
dir einen, sag ihm, dass er ihn rotieren soll.
Dateien mit Namen index.html, build.mjs, netlify.toml und alles unter .github/ nur ändern, wenn
Alexander eine Funktions- oder Designänderung ausdrücklich verlangt.
Werke im Kunst-Shop nie löschen, verkauft heißt available false.

Eine neue Seite baust du nach Teil 3 von SITE-KIT.md: Ordner kopieren, content.json ersetzen,
netlify.toml und Workflow anpassen, README schreiben. Danach sagst du Alexander, welches Netlify-
Projekt er anlegen muss und mit welchem Base directory.
```

## Teil 3: Eine neue Seite bauen

Drei Bauarten, je nach Zweck. Alle drei liegen fertig im Repository.

### A. Firmen- oder Informationsseite, ein- oder mehrsprachig

Vorlage: `schranz-ai/`. Eine JSON-Datei mit allen Texten in allen Sprachen, ein Build-Skript ohne Abhängigkeiten, das daraus fertige HTML-Seiten schreibt: pro Sprache eine Startseite, Impressum, Datenschutz, 404, Sitemap, robots. Design nach Apple-Art: Systemschrift, viel Weißraum, ein Akzent, hell und dunkel.

Schritte für den GPT:

1. Ordner `schranz-ai` als `<neuer-name>` kopieren. `dist/` nicht mitkopieren.
2. `content.json` neu schreiben. Die Schlüssel bleiben, die Werte ändern sich. Sektionen, die es für diese Firma nicht braucht, werden aus `build.mjs` in der Funktion `homePage` entfernt, nie im JSON halb leer gelassen.
3. In `content.json` unter `site.url` die künftige Adresse eintragen, unter `legal` Impressum und Datenschutz mit den echten Daten. Fehlen sie, Platzhalter in eckigen Klammern.
4. `netlify.toml` bleibt wie sie ist. Für GitHub Pages den Workflow `.github/workflows/schranz-ai-pages.yml` kopieren, `schranz-ai` durch den neuen Ordnernamen ersetzen, und in `farida-pages.yml` den Ordner in die Zeile mit `! -name jing ! -name schranz-ai` aufnehmen.
5. `README.md` im Ordner: was die Seite ist, wo sie live liegt, was vor der Ankündigung fehlt.

Was das Skript prüft: Fehlt eine Sprache in einem Text, bricht der Build ab und nennt den Pfad. Summen (zum Beispiel Mittelverwendung) werden nachgerechnet.

### B. Blog, Journal, Praxis- oder Personenseite ohne Build

Vorlage: `farida/` (mehrsprachig, Inhalte in `content.json`, die Seite lädt sie im Browser) oder `portfolio/` (Journal in `journal.json`, Kommentare über eine Netlify-Funktion). Kein Build, kein Node. Ein neuer Beitrag ist ein neuer Eintrag im JSON, `"draft": true` hält ihn zurück, bis er fertig ist.

Wann A statt B: Wenn die Seite von Google gefunden werden soll und mehr als eine Handvoll Seiten hat. Beim Muster B steht der Text nicht im HTML, sondern kommt per Skript. Für eine Arztpraxis mit einer Seite ist das egal, für einen Blog mit fünfzig Beiträgen nicht. Dann Muster A nehmen und pro Beitrag eine Seite erzeugen lassen. Der GPT erweitert dafür `build.mjs` um eine Schleife über `content.posts`, jede mit eigenem Ordner und eigener `index.html`.

### C. Shop

Vorlage: Branch `jing` (Next.js, Kasse serverseitig, Regionen DE AT CH, PAngV-Grundpreis, GPSR-Block, Rechtsseiten als Entwurf). Übergabe in `HANDOVER.md` auf dem Branch, Start auf Netlify in `LAUNCH.md`, alle Assets in `KIT.md`. Ein Shop ist die einzige Bauart, die einen Server braucht (Preise dürfen nicht im Browser gerechnet werden). Er ist auch die einzige, bei der Recht die Struktur bestimmt: Widerruf, AGB, Preisangaben, Produktsicherheit. Neue Shops nicht von Null, sondern als Kopie von JING mit neuer `config/products.ts` und `config/site.ts`.

Der einfache Kunst-Shop im Wurzelordner (`works.json`, `site.json`, Bestellung per Netlify-Funktion) ist der Sonderfall für Einzelstücke ohne Warenkorb.

## Teil 4: Woran eine gute Seite zu erkennen ist

Der GPT kann die Seite nicht sehen. Er kann aber die Regeln kennen, nach denen sie gebaut ist, und du kannst sie prüfen.

Text und Struktur
- Eine Aussage pro Absatz. Der erste Satz sagt, worum es geht.
- Überschriften sind Aussagen, keine Etiketten. "Der Markt in drei ehrlichen Zahlen", nicht "Markt".
- Jede Zahl hat eine Quelle oder stammt vom Auftraggeber. Nichts wird gerundet, was er nicht gerundet hat.
- Nummerierung nur, wo eine Reihenfolge Bedeutung hat (Methode, Meilensteine). Vier gleichrangige Punkte bekommen keine Nummern.

Design
- Eine Schriftfamilie, höchstens zwei. Größenkontrast statt Farbkontrast.
- Zwei Neutraltöne und ein Akzent. Der Akzent für Zustände und Links, nicht für Dekoration.
- Weißraum ist Struktur. Sektionen 72 bis 140 px Abstand, Textzeilen 60 bis 75 Zeichen breit.
- Hell und dunkel, beide gestaltet, nicht invertiert.
- Bewegung als Ankunft, nicht als Show: Elemente erscheinen einmal beim Scrollen, Zahlen zählen einmal hoch, sonst Ruhe. `prefers-reduced-motion` schaltet alles ab.

Technik
- Alles im HTML, ohne JavaScript lesbar. Skripte sind Zugabe.
- Keine externen Skripte außer Schriften. Keine Cookies ohne Grund, dann Einwilligung.
- Lighthouse 95 oder besser in allen vier Kategorien. Layout-Shift null: Nichts springt, nachdem es sichtbar wurde.
- Bilder mit Breite, Höhe und `alt`. Formate WebP oder AVIF, unter 200 kB.
- `<title>`, `description`, `canonical`, `hreflang` je Sprache, `og:`-Tags, Sitemap, robots.

Recht im DACH-Raum, Mindeststand
- Impressum: Name, Anschrift, E-Mail, bei Firmen Rechtsform, Firmenbuch, UID, Aufsichtsbehörde, Kammer. Österreich § 5 ECG und § 25 MedienG, Deutschland § 5 DDG.
- Datenschutzerklärung, die beschreibt, was die Seite wirklich tut: Hosting, Schriften, Formulare, Analyse. Eine Seite ohne Cookies braucht kein Cookie-Banner.
- Shop zusätzlich: AGB, Widerrufsbelehrung mit Muster-Formular, Preise brutto mit Grundpreis, Versandkosten vor der Bestellung, Button "zahlungspflichtig bestellen", GPSR-Angaben je Produkt, Kosmetik mit INCI.
- Rechtstexte sind Entwürfe, bis ein Anwalt sie freigibt. Der GPT schreibt sie nur mit Wortlaut vom Auftraggeber oder aus einer benannten Vorlage.

## Teil 5: Betrieb

Der Ablauf für jede Änderung:

1. Alexander sagt dem GPT, was sich ändern soll.
2. Der GPT liest die Datei, ändert den Wert, committet mit einem Satz.
3. Netlify oder der Workflow baut. Grün: Seite ist live. Rot: der GPT liest den Fehler und behebt ihn.
4. Alexander sieht sich die Live-Adresse an.

Prüfen, ob es lief: GitHub, Reiter Actions, letzter Lauf grün. Netlify, Deploys, oberster Eintrag Published.

Was der GPT nie allein entscheidet: Design, Struktur, Rechtstexte, Preise, Löschen. Was er allein macht: Texte, Übersetzungen, neue Einträge, Tippfehler, Bilder ersetzen, die Alexander hochgeladen hat.

Bilder: der GPT kann keine Dateien hochladen. Weg: github.com, Ordner `img` der Seite, Add file, Upload files. Danach dem GPT den exakten Dateinamen nennen.

## Teil 6: Prompts, die funktionieren

Neue Seite:

    Baue eine neue Seite nach Muster A aus SITE-KIT.md im Ordner <name>. Firma: <Name>, Ort: <Ort>.
    Sprachen: Deutsch und Englisch. Inhalte: <Text oder Datei>. Impressum und Datenschutz mit
    diesen Daten: <Daten>. Was fehlt, als Platzhalter lassen und mir eine Liste geben.

Änderung:

    In <ordner>/content.json den Preis von <Produkt> auf <Wert> setzen. Sonst nichts.

Neuer Beitrag:

    Im Journal (portfolio/journal.json) einen neuen Eintrag mit Datum <Datum>, Titel <Titel> und
    diesem Text anlegen: <Text>. Als Entwurf, draft true.

Fehler:

    Der letzte Workflow ist rot. Lies den Fehler in Actions, erkläre ihn mir in zwei Sätzen und
    behebe ihn.
