import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { regressione, pearson, spearman, egfr2021, bmi, categoriaBmi, rcv, tCritico } from "../app/js/engine/stats.js";

const clin = JSON.parse(readFileSync(new URL("../docs/fonti/evidence-clinical.json", import.meta.url), "utf8"));

test("eGFR CKD-EPI 2021 matches the clinical officer's test vectors", () => {
  for (const v of clin.egfr_ckd_epi_2021.test_vectors_computed) {
    const e = egfr2021({ creatinina: v.scr_mg_dl, eta: v.age, sesso: v.sex === "female" ? "F" : "M" });
    assert.ok(Math.abs(e - v.egfr) < 0.15, `${JSON.stringify(v)} -> ${e}`);
  }
  assert.equal(egfr2021({ creatinina: 0.8, eta: 15, sesso: "F" }), null, "adults only");
});

test("coefficients in code equal the verified ones", () => {
  const c = clin.egfr_ckd_epi_2021;
  assert.equal(c.constant, 142); assert.equal(c.female.kappa, 0.7); assert.equal(c.female.alpha, -0.241);
  assert.equal(c.male.kappa, 0.9); assert.equal(c.male.alpha, -0.302); assert.equal(c.female.factor, 1.012);
  assert.equal(c.age_base, 0.9938); assert.equal(c.exp_above, -1.2);
});

test("least squares slope and interval", () => {
  const r = regressione([{ t: 0, y: 70 }, { t: 7, y: 69.5 }, { t: 14, y: 69 }, { t: 21, y: 68.5 }]);
  assert.ok(Math.abs(r.b * 7 + 0.5) < 1e-9);
  assert.ok(Math.abs(r.ic95[0] - r.b) < 1e-9 && Math.abs(r.ic95[1] - r.b) < 1e-9, "perfect line: zero width");
  assert.ok(regressione([{ t: 0, y: 1 }, { t: 1, y: 2 }]).insufficiente);
  assert.equal(tCritico(2), 4.303);
});

test("correlations", () => {
  assert.ok(Math.abs(pearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]) - 1) < 1e-12);
  assert.ok(Math.abs(spearman([1, 2, 3, 4], [1, 4, 9, 16]) - 1) < 1e-12);
});

test("BMI and WHO categories", () => {
  assert.ok(Math.abs(bmi(68, 165) - 24.977) < 0.001);
  const cat = clin.bmi_who.categories;
  for (const c of cat) { const v = c.min + 0.01; assert.equal(categoriaBmi(v).it, c.label_it, String(v)); }
});

test("reference change value formula (Fraser)", () => {
  assert.ok(Math.abs(rcv(3, 4) - Math.SQRT2 * 1.96 * 5) < 1e-12);
});
