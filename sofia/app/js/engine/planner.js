/*
 * The weekly planner ("Rimescola la settimana").
 *
 * Builds a 7-day plan only from the options in piano.js and checks it against
 * every limit the nutritionist wrote. Hard limits (max 2 tuna, legumes exactly
 * twice at lunch, ...) are never broken: a candidate week that breaks one is
 * thrown away. The "Sarebbe perfetto" frequencies are targets: the generator
 * only produces weeks that meet them, and the validator reports them as soft
 * checks so a hand-edited week can still be saved.
 *
 * Reading of the lunch rule (open question in piano.js, DOMANDE_APERTE):
 * every lunch is one carbohydrate + one protein, and legumes count as the
 * carbohydrate on their 2 days, exactly as the plan's layout shows.
 */
import { COLAZIONE, SPUNTINO, PRANZO, CENA, DOPOCENA, LIMITI, FREQUENZE_IDEALI } from "../data/piano.js";
import { ALIMENTI } from "../data/alimenti.js";
import { rng } from "./rng.js";

const byId = (list) => Object.fromEntries(list.map((o) => [o.id, o]));
export const OPZ = {
  ...byId(COLAZIONE.opzioni), ...byId(SPUNTINO.opzioni), ...byId(PRANZO.carboidrati), ...byId(PRANZO.proteine),
  ...byId(PRANZO.combinati.opzioni), ...byId(CENA.proteine), ...byId(CENA.idee), ...byId(DOPOCENA.opzioni),
};

export function categoria(id) {
  const o = OPZ[id];
  if (!o) return null;
  if (o.cat !== undefined) return o.cat;
  const a = ALIMENTI[o.voci[0].a];
  return a && a.cat ? a.cat : null;
}

/* The categories the plan counts. At dinner lean veal or pork (max once a
   week) is counted in the meat slot of "1-2 volte carne bianca" (see
   DOMANDE_APERTE "vitello_maiale_cena"). */
const CAT_PRANZO = ["carne", "pesce", "uova", "formaggio"];
const CAT_CENA = ["legumi", "carne_bianca", "pesce", "uova", "formaggio"];
const famiglia = (c) => (c === "carne_bianca" ? "carne" : c);

const PRANZO_PER_CAT = {
  carne: ["pp6", "pp12"],
  pesce: ["pp1", "pp2", "pp3", "pp4", "pp5"],
  uova: ["pp11"],
  formaggio: ["pp7", "pp8", "pp9", "pp10"],
};
const CENA_PER_CAT = {
  legumi: ["cp14", "ci3"],
  carne_bianca: ["cp1", "cp2"],
  pesce: ["cp4", "cp5", "cp6", "cp7", "cp8", "cp9", "cp10", "cp11"],
  uova: ["cp3", "ci2"],
  formaggio: ["cp12", "cp13", "ci1"],
};
const CARB_CEREALI = ["pc1", "pc2", "pc3", "pc4", "pc5", "pc6", "pc7", "pc8", "pc9", "pc10"];
/* Weights follow the nutritionist's own words: whole-kernel grains first
   ("il grano saraceno e il top"), single-ingredient pasta next. */
const PESO_CARB = { pc8: 3, pc7: 2.5, pc9: 2.5, pc10: 2.5, pc6: 2, pc5: 2, pc1: 2, pc2: 2, pc3: 1.6, pc4: 1.4 };
const PESO_COLAZIONE = { c1: 2, c4: 2, c5: 1.5, c3: 1.5, c2: 1, c6: 1 };
/* Omega-3 rich fish a little more often: the plan names fish and omega-3 for inflammation. */
const PESO_PESCE_CENA = { cp11: 1.6, cp9: 1.6, cp6: 1.2, cp8: 1.2, cp4: 1, cp5: 1, cp7: 1, cp10: 0.6 };

const VARIANTI = {
  cp1: ["pollo", "tacchino", "coniglio"],
  cp2: ["vitello", "maiale"],
  cp4: ["polpo_crudo", "polpo_cotto"],
  cp14: ["legumi_secchi", "legumi_scolati"],
};
const PANE_CENA = ["pane_gf", "gallette", "patate"];

