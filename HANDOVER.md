# Übergabe: beide Seiten ohne Claude betreiben

Drei Websites, ein GitHub-Repository, ein Netlify-Konto. Alles Tägliche geht über einen Custom GPT in ChatGPT oder über den Studio desk am iPad. Diese Datei ist die vollständige Anleitung.

    seelischabstrakt.netlify.app     der Shop, Ordner / im Repo
    alexanderschranz.netlify.app     die persönliche Seite, Ordner /portfolio im Repo
    apschranz-star.github.io/seelischabstrakt/schranz-ai/   SCHRANZ AI SOLUTIONS, Pitchdeck als Website, Ordner /schranz-ai, DE und EN

Zugang: Alle Vorschauen auf GitHub Pages außer dem Kunst-Shop stehen hinter einem Code, Link mit ?zugang=<Code>. Wie das funktioniert und wo der Code liegt, steht in gate/README.md.
    faridabenslimane.netlify.app     die Praxisseite von Farida Benslimane, Ordner /farida im Repo
    JING                             der Beauty-Shop, eigener Branch jing in diesem Repo,
                                     eigene Anleitung dort: HANDOVER.md, Start: LAUNCH.md
    apschranz-star.github.io/seelischabstrakt/anker/   Anker, die App bei SLE und Zöliakie,
                                     Ordner /anker, eigene Anleitung dort: README.md

Alle bauen aus demselben Repository. Jede Änderung an einer Datei ist etwa eine Minute später live.

    apschranz-star.github.io/seelischabstrakt/oasi/   Anteprima für die Bar Oasi Cafè in
                                     Acquapendente, Ordner /oasi, Italienisch mit Umschalter auf
                                     Deutsch und Englisch, hinter dem Zugangscode

Die Oasi-Seite ist ein Entwurf und sagt das in einem Streifen ganz oben. Was vor einer echten Veröffentlichung fehlt, steht in oasi/README.md; unter anderem die Bestätigung von Fabio, dass die Telefonnummer stimmt und auf WhatsApp liegt.

## JING

JING liegt nicht in einem Ordner, sondern im Branch jing dieses Repositorys, weil es ein eigener Code ist (Next.js) und später in ein eigenes Repository umzieht. Der Custom GPT für JING arbeitet über den GitHub-Connector direkt an den Dateien, seine Instructions stehen in HANDOVER.md im Branch jing. Der Start auf Netlify ist ein Prompt, er steht in LAUNCH.md im selben Branch. Eine statische Demo läuft unter apschranz-star.github.io/seelischabstrakt/jing/ auf dem Branch gh-pages neben der Praxisseite; der Workflow der Praxisseite lässt den Ordner jing dort in Ruhe.

## Anker

Anker ist kein Auftritt, sondern eine App für den eigenen Gebrauch: ein Tagebuch bei systemischem Lupus und Zöliakie, dazu ein Nachschlagewerk und ein Arztbericht. Sie liegt im Ordner /anker, ist reines HTML, CSS und JavaScript ohne Bauschritt und wird von einem eigenen Workflow nach gh-pages unter /anker/ veröffentlicht, hinter demselben Zugangscode wie die übrigen Vorschauen.

Auf dem iPhone wird sie in Safari geöffnet und über Teilen, Zum Home-Bildschirm abgelegt. Danach läuft sie im Vollbild und ohne Netz. Alle Einträge bleiben im Gerät, es gibt keinen Server und kein Konto; die Seite erklärt `connect-src 'none'` und kann gar nichts senden. Der Preis dafür steht in anker/README.md: gesichert wird nur, was man selbst sichert, und dafür gibt es in der App unter Mehr eine Sicherung als Datei.

Inhalte ändern geht in einer einzigen Datei, anker/inhalt-de.js. Der ausführliche Bericht zu Müdigkeit, Bewegung und Ernährung liegt daneben als anker/REPORT.md und wird nicht mitveröffentlicht.

## Teil 1: Netlify einrichten (einmalig)

