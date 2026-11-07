/*
 * I miei cibi: add a food (the brain judges it and computes its portion),
 * the list of foods she added, and the foods she does not eat.
 */
import { S, cambia } from "../store.js";
import { L, lingua, t } from "../i18n.js";
import { I, esc, num } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, ridisegna, toast } from "../ctx.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { AGENTI } from "../engine/consiglio.js";
import { valutaAlimento, CLASSI } from "../engine/cervello.js";
import { caricaTabella, cercaCiqual, cercaPiano, cercaOnline } from "../engine/ricerca.js";
import { generaSettimana, isoData, lunediDi } from "../engine/planner.js";
import { renaleFuoriRange } from "../engine/salute.js";
import { nomePasto } from "./diario.js";
import { hash } from "../engine/rng.js";

let q = "", generici = [], online = { stato: "fermo", lista: [], q: "" }, scelto = null, cercaId = 0;

const LIVELLI = {
  si: { it: "Approvato", en: "Approved", ico: "ok", classe: "ok" },
  medio: { it: "Con attenzione", en: "With care", ico: "avviso", classe: "attenzione" },
  no: { it: "Non adatto", en: "Not suitable", ico: "no", classe: "male" },
};
export function badge(livello) {
  const x = LIVELLI[livello] || LIVELLI.medio;
  return `<span class="stato ${x.classe}">${I[x.ico]}${esc(L(x))}</span>`;
}
const ctx = (s) => ({ profilo: s.profilo, renaleFuoriRange: renaleFuoriRange(s, isoData(new Date())) });
/* The verdict now, with her current profile (medicines change it): never the one stored when the food was added. */
export const livelloAttuale = (x, s = S()) => valutaAlimento(x, ctx(s)).livello;
const idPer = (c) => "mio-" + c.fonte + "-" + (c.codice || hash(c.nome).toString(36));

/* ------------------------------------------------------------ render */
export function render(s) {
  return `${cartaCerca(s)}${cartaMiei(s)}${cartaNonMangio(s)}`;
}

function rigaRisultato(c, s, src, i) {
  const v = valutaAlimento(c, ctx(s));
  const k = c.per100 && c.per100.kcal != null ? `${num(c.per100.kcal)} kcal/100 g` : t("infoMancante");
  return `<div class="voce risultato" data-az="apriVerdetto" data-src="${src}" data-i="${i}" role="button" tabindex="0">
    <div><div><strong>${esc(c.nome)}</strong>${c.marca ? ` <span class="minimo">${esc(c.marca)}</span>` : ""}</div>
    <div class="minimo">${esc(c.fonte === "ciqual" ? c.nomeEn : c.quantita || "")} · ${esc(k)} · ${esc(L(CLASSI[v.classe] || CLASSI.altro))}</div></div>
    ${badge(v.livello)}</div>`;
}

