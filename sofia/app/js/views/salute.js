/* Salute: her numbers, her trends, her lab results. All on this phone. */
import { S, cambia, esportaBackup, importaBackup, cancellaTutto, chiediMemoriaPersistente } from "../store.js";
import { t, L, lingua } from "../i18n.js";
import { I, esc, num, numAuto, dataConAnno, dataBreve, graficoLinea, tile, statoHtml } from "../ui.js";
import { registra, apriFoglio, chiudiFoglio, toast, ridisegna } from "../ctx.js";
import { ESAMI, ESAME, EGFR_CALC, unitaDi } from "../data/esami.js";
import { CLINICA } from "../data/evidenze.js";
import { ORGANI, punteggioOrgano, valutaEsame, serieEsame, gruppiConfrontabili, eta } from "../engine/salute.js";
import { regressione, giorniDa, bmi, categoriaBmi, tendenzaEsponenziale, pearson, cohen, MIN_GIORNI_CORRELAZIONE, media } from "../engine/stats.js";
import { isoData, aggiungiGiorni } from "../engine/planner.js";
import { testoDaPdf, trovaValori } from "../engine/labparse.js";

const SEZIONI = [["panoramica", "panoramica"], ["peso", "peso"], ["esami", "esami"], ["diario", "diario"], ["backup", "backup"]];
export const titolo = () => t("salute");
const oggi = () => isoData(new Date());
const nomeEsame = (id) => L(id === "egfr_calc" ? EGFR_CALC : ESAME[id] || { it: id, en: id });

export function render(s, parti) {
  const sez = SEZIONI.some(([k]) => k === parti[0]) ? parti[0] : "panoramica";
  const seg = `<nav class="seg" aria-label="${esc(t("salute"))}">${SEZIONI.map(([k, lab]) => `<button class="${sez === k ? "attivo" : ""}" data-az="vai" data-h="#/salute/${k}" ${sez === k ? 'aria-current="page"' : ""}>${esc(t(lab))}</button>`).join("")}</nav>`;
  const avvisoDiagnosi = `<p class="minimo" data-s="sd6f2a">${esc(L({ it: "Questi riepiloghi mettono in ordine i tuoi dati rispetto agli intervalli del tuo laboratorio e agli obiettivi del piano. Non sono una diagnosi: le decisioni restano ai tuoi medici.", en: "These summaries organise your data against your lab's ranges and the plan's targets. They are not a diagnosis: decisions stay with your doctors." }))}</p>`;
  const corpo = { panoramica, peso, esami, diario, backup }[sez](s, parti.slice(1));
  return seg + corpo + (sez === "backup" ? "" : avvisoDiagnosi);
}

/* --------------------------------------------------------- overview */
function ultimoPeso(s) { return [...s.pesi].sort((a, b) => (a.data < b.data ? -1 : 1)).pop() || null; }

