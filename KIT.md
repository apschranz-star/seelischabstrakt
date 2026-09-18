# JING Kit

Eine Datei mit allem, was für Betrieb und Weiterentwicklung nötig ist. Für Alexander und für den GPT, der die Seite pflegt. Stand 17. September 2026.

## Adressen

    Code (GitHub)      https://github.com/apschranz-star/seelischabstrakt/tree/jing
    Vorschau           https://apschranz-star.github.io/seelischabstrakt/jing/?zugang=5rdoHGJM3mlN
                       ohne den Zugang im Link zeigt die Seite nur ein Codefeld, der Code ist 5rdoHGJM3mlN
    Bewertungsbericht  https://claude.ai/artifact/Km7bwuMmEeSafTkd5ccnfG
    CI                 https://github.com/apschranz-star/seelischabstrakt/actions (Workflow CI, Branch jing)

Der Zugangscode hält Suchmaschinen und Zufallsbesucher fern, mehr nicht. Ein statischer Export trägt den Code und jede Seite in seinen Dateien. Echter Schutz braucht einen Host, der vor der Auslieferung prüft (Netlify: Site protection, bezahlter Tarif).

## Stand

- Code: Next.js 16.3.5, TypeScript strict, Tailwind v4, zustand. Zehn Produkte. CI mit Typecheck, Lint, Build bei jedem Push. npm audit ohne Befund.
- Geprüft: zwei Audits mit 58 unabhängig bestätigten Befunden, 57 behoben. Lighthouse auf dem finalen Build 100 für Barrierefreiheit, Best Practices und SEO auf jeder Seite, Performance 100 Desktop, 91 bis 98 Handy.
- Regulatorik im Code: Grundpreis nach PAngV, Bestellübersicht über dem Bestellknopf (§ 312j BGB), Widerrufsbelehrung nach dem Muster, Hygiene-Ausnahme im Kaufweg, GPSR-Block mit verantwortlicher Person, INCI mit Allergenen und PAO, CLP-Kennzeichnung für Kerze und Inhalator, Schweizer Preise verzollt und versteuert.
- Nicht live im Verkauf. Kasse ist eine Attrappe. Firmendaten sind Platzhalter in eckigen Klammern.

## Produkte

| Code | Produkt | Preis | Inhalt | Regime | Seite |
|---|---|---|---|---|---|
| YANG 01 | Sculpted Matte Lip Clay | 28,00 € | 3,5 g | cosmetic | /products/sculpted-matte-lip-clay |
| YANG 02 | Monochrome Glass Eye Glaze | 24,00 € | 15 ml | cosmetic | /products/monochrome-glass-eye-glaze |
| YANG 03 | Silk Cushion Foundation Compact | 46,00 € | 15 g | cosmetic | /products/silk-cushion-foundation-compact |
| YANG 04 | Dual-Phase Hydration Essence | 38,00 € | 100 ml | cosmetic | /products/dual-phase-hydration-essence |
| YANG 05 | Daily Ritual Inhaler, Day | 18,00 € | 1 Stick, Inhalator 2 g, Balsam 4 g | accessory | /products/daily-ritual-inhaler-day |
| YIN 01 | Nocturne Ambient Scent Diffuser | 89,00 € | 1 Gerät | electrical | /products/nocturne-ambient-diffuser |
| YIN 02 | Kuro Botanical Night Recovery Oil | 54,00 € | 50 ml | cosmetic | /products/kuro-night-recovery-oil |
| YIN 03 | Obsidian Gua Sha und Ritualöl | 62,00 € | 1 Stein, 1 Flasche 30 ml | accessory | /products/obsidian-gua-sha-set |
| YIN 04 | Smoked Hinoki Candle Ritual | 42,00 € | 220 g | candle | /products/smoked-hinoki-candle |
| YIN 05 | Daily Ritual Inhaler, Night | 18,00 € | 1 Stick, Inhalator 2 g, Balsam 4 g | accessory | /products/daily-ritual-inhaler-night |

Preise brutto. Grundpreis, CHF-Umrechnung und alle Summen rechnet der Code. Die zwei Inhalatoren "Daily Ritual" folgen dem Format der thailändischen Kräuterinhalatoren: YANG 05 in Weiss für den Tag (Menthol, Kampfer, Borneol, Hinoki), YIN 05 in Schwarz für die Nacht (Lavendel, Zeder, Vetiver, wenig Menthol), jeweils oben Inhalator und unter der Kappe ein Balsam für die Schläfen. Der eingeatmete Teil ist kein Kosmetikum und trägt Zusammensetzung plus CLP-Kennzeichnung, der Balsam ist Kosmetikum mit INCI, Allergenen, PAO und CPNP-Platz. Die CLP-Einstufung ist die übliche für eine Menthol-Kampfer-Mischung und muss vor dem Verkauf gegen das Sicherheitsdatenblatt des Herstellers bestätigt werden. Keine medizinischen Aussagen, der Inhalator ist kein Arzneimittel.

## Regionen

    DE   19 % USt, Versand 4,90 €, frei ab 75 €, DHL GoGreen, 1 bis 2 Werktage, Karte, PayPal, Klarna, SEPA, Apple Pay, Google Pay
    AT   20 % USt, Versand 7,90 €, frei ab 90 €, Österreichische Post, 2 bis 3 Werktage, Karte, PayPal, Klarna, EPS, Apple Pay
    CH   8,1 % MWST, Versand CHF 14,90, frei ab CHF 150, Swiss Post verzollt, 2 bis 4 Werktage, Zollpauschale CHF 11,00 als eigene Position, TWINT, Karte, Apple Pay, PayPal
    Kurs CHF je EUR fest 0,94, vor dem Livegang durch den Tageskurs des Zahlungsanbieters ersetzen