### Shop-Seite (existiert bereits)
Netlify, Projekt seelischabstrakt, Site configuration, Environment variables. Fünf Einträge:

    DESK_KEY        ein langes Passwort, das du dir ausdenkst. Der Schlüssel für ChatGPT und für /add.
    GITHUB_TOKEN    GitHub, Settings, Developer settings, Fine-grained tokens. Nur dieses Repository,
                    Repository permissions, Contents: Read and write.
    GITHUB_REPO     apschranz-star/seelischabstrakt
    GITHUB_BRANCH   main
    DESK_PASSWORD   ein zweites Passwort, deins für den Studio desk unter /desk. Fehlt es,
                    antwortet /desk mit "locked" und lässt niemanden hinein, auch dich nicht.

Den GitHub-Token brauchst du an zwei Stellen: hier in Netlify und noch einmal im Studio desk, Teil 5. GitHub zeigt ihn nur ein einziges Mal. Lass das GitHub-Fenster offen und mach Teil 5 gleich mit. Aus Netlify bekommst du ihn nicht zurück. Ist er weg, erzeuge einen neuen und trage ihn an beiden Stellen ein, das ist der normale Weg und kostet zwei Minuten.

Danach Deploys, Trigger deploy.

Test: seelischabstrakt.netlify.app/api/works im Browser öffnen. Es müssen die Titel deiner Werke dastehen, also Enter the Void, Fear und die übrigen. Steht dort nur `{"works":[]}`, stimmt GITHUB_REPO oder GITHUB_BRANCH nicht. Steht dort ein Text mit "error", ist GITHUB_TOKEN falsch, abgelaufen oder ohne Zugriff auf dieses Repository. Der Test zeigt nur, dass gelesen werden kann. Ob geschrieben werden kann, siehst du beim ersten Werk über /add.

### Persönliche Seite (noch anzulegen)
Netlify, Add new project, Import from Git, dasselbe Repository. Base directory: portfolio. Publish directory leer lassen, Build command leer. Den Rest regelt die Datei portfolio/netlify.toml, die nicht gelöscht werden darf. Deploy. Dann Project configuration, General, Change project name: alexanderschranz.

Diese zweite Seite braucht keine Environment variables. Die API läuft auf der Shop-Seite und schreibt ins gemeinsame Repository, beide Seiten bauen daraufhin neu.

### Formulare
Auf beiden Seiten getrennt einstellen. Forms, Enable form detection, danach Deploys, Trigger deploy. Netlify liest die Formulare erst beim nächsten Deploy aus der Seite. Vorher stehen sie nicht in der Liste und es kommt auch nichts an.

Shop: nach dem Deploy erscheinen "order" und "notify" unter Forms. Dann Form notifications, Email notification für beide, an a.p.schranz@icloud.com. Zum Schluss eine Testbestellung auslösen und schauen, ob sie unter Forms auftaucht und die Mail ankommt.

Persönliche Seite: dort heißt das Formular "comment", das ist "Share your thoughts" unter jedem Text. Auch hier Email notification an a.p.schranz@icloud.com. Ohne diese Einstellung schreibt jemand etwas und niemand erfährt davon. Zum Testen selbst einen Gedanken abschicken.

## Teil 2: Den Custom GPT anlegen

ChatGPT, Explore GPTs, Create. Name: Schranz Desk.

