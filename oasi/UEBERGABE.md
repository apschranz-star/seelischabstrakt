# Uebergabe an ChatGPT

Der Block unten ist die erste Nachricht in einem neuen Chat, in dem der
GitHub-Connector auf `apschranz-star/seelischabstrakt` zeigt. Danach laeuft
alles ueber ChatGPT: ansehen, aendern, veroeffentlichen, und am Ende der Start.

Keine Umlaute in diesem Ordner, das ist hier so und bleibt so.

---

    Du uebernimmst ab jetzt die Anteprima fuer die Bar Oasi Cafè in
    Acquapendente. Sie liegt im Ordner oasi/ des Repositories
    apschranz-star/seelischabstrakt und ist unter
    apschranz-star.github.io/seelischabstrakt/oasi/ erreichbar, hinter einem
    Zugangscode, den Alexander hat.

    Es ist die Seite eines echten Lokals, mit dem Namen, der Anschrift und der
    Telefonnummer einer echten Familie. Sie ist noch ein Entwurf und sagt das
    selbst, in einem Streifen ganz oben. Der Streifen ist kein Schmuck,
    sondern der Grund, warum die Seite ueberhaupt online stehen darf.

    LIES ZUERST

    1. oasi/README.md. Was die Seite ist, wohin sie kommt, was vor einer
       echten Veroeffentlichung fehlt.
    2. Diese Datei zu Ende.

    Melde dich erst, wenn du 1 gelesen hast.

    WIE DIE SEITE GEBAUT IST

    Eine einzige Datei, oasi/index.html, rund 2500 Zeilen. Kein Bauschritt,
    kein Paket, keine Abhaengigkeit. Daneben oasi/img/ mit zwei Portraets.
    Die Schriften stecken als data-URI in der Datei, es geht keine einzige
    Anfrage an einen fremden Server.

    Italienisch steht im Dokument selbst. Deutsch und Englisch kommen aus dem
    Woerterbuch var DIZ im Skriptblock am Ende. Jede uebersetzbare Stelle
    traegt ein data-i18n="schluessel", und unter demselben Schluessel steht in
    DIZ.de und DIZ.en die Uebersetzung. Fehlt eine, bleibt dort Italienisch
    stehen, mitten im deutschen Text, und es faellt niemandem auf, solange
    niemand umschaltet.

    Drei Schluessel stehen nicht im Dokument, sondern werden aus dem Code
    gelesen: aperto, chiuso, chiusoOggi. Das ist die Zeile "jetzt geoeffnet,
    bis 22:00", die aus den Oeffnungszeiten gerechnet wird. {h} ist die
    Uhrzeit, {g} der Tag. Beide muessen in der Uebersetzung stehen bleiben.

    NICHT VERHANDELBAR

    Erfinde keine Rechtsdaten. Ragione sociale, Partita IVA, REA und E-Mail
    stehen als [da inserire] in der Seite, vier Stellen. Die fuellt Fabio aus,
    nicht du.

    Erfinde keine Preise. Der Laden hat bewusst keine Preisliste: die Preise
    wechseln mit der Saison, Fabio sagt sie im Gespraech. Das ist so gewollt
    und keine Luecke, die du schliesst.

    Aendere die Telefonnummer nicht und erfinde keine zweite. Sie steht als
    var NUMERO im Skript, und alle WhatsApp-Knoepfe haengen daran. Sie stammt
    aus der Google-Liste des Lokals und ist nicht bestaetigt.

    Nimm keine Fotos von irgendwoher. Die zwei Portraets sind von der Familie.
    Die Bilder in der Google-Liste gehoeren Google.

    Schreib nie einen Token, den Zugangscode der Seite oder ein Passwort in
    eine Datei, in einen Commit oder in eine Antwort. Wenn Alexander dir eines
    schickt, sag ihm, er soll es wechseln.

    Nimm den Entwurfsstreifen nicht weg. Wann er weg darf, steht unten unter
    DER START.

    WIE GESCHRIEBEN WIRD

    Kurze Saetze. Keine Werbesprache. Keine Rufzeichen. Keine Gedankenstriche.
    Italienisch ist die Sprache der Seite, Deutsch und Englisch folgen ihr.
    Schau dir an, wie die bestehenden Saetze klingen, und schreib so weiter.
    Der Ton ist erzaehlend, nicht anpreisend: es geht um einen Mann, einen
    Garten ein paar Kilometer ausserhalb und das, was er dort anbaut.

    WIE GEARBEITET WIRD

    Vor jeder Aenderung die Datei lesen. Aendere nur, was die Aufgabe nennt.
    Faellt dir unterwegs etwas auf, schreib es in die Antwort, aendere es
    nicht.

    Nach jeder Aenderung, vor dem Commit:

        node oasi/pruefe.js

    Das prueft ohne Browser und ohne ein einziges Paket: ob der Kopf der Seite
    vollstaendig ist, ob eine Uebersetzung fehlt oder tot ist, ob die
    Platzhalter {h} und {g} noch stimmen, ob ein src auf eine fremde Adresse
    zeigt, ob der Entwurfsstreifen noch da ist, und wie viele Platzhalter im
    Impressum offen sind. Die Ausgabe gehoert in deine Antwort.

    Nach dem Push unter Actions nachsehen, ob "Publish Oasi" gruen ist. Rot
    heisst: nichts ist veroeffentlicht, die Aenderung ist nicht angekommen,
    und niemand ausser dir sieht es. Dann den Fehler vollstaendig vorlesen,
    erklaeren, beheben, bevor du etwas anderes anfaengst. Etwa drei Minuten
    nach dem gruenen Lauf ist die Seite live.

    Der Workflow prueft dasselbe noch einmal und veroeffentlicht nichts, wenn
    etwas fehlt. Das ist das Netz, nicht der Plan.

    WAS IN DEINE ANTWORT GEHOERT

    Am Ende jeder Aufgabe drei Punkte, kurz: was du geaendert hast, was
    node oasi/pruefe.js ausgegeben hat, und was du nicht pruefen konntest.
    Eine ehrliche Luecke ist brauchbar. "Alles gruen" ohne Ausgabe ist es
    nicht.

    DIE SEITE ANSEHEN

    Im Browser unter apschranz-star.github.io/seelischabstrakt/oasi/ mit dem
    Code. Am Telefon genauso, in Safari.

    Du selbst kannst sie vermutlich nicht rendern. Dann sag das und lies
    stattdessen die Datei. Behaupte nicht, du haettest nachgesehen.

    Zum Herzeigen ohne Netz gibt es eine Fassung als eine einzige Datei, mit
    eingebetteten Fotos. Die baut man so:

        python3 - <<'PY'
        import io, base64
        s = io.open("oasi/index.html", encoding="utf-8").read()
        for n in ("fabio.jpg", "fabio-farida.jpg"):
            b = base64.b64encode(open("oasi/img/" + n, "rb").read()).decode()
            s = s.replace('src="img/%s"' % n, 'src="data:image/jpeg;base64,%s"' % b)
        io.open("Bar-Oasi-Cafe.html", "w", encoding="utf-8").write(s)
        PY

    Das ergibt eine Datei von rund 900 kB, die man per AirDrop aufs iPhone
    schickt und aus der Dateien-App oeffnet. Kein Netz, kein Code, kein
    Server.

    VERBESSERUNGEN

    Was jetzt ansteht, entscheidet Alexander. Dinge, die sich anbieten:

    - Fotos vom Lokal, sobald es welche gibt. Sie kommen nach oasi/img/ und
      ersetzen die leeren Rahmen im Abschnitt mit den Bilderrahmen.
    - Die Oeffnungszeiten stehen als var ORARI im Skript, ein Eintrag je
      Wochentag. Aendern heisst dort aendern, sonst nirgends.
    - Der Laden: jeder Eintrag hat einen Titel, einen Absatz und eine
      Saisonmarke, und jeder traegt einen WhatsApp-Knopf, der den Namen der
      Ware in die Nachricht schreibt. Ein Eintrag mehr heisst: ein Block im
      Dokument, drei Schluessel in DIZ.de und DIZ.en.
    - Eine vierte Sprache waere ein weiterer Zweig in DIZ und ein Knopf mehr
      in der Leiste. Frag vorher.

    Bei jeder inhaltlichen Aenderung gilt: was Fabio nicht gesagt hat, steht
    nicht auf der Seite.

    DER START

    Der Entwurfsstreifen darf erst weg, wenn diese fuenf Punkte erledigt sind,
    und zwar alle:

    1. Fabio hat die Telefonnummer bestaetigt und gesagt, dass sie auf
       WhatsApp liegt.
    2. Fabio hat die Oeffnungszeiten bestaetigt.
    3. Ragione sociale, Partita IVA, REA und E-Mail stehen statt der vier
       [da inserire]. node oasi/pruefe.js zaehlt sie mit.
    4. Es gibt Fotos vom Lokal, oder Fabio sagt, dass es ohne geht.
    5. Farida ist damit einverstanden, dass ihr Foto und ihr Beruf auf der
       Seite stehen.

    Nichts davon entscheidest du. Alexander sagt dir, wenn ein Punkt erledigt
    ist. Bis dahin bleibt der Streifen, auch wenn dich jemand darum bittet.

    Sind alle fuenf erledigt, ist der Start eine eigene Entscheidung von
    Alexander und kein Nebenbei. Dann gehoert dazu:

    - Der Streifen kommt weg: das aside mit class="avviso" im Dokument und
      der Schluessel avviso in DIZ.de und DIZ.en. Danach node oasi/pruefe.js,
      das den fehlenden Streifen meldet; ab dann ist diese Meldung die
      richtige und du sagst dazu, dass sie erwartet ist.
    - Im Workflow .github/workflows/oasi-pages.yml faellt die Pruefung auf
      data-i18n="avviso" weg, sonst veroeffentlicht er nichts mehr.
    - Der letzte Absatz im Fuss, f-chiusa, sagt auch noch, dass es ein
      Entwurf ist. Der wird neu geschrieben.
    - Das noindex und das Tor: solange die Seite unter der GitHub-Adresse
      liegt, bleiben beide. Eine echte Adresse ist eine eigene Aufgabe, und
      dann entscheidet Alexander, ob das Tor faellt.

    Frag bei jedem dieser vier Schritte nach, bevor du ihn machst.

    DEINE ERSTE AUFGABE

    Lies oasi/README.md und oasi/index.html, fuehr node oasi/pruefe.js aus
    und schreib Alexander in hoechstens fuenfzehn Zeilen:

    - was auf der Seite steht, Abschnitt fuer Abschnitt, in einer Zeile je
      Abschnitt
    - was die Pruefung ausgibt
    - welche drei Dinge dir auffallen, die man verbessern koennte, ohne dass
      Fabio etwas bestaetigen muss

    Aendere dabei nichts. Das ist eine Leseaufgabe.
