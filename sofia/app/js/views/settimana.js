/* Settimana: the 7 days, the council's check, swaps between days, shopping list. */
import { S, cambia } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, giornoSett, dataBreve, maiuscola, num } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, toast } from "../ctx.js";
import { rigaPasto, titoloPasto, esitoHtml, verdettiHtml, PASTI_ORDINE } from "./comuni.js";
import { consiglioSettimana } from "../engine/consiglio.js";
import { generaSettimana, isoData, lunediDi, aggiungiGiorni, vociPasto, conteggi, scambiaGiorni, validaSettimana, vicine, ETICHETTE_CAT } from "../engine/planner.js";
import { FREQUENZE_IDEALI } from "../data/piano.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { nuovoSeme } from "../engine/rng.js";
import { renaleFuoriRange } from "../engine/salute.js";

let vista = null;
let aperto = null;

function settimanaCorrente(s) {
  const lun = vista || lunediDi(isoData(new Date()));
  return s.settimane.find((w) => w.inizio === lun) || null;
}

export const sottotitolo = (s) => {
  const lun = vista || lunediDi(isoData(new Date()));
  return esc(`${dataBreve(lun)} - ${dataBreve(aggiungiGiorni(lun, 6))}`);
};

export function render(s) {
  const lun = vista || lunediDi(isoData(new Date()));
  const w = settimanaCorrente(s);
  const oggi = isoData(new Date());
  const indice = s.settimane.findIndex((x) => x.inizio === lun);
  const nav = `<div class="riga tra" data-s="sda12f">
    <button class="btn piccolo" data-az="settNav" data-d="-7" ${indice <= 0 && !s.settimane.some((x) => x.inizio < lun) ? "disabled" : ""}>${I.indietro}${esc(L({ it: "Prima", en: "Earlier" }))}</button>
    <button class="btn piccolo" data-az="settNav" data-d="0">${esc(L({ it: "Questa", en: "This one" }))}</button>
    <button class="btn piccolo" data-az="settNav" data-d="7">${esc(L({ it: "Dopo", en: "Later" }))}${I.freccia}</button></div>`;
  if (!w) {
    return nav + `<div class="card vuoto"><div class="grande">${esc(t("nessunaSettimana"))}</div><p>${esc(L({ it: "Le settimane si creano da sole: quella attuale all'apertura, la successiva dal sabato.", en: "Weeks create themselves: the current one on opening, the next one from Saturday." }))}</p><button class="btn primario" data-az="creaSettimana" data-inizio="${lun}">${I.rimescola}${esc(t("creaSettimana"))}</button></div>`;
  }
  const { storia, seguenti } = vicine(s.settimane, w.inizio);
  const dec = consiglioSettimana(w, storia, { renaleFuoriRange: renaleFuoriRange(s, oggi), profilo: s.profilo, seguenti });
  const c = conteggi(w);
  const contatori = ["pranzo", "cena"].map((p) => Object.entries(FREQUENZE_IDEALI[p]).map(([cat, [lo, hi]]) => {
    const n = c[p][cat] || 0;
    const ok = n >= lo && n <= hi;
    return `<span>${esc(L({ it: p === "pranzo" ? "Pranzo" : "Cena", en: p === "pranzo" ? "Lunch" : "Dinner" }))}: <span class="cat ${cat}">${esc(L(ETICHETTE_CAT[cat]).charAt(0).toUpperCase())}</span>${esc(L(ETICHETTE_CAT[cat]))}</span><span class="${ok ? "ok" : "no"}">${n} / ${lo === hi ? lo : `${lo}-${hi}`} ${ok ? "✓" : "×"}</span>`;
  }).join("")).join("");
  return nav + `
  <div class="riga wrap" data-s="sda12f">
    <button class="btn primario" data-az="rimescolaSettimana" data-inizio="${w.inizio}">${I.rimescola}${esc(t("rimescolaSettimana"))}</button>
    <button class="btn" data-az="listaSpesa" data-inizio="${w.inizio}">${I.carrello}${esc(t("listaSpesa"))}</button>
  </div>
  <section class="card consiglio">
    <div class="riga tra"><h3>${esc(L({ it: "Controllo del consiglio", en: "Council check" }))}</h3>${esitoHtml(dec.esito)}</div>
    <div class="contatori" data-s="s8a77e">${contatori}</div>
    <details data-s="s8a77e"><summary class="piccolo"><strong>${esc(t("verdetti"))}</strong></summary>${verdettiHtml(dec)}</details>
    ${w.automatica ? `<p class="minimo">${esc(L({ it: "Creata in automatico. Ogni rimescolo viene ricontrollato.", en: "Created automatically. Every shuffle is checked again." }))}</p>` : ""}
  </section>
  <div data-s="s56f43">
  ${w.giorni.map((g, i) => {
    const eOggi = g.data === oggi;
    const espanso = aperto === g.data;
    return `<article class="giorno ${eOggi ? "oggi" : ""}">
      <div class="testa" data-az="apriGiorno" data-data="${g.data}" role="button" tabindex="0" aria-expanded="${espanso}">
        <span class="data">${esc(maiuscola(giornoSett(g.data, true)))} <span class="minimo">${esc(dataBreve(g.data))}</span></span>
        <span class="minimo">${eOggi ? esc(L({ it: "oggi", en: "today" })) : ""}${g.invertito ? " · " + esc(t("invertito")) : ""}</span>
      </div>
      ${espanso ? `<div data-s="sfe7b4">${(g.invertito ? ["colazione", "spuntino", "cena", "pranzo", "dopocena"] : PASTI_ORDINE).map((p) => rigaPasto(g, p)).join("")}
        <div class="riga wrap" data-s="s8a77e">${i < 6 ? `<button class="btn piccolo" data-az="scambiaGiorno" data-inizio="${w.inizio}" data-i="${i}">${I.scambio}${esc(L({ it: "Scambia con il giorno dopo", en: "Swap with the next day" }))}</button>` : ""}</div></div>`
      : `<dl class="mini"><dt>${esc(L({ it: "Pranzo", en: "Lunch" }))}</dt><dd>${g.pranzo.cat ? `<span class="cat ${g.pranzo.cat}">${esc(L(ETICHETTE_CAT[g.pranzo.cat]).charAt(0).toUpperCase())}</span>` : ""}${esc(titoloPasto(g, "pranzo"))}</dd><dt>${esc(L({ it: "Cena", en: "Dinner" }))}</dt><dd>${g.cena.cat ? `<span class="cat ${g.cena.cat}">${esc(L(ETICHETTE_CAT[g.cena.cat]).charAt(0).toUpperCase())}</span>` : ""}${esc(titoloPasto(g, "cena"))}</dd></dl>`}
    </article>`;
  }).join("")}
  </div>
  <p class="minimo" data-s="sd2c17"><span class="cat pesce">P</span>${esc(L({ it: "pesce", en: "fish" }))} <span class="cat carne">C</span>${esc(L({ it: "carne", en: "meat" }))} <span class="cat uova">U</span>${esc(L({ it: "uova", en: "eggs" }))} <span class="cat formaggio">F</span>${esc(L({ it: "formaggio", en: "cheese" }))} <span class="cat legumi">L</span>${esc(L({ it: "legumi", en: "legumes" }))}</p>`;
}

