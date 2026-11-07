/* Settimana: the 7 days, the council's check, swaps between days, shopping list. */
import { S, cambia } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, giornoSett, dataBreve, maiuscola, num } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, toast } from "../ctx.js";
import { rigaPasto, titoloPasto, esitoHtml, verdettiHtml, PASTI_ORDINE } from "./comuni.js";
import { consiglioSettimana } from "../engine/consiglio.js";
import { generaSettimana, isoData, lunediDi, aggiungiGiorni, vociPasto, conteggi, scambiaGiorni, validaSettimana, vicine, rifaiDa, ETICHETTE_CAT } from "../engine/planner.js";
import { numeriSettimana, mangiatoDelGiorno, KCAL_GIORNO } from "../engine/giorno.js";
import { trovaEsclusi, escludibile, nomeEscluso, eScelta } from "../engine/esclusi.js";
import { VERDURE, FRUTTA } from "../data/scelte.js";
import { normalizza } from "../data/dizionario.js";
import { barreSettimana, barraGiorno } from "./grafici.js";
import { logDi, opzioniNutrizione, nomePasto } from "./diario.js";
import { FREQUENZE_IDEALI } from "../data/piano.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { nuovoSeme } from "../engine/rng.js";
import { renaleFuoriRange } from "../engine/salute.js";

let vista = null;
let aperto = null;
let qTogli = "";          /* search in "Togli ingredienti" */
let appenaTolto = null;   /* the chip just removed lights up */
let primaDelRifai = null; /* the week before "redo from today", for Undo */
const gruppiAperti = new Set(); /* "Verdure" / "Frutta" lists stay open while she removes from them */
let prova = { chiave: null, esito: null };

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
  const opz = opzioniNutrizione(s);
  return nav + cartaNumeri(s, w, oggi) + cartaTogli(s, w, oggi) + `
  <div class="riga wrap" data-s="sda12f">
    <button class="btn primario" data-az="rimescolaSettimana" data-inizio="${w.inizio}">${I.rimescola}${esc(t("rimescolaSettimana"))}</button>
    <button class="btn" data-az="listaSpesa" data-inizio="${w.inizio}">${I.carrello}${esc(t("listaSpesa"))}</button>
  </div>
  <div data-s="s56f43">
  ${w.giorni.map((g, i) => {
    const eOggi = g.data === oggi;
    const espanso = aperto === g.data;
    const m = g.data <= oggi ? mangiatoDelGiorno(logDi(s, g.data), opz) : null;
    return `<article class="giorno ${eOggi ? "oggi" : ""}">
      <div class="testa" data-az="apriGiorno" data-data="${g.data}" role="button" tabindex="0" aria-expanded="${espanso}">
        <span class="data">${esc(maiuscola(giornoSett(g.data, true)))} <span class="minimo">${esc(dataBreve(g.data))}</span></span>
        <span class="minimo">${eOggi ? esc(L({ it: "oggi", en: "today" })) : ""}${g.invertito ? " · " + esc(t("invertito")) : ""}</span>
      </div>
      ${m && m.voci ? barraGiorno(g.data, m.kcal, KCAL_GIORNO) : g.data < oggi ? `<div class="minimo giorno-vuoto">${esc(L({ it: "Niente registrato", en: "Nothing logged" }))}</div>` : ""}
      ${espanso ? `<div data-s="sfe7b4">${(g.invertito ? ["colazione", "spuntino", "cena", "pranzo", "dopocena"] : PASTI_ORDINE).map((p) => rigaPasto(g, p)).join("")}
        <div class="riga wrap" data-s="s8a77e">${i < 6 ? `<button class="btn piccolo" data-az="scambiaGiorno" data-inizio="${w.inizio}" data-i="${i}">${I.scambio}${esc(L({ it: "Scambia con il giorno dopo", en: "Swap with the next day" }))}</button>` : ""}</div></div>`
      : `<dl class="mini"><dt>${esc(L({ it: "Pranzo", en: "Lunch" }))}</dt><dd>${g.pranzo.cat ? `<span class="cat ${g.pranzo.cat}">${esc(L(ETICHETTE_CAT[g.pranzo.cat]).charAt(0).toUpperCase())}</span>` : ""}${esc(titoloPasto(g, "pranzo"))}</dd><dt>${esc(L({ it: "Cena", en: "Dinner" }))}</dt><dd>${g.cena.cat ? `<span class="cat ${g.cena.cat}">${esc(L(ETICHETTE_CAT[g.cena.cat]).charAt(0).toUpperCase())}</span>` : ""}${esc(titoloPasto(g, "cena"))}</dd></dl>`}
    </article>`;
  }).join("")}
  </div>
  <section class="card consiglio">
    <div class="riga tra"><h3>${esc(L({ it: "Controllo del consiglio", en: "Council check" }))}</h3>${esitoHtml(dec.esito)}</div>
    <div class="contatori" data-s="s8a77e">${contatori}</div>
    <details data-s="s8a77e"><summary class="piccolo"><strong>${esc(t("verdetti"))}</strong></summary>${verdettiHtml(dec)}</details>
    ${w.automatica ? `<p class="minimo">${esc(L({ it: "Creata in automatico. Ogni rimescolo viene ricontrollato.", en: "Created automatically. Every shuffle is checked again." }))}</p>` : ""}
  </section>
  <p class="minimo" data-s="sd2c17"><span class="cat pesce">P</span>${esc(L({ it: "pesce", en: "fish" }))} <span class="cat carne">C</span>${esc(L({ it: "carne", en: "meat" }))} <span class="cat uova">U</span>${esc(L({ it: "uova", en: "eggs" }))} <span class="cat formaggio">F</span>${esc(L({ it: "formaggio", en: "cheese" }))} <span class="cat legumi">L</span>${esc(L({ it: "legumi", en: "legumes" }))}</p>`;
}

