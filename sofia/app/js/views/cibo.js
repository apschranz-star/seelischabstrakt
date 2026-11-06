/* Cibo: swaps with real numbers, curated recipes with shuffle, daily web recipes, the plan's rules. */
import { S, cambia, cambiaSilenzioso } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, num, dataConAnno } from "../ui.js";
import { registra, apriFoglio, ridisegna, toast } from "../ctx.js";
import { cartaRicetta, verdettiHtml, esitoHtml, DEF } from "./comuni.js";
import { ALIMENTI, nome, SI_ANTINFIAMMATORI, NO_ANTINFIAMMATORI } from "../data/alimenti.js";
import { COLAZIONE, PRANZO, CENA, REGOLE, RENI, SENZA_DOSE, DOMANDE_APERTE, PREFERENZE_DELLA_NUTRIZIONISTA, LIMITI } from "../data/piano.js";
import { RICETTE } from "../data/ricette.js";
import { COMPOSIZIONE, NOMI_NUTRIENTI, CLINICA } from "../data/evidenze.js";
import { porzione } from "../engine/impatti.js";
import { notePersonali } from "../engine/consiglio.js";
import { rng, nuovoSeme } from "../engine/rng.js";

const SEZIONI = [["scambi", "scambi"], ["ricette", "ricette"], ["web", "dalWeb"], ["regole", "regole"]];
let filtro = "tutte", soloPreferite = false, cerca = "", pescate = nuovoSeme();

export const titolo = () => t("cibo");

export function render(s, parti) {
  const sez = SEZIONI.some(([k]) => k === parti[0]) ? parti[0] : "scambi";
  const seg = `<nav class="seg" aria-label="${esc(t("cibo"))}">${SEZIONI.map(([k, lab]) => `<button class="${sez === k ? "attivo" : ""}" data-az="vai" data-h="#/cibo/${k}" ${sez === k ? 'aria-current="page"' : ""}>${esc(t(lab))}</button>`).join("")}</nav>`;
  if (sez === "ricette") return seg + ricette(s);
  if (sez === "web") return seg + web(s);
  if (sez === "regole") return seg + regole();
  return seg + scambi();
}

export function dopo() {
  const c = document.getElementById("cerca-cibo");
  if (c && cerca && document.activeElement !== c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); }
}

/* ------------------------------------------------------------ swaps */
function voceDaOpzione(o) { return { ...o.voci[0], id: o.id, max: o.max, esattamente: o.esattamente }; }
const GRUPPI = () => [
  { id: "latte", titolo: { it: "Latte a colazione", en: "Milk at breakfast" }, voci: [{ a: "latte_ps", q: 150, u: "ml" }, { a: "kefir", q: 150, u: "ml" }, { a: "yogurt_greco", q: 120, u: "g", ognitanto: true }], nota: COLAZIONE.note[0] },
  { id: "yogurt", titolo: { it: "Yogurt a colazione", en: "Yogurt at breakfast" }, voci: [{ a: "yogurt_magro", q: 150, u: "g" }, { a: "kefir", q: 140, u: "ml" }, { a: "yogurt_greco", q: 110, u: "g", ognitanto: true }], nota: COLAZIONE.note[1] },
  { id: "cereali", titolo: { it: "Cereali della colazione, stesso peso", en: "Breakfast cereals, same weight" }, voci: ["avena", "fiocchi_saraceno", "riso_soffiato", "miglio_soffiato", "quinoa_soffiata"].map((a) => ({ a, q: 25, u: "g", esempio: true })), nota: COLAZIONE.note[3] },
  { id: "pane_col", titolo: { it: "Pane a colazione", en: "Bread at breakfast" }, voci: [{ a: "pane_gf", q: 30, u: "g" }, { a: "gallette_saraceno", q: 2, u: "pz" }, { a: "gallette_riso", q: 2, u: "pz" }] },
  { id: "carb", titolo: { it: "Carboidrati del pranzo, peso a crudo", en: "Lunch carbohydrates, raw weight" }, voci: PRANZO.carboidrati.map(voceDaOpzione), nota: PRANZO.regola },
  { id: "prot_pranzo", titolo: { it: "Proteine del pranzo", en: "Lunch proteins" }, voci: PRANZO.proteine.map(voceDaOpzione) },
  { id: "prot_cena", titolo: { it: "Proteine della cena", en: "Dinner proteins" }, voci: CENA.proteine.map(voceDaOpzione) },
  { id: "pane_cena", titolo: { it: "Pane a cena", en: "Bread at dinner" }, voci: [{ a: "pane_gf", q: 60, u: "g" }, { a: "gallette_saraceno", q: 5, u: "pz" }, { a: "gallette_riso", q: 5, u: "pz" }, { a: "patate", q: 200, u: "g" }], extra: SENZA_DOSE.filter((x) => x.id === "polenta") },
  { id: "panatura", titolo: { it: "Impanare e infarinare", en: "Breading and flouring" }, voci: [{ a: "pangrattato_gf", q: 10, u: "g", testo: { it: "per panare: 10 g di pangrattato = 10 g di pane", en: "breading: 10 g breadcrumbs = 10 g bread" } }, { a: "farina_avena", q: 7, u: "g", testo: { it: "per infarinare: 7 g di farina = 10 g di pane", en: "flouring: 7 g flour = 10 g bread" } }, { a: "farina_saraceno", q: 7, u: "g" }] },
  { id: "frutta_secca", titolo: { it: "Frutta secca", en: "Nuts" }, voci: [{ a: "frutta_secca", q: 10, u: "g" }] },
];

