# Handover prompt for ChatGPT

Paste everything below the line into a new ChatGPT conversation, together with
access to the repository `apschranz-star/seelischabstrakt`, branch
`claude/seelischabstrakt-shop-setup-3l121c`.

---

> The message Alexander pastes into a fresh chat to hand this over lives in
> `anker/UEBERGABE.md`. It points here. This file is the reference; that one is
> the first message and the first task.

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
  inhalt-de.js      German content    } each does
  inhalt-en.js      English content   } window.INHALT = window.INHALT || {}
  inhalt-it.js      Italian content   } window.INHALT.<code> = { ... }
  inhalt-fr.js      French content    }
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
const OBERFLAECHE_FERTIG = ["en", "de"]           // which ones are offered
let L                     // current language code
let I                     // = INHALT[L], the content for that language
T("Heute")                // one interface string
TV("Letzte {n} Tage", { n: 30 })        // with placeholders
TP("{n} Tag", "{n} Tage", n)            // singular and plural
```

A language is only offered when **both** its content file and its interface
strings exist. All five content files exist. The interface exists in English
and in German, so `OBERFLAECHE_FERTIG` contains `"en"` and `"de"`, and the app
runs entirely in whichever of the two is chosen. Italian, French and Spanish
have the content but no `ui` table yet, so they are not offered. German
buttons over English text would be worse than one language; that is what this
gate is for.

**German is the key language.** The German sentence in `app.js` *is* the
lookup key, and `inhalt-en.js` carries the translation under `ui`. `T()`
returns the key when nothing is found, so a missing translation degrades to
German rather than to an empty screen. The risk is that editing a German
sentence in `app.js` silently breaks the lookup; `werkzeug/pruefe-texte.js`
exists to catch exactly that, and it also reports dead entries and mismatched
placeholders.

**What is stored is never what is displayed.** The ticked signs and the role
of a place are written to the diary as the *German* key and translated only on
the way to the screen (`zeichenListe()`, `zeichenText()`, `ROLLEN`). The other
way round, switching language would orphan every tick a real user has already
made, and the doctor's summary would count the same sign twice. Keep it that
way.

**The static shell.** The tab bar, the skip link and the meta description live
in `index.html` so the page shows something before the first script runs.
`huelleUebersetzen()` in `app.js` rewrites them whenever the language is set.
Page titles in `SEITEN` are *functions*, not strings, for the same reason: that
table is built before the language is known.

## The open task

**Write the `ui` tables for Italian, French and Spanish, and add each to
`OBERFLAECHE_FERTIG`.** The content for all three is already translated and
passes the structure checker. What is missing is the interface: the same 290
keys that `inhalt-en.js` already answers.

```bash
cd anker
node werkzeug/pruefe-texte.js        # lists what each offered language is missing
```

To see the full list of keys, copy the `ui` block out of `inhalt-en.js`: the
left-hand side is the German key, the right-hand side is what you replace.

### Step by step

1. Copy the `ui` block from `inhalt-en.js` into `inhalt-it.js` as the first
   key of `window.INHALT.it`, keeping every German key exactly as it is.
2. Translate only the right-hand side. Keep every `{placeholder}` that the key
   carries; the order may change, the set may not. `pruefe-texte.js` checks it.
3. Translate in the same register as the rest: short, plain, no exclamation
   marks, no dashes.
4. Add `"it"` to `OBERFLAECHE_FERTIG` in `app.js`. The language switcher on the
   **Mehr** page grows by itself; it is already written.
5. Run the whole check list below. The German page dump must still be
   identical, because German is the key language and nothing you did touched
   it.
6. Repeat for `fr` and `es`.

Do not add a language to `OBERFLAECHE_FERTIG` before its table is complete.
Half a translation is worse than none: German buttons over Italian text.

### After that, the remaining smaller items

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
for f in app.js sw.js inhalt-*.js; do node --check "$f" || echo "BROKEN $f"; done

# 2. Does every language still have the same structure as the German original?
#    This catches a renamed key, a dropped section, a changed id.
for l in en it fr es; do node werkzeug/pruefe-sprache.js inhalt-$l.js $l; done

# 3. Does every interface string exist in every offered language?
node werkzeug/pruefe-texte.js

# 4. Did a German sentence change? No browser needed, so run this one always.
node werkzeug/pruefe-deutsch.js

# 5. Did the rendered text change when it should not have?
#    Needs Playwright and a Chromium. If you cannot run it, say so plainly
#    rather than claiming the check passed. Step 4 covers most of it.
node werkzeug/textabzug.js --vergleich /tmp/vorher.json /tmp/nachher.json

# 6. No inline styles anywhere, they are silently dropped by the CSP
grep -c 'style="' app.js index.html inhalt-*.js    # must all be 0
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
