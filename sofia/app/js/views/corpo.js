/* Corpo 5D: space (3D), time (her data over time), food (what reaches which system). */
import { S } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, dataConAnno, statoHtml, numAuto, applicaStili } from "../ui.js";
import { registra, apriFoglio } from "../ctx.js";
import { ORGANI, statoCorpo, dateDati, punteggioOrgano, renaleFuoriRange } from "../engine/salute.js";
import { ESAME } from "../data/esami.js";
import { impattiCibo, organiDelCibo, cibiPerOrgano, CIBI_5D, massimoNelPiano } from "../engine/impatti.js";
import { valoriVoci } from "../engine/nutrizione.js";
import { ALIMENTI, nome } from "../data/alimenti.js";
import { isoData } from "../engine/planner.js";

let modo = "salute", cibo = null, indiceTempo = null, istanza = null, involucro = null, gioco = null, fase = null, scelto = null;

/* What each part is, in plain words (general physiology, no claims about her). */
const COSA_E = {
  brain: { it: "Il cervello guida pensieri, memoria, umore e sonno. Usa molta energia, soprattutto zuccheri, e ha bisogno di grassi buoni come il DHA.", en: "The brain runs thinking, memory, mood and sleep. It uses a lot of energy, mostly sugar, and needs good fats such as DHA." },
  heart_vessels: { it: "Il cuore pompa il sangue in tutto il corpo attraverso arterie e vene; la pressione e i grassi nel sangue dicono come stanno.", en: "The heart pumps blood round the body through arteries and veins; blood pressure and blood fats show how they are doing." },
  kidneys: { it: "I reni filtrano il sangue: tolgono scorie e acqua in più con l'urina e aiutano a tenere giusta la pressione. Nel lupus si controllano con creatinina, eGFR ed esame delle urine.", en: "The kidneys filter the blood: they remove waste and extra water in the urine and help keep blood pressure right. In lupus they are checked with creatinine, eGFR and urine tests." },
  gut: { it: "L'intestino assorbe i nutrienti del cibo. Nella celiachia il glutine lo infiamma: senza glutine si ripara.", en: "The gut absorbs the nutrients in food. In coeliac disease gluten inflames it: without gluten it heals." },
  blood: { it: "Il sangue porta ossigeno e nutrienti a ogni cellula e riporta indietro le scorie. Globuli rossi, ferro e vitamina B12 servono a portare l'ossigeno.", en: "Blood carries oxygen and nutrients to every cell and takes waste away. Red cells, iron and vitamin B12 are needed to carry oxygen." },
  immune: { it: "Il sistema immunitario difende il corpo dai germi. Nel lupus si rivolge per errore contro il corpo stesso: per questo ci sono i farmaci e gli esami.", en: "The immune system defends the body from germs. In lupus it turns against the body by mistake: that is why there are medicines and tests." },
  joints: { it: "Le articolazioni uniscono le ossa e permettono di muoversi. Nel lupus possono fare male o gonfiarsi.", en: "Joints link the bones and let you move. In lupus they can ache or swell." },
  skin: { it: "La pelle protegge il corpo. Nel lupus può reagire al sole: la protezione solare aiuta.", en: "The skin protects the body. In lupus it can react to sunlight: sun protection helps." },
  bones: { it: "Le ossa sostengono il corpo e conservano il calcio. Calcio, vitamina D e proteine le tengono forti.", en: "Bones hold the body up and store calcium. Calcium, vitamin D and protein keep them strong." },
  metabolism: { it: "Il metabolismo è come il corpo usa l'energia del cibo. Peso e girovita mostrano l'equilibrio tra calorie mangiate e usate.", en: "Metabolism is how the body uses the energy in food. Weight and waist show the balance between calories eaten and used." },
  liver: { it: "Il fegato smista i nutrienti che arrivano dall'intestino, fa da magazzino e pulisce il sangue da molte sostanze, anche dai farmaci.", en: "The liver sorts the nutrients that arrive from the gut, stores energy and clears many substances from the blood, medicines too." },
  muscle: { it: "I muscoli muovono il corpo e consumano energia. Le proteine li mantengono, il movimento li rinforza.", en: "Muscles move the body and use energy. Protein maintains them, movement makes them stronger." },
};
/* The steps of the journey, in plain words. */
const PASSI = [
  { it: ["Bocca e stomaco", "Masticato e mescolato con i succhi dello stomaco, il cibo diventa una crema."], en: ["Mouth and stomach", "Chewed and mixed with stomach juices, food turns into a paste."] },
  { it: ["Intestino", "Nell'intestino tenue proteine, grassi e carboidrati vengono spezzati in pezzi piccolissimi che passano nel sangue. Le fibre vanno avanti fino al colon e nutrono i batteri buoni."], en: ["Gut", "In the small intestine protein, fat and carbohydrate are broken into tiny pieces that pass into the blood. Fibre goes on to the colon and feeds the good bacteria."] },
  { it: ["Sangue e fegato", "Il sangue porta i nutrienti al fegato, che li smista, e poi a tutto il corpo."], en: ["Blood and liver", "The blood takes the nutrients to the liver, which sorts them, and then round the whole body."] },
];
const nomeOrgano = (id) => L(ORGANI.find((o) => o.id === id) || { it: id, en: id });
const COLORE = { ok: "#7be0a0", attenzione: "#ffc96b", male: "#ff7a6b", nd: "#8f86a8" };

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
  const nota = `<div class="nota5d">${esc(modo === "cibo" ? L({ it: "Scegli un alimento e segui il suo viaggio.", en: "Pick a food and follow its journey." }) : L({ it: "Trascina per ruotare, tocca una parte per sapere cos'è.", en: "Drag to rotate, tap a part to see what it is." }))}</div>
    <div class="viaggio5d" id="viaggio5d" aria-live="polite" ${modo === "cibo" && cibo ? "" : "hidden"}>${didascalia()}</div>`;
  const sotto = modo === "cibo"
    ? `<div class="sotto"><div class="cibi">${CIBI_5D.map((id) => `<button class="${cibo === id ? "attivo" : ""}" data-az="cibo5d" data-id="${id}">${esc(nome(id, lingua()).split(" (")[0])}</button>`).join("")}</div></div>`
    : `<div class="sotto"><div class="tempo"><button class="play" data-az="play5d" aria-label="${esc(gioco ? L({ it: "Pausa", en: "Pause" }) : L({ it: "Riproduci nel tempo", en: "Play over time" }))}">${gioco ? I.pausa : I.play}</button>
        <input type="range" min="0" max="${Math.max(0, date.length - 1)}" value="${date.length ? date.indexOf(quando) : 0}" data-input="tempo5d" aria-label="${esc(L({ it: "Data", en: "Date" }))}" ${date.length < 2 ? "disabled" : ""}>
        <span class="quando" id="quando5d">${esc(date.length ? dataConAnno(quando) : L({ it: "nessun dato", en: "no data" }))}</span></div></div>`;
  return `<div class="corpo5d" id="scena5d">${sopra}${nota}${sotto}</div>
    <div class="parti5d" role="group" aria-label="${esc(L({ it: "Parti del corpo", en: "Body parts" }))}">${ORGANI.map((o) => `<button class="chip ${scelto === o.id ? "attivo" : ""}" data-az="organo5d" data-id="${o.id}"><i class="pallino-mini" data-bg="${COLORE[stati[o.id].stato]}"></i>${esc(L(o))}</button>`).join("")}</div>
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

function porzioneDelPiano(id) {
  const g = massimoNelPiano(id);
  if (g) return { a: id, q: g, u: "g" };
  if (id === "uovo") return { a: id, q: 1, u: "pz" };
  return null;
}
const metePer = (id) => {
  const ordine = ["heart_vessels", "brain", "muscle", "bones", "immune", "blood", "skin", "metabolism", "liver", "kidneys", "joints"];
  const imp = impattiCibo(id).filter((x) => x.stato === "ok").map((x) => x.organo);
  return ordine.filter((o) => imp.includes(o)).slice(0, 4);
};
function didascalia() {
  if (!cibo) return "";
  const n = nome(cibo, lingua()).split(" (")[0];
  if (fase == null) return `<strong>${esc(n)}</strong><div>${esc(L({ it: "Premi Ripeti per seguire il viaggio.", en: "Press Replay to follow the journey." }))}</div>`;
  if (fase.i === -1) return `<strong>${esc(n)}</strong><div>${esc(L({ it: "Fine del viaggio. Sotto trovi tutto, passo per passo.", en: "End of the journey. Below you find it all, step by step." }))}</div><button class="btn piccolo" data-az="ripetiViaggio">${I.play}${esc(L({ it: "Ripeti", en: "Replay" }))}</button>`;
  if (fase.organo && fase.i >= 3) {
    const righe = impattiCibo(cibo).filter((x) => x.organo === fase.organo && x.stato === "ok").map((x) => L(x.claim.testo));
    return `<div class="minimo">${fase.i + 1}. ${esc(nomeOrgano(fase.organo))}</div><div>${esc([...new Set(righe)].slice(0, 2).join(". "))}.</div>`;
  }
  const p = PASSI[Math.min(fase.i, 2)][lingua() === "en" ? "en" : "it"];
  return `<div class="minimo">${fase.i + 1}. ${esc(p[0])}</div><div>${esc(p[1])}</div>`;
}
function avviaViaggio() {
  if (!cibo) return;
  if (!istanza) { viaggioTesto(); return; }
  const mete = metePer(cibo);
  const nomi = Object.fromEntries([...mete, "gut", "blood"].map((id) => [id, nomeOrgano(id)]));
  istanza.viaggio(["gut", "blood", ...mete], (i, organo) => {
    fase = { i, organo };
    const el = document.getElementById("viaggio5d");
    if (el) { el.hidden = false; el.innerHTML = didascalia(); }
  }, nomi);
}

function pannelloCibo() {
  if (!cibo) return `<div class="card vuoto"><div class="grande">${esc(L({ it: "Scegli un alimento del piano", en: "Pick a food from the plan" }))}</div><p class="piccolo">${esc(L({ it: "Vedrai il suo viaggio nel corpo: stomaco, intestino, sangue e i sistemi a cui serve.", en: "You will see its journey through the body: stomach, gut, blood and the systems it serves." }))}</p></div>`;
  const imp = impattiCibo(cibo, { renaleFuoriRange: renaleFuoriRange(S(), isoData(new Date())) });
  const por = porzioneDelPiano(cibo);
  const val = por ? valoriVoci([por]) : null;
  const ruoli = val && val.completo ? `<div class="card piatta" data-s="sd2c17"><strong>${esc(L({ it: "Cosa porta una porzione del piano", en: "What one plan portion brings" }))} (${esc(por.u === "pz" ? `${por.q} ${L({ it: "pezzo", en: "piece" })}` : `${por.q} g`)})</strong>
      <ul class="piccolo">
        <li>${esc(L({ it: `Energia: circa ${Math.round(val.tot.kcal)} kcal`, en: `Energy: about ${Math.round(val.tot.kcal)} kcal` }))}</li>
        ${val.tot.prot >= 1 ? `<li>${esc(L({ it: `Proteine ${Math.round(val.tot.prot)} g: i mattoni di muscoli e tessuti`, en: `Protein ${Math.round(val.tot.prot)} g: building blocks for muscles and tissues` }))}</li>` : ""}
        ${val.tot.carb >= 1 ? `<li>${esc(L({ it: `Carboidrati ${Math.round(val.tot.carb)} g: energia, soprattutto per cervello e muscoli`, en: `Carbohydrate ${Math.round(val.tot.carb)} g: energy, above all for brain and muscles` }))}</li>` : ""}
        ${val.tot.fat >= 1 ? `<li>${esc(L({ it: `Grassi ${Math.round(val.tot.fat)} g: energia di riserva; aiutano ad assorbire le vitamine A, D, E e K`, en: `Fat ${Math.round(val.tot.fat)} g: stored energy; they help absorb vitamins A, D, E and K` }))}</li>` : ""}
        ${val.tot.fib >= 1 ? `<li>${esc(L({ it: `Fibre ${Math.round(val.tot.fib)} g: nutrono i batteri buoni dell'intestino e saziano`, en: `Fibre ${Math.round(val.tot.fib)} g: they feed the good gut bacteria and keep you full` }))}</li>` : ""}
      </ul><p class="fonte">${esc(L({ it: "Valori: tabelle CREA, CIQUAL e USDA del consiglio", en: "Values: CREA, CIQUAL and USDA tables checked by the council" }))}</p></div>` : "";
  const passi = `<div class="card piatta" data-s="sd2c17"><strong>${esc(L({ it: "Il viaggio nel corpo", en: "The journey through the body" }))}</strong>
      <ol class="piccolo passi-viaggio">${PASSI.map((p, i) => `<li class="${fase && fase.i === i ? "ora" : ""}"><strong>${esc(p[lingua() === "en" ? "en" : "it"][0])}</strong>: ${esc(p[lingua() === "en" ? "en" : "it"][1])}</li>`).join("")}
      ${metePer(cibo).map((o, i) => `<li class="${fase && fase.organo === o && fase.i >= 3 ? "ora" : ""}"><strong>${esc(nomeOrgano(o))}</strong>: ${esc([...new Set(imp.filter((x) => x.organo === o && x.stato === "ok").map((x) => L(x.claim.testo)))].slice(0, 2).join(". "))}.</li>`).join("")}</ol>
      <button class="btn piccolo" data-az="ripetiViaggio">${I.play}${esc(L({ it: "Guarda il viaggio", en: "Watch the journey" }))}</button></div>`;
  const gl = (ALIMENTI[cibo] || {}).glutine;
  const intestino = gl === "certificata"
    ? { it: "Solo se certificato senza glutine: così protegge l'intestino nella celiachia (dieta senza glutine rigorosa, ESsCD).", en: "Only if certified gluten free: then it protects the gut in coeliac disease (strict gluten-free diet, ESsCD)." }
    : gl === "etichetta"
      ? { it: "Se comprato con la dicitura senza glutine: così protegge l'intestino nella celiachia (dieta senza glutine rigorosa, ESsCD).", en: "If bought labelled gluten free: then it protects the gut in coeliac disease (strict gluten-free diet, ESsCD)." }
      : { it: "Naturalmente senza glutine: protegge l'intestino nella celiachia (dieta senza glutine rigorosa, ESsCD).", en: "Naturally gluten free: it protects the gut in coeliac disease (strict gluten-free diet, ESsCD)." };
  const perOrgano = {};
  for (const x of imp) (perOrgano[x.organo] = perOrgano[x.organo] || []).push(x);
  return `<h2 class="sez">${esc(nome(cibo, lingua()))}</h2>
    ${passi}${ruoli}
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
    <h2>${esc(L(o))}</h2>
    <p class="piccolo">${esc(L(COSA_E[o.id] || { it: "", en: "" }))}</p>
    <div>${statoHtml(r.stato)} ${r.punteggio != null ? `<span class="minimo">${r.punteggio}/100</span>` : ""}</div>
    <h3 data-s="s56f43">${esc(L({ it: "Da cosa nasce il colore", en: "Where the colour comes from" }))}</h3>
    ${r.parti.length ? `<ul class="piccolo">${r.parti.map((p) => `<li>${esc(descriviParte(p))}${p.data ? ` (${esc(dataConAnno(p.data))})` : ""}: ${p.punteggio}/100</li>`).join("")}</ul>` : `<p class="piccolo muted">${esc(L({ it: "Nessun dato.", en: "No data." }))}</p>`}
    ${cibi.length ? `<h3>${esc(L({ it: "Alimenti del piano che lo sostengono", en: "Plan foods that support it" }))}</h3><ul class="piccolo">${cibi.map((c) => `<li><strong>${esc(nome(c.id, lingua()))}</strong>: ${esc([...new Set(c.claims.map((x) => L(x.nutriente)))].join(", "))}</li>`).join("")}</ul><p class="fonte">${esc(L({ it: "Indicazioni sulla salute autorizzate, Reg. (UE) 432/2012", en: "Authorised health claims, Reg. (EU) 432/2012" }))}</p>` : `<p class="piccolo muted">${esc(L({ it: "Per questo sistema non esistono indicazioni sulla salute autorizzate dall'UE legate agli alimenti del piano: l'app non inventa collegamenti.", en: "For this system there are no EU-authorised health claims linked to the plan's foods: the app does not invent links." }))}</p>`}`;
}

/* Mount the 3D scene after each render, reusing the same canvas. */
export async function dopo(s) {
  const posto = document.getElementById("scena5d");
  if (!posto) return;
  if (!istanza && senza3d) { mostraSenza3d(posto); return; }
  if (!involucro) { involucro = document.createElement("div"); involucro.style.position = "absolute"; involucro.style.inset = "0"; }
  posto.prepend(involucro);
  if (!istanza) {
    try {
      const { creaCorpo } = await import("../three/corpo3d.js");
      const ridotto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      istanza = await creaCorpo(involucro, { ridotto, alTocco: (id) => { scelto = id; istanza.seleziona(id, nomeOrgano(id)); aggiornaChip(); apriFoglio(() => foglioOrgano(id)); } });
    } catch (e) {
      senza3d = await motivo3d(e);
      mostraSenza3d(document.getElementById("scena5d"));
      return;
    }
  }
  istanza.aggiorna(statoCorpo(s, dataScelta(s)));
  istanza.vista(modo === "cervello" ? "cervello" : "corpo");
  if (scelto && modo !== "cibo") istanza.seleziona(scelto, nomeOrgano(scelto));
}

/* Why the 3D model is missing, in words Sofia can act on; the rest of the
   screen (parts, what they are, the food journey) works without it. */
let senza3d = null;
async function motivo3d(err) {
  const dopo = { it: " Sotto trovi tutto: le parti del corpo, cosa sono e il viaggio del cibo.", en: " Below you find it all: the body parts, what they are and the food journey." };
  const con = (x) => ({ it: x.it + dopo.it, en: x.en + dopo.en });
  if (err && err.message === "webgl") return con({ it: "Questo telefono non mostra il 3D (WebGL non disponibile).", en: "This phone cannot show 3D (WebGL not available)." });
  if (navigator.onLine === false) return con({ it: "Sei offline e il modello 3D non è ancora sul telefono: si scarica alla prima connessione e poi resta.", en: "You are offline and the 3D model is not on the phone yet: it downloads on the first connection and then stays." });
  try {
    const r = await fetch("vendor/three.min.js", { method: "HEAD", cache: "no-store", credentials: "same-origin" });
    if (r.status === 401 || r.status === 403) return con({ it: `Il sito ha rifiutato il modello 3D (codice ${r.status}, accesso non autorizzato): l'accesso al sito va riaperto nelle impostazioni Netlify.`, en: `The site refused the 3D model (code ${r.status}, not authorised): site access must be reopened in the Netlify settings.` });
    if (!r.ok) return con({ it: `Il modello 3D non si è scaricato (codice ${r.status}).`, en: `The 3D model did not download (code ${r.status}).` });
  } catch (e) {
    return con({ it: "Il modello 3D non si è scaricato: il sito non risponde.", en: "The 3D model did not download: the site does not answer." });
  }
  return con({ it: "Il modello 3D non si è avviato su questo telefono.", en: "The 3D model did not start on this phone." });
}

