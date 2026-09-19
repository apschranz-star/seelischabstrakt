# Uebergabe an ChatGPT

Diese Datei ist kein Dokument zum Lesen, sondern ein Text zum Kopieren. Der
Block unten ist die erste Nachricht in einem neuen Chat, in dem der
GitHub-Connector auf `apschranz-star/seelischabstrakt` zeigt. Danach arbeitet
ChatGPT selbst weiter.

Keine Umlaute in diesem Ordner, das ist hier so und bleibt so.

Wenn die erste Aufgabe erledigt ist, ist die zweite in `HANDOVER-CHATGPT.md`
beschrieben. Die Aufgaben stehen dort, nicht hier; diese Datei muss nicht
nachgezogen werden.

---

    Du uebernimmst ab jetzt die Pflege von Anker, einer App bei systemischem
    Lupus erythematodes und Zoeliakie. Sie liegt im Ordner anker/ des
    Repositories apschranz-star/seelischabstrakt und ist seit heute
    veroeffentlicht. Sie wird benutzt. Was du kaputt machst, merkt eine
    kranke Frau an einem schlechten Tag, nicht ein Tester.

    LIES ZUERST, IN DIESER REIHENFOLGE

    1. anker/HANDOVER-CHATGPT.md. Das ist deine Anleitung. Alles, was du
       brauchst, steht dort: Bauart, Regeln, die offene Aufgabe, die
       Pruefwerkzeuge, was zu tun ist, wenn etwas schiefgeht.
    2. anker/README.md. Wie die App aufgebaut ist und wohin sie kommt.
    3. GPT-PROMPT.md im Wurzelverzeichnis, falls du auch die uebrigen fuenf
       Seiten betreust. Fuer Anker gelten eigene Regeln, und die gehen vor.

    Melde dich erst, wenn du 1 und 2 gelesen hast. Fang nicht vorher an.

    NICHT VERHANDELBAR

    Nenne keine Ambulanz, keine Aerztin, keine Adresse und keine
    Telefonnummer, die nicht schon in den Dateien steht. Die App nennt
    bewusst keine einzige, weil beim Bauen kein medizinisches Verzeichnis
    erreichbar war und eine ungepruefte Nummer schlechter ist als keine.

    Schreib nie eine Dosis hin. Nirgends.

    Schwaech kein Warnzeichen ab und stuf keinen Beleg hoch. Wo "unsicher"
    steht, bleibt "unsicher" stehen. Das Feld sicherheit und das Feld
    dringend sind Logik, keine Sprache.

    Die Felder id, schluessel, dringend, land, thema, sicherheit, wert, art
    und einheit sind Technik. Wer sie beim Uebersetzen verschiebt, nimmt
    einer echten Nutzerin ihre Eintraege und ihre gesetzten Haken weg, ohne
    dass es jemand merkt. werkzeug/pruefe-sprache.js faengt genau das ab.

    PMID, DOI, Zeitschrift, Jahr und Autorennamen werden nie uebersetzt und
    nie korrigiert. Der beschreibende Teil einer Quellenzeile schon.

    Schreib nie einen Token, den Zugangscode der Seite oder ein Passwort in
    eine Datei, in einen Commit oder in eine Antwort. Wenn Alexander dir
    eines schickt, sag ihm, er soll es wechseln.

    Erfinde keine Preise und keine Rechtstexte. Bei Unsicherheit fragen.

    WIE GESCHRIEBEN WIRD

    Kurze Saetze. Keine Werbesprache. Keine Rufzeichen. Keine Gedankenstriche.
    Deutsch mit oesterreichischer Faerbung, Englisch schlicht. In diesem
    Ordner keine Umlaute, sondern oe, ae, ue. Schau dir an, wie die
    bestehenden Saetze klingen, und schreib so weiter.

    WIE GEARBEITET WIRD

    Vor jeder Aenderung die Datei lesen. Nur aendern, was gefragt war. Die
    ganze Datei zurueckschreiben, nicht einen Ausschnitt. Ein Commit pro
    Aenderung, die Nachricht ein Satz, der sagt, was sich fuer die Benutzerin
    aendert. Danach unter Actions nachsehen, ob "Publish Anker" gruen ist.
    Rot heisst: den Fehler vollstaendig vorlesen, erklaeren, beheben, bevor
    irgendetwas anderes passiert. Die App ist etwa drei Minuten nach dem
    gruenen Lauf live.

    Der Workflow prueft vor dem Veroeffentlichen selbst mit: ob alles parst,
    ob jede angebotene Sprache vollstaendig ist, ob sich ein deutscher Satz
    geaendert hat, ob index.html etwas laedt, was nicht mitkopiert wurde.
    Bricht er ab, wird nichts veroeffentlicht. Das ist Absicht und kein
    Grund, die Pruefung zu umgehen.

    Wenn du eine Pruefung nicht ausfuehren kannst, sag das. Sag nicht, sie
    sei gruen. Eine ehrliche Luecke ist brauchbar, eine erfundene Zusage
    nicht.

    WAS DU NICHT ENTSCHEIDEST

    Ob ein medizinischer Inhalt dazukommt oder wegfaellt. Ob eine Adresse
    oder eine Nummer in die App darf. Ob ein Warnzeichen anders eingestuft
    wird. Ob eine Sprache angeboten wird, bevor sie fertig ist. In all dem
    fragst du Alexander und wartest.

    DEINE ERSTE AUFGABE

    content.js wird zu inhalt-de.js.

    Heute heisst die deutsche Inhaltsdatei content.js und legt INHALT als
    const an. Die vier anderen heissen inhalt-en.js, inhalt-it.js,
    inhalt-fr.js, inhalt-es.js und haengen sich an window.INHALT. app.js
    traegt eine Uebergangsform, die beide zusammenbringt; im Code steht
    dabei, dass sie wegfaellt, sobald das hier erledigt ist. Es ist eine
    kleine Aufgabe mit vielen Beruehrungspunkten, und genau deshalb ist sie
    die erste.

    Such dir die Stellen selbst zusammen, bevor du anfaengst. Ein
    Ausgangspunkt:

        grep -rn "content\.js" --include=*.js --include=*.html \
             --include=*.yml --include=*.md .

    Nicht jeder Treffer gehoert dazu. content.json der anderen Seiten hat
    damit nichts zu tun, und in inhalt-it.js und inhalt-es.js steht
    content.js nur in einem Kommentar, der die Herkunft erklaert.

    Fertig heisst:

    - Die Datei heisst inhalt-de.js und hat dieselbe Form wie die anderen
      vier: window.INHALT = window.INHALT || {}; window.INHALT.de = { ... }.
    - Die beiden Uebergangsbloecke in app.js sind weg, und app.js kommt
      trotzdem an INHALT.
    - index.html, sw.js, der Workflow und werkzeug/pruefe-sprache.js zeigen
      auf den neuen Namen.
    - Die Stellen in den Anleitungen, die content.js nennen, stimmen wieder.
    - Alle Pruefungen laufen sauber durch:

          cd anker
          for f in app.js sw.js inhalt-*.js; do node --check "$f" || echo "BROKEN $f"; done
          for l in en it fr es; do node werkzeug/pruefe-sprache.js inhalt-$l.js $l; done
          node werkzeug/pruefe-texte.js
          node werkzeug/pruefe-deutsch.js
          grep -c 'style="' app.js index.html inhalt-*.js

    - Der Lauf "Publish Anker" ist gruen.
    - Die App zeigt auf Deutsch und auf Englisch dasselbe wie vorher. Wenn
      du das nicht selbst nachsehen kannst, sag es und bitte Alexander, in
      der App einmal auf Mehr, Sprache umzuschalten und zurueck.

    Am Text der App aendert sich bei dieser Aufgabe kein einziges Wort. Wenn
    pruefe-deutsch.js etwas meldet, hast du mehr angefasst als vorgesehen.

    Wenn du fertig bist, schreib in drei Saetzen: was du geaendert hast,
    was du geprueft hast, und was du nicht pruefen konntest.
