/* Corpo 5D: space (3D), time (her data over time), food (what reaches which system). */
import { S } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, dataConAnno, statoHtml, numAuto, applicaStili } from "../ui.js";
import { registra, apriFoglio } from "../ctx.js";
import { ORGANI, statoCorpo, dateDati, punteggioOrgano, renaleFuoriRange } from "../engine/salute.js";
import { ESAME } from "../data/esami.js";
import { impattiCibo, organiDelCibo, cibiPerOrgano, CIBI_5D } from "../engine/impatti.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { isoData } from "../engine/planner.js";

let modo = "salute", cibo = null, indiceTempo = null, istanza = null, involucro = null, gioco = null;
const COLORE = { ok: "#7be0a0", attenzione: "#ffc96b", male: "#ff7a6b", nd: "#8f86a8" };
const ETICH = { brain: "cervello", heart_vessels: "cuore", kidneys: "reni", gut: "intestino", blood: "sangue", immune: "immunitario", joints: "articolazioni", skin: "pelle", bones: "ossa", metabolism: "metabolismo", liver: "fegato", muscle: "muscoli" };

export const titolo = () => t("corpo");
export const sottotitolo = () => esc(L({ it: "Spazio, tempo e cibo: il tuo corpo dai tuoi dati", en: "Space, time and food: your body from your data" }));

function dataScelta(s) {
  const date = dateDati(s);
  if (!date.length) return isoData(new Date());
  const i = indiceTempo == null ? date.length - 1 : Math.min(indiceTempo, date.length - 1);
  return date[i];
}

export function render(s) {
  const date = dateDati(s);
  const quando = dataScelta(s);
  const stati = statoCorpo(s, quando);
  const sopra = `<div class="sopra"><div class="seg" role="tablist">
      <button class="${modo === "salute" ? "attivo" : ""}" data-az="modo5d" data-m="salute">${esc(L({ it: "Salute", en: "Health" }))}</button>
      <button class="${modo === "cibo" ? "attivo" : ""}" data-az="modo5d" data-m="cibo">${esc(L({ it: "Cibo", en: "Food" }))}</button>
      <button class="${modo === "cervello" ? "attivo" : ""}" data-az="modo5d" data-m="cervello">${esc(L({ it: "Mente", en: "Mind" }))}</button></div></div>`;
  const nota = `<div class="nota5d">${esc(modo === "cibo" ? L({ it: "Scegli un alimento: segui dove arriva.", en: "Pick a food: follow where it goes." }) : L({ it: "Trascina per ruotare, tocca un organo.", en: "Drag to rotate, tap an organ." }))}</div>`;
  const sotto = modo === "cibo"
    ? `<div class="sotto"><div class="cibi">${CIBI_5D.map((id) => `<button class="${cibo === id ? "attivo" : ""}" data-az="cibo5d" data-id="${id}">${esc(nome(id, lingua()).split(" (")[0])}</button>`).join("")}</div></div>`
    : `<div class="sotto"><div class="tempo"><button class="play" data-az="play5d" aria-label="${esc(gioco ? L({ it: "Pausa", en: "Pause" }) : L({ it: "Riproduci nel tempo", en: "Play over time" }))}">${gioco ? I.pausa : I.play}</button>
        <input type="range" min="0" max="${Math.max(0, date.length - 1)}" value="${date.length ? date.indexOf(quando) : 0}" data-input="tempo5d" aria-label="${esc(L({ it: "Data", en: "Date" }))}" ${date.length < 2 ? "disabled" : ""}>
        <span class="quando" id="quando5d">${esc(date.length ? dataConAnno(quando) : L({ it: "nessun dato", en: "no data" }))}</span></div></div>`;
  return `<div class="corpo5d" id="scena5d">${sopra}${nota}${sotto}<div class="etichetta-organo" id="etichetta5d" hidden></div></div>
    <div class="legenda5d"><span><i data-bg="${COLORE.ok}"></i>${esc(L({ it: "in ordine", en: "in order" }))}</span><span><i data-bg="${COLORE.attenzione}"></i>${esc(L({ it: "da guardare", en: "worth a look" }))}</span><span><i data-bg="${COLORE.male}"></i>${esc(L({ it: "fuori intervallo", en: "out of range" }))}</span><span><i data-bg="${COLORE.nd}"></i>${esc(L({ it: "nessun dato", en: "no data" }))}</span></div>
    <div id="pannello5d">${modo === "cibo" ? pannelloCibo() : pannelloSalute(stati)}</div>
    <p class="minimo" data-s="sd6f2a">${esc(L({ it: "5D: tre dimensioni di spazio, il tempo dei tuoi dati e il cibo. I colori riassumono i tuoi valori rispetto agli intervalli del tuo laboratorio e agli obiettivi del piano; non sono una diagnosi. I collegamenti cibo-organo usano solo indicazioni sulla salute autorizzate dall'UE (Reg. 432/2012) e alimenti che sono davvero \"fonte\" di quel nutriente.", en: "5D: three dimensions of space, the time of your data and food. Colours summarise your values against your lab's ranges and the plan's targets; they are not a diagnosis. Food-organ links use only EU-authorised health claims (Reg. 432/2012) and foods that really are a \"source\" of that nutrient." }))}</p>`;
}