function cartaCerca(s) {
  const n = q.trim();
  const piano = n.length >= 2 ? cercaPiano(n) : [];
  let risultati = "";
  if (n.length >= 2) {
    risultati += piano.length ? `<h4 class="sotto-tit">${esc(L({ it: "Già nel tuo piano", en: "Already in your plan" }))}</h4>${piano.map((x) => `<div class="voce"><div><strong>${esc(L(x))}</strong><div class="minimo">${esc(L({ it: "Le dosi sono quelle del piano: vedi Scambi.", en: "Amounts are the plan's: see Swaps." }))}</div></div>${badge("si")}</div>`).join("")}` : "";
    risultati += `<h4 class="sotto-tit">${esc(L({ it: "Alimenti generici (tabella CIQUAL, senza rete)", en: "Generic foods (CIQUAL table, offline)" }))}</h4>`
      + (generici.length && generici[0].parziale ? `<div class="avviso">${I.avviso}<div class="piccolo">${esc(L({ it: "Nessun alimento per tutta la frase: questi risultati sono per una parola sola. Controlla che sia il cibo giusto.", en: "Nothing for the whole phrase: these results are for a single word. Check it is the right food." }))}</div></div>` : "")
      + (generici.length ? generici.map((c, i) => rigaRisultato(c, s, "g", i)).join("") : `<p class="minimo">${esc(L({ it: "Nessun alimento generico con questo nome.", en: "No generic food with this name." }))}</p>`);
    risultati += `<h4 class="sotto-tit">${esc(L({ it: "Confezioni (Open Food Facts)", en: "Packaged foods (Open Food Facts)" }))}</h4>`;
    if (online.stato === "fermo" || online.q !== n) risultati += `<button class="btn piccolo" data-az="cercaOnlineMiei">${I.globo}${esc(L({ it: "Cerca le confezioni online", en: "Search packages online" }))}</button><p class="minimo">${esc(L({ it: "Invia solo il nome del cibo al server dell'app.", en: "Sends only the food name to the app's server." }))}</p>`;
    else if (online.stato === "carico") risultati += `<p class="minimo">${esc(L({ it: "Cerco...", en: "Searching..." }))}</p>`;
    else if (online.stato === "errore") risultati += `<p class="minimo">${esc(L({ it: "Open Food Facts non è raggiungibile ora. Riprova più tardi: la tabella CIQUAL qui sopra funziona anche senza rete.", en: "Open Food Facts is not reachable now. Try again later: the CIQUAL table above works offline too." }))}</p>`;
    else risultati += online.lista.length ? online.lista.map((c, i) => rigaRisultato(c, s, "o", i)).join("") + `<p class="minimo">${esc(L({ it: "Dati collaborativi di Open Food Facts (licenza ODbL): controlla sempre l'etichetta.", en: "Collaborative data from Open Food Facts (ODbL licence): always check the label." }))}</p>` : `<p class="minimo">${esc(L({ it: "Nessuna confezione trovata.", en: "No package found." }))}</p>`;
  }
  return `<section class="card"><h3>${esc(L({ it: "Aggiungi un cibo", en: "Add a food" }))}</h3>
    <p class="piccolo muted">${esc(L({ it: "Scrivi un cibo: il consiglio controlla glutine, lupus, piano e reni, poi calcola quanto ne puoi mangiare al posto di una porzione del piano, con le stesse calorie.", en: "Type a food: the council checks gluten, lupus, plan and kidneys, then works out how much you can eat instead of a plan portion, with the same calories." }))}</p>
    <input id="cerca-miei" class="cerca" type="search" placeholder="${esc(L({ it: "es. tempeh, finocchio, pistacchi", en: "e.g. tempeh, fennel, pistachios" }))}" value="${esc(q)}" data-input="cercaMiei" aria-label="${esc(L({ it: "Cerca un cibo", en: "Search a food" }))}">
    ${risultati}</section>`;
}

function cartaMiei(s) {
  const miei = Object.values(s.alimentiExtra || {});
  if (!miei.length) return "";
  return `<section class="card"><h3>${esc(L({ it: "I miei cibi", en: "My foods" }))} <span class="num">${miei.length}</span></h3>
    ${miei.map((x) => {
      const v = valutaAlimento(x, ctx(s));
      const p = v.porzioni.map((y) => `${nomePasto(y.pasto)} ${y.q} g`).join(" · ");
      return `<div class="voce"><div data-az="apriVerdettoMio" data-id="${esc(x.id)}" role="button" tabindex="0"><strong>${esc(x.nome)}</strong><div class="minimo">${esc(L(CLASSI[v.classe] || CLASSI.altro))}${p ? " · " + esc(p) : ""}</div></div>
        <div class="riga">${badge(v.livello)}<button class="icon-btn mini" data-az="togliMio" data-id="${esc(x.id)}" aria-label="${esc(L({ it: "Togli", en: "Remove" }))}">${I.chiudi}</button></div></div>`;
    }).join("")}
    <p class="minimo">${esc(L({ it: "Li trovi in Componi e nel diario, con la loro porzione. Il verdetto si aggiorna se cambi i farmaci nel profilo.", en: "You find them in Compose and in the diary, with their portion. The verdict updates if you change the medicines in your profile." }))}</p></section>`;
}