function panoramica(s) {
  const p = ultimoPeso(s);
  const pesi = [...s.pesi].sort((a, b) => (a.data < b.data ? -1 : 1));
  const prima = pesi.find((x) => giorniDa(p ? p.data : oggi(), x.data) <= 30);
  const b = p && s.profilo.altezza_cm ? bmi(p.kg, s.profilo.altezza_cm) : null;
  const cat = categoriaBmi(b);
  const egfrLab = serieEsame(s, "egfr").pop();
  const egfrCalc = serieEsame(s, "egfr_calc").pop();
  const ultimi = ESAMI.map((e) => serieEsame(s, e.id).pop()).filter(Boolean);
  const fuori = ultimi.filter((r) => ["attenzione", "male"].includes(valutaEsame(r).stato));
  const giorniDiario = Object.keys(s.diario).length;
  return `<div class="griglia2">
    ${tile(t("peso"), p ? num(p.kg, 1) : "-", "kg", p && prima && prima !== p ? `${p.kg - prima.kg <= 0 ? "▼" : "▲"} ${num(Math.abs(p.kg - prima.kg), 1)} kg ${esc(L({ it: "in 30 giorni", en: "in 30 days" }))}` : esc(p ? dataBreve(p.data) : L({ it: "nessun dato", en: "no data" })))}
    ${tile("BMI", b ? num(b, 1) : "-", "", cat ? esc(L(cat)) + " (WHO)" : esc(s.profilo.altezza_cm ? L({ it: "nessun peso", en: "no weight" }) : L({ it: "manca l'altezza", en: "height missing" })))}
    ${tile("eGFR", egfrLab ? num(egfrLab.valore) : egfrCalc ? num(egfrCalc.valore) : "-", "", egfrLab ? esc(L({ it: "del laboratorio", en: "from the lab" })) + " · " + esc(dataBreve(egfrLab.data)) : egfrCalc ? esc(L({ it: "calcolato (CKD-EPI 2021)", en: "calculated (CKD-EPI 2021)" })) : esc(L({ it: "nessun esame", en: "no result" })))}
    ${tile(L({ it: "Esami fuori intervallo", en: "Results out of range" }), String(fuori.length), "", esc(L({ it: `su ${ultimi.length} esami seguiti`, en: `of ${ultimi.length} tracked results` })))}
  </div>
  <h2 class="sez">${esc(L({ it: "Il tuo corpo, sistema per sistema", en: "Your body, system by system" }))}</h2>
  <section class="card">${ORGANI.map((o) => {
    const r = punteggioOrgano(s, o, oggi());
    return `<div class="marker-riga" data-az="vai" data-h="#/corpo"><div class="n">${esc(L(o))}</div><div class="v">${statoHtml(r.stato === "nd" ? "nd" : r.stato)}</div><div class="minimo">${r.parti.length ? esc(L({ it: `${r.parti.length} dati`, en: `${r.parti.length} data points` })) : esc(L({ it: "nessun dato", en: "no data" }))}</div><div class="minimo" data-s="s54c2a">${r.punteggio != null ? r.punteggio + "/100" : ""}</div></div>`;
  }).join("")}</section>
  <section class="card consiglio" data-s="s56f43"><h3>${esc(L({ it: "Analista dei dati", en: "Data analyst" }))}</h3>
    <ul class="piccolo">
      <li>${esc(L({ it: `Pesi registrati: ${s.pesi.length}. La tendenza si calcola da 3 pesate in poi.`, en: `Weights logged: ${s.pesi.length}. The trend is computed from 3 weigh-ins on.` }))}</li>
      <li>${esc(L({ it: `Esami registrati: ${s.esami.length}.`, en: `Results logged: ${s.esami.length}.` }))}</li>
      <li>${esc(L({ it: `Giorni di diario: ${giorniDiario}. Le correlazioni partono da ${MIN_GIORNI_CORRELAZIONE} giorni con entrambi i valori.`, en: `Diary days: ${giorniDiario}. Correlations start from ${MIN_GIORNI_CORRELAZIONE} days with both values.` }))}</li>
      ${!s.profilo.nascita ? `<li>${esc(L({ it: "Manca l'anno di nascita: senza, l'eGFR non si può calcolare.", en: "Birth year missing: without it eGFR cannot be calculated." }))}</li>` : ""}
    </ul></section>`;
}

/* ------------------------------------------------------------ weight */
function peso(s) {
  const pesi = [...s.pesi].sort((a, b) => (a.data < b.data ? -1 : 1));
  const punti = pesi.map((p) => ({ x: p.data, y: p.kg }));
  const tend = tendenzaEsponenziale(punti);
  const ult = pesi[pesi.length - 1];
  const ultimi28 = ult ? pesi.filter((p) => giorniDa(ult.data, p.data) <= 28) : [];
  const reg = regressione(ultimi28.map((p) => ({ t: giorniDa(p.data, ultimi28[0].data), y: p.kg })));
  let stat = `<p class="piccolo muted">${esc(L({ it: "Servono almeno 3 pesate nelle ultime 4 settimane per la tendenza.", en: "At least 3 weigh-ins in the last 4 weeks are needed for the trend." }))}</p>`;
  if (!reg.insufficiente) {
    const sett = reg.b * 7, lo = reg.ic95[0] * 7, hi = reg.ic95[1] * 7;
    const certo = hi < 0 || lo > 0;
    let proiezione = "";
    const obiettivo = s.profilo.pesoObiettivo;
    if (obiettivo && ult && hi < 0 && ult.kg > obiettivo) {
      const settimane = (ult.kg - obiettivo) / Math.abs(sett);
      proiezione = L({ it: `Con questo ritmo l'obiettivo di ${num(obiettivo, 1)} kg arriverebbe tra circa ${num(settimane)} settimane. È una stima: il ritmo cambia.`, en: `At this pace the goal of ${num(obiettivo, 1)} kg would come in about ${num(settimane)} weeks. An estimate: the pace changes.` });
    }
    stat = `<div class="griglia2">${tile(L({ it: "Andamento", en: "Trend" }), `${sett > 0 ? "+" : ""}${num(sett, 2)}`, L({ it: "kg/sett", en: "kg/wk" }), esc(L({ it: `intervallo 95%: ${num(lo, 2)} a ${num(hi, 2)}`, en: `95% interval: ${num(lo, 2)} to ${num(hi, 2)}` })))}
      ${tile(L({ it: "Pesate usate", en: "Weigh-ins used" }), String(reg.n), "", esc(L({ it: `in ${reg.giorni} giorni`, en: `over ${reg.giorni} days` })))}</div>
      <p class="piccolo" data-s="s8a77e">${esc(certo ? (sett < 0 ? L({ it: "Il calo è statisticamente chiaro (l'intervallo non comprende lo zero).", en: "The loss is statistically clear (the interval does not include zero)." }) : L({ it: "L'aumento è statisticamente chiaro.", en: "The gain is statistically clear." })) : L({ it: "Per ora non si distingue un vero andamento dalle normali oscillazioni (acqua, sale, ciclo).", en: "For now a real trend cannot be told apart from normal swings (water, salt, cycle)." }))} ${esc(proiezione)}</p>`;
  }
  return `<form class="card" data-invia="aggiungiPeso">
    <div class="campi3"><label class="campo"><span>${esc(L({ it: "Data", en: "Date" }))}</span><input name="data" type="date" value="${oggi()}" max="${oggi()}" required></label>
    <label class="campo"><span>kg</span><input name="kg" type="number" step="0.1" min="25" max="300" inputmode="decimal" required></label>
    <label class="campo"><span>${esc(L({ it: "Vita cm", en: "Waist cm" }))}</span><input name="vita" type="number" step="0.5" min="40" max="200" inputmode="decimal"></label></div>
    <button class="btn primario pieno">${I.piu}${esc(t("aggiungi"))}</button></form>
  ${punti.length ? `<section class="card"><h3>${esc(t("peso"))} <span class="minimo">kg</span></h3>${graficoLinea({ punti, tendenza: tend.length > 2 ? tend : null, unita: "kg", decimali: 1 })}
    <p class="minimo"><span data-s="s6fb77">━</span> ${esc(L({ it: "pesate", en: "weigh-ins" }))} · <span data-s="s57b72">━</span> ${esc(L({ it: "tendenza smussata (le oscillazioni di un giorno contano poco)", en: "smoothed trend (one-day swings count little)" }))}</p>
    ${stat}
    <details class="tabella"><summary>${esc(L({ it: "Tabella", en: "Table" }))}</summary><table class="dati"><thead><tr><th>${esc(L({ it: "Data", en: "Date" }))}</th><th class="num">kg</th><th class="num">BMI</th><th></th></tr></thead><tbody>
      ${[...pesi].reverse().map((p) => `<tr><td>${esc(dataConAnno(p.data))}</td><td class="num">${num(p.kg, 1)}</td><td class="num">${s.profilo.altezza_cm ? num(bmi(p.kg, s.profilo.altezza_cm), 1) : "-"}</td><td class="num"><button class="btn-testo" data-az="eliminaPeso" data-id="${esc(p.id)}" aria-label="${esc(t("elimina"))}">${I.chiudi}</button></td></tr>`).join("")}
    </tbody></table></details></section>` : `<div class="card vuoto"><div class="grande">${esc(L({ it: "Nessuna pesata ancora", en: "No weigh-ins yet" }))}</div><p>${esc(L({ it: "Pesati sempre allo stesso modo: al mattino, dopo essere andata in bagno, prima di colazione.", en: "Weigh yourself the same way each time: in the morning, after the toilet, before breakfast." }))}</p></div>`}`;
}

