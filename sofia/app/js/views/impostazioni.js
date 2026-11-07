/* Impostazioni: profile, plan preferences, language and theme, privacy, credits. */
import { S, cambia } from "../store.js";
import { t, L, impostaLingua } from "../i18n.js";
import { I, esc } from "../ui.js";
import { registra, toast } from "../ctx.js";
import { ALIMENTI } from "../data/alimenti.js";
import { FONTE } from "../data/piano.js";
import { PESI_PREDEFINITI } from "../engine/nutrizione.js";

const PESI = [
  ["galletta", { it: "1 galletta (g)", en: "1 rice cake (g)" }], ["vasetto", { it: "1 vasetto di yogurt (g)", en: "1 pot of yogurt (g)" }],
  ["uovo", { it: "1 uovo senza guscio (g)", en: "1 egg without shell (g)" }], ["cucchiaino", { it: "1 cucchiaino di parmigiano (g)", en: "1 teaspoon of Parmesan (g)" }],
  ["oliva", { it: "1 oliva piccola (g)", en: "1 small olive (g)" }],
];

export const titolo = () => t("impostazioni");


export function render(s) {
  const p = s.profilo, pr = s.pref, im = s.impostazioni;
  return `<form class="card" data-invia="salvaProfilo"><h3>${esc(L({ it: "Profilo", en: "Profile" }))}</h3>
    <div class="campi2"><label class="campo"><span>${esc(L({ it: "Nome", en: "Name" }))}</span><input name="nome" value="${esc(p.nome)}" maxlength="40" autocomplete="given-name"></label>
    <label class="campo"><span>${esc(L({ it: "Anno di nascita", en: "Birth year" }))}</span><input name="nascita" type="number" min="1930" max="2015" value="${esc(p.nascita || "")}" inputmode="numeric"></label></div>
    <div class="campi2"><label class="campo"><span>${esc(L({ it: "Sesso (per l'eGFR)", en: "Sex (for eGFR)" }))}</span><select name="sesso"><option value="F" ${p.sesso === "F" ? "selected" : ""}>${esc(L({ it: "Femmina", en: "Female" }))}</option><option value="M" ${p.sesso === "M" ? "selected" : ""}>${esc(L({ it: "Maschio", en: "Male" }))}</option></select></label>
    <label class="campo"><span>${esc(L({ it: "Altezza (cm)", en: "Height (cm)" }))}</span><input name="altezza" type="number" min="120" max="220" value="${esc(p.altezza_cm || "")}" inputmode="numeric"></label></div>
    <label class="campo"><span>${esc(L({ it: "Peso obiettivo (kg), se concordato", en: "Goal weight (kg), if agreed" }))}</span><input name="obiettivo" type="number" step="0.1" min="35" max="200" value="${esc(p.pesoObiettivo || "")}" inputmode="decimal"></label>
    <label class="campo"><span>${esc(L({ it: "Farmaci che prendi (restano sul telefono)", en: "Medicines you take (stay on the phone)" }))}</span><textarea name="farmaci" placeholder="${esc(L({ it: "es. idrossiclorochina, micofenolato...", en: "e.g. hydroxychloroquine, mycophenolate..." }))}">${esc(p.farmaci || "")}</textarea></label>
    <div class="interruttore"><span>${esc(L({ it: "Prendo immunosoppressori", en: "I take immunosuppressants" }))}</span><input type="checkbox" name="immuno" ${p.immunosoppressori ? "checked" : ""}></div>
    <p class="minimo">${esc(L({ it: "Servono al consiglio per avvisarti su pompelmo, germogli crudi e iperico. Nessuno li vede tranne te.", en: "The council uses them to warn you about grapefruit, raw sprouts and St John's wort. Nobody sees them but you." }))}</p>
    <button class="btn primario pieno">${esc(t("salva"))}</button></form>

  <section class="card"><h3>${esc(L({ it: "Il piano", en: "The plan" }))}</h3>
    <div class="interruttore"><span>${esc(L({ it: "Mostra lo spuntino (facoltativo)", en: "Show the snack (optional)" }))}</span><input type="checkbox" ${pr.spuntino ? "checked" : ""} data-cambia="pref" data-k="spuntino"></div>
    <div class="interruttore"><span>${esc(L({ it: "Mostra il dopocena (facoltativo)", en: "Show after dinner (optional)" }))}</span><input type="checkbox" ${pr.dopocena ? "checked" : ""} data-cambia="pref" data-k="dopocena"></div>
    <label class="campo"><span>${esc(L({ it: "Pranzi già combinati (max 1 a settimana)", en: "Ready-combined lunches (max 1 a week)" }))}</span><select data-cambia="prefComb"><option value="auto" ${pr.combinato === "auto" ? "selected" : ""}>${esc(L({ it: "Ogni tanto", en: "Now and then" }))}</option><option value="sempre" ${pr.combinato === "sempre" ? "selected" : ""}>${esc(L({ it: "Uno ogni settimana", en: "One every week" }))}</option><option value="mai" ${pr.combinato === "mai" ? "selected" : ""}>${esc(L({ it: "Mai", en: "Never" }))}</option></select></label>
    <a class="btn piccolo" href="#/cibo/miei">${esc(L({ it: `Cibi che non mangi (${(pr.escludi || []).length})`, en: `Foods you don't eat (${(pr.escludi || []).length})` }))}</a>
    <p class="minimo">${esc(L({ it: "Le modifiche valgono dalla prossima settimana creata o dal prossimo rimescolo.", en: "Changes apply from the next week created or the next shuffle." }))}</p></section>

  <section class="card"><h3>${esc(L({ it: "Pesi per contare le calorie", en: "Weights for counting calories" }))}</h3>
    <p class="minimo">${esc(L({ it: "Il piano conta alcuni cibi a pezzi senza dare il peso: l'app usa queste stime. Se la tua confezione dice un altro peso, cambialo qui.", en: "The plan counts some foods in pieces without a weight: the app uses these estimates. If your package says another weight, change it here." }))}</p>
    <div class="campi2">${PESI.map(([k, lab]) => `<label class="campo"><span>${esc(L(lab))}</span><input type="number" min="1" max="500" step="0.5" inputmode="decimal" value="${esc((s.pesiUnita || {})[k] ?? PESI_PREDEFINITI[k])}" data-cambia="pesoUnita" data-k="${k}"></label>`).join("")}</div></section>

  <section class="card"><h3>${esc(L({ it: "Lingua e aspetto", en: "Language and look" }))}</h3>
    <div class="seg"><button class="${im.lingua === "it" ? "attivo" : ""}" data-az="lingua" data-l="it">Italiano</button><button class="${im.lingua === "en" ? "attivo" : ""}" data-az="lingua" data-l="en">English</button></div>
    <div class="seg"><button class="${im.tema === "auto" ? "attivo" : ""}" data-az="tema" data-v="auto">${esc(L({ it: "Automatico", en: "Automatic" }))}</button><button class="${im.tema === "chiaro" ? "attivo" : ""}" data-az="tema" data-v="chiaro">${esc(L({ it: "Chiaro", en: "Light" }))}</button><button class="${im.tema === "scuro" ? "attivo" : ""}" data-az="tema" data-v="scuro">${esc(L({ it: "Scuro", en: "Dark" }))}</button></div></section>

  <section class="card"><h3>${I.lucchetto} ${esc(L({ it: "Privacy", en: "Privacy" }))}</h3>
    <ul class="piccolo"><li>${esc(L({ it: "Peso, esami, diario, farmaci e profilo restano in questo browser. Nessun server li riceve.", en: "Weight, results, diary, medicines and profile stay in this browser. No server receives them." }))}</li>
    <li>${esc(L({ it: "In rete vanno solo due richieste, entrambe all'indirizzo dell'app: la lista pubblica di ricette e, quando cerchi una confezione, il nome del cibo (il server lo cerca su Open Food Facts). Niente font, statistiche o servizi esterni.", en: "Only two requests go to the network, both to the app's own address: the public recipe list and, when you search a package, the food name (the server looks it up on Open Food Facts). No external fonts, analytics or services." }))}</li>
    <li>${esc(L({ it: "Il testo del piano è cifrato e si apre solo con il codice dell'app.", en: "The plan text is encrypted and opens only with the app's code." }))}</li>
    <li>${esc(L({ it: "Per installarla: Safari, Condividi, Aggiungi alla schermata Home. Su Android: menu, Installa app.", en: "To install: Safari, Share, Add to Home Screen. On Android: menu, Install app." }))}</li></ul></section>

  <section class="card"><h3>${esc(L({ it: "Crediti", en: "Credits" }))}</h3>
    <p class="piccolo">${esc(L({ it: `Piano alimentare: la nutrizionista di Sofia (${L(FONTE.ruolo)}); il nome è nel testo del piano. L'app traduce il suo schema senza cambiarlo; le domande aperte sono nella pagina del consiglio.`, en: `Nutrition plan: Sofia's nutritionist (${L(FONTE.ruolo)}); the name is in the plan text. The app translates her plan without changing it; open questions are on the council page.` }))}</p>
    <p class="minimo">${esc(L({ it: "Caratteri Fraunces e Manrope (SIL OFL), three.js (MIT), pdf.js (Apache 2.0). Ricette web: ingredienti e link agli autori originali.", en: "Fonts Fraunces and Manrope (SIL OFL), three.js (MIT), pdf.js (Apache 2.0). Web recipes: ingredients and links to the original authors." }))}</p></section>`;
}

registra({
  salvaProfilo: (d, form) => {
    const f = new FormData(form);
    const n = (k) => { const v = String(f.get(k) || "").replace(",", "."); return v === "" ? null : Number(v); };
    cambia((s) => {
      s.profilo.nome = String(f.get("nome") || "").trim().slice(0, 40) || "Sofia";
      s.profilo.nascita = n("nascita");
      s.profilo.sesso = f.get("sesso") === "M" ? "M" : "F";
      s.profilo.altezza_cm = n("altezza");
      s.profilo.pesoObiettivo = n("obiettivo");
      s.profilo.farmaci = String(f.get("farmaci") || "").slice(0, 600);
      s.profilo.immunosoppressori = !!f.get("immuno");
    });
    toast(L({ it: "Profilo salvato su questo telefono", en: "Profile saved on this phone" }));
  },
  pref: (d, el) => cambia((s) => { s.pref[d.k] = el.checked; }),
  prefComb: (d, el) => cambia((s) => { s.pref.combinato = el.value; }),
  pesoUnita: (d, el) => cambia((s) => {
    const v = Number(String(el.value).replace(",", "."));
    s.pesiUnita = s.pesiUnita || {};
    if (v > 0 && v <= 500) s.pesiUnita[d.k] = v; else delete s.pesiUnita[d.k];
  }),
  lingua: (d) => { impostaLingua(d.l); cambia((s) => { s.impostazioni.lingua = d.l; }); },
  tema: (d) => cambia((s) => { s.impostazioni.tema = d.v; }),
});
void S;