function migliori(voci) {
  const chiavi = { epa_dha_g: { it: "il più ricco di omega-3 EPA e DHA", en: "richest in omega-3 EPA and DHA" }, fibre_g: { it: "il più ricco di fibre", en: "richest in fibre" }, calcium_mg: { it: "il più ricco di calcio", en: "richest in calcium" }, iron_mg: { it: "il più ricco di ferro", en: "richest in iron" } };
  const out = {};
  for (const [k, lab] of Object.entries(chiavi)) {
    let best = null, val = 0;
    for (const v of voci) {
      if (v.u !== "g" && v.u !== "ml") continue;
      const p = porzione(v.a, v.q);
      const x = p && p.valori[k];
      if (x != null && x > val * 1.15 && x > (k === "epa_dha_g" ? 0.05 : k === "fibre_g" ? 1 : k === "calcium_mg" ? 50 : 1)) { val = x; best = v.a + v.q; }
    }
    if (best) (out[best] = out[best] || []).push(lab);
  }
  return out;
}

function vocePorzione(v) {
  const a = ALIMENTI[v.a] || {};
  const top = PREFERENZE_DELLA_NUTRIZIONISTA.filter((p) => p.alimenti.includes(v.a));
  const lim = LIMITI.find((l) => l.alimenti && l.alimenti.includes(v.a) && (v.max || v.esattamente));
  const p = (v.u === "g" || v.u === "ml") && v.q ? porzione(v.a, v.q) : null;
  const comp = COMPOSIZIONE[v.a];
  const fonteDi = comp ? [...new Set(comp.flatMap((c) => c.fonteDi))] : [];
  const valori = p ? [
    p.valori.kcal != null ? `${num(p.valori.kcal)} kcal` : null,
    p.valori.protein_g != null ? `${num(p.valori.protein_g, 1)} g ${L({ it: "proteine", en: "protein" })}` : null,
    p.valori.epa_dha_g ? `EPA+DHA ${num(p.valori.epa_dha_g * 1000)} mg` : null,
    p.valori.fibre_g ? `${num(p.valori.fibre_g, 1)} g ${L({ it: "fibre", en: "fibre" })}` : null,
    p.valori.calcium_mg ? `Ca ${num(p.valori.calcium_mg)} mg` : null,
    p.valori.iron_mg ? `Fe ${num(p.valori.iron_mg, 1)} mg` : null,
  ].filter(Boolean).join(" · ") : null;
  return { top, lim, valori, fonteDi, varianti: p && p.varianti, gf: a.glutine };
}

