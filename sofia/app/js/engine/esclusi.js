/*
 * Ingredients Sofia removed (state: pref.escludi).
 *
 * Two kinds of ids live in the same list:
 *   - plan foods (ALIMENTI ids: salmone, ricotta_light, ...): the planner
 *     avoids them when it builds or redoes a week;
 *   - single vegetables and fruits (VERDURE / FRUTTA ids: peperoni, mela):
 *     the plan writes "verdure 300 g" and "frutta" as a free choice, so a
 *     removed vegetable leaves the plan as it is and disappears from every
 *     place that offers a choice (Registra, Componi, Idee) and from the
 *     recipes that name it in their text ("pomodorini, peperoni, cetrioli").
 *
 * One module decides whether a line, a meal or a recipe holds a removed
 * ingredient, so the week, the home page, the recipes and the ideas agree.
 */
import { ALIMENTI, nome } from "../data/alimenti.js";
import { VERDURE, FRUTTA } from "../data/scelte.js";
import { normalizza } from "../data/dizionario.js";

/* The plan's staples: generic vegetables and fruit (she picks which), oil, water, lemon, spices, passata. */
export const NON_ESCLUDIBILI = new Set(["verdure", "frutta", "olio_evo", "acqua", "limone", "cannella", "passata"]);

const SCELTE = new Map([...VERDURE.map((x) => [x.id, { ...x, tipo: "verdure" }]), ...FRUTTA.map((x) => [x.id, { ...x, tipo: "frutta" }])]);
export const eScelta = (id) => SCELTE.has(id);
export const tipoScelta = (id) => (SCELTE.get(id) || {}).tipo || null;
export const escludibile = (id) => SCELTE.has(id) || (!!ALIMENTI[id] && !NON_ESCLUDIBILI.has(id));

export function nomeEscluso(id, lingua = "it") {
  const x = SCELTE.get(id);
  return x ? (lingua === "en" ? x.en : x.it) : nome(id, lingua);
}

/* Italian singular and plural of one word (mela/mele, pomodoro/pomodori,
   peperone/peperoni), with the hard c and g kept (pesca/pesche, never
   "pesce"; mango/manghi, never "mangi"). */
function numeri(w) {
  const out = new Set([w]);
  const due = w.slice(-2), radice2 = w.slice(0, -2);
  const radice = w.slice(0, -1), fine = w.slice(-1);
  if (due === "ca" || due === "ga") out.add(radice2 + due[0] + "he");
  else if (due === "co" || due === "go") out.add(radice2 + due[0] + "hi");
  else if (w.endsWith("che") || w.endsWith("ghe")) out.add(w.slice(0, -3) + w.slice(-3, -2) + "a");
  else if (w.endsWith("chi") || w.endsWith("ghi")) out.add(w.slice(0, -3) + w.slice(-3, -2) + "o");
  else if (fine === "a") out.add(radice + "e");
  else if (due === "io") out.add(radice);
  else if (fine === "o") out.add(radice + "i");
  else if (fine === "e") { out.add(radice + "i"); out.add(radice + "a"); }
  else if (fine === "i") { out.add(radice + "o"); out.add(radice + "e"); }
  return [...out];
}

/* Extra word forms where the list name and everyday Italian differ. */
const ALTRE_FORME = {
  pomodori: ["pomodorini", "pomodorino", "pomodoro", "ciliegini", "datterini"],
  funghi: ["funghi", "fungo", "champignon"],
  cavoletti: ["cavoletti", "cavolini"],
  indivia: ["indivia"],
  cavolo_nero: ["cavolo nero", "cavolo riccio", "kale"],
  verza: ["cavolo cappuccio", "cappuccio", "verza"],
  lattuga: ["lattuga", "insalata verde"],
  mandarino: ["mandarino", "mandarini", "clementina", "clementine"],
  valeriana: ["valeriana", "songino"],
  barbabietola: ["barbabietola", "barbabietole", "rapa rossa"],
  arancia: ["arancia", "arance"],
  cachi: ["cachi", "caco", "kaki"],
  fichi: ["fichi", "fico"],
};

/* Italian forms only, checked against the Italian text: the English
   translation of the same line would only add false hits ("more"). */