/* ------------------------------------------------ the week in numbers */
function cartaNumeri(s, w, oggi) {
  const opz = opzioniNutrizione(s);
  const n = numeriSettimana(w.giorni, (d) => logDi(s, d), opz, oggi);
  const prima = w.giorni[0].data > oggi;
  const nomiVuoti = n.vuoti.map((d) => `${giornoSett(d, true)} ${dataBreve(d)}`).join(", ");
  return `<section class="card numeri-sett">
    <div class="riga tra"><h3>${esc(L({ it: "Mangiato e quanto resta", en: "Eaten and left" }))}</h3><span class="minimo">${esc(prima ? L({ it: "settimana che viene", en: "week ahead" }) : L({ it: `${n.registrati} ${n.registrati === 1 ? "giorno registrato" : "giorni registrati"}`, en: `${n.registrati} ${n.registrati === 1 ? "day logged" : "days logged"}` }))}</span></div>
    ${barreSettimana(n.righe)}
    <p class="minimo">${esc(L({ it: "Obiettivi dal piano: 1400 kcal al giorno, i grammi di proteine, carboidrati e grassi dei pasti, le verdure e la frutta dei pasti dei giorni contati. La tacca segna il minimo. Il piano resta giornaliero: quello che resta non va recuperato in un giorno solo.", en: "Targets from the plan: 1400 kcal a day, the protein, carbohydrate and fat grams of the meals, the vegetables and fruit of the counted days' meals. The tick marks the minimum. The plan stays daily: what is left is not to be caught up in one day." }))}</p>
    ${n.vuoti.length ? `<p class="minimo">${esc(L({ it: `Non contano (nessun pasto registrato, dati mancanti): ${nomiVuoti}.`, en: `Not counted (nothing logged, information missing): ${nomiVuoti}.` }))}</p>` : ""}
    ${!n.completo ? `<p class="minimo">${esc(L({ it: "Alcuni cibi registrati non hanno tutti i valori: i numeri mangiati sono un minimo.", en: "Some logged foods lack values: the eaten numbers are a minimum." }))}</p>` : ""}
    ${n.senzaGruppo ? `<p class="minimo">${esc(L({ it: `${n.senzaGruppo} cibi confezionati senza gruppo non contano tra verdure e frutta.`, en: `${n.senzaGruppo} packaged foods with no group do not count as vegetables or fruit.` }))}</p>` : ""}
  </section>`;
}

