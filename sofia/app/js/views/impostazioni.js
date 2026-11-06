/* Impostazioni: profile, plan preferences, language and theme, privacy, credits. */
import { S, cambia } from "../store.js";
import { t, L, impostaLingua } from "../i18n.js";
import { I, esc } from "../ui.js";
import { registra, toast } from "../ctx.js";
import { ALIMENTI } from "../data/alimenti.js";
import { FONTE } from "../data/piano.js";

export const titolo = () => t("impostazioni");

/* Foods she may not want: only those the planner can work around. */
const ESCLUDIBILI = ["polpo_cotto", "polpo_crudo", "calamari", "gamberi", "alici", "pesce_spada", "salmone", "salmone_affumicato", "tonno", "merluzzo", "pesce_bianco", "coniglio", "vitello", "maiale", "tacchino", "ragu", "ricotta_light", "fiocchi_latte", "philadelphia_light", "kefir", "yogurt_greco", "prugne_secche", "hummus", "cioccolato", "miele", "marmellata"];

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
    <details><summary class="piccolo"><strong>${esc(L({ it: "Alimenti che non vuoi nel rimescolo", en: "Foods you do not want in the shuffle" }))}</strong> (${(pr.escludi || []).length})</summary>
      <p class="minimo">${esc(L({ it: "Il rimescolo li evita restando dentro i limiti del piano. Se un gruppo resta vuoto, il consiglio te lo dice.", en: "The shuffle avoids them while staying within the plan's limits. If a group runs empty, the council tells you." }))}</p>
      ${ESCLUDIBILI.map((a) => `<div class="interruttore"><span>${esc(L(ALIMENTI[a]))}</span><input type="checkbox" ${(pr.escludi || []).includes(a) ? "checked" : ""} data-cambia="escludi" data-a="${a}"></div>`).join("")}
    </details>
    <p class="minimo">${esc(L({ it: "Le modifiche valgono dalla prossima settimana creata o dal prossimo rimescolo.", en: "Changes apply from the next week created or the next shuffle." }))}</p></section>

  <section class="card"><h3>${esc(L({ it: "Lingua e aspetto", en: "Language and look" }))}</h3>
    <div class="seg"><button class="${im.lingua === "it" ? "attivo" : ""}" data-az="lingua" data-l="it">Italiano</button><button class="${im.lingua === "en" ? "attivo" : ""}" data-az="lingua" data-l="en">English</button></div>
    <div class="seg"><button class="${im.tema === "auto" ? "attivo" : ""}" data-az="tema" data-v="auto">${esc(L({ it: "Automatico", en: "Automatic" }))}</button><button class="${im.tema === "chiaro" ? "attivo" : ""}" data-az="tema" data-v="chiaro">${esc(L({ it: "Chiaro", en: "Light" }))}</button><button class="${im.tema === "scuro" ? "attivo" : ""}" data-az="tema" data-v="scuro">${esc(L({ it: "Scuro", en: "Dark" }))}</button></div></section>

  <section class="card"><h3>${I.lucchetto} ${esc(L({ it: "Privacy", en: "Privacy" }))}</h3>
    <ul class="piccolo"><li>${esc(L({ it: "Peso, esami, diario, farmaci e profilo restano in questo browser. Nessun server li riceve.", en: "Weight, results, diary, medicines and profile stay in this browser. No server receives them." }))}</li>
    <li>${esc(L({ it: "L'unica richiesta in rete è la lista pubblica di ricette, sullo stesso indirizzo dell'app. Niente font, statistiche o servizi esterni.", en: "The only network request is the public recipe list, on the app's own address. No external fonts, analytics or services." }))}</li>
    <li>${esc(L({ it: "Per installarla: Safari, Condividi, Aggiungi alla schermata Home. Su Android: menu, Installa app.", en: "To install: Safari, Share, Add to Home Screen. On Android: menu, Install app." }))}</li></ul></section>

  <section class="card"><h3>${esc(L({ it: "Crediti", en: "Credits" }))}</h3>
    <p class="piccolo">${esc(L({ it: `Piano alimentare: ${FONTE.autrice}, ${L(FONTE.ruolo)}. L'app traduce il suo schema senza cambiarlo; le domande aperte sono nella pagina del consiglio.`, en: `Nutrition plan: ${FONTE.autrice}, ${L(FONTE.ruolo)}. The app translates her plan without changing it; open questions are on the council page.` }))}</p>
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
  escludi: (d, el) => cambia((s) => {
    const set = new Set(s.pref.escludi || []);
    if (el.checked) set.add(d.a); else set.delete(d.a);
    s.pref.escludi = [...set];
  }),
  lingua: (d) => { impostaLingua(d.l); cambia((s) => { s.impostazioni.lingua = d.l; }); },
  tema: (d) => cambia((s) => { s.impostazioni.tema = d.v; }),
});
void S;
