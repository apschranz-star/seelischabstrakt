# Stato del lavoro (resume file)

Any session that picks up this project reads this file first and continues
from the first unchecked item without asking. Keep it short and current.

Branch: `sofia-app-clean` in `apschranz-star/seelischabstrakt` (one squashed commit, no surname in its
history). The old branch `sofia-app` has the surname in two commits: ALX deletes it on GitHub
(the force-push to rewrite it was refused by the permission check).
Netlify project: `sofia-piano`, site id `3902075f-8500-47f3-8807-d8c902846694`
(team `a-p-schranz`). Deploy: run the command returned by the Netlify MCP
`deploy-site` operation from inside `sofia/`.

## Done
- [x] Plan transcribed: `app/js/data/piano.js`, foods: `app/js/data/alimenti.js`
- [x] Weekly planner with every limit: `app/js/engine/planner.js`
- [x] Council rule agents: `app/js/engine/consiglio.js`
- [x] 44 curated recipes in plan doses: `app/js/data/ricette.js`
- [x] Daily web recipe pipeline + Netlify functions: `lib/`, `netlify/functions/`
- [x] Health engine, stats, lab PDF parser: `app/js/engine/{salute,stats,labparse}.js`, `app/js/data/esami.js`
- [x] 3D body: `app/js/three/corpo3d.js`
- [x] Nutrition data officer output: `/home/claude/council/evidence-nutrition.json`

- [x] Views, router, service worker, index.html, manifest, icons
- [x] Evidence integrated (`tools/genera-evidenze.mjs` -> `evidenze.js`, `esami-dati.js`)
- [x] Tests (42 on 2026-11-07), `tools/build.sh`, `sofia/netlify.toml`, root 404 for `/sofia/*`
- [x] Docs: README, COUNCIL, FONTI, PRIVACY
- [x] Headless Chrome smoke test of every screen (CSP-safe styles)

- [x] Deployed to Netlify 2026-11-06 19:01 UTC, deploy 6aee23e0046e4a5d4b1a11c6, 2 functions,
      schedule 17 4 * * *, tests passed in the Netlify build. Gate armed at upload time.

- [x] QA audit tasks 1 to 5 (plan amounts, privacy blocker, health statements, recipes, planner) fixed
      2026-11-07: surname removed and branch history squashed, generic contact-data detectors, plan
      audit test against an independent transcription, light/protein cheeses, shared 10 g in d5,
      both dinner rice cakes, 14-day omelette window in both directions (also on day swaps),
      council wording per sources, citrus and St John's wort checks from the medicines profile.

## Open
- [x] Redeployed 2026-11-07 02:31 UTC, deploy 6aee8d51a012db9473ca4a83, 2 functions, schedule 17 4 * * *
- [ ] QA auditor tasks 6 (privacy and security) and 7 (wording): resume the agent, fix, redeploy
- [ ] Visitor access: the project defaults to Netlify team login for all deploys (Sofia cannot open it).
      Changing it was refused by the permission check; ALX switches it in Netlify:
      Project configuration > General > Visitor access > Project visibility (legacy plans:
      Access & security > Visitor access > Password Protection).
- [ ] ALX deletes the old GitHub branch `sofia-app`
- [ ] Final report to ALX (visitor access switch, access code, branch)