function mostraSenza3d(posto) {
  if (involucro) { involucro.remove(); involucro = null; }
  if (!posto || posto.querySelector(".no-webgl")) return;
  posto.classList.add("senza3d");
  posto.insertAdjacentHTML("beforeend", `<div class="no-webgl" role="status"><p>${esc(L(senza3d))}</p><button class="btn piccolo" data-az="riprova5d">${esc(L({ it: "Riprova", en: "Try again" }))}</button></div>`);
}

/* Without 3D the journey runs as text: the same steps, one after the other. */
let passoTesto = null;
function viaggioTesto() {
  if (passoTesto) { clearInterval(passoTesto); passoTesto = null; }
  const tappe = [0, 1, 2, ...metePer(cibo).map((o, i) => ({ i: 3 + i, organo: o }))];
  let k = 0;
  const mostra = () => {
    if (k >= tappe.length) { clearInterval(passoTesto); passoTesto = null; fase = { i: -1 }; }
    else { const x = tappe[k++]; fase = typeof x === "number" ? { i: x, organo: null } : x; }
    const el = document.getElementById("viaggio5d");
    if (el) { el.hidden = false; el.innerHTML = didascalia(); }
    for (const li of document.querySelectorAll(".passi-viaggio li")) li.classList.remove("ora");
    const lis = document.querySelectorAll(".passi-viaggio li");
    if (fase.i >= 0 && lis[fase.i]) lis[fase.i].classList.add("ora");
  };
  mostra();
  passoTesto = setInterval(mostra, 2600);
}

function aggiornaChip() {
  for (const b of document.querySelectorAll(".parti5d .chip")) b.classList.toggle("attivo", b.dataset.id === scelto);
}

export function lascia() {
  if (gioco) { clearInterval(gioco); gioco = null; }
  if (passoTesto) { clearInterval(passoTesto); passoTesto = null; }
  if (istanza) { istanza.distruggi(); istanza = null; }
  involucro = null;
}

registra({
  riprova5d: () => { location.reload(); },
  modo5d: (d) => {
    modo = d.m;
    fase = null;
    if (istanza) { istanza.fermaViaggio(); istanza.deseleziona(); }
    if (istanza) istanza.vista(modo === "cervello" ? "cervello" : "corpo");
    rinfresca();
  },
  cibo5d: (d) => {
    cibo = d.id;
    fase = null;
    if (istanza) istanza.deseleziona();
    rinfresca();
    avviaViaggio();
  },
  ripetiViaggio: () => { fase = null; avviaViaggio(); },
  organo5d: (d) => {
    scelto = d.id;
    if (istanza) { istanza.evidenzia([d.id]); istanza.seleziona(d.id, nomeOrgano(d.id)); }
    aggiornaChip();
    apriFoglio(() => foglioOrgano(d.id));
  },
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