function pannelloSalute(stati) {
  const lista = modo === "cervello" ? ORGANI.filter((o) => o.id === "brain") : ORGANI;
  return lista.map((o) => {
    const r = stati[o.id];
    return `<div class="card piatta organo-card" data-az="organo5d" data-id="${o.id}" role="button" tabindex="0" data-s="sd2c17">
      <span class="pallino" data-bg="${COLORE[r.stato]}"></span>
      <div data-s="s97445"><div class="riga tra"><strong>${esc(L(o))}</strong>${statoHtml(r.stato)}</div>
      <div class="minimo">${r.parti.length ? esc(r.parti.slice(0, 4).map(descriviParte).join(" · ")) : esc(L({ it: "Nessun dato ancora: inserisci esami o compila il diario.", en: "No data yet: add results or fill in the diary." }))}</div></div></div>`;
  }).join("");
}

function descriviParte(p) {
  if (p.tipo === "esame") return `${L(ESAME[p.marker] || { it: p.marker })} ${numAuto(p.valore)} ${p.unita}`;
  if (p.tipo === "diario") return `${t(p.chiave === "glutine" ? "glutineSospetto" : p.chiave)} ${numAuto(p.valore)}`;
  if (p.tipo === "abitudine") return p.chiave === "acqua" ? `${t("acqua")} ${numAuto(p.valore)} L` : `${t("camminata")} ${numAuto(p.valore)} min`;
  if (p.tipo === "peso") return `${t("peso")} ${numAuto(p.valore)} kg`;
  return "";
}

function pannelloCibo() {
  if (!cibo) return `<div class="card vuoto"><div class="grande">${esc(L({ it: "Scegli un alimento del piano", en: "Pick a food from the plan" }))}</div></div>`;
  const imp = impattiCibo(cibo, { renaleFuoriRange: renaleFuoriRange(S(), isoData(new Date())) });
  const gl = (ALIMENTI[cibo] || {}).glutine;
  const intestino = gl === "certificata"
    ? { it: "Solo se certificato senza glutine: così protegge l'intestino nella celiachia (dieta senza glutine rigorosa, ESsCD).", en: "Only if certified gluten free: then it protects the gut in coeliac disease (strict gluten-free diet, ESsCD)." }
    : gl === "etichetta"
      ? { it: "Se comprato con la dicitura senza glutine: così protegge l'intestino nella celiachia (dieta senza glutine rigorosa, ESsCD).", en: "If bought labelled gluten free: then it protects the gut in coeliac disease (strict gluten-free diet, ESsCD)." }
      : { it: "Naturalmente senza glutine: protegge l'intestino nella celiachia (dieta senza glutine rigorosa, ESsCD).", en: "Naturally gluten free: it protects the gut in coeliac disease (strict gluten-free diet, ESsCD)." };
  const perOrgano = {};
  for (const x of imp) (perOrgano[x.organo] = perOrgano[x.organo] || []).push(x);
  return `<h2 class="sez">${esc(nome(cibo, lingua()))}</h2>
    <div class="card piatta" data-s="sd2c17"><strong>${esc(L({ it: "Intestino", en: "Gut" }))}</strong><div class="piccolo">${esc(L(intestino))}</div></div>
    ${Object.entries(perOrgano).map(([o, lista]) => `<div class="card piatta" data-s="sd2c17"><strong>${esc(L(ORGANI.find((x) => x.id === o) || { it: o, en: o }))}</strong>
      ${lista.map((x) => `<div class="piccolo" data-s="sfe7b4">${x.stato === "ok" ? "✓" : x.stato === "quantita" ? "≈" : "?"} ${esc(L(x.claim.testo))}${x.varianti.length ? ` <span class="minimo">(${esc(x.varianti.join(", ").replace(/_/g, " "))})</span>` : ""}
        ${x.nota ? `<div class="minimo">${esc(L(x.nota))}</div>` : ""}</div>`).join("")}
      <p class="fonte">${esc(lista[0].claim.atto)}</p></div>`).join("") || `<p class="muted">${esc(L({ it: "Nessuna indicazione sulla salute autorizzata soddisfatta da questo alimento in queste dosi.", en: "No authorised health claim is met by this food at these amounts." }))}</p>`}`;
}

