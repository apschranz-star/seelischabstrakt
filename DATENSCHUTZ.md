# Datenschutz: was jede Seite verarbeitet

Diese Datei ist die Übersicht für Alexander und für den GPT. Sie sagt, was auf jeder Seite wirklich passiert, nicht was in einem Mustertext steht. Die Rechtstexte der einzelnen Seiten müssen zu dieser Übersicht passen. Ändert sich etwas am Code, ändert sich hier eine Zeile und dort ein Satz.

Der Grundsatz dahinter ist einfach: Es geht keine Anfrage an einen Dritten, solange der Besucher nicht selbst darauf klickt. Damit braucht keine Seite ein Einwilligungsbanner, und es gibt nichts, wogegen jemand widersprechen müsste.

## Was am 18. September 2026 umgestellt wurde

**Zwei Seiten standen offen.** Das Formular der Praxisseite, `farida/modulo.html`, trug keinen Zugang und lag auf dem veröffentlichten Zweig frei im Netz. Daneben lag `content.json` mit einem Abschnitt, der als Entwurf markiert ist und deshalb auf der Seite nicht erscheint: wer die Datei direkt aufrief, las ihn trotzdem. Beides ist behoben, der Entwurf fliegt jetzt beim Veröffentlichen aus der Kopie.

**Der Vorschaukanal des Shops nahm Nachrichten von überall an.** Jede fremde Seite, die den Shop in einem Rahmen oder einem Fenster hielt, konnte Inhalt, Aussehen und Zahlungslink austauschen. Er nimmt jetzt nur noch Nachrichten von der eigenen Adresse.

**Das Tor hält Suchmaschinen jetzt auch ohne JavaScript fern.** Das `noindex` stand bisher nur in einer Zeile, die der Browser ausführen musste. Es steht jetzt fest in jeder veröffentlichten Datei.

**Schriften kommen nicht mehr von Google.** Der Kunst-Shop, die Praxisseite und die persönliche Seite haben ihre Schriften bis dahin bei jedem Aufruf von `fonts.googleapis.com` geladen. Dabei geht die IP-Adresse des Besuchers an Google in den USA, ohne dass er gefragt wurde. Genau das hat das Landgericht München I am 20. Januar 2022 für unzulässig erklärt (3 O 17493/20), und es ist der häufigste Abmahngrund auf deutschsprachigen Seiten. Die Schriftdateien liegen jetzt im Repository und kommen von derselben Adresse wie die Seite. Geholt werden sie mit `tools/selfhost-fonts.py`, das Skript bleibt im Repo, falls eine Schrift dazukommt. Betroffen waren nicht nur die drei Startseiten: auch die Fehlerseite `404.html`, die Aufnahmeseite `add.html` und das Formular `farida/modulo.html` haben von Google geladen. Eine Suche über das ganze Repository findet jetzt keine einzige Stelle mehr.

**Die Sicherheitsregeln sind enger.** In den `netlify.toml` und im Kopf der Praxisseite stand `font-src https://fonts.gstatic.com`. Jetzt steht dort `font-src 'self'`. Damit lädt der Browser Schriften nur noch von der eigenen Adresse, auch wenn später jemand versehentlich einen Google-Link einbaut. Das gilt dort, wo eine Regel ankommt: auf Netlify als Kopfzeile aus `netlify.toml`, auf der Praxisseite und auf dem Formular zusätzlich als meta-Element im Dokument. Auf GitHub Pages gibt es keine Kopfzeilen, dort hält nur das meta-Element. Die Vorschau des Shops auf GitHub Pages hat also keine Regel, die sie schützt; sie hat auch keinen Google-Link mehr, und darauf kommt es an.

**Das Zugangsfenster sagt, wer die Seite betreibt.** Wer auf eine geschützte Seite kommt, sieht ein Feld. Schon dort steht jetzt, wer die Seite betreibt, was im Browser abgelegt wird, bei wem die Seite liegt und dass es kein Tracking gibt. Ein falscher Code wird im Feld abgewiesen, ohne dass eine Anfrage hinausgeht.

Ein Code, der über `?zugang=` kommt, wird sofort nach der Prüfung aus der Adresszeile genommen. Er steht danach in keinem Verlauf, in keinem Referrer und in nichts, was jemand kopiert und weitergibt. Im Serverprotokoll des Hosters steht er trotzdem, denn die erste Anfrage ging mit ihm hinaus. Wer das nicht will, gibt den Code im Feld ein, statt ihn im Link mitzuschicken.

## Je Seite

