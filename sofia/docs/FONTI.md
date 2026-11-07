# Fonti (sources)

Everything the app states comes from one of these. The full records, with
URLs, versions and the officers' notes, are in `docs/fonti/`.

## The plan

- Sofia's nutritionist (Biologa Nutrizionista; name in the encrypted plan text): "Schema dietetico generale
  per dieta ipocalorica di circa 1400 kcal con circa 1 g proteine/kg peso
  corporeo", 4 pages. Transcribed in `app/js/data/piano.js`. Amounts the plan
  does not give are marked missing; open questions are in `DOMANDE_APERTE`.

## Nutrition data (`docs/fonti/evidence-nutrition.json`)

- Regulation (EU) No 432/2012, consolidated 20.08.2025, Italian and English:
  50 authorised health claims, matched to the EU Register (status authorised).
  Prunes: Reg. (EU) 536/2013. Cocoa flavanols: Reg. (EU) 851/2013 and 2015/539.
  Green kiwi: Implementing Reg. (EU) 2025/1560.
- Regulation (EU) No 1169/2011 Annex XIII: nutrient reference values,
  significant amount 15% per 100 g.
- Regulation (EC) No 1924/2006 Annex: "source of" protein, fibre, omega-3.
- Composition: CREA Tabelle di composizione degli alimenti (50 foods), ANSES
  CIQUAL 2020 (17), USDA FoodData Central SR Legacy (10), cross-checked;
  only results confirmed by the cross-check are shown.

## Food brain, meal builder and food log

- ANSES, Ciqual French food composition table 2020 (https://ciqual.anses.fr/),
  English table from the copy at https://zenodo.org/records/4770202 (file
  sha256 `5551841f12f40fb6c869f80aa14e9db33bcfb7dcc135f000cb994a2cca4dc2f5`).
  Licence: Etalab Open Licence 2.0 (the Zenodo copy: CC BY 4.0), credit to
  ANSES. Extracted by `tools/ciqual/estrai.py` into `app/js/data/ciqual.js`
  (baby foods left out). Energy is the table's EU Regulation 1169/2011 value;
  where that is missing, the table's Jones-factor value; where both are
  missing, the Annex XIV factors of Regulation 1169/2011 (protein and
  carbohydrate 4, fat 9, fibre 2 kcal/g). Both fallbacks are marked as estimates.
- Open Food Facts (https://world.openfoodfacts.org), search API at
  search.openfoodfacts.org, database under the Open Database License 1.0.
  Crowd-sourced: every value from it is shown with "always check the label".
- "Very salty" means more than 1.5 g salt per 100 g, the "high" band of the UK
  front-of-pack scheme (Department of Health and Food Standards Agency, Guide to
  creating a front of pack nutrition label, 2016). The daily limit shown with
  it is KDIGO's (clinical evidence below, `ln_sodium`).
- Food log, raw weights: each ingredient is matched to the CIQUAL entry for
  the raw food (or the dry one for grains, pasta and legumes), read from the
  table's own name ("raw", "dried", "cooked", "canned"); the state is shown on
  every line and cooked values are flagged. Plan foods use the council's raw
  or dry composition records listed in `docs/fonti/evidence-nutrition.json`.
  Values from outside the plan are copied into the logged line, with source
  and code, so a past day never changes.
- Weights of pieces the plan counts (a rice cake 8 g, a pot 125 g, an egg 50 g,
  a teaspoon 5 g, an olive 3 g) and 1.03 g per ml of milk are estimates, not
  from a source: they are marked as such and Sofia can change them in Settings.
- Check: the plan's own meals computed this way come close to the plan's
  calorie figures (lunch and dinner medians about 5% above them; the test in
  `test/cervello.test.mjs` allows 12%).

## Clinical evidence (`docs/fonti/evidence-clinical.json`)

- KDIGO 2024 Lupus Nephritis, KDIGO 2021 Glomerular Diseases, KDIGO 2024 CKD:
  sodium, blood pressure, protein, potassium and phosphorus, unit conversions.
- EULAR recommendations (SLE management), EMA monograph (echinacea), FDA and
  product labels (grapefruit and calcineurin inhibitors, St John's wort,
  hydroxychloroquine, mycophenolate, azathioprine, prednisone).
- ESsCD 2019 and 2025, ACG 2023, AIC, Coeliac UK: gluten-free diet, oats,
  deficiencies, follow-up tests. Commission Implementing Reg. (EU) 828/2014:
  "senza glutine" at most 20 mg/kg; "very low gluten" up to 100 mg/kg is not
  gluten free.
- Inker LA et al., N Engl J Med 2021;385:1737-1749: CKD-EPI 2021 equation.
- WHO Technical Report Series 894, Table 2.1: BMI categories.
- Directive 2009/54/EC Annex III: "calcica" when calcium is above 150 mg/l.
- Fraser CG, Clin Chem Lab Med 2011: reference change value formula. eGFR
  variability ±16.5% from a peer-reviewed meta-analysis (record in the file).
  EFLM biological variation data: not used (licence).

## Web recipes

- Read daily from the sites' own RSS feeds and schema.org/Recipe data, with
  robots.txt respected and two seconds between requests to the same site,
  the method already used by anker. Only ingredient lines, times, servings,
  author and link are kept; the method stays on the author's page.
