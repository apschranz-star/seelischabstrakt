/* Il consiglio: who checks what, with which seniority, and on which evidence. */
import { S } from "../store.js";
import { t, L } from "../i18n.js";
import { I, esc, dataConAnno } from "../ui.js";
import { verdettiHtml, esitoHtml, settimanaDi } from "./comuni.js";
import { AGENTI, consiglioSettimana } from "../engine/consiglio.js";
import { isoData } from "../engine/planner.js";
import { renaleFuoriRange } from "../engine/salute.js";
import { DOMANDE_APERTE, FONTE } from "../data/piano.js";
import { CLAIMS, GENERATO, CLINICA } from "../data/evidenze.js";
import { ESAMI } from "../data/esami.js";

export const titolo = () => t("consiglio");

const SVILUPPO = [
  { ruolo: { it: "Architetto capo (presidente)", en: "Lead architect (chair)" }, anz: 1, cosa: { it: "Struttura, integrazione, decisione finale. Pubblica solo ciò che nessun seggio ha bloccato.", en: "Structure, integration, final decision. Publishes only what no seat blocked." } },
  { ruolo: { it: "Responsabile delle prove cliniche", en: "Clinical evidence officer" }, anz: 2, cosa: { it: "Lupus, nefrite lupica, celiachia, esami, eGFR. Veto su ogni frase di salute senza fonte.", en: "Lupus, lupus nephritis, coeliac disease, labs, eGFR. Veto on any health sentence without a source." } },
  { ruolo: { it: "Responsabile dei dati nutrizionali", en: "Nutrition data officer" }, anz: 2, cosa: { it: "Composizione degli alimenti (CREA, CIQUAL, USDA), soglie UE, indicazioni autorizzate.", en: "Food composition (CREA, CIQUAL, USDA), EU thresholds, authorised claims." } },
  { ruolo: { it: "Revisore indipendente (QA)", en: "Independent auditor (QA)" }, anz: 1, cosa: { it: "Non ha scritto nulla: confronta l'app con il PDF del piano e con le fonti. Veto sulla pubblicazione.", en: "Wrote nothing: compares the app with the plan PDF and the sources. Veto on release." } },
];

