# Clinical evidence officer: summary for the lead architect

File: evidence-clinical.json. sections_done = A, B, C, D, E, F, G. It holds 29 diet points, 38 lab markers and 56 cited URLs. I opened and read every source on 2026-11-06. There are no em or en dashes.

## Verified

- **A. Lupus and lupus nephritis (19 points)**
  - Alfalfa (Johns Hopkins plus primate and case-report data).
  - Garlic: patient-org advice only.
  - Immune-stimulating supplements: EMA echinacea monograph ("not recommended in autoimmune diseases, immunosuppression") and a 2025 scoping review.
  - Omega-3: meta-analysis of 5 RCTs, about minus 0.9 SLEDAI, low certainty.
  - Vitamin D: KDIGO and EULAR say supplement or check it for bone health. Its effect on lupus activity is inconsistent across meta-analyses.
  - Kidney: sodium below 2 g/day (90 mmol, 5 g salt); systolic BP below 120 if tolerated; protein 0.8 to 1.0 g/kg ideal weight with proteinuria, 0.8 if eGFR below 60, avoid above 1.3 in CKD at risk; potassium and phosphorus limits only in CKD G3+ with high levels.
  - Drug labels: grapefruit (cyclosporine, tacrolimus, voclosporin), plus pomelo, Seville orange and tangelo (FDA), St John's wort, meal timing, HCQ with food, mycophenolate and antacids, prednisone (salt, potassium, calcium, glucose).
- **B. Celiac (9 points)**
  - Lifelong strict gluten-free diet.
  - Oats: certified gluten-free only. ESsCD 2025 and ACG 2023 say from diagnosis; AIC says after remission and 6 months oat-free, under medical supervision.
  - EU 828/2014: "senza glutine" means 20 mg/kg or less; "very low gluten" (up to 100 mg/kg) is not gluten-free.
  - Common deficiencies, the ESsCD 2025 follow-up schedule, and what tTG-IgA does and does not show.
- **C. Lab markers.** Conversion factors come from KDIGO tables. Kit-specific tests have no conversion.
- **D. CKD-EPI 2021.** Constant 142; kappa 0.7 (female) / 0.9 (male); alpha -0.241 / -0.302; exponent -1.200; age factor 0.9938; female factor 1.012. Matches Inker 2021 Table 2 and the NKF page. Test vectors are included.
- **E. WHO BMI classes** from TRS 894 Table 2.1.
- **G. Mineral water.** "Contains calcium" means calcium **greater than** 150 mg/l. The Italian label is **"Calcica"** (German "Calciumhaltig"). "Indicata per le diete povere di sodio" means sodium below 20 mg/l.

## Not verified or not delivered

- **F. EFLM biological variation numbers: none delivered.** The site is reachable, but its terms require written EFLM permission (and a fee) to put its content into a software application. Only the RCV formula is given (Fraser 2011; Z 1.96 from Thöni 2022). One peer-reviewed alternative is included: creatinine CVI 5.2%, eGFR RCV plus or minus 16.5% (Thöni 2022).
- Folate and B12 pmol/L conversions are not verified.
- Urea/BUN was left out on purpose.
- ACR 2022 glucocorticoid osteoporosis guideline, EULAR 2022 cardiovascular and 2021 lifestyle recommendations, and NIH ODS were not retrievable.
- Aliases come from common report wording and are not individually sourced.

## Vetoes (do not ship these)

1. Any claim that a food or supplement treats lupus or prevents flares. Omega-3 and vitamin D evidence is low certainty or mixed.
2. Labelling garlic as dangerous or proven to cause flares.
3. Universal reference ranges, or colour codes not taken from the report's own range.
4. Automatic advice to change protein, potassium, phosphorus, salt targets, supplements or medicines without the doctor.
5. Embedding EFLM CVI or performance specifications without permission.
6. Converting tTG-IgA, anti-dsDNA or urine sediment values across kits or methods. Mixing eGFR equations in one trend.
7. Treating non-certified oats or "very low gluten" products as safe.
8. "Calcium at least 150 mg/l" or "contenente calcio" wording.
9. Surfacing the Johns Hopkins advice against sulfa antibiotics. It is a prescribing decision, and KDIGO discusses TMP-SMX prophylaxis.
10. Mapping a bare Italian "PCR" (which means CRP) to the urine protein/creatinine ratio.

## Needed from Sofia or her doctors

The 18 items are listed in open_questions. The main ones:
- Her current medicines.
- Whether she is immunosuppressed.
- Which oats position her gastroenterologist follows.
- Whether her protein target uses ideal or actual body weight.
- Approval and dose for omega-3 and vitamin D.
- Which eGFR equation her lab uses.
