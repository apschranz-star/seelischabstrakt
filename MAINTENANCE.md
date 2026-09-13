# Betriebsanleitung für KI-Assistenten (ChatGPT, Claude)

Du hilfst Alexander Schranz, den Shop seelischabstrakt zu pflegen. Lies das hier zuerst, dann handle.

## Was der Shop ist
Eine statische Website (kein Framework, kein Build, keine Datenbank) in einem GitHub-Repository, das Netlify automatisch veröffentlicht. Jede Änderung an einer Datei im Repository ist etwa eine Minute später live.

## Dateien und was du damit tun darfst
- works.json: die Produkte. Hier kommen neue Werke hinein, Preise, "available": false für verkauft, Captions in EN und DE. Struktur nie ändern, nur Werte und Einträge. Feld "img" zeigt auf eine Datei in img/.
- site.json: alle Texte (EN/DE), Farben, Schriften, Layout, Versandkosten, Steuerflag, rechtliche Angaben. Werte ändern erlaubt, Schlüssel nicht umbenennen.
- img/: Fotos. Dateinamen klein, mit Bindestrichen, .jpg, maximal 1600 px lange Seite.
- index.html, admin.html, add.html, netlify/functions/works.js, netlify.toml: Code. Nur ändern, wenn Alexander ausdrücklich eine Design- oder Funktionsänderung wünscht. Dann immer die ganze Datei zurückgeben, nie Ausschnitte. Nie index.html und admin.html im selben Schritt umbauen.
- README.md: Anleitung für Menschen. Dieses Dokument: Anleitung für dich.

## Wenn du keine Action hast: der Block für /add
Gib das Werk als einen einzigen JSON-Block aus, ohne Kommentar davor oder danach, genau in dieser Form. Alexander kopiert ihn in das Feld "Aus ChatGPT einfügen" auf seelischabstrakt.netlify.app/add, wählt das Foto und tippt Veröffentlichen.

{"title":"Kopf, rot","w":30,"h":24,"year":2026,"price":380,"medium":{"de":"Ölkreide und Acryl auf Papier, gerahmt","en":"Oil stick and acrylic on paper, framed"},"caption":{"de":"Roter Grund, weiße Spachtelzüge.","en":"Red ground, white knife strokes."},"nomat":false,"prints":[{"size":"30 × 40","price":95}]}

Regeln: w und h in cm als Zahl, price in EUR als Zahl, prints leer lassen ([]) wenn keine Drucke, nomat true nur wenn das Foto bereits Rahmen und Teppich zeigt. Captions schreibst du selbst.

## Der schnellste Weg, ein Werk anzulegen (mit Action)
Wenn du eine Action "upsertWork" hast (Custom GPT): rufe sie mit title, w, h (cm), medium {en, de}, caption {en, de}, price (EUR), optional prints [{size, price}] auf. Captions schreibst du selbst: ein bis zwei Sätze, konkret, roh, keine Werbesprache, keine Ausrufezeichen, keine Gedankenstriche. Fotos kannst du nicht hochladen; sag Alexander, er soll das Foto unter /add oder im Studio desk nachlegen, oder gib der Action eine öffentliche Bild-URL mit.

Wenn du keine Action hast: erzeuge den fertigen JSON-Block für works.json und sag ihm, er soll ihn im Studio desk oder direkt in GitHub (Stift-Symbol auf der Datei) einfügen. Komma-Regeln beachten.

## Tonalität der Texte
Atelier in Wien, kleine Formate, Teppich als Bühne, "Multum in parvo." Sätze kurz. Deutsch in österreichischer Färbung, Englisch schlicht. Keine Gedankenstriche im Text.

## Was du nie tust
- Preise oder Rechtstexte erfinden. Bei Unsicherheit fragen.
- Den Desk-Schlüssel oder Tokens irgendwo hinschreiben.
- Werke löschen, ohne dass Alexander es ausdrücklich sagt (verkauft = "available": false, nicht löschen).
- Die Struktur von works.json oder site.json verändern.

