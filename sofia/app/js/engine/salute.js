/*
 * From Sofia's own numbers to the colours of the 5D body.
 *
 * Each body system gets a score from 0 to 100 at a given date, built only
 * from what she entered:
 *   - lab results against the range printed on her own report
 *     (inside 100; just outside on the side that matters 55; further 20;
 *     outside on the harmless side, e.g. a low CRP, still 100)
 *   - the daily check-in of the last 7 days (1-5 scales and 0-10 symptom scales)
 *   - the plan's own targets for water (2 L) and walking (5 x 30 min a week)
 * No data, no score: the organ stays grey. The score is a summary of her
 * entries, not a diagnosis, and the app says so wherever it is shown.
 */
import { ESAMI, ESAME, EGFR_CALC, inCanonica } from "../data/esami.js";
import { egfr2021, bmi, categoriaBmi, giorniDa } from "./stats.js";
import { aggiungiGiorni } from "./planner.js";

export const ORGANI = [
  { id: "brain", it: "Cervello e mente", en: "Brain and mind", diario: ["energia", "umore", "sonno", "nebbia"], abitudini: ["acqua"] },
  { id: "heart_vessels", it: "Cuore e vasi", en: "Heart and vessels" },
  { id: "kidneys", it: "Reni", en: "Kidneys" },
  { id: "gut", it: "Intestino", en: "Gut", diario: ["intestino", "glutine"] },
  { id: "blood", it: "Sangue", en: "Blood" },
  { id: "immune", it: "Sistema immunitario", en: "Immune system" },
  { id: "joints", it: "Articolazioni", en: "Joints", diario: ["dolori"] },
  { id: "skin", it: "Pelle", en: "Skin", diario: ["pelle"] },
  { id: "bones", it: "Ossa", en: "Bones" },
  { id: "metabolism", it: "Metabolismo e peso", en: "Metabolism and weight", peso: true },
  { id: "liver", it: "Fegato", en: "Liver" },
  { id: "muscle", it: "Muscoli", en: "Muscles", abitudini: ["passi"] },
];
for (const o of ORGANI) o.esami = ESAMI.filter((e) => e.organo === o.id).map((e) => e.id);
/* The computed eGFR has no lab range, so it never scores an organ; it is shown next to the lab's eGFR. */

export const SCALE = {
  energia: { min: 1, max: 5, buono: "alto" },
  umore: { min: 1, max: 5, buono: "alto" },
  sonno: { min: 1, max: 5, buono: "alto" },
  nebbia: { min: 0, max: 10, buono: "basso" },
  dolori: { min: 0, max: 10, buono: "basso" },
  intestino: { min: 0, max: 10, buono: "basso" },
  pelle: { min: 0, max: 10, buono: "basso" },
};

export function statoDaPunteggio(p) {
  if (p == null) return "nd";
  if (p >= 80) return "ok";
  if (p >= 50) return "attenzione";
  return "male";
}

/* One lab result against its own range. */
export function valutaEsame(r) {
  const e = r.marker === "egfr_calc" ? EGFR_CALC : ESAME[r.marker];
  if (!e || r.valore == null) return { punteggio: null, stato: "nd" };
  const { min, max } = r;
  if (min == null && max == null) return { punteggio: null, stato: "nd" };
  const sotto = min != null && r.valore < min;
  const sopra = max != null && r.valore > max;
  if (!sotto && !sopra) return { punteggio: 100, stato: "ok" };
  const lato = sopra ? "alto" : "basso";
  if (e.verso !== "entrambi" && e.verso !== lato) return { punteggio: 100, stato: "ok", innocuo: true };
  const limite = sopra ? max : min;
  const dev = limite ? Math.abs(r.valore - limite) / Math.abs(limite) : 1;
  return dev <= 0.1 ? { punteggio: 55, stato: "attenzione", lato } : { punteggio: 20, stato: "male", lato };
}

export function eta(profilo, alGiorno) {
  if (!profilo.nascita) return null;
  const anno = Number(String(profilo.nascita).slice(0, 4));
  if (!anno) return null;
  return Number(alGiorno.slice(0, 4)) - anno;
}

/* All results of one marker up to a date, oldest first. "canon" is the value
   in the canonical unit when a verified factor exists, otherwise null; a
   trend only joins values that share the same canonical scale or the same unit. */
export function serieEsame(s, marker, finoA = "9999-12-31") {
  if (marker === "egfr_calc") return serieEgfrCalcolato(s, finoA);
  return s.esami.filter((r) => r.marker === marker && r.data <= finoA)
    .map((r) => ({ ...r, canon: inCanonica(marker, r.valore, r.unita) }))
    .sort((a, b) => (a.data < b.data ? -1 : 1));
}

/* CKD-EPI 2021 from each creatinine result, when birth year and sex are known. */
export function serieEgfrCalcolato(s, finoA = "9999-12-31") {
  const out = [];
  for (const c of s.esami.filter((r) => r.marker === "creatinine" && r.data <= finoA)) {
    const umol = inCanonica("creatinine", c.valore, c.unita);
    const e = eta(s.profilo, c.data);
    const v = umol != null ? egfr2021({ creatinina: umol / 88.4, eta: e, sesso: s.profilo.sesso }) : null;
    if (v) out.push({ id: "calc-" + c.id, data: c.data, marker: "egfr_calc", valore: Math.round(v), unita: "mL/min/1.73 m2", min: null, max: null, calcolato: true, canon: v });
  }
  return out.sort((a, b) => (a.data < b.data ? -1 : 1));
}

