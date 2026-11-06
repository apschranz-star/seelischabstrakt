# Fonti (sources)

Everything the app states comes from one of these. The full records, with
URLs, versions and the officers' notes, are in `docs/fonti/`.

## The plan

- Dott.ssa Isabella Giunta, Biologa Nutrizionista: "Schema dietetico generale
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
