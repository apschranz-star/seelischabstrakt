/*
 * "Which food does what": the 5th dimension of the body model.
 *
 * A food is linked to a body system only when
 *   1. the council's nutrition data shows the food is at least a "source of"
 *      a nutrient under EU rules (15% of the NRV per 100 g, Reg. 1169/2011),
 *      cross-checked between databases, and
 *   2. that nutrient has an EU-authorised health claim (Reg. 432/2012).
 * Claims that need a daily amount (walnuts 30 g, prunes 100 g, kiwi 200 g)
 * are compared with the most the plan gives at one meal and shown as "not
 * reached" when the plan portion is smaller. Claims that need product data
 * (oat beta-glucans, olive oil polyphenols, cocoa flavanols) are shown as
 * "label needed", never as a fact.
 */
import { CLAIMS, COMPOSIZIONE } from "../data/evidenze.js";
import { PASTI, PRANZO, CENA } from "../data/piano.js";
import { ALIMENTI } from "../data/alimenti.js";

/* Largest amount of a food the plan gives at one meal, in grams. */
function massimoNelPiano(id) {
  let max = 0;
  const visita = (voci) => {
    for (const v of voci) {
      for (const x of [v, ...(v.o || [])]) if (x.a === id && x.u === "g" && typeof x.q === "number") max = Math.max(max, x.q);
    }
  };
  for (const p of PASTI) {
    for (const lista of [p.opzioni, p.carboidrati, p.proteine, p.idee, p.combinati && p.combinati.opzioni]) if (lista) lista.forEach((o) => visita(o.voci));
    if (p.contorno) visita(p.contorno);
  }
  void PRANZO; void CENA;
  return max || null;
}

export function impattiCibo(id) {
  const out = [];
  for (const c of CLAIMS) {
    if (c.cibi.includes(id)) {
      let stato = "ok";
      let nota = null;
      if (c.quantitaGiorno) {
        const max = massimoNelPiano(id);
        if (!max || max < c.quantitaGiorno) { stato = "quantita"; nota = { it: `L'effetto richiede ${c.quantitaGiorno} g al giorno; nel piano al massimo ${max || 0} g per pasto.`, en: `The effect needs ${c.quantitaGiorno} g a day; the plan gives at most ${max || 0} g per meal.` }; }
      }
      if (/potassium/.test(c.id)) nota = { it: "Con interessamento renale il potassio si limita solo se il medico lo chiede; per ora i reni sono a posto e il piano non lo limita.", en: "With kidney involvement potassium is limited only if the doctor asks; for now the kidneys are fine and the plan does not limit it." };
      out.push({ organo: c.organo, claim: c, stato, nota, varianti: c.varianti[id] || [] });
    } else if (c.nonCalcolabile && c.candidati.includes(id)) {
      out.push({ organo: c.organo, claim: c, stato: "etichetta", nota: { it: "Dipende dal prodotto: non si può calcolare dalle tabelle, serve l'etichetta.", en: "Depends on the product: it cannot be computed from food tables, the label is needed." }, varianti: [] });
    }
  }
  return out;
}

/* Systems a food reaches with a claim whose conditions the plan meets. */
export function organiDelCibo(id) {
  const s = new Set(impattiCibo(id).filter((x) => x.stato === "ok").map((x) => x.organo));
  const a = ALIMENTI[id];
  if (a) s.add("gut");
  return [...s];
}

export function cibiPerOrgano(organo) {
  const per = {};
  for (const c of CLAIMS) if (c.organo === organo) for (const id of c.cibi) (per[id] = per[id] || []).push(c);
  return Object.entries(per).map(([id, claims]) => ({ id, claims })).sort((a, b) => b.claims.length - a.claims.length);
}

/* Per-portion nutrients for the exchange lists: plan grams x per-100 g data.
   Group foods (frutta secca, legumi secchi, ...) use the average of their
   varieties and say so. */
export function porzione(id, grammi) {
  const righe = COMPOSIZIONE[id];
  if (!righe || !righe.length || !(grammi > 0)) return null;
  const chiavi = Object.keys(righe[0].per100g);
  const media = {};
  for (const k of chiavi) {
    const val = righe.map((r) => r.per100g[k]).filter((x) => x != null);
    media[k] = val.length ? (val.reduce((a, b) => a + b, 0) / val.length) * (grammi / 100) : null;
  }
  return { valori: media, varianti: righe.length > 1 ? righe.map((r) => r.it) : null, fonti: righe.map((r) => `${r.db} ${r.dbId}`) };
}

export const CIBI_5D = ["salmone", "alici", "tonno", "gamberi", "uovo", "pollo", "legumi_secchi", "quinoa", "grano_saraceno", "avena", "yogurt_magro", "latte_ps", "mozzarella_light", "frutta_secca", "cioccolato", "frutta", "verdure", "olio_evo", "patate"];