/* ------------------------------------------------------- lab results */
function esami(s) {
  const bozza = s.bozze && s.bozze.importa;
  const perOrgano = ORGANI.map((o) => ({ o, ids: [...o.esami, ...(o.id === "kidneys" ? ["egfr_calc"] : [])] }));
  return `${bozza ? `<div class="card consiglio"><h3>${esc(L({ it: "Importazione da completare", en: "Import to finish" }))}</h3><p class="piccolo">${esc(L({ it: `Dal referto ${bozza.file || ""}: ${bozza.valori.length} valori in attesa.`, en: `From the report ${bozza.file || ""}: ${bozza.valori.length} values waiting.` }))}</p><button class="btn viola" data-az="apriImport">${I.documento}${esc(L({ it: "Controlla e salva", en: "Review and save" }))}</button></div>` : ""}
  <div class="riga wrap" data-s="sda12f">
    <button class="btn primario" data-az="nuovoEsame">${I.piu}${esc(L({ it: "Aggiungi un risultato", en: "Add a result" }))}</button>
    <label class="btn">${I.documento}${esc(L({ it: "Leggi un referto PDF", en: "Read a PDF report" }))}<input type="file" accept="application/pdf" hidden data-cambia="importaPdf"></label>
  </div>
  <p class="minimo">${esc(L({ it: "Il PDF viene letto sul telefono e non va da nessuna parte. Funziona con i referti che contengono testo; per le foto scansionate inserisci a mano. Scrivi sempre l'intervallo stampato dal tuo laboratorio: l'app non usa valori standard.", en: "The PDF is read on the phone and goes nowhere. It works with reports that contain text; for scanned photos enter values by hand. Always enter the range printed by your lab: the app uses no standard values." }))}</p>
  ${perOrgano.map(({ o, ids }) => {
    const righe = ids.map((id) => ({ id, serie: serieEsame(s, id) })).filter((x) => x.serie.length);
    if (!righe.length) return "";
    return `<h2 class="sez">${esc(L(o))}</h2><section class="card">${righe.map(({ id, serie }) => {
      const u = serie[serie.length - 1];
      const v = valutaEsame(u);
      return `<div class="marker-riga" data-az="apriEsame" data-id="${id}" role="button" tabindex="0"><div class="n">${esc(nomeEsame(id))}</div><div class="v">${esc(numAuto(u.valore))} <span class="minimo">${esc(u.unita)}</span></div><div>${statoHtml(v.stato)}</div><div class="minimo" data-s="s54c2a">${esc(dataBreve(u.data))} · ${serie.length}×</div></div>`;
    }).join("")}</section>`;
  }).join("") || `<div class="card vuoto"><div class="grande">${esc(L({ it: "Nessun esame ancora", en: "No results yet" }))}</div><p>${esc(L({ it: "I controlli che le linee guida suggeriscono per lupus renale e celiachia sono nella scheda Cibo, Regole.", en: "The checks the guidelines suggest for lupus nephritis and coeliac disease are in Food, Rules." }))}</p></div>`}`;
}

