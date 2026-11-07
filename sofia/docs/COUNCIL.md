# Il consiglio (the agents council)

Two councils work on Sofia's app. One built it and checks every release. The
other lives inside the app and checks every week, meal and recipe. Both follow
the same three rules:

1. **Proven concepts only.** A statement about health needs a source that a
   reader can open: the nutritionist's plan, a guideline (KDIGO, EULAR, ESsCD,
   ACG), EU law (Reg. 432/2012, 1169/2011, 828/2014, Directive 2009/54/EC), a
   food composition database (CREA, CIQUAL, USDA), or a peer-reviewed review.
   No source, no statement. Where the plan is silent the app says
   "Informazione mancante" and writes a question for the nutritionist.
2. **Seniority decides.** A veto from a more senior seat cannot be overruled
   by a junior seat. Safety seats outrank convenience seats.
3. **Double checks.** Whoever wrote something does not approve it. The
   independent auditor did not write any of the code or data it checks.

## Build council

| Seat | Seniority | Role | Veto |
|---|---|---|---|
| Lead architect (chair) | 1 | Structure, integration, final decision. Publishes only what no seat blocked. | release |
| Independent auditor (QA) | 1 | Compares the app with the plan PDF and the sources, runs the tests, reviews privacy and wording. Did not write the work. | release |
| Clinical evidence officer | 2 | Lupus, lupus nephritis, coeliac disease, lab markers, eGFR, BMI, medicines and food. Output: `docs/fonti/evidence-clinical.json` (29 graded points, 38 markers, 56 sources read). | any health sentence |
| Nutrition data officer | 2 | EU-authorised health claims (50, official IT and EN wording), NRVs and "source of" thresholds, composition of 77 plan foods with cross-checks. Output: `docs/fonti/evidence-nutrition.json`. | any nutrition number |

How the work ran: the officers researched in parallel and saved after every
section, so an interruption (a usage limit stopped both once) lost nothing; on
resume each continued from its last saved section. The architect integrated
their files through `tools/genera-evidenze.mjs`, so no figure is typed by hand.
`docs/STATO.md` is the resume file any new session reads first.

Decisions the officers forced:

- EFLM biological variation data is not used: its licence requires written
  permission and a fee for use in software. eGFR changes are judged against a
  published ±16.5% instead.
- The eGFR printed by a lab and the eGFR calculated by the app are separate
  series, never one trend (different equations).
- Antibody results (tTG-IgA, anti-dsDNA), folate, urine red cells and HbA1c %
  are never converted across units or kits.
- Italian "PCR" is C-reactive protein, never the urine protein ratio.
- No claim that any food treats lupus. Garlic is a note (patient-organisation
  advice), not a veto. Alfalfa and echinacea are vetoes.
- Potassium claims carry the kidney note; no EU claim links any plan food to
  kidneys, liver, joints or skin, so the app shows none.
- The mineral water label is "calcica": calcium above 150 mg/l.

## In-app council

The seats are fixed rule sets in `app/js/engine/consiglio.js`, the same file in
the phone and in the daily Netlify function. No AI model decides anything.

| Seat | Seniority | Checks | Veto |
|---|---|---|---|
| Custode del glutine | 1 | Every ingredient confirmed gluten free with anker's proven check (`lib/glutenpruefung.cjs`, identical copy); oats only certified; packaged foods only with the "senza glutine" label | yes |
| Sentinella lupus | 2 | Alfalfa, echinacea; with her profile: grapefruit with ciclosporin, tacrolimus or voclosporin, raw sprouts with immunosuppression; notes on garlic and omega-3 | yes |
| Custode del piano | 3 | Only plan foods and amounts, every weekly limit, one protein per meal, swaps the plan allows (seed oil to olive oil, butter out, alcohol out) | yes |
| Sentinella reni | 4 | Salty foods, KDIGO sodium below 2 g a day, recent kidney results outside the lab range | no |
| Analista dei dati | 5 | Says when there is enough data: trend from 3 points, correlation from 14 paired days | no |
| Revisore senior (chair) | - | Publishes approved or adapted results; anything vetoed is shown with the reason, never hidden | - |

## The food brain (in the app)

When Sofia adds a food, `app/js/engine/cervello.js` asks the same seats, in the
same order of seniority, and gives one of three verdicts:

| Verdict | Meaning |
|---|---|
| si | Fits the plan as it is |
| medio | Fits with care: a seat asks for a check (label, amount, cocoa percentage) or the food is not in the plan but compatible |
| no | Vetoed by the gluten guardian, the lupus sentinel or the plan keeper; the reason is shown |

| Seat | Seniority | Checks | Veto |
|---|---|---|---|
| Custode del glutine | 1 | Declared allergens and "may contain" traces, foods that usually contain gluten unless labelled gluten free, oats only certified | yes |
| Sentinella lupus | 2 | The same vetoes and notes as for recipes, with her medicines profile | yes |
| Custode del piano | 3 | What the nutritionist excludes (fried food, alcohol, refined oils, cold cuts, sweets, sugary drinks) or limits (cooked ham, dark chocolate only 85-90%) | yes |
| Sentinella reni | 4 | More than 1.5 g salt per 100 g; potassium and phosphorus when a kidney result is out of range | no |
| Analista dei dati | 5 | Where the values come from (CIQUAL 2020 or an Open Food Facts package), estimates, missing data | no |

The portion it proposes has the same calories as the plan portion it replaces
(protein foods too, with a warning when they bring much less protein). Without
calories there is no portion: "Informazione mancante".

## Release gate

`tools/build.sh` runs the tests before anything is published. The tests cover
every plan limit over 500 generated weeks, the council's verdicts, every
recipe's amounts, the statistics against the clinical officer's vectors, the
lab parser, the food brain's verdicts and the plan's calories computed from
composition data, the backup encryption, the scraper's link and date checks,
the absence of em dashes, surname, contact data and the plan's plain text, and
that the copied gluten files equal their originals.