function scambi() {
  const q = cerca.trim().toLowerCase();
  const gruppi = GRUPPI().map((g) => ({ ...g, voci: g.voci.filter((v) => !q || nome(v.a, "it").toLowerCase().includes(q) || nome(v.a, "en").toLowerCase().includes(q) || (v.testo && L(v.testo).toLowerCase().includes(q))) })).filter((g) => g.voci.length);
  return `<input id="cerca-cibo" class="cerca" type="search" placeholder="${esc(L({ it: "Cerca un alimento (es. salmone, quinoa)", en: "Search a food (e.g. salmon, quinoa)" }))}" value="${esc(cerca)}" data-input="cercaCibo" aria-label="${esc(L({ it: "Cerca", en: "Search" }))}">
  <p class="piccolo muted" data-s="s81ccb">${esc(L({ it: "Dentro ogni gruppo le dosi indicate si equivalgono: lo ha deciso la Dott.ssa Giunta. I valori per porzione vengono dalle tabelle CREA, CIQUAL e USDA verificate dal consiglio. Per gli alimenti a pezzi (uova, gallette) il peso non è nel piano, quindi niente numeri.", en: "Within each group the amounts are equivalent: Dott.ssa Giunta decided this. Per-portion values come from the CREA, CIQUAL and USDA tables checked by the council. For foods counted in pieces (eggs, rice cakes) the plan gives no weight, so no numbers." }))}</p>
  ${gruppi.map((g) => {
    const best = migliori(g.voci);
    return `<section class="card gruppo-scambi"><h3>${esc(L(g.titolo))}</h3>
      ${g.voci.map((v) => {
        const info = vocePorzione(v);
        const chips = [
          ...info.top.map(() => `<span class="etichetta oliva">${esc(L({ it: "Top per la Dott.ssa", en: "Top for the nutritionist" }))}</span>`).slice(0, 1),
          v.ognitanto ? `<span class="etichetta">${esc(L({ it: "ogni tanto", en: "now and then" }))}</span>` : "",
          v.max ? `<span class="etichetta terra">max ${v.max}/${esc(L({ it: "sett", en: "wk" }))}</span>` : "",
          v.esattamente ? `<span class="etichetta terra">${v.esattamente}/${esc(L({ it: "sett", en: "wk" }))}</span>` : "",
          info.gf === "certificata" ? `<span class="etichetta viola">${esc(L({ it: "solo certificata s.g.", en: "certified GF only" }))}</span>` : info.gf === "etichetta" ? `<span class="etichetta">${esc(L({ it: "dicitura s.g.", en: "GF label" }))}</span>` : "",
          ...(best[v.a + v.q] || []).map((x) => `<span class="etichetta viola">${esc(L(x))}</span>`),
        ].join(" ");
        const altri = (v.o || []).map((x) => `${nome(x.a, lingua())} ${x.q} ${x.u}`).join(" · ");
        return `<div class="voce"><div><div><strong>${esc(v.testo ? L(v.testo) : nome(v.a, lingua()))}</strong></div>
          ${altri ? `<div class="minimo">${esc(L({ it: "oppure", en: "or" }))} ${esc(altri)}</div>` : ""}
          ${info.valori ? `<div class="minimo">${esc(info.valori)}${info.varianti ? ` (${esc(L({ it: "media di", en: "average of" }))} ${esc(info.varianti.join(", "))})` : ""}</div>` : ""}
          ${info.fonteDi.length ? `<div class="minimo">${esc(L({ it: "Fonte di", en: "Source of" }))}: ${esc(info.fonteDi.map((n) => (NOMI_NUTRIENTI[n] ? NOMI_NUTRIENTI[n][lingua() === "en" ? 1 : 0] : n)).join(", "))}</div>` : ""}
          <div data-s="s96ad6">${chips}</div></div>
          <span class="q">${v.esempio ? esc(L({ it: "stesso peso", en: "same weight" })) : esc(`${v.q} ${v.u === "pz" ? (lingua() === "en" ? "pcs" : "pz") : v.u}`)}</span></div>`;
      }).join("")}
      ${g.nota ? `<p class="minimo" data-s="s8a77e">${esc(L(g.nota))}</p>` : ""}
      ${(g.extra || []).map((x) => `<p class="minimo">${esc(L(x))}: ${esc(t("infoMancante"))} (${esc(L(x.manca))})</p>`).join("")}
    </section>`;
  }).join("")}
  <section class="card"><h3>${esc(L({ it: "Citati senza dose", en: "Named without an amount" }))}</h3>
    ${SENZA_DOSE.map((x) => `<div class="voce"><div>${esc(L(x))}</div><span class="etichetta attenzione">${esc(t("infoMancante"))}</span></div><div class="minimo">${esc(L({ it: "Manca", en: "Missing" }))}: ${esc(L(x.manca))}</div>`).join("")}
  </section>`;
}

