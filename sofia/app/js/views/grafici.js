/*
 * Home charts: the calorie ring (eaten against 1400 kcal) and the five rings
 * for carbs, protein, vegetables, fruit and fat against today's plan.
 *
 * Colour follows the data viz method: one series colour for calories with
 * status (over the target) shown by icon and label, never colour alone; the
 * five rings use the validated categorical palette in fixed slot order
 * (contrast relief: every ring has a visible label with its value), each ring
 * on a track of its own hue. SVG with presentation attributes only (the CSP
 * allows no style attributes); arcs animate from the last shown value when
 * a value changes (animaArchi, run after each render).
 */
import { L } from "../i18n.js";
import { esc, num, I } from "../ui.js";

const ultimi = new Map();
const arco = (r, quota) => { const c = 2 * Math.PI * r; return { c, pieno: Math.max(0, Math.min(1, quota)) * c }; };
/* A round cap on an empty arc would draw a dot that reads as a value: flat cap at zero. */
const cappuccio = (pieno) => (pieno < 0.5 ? "butt" : "round");

export function ciambellaKcal(mangiato, obiettivo) {
  const R = 58, W = 16, D = 2 * (R + W / 2) + 4;
  const { c, pieno } = arco(R, mangiato / obiettivo);
  const oltre = mangiato > obiettivo;
  const extra = oltre ? arco(R, (mangiato - obiettivo) / obiettivo).pieno : 0;
  const restano = Math.round(obiettivo - mangiato);
  const etichetta = L({ it: `${Math.round(mangiato)} kcal mangiate su ${obiettivo}`, en: `${Math.round(mangiato)} kcal eaten of ${obiettivo}` });
  return `<svg class="ciambella" viewBox="0 0 ${D} ${D}" width="${D}" height="${D}" role="img" aria-label="${esc(etichetta)}">
    <g transform="rotate(-90 ${D / 2} ${D / 2})">
      <circle class="traccia" cx="${D / 2}" cy="${D / 2}" r="${R}" stroke-width="${W}" fill="none"></circle>
      <circle class="valore" cx="${D / 2}" cy="${D / 2}" r="${R}" stroke-width="${W}" fill="none" stroke-linecap="${cappuccio(pieno)}" stroke-dasharray="${pieno.toFixed(1)} ${c.toFixed(1)}" data-arco="kcal" data-c="${c.toFixed(1)}" data-v="${pieno.toFixed(1)}"></circle>
      ${oltre ? `<circle class="oltre" cx="${D / 2}" cy="${D / 2}" r="${R}" stroke-width="${W - 6}" fill="none" stroke-linecap="round" stroke-dasharray="${extra.toFixed(1)} ${c.toFixed(1)}"></circle>` : ""}
    </g>
    <text class="num" x="50%" y="46%" text-anchor="middle">${esc(num(mangiato))}</text>
    <text class="sub" x="50%" y="60%" text-anchor="middle">${esc(L({ it: `di ${obiettivo} kcal`, en: `of ${obiettivo} kcal` }))}</text>
    <text class="sub2" x="50%" y="72%" text-anchor="middle">${esc(restano >= 0 ? L({ it: `restano ${restano}`, en: `${restano} left` }) : L({ it: `oltre di ${-restano}`, en: `${-restano} over` }))}</text>
  </svg>`;
}

