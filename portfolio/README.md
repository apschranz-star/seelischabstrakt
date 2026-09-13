# alexanderschranz.netlify.app (später alexanderschranz.at)

Persönliches Portfolio, schwarzweiß, eine Seite. Kein Framework, kein Build. Alles Inhaltliche steht in portfolio.json.

## Pflegen
- portfolio.json in GitHub öffnen (Stift-Symbol), ändern, Commit. Eine Minute später live.
- Texte können ein einfacher String sein oder {"en": "...", "de": "..."}. Sobald irgendwo ein "de" steht, erscheint der Sprachschalter.
- Neues Projekt: einen Block in projects.items kopieren. "draft": true blendet einen Eintrag aus.
- Beruf: work.paragraphs, work.focus (vier Schwerpunkte), work.experience (Stationen) und work.note. Netzwerk: network.paragraphs und network.columns.
- Neuer Eintrag unter Aktuell: updates.items, Datum als JJJJ-MM oder JJJJ-MM-TT, neueste stehen automatisch oben.
- Bilder in portfolio/img ablegen (klein, unter 400 kB), Pfad img/name.jpg eintragen. Alle Bilder erscheinen schwarzweiß, in Farbe erst beim Darüberfahren.
- Die Seite ist rein beruflich. Der Kunstbereich ist abgeschaltet: Er liegt als Block "_art" in der Datei. Wer ihn wieder will, benennt "_art" in "art" um und ergänzt {"id": "art", "label": {"en": "Art", "de": "Kunst"}} in nav. Er holt die Werke dann automatisch aus dem Shop.
- Reihenfolge und Namen der Bereiche: nav. Ein Bereich verschwindet, wenn sein Block in portfolio.json fehlt.
- Dunkel oder hell folgt dem System, der Knopf oben links schaltet um.

## Netlify einrichten (einmalig)
1. Netlify, Add new project, Import from Git, dasselbe Repository wählen.
2. Base directory: portfolio. Publish directory: portfolio. Build command leer.
3. Deploy. Dann Project configuration, General, Change project name: alexanderschranz. Die Seite heißt dann alexanderschranz.netlify.app.
4. Später eigene Domain: Domain management, Add domain, alexanderschranz.at, DNS-Anleitung befolgen. HTTPS kommt automatisch. Danach die Adresse in portfolio.json (seo.url), index.html (canonical), sitemap.xml, robots.txt und im Shop (brand.personSite) tauschen.

## Impressum
Die Seite hat derzeit keinen Impressumslink. Sobald sie beruflich beworben wird, gehört einer dazu: Name, Adresse, E-Mail. Entweder als eigener Block hier eintragen (footer.links mit Ziel) oder eine kleine impressum.html im Ordner anlegen und verlinken.

## ChatGPT
Dem GPT diese Datei und portfolio.json zeigen und sagen, was neu ist. Er liefert den fertigen JSON-Block, den du in GitHub einfügst.
