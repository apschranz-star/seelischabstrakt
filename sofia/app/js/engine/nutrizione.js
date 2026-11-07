/*
 * Calories and nutrients of meals and days, from the plan's amounts.
 *
 * Sources, in this order:
 *   0. an ingredient logged with its own values per 100 g (copied from
 *      CIQUAL, a package or a label when it was logged: line.p),
 *   1. a food Sofia added herself (values from CIQUAL or from the package,
 *      via Open Food Facts),
 *   2. a vegetable or fruit she picked by name (CIQUAL 2020, data/scelte.js),
 *   3. the verified composition of plan foods (CREA, CIQUAL, USDA:
 *      data/evidenze.js), averaged when a plan line covers several foods,
 *   4. stand-ins for plan foods with no composition data (data/scelte.js),
 *      always marked as estimates.
 * Pieces, pots and teaspoons have no weight in the plan: the app uses the
 * weights in PESI_PREDEFINITI, marked as estimates, and Sofia can change them.
 */
import { COMPOSIZIONE } from "../data/evidenze.js";
import { VERDURE, FRUTTA, PROXY } from "../data/scelte.js";
import { OBIETTIVI, COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA } from "../data/piano.js";
import { ALIMENTI } from "../data/alimenti.js";

export const PESI_PREDEFINITI = { galletta: 8, vasetto: 125, uovo: 50, cucchiaino: 5, oliva: 3 };
export const OBIETTIVO_KCAL = OBIETTIVI.kcal;
export const PASTI = { colazione: COLAZIONE, spuntino: SPUNTINO, pranzo: PRANZO, cena: CENA, dopocena: DOPOCENA };
export const CAMPI = ["kcal", "prot", "carb", "fat", "fib", "salt"];

const SCELTA = Object.fromEntries([...VERDURE, ...FRUTTA].map((x) => [x.id, x]));
export const scelta = (id) => SCELTA[id] || null;
/* Milk and kefir are measured in ml in the plan; 1 ml weighs about 1.03 g. */
const DENSITA = { latte_ps: 1.03, kefir: 1.03 };
const ZERO = new Set(["acqua", "cannella", "limone"]);
const CEREALI_PRANZO = ["riso_basmati", "riso_venere", "riso_integrale", "quinoa", "grano_saraceno", "sorgo", "miglio"];

const vuoto = () => ({ kcal: 0, prot: 0, carb: 0, fat: 0, fib: 0, salt: 0 });

function daEvidenze(lista) {
  const v = vuoto();
  let n = 0;
  for (const c of lista) {
    const p = c.per100g || {};
    if (p.kcal == null) continue;
    n++;
    v.kcal += p.kcal; v.prot += p.protein_g || 0; v.carb += p.carb_g || 0; v.fat += p.fat_g || 0; v.fib += p.fibre_g || 0;
    v.salt += p.sodium_mg != null ? (p.sodium_mg * 2.5) / 1000 : 0;
  }
  if (!n) return null;
  for (const k of CAMPI) v[k] /= n;
  return { v, media: n > 1 ? lista.map((c) => c.it).filter(Boolean) : null };
}

const daScelte = (x) => ({ kcal: x.v.kcal, prot: x.v.prot || 0, carb: x.v.carb || 0, fat: x.v.fat || 0, fib: x.v.fib || 0, salt: x.v.salt || 0 });

/* Values per 100 g for a food id, or null when nothing reliable exists. */
export function per100(a, { scelta: sc = null, extra = null } = {}) {
  if (extra && extra[a]) {
    const x = extra[a];
    return { v: { ...vuoto(), ...x.per100 }, stima: x.per100 && x.stimaKcal ? "energia stimata" : null, fonte: x.fonte };
  }
  if (sc && SCELTA[sc]) return { v: daScelte(SCELTA[sc]), stima: SCELTA[sc].stimaKcal ? "energia stimata" : null, fonte: "CIQUAL", nome: SCELTA[sc] };
  if (ZERO.has(a)) return { v: vuoto(), stima: null, fonte: null };
  if (COMPOSIZIONE[a]) {
    const r = daEvidenze(COMPOSIZIONE[a]);
    if (r) return { v: r.v, stima: null, media: r.media, fonte: "CREA/CIQUAL/USDA" };
  }
  if (a === "cereali_sg") {
    const lista = CEREALI_PRANZO.flatMap((x) => COMPOSIZIONE[x] || []);
    const r = daEvidenze(lista);
    return r ? { v: r.v, stima: "media dei cereali del piano", fonte: "CREA/CIQUAL" } : null;
  }
  if (a === "farina_saraceno" && COMPOSIZIONE.grano_saraceno) return { v: daEvidenze(COMPOSIZIONE.grano_saraceno).v, stima: "come il grano saraceno in chicco", fonte: "CREA" };
  if (PROXY[a]) return { v: daScelte(PROXY[a]), stima: "valori di un alimento simile (CIQUAL " + PROXY[a].codice + ")", fonte: "CIQUAL" };
  return null;
}