/* ---------------------------------------------------------------- dates */
export function isoData(d) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
export function aggiungiGiorni(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const x = new Date(y, m - 1, d + n, 12);
  return isoData(x);
}
export function lunediDi(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const x = new Date(y, m - 1, d, 12);
  const dow = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - dow);
  return isoData(x);
}
export function giorniTra(a, b) {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

/* ------------------------------------------------------- what is eaten */
function vociOpzione(id) {
  return (OPZ[id] ? OPZ[id].voci : []).map((v) => ({ ...v }));
}

/* Lines of one meal with the chosen variant resolved. */
export function vociPasto(giorno, pasto) {
  const p = giorno[pasto];
  if (!p) return [];
  if (pasto === "pranzo") {
    if (p.tipo === "combinato") {
      return vociOpzione(p.id).map((v) => (v.a === "cereali_sg" && p.carbVariante ? { ...OPZ[p.carbVariante].voci[0], nota: v.testo } : v));
    }
    return [...vociOpzione(p.carb), ...vociOpzione(p.prot), ...PRANZO.contorno.map((v) => ({ ...v }))];
  }
  if (pasto === "cena") {
    if (p.tipo === "idea") {
      return vociOpzione(p.id).map((v) => (v.a === "cereali_sg" && p.carbVariante ? { ...OPZ[p.carbVariante].voci[0], q: v.q, nota: v.testo } : v));
    }
    const prot = vociOpzione(p.prot).map((v, i) => {
      if (i === 0 && p.variante && v.o) {
        const alt = [v, ...v.o].find((x) => x.a === p.variante);
        if (alt) return { ...alt, o: [v, ...v.o].filter((x) => x.a !== p.variante).map(({ o, ...r }) => r) };
      }
      return v;
    });
    const verd = p.verdure === "minestrone" ? { a: "minestrone", q: 300, u: "g" } : { a: "verdure", q: 300, u: "g" };
    const pane = p.pane === "patate" ? { a: "patate", q: 200, u: "g" } : p.pane === "gallette" ? { a: "gallette_saraceno", q: 5, u: "pz", o: [{ a: "gallette_riso", q: 5, u: "pz" }] } : { a: "pane_gf", q: 60, u: "g" };
    return [...prot, verd, { a: "olio_evo", q: 10, u: "g" }, pane];
  }
  return vociOpzione(p.id);
}

export function alimentiPasto(giorno, pasto) {
  const out = new Set();
  for (const v of vociPasto(giorno, pasto)) {
    out.add(v.a);
    for (const c of v.con || []) out.add(c);
  }
  return [...out];
}

export function categoriaPasto(giorno, pasto) {
  const p = giorno[pasto];
  if (!p) return null;
  return p.cat === undefined ? null : p.cat;
}

/* --------------------------------------------------- category vectors */
function vettori(categorie, giorni, intervalli, extra = {}) {
  const out = [];
  const rec = (i, resto, acc) => {
    if (i === categorie.length - 1) {
      const v = { ...acc, [categorie[i]]: resto };
      const ok = categorie.every((c) => {
        const tot = v[c] + (extra[c] || 0);
        const [lo, hi] = intervalli[c];
        return tot >= lo && tot <= hi;
      });
      if (ok) out.push(v);
      return;
    }
    for (let n = 0; n <= resto; n++) rec(i + 1, resto - n, { ...acc, [categorie[i]]: n });
  };
  rec(0, giorni, {});
  return out;
}

export function vettoriPranzo(catCombinato) {
  const giorni = catCombinato === undefined ? 7 : 6;
  const extra = catCombinato ? { [catCombinato]: 1 } : {};
  return vettori(CAT_PRANZO, giorni, FREQUENZE_IDEALI.pranzo, extra);
}
export function vettoriCena() {
  return vettori(CAT_CENA, 7, FREQUENZE_IDEALI.cena);
}

/* ------------------------------------------------------------ helpers */
/* Move the days of categories with no options left to those that have some. */
function riequilibra(R, vettore, categorie, disponibili) {
  const v = { ...vettore };
  let liberi = 0;
  for (const c of categorie) if (!disponibili.includes(c) && v[c]) { liberi += v[c]; v[c] = 0; }
  if (!liberi) return v;
  const alt = categorie.filter((c) => disponibili.includes(c));
  if (!alt.length) return null;
  for (let i = 0; i < liberi; i++) { const c = R.pick(alt); v[c] = (v[c] || 0) + 1; }
  return v;
}
function escluso(id, pref) {
  const ex = new Set(pref.escludi || []);
  if (!ex.size) return false;
  const o = OPZ[id];
  if (!o) return false;
  /* An option is excluded only if every alternative of its main line is excluded. */
  return o.voci.some((v) => {
    const tutte = [v.a, ...(v.con || []), ...(v.o || []).map((x) => x.a)];
    return tutte.every((a) => ex.has(a));
  });
}

function scegliSequenza(R, ids, n, pesi, maxVolte, pref) {
  const usati = {};
  const seq = [];
  for (let i = 0; i < n; i++) {
    const possibili = ids.filter((id) => !escluso(id, pref) && (usati[id] || 0) < maxVolte && id !== seq[i - 1]);
    const lista = possibili.length ? possibili : ids.filter((id) => !escluso(id, pref));
    if (!lista.length) return null;
    const id = R.weighted(lista, (x) => (pesi[x] || 1) / (1 + 2 * (usati[x] || 0)));
    usati[id] = (usati[id] || 0) + 1;
    seq.push(id);
  }
  return seq;
}

function contaInSettimana(giorni, pasto, pred) {
  return giorni.filter((g) => g[pasto] && pred(g[pasto], g)).length;
}

/* -------------------------------------------------------------- attempt */
function tentativo(R, inizio, storia, pref, seguenti = []) {
  const giorni = Array.from({ length: 7 }, (_, i) => ({ data: aggiungiGiorni(inizio, i) }));

  /* LUNCH */
  let comb = null;
  const vuoleComb = pref.combinato === "sempre" ? true : pref.combinato === "mai" ? false : R.next() < 0.35;
  if (vuoleComb) {
    const ammessi = PRANZO.combinati.opzioni.map((o) => o.id).filter((id) => !escluso(id, pref));
    if (ammessi.length) comb = R.pick(ammessi);
  }
  const catComb = comb ? OPZ[comb].cat : undefined;
  const vett = vettoriPranzo(comb ? catComb : undefined);
  if (!vett.length) return null;
  /* Foods she does not eat can empty a whole category (no cheese at all): its
     days go to the categories that still have options. The ideal frequencies
     are then missed on purpose and the council says so; hard limits still hold. */
  const dispPranzo = CAT_PRANZO.filter((c) => PRANZO_PER_CAT[c].some((id) => !escluso(id, pref)));
  const v = riequilibra(R, R.pick(vett), CAT_PRANZO, dispPranzo);
  if (!v) return null;
  let cats = [];
  for (const c of CAT_PRANZO) for (let i = 0; i < v[c]; i++) cats.push(c);
  cats = R.shuffle(cats);
  const giornoComb = comb ? R.int(7) : -1;
  const catPerGiorno = [];
  let k = 0;
  for (let i = 0; i < 7; i++) catPerGiorno.push(i === giornoComb ? "COMB" : cats[k++]);

  const composti = [...Array(7).keys()].filter((i) => i !== giornoComb);
  const giorniLegumi = R.shuffle(composti).slice(0, 2);

  const usoProt = {};
  let tonno = 0, salmoneAff = 0, ragu = 0;
  if (comb === "pa2" || comb === "pa3") tonno += 1;
  for (let i = 0; i < 7; i++) {
    if (i === giornoComb) {
      giorni[i].pranzo = { tipo: "combinato", id: comb, cat: catComb, carbVariante: R.pick(CARB_CEREALI) };
      continue;
    }
    const c = catPerGiorno[i];
    const candidati = PRANZO_PER_CAT[c].filter((id) => {
      if (escluso(id, pref)) return false;
      if (id === "pp1" && tonno >= 2) return false;
      if (id === "pp2" && salmoneAff >= 1) return false;
      if (id === "pp12" && ragu >= 1) return false;
      return true;
    });
    if (!candidati.length) return null;
    const prot = R.weighted(candidati, (id) => (id === "pp12" ? 0.5 : 1) / (1 + 3 * (usoProt[id] || 0)));
    usoProt[prot] = (usoProt[prot] || 0) + 1;
    if (prot === "pp1") tonno++;
    if (prot === "pp2") salmoneAff++;
    if (prot === "pp12") ragu++;
    giorni[i].pranzo = { tipo: "composto", prot, cat: c, carb: null, legumi: giorniLegumi.includes(i) };
  }
  if (escluso("pc11", pref) && giorniLegumi.length) return null;
  const nonLegumi = composti.filter((i) => !giorniLegumi.includes(i));
  const seqCarb = scegliSequenza(R, CARB_CEREALI, nonLegumi.length, PESO_CARB, 2, pref);
  if (!seqCarb) return null;
  nonLegumi.forEach((i, j) => { giorni[i].pranzo.carb = seqCarb[j]; });
  giorniLegumi.forEach((i) => { giorni[i].pranzo.carb = "pc11"; });

  /* DINNER */
  const vc = vettoriCena();
  const dispCena = CAT_CENA.filter((c) => (c === "legumi" ? ["cp14", "ci3"] : c === "uova" ? ["cp3", "ci2"] : c === "formaggio" ? ["cp12", "cp13", "ci1"] : c === "carne_bianca" ? ["cp1", "cp2"] : CENA_PER_CAT.pesce).some((id) => !escluso(id, pref)));
  const w = riequilibra(R, R.pick(vc), CAT_CENA, dispCena);
  if (!w) return null;
  let cc = [];
  for (const c of CAT_CENA) for (let i = 0; i < w[c]; i++) cc.push(c);
  cc = R.shuffle(cc);
  let spada = 0, vitMai = 0;
  const usoCena = {};
  /* Omelette roll (ci2): at most once every 14 days, looking back at earlier
     weeks and ahead at weeks already planned (the next week exists from Saturday). */
  const frittateFuori = [...(storia || []), ...(seguenti || [])].flatMap((s) => (s.giorni || []).filter((g) => g.cena && g.cena.tipo === "idea" && g.cena.id === "ci2").map((g) => g.data));
  const frittataVicina = (data) => frittateFuori.some((x) => Math.abs(giorniTra(x, data)) < 14);
  let frittata = 0, piadina = 0, paneIdx = R.int(3);
  for (let i = 0; i < 7; i++) {
    const c = cc[i];
    let scelta;
    if (c === "legumi") {
      const opz = ["cp14", "ci3"].filter((id) => !escluso(id, pref));
      if (!opz.length) return null;
      scelta = opz.length === 2 ? (R.next() < 0.45 ? "ci3" : "cp14") : opz[0];
    } else if (c === "uova") {
      const puoFrittata = !frittataVicina(giorni[i].data) && frittata === 0 && !escluso("ci2", pref);
      scelta = puoFrittata && R.next() < 0.3 ? "ci2" : "cp3";
      if (escluso(scelta, pref)) return null;
    } else if (c === "formaggio") {
      const opz = ["cp12", "cp13"].filter((id) => !escluso(id, pref));
      const puoPiadina = piadina === 0 && !escluso("ci1", pref);
      scelta = puoPiadina && (R.next() < 0.35 || !opz.length) ? "ci1" : opz.length ? R.pick(opz) : null;
      if (!scelta) return null;
    } else if (c === "carne_bianca") {
      const puoVit = vitMai === 0 && !escluso("cp2", pref);
      scelta = puoVit && (R.next() < 0.25 || escluso("cp1", pref)) ? "cp2" : "cp1";
      if (escluso(scelta, pref)) return null;
    } else {
      const opz = CENA_PER_CAT.pesce.filter((id) => !escluso(id, pref) && !(id === "cp10" && spada >= 1) && (usoCena[id] || 0) < 2);
      if (!opz.length) return null;
      scelta = R.weighted(opz, (id) => (PESO_PESCE_CENA[id] || 1) / (1 + 3 * (usoCena[id] || 0)));
    }
    usoCena[scelta] = (usoCena[scelta] || 0) + 1;
    if (scelta === "cp10") spada++;
    if (scelta === "cp2") vitMai++;
    if (scelta === "ci2") frittata++;
    if (scelta === "ci1") piadina++;
    if (scelta.startsWith("ci")) {
      giorni[i].cena = { tipo: "idea", id: scelta, cat: c };
      if (scelta === "ci3") giorni[i].cena.carbVariante = R.pick(CARB_CEREALI);
    } else {
      const varianti = (VARIANTI[scelta] || []).filter((a) => !(pref.escludi || []).includes(a));
      giorni[i].cena = {
        tipo: "composto", prot: scelta, cat: c,
        variante: varianti.length ? R.pick(varianti) : null,
        pane: PANE_CENA[(paneIdx++) % 3],
        verdure: R.next() < 0.25 ? "minestrone" : "verdure",
      };
    }
  }

  /* BREAKFAST, SNACK, AFTER DINNER */
  const col = scegliSequenza(R, COLAZIONE.opzioni.map((o) => o.id), 7, PESO_COLAZIONE, 2, pref);
  if (!col) return null;
  col.forEach((id, i) => { giorni[i].colazione = { tipo: "opzione", id }; });
  if (pref.spuntino !== false) {
    const s = scegliSequenza(R, SPUNTINO.opzioni.map((o) => o.id), 7, {}, 2, pref);
    if (s) s.forEach((id, i) => { giorni[i].spuntino = { tipo: "opzione", id }; });
  }
  if (pref.dopocena !== false) {
    const d = scegliSequenza(R, DOPOCENA.opzioni.map((o) => o.id), 7, {}, 2, pref);
    if (d) d.forEach((id, i) => { giorni[i].dopocena = { tipo: "opzione", id }; });
  }
  return giorni;
}

/* Lower is better. Variety and spreading, never correctness: correctness is
   checked separately and a wrong week is never returned. */
export function penalita(giorni) {
  let p = 0;
  for (let i = 0; i < giorni.length; i++) {
    const g = giorni[i], prec = giorni[i - 1];
    const cp = famiglia(g.pranzo && g.pranzo.cat), cc = famiglia(g.cena && g.cena.cat);
    if (prec) {
      if (cp && cp === famiglia(prec.pranzo && prec.pranzo.cat)) p += 2;
      if (cc && cc === famiglia(prec.cena && prec.cena.cat)) p += 2;
      if (g.pranzo && g.pranzo.legumi && prec.pranzo && prec.pranzo.legumi) p += 1;
    }
    if (cp && cc && cp === cc) p += 3;
    if (g.pranzo && g.pranzo.legumi && g.cena && g.cena.cat === "legumi") p += 6;
    const aP = new Set(alimentiPasto(g, "pranzo").filter((a) => ALIMENTI[a] && ALIMENTI[a].cat));
    for (const a of alimentiPasto(g, "cena")) if (aP.has(a)) p += 6;
  }
  return p;
}

/* -------------------------------------------------------------- public */
/* The weeks around a week: the two before it (storia) and the two already
   planned after it (seguenti). Limits with a window longer than a week
   (omelette roll: once every 14 days) look both ways. */
export function vicine(settimane, inizio) {
  return {
    storia: (settimane || []).filter((x) => x.inizio < inizio).slice(-2),
    seguenti: (settimane || []).filter((x) => x.inizio > inizio).slice(0, 2),
  };
}

export function generaSettimana({ seme, inizio, storia = [], seguenti = [], pref = {}, tentativi = 160 }) {
  const R = rng(seme);
  let migliore = null, ripiego = null;
  for (let t = 0; t < tentativi; t++) {
    const giorni = tentativo(R, inizio, storia, pref, seguenti);
    if (!giorni) continue;
    const sett = { versione: 1, seme, inizio, giorni };
    const val = validaSettimana(sett, storia, seguenti);
    /* Ideal frequencies are preferred, not required: with foods excluded they
       can be impossible, and the council then shows what is missed. */
    const pen = penalita(giorni) + (val.idealeOk ? 0 : 1000);
    if (val.ok) {
      if (!migliore || pen < migliore.pen) migliore = { sett, pen };
      if (pen === 0) break;
    } else if (!ripiego || pen < ripiego.pen) ripiego = { sett, pen };
  }
  const scelta = migliore || ripiego;
  if (!scelta) return { errore: "nessuna_settimana", seme, inizio };
  scelta.sett.penalita = scelta.pen;
  /* Only when her exclusions make a hard limit impossible (no legumes at all, say). */
  if (!migliore) scelta.sett.limitiRotti = true;
  return scelta.sett;
}

/* Counts used by the validator, the council and the UI. */
export function conteggi(sett) {
  const g = sett.giorni;
  const c = { pranzo: {}, cena: {}, legumiPranzo: 0, combinati: 0 };
  for (const d of g) {
    if (d.pranzo) {
      if (d.pranzo.cat) c.pranzo[d.pranzo.cat] = (c.pranzo[d.pranzo.cat] || 0) + 1;
      if (d.pranzo.tipo === "composto" && d.pranzo.carb === "pc11") c.legumiPranzo++;
      if (d.pranzo.tipo === "combinato") c.combinati++;
    }
    if (d.cena && d.cena.cat) c.cena[d.cena.cat] = (c.cena[d.cena.cat] || 0) + 1;
  }
  c.pranzo.legumi = c.legumiPranzo;
  return c;
}

export function validaSettimana(sett, storia = [], seguenti = []) {
  const checks = [];
  const g = sett.giorni || [];
  const add = (x) => checks.push(x);

  /* Structure */
  const strutturaOk = g.length === 7 && g.every((d) => d.colazione && d.pranzo && d.cena && OPZ[d.colazione.id]
    && (d.pranzo.tipo === "combinato" ? !!OPZ[d.pranzo.id] : !!(OPZ[d.pranzo.carb] && OPZ[d.pranzo.prot]))
    && (d.cena.tipo === "idea" ? !!OPZ[d.cena.id] : !!OPZ[d.cena.prot]));
  add({ id: "struttura", livello: "struttura", ok: strutturaOk, it: "Ogni giorno ha colazione, pranzo e cena del piano", en: "Every day has breakfast, lunch and dinner from the plan" });

  /* Hard limits */
  const tutte = [...(storia || []).flatMap((s) => s.giorni || []), ...g, ...(seguenti || []).flatMap((s) => s.giorni || [])];
  const qui = new Set(g.map((d) => d.data));
  for (const L of LIMITI) {
    let n = 0;
    const occorrenze = [];
    for (const d of g) {
      const p = d[L.pasto];
      if (!p) continue;
      let hit = false;
      if (L.alimenti) hit = alimentiPasto(d, L.pasto).some((a) => L.alimenti.includes(a));
      else if (L.cat) hit = L.pasto === "pranzo" ? p.tipo === "composto" && p.carb === "pc11" : p.cat === L.cat;
      else if (L.combinato) hit = p.tipo === "combinato";
      else if (L.opzione) hit = (p.tipo === "idea" && p.id === L.opzione);
      if (hit) { n++; occorrenze.push(d.data); }
    }
    let ok, valore = n, atteso;
    if (L.esattamente !== undefined) { ok = n === L.esattamente; atteso = `= ${L.esattamente}`; }
    else if (L.periodoGiorni > 7) {
      /* Sliding window in both directions: earlier weeks (storia) and weeks
         already planned after this one (seguenti). Only pairs that touch
         this week count against it. */
      const tutteOcc = tutte.filter((d) => d[L.pasto] && d[L.pasto].tipo === "idea" && d[L.pasto].id === L.opzione).map((d) => d.data);
      const uniche = [...new Set(tutteOcc)].sort();
      ok = uniche.every((a, i) => i === 0 || giorniTra(uniche[i - 1], a) >= L.periodoGiorni || (!qui.has(a) && !qui.has(uniche[i - 1])));
      atteso = `<= ${L.max} / ${L.periodoGiorni} gg`;
    } else { ok = n <= L.max; atteso = `<= ${L.max}`; }
    add({ id: "limite_" + L.id, livello: "limite", ok, valore, atteso, it: L.it, en: L.en, giorni: occorrenze });
  }

  /* Ideal frequencies ("Sarebbe perfetto") */
  const c = conteggi(sett);
  let idealeOk = true;
  for (const pasto of ["pranzo", "cena"]) {
    for (const [cat, [lo, hi]] of Object.entries(FREQUENZE_IDEALI[pasto])) {
      const n = c[pasto][cat] || 0;
      const ok = n >= lo && n <= hi;
      if (!ok) idealeOk = false;
      add({ id: `ideale_${pasto}_${cat}`, livello: "ideale", ok, valore: n, atteso: lo === hi ? `= ${lo}` : `${lo}-${hi}`, it: `${pasto === "pranzo" ? "Pranzo" : "Cena"}: ${ETICHETTE_CAT[cat].it}`, en: `${pasto === "pranzo" ? "Lunch" : "Dinner"}: ${ETICHETTE_CAT[cat].en}` });
    }
  }

  const ok = checks.filter((x) => x.livello !== "ideale").every((x) => x.ok);
  return { ok, idealeOk, checks };
}

export const ETICHETTE_CAT = {
  legumi: { it: "legumi", en: "legumes" },
  carne: { it: "carne", en: "meat" },
  carne_bianca: { it: "carne bianca", en: "white meat" },
  pesce: { it: "pesce", en: "fish" },
  uova: { it: "uova", en: "eggs" },
  formaggio: { it: "formaggio", en: "cheese" },
};

/* Shuffle one meal and keep the week valid. Tries random replacements and
   keeps the first one that passes every hard limit and every ideal target. */
export function rimescolaPasto(sett, indice, pasto, seme, storia = [], pref = {}, seguenti = []) {
  const R = rng(seme);
  const originale = JSON.stringify(sett.giorni[indice][pasto]);
  const candidati = candidatiPasto(sett, indice, pasto, pref);
  for (const c of R.shuffle(candidati)) {
    if (JSON.stringify(c) === originale) continue;
    const prova = JSON.parse(JSON.stringify(sett));
    prova.giorni[indice][pasto] = c;
    const val = validaSettimana(prova, storia, seguenti);
    if (val.ok && val.idealeOk) return prova;
  }
  return null;
}

function candidatiPasto(sett, indice, pasto, pref) {
  const out = [];
  if (pasto === "colazione" || pasto === "spuntino" || pasto === "dopocena") {
    const src = pasto === "colazione" ? COLAZIONE : pasto === "spuntino" ? SPUNTINO : DOPOCENA;
    const usati = {};
    sett.giorni.forEach((d, i) => { if (i !== indice && d[pasto]) usati[d[pasto].id] = (usati[d[pasto].id] || 0) + 1; });
    for (const o of src.opzioni) if (!escluso(o.id, pref) && (usati[o.id] || 0) < 2) out.push({ tipo: "opzione", id: o.id });
    return out;
  }
  if (pasto === "pranzo") {
    const att = sett.giorni[indice].pranzo;
    const carbs = att.tipo === "composto" && att.carb === "pc11" ? ["pc11"] : CARB_CEREALI;
    for (const cat of CAT_PRANZO) for (const prot of PRANZO_PER_CAT[cat]) for (const carb of carbs) {
      if (escluso(prot, pref) || escluso(carb, pref)) continue;
      out.push({ tipo: "composto", prot, cat, carb, legumi: carb === "pc11" });
    }
    for (const o of PRANZO.combinati.opzioni) if (!escluso(o.id, pref) && att.carb !== "pc11") out.push({ tipo: "combinato", id: o.id, cat: o.cat, carbVariante: CARB_CEREALI[(indice * 3) % 10] });
    return out;
  }
  const att = sett.giorni[indice].cena;
  for (const cat of CAT_CENA) for (const id of CENA_PER_CAT[cat]) {
    if (escluso(id, pref)) continue;
    if (id.startsWith("ci")) out.push({ tipo: "idea", id, cat, ...(id === "ci3" ? { carbVariante: CARB_CEREALI[indice % 10] } : {}) });
    else {
      const varianti = VARIANTI[id] || [null];
      for (const variante of varianti) out.push({ tipo: "composto", prot: id, cat, variante, pane: att.pane || "pane_gf", verdure: att.verdure || "verdure" });
    }
  }
  return out;
}

export function scambiaGiorni(sett, i, j) {
  const s = JSON.parse(JSON.stringify(sett));
  const di = s.giorni[i].data, dj = s.giorni[j].data;
  [s.giorni[i], s.giorni[j]] = [s.giorni[j], s.giorni[i]];
  s.giorni[i].data = di;
  s.giorni[j].data = dj;
  return s;
}

/* The plan allows swapping lunch and dinner on a day ("e sempre possibile
   invertire il pranzo con la cena"). The meals keep their slot for counting. */
export function invertiPranzoCena(sett, i) {
  const s = JSON.parse(JSON.stringify(sett));
  s.giorni[i].invertito = !s.giorni[i].invertito;
  return s;
}