/* ------------------------------------------------------ do not eat */
const NON_ESCLUDIBILI = new Set(["verdure", "frutta", "olio_evo", "acqua", "limone", "cannella", "passata"]);
const GRUPPI = [
  ["formaggi", { it: "Formaggi", en: "Cheese" }], ["latticini", { it: "Latte e yogurt", en: "Milk and yogurt" }], ["pesce", { it: "Pesce", en: "Fish" }],
  ["carne", { it: "Carne", en: "Meat" }], ["uova", { it: "Uova", en: "Eggs" }], ["legumi", { it: "Legumi", en: "Legumes" }],
  ["frutta_secca", { it: "Frutta secca", en: "Nuts" }], ["dolci", { it: "Cioccolato, miele, marmellata", en: "Chocolate, honey, jam" }],
  ["cereali", { it: "Cereali e pasta", en: "Grains and pasta" }], ["pane", { it: "Pane, gallette, patate", en: "Bread, rice cakes, potatoes" }],
];
const cibiDelGruppo = (g) => Object.entries(ALIMENTI).filter(([id, a]) => a.gruppo === g && !NON_ESCLUDIBILI.has(id)).map(([id]) => id);

function cartaNonMangio(s) {
  const ex = new Set(s.pref.escludi || []);
  const prova = ex.size ? generaSettimana({ seme: 7, inizio: lunediDi(isoData(new Date())), pref: s.pref, tentativi: 60 }) : null;
  return `<section class="card"><h3>${esc(L({ it: "Non mangio", en: "I don't eat" }))} <span class="num">${ex.size}</span></h3>
    <p class="piccolo muted">${esc(L({ it: "Togli quello che non ti piace o non mangi: il rimescolo e Componi lo evitano, restando nei limiti del piano.", en: "Remove what you don't like or don't eat: shuffling and Compose avoid it, within the plan's limits." }))}</p>
    ${prova && prova.errore ? `<div class="avviso terra">${I.avviso}<div>${esc(["legumi_secchi", "legumi_scolati"].every((id) => ex.has(id))
      ? L({ it: "I legumi non si possono togliere: il piano li chiede 2 volte a pranzo e 1 a cena ogni settimana. Parlane con la nutrizionista.", en: "Legumes cannot be removed: the plan asks for them twice at lunch and once at dinner every week. Talk to the nutritionist." })
      : L({ it: "Con queste esclusioni il piano non riesce a comporre una settimana che rispetti tutti i limiti. Togline qualcuna.", en: "With these exclusions the plan cannot build a week that keeps every limit. Remove some." }))}</div></div>` : ""}
    ${prova && !prova.errore && prova.penalita >= 1000 ? `<p class="minimo">${esc(L({ it: "Senza questi cibi alcune frequenze ideali del piano (per esempio il formaggio 2 volte a pranzo) non si possono rispettare: il consiglio te lo segnala, i limiti veri restano.", en: "Without these foods some of the plan's ideal frequencies (cheese twice at lunch, for example) cannot be met: the council flags it, the real limits stay." }))}</p>` : ""}
    ${GRUPPI.map(([g, lab]) => {
      const ids = cibiDelGruppo(g);
      if (!ids.length) return "";
      const tutti = ids.every((id) => ex.has(id));
      const alcuni = ids.filter((id) => ex.has(id)).length;
      return `<details class="gruppo-non"><summary><span>${esc(L(lab))}</span><span class="minimo">${alcuni ? `${alcuni}/${ids.length}` : ""}</span></summary>
        <div class="interruttore"><span><strong>${esc(L({ it: "Tutto il gruppo", en: "The whole group" }))}</strong></span><input type="checkbox" ${tutti ? "checked" : ""} data-cambia="escludiGruppo" data-g="${g}"></div>
        ${ids.map((id) => `<div class="interruttore"><span>${esc(nome(id, lingua()))}</span><input type="checkbox" ${ex.has(id) ? "checked" : ""} data-cambia="escludiCibo" data-a="${id}"></div>`).join("")}</details>`;
    }).join("")}
    ${ex.size ? `<button class="btn piccolo" data-az="rimescolaSettimana" data-inizio="${lunediDi(isoData(new Date()))}">${I.rimescola}${esc(L({ it: "Rifai questa settimana senza questi cibi", en: "Redo this week without these foods" }))}</button>` : ""}
  </section>`;
}