/* ----------------------------------------------------------- recipes */
function ricette(s) {
  const lista = RICETTE.filter((r) => (filtro === "tutte" || r.pasto === filtro) && (!soloPreferite || s.preferite.includes(r.id)));
  const R = rng(pescate);
  const tre = R.shuffle(lista).slice(0, 3);
  const chips = ["tutte", "colazione", "pranzo", "cena", "spuntino", "dopocena"].map((p) => `<button class="chip ${filtro === p ? "attivo" : ""}" data-az="filtroRic" data-p="${p}">${esc(p === "tutte" ? L({ it: "Tutte", en: "All" }) : L(DEF[p].nome))}</button>`).join("");
  return `<div class="chips">${chips}<button class="chip ${soloPreferite ? "attivo" : ""}" data-az="soloPref">${esc(L({ it: "Preferite", en: "Favourites" }))}</button></div>
    <div class="card evidenza"><div class="riga tra"><h3>${esc(L({ it: "Pescate per te", en: "Picked for you" }))}</h3>
      <button class="btn piccolo primario" data-az="pesca">${I.rimescola}${esc(L({ it: "Rimescola", en: "Shuffle" }))}</button></div>
      ${tre.length ? tre.map((r) => cartaRicetta(r)).join("") : `<p class="muted">${esc(L({ it: "Nessuna ricetta con questo filtro.", en: "No recipe with this filter." }))}</p>`}
    </div>
    <h2 class="sez">${esc(L({ it: "Tutte le ricette", en: "All recipes" }))} <span class="minimo">${lista.length}</span></h2>
    ${lista.map((r) => cartaRicetta(r)).join("")}
    <p class="minimo">${esc(L({ it: "Ogni ricetta usa solo le dosi del piano ed è approvata dal consiglio. La nutrizionista: \"Puoi fare la ricetta che vuoi, l'importante è che rispetti le dosi.\"", en: "Every recipe uses only the plan's amounts and is approved by the council. The nutritionist: \"You can make any recipe you like, what matters is keeping the amounts.\"" }))}</p>`;
}

