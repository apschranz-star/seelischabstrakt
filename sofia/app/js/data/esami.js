/*
 * Lab markers Sofia can track: 38 markers chosen and checked by the clinical
 * evidence officer (docs/fonti/evidence-clinical.json), generated into
 * esami-dati.js. Each marker has names (it, en, de), the aliases printed on
 * Italian, Austrian and German reports, its units with the conversion factor
 * to the canonical (SI) unit from the KDIGO tables, the body system, which
 * side of the range matters, and why it matters for her, with sources.
 *
 * Rules from the council, enforced here and in salute.js:
 *   - no universal reference ranges: the range printed on her report is used
 *   - units without a verified factor are never converted (antibody kits,
 *     folate, urine red cells, HbA1c %): a trend only joins values with the
 *     same unit
 *   - the eGFR printed by the lab and the eGFR the app calculates (CKD-EPI
 *     2021) are separate series, never one trend
 */
import { ESAMI_DATI } from "./esami-dati.js";

export const ESAMI = ESAMI_DATI;
export const ESAME = Object.fromEntries(ESAMI.map((e) => [e.id, e]));

/* The eGFR the app computes from creatinine: shown as its own series. */
export const EGFR_CALC = {
  id: "egfr_calc", it: "eGFR calcolato dall'app (CKD-EPI 2021)", en: "eGFR calculated by the app (CKD-EPI 2021)", de: "eGFR berechnet (CKD-EPI 2021)",
  campione: "sangue", organo: "kidneys", organiSecondari: [], verso: "basso",
  unita: [{ u: "mL/min/1.73 m2", f: 1, canonica: "mL/min/1.73 m2", alias: [] }], alias: [],
  perche: { it: "Calcolato dalla tua creatinina, età e sesso con l'equazione CKD-EPI 2021. Non va unito all'eGFR stampato dal laboratorio, che può usare un'altra equazione.", en: "Calculated from your creatinine, age and sex with the CKD-EPI 2021 equation. Not to be joined with the eGFR printed by the lab, which may use another equation." },
  calcolato: true,
};

export function unitaDi(id, unita) {
  const e = id === "egfr_calc" ? EGFR_CALC : ESAME[id];
  if (!e) return null;
  const u = String(unita || "").toLowerCase().replace(/\s+/g, "");
  return e.unita.find((x) => x.u.toLowerCase().replace(/\s+/g, "") === u || (x.alias || []).some((a) => a.toLowerCase().replace(/\s+/g, "") === u)) || null;
}

/* Value in the canonical unit, or null when no verified factor exists. */
export function inCanonica(id, valore, unita) {
  if (valore == null) return null;
  const u = unitaDi(id, unita);
  return u && u.f != null ? valore * u.f : null;
}

export function canonica(id) {
  const e = id === "egfr_calc" ? EGFR_CALC : ESAME[id];
  return e ? (e.unita.find((x) => x.f === 1) || e.unita[0]).canonica || e.unita[0].u : "";
}