function formEsame(pre = {}) {
  const sel = pre.marker || "creatinine";
  const e = ESAME[sel];
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
  <h2>${esc(L({ it: "Nuovo risultato", en: "New result" }))}</h2>
  <form data-invia="salvaEsame">
    <label class="campo"><span>${esc(L({ it: "Esame", en: "Test" }))}</span><select name="marker" data-cambia="cambiaMarker">${ESAMI.map((x) => `<option value="${x.id}" ${x.id === sel ? "selected" : ""}>${esc(L(x))}</option>`).join("")}</select></label>
    <div class="campi2"><label class="campo"><span>${esc(L({ it: "Valore", en: "Value" }))}</span><input name="valore" type="number" step="any" inputmode="decimal" required value="${pre.valore != null ? pre.valore : ""}"></label>
    <label class="campo"><span>${esc(L({ it: "Unità", en: "Unit" }))}</span><select name="unita" id="sel-unita">${e.unita.map((u) => `<option ${pre.unita === u.u ? "selected" : ""}>${esc(u.u)}</option>`).join("")}</select></label></div>
    <div class="campi2"><label class="campo"><span>${esc(L({ it: "Minimo del laboratorio", en: "Lab minimum" }))}</span><input name="min" type="number" step="any" inputmode="decimal" value="${pre.min != null ? pre.min : ""}"></label>
    <label class="campo"><span>${esc(L({ it: "Massimo del laboratorio", en: "Lab maximum" }))}</span><input name="max" type="number" step="any" inputmode="decimal" value="${pre.max != null ? pre.max : ""}"></label></div>
    <label class="campo"><span>${esc(L({ it: "Data del prelievo", en: "Sample date" }))}</span><input name="data" type="date" value="${pre.data || oggi()}" max="${oggi()}" required></label>
    <p class="minimo" id="perche-esame">${esc(L(e.perche))}</p>
    <button class="btn primario pieno">${esc(t("salva"))}</button>
  </form>`;
}

function foglioEsame(id) {
  const s = S();
  const e = id === "egfr_calc" ? EGFR_CALC : ESAME[id];
  const serie = serieEsame(s, id);
  const gruppi = gruppiConfrontabili(serie);
  const grafici = gruppi.map((g0) => {
    let g = g0;
    const righe = g.righe;
    /* One unit only: plot exactly what she entered. Mixed units: convert to the canonical one. */
    const stessaUnita = righe.every((r) => r.unita === righe[0].unita);
    if (stessaUnita) g = { ...g, convertito: false };
    const unita = g.convertito ? (e.unita.find((u) => u.f === 1) || e.unita[0]).canonica || righe[0].unita : righe[0].unita;
    const punti = righe.map((r) => ({ x: r.data, y: g.convertito ? r.canon : r.valore, fuori: ["attenzione", "male"].includes(valutaEsame(r).stato) }));
    const ultimo = righe[righe.length - 1];
    const fattore = g.convertito ? (unitaDi(id, ultimo.unita) || { f: 1 }).f : 1;
    const banda = ultimo.min != null || ultimo.max != null ? [ultimo.min != null ? ultimo.min * fattore : null, ultimo.max != null ? ultimo.max * fattore : null] : null;
    const reg = regressione(righe.map((r) => ({ t: giorniDa(r.data, righe[0].data), y: g.convertito ? r.canon : r.valore })));
    let delta = "";
    if (righe.length >= 2) {
      const a = punti[punti.length - 2].y, b = punti[punti.length - 1].y;
      const pct = a ? ((b - a) / Math.abs(a)) * 100 : null;
      delta = L({ it: `Dall'ultimo prelievo: ${b - a >= 0 ? "+" : ""}${numAuto(b - a)} ${unita}${pct != null ? ` (${pct >= 0 ? "+" : ""}${num(pct, 1)}%)` : ""}.`, en: `Since the last sample: ${b - a >= 0 ? "+" : ""}${numAuto(b - a)} ${unita}${pct != null ? ` (${pct >= 0 ? "+" : ""}${num(pct, 1)}%)` : ""}.` });
      if ((id === "egfr" || id === "egfr_calc") && pct != null) delta += " " + L(Math.abs(pct) > 16.5 ? { it: "Supera il ±16,5% di variabilità normale dell'eGFR (meta-analisi): è probabilmente un cambiamento reale, da mostrare al medico.", en: "It exceeds the ±16.5% normal variability of eGFR (meta-analysis): probably a real change, to show the doctor." } : { it: "Resta entro il ±16,5% di variabilità normale dell'eGFR (meta-analisi): può essere solo oscillazione.", en: "It stays within the ±16.5% normal variability of eGFR (meta-analysis): it may be just fluctuation." });
    }
    const andamento = reg.insufficiente ? L({ it: "Andamento: servono almeno 3 risultati.", en: "Trend: at least 3 results are needed." }) : L({ it: `Andamento su ${reg.n} risultati: ${reg.b * 30 >= 0 ? "+" : ""}${numAuto(reg.b * 30)} ${unita} al mese (intervallo 95%: ${numAuto(reg.ic95[0] * 30)} a ${numAuto(reg.ic95[1] * 30)}).`, en: `Trend over ${reg.n} results: ${reg.b * 30 >= 0 ? "+" : ""}${numAuto(reg.b * 30)} ${unita} per month (95% interval: ${numAuto(reg.ic95[0] * 30)} to ${numAuto(reg.ic95[1] * 30)}).` });
    return `${gruppi.length > 1 ? `<p class="piccolo"><strong>${esc(unita)}</strong> ${esc(L({ it: "(unità non convertibili: serie separate)", en: "(units that cannot be converted: separate series)" }))}</p>` : ""}
      <p class="minimo">${esc(L({ it: "Grafico in", en: "Chart in" }))} ${esc(unita)}</p>
      ${graficoLinea({ punti, banda, unita, decimali: Math.abs(punti[punti.length - 1].y) < 10 ? 2 : 0, etichettaBanda: banda ? L({ it: "intervallo del tuo laboratorio", en: "your lab's range" }) : "" })}
      <p class="piccolo">${esc(delta)} ${esc(andamento)}</p>`;
  }).join("");
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
  <h2>${esc(L(e))}</h2><p class="piccolo muted">${esc(L(e.perche))}</p>
  ${grafici}
  ${id === "egfr_calc" ? `<p class="minimo">${esc(L({ it: "CKD-EPI 2021: 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^-1,200 × 0,9938^età × 1,012 (donne). Inker et al., NEJM 2021. Età dal tuo anno di nascita.", en: "CKD-EPI 2021: 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^-1.200 × 0.9938^age × 1.012 (women). Inker et al., NEJM 2021. Age from your birth year." }))}</p>` : ""}
  ${(e.note && !e.calcolato && lingua() === "en") ? `<p class="minimo">${esc(typeof e.note === "string" ? e.note : "")}</p>` : ""}
  <details class="tabella" open><summary>${esc(L({ it: "Tutti i risultati", en: "All results" }))}</summary><table class="dati"><thead><tr><th>${esc(L({ it: "Data", en: "Date" }))}</th><th class="num">${esc(L({ it: "Valore", en: "Value" }))}</th><th>${esc(L({ it: "Intervallo", en: "Range" }))}</th><th>${esc(L({ it: "Stato", en: "Status" }))}</th><th></th></tr></thead><tbody>
    ${[...serie].reverse().map((r) => `<tr><td>${esc(dataBreve(r.data))}</td><td class="num">${esc(numAuto(r.valore))} ${esc(r.unita)}</td><td>${r.min != null || r.max != null ? esc(`${r.min != null ? numAuto(r.min) : ""} - ${r.max != null ? numAuto(r.max) : ""}`) : "-"}</td><td>${statoHtml(valutaEsame(r).stato)}</td><td>${r.calcolato ? "" : `<button class="btn-testo" data-az="eliminaEsame" data-id="${esc(r.id)}" data-marker="${id}" aria-label="${esc(t("elimina"))}">${I.chiudi}</button>`}</td></tr>`).join("")}
  </tbody></table></details>
  ${e.fonti && e.fonti.length ? `<p class="fonte">${esc(t("fonte"))}: ${e.fonti.slice(0, 3).map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.editore || f.titolo)}${f.anno ? " " + f.anno : ""}</a>`).join(", ")}</p>` : ""}`;
}

