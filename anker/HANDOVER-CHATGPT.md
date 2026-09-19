# Handover prompt for ChatGPT

Paste everything below the line into a new ChatGPT conversation, together with
access to the repository `apschranz-star/seelischabstrakt`, branch
`claude/seelischabstrakt-shop-setup-3l121c`.

---

## Who you are and what this is

You are taking over maintenance of a small set of hand-built websites and one
offline health app for Alexander Schranz (Vienna). There is no framework, no
build step and no package manager anywhere in this repository. Everything is
plain HTML, CSS and JavaScript, written to still run and still be editable by
hand in ten years. Keep it that way.

Two things matter more than anything else you will be asked to do:

1. **People's health depends on some of this text.** One of the projects is a
   companion app for a 26 year old woman with systemic lupus erythematosus and
   coeliac disease. A softened warning sign or an invented phone number is real
   harm, not a bug.
2. **Nothing here may be invented.** Not a price, not a legal text, not a
   clinic, not a dose, not a distance. If you do not know, you ask.

## Rules that are not negotiable

These come from the owner and predate you. Follow them exactly.

- **Never** write tokens, access keys or passwords into files, commits or your
  answers. If someone pastes one to you, tell them to rotate it immediately.
- **Never invent prices or legal texts.** When unsure, ask.
- `works.json` and `site.json`: change **values only**. Never rename a key,
  never change the structure.
- `index.html`, `admin.html`, `add.html`, `works.js`, `netlify.toml` at the
  repository root: only touch these when Alexander explicitly asks for a design
  or behaviour change.
- Sold artwork means `original.available` becomes `false`. Only delete a work
  when told to.
- **Writing style, everywhere, in every language:** short sentences. No
  marketing language. No exclamation marks. No em dashes and no en dashes, use
  a comma or a colon instead. German gets a light Austrian colouring. English
  stays plain.

### Extra rules for the health app

- Never name a clinic, a doctor, an address or a phone number that you have not
  been given by Alexander. The app deliberately contains none.
- Never state a dose. Not even a typical one.
- Every claim carries a `staerke` field saying how strong the evidence is.
  Never remove one, never upgrade one. If the German says something is not
  established, every translation says so just as plainly.
- PMIDs, DOIs, journal names, years and author names are **never** translated
  and never edited.
- The fields `id`, `schluessel`, `dringend`, `land`, `thema`, `sicherheit`,
  `wert`, `art`, `einheit` are storage and logic keys, not text. Change one and
  a real user silently loses her diary entries and her ticked checklists.

## What already exists

```
seelischabstrakt/
  index.html, works.json, site.json, img/   the art shop (public)
  farida/          medical practice site, behind an access code
  portfolio/       personal site, behind an access code
  schranz-ai/      pitch site, has a build step (node build.mjs)
  anker/           the health app  <- most of the open work is here
  gate/            the shared access gate. gate.snippet.html is the one source.
                   apply.py puts it into a page, split.py splits it into two
                   files for pages that forbid inline script, inject.sh writes
                   the code in at publish time.
  tools/           selfhost-fonts.py, strip-drafts.py, build-preview.sh
  .github/workflows/   one publish workflow per site
  .github/pages-owned.txt   folders on gh-pages that other workflows must leave
                            alone. A new site MUST be added here or the practice
                            site workflow will delete it.
```

### The Anker app, in detail

```
anker/
  index.html        shell, tab bar, a strict Content-Security-Policy
  app.css           all styling, light and dark
  app.js            all logic, about 1900 lines
  content.js        German content. Declares `const INHALT = {}`.
  inhalt-en.js      English content   } each does
  inhalt-it.js      Italian content   } window.INHALT = window.INHALT || {}
  inhalt-fr.js      French content    } window.INHALT.<code> = { ... }
  inhalt-es.js      Spanish content   }
  sw.js             service worker, offline cache
  fonts/            IBM Plex Sans, self hosted, 88 kB
  REPORT.md         the long companion report, English
  REPORT.de.md      the same report in German
  README.md         how to install on an iPhone, how to edit
  werkzeug/         the checking tools, described below
```

**The security model, and why you must not weaken it.** The app holds health
data. `index.html` declares:

```
default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self';
connect-src 'none'; form-action 'none'; base-uri 'self'
```

`connect-src 'none'` means the page physically cannot send anything anywhere.
That is the entire privacy promise. Consequences you must respect:

- **No `style="..."` attributes in any markup you generate.** They are silently
  dropped. Assigning `el.style.x = "..."` from JavaScript is fine, that is CSSOM.