/* ------------------------------------------------- remove ingredients */
const nomeT = (id) => nomeEscluso(id, lingua());

function suggerimentiTogli(q, ex) {
  const n = normalizza(q);
  if (n.length < 2) return [];
  const out = [];
  for (const x of [...VERDURE, ...FRUTTA]) if (!ex.has(x.id) && (normalizza(x.it).includes(n) || normalizza(x.en).includes(n))) out.push(x.id);
  for (const [id, a] of Object.entries(ALIMENTI)) if (escludibile(id) && !ex.has(id) && (normalizza(a.it).includes(n) || normalizza(a.en).includes(n))) out.push(id);
  return out.slice(0, 14);
}

/* Meals from today on that hold a removed ingredient. */
function pastiColpiti(s, w, oggi) {
  const ex = new Set(s.pref.escludi || []);
  const out = [];
  if (!ex.size) return out;
  for (const g of w.giorni) {
    if (g.data < oggi) continue;
    for (const p of PASTI_ORDINE) if (g[p]) { const t = trovaEsclusi(vociPasto(g, p), ex); if (t.length) out.push({ data: g.data, pasto: p, t }); }
  }
  return out;
}

/* Can the planner still build a week with these exclusions? (cached: it builds one) */
function esclusioniPossibili(s) {
  const pianoEx = (s.pref.escludi || []).filter((id) => !eScelta(id)).sort();
  if (!pianoEx.length) return { ok: true };
  const chiave = pianoEx.join(",");
  if (prova.chiave !== chiave) {
    const w = generaSettimana({ seme: 7, inizio: lunediDi(isoData(new Date())), pref: s.pref, tentativi: 60 });
    prova = { chiave, esito: w.errore ? { ok: false, legumi: ["legumi_secchi", "legumi_scolati"].every((id) => pianoEx.includes(id)) } : { ok: !w.limitiRotti } };
  }
  return prova.esito;
}

