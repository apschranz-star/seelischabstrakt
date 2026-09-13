# seelischabstrakt shop: how to run it yourself

This folder is the whole website. No Claude, no server, no database. Inside:

    index.html    the page. Never needs editing.
    admin.html    the Studio desk: edit works, texts, design, shop rules and legal data through forms, with live preview.
    site.json     everything except products (texts EN/DE, colours, fonts, layout, taxes, legal identity).
    works.json    your products.
    img/          your photos.

## The easy way: admin.html (Studio desk)

Open yoursite.netlify.app/admin.html (after the first deploy) or open admin.html from disk and click "Load files…" to pick site.json and works.json. Edit in the forms, watch the preview, then "Download site.json + works.json", move the two files into this folder (replace the old ones), move downloaded photos into img/, and drag the folder onto Netlify again. admin.html is marked noindex; if you prefer, delete it from the folder before deploying and keep it only on your computer.

Design tab: presets carpet, shawl, paper, gallery, or custom colours, Google Fonts by name, hero style, grid density, frames on or off.
Legal tab: your identity once, and the site generates Impressum, Privacy (DSGVO and CCPA), Terms with withdrawal form, Shipping and taxes, US buyers and Accessibility in EN and DE. A compliance checklist for EU and US is in that tab.

## Publish from your phone (recommended setup, 20 minutes once)

1. github.com: create a free account and a new repository, e.g. "seelischabstrakt" (public or private, both fine). Upload the contents of this folder (index.html, admin.html, site.json, works.json, README.md and the img folder). GitHub's web upload accepts drag and drop.
2. netlify.com: Add new site → Import an existing project → GitHub → pick the repository. Build command: none. Publish directory: "/" (root). Deploy. You get yoursite.netlify.app.
3. Netlify → Site configuration → Forms → Enable form detection (off by default on new sites), then redeploy once. After the first order the form "order" appears under Forms; add your email under Notifications so every order lands in your inbox.
4. github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate: Only select repositories → your repo → Repository permissions → Contents: Read and write. Copy the token.
5. Open yoursite.netlify.app/admin.html on your phone, tab Publish, enter GitHub user, repository, branch "main" and the token. It is stored only in that browser.

From now on: open admin.html on the phone, "Take photo" on a work (or "Choose photo"), fill title, size, price, tap "Publish to site". The photo and the data are written to GitHub, Netlify rebuilds, the shop is updated in about a minute. Bookmark admin.html on the home screen.

Optional: rename admin.html to something private like desk-7f3k.html and update the footer link in index.html, so nobody stumbles on the editor. It cannot change anything without your token, but tidier is tidier.

## Posting works from ChatGPT, from the phone in one tap, or from Claude (the shop API)

The folder contains a small serverless function, netlify/functions/works.js, reachable at yoursite/api/works. It writes works.json and photos straight into your GitHub repository, Netlify rebuilds, done. Nothing else on the internet can write to it without your secret key.

Setup once (needs the GitHub + Netlify setup above):

1. Netlify → Site configuration → Environment variables → add four:
   DESK_KEY = a long secret you invent (e.g. 24 random characters). This is your password for posting.
   GITHUB_TOKEN = the fine-grained token (Contents: read and write, this repo only).
   GITHUB_REPO = youruser/seelischabstrakt
   GITHUB_BRANCH = main
2. Trigger a redeploy (Deploys → Trigger deploy). Test: open yoursite/api/works in a browser; you should see your works as JSON.

Three ways in:

A. Phone, one tap: yoursite/add (add.html). Take photo, type title, size, price, choose print sizes, enter the desk key once (stored in that browser), Veröffentlichen. The photo is resized on the phone, uploaded through the API, live in a minute. Add it to your home screen.

