/*
 * Search for a food Sofia wants to add:
 *   1. the plan's own foods (already in her plan),
 *   2. the CIQUAL 2020 table bundled with the app (generic foods, offline),
 *   3. packages from Open Food Facts through /api/alimento (online).
 * Italian words are matched to the English CIQUAL names with data/dizionario.js.
 */
import { ALIMENTI } from "../data/alimenti.js";
import { PAROLE, NOME_IT, normalizza } from "../data/dizionario.js";

let tabella = null;
export async function caricaTabella() {
  if (!tabella) {
    const m = await import("../data/ciqual.js");
    const I = Object.fromEntries(m.CAMPI.map((k, i) => [k, i]));
    tabella = { ...m, I, minuscolo: m.CIBI.map((c) => c[I.nome].toLowerCase()) };
  }
  return tabella;
}

/* Plan foods whose Italian or English name contains the query. */
export function cercaPiano(q) {
  const n = normalizza(q);
  if (n.length < 2) return [];
  return Object.entries(ALIMENTI).filter(([, a]) => normalizza(a.it).includes(n) || normalizza(a.en).includes(n)).slice(0, 6).map(([id, a]) => ({ id, ...a }));
}

/* English terms to look for: groups from the most specific (the whole Italian
   phrase) to the least (single words, then the query itself). */
export function terminiInglesi(q) {
  const n = normalizza(q);
  const gruppi = [];
  const parole = n.split(" ");
  for (let len = parole.length; len >= 1; len--) {
    const g = new Set();
    for (let i = 0; i + len <= parole.length; i++) {
      const pezzo = parole.slice(i, i + len).join(" ");
      if (PAROLE[pezzo]) PAROLE[pezzo].forEach((t) => g.add(t.toLowerCase()));
    }
    if (g.size) gruppi.push([...g]);
  }
  gruppi.push([n]);
  return gruppi;
}

const rawRe = /\braw\b/;
const PIATTO = /\b(cake|sausage|pie|sauce|soup|biscuit|ravioli|nuggets?|burger|sandwich|pizza|filled|stuffed|salad|dish|tart|quiche|flour|confectionery|praline|with (fruits?|nuts|mint|orange))\b/;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function punteggi(t, termini, q) {
  const out = [];
  const res = termini.map((term) => [term, new RegExp("(^|[ ,(])" + esc(term) + "(?![a-z])")]);
  for (let i = 0; i < t.CIBI.length; i++) {
    const nome = t.minuscolo[i];
    let s = 0;
    for (const [term, re] of res) {
      if (!re.test(nome)) continue;
      let x = nome.startsWith(term) ? 12 : 7;
      if (nome.split(",")[0].trim() === term) x += 5;
      x += term.length * 0.05;
      s = Math.max(s, x);
    }
    if (!s) continue;
    const c = t.CIBI[i];
    if (c[t.I.kcal] == null) continue;
    if (rawRe.test(nome)) s += 3;
    if (/cooked|boiled|roasted|grilled|canned|prepacked|in sauce/.test(nome)) s -= 1;
    if (PIATTO.test(nome) && !PIATTO.test(q)) s -= 7;
    if (String(c[t.I.gruppo]).startsWith("01")) s -= 3;
    s -= (nome.split(",").length - 1) * 0.6 + nome.length * 0.01;
    out.push([s, i]);
  }
  return out.sort((a, b) => b[0] - a[0]);
}
export function cercaCiqual(q, t, max = 8) {
  const n = normalizza(q);
  for (const gruppo of terminiInglesi(q)) {
    const p = punteggi(t, gruppo, n);
    if (p.length) return p.slice(0, max).map(([, i]) => daCiqual(t, i, q));
  }
  return [];
}

export function daCiqual(t, i, q = "") {
  const c = t.CIBI[i], I = t.I;
  const nomeEn = c[I.nome];
  const testa = nomeEn.split(",")[0].toLowerCase();
  const it = NOME_IT[testa] || NOME_IT[nomeEn.toLowerCase()] || null;
  const per100 = {};
  for (const k of ["kcal", "prot", "carb", "fat", "sug", "fib", "sat", "salt", "na", "k", "p", "ca", "fe", "mg", "vitc", "vitd", "b12", "fol", "epa", "dha", "ala"]) if (c[I[k]] != null) per100[k] = c[I[k]];
  const nome = it ? it.charAt(0).toUpperCase() + it.slice(1) : (q && normalizza(q) && PAROLE[normalizza(q)] ? q.charAt(0).toUpperCase() + q.slice(1) : nomeEn);
  return { fonte: "ciqual", codice: c[I.code], nomeEn, nome, gruppoCiqual: String(c[I.gruppo]), stimaKcal: c[I.stimaKcal] || 0, per100 };
}

export async function cercaOnline(q) {
  const r = await fetch("/api/alimento?q=" + encodeURIComponent(q), { cache: "no-store", credentials: "same-origin" });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const d = await r.json();
  return (d.risultati || []).map((x) => ({ ...x, nomeEn: null }));
}
