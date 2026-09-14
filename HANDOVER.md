# Übergabe: beide Seiten ohne Claude betreiben

Zwei Websites, ein GitHub-Repository, ein Netlify-Konto. Alles, was du täglich brauchst, geht über einen Custom GPT in ChatGPT oder über den Studio desk am iPad. Diese Datei ist die vollständige Anleitung.

    seelischabstrakt.netlify.app     der Shop, Ordner / im Repo
    alexanderschranz.netlify.app     das Journal, Ordner /portfolio im Repo

Beide bauen aus demselben Repository. Jede Änderung an einer Datei ist etwa eine Minute später live.

## Teil 1: Netlify einrichten (einmalig)

### Shop-Seite (existiert bereits)
Netlify, Projekt seelischabstrakt, Site configuration, Environment variables. Vier Einträge:

    DESK_KEY        ein langes Passwort, das du dir ausdenkst. Das ist der Schlüssel für ChatGPT und /add.
    GITHUB_TOKEN    GitHub, Settings, Developer settings, Fine-grained tokens. Nur dieses Repository, Repository permissions, Contents: Read and write.
    GITHUB_REPO     apschranz-star/seelischabstrakt
    GITHUB_BRANCH   main

    DESK_PASSWORD   zusätzlich, das Passwort für den Studio desk unter /desk

Danach Deploys, Trigger deploy. Test: seelischabstrakt.netlify.app/api/works im Browser öffnen, es muss JSON erscheinen.

### Journal-Seite (noch anzulegen)
Netlify, Add new project, Import from Git, dasselbe Repository. Base directory: portfolio. Publish directory: portfolio. Build command leer. Deploy. Dann Project configuration, General, Change project name: alexanderschranz.

Diese zweite Seite braucht keine Environment variables. Die API läuft auf der Shop-Seite und schreibt ins gemeinsame Repository, beide Seiten bauen daraufhin neu.

### Formulare
Nur auf der Shop-Seite: Forms, Enable form detection, dann Form notifications, Email notification für das Formular "order" und für "notify", jeweils an a.p.schranz@icloud.com.

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
    Keine Gedankenstriche in Texten, weder im Deutschen noch im Englischen. Komma oder Punkt.
    Kurze Sätze, konkret, keine Werbesprache, keine Ausrufezeichen. Deutsch mit leichter österreichischer Färbung, Englisch schlicht.
    Texte immer in beiden Sprachen liefern, en und de.
    Den Desk-Schlüssel niemals in eine Antwort schreiben.

    Werke im Shop: Beschreibt Alexander ein neues Werk mit Titel, Maßen in cm, Technik, Jahr und Preis, dann rufe upsertWork mit action add auf. Captions schreibst du selbst, ein bis zwei Sätze, konkret. Verkauft heißt available false, nicht löschen. Fotos kannst du nicht hochladen, außer er gibt dir eine öffentliche https-Adresse; sonst sag ihm, er soll das Foto unter /add oder im Studio desk nachlegen.

    Journal: Ein Eintrag besteht aus kicker, title, standfirst, drei bis fünf kurzen Absätzen, einem pullquote aus dem Eintrag selbst und einem Bild mit Caption. Der standfirst muss etwas sagen, das im ersten Absatz nicht steht. Mehr als sechs veröffentlichte Einträge lässt die API nicht zu, das ist Absicht. Ein Eintrag mit draft true wird geschrieben, aber nicht angezeigt. Bilder erst mit action image hochladen, dann den zurückgegebenen Pfad als figure.src verwenden.

    Wenn die API einen Fehler meldet, gib den Wortlaut weiter und erkläre ihn: 401 falscher Desk-Schlüssel, 403 Token ohne Schreibrecht, 404 falscher Repository-Name, 400 Validierung, dabei wurde nichts geschrieben.

Actions, Create new action, Import from URL oder den Inhalt von openapi.yaml einfügen. Authentication: API Key, Auth Type: Custom, Header name: x-desk-key, Key: dein DESK_KEY. Speichern.

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

- Fotos direkt aus dem Chat hochladen. Dafür /add am Handy oder der Studio desk.
- Die Rechtstexte im Fließtext ändern, also Impressum, AGB, Datenschutz. Die stehen in index.html und werden aus den Feldern erzeugt.
- Das Layout im Code ändern, also index.html, photos.html, admin.html, add.html, netlify.toml.
- Etwas an Netlify einstellen. Environment variables, Domains und Formulare bleiben Handarbeit.
- Eine Bestellung bearbeiten. Rechnung und Versand machst du selbst.

## Teil 5: Der Studio desk, wenn du lieber tippst als redest

seelischabstrakt.netlify.app/desk, Passwort DESK_PASSWORD. Einmal den GitHub-Token im Tab Publish eintragen. Danach Fotos mit Zuschneiden, Preise, Verkauft, Texte, Design und Rechtsdaten des Shops direkt am iPad, mit Live-Vorschau.

Das Journal hat keine solche Oberfläche. Es wird über den GPT gepflegt oder direkt in GitHub, Datei portfolio/journal.json, Stift-Symbol.

## Teil 6: Wenn etwas nicht geht

    Seite zeigt nichts        works.json, site.json oder journal.json hat ein Komma zu viel oder zu wenig. Datei in GitHub öffnen, Inhalt in jsonlint.com prüfen.
    401                       DESK_KEY in Netlify stimmt nicht mit dem Schlüssel im GPT überein.
    403                       Token abgelaufen oder ohne Contents: Read and write. Neuen Token erzeugen, in Netlify eintragen, Trigger deploy.
    404                       GITHUB_REPO falsch geschrieben.
    400                       Validierung. Der Text der Fehlermeldung sagt, was falsch ist. Es wurde nichts geschrieben.
    500 Server not configured GITHUB_TOKEN oder GITHUB_REPO fehlt in Netlify.
    Netlify baut nicht        Deploys öffnen, Log lesen. Meist steht der Dateiname darin.
    Desk meldet locked        DESK_PASSWORD fehlt in Netlify.

## Teil 7: Sicherheit

Der Desk-Schlüssel und der GitHub-Token liegen nur in Netlify und im GPT, nie im Repository und nie in einer Nachricht. Wenn einer davon irgendwo auftaucht, sofort ersetzen: DESK_KEY in Netlify neu setzen und im GPT nachtragen, Token in GitHub widerrufen und neu erzeugen.

Der GPT kann über die API nur works.json, site.json, portfolio/journal.json und Bilder in img/ und portfolio/img/ schreiben. An index.html, die Rechtstexte und die Netlify-Konfiguration kommt er nicht heran.