B. ChatGPT custom GPT: in ChatGPT go to Explore GPTs → Create. Name it "seelischabstrakt Desk". Instructions (paste):

   You manage the artwork shop at seelischabstrakt. When the user describes a new work (title, size in cm, medium, price, optional caption), call upsertWork with action add. Always provide medium and caption in both English and German; write the caption yourself in the studio's voice: short, concrete, slightly raw, one or two sentences, no marketing words, no exclamation marks, no em dashes. Prices are EUR without symbol. Print tiers are 30 × 40 for 95, 50 × 70 for 190, 70 × 100 for 340; only add prints when the user says so. To mark a work sold, call upsertWork with its id and available false. Before updating, call listWorks to find the id. Confirm what you sent in one sentence. Photos cannot be uploaded from this chat; tell the user to add the photo at /add or in the Studio desk, or to pass a public image URL.

   Then Actions → Create new action → paste the contents of openapi.yaml (replace the server URL with your real domain) → Authentication: API Key, Auth Type: Custom, Header name: x-desk-key, Key: your DESK_KEY. Save. From now on you write in that GPT "Neues Werk: Kopf, rot, 30 mal 24, Ölkreide auf Papier, 380 Euro" and it is live a minute later, with a generated placeholder image until you add the photo at /add. If you give the GPT a public image link (e.g. from a shared iCloud or Google Photos album, or your Instagram post image URL), it attaches the photo too.

C. Claude (this chat or any Claude Code session): attach photos and measurements and ask Claude to post them; Claude calls the same API with the desk key, or commits to the repository directly.

Security notes: keep DESK_KEY out of Instagram bios and screenshots; rotate it in Netlify if it leaks. The API can only change works.json and add files to img/; it cannot touch the rest of the site. GET is public (same data as works.json).

## Council review (12.09.2026) and what was changed

Buyer on a phone: shipping was "quoted later", which kills conversion and is not compliant (the total must be visible before the pay button). Now: country selector, flat rates per region from site.json, live total, Revolut link carries the full amount, free pickup in Vienna. Buyer gets "Email me a copy" and "Print or save as PDF"; you still send the formal invoice within 48 hours.
Designer: small muted text on the red carpet was below WCAG contrast; lightened. Extra photos per work (detail, in room) show as thumbnails in the large view. Browser language is detected on first visit.
Tax adviser: Kleinunternehmer flag was set inconsistently in two places; now one switch (Shop tab) drives price footnote, Terms and Shipping page. Default is now Kleinunternehmer = true; change it the day you register for VAT.
Technician: og.jpg placeholder generated so shared links show a preview; replace with a real photo of a framed work on the carpet, 1200 × 630. Print stylesheet for order confirmations.
Operator after three months: an email signup ("New works by email", Netlify form "notify") so the shop collects interested people from day one; export the list from Netlify → Forms when you post a new piece. Edition counting for prints is still manual: when a size sells out, delete that print row in the Studio desk.

