import { test } from "node:test";
import assert from "node:assert/strict";
import { trovaValori, analizzaRiga } from "../app/js/engine/labparse.js";
import { ESAMI } from "../app/js/data/esami.js";

test("typical Italian report lines", () => {
  const r = trovaValori(["Data prelievo: 12/10/2026", "CREATININA 0,72 mg/dL 0,51 - 0,95", "Emoglobina glicata (HbA1c) 36 mmol/mol 20 - 42", "PCR - Proteina C reattiva 3,2 mg/L < 5", "Complemento C3 0,78 g/L 0,90 - 1,80", "25-OH Vitamina D * 45 nmol/L 75 - 250"]);
  assert.equal(r.data, "2026-10-12");
  const by = Object.fromEntries(r.valori.map((v) => [v.id, v]));
  assert.deepEqual([by.creatinine.valore, by.creatinine.unita, by.creatinine.min, by.creatinine.max], [0.72, "mg/dL", 0.51, 0.95]);
  assert.equal(by.hba1c.valore, 36, "the 1 inside HbA1c is not the value");
  assert.deepEqual([by.crp.valore, by.crp.max], [3.2, 5]);
  assert.deepEqual([by.c3.valore, by.c3.min, by.c3.max], [0.78, 0.9, 1.8]);
});

test("Italian PCR means CRP, never the urine protein ratio", () => {
  assert.equal(analizzaRiga("PCR 4,0 mg/L < 5").id, "crp");
  assert.equal(analizzaRiga("Rapporto proteine/creatinina 35 mg/mmol < 15").id, "upcr");
});

test("38 verified markers, each with a reason and a source", () => {
  assert.equal(ESAMI.length, 38);
  for (const e of ESAMI) { assert.ok(e.perche.it && e.perche.en, e.id); assert.ok(e.fonti.length, e.id); }
});