function foglioImport() {
  const b = S().bozze.importa;
  if (!b) return `<p>${esc(L({ it: "Nessuna importazione in corso.", en: "No import in progress." }))}</p>`;
  return `<button class="icon-btn chiudi" data-az="chiudiFoglio" aria-label="${esc(t("chiudi"))}">${I.chiudi}</button>
  <h2>${esc(L({ it: "Controlla i valori letti", en: "Check the values read" }))}</h2>
  <p class="piccolo muted">${esc(L({ it: "Confronta ogni riga con il referto. Togli la spunta a ciò che è sbagliato o correggilo. La bozza resta salvata anche se chiudi l'app.", en: "Compare each row with the report. Untick what is wrong or correct it. The draft stays saved even if you close the app." }))}</p>
  <form data-invia="salvaImport">
    <label class="campo"><span>${esc(L({ it: "Data del prelievo", en: "Sample date" }))}</span><input name="data" type="date" value="${esc(b.data || oggi())}" max="${oggi()}" required></label>
    ${b.valori.map((v, i) => `<div class="card piatta" data-s="sc1385">
      <label class="interruttore" data-s="s18853"><strong>${esc(nomeEsame(v.id))}</strong><input type="checkbox" name="usa${i}" checked></label>
      <div class="minimo" data-s="sd4531">${esc(v.riga)}</div>
      <div class="campi3"><label class="campo"><span>${esc(L({ it: "Valore", en: "Value" }))}</span><input name="valore${i}" type="number" step="any" value="${v.valore}"></label>
      <label class="campo"><span>min</span><input name="min${i}" type="number" step="any" value="${v.min != null ? v.min : ""}"></label>
      <label class="campo"><span>max</span><input name="max${i}" type="number" step="any" value="${v.max != null ? v.max : ""}"></label></div>
      <label class="campo"><span>${esc(L({ it: "Unità", en: "Unit" }))}</span><select name="unita${i}">${(ESAME[v.id] ? ESAME[v.id].unita : []).map((u) => `<option ${u.u === v.unita ? "selected" : ""}>${esc(u.u)}</option>`).join("")}</select></label>
    </div>`).join("")}
    <div class="riga"><button class="btn primario">${esc(L({ it: "Salva i selezionati", en: "Save selected" }))}</button><button type="button" class="btn" data-az="scartaImport">${esc(L({ it: "Scarta", en: "Discard" }))}</button></div>
  </form>`;
}

