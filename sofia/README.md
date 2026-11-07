# Sofia

A personal app built from Sofia's nutrition plan (Dott.ssa Isabella Giunta,
biologist nutritionist: hypocaloric about 1400 kcal, about 1 g protein per kg,
gluten free, anti-inflammatory) for life with coeliac disease and lupus with
kidney involvement. Italian first, English switch.

Live: Netlify project `sofia-piano` (https://sofia-piano.netlify.app), behind
an access code. Installable on the phone (Add to Home Screen), works offline.

## What it does

| Screen | What Sofia gets |
|---|---|
| Oggi | Today's meals with amounts and a recipe, tick what she ate, water (2-3 L), coffee (max 3), walking (5 x 30 min), a daily check-in (energy, mood, sleep, joints, gut, skin, brain fog, gluten exposure) |
| Settimana | A full week that respects every limit in the plan, shuffle the week or one meal, swap days, swap lunch and dinner, shopping list with gluten-free label notes |
| Cibo | Swaps with the plan's equivalent amounts and real per-portion numbers (same or better), 44 curated recipes with shuffle, daily web recipes checked by the council, the plan's rules and the guideline points |
| Salute | Weight and BMI with trend and 95% interval, 38 lab markers (manual or read from a PDF report), eGFR CKD-EPI 2021, correlations from 14 days, encrypted backup |
| Corpo 5D | Animated 3D body and brain coloured by her own data, a time slider through her results, and a food layer that shows which systems a food reaches through EU-authorised health claims |
| Il consiglio | The rule agents, their seniority and vetoes, this week's verdict, the evidence base, open questions for the nutritionist and the doctors |

Medical data never leaves the phone. See [docs/PRIVACY.md](docs/PRIVACY.md).

## Runs by itself

- The current week is created on every start, the next one from Saturday.
- Every change is saved at once; an unfinished PDF import resumes where it stopped.
- The daily recipe run (`netlify/functions/ricette-del-giorno.mjs`, 04:17 UTC) reads each post once, saves its progress, and is caught up by `/api/ricette` if a run was missed (lock with timeout, so two visitors never start two runs).
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
netlify/functions/   daily recipe run and /api/ricette
lib/                 recipe pipeline, gluten check copied from anker (identical, tested)
tools/               build, evidence generator, gate (copied from /gate, identical, tested)
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
directory `sofia`). Set `SOFIA_ACCESS_KEY` in the project's environment
variables for the access code (falls back to `SITE_ACCESS_KEY`). Without a code
the gate stays open. The shop site at the repository root returns 404 for
`/sofia/*`.
