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

## Open
- [ ] Deploy to Netlify (gate armed locally from /home/claude/council/.sofia_code), live check
- [ ] Independent QA auditor agent, fix findings, redeploy
- [ ] Final report to ALX (visitor access switch, access code, branch)
