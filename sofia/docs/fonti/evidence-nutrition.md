# Evidence: nutrition data (Nutrition Data Officer)

Generated 2026-11-06. Companion to `evidence-nutrition.json` (50 claims, thresholds, 77 foods).

## What is verified

**A. Health claims (50 entries, all `verified: true`)**
- The English and Italian wording, conditions of use (short summary plus full verbatim EN and IT text) and EFSA journal references come from the **consolidated Regulation (EU) No 432/2012 as of 20.08.2025**, in both EN and IT.
- Each claim was matched to the **EU Register** data feed, and its status is `HCCS_AUTHORISED`. `register_matches_regulation` is true for all 50.
- I also spot-checked the Italian wordings against the original 2012 Official Journal Italian text. They are identical.
- 48 claims are the ones you asked for. I added 2 more:
  - protein: maintenance of muscle mass (relevant to a hypocaloric plan);
  - green kiwi: bowel function (Art. 13(5) claim, added by Implementing Reg. (EU) 2025/1560; kiwi is in the plan).
- Prunes come from Reg. (EU) 536/2013. Cocoa flavanols come from Reg. (EU) 851/2013, with the entry replaced by Reg. (EU) 2015/539. Both data-protection periods have expired.
- Each claim has a `link` that tells the app how to connect it to foods: `source_of`, `condition`, `food` (needs a daily amount) or `not_computable`. Each claim also lists `eligible_foods` and `eligible_foods_recommended`.

**B. Thresholds (all verified, with citations in `thresholds.sources`)**
- **NRVs** (Reg. 1169/2011 Annex XIII Part A): Ca 800 mg, Fe 14 mg, Mg 375 mg, K 2000 mg, Zn 10 mg, Se 55 ug, I 150 ug, vitamin C 80 mg, D 5 ug, E 12 mg, B6 1.4 mg, B12 2.5 ug, folic acid 200 ug.
- **Significant amount:** 15% of the NRV per 100 g, or 7.5% per 100 ml for beverages. Directive 90/496/EEC, which Reg. 1924/2006 refers to, was repealed, and its references are read as references to 1169/2011 (Art. 53).
- **Source of protein:** at least 12% of energy from protein.
- **Source of fibre:** at least 3 g/100 g or 1.5 g/100 kcal.
- **Source of omega-3:** at least 0.3 g ALA, or at least 40 mg EPA+DHA, per 100 g AND per 100 kcal.
- Conditions some claims need were also computed: high fibre, low sodium, high unsaturated fat, and DHA at least 40 mg per 100 g and per 100 kcal.

**C and D. Foods (77, all requested items plus reduced-sugar jam)**
- **Primary database:**
  - CREA for 50 foods: used when CREA has the same food and state, with energy, macros, fibre and at least 4 of the 5 minerals.
  - CIQUAL 2020 for 17 foods.
  - USDA SR Legacy for 10 foods.
- **Gap filling:** missing micronutrients are filled from the same food in CIQUAL, then USDA. Every borrowed value is listed in `nutrient_sources`.
- **Fatty acids:** EPA, DHA and ALA always come from CIQUAL or USDA, because CREA reports fatty acids only as % of total fatty acids.
- **Calculations:** every food has `checks` showing the inputs, the threshold and the result.
- **Cross-check:** `crosscheck` repeats the test with a second database used on its own.
- **`source_of` and `source_of_recommended`:** `source_of` is the strict computation you asked for. `source_of_recommended` removes four kinds of result: borderline ones not confirmed independently, ones where the databases disagree, known database artefacts, and soil-dependent selenium/iodine in plant foods. **The app should display only `source_of_recommended`.**

## Gaps and decisions needed

1. **Kidney involvement.** Potassium and protein claims read as benefits, but lupus nephritis may require potassium or phosphorus restriction. The nephrologist or nutritionist should decide whether potassium claims are shown. No authorised claim here maps to kidneys, liver, joints or skin.
2. **System enum gaps.** No value fits vision, thyroid, tiredness/fatigue or oxidative stress. I used the closest value plus `system_alt` (`eyes`, `thyroid`, `energy_fatigue`, `cells_whole_body`). I suggest adding `eyes`, `thyroid` and `energy`.
3. **Claims that cannot be linked from composition data:**
   - beta-glucans (no beta-glucan values in the databases);
   - olive oil polyphenols (needs at least 5 mg hydroxytyrosol per 20 g, product specific);
   - cocoa flavanols (needs at least 200 mg per day, product specific);
   - water (applies to drinking water, not a plan food).

   Walnuts (30 g/day), prunes (100 g/day) and kiwi (200 g/day) need the daily portion to be checked.
4. **Proxies, because no database entry exists:**
   - buckwheat flakes → buckwheat groats;
   - puffed brown rice → wholemeal puffed rice cakes;
   - puffed quinoa → raw quinoa;
   - buckwheat cakes → rice+buckwheat cakes;
   - buckwheat pasta → buckwheat flour;
   - brown rice pasta → brown rice flour;
   - oat pasta → oat flour.

   Product labels would be better.
5. **Brand and light dairy** (ricotta light, mozzarella light, philadelphia light, fiocchi di latte): USDA generic products are used, so Italian labels may differ.
6. **Null values:**
   - passata: iron, magnesium, potassium, vitamin D, B12, folate, fatty acids;
   - riso venere and hummus: vitamins D and B12, folate, fatty acids;
   - gluten-free bread: vitamins C, D and B12, folate;
   - EPA+DHA: null for 11 foods (kefir, buckwheat cakes, hummus, brown rice pasta, riso venere, sorghum, millet, borlotti, rabbit, passata, pomegranate). Most are plant foods, where EPA and DHA are absent anyway.
7. **Notable disagreements between databases** (flagged in `caution`):
   - prunes iron: CREA 3.9 mg vs 0.4 to 0.9 mg elsewhere;
   - CREA oat flakes protein 8.0 g, which is why CIQUAL was used;
   - CIQUAL 0% yogurt vitamin D 0.8 ug (likely fortified products in the sample);
   - cooked ham EPA 0.064 g;
   - hummus vitamin E 28 mg;
   - quinoa DHA (database artefact).
8. **Access.**
   - EUR-Lex pages block scripted access, so the texts were retrieved from the EU Publications Office Cellar (same documents, by CELEX number).
   - ciqual.anses.fr returned HTTP 503, so the official CIQUAL 2020 English table was taken from its Zenodo record.
   - USDA per-food web pages did not resolve, so the URL given is the SR Legacy dataset download and `db_id` is the FDC ID.
9. **Celiac disease.** Oats count only if labelled gluten-free. Grains and flours need gluten-free labelling.