/* Split a series where units cannot be converted into each other. */
export function gruppiConfrontabili(serie) {
  const gruppi = new Map();
  for (const r of serie) {
    const k = r.canon != null ? "canon" : "u:" + String(r.unita).toLowerCase();
    if (!gruppi.has(k)) gruppi.set(k, []);
    gruppi.get(k).push(r);
  }
  return [...gruppi.entries()].map(([k, righe]) => ({ chiave: k, convertito: k === "canon", righe }));
}

function ultimi(s, finoA, giorni) {
  const da = aggiungiGiorni(finoA, -giorni + 1);
  return Object.entries(s.diario).filter(([d]) => d >= da && d <= finoA).map(([d, v]) => ({ d, ...v }));
}

export function punteggioOrgano(s, organo, finoA) {
  const o = typeof organo === "string" ? ORGANI.find((x) => x.id === organo) : organo;
  const parti = [];
  for (const m of o.esami) {
    const serie = s.esami.filter((r) => r.marker === m && r.data <= finoA && giorniDa(finoA, r.data) <= 365).sort((a, b) => (a.data < b.data ? -1 : 1));
    const ult = serie[serie.length - 1];
    if (!ult) continue;
    const v = valutaEsame(ult);
    if (v.punteggio != null) parti.push({ tipo: "esame", marker: m, data: ult.data, valore: ult.valore, unita: ult.unita, ...v });
  }
  const giorni = ultimi(s, finoA, 7);
  for (const k of o.diario || []) {
    if (k === "glutine") {
      const mese = ultimi(s, finoA, 30).filter((g) => g.glutine === true).length;
      if (ultimi(s, finoA, 30).some((g) => g.glutine != null)) parti.push({ tipo: "diario", chiave: k, valore: mese, punteggio: Math.max(0, 100 - 40 * mese) });
      continue;
    }
    const sc = SCALE[k];
    const val = giorni.map((g) => g[k]).filter((x) => typeof x === "number");
    if (!val.length) continue;
    const m = val.reduce((a, b) => a + b, 0) / val.length;
    const norm = (m - sc.min) / (sc.max - sc.min);
    parti.push({ tipo: "diario", chiave: k, valore: m, punteggio: Math.round(100 * (sc.buono === "alto" ? norm : 1 - norm)) });
  }
  for (const k of o.abitudini || []) {
    if (k === "acqua") {
      const val = giorni.map((g) => g.acqua).filter((x) => typeof x === "number");
      if (val.length) { const m = val.reduce((a, b) => a + b, 0) / val.length; parti.push({ tipo: "abitudine", chiave: k, valore: m, punteggio: Math.round(Math.min(1, m / 2) * 100) }); }
    }
    if (k === "passi") {
      const val = giorni.map((g) => g.passi).filter((x) => typeof x === "number");
      if (val.length) { const tot = val.reduce((a, b) => a + b, 0); parti.push({ tipo: "abitudine", chiave: k, valore: tot, punteggio: Math.round(Math.min(1, tot / 150) * 100) }); }
    }
  }
  if (o.peso) {
    const pesi = s.pesi.filter((p) => p.data <= finoA).sort((a, b) => (a.data < b.data ? -1 : 1));
    const ult = pesi[pesi.length - 1];
    if (ult && s.profilo.pesoObiettivo && pesi.length >= 2) {
      const inizio = pesi[0].kg, obiettivo = s.profilo.pesoObiettivo;
      const progresso = inizio === obiettivo ? 1 : Math.max(0, Math.min(1, (inizio - ult.kg) / (inizio - obiettivo)));
      parti.push({ tipo: "peso", valore: ult.kg, progresso, punteggio: Math.round(40 + 60 * progresso) });
    } else if (ult && s.profilo.altezza_cm) {
      const c = categoriaBmi(bmi(ult.kg, s.profilo.altezza_cm));
      const p = { sotto: 50, normale: 100, sovrappeso: 65, ob1: 40, ob2: 30, ob3: 20 }[c.id];
      parti.push({ tipo: "peso", valore: ult.kg, categoria: c, punteggio: p });
    }
  }
  const punteggio = parti.length ? Math.round(parti.reduce((a, p) => a + p.punteggio, 0) / parti.length) : null;
  return { organo: o.id, punteggio, stato: statoDaPunteggio(punteggio), parti };
}

export function statoCorpo(s, finoA) {
  return Object.fromEntries(ORGANI.map((o) => [o.id, punteggioOrgano(s, o, finoA)]));
}

/* Every date where something changed: the time axis of the 5D model. */
export function dateDati(s) {
  const d = new Set([...s.esami.map((r) => r.data), ...s.pesi.map((p) => p.data), ...Object.keys(s.diario)]);
  return [...d].sort();
}

/* For the kidney sentinel: is any recent kidney result outside the lab range? */
export function renaleFuoriRange(s, oggi) {
  return ["creatinine", "egfr", "upcr", "proteinuria_24h", "uacr"].some((m) => {
    const serie = s.esami.filter((r) => r.marker === m && giorniDa(oggi, r.data) <= 180).sort((a, b) => (a.data < b.data ? -1 : 1));
    const u = serie[serie.length - 1];
    return u && valutaEsame(u).stato !== "ok" && valutaEsame(u).stato !== "nd";
  });
}
