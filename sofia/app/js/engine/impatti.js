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
export function massimoNelPiano(id) {
  let max = 0;
  const visita = (voci) => {
    for (const v of voci) {
      for (const x of [v, ...(v.o || [])]) if (x.a === id && x.u === "g" && typeof x.q === "number") max = Math.max(max, x.q);
      /* a shared amount ("10 g tra avena e cioccolato") is at most the whole amount for each food */
      if ((v.con || []).includes(id) && v.u === "g" && typeof v.q === "number") max = Math.max(max, v.q);
    }
  };
  for (const p of PASTI) {
    for (const lista of [p.opzioni, p.carboidrati, p.proteine, p.idee, p.combinati && p.combinati.opzioni]) if (lista) lista.forEach((o) => visita(o.voci));
    if (p.contorno) visita(p.contorno);
  }
  void PRANZO; void CENA;
  return max || null;
}

/* opz.renaleFuoriRange: a recent kidney result is outside the lab range (salute.renaleFuoriRange) */
export function impattiCibo(id, opz = {}) {
  const out = [];
  for (const c of CLAIMS) {
    if (c.cibi.includes(id)) {
      let stato = "ok";
      let nota = null;
      if (c.quantitaGiorno) {
        const max = massimoNelPiano(id);
        if (!max || max < c.quantitaGiorno) { stato = "quantita"; nota = { it: `L'effetto richiede ${c.quantitaGiorno} g al giorno; nel piano al massimo ${max || 0} g per pasto.`, en: `The effect needs ${c.quantitaGiorno} g a day; the plan gives at most ${max || 0} g per meal.` }; }
      }
      if (/potassium/.test(c.id)) nota = opz.renaleFuoriRange
        ? { it: "Un esame renale recente è fuori dall'intervallo del laboratorio: chiedi al medico se limitare il potassio.", en: "A recent kidney result is outside the lab range: ask the doctor whether to limit potassium." }
        : { it: "Con interessamento renale il potassio si limita solo se il medico lo chiede: il piano non lo limita.", en: "With kidney involvement potassium is limited only if the doctor asks: the plan does not limit it." };
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

/* Plan foods that support a system: only claims whose conditions the plan's
   amounts meet (stato "ok"). A claim needing 100 g of prunes a day does not
   count when the plan gives 25 g. */
export function cibiPerOrgano(organo) {
  const per = {};
  for (const c of CLAIMS) if (c.organo === organo) for (const id of c.cibi) {
    if (impattiCibo(id).some((x) => x.claim === c && x.stato === "ok")) (per[id] = per[id] || []).push(c);
  }
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

/*
 * The food's own journey (Corpo 5D): what one plan portion brings and where
 * it goes.
 *
 * For every system the food reaches (claims whose conditions the plan meets),
 * the nutrients behind it with:
 *   - the amount in one plan portion: the council's composition records
 *     (COMPOSIZIONE, per 100 g) times the plan's grams;
 *   - the share of the EU reference value (NRV, Reg. (EU) 1169/2011 Annex
 *     XIII Part A, SOGLIE.nrv);
 *   - where the claim's conditions of use name a daily amount (EPA and DHA
 *     250 mg, DHA 250 mg, ALA 2 g), whether one portion reaches it.
 * Amounts the records do not hold (selenium, iodine, vitamin B6, vitamin E,
 * zinc, DHA alone) are never estimated: the "source of" rule gives only a
 * floor (at least 15% of the NRV per 100 g), shown as "at least".
 * Systems are ordered by how much the portion brings, preferring a different
 * nutrient for each stop, so salmon shows its omega-3 at the heart, vitamin
 * B12 and DHA at the brain, vitamin D at the bones.
 * The digestion steps say what happens to this food's nutrients (general
 * physiology, not health claims).
 */
import { SOGLIE } from "../data/evidenze.js";
import { grammi as grammiVoce } from "./nutrizione.js";

/* order of the stops when two bring the same */
const PRIORITA = ["heart_vessels", "brain", "bones", "muscle", "blood", "immune", "metabolism", "skin", "liver", "kidneys", "joints", "gut"];

const NUTRIENTE = {
  omega3_epa_dha: { k: "epa_dha_g", fattore: 1000, unita: "mg", nome: { it: "EPA e DHA (omega-3)", en: "EPA and DHA (omega-3)" }, giorno: 250, grasso: { art: "gli omega-3 EPA e DHA", a: "agli omega-3 EPA e DHA", en: "omega-3 EPA and DHA" } },
  dha_40mg_per_100g_and_100kcal: { k: null, unita: "mg", nome: { it: "DHA (omega-3)", en: "DHA (omega-3)" }, giorno: 250, insieme: "epa_dha_g", minimo100: 40 },
  omega3_ala: { k: "ala_g", fattore: 1, unita: "g", nome: { it: "ALA (omega-3 vegetale)", en: "ALA (plant omega-3)" }, giorno: 2, grasso: { art: "l'omega-3 ALA", a: "all'omega-3 ALA", en: "omega-3 ALA" } },
  vitamin_d: { k: "vitd_ug", unita: "µg", nrv: "vitd_ug", nome: { it: "Vitamina D", en: "Vitamin D" }, grasso: { art: "la vitamina D", a: "alla vitamina D", en: "vitamin D" } },
  vitamin_b12: { k: "b12_ug", unita: "µg", nrv: "b12_ug", nome: { it: "Vitamina B12", en: "Vitamin B12" } },
  protein: { k: "protein_g", unita: "g", nome: { it: "Proteine", en: "Protein" }, ri: 50 },
  potassium: { k: "potassium_mg", unita: "mg", nrv: "potassium_mg", nome: { it: "Potassio", en: "Potassium" } },
  calcium: { k: "calcium_mg", unita: "mg", nrv: "calcium_mg", nome: { it: "Calcio", en: "Calcium" } },
  iron: { k: "iron_mg", unita: "mg", nrv: "iron_mg", nome: { it: "Ferro", en: "Iron" } },
  magnesium: { k: "magnesium_mg", unita: "mg", nrv: "magnesium_mg", nome: { it: "Magnesio", en: "Magnesium" } },
  folate: { k: "folate_ug", unita: "µg", nrv: "folate_ug", nome: { it: "Folati", en: "Folate" } },
  vitamin_c: { k: "vitc_mg", unita: "mg", nrv: "vitc_mg", nome: { it: "Vitamina C", en: "Vitamin C" } },
  high_fibre: { k: "fibre_g", unita: "g", nome: { it: "Fibre", en: "Fibre" } },
  low_sodium: { k: "sodium_mg", unita: "mg", nome: { it: "Poco sodio", en: "Low sodium" } },
  selenium: { k: null, nrv: "selenium_ug", unita: "µg", nome: { it: "Selenio", en: "Selenium" } },
  zinc: { k: null, nrv: "zinc_mg", unita: "mg", nome: { it: "Zinco", en: "Zinc" } },
  iodine: { k: null, nrv: "iodine_ug", unita: "µg", nome: { it: "Iodio", en: "Iodine" } },
  vitamin_e: { k: null, nrv: "vite_mg", unita: "mg", nome: { it: "Vitamina E", en: "Vitamin E" }, grasso: { art: "la vitamina E", a: "alla vitamina E", en: "vitamin E" } },
  vitamin_b6: { k: null, nrv: "b6_mg", unita: "mg", nome: { it: "Vitamina B6", en: "Vitamin B6" } },
  high_unsaturated_fat: { k: null, unita: "g", nome: { it: "Grassi insaturi", en: "Unsaturated fat" } },
};
export const nutrienteViaggio = (chiave) => NUTRIENTE[chiave] || null;

/* Grams of one plan portion: the plan's largest amount at one meal, or one piece (egg). */
export function grammiPorzione(id, pesi) {
  const g = massimoNelPiano(id);
  if (g) return { q: g, u: "g", g };
  if (id === "uovo") return { q: 1, u: "pz", g: grammiVoce({ a: "uovo", q: 1, u: "pz" }, pesi).g };
  return null;
}

/* One nutrient of one claim in one portion. */
function inPorzione(c, val, g) {
  const n = NUTRIENTE[c.chiave];
  if (!n) return null;
  const out = { chiave: c.chiave, nome: n.nome, unita: n.unita, claim: c, quantita: null, nrvPct: null, almenoPct: null, giorno: n.giorno || null, raggiunto: null, insieme: null };
  if (n.k && val && val[n.k] != null) out.quantita = val[n.k] * (n.fattore || 1);
  const nrv = n.nrv ? SOGLIE.nrv[n.nrv] : null;
  if (nrv && out.quantita != null) out.nrvPct = (out.quantita / nrv) * 100;
  /* "source of" means at least 15% of the NRV per 100 g: a floor, not a value */
  if (nrv && out.quantita == null && c.tipo === "source_of") out.almenoPct = 15 * (g / 100);
  if (n.insieme && val && val[n.insieme] != null) out.insieme = val[n.insieme] * 1000;
  if (n.giorno && out.quantita != null) out.raggiunto = out.quantita >= n.giorno;
  /* how much the portion brings, for ordering the stops */
  out.forza = out.giorno && out.quantita != null ? out.quantita / out.giorno
    : out.nrvPct != null ? out.nrvPct / 100
    : n.ri && out.quantita != null ? out.quantita / n.ri
    : out.almenoPct != null ? out.almenoPct / 100
    : n.minimo100 ? (n.minimo100 * g / 100) / n.giorno
    : 0.1;
  return out;
}

export function viaggioCibo(id, opz = {}) {
  const por = grammiPorzione(id, opz.pesi);
  const g = por ? por.g : null;
  const comp = g ? porzione(id, g) : null;
  const val = comp ? comp.valori : null;
  const imp = impattiCibo(id, opz).filter((x) => x.stato === "ok");
  const perOrgano = {};
  for (const x of imp) {
    const n = inPorzione(x.claim, val, g || 100);
    if (!n) continue;
    const lista = (perOrgano[x.organo] = perOrgano[x.organo] || []);
    const gia = lista.find((y) => y.chiave === n.chiave);
    if (gia) { if (!gia.altri.some((c) => c.id === x.claim.id)) gia.altri.push(x.claim); }
    else lista.push({ ...n, altri: [] });
  }
  for (const lista of Object.values(perOrgano)) lista.sort((a, b) => b.forza - a.forza);
  const organi = Object.entries(perOrgano).map(([organo, nutrienti]) => ({ organo, nutrienti, forza: nutrienti[0].forza }))
    .sort((a, b) => b.forza - a.forza || PRIORITA.indexOf(a.organo) - PRIORITA.indexOf(b.organo));
  /* up to four stops: each time the system whose next nutrient brings the
     most; a nutrient already shown counts a quarter, an amount the records
     do not hold half (so the stops show different nutrients with real numbers) */
  const mete = [], usati = new Set();
  while (mete.length < 4) {
    let meglio = null;
    for (const o of organi) {
      if (mete.some((m) => m.organo === o.organo)) continue;
      for (const n of o.nutrienti) {
        const punti = n.forza * (usati.has(n.chiave) ? 0.25 : 1) * (n.quantita == null ? 0.5 : 1);
        if (!meglio || punti > meglio.punti + 1e-9 || (Math.abs(punti - meglio.punti) < 1e-9 && PRIORITA.indexOf(o.organo) < PRIORITA.indexOf(meglio.o.organo))) meglio = { o, n, punti };
      }
    }
    if (!meglio) break;
    mete.push({ ...meglio.o, nutrienti: [meglio.n, ...meglio.o.nutrienti.filter((x) => x !== meglio.n)] });
    usati.add(meglio.n.chiave);
  }

  /* the digestion steps, for this food */
  const prot = val ? val.protein_g : null, fat = val ? val.fat_g : null, carb = val ? val.carb_g : null, fib = val ? val.fibre_g : null;
  const fonti = new Set(imp.map((x) => x.claim.chiave));
  const grassi = [...fonti].map((k) => NUTRIENTE[k] && NUTRIENTE[k].grasso).filter(Boolean);
  const unisci = (xs, e) => (xs.length <= 1 ? xs[0] || "" : `${xs.slice(0, -1).join(", ")} ${e} ${xs[xs.length - 1]}`);
  const n1 = (x) => (x >= 10 ? Math.round(x) : Math.round(x * 10) / 10);
  const it = (x) => String(n1(x)).replace(".", ","), en = (x) => String(n1(x));
  const bocca = [], intestino = [], sangue = [];
  if (val) {
    const macro = [prot >= 1 && [`${it(prot)} g di proteine`, `${en(prot)} g protein`], fat >= 1 && [`${it(fat)} g di grassi`, `${en(fat)} g fat`], carb >= 1 && [`${it(carb)} g di carboidrati`, `${en(carb)} g carbohydrate`]].filter(Boolean);
    const quanto = por.u === "pz" ? [`1 pezzo, circa ${Math.round(g)} g`, `1 piece, about ${Math.round(g)} g`] : [`${por.q} g`, `${por.q} g`];
    if (macro.length) bocca.push({ it: `Una porzione del piano (${quanto[0]}) porta ${unisci(macro.map((m) => m[0]), "e")}.`, en: `One plan portion (${quanto[1]}) brings ${unisci(macro.map((m) => m[1]), "and")}.` });
    if (carb >= 10) bocca.push({ it: "L'amido comincia a spezzarsi già in bocca, con la saliva.", en: "Starch starts to break down in the mouth already, with saliva." });
    if (prot >= 5) bocca.push({ it: "Nello stomaco cominciano a spezzarsi le proteine.", en: "In the stomach protein starts to break down." });
    if (prot >= 5) intestino.push({ it: "Le proteine diventano aminoacidi.", en: "Protein becomes amino acids." });
    if (carb >= 10) intestino.push({ it: "Gli amidi diventano zuccheri semplici.", en: "Starches become simple sugars." });
    if (grassi.length || fat >= 5) intestino.push({ it: `I grassi si assorbono con l'aiuto della bile${grassi.length ? `, insieme ${unisci(grassi.map((x) => x.a), "e")}` : ""}.`, en: `Fat is absorbed with the help of bile${grassi.length ? `, together with ${unisci(grassi.map((x) => x.en), "and")}` : ""}.` });
    if (fonti.has("vitamin_b12")) intestino.push({ it: "La vitamina B12 si assorbe nell'ultimo tratto dell'intestino tenue.", en: "Vitamin B12 is absorbed in the last part of the small intestine." });
    if (fonti.has("iron")) intestino.push(fonti.has("vitamin_c")
      ? { it: "Il ferro si assorbe all'inizio dell'intestino; la vitamina C dello stesso cibo ne aumenta l'assorbimento.", en: "Iron is absorbed at the start of the intestine; the vitamin C in the same food increases its absorption." }
      : { it: "Il ferro si assorbe all'inizio dell'intestino.", en: "Iron is absorbed at the start of the intestine." });
    if (fib >= 2) intestino.push({ it: "Le fibre vanno avanti fino al colon e nutrono i batteri buoni.", en: "Fibre goes on to the colon and feeds the good bacteria." });
    if (grassi.length || fat >= 5) sangue.push({ it: `I grassi${grassi.length ? `, con ${unisci(grassi.map((x) => x.art), "e")},` : ""} passano prima nella linfa ed entrano nel sangue vicino al cuore.`, en: `Fat${grassi.length ? `, with ${unisci(grassi.map((x) => x.en), "and")},` : ""} first goes into the lymph and enters the blood near the heart.` });
    if (prot >= 5 || carb >= 10) sangue.push({ it: `${prot >= 5 && carb >= 10 ? "Aminoacidi e zuccheri vanno" : prot >= 5 ? "Gli aminoacidi vanno" : "Gli zuccheri vanno"} al fegato con la vena porta; il fegato li smista a tutto il corpo.`, en: `${prot >= 5 && carb >= 10 ? "Amino acids and sugars go" : prot >= 5 ? "Amino acids go" : "Sugars go"} to the liver through the portal vein; the liver sends them round the whole body.` });
  }
  return { id, porzione: por, valori: val, fonti: comp ? comp.fonti : [], varianti: comp ? comp.varianti : null, bocca, intestino, sangue, mete, organi };
}