Was hier steht, ist aus dem Code gelesen, nicht aus einem Mustertext. Jede Seite hinter dem Zugang legt zusätzlich `sa-access` ab, den Zugangscode; bei JING heißt dieser Wert `jing-access`.

    Kunst-Shop, öffentlich
    Verarbeitet   Serverprotokolle des Hosters, Sprachwahl im lokalen Speicher,
                  bei einer Bestellung Name, Adresse, E-Mail über das Formular
    Dritte        Netlify, Inc., USA (Hosting und Bestellformular).
                  Revolut, Litauen (Zahlungslink, erst beim Klick).
                  GitHub Inc., USA (nur die Vorschau unter /shop auf gh-pages).
                  Instagram nur als Link
    Speicher      localStorage: sa-lang (Sprache). sa-consent nur, wenn im Studio-Pult
                  eine Statistik eingeschaltet wird; heute ist keine eingeschaltet.
                  Keine Cookies
    Achtung       Das Studio-Pult kann als Ziel der Bestellungen Formspree (USA) einstellen.
                  Das ist heute nicht eingestellt. Wer es einstellt, braucht vorher einen
                  Vertrag nach Art. 28 DSGVO, eine Grundlage nach Art. 44 ff. DSGVO und
                  einen Satz dazu in der Datenschutzerklärung des Shops.
    Banner        keines nötig

    Praxisseite Farida, hinter Code
    Verarbeitet   Serverprotokolle des Hosters, Sprachwahl und Zugang im lokalen Speicher,
                  auf modulo.html der Entwurf des Formulars, solange er im Browser liegt
    Dritte        GitHub Inc., USA (Vorschau), Netlify, Inc., USA (Live).
                  WhatsApp, Google Maps und das Profil auf MioDottore nur als Link,
                  erst beim Klick
    Speicher      localStorage: fb-lang (Sprache), sa-access (Zugang),
                  farida-modulo-v1 (der Formularentwurf, nur auf modulo.html).
                  Keine Cookies
    Banner        keines nötig
    Aufsicht      Garante per la protezione dei dati personali, Italien

    Persönliche Seite, hinter Code
    Verarbeitet   Serverprotokolle, Zugang im lokalen Speicher, Lesergedanken unter den Texten
    Dritte        GitHub Inc., USA (Vorschau), Netlify, Inc., USA (Live und Formular
                  für die Gedanken). Das Formular funktioniert nur auf der Live-Adresse;
                  in der Vorschau auf GitHub Pages gibt es nichts, was es annimmt
    Speicher      localStorage: as-lang (Sprache), as-mode (hell oder dunkel),
                  sa-access (Zugang). Keine Cookies
    Banner        keines nötig
    Aufsicht      Österreichische Datenschutzbehörde

    Schranz AI, hinter Code
    Verarbeitet   Serverprotokolle, Zugang im lokalen Speicher
    Dritte        GitHub Inc., USA. Schriften sind Systemschriften, es wird nichts geladen
    Speicher      localStorage: sa-access (Zugang). Die Sprache wird nicht gespeichert,
                  sie steckt in der Adresse. Keine Cookies
    Banner        keines nötig
    Aufsicht      Österreichische Datenschutzbehörde

    JING, hinter Code
    Verarbeitet   Serverprotokolle, Warenkorb, Lieferland, Ansicht, Sprache und Zugang
                  im lokalen Speicher. In der Demo keine Bestellung, keine Zahlungsdaten
    Dritte        GitHub Inc., USA. Schriften kommen über next/font von derselben Adresse
    Speicher      localStorage: jing-store (Ansicht, Sprache, Lieferland, Warenkorb),
                  jing-access (Zugang). Keine Cookies
    Banner        keines nötig, solange kein Zahlungsdienst eingebunden ist

### Verträge, die noch fehlen

GitHub und Netlify verarbeiten die Serverprotokolle im Auftrag. Der Vertrag dazu nach Art. 28 DSGVO ist bei keinem der beiden geschlossen. Beide halten einen in ihren Bedingungen bereit; er ist vor einem öffentlichen Start anzunehmen, ebenso die Grundlage für die Übermittlung in die USA nach Art. 44 ff. DSGVO. Bis dahin steht in jedem Rechtstext ein Platzhalter an dieser Stelle, und das soll auch so bleiben.

## Warum kein Cookie-Banner

Ein Banner braucht, wer im Gerät des Besuchers etwas speichert oder ausliest, das für den Dienst nicht unbedingt erforderlich ist. Sprache, Warenkorb und Zugang sind erforderlich für genau das, was der Besucher will, deshalb greift die Ausnahme: § 25 Abs. 2 Nr. 2 TDDDG in Deutschland, § 165 Abs. 3 TKG 2021 in Österreich, Art. 122 Codice Privacy in Italien. Erforderlich heißt aber nicht unsichtbar: Alles davon steht in der Datenschutzerklärung der jeweiligen Seite.

Sobald irgendwo Analyse, Kartendienste im Rahmen, eingebettete Videos oder Werbung dazukommen, kippt das. Dann braucht es eine Einwilligung vor dem ersten Laden, und zwar eine echte, mit Ablehnen genauso leicht wie Annehmen.

## Was vor einem öffentlichen Start noch fehlt

Diese Werte hat noch niemand geliefert, deshalb stehen überall Platzhalter in eckigen Klammern. Ohne sie darf keine der Seiten öffentlich beworben werden.

    Kunst-Shop        Firmenanschrift, UID oder Kleinunternehmerhinweis, Gewerbebehörde, Kammer
    Praxisseite       Anschrift der Praxis, Albo-Nummer mit Provinz, Partita IVA, E-Mail.
                      Ein Impressum gibt es bis jetzt gar nicht, nur die Datenschutzerklärung
    Persönliche Seite Anschrift, E-Mail für die Offenlegung nach § 25 MedienG
    Schranz AI        Straße und Hausnummer, nach der Gründung Firmenbuchnummer und UID
    JING              Firmendaten, verantwortliche Person nach Kosmetikverordnung, echte
                      CPNP-Referenzen, WEEE-Registrierung, anwaltliche Freigabe der fünf Seiten

## Was der Zugangscode leistet und was nicht

Er hält Suchmaschinen und Zufallsbesucher fern. Er ist kein Passwortschutz: GitHub Pages liefert die Datei aus und prüft nichts, der Code steht in der ausgelieferten Seite, und ohne JavaScript greift er gar nicht. Für eine Vorschau ohne personenbezogene Daten ist das vertretbar. Sobald hinter dem Code echte Personendaten lägen, wäre er zu wenig: Art. 32 DSGVO verlangt Schutz nach dem Stand der Technik, und der heißt Prüfung auf dem Server. Der Weg dorthin ist Netlify mit Site protection im bezahlten Tarif oder ein Zugang über Cloudflare.