function listaSpesa(w) {
  const s = S();
  const somma = new Map();
  let condiviso = false;
  for (const g of w.giorni) for (const p of PASTI_ORDINE) {
    if (!g[p]) continue;
    /* a shared amount ("10 g tra avena e cioccolato") counts whole for each food: the list shows a maximum */
    for (const v of vociPasto(g, p)) for (const a of [v.a, ...(v.con || [])]) {
      if (v.con) condiviso = true;
      if (v.q == null || v.u === "q.b.") { if (!somma.has(a + "|qb")) somma.set(a + "|qb", { a, u: "q.b.", q: null }); continue; }
      const q = Array.isArray(v.q) ? v.q[1] : v.q;
      const k = a + "|" + v.u;
      const x = somma.get(k) || { a, u: v.u, q: 0 };
      x.q += q;
      somma.set(k, x);
    }
  }
  const righe = [...somma.values()].sort((a, b) => ((ALIMENTI[a.a] || {}).gruppo || "").localeCompare((ALIMENTI[b.a] || {}).gruppo || "") || nome(a.a).localeCompare(nome(b.a)));
  const fmt = (x) => x.u === "q.b." ? (lingua() === "en" ? "as needed" : "q.b.") : x.u === "g" && x.q >= 1000 ? `${num(x.q / 1000, 2)} kg` : x.u === "ml" && x.q >= 1000 ? `${num(x.q / 1000, 2)} L` : `${num(x.q)} ${x.u === "pz" ? (lingua() === "en" ? "pcs" : "pz") : x.u}`;
  void s;
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <h2>${esc(t("listaSpesa"))}</h2>
    <p class="piccolo muted">${esc(L({ it: "Somma dei 7 giorni, pesi a crudo. Per le verdure e la frutta scegli quelle di stagione.", en: "Sum of the 7 days, raw weights. For vegetables and fruit choose what is in season." }))}</p>
    ${condiviso ? `<p class="piccolo muted">${esc(L({ it: "Dove il piano dà un solo peso per due alimenti (10 g tra fiocchi di avena e cioccolato) la lista conta il peso intero per ciascuno: è un massimo.", en: "Where the plan gives one weight for two foods (10 g of oat flakes and chocolate together) the list counts the whole weight for each: it is a maximum." }))}</p>` : ""}
    <ul class="spesa">${righe.map((x) => {
      const a = ALIMENTI[x.a] || {};
      const gf = a.glutine === "certificata" ? `<span class="etichetta viola">${esc(L({ it: "certificata senza glutine", en: "certified gluten free" }))}</span>` : a.glutine === "etichetta" ? `<span class="etichetta">${esc(L({ it: "senza glutine in etichetta", en: "gluten-free label" }))}</span>` : "";
      return `<li><div><div>${esc(nome(x.a, lingua()))}</div>${gf}</div><span class="q">${esc(fmt(x))}</span></li>`;
    }).join("")}</ul>
    <p class="minimo" data-s="sd2c17">${esc(L({ it: "Acqua: cerca in etichetta la dicitura \"calcica\" (calcio oltre 150 mg/l, Direttiva 2009/54/CE).", en: "Water: look for \"calcium-rich\" on the label (calcium above 150 mg/l, Directive 2009/54/EC)." }))}</p>`;
}

function rigenera(inizio) {
  const s = S();
  const { storia, seguenti } = vicine(s.settimane, inizio);
  const w = generaSettimana({ seme: nuovoSeme(), inizio, storia, seguenti, pref: s.pref });
  if (w.errore) { toast(L({ it: "Con le esclusioni impostate non esiste una settimana che rispetti tutti i limiti. Controlla le impostazioni.", en: "With the current exclusions no week keeps every limit. Check the settings." })); return; }
  w.creata = new Date().toISOString();
  cambia((st) => {
    st.settimane = st.settimane.filter((x) => x.inizio !== inizio);
    st.settimane.push(w);
    st.settimane.sort((a, b) => (a.inizio < b.inizio ? -1 : 1));
  });
  toast(L({ it: "Nuova settimana: tutti i limiti del piano rispettati", en: "New week: every plan limit kept" }));
}

registra({
  settNav: (d) => {
    const base = vista || lunediDi(isoData(new Date()));
    vista = Number(d.d) === 0 ? null : aggiungiGiorni(base, Number(d.d));
    aperto = null;
    cambia(() => {});
  },
  apriGiorno: (d) => { aperto = aperto === d.data ? null : d.data; cambia(() => {}); },
  creaSettimana: (d) => rigenera(d.inizio || lunediDi(isoData(new Date()))),
  rimescolaSettimana: (d) => {
    const s = S();
    const w = s.settimane.find((x) => x.inizio === d.inizio);
    const segnati = w && w.giorni.some((g) => s.diario[g.data] && s.diario[g.data].pasti && Object.values(s.diario[g.data].pasti).some(Boolean));
    if (!segnati) { rigenera(d.inizio); return; }
    apriFoglio(() => `<h2>${esc(t("rimescolaSettimana"))}?</h2><p>${esc(L({ it: "Hai già segnato alcuni pasti di questa settimana. Il nuovo piano li sostituisce (i segni restano nel diario).", en: "You already ticked some meals this week. The new plan replaces them (the ticks stay in the diary)." }))}</p>
      <div class="riga"><button class="btn primario" data-az="confermaRimescola" data-inizio="${d.inizio}">${I.rimescola}${esc(L({ it: "Rimescola", en: "Shuffle" }))}</button><button class="btn" data-az="chiudiFoglio">${esc(t("annulla"))}</button></div>`);
  },
  confermaRimescola: (d) => { chiudiFoglio(); rigenera(d.inizio); },
  listaSpesa: (d) => {
    const w = S().settimane.find((x) => x.inizio === d.inizio);
    if (w) apriFoglio(() => listaSpesa(w));
  },
  scambiaGiorno: (d) => {
    const s = S();
    const k = s.settimane.findIndex((x) => x.inizio === d.inizio);
    if (k < 0) return;
    const i = Number(d.i);
    const nuova = scambiaGiorni(s.settimane[k], i, i + 1);
    /* a swap must keep every hard limit, including the 14-day window across weeks */
    const { storia, seguenti } = vicine(s.settimane, d.inizio);
    if (!validaSettimana(nuova, storia, seguenti).ok) { toast(L({ it: "Questo scambio romperebbe un limite del piano: lasciato com'era.", en: "This swap would break a plan limit: left as it was." })); return; }
    cambia((st) => { st.settimane[k] = nuova; aperto = nuova.giorni[i + 1].data; });
  },
});
