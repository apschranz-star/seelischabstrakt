/*
 * The day at a glance: what Sofia ate against what the plan gives for today.
 *
 * Targets come from the nutritionist's plan itself:
 *   - calories: the plan's 1400 kcal a day;
 *   - protein, carbohydrate and fat: the sum of the ranges the plan writes for
 *     each meal (breakfast, snack, lunch, dinner, after dinner), so the day's
 *     range is the plan's own; the ring fills to the middle of that range;
 *   - vegetables and fruit: the grams of today's planned meals (raw weight).
 * Eaten values come from the food log (engine/nutrizione). A logged food is
 * counted as vegetable or fruit by the plan's food group, the CIQUAL group of
 * the table entry, or the class the food brain gave her own foods; packages
 * and label values without a group are not counted there (said in the UI).
 */
import { PASTI, valoriVoci, grammi, scelta } from "./nutrizione.js";
import { ALIMENTI } from "../data/alimenti.js";
import { VERDURE, FRUTTA } from "../data/scelte.js";
import { vociPasto } from "./planner.js";

export const ORDINE_PASTI = ["colazione", "spuntino", "pranzo", "cena", "dopocena"];
export const KCAL_GIORNO = 1400;

/* Day ranges = sum of the plan's per-meal ranges (protein, carbohydrate, fat). */
const NOMI_MACRO = { prot: "proteine", carb: "carboidrati", fat: "grassi" };
export const MACRO_GIORNO = Object.fromEntries(Object.entries(NOMI_MACRO).map(([k, m]) => {
  let min = 0, max = 0;
  for (const p of ORDINE_PASTI) { const r = (PASTI[p].macro || {})[m]; if (r) { min += r[0]; max += r[1]; } }
  return [k, { min, max, mezzo: (min + max) / 2 }];
}));

const VERDURA = new Set(VERDURE.map((x) => x.id));
const FRUTTO = new Set(FRUTTA.map((x) => x.id));

/* "verdure", "frutta" or null for one logged or planned line. */
export function gruppoDi(v, opz = {}) {
  if (v.scelta) return VERDURA.has(v.scelta) ? "verdure" : FRUTTO.has(v.scelta) ? "frutta" : null;
  const a = ALIMENTI[v.a];
  if (a) return a.gruppo === "verdure" ? "verdure" : a.gruppo === "frutta" && v.a !== "prugne_secche" ? "frutta" : null;
  const mio = (opz.extra || {})[v.a];
  const classe = mio && mio.classe;
  if (classe === "verdure" || classe === "frutta") return classe;
  const g = String(v.gruppo || (mio && mio.gruppoCiqual) || "");
  if (g.startsWith("0201")) return "verdure";
  if (g.startsWith("0204")) return "frutta";
  return null;
}

function grammiGruppo(voci, opz) {
  const out = { verdure: 0, frutta: 0, senzaGruppo: 0 };
  for (const v of voci) {
    const gr = grammi(v, opz.pesi);
    if (gr.g == null) continue;
    const gruppo = gruppoDi(v, opz);
    if (gruppo) out[gruppo] += gr.g;
    else if (v.p && !v.gruppo) out.senzaGruppo++;
  }
  return out;
}

/* What today's plan gives: kcal, the plan's macro ranges, planned vegetables and fruit. */
export function obiettiviDelGiorno(giornoPiano, opz = {}) {
  const voci = giornoPiano ? ORDINE_PASTI.flatMap((p) => (giornoPiano[p] ? vociPasto(giornoPiano, p) : [])) : [];
  const gg = grammiGruppo(voci, opz);
  return { kcal: KCAL_GIORNO, ...MACRO_GIORNO, verdure: gg.verdure, frutta: gg.frutta };
}

/* What the log holds for the day. */
export function mangiatoDelGiorno(log, opz = {}) {
  const tutte = [];
  for (const p of [...ORDINE_PASTI, "altro"]) {
    const e = log[p];
    if (!e) continue;
    for (const x of p === "altro" ? e : [e]) tutte.push(...x.voci);
  }
  const r = valoriVoci(tutte, opz);
  const gg = grammiGruppo(tutte, opz);
  return { kcal: r.tot.kcal, prot: r.tot.prot, carb: r.tot.carb, fat: r.tot.fat, verdure: gg.verdure, frutta: gg.frutta, senzaGruppo: gg.senzaGruppo, completo: r.completo, voci: tutte.length };
}