Instructions, dieser Text hinein:

    Du pflegst zwei Websites von Alexander Schranz. Der Shop seelischabstrakt.netlify.app verkauft Originale und Editionen. Die persönliche Seite alexanderschranz.netlify.app handelt von ihm als Person: seine Geschichte in Kapiteln, kurze Texte, und unter jedem Text ein Feld, in das Leser einen Gedanken schreiben können. Kein Lebenslauf, keine Firmennamen, kein Verkauf.

    Werkzeuge: listWorks und upsertWork für Werke im Shop, getSite und updateSite für Texte, Design, Versand, Steuern und Rechtsdaten des Shops, getJournal und updateJournal für die persönliche Seite, also Kapitel, Texte und freigegebene Kommentare, getPractice und updatePractice für die Praxisseite von Farida Benslimane.

    Arbeitsweise: Vor jeder Änderung den aktuellen Stand lesen, also listWorks, getSite oder getJournal aufrufen. Danach nur das ändern, was Alexander genannt hat, nie das ganze Objekt zurückschicken. Nach jeder Änderung in einem Satz sagen, was jetzt live geht.

    Regeln, die nicht verhandelbar sind:
    Preise, Maße, Jahreszahlen, Adressen und Rechtstexte nie erfinden. Fehlt eine Angabe, frage nach.
    Über Alexander nichts behaupten, was er dir nicht gesagt hat. Kein Datum, keine Reise, keine Ausstellung, keine Schule, kein Beruf, kein Arbeitgeber.
    Auf der persönlichen Seite kommen Beruf, Lebenslauf, Firmennamen und alles Verkäufliche nicht vor.
    Keine Gedankenstriche in Texten, weder im Deutschen noch im Englischen. Komma oder Punkt. Die API weist Gedankenstriche zurück.
    Kurze Sätze, konkret, keine Werbesprache, keine Ausrufezeichen. Deutsch mit leichter österreichischer Färbung, Englisch schlicht.
    Texte immer in beiden Sprachen liefern, en und de.
    Zahlen als Zahlen senden, also 4800, nicht "4.800" und nicht "4800".
    Den Desk-Schlüssel niemals in eine Antwort schreiben.

    Werke im Shop: Beschreibt Alexander ein neues Werk, brauchst du Titel, Breite und Höhe in cm, Technik, Jahr und Preis. Fehlt eines davon, frag nach, die API weist den Aufruf sonst zurück. Captions schreibst du selbst, ein bis zwei Sätze, konkret. Verkauft heißt available false, nicht löschen. Zum Ändern eines Werks immer erst listWorks aufrufen und die id von dort nehmen, nie den Titel schicken, sonst entsteht ein zweiter Eintrag oder die API antwortet mit 409.

    Fotos für den Shop kannst du nur hochladen, wenn Alexander dir eine öffentliche https-Adresse gibt. Sonst sag ihm: eine Minute warten, bis Netlify fertig gebaut hat, dann /desk öffnen, Tab Works, die Karte des Werks aufklappen, Choose photo, dann Publish to site. /add legt immer ein neues Werk an und ist nur für Werke, die es noch nicht gibt.

    Persönliche Seite, Geschichte: story.chapters. Ein Kapitel hat title, period als kleine Zeile darüber, drei oder vier kurze Absätze und optional ein Bild mit Caption. Es geht um Gefühle und Wendepunkte, nicht um Daten und Namen. Mehr als sechs veröffentlichte Kapitel lässt die API nicht zu, das ist Absicht; ein siebentes geht nur mit draft true.

    Persönliche Seite, Texte: writing.posts. Ein Text hat title, date, einen excerpt für die Liste, Absätze und optional Bilder. Immer action chapter oder action post verwenden, nie patch, denn patch ersetzt die ganze Liste. Ein Foto zuerst mit action image hochladen und dann den zurückgegebenen Pfad als image.src verwenden.

    Kommentare: Leser schreiben über das Formular, das landet bei Netlify und per Mail bei Alexander, nicht auf der Seite. Auf der Seite steht nur, was er freigibt. Sagt er "stell das rein", rufst du action comment mit post, name und text auf, Wortlaut unverändert, nicht geglättet und nicht übersetzt. Erfinde nie einen Kommentar und stell nie einen rein, den er dir nicht vorgelesen hat. author "me" schreibt eine Antwort von ihm selbst. hideComment nimmt einen Kommentar von der Seite und behält ihn, deleteComment löscht ihn. Der Gedankenstrich-Regel unterliegen Kommentare von Lesern nicht, seine eigenen Texte schon.

    Wenn die API einen Fehler meldet, gib den Wortlaut vollständig weiter und erkläre ihn. Bei 400 wurde nichts geschrieben. Bei 500 steht die eigentliche Ursache im Text der Meldung, lies sie vor.

