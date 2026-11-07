# Stato del lavoro (resume file)

Any session that picks up this project reads this file first and continues
from the first unchecked item without asking. Keep it short and current.

Branch: `sofia-app-clean` in `apschranz-star/seelischabstrakt`. The old branch
`sofia-app` is to be deleted (privacy): ALX deletes it on GitHub. Rewriting it
was refused by the permission check and is not retried.
Netlify project: `sofia-piano`, site id `3902075f-8500-47f3-8807-d8c902846694`
(team `a-p-schranz`).

**Access code rule (ALX, 2026-11-07): the code is never changed unless ALX asks.**
No rotation, no arming with another code, no tool or agent that sets one. Every
deploy arms the gate from the live hash (step 3). The current code is only in
`/home/claude/council/.sofia_code` (local, mode 600): never printed, never
committed, used through environment variables only.

**Trial week: Saturday 2026-11-07 to Friday 2026-11-13.** Sofia uses the app;
nothing on the live app changes during the trial unless ALX asks (daily checks
are read-only and report). Review on Saturday 2026-11-14.

## Deploy (from this workspace)

The access code and the plain text of the plan are never committed. Both live
outside the repository: `/home/claude/council/.sofia_code` and
`/home/claude/council/piano-testo.json`.

1. `node --test test/*.test.mjs` (77 tests on 2026-11-07).
2. Only if the plan text changed or the code was rotated:
   `SOFIA_ACCESS_KEY="$(cat /home/claude/council/.sofia_code)" node tools/cifra-piano.mjs /home/claude/council/piano-testo.json`
   writes `app/data/piano-testo.cifrato.json`. `--decifra` prints the plain JSON back.
3. Arm the gate with the hash that is online, so a redeploy never changes Sofia's code:
   `SOFIA_ACCESS_HASH="$(curl -sS https://sofia-piano.netlify.app/zugang.js | grep -o '[0-9a-f]\{64\}' | head -1)" node tools/gate-sofia.mjs`.
   Only when the code is rotated on purpose: `SOFIA_ACCESS_KEY=... node tools/gate-sofia.mjs`.
   The live gate hash is `1c061b15...` (2026-11-07). `/home/claude/council/.sofia_code` holds the matching
   code (checked 2026-11-07: sha256 of "sofia-gate|" + code equals the live hash).
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
- [x] 3D hardening and raw-ingredient log deployed 2026-11-07 14:16 UTC (deploy 6aef3285692c3ff0f99df001)
- [x] QA round 3 fixes (4 MAJOR: raw sprouts in CIQUAL's words, undo before a weighed or composed meal is
  removed or replaced, live verdicts in Componi and the recipe picker, gluten seat for free-text extras;
  minors: plan text download vs wrong code, shared-line factor, gram labels by state, add or replace,
  cooked octopus from the plan's ratio, weekly limits in Componi, app suggestions marked, build fails
  without a gate in production, lookup cache purged first, lookup answers only the app's pages, 3D cause
  check, docs)
- [x] Round 3 fixes deployed 2026-11-07 14:54 UTC (deploy 6aef3b7d8a8aed0989f6fd7f); auditor re-check: approve
- [x] Re-check minors fixed: Brussels sprouts not vetoed, Undo restores only the affected meal, sweet potato flour not wheat
- [x] Sofia's feedback on the home page (2026-11-07): summary rings, three-step "Registra cibo" with household
  measures and brands, "Cosa hai mangiato oggi", suggestions, ideas page with ingredient signals
- [x] Week (2026-11-07): bars eaten and left per row (vegetables and fruit included), "Togli ingredienti"
  with vegetables and fruit, redo the days from today keeping past days and logged meals (`rifaiDa`)
- [x] Home, food log, ideas and week deployed 2026-11-07 19:28 UTC (deploy 6aef7bb8a2ee5d7cd73cb286,
  gate armed from the live hash, Sofia's code unchanged)
- [x] Plan text re-encrypted with the code Sofia uses now (2026-11-07; round trip checked, the earlier
  code no longer opens it)
- [x] Corpo 5D food-specific journey (2026-11-07): stops ranked by what the portion brings, nutrient amount,
  share of the NRV and the claim's daily amount at each stop; camera follows the food, nutrient colours,
  light settles around the organ, "Avanti", text journey with reading time (`viaggioCibo`);
  deployed 2026-11-07 (deploy 6aef7f55e2ea352fd5fc63d0, gate from the live hash)
- [ ] Independent QA review of the overhaul and re-check of S3 (read-only), fix what it finds, redeploy
- [x] Visitor access: ALX switched team login off (2026-11-07). Was: (BLOCKER, seen in the logs 2026-11-07 04:21 UTC: Sofia's iPhone gets 401 on every
      request, runs the old cached version and cannot load the 3D library): team login is on for all deploys.
      Changing it was refused by the permission check; ALX switches it in Netlify:
      Project configuration > General > Visitor access > Project visibility (password protection
      if the plan offers it; legacy plans: Access & security > Visitor access > Password Protection).
- [ ] ALX deletes the old GitHub branch `sofia-app` and asks GitHub Support to purge its commits from caches
- [ ] Deploys from before 2026-11-07 hold data removed since: keep them behind login or delete them
- [ ] Later (QA round 3 minors, not urgent): keep the public recipe cache out of localStorage and warn
      near the 5 MB quota (m7, about 0.8 MB after a year); gate verifier with PBKDF2 and its own salt (m10)
- [ ] Final report to ALX (visitor access, new access code, branch, old deploys)
