# Stato del lavoro (resume file)

Any session that picks up this project reads this file first and continues
from the first unchecked item without asking. Keep it short and current.

Branch: `sofia-app-clean` in `apschranz-star/seelischabstrakt`. The old branch
`sofia-app` is to be deleted (privacy): ALX deletes it on GitHub. Rewriting it
was refused by the permission check and is not retried.
Netlify project: `sofia-piano`, site id `3902075f-8500-47f3-8807-d8c902846694`
(team `a-p-schranz`).

## Deploy (from this workspace)

The access code and the plain text of the plan are never committed. Both live
outside the repository: `/home/claude/council/.sofia_code` and
`/home/claude/council/piano-testo.json`.

1. `node --test test/*.test.mjs` (63 tests on 2026-11-07).
2. Only if the plan text changed or the code was rotated:
   `SOFIA_ACCESS_KEY="$(cat /home/claude/council/.sofia_code)" node tools/cifra-piano.mjs /home/claude/council/piano-testo.json`
   writes `app/data/piano-testo.cifrato.json`. `--decifra` prints the plain JSON back.
3. Arm the gate: `SOFIA_ACCESS_KEY="$(cat /home/claude/council/.sofia_code)" node tools/gate-sofia.mjs`
   (only a hash of the code goes into `app/zugang.js`).
4. `app/zugang.js` and `app/zugang.css` are git-ignored and the upload leaves ignored files out:
   back up `.gitignore`, remove those two lines, run the command returned by the Netlify MCP
   `deploy-site` operation from inside `sofia/`, restore `.gitignore`, delete the two generated files.
5. Check the deploy (`get-deploy-for-site`): state ready, 3 functions, schedule `17 4 * * *`.

The code was rotated on 2026-11-07 together with the switch to the hashed gate (the earlier
gate wrote the code itself into the page). Sofia enters the new code once; the plan text is
encrypted with it, so a new code always means step 2 again.

## Done
- [x] Plan transcribed: `app/js/data/piano.js`, foods: `app/js/data/alimenti.js`
- [x] Weekly planner with every limit: `app/js/engine/planner.js`
- [x] Council rule agents: `app/js/engine/consiglio.js`
- [x] 44 curated recipes in plan doses: `app/js/data/ricette.js`
- [x] Daily web recipe pipeline + Netlify functions: `lib/`, `netlify/functions/`
- [x] Health engine, stats, lab PDF parser: `app/js/engine/{salute,stats,labparse}.js`, `app/js/data/esami.js`
- [x] 3D body: `app/js/three/corpo3d.js`
- [x] Views, router, service worker, index.html, manifest, icons
- [x] Evidence integrated (`tools/genera-evidenze.mjs` -> `evidenze.js`, `esami-dati.js`)
- [x] Docs: README, COUNCIL, FONTI, PRIVACY
- [x] First deploy 2026-11-06, redeploy 2026-11-07 02:31 UTC (deploy 6aee8d51a012db9473ca4a83)
- [x] QA audit tasks 1 to 7 (plan amounts, privacy, health statements, recipes, planner, security, wording) fixed; S3 waits for the auditor's re-check
- [x] Overhaul from Sofia's first demo (2026-11-07):
  - food brain `app/js/engine/cervello.js`: any food judged si / medio / no by the council seats, with
    the portion that replaces a plan portion; data from the bundled CIQUAL 2020 table (offline,
    `app/js/data/ciqual.js`) and Open Food Facts through `/api/alimento` (7-day cache, purged daily)
  - "I miei cibi": add foods; "Non mangio" for single foods and whole groups (cheese); the planner
    rebalances and says when a limit can no longer be met; legumes cannot be excluded (the plan requires them)
  - meal builder (Componi) with live calories; daily food log with calories eaten and left,
    7-day chart with table view
  - recipe filters (search, meal, favourites, mine, time) and her own recipes, judged by the council
  - the nutritionist's text in Italian and English (encrypted, opens with the access code)
  - Corpo 5D: tap any part for what it is, calmer motion, food journey with captions
  - hashed gate (`tools/gate-sofia.mjs`), encryption format 2 (header bound), adjustable unit weights
  - scraper: post and recipe links only from the feed's own site, unparsable dates stored as null

- [x] Body screen independent of the network (2026-11-07): three.js stored at install in a cache that
  survives updates; without 3D the screen says why (401, offline, no WebGL) and runs as text
- [x] Food log with uncooked weights per ingredient (2026-11-07): raw or dry values first (CIQUAL 2020,
  plan composition, package, label), grams x kcal per 100 g and source on every line, logged meals
  correctable per ingredient

## Open
- [x] Overhaul deployed 2026-11-07 03:38 UTC (deploy 6aee9d1c6fbba832e23b5a3e)
- [ ] Deploy the 3D hardening and the raw-ingredient log, verify it online
- [ ] Independent QA review of the overhaul and re-check of S3 (read-only), fix what it finds, redeploy
- [ ] Visitor access (BLOCKER, seen in the logs 2026-11-07 04:21 UTC: Sofia's iPhone gets 401 on every
      request, runs the old cached version and cannot load the 3D library): team login is on for all deploys.
      Changing it was refused by the permission check; ALX switches it in Netlify:
      Project configuration > General > Visitor access > Project visibility (password protection
      if the plan offers it; legacy plans: Access & security > Visitor access > Password Protection).
- [ ] ALX deletes the old GitHub branch `sofia-app` and asks GitHub Support to purge its commits from caches
- [ ] Deploys from before 2026-11-07 hold data removed since: keep them behind login or delete them
- [ ] Final report to ALX (visitor access, new access code, branch, old deploys)