/* Concentric rings, outer to inner in palette order; legend with value, target and status. */
export function anelliGruppi(righe) {
  const W = 9, GAP = 3, R0 = 62, D = 2 * (R0 + W / 2) + 4;
  const cerchi = righe.map((x, i) => {
    const r = R0 - i * (W + GAP);
    const { c, pieno } = arco(r, x.quota);
    return `<circle class="traccia s${i + 1}" cx="${D / 2}" cy="${D / 2}" r="${r}" stroke-width="${W}" fill="none"></circle>
      <circle class="valore s${i + 1}" cx="${D / 2}" cy="${D / 2}" r="${r}" stroke-width="${W}" fill="none" stroke-linecap="${cappuccio(pieno)}" stroke-dasharray="${pieno.toFixed(1)} ${c.toFixed(1)}" data-arco="${esc(x.chiave)}" data-c="${c.toFixed(1)}" data-v="${pieno.toFixed(1)}"></circle>`;
  }).join("");
  const riassunto = righe.map((x) => `${L(x.nome)} ${Math.round(x.quota * 100)}%`).join(", ");
  const legenda = righe.map((x, i) => {
    if (x.stato === "nessuno") return `<li><span class="pallino s${i + 1}" aria-hidden="true"></span><span class="nome">${esc(L(x.nome))}</span>
      <span class="fuori"><strong>${esc(num(x.valore))} ${esc(x.unita)}</strong> · ${esc(L({ it: "non nel piano di oggi", en: "not in today's plan" }))}</span></li>`;
    const pct = Math.round(x.quota * 100);
    const obiettivo = x.range ? `${num(x.range.min)}-${num(x.range.max)}` : num(x.obiettivo);
    const stato = x.stato === "sopra" ? `<span class="stato attenzione mini">${I.avviso}${esc(L({ it: "oltre", en: "over" }))}</span>`
      : x.stato === "ok" ? `<span class="stato ok mini">${I.ok}${esc(L({ it: "fatto", en: "done" }))}</span>` : "";
    return `<li><span class="pallino s${i + 1}" aria-hidden="true"></span><span class="nome">${esc(L(x.nome))}</span>
      <span class="val">${esc(num(x.valore))}<small> / ${esc(obiettivo)} ${esc(x.unita)}</small></span><span class="pct">${pct}%</span>${stato}</li>`;
  }).join("");
  return `<div class="anelli">
    <svg viewBox="0 0 ${D} ${D}" width="${D}" height="${D}" role="img" aria-label="${esc(L({ it: "Oggi rispetto al piano: ", en: "Today against the plan: " }) + riassunto)}"><g transform="rotate(-90 ${D / 2} ${D / 2})">${cerchi}</g></svg>
    <ul class="legenda-anelli">${legenda}</ul>
  </div>`;
}

/* After a render: arcs whose value changed grow from the last shown value. */
export function animaArchi(root) {
  const fermo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const el of root.querySelectorAll("[data-arco]")) {
    const k = el.dataset.arco, v = Number(el.dataset.v), c = Number(el.dataset.c);
    const prima = ultimi.has(k) ? ultimi.get(k) : 0;
    ultimi.set(k, v);
    if (fermo || Math.abs(prima - v) < 0.5 || !el.animate) continue;
    el.animate([{ strokeDasharray: `${prima} ${c}` }, { strokeDasharray: `${v} ${c}` }], { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)" });
  }
}

/*
 * Week bars: one bar per row (calories, carbs, protein, fat, vegetables,
 * fruit). The track is the target (the maximum for a range), the fill what
 * she ate; a tick marks a range's minimum. Same palette slots as the home
 * rings; status (over the ceiling, done) shown by icon and label. Drawn as a
 * stroked line so animaArchi grows it like the arcs.
 */
const SLOT = { carb: "s1", prot: "s2", verdure: "s3", frutta: "s4", fat: "s5", kcal: "kcal" };
const X0 = 6, X1 = 294, LUNGA = X1 - X0;