## Wenn etwas kaputt ist
Seite zeigt keine Werke: fast immer ein fehlendes Komma in works.json oder site.json. Datei durch einen JSON-Prüfer laufen lassen, Zeile korrigieren.
/add oder die Action meldet 401: Desk-Schlüssel falsch (Netlify, Environment variables, DESK_KEY).
Meldet 500 mit GitHub: Token abgelaufen oder ohne Schreibrecht (Contents: Read and write). Neuen Token erzeugen, in Netlify als GITHUB_TOKEN eintragen, neu deployen.
Netlify baut nicht: Deploys öffnen, Log lesen, meist steht der Dateiname dort.

## Die ganze Seite über die Action pflegen (Custom GPT mit openapi.yaml)

Neben upsertWork und listWorks gibt es getSite und updateSite. Damit änderst du alles, was nicht ein Werk ist: Texte in EN und DE, Farben, Schrift, Layout, Versandpauschalen, Steuerschalter, Rechtsdaten, Bezahl-Link. Zuerst getSite aufrufen, dann gezielt ändern, nie das ganze Objekt zurückschicken.

Zwei Formen:
- patch: ein Teilobjekt, das in site.json eingemischt wird. Objekte werden zusammengeführt, Listen und Einzelwerte ersetzt. Beispiel: {"action":"patch","patch":{"texts":{"heroMeta":{"de":"Neun Arbeiten, es werden mehr","en":"Nine works and counting"}}}}
- set: einzelne Werte über einen Pfad. Beispiel: {"action":"set","sets":[{"path":"commerce.shipping.rates.AT.print","value":9},{"path":"legal.street","value":"Gasse 1/2"}]}

Erlaubt sind nur brand, theme, commerce, texts, printTiers, legal. Der Block publish ist gesperrt. Versandsätze müssen Zahlen sein, kleinunternehmer true oder false, customCss darf kein script, @import oder externe URLs enthalten. Bei einem Fehler wird nichts geschrieben, die Antwort nennt den Grund.

Was wo liegt:
- Texte: texts.heroLead, heroMeta, worksKicker, printsLead, aboutLead, aboutParagraphs (Liste), facts (Liste aus label und value), commission.intro und commission.steps, contactIntro, copyright. Alles mit en und de.
- Oberflächentexte (Menü, Knöpfe, Bestelldialog): texts.ui.en und texts.ui.de als Wörterbuch Schlüssel zu Text. Nur die Schlüssel eintragen, die anders lauten sollen, der Rest bleibt Standard. Schlüsselliste unten.
- Design: theme.preset (carpet, shawl, paper, gallery, custom), theme.colors (nur bei custom), theme.pattern (gul, paisley, none), theme.patternSvg und patternSize (eigenes Muster bei custom), theme.fonts.display, body, mono (Google-Fonts-Namen), theme.layout.heroStyle (split, stacked, minimal), gridDensity (airy, normal, dense), framesByDefault, showTilt, hideSections (Liste aus prints, about, commission, contact, trust, facts, filters, lang), theme.customCss.
- Marke: brand.name, wordmarkTop, wordmarkBottom, motto, artist, city, instagram, email, personSite, defaultLang, logo (Bildpfad statt Schriftzug), logoWidth.
- Shop: commerce.kleinunternehmer, shipping.rates.REGION.print und original (AT, EU, UK, CH, US, ROW), shipping.pickupCity, shippingNote, usNote, payment.revolutLink, payment.confirmationHours, notify.enabled.
- Drucke: printTiers als Liste aus size, price, edition, paper.
- Recht: legal.legalName, street, zipCity, country, email, phone, uid, kleinunternehmerNote, payment (Name des Zahlungsanbieters), returnsDaysPrints, originalsMadeToOrderExempt, lastUpdated. Rechtstexte selbst stehen in index.html und werden aus diesen Feldern erzeugt.