/* ------------------------------------------------------------- diary */
function diario(s) {
  const giorni = Object.keys(s.diario).sort().reverse();
  const serie = (k) => giorni.map((d) => ({ d, v: s.diario[d][k] })).filter((x) => typeof x.v === "number");
  const aderenza = (d) => { const p = (s.diario[d] || {}).pasti; return p ? Object.values(p).filter(Boolean).length : null; };
  const coppie = [
    [{ it: "Pasti del piano segnati", en: "Plan meals ticked" }, (d) => aderenza(d), "energia"],
    [{ it: "Acqua (L)", en: "Water (L)" }, (d) => (s.diario[d] || {}).acqua, "energia"],
    [{ it: "Sonno", en: "Sleep" }, (d) => (s.diario[d] || {}).sonno, "energia"],
    [{ it: "Camminata (min)", en: "Walking (min)" }, (d) => (s.diario[d] || {}).passi, "dolori"],
    [{ it: "Pasti del piano segnati", en: "Plan meals ticked" }, (d) => aderenza(d), "intestino"],
  ];
  const corr = coppie.map(([lab, fx, ky]) => {
    const xs = [], ys = [];
    for (const d of giorni) { const x = fx(d), y = (s.diario[d] || {})[ky]; if (typeof x === "number" && typeof y === "number") { xs.push(x); ys.push(y); } }
    const r = xs.length >= MIN_GIORNI_CORRELAZIONE ? pearson(xs, ys) : null;
    return { lab, ky, n: xs.length, r };
  });
  const medie = ["energia", "umore", "sonno", "dolori", "intestino", "pelle", "nebbia"].map((k) => { const v = serie(k).filter((x) => x.d >= aggiungiGiorni(oggi(), -6)).map((x) => x.v); return { k, m: v.length ? media(v) : null, n: v.length }; });
  return `<section class="card"><h3>${esc(L({ it: "Ultimi 7 giorni", en: "Last 7 days" }))}</h3>
    <div class="contatori">${medie.map((x) => `<span>${esc(t(x.k))}</span><span>${x.m != null ? num(x.m, 1) : "-"} <span class="minimo">(${x.n})</span></span>`).join("")}</div></section>
  <h2 class="sez">${esc(L({ it: "Cosa va insieme a cosa", en: "What goes with what" }))}</h2>
  <section class="card">${corr.map((c) => `<div class="voce" data-s="sa0ec6"><div><strong>${esc(L(c.lab))}</strong> ${esc(L({ it: "e", en: "and" }))} <strong>${esc(t(c.ky))}</strong></div>
    <div class="piccolo muted">${c.r == null ? esc(L({ it: `Servono ${MIN_GIORNI_CORRELAZIONE} giorni con entrambi i valori (ora ${c.n}).`, en: `${MIN_GIORNI_CORRELAZIONE} days with both values are needed (now ${c.n}).` })) : esc(L({ it: `r = ${num(c.r, 2)} su ${c.n} giorni: relazione ${L(cohen(c.r))}${c.r > 0 ? " positiva" : " negativa"}.`, en: `r = ${num(c.r, 2)} over ${c.n} days: ${L(cohen(c.r))} ${c.r > 0 ? "positive" : "negative"} relationship.` }))}</div></div>`).join("")}
    <p class="minimo" data-s="s8a77e">${esc(L({ it: "Una correlazione non dimostra una causa: indica solo che due cose cambiano insieme nei tuoi giorni.", en: "A correlation does not prove a cause: it only shows two things change together on your days." }))}</p></section>
  <h2 class="sez">${esc(L({ it: "Giorni", en: "Days" }))}</h2>
  <section class="card">${giorni.slice(0, 30).map((d) => { const x = s.diario[d]; return `<div class="voce" data-s="s72143"><div class="riga tra"><strong>${esc(dataBreve(d))}</strong><span class="minimo">${esc([x.acqua != null ? `${num(x.acqua, 2)} L` : null, x.passi ? `${x.passi} min` : null, aderenza(d) != null ? `${aderenza(d)} ${L({ it: "pasti", en: "meals" })}` : null].filter(Boolean).join(" · "))}</span></div>${x.nota ? `<div class="piccolo muted">${esc(x.nota)}</div>` : ""}${x.glutine ? `<span class="etichetta attenzione">${esc(t("glutineSospetto"))}</span>` : ""}</div>`; }).join("") || `<p class="muted">${esc(L({ it: "Il diario si riempie dalla schermata Oggi.", en: "The diary fills up from the Today screen." }))}</p>`}</section>`;
}

