# Sofia

A personal app built from Sofia's nutrition plan (written by her biologist
nutritionist: hypocaloric about 1400 kcal, about 1 g protein per kg,
gluten free, anti-inflammatory) for life with coeliac disease and lupus with
kidney involvement. Italian first, English switch.

Live: Netlify project `sofia-piano` (https://sofia-piano.netlify.app), behind
an access code. Installable on the phone (Add to Home Screen), works offline.

## What it does

| Screen | What Sofia gets |
|---|---|
| Oggi | A summary at the top: calories eaten against 1400 kcal (ring) and five rings for carbohydrates, protein, vegetables, fruit and fat against today's plan, each with value, target and status in words. One "Registra cibo" button opens a three-step log: the meal, the food (as planned in one tap, the plan's foods, vegetables and fruit, foods eaten lately, any food from ANSES CIQUAL 2020, a brand or package from Open Food Facts, or the label), then the amount in grams or in household measures (half a 200 g can, a small egg, a glass of milk) turned into grams with the source of each measure. Saving says so and the page updates at once (the new entry lights up). "Cosa hai mangiato oggi" lists every meal with foods and grams, correctable, with the last 7 days. Suggestions (next meal, vegetables or fruit still missing) open their screen. Then the day's plan, water (2-3 L), coffee (max 3), walking (5 x 30 min), a daily check-in |
| Settimana | "Mangiato e quanto resta": one bar per row (calories, carbohydrates, protein, fat, vegetables, fruit) with what she ate this week and what is left, against the plan's targets for the days that count (past days with nothing logged are left out, said on screen); each day shows its calories against 1400. "Togli ingredienti": remove any plan food, vegetable or fruit (search or lists); the meals from today that hold one are listed and one tap redoes the days from today without them (past days and meals already logged stay, every plan limit is checked again, Undo). A full week that respects every limit in the plan, shuffle, swap days, swap lunch and dinner, shopping list with gluten-free label notes |
| Cibo | Idee (first tab): add the ingredients she feels like eating; the plan's recipes and hers that use them come up with calories per portion, the council's verdict, what else they need and what to leave out; recipes built around a removed ingredient are hidden and counted. Componi: build a meal from the plan's choices with live calories, then log it. I miei cibi: add any food, the food brain says si / medio / no and how much replaces a plan portion; "Non mangio" (the same list as Togli ingredienti) with vegetables and fruit too. Ricette: 44 curated recipes plus her own, with filters and shuffle. Il piano: the nutritionist's text in Italian and English. Daily web recipes checked by the council |
| Salute | Weight and BMI with trend and 95% interval, 38 lab markers (manual or read from a PDF report), eGFR CKD-EPI 2021, correlations from 14 days, encrypted backup |
| Corpo 5D | 3D body and brain coloured by her own data, calm motion, stored on the phone so it works offline (without 3D the same screen works as text); tap any part to see what it is; a time slider through her results; pick a food (salmon, for example) and a short journey shows in plain words what happens to it in the body, step by step; what it does for an organ is shown only where an EU-authorised health claim says so |
| Il consiglio | The rule agents, their seniority and vetoes, this week's verdict, the evidence base, open questions for the nutritionist and the doctors |

Medical data never leaves the phone. The only lookup that leaves it is the
name of a food Sofia searches online. See [docs/PRIVACY.md](docs/PRIVACY.md).

## The food brain

`app/js/engine/cervello.js` judges a food with the same council seats as the
recipes (gluten, lupus, plan, kidneys, data; see [docs/COUNCIL.md](docs/COUNCIL.md)).
Values come from the bundled ANSES CIQUAL 2020 table (3,147 foods, works
offline) or, for packaged products, from Open Food Facts through the app's
own function `/api/alimento`. No API key is needed. Missing values are shown
as "Informazione mancante", never guessed.

## Runs by itself

- The current week is created on every start, the next one from Saturday.
- Every change is saved at once; an unfinished PDF import resumes where it stopped.
- The daily recipe run (`netlify/functions/ricette-del-giorno.mjs`, 04:17 UTC) reads each post once, saves its progress, and is caught up by `/api/ricette` if a run was missed (lock with timeout, so two visitors never start two runs). Afterwards it deletes food lookups older than 7 days.
- The service worker updates the app when a new version is published.
- The build runs all tests first: a failing test stops the deploy and the version online stays online.

## Folder

```
app/                 the published app (static, no build step needed)
  js/data/           plan, foods, recipes, lab markers, evidence (generated)
  js/engine/         planner, council, statistics, health, lab parser, food impacts
  js/views/          screens
  js/three/          the 3D body
  vendor/            three.js (MIT), pdf.js (Apache 2.0)
netlify/functions/   daily recipe run, /api/ricette, /api/alimento (food lookup)
lib/                 recipe pipeline, Open Food Facts client, gluten check copied from anker (identical, tested)
tools/               build, evidence generator, CIQUAL extractor, hashed gate, plan text encryption
docs/                council, sources, privacy, resume file, research files
test/                node --test
```

## Develop

```sh
cd sofia
npm install          # only @netlify/blobs, for the functions
npm test             # limits, council, recipes, statistics, parser, plan audit, integrity
node tools/genera-evidenze.mjs   # rebuild evidence data from docs/fonti
cd app && python3 -m http.server 8765   # open http://localhost:8765
```

## Deploy

The Netlify project builds from this folder (`sofia/netlify.toml`, base
directory `sofia`). The access code comes from `SOFIA_ACCESS_KEY` (falls back
to `SITE_ACCESS_KEY`); only a hash of it reaches the page. Without a code the
gate stays open. The plan text (`app/data/piano-testo.cifrato.json`) is
encrypted with the same code: a new code means encrypting it again with
`tools/cifra-piano.mjs`. The steps used for uploads from the workspace are in
[docs/STATO.md](docs/STATO.md). The shop site at the repository root returns
404 for `/sofia/*`.
