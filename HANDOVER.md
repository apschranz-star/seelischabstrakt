# Übergabe: beide Seiten ohne Claude betreiben

Zwei Websites, ein GitHub-Repository, ein Netlify-Konto. Alles Tägliche geht über einen Custom GPT in ChatGPT oder über den Studio desk am iPad. Diese Datei ist die vollständige Anleitung.

    seelischabstrakt.netlify.app     der Shop, Ordner / im Repo
    alexanderschranz.netlify.app     das Journal, Ordner /portfolio im Repo

Beide bauen aus demselben Repository. Jede Änderung an einer Datei ist etwa eine Minute später live.

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

### Journal-Seite (noch anzulegen)
Netlify, Add new project, Import from Git, dasselbe Repository. Base directory: portfolio. Publish directory leer lassen, Build command leer. Den Rest regelt die Datei portfolio/netlify.toml, die nicht gelöscht werden darf. Deploy. Dann Project configuration, General, Change project name: alexanderschranz.

Diese zweite Seite braucht keine Environment variables. Die API läuft auf der Shop-Seite und schreibt ins gemeinsame Repository, beide Seiten bauen daraufhin neu.

### Formulare
Nur auf der Shop-Seite: Forms, Enable form detection. Danach Deploys, Trigger deploy. Netlify liest die Formulare erst beim nächsten Deploy aus der Seite. Vorher stehen sie nicht in der Liste und es kommt auch keine Bestellung an. Erst nach diesem Deploy erscheinen "order" und "notify" unter Forms. Dann Form notifications, Email notification für "order" und für "notify", jeweils an a.p.schranz@icloud.com. Zum Schluss eine Testbestellung auf der Seite auslösen und schauen, ob sie in Netlify unter Forms auftaucht und die Mail ankommt.

## Teil 2: Den Custom GPT anlegen

ChatGPT, Explore GPTs, Create. Name: Schranz Desk.

Instructions, dieser Text hinein:

    Du pflegst zwei Websites von Alexander Schranz. Der Shop seelischabstrakt.netlify.app verkauft Originale und Editionen. Die persönliche Seite alexanderschranz.netlify.app ist ein Journal im Zeitungssatz, schwarzweiß, ohne Lebenslauf, ohne Firmennamen, ohne Verkauf.

    Werkzeuge: listWorks und upsertWork für Werke im Shop, getSite und updateSite für Texte, Design, Versand, Steuern und Rechtsdaten des Shops, getJournal und updateJournal für das Journal und die Tafelseite.

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

    Journal: Ein Eintrag besteht aus kicker, title, standfirst, drei bis fünf kurzen Absätzen, einem pullquote aus dem Eintrag selbst und einem Bild mit Caption. Der standfirst muss etwas sagen, das im ersten Absatz nicht steht. Mehr als sechs veröffentlichte Einträge lässt die API nicht zu, das ist Absicht; ein siebenter geht nur mit draft true. Für Einträge und Tafeln immer action entry oder action plate verwenden, nie patch, denn patch ersetzt die ganze Liste. Ein Foto zuerst mit action image hochladen und dann den zurückgegebenen Pfad als figure.src verwenden.

    Wenn die API einen Fehler meldet, gib den Wortlaut vollständig weiter und erkläre ihn. Bei 400 wurde nichts geschrieben. Bei 500 steht die eigentliche Ursache im Text der Meldung, lies sie vor.

Actions, Create new action, Import from URL, dort https://seelischabstrakt.netlify.app/openapi.yaml eintragen. Wenn der Import nicht geht, dieselbe Adresse in Safari öffnen und den Inhalt in das Schema-Feld kopieren. Authentication: API Key, Auth Type: Custom, Header name: x-desk-key, Key: dein DESK_KEY. Speichern.

## Teil 3: Was der GPT kann

- Werk anlegen, ändern, als verkauft markieren, löschen
- Preise, Versandpauschalen, Steuerschalter, Zahlungslink ändern
- Alle Texte des Shops in EN und DE ändern, auch die Oberflächenbegriffe
- Farben, Schriften, Layout, Hintergrundmuster, ausgeblendete Bereiche, Coming-soon-Modus
- Rechtsdaten des Shops, also Name, Adresse, E-Mail, UID, Kleinunternehmer
- Journal-Einträge anlegen, ändern, löschen, als Entwurf halten
- Tafelseite, also Fotos ergänzen, umbeschriften, entfernen
- Fotos hochladen, wenn eine öffentliche https-Adresse existiert