const formeCache = new Map();
function forme(id) {
  if (formeCache.has(id)) return formeCache.get(id);
  const x = SCELTE.get(id);
  const set = new Set();
  if (x) {
    for (const parte of normalizza(x.it).split(" o ")) {
      const t = parte.trim();
      if (!t) continue;
      if (t.includes(" ")) set.add(t);
      else for (const f of numeri(t)) set.add(f);
    }
    for (const f of ALTRE_FORME[id] || []) set.add(normalizza(f));
  }
  /* whole words only: "mela" must not match "melanzane" */
  const re = set.size ? new RegExp(`(^|[^a-z])(${[...set].map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?=$|[^a-z])`) : null;
  formeCache.set(id, re);
  return re;
}

const testoDi = (t) => (!t ? "" : normalizza(typeof t === "string" ? t : t.it || ""));

/*
 * What the removed ingredients do to some lines (a plan meal, a logged meal
 * or a recipe):
 *   blocca: ids that make it unusable as written;
 *   menziona: ids it names but can do without.
 * Rules for the free text of vegetable and fruit lines:
 *   - "lamponi o fragole": alternatives; blocked only when every one is;
 *   - "pomodorini, peperoni, cetrioli": a mix; the others are enough, so a
 *     removed one is only mentioned ("senza peperoni"), unless all are removed;
 *   - the title names what the dish is about ("... con pollo e peperoni"):
 *     a removed item there blocks, unless its line offers a free alternative.
 */
export function analisiEsclusi(voci, escludi, titoloRicetta = null) {
  const ex = escludi instanceof Set ? escludi : new Set(escludi || []);
  const blocca = [], menziona = [];
  if (!ex.size) return { blocca, menziona };
  const metti = (lista, id) => { if (!lista.includes(id)) lista.push(id); };
  const scelteEscluse = [...ex].filter((id) => SCELTE.has(id));
  const trova = (t) => scelteEscluse.filter((id) => { const re = forme(id); return re && re.test(t); });
  const conAlternativaLibera = new Set();
  for (const v of voci || []) {
    /* a line with alternatives ("o in alternativa") is removed only when every alternative is */
    if (ex.has(v.a) && !(v.o || []).some((x) => !ex.has(x.a))) metti(blocca, v.a);
    else if (ex.has(v.a)) metti(menziona, v.a);
    for (const c of v.con || []) if (ex.has(c)) metti(blocca, c);
    if (v.scelta && ex.has(v.scelta)) metti(blocca, v.scelta);
    /* split on the raw text: normalizing turns commas into spaces */
    const grezzo = !v.testo ? "" : String(typeof v.testo === "string" ? v.testo : v.testo.it || "").toLowerCase();
    if (!grezzo || !scelteEscluse.length) continue;
    const alternative = grezzo.split(/\s(?:o|oppure)\s/).map((alt) => {
      const voci2 = alt.split(/[,;]|\se\s|\sed\s/).map((x) => normalizza(x)).filter(Boolean);
      const colpite = voci2.map(trova);
      return { trovati: colpite.flat(), bloccata: voci2.length > 0 && colpite.every((x) => x.length) };
    });
    const tutti = alternative.flatMap((a) => a.trovati);
    if (alternative.every((a) => a.bloccata)) for (const id of tutti) metti(blocca, id);
    else for (const id of tutti) {
      metti(menziona, id);
      if (alternative.some((a) => !a.trovati.includes(id) && !a.bloccata) && alternative.length > 1) conAlternativaLibera.add(id);
    }
  }
  const titolo = titoloRicetta ? testoDi(titoloRicetta) : "";
  if (titolo) for (const id of trova(titolo)) if (!conAlternativaLibera.has(id)) metti(blocca, id);
  return { blocca, menziona: menziona.filter((id) => !blocca.includes(id)) };
}

/* Removed ids that block some lines, each once, in order. */
export const trovaEsclusi = (voci, escludi, titolo = null) => analisiEsclusi(voci, escludi, titolo).blocca;

export const ricettaEsclusi = (r, escludi) => trovaEsclusi(r.ingredienti || [], escludi, r.titolo);
export const ricettaMenziona = (r, escludi) => analisiEsclusi(r.ingredienti || [], escludi, r.titolo).menziona;
