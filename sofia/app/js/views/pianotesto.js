/*
 * Il piano: everything the nutritionist wrote, in Italian and in English.
 * The text is personal, so it travels encrypted (app/data/) and opens on the
 * phone with the access code typed at the gate; nothing readable is in the
 * public code.
 */
import { L, lingua } from "../i18n.js";
import { I, esc } from "../ui.js";
import { registra, ridisegna } from "../ctx.js";
import { decifraConPassphrase } from "../cripto.js";

let testo = null, stato = "chiuso", lng = null;

function codiceSalvato() {
  try { return localStorage.getItem("sofia-codice") || sessionStorage.getItem("sofia-codice"); } catch (e) { return null; }
}

async function apri(codice) {
  stato = "apro";
  ridisegna();
  try {
    const r = await fetch("data/piano-testo.cifrato.json", { cache: "no-cache" });
    testo = await decifraConPassphrase(await r.json(), codice, "sofia-piano");
    stato = "aperto";
    try { localStorage.setItem("sofia-codice", codice); } catch (e) { /* private mode */ }
  } catch (e) {
    stato = "errore";
  }
  ridisegna();
}

const T = (x) => esc(x[lng] || x.it);
const lista = (righe) => `<ul class="testo-piano">${righe.map((r) => `<li>${T(r)}</li>`).join("")}</ul>`;

function sezione(x) {
  return `<section class="card piano-sez" id="piano-${esc(x.id)}"><h3>${T(x.titolo)}</h3>
    ${x.sotto ? `<p class="minimo">${T(x.sotto)}</p>` : ""}
    ${x.intro ? `<p class="piccolo">${T(x.intro)}</p>` : ""}
    ${x.righe ? lista(x.righe) : ""}
    ${(x.gruppi || []).map((g) => `<h4 class="sotto-tit">${T(g.titolo)}</h4>${lista(g.righe)}`).join("")}
    ${x.aggiunte ? `<h4 class="sotto-tit">${esc(lng === "en" ? "With" : "Con")}</h4>${lista(x.aggiunte)}` : ""}
    ${x.note ? `<div class="stack" data-s="sd6f2a">${x.note.map((n) => `<div class="avviso">${I.info}<div>${T(n)}</div></div>`).join("")}</div>` : ""}
    ${x.dopo ? `<h4 class="sotto-tit">${T(x.dopo.titolo)}</h4>${lista(x.dopo.righe)}` : ""}
  </section>`;
}

export function render() {
  if (!lng) lng = lingua();
  if (!testo && stato === "chiuso") { const c = codiceSalvato(); if (c) { apri(c); } }
  if (!testo) {
    return `<section class="card"><h3>${I.lucchetto} ${esc(L({ it: "Il testo del piano", en: "The plan text" }))}</h3>
      <p class="piccolo muted">${esc(L({ it: "È personale, quindi è cifrato: si apre con il codice dell'app, solo su questo telefono.", en: "It is personal, so it is encrypted: it opens with the app's code, only on this phone." }))}</p>
      ${stato === "apro" ? `<p class="piccolo">${esc(L({ it: "Apro il testo...", en: "Opening the text..." }))}</p>` : `<form data-invia="apriPianoTesto" class="stack">
        <label class="campo"><span>${esc(L({ it: "Codice dell'app", en: "App code" }))}</span><input name="codice" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" required></label>
        ${stato === "errore" ? `<p class="piccolo" role="alert">${I.avviso} ${esc(L({ it: "Il codice non apre il testo.", en: "The code does not open the text." }))}</p>` : ""}
        <button class="btn primario pieno">${I.lucchetto}${esc(L({ it: "Apri", en: "Open" }))}</button></form>`}
    </section>`;
  }
  const x = testo;
  return `<div class="seg" role="tablist" aria-label="${esc(L({ it: "Lingua del testo", en: "Text language" }))}">
      <button class="${lng === "it" ? "attivo" : ""}" data-az="linguaPiano" data-l="it">${esc(L({ it: "Originale (italiano)", en: "Original (Italian)" }))}</button>
      <button class="${lng === "en" ? "attivo" : ""}" data-az="linguaPiano" data-l="en">English</button></div>
    <section class="card evidenza"><h3>${T(x.titolo)}</h3><p class="piccolo">${esc(x.autrice)}</p><p class="minimo">${T(x.nota_traduzione)}</p>
      <nav class="indice piccolo">${x.sezioni.map((z) => `<a href="#/cibo/piano" data-az="vaiSezione" data-id="${esc(z.id)}">${T(z.titolo)}</a>`).join(" · ")}</nav></section>
    ${x.sezioni.map(sezione).join("")}
    <section class="card piano-sez"><h3>${T(x.lettera.titolo)}</h3>${x.lettera.paragrafi.map((p) => `<p class="piccolo">${T(p)}</p>`).join("")}</section>
    <section class="card piano-sez"><h3>${T(x.indicazioni.titolo)}</h3>${lista(x.indicazioni.righe)}<p class="piccolo">${T(x.chiusura)}</p><p class="minimo">${esc(x.autrice)}</p></section>`;
}

registra({
  apriPianoTesto: (d, form) => { const c = String(new FormData(form).get("codice") || "").trim(); if (c) apri(c); },
  linguaPiano: (d) => { lng = d.l; ridisegna(); },
  vaiSezione: (d) => { const el = document.getElementById("piano-" + d.id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); },
});