/* ------------------------------------------------------------ backup */
function backup(s) {
  const giorni = s.ultimoBackup ? giorniDa(oggi(), s.ultimoBackup.slice(0, 10)) : null;
  return `<section class="card"><h3>${I.lucchetto} ${esc(L({ it: "Dove sono i tuoi dati", en: "Where your data is" }))}</h3>
    <p class="piccolo">${esc(L({ it: "Solo su questo telefono, in questo browser. Nessun server, nessun account, nessun tracciamento. La pagina può collegarsi solo al proprio indirizzo, e solo per la lista pubblica di ricette.", en: "Only on this phone, in this browser. No server, no account, no tracking. The page can connect only to its own address, and only for the public recipe list." }))}</p>
    <p class="piccolo">${esc(L({ it: "Per non perderli: aggiungi l'app alla schermata Home e fai un backup ogni tanto.", en: "To keep them safe: add the app to the Home screen and back up now and then." }))}</p>
    <p class="piccolo"><strong>${esc(L({ it: "Ultimo backup", en: "Last backup" }))}:</strong> ${s.ultimoBackup ? esc(dataConAnno(s.ultimoBackup.slice(0, 10))) + (giorni > 14 ? ` <span class="etichetta attenzione">${giorni} ${esc(L({ it: "giorni fa", en: "days ago" }))}</span>` : "") : esc(L({ it: "mai", en: "never" }))}</p></section>
  <form class="card" data-invia="esporta"><h3>${esc(L({ it: "Backup cifrato", en: "Encrypted backup" }))}</h3>
    <p class="piccolo muted">${esc(L({ it: "Il file viene cifrato sul telefono (AES-256). Senza la frase segreta nessuno può leggerlo, nemmeno tu: annotala in un posto sicuro.", en: "The file is encrypted on the phone (AES-256). Without the passphrase nobody can read it, not even you: note it somewhere safe." }))}</p>
    <label class="campo"><span>${esc(L({ it: "Frase segreta (almeno 10 caratteri)", en: "Passphrase (at least 10 characters)" }))}</span><input name="p1" type="password" minlength="10" autocomplete="new-password" required></label>
    <label class="campo"><span>${esc(L({ it: "Ripeti la frase", en: "Repeat the passphrase" }))}</span><input name="p2" type="password" minlength="10" autocomplete="new-password" required></label>
    <button class="btn primario pieno">${I.lucchetto}${esc(L({ it: "Crea il backup", en: "Create the backup" }))}</button></form>
  <form class="card" data-invia="importa"><h3>${esc(L({ it: "Ripristina un backup", en: "Restore a backup" }))}</h3>
    <label class="campo"><span>${esc(L({ it: "File di backup", en: "Backup file" }))}</span><input name="file" type="file" accept="application/json,.json" required></label>
    <label class="campo"><span>${esc(L({ it: "Frase segreta", en: "Passphrase" }))}</span><input name="p" type="password" autocomplete="current-password" required></label>
    <button class="btn pieno">${esc(L({ it: "Ripristina (sostituisce i dati attuali)", en: "Restore (replaces current data)" }))}</button></form>
  <form class="card" data-invia="cancella"><h3>${esc(L({ it: "Cancella tutto", en: "Delete everything" }))}</h3>
    <label class="campo"><span>${esc(L({ it: "Scrivi CANCELLA per confermare", en: "Type DELETE to confirm" }))}</span><input name="c" autocomplete="off" required></label>
    <button class="btn pieno" data-s="s83ef8">${esc(t("elimina"))}</button></form>`;
}