Still open, by choice: no card checkout (add a Stripe Payment Link per work when volume justifies the fees), no automatic invoice (use a free invoice template or your bank's tool; the order email has every field), no stock reservation (a static site cannot lock an original for a pending payment; if two people order the same original, the first payment wins and you refund the second).

## How buying works with Revolut

The buyer taps "Buy", fills name, email, address, country, ticks the terms, and taps "Place order". The site generates an order number (SA-YYMM-NNNN), sends the order to you (Netlify Forms or Formspree; falls back to the buyer's email app), and shows the buyer your Revolut link with the amount prefilled and the instruction to write the order number in the transfer message. The page promises invoice and order confirmation within 48 hours (adjustable in admin → Shop). You then send the invoice, ship, done.

Two notes. Revolut personal links do not guarantee that the amount parameter is honoured, so the buyer is told to type it if needed. And an order form plus manual transfer is a legitimate distance-selling setup, but you carry the invoicing and the 14-day withdrawal handling yourself; if volume grows, add a Stripe Payment Link per work (field "link") and buyers with a card go straight to checkout while Revolut stays as the fallback.

## Go live tonight without GitHub (free, 5 minutes)

1. Open https://app.netlify.com/drop in a browser.
2. Drag this whole folder (the one containing index.html) onto the page.
3. You get a live https address like https://random-name-123.netlify.app. Done.
4. Create the free Netlify account when it asks (needed to keep the site longer than 24 hours and to update it). In Site settings you can rename it to seelischabstrakt.netlify.app.
5. To update later: open your site in Netlify, go to Deploys, drag the folder again. Every drag replaces the site.

Alternative, also free: GitHub Pages (needs a GitHub account and a repo), or Cloudflare Pages (drag and drop like Netlify). Vercel works too.

## What netlify.toml does (already in the folder)

Security headers (CSP, HSTS, no-sniff, referrer policy), long caching for photos in img/, short caching for the JSON files so edits show within a minute, noindex for admin.html, friendly redirects (/shop, /prints, /impressum, /datenschutz, /agb, /desk) and a 404 page. robots.txt and sitemap.xml point search engines at the shop and away from the desk. Structured data (schema.org Product list) is generated from works.json so Google can show works with prices. When you move to your own domain, replace seelischabstrakt.netlify.app in index.html (canonical, og:url, hreflang), robots.txt and sitemap.xml.

## Own domain (optional, about 10 to 15 EUR per year)

Buy seelischabstrakt.at or .com at any registrar (e.g. Netlify itself, Namecheap, easyname). In Netlify: Domain management, Add domain, follow the DNS instructions. HTTPS is automatic.

## Add or change a product

Open works.json in any text editor (Notes on Mac, Notepad on Windows, or the free VS Code). One block per work:

    {
      "id": "w09",
      "title": "Neues Bild",
      "year": 2026,
      "medium": { "en": "Acrylic on paper, framed", "de": "Acryl auf Papier, gerahmt" },
      "w": 30, "h": 24,
      "img": "img/neues-bild.jpg",
      "size": "wide",
      "tilt": -0.5,
      "nomat": false,
      "original": { "price": 380, "available": true, "link": "" },
      "prints": [ { "size": "30 × 40", "price": 95, "link": "" } ]
    }

Field by field:

- id: any unique short text.
- title, year, medium: what the wall label shows. medium has an English and a German version.
- caption: optional one or two sentences in EN and DE, shown under the label, in the large view and in the search-engine description. Good place for ChatGPT-written texts.
- w, h: width and height in cm. This sets the shape of the frame.
- img: the photo file inside img/. If you leave img out, a generated placeholder painting is shown.
- size: "" normal, "wide" for landscape pieces that deserve more room, "small" for mini formats.
- tilt: tiny rotation in degrees so the wall looks hung by hand. 0 for none, between -1 and 1 is enough.
- nomat: true shows the photo without black frame and white mat (for canvases, boards, or photos that already show the carpet). false adds frame and mat.
- original.price: number in EUR, no symbol. original.available: true or false (false shows SOLD).
- original.link: your Stripe Payment Link or PayPal link for this original. Empty "" makes the button an email enquiry instead.
- prints: list of print sizes. Delete the whole list content ([ ]) if no prints exist. Each has its own link.

Commas matter: every block and every field is separated by a comma, except the last one. If the page shows nothing after an edit, a comma is missing. Paste the file into https://jsonlint.com to find the line.

## Photos

- Crop to the artwork itself if nomat is false (the site adds frame, mat, carpet).
- Keep the carpet in the photo if nomat is true.
- JPG, 1600 px on the long side is plenty. Smaller files load faster. squoosh.app compresses for free in the browser.
- Name files simply: kopf-rot.jpg, not IMG_4821.JPG.
- Optional: put a 1200 × 630 image called og.jpg in img/ and it becomes the preview image when the link is shared.

## Taking money

Stripe (recommended): stripe.com, free account, then Payment Links, New. Enter title, price, tick "collect shipping address", choose countries, save. Copy the link into the "link" field of that work. Stripe takes about 1.5 % plus 0.25 EUR per European card payment. Turn on Stripe Tax if you want VAT handled automatically.

PayPal: paypal.me/yourname/380 works as a link too, simpler but no shipping address collection.

Until a link is set, the button opens an email to the address in site.json (brand.email; set it in the Texts tab of admin.html).

## Legal minimum for an Austrian shop

Impressum (ECG § 5 and Mediengesetz § 25): name, address, email, and for a business the UID or a note that you are a Kleinunternehmer. Rücktrittsrecht 14 days for consumers on prints; originals made to order are exempt but say so. All of this is generated from the Legal tab in admin.html (Impressum, Datenschutz with DSGVO and CCPA, AGB with Widerrufsformular, Versand und Steuern, US buyers, Barrierefreiheit). The texts are templates: let the WKO or a lawyer confirm them before the first sale.

## Alltag ohne Assistenten (Stand 13.09.2026)

Alles Tägliche geht über den Studio desk auf seelischabstrakt.netlify.app/desk, direkt am iPad. Der Desk fragt nach einem Passwort: Netlify, Environment variables, DESK_PASSWORD setzen (der Name im Anmeldefenster ist egal), danach Trigger deploy. Ohne die Variable bleibt der Desk gesperrt. Einmalig im Tab Publish den GitHub-Token eintragen (Fine-grained, nur dieses Repo, Contents: Read and write). Der Token bleibt nur in deinem Browser.

- Foto zu einem Werk: Tab Works, "Choose photo", im Zuschneide-Fenster den Rahmen auf das Bild ziehen (Häkchen hält das Seitenverhältnis B × H), "Crop", dann oben "Publish to site". Eine Minute später live.
- Verkauft: Tab Works, Häkchen "available" weg, Publish.
- Preis, Titel, Technik, Caption: Tab Works, Feld ändern, Publish.
- Neues Werk: Tab Works, "Add work", Felder füllen, Foto wählen, Publish. Oder seelischabstrakt.netlify.app/add am Handy, wenn die vier Environment variables in Netlify gesetzt sind (DESK_KEY, GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH).
- Adresse, E-Mail, Telefon, UID: Tab Legal, Publish. Daraus entstehen Impressum, AGB, Datenschutz in beiden Sprachen.
- Revolut Business statt privat: Tab Shop and taxes, Revolut-Link tauschen, Publish. Der Anbietername für die Rechtstexte steht im Tab Legal unter payment.
- Seite auf "Coming soon" stellen oder die Texte für leere Bereiche ändern: Tab Design, Abschnitt Coming soon and empty sections, Publish.
- Umsatzsteuerpflicht: Tab Shop and taxes, Kleinunternehmer aus. Preise, AGB und Versandseite stellen sich um.
- Bestellungen: Netlify, Forms, "order". E-Mail-Benachrichtigung unter Form notifications eintragen. Rechnung innerhalb von 48 Stunden selbst schicken, danach versenden.
- Interessenten für neue Werke: Netlify, Forms, "notify", Liste exportieren.

Desk meldet "locked" oder 503: DESK_PASSWORD fehlt in Netlify. Passwort ändern: Variable ändern, Trigger deploy, in Safari die gespeicherten Passwörter für die Seite löschen.

Wenn etwas nicht geht: Seite zeigt keine Werke, dann ist meist works.json oder site.json beschädigt; Datei in GitHub öffnen und in jsonlint.com prüfen. Desk meldet "Publish failed 401 oder 403": Token abgelaufen oder ohne Contents write, neuen Token erzeugen. Desk meldet 404: Repository-Name im Tab Publish prüfen. /add meldet 401: DESK_KEY in Netlify stimmt nicht mit dem eingegebenen Schlüssel überein.

Design und Wortwahl anpassen: Studio desk, Tab Design, Abschnitt Advanced (Teile der Seite ausblenden, eigenes CSS, eigenes Hintergrundmuster, Logo statt Schriftzug) und Tab Texts, Abschnitt Interface wording (jeden Knopf und Menüpunkt umbenennen, Fußzeile). Dieselben Dinge kann der Custom GPT über getSite und updateSite ändern, Anleitung in MAINTENANCE.md.

Für Textarbeit ohne Zugang zum Repo: ChatGPT oder Claude mit MAINTENANCE.md füttern, das Werk beschreiben, den JSON-Block in das Feld "Aus ChatGPT einfügen" auf /add kopieren.
