# Uebergabe an ChatGPT

Diese Datei ist kein Dokument zum Lesen, sondern ein Text zum Kopieren. Der
Block unten ist die erste Nachricht in einem neuen Chat, in dem der
GitHub-Connector auf `apschranz-star/seelischabstrakt` zeigt. Danach arbeitet
ChatGPT selbst weiter.

Keine Umlaute in diesem Ordner, das ist hier so und bleibt so.

Die Aufgaben selbst stehen in `HANDOVER-CHATGPT.md`. Hier steht nur, welche
gerade dran ist.

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

    Die Oberflaeche auf Italienisch.

    Der Inhalt liegt in inhalt-it.js schon vollstaendig auf Italienisch.
    Was fehlt, ist die Oberflaeche: 290 Knopf- und Meldungstexte, die
    inhalt-en.js unter dem Schluessel ui schon beantwortet. Deutsch ist die
    Schluesselsprache, der deutsche Satz ist der Schluessel. Solange die
    Tabelle fehlt, wird Italienisch nicht angeboten, und das ist Absicht:
    deutsche Knoepfe ueber italienischem Text waeren schlechter als eine
    Sprache weniger.

    Der Weg steht Schritt fuer Schritt in anker/HANDOVER-CHATGPT.md unter
    "The open task". Lies ihn, bevor du anfaengst.

    Fertig heisst:

    - inhalt-it.js traegt eine ui-Tabelle mit denselben 290 deutschen
      Schluesseln wie inhalt-en.js, uebersetzt ist nur die rechte Seite.
    - Jeder Platzhalter in geschweiften Klammern, den ein Schluessel
      traegt, steht auch in der Uebersetzung. Die Reihenfolge darf sich
      aendern, der Bestand nicht.
    - "it" steht in OBERFLAECHE_FERTIG in app.js. Vorher nicht.
    - Alle Pruefungen laufen sauber durch:

          cd anker
          for f in app.js sw.js inhalt-*.js; do node --check "$f" || echo "BROKEN $f"; done
          for l in en it fr es; do node werkzeug/pruefe-sprache.js inhalt-$l.js $l; done
          node werkzeug/pruefe-texte.js
          node werkzeug/pruefe-deutsch.js
          grep -c 'style="' app.js index.html inhalt-*.js

    - Der Lauf "Publish Anker" ist gruen.

    Fuehr die Pruefungen wirklich aus, bevor du committest. Der Workflow
    prueft dasselbe noch einmal und veroeffentlicht nichts, wenn etwas
    nicht stimmt; dann steht die App still, bis es jemand merkt.

    Am deutschen und am englischen Text aendert sich kein einziges Wort.
    Meldet pruefe-deutsch.js etwas, hast du mehr angefasst als vorgesehen.

    Wenn du fertig bist, schreib in drei Saetzen: was du geaendert hast,
    was du geprueft hast, und was du nicht pruefen konntest.
