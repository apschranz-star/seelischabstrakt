# Stato del lavoro (resume file)

Any session that picks up this project reads this file first and continues
from the first unchecked item without asking. Keep it short and current.

Branch: `sofia-app` in `apschranz-star/seelischabstrakt`.
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
- [x] 34 tests, `tools/build.sh`, `sofia/netlify.toml`, root 404 for `/sofia/*`
- [x] Docs: README, COUNCIL, FONTI, PRIVACY
- [x] Headless Chrome smoke test of every screen (CSP-safe styles)

- [x] Deployed to Netlify 2026-11-06 19:01 UTC, deploy 6aee23e0046e4a5d4b1a11c6, 2 functions,
      schedule 17 4 * * *, tests passed in the Netlify build. Gate armed at upload time.

## Open
- [ ] Independent QA auditor report: /home/claude/council/qa-report.md, fix BLOCKER and MAJOR, redeploy
- [ ] Visitor access: the project defaults to Netlify team login for all deploys (Sofia cannot open it).
      Changing it was refused by the permission check; ALX switches it in Netlify:
      Project configuration > Access & security > Visitor access.
- [ ] Independent QA auditor agent, fix findings, redeploy
- [ ] Final report to ALX (visitor access switch, access code, branch)