/* A line that carries its own values per 100 g. */
function daRiga(v) {
  return { v: { ...vuoto(), ...v.p }, stima: v.stimaKcal ? "energia stimata dai macronutrienti" : null, fonte: v.fonte || null };
}

/* ------------------------------------------------ raw weights and sources */
/* The state the values per 100 g refer to, read from the source's own name.
   The food log asks for uncooked weights, so every line says it. "Dried" means
   uncooked only for grains, pasta and legumes (secchi); dried fruit is as sold. */
const COTTO = /\b(cooked|boiled|steamed|roasted|baked|grilled|fried|pan-fried|saut[ée]ed|braised|stewed|poached|scrambled|microwaved|toasted|pur[ée]e|reheated|rehydrated|reconstituted)\b/;
/* "raw" as a qualifier of the food itself ("Spinach, raw", "Salmon, raw, wild"), not of a part of a dish ("..., raw cured ham, ..."). */
export const CRUDO = /(^|, )raw(,|$| \()/;
const CONSERVATO = /\b(canned|drained|in brine|in oil|in salt|salted, dried|semi-preserved|smoked|cured|pickled)\b/;
export function statoDaNome(nomeEn, secchi = false) {
  const n = String(nomeEn || "").toLowerCase();
  if (CRUDO.test(n) && !/pre-fried/.test(n)) return "crudo";
  if (COTTO.test(n)) return "cotto";
  if (secchi && /\b(dried|dry)\b/.test(n)) return "secco";
  if (CONSERVATO.test(n)) return "conservato";
  return "venduto";
}
export const STATI = {
  crudo: { it: "crudo", en: "raw" },
  secco: { it: "secco, da cuocere", en: "dry, uncooked" },
  cotto: { it: "cotto", en: "cooked" },
  conservato: { it: "conservato", en: "preserved" },
  venduto: { it: "come si compra", en: "as sold" },
};
const NOME_FONTE = { ciqual: "CIQUAL 2020", off: "Open Food Facts", etichetta: "etichetta" };
const SECCHI = new Set(["cereali", "legumi"]);
export const secchiCiqual = (gruppo) => /^(0301|0203)/.test(String(gruppo || ""));

/* Where the values of a line come from: state, sources with their codes,
   kcal per 100 g, and whether they are an average or a stand-in. */
export function origineVoce(v, opz = {}) {
  const extra = (opz.extra || {})[v.a];
  if (v.p) return { stato: v.stato || null, fonti: [{ db: NOME_FONTE[v.fonte] || v.fonte || null, id: v.codice || null, nome: v.nomeEn || v.marca || null }], kcal100: v.p.kcal ?? null };
  if (extra) return { stato: extra.fonte === "ciqual" ? statoDaNome(extra.nomeEn, secchiCiqual(extra.gruppoCiqual)) : "venduto", fonti: [{ db: NOME_FONTE[extra.fonte] || extra.fonte, id: extra.codice || null, nome: extra.nomeEn || extra.marca || null }], kcal100: extra.per100 ? extra.per100.kcal ?? null : null };
  if (v.scelta && SCELTA[v.scelta]) { const x = SCELTA[v.scelta]; return { stato: statoDaNome(x.nomeEn), fonti: [{ db: "CIQUAL 2020", id: String(x.codice), nome: x.nomeEn }], kcal100: x.v.kcal }; }
  if (ZERO.has(v.a)) return { stato: null, fonti: [], kcal100: 0 };
  const p = per100(v.a, {});
  const lista = COMPOSIZIONE[v.a];
  if (lista && lista.length && p) {
    const secchi = SECCHI.has((ALIMENTI[v.a] || {}).gruppo);
    const stati = [...new Set(lista.map((c) => statoDaNome(c.en, secchi)))];
    return { stato: stati.length === 1 ? stati[0] : null, fonti: lista.map((c) => ({ db: c.db, id: c.dbId, nome: c.en })), media: lista.length > 1, kcal100: p.v.kcal };
  }
  if (PROXY[v.a]) return { stato: statoDaNome(PROXY[v.a].nomeEn, true), fonti: [{ db: "CIQUAL 2020", id: String(PROXY[v.a].codice), nome: PROXY[v.a].nomeEn }], simile: true, kcal100: PROXY[v.a].v.kcal };
  return { stato: null, fonti: [], kcal100: p ? p.v.kcal : null, stima: p ? p.stima : null };
}

/* Grams of one plan line. */
export function grammi(v, pesi = PESI_PREDEFINITI) {
  const p = { ...PESI_PREDEFINITI, ...(pesi || {}) };
  if (v.q == null || v.u === "q.b.") return { g: 0, nonContato: true };
  let q = v.q, stima = null;
  if (Array.isArray(q)) { q = (q[0] + q[1]) / 2; stima = "metà dell'intervallo"; }
  if (v.u === "g") return { g: q, stima };
  if (v.u === "ml") return { g: q * (DENSITA[v.a] || 1), stima };
  if (v.u === "vasetto") return { g: q * p.vasetto, stima: `1 vasetto = ${p.vasetto} g (stima)` };
  if (v.u === "cucchiaino") return { g: q * p.cucchiaino, stima: `1 cucchiaino = ${p.cucchiaino} g (stima)` };
  if (v.u === "pz") {
    if (v.a === "piadina_gf") return { g: q * 100, stima: null }; /* the plan: "piadina ... da 100 gr" */
    if (/^gallette/.test(v.a)) return { g: q * p.galletta, stima: `1 galletta = ${p.galletta} g (stima)` };
    if (v.a === "uovo") return { g: q * p.uovo, stima: `1 uovo = ${p.uovo} g senza guscio (stima)` };
    if (v.a === "olive") return { g: q * p.oliva, stima: `1 oliva = ${p.oliva} g (stima)` };
  }
  return { g: null, stima: null };
}

/* Values of one line: grams times values per 100 g. A shared amount
   ("10 g tra avena e cioccolato") uses the average of the foods. */
export function valoriVoce(v, opz = {}) {
  const gr = grammi(v, opz.pesi);
  const stime = [];
  if (gr.stima) stime.push(gr.stima);
  if (gr.nonContato) {
    if (v.a === "passata") stime.push("passata non contata: il piano non dà la quantità");
    return { a: v.a, g: 0, val: vuoto(), stime, manca: v.q == null && v.u !== "q.b." && !ZERO.has(v.a) && v.a !== "passata", nonContato: true };
  }
  const ids = [v.a, ...(v.con || [])];
  const fonti = ids.map((a, i) => (i === 0 && v.p ? daRiga(v) : per100(a, { scelta: i === 0 ? v.scelta : null, extra: opz.extra })));
  if (gr.g == null || fonti.some((f) => !f)) return { a: v.a, g: gr.g, val: null, stime, manca: true };
  if (ids.length > 1) stime.push("peso condiviso: media degli alimenti");
  for (const f of fonti) if (f.stima) stime.push(f.stima);
  const val = vuoto();
  for (const k of CAMPI) val[k] = (fonti.reduce((s, f) => s + (f.v[k] || 0), 0) / fonti.length) * gr.g / 100;
  return { a: v.a, g: gr.g, val, stime, manca: false, media: fonti[0].media || null };
}

export function valoriVoci(voci, opz = {}) {
  const tot = vuoto();
  const righe = (voci || []).map((v) => valoriVoce(v, opz));
  const stime = new Set(), mancanti = [];
  for (const r of righe) {
    r.stime.forEach((x) => stime.add(x));
    if (r.manca) mancanti.push(r.a);
    if (r.val) for (const k of CAMPI) tot[k] += r.val[k];
  }
  return { tot, righe, stime: [...stime], mancanti, completo: !mancanti.length };
}

/* How a meal compares with the plan's own figure for that meal ("circa"):
   within 10% of the range counts as in line. */
export function confrontoPasto(pasto, kcal) {
  const def = PASTI[pasto];
  if (!def || kcal == null) return { stato: "nd" };
  const [lo, hi] = def.kcal;
  if (kcal < lo * 0.9) return { stato: "sotto", lo, hi };
  if (kcal > hi * 1.1) return { stato: "sopra", lo, hi };
  return { stato: "ok", lo, hi };
}

/* A day from the food log: entries per meal plus extras. */
export function giornata(log, opz = {}) {
  const tot = vuoto(), perPasto = {}, stime = new Set(), mancanti = [];
  for (const [pasto, voce] of Object.entries(log || {})) {
    const elenco = Array.isArray(voce) ? voce : [voce];
    for (const e of elenco) {
      if (!e || !e.voci) continue;
      const r = valoriVoci(e.voci, opz);
      perPasto[pasto] = perPasto[pasto] || vuoto();
      for (const k of CAMPI) { tot[k] += r.tot[k]; perPasto[pasto][k] += r.tot[k]; }
      r.stime.forEach((x) => stime.add(x));
      mancanti.push(...r.mancanti);
    }
  }
  return { tot, perPasto, restano: OBIETTIVO_KCAL - tot.kcal, stime: [...stime], mancanti };
}