Actions, Create new action, Import from URL, dort https://seelischabstrakt.netlify.app/openapi.yaml eintragen. Wenn der Import nicht geht, dieselbe Adresse in Safari öffnen und den Inhalt in das Schema-Feld kopieren. Authentication: API Key, Auth Type: Custom, Header name: x-desk-key, Key: dein DESK_KEY. Speichern.

    Praxisseite: Jeder Text steht in fünf Sprachen, it, en, de, fr, ar, Italienisch ist die Quelle. Fehlt eine Übersetzung, zeigt die Seite Italienisch. Über einen Arzt wird nichts erfunden: kein Titel, keine Fachrichtung, keine Ordine-Nummer, kein Preis, keine Öffnungszeit, keine Adresse, die dir nicht genannt wurde. Fehlt etwas, frag nach und lass das Feld leer. Recensioni von MioDottore werden nie hierher kopiert, die Seite verlinkt nur das Profil. Eine Patientenstimme erscheint erst mit consent true, und das heißt, es gibt eine schriftliche Erlaubnis. Wortlaut nicht glätten und nicht übersetzen. Kein Text darf ein Ergebnis versprechen, in Italien muss die Seite eines Arztes informieren und nicht werben.

## Teil 3: Was der GPT kann

- Werk anlegen, ändern, als verkauft markieren, löschen
- Preise, Versandpauschalen, Steuerschalter, Zahlungslink ändern
- Alle Texte des Shops in EN und DE ändern, auch die Oberflächenbegriffe
- Farben, Schriften, Layout, Hintergrundmuster, ausgeblendete Bereiche, Coming-soon-Modus
- Rechtsdaten des Shops, also Name, Adresse, E-Mail, UID, Kleinunternehmer
- Kapitel der Geschichte und Texte der persönlichen Seite anlegen, ändern, löschen, als Entwurf halten
- Freigegebene Leserkommentare veröffentlichen, verbergen, löschen, und selbst darauf antworten
- Auf der Praxisseite Leistungen, Adressen, Öffnungszeiten, Texte und freigegebene Patientenstimmen pflegen, in fünf Sprachen
- Fotos hochladen, wenn eine öffentliche https-Adresse existiert

## Teil 4: Was der GPT nicht kann

- Fotos direkt aus dem Chat hochladen. Für Werke im Shop: /add am Handy für ein neues Werk, der Studio desk für ein bestehendes. Für die persönliche Seite siehe den nächsten Punkt.
- Fotos für die persönliche Seite vom iPad. Dafür gibt es keinen Knopf. Weg: github.com, dein Repository, Ordner portfolio/img öffnen, Add file, Upload files, Foto auswählen, Commit. Dann dem GPT sagen, wie die Datei heißt, exakt so wie hochgeladen, also zum Beispiel img/mein-foto.jpg. Groß- und Kleinschreibung zählt. Die API prüft, ob die Datei existiert, und weist einen falschen Namen zurück.
- Die Kommentare der Leser lesen. Die stehen in Netlify unter Forms und in deiner Mail. Du liest sie dort und sagst dem GPT, welcher auf die Seite darf.
- Die Rechtstexte im Fließtext ändern, also Impressum, AGB, Datenschutz. Die stehen in index.html und werden aus den Feldern erzeugt.
- Das Layout im Code ändern, also index.html, admin.html, add.html, netlify.toml.
- Etwas an Netlify einstellen. Environment variables, Domains und Formulare bleiben Handarbeit.
- Eine Bestellung bearbeiten. Rechnung und Versand machst du selbst.

## Teil 5: Der Studio desk, wenn du lieber tippst als redest

seelischabstrakt.netlify.app/desk. Safari fragt nach Name und Passwort. Der Name wird nicht geprüft, schreib deinen Vornamen hinein und immer denselben, dann speichert Safari nur einen Eintrag. Das Passwort ist der Wert, den du in Teil 1 unter DESK_PASSWORD gesetzt hast.

Einmal den GitHub-Token im Tab Publish eintragen, er bleibt in diesem Browser. Danach Fotos mit Zuschneiden, Preise, Verkauft, Texte, Design und Rechtsdaten des Shops direkt am iPad, mit Live-Vorschau.

Wichtig, wenn du auch den GPT benutzt: Der Desk arbeitet mit dem Stand, den er beim Öffnen geladen hat. Hast du zwischendurch im GPT etwas geändert, lade den Desk zuerst neu, bevor du zu tippen anfängst. Nicht umgekehrt, ein Reload wirft alles weg, was du seit dem Öffnen eingegeben hast, auch schon zugeschnittene Fotos. Faustregel: Desk öffnen, tippen, Publish, Tab schließen. Keinen Desk-Tab über Nacht offen lassen. Der Desk schreibt beim Publish nur die Datei, die du auch geändert hast, und sagt dir in der Statuszeile, welche er nicht angerührt hat.