function foglioOrgano(id) {
  const s = S();
  const o = ORGANI.find((x) => x.id === id) || { id: "skin", it: "Pelle", en: "Skin" };
  const r = punteggioOrgano(s, o, dataScelta(s));
  const cibi = cibiPerOrgano(id).slice(0, 8);
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
    <h2>${esc(L(o))}</h2><div>${statoHtml(r.stato)} ${r.punteggio != null ? `<span class="minimo">${r.punteggio}/100</span>` : ""}</div>
    <h3 data-s="s56f43">${esc(L({ it: "Da cosa nasce il colore", en: "Where the colour comes from" }))}</h3>
    ${r.parti.length ? `<ul class="piccolo">${r.parti.map((p) => `<li>${esc(descriviParte(p))}${p.data ? ` (${esc(dataConAnno(p.data))})` : ""}: ${p.punteggio}/100</li>`).join("")}</ul>` : `<p class="piccolo muted">${esc(L({ it: "Nessun dato.", en: "No data." }))}</p>`}
    ${cibi.length ? `<h3>${esc(L({ it: "Alimenti del piano che lo sostengono", en: "Plan foods that support it" }))}</h3><ul class="piccolo">${cibi.map((c) => `<li><strong>${esc(nome(c.id, lingua()))}</strong>: ${esc([...new Set(c.claims.map((x) => L(x.nutriente)))].join(", "))}</li>`).join("")}</ul><p class="fonte">${esc(L({ it: "Indicazioni sulla salute autorizzate, Reg. (UE) 432/2012", en: "Authorised health claims, Reg. (EU) 432/2012" }))}</p>` : `<p class="piccolo muted">${esc(L({ it: "Per questo sistema non esistono indicazioni sulla salute autorizzate dall'UE legate agli alimenti del piano: l'app non inventa collegamenti.", en: "For this system there are no EU-authorised health claims linked to the plan's foods: the app does not invent links." }))}</p>`}`;
}

/* Mount the 3D scene after each render, reusing the same canvas. */
export async function dopo(s) {
  const posto = document.getElementById("scena5d");
  if (!posto) return;
  if (!involucro) { involucro = document.createElement("div"); involucro.style.position = "absolute"; involucro.style.inset = "0"; }
  posto.prepend(involucro);
  if (!istanza) {
    try {
      const { creaCorpo } = await import("../three/corpo3d.js");
      const ridotto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      istanza = await creaCorpo(involucro, { ridotto, alTocco: (id) => { mostraEtichetta(id); apriFoglio(() => foglioOrgano(id)); } });
    } catch (e) {
      posto.insertAdjacentHTML("beforeend", `<div class="no-webgl">${esc(L({ it: "Questo dispositivo non mostra il 3D. Sotto trovi gli stessi dati, sistema per sistema.", en: "This device cannot show 3D. Below are the same data, system by system." }))}</div>`);
      return;
    }
  }
  istanza.aggiorna(statoCorpo(s, dataScelta(s)));
  istanza.vista(modo === "cervello" ? "cervello" : "corpo");
}

function mostraEtichetta(id) {
  const el = document.getElementById("etichetta5d");
  if (!el || !istanza) return;
  const p = istanza.posizioneSchermo(id);
  if (!p) return;
  el.textContent = L({ it: ETICH[id] || id, en: (ORGANI.find((o) => o.id === id) || {}).en || id });
  el.style.left = p.x + "px"; el.style.top = p.y + "px"; el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 1800);
}

export function lascia() {
  if (gioco) { clearInterval(gioco); gioco = null; }
  if (istanza) { istanza.distruggi(); istanza = null; }
  involucro = null;
}

registra({
  modo5d: (d) => {
    modo = d.m;
    if (istanza) istanza.vista(modo === "cervello" ? "cervello" : "corpo");
    rinfresca();
  },
  cibo5d: (d) => {
    cibo = d.id;
    rinfresca();
    if (istanza) istanza.mostraCibo(organiDelCibo(d.id));
  },
  organo5d: (d) => { if (istanza) istanza.evidenzia([d.id]); apriFoglio(() => foglioOrgano(d.id)); },
  tempo5d: (d, el) => {
    indiceTempo = Number(el.value);
    const s = S();
    const q = dataScelta(s);
    const out = document.getElementById("quando5d");
    if (out) out.textContent = dataConAnno(q);
    if (istanza) istanza.aggiorna(statoCorpo(s, q));
    const p = document.getElementById("pannello5d");
    if (p) { p.innerHTML = pannelloSalute(statoCorpo(s, q)); applicaStili(p); }
  },
  play5d: () => {
    if (gioco) { clearInterval(gioco); gioco = null; rinfresca(); return; }
    const s = S();
    const date = dateDati(s);
    if (date.length < 2) return;
    indiceTempo = 0;
    gioco = setInterval(() => {
      indiceTempo++;
      if (indiceTempo >= date.length) { clearInterval(gioco); gioco = null; indiceTempo = date.length - 1; }
      const q = date[Math.min(indiceTempo, date.length - 1)];
      const sl = document.querySelector('[data-input="tempo5d"]');
      if (sl) sl.value = String(indiceTempo);
      const out = document.getElementById("quando5d");
      if (out) out.textContent = dataConAnno(q);
      if (istanza) istanza.aggiorna(statoCorpo(s, q));
      const p = document.getElementById("pannello5d");
      if (p) { p.innerHTML = pannelloSalute(statoCorpo(s, q)); applicaStili(p); }
      if (!gioco) rinfresca();
    }, 900);
    rinfresca();
  },
});

function rinfresca() {
  const s = S();
  const vista = document.getElementById("vista");
  if (!vista || !location.hash.startsWith("#/corpo")) return;
  vista.innerHTML = render(s);
  applicaStili(vista);
  dopo(s);
}