Regeln dabei: Preise, Versandsätze und Rechtsdaten nur ändern, wenn Alexander den Wert nennt. Bei Texten den Ton halten. Nach jeder Änderung in einem Satz sagen, was live geht.

Schlüssel für texts.ui (Standardtexte EN / DE):
- nav.works: EN "Works" / DE "Arbeiten"
- nav.prints: EN "Prints" / DE "Drucke"
- nav.about: EN "About" / DE "Über"
- nav.commission: EN "Commissions" / DE "Auftragsarbeiten"
- nav.contact: EN "Contact" / DE "Kontakt"
- hero.cta1: EN "See available works" / DE "Verfügbare Arbeiten"
- works.title: EN "Works" / DE "Arbeiten"
- filter.all: EN "All" / DE "Alle"
- filter.original: EN "Originals" / DE "Originale"
- filter.print: EN "Prints" / DE "Drucke"
- filter.available: EN "Available" / DE "Verfügbar"
- works.note: EN "" / DE ""
- prints.kicker: EN "Giclée on archival paper" / DE "Giclée auf Archivpapier"
- prints.title: EN "Print editions" / DE "Druckeditionen"
- comm.title: EN "Commissions" / DE "Auftragsarbeiten"
- comm.cta: EN "Start a commission" / DE "Auftrag anfragen"
- contact.title: EN "Contact" / DE "Kontakt"
- contact.mail: EN "Write an email" / DE "E-Mail schreiben"
- footer.person: EN "The person behind the studio" / DE "Die Person hinter dem Atelier"
- close: EN "Close" / DE "Schließen"
- consent.no: EN "Only necessary" / DE "Nur notwendige"
- consent.yes: EN "Accept" / DE "Akzeptieren"
- consent.text: EN "This site uses optional analytics cookies to understand visits. Necessary cookies only remember your language choice." / DE "Diese Seite verwendet optionale Analyse-Cookies, um Besuche zu verstehen. Notwendige Cookies merken sich nur deine Sprachwahl."
- lbl.original: EN "Original" / DE "Original"
- lbl.print: EN "Print" / DE "Druck"
- lbl.sold: EN "Sold" / DE "Verkauft"
- lbl.buyOriginal: EN "Buy original" / DE "Original kaufen"
- lbl.buyPrint: EN "Buy print" / DE "Druck kaufen"
- lbl.enquire: EN "Enquire" / DE "Anfragen"
- lbl.edition: EN "Edition of" / DE "Auflage"
- lbl.from: EN "from" / DE "ab"
- lbl.placeholder: EN "placeholder image" / DE "Platzhalterbild"
- lbl.chooseSize: EN "Print size" / DE "Druckgröße"
- order.title: EN "Order" / DE "Bestellung"
- order.name: EN "Full name" / DE "Vor- und Nachname"
- order.email: EN "Email" / DE "E-Mail"
- order.address: EN "Shipping address" / DE "Lieferadresse"
- order.country: EN "Country" / DE "Land"
- order.message: EN "Message (optional)" / DE "Nachricht (optional)"
- order.agree: EN "I have read the Terms and the withdrawal notice and agree to them. For originals I understand they are made to order or one-offs." / DE "Ich habe die AGB und die Widerrufsbelehrung gelesen und stimme zu. Bei Originalen ist mir bewusst, dass es Unikate oder Anfertigungen sind."
- order.submit: EN "Order and pay" / DE "Zahlungspflichtig bestellen"
- order.country.pick: EN "Select country" / DE "Land wählen"
- order.pickup: EN "Collect in {city} (free)" / DE "Abholung in {city} (kostenlos)"
- order.copyMail: EN "Email me a copy" / DE "Kopie an mich mailen"
- order.print: EN "Print or save as PDF" / DE "Drucken oder als PDF sichern"
- order.date: EN "Order date" / DE "Bestelldatum"
- notify.title: EN "New works by email" / DE "Neue Arbeiten per E-Mail"
- notify.text: EN "One short email when a new piece goes up. No newsletter, no tracking." / DE "Eine kurze Mail, wenn ein neues Stück online geht. Kein Newsletter, kein Tracking."
- notify.btn: EN "Notify me" / DE "Benachrichtigen"
- notify.ok: EN "Thanks, you are on the list." / DE "Danke, du bist auf der Liste."
- notify.placeholder: EN "your@email.com" / DE "deine@email.com"
- order.sending: EN "Sending…" / DE "Wird gesendet…"
- order.needAgree: EN "Please tick the box to continue." / DE "Bitte das Kästchen anhaken."
- order.fail: EN "The order could not be sent automatically. Your email app will open instead." / DE "Die Bestellung konnte nicht automatisch gesendet werden. Stattdessen öffnet sich dein E-Mail-Programm."
- order.thanks: EN "Thank you. Your order number is" / DE "Danke. Deine Bestellnummer ist"
- order.payTitle: EN "Pay with Revolut" / DE "Mit Revolut bezahlen"
- order.payText: EN "Open the link, send the total and put the order number in the message. If the amount is not prefilled, type it in." / DE "Link öffnen, Gesamtbetrag senden und die Bestellnummer in die Nachricht schreiben. Falls der Betrag nicht vorausgefüllt ist, bitte eintippen."
- order.payBtn: EN "Pay {amount} on Revolut" / DE "{amount} über Revolut zahlen"
- order.after: EN "You will receive an invoice and order confirmation by email within {h} hours. The work ships after payment is received. Questions: {email}." / DE "Rechnung und Bestellbestätigung kommen innerhalb von {h} Stunden per E-Mail. Versand nach Zahlungseingang. Fragen: {email}."
- order.copy: EN "Copy order number" / DE "Bestellnummer kopieren"
- order.copied: EN "Copied" / DE "Kopiert"
- order.ship: EN "Shipping" / DE "Versand"
- order.shipTbd: EN "select country" / DE "Land wählen"
- order.total: EN "Total to pay now" / DE "Jetzt zu zahlen"
- trust: EN "Signed certificate · Ships from Vienna · {d}-day returns on prints · Secure order, payment by Revolut" / DE "Signiertes Zertifikat · Versand aus Wien · {d} Tage Rückgabe bei Drucken · Sichere Bestellung, Zahlung per Revolut"
- legal.imprint: EN "Imprint" / DE "Impressum"
- legal.privacy: EN "Privacy" / DE "Datenschutz"
- legal.terms: EN "Terms and returns" / DE "AGB und Widerruf"
- legal.shipping: EN "Shipping and taxes" / DE "Versand und Steuern"
- legal.us: EN "US buyers" / DE "US-Käufer"
- legal.access: EN "Accessibility" / DE "Barrierefreiheit"
- price.incl: EN "Prices include {vo} % VAT on original artworks and {vp} % on prints (Austria). Shipping is calculated at checkout." / DE "Preise inkl. {vo} % USt auf Originale und {vp} % auf Drucke (Österreich). Versand wird im Checkout berechnet."
- price.klein: EN "Prices are final; no VAT is shown separately (small business exemption, § 6 Abs 1 Z 27 UStG)." / DE "Preise sind Endpreise; gemäß § 6 Abs 1 Z 27 UStG wird keine Umsatzsteuer ausgewiesen (Kleinunternehmer)."
- price.returns: EN "{d}-day right of withdrawal on prints. Commissions made to order are exempt; for existing originals we grant a voluntary return within the same period." / DE "{d} Tage Widerrufsrecht bei Drucken. Auftragsarbeiten nach Kundenwunsch sind ausgenommen, bei bestehenden Originalen gewähren wir freiwillig dieselbe Frist zur Rückgabe."
