# alexanderschranz.netlify.app

Die persönliche Seite von Alexander Schranz. Warm, fotogeführt, ohne Framework und ohne Build. Eine
einzige Seite:

    index.html    Start, Geschichte, Texte, Kontakt. Ein Text allein liegt unter ?post=id
    journal.json  der gesamte Inhalt
    img/          die Fotos

## Pflegen
Alles steht in journal.json. In GitHub öffnen, Stift-Symbol, ändern, Commit. Eine Minute später live.
ChatGPT kann dasselbe über die Aktion journal machen, siehe HANDOVER.md im Hauptordner.

- Jeder Text ist ein Paar: {"en": "...", "de": "..."}. Fehlt Deutsch, wird Englisch gezeigt.
- "draft": true schreibt etwas, veröffentlicht es aber nicht. So kann ein halb fertiger Text ruhig liegen bleiben.
- Geschichte: "story.chapters". Ein Kapitel hat title, period (die kleine Zeile darüber), paragraphs und
  optional ein image mit src und caption. Höchstens sechs veröffentlichte Kapitel, der Rest bleibt draft.
- Texte: "writing.posts". Ein Text hat id, date, title, excerpt, paragraphs und optional images. Unter jedem
  Text steht das Formular. "commentsClosed": true blendet es bei einem einzelnen Text aus.
- Fotos nach img/ legen, 1400 px lange Seite, unter 450 kB, und als "img/name.jpg" eintragen.
- Kopf, Portrait und E-Mail stehen in "profile", die Fußzeile in "footer".

## Kommentare
Unter jedem Text steht "Share your thoughts". Das Formular ist ein Netlify-Formular mit dem Namen
"comment". Was jemand schreibt, landet in Netlify unter Forms und per Mail, nicht auf der Seite.

Veröffentlichen heißt: einen Eintrag in "comments" anlegen.

    { "id": "a-first-memory-mara-1", "post": "a-first-memory", "name": "Mara",
      "text": "Wortlaut wie geschrieben", "date": "2026-09-14" }

- "post" ist die id des Textes, unter dem der Kommentar steht.
- "author": "me" macht daraus eine Antwort von Alexander, sie wird abgesetzt dargestellt.
- "approved": false nimmt einen Kommentar wieder von der Seite, ohne ihn zu löschen.
- Nichts steht auf der Seite, bevor Alexander es hierher schreibt. Kein Kommentar wird erfunden und keiner
  wird geglättet, der Wortlaut bleibt.

Einmalig in Netlify einstellen: Project configuration, Forms, Form notifications, Email notification auf
a.p.schranz@icloud.com. Sonst merkt niemand, dass jemand geschrieben hat.

## Was die Seite bewusst nicht hat
Keinen Lebenslauf, keine Firmennamen, keinen Beruf, nichts zu verkaufen, kein Tracking, keine Links nach
außen außer der E-Mail. Wer das wieder will, findet die frühere Fassung in der Git-Historie.

## Impressum
Die Seite hat keinen Impressumslink. Sobald sie beruflich verschickt wird, gehört einer dazu: Name,
Adresse, E-Mail. Als kleine impressum.html im Ordner.

## Netlify einrichten (einmalig)
1. Netlify, Add new project, Import from Git, dasselbe Repository wählen.
2. Base directory: portfolio. Publish directory: portfolio. Build command leer.
3. Deploy, dann Project configuration, General, Change project name: alexanderschranz.
4. Forms einschalten, siehe oben.
5. Eigene Domain später: Domain management, Add domain. Danach die Adresse in index.html (canonical),
   sitemap.xml und robots.txt tauschen.

## ChatGPT
journal.json und diese Datei zeigen, beschreiben, was neu ist, den fertigen JSON-Block zurückkopieren.
