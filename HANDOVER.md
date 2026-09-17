# Übergabe: JING ohne Claude betreiben

JING ist ein Shop-Frontend für eine monochrome Beauty-Eigenmarke im DACH-Raum. Ein Repository, ein Ordner, eine Datei pro Frage. Diese Anleitung ist für Alexander und für den Custom GPT, der die Seite über GitHub pflegt.

    Code          Branch jing im Repository apschranz-star/seelischabstrakt
                  (später ein eigenes Repository apschranz-star/jing, siehe Teil 6)
    Demo          https://apschranz-star.github.io/seelischabstrakt/jing/
                  statisch, ohne Server, mit Hinweisband "Demonstration"
    Betrieb       Netlify, aus demselben Code, mit serverseitiger Kasse.
                  Der Start ist ein Prompt an den GPT, siehe LAUNCH.md

## Teil 1: Was wo steht

Alles, was ein Mensch ändert, liegt in drei Dateien. Der Rest ist Bauplan und wird nur angefasst, wenn sich die Seite anders verhalten soll.

    config/products.ts    die acht Produkte: Name, Text, Ritual, Preis in Cent, Füllmenge,
                          Herkunft, Verpackung, und der regulatorische Block je Produkt
                          (INCI, Allergene, Haltbarkeit, CPNP, Warnhinweise, CLP, WEEE)
    config/site.ts        Firma, Adresse, Rechtsdaten, Regionen DE AT CH mit Steuer, Versand,
                          Frei-ab-Grenze, Zahlarten, CHF-Kurs, Widerrufsfrist, Lager
    app/legal/*/page.tsx  die fünf Rechtsseiten: Impressum, AGB, Widerruf, Datenschutz, Versand

Was der Code daraus ableitet, ohne dass es jemand pflegen muss: den Grundpreis nach PAngV je 100 ml, 100 g, Liter oder Kilogramm; die Preise in CHF; die Bestellübersicht über dem Bestellknopf; den GPSR-Block mit verantwortlicher Person und Warnhinweisen; die Inhaltsstoff-Schublade; die Hygiene-Ausnahme beim Widerruf für Kosmetik; die Zollzeile für die Schweiz.

## Teil 2: Den Custom GPT anlegen

ChatGPT, Explore GPTs, Create. Name: JING Desk. Unter Actions oder Connectors GitHub verbinden und das Repository freigeben. Der GPT arbeitet direkt an den Dateien, es gibt keine eigene API.

Instructions, dieser Text hinein:

    Du pflegst den Code von JING, einem Beauty-Shop für Deutschland, Österreich und die Schweiz.
    Der Code liegt auf GitHub im Repository apschranz-star/seelischabstrakt, Branch jing.
    Sobald es ein eigenes Repository apschranz-star/jing gibt, dort auf main.

    Arbeitsweise: Vor jeder Änderung die Datei lesen, die du ändern willst, und HANDOVER.md.
    Ändere nur, was Alexander genannt hat. Eine Änderung ist ein Commit mit einem Satz,
    der sagt, was sich für Besucher ändert. Nach dem Commit läuft die CI (Typecheck, Lint,
    Build). Ist sie rot, lies den Fehler vor und behebe ihn, bevor du etwas anderes machst.

    Produkte: config/products.ts. Preise stehen in Cent, brutto, also 5400 für 54,00 Euro.
    Füllmenge als { value, unit } mit ml oder g, damit der Grundpreis stimmt. Jedes
    Kosmetikum braucht inci, allergens, pao, cpnpReference und warnings. Deklarierte
    Allergene müssen in der INCI-Liste stehen, der Code prüft das. Cyclopentasiloxane,
    Cyclotetrasiloxane und Cyclohexasiloxane dürfen in Leave-on-Produkten nicht vorkommen.
    Ein Set mit beiliegendem Kosmetikum bekommt den Block cosmetic im Accessory-Teil.

    Texte: kurze Sätze, konkret, keine Werbesprache, keine Ausrufezeichen, keine
    Gedankenstriche, keine Behauptungen ohne Beleg. Kein "frei von", kein Lichtschutz ohne
    LSF, keine Zahl ("acht Öle"), die die INCI-Liste nicht deckt, kein "nachfüllbar" ohne
    Nachfüllung im Katalog. Schweizer Schreibung mit ss in Produkttexten, deutsche in
    Rechtstexten.

    Regeln, die nicht verhandelbar sind:
    Preise, Adressen, Registernummern, CPNP-Referenzen, WEEE-Nummer und Rechtstexte nie
    erfinden. Fehlt eine Angabe, frage nach und lass den Platzhalter stehen.
    Werte in eckigen Klammern in config/site.ts sind Platzhalter, keine Daten.
    Die Rechtsseiten sind Entwürfe. Änderungen daran nur, wenn Alexander den Wortlaut gibt
    oder ein Anwalt ihn freigegeben hat.
    Keine Tokens, Schlüssel oder Passwörter in Dateien, Commits oder Antworten.
    Die Datei .github/workflows/ci.yml, next.config.ts, lib/ und components/ nur ändern,
    wenn Alexander eine Funktions- oder Designänderung ausdrücklich verlangt.

    Demo: Die öffentliche Seite unter apschranz-star.github.io/seelischabstrakt/jing/ ist ein
    statischer Export ohne Server. Sie wird nicht automatisch neu gebaut. Nach Änderungen
    sagst du Alexander, dass die Demo einen neuen Export braucht (Teil 4).

    Wenn die CI einen Fehler meldet, gib den Wortlaut vollständig weiter und erkläre ihn.

## Teil 3: Typische Änderungen

Preis ändern: in config/products.ts beim Produkt priceCents setzen, Cent, brutto. Der Grundpreis, die CHF-Anzeige und alle Summen folgen.

Text ändern: description, tagline oder ritual beim Produkt. Ein Satz, der eine Eigenschaft behauptet, braucht eine Grundlage in inci oder in den Daten.

Versandkosten oder Frei-ab-Grenze: config/site.ts, REGIONS, shippingCents und freeShippingCents in Cent der jeweiligen Währung. Die Zollpauschale für die Schweiz steht in customs.clearanceCents.

Zahlart in einer Region an- oder abschalten: REGIONS[Land].paymentMethods. Klarna und EPS sind für die Schweiz gesperrt, TWINT nur dort erlaubt; der Server weist alles andere ab.

Firmendaten: SITE.legalEntity und RESPONSIBLE_PERSON in config/site.ts. Alle Werte in eckigen Klammern ersetzen. Impressum, Widerrufsbelehrung und GPSR-Block lesen daraus.

Neues Produkt: einen Eintrag in PRODUCTS kopieren, id, slug, code, order eindeutig vergeben, Füllmenge und regulatorischen Block vollständig ausfüllen. Die Produktseite entsteht beim Build von selbst.

## Teil 4: Prüfen und ausspielen

Lokal, in einem Terminal im Ordner des Codes:

    npm ci
    npm run typecheck
    npm run lint
    npm run build

Alle drei müssen ohne Fehler durchlaufen. Dasselbe fährt die CI bei jedem Push.

Demo neu bauen und veröffentlichen:

    scripts/build-static-demo.sh /seelischabstrakt/jing https://apschranz-star.github.io/seelischabstrakt/jing

Das schreibt den Ordner out. Dessen Inhalt gehört auf den Branch gh-pages des Repositories seelischabstrakt in den Unterordner jing. Der Workflow der Praxisseite lässt diesen Ordner in Ruhe.

Echter Betrieb: Netlify. Die Datei netlify.toml im Code sagt Netlify alles, was es wissen muss, Environment-Variablen braucht es keine. Der Start steht in LAUNCH.md als ein Prompt für den GPT, mit dem Weg über die Netlify-Oberfläche als Ersatz. Danach baut jeder Push auf den Branch die Seite neu, und die Kasse rechnet serverseitig.

## Teil 5: Vor dem Verkauf

Die Tabelle "Vor dem Livegang zu erledigen" in README.md ist die Liste. Kurz: Produktfotos (Art. 19 GPSR verlangt eine Abbildung, eine Silhouette ist keine), Firmendaten, echte CPNP-Referenzen, WEEE-Registrierung, Zahlungsanbieter mit Vertrag und Schlüssel, anwaltliche Freigabe der fünf Rechtsseiten, Steuer- und Versandwerte bestätigt, Entscheidung zur Content Security Policy. Solange davon etwas fehlt, bleibt das Hinweisband "Demonstration" auf der öffentlichen Seite.

## Teil 6: Umzug in ein eigenes Repository

GitHub, New repository, Name jing, Private, keine Häkchen bei README, .gitignore oder Lizenz. Dann in einem Terminal:

    git clone https://github.com/apschranz-star/seelischabstrakt.git -b jing jing
    cd jing
    git remote set-url origin https://github.com/apschranz-star/jing.git
    git push -u origin jing:main

Danach den Branch jing im alten Repository löschen, in den GPT-Instructions das neue Repository eintragen und in Netlify unter Site configuration, Build and deploy, Repository das neue Repository verbinden. Der Demo-Ordner auf gh-pages bleibt, bis die Netlify-Seite läuft.