## Teil 4: Was der GPT nicht kann

- Fotos direkt aus dem Chat hochladen. Für Werke im Shop: /add am Handy für ein neues Werk, der Studio desk für ein bestehendes. Für das Journal siehe den nächsten Punkt.
- Journal-Fotos vom iPad. Dafür gibt es keinen Knopf. Weg: github.com, dein Repository, Ordner portfolio/img öffnen, Add file, Upload files, Foto auswählen, Commit. Dann dem GPT sagen, wie die Datei heißt, exakt so wie hochgeladen, also zum Beispiel img/mein-foto.jpg. Groß- und Kleinschreibung zählt. Die API prüft, ob die Datei existiert, und weist einen falschen Namen zurück.
- Die Rechtstexte im Fließtext ändern, also Impressum, AGB, Datenschutz. Die stehen in index.html und werden aus den Feldern erzeugt.
- Das Layout im Code ändern, also index.html, photos.html, admin.html, add.html, netlify.toml.
- Etwas an Netlify einstellen. Environment variables, Domains und Formulare bleiben Handarbeit.
- Eine Bestellung bearbeiten. Rechnung und Versand machst du selbst.

## Teil 5: Der Studio desk, wenn du lieber tippst als redest

seelischabstrakt.netlify.app/desk. Safari fragt nach Name und Passwort. Der Name wird nicht geprüft, schreib deinen Vornamen hinein und immer denselben, dann speichert Safari nur einen Eintrag. Das Passwort ist der Wert, den du in Teil 1 unter DESK_PASSWORD gesetzt hast.

Einmal den GitHub-Token im Tab Publish eintragen, er bleibt in diesem Browser. Danach Fotos mit Zuschneiden, Preise, Verkauft, Texte, Design und Rechtsdaten des Shops direkt am iPad, mit Live-Vorschau.

Wichtig, wenn du auch den GPT benutzt: Der Desk arbeitet mit dem Stand, den er beim Öffnen geladen hat. Hast du zwischendurch im GPT etwas geändert, lade den Desk zuerst neu, bevor du zu tippen anfängst. Nicht umgekehrt, ein Reload wirft alles weg, was du seit dem Öffnen eingegeben hast, auch schon zugeschnittene Fotos. Faustregel: Desk öffnen, tippen, Publish, Tab schließen. Keinen Desk-Tab über Nacht offen lassen. Der Desk schreibt beim Publish nur die Datei, die du auch geändert hast, und sagt dir in der Statuszeile, welche er nicht angerührt hat.

Das Journal hat keine solche Oberfläche. Es wird über den GPT gepflegt oder direkt in GitHub, Datei portfolio/journal.json, Stift-Symbol.

## Teil 6: Wenn etwas nicht geht

Zuerst schauen, woher die Meldung kommt. Beginnt sie mit "Publish failed", kommt sie aus dem Studio desk und hat mit Netlify nichts zu tun. Kommt sie aus ChatGPT oder von /add, geht es um die Netlify-Variablen.

Die API antwortet nie mit 403. Ein Token-Problem kommt immer als 500 an, im Text der Meldung steht dann GitHub 401 oder GitHub 403. Lies bei einer 500 immer den Wortlaut, nicht nur die Zahl.

Aus ChatGPT oder von /add:

    Seite zeigt nichts         works.json, site.json oder journal.json hat ein Komma zu viel oder zu wenig.
                               Datei in GitHub öffnen, Inhalt in jsonlint.com prüfen.
    401                        DESK_KEY in Netlify stimmt nicht mit dem Schlüssel im GPT überein.
    400                        Validierung. Der Text sagt, was falsch ist. Es wurde nichts geschrieben.
    404 No work with id        Diese id gibt es nicht. Den GPT listWorks aufrufen lassen und die id von dort nehmen.
    404 No entry with id       Dasselbe im Journal, erst getJournal aufrufen lassen. Ebenso bei No plate with src.
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