function barra(chiave, arcoId, quota, tacca, etichetta) {
  const v = Math.max(0, Math.min(1, quota)) * LUNGA;
  const xt = tacca != null ? X0 + Math.max(0, Math.min(1, tacca)) * LUNGA : null;
  return `<svg class="barra-svg" viewBox="0 0 300 12" width="100%" role="img" aria-label="${esc(etichetta)}">
    <line class="traccia ${SLOT[chiave]}" x1="${X0}" y1="6" x2="${X1}" y2="6" stroke-width="10" stroke-linecap="round"></line>
    <line class="valore ${SLOT[chiave]}" x1="${X0}" y1="6" x2="${X1}" y2="6" stroke-width="10" stroke-linecap="${cappuccio(v)}" stroke-dasharray="${v.toFixed(1)} ${LUNGA}" data-arco="${esc(arcoId)}" data-c="${LUNGA}" data-v="${v.toFixed(1)}"></line>
    ${xt != null ? `<line class="tacca" x1="${xt.toFixed(1)}" y1="0" x2="${xt.toFixed(1)}" y2="12" stroke-width="2"></line>` : ""}
  </svg>`;
}

const qt = (x, u) => `${num(Math.round(x))} ${u}`;

export function barreSettimana(righe, prefisso = "sett") {
  return `<ul class="barre">${righe.map((x) => {
    const obiettivo = x.stato === "nessuno" ? L({ it: "non nel piano di questi giorni", en: "not in these days' plan" })
      : x.min != null ? L({ it: `min ${num(Math.round(x.min))} · max ${qt(x.max, x.unita)}`, en: `min ${num(Math.round(x.min))} · max ${qt(x.max, x.unita)}` })
      : L({ it: `obiettivo ${qt(x.max, x.unita)}`, en: `target ${qt(x.max, x.unita)}` });
    const destra = x.stato === "nessuno" ? ""
      : x.stato === "sopra" ? `<span class="stato attenzione mini">${I.avviso}${esc(L({ it: `oltre di ${qt(x.oltre, x.unita)}`, en: `${qt(x.oltre, x.unita)} over` }))}</span>`
      : !x.tetto && x.stato === "ok" ? `<span class="stato ok mini">${I.ok}${esc(L({ it: "fatto", en: "done" }))}</span>`
      : `<span>${esc(x.tetto ? L({ it: "Restano", en: "Left" }) : L({ it: "Ancora", en: "Still" }))} <strong>${esc(qt(x.restano, x.unita))}</strong></span>`;
    const detto = L({ it: `${L(x.nome)}: hai mangiato ${qt(x.valore, x.unita)}${x.stato === "nessuno" ? "" : `, ${x.stato === "sopra" ? `oltre di ${qt(x.oltre, x.unita)}` : `restano ${qt(x.restano, x.unita)}`}`}`, en: `${L(x.nome)}: eaten ${qt(x.valore, x.unita)}${x.stato === "nessuno" ? "" : `, ${x.stato === "sopra" ? `${qt(x.oltre, x.unita)} over` : `${qt(x.restano, x.unita)} left`}`}` });
    return `<li>
      <div class="barra-testa"><span class="nome"><span class="pallino ${SLOT[x.chiave]}" aria-hidden="true"></span>${esc(L(x.nome))}</span><span class="minimo">${esc(obiettivo)}</span></div>
      ${barra(x.chiave, `${prefisso}-${x.chiave}`, x.max > 0 ? x.valore / x.max : 0, x.min != null && x.max > 0 ? x.min / x.max : null, detto)}
      <div class="barra-numeri"><span>${esc(L({ it: "Hai mangiato", en: "Eaten" }))} <strong>${esc(qt(x.valore, x.unita))}</strong></span>${destra}</div>
    </li>`;
  }).join("")}</ul>`;
}

/* A day's calories in the week list: one slim bar against the plan's 1400 kcal. */
export function barraGiorno(data, kcal, obiettivo) {
  const detto = L({ it: `${num(Math.round(kcal))} kcal di ${obiettivo}`, en: `${num(Math.round(kcal))} kcal of ${obiettivo}` });
  return `<div class="giorno-kcal">${barra("kcal", `g-${data}`, kcal / obiettivo, null, detto)}<span class="minimo">${esc(detto)}${kcal > obiettivo ? ` · ${esc(L({ it: "oltre", en: "over" }))}` : ""}</span></div>`;
}