export function render(s) {
  const oggi = isoData(new Date());
  const w = settimanaDi(s, oggi);
  const dec = w ? consiglioSettimana(w, s.settimane.filter((x) => x.inizio < w.inizio).slice(-2), { renaleFuoriRange: renaleFuoriRange(s, oggi) }) : null;
  const u = s.webCache && s.webCache.ultimo;
  return `<div class="avviso viola">${I.consiglio}<div>${esc(L({ it: "Ogni settimana, ogni pasto rimescolato e ogni ricetta passano da questi seggi. Il seggio più anziano vince: un veto del glutine non può essere superato da nessuno.", en: "Every week, every shuffled meal and every recipe passes these seats. The most senior seat wins: a gluten veto cannot be overruled by anyone." }))}</div></div>
  <h2 class="sez">${esc(L({ it: "I seggi nell'app", en: "The seats in the app" }))}</h2>
  <section class="card">${AGENTI.filter((a) => a.id !== "presidente").sort((a, b) => a.anzianita - b.anzianita).map((a) => `<div class="seggio"><div class="sigillo">${a.anzianita}</div><div><strong>${esc(L(a.nome))}</strong>${a.veto ? ` <span class="etichetta male">veto</span>` : ""}<div class="piccolo muted">${esc(L(a.ruolo))}</div></div></div>`).join("")}
    <div class="seggio"><div class="sigillo">★</div><div><strong>${esc(L(AGENTI.find((a) => a.id === "presidente").nome))}</strong><div class="piccolo muted">${esc(L(AGENTI.find((a) => a.id === "presidente").ruolo))}</div></div></div></section>
  ${dec ? `<h2 class="sez">${esc(L({ it: "Questa settimana", en: "This week" }))} ${esitoHtml(dec.esito)}</h2><section class="card">${verdettiHtml(dec)}</section>` : ""}
  <h2 class="sez">${esc(L({ it: "Ricette dal web", en: "Web recipes" }))}</h2>
  <section class="card">${u ? `<p class="piccolo">${esc(L({ it: `Ultimo giro ${dataConAnno(u.data)}: ${u.lette} lette, ${u.approvate} approvate, ${u.adattate} adattate, ${u.respinte} respinte.`, en: `Last run ${dataConAnno(u.data)}: ${u.lette} read, ${u.approvate} approved, ${u.adattate} adapted, ${u.respinte} rejected.` }))}</p>` : `<p class="piccolo muted">${esc(L({ it: "Il primo giro parte in automatico quando l'app è online.", en: "The first run starts automatically when the app is online." }))}</p>`}<a class="btn piccolo" href="#/cibo/web">${esc(L({ it: "Vedi le ricette e i motivi", en: "See the recipes and reasons" }))}</a></section>
  <h2 class="sez">${esc(L({ it: "Su quali prove", en: "On which evidence" }))}</h2>
  <section class="card"><ul class="piccolo">
    <li>${esc(L({ it: `Piano: ${FONTE.autrice}, ${L(FONTE.ruolo)}. Ogni dose dell'app viene dal suo schema.`, en: `Plan: ${FONTE.autrice}, ${L(FONTE.ruolo)}. Every amount in the app comes from her plan.` }))}</li>
    <li>${esc(L({ it: `${CLAIMS.length} indicazioni sulla salute autorizzate (Reg. UE 432/2012), testo ufficiale in italiano e inglese, verificate il ${GENERATO}.`, en: `${CLAIMS.length} authorised health claims (EU Reg. 432/2012), official Italian and English wording, checked on ${GENERATO}.` }))}</li>
    <li>${esc(L({ it: "Composizione degli alimenti: CREA (Italia), CIQUAL 2020 (Francia), USDA FoodData Central, con controllo incrociato.", en: "Food composition: CREA (Italy), CIQUAL 2020 (France), USDA FoodData Central, cross-checked." }))}</li>
    <li>${esc(L({ it: `${ESAMI.length} esami con fonti KDIGO, EULAR, ESsCD; eGFR CKD-EPI 2021 (Inker, NEJM 2021); BMI secondo l'OMS.`, en: `${ESAMI.length} lab markers sourced to KDIGO, EULAR, ESsCD; eGFR CKD-EPI 2021 (Inker, NEJM 2021); BMI per WHO.` }))}</li>
    ${CLINICA ? `<li>${esc(L({ it: `${CLINICA.dieta.length} punti su lupus, reni, celiachia e farmaci, ciascuno con livello di prova.`, en: `${CLINICA.dieta.length} points on lupus, kidneys, coeliac disease and medicines, each with an evidence grade.` }))}</li>` : ""}
    <li>${esc(L({ it: "Variabilità biologica EFLM: non usata, la licenza non lo permette senza accordo. Per l'eGFR si usa il ±16,5% da una meta-analisi pubblicata.", en: "EFLM biological variation: not used, the licence does not allow it without an agreement. For eGFR the ±16.5% from a published meta-analysis is used." }))}</li>
  </ul></section>
  <h2 class="sez">${esc(L({ it: "Il consiglio che ha costruito l'app", en: "The council that built the app" }))}</h2>
  <section class="card">${SVILUPPO.map((x) => `<div class="seggio"><div class="sigillo">${x.anz}</div><div><strong>${esc(L(x.ruolo))}</strong><div class="piccolo muted">${esc(L(x.cosa))}</div></div></div>`).join("")}
    <p class="minimo">${esc(L({ it: "Regole complete in docs/COUNCIL.md nel repository.", en: "Full rules in docs/COUNCIL.md in the repository." }))}</p></section>
  <h2 class="sez">${esc(L({ it: "Domande aperte", en: "Open questions" }))}</h2>
  <section class="card"><h3>${esc(L({ it: "Per la nutrizionista", en: "For the nutritionist" }))}</h3><ul class="piccolo">${DOMANDE_APERTE.map((d) => `<li>${esc(L(d))}</li>`).join("")}</ul>
    <h3>${esc(L({ it: "Per i medici", en: "For the doctors" }))}</h3><ul class="piccolo">
      <li>${esc(L({ it: "Quali farmaci prendo e a che ora rispetto ai pasti?", en: "Which medicines do I take and when relative to meals?" }))}</li>
      <li>${esc(L({ it: "Sono immunodepressa? Cambia qualcosa per cibi crudi o germogli?", en: "Am I immunosuppressed? Does it change anything for raw foods or sprouts?" }))}</li>
      <li>${esc(L({ it: "L'avena certificata senza glutine va bene per me, e da quando?", en: "Are certified gluten-free oats fine for me, and from when?" }))}</li>
      <li>${esc(L({ it: "Le proteine del piano sono calcolate sul peso attuale o su quello ideale?", en: "Is the plan's protein based on my current or ideal weight?" }))}</li>
      <li>${esc(L({ it: "Posso prendere omega 3? Quale prodotto e quale dose?", en: "Can I take omega-3? Which product and dose?" }))}</li>
    </ul></section>`;
}
void S;