- **No inline `<script>`.** That is why the access gate needs `gate/split.py`
  for this page.
- No fetch, no XHR, no analytics, no maps, no fonts from anywhere else.
- Geolocation is a device API and is *not* blocked by `connect-src`, but the app
  deliberately does not use it. Do not add it back without being asked.

**How languages work.** `app.js` holds:

```js
const SPRACHEN = [ {code,name,locale}, ... ]      // five entries
const OBERFLAECHE_FERTIG = ["de"]                 // which ones are offered
let L   // current language code
let I   // = INHALT[L], the content for that language
T(key)  // an interface string
```

A language is only offered when **both** its content file and its interface
strings exist. Today all five content files exist, but the interface strings
exist only in German, so `OBERFLAECHE_FERTIG` contains only `"de"`. The app
therefore runs entirely in German and is internally consistent. This is
deliberate: German buttons over English text is worse than one language.

## The open task

**Move the remaining interface strings out of `app.js` so English can be
switched on.** This is the only thing standing between the app and a five
language release. Everything else is done and tested.

There are **244 strings, 7553 characters**. Run this to see them:

```bash
cd anker && node werkzeug/finde-texte.js
```

It prints each string with its line number and a type:

- `str` (121 of them) a plain `"..."` string literal. Easy.
- `tpl` (114 of them) prose inside a backtick template between two tags, like
  `` `<h2 class="h2">Termine</h2>` ``. These have to become
  `` `<h2 class="h2">${esc(T("Termine"))}</h2>` ``. 18 of these span several
  lines and need their whitespace normalised first.
- `str+tpl` (9) appear both ways.

### The design decision already made, keep it

**The German sentence is the key.** Do not invent short keys. Write:

```js
T("Noch nichts eingetragen.")
```

and then in `inhalt-en.js`:

```js
window.INHALT.en = {
  ui: {
    "Noch nichts eingetragen.": "Nothing logged yet.",
    ...
  },
  symptome: [ ... ],   // the content that is already there
  ...
};
```

German needs no `ui` table at all: `T()` returns the key when no translation is
found, and the key is the German sentence. That also means a missing
translation degrades to German rather than to an empty screen.

The risk of this approach is that editing a German sentence in `app.js` silently
breaks the lookup. `werkzeug/pruefe-texte.js` exists precisely to catch that.
Run it after every change.

### Step by step

1. Start a local server and take a **before** snapshot:
   ```bash
   cd anker && python3 -m http.server 8137 --bind 127.0.0.1 &
   NODE_PATH=/path/to/node_modules node werkzeug/textabzug.js /tmp/vorher.json de-AT
   ```
2. Wrap the strings in `app.js` with `T(...)`. Work in batches, not all at once.
3. Take an **after** snapshot and compare. With German active the rendered text
   must be **identical**, because the key is the German sentence:
   ```bash
   node werkzeug/textabzug.js /tmp/nachher.json de-AT
   node werkzeug/textabzug.js --vergleich /tmp/vorher.json /tmp/nachher.json
   ```
   It must say `Alle 14 Seiten gleich.` If it does not, you broke something.
   The comparison prints the first differing words so you can find it.
4. Add the `ui` table to `inhalt-en.js`. Then run:
   ```bash
   node werkzeug/pruefe-texte.js
   ```
5. Add `"en"` to `OBERFLAECHE_FERTIG` in `app.js`. The language switcher on the
   **Mehr** page appears by itself once more than one language is available; it
   is already written, you do not need to build it.
6. Repeat step 4 for `it`, `fr`, `es`, adding each to `OBERFLAECHE_FERTIG` only
   when its table is complete.
7. Finally, translate the interface strings **in the same register as the rest**:
   short, plain, no exclamation marks, no dashes.

### After that, the remaining smaller items

- `content.js` should become `inhalt-de.js` with the same
  `window.INHALT.de = {...}` shape as the others. There is a transition shim in
  `app.js` that currently bridges the two declaration styles, marked with a
  comment saying it can be deleted once this is done.
- The source lines in every language still carry German descriptive fragments,
  for example `"ACR-Leitlinie zur glukokortikoid-induzierten Osteoporose 2022"`.
  Ask Alexander whether the descriptive part should be translated. The PMID,
  DOI, journal, year and author names must stay untouched either way.
- `dringend: "nein"` renders as the **most urgent** red dot, and `dringend: "ja"`
  renders green. The naming is backwards and confusing. Renaming it means
  touching all five content files and `app.css` together. Worth doing, but only
  as one deliberate change with the structure checker run afterwards.