function cartaTogli(s, w, oggi) {
  const ex = new Set(s.pref.escludi || []);
  const prossimi = new Map();
  for (const g of w.giorni) {
    if (g.data < oggi) continue;
    for (const p of PASTI_ORDINE) if (g[p]) for (const v of vociPasto(g, p)) for (const a of [v.a, ...(v.con || [])]) if (escludibile(a) && !ex.has(a)) prossimi.set(a, (prossimi.get(a) || 0) + 1);
  }
  const colpiti = pastiColpiti(s, w, oggi);
  const sugg = suggerimentiTogli(qTogli, ex);
  const possibile = esclusioniPossibili(s);
  const chipTogli = (id, gruppo = "") => `<button class="chip" data-az="togliIngrediente" data-id="${esc(id)}"${gruppo ? ` data-gruppo="${gruppo}"` : ""}>${I.meno}${esc(nomeT(id))}</button>`;
  const verdureLibere = VERDURE.filter((x) => !ex.has(x.id)), fruttaLibera = FRUTTA.filter((x) => !ex.has(x.id));
  return `<section class="card togli" id="togli-ingredienti">
    <div class="riga tra"><h3>${esc(L({ it: "Togli ingredienti", en: "Remove ingredients" }))}</h3><span class="minimo">${esc(L({ it: `${ex.size} ${ex.size === 1 ? "tolto" : "tolti"}`, en: `${ex.size} removed` }))}</span></div>
    <p class="piccolo muted">${esc(L({ it: "Quello che togli non ti viene più proposto: i giorni da oggi si rifanno senza, e Registra, Componi e Idee non lo mostrano. Verdure e frutta nel piano sono a scelta: togli quelle che non mangi e scegli tra le altre.", en: "What you remove is no longer offered: the days from today are redone without it, and Log, Compose and Ideas do not show it. Vegetables and fruit in the plan are your choice: remove the ones you don't eat and pick among the others." }))}</p>
    <div class="scelte" aria-live="polite">${[...ex].map((id) => `<span class="chip attivo ${appenaTolto === id ? "appena" : ""}">${esc(nomeT(id))}<button class="chip-x" data-az="rimettiIngrediente" data-id="${esc(id)}" aria-label="${esc(L({ it: `Rimetti ${nomeT(id)}`, en: `Put back ${nomeT(id)}` }))}">${I.chiudi}</button></span>`).join("") || `<span class="minimo">${esc(L({ it: "Nessun ingrediente tolto.", en: "No ingredient removed." }))}</span>`}</div>
    ${!possibile.ok ? `<div class="avviso terra">${I.avviso}<div>${esc(possibile.legumi
      ? L({ it: "I legumi non si possono togliere tutti: il piano li chiede 2 volte a pranzo e 1 a cena ogni settimana. Parlane con la nutrizionista.", en: "Legumes cannot all be removed: the plan asks for them twice at lunch and once at dinner every week. Talk to the nutritionist." })
      : L({ it: "Con questi ingredienti tolti il piano non riesce a comporre una settimana che rispetti tutti i limiti. Rimettine qualcuno.", en: "With these ingredients removed the plan cannot build a week that keeps every limit. Put some back." }))}</div></div>` : ""}
    ${colpiti.length ? `<div class="avviso terra">${I.avviso}<div>
      <div><strong>${esc(L({ it: `${colpiti.length} ${colpiti.length === 1 ? "pasto" : "pasti"} da oggi ${colpiti.length === 1 ? "ha" : "hanno"} ingredienti che hai tolto`, en: `${colpiti.length} ${colpiti.length === 1 ? "meal" : "meals"} from today ${colpiti.length === 1 ? "has" : "have"} ingredients you removed` }))}</strong></div>
      <ul class="colpiti">${colpiti.slice(0, 8).map((c) => `<li>${esc(maiuscola(giornoSett(c.data, true)))} · ${esc(nomePasto(c.pasto))}: ${esc(c.t.map(nomeT).join(", "))}</li>`).join("")}</ul>
      <button class="btn primario piccolo" data-az="rifaiDaOggi" data-inizio="${w.inizio}">${I.rimescola}${esc(L({ it: "Rifai i giorni da oggi senza", en: "Redo the days from today without them" }))}</button>
      <div class="minimo">${esc(L({ it: "I giorni passati e i pasti già registrati restano come sono.", en: "Past days and meals already logged stay as they are." }))}</div>
    </div></div>` : ex.size ? `<p class="stato ok mini">${I.ok}${esc(L({ it: "Nessun pasto da oggi a domenica contiene ingredienti tolti.", en: "No meal from today to Sunday holds a removed ingredient." }))}</p>` : ""}
    <input class="cerca" type="search" id="cerca-togli" placeholder="${esc(L({ it: "Cerca cosa togliere (es. peperoni, salmone, ricotta)", en: "Search what to remove (e.g. peppers, salmon)" }))}" value="${esc(qTogli)}" data-input="togliCerca" aria-label="${esc(L({ it: "Cerca un ingrediente da togliere", en: "Search an ingredient to remove" }))}">
    ${qTogli.trim().length >= 2 ? (sugg.length ? `<div class="scelte">${sugg.map(chipTogli).join("")}</div>` : `<p class="minimo">${esc(L({ it: "Nessun ingrediente del piano, verdura o frutto con questo nome.", en: "No plan ingredient, vegetable or fruit with this name." }))}</p>`) : `
      ${prossimi.size ? `<details class="togli-gruppo" data-gruppo="piano" ${gruppiAperti.has("piano") ? "open" : ""}><summary>${esc(L({ it: `Nel piano da oggi a domenica (${prossimi.size})`, en: `In the plan from today to Sunday (${prossimi.size})` }))}</summary><div class="scelte">${[...prossimi.keys()].sort((a, b) => nomeT(a).localeCompare(nomeT(b))).map((id) => chipTogli(id, "piano")).join("")}</div></details>` : ""}
      <details class="togli-gruppo" data-gruppo="verdure" ${gruppiAperti.has("verdure") ? "open" : ""}><summary>${esc(L({ it: `Verdure (${verdureLibere.length})`, en: `Vegetables (${verdureLibere.length})` }))}</summary><div class="scelte">${verdureLibere.map((x) => chipTogli(x.id, "verdure")).join("")}</div></details>
      <details class="togli-gruppo" data-gruppo="frutta" ${gruppiAperti.has("frutta") ? "open" : ""}><summary>${esc(L({ it: `Frutta (${fruttaLibera.length})`, en: `Fruit (${fruttaLibera.length})` }))}</summary><div class="scelte">${fruttaLibera.map((x) => chipTogli(x.id, "frutta")).join("")}</div></details>`}
  </section>`;
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

function rimettiFuocoTogli() {
  const c = document.getElementById("cerca-togli");
  if (c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); }
}