/* -------------------------------------------------------- web recipes */
let inCorso = false;
export async function aggiornaRicetteWeb(forza) {
  if (inCorso) return;
  const s = S();
  const recente = s.webCache && s.webCache.letto && Date.now() - Date.parse(s.webCache.letto) < 3 * 3600 * 1000;
  if (recente && !forza) return;
  inCorso = true;
  try {
    const r = await fetch("/api/ricette", { cache: "no-store", credentials: "same-origin" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const dati = await r.json();
    cambiaSilenzioso((st) => { st.webCache = { ...dati, letto: new Date().toISOString() }; });
    if (location.hash.startsWith("#/cibo/web") || location.hash.startsWith("#/oggi") || location.hash === "" || location.hash.startsWith("#/consiglio")) ridisegna();
    if (dati.aggiornamentoAvviato) setTimeout(() => { inCorso = false; aggiornaRicetteWeb(true); }, 45000);
  } catch (e) {
    if (forza) toast(L({ it: "Ricette dal web non raggiungibili ora: mostro le ultime salvate.", en: "Web recipes not reachable now: showing the last saved ones." }));
  } finally {
    inCorso = false;
  }
}

function cartaWeb(r, profilo) {
  const personali = notePersonali(r.ingredienti || [], profilo);
  const bloccata = personali.some((x) => x.livello === "veto");
  return `<article class="card piatta">
    <div class="riga tra"><div class="minimo">${esc(r.fonte)}${r.autore ? " · " + esc(r.autore) : ""}${r.minuti ? ` · ${r.minuti} min` : ""}</div>${bloccata ? `<span class="esito respinta">${I.no}${esc(L({ it: "Non per te", en: "Not for you" }))}</span>` : esitoHtml(r.esito)}</div>
    <div class="ricetta-card"><div class="tit" data-s="s96ad6">${esc(r.titolo)}</div></div>
    ${r.pasto ? `<p class="piccolo" data-s="sc1faf">${esc(L({ it: "Nel piano", en: "In the plan" }))}: <strong>${esc(r.pasto.pasto === "contorno" ? L({ it: "contorno di verdure", en: "vegetable side" }) : L(DEF[r.pasto.pasto].nome))}</strong>. ${esc(L({ it: "Usa queste dosi", en: "Use these amounts" }))}: ${esc((r.dosi || []).map((d) => `${nome(d.a, lingua())} ${d.q != null ? d.q + " " + d.u : ""}`).join(", "))}</p>` : ""}
    ${personali.length ? `<div class="avviso terra">${I.avviso}<div>${personali.map((x) => esc(L(x))).join("<br>")}</div></div>` : ""}
    ${r.adattamenti && r.adattamenti.length ? `<p class="piccolo"><strong>${esc(L({ it: "Adattamenti del consiglio", en: "Council adaptations" }))}:</strong></p><ul class="piccolo">${r.adattamenti.map((a) => `<li>${esc(L(a))}</li>`).join("")}</ul>` : ""}
    ${r.packung && r.packung.length ? `<p class="minimo">${esc(L({ it: "Compra con la dicitura senza glutine", en: "Buy labelled gluten free" }))}: ${esc(r.packung.join("; "))}</p>` : ""}
    <details><summary class="piccolo"><strong>${esc(t("ingredienti"))}</strong> (${(r.ingredienti || []).length})</summary><ul class="piccolo">${(r.ingredienti || []).map((z) => `<li>${esc(z)}</li>`).join("")}</ul></details>
    <details><summary class="piccolo"><strong>${esc(t("verdetti"))}</strong></summary>${verdettiHtml({ verdetti: r.verdetti || [] })}</details>
    <a class="btn piccolo" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${I.link}${esc(L({ it: "Procedimento sulla pagina originale", en: "Method on the original page" }))}</a>
  </article>`;
}

function web(s) {
  const c = s.webCache;
  const lista = c && c.libreria ? c.libreria.ricette || [] : [];
  const u = c && c.ultimo;
  return `<div class="avviso viola">${I.consiglio}<div>${esc(L({ it: "Ogni giorno alle 5:17 (ora di Roma e Vienna, d'inverno) il consiglio legge le nuove ricette senza glutine da 10 siti, rispettando robots.txt. Tiene solo quelle che superano glutine, lupus e piano, con le dosi della Dott.ssa. Qui solo gli ingredienti: il procedimento resta sulla pagina dell'autore.", en: "Every day at 5:17 (Rome and Vienna time, winter) the council reads new gluten-free recipes from 10 sites, respecting robots.txt. It keeps only those that pass gluten, lupus and plan, with the nutritionist's amounts. Only the ingredients are here: the method stays on the author's page." }))}</div></div>
    ${u ? `<section class="card" data-s="s56f43"><div class="riga tra"><h3>${esc(L({ it: "Ultimo giro", en: "Last run" }))}</h3><span class="minimo">${esc(dataConAnno(u.data))}</span></div>
      <div class="griglia3"><div class="tile"><div class="lab">${esc(L({ it: "Lette", en: "Read" }))}</div><div class="val">${u.lette}</div></div><div class="tile"><div class="lab">${esc(L({ it: "Tenute", en: "Kept" }))}</div><div class="val">${u.approvate + u.adattate}</div></div><div class="tile"><div class="lab">${esc(t("respinta"))}</div><div class="val">${u.respinte}</div></div></div>
      <p class="minimo" data-s="s8a77e">${esc(Object.entries(u.perSeggio || {}).map(([k, n]) => `${L({ it: { glutine: "glutine", lupus: "lupus", piano: "fuori piano" }[k] || k, en: { glutine: "gluten", lupus: "lupus", piano: "outside plan" }[k] || k })}: ${n}`).join(" · "))}</p>
      ${u.respinteDettaglio && u.respinteDettaglio.length ? `<details><summary class="piccolo"><strong>${esc(L({ it: "Perché sono state respinte", en: "Why they were rejected" }))}</strong></summary><ul class="piccolo">${u.respinteDettaglio.slice(0, 30).map((x) => `<li>${esc(x.titolo)} <span class="minimo">(${esc(x.fonte)})</span>: ${esc(x.motivo ? L(x.motivo) : "-")}</li>`).join("")}</ul></details>` : ""}
    </section>` : ""}
    <div class="riga tra" data-s="s96d03"><h2 class="sez" data-s="s11696">${esc(L({ it: "Approvate dal consiglio", en: "Approved by the council" }))} <span class="minimo">${lista.length}</span></h2>
      <button class="btn piccolo" data-az="aggiornaWeb">${I.rimescola}${esc(L({ it: "Aggiorna", en: "Refresh" }))}</button></div>
    ${lista.length ? lista.map((r) => cartaWeb(r, s.profilo)).join("") : `<div class="card vuoto"><div class="grande">${esc(L({ it: "Ancora nessuna ricetta dal web", en: "No web recipes yet" }))}</div><p>${esc(L({ it: "Il consiglio è severo: di solito passano poche ricette a settimana. Intanto trovi 44 ricette già approvate nella scheda Ricette.", en: "The council is strict: usually only a few recipes a week pass. Meanwhile there are 44 approved recipes in the Recipes tab." }))}</p></div>`}`;
}

/* -------------------------------------------------------------- rules */
function regole() {
  const punti = CLINICA ? CLINICA.dieta : [];
  const gruppo = (cond) => punti.filter((p) => cond.includes(p.condizione));
  const puntoHtml = (p) => `<div class="voce" data-s="s2a1b7"><div>${esc(L({ it: p.it, en: p.en }))}</div>
    <div class="minimo">${esc(L({ it: "Livello di prova", en: "Evidence" }))}: ${esc(p.evidenza)} · ${p.fonti.slice(0, 2).map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.editore || f.titolo)}${f.anno ? " " + f.anno : ""}</a>`).join(", ")}</div></div>`;
  return `<section class="card"><h3>${esc(L({ it: "Le regole della Dott.ssa Giunta", en: "Dott.ssa Giunta's rules" }))}</h3>
    ${REGOLE.map((r) => `<div class="voce" data-s="s2a1b7">${esc(L(r))}</div>`).join("")}
    <p class="minimo">${esc(L({ it: "Acqua: la dicitura UE \"calcica\" indica calcio oltre 150 mg/l (Direttiva 2009/54/CE). Ferrarelle e Lete sono quelle consigliate.", en: "Water: the EU wording \"calcium-rich\" means calcium above 150 mg/l (Directive 2009/54/EC). Ferrarelle and Lete are the ones recommended." }))}</p></section>
  <section class="card"><h3>${esc(L({ it: "Sì: alimentazione antinfiammatoria", en: "Yes: anti-inflammatory eating" }))}</h3><ul class="piccolo">${SI_ANTINFIAMMATORI.map((x) => `<li>${esc(L(x))}</li>`).join("")}</ul></section>
  <section class="card"><h3>${esc(L({ it: "No", en: "No" }))}</h3><ul class="piccolo">${NO_ANTINFIAMMATORI.map((x) => `<li>${esc(L(x))}</li>`).join("")}</ul></section>
  <section class="card"><h3>${esc(L({ it: "Reni", en: "Kidneys" }))}</h3><p class="piccolo">${esc(L(RENI))}</p>${gruppo(["lupus_nephritis"]).filter((p) => p.id.startsWith("ln_")).map(puntoHtml).join("")}</section>
  <section class="card"><h3>${esc(L({ it: "Celiachia: cosa dicono le linee guida", en: "Coeliac disease: what the guidelines say" }))}</h3>${gruppo(["celiac"]).map(puntoHtml).join("")}</section>
  <section class="card"><h3>${esc(L({ it: "Lupus: cosa dicono le fonti", en: "Lupus: what the sources say" }))}</h3>${gruppo(["lupus"]).filter((p) => !p.id.startsWith("drug_")).map(puntoHtml).join("")}</section>
  <section class="card"><h3>${esc(L({ it: "Farmaci e cibo: da chiedere al medico", en: "Medicines and food: ask the doctor" }))}</h3><p class="minimo">${esc(L({ it: "Valgono solo se prendi questi farmaci. Scrivili nelle impostazioni (restano sul telefono) e il consiglio li terrà presenti.", en: "These apply only if you take these medicines. Enter them in the settings (they stay on the phone) and the council will take them into account." }))}</p>${punti.filter((p) => p.id.startsWith("drug_")).map(puntoHtml).join("")}</section>
  <section class="card"><h3>${esc(L({ it: "Domande per la nutrizionista", en: "Questions for the nutritionist" }))}</h3><ul class="piccolo">${DOMANDE_APERTE.map((d) => `<li>${esc(L(d))}</li>`).join("")}</ul></section>`;
}

registra({
  vai: (d) => { location.hash = d.h; },
  cercaCibo: (d, el) => { cerca = el.value; cambia(() => {}); },
  filtroRic: (d) => { filtro = d.p; cambia(() => {}); },
  soloPref: () => { soloPreferite = !soloPreferite; cambia(() => {}); },
  pesca: () => { pescate = nuovoSeme(); cambia(() => {}); },
  aggiornaWeb: () => aggiornaRicetteWeb(true),
});
void apriFoglio; void CENA;