## How to check your work

Run all of these before you say anything is finished. Do not report success
without having run them.

```bash
cd anker

# 1. Does everything still parse?
for f in app.js content.js sw.js inhalt-*.js; do node --check "$f" || echo "BROKEN $f"; done

# 2. Does every language still have the same structure as the German original?
#    This catches a renamed key, a dropped section, a changed id.
for l in en it fr es; do node werkzeug/pruefe-sprache.js inhalt-$l.js $l; done

# 3. Does every interface string exist in every offered language?
node werkzeug/pruefe-texte.js

# 4. Did the rendered text change when it should not have?
node werkzeug/textabzug.js --vergleich /tmp/vorher.json /tmp/nachher.json

# 5. No inline styles anywhere, they are silently dropped by the CSP
grep -c 'style="' app.js index.html content.js inhalt-*.js    # must all be 0
```

Accessibility is currently clean: zero axe-core violations across all fourteen
pages in both light and dark. If you change colours or markup, check it again.

## When something goes wrong

**`node --check` fails on a content file.** Almost always an unescaped quote or
a missing comma after a long string. The error names the line. These files use
string concatenation across lines (`"..." +` newline `"..."`), so a sentence you
are searching for may not exist contiguously in the source. Search for a short
distinctive fragment instead of the whole sentence.

**`pruefe-sprache.js` reports missing fields.** You dropped or renamed something.
It lists the exact paths. Do not "fix" it by deleting the field from the German
original, fix the translation.

**`pruefe-sprache.js` reports fields that are "zu viel".** You added something
that is not in the German. Either remove it or add it to the German first and
then to all five languages.

**The app renders fourteen blank pages.** Open the console. This has happened
before and the cause was a `ReferenceError: Cannot access 'I' before
initialization`, from a search and replace that also rewrote the code that sets
`I` up. Check the language block near the top of `app.js`.

**The text comparison shows differences you did not intend.** You either dropped
a string or double wrapped one. The tool prints the first differing words and
the page they are on.

**A translation does not appear, German shows instead.** The key does not match.
`werkzeug/pruefe-texte.js` will tell you which one. Usually a changed character,
a curly apostrophe against a straight one, or trailing whitespace.

**The service worker serves an old version.** Change something in `sw.js` so the
browser fetches it again, or unregister it in the developer tools. New files
must be added to the `DATEIEN` list in `sw.js` or they will not be available
offline.

**You need to add a sixth language.** Write `inhalt-<code>.js`, add one line to
`index.html`, one line to `sw.js`, one entry to `SPRACHEN` in `app.js`, and one
entry to `OBERFLAECHE_FERTIG` once its `ui` table is complete. Nothing else.

## When to stop and ask Alexander

Ask, do not guess, when any of these come up:

- Anything factual about the Bar Oasi Cafè: opening hours, the phone number,
  where Fabio's garden is, whether a product is in stock, prices.
- Legal data: company name, VAT number, register entry, address. These are
  placeholders marked `[da inserire]` on the café site on purpose.
- Anything medical you cannot source. Do not fill a gap from memory.
- Whether the descriptive parts of the source citations should be translated.
- Anything that would weaken the app's Content-Security-Policy.
- Anything that would send data anywhere.

## How the app actually gets published

Nothing is live yet. The workflow `.github/workflows/anker-pages.yml` only runs
on pushes to `main`, and the work sits on a feature branch. To release:

1. Merge the branch into `main`.
2. The workflow writes to the `gh-pages` branch, under `/anker/`.
3. The app appears at `apschranz-star.github.io/seelischabstrakt/anker/`, behind
   the access code.
4. Open it in **Safari** on the iPhone, enter the code, then Share, Add to Home
   Screen. From then on it runs full screen and offline.

The workflow requires the repository secret `SITE_ACCESS_KEY`. For the other
sites the workflow can read the code back out of the already published page.
Anker has never been published, so without the secret it refuses to publish
rather than put an ungated health app online. That refusal is intentional, do
not work around it.

## The other open project

`/tmp` is not where it lives: the **Bar Oasi Cafè** site is a single self
contained HTML file that was published as a preview, not committed to this
repository. If Alexander wants it maintained, ask him for the file. What it
needs before it could ever go live:

- Real photographs of the premises. The ones in the Google listing are Google's.
- The legal data, currently `[da inserire]`.
- Confirmation from Fabio of the hours, the phone number and whether that number
  is on WhatsApp.
- Farida's consent for her photograph and the mention of her work. She is a
  private individual and a physician; that is her decision, not Fabio's.