Alle Werte stehen in config/site.ts und sind Konfiguration, kein Gesetzestext. Vor dem Start mit Steuerberatung und Logistik bestätigen.

## Vorschau neu bauen

Nach jeder Änderung am Code, im Ordner des Codes:

    scripts/build-static-demo.sh /seelischabstrakt/jing https://apschranz-star.github.io/seelischabstrakt/jing 5rdoHGJM3mlN

Das schreibt out/. Dessen Inhalt in den Ordner jing/ des Branches gh-pages von seelischabstrakt legen, committen, pushen. Ohne dritten Parameter baut die Vorschau ohne Zugangscode, also öffentlich.

## Vor dem Verkauf

Produktfotos je Produkt (Art. 19 GPSR), Firmendaten in config/site.ts, echte CPNP-Referenzen, WEEE-Registrierung für den Diffuser, Sicherheitsdatenblatt und bestätigte CLP-Einstufung für den Inhalator, Zahlungsanbieter mit Vertrag und serverseitigem Schlüssel, anwaltliche Freigabe der fünf Rechtsseiten, Steuer- und Versandwerte bestätigt, Entscheidung zur Content Security Policy (Nonces heisst dynamisches Rendern). Solange davon etwas fehlt, bleibt das Hinweisband "Demonstration" und der Zugangscode.

---

# JING starten

Ein Prompt, ein Deploy. Voraussetzung: ChatGPT mit GitHub und Netlify verbunden, das Repository apschranz-star/seelischabstrakt freigegeben.

## Der Prompt

Diesen Text in ChatGPT einsetzen:

    Lege auf Netlify eine neue Site aus dem GitHub-Repository apschranz-star/seelischabstrakt an.
    Production branch: jing. Base directory: leer lassen. Build command: npm run build.
    Publish directory: .next. Die Datei netlify.toml im Branch enthält diese Werte bereits,
    übernimm sie, falls Netlify sie anbietet. Environment-Variablen sind nicht nötig.
    Site name: jing-shop, wenn frei, sonst ein Name, der mit jing beginnt.
    Starte den ersten Deploy, warte, bis er fertig ist, und gib mir die Adresse der Site
    und den Status des Deploys. Ist der Deploy rot, gib mir die letzten zwanzig Zeilen
    des Build-Logs im Wortlaut.

Danach ist die Seite unter der genannten Adresse erreichbar, mit funktionierender Kasse im Mock-Betrieb. Jeder Push auf den Branch jing baut sie neu.

## Was Netlify dabei tut

netlify.toml im Code legt fest: Build mit `npm run build`, Ausgabe `.next`, Node 22, das Next.js-Runtime-Plugin von Netlify. Die Adresse der Site liest der Code aus Netlifys eigener Variable URL, deshalb stimmen Canonical- und Open-Graph-Tags ab dem ersten Deploy. Die Kasse bleibt eine Attrappe, bis PAYMENT_PROVIDER_KEY als Environment-Variable gesetzt ist, und das ist derzeit der einzige unterstützte Zustand.

## Wenn der GPT nicht an Netlify kommt

Netlify, Add new project, Import an existing project, GitHub, Repository seelischabstrakt wählen. Branch to deploy: jing. Base directory leer, Build command `npm run build`, Publish directory `.next`. Deploy. Fertig. Danach unter Project configuration, General, Change project name auf jing-shop.

Oder im Terminal, im Ordner des Codes:

    npx netlify-cli login
    npx netlify-cli sites:create --name jing-shop
    npx netlify-cli link
    npx netlify-cli deploy --build --prod

## Wenn der Deploy nicht baut

Steht im Netlify-Konto "operational credits" oder "builds paused", baut Netlify nichts, auch nicht für diese Seite. Das ist eine Abrechnungsfrage im Konto, kein Fehler im Code. Sobald das Konto wieder baut, unter Deploys, Trigger deploy.

Meldet das Build-Log einen Fehler im Code, denselben Fehler zuerst lokal reproduzieren: `npm ci`, `npm run build`. Was lokal durchläuft, läuft auch auf Netlify.

## Danach

Adresse in den Instructions des GPT eintragen, damit er weiss, was live ist. Die Demo auf GitHub Pages kann bleiben oder verschwinden, sie ist unabhängig. Bevor irgendetwas verkauft wird, gilt die Tabelle "Vor dem Livegang zu erledigen" in README.md.


---

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

    config/products.ts    die zehn Produkte: Name, Text, Ritual, Preis in Cent, Füllmenge,
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
    statischer Export ohne Server. Jeder Push auf den Branch jing baut sie neu, Workflow
    "Publish the JING demo". Nach einem Commit sagst du Alexander, dass die Demo in etwa
    drei Minuten den neuen Stand zeigt.

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

    scripts/build-static-demo.sh /seelischabstrakt/jing https://apschranz-star.github.io/seelischabstrakt/jing <Zugangscode>

Von Hand ist das nur noch der Ersatz. Der Workflow .github/workflows/demo-pages.yml macht dasselbe bei jedem Push, mit dem Code aus dem Repository-Secret JING_ACCESS_KEY.

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