/* ----------------------------------------------------------- actions */
const nid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const numero = (x) => { if (x === "" || x == null) return null; const n = Number(String(x).replace(",", ".")); return Number.isFinite(n) ? n : null; };

registra({
  aggiungiPeso: (d, form) => {
    const f = new FormData(form);
    const kg = numero(f.get("kg"));
    if (!kg) return;
    cambia((s) => {
      s.pesi = s.pesi.filter((p) => p.data !== f.get("data"));
      s.pesi.push({ id: nid(), data: f.get("data"), kg, vita: numero(f.get("vita")) });
    });
    toast(L({ it: "Peso salvato", en: "Weight saved" }));
  },
  eliminaPeso: (d) => cambia((s) => { s.pesi = s.pesi.filter((p) => p.id !== d.id); }),
  nuovoEsame: () => apriFoglio(() => formEsame()),
  cambiaMarker: (d, el) => {
    const e = ESAME[el.value];
    const sel = document.getElementById("sel-unita");
    if (sel) sel.innerHTML = e.unita.map((u) => `<option>${esc(u.u)}</option>`).join("");
    const p = document.getElementById("perche-esame");
    if (p) p.textContent = L(e.perche);
  },
  salvaEsame: (d, form) => {
    const f = new FormData(form);
    const valore = numero(f.get("valore"));
    if (valore == null) return;
    cambia((s) => { s.esami.push({ id: nid(), data: f.get("data"), marker: f.get("marker"), valore, unita: f.get("unita"), min: numero(f.get("min")), max: numero(f.get("max")), fonte: "manuale" }); });
    chiudiFoglio();
    toast(L({ it: "Risultato salvato", en: "Result saved" }));
  },
  apriEsame: (d) => apriFoglio(() => foglioEsame(d.id)),
  eliminaEsame: (d) => cambia((s) => { s.esami = s.esami.filter((r) => r.id !== d.id); }),
  importaPdf: async (d, el) => {
    const file = el.files && el.files[0];
    if (!file) return;
    toast(L({ it: "Leggo il referto sul telefono...", en: "Reading the report on the phone..." }));
    try {
      const righe = await testoDaPdf(file);
      const r = trovaValori(righe);
      if (!r.valori.length) { toast(L({ it: "Nessun valore riconosciuto: forse è una scansione. Inserisci a mano.", en: "No value recognised: maybe a scan. Enter by hand." })); return; }
      cambia((s) => { s.bozze.importa = { file: file.name.slice(0, 80), data: r.data, valori: r.valori, creata: new Date().toISOString() }; });
      apriFoglio(() => foglioImport());
    } catch (e) {
      toast(L({ it: "Non riesco a leggere questo PDF.", en: "I cannot read this PDF." }));
    } finally { el.value = ""; }
  },
  apriImport: () => apriFoglio(() => foglioImport()),
  salvaImport: (d, form) => {
    const f = new FormData(form);
    const b = S().bozze.importa;
    if (!b) return;
    const nuovi = [];
    b.valori.forEach((v, i) => {
      if (!f.get("usa" + i)) return;
      const valore = numero(f.get("valore" + i));
      if (valore == null) return;
      nuovi.push({ id: nid(), data: f.get("data"), marker: v.id, valore, unita: f.get("unita" + i), min: numero(f.get("min" + i)), max: numero(f.get("max" + i)), fonte: "pdf" });
    });
    cambia((s) => { s.esami.push(...nuovi); delete s.bozze.importa; });
    chiudiFoglio();
    toast(L({ it: `${nuovi.length} risultati salvati`, en: `${nuovi.length} results saved` }));
  },
  scartaImport: () => { cambia((s) => { delete s.bozze.importa; }); chiudiFoglio(); },
  esporta: async (d, form) => {
    const f = new FormData(form);
    if (f.get("p1") !== f.get("p2")) { toast(L({ it: "Le due frasi non coincidono", en: "The two passphrases differ" })); return; }
    try { await esportaBackup(String(f.get("p1"))); toast(L({ it: "Backup creato", en: "Backup created" })); chiediMemoriaPersistente(); }
    catch (e) { toast(L({ it: "Backup non riuscito", en: "Backup failed" })); }
  },
  importa: async (d, form) => {
    const f = new FormData(form);
    const file = f.get("file");
    try { await importaBackup(await file.text(), String(f.get("p"))); toast(L({ it: "Dati ripristinati", en: "Data restored" })); }
    catch (e) { toast(L({ it: "Frase segreta sbagliata o file non valido", en: "Wrong passphrase or invalid file" })); }
  },
  cancella: (d, form) => {
    const c = String(new FormData(form).get("c") || "").trim().toUpperCase();
    if (c !== "CANCELLA" && c !== "DELETE") { toast(L({ it: "Scrivi CANCELLA", en: "Type DELETE" })); return; }
    cancellaTutto();
    toast(L({ it: "Tutti i dati cancellati da questo telefono", en: "All data deleted from this phone" }));
  },
});
void eta; void lingua; void CLINICA; void ridisegna;