/* Redo the days from today without the removed ingredients; past days stay. */
function rifaiDaOggiOra(inizio) {
  const s = S();
  const k = s.settimane.findIndex((x) => x.inizio === inizio);
  if (k < 0) return;
  const oggi = isoData(new Date());
  const vecchia = s.settimane[k];
  const { storia, seguenti } = vicine(s.settimane, inizio);
  const semi = Array.from({ length: 40 }, () => nuovoSeme());
  /* today's meals already logged stay as they were planned */
  const logOggi = logDi(s, oggi);
  const nuova = rifaiDa(vecchia, oggi, { storia, seguenti, pref: s.pref, semi, tieni: (data, p) => !!logOggi[p] });
  if (!nuova) {
    toast(L({ it: "Tenendo i giorni passati non trovo una combinazione che rispetti tutti i limiti: rimescola tutta la settimana.", en: "Keeping the past days I find no combination within every limit: shuffle the whole week." }));
    return;
  }
  primaDelRifai = { inizio, w: JSON.parse(JSON.stringify(vecchia)) };
  nuova.creata = new Date().toISOString();
  cambia((st) => { st.settimane[k] = nuova; });
  const rimasti = pastiColpiti(S(), nuova, oggi).length;
  toast(rimasti ? L({ it: `Giorni da oggi rifatti. ${rimasti} pasti non hanno alternative senza questi ingredienti.`, en: `Days from today redone. ${rimasti} meals have no alternative without these ingredients.` })
    : L({ it: "Giorni da oggi rifatti senza gli ingredienti tolti.", en: "Days from today redone without the removed ingredients." }), { az: "annullaRifai", testo: L({ it: "Annulla", en: "Undo" }) });
}

registra({
  togliCerca: (d, el) => { qTogli = el.value; cambia(() => {}); rimettiFuocoTogli(); },
  togliIngrediente: (d) => {
    const id = d.id;
    if (!id) return;
    appenaTolto = id; qTogli = "";
    if (d.gruppo) gruppiAperti.add(d.gruppo);
    cambia((st) => { const set = new Set(st.pref.escludi || []); set.add(id); st.pref.escludi = [...set]; });
    toast(L({ it: `Tolto: ${nomeT(id)}`, en: `Removed: ${nomeT(id)}` }), { az: "rimettiIngrediente", testo: L({ it: "Annulla", en: "Undo" }), id });
    setTimeout(() => { if (appenaTolto === id) appenaTolto = null; }, 3000);
  },
  rimettiIngrediente: (d) => {
    const id = d.id;
    if (!id) return;
    cambia((st) => { st.pref.escludi = (st.pref.escludi || []).filter((x) => x !== id); });
    if (appenaTolto === id) appenaTolto = null;
    toast(L({ it: `Rimesso: ${nomeT(id)}`, en: `Put back: ${nomeT(id)}` }));
  },
  rifaiDaOggi: (d) => rifaiDaOggiOra(d.inizio),
  annullaRifai: () => {
    if (!primaDelRifai) return;
    const { inizio, w } = primaDelRifai;
    primaDelRifai = null;
    cambia((st) => { const k = st.settimane.findIndex((x) => x.inizio === inizio); if (k >= 0) st.settimane[k] = w; });
    toast(L({ it: "Settimana com'era prima", en: "Week as it was" }));
  },
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