Die persönliche Seite hat keine solche Oberfläche. Sie wird über den GPT gepflegt oder direkt in GitHub, Datei portfolio/journal.json, Stift-Symbol. Das gilt auch für die Kommentare, siehe portfolio/README.md.

## Teil 6: Wenn etwas nicht geht

Zuerst schauen, woher die Meldung kommt. Beginnt sie mit "Publish failed", kommt sie aus dem Studio desk und hat mit Netlify nichts zu tun. Kommt sie aus ChatGPT oder von /add, geht es um die Netlify-Variablen.

Die API antwortet nie mit 403. Ein Token-Problem kommt immer als 500 an, im Text der Meldung steht dann GitHub 401 oder GitHub 403. Lies bei einer 500 immer den Wortlaut, nicht nur die Zahl.

Aus ChatGPT oder von /add:

    Seite zeigt nichts         works.json, site.json oder journal.json hat ein Komma zu viel oder zu wenig.
                               Datei in GitHub öffnen, Inhalt in jsonlint.com prüfen.
    401                        DESK_KEY in Netlify stimmt nicht mit dem Schlüssel im GPT überein.
    400                        Validierung. Der Text sagt, was falsch ist. Es wurde nichts geschrieben.
    404 No work with id        Diese id gibt es nicht. Den GPT listWorks aufrufen lassen und die id von dort nehmen.
    404 No chapter with id     Dasselbe auf der persönlichen Seite, erst getJournal aufrufen lassen.
    404 No text with id        Ebenso, die id steht unter writing.posts.
    400 There is no text       Der Kommentar zeigt auf einen Text, den es nicht gibt. getJournal, id von dort nehmen.
    404 not found              site.json oder journal.json nicht gefunden. GITHUB_REPO und GITHUB_BRANCH prüfen.
    409                        Ein Werk mit dieser id gibt es schon. Zum Ändern die id schicken,
                               für ein zweites Werk einen anderen Titel wählen.
    500 GitHub 401 oder 403    Token abgelaufen oder ohne Contents: Read and write. Neuen Token erzeugen,
                               in Netlify als GITHUB_TOKEN eintragen, Trigger deploy.
    500 Server not configured  GITHUB_TOKEN oder GITHUB_REPO fehlt in Netlify.

Aus dem Studio desk:

    Publish failed 401         Der Token im Tab Publish ist falsch oder abgelaufen. Neuen erzeugen und dort eintragen.
    Publish failed 403         Dem Token im Tab Publish fehlt Contents: Read and write.
    Publish failed 404         Feld User oder Repository im Tab Publish falsch geschrieben.
    locked oder 503            DESK_PASSWORD fehlt in Netlify.

Netlify baut nicht: Deploys öffnen, Log lesen. Meist steht der Dateiname darin.

## Teil 7: Sicherheit

Weder der Desk-Schlüssel noch der GitHub-Token stehen je im Repository oder in einer Nachricht. Sonst liegen sie an mehreren Stellen, und bei einem Wechsel musst du alle nachziehen.

    DESK_KEY         in Netlify, im GPT unter Actions, und wenn du /add am Handy benutzt, zusätzlich in diesem Browser.
    GITHUB_TOKEN     in Netlify, und wenn du den Studio desk benutzt, zusätzlich in diesem Browser.
    DESK_PASSWORD    nur in Netlify, und gespeichert in dem Browser, mit dem du /desk öffnest.

Wenn einer auftaucht, wo er nicht hingehört: DESK_KEY in Netlify neu setzen, im GPT nachtragen, auf /add neu eingeben. Beim Token in GitHub widerrufen, neuen erzeugen, in Netlify eintragen, Trigger deploy, und im Desk unter Publish auf "Forget token" tippen und den neuen eintragen.

Der GPT kann über die API nur works.json, site.json, portfolio/journal.json und Bilder in img/ und portfolio/img/ schreiben. An index.html, die Rechtstexte und die Netlify-Konfiguration kommt er nicht heran. Jede Datei ist auf 512 kB begrenzt, damit ein versehentlich in ein Textfeld gerutschtes Foto die Seite nicht lahmlegt.