/* The five rings, in the fixed order of the palette slots. */
export function anelli(obiettivi, mangiato) {
  const riga = (chiave, nome, valore, obiettivo, unita, range = null) => ({
    chiave, nome, valore, obiettivo, unita, range,
    quota: obiettivo > 0 ? valore / obiettivo : 0,
    /* nessuno: nothing of this group in today's plan (no target to reach) */
    stato: range ? (valore < range.min ? "sotto" : valore > range.max ? "sopra" : "ok") : !(obiettivo > 0) ? "nessuno" : valore >= obiettivo ? "ok" : "sotto",
  });
  return [
    riga("carb", { it: "Carboidrati", en: "Carbs" }, mangiato.carb, obiettivi.carb.mezzo, "g", obiettivi.carb),
    riga("prot", { it: "Proteine", en: "Protein" }, mangiato.prot, obiettivi.prot.mezzo, "g", obiettivi.prot),
    riga("verdure", { it: "Verdure", en: "Vegetables" }, mangiato.verdure, obiettivi.verdure, "g"),
    riga("frutta", { it: "Frutta", en: "Fruit" }, mangiato.frutta, obiettivi.frutta, "g"),
    riga("fat", { it: "Grassi", en: "Fat" }, mangiato.fat, obiettivi.fat.mezzo, "g", obiettivi.fat),
  ];
}

/*
 * The week: the plan's targets summed over the days that count, against what
 * the log holds. A past day with nothing logged has no data ("information
 * missing"), so it counts neither in what she ate nor in the target: the
 * numbers stay true instead of showing a day of fasting. Today and the days
 * ahead count with the plan's full target. Ranges (protein, carbohydrate,
 * fat) keep their minimum and maximum: "left" is what is left up to the
 * maximum, and the minimum still to reach is given apart.
 */
export function numeriSettimana(giorni, logDi, opz = {}, oggi) {
  const ob = { kcal: 0, verdure: 0, frutta: 0, prot: { min: 0, max: 0 }, carb: { min: 0, max: 0 }, fat: { min: 0, max: 0 } };
  const m = { kcal: 0, prot: 0, carb: 0, fat: 0, verdure: 0, frutta: 0 };
  let passati = 0, registrati = 0, completo = true, senzaGruppo = 0;
  const vuoti = [];
  for (const g of giorni || []) {
    const passato = g.data < oggi;
    const x = g.data <= oggi ? mangiatoDelGiorno(logDi(g.data) || {}, opz) : null;
    if (g.data <= oggi) passati++;
    if (x && x.voci > 0) {
      registrati++;
      for (const k of Object.keys(m)) m[k] += x[k] || 0;
      if (!x.completo) completo = false;
      senzaGruppo += x.senzaGruppo || 0;
    } else if (passato) { vuoti.push(g.data); continue; }
    const o = obiettiviDelGiorno(g, opz);
    ob.kcal += o.kcal; ob.verdure += o.verdure; ob.frutta += o.frutta;
    for (const k of ["prot", "carb", "fat"]) { ob[k].min += o[k].min; ob[k].max += o[k].max; }
  }
  /* tetto: the target is a ceiling (calories, macros, fruit); vegetables are a target to reach, with no ceiling */
  const riga = (chiave, nome, valore, max, min, unita, tetto = true) => ({
    chiave, nome, valore, max, min, unita, tetto,
    restano: Math.max(0, max - valore),
    oltre: tetto ? Math.max(0, valore - max) : 0,
    mancaMin: min != null ? Math.max(0, min - valore) : null,
    /* nessuno: the counted days plan none of it */
    stato: !(max > 0) ? "nessuno" : tetto && valore > max ? "sopra" : valore >= (min != null ? min : max) ? "ok" : "sotto",
  });
  return {
    righe: [
      riga("kcal", { it: "Calorie", en: "Calories" }, m.kcal, ob.kcal, null, "kcal"),
      riga("carb", { it: "Carboidrati", en: "Carbs" }, m.carb, ob.carb.max, ob.carb.min, "g"),
      riga("prot", { it: "Proteine", en: "Protein" }, m.prot, ob.prot.max, ob.prot.min, "g"),
      riga("fat", { it: "Grassi", en: "Fat" }, m.fat, ob.fat.max, ob.fat.min, "g"),
      riga("verdure", { it: "Verdure", en: "Vegetables" }, m.verdure, ob.verdure, null, "g", false),
      riga("frutta", { it: "Frutta", en: "Fruit" }, m.frutta, ob.frutta, null, "g"),
    ],
    passati, registrati, vuoti, completo, senzaGruppo,
  };
}

export { scelta };