/* ----------------------------------------------------------- verdict */
function foglioVerdetto() {
  const s = S();
  const c = scelto;
  if (!c) return "";
  const v = valutaAlimento(c, ctx(s));
  const giaMio = !!(s.alimentiExtra || {})[c.id || idPer(c)];
  const p = c.per100 || {};
  const riga = (lab, val, u) => (val == null ? "" : `<tr><td>${esc(lab)}</td><td>${esc(num(val, val < 10 ? 1 : 0))} ${u}</td></tr>`);
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <div class="minimo">${esc(c.fonte === "ciqual" ? "CIQUAL 2020" : c.fonte === "off" ? "Open Food Facts" : "")}${c.marca ? " · " + esc(c.marca) : ""}</div>
    <h2>${esc(c.nome)}</h2>
    ${c.nomeEn ? `<div class="minimo">${esc(c.nomeEn)}</div>` : ""}
    <div class="verdetto-grande ${v.livello}" data-s="sd6f2a">${badge(v.livello)}<span class="minimo">${esc(L(CLASSI[v.classe] || CLASSI.altro))}</span></div>
    ${v.porzioni.length ? `<h3 data-s="s56f43">${esc(L({ it: "Quanto ne puoi mangiare", en: "How much you can eat" }))}</h3><ul class="lista-ingr">${v.porzioni.map((y) => `<li><div><div>${esc(nomePasto(y.pasto))}</div><div class="minimo">${esc(L(y.come))}${y.kcal ? ` · ${num(y.kcal)} kcal · ${L({ it: "proteine", en: "protein" })} ${num(y.prot, 1)} g` : ""}</div></div><span class="q">${y.q} ${y.u}</span></li>`).join("")}</ul>` : `<p class="piccolo muted">${esc(v.livello === "no" ? L({ it: "Nessuna porzione: il consiglio lo sconsiglia.", en: "No portion: the council advises against it." }) : t("infoMancante"))}</p>`}
    <h3>${esc(L({ it: "Il consiglio", en: "The council" }))}</h3>
    ${v.seggi.map((x) => { const a = AGENTI.find((y) => y.id === x.agente); return `<div class="seggio"><div class="sigillo ${x.livello}" aria-hidden="true">${{ ok: "✓", nota: "i", adatta: "~", veto: "×" }[x.livello]}</div><div><strong>${esc(L(a.nome))}</strong>${x.motivi.length ? `<ul>${x.motivi.map((m) => `<li>${esc(L(m))}${m.fonte === "piano" ? ` <span class="minimo">(${esc(L({ it: "piano", en: "plan" }))})</span>` : m.fonte === "app" ? ` <span class="minimo">(${esc(L({ it: "suggerimento dell'app, da confermare con la nutrizionista", en: "the app's suggestion, to confirm with the nutritionist" }))})</span>` : ""}</li>`).join("")}</ul>` : `<div class="piccolo muted">${esc(L({ it: "Nessun rilievo", en: "No findings" }))}</div>`}</div></div>`; }).join("")}
    <details><summary class="piccolo"><strong>${esc(L({ it: "Valori per 100 g", en: "Values per 100 g" }))}</strong></summary><table class="tabella">${riga("kcal", p.kcal, "")}${riga(L({ it: "Proteine", en: "Protein" }), p.prot, "g")}${riga(L({ it: "Carboidrati", en: "Carbohydrate" }), p.carb, "g")}${riga(L({ it: "di cui zuccheri", en: "of which sugars" }), p.sug, "g")}${riga(L({ it: "Grassi", en: "Fat" }), p.fat, "g")}${riga(L({ it: "Fibre", en: "Fibre" }), p.fib, "g")}${riga(L({ it: "Sale", en: "Salt" }), p.salt, "g")}${riga(L({ it: "Potassio", en: "Potassium" }), p.k, "mg")}${riga(L({ it: "Fosforo", en: "Phosphorus" }), p.p, "mg")}</table>
    ${c.ingredienti ? `<p class="minimo">${esc(L({ it: "Ingredienti", en: "Ingredients" }))}: ${esc(c.ingredienti)}</p>` : ""}</details>
    ${v.livello !== "no" && !giaMio ? `<button class="btn primario pieno" data-az="aggiungiMio">${I.piu}${esc(L({ it: "Aggiungi ai miei cibi", en: "Add to my foods" }))}</button>` : giaMio ? `<p class="piccolo">${I.ok} ${esc(L({ it: "È già tra i tuoi cibi.", en: "Already in your foods." }))}</p>` : ""}`;
}

async function aggiornaGenerici() {
  const mio = ++cercaId;
  const n = q.trim();
  if (n.length < 2) { generici = []; ridisegna(); return; }
  const tab = await caricaTabella();
  if (mio !== cercaId) return;
  generici = cercaCiqual(n, tab, 6);
  ridisegna();
  const c = document.getElementById("cerca-miei");
  if (c && document.activeElement !== c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); }
}

let timer = null;
registra({
  cercaMiei: (d, el) => { q = el.value; clearTimeout(timer); timer = setTimeout(aggiornaGenerici, 250); },
  cercaOnlineMiei: async () => {
    const n = q.trim();
    if (n.length < 2) return;
    online = { stato: "carico", lista: [], q: n };
    ridisegna();
    try { online = { stato: "fatto", lista: await cercaOnline(n), q: n }; } catch (e) { online = { stato: "errore", lista: [], q: n }; }
    ridisegna();
  },
  apriVerdetto: (d) => { scelto = (d.src === "o" ? online.lista : generici)[Number(d.i)] || null; if (scelto) apriFoglio(foglioVerdetto); },
  apriVerdettoMio: (d) => { scelto = S().alimentiExtra[d.id]; if (scelto) apriFoglio(foglioVerdetto); },
  aggiungiMio: () => {
    const s = S();
    const c = scelto;
    const v = valutaAlimento(c, ctx(s));
    const id = idPer(c);
    cambia((st) => {
      st.alimentiExtra[id] = {
        id, nome: c.nome, nomeEn: c.nomeEn || null, fonte: c.fonte, codice: c.codice || null, marca: c.marca || null,
        gruppoCiqual: c.gruppoCiqual || null, categorie: c.categorie || [], allergeni: c.allergeni || [], tracce: c.tracce || [], etichette: c.etichette || [],
        ingredienti: c.ingredienti || "", per100: c.per100, stimaKcal: c.stimaKcal || 0,
        classe: v.classe, livello: v.livello, porzioni: v.porzioni.map((p) => ({ pasto: p.pasto, q: p.q, u: p.u, kcal: p.kcal, prot: p.prot })), aggiunto: isoData(new Date()),
      };
    });
    chiudiFoglio();
    toast(L({ it: `${c.nome}: aggiunto ai tuoi cibi`, en: `${c.nome}: added to your foods` }));
  },
  togliMio: (d) => cambia((s) => { delete s.alimentiExtra[d.id]; }),
  escludiGruppo: (d, el) => cambia((s) => {
    const set = new Set(s.pref.escludi || []);
    for (const id of cibiDelGruppo(d.g)) { if (el.checked) set.add(id); else set.delete(id); }
    s.pref.escludi = [...set];
  }),
  escludiCibo: (d, el) => cambia((s) => {
    const set = new Set(s.pref.escludi || []);
    if (el.checked) set.add(d.a); else set.delete(d.a);
    s.pref.escludi = [...set];
  }),
});
void ridisegna;
